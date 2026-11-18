/* EcoRuta: avisos extra de la app.
 *  - Aviso rojo cuando el servidor rechaza el PIN del conductor (sin esto el conductor creeria que lo ven).
 *  - Prueba de conexion con mensajes claros (Ajustes > Servidor). */
(function () {
  'use strict';

  // ---------- PIN incorrecto ----------
  var FRESH_MS = 15000;      // el aviso sigue visible mientras haya rechazos recientes
  var DISMISS_MS = 60000;    // "Entendido" lo oculta un minuto
  var bad = {};              // origen del rechazo -> hora del ultimo rechazo
  var dismissedUntil = 0;
  var banner = null;
  var timer = null;

  function active() {
    var now = Date.now();
    for (var k in bad) { if (now - bad[k] < FRESH_MS) return true; }
    return false;
  }
  function ensureBanner() {
    if (banner || !document.body) return banner;
    banner = document.createElement('div');
    banner.id = 'eco-pin-banner';
    banner.setAttribute('role', 'alert');
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:100000;display:none;gap:12px;align-items:center;' +
      'background:#b3261e;color:#fff;font:600 14px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
      'padding:calc(10px + env(safe-area-inset-top,0px)) 14px 10px;box-shadow:0 2px 12px rgba(0,0,0,.3)';
    var text = document.createElement('span');
    text.style.flex = '1';
    text.textContent = 'PIN incorrecto: los ciudadanos NO ven tu camión y tus alertas no llegan a la central. ' +
      'Pulsa Salir y entra de nuevo con el PIN que te dio la central.';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Entendido';
    btn.style.cssText = 'flex:none;background:#fff;color:#b3261e;border:0;border-radius:8px;padding:6px 10px;font:inherit;cursor:pointer';
    btn.addEventListener('click', function () { dismissedUntil = Date.now() + DISMISS_MS; render(); });
    banner.appendChild(text);
    banner.appendChild(btn);
    document.body.appendChild(banner);
    return banner;
  }
  function render() {
    var show = active() && Date.now() > dismissedUntil;
    if (!show && !banner) return;
    var b = ensureBanner();
    if (b) b.style.display = show ? 'flex' : 'none';
  }
  window.__ecoPinBad = function (kind) {
    bad[kind || 'x'] = Date.now();
    render();
    if (!timer) timer = setInterval(render, 3000);
  };
  window.__ecoPinOk = function (kind) {
    if (bad[kind || 'x'] !== undefined) { delete bad[kind || 'x']; render(); }
  };

  // ---------- Prueba de conexion ----------
  window.__ecoProbe = function (addr) {
    addr = String(addr || '').trim();
    if (addr && !/^https?:\/\//i.test(addr)) addr = 'http://' + addr;
    addr = addr.replace(/\/+$/, '');
    var webHere = /^https?:$/.test(location.protocol);
    if (!addr && !webHere) {
      return Promise.resolve({ ok: false, msg: 'Escribe la dirección que muestra la ventana de EcoRuta en el PC, por ejemplo http://192.168.1.20:3000' });
    }
    if (addr) {
      var valid = true;
      try {
        var host = new URL(addr).hostname;
        // nombre de equipo, IPv4 o IPv6 entre corchetes; nada de espacios ni simbolos raros
        valid = /^([A-Za-z0-9-]+\.)*[A-Za-z0-9-]+$/.test(host) || /^\[[0-9A-Fa-f:.]+\]$/.test(host);
      } catch (e) { valid = false; }
      if (!valid) {
        return Promise.resolve({ ok: false, msg: 'La dirección no es válida. Debe verse así: http://192.168.1.20:3000' });
      }
    }
    var notEcoruta = { ok: false, addr: addr, msg: 'La dirección responde, pero no parece ser el servidor de EcoRuta. Revisa que sea la que muestra su ventana.' };
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, 5000);
    return fetch(addr + '/api/status', { signal: ctrl.signal, cache: 'no-store' }).then(function (r) {
      clearTimeout(t);
      if (!r.ok) return notEcoruta;
      return r.json().then(function (j) {
        if (!j || j.ok !== true) return notEcoruta;
        return { ok: true, addr: addr, pinRequired: !!j.pinRequired, msg: 'Servidor conectado' + (j.pinRequired ? ' (los conductores necesitan PIN).' : '.') };
      }, function () { return notEcoruta; });
    }, function () {
      clearTimeout(t);
      return { ok: false, addr: addr, msg: 'No llegué al servidor. Revisa que el celular y el PC estén en el mismo Wi-Fi, que la ventana de EcoRuta siga abierta en el PC y que Windows permita las redes privadas en el Firewall.' };
    });
  };
})();
