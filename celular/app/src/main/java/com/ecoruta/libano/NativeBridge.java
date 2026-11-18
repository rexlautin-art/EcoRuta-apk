package com.ecoruta.libano;

import android.location.Location;
import android.os.Handler;
import android.os.Looper;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Puente entre la web y Android (se ve en JavaScript como window.EcoNative).
 * Da a la web el GPS nativo y le permite avisar del estado del camion para el seguimiento
 * en segundo plano. Los metodos @JavascriptInterface llegan desde un hilo del WebView, asi que
 * todo el trabajo real se pasa al hilo principal.
 */
final class NativeBridge {

    private final MainActivity activity;
    private final WebView webView;
    private final LocationHub hub;
    private final Handler main = new Handler(Looper.getMainLooper());
    private final Map<Integer, Watch> watches = new HashMap<>(); // solo hilo principal
    private boolean destroyed = false;

    NativeBridge(MainActivity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
        this.hub = LocationHub.get(activity);
    }

    /** Una suscripcion de la web a la ubicacion (continua o de una sola lectura). */
    private final class Watch implements LocationHub.Listener {
        final int id;
        final boolean once;
        Runnable timeout;

        Watch(int id, boolean once) {
            this.id = id;
            this.once = once;
        }

        @Override
        public void onLocation(Location location) {
            push(id, location);
            if (once) finish();
        }

        void stop() {
            if (timeout != null) main.removeCallbacks(timeout);
            hub.remove(this);
        }

        void finish() {
            stop();
            if (watches.get(id) == this) watches.remove(id);
        }
    }

    // ---------- API para JavaScript ----------

    @JavascriptInterface
    public void watch(final int id, final boolean highAccuracy) {
        main.post(new Runnable() {
            @Override
            public void run() {
                startWatch(id, false, 0, 0);
            }
        });
    }

    @JavascriptInterface
    public void once(final int id, final int timeoutMs, final int maxAgeMs) {
        main.post(new Runnable() {
            @Override
            public void run() {
                startWatch(id, true, timeoutMs, maxAgeMs);
            }
        });
    }

    @JavascriptInterface
    public void clear(final int id) {
        main.post(new Runnable() {
            @Override
            public void run() {
                Watch w = watches.get(id);
                if (w != null) w.finish();
            }
        });
    }

    /** La web publico el camion: se guarda para que el servicio pueda seguir publicando sin ella. */
    @JavascriptInterface
    public void truck(String json, String base, String pin) {
        if (json == null || json.length() > 200000) return;
        String b = base == null ? "" : base.trim();
        if (!(b.isEmpty() || b.startsWith("http://") || b.startsWith("https://"))) b = "";
        TrackingState.template = json;
        TrackingState.base = b;
        TrackingState.pin = pin == null ? "" : pin;
        TrackingState.lastJsPostMs = System.currentTimeMillis();
        if (!TrackingService.isRunning()) {
            main.post(new Runnable() {
                @Override
                public void run() {
                    if (destroyed) return;
                    activity.askNotificationPermissionOnce();
                    TrackingService.start(activity);
                }
            });
        }
    }

    @JavascriptInterface
    public void stopTracking() {
        if (!TrackingService.isRunning()) return;
        main.post(new Runnable() {
            @Override
            public void run() {
                TrackingService.stop(activity);
            }
        });
    }

    /** La web cambio de tema claro/oscuro: se ajustan fondo y barras del sistema. */
    @JavascriptInterface
    public void setDark(final boolean dark) {
        main.post(new Runnable() {
            @Override
            public void run() {
                if (!destroyed) activity.applyTheme(dark);
            }
        });
    }

    /** Pantalla encendida mientras haya una ruta activa. */
    @JavascriptInterface
    public void keepAwake(final boolean on) {
        main.post(new Runnable() {
            @Override
            public void run() {
                if (!destroyed) activity.keepScreenOn(on);
            }
        });
    }

    @JavascriptInterface
    public int version() {
        return 2;
    }

    // ---------- Interno (hilo principal) ----------

    private void startWatch(final int id, final boolean once, final int timeoutMs, final int maxAgeMs) {
        if (destroyed) return;
        if (!LocationHub.hasPermission(activity)) {
            activity.askLocationPermission(new MainActivity.PermissionCallback() {
                @Override
                public void result(boolean granted) {
                    if (granted) startWatch(id, once, timeoutMs, maxAgeMs);
                    else pushError(id, 1, "permiso denegado");
                }
            });
            return;
        }
        if (once) {
            Location fix = hub.freshFix(maxAgeMs);
            if (fix != null) {
                push(id, fix);
                return;
            }
        }
        if (!hub.anyProviderEnabled()) {
            pushError(id, 2, "ubicacion desactivada");
            if (once) return; // en un seguimiento continuo se sigue esperando por si la activan
        }
        Watch old = watches.remove(id);
        if (old != null) old.stop();
        final Watch w = new Watch(id, once);
        watches.put(id, w);
        hub.add(w);
        if (once) {
            final int limit = timeoutMs > 0 ? timeoutMs : 60000;
            w.timeout = new Runnable() {
                @Override
                public void run() {
                    if (watches.get(id) == w) {
                        w.finish();
                        pushError(id, 3, "tiempo agotado");
                    }
                }
            };
            main.postDelayed(w.timeout, limit);
        }
    }

    private void push(int id, Location loc) {
        String speed = loc.hasSpeed() ? String.format(Locale.US, "%.2f", loc.getSpeed()) : "null";
        String heading = loc.hasBearing() ? String.format(Locale.US, "%.1f", loc.getBearing()) : "null";
        float accuracy = loc.hasAccuracy() ? loc.getAccuracy() : 0f;
        eval(String.format(Locale.US, "window.__ecoGeo&&window.__ecoGeo.pos(%d,%.7f,%.7f,%.1f,%s,%s,%d)",
                id, loc.getLatitude(), loc.getLongitude(), accuracy, speed, heading, loc.getTime()));
    }

    private void pushError(int id, int code, String message) {
        eval(String.format(Locale.US, "window.__ecoGeo&&window.__ecoGeo.err(%d,%d,\"%s\")", id, code, message));
    }

    private void eval(String js) {
        if (!destroyed) webView.evaluateJavascript(js, null);
    }

    void destroy() {
        destroyed = true;
        for (Watch w : new ArrayList<>(watches.values())) w.stop();
        watches.clear();
    }
}
