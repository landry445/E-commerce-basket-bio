import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUsersService: Partial<jest.Mocked<UsersService>> = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call usersService.create with correct data', async () => {
    const dto: CreateUserDto = {
      prenom: 'Alice',
      nom: 'Durand',
      email: 'alice@example.com',
      telephone: '+33612345678',
      password: 'secure123',
    };

    const userResponse = {
      id: 'uuid-123',
      ...dto,
      is_admin: false,
      date_creation: new Date(),
    };

    usersService.create.mockResolvedValue(userResponse);

    const result = await controller.create(dto);

    expect(usersService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(userResponse);
  });
});
