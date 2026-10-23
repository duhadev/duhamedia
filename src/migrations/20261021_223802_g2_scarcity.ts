import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_scarcity_statements_key" AS ENUM('ongoing', 'capacity', 'builds-line', 'engines-line', 'slots-line', 'offer-line');
  CREATE TABLE "scarcity_statements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_scarcity_statements_key" NOT NULL,
  	"label" varchar,
  	"statistic" varchar NOT NULL,
  	"reason" varchar NOT NULL
  );
  
  CREATE TABLE "scarcity" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"capacity" numeric NOT NULL,
  	"active_clients" numeric NOT NULL,
  	"builds_in_progress" numeric NOT NULL,
  	"engines_running" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "scarcity_statements" ADD CONSTRAINT "scarcity_statements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."scarcity"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "scarcity_statements_order_idx" ON "scarcity_statements" USING btree ("_order");
  CREATE INDEX "scarcity_statements_parent_id_idx" ON "scarcity_statements" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // F88: payload@3.91.0 `migrate:reset` runs downs oldest-first, so the initial
  // migration's down has already emptied the schema; nothing is left to undo.
  if (!(await db.execute(sql`SELECT to_regclass('public.users') AS t`)).rows[0]?.t) return
  await db.execute(sql`
   -- Child table (FK to scarcity) first, parent last; generated order already correct (checked, PROGRESS Decision log).
  DROP TABLE "scarcity_statements" CASCADE;
  DROP TABLE "scarcity" CASCADE;
  DROP TYPE "public"."enum_scarcity_statements_key";`)
}
