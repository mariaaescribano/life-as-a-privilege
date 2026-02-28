import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  createPaymentIntent(@Body() body: { amount: number }) {
    return this.paymentService.createPaymentIntent(body.amount);
  }
}
