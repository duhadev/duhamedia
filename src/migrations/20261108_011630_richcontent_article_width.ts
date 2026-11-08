import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_rich_content_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_content_width" AS ENUM('narrow', 'wide');
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "width" "enum_pages_blocks_rich_content_width" DEFAULT 'narrow';
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "width" "enum__pages_v_blocks_rich_content_width" DEFAULT 'narrow';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "width";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "width";
  DROP TYPE "public"."enum_pages_blocks_rich_content_width";
  DROP TYPE "public"."enum__pages_v_blocks_rich_content_width";`)
}
