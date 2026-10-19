import { ForbiddenException } from '@nestjs/common';
import { ConsentimientoSaludGuard } from './consentimiento-salud.guard';

const contexto = (method: string, userId?: string): any => ({
  switchToHttp: () => ({ getRequest: () => ({ method, user: userId ? { userId } : undefined }) }),
});

const guardConFila = (fila: any, error: any = null) =>
  new ConsentimientoSaludGuard({
    getClient: () => ({
      from: () => ({
        select: () => ({
          eq: () => ({ eq: () => ({ maybeSingle: async () => ({ data: fila, error }) }) }),
        }),
      }),
    }),
  } as any);

describe('ConsentimientoSaludGuard', () => {
  it('deja leer y borrar sin consentimiento', async () => {
    const g = guardConFila(null);
    await expect(g.canActivate(contexto('GET', 'u1'))).resolves.toBe(true);
    await expect(g.canActivate(contexto('DELETE', 'u1'))).resolves.toBe(true);
  });

  it('bloquea escribir sin consentimiento', async () => {
    const g = guardConFila(null);
    for (const m of ['POST', 'PUT', 'PATCH']) {
      await expect(g.canActivate(contexto(m, 'u1'))).rejects.toBeInstanceOf(ForbiddenException);
    }
  });

  it('bloquea si no se puede comprobar (error de BD)', async () => {
    const g = guardConFila(null, { message: 'caído' });
    await expect(g.canActivate(contexto('PATCH', 'u1'))).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('deja escribir con consentimiento', async () => {
    const g = guardConFila({ updated_at: '2026-10-19' });
    await expect(g.canActivate(contexto('PATCH', 'u1'))).resolves.toBe(true);
  });
});
