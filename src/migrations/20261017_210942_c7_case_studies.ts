import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_case_studies_track" AS ENUM('build', 'growth', 'build-and-growth', 'handover');
  CREATE TYPE "public"."enum_case_studies_client_voice_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_case_studies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__case_studies_v_version_track" AS ENUM('build', 'growth', 'build-and-growth', 'handover');
  CREATE TYPE "public"."enum__case_studies_v_version_client_voice_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__case_studies_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "case_studies_results_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"measure" varchar,
  	"baseline" varchar,
  	"after" varchar,
  	"change" varchar
  );
  
  CREATE TABLE "case_studies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"accent_phrase" varchar,
  	"client_id" integer,
  	"track" "enum_case_studies_track",
  	"study_number" numeric,
  	"engagement_line" varchar,
  	"headline_metric_value" varchar,
  	"headline_metric_label" varchar,
  	"headline_metric_sub" varchar,
  	"headline_metric_accent" boolean DEFAULT false,
  	"card_summary" varchar,
  	"in_short" varchar,
  	"hero_media_id" integer,
  	"narrative_before_title" varchar,
  	"narrative_before_body" jsonb,
  	"narrative_strategy_title" varchar,
  	"narrative_strategy_body" jsonb,
  	"narrative_results_title" varchar,
  	"narrative_results_body" jsonb,
  	"results_table_eyebrow" varchar,
  	"results_table_columns_measure" varchar,
  	"results_table_columns_baseline" varchar,
  	"results_table_columns_after" varchar,
  	"results_table_columns_change" varchar,
  	"results_table_method" varchar,
  	"client_voice_testimonial_id" integer,
  	"client_voice_do_differently" jsonb,
  	"client_voice_phase_mapping" varchar,
  	"client_voice_link_type" "enum_case_studies_client_voice_link_type" DEFAULT 'internal',
  	"client_voice_link_new_tab" boolean DEFAULT false,
  	"client_voice_link_url" varchar,
  	"client_voice_link_label" varchar,
  	"closing_newsletter_heading" varchar,
  	"closing_final_cta_heading" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"figures_approved" boolean DEFAULT false,
  	"read_time" numeric,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_case_studies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "case_studies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"case_studies_id" integer
  );
  
  CREATE TABLE "_case_studies_v_version_results_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"measure" varchar,
  	"baseline" varchar,
  	"after" varchar,
  	"change" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_case_studies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_accent_phrase" varchar,
  	"version_client_id" integer,
  	"version_track" "enum__case_studies_v_version_track",
  	"version_study_number" numeric,
  	"version_engagement_line" varchar,
  	"version_headline_metric_value" varchar,
  	"version_headline_metric_label" varchar,
  	"version_headline_metric_sub" varchar,
  	"version_headline_metric_accent" boolean DEFAULT false,
  	"version_card_summary" varchar,
  	"version_in_short" varchar,
  	"version_hero_media_id" integer,
  	"version_narrative_before_title" varchar,
  	"version_narrative_before_body" jsonb,
  	"version_narrative_strategy_title" varchar,
  	"version_narrative_strategy_body" jsonb,
  	"version_narrative_results_title" varchar,
  	"version_narrative_results_body" jsonb,
  	"version_results_table_eyebrow" varchar,
  	"version_results_table_columns_measure" varchar,
  	"version_results_table_columns_baseline" varchar,
  	"version_results_table_columns_after" varchar,
  	"version_results_table_columns_change" varchar,
  	"version_results_table_method" varchar,
  	"version_client_voice_testimonial_id" integer,
  	"version_client_voice_do_differently" jsonb,
  	"version_client_voice_phase_mapping" varchar,
  	"version_client_voice_link_type" "enum__case_studies_v_version_client_voice_link_type" DEFAULT 'internal',
  	"version_client_voice_link_new_tab" boolean DEFAULT false,
  	"version_client_voice_link_url" varchar,
  	"version_client_voice_link_label" varchar,
  	"version_closing_newsletter_heading" varchar,
  	"version_closing_final_cta_heading" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_figures_approved" boolean DEFAULT false,
  	"version_read_time" numeric,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__case_studies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_case_studies_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"case_studies_id" integer
  );
  
  ALTER TABLE "testimonials" ADD COLUMN "case_study_id" integer;
  ALTER TABLE "_testimonials_v" ADD COLUMN "version_case_study_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "case_studies_id" integer;
  ALTER TABLE "case_studies_results_table_rows" ADD CONSTRAINT "case_studies_results_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_client_voice_testimonial_id_testimonials_id_fk" FOREIGN KEY ("client_voice_testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_results_table_rows" ADD CONSTRAINT "_case_studies_v_version_results_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_parent_id_case_studies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_client_id_clients_id_fk" FOREIGN KEY ("version_client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_client_voice_testimonial_id_testimonials_id_fk" FOREIGN KEY ("version_client_voice_testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "case_studies_results_table_rows_order_idx" ON "case_studies_results_table_rows" USING btree ("_order");
  CREATE INDEX "case_studies_results_table_rows_parent_id_idx" ON "case_studies_results_table_rows" USING btree ("_parent_id");
  CREATE INDEX "case_studies_client_idx" ON "case_studies" USING btree ("client_id");
  CREATE INDEX "case_studies_hero_media_idx" ON "case_studies" USING btree ("hero_media_id");
  CREATE INDEX "case_studies_client_voice_client_voice_testimonial_idx" ON "case_studies" USING btree ("client_voice_testimonial_id");
  CREATE UNIQUE INDEX "case_studies_slug_idx" ON "case_studies" USING btree ("slug");
  CREATE INDEX "case_studies_featured_idx" ON "case_studies" USING btree ("featured");
  CREATE INDEX "case_studies_published_at_idx" ON "case_studies" USING btree ("published_at");
  CREATE INDEX "case_studies_updated_at_idx" ON "case_studies" USING btree ("updated_at");
  CREATE INDEX "case_studies_created_at_idx" ON "case_studies" USING btree ("created_at");
  CREATE INDEX "case_studies__status_idx" ON "case_studies" USING btree ("_status");
  CREATE INDEX "case_studies_rels_order_idx" ON "case_studies_rels" USING btree ("order");
  CREATE INDEX "case_studies_rels_parent_idx" ON "case_studies_rels" USING btree ("parent_id");
  CREATE INDEX "case_studies_rels_path_idx" ON "case_studies_rels" USING btree ("path");
  CREATE INDEX "case_studies_rels_case_studies_id_idx" ON "case_studies_rels" USING btree ("case_studies_id");
  CREATE INDEX "_case_studies_v_version_results_table_rows_order_idx" ON "_case_studies_v_version_results_table_rows" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_results_table_rows_parent_id_idx" ON "_case_studies_v_version_results_table_rows" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_parent_idx" ON "_case_studies_v" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_version_client_idx" ON "_case_studies_v" USING btree ("version_client_id");
  CREATE INDEX "_case_studies_v_version_version_hero_media_idx" ON "_case_studies_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_case_studies_v_version_client_voice_version_client_voic_idx" ON "_case_studies_v" USING btree ("version_client_voice_testimonial_id");
  CREATE INDEX "_case_studies_v_version_version_slug_idx" ON "_case_studies_v" USING btree ("version_slug");
  CREATE INDEX "_case_studies_v_version_version_featured_idx" ON "_case_studies_v" USING btree ("version_featured");
  CREATE INDEX "_case_studies_v_version_version_published_at_idx" ON "_case_studies_v" USING btree ("version_published_at");
  CREATE INDEX "_case_studies_v_version_version_updated_at_idx" ON "_case_studies_v" USING btree ("version_updated_at");
  CREATE INDEX "_case_studies_v_version_version_created_at_idx" ON "_case_studies_v" USING btree ("version_created_at");
  CREATE INDEX "_case_studies_v_version_version__status_idx" ON "_case_studies_v" USING btree ("version__status");
  CREATE INDEX "_case_studies_v_created_at_idx" ON "_case_studies_v" USING btree ("created_at");
  CREATE INDEX "_case_studies_v_updated_at_idx" ON "_case_studies_v" USING btree ("updated_at");
  CREATE INDEX "_case_studies_v_latest_idx" ON "_case_studies_v" USING btree ("latest");
  CREATE INDEX "_case_studies_v_autosave_idx" ON "_case_studies_v" USING btree ("autosave");
  CREATE INDEX "_case_studies_v_rels_order_idx" ON "_case_studies_v_rels" USING btree ("order");
  CREATE INDEX "_case_studies_v_rels_parent_idx" ON "_case_studies_v_rels" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_rels_path_idx" ON "_case_studies_v_rels" USING btree ("path");
  CREATE INDEX "_case_studies_v_rels_case_studies_id_idx" ON "_case_studies_v_rels" USING btree ("case_studies_id");
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_case_study_id_case_studies_id_fk" FOREIGN KEY ("case_study_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_case_study_id_case_studies_id_fk" FOREIGN KEY ("version_case_study_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "testimonials_case_study_idx" ON "testimonials" USING btree ("case_study_id");
  CREATE INDEX "_testimonials_v_version_version_case_study_idx" ON "_testimonials_v" USING btree ("version_case_study_id");
  CREATE INDEX "payload_locked_documents_rels_case_studies_id_idx" ON "payload_locked_documents_rels" USING btree ("case_studies_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   -- Hand-fixed (integrator): drop FKs that existing tables hold on
  -- case_studies BEFORE the CASCADE table drops, which would otherwise remove
  -- them implicitly and make these DROP CONSTRAINTs fail.
  ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_case_study_id_case_studies_id_fk";
  ALTER TABLE "_testimonials_v" DROP CONSTRAINT "_testimonials_v_version_case_study_id_case_studies_id_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_case_studies_fk";
  ALTER TABLE "case_studies_results_table_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_results_table_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "case_studies_results_table_rows" CASCADE;
  DROP TABLE "case_studies" CASCADE;
  DROP TABLE "case_studies_rels" CASCADE;
  DROP TABLE "_case_studies_v_version_results_table_rows" CASCADE;
  DROP TABLE "_case_studies_v" CASCADE;
  DROP TABLE "_case_studies_v_rels" CASCADE;
  DROP INDEX "testimonials_case_study_idx";
  DROP INDEX "_testimonials_v_version_version_case_study_idx";
  DROP INDEX "payload_locked_documents_rels_case_studies_id_idx";
  ALTER TABLE "testimonials" DROP COLUMN "case_study_id";
  ALTER TABLE "_testimonials_v" DROP COLUMN "version_case_study_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "case_studies_id";
  DROP TYPE "public"."enum_case_studies_track";
  DROP TYPE "public"."enum_case_studies_client_voice_link_type";
  DROP TYPE "public"."enum_case_studies_status";
  DROP TYPE "public"."enum__case_studies_v_version_track";
  DROP TYPE "public"."enum__case_studies_v_version_client_voice_link_type";
  DROP TYPE "public"."enum__case_studies_v_version_status";`)
}
