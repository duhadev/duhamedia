import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_newsletter_band_variant" AS ENUM('band');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_band_tone" AS ENUM('grey', 'light');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_band_spacing" AS ENUM('standard', 'roomy');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_band_variant" AS ENUM('band');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_band_tone" AS ENUM('grey', 'light');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_band_spacing" AS ENUM('standard', 'roomy');
  CREATE TABLE "pages_blocks_newsletter_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_newsletter_band_variant" DEFAULT 'band',
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"line" varchar,
  	"button_label" varchar DEFAULT 'Join',
  	"tone" "enum_pages_blocks_newsletter_band_tone" DEFAULT 'grey',
  	"spacing" "enum_pages_blocks_newsletter_band_spacing" DEFAULT 'standard',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_newsletter_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_newsletter_band_variant" DEFAULT 'band',
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"line" varchar,
  	"button_label" varchar DEFAULT 'Join',
  	"tone" "enum__pages_v_blocks_newsletter_band_tone" DEFAULT 'grey',
  	"spacing" "enum__pages_v_blocks_newsletter_band_spacing" DEFAULT 'standard',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_newsletter_band" ADD CONSTRAINT "pages_blocks_newsletter_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_newsletter_band" ADD CONSTRAINT "_pages_v_blocks_newsletter_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_newsletter_band_order_idx" ON "pages_blocks_newsletter_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_band_parent_id_idx" ON "pages_blocks_newsletter_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_band_path_idx" ON "pages_blocks_newsletter_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_newsletter_band_order_idx" ON "_pages_v_blocks_newsletter_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_newsletter_band_parent_id_idx" ON "_pages_v_blocks_newsletter_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_newsletter_band_path_idx" ON "_pages_v_blocks_newsletter_band" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_newsletter_band" CASCADE;
  DROP TABLE "_pages_v_blocks_newsletter_band" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_newsletter_band_variant";
  DROP TYPE "public"."enum_pages_blocks_newsletter_band_tone";
  DROP TYPE "public"."enum_pages_blocks_newsletter_band_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_band_variant";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_band_tone";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_band_spacing";`)
}
