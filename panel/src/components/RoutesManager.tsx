import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Clock,
  Edit3,
  Leaf,
  MapPin,
  Pause,
  Play,
  Plus,
  Recycle,
  Search,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { LIBANO_CENTER } from '../data/mockData';
import type {
  CollectorVehicle,
  EcoRoute,
  WasteType,
  WeekDay,
} from '../types/ecoruta';

interface RoutesManagerProps {
  routes: EcoRoute[];
  collectors: CollectorVehicle[];
  externalCreateTrigger: number;
  onCreateRoute: (payload: Omit<EcoRoute, 'id'>) => Promise<void> | void;
  onUpdateRoute: (id: string, payload: Partial<EcoRoute>) => Promise<void> | void;
  onToggleRoute: (id: string, active: boolean) => Promise<void> | void;
  onDeleteRoute: (id: string) => Promise<void> | void;
}

const WEEK_DAYS: { id: WeekDay; label: string }[] = [
  { id: 'L', label: 'Lun' },
  { id: 'M', label: 'Mar' },
  { id: 'X', label: 'Mié' },
  { id: 'J', label: 'Jue' },
  { id: 'V', label: 'Vie' },
  { id: 'S', label: 'Sáb' },
  { id: 'D', label: 'Dom' },
];

const WASTE_TYPES: WasteType[] = ['Reciclable', 'Orgánico', 'Ordinario', 'Mixto'];

const ROUTE_COLORS = [
  '#059669',
  '#0284c7',
  '#d97706',
  '#7c3aed',
  '#0d9488',
  '#db2777',
  '#475569',
];

interface RouteFormState {
  code: string;
  name: string;
  zone: string;
  neighborhoodsText: string;
  wasteType: WasteType;
  days: WeekDay[];
  startTime: string;
  endTime: string;
  assignedCollectorId: string;
  color: string;
  active: boolean;
}

const EMPTY_FORM: RouteFormState = {
  code: '',
  name: '',
  zone: '',
  neighborhoodsText: '',
  wasteType: 'Reciclable',
  days: ['L', 'X', 'V'],
  startTime: '06:00',
  endTime: '10:30',
  assignedCollectorId: '',
  color: '#059669',
  active: true,
};

function WasteIcon({ type }: { type: WasteType }) {
  if (type === 'Reciclable') return <Recycle className="h-6 w-6" />;
  if (type === 'Orgánico') return <Leaf className="h-6 w-6" />;
  return <Truck className="h-6 w-6" />;
}

