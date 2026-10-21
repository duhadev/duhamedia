import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_socials_platform" AS ENUM('linkedin', 'instagram', 'youtube', 'x', 'facebook', 'github');
  CREATE TYPE "public"."enum_site_settings_booking_mode" AS ENUM('link-out', 'embed');
  CREATE TYPE "public"."enum_site_settings_template_defaults_final_cta_button_type" AS ENUM('internal', 'custom');
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_socials_platform" NOT NULL,
  	"handle" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legal_name" varchar NOT NULL,
  	"footer_tagline" varchar,
  	"contact_email" varchar NOT NULL,
  	"response_time_note" varchar,
  	"location_locality" varchar DEFAULT 'Lombard' NOT NULL,
  	"location_region" varchar DEFAULT 'IL' NOT NULL,
  	"location_country" varchar DEFAULT 'US',
  	"location_display_line" varchar DEFAULT 'Lombard, IL',
  	"location_market_area" varchar DEFAULT 'Chicago',
  	"location_service_radius_miles" numeric DEFAULT 30,
  	"location_latitude" numeric,
  	"location_longitude" numeric,
  	"booking_url" varchar,
  	"booking_mode" "enum_site_settings_booking_mode" DEFAULT 'link-out' NOT NULL,
  	"gbp_url" varchar,
  	"aggregate_rating_show" boolean DEFAULT false,
  	"aggregate_rating_rating_value" numeric,
  	"aggregate_rating_review_count" numeric,
  	"aggregate_rating_as_of" timestamp(3) with time zone,
  	"aggregate_rating_source_url" varchar,
  	"template_defaults_newsletter_heading" varchar DEFAULT 'One useful email a month.',
  	"template_defaults_newsletter_line" varchar DEFAULT 'Numbers included. Unsubscribe anytime.',
  	"template_defaults_final_cta_heading" varchar,
  	"template_defaults_final_cta_button_type" "enum_site_settings_template_defaults_final_cta_button_type" DEFAULT 'internal' NOT NULL,
  	"template_defaults_final_cta_button_new_tab" boolean DEFAULT false,
  	"template_defaults_final_cta_button_url" varchar,
  	"template_defaults_final_cta_button_label" varchar,
  	"postal_address_line1" varchar,
  	"postal_address_line2" varchar,
  	"postal_address_city" varchar,
  	"postal_address_region" varchar,
  	"postal_address_postal_code" varchar,
  	"postal_address_country" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"case_studies_id" integer,
  	"posts_id" integer,
  	"lead_magnets_id" integer
  );
  
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "public"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_lead_magnets_fk" FOREIGN KEY ("lead_magnets_id") REFERENCES "public"."lead_magnets"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
  CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
  CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
  CREATE INDEX "site_settings_rels_pages_id_idx" ON "site_settings_rels" USING btree ("pages_id");
  CREATE INDEX "site_settings_rels_case_studies_id_idx" ON "site_settings_rels" USING btree ("case_studies_id");
  CREATE INDEX "site_settings_rels_posts_id_idx" ON "site_settings_rels" USING btree ("posts_id");
  CREATE INDEX "site_settings_rels_lead_magnets_id_idx" ON "site_settings_rels" USING btree ("lead_magnets_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   -- Hand-fixed (PROGRESS Decision log): child tables (FKs to site_settings) first, parent last.
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings_rels" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_site_settings_socials_platform";
  DROP TYPE "public"."enum_site_settings_booking_mode";
  DROP TYPE "public"."enum_site_settings_template_defaults_final_cta_button_type";`)
}
