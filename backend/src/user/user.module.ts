import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/database.service';
import { GoogleController } from 'src/auth/google.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [AuthModule, MailModule],
  controllers: [UserController, GoogleController],
  providers: [UserService, DatabaseService],
  exports: [UserService],
})
export class UsersModule {}
