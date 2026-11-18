const { spawn } = require('child_process');
const http = require('http');
const PORT = 3911;
const srv = spawn('node', [require('path').join(__dirname,'server.cjs')], { env: { ...process.env, PORT, ECORUTA_PIN: '4321' }, cwd: __dirname });
const req = (m, path, body, pin) => new Promise((res) => {
  const d = body ? JSON.stringify(body) : null;
  const r = http.request({ port: PORT, method: m, path, headers: { 'content-type': 'application/json', ...(pin ? { 'x-pin': pin } : {}) } }, (rs) => {
    let b = ''; rs.on('data', (c) => b += c); rs.on('end', () => res({ s: rs.statusCode, b }));
  });
  if (d) r.write(d); r.end();
});
const geo = Array.from({ length: 5 }, (_, i) => [4.92 + i * 1e-4, -75.06]);
const truck = (o = {}) => ({ id: 'camion-ABC123', driver: 'Juan', plate: 'ABC123', lat: 4.92, lng: -75.06, ts: Date.now(), status: 'en_ruta', stops: [{ id: 's1', name: 'A', lat: 4.92, lng: -75.06, status: 'pendiente', kind: 'stop', evil: 'x' }], geometry: geo, evil: 'inyectado', ...o });
const ok = (n, c, x) => console.log((c ? 'OK   ' : 'FALLA') + ' ' + n + (x ? '  -> ' + x : ''));
(async () => {
  await new Promise((r) => setTimeout(r, 1200));
  let r = await req('GET', '/api/status'); ok('status sin PIN requiere pin=true', JSON.parse(r.b).pinRequired === true);
  r = await req('POST', '/api/truck', truck()); ok('POST sin PIN => 401', r.s === 401, r.s);
  r = await req('POST', '/api/pin-check', {}, '0000'); ok('pin-check PIN malo => 401', r.s === 401);
  r = await req('POST', '/api/pin-check', {}, '4321'); ok('pin-check PIN bueno => 200', r.s === 200);
  r = await req('POST', '/api/truck', truck(), '4321'); ok('POST con PIN => 200 y sin needGeometry', r.s === 200 && !JSON.parse(r.b).needGeometry, r.b);
  r = await req('GET', '/api/truck'); const t = JSON.parse(r.b).trucks[0];
  ok('campos no permitidos descartados', t && !('evil' in t) && !('evil' in t.stops[0]), Object.keys(t).join(','));
  r = await req('POST', '/api/truck', truck({ geometry: undefined, ts: Date.now() + 10 }), '4321');
  ok('sin geometria conserva la anterior', JSON.parse((await req('GET', '/api/truck')).b).trucks[0].geometry.length === 5);
  const before = JSON.parse((await req('GET', '/api/truck')).b).trucks[0];
  r = await req('POST', '/api/truck', truck({ lat: 4.9, ts: Date.now() - 8000 }), '4321');
  ok('envio retrasado NO hace retroceder al camion', JSON.parse(r.b).stale === true && JSON.parse((await req('GET', '/api/truck')).b).trucks[0].lat === before.lat, r.b);
  r = await req('POST', '/api/truck', truck({ geometry: [[1, 2], 'x'] , id: 'camion-NUEVO'}), '4321');
  ok('geometria invalida => se descarta y pide needGeometry', r.s === 200 && JSON.parse(r.b).needGeometry === true, r.b);
  for (let i = 0; i < 40; i++) await req('POST', '/api/truck', truck({ id: 'x' + i }), '4321');
  r = await req('POST', '/api/truck', truck({ id: 'uno-mas' }), '4321'); ok('tope de camiones => 429', r.s === 429, r.s);
  // fuerza bruta: 10 fallos y luego el PIN CORRECTO debe seguir bloqueado
  for (let i = 0; i < 12; i++) await req('POST', '/api/pin-check', {}, 'mal' + i);
  r = await req('POST', '/api/pin-check', {}, '4321'); ok('tras fuerza bruta, ni el PIN correcto pasa (429)', r.s === 429, r.s);
  r = await req('GET', '/tiles/15/9000/15000.png'); ok('/tiles valido responde (502 sin internet es normal)', [200, 404, 502, 504].includes(r.s), r.s);
  r = await req('GET', '/tiles/5/1/1.png'); ok('/tiles fuera de zoom => 404', r.s === 404, r.s);
  r = await req('GET', '/fonts/Poppins-Bold.woff'); ok('fuente servida', r.s === 200);
  r = await req('GET', '/..%2f..%2fserver.cjs'); ok('path traversal bloqueado', r.s !== 200, r.s);
  srv.kill();
})();
