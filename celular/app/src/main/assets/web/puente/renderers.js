/* CAPA DE PRESENTACION (receptora): un renderizador por tipo.
 * Para soportar un tipo nuevo basta con agregar una entrada aqui (y su Sender en la emisora).
 * Todo texto ajeno entra con textContent (nunca innerHTML) y el HTML ajeno va en un iframe con sandbox. */
(function () {
  'use strict';
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function kb(n) { return n < 1024 ? n + ' B' : n < 1048576 ? Math.round(n / 1024) + ' KB' : (n / 1048576).toFixed(1) + ' MB'; }
  function parse(blob) { return blob.text().then(function (t) { return JSON.parse(t); }); }

  window.Renderers = {
    text: function (blob, meta, host) {
      return blob.text().then(function (t) { host.appendChild(el('div', 'pu-text', t)); });
    },
    json: function (blob, meta, host) {
      return parse(blob).then(function (o) { host.appendChild(el('pre', 'pu-pre', JSON.stringify(o, null, 2))); });
    },
    image: function (blob, meta, host) {
      var img = new Image();
      img.alt = meta.name || '';
      img.className = 'pu-img';
      img.src = URL.createObjectURL(blob);
      host._revoke = img.src;
      host.appendChild(img);
    },
    html: function (blob, meta, host) {
      return blob.text().then(function (t) {
        var f = document.createElement('iframe');
        f.setAttribute('sandbox', ''); // sin permisos: el contenido ajeno no ejecuta codigo
        f.className = 'pu-frame';
        f.srcdoc = t;
        host.appendChild(f);
      });
    },
    file: function (blob, meta, host) {
      var b = el('button', 'pu-btn', 'Descargar ' + (meta.name || 'archivo') + ' (' + kb(meta.size || blob.size) + ')');
      b.type = 'button';
      b.addEventListener('click', function () { window.AppStorage.save(blob, meta.name); });
      host.appendChild(b);
    },
    // ---- Tipos propios de EcoRuta (datos JSON) ----
    // aviso: { title, body, priority: 'normal' | 'alta' }
    aviso: function (blob, meta, host) {
      return parse(blob).then(function (a) {
        if (a.priority === 'alta') host.appendChild(el('span', 'pu-tag pu-tag-alta', 'Importante'));
        host.appendChild(el('div', 'pu-title', String(a.title || meta.name || 'Aviso')));
        if (a.body) host.appendChild(el('div', 'pu-text', String(a.body)));
      });
    },
    // ruta: { name, days: ['L','M',...], time, neighborhoods: [..], notes }
    ruta: function (blob, meta, host) {
      return parse(blob).then(function (r) {
        host.appendChild(el('div', 'pu-title', String(r.name || 'Ruta')));
        var info = [];
        if (Array.isArray(r.days) && r.days.length) info.push(r.days.join(' · '));
        if (r.time) info.push(String(r.time));
        if (info.length) host.appendChild(el('div', 'pu-sub', info.join('  |  ')));
        if (Array.isArray(r.neighborhoods) && r.neighborhoods.length) {
          var ul = el('ul', 'pu-list');
          r.neighborhoods.slice(0, 60).forEach(function (n) { ul.appendChild(el('li', null, String(n))); });
          host.appendChild(ul);
        }
        if (r.notes) host.appendChild(el('div', 'pu-text', String(r.notes)));
      });
    }
  };
  window.PuenteKb = kb;
})();
