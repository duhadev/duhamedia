import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_booking_embed_flow_question_link_type" AS ENUM('internal', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_booking_embed_flow_question_link_type" AS ENUM('internal', 'custom');
  CREATE TABLE "pages_blocks_booking_embed_flow_next_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"detail" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_booking_embed_flow_next_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_enabled" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_book_label" varchar DEFAULT 'Book';
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_homework_label" varchar DEFAULT 'Homework';
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_next_label" varchar DEFAULT 'What''s next';
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_booked_label" varchar DEFAULT 'I''ve booked my call';
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_back_label" varchar DEFAULT 'Back';
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_question_text" varchar;
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_question_link_type" "enum_pages_blocks_booking_embed_flow_question_link_type" DEFAULT 'internal';
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_question_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_question_link_url" varchar;
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_question_link_label" varchar;
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_homework_form_id" integer;
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_homework_eyebrow" varchar;
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_homework_heading" varchar;
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_homework_body" varchar;
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_homework_submit_label" varchar;
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_next_heading" varchar;
  ALTER TABLE "pages_blocks_booking_embed" ADD COLUMN "flow_next_body" varchar;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_enabled" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_book_label" varchar DEFAULT 'Book';
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_homework_label" varchar DEFAULT 'Homework';
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_next_label" varchar DEFAULT 'What''s next';
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_booked_label" varchar DEFAULT 'I''ve booked my call';
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_back_label" varchar DEFAULT 'Back';
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_question_text" varchar;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_question_link_type" "enum__pages_v_blocks_booking_embed_flow_question_link_type" DEFAULT 'internal';
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_question_link_new_tab" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_question_link_url" varchar;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_question_link_label" varchar;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_homework_form_id" integer;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_homework_eyebrow" varchar;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_homework_heading" varchar;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_homework_body" varchar;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_homework_submit_label" varchar;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_next_heading" varchar;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD COLUMN "flow_next_body" varchar;
  ALTER TABLE "pages_blocks_booking_embed_flow_next_steps" ADD CONSTRAINT "pages_blocks_booking_embed_flow_next_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_booking_embed"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_booking_embed_flow_next_steps" ADD CONSTRAINT "_pages_v_blocks_booking_embed_flow_next_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_booking_embed"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_booking_embed_flow_next_steps_order_idx" ON "pages_blocks_booking_embed_flow_next_steps" USING btree ("_order");
  CREATE INDEX "pages_blocks_booking_embed_flow_next_steps_parent_id_idx" ON "pages_blocks_booking_embed_flow_next_steps" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_booking_embed_flow_next_steps_order_idx" ON "_pages_v_blocks_booking_embed_flow_next_steps" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_booking_embed_flow_next_steps_parent_id_idx" ON "_pages_v_blocks_booking_embed_flow_next_steps" USING btree ("_parent_id");
  ALTER TABLE "pages_blocks_booking_embed" ADD CONSTRAINT "pages_blocks_booking_embed_flow_homework_form_id_forms_id_fk" FOREIGN KEY ("flow_homework_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_booking_embed" ADD CONSTRAINT "_pages_v_blocks_booking_embed_flow_homework_form_id_forms_id_fk" FOREIGN KEY ("flow_homework_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_booking_embed_flow_flow_homework_form_idx" ON "pages_blocks_booking_embed" USING btree ("flow_homework_form_id");
  CREATE INDEX "_pages_v_blocks_booking_embed_flow_flow_homework_form_idx" ON "_pages_v_blocks_booking_embed" USING btree ("flow_homework_form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_booking_embed_flow_next_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_booking_embed_flow_next_steps" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_booking_embed_flow_next_steps" CASCADE;
  DROP TABLE "_pages_v_blocks_booking_embed_flow_next_steps" CASCADE;
  ALTER TABLE "pages_blocks_booking_embed" DROP CONSTRAINT "pages_blocks_booking_embed_flow_homework_form_id_forms_id_fk";
  
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP CONSTRAINT "_pages_v_blocks_booking_embed_flow_homework_form_id_forms_id_fk";
  
  DROP INDEX "pages_blocks_booking_embed_flow_flow_homework_form_idx";
  DROP INDEX "_pages_v_blocks_booking_embed_flow_flow_homework_form_idx";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_enabled";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_book_label";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_homework_label";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_next_label";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_booked_label";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_back_label";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_question_text";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_question_link_type";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_question_link_new_tab";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_question_link_url";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_question_link_label";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_homework_form_id";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_homework_eyebrow";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_homework_heading";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_homework_body";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_homework_submit_label";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_next_heading";
  ALTER TABLE "pages_blocks_booking_embed" DROP COLUMN "flow_next_body";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_enabled";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_book_label";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_homework_label";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_next_label";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_booked_label";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_back_label";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_question_text";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_question_link_type";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_question_link_new_tab";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_question_link_url";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_question_link_label";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_homework_form_id";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_homework_eyebrow";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_homework_heading";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_homework_body";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_homework_submit_label";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_next_heading";
  ALTER TABLE "_pages_v_blocks_booking_embed" DROP COLUMN "flow_next_body";
  DROP TYPE "public"."enum_pages_blocks_booking_embed_flow_question_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_booking_embed_flow_question_link_type";`)
}
