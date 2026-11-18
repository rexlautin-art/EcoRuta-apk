package com.ecoruta.libano;

/** Estado compartido entre la web (via NativeBridge) y el servicio de seguimiento. */
final class TrackingState {
    /** Ultimo camion publicado por la web, como JSON y sin la ruta. */
    static volatile String template = null;
    static volatile String base = "";
    static volatile String pin = "";
    /** Ultima vez (ms) que la web publico el camion por si sola. */
    static volatile long lastJsPostMs = 0L;

    private TrackingState() {
    }

    static void clear() {
        template = null;
        base = "";
        pin = "";
        lastJsPostMs = 0L;
    }
}
