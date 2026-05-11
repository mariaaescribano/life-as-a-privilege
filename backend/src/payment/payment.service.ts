import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async simulateMethodPurchase(userId: string) {
    const user = await this.userService.marcarSuscritoMetodo(userId);

    if (user.email) {
      await this.mailService.enviarBienvenidaMetodo(user.email, user.name);
    }

    return {
      success: true,
      user,
    };
  }
}
