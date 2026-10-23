import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "downloads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  ALTER TABLE "media" ADD COLUMN "caption" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_browser_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_browser_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_browser_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_browser_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_browser_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_browser_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_og_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_og_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_og_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_og_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_og_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_og_filename" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "downloads_id" integer;
  CREATE INDEX "downloads_updated_at_idx" ON "downloads" USING btree ("updated_at");
  CREATE INDEX "downloads_created_at_idx" ON "downloads" USING btree ("created_at");
  CREATE UNIQUE INDEX "downloads_filename_idx" ON "downloads" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_downloads_fk" FOREIGN KEY ("downloads_id") REFERENCES "public"."downloads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_sizes_browser_sizes_browser_filename_idx" ON "media" USING btree ("sizes_browser_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "payload_locked_documents_rels_downloads_id_idx" ON "payload_locked_documents_rels" USING btree ("downloads_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   -- Hand-reordered: the generator emitted DROP TABLE ... CASCADE before this
  -- DROP CONSTRAINT, and CASCADE already removes the FK, so down failed.
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_downloads_fk";
  ALTER TABLE "downloads" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "downloads" CASCADE;

  DROP INDEX "media_sizes_browser_sizes_browser_filename_idx";
  DROP INDEX "media_sizes_og_sizes_og_filename_idx";
  DROP INDEX "payload_locked_documents_rels_downloads_id_idx";
  ALTER TABLE "media" DROP COLUMN "caption";
  ALTER TABLE "media" DROP COLUMN "sizes_browser_url";
  ALTER TABLE "media" DROP COLUMN "sizes_browser_width";
  ALTER TABLE "media" DROP COLUMN "sizes_browser_height";
  ALTER TABLE "media" DROP COLUMN "sizes_browser_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_browser_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_browser_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_og_url";
  ALTER TABLE "media" DROP COLUMN "sizes_og_width";
  ALTER TABLE "media" DROP COLUMN "sizes_og_height";
  ALTER TABLE "media" DROP COLUMN "sizes_og_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_og_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_og_filename";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "downloads_id";`)
}
