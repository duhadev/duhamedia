import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_seo_defaults_local_business_type" AS ENUM('ProfessionalService', 'MarketingAgency');
  CREATE TABLE "seo_defaults" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_template" varchar DEFAULT '%s — Duha Media' NOT NULL,
  	"default_description" varchar NOT NULL,
  	"default_og_image_id" integer NOT NULL,
  	"organization_name" varchar DEFAULT 'Duha Media',
  	"organization_founding_date" varchar,
  	"organization_logo_id" integer,
  	"local_business_type" "enum_seo_defaults_local_business_type",
  	"local_business_area_served" varchar DEFAULT 'Chicago metropolitan area',
  	"local_business_opening_hours" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "seo_defaults" ADD CONSTRAINT "seo_defaults_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_defaults" ADD CONSTRAINT "seo_defaults_organization_logo_id_media_id_fk" FOREIGN KEY ("organization_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "seo_defaults_default_og_image_idx" ON "seo_defaults" USING btree ("default_og_image_id");
  CREATE INDEX "seo_defaults_organization_organization_logo_idx" ON "seo_defaults" USING btree ("organization_logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   -- Reviewed (PROGRESS Decision log down() rule): one table, no child/array/rels tables
   -- reference it, so the generated order is already correct: table first, then its enum.
  DROP TABLE "seo_defaults" CASCADE;
  DROP TYPE "public"."enum_seo_defaults_local_business_type";`)
}
