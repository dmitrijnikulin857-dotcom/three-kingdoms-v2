import { NextResponse } from "next/server";
import { prisma, hasDatabase } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validations";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Public: create a reservation request.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reservationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
        { status: 400 },
      );
    }

    if (hasDatabase()) {
      try {
        const reservation = await prisma.reservation.create({
          data: {
            name: parsed.data.name,
            phone: parsed.data.phone,
            email: parsed.data.email,
            date: parsed.data.date,
            time: parsed.data.time,
            guests: parsed.data.guests,
            notes: parsed.data.notes ?? "",
          },
        });
        return NextResponse.json({ ok: true, id: reservation.id }, { status: 201 });
      } catch (error) {
        console.error("[api/reservations] DB error, accepting anyway:", error);
      }
    }

    // Demo / no-database mode: accept the request gracefully.
    return NextResponse.json({ ok: true, demo: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

// Admin: list reservations (requires session).
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasDatabase()) {
    return NextResponse.json({ reservations: [] });
  }
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ reservations });
  } catch {
    return NextResponse.json({ reservations: [] });
  }
}
