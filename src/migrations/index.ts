import * as migration_20261017_181819_initial from './20261017_181819_initial';
import * as migration_20261017_193341_c1_users_role from './20261017_193341_c1_users_role';
import * as migration_20261017_195538_c2_media_downloads from './20261017_195538_c2_media_downloads';
import * as migration_20261017_202453_c3_c6_clients_team_testimonials_faqs from './20261017_202453_c3_c6_clients_team_testimonials_faqs';

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
    name: '20261017_202453_c3_c6_clients_team_testimonials_faqs'
  },
];
