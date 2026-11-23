import { Module } from '@nestjs/common';
import { LecturaController } from './lectura.controller';
import { LecturaService } from './lectura.service';
import { DatabaseService } from '../database.service';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { MetodoAstrologiaModule } from '../metodoAstrologia/metodoAstrologia.module';

@Module({
  imports: [MailModule, UsersModule, AuthModule, MetodoAstrologiaModule],
  controllers: [LecturaController],
  providers: [LecturaService, DatabaseService],
  exports: [LecturaService],
})
export class LecturaModule {}
