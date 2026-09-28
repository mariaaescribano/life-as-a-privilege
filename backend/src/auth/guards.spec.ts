// ─────────────────────────────────────────────────────────────────────────────
// QUIÉN PUEDE TOCAR QUÉ
//
// OwnerGuard: cada persona solo lee/escribe lo suyo (:userId, :id o body.userId).
// AdminGuard: el panel exige email en ADMIN_EMAILS **y** token desbloqueado con
// la contraseña de admin (claim `admin: true`). OwnerGuard aplica la misma
// doble llave para dejar pasar a la admin sobre datos ajenos.
// ─────────────────────────────────────────────────────────────────────────────

import { ForbiddenException } from '@nestjs/common';
import { OwnerGuard } from './owner.guard';
import { AdminGuard } from './admin.guard';

const ctx = (req: any) => ({ switchToHttp: () => ({ getRequest: () => req }) }) as any;
const YO = 'u-yo';
const OTRA = 'u-otra';

beforeAll(() => { process.env.ADMIN_EMAILS = 'jefa@x.com'; });

describe('OwnerGuard', () => {
  const g = new OwnerGuard();

  it('sin sesión → 403', () => {
    expect(() => g.canActivate(ctx({ params: { userId: YO } }))).toThrow(ForbiddenException);
  });

  it.each([
    ['params.userId', { params: { userId: YO } }],
    ['params.id', { params: { id: YO } }],
    ['body.userId', { params: {}, body: { userId: YO } }],
    ['body.idUser', { params: {}, body: { idUser: YO } }],
  ])('lo mío por %s → pasa', (_, req) => {
    expect(g.canActivate(ctx({ ...req, user: { userId: YO, email: 'yo@x.com' } }))).toBe(true);
  });

  it('lo de otra persona → 403', () => {
    expect(() => g.canActivate(ctx({ params: { userId: OTRA }, user: { userId: YO, email: 'yo@x.com' } }))).toThrow(ForbiddenException);
  });

  it('sin saber de quién es el recurso → 403', () => {
    expect(() => g.canActivate(ctx({ params: {}, user: { userId: YO, email: 'yo@x.com' } }))).toThrow(ForbiddenException);
  });

  it('email de admin SIN la contraseña de admin → NO puede tocar lo ajeno', () => {
    expect(() => g.canActivate(ctx({ params: { userId: OTRA }, user: { userId: YO, email: 'jefa@x.com' } }))).toThrow(ForbiddenException);
  });

  it('email de admin sin desbloquear sí puede tocar lo suyo', () => {
    expect(g.canActivate(ctx({ params: { userId: YO }, user: { userId: YO, email: 'jefa@x.com' } }))).toBe(true);
  });

  it('admin desbloqueada → puede tocar lo de cualquiera', () => {
    expect(g.canActivate(ctx({ params: { userId: OTRA }, user: { userId: YO, email: 'Jefa@X.com', admin: true } }))).toBe(true);
  });

  it('claim admin sin email de admin → no vale', () => {
    expect(() => g.canActivate(ctx({ params: { userId: OTRA }, user: { userId: YO, email: 'yo@x.com', admin: true } }))).toThrow(ForbiddenException);
  });
});

describe('AdminGuard', () => {
  const g = new AdminGuard();
  it.each([
    ['sin sesión', undefined],
    ['usuaria normal', { email: 'yo@x.com' }],
    ['email de admin sin desbloquear', { email: 'jefa@x.com' }],
    ['claim admin sin email de admin', { email: 'yo@x.com', admin: true }],
  ])('%s → 403', (_, user) => {
    expect(() => g.canActivate(ctx({ user }))).toThrow(ForbiddenException);
  });

  it('email de admin + desbloqueada → pasa', () => {
    expect(g.canActivate(ctx({ user: { email: 'jefa@x.com', admin: true } }))).toBe(true);
  });
});
