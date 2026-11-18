package com.ecoruta.libano;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Decide si la peticion de una tesela del mapa se puede responder con un archivo guardado dentro de la app. */
final class TileAssets {

    // http(s)://tile.openstreetmap.org/z/x/y.png   o   http(s)://cualquier-servidor/tiles/z/x/y.png
    private static final Pattern TILE =
            Pattern.compile("^https?://([^/]+)(/tiles)?/(\\d{1,2})/(\\d{1,7})/(\\d{1,7})\\.png(?:\\?.*)?$");

    private TileAssets() {
    }

    /** Ruta dentro de assets (por ejemplo "tiles/16/9551/15936.png") o null si no es una tesela nuestra. */
    static String assetPathFor(String url) {
        if (url == null) return null;
        Matcher m = TILE.matcher(url);
        if (!m.matches()) return null;
        boolean osm = m.group(1).equalsIgnoreCase("tile.openstreetmap.org");
        if (!osm && m.group(2) == null) return null;
        int z = Integer.parseInt(m.group(3));
        if (z < 12 || z > 18) return null;
        return "tiles/" + z + "/" + Integer.parseInt(m.group(4)) + "/" + Integer.parseInt(m.group(5)) + ".png";
    }
}
