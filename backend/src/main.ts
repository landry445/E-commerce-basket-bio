import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
dotenv.config();
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sécurité des headers
  app.use(helmet(), cookieParser());

  // Validation globale stricte
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non déclarées dans le DTO
      forbidNonWhitelisted: true, // Rejette la requête si des champs non attendus sont envoyés
      transform: true, // Transforme automatiquement les types (ex : string -> number)
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // URL Next.js
    credentials: true, // Autorise l’envoi de cookies (httpOnly, JWT, etc.)
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