export function RoutesManager({
  routes,
  collectors,
  externalCreateTrigger,
  onCreateRoute,
  onUpdateRoute,
  onToggleRoute,
  onDeleteRoute,
}: RoutesManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [wasteFilter, setWasteFilter] = useState<WasteType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [form, setForm] = useState<RouteFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (externalCreateTrigger > 0) {
      openCreateDrawer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalCreateTrigger]);

  const filteredRoutes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return routes.filter((route) => {
      if (wasteFilter !== 'all' && route.wasteType !== wasteFilter) return false;
      if (statusFilter === 'active' && !route.active) return false;
      if (statusFilter === 'inactive' && route.active) return false;
      if (!q) return true;
      return (
        route.code.toLowerCase().includes(q) ||
        route.name.toLowerCase().includes(q) ||
        route.zone.toLowerCase().includes(q) ||
        route.neighborhoods.some((b) => b.toLowerCase().includes(q))
      );
    });
  }, [routes, searchQuery, wasteFilter, statusFilter]);

  function openCreateDrawer() {
    const nextIdx = routes.length + 1;
    setEditingRouteId(null);
    setForm({
      ...EMPTY_FORM,
      code: `ECO-0${nextIdx}`,
    });
    setFormError(null);
    setDrawerOpen(true);
  }

  function openEditDrawer(route: EcoRoute) {
    setEditingRouteId(route.id);
    setForm({
      code: route.code,
      name: route.name,
      zone: route.zone,
      neighborhoodsText: route.neighborhoods.join(', '),
      wasteType: route.wasteType,
      days: [...route.days],
      startTime: route.startTime,
      endTime: route.endTime,
      assignedCollectorId: route.assignedCollectorId ?? '',
      color: route.color,
      active: route.active,
    });
    setFormError(null);
    setDrawerOpen(true);
  }

  function toggleDay(day: WeekDay) {
    setForm((prev) => {
      const exists = prev.days.includes(day);
      const nextDays = exists
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];
      return { ...prev, days: nextDays };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code.trim() || !form.name.trim() || !form.zone.trim()) {
      setFormError('Completa código, nombre y zona.');
      return;
    }
    if (form.days.length === 0) {
      setFormError('Elige al menos un día.');
      return;
    }

    const neighborhoods = form.neighborhoodsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (neighborhoods.length === 0) {
      setFormError('Escribe al menos un barrio.');
      return;
    }

    const payloadBase = {
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      zone: form.zone.trim(),
      neighborhoods,
      wasteType: form.wasteType,
      days: form.days,
      startTime: form.startTime,
      endTime: form.endTime,
      active: form.active,
      assignedCollectorId: form.assignedCollectorId || null,
      color: form.color,
      estimatedDurationMin: 240,
    };

    if (editingRouteId) {
      await onUpdateRoute(editingRouteId, payloadBase);
    } else {
      const offset = (routes.length % 5) * 0.0014;
      await onCreateRoute({
        ...payloadBase,
        pathCoordinates: [
          { lat: LIBANO_CENTER.lat + offset, lng: LIBANO_CENTER.lng - 0.003 },
          { lat: LIBANO_CENTER.lat + offset + 0.0012, lng: LIBANO_CENTER.lng },
          { lat: LIBANO_CENTER.lat + offset - 0.0005, lng: LIBANO_CENTER.lng + 0.003 },
        ],
      });
    }

    setDrawerOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Simple Search & Filter Bar */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ruta o barrio..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          <select
            aria-label="Filtrar por residuo"
            value={wasteFilter}
            onChange={(e) => setWasteFilter(e.target.value as WasteType | 'all')}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">Todos los residuos</option>
            {WASTE_TYPES.map((wt) => (
              <option key={wt} value={wt}>
                {wt}
              </option>
            ))}
          </select>

          <div className="inline-flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
            {(
              [
                { id: 'all', label: 'Todas' },
                { id: 'active', label: 'Activas' },
                { id: 'inactive', label: 'Pausadas' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreateDrawer}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Crear Ruta</span>
        </motion.button>
      </div>

      {/* Spacious Route Cards Grid */}
      {filteredRoutes.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-14 text-center space-y-4">
          <div className="text-base font-bold text-slate-900">
            No hay rutas en esta vista
          </div>
          <button
            type="button"
            onClick={openCreateDrawer}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Crear Ruta</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredRoutes.map((route, idx) => {
            const collector = collectors.find(
              (c) => c.id === route.assignedCollectorId
            );
            const isConfirmingDelete = confirmDeleteId === route.id;

            return (
              <motion.article
                key={route.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.04,
                  duration: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -3 }}
                className={`rounded-3xl border bg-white p-6 flex flex-col justify-between gap-5 transition-shadow hover:shadow-md ${
                  route.active
                    ? 'border-slate-200/80 hover:border-emerald-300'
                    : 'border-slate-200/60 bg-slate-50/40 opacity-90'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-xs"
                        style={{ backgroundColor: route.color }}
                      >
                        <WasteIcon type={route.wasteType} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-mono text-xs font-bold text-slate-400">
                          {route.code} · {route.wasteType}
                        </div>
                        <h3 className="font-display text-lg font-bold text-slate-900 truncate">
                          {route.name}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold shrink-0 ${
                        route.active
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {route.active ? 'Activa' : 'Pausada'}
                    </span>
                  </div>

                  {/* Neighborhoods & Zone */}
                  <div className="rounded-2xl bg-slate-50 p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>
                        {route.zone}: {route.neighborhoods.join(', ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-1.5">
                        {WEEK_DAYS.map((d) => {
                          const activeDay = route.days.includes(d.id);
                          return (
                            <span
                              key={d.id}
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-xl text-xs font-bold ${
                                activeDay
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white text-slate-400 border border-slate-200'
                              }`}
                            >
                              {d.id}
                            </span>
                          );
                        })}
                      </div>

                      <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700 tabular-nums">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>
                          {route.startTime} - {route.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Truck */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <Truck className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>
                      {collector
                        ? `${collector.name} (${collector.plate}) · ${collector.driverName}`
                        : 'Sin camión asignado'}
                    </span>
                  </div>
                </div>

                {/* Literal Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onToggleRoute(route.id, !route.active)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors whitespace-nowrap ${
                      route.active
                        ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {route.active ? (
                      <>
                        <Pause className="h-4 w-4" />
                        <span>Pausar Ruta</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Activar Ruta</span>
                      </>
                    )}
                  </motion.button>

                  {isConfirmingDelete ? (
                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onDeleteRoute(route.id);
                          setConfirmDeleteId(null);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-red-700"
                      >
                        <Check className="h-4 w-4" />
                        <span>Confirmar Borrado</span>
                      </motion.button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => openEditDrawer(route)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Edit3 className="h-4 w-4 text-slate-500" />
                        <span>Editar Ruta</span>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setConfirmDeleteId(route.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 bg-red-50/60 px-3.5 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Eliminar</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Animated Slide-Over Form */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px]"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 36 }}
              className="relative z-10 w-full max-w-lg bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  {editingRouteId ? 'Editar Ruta' : 'Crear Nueva Ruta'}
                </h3>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto p-6 space-y-5"
              >
                {formError && (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-xs font-bold text-red-700">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Código
                    </label>
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      placeholder="ECO-07"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nombre de Ruta
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Circuito Norte"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Zona
                    </label>
                    <input
                      type="text"
                      value={form.zone}
                      onChange={(e) => setForm({ ...form, zone: e.target.value })}
                      placeholder="Zona Norte"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tipo de Residuo
                    </label>
                    <select
                      value={form.wasteType}
                      onChange={(e) =>
                        setForm({ ...form, wasteType: e.target.value as WasteType })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                    >
                      {WASTE_TYPES.map((wt) => (
                        <option key={wt} value={wt}>
                          {wt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Barrios (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={form.neighborhoodsText}
                    onChange={(e) =>
                      setForm({ ...form, neighborhoodsText: e.target.value })
                    }
                    placeholder="El Jardín, Los Pinos, Santa Rosa"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Días de Recolección
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {WEEK_DAYS.map((day) => {
                      const selected = form.days.includes(day.id);
                      return (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => toggleDay(day.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                            selected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Hora Inicio
                    </label>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={(e) =>
                        setForm({ ...form, startTime: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Hora Fin
                    </label>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={(e) =>
                        setForm({ ...form, endTime: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Camión Asignado
                  </label>
                  <select
                    value={form.assignedCollectorId}
                    onChange={(e) =>
                      setForm({ ...form, assignedCollectorId: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Sin asignar</option>
                    {collectors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.plate})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-2">
                      Color en Mapa
                    </div>
                    <div className="flex items-center gap-2.5">
                      {ROUTE_COLORS.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => setForm({ ...form, color: hex })}
                          className={`h-7 w-7 rounded-full border-2 transition-transform ${
                            form.color === hex
                              ? 'border-slate-900 scale-110'
                              : 'border-white shadow-xs'
                          }`}
                          style={{ backgroundColor: hex }}
                          aria-label={`Color ${hex}`}
                        />
                      ))}
                    </div>
                  </div>

                  <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) =>
                        setForm({ ...form, active: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    Activa hoy
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    {editingRouteId ? 'Guardar Cambios' : 'Crear Ruta'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
