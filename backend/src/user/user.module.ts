import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/database.service';

@Module({
  imports: [AuthModule], 
  controllers: [UserController],
  providers: [UserService, DatabaseService],
})
export class UsersModule {}
