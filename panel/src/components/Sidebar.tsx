import React from 'react';
import {
  AlertTriangle,
  LayoutDashboard,
  Leaf,
  Map as MapIcon,
  Plug,
  Route,
  Send,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ApiConfig, DashboardTab } from '../types/ecoruta';

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  pendingIncidentsCount: number;
  onlineCollectorsCount: number;
  apiConfig: ApiConfig;
  wsConnected: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  pendingIncidentsCount,
  onlineCollectorsCount,
  apiConfig,
  wsConnected,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const navItems: NavItem[] = [
    { id: 'send', label: 'Enviar', icon: Send },
    { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
    {
      id: 'map',
      label: 'Mapa en Vivo',
      icon: MapIcon,
      badgeCount: onlineCollectorsCount,
    },
    { id: 'routes', label: 'Rutas', icon: Route },
    { id: 'users', label: 'Usuarios', icon: Users },
    {
      id: 'incidents',
      label: 'Alertas',
      icon: AlertTriangle,
      badgeCount: pendingIncidentsCount,
    },
    { id: 'api-settings', label: 'Conexión API', icon: Plug },
  ];

  const handleNavClick = (id: DashboardTab) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const renderSidebarContent = (isMobile: boolean) => (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100 select-none">
      {/* Brand header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between px-6 py-6"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <motion.div
            initial={{ scale: 0.7, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ rotate: 10, scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 360, damping: 20 }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-sm"
          >
            <Leaf className="h-6 w-6" />
          </motion.div>
          <div className="min-w-0">
            <div className="font-display text-lg font-bold tracking-tight text-white truncate">
              EcoRuta
            </div>
            <div className="text-xs text-slate-400 truncate">
              Líbano, Tolima
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="h-5 w-5" />
        </button>
      </motion.div>

      {/* Navigation */}
      <nav
        className="flex-1 px-4 py-3 space-y-2 overflow-y-auto"
        aria-label="Navegación principal"
      >
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.05 + idx * 0.04,
                duration: 0.28,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNavClick(item.id)}
              className={`relative w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-colors whitespace-nowrap ${
                isActive ? 'text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={isMobile ? 'mobileNavPill' : 'desktopNavPill'}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-2xl bg-emerald-500 shadow-md shadow-emerald-950/30"
                  aria-hidden="true"
                />
              )}
              {!isActive && (
                <span
                  className="absolute inset-0 rounded-2xl bg-transparent hover:bg-slate-800/80 transition-colors"
                  aria-hidden="true"
                />
              )}

              <span className="relative z-10 flex items-center gap-3.5 min-w-0">
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </span>

              {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                <motion.span
                  key={item.badgeCount}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`relative z-10 font-mono text-xs font-bold tabular-nums px-2 py-0.5 rounded-lg ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : item.id === 'incidents'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badgeCount}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Friendly Connection Card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="p-4"
      >
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavClick('api-settings')}
          className="w-full text-left rounded-2xl bg-slate-800/75 hover:bg-slate-800 border border-slate-700/60 p-4 transition-colors"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-white truncate">
              {apiConfig.useMockData ? 'Modo Prueba' : 'Servidor Real'}
            </span>
            <span
              className={`text-xs font-bold whitespace-nowrap ${
                apiConfig.useMockData
                  ? 'text-emerald-400'
                  : wsConnected
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}
            >
              {apiConfig.useMockData
                ? 'Simulado'
                : wsConnected
                ? 'En Línea'
                : 'Conectado'}
            </span>
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400 truncate">
            {apiConfig.useMockData
              ? 'Datos de ejemplo activos'
              : apiConfig.baseUrl}
          </div>
        </motion.button>
      </motion.div>
    </div>
  );

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:block w-[264px] shrink-0 bg-slate-900 lg:sticky lg:top-0 lg:h-screen"
      >
        {renderSidebarContent(false)}
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px]"
              onClick={onCloseMobile}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
              className="relative z-10 w-[272px] max-w-[85vw] h-full shadow-2xl"
            >
              {renderSidebarContent(true)}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
