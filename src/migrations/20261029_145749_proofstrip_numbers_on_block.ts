import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * ProofStrip `scarcity` variant ("Numbers"): each item now holds its own `number` + `label`
 * typed on the block, instead of a `key` pointing at a `scarcity` global statement
 * (human decision 2026-10-29). Content-preserving:
 *
 * 1. add `number` / `label` (nullable, as generated: `pages` has drafts);
 * 2. copy every existing row's content out of the `scarcity` global AS IT STANDS IN THIS DB:
 *    - `ongoing`  → number = scarcity.active_clients, label = the statement's caption, else "Projects ongoing";
 *    - `capacity` → number = scarcity.capacity,       label = the statement's caption, else "Max client capacity";
 *    - any other key (never used by this strip) → label = the token-resolved statistic, number left
 *      NULL so the row is hidden on the site and flagged as required in the admin;
 * 3. delete `none` rows (they rendered nothing and hold no content);
 * 4. only then drop `key` and its enums.
 * Same for the `_pages_v_` version rows. `down` restores `key` from the label (best effort).
 */

/** Token-resolved statistic for the row's key, from the global (src/lib/scarcity.ts tokens). */
const resolvedStatistic = (table: string) => `(
  SELECT replace(replace(replace(replace(replace(st.statistic,
    '{active}',   coalesce(g.active_clients::text, '{active}')),
    '{capacity}', coalesce(g.capacity::text, '{capacity}')),
    '{builds}',   coalesce(g.builds_in_progress::text, '{builds}')),
    '{engines}',  coalesce(g.engines_running::text, '{engines}')),
    '{open}',     coalesce(greatest(0, g.capacity - g.active_clients)::text, '{open}'))
  FROM "scarcity_statements" st JOIN "scarcity" g ON g.id = st._parent_id
  WHERE st.key::text = "${table}".key::text
  ORDER BY st._order LIMIT 1
)`

const caption = (table: string) => `(
  SELECT nullif(btrim(st.label), '') FROM "scarcity_statements" st
  WHERE st.key::text = "${table}".key::text ORDER BY st._order LIMIT 1
)`

const copyStep = (table: string) => `
  UPDATE "${table}" SET
    "number" = CASE "${table}".key::text
      WHEN 'ongoing'  THEN (SELECT active_clients::text FROM "scarcity" ORDER BY id LIMIT 1)
      WHEN 'capacity' THEN (SELECT capacity::text FROM "scarcity" ORDER BY id LIMIT 1)
      ELSE NULL END,
    "label" = CASE "${table}".key::text
      WHEN 'ongoing'  THEN coalesce(${caption(table)}, 'Projects ongoing')
      WHEN 'capacity' THEN coalesce(${caption(table)}, 'Max client capacity')
      ELSE ${resolvedStatistic(table)} END
  WHERE "${table}".key IS NOT NULL AND "${table}".key::text <> 'none';
  DELETE FROM "${table}" WHERE key IS NULL OR key::text = 'none';`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_proof_strip_statements" ADD COLUMN "number" varchar;
  ALTER TABLE "pages_blocks_proof_strip_statements" ADD COLUMN "label" varchar;
  ALTER TABLE "_pages_v_blocks_proof_strip_statements" ADD COLUMN "number" varchar;
  ALTER TABLE "_pages_v_blocks_proof_strip_statements" ADD COLUMN "label" varchar;`)

  await db.execute(sql.raw(copyStep('pages_blocks_proof_strip_statements')))
  await db.execute(sql.raw(copyStep('_pages_v_blocks_proof_strip_statements')))

  await db.execute(sql`
   ALTER TABLE "pages_blocks_proof_strip_statements" DROP COLUMN "key";
  ALTER TABLE "_pages_v_blocks_proof_strip_statements" DROP COLUMN "key";
  DROP TYPE "public"."enum_pages_blocks_proof_strip_statements_key";
  DROP TYPE "public"."enum__pages_v_blocks_proof_strip_statements_key";`)
}

const keyFromLabel = (table: string, enumType: string) => `
  UPDATE "${table}" SET key = (CASE
    WHEN lower(btrim("label")) = 'projects ongoing'    THEN 'ongoing'
    WHEN lower(btrim("label")) = 'max client capacity' THEN 'capacity'
    ELSE 'none' END)::"${enumType}";`

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_proof_strip_statements_key" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum__pages_v_blocks_proof_strip_statements_key" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  ALTER TABLE "pages_blocks_proof_strip_statements" ADD COLUMN "key" "enum_pages_blocks_proof_strip_statements_key" DEFAULT 'none';
  ALTER TABLE "_pages_v_blocks_proof_strip_statements" ADD COLUMN "key" "enum__pages_v_blocks_proof_strip_statements_key" DEFAULT 'none';`)

  // Best effort: typed numbers go back to the global; only the two known captions map to a key.
  await db.execute(sql.raw(keyFromLabel('pages_blocks_proof_strip_statements', 'enum_pages_blocks_proof_strip_statements_key')))
  await db.execute(sql.raw(keyFromLabel('_pages_v_blocks_proof_strip_statements', 'enum__pages_v_blocks_proof_strip_statements_key')))

  await db.execute(sql`
   ALTER TABLE "pages_blocks_proof_strip_statements" DROP COLUMN "number";
  ALTER TABLE "pages_blocks_proof_strip_statements" DROP COLUMN "label";
  ALTER TABLE "_pages_v_blocks_proof_strip_statements" DROP COLUMN "number";
  ALTER TABLE "_pages_v_blocks_proof_strip_statements" DROP COLUMN "label";`)
}
