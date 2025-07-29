import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
dotenv.config();

import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // 1. on crée l’application en la typant NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /* ------------------------------------------------------------------
     Expose /uploads  (chemin absolu basé sur process.cwd())
     - process.cwd() → dossier racine "backend" (dev ou prod)
  ------------------------------------------------------------------ */
  const uploadsDir = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsDir, { prefix: '/uploads' });

  // Sécurité + cookies
  app.use(helmet(), cookieParser());

  // Validation globale stricte
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // CORS pour Next.js
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
