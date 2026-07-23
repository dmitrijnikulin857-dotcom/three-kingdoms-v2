import {
  getDashboardStats,
  getAdminOrders,
  getAdminReservations,
} from "@/lib/admin-data";
import { DashboardView } from "@/components/admin/dashboard-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [stats, orders, reservations] = await Promise.all([
    getDashboardStats(),
    getAdminOrders(),
    getAdminReservations(),
  ]);

  return (
    <DashboardView
      stats={stats}
      recentOrders={orders.slice(0, 5)}
      recentReservations={reservations.slice(0, 5)}
    />
  );
}
