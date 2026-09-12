import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { UserService } from '../user/user.service';
import { BookingService } from '../booking/booking.service';
import { findLibroPago } from './libros-pago.data';
import { findLlamadaPago } from './llamadas-pago.data';
import { MailService } from '../mail/mail.service';

/** Los ocho scopes de «El Recorrido», en orden. */
export type DisciplinaScope =
  | 'metodo' | 'psicologia' | 'ayurveda' | 'tcm'
  | 'fisiologia' | 'nutricion' | 'cabala' | 'cultura';

/**
 * Tabla única de disciplinas: para cada scope, qué columna hay que tener ya
 * pagada (cadena de prerrequisitos) y con qué método se marca la suscripción.
 * La usa el verify del Payment Link compartido, que recibe el scope dentro del
 * `client_reference_id` en vez de tener un endpoint por disciplina.
 */
const DISCIPLINAS: Record<
  DisciplinaScope,
  { nombre: string; requiere: string | null; requiereNom: string | null; marcar: keyof UserService }
> = {
  metodo:     { nombre: 'Astrología',     requiere: null,                  requiereNom: null,             marcar: 'marcarSuscritoMetodo' },
  psicologia: { nombre: 'Psicología',     requiere: 'metodo_suscrito',     requiereNom: 'Astrología',     marcar: 'marcarSuscritoPsicologia' },
  ayurveda:   { nombre: 'Ayurveda',       requiere: 'psicologia_suscrito', requiereNom: 'Psicología',     marcar: 'marcarSuscritoAyurveda' },
  tcm:        { nombre: 'Medicina China', requiere: 'ayurveda_suscrito',   requiereNom: 'Ayurveda',       marcar: 'marcarSuscritoTcm' },
  fisiologia: { nombre: 'Fisiología',     requiere: 'tcm_suscrito',        requiereNom: 'Medicina China', marcar: 'marcarSuscritoFisiologia' },
  nutricion:  { nombre: 'Nutrición',      requiere: 'fisiologia_suscrito', requiereNom: 'Fisiología',     marcar: 'marcarSuscritoNutricion' },
  cabala:     { nombre: 'Cábala',         requiere: 'nutricion_suscrito',  requiereNom: 'Nutrición',      marcar: 'marcarSuscritoCabala' },
  cultura:    { nombre: 'Cultura',        requiere: 'cabala_suscrito',     requiereNom: 'Cábala',         marcar: 'marcarSuscritoCultura' },
};

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;

  // Si es `true`, cada disciplina exige haber pagado la anterior de la cadena
  // (Astrología → Psicología → … → Cultura). En `false` se puede pagar cualquier
  // disciplina directamente, sin orden. Poner en `true` para restaurar el camino.
  //
  // Está en `false`: el orden del Mapa es el ACONSEJADO, no obligatorio. Cada
  // una se desbloquea cuando la usuaria quiera, empiece por donde empiece y se
  // salte las que se salte. Los prerrequisitos de la tabla DISCIPLINAS se
  // conservan (dan el nombre de la anterior en los mensajes) pero no bloquean.
  private static readonly PAGO_SECUENCIAL = false;

  constructor(
    private readonly userService: UserService,
    private readonly bookingService: BookingService,
    private readonly mailService: MailService,
  ) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY no está configurado en el entorno');
    }
    this.stripe = new Stripe(key);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // MÉTODOS DE PAGO (tarjeta, Bizum…)
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Qué formas de pago se le ofrecen a la persona en el Checkout.
   *
   * Por defecto, TARJETA y nada más: exactamente lo que había siempre, para que
   * un despliegue no cambie el cobro por sorpresa.
   *
   * Si en el entorno está `STRIPE_PMC` (el id `pmc_…` de una «configuración de
   * métodos de pago» de Stripe), se usa esa configuración y manda el panel de
   * Stripe. Así se añade **Bizum** —o se quita— desde el panel, sin tocar una
   * línea de código ni volver a desplegar.
   *
   * Por qué una configuración y no `payment_method_types: ['card', 'bizum']`:
   * Bizum es un método local que Stripe sirve a través de las configuraciones
   * (ni siquiera figura en los tipos del SDK), y enumerar los métodos a mano
   * obligaría a tocar los diez checkouts cada vez que cambie uno.
   *
   * Ojo: los Payment Links (las ocho disciplinas, los cursos, la donación) NO
   * pasan por aquí. Esos se configuran enteros en el panel de Stripe.
   */
  private metodosDePago(): Pick<
    Stripe.Checkout.SessionCreateParams,
    'payment_method_types' | 'payment_method_configuration'
  > {
    const pmc = process.env.STRIPE_PMC?.trim();
    if (pmc) return { payment_method_configuration: pmc };
    return { payment_method_types: ['card'] };
  }

  // ═════════════════════════════════════════════════════════════════════════
  // WEBHOOK DE STRIPE
  //
  // Los `verify*` de más abajo solo se ejecutan si el navegador vuelve al
  // `success_url`. Si la persona cierra la pestaña, se queda sin cobertura o el
  // pago se confirma más tarde (transferencias, 3-D Secure lento), el cobro se
  // hace igual y nunca se le daba el acceso: dinero cobrado sin servicio.
  //
  // El webhook cierra ese agujero: Stripe nos avisa servidor-a-servidor de cada
  // pago completado y aquí se concede lo comprado, pase lo que pase con el
  // navegador. Los `verify*` siguen existiendo para que el desbloqueo sea
  // inmediato al volver; ambos caminos son idempotentes, así que no importa cuál
  // llegue primero ni que lleguen los dos.
  // ═════════════════════════════════════════════════════════════════════════

  /** Eventos que significan «este pago ya es firme». */
  private static readonly EVENTOS_PAGADOS = [
    'checkout.session.completed',
    'checkout.session.async_payment_succeeded',
  ];

  /**
   * Verifica la firma del webhook y procesa el evento. Devuelve `{ recibido: true }`
   * para que Stripe marque la entrega como buena; si algo del procesado falla,
   * lanzamos y Stripe reintenta automáticamente.
   */
  async handleWebhook(rawBody: Buffer | undefined, signature: string | undefined) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      // Sin secreto no se puede verificar nada, y aceptar eventos sin verificar
      // permitiría a cualquiera regalarse el recorrido con un simple POST.
      console.error('[webhook] STRIPE_WEBHOOK_SECRET no configurado — evento rechazado.');
      throw new BadRequestException('Webhook no configurado');
    }
    if (!rawBody || !signature) {
      throw new BadRequestException('Falta el cuerpo o la firma del webhook');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch (err: any) {
      // Firma inválida: o no viene de Stripe, o el secreto no es el que toca.
      console.error('[webhook] Firma inválida:', err?.message);
      throw new BadRequestException('Firma de webhook inválida');
    }

    if (!PaymentService.EVENTOS_PAGADOS.includes(event.type)) {
      return { recibido: true, ignorado: event.type };
    }

    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== 'paid') {
      return { recibido: true, ignorado: 'unpaid' };
    }

    await this.procesarSesionPagada(session, `webhook:${event.type}`);
    return { recibido: true };
  }

  /**
   * Concede lo que se haya comprado en una sesión de Stripe ya pagada. Es el
   * tronco común del webhook: mira de qué compra se trata y la aplica.
   * Todo lo que hace es idempotente (marcar flags que ya están a `true`, crear
   * una reserva que comprueba duplicados), así que repetirlo no rompe nada.
   */
  private async procesarSesionPagada(session: Stripe.Checkout.Session, origen: string) {
    // 1. Llamada de acompañamiento.
    if (session.metadata?.scope === 'llamada') {
      const res = await this.guardarReservaDeSesion(session);
      console.log(`[${origen}] llamada → ${res}`);
      return;
    }

    // 2. Compra de un libro suelto (no requiere cuenta).
    if (session.metadata?.libroId) {
      await this.entregarLibroDeSesion(session);
      console.log(`[${origen}] libro ${session.metadata.libroId} entregado`);
      return;
    }

    // 3. Disciplina de El Recorrido. Puede venir por dos caminos:
    //    - checkout propio     → metadata { userId, scope }
    //    - Payment Link común  → client_reference_id "<scope>__<userId>"
    const ref = this.leerDisciplinaDeSesion(session);
    if (!ref) {
      console.warn(`[${origen}] sesión pagada sin scope reconocible (${session.id})`);
      return;
    }

    // Ojo: aquí NO se comprueba la cadena de prerrequisitos. El dinero ya está
    // cobrado, así que negar el acceso por orden sería lo peor de los dos mundos.
    // El orden se hace cumplir ANTES, al crear el checkout.
    await this.conceder(ref.scope, ref.userId, origen);
  }

  /**
   * Tronco ÚNICO de «esta persona ya tiene pagada esta disciplina»: lo llaman
   * tanto el webhook como los verify de la vuelta del pago, y por eso mismo se
   * repite (cada recarga de /home vuelve a verificar, y Stripe puede reintentar
   * el evento). Marcar el flag dos veces da igual, pero mandar dos veces los
   * correos no, así que se mira el estado ANTES de marcarlo y los avisos salen
   * SOLO la primera vez: uno a la persona («ya es tuya») y otro a la creadora
   * («ha pagado»), que es el correo con el que se entera de que ha entrado
   * dinero.
   */
  private async conceder(scope: DisciplinaScope, userId: string, origen: string) {
    const def = DISCIPLINAS[scope];
    const antes = (await this.userService.getUserById(userId).catch(() => null)) as any;
    const yaLaTenia = !!antes?.[`${scope}_suscrito`];

    await (this.userService as any)[def.marcar](userId);
    console.log(`[${origen}] ${scope} concedida a ${userId}${yaLaTenia ? ' (ya la tenía)' : ''}`);

    if (yaLaTenia || !antes?.email) return;

    try {
      await this.mailService.enviarDisciplinaDesbloqueada(antes.email, antes.name ?? '', def.nombre);
      await this.mailService.enviarAvisoCompra(antes.email, antes.name ?? '', def.nombre);
    } catch (err) {
      // Los emails son un extra: si fallan, el acceso ya está concedido y no
      // queremos que Stripe reintente el evento por esto.
      console.error(`[${origen}] no se pudo enviar el email de ${def.nombre}:`, err);
    }
  }

  /** Extrae `{ scope, userId }` de una sesión, venga por metadata o por client_reference_id. */
  private leerDisciplinaDeSesion(
    session: Stripe.Checkout.Session,
  ): { scope: DisciplinaScope; userId: string } | null {
    const scopeMeta = session.metadata?.scope as DisciplinaScope | undefined;
    const userIdMeta = session.metadata?.userId;
    if (scopeMeta && userIdMeta && DISCIPLINAS[scopeMeta]) {
      return { scope: scopeMeta, userId: userIdMeta };
    }

    // <scope>__<userId>. Partimos por el PRIMER '__' porque el scope nunca lo
    // lleva, pero el userId sí podría llevar guiones.
    const ref = session.client_reference_id ?? '';
    const corte = ref.indexOf('__');
    if (corte <= 0) return null;
    const scope = ref.slice(0, corte) as DisciplinaScope;
    const userId = ref.slice(corte + 2);
    if (!DISCIPLINAS[scope] || !userId) return null;
    return { scope, userId };
  }

  /** Crea la reserva de una llamada ya pagada. Comparte lógica con el verify. */
  private async guardarReservaDeSesion(session: Stripe.Checkout.Session) {
    const m = session.metadata ?? {};
    const dto = {
      nombre: m.nombre ?? '',
      email: m.email ?? '',
      fecha: m.fecha ?? '',
      slot: m.slot ?? '',
      tema: m.tema || undefined,
    };
    if (!dto.nombre || !dto.email || !dto.fecha || !dto.slot) return 'no-metadata';

    // Idempotencia: si la reserva ya existe (verify o reintento del webhook), no
    // la duplicamos ni reenviamos el email.
    const estado = await this.bookingService.yaReservado(dto.fecha, dto.slot, dto.email);
    if (estado === 'mine') return 'ya-reservada';
    if (estado === 'other') {
      // Alguien cogió el hueco entre el checkout y la confirmación del pago.
      console.error(
        `[webhook] PAGO COBRADO SIN HUECO — ${dto.email} pagó ${dto.fecha} ${dto.slot}, ` +
        `pero lo tiene otra persona. Hay que reubicar o devolver el importe.`,
      );
      return 'slot-taken';
    }
    return await this.bookingService.create(dto);
  }

  /** Reenvía por email el enlace de descarga de un libro ya pagado. */
  private async entregarLibroDeSesion(session: Stripe.Checkout.Session) {
    const libro = findLibroPago(session.metadata?.libroId ?? '');
    if (!libro) return;
    const email = session.customer_details?.email || session.customer_email;
    if (!email) {
      console.warn(`[webhook] libro ${libro.id} pagado sin email de contacto (${session.id})`);
      return;
    }
    await this.mailService.enviarLibroComprado(email, libro.titulo, libro.pdfLink);
  }

  async createMetodoCheckout(userId: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      ...this.metodosDePago(),
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Astrología — primera disciplina de El Recorrido' },
            unit_amount: 3000,
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

    await this.conceder('metodo', userId, 'verify:metodo');
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
    if (PaymentService.PAGO_SECUENCIAL && !user?.metodo_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Astrología antes de adquirir Psicología.',
      );
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      ...this.metodosDePago(),
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Psicología — segunda disciplina de El Recorrido' },
            unit_amount: 3000,
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

    await this.conceder('psicologia', userId, 'verify:psicologia');
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
    if (PaymentService.PAGO_SECUENCIAL && !user?.psicologia_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Psicología antes de adquirir Ayurveda.',
      );
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      ...this.metodosDePago(),
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Ayurveda — tercera disciplina de El Recorrido' },
            unit_amount: 3000,
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

    await this.conceder('ayurveda', userId, 'verify:ayurveda');
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
    if (PaymentService.PAGO_SECUENCIAL && !user?.ayurveda_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Ayurveda antes de adquirir Medicina China.',
      );
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      ...this.metodosDePago(),
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Medicina China — cuarta disciplina de El Recorrido' },
            unit_amount: 3000,
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

    await this.conceder('tcm', userId, 'verify:tcm');
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
    if (PaymentService.PAGO_SECUENCIAL && !user?.tcm_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Medicina China antes de adquirir Fisiología.',
      );
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      ...this.metodosDePago(),
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Fisiología — quinta disciplina de El Recorrido' },
            unit_amount: 3000,
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

    await this.conceder('fisiologia', userId, 'verify:fisiologia');
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
    if (PaymentService.PAGO_SECUENCIAL && !user?.fisiologia_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Fisiología antes de adquirir Nutrición.',
      );
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      ...this.metodosDePago(),
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Nutrición — sexta disciplina de El Recorrido' },
            unit_amount: 3000,
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

    await this.conceder('nutricion', userId, 'verify:nutricion');
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
    if (PaymentService.PAGO_SECUENCIAL && !user?.nutricion_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Nutrición antes de adquirir Cábala.',
      );
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      ...this.metodosDePago(),
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Cábala — séptima disciplina de El Recorrido' },
            unit_amount: 3000,
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

    await this.conceder('cabala', userId, 'verify:cabala');
    return { ok: true as const };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Cultura — octava (y última) disciplina de «El Recorrido». Requiere haber
  // pagado antes la séptima disciplina (Cábala → cabala_suscrito). Mismo importe
  // y mismo flujo: checkout → Stripe → verify → flag en BD.
  // ─────────────────────────────────────────────────────────────────────────
  async createCulturaCheckout(userId: string) {
    // Prerrequisito: el recorrido se hace en orden, así que Cultura solo se
    // puede adquirir si ya se pagó la séptima disciplina (Cábala).
    const user = (await this.userService.getUserById(userId)) as any;
    if (PaymentService.PAGO_SECUENCIAL && !user?.cabala_suscrito) {
      throw new ForbiddenException(
        'Necesitas completar el pago de Cábala antes de adquirir Cultura.',
      );
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      ...this.metodosDePago(),
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: 'Cultura — octava disciplina de El Recorrido' },
            unit_amount: 3000,
          },
          quantity: 1,
        },
      ],
      metadata: { userId, scope: 'cultura' },
      success_url: `${frontendUrl}/home?cultura_pagado={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/home`,
    });

    if (!session.url) {
      throw new BadRequestException('Stripe no devolvió URL de checkout');
    }

    return { url: session.url };
  }

  async verifyCulturaCheckout(sessionId: string, userId: string) {
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
    if (session.metadata?.scope !== 'cultura') {
      return { ok: false as const, reason: 'wrong-scope' };
    }
    if (session.metadata?.userId !== userId) {
      return { ok: false as const, reason: 'wrong-user' };
    }

    await this.conceder('cultura', userId, 'verify:cultura');
    return { ok: true as const };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PAYMENT LINK COMPARTIDO — las ocho disciplinas se cobran por separado, pero
  // todas a través del MISMO enlace de Stripe (mismo importe). Como un Payment
  // Link es una URL estática y no sabe quién la abre, el frontend le añade
  //     ?client_reference_id=<scope>__<userId>
  // (Stripe solo admite [A-Za-z0-9_-] ahí, y el userId es un UUID, así que cabe).
  // Al terminar el pago, el enlace redirige a
  //     /home?disciplina_pagada={CHECKOUT_SESSION_ID}
  // y este verify recupera la sesión, saca de vuelta el scope y el userId, y
  // marca el flag de esa disciplina — igual que hacía el metadata.userId de los
  // Checkout Sessions, pero con la referencia que sí viaja en un Payment Link.
  // ─────────────────────────────────────────────────────────────────────────
  async verifyDisciplinaLink(sessionId: string, userId: string) {
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

    // <scope>__<userId>. Partimos por el PRIMER '__' porque el scope nunca lo
    // lleva, pero el userId sí podría llevar guiones.
    const ref = session.client_reference_id ?? '';
    const corte = ref.indexOf('__');
    if (corte <= 0) {
      return { ok: false as const, reason: 'no-reference' };
    }
    const scope = ref.slice(0, corte) as DisciplinaScope;
    const refUserId = ref.slice(corte + 2);

    const def = DISCIPLINAS[scope];
    if (!def) {
      return { ok: false as const, reason: 'wrong-scope' };
    }
    // El client_reference_id lo pone el cliente, así que nunca desbloqueamos a
    // otra persona: tiene que coincidir con el usuario del token.
    if (refUserId !== userId) {
      return { ok: false as const, reason: 'wrong-user' };
    }

    // El recorrido se hace en orden: la disciplina anterior tiene que estar
    // pagada (salvo que PAGO_SECUENCIAL esté desactivado).
    if (PaymentService.PAGO_SECUENCIAL && def.requiere) {
      const user = (await this.userService.getUserById(userId)) as any;
      if (!user?.[def.requiere]) {
        return { ok: false as const, reason: 'prereq', requiereNom: def.requiereNom };
      }
    }

    // Idempotente: si el verify se repite (recarga de /home), solo re-marca el
    // flag — los correos de `conceder` salen una única vez.
    await this.conceder(scope, userId, 'verify:link');
    return { ok: true as const, scope, nombre: def.nombre };
  }

  // El MODO TEST (desbloqueo sin pasar por Stripe) se eliminó por completo:
  // era la única puerta para abrir una disciplina sin pagar. Regalar el acceso
  // se hace ahora desde el panel /admin/accesos o con ACCESO_LIBRE_EMAILS.

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
    tipo?: string;
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

    // El importe sale de la tabla del servidor, NUNCA del body: el cliente solo
    // elige el tipo de llamada.
    const tarifa = findLlamadaPago(body.tipo);
    if (!tarifa) throw new BadRequestException('Tipo de llamada desconocido');

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
    const productName = disciplina ? `${tarifa.nombre} — ${disciplina}` : tarifa.nombre;
    const sep = returnPath.includes('?') ? '&' : '?';

    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      ...this.metodosDePago(),
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: productName },
            unit_amount: tarifa.precioCentimos,
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
      ...this.metodosDePago(),
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
