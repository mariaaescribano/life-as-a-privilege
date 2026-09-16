/**
 * Los PROGRAMAS: la diapositiva y su podcast.
 *
 * Un programa es una pieza con dos caras de lo mismo: la parte que se MIRA
 * (las diapositivas, en orden) y la parte que se ESCUCHA (el podcast, un
 * enlace de YouTube pegado tal cual, igual que en los cursos).
 *
 * Van NUMERADOS y pertenecen a una disciplina: el número manda el orden dentro
 * de su disciplina (1, 2, 3...). No se desbloquean unos a otros — el orden
 * aconseja, no obliga.
 *
 * Esta lista es el ÍNDICE: están todos los títulos, y `diapositivas` y
 * `podcast` se van rellenando según se publica cada uno. Un programa sin
 * diapositivas y sin podcast sale en la web con sus dos botones apagados.
 *
 * Para publicar uno:
 *   1. `node scripts/pdf/programas.mjs` convierte el PDF y sube las fotos.
 *   2. Copia del resultado SOLO la lista de `diapositivas` y pégala en la
 *      entrada que ya existe aquí (no pegues la entrada entera: el número, la
 *      disciplina y el título ya están puestos).
 *   3. El `podcast`, cuando exista el vídeo de YouTube.
 */

export type Programa = {
  /** Trozo de la URL: /programas/<slug>. Sin tildes ni espacios. */
  slug: string;
  /** Orden dentro de su disciplina: 1, 2, 3... */
  numero: number;
  /** El `slug` de DISCIPLINAS_CURSO (data/disciplinasCurso.tsx): el mismo que
   *  usan las tarjetas de los cursos: "Astrología", "Psicología", "ayurveda",
   *  "medicinachina", "Fisiología", "nutricion", "Cábala", "Cultura". */
  disciplina: string;
  titulo: string;
  /** El título RESUMIDO, para el móvil. Los títulos de aquí son frases largas
   *  («Cuando la mente se protege del dolor: trauma complejo, disociación y
   *  EMDR») y en la cabecera de un móvil ocupaban cuatro líneas, dejando la
   *  diapositiva —que es a lo que se viene— arrinconada abajo. Si no se pone,
   *  en el móvil se usa el título entero. */
  tituloCorto?: string;
  /** Una línea de qué se cuenta aquí. Sale al desplegar el programa. */
  descripcion?: string;
  /** Portada de la tarjeta. Si falta, se usa la primera diapositiva. */
  portada?: string;
  /** Las diapositivas, en orden: URLs del bucket o rutas de /public.
   *  Vacío = todavía sin publicar (el botón sale apagado). */
  diapositivas: string[];
  /** El podcast: enlace de YouTube (o su ID). Vacío = todavía sin publicar. */
  podcast?: string;
};

