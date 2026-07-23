import { PrismaClient } from "@prisma/client";

// Global singleton to prevent exhausting database connections during
// Next.js hot-reload in development and across serverless invocations.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Returns true when a real database connection string appears to be configured.
 * The bundled placeholder URL (localhost:5432 with dummy creds) is treated as
 * "no database" so we skip pointless connection attempts and fall back fast.
 */
export function hasDatabase(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  if (!url) return false;
  if (!url.startsWith("postgres")) return false;
  // Heuristic: the shipped placeholder we never expect in production.
  if (url.includes("user:password@localhost:5432/three_kingdoms")) return false;
  return true;
}
