import { BadRequestException, Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // ── Webhook de Stripe ────────────────────────────────────────────────────
  // SIN JwtAuthGuard a propósito: quien llama es Stripe, no un usuario con
  // sesión. La autenticación es la firma `stripe-signature`, que se verifica
  // contra STRIPE_WEBHOOK_SECRET en el servicio; sin firma válida no se procesa
  // nada. Es lo que garantiza que un pago concede el acceso aunque la persona
  // cierre la pestaña al volver de Stripe.
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return await this.paymentService.handleWebhook(req.rawBody, signature);
  }

  // Verify único del Payment Link compartido por las ocho disciplinas. El scope
  // viaja dentro del client_reference_id de la sesión, así que no hace falta una
  // ruta por disciplina.
  @Get('disciplina/verify')
  @UseGuards(JwtAuthGuard)
  async verifyDisciplinaLink(@Req() req: any, @Query('session_id') sessionId: string) {
    return await this.paymentService.verifyDisciplinaLink(sessionId, req.user.userId);
  }

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

  @Post('nutricion/checkout')
  @UseGuards(JwtAuthGuard)
  async createNutricionCheckout(@Req() req: any) {
    return await this.paymentService.createNutricionCheckout(req.user.userId);
  }

  @Get('nutricion/verify')
  @UseGuards(JwtAuthGuard)
  async verifyNutricionCheckout(@Req() req: any, @Query('session_id') sessionId: string) {
    return await this.paymentService.verifyNutricionCheckout(sessionId, req.user.userId);
  }

  @Post('cabala/checkout')
  @UseGuards(JwtAuthGuard)
  async createCabalaCheckout(@Req() req: any) {
    return await this.paymentService.createCabalaCheckout(req.user.userId);
  }

  @Get('cabala/verify')
  @UseGuards(JwtAuthGuard)
  async verifyCabalaCheckout(@Req() req: any, @Query('session_id') sessionId: string) {
    return await this.paymentService.verifyCabalaCheckout(sessionId, req.user.userId);
  }

  @Post('cultura/checkout')
  @UseGuards(JwtAuthGuard)
  async createCulturaCheckout(@Req() req: any) {
    return await this.paymentService.createCulturaCheckout(req.user.userId);
  }

  @Get('cultura/verify')
  @UseGuards(JwtAuthGuard)
  async verifyCulturaCheckout(@Req() req: any, @Query('session_id') sessionId: string) {
    return await this.paymentService.verifyCulturaCheckout(sessionId, req.user.userId);
  }

  // El modo test de pagos (test/enabled + test/unlock) se eliminó: era la única
  // forma de desbloquear una disciplina sin pagar. Para regalar el acceso a una
  // cuenta está el panel /admin/accesos (o ACCESO_LIBRE_EMAILS).

  // ── Llamada de acompañamiento (pago REAL de Stripe, sin login) ──
  @Post('llamada/checkout')
  async createLlamadaCheckout(
    @Body()
    body: {
      nombre?: string;
      email?: string;
      fecha?: string;
      slot?: string;
      tema?: string;
      // El precio NO viaja en el body: lo fija el servidor a partir del tipo
      // (ver llamadas-pago.data.ts).
      tipo?: string;
      disciplinaNom?: string;
      returnPath?: string;
    },
  ) {
    return await this.paymentService.createLlamadaCheckout(body ?? {});
  }

  @Get('llamada/verify')
  async verifyLlamadaCheckout(@Query('session_id') sessionId: string) {
    return await this.paymentService.verifyLlamadaCheckout(sessionId);
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
