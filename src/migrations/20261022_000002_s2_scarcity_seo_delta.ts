import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // S2 (mini Gate S 2026-10-21, F12/F13): 'MarketingAgency' is removed from the enum.
  // Data step FIRST, while the old enum still holds both values: remap any stored
  // 'MarketingAgency' to 'ProfessionalService', so the cast back to the shrunken enum
  // below can never fail on real content. seo-defaults has no drafts, so there is no
  // _seo_defaults_v table to remap.
  await db.execute(sql`
   UPDATE "seo_defaults" SET "local_business_type" = 'ProfessionalService' WHERE "local_business_type" = 'MarketingAgency';
  ALTER TABLE "seo_defaults" ALTER COLUMN "local_business_type" SET DATA TYPE text;
  ALTER TABLE "seo_defaults" ALTER COLUMN "local_business_type" SET DEFAULT 'ProfessionalService'::text;
  DROP TYPE "public"."enum_seo_defaults_local_business_type";
  CREATE TYPE "public"."enum_seo_defaults_local_business_type" AS ENUM('ProfessionalService');
  ALTER TABLE "seo_defaults" ALTER COLUMN "local_business_type" SET DEFAULT 'ProfessionalService'::"public"."enum_seo_defaults_local_business_type";
  ALTER TABLE "seo_defaults" ALTER COLUMN "local_business_type" SET DATA TYPE "public"."enum_seo_defaults_local_business_type" USING "local_business_type"::"public"."enum_seo_defaults_local_business_type";
  ALTER TABLE "scarcity" ALTER COLUMN "capacity" SET DEFAULT 7;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  // Restores the G4 enum ('ProfessionalService', 'MarketingAgency' — same order) and drops
  // both column defaults. ADD VALUE inside a transaction is allowed on Postgres >= 12; the
  // new value is not used in this transaction. Rows remapped by up() stay
  // 'ProfessionalService' (the original value is not recoverable, and is not a valid type).
  await db.execute(sql`
   ALTER TYPE "public"."enum_seo_defaults_local_business_type" ADD VALUE 'MarketingAgency';
  ALTER TABLE "scarcity" ALTER COLUMN "capacity" DROP DEFAULT;
  ALTER TABLE "seo_defaults" ALTER COLUMN "local_business_type" DROP DEFAULT;`)
}
