import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SubscribeService } from './subscribe.service';
import { LIMITE_FORMULARIO } from '../rate-limit';

@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post()
  @Throttle(LIMITE_FORMULARIO)
  @HttpCode(HttpStatus.OK)
  async subscribe(@Body() body: { email: string; origen?: string }) {
    if (!body.email) return { success: false };
    await this.subscribeService.addEmail(
      body.email.trim().toLowerCase(),
      body.origen,
    );
    return { success: true };
  }
}
