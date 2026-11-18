import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Truck,
  User,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  CollectorVehicle,
  EcoRoute,
  IncidentReport,
  IncidentSeverity,
  IncidentStatus,
} from '../types/ecoruta';

interface IncidentsInboxProps {
  incidents: IncidentReport[];
  collectors: CollectorVehicle[];
  routes: EcoRoute[];
  initialSelectedId: string | null;
  onUpdateIncident: (
    incidentId: string,
    payload: {
      status?: IncidentStatus;
      adminNotes?: string;
      assignedCollectorId?: string | null;
    }
  ) => Promise<void> | void;
  onLocateOnMap: (lat: number, lng: number, label: string) => void;
}

const STATUS_META: Record<
  IncidentStatus,
  { label: string; bg: string; text: string }
> = {
  pending: {
    label: 'Pendiente',
    bg: 'bg-red-50',
    text: 'text-red-700',
  },
  in_review: {
    label: 'En Proceso',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
  },
  resolved: {
    label: 'Listo',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
};

const SEVERITY_META: Record<
  IncidentSeverity,
  { label: string; bg: string; text: string }
> = {
  high: { label: 'Urgente', bg: 'bg-red-100', text: 'text-red-700' },
  medium: { label: 'Media', bg: 'bg-amber-100', text: 'text-amber-800' },
  low: { label: 'Baja', bg: 'bg-slate-100', text: 'text-slate-600' },
};

export function IncidentsInbox({
  incidents,
  collectors,
  routes,
  initialSelectedId,
  onUpdateIncident,
  onLocateOnMap,
}: IncidentsInboxProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId ?? incidents[0]?.id ?? null
  );

  const [notesDraft, setNotesDraft] = useState('');
  const [assignedDraft, setAssignedDraft] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (initialSelectedId) {
      setSelectedId(initialSelectedId);
    }
  }, [initialSelectedId]);

  const filteredIncidents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return incidents.filter((inc) => {
      if (statusFilter !== 'all' && inc.status !== statusFilter) return false;
      if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
      if (!q) return true;
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.category.toLowerCase().includes(q) ||
        inc.neighborhood.toLowerCase().includes(q) ||
        inc.reportedByName.toLowerCase().includes(q)
      );
    });
  }, [incidents, searchQuery, statusFilter, severityFilter]);

  const selectedIncident = useMemo(() => {
    return (
      filteredIncidents.find((i) => i.id === selectedId) ??
      incidents.find((i) => i.id === selectedId) ??
      filteredIncidents[0] ??
      null
    );
  }, [filteredIncidents, incidents, selectedId]);

  useEffect(() => {
    if (selectedIncident) {
      setNotesDraft(selectedIncident.adminNotes ?? '');
      setAssignedDraft(selectedIncident.assignedCollectorId ?? '');
      setSavedNotice(null);
    }
  }, [
    selectedIncident?.id,
    selectedIncident?.adminNotes,
    selectedIncident?.assignedCollectorId,
  ]);

  async function handleAction(nextStatus?: IncidentStatus) {
    if (!selectedIncident) return;
    setSaving(true);
    setSavedNotice(null);
    try {
      await onUpdateIncident(selectedIncident.id, {
        status: nextStatus ?? selectedIncident.status,
        adminNotes: notesDraft,
        assignedCollectorId: assignedDraft || null,
      });
      setSavedNotice(
        nextStatus === 'resolved'
          ? 'Marcado como listo.'
          : 'Estado actualizado.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Simple Filter Bar */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar alerta o barrio..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="inline-flex flex-wrap items-center gap-1 rounded-2xl bg-slate-100 p-1">
            {(
              [
                { id: 'all', label: 'Todas' },
                { id: 'pending', label: 'Pendientes' },
                { id: 'in_review', label: 'En Proceso' },
                { id: 'resolved', label: 'Listas' },
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

        <select
          aria-label="Filtrar por prioridad"
          value={severityFilter}
          onChange={(e) =>
            setSeverityFilter(e.target.value as IncidentSeverity | 'all')
          }
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:border-emerald-500 focus:outline-none self-start lg:self-auto"
        >
          <option value="all">Todas las prioridades</option>
          <option value="high">Urgente</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>
      </div>

      {/* Split Cards View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left List */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white p-4 space-y-3 max-h-[640px] overflow-y-auto">
          {filteredIncidents.length === 0 ? (
            <div className="p-10 text-center text-xs font-semibold text-slate-500">
              No hay alertas en esta vista.
            </div>
          ) : (
            filteredIncidents.map((inc, idx) => {
              const isSelected = selectedIncident?.id === inc.id;
              const sev = SEVERITY_META[inc.severity];
              const st = STATUS_META[inc.status];

              return (
                <motion.button
                  key={inc.id}
                  type="button"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.035, duration: 0.2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => setSelectedId(inc.id)}
                  className={`w-full text-left rounded-2xl border p-4 transition-colors ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-50/40 shadow-xs'
                      : 'border-slate-100 bg-slate-50/70 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                        inc.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : inc.severity === 'high'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {inc.status === 'resolved' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : inc.status === 'in_review' ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-slate-500 truncate">
                          {inc.neighborhood} · {inc.createdAt}
                        </span>
                        <span
                          className={`rounded-lg px-2 py-0.5 text-[11px] font-bold shrink-0 ${
                            inc.status === 'resolved'
                              ? `${st.bg} ${st.text}`
                              : `${sev.bg} ${sev.text}`
                          }`}
                        >
                          {inc.status === 'resolved' ? st.label : sev.label}
                        </span>
                      </div>

                      <div className="mt-1 text-sm font-bold text-slate-900 line-clamp-2">
                        {inc.title}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 flex flex-col justify-between overflow-hidden">
          <AnimatePresence mode="wait">
            {!selectedIncident ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center p-12 text-sm font-semibold text-slate-500"
              >
                Elige una alerta para atenderla.
              </motion.div>
            ) : (
              <motion.div
                key={selectedIncident.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-xl px-3 py-1 text-xs font-bold ${
                            STATUS_META[selectedIncident.status].bg
                          } ${STATUS_META[selectedIncident.status].text}`}
                        >
                          {STATUS_META[selectedIncident.status].label}
                        </span>
                        <span
                          className={`rounded-xl px-3 py-1 text-xs font-bold ${
                            SEVERITY_META[selectedIncident.severity].bg
                          } ${SEVERITY_META[selectedIncident.severity].text}`}
                        >
                          {SEVERITY_META[selectedIncident.severity].label}
                        </span>
                      </div>
                      <h2 className="mt-3 font-display text-xl font-bold text-slate-900">
                        {selectedIncident.title}
                      </h2>
                    </div>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() =>
                        onLocateOnMap(
                          selectedIncident.lat,
                          selectedIncident.lng,
                          selectedIncident.title
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0 self-start"
                    >
                      <MapPin className="h-4 w-4" />
                      <span>Ver en Mapa</span>
                    </motion.button>
                  </div>

                  {/* Short Description */}
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed">
                    {selectedIncident.description}
                  </p>

                  {/* Visual Info Tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-xs">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {selectedIncident.neighborhood}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {selectedIncident.address}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-xs">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {selectedIncident.reportedByName}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {selectedIncident.routeId
                            ? routes.find((r) => r.id === selectedIncident.routeId)
                                ?.name ?? 'Ruta asignada'
                            : 'Reporte móvil'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assignment & Notes */}
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1.5">
                        <Truck className="h-4 w-4 text-slate-400" />
                        <span>Asignar Camión</span>
                      </label>
                      <select
                        value={assignedDraft}
                        onChange={(e) => setAssignedDraft(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                      >
                        <option value="">Sin asignar</option>
                        {collectors.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.plate})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nota de Solución
                      </label>
                      <textarea
                        rows={3}
                        value={notesDraft}
                        onChange={(e) => setNotesDraft(e.target.value)}
                        placeholder="Escribe qué se hizo..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Literal Action Footer */}
                <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs font-bold text-emerald-700">
                    {savedNotice ?? ''}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      disabled={saving}
                      onClick={() => handleAction('in_review')}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:opacity-60"
                    >
                      <Clock className="h-4 w-4" />
                      <span>En Proceso</span>
                    </motion.button>

                    {selectedIncident.status !== 'resolved' ? (
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        disabled={saving}
                        onClick={() => handleAction('resolved')}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs disabled:opacity-60"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Marcar Listo</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        disabled={saving}
                        onClick={() => handleAction('pending')}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                      >
                        Reabrir Alerta
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
