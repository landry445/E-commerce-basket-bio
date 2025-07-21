import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should register a user', async () => {
    const dto: CreateUserDto = {
      firstname: 'Jean',
      lastname: 'Test',
      email: 'jean@example.com',
      phone: '0600000000',
      password: 'Aa!123456',
    };
    const user: UserResponseDto = {
      id: 'some-id',
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      phone: dto.phone,
      date_creation: new Date(),
    };

    jest.spyOn(service, 'register').mockResolvedValue(user);

    const result = await controller.register(dto);
    expect(result).toMatchObject({
      email: dto.email,
      firstname: dto.firstname,
      lastname: dto.lastname,
    });
    expect(result).not.toHaveProperty('password_hash');
  });
});
