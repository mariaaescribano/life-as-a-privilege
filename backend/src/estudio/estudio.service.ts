import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { MailService } from '../mail/mail.service';
import { CartaNatalService } from '../metodoAstrologia/cartaNatal.service';
import type { CartaNatal, CuerpoKey } from '../metodoAstrologia/cartaNatal.types';
import { cartaPng } from './cartaPng';

/* Precio de la primera disciplina, tal y como se anuncia en el correo de
 * gracias. Tiene que decir lo mismo que la web: frontend/src/components/metodo/
 * pagoDisciplinaLink.ts (PRECIO_DISCIPLINA_EUR y PRECIO_DISCIPLINA_ANTES_EUR).
 * Si allí se quita el precio tachado, aquí se pone PRECIO_ANTES a undefined. */
const PRECIO_AHORA = '30 €';
const PRECIO_ANTES: string | undefined = '50 €';

/* Nombres de los signos por índice (Aries = 0), igual que en cartaNatal. */
const ZODIACO = [
  'Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo',
  'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis',
];

/** Los dos ejes de cada arquetipo: el signo en que está y la casa en que cae. */
export type Eje = 'signo' | 'casa';
const EJES: Eje[] = ['signo', 'casa'];

export interface DatosParticipante {
  email: string;
  fecha_nacimiento: string; // YYYY-MM-DD
  hora_nacimiento: string;  // HH:MM
  pais: string;
  region: string;
  lugar: string;
  /** Solo informativo: si quien participa tenía sesión abierta. */
  userId?: string | null;
}

export interface RespuestaEstudio {
  planeta: string;
  eje: Eje;
  posicion: string;
  preguntaId: string;
  respuesta: boolean;
}

/** Lo que ve el frontend de un participante: nunca la carta entera, solo la
 *  posición de cada planeta (que es lo único que el estudio necesita) y los
 *  datos que él mismo escribió, para poder prerrellenarle el formulario. */
export interface ParticipanteVista {
  id: string;
  email: string;
  /** { sol: "Leo", luna: "Tauro", … } */
  signos: Record<string, string>;
  /** { sol: 5, luna: 11, … } — el Ascendente no tiene casa. */
  casas: Record<string, number>;
  respuestas: RespuestaEstudio[];
  datos: {
    fecha_nacimiento: string;
    hora_nacimiento: string;
    pais: string;
    region: string;
    lugar: string;
  };
}

export interface ItemEstadistica {
  planeta: string;
  eje: Eje;
  posicion: string;
  preguntaId: string;
  /** Lo que respondió esta persona. */
  respuesta: boolean;
  /** Cuánta gente con ESE planeta en ESA posición ha contestado esa pregunta. */
  total: number;
  si: number;
  /** % de «sí» sobre el total, redondeado. */
  porcentajeSi: number;
}

/** Un arquetipo en una posición, con la media de toda su gente. */
export interface GrupoPublico {
  planeta: string;
  eje: Eje;
  posicion: string;
  /** Cuántas preguntas tiene ese bloque. */
  preguntas: number;
  /** Respuestas contadas en total (preguntas × personas, más o menos). */
  respuestas: number;
  /** Cuánta gente hay en el grupo (la pregunta más respondida del bloque). */
  personas: number;
  /** % de «sí» de todo el grupo. */
  porcentajeSi: number;
}

export interface ResultadosPublicos {
  grupos: GrupoPublico[];
  participantesTotales: number;
}

/**
 * Estudio estadístico sobre astrología.
 *
 * Alguien deja su email y sus datos de nacimiento, se le calcula la carta (el
 * mismo motor que usa El Mapa) y va respondiendo Sí/No a las preguntas de cada
 * arquetipo. Cada arquetipo se pregunta por sus dos ejes —el signo en que está
 * y la casa en que cae— y cada respuesta se guarda junto a esa posición, que es
 * lo que permite luego decir «las personas con Mercurio en Aries han respondido
 * un 90% que sí».
 *
 * Todo es público (no hay login): la identidad es el email y, en el navegador,
 * el id del participante.
 */
