import { Module } from '@nestjs/common';
import { CorreoSesionController } from './correoSesion.controller';
import { DatabaseService } from '../database.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [CorreoSesionController],
  providers: [DatabaseService],
})
export class CorreoSesionModule {}
