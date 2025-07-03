import { DataSource } from 'typeorm';
import { User } from '../src/users/entities/user.entity';

export default new DataSource({
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  entities: [User],
});
