import { NextResponse } from "next/server";
import { prisma, hasDatabase } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";
import { DEFAULT_OPENING_HOURS } from "@/lib/menu-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const settingsSchema = z.object({
  openingHours: z
    .array(
      z.object({
        day: z.number().int().min(0).max(6),
        open: z.string(),
        close: z.string(),
        closed: z.boolean(),
      }),
    )
    .optional(),
  specialDates: z
    .array(
      z.object({
        date: z.string(),
        label: z.string(),
        closed: z.boolean(),
        open: z.string().optional(),
        close: z.string().optional(),
      }),
    )
    .optional(),
  reservationsEnabled: z.boolean().optional(),
  takeawayEnabled: z.boolean().optional(),
  deliveryEnabled: z.boolean().optional(),
  deliveryFee: z.coerce.number().min(0).optional(),
  minOrderValue: z.coerce.number().min(0).optional(),
});

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = settingsSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
      { status: 400 },
    );
  }

  if (!hasDatabase()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    const data = parsed.data;
    await prisma.setting.upsert({
      where: { id: "singleton" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      update: data as any,
      create: {
        id: "singleton",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        openingHours: (data.openingHours ?? DEFAULT_OPENING_HOURS) as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        specialDates: (data.specialDates ?? []) as any,
        reservationsEnabled: data.reservationsEnabled ?? true,
        takeawayEnabled: data.takeawayEnabled ?? true,
        deliveryEnabled: data.deliveryEnabled ?? true,
        deliveryFee: data.deliveryFee ?? 3.5,
        minOrderValue: data.minOrderValue ?? 15.0,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/settings]", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
