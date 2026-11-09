// ─────────────────────────────────────────────────────────────────────────────
// TRAMO 2 · CREACIÓN DE CUENTA
//
// El flujo que fijan estos tests:
//   1. La persona rellena el registro → POST /user/signIn → fila en `user` con
//      la contraseña hasheada y email_confirmado = false. No hay sesión todavía.
//   2. Le llega el correo de bienvenida con /logIn?confirmar=<token>.
//   3. Si intenta entrar sin confirmar → 403 EMAIL_SIN_CONFIRMAR.
//   4. Pulsa el enlace → POST /user/confirmar → email_confirmado = true y le
//      llega el correo de «cuenta activada» (siguiente paso: comprar disciplina).
//   5. Ya entra con nombre o email + contraseña.
// La BD es una tabla en memoria; el correo va simulado.
// ─────────────────────────────────────────────────────────────────────────────

import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { MailService } from '../mail/mail.service';
import { crearTokenConfirmacion } from '../auth/confirmar-cuenta.util';
import { bdFalsa } from '../test-utils/bd-falsa';

function montar(filas?: Record<string, any>[]) {
  const bd = bdFalsa(filas);
  const mail: any = {
    enviarBienvenidaCuenta: jest.fn().mockResolvedValue(undefined),
    enviarAvisoRegistro: jest.fn().mockResolvedValue(undefined),
    enviarCuentaActivada: jest.fn().mockResolvedValue(undefined),
    enviarInvitacionAsesoria: jest.fn().mockResolvedValue(true),
  };
  const auth: any = { generateToken: jest.fn().mockReturnValue('jwt-de-test') };
  const service = new UserService(auth, bd.databaseService, mail);
  return { service, mail, auth, filas: bd.filas };
}

const datos = {
  name: 'ana',
  email: 'ana@x.com',
  password: 'secreta1',
  trato: 'ella' as const,
  telefono: '+34 600 11 22 33',
  fecha_nacimiento: '1990-05-17',
};

/** El token que viaja en el correo de bienvenida. */
const tokenDelCorreo = (mail: any): string => mail.enviarBienvenidaCuenta.mock.calls[0][2].tokenConfirmacion;

