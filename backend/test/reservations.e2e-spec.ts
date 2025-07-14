import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';     // ← ajouté
import { AppModule } from '../src/app.module';

describe('Reservations E2E', () => {
  let app: INestApplication;
  let jwt: string;
  let basketId: string;
  let locationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());                       // ← ajouté
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    /* ---------- 1. user + login ---------- */
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstname: 'Test',
        lastname: 'User',
        email: 'test.user@example.com',
        phone: '0606060606',
        password: 'Test@1234',
      })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test.user@example.com', password: 'Test@1234' })
      .expect(201);

    jwt = loginRes.headers['set-cookie'][0].split(';')[0].split('=')[1];

    /* ---------- 2. panier ---------- */
    const basketRes = await request(app.getHttpServer())
      .post('/baskets')
      .set('Cookie', [`jwt=${jwt}`])
      .send({ name_basket: 'Panier test', price_basket: 999 })
      .expect(201);

    basketId = basketRes.body.id;

    /* ---------- 3. lieu de retrait ---------- */
    const pickupRes = await request(app.getHttpServer())
      .post('/pickup')
      .set('Cookie', [`jwt=${jwt}`])
      .send({
        name_pickup: 'Lieu Test',
        address: '1 rue du test',
        day_of_week: 3,
      })
      .expect(201);

    locationId = pickupRes.body.id;
  });

  it('POST /reservations – crée une réservation', async () => {
    const res = await request(app.getHttpServer())
      .post('/reservations')
      .set('Cookie', [`jwt=${jwt}`])
      .send({
        basket_id: basketId,
        location_id: locationId,
        price_reservation: 999,
        pickup_date: '2025-07-16',
        quantity: 1,
      })
      .expect(201);

    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        pickup_date: '2025-07-16',
        price_reservation: 999,
        quantity: 1,
        statut: 'active',
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
