import { QrGenerator } from "@/components/admin/qr-generator";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminQrPage() {
  return <QrGenerator />;
}
