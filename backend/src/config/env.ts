// src/config/env.ts
export type AppEnv = {
  databaseUrl: string;
  migrationDatabaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  cookieName: string;
  cookieDomain: string;
  cookieSecure: boolean;
  cookieSameSite: 'Lax' | 'Strict' | 'None';
  corsOrigin: string;
  corsCredentials: boolean;
};

export function readEnv(): AppEnv {
  const e = process.env;
  if (!e.DATABASE_URL) throw new Error('DATABASE_URL manquant');
  if (!e.JWT_SECRET || e.JWT_SECRET.length < 32) throw new Error('JWT_SECRET trop court');
  return {
    databaseUrl: e.DATABASE_URL,
    migrationDatabaseUrl: e.MIGRATION_DATABASE_URL ?? e.DATABASE_URL,
    jwtSecret: e.JWT_SECRET,
    jwtExpiresIn: e.JWT_EXPIRES_IN ?? '7d',
    cookieName: e.COOKIE_NAME ?? 'auth_token',
    cookieDomain: e.COOKIE_DOMAIN ?? 'localhost',
    cookieSecure: (e.COOKIE_SECURE ?? 'false') === 'true',
    cookieSameSite: (e.COOKIE_SAMESITE as 'Lax' | 'Strict' | 'None') ?? 'Lax',
    corsOrigin: e.CORS_ORIGIN ?? 'http://localhost:3000',
    corsCredentials: (e.CORS_CREDENTIALS ?? 'true') === 'true',
  };
}
