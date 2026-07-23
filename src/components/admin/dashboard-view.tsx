"use client";

import {
  ShoppingBag,
  Euro,
  CalendarDays,
  Clock,
  UtensilsCrossed,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import type { DashboardStats, AdminOrder, AdminReservation } from "@/lib/admin-data";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "./status-badge";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#E4C97A",
  CONFIRMED: "#4ade80",
  COMPLETED: "#38bdf8",
  CANCELLED: "#D64550",
};

export function DashboardView({
  stats,
  recentOrders,
  recentReservations,
}: {
  stats: DashboardStats;
  recentOrders: AdminOrder[];
  recentReservations: AdminReservation[];
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-neutral-400">
          Übersicht über den heutigen Betrieb
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Bestellungen heute"
          value={String(stats.todayOrders)}
          icon={<ShoppingBag className="h-6 w-6" />}
          accent="text-sky-400 bg-sky-400/10"
        />
        <StatCard
          label="Umsatz heute"
          value={formatPrice(stats.todayRevenue)}
          icon={<Euro className="h-6 w-6" />}
          accent="text-gold bg-gold/10"
        />
        <StatCard
          label="Reservierungen heute"
          value={String(stats.todayReservations)}
          icon={<CalendarDays className="h-6 w-6" />}
          accent="text-emerald-400 bg-emerald-400/10"
        />
        <StatCard
          label="Offene Bestellungen"
          value={String(stats.pendingOrders)}
          icon={<Clock className="h-6 w-6" />}
          accent="text-amber-400 bg-amber-400/10"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-serif text-lg font-semibold text-white">
            Umsatz (letzte 7 Tage)
          </h2>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueByDay}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C8A24B" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#C8A24B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#1A1A1D",
                    border: "1px solid #2A2A2E",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                  formatter={(v: number) => [formatPrice(v), "Umsatz"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C8A24B"
                  strokeWidth={2}
                  fill="url(#revGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-serif text-lg font-semibold text-white">
            Bestellungen nach Status
          </h2>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.ordersByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
                <XAxis dataKey="status" stroke="#71717a" fontSize={10} />
                <YAxis stroke="#71717a" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "#1A1A1D",
                    border: "1px solid #2A2A2E",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.ordersByStatus.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] ?? "#C8A24B"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-ink-border px-6 py-4">
            <ShoppingBag className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-lg font-semibold text-white">
              Neueste Bestellungen
            </h2>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyRow icon={<ShoppingBag className="h-8 w-8" />} text="Keine Bestellungen" />
          ) : (
            <ul className="divide-y divide-ink-border">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{o.customerName}</p>
                    <p className="text-xs text-neutral-500">
                      {o.type === "DELIVERY" ? "Lieferung" : "Abholung"} ·{" "}
                      {o.items.reduce((s, i) => s + i.quantity, 0)} Artikel
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gold">
                      {formatPrice(o.total)}
                    </span>
                    <StatusBadge status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-ink-border px-6 py-4">
            <CalendarDays className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-lg font-semibold text-white">
              Neueste Reservierungen
            </h2>
          </div>
          {recentReservations.length === 0 ? (
            <EmptyRow icon={<CalendarDays className="h-8 w-8" />} text="Keine Reservierungen" />
          ) : (
            <ul className="divide-y divide-ink-border">
              {recentReservations.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{r.name}</p>
                    <p className="text-xs text-neutral-500">
                      {r.date} · {r.time} · {r.guests} Gäste
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <UtensilsCrossed className="h-4 w-4" />
        {stats.totalDishes} Gerichte in der Speisekarte
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-neutral-500">{label}</p>
    </div>
  );
}

function EmptyRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-neutral-600">
      {icon}
      <p className="text-sm">{text}</p>
    </div>
  );
}
