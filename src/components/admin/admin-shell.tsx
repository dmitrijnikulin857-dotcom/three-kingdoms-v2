"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CalendarDays,
  Settings,
  QrCode,
  LogOut,
  Menu,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Speisekarte", icon: UtensilsCrossed },
  { href: "/admin/orders", label: "Bestellungen", icon: ShoppingBag },
  { href: "/admin/reservations", label: "Reservierungen", icon: CalendarDays },
  { href: "/admin/settings", label: "Einstellungen", icon: Settings },
  { href: "/admin/qr", label: "QR-Code", icon: QrCode },
];

export function AdminShell({
  children,
  userName,
  userEmail,
  demoMode,
}: {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  demoMode: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink text-neutral-200 lg:flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-ink-border bg-ink-soft transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-20 items-center gap-3 border-b border-ink-border px-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 font-serif text-lg font-bold text-gold">
            三
          </span>
          <div className="leading-none">
            <p className="font-serif text-sm font-bold text-white">Three Kingdoms</p>
            <p className="text-[11px] uppercase tracking-wider text-gold/70">Admin</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-gold/15 text-gold-light"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-ink-border p-4">
          <Link
            href="/"
            target="_blank"
            className="mb-2 flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-neutral-400 hover:text-gold"
          >
            <ExternalLink className="h-4 w-4" />
            Website ansehen
          </Link>
          <div className="rounded-xl bg-ink-card p-3">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            <p className="truncate text-xs text-neutral-500">{userEmail}</p>
            <button
              onClick={logout}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-ink-border py-2 text-sm text-neutral-300 hover:border-crimson/50 hover:text-crimson-light"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-ink-border bg-ink/90 px-4 backdrop-blur lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-border text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          {demoMode && (
            <span className="badge border border-amber-500/40 bg-amber-500/10 text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              Demo-Modus (keine Datenbank)
            </span>
          )}
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
