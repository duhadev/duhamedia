import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_team_intro" ADD COLUMN "pull_quote" varchar;
  ALTER TABLE "_pages_v_blocks_team_intro" ADD COLUMN "pull_quote" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_team_intro" DROP COLUMN "pull_quote";
  ALTER TABLE "_pages_v_blocks_team_intro" DROP COLUMN "pull_quote";`)
}