beforeAll(() => { process.env.JWT_SECRET = 'secreto-de-test'; });
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// ═════════════════════════════════════════════════════════════════════════════
describe('1 · Registro: lo que llega a la BD', () => {
  it('guarda la fila con todos los datos, contraseña hasheada y sin confirmar', async () => {
    const { service, filas } = montar();
    const r = await service.createUser(datos);

    expect(r).toEqual({ pendienteConfirmar: true, email: 'ana@x.com' });
    expect(filas).toHaveLength(1);
    const f = filas[0];
    expect(f).toMatchObject({
      name: 'ana',
      email: 'ana@x.com',
      trato: 'ella',
      telefono: '+34600112233',
      fecha_nacimiento: '1990-05-17',
      email_confirmado: false,
      comunidad_popup_visto: false,
    });
    expect(typeof f.id).toBe('string');
    expect(f.password).not.toBe('secreta1');
    expect(await bcrypt.compare('secreta1', f.password)).toBe(true);
  });

  it('NO devuelve token de sesión: sin confirmar no se entra', async () => {
    const { service } = montar();
    const r: any = await service.createUser(datos);
    expect(r.token).toBeUndefined();
  });

  it('datos opcionales raros se guardan como null en vez de romper el registro', async () => {
    const { service, filas } = montar();
    await service.createUser({ ...datos, trato: 'x' as any, telefono: 'llámame', fecha_nacimiento: '2999-01-01' });
    expect(filas[0]).toMatchObject({ trato: null, telefono: null, fecha_nacimiento: null });
  });

  it('fecha imposible (31 de febrero) → null', async () => {
    const { service, filas } = montar();
    await service.createUser({ ...datos, fecha_nacimiento: '1990-02-31' });
    expect(filas[0].fecha_nacimiento).toBeNull();
  });

  it('sin opcionales también se registra', async () => {
    const { service, filas } = montar();
    await service.createUser({ name: 'bea', email: 'bea@x.com', password: 'secreta1' });
    expect(filas[0]).toMatchObject({ name: 'bea', trato: null, telefono: null, fecha_nacimiento: null });
  });

  it('el email se guarda en minúsculas y sin espacios', async () => {
    const { service, filas } = montar();
    const r = await service.createUser({ ...datos, email: '  Ana@X.com ' });
    expect(filas[0].email).toBe('ana@x.com');
    expect(r.email).toBe('ana@x.com');
  });

  it('el mismo email con otras mayúsculas cuenta como repetido', async () => {
    const { service, filas } = montar([{ id: '1', name: 'otra', email: 'Ana@X.com' }]);
    await expect(service.createUser({ ...datos, email: 'ana@x.COM' })).rejects.toBeInstanceOf(ConflictException);
    expect(filas).toHaveLength(1);
  });

  it('contraseña de menos de 6 caracteres → 400 y no crea nada', async () => {
    const { service, filas } = montar();
    await expect(service.createUser({ ...datos, password: '12345' })).rejects.toBeInstanceOf(BadRequestException);
    expect(filas).toHaveLength(0);
  });

  it('nombre repetido → se crea igual (los nombres se pueden repetir)', async () => {
    const { service, filas } = montar([{ id: '1', name: 'ana', email: 'otra@x.com' }]);
    await expect(service.createUser(datos)).resolves.toEqual({ pendienteConfirmar: true, email: 'ana@x.com' });
    expect(filas).toHaveLength(2);
  });

  it('email repetido → 409 y no crea nada', async () => {
    const { service, filas } = montar([{ id: '1', name: 'otra', email: 'ana@x.com' }]);
    await expect(service.createUser(datos)).rejects.toThrow(new ConflictException('El email ya está registrado'));
    expect(filas).toHaveLength(1);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('2 · Correo de bienvenida (activar la cuenta)', () => {
  it('sale a su email con el token de confirmación, y el aviso de cuenta nueva a la creadora', async () => {
    const { service, mail, filas } = montar();
    await service.createUser(datos);
    expect(mail.enviarBienvenidaCuenta).toHaveBeenCalledWith(
      'ana@x.com', 'ana', expect.objectContaining({ conGoogle: false, tokenConfirmacion: expect.any(String) }),
    );
    expect(mail.enviarAvisoRegistro).toHaveBeenCalledWith('ana@x.com', 'ana', { conGoogle: false });
    // El token es de ESTA cuenta.
    const { leerTokenConfirmacion } = jest.requireActual('../auth/confirmar-cuenta.util');
    expect(leerTokenConfirmacion(tokenDelCorreo(mail))).toBe(filas[0].id);
  });

  it('si el correo falla, la cuenta queda creada igual', async () => {
    const { service, mail, filas } = montar();
    mail.enviarBienvenidaCuenta.mockRejectedValue(new Error('smtp caído'));
    await expect(service.createUser(datos)).resolves.toMatchObject({ pendienteConfirmar: true });
    expect(filas).toHaveLength(1);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('3 · Entrar sin confirmar', () => {
  it('con la contraseña buena → 403 EMAIL_SIN_CONFIRMAR', async () => {
    const { service } = montar();
    await service.createUser(datos);
    const err: any = await service.logIn({ name: 'ana', password: 'secreta1' }).catch((e) => e);
    expect(err).toBeInstanceOf(ForbiddenException);
    expect(err.getResponse().code).toBe('EMAIL_SIN_CONFIRMAR');
  });

  it('puede pedir que se le reenvíe el correo', async () => {
    const { service, mail } = montar();
    await service.createUser(datos);
    mail.enviarBienvenidaCuenta.mockClear();
    await service.reenviarConfirmacion('ana@x.com');
    expect(mail.enviarBienvenidaCuenta).toHaveBeenCalledWith('ana@x.com', 'ana', { tokenConfirmacion: expect.any(String) });
  });

  it('reenviar a una cuenta ya confirmada o inexistente no manda nada (y no lo dice)', async () => {
    const { service, mail } = montar([{ id: '1', name: 'bea', email: 'bea@x.com', email_confirmado: true }]);
    await expect(service.reenviarConfirmacion('bea')).resolves.toBeUndefined();
    await expect(service.reenviarConfirmacion('nadie@x.com')).resolves.toBeUndefined();
    expect(mail.enviarBienvenidaCuenta).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('3b · Cuenta de asesoría creada por la admin, sin activar', () => {
  const alta = { name: 'eva', email: 'eva@x.com', telefono: '+34 600 11 22 33' };

  it('dos asesoradas con el mismo nombre y distinto email → se crean; con el mismo email, no', async () => {
    const { service, filas } = montar();
    await service.crearCuentaAsesorada(alta);
    await expect(service.crearCuentaAsesorada({ ...alta, email: 'otra@x.com' })).resolves.toMatchObject({ name: 'eva' });
    expect(filas).toHaveLength(2);
    await expect(service.crearCuentaAsesorada({ ...alta, name: 'otra eva' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('la admin puede sacar el enlace de activación (y solo mientras esté sin activar)', async () => {
    const { service, filas } = montar();
    const { id } = await service.crearCuentaAsesorada(alta);
    const { enlace } = await service.enlaceActivacion(id);
    expect(enlace).toContain('/recuperar?token=');
    filas[0].email_confirmado = true;
    await expect(service.enlaceActivacion(id)).rejects.toBeInstanceOf(ConflictException);
    await expect(service.enlaceActivacion('no-existe')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('la persona asesorada cambia su nombre, email, teléfono y contraseña, pero no los datos de su carta', async () => {
    const { service } = montar();
    const { id } = await service.crearCuentaAsesorada(alta);
    await expect(service.updateUser(id, { telefono: '+34 611 11 11 11' })).resolves.toBeDefined();
    await expect(service.updateUser(id, { name: 'otra' })).resolves.toBeDefined();
    await expect(service.updateUser(id, { email: 'nuevo@x.com' })).resolves.toBeDefined();
    await expect(service.updateUser(id, { password: 'nueva-clave-1' })).resolves.toBeDefined();
    // La fecha de nacimiento es de su carta astral: la fija María.
    await expect(service.updateUser(id, { fecha_nacimiento: '1990-05-17' })).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.updateUser(id, { fecha_nacimiento: '1990-05-17' }, true)).resolves.toBeDefined();
  });

  it('sin teléfono no se crea', async () => {
    const { service, filas } = montar();
    const err: any = await service.crearCuentaAsesorada({ name: 'eva', email: 'eva@x.com' }).catch((e) => e);
    expect(err).toBeInstanceOf(BadRequestException);
    expect(filas).toHaveLength(0);
  });

  it('el teléfono tiene que llevar el prefijo del país', async () => {
    const { service, filas } = montar();
    const err: any = await service.crearCuentaAsesorada({ ...alta, telefono: '600 11 22 33' }).catch((e) => e);
    expect(err).toBeInstanceOf(BadRequestException);
    expect(filas).toHaveLength(0);
  });

  it('al entrar antes de activar se le dice que la active (no «contraseña errónea»)', async () => {
    const { service } = montar();
    await service.crearCuentaAsesorada(alta);
    const err: any = await service.logIn({ name: 'eva', password: 'lo-que-sea' }).catch((e) => e);
    expect(err).toBeInstanceOf(ForbiddenException);
    expect(err.getResponse().code).toBe('EMAIL_SIN_CONFIRMAR');
  });

  it('si el correo de invitación NO sale, la respuesta lo dice (correoEnviado false) y la cuenta se crea igual', async () => {
    const { service, mail } = montar();
    mail.enviarInvitacionAsesoria.mockResolvedValueOnce(false);
    const r: any = await service.crearCuentaAsesorada(alta);
    expect(r.correoEnviado).toBe(false);
    expect(r.email).toBe('eva@x.com');
  });

  it('«envíamelo otra vez» manda la invitación para elegir contraseña, no la bienvenida del registro', async () => {
    const { service, mail } = montar();
    await service.crearCuentaAsesorada(alta);
    mail.enviarInvitacionAsesoria.mockClear();
    await service.reenviarConfirmacion('eva@x.com');
    expect(mail.enviarInvitacionAsesoria).toHaveBeenCalledTimes(1);
    expect(mail.enviarBienvenidaCuenta).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('4 · Activar con el enlace del correo', () => {
  it('marca email_confirmado y manda el correo de «cuenta activada»', async () => {
    const { service, mail, filas } = montar();
    await service.createUser(datos);
    await expect(service.confirmarCuenta(tokenDelCorreo(mail))).resolves.toEqual({ ok: true, email: 'ana@x.com' });
    expect(filas[0].email_confirmado).toBe(true);
    expect(mail.enviarCuentaActivada).toHaveBeenCalledWith('ana@x.com', 'ana');
  });

  it('pulsar el enlace dos veces no repite el correo', async () => {
    const { service, mail } = montar();
    await service.createUser(datos);
    const t = tokenDelCorreo(mail);
    await service.confirmarCuenta(t);
    await expect(service.confirmarCuenta(t)).resolves.toEqual({ ok: true, email: 'ana@x.com' });
    expect(mail.enviarCuentaActivada).toHaveBeenCalledTimes(1);
  });

  it('token manipulado → 400 y la cuenta sigue sin confirmar', async () => {
    const { service, mail, filas } = montar();
    await service.createUser(datos);
    await expect(service.confirmarCuenta(tokenDelCorreo(mail) + 'x')).rejects.toBeInstanceOf(BadRequestException);
    expect(filas[0].email_confirmado).toBe(false);
  });

  it('token caducado (más de 30 días) → 400', async () => {
    const { service, mail } = montar();
    await service.createUser(datos);
    const t = tokenDelCorreo(mail);
    const ahora = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(ahora + 31 * 24 * 3600 * 1000);
    await expect(service.confirmarCuenta(t)).rejects.toBeInstanceOf(BadRequestException);
    (Date.now as jest.Mock).mockRestore();
  });

  it('cuenta borrada entre medias → 404', async () => {
    const { service } = montar();
    await expect(service.confirmarCuenta(crearTokenConfirmacion('no-existe'))).rejects.toBeInstanceOf(NotFoundException);
  });

  it('sin la columna en la BD (su SQL sin correr) el enlace responde ok, no un error', async () => {
    // PostgREST devuelve 42703 cuando `email_confirmado` no existe todavía. La
    // puerta de confirmación no está activa, así que quien llega del correo no
    // debe ver un error sin haber tocado nada. (La bd falsa nunca da error, por
    // eso este test monta su propio cliente.)
    const err42703 = { code: '42703', message: 'column user.email_confirmado does not exist' };
    const cadenaUpdate: any = { eq: () => cadenaUpdate, select: () => ({ data: null, error: err42703 }) };
    const cadenaSelect: any = { eq: () => cadenaSelect, limit: () => ({ data: [{ email: 'ana@x.com' }], error: null }) };
    const cliente = { from: () => ({ update: () => cadenaUpdate, select: () => cadenaSelect }) };
    const mail: any = { enviarCuentaActivada: jest.fn() };
    const service = new UserService({} as any, { getClient: () => cliente } as any, mail);

    await expect(service.confirmarCuenta(crearTokenConfirmacion('u1'))).resolves.toEqual({ ok: true, email: 'ana@x.com' });
    expect(mail.enviarCuentaActivada).not.toHaveBeenCalled();
  });

  it('si el correo de «activada» falla, la cuenta queda confirmada igual', async () => {
    const { service, mail, filas } = montar();
    mail.enviarCuentaActivada.mockRejectedValue(new Error('smtp caído'));
    await service.createUser(datos);
    await expect(service.confirmarCuenta(tokenDelCorreo(mail))).resolves.toMatchObject({ ok: true });
    expect(filas[0].email_confirmado).toBe(true);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('5 · Entrar ya activada', () => {
  async function activada() {
    const m = montar();
    await m.service.createUser(datos);
    await m.service.confirmarCuenta(tokenDelCorreo(m.mail));
    return m;
  }

  it.each([['por nombre', 'ana'], ['por email', 'ana@x.com']])('entra %s y recibe su sesión', async (_, nombre) => {
    const { service, auth, filas } = await activada();
    const r: any = await service.logIn({ name: nombre, password: 'secreta1' });
    expect(r.token).toBe('jwt-de-test');
    expect(auth.generateToken).toHaveBeenCalledWith(filas[0].id, 'ana@x.com');
    expect(r.user.password).toBeUndefined(); // nunca devuelve el hash
  });

  it('contraseña mala → 409', async () => {
    const { service } = await activada();
    await expect(service.logIn({ name: 'ana', password: 'otra' })).rejects.toBeInstanceOf(ConflictException);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// Dos cuentas que se confunden («María» / «maría»): el caso que dejó a la admin
// fuera tras cambiar su contraseña. El login tiene que probar la contraseña
// contra TODAS las cuentas que puedan ser esa persona, y el registro y Mi
// cuenta tienen que impedir que vuelvan a nacer gemelas.
describe('6 · Cuentas gemelas (mismo nombre con otras mayúsculas)', () => {
  const gemelas = async () => [
    { id: 'A', name: 'María', email: 'maria@x.com', password: await bcrypt.hash('claveDeA', 4) },
    { id: 'B', name: 'maría', email: 'dark@x.com', password: await bcrypt.hash('claveDeB', 4) },
  ];

  it('entra en la cuenta cuya contraseña casa, teclee el nombre como lo teclee', async () => {
    const { service, auth } = montar(await gemelas());
    const r: any = await service.logIn({ name: 'María', password: 'claveDeB' });
    expect(r.token).toBe('jwt-de-test');
    expect(auth.generateToken).toHaveBeenCalledWith('B', 'dark@x.com');
  });

  it('por email va SIEMPRE a esa cuenta, aunque el nombre de la otra se parezca', async () => {
    const { service, auth } = montar(await gemelas());
    const r: any = await service.logIn({ name: 'maria@x.com', password: 'claveDeA' });
    expect(r.token).toBe('jwt-de-test');
    expect(auth.generateToken).toHaveBeenCalledWith('A', 'maria@x.com');
  });

  it('si ninguna casa → contraseña errónea', async () => {
    const { service } = montar(await gemelas());
    await expect(service.logIn({ name: 'maría', password: 'ninguna' })).rejects.toThrow('La contraseña es errónea');
  });

  it('registrarse con el mismo nombre en otras mayúsculas → se crea (los nombres se repiten)', async () => {
    const { service } = montar(await gemelas());
    await expect(service.createUser({ name: 'MARÍA', email: 'nueva@x.com', password: 'secreta1' }))
      .resolves.toEqual({ pendienteConfirmar: true, email: 'nueva@x.com' });
  });

  it('Mi cuenta deja renombrarse al nombre de otra persona, pero no a su email', async () => {
    const { service } = montar(await gemelas());
    await expect(service.updateUser('B', { name: 'MARÍA' } as any)).resolves.toBeDefined();
    await expect(service.updateUser('B', { email: 'maria@x.com' } as any))
      .rejects.toThrow('El email ya está registrado');
  });

  it('cambiar la contraseña en Mi cuenta permite entrar con la nueva', async () => {
    const { service, filas } = montar(await gemelas());
    await service.updateUser('B', { password: 'nuevaClave' } as any);
    expect(await bcrypt.compare('nuevaClave', filas[1].password)).toBe(true);
    const r: any = await service.logIn({ name: 'maría', password: 'nuevaClave' });
    expect(r.token).toBe('jwt-de-test');
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('Textos de los dos correos', () => {
  const frontend = 'https://web.test';
  let enviar: jest.Mock;
  let mail: MailService;
  beforeEach(() => {
    process.env.FRONTEND_URL = frontend;
    mail = new MailService();
    enviar = jest.fn().mockResolvedValue(undefined);
    (mail as any).enviar = enviar;
  });

  it('bienvenida: asunto, saludo con su nombre y botón que confirma', async () => {
    await mail.enviarBienvenidaCuenta('ana@x.com', 'Ana', { tokenConfirmacion: 'TOK' });
    const [para, asunto, html] = enviar.mock.calls[0];
    expect(para).toBe('ana@x.com');
    expect(asunto).toBe('Confirma tu cuenta');
    expect(html).toContain('Muy buenas, <strong>Ana</strong>.');
    expect(html).toContain(`${frontend}/logIn?confirmar=TOK`);
    expect(html).toContain('Confirmar e iniciar sesión');
  });

  it('bienvenida: un nombre con HTML se escapa', async () => {
    await mail.enviarBienvenidaCuenta('a@x.com', '<script>', { tokenConfirmacion: 'T' });
    expect(enviar.mock.calls[0][2]).not.toContain('<script>');
  });

  it('cuenta activada: la bienvenida oficial, con su nombre y botón para iniciar sesión', async () => {
    await mail.enviarCuentaActivada('ana@x.com', 'Ana');
    const [para, asunto, html] = enviar.mock.calls[0];
    expect(para).toBe('ana@x.com');
    expect(asunto).toBe('Te doy la bienvenida');
    expect(html).toContain('Hola, <strong>Ana</strong>.');
    expect(html).toContain('Te doy la bienvenida oficialmente a este nuevo camino. Vamos a empezar. Ya puedes entrar en tu cuenta.');
    expect(html).toContain('Iniciar sesión');
    expect(html).toContain(`href="${frontend}/logIn"`);
  });
});
