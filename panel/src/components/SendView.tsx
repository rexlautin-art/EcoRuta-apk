import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Eye,
  EyeOff,
  Globe,
  Megaphone,
  Paperclip,
  RefreshCw,
  Route as RouteIcon,
  Send,
  Trash2,
  Type as TypeIcon,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { ConnectPhones } from './ConnectPhones';
import {
  Api,
  Senders,
  loadBridgeConfig,
  saveBridgeConfig,
  type BridgeConfig,
  type ItemMeta,
} from '../services/bridge';

/**
 * APP EMISORA: manda contenido a la app del celular a través del puente.
 * No administra datos: cada envío es un mensaje (aviso, ruta, texto, imagen, archivo, página).
 */

type Mode = 'aviso' | 'ruta' | 'text' | 'file' | 'html';

const MODES: { id: Mode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'aviso', label: 'Aviso', icon: Megaphone },
  { id: 'ruta', label: 'Ruta', icon: RouteIcon },
  { id: 'text', label: 'Texto', icon: TypeIcon },
  { id: 'file', label: 'Imagen / archivo', icon: Paperclip },
  { id: 'html', label: 'Página', icon: Globe },
];

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const TYPE_LABEL: Record<string, string> = {
  aviso: 'Aviso',
  ruta: 'Ruta',
  text: 'Texto',
  image: 'Imagen',
  file: 'Archivo',
  html: 'Página',
  json: 'Datos',
};

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none';
const labelCls = 'block text-xs font-bold text-slate-700 mb-1.5';

