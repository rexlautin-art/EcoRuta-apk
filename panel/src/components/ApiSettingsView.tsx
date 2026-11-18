import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Database,
  Eye,
  EyeOff,
  PlugZap,
  RotateCcw,
  Save,
  Server,
  XCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ecoRutaApi,
  REST_ENDPOINTS_SPEC,
  SERVER_CJS_SNIPPET,
} from '../services/apiClient';
import type { ApiConfig, ConnectionTestResult } from '../types/ecoruta';

interface ApiSettingsViewProps {
  config: ApiConfig;
  onSaveConfig: (next: ApiConfig) => void;
  onResetMockData: () => void;
}

const METHOD_COLORS: Record<string, string> = {
  GET: 'text-emerald-700 bg-emerald-50',
  POST: 'text-sky-700 bg-sky-50',
  PUT: 'text-amber-800 bg-amber-50',
  PATCH: 'text-violet-700 bg-violet-50',
  DELETE: 'text-red-700 bg-red-50',
};

export function ApiSettingsView({
  config,
  onSaveConfig,
  onResetMockData,
}: ApiSettingsViewProps) {
  const [draft, setDraft] = useState<ApiConfig>(config);
  const [showToken, setShowToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(
    null
  );
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [moduleFilter, setModuleFilter] = useState<string>('Todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const modules = [
    'Todos',
    'Sistema',
    'Dashboard',
    'Mapa en vivo',
    'Rutas',
    'Usuarios',
    'Incidencias',
  ];

  const filteredEndpoints =
    moduleFilter === 'Todos'
      ? REST_ENDPOINTS_SPEC
      : REST_ENDPOINTS_SPEC.filter((ep) => ep.module === moduleFilter);

  async function handleTestConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await ecoRutaApi.testConnection(draft);
      setTestResult(result);
    } finally {
      setTesting(false);
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSaveConfig(draft);
    setSavedFeedback(true);
    window.setTimeout(() => setSavedFeedback(false), 2500);
  }

  function handleCopy(text: string, id: string) {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  }

  return (
    <div className="space-y-6">
      {/* Main Connection Card */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSave}
          className="xl:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Servidor Node.js
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                {draft.useMockData
                  ? 'Usando datos de prueba locales'
                  : 'Conectado a tu servidor'}
              </span>
            </div>

            <div className="inline-flex items-center gap-1 rounded-2xl bg-slate-100 p-1 self-start sm:self-auto">
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setDraft({ ...draft, useMockData: true })}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  draft.useMockData
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="h-3.5 w-3.5" />
                <span>Modo Prueba</span>
              </motion.button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setDraft({ ...draft, useMockData: false })}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                  !draft.useMockData
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Server className="h-3.5 w-3.5" />
                <span>Servidor Real</span>
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                URL del Servidor
              </label>
              <input
                type="url"
                value={draft.baseUrl}
                onChange={(e) =>
                  setDraft({ ...draft, baseUrl: e.target.value })
                }
                placeholder="http://localhost:3000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                URL WebSocket
              </label>
              <input
                type="text"
                value={draft.wsUrl}
                onChange={(e) => setDraft({ ...draft, wsUrl: e.target.value })}
                placeholder="ws://localhost:3000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Bearer Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={draft.bearerToken}
                  onChange={(e) =>
                    setDraft({ ...draft, bearerToken: e.target.value })
                  }
                  placeholder="Tu token secreto..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-10 py-2.5 font-mono text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label="Ver token"
                >
                  {showToken ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Actualizar Cada
              </label>
              <select
                value={draft.autoRefreshSeconds}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    autoRefreshSeconds: Number(e.target.value),
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-xs font-bold text-slate-900 focus:border-emerald-500 focus:outline-none"
              >
                <option value={3}>3 seg</option>
                <option value={5}>5 seg</option>
                <option value={10}>10 seg</option>
                <option value={30}>30 seg</option>
              </select>
            </div>
          </div>

          <AnimatePresence>
            {testResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl p-4 text-xs font-semibold flex items-center justify-between gap-3 ${
                  testResult.ok
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {testResult.ok ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                  )}
                  {testResult.message}
                </span>
                <span className="font-mono tabular-nums shrink-0">
                  {testResult.latencyMs} ms
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleTestConnection}
                disabled={testing}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                <PlugZap className="h-4 w-4 text-emerald-600" />
                <span>{testing ? 'Probando...' : 'Probar Conexión'}</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={onResetMockData}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Vaciar todo (en blanco)</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-3">
              <AnimatePresence>
                {savedFeedback && (
                  <motion.span
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-bold text-emerald-700"
                  >
                    Guardado
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.button
                type="submit"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
              >
                <Save className="h-4 w-4" />
                <span>Guardar Ajustes</span>
              </motion.button>
            </div>
          </div>
        </motion.form>

        {/* Server.cjs Code Snippet */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="xl:col-span-5 rounded-3xl bg-slate-900 text-slate-100 p-6 space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-base font-bold text-white">
              Código server.cjs
            </h3>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCopy(SERVER_CJS_SNIPPET, 'snippet')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700"
            >
              {copiedId === 'snippet' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </motion.button>
          </div>

          <pre className="overflow-x-auto rounded-2xl bg-slate-950/80 p-4 font-mono text-[11px] leading-relaxed text-emerald-300 max-h-[260px]">
            <code>{SERVER_CJS_SNIPPET}</code>
          </pre>

          <div className="space-y-1.5 font-mono text-[11px] text-slate-300">
            <div className="font-sans text-xs font-bold text-white mb-1">
              Eventos WebSocket (/ws/admin)
            </div>
            <div>
              <span className="text-emerald-400">gps:update</span> ·{' '}
              <span className="text-emerald-400">point:status</span> ·{' '}
              <span className="text-emerald-400">incident:new</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Simple Endpoints List */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Rutas API (REST)
          </h2>

          <div className="flex flex-wrap items-center gap-1 rounded-2xl bg-slate-100 p-1">
            {modules.map((mod) => (
              <motion.button
                key={mod}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setModuleFilter(mod)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                  moduleFilter === mod
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mod}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEndpoints.map((ep, idx) => {
            const key = `${ep.method}-${ep.path}`;
            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.025, duration: 0.2 }}
                whileHover={{ y: -2 }}
                className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 space-y-2.5 transition-shadow hover:shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`inline-flex items-center justify-center rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold shrink-0 ${
                        METHOD_COLORS[ep.method]
                      }`}
                    >
                      {ep.method}
                    </span>
                    <code className="font-mono text-xs font-bold text-slate-900 truncate">
                      {ep.path}
                    </code>
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleCopy(ep.path, `ep-${idx}`)}
                    className="inline-flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 shrink-0"
                  >
                    {copiedId === `ep-${idx}` ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-700">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="text-xs text-slate-600">{ep.description}</div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
