import * as migration_20261017_181819_initial from './20261017_181819_initial';
import * as migration_20261017_193341_c1_users_role from './20261017_193341_c1_users_role';
import * as migration_20261017_195538_c2_media_downloads from './20261017_195538_c2_media_downloads';
import * as migration_20261017_200000_move_legacy_tables from './20261017_200000_move_legacy_tables';
import * as migration_20261017_202453_c3_c6_clients_team_testimonials_faqs from './20261017_202453_c3_c6_clients_team_testimonials_faqs';
import * as migration_20261017_210942_c7_case_studies from './20261017_210942_c7_case_studies';
import * as migration_20261017_215325_c8_posts from './20261017_215325_c8_posts';
import * as migration_20261017_221725_c9_lead_magnets from './20261017_221725_c9_lead_magnets';
import * as migration_20261017_223525_c10_pages from './20261017_223525_c10_pages';
import * as migration_20261018_053136_s1_lead_magnet_heading from './20261018_053136_s1_lead_magnet_heading';
import * as migration_20261021_222539_g1_site_settings from './20261021_222539_g1_site_settings';
import * as migration_20261021_223802_g2_scarcity from './20261021_223802_g2_scarcity';
import * as migration_20261021_224808_g3_navigation from './20261021_224808_g3_navigation';
import * as migration_20261021_231646_g4_seo_defaults from './20261021_231646_g4_seo_defaults';
import * as migration_20261021_233028_p1_form_builder from './20261021_233028_p1_form_builder';
import * as migration_20261021_235030_p2_redirects from './20261021_235030_p2_redirects';
import * as migration_20261022_000002_s2_scarcity_seo_delta from './20261022_000002_s2_scarcity_seo_delta';
import * as migration_20261022_001520_p3_seo from './20261022_001520_p3_seo';
import * as migration_20261022_014336_s3_friendly_errors from './20261022_014336_s3_friendly_errors';
import * as migration_20261022_025136_b3_hero from './20261022_025136_b3_hero';
import * as migration_20261022_030147_b3_homepage_batch1 from './20261022_030147_b3_homepage_batch1';
import * as migration_20261022_031049_b3_homepage_batch2 from './20261022_031049_b3_homepage_batch2';
import * as migration_20261022_052303_b4_pages_2_6_blocks from './20261022_052303_b4_pages_2_6_blocks';
import * as migration_20261022_053011_b4b_newsletter_band from './20261022_053011_b4b_newsletter_band';
import * as migration_20261022_141454_b5_pages_7_12_blocks from './20261022_141454_b5_pages_7_12_blocks';
import * as migration_20261023_170339_b5b_s5_deltas from './20261023_170339_b5b_s5_deltas';
import * as migration_20261023_195241_b6_pages_13_21_blocks from './20261023_195241_b6_pages_13_21_blocks';
import * as migration_20261023_204052_a1_event_delivery from './20261023_204052_a1_event_delivery';
import * as migration_20261024_030205_a2_newsletter from './20261024_030205_a2_newsletter';
import * as migration_20261024_034121_a3_lead_magnet from './20261024_034121_a3_lead_magnet';
import * as migration_20261024_165445_a4_site_error from './20261024_165445_a4_site_error';
import * as migration_20261028_121301_vercel_blob_fields from './20261028_121301_vercel_blob_fields';
import * as migration_20261028_190000_seed_placeholder_content from './20261028_190000_seed_placeholder_content';
import * as migration_20261029_143150_teamintro_pull_quote from './20261029_143150_teamintro_pull_quote';
import * as migration_20261029_145749_proofstrip_numbers_on_block from './20261029_145749_proofstrip_numbers_on_block';

