/* CAPA DE TRANSPORTE (receptora). Habla con el puente usando solo el contrato (ver contrato/protocolo.md).
 * No sabe nada de tipos de contenido: pide metadatos y bytes. Es la misma API que usa la emisora.
 * 2.4.0: guarda el TOKEN de vinculacion del celular y lo manda en cada peticion (cabecera x-token). */
(function () {
  'use strict';
  var TOKEN_KEY = 'ecoruta.puente.token', DEVICE_KEY = 'ecoruta.puente.device';

  // La app guarda la direccion del servidor (Ajustes > Servidor) como JSON en "ecoruta.server".
  function base() {
    try {
      var v = JSON.parse(localStorage.getItem('ecoruta.server') || '""');
      if (typeof v === 'string' && v.trim()) return v.trim().replace(/\/+$/, '');
    } catch (e) { /* valor dañado: se ignora */ }
    return '';
  }
  function setBase(url) { try { localStorage.setItem('ecoruta.server', JSON.stringify(String(url || '').trim().replace(/\/+$/, ''))); } catch (e) { /* sin almacenamiento */ } }
  function token() { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; } }
  function setToken(t) { try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch (e) { /* nada */ } }
  // Identificador de ESTE celular: si se vuelve a vincular, no gasta otro cupo del codigo.
  function device() {
    try {
      var d = localStorage.getItem(DEVICE_KEY);
      if (!d) {
        var a = new Uint8Array(12);
        (window.crypto || window.msCrypto).getRandomValues(a);
        d = Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
        localStorage.setItem(DEVICE_KEY, d);
      }
      return d;
    } catch (e) { return 'sin-id'; }
  }
  // Si no hay direccion guardada, solo sirve el mismo origen cuando la web viene de http(s) (navegador).
  function available() { return !!base() || /^https?:$/.test(location.protocol); }

  function request(url, init, timeout) {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, timeout || 8000);
    init = init || {}; init.cache = 'no-store'; init.signal = ctrl.signal;
    return fetch(url, init).then(function (r) {
      clearTimeout(t);
      if (!r.ok) { var err = new Error('HTTP ' + r.status); err.status = r.status; throw err; }
      return r;
    }, function (e) { clearTimeout(t); throw e; });
  }
  function get(path) {
    var h = {}, tk = token();
    if (tk) h['x-token'] = tk;
    return request(base() + path, { headers: h });
  }
  window.PuenteApi = {
    base: base,
    setBase: setBase,
    token: token,
    setToken: setToken,
    device: device,
    available: available,
    ping: function () { return get('/api/ping').then(function (r) { return r.json(); }); },
    list: function (since) { return get('/api/items?since=' + (since || 0)).then(function (r) { return r.json(); }); },
    blob: function (id) { return get('/api/items/' + encodeURIComponent(id)).then(function (r) { return r.blob(); }); },
    // Vinculacion: canjea el codigo por un token propio de este celular. "url" es la direccion del puente.
    pair: function (url, code) {
      return request(String(url).replace(/\/+$/, '') + '/api/pair', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, device: device() })
      }, 12000).then(function (r) { return r.json(); });
    },
    // 200 = vinculo vigente; 401 = desactivado o cambiado (error con .status).
    check: function () { return get('/api/pair/check').then(function (r) { return r.json(); }); }
  };
})();
