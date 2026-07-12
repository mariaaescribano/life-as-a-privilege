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

  @Post('psicologia/checkout')
  @UseGuards(JwtAuthGuard)
  async createPsicologiaCheckout(@Req() req: any) {
    return await this.paymentService.createPsicologiaCheckout(req.user.userId);
  }

  @Get('psicologia/verify')
  @UseGuards(JwtAuthGuard)
  async verifyPsicologiaCheckout(@Req() req: any, @Query('session_id') sessionId: string) {
    return await this.paymentService.verifyPsicologiaCheckout(sessionId, req.user.userId);
  }

  @Post('ayurveda/checkout')
  @UseGuards(JwtAuthGuard)
  async createAyurvedaCheckout(@Req() req: any) {
    return await this.paymentService.createAyurvedaCheckout(req.user.userId);
  }

  @Get('ayurveda/verify')
  @UseGuards(JwtAuthGuard)
  async verifyAyurvedaCheckout(@Req() req: any, @Query('session_id') sessionId: string) {
    return await this.paymentService.verifyAyurvedaCheckout(sessionId, req.user.userId);
  }

  @Post('tcm/checkout')
  @UseGuards(JwtAuthGuard)
  async createTcmCheckout(@Req() req: any) {
    return await this.paymentService.createTcmCheckout(req.user.userId);
  }

  @Get('tcm/verify')
  @UseGuards(JwtAuthGuard)
  async verifyTcmCheckout(@Req() req: any, @Query('session_id') sessionId: string) {
    return await this.paymentService.verifyTcmCheckout(sessionId, req.user.userId);
  }

  @Post('fisiologia/checkout')
  @UseGuards(JwtAuthGuard)
  async createFisiologiaCheckout(@Req() req: any) {
    return await this.paymentService.createFisiologiaCheckout(req.user.userId);
  }

  @Get('fisiologia/verify')
  @UseGuards(JwtAuthGuard)
  async verifyFisiologiaCheckout(@Req() req: any, @Query('session_id') sessionId: string) {
    return await this.paymentService.verifyFisiologiaCheckout(sessionId, req.user.userId);
  }

  // ── Modo test (solo si ALLOW_TEST_PAGOS=true) ──
  @Get('test/enabled')
  testEnabled() {
    return { enabled: PaymentService.testPagosHabilitado() };
  }

  @Post('test/unlock')
  @UseGuards(JwtAuthGuard)
  async testUnlock(@Req() req: any, @Body() body: { scope?: 'metodo' | 'psicologia' | 'ayurveda' | 'tcm' | 'fisiologia' | 'all' }) {
    return await this.paymentService.testUnlock(req.user.userId, body?.scope ?? 'all');
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
