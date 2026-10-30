import { Module } from '@nestjs/common';
import { PremiumController, PremiumCronController } from './premium.controller';
import { PremiumService } from './premium.service';
import { WhatsappService } from './whatsapp.service';
import { DatabaseService } from '../database.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [PremiumController, PremiumCronController],
  providers: [PremiumService, WhatsappService, DatabaseService],
  exports: [PremiumService],
})
export class PremiumModule {}
