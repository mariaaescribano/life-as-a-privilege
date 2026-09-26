import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';

/** Lo que el front puede apuntar. Cualquier otra cosa se descarta. */
export const TIPOS = [
  'mapa',          // /elMetodo, la presentación del recorrido de pago
  'portada',       // /disciplina/:d
  'presentacion',  // /d/:d
  'ilustraciones', // la galería (general o de una disciplina)
  'ilustracion',   // un cómic concreto abierto en la galería
  'cursos',        // la lista de cursos de una disciplina
  'curso',         // un curso abierto
  'leccion',       // una lección de un curso
  'recursos',      // /recursos/:moduloId
  'herramienta',   // herbario, alimentos, calculadora, células…
  'test',          // test de doshas, tests de MTC
  'libros',        // /libros
  'libro',         // descarga de un libro
] as const;

export const DISCIPLINAS = [
  'astrologia', 'psicologia', 'ayurveda', 'medicinachina',
  'fisiologia', 'nutricion', 'cabala', 'cultura', 'fitoterapia',
] as const;

// Una visita = aperturas separadas por más de esto. Recargar la página o ir y
// volver dentro de una misma lectura no cuenta dos veces.
const HUECO_ENTRE_VISITAS_MS = 30 * 60 * 1000;

export type ActividadInput = {
  recurso?: unknown;
  tipo?: unknown;
  disciplina?: unknown;
  titulo?: unknown;
};

@Injectable()
export class ActividadService {
  constructor(private readonly databaseService: DatabaseService) {}

  /** Limpia lo que llega del navegador. null = no se apunta. */
  private limpiar(body: ActividadInput) {
    const recurso = typeof body?.recurso === 'string' ? body.recurso.trim() : '';
    const tipo = typeof body?.tipo === 'string' ? body.tipo : '';
    if (!recurso.startsWith('/') || recurso.length > 300) return null;
    if (!(TIPOS as readonly string[]).includes(tipo)) return null;
    const disciplina =
      typeof body?.disciplina === 'string' && (DISCIPLINAS as readonly string[]).includes(body.disciplina)
        ? body.disciplina
        : null;
    const titulo =
      typeof body?.titulo === 'string' && body.titulo.trim() ? body.titulo.trim().slice(0, 200) : null;
    return { recurso, tipo, disciplina, titulo };
  }

  async registrar(userId: string, body: ActividadInput): Promise<void> {
    const d = this.limpiar(body);
    if (!d) return;
    const db = this.databaseService.getClient();
    const ahora = new Date();

    const { data: previa } = await db
      .from('actividad_recurso')
      .select('veces, ultima_vez, titulo')
      .eq('user_id', userId)
      .eq('recurso', d.recurso)
      .maybeSingle();

    const fila: Record<string, unknown> = {
      user_id: userId,
      recurso: d.recurso,
      tipo: d.tipo,
      disciplina: d.disciplina,
      titulo: d.titulo ?? (previa as any)?.titulo ?? null,
      ultima_vez: ahora.toISOString(),
    };
    if (previa) {
      const hace = ahora.getTime() - new Date((previa as any).ultima_vez).getTime();
      const veces = Number((previa as any).veces) || 1;
      fila.veces = hace > HUECO_ENTRE_VISITAS_MS ? veces + 1 : veces;
    } else {
      fila.veces = 1;
      fila.primera_vez = ahora.toISOString();
    }

    const { error } = await db
      .from('actividad_recurso')
      .upsert(fila, { onConflict: 'user_id,recurso' });
    if (error) console.error('Error apuntando actividad_recurso:', error);
  }

  /** Todo lo que ha abierto una persona, lo más reciente primero, y cuánto
   *  pesa cada disciplina (en visitas) para saber qué mandarle. */
  async deUsuario(userId: string) {
    const { data, error } = await this.databaseService.getClient()
      .from('actividad_recurso')
      .select('recurso, tipo, disciplina, titulo, veces, primera_vez, ultima_vez')
      .eq('user_id', userId)
      .order('ultima_vez', { ascending: false });
    const filas = error || !data ? [] : (data as any[]);
    const porDisciplina: Record<string, number> = {};
    for (const f of filas) {
      if (!f.disciplina) continue;
      porDisciplina[f.disciplina] = (porDisciplina[f.disciplina] ?? 0) + (Number(f.veces) || 1);
    }
    return { filas, porDisciplina };
  }
}
