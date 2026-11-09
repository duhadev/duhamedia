/**
 * Home B (homepage sections redesign, 2026-11-09), additive only, pages + _pages_v:
 * ProofStrip variant 'capacity'; scarcity key 'spots' on the scarcity global's key
 * enum and on every scarcityRef enum (FinalCTA capacity, OfferBlock capacity,
 * ProofStrip capacityStatement, ReviewWall inserts statement, LinkStack primary
 * capacity); TwoTrackPanels intro + panel accentPhrase + panel stats/points tables;
 * PhaseTimeline gridLayout + anchorId; TeamIntro presentation + moreLink;
 * SpecLedger toolsLayout 'grid' + item tag + linkTile. Data lives in
 * 20261109_151000_home_b, which sorts after this file (Migration order rule).
 */
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_phase_timeline_grid_layout" AS ENUM('stacked', 'row');
  CREATE TYPE "public"."enum_pages_blocks_team_intro_presentation" AS ENUM('standard', 'section');
  CREATE TYPE "public"."enum_pages_blocks_team_intro_more_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_spec_ledger_items_tag" AS ENUM('none', 'build', 'grow');
  CREATE TYPE "public"."enum_pages_blocks_spec_ledger_link_tile_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_phase_timeline_grid_layout" AS ENUM('stacked', 'row');
  CREATE TYPE "public"."enum__pages_v_blocks_team_intro_presentation" AS ENUM('standard', 'section');
  CREATE TYPE "public"."enum__pages_v_blocks_team_intro_more_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_spec_ledger_items_tag" AS ENUM('none', 'build', 'grow');
  CREATE TYPE "public"."enum__pages_v_blocks_spec_ledger_link_tile_link_type" AS ENUM('internal', 'custom');
  ALTER TYPE "public"."enum_pages_blocks_final_c_t_a_capacity" ADD VALUE 'spots' BEFORE 'builds-line';
  ALTER TYPE "public"."enum_pages_blocks_offer_block_capacity" ADD VALUE 'spots' BEFORE 'builds-line';
  ALTER TYPE "public"."enum_pages_blocks_proof_strip_variant" ADD VALUE 'capacity';
  ALTER TYPE "public"."enum_pages_blocks_proof_strip_capacity_statement" ADD VALUE 'spots' BEFORE 'builds-line';
  ALTER TYPE "public"."enum_pages_blocks_review_wall_inserts_statement" ADD VALUE 'spots' BEFORE 'builds-line';
  ALTER TYPE "public"."enum_pages_blocks_spec_ledger_tools_layout" ADD VALUE 'grid';
  ALTER TYPE "public"."enum_pages_blocks_link_stack_primary_capacity" ADD VALUE 'spots' BEFORE 'builds-line';
  ALTER TYPE "public"."enum__pages_v_blocks_final_c_t_a_capacity" ADD VALUE 'spots' BEFORE 'builds-line';
  ALTER TYPE "public"."enum__pages_v_blocks_offer_block_capacity" ADD VALUE 'spots' BEFORE 'builds-line';
  ALTER TYPE "public"."enum__pages_v_blocks_proof_strip_variant" ADD VALUE 'capacity';
  ALTER TYPE "public"."enum__pages_v_blocks_proof_strip_capacity_statement" ADD VALUE 'spots' BEFORE 'builds-line';
  ALTER TYPE "public"."enum__pages_v_blocks_review_wall_inserts_statement" ADD VALUE 'spots' BEFORE 'builds-line';
  ALTER TYPE "public"."enum__pages_v_blocks_spec_ledger_tools_layout" ADD VALUE 'grid';
  ALTER TYPE "public"."enum__pages_v_blocks_link_stack_primary_capacity" ADD VALUE 'spots' BEFORE 'builds-line';
  ALTER TYPE "public"."enum_scarcity_statements_key" ADD VALUE 'spots' BEFORE 'builds-line';
  CREATE TABLE "pages_blocks_two_track_panels_panels_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"accent" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_two_track_panels_panels_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_two_track_panels_panels_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"accent" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_two_track_panels_panels_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"lead" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_two_track_panels_panels" ADD COLUMN "accent_phrase" varchar;
  ALTER TABLE "pages_blocks_two_track_panels" ADD COLUMN "intro" varchar;
  ALTER TABLE "pages_blocks_phase_timeline" ADD COLUMN "grid_layout" "enum_pages_blocks_phase_timeline_grid_layout" DEFAULT 'stacked';
  ALTER TABLE "pages_blocks_phase_timeline" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_team_intro" ADD COLUMN "presentation" "enum_pages_blocks_team_intro_presentation" DEFAULT 'standard';
  ALTER TABLE "pages_blocks_team_intro" ADD COLUMN "more_link_type" "enum_pages_blocks_team_intro_more_link_type" DEFAULT 'internal';
  ALTER TABLE "pages_blocks_team_intro" ADD COLUMN "more_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_team_intro" ADD COLUMN "more_link_url" varchar;
  ALTER TABLE "pages_blocks_team_intro" ADD COLUMN "more_link_label" varchar;
  ALTER TABLE "pages_blocks_spec_ledger_items" ADD COLUMN "tag" "enum_pages_blocks_spec_ledger_items_tag" DEFAULT 'none';
  ALTER TABLE "pages_blocks_spec_ledger" ADD COLUMN "link_tile_link_type" "enum_pages_blocks_spec_ledger_link_tile_link_type" DEFAULT 'internal';
  ALTER TABLE "pages_blocks_spec_ledger" ADD COLUMN "link_tile_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_spec_ledger" ADD COLUMN "link_tile_link_url" varchar;
  ALTER TABLE "pages_blocks_spec_ledger" ADD COLUMN "link_tile_link_label" varchar;
  ALTER TABLE "pages_blocks_spec_ledger" ADD COLUMN "link_tile_short_label" varchar;
  ALTER TABLE "_pages_v_blocks_two_track_panels_panels" ADD COLUMN "accent_phrase" varchar;
  ALTER TABLE "_pages_v_blocks_two_track_panels" ADD COLUMN "intro" varchar;
  ALTER TABLE "_pages_v_blocks_phase_timeline" ADD COLUMN "grid_layout" "enum__pages_v_blocks_phase_timeline_grid_layout" DEFAULT 'stacked';
  ALTER TABLE "_pages_v_blocks_phase_timeline" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_team_intro" ADD COLUMN "presentation" "enum__pages_v_blocks_team_intro_presentation" DEFAULT 'standard';
  ALTER TABLE "_pages_v_blocks_team_intro" ADD COLUMN "more_link_type" "enum__pages_v_blocks_team_intro_more_link_type" DEFAULT 'internal';
  ALTER TABLE "_pages_v_blocks_team_intro" ADD COLUMN "more_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_team_intro" ADD COLUMN "more_link_url" varchar;
  ALTER TABLE "_pages_v_blocks_team_intro" ADD COLUMN "more_link_label" varchar;
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" ADD COLUMN "tag" "enum__pages_v_blocks_spec_ledger_items_tag" DEFAULT 'none';
  ALTER TABLE "_pages_v_blocks_spec_ledger" ADD COLUMN "link_tile_link_type" "enum__pages_v_blocks_spec_ledger_link_tile_link_type" DEFAULT 'internal';
  ALTER TABLE "_pages_v_blocks_spec_ledger" ADD COLUMN "link_tile_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_spec_ledger" ADD COLUMN "link_tile_link_url" varchar;
  ALTER TABLE "_pages_v_blocks_spec_ledger" ADD COLUMN "link_tile_link_label" varchar;
  ALTER TABLE "_pages_v_blocks_spec_ledger" ADD COLUMN "link_tile_short_label" varchar;
  ALTER TABLE "pages_blocks_two_track_panels_panels_stats" ADD CONSTRAINT "pages_blocks_two_track_panels_panels_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_two_track_panels_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_track_panels_panels_points" ADD CONSTRAINT "pages_blocks_two_track_panels_panels_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_two_track_panels_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_track_panels_panels_stats" ADD CONSTRAINT "_pages_v_blocks_two_track_panels_panels_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_two_track_panels_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_track_panels_panels_points" ADD CONSTRAINT "_pages_v_blocks_two_track_panels_panels_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_two_track_panels_panels"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_two_track_panels_panels_stats_order_idx" ON "pages_blocks_two_track_panels_panels_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_two_track_panels_panels_stats_parent_id_idx" ON "pages_blocks_two_track_panels_panels_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_two_track_panels_panels_points_order_idx" ON "pages_blocks_two_track_panels_panels_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_two_track_panels_panels_points_parent_id_idx" ON "pages_blocks_two_track_panels_panels_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_two_track_panels_panels_stats_order_idx" ON "_pages_v_blocks_two_track_panels_panels_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_two_track_panels_panels_stats_parent_id_idx" ON "_pages_v_blocks_two_track_panels_panels_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_two_track_panels_panels_points_order_idx" ON "_pages_v_blocks_two_track_panels_panels_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_two_track_panels_panels_points_parent_id_idx" ON "_pages_v_blocks_two_track_panels_panels_points" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: `migrate:reset` runs every down oldest-first; once the initial
  // migration's down has dropped `users`, there is nothing left to undo here.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  // NOTE: the enum rebuilds below fail (and the whole down rolls back) while any
  // row still uses a value this migration added (proof strip 'capacity', tools
  // layout 'grid', scarcity key 'spots', including the scarcity global's 'spots'
  // row written by 20261109_151000_home_b). That is deliberate: clear those
  // values in the admin first; down never deletes content.
  await db.execute(sql`
   DROP TABLE "pages_blocks_two_track_panels_panels_stats" CASCADE;
  DROP TABLE "pages_blocks_two_track_panels_panels_points" CASCADE;
  DROP TABLE "_pages_v_blocks_two_track_panels_panels_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_two_track_panels_panels_points" CASCADE;
  ALTER TABLE "pages_blocks_final_c_t_a" ALTER COLUMN "capacity" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_final_c_t_a" ALTER COLUMN "capacity" SET DEFAULT 'builds-line'::text;
  DROP TYPE "public"."enum_pages_blocks_final_c_t_a_capacity";
  CREATE TYPE "public"."enum_pages_blocks_final_c_t_a_capacity" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  ALTER TABLE "pages_blocks_final_c_t_a" ALTER COLUMN "capacity" SET DEFAULT 'builds-line'::"public"."enum_pages_blocks_final_c_t_a_capacity";
  ALTER TABLE "pages_blocks_final_c_t_a" ALTER COLUMN "capacity" SET DATA TYPE "public"."enum_pages_blocks_final_c_t_a_capacity" USING "capacity"::"public"."enum_pages_blocks_final_c_t_a_capacity";
  ALTER TABLE "pages_blocks_offer_block" ALTER COLUMN "capacity" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_offer_block" ALTER COLUMN "capacity" SET DEFAULT 'offer-line'::text;
  DROP TYPE "public"."enum_pages_blocks_offer_block_capacity";
  CREATE TYPE "public"."enum_pages_blocks_offer_block_capacity" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  ALTER TABLE "pages_blocks_offer_block" ALTER COLUMN "capacity" SET DEFAULT 'offer-line'::"public"."enum_pages_blocks_offer_block_capacity";
  ALTER TABLE "pages_blocks_offer_block" ALTER COLUMN "capacity" SET DATA TYPE "public"."enum_pages_blocks_offer_block_capacity" USING "capacity"::"public"."enum_pages_blocks_offer_block_capacity";
  ALTER TABLE "pages_blocks_proof_strip" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_proof_strip" ALTER COLUMN "variant" SET DEFAULT 'scarcity'::text;
  DROP TYPE "public"."enum_pages_blocks_proof_strip_variant";
  CREATE TYPE "public"."enum_pages_blocks_proof_strip_variant" AS ENUM('scarcity', 'metrics');
  ALTER TABLE "pages_blocks_proof_strip" ALTER COLUMN "variant" SET DEFAULT 'scarcity'::"public"."enum_pages_blocks_proof_strip_variant";
  ALTER TABLE "pages_blocks_proof_strip" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_proof_strip_variant" USING "variant"::"public"."enum_pages_blocks_proof_strip_variant";
  ALTER TABLE "pages_blocks_proof_strip" ALTER COLUMN "capacity_statement" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_proof_strip" ALTER COLUMN "capacity_statement" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum_pages_blocks_proof_strip_capacity_statement";
  CREATE TYPE "public"."enum_pages_blocks_proof_strip_capacity_statement" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  ALTER TABLE "pages_blocks_proof_strip" ALTER COLUMN "capacity_statement" SET DEFAULT 'none'::"public"."enum_pages_blocks_proof_strip_capacity_statement";
  ALTER TABLE "pages_blocks_proof_strip" ALTER COLUMN "capacity_statement" SET DATA TYPE "public"."enum_pages_blocks_proof_strip_capacity_statement" USING "capacity_statement"::"public"."enum_pages_blocks_proof_strip_capacity_statement";
  ALTER TABLE "pages_blocks_review_wall_inserts" ALTER COLUMN "statement" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_review_wall_inserts" ALTER COLUMN "statement" SET DEFAULT 'capacity'::text;
  DROP TYPE "public"."enum_pages_blocks_review_wall_inserts_statement";
  CREATE TYPE "public"."enum_pages_blocks_review_wall_inserts_statement" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  ALTER TABLE "pages_blocks_review_wall_inserts" ALTER COLUMN "statement" SET DEFAULT 'capacity'::"public"."enum_pages_blocks_review_wall_inserts_statement";
  ALTER TABLE "pages_blocks_review_wall_inserts" ALTER COLUMN "statement" SET DATA TYPE "public"."enum_pages_blocks_review_wall_inserts_statement" USING "statement"::"public"."enum_pages_blocks_review_wall_inserts_statement";
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DEFAULT 'row'::text;
  DROP TYPE "public"."enum_pages_blocks_spec_ledger_tools_layout";
  CREATE TYPE "public"."enum_pages_blocks_spec_ledger_tools_layout" AS ENUM('row', 'tiles');
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DEFAULT 'row'::"public"."enum_pages_blocks_spec_ledger_tools_layout";
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DATA TYPE "public"."enum_pages_blocks_spec_ledger_tools_layout" USING "tools_layout"::"public"."enum_pages_blocks_spec_ledger_tools_layout";
  ALTER TABLE "pages_blocks_link_stack" ALTER COLUMN "primary_capacity" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_link_stack" ALTER COLUMN "primary_capacity" SET DEFAULT 'slots-line'::text;
  DROP TYPE "public"."enum_pages_blocks_link_stack_primary_capacity";
  CREATE TYPE "public"."enum_pages_blocks_link_stack_primary_capacity" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  ALTER TABLE "pages_blocks_link_stack" ALTER COLUMN "primary_capacity" SET DEFAULT 'slots-line'::"public"."enum_pages_blocks_link_stack_primary_capacity";
  ALTER TABLE "pages_blocks_link_stack" ALTER COLUMN "primary_capacity" SET DATA TYPE "public"."enum_pages_blocks_link_stack_primary_capacity" USING "primary_capacity"::"public"."enum_pages_blocks_link_stack_primary_capacity";
  ALTER TABLE "_pages_v_blocks_final_c_t_a" ALTER COLUMN "capacity" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_final_c_t_a" ALTER COLUMN "capacity" SET DEFAULT 'builds-line'::text;
  DROP TYPE "public"."enum__pages_v_blocks_final_c_t_a_capacity";
  CREATE TYPE "public"."enum__pages_v_blocks_final_c_t_a_capacity" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  ALTER TABLE "_pages_v_blocks_final_c_t_a" ALTER COLUMN "capacity" SET DEFAULT 'builds-line'::"public"."enum__pages_v_blocks_final_c_t_a_capacity";
  ALTER TABLE "_pages_v_blocks_final_c_t_a" ALTER COLUMN "capacity" SET DATA TYPE "public"."enum__pages_v_blocks_final_c_t_a_capacity" USING "capacity"::"public"."enum__pages_v_blocks_final_c_t_a_capacity";
  ALTER TABLE "_pages_v_blocks_offer_block" ALTER COLUMN "capacity" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_offer_block" ALTER COLUMN "capacity" SET DEFAULT 'offer-line'::text;
  DROP TYPE "public"."enum__pages_v_blocks_offer_block_capacity";
  CREATE TYPE "public"."enum__pages_v_blocks_offer_block_capacity" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  ALTER TABLE "_pages_v_blocks_offer_block" ALTER COLUMN "capacity" SET DEFAULT 'offer-line'::"public"."enum__pages_v_blocks_offer_block_capacity";
  ALTER TABLE "_pages_v_blocks_offer_block" ALTER COLUMN "capacity" SET DATA TYPE "public"."enum__pages_v_blocks_offer_block_capacity" USING "capacity"::"public"."enum__pages_v_blocks_offer_block_capacity";
  ALTER TABLE "_pages_v_blocks_proof_strip" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_proof_strip" ALTER COLUMN "variant" SET DEFAULT 'scarcity'::text;
  DROP TYPE "public"."enum__pages_v_blocks_proof_strip_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_proof_strip_variant" AS ENUM('scarcity', 'metrics');
  ALTER TABLE "_pages_v_blocks_proof_strip" ALTER COLUMN "variant" SET DEFAULT 'scarcity'::"public"."enum__pages_v_blocks_proof_strip_variant";
  ALTER TABLE "_pages_v_blocks_proof_strip" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_proof_strip_variant" USING "variant"::"public"."enum__pages_v_blocks_proof_strip_variant";
  ALTER TABLE "_pages_v_blocks_proof_strip" ALTER COLUMN "capacity_statement" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_proof_strip" ALTER COLUMN "capacity_statement" SET DEFAULT 'none'::text;
  DROP TYPE "public"."enum__pages_v_blocks_proof_strip_capacity_statement";
  CREATE TYPE "public"."enum__pages_v_blocks_proof_strip_capacity_statement" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  ALTER TABLE "_pages_v_blocks_proof_strip" ALTER COLUMN "capacity_statement" SET DEFAULT 'none'::"public"."enum__pages_v_blocks_proof_strip_capacity_statement";
  ALTER TABLE "_pages_v_blocks_proof_strip" ALTER COLUMN "capacity_statement" SET DATA TYPE "public"."enum__pages_v_blocks_proof_strip_capacity_statement" USING "capacity_statement"::"public"."enum__pages_v_blocks_proof_strip_capacity_statement";
  ALTER TABLE "_pages_v_blocks_review_wall_inserts" ALTER COLUMN "statement" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_review_wall_inserts" ALTER COLUMN "statement" SET DEFAULT 'capacity'::text;
  DROP TYPE "public"."enum__pages_v_blocks_review_wall_inserts_statement";
  CREATE TYPE "public"."enum__pages_v_blocks_review_wall_inserts_statement" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  ALTER TABLE "_pages_v_blocks_review_wall_inserts" ALTER COLUMN "statement" SET DEFAULT 'capacity'::"public"."enum__pages_v_blocks_review_wall_inserts_statement";
  ALTER TABLE "_pages_v_blocks_review_wall_inserts" ALTER COLUMN "statement" SET DATA TYPE "public"."enum__pages_v_blocks_review_wall_inserts_statement" USING "statement"::"public"."enum__pages_v_blocks_review_wall_inserts_statement";
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DEFAULT 'row'::text;
  DROP TYPE "public"."enum__pages_v_blocks_spec_ledger_tools_layout";
  CREATE TYPE "public"."enum__pages_v_blocks_spec_ledger_tools_layout" AS ENUM('row', 'tiles');
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DEFAULT 'row'::"public"."enum__pages_v_blocks_spec_ledger_tools_layout";
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "tools_layout" SET DATA TYPE "public"."enum__pages_v_blocks_spec_ledger_tools_layout" USING "tools_layout"::"public"."enum__pages_v_blocks_spec_ledger_tools_layout";
  ALTER TABLE "_pages_v_blocks_link_stack" ALTER COLUMN "primary_capacity" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_link_stack" ALTER COLUMN "primary_capacity" SET DEFAULT 'slots-line'::text;
  DROP TYPE "public"."enum__pages_v_blocks_link_stack_primary_capacity";
  CREATE TYPE "public"."enum__pages_v_blocks_link_stack_primary_capacity" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  ALTER TABLE "_pages_v_blocks_link_stack" ALTER COLUMN "primary_capacity" SET DEFAULT 'slots-line'::"public"."enum__pages_v_blocks_link_stack_primary_capacity";
  ALTER TABLE "_pages_v_blocks_link_stack" ALTER COLUMN "primary_capacity" SET DATA TYPE "public"."enum__pages_v_blocks_link_stack_primary_capacity" USING "primary_capacity"::"public"."enum__pages_v_blocks_link_stack_primary_capacity";
  ALTER TABLE "scarcity_statements" ALTER COLUMN "key" SET DATA TYPE text;
  DROP TYPE "public"."enum_scarcity_statements_key";
  CREATE TYPE "public"."enum_scarcity_statements_key" AS ENUM('ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  ALTER TABLE "scarcity_statements" ALTER COLUMN "key" SET DATA TYPE "public"."enum_scarcity_statements_key" USING "key"::"public"."enum_scarcity_statements_key";
  ALTER TABLE "pages_blocks_two_track_panels_panels" DROP COLUMN "accent_phrase";
  ALTER TABLE "pages_blocks_two_track_panels" DROP COLUMN "intro";
  ALTER TABLE "pages_blocks_phase_timeline" DROP COLUMN "grid_layout";
  ALTER TABLE "pages_blocks_phase_timeline" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_team_intro" DROP COLUMN "presentation";
  ALTER TABLE "pages_blocks_team_intro" DROP COLUMN "more_link_type";
  ALTER TABLE "pages_blocks_team_intro" DROP COLUMN "more_link_new_tab";
  ALTER TABLE "pages_blocks_team_intro" DROP COLUMN "more_link_url";
  ALTER TABLE "pages_blocks_team_intro" DROP COLUMN "more_link_label";
  ALTER TABLE "pages_blocks_spec_ledger_items" DROP COLUMN "tag";
  ALTER TABLE "pages_blocks_spec_ledger" DROP COLUMN "link_tile_link_type";
  ALTER TABLE "pages_blocks_spec_ledger" DROP COLUMN "link_tile_link_new_tab";
  ALTER TABLE "pages_blocks_spec_ledger" DROP COLUMN "link_tile_link_url";
  ALTER TABLE "pages_blocks_spec_ledger" DROP COLUMN "link_tile_link_label";
  ALTER TABLE "pages_blocks_spec_ledger" DROP COLUMN "link_tile_short_label";
  ALTER TABLE "_pages_v_blocks_two_track_panels_panels" DROP COLUMN "accent_phrase";
  ALTER TABLE "_pages_v_blocks_two_track_panels" DROP COLUMN "intro";
  ALTER TABLE "_pages_v_blocks_phase_timeline" DROP COLUMN "grid_layout";
  ALTER TABLE "_pages_v_blocks_phase_timeline" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_team_intro" DROP COLUMN "presentation";
  ALTER TABLE "_pages_v_blocks_team_intro" DROP COLUMN "more_link_type";
  ALTER TABLE "_pages_v_blocks_team_intro" DROP COLUMN "more_link_new_tab";
  ALTER TABLE "_pages_v_blocks_team_intro" DROP COLUMN "more_link_url";
  ALTER TABLE "_pages_v_blocks_team_intro" DROP COLUMN "more_link_label";
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" DROP COLUMN "tag";
  ALTER TABLE "_pages_v_blocks_spec_ledger" DROP COLUMN "link_tile_link_type";
  ALTER TABLE "_pages_v_blocks_spec_ledger" DROP COLUMN "link_tile_link_new_tab";
  ALTER TABLE "_pages_v_blocks_spec_ledger" DROP COLUMN "link_tile_link_url";
  ALTER TABLE "_pages_v_blocks_spec_ledger" DROP COLUMN "link_tile_link_label";
  ALTER TABLE "_pages_v_blocks_spec_ledger" DROP COLUMN "link_tile_short_label";
  DROP TYPE "public"."enum_pages_blocks_phase_timeline_grid_layout";
  DROP TYPE "public"."enum_pages_blocks_team_intro_presentation";
  DROP TYPE "public"."enum_pages_blocks_team_intro_more_link_type";
  DROP TYPE "public"."enum_pages_blocks_spec_ledger_items_tag";
  DROP TYPE "public"."enum_pages_blocks_spec_ledger_link_tile_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_phase_timeline_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_team_intro_presentation";
  DROP TYPE "public"."enum__pages_v_blocks_team_intro_more_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_spec_ledger_items_tag";
  DROP TYPE "public"."enum__pages_v_blocks_spec_ledger_link_tile_link_type";`)
}
