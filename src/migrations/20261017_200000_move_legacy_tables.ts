import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// The production Neon DB still holds the old site's tables (db/schema.sql at
// de85e93), and `clients`, `posts` and `form_submissions` collide with Payload's.
// Move them, unchanged and with their indexes/constraints/sequences, into a
// `legacy` schema. Nothing is dropped. Guarded on `client_invites`, which only the
// old site ever created, so this is a no-op on every Payload-only database.
// Dated before 20261017_202453 so it runs ahead of the first collision.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$
  DECLARE t text;
  BEGIN
    IF to_regclass('public.client_invites') IS NULL THEN
      RETURN;
    END IF;
    CREATE SCHEMA IF NOT EXISTS legacy;
    FOREACH t IN ARRAY ARRAY['user_profiles','client_invites','clients','posts',
      'form_submissions','experiments','cro_metrics','reports'] LOOP
      IF to_regclass('public.' || t) IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.%I SET SCHEMA legacy', t);
      END IF;
    END LOOP;
  END $$;`)
}

// Leave the legacy tables where they are; moving them back would collide again.
export async function down(_args: MigrateDownArgs): Promise<void> {}
