// LAS PERSONAS DE LECTURA ASTRAL no son cuentas: viven en `lectura_cliente` (no en `user`), entran con el enlace del
// correo (firmado con su `clave`) y su carta está en `lectura_astrologia`. Lo que fijan estos tests:
//   · crearlas no toca la tabla `user`;
//   · el correo de acceso lo escribe María y su botón lleva la llave;
//   · la llave solo abre a la persona de lectura, y solo si no está manipulada;
//   · un id sin el prefijo `lec_` nunca se trata como persona de lectura.
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { bdFalsa } from '../test-utils/bd-falsa';
import { crearTokenAccesoLectura } from '../auth/password-reset.util';
import { esIdLectura, PREFIJO_LECTURA } from './lectura-id';

function montar() {
  const bd = bdFalsa({ user: [], lectura_cliente: [], lectura_astrologia: [] });
  const mail: any = { enviarCorreoEditable: jest.fn().mockResolvedValue(true) };
  const auth: any = { generateToken: jest.fn().mockReturnValue('jwt-de-test') };
  const service = new UserService(auth, bd.databaseService, mail);
  return { service, mail, auth, bd };
}

beforeAll(() => { process.env.JWT_SECRET = 'secreto-de-test'; });
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('el id de lectura', () => {
  it('solo es de lectura si lleva el prefijo', () => {
    expect(esIdLectura(`${PREFIJO_LECTURA}abc`)).toBe(true);
    expect(esIdLectura('abc')).toBe(false);
    expect(esIdLectura('')).toBe(false);
    expect(esIdLectura(undefined)).toBe(false);
  });
});

describe('crear a la persona de lectura', () => {
  it('va a `lectura_cliente` con id lec_…, y NO crea ninguna fila en `user`', async () => {
    const { service, bd } = montar();
    const r = await service.crearCuentaLectura({ name: 'Josep', email: 'Josep@X.com' });
    expect(r.existente).toBe(false);
    expect(esIdLectura(r.id)).toBe(true);
    expect(bd.filas).toHaveLength(0); // `filas` es la tabla `user`
    const c = await service.getClienteLectura(r.id);
    expect(c).toMatchObject({ nombre: 'Josep', email: 'josep@x.com' });
    expect(typeof c!.clave).toBe('string');
    expect(c!.clave.length).toBeGreaterThan(20);
  });

  it('el mismo email no crea a otra persona: se reutiliza', async () => {
    const { service } = montar();
    const a = await service.crearCuentaLectura({ name: 'Josep', email: 'josep@x.com' });
    const b = await service.crearCuentaLectura({ name: 'Otro', email: 'JOSEP@x.com' });
    expect(b).toEqual({ id: a.id, existente: true });
  });

  it('sin nombre o sin email no se crea', async () => {
    const { service } = montar();
    await expect(service.crearCuentaLectura({ name: '', email: 'a@b.com' })).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.crearCuentaLectura({ name: 'Ana', email: '' })).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe('el correo de acceso lo escribe María', () => {
  it('sale con su asunto y su texto, y el botón lleva la llave; queda apuntado cuándo salió', async () => {
    const { service, mail } = montar();
    const { id } = await service.crearCuentaLectura({ name: 'Josep', email: 'josep@x.com' });
    const ok = await service.enviarAccesoLectura(id, { asunto: 'Tu carta ya está lista', texto: 'Hola Josep\n\nYa puedes leerla.' });
    expect(ok).toBe(true);
    const arg = mail.enviarCorreoEditable.mock.calls[0][0];
    expect(arg).toMatchObject({ para: 'josep@x.com', asunto: 'Tu carta ya está lista', texto: 'Hola Josep\n\nYa puedes leerla.' });
    expect(arg.boton.href).toContain('/acceso?token=');
    expect((await service.getClienteLectura(id)) as any).toBeTruthy();
  });

  it('sin asunto o sin texto no se manda; a una persona que no existe, tampoco', async () => {
    const { service } = montar();
    const { id } = await service.crearCuentaLectura({ name: 'Josep', email: 'josep@x.com' });
    await expect(service.enviarAccesoLectura(id, { asunto: '', texto: 'x' })).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.enviarAccesoLectura(id, { asunto: 'a', texto: '' })).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.enviarAccesoLectura('lec_nadie', { asunto: 'a', texto: 'b' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('si el correo no sale, no se apunta como enviado', async () => {
    const { service, mail } = montar();
    mail.enviarCorreoEditable.mockResolvedValueOnce(false);
    const { id } = await service.crearCuentaLectura({ name: 'Josep', email: 'josep@x.com' });
    expect(await service.enviarAccesoLectura(id, { asunto: 'a', texto: 'b' })).toBe(false);
  });
});

describe('entrar con el enlace', () => {
  it('con la llave buena entra: devuelve un token y a la persona SIN foto y marcada como de lectura', async () => {
    const { service, auth } = montar();
    const { id } = await service.crearCuentaLectura({ name: 'Josep', email: 'josep@x.com' });
    const c = (await service.getClienteLectura(id))!;
    const r: any = await service.entrarConEnlaceLectura(crearTokenAccesoLectura(c.id, c.clave));
    expect(r.token).toBe('jwt-de-test');
    expect(auth.generateToken).toHaveBeenCalledWith(id, 'josep@x.com');
    expect(r.user).toMatchObject({ id, name: 'Josep', img: null, solo_lectura: true });
    expect(r.user.clave).toBeUndefined();
  });

  it('una llave de otra persona, manipulada o de un id sin prefijo no abre nada', async () => {
    const { service } = montar();
    const { id } = await service.crearCuentaLectura({ name: 'Josep', email: 'josep@x.com' });
    const c = (await service.getClienteLectura(id))!;
    await expect(service.entrarConEnlaceLectura(crearTokenAccesoLectura(c.id, 'otra-clave'))).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.entrarConEnlaceLectura('basura')).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.entrarConEnlaceLectura(crearTokenAccesoLectura('abc', c.clave))).rejects.toBeInstanceOf(ForbiddenException);
  });
});

describe('getUserById de una persona de lectura', () => {
  it('sale de su tabla, sin contraseña ni clave', async () => {
    const { service } = montar();
    const { id } = await service.crearCuentaLectura({ name: 'Josep', email: 'josep@x.com' });
    const u: any = await service.getUserById(id);
    expect(u).toMatchObject({ id, name: 'Josep', email: 'josep@x.com', solo_lectura: true, img: null });
    expect(u.clave).toBeUndefined();
    expect(u.password).toBeUndefined();
  });
});
