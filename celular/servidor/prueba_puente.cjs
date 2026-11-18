// Pruebas del PUENTE (contrato de mensajes). Uso: node servidor/prueba_puente.cjs
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3912, PIN = '4321';
const start = () => spawn('node', [path.join(__dirname, 'server.cjs')], { env: { ...process.env, PORT, ECORUTA_PIN: PIN }, cwd: __dirname });
const call = (m, p, body, headers = {}) => new Promise((res, rej) => {
  const r = http.request({ port: PORT, method: m, path: p, headers: { ...(body ? { 'content-length': Buffer.byteLength(body) } : {}), ...headers } }, (rs) => {
    const c = []; rs.on('data', (d) => c.push(d)); rs.on('end', () => res({ s: rs.statusCode, h: rs.headers, b: Buffer.concat(c) }));
  });
  r.on('error', (e) => res({ s: 0, h: {}, b: Buffer.from(String(e.code || e.message)) }));
  if (body) r.write(body); r.end();
});
const ok = (n, c, x) => { console.log((c ? 'OK   ' : 'FALLA') + ' ' + n + (x !== undefined ? '  -> ' + x : '')); if (!c) process.exitCode = 1; };
const send = (type, name, mime, body, pin = PIN) => call('POST', '/api/items', body, { 'content-type': mime, 'x-type': type, 'x-name': encodeURIComponent(name), ...(pin ? { 'x-pin': pin } : {}) });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  fs.rmSync(path.join(__dirname, 'datos', 'items'), { recursive: true, force: true });
  fs.rmSync(path.join(__dirname, 'datos', 'items.json'), { force: true });
  let srv = start(); await wait(1200);
  let r = await call('GET', '/api/ping'); const p1 = JSON.parse(r.b);
  ok('ping responde {ok,version,boot}', p1.ok === true && p1.version === 1 && typeof p1.boot === 'number');
  r = await send('text', 'nota.txt', 'text/plain', 'hola', null); ok('enviar sin PIN => 401', r.s === 401, r.s);
  r = await send('aviso', 'aviso ñandú.json', 'application/json', JSON.stringify({ title: 'T', body: 'B' }));
  const m1 = JSON.parse(r.b);
  ok('enviar con PIN devuelve metadatos', r.s === 200 && m1.id === '1' && m1.type === 'aviso' && m1.mime === 'application/json' && m1.size === 24, r.b.toString());
  ok('nombre con tildes/espacios se conserva', m1.name === 'aviso ñandú.json', m1.name);
  r = await send('Tipo Raro!!', 'x.bin', 'application/octet-stream', Buffer.from([1, 2, 3]));
  ok('tipo invalido => se guarda como "file"', JSON.parse(r.b).type === 'file', JSON.parse(r.b).type);
  r = await send('html', 'p.html', 'text/html', '<script>alert(1)</script>');
  const mh = JSON.parse(r.b);
  r = await call('GET', '/api/items?since=1'); let l = JSON.parse(r.b);
  ok('since=1 lista solo los mayores a 1', l.length === 2 && l[0].id === '2', l.map((i) => i.id).join(','));
  r = await call('GET', '/api/items'); ok('sin since lista todo', JSON.parse(r.b).length === 3);
  r = await call('GET', '/api/items/1'); ok('GET /items/1 entrega el contenido crudo con su Content-Type', r.s === 200 && r.h['content-type'] === 'application/json' && JSON.parse(r.b).title === 'T');
  r = await call('GET', '/api/items/' + mh.id);
  ok('HTML ajeno se sirve con sandbox (no ejecuta en el origen del servidor)', /sandbox/.test(r.h['content-security-policy'] || '') && r.h['x-content-type-options'] === 'nosniff');
  r = await call('GET', '/api/items/999'); ok('item inexistente => 404', r.s === 404);
  r = await call('OPTIONS', '/api/items', null, { origin: 'http://x', 'access-control-request-method': 'POST', 'access-control-request-headers': 'x-type,x-name,content-type,x-pin' });
  ok('preflight CORS permite X-Type, X-Name, x-pin', r.s === 204 && /x-type/i.test(r.h['access-control-allow-headers']) && /x-name/i.test(r.h['access-control-allow-headers']));
  r = await call('OPTIONS', '/api/items/1', null, { origin: 'http://x', 'access-control-request-method': 'DELETE' });
  ok('preflight permite DELETE', /DELETE/.test(r.h['access-control-allow-methods']));
  r = await call('DELETE', '/api/items/2'); ok('borrar sin PIN => 401', r.s === 401);
  r = await call('DELETE', '/api/items/2', null, { 'x-pin': PIN }); ok('borrar con PIN => 200', r.s === 200);
  r = await call('GET', '/api/items/2'); ok('item borrado => 404', r.s === 404);
  ok('el archivo del item borrado se elimina del disco', !fs.existsSync(path.join(__dirname, 'datos', 'items', '2')));
  r = await send('file', 'grande.bin', 'application/octet-stream', Buffer.alloc(21 * 1024 * 1024));
  ok('mas de 20 MB => 413 (o corte de conexion)', r.s === 413 || r.s === 0, r.s);
  await wait(900);
  // reinicio: los ids NO se reutilizan y el "boot" cambia
  srv.kill(); await wait(600); srv = start(); await wait(1200);
  const p2 = JSON.parse((await call('GET', '/api/ping')).b);
  ok('tras reiniciar, boot cambia (el receptor detecta el reinicio)', p2.boot !== p1.boot);
  l = JSON.parse((await call('GET', '/api/items')).b);
  ok('tras reiniciar, los items siguen', l.map((i) => i.id).join(',') === '1,3', l.map((i) => i.id).join(','));
  r = await send('text', 'n.txt', 'text/plain', 'nuevo'); ok('tras reiniciar, el id sigue creciendo (no se reutiliza)', JSON.parse(r.b).id === '4', r.b.toString());
  // limite de envios por minuto
  let last = 0; for (let i = 0; i < 62; i++) last = (await send('text', 'n.txt', 'text/plain', 'x')).s;
  ok('mas de 60 envios/min => 429', last === 429, last);
  srv.kill();
  fs.rmSync(path.join(__dirname, 'datos'), { recursive: true, force: true });
})();
