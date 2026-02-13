import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UsersModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', // XAMPP default
      database: 'lifeasaprivilege', // change this
      autoLoadEntities: true,
      synchronize: true, // dev only
    }),
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
