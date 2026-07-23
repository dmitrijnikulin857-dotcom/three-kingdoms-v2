import { NextResponse } from "next/server";
import { prisma, hasDatabase } from "@/lib/prisma";
import { orderSchema } from "@/lib/validations";
import { getSettings } from "@/lib/data";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Public: place an order.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
        { status: 400 },
      );
    }

    const settings = await getSettings();
    const subtotal = parsed.data.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    const deliveryFee =
      parsed.data.type === "DELIVERY" ? settings.deliveryFee : 0;
    const total = subtotal + deliveryFee;

    if (parsed.data.type === "DELIVERY" && subtotal < settings.minOrderValue) {
      return NextResponse.json(
        { error: "Mindestbestellwert für Lieferung nicht erreicht" },
        { status: 400 },
      );
    }

    if (hasDatabase()) {
      try {
        const order = await prisma.order.create({
          data: {
            customerName: parsed.data.customerName,
            phone: parsed.data.phone,
            email: parsed.data.email ?? "",
            type: parsed.data.type,
            address: parsed.data.address ?? "",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items: parsed.data.items as any,
            subtotal,
            deliveryFee,
            total,
            pickupTime: parsed.data.pickupTime ?? "",
            notes: parsed.data.notes ?? "",
          },
        });
        return NextResponse.json({ ok: true, id: order.id, total }, { status: 201 });
      } catch (error) {
        console.error("[api/orders] DB error, accepting anyway:", error);
      }
    }

    return NextResponse.json({ ok: true, demo: true, total }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// Admin: list orders (requires session).
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasDatabase()) {
    return NextResponse.json({ orders: [] });
  }
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}
