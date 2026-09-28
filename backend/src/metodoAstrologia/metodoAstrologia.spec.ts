// ─────────────────────────────────────────────────────────────────────────────
// TRAMO 3 · RECORRIDO DE ASTROLOGÍA (metodo-astrologia)
//
// El flujo que fijan estos tests:
//   1. La persona manda sus datos de nacimiento (POST solicitud/:userId): se
//      geocodifica el lugar, se calcula la carta, se guarda TODO en su fila y
//      salen dos correos (los datos a la creadora + el acuse de recibo a ella).
//      `solicitud_enviada_at` es la puerta que abre el resto de pasos.
//   2. El progreso (planetas/casas/aspectos leídos) va en el JSONB `data` vía
//      PATCH: solo campos permitidos, y `data` se FUSIONA, nunca se pisa.
//   3. La admin escribe la lectura (puntos clave, casas, aspectos) y avisa por
//      email A MANO desde el panel; guardar no avisa a nadie.
// La BD es una tabla en memoria; correo, geocoding y efemérides van simulados.
// ─────────────────────────────────────────────────────────────────────────────

import { NotFoundException } from '@nestjs/common';
import { MetodoAstrologiaService } from './metodoAstrologia.service';
import { bdFalsa } from '../test-utils/bd-falsa';

const USER = '11111111-2222-3333-4444-555555555555';

// Una carta calculada de mentira, con las 12 casas de 30° empezando en 0° Aries.
const CARTA = {
  planetas: [
    { planeta: 'sol', grado: 15, signoIdx: 0, casa: 1 },
    { planeta: 'luna', grado: 200, signoIdx: 6, casa: 7 },
  ],
  cusps: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
  ascendente: { grado: 0, signoIdx: 0 },
  aspectos: [],
};

const DATOS = {
  fecha_nacimiento: '1990-05-17',
  hora_nacimiento: '08:30',
  pais: 'España',
  lugar: 'Madrid',
  region: 'Madrid',
};

