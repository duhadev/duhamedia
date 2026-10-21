import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lead_magnets" ADD COLUMN "whats_inside_heading" varchar DEFAULT 'What''s inside';
  ALTER TABLE "_lead_magnets_v" ADD COLUMN "version_whats_inside_heading" varchar DEFAULT 'What''s inside';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "lead_magnets" DROP COLUMN "whats_inside_heading";
  ALTER TABLE "_lead_magnets_v" DROP COLUMN "version_whats_inside_heading";`)
}
