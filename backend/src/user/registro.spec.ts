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

  it('nombre repetido → 409 y no crea nada', async () => {
    const { service, filas } = montar([{ id: '1', name: 'ana', email: 'otra@x.com' }]);
    await expect(service.createUser(datos)).rejects.toThrow(new ConflictException('El nombre ya existe. Elige otro'));
    expect(filas).toHaveLength(1);
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
    expect(asunto).toBe('Confirma tu cuenta — Life as a Privilege');
    expect(html).toContain('Muy buenas, <strong>Ana</strong>.');
    expect(html).toContain(`${frontend}/logIn?confirmar=TOK`);
    expect(html).toContain('Confirmar e iniciar sesión');
  });

  it('bienvenida: un nombre con HTML se escapa', async () => {
    await mail.enviarBienvenidaCuenta('a@x.com', '<script>', { tokenConfirmacion: 'T' });
    expect(enviar.mock.calls[0][2]).not.toContain('<script>');
  });

  it('cuenta activada: asunto, siguiente paso = elegir disciplina, botón a entrar', async () => {
    await mail.enviarCuentaActivada('ana@x.com', 'Ana');
    const [para, asunto, html] = enviar.mock.calls[0];
    expect(para).toBe('ana@x.com');
    expect(asunto).toBe('Tu cuenta ya está activa — Life as a Privilege');
    expect(html).toContain('Muy buenas, <strong>Ana</strong>.');
    expect(html).toContain('El siguiente paso es elegir tu primera disciplina');
    expect(html).toContain(`href="${frontend}/logIn"`);
  });
});
