import React, { useMemo, useState } from 'react';
import {
  Bell,
  Search,
  Send,
  ShieldCheck,
  Truck,
  User,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type {
  EcoUser,
  PushNotificationLog,
  UserAccountStatus,
  UserRole,
} from '../types/ecoruta';

interface UsersManagerProps {
  users: EcoUser[];
  pushLogs: PushNotificationLog[];
  onUpdateUser: (
    userId: string,
    payload: { role?: UserRole; status?: UserAccountStatus }
  ) => Promise<void> | void;
  onSendPushNotification: (
    user: EcoUser,
    title: string,
    body: string,
    priority: 'normal' | 'high'
  ) => Promise<void> | void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  collector: 'Recolector',
  citizen: 'Ciudadano',
  admin: 'Administrador',
};

function RoleAvatar({ role }: { role: UserRole }) {
  if (role === 'collector') {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <Truck className="h-6 w-6" />
      </div>
    );
  }
  if (role === 'admin') {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        <ShieldCheck className="h-6 w-6" />
      </div>
    );
  }
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
      <User className="h-6 w-6" />
    </div>
  );
}

export function UsersManager({
  users,
  pushLogs,
  onUpdateUser,
  onSendPushNotification,
}: UsersManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserAccountStatus | 'all'>(
    'all'
  );

  const [pushTarget, setPushTarget] = useState<EcoUser | null>(null);
  const [pushTitle, setPushTitle] = useState('');
  const [pushBody, setPushBody] = useState('');
  const [pushPriority, setPushPriority] = useState<'normal' | 'high'>('normal');
  const [pushSending, setPushSending] = useState(false);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.zone.toLowerCase().includes(q) ||
        (user.vehiclePlate ?? '').toLowerCase().includes(q)
      );
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  function openPushModal(user: EcoUser) {
    setPushTarget(user);
    setPushTitle(
      user.role === 'collector' ? 'Aviso de Ruta' : 'Mensaje de EcoRuta'
    );
    setPushBody('');
    setPushPriority(user.role === 'collector' ? 'high' : 'normal');
  }

  async function handleSendPush(e: React.FormEvent) {
    e.preventDefault();
    if (!pushTarget || !pushTitle.trim() || !pushBody.trim()) return;
    setPushSending(true);
    try {
      await onSendPushNotification(
        pushTarget,
        pushTitle.trim(),
        pushBody.trim(),
        pushPriority
      );
      setPushTarget(null);
    } finally {
      setPushSending(false);
    }
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
              placeholder="Buscar persona o placa..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="inline-flex flex-wrap items-center gap-1 rounded-2xl bg-slate-100 p-1">
            {(
              [
                { id: 'all', label: 'Todos' },
                { id: 'collector', label: 'Recolectores' },
                { id: 'citizen', label: 'Ciudadanos' },
                { id: 'admin', label: 'Admins' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap ${
                  roleFilter === tab.id
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
          aria-label="Filtrar por estado"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as UserAccountStatus | 'all')
          }
          className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:border-emerald-500 focus:outline-none self-start lg:self-auto"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="suspended">Suspendidos</option>
        </select>
      </div>

      {/* Spacious User Cards Grid */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-sm font-semibold text-slate-500">
          No hay usuarios con estos filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredUsers.map((user, idx) => {
            const isSuspended = user.status === 'suspended';
            return (
              <motion.article
                key={user.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.035,
                  duration: 0.24,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -2 }}
                className={`rounded-3xl border bg-white p-6 flex flex-col justify-between gap-4 transition-shadow hover:shadow-md ${
                  isSuspended
                    ? 'border-red-100 bg-red-50/20'
                    : 'border-slate-200/80 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <RoleAvatar role={user.role} />
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-bold text-slate-900 truncate">
                        {user.name}
                      </h3>
                      <div className="text-xs text-slate-500 truncate">
                        {user.zone}
                        {user.vehiclePlate ? ` · Placa ${user.vehiclePlate}` : ''}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {user.phone} · {user.lastActiveAt}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold shrink-0 ${
                      isSuspended
                        ? 'bg-red-50 text-red-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {isSuspended ? 'Suspendida' : 'Activa'}
                  </span>
                </div>

                {/* Role & Literal Action Controls */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                  <select
                    aria-label={`Rol de ${user.name}`}
                    value={user.role}
                    onChange={(e) =>
                      onUpdateUser(user.id, {
                        role: e.target.value as UserRole,
                      })
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-wrap items-center gap-2">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => openPushModal(user)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors whitespace-nowrap"
                    >
                      <Bell className="h-3.5 w-3.5" />
                      <span>Enviar Aviso</span>
                    </motion.button>

                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() =>
                        onUpdateUser(user.id, {
                          status: isSuspended ? 'active' : 'suspended',
                        })
                      }
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
                        isSuspended
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {isSuspended ? (
                        <>
                          <UserCheck className="h-3.5 w-3.5" />
                          <span>Reactivar</span>
                        </>
                      ) : (
                        <>
                          <UserX className="h-3.5 w-3.5" />
                          <span>Suspender</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Simple Recent Push Log */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="font-display text-base font-bold text-slate-900">
            Avisos Enviados
          </h2>
          <span className="font-mono text-xs font-bold text-slate-500 tabular-nums">
            {pushLogs.length} recientes
          </span>
        </div>

        {pushLogs.length === 0 ? (
          <div className="text-xs text-slate-500">
            No se han enviado avisos hoy.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pushLogs.slice(0, 4).map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl bg-slate-50 p-4 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {log.title} → {log.targetName}
                  </div>
                  <div className="mt-1 text-xs text-slate-600 truncate">
                    {log.body}
                  </div>
                </div>
                <span className="rounded-xl bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 shrink-0">
                  {log.sentAt}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Animated Push Modal */}
      <AnimatePresence>
        {pushTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-[2px]"
              onClick={() => setPushTarget(null)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900">
                    Enviar Aviso Móvil
                  </h3>
                  <p className="text-xs text-slate-500">Para: {pushTarget.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPushTarget(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSendPush} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Título
                  </label>
                  <input
                    type="text"
                    required
                    value={pushTitle}
                    onChange={(e) => setPushTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mensaje
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={pushBody}
                    onChange={(e) => setPushBody(e.target.value)}
                    placeholder="Escribe el mensaje para la app..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPushPriority('normal')}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-colors ${
                      pushPriority === 'normal'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Aviso Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPushPriority('high')}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-colors ${
                      pushPriority === 'high'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    Aviso Urgente
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPushTarget(null)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={pushSending}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{pushSending ? 'Enviando...' : 'Enviar Aviso'}</span>
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
