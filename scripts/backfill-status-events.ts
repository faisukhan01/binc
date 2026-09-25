/**
 * One-off backfill: create StatusEvents for existing admissions so the
 * applicant tracker can show real dates. Safe to re-run — skips admissions
 * that already have events.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const apps = await db.admission.findMany({
    include: { _count: { select: { events: true } } },
  });

  let created = 0;
  for (const a of apps) {
    if (a._count.events > 0) continue;
    await db.statusEvent.create({
      data: { admissionId: a.id, status: "PENDING", createdAt: a.createdAt },
    });
    created++;
    if (a.status !== "PENDING") {
      await db.statusEvent.create({
        data: { admissionId: a.id, status: a.status, createdAt: a.updatedAt },
      });
      created++;
    }
  }
  console.log(`Backfilled ${created} status events across ${apps.length} applications.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
