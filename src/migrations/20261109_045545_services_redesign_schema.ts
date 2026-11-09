/**
 * /services redesign (2026-11-09), additive only: Hero accentLine + proofLine,
 * ServiceSheet presentation/section fields, SpecLedger toolsLayout + 5 logo
 * values, PhaseTimeline step phase '0', PricingPlans plan figures
 * (pp_plan_figures) + marketing.nextLink, TestimonialRow studyCard.centerFacts,
 * AccordionFAQ layout + intro (pages + _pages_v).
 */
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_spec_ledger_tools_layout" AS ENUM('row', 'tiles');
  CREATE TYPE "public"."enum_pages_blocks_service_sheet_presentation" AS ENUM('page', 'section');
  CREATE TYPE "public"."enum_pages_blocks_pricing_plans_marketing_next_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_accordion_f_a_q_layout" AS ENUM('stacked', 'split');
  CREATE TYPE "public"."enum__pages_v_blocks_spec_ledger_tools_layout" AS ENUM('row', 'tiles');
  CREATE TYPE "public"."enum__pages_v_blocks_service_sheet_presentation" AS ENUM('page', 'section');
  CREATE TYPE "public"."enum__pages_v_blocks_pricing_plans_marketing_next_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_layout" AS ENUM('stacked', 'split');
  ALTER TYPE "public"."enum_pages_blocks_phase_timeline_steps_phase" ADD VALUE '0' BEFORE '1';
  ALTER TYPE "public"."enum_pages_blocks_spec_ledger_items_logo" ADD VALUE 'google';
  ALTER TYPE "public"."enum_pages_blocks_spec_ledger_items_logo" ADD VALUE 'google-search-console';
  ALTER TYPE "public"."enum_pages_blocks_spec_ledger_items_logo" ADD VALUE 'claude';
  ALTER TYPE "public"."enum_pages_blocks_spec_ledger_items_logo" ADD VALUE 'handshake';
  ALTER TYPE "public"."enum_pages_blocks_spec_ledger_items_logo" ADD VALUE 'sparkle';
  ALTER TYPE "public"."enum__pages_v_blocks_phase_timeline_steps_phase" ADD VALUE '0' BEFORE '1';
  ALTER TYPE "public"."enum__pages_v_blocks_spec_ledger_items_logo" ADD VALUE 'google';
  ALTER TYPE "public"."enum__pages_v_blocks_spec_ledger_items_logo" ADD VALUE 'google-search-console';
  ALTER TYPE "public"."enum__pages_v_blocks_spec_ledger_items_logo" ADD VALUE 'claude';
  ALTER TYPE "public"."enum__pages_v_blocks_spec_ledger_items_logo" ADD VALUE 'handshake';
  ALTER TYPE "public"."enum__pages_v_blocks_spec_ledger_items_logo" ADD VALUE 'sparkle';
  CREATE TABLE "pp_plan_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"unit" varchar
  );
  
  CREATE TABLE "_pp_plan_figures_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"unit" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "accent_line" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "proof_line" varchar;
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "study_card_center_facts" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_spec_ledger" ADD COLUMN "tools_layout" "enum_pages_blocks_spec_ledger_tools_layout" DEFAULT 'row';
  ALTER TABLE "pages_blocks_service_sheet" ADD COLUMN "presentation" "enum_pages_blocks_service_sheet_presentation" DEFAULT 'page';
  ALTER TABLE "pages_blocks_service_sheet" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "pages_blocks_service_sheet" ADD COLUMN "eyebrow_tick" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_service_sheet" ADD COLUMN "heading" varchar;
  ALTER TABLE "pages_blocks_service_sheet" ADD COLUMN "accent_phrase" varchar;
  ALTER TABLE "pages_blocks_service_sheet" ADD COLUMN "intro" varchar;
  ALTER TABLE "pages_blocks_service_sheet" ADD COLUMN "numeral" varchar;
  ALTER TABLE "pages_blocks_service_sheet" ADD COLUMN "accent" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_pricing_plans" ADD COLUMN "marketing_next_link_type" "enum_pages_blocks_pricing_plans_marketing_next_link_type" DEFAULT 'internal';
  ALTER TABLE "pages_blocks_pricing_plans" ADD COLUMN "marketing_next_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_pricing_plans" ADD COLUMN "marketing_next_link_url" varchar;
  ALTER TABLE "pages_blocks_pricing_plans" ADD COLUMN "marketing_next_link_label" varchar;
  ALTER TABLE "pages_blocks_accordion_f_a_q" ADD COLUMN "layout" "enum_pages_blocks_accordion_f_a_q_layout" DEFAULT 'stacked';
  ALTER TABLE "pages_blocks_accordion_f_a_q" ADD COLUMN "intro" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "accent_line" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "proof_line" varchar;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "study_card_center_facts" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_spec_ledger" ADD COLUMN "tools_layout" "enum__pages_v_blocks_spec_ledger_tools_layout" DEFAULT 'row';
  ALTER TABLE "_pages_v_blocks_service_sheet" ADD COLUMN "presentation" "enum__pages_v_blocks_service_sheet_presentation" DEFAULT 'page';
  ALTER TABLE "_pages_v_blocks_service_sheet" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_service_sheet" ADD COLUMN "eyebrow_tick" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_service_sheet" ADD COLUMN "heading" varchar;
  ALTER TABLE "_pages_v_blocks_service_sheet" ADD COLUMN "accent_phrase" varchar;
  ALTER TABLE "_pages_v_blocks_service_sheet" ADD COLUMN "intro" varchar;
  ALTER TABLE "_pages_v_blocks_service_sheet" ADD COLUMN "numeral" varchar;
  ALTER TABLE "_pages_v_blocks_service_sheet" ADD COLUMN "accent" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_pricing_plans" ADD COLUMN "marketing_next_link_type" "enum__pages_v_blocks_pricing_plans_marketing_next_link_type" DEFAULT 'internal';
  ALTER TABLE "_pages_v_blocks_pricing_plans" ADD COLUMN "marketing_next_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_pricing_plans" ADD COLUMN "marketing_next_link_url" varchar;
  ALTER TABLE "_pages_v_blocks_pricing_plans" ADD COLUMN "marketing_next_link_label" varchar;
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" ADD COLUMN "layout" "enum__pages_v_blocks_accordion_f_a_q_layout" DEFAULT 'stacked';
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" ADD COLUMN "intro" varchar;
  ALTER TABLE "pp_plan_figures" ADD CONSTRAINT "pp_plan_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_pricing_plans_marketing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pp_plan_figures_v" ADD CONSTRAINT "_pp_plan_figures_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_pricing_plans_marketing_plans"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pp_plan_figures_order_idx" ON "pp_plan_figures" USING btree ("_order");
  CREATE INDEX "pp_plan_figures_parent_id_idx" ON "pp_plan_figures" USING btree ("_parent_id");
  CREATE INDEX "_pp_plan_figures_v_order_idx" ON "_pp_plan_figures_v" USING btree ("_order");
  CREATE INDEX "_pp_plan_figures_v_parent_id_idx" ON "_pp_plan_figures_v" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: `migrate:reset` runs every down oldest-first; once the initial
  // migration's down has dropped `users`, there is nothing left to undo here.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  // NOTE: the enum rebuilds below fail (and the whole down rolls back) while any
  // row still uses a value this migration added (step phase '0', tool logos
  // google / google-search-console / claude / handshake / sparkle). That is
  // deliberate: clear those values in the admin first; down never deletes content.
  await db.execute(sql`
   DROP TABLE "pp_plan_figures" CASCADE;
  DROP TABLE "_pp_plan_figures_v" CASCADE;
  ALTER TABLE "pages_blocks_phase_timeline_steps" ALTER COLUMN "phase" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_phase_timeline_steps" ALTER COLUMN "phase" SET DEFAULT '1'::text;
  DROP TYPE "public"."enum_pages_blocks_phase_timeline_steps_phase";
  CREATE TYPE "public"."enum_pages_blocks_phase_timeline_steps_phase" AS ENUM('1', '2', '3');
  ALTER TABLE "pages_blocks_phase_timeline_steps" ALTER COLUMN "phase" SET DEFAULT '1'::"public"."enum_pages_blocks_phase_timeline_steps_phase";
  ALTER TABLE "pages_blocks_phase_timeline_steps" ALTER COLUMN "phase" SET DATA TYPE "public"."enum_pages_blocks_phase_timeline_steps_phase" USING "phase"::"public"."enum_pages_blocks_phase_timeline_steps_phase";
  ALTER TABLE "pages_blocks_spec_ledger_items" ALTER COLUMN "logo" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_spec_ledger_items_logo";
  CREATE TYPE "public"."enum_pages_blocks_spec_ledger_items_logo" AS ENUM('shopify', 'instagram', 'facebook', 'tiktok', 'meta', 'microsoft-clarity');
  ALTER TABLE "pages_blocks_spec_ledger_items" ALTER COLUMN "logo" SET DATA TYPE "public"."enum_pages_blocks_spec_ledger_items_logo" USING "logo"::"public"."enum_pages_blocks_spec_ledger_items_logo";
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" ALTER COLUMN "phase" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" ALTER COLUMN "phase" SET DEFAULT '1'::text;
  DROP TYPE "public"."enum__pages_v_blocks_phase_timeline_steps_phase";
  CREATE TYPE "public"."enum__pages_v_blocks_phase_timeline_steps_phase" AS ENUM('1', '2', '3');
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" ALTER COLUMN "phase" SET DEFAULT '1'::"public"."enum__pages_v_blocks_phase_timeline_steps_phase";
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" ALTER COLUMN "phase" SET DATA TYPE "public"."enum__pages_v_blocks_phase_timeline_steps_phase" USING "phase"::"public"."enum__pages_v_blocks_phase_timeline_steps_phase";
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" ALTER COLUMN "logo" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_spec_ledger_items_logo";
  CREATE TYPE "public"."enum__pages_v_blocks_spec_ledger_items_logo" AS ENUM('shopify', 'instagram', 'facebook', 'tiktok', 'meta', 'microsoft-clarity');
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" ALTER COLUMN "logo" SET DATA TYPE "public"."enum__pages_v_blocks_spec_ledger_items_logo" USING "logo"::"public"."enum__pages_v_blocks_spec_ledger_items_logo";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "accent_line";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "proof_line";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "study_card_center_facts";
  ALTER TABLE "pages_blocks_spec_ledger" DROP COLUMN "tools_layout";
  ALTER TABLE "pages_blocks_service_sheet" DROP COLUMN "presentation";
  ALTER TABLE "pages_blocks_service_sheet" DROP COLUMN "eyebrow";
  ALTER TABLE "pages_blocks_service_sheet" DROP COLUMN "eyebrow_tick";
  ALTER TABLE "pages_blocks_service_sheet" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_service_sheet" DROP COLUMN "accent_phrase";
  ALTER TABLE "pages_blocks_service_sheet" DROP COLUMN "intro";
  ALTER TABLE "pages_blocks_service_sheet" DROP COLUMN "numeral";
  ALTER TABLE "pages_blocks_service_sheet" DROP COLUMN "accent";
  ALTER TABLE "pages_blocks_pricing_plans" DROP COLUMN "marketing_next_link_type";
  ALTER TABLE "pages_blocks_pricing_plans" DROP COLUMN "marketing_next_link_new_tab";
  ALTER TABLE "pages_blocks_pricing_plans" DROP COLUMN "marketing_next_link_url";
  ALTER TABLE "pages_blocks_pricing_plans" DROP COLUMN "marketing_next_link_label";
  ALTER TABLE "pages_blocks_accordion_f_a_q" DROP COLUMN "layout";
  ALTER TABLE "pages_blocks_accordion_f_a_q" DROP COLUMN "intro";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "accent_line";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "proof_line";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "study_card_center_facts";
  ALTER TABLE "_pages_v_blocks_spec_ledger" DROP COLUMN "tools_layout";
  ALTER TABLE "_pages_v_blocks_service_sheet" DROP COLUMN "presentation";
  ALTER TABLE "_pages_v_blocks_service_sheet" DROP COLUMN "eyebrow";
  ALTER TABLE "_pages_v_blocks_service_sheet" DROP COLUMN "eyebrow_tick";
  ALTER TABLE "_pages_v_blocks_service_sheet" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_service_sheet" DROP COLUMN "accent_phrase";
  ALTER TABLE "_pages_v_blocks_service_sheet" DROP COLUMN "intro";
  ALTER TABLE "_pages_v_blocks_service_sheet" DROP COLUMN "numeral";
  ALTER TABLE "_pages_v_blocks_service_sheet" DROP COLUMN "accent";
  ALTER TABLE "_pages_v_blocks_pricing_plans" DROP COLUMN "marketing_next_link_type";
  ALTER TABLE "_pages_v_blocks_pricing_plans" DROP COLUMN "marketing_next_link_new_tab";
  ALTER TABLE "_pages_v_blocks_pricing_plans" DROP COLUMN "marketing_next_link_url";
  ALTER TABLE "_pages_v_blocks_pricing_plans" DROP COLUMN "marketing_next_link_label";
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" DROP COLUMN "intro";
  DROP TYPE "public"."enum_pages_blocks_spec_ledger_tools_layout";
  DROP TYPE "public"."enum_pages_blocks_service_sheet_presentation";
  DROP TYPE "public"."enum_pages_blocks_pricing_plans_marketing_next_link_type";
  DROP TYPE "public"."enum_pages_blocks_accordion_f_a_q_layout";
  DROP TYPE "public"."enum__pages_v_blocks_spec_ledger_tools_layout";
  DROP TYPE "public"."enum__pages_v_blocks_service_sheet_presentation";
  DROP TYPE "public"."enum__pages_v_blocks_pricing_plans_marketing_next_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_layout";`)
}
