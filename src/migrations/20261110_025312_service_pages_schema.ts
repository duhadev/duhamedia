import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Service pages redesign (owner-approved 2026-11-09; spec in
 * design-reference/service-pages-2026-11-09/). Additive only, `pages` and
 * `_pages_v`: enum ADD VALUE (TwoTrackPanels compare/bar, PhaseTimeline
 * detail/cells/ruled/flow, SpecLedger tools_layout catalog, ServiceSheet
 * fit/deliverables/duties), new enums (CaseStudyCards spacing, RichContent
 * band_layout, ServiceSheet group marker, PricingPlans layout + build-row link
 * type, CategoryTabs variant), new columns, new array tables (hero glance rows,
 * TwoTrackPanels compare rows, PricingPlans build rows, CategoryTabs links).
 * No drop, rename or type change. Data: 20261110_030000_service_pages.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_case_study_cards_spacing" AS ENUM('default', 'tight');
  CREATE TYPE "public"."enum_pages_blocks_rich_content_band_layout" AS ENUM('stacked', 'split');
  CREATE TYPE "public"."enum_ss_incl_groups_marker" AS ENUM('wine', 'ink', 'outlined');
  CREATE TYPE "public"."enum_pp_build_rows_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_pricing_plans_layout" AS ENUM('overview', 'build', 'plans');
  CREATE TYPE "public"."enum_pages_blocks_category_tabs_variant" AS ENUM('faq', 'jump');
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cards_spacing" AS ENUM('default', 'tight');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_content_band_layout" AS ENUM('stacked', 'split');
  CREATE TYPE "public"."enum__ss_incl_groups_v_marker" AS ENUM('wine', 'ink', 'outlined');
  CREATE TYPE "public"."enum__pp_build_rows_v_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_plans_layout" AS ENUM('overview', 'build', 'plans');
  CREATE TYPE "public"."enum__pages_v_blocks_category_tabs_variant" AS ENUM('faq', 'jump');
  ALTER TYPE "public"."enum_pages_blocks_two_track_panels_variant" ADD VALUE 'compare';
  ALTER TYPE "public"."enum_pages_blocks_two_track_panels_variant" ADD VALUE 'bar';
  ALTER TYPE "public"."enum_pages_blocks_phase_timeline_variant" ADD VALUE 'detail';
  ALTER TYPE "public"."enum_pages_blocks_phase_timeline_variant" ADD VALUE 'cells';
  ALTER TYPE "public"."enum_pages_blocks_phase_timeline_variant" ADD VALUE 'ruled';
  ALTER TYPE "public"."enum_pages_blocks_phase_timeline_variant" ADD VALUE 'flow';
  ALTER TYPE "public"."enum_pages_blocks_spec_ledger_tools_layout" ADD VALUE 'catalog';
  ALTER TYPE "public"."enum_pages_blocks_service_sheet_presentation" ADD VALUE 'fit';
  ALTER TYPE "public"."enum_pages_blocks_service_sheet_presentation" ADD VALUE 'deliverables';
  ALTER TYPE "public"."enum_pages_blocks_service_sheet_presentation" ADD VALUE 'duties';
  ALTER TYPE "public"."enum__pages_v_blocks_two_track_panels_variant" ADD VALUE 'compare';
  ALTER TYPE "public"."enum__pages_v_blocks_two_track_panels_variant" ADD VALUE 'bar';
  ALTER TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" ADD VALUE 'detail';
  ALTER TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" ADD VALUE 'cells';
  ALTER TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" ADD VALUE 'ruled';
  ALTER TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" ADD VALUE 'flow';
  ALTER TYPE "public"."enum__pages_v_blocks_spec_ledger_tools_layout" ADD VALUE 'catalog';
  ALTER TYPE "public"."enum__pages_v_blocks_service_sheet_presentation" ADD VALUE 'fit';
  ALTER TYPE "public"."enum__pages_v_blocks_service_sheet_presentation" ADD VALUE 'deliverables';
  ALTER TYPE "public"."enum__pages_v_blocks_service_sheet_presentation" ADD VALUE 'duties';
  CREATE TABLE "pages_blocks_hero_glance_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"accent" boolean DEFAULT false
  );
  
  CREATE TABLE "ttp_compare_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"first" varchar,
  	"second" varchar
  );
  
  CREATE TABLE "pp_build_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"link_type" "enum_pp_build_rows_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_category_tabs_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"anchor_id" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_glance_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"accent" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_ttp_compare_rows_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"first" varchar,
  	"second" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pp_build_rows_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"link_type" "enum__pp_build_rows_v_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_tabs_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"anchor_id" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "accent_wine" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "glance_title" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "glance_footer" varchar;
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "spacing" "enum_pages_blocks_case_study_cards_spacing" DEFAULT 'default';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "center_facts" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_two_track_panels_panels" ADD COLUMN "share" numeric;
  ALTER TABLE "pages_blocks_two_track_panels" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_two_track_panels" ADD COLUMN "rows_label" varchar DEFAULT 'Compare';
  ALTER TABLE "pages_blocks_phase_timeline_steps" ADD COLUMN "you" varchar;
  ALTER TABLE "pages_blocks_phase_timeline_steps" ADD COLUMN "you_get" varchar;
  ALTER TABLE "pages_blocks_phase_timeline_steps" ADD COLUMN "accent" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_phase_timeline" ADD COLUMN "you_label" varchar DEFAULT 'You';
  ALTER TABLE "pages_blocks_phase_timeline" ADD COLUMN "you_get_label" varchar DEFAULT 'You get';
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "band_layout" "enum_pages_blocks_rich_content_band_layout" DEFAULT 'stacked';
  ALTER TABLE "pages_blocks_spec_ledger_items" ADD COLUMN "group_label" varchar;
  ALTER TABLE "pages_blocks_spec_ledger" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "ss_incl_groups" ADD COLUMN "marker" "enum_ss_incl_groups_marker" DEFAULT 'wine';
  ALTER TABLE "pages_blocks_service_sheet" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_service_sheet" ADD COLUMN "box_note" varchar;
  ALTER TABLE "pages_blocks_pricing_plans" ADD COLUMN "layout" "enum_pages_blocks_pricing_plans_layout" DEFAULT 'overview';
  ALTER TABLE "pages_blocks_accordion_f_a_q" ADD COLUMN "accent_phrase" varchar;
  ALTER TABLE "pages_blocks_category_tabs" ADD COLUMN "variant" "enum_pages_blocks_category_tabs_variant" DEFAULT 'faq';
  ALTER TABLE "pages_blocks_category_tabs" ADD COLUMN "label" varchar DEFAULT 'Jump to';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "accent_wine" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "glance_title" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "glance_footer" varchar;
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "spacing" "enum__pages_v_blocks_case_study_cards_spacing" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "center_facts" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_two_track_panels_panels" ADD COLUMN "share" numeric;
  ALTER TABLE "_pages_v_blocks_two_track_panels" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_two_track_panels" ADD COLUMN "rows_label" varchar DEFAULT 'Compare';
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" ADD COLUMN "you" varchar;
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" ADD COLUMN "you_get" varchar;
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" ADD COLUMN "accent" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_phase_timeline" ADD COLUMN "you_label" varchar DEFAULT 'You';
  ALTER TABLE "_pages_v_blocks_phase_timeline" ADD COLUMN "you_get_label" varchar DEFAULT 'You get';
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "band_layout" "enum__pages_v_blocks_rich_content_band_layout" DEFAULT 'stacked';
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" ADD COLUMN "group_label" varchar;
  ALTER TABLE "_pages_v_blocks_spec_ledger" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_ss_incl_groups_v" ADD COLUMN "marker" "enum__ss_incl_groups_v_marker" DEFAULT 'wine';
  ALTER TABLE "_pages_v_blocks_service_sheet" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_service_sheet" ADD COLUMN "box_note" varchar;
  ALTER TABLE "_pages_v_blocks_pricing_plans" ADD COLUMN "layout" "enum__pages_v_blocks_pricing_plans_layout" DEFAULT 'overview';
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" ADD COLUMN "accent_phrase" varchar;
  ALTER TABLE "_pages_v_blocks_category_tabs" ADD COLUMN "variant" "enum__pages_v_blocks_category_tabs_variant" DEFAULT 'faq';
  ALTER TABLE "_pages_v_blocks_category_tabs" ADD COLUMN "label" varchar DEFAULT 'Jump to';
  ALTER TABLE "pages_blocks_hero_glance_rows" ADD CONSTRAINT "pages_blocks_hero_glance_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ttp_compare_rows" ADD CONSTRAINT "ttp_compare_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_two_track_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pp_build_rows" ADD CONSTRAINT "pp_build_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_tabs_links" ADD CONSTRAINT "pages_blocks_category_tabs_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_glance_rows" ADD CONSTRAINT "_pages_v_blocks_hero_glance_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_ttp_compare_rows_v" ADD CONSTRAINT "_ttp_compare_rows_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_two_track_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pp_build_rows_v" ADD CONSTRAINT "_pp_build_rows_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_tabs_links" ADD CONSTRAINT "_pages_v_blocks_category_tabs_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_tabs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_glance_rows_order_idx" ON "pages_blocks_hero_glance_rows" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_glance_rows_parent_id_idx" ON "pages_blocks_hero_glance_rows" USING btree ("_parent_id");
  CREATE INDEX "ttp_compare_rows_order_idx" ON "ttp_compare_rows" USING btree ("_order");
  CREATE INDEX "ttp_compare_rows_parent_id_idx" ON "ttp_compare_rows" USING btree ("_parent_id");
  CREATE INDEX "pp_build_rows_order_idx" ON "pp_build_rows" USING btree ("_order");
  CREATE INDEX "pp_build_rows_parent_id_idx" ON "pp_build_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_tabs_links_order_idx" ON "pages_blocks_category_tabs_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_tabs_links_parent_id_idx" ON "pages_blocks_category_tabs_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_glance_rows_order_idx" ON "_pages_v_blocks_hero_glance_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_glance_rows_parent_id_idx" ON "_pages_v_blocks_hero_glance_rows" USING btree ("_parent_id");
  CREATE INDEX "_ttp_compare_rows_v_order_idx" ON "_ttp_compare_rows_v" USING btree ("_order");
  CREATE INDEX "_ttp_compare_rows_v_parent_id_idx" ON "_ttp_compare_rows_v" USING btree ("_parent_id");
  CREATE INDEX "_pp_build_rows_v_order_idx" ON "_pp_build_rows_v" USING btree ("_order");
  CREATE INDEX "_pp_build_rows_v_parent_id_idx" ON "_pp_build_rows_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_tabs_links_order_idx" ON "_pages_v_blocks_category_tabs_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_tabs_links_parent_id_idx" ON "_pages_v_blocks_category_tabs_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: `migrate:reset` runs every down oldest-first; once the initial
  // migration's down has dropped `users`, there is nothing left to undo here.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  // NOTE: the enum rebuilds below fail (and the whole down rolls back) while any
  // row still uses a value this migration added (e.g. the service pages after
  // 20261110_030000_service_pages). That is deliberate: down never deletes content.
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_glance_rows" CASCADE;
  DROP TABLE "ttp_compare_rows" CASCADE;
  DROP TABLE "pp_build_rows" CASCADE;
  DROP TABLE "pages_blocks_category_tabs_links" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_glance_rows" CASCADE;
  DROP TABLE "_ttp_compare_rows_v" CASCADE;
  DROP TABLE "_pp_build_rows_v" CASCADE;
  DROP TABLE "_pages_v_blocks_category_tabs_links" CASCADE;
  ALTER TABLE "pages_blocks_two_track_panels" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_two_track_panels" ALTER COLUMN "variant" SET DEFAULT 'equal'::text;
  DROP TYPE "public"."enum_pages_blocks_two_track_panels_variant";
  CREATE TYPE "public"."enum_pages_blocks_two_track_panels_variant" AS ENUM('equal', 'contrast', 'primary-secondary', 'doors');
  ALTER TABLE "pages_blocks_two_track_panels" ALTER COLUMN "variant" SET DEFAULT 'equal'::"public"."enum_pages_blocks_two_track_panels_variant";
  ALTER TABLE "pages_blocks_two_track_panels" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_two_track_panels_variant" USING "variant"::"public"."enum_pages_blocks_two_track_panels_variant";
  ALTER TABLE "pages_blocks_phase_timeline" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_phase_timeline" ALTER COLUMN "variant" SET DEFAULT 'accordion'::text;
  DROP TYPE "public"."enum_pages_blocks_phase_timeline_variant";
  CREATE TYPE "public"."enum_pages_blocks_phase_timeline_variant" AS ENUM('accordion', 'arc', 'steps', 'build-run', 'engine-rollout', 'grid');
  ALTER TABLE "pages_blocks_phase_timeline" ALTER COLUMN "variant" SET DEFAULT 'accordion'::"public"."enum_pages_blocks_phase_timeline_variant";
  ALTER TABLE "pages_blocks_phase_timeline" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_phase_timeline_variant" USING "variant"::"public"."enum_pages_blocks_phase_timeline_variant";
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DEFAULT 'row'::text;
  DROP TYPE "public"."enum_pages_blocks_spec_ledger_tools_layout";
  CREATE TYPE "public"."enum_pages_blocks_spec_ledger_tools_layout" AS ENUM('row', 'tiles', 'grid');
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DEFAULT 'row'::"public"."enum_pages_blocks_spec_ledger_tools_layout";
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DATA TYPE "public"."enum_pages_blocks_spec_ledger_tools_layout" USING "tools_layout"::"public"."enum_pages_blocks_spec_ledger_tools_layout";
  ALTER TABLE "pages_blocks_service_sheet" ALTER COLUMN "presentation" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_service_sheet" ALTER COLUMN "presentation" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_service_sheet_presentation";
  CREATE TYPE "public"."enum_pages_blocks_service_sheet_presentation" AS ENUM('page', 'section');
  ALTER TABLE "pages_blocks_service_sheet" ALTER COLUMN "presentation" SET DEFAULT 'page'::"public"."enum_pages_blocks_service_sheet_presentation";
  ALTER TABLE "pages_blocks_service_sheet" ALTER COLUMN "presentation" SET DATA TYPE "public"."enum_pages_blocks_service_sheet_presentation" USING "presentation"::"public"."enum_pages_blocks_service_sheet_presentation";
  ALTER TABLE "_pages_v_blocks_two_track_panels" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_two_track_panels" ALTER COLUMN "variant" SET DEFAULT 'equal'::text;
  DROP TYPE "public"."enum__pages_v_blocks_two_track_panels_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_two_track_panels_variant" AS ENUM('equal', 'contrast', 'primary-secondary', 'doors');
  ALTER TABLE "_pages_v_blocks_two_track_panels" ALTER COLUMN "variant" SET DEFAULT 'equal'::"public"."enum__pages_v_blocks_two_track_panels_variant";
  ALTER TABLE "_pages_v_blocks_two_track_panels" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_two_track_panels_variant" USING "variant"::"public"."enum__pages_v_blocks_two_track_panels_variant";
  ALTER TABLE "_pages_v_blocks_phase_timeline" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_phase_timeline" ALTER COLUMN "variant" SET DEFAULT 'accordion'::text;
  DROP TYPE "public"."enum__pages_v_blocks_phase_timeline_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" AS ENUM('accordion', 'arc', 'steps', 'build-run', 'engine-rollout', 'grid');
  ALTER TABLE "_pages_v_blocks_phase_timeline" ALTER COLUMN "variant" SET DEFAULT 'accordion'::"public"."enum__pages_v_blocks_phase_timeline_variant";
  ALTER TABLE "_pages_v_blocks_phase_timeline" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" USING "variant"::"public"."enum__pages_v_blocks_phase_timeline_variant";
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DEFAULT 'row'::text;
  DROP TYPE "public"."enum__pages_v_blocks_spec_ledger_tools_layout";
  CREATE TYPE "public"."enum__pages_v_blocks_spec_ledger_tools_layout" AS ENUM('row', 'tiles', 'grid');
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DEFAULT 'row'::"public"."enum__pages_v_blocks_spec_ledger_tools_layout";
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DATA TYPE "public"."enum__pages_v_blocks_spec_ledger_tools_layout" USING "tools_layout"::"public"."enum__pages_v_blocks_spec_ledger_tools_layout";
  ALTER TABLE "_pages_v_blocks_service_sheet" ALTER COLUMN "presentation" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_service_sheet" ALTER COLUMN "presentation" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_service_sheet_presentation";
  CREATE TYPE "public"."enum__pages_v_blocks_service_sheet_presentation" AS ENUM('page', 'section');
  ALTER TABLE "_pages_v_blocks_service_sheet" ALTER COLUMN "presentation" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_service_sheet_presentation";
  ALTER TABLE "_pages_v_blocks_service_sheet" ALTER COLUMN "presentation" SET DATA TYPE "public"."enum__pages_v_blocks_service_sheet_presentation" USING "presentation"::"public"."enum__pages_v_blocks_service_sheet_presentation";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "accent_wine";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "glance_title";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "glance_footer";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "spacing";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "center_facts";
  ALTER TABLE "pages_blocks_two_track_panels_panels" DROP COLUMN "share";
  ALTER TABLE "pages_blocks_two_track_panels" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_two_track_panels" DROP COLUMN "rows_label";
  ALTER TABLE "pages_blocks_phase_timeline_steps" DROP COLUMN "you";
  ALTER TABLE "pages_blocks_phase_timeline_steps" DROP COLUMN "you_get";
  ALTER TABLE "pages_blocks_phase_timeline_steps" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_phase_timeline" DROP COLUMN "you_label";
  ALTER TABLE "pages_blocks_phase_timeline" DROP COLUMN "you_get_label";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "band_layout";
  ALTER TABLE "pages_blocks_spec_ledger_items" DROP COLUMN "group_label";
  ALTER TABLE "pages_blocks_spec_ledger" DROP COLUMN "anchor_id";
  ALTER TABLE "ss_incl_groups" DROP COLUMN "marker";
  ALTER TABLE "pages_blocks_service_sheet" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_service_sheet" DROP COLUMN "box_note";
  ALTER TABLE "pages_blocks_pricing_plans" DROP COLUMN "layout";
  ALTER TABLE "pages_blocks_accordion_f_a_q" DROP COLUMN "accent_phrase";
  ALTER TABLE "pages_blocks_category_tabs" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_category_tabs" DROP COLUMN "label";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "accent_wine";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "glance_title";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "glance_footer";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "center_facts";
  ALTER TABLE "_pages_v_blocks_two_track_panels_panels" DROP COLUMN "share";
  ALTER TABLE "_pages_v_blocks_two_track_panels" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_two_track_panels" DROP COLUMN "rows_label";
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" DROP COLUMN "you";
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" DROP COLUMN "you_get";
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" DROP COLUMN "accent";
  ALTER TABLE "_pages_v_blocks_phase_timeline" DROP COLUMN "you_label";
  ALTER TABLE "_pages_v_blocks_phase_timeline" DROP COLUMN "you_get_label";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "band_layout";
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" DROP COLUMN "group_label";
  ALTER TABLE "_pages_v_blocks_spec_ledger" DROP COLUMN "anchor_id";
  ALTER TABLE "_ss_incl_groups_v" DROP COLUMN "marker";
  ALTER TABLE "_pages_v_blocks_service_sheet" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_service_sheet" DROP COLUMN "box_note";
  ALTER TABLE "_pages_v_blocks_pricing_plans" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" DROP COLUMN "accent_phrase";
  ALTER TABLE "_pages_v_blocks_category_tabs" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_category_tabs" DROP COLUMN "label";
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_spacing";
  DROP TYPE "public"."enum_pages_blocks_rich_content_band_layout";
  DROP TYPE "public"."enum_ss_incl_groups_marker";
  DROP TYPE "public"."enum_pp_build_rows_link_type";
  DROP TYPE "public"."enum_pages_blocks_pricing_plans_layout";
  DROP TYPE "public"."enum_pages_blocks_category_tabs_variant";
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cards_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_rich_content_band_layout";
  DROP TYPE "public"."enum__ss_incl_groups_v_marker";
  DROP TYPE "public"."enum__pp_build_rows_v_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_plans_layout";
  DROP TYPE "public"."enum__pages_v_blocks_category_tabs_variant";`)
}
