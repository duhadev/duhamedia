import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_width" AS ENUM('narrow', 'wide');
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "fallback_eyebrow" SET DEFAULT 'The numbers we can show';
  ALTER TABLE "pages_blocks_direct_contact" ALTER COLUMN "map_caption" DROP DEFAULT;
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "fallback_eyebrow" SET DEFAULT 'The numbers we can show';
  ALTER TABLE "_pages_v_blocks_direct_contact" ALTER COLUMN "map_caption" DROP DEFAULT;
  ALTER TABLE "seo_defaults" ALTER COLUMN "local_business_type" DROP DEFAULT;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "width" "enum_pages_blocks_hero_width";
  ALTER TABLE "pages_blocks_phase_timeline" ADD COLUMN "outcomes_label" varchar DEFAULT 'You leave with';
  ALTER TABLE "pages_blocks_phase_timeline" ADD COLUMN "swipe_hint" varchar DEFAULT 'Swipe →';
  ALTER TABLE "pages_blocks_form_embed" ADD COLUMN "stepped_confirmation_heading" varchar DEFAULT 'Got it, {firstName}.';
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "width" "enum__pages_v_blocks_hero_width";
  ALTER TABLE "_pages_v_blocks_phase_timeline" ADD COLUMN "outcomes_label" varchar DEFAULT 'You leave with';
  ALTER TABLE "_pages_v_blocks_phase_timeline" ADD COLUMN "swipe_hint" varchar DEFAULT 'Swipe →';
  ALTER TABLE "_pages_v_blocks_form_embed" ADD COLUMN "stepped_confirmation_heading" varchar DEFAULT 'Got it, {firstName}.';
  ALTER TABLE "site_settings" ADD COLUMN "case_study_labels_breadcrumb_work" varchar DEFAULT 'Work';
  ALTER TABLE "site_settings" ADD COLUMN "case_study_labels_study_word" varchar DEFAULT 'Study';
  ALTER TABLE "site_settings" ADD COLUMN "case_study_labels_in_short" varchar DEFAULT 'In short';
  ALTER TABLE "site_settings" ADD COLUMN "case_study_labels_published_prefix" varchar DEFAULT 'Published';
  ALTER TABLE "site_settings" ADD COLUMN "case_study_labels_figures_approved" varchar DEFAULT 'Client-approved figures';
  ALTER TABLE "site_settings" ADD COLUMN "case_study_labels_read_time_suffix" varchar DEFAULT 'min read';
  ALTER TABLE "site_settings" ADD COLUMN "case_study_labels_client_voice_number" varchar DEFAULT '04';
  ALTER TABLE "site_settings" ADD COLUMN "case_study_labels_client_voice_differently" varchar DEFAULT 'What we''d do differently';
  ALTER TABLE "site_settings" ADD COLUMN "case_study_labels_client_voice_phases" varchar DEFAULT 'How this maps to our phases';
  ALTER TABLE "site_settings" ADD COLUMN "case_study_labels_next_study" varchar DEFAULT 'Next study';
  ALTER TABLE "site_settings" ADD COLUMN "case_study_labels_next_study_read" varchar DEFAULT 'Read it →';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "fallback_eyebrow" SET DEFAULT 'No studies live yet — the numbers we can show';
  ALTER TABLE "pages_blocks_direct_contact" ALTER COLUMN "map_caption" SET DEFAULT 'Based in Lombard, IL — serving the greater Chicagoland area within a ~30-mile radius. Outside the ring? We work remote-first, so reach out anyway.';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "fallback_eyebrow" SET DEFAULT 'No studies live yet — the numbers we can show';
  ALTER TABLE "_pages_v_blocks_direct_contact" ALTER COLUMN "map_caption" SET DEFAULT 'Based in Lombard, IL — serving the greater Chicagoland area within a ~30-mile radius. Outside the ring? We work remote-first, so reach out anyway.';
  ALTER TABLE "seo_defaults" ALTER COLUMN "local_business_type" SET DEFAULT 'ProfessionalService';
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "width";
  ALTER TABLE "pages_blocks_phase_timeline" DROP COLUMN "outcomes_label";
  ALTER TABLE "pages_blocks_phase_timeline" DROP COLUMN "swipe_hint";
  ALTER TABLE "pages_blocks_form_embed" DROP COLUMN "stepped_confirmation_heading";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "width";
  ALTER TABLE "_pages_v_blocks_phase_timeline" DROP COLUMN "outcomes_label";
  ALTER TABLE "_pages_v_blocks_phase_timeline" DROP COLUMN "swipe_hint";
  ALTER TABLE "_pages_v_blocks_form_embed" DROP COLUMN "stepped_confirmation_heading";
  ALTER TABLE "site_settings" DROP COLUMN "case_study_labels_breadcrumb_work";
  ALTER TABLE "site_settings" DROP COLUMN "case_study_labels_study_word";
  ALTER TABLE "site_settings" DROP COLUMN "case_study_labels_in_short";
  ALTER TABLE "site_settings" DROP COLUMN "case_study_labels_published_prefix";
  ALTER TABLE "site_settings" DROP COLUMN "case_study_labels_figures_approved";
  ALTER TABLE "site_settings" DROP COLUMN "case_study_labels_read_time_suffix";
  ALTER TABLE "site_settings" DROP COLUMN "case_study_labels_client_voice_number";
  ALTER TABLE "site_settings" DROP COLUMN "case_study_labels_client_voice_differently";
  ALTER TABLE "site_settings" DROP COLUMN "case_study_labels_client_voice_phases";
  ALTER TABLE "site_settings" DROP COLUMN "case_study_labels_next_study";
  ALTER TABLE "site_settings" DROP COLUMN "case_study_labels_next_study_read";
  DROP TYPE "public"."enum_pages_blocks_hero_width";
  DROP TYPE "public"."enum__pages_v_blocks_hero_width";`)
}
