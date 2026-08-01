import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { CartaNatalService } from '../metodoAstrologia/cartaNatal.service';
import type { CartaNatal, CuerpoKey } from '../metodoAstrologia/cartaNatal.types';

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
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cartaNatalService: CartaNatalService,
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

  /* ─────────────────────────── Interno ─────────────────────────── */

  private async buscarPorEmail(email: string): Promise<Record<string, any> | null> {
    const { data } = await this.databaseService.getClient()
      .from('estudio_participante')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    return (data as Record<string, any>) ?? null;
  }

  /** La posición de un planeta en un eje, leída de la carta guardada. */
  private async posicionDe(
    participanteId: string,
    planeta: string,
    eje: Eje,
  ): Promise<string | null> {
    const { data, error } = await this.databaseService.getClient()
      .from('estudio_participante')
      .select('signos, casas')
      .eq('id', participanteId)
      .maybeSingle();
    if (error || !data) throw new NotFoundException('Participante no encontrado');

    if (eje === 'signo') {
      const signo = ((data.signos ?? {}) as Record<string, string>)[planeta];
      return signo ? String(signo) : null;
    }
    const casa = ((data.casas ?? {}) as Record<string, number>)[planeta];
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
