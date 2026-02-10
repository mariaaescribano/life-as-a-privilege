import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get()
  getData() {
    return { message: 'Hello from NestJS 🚀' };
  }
}
