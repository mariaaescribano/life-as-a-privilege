// ─────────────────────────────────────────────────────────────────────────────
// TRAMO 1 · DINERO Y ACCESO
//
// El flujo que fijan estos tests:
//   1. La persona paga (checkout propio o Payment Link común).
//   2. Llega por DOS caminos a la vez: el verify al volver a /home y el webhook
//      de Stripe. Los dos acaban en `conceder`, que es idempotente.
//   3. `conceder` marca el flag <scope>_suscrito y manda los correos SOLO la
//      primera vez.
// Stripe, la BD (UserService/BookingService) y el correo van simulados.
// ─────────────────────────────────────────────────────────────────────────────

const stripeMock = {
  checkout: { sessions: { create: jest.fn(), retrieve: jest.fn() } },
  webhooks: { constructEvent: jest.fn() },
};
jest.mock('stripe', () => ({ __esModule: true, default: jest.fn(() => stripeMock) }));

import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { crearTokenCumple } from '../auth/cumple.util';

const USER = '11111111-2222-3333-4444-555555555555';
const OTRA = '99999999-8888-7777-6666-555555555555';

function montar(user: Record<string, any> = { email: 'ana@x.com', name: 'Ana' }) {
  const userService: any = {
    getUserById: jest.fn().mockResolvedValue(user),
    getCumpleDescuentoUsado: jest.fn().mockResolvedValue(null),
    marcarCumpleDescuentoUsado: jest.fn().mockResolvedValue(undefined),
  };
  for (const s of ['Metodo', 'Psicologia', 'Ayurveda', 'Tcm', 'Fisiologia', 'Nutricion', 'Cabala', 'Cultura']) {
    userService[`marcarSuscrito${s}`] = jest.fn().mockResolvedValue(undefined);
  }
  const bookingService: any = {
    getTaken: jest.fn().mockResolvedValue([]),
    yaReservado: jest.fn().mockResolvedValue('no'),
    create: jest.fn().mockResolvedValue('ok'),
  };
  const mailService: any = {
    enviarDisciplinaDesbloqueada: jest.fn().mockResolvedValue(undefined),
    enviarAvisoCompra: jest.fn().mockResolvedValue(undefined),
    enviarLibroComprado: jest.fn().mockResolvedValue(undefined),
  };
  const service = new PaymentService(userService, bookingService, mailService);
  return { service, userService, bookingService, mailService };
}

const sesionPagada = (extra: Record<string, any> = {}) => ({
  id: 'cs_test_1',
  payment_status: 'paid',
  metadata: {},
  client_reference_id: null,
  ...extra,
});