export const programas: Programa[] = [
  // ── ASTROLOGÍA ─────────────────────────────────────────────────────────
  {
    slug: "origen-del-universo",
    numero: 1,
    disciplina: "Astrología",
    titulo: "El origen del universo según las distintas disciplinas",
    tituloCorto: "El origen del universo",
    diapositivas: [
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/01.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/02.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/03.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/04.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/05.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/06.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/07.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/08.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/09.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/10.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/11.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/12.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/13.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/14.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/15.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/16.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/17.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/18.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/19.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/20.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/21.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/22.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/23.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/24.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/25.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/origen-del-universo/26.webp",
    ],
    podcast: "https://www.youtube.com/watch?v=BG-3gfarR7k",
  },
  {
    slug: "historia-de-la-astrologia",
    numero: 2,
    disciplina: "Astrología",
    titulo: "Historia de la astrología",
    diapositivas: [
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/01.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/02.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/03.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/04.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/05.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/06.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/07.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/08.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/09.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/10.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/11.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/12.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/13.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/14.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/15.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/16.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/17.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/historia-de-la-astrologia/18.webp",
    ],
    podcast: "https://youtu.be/LAnS0uBiGGo",
  },
  {
    slug: "astrologia-y-psicologia-evolutiva-las-casas",
    numero: 3,
    disciplina: "Astrología",
    titulo: "Astrología y psicología evolutiva: explorando las casas",
    tituloCorto: "Las casas astrológicas",
    descripcion: "Las doce casas, una por una, leídas desde el desarrollo: qué área de la vida nombra cada una y cómo se fue construyendo.",
    diapositivas: [
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/01.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/02.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/03.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/04.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/05.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/06.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/07.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/08.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/09.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/10.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/11.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/12.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/13.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/14.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/15.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/16.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/17.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/18.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/19.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/20.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/21.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/22.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/23.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/24.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/25.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/26.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/27.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/28.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/29.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/30.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/31.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/32.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/33.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/34.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/35.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/36.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/37.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/38.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/39.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/40.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/astrologia-y-psicologia-evolutiva-las-casas/41.webp",
    ],
  },
  {
    slug: "signos-y-planetas",
    numero: 4,
    disciplina: "Astrología",
    titulo: "Signos y planetas: qué haces, cómo lo haces y por qué",
    tituloCorto: "Signos y planetas",
    descripcion: "Cada planeta con su signo al lado: el Sol y Leo, la Luna y Cáncer, Mercurio y Géminis… los diez planetas y los doce signos, emparejados.",
    diapositivas: [
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/01.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/02.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/03.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/04.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/05.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/06.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/07.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/08.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/09.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/10.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/11.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/12.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/13.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/14.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/15.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/16.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/17.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/18.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/19.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/20.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/21.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/22.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/23.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/signos-y-planetas/24.webp",
    ],
  },
  {
    slug: "aspectos-planetarios",
    numero: 5,
    disciplina: "Astrología",
    titulo: "Aspectos planetarios: ¿cómo se llevan las distintas partes de ti?",
    tituloCorto: "Aspectos planetarios",
    descripcion: "Qué es un aspecto y cómo se hablan entre sí los planetas: conjunción, oposición, cuadratura, trígono, sextil y quincuncio, y todos los aspectos del Sol, uno a uno.",
    diapositivas: [
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/01.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/02.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/03.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/04.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/05.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/06.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/07.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/08.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/09.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/10.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/11.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/12.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/13.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/14.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/15.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/16.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/17.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/18.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/19.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/20.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/21.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/22.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/aspectos-planetarios/23.webp",
    ],
  },
  {
    slug: "carta-astral-y-psicologia",
    numero: 6,
    disciplina: "Astrología",
    titulo: "Carta astral y psicología: ¿qué puede aportar realmente?",
    tituloCorto: "Carta astral y psicología",
    diapositivas: [
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/01.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/02.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/03.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/04.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/05.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/06.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/07.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/08.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/09.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/10.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/11.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/12.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/13.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/14.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/15.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/16.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/17.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/18.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/19.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/20.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/21.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/22.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/23.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/24.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/25.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/26.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/27.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/28.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/carta-astral-y-psicologia/29.webp",
    ],
  },

  // ── PSICOLOGÍA ─────────────────────────────────────────────────────────
  {
    slug: "heridas-de-la-infancia",
    numero: 1,
    disciplina: "Psicología",
    titulo: "Las heridas que nacen en la infancia: trauma, infancia y apego",
    tituloCorto: "Las heridas de la infancia",
    descripcion: "Del embarazo a los primeros años: cómo se forma el apego, qué deja huella antes de que haya palabras y por qué una herida no es una sentencia.",
    diapositivas: [
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/01.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/02.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/03.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/04.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/05.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/06.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/07.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/08.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/09.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/10.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/11.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/12.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/13.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/14.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/15.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/16.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/17.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/18.webp",
      "https://lrdenqkwfrrsvhcuqpyy.supabase.co/storage/v1/object/public/img/programas/heridas-de-la-infancia/19.webp",
    ],
  },
  {
    slug: "trauma-complejo-disociacion-y-emdr",
    numero: 2,
    disciplina: "Psicología",
    titulo: "Cuando la mente se protege del dolor: trauma complejo, disociación y EMDR",
    tituloCorto: "Trauma, disociación y EMDR",
    diapositivas: [],
  },
  {
    slug: "alexitimia-y-autonarracion",
    numero: 3,
    disciplina: "Psicología",
    titulo: "La historia que contamos sobre nosotros mismos: alexitimia y autonarración",
    tituloCorto: "Alexitimia y autonarración",
    diapositivas: [],
  },
  {
    slug: "ansiedad-y-ace",
    numero: 4,
    disciplina: "Psicología",
    titulo: "Cuando el cuerpo aprende a vivir en alerta: ansiedad y ACE",
    tituloCorto: "Ansiedad y ACE",
    diapositivas: [],
  },
  {
    slug: "el-transgeneracional",
    numero: 5,
    disciplina: "Psicología",
    titulo: "Lo que heredamos sin saberlo: el transgeneracional",
    tituloCorto: "El transgeneracional",
    diapositivas: [],
  },

  // ── HINDUISMO (AYURVEDA) ───────────────────────────────────────────────
  {
    slug: "hinduismo-vision-del-ser-humano",
    numero: 1,
    disciplina: "ayurveda",
    titulo: "El hinduismo y su visión del ser humano",
    tituloCorto: "El hinduismo",
    diapositivas: [],
  },
  {
    slug: "constituciones-ayurvedicas",
    numero: 2,
    disciplina: "ayurveda",
    titulo: "Las constituciones ayurvédicas: Vata, Pitta, Kapha",
    tituloCorto: "Vata, Pitta y Kapha",
    diapositivas: [],
  },
  {
    slug: "nutricion-ayurvedica-y-ciencia",
    numero: 3,
    disciplina: "ayurveda",
    titulo: "Nutrición y bienestar ayurvédico validado por la ciencia",
    tituloCorto: "Nutrición ayurvédica",
    diapositivas: [],
  },
  {
    slug: "pranayama-y-chakras",
    numero: 4,
    disciplina: "ayurveda",
    titulo: "Pranayama, chakras y su explicación neurocientífica: los beneficios de la respiración, teóricos y prácticos",
    tituloCorto: "Pranayama y chakras",
    diapositivas: [],
  },

  // ── MEDICINA CHINA ─────────────────────────────────────────────────────
  {
    slug: "taoismo-y-medicina-china",
    numero: 1,
    disciplina: "medicinachina",
    titulo: "El taoísmo y la medicina tradicional china",
    tituloCorto: "Taoísmo y medicina china",
    diapositivas: [],
  },
  {
    slug: "los-cinco-elementos",
    numero: 2,
    disciplina: "medicinachina",
    titulo: "Los cinco elementos, sus significados y sus constituciones",
    tituloCorto: "Los cinco elementos",
    diapositivas: [],
  },
  {
    slug: "alimentacion-como-medicina",
    numero: 3,
    disciplina: "medicinachina",
    titulo: "Alimentación como medicina",
    diapositivas: [],
  },
  {
    slug: "qigong",
    numero: 4,
    disciplina: "medicinachina",
    titulo: "Qigong",
    diapositivas: [],
  },

  // ── FISIOLOGÍA ─────────────────────────────────────────────────────────
  {
    slug: "particulas-y-estrellas",
    numero: 1,
    disciplina: "Fisiología",
    titulo: "Partículas, estrellas y de lo que estamos hechos: introducción a lo más pequeño e imprescindible de nosotros",
    tituloCorto: "Partículas y estrellas",
    diapositivas: [],
  },
  {
    slug: "las-celulas-y-sus-tipos",
    numero: 2,
    disciplina: "Fisiología",
    titulo: "Las células y sus magníficos tipos",
    tituloCorto: "Las células y sus tipos",
    diapositivas: [],
  },
  {
    slug: "hormonas-y-neurotransmisores",
    numero: 3,
    disciplina: "Fisiología",
    titulo: "Las hormonas y los neurotransmisores",
    diapositivas: [],
  },
  {
    slug: "los-organos",
    numero: 4,
    disciplina: "Fisiología",
    titulo: "Los órganos",
    diapositivas: [],
  },
  {
    slug: "sistemas-del-cuerpo",
    numero: 5,
    disciplina: "Fisiología",
    titulo: "Sistemas del cuerpo",
    diapositivas: [],
  },
  {
    slug: "el-cerebro-y-sus-partes",
    numero: 6,
    disciplina: "Fisiología",
    titulo: "Cerebro y sus partes",
    diapositivas: [],
  },
  {
    slug: "sistema-inmunitario",
    numero: 7,
    disciplina: "Fisiología",
    titulo: "Sistema inmunitario",
    diapositivas: [],
  },
  {
    slug: "metabolismo-epigenetica-y-envejecimiento",
    numero: 8,
    disciplina: "Fisiología",
    titulo: "Metabolismo, epigenética y envejecimiento: la Muerte no existe",
    tituloCorto: "Metabolismo y envejecimiento",
    diapositivas: [],
  },
  {
    slug: "neurociencia-de-la-respiracion",
    numero: 9,
    disciplina: "Fisiología",
    titulo: "Neurociencia de la respiración",
    diapositivas: [],
  },

  // ── NUTRICIÓN ──────────────────────────────────────────────────────────
  {
    slug: "las-calorias-no-existen",
    numero: 1,
    disciplina: "nutricion",
    titulo: "Introducción: las calorías no existen y los macronutrientes (incluye fibra y edulcorantes)",
    tituloCorto: "Las calorías no existen",
    diapositivas: [],
  },
  {
    slug: "colesterol-vitaminas-y-minerales",
    numero: 2,
    disciplina: "nutricion",
    titulo: "Colesterol, vitaminas y minerales (incluye fitoquímicos)",
    tituloCorto: "Vitaminas y minerales",
    diapositivas: [],
  },
  {
    slug: "las-drogas-y-su-efecto",
    numero: 3,
    disciplina: "nutricion",
    titulo: "Las drogas y su efecto en nosotros: el azúcar, el alcohol, los fármacos, el tabaco y la marihuana",
    tituloCorto: "Las drogas y su efecto",
    diapositivas: [],
  },
  {
    slug: "microbiota",
    numero: 4,
    disciplina: "nutricion",
    titulo: "Microbiota",
    diapositivas: [],
  },
  {
    slug: "plato-de-harvard",
    numero: 5,
    disciplina: "nutricion",
    titulo: "Plato de Harvard: comida procesada vs real",
    tituloCorto: "Plato de Harvard",
    diapositivas: [],
  },
  {
    slug: "ciclo-de-la-naturaleza",
    numero: 6,
    disciplina: "nutricion",
    titulo: "Ciclo de la naturaleza que nos da los alimentos",
    tituloCorto: "El ciclo de la naturaleza",
    diapositivas: [],
  },

  // ── CÁBALA ─────────────────────────────────────────────────────────────
  {
    slug: "cabala-historia-y-fundamentos",
    numero: 1,
    disciplina: "Cábala",
    titulo: "Historia, fundamentos e importancia (incluye Or y Kli, Tzimtzum, historia de la Cábala, los cuatro universos, el mal en la Cábala)",
    tituloCorto: "Historia y fundamentos",
    diapositivas: [],
  },
  {
    slug: "arbol-de-la-vida-las-diez-sefirot",
    numero: 2,
    disciplina: "Cábala",
    titulo: "Árbol de la Vida: las diez sefirot",
    tituloCorto: "Las diez sefirot",
    diapositivas: [],
  },
  {
    slug: "los-senderos",
    numero: 3,
    disciplina: "Cábala",
    titulo: "Los senderos",
    diapositivas: [],
  },

  // ── CULTURA ────────────────────────────────────────────────────────────
  // Una por cada Historia del recorrido, en el mismo orden en el que salen en
  // la rejilla (HISTORIAS_CULTURA, components/metodo/culturaHistorias.ts). Si
  // algun dia se anade una Historia mas, aqui va su programa.
  {
    slug: "historia-universal",
    numero: 1,
    disciplina: "Cultura",
    titulo: "Historia Universal",
    diapositivas: [],
  },
  {
    slug: "historia-de-las-religiones",
    numero: 2,
    disciplina: "Cultura",
    titulo: "Historia de las religiones",
    diapositivas: [],
  },
  {
    slug: "historia-de-la-filosofia",
    numero: 3,
    disciplina: "Cultura",
    titulo: "Historia de la filosofía",
    diapositivas: [],
  },
  {
    slug: "historia-de-la-ciencia",
    numero: 4,
    disciplina: "Cultura",
    titulo: "Historia de la ciencia",
    diapositivas: [],
  },
  {
    slug: "historia-de-la-medicina",
    numero: 5,
    disciplina: "Cultura",
    titulo: "Historia de la medicina",
    diapositivas: [],
  },
  {
    slug: "historia-del-arte-y-la-literatura",
    numero: 6,
    disciplina: "Cultura",
    titulo: "Historia del arte y la literatura",
    tituloCorto: "Arte y literatura",
    diapositivas: [],
  },
];

/** Los de una disciplina, ya ordenados por su número. */
export const programasDe = (disciplina: string): Programa[] =>
  programas.filter((p) => p.disciplina === disciplina).sort((a, b) => a.numero - b.numero);

export const programaPorSlug = (slug?: string): Programa | undefined =>
  programas.find((p) => p.slug === slug);

/** El siguiente de la misma disciplina (el de número mayor más cercano). */
export const programaSiguiente = (p: Programa): Programa | undefined =>
  programasDe(p.disciplina).find((o) => o.numero > p.numero);

/** El anterior de la misma disciplina. */
export const programaAnterior = (p: Programa): Programa | undefined => {
  const antes = programasDe(p.disciplina).filter((o) => o.numero < p.numero);
  return antes[antes.length - 1];
};

/** ¿Se puede ver ya? (tiene diapositivas subidas) */
export const tieneDiapositivas = (p: Programa): boolean => p.diapositivas.length > 0;

/** ¿Se puede escuchar ya? (tiene el vídeo de YouTube) */
export const tienePodcast = (p: Programa): boolean => !!p.podcast;
