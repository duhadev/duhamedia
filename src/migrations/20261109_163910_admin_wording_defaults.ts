import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Admin wording sweep (2026-11-09): Site settings > Location code defaults
// Lombard → Chicago (business facts superseded 2026-11-07). Column DEFAULTs
// only: they apply to rows inserted later, so no existing content changes.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "location_locality" SET DEFAULT 'Chicago';
  ALTER TABLE "site_settings" ALTER COLUMN "location_display_line" SET DEFAULT 'Chicago, IL';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: `migrate:reset` runs every down oldest-first; once the initial
  // migration's down has dropped `users`, there is nothing left to undo here.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "location_locality" SET DEFAULT 'Lombard';
  ALTER TABLE "site_settings" ALTER COLUMN "location_display_line" SET DEFAULT 'Lombard, IL';`)
}
