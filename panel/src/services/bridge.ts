/**
 * APP EMISORA: capa de transporte y de preparación de contenido.
 * Sigue el contrato de contrato/protocolo.md: todo viaja con la misma "etiqueta"
 * (Content-Type, X-Type, X-Name) y el puente guarda bytes sin saber qué son.
 *
 *  - Api      -> TRANSPORTE. No conoce ningún tipo de contenido.
 *  - Senders  -> CONTENIDO. Un envío por tipo; para un tipo nuevo se agrega una función aquí
 *                (y su renderizador en la receptora: assets/web/puente/renderers.js).
 */

export interface ItemMeta {
  id: string;
  type: string;
  mime: string;
  name: string;
  size: number;
  stamp: number;
}

export interface BridgeConfig {
  baseUrl: string;
  pin: string;
}

const KEY = 'ecoruta_puente_v1';
export const DEFAULT_BRIDGE: BridgeConfig = { baseUrl: 'http://localhost:3000', pin: '' };

export function loadBridgeConfig(): BridgeConfig {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null;
    return raw ? { ...DEFAULT_BRIDGE, ...(JSON.parse(raw) as Partial<BridgeConfig>) } : DEFAULT_BRIDGE;
  } catch {
    return DEFAULT_BRIDGE;
  }
}

export function saveBridgeConfig(cfg: BridgeConfig): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(cfg));
  } catch {
    /* almacenamiento no disponible */
  }
}

/** Convierte "192.168.1.20:3000" en "http://192.168.1.20:3000" y quita barras finales. */
export function normalizeBase(url: string): string {
  const t = url.trim().replace(/\/+$/, '');
  if (!t) return '';
  return /^https?:\/\//i.test(t) ? t : `http://${t}`;
}

async function http(cfg: BridgeConfig, path: string, init: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const base = normalizeBase(cfg.baseUrl);
  if (!base) throw new Error('Escribe la dirección del puente.');
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const headers = new Headers(init.headers);
    if (cfg.pin.trim()) headers.set('x-pin', cfg.pin.trim());
    const r = await fetch(base + path, { ...init, headers, cache: 'no-store', signal: ctrl.signal });
    if (!r.ok) {
      if (r.status === 401) throw new Error('PIN incorrecto.');
      if (r.status === 403) throw new Error('El puente rechazó la acción. Si lo abres por internet, configura un PIN en servidor/config.json.');
      if (r.status === 429) throw new Error('Demasiados intentos o envíos seguidos. Espera un momento.');
      if (r.status === 413) throw new Error('El archivo es demasiado grande (máximo 20 MB).');
      throw new Error(`El puente respondió ${r.status}.`);
    }
    return r;
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') throw new Error('El puente no respondió a tiempo.');
    if (e instanceof TypeError) throw new Error('No llego al puente. ¿Está abierto en este PC (iniciar_ecoruta)?');
    throw e;
  } finally {
    clearTimeout(t);
  }
}

// ---------------------------------------------------------------- TRANSPORTE
export const Api = {
  async ping(cfg: BridgeConfig): Promise<{ ok: boolean; version: number; boot: number }> {
    return (await http(cfg, '/api/ping', {}, 4000)).json();
  },
  async list(cfg: BridgeConfig, since = 0): Promise<ItemMeta[]> {
    return (await http(cfg, `/api/items?since=${since}`)).json();
  },
  async send(cfg: BridgeConfig, blob: Blob, type: string, name: string): Promise<ItemMeta> {
    const r = await http(
      cfg,
      '/api/items',
      {
        method: 'POST',
        headers: {
          'Content-Type': blob.type || 'application/octet-stream',
          'X-Type': type,
          'X-Name': encodeURIComponent(name || ''),
        },
        body: blob,
      },
      60000
    );
    return r.json();
  },
  async remove(cfg: BridgeConfig, id: string): Promise<void> {
    await http(cfg, `/api/items/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
};

// ------------------------------------------------------- CONECTAR CELULARES (2.4.0)
// Enlace por internet + codigos de vinculacion. Solo se administran desde este PC (o con PIN).
export interface LinkCode {
  code: string;
  label: string;
  created: number;
  maxUses: number;
  revoked: boolean;
  devices: number;
}

export interface LinksInfo {
  requireLink: boolean;
  pinSet: boolean;
  tunnel: { mode: string; state: 'off' | 'manual' | 'starting' | 'on' | 'error'; url: string; error: string };
  lan: string[];
  codes: LinkCode[];
}

export const Links = {
  async info(cfg: BridgeConfig): Promise<LinksInfo> {
    return (await http(cfg, '/api/links', {}, 5000)).json();
  },
  async create(cfg: BridgeConfig, label: string, maxUses: number): Promise<LinkCode> {
    return (
      await http(cfg, '/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, maxUses }),
      })
    ).json();
  },
  async revoke(cfg: BridgeConfig, code: string): Promise<void> {
    await http(cfg, `/api/links/${encodeURIComponent(code)}`, { method: 'DELETE' });
  },
};

/** Mensaje listo para mandar por WhatsApp: la app del celular saca de aqui el enlace y el codigo. */
export function shareMessage(url: string, code: string): string {
  return (
    'Hola 👋 Para recibir los avisos de EcoRuta:\n' +
    '1) Abre la app EcoRuta en tu celular.\n' +
    '2) Pega este mensaje en la pantalla "Conectar con la central" (o escribe el enlace y el código).\n\n' +
    `Enlace: ${url}\n` +
    `Código: ${code}`
  );
}

// ------------------------------------------------------------------ CONTENIDO
export interface Aviso {
  title: string;
  body: string;
  priority: 'normal' | 'alta';
}

export interface RutaMsg {
  name: string;
  days: string[];
  time: string;
  neighborhoods: string[];
  notes: string;
}

const jsonBlob = (o: unknown) => new Blob([JSON.stringify(o)], { type: 'application/json' });

export const Senders = {
  aviso: (cfg: BridgeConfig, a: Aviso) => Api.send(cfg, jsonBlob(a), 'aviso', 'aviso.json'),
  ruta: (cfg: BridgeConfig, r: RutaMsg) => Api.send(cfg, jsonBlob(r), 'ruta', 'ruta.json'),
  text: (cfg: BridgeConfig, texto: string) =>
    Api.send(cfg, new Blob([texto], { type: 'text/plain' }), 'text', 'nota.txt'),
  json: (cfg: BridgeConfig, obj: unknown) => Api.send(cfg, jsonBlob(obj), 'json', 'datos.json'),
  html: (cfg: BridgeConfig, html: string) =>
    Api.send(cfg, new Blob([html], { type: 'text/html' }), 'html', 'pagina.html'),
  image: (cfg: BridgeConfig, file: File) => Api.send(cfg, file, 'image', file.name),
  file: (cfg: BridgeConfig, file: File) => Api.send(cfg, file, 'file', file.name),
};
