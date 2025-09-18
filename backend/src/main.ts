import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const uploadsDir = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsDir, { prefix: '/uploads' });

  // Helmet : autoriser le partage cross-origin des réponses (nécessaire avec CORS)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'same-site' },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    }),
    cookieParser()
  );

  // CORS strict + cookies
  const FRONT = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  app.enableCors({
    origin: FRONT, // doit être EXACTEMENT le schéma+host+port du front
    credentials: true, // envoie/autorise les cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
