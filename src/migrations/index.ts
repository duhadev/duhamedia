import * as migration_20261017_181819_initial from './20261017_181819_initial';

export const migrations = [
  {
    up: migration_20261017_181819_initial.up,
    down: migration_20261017_181819_initial.down,
    name: '20261017_181819_initial'
  },
];
