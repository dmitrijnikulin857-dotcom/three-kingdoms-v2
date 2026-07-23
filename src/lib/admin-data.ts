import { prisma, hasDatabase } from "./prisma";

export interface AdminOrder {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  type: string;
  address: string;
  items: { dishId?: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  pickupTime: string;
  notes: string;
  status: string;
  createdAt: string;
}

export interface AdminReservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: string;
  createdAt: string;
}

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  todayReservations: number;
  pendingOrders: number;
  totalDishes: number;
  revenueByDay: { day: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  demoMode: boolean;
}

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ---------------------------------------------------------------------------
// Demo fallbacks (used when no database is configured)
// ---------------------------------------------------------------------------
function demoOrders(): AdminOrder[] {
  const now = new Date();
  const iso = now.toISOString();
  return [
    {
      id: "demo-o1",
      customerName: "Anna Weber",
      phone: "0170 1234567",
      email: "anna@example.com",
      type: "TAKEAWAY",
      address: "",
      items: [
        { name: "Mapo Tofu", price: 14.9, quantity: 1 },
        { name: "Duftreis", price: 3.5, quantity: 2 },
      ],
      subtotal: 21.9,
      deliveryFee: 0,
      total: 21.9,
      pickupTime: "19:30",
      notes: "",
      status: "CONFIRMED",
      createdAt: iso,
    },
    {
      id: "demo-o2",
      customerName: "Markus Klein",
      phone: "0171 9876543",
      email: "markus@example.com",
      type: "DELIVERY",
      address: "Königsallee 12, 40212 Düsseldorf",
      items: [
        { name: "Kung Pao Chicken", price: 15.9, quantity: 1 },
        { name: "Yangzhou Fried Rice", price: 11.9, quantity: 1 },
      ],
      subtotal: 27.8,
      deliveryFee: 3.5,
      total: 31.3,
      pickupTime: "",
      notes: "Bitte klingeln bei Klein",
      status: "PENDING",
      createdAt: iso,
    },
    {
      id: "demo-o3",
      customerName: "Sophie Braun",
      phone: "0152 3334444",
      email: "sophie@example.com",
      type: "TAKEAWAY",
      address: "",
      items: [{ name: "Dan Dan Nudeln", price: 13.9, quantity: 2 }],
      subtotal: 27.8,
      deliveryFee: 0,
      total: 27.8,
      pickupTime: "20:00",
      notes: "",
      status: "COMPLETED",
      createdAt: iso,
    },
  ];
}

function demoReservations(): AdminReservation[] {
  const today = new Date().toISOString().slice(0, 10);
  const iso = new Date().toISOString();
  return [
    {
      id: "demo-r1",
      name: "Familie Schmidt",
      phone: "0211 5551234",
      email: "schmidt@example.com",
      date: today,
      time: "20:00",
      guests: 4,
      notes: "Fensterplatz bevorzugt",
      status: "CONFIRMED",
      createdAt: iso,
    },
    {
      id: "demo-r2",
      name: "Li Wei",
      phone: "0176 2223333",
      email: "liwei@example.com",
      date: today,
      time: "18:30",
      guests: 2,
      notes: "",
      status: "PENDING",
      createdAt: iso,
    },
  ];
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  if (!hasDatabase()) return demoOrders();
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return orders.map((o) => ({
      id: o.id,
      customerName: o.customerName,
      phone: o.phone,
      email: o.email,
      type: o.type,
      address: o.address,
      items: (o.items as AdminOrder["items"]) ?? [],
      subtotal: o.subtotal,
      deliveryFee: o.deliveryFee,
      total: o.total,
      pickupTime: o.pickupTime,
      notes: o.notes,
      status: o.status,
      createdAt: o.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("[admin-data] getAdminOrders fell back:", error);
    return demoOrders();
  }
}

export async function getAdminReservations(): Promise<AdminReservation[]> {
  if (!hasDatabase()) return demoReservations();
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return reservations.map((r) => ({
      id: r.id,
      name: r.name,
      phone: r.phone,
      email: r.email,
      date: r.date,
      time: r.time,
      guests: r.guests,
      notes: r.notes,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("[admin-data] getAdminReservations fell back:", error);
    return demoReservations();
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();

  // Build last-7-days scaffold.
  const revenueByDay: { day: string; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    revenueByDay.push({ day: WEEKDAYS[d.getDay()], revenue: 0 });
  }

  if (!hasDatabase()) {
    const orders = demoOrders();
    const reservations = demoReservations();
    // Seed some pseudo revenue across the week for a nice chart.
    const demoRevenue = [120, 210, 180, 260, 340, 420, 380];
    return {
      todayOrders: orders.length,
      todayRevenue: orders.reduce((s, o) => s + o.total, 0),
      todayReservations: reservations.length,
      pendingOrders: orders.filter((o) => o.status === "PENDING").length,
      totalDishes: 36,
      revenueByDay: revenueByDay.map((r, i) => ({
        ...r,
        revenue: demoRevenue[i],
      })),
      ordersByStatus: [
        { status: "PENDING", count: 1 },
        { status: "CONFIRMED", count: 1 },
        { status: "COMPLETED", count: 1 },
        { status: "CANCELLED", count: 0 },
      ],
      demoMode: true,
    };
  }

  try {
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [orders, todayReservations, totalDishes, grouped] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.reservation.count({
        where: { date: now.toISOString().slice(0, 10) },
      }),
      prisma.dish.count(),
      prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
    ]);

    for (const order of orders) {
      const created = new Date(order.createdAt);
      const idx = revenueByDay.findIndex(
        (_, i) => {
          const d = new Date(now);
          d.setDate(now.getDate() - (6 - i));
          return isSameDay(d, created);
        },
      );
      if (idx >= 0 && order.status !== "CANCELLED") {
        revenueByDay[idx].revenue += order.total;
      }
    }

    const todayOrders = orders.filter((o) => isSameDay(new Date(o.createdAt), now));

    return {
      todayOrders: todayOrders.length,
      todayRevenue: todayOrders
        .filter((o) => o.status !== "CANCELLED")
        .reduce((s, o) => s + o.total, 0),
      todayReservations,
      pendingOrders: orders.filter((o) => o.status === "PENDING").length,
      totalDishes,
      revenueByDay,
      ordersByStatus: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(
        (status) => ({
          status,
          count:
            grouped.find((g) => g.status === status)?._count.status ?? 0,
        }),
      ),
      demoMode: false,
    };
  } catch (error) {
    console.error("[admin-data] getDashboardStats fell back:", error);
    return {
      todayOrders: 0,
      todayRevenue: 0,
      todayReservations: 0,
      pendingOrders: 0,
      totalDishes: 36,
      revenueByDay,
      ordersByStatus: [
        { status: "PENDING", count: 0 },
        { status: "CONFIRMED", count: 0 },
        { status: "COMPLETED", count: 0 },
        { status: "CANCELLED", count: 0 },
      ],
      demoMode: true,
    };
  }
}
