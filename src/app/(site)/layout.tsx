import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        openingHours={settings.openingHours}
        specialDates={settings.specialDates}
      />
      <main className="flex-1">{children}</main>
      <Footer openingHours={settings.openingHours} />
      <CookieBanner />
    </div>
  );
}
