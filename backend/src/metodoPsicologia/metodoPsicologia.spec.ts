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
// 2 · PÁGINA POR PÁGINA — el recorrido entero es «el usuario contestando»:
// lo importante es que TODO lo que escribe se guarda y se recupera después.
//
// Qué escribe cada paso en el blob `data` (los que no aparecen, no guardan):
//   2  El problema         → data["problema-actual"]  (string)
//   3  Test ACE            → data.ace.respuestas      ({key: "si"|"no"})
//   5  Test DES-II         → data.des.respuestas      ({key: 0-100}) + tabla psicologia_des
//   8  Línea de Vida       → data.edad + data.anos    (gestación −1 y cada año:
//                            respuestas por pregunta como LISTAS de recuerdos, o sinRecuerdos)
//   9  Tu familia          → data.genograma           (personas con fila/col y símbolos)
//   10 Genograma           → data.genograma           (las MISMAS personas + notas por pregunta;
//                            las fotos van al bucket, aquí solo la URL)
//   11 Huellas             → data.anos[año].huellas   (los recuerdos marcados, por texto)
//   12 Nudos               → data.nudos               (string[])
//   13 Necesidades         → data.necesidades         ({key: "recibida"|"a-veces"|"falto"})
//   14 Heridas             → data.heridas             (huellas+nudos+necesidades unidos + texto)
//   16 Narra (regulación)  → data.regulacion          ({fragmentos: string[]})
//   17 Relación            → data.constelaciones      (nudos+arquetipos unidos + texto)
//   18 Recuérdate (dones)  → data.dones.respuestas / data.dones.sinIdeas
//   19 Dones: el espejo    → data.dones.lista
//   20 Miedos              → data.miedos              ([{id, texto}])
//   21 Atrévete            → data.miedos[].respuestas ({key: string})
//   22 Integración         → data.constelaciones[].proteger|coste|verdadSana|recordatorio
//   23 Compromiso          → data.compromiso          ({necesitaste, dartelo})
//   24 Tu brújula          → data.brujula             ({mensaje})
//   (15 Tus heridas solo BORRA de data.heridas; 1, 4, 6, 7, 25, 26 y 27 leen o
//    presentan; la síntesis genera los PDF en el navegador.)
//
// Cada página hace lo mismo: carga la fila, EXTIENDE el blob y lo reguarda
// entero. El helper `contesta` reproduce exactamente eso.
// ═════════════════════════════════════════════════════════════════════════════
describe('2 · Página por página: todo lo que contesta se guarda y se recupera', () => {
  /** Lo que hace cada página al guardar: cargar el blob, extenderlo, reguardarlo entero. */
  async function contesta(service: MetodoPsicologiaService, parte: Record<string, any>) {
    const row = await service.get(USER);
    const data = { ...(row?.data ?? {}), ...parte };
    const r = await service.actualizar(USER, { data });
    expect(r).toEqual({ success: true });
  }

  it('el recorrido entero, contestando paso a paso: al final está TODO, tal cual lo escribió', async () => {
    const { service } = montar();

    // 2 · El problema
    await contesta(service, { 'problema-actual': 'Me exijo tanto que no descanso nunca' });

    // 3 · Test ACE (respuesta a respuesta)
    await contesta(service, { ace: { respuestas: { 'perdida': 'si' } } });
    await contesta(service, { ace: { respuestas: { 'perdida': 'si', 'humillacion': 'no' } } });

    // 5 · Test DES-II (el 0 es una respuesta válida)
    await contesta(service, { des: { respuestas: { 'absorta': 30, 'no-recuerda': 0 } } });

    // 8 · Línea de Vida: la edad, la gestación (−1), un año con recuerdos y otro sin
    await contesta(service, {
      edad: 34,
      anos: {
        '-1': { respuestas: { deseado: ['Me contaron que fui muy esperada'] } },
        '5': { respuestas: { recuerdas: ['El patio del colegio', 'Mi bici roja'], sentias: ['Libre'] } },
        '6': { sinRecuerdos: true },
      },
    });

    // 9 · Tu familia: coloca a su madre y le pone un símbolo
    await contesta(service, {
      genograma: [{ id: 'p-1', nombre: 'Mamá', parentesco: 'Madre', fila: -1, col: 0, simbolos: ['loba'] }],
    });

    // 10 · Genograma: la MISMA persona, ahora con su ficha escrita y su foto (URL del bucket)
    await contesta(service, {
      genograma: [{
        id: 'p-1', nombre: 'Mamá', parentesco: 'Madre', fila: -1, col: 0, simbolos: ['loba'],
        foto: 'https://bucket/img/genograma/p-1.webp',
        notas: { quien: 'Mi refugio y mi juez', aprendi: 'Que el cariño había que ganárselo' },
      }],
    });

    // 11 · Huellas: marca un recuerdo del año 5 (el resto del año no se pierde)
    const conHuella = (await service.get(USER))!.data;
    await contesta(service, {
      anos: {
        ...conHuella.anos,
        '5': { ...conHuella.anos['5'], huellas: ['El patio del colegio'] },
      },
    });

    // 12 · Nudos
    await contesta(service, { nudos: ['No sé decir que no', 'Necesito aprobación'] });

    // 13 · Necesidades
    await contesta(service, { necesidades: { 'ser-vista': 'falto', 'carino-fisico': 'a-veces' } });

    // 14 · Heridas: une huella + nudo + necesidad y lo nombra
    await contesta(service, {
      heridas: [{
        id: 'h-1', titulo: 'Hacerme invisible',
        huellas: ['El patio del colegio'], nudos: ['No sé decir que no'],
        necesidades: ['ser-vista'], texto: 'Aprendí a no molestar para que me quisieran',
      }],
    });

    // 16 · Narra (regulación): fragmentos de escritura libre
    await contesta(service, { regulacion: { fragmentos: ['Escribo sin pensar…', 'Ahora respiro mejor'] } });

    // 17 · Relación: una constelación de nudos y arquetipos, con su frase
    await contesta(service, {
      constelaciones: [{
        id: 'c-1', titulo: 'La niña responsable',
        nudos: ['Necesito aprobación'], arquetipos: [{ planeta: 'saturno', campo: 'signo' }],
        texto: 'Mi Saturno y mi necesidad de aprobación se dan la mano',
      }],
    });

    // 18 · Recuérdate: respuestas de dones (y una pregunta «sin ideas»)
    await contesta(service, { dones: { respuestas: { 'que-agradecen': 'Que escucho de verdad' }, sinIdeas: ['de-nina'] } });

    // 19 · Dones, el espejo: reconoce un don (conservando lo del paso 18)
    const conDones = (await service.get(USER))!.data;
    await contesta(service, {
      dones: { ...conDones.dones, lista: [{ id: 'd-1', texto: 'Sé acompañar sin invadir', arquetipos: [] }] },
    });

    // 20 · Miedos, y 21 · Atrévete (las respuestas se cuelgan de cada miedo)
    await contesta(service, { miedos: [{ id: 'm-1', texto: 'Quedarme sola' }] });
    await contesta(service, { miedos: [{ id: 'm-1', texto: 'Quedarme sola', respuestas: { 'que-harias': 'Volvería a empezar' } }] });

    // 22 · Integración: la MISMA relación del paso 17 crece con sus 4 bloques
    const conRel = (await service.get(USER))!.data;
    await contesta(service, {
      constelaciones: [{
        ...conRel.constelaciones[0],
        proteger: 'Intentaba protegerme del rechazo',
        coste: 'Vivir agotada',
        verdadSana: 'Puedo equivocarme y seguir siendo querida',
        recordatorio: 'No tengo que ganarme el descanso',
      }],
    });

    // 23 · Compromiso y 24 · Tu brújula
    await contesta(service, { compromiso: { necesitaste: 'Que alguien me dijera que valía', dartelo: 'Hablarme como le hablo a una amiga' } });
    await contesta(service, { brujula: { mensaje: 'Cuando te bloquees: respira, no estás en peligro, estás recordando' } });

    // ── Vuelve otro día: TODO sigue ahí, tal cual lo escribió ──
    const d = (await service.get(USER))!.data;
    expect(d['problema-actual']).toBe('Me exijo tanto que no descanso nunca');
    expect(d.ace).toEqual({ respuestas: { 'perdida': 'si', 'humillacion': 'no' } });
    expect(d.des).toEqual({ respuestas: { 'absorta': 30, 'no-recuerda': 0 } });
    expect(d.edad).toBe(34);
    expect(d.anos['-1']).toEqual({ respuestas: { deseado: ['Me contaron que fui muy esperada'] } });
    expect(d.anos['5']).toEqual({
      respuestas: { recuerdas: ['El patio del colegio', 'Mi bici roja'], sentias: ['Libre'] },
      huellas: ['El patio del colegio'],
    });
    expect(d.anos['6']).toEqual({ sinRecuerdos: true });
    expect(d.genograma).toEqual([{
      id: 'p-1', nombre: 'Mamá', parentesco: 'Madre', fila: -1, col: 0, simbolos: ['loba'],
      foto: 'https://bucket/img/genograma/p-1.webp',
      notas: { quien: 'Mi refugio y mi juez', aprendi: 'Que el cariño había que ganárselo' },
    }]);
    expect(d.nudos).toEqual(['No sé decir que no', 'Necesito aprobación']);
    expect(d.necesidades).toEqual({ 'ser-vista': 'falto', 'carino-fisico': 'a-veces' });
    expect(d.heridas).toHaveLength(1);
    expect(d.heridas[0].texto).toBe('Aprendí a no molestar para que me quisieran');
    expect(d.regulacion).toEqual({ fragmentos: ['Escribo sin pensar…', 'Ahora respiro mejor'] });
    expect(d.constelaciones[0]).toMatchObject({
      texto: 'Mi Saturno y mi necesidad de aprobación se dan la mano',
      proteger: 'Intentaba protegerme del rechazo',
      coste: 'Vivir agotada',
      verdadSana: 'Puedo equivocarme y seguir siendo querida',
      recordatorio: 'No tengo que ganarme el descanso',
    });
    expect(d.dones).toEqual({
      respuestas: { 'que-agradecen': 'Que escucho de verdad' },
      sinIdeas: ['de-nina'],
      lista: [{ id: 'd-1', texto: 'Sé acompañar sin invadir', arquetipos: [] }],
    });
    expect(d.miedos).toEqual([{ id: 'm-1', texto: 'Quedarme sola', respuestas: { 'que-harias': 'Volvería a empezar' } }]);
    expect(d.compromiso).toEqual({ necesitaste: 'Que alguien me dijera que valía', dartelo: 'Hablarme como le hablo a una amiga' });
    expect(d.brujula).toEqual({ mensaje: 'Cuando te bloquees: respira, no estás en peligro, estás recordando' });
  });

  it('borrar también se guarda: quitar un nudo o desmarcar una huella no resucita después', async () => {
    const { service } = montar([{
      user_id: USER,
      data: {
        nudos: ['uno', 'dos'],
        anos: { '5': { respuestas: { recuerdas: ['El patio'] }, huellas: ['El patio'] } },
      },
    }]);
    // La página quita el nudo «dos» y desmarca la huella, y guarda el blob entero.
    await contesta(service, {
      nudos: ['uno'],
      anos: { '5': { respuestas: { recuerdas: ['El patio'] }, huellas: [] } },
    });
    const d = (await service.get(USER))!.data;
    expect(d.nudos).toEqual(['uno']);
    expect(d.anos['5'].huellas).toEqual([]);
    expect(d.anos['5'].respuestas.recuerdas).toEqual(['El patio']); // lo demás, intacto
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('3 · El test DES-II: el resultado en su propia tabla', () => {
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
