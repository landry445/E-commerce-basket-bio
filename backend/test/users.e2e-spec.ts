import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Users E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /users → crée un utilisateur', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        prenom: 'Alice',
        nom: 'Durand',
        email: 'alice@example.com',
        telephone: '+33612345678',
        password: 'secure123',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        prenom: 'Alice',
        nom: 'Durand',
        email: 'alice@example.com',
        telephone: '+33612345678',
        is_admin: false,
        date_creation: expect.any(String),
      }),
    );
  });
});
