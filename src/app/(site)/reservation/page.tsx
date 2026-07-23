import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { ReservationForm } from "@/components/reservation/reservation-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Tisch reservieren",
  description:
    "Reservieren Sie online Ihren Tisch im China Restaurant Three Kingdoms in Düsseldorf. Schnell, einfach und bequem.",
};

export default async function ReservationPage() {
  const settings = await getSettings();
  return (
    <div className="py-16">
      <ReservationForm
        enabled={settings.reservationsEnabled}
        openingHours={settings.openingHours}
      />
    </div>
  );
}
