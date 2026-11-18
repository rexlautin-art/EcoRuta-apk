package com.ecoruta.libano;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.location.Location;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Servicio en primer plano (con notificacion fija) que mantiene viva la app mientras el conductor
 * comparte la ubicacion. Si la web deja de publicar (pantalla apagada o app minimizada, el WebView
 * se ralentiza), este servicio publica el camion directamente con la ultima informacion conocida
 * y la posicion nueva del GPS.
 */
public class TrackingService extends Service implements LocationHub.Listener {

    static final String ACTION_STOP = "com.ecoruta.libano.STOP_TRACKING";
    private static final String CHANNEL_ID = "tracking";
    private static final int NOTIFICATION_ID = 4101;
    private static final long JS_STALE_MS = 9000L;
    private static final long MIN_POST_INTERVAL_MS = 4000L;
    private static final long WAKE_LOCK_MS = 12L * 60L * 60L * 1000L;

    private static volatile boolean running = false;
    /** El servidor rechazo el PIN: se avisa en la notificacion, porque en segundo plano la web no puede mostrarlo. */
    private volatile boolean pinRejected = false;

    static boolean isRunning() {
        return running;
    }

    /** Inicia el servicio. Devuelve false si no se pudo (sin permiso de ubicacion o app en segundo plano). */
    static boolean start(Context context) {
        if (running) return true;
        if (!LocationHub.hasPermission(context)) return false;
        try {
            Intent intent = new Intent(context, TrackingService.class);
            if (Build.VERSION.SDK_INT >= 26) {
                context.startForegroundService(intent);
            } else {
                context.startService(intent);
            }
            return true;
        } catch (RuntimeException e) {
            return false; // p. ej. no se permite iniciar servicios en primer plano desde segundo plano
        }
    }

    static void stop(Context context) {
        context.stopService(new Intent(context, TrackingService.class));
    }

    private ExecutorService net;
    private PowerManager.WakeLock wakeLock;
    private LocationHub hub;
    private volatile boolean posting = false;
    private long lastNativePostMs = 0L;
    private boolean started = false;

    @Override
    public void onCreate() {
        super.onCreate();
        running = true;
        createChannel();
        if (!startInForeground()) {
            stopSelf();
            return;
        }
        started = true;
        net = Executors.newSingleThreadExecutor();
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (pm != null) {
            wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "EcoRuta:tracking");
            wakeLock.setReferenceCounted(false);
            wakeLock.acquire(WAKE_LOCK_MS);
        }
        hub = LocationHub.get(this);
        hub.add(this);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_STOP.equals(intent.getAction())) {
            stopSelf();
        }
        return START_NOT_STICKY;
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        // El conductor cerro la app desde recientes: se deja de compartir la ubicacion.
        stopSelf();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        running = false;
        if (hub != null) hub.remove(this);
        final String template = TrackingState.template;
        final String base = TrackingState.base;
        final String pin = TrackingState.pin;
        if (net != null) {
            if (started && template != null && !base.isEmpty()) {
                net.execute(new Runnable() {
                    @Override
                    public void run() {
                        postTruck(template, base, pin, null, true);
                    }
                });
            }
            net.shutdown(); // deja terminar el aviso de "fuera"
        }
        if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
        TrackingState.clear();
        super.onDestroy();
    }

    @Override
    public void onLocation(Location location) {
        long now = System.currentTimeMillis();
        if (now - TrackingState.lastJsPostMs < JS_STALE_MS) return; // la web esta publicando
        if (now - lastNativePostMs < MIN_POST_INTERVAL_MS) return;
        final String template = TrackingState.template;
        final String base = TrackingState.base;
        final String pin = TrackingState.pin;
        if (template == null || base.isEmpty() || posting || net == null) return;
        lastNativePostMs = now;
        posting = true;
        final Location copy = new Location(location);
        net.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    updatePinState(postTruck(template, base, pin, copy, false));
                } finally {
                    posting = false;
                }
            }
        });
    }

    /** Publica el camion en el servidor (se ejecuta fuera del hilo principal). */
    private int postTruck(String template, String base, String pin, Location loc, boolean gone) {
        HttpURLConnection conn = null;
        int code = -1;
        try {
            JSONObject o = new JSONObject(template);
            o.put("ts", System.currentTimeMillis());
            if (loc != null) {
                o.put("lat", loc.getLatitude());
                o.put("lng", loc.getLongitude());
                Object speed = loc.hasSpeed() ? (Object) Double.valueOf(loc.getSpeed()) : JSONObject.NULL;
                o.put("speed", speed);
                o.put("heading", loc.hasBearing() ? (double) loc.getBearing() : 0.0);
            }
            if (gone) o.put("status", "fuera");
            byte[] body = o.toString().getBytes(StandardCharsets.UTF_8);
            conn = (HttpURLConnection) URI.create(base + "/api/truck").toURL().openConnection();
            conn.setRequestMethod("POST");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
            if (!pin.isEmpty()) conn.setRequestProperty("x-pin", pin);
            conn.setFixedLengthStreamingMode(body.length);
            OutputStream out = conn.getOutputStream();
            try {
                out.write(body);
            } finally {
                out.close();
            }
            code = conn.getResponseCode();
        } catch (Exception ignored) {
            // sin red: se reintenta con la siguiente posicion
        } finally {
            if (conn != null) conn.disconnect();
        }
        return code;
    }

    private void updatePinState(int code) {
        boolean bad = code == 401;
        if (!bad && !(code >= 200 && code < 300)) return; // sin red u otro error: no cambia nada
        if (bad == pinRejected) return;
        pinRejected = bad;
        NotificationManager nm = getSystemService(NotificationManager.class);
        if (nm != null) nm.notify(NOTIFICATION_ID, buildNotification());
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID, getString(R.string.tracking_channel), NotificationManager.IMPORTANCE_LOW);
        NotificationManager nm = getSystemService(NotificationManager.class);
        if (nm != null) nm.createNotificationChannel(channel);
    }

    private boolean startInForeground() {
        Notification notification = buildNotification();
        try {
            if (Build.VERSION.SDK_INT >= 29) {
                startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION);
            } else {
                startForeground(NOTIFICATION_ID, notification);
            }
            return true;
        } catch (RuntimeException e) {
            return false; // p. ej. SecurityException si falta el permiso de ubicacion
        }
    }

    @SuppressWarnings("deprecation")
    private Notification buildNotification() {
        Intent open = new Intent(this, MainActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT);
        PendingIntent openPi = PendingIntent.getActivity(
                this, 0, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        Intent stop = new Intent(this, TrackingService.class);
        stop.setAction(ACTION_STOP);
        PendingIntent stopPi = PendingIntent.getService(
                this, 1, stop, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        Notification.Builder builder = Build.VERSION.SDK_INT >= 26
                ? new Notification.Builder(this, CHANNEL_ID)
                : new Notification.Builder(this);
        builder.setSmallIcon(R.drawable.ic_stat_truck)
                .setContentTitle(getString(R.string.tracking_title))
                .setContentText(getString(pinRejected ? R.string.tracking_pin_bad : R.string.tracking_text))
                .setContentIntent(openPi)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .addAction(0, getString(R.string.tracking_stop), stopPi);
        return builder.build();
    }
}
