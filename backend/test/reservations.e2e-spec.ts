import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('Reservations E2E', () => {
  let app: INestApplication;

  // Préparation d'un user, d'un basket, et d'un lieu pour la réservation
  let userId: string;
  let basketId: string;
  let pickupId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // Création d'un user
    const user = await request(app.getHttpServer()).post('/users').send({
      prenom: 'Bob',
      nom: 'Testeur',
      email: 'bob@test.fr',
      telephone: '+33601010101',
      password: 'azerty123',
    });
    userId = user.body.id;

    // Création d'un basket
    const basket = await request(app.getHttpServer()).post('/baskets').send({
      nom: 'Panier Test',
      prix_centimes: 999,
      description: 'Bio local',
      actif: true,
    });
    basketId = basket.body.id;

    // Création d'un lieu de retrait
    const pickup = await request(app.getHttpServer()).post('/pickup').send({
      nom: 'Point Test',
      adresse: 'Rue du test',
      day_of_week: 3, // mercredi
    });
    pickupId = pickup.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /reservations → crée une réservation', async () => {
    const pickupDate = getNextWeekdayDate(3); // Jour=3 (mercredi)
    const response = await request(app.getHttpServer())
      .post('/reservations')
      .send({
        user_id: userId,
        basket_id: basketId,
        location_id: pickupId,
        prix_centimes: 999,
        pickup_date: pickupDate,
        quantity: 1,
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: userId,
        basket_id: basketId,
        location_id: pickupId,
        prix_centimes: 999,
        pickup_date: pickupDate,
        quantity: 1,
        statut: 'active',
        date_creation: expect.any(String),
      }),
    );
  });
});

// Utilitaire pour trouver la prochaine date correspondant au jour de semaine voulu (0=dimanche)
function getNextWeekdayDate(weekday: number): string {
  const today = new Date();
  const result = new Date(today);
  const day = today.getDay();
  let add = (weekday - day + 7) % 7;
  if (add === 0) add = 7; // toujours dans le futur
  result.setDate(today.getDate() + add);
  return result.toISOString().split('T')[0];
}
