import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'deliverSiteError';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'deliverSiteError';`)
}

// A4 (site_error reporter): the new job task slug only. Job-only design, no
// collection or columns. Additive; the previous image never queues this task
// during deploy overlap.
//
// `down` (hand-edited): queued site-error jobs are deleted first, or casting
// task_slug back to the old enum would fail. Those errors are not re-sent
// (they were already logged when they happened).
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   DELETE FROM "payload_jobs" WHERE "task_slug"::text = 'deliverSiteError';
  DELETE FROM "payload_jobs_log" WHERE "task_slug"::text = 'deliverSiteError';
   ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'deliverSiteEvent', 'sendNewsletterConfirmation', 'syncNewsletterContact', 'sendLeadMagnetAsset');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'deliverSiteEvent', 'sendNewsletterConfirmation', 'syncNewsletterContact', 'sendLeadMagnetAsset');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";`)
}
