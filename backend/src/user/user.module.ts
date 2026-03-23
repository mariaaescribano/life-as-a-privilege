import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/database.service';
import { GoogleController } from 'src/auth/google.controller';

@Module({
  imports: [AuthModule],
  controllers: [UserController, GoogleController],
  providers: [UserService, DatabaseService],
})
export class UsersModule {}
