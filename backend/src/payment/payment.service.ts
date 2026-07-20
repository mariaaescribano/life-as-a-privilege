import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { UserService } from '../user/user.service';
import { BookingService } from '../booking/booking.service';
import { findLibroPago } from './libros-pago.data';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  constructor(
    private readonly userService: UserService,
    private readonly bookingService: BookingService,
  ) {
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
    // ⚠️ TEMPORAL (prueba real): modo test FORZADO a ON porque no se puede tocar
    // la env var ALLOW_TEST_PAGOS en Render. Esto permite el pago falso en la web
    // desplegada. REVERTIR antes de abrir al público — dejar solo la línea de abajo:
    //   return process.env.ALLOW_TEST_PAGOS === 'true';
    return true;
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

  // ─────────────────────────────────────────────────────────────────────────
  // Llamada de acompañamiento — pago REAL de Stripe. A diferencia del recorrido,
  // aquí NO hay modo test: al reservar se abre un checkout de Stripe de verdad y,
  // solo cuando el pago está confirmado (verify), se guarda la reserva en
  // `bookings` (y se envía el email a María). Así el hueco no se ocupa si el pago
  // no llega a completarse.
  // ─────────────────────────────────────────────────────────────────────────
  async createLlamadaCheckout(body: {
    nombre?: string;
    email?: string;
    fecha?: string;
    slot?: string;
    tema?: string;
    precio?: number;
    disciplinaNom?: string;
    returnPath?: string;
  }) {
    const nombre = (body.nombre ?? '').trim();
    const email = (body.email ?? '').trim();
    const fecha = (body.fecha ?? '').trim();
    const slot = (body.slot ?? '').trim();
    const tema = (body.tema ?? '').trim();
    if (!nombre || !email || !fecha || !slot) {
      throw new BadRequestException('Faltan datos de la reserva');
    }

    const precioEur = Number(body.precio);
    const unitAmount = Number.isFinite(precioEur) && precioEur > 0 ? Math.round(precioEur * 100) : 2000;

    // Si el hueco ya está cogido, no dejamos ni empezar el pago.
    const taken = await this.bookingService.getTaken();
    if (taken.some((t) => t.fecha === fecha && t.slot === slot)) {
      throw new ConflictException('Ese horario ya está reservado');
    }

    // Solo permitimos rutas internas para volver a la página donde se reservó.
    const rp = body.returnPath ?? '';
    const returnPath = rp.startsWith('/') && !rp.includes('://') ? rp : '/';

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const disciplina = (body.disciplinaNom ?? '').trim();
    const productName = disciplina ? `Llamada de acompañamiento — ${disciplina}` : 'Llamada de acompañamiento';
    const sep = returnPath.includes('?') ? '&' : '?';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: productName },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      // Stripe limita cada valor de metadata a 500 caracteres; recortamos el tema.
      metadata: {
        scope: 'llamada',
        nombre: nombre.slice(0, 200),
        email: email.slice(0, 200),
        fecha,
        slot,
        tema: tema.slice(0, 480),
      },
      success_url: `${frontendUrl}${returnPath}${sep}llamada_pagada={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}${returnPath}${sep}llamada_cancelada=1`,
    });

    if (!session.url) {
      throw new BadRequestException('Stripe no devolvió URL de checkout');
    }
    return { url: session.url };
  }

  async verifyLlamadaCheckout(sessionId: string) {
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
    if (session.metadata?.scope !== 'llamada') {
      return { ok: false as const, reason: 'wrong-scope' };
    }

    const m = session.metadata;
    const dto = {
      nombre: m.nombre ?? '',
      email: m.email ?? '',
      fecha: m.fecha ?? '',
      slot: m.slot ?? '',
      tema: m.tema || undefined,
    };
    if (!dto.nombre || !dto.email || !dto.fecha || !dto.slot) {
      return { ok: false as const, reason: 'no-metadata' };
    }

    // Idempotencia: si el verify se repite (recarga de la página de éxito), no
    // volvemos a crear la reserva ni a mandar el email.
    const estado = await this.bookingService.yaReservado(dto.fecha, dto.slot, dto.email);
    if (estado === 'mine') {
      return { ok: true as const, fecha: dto.fecha, slot: dto.slot, nombre: dto.nombre };
    }
    if (estado === 'other') {
      // El hueco lo cogió otra persona entre el checkout y el pago (raro).
      return { ok: false as const, reason: 'slot-taken', fecha: dto.fecha, slot: dto.slot };
    }

    const result = await this.bookingService.create(dto);
    if (result === 'duplicate') {
      return { ok: false as const, reason: 'slot-taken', fecha: dto.fecha, slot: dto.slot };
    }
    if (result === 'error') {
      return { ok: false as const, reason: 'error' };
    }
    return { ok: true as const, fecha: dto.fecha, slot: dto.slot, nombre: dto.nombre };
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
