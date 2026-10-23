import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lead_magnets" ADD COLUMN "whats_inside_heading" varchar DEFAULT 'What''s inside';
  ALTER TABLE "_lead_magnets_v" ADD COLUMN "version_whats_inside_heading" varchar DEFAULT 'What''s inside';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   ALTER TABLE "lead_magnets" DROP COLUMN "whats_inside_heading";
  ALTER TABLE "_lead_magnets_v" DROP COLUMN "version_whats_inside_heading";`)
}
