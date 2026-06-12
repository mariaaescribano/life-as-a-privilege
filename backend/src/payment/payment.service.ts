import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
