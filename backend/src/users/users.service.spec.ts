import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should hash the password and return filtered user', async () => {
    const dto: CreateUserDto = {
      firstname: 'Alice',
      lastname: 'Durand',
      email: 'alice@example.com',
      phone: '+33612345678',
      password: 'secure123',
    };

    const mockHashed = 'hashed-password';

    const savedUser: User = {
      id: 'user-id',
      firstname: 'Alice',
      lastname: 'Durand',
      email: 'alice@example.com',
      phone: '+33612345678',
      password_hash: mockHashed,
      is_admin: false,
      date_creation: new Date(),
      reservations: [],
    };

    jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockHashed);

    repo.create.mockReturnValue(savedUser);
    repo.save.mockResolvedValue(savedUser);

    const result = await service.create(dto);

    expect(bcrypt.hash).toHaveBeenCalledWith('secure123', 10);
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        firstname: dto.firstname,
        lastname: dto.lastname,
        email: dto.email,
        phone: dto.phone,
        password_hash: mockHashed,
      }),
    );
    expect(result).toEqual({
      id: savedUser.id,
      firstname: 'Alice',
      lastname: 'Durand',
      email: 'alice@example.com',
      phone: '+33612345678',
      is_admin: false,
      date_creation: savedUser.date_creation,
    });
  });
});
