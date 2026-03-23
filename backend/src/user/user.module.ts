import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/database.service';
import { GoogleStrategy } from 'src/auth/google.strategy';
import { GoogleController } from 'src/auth/google.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule, PassportModule],
  controllers: [UserController, GoogleController],
  providers: [UserService, DatabaseService, GoogleStrategy],
})
export class UsersModule {}
