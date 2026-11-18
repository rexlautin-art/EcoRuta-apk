import type {
  ApiConfig,
  CollectionPoint,
  CollectorVehicle,
  ConnectionTestResult,
  DailyActivityMetric,
  EcoRoute,
  EcoUser,
  IncidentReport,
  IncidentStatus,
  PointStatus,
  UserAccountStatus,
  UserRole,
} from '../types/ecoruta';

const CONFIG_STORAGE_KEY = 'ecoruta_admin_api_config_v1';

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: 'http://localhost:3000',
  wsUrl: 'ws://localhost:3000',
  bearerToken: '',
  useMockData: true,
  autoRefreshSeconds: 5,
};

export function loadApiConfig(): ApiConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_API_CONFIG;
    const parsed = JSON.parse(raw) as Partial<ApiConfig>;
    return {
      ...DEFAULT_API_CONFIG,
      ...parsed,
    };
  } catch {
    return DEFAULT_API_CONFIG;
  }
}

export function saveApiConfig(config: ApiConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignorar error de almacenamiento privado
  }
}

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

async function requestJson<T>(
  config: ApiConfig,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  if (!baseUrl) {
    throw new Error('La URL base del servidor no está configurada.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Client-App': 'ecoruta-admin-dashboard',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (config.bearerToken.trim()) {
    headers['Authorization'] = `Bearer ${config.bearerToken.trim()}`;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(
        `HTTP ${response.status} (${response.statusText})${
          errorText ? `: ${errorText.slice(0, 140)}` : ''
        }`
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export const ecoRutaApi = {
  /**
   * Verifica disponibilidad del servidor server.cjs y validez del Bearer Token.
   */
  async testConnection(config: ApiConfig): Promise<ConnectionTestResult> {
    const started = performance.now();
    try {
      const data = await requestJson<{
        ok?: boolean;
        service?: string;
        version?: string;
        appId?: string;
      }>(config, '/api/health', { method: 'GET' });
      const latencyMs = Math.round(performance.now() - started);
      return {
        ok: true,
        status: 200,
        latencyMs,
        message: 'Conexión establecida correctamente con el servidor Node.js.',
        serverInfo: data?.service
          ? `${data.service}${data.version ? ` v${data.version}` : ''}`
          : 'Respuesta JSON válida desde /api/health',
        testedAt: new Date().toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };
    } catch (err) {
      const latencyMs = Math.round(performance.now() - started);
      const message =
        err instanceof Error
          ? err.name === 'AbortError'
            ? 'Tiempo de espera agotado (8s). Verifica que server.cjs esté ejecutándose.'
            : err.message
          : 'Error de red al conectar con el servidor.';
      return {
        ok: false,
        latencyMs,
        message,
        testedAt: new Date().toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };
    }
  },

  // ---------------------------------------------------------------------------
  // Sincronización inicial de estado completo desde server.cjs
  // ---------------------------------------------------------------------------
  fetchRoutes: (cfg: ApiConfig) => requestJson<EcoRoute[]>(cfg, '/api/routes'),
  fetchPoints: (cfg: ApiConfig) =>
    requestJson<CollectionPoint[]>(cfg, '/api/points'),
  fetchCollectorsLive: (cfg: ApiConfig) =>
    requestJson<CollectorVehicle[]>(cfg, '/api/collectors/live'),
  fetchUsers: (cfg: ApiConfig) => requestJson<EcoUser[]>(cfg, '/api/users'),
  fetchIncidents: (cfg: ApiConfig) =>
    requestJson<IncidentReport[]>(cfg, '/api/incidents'),
  fetchDailyAnalytics: (cfg: ApiConfig) =>
    requestJson<DailyActivityMetric[]>(cfg, '/api/analytics/daily'),

  // ---------------------------------------------------------------------------
  // Mutaciones REST hacia server.cjs
  // ---------------------------------------------------------------------------
  createRoute: (cfg: ApiConfig, payload: Omit<EcoRoute, 'id'>) =>
    requestJson<EcoRoute>(cfg, '/api/routes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateRoute: (cfg: ApiConfig, id: string, payload: Partial<EcoRoute>) =>
    requestJson<EcoRoute>(cfg, `/api/routes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  toggleRouteStatus: (cfg: ApiConfig, id: string, active: boolean) =>
    requestJson<EcoRoute>(cfg, `/api/routes/${encodeURIComponent(id)}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    }),

  deleteRoute: (cfg: ApiConfig, id: string) =>
    requestJson<void>(cfg, `/api/routes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  updatePointStatus: (
    cfg: ApiConfig,
    pointId: string,
    status: PointStatus,
    notes?: string
  ) =>
    requestJson<CollectionPoint>(
      cfg,
      `/api/points/${encodeURIComponent(pointId)}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      }
    ),

  updateUser: (
    cfg: ApiConfig,
    userId: string,
    payload: { role?: UserRole; status?: UserAccountStatus }
  ) =>
    requestJson<EcoUser>(cfg, `/api/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  sendPushNotification: (
    cfg: ApiConfig,
    payload: {
      userId: string;
      title: string;
      body: string;
      priority: 'normal' | 'high';
      appPackage: string;
    }
  ) =>
    requestJson<{ sent: boolean; messageId?: string }>(
      cfg,
      '/api/notifications/push',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),

  updateIncident: (
    cfg: ApiConfig,
    incidentId: string,
    payload: {
      status?: IncidentStatus;
      adminNotes?: string;
      assignedCollectorId?: string | null;
    }
  ) =>
    requestJson<IncidentReport>(
      cfg,
      `/api/incidents/${encodeURIComponent(incidentId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }
    ),
};

export interface LiveSocketCallbacks {
  onCollectorGps?: (payload: Partial<CollectorVehicle> & { id: string }) => void;
  onPointUpdated?: (payload: Partial<CollectionPoint> & { id: string }) => void;
  onIncidentCreated?: (payload: IncidentReport) => void;
  onStatusChange?: (connected: boolean) => void;
}

/**
 * Conecta al WebSocket de server.cjs para telemetría GPS y eventos en vivo.
 * Retorna una función de limpieza para cerrar el socket al desmontar.
 */
export function connectLiveSocket(
  config: ApiConfig,
  callbacks: LiveSocketCallbacks
): () => void {
  if (config.useMockData || !config.wsUrl.trim()) {
    callbacks.onStatusChange?.(false);
    return () => {};
  }

  const baseWs = config.wsUrl.trim().replace(/\/+$/, '');
  const tokenQuery = config.bearerToken.trim()
    ? `?token=${encodeURIComponent(config.bearerToken.trim())}`
    : '';
  let socket: WebSocket | null = null;
  let closedManually = false;

  try {
    socket = new WebSocket(`${baseWs}/ws/admin${tokenQuery}`);

    socket.onopen = () => {
      callbacks.onStatusChange?.(true);
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(String(event.data)) as {
          event: string;
          data: unknown;
        };
        if (msg.event === 'gps:update' && msg.data) {
          callbacks.onCollectorGps?.(
            msg.data as Partial<CollectorVehicle> & { id: string }
          );
        } else if (msg.event === 'point:status' && msg.data) {
          callbacks.onPointUpdated?.(
            msg.data as Partial<CollectionPoint> & { id: string }
          );
        } else if (msg.event === 'incident:new' && msg.data) {
          callbacks.onIncidentCreated?.(msg.data as IncidentReport);
        }
      } catch {
        // Ignorar mensajes malformados
      }
    };

    socket.onclose = () => {
      if (!closedManually) {
        callbacks.onStatusChange?.(false);
      }
    };

    socket.onerror = () => {
      callbacks.onStatusChange?.(false);
    };
  } catch {
    callbacks.onStatusChange?.(false);
  }

  return () => {
    closedManually = true;
    if (socket && socket.readyState <= WebSocket.OPEN) {
      socket.close();
    }
  };
}

export interface EndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  module: string;
  description: string;
  requestExample?: string;
  responseExample: string;
}

/**
 * Contrato REST oficial que consume este Panel de Control desde server.cjs
 */
export const REST_ENDPOINTS_SPEC: EndpointDoc[] = [
  {
    method: 'GET',
    path: '/api/health',
    module: 'Sistema',
    description: 'Verifica disponibilidad del servidor Node.js y token Bearer.',
    responseExample: `{ "ok": true, "service": "ecoruta-server", "version": "1.0.0" }`,
  },
  {
    method: 'GET',
    path: '/api/analytics/daily',
    module: 'Dashboard',
    description:
      'Retorna el histórico de los últimos 7 días (puntos completados, toneladas y % cumplimiento).',
    responseExample: `[{ "id": "d-1", "dayLabel": "Lun", "dateLabel": "10 Nov", "completedPoints": 154, "targetPoints": 165, "tonsCollected": 12.4, "compliancePct": 93 }]`,
  },
  {
    method: 'GET',
    path: '/api/collectors/live',
    module: 'Mapa en vivo',
    description:
      'Lista las coordenadas GPS actuales, velocidad, ruta asignada y estado de cada vehículo.',
    responseExample: `[{ "id": "col-01", "name": "Compactador Eco-01", "plate": "LBN-402", "lat": 4.9233, "lng": -75.0621, "speedKmh": 18, "status": "online" }]`,
  },
  {
    method: 'GET',
    path: '/api/points',
    module: 'Mapa en vivo',
    description:
      'Obtiene los puntos de acopio y su estado actual (pending, in_progress, completed, incident).',
    responseExample: `[{ "id": "pt-01", "routeId": "route-01", "name": "Parque Isidro Parra", "lat": 4.9226, "lng": -75.0632, "status": "completed", "fillLevel": 15 }]`,
  },
  {
    method: 'PATCH',
    path: '/api/points/:id/status',
    module: 'Mapa en vivo',
    description: 'Actualiza manualmente el estado y notas de un punto de acopio.',
    requestExample: `{ "status": "completed", "notes": "Recolección verificada por despacho" }`,
    responseExample: `{ "id": "pt-01", "status": "completed", "lastUpdated": "09:18" }`,
  },
  {
    method: 'GET',
    path: '/api/routes',
    module: 'Rutas',
    description:
      'Lista todas las rutas ecológicas con barrios, horarios, días y polilíneas GPS.',
    responseExample: `[{ "id": "route-01", "code": "ECO-01", "name": "Centro Histórico", "wasteType": "Reciclable", "days": ["L","X","V"], "active": true }]`,
  },
  {
    method: 'POST',
    path: '/api/routes',
    module: 'Rutas',
    description: 'Crea una nueva ruta ecológica y asigna zona, horarios y recolector.',
    requestExample: `{ "code": "ECO-07", "name": "Sector La Vega", "zone": "Zona Este", "neighborhoods": ["La Vega"], "wasteType": "Orgánico", "days": ["M","J"], "startTime": "06:30", "endTime": "10:30", "active": true }`,
    responseExample: `{ "id": "route-07", "code": "ECO-07", "active": true }`,
  },
  {
    method: 'PUT',
    path: '/api/routes/:id',
    module: 'Rutas',
    description: 'Edita los datos completos de una ruta existente.',
    requestExample: `{ "name": "Centro Histórico y Galería", "startTime": "05:45", "endTime": "10:15" }`,
    responseExample: `{ "id": "route-01", "name": "Centro Histórico y Galería" }`,
  },
  {
    method: 'PATCH',
    path: '/api/routes/:id/toggle',
    module: 'Rutas',
    description: 'Activa o desactiva rápidamente una ruta en operación.',
    requestExample: `{ "active": false }`,
    responseExample: `{ "id": "route-01", "active": false }`,
  },
  {
    method: 'DELETE',
    path: '/api/routes/:id',
    module: 'Rutas',
    description: 'Elimina permanentemente una ruta ecológica por su ID.',
    responseExample: `204 No Content`,
  },
  {
    method: 'GET',
    path: '/api/users',
    module: 'Usuarios',
    description: 'Obtiene conductores recolectores, ciudadanos reportantes y administradores.',
    responseExample: `[{ "id": "usr-01", "name": "Carlos Andrés Mejía", "role": "collector", "status": "active", "appPackage": "com.ecoruta.libano" }]`,
  },
  {
    method: 'PATCH',
    path: '/api/users/:id',
    module: 'Usuarios',
    description: 'Cambia el rol o suspende/reactiva la cuenta de un usuario.',
    requestExample: `{ "role": "collector", "status": "suspended" }`,
    responseExample: `{ "id": "usr-01", "role": "collector", "status": "suspended" }`,
  },
  {
    method: 'POST',
    path: '/api/notifications/push',
    module: 'Usuarios',
    description:
      'Envía una notificación push directa a la app móvil com.ecoruta.libano (FCM / WebSocket).',
    requestExample: `{ "userId": "usr-01", "title": "Cambio de ruta", "body": "Dirigirse al punto Los Pinos", "priority": "high", "appPackage": "com.ecoruta.libano" }`,
    responseExample: `{ "sent": true, "messageId": "fcm-948102" }`,
  },
  {
    method: 'GET',
    path: '/api/incidents',
    module: 'Incidencias',
    description: 'Lista reportes ciudadanos y alertas operativas enviadas desde la app.',
    responseExample: `[{ "id": "inc-01", "title": "Contenedor desbordado", "severity": "high", "status": "pending", "lat": 4.9278, "lng": -75.0626 }]`,
  },
  {
    method: 'PATCH',
    path: '/api/incidents/:id',
    module: 'Incidencias',
    description: 'Actualiza estado (pending, in_review, resolved), recolector asignado y notas.',
    requestExample: `{ "status": "resolved", "adminNotes": "Punto despejado por Compactador Eco-02" }`,
    responseExample: `{ "id": "inc-01", "status": "resolved", "resolvedAt": "Hoy · 09:24" }`,
  },
];

export const SERVER_CJS_SNIPPET = `// Fragmento de ejemplo para enlazar tu server.cjs con el Panel EcoRuta
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// Middleware de autenticación Bearer Token
function requireAdminAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\\s+/i, '');
  if (process.env.ADMIN_TOKEN && token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Token inválido' });
  }
  next();
}

app.get('/api/health', requireAdminAuth, (req, res) => {
  res.json({ ok: true, service: 'ecoruta-server', version: '1.0.0' });
});

app.get('/api/routes', requireAdminAuth, (req, res) => { /* ... */ });
app.post('/api/routes', requireAdminAuth, (req, res) => { /* ... */ });
app.put('/api/routes/:id', requireAdminAuth, (req, res) => { /* ... */ });
app.patch('/api/routes/:id/toggle', requireAdminAuth, (req, res) => { /* ... */ });
app.delete('/api/routes/:id', requireAdminAuth, (req, res) => { /* ... */ });

app.get('/api/collectors/live', requireAdminAuth, (req, res) => { /* ... */ });
app.get('/api/points', requireAdminAuth, (req, res) => { /* ... */ });
app.patch('/api/points/:id/status', requireAdminAuth, (req, res) => { /* ... */ });

app.get('/api/users', requireAdminAuth, (req, res) => { /* ... */ });
app.patch('/api/users/:id', requireAdminAuth, (req, res) => { /* ... */ });
app.post('/api/notifications/push', requireAdminAuth, (req, res) => { /* ... */ });

app.get('/api/incidents', requireAdminAuth, (req, res) => { /* ... */ });
app.patch('/api/incidents/:id', requireAdminAuth, (req, res) => { /* ... */ });
app.get('/api/analytics/daily', requireAdminAuth, (req, res) => { /* ... */ });`;
