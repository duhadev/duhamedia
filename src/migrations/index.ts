import * as migration_20261017_181819_initial from './20261017_181819_initial';
import * as migration_20261017_193341_c1_users_role from './20261017_193341_c1_users_role';
import * as migration_20261017_195538_c2_media_downloads from './20261017_195538_c2_media_downloads';
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
    name: '20261022_014336_s3_friendly_errors'
  },
];
