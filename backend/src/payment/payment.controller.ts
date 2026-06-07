import { BadRequestException, Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('metodo/checkout')
  @UseGuards(JwtAuthGuard)
  async createMetodoCheckout(@Req() req: any) {
    return await this.paymentService.createMetodoCheckout(req.user.userId);
  }

  @Get('metodo/verify')
  @UseGuards(JwtAuthGuard)
  async verifyMetodoCheckout(@Req() req: any, @Query('session_id') sessionId: string) {
    return await this.paymentService.verifyMetodoCheckout(sessionId, req.user.userId);
  }

  /* TEST PAGO — marca suscrito sin pasar por Stripe (para pruebas) */
  @Post('metodo/test')
  @UseGuards(JwtAuthGuard)
  async testPagoMetodo(@Req() req: any) {
    return await this.paymentService.testMarcarPagado(req.user.userId);
  }

  @Post('libros/checkout')
  async createLibroCheckout(@Body() body: { libroId?: string }) {
    if (!body?.libroId) throw new BadRequestException('libroId requerido');
    return await this.paymentService.createLibroCheckout(body.libroId);
  }

  @Get('libros/verify')
  async verifyLibroCheckout(@Query('session_id') sessionId: string) {
    return await this.paymentService.verifyLibroCheckout(sessionId);
  }
}
