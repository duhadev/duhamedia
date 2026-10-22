import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_case_study_cards_layout" AS ENUM('cards');
  CREATE TYPE "public"."enum_pages_blocks_case_study_cards_source" AS ENUM('featured', 'latest', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_case_study_cards_all_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_case_study_cards_fallback_mode" AS ENUM('ledger', 'note');
  CREATE TYPE "public"."enum_pages_blocks_testimonial_row_variant" AS ENUM('row');
  CREATE TYPE "public"."enum_pages_blocks_testimonial_row_study_card_source" AS ENUM('featured', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_testimonial_row_cta_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_phase_timeline_steps_phase" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum_pages_blocks_phase_timeline_variant" AS ENUM('accordion');
  CREATE TYPE "public"."enum_pages_blocks_team_intro_variant" AS ENUM('intro', 'founder-card');
  CREATE TYPE "public"."enum_pages_blocks_team_intro_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cards_layout" AS ENUM('cards');
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cards_source" AS ENUM('featured', 'latest', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cards_all_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cards_fallback_mode" AS ENUM('ledger', 'note');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_row_variant" AS ENUM('row');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_row_study_card_source" AS ENUM('featured', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_row_cta_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_phase_timeline_steps_phase" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" AS ENUM('accordion');
  CREATE TYPE "public"."enum__pages_v_blocks_team_intro_variant" AS ENUM('intro', 'founder-card');
  CREATE TYPE "public"."enum__pages_v_blocks_team_intro_link_type" AS ENUM('internal', 'custom');
  CREATE TABLE "pages_blocks_case_study_cards_fallback_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"accent" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_case_study_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout" "enum_pages_blocks_case_study_cards_layout" DEFAULT 'cards',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT true,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"source" "enum_pages_blocks_case_study_cards_source" DEFAULT 'featured',
  	"limit" numeric DEFAULT 3,
  	"card_link_label" varchar DEFAULT 'Read the case study',
  	"all_link_type" "enum_pages_blocks_case_study_cards_all_link_type" DEFAULT 'internal',
  	"all_link_new_tab" boolean DEFAULT false,
  	"all_link_url" varchar,
  	"all_link_label" varchar,
  	"fallback_mode" "enum_pages_blocks_case_study_cards_fallback_mode" DEFAULT 'ledger',
  	"fallback_eyebrow" varchar DEFAULT 'No studies live yet — the numbers we can show',
  	"fallback_heading" varchar DEFAULT 'Numbers anyway.',
  	"fallback_accent_phrase" varchar DEFAULT 'anyway.',
  	"fallback_body" varchar DEFAULT 'Studies publish here as clients sign off.',
  	"pricing_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonial_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_testimonial_row_variant" DEFAULT 'row',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"study_card_show" boolean DEFAULT true,
  	"study_card_label" varchar DEFAULT 'A study in full',
  	"study_card_source" "enum_pages_blocks_testimonial_row_study_card_source" DEFAULT 'featured',
  	"study_card_case_study_id" integer,
  	"study_card_read_label" varchar DEFAULT 'Read the study',
  	"study_card_fallback_metric_value" varchar,
  	"study_card_fallback_metric_label" varchar,
  	"study_card_fallback_metric_sub" varchar,
  	"study_card_fallback_metric_accent" boolean DEFAULT false,
  	"cta_type" "enum_pages_blocks_testimonial_row_cta_type" DEFAULT 'internal',
  	"cta_new_tab" boolean DEFAULT false,
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_phase_timeline_phases" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_phase_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"phase" "enum_pages_blocks_phase_timeline_steps_phase" DEFAULT '1',
  	"detail" varchar
  );
  
  CREATE TABLE "pages_blocks_phase_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_phase_timeline_variant" DEFAULT 'accordion',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"intro" varchar,
  	"closing_line" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_team_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_team_intro_variant" DEFAULT 'intro',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"body" varchar,
  	"photo_id" integer,
  	"member_id" integer,
  	"link_type" "enum_pages_blocks_team_intro_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_study_cards_fallback_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"accent" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_study_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout" "enum__pages_v_blocks_case_study_cards_layout" DEFAULT 'cards',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT true,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"source" "enum__pages_v_blocks_case_study_cards_source" DEFAULT 'featured',
  	"limit" numeric DEFAULT 3,
  	"card_link_label" varchar DEFAULT 'Read the case study',
  	"all_link_type" "enum__pages_v_blocks_case_study_cards_all_link_type" DEFAULT 'internal',
  	"all_link_new_tab" boolean DEFAULT false,
  	"all_link_url" varchar,
  	"all_link_label" varchar,
  	"fallback_mode" "enum__pages_v_blocks_case_study_cards_fallback_mode" DEFAULT 'ledger',
  	"fallback_eyebrow" varchar DEFAULT 'No studies live yet — the numbers we can show',
  	"fallback_heading" varchar DEFAULT 'Numbers anyway.',
  	"fallback_accent_phrase" varchar DEFAULT 'anyway.',
  	"fallback_body" varchar DEFAULT 'Studies publish here as clients sign off.',
  	"pricing_note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonial_row" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_testimonial_row_variant" DEFAULT 'row',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"study_card_show" boolean DEFAULT true,
  	"study_card_label" varchar DEFAULT 'A study in full',
  	"study_card_source" "enum__pages_v_blocks_testimonial_row_study_card_source" DEFAULT 'featured',
  	"study_card_case_study_id" integer,
  	"study_card_read_label" varchar DEFAULT 'Read the study',
  	"study_card_fallback_metric_value" varchar,
  	"study_card_fallback_metric_label" varchar,
  	"study_card_fallback_metric_sub" varchar,
  	"study_card_fallback_metric_accent" boolean DEFAULT false,
  	"cta_type" "enum__pages_v_blocks_testimonial_row_cta_type" DEFAULT 'internal',
  	"cta_new_tab" boolean DEFAULT false,
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_phase_timeline_phases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_phase_timeline_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"title" varchar,
  	"phase" "enum__pages_v_blocks_phase_timeline_steps_phase" DEFAULT '1',
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_phase_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_phase_timeline_variant" DEFAULT 'accordion',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"intro" varchar,
  	"closing_line" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_team_intro_variant" DEFAULT 'intro',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"body" varchar,
  	"photo_id" integer,
  	"member_id" integer,
  	"link_type" "enum__pages_v_blocks_team_intro_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "testimonials_id" integer;
  ALTER TABLE "pages_blocks_case_study_cards_fallback_metrics" ADD CONSTRAINT "pages_blocks_case_study_cards_fallback_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_case_study_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study_cards" ADD CONSTRAINT "pages_blocks_case_study_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_row" ADD CONSTRAINT "pages_blocks_testimonial_row_study_card_case_study_id_case_studies_id_fk" FOREIGN KEY ("study_card_case_study_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_row" ADD CONSTRAINT "pages_blocks_testimonial_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_phase_timeline_phases" ADD CONSTRAINT "pages_blocks_phase_timeline_phases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_phase_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_phase_timeline_steps" ADD CONSTRAINT "pages_blocks_phase_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_phase_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_phase_timeline" ADD CONSTRAINT "pages_blocks_phase_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_intro" ADD CONSTRAINT "pages_blocks_team_intro_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_intro" ADD CONSTRAINT "pages_blocks_team_intro_member_id_team_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_team_intro" ADD CONSTRAINT "pages_blocks_team_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study_cards_fallback_metrics" ADD CONSTRAINT "_pages_v_blocks_case_study_cards_fallback_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_case_study_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD CONSTRAINT "_pages_v_blocks_case_study_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD CONSTRAINT "_pages_v_blocks_testimonial_row_study_card_case_study_id_case_studies_id_fk" FOREIGN KEY ("study_card_case_study_id") REFERENCES "public"."case_studies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD CONSTRAINT "_pages_v_blocks_testimonial_row_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_phase_timeline_phases" ADD CONSTRAINT "_pages_v_blocks_phase_timeline_phases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_phase_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" ADD CONSTRAINT "_pages_v_blocks_phase_timeline_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_phase_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_phase_timeline" ADD CONSTRAINT "_pages_v_blocks_phase_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_intro" ADD CONSTRAINT "_pages_v_blocks_team_intro_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_intro" ADD CONSTRAINT "_pages_v_blocks_team_intro_member_id_team_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_intro" ADD CONSTRAINT "_pages_v_blocks_team_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_case_study_cards_fallback_metrics_order_idx" ON "pages_blocks_case_study_cards_fallback_metrics" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_study_cards_fallback_metrics_parent_id_idx" ON "pages_blocks_case_study_cards_fallback_metrics" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_study_cards_order_idx" ON "pages_blocks_case_study_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_case_study_cards_parent_id_idx" ON "pages_blocks_case_study_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_study_cards_path_idx" ON "pages_blocks_case_study_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonial_row_order_idx" ON "pages_blocks_testimonial_row" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonial_row_parent_id_idx" ON "pages_blocks_testimonial_row" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonial_row_path_idx" ON "pages_blocks_testimonial_row" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonial_row_study_card_study_card_case__idx" ON "pages_blocks_testimonial_row" USING btree ("study_card_case_study_id");
  CREATE INDEX "pages_blocks_phase_timeline_phases_order_idx" ON "pages_blocks_phase_timeline_phases" USING btree ("_order");
  CREATE INDEX "pages_blocks_phase_timeline_phases_parent_id_idx" ON "pages_blocks_phase_timeline_phases" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_phase_timeline_steps_order_idx" ON "pages_blocks_phase_timeline_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_phase_timeline_steps_parent_id_idx" ON "pages_blocks_phase_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_phase_timeline_order_idx" ON "pages_blocks_phase_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_phase_timeline_parent_id_idx" ON "pages_blocks_phase_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_phase_timeline_path_idx" ON "pages_blocks_phase_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_intro_order_idx" ON "pages_blocks_team_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_intro_parent_id_idx" ON "pages_blocks_team_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_intro_path_idx" ON "pages_blocks_team_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_team_intro_photo_idx" ON "pages_blocks_team_intro" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_team_intro_member_idx" ON "pages_blocks_team_intro" USING btree ("member_id");
  CREATE INDEX "_pages_v_blocks_case_study_cards_fallback_metrics_order_idx" ON "_pages_v_blocks_case_study_cards_fallback_metrics" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_study_cards_fallback_metrics_parent_id_idx" ON "_pages_v_blocks_case_study_cards_fallback_metrics" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_study_cards_order_idx" ON "_pages_v_blocks_case_study_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_case_study_cards_parent_id_idx" ON "_pages_v_blocks_case_study_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_study_cards_path_idx" ON "_pages_v_blocks_case_study_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonial_row_order_idx" ON "_pages_v_blocks_testimonial_row" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonial_row_parent_id_idx" ON "_pages_v_blocks_testimonial_row" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonial_row_path_idx" ON "_pages_v_blocks_testimonial_row" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonial_row_study_card_study_card_ca_idx" ON "_pages_v_blocks_testimonial_row" USING btree ("study_card_case_study_id");
  CREATE INDEX "_pages_v_blocks_phase_timeline_phases_order_idx" ON "_pages_v_blocks_phase_timeline_phases" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_phase_timeline_phases_parent_id_idx" ON "_pages_v_blocks_phase_timeline_phases" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_phase_timeline_steps_order_idx" ON "_pages_v_blocks_phase_timeline_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_phase_timeline_steps_parent_id_idx" ON "_pages_v_blocks_phase_timeline_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_phase_timeline_order_idx" ON "_pages_v_blocks_phase_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_phase_timeline_parent_id_idx" ON "_pages_v_blocks_phase_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_phase_timeline_path_idx" ON "_pages_v_blocks_phase_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_intro_order_idx" ON "_pages_v_blocks_team_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_intro_parent_id_idx" ON "_pages_v_blocks_team_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_intro_path_idx" ON "_pages_v_blocks_team_intro" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_intro_photo_idx" ON "_pages_v_blocks_team_intro" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_team_intro_member_idx" ON "_pages_v_blocks_team_intro" USING btree ("member_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "pages_rels" USING btree ("testimonials_id");
  CREATE INDEX "_pages_v_rels_testimonials_id_idx" ON "_pages_v_rels" USING btree ("testimonials_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_case_study_cards_fallback_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_case_study_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_testimonial_row" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_phase_timeline_phases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_phase_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_phase_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_team_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_case_study_cards_fallback_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_case_study_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonial_row" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_phase_timeline_phases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_phase_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_team_intro" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_case_study_cards_fallback_metrics" CASCADE;
  DROP TABLE "pages_blocks_case_study_cards" CASCADE;
  DROP TABLE "pages_blocks_testimonial_row" CASCADE;
  DROP TABLE "pages_blocks_phase_timeline_phases" CASCADE;
  DROP TABLE "pages_blocks_phase_timeline_steps" CASCADE;
  DROP TABLE "pages_blocks_phase_timeline" CASCADE;
  DROP TABLE "pages_blocks_team_intro" CASCADE;
  DROP TABLE "_pages_v_blocks_case_study_cards_fallback_metrics" CASCADE;
  DROP TABLE "_pages_v_blocks_case_study_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonial_row" CASCADE;
  DROP TABLE "_pages_v_blocks_phase_timeline_phases" CASCADE;
  DROP TABLE "_pages_v_blocks_phase_timeline_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_phase_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_team_intro" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_testimonials_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_testimonials_fk";
  
  DROP INDEX "pages_rels_testimonials_id_idx";
  DROP INDEX "_pages_v_rels_testimonials_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "testimonials_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "testimonials_id";
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_layout";
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_source";
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_all_link_type";
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_fallback_mode";
  DROP TYPE "public"."enum_pages_blocks_testimonial_row_variant";
  DROP TYPE "public"."enum_pages_blocks_testimonial_row_study_card_source";
  DROP TYPE "public"."enum_pages_blocks_testimonial_row_cta_type";
  DROP TYPE "public"."enum_pages_blocks_phase_timeline_steps_phase";
  DROP TYPE "public"."enum_pages_blocks_phase_timeline_variant";
  DROP TYPE "public"."enum_pages_blocks_team_intro_variant";
  DROP TYPE "public"."enum_pages_blocks_team_intro_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cards_layout";
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cards_source";
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cards_all_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cards_fallback_mode";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_row_variant";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_row_study_card_source";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_row_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_phase_timeline_steps_phase";
  DROP TYPE "public"."enum__pages_v_blocks_phase_timeline_variant";
  DROP TYPE "public"."enum__pages_v_blocks_team_intro_variant";
  DROP TYPE "public"."enum__pages_v_blocks_team_intro_link_type";`)
}
