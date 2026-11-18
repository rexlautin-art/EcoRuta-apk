import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import {
  CheckCircle2,
  Crosshair,
  MapPin,
  Pause,
  Play,
  Truck,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { LIBANO_CENTER } from '../data/mockData';
import type {
  CollectionPoint,
  CollectorVehicle,
  EcoRoute,
  IncidentReport,
  PointStatus,
} from '../types/ecoruta';

interface LiveMapViewProps {
  routes: EcoRoute[];
  collectors: CollectorVehicle[];
  points: CollectionPoint[];
  incidents: IncidentReport[];
  focusedCollectorId: string | null;
  focusedCoords: { lat: number; lng: number; label?: string } | null;
  isSimulatingGps: boolean;
  useMockData: boolean;
  onToggleSimulation: () => void;
  onUpdatePointStatus: (pointId: string, status: PointStatus) => void;
  onClearFocus: () => void;
}

const POINT_STATUS_META: Record<
  PointStatus,
  { label: string; hex: string; textClass: string; bgClass: string }
> = {
  pending: {
    label: 'Pendiente',
    hex: '#64748b',
    textClass: 'text-slate-700',
    bgClass: 'bg-slate-100',
  },
  in_progress: {
    label: 'En camino',
    hex: '#d97706',
    textClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
  },
  completed: {
    label: 'Listo',
    hex: '#059669',
    textClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
  },
  incident: {
    label: 'Urgente',
    hex: '#dc2626',
    textClass: 'text-red-700',
    bgClass: 'bg-red-50',
  },
};

export function LiveMapView({
  routes,
  collectors,
  points,
  incidents,
  focusedCollectorId,
  focusedCoords,
  isSimulatingGps,
  useMockData,
  onToggleSimulation,
  onUpdatePointStatus,
  onClearFocus,
}: LiveMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const pointsLayerRef = useRef<L.LayerGroup | null>(null);
  const vehiclesLayerRef = useRef<L.LayerGroup | null>(null);
  const vehicleMarkersRef = useRef<Record<string, L.Marker>>({});

  const [selectedRouteId, setSelectedRouteId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<PointStatus | 'all'>('all');
  const [inspectorTab, setInspectorTab] = useState<'fleet' | 'points'>('fleet');
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [selectedCollectorId, setSelectedCollectorId] = useState<string | null>(
    focusedCollectorId
  );

  const filteredPoints = useMemo(() => {
    return points.filter((p) => {
      if (selectedRouteId !== 'all' && p.routeId !== selectedRouteId) {
        return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [points, selectedRouteId, statusFilter]);

  const visibleRoutes = useMemo(() => {
    return routes.filter(
      (r) => selectedRouteId === 'all' || r.id === selectedRouteId
    );
  }, [routes, selectedRouteId]);

  const selectedPoint = useMemo(
    () => points.find((p) => p.id === selectedPointId) ?? null,
    [points, selectedPointId]
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [LIBANO_CENTER.lat, LIBANO_CENTER.lng],
      zoom: 15,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    routesLayerRef.current = L.layerGroup().addTo(map);
    pointsLayerRef.current = L.layerGroup().addTo(map);
    vehiclesLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    const resizeTimer = window.setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
      vehicleMarkersRef.current = {};
    };
  }, []);

  useEffect(() => {
    const layer = routesLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    visibleRoutes.forEach((route) => {
      if (route.pathCoordinates.length < 2) return;
      const latLngs = route.pathCoordinates.map(
        (c) => [c.lat, c.lng] as [number, number]
      );
      const polyline = L.polyline(latLngs, {
        color: route.color,
        weight: route.active ? 5 : 3,
        opacity: route.active ? 0.85 : 0.4,
        dashArray: route.active ? undefined : '6 6',
      });

      polyline.bindPopup(
        `<div class="text-xs space-y-1">
          <div class="font-bold text-slate-900">${route.name}</div>
          <div class="text-slate-600">${route.wasteType} · ${route.startTime} - ${route.endTime}</div>
        </div>`
      );
      polyline.addTo(layer);
    });
  }, [visibleRoutes]);

  useEffect(() => {
    const layer = pointsLayerRef.current;
    if (!layer) return;
    layer.clearLayers();

    filteredPoints.forEach((pt) => {
      const meta = POINT_STATUS_META[pt.status];
      const isSelected = pt.id === selectedPointId;

      const icon = L.divIcon({
        className: 'ecoruta-marker-wrapper',
        html: `
          <div style="
            width: ${isSelected ? '22px' : '18px'};
            height: ${isSelected ? '22px' : '18px'};
            border-radius: 9999px;
            background: ${meta.hex};
            border: 3px solid #ffffff;
            box-shadow: 0 3px 8px rgba(15, 23, 42, 0.35);
          "></div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([pt.lat, pt.lng], { icon });
      marker.bindPopup(
        `<div class="text-xs space-y-1 min-w-[170px]">
          <div class="font-bold text-slate-900">${pt.name}</div>
          <div class="text-slate-600">${pt.neighborhood}</div>
          <div class="font-semibold" style="color:${meta.hex}">${meta.label} · ${pt.fillLevel}%</div>
        </div>`
      );
      marker.on('click', () => {
        setSelectedPointId(pt.id);
        setInspectorTab('points');
      });
      marker.addTo(layer);
    });

    incidents
      .filter((i) => i.status !== 'resolved')
      .forEach((inc) => {
        const icon = L.divIcon({
          className: 'ecoruta-marker-wrapper',
          html: `
            <div style="
              width: 24px;
              height: 24px;
              border-radius: 8px;
              background: #dc2626;
              color: #ffffff;
              font-size: 13px;
              font-weight: 800;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2.5px solid #ffffff;
              box-shadow: 0 3px 10px rgba(220, 38, 38, 0.45);
            ">!</div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([inc.lat, inc.lng], { icon });
        marker.bindPopup(
          `<div class="text-xs space-y-1 max-w-[200px]">
            <div class="font-bold text-red-700">${inc.category}</div>
            <div class="font-semibold text-slate-900">${inc.title}</div>
          </div>`
        );
        marker.addTo(layer);
      });
  }, [filteredPoints, incidents, selectedPointId]);

  useEffect(() => {
    const layer = vehiclesLayerRef.current;
    if (!layer) return;

    const activeIds = new Set(collectors.map((c) => c.id));
    Object.keys(vehicleMarkersRef.current).forEach((id) => {
      if (!activeIds.has(id)) {
        layer.removeLayer(vehicleMarkersRef.current[id]);
        delete vehicleMarkersRef.current[id];
      }
    });

    collectors.forEach((col) => {
      const isFocused = selectedCollectorId === col.id;
      const bg =
        col.status === 'online'
          ? '#059669'
          : col.status === 'paused'
          ? '#d97706'
          : '#475569';

      const html = `
        <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%);">
          <div style="
            background:${isFocused ? '#0f172a' : bg};
            color:#ffffff;
            padding:5px 10px;
            border-radius:10px;
            font-size:11px;
            font-weight:800;
            font-family:'JetBrains Mono',monospace;
            white-space:nowrap;
            border:2.5px solid #ffffff;
            box-shadow:0 4px 12px rgba(15,23,42,0.3);
          ">${col.plate}</div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'ecoruta-marker-wrapper',
        html,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const existing = vehicleMarkersRef.current[col.id];
      const popupContent = `
        <div class="text-xs space-y-1 min-w-[170px]">
          <div class="font-bold text-slate-900">${col.name}</div>
          <div class="text-slate-600">${col.driverName}</div>
          <div class="font-semibold text-emerald-700">${col.speedKmh} km/h · ${col.completedToday}/${col.totalAssignedToday} puntos</div>
        </div>
      `;

      if (existing) {
        existing.setLatLng([col.lat, col.lng]);
        existing.setIcon(icon);
        existing.setPopupContent(popupContent);
      } else {
        const marker = L.marker([col.lat, col.lng], {
          icon,
          zIndexOffset: 500,
        });
        marker.bindPopup(popupContent);
        marker.on('click', () => {
          setSelectedCollectorId(col.id);
          setInspectorTab('fleet');
        });
        marker.addTo(layer);
        vehicleMarkersRef.current[col.id] = marker;
      }
    });
  }, [collectors, selectedCollectorId]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (focusedCollectorId) {
      const target = collectors.find((c) => c.id === focusedCollectorId);
      if (target) {
        setSelectedCollectorId(target.id);
        setInspectorTab('fleet');
        map.flyTo([target.lat, target.lng], 16, { duration: 0.6 });
        vehicleMarkersRef.current[target.id]?.openPopup();
        onClearFocus();
      }
    } else if (focusedCoords) {
      map.flyTo([focusedCoords.lat, focusedCoords.lng], 17, { duration: 0.6 });
      onClearFocus();
    }
  }, [focusedCollectorId, focusedCoords, collectors, onClearFocus]);

  const handleCenterLibano = () => {
    mapInstanceRef.current?.flyTo(
      [LIBANO_CENTER.lat, LIBANO_CENTER.lng],
      15,
      { duration: 0.5 }
    );
  };

  const handleFocusCollector = (col: CollectorVehicle) => {
    setSelectedCollectorId(col.id);
    mapInstanceRef.current?.flyTo([col.lat, col.lng], 16, { duration: 0.5 });
    vehicleMarkersRef.current[col.id]?.openPopup();
  };

  const handleFocusPoint = (pt: CollectionPoint) => {
    setSelectedPointId(pt.id);
    mapInstanceRef.current?.flyTo([pt.lat, pt.lng], 17, { duration: 0.5 });
  };

  return (
    <div className="space-y-5">
      {/* Simple Clean Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="Elegir ruta"
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">Todas las rutas</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <div className="inline-flex flex-wrap items-center gap-1 rounded-2xl bg-slate-100 p-1">
            {(
              [
                { id: 'all', label: 'Todos' },
                { id: 'pending', label: 'Pendientes' },
                { id: 'in_progress', label: 'En camino' },
                { id: 'completed', label: 'Listos' },
                { id: 'incident', label: 'Urgentes' },
              ] as const
            ).map((tab) => (
              <motion.button
                key={tab.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {useMockData && (
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={onToggleSimulation}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors whitespace-nowrap ${
                isSimulatingGps
                  ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isSimulatingGps ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pausar GPS</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Reanudar GPS</span>
                </>
              )}
            </motion.button>
          )}

          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleCenterLibano}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Crosshair className="h-4 w-4 text-emerald-600" />
            <span>Centrar Mapa</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Map + Visual Cards Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Leaflet Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-8 rounded-3xl border border-slate-200/80 bg-white overflow-hidden flex flex-col"
        >
          <div
            ref={mapContainerRef}
            className="w-full h-[460px] lg:h-[620px] bg-slate-100"
          />
          <div className="border-t border-slate-100 bg-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-600">
            <div className="flex flex-wrap items-center gap-5">
              {(Object.keys(POINT_STATUS_META) as PointStatus[]).map((st) => (
                <span key={st} className="inline-flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full inline-block"
                    style={{ backgroundColor: POINT_STATUS_META[st].hex }}
                  />
                  <span>{POINT_STATUS_META[st].label}</span>
                </span>
              ))}
            </div>
            <span className="text-slate-400">Líbano, Tolima</span>
          </div>
        </motion.div>

        {/* Visual Right Side Cards */}
        <motion.aside
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white flex flex-col overflow-hidden h-[600px] lg:h-[670px]"
        >
          <div className="p-3.5 border-b border-slate-100 flex items-center gap-1.5 bg-slate-50/70">
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setInspectorTab('fleet')}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-bold transition-colors ${
                inspectorTab === 'fleet'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Truck className="h-4 w-4 text-emerald-600" />
              <span>Camiones ({collectors.length})</span>
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setInspectorTab('points')}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-bold transition-colors ${
                inspectorTab === 'points'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span>Puntos ({filteredPoints.length})</span>
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence mode="wait">
              {inspectorTab === 'fleet' ? (
                <motion.div
                  key="fleet-list"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-3"
                >
                  {collectors.map((col, idx) => {
                    const isSelected = selectedCollectorId === col.id;
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
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.2 }}
                        whileHover={{ y: -2 }}
                        className={`rounded-2xl border p-4 space-y-3 transition-colors ${
                          isSelected
                            ? 'border-emerald-300 bg-emerald-50/50'
                            : 'border-slate-100 bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-bold text-slate-900">
                              {col.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {col.driverName} · {col.plate}
                            </div>
                          </div>
                          <span
                            className={`rounded-xl px-2.5 py-1 text-[11px] font-bold ${
                              isOnline
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isOnline ? `${col.speedKmh} km/h` : 'Pausado'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                              className={`h-full rounded-full ${
                                isOnline ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-700 tabular-nums">
                            {pct}%
                          </span>
                        </div>

                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleFocusCollector(col)}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
                        >
                          <MapPin className="h-3.5 w-3.5" />
                          <span>Ver en Mapa</span>
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : filteredPoints.length === 0 ? (
                <motion.div
                  key="points-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center text-xs font-medium text-slate-500"
                >
                  No hay puntos en este filtro.
                </motion.div>
              ) : (
                <motion.div
                  key="points-list"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-3"
                >
                  {filteredPoints.map((pt, idx) => {
                    const meta = POINT_STATUS_META[pt.status];
                    const isSelected = selectedPoint?.id === pt.id;
                    return (
                      <motion.div
                        key={pt.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03, duration: 0.2 }}
                        whileHover={{ y: -2 }}
                        className={`rounded-2xl border p-4 space-y-3 transition-colors ${
                          isSelected
                            ? 'border-emerald-300 bg-emerald-50/40'
                            : 'border-slate-100 bg-slate-50/70'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleFocusPoint(pt)}
                          className="w-full text-left"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-sm font-bold text-slate-900">
                              {pt.name}
                            </div>
                            <span
                              className={`rounded-xl px-2.5 py-1 text-[11px] font-bold shrink-0 ${meta.bgClass} ${meta.textClass}`}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {pt.neighborhood} · Llenado {pt.fillLevel}%
                          </div>
                        </button>

                        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pt.fillLevel}%` }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full"
                            style={{
                              backgroundColor:
                                pt.fillLevel > 85
                                  ? '#dc2626'
                                  : pt.fillLevel > 60
                                  ? '#d97706'
                                  : '#059669',
                            }}
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {pt.status !== 'completed' && (
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onUpdatePointStatus(pt.id, 'completed')}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors whitespace-nowrap"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Marcar Listo</span>
                            </motion.button>
                          )}
                          {pt.status !== 'in_progress' && (
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                onUpdatePointStatus(pt.id, 'in_progress')
                              }
                              className="rounded-xl bg-amber-50 border border-amber-200 px-2.5 py-2 text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition-colors"
                            >
                              En camino
                            </motion.button>
                          )}
                          {pt.status !== 'incident' && (
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onUpdatePointStatus(pt.id, 'incident')}
                              className="rounded-xl bg-red-50 border border-red-200 px-2.5 py-2 text-[11px] font-bold text-red-700 hover:bg-red-100 transition-colors"
                            >
                              Urgente
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
