/* EcoRuta: puente con la app Android.
 * Solo actua dentro de la app (cuando Android expone window.EcoNative); en un navegador normal no hace nada.
 *  - Reemplaza navigator.geolocation por el GPS nativo (mas fiable que el del WebView).
 *  - Avisa a Android del estado del camion para que siga publicando la posicion con la pantalla apagada. */
(function () {
  'use strict';
  var N = window.EcoNative;
  if (!N || typeof N.watch !== 'function') return;

  var nextId = 1;
  var subs = {};

  function int(v) {
    v = Number(v);
    return isFinite(v) && v > 0 ? Math.min(Math.round(v), 2147483000) : 0;
  }
  function position(lat, lng, acc, speed, heading, time) {
    return {
      coords: { latitude: lat, longitude: lng, accuracy: acc, altitude: null, altitudeAccuracy: null, heading: heading, speed: speed },
      timestamp: time
    };
  }
  function geoError(code, msg) {
    return { code: code, message: msg || '', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 };
  }
  function rethrow(e) { setTimeout(function () { throw e; }, 0); }

  // Android llama a estas dos funciones con cada posicion o error.
  window.__ecoGeo = {
    pos: function (id, lat, lng, acc, speed, heading, time) {
      var s = subs[id];
      if (!s) return;
      if (s.once) delete subs[id];
      try { s.ok(position(lat, lng, acc, speed, heading, time)); } catch (e) { rethrow(e); }
    },
    err: function (id, code, msg) {
      var s = subs[id];
      if (!s) return;
      if (s.once) delete subs[id];
      if (typeof s.fail === 'function') {
        try { s.fail(geoError(code, msg)); } catch (e) { rethrow(e); }
      }
    }
  };

  function start(ok, fail, opts, once) {
    if (typeof ok !== 'function') throw new TypeError('successCallback requerido');
    var id = nextId++;
    subs[id] = { ok: ok, fail: fail, once: once };
    if (once) N.once(id, int(opts && opts.timeout), int(opts && opts.maximumAge));
    else N.watch(id, !!(opts && opts.enableHighAccuracy));
    return id;
  }

  var geo = {
    getCurrentPosition: function (ok, fail, opts) { start(ok, fail, opts, true); },
    watchPosition: function (ok, fail, opts) { return start(ok, fail, opts, false); },
    clearWatch: function (id) {
      if (subs[id]) { delete subs[id]; N.clear(id); }
    }
  };
  try {
    Object.defineProperty(navigator, 'geolocation', { value: geo, configurable: true });
  } catch (e) {
    try { navigator.geolocation = geo; } catch (e2) { /* sin cambios */ }
  }

  // La app llama a esto cada vez que publica el camion (cada ~4 s).
  window.__ecoTrack = function (truck, pin, base) {
    try {
      if (!truck || truck.source !== 'gps' || truck.status === 'fuera') { N.stopTracking(); return; }
      var t = {};
      for (var k in truck) { if (k !== 'geometry') t[k] = truck[k]; }
      N.truck(JSON.stringify(t), base || '', pin || '');
    } catch (e) { /* el puente nunca debe romper la app */ }
  };
  window.__ecoStop = function () {
    try { N.stopTracking(); } catch (e) { /* idem */ }
  };
})();
