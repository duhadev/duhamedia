import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_form_submissions_asset_email_status" AS ENUM('pending', 'sent', 'failed');
  ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'sendLeadMagnetAsset';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'sendLeadMagnetAsset';
  ALTER TABLE "form_submissions" ADD COLUMN "asset_email_status" "enum_form_submissions_asset_email_status";
  ALTER TABLE "form_submissions" ADD COLUMN "asset_email_note" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "asset_email_attempts" numeric DEFAULT 0;
  CREATE INDEX "form_submissions_asset_email_asset_email_status_idx" ON "form_submissions" USING btree ("asset_email_status");`)
}

// A3 (lead-magnet asset email): 3 nullable/defaulted columns + 1 enum on
// form_submissions (assetEmail group), 1 index, and the new job task slug.
// Additive only; the previous image ignores the new columns and enum value
// during deploy overlap.
//
// `down` (hand-edited): queued asset-email jobs are deleted first, or casting
// task_slug back to the old enum would fail. Their submissions lose only the
// asset-email bookkeeping columns; after re-applying, the email can be
// re-sent from the admin.
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   DELETE FROM "payload_jobs" WHERE "task_slug"::text = 'sendLeadMagnetAsset';
  DELETE FROM "payload_jobs_log" WHERE "task_slug"::text = 'sendLeadMagnetAsset';
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'deliverSiteEvent', 'sendNewsletterConfirmation', 'syncNewsletterContact');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'deliverSiteEvent', 'sendNewsletterConfirmation', 'syncNewsletterContact');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  DROP INDEX "form_submissions_asset_email_asset_email_status_idx";
  ALTER TABLE "form_submissions" DROP COLUMN "asset_email_status";
  ALTER TABLE "form_submissions" DROP COLUMN "asset_email_note";
  ALTER TABLE "form_submissions" DROP COLUMN "asset_email_attempts";
  DROP TYPE "public"."enum_form_submissions_asset_email_status";`)
}
