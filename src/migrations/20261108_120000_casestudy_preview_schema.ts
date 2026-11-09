import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_case_studies_services" AS ENUM('brand', 'design', 'custom-shopify-build', 'marketing', 'seo', 'content');
  CREATE TYPE "public"."enum__case_studies_v_version_services" AS ENUM('brand', 'design', 'custom-shopify-build', 'marketing', 'seo', 'content');
  ALTER TYPE "public"."enum_pages_blocks_case_study_cards_layout" ADD VALUE 'feature' BEFORE 'ledger';
  ALTER TYPE "public"."enum__pages_v_blocks_case_study_cards_layout" ADD VALUE 'feature' BEFORE 'ledger';
  CREATE TABLE "case_studies_services" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_case_studies_services",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "case_studies_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"before" varchar,
  	"value" varchar,
  	"accent" boolean,
  	"context" varchar
  );
  
  CREATE TABLE "_case_studies_v_version_services" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__case_studies_v_version_services",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_case_studies_v_version_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"before" varchar,
  	"value" varchar,
  	"accent" boolean,
  	"context" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "ledger_labels_summary" SET DEFAULT 'What we did';
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "ledger_labels_metric" SET DEFAULT 'Result';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "ledger_labels_summary" SET DEFAULT 'What we did';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "ledger_labels_metric" SET DEFAULT 'Result';
  ALTER TABLE "case_studies" ADD COLUMN "screens_desktop_id" integer;
  ALTER TABLE "case_studies" ADD COLUMN "screens_mobile_id" integer;
  ALTER TABLE "case_studies" ADD COLUMN "narrative_next_title" varchar;
  ALTER TABLE "case_studies" ADD COLUMN "narrative_next_body" jsonb;
  ALTER TABLE "case_studies" ADD COLUMN "narrative_aside_quote" varchar;
  ALTER TABLE "case_studies" ADD COLUMN "narrative_aside_caption" varchar;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_screens_desktop_id" integer;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_screens_mobile_id" integer;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_narrative_next_title" varchar;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_narrative_next_body" jsonb;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_narrative_aside_quote" varchar;
  ALTER TABLE "_case_studies_v" ADD COLUMN "version_narrative_aside_caption" varchar;
  ALTER TABLE "case_studies_services" ADD CONSTRAINT "case_studies_services_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "case_studies_facts" ADD CONSTRAINT "case_studies_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_services" ADD CONSTRAINT "_case_studies_v_version_services_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_case_studies_v_version_facts" ADD CONSTRAINT "_case_studies_v_version_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_case_studies_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "case_studies_services_order_idx" ON "case_studies_services" USING btree ("order");
  CREATE INDEX "case_studies_services_parent_idx" ON "case_studies_services" USING btree ("parent_id");
  CREATE INDEX "case_studies_facts_order_idx" ON "case_studies_facts" USING btree ("_order");
  CREATE INDEX "case_studies_facts_parent_id_idx" ON "case_studies_facts" USING btree ("_parent_id");
  CREATE INDEX "_case_studies_v_version_services_order_idx" ON "_case_studies_v_version_services" USING btree ("order");
  CREATE INDEX "_case_studies_v_version_services_parent_idx" ON "_case_studies_v_version_services" USING btree ("parent_id");
  CREATE INDEX "_case_studies_v_version_facts_order_idx" ON "_case_studies_v_version_facts" USING btree ("_order");
  CREATE INDEX "_case_studies_v_version_facts_parent_id_idx" ON "_case_studies_v_version_facts" USING btree ("_parent_id");
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_screens_desktop_id_media_id_fk" FOREIGN KEY ("screens_desktop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "case_studies" ADD CONSTRAINT "case_studies_screens_mobile_id_media_id_fk" FOREIGN KEY ("screens_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_screens_desktop_id_media_id_fk" FOREIGN KEY ("version_screens_desktop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_case_studies_v" ADD CONSTRAINT "_case_studies_v_version_screens_mobile_id_media_id_fk" FOREIGN KEY ("version_screens_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "case_studies_screens_screens_desktop_idx" ON "case_studies" USING btree ("screens_desktop_id");
  CREATE INDEX "case_studies_screens_screens_mobile_idx" ON "case_studies" USING btree ("screens_mobile_id");
  CREATE INDEX "_case_studies_v_version_screens_version_screens_desktop_idx" ON "_case_studies_v" USING btree ("version_screens_desktop_id");
  CREATE INDEX "_case_studies_v_version_screens_version_screens_mobile_idx" ON "_case_studies_v" USING btree ("version_screens_mobile_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "case_studies_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "case_studies_facts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_case_studies_v_version_facts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "case_studies_services" CASCADE;
  DROP TABLE "case_studies_facts" CASCADE;
  DROP TABLE "_case_studies_v_version_services" CASCADE;
  DROP TABLE "_case_studies_v_version_facts" CASCADE;
  ALTER TABLE "case_studies" DROP CONSTRAINT "case_studies_screens_desktop_id_media_id_fk";
  
  ALTER TABLE "case_studies" DROP CONSTRAINT "case_studies_screens_mobile_id_media_id_fk";
  
  ALTER TABLE "_case_studies_v" DROP CONSTRAINT "_case_studies_v_version_screens_desktop_id_media_id_fk";
  
  ALTER TABLE "_case_studies_v" DROP CONSTRAINT "_case_studies_v_version_screens_mobile_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "layout" SET DEFAULT 'cards'::text;
  DROP TYPE "public"."enum_pages_blocks_case_study_cards_layout";
  CREATE TYPE "public"."enum_pages_blocks_case_study_cards_layout" AS ENUM('cards', 'ledger', 'next-link');
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "layout" SET DEFAULT 'cards'::"public"."enum_pages_blocks_case_study_cards_layout";
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "layout" SET DATA TYPE "public"."enum_pages_blocks_case_study_cards_layout" USING "layout"::"public"."enum_pages_blocks_case_study_cards_layout";
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "layout" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "layout" SET DEFAULT 'cards'::text;
  DROP TYPE "public"."enum__pages_v_blocks_case_study_cards_layout";
  CREATE TYPE "public"."enum__pages_v_blocks_case_study_cards_layout" AS ENUM('cards', 'ledger', 'next-link');
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "layout" SET DEFAULT 'cards'::"public"."enum__pages_v_blocks_case_study_cards_layout";
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "layout" SET DATA TYPE "public"."enum__pages_v_blocks_case_study_cards_layout" USING "layout"::"public"."enum__pages_v_blocks_case_study_cards_layout";
  DROP INDEX "case_studies_screens_screens_desktop_idx";
  DROP INDEX "case_studies_screens_screens_mobile_idx";
  DROP INDEX "_case_studies_v_version_screens_version_screens_desktop_idx";
  DROP INDEX "_case_studies_v_version_screens_version_screens_mobile_idx";
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "ledger_labels_summary" SET DEFAULT 'What was leaking / what we changed';
  ALTER TABLE "pages_blocks_case_study_cards" ALTER COLUMN "ledger_labels_metric" SET DEFAULT 'Returned';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "ledger_labels_summary" SET DEFAULT 'What was leaking / what we changed';
  ALTER TABLE "_pages_v_blocks_case_study_cards" ALTER COLUMN "ledger_labels_metric" SET DEFAULT 'Returned';
  ALTER TABLE "case_studies" DROP COLUMN "screens_desktop_id";
  ALTER TABLE "case_studies" DROP COLUMN "screens_mobile_id";
  ALTER TABLE "case_studies" DROP COLUMN "narrative_next_title";
  ALTER TABLE "case_studies" DROP COLUMN "narrative_next_body";
  ALTER TABLE "case_studies" DROP COLUMN "narrative_aside_quote";
  ALTER TABLE "case_studies" DROP COLUMN "narrative_aside_caption";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_screens_desktop_id";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_screens_mobile_id";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_narrative_next_title";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_narrative_next_body";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_narrative_aside_quote";
  ALTER TABLE "_case_studies_v" DROP COLUMN "version_narrative_aside_caption";
  DROP TYPE "public"."enum_case_studies_services";
  DROP TYPE "public"."enum__case_studies_v_version_services";`)
}
