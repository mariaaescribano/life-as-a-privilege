import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';

@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async subscribe(@Body() body: { email: string }) {
    if (!body.email) return { success: false };
    await this.subscribeService.addEmail(body.email.trim().toLowerCase());
    return { success: true };
  }
}
