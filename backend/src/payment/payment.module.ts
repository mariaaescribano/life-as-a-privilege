import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { UsersModule } from '../user/user.module';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [UsersModule, BookingModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
