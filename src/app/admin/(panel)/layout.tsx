import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { hasDatabase } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      userName={session.name}
      userEmail={session.email}
      demoMode={!hasDatabase()}
    >
      {children}
    </AdminShell>
  );
}
