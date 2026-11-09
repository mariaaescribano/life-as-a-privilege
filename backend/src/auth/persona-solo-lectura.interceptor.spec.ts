import { of, lastValueFrom } from 'rxjs';
import { PersonaSoloLecturaInterceptor } from './persona-solo-lectura.interceptor';

// María recorriendo la cuenta de una persona NO puede dejar rastro en su progreso ni en sus respuestas.
const llamar = async (method: string, url: string, suplantadoPor?: string) => {
  const handler = { handle: jest.fn(() => of('REAL')) };
  const ctx: any = { switchToHttp: () => ({ getRequest: () => ({ method, originalUrl: url, user: { userId: 'persona', suplantadoPor } }) }) };
  const r = await lastValueFrom(new PersonaSoloLecturaInterceptor().intercept(ctx, handler as any));
  return { r, tocado: handler.handle.mock.calls.length > 0 };
};

describe('María mirando la cuenta de una persona', () => {
  it.each([
    ['POST', '/recorrido-progreso/camino-metodo/avanzar'],
    ['PATCH', '/metodo-astrologia/abc123'],
    ['POST', '/metodo-astrologia/solicitud/abc123'],
    ['PATCH', '/metodo-psicologia/abc123'],
    ['POST', '/actividad'],
  ])('%s %s se descarta (no toca nada)', async (m, u) => {
    const { r, tocado } = await llamar(m, u, 'maria');
    expect(tocado).toBe(false);
    expect(r).toMatchObject({ ok: true, ignorado: true });
  });

  it.each([
    ['POST', '/notas/abc123'],
    ['POST', '/notas-pagina/abc123'],
    ['PATCH', '/metodo-astrologia/admin/abc123/nacimiento'],
    ['PATCH', '/metodo-astrologia/carta-natal/abc123/cuerpo'],
    ['POST', '/recorrido-progreso/admin/abc123/metodo'],
    ['GET', '/metodo-astrologia/abc123'],
  ])('%s %s sigue funcionando', async (m, u) => {
    const { r, tocado } = await llamar(m, u, 'maria');
    expect(tocado).toBe(true);
    expect(r).toBe('REAL');
  });

  it('la propia persona sí guarda su progreso', async () => {
    const { r, tocado } = await llamar('POST', '/recorrido-progreso/camino-metodo/avanzar', undefined);
    expect(tocado).toBe(true);
    expect(r).toBe('REAL');
  });
});
