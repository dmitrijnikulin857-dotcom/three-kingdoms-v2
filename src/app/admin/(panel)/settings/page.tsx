import { getSettings } from "@/lib/data";
import { SettingsManager } from "@/components/admin/settings-manager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return <SettingsManager initialSettings={settings} />;
}
