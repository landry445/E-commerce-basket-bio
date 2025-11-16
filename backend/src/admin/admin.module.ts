import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AdminController, AdminNewsletterController } from './admin.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  controllers: [AdminController, AdminNewsletterController],
  providers: [UsersService],
  exports: [UsersService], // utile si d'autres modules en dépendent
})
export class AdminModule {}
