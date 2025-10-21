import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { AdminUserResponseDto } from '../admin/dto/admin-user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const hash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      ...dto,
      password_hash: hash,
    });

    const saved = await this.userRepo.save(user);

    return this.toResponse(saved);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return this.toResponse(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findOneWithReservations(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['reservations', 'reservations.basket'],
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
        is_admin: true,
        reservations: {
          id: true,
          pickup_date: true,
          statut: true,
          basket: {
            id: true,
            name_basket: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }
  async findAllSafe(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find();
    return users.map((u) => this.toResponse(u));
  }

  async findAllAdmin(): Promise<AdminUserResponseDto[]> {
    const users = await this.userRepo.find();
    return users.map((u) =>
      plainToInstance(AdminUserResponseDto, u, { excludeExtraneousValues: true })
    );
  }

  async deleteUserById(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  async updatePartial(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    if (dto.firstname !== undefined) user.firstname = dto.firstname.trim();
    if (dto.lastname !== undefined) user.lastname = dto.lastname.trim();
    if (dto.phone !== undefined) user.phone = dto.phone.trim();

    const saved = await this.userRepo.save(user);
    return this.toResponse(saved);
  }

  private toResponse(user: User): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
