import React, { useCallback, useEffect, useState } from 'react';
import { Ban, Check, Copy, Globe, Link2, Plus, Smartphone } from 'lucide-react';
import { Links, shareMessage, type BridgeConfig, type LinksInfo } from '../services/bridge';

/**
 * CONECTAR CELULARES: muestra el enlace por internet del puente y administra los códigos de vinculación.
 * Un código se canjea una sola vez en cada celular; al desactivarlo, esos celulares dejan de recibir.
 */

const inputCls =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none';
const labelCls = 'block text-xs font-bold text-slate-700 mb-1.5';

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ConnectPhones({ cfg }: { cfg: BridgeConfig }) {
  const [info, setInfo] = useState<LinksInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  const [maxUses, setMaxUses] = useState(25);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setInfo(await Links.info(cfg));
      setError(null);
    } catch (e) {
      setInfo(null);
      setError(e instanceof Error ? e.message : 'No pude consultar el puente.');
    }
  }, [cfg]);

  // Se refresca solo: el túnel tarda unos segundos en tener dirección y los celulares se vinculan en cualquier momento.
  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 4000);
    return () => clearInterval(t);
  }, [load]);

  const flash = (key: string) => {
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
  };

  const publicUrl = info && (info.tunnel.state === 'on' || info.tunnel.state === 'manual') ? info.tunnel.url : '';
  const shareUrl = publicUrl || (info && info.lan[0]) || '';

  async function createCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await Links.create(cfg, label.trim(), maxUses);
      setLabel('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pude crear el código.');
    } finally {
      setBusy(false);
    }
  }

  async function revoke(code: string, name: string) {
    if (!window.confirm(`¿Desactivar el código de "${name}"?\n\nLos celulares que entraron con él dejarán de recibir mensajes.`)) return;
    try {
      await Links.revoke(cfg, code);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pude desactivar el código.');
    }
  }

  const stateChip = (() => {
    if (!info) return { cls: 'bg-slate-100 text-slate-500', text: 'Comprobando…' };
    switch (info.tunnel.state) {
      case 'on':
      case 'manual':
        return { cls: 'bg-emerald-50 text-emerald-700', text: 'Internet activo' };
      case 'starting':
        return { cls: 'bg-amber-50 text-amber-700', text: 'Abriendo enlace…' };
      case 'error':
        return { cls: 'bg-red-50 text-red-700', text: 'Error en el enlace' };
      default:
        return { cls: 'bg-slate-100 text-slate-600', text: 'Solo Wi-Fi local' };
    }
  })();

  const active = info ? info.codes.filter((c) => !c.revoked) : [];
  const revoked = info ? info.codes.filter((c) => c.revoked) : [];

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-slate-900 inline-flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-emerald-600" />
          Conectar celulares
        </h2>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${stateChip.cls}`}>
          <Globe className="h-3.5 w-3.5" />
          {stateChip.text}
        </span>
      </div>

      {error && <p className="text-xs text-red-700 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

      {info && (
        <>
          {/* Dirección que usan los celulares */}
          {shareUrl ? (
            <div>
              <label className={labelCls}>{publicUrl ? 'Enlace por internet (funciona en cualquier red)' : 'Dirección en tu Wi-Fi (solo la misma red)'}</label>
              <div className="flex gap-2">
                <input readOnly className={`${inputCls} font-mono text-xs`} value={shareUrl} onFocus={(e) => e.currentTarget.select()} />
                <button
                  type="button"
                  onClick={async () => {
                    if (await copy(shareUrl)) flash('url');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  {copied === 'url' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  Copiar
                </button>
              </div>
            </div>
          ) : null}

          {info.tunnel.state === 'off' && (
            <p className="text-xs text-slate-500">
              El enlace por internet está apagado. Cierra EcoRuta y ábrelo con{' '}
              <span className="font-mono">iniciar_ecoruta_internet</span> para que los celulares conecten desde cualquier red.
            </p>
          )}
          {info.tunnel.state === 'starting' && (
            <p className="text-xs text-slate-500">Abriendo el túnel de Cloudflare. Tarda unos segundos la primera vez (descarga cloudflared).</p>
          )}
          {info.tunnel.error && <p className="text-xs text-red-700">{info.tunnel.error}</p>}
          {info.tunnel.mode === 'quick' && info.tunnel.state === 'on' && (
            <p className="text-xs text-slate-500">
              Esta dirección cambia cada vez que reinicias EcoRuta. Si pasa, vuelve a copiar el mensaje y mándalo: el código sigue valiendo y el celular no gasta otro cupo.
            </p>
          )}
          {publicUrl && !info.pinSet && (
            <p className="text-xs text-slate-500">
              Sin PIN, nadie desde internet puede publicar ni borrar nada: solo tú desde este PC. Si los conductores publican su ruta por internet, pon{' '}
              <span className="font-mono">&quot;pin&quot;</span> en <span className="font-mono">servidor/config.json</span>.
            </p>
          )}

          {/* Crear código */}
          <form onSubmit={createCode} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_auto] gap-3 items-end">
            <div>
              <label className={labelCls} htmlFor="cc-label">
                Para quién es (opcional)
              </label>
              <input id="cc-label" className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Barrio Centro, Conductores…" maxLength={40} />
            </div>
            <div>
              <label className={labelCls} htmlFor="cc-max">
                Celulares
              </label>
              <input id="cc-max" type="number" min={1} max={1000} className={inputCls} value={maxUses} onChange={(e) => setMaxUses(Math.max(1, Number(e.target.value) || 1))} />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Crear código
            </button>
          </form>

          {/* Códigos activos */}
          {active.length === 0 ? (
            <p className="text-xs text-slate-500">Aún no hay códigos. Crea uno y mándalo a los celulares que deben recibir los mensajes.</p>
          ) : (
            <ul className="space-y-2">
              {active.map((c) => (
                <li key={c.code} className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <Link2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-sm font-bold text-slate-900 tracking-wide">{c.code}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {c.label} · {c.devices} de {c.maxUses} celulares
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!shareUrl}
                    onClick={async () => {
                      if (await copy(shareMessage(shareUrl, c.code))) flash(c.code);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                  >
                    {copied === c.code ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    {copied === c.code ? 'Copiado' : 'Copiar mensaje'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void revoke(c.code, c.label)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
                  >
                    <Ban className="h-4 w-4" />
                    Desactivar
                  </button>
                </li>
              ))}
            </ul>
          )}
          {revoked.length > 0 && <p className="text-xs text-slate-400">{revoked.length} código(s) desactivado(s) — ya no reciben mensajes.</p>}
        </>
      )}
    </section>
  );
}
