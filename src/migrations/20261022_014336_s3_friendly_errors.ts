import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * S3 friendly errors (F21): `versions.drafts.autosave` turned off on every
 * drafts collection (pages, clients, team-members, testimonials, faqs,
 * case-studies, posts, lead-magnets), so payload@3.91.0 no longer declares the
 * `autosave` boolean on their `_<slug>_v` tables (versions/buildCollectionFields.js:63-69).
 *
 * The generated diff dropped those 8 columns + their `_v_autosave_idx`
 * indexes. That is hand-replaced by a deliberate NO-OP ("expand/contract"):
 * - backward compatibility (CLAUDE.md Payload conventions 1): during the deploy
 *   overlap the PREVIOUS image still selects/inserts `autosave` on every
 *   version read/write (admin edit view, draft preview, draft saves); dropping
 *   the column first would break it for those seconds.
 * - the new image never names the column: drizzle selects declared columns
 *   only, and inserts leave the nullable column NULL. Harmless.
 * The JSON snapshot beside this file already reflects the new schema (no
 * column), so later `migrate:create` runs do not regenerate the drop.
 * Contract step (later release, once no image with autosave can run): a
 * hand-written migration with `DROP INDEX IF EXISTS "_<slug>_v_autosave_idx"`
 * + `ALTER TABLE "_<slug>_v" DROP COLUMN IF EXISTS "autosave"` for the 8 tables.
 * The column holds version metadata only (was this version an autosave), no content.
 *
 * down(): nothing to restore (up changed nothing).
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  payload.logger.info('s3_friendly_errors: no-op (autosave columns kept until the contract migration)')
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info('s3_friendly_errors down: no-op')
}
