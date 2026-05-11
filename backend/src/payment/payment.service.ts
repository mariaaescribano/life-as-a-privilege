import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class PaymentService {
  constructor(private readonly userService: UserService) {}

  async simulateMethodPurchase(userId: string) {
    const user = await this.userService.marcarSuscritoMetodo(userId);
    return {
      success: true,
      user,
    };
  }
}
