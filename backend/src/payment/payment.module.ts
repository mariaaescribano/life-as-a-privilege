import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { UsersModule } from '../user/user.module';

@Module({
  imports: [UsersModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
