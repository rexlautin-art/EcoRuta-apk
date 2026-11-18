export type DashboardTab =
  | 'send'
  | 'overview'
  | 'map'
  | 'routes'
  | 'users'
  | 'incidents'
  | 'api-settings';

export type WasteType = 'Reciclable' | 'Orgánico' | 'Ordinario' | 'Mixto';

export type PointStatus = 'pending' | 'in_progress' | 'completed' | 'incident';

export type CollectorStatus = 'online' | 'paused' | 'offline';

export type UserRole = 'collector' | 'citizen' | 'admin';

export type UserAccountStatus = 'active' | 'suspended';

export type IncidentSeverity = 'high' | 'medium' | 'low';

export type IncidentStatus = 'pending' | 'in_review' | 'resolved';

export type WeekDay = 'L' | 'M' | 'X' | 'J' | 'V' | 'S' | 'D';

export interface LatLngPoint {
  lat: number;
  lng: number;
}

export interface EcoRoute {
  id: string;
  code: string;
  name: string;
  zone: string;
  neighborhoods: string[];
  wasteType: WasteType;
  days: WeekDay[];
  startTime: string;
  endTime: string;
  active: boolean;
  assignedCollectorId: string | null;
  color: string;
  pathCoordinates: LatLngPoint[];
  estimatedDurationMin: number;
}

export interface CollectionPoint {
  id: string;
  routeId: string;
  name: string;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  status: PointStatus;
  fillLevel: number;
  lastUpdated: string;
  notes?: string;
}

export interface CollectorVehicle {
  id: string;
  name: string;
  plate: string;
  driverId: string;
  driverName: string;
  phone: string;
  routeId: string | null;
  lat: number;
  lng: number;
  speedKmh: number;
  headingDeg: number;
  status: CollectorStatus;
  fuelPct: number;
  completedToday: number;
  totalAssignedToday: number;
  lastPingAt: string;
  /** Índice flotante para interpolación suave sobre la polilínea de ruta en modo simulado */
  pathProgress: number;
}

export interface EcoUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserAccountStatus;
  zone: string;
  vehiclePlate?: string;
  appPackage: string;
  createdAt: string;
  lastActiveAt: string;
  reportsCount: number;
}

export interface IncidentReport {
  id: string;
  title: string;
  category:
    | 'Contenedor lleno'
    | 'Bloqueo en la vía'
    | 'Punto crítico'
    | 'Falla mecánica'
    | 'Residuos especiales';
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  lat: number;
  lng: number;
  address: string;
  neighborhood: string;
  routeId: string | null;
  reportedByUserId: string;
  reportedByName: string;
  reportedByRole: UserRole;
  createdAt: string;
  resolvedAt?: string;
  adminNotes: string;
  assignedCollectorId: string | null;
}

export interface DailyActivityMetric {
  id: string;
  dayLabel: string;
  dateLabel: string;
  completedPoints: number;
  targetPoints: number;
  tonsCollected: number;
  compliancePct: number;
}

export interface PushNotificationLog {
  id: string;
  targetUserId: string;
  targetName: string;
  title: string;
  body: string;
  priority: 'normal' | 'high';
  sentAt: string;
  deliveryState: 'Enviada' | 'En cola (Mock)';
}

export interface ApiConfig {
  baseUrl: string;
  wsUrl: string;
  bearerToken: string;
  useMockData: boolean;
  autoRefreshSeconds: number;
}

export interface ConnectionTestResult {
  ok: boolean;
  status?: number;
  latencyMs: number;
  message: string;
  serverInfo?: string;
  testedAt: string;
}
