// src/database/typeorm-app.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeOrmOptionsFromUrl(url: string, ssl: boolean): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    url,
    ssl: ssl ? { rejectUnauthorized: true } : false,
    autoLoadEntities: true,
    synchronize: false,
  };
}
