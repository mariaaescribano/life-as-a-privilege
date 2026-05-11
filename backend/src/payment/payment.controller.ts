import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('simulate-method')
  @UseGuards(JwtAuthGuard)
  async simulateMethodPurchase(@Req() req: any) {
    return await this.paymentService.simulateMethodPurchase(req.user.userId);
  }
}