beforeAll(() => {
  process.env.STRIPE_SECRET_KEY = 'sk_test_x';
  process.env.JWT_SECRET = 'secreto-de-test';
});
beforeEach(() => {
  jest.clearAllMocks();
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_x';
  stripeMock.checkout.sessions.create.mockResolvedValue({ url: 'https://checkout.stripe.test/s' });
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// ═════════════════════════════════════════════════════════════════════════════
describe('Webhook de Stripe', () => {
  it('sin STRIPE_WEBHOOK_SECRET rechaza todo (si no, cualquiera se regala el recorrido)', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const { service, userService } = montar();
    await expect(service.handleWebhook(Buffer.from('{}'), 'firma')).rejects.toBeInstanceOf(BadRequestException);
    expect(userService.marcarSuscritoMetodo).not.toHaveBeenCalled();
  });

  it('sin cuerpo o sin firma, 400', async () => {
    const { service } = montar();
    await expect(service.handleWebhook(undefined, 'f')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.handleWebhook(Buffer.from('{}'), undefined)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('firma inválida, 400 y no concede nada', async () => {
    const { service, userService } = montar();
    stripeMock.webhooks.constructEvent.mockImplementation(() => { throw new Error('bad sig'); });
    await expect(service.handleWebhook(Buffer.from('{}'), 'f')).rejects.toBeInstanceOf(BadRequestException);
    expect(userService.marcarSuscritoMetodo).not.toHaveBeenCalled();
  });

  it('ignora eventos que no son de pago', async () => {
    const { service } = montar();
    stripeMock.webhooks.constructEvent.mockReturnValue({ type: 'customer.created', data: { object: {} } });
    await expect(service.handleWebhook(Buffer.from('{}'), 'f')).resolves.toEqual({ recibido: true, ignorado: 'customer.created' });
  });

  it('checkout completado pero sin pagar (transferencia pendiente) no concede', async () => {
    const { service, userService } = montar();
    stripeMock.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: sesionPagada({ payment_status: 'unpaid', metadata: { scope: 'tcm', userId: USER } }) },
    });
    await expect(service.handleWebhook(Buffer.from('{}'), 'f')).resolves.toEqual({ recibido: true, ignorado: 'unpaid' });
    expect(userService.marcarSuscritoTcm).not.toHaveBeenCalled();
  });

  it.each(['checkout.session.completed', 'checkout.session.async_payment_succeeded'])(
    '%s con metadata del checkout propio concede la disciplina',
    async (type) => {
      const { service, userService } = montar();
      stripeMock.webhooks.constructEvent.mockReturnValue({
        type,
        data: { object: sesionPagada({ metadata: { scope: 'tcm', userId: USER } }) },
      });
      await service.handleWebhook(Buffer.from('{}'), 'f');
      expect(userService.marcarSuscritoTcm).toHaveBeenCalledWith(USER);
    },
  );

  it('Payment Link común: saca scope y userId del client_reference_id', async () => {
    const { service, userService } = montar();
    stripeMock.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: sesionPagada({ client_reference_id: `cabala__${USER}` }) },
    });
    await service.handleWebhook(Buffer.from('{}'), 'f');
    expect(userService.marcarSuscritoCabala).toHaveBeenCalledWith(USER);
  });

  it('client_reference_id con scope inventado no concede nada', async () => {
    const { service, userService } = montar();
    stripeMock.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: sesionPagada({ client_reference_id: `todo__${USER}` }) },
    });
    await expect(service.handleWebhook(Buffer.from('{}'), 'f')).resolves.toEqual({ recibido: true });
    for (const k of Object.keys(userService)) {
      if (k.startsWith('marcarSuscrito')) expect(userService[k]).not.toHaveBeenCalled();
    }
  });

  it('pago de la llamada crea la reserva', async () => {
    const { service, bookingService } = montar();
    stripeMock.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: sesionPagada({ metadata: { scope: 'llamada', nombre: 'Ana', email: 'ana@x.com', fecha: '2026-10-01', slot: '10:00' } }) },
    });
    await service.handleWebhook(Buffer.from('{}'), 'f');
    expect(bookingService.create).toHaveBeenCalledWith(expect.objectContaining({ fecha: '2026-10-01', slot: '10:00' }));
  });

  it('pago de la llamada repetido (reintento de Stripe) no duplica la reserva', async () => {
    const { service, bookingService } = montar();
    bookingService.yaReservado.mockResolvedValue('mine');
    stripeMock.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: sesionPagada({ metadata: { scope: 'llamada', nombre: 'Ana', email: 'ana@x.com', fecha: '2026-10-01', slot: '10:00' } }) },
    });
    await service.handleWebhook(Buffer.from('{}'), 'f');
    expect(bookingService.create).not.toHaveBeenCalled();
  });

  it('pago de un libro manda el enlace al email del comprador', async () => {
    const { service, mailService } = montar();
    const { librosPagoServer } = jest.requireActual('./libros-pago.data');
    const libro: any = librosPagoServer[0];
    if (!libro) return; // sin libros en venta no hay nada que probar
    stripeMock.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: sesionPagada({ metadata: { libroId: libro.id }, customer_details: { email: 'lee@x.com' } }) },
    });
    await service.handleWebhook(Buffer.from('{}'), 'f');
    expect(mailService.enviarLibroComprado).toHaveBeenCalledWith('lee@x.com', libro.titulo, libro.pdfLink);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('conceder: flag + correos solo la primera vez', () => {
  it('primera vez: marca y manda los dos correos (a ella y a la creadora)', async () => {
    const { service, userService, mailService } = montar({ email: 'ana@x.com', name: 'Ana' });
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ client_reference_id: `ayurveda__${USER}` }));
    await expect(service.verifyDisciplinaLink('cs_1', USER)).resolves.toEqual({ ok: true, scope: 'ayurveda', nombre: 'Ayurveda' });
    expect(userService.marcarSuscritoAyurveda).toHaveBeenCalledWith(USER);
    expect(mailService.enviarDisciplinaDesbloqueada).toHaveBeenCalledWith('ana@x.com', 'Ana', 'Ayurveda', 'ayurveda');
    expect(mailService.enviarAvisoCompra).toHaveBeenCalledTimes(1);
  });

  it('si ya la tenía (recarga de /home o webhook después del verify), no repite correos', async () => {
    const { service, mailService } = montar({ email: 'ana@x.com', ayurveda_suscrito: true });
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ client_reference_id: `ayurveda__${USER}` }));
    await service.verifyDisciplinaLink('cs_1', USER);
    expect(mailService.enviarDisciplinaDesbloqueada).not.toHaveBeenCalled();
    expect(mailService.enviarAvisoCompra).not.toHaveBeenCalled();
  });

  it('si el correo falla, el acceso sigue concedido y no lanza', async () => {
    const { service, userService, mailService } = montar();
    mailService.enviarDisciplinaDesbloqueada.mockRejectedValue(new Error('smtp caído'));
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ client_reference_id: `nutricion__${USER}` }));
    await expect(service.verifyDisciplinaLink('cs_1', USER)).resolves.toMatchObject({ ok: true });
    expect(userService.marcarSuscritoNutricion).toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('verifyDisciplinaLink (vuelta del Payment Link a /home)', () => {
  it('sin session_id, 400', async () => {
    const { service } = montar();
    await expect(service.verifyDisciplinaLink('', USER)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('sesión que Stripe no conoce', async () => {
    const { service } = montar();
    stripeMock.checkout.sessions.retrieve.mockRejectedValue(new Error('No such session'));
    await expect(service.verifyDisciplinaLink('cs_x', USER)).resolves.toEqual({ ok: false, reason: 'invalid-session' });
  });

  it('sin pagar', async () => {
    const { service } = montar();
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ payment_status: 'unpaid', client_reference_id: `tcm__${USER}` }));
    await expect(service.verifyDisciplinaLink('cs_1', USER)).resolves.toEqual({ ok: false, reason: 'unpaid' });
  });

  it('sin referencia', async () => {
    const { service } = montar();
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada());
    await expect(service.verifyDisciplinaLink('cs_1', USER)).resolves.toEqual({ ok: false, reason: 'no-reference' });
  });

  it('NO desbloquea a otra cuenta con una sesión ajena', async () => {
    const { service, userService } = montar();
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ client_reference_id: `tcm__${OTRA}` }));
    await expect(service.verifyDisciplinaLink('cs_1', USER)).resolves.toEqual({ ok: false, reason: 'wrong-user' });
    expect(userService.marcarSuscritoTcm).not.toHaveBeenCalled();
  });

  it('orden solo aconsejado: se puede pagar Cultura sin tener ninguna otra', async () => {
    const { service, userService } = montar({ email: 'a@x.com' }); // ningún *_suscrito
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ client_reference_id: `cultura__${USER}` }));
    await expect(service.verifyDisciplinaLink('cs_1', USER)).resolves.toMatchObject({ ok: true, scope: 'cultura' });
    expect(userService.marcarSuscritoCultura).toHaveBeenCalledWith(USER);
  });

  it.each([
    ['metodo', 'marcarSuscritoMetodo'], ['psicologia', 'marcarSuscritoPsicologia'],
    ['ayurveda', 'marcarSuscritoAyurveda'], ['tcm', 'marcarSuscritoTcm'],
    ['fisiologia', 'marcarSuscritoFisiologia'], ['nutricion', 'marcarSuscritoNutricion'],
    ['cabala', 'marcarSuscritoCabala'], ['cultura', 'marcarSuscritoCultura'],
  ])('scope %s marca con %s', async (scope, metodo) => {
    const { service, userService } = montar();
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ client_reference_id: `${scope}__${USER}` }));
    await service.verifyDisciplinaLink('cs_1', USER);
    expect(userService[metodo]).toHaveBeenCalledWith(USER);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('verify de checkout propio (ej. Astrología)', () => {
  it('pagada, scope y usuario correctos → concede', async () => {
    const { service, userService } = montar();
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ metadata: { scope: 'metodo', userId: USER } }));
    await expect(service.verifyMetodoCheckout('cs_1', USER)).resolves.toEqual({ ok: true });
    expect(userService.marcarSuscritoMetodo).toHaveBeenCalledWith(USER);
  });

  it('sesión de otra disciplina no vale para Astrología', async () => {
    const { service } = montar();
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ metadata: { scope: 'tcm', userId: USER } }));
    await expect(service.verifyMetodoCheckout('cs_1', USER)).resolves.toEqual({ ok: false, reason: 'wrong-scope' });
  });

  it('sesión de otra persona', async () => {
    const { service } = montar();
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ metadata: { scope: 'metodo', userId: OTRA } }));
    await expect(service.verifyMetodoCheckout('cs_1', USER)).resolves.toEqual({ ok: false, reason: 'wrong-user' });
  });

  it('el checkout cobra 30 € y apunta el userId del token', async () => {
    const { service } = montar();
    await service.createMetodoCheckout(USER);
    const args = stripeMock.checkout.sessions.create.mock.calls[0][0];
    expect(args.line_items[0].price_data.unit_amount).toBe(3000);
    expect(args.metadata).toEqual({ userId: USER, scope: 'metodo' });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('Regalo de cumpleaños (15 €)', () => {
  it('token bueno: dice qué disciplinas le faltan y el precio', async () => {
    const { service } = montar({ metodo_suscrito: true, tcm_suscrito: true });
    const t = crearTokenCumple(USER, 2026);
    const r: any = await service.estadoCumple(t, USER);
    expect(r.valido).toBe(true);
    expect(r.precio).toBe(15);
    expect(r.disciplinas).not.toContain('metodo');
    expect(r.disciplinas).not.toContain('tcm');
    expect(r.disciplinas).toHaveLength(6);
  });

  it('token de otra cuenta', async () => {
    const { service } = montar();
    await expect(service.estadoCumple(crearTokenCumple(OTRA, 2026), USER)).resolves.toEqual({ valido: false, motivo: 'otra-cuenta' });
  });

  it('token manipulado', async () => {
    const { service } = montar();
    const t = crearTokenCumple(USER, 2026);
    await expect(service.estadoCumple(t.slice(0, -2) + 'xx', USER)).resolves.toEqual({ valido: false, motivo: 'invalido' });
  });

  it('caducado a los 7 días', async () => {
    const { service } = montar();
    const t = crearTokenCumple(USER, 2026);
    const ahora = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(ahora + 8 * 24 * 3600 * 1000);
    await expect(service.estadoCumple(t, USER)).resolves.toEqual({ valido: false, motivo: 'caducado' });
    (Date.now as jest.Mock).mockRestore();
  });

  it('ya usado este año', async () => {
    const { service, userService } = montar();
    userService.getCumpleDescuentoUsado.mockResolvedValue(2026);
    await expect(service.estadoCumple(crearTokenCumple(USER, 2026), USER)).resolves.toEqual({ valido: false, motivo: 'usado' });
  });

  it('checkout de 15 € con el mismo client_reference_id que el Payment Link', async () => {
    const { service } = montar({});
    await service.createCumpleCheckout(crearTokenCumple(USER, 2026), 'fisiologia', USER);
    const args = stripeMock.checkout.sessions.create.mock.calls[0][0];
    expect(args.line_items[0].price_data.unit_amount).toBe(1500);
    expect(args.client_reference_id).toBe(`fisiologia__${USER}`);
    expect(args.metadata.cumpleAnio).toBe('2026');
  });

  it('no deja comprar con el regalo una disciplina que ya tiene', async () => {
    const { service } = montar({ fisiologia_suscrito: true });
    await expect(service.createCumpleCheckout(crearTokenCumple(USER, 2026), 'fisiologia', USER)).rejects.toBeInstanceOf(ConflictException);
  });

  it('token inválido → 403', async () => {
    const { service } = montar();
    await expect(service.createCumpleCheckout('basura', 'tcm', USER)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('al pagar, el regalo queda gastado para ese año', async () => {
    const { service, userService } = montar();
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(
      sesionPagada({ client_reference_id: `tcm__${USER}`, metadata: { userId: USER, scope: 'tcm', cumpleAnio: '2026' } }),
    );
    await service.verifyDisciplinaLink('cs_1', USER);
    expect(userService.marcarCumpleDescuentoUsado).toHaveBeenCalledWith(USER, 2026);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('Llamada de acompañamiento', () => {
  const base = { nombre: 'Ana', email: 'ana@x.com', fecha: '2026-10-01', slot: '10:00' };

  it('faltan datos → 400', async () => {
    const { service } = montar();
    await expect(service.createLlamadaCheckout({ nombre: 'Ana' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([[undefined, 1500], ['estandar', 1500], ['compania', 1500]])(
    'tipo %s cobra %i céntimos (lo fija el servidor)',
    async (tipo, cent) => {
      const { service } = montar();
      await service.createLlamadaCheckout({ ...base, tipo, precio: 1 } as any);
      expect(stripeMock.checkout.sessions.create.mock.calls[0][0].line_items[0].price_data.unit_amount).toBe(cent);
    },
  );

  it('tipo inventado → 400', async () => {
    const { service } = montar();
    await expect(service.createLlamadaCheckout({ ...base, tipo: 'gratis' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('hueco ya cogido → 409 y no se abre el pago', async () => {
    const { service, bookingService } = montar();
    bookingService.getTaken.mockResolvedValue([{ fecha: base.fecha, slot: base.slot }]);
    await expect(service.createLlamadaCheckout(base)).rejects.toBeInstanceOf(ConflictException);
    expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it('returnPath externo se cambia por /', async () => {
    const { service } = montar();
    await service.createLlamadaCheckout({ ...base, returnPath: 'https://malo.com/x' });
    expect(stripeMock.checkout.sessions.create.mock.calls[0][0].success_url).toBe('http://localhost:5173/?llamada_pagada={CHECKOUT_SESSION_ID}');
  });

  it('returnPath interno con query añade con &', async () => {
    const { service } = montar();
    await service.createLlamadaCheckout({ ...base, returnPath: '/metodo/tcm?a=1' });
    expect(stripeMock.checkout.sessions.create.mock.calls[0][0].success_url).toContain('/metodo/tcm?a=1&llamada_pagada=');
  });

  it('verify: crea la reserva una vez; si ya es suya, ok sin duplicar', async () => {
    const { service, bookingService } = montar();
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ metadata: { scope: 'llamada', ...base } }));
    await expect(service.verifyLlamadaCheckout('cs_1')).resolves.toMatchObject({ ok: true });
    expect(bookingService.create).toHaveBeenCalledTimes(1);

    bookingService.yaReservado.mockResolvedValue('mine');
    await expect(service.verifyLlamadaCheckout('cs_1')).resolves.toMatchObject({ ok: true });
    expect(bookingService.create).toHaveBeenCalledTimes(1);
  });

  it('verify: si otra persona cogió el hueco mientras pagaba → slot-taken', async () => {
    const { service, bookingService } = montar();
    bookingService.yaReservado.mockResolvedValue('other');
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ metadata: { scope: 'llamada', ...base } }));
    await expect(service.verifyLlamadaCheckout('cs_1')).resolves.toMatchObject({ ok: false, reason: 'slot-taken' });
    expect(bookingService.create).not.toHaveBeenCalled();
  });

  it('verify: una sesión de disciplina no crea reserva', async () => {
    const { service, bookingService } = montar();
    stripeMock.checkout.sessions.retrieve.mockResolvedValue(sesionPagada({ metadata: { scope: 'tcm', userId: USER } }));
    await expect(service.verifyLlamadaCheckout('cs_1')).resolves.toEqual({ ok: false, reason: 'wrong-scope' });
    expect(bookingService.create).not.toHaveBeenCalled();
  });
});
