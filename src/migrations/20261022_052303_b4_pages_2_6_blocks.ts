import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_media_frame" AS ENUM('none', 'browser', 'full-bleed');
  CREATE TYPE "public"."enum_pages_blocks_case_study_cards_track" AS ENUM('build', 'growth', 'build-and-growth', 'handover');
  CREATE TYPE "public"."enum_pages_blocks_case_study_cards_tone" AS ENUM('light', 'grey');
  CREATE TYPE "public"."enum_pages_blocks_metric_event_variant" AS ENUM('table');
  CREATE TYPE "public"."enum_pages_blocks_testimonial_row_client_voice_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_phase_timeline_phases_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_phase_timeline_cta_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_rich_content_variant" AS ENUM('article');
  CREATE TYPE "public"."enum_pages_blocks_spec_ledger_variant" AS ENUM('cards', 'expandable', 'signal-flow');
  CREATE TYPE "public"."enum_pages_blocks_spec_ledger_card_layout" AS ENUM('anatomy', 'feature');
  CREATE TYPE "public"."enum_pages_blocks_spec_ledger_tone" AS ENUM('auto', 'light', 'grey');
  CREATE TYPE "public"."enum_pages_blocks_accordion_f_a_q_variant" AS ENUM('mini');
  CREATE TYPE "public"."enum_pages_blocks_accordion_f_a_q_source" AS ENUM('selected', 'category');
  CREATE TYPE "public"."enum_pages_blocks_accordion_f_a_q_category" AS ENUM('pricing-contracts', 'builds', 'marketing', 'process-trust');
  CREATE TYPE "public"."enum_pages_blocks_accordion_f_a_q_all_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_media_frame" AS ENUM('none', 'browser', 'full-bleed');
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cards_track" AS ENUM('build', 'growth', 'build-and-growth', 'handover');
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cards_tone" AS ENUM('light', 'grey');
  CREATE TYPE "public"."enum__pages_v_blocks_metric_event_variant" AS ENUM('table');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_row_client_voice_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_phase_timeline_phases_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_phase_timeline_cta_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_content_variant" AS ENUM('article');
  CREATE TYPE "public"."enum__pages_v_blocks_spec_ledger_variant" AS ENUM('cards', 'expandable', 'signal-flow');
  CREATE TYPE "public"."enum__pages_v_blocks_spec_ledger_card_layout" AS ENUM('anatomy', 'feature');
  CREATE TYPE "public"."enum__pages_v_blocks_spec_ledger_tone" AS ENUM('auto', 'light', 'grey');
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_variant" AS ENUM('mini');
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_source" AS ENUM('selected', 'category');
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_category" AS ENUM('pricing-contracts', 'builds', 'marketing', 'process-trust');
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_all_link_type" AS ENUM('internal', 'custom');
  ALTER TYPE "public"."enum_pages_blocks_hero_variant" ADD VALUE 'service';
  ALTER TYPE "public"."enum_pages_blocks_hero_variant" ADD VALUE 'article';
  ALTER TYPE "public"."enum_pages_blocks_case_study_cards_layout" ADD VALUE 'ledger';
  ALTER TYPE "public"."enum_pages_blocks_case_study_cards_layout" ADD VALUE 'next-link';
  ALTER TYPE "public"."enum_pages_blocks_case_study_cards_source" ADD VALUE 'track' BEFORE 'manual';
  ALTER TYPE "public"."enum_pages_blocks_case_study_cards_fallback_mode" ADD VALUE 'testimonials';
  ALTER TYPE "public"."enum_pages_blocks_case_study_cards_fallback_mode" ADD VALUE 'metric-strip';
  ALTER TYPE "public"."enum_pages_blocks_testimonial_row_variant" ADD VALUE 'client-voice';
  ALTER TYPE "public"."enum_pages_blocks_two_track_panels_variant" ADD VALUE 'contrast';
  ALTER TYPE "public"."enum_pages_blocks_two_track_panels_variant" ADD VALUE 'primary-secondary';
  ALTER TYPE "public"."enum_pages_blocks_two_track_panels_variant" ADD VALUE 'doors';
  ALTER TYPE "public"."enum_pages_blocks_phase_timeline_variant" ADD VALUE 'arc';
  ALTER TYPE "public"."enum_pages_blocks_phase_timeline_variant" ADD VALUE 'steps';
  ALTER TYPE "public"."enum_pages_blocks_phase_timeline_variant" ADD VALUE 'build-run';
  ALTER TYPE "public"."enum_pages_blocks_phase_timeline_variant" ADD VALUE 'engine-rollout';
  ALTER TYPE "public"."enum__pages_v_blocks_hero_variant" ADD VALUE 'service';
  ALTER TYPE "public"."enum__pages_v_blocks_hero_variant" ADD VALUE 'article';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_cards_layout" ADD VALUE 'ledger';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_cards_layout" ADD VALUE 'next-link';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_cards_source" ADD VALUE 'track' BEFORE 'manual';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_cards_fallback_mode" ADD VALUE 'testimonials';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_cards_fallback_mode" ADD VALUE 'metric-strip';
  ALTER TYPE "public"."enum__pages_v_blocks_testimonial_row_variant" ADD VALUE 'client-voice';
  ALTER TYPE "public"."enum__pages_v_blocks_two_track_panels_variant" ADD VALUE 'contrast';
  ALTER TYPE "public"."enum__pages_v_blocks_two_track_panels_variant" ADD VALUE 'primary-secondary';
  ALTER TYPE "public"."enum__pages_v_blocks_two_track_panels_variant" ADD VALUE 'doors';
  ALTER TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" ADD VALUE 'arc';
  ALTER TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" ADD VALUE 'steps';
  ALTER TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" ADD VALUE 'build-run';
  ALTER TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" ADD VALUE 'engine-rollout';
  CREATE TABLE "pages_blocks_hero_breadcrumb" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_phase_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_case_study_cards_track" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_case_study_cards_track",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_metric_event_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"accent" boolean DEFAULT false,
  	"baseline" varchar,
  	"change" varchar
  );
  
  CREATE TABLE "pages_blocks_metric_event" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_metric_event_variant" DEFAULT 'table',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"columns_measure" varchar,
  	"columns_baseline" varchar,
  	"columns_after" varchar,
  	"columns_change" varchar,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_phase_timeline_steps_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_rich_content_variant" DEFAULT 'article',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT true,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"number_sections" boolean DEFAULT true,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_spec_ledger_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"title" varchar,
  	"line" varchar,
  	"image_id" integer,
  	"what_label" varchar,
  	"what" varchar,
  	"proof_label" varchar,
  	"proof" varchar
  );
  
  CREATE TABLE "pages_blocks_spec_ledger" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_spec_ledger_variant" DEFAULT 'cards',
  	"card_layout" "enum_pages_blocks_spec_ledger_card_layout" DEFAULT 'anatomy',
  	"tone" "enum_pages_blocks_spec_ledger_tone" DEFAULT 'auto',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"note" varchar,
  	"first_open" boolean DEFAULT true,
  	"hub_kicker" varchar,
  	"hub_heading" varchar,
  	"hub_body" varchar,
  	"hub_note" varchar,
  	"hub_image_id" integer,
  	"pricing_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_accordion_f_a_q" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_accordion_f_a_q_variant" DEFAULT 'mini',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT true,
  	"heading" varchar,
  	"source" "enum_pages_blocks_accordion_f_a_q_source" DEFAULT 'selected',
  	"category" "enum_pages_blocks_accordion_f_a_q_category",
  	"limit" numeric DEFAULT 6,
  	"open_first" boolean DEFAULT false,
  	"all_link_type" "enum_pages_blocks_accordion_f_a_q_all_link_type" DEFAULT 'internal',
  	"all_link_new_tab" boolean DEFAULT false,
  	"all_link_url" varchar,
  	"all_link_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_breadcrumb" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_phase_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_case_study_cards_track" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_case_study_cards_track",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_metric_event_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"accent" boolean DEFAULT false,
  	"baseline" varchar,
  	"change" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_metric_event" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_metric_event_variant" DEFAULT 'table',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"columns_measure" varchar,
  	"columns_baseline" varchar,
  	"columns_after" varchar,
  	"columns_change" varchar,
  	"note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_phase_timeline_steps_outcomes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_rich_content_variant" DEFAULT 'article',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT true,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"number_sections" boolean DEFAULT true,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_spec_ledger_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar,
  	"title" varchar,
  	"line" varchar,
  	"image_id" integer,
  	"what_label" varchar,
  	"what" varchar,
  	"proof_label" varchar,
  	"proof" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_spec_ledger" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_spec_ledger_variant" DEFAULT 'cards',
  	"card_layout" "enum__pages_v_blocks_spec_ledger_card_layout" DEFAULT 'anatomy',
  	"tone" "enum__pages_v_blocks_spec_ledger_tone" DEFAULT 'auto',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"note" varchar,
  	"first_open" boolean DEFAULT true,
  	"hub_kicker" varchar,
  	"hub_heading" varchar,
  	"hub_body" varchar,
  	"hub_note" varchar,
  	"hub_image_id" integer,
  	"pricing_note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_f_a_q" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_accordion_f_a_q_variant" DEFAULT 'mini',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT true,
  	"heading" varchar,
  	"source" "enum__pages_v_blocks_accordion_f_a_q_source" DEFAULT 'selected',
  	"category" "enum__pages_v_blocks_accordion_f_a_q_category",
  	"limit" numeric DEFAULT 6,
  	"open_first" boolean DEFAULT false,
  	"all_link_type" "enum__pages_v_blocks_accordion_f_a_q_all_link_type" DEFAULT 'internal',
  	"all_link_new_tab" boolean DEFAULT false,
  	"all_link_url" varchar,
  	"all_link_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "result_metric_value" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "result_metric_label" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "result_metric_sub" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "result_metric_accent" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "meta_line" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "summary_label" varchar DEFAULT 'In short';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "summary_body" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "media_id" integer;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "media_frame" "enum_pages_blocks_hero_media_frame" DEFAULT 'none';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "tone" "enum_pages_blocks_case_study_cards_tone" DEFAULT 'light';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "page_size" numeric DEFAULT 6;
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "load_more" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "load_more_label" varchar DEFAULT 'Load more studies';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "load_more_loading_label" varchar DEFAULT 'Loading…';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "load_more_error_label" varchar DEFAULT 'Could not load more studies. Try again.';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "ledger_labels_number" varchar DEFAULT '№';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "ledger_labels_client" varchar DEFAULT 'Client';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "ledger_labels_summary" varchar DEFAULT 'What was leaking / what we changed';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "ledger_labels_metric" varchar DEFAULT 'Returned';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "ledger_labels_kind" varchar DEFAULT 'Case study';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "ledger_labels_read_label" varchar DEFAULT 'Read the study →';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "next_labels_label" varchar DEFAULT 'Next study';
  ALTER TABLE "pages_blocks_case_study_cards" ADD COLUMN "next_labels_read_label" varchar DEFAULT 'Read it →';
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "client_voice_testimonial_id" integer;
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "client_voice_do_differently" jsonb;
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "client_voice_phase_mapping" varchar;
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "client_voice_link_type" "enum_pages_blocks_testimonial_row_client_voice_link_type" DEFAULT 'internal';
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "client_voice_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "client_voice_link_url" varchar;
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "client_voice_link_label" varchar;
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "differently_number" varchar DEFAULT '04';
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "differently_heading" varchar DEFAULT 'What we''d do differently';
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "phase_label" varchar DEFAULT 'How this maps to our phases';
  ALTER TABLE "pages_blocks_two_track_panels_panels" ADD COLUMN "claim" varchar;
  ALTER TABLE "pages_blocks_two_track_panels" ADD COLUMN "conclusion" varchar;
  ALTER TABLE "pages_blocks_phase_timeline_phases" ADD COLUMN "link_type" "enum_pages_blocks_phase_timeline_phases_link_type" DEFAULT 'internal';
  ALTER TABLE "pages_blocks_phase_timeline_phases" ADD COLUMN "link_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_phase_timeline_phases" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_phase_timeline_phases" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_phase_timeline_steps" ADD COLUMN "tag" varchar;
  ALTER TABLE "pages_blocks_phase_timeline_steps" ADD COLUMN "is_sign_off" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_phase_timeline" ADD COLUMN "cta_type" "enum_pages_blocks_phase_timeline_cta_type" DEFAULT 'internal';
  ALTER TABLE "pages_blocks_phase_timeline" ADD COLUMN "cta_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_phase_timeline" ADD COLUMN "cta_url" varchar;
  ALTER TABLE "pages_blocks_phase_timeline" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "pages_rels" ADD COLUMN "faqs_id" integer;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "result_metric_value" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "result_metric_label" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "result_metric_sub" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "result_metric_accent" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "meta_line" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "summary_label" varchar DEFAULT 'In short';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "summary_body" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "media_id" integer;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "media_frame" "enum__pages_v_blocks_hero_media_frame" DEFAULT 'none';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "tone" "enum__pages_v_blocks_case_study_cards_tone" DEFAULT 'light';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "page_size" numeric DEFAULT 6;
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "load_more" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "load_more_label" varchar DEFAULT 'Load more studies';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "load_more_loading_label" varchar DEFAULT 'Loading…';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "load_more_error_label" varchar DEFAULT 'Could not load more studies. Try again.';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "ledger_labels_number" varchar DEFAULT '№';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "ledger_labels_client" varchar DEFAULT 'Client';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "ledger_labels_summary" varchar DEFAULT 'What was leaking / what we changed';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "ledger_labels_metric" varchar DEFAULT 'Returned';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "ledger_labels_kind" varchar DEFAULT 'Case study';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "ledger_labels_read_label" varchar DEFAULT 'Read the study →';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "next_labels_label" varchar DEFAULT 'Next study';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ADD COLUMN "next_labels_read_label" varchar DEFAULT 'Read it →';
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "client_voice_testimonial_id" integer;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "client_voice_do_differently" jsonb;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "client_voice_phase_mapping" varchar;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "client_voice_link_type" "enum__pages_v_blocks_testimonial_row_client_voice_link_type" DEFAULT 'internal';
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "client_voice_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "client_voice_link_url" varchar;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "client_voice_link_label" varchar;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "differently_number" varchar DEFAULT '04';
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "differently_heading" varchar DEFAULT 'What we''d do differently';
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "phase_label" varchar DEFAULT 'How this maps to our phases';
  ALTER TABLE "_pages_v_blocks_two_track_panels_panels" ADD COLUMN "claim" varchar;
  ALTER TABLE "_pages_v_blocks_two_track_panels" ADD COLUMN "conclusion" varchar;
  ALTER TABLE "_pages_v_blocks_phase_timeline_phases" ADD COLUMN "link_type" "enum__pages_v_blocks_phase_timeline_phases_link_type" DEFAULT 'internal';
  ALTER TABLE "_pages_v_blocks_phase_timeline_phases" ADD COLUMN "link_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_phase_timeline_phases" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_phase_timeline_phases" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" ADD COLUMN "tag" varchar;
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" ADD COLUMN "is_sign_off" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_phase_timeline" ADD COLUMN "cta_type" "enum__pages_v_blocks_phase_timeline_cta_type" DEFAULT 'internal';
  ALTER TABLE "_pages_v_blocks_phase_timeline" ADD COLUMN "cta_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_phase_timeline" ADD COLUMN "cta_url" varchar;
  ALTER TABLE "_pages_v_blocks_phase_timeline" ADD COLUMN "cta_label" varchar;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "faqs_id" integer;
  ALTER TABLE "forms_blocks_email" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "forms_blocks_text" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "forms_blocks_textarea" ADD COLUMN "placeholder" varchar;
  ALTER TABLE "pages_blocks_hero_breadcrumb" ADD CONSTRAINT "pages_blocks_hero_breadcrumb_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_stats" ADD CONSTRAINT "pages_blocks_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_phase_strip" ADD CONSTRAINT "pages_blocks_hero_phase_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_case_study_cards_track" ADD CONSTRAINT "pages_blocks_case_study_cards_track_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_case_study_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_metric_event_items" ADD CONSTRAINT "pages_blocks_metric_event_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_metric_event"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_metric_event" ADD CONSTRAINT "pages_blocks_metric_event_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_phase_timeline_steps_outcomes" ADD CONSTRAINT "pages_blocks_phase_timeline_steps_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_phase_timeline_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_content" ADD CONSTRAINT "pages_blocks_rich_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spec_ledger_items" ADD CONSTRAINT "pages_blocks_spec_ledger_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_spec_ledger_items" ADD CONSTRAINT "pages_blocks_spec_ledger_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_spec_ledger"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spec_ledger" ADD CONSTRAINT "pages_blocks_spec_ledger_hub_image_id_media_id_fk" FOREIGN KEY ("hub_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_spec_ledger" ADD CONSTRAINT "pages_blocks_spec_ledger_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_f_a_q" ADD CONSTRAINT "pages_blocks_accordion_f_a_q_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_breadcrumb" ADD CONSTRAINT "_pages_v_blocks_hero_breadcrumb_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_stats" ADD CONSTRAINT "_pages_v_blocks_hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_phase_strip" ADD CONSTRAINT "_pages_v_blocks_hero_phase_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_case_study_cards_track" ADD CONSTRAINT "_pages_v_blocks_case_study_cards_track_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_case_study_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_metric_event_items" ADD CONSTRAINT "_pages_v_blocks_metric_event_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_metric_event"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_metric_event" ADD CONSTRAINT "_pages_v_blocks_metric_event_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps_outcomes" ADD CONSTRAINT "_pages_v_blocks_phase_timeline_steps_outcomes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_phase_timeline_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD CONSTRAINT "_pages_v_blocks_rich_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" ADD CONSTRAINT "_pages_v_blocks_spec_ledger_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" ADD CONSTRAINT "_pages_v_blocks_spec_ledger_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_spec_ledger"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spec_ledger" ADD CONSTRAINT "_pages_v_blocks_spec_ledger_hub_image_id_media_id_fk" FOREIGN KEY ("hub_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spec_ledger" ADD CONSTRAINT "_pages_v_blocks_spec_ledger_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" ADD CONSTRAINT "_pages_v_blocks_accordion_f_a_q_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_breadcrumb_order_idx" ON "pages_blocks_hero_breadcrumb" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_breadcrumb_parent_id_idx" ON "pages_blocks_hero_breadcrumb" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_stats_order_idx" ON "pages_blocks_hero_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_stats_parent_id_idx" ON "pages_blocks_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_phase_strip_order_idx" ON "pages_blocks_hero_phase_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_phase_strip_parent_id_idx" ON "pages_blocks_hero_phase_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_case_study_cards_track_order_idx" ON "pages_blocks_case_study_cards_track" USING btree ("order");
  CREATE INDEX "pages_blocks_case_study_cards_track_parent_idx" ON "pages_blocks_case_study_cards_track" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_metric_event_items_order_idx" ON "pages_blocks_metric_event_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_metric_event_items_parent_id_idx" ON "pages_blocks_metric_event_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_metric_event_order_idx" ON "pages_blocks_metric_event" USING btree ("_order");
  CREATE INDEX "pages_blocks_metric_event_parent_id_idx" ON "pages_blocks_metric_event" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_metric_event_path_idx" ON "pages_blocks_metric_event" USING btree ("_path");
  CREATE INDEX "pages_blocks_phase_timeline_steps_outcomes_order_idx" ON "pages_blocks_phase_timeline_steps_outcomes" USING btree ("_order");
  CREATE INDEX "pages_blocks_phase_timeline_steps_outcomes_parent_id_idx" ON "pages_blocks_phase_timeline_steps_outcomes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_content_order_idx" ON "pages_blocks_rich_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_content_parent_id_idx" ON "pages_blocks_rich_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_content_path_idx" ON "pages_blocks_rich_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_spec_ledger_items_order_idx" ON "pages_blocks_spec_ledger_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_spec_ledger_items_parent_id_idx" ON "pages_blocks_spec_ledger_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spec_ledger_items_image_idx" ON "pages_blocks_spec_ledger_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_spec_ledger_order_idx" ON "pages_blocks_spec_ledger" USING btree ("_order");
  CREATE INDEX "pages_blocks_spec_ledger_parent_id_idx" ON "pages_blocks_spec_ledger" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spec_ledger_path_idx" ON "pages_blocks_spec_ledger" USING btree ("_path");
  CREATE INDEX "pages_blocks_spec_ledger_hub_hub_image_idx" ON "pages_blocks_spec_ledger" USING btree ("hub_image_id");
  CREATE INDEX "pages_blocks_accordion_f_a_q_order_idx" ON "pages_blocks_accordion_f_a_q" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_f_a_q_parent_id_idx" ON "pages_blocks_accordion_f_a_q" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_f_a_q_path_idx" ON "pages_blocks_accordion_f_a_q" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_breadcrumb_order_idx" ON "_pages_v_blocks_hero_breadcrumb" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_breadcrumb_parent_id_idx" ON "_pages_v_blocks_hero_breadcrumb" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_stats_order_idx" ON "_pages_v_blocks_hero_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_stats_parent_id_idx" ON "_pages_v_blocks_hero_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_phase_strip_order_idx" ON "_pages_v_blocks_hero_phase_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_phase_strip_parent_id_idx" ON "_pages_v_blocks_hero_phase_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_case_study_cards_track_order_idx" ON "_pages_v_blocks_case_study_cards_track" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_case_study_cards_track_parent_idx" ON "_pages_v_blocks_case_study_cards_track" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_metric_event_items_order_idx" ON "_pages_v_blocks_metric_event_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_metric_event_items_parent_id_idx" ON "_pages_v_blocks_metric_event_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_metric_event_order_idx" ON "_pages_v_blocks_metric_event" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_metric_event_parent_id_idx" ON "_pages_v_blocks_metric_event" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_metric_event_path_idx" ON "_pages_v_blocks_metric_event" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_phase_timeline_steps_outcomes_order_idx" ON "_pages_v_blocks_phase_timeline_steps_outcomes" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_phase_timeline_steps_outcomes_parent_id_idx" ON "_pages_v_blocks_phase_timeline_steps_outcomes" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_content_order_idx" ON "_pages_v_blocks_rich_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_content_parent_id_idx" ON "_pages_v_blocks_rich_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_content_path_idx" ON "_pages_v_blocks_rich_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_spec_ledger_items_order_idx" ON "_pages_v_blocks_spec_ledger_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_spec_ledger_items_parent_id_idx" ON "_pages_v_blocks_spec_ledger_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spec_ledger_items_image_idx" ON "_pages_v_blocks_spec_ledger_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_spec_ledger_order_idx" ON "_pages_v_blocks_spec_ledger" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_spec_ledger_parent_id_idx" ON "_pages_v_blocks_spec_ledger" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spec_ledger_path_idx" ON "_pages_v_blocks_spec_ledger" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_spec_ledger_hub_hub_image_idx" ON "_pages_v_blocks_spec_ledger" USING btree ("hub_image_id");
  CREATE INDEX "_pages_v_blocks_accordion_f_a_q_order_idx" ON "_pages_v_blocks_accordion_f_a_q" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_f_a_q_parent_id_idx" ON "_pages_v_blocks_accordion_f_a_q" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_f_a_q_path_idx" ON "_pages_v_blocks_accordion_f_a_q" USING btree ("_path");
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonial_row" ADD CONSTRAINT "pages_blocks_testimonial_row_client_voice_testimonial_id_testimonials_id_fk" FOREIGN KEY ("client_voice_testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD CONSTRAINT "_pages_v_blocks_testimonial_row_client_voice_testimonial_id_testimonials_id_fk" FOREIGN KEY ("client_voice_testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_media_idx" ON "pages_blocks_hero" USING btree ("media_id");
  CREATE INDEX "pages_blocks_testimonial_row_client_voice_client_voice_t_idx" ON "pages_blocks_testimonial_row" USING btree ("client_voice_testimonial_id");
  CREATE INDEX "pages_rels_faqs_id_idx" ON "pages_rels" USING btree ("faqs_id");
  CREATE INDEX "_pages_v_blocks_hero_media_idx" ON "_pages_v_blocks_hero" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_testimonial_row_client_voice_client_voic_idx" ON "_pages_v_blocks_testimonial_row" USING btree ("client_voice_testimonial_id");
  CREATE INDEX "_pages_v_rels_faqs_id_idx" ON "_pages_v_rels" USING btree ("faqs_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero_breadcrumb" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_phase_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_case_study_cards_track" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_metric_event_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_metric_event" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_phase_timeline_steps_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_spec_ledger_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_spec_ledger" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_accordion_f_a_q" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_breadcrumb" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_phase_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_case_study_cards_track" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_metric_event_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_metric_event" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps_outcomes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_spec_ledger_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_spec_ledger" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_breadcrumb" CASCADE;
  DROP TABLE "pages_blocks_hero_stats" CASCADE;
  DROP TABLE "pages_blocks_hero_phase_strip" CASCADE;
  DROP TABLE "pages_blocks_case_study_cards_track" CASCADE;
  DROP TABLE "pages_blocks_metric_event_items" CASCADE;
  DROP TABLE "pages_blocks_metric_event" CASCADE;
  DROP TABLE "pages_blocks_phase_timeline_steps_outcomes" CASCADE;
  DROP TABLE "pages_blocks_rich_content" CASCADE;
  DROP TABLE "pages_blocks_spec_ledger_items" CASCADE;
  DROP TABLE "pages_blocks_spec_ledger" CASCADE;
  DROP TABLE "pages_blocks_accordion_f_a_q" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_breadcrumb" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_phase_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_case_study_cards_track" CASCADE;
  DROP TABLE "_pages_v_blocks_metric_event_items" CASCADE;
  DROP TABLE "_pages_v_blocks_metric_event" CASCADE;
  DROP TABLE "_pages_v_blocks_phase_timeline_steps_outcomes" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_content" CASCADE;
  DROP TABLE "_pages_v_blocks_spec_ledger_items" CASCADE;
  DROP TABLE "_pages_v_blocks_spec_ledger" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_f_a_q" CASCADE;
  ALTER TABLE "pages_blocks_hero" DROP CONSTRAINT "pages_blocks_hero_media_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_testimonial_row" DROP CONSTRAINT "pages_blocks_testimonial_row_client_voice_testimonial_id_testimonials_id_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_faqs_fk";
  
  ALTER TABLE "_pages_v_blocks_hero" DROP CONSTRAINT "_pages_v_blocks_hero_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP CONSTRAINT "_pages_v_blocks_testimonial_row_client_voice_testimonial_id_testimonials_id_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_faqs_fk";
  
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "variant" SET DEFAULT 'typographic'::text;
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('typographic');
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "variant" SET DEFAULT 'typographic'::"public"."enum_pages_blocks_hero_variant";
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_hero_variant" USING "variant"::"public"."enum_pages_blocks_hero_variant";
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "layout" SET DEFAULT 'cards'::text;
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_layout";
  CREATE TYPE "public"."enum_pages_blocks_case_study_cards_layout" AS ENUM('cards');
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "layout" SET DEFAULT 'cards'::"public"."enum_pages_blocks_case_study_cards_layout";
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "layout" SET DATA TYPE "public"."enum_pages_blocks_case_study_cards_layout" USING "layout"::"public"."enum_pages_blocks_case_study_cards_layout";
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "source" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "source" SET DEFAULT 'featured'::text;
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_source";
  CREATE TYPE "public"."enum_pages_blocks_case_study_cards_source" AS ENUM('featured', 'latest', 'manual');
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "source" SET DEFAULT 'featured'::"public"."enum_pages_blocks_case_study_cards_source";
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "source" SET DATA TYPE "public"."enum_pages_blocks_case_study_cards_source" USING "source"::"public"."enum_pages_blocks_case_study_cards_source";
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DEFAULT 'ledger'::text;
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_fallback_mode";
  CREATE TYPE "public"."enum_pages_blocks_case_study_cards_fallback_mode" AS ENUM('ledger', 'note');
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DEFAULT 'ledger'::"public"."enum_pages_blocks_case_study_cards_fallback_mode";
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DATA TYPE "public"."enum_pages_blocks_case_study_cards_fallback_mode" USING "fallback_mode"::"public"."enum_pages_blocks_case_study_cards_fallback_mode";
  ALTER TABLE "pages_blocks_testimonial_row" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_testimonial_row" ALTER COLUMN "variant" SET DEFAULT 'row'::text;
  DROP TYPE "public"."enum_pages_blocks_testimonial_row_variant";
  CREATE TYPE "public"."enum_pages_blocks_testimonial_row_variant" AS ENUM('row');
  ALTER TABLE "pages_blocks_testimonial_row" ALTER COLUMN "variant" SET DEFAULT 'row'::"public"."enum_pages_blocks_testimonial_row_variant";
  ALTER TABLE "pages_blocks_testimonial_row" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_testimonial_row_variant" USING "variant"::"public"."enum_pages_blocks_testimonial_row_variant";
  ALTER TABLE "pages_blocks_two_track_panels" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_two_track_panels" ALTER COLUMN "variant" SET DEFAULT 'equal'::text;
  DROP TYPE "public"."enum_pages_blocks_two_track_panels_variant";
  CREATE TYPE "public"."enum_pages_blocks_two_track_panels_variant" AS ENUM('equal');
  ALTER TABLE "pages_blocks_two_track_panels" ALTER COLUMN "variant" SET DEFAULT 'equal'::"public"."enum_pages_blocks_two_track_panels_variant";
  ALTER TABLE "pages_blocks_two_track_panels" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_two_track_panels_variant" USING "variant"::"public"."enum_pages_blocks_two_track_panels_variant";
  ALTER TABLE "pages_blocks_phase_timeline" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_phase_timeline" ALTER COLUMN "variant" SET DEFAULT 'accordion'::text;
  DROP TYPE "public"."enum_pages_blocks_phase_timeline_variant";
  CREATE TYPE "public"."enum_pages_blocks_phase_timeline_variant" AS ENUM('accordion');
  ALTER TABLE "pages_blocks_phase_timeline" ALTER COLUMN "variant" SET DEFAULT 'accordion'::"public"."enum_pages_blocks_phase_timeline_variant";
  ALTER TABLE "pages_blocks_phase_timeline" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_phase_timeline_variant" USING "variant"::"public"."enum_pages_blocks_phase_timeline_variant";
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "variant" SET DEFAULT 'typographic'::text;
  DROP TYPE "public"."enum__pages_v_blocks_hero_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('typographic');
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "variant" SET DEFAULT 'typographic'::"public"."enum__pages_v_blocks_hero_variant";
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_hero_variant" USING "variant"::"public"."enum__pages_v_blocks_hero_variant";
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "layout" SET DEFAULT 'cards'::text;
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cards_layout";
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cards_layout" AS ENUM('cards');
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "layout" SET DEFAULT 'cards'::"public"."enum__pages_v_blocks_case_study_cards_layout";
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "layout" SET DATA TYPE "public"."enum__pages_v_blocks_case_study_cards_layout" USING "layout"::"public"."enum__pages_v_blocks_case_study_cards_layout";
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "source" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "source" SET DEFAULT 'featured'::text;
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cards_source";
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cards_source" AS ENUM('featured', 'latest', 'manual');
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "source" SET DEFAULT 'featured'::"public"."enum__pages_v_blocks_case_study_cards_source";
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "source" SET DATA TYPE "public"."enum__pages_v_blocks_case_study_cards_source" USING "source"::"public"."enum__pages_v_blocks_case_study_cards_source";
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DEFAULT 'ledger'::text;
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cards_fallback_mode";
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cards_fallback_mode" AS ENUM('ledger', 'note');
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DEFAULT 'ledger'::"public"."enum__pages_v_blocks_case_study_cards_fallback_mode";
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DATA TYPE "public"."enum__pages_v_blocks_case_study_cards_fallback_mode" USING "fallback_mode"::"public"."enum__pages_v_blocks_case_study_cards_fallback_mode";
  ALTER TABLE "_pages_v_blocks_testimonial_row" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ALTER COLUMN "variant" SET DEFAULT 'row'::text;
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_row_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_row_variant" AS ENUM('row');
  ALTER TABLE "_pages_v_blocks_testimonial_row" ALTER COLUMN "variant" SET DEFAULT 'row'::"public"."enum__pages_v_blocks_testimonial_row_variant";
  ALTER TABLE "_pages_v_blocks_testimonial_row" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_testimonial_row_variant" USING "variant"::"public"."enum__pages_v_blocks_testimonial_row_variant";
  ALTER TABLE "_pages_v_blocks_two_track_panels" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_two_track_panels" ALTER COLUMN "variant" SET DEFAULT 'equal'::text;
  DROP TYPE "public"."enum__pages_v_blocks_two_track_panels_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_two_track_panels_variant" AS ENUM('equal');
  ALTER TABLE "_pages_v_blocks_two_track_panels" ALTER COLUMN "variant" SET DEFAULT 'equal'::"public"."enum__pages_v_blocks_two_track_panels_variant";
  ALTER TABLE "_pages_v_blocks_two_track_panels" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_two_track_panels_variant" USING "variant"::"public"."enum__pages_v_blocks_two_track_panels_variant";
  ALTER TABLE "_pages_v_blocks_phase_timeline" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_phase_timeline" ALTER COLUMN "variant" SET DEFAULT 'accordion'::text;
  DROP TYPE "public"."enum__pages_v_blocks_phase_timeline_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" AS ENUM('accordion');
  ALTER TABLE "_pages_v_blocks_phase_timeline" ALTER COLUMN "variant" SET DEFAULT 'accordion'::"public"."enum__pages_v_blocks_phase_timeline_variant";
  ALTER TABLE "_pages_v_blocks_phase_timeline" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_phase_timeline_variant" USING "variant"::"public"."enum__pages_v_blocks_phase_timeline_variant";
  DROP INDEX "pages_blocks_hero_media_idx";
  DROP INDEX "pages_blocks_testimonial_row_client_voice_client_voice_t_idx";
  DROP INDEX "pages_rels_faqs_id_idx";
  DROP INDEX "_pages_v_blocks_hero_media_idx";
  DROP INDEX "_pages_v_blocks_testimonial_row_client_voice_client_voic_idx";
  DROP INDEX "_pages_v_rels_faqs_id_idx";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "result_metric_value";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "result_metric_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "result_metric_sub";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "result_metric_accent";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "meta_line";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "summary_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "summary_body";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "media_id";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "media_frame";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "tone";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "page_size";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "load_more";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "load_more_label";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "load_more_loading_label";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "load_more_error_label";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "ledger_labels_number";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "ledger_labels_client";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "ledger_labels_summary";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "ledger_labels_metric";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "ledger_labels_kind";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "ledger_labels_read_label";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "next_labels_label";
  ALTER TABLE "pages_blocks_case_study_cards" DROP COLUMN "next_labels_read_label";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "client_voice_testimonial_id";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "client_voice_do_differently";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "client_voice_phase_mapping";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "client_voice_link_type";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "client_voice_link_new_tab";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "client_voice_link_url";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "client_voice_link_label";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "differently_number";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "differently_heading";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "phase_label";
  ALTER TABLE "pages_blocks_two_track_panels_panels" DROP COLUMN "claim";
  ALTER TABLE "pages_blocks_two_track_panels" DROP COLUMN "conclusion";
  ALTER TABLE "pages_blocks_phase_timeline_phases" DROP COLUMN "link_type";
  ALTER TABLE "pages_blocks_phase_timeline_phases" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_phase_timeline_phases" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_phase_timeline_phases" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_phase_timeline_steps" DROP COLUMN "tag";
  ALTER TABLE "pages_blocks_phase_timeline_steps" DROP COLUMN "is_sign_off";
  ALTER TABLE "pages_blocks_phase_timeline" DROP COLUMN "cta_type";
  ALTER TABLE "pages_blocks_phase_timeline" DROP COLUMN "cta_new_tab";
  ALTER TABLE "pages_blocks_phase_timeline" DROP COLUMN "cta_url";
  ALTER TABLE "pages_blocks_phase_timeline" DROP COLUMN "cta_label";
  ALTER TABLE "pages_rels" DROP COLUMN "faqs_id";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "result_metric_value";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "result_metric_label";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "result_metric_sub";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "result_metric_accent";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "meta_line";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "summary_label";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "summary_body";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "media_id";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "media_frame";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "tone";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "page_size";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "load_more";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "load_more_label";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "load_more_loading_label";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "load_more_error_label";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "ledger_labels_number";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "ledger_labels_client";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "ledger_labels_summary";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "ledger_labels_metric";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "ledger_labels_kind";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "ledger_labels_read_label";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "next_labels_label";
  ALTER TABLE "_pages_v_blocks_case_study_cards" DROP COLUMN "next_labels_read_label";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "client_voice_testimonial_id";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "client_voice_do_differently";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "client_voice_phase_mapping";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "client_voice_link_type";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "client_voice_link_new_tab";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "client_voice_link_url";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "client_voice_link_label";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "differently_number";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "differently_heading";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "phase_label";
  ALTER TABLE "_pages_v_blocks_two_track_panels_panels" DROP COLUMN "claim";
  ALTER TABLE "_pages_v_blocks_two_track_panels" DROP COLUMN "conclusion";
  ALTER TABLE "_pages_v_blocks_phase_timeline_phases" DROP COLUMN "link_type";
  ALTER TABLE "_pages_v_blocks_phase_timeline_phases" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_phase_timeline_phases" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_phase_timeline_phases" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" DROP COLUMN "tag";
  ALTER TABLE "_pages_v_blocks_phase_timeline_steps" DROP COLUMN "is_sign_off";
  ALTER TABLE "_pages_v_blocks_phase_timeline" DROP COLUMN "cta_type";
  ALTER TABLE "_pages_v_blocks_phase_timeline" DROP COLUMN "cta_new_tab";
  ALTER TABLE "_pages_v_blocks_phase_timeline" DROP COLUMN "cta_url";
  ALTER TABLE "_pages_v_blocks_phase_timeline" DROP COLUMN "cta_label";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "faqs_id";
  ALTER TABLE "forms_blocks_email" DROP COLUMN "placeholder";
  ALTER TABLE "forms_blocks_text" DROP COLUMN "placeholder";
  ALTER TABLE "forms_blocks_textarea" DROP COLUMN "placeholder";
  DROP TYPE "public"."enum_pages_blocks_hero_media_frame";
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_track";
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_tone";
  DROP TYPE "public"."enum_pages_blocks_metric_event_variant";
  DROP TYPE "public"."enum_pages_blocks_testimonial_row_client_voice_link_type";
  DROP TYPE "public"."enum_pages_blocks_phase_timeline_phases_link_type";
  DROP TYPE "public"."enum_pages_blocks_phase_timeline_cta_type";
  DROP TYPE "public"."enum_pages_blocks_rich_content_variant";
  DROP TYPE "public"."enum_pages_blocks_spec_ledger_variant";
  DROP TYPE "public"."enum_pages_blocks_spec_ledger_card_layout";
  DROP TYPE "public"."enum_pages_blocks_spec_ledger_tone";
  DROP TYPE "public"."enum_pages_blocks_accordion_f_a_q_variant";
  DROP TYPE "public"."enum_pages_blocks_accordion_f_a_q_source";
  DROP TYPE "public"."enum_pages_blocks_accordion_f_a_q_category";
  DROP TYPE "public"."enum_pages_blocks_accordion_f_a_q_all_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_media_frame";
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cards_track";
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cards_tone";
  DROP TYPE "public"."enum__pages_v_blocks_metric_event_variant";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_row_client_voice_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_phase_timeline_phases_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_phase_timeline_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_rich_content_variant";
  DROP TYPE "public"."enum__pages_v_blocks_spec_ledger_variant";
  DROP TYPE "public"."enum__pages_v_blocks_spec_ledger_card_layout";
  DROP TYPE "public"."enum__pages_v_blocks_spec_ledger_tone";
  DROP TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_variant";
  DROP TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_source";
  DROP TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_category";
  DROP TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_all_link_type";`)
}
