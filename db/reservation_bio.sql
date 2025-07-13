/* Extension indispensable pour gen_random_uuid() */
CREATE EXTENSION IF NOT EXISTS pgcrypto;

/* ------------------------------------------------------------
   ENUM pour le statut
------------------------------------------------------------ */
CREATE TYPE reservation_statut AS ENUM ('active', 'archived');

/* ------------------------------------------------------------
   TABLE pickup_locations
------------------------------------------------------------ */
CREATE TABLE pickup_locations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_pickup   TEXT      NOT NULL,
    address       TEXT,
    day_of_week   SMALLINT  NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = dimanche
    actif         BOOLEAN   NOT NULL DEFAULT TRUE
);

/* ------------------------------------------------------------
   TABLE users
------------------------------------------------------------ */
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstname     TEXT      NOT NULL,
    lastname      TEXT      NOT NULL,
    email         TEXT      NOT NULL UNIQUE,
    phone         TEXT      NOT NULL UNIQUE,
    password_hash TEXT      NOT NULL,
    is_admin      BOOLEAN   NOT NULL DEFAULT FALSE,
    date_creation TIMESTAMPTZ NOT NULL DEFAULT now()
);

/* ------------------------------------------------------------
   TABLE baskets
------------------------------------------------------------ */
CREATE TABLE baskets (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_basket   TEXT      NOT NULL,
    price_basket  INTEGER   NOT NULL,
    description   TEXT,
    image_basket  TEXT,
    actif         BOOLEAN   NOT NULL DEFAULT TRUE,
    date_creation TIMESTAMPTZ NOT NULL DEFAULT now()
);

/* ------------------------------------------------------------
   TABLE reservations
------------------------------------------------------------ */
CREATE TABLE reservations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    basket_id           UUID      NOT NULL REFERENCES baskets(id),
    location_id         UUID      REFERENCES pickup_locations(id) ON DELETE SET NULL,
    price_reservation   INTEGER   NOT NULL,
    pickup_date         DATE      NOT NULL,
    quantity            SMALLINT  NOT NULL DEFAULT 1
                             CHECK (quantity BETWEEN 1 AND 5),
    statut              reservation_statut NOT NULL DEFAULT 'active',
    email_sent_at       TIMESTAMPTZ,
    sms_sent_at         TIMESTAMPTZ,
    date_creation       TIMESTAMPTZ NOT NULL DEFAULT now()
);

/* ------------------------------------------------------------
   Index utiles
------------------------------------------------------------ */
CREATE INDEX reservations_pickup_date_idx
          ON reservations (pickup_date);

CREATE INDEX reservations_user_date_idx
          ON reservations (user_id, pickup_date);

/* ------------------------------------------------------------
   TRIGGER : au plus deux réservations par client et par jour
------------------------------------------------------------ */
CREATE OR REPLACE FUNCTION enforce_reservation_limit()
RETURNS TRIGGER AS $$
DECLARE
    total_today INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_today
      FROM reservations
     WHERE user_id     = NEW.user_id
       AND pickup_date = NEW.pickup_date
       AND statut      = 'active'
       AND id         <> COALESCE(NEW.id,
                       '00000000-0000-0000-0000-000000000000');

    IF total_today >= 2 THEN
        RAISE EXCEPTION
          'Limite atteinte : déjà % réservation(s) actives le %',
          total_today, NEW.pickup_date;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reservation_limit
BEFORE INSERT OR UPDATE ON reservations
FOR EACH ROW
EXECUTE PROCEDURE enforce_reservation_limit();

/* ------------------------------------------------------------
   TRIGGER : cohérence date / lieu
------------------------------------------------------------ */
CREATE OR REPLACE FUNCTION enforce_pickup_day()
RETURNS TRIGGER AS $$
DECLARE
    expected_day SMALLINT;
BEGIN
    IF NEW.location_id IS NULL THEN
        RETURN NEW; -- lieu supprimé, aucune vérification
    END IF;

    SELECT day_of_week INTO expected_day
      FROM pickup_locations
     WHERE id = NEW.location_id;

    IF expected_day IS NULL THEN
        RAISE EXCEPTION 'Lieu de retrait introuvable';
    END IF;

    IF expected_day <> EXTRACT(DOW FROM NEW.pickup_date)::SMALLINT THEN
        RAISE EXCEPTION
          'Lieu choisi indisponible le % (jour %)',
          NEW.pickup_date, EXTRACT(DOW FROM NEW.pickup_date);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pickup_day_match
BEFORE INSERT OR UPDATE ON reservations
FOR EACH ROW
EXECUTE PROCEDURE enforce_pickup_day();

/* ------------------------------------------------------------
   PROCÉDURE d’archivage quotidienne
------------------------------------------------------------ */
CREATE OR REPLACE PROCEDURE archive_old_reservations()
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE reservations
       SET statut = 'archived'
     WHERE pickup_date < CURRENT_DATE
       AND statut       = 'active';
END;
$$;

/* ------------------------------------------------------------
   VUE : rappels SMS du jour
------------------------------------------------------------ */
CREATE VIEW v_sms_reminders AS
SELECT r.id,
       u.firstname,
       u.phone,
       b.name_basket AS panier,
       l.name_pickup AS lieu,
       r.pickup_date
  FROM reservations      r
  JOIN users             u ON u.id = r.user_id
  JOIN baskets           b ON b.id = r.basket_id
  LEFT JOIN pickup_locations l ON l.id = r.location_id
 WHERE r.pickup_date = CURRENT_DATE
   AND r.sms_sent_at IS NULL
   AND r.statut      = 'active';

/* ------------------------------------------------------------
   PROCÉDURE : marquage SMS envoyé
------------------------------------------------------------ */
CREATE OR REPLACE PROCEDURE mark_sms_sent(p_reservation UUID)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE reservations
       SET sms_sent_at = now()
     WHERE id = p_reservation;
END;
$$;

/* ------------------------------------------------------------
   Données initiales
------------------------------------------------------------ */
INSERT INTO pickup_locations (name_pickup, address, day_of_week)
VALUES ('Gare',   'Adresse de la gare',   2), -- mardi
       ('Marché', 'Adresse du marché',    6); -- samedi
