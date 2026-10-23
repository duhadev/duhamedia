import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_form_style" AS ENUM('card', 'inline');
  CREATE TYPE "public"."enum_pages_blocks_offer_block_cta_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_offer_block_capacity" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum_pages_blocks_proof_strip_capacity_statement" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum_pages_blocks_review_wall_inserts_kind" AS ENUM('metric', 'client', 'scarcity');
  CREATE TYPE "public"."enum_pages_blocks_review_wall_inserts_statement" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum_pages_blocks_testimonial_row_cta_style" AS ENUM('link', 'button');
  CREATE TYPE "public"."enum_pages_blocks_rich_content_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_rich_content_tone" AS ENUM('grey', 'light');
  CREATE TYPE "public"."enum_pages_blocks_rich_content_callout_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_newsletter_band_cross_sell_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_link_stack_links_icon" AS ENUM('chart-line-up', 'quotes', 'envelope-simple', 'file-text', 'arrow-right');
  CREATE TYPE "public"."enum_pages_blocks_link_stack_links_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_link_stack_primary_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_link_stack_primary_capacity" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum_pages_blocks_link_stack_current_push_icon" AS ENUM('chart-line-up', 'quotes', 'envelope-simple', 'file-text', 'arrow-right');
  CREATE TYPE "public"."enum_pages_blocks_link_stack_current_push_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_post_list_track" AS ENUM('newsletter-issue', 'dev-seo', 'mkt-seo');
  CREATE TYPE "public"."enum_pages_blocks_post_list_archive_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_error404_links_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_form_style" AS ENUM('card', 'inline');
  CREATE TYPE "public"."enum__pages_v_blocks_offer_block_cta_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_offer_block_capacity" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum__pages_v_blocks_proof_strip_capacity_statement" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum__pages_v_blocks_review_wall_inserts_kind" AS ENUM('metric', 'client', 'scarcity');
  CREATE TYPE "public"."enum__pages_v_blocks_review_wall_inserts_statement" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonial_row_cta_style" AS ENUM('link', 'button');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_content_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_content_tone" AS ENUM('grey', 'light');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_content_callout_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_band_cross_sell_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_link_stack_links_icon" AS ENUM('chart-line-up', 'quotes', 'envelope-simple', 'file-text', 'arrow-right');
  CREATE TYPE "public"."enum__pages_v_blocks_link_stack_links_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_link_stack_primary_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_link_stack_primary_capacity" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum__pages_v_blocks_link_stack_current_push_icon" AS ENUM('chart-line-up', 'quotes', 'envelope-simple', 'file-text', 'arrow-right');
  CREATE TYPE "public"."enum__pages_v_blocks_link_stack_current_push_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_post_list_track" AS ENUM('newsletter-issue', 'dev-seo', 'mkt-seo');
  CREATE TYPE "public"."enum__pages_v_blocks_post_list_archive_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_error404_links_link_type" AS ENUM('internal', 'custom');
  ALTER TYPE "public"."enum_pages_blocks_hero_variant" ADD VALUE 'vsl';
  ALTER TYPE "public"."enum_pages_blocks_mini_c_t_a_strip_variant" ADD VALUE 'button';
  ALTER TYPE "public"."enum_pages_blocks_proof_strip_variant" ADD VALUE 'metrics';
  ALTER TYPE "public"."enum_pages_blocks_review_wall_variant" ADD VALUE 'wall';
  ALTER TYPE "public"."enum_pages_blocks_rich_content_variant" ADD VALUE 'band';
  ALTER TYPE "public"."enum_pages_blocks_rich_content_variant" ADD VALUE 'legal';
  ALTER TYPE "public"."enum_pages_blocks_spec_ledger_variant" ADD VALUE 'list';
  ALTER TYPE "public"."enum_pages_blocks_newsletter_band_variant" ADD VALUE 'cross-sell';
  ALTER TYPE "public"."enum__pages_v_blocks_hero_variant" ADD VALUE 'vsl';
  ALTER TYPE "public"."enum__pages_v_blocks_mini_c_t_a_strip_variant" ADD VALUE 'button';
  ALTER TYPE "public"."enum__pages_v_blocks_proof_strip_variant" ADD VALUE 'metrics';
  ALTER TYPE "public"."enum__pages_v_blocks_review_wall_variant" ADD VALUE 'wall';
  ALTER TYPE "public"."enum__pages_v_blocks_rich_content_variant" ADD VALUE 'band';
  ALTER TYPE "public"."enum__pages_v_blocks_rich_content_variant" ADD VALUE 'legal';
  ALTER TYPE "public"."enum__pages_v_blocks_spec_ledger_variant" ADD VALUE 'list';
  ALTER TYPE "public"."enum__pages_v_blocks_newsletter_band_variant" ADD VALUE 'cross-sell';
  CREATE TABLE "pages_blocks_offer_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"body" jsonb,
  	"cta_type" "enum_pages_blocks_offer_block_cta_type" DEFAULT 'internal',
  	"cta_new_tab" boolean DEFAULT false,
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"capacity" "enum_pages_blocks_offer_block_capacity" DEFAULT 'offer-line',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_proof_strip_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"accent" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_review_wall_inserts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "enum_pages_blocks_review_wall_inserts_kind" DEFAULT 'metric',
  	"metric_value" varchar,
  	"metric_label" varchar,
  	"metric_sub" varchar,
  	"metric_accent" boolean DEFAULT false,
  	"client_id" integer,
  	"statement" "enum_pages_blocks_review_wall_inserts_statement" DEFAULT 'capacity',
  	"position" numeric DEFAULT 2
  );
  
  CREATE TABLE "pages_blocks_rich_content_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"accent" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_link_stack_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_link_stack_links_icon" DEFAULT 'arrow-right',
  	"link_type" "enum_pages_blocks_link_stack_links_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_link_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"identity_show_study_metric" boolean DEFAULT true,
  	"identity_fallback_line" varchar,
  	"primary_link_type" "enum_pages_blocks_link_stack_primary_link_type" DEFAULT 'internal',
  	"primary_link_new_tab" boolean DEFAULT false,
  	"primary_link_url" varchar,
  	"primary_link_label" varchar,
  	"primary_capacity" "enum_pages_blocks_link_stack_primary_capacity" DEFAULT 'slots-line',
  	"show_socials" boolean DEFAULT true,
  	"follow_label" varchar DEFAULT 'Follow',
  	"site_label" varchar DEFAULT 'On the site',
  	"latest_case_study" boolean DEFAULT true,
  	"latest_case_study_label" varchar DEFAULT 'Case study',
  	"current_push_show" boolean DEFAULT false,
  	"current_push_icon" "enum_pages_blocks_link_stack_current_push_icon" DEFAULT 'file-text',
  	"current_push_link_type" "enum_pages_blocks_link_stack_current_push_link_type" DEFAULT 'internal',
  	"current_push_link_new_tab" boolean DEFAULT false,
  	"current_push_link_url" varchar,
  	"current_push_link_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_post_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT true,
  	"track" "enum_pages_blocks_post_list_track" DEFAULT 'newsletter-issue',
  	"feature_latest" boolean DEFAULT true,
  	"limit" numeric DEFAULT 3,
  	"archive_link_type" "enum_pages_blocks_post_list_archive_link_type" DEFAULT 'internal',
  	"archive_link_new_tab" boolean DEFAULT false,
  	"archive_link_url" varchar,
  	"archive_link_label" varchar,
  	"labels_latest_label" varchar DEFAULT 'Latest —',
  	"labels_new_badge" varchar DEFAULT 'New',
  	"labels_previously_label" varchar DEFAULT 'Previously',
  	"labels_count_suffix" varchar DEFAULT 'issues',
  	"labels_count_suffix_singular" varchar DEFAULT 'issue',
  	"labels_read_label" varchar DEFAULT 'Read issue',
  	"labels_issue_word" varchar DEFAULT 'Issue',
  	"empty_heading" varchar DEFAULT 'The first issue is on its way.',
  	"empty_body" varchar DEFAULT 'Each issue is one store problem, the number it moved and what we would do differently. Join above and the first one lands in your inbox.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_error404_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_error404_links_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_error404" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar DEFAULT '404',
  	"heading" varchar DEFAULT 'This page leaked.',
  	"body" varchar DEFAULT 'Unlike your store''s demand, it''s not coming back.',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_offer_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"body" jsonb,
  	"cta_type" "enum__pages_v_blocks_offer_block_cta_type" DEFAULT 'internal',
  	"cta_new_tab" boolean DEFAULT false,
  	"cta_url" varchar,
  	"cta_label" varchar,
  	"capacity" "enum__pages_v_blocks_offer_block_capacity" DEFAULT 'offer-line',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_proof_strip_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"accent" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_review_wall_inserts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum__pages_v_blocks_review_wall_inserts_kind" DEFAULT 'metric',
  	"metric_value" varchar,
  	"metric_label" varchar,
  	"metric_sub" varchar,
  	"metric_accent" boolean DEFAULT false,
  	"client_id" integer,
  	"statement" "enum__pages_v_blocks_review_wall_inserts_statement" DEFAULT 'capacity',
  	"position" numeric DEFAULT 2,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_content_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"sub" varchar,
  	"accent" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_link_stack_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_link_stack_links_icon" DEFAULT 'arrow-right',
  	"link_type" "enum__pages_v_blocks_link_stack_links_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_link_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"identity_show_study_metric" boolean DEFAULT true,
  	"identity_fallback_line" varchar,
  	"primary_link_type" "enum__pages_v_blocks_link_stack_primary_link_type" DEFAULT 'internal',
  	"primary_link_new_tab" boolean DEFAULT false,
  	"primary_link_url" varchar,
  	"primary_link_label" varchar,
  	"primary_capacity" "enum__pages_v_blocks_link_stack_primary_capacity" DEFAULT 'slots-line',
  	"show_socials" boolean DEFAULT true,
  	"follow_label" varchar DEFAULT 'Follow',
  	"site_label" varchar DEFAULT 'On the site',
  	"latest_case_study" boolean DEFAULT true,
  	"latest_case_study_label" varchar DEFAULT 'Case study',
  	"current_push_show" boolean DEFAULT false,
  	"current_push_icon" "enum__pages_v_blocks_link_stack_current_push_icon" DEFAULT 'file-text',
  	"current_push_link_type" "enum__pages_v_blocks_link_stack_current_push_link_type" DEFAULT 'internal',
  	"current_push_link_new_tab" boolean DEFAULT false,
  	"current_push_link_url" varchar,
  	"current_push_link_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_post_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT true,
  	"track" "enum__pages_v_blocks_post_list_track" DEFAULT 'newsletter-issue',
  	"feature_latest" boolean DEFAULT true,
  	"limit" numeric DEFAULT 3,
  	"archive_link_type" "enum__pages_v_blocks_post_list_archive_link_type" DEFAULT 'internal',
  	"archive_link_new_tab" boolean DEFAULT false,
  	"archive_link_url" varchar,
  	"archive_link_label" varchar,
  	"labels_latest_label" varchar DEFAULT 'Latest —',
  	"labels_new_badge" varchar DEFAULT 'New',
  	"labels_previously_label" varchar DEFAULT 'Previously',
  	"labels_count_suffix" varchar DEFAULT 'issues',
  	"labels_count_suffix_singular" varchar DEFAULT 'issue',
  	"labels_read_label" varchar DEFAULT 'Read issue',
  	"labels_issue_word" varchar DEFAULT 'Issue',
  	"empty_heading" varchar DEFAULT 'The first issue is on its way.',
  	"empty_body" varchar DEFAULT 'Each issue is one store problem, the number it moved and what we would do differently. Join above and the first one lands in your inbox.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_error404_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_error404_links_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_error404" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar DEFAULT '404',
  	"heading" varchar DEFAULT 'This page leaked.',
  	"body" varchar DEFAULT 'Unlike your store''s demand, it''s not coming back.',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "standfirst" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "video_url" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "video_poster_id" integer;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "show_form" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "form_id" integer;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "form_style" "enum_pages_blocks_hero_form_style" DEFAULT 'card';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "form_heading" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "form_body" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "submit_label" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "form_note" varchar;
  ALTER TABLE "pages_blocks_proof_strip" ADD COLUMN "capacity_statement" "enum_pages_blocks_proof_strip_capacity_statement" DEFAULT 'none';
  ALTER TABLE "pages_blocks_review_wall" ADD COLUMN "wall_note" varchar;
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "cta_style" "enum_pages_blocks_testimonial_row_cta_style" DEFAULT 'link';
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "lead_metric_value" varchar;
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "lead_metric_label" varchar;
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "lead_metric_sub" varchar;
  ALTER TABLE "pages_blocks_testimonial_row" ADD COLUMN "lead_metric_accent" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "last_updated" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "last_updated_label" varchar DEFAULT 'Last updated';
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "nav_label" varchar DEFAULT 'On this page';
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "pricing_note" varchar;
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "link_type" "enum_pages_blocks_rich_content_link_type" DEFAULT 'internal';
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "link_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "tone" "enum_pages_blocks_rich_content_tone" DEFAULT 'grey';
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "framed" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "callout_eyebrow" varchar;
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "callout_body" varchar;
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "callout_link_type" "enum_pages_blocks_rich_content_callout_link_type" DEFAULT 'internal';
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "callout_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "callout_link_url" varchar;
  ALTER TABLE "pages_blocks_rich_content" ADD COLUMN "callout_link_label" varchar;
  ALTER TABLE "pages_blocks_newsletter_band" ADD COLUMN "delivered_eyebrow" varchar DEFAULT 'Sent';
  ALTER TABLE "pages_blocks_newsletter_band" ADD COLUMN "delivered_heading" varchar;
  ALTER TABLE "pages_blocks_newsletter_band" ADD COLUMN "delivered_accent_phrase" varchar;
  ALTER TABLE "pages_blocks_newsletter_band" ADD COLUMN "delivered_body" varchar;
  ALTER TABLE "pages_blocks_newsletter_band" ADD COLUMN "delivered_cross_sell_line" varchar;
  ALTER TABLE "pages_blocks_newsletter_band" ADD COLUMN "cross_sell_link_type" "enum_pages_blocks_newsletter_band_cross_sell_link_type" DEFAULT 'internal';
  ALTER TABLE "pages_blocks_newsletter_band" ADD COLUMN "cross_sell_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_newsletter_band" ADD COLUMN "cross_sell_link_url" varchar;
  ALTER TABLE "pages_blocks_newsletter_band" ADD COLUMN "cross_sell_link_label" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "standfirst" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "video_url" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "video_poster_id" integer;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "show_form" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "form_id" integer;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "form_style" "enum__pages_v_blocks_hero_form_style" DEFAULT 'card';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "form_heading" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "form_body" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "submit_label" varchar;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "form_note" varchar;
  ALTER TABLE "_pages_v_blocks_proof_strip" ADD COLUMN "capacity_statement" "enum__pages_v_blocks_proof_strip_capacity_statement" DEFAULT 'none';
  ALTER TABLE "_pages_v_blocks_review_wall" ADD COLUMN "wall_note" varchar;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "cta_style" "enum__pages_v_blocks_testimonial_row_cta_style" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "lead_metric_value" varchar;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "lead_metric_label" varchar;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "lead_metric_sub" varchar;
  ALTER TABLE "_pages_v_blocks_testimonial_row" ADD COLUMN "lead_metric_accent" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "last_updated" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "last_updated_label" varchar DEFAULT 'Last updated';
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "nav_label" varchar DEFAULT 'On this page';
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "pricing_note" varchar;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "link_type" "enum__pages_v_blocks_rich_content_link_type" DEFAULT 'internal';
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "link_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "tone" "enum__pages_v_blocks_rich_content_tone" DEFAULT 'grey';
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "framed" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "callout_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "callout_body" varchar;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "callout_link_type" "enum__pages_v_blocks_rich_content_callout_link_type" DEFAULT 'internal';
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "callout_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "callout_link_url" varchar;
  ALTER TABLE "_pages_v_blocks_rich_content" ADD COLUMN "callout_link_label" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_band" ADD COLUMN "delivered_eyebrow" varchar DEFAULT 'Sent';
  ALTER TABLE "_pages_v_blocks_newsletter_band" ADD COLUMN "delivered_heading" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_band" ADD COLUMN "delivered_accent_phrase" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_band" ADD COLUMN "delivered_body" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_band" ADD COLUMN "delivered_cross_sell_line" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_band" ADD COLUMN "cross_sell_link_type" "enum__pages_v_blocks_newsletter_band_cross_sell_link_type" DEFAULT 'internal';
  ALTER TABLE "_pages_v_blocks_newsletter_band" ADD COLUMN "cross_sell_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_newsletter_band" ADD COLUMN "cross_sell_link_url" varchar;
  ALTER TABLE "_pages_v_blocks_newsletter_band" ADD COLUMN "cross_sell_link_label" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "post_labels_byline_prefix" varchar DEFAULT 'By';
  ALTER TABLE "site_settings" ADD COLUMN "post_labels_byline_organisation" varchar DEFAULT 'Duha Media';
  ALTER TABLE "site_settings" ADD COLUMN "post_labels_published_prefix" varchar DEFAULT 'Published';
  ALTER TABLE "site_settings" ADD COLUMN "post_labels_updated_prefix" varchar DEFAULT 'Updated';
  ALTER TABLE "site_settings" ADD COLUMN "post_labels_read_time_suffix" varchar DEFAULT 'min read';
  ALTER TABLE "site_settings" ADD COLUMN "post_labels_faq_eyebrow_suffix" varchar DEFAULT '— common questions';
  ALTER TABLE "site_settings" ADD COLUMN "post_labels_how_we_do_it_eyebrow" varchar DEFAULT 'How we do it';
  ALTER TABLE "site_settings" ADD COLUMN "post_labels_issue_word" varchar DEFAULT 'Issue';
  ALTER TABLE "pages_blocks_offer_block" ADD CONSTRAINT "pages_blocks_offer_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_proof_strip_metrics" ADD CONSTRAINT "pages_blocks_proof_strip_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_proof_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_review_wall_inserts" ADD CONSTRAINT "pages_blocks_review_wall_inserts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_review_wall_inserts" ADD CONSTRAINT "pages_blocks_review_wall_inserts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_review_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_content_facts" ADD CONSTRAINT "pages_blocks_rich_content_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_stack_links" ADD CONSTRAINT "pages_blocks_link_stack_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_link_stack"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_link_stack" ADD CONSTRAINT "pages_blocks_link_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_post_list" ADD CONSTRAINT "pages_blocks_post_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_error404_links" ADD CONSTRAINT "pages_blocks_error404_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_error404"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_error404" ADD CONSTRAINT "pages_blocks_error404_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_offer_block" ADD CONSTRAINT "_pages_v_blocks_offer_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_proof_strip_metrics" ADD CONSTRAINT "_pages_v_blocks_proof_strip_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_proof_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_review_wall_inserts" ADD CONSTRAINT "_pages_v_blocks_review_wall_inserts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_review_wall_inserts" ADD CONSTRAINT "_pages_v_blocks_review_wall_inserts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_review_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_content_facts" ADD CONSTRAINT "_pages_v_blocks_rich_content_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_stack_links" ADD CONSTRAINT "_pages_v_blocks_link_stack_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_link_stack"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_link_stack" ADD CONSTRAINT "_pages_v_blocks_link_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_post_list" ADD CONSTRAINT "_pages_v_blocks_post_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_error404_links" ADD CONSTRAINT "_pages_v_blocks_error404_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_error404"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_error404" ADD CONSTRAINT "_pages_v_blocks_error404_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_offer_block_order_idx" ON "pages_blocks_offer_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_offer_block_parent_id_idx" ON "pages_blocks_offer_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_offer_block_path_idx" ON "pages_blocks_offer_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_proof_strip_metrics_order_idx" ON "pages_blocks_proof_strip_metrics" USING btree ("_order");
  CREATE INDEX "pages_blocks_proof_strip_metrics_parent_id_idx" ON "pages_blocks_proof_strip_metrics" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_review_wall_inserts_order_idx" ON "pages_blocks_review_wall_inserts" USING btree ("_order");
  CREATE INDEX "pages_blocks_review_wall_inserts_parent_id_idx" ON "pages_blocks_review_wall_inserts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_review_wall_inserts_client_idx" ON "pages_blocks_review_wall_inserts" USING btree ("client_id");
  CREATE INDEX "pages_blocks_rich_content_facts_order_idx" ON "pages_blocks_rich_content_facts" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_content_facts_parent_id_idx" ON "pages_blocks_rich_content_facts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_stack_links_order_idx" ON "pages_blocks_link_stack_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_stack_links_parent_id_idx" ON "pages_blocks_link_stack_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_stack_order_idx" ON "pages_blocks_link_stack" USING btree ("_order");
  CREATE INDEX "pages_blocks_link_stack_parent_id_idx" ON "pages_blocks_link_stack" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_link_stack_path_idx" ON "pages_blocks_link_stack" USING btree ("_path");
  CREATE INDEX "pages_blocks_post_list_order_idx" ON "pages_blocks_post_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_post_list_parent_id_idx" ON "pages_blocks_post_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_post_list_path_idx" ON "pages_blocks_post_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_error404_links_order_idx" ON "pages_blocks_error404_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_error404_links_parent_id_idx" ON "pages_blocks_error404_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_error404_order_idx" ON "pages_blocks_error404" USING btree ("_order");
  CREATE INDEX "pages_blocks_error404_parent_id_idx" ON "pages_blocks_error404" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_error404_path_idx" ON "pages_blocks_error404" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_offer_block_order_idx" ON "_pages_v_blocks_offer_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_offer_block_parent_id_idx" ON "_pages_v_blocks_offer_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_offer_block_path_idx" ON "_pages_v_blocks_offer_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_proof_strip_metrics_order_idx" ON "_pages_v_blocks_proof_strip_metrics" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_proof_strip_metrics_parent_id_idx" ON "_pages_v_blocks_proof_strip_metrics" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_review_wall_inserts_order_idx" ON "_pages_v_blocks_review_wall_inserts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_review_wall_inserts_parent_id_idx" ON "_pages_v_blocks_review_wall_inserts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_review_wall_inserts_client_idx" ON "_pages_v_blocks_review_wall_inserts" USING btree ("client_id");
  CREATE INDEX "_pages_v_blocks_rich_content_facts_order_idx" ON "_pages_v_blocks_rich_content_facts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_content_facts_parent_id_idx" ON "_pages_v_blocks_rich_content_facts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_link_stack_links_order_idx" ON "_pages_v_blocks_link_stack_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_link_stack_links_parent_id_idx" ON "_pages_v_blocks_link_stack_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_link_stack_order_idx" ON "_pages_v_blocks_link_stack" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_link_stack_parent_id_idx" ON "_pages_v_blocks_link_stack" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_link_stack_path_idx" ON "_pages_v_blocks_link_stack" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_post_list_order_idx" ON "_pages_v_blocks_post_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_post_list_parent_id_idx" ON "_pages_v_blocks_post_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_post_list_path_idx" ON "_pages_v_blocks_post_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_error404_links_order_idx" ON "_pages_v_blocks_error404_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_error404_links_parent_id_idx" ON "_pages_v_blocks_error404_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_error404_order_idx" ON "_pages_v_blocks_error404" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_error404_parent_id_idx" ON "_pages_v_blocks_error404" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_error404_path_idx" ON "_pages_v_blocks_error404" USING btree ("_path");
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_video_video_poster_idx" ON "pages_blocks_hero" USING btree ("video_poster_id");
  CREATE INDEX "pages_blocks_hero_form_idx" ON "pages_blocks_hero" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_hero_video_video_poster_idx" ON "_pages_v_blocks_hero" USING btree ("video_poster_id");
  CREATE INDEX "_pages_v_blocks_hero_form_idx" ON "_pages_v_blocks_hero" USING btree ("form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   ALTER TABLE "pages_blocks_offer_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_proof_strip_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_review_wall_inserts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_rich_content_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_link_stack_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_link_stack" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_post_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_error404_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_error404" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_offer_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_proof_strip_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_review_wall_inserts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_content_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_link_stack_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_link_stack" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_post_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_error404_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_error404" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_offer_block" CASCADE;
  DROP TABLE "pages_blocks_proof_strip_metrics" CASCADE;
  DROP TABLE "pages_blocks_review_wall_inserts" CASCADE;
  DROP TABLE "pages_blocks_rich_content_facts" CASCADE;
  DROP TABLE "pages_blocks_link_stack_links" CASCADE;
  DROP TABLE "pages_blocks_link_stack" CASCADE;
  DROP TABLE "pages_blocks_post_list" CASCADE;
  DROP TABLE "pages_blocks_error404_links" CASCADE;
  DROP TABLE "pages_blocks_error404" CASCADE;
  DROP TABLE "_pages_v_blocks_offer_block" CASCADE;
  DROP TABLE "_pages_v_blocks_proof_strip_metrics" CASCADE;
  DROP TABLE "_pages_v_blocks_review_wall_inserts" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_content_facts" CASCADE;
  DROP TABLE "_pages_v_blocks_link_stack_links" CASCADE;
  DROP TABLE "_pages_v_blocks_link_stack" CASCADE;
  DROP TABLE "_pages_v_blocks_post_list" CASCADE;
  DROP TABLE "_pages_v_blocks_error404_links" CASCADE;
  DROP TABLE "_pages_v_blocks_error404" CASCADE;
  ALTER TABLE "pages_blocks_hero" DROP CONSTRAINT "pages_blocks_hero_video_poster_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_hero" DROP CONSTRAINT "pages_blocks_hero_form_id_forms_id_fk";
  
  ALTER TABLE "_pages_v_blocks_hero" DROP CONSTRAINT "_pages_v_blocks_hero_video_poster_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_hero" DROP CONSTRAINT "_pages_v_blocks_hero_form_id_forms_id_fk";
  
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "variant" SET DEFAULT 'typographic'::text;
  DROP TYPE "public"."enum_pages_blocks_hero_variant";
  CREATE TYPE "public"."enum_pages_blocks_hero_variant" AS ENUM('typographic', 'service', 'article');
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "variant" SET DEFAULT 'typographic'::"public"."enum_pages_blocks_hero_variant";
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_hero_variant" USING "variant"::"public"."enum_pages_blocks_hero_variant";
  ALTER TABLE "pages_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DEFAULT 'band'::text;
  DROP TYPE "public"."enum_pages_blocks_mini_c_t_a_strip_variant";
  CREATE TYPE "public"."enum_pages_blocks_mini_c_t_a_strip_variant" AS ENUM('band', 'inline');
  ALTER TABLE "pages_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DEFAULT 'band'::"public"."enum_pages_blocks_mini_c_t_a_strip_variant";
  ALTER TABLE "pages_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_mini_c_t_a_strip_variant" USING "variant"::"public"."enum_pages_blocks_mini_c_t_a_strip_variant";
  ALTER TABLE "pages_blocks_proof_strip" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_proof_strip" ALTER COLUMN "variant" SET DEFAULT 'scarcity'::text;
  DROP TYPE "public"."enum_pages_blocks_proof_strip_variant";
  CREATE TYPE "public"."enum_pages_blocks_proof_strip_variant" AS ENUM('scarcity');
  ALTER TABLE "pages_blocks_proof_strip" ALTER COLUMN "variant" SET DEFAULT 'scarcity'::"public"."enum_pages_blocks_proof_strip_variant";
  ALTER TABLE "pages_blocks_proof_strip" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_proof_strip_variant" USING "variant"::"public"."enum_pages_blocks_proof_strip_variant";
  ALTER TABLE "pages_blocks_review_wall" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_review_wall" ALTER COLUMN "variant" SET DEFAULT 'feed'::text;
  DROP TYPE "public"."enum_pages_blocks_review_wall_variant";
  CREATE TYPE "public"."enum_pages_blocks_review_wall_variant" AS ENUM('feed');
  ALTER TABLE "pages_blocks_review_wall" ALTER COLUMN "variant" SET DEFAULT 'feed'::"public"."enum_pages_blocks_review_wall_variant";
  ALTER TABLE "pages_blocks_review_wall" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_review_wall_variant" USING "variant"::"public"."enum_pages_blocks_review_wall_variant";
  ALTER TABLE "pages_blocks_rich_content" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_rich_content" ALTER COLUMN "variant" SET DEFAULT 'article'::text;
  DROP TYPE "public"."enum_pages_blocks_rich_content_variant";
  CREATE TYPE "public"."enum_pages_blocks_rich_content_variant" AS ENUM('article');
  ALTER TABLE "pages_blocks_rich_content" ALTER COLUMN "variant" SET DEFAULT 'article'::"public"."enum_pages_blocks_rich_content_variant";
  ALTER TABLE "pages_blocks_rich_content" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_rich_content_variant" USING "variant"::"public"."enum_pages_blocks_rich_content_variant";
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "variant" SET DEFAULT 'cards'::text;
  DROP TYPE "public"."enum_pages_blocks_spec_ledger_variant";
  CREATE TYPE "public"."enum_pages_blocks_spec_ledger_variant" AS ENUM('cards', 'expandable', 'signal-flow');
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "variant" SET DEFAULT 'cards'::"public"."enum_pages_blocks_spec_ledger_variant";
  ALTER TABLE "pages_blocks_spec_ledger" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_spec_ledger_variant" USING "variant"::"public"."enum_pages_blocks_spec_ledger_variant";
  ALTER TABLE "pages_blocks_newsletter_band" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_newsletter_band" ALTER COLUMN "variant" SET DEFAULT 'band'::text;
  DROP TYPE "public"."enum_pages_blocks_newsletter_band_variant";
  CREATE TYPE "public"."enum_pages_blocks_newsletter_band_variant" AS ENUM('band');
  ALTER TABLE "pages_blocks_newsletter_band" ALTER COLUMN "variant" SET DEFAULT 'band'::"public"."enum_pages_blocks_newsletter_band_variant";
  ALTER TABLE "pages_blocks_newsletter_band" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_newsletter_band_variant" USING "variant"::"public"."enum_pages_blocks_newsletter_band_variant";
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "variant" SET DEFAULT 'typographic'::text;
  DROP TYPE "public"."enum__pages_v_blocks_hero_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_hero_variant" AS ENUM('typographic', 'service', 'article');
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "variant" SET DEFAULT 'typographic'::"public"."enum__pages_v_blocks_hero_variant";
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_hero_variant" USING "variant"::"public"."enum__pages_v_blocks_hero_variant";
  ALTER TABLE "_pages_v_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DEFAULT 'band'::text;
  DROP TYPE "public"."enum__pages_v_blocks_mini_c_t_a_strip_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_mini_c_t_a_strip_variant" AS ENUM('band', 'inline');
  ALTER TABLE "_pages_v_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DEFAULT 'band'::"public"."enum__pages_v_blocks_mini_c_t_a_strip_variant";
  ALTER TABLE "_pages_v_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_mini_c_t_a_strip_variant" USING "variant"::"public"."enum__pages_v_blocks_mini_c_t_a_strip_variant";
  ALTER TABLE "_pages_v_blocks_proof_strip" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_proof_strip" ALTER COLUMN "variant" SET DEFAULT 'scarcity'::text;
  DROP TYPE "public"."enum__pages_v_blocks_proof_strip_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_proof_strip_variant" AS ENUM('scarcity');
  ALTER TABLE "_pages_v_blocks_proof_strip" ALTER COLUMN "variant" SET DEFAULT 'scarcity'::"public"."enum__pages_v_blocks_proof_strip_variant";
  ALTER TABLE "_pages_v_blocks_proof_strip" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_proof_strip_variant" USING "variant"::"public"."enum__pages_v_blocks_proof_strip_variant";
  ALTER TABLE "_pages_v_blocks_review_wall" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_review_wall" ALTER COLUMN "variant" SET DEFAULT 'feed'::text;
  DROP TYPE "public"."enum__pages_v_blocks_review_wall_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_review_wall_variant" AS ENUM('feed');
  ALTER TABLE "_pages_v_blocks_review_wall" ALTER COLUMN "variant" SET DEFAULT 'feed'::"public"."enum__pages_v_blocks_review_wall_variant";
  ALTER TABLE "_pages_v_blocks_review_wall" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_review_wall_variant" USING "variant"::"public"."enum__pages_v_blocks_review_wall_variant";
  ALTER TABLE "_pages_v_blocks_rich_content" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_rich_content" ALTER COLUMN "variant" SET DEFAULT 'article'::text;
  DROP TYPE "public"."enum__pages_v_blocks_rich_content_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_rich_content_variant" AS ENUM('article');
  ALTER TABLE "_pages_v_blocks_rich_content" ALTER COLUMN "variant" SET DEFAULT 'article'::"public"."enum__pages_v_blocks_rich_content_variant";
  ALTER TABLE "_pages_v_blocks_rich_content" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_rich_content_variant" USING "variant"::"public"."enum__pages_v_blocks_rich_content_variant";
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "variant" SET DEFAULT 'cards'::text;
  DROP TYPE "public"."enum__pages_v_blocks_spec_ledger_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_spec_ledger_variant" AS ENUM('cards', 'expandable', 'signal-flow');
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "variant" SET DEFAULT 'cards'::"public"."enum__pages_v_blocks_spec_ledger_variant";
  ALTER TABLE "_pages_v_blocks_spec_ledger" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_spec_ledger_variant" USING "variant"::"public"."enum__pages_v_blocks_spec_ledger_variant";
  ALTER TABLE "_pages_v_blocks_newsletter_band" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_newsletter_band" ALTER COLUMN "variant" SET DEFAULT 'band'::text;
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_band_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_newsletter_band_variant" AS ENUM('band');
  ALTER TABLE "_pages_v_blocks_newsletter_band" ALTER COLUMN "variant" SET DEFAULT 'band'::"public"."enum__pages_v_blocks_newsletter_band_variant";
  ALTER TABLE "_pages_v_blocks_newsletter_band" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_newsletter_band_variant" USING "variant"::"public"."enum__pages_v_blocks_newsletter_band_variant";
  DROP INDEX "pages_blocks_hero_video_video_poster_idx";
  DROP INDEX "pages_blocks_hero_form_idx";
  DROP INDEX "_pages_v_blocks_hero_video_video_poster_idx";
  DROP INDEX "_pages_v_blocks_hero_form_idx";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "standfirst";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "video_url";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "video_poster_id";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "show_form";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "form_id";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "form_style";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "form_heading";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "form_body";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "submit_label";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "form_note";
  ALTER TABLE "pages_blocks_proof_strip" DROP COLUMN "capacity_statement";
  ALTER TABLE "pages_blocks_review_wall" DROP COLUMN "wall_note";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "cta_style";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "lead_metric_value";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "lead_metric_label";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "lead_metric_sub";
  ALTER TABLE "pages_blocks_testimonial_row" DROP COLUMN "lead_metric_accent";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "last_updated";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "last_updated_label";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "nav_label";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "pricing_note";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "link_type";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "link_label";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "tone";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "framed";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "callout_eyebrow";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "callout_body";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "callout_link_type";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "callout_link_new_tab";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "callout_link_url";
  ALTER TABLE "pages_blocks_rich_content" DROP COLUMN "callout_link_label";
  ALTER TABLE "pages_blocks_newsletter_band" DROP COLUMN "delivered_eyebrow";
  ALTER TABLE "pages_blocks_newsletter_band" DROP COLUMN "delivered_heading";
  ALTER TABLE "pages_blocks_newsletter_band" DROP COLUMN "delivered_accent_phrase";
  ALTER TABLE "pages_blocks_newsletter_band" DROP COLUMN "delivered_body";
  ALTER TABLE "pages_blocks_newsletter_band" DROP COLUMN "delivered_cross_sell_line";
  ALTER TABLE "pages_blocks_newsletter_band" DROP COLUMN "cross_sell_link_type";
  ALTER TABLE "pages_blocks_newsletter_band" DROP COLUMN "cross_sell_link_new_tab";
  ALTER TABLE "pages_blocks_newsletter_band" DROP COLUMN "cross_sell_link_url";
  ALTER TABLE "pages_blocks_newsletter_band" DROP COLUMN "cross_sell_link_label";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "standfirst";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "video_url";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "video_poster_id";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "show_form";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "form_id";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "form_style";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "form_heading";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "form_body";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "submit_label";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "form_note";
  ALTER TABLE "_pages_v_blocks_proof_strip" DROP COLUMN "capacity_statement";
  ALTER TABLE "_pages_v_blocks_review_wall" DROP COLUMN "wall_note";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "cta_style";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "lead_metric_value";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "lead_metric_label";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "lead_metric_sub";
  ALTER TABLE "_pages_v_blocks_testimonial_row" DROP COLUMN "lead_metric_accent";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "last_updated";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "last_updated_label";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "nav_label";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "pricing_note";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "link_type";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "tone";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "framed";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "callout_eyebrow";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "callout_body";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "callout_link_type";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "callout_link_new_tab";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "callout_link_url";
  ALTER TABLE "_pages_v_blocks_rich_content" DROP COLUMN "callout_link_label";
  ALTER TABLE "_pages_v_blocks_newsletter_band" DROP COLUMN "delivered_eyebrow";
  ALTER TABLE "_pages_v_blocks_newsletter_band" DROP COLUMN "delivered_heading";
  ALTER TABLE "_pages_v_blocks_newsletter_band" DROP COLUMN "delivered_accent_phrase";
  ALTER TABLE "_pages_v_blocks_newsletter_band" DROP COLUMN "delivered_body";
  ALTER TABLE "_pages_v_blocks_newsletter_band" DROP COLUMN "delivered_cross_sell_line";
  ALTER TABLE "_pages_v_blocks_newsletter_band" DROP COLUMN "cross_sell_link_type";
  ALTER TABLE "_pages_v_blocks_newsletter_band" DROP COLUMN "cross_sell_link_new_tab";
  ALTER TABLE "_pages_v_blocks_newsletter_band" DROP COLUMN "cross_sell_link_url";
  ALTER TABLE "_pages_v_blocks_newsletter_band" DROP COLUMN "cross_sell_link_label";
  ALTER TABLE "site_settings" DROP COLUMN "post_labels_byline_prefix";
  ALTER TABLE "site_settings" DROP COLUMN "post_labels_byline_organisation";
  ALTER TABLE "site_settings" DROP COLUMN "post_labels_published_prefix";
  ALTER TABLE "site_settings" DROP COLUMN "post_labels_updated_prefix";
  ALTER TABLE "site_settings" DROP COLUMN "post_labels_read_time_suffix";
  ALTER TABLE "site_settings" DROP COLUMN "post_labels_faq_eyebrow_suffix";
  ALTER TABLE "site_settings" DROP COLUMN "post_labels_how_we_do_it_eyebrow";
  ALTER TABLE "site_settings" DROP COLUMN "post_labels_issue_word";
  DROP TYPE "public"."enum_pages_blocks_hero_form_style";
  DROP TYPE "public"."enum_pages_blocks_offer_block_cta_type";
  DROP TYPE "public"."enum_pages_blocks_offer_block_capacity";
  DROP TYPE "public"."enum_pages_blocks_proof_strip_capacity_statement";
  DROP TYPE "public"."enum_pages_blocks_review_wall_inserts_kind";
  DROP TYPE "public"."enum_pages_blocks_review_wall_inserts_statement";
  DROP TYPE "public"."enum_pages_blocks_testimonial_row_cta_style";
  DROP TYPE "public"."enum_pages_blocks_rich_content_link_type";
  DROP TYPE "public"."enum_pages_blocks_rich_content_tone";
  DROP TYPE "public"."enum_pages_blocks_rich_content_callout_link_type";
  DROP TYPE "public"."enum_pages_blocks_newsletter_band_cross_sell_link_type";
  DROP TYPE "public"."enum_pages_blocks_link_stack_links_icon";
  DROP TYPE "public"."enum_pages_blocks_link_stack_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_link_stack_primary_link_type";
  DROP TYPE "public"."enum_pages_blocks_link_stack_primary_capacity";
  DROP TYPE "public"."enum_pages_blocks_link_stack_current_push_icon";
  DROP TYPE "public"."enum_pages_blocks_link_stack_current_push_link_type";
  DROP TYPE "public"."enum_pages_blocks_post_list_track";
  DROP TYPE "public"."enum_pages_blocks_post_list_archive_link_type";
  DROP TYPE "public"."enum_pages_blocks_error404_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_hero_form_style";
  DROP TYPE "public"."enum__pages_v_blocks_offer_block_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_offer_block_capacity";
  DROP TYPE "public"."enum__pages_v_blocks_proof_strip_capacity_statement";
  DROP TYPE "public"."enum__pages_v_blocks_review_wall_inserts_kind";
  DROP TYPE "public"."enum__pages_v_blocks_review_wall_inserts_statement";
  DROP TYPE "public"."enum__pages_v_blocks_testimonial_row_cta_style";
  DROP TYPE "public"."enum__pages_v_blocks_rich_content_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_rich_content_tone";
  DROP TYPE "public"."enum__pages_v_blocks_rich_content_callout_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_newsletter_band_cross_sell_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_link_stack_links_icon";
  DROP TYPE "public"."enum__pages_v_blocks_link_stack_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_link_stack_primary_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_link_stack_primary_capacity";
  DROP TYPE "public"."enum__pages_v_blocks_link_stack_current_push_icon";
  DROP TYPE "public"."enum__pages_v_blocks_link_stack_current_push_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_post_list_track";
  DROP TYPE "public"."enum__pages_v_blocks_post_list_archive_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_error404_links_link_type";`)
}
