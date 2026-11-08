import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_spec_ledger_items_logo" AS ENUM('shopify', 'instagram', 'facebook', 'tiktok', 'meta', 'microsoft-clarity');
  CREATE TYPE "public"."enum__pages_v_blocks_spec_ledger_items_logo" AS ENUM('shopify', 'instagram', 'facebook', 'tiktok', 'meta', 'microsoft-clarity');
  ALTER TABLE "pages_blocks_spec_ledger_items" ADD COLUMN "logo" "enum_pages_blocks_spec_ledger_items_logo";
  ALTER TABLE "pages_blocks_spec_ledger_items" ADD COLUMN "logo_image_id" integer;
  ALTER TABLE "pages_blocks_spec_ledger" ADD COLUMN "footnote" varchar;
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" ADD COLUMN "logo" "enum__pages_v_blocks_spec_ledger_items_logo";
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" ADD COLUMN "logo_image_id" integer;
  ALTER TABLE "_pages_v_blocks_spec_ledger" ADD COLUMN "footnote" varchar;
  ALTER TABLE "pages_blocks_spec_ledger_items" ADD CONSTRAINT "pages_blocks_spec_ledger_items_logo_image_id_media_id_fk" FOREIGN KEY ("logo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" ADD CONSTRAINT "_pages_v_blocks_spec_ledger_items_logo_image_id_media_id_fk" FOREIGN KEY ("logo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_spec_ledger_items_logo_image_idx" ON "pages_blocks_spec_ledger_items" USING btree ("logo_image_id");
  CREATE INDEX "_pages_v_blocks_spec_ledger_items_logo_image_idx" ON "_pages_v_blocks_spec_ledger_items" USING btree ("logo_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_spec_ledger_items" DROP CONSTRAINT "pages_blocks_spec_ledger_items_logo_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" DROP CONSTRAINT "_pages_v_blocks_spec_ledger_items_logo_image_id_media_id_fk";
  
  DROP INDEX "pages_blocks_spec_ledger_items_logo_image_idx";
  DROP INDEX "_pages_v_blocks_spec_ledger_items_logo_image_idx";
  ALTER TABLE "pages_blocks_spec_ledger_items" DROP COLUMN "logo";
  ALTER TABLE "pages_blocks_spec_ledger_items" DROP COLUMN "logo_image_id";
  ALTER TABLE "pages_blocks_spec_ledger" DROP COLUMN "footnote";
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" DROP COLUMN "logo";
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" DROP COLUMN "logo_image_id";
  ALTER TABLE "_pages_v_blocks_spec_ledger" DROP COLUMN "footnote";
  DROP TYPE "public"."enum_pages_blocks_spec_ledger_items_logo";
  DROP TYPE "public"."enum__pages_v_blocks_spec_ledger_items_logo";`)
}
