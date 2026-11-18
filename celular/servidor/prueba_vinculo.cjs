// Pruebas del ENLACE POR INTERNET y la VINCULACION por codigo. Uso: node servidor/prueba_vinculo.cjs
// Simula el tunel: las peticiones que llegan "desde internet" entran por 127.0.0.1 con cabecera cf-connecting-ip.
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const PORT = 3913, PIN = '4321';
const FAKE = path.join(os.tmpdir(), process.platform === 'win32' ? 'fake-cloudflared.cmd' : 'fake-cloudflared');
if (process.platform === 'win32') fs.writeFileSync(FAKE, '@echo off\r\necho INF +----+\r\necho INF https://prueba-eco-ruta.trycloudflare.com\r\nping -n 600 127.0.0.1 >nul\r\n');
else { fs.writeFileSync(FAKE, '#!/bin/sh\necho "INF Your quick Tunnel has been created! Visit it at:"\necho "INF https://prueba-eco-ruta.trycloudflare.com"\nsleep 600\n'); fs.chmodSync(FAKE, 0o755); }
const start = (extra = {}) => spawn('node', [path.join(__dirname, 'server.cjs')], { env: { ...process.env, PORT, ...extra }, cwd: __dirname });
const call = (m, p, body, headers = {}) => new Promise((res) => {
  const r = http.request({ port: PORT, host: '127.0.0.1', method: m, path: p, headers: { ...(body ? { 'content-length': Buffer.byteLength(body), 'content-type': 'application/json' } : {}), ...headers } }, (rs) => {
    const c = []; rs.on('data', (d) => c.push(d)); rs.on('end', () => res({ s: rs.statusCode, h: rs.headers, b: Buffer.concat(c) }));
  });
  r.on('error', (e) => res({ s: 0, h: {}, b: Buffer.from(String(e.code || e.message)) }));
  if (body) r.write(body); r.end();
});
const NET = (ip = '203.0.113.7', extra = {}) => ({ 'cf-connecting-ip': ip, 'cf-ray': 'abc123', ...extra }); // "desde internet"
const J = (r) => { try { return JSON.parse(r.b); } catch (e) { return {}; } };
const ok = (n, c, x) => { console.log((c ? 'OK   ' : 'FALLA') + ' ' + n + (x !== undefined ? '  -> ' + x : '')); if (!c) process.exitCode = 1; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  for (const f of ['vinculos.json', 'items.json', 'direccion_publica.txt']) fs.rmSync(path.join(__dirname, 'datos', f), { force: true });
  fs.rmSync(path.join(__dirname, 'datos', 'items'), { recursive: true, force: true });
  let srv = start({ ECORUTA_TUNNEL: 'quick', ECORUTA_CLOUDFLARED: FAKE }); await wait(2000);

  let r = await call('GET', '/api/ping'); ok('ping informa requireLink=true con tunel activo', J(r).requireLink === true, r.s);
  r = await call('GET', '/api/links'); const info = J(r);
  ok('el PC local (sin PIN) administra codigos', r.s === 200, r.s);
  ok('detecta la direccion del tunel', info.tunnel && info.tunnel.state === 'on' && info.tunnel.url === 'https://prueba-eco-ruta.trycloudflare.com', JSON.stringify(info.tunnel));
  r = await call('GET', '/api/links', null, NET()); ok('desde internet NO se administran codigos (403)', r.s === 403, r.s);
  r = await call('POST', '/api/links', JSON.stringify({ label: 'x' }), NET()); ok('desde internet NO se crean codigos (403)', r.s === 403, r.s);

  r = await call('POST', '/api/links', JSON.stringify({ label: 'Barrio Centro', maxUses: 2 })); const code = J(r).code;
  ok('crear codigo con formato ECO-XXXX-XXXX', r.s === 200 && /^ECO-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$/.test(code), code);

  r = await call('GET', '/api/items', null, NET()); ok('sin vinculo, desde internet no lee mensajes (401)', r.s === 401, r.s);
  r = await call('GET', '/api/items'); ok('el PC local si lee (panel "Enviados")', r.s === 200, r.s);
  r = await call('POST', '/api/items', 'hola', { 'content-type': 'text/plain', 'x-type': 'text', ...NET() }); ok('sin PIN, desde internet no se publica (403)', r.s === 403, r.s);
  r = await call('POST', '/api/items', 'hola desde el PC', { 'content-type': 'text/plain', 'x-type': 'text', 'x-name': 'a.txt' }); ok('el PC local publica sin PIN', r.s === 200, r.s);

  r = await call('POST', '/api/pair', JSON.stringify({ code: 'ECO-AAAA-BBBB', device: 'd1' }), NET()); ok('codigo falso => 401', r.s === 401, r.s);
  r = await call('POST', '/api/pair', JSON.stringify({ code: code.toLowerCase().replace(/-/g, ' '), device: 'd1', name: 'Cel 1' }), NET()); const t1 = J(r).token;
  ok('canjear codigo (acepta minusculas y espacios)', r.s === 200 && /^[0-9a-f]{48}$/.test(t1), r.s);
  r = await call('GET', '/api/items', null, NET('198.51.100.9', { 'x-token': t1 })); ok('con token lee mensajes', r.s === 200 && J(r).length === 1, r.s);
  const id = J(r)[0].id;
  r = await call('GET', '/api/items/' + id, null, NET('198.51.100.9', { 'x-token': t1 })); ok('con token descarga el contenido', r.s === 200 && r.b.toString() === 'hola desde el PC', r.s);
  r = await call('GET', '/api/items/' + id, null, NET()); ok('sin token no descarga (401)', r.s === 401, r.s);
  r = await call('GET', '/api/pair/check', null, NET('198.51.100.9', { 'x-token': t1 })); ok('pair/check valida el token', r.s === 200, r.s);

  r = await call('POST', '/api/pair', JSON.stringify({ code, device: 'd1' }), NET()); const t1b = J(r).token;
  ok('el mismo celular se revincula sin gastar cupo', r.s === 200 && t1b && t1b !== t1, r.s);
  r = await call('GET', '/api/pair/check', null, NET('198.51.100.9', { 'x-token': t1 })); ok('el token viejo del mismo celular deja de servir', r.s === 401, r.s);
  r = await call('POST', '/api/pair', JSON.stringify({ code, device: 'd2' }), NET()); const t2 = J(r).token; ok('segundo celular entra (cupo 2/2)', r.s === 200 && !!t2, r.s);
  r = await call('POST', '/api/pair', JSON.stringify({ code, device: 'd3' }), NET()); ok('tercer celular: sin cupos (403)', r.s === 403, r.s);

  r = await call('GET', '/api/links'); const row = J(r).codes.find((c) => c.code === code); ok('el panel ve 2 celulares en el codigo', row && row.devices === 2, row && row.devices);
  r = await call('DELETE', '/api/links/' + code); ok('desactivar codigo', r.s === 200, r.s);
  r = await call('GET', '/api/items', null, NET('198.51.100.9', { 'x-token': t1b })); ok('al desactivar, el celular 1 deja de recibir (401)', r.s === 401, r.s);
  r = await call('GET', '/api/items', null, NET('198.51.100.10', { 'x-token': t2 })); ok('al desactivar, el celular 2 deja de recibir (401)', r.s === 401, r.s);
  r = await call('POST', '/api/pair', JSON.stringify({ code, device: 'd9' }), NET()); ok('un codigo desactivado no vuelve a canjearse', r.s === 401, r.s);

  // fuerza bruta: 10 fallos => bloqueo, incluso con un codigo valido
  r = await call('POST', '/api/links', JSON.stringify({ label: 'b' })); const code2 = J(r).code;
  for (let i = 0; i < 10; i++) await call('POST', '/api/pair', JSON.stringify({ code: 'ECO-ZZZZ-ZZZ' + i }), NET('192.0.2.50'));
  r = await call('POST', '/api/pair', JSON.stringify({ code: code2, device: 'x' }), NET('192.0.2.50')); ok('10 fallos bloquean esa IP, aun con codigo valido (429)', r.s === 429, r.s);
  r = await call('POST', '/api/pair', JSON.stringify({ code: code2, device: 'x' }), NET('192.0.2.51')); ok('otra IP de internet no se ve afectada', r.s === 200, r.s);

  // persistencia: reiniciar el servidor no desvincula
  const tokKeep = J(r).token;
  srv.kill(); await wait(500); srv = start({ ECORUTA_TUNNEL: 'quick', ECORUTA_CLOUDFLARED: FAKE }); await wait(2000);
  r = await call('GET', '/api/pair/check', null, NET('192.0.2.51', { 'x-token': tokKeep })); ok('tras reiniciar el servidor el celular sigue vinculado', r.s === 200, r.s);
  srv.kill(); await wait(500);

  // con PIN: administrar y publicar desde internet exige PIN; leer exige token
  srv = start({ ECORUTA_TUNNEL: 'quick', ECORUTA_CLOUDFLARED: FAKE, ECORUTA_PIN: PIN }); await wait(2000);
  r = await call('GET', '/api/links', null, NET()); ok('con PIN, administrar sin PIN => 401', r.s === 401, r.s);
  r = await call('GET', '/api/links', null, NET('203.0.113.7', { 'x-pin': PIN })); ok('con PIN correcto, administrar desde internet => 200', r.s === 200, r.s);
  r = await call('POST', '/api/items', 'x', { 'content-type': 'text/plain', 'x-type': 'text', 'x-pin': PIN, ...NET() }); ok('con PIN, publicar desde internet => 200', r.s === 200, r.s);
  r = await call('GET', '/api/items', null, NET('203.0.113.7', { 'x-pin': PIN })); ok('el panel con PIN lista mensajes sin token', r.s === 200, r.s);
  srv.kill(); await wait(500);

  // sin tunel ni publicUrl: todo como antes (compatibilidad)
  srv = start(); await wait(1200);
  r = await call('GET', '/api/ping'); ok('sin tunel: requireLink=false (compatible con 2.3.0)', J(r).requireLink === false, r.s);
  r = await call('GET', '/api/items', null, { 'x-forwarded-for': '1.2.3.4' }); ok('sin tunel: leer sigue libre', r.s === 200, r.s);
  srv.kill();
  fs.rmSync(FAKE, { force: true });
  for (const f of ['vinculos.json', 'items.json', 'direccion_publica.txt']) fs.rmSync(path.join(__dirname, 'datos', f), { force: true });
  fs.rmSync(path.join(__dirname, 'datos', 'items'), { recursive: true, force: true });
  console.log(process.exitCode ? '\nHAY FALLAS' : '\nTODO BIEN');
})();
