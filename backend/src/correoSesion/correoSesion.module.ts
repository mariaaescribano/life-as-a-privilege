import { Module } from '@nestjs/common';
import { CorreoSesionController } from './correoSesion.controller';
import { InformesController } from './informes.controller';
import { DatabaseService } from '../database.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [CorreoSesionController, InformesController],
  providers: [DatabaseService],
})
export class CorreoSesionModule {}
