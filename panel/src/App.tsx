import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { ApiSettingsView } from './components/ApiSettingsView';
import { SendView } from './components/SendView';
import { IncidentsInbox } from './components/IncidentsInbox';
import { LiveMapView } from './components/LiveMapView';
import { OverviewDashboard } from './components/OverviewDashboard';
import { RoutesManager } from './components/RoutesManager';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { UsersManager } from './components/UsersManager';
import {
  connectLiveSocket,
  ecoRutaApi,
  loadApiConfig,
  saveApiConfig,
} from './services/apiClient';
import type {
  ApiConfig,
  CollectionPoint,
  CollectorVehicle,
  DailyActivityMetric,
  DashboardTab,
  EcoRoute,
  EcoUser,
  IncidentReport,
  IncidentStatus,
  PointStatus,
  PushNotificationLog,
  UserAccountStatus,
  UserRole,
} from './types/ecoruta';

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>(() => {
    const valid: DashboardTab[] = ['send', 'overview', 'map', 'routes', 'users', 'incidents', 'api-settings'];
    const t = new URLSearchParams(window.location.search).get('tab') as DashboardTab | null;
    return t && valid.includes(t) ? t : 'send';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Configuración API (Mock activo por defecto)
  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => loadApiConfig());
  const [wsConnected, setWsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [apiErrorBanner, setApiErrorBanner] = useState<string | null>(null);

  // Estado operativo principal: arranca EN BLANCO (lienzo vacío). Nada se precarga ni se guarda al cerrar;
  // todo lo que aparece lo crea o edita la persona desde la app.
  const [routes, setRoutes] = useState<EcoRoute[]>([]);
  const [points, setPoints] = useState<CollectionPoint[]>([]);
  const [collectors, setCollectors] =
    useState<CollectorVehicle[]>([]);
  const [users, setUsers] = useState<EcoUser[]>([]);
  const [incidents, setIncidents] =
    useState<IncidentReport[]>([]);
  const [dailyMetrics, setDailyMetrics] = useState<DailyActivityMetric[]>([]);
  const [pushLogs, setPushLogs] =
    useState<PushNotificationLog[]>([]);

  // Navegación contextual entre módulos
  const [isSimulatingGps, setIsSimulatingGps] = useState(true);
  const [focusedCollectorId, setFocusedCollectorId] = useState<string | null>(
    null
  );
  const [focusedCoords, setFocusedCoords] = useState<{
    lat: number;
    lng: number;
    label?: string;
  } | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null
  );
  const [createRouteTrigger, setCreateRouteTrigger] = useState(0);

  // Sincronización con backend real (server.cjs) cuando useMockData === false
  const syncFromServer = useCallback(async (cfg: ApiConfig) => {
    if (cfg.useMockData) {
      setIsSyncing(true);
      window.setTimeout(() => setIsSyncing(false), 350);
      setApiErrorBanner(null);
      return;
    }

    setIsSyncing(true);
    setApiErrorBanner(null);
    try {
      const [
        nextRoutes,
        nextPoints,
        nextCollectors,
        nextUsers,
        nextIncidents,
        nextMetrics,
      ] = await Promise.all([
        ecoRutaApi.fetchRoutes(cfg),
        ecoRutaApi.fetchPoints(cfg),
        ecoRutaApi.fetchCollectorsLive(cfg),
        ecoRutaApi.fetchUsers(cfg),
        ecoRutaApi.fetchIncidents(cfg),
        ecoRutaApi.fetchDailyAnalytics(cfg),
      ]);

      setRoutes(nextRoutes);
      setPoints(nextPoints);
      setCollectors(nextCollectors);
      setUsers(nextUsers);
      setIncidents(nextIncidents);
      setDailyMetrics(nextMetrics);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error de conexión con server.cjs';
      setApiErrorBanner(
        `No se pudo sincronizar con ${cfg.baseUrl}: ${message}`
      );
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Conexión WebSocket + Polling de respaldo cuando está en modo real
  useEffect(() => {
    if (apiConfig.useMockData) {
      setWsConnected(false);
      setApiErrorBanner(null);
      return;
    }

    syncFromServer(apiConfig);

    const disconnectSocket = connectLiveSocket(apiConfig, {
      onStatusChange: (connected) => setWsConnected(connected),
      onCollectorGps: (update) => {
        setCollectors((prev) =>
          prev.map((c) => (c.id === update.id ? { ...c, ...update } : c))
        );
      },
      onPointUpdated: (update) => {
        setPoints((prev) =>
          prev.map((p) => (p.id === update.id ? { ...p, ...update } : p))
        );
      },
      onIncidentCreated: (newIncident) => {
        setIncidents((prev) => [newIncident, ...prev]);
      },
    });

    const pollMs = Math.max(3, apiConfig.autoRefreshSeconds) * 1000;
    const pollTimer = window.setInterval(() => {
      ecoRutaApi
        .fetchCollectorsLive(apiConfig)
        .then((next) => setCollectors(next))
        .catch(() => {
          // Silencioso en polling secundario
        });
    }, pollMs);

    return () => {
      disconnectSocket();
      window.clearInterval(pollTimer);
    };
  }, [apiConfig, syncFromServer]);

  // Simulación GPS en vivo sobre las polilíneas cuando Mock Data está activo
  useEffect(() => {
    if (!apiConfig.useMockData || !isSimulatingGps) return;

    const timer = window.setInterval(() => {
      setCollectors((prevCollectors) =>
        prevCollectors.map((col) => {
          if (col.status !== 'online' || !col.routeId) return col;
          const route = routes.find((r) => r.id === col.routeId);
          if (!route || route.pathCoordinates.length < 2) return col;

          const coords = route.pathCoordinates;
          const maxIndex = coords.length - 1;
          let nextProgress = col.pathProgress + 0.14;
          if (nextProgress >= maxIndex) {
            nextProgress = 0;
          }

          const idx = Math.floor(nextProgress);
          const frac = nextProgress - idx;
          const p1 = coords[idx];
          const p2 = coords[Math.min(idx + 1, maxIndex)];

          const lat = p1.lat + (p2.lat - p1.lat) * frac;
          const lng = p1.lng + (p2.lng - p1.lng) * frac;

          return {
            ...col,
            lat: Number(lat.toFixed(6)),
            lng: Number(lng.toFixed(6)),
            pathProgress: nextProgress,
            lastPingAt: 'En vivo',
          };
        })
      );
    }, 2200);

    return () => window.clearInterval(timer);
  }, [apiConfig.useMockData, isSimulatingGps, routes]);

  // Handlers de mutación (soportan Mock y Backend Real)
  const handleSaveApiConfig = (next: ApiConfig) => {
    setApiConfig(next);
    saveApiConfig(next);
  };

  const handleResetMockData = () => {
    setRoutes([]);
    setPoints([]);
    setCollectors([]);
    setUsers([]);
    setIncidents([]);
    setDailyMetrics([]);
    setPushLogs([]);
  };

  const handleCreateRoute = async (payload: Omit<EcoRoute, 'id'>) => {
    if (apiConfig.useMockData) {
      const created: EcoRoute = {
        ...payload,
        id: `route-${Date.now().toString().slice(-4)}`,
      };
      setRoutes((prev) => [created, ...prev]);
      return;
    }

    try {
      const created = await ecoRutaApi.createRoute(apiConfig, payload);
      setRoutes((prev) => [created, ...prev]);
    } catch (err) {
      setApiErrorBanner(
        `Error al crear ruta: ${err instanceof Error ? err.message : 'Desconocido'}`
      );
    }
  };

  const handleUpdateRoute = async (id: string, payload: Partial<EcoRoute>) => {
    if (apiConfig.useMockData) {
      setRoutes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...payload } : r))
      );
      return;
    }

    try {
      const updated = await ecoRutaApi.updateRoute(apiConfig, id, payload);
      setRoutes((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setApiErrorBanner(
        `Error al actualizar ruta: ${
          err instanceof Error ? err.message : 'Desconocido'
        }`
      );
    }
  };

  const handleToggleRoute = async (id: string, active: boolean) => {
    setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, active } : r)));
    if (!apiConfig.useMockData) {
      try {
        await ecoRutaApi.toggleRouteStatus(apiConfig, id, active);
      } catch (err) {
        setApiErrorBanner(
          `Error al cambiar estado de ruta: ${
            err instanceof Error ? err.message : 'Desconocido'
          }`
        );
      }
    }
  };

  const handleDeleteRoute = async (id: string) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
    if (!apiConfig.useMockData) {
      try {
        await ecoRutaApi.deleteRoute(apiConfig, id);
      } catch (err) {
        setApiErrorBanner(
          `Error al eliminar ruta: ${
            err instanceof Error ? err.message : 'Desconocido'
          }`
        );
      }
    }
  };

  const handleUpdatePointStatus = async (pointId: string, status: PointStatus) => {
    const nowTime = new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setPoints((prev) =>
      prev.map((p) =>
        p.id === pointId ? { ...p, status, lastUpdated: nowTime } : p
      )
    );

    if (!apiConfig.useMockData) {
      try {
        await ecoRutaApi.updatePointStatus(apiConfig, pointId, status);
      } catch (err) {
        setApiErrorBanner(
          `Error al actualizar punto: ${
            err instanceof Error ? err.message : 'Desconocido'
          }`
        );
      }
    }
  };

  const handleUpdateUser = async (
    userId: string,
    payload: { role?: UserRole; status?: UserAccountStatus }
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...payload } : u))
    );
    if (!apiConfig.useMockData) {
      try {
        await ecoRutaApi.updateUser(apiConfig, userId, payload);
      } catch (err) {
        setApiErrorBanner(
          `Error al actualizar usuario: ${
            err instanceof Error ? err.message : 'Desconocido'
          }`
        );
      }
    }
  };

  const handleSendPushNotification = async (
    user: EcoUser,
    title: string,
    body: string,
    priority: 'normal' | 'high'
  ) => {
    const nowLabel = `Hoy · ${new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    if (apiConfig.useMockData) {
      setPushLogs((prev) => [
        {
          id: `push-${Date.now()}`,
          targetUserId: user.id,
          targetName: user.name,
          title,
          body,
          priority,
          sentAt: nowLabel,
          deliveryState: 'En cola (Mock)',
        },
        ...prev,
      ]);
      return;
    }

    try {
      await ecoRutaApi.sendPushNotification(apiConfig, {
        userId: user.id,
        title,
        body,
        priority,
        appPackage: user.appPackage || 'com.ecoruta.libano',
      });
      setPushLogs((prev) => [
        {
          id: `push-${Date.now()}`,
          targetUserId: user.id,
          targetName: user.name,
          title,
          body,
          priority,
          sentAt: nowLabel,
          deliveryState: 'Enviada',
        },
        ...prev,
      ]);
    } catch (err) {
      setApiErrorBanner(
        `Error al enviar push: ${
          err instanceof Error ? err.message : 'Desconocido'
        }`
      );
    }
  };

  const handleUpdateIncident = async (
    incidentId: string,
    payload: {
      status?: IncidentStatus;
      adminNotes?: string;
      assignedCollectorId?: string | null;
    }
  ) => {
    const resolvedAt =
      payload.status === 'resolved'
        ? `Hoy · ${new Date().toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit',
          })}`
        : undefined;

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
              ...inc,
              ...payload,
              resolvedAt:
                payload.status === 'resolved' ? resolvedAt : inc.resolvedAt,
            }
          : inc
      )
    );

    if (!apiConfig.useMockData) {
      try {
        await ecoRutaApi.updateIncident(apiConfig, incidentId, payload);
      } catch (err) {
        setApiErrorBanner(
          `Error al actualizar incidencia: ${
            err instanceof Error ? err.message : 'Desconocido'
          }`
        );
      }
    }
  };

  const pendingIncidentsCount = incidents.filter(
    (i) => i.status !== 'resolved'
  ).length;
  const onlineCollectorsCount = collectors.filter(
    (c) => c.status === 'online'
  ).length;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex bg-slate-50 text-slate-900">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingIncidentsCount={pendingIncidentsCount}
          onlineCollectorsCount={onlineCollectorsCount}
          apiConfig={apiConfig}
          wsConnected={wsConnected}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            activeTab={activeTab}
            apiConfig={apiConfig}
            isSyncing={isSyncing}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onRefreshData={() => syncFromServer(apiConfig)}
            onOpenNewRoute={() => {
              setActiveTab('routes');
              setCreateRouteTrigger((n) => n + 1);
            }}
            onNavigateApiSettings={() => setActiveTab('api-settings')}
          />

          <AnimatePresence>
            {apiErrorBanner && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mx-5 sm:mx-8 mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 flex items-center justify-between gap-3 text-xs font-semibold text-red-800"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>{apiErrorBanner}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('api-settings')}
                    className="font-bold underline hover:text-red-950"
                  >
                    Revisar Conexión
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiErrorBanner(null)}
                    className="text-red-500 hover:text-red-800"
                    aria-label="Cerrar alerta"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <main className="flex-1 p-5 sm:p-8 max-w-[1440px] w-full mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === 'send' && <SendView />}

                {activeTab === 'overview' && (
                  <OverviewDashboard
                    routes={routes}
                    collectors={collectors}
                    points={points}
                    incidents={incidents}
                    dailyMetrics={dailyMetrics}
                    onNavigateTab={setActiveTab}
                    onFocusCollectorOnMap={(colId) => {
                      setFocusedCollectorId(colId);
                      setActiveTab('map');
                    }}
                    onSelectIncident={(incId) => {
                      setSelectedIncidentId(incId);
                      setActiveTab('incidents');
                    }}
                  />
                )}

                {activeTab === 'map' && (
                  <LiveMapView
                    routes={routes}
                    collectors={collectors}
                    points={points}
                    incidents={incidents}
                    focusedCollectorId={focusedCollectorId}
                    focusedCoords={focusedCoords}
                    isSimulatingGps={isSimulatingGps}
                    useMockData={apiConfig.useMockData}
                    onToggleSimulation={() => setIsSimulatingGps((v) => !v)}
                    onUpdatePointStatus={handleUpdatePointStatus}
                    onClearFocus={() => {
                      setFocusedCollectorId(null);
                      setFocusedCoords(null);
                    }}
                  />
                )}

                {activeTab === 'routes' && (
                  <RoutesManager
                    routes={routes}
                    collectors={collectors}
                    externalCreateTrigger={createRouteTrigger}
                    onCreateRoute={handleCreateRoute}
                    onUpdateRoute={handleUpdateRoute}
                    onToggleRoute={handleToggleRoute}
                    onDeleteRoute={handleDeleteRoute}
                  />
                )}

                {activeTab === 'users' && (
                  <UsersManager
                    users={users}
                    pushLogs={pushLogs}
                    onUpdateUser={handleUpdateUser}
                    onSendPushNotification={handleSendPushNotification}
                  />
                )}

                {activeTab === 'incidents' && (
                  <IncidentsInbox
                    incidents={incidents}
                    collectors={collectors}
                    routes={routes}
                    initialSelectedId={selectedIncidentId}
                    onUpdateIncident={handleUpdateIncident}
                    onLocateOnMap={(lat, lng, label) => {
                      setFocusedCoords({ lat, lng, label });
                      setActiveTab('map');
                    }}
                  />
                )}

                {activeTab === 'api-settings' && (
                  <ApiSettingsView
                    config={apiConfig}
                    onSaveConfig={handleSaveApiConfig}
                    onResetMockData={handleResetMockData}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
