// ormconfig.migrations.ts (à la racine backend)
import { DataSource } from 'typeorm';
import { resolve } from 'node:path';

function env(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export default new DataSource({
  type: 'postgres',
  url: env('MIGRATION_DATABASE_URL', env('DATABASE_URL')),
  ssl: false,
  entities: [resolve(__dirname, 'dist/**/*.entity.js')],
  migrations: [resolve(__dirname, 'dist/migrations/*.js')],
});
