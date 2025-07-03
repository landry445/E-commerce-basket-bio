import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Pickup E2E', () => {
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

  it('POST /pickup → crée un lieu de retrait', async () => {
    const response = await request(app.getHttpServer())
      .post('/pickup')
      .send({
        nom: 'Point Relais Bio',
        adresse: 'Rue des légumes',
        day_of_week: 2,
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        nom: 'Point Relais Bio',
        adresse: 'Rue des légumes',
        day_of_week: 2,
        actif: true,
      }),
    );
  });

  it('GET /pickup → liste tous les lieux de retrait', async () => {
    const response = await request(app.getHttpServer()).get('/pickup').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('nom');
    expect(response.body[0]).toHaveProperty('day_of_week');
  });
});
