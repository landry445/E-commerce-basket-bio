import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUsersService: Partial<jest.Mocked<UsersService>> = {
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

  it('should return user profile for connected user', async () => {
    const userId = 'uuid-123';
    const userProfile = {
      id: userId,
      firstname: 'Alice',
      lastname: 'Durand',
      email: 'alice@example.com',
      phone: '+33612345678',
      date_creation: new Date(),
    };

    usersService.findOne.mockResolvedValue(userProfile);

    // Simule un objet req avec req.user.id
    const req = { user: { id: userId } };

    const result = await controller.getProfile(req as any);

    expect(usersService.findOne).toHaveBeenCalledWith(userId);
    expect(result).toEqual(userProfile);
  });
});
