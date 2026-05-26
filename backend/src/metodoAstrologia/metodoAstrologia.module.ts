import { Module } from '@nestjs/common';
import { MetodoAstrologiaController } from './metodoAstrologia.controller';
import { MetodoAstrologiaService } from './metodoAstrologia.service';
import { CartaNatalService } from './cartaNatal.service';
import { DatabaseService } from '../database.service';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [MailModule, UsersModule],
  controllers: [MetodoAstrologiaController],
  providers: [MetodoAstrologiaService, CartaNatalService, DatabaseService],
})
export class MetodoAstrologiaModule {}
