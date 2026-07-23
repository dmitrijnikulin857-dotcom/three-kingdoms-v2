import { getAdminOrders } from "@/lib/admin-data";
import { OrdersManager } from "@/components/admin/orders-manager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  return <OrdersManager initialOrders={orders} />;
}
