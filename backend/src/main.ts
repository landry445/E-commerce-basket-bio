import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sécurité des headers
  app.use(helmet());

  // Validation globale stricte
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,                // Supprime les propriétés non déclarées dans le DTO
      forbidNonWhitelisted: true,    // Rejette la requête si des champs non attendus sont envoyés
      transform: true,               // Transforme automatiquement les types (ex : string -> number)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
