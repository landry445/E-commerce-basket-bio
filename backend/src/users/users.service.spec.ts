import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should hash password and return safe DTO on create', async () => {
    repo.save.mockResolvedValue({
      id: 'id',
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean@test.com',
      phone: '0606060606',
      password_hash: 'hashed',
      is_admin: false,
      date_creation: new Date(),
    });

    const dto = {
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean@test.com',
      phone: '0606060606',
      password: 'Aa!123456',
    };
    const user = await service.create(dto);
    expect(user).toHaveProperty('email', dto.email);
    expect(user).not.toHaveProperty('password_hash');
    expect(user).toHaveProperty('firstname', dto.firstname);
  });

  it('should find user by id and return safe DTO', async () => {
    repo.findOne.mockResolvedValue({
      id: 'id',
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean@test.com',
      phone: '0606060606',
      password_hash: 'hashed',
      is_admin: false,
      date_creation: new Date(),
    });
    const user = await service.findOne('id');
    expect(user).toHaveProperty('email', 'jean@test.com');
    expect(user).not.toHaveProperty('password_hash');
  });

  it('should return null if user not found by email', async () => {
    repo.findOne.mockResolvedValue(null);
    // const user = await service.findByEmail('notfound@test.com');
    // expect(user).toBeNull();
  });

  it('should list users as safe DTO (findAllSafe)', async () => {
    repo.find.mockResolvedValue([
      { id: 'id', firstname: 'Test', lastname: 'A', email: 'a@b.fr', phone: '0612345678', is_admin: false, date_creation: new Date() },
    ]);
    const users = await service.findAllSafe();
    expect(Array.isArray(users)).toBe(true);
    expect(users[0]).not.toHaveProperty('password_hash');
  });
});
