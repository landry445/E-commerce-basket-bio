import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Baskets E2E', () => {
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

  it('POST /baskets → crée un panier', async () => {
    const response = await request(app.getHttpServer())
      .post('/baskets')
      .send({
        name_basket: 'Panier test',
        price_basket: 1200,
        description: 'Panier bio e2e',
        image_url: 'https://exemple.com/image.jpg',
        actif: true,
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name_basket: 'Panier test',
        price_basket: 1200,
        description: 'Panier bio e2e',
        image_url: 'https://exemple.com/image.jpg',
        actif: true,
        date_creation: expect.any(String),
      }),
    );
  });

  it('GET /baskets → liste tous les paniers', async () => {
    const response = await request(app.getHttpServer())
      .get('/baskets')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    // On attend au moins un panier (celui créé juste avant)
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name_basket');
    expect(response.body[0]).toHaveProperty('price_basket');
  });
});
