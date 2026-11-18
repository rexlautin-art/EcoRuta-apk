'use strict';
/*
 * Descarga las teselas del mapa de Libano para meterlas DENTRO de la app Android (mapa sin internet).
 * Uso:  node servidor/descargar_mapa.cjs        (o doble clic en descargar_mapa.bat / .sh)
 * Despues vuelve a compilar la app en Android Studio: las teselas quedan en app/src/main/assets/tiles.
 *
 *  - Cubre el mismo rectangulo que el mapa de la app (config.json > tileBounds, por defecto el de Libano).
 *  - Si el servidor ya guardo teselas (servidor/datos/tiles), las reutiliza sin pedirlas de nuevo.
 *  - Es una descarga de una sola vez (~700 imagenes) y respeta la politica de OpenStreetMap:
 *    se identifica con tu contacto y va despacio. Si cambias el area o los zoom, hazlo con moderacion.
 *  - Si se interrumpe, se puede repetir: continua donde quedo.
 * Opciones: --zmin 13 --zmax 17 --out <carpeta>
 */
const fs = require('fs');
const path = require('path');

if (parseInt(process.versions.node, 10) < 18) {
  console.error('Necesitas Node.js 18 o superior. Version actual: ' + process.versions.node);
  process.exit(1);
}

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};

let cfg = {};
try {
  cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
} catch (e) {
  if (e.code !== 'ENOENT') console.warn('Aviso: config.json no es valido (' + e.message + '). Se ignora.');
}
const B = cfg.tileBounds || { s: 4.893, n: 4.95, w: -75.093, e: -75.035 };
const TILE_URL = String(process.env.TILE_URL || cfg.tileUrl || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png').trim();
const CONTACT = String(process.env.ECORUTA_CONTACT || cfg.contact || '').replace(/[^\x20-\x7E]/g, '').trim();
const UA = 'EcoRuta/1.0 (recoleccion de residuos Libano Tolima' + (CONTACT ? '; ' + CONTACT : '') + ')';
const OUT = path.resolve(opt('out', path.join(__dirname, '..', 'app', 'src', 'main', 'assets', 'tiles')));
const CACHE = path.join(__dirname, 'datos', 'tiles');
const ZMIN = Number(opt('zmin', 13));
const ZMAX = Number(opt('zmax', 17));
const CONCURRENCY = 2;
const PAUSE_MS = 120;

const lngToX = (lng, z) => Math.floor((lng + 180) / 360 * Math.pow(2, z));
const latToY = (lat, z) => {
  const r = lat * Math.PI / 180;
  return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * Math.pow(2, z));
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const tiles = [];
for (let z = ZMIN; z <= ZMAX; z++) {
  for (let x = lngToX(B.w, z); x <= lngToX(B.e, z); x++) {
    for (let y = latToY(B.n, z); y <= latToY(B.s, z); y++) tiles.push({ z, x, y });
  }
}

const stats = { skipped: 0, fromCache: 0, downloaded: 0, failed: [] };
const fileOf = (t) => path.join(OUT, String(t.z), String(t.x), t.y + '.png');
const isTile = (f) => { try { return fs.statSync(f).size > 50; } catch (e) { return false; } };

function save(file, buf) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, buf);
  fs.renameSync(tmp, file);
}

async function fetchTile(t) {
  const url = TILE_URL.replace('{z}', t.z).replace('{x}', t.x).replace('{y}', t.y);
  let lastError = '';
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'image/png,image/*' }, signal: AbortSignal.timeout(10000) });
      if (r.ok && /^image\//.test(r.headers.get('content-type') || '')) {
        const buf = Buffer.from(await r.arrayBuffer());
        if (buf.length > 50 && buf.length < 500000) return buf;
        lastError = 'imagen invalida';
      } else {
        lastError = 'HTTP ' + r.status;
      }
    } catch (e) {
      lastError = e.name === 'TimeoutError' ? 'tiempo agotado' : (e.cause && e.cause.code) || e.message;
    }
    await sleep(500 * attempt);
  }
  throw new Error(lastError);
}

async function handle(t) {
  const file = fileOf(t);
  if (isTile(file)) { stats.skipped++; return; }
  const cached = path.join(CACHE, String(t.z), String(t.x), t.y + '.png');
  if (isTile(cached)) { save(file, fs.readFileSync(cached)); stats.fromCache++; return; }
  try {
    save(file, await fetchTile(t));
    stats.downloaded++;
    await sleep(PAUSE_MS);
  } catch (e) {
    stats.failed.push(t.z + '/' + t.x + '/' + t.y + ' (' + e.message + ')');
  }
}

async function main() {
  console.log('\nMapa sin internet para la app: ' + tiles.length + ' teselas (zoom ' + ZMIN + ' a ' + ZMAX + ')');
  console.log('Destino: ' + OUT);
  if (!CONTACT) console.log('Aviso: pon tu correo en servidor/config.json ("contact"): la politica de OpenStreetMap lo pide.');
  console.log('');
  const queue = tiles.slice();
  let done = 0;
  const worker = async () => {
    for (let t = queue.shift(); t; t = queue.shift()) {
      await handle(t);
      done++;
      if (done % 50 === 0 || done === tiles.length) process.stdout.write('\r  ' + done + ' / ' + tiles.length);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  let bytes = 0;
  for (const t of tiles) { try { bytes += fs.statSync(fileOf(t)).size; } catch (e) { /* falta */ } }
  console.log('\n\nListo: ' + stats.downloaded + ' descargadas, ' + stats.fromCache + ' tomadas del servidor, ' +
    stats.skipped + ' ya estaban, ' + stats.failed.length + ' con error.');
  console.log('Tamano total de las teselas: ' + (bytes / 1048576).toFixed(1) + ' MB (es lo que crece el APK).');
  if (stats.failed.length) {
    console.log('\nNo se pudieron descargar (primeras 10):');
    stats.failed.slice(0, 10).forEach((f) => console.log('  - ' + f));
    console.log('\nVuelve a ejecutar este programa: continua donde quedo.');
    process.exit(1);
  }
  console.log('\nSiguiente paso: abre el proyecto en Android Studio y vuelve a compilar la app.');
}
main();
