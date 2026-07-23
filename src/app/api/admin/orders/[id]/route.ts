import { NextResponse } from "next/server";
import { prisma, hasDatabase } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const statusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "COMPLETED",
    "CANCELLED",
  ]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültiger Status" }, { status: 400 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/orders/:id]", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
