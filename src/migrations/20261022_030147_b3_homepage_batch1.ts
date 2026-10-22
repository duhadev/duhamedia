import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_mini_c_t_a_strip_variant" AS ENUM('band');
  CREATE TYPE "public"."enum_pages_blocks_mini_c_t_a_strip_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_final_c_t_a_buttons_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_final_c_t_a_capacity" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum_pages_blocks_proof_strip_statements_key" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum_pages_blocks_proof_strip_variant" AS ENUM('scarcity');
  CREATE TYPE "public"."enum_pages_blocks_proof_strip_logos_source" AS ENUM('flagged', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_two_track_panels_panels_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_two_track_panels_variant" AS ENUM('equal');
  CREATE TYPE "public"."enum__pages_v_blocks_mini_c_t_a_strip_variant" AS ENUM('band');
  CREATE TYPE "public"."enum__pages_v_blocks_mini_c_t_a_strip_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_final_c_t_a_buttons_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_final_c_t_a_capacity" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum__pages_v_blocks_proof_strip_statements_key" AS ENUM('none', 'ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TYPE "public"."enum__pages_v_blocks_proof_strip_variant" AS ENUM('scarcity');
  CREATE TYPE "public"."enum__pages_v_blocks_proof_strip_logos_source" AS ENUM('flagged', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_two_track_panels_panels_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_two_track_panels_variant" AS ENUM('equal');
  CREATE TABLE "pages_blocks_mini_c_t_a_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_mini_c_t_a_strip_variant" DEFAULT 'band',
  	"text" varchar,
  	"link_type" "enum_pages_blocks_mini_c_t_a_strip_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_final_c_t_a_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_final_c_t_a_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_final_c_t_a" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"body" varchar,
  	"capacity" "enum_pages_blocks_final_c_t_a_capacity" DEFAULT 'builds-line',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_proof_strip_statements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_pages_blocks_proof_strip_statements_key" DEFAULT 'none'
  );
  
  CREATE TABLE "pages_blocks_proof_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_proof_strip_variant" DEFAULT 'scarcity',
  	"pricing_note" varchar,
  	"logos_show" boolean DEFAULT true,
  	"logos_eyebrow" varchar DEFAULT 'Stores we''ve run numbers for',
  	"logos_source" "enum_pages_blocks_proof_strip_logos_source" DEFAULT 'flagged',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_two_track_panels_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"accent_title" boolean DEFAULT false,
  	"body" varchar,
  	"pricing_note" varchar,
  	"link_type" "enum_pages_blocks_two_track_panels_panels_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_blocks_two_track_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_two_track_panels_variant" DEFAULT 'equal',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_mini_c_t_a_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_mini_c_t_a_strip_variant" DEFAULT 'band',
  	"text" varchar,
  	"link_type" "enum__pages_v_blocks_mini_c_t_a_strip_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_final_c_t_a_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_final_c_t_a_buttons_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_final_c_t_a" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"body" varchar,
  	"capacity" "enum__pages_v_blocks_final_c_t_a_capacity" DEFAULT 'builds-line',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_proof_strip_statements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum__pages_v_blocks_proof_strip_statements_key" DEFAULT 'none',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_proof_strip" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_proof_strip_variant" DEFAULT 'scarcity',
  	"pricing_note" varchar,
  	"logos_show" boolean DEFAULT true,
  	"logos_eyebrow" varchar DEFAULT 'Stores we''ve run numbers for',
  	"logos_source" "enum__pages_v_blocks_proof_strip_logos_source" DEFAULT 'flagged',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_two_track_panels_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"accent_title" boolean DEFAULT false,
  	"body" varchar,
  	"pricing_note" varchar,
  	"link_type" "enum__pages_v_blocks_two_track_panels_panels_link_type" DEFAULT 'internal',
  	"link_new_tab" boolean DEFAULT false,
  	"link_url" varchar,
  	"link_label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_two_track_panels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_two_track_panels_variant" DEFAULT 'equal',
  	"eyebrow" varchar,
  	"eyebrow_tick" boolean DEFAULT false,
  	"heading" varchar,
  	"accent_phrase" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "clients_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "clients_id" integer;
  ALTER TABLE "pages_blocks_mini_c_t_a_strip" ADD CONSTRAINT "pages_blocks_mini_c_t_a_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_final_c_t_a_buttons" ADD CONSTRAINT "pages_blocks_final_c_t_a_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_final_c_t_a"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_final_c_t_a" ADD CONSTRAINT "pages_blocks_final_c_t_a_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_proof_strip_statements" ADD CONSTRAINT "pages_blocks_proof_strip_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_proof_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_proof_strip" ADD CONSTRAINT "pages_blocks_proof_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_track_panels_panels" ADD CONSTRAINT "pages_blocks_two_track_panels_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_two_track_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_two_track_panels" ADD CONSTRAINT "pages_blocks_two_track_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_mini_c_t_a_strip" ADD CONSTRAINT "_pages_v_blocks_mini_c_t_a_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_final_c_t_a_buttons" ADD CONSTRAINT "_pages_v_blocks_final_c_t_a_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_final_c_t_a"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_final_c_t_a" ADD CONSTRAINT "_pages_v_blocks_final_c_t_a_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_proof_strip_statements" ADD CONSTRAINT "_pages_v_blocks_proof_strip_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_proof_strip"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_proof_strip" ADD CONSTRAINT "_pages_v_blocks_proof_strip_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_track_panels_panels" ADD CONSTRAINT "_pages_v_blocks_two_track_panels_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_two_track_panels"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_two_track_panels" ADD CONSTRAINT "_pages_v_blocks_two_track_panels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_mini_c_t_a_strip_order_idx" ON "pages_blocks_mini_c_t_a_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_mini_c_t_a_strip_parent_id_idx" ON "pages_blocks_mini_c_t_a_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_mini_c_t_a_strip_path_idx" ON "pages_blocks_mini_c_t_a_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_final_c_t_a_buttons_order_idx" ON "pages_blocks_final_c_t_a_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_final_c_t_a_buttons_parent_id_idx" ON "pages_blocks_final_c_t_a_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_final_c_t_a_order_idx" ON "pages_blocks_final_c_t_a" USING btree ("_order");
  CREATE INDEX "pages_blocks_final_c_t_a_parent_id_idx" ON "pages_blocks_final_c_t_a" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_final_c_t_a_path_idx" ON "pages_blocks_final_c_t_a" USING btree ("_path");
  CREATE INDEX "pages_blocks_proof_strip_statements_order_idx" ON "pages_blocks_proof_strip_statements" USING btree ("_order");
  CREATE INDEX "pages_blocks_proof_strip_statements_parent_id_idx" ON "pages_blocks_proof_strip_statements" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_proof_strip_order_idx" ON "pages_blocks_proof_strip" USING btree ("_order");
  CREATE INDEX "pages_blocks_proof_strip_parent_id_idx" ON "pages_blocks_proof_strip" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_proof_strip_path_idx" ON "pages_blocks_proof_strip" USING btree ("_path");
  CREATE INDEX "pages_blocks_two_track_panels_panels_order_idx" ON "pages_blocks_two_track_panels_panels" USING btree ("_order");
  CREATE INDEX "pages_blocks_two_track_panels_panels_parent_id_idx" ON "pages_blocks_two_track_panels_panels" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_two_track_panels_order_idx" ON "pages_blocks_two_track_panels" USING btree ("_order");
  CREATE INDEX "pages_blocks_two_track_panels_parent_id_idx" ON "pages_blocks_two_track_panels" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_two_track_panels_path_idx" ON "pages_blocks_two_track_panels" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_mini_c_t_a_strip_order_idx" ON "_pages_v_blocks_mini_c_t_a_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_mini_c_t_a_strip_parent_id_idx" ON "_pages_v_blocks_mini_c_t_a_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_mini_c_t_a_strip_path_idx" ON "_pages_v_blocks_mini_c_t_a_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_final_c_t_a_buttons_order_idx" ON "_pages_v_blocks_final_c_t_a_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_final_c_t_a_buttons_parent_id_idx" ON "_pages_v_blocks_final_c_t_a_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_final_c_t_a_order_idx" ON "_pages_v_blocks_final_c_t_a" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_final_c_t_a_parent_id_idx" ON "_pages_v_blocks_final_c_t_a" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_final_c_t_a_path_idx" ON "_pages_v_blocks_final_c_t_a" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_proof_strip_statements_order_idx" ON "_pages_v_blocks_proof_strip_statements" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_proof_strip_statements_parent_id_idx" ON "_pages_v_blocks_proof_strip_statements" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_proof_strip_order_idx" ON "_pages_v_blocks_proof_strip" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_proof_strip_parent_id_idx" ON "_pages_v_blocks_proof_strip" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_proof_strip_path_idx" ON "_pages_v_blocks_proof_strip" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_two_track_panels_panels_order_idx" ON "_pages_v_blocks_two_track_panels_panels" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_two_track_panels_panels_parent_id_idx" ON "_pages_v_blocks_two_track_panels_panels" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_two_track_panels_order_idx" ON "_pages_v_blocks_two_track_panels" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_two_track_panels_parent_id_idx" ON "_pages_v_blocks_two_track_panels" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_two_track_panels_path_idx" ON "_pages_v_blocks_two_track_panels" USING btree ("_path");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_clients_fk" FOREIGN KEY ("clients_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_clients_id_idx" ON "pages_rels" USING btree ("clients_id");
  CREATE INDEX "_pages_v_rels_clients_id_idx" ON "_pages_v_rels" USING btree ("clients_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_mini_c_t_a_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_final_c_t_a_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_final_c_t_a" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_proof_strip_statements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_proof_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_two_track_panels_panels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_two_track_panels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_mini_c_t_a_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_final_c_t_a_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_final_c_t_a" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_proof_strip_statements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_proof_strip" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_two_track_panels_panels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_two_track_panels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_mini_c_t_a_strip" CASCADE;
  DROP TABLE "pages_blocks_final_c_t_a_buttons" CASCADE;
  DROP TABLE "pages_blocks_final_c_t_a" CASCADE;
  DROP TABLE "pages_blocks_proof_strip_statements" CASCADE;
  DROP TABLE "pages_blocks_proof_strip" CASCADE;
  DROP TABLE "pages_blocks_two_track_panels_panels" CASCADE;
  DROP TABLE "pages_blocks_two_track_panels" CASCADE;
  DROP TABLE "_pages_v_blocks_mini_c_t_a_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_final_c_t_a_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_final_c_t_a" CASCADE;
  DROP TABLE "_pages_v_blocks_proof_strip_statements" CASCADE;
  DROP TABLE "_pages_v_blocks_proof_strip" CASCADE;
  DROP TABLE "_pages_v_blocks_two_track_panels_panels" CASCADE;
  DROP TABLE "_pages_v_blocks_two_track_panels" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_clients_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_clients_fk";
  
  DROP INDEX "pages_rels_clients_id_idx";
  DROP INDEX "_pages_v_rels_clients_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "clients_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "clients_id";
  DROP TYPE "public"."enum_pages_blocks_mini_c_t_a_strip_variant";
  DROP TYPE "public"."enum_pages_blocks_mini_c_t_a_strip_link_type";
  DROP TYPE "public"."enum_pages_blocks_final_c_t_a_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_final_c_t_a_capacity";
  DROP TYPE "public"."enum_pages_blocks_proof_strip_statements_key";
  DROP TYPE "public"."enum_pages_blocks_proof_strip_variant";
  DROP TYPE "public"."enum_pages_blocks_proof_strip_logos_source";
  DROP TYPE "public"."enum_pages_blocks_two_track_panels_panels_link_type";
  DROP TYPE "public"."enum_pages_blocks_two_track_panels_variant";
  DROP TYPE "public"."enum__pages_v_blocks_mini_c_t_a_strip_variant";
  DROP TYPE "public"."enum__pages_v_blocks_mini_c_t_a_strip_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_final_c_t_a_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_final_c_t_a_capacity";
  DROP TYPE "public"."enum__pages_v_blocks_proof_strip_statements_key";
  DROP TYPE "public"."enum__pages_v_blocks_proof_strip_variant";
  DROP TYPE "public"."enum__pages_v_blocks_proof_strip_logos_source";
  DROP TYPE "public"."enum__pages_v_blocks_two_track_panels_panels_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_two_track_panels_variant";`)
}
