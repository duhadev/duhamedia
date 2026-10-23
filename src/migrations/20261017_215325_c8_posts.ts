import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_how_we_do_it_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_posts_proof_source" AS ENUM('featured', 'track', 'manual');
  CREATE TYPE "public"."enum_posts_proof_fallback_mode" AS ENUM('testimonials', 'metricStrip');
  CREATE TYPE "public"."enum_posts_track" AS ENUM('dev-seo', 'mkt-seo', 'newsletter-issue');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_how_we_do_it_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__posts_v_version_proof_source" AS ENUM('featured', 'track', 'manual');
  CREATE TYPE "public"."enum__posts_v_version_proof_fallback_mode" AS ENUM('testimonials', 'metricStrip');
  CREATE TYPE "public"."enum__posts_v_version_track" AS ENUM('dev-seo', 'mkt-seo', 'newsletter-issue');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "posts_diy_bridge_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"accent" boolean DEFAULT false
  );
  
  CREATE TABLE "posts_proof_fallback_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"accent" boolean DEFAULT false
  );
  
  CREATE TABLE "posts_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"issue_number" numeric,
  	"sent_at" timestamp(3) with time zone,
  	"issue_metric" varchar,
  	"eyebrow" varchar,
  	"dek" varchar,
  	"hero_image_id" integer,
  	"body" jsonb,
  	"pricing_note" varchar,
  	"diy_bridge_eyebrow" varchar,
  	"diy_bridge_heading" varchar,
  	"diy_bridge_accent_phrase" varchar,
  	"diy_bridge_body" jsonb,
  	"how_we_do_it_eyebrow" varchar,
  	"how_we_do_it_body" varchar,
  	"how_we_do_it_link_type" "enum_posts_how_we_do_it_link_type" DEFAULT 'internal',
  	"how_we_do_it_link_new_tab" boolean DEFAULT false,
  	"how_we_do_it_link_url" varchar,
  	"how_we_do_it_link_label" varchar,
  	"educational_eyebrow" varchar,
  	"educational_heading" varchar,
  	"educational_body" jsonb,
  	"proof_source" "enum_posts_proof_source" DEFAULT 'track',
  	"proof_fallback_mode" "enum_posts_proof_fallback_mode",
  	"proof_fallback_note" varchar,
  	"faq_heading" varchar,
  	"closing_newsletter_heading" varchar,
  	"closing_final_cta_heading" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"track" "enum_posts_track",
  	"target_keyword" varchar,
  	"author_id" integer,
  	"read_time" numeric,
  	"published_at" timestamp(3) with time zone,
  	"updated_at_display" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"case_studies_id" integer,
  	"posts_id" integer,
  	"testimonials_id" integer
  );
  
  CREATE TABLE "_posts_v_version_diy_bridge_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"accent" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_proof_fallback_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"accent" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_issue_number" numeric,
  	"version_sent_at" timestamp(3) with time zone,
  	"version_issue_metric" varchar,
  	"version_eyebrow" varchar,
  	"version_dek" varchar,
  	"version_hero_image_id" integer,
  	"version_body" jsonb,
  	"version_pricing_note" varchar,
  	"version_diy_bridge_eyebrow" varchar,
  	"version_diy_bridge_heading" varchar,
  	"version_diy_bridge_accent_phrase" varchar,
  	"version_diy_bridge_body" jsonb,
  	"version_how_we_do_it_eyebrow" varchar,
  	"version_how_we_do_it_body" varchar,
  	"version_how_we_do_it_link_type" "enum__posts_v_version_how_we_do_it_link_type" DEFAULT 'internal',
  	"version_how_we_do_it_link_new_tab" boolean DEFAULT false,
  	"version_how_we_do_it_link_url" varchar,
  	"version_how_we_do_it_link_label" varchar,
  	"version_educational_eyebrow" varchar,
  	"version_educational_heading" varchar,
  	"version_educational_body" jsonb,
  	"version_proof_source" "enum__posts_v_version_proof_source" DEFAULT 'track',
  	"version_proof_fallback_mode" "enum__posts_v_version_proof_fallback_mode",
  	"version_proof_fallback_note" varchar,
  	"version_faq_heading" varchar,
  	"version_closing_newsletter_heading" varchar,
  	"version_closing_final_cta_heading" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_track" "enum__posts_v_version_track",
  	"version_target_keyword" varchar,
  	"version_author_id" integer,
  	"version_read_time" numeric,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at_display" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"case_studies_id" integer,
  	"posts_id" integer,
  	"testimonials_id" integer
  );
  
  ALTER TABLE "case_studies_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "_case_studies_v_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "posts_diy_bridge_facts" ADD CONSTRAINT "posts_diy_bridge_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_proof_fallback_metrics" ADD CONSTRAINT "posts_proof_fallback_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_faq" ADD CONSTRAINT "posts_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_team_members_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_diy_bridge_facts" ADD CONSTRAINT "_posts_v_version_diy_bridge_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_proof_fallback_metrics" ADD CONSTRAINT "_posts_v_version_proof_fallback_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_faq" ADD CONSTRAINT "_posts_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_team_members_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."team_members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_diy_bridge_facts_order_idx" ON "posts_diy_bridge_facts" USING btree ("_order");
  CREATE INDEX "posts_diy_bridge_facts_parent_id_idx" ON "posts_diy_bridge_facts" USING btree ("_parent_id");
  CREATE INDEX "posts_proof_fallback_metrics_order_idx" ON "posts_proof_fallback_metrics" USING btree ("_order");
  CREATE INDEX "posts_proof_fallback_metrics_parent_id_idx" ON "posts_proof_fallback_metrics" USING btree ("_parent_id");
  CREATE INDEX "posts_faq_order_idx" ON "posts_faq" USING btree ("_order");
  CREATE INDEX "posts_faq_parent_id_idx" ON "posts_faq" USING btree ("_parent_id");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_track_idx" ON "posts" USING btree ("track");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_case_studies_id_idx" ON "posts_rels" USING btree ("case_studies_id");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_testimonials_id_idx" ON "posts_rels" USING btree ("testimonials_id");
  CREATE INDEX "_posts_v_version_diy_bridge_facts_order_idx" ON "_posts_v_version_diy_bridge_facts" USING btree ("_order");
  CREATE INDEX "_posts_v_version_diy_bridge_facts_parent_id_idx" ON "_posts_v_version_diy_bridge_facts" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_proof_fallback_metrics_order_idx" ON "_posts_v_version_proof_fallback_metrics" USING btree ("_order");
  CREATE INDEX "_posts_v_version_proof_fallback_metrics_parent_id_idx" ON "_posts_v_version_proof_fallback_metrics" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_faq_order_idx" ON "_posts_v_version_faq" USING btree ("_order");
  CREATE INDEX "_posts_v_version_faq_parent_id_idx" ON "_posts_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_track_idx" ON "_posts_v" USING btree ("version_track");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_published_at_idx" ON "_posts_v" USING btree ("version_published_at");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_case_studies_id_idx" ON "_posts_v_rels" USING btree ("case_studies_id");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_rels_testimonials_id_idx" ON "_posts_v_rels" USING btree ("testimonials_id");
  ALTER TABLE "case_studies_rels" ADD CONSTRAINT "case_studies_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_rels" ADD CONSTRAINT "_case_studies_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "case_studies_rels_posts_id_idx" ON "case_studies_rels" USING btree ("posts_id");
  CREATE INDEX "_case_studies_v_rels_posts_id_idx" ON "_case_studies_v_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   -- Hand-fixed (integrator): drop FKs that existing tables hold on posts
  -- BEFORE the CASCADE table drops, which would otherwise remove them
  -- implicitly and make these DROP CONSTRAINTs fail.
  ALTER TABLE "case_studies_rels" DROP CONSTRAINT "case_studies_rels_posts_fk";
  ALTER TABLE "_case_studies_v_rels" DROP CONSTRAINT "_case_studies_v_rels_posts_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  ALTER TABLE "posts_diy_bridge_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_proof_fallback_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_diy_bridge_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_proof_fallback_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_version_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_diy_bridge_facts" CASCADE;
  DROP TABLE "posts_proof_fallback_metrics" CASCADE;
  DROP TABLE "posts_faq" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_diy_bridge_facts" CASCADE;
  DROP TABLE "_posts_v_version_proof_fallback_metrics" CASCADE;
  DROP TABLE "_posts_v_version_faq" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP INDEX "case_studies_rels_posts_id_idx";
  DROP INDEX "_case_studies_v_rels_posts_id_idx";
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  ALTER TABLE "case_studies_rels" DROP COLUMN "posts_id";
  ALTER TABLE "_case_studies_v_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  DROP TYPE "public"."enum_posts_how_we_do_it_link_type";
  DROP TYPE "public"."enum_posts_proof_source";
  DROP TYPE "public"."enum_posts_proof_fallback_mode";
  DROP TYPE "public"."enum_posts_track";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_how_we_do_it_link_type";
  DROP TYPE "public"."enum__posts_v_version_proof_source";
  DROP TYPE "public"."enum__posts_v_version_proof_fallback_mode";
  DROP TYPE "public"."enum__posts_v_version_track";
  DROP TYPE "public"."enum__posts_v_version_status";`)
}
