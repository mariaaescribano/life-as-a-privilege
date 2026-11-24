import { BadRequestException } from '@nestjs/common';
import { LecturaService } from './lectura.service';

// La carta de la lectura: lo obligatorio del formulario y que confirmar el pago sea idempotente
// (el verify y el webhook de Stripe llegan los dos y solo debe salir UN pedido, UNA cuenta y UN correo).
const OK = { servicio: 'pdf_completo', nombre: 'Ana', email: 'Ana@X.com', fecha: '1990-05-17', hora: '07:30', lugar: 'Madrid', acepta: true, consentimiento: true };

function montar(opciones: { previo?: any; insertError?: any } = {}) {
  const tabla: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: opciones.previo ?? null }),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue(opciones.insertError ? { data: null, error: opciones.insertError } : { data: { id: 'p1' }, error: null }),
    update: jest.fn().mockReturnThis(),
  };
  const db: any = { getClient: () => ({ from: jest.fn(() => tabla) }) };
  const mail: any = { enviarLecturaRecibida: jest.fn().mockResolvedValue(true) };
  const users: any = { crearCuentaLectura: jest.fn().mockResolvedValue({ id: 'u1', existente: false }), reenviarInvitacion: jest.fn(), enviarAccesoLectura: jest.fn() };
  return { service: new LecturaService(db, mail, users), tabla, mail, users };
}

const sesion = (extra: Record<string, any> = {}): any => ({
  id: 'cs_1',
  metadata: { scope: 'lectura', servicio: 'pdf_completo', nombre: 'Ana', email: 'ana@x.com', fecha: '1990-05-17', hora: '07:30', lugar: 'Madrid', ...extra },
});

describe('LecturaService.validar', () => {
  const { service } = montar();
  it('acepta un pedido completo y normaliza el email', () => {
    expect(service.validar(OK)).toMatchObject({ email: 'ana@x.com', fecha: '1990-05-17', hora: '07:30', lugar: 'Madrid' });
  });
  it.each(['fecha', 'hora', 'lugar', 'nombre', 'email'])('exige %s (los datos de nacimiento son obligatorios)', (campo) => {
    expect(() => service.validar({ ...OK, [campo]: '' })).toThrow(BadRequestException);
  });
  it('exige aceptar el aviso de la hora', () => {
    expect(() => service.validar({ ...OK, acepta: false })).toThrow(BadRequestException);
    expect(() => service.validar({ ...OK, consentimiento: false })).toThrow(BadRequestException);
  });
  it('rechaza servicio desconocido, hora mal escrita y fecha futura', () => {
    expect(() => service.validar({ ...OK, servicio: 'gratis' })).toThrow(BadRequestException);
    expect(() => service.validar({ ...OK, hora: '25:99' })).toThrow(BadRequestException);
    expect(() => service.validar({ ...OK, fecha: '2999-01-01' })).toThrow(BadRequestException);
  });
});

describe('LecturaService.confirmarPago', () => {
  it('«plataforma»: crea el pedido, la cuenta SIN acceso y el correo (avisando de que pronto podrá entrar), una vez', async () => {
    const { service, users, mail, tabla } = montar();
    const r = await service.confirmarPago(sesion({ servicio: 'plataforma' }));
    expect(r).toMatchObject({ ok: true, creado: true });
    expect(tabla.insert).toHaveBeenCalledWith(expect.objectContaining({ precio_centimos: 3500, stripe_session_id: 'cs_1' }));
    expect(users.crearCuentaLectura).toHaveBeenCalledTimes(1);
    expect(users.enviarAccesoLectura).not.toHaveBeenCalled(); // sin acceso hasta que la admin lo mande
    expect(mail.enviarLecturaRecibida).toHaveBeenCalledTimes(1);
    expect(mail.enviarLecturaRecibida.mock.calls[0][4]).toBe(true); // con cuenta
  });
  it('carta en PDF: pedido y correo de confirmación, pero SIN cuenta', async () => {
    const { service, users, mail, tabla } = montar();
    const r = await service.confirmarPago(sesion()); // pdf_completo
    expect(r).toMatchObject({ ok: true, creado: true });
    expect(tabla.insert).toHaveBeenCalledWith(expect.objectContaining({ precio_centimos: 3000, stripe_session_id: 'cs_1' }));
    expect(users.crearCuentaLectura).not.toHaveBeenCalled();
    expect(mail.enviarLecturaRecibida).toHaveBeenCalledTimes(1);
    expect(mail.enviarLecturaRecibida.mock.calls[0][4]).toBe(false); // sin cuenta
  });
  it('si el pedido ya existe (verify + webhook), no repite nada', async () => {
    const { service, users, mail } = montar({ previo: { id: 'p1', nombre: 'Ana' } });
    expect(await service.confirmarPago(sesion())).toMatchObject({ ok: true, creado: false });
    expect(users.crearCuentaLectura).not.toHaveBeenCalled();
    expect(mail.enviarLecturaRecibida).not.toHaveBeenCalled();
  });
  it('si el otro camino lo crea justo entre medias (23505), tampoco repite', async () => {
    const { service, mail } = montar({ insertError: { code: '23505', message: 'dup' } });
    expect(await service.confirmarPago(sesion())).toMatchObject({ ok: true, creado: false });
    expect(mail.enviarLecturaRecibida).not.toHaveBeenCalled();
  });
  it('sin datos de nacimiento en la sesión, no crea nada', async () => {
    const { service, tabla } = montar();
    expect(await service.confirmarPago(sesion({ hora: '' }))).toEqual({ ok: false });
    expect(tabla.insert).not.toHaveBeenCalled();
  });
});

describe('LecturaService.crearManual', () => {
  it('crea el pedido sin cobro y la cuenta solo carta, sin mandar ningún correo', async () => {
    const { service, tabla, mail, users } = montar();
    const r = await service.crearManual({ servicio: 'plataforma', nombre: 'Ana', email: 'ana@x.com', fecha: '1990-05-17', hora: '07:30', lugar: 'Madrid, Madrid, España' });
    expect(r).toEqual({ id: 'p1' });
    expect(tabla.insert).toHaveBeenCalledWith(expect.objectContaining({ pagado: false, servicio: 'plataforma', email: 'ana@x.com' }));
    expect(users.crearCuentaLectura).toHaveBeenCalledWith({ name: 'Ana', email: 'ana@x.com' });
    expect(mail.enviarLecturaRecibida).not.toHaveBeenCalled();
  });

  it('exige los datos de nacimiento', async () => {
    const { service } = montar();
    await expect(service.crearManual({ servicio: 'plataforma', nombre: 'Ana', email: 'ana@x.com' })).rejects.toBeInstanceOf(BadRequestException);
  });
});
