import { NextResponse } from "next/server";
import { authenticate, createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe" },
        { status: 400 },
      );
    }

    const session = await authenticate(parsed.data.email, parsed.data.password);
    if (!session) {
      return NextResponse.json(
        { error: "E-Mail oder Passwort ist falsch." },
        { status: 401 },
      );
    }

    await createSession(session);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/auth/login]", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
