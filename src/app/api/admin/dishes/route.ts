import { NextResponse } from "next/server";
import { prisma, hasDatabase } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { dishSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = dishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
      { status: 400 },
    );
  }

  if (!hasDatabase()) {
    return NextResponse.json(
      {
        ok: true,
        demo: true,
        dish: { id: `demo-${Date.now()}`, slug: slugify(parsed.data.nameDe), ...parsed.data },
      },
      { status: 201 },
    );
  }

  try {
    const baseSlug = slugify(parsed.data.nameDe) || `dish-${Date.now()}`;
    let slug = baseSlug;
    let n = 1;
    while (await prisma.dish.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${n++}`;
    }

    const dish = await prisma.dish.create({
      data: { ...parsed.data, slug },
    });
    return NextResponse.json({ ok: true, dish }, { status: 201 });
  } catch (error) {
    console.error("[api/admin/dishes] create failed:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
