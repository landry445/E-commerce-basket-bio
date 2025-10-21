import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUniquePasswordHash1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE cname text;
      BEGIN
        SELECT conname INTO cname
        FROM   pg_constraint c
        JOIN   pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
        WHERE  c.conrelid = 'public.users'::regclass
          AND  c.contype = 'u'
          AND  a.attname = 'password_hash'
        LIMIT 1;

        IF cname IS NOT NULL THEN
          EXECUTE format('ALTER TABLE public.users DROP CONSTRAINT %I;', cname);
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE public.reservations
        ADD COLUMN IF NOT EXISTS email_sent_at timestamptz NULL;
    `);
  }

  // Remettre l'unicité n'est pas recommandé.
  public async down(): Promise<void> {
    /* noop */
  }
}
