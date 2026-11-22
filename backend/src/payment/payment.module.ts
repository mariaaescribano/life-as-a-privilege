import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { UsersModule } from '../user/user.module';
import { BookingModule } from '../booking/booking.module';
import { MailModule } from '../mail/mail.module';
import { PremiumModule } from '../premium/premium.module';
import { LecturaModule } from '../lectura/lectura.module';

@Module({
  imports: [UsersModule, BookingModule, MailModule, PremiumModule, LecturaModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
