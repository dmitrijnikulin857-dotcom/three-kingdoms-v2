import { NextResponse } from "next/server";
import { prisma, hasDatabase } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { dishSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = dishSchema.partial().safeParse(body);
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
    const dish = await prisma.dish.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ ok: true, dish });
  } catch (error) {
    console.error("[api/admin/dishes/:id] update failed:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!hasDatabase()) {
    return NextResponse.json({ ok: true, demo: true });
  }

  try {
    await prisma.dish.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/dishes/:id] delete failed:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
