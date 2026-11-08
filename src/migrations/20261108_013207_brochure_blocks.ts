import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_metric_event_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_service_sheet_numbers_layout" AS ENUM('columns', 'rows');
  CREATE TYPE "public"."enum_pages_blocks_service_sheet_box_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_service_sheet_next_step_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_pricing_plans_build_next_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_metric_event_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_service_sheet_numbers_layout" AS ENUM('columns', 'rows');
  CREATE TYPE "public"."enum__pages_v_blocks_service_sheet_box_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_service_sheet_next_step_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_plans_build_next_link_type" AS ENUM('internal', 'custom');
  ALTER TYPE "public"."enum_pages_blocks_phase_timeline_variant" ADD VALUE 'grid';
  ALTER TYPE "public"."enum_pages_blocks_spec_ledger_variant" ADD VALUE 'tools';
  ALTER TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" ADD VALUE 'grid';
  ALTER TYPE "public"."enum__pages_v_blocks_spec_ledger_variant" ADD VALUE 'tools';
  CREATE TABLE "pages_blocks_service_sheet_numbers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"lead" varchar,
  	"accent" boolean DEFAULT false,
  	"text" varchar
  );
  
  CREATE TABLE "ss_incl_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "ss_incl_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  
  CREATE TABLE "ss_diff_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"line" varchar
  );
  
  CREATE TABLE "pages_blocks_service_sheet" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"why_heading" varchar,
  	"why_body" varchar,
  	"numbers_label" varchar,
  	"numbers_layout" "enum_pages_blocks_service_sheet_numbers_layout" DEFAULT 'columns',
  	"box_label" varchar,
  	"box_body" varchar,
  	"box_link_type" "enum_pages_blocks_service_sheet_box_link_type" DEFAULT 'internal',
  	"box_link_new_tab" boolean DEFAULT false,
  	"box_link_url" varchar,
  	"box_link_label" varchar,
  	"next_step_label" varchar,
  	"next_step_link_type" "enum_pages_blocks_service_sheet_next_step_link_type" DEFAULT 'internal',
  	"next_step_link_new_tab" boolean DEFAULT false,
  	"next_step_link_url" varchar,
  	"next_step_link_label" varchar,
  	"included_heading" varchar,
  	"differentiators_heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_plans_build_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_plans_marketing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"tag" varchar,
  	"body" varchar,
  	"first" varchar,
  	"after" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_plans_terms" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "pages_blocks_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor_id" varchar DEFAULT 'pricing',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT true,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"intro" varchar,
  	"build_label" varchar,
  	"build_lead" varchar,
  	"build_price" varchar,
  	"build_next_label" varchar,
  	"build_next_link_type" "enum_pages_blocks_pricing_plans_build_next_link_type" DEFAULT 'internal',
  	"build_next_link_new_tab" boolean DEFAULT false,
  	"build_next_link_url" varchar,
  	"build_next_link_label" varchar,
  	"marketing_label" varchar,
  	"marketing_intro" varchar,
  	"marketing_first_label" varchar DEFAULT 'First quarter',
  	"marketing_after_label" varchar DEFAULT 'After that',
  	"marketing_threshold" varchar,
  	"marketing_fine_print" varchar,
  	"statement" varchar,
  	"statement_accent" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_sheet_numbers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"lead" varchar,
  	"accent" boolean DEFAULT false,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ss_incl_items_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ss_incl_groups_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ss_diff_rows_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"line" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_service_sheet" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"why_heading" varchar,
  	"why_body" varchar,
  	"numbers_label" varchar,
  	"numbers_layout" "enum__pages_v_blocks_service_sheet_numbers_layout" DEFAULT 'columns',
  	"box_label" varchar,
  	"box_body" varchar,
  	"box_link_type" "enum__pages_v_blocks_service_sheet_box_link_type" DEFAULT 'internal',
  	"box_link_new_tab" boolean DEFAULT false,
  	"box_link_url" varchar,
  	"box_link_label" varchar,
  	"next_step_label" varchar,
  	"next_step_link_type" "enum__pages_v_blocks_service_sheet_next_step_link_type" DEFAULT 'internal',
  	"next_step_link_new_tab" boolean DEFAULT false,
  	"next_step_link_url" varchar,
  	"next_step_link_label" varchar,
  	"included_heading" varchar,
  	"differentiators_heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_plans_build_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_plans_marketing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"tag" varchar,
  	"body" varchar,
  	"first" varchar,
  	"after" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_plans_terms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_pricing_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor_id" varchar DEFAULT 'pricing',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT true,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"intro" varchar,
  	"build_label" varchar,
  	"build_lead" varchar,
  	"build_price" varchar,
  	"build_next_label" varchar,
  	"build_next_link_type" "enum__pages_v_blocks_pricing_plans_build_next_link_type" DEFAULT 'internal',
  	"build_next_link_new_tab" boolean DEFAULT false,
  	"build_next_link_url" varchar,
  	"build_next_link_label" varchar,
  	"marketing_label" varchar,
  	"marketing_intro" varchar,
  	"marketing_first_label" varchar DEFAULT 'First quarter',
  	"marketing_after_label" varchar DEFAULT 'After that',
  	"marketing_threshold" varchar,
  	"marketing_fine_print" varchar,
  	"statement" varchar,
  	"statement_accent" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_metric_event" ADD COLUMN "width" "enum_pages_blocks_metric_event_width" DEFAULT 'narrow';
  ALTER TABLE "pages_blocks_phase_timeline_phases" ADD COLUMN "continued_label" varchar;
  ALTER TABLE "_pages_v_blocks_metric_event" ADD COLUMN "width" "enum__pages_v_blocks_metric_event_width" DEFAULT 'narrow';
  ALTER TABLE "_pages_v_blocks_phase_timeline_phases" ADD COLUMN "continued_label" varchar;
  ALTER TABLE "pages_blocks_service_sheet_numbers_items" ADD CONSTRAINT "pages_blocks_service_sheet_numbers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_sheet"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ss_incl_items" ADD CONSTRAINT "ss_incl_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ss_incl_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ss_incl_groups" ADD CONSTRAINT "ss_incl_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_sheet"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ss_diff_rows" ADD CONSTRAINT "ss_diff_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_service_sheet"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_service_sheet" ADD CONSTRAINT "pages_blocks_service_sheet_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_plans_build_bullets" ADD CONSTRAINT "pages_blocks_pricing_plans_build_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_plans_marketing_plans" ADD CONSTRAINT "pages_blocks_pricing_plans_marketing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_plans_terms" ADD CONSTRAINT "pages_blocks_pricing_plans_terms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_pricing_plans" ADD CONSTRAINT "pages_blocks_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_sheet_numbers_items" ADD CONSTRAINT "_pages_v_blocks_service_sheet_numbers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_sheet"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ss_incl_items_v" ADD CONSTRAINT "_ss_incl_items_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_ss_incl_groups_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ss_incl_groups_v" ADD CONSTRAINT "_ss_incl_groups_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_sheet"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ss_diff_rows_v" ADD CONSTRAINT "_ss_diff_rows_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_service_sheet"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_service_sheet" ADD CONSTRAINT "_pages_v_blocks_service_sheet_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_plans_build_bullets" ADD CONSTRAINT "_pages_v_blocks_pricing_plans_build_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_plans_marketing_plans" ADD CONSTRAINT "_pages_v_blocks_pricing_plans_marketing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_plans_terms" ADD CONSTRAINT "_pages_v_blocks_pricing_plans_terms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_pricing_plans" ADD CONSTRAINT "_pages_v_blocks_pricing_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_service_sheet_numbers_items_order_idx" ON "pages_blocks_service_sheet_numbers_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_sheet_numbers_items_parent_id_idx" ON "pages_blocks_service_sheet_numbers_items" USING btree ("_parent_id");
  CREATE INDEX "ss_incl_items_order_idx" ON "ss_incl_items" USING btree ("_order");
  CREATE INDEX "ss_incl_items_parent_id_idx" ON "ss_incl_items" USING btree ("_parent_id");
  CREATE INDEX "ss_incl_groups_order_idx" ON "ss_incl_groups" USING btree ("_order");
  CREATE INDEX "ss_incl_groups_parent_id_idx" ON "ss_incl_groups" USING btree ("_parent_id");
  CREATE INDEX "ss_diff_rows_order_idx" ON "ss_diff_rows" USING btree ("_order");
  CREATE INDEX "ss_diff_rows_parent_id_idx" ON "ss_diff_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_sheet_order_idx" ON "pages_blocks_service_sheet" USING btree ("_order");
  CREATE INDEX "pages_blocks_service_sheet_parent_id_idx" ON "pages_blocks_service_sheet" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_service_sheet_path_idx" ON "pages_blocks_service_sheet" USING btree ("_path");
  CREATE INDEX "pages_blocks_pricing_plans_build_bullets_order_idx" ON "pages_blocks_pricing_plans_build_bullets" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_plans_build_bullets_parent_id_idx" ON "pages_blocks_pricing_plans_build_bullets" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_plans_marketing_plans_order_idx" ON "pages_blocks_pricing_plans_marketing_plans" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_plans_marketing_plans_parent_id_idx" ON "pages_blocks_pricing_plans_marketing_plans" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_plans_terms_order_idx" ON "pages_blocks_pricing_plans_terms" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_plans_terms_parent_id_idx" ON "pages_blocks_pricing_plans_terms" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_plans_order_idx" ON "pages_blocks_pricing_plans" USING btree ("_order");
  CREATE INDEX "pages_blocks_pricing_plans_parent_id_idx" ON "pages_blocks_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_pricing_plans_path_idx" ON "pages_blocks_pricing_plans" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_service_sheet_numbers_items_order_idx" ON "_pages_v_blocks_service_sheet_numbers_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_sheet_numbers_items_parent_id_idx" ON "_pages_v_blocks_service_sheet_numbers_items" USING btree ("_parent_id");
  CREATE INDEX "_ss_incl_items_v_order_idx" ON "_ss_incl_items_v" USING btree ("_order");
  CREATE INDEX "_ss_incl_items_v_parent_id_idx" ON "_ss_incl_items_v" USING btree ("_parent_id");
  CREATE INDEX "_ss_incl_groups_v_order_idx" ON "_ss_incl_groups_v" USING btree ("_order");
  CREATE INDEX "_ss_incl_groups_v_parent_id_idx" ON "_ss_incl_groups_v" USING btree ("_parent_id");
  CREATE INDEX "_ss_diff_rows_v_order_idx" ON "_ss_diff_rows_v" USING btree ("_order");
  CREATE INDEX "_ss_diff_rows_v_parent_id_idx" ON "_ss_diff_rows_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_sheet_order_idx" ON "_pages_v_blocks_service_sheet" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_service_sheet_parent_id_idx" ON "_pages_v_blocks_service_sheet" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_service_sheet_path_idx" ON "_pages_v_blocks_service_sheet" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_pricing_plans_build_bullets_order_idx" ON "_pages_v_blocks_pricing_plans_build_bullets" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_plans_build_bullets_parent_id_idx" ON "_pages_v_blocks_pricing_plans_build_bullets" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_plans_marketing_plans_order_idx" ON "_pages_v_blocks_pricing_plans_marketing_plans" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_plans_marketing_plans_parent_id_idx" ON "_pages_v_blocks_pricing_plans_marketing_plans" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_plans_terms_order_idx" ON "_pages_v_blocks_pricing_plans_terms" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_plans_terms_parent_id_idx" ON "_pages_v_blocks_pricing_plans_terms" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_plans_order_idx" ON "_pages_v_blocks_pricing_plans" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_pricing_plans_parent_id_idx" ON "_pages_v_blocks_pricing_plans" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_pricing_plans_path_idx" ON "_pages_v_blocks_pricing_plans" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_service_sheet_numbers_items" CASCADE;
  DROP TABLE "ss_incl_items" CASCADE;
  DROP TABLE "ss_incl_groups" CASCADE;
  DROP TABLE "ss_diff_rows" CASCADE;
  DROP TABLE "pages_blocks_service_sheet" CASCADE;
  DROP TABLE "pages_blocks_pricing_plans_build_bullets" CASCADE;
  DROP TABLE "pages_blocks_pricing_plans_marketing_plans" CASCADE;
  DROP TABLE "pages_blocks_pricing_plans_terms" CASCADE;
  DROP TABLE "pages_blocks_pricing_plans" CASCADE;
  DROP TABLE "_pages_v_blocks_service_sheet_numbers_items" CASCADE;
  DROP TABLE "_ss_incl_items_v" CASCADE;
  DROP TABLE "_ss_incl_groups_v" CASCADE;
  DROP TABLE "_ss_diff_rows_v" CASCADE;
  DROP TABLE "_pages_v_blocks_service_sheet" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_plans_build_bullets" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_plans_marketing_plans" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_plans_terms" CASCADE;
  DROP TABLE "_pages_v_blocks_pricing_plans" CASCADE;
  ALTER TABLE "pages_blocks_phase_timeline" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_phase_timeline" ALTER COLUMN "variant" SET DEFAULT 'accordion'::text;
  DROP TYPE "public"."enum_pages_blocks_phase_timeline_variant";
  CREATE TYPE "public"."enum_pages_blocks_phase_timeline_variant" AS ENUM('accordion', 'arc', 'steps', 'build-run', 'engine-rollout');
  ALTER TABLE "pages_blocks_phase_timeline" ALTER COLUMN "variant" SET DEFAULT 'accordion'::"public"."enum_pages_blocks_phase_timeline_variant";
  ALTER TABLE "pages_blocks_phase_timeline" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_phase_timeline_variant" USING "variant"::"public"."enum_pages_blocks_phase_timeline_variant";
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "variant" SET DEFAULT 'cards'::text;
  DROP TYPE "public"."enum_pages_blocks_spec_ledger_variant";
  CREATE TYPE "public"."enum_pages_blocks_spec_ledger_variant" AS ENUM('cards', 'expandable', 'signal-flow', 'list');
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "variant" SET DEFAULT 'cards'::"public"."enum_pages_blocks_spec_ledger_variant";
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_spec_ledger_variant" USING "variant"::"public"."enum_pages_blocks_spec_ledger_variant";
  ALTER TABLE "_pages_v_blocks_phase_timeline" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_phase_timeline" ALTER COLUMN "variant" SET DEFAULT 'accordion'::text;
  DROP TYPE "public"."enum__pages_v_blocks_phase_timeline_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" AS ENUM('accordion', 'arc', 'steps', 'build-run', 'engine-rollout');
  ALTER TABLE "_pages_v_blocks_phase_timeline" ALTER COLUMN "variant" SET DEFAULT 'accordion'::"public"."enum__pages_v_blocks_phase_timeline_variant";
  ALTER TABLE "_pages_v_blocks_phase_timeline" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" USING "variant"::"public"."enum__pages_v_blocks_phase_timeline_variant";
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "variant" SET DEFAULT 'cards'::text;
  DROP TYPE "public"."enum__pages_v_blocks_spec_ledger_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_spec_ledger_variant" AS ENUM('cards', 'expandable', 'signal-flow', 'list');
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "variant" SET DEFAULT 'cards'::"public"."enum__pages_v_blocks_spec_ledger_variant";
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_spec_ledger_variant" USING "variant"::"public"."enum__pages_v_blocks_spec_ledger_variant";
  ALTER TABLE "pages_blocks_metric_event" DROP COLUMN "width";
  ALTER TABLE "pages_blocks_phase_timeline_phases" DROP COLUMN "continued_label";
  ALTER TABLE "_pages_v_blocks_metric_event" DROP COLUMN "width";
  ALTER TABLE "_pages_v_blocks_phase_timeline_phases" DROP COLUMN "continued_label";
  DROP TYPE "public"."enum_pages_blocks_metric_event_width";
  DROP TYPE "public"."enum_pages_blocks_service_sheet_numbers_layout";
  DROP TYPE "public"."enum_pages_blocks_service_sheet_box_link_type";
  DROP TYPE "public"."enum_pages_blocks_service_sheet_next_step_link_type";
  DROP TYPE "public"."enum_pages_blocks_pricing_plans_build_next_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_metric_event_width";
  DROP TYPE "public"."enum__pages_v_blocks_service_sheet_numbers_layout";
  DROP TYPE "public"."enum__pages_v_blocks_service_sheet_box_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_service_sheet_next_step_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_plans_build_next_link_type";`)
}
