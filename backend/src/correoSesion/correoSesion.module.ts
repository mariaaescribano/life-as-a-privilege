import { Module } from '@nestjs/common';
import { InformesController } from './informes.controller';
import { DatabaseService } from '../database.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [InformesController],
  providers: [DatabaseService],
})
export class CorreoSesionModule {}
