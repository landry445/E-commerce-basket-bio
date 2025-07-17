import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AdminController],
  providers: [UsersService],
  exports: [UsersService], // utile si d'autres modules en dépendent
})
export class AdminModule {}
