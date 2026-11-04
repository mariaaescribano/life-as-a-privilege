import { resolverPersona } from './persona.util';
import { esMaria } from './maria.guard';

// María = token de admin desbloqueado con email de ADMIN_EMAILS.
const maria = { sub: 'admin', email: 'maria@x.com', admin: true };

describe('resolverPersona (el camino de María en el de una persona)', () => {
  beforeEach(() => { process.env.ADMIN_EMAILS = 'maria@x.com'; });

  it('María con la cabecera: los datos son de la persona y sigue siendo María', () => {
    const u = resolverPersona(maria, 'u1');
    expect(u.userId).toBe('u1');
    expect(u.admin).toBe(true);
    expect(u.suplantadoPor).toBe('admin');
    expect(esMaria({ user: u })).toBe(true);
  });

  it('María sin cabecera: su sesión tal cual', () => {
    const u = resolverPersona(maria, undefined);
    expect(u).toMatchObject({ userId: 'admin', admin: true, suplantadoPor: undefined });
  });

  it('cabecera vacía, «admin» o el propio id: se ignora', () => {
    expect(resolverPersona(maria, '  ').userId).toBe('admin');
    expect(resolverPersona(maria, 'admin').userId).toBe('admin');
  });

  it('una persona normal NO puede usar la cabecera', () => {
    const u = resolverPersona({ sub: 'u1', email: 'ana@x.com', admin: false }, 'u2');
    expect(u.userId).toBe('u1');
    expect(u.suplantadoPor).toBeUndefined();
  });

  it('email de admin SIN desbloquear: la cabecera no vale', () => {
    const u = resolverPersona({ sub: 'u9', email: 'maria@x.com', admin: false }, 'u2');
    expect(u.userId).toBe('u9');
    expect(u.admin).toBe(false);
  });

  it('token con admin:true pero email fuera de ADMIN_EMAILS: no vale', () => {
    const u = resolverPersona({ sub: 'u1', email: 'otra@x.com', admin: true }, 'u2');
    expect(u.userId).toBe('u1');
  });
});
