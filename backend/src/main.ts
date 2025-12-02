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
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Fichiers statiques (uploads)
  const uploadsDir = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsDir, { prefix: '/uploads' });

  // Sécurité + cookies
  app.use(
    helmet({
      // autorisation des images / assets depuis le frontend
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      // désactivation COEP pour éviter les erreurs avec Next en dev
      crossOriginEmbedderPolicy: false,
    }),
    cookieParser()
  );

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // CORS pour Next.js + cookies
  const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: FRONTEND, // origine exacte (pas '*')
    credentials: true, // cookie httpOnly autorisé
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
