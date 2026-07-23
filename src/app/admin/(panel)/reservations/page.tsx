import { getAdminReservations } from "@/lib/admin-data";
import { ReservationsManager } from "@/components/admin/reservations-manager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminReservationsPage() {
  const reservations = await getAdminReservations();
  return <ReservationsManager initialReservations={reservations} />;
}