function montar(filasAstro: Record<string, any>[] = []) {
  const bd = bdFalsa({
    metodo_astrologia: filasAstro,
    user: [{ id: USER, name: 'Ana', email: 'ana@x.com' }],
  });
  const mail: any = {
    enviarSolicitudCarta: jest.fn().mockResolvedValue(undefined),
    enviarCartaRegistrada: jest.fn().mockResolvedValue(undefined),
    enviarCartaEnProceso: jest.fn().mockResolvedValue(undefined),
    enviarCartaLeida: jest.fn().mockResolvedValue(undefined),
  };
  const userService: any = {
    getUserById: jest.fn(async (id: string) => {
      const u = bd.tablas.user.find((f) => f.id === id);
      if (!u) throw new NotFoundException('no existe');
      return u;
    }),
  };
  const cartaNatal: any = {
    geocode: jest.fn().mockResolvedValue({ lat: 40.4, lng: -3.7 }),
    getTimezone: jest.fn().mockReturnValue('Europe/Madrid'),
    localToUtc: jest.fn().mockReturnValue(new Date('1990-05-17T06:30:00Z')),
    calcular: jest.fn().mockReturnValue(CARTA),
    // El merge real rellena signo/casa por planeta sin pisar lo del usuario;
    // aquí basta con que conserve lo previo y deje una marca de que pasó.
    mergeWithCartaData: jest.fn((prev: any, _carta: any) => ({ ...(prev ?? {}), _deCarta: true })),
  };
  const service = new MetodoAstrologiaService(bd.databaseService, mail, userService, cartaNatal);
  return { service, mail, userService, cartaNatal, astro: bd.tablas.metodo_astrologia };
}

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// ═════════════════════════════════════════════════════════════════════════════
describe('1 · Solicitud de carta (el formulario del paso 1)', () => {
  it('guarda datos + coordenadas + carta calculada y marca solicitud_enviada_at', async () => {
    const { service, astro } = montar();
    const r = await service.solicitarCarta(USER, DATOS);

    expect(r).toEqual({ success: true });
    expect(astro).toHaveLength(1);
    expect(astro[0]).toMatchObject({
      user_id: USER,
      fecha_nacimiento: '1990-05-17',
      hora_nacimiento: '08:30',
      pais: 'España',
      lugar: 'Madrid',
      region: 'Madrid',
      latitud: 40.4,
      longitud: -3.7,
      timezone: 'Europe/Madrid',
      carta_natal_json: CARTA,
    });
    expect(astro[0].solicitud_enviada_at).toBeTruthy();
  });

  it('manda los DOS correos: los datos a la creadora y el acuse a la persona', async () => {
    const { service, mail } = montar();
    await service.solicitarCarta(USER, DATOS);
    // esCorreccion = false: es la primera solicitud
    expect(mail.enviarSolicitudCarta).toHaveBeenCalledWith('ana@x.com', 'Ana', DATOS, false);
    expect(mail.enviarCartaRegistrada).toHaveBeenCalledWith('ana@x.com', 'Ana', DATOS, false);
  });

  it('corregir los datos (segunda solicitud) avisa como CORRECCIÓN', async () => {
    const { service, mail } = montar();
    await service.solicitarCarta(USER, DATOS);
    await service.solicitarCarta(USER, { ...DATOS, hora_nacimiento: '09:00' });
    expect(mail.enviarSolicitudCarta).toHaveBeenLastCalledWith(
      'ana@x.com', 'Ana', expect.objectContaining({ hora_nacimiento: '09:00' }), true,
    );
  });

  it('si el geocoding falla pero el lugar no ha cambiado, reutiliza las coordenadas y no pierde la carta', async () => {
    const { service, cartaNatal, astro } = montar();
    await service.solicitarCarta(USER, DATOS); // primera vez, con geocoding bueno
    cartaNatal.geocode.mockResolvedValue(null); // el servicio de mapas se cae
    await service.solicitarCarta(USER, { ...DATOS, hora_nacimiento: '10:15' });

    expect(astro[0]).toMatchObject({
      hora_nacimiento: '10:15',
      latitud: 40.4,
      longitud: -3.7,
      timezone: 'Europe/Madrid',
      carta_natal_json: CARTA,
    });
  });

  it('si el geocoding falla con un lugar nuevo, guarda los datos igual (sin carta) y no revienta', async () => {
    const { service, cartaNatal, astro } = montar();
    cartaNatal.geocode.mockResolvedValue(null);
    const r = await service.solicitarCarta(USER, DATOS);
    expect(r).toEqual({ success: true });
    expect(astro[0]).toMatchObject({
      fecha_nacimiento: '1990-05-17',
      latitud: null,
      longitud: null,
      carta_natal_json: null,
    });
    expect(astro[0].solicitud_enviada_at).toBeTruthy();
  });

  it('lo que la persona ya tenía en `data` (progreso) NO se pierde al reenviar la solicitud', async () => {
    const { service, astro } = montar([
      { user_id: USER, data: { retosLeidos: ['r1'], sol: { profundizadoSigno: true } } },
    ]);
    await service.solicitarCarta(USER, DATOS);
    expect(astro[0].data).toMatchObject({
      retosLeidos: ['r1'],
      sol: { profundizadoSigno: true },
      _deCarta: true,
    });
  });

  it('usuario que no existe → 404 y no se guarda nada', async () => {
    const { service, astro, mail } = montar();
    await expect(service.solicitarCarta('otro-id', DATOS)).rejects.toBeInstanceOf(NotFoundException);
    expect(astro.filter((f) => f.user_id === 'otro-id')).toHaveLength(0);
    expect(mail.enviarSolicitudCarta).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('2 · PATCH del progreso (leídos, planetas, cómics vistos)', () => {
  it('data se FUSIONA con lo guardado: marcar una casa leída no borra los retos leídos', async () => {
    const { service, astro } = montar([
      { user_id: USER, data: { retosLeidos: ['r1', 'r2'] }, link_carta: 'https://drive/pdf' },
    ]);
    const r = await service.actualizar(USER, { data: { casasLeidos: ['1'] } });
    expect(r).toEqual({ success: true });
    expect(astro[0].data).toEqual({ retosLeidos: ['r1', 'r2'], casasLeidos: ['1'] });
  });

  it('los campos sensibles NO se pueden escribir desde fuera: ni link_carta, ni la puerta del recorrido, ni la carta', async () => {
    const { service, astro } = montar([{ user_id: USER, data: {} }]);
    await service.actualizar(USER, {
      link_carta: 'https://pirata',
      solicitud_enviada_at: '2020-01-01', // abriría todos los pasos sin pasar por el formulario
      carta_natal_json: { planetas: [] },
      latitud: 0,
    });
    expect(astro[0].link_carta).toBeUndefined();
    expect(astro[0].solicitud_enviada_at).toBeUndefined();
    expect(astro[0].carta_natal_json).toBeUndefined();
    expect(astro[0].latitud).toBeUndefined();
  });

  it('sí deja marcar aviso_visto / intro_visto', async () => {
    const { service, astro } = montar([{ user_id: USER }]);
    await service.actualizar(USER, { aviso_visto: true, intro_visto: true });
    expect(astro[0]).toMatchObject({ aviso_visto: true, intro_visto: true });
  });

  it('si la fila no existía todavía, el PATCH la crea (upsert)', async () => {
    const { service, astro } = montar();
    await service.actualizar(USER, { data: { introComicVisto: true } });
    expect(astro).toHaveLength(1);
    expect(astro[0]).toMatchObject({ user_id: USER, data: { introComicVisto: true } });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('3 · La carta natal calculada (lo que pinta la rueda 3D)', () => {
  it('si ya está cacheada, la devuelve sin recalcular', async () => {
    const { service, cartaNatal } = montar([{ user_id: USER, carta_natal_json: CARTA }]);
    const carta = await service.getCartaNatal(USER);
    expect(carta).toEqual(CARTA);
    expect(cartaNatal.calcular).not.toHaveBeenCalled();
  });

  it('sin caché pero con datos completos: calcula, guarda y devuelve', async () => {
    const { service, astro } = montar([{
      user_id: USER,
      fecha_nacimiento: '1990-05-17', hora_nacimiento: '08:30',
      latitud: 40.4, longitud: -3.7, timezone: 'Europe/Madrid',
    }]);
    const carta = await service.getCartaNatal(USER);
    expect(carta).toEqual(CARTA);
    expect(astro[0].carta_natal_json).toEqual(CARTA); // queda cacheada
  });

  it('sin datos de nacimiento no hay carta (null), y recalcular lo dice claro', async () => {
    const { service } = montar([{ user_id: USER }]);
    expect(await service.getCartaNatal(USER)).toBeNull();
    const r = await service.recalcular(USER);
    expect(r.success).toBe(false);
  });

  it('ajuste manual: mover el Nodo Norte recoloca el Sur justo enfrente (180°)', async () => {
    const { service, astro } = montar([{ user_id: USER, carta_natal_json: JSON.parse(JSON.stringify(CARTA)) }]);
    const r = await service.setCuerpoManual(USER, 'nodoNorte', 10);
    expect(r.success).toBe(true);
    const planetas = astro[0].carta_natal_json.planetas;
    expect(planetas.find((p: any) => p.planeta === 'nodoNorte')).toMatchObject({ grado: 10, signoIdx: 0, casa: 1 });
    expect(planetas.find((p: any) => p.planeta === 'nodoSur')).toMatchObject({ grado: 190, signoIdx: 6, casa: 7 });
  });

  it('ajuste manual: solo Quirón, Lilith y los nodos; el Sol no se toca a mano', async () => {
    const { service } = montar([{ user_id: USER, carta_natal_json: CARTA }]);
    const r = await service.setCuerpoManual(USER, 'sol' as any, 10);
    expect(r.success).toBe(false);
    const r2 = await service.setCuerpoManual(USER, 'quiron', 400);
    expect(r2.success).toBe(false); // grado fuera de 0-360
  });
});

// ═════════════════════════════════════════════════════════════════════════════
describe('4 · ADMIN: la lectura escrita y los avisos a mano', () => {
  const fila = () => ({
    user_id: USER,
    solicitud_enviada_at: '2026-09-01T10:00:00Z',
    casas_texto: { '1': 'texto casa 1' },
    aspectos_texto: { 'sol-luna-trigono': 'texto viejo' },
    retos: [],
    data: { retosLeidos: [] },
  });

  it('guardarTextos FUSIONA casas y aspectos (no pierde lo ya escrito) y reemplaza los retos enteros', async () => {
    const { service, astro } = montar([fila()]);
    const r = await service.guardarTextos(USER, {
      casas_texto: { '2': 'texto casa 2' },
      retos: [{ id: 'r1', titulo: 'Reto', texto: 'texto' }],
    });
    expect(r).toEqual({ success: true });
    expect(astro[0].casas_texto).toEqual({ '1': 'texto casa 1', '2': 'texto casa 2' });
    expect(astro[0].aspectos_texto).toEqual({ 'sol-luna-trigono': 'texto viejo' }); // intacto
    expect(astro[0].retos).toEqual([{ id: 'r1', titulo: 'Reto', texto: 'texto' }]);
  });

  it('guardar la lectura NO manda ningún correo (los avisos van con sus botones)', async () => {
    const { service, mail } = montar([fila()]);
    await service.guardarTextos(USER, { retos: [{ id: 'r1', titulo: 'R', texto: 't' }], link_carta: 'https://drive/pdf' });
    expect(mail.enviarCartaEnProceso).not.toHaveBeenCalled();
    expect(mail.enviarCartaLeida).not.toHaveBeenCalled();
  });

  it('sin solicitud de carta no hay dónde guardar → 404', async () => {
    const { service } = montar();
    await expect(service.guardarTextos(USER, { casas_texto: { '1': 'x' } })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('aviso «tu carta está en proceso»: manda el correo y apunta cuándo', async () => {
    const { service, mail, astro } = montar([fila()]);
    const r = await service.avisar(USER, 'proceso');
    expect(r.success).toBe(true);
    expect(mail.enviarCartaEnProceso).toHaveBeenCalledWith('ana@x.com', 'Ana');
    expect(astro[0].data.aviso_proceso_at).toBeTruthy();
    expect(astro[0].data.retosLeidos).toEqual([]); // el resto de `data` no se pisa
  });

  it('aviso «tu carta ya está leída» SIN puntos clave guardados: se niega (llevaría a una puerta cerrada)', async () => {
    const { service, mail } = montar([fila()]);
    const r = await service.avisar(USER, 'leida');
    expect(r.success).toBe(false);
    expect(mail.enviarCartaLeida).not.toHaveBeenCalled();
  });

  it('aviso «leída» con puntos clave: manda el correo y apunta cuándo', async () => {
    const f = fila();
    f.retos = [{ id: 'r1', titulo: 'R', texto: 't' }] as any;
    const { service, mail, astro } = montar([f]);
    const r = await service.avisar(USER, 'leida');
    expect(r.success).toBe(true);
    expect(mail.enviarCartaLeida).toHaveBeenCalledWith('ana@x.com', 'Ana');
    expect(astro[0].data.aviso_leida_at).toBeTruthy();
  });

  it('corregir el nacimiento desde el panel: recalcula SIN correos y SIN tocar la puerta del recorrido', async () => {
    const { service, mail, astro } = montar([fila()]);
    const r = await service.guardarNacimientoAdmin(USER, DATOS);
    expect(r.success).toBe(true);
    expect(r.recalculada).toBe(true);
    expect(astro[0].carta_natal_json).toEqual(CARTA);
    expect(astro[0].solicitud_enviada_at).toBe('2026-09-01T10:00:00Z'); // no cambia
    expect(mail.enviarSolicitudCarta).not.toHaveBeenCalled();
    expect(mail.enviarCartaRegistrada).not.toHaveBeenCalled();
  });

  it('corregir el nacimiento valida el formato de fecha y hora', async () => {
    const { service } = montar([fila()]);
    expect((await service.guardarNacimientoAdmin(USER, { ...DATOS, fecha_nacimiento: '17/05/1990' })).success).toBe(false);
    expect((await service.guardarNacimientoAdmin(USER, { ...DATOS, hora_nacimiento: '8h30' })).success).toBe(false);
  });

  it('si al corregir el geocoding falla con lugar nuevo, guarda los datos pero NO pisa la carta que había', async () => {
    const f = { ...fila(), carta_natal_json: CARTA, lugar: 'Madrid', region: 'Madrid', pais: 'España' };
    const { service, cartaNatal, astro } = montar([f]);
    cartaNatal.geocode.mockResolvedValue(null);
    const r = await service.guardarNacimientoAdmin(USER, { ...DATOS, lugar: 'Sitio Inventado' });
    expect(r.success).toBe(true);
    expect(r.recalculada).toBe(false);
    expect(astro[0].lugar).toBe('Sitio Inventado');
    expect(astro[0].carta_natal_json).toEqual(CARTA); // la anterior sigue ahí
  });

  it('la lista del panel dice quién ha pedido carta y cómo va su lectura', async () => {
    const f = fila();
    f.retos = [{ id: 'r1', titulo: 'R', texto: 't' }] as any;
    (f as any).link_carta = 'https://drive/pdf';
    const { service } = montar([f, { user_id: 'sin-solicitud' }]);
    const lista = await service.listarSolicitudes();
    expect(lista).toHaveLength(1); // el que no ha enviado solicitud no sale
    expect(lista[0]).toMatchObject({
      user_id: USER,
      name: 'Ana',
      email: 'ana@x.com',
      tiene_pdf: true,
      casas_escritas: 1,
      aspectos_escritos: 1,
    });
  });
});
