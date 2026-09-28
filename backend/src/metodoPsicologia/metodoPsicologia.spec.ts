// ─────────────────────────────────────────────────────────────────────────────
// TRAMO 3 · RECORRIDO DE PSICOLOGÍA (metodo-psicologia)
//
// EL ARRANQUE, según la descripción de María (2026-09-28), fijado:
//   · Pagar solo DESBLOQUEA la disciplina: el popup de «pago realizado» no te
//     mete dentro; la persona es libre de entrar en el momento o no (Home.tsx
//     cierra el popup y se queda en el Mapa, igual en las 8 disciplinas).
//   · Al entrar sale SIEMPRE el cómic de introducción (useIntroComic: se puede
//     saltar con la X, pero vuelve a salir la próxima vez; no persiste nada).
//   · Después viene SU PROBLEMA (paso 2): lo que escribe SE GUARDA en su fila
//     (data["problema-actual"]) — importante —, y sin escribir nada la página
//     no deja pasar al ACE.
//
// El blob `data` de psicología funciona distinto que el de astrología: el
// cliente manda SIEMPRE el blob ENTERO (carga la fila, la extiende y la
// reguarda; flushSaves antes de navegar) y el backend lo reemplaza tal cual.
// Estos tests fijan ese contrato para que nadie lo cambie sin darse cuenta.
// La BD es una tabla en memoria.
// ─────────────────────────────────────────────────────────────────────────────

import { MetodoPsicologiaService } from './metodoPsicologia.service';
import { bdFalsa } from '../test-utils/bd-falsa';

const USER = '11111111-2222-3333-4444-555555555555';

function montar(filas: Record<string, any>[] = [], des: Record<string, any>[] = []) {
  const bd = bdFalsa({ metodo_psicologia: filas, psicologia_des: des });
  const service = new MetodoPsicologiaService(bd.databaseService);
  return { service, psico: bd.tablas.metodo_psicologia, des: bd.tablas.psicologia_des };
}

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.useRealTimers();
});

// ═════════════════════════════════════════════════════════════════════════════
describe('1 · Su problema (paso 2): se guarda y se vuelve a encontrar', () => {
  it('escribir el problema crea su fila y se guarda en data["problema-actual"]', async () => {
    const { service, psico } = montar();
    const r = await service.actualizar(USER, { data: { 'problema-actual': 'No sé parar' } });
    expect(r).toEqual({ success: true });
    expect(psico).toHaveLength(1);
    expect(psico[0]).toMatchObject({ user_id: USER, data: { 'problema-actual': 'No sé parar' } });
  });

  it('al volver (o recargar), el problema sigue ahí: GET lo devuelve tal cual', async () => {
    const { service } = montar();
    await service.actualizar(USER, { data: { 'problema-actual': 'No sé parar' } });
    const row = await service.get(USER);
    expect(row?.data?.['problema-actual']).toBe('No sé parar');
  });

  it('corregirlo lo reemplaza (vale la última versión)', async () => {
    const { service } = montar();
    await service.actualizar(USER, { data: { 'problema-actual': 'v1' } });
    await service.actualizar(USER, { data: { 'problema-actual': 'v2, mejor dicho' } });
    expect((await service.get(USER))?.data?.['problema-actual']).toBe('v2, mejor dicho');
  });

  it('CONTRATO del blob: se guarda ENTERO tal y como llega — la página debe mandar todo el data junto', async () => {
    const { service, psico } = montar([
      { user_id: USER, data: { 'problema-actual': 'mi problema', 'ace-respuestas': [1, 0, 1] } },
    ]);
    // Así lo hace la página (carga la fila y la extiende): no se pierde nada.
    await service.actualizar(USER, {
      data: { 'problema-actual': 'mi problema', 'ace-respuestas': [1, 0, 1], 'miedos': ['x'] },
    });
    expect(psico[0].data).toEqual({
      'problema-actual': 'mi problema',
      'ace-respuestas': [1, 0, 1],
      'miedos': ['x'],
    });

    // Y esta es la cara B del contrato: un data PARCIAL pisa el resto (el
    // backend NO fusiona, a diferencia de astrología). Si esto deja de ser
    // así a propósito, cambia también las páginas que borran claves adrede.
    await service.actualizar(USER, { data: { 'problema-actual': 'solo esto' } });
    expect(psico[0].data).toEqual({ 'problema-actual': 'solo esto' });
  });

  it('desde fuera solo se pueden tocar data e intro_visto: nada de columnas ajenas', async () => {
    const { service, psico } = montar([{ user_id: USER, data: {} }]);
    await service.actualizar(USER, {
      intro_visto: true,
      user_id: 'otro',            // no puede cambiarse de fila
      psicologia_suscrito: true,  // ni regalarse nada (además vive en `user`)
      created_at: '2020-01-01',
    });
    expect(psico).toHaveLength(1);
    expect(psico[0].user_id).toBe(USER);
    expect(psico[0].intro_visto).toBe(true);
    expect(psico[0].psicologia_suscrito).toBeUndefined();
    expect(psico[0].created_at).toBeUndefined();
  });

  it('sin fila todavía, GET devuelve null (la página arranca vacía sin romperse)', async () => {
    const { service } = montar();
    expect(await service.get(USER)).toBeNull();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('2 · El test DES-II: el resultado en su propia tabla', () => {
  const RESULTADO = {
    score: 23,
    banda: '20–29',
    subescalas: { amnesia: 10, despersonalizacion: 30, absorcion: 40 },
    alto: false,
  };

  it('guarda el resultado normalizado (una fila por persona)', async () => {
    const { service, des } = montar();
    const r = await service.guardarDes(USER, RESULTADO);
    expect(r).toEqual({ success: true });
    expect(des).toHaveLength(1);
    expect(des[0]).toMatchObject({
      user_id: USER,
      score: 23,
      banda: '20–29',
      amnesia: 10,
      despersonalizacion: 30,
      absorcion: 40,
      alto: false,
    });
  });

  it('lo que llega del navegador se recorta: nada por encima de 100 ni por debajo de 0', async () => {
    const { service, des } = montar();
    await service.guardarDes(USER, {
      ...RESULTADO,
      score: 250,
      subescalas: { amnesia: -5, despersonalizacion: 'tres', absorcion: 99.6 },
    });
    expect(des[0]).toMatchObject({ score: 100, amnesia: 0, despersonalizacion: 0, absorcion: 100 });
  });

  it('banda inventada → no se guarda nada', async () => {
    const { service, des } = montar();
    const r = await service.guardarDes(USER, { ...RESULTADO, banda: '50+' });
    expect(r).toEqual({ success: false });
    expect(des).toHaveLength(0);
  });

  it('repetir el test con el MISMO resultado conserva la fecha; con otro resultado, la renueva', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-09-01T10:00:00Z'));
    const { service, des } = montar();
    await service.guardarDes(USER, RESULTADO);
    const fecha1 = des[0].fecha;

    jest.setSystemTime(new Date('2026-09-20T10:00:00Z'));
    await service.guardarDes(USER, RESULTADO); // mismo resultado, semanas después
    expect(des[0].fecha).toBe(fecha1); // la fecha dice cuándo salió ESE resultado

    await service.guardarDes(USER, { ...RESULTADO, score: 31 });
    expect(des[0].fecha).not.toBe(fecha1); // resultado nuevo, fecha nueva
    expect(des[0].score).toBe(31);
  });
});
