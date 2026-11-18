// Prueba la logica del celular (puente/api.js + puente/vincular.js) contra el servidor real, sin navegador.
const { spawn } = require('child_process'); const vm = require('vm'); const fs = require('fs'); const path = require('path'); const os = require('os');
const PORT = 3914, WEB = path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'web', 'puente');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = (n, c, x) => { console.log((c ? 'OK   ' : 'FALLA') + ' ' + n + (x !== undefined ? '  -> ' + x : '')); if (!c) process.exitCode = 1; };
function phone() { // un "celular": localStorage propio + los scripts reales de la app
  const store = new Map();
  const localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  const noop = () => {};
  const win = { localStorage, crypto: require('crypto').webcrypto, location: { protocol: 'file:' }, fetch, AbortController, setTimeout, clearTimeout, setInterval: noop };
  const ctx = vm.createContext({ ...win, window: win, document: { body: null, addEventListener: noop }, console });
  for (const f of ['api.js', 'vincular.js']) vm.runInContext(fs.readFileSync(path.join(WEB, f), 'utf8'), ctx, { filename: f });
  return { api: win.PuenteApi, vinc: win.Vincular, store };
}
const adm = (m, p, b) => fetch('http://127.0.0.1:' + PORT + p, { method: m, headers: { 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }).then(async (r) => ({ s: r.status, j: await r.json().catch(() => ({})) }));
(async () => {
  for (const f of ['vinculos.json', 'items.json']) fs.rmSync(path.join(__dirname, 'datos', f), { force: true });
  fs.rmSync(path.join(__dirname, 'datos', 'items'), { recursive: true, force: true });
  const FAKE = path.join(os.tmpdir(), 'fake-cf2'); fs.writeFileSync(FAKE, '#!/bin/sh\necho "https://x-y.trycloudflare.com"\nsleep 600\n'); fs.chmodSync(FAKE, 0o755);
  const srv = spawn('node', [path.join(__dirname, 'server.cjs')], { env: { ...process.env, PORT, ECORUTA_TUNNEL: 'quick', ECORUTA_CLOUDFLARED: FAKE }, cwd: __dirname });
  await wait(1800);
  const { api, vinc, store } = phone();

  // lectura del mensaje que copia el panel
  const msg = 'Hola! Para recibir los avisos de EcoRuta abre la app y pega esto:\nhttps://x-y.trycloudflare.com\nCódigo: ECO-4F7K-92AB\nGracias';
  let p = vinc.parse(msg); ok('parse: saca enlace y codigo de un mensaje completo', p.url === 'https://x-y.trycloudflare.com' && p.code === 'ECO-4F7K-92AB', JSON.stringify(p));
  p = vinc.parse('eco 4f7k 92ab'); ok('parse: codigo escrito a mano (minusculas, espacios)', p.code === 'ECO-4F7K-92AB', p.code);
  p = vinc.parse('mira https://abc.trycloudflare.com.'); ok('parse: quita el punto final del enlace', p.url === 'https://abc.trycloudflare.com', p.url);
  ok('sin servidor guardado: no esta vinculado', vinc.linked() === false);

  const code = (await adm('POST', '/api/links', { label: 'Prueba', maxUses: 5 })).j.code;
  const base = 'http://127.0.0.1:' + PORT;
  let r = await api.pair(base, code); ok('pair: el celular canjea el codigo y recibe token', /^[0-9a-f]{48}$/.test(r.token), r.label);
  api.setBase(base); api.setToken(r.token);
  ok('queda guardado el servidor y el token', api.base() === base && api.token() === r.token && vinc.linked() === true);
  const d1 = api.device(); ok('el id del celular es estable', d1 === api.device() && d1.length === 24, d1);
  ok('ping y check funcionan con el token', (await api.ping()).requireLink === true && (await api.check()).ok === true);

  await adm('DELETE', '/api/links/' + code);
  let st = 0; try { await api.check(); } catch (e) { st = e.status; }
  ok('al desactivar el codigo, check falla con status 401 (la app abre el aviso)', st === 401, st);
  let st2 = 0; try { await api.pair(base, code); } catch (e) { st2 = e.status; }
  ok('canjear un codigo desactivado => 401', st2 === 401, st2);
  let down = null; try { await api.pair('http://127.0.0.1:1', code); } catch (e) { down = e; }
  ok('central apagada: error de red sin status (mensaje "no llego a la central")', down && !down.status, down && down.message);
  srv.kill(); fs.rmSync(FAKE, { force: true });
  for (const f of ['vinculos.json', 'items.json']) fs.rmSync(path.join(__dirname, 'datos', f), { force: true });
  console.log(process.exitCode ? '\nHAY FALLAS' : '\nTODO BIEN');
})();
