import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Récupère le repository User (via DI TypeORM)
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    // Crée un utilisateur de test
    const password = await bcrypt.hash('testpass', 10);
    await userRepository.save({
      firstname: 'Test',
      lastname: 'User',
      email: 'login-e2e@test.com',
      phone: '0600000000',
      password_hash: password,
      is_admin: false,
    });
  });

  afterAll(async () => {
    // Supprime l'utilisateur de test après les tests
    await userRepository.delete({ email: 'login-e2e@test.com' });
    await app.close();
  });

  it('POST /auth/login - succès', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'login-e2e@test.com', password: 'testpass' });

    expect(response.status).toBe(201); // 200 ou 201 selon ta config
    expect(response.body.message).toBe('Connexion réussie');
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.headers['set-cookie'][0]).toContain('jwt=');
    expect(response.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(response.headers['set-cookie'][0]).toMatch(/SameSite/i);
  });

  it('POST /auth/login - mauvais mot de passe', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'login-e2e@test.com', password: 'wrongpass' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Identifiants invalides');
  });

  it('POST /auth/login - user inconnu', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'unknown@test.com', password: 'testpass' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Identifiants invalides');
  });
});
