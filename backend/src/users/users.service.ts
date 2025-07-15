import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { AdminUserResponseDto } from '../admin/dto/admin-user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
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

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findAllSafe(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find();
    return users.map((u) => this.toResponse(u));
  }

  async findAllAdmin(): Promise<AdminUserResponseDto[]> {
    const users = await this.userRepo.find();
    return users.map((u) =>
      plainToInstance(AdminUserResponseDto, u, { excludeExtraneousValues: true }),
    );
  }

  async deleteUserById(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  private toResponse(user: User): UserResponseDto {
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