function kb(n: number): string {
  return n < 1024 ? `${n} B` : n < 1048576 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`;
}

export function SendView() {
  const [cfg, setCfg] = useState<BridgeConfig>(() => loadBridgeConfig());
  const [showPin, setShowPin] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);
  const [mode, setMode] = useState<Mode>('aviso');
  const [items, setItems] = useState<ItemMeta[]>([]);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  // formularios
  const [avisoTitle, setAvisoTitle] = useState('');
  const [avisoBody, setAvisoBody] = useState('');
  const [avisoAlta, setAvisoAlta] = useState(false);
  const [rutaName, setRutaName] = useState('');
  const [rutaDays, setRutaDays] = useState<string[]>([]);
  const [rutaTime, setRutaTime] = useState('');
  const [rutaBarrios, setRutaBarrios] = useState('');
  const [rutaNotes, setRutaNotes] = useState('');
  const [texto, setTexto] = useState('');
  const [html, setHtml] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    try {
      await Api.ping(cfg);
      setItems((await Api.list(cfg, 0)).slice().reverse());
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, [cfg]);

  useEffect(() => {
    void refresh();
    const t = window.setInterval(() => void refresh(), 5000);
    return () => window.clearInterval(t);
  }, [refresh]);

  function updateCfg(next: BridgeConfig) {
    setCfg(next);
    saveBridgeConfig(next);
  }

  const canSend =
    !busy &&
    ((mode === 'aviso' && avisoTitle.trim().length > 0) ||
      (mode === 'ruta' && rutaName.trim().length > 0) ||
      (mode === 'text' && texto.trim().length > 0) ||
      (mode === 'file' && !!file) ||
      (mode === 'html' && html.trim().length > 0));

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setBusy(true);
    setFeedback(null);
    try {
      if (mode === 'aviso') {
        await Senders.aviso(cfg, {
          title: avisoTitle.trim(),
          body: avisoBody.trim(),
          priority: avisoAlta ? 'alta' : 'normal',
        });
        setAvisoTitle('');
        setAvisoBody('');
        setAvisoAlta(false);
      } else if (mode === 'ruta') {
        await Senders.ruta(cfg, {
          name: rutaName.trim(),
          days: rutaDays,
          time: rutaTime.trim(),
          neighborhoods: rutaBarrios
            .split(/[\n,]/)
            .map((s) => s.trim())
            .filter(Boolean),
          notes: rutaNotes.trim(),
        });
        setRutaName('');
        setRutaDays([]);
        setRutaTime('');
        setRutaBarrios('');
        setRutaNotes('');
      } else if (mode === 'text') {
        await Senders.text(cfg, texto.trim());
        setTexto('');
      } else if (mode === 'file' && file) {
        await (file.type.startsWith('image/') ? Senders.image(cfg, file) : Senders.file(cfg, file));
        setFile(null);
        if (fileRef.current) fileRef.current.value = '';
      } else if (mode === 'html') {
        await Senders.html(cfg, html);
        setHtml('');
      }
      setFeedback({ ok: true, text: 'Enviado. Los celulares conectados lo reciben en unos segundos.' });
      await refresh();
    } catch (err) {
      setFeedback({ ok: false, text: err instanceof Error ? err.message : 'No se pudo enviar.' });
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      await Api.remove(cfg, id);
      await refresh();
    } catch (err) {
      setFeedback({ ok: false, text: err instanceof Error ? err.message : 'No se pudo borrar.' });
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div className="xl:col-span-7 space-y-6">
        {/* Conexión con el puente */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-slate-900">Puente</h2>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                online === null
                  ? 'bg-slate-100 text-slate-500'
                  : online
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
              }`}
            >
              {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
              {online === null ? 'Comprobando…' : online ? 'Conectado' : 'Sin conexión'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="puente-url">
                Dirección del puente
              </label>
              <input
                id="puente-url"
                className={`${inputCls} font-mono text-xs`}
                value={cfg.baseUrl}
                onChange={(e) => updateCfg({ ...cfg, baseUrl: e.target.value })}
                placeholder="http://localhost:3000"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="puente-pin">
                PIN (si el servidor lo tiene)
              </label>
              <div className="relative">
                <input
                  id="puente-pin"
                  type={showPin ? 'text' : 'password'}
                  className={`${inputCls} font-mono text-xs pr-10`}
                  value={cfg.pin}
                  onChange={(e) => updateCfg({ ...cfg, pin: e.target.value })}
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => setShowPin((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          {online === false && (
            <p className="text-xs text-slate-500">
              Abre el puente en este PC con <span className="font-mono">iniciar_ecoruta</span> (carpeta de la app
              del celular). Si el celular está en otra red, ábrelo con <span className="font-mono">iniciar_ecoruta_internet</span>.
            </p>
          )}
        </section>

        {/* Conectar celulares: enlace por internet + códigos de vinculación */}
        <ConnectPhones cfg={cfg} />

        {/* Redactar y enviar */}
        <form onSubmit={handleSend} className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-5">
          <h2 className="font-display text-lg font-bold text-slate-900">Enviar a la app</h2>
          <div className="flex flex-wrap gap-1 rounded-2xl bg-slate-100 p-1">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setMode(m.id);
                  setFeedback(null);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  mode === m.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <m.icon className="h-3.5 w-3.5" />
                {m.label}
              </button>
            ))}
          </div>

          {mode === 'aviso' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls} htmlFor="av-title">Título</label>
                <input id="av-title" className={inputCls} maxLength={120} value={avisoTitle} onChange={(e) => setAvisoTitle(e.target.value)} placeholder="Ej.: Cambio de horario" />
              </div>
              <div>
                <label className={labelCls} htmlFor="av-body">Mensaje</label>
                <textarea id="av-body" className={inputCls} rows={4} maxLength={1000} value={avisoBody} onChange={(e) => setAvisoBody(e.target.value)} />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={avisoAlta} onChange={(e) => setAvisoAlta(e.target.checked)} />
                Marcar como importante
              </label>
            </div>
          )}

          {mode === 'ruta' && (
            <div className="space-y-4">
              <div>
                <label className={labelCls} htmlFor="ru-name">Nombre de la ruta</label>
                <input id="ru-name" className={inputCls} maxLength={80} value={rutaName} onChange={(e) => setRutaName(e.target.value)} placeholder="Ej.: Ruta Centro" />
              </div>
              <div>
                <span className={labelCls}>Días</span>
                <div className="flex gap-1.5">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setRutaDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]))}
                      className={`h-9 w-9 rounded-xl text-xs font-bold border ${
                        rutaDays.includes(d) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls} htmlFor="ru-time">Horario</label>
                <input id="ru-time" className={inputCls} maxLength={40} value={rutaTime} onChange={(e) => setRutaTime(e.target.value)} placeholder="Ej.: 6:00 - 10:00" />
              </div>
              <div>
                <label className={labelCls} htmlFor="ru-barrios">Barrios (separados por coma o salto de línea)</label>
                <textarea id="ru-barrios" className={inputCls} rows={3} value={rutaBarrios} onChange={(e) => setRutaBarrios(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="ru-notes">Notas</label>
                <input id="ru-notes" className={inputCls} maxLength={300} value={rutaNotes} onChange={(e) => setRutaNotes(e.target.value)} />
              </div>
            </div>
          )}

          {mode === 'text' && (
            <div>
              <label className={labelCls} htmlFor="tx">Texto</label>
              <textarea id="tx" className={inputCls} rows={6} maxLength={5000} value={texto} onChange={(e) => setTexto(e.target.value)} />
            </div>
          )}

          {mode === 'file' && (
            <div>
              <label className={labelCls} htmlFor="fl">Imagen o archivo (máx. 20 MB)</label>
              <input
                id="fl"
                ref={fileRef}
                type="file"
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-emerald-700"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file && <p className="mt-2 text-xs text-slate-500">{file.name} · {kb(file.size)}</p>}
            </div>
          )}

          {mode === 'html' && (
            <div>
              <label className={labelCls} htmlFor="ht">Página HTML</label>
              <textarea id="ht" className={`${inputCls} font-mono text-xs`} rows={8} value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<h1>Hola</h1>" />
              <p className="mt-1 text-xs text-slate-500">En el celular se muestra aislada: sin scripts ni permisos.</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Send className="h-4 w-4" />
              {busy ? 'Enviando…' : 'Enviar'}
            </button>
            {feedback && (
              <span className={`text-xs font-semibold ${feedback.ok ? 'text-emerald-700' : 'text-red-700'}`} role="status">
                {feedback.text}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Enviados */}
      <section className="xl:col-span-5 rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">Enviados</h2>
          <button type="button" onClick={() => void refresh()} className="text-slate-400 hover:text-slate-700" aria-label="Actualizar">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">Todavía no has enviado nada.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((it) => (
              <li key={it.id} className="flex items-center gap-3 py-2.5">
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                  {TYPE_LABEL[it.type] ?? it.type}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-slate-800">{it.name}</span>
                  <span className="block text-xs text-slate-400">
                    {new Date(it.stamp).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {kb(it.size)}
                  </span>
                </span>
                <button type="button" onClick={() => void handleRemove(it.id)} className="text-slate-400 hover:text-red-600" aria-label={`Borrar ${it.name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
