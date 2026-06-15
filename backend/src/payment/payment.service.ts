import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { UserService } from '../user/user.service';
import { findLibroPago } from './libros-pago.data';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  constructor(private readonly userService: UserService) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY no está configurado en el entorno');
    }
    this.stripe = new Stripe(key);
  }

  async createMetodoCheckout(userId: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Astrología — primera disciplina de «El Recorrido»' },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      metadata: { userId, scope: 'metodo' },
      success_url: `${frontendUrl}/home?metodo_pagado={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/home`,
    });

    if (!session.url) {
      throw new BadRequestException('Stripe no devolvió URL de checkout');
    }

    return { url: session.url };
  }

  async verifyMetodoCheckout(sessionId: string, userId: string) {
    if (!sessionId) throw new BadRequestException('session_id requerido');

    let session: Stripe.Checkout.Session;
    try {
      session = await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      return { ok: false as const, reason: 'invalid-session' };
    }

    if (session.payment_status !== 'paid') {
      return { ok: false as const, reason: 'unpaid' };
    }
    if (session.metadata?.scope !== 'metodo') {
      return { ok: false as const, reason: 'wrong-scope' };
    }
    if (session.metadata?.userId !== userId) {
      return { ok: false as const, reason: 'wrong-user' };
    }

    await this.userService.marcarSuscritoMetodo(userId);
    return { ok: true as const };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Psicología — segunda disciplina de «El Recorrido». Requiere haber pagado
  // antes la primera disciplina (Astrología → metodo_suscrito). Mismo importe
  // y mismo flujo que el método: checkout → Stripe → verify → flag en BD.
  // ─────────────────────────────────────────────────────────────────────────
  async createPsicologiaCheckout(userId: string) {
    // Prerrequisito: el recorrido se hace en orden, así que Psicología solo se
    // puede adquirir si ya se pagó la primera disciplina (Astrología).
    const user = (await this.userService.getUserById(userId)) as any;
    if (!user?.metodo_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Astrología antes de adquirir Psicología.',
      );
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Psicología — segunda disciplina de «El Recorrido»' },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      metadata: { userId, scope: 'psicologia' },
      success_url: `${frontendUrl}/home?psicologia_pagado={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/home`,
    });

    if (!session.url) {
      throw new BadRequestException('Stripe no devolvió URL de checkout');
    }

    return { url: session.url };
  }

  async verifyPsicologiaCheckout(sessionId: string, userId: string) {
    if (!sessionId) throw new BadRequestException('session_id requerido');

    let session: Stripe.Checkout.Session;
    try {
      session = await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      return { ok: false as const, reason: 'invalid-session' };
    }

    if (session.payment_status !== 'paid') {
      return { ok: false as const, reason: 'unpaid' };
    }
    if (session.metadata?.scope !== 'psicologia') {
      return { ok: false as const, reason: 'wrong-scope' };
    }
    if (session.metadata?.userId !== userId) {
      return { ok: false as const, reason: 'wrong-user' };
    }

    await this.userService.marcarSuscritoPsicologia(userId);
    return { ok: true as const };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MODO TEST — desbloqueo sin pasar por Stripe. SOLO se activa si la variable
  // de entorno ALLOW_TEST_PAGOS === 'true' (nunca en producción). Marca los
  // flags directamente para poder probar el recorrido sin cobro real.
  // ─────────────────────────────────────────────────────────────────────────
  static testPagosHabilitado(): boolean {
    return process.env.ALLOW_TEST_PAGOS === 'true';
  }

  async testUnlock(userId: string, scope: 'metodo' | 'psicologia' | 'all') {
    if (!PaymentService.testPagosHabilitado()) {
      throw new ForbiddenException('El modo test de pagos no está habilitado.');
    }
    // Psicología requiere Astrología: al desbloquearla, desbloqueamos también
    // la primera disciplina para respetar el prerrequisito.
    if (scope === 'metodo' || scope === 'psicologia' || scope === 'all') {
      await this.userService.marcarSuscritoMetodo(userId);
    }
    if (scope === 'psicologia' || scope === 'all') {
      await this.userService.marcarSuscritoPsicologia(userId);
    }
    return { ok: true as const };
  }

  async createLibroCheckout(libroId: string) {
    const libro = findLibroPago(libroId);
    if (!libro) throw new NotFoundException('Libro no encontrado');

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: libro.titulo },
            unit_amount: libro.precioCentimos,
          },
          quantity: 1,
        },
      ],
      metadata: { libroId: libro.id },
      success_url: `${frontendUrl}/libros/descargar?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/libros`,
    });

    if (!session.url) {
      throw new BadRequestException('Stripe no devolvió URL de checkout');
    }

    return { url: session.url };
  }

  async verifyLibroCheckout(sessionId: string) {
    if (!sessionId) throw new BadRequestException('session_id requerido');

    let session: Stripe.Checkout.Session;
    try {
      session = await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      return { ok: false as const, reason: 'invalid-session' };
    }

    if (session.payment_status !== 'paid') {
      return { ok: false as const, reason: 'unpaid' };
    }

    const libroId = session.metadata?.libroId;
    if (!libroId) {
      return { ok: false as const, reason: 'no-metadata' };
    }

    const libro = findLibroPago(libroId);
    if (!libro) {
      return { ok: false as const, reason: 'libro-not-found' };
    }

    return {
      ok: true as const,
      libroId: libro.id,
      titulo: libro.titulo,
      pdfLink: libro.pdfLink,
    };
  }
}
