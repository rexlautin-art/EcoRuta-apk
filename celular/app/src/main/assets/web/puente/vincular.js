/* VINCULAR (receptora, 2.4.0): tutorial de primer inicio + pantalla para conectar el celular con la central.
 *  - La primera vez (sin servidor guardado) se abre sola con un tutorial de 3 pasos.
 *  - El celular pega el mensaje que copia el panel del PC ("Conectar celulares") o escribe enlace y codigo.
 *  - Canjea el codigo en /api/pair, guarda direccion + token y recarga la app.
 *  - Si la central desactiva el codigo (401) o el enlace cambia, vuelve a abrirse con una explicacion.
 * Textos con textContent (nunca innerHTML con datos ajenos). */
(function () {
  'use strict';
  var TUT_KEY = 'ecoruta.puente.tutorial';            // "hecho" | "omitido"
  var root, step = 0, chip, urlIn, codeIn, msgEl, goBtn, dots = [], pages = [], notice = '';

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* nada */ } }
  function linked() { return !!(window.PuenteApi.base() && window.PuenteApi.token()); }

  // Acepta el mensaje completo del PC, o solo el enlace, o solo el codigo.
  function parse(text) {
    var t = String(text || '');
    var u = /https?:\/\/[^\s"'<>]+/i.exec(t);
    // Primero el formato exacto ECO-XXXX-XXXX; si no, ECO + separador (asi "EcoRuta abre" no se confunde con un codigo).
    var c = /\bECO-([A-Z0-9]{4})-([A-Z0-9]{4})\b/i.exec(t) || /\bECO[\s-]+([A-Z0-9]{4})[\s-]+([A-Z0-9]{4})\b/i.exec(t);
    return { url: u ? u[0].replace(/[.,;)]+$/, '') : '', code: c ? ('ECO-' + c[1] + '-' + c[2]).toUpperCase() : '' };
  }
  function normUrl(v) {
    v = String(v || '').trim().replace(/\/+$/, '');
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    return (/^(\d{1,3}\.){3}\d{1,3}|^localhost/i.test(v) ? 'http://' : 'https://') + v;
  }

  function css() {
    var s = document.createElement('style');
    s.textContent =
      '#vc-chip{position:fixed;z-index:9000;left:12px;bottom:calc(88px + env(safe-area-inset-bottom,0px));display:none;align-items:center;gap:6px;' +
      'border:1px solid var(--line,#e3e8e4);background:var(--surface,#fff);color:var(--ink,#17211c);border-radius:22px;padding:9px 14px;' +
      'box-shadow:var(--float,0 4px 14px rgba(0,0,0,.18));font:600 13px Poppins,system-ui,sans-serif;cursor:pointer}' +
      '#vc-chip.on{display:flex}' +
      '#vc-root{position:fixed;z-index:9800;inset:0;display:none;align-items:flex-end;justify-content:center;background:rgba(10,20,15,.55)}' +
      '#vc-root.on{display:flex}' +
      '#vc-sheet{width:100%;max-width:480px;max-height:94vh;overflow:auto;box-sizing:border-box;background:var(--bg,#f6f7f5);color:var(--ink,#17211c);' +
      'border-radius:22px 22px 0 0;padding:20px 20px calc(20px + env(safe-area-inset-bottom,0px));font:400 15px/1.45 Poppins,system-ui,sans-serif}' +
      '#vc-top{display:flex;align-items:center;gap:8px;margin-bottom:6px}' +
      '#vc-dots{flex:1;display:flex;gap:6px}' +
      '.vc-dot{height:5px;flex:1;border-radius:3px;background:var(--line,#e3e8e4)}.vc-dot.on{background:var(--accent,#2d6a4f)}' +
      '#vc-skip{border:0;background:none;color:var(--muted,#5f6b64);font:600 13px Poppins,system-ui,sans-serif;cursor:pointer;padding:6px}' +
      '.vc-ico{font-size:42px;line-height:1;margin:10px 0 6px}' +
      '.vc-h{margin:0 0 6px;font:700 20px/1.25 Poppins,system-ui,sans-serif}' +
      '.vc-p{margin:0 0 10px;color:var(--muted,#5f6b64)}' +
      '.vc-steps{margin:8px 0 14px;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}' +
      '.vc-steps li{display:flex;gap:10px;align-items:flex-start;background:var(--surface,#fff);border:1px solid var(--line,#e3e8e4);border-radius:12px;padding:10px 12px}' +
      '.vc-n{flex:none;width:24px;height:24px;border-radius:50%;background:var(--accent-soft,#e5efe9);color:var(--accent,#2d6a4f);font:700 13px/24px Poppins,system-ui,sans-serif;text-align:center}' +
      '.vc-lbl{display:block;margin:10px 0 4px;font:600 12px Poppins,system-ui,sans-serif;color:var(--muted,#5f6b64)}' +
      '.vc-in{width:100%;box-sizing:border-box;border:1px solid var(--line,#e3e8e4);background:var(--surface,#fff);color:var(--ink,#17211c);border-radius:10px;padding:11px 12px;font:500 14px ui-monospace,Menlo,Consolas,monospace}' +
      '.vc-btns{display:flex;gap:10px;margin-top:14px}' +
      '.vc-btn{flex:1;border:0;border-radius:12px;padding:13px 14px;background:var(--accent,#2d6a4f);color:var(--accent-ink,#fff);font:600 15px Poppins,system-ui,sans-serif;cursor:pointer}' +
      '.vc-btn.ghost{background:var(--soft,#eef1ee);color:var(--ink,#17211c)}.vc-btn:disabled{opacity:.55;cursor:default}' +
      '#vc-msg{min-height:20px;margin-top:10px;font-size:13px;font-weight:600}' +
      '.vc-ok{color:var(--accent,#2d6a4f)}.vc-bad{color:var(--bad,#b3342b)}.vc-info{color:var(--muted,#5f6b64)}' +
      '.vc-note{background:var(--warn-soft,#fdf1d6);color:var(--warn,#8f5600);border-radius:10px;padding:9px 12px;font-size:13px;font-weight:600;margin:8px 0}';
    document.head.appendChild(s);
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function steps(list) {
    var ul = el('ul', 'vc-steps');
    list.forEach(function (t, i) { var li = el('li'); li.appendChild(el('span', 'vc-n', String(i + 1))); li.appendChild(el('span', '', t)); ul.appendChild(li); });
    return ul;
  }

  function build() {
    css();
    chip = el('button', '', '\uD83D\uDD17 Conectar con la central'); chip.id = 'vc-chip'; chip.type = 'button';
    chip.addEventListener('click', function () { open(2); });
    root = el('div'); root.id = 'vc-root'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'Conectar con la central');
    var sheet = el('div'); sheet.id = 'vc-sheet';
    var top = el('div'); top.id = 'vc-top';
    var d = el('div'); d.id = 'vc-dots';
    for (var i = 0; i < 3; i++) { var dot = el('div', 'vc-dot'); dots.push(dot); d.appendChild(dot); }
    var skip = el('button', '', 'Ahora no'); skip.id = 'vc-skip'; skip.type = 'button';
    skip.addEventListener('click', function () { lsSet(TUT_KEY, 'omitido'); close(); });
    top.appendChild(d); top.appendChild(skip);
    sheet.appendChild(top);

    // Paso 1: que es esto
    var p1 = el('div');
    p1.appendChild(el('div', 'vc-ico', '\uD83D\uDCE1'));
    p1.appendChild(el('h2', 'vc-h', 'Conecta tu celular con la central'));
    p1.appendChild(el('p', 'vc-p', 'La central (el computador de EcoRuta) te envía avisos, rutas y horarios. Para recibirlos, este celular se vincula una sola vez con un código.'));
    p1.appendChild(el('p', 'vc-p', 'Funciona desde cualquier red: no importa si estás en datos móviles o en otro Wi-Fi. Solo necesitas el código que te dé la central.'));
    var b1 = el('div', 'vc-btns'); var n1 = el('button', 'vc-btn', 'Siguiente'); n1.type = 'button'; n1.addEventListener('click', function () { show(1); }); b1.appendChild(n1); p1.appendChild(b1);

    // Paso 2: que hacer en el PC
    var p2 = el('div');
    p2.appendChild(el('div', 'vc-ico', '\uD83D\uDCBB'));
    p2.appendChild(el('h2', 'vc-h', 'Primero, en el computador'));
    p2.appendChild(steps([
      'Abre EcoRuta en el PC con el acceso “iniciar_ecoruta_internet” y deja esa ventana abierta.',
      'En la app del PC entra a Enviar > Conectar celulares y pulsa “Crear código”.',
      'Pulsa “Copiar mensaje” y envíalo a este celular (WhatsApp, por ejemplo).'
    ]));
    var b2 = el('div', 'vc-btns'); var a2 = el('button', 'vc-btn ghost', 'Atrás'); a2.type = 'button'; a2.addEventListener('click', function () { show(0); });
    var n2 = el('button', 'vc-btn', 'Ya lo tengo'); n2.type = 'button'; n2.addEventListener('click', function () { show(2); });
    b2.appendChild(a2); b2.appendChild(n2); p2.appendChild(b2);

    // Paso 3: pegar y conectar
    var p3 = el('div');
    p3.appendChild(el('div', 'vc-ico', '\uD83D\uDD11'));
    p3.appendChild(el('h2', 'vc-h', 'Ahora, en este celular'));
    p3.appendChild(el('p', 'vc-p', 'Copia el mensaje que te enviaron y pégalo en cualquiera de los dos campos: se llenan solos.'));
    var note = el('div', 'vc-note'); note.id = 'vc-note'; note.style.display = 'none'; p3.appendChild(note);
    p3.appendChild(el('label', 'vc-lbl', 'Enlace de la central'));
    urlIn = el('input', 'vc-in'); urlIn.type = 'text'; urlIn.placeholder = 'https://…trycloudflare.com'; urlIn.autocapitalize = 'off'; urlIn.autocomplete = 'off'; urlIn.spellcheck = false; urlIn.setAttribute('inputmode', 'url');
    p3.appendChild(urlIn);
    p3.appendChild(el('label', 'vc-lbl', 'Código'));
    codeIn = el('input', 'vc-in'); codeIn.type = 'text'; codeIn.placeholder = 'ECO-XXXX-XXXX'; codeIn.autocapitalize = 'characters'; codeIn.autocomplete = 'off'; codeIn.spellcheck = false;
    p3.appendChild(codeIn);
    function onPaste(e) { setTimeout(function () { fill(e.target.value); }, 0); }
    urlIn.addEventListener('paste', onPaste); codeIn.addEventListener('paste', onPaste);
    urlIn.addEventListener('change', function () { fill(urlIn.value); }); codeIn.addEventListener('change', function () { fill(codeIn.value); });
    msgEl = el('div'); msgEl.id = 'vc-msg'; p3.appendChild(msgEl);
    var b3 = el('div', 'vc-btns'); var a3 = el('button', 'vc-btn ghost', 'Atrás'); a3.type = 'button'; a3.addEventListener('click', function () { show(1); });
    goBtn = el('button', 'vc-btn', 'Conectar'); goBtn.type = 'button'; goBtn.addEventListener('click', connect);
    b3.appendChild(a3); b3.appendChild(goBtn); p3.appendChild(b3);

    pages = [p1, p2, p3];
    pages.forEach(function (p) { p.style.display = 'none'; sheet.appendChild(p); });
    root.appendChild(sheet);
    document.body.appendChild(chip); document.body.appendChild(root);
  }

  function fill(text) {
    var r = parse(text);
    if (r.url) urlIn.value = r.url;
    if (r.code) codeIn.value = r.code;
  }
  function say(text, cls) { msgEl.textContent = text || ''; msgEl.className = cls || ''; }
  function show(i) {
    step = i;
    pages.forEach(function (p, k) { p.style.display = k === i ? 'block' : 'none'; });
    dots.forEach(function (d, k) { d.className = 'vc-dot' + (k <= i ? ' on' : ''); });
    var n = document.getElementById('vc-note');
    if (n) { n.textContent = notice; n.style.display = notice && i === 2 ? 'block' : 'none'; }
  }
  function open(i, why) {
    if (!root) return;
    notice = why || '';
    if (window.PuenteApi.base() && !urlIn.value) urlIn.value = window.PuenteApi.base();
    say('');
    show(typeof i === 'number' ? i : 0);
    root.classList.add('on');
  }
  function close() { if (root) root.classList.remove('on'); refreshChip(); }
  function refreshChip() { if (chip) chip.classList.toggle('on', !linked() && !!lsGet(TUT_KEY) && !root.classList.contains('on')); }

  function connect() {
    fill(urlIn.value + ' ' + codeIn.value);
    var url = normUrl(urlIn.value), code = parse(codeIn.value).code;
    if (!url) return say('Falta el enlace de la central.', 'vc-bad');
    if (!code) return say('El código tiene el formato ECO-XXXX-XXXX.', 'vc-bad');
    goBtn.disabled = true; say('Conectando…', 'vc-info');
    window.PuenteApi.pair(url, code).then(function (r) {
      window.PuenteApi.setBase(url);
      window.PuenteApi.setToken(r.token);
      lsSet(TUT_KEY, 'hecho');
      say('\u2713 ¡Conectado!' + (r.label ? ' (' + r.label + ')' : ''), 'vc-ok');
      setTimeout(function () { location.reload(); }, 900); // la app vuelve a leer la direccion guardada
    }).catch(function (e) {
      goBtn.disabled = false;
      var s = e && e.status;
      if (s === 401) say('Ese código no es válido o la central lo desactivó. Pide uno nuevo.', 'vc-bad');
      else if (s === 403) say('Ese código ya no tiene cupos. Pide uno nuevo a la central.', 'vc-bad');
      else if (s === 429) say('Demasiados intentos. Espera unos minutos.', 'vc-bad');
      else say('No llego a la central. Revisa que el PC esté encendido con EcoRuta abierto y que el enlace sea el mismo que muestra el panel.', 'vc-bad');
    });
  }

  // Con servidor guardado pero sin token (la central lo exige) o con token que ya no sirve.
  function verify() {
    if (!window.PuenteApi.base()) return Promise.resolve();
    return window.PuenteApi.ping().then(function (p) {
      if (p && p.requireLink && !window.PuenteApi.token()) { open(2, 'La central ahora pide un código para recibir mensajes.'); return; }
      if (window.PuenteApi.token()) {
        return window.PuenteApi.check().catch(function (e) { if (e && e.status === 401) expired(); });
      }
    }).catch(function () { /* sin red: no molestar */ });
  }
  function expired() {
    window.PuenteApi.setToken('');
    open(2, 'Tu vínculo se desactivó o cambió. Pide a la central un código nuevo.');
  }

  function start() {
    build();
    refreshChip();
    var enApk = !/^https?:$/.test(location.protocol);            // la APK carga file://; la web servida por el puente es http(s)
    if (!window.PuenteApi.base() && !lsGet(TUT_KEY) && enApk) open(0);   // primera vez: tutorial completo
    else verify();
    setInterval(refreshChip, 4000);
  }
  window.Vincular = { open: function () { open(2); }, tutorial: function () { open(0); }, expired: expired, linked: linked, parse: parse };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
