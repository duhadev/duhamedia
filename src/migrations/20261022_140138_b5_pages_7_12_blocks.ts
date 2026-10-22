import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_size" AS ENUM('default', 'compact');
  CREATE TYPE "public"."enum_pages_blocks_review_wall_source_filter" AS ENUM('direct', 'google-review', 'linkedin');
  CREATE TYPE "public"."enum_pages_blocks_review_wall_variant" AS ENUM('feed');
  CREATE TYPE "public"."enum_pages_blocks_review_wall_source" AS ENUM('all', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_form_embed_reasons_icon" AS ENUM('chart', 'clock', 'target', 'check');
  CREATE TYPE "public"."enum_pages_blocks_form_embed_variant" AS ENUM('standard', 'reminder');
  CREATE TYPE "public"."enum_pages_blocks_form_embed_ground" AS ENUM('light', 'grey');
  CREATE TYPE "public"."enum_pages_blocks_form_embed_mobile_layout" AS ENUM('stacked', 'stepped');
  CREATE TYPE "public"."enum_pages_blocks_booking_embed_fallback_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_accordion_f_a_q_spacing" AS ENUM('middle', 'first', 'last', 'only');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_size" AS ENUM('default', 'compact');
  CREATE TYPE "public"."enum__pages_v_blocks_review_wall_source_filter" AS ENUM('direct', 'google-review', 'linkedin');
  CREATE TYPE "public"."enum__pages_v_blocks_review_wall_variant" AS ENUM('feed');
  CREATE TYPE "public"."enum__pages_v_blocks_review_wall_source" AS ENUM('all', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_form_embed_reasons_icon" AS ENUM('chart', 'clock', 'target', 'check');
  CREATE TYPE "public"."enum__pages_v_blocks_form_embed_variant" AS ENUM('standard', 'reminder');
  CREATE TYPE "public"."enum__pages_v_blocks_form_embed_ground" AS ENUM('light', 'grey');
  CREATE TYPE "public"."enum__pages_v_blocks_form_embed_mobile_layout" AS ENUM('stacked', 'stepped');
  CREATE TYPE "public"."enum__pages_v_blocks_booking_embed_fallback_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_spacing" AS ENUM('middle', 'first', 'last', 'only');
  ALTER TYPE "public"."enum_pages_blocks_mini_c_t_a_strip_variant" ADD VALUE 'inline';
  ALTER TYPE "public"."enum_pages_blocks_case_study_cards_fallback_mode" ADD VALUE 'logo-strip';
  ALTER TYPE "public"."enum_pages_blocks_metric_event_variant" ADD VALUE 'facts';
  ALTER TYPE "public"."enum_pages_blocks_accordion_f_a_q_variant" ADD VALUE 'group';
  ALTER TYPE "public"."enum__pages_v_blocks_mini_c_t_a_strip_variant" ADD VALUE 'inline';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_cards_fallback_mode" ADD VALUE 'logo-strip';
  ALTER TYPE "public"."enum__pages_v_blocks_metric_event_variant" ADD VALUE 'facts';
  ALTER TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_variant" ADD VALUE 'group';
  CREATE TABLE "pages_blocks_hero_callouts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_review_wall_source_filter" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_pages_blocks_review_wall_source_filter",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_review_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_review_wall_variant" DEFAULT 'feed',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT true,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"source" "enum_pages_blocks_review_wall_source" DEFAULT 'all',
  	"page_size" numeric DEFAULT 6,
  	"show_study_links" boolean DEFAULT true,
  	"study_link_label" varchar DEFAULT 'Read the full case study',
  	"labels_video" varchar DEFAULT 'Video',
  	"labels_google_review" varchar DEFAULT 'Google review',
  	"labels_linkedin" varchar DEFAULT 'LinkedIn',
  	"labels_play" varchar DEFAULT 'Play the video testimonial from',
  	"load_more_label" varchar DEFAULT 'Load more',
  	"load_more_loading_label" varchar DEFAULT 'Loading…',
  	"load_more_error_label" varchar DEFAULT 'Could not load more testimonials. Try again.',
  	"empty_note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_embed_reasons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_form_embed_reasons_icon" DEFAULT 'check',
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_form_embed_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"hint" varchar
  );
  
  CREATE TABLE "pages_blocks_form_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_form_embed_variant" DEFAULT 'standard',
  	"form_id" integer,
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"alert_label" varchar,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"body" varchar,
  	"submit_label" varchar,
  	"ground" "enum_pages_blocks_form_embed_ground" DEFAULT 'light',
  	"mobile_layout" "enum_pages_blocks_form_embed_mobile_layout" DEFAULT 'stacked',
  	"stepped_progress_label" varchar DEFAULT 'Question {n} of {m}',
  	"stepped_start_label" varchar DEFAULT 'Start',
  	"stepped_next_label" varchar DEFAULT 'Next',
  	"stepped_back_label" varchar DEFAULT 'Back',
  	"stepped_select_as_options" boolean DEFAULT true,
  	"done_heading" varchar DEFAULT 'Homework received.',
  	"done_body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_booking_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"body" varchar,
  	"button_label" varchar DEFAULT 'Book your call',
  	"note_under_button" varchar,
  	"new_tab_label" varchar DEFAULT 'Trouble with the calendar? Open it in a new tab',
  	"thank_you_page_id" integer,
  	"fallback_heading" varchar DEFAULT 'Booking is offline. Write to us instead.',
  	"fallback_body" varchar,
  	"fallback_link_type" "enum_pages_blocks_booking_embed_fallback_link_type" DEFAULT 'internal',
  	"fallback_link_new_tab" boolean DEFAULT false,
  	"fallback_link_url" varchar,
  	"fallback_link_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_direct_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"show_email" boolean DEFAULT true,
  	"show_socials" boolean DEFAULT true,
  	"show_location" boolean DEFAULT true,
  	"skip_form_line" varchar DEFAULT 'Skip the form',
  	"row_labels_email" varchar DEFAULT 'Email',
  	"row_labels_socials" varchar DEFAULT 'Socials',
  	"row_labels_location" varchar DEFAULT 'Location',
  	"row_labels_reply_time" varchar DEFAULT 'Reply time',
  	"map_show" boolean DEFAULT true,
  	"map_caption" varchar DEFAULT 'Based in Lombard, IL — serving the greater Chicagoland area within a ~30-mile radius. Outside the ring? We work remote-first, so reach out anyway.',
  	"map_zoom" numeric DEFAULT 1,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_category_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"aria_label" varchar DEFAULT 'FAQ categories',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_callouts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_review_wall_source_filter" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__pages_v_blocks_review_wall_source_filter",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_review_wall" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_review_wall_variant" DEFAULT 'feed',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT true,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"source" "enum__pages_v_blocks_review_wall_source" DEFAULT 'all',
  	"page_size" numeric DEFAULT 6,
  	"show_study_links" boolean DEFAULT true,
  	"study_link_label" varchar DEFAULT 'Read the full case study',
  	"labels_video" varchar DEFAULT 'Video',
  	"labels_google_review" varchar DEFAULT 'Google review',
  	"labels_linkedin" varchar DEFAULT 'LinkedIn',
  	"labels_play" varchar DEFAULT 'Play the video testimonial from',
  	"load_more_label" varchar DEFAULT 'Load more',
  	"load_more_loading_label" varchar DEFAULT 'Loading…',
  	"load_more_error_label" varchar DEFAULT 'Could not load more testimonials. Try again.',
  	"empty_note" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_embed_reasons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_form_embed_reasons_icon" DEFAULT 'check',
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_embed_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"hint" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_form_embed_variant" DEFAULT 'standard',
  	"form_id" integer,
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"alert_label" varchar,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"body" varchar,
  	"submit_label" varchar,
  	"ground" "enum__pages_v_blocks_form_embed_ground" DEFAULT 'light',
  	"mobile_layout" "enum__pages_v_blocks_form_embed_mobile_layout" DEFAULT 'stacked',
  	"stepped_progress_label" varchar DEFAULT 'Question {n} of {m}',
  	"stepped_start_label" varchar DEFAULT 'Start',
  	"stepped_next_label" varchar DEFAULT 'Next',
  	"stepped_back_label" varchar DEFAULT 'Back',
  	"stepped_select_as_options" boolean DEFAULT true,
  	"done_heading" varchar DEFAULT 'Homework received.',
  	"done_body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_booking_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"body" varchar,
  	"button_label" varchar DEFAULT 'Book your call',
  	"note_under_button" varchar,
  	"new_tab_label" varchar DEFAULT 'Trouble with the calendar? Open it in a new tab',
  	"thank_you_page_id" integer,
  	"fallback_heading" varchar DEFAULT 'Booking is offline. Write to us instead.',
  	"fallback_body" varchar,
  	"fallback_link_type" "enum__pages_v_blocks_booking_embed_fallback_link_type" DEFAULT 'internal',
  	"fallback_link_new_tab" boolean DEFAULT false,
  	"fallback_link_url" varchar,
  	"fallback_link_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_direct_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_email" boolean DEFAULT true,
  	"show_socials" boolean DEFAULT true,
  	"show_location" boolean DEFAULT true,
  	"skip_form_line" varchar DEFAULT 'Skip the form',
  	"row_labels_email" varchar DEFAULT 'Email',
  	"row_labels_socials" varchar DEFAULT 'Socials',
  	"row_labels_location" varchar DEFAULT 'Location',
  	"row_labels_reply_time" varchar DEFAULT 'Reply time',
  	"map_show" boolean DEFAULT true,
  	"map_caption" varchar DEFAULT 'Based in Lombard, IL — serving the greater Chicagoland area within a ~30-mile radius. Outside the ring? We work remote-first, so reach out anyway.',
  	"map_zoom" numeric DEFAULT 1,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"aria_label" varchar DEFAULT 'FAQ categories',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "size" "enum_pages_blocks_hero_size" DEFAULT 'default';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "show_aggregate_rating" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_accordion_f_a_q" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "pages_blocks_accordion_f_a_q" ADD COLUMN "spacing" "enum_pages_blocks_accordion_f_a_q_spacing" DEFAULT 'middle';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "size" "enum__pages_v_blocks_hero_size" DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "show_aggregate_rating" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" ADD COLUMN "anchor_id" varchar;
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" ADD COLUMN "spacing" "enum__pages_v_blocks_accordion_f_a_q_spacing" DEFAULT 'middle';
  ALTER TABLE "pages_blocks_hero_callouts" ADD CONSTRAINT "pages_blocks_hero_callouts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_review_wall_source_filter" ADD CONSTRAINT "pages_blocks_review_wall_source_filter_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_blocks_review_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_review_wall" ADD CONSTRAINT "pages_blocks_review_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_embed_reasons" ADD CONSTRAINT "pages_blocks_form_embed_reasons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_embed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_embed_steps" ADD CONSTRAINT "pages_blocks_form_embed_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_embed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_embed" ADD CONSTRAINT "pages_blocks_form_embed_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_embed" ADD CONSTRAINT "pages_blocks_form_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_embed" ADD CONSTRAINT "pages_blocks_booking_embed_thank_you_page_id_pages_id_fk" FOREIGN KEY ("thank_you_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_embed" ADD CONSTRAINT "pages_blocks_booking_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_direct_contact" ADD CONSTRAINT "pages_blocks_direct_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_tabs" ADD CONSTRAINT "pages_blocks_category_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_callouts" ADD CONSTRAINT "_pages_v_blocks_hero_callouts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_review_wall_source_filter" ADD CONSTRAINT "_pages_v_blocks_review_wall_source_filter_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v_blocks_review_wall"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_review_wall" ADD CONSTRAINT "_pages_v_blocks_review_wall_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_embed_reasons" ADD CONSTRAINT "_pages_v_blocks_form_embed_reasons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_embed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_embed_steps" ADD CONSTRAINT "_pages_v_blocks_form_embed_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_embed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_embed" ADD CONSTRAINT "_pages_v_blocks_form_embed_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_embed" ADD CONSTRAINT "_pages_v_blocks_form_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD CONSTRAINT "_pages_v_blocks_booking_embed_thank_you_page_id_pages_id_fk" FOREIGN KEY ("thank_you_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD CONSTRAINT "_pages_v_blocks_booking_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_direct_contact" ADD CONSTRAINT "_pages_v_blocks_direct_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_tabs" ADD CONSTRAINT "_pages_v_blocks_category_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_texts" ADD CONSTRAINT "_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_callouts_order_idx" ON "pages_blocks_hero_callouts" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_callouts_parent_id_idx" ON "pages_blocks_hero_callouts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_review_wall_source_filter_order_idx" ON "pages_blocks_review_wall_source_filter" USING btree ("order");
  CREATE INDEX "pages_blocks_review_wall_source_filter_parent_idx" ON "pages_blocks_review_wall_source_filter" USING btree ("parent_id");
  CREATE INDEX "pages_blocks_review_wall_order_idx" ON "pages_blocks_review_wall" USING btree ("_order");
  CREATE INDEX "pages_blocks_review_wall_parent_id_idx" ON "pages_blocks_review_wall" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_review_wall_path_idx" ON "pages_blocks_review_wall" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_embed_reasons_order_idx" ON "pages_blocks_form_embed_reasons" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_embed_reasons_parent_id_idx" ON "pages_blocks_form_embed_reasons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_embed_steps_order_idx" ON "pages_blocks_form_embed_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_embed_steps_parent_id_idx" ON "pages_blocks_form_embed_steps" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_embed_order_idx" ON "pages_blocks_form_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_embed_parent_id_idx" ON "pages_blocks_form_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_embed_path_idx" ON "pages_blocks_form_embed" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_embed_form_idx" ON "pages_blocks_form_embed" USING btree ("form_id");
  CREATE INDEX "pages_blocks_booking_embed_order_idx" ON "pages_blocks_booking_embed" USING btree ("_order");
  CREATE INDEX "pages_blocks_booking_embed_parent_id_idx" ON "pages_blocks_booking_embed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_booking_embed_path_idx" ON "pages_blocks_booking_embed" USING btree ("_path");
  CREATE INDEX "pages_blocks_booking_embed_thank_you_page_idx" ON "pages_blocks_booking_embed" USING btree ("thank_you_page_id");
  CREATE INDEX "pages_blocks_direct_contact_order_idx" ON "pages_blocks_direct_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_direct_contact_parent_id_idx" ON "pages_blocks_direct_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_direct_contact_path_idx" ON "pages_blocks_direct_contact" USING btree ("_path");
  CREATE INDEX "pages_blocks_category_tabs_order_idx" ON "pages_blocks_category_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_tabs_parent_id_idx" ON "pages_blocks_category_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_tabs_path_idx" ON "pages_blocks_category_tabs" USING btree ("_path");
  CREATE INDEX "pages_texts_order_parent" ON "pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "_pages_v_blocks_hero_callouts_order_idx" ON "_pages_v_blocks_hero_callouts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_callouts_parent_id_idx" ON "_pages_v_blocks_hero_callouts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_review_wall_source_filter_order_idx" ON "_pages_v_blocks_review_wall_source_filter" USING btree ("order");
  CREATE INDEX "_pages_v_blocks_review_wall_source_filter_parent_idx" ON "_pages_v_blocks_review_wall_source_filter" USING btree ("parent_id");
  CREATE INDEX "_pages_v_blocks_review_wall_order_idx" ON "_pages_v_blocks_review_wall" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_review_wall_parent_id_idx" ON "_pages_v_blocks_review_wall" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_review_wall_path_idx" ON "_pages_v_blocks_review_wall" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_embed_reasons_order_idx" ON "_pages_v_blocks_form_embed_reasons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_embed_reasons_parent_id_idx" ON "_pages_v_blocks_form_embed_reasons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_embed_steps_order_idx" ON "_pages_v_blocks_form_embed_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_embed_steps_parent_id_idx" ON "_pages_v_blocks_form_embed_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_embed_order_idx" ON "_pages_v_blocks_form_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_embed_parent_id_idx" ON "_pages_v_blocks_form_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_embed_path_idx" ON "_pages_v_blocks_form_embed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_embed_form_idx" ON "_pages_v_blocks_form_embed" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_booking_embed_order_idx" ON "_pages_v_blocks_booking_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_booking_embed_parent_id_idx" ON "_pages_v_blocks_booking_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_booking_embed_path_idx" ON "_pages_v_blocks_booking_embed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_booking_embed_thank_you_page_idx" ON "_pages_v_blocks_booking_embed" USING btree ("thank_you_page_id");
  CREATE INDEX "_pages_v_blocks_direct_contact_order_idx" ON "_pages_v_blocks_direct_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_direct_contact_parent_id_idx" ON "_pages_v_blocks_direct_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_direct_contact_path_idx" ON "_pages_v_blocks_direct_contact" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_category_tabs_order_idx" ON "_pages_v_blocks_category_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_tabs_parent_id_idx" ON "_pages_v_blocks_category_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_tabs_path_idx" ON "_pages_v_blocks_category_tabs" USING btree ("_path");
  CREATE INDEX "_pages_v_texts_order_parent" ON "_pages_v_texts" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_callouts" CASCADE;
  DROP TABLE "pages_blocks_review_wall_source_filter" CASCADE;
  DROP TABLE "pages_blocks_review_wall" CASCADE;
  DROP TABLE "pages_blocks_form_embed_reasons" CASCADE;
  DROP TABLE "pages_blocks_form_embed_steps" CASCADE;
  DROP TABLE "pages_blocks_form_embed" CASCADE;
  DROP TABLE "pages_blocks_booking_embed" CASCADE;
  DROP TABLE "pages_blocks_direct_contact" CASCADE;
  DROP TABLE "pages_blocks_category_tabs" CASCADE;
  DROP TABLE "pages_texts" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_callouts" CASCADE;
  DROP TABLE "_pages_v_blocks_review_wall_source_filter" CASCADE;
  DROP TABLE "_pages_v_blocks_review_wall" CASCADE;
  DROP TABLE "_pages_v_blocks_form_embed_reasons" CASCADE;
  DROP TABLE "_pages_v_blocks_form_embed_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_form_embed" CASCADE;
  DROP TABLE "_pages_v_blocks_booking_embed" CASCADE;
  DROP TABLE "_pages_v_blocks_direct_contact" CASCADE;
  DROP TABLE "_pages_v_blocks_category_tabs" CASCADE;
  DROP TABLE "_pages_v_texts" CASCADE;
  ALTER TABLE "pages_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DEFAULT 'band'::text;
  DROP TYPE "public"."enum_pages_blocks_mini_c_t_a_strip_variant";
  CREATE TYPE "public"."enum_pages_blocks_mini_c_t_a_strip_variant" AS ENUM('band');
  ALTER TABLE "pages_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DEFAULT 'band'::"public"."enum_pages_blocks_mini_c_t_a_strip_variant";
  ALTER TABLE "pages_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_mini_c_t_a_strip_variant" USING "variant"::"public"."enum_pages_blocks_mini_c_t_a_strip_variant";
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DEFAULT 'ledger'::text;
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_fallback_mode";
  CREATE TYPE "public"."enum_pages_blocks_case_study_cards_fallback_mode" AS ENUM('ledger', 'note', 'testimonials', 'metric-strip');
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DEFAULT 'ledger'::"public"."enum_pages_blocks_case_study_cards_fallback_mode";
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DATA TYPE "public"."enum_pages_blocks_case_study_cards_fallback_mode" USING "fallback_mode"::"public"."enum_pages_blocks_case_study_cards_fallback_mode";
  ALTER TABLE "pages_blocks_metric_event" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_metric_event" ALTER COLUMN "variant" SET DEFAULT 'table'::text;
  DROP TYPE "public"."enum_pages_blocks_metric_event_variant";
  CREATE TYPE "public"."enum_pages_blocks_metric_event_variant" AS ENUM('table');
  ALTER TABLE "pages_blocks_metric_event" ALTER COLUMN "variant" SET DEFAULT 'table'::"public"."enum_pages_blocks_metric_event_variant";
  ALTER TABLE "pages_blocks_metric_event" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_metric_event_variant" USING "variant"::"public"."enum_pages_blocks_metric_event_variant";
  ALTER TABLE "pages_blocks_accordion_f_a_q" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_accordion_f_a_q" ALTER COLUMN "variant" SET DEFAULT 'mini'::text;
  DROP TYPE "public"."enum_pages_blocks_accordion_f_a_q_variant";
  CREATE TYPE "public"."enum_pages_blocks_accordion_f_a_q_variant" AS ENUM('mini');
  ALTER TABLE "pages_blocks_accordion_f_a_q" ALTER COLUMN "variant" SET DEFAULT 'mini'::"public"."enum_pages_blocks_accordion_f_a_q_variant";
  ALTER TABLE "pages_blocks_accordion_f_a_q" ALTER COLUMN "variant" SET DATA TYPE "public"."enum_pages_blocks_accordion_f_a_q_variant" USING "variant"::"public"."enum_pages_blocks_accordion_f_a_q_variant";
  ALTER TABLE "_pages_v_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DEFAULT 'band'::text;
  DROP TYPE "public"."enum__pages_v_blocks_mini_c_t_a_strip_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_mini_c_t_a_strip_variant" AS ENUM('band');
  ALTER TABLE "_pages_v_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DEFAULT 'band'::"public"."enum__pages_v_blocks_mini_c_t_a_strip_variant";
  ALTER TABLE "_pages_v_blocks_mini_c_t_a_strip" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_mini_c_t_a_strip_variant" USING "variant"::"public"."enum__pages_v_blocks_mini_c_t_a_strip_variant";
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DEFAULT 'ledger'::text;
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cards_fallback_mode";
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cards_fallback_mode" AS ENUM('ledger', 'note', 'testimonials', 'metric-strip');
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DEFAULT 'ledger'::"public"."enum__pages_v_blocks_case_study_cards_fallback_mode";
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "fallback_mode" SET DATA TYPE "public"."enum__pages_v_blocks_case_study_cards_fallback_mode" USING "fallback_mode"::"public"."enum__pages_v_blocks_case_study_cards_fallback_mode";
  ALTER TABLE "_pages_v_blocks_metric_event" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_metric_event" ALTER COLUMN "variant" SET DEFAULT 'table'::text;
  DROP TYPE "public"."enum__pages_v_blocks_metric_event_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_metric_event_variant" AS ENUM('table');
  ALTER TABLE "_pages_v_blocks_metric_event" ALTER COLUMN "variant" SET DEFAULT 'table'::"public"."enum__pages_v_blocks_metric_event_variant";
  ALTER TABLE "_pages_v_blocks_metric_event" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_metric_event_variant" USING "variant"::"public"."enum__pages_v_blocks_metric_event_variant";
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" ALTER COLUMN "variant" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" ALTER COLUMN "variant" SET DEFAULT 'mini'::text;
  DROP TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_variant";
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_variant" AS ENUM('mini');
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" ALTER COLUMN "variant" SET DEFAULT 'mini'::"public"."enum__pages_v_blocks_accordion_f_a_q_variant";
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" ALTER COLUMN "variant" SET DATA TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_variant" USING "variant"::"public"."enum__pages_v_blocks_accordion_f_a_q_variant";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "size";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "show_aggregate_rating";
  ALTER TABLE "pages_blocks_accordion_f_a_q" DROP COLUMN "anchor_id";
  ALTER TABLE "pages_blocks_accordion_f_a_q" DROP COLUMN "spacing";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "size";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "show_aggregate_rating";
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" DROP COLUMN "anchor_id";
  ALTER TABLE "_pages_v_blocks_accordion_f_a_q" DROP COLUMN "spacing";
  DROP TYPE "public"."enum_pages_blocks_hero_size";
  DROP TYPE "public"."enum_pages_blocks_review_wall_source_filter";
  DROP TYPE "public"."enum_pages_blocks_review_wall_variant";
  DROP TYPE "public"."enum_pages_blocks_review_wall_source";
  DROP TYPE "public"."enum_pages_blocks_form_embed_reasons_icon";
  DROP TYPE "public"."enum_pages_blocks_form_embed_variant";
  DROP TYPE "public"."enum_pages_blocks_form_embed_ground";
  DROP TYPE "public"."enum_pages_blocks_form_embed_mobile_layout";
  DROP TYPE "public"."enum_pages_blocks_booking_embed_fallback_link_type";
  DROP TYPE "public"."enum_pages_blocks_accordion_f_a_q_spacing";
  DROP TYPE "public"."enum__pages_v_blocks_hero_size";
  DROP TYPE "public"."enum__pages_v_blocks_review_wall_source_filter";
  DROP TYPE "public"."enum__pages_v_blocks_review_wall_variant";
  DROP TYPE "public"."enum__pages_v_blocks_review_wall_source";
  DROP TYPE "public"."enum__pages_v_blocks_form_embed_reasons_icon";
  DROP TYPE "public"."enum__pages_v_blocks_form_embed_variant";
  DROP TYPE "public"."enum__pages_v_blocks_form_embed_ground";
  DROP TYPE "public"."enum__pages_v_blocks_form_embed_mobile_layout";
  DROP TYPE "public"."enum__pages_v_blocks_booking_embed_fallback_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_accordion_f_a_q_spacing";`)
}
