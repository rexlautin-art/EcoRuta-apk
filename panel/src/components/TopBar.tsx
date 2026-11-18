import React from 'react';
import { Download, Menu, Plus, RefreshCw, Settings2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ApiConfig, DashboardTab } from '../types/ecoruta';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

interface TopBarProps {
  activeTab: DashboardTab;
  apiConfig: ApiConfig;
  isSyncing: boolean;
  onOpenMobileMenu: () => void;
  onRefreshData: () => void;
  onOpenNewRoute: () => void;
  onNavigateApiSettings: () => void;
}

const TAB_TITLES: Record<DashboardTab, string> = {
  send: 'Enviar a la app',
  overview: 'Resumen Hoy',
  map: 'Mapa en Vivo',
  routes: 'Rutas Ecológicas',
  users: 'Flota y Usuarios',
  incidents: 'Alertas Móviles',
  'api-settings': 'Conexión API',
};

export function TopBar({
  activeTab,
  apiConfig,
  isSyncing,
  onOpenMobileMenu,
  onRefreshData,
  onOpenNewRoute,
  onNavigateApiSettings,
}: TopBarProps) {
  const { canInstall, install } = useInstallPrompt();
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm px-5 sm:px-8"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={onOpenMobileMenu}
          className="lg:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </motion.button>

        <AnimatePresence mode="wait">
          <motion.h1
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 truncate"
          >
            {TAB_TITLES[activeTab]}
          </motion.h1>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2.5 sm:gap-3 shrink-0"
      >
        {canInstall && (
          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={install}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Instalar app</span>
          </motion.button>
        )}

        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNavigateApiSettings}
          className={`hidden md:inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
            apiConfig.useMockData
              ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
          }`}
        >
          <Settings2 className="h-4 w-4" />
          <span>{apiConfig.useMockData ? 'Modo Prueba' : 'Servidor Activo'}</span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRefreshData}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isSyncing ? 'animate-spin text-emerald-600' : 'text-slate-500'
            }`}
          />
          <span className="hidden sm:inline">Actualizar Datos</span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenNewRoute}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Crear Ruta</span>
        </motion.button>
      </motion.div>
    </motion.header>
  );
}
