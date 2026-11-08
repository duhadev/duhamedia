import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_testimonial_row_presentation" AS ENUM('cards', 'text');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_row_presentation" AS ENUM('cards', 'text');
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "presentation" "enum_pages_blocks_testimonial_row_presentation" DEFAULT 'cards';
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "presentation" "enum__pages_v_blocks_testimonial_row_presentation" DEFAULT 'cards';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "presentation";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "presentation";
  DROP TYPE "public"."enum_pages_blocks_testimonial_row_presentation";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_row_presentation";`)
}
