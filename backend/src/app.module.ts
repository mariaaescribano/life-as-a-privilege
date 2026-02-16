// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './user/user.module';
import { DatabaseService } from './database.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, AuthModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
