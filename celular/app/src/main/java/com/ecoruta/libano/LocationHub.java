package com.ecoruta.libano;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Looper;
import android.os.SystemClock;

import java.util.ArrayList;
import java.util.List;

/**
 * Reparte las posiciones del GPS a varios oyentes (la web y el servicio de seguimiento)
 * con un unico registro en Android. Todos los metodos se llaman desde el hilo principal.
 */
final class LocationHub {

    interface Listener {
        void onLocation(Location location);
    }

    private static LocationHub instance;

    static synchronized LocationHub get(Context context) {
        if (instance == null) instance = new LocationHub(context.getApplicationContext());
        return instance;
    }

    static boolean hasPermission(Context context) {
        return context.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                || context.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    private final LocationManager manager;
    private final List<Listener> listeners = new ArrayList<>();
    private Location last;
    private long lastGpsElapsedMs = Long.MIN_VALUE / 2;
    private boolean registered = false;

    private final LocationListener androidListener = new LocationListener() {
        @Override
        public void onLocationChanged(Location location) {
            dispatch(location);
        }

        @Override
        public void onProviderEnabled(String provider) {
        }

        @Override
        public void onProviderDisabled(String provider) {
        }

        @Override
        @SuppressWarnings("deprecation")
        public void onStatusChanged(String provider, int status, Bundle extras) {
        }
    };

    private LocationHub(Context appContext) {
        manager = (LocationManager) appContext.getSystemService(Context.LOCATION_SERVICE);
    }

    void add(Listener listener) {
        if (!listeners.contains(listener)) listeners.add(listener);
        if (!registered) register();
    }

    void remove(Listener listener) {
        listeners.remove(listener);
        if (listeners.isEmpty() && registered) unregister();
    }

    boolean anyProviderEnabled() {
        try {
            return manager.isProviderEnabled(LocationManager.GPS_PROVIDER)
                    || manager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
        } catch (RuntimeException e) {
            return false;
        }
    }

    /** Ultima posicion conocida si no tiene mas de maxAgeMs; si no, null. */
    @SuppressLint("MissingPermission")
    Location freshFix(long maxAgeMs) {
        if (maxAgeMs <= 0) return null;
        Location best = ageMs(last) <= maxAgeMs ? last : null;
        if (best == null) {
            try {
                String[] providers = {LocationManager.GPS_PROVIDER, LocationManager.NETWORK_PROVIDER};
                for (String p : providers) {
                    Location l = manager.getLastKnownLocation(p);
                    if (l != null && ageMs(l) <= maxAgeMs && (best == null || l.getTime() > best.getTime())) best = l;
                }
            } catch (SecurityException | IllegalArgumentException ignored) {
                // sin permiso o sin ese proveedor
            }
        }
        return best;
    }

    private static long ageMs(Location l) {
        if (l == null) return Long.MAX_VALUE;
        return (SystemClock.elapsedRealtimeNanos() - l.getElapsedRealtimeNanos()) / 1000000L;
    }

    @SuppressLint("MissingPermission")
    private void register() {
        boolean any = false;
        try {
            manager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000L, 0f, androidListener, Looper.getMainLooper());
            any = true;
        } catch (SecurityException | IllegalArgumentException ignored) {
            // sin permiso o sin GPS en el equipo
        }
        try {
            manager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 3000L, 0f, androidListener, Looper.getMainLooper());
            any = true;
        } catch (SecurityException | IllegalArgumentException ignored) {
            // sin permiso o sin ubicacion por red
        }
        registered = any;
    }

    private void unregister() {
        try {
            manager.removeUpdates(androidListener);
        } catch (SecurityException ignored) {
            // nada que quitar
        }
        registered = false;
    }

    private void dispatch(Location loc) {
        if (loc == null) return;
        long now = SystemClock.elapsedRealtime();
        if (LocationManager.GPS_PROVIDER.equals(loc.getProvider())) {
            lastGpsElapsedMs = now;
        } else if (now - lastGpsElapsedMs < 10000L) {
            return; // hay un GPS reciente: se ignora la ubicacion por red, menos precisa
        }
        last = loc;
        for (Listener l : new ArrayList<>(listeners)) l.onLocation(loc);
    }
}
