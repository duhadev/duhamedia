import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_form_submissions_newsletter_email_status" AS ENUM('pending', 'sent', 'failed');
  ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'sendNewsletterConfirmation';
  ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'syncNewsletterContact';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'sendNewsletterConfirmation';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'syncNewsletterContact';
  ALTER TABLE "form_submissions" ADD COLUMN "newsletter_email_status" "enum_form_submissions_newsletter_email_status";
  ALTER TABLE "form_submissions" ADD COLUMN "newsletter_email_note" varchar;
  ALTER TABLE "form_submissions" ADD COLUMN "newsletter_email_attempts" numeric DEFAULT 0;
  ALTER TABLE "form_submissions" ADD COLUMN "newsletter_contact_id" varchar;
  CREATE INDEX "form_submissions_newsletter_newsletter_opt_in_status_idx" ON "form_submissions" USING btree ("newsletter_opt_in_status");
  CREATE INDEX "form_submissions_newsletter_newsletter_email_status_idx" ON "form_submissions" USING btree ("newsletter_email_status");
  CREATE INDEX "form_submissions_newsletter_newsletter_sync_status_idx" ON "form_submissions" USING btree ("newsletter_sync_status");`)
}

// A2 (newsletter double opt-in): 4 nullable/defaulted columns + 1 enum on
// form_submissions (newsletter group), 3 indexes, and the two new job task
// slugs. Additive only; the previous image ignores the new columns and enum
// values during deploy overlap.
//
// `down` (hand-edited): queued newsletter jobs are deleted first, or casting
// task_slug back to the old enum would fail. Their submissions keep their
// opt-in/sync status (the email/sync bookkeeping columns go) and can be
// re-run from the admin after re-applying.
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   DELETE FROM "payload_jobs" WHERE "task_slug"::text IN ('sendNewsletterConfirmation', 'syncNewsletterContact');
  DELETE FROM "payload_jobs_log" WHERE "task_slug"::text IN ('sendNewsletterConfirmation', 'syncNewsletterContact');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'deliverSiteEvent');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'deliverSiteEvent');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  DROP INDEX "form_submissions_newsletter_newsletter_opt_in_status_idx";
  DROP INDEX "form_submissions_newsletter_newsletter_email_status_idx";
  DROP INDEX "form_submissions_newsletter_newsletter_sync_status_idx";
  ALTER TABLE "form_submissions" DROP COLUMN "newsletter_email_status";
  ALTER TABLE "form_submissions" DROP COLUMN "newsletter_email_note";
  ALTER TABLE "form_submissions" DROP COLUMN "newsletter_email_attempts";
  ALTER TABLE "form_submissions" DROP COLUMN "newsletter_contact_id";
  DROP TYPE "public"."enum_form_submissions_newsletter_email_status";`)
}
