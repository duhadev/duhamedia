import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_navigation_header_links_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_navigation_footer_standard_columns_links_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_navigation_footer_reduced_links_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_navigation_footer_legal_links_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_navigation_header_cta_type" AS ENUM('internal', 'custom');
  CREATE TABLE "navigation_header_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_navigation_header_links_link_type" DEFAULT 'internal' NOT NULL,
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "navigation_footer_standard_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_navigation_footer_standard_columns_links_link_type" DEFAULT 'internal' NOT NULL,
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "navigation_footer_standard_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_reduced_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_navigation_footer_reduced_links_link_type" DEFAULT 'internal' NOT NULL,
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "navigation_footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_navigation_footer_legal_links_link_type" DEFAULT 'internal' NOT NULL,
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_cta_type" "enum_navigation_header_cta_type" DEFAULT 'internal' NOT NULL,
  	"header_cta_new_tab" boolean DEFAULT false,
  	"header_cta_url" varchar,
  	"header_cta_label" varchar,
  	"footer_standard_newsletter_nudge_heading" varchar DEFAULT 'Newsletter',
  	"footer_standard_newsletter_nudge_line" varchar DEFAULT 'One useful email a month. Numbers included.',
  	"footer_standard_newsletter_nudge_button_label" varchar DEFAULT 'Join',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"case_studies_id" integer,
  	"posts_id" integer,
  	"lead_magnets_id" integer
  );
  
  ALTER TABLE "navigation_header_links" ADD CONSTRAINT "navigation_header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_standard_columns_links" ADD CONSTRAINT "navigation_footer_standard_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_standard_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_standard_columns" ADD CONSTRAINT "navigation_footer_standard_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_reduced_links" ADD CONSTRAINT "navigation_footer_reduced_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_legal_links" ADD CONSTRAINT "navigation_footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_rels" ADD CONSTRAINT "navigation_rels_lead_magnets_fk" FOREIGN KEY ("lead_magnets_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "navigation_header_links_order_idx" ON "navigation_header_links" USING btree ("_order");
  CREATE INDEX "navigation_header_links_parent_id_idx" ON "navigation_header_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_standard_columns_links_order_idx" ON "navigation_footer_standard_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_standard_columns_links_parent_id_idx" ON "navigation_footer_standard_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_standard_columns_order_idx" ON "navigation_footer_standard_columns" USING btree ("_order");
  CREATE INDEX "navigation_footer_standard_columns_parent_id_idx" ON "navigation_footer_standard_columns" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_reduced_links_order_idx" ON "navigation_footer_reduced_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_reduced_links_parent_id_idx" ON "navigation_footer_reduced_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_legal_links_order_idx" ON "navigation_footer_legal_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_legal_links_parent_id_idx" ON "navigation_footer_legal_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_rels_order_idx" ON "navigation_rels" USING btree ("order");
  CREATE INDEX "navigation_rels_parent_idx" ON "navigation_rels" USING btree ("parent_id");
  CREATE INDEX "navigation_rels_path_idx" ON "navigation_rels" USING btree ("path");
  CREATE INDEX "navigation_rels_pages_id_idx" ON "navigation_rels" USING btree ("pages_id");
  CREATE INDEX "navigation_rels_case_studies_id_idx" ON "navigation_rels" USING btree ("case_studies_id");
  CREATE INDEX "navigation_rels_posts_id_idx" ON "navigation_rels" USING btree ("posts_id");
  CREATE INDEX "navigation_rels_lead_magnets_id_idx" ON "navigation_rels" USING btree ("lead_magnets_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   -- Hand-fixed (PROGRESS Decision log): child tables first (grandchild columns_links before
   -- columns; rels and every array table FK to navigation), parent last, then the enums.
  DROP TABLE "navigation_rels" CASCADE;
  DROP TABLE "navigation_header_links" CASCADE;
  DROP TABLE "navigation_footer_standard_columns_links" CASCADE;
  DROP TABLE "navigation_footer_standard_columns" CASCADE;
  DROP TABLE "navigation_footer_reduced_links" CASCADE;
  DROP TABLE "navigation_footer_legal_links" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TYPE "public"."enum_navigation_header_links_link_type";
  DROP TYPE "public"."enum_navigation_footer_standard_columns_links_link_type";
  DROP TYPE "public"."enum_navigation_footer_reduced_links_link_type";
  DROP TYPE "public"."enum_navigation_footer_legal_links_link_type";
  DROP TYPE "public"."enum_navigation_header_cta_type";`)
}
