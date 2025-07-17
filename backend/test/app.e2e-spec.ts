import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';      // ← ajouté
import { AppModule } from '../src/app.module';

describe('E2E', () => {
  let app: INestApplication;
  let jwt: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());                        // ← ajouté
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('Register – POST /auth/register', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstname: 'Alice',
        lastname: 'Test',
        email: 'alice@example.com',
        phone: '0606060607',
        password: 'Test@1234',
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('email', 'alice@example.com');
    expect(res.body).not.toHaveProperty('password_hash');
  });

  it('Login – POST /auth/login', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'Test@1234' });
    expect(res.status).toBe(201);
    jwt = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
    expect(jwt).toBeDefined();
  });

  it('Profile – GET /users/me', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/me')
      .set('Cookie', [`jwt=${jwt}`]);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('email', 'alice@example.com');
    expect(res.body).not.toHaveProperty('password_hash');
  });

  it('Reservations – GET /reservations/me', async () => {
    const res = await request(app.getHttpServer())
      .get('/reservations/me')
      .set('Cookie', [`jwt=${jwt}`]);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Optionnel : vérifier la structure minimale
    for (const r of res.body) {
      expect(r).toHaveProperty('id');
      expect(r).toHaveProperty('pickup_date');
    }
  });

  it('Should protect /admin/users for non-admin', async () => {
    const res = await request(app.getHttpServer())
      .get('/admin/users')
      .set('Cookie', [`jwt=${jwt}`]);
    expect(res.status).toBe(403);                   // refusé car client
  });

  afterAll(async () => {
    await app.close();
  });
});
