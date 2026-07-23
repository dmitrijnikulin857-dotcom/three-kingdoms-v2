import "server-only";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma, hasDatabase } from "./prisma";
import {
  signSession,
  verifySession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type SessionPayload,
} from "./auth-edge";

export type { SessionPayload };

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Authenticates admin credentials. Uses the database when available; otherwise
 * falls back to the environment-configured super-admin so the panel remains
 * usable in demo / no-database deployments.
 */
export async function authenticate(
  email: string,
  password: string,
): Promise<SessionPayload | null> {
  const normalizedEmail = email.trim().toLowerCase();

  if (hasDatabase()) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (user) {
        // A user row exists: password MUST match. Never allow the env
        // fallback to override an existing account (that would be a backdoor).
        if (await verifyPassword(password, user.passwordHash)) {
          return {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }
        return null;
      }
      // No matching user row (e.g. database not seeded yet): fall through to
      // the env-configured super-admin so the panel is never locked out.
    } catch (error) {
      console.error("[auth] DB auth failed, using fallback:", error);
      // fall through to env fallback
    }
  }

  // Fallback super-admin (no DB, or DB present but not yet seeded).
  const fallbackEmail = (process.env.ADMIN_EMAIL ?? "owner@three-kingdoms.de")
    .trim()
    .toLowerCase();
  const fallbackPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe!2024";
  if (normalizedEmail === fallbackEmail && password === fallbackPassword) {
    return {
      sub: "fallback-admin",
      email: fallbackEmail,
      name: "Restaurant Owner",
      role: "ADMIN",
    };
  }
  return null;
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySession(token);
}
