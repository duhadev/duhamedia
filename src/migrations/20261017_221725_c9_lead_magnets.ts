import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_lead_magnets_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lead_magnets_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "lead_magnets_value_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "lead_magnets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT 'Free download',
  	"title" varchar,
  	"accent_phrase" varchar,
  	"pitch" varchar,
  	"form_note" varchar,
  	"asset_file_id" integer,
  	"asset_external_url" varchar,
  	"delivery_email_subject" varchar,
  	"delivery_email_intro" varchar,
  	"delivered_state_eyebrow" varchar DEFAULT 'Sent',
  	"delivered_state_heading" varchar,
  	"delivered_state_accent_phrase" varchar,
  	"delivered_state_body" varchar,
  	"delivered_state_cross_sell_line" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_lead_magnets_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_lead_magnets_v_version_value_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_lead_magnets_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_eyebrow" varchar DEFAULT 'Free download',
  	"version_title" varchar,
  	"version_accent_phrase" varchar,
  	"version_pitch" varchar,
  	"version_form_note" varchar,
  	"version_asset_file_id" integer,
  	"version_asset_external_url" varchar,
  	"version_delivery_email_subject" varchar,
  	"version_delivery_email_intro" varchar,
  	"version_delivered_state_eyebrow" varchar DEFAULT 'Sent',
  	"version_delivered_state_heading" varchar,
  	"version_delivered_state_accent_phrase" varchar,
  	"version_delivered_state_body" varchar,
  	"version_delivered_state_cross_sell_line" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__lead_magnets_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "case_studies_rels" ADD COLUMN "lead_magnets_id" integer;
  ALTER TABLE "_case_studies_v_rels" ADD COLUMN "lead_magnets_id" integer;
  ALTER TABLE "posts_rels" ADD COLUMN "lead_magnets_id" integer;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "lead_magnets_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lead_magnets_id" integer;
  ALTER TABLE "lead_magnets_value_bullets" ADD CONSTRAINT "lead_magnets_value_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lead_magnets" ADD CONSTRAINT "lead_magnets_asset_file_id_downloads_id_fk" FOREIGN KEY ("asset_file_id") REFERENCES "public"."downloads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lead_magnets_v_version_value_bullets" ADD CONSTRAINT "_lead_magnets_v_version_value_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lead_magnets_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lead_magnets_v" ADD CONSTRAINT "_lead_magnets_v_parent_id_lead_magnets_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lead_magnets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lead_magnets_v" ADD CONSTRAINT "_lead_magnets_v_version_asset_file_id_downloads_id_fk" FOREIGN KEY ("version_asset_file_id") REFERENCES "public"."downloads"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "lead_magnets_value_bullets_order_idx" ON "lead_magnets_value_bullets" USING btree ("_order");
  CREATE INDEX "lead_magnets_value_bullets_parent_id_idx" ON "lead_magnets_value_bullets" USING btree ("_parent_id");
  CREATE INDEX "lead_magnets_asset_asset_file_idx" ON "lead_magnets" USING btree ("asset_file_id");
  CREATE UNIQUE INDEX "lead_magnets_slug_idx" ON "lead_magnets" USING btree ("slug");
  CREATE INDEX "lead_magnets_published_at_idx" ON "lead_magnets" USING btree ("published_at");
  CREATE INDEX "lead_magnets_updated_at_idx" ON "lead_magnets" USING btree ("updated_at");
  CREATE INDEX "lead_magnets_created_at_idx" ON "lead_magnets" USING btree ("created_at");
  CREATE INDEX "lead_magnets__status_idx" ON "lead_magnets" USING btree ("_status");
  CREATE INDEX "_lead_magnets_v_version_value_bullets_order_idx" ON "_lead_magnets_v_version_value_bullets" USING btree ("_order");
  CREATE INDEX "_lead_magnets_v_version_value_bullets_parent_id_idx" ON "_lead_magnets_v_version_value_bullets" USING btree ("_parent_id");
  CREATE INDEX "_lead_magnets_v_parent_idx" ON "_lead_magnets_v" USING btree ("parent_id");
  CREATE INDEX "_lead_magnets_v_version_asset_version_asset_file_idx" ON "_lead_magnets_v" USING btree ("version_asset_file_id");
  CREATE INDEX "_lead_magnets_v_version_version_slug_idx" ON "_lead_magnets_v" USING btree ("version_slug");
  CREATE INDEX "_lead_magnets_v_version_version_published_at_idx" ON "_lead_magnets_v" USING btree ("version_published_at");
  CREATE INDEX "_lead_magnets_v_version_version_updated_at_idx" ON "_lead_magnets_v" USING btree ("version_updated_at");
  CREATE INDEX "_lead_magnets_v_version_version_created_at_idx" ON "_lead_magnets_v" USING btree ("version_created_at");
  CREATE INDEX "_lead_magnets_v_version_version__status_idx" ON "_lead_magnets_v" USING btree ("version__status");
  CREATE INDEX "_lead_magnets_v_created_at_idx" ON "_lead_magnets_v" USING btree ("created_at");
  CREATE INDEX "_lead_magnets_v_updated_at_idx" ON "_lead_magnets_v" USING btree ("updated_at");
  CREATE INDEX "_lead_magnets_v_latest_idx" ON "_lead_magnets_v" USING btree ("latest");
  CREATE INDEX "_lead_magnets_v_autosave_idx" ON "_lead_magnets_v" USING btree ("autosave");
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_lead_magnets_fk" FOREIGN KEY ("lead_magnets_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_lead_magnets_fk" FOREIGN KEY ("lead_magnets_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_lead_magnets_fk" FOREIGN KEY ("lead_magnets_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_lead_magnets_fk" FOREIGN KEY ("lead_magnets_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lead_magnets_fk" FOREIGN KEY ("lead_magnets_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "case_studies_rels_lead_magnets_id_idx" ON "case_studies_rels" USING btree ("lead_magnets_id");
  CREATE INDEX "_case_studies_v_rels_lead_magnets_id_idx" ON "_case_studies_v_rels" USING btree ("lead_magnets_id");
  CREATE INDEX "posts_rels_lead_magnets_id_idx" ON "posts_rels" USING btree ("lead_magnets_id");
  CREATE INDEX "_posts_v_rels_lead_magnets_id_idx" ON "_posts_v_rels" USING btree ("lead_magnets_id");
  CREATE INDEX "payload_locked_documents_rels_lead_magnets_id_idx" ON "payload_locked_documents_rels" USING btree ("lead_magnets_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
  -- Hand-fixed (integrator): drop FKs that existing tables hold on lead_magnets
  -- BEFORE the CASCADE table drops, which would otherwise remove them
  -- implicitly and make these DROP CONSTRAINTs fail.
  ALTER TABLE "case_studies_rels" DROP CONSTRAINT "case_studies_rels_lead_magnets_fk";
  ALTER TABLE "_case_studies_v_rels" DROP CONSTRAINT "_case_studies_v_rels_lead_magnets_fk";
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_lead_magnets_fk";
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_lead_magnets_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_lead_magnets_fk";
  ALTER TABLE "lead_magnets_value_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lead_magnets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_lead_magnets_v_version_value_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_lead_magnets_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "lead_magnets_value_bullets" CASCADE;
  DROP TABLE "lead_magnets" CASCADE;
  DROP TABLE "_lead_magnets_v_version_value_bullets" CASCADE;
  DROP TABLE "_lead_magnets_v" CASCADE;
  DROP INDEX "case_studies_rels_lead_magnets_id_idx";
  DROP INDEX "_case_studies_v_rels_lead_magnets_id_idx";
  DROP INDEX "posts_rels_lead_magnets_id_idx";
  DROP INDEX "_posts_v_rels_lead_magnets_id_idx";
  DROP INDEX "payload_locked_documents_rels_lead_magnets_id_idx";
  ALTER TABLE "case_studies_rels" DROP COLUMN "lead_magnets_id";
  ALTER TABLE "_case_studies_v_rels" DROP COLUMN "lead_magnets_id";
  ALTER TABLE "posts_rels" DROP COLUMN "lead_magnets_id";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "lead_magnets_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lead_magnets_id";
  DROP TYPE "public"."enum_lead_magnets_status";
  DROP TYPE "public"."enum__lead_magnets_v_version_status";`)
}