export const migrations = [
  {
    up: migration_20261017_181819_initial.up,
    down: migration_20261017_181819_initial.down,
    name: '20261017_181819_initial',
  },
  {
    up: migration_20261017_193341_c1_users_role.up,
    down: migration_20261017_193341_c1_users_role.down,
    name: '20261017_193341_c1_users_role',
  },
  {
    up: migration_20261017_195538_c2_media_downloads.up,
    down: migration_20261017_195538_c2_media_downloads.down,
    name: '20261017_195538_c2_media_downloads',
  },
  {
    up: migration_20261017_200000_move_legacy_tables.up,
    down: migration_20261017_200000_move_legacy_tables.down,
    name: '20261017_200000_move_legacy_tables',
  },
  {
    up: migration_20261017_202453_c3_c6_clients_team_testimonials_faqs.up,
    down: migration_20261017_202453_c3_c6_clients_team_testimonials_faqs.down,
    name: '20261017_202453_c3_c6_clients_team_testimonials_faqs',
  },
  {
    up: migration_20261017_210942_c7_case_studies.up,
    down: migration_20261017_210942_c7_case_studies.down,
    name: '20261017_210942_c7_case_studies',
  },
  {
    up: migration_20261017_215325_c8_posts.up,
    down: migration_20261017_215325_c8_posts.down,
    name: '20261017_215325_c8_posts',
  },
  {
    up: migration_20261017_221725_c9_lead_magnets.up,
    down: migration_20261017_221725_c9_lead_magnets.down,
    name: '20261017_221725_c9_lead_magnets',
  },
  {
    up: migration_20261017_223525_c10_pages.up,
    down: migration_20261017_223525_c10_pages.down,
    name: '20261017_223525_c10_pages',
  },
  {
    up: migration_20261018_053136_s1_lead_magnet_heading.up,
    down: migration_20261018_053136_s1_lead_magnet_heading.down,
    name: '20261018_053136_s1_lead_magnet_heading',
  },
  {
    up: migration_20261021_222539_g1_site_settings.up,
    down: migration_20261021_222539_g1_site_settings.down,
    name: '20261021_222539_g1_site_settings',
  },
  {
    up: migration_20261021_223802_g2_scarcity.up,
    down: migration_20261021_223802_g2_scarcity.down,
    name: '20261021_223802_g2_scarcity',
  },
  {
    up: migration_20261021_224808_g3_navigation.up,
    down: migration_20261021_224808_g3_navigation.down,
    name: '20261021_224808_g3_navigation',
  },
  {
    up: migration_20261021_231646_g4_seo_defaults.up,
    down: migration_20261021_231646_g4_seo_defaults.down,
    name: '20261021_231646_g4_seo_defaults',
  },
  {
    up: migration_20261021_233028_p1_form_builder.up,
    down: migration_20261021_233028_p1_form_builder.down,
    name: '20261021_233028_p1_form_builder',
  },
  {
    up: migration_20261021_235030_p2_redirects.up,
    down: migration_20261021_235030_p2_redirects.down,
    name: '20261021_235030_p2_redirects',
  },
  {
    up: migration_20261022_000002_s2_scarcity_seo_delta.up,
    down: migration_20261022_000002_s2_scarcity_seo_delta.down,
    name: '20261022_000002_s2_scarcity_seo_delta',
  },
  {
    up: migration_20261022_001520_p3_seo.up,
    down: migration_20261022_001520_p3_seo.down,
    name: '20261022_001520_p3_seo',
  },
  {
    up: migration_20261022_014336_s3_friendly_errors.up,
    down: migration_20261022_014336_s3_friendly_errors.down,
    name: '20261022_014336_s3_friendly_errors',
  },
  {
    up: migration_20261022_025136_b3_hero.up,
    down: migration_20261022_025136_b3_hero.down,
    name: '20261022_025136_b3_hero',
  },
  {
    up: migration_20261022_030147_b3_homepage_batch1.up,
    down: migration_20261022_030147_b3_homepage_batch1.down,
    name: '20261022_030147_b3_homepage_batch1',
  },
  {
    up: migration_20261022_031049_b3_homepage_batch2.up,
    down: migration_20261022_031049_b3_homepage_batch2.down,
    name: '20261022_031049_b3_homepage_batch2',
  },
  {
    up: migration_20261022_052303_b4_pages_2_6_blocks.up,
    down: migration_20261022_052303_b4_pages_2_6_blocks.down,
    name: '20261022_052303_b4_pages_2_6_blocks',
  },
  {
    up: migration_20261022_053011_b4b_newsletter_band.up,
    down: migration_20261022_053011_b4b_newsletter_band.down,
    name: '20261022_053011_b4b_newsletter_band',
  },
  {
    up: migration_20261022_141454_b5_pages_7_12_blocks.up,
    down: migration_20261022_141454_b5_pages_7_12_blocks.down,
    name: '20261022_141454_b5_pages_7_12_blocks',
  },
  {
    up: migration_20261023_170339_b5b_s5_deltas.up,
    down: migration_20261023_170339_b5b_s5_deltas.down,
    name: '20261023_170339_b5b_s5_deltas',
  },
  {
    up: migration_20261023_195241_b6_pages_13_21_blocks.up,
    down: migration_20261023_195241_b6_pages_13_21_blocks.down,
    name: '20261023_195241_b6_pages_13_21_blocks',
  },
  {
    up: migration_20261023_204052_a1_event_delivery.up,
    down: migration_20261023_204052_a1_event_delivery.down,
    name: '20261023_204052_a1_event_delivery',
  },
  {
    up: migration_20261024_030205_a2_newsletter.up,
    down: migration_20261024_030205_a2_newsletter.down,
    name: '20261024_030205_a2_newsletter',
  },
  {
    up: migration_20261024_034121_a3_lead_magnet.up,
    down: migration_20261024_034121_a3_lead_magnet.down,
    name: '20261024_034121_a3_lead_magnet',
  },
  {
    up: migration_20261024_165445_a4_site_error.up,
    down: migration_20261024_165445_a4_site_error.down,
    name: '20261024_165445_a4_site_error',
  },
  {
    up: migration_20261028_121301_vercel_blob_fields.up,
    down: migration_20261028_121301_vercel_blob_fields.down,
    name: '20261028_121301_vercel_blob_fields',
  },
  {
    up: migration_20261028_190000_seed_placeholder_content.up,
    down: migration_20261028_190000_seed_placeholder_content.down,
    name: '20261028_190000_seed_placeholder_content',
  },
  {
    up: migration_20261029_143150_teamintro_pull_quote.up,
    down: migration_20261029_143150_teamintro_pull_quote.down,
    name: '20261029_143150_teamintro_pull_quote',
  },
  {
    up: migration_20261029_145749_proofstrip_numbers_on_block.up,
    down: migration_20261029_145749_proofstrip_numbers_on_block.down,
    name: '20261029_145749_proofstrip_numbers_on_block'
  },
];
