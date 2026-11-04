// La nota de María en cada página: la persona SOLO ve lo publicado, nunca el
// borrador, y no puede escribir, publicar ni retirar.
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { NotasPaginaService, paginaLimpia } from './notasPagina.service';
import { NotasPaginaController } from './notasPagina.controller';
import { MariaGuard, esMaria } from '../auth/maria.guard';

/** Una tabla `nota_pagina` en memoria con la parte del cliente de Supabase que usa el servicio. */
function dbFalsa() {
  const filas: Record<string, any>[] = [];
  const consulta = (filtros: Record<string, string> = {}) => {
    const coincide = (f: Record<string, any>) => Object.entries(filtros).every(([k, v]) => f[k] === v);
    const api: any = {
      select: () => api,
      eq: (k: string, v: string) => consulta({ ...filtros, [k]: v }),
      maybeSingle: async () => ({ data: filas.find(coincide) ?? null, error: null }),
      update: (cambios: Record<string, any>) => ({
        eq: (k: string, v: string) => ({
          eq: async (k2: string, v2: string) => {
            filas.filter((f) => f[k] === v && f[k2] === v2).forEach((f) => Object.assign(f, cambios));
            return { error: null };
          },
        }),
      }),
      upsert: async (fila: Record<string, any>) => {
        const i = filas.findIndex((f) => f.user_id === fila.user_id && f.pagina === fila.pagina);
        if (i >= 0) filas[i] = { ...filas[i], ...fila };
        else filas.push({ borrador: '', publicada: null, publicada_at: null, ...fila });
        return { error: null };
      },
    };
    return api;
  };
  const databaseService: any = { getClient: () => ({ from: () => consulta() }) };
  return { databaseService, filas };
}

const PAGINA = '/metodo/psicologia/problema';
const maria = { user: { userId: 'admin', email: 'maria@x.com', admin: true } };
const persona = { user: { userId: 'u1', email: 'ana@x.com', admin: false } };
const enSuCamino ={ user: { userId: 'u1', email: 'ana@x.com', admin: false, suplantadoPor: 'admin' } };

beforeAll(() => { process.env.ADMIN_EMAILS = 'maria@x.com'; });
beforeEach(() => { jest.spyOn(console, 'warn').mockImplementation(() => {}); });

describe('quién es María', () => {
  it('la admin desbloqueada y quien «entra como» una persona; la persona normal, no', () => {
    expect(esMaria(maria)).toBe(true);
    expect(esMaria(enSuCamino)).toBe(true);
    expect(esMaria(persona)).toBe(false);
    expect(esMaria({ user: { userId: 'x', email: 'maria@x.com', admin: false } })).toBe(false); // email de admin sin desbloquear
    expect(esMaria({})).toBe(false);
  });

  it('el guard rechaza a la persona normal', () => {
    const contexto = (req: any) => ({ switchToHttp: () => ({ getRequest: () => req }) }) as any;
    expect(() => new MariaGuard().canActivate(contexto(persona))).toThrow(ForbiddenException);
    expect(new MariaGuard().canActivate(contexto(maria))).toBe(true);
  });
});

describe('la clave de la página', () => {
  it('quita la barra final y los parámetros; rechaza lo que no es una ruta', () => {
    expect(paginaLimpia('/metodo/psicologia/problema/?x=1#a')).toBe(PAGINA);
    expect(() => paginaLimpia('psicologia')).toThrow(BadRequestException);
    expect(() => paginaLimpia(undefined)).toThrow(BadRequestException);
  });
});

describe('borrador y publicación', () => {
  it('el borrador no lo ve la persona hasta que María publica; retirar la deja sin nada', async () => {
    const { databaseService } = dbFalsa();
    const service = new NotasPaginaService(databaseService);
    const controlador = new NotasPaginaController(service);

    await controlador.guardar('u1', { pagina: PAGINA, borrador: 'Fíjate en esto' });

    // La persona: nada (hay borrador, pero no publicado) y ni rastro del borrador.
    const antes: any = await controlador.leer('u1', PAGINA, persona);
    expect(antes.publicada).toBeNull();
    expect(JSON.stringify(antes)).not.toContain('Fíjate');
    expect(antes.esMaria).toBe(false);

    // María: ve el borrador.
    const deMaria: any = await controlador.leer('u1', PAGINA, maria);
    expect(deMaria.borrador).toBe('Fíjate en esto');
    expect(deMaria.publicada).toBeNull();

    // Publica: ahora la persona lo ve.
    await controlador.publicar('u1', { pagina: PAGINA });
    const despues: any = await controlador.leer('u1', PAGINA, persona);
    expect(despues.publicada).toBe('Fíjate en esto');
    expect(despues.publicada_at).toBeTruthy();

    // Cambia el borrador sin publicar: la persona sigue viendo lo publicado.
    await controlador.guardar('u1', { pagina: PAGINA, borrador: 'Otra cosa' });
    expect(((await controlador.leer('u1', PAGINA, persona)) as any).publicada).toBe('Fíjate en esto');

    // Retira: la persona ya no ve nada, el borrador se queda.
    await controlador.retirar('u1', { pagina: PAGINA });
    expect(((await controlador.leer('u1', PAGINA, persona)) as any).publicada).toBeNull();
    expect(((await controlador.leer('u1', PAGINA, maria)) as any).borrador).toBe('Otra cosa');
  });

  it('no se publica una nota vacía y cada página tiene la suya', async () => {
    const { databaseService } = dbFalsa();
    const service = new NotasPaginaService(databaseService);
    await expect(service.publicar('u1', PAGINA)).rejects.toBeInstanceOf(BadRequestException);

    await service.guardarBorrador('u1', PAGINA, 'A');
    await service.guardarBorrador('u1', '/metodo/psicologia/huellas', 'B');
    await service.publicar('u1', PAGINA);
    expect((await service.publicadaPara('u1', PAGINA)).publicada).toBe('A');
    expect((await service.publicadaPara('u1', '/metodo/psicologia/huellas')).publicada).toBeNull();
  });
});
