// ─────────────────────────────────────────────────────────────────────────────
// RECUPERAR CONTRASEÑA
//
//   1. En /recuperar escribe su email → POST /user/password/forgot.
//      Responde lo mismo exista o no la cuenta (no delata quién está registrado).
//   2. Si existe, le llega un correo con /recuperar?token=<token> (caduca en 1 h).
//   3. Elige la nueva (mín. 6) → POST /user/password/reset.
//      El enlace deja de valer en cuanto se usa.
//   4. Entra con la nueva; la vieja ya no vale.
// ─────────────────────────────────────────────────────────────────────────────

import { BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { MailService } from '../mail/mail.service';
import { bdFalsa } from '../test-utils/bd-falsa';

async function montar(filas: Record<string, any>[]) {
  for (const f of filas) if (f.passwordPlano) { f.password = await bcrypt.hash(f.passwordPlano, 4); delete f.passwordPlano; }
  const bd = bdFalsa(filas);
  const mail: any = { enviarRecuperacionPassword: jest.fn().mockResolvedValue(undefined) };
  const auth: any = { generateToken: jest.fn().mockReturnValue('jwt') };
  return { service: new UserService(auth, bd.databaseService, mail), mail, filas: bd.filas };
}

const ana = () => ({ id: 'u-ana', name: 'ana', email: 'ana@x.com', passwordPlano: 'vieja123', email_confirmado: true });

/** El token del enlace del correo. */
const tokenDelCorreo = (mail: any): string =>
  new URL(mail.enviarRecuperacionPassword.mock.calls.at(-1)[2]).searchParams.get('token')!;

beforeAll(() => {
  process.env.JWT_SECRET = 'secreto-de-test';
  process.env.FRONTEND_URL = 'https://web.test';
});
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

// ═════════════════════════════════════════════════════════════════════════════
describe('1-2 · Pedir el enlace', () => {
  it('manda el correo a su email con el enlace a /recuperar?token=', async () => {
    const { service, mail } = await montar([ana()]);
    await service.solicitarRecuperacion('ana@x.com');
    const [para, nombre, enlace] = mail.enviarRecuperacionPassword.mock.calls[0];
    expect(para).toBe('ana@x.com');
    expect(nombre).toBe('ana');
    expect(enlace).toMatch(/^https:\/\/web\.test\/recuperar\?token=.+/);
  });

  it('da igual cómo escriba el email (mayúsculas, espacios)', async () => {
    const { service, mail } = await montar([ana()]);
    await service.solicitarRecuperacion('  ANA@x.Com ');
    expect(mail.enviarRecuperacionPassword).toHaveBeenCalledTimes(1);
  });

  it('cuenta antigua guardada con mayúsculas también recibe el enlace', async () => {
    const { service, mail } = await montar([{ ...ana(), email: 'Ana@X.com' }]);
    await service.solicitarRecuperacion('ana@x.com');
    expect(mail.enviarRecuperacionPassword).toHaveBeenCalledWith('Ana@X.com', 'ana', expect.any(String));
  });

  it('email que no existe: no manda nada y no da error (no delata quién tiene cuenta)', async () => {
    const { service, mail } = await montar([ana()]);
    await expect(service.solicitarRecuperacion('nadie@x.com')).resolves.toBeUndefined();
    await expect(service.solicitarRecuperacion('')).resolves.toBeUndefined();
    expect(mail.enviarRecuperacionPassword).not.toHaveBeenCalled();
  });

  it('un _ en el email no hace de comodín', async () => {
    const { service, mail } = await montar([{ ...ana(), email: 'a_b@x.com' }]);
    await service.solicitarRecuperacion('axb@x.com');
    expect(mail.enviarRecuperacionPassword).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('3-4 · Elegir la nueva y entrar', () => {
  it('cambia la contraseña: entra con la nueva y la vieja ya no vale', async () => {
    const { service, mail } = await montar([ana()]);
    await service.solicitarRecuperacion('ana@x.com');
    await expect(service.restablecerPassword(tokenDelCorreo(mail), 'nueva456')).resolves.toEqual({ ok: true });

    await expect(service.logIn({ name: 'ana', password: 'nueva456' })).resolves.toMatchObject({ token: 'jwt' });
    await expect(service.logIn({ name: 'ana', password: 'vieja123' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('el enlace solo vale una vez', async () => {
    const { service, mail } = await montar([ana()]);
    await service.solicitarRecuperacion('ana@x.com');
    const t = tokenDelCorreo(mail);
    await service.restablecerPassword(t, 'nueva456');
    await expect(service.restablecerPassword(t, 'otra7890')).rejects.toThrow('El enlace ha caducado o ya se ha usado');
  });

  it('pedir dos enlaces y usar uno invalida el otro', async () => {
    const { service, mail } = await montar([ana()]);
    await service.solicitarRecuperacion('ana@x.com');
    const primero = tokenDelCorreo(mail);
    await service.solicitarRecuperacion('ana@x.com');
    await service.restablecerPassword(tokenDelCorreo(mail), 'nueva456');
    await expect(service.restablecerPassword(primero, 'otra7890')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('caduca a la hora', async () => {
    const { service, mail } = await montar([ana()]);
    await service.solicitarRecuperacion('ana@x.com');
    const t = tokenDelCorreo(mail);
    const ahora = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(ahora + 61 * 60 * 1000);
    await expect(service.restablecerPassword(t, 'nueva456')).rejects.toBeInstanceOf(BadRequestException);
    (Date.now as jest.Mock).mockRestore();
  });

  it('contraseña de menos de 6 → 400 y la vieja sigue valiendo', async () => {
    const { service, mail } = await montar([ana()]);
    await service.solicitarRecuperacion('ana@x.com');
    await expect(service.restablecerPassword(tokenDelCorreo(mail), '12345')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.logIn({ name: 'ana', password: 'vieja123' })).resolves.toMatchObject({ token: 'jwt' });
  });

  it('enlace manipulado → 400', async () => {
    const { service, mail } = await montar([ana()]);
    await service.solicitarRecuperacion('ana@x.com');
    await expect(service.restablecerPassword(tokenDelCorreo(mail) + 'x', 'nueva456')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.restablecerPassword('basura', 'nueva456')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('el enlace de Ana no sirve para cambiar la de otra persona', async () => {
    const { service, mail } = await montar([ana(), { id: 'u-bea', name: 'bea', email: 'bea@x.com', passwordPlano: 'bea12345' }]);
    await service.solicitarRecuperacion('ana@x.com');
    const [payload, firma] = tokenDelCorreo(mail).split('.');
    const deBea = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(payload, 'base64url').toString()), uid: 'u-bea' })).toString('base64url');
    await expect(service.restablecerPassword(`${deBea}.${firma}`, 'robada99')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.logIn({ name: 'bea', password: 'bea12345' })).resolves.toMatchObject({ token: 'jwt' });
  });

  it('cuenta sin confirmar: al cambiarla queda confirmada (el enlace llegó a su correo)', async () => {
    const { service, mail, filas } = await montar([{ ...ana(), email_confirmado: false }]);
    await service.solicitarRecuperacion('ana@x.com');
    await service.restablecerPassword(tokenDelCorreo(mail), 'nueva456');
    expect(filas[0].email_confirmado).toBe(true);
    await expect(service.logIn({ name: 'ana@x.com', password: 'nueva456' })).resolves.toMatchObject({ token: 'jwt' });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('Entrar con el email escrito de otra forma', () => {
  it('entra aunque escriba el email con mayúsculas', async () => {
    const { service } = await montar([ana()]);
    await expect(service.logIn({ name: 'ANA@x.com', password: 'vieja123' })).resolves.toMatchObject({ token: 'jwt' });
  });
});

describe('Cambiar la contraseña desde «Mi cuenta»', () => {
  it('menos de 6 → 400', async () => {
    const { service } = await montar([ana()]);
    await expect(service.updateUser('u-ana', { password: '123' })).rejects.toBeInstanceOf(BadRequestException);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('Texto del correo', () => {
  let enviar: jest.Mock;
  let mail: MailService;
  beforeEach(() => {
    mail = new MailService();
    enviar = jest.fn().mockResolvedValue(undefined);
    (mail as any).enviar = enviar;
  });

  it('asunto, saludo con nombre y botón con el enlace', async () => {
    await mail.enviarRecuperacionPassword('ana@x.com', 'Ana', 'https://web.test/recuperar?token=T');
    const [para, asunto, html] = enviar.mock.calls[0];
    expect(para).toBe('ana@x.com');
    expect(asunto).toBe('Recupera tu contraseña — Life as a Privilege');
    expect(html).toContain('Hola <strong>Ana</strong>, has pedido restablecer la contraseña de tu cuenta.');
    expect(html).toContain('href="https://web.test/recuperar?token=T"');
    expect(html).toContain('caduca en 1 hora');
  });

  it('sin nombre no deja un «Hola ,»; con HTML en el nombre, se escapa', async () => {
    await mail.enviarRecuperacionPassword('a@x.com', '', 'https://e');
    expect(enviar.mock.calls[0][2]).toContain('Hola, has pedido');
    await mail.enviarRecuperacionPassword('a@x.com', '<b>x</b>', 'https://e');
    expect(enviar.mock.calls[1][2]).not.toContain('<b>x</b>');
  });
});