@Injectable()
export class EstudioService {
  /**
   * Posiciones (signos y casas) de cada participante, en memoria.
   *
   * Guardar una respuesta necesita saber en qué signo y en qué casa está ese
   * planeta, y eso NO se acepta del navegador: se lee de la carta guardada. Pero
   * quien responde manda decenas de respuestas seguidas y su carta no cambia
   * entre una y otra, así que se lee una vez y se reutiliza: cada Sí/No pasa de
   * dos viajes a la base de datos a uno.
   */
  private readonly posicionesEnMemoria = new Map<
    string,
    { signos: Record<string, string>; casas: Record<string, number>; ts: number }
  >();
  private static readonly POSICIONES_TTL_MS = 30 * 60 * 1000;

  /**
   * Los resultados públicos, ya sumados, en memoria.
   *
   * La página de estadísticas es pública y recorre TODA la vista de agregados
   * para pintarse. Sin esto, cada visita (y cada recarga) volvería a leerse el
   * estudio entero. Los porcentajes no cambian de un minuto a otro: cinco
   * minutos de retraso no se notan y ahorran el paseo.
   */
  private resultadosCache: { datos: ResultadosPublicos; ts: number } | null = null;
  private static readonly RESULTADOS_TTL_MS = 5 * 60 * 1000;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cartaNatalService: CartaNatalService,
    private readonly mailService: MailService,
  ) {}

  /* ── Alta (o corrección) de un participante ────────────────────────────── */
  async guardarParticipante(datos: DatosParticipante): Promise<ParticipanteVista> {
    const email = (datos.email ?? '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('Email no válido');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha_nacimiento ?? '')) {
      throw new BadRequestException('Fecha de nacimiento no válida');
    }
    if (!/^\d{2}:\d{2}$/.test(datos.hora_nacimiento ?? '')) {
      throw new BadRequestException('Hora de nacimiento no válida');
    }
    const pais = (datos.pais ?? '').trim();
    const region = (datos.region ?? '').trim();
    const lugar = (datos.lugar ?? '').trim();
    if (!pais || !lugar) {
      throw new BadRequestException('Falta el lugar de nacimiento');
    }

    const anterior = await this.buscarPorEmail(email);

    const { latitud, longitud, timezone, carta } = await this.calcularCarta(
      { ...datos, pais, region, lugar },
      anterior,
    );

    // Sin carta no hay estudio posible: la posición de cada planeta ES la
    // variable que se estudia. Si el geocoding falla, se avisa en lugar de
    // guardar a medias.
    if (!carta) {
      throw new BadRequestException(
        'No he podido localizar ese lugar de nacimiento. Revisa el país, la región y la ciudad.',
      );
    }

    const { signos, casas } = this.posicionesDe(carta);

    const fila = {
      email,
      fecha_nacimiento: datos.fecha_nacimiento,
      hora_nacimiento: datos.hora_nacimiento,
      pais,
      region,
      lugar,
      latitud,
      longitud,
      timezone,
      carta_natal_json: carta,
      signos,
      casas,
      user_id: datos.userId ?? null,
      updated_at: new Date().toISOString(),
    };

    const client = this.databaseService.getClient();
    let id: string;

    if (anterior) {
      const { error } = await client
        .from('estudio_participante')
        .update(fila)
        .eq('id', anterior.id);
      if (error) throw new BadRequestException(`No se ha podido guardar: ${error.message}`);
      id = anterior.id as string;
      // Si al corregir los datos cambia alguna posición, las respuestas ya dadas
      // tienen que viajar con ella: si no, quedarían contadas en el grupo de un
      // signo (o una casa) que ya no es el suyo.
      await this.resincronizarPosiciones(id, signos, casas);
    } else {
      const { data, error } = await client
        .from('estudio_participante')
        .insert(fila)
        .select('id')
        .single();
      if (error || !data) {
        throw new BadRequestException(`No se ha podido guardar: ${error?.message ?? 'error'}`);
      }
      id = data.id as string;
    }

    // La carta se acaba de recalcular: la copia en memoria se pone al día en el
    // acto (si corrigió su hora, las respuestas siguientes van a la posición nueva).
    this.posicionesEnMemoria.set(id, { signos, casas, ts: Date.now() });

    // El correo de gracias con su carta dibujada, SOLO en el alta.
    //
    // No se manda al corregir los datos: quien se equivoca con la hora y la
    // arregla dos veces no tiene por qué recibir tres correos iguales.
    //
    // Va sin await a propósito: dibujar el PNG y hablar con Gmail tarda, y quien
    // acaba de pulsar «Continuar» está esperando su cuestionario. Si el correo
    // falla, se queda escrito en el log y el alta sigue siendo válida — nunca al
    // contrario.
    if (!anterior) {
      void this.enviarGraciasConCarta(email, carta);
    }

    return {
      id,
      email,
      signos,
      casas,
      respuestas: await this.getRespuestas(id),
      datos: {
        fecha_nacimiento: datos.fecha_nacimiento,
        hora_nacimiento: datos.hora_nacimiento,
        pais,
        region,
        lugar,
      },
    };
  }

  /* ── Consulta de un participante (para prerrellenar lo ya respondido) ──── */
  async getParticipante(id: string): Promise<ParticipanteVista> {
    const { data, error } = await this.databaseService.getClient()
      .from('estudio_participante')
      .select('id, email, signos, casas, fecha_nacimiento, hora_nacimiento, pais, region, lugar')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) throw new NotFoundException('Participante no encontrado');

    return {
      id: data.id as string,
      email: data.email as string,
      signos: (data.signos ?? {}) as Record<string, string>,
      casas: (data.casas ?? {}) as Record<string, number>,
      respuestas: await this.getRespuestas(id),
      datos: {
        fecha_nacimiento: String(data.fecha_nacimiento ?? '').slice(0, 10),
        hora_nacimiento: String(data.hora_nacimiento ?? '').slice(0, 5),
        pais: (data.pais as string) ?? '',
        region: (data.region as string) ?? '',
        lugar: (data.lugar as string) ?? '',
      },
    };
  }

  /* ── Guardar una respuesta (Sí/No) ─────────────────────────────────────── */
  async guardarRespuesta(
    participanteId: string,
    planeta: string,
    eje: Eje,
    preguntaId: string,
    respuesta: boolean,
  ): Promise<{ success: boolean }> {
    if (!participanteId || !planeta || !preguntaId) {
      throw new BadRequestException('Faltan datos de la respuesta');
    }
    if (!EJES.includes(eje)) {
      throw new BadRequestException('Eje no válido: solo signo o casa');
    }
    if (typeof respuesta !== 'boolean') {
      throw new BadRequestException('La respuesta debe ser Sí o No');
    }

    // La posición NO viaja desde el navegador: se lee de la carta guardada. Así
    // nadie puede colocar su respuesta en el grupo de otro signo o casa.
    const posicion = await this.posicionDe(participanteId, planeta, eje);
    if (!posicion) {
      throw new BadRequestException('Ese planeta no tiene esa posición en la carta del participante');
    }

    const { error } = await this.databaseService.getClient()
      .from('estudio_respuesta')
      .upsert(
        {
          participante_id: participanteId,
          planeta,
          eje,
          posicion,
          pregunta_id: preguntaId,
          respuesta,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'participante_id,planeta,pregunta_id' },
      );
    if (error) throw new BadRequestException(`No se ha podido guardar la respuesta: ${error.message}`);
    return { success: true };
  }

  /* ── Estadísticas de un participante ───────────────────────────────────── */
  /**
   * Para cada pregunta que ha respondido, cuánta gente con SU MISMO planeta en
   * SU MISMA posición ha respondido que sí. Es el resultado que se le enseña al
   * terminar («las personas con tu Mercurio en Aries respondieron un 90% que sí»).
   */
  async getEstadisticas(participanteId: string): Promise<{
    participante: ParticipanteVista;
    items: ItemEstadistica[];
    participantesTotales: number;
  }> {
    const participante = await this.getParticipante(participanteId);
    const client = this.databaseService.getClient();

    const planetas = [...new Set(participante.respuestas.map((r) => r.planeta))];
    // Una sola consulta a la vista para todos los planetas del participante; el
    // cruce fino (eje + posición + pregunta) se hace aquí en memoria: son decenas
    // de filas.
    const { data: stats } = planetas.length
      ? await client
          .from('estudio_stats')
          .select('planeta, eje, posicion, pregunta_id, total, si')
          .in('planeta', planetas)
      : { data: [] as any[] };

    const clave = (planeta: string, eje: string, posicion: string, pregunta: string) =>
      `${planeta}|${eje}|${posicion}|${pregunta}`;
    const mapa = new Map<string, { total: number; si: number }>();
    for (const s of (stats ?? []) as any[]) {
      mapa.set(clave(s.planeta, s.eje, s.posicion, s.pregunta_id), {
        total: Number(s.total) || 0,
        si: Number(s.si) || 0,
      });
    }

    const items: ItemEstadistica[] = participante.respuestas.map((r) => {
      const agg = mapa.get(clave(r.planeta, r.eje, r.posicion, r.preguntaId)) ?? { total: 0, si: 0 };
      return {
        planeta: r.planeta,
        eje: r.eje,
        posicion: r.posicion,
        preguntaId: r.preguntaId,
        respuesta: r.respuesta,
        total: agg.total,
        si: agg.si,
        porcentajeSi: agg.total > 0 ? Math.round((agg.si / agg.total) * 100) : 0,
      };
    });

    const { count } = await client
      .from('estudio_participante')
      .select('id', { count: 'exact', head: true });

    return { participante, items, participantesTotales: count ?? 0 };
  }

  /* ── Resultados públicos (página /estudio/estadisticas) ──────────────────── */

  /**
   * El estudio entero, en totales: por cada arquetipo y cada posición, qué
   * porcentaje de «sí» han dado de media las personas que lo tienen ahí.
   *
   * No sale pregunta a pregunta a propósito (eso es ruido y además dejaría ver
   * qué contesta la gente a cada cosa): se suman los síes y las respuestas de
   * todas las preguntas del bloque y se divide. Sumar y dividir —en vez de
   * promediar porcentajes— hace que una pregunta con mucha muestra pese lo que
   * le toca y no lo mismo que una con tres respuestas.
   *
   * Es público: son datos agregados, que es exactamente lo que se le prometió a
   * quien participa («los resultados se publican siempre en conjunto»).
   */
  async getResultadosPublicos(): Promise<ResultadosPublicos> {
    const cache = this.resultadosCache;
    if (cache && Date.now() - cache.ts < EstudioService.RESULTADOS_TTL_MS) {
      return cache.datos;
    }

    const filas = await this.traerTodo(
      'estudio_stats',
      'planeta, eje, posicion, pregunta_id, total, si',
    );

    const acum = new Map<string, { planeta: string; eje: Eje; posicion: string; si: number; total: number; preguntas: number; personas: number }>();
    for (const f of filas) {
      const planeta = f.planeta as string;
      const eje = ((f.eje as Eje) ?? 'signo') as Eje;
      const posicion = String(f.posicion ?? '');
      const total = Number(f.total) || 0;
      const si = Number(f.si) || 0;
      const clave = `${planeta}|${eje}|${posicion}`;
      const g = acum.get(clave) ?? { planeta, eje, posicion, si: 0, total: 0, preguntas: 0, personas: 0 };
      g.si += si;
      g.total += total;
      g.preguntas += 1;
      // Cuánta gente hay en el grupo: la pregunta más contestada del bloque (no
      // la suma, que contaría a la misma persona una vez por pregunta).
      g.personas = Math.max(g.personas, total);
      acum.set(clave, g);
    }

    const grupos: GrupoPublico[] = [...acum.values()]
      .map((g) => ({
        planeta: g.planeta,
        eje: g.eje,
        posicion: g.posicion,
        preguntas: g.preguntas,
        respuestas: g.total,
        personas: g.personas,
        porcentajeSi: g.total > 0 ? Math.round((g.si / g.total) * 100) : 0,
      }))
      .sort((a, b) => a.planeta.localeCompare(b.planeta) || a.eje.localeCompare(b.eje));

    const { count } = await this.databaseService.getClient()
      .from('estudio_participante')
      .select('id', { count: 'exact', head: true });

    const datos: ResultadosPublicos = { grupos, participantesTotales: count ?? 0 };
    this.resultadosCache = { datos, ts: Date.now() };
    return datos;
  }

  /* ── Panel de administración ──────────────────────────────────────────────
   * Dos listados sin filtro: quién ha participado y cómo van los resultados. El
   * cruce fino se hace en memoria (son decenas o cientos de filas) para no
   * pedirle a PostgREST agrupaciones que no sabe hacer. */

  /** Todos los participantes, del más reciente al más antiguo, con su recuento. */
  async getAdminParticipantes(): Promise<{
    participantes: {
      id: string;
      email: string;
      creado: string;
      actualizado: string;
      nacimiento: { fecha: string; hora: string; lugar: string };
      signos: Record<string, string>;
      respuestas: number;
      /** Tenía sesión abierta al participar. */
      conCuenta: boolean;
    }[];
    totales: { participantes: number; respuestas: number; conRespuestas: number; ultimos7dias: number };
  }> {
    const filas = await this.traerTodo(
      'estudio_participante',
      'id, email, created_at, updated_at, fecha_nacimiento, hora_nacimiento, pais, region, lugar, signos, user_id',
      { columna: 'created_at', ascendente: false },
    );
    const respuestas = await this.traerTodo('estudio_respuesta', 'participante_id');

    const porParticipante = new Map<string, number>();
    for (const r of respuestas) {
      const k = r.participante_id as string;
      porParticipante.set(k, (porParticipante.get(k) ?? 0) + 1);
    }

    const haceUnaSemana = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const participantes = filas.map((p) => ({
      id: p.id as string,
      email: (p.email as string) ?? '',
      creado: String(p.created_at ?? ''),
      actualizado: String(p.updated_at ?? ''),
      nacimiento: {
        fecha: String(p.fecha_nacimiento ?? '').slice(0, 10),
        hora: String(p.hora_nacimiento ?? '').slice(0, 5),
        lugar: [p.lugar, p.region, p.pais].filter(Boolean).join(', '),
      },
      signos: (p.signos ?? {}) as Record<string, string>,
      respuestas: porParticipante.get(p.id as string) ?? 0,
      conCuenta: !!p.user_id,
    }));

    return {
      participantes,
      totales: {
        participantes: participantes.length,
        respuestas: respuestas.length,
        conRespuestas: participantes.filter((p) => p.respuestas > 0).length,
        ultimos7dias: participantes.filter(
          (p) => p.creado && new Date(p.creado).getTime() >= haceUnaSemana,
        ).length,
      },
    };
  }

  /** El agregado entero: cada (planeta, eje, posición, pregunta) con su % de sí. */
  async getAdminResultados(): Promise<{ items: ItemEstadistica[] }> {
    const data = await this.traerTodo('estudio_stats', 'planeta, eje, posicion, pregunta_id, total, si');

    const items: ItemEstadistica[] = data
      .map((s) => {
        const total = Number(s.total) || 0;
        const si = Number(s.si) || 0;
        return {
          planeta: s.planeta as string,
          eje: (s.eje as Eje) ?? 'signo',
          posicion: String(s.posicion ?? ''),
          preguntaId: s.pregunta_id as string,
          // En el agregado no hay «su» respuesta: el campo se conserva para
          // compartir tipo con las estadísticas del participante.
          respuesta: si * 2 >= total,
          total,
          si,
          porcentajeSi: total > 0 ? Math.round((si / total) * 100) : 0,
        };
      })
      .sort((a, b) => b.total - a.total || a.planeta.localeCompare(b.planeta));

    return { items };
  }

  /* ─────────────────────────── Interno ─────────────────────────── */

  /**
   * Dibuja la carta y manda el correo de gracias.
   *
   * Todo va dentro de un try: ni un fallo del dibujo ni uno de Gmail pueden
   * tumbar un alta que ya está guardada. Lo que sí hace es DEJARLO ESCRITO en el
   * log —con el email delante— para que se pueda ver qué correos han salido y
   * cuáles no sin tener que adivinarlo.
   */
  private async enviarGraciasConCarta(email: string, carta: CartaNatal): Promise<void> {
    try {
      const png = cartaPng(carta);
      const salio = await this.mailService.enviarGraciasEstudio(email, {
        cartaPng: png,
        precio: { ahora: PRECIO_AHORA, antes: PRECIO_ANTES },
      });
      console.log(
        salio
          ? `[estudio] correo de gracias ENVIADO a ${email} (carta de ${Math.round(png.length / 1024)} KB)`
          : `[estudio] correo de gracias NO ENVIADO a ${email} — revisa EMAIL_USER / EMAIL_PASS`,
      );
    } catch (err: unknown) {
      console.error(
        `[estudio] NO se ha podido mandar el correo de gracias a ${email}:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  /**
   * Todas las filas de una tabla o vista, de mil en mil.
   *
   * PostgREST devuelve como mucho 1.000 filas por petición y NO avisa de que ha
   * cortado: sin paginar, en cuanto el estudio pase de mil respuestas los
   * recuentos del panel empezarían a mentir por lo bajo sin que nadie lo note.
   */
  private async traerTodo(
    tabla: string,
    columnas: string,
    orden?: { columna: string; ascendente: boolean },
  ): Promise<Record<string, any>[]> {
    const client = this.databaseService.getClient();
    const PAGINA = 1000;
    const filas: Record<string, any>[] = [];
    for (let desde = 0; ; desde += PAGINA) {
      let q = client.from(tabla).select(columnas).range(desde, desde + PAGINA - 1);
      if (orden) q = q.order(orden.columna, { ascending: orden.ascendente });
      const { data, error } = await q;
      if (error) throw new BadRequestException(`No se ha podido leer ${tabla}: ${error.message}`);
      const lote = (data ?? []) as unknown as Record<string, any>[];
      filas.push(...lote);
      if (lote.length < PAGINA) return filas;
    }
  }

  private async buscarPorEmail(email: string): Promise<Record<string, any> | null> {
    const { data } = await this.databaseService.getClient()
      .from('estudio_participante')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    return (data as Record<string, any>) ?? null;
  }

  /** Las posiciones de un participante: de memoria si están frescas, si no de la BD. */
  private async posicionesDeParticipante(participanteId: string): Promise<{
    signos: Record<string, string>;
    casas: Record<string, number>;
  }> {
    const enMemoria = this.posicionesEnMemoria.get(participanteId);
    if (enMemoria && Date.now() - enMemoria.ts < EstudioService.POSICIONES_TTL_MS) {
      return { signos: enMemoria.signos, casas: enMemoria.casas };
    }

    const { data, error } = await this.databaseService.getClient()
      .from('estudio_participante')
      .select('signos, casas')
      .eq('id', participanteId)
      .maybeSingle();
    if (error || !data) throw new NotFoundException('Participante no encontrado');

    const signos = (data.signos ?? {}) as Record<string, string>;
    const casas = (data.casas ?? {}) as Record<string, number>;
    this.posicionesEnMemoria.set(participanteId, { signos, casas, ts: Date.now() });
    return { signos, casas };
  }

  /** La posición de un planeta en un eje, leída de la carta guardada. */
  private async posicionDe(
    participanteId: string,
    planeta: string,
    eje: Eje,
  ): Promise<string | null> {
    const { signos, casas } = await this.posicionesDeParticipante(participanteId);

    if (eje === 'signo') {
      const signo = signos[planeta];
      return signo ? String(signo) : null;
    }
    const casa = casas[planeta];
    return casa != null ? String(casa) : null;
  }

  private async getRespuestas(participanteId: string): Promise<RespuestaEstudio[]> {
    const { data } = await this.databaseService.getClient()
      .from('estudio_respuesta')
      .select('planeta, eje, posicion, pregunta_id, respuesta')
      .eq('participante_id', participanteId);
    return ((data ?? []) as any[]).map((r) => ({
      planeta: r.planeta as string,
      eje: (r.eje as Eje) ?? 'signo',
      posicion: String(r.posicion ?? ''),
      preguntaId: r.pregunta_id as string,
      respuesta: !!r.respuesta,
    }));
  }

  /** Reetiqueta las respuestas ya dadas con las posiciones de la carta recalculada. */
  private async resincronizarPosiciones(
    participanteId: string,
    signos: Record<string, string>,
    casas: Record<string, number>,
  ): Promise<void> {
    const client = this.databaseService.getClient();
    const pares: { eje: Eje; planeta: string; posicion: string }[] = [
      ...Object.entries(signos).map(([planeta, v]) => ({ eje: 'signo' as Eje, planeta, posicion: String(v) })),
      ...Object.entries(casas).map(([planeta, v]) => ({ eje: 'casa' as Eje, planeta, posicion: String(v) })),
    ];
    for (const { eje, planeta, posicion } of pares) {
      await client
        .from('estudio_respuesta')
        .update({ posicion })
        .eq('participante_id', participanteId)
        .eq('planeta', planeta)
        .eq('eje', eje)
        .neq('posicion', posicion);
    }
  }

  /** Los dos mapas del estudio: { sol: 'Leo', … } y { sol: 5, … }. */
  private posicionesDe(carta: CartaNatal): {
    signos: Record<string, string>;
    casas: Record<string, number>;
  } {
    const signos: Record<string, string> = {};
    const casas: Record<string, number> = {};
    for (const p of carta.planetas) {
      const key = p.planeta as CuerpoKey;
      const signo = ZODIACO[p.signoIdx];
      if (signo) signos[key] = signo;
      // El Ascendente no tiene casa: ES la cúspide de la casa 1.
      if (key !== 'ascendente' && p.casa >= 1 && p.casa <= 12) casas[key] = p.casa;
    }
    return { signos, casas };
  }

  /** Geocoding + zona horaria + cálculo de la carta. Si el lugar no ha cambiado
   *  respecto a lo guardado y Nominatim falla, se reutilizan sus coordenadas. */
  private async calcularCarta(
    datos: DatosParticipante,
    anterior: Record<string, any> | null,
  ): Promise<{
    latitud: number | null;
    longitud: number | null;
    timezone: string | null;
    carta: CartaNatal | null;
  }> {
    let latitud: number | null = null;
    let longitud: number | null = null;
    let timezone: string | null = null;
    let carta: CartaNatal | null = null;

    try {
      const geo = await this.cartaNatalService.geocode(datos.lugar, datos.region, datos.pais);
      if (geo) {
        latitud = geo.lat;
        longitud = geo.lng;
        timezone = this.cartaNatalService.getTimezone(geo.lat, geo.lng);
      } else if (
        anterior?.latitud != null && anterior?.longitud != null && anterior?.timezone &&
        (anterior.lugar ?? '') === datos.lugar &&
        (anterior.region ?? '') === datos.region &&
        (anterior.pais ?? '') === datos.pais
      ) {
        latitud = Number(anterior.latitud);
        longitud = Number(anterior.longitud);
        timezone = anterior.timezone as string;
      }

      if (latitud != null && longitud != null && timezone) {
        const utc = this.cartaNatalService.localToUtc(
          datos.fecha_nacimiento,
          datos.hora_nacimiento,
          timezone,
        );
        if (utc) carta = this.cartaNatalService.calcular(utc, { lat: latitud, lng: longitud, timezone });
      }
    } catch (err: unknown) {
      console.warn('[estudio] error calculando la carta:', err instanceof Error ? err.message : err);
    }

    return { latitud, longitud, timezone, carta };
  }
}
