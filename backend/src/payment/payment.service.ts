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
            product_data: { name: 'Astrología — primera disciplina de El Recorrido' },
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
            product_data: { name: 'Psicología — segunda disciplina de El Recorrido' },
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
  // Ayurveda — tercera disciplina de «El Recorrido». Requiere haber pagado
  // antes la segunda disciplina (Psicología → psicologia_suscrito). Mismo
  // importe y mismo flujo: checkout → Stripe → verify → flag en BD.
  // ─────────────────────────────────────────────────────────────────────────
  async createAyurvedaCheckout(userId: string) {
    // Prerrequisito: el recorrido se hace en orden, así que Ayurveda solo se
    // puede adquirir si ya se pagó la segunda disciplina (Psicología).
    const user = (await this.userService.getUserById(userId)) as any;
    if (!user?.psicologia_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Psicología antes de adquirir Ayurveda.',
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
            product_data: { name: 'Ayurveda — tercera disciplina de El Recorrido' },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      metadata: { userId, scope: 'ayurveda' },
      success_url: `${frontendUrl}/home?ayurveda_pagado={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/home`,
    });

    if (!session.url) {
      throw new BadRequestException('Stripe no devolvió URL de checkout');
    }

    return { url: session.url };
  }

  async verifyAyurvedaCheckout(sessionId: string, userId: string) {
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
    if (session.metadata?.scope !== 'ayurveda') {
      return { ok: false as const, reason: 'wrong-scope' };
    }
    if (session.metadata?.userId !== userId) {
      return { ok: false as const, reason: 'wrong-user' };
    }

    await this.userService.marcarSuscritoAyurveda(userId);
    return { ok: true as const };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Medicina China — cuarta disciplina de «El Recorrido». Requiere haber pagado
  // antes la tercera disciplina (Ayurveda → ayurveda_suscrito). Mismo importe y
  // mismo flujo: checkout → Stripe → verify → flag en BD.
  // ─────────────────────────────────────────────────────────────────────────
  async createTcmCheckout(userId: string) {
    // Prerrequisito: el recorrido se hace en orden, así que Medicina China solo
    // se puede adquirir si ya se pagó la tercera disciplina (Ayurveda).
    const user = (await this.userService.getUserById(userId)) as any;
    if (!user?.ayurveda_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Ayurveda antes de adquirir Medicina China.',
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
            product_data: { name: 'Medicina China — cuarta disciplina de El Recorrido' },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      metadata: { userId, scope: 'tcm' },
      success_url: `${frontendUrl}/home?tcm_pagado={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/home`,
    });

    if (!session.url) {
      throw new BadRequestException('Stripe no devolvió URL de checkout');
    }

    return { url: session.url };
  }

  async verifyTcmCheckout(sessionId: string, userId: string) {
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
    if (session.metadata?.scope !== 'tcm') {
      return { ok: false as const, reason: 'wrong-scope' };
    }
    if (session.metadata?.userId !== userId) {
      return { ok: false as const, reason: 'wrong-user' };
    }

    await this.userService.marcarSuscritoTcm(userId);
    return { ok: true as const };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Fisiología — quinta disciplina de «El Recorrido». Requiere haber pagado
  // antes la cuarta disciplina (Medicina China → tcm_suscrito). Mismo importe y
  // mismo flujo: checkout → Stripe → verify → flag en BD.
  // ─────────────────────────────────────────────────────────────────────────
  async createFisiologiaCheckout(userId: string) {
    // Prerrequisito: el recorrido se hace en orden, así que Fisiología solo se
    // puede adquirir si ya se pagó la cuarta disciplina (Medicina China).
    const user = (await this.userService.getUserById(userId)) as any;
    if (!user?.tcm_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Medicina China antes de adquirir Fisiología.',
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
            product_data: { name: 'Fisiología — quinta disciplina de El Recorrido' },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      metadata: { userId, scope: 'fisiologia' },
      success_url: `${frontendUrl}/home?fisiologia_pagado={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/home`,
    });

    if (!session.url) {
      throw new BadRequestException('Stripe no devolvió URL de checkout');
    }

    return { url: session.url };
  }

  async verifyFisiologiaCheckout(sessionId: string, userId: string) {
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
    if (session.metadata?.scope !== 'fisiologia') {
      return { ok: false as const, reason: 'wrong-scope' };
    }
    if (session.metadata?.userId !== userId) {
      return { ok: false as const, reason: 'wrong-user' };
    }

    await this.userService.marcarSuscritoFisiologia(userId);
    return { ok: true as const };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Nutrición — sexta disciplina de «El Recorrido». Requiere haber pagado antes
  // la quinta disciplina (Fisiología → fisiologia_suscrito). Mismo importe y
  // mismo flujo: checkout → Stripe → verify → flag en BD.
  // ─────────────────────────────────────────────────────────────────────────
  async createNutricionCheckout(userId: string) {
    // Prerrequisito: el recorrido se hace en orden, así que Nutrición solo se
    // puede adquirir si ya se pagó la quinta disciplina (Fisiología).
    const user = (await this.userService.getUserById(userId)) as any;
    if (!user?.fisiologia_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Fisiología antes de adquirir Nutrición.',
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
            product_data: { name: 'Nutrición — sexta disciplina de El Recorrido' },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      metadata: { userId, scope: 'nutricion' },
      success_url: `${frontendUrl}/home?nutricion_pagado={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/home`,
    });

    if (!session.url) {
      throw new BadRequestException('Stripe no devolvió URL de checkout');
    }

    return { url: session.url };
  }

  async verifyNutricionCheckout(sessionId: string, userId: string) {
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
    if (session.metadata?.scope !== 'nutricion') {
      return { ok: false as const, reason: 'wrong-scope' };
    }
    if (session.metadata?.userId !== userId) {
      return { ok: false as const, reason: 'wrong-user' };
    }

    await this.userService.marcarSuscritoNutricion(userId);
    return { ok: true as const };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Cábala — séptima disciplina de «El Recorrido». Requiere haber pagado antes
  // la sexta disciplina (Nutrición → nutricion_suscrito). Mismo importe y mismo
  // flujo: checkout → Stripe → verify → flag en BD.
  // ─────────────────────────────────────────────────────────────────────────
  async createCabalaCheckout(userId: string) {
    // Prerrequisito: el recorrido se hace en orden, así que Cábala solo se
    // puede adquirir si ya se pagó la sexta disciplina (Nutrición).
    const user = (await this.userService.getUserById(userId)) as any;
    if (!user?.nutricion_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Nutrición antes de adquirir Cábala.',
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
            product_data: { name: 'Cábala — séptima disciplina de El Recorrido' },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      metadata: { userId, scope: 'cabala' },
      success_url: `${frontendUrl}/home?cabala_pagado={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/home`,
    });

    if (!session.url) {
      throw new BadRequestException('Stripe no devolvió URL de checkout');
    }

    return { url: session.url };
  }

  async verifyCabalaCheckout(sessionId: string, userId: string) {
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
    if (session.metadata?.scope !== 'cabala') {
      return { ok: false as const, reason: 'wrong-scope' };
    }
    if (session.metadata?.userId !== userId) {
      return { ok: false as const, reason: 'wrong-user' };
    }

    await this.userService.marcarSuscritoCabala(userId);
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

  async testUnlock(userId: string, scope: 'metodo' | 'psicologia' | 'ayurveda' | 'tcm' | 'fisiologia' | 'nutricion' | 'cabala' | 'all') {
    if (!PaymentService.testPagosHabilitado()) {
      throw new ForbiddenException('El modo test de pagos no está habilitado.');
    }
    // Cadena de prerrequisitos: Cábala requiere Nutrición, que requiere
    // Fisiología, que requiere Medicina China, que requiere Ayurveda, que
    // requiere Psicología, que a su vez requiere Astrología. Al desbloquear una
    // disciplina, desbloqueamos también las anteriores para respetar el orden.
    if (scope === 'metodo' || scope === 'psicologia' || scope === 'ayurveda' || scope === 'tcm' || scope === 'fisiologia' || scope === 'nutricion' || scope === 'cabala' || scope === 'all') {
      await this.userService.marcarSuscritoMetodo(userId);
    }
    if (scope === 'psicologia' || scope === 'ayurveda' || scope === 'tcm' || scope === 'fisiologia' || scope === 'nutricion' || scope === 'cabala' || scope === 'all') {
      await this.userService.marcarSuscritoPsicologia(userId);
    }
    if (scope === 'ayurveda' || scope === 'tcm' || scope === 'fisiologia' || scope === 'nutricion' || scope === 'cabala' || scope === 'all') {
      await this.userService.marcarSuscritoAyurveda(userId);
    }
    if (scope === 'tcm' || scope === 'fisiologia' || scope === 'nutricion' || scope === 'cabala' || scope === 'all') {
      await this.userService.marcarSuscritoTcm(userId);
    }
    if (scope === 'fisiologia' || scope === 'nutricion' || scope === 'cabala' || scope === 'all') {
      await this.userService.marcarSuscritoFisiologia(userId);
    }
    if (scope === 'nutricion' || scope === 'cabala' || scope === 'all') {
      await this.userService.marcarSuscritoNutricion(userId);
    }
    if (scope === 'cabala' || scope === 'all') {
      await this.userService.marcarSuscritoCabala(userId);
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
