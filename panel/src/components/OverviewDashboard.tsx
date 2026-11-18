import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Route as RouteIcon,
  Truck,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  CollectionPoint,
  CollectorVehicle,
  DailyActivityMetric,
  DashboardTab,
  EcoRoute,
  IncidentReport,
} from '../types/ecoruta';

interface OverviewDashboardProps {
  routes: EcoRoute[];
  collectors: CollectorVehicle[];
  points: CollectionPoint[];
  incidents: IncidentReport[];
  dailyMetrics: DailyActivityMetric[];
  onNavigateTab: (tab: DashboardTab) => void;
  onFocusCollectorOnMap: (collectorId: string) => void;
  onSelectIncident: (incidentId: string) => void;
}

type ChartMetricMode = 'points' | 'compliance';

const cardEntrance = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function OverviewDashboard({
  routes,
  collectors,
  points,
  incidents,
  dailyMetrics,
  onNavigateTab,
  onFocusCollectorOnMap,
  onSelectIncident,
}: OverviewDashboardProps) {
  const [chartMode, setChartMode] = useState<ChartMetricMode>('points');
  const [hoveredDayId, setHoveredDayId] = useState<string | null>(
    dailyMetrics[dailyMetrics.length - 1]?.id ?? null
  );

  const activeRoutesCount = routes.filter((r) => r.active).length;
  const routesPct =
    routes.length > 0 ? Math.round((activeRoutesCount / routes.length) * 100) : 0;

  const onlineCollectorsCount = collectors.filter(
    (c) => c.status === 'online'
  ).length;
  const fleetPct =
    collectors.length > 0
      ? Math.round((onlineCollectorsCount / collectors.length) * 100)
      : 0;

  const completedPointsCount = points.filter(
    (p) => p.status === 'completed'
  ).length;
  const totalPointsCount = points.length;
  const completionPct =
    totalPointsCount > 0
      ? Math.round((completedPointsCount / totalPointsCount) * 100)
      : 0;

  const openIncidents = incidents.filter((i) => i.status !== 'resolved');
  const highSeverityCount = openIncidents.filter(
    (i) => i.severity === 'high'
  ).length;

  const avgCompliance =
    dailyMetrics.length > 0
      ? Math.round(
          dailyMetrics.reduce((acc, item) => acc + item.compliancePct, 0) /
            dailyMetrics.length
        )
      : 0;

  const selectedDay =
    dailyMetrics.find((d) => d.id === hoveredDayId) ??
    dailyMetrics[dailyMetrics.length - 1];

  const maxPoints = Math.max(
    ...dailyMetrics.map((d) => Math.max(d.completedPoints, d.targetPoints)),
    180
  );

  return (
    <div className="space-y-8">
      {/* 4 Big Visual KPI Cards */}
      <section aria-label="Indicadores principales">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* KPI 1: Rutas Activas */}
          <motion.button
            type="button"
            custom={0}
            initial="hidden"
            animate="show"
            variants={cardEntrance}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onNavigateTab('routes')}
            className="text-left rounded-3xl border border-emerald-100 bg-white p-6 hover:border-emerald-300 hover:shadow-md transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <RouteIcon className="h-6 w-6" />
              </div>
              <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Activas
              </span>
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-500">
                Rutas Activas
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-slate-900 tabular-nums">
                  {activeRoutesCount}
                </span>
                <span className="text-sm font-semibold text-slate-400 tabular-nums">
                  de {routes.length}
                </span>
              </div>
            </div>

            <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${routesPct}%` }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-emerald-500"
              />
            </div>
          </motion.button>

          {/* KPI 2: Camiones Activos */}
          <motion.button
            type="button"
            custom={1}
            initial="hidden"
            animate="show"
            variants={cardEntrance}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onNavigateTab('map')}
            className="text-left rounded-3xl border border-emerald-100 bg-white p-6 hover:border-emerald-300 hover:shadow-md transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Truck className="h-6 w-6" />
              </div>
              <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                En Línea
              </span>
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-500">
                Camiones Activos
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-slate-900 tabular-nums">
                  {onlineCollectorsCount}
                </span>
                <span className="text-sm font-semibold text-slate-400 tabular-nums">
                  de {collectors.length}
                </span>
              </div>
            </div>

            <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${fleetPct}%` }}
                transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-emerald-500"
              />
            </div>
          </motion.button>

          {/* KPI 3: Puntos Listos */}
          <motion.button
            type="button"
            custom={2}
            initial="hidden"
            animate="show"
            variants={cardEntrance}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onNavigateTab('map')}
            className="text-left rounded-3xl border border-slate-200/80 bg-white p-6 hover:border-emerald-300 hover:shadow-md transition-colors"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span className="rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 tabular-nums">
                {completionPct}% Bien
              </span>
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-500">
                Puntos Listos Hoy
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-slate-900 tabular-nums">
                  {completedPointsCount}
                </span>
                <span className="text-sm font-semibold text-slate-400 tabular-nums">
                  de {totalPointsCount}
                </span>
              </div>
            </div>

            <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPct}%` }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-emerald-500"
              />
            </div>
          </motion.button>

          {/* KPI 4: Alertas Urgentes */}
          <motion.button
            type="button"
            custom={3}
            initial="hidden"
            animate="show"
            variants={cardEntrance}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => onNavigateTab('incidents')}
            className={`text-left rounded-3xl border bg-white p-6 hover:shadow-md transition-colors ${
              highSeverityCount > 0
                ? 'border-red-200 hover:border-red-300'
                : 'border-amber-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  highSeverityCount > 0
                    ? 'bg-red-50 text-red-600'
                    : 'bg-amber-50 text-amber-600'
                }`}
              >
                <AlertTriangle className="h-6 w-6" />
              </div>
              <span
                className={`rounded-xl px-3 py-1 text-xs font-bold ${
                  openIncidents.length === 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : highSeverityCount > 0
                    ? 'bg-red-50 text-red-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {openIncidents.length === 0
                  ? 'Todo Bien'
                  : highSeverityCount > 0
                  ? `${highSeverityCount} Urgente`
                  : 'En Proceso'}
              </span>
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold text-slate-500">
                Alertas Abiertas
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-slate-900 tabular-nums">
                  {openIncidents.length}
                </span>
                <span className="text-sm font-semibold text-slate-400">
                  pendientes
                </span>
              </div>
            </div>

            <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    openIncidents.length === 0
                      ? 100
                      : Math.min(100, openIncidents.length * 22)
                  }%`,
                }}
                transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full ${
                  openIncidents.length === 0
                    ? 'bg-emerald-500'
                    : highSeverityCount > 0
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                }`}
              />
            </div>
          </motion.button>
        </div>
      </section>

      {/* Weekly Activity Chart + Active Trucks */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        {/* Weekly Activity Visual Chart */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="xl:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">
                Actividad Semanal
              </h2>
              <div className="mt-1 text-sm font-medium text-emerald-700 tabular-nums">
                {avgCompliance}% cumplimiento promedio
              </div>
            </div>

            <div className="inline-flex items-center gap-1 rounded-2xl bg-slate-100 p-1.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setChartMode('points')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                  chartMode === 'points'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Puntos
              </button>
              <button
                type="button"
                onClick={() => setChartMode('compliance')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                  chartMode === 'compliance'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Porcentaje %
              </button>
            </div>
          </div>

          {/* Animated Bars */}
          <div className="mt-8">
            <div className="grid grid-cols-7 gap-3 sm:gap-5 items-end h-52 pb-2">
              {dailyMetrics.map((item, idx) => {
                const isSelected = selectedDay?.id === item.id;
                const heightPct =
                  chartMode === 'points'
                    ? Math.round((item.completedPoints / maxPoints) * 100)
                    : item.compliancePct;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setHoveredDayId(item.id)}
                    onClick={() => setHoveredDayId(item.id)}
                    className="group flex flex-col items-center h-full justify-end focus:outline-none"
                  >
                    <span className="mb-2 font-mono text-xs font-bold text-slate-700 tabular-nums">
                      {chartMode === 'points'
                        ? item.completedPoints
                        : `${item.compliancePct}%`}
                    </span>

                    <div className="w-full max-w-[42px] h-36 rounded-2xl bg-slate-100 p-1 flex items-end overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{
                          duration: 0.45,
                          delay: idx * 0.04,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className={`w-full rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-emerald-500'
                            : 'bg-emerald-400/75 group-hover:bg-emerald-500'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-7 gap-3 sm:gap-5 pt-3">
              {dailyMetrics.map((item) => {
                const isSelected = selectedDay?.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={`text-center text-xs font-bold transition-colors ${
                      isSelected ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {item.dayLabel}
                  </div>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedDay && (
              <motion.div
                key={selectedDay.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
                className="mt-6 rounded-2xl bg-slate-50 p-4 flex flex-wrap items-center justify-between gap-4 text-sm"
              >
                <span className="font-bold text-slate-900">
                  {selectedDay.dayLabel} · {selectedDay.dateLabel}
                </span>
                <div className="flex flex-wrap items-center gap-5 font-mono text-xs font-semibold tabular-nums">
                  <span className="text-slate-700">
                    {selectedDay.completedPoints}/{selectedDay.targetPoints} puntos
                  </span>
                  <span className="text-slate-700">
                    {selectedDay.tonsCollected} toneladas
                  </span>
                  <span className="text-emerald-700">
                    {selectedDay.compliancePct}% cumplido
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Active Trucks Visual Progress */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="xl:col-span-5 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 flex flex-col"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-slate-900">
              Camiones Hoy
            </h2>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigateTab('map')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Ver Mapa</span>
            </motion.button>
          </div>

          <div className="mt-5 space-y-4 flex-1">
            {collectors.map((col, idx) => {
              const pct =
                col.totalAssignedToday > 0
                  ? Math.round(
                      (col.completedToday / col.totalAssignedToday) * 100
                    )
                  : 0;
              const isOnline = col.status === 'online';
              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.04, duration: 0.25 }}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl bg-slate-50/90 p-4 flex flex-col gap-3 transition-shadow hover:shadow-xs"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isOnline
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        <Truck className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">
                          {col.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {col.driverName} · {col.plate}
                        </div>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onFocusCollectorOnMap(col.id)}
                      className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
                    >
                      Ubicar
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-slate-200/80 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full rounded-full ${
                          isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700 tabular-nums">
                      {pct}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* Simple Visual Pending Alerts */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7"
      >
        <div className="flex items-center justify-between gap-3 mb-5">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Alertas Pendientes
          </h2>
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigateTab('incidents')}
            className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors whitespace-nowrap"
          >
            Ver Todas
          </motion.button>
        </div>

        {openIncidents.length === 0 ? (
          <div className="rounded-2xl bg-emerald-50/70 p-8 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
            <div className="mt-2 text-sm font-bold text-emerald-900">
              Sin alertas pendientes
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openIncidents.slice(0, 4).map((inc, idx) => {
              const isHigh = inc.severity === 'high';
              return (
                <motion.div
                  key={inc.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + idx * 0.04, duration: 0.24 }}
                  whileHover={{ y: -2 }}
                  className={`rounded-2xl border p-5 flex items-center justify-between gap-4 transition-shadow hover:shadow-xs ${
                    isHigh
                      ? 'border-red-100 bg-red-50/40'
                      : 'border-amber-100 bg-amber-50/40'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        isHigh
                          ? 'bg-red-100 text-red-600'
                          : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold ${
                            isHigh ? 'text-red-700' : 'text-amber-700'
                          }`}
                        >
                          {isHigh ? 'Urgente' : 'En Proceso'}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-medium text-slate-500 truncate">
                          {inc.neighborhood}
                        </span>
                      </div>
                      <div className="mt-0.5 text-sm font-bold text-slate-900 truncate">
                        {inc.title}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectIncident(inc.id)}
                    className="rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-800 hover:border-emerald-400 hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0"
                  >
                    Atender Alerta
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>
    </div>
  );
}
