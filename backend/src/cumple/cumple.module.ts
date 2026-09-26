import { Module } from '@nestjs/common';
import { CumpleController } from './cumple.controller';
import { CumpleService } from './cumple.service';
import { DatabaseService } from '../database.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [CumpleController],
  providers: [CumpleService, DatabaseService],
})
export class CumpleModule {}
