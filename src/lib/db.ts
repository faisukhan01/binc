import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton with a schema-version tag.
 * Bump PRISMA_TAG whenever prisma/schema.prisma changes + `prisma generate`
 * re-runs, so a stale globalThis client (missing new models) is never reused.
 */
const PRISMA_TAG = "v2-announcement";

const g = globalThis as unknown as {
  __prisma?: PrismaClient;
  __prismaTag?: string;
};

export const db =
  g.__prisma && g.__prismaTag === PRISMA_TAG ? g.__prisma : new PrismaClient();

g.__prisma = db;
g.__prismaTag = PRISMA_TAG;
