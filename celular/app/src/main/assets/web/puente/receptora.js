/* APP RECEPTORA: descarga diaria + borrado a las 24 h.
 *  - Una vez cada 24 h (al abrir la app o cuando toque) pide al puente la lista y DESCARGA lo nuevo.
 *  - Lo descargado queda en el telefono (IndexedDB): se ve sin red y al reabrir la app.
 *  - 24 h despues de recibido cada mensaje se borra solo. Lo borrado no se vuelve a bajar.
 *  - Sin mensajes, la app queda en blanco (lienzo vacio) pero funcionando.
 *  - "Actualizar ahora" permite pedir antes de las 24 h (acción de la persona).
 * Contrato de mensajes: contrato/protocolo.md. Un tipo desconocido se muestra como archivo. */
(function () {
  'use strict';
  var DAY = 24 * 60 * 60 * 1000;
  var LOOP_MS = 60 * 1000;                    // revisa si algo expiro o si toca la descarga diaria
  var SEEN_KEY = 'ecoruta.puente.visto', SYNC_KEY = 'ecoruta.puente.sync', DONE_KEY = 'ecoruta.puente.borrados';

  var known = new Map();                      // key -> { rec, card, body }
  var syncing = false, isOpen = false, store = null;
  var btn, badge, panel, listEl, statusEl, emptyEl, infoEl, refreshBtn;

  // ---------- almacenamiento chico en localStorage ----------
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
  function lastSync() { return Number(lsGet(SYNC_KEY, 0)) || 0; }
  function keyOf(m) { return m.id + ':' + m.stamp; }
  function markDeleted(key) { var d = lsGet(DONE_KEY, []); if (d.indexOf(key) < 0) { d.push(key); lsSet(DONE_KEY, d.slice(-400)); } }
  function wasDeleted(key) { return lsGet(DONE_KEY, []).indexOf(key) >= 0; }

  // ---------- almacen de mensajes: IndexedDB, o memoria si no esta disponible ----------
  function memoryStore() {
    var m = new Map();
    return {
      all: function () { return Promise.resolve(Array.from(m.values())); },
      put: function (r) { m.set(r.key, r); return Promise.resolve(); },
      del: function (k) { m.delete(k); return Promise.resolve(); }
    };
  }
  function idbStore() {
    return new Promise(function (resolve) {
      if (!window.indexedDB) return resolve(memoryStore());
      var rq;
      try { rq = indexedDB.open('ecoruta-puente', 1); } catch (e) { return resolve(memoryStore()); }
      rq.onupgradeneeded = function () { rq.result.createObjectStore('items', { keyPath: 'key' }); };
      rq.onerror = rq.onblocked = function () { resolve(memoryStore()); };
      rq.onsuccess = function () {
        var db = rq.result;
        function run(mode, fn) {
          return new Promise(function (res, rej) {
            var tx = db.transaction('items', mode), st = tx.objectStore('items'), out = fn(st);
            tx.oncomplete = function () { res(out && out.result); };
            tx.onerror = tx.onabort = function () { rej(tx.error); };
          });
        }
        resolve({
          all: function () { return run('readonly', function (s) { return s.getAll(); }); },
          put: function (r) { return run('readwrite', function (s) { return s.put(r); }); },
          del: function (k) { return run('readwrite', function (s) { return s['delete'](k); }); }
        });
      };
    });
  }

  // ---------- interfaz ----------
  function css() {
    var s = document.createElement('style');
    s.textContent =
      '#pu-btn{position:fixed;z-index:9000;right:12px;bottom:calc(88px + env(safe-area-inset-bottom,0px));width:44px;height:44px;border-radius:50%;' +
      'border:1px solid var(--line,#e3e8e4);background:var(--surface,#fff);color:var(--ink,#17211c);box-shadow:var(--float,0 4px 14px rgba(0,0,0,.18));' +
      'display:none;align-items:center;justify-content:center;font-size:20px;cursor:pointer;padding:0}' +
      '#pu-btn.on{display:flex}' +
      '#pu-badge{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;border-radius:10px;padding:0 5px;box-sizing:border-box;' +
      'background:var(--bad,#b3342b);color:var(--on-bad,#fff);font:700 12px/20px system-ui,sans-serif;text-align:center;display:none}' +
      '#pu-panel{position:fixed;z-index:9500;left:0;right:0;bottom:0;max-height:82vh;display:none;flex-direction:column;box-sizing:border-box;' +
      'background:var(--bg,#f6f7f5);color:var(--ink,#17211c);border-radius:20px 20px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,.28);' +
      'padding-bottom:env(safe-area-inset-bottom,0px);font:400 15px/1.4 Poppins,system-ui,sans-serif}' +
      '#pu-panel.on{display:flex}' +
      '#pu-head{display:flex;align-items:center;gap:10px;padding:14px 16px 4px}' +
      '#pu-head h2{margin:0;flex:1;font:700 17px/1.2 Poppins,system-ui,sans-serif}' +
      '#pu-close{border:0;background:var(--soft,#eef1ee);color:var(--ink,#17211c);border-radius:50%;width:34px;height:34px;font-size:18px;cursor:pointer;padding:0}' +
      '#pu-bar{display:flex;align-items:center;gap:10px;padding:0 16px 8px}' +
      '#pu-info{flex:1;font-size:12px;color:var(--muted,#5f6b64)}' +
      '#pu-refresh,#pu-con{border:1px solid var(--line,#e3e8e4);background:var(--surface,#fff);color:var(--ink,#17211c);border-radius:10px;padding:6px 12px;font:600 13px Poppins,system-ui,sans-serif;cursor:pointer}' +
      '#pu-refresh:disabled{opacity:.5;cursor:default}' +
      '#pu-list{overflow:auto;padding:4px 16px 16px;display:flex;flex-direction:column;gap:10px;-webkit-overflow-scrolling:touch}' +
      '#pu-empty{padding:24px 8px;text-align:center;color:var(--muted,#5f6b64)}' +
      '.pu-card{background:var(--surface,#fff);border:1px solid var(--line,#e3e8e4);border-radius:14px;padding:12px 14px}' +
      '.pu-when{font-size:12px;color:var(--muted,#5f6b64);margin-bottom:6px}' +
      '.pu-title{font-weight:700;margin-bottom:4px}.pu-sub{color:var(--muted,#5f6b64);font-size:13px;margin-bottom:4px}' +
      '.pu-text{white-space:pre-wrap;word-break:break-word}.pu-list{margin:6px 0 4px 18px;padding:0}' +
      '.pu-pre{margin:0;overflow:auto;font-size:12px;background:var(--soft,#eef1ee);padding:8px;border-radius:8px}' +
      '.pu-img{max-width:100%;border-radius:10px;display:block}.pu-frame{width:100%;height:50vh;border:0;border-radius:8px;background:#fff}' +
      '.pu-btn{border:0;border-radius:10px;padding:10px 14px;background:var(--accent,#2d6a4f);color:var(--accent-ink,#fff);font:600 14px Poppins,system-ui,sans-serif;cursor:pointer}' +
      '.pu-tag{display:inline-block;font-size:11px;font-weight:700;border-radius:6px;padding:2px 8px;margin-bottom:6px;background:var(--soft,#eef1ee)}' +
      '.pu-tag-alta{background:var(--bad-soft,#fbe9e7);color:var(--bad,#b3342b)}' +
      '.pu-err{color:var(--muted,#5f6b64);font-size:13px}';
    document.head.appendChild(s);
  }

  function build() {
    css();
    btn = document.createElement('button');
    btn.id = 'pu-btn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Mensajes de la central');
    btn.textContent = '\u2709';
    badge = document.createElement('span'); badge.id = 'pu-badge'; btn.appendChild(badge);
    btn.addEventListener('click', function () { toggle(true); });

    panel = document.createElement('div');
    panel.id = 'pu-panel'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Mensajes de la central');
    var head = document.createElement('div'); head.id = 'pu-head';
    var h = document.createElement('h2'); h.textContent = 'Mensajes de la central';
    var close = document.createElement('button'); close.id = 'pu-close'; close.type = 'button';
    close.setAttribute('aria-label', 'Cerrar'); close.textContent = '\u2715';
    close.addEventListener('click', function () { toggle(false); });
    head.appendChild(h); head.appendChild(close);
    var bar = document.createElement('div'); bar.id = 'pu-bar';
    infoEl = document.createElement('span'); infoEl.id = 'pu-info';
    refreshBtn = document.createElement('button'); refreshBtn.id = 'pu-refresh'; refreshBtn.type = 'button'; refreshBtn.textContent = 'Actualizar ahora';
    refreshBtn.addEventListener('click', function () { sync(true); });
    var conBtn = document.createElement('button'); conBtn.id = 'pu-con'; conBtn.type = 'button'; conBtn.textContent = 'Conexión';
    conBtn.style.marginRight = '6px';
    conBtn.addEventListener('click', function () { toggle(false); if (window.Vincular) window.Vincular.open(); });
    bar.appendChild(infoEl); bar.appendChild(conBtn); bar.appendChild(refreshBtn);
    statusEl = infoEl;
    listEl = document.createElement('div'); listEl.id = 'pu-list';
    emptyEl = document.createElement('div'); emptyEl.id = 'pu-empty';
    emptyEl.textContent = 'No hay mensajes. Se descargan una vez al día y se borran a las 24 horas.';
    listEl.appendChild(emptyEl);
    panel.appendChild(head); panel.appendChild(bar); panel.appendChild(listEl);
    document.body.appendChild(btn); document.body.appendChild(panel);
  }

  function fmt(ms) {
    try { return new Date(ms).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return ''; }
  }

  function refreshInfo(msg) {
    if (!infoEl) return;
    var t = lastSync();
    infoEl.textContent = msg || (t ? 'Descargado: ' + fmt(t) + ' · próxima: ' + fmt(t + DAY) : 'Aún no se ha descargado nada.');
  }

  function refreshBadge() {
    var s = Number(lsGet(SEEN_KEY, 0)) || 0, n = 0;
    known.forEach(function (v) { if (+v.rec.meta.id > s) n++; });
    badge.textContent = n > 99 ? '99+' : String(n);
    badge.style.display = n > 0 && !isOpen ? 'block' : 'none';
    // Visible con mensajes, o ya dentro de la app (con sesion y servidor): asi siempre hay forma de pedir.
    var inApp = false;
    try { inApp = !!localStorage.getItem('ecoruta.session'); } catch (e) { /* nada */ }
    btn.classList.toggle('on', known.size > 0 || (inApp && window.PuenteApi.available()));
    emptyEl.style.display = known.size ? 'none' : 'block';
  }

  function toggle(open) {
    isOpen = open;
    panel.classList.toggle('on', open);
    if (open) {
      var max = 0; known.forEach(function (v) { max = Math.max(max, +v.rec.meta.id); });
      lsSet(SEEN_KEY, max);
      refreshInfo();
    }
    refreshBadge();
  }

  // ---------- tarjetas ----------
  function addCard(rec, silent) {
    var meta = rec.meta, blob = rec.blob;
    var card = document.createElement('div'); card.className = 'pu-card';
    var w = document.createElement('div'); w.className = 'pu-when';
    w.textContent = 'Recibido ' + fmt(rec.receivedAt) + ' · se borra ' + fmt(rec.receivedAt + DAY);
    var body = document.createElement('div');
    card.appendChild(w); card.appendChild(body);
    var render = window.Renderers[meta.type] || window.Renderers.file; // tipo desconocido -> archivo
    Promise.resolve().then(function () { return render(blob, meta, body); }).catch(function () {
      body.textContent = '';
      var e = document.createElement('div'); e.className = 'pu-err'; e.textContent = 'No pude mostrar este contenido.';
      body.appendChild(e);
      window.Renderers.file(blob, meta, body);
    });
    // lo mas nuevo arriba (ids mayores primero)
    var before = null;
    known.forEach(function (v) { if (!before && +v.rec.meta.id < +meta.id) before = v.card; });
    listEl.insertBefore(card, before || emptyEl);
    known.set(rec.key, { rec: rec, card: card, body: body });
  }

  function removeCard(key) {
    var v = known.get(key); if (!v) return;
    if (v.body && v.body._revoke) { try { URL.revokeObjectURL(v.body._revoke); } catch (e) { /* nada */ } }
    v.card.remove(); known.delete(key);
  }

  // ---------- borrado a las 24 h ----------
  function purge() {
    var now = Date.now(), jobs = [];
    known.forEach(function (v, key) {
      if (now - v.rec.receivedAt >= DAY) {
        jobs.push(store.del(key).catch(function () { /* ya no estaba */ }));
        markDeleted(key); removeCard(key);
      }
    });
    return Promise.all(jobs);
  }

  // ---------- descarga ----------
  async function sync(manual) {
    if (syncing) return;
    syncing = true;
    if (refreshBtn) refreshBtn.disabled = true;
    try {
      if (!window.PuenteApi.available()) { refreshInfo('Sin servidor: escribe la dirección en Ajustes.'); return; }
      await window.PuenteApi.ping();
      var metas = await window.PuenteApi.list(0), got = 0;
      metas.sort(function (a, b) { return +a.id - +b.id; });
      for (var i = 0; i < metas.length; i++) {
        var key = keyOf(metas[i]);
        if (known.has(key) || wasDeleted(key)) continue;       // ya lo tengo, o ya se borro: no se baja otra vez
        var rec = { key: key, meta: metas[i], blob: await window.PuenteApi.blob(metas[i].id), receivedAt: Date.now() };
        await store.put(rec);
        addCard(rec); got++;
      }
      lsSet(SYNC_KEY, Date.now());
      refreshInfo(got ? null : (manual ? 'Nada nuevo. ' : '') + (lastSync() ? 'Descargado: ' + fmt(lastSync()) + ' · próxima: ' + fmt(lastSync() + DAY) : ''));
    } catch (e) {
      if (e && e.status === 401 && window.Vincular) { window.Vincular.expired(); refreshInfo('Vínculo desactivado: pide un código nuevo a la central.'); }
      else refreshInfo('Sin conexión con la central. Se reintenta en un minuto. Si el PC se reinició, puede haber un enlace nuevo.');
    } finally {
      syncing = false;
      if (refreshBtn) refreshBtn.disabled = false;
      refreshBadge();
    }
  }

  // Cada minuto: borra lo vencido y, si pasaron 24 h desde la ultima descarga, vuelve a descargar.
  async function check() {
    await purge();
    if (Date.now() - lastSync() >= DAY) await sync(false);
    refreshBadge();
  }

  async function start() {
    build();
    store = await idbStore();
    var saved = [];
    try { saved = await store.all(); } catch (e) { saved = []; }
    saved.sort(function (a, b) { return +a.meta.id - +b.meta.id; });
    saved.forEach(function (r) { addCard(r, true); });          // lo descargado se ve al instante, sin red
    refreshInfo();
    refreshBadge();
    await check();
    setInterval(check, LOOP_MS);
    setInterval(refreshBadge, 3000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
  }

  window.Puente = { open: function () { toggle(true); }, close: function () { toggle(false); }, check: check, sync: sync, _known: known, DAY: DAY };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
