// ─────────────────────────────────────────────────────────────────────────
// CONTENIDO · "Tu lengua" (diagnóstico de la lengua en Medicina China)
//
// La lengua se observa por CAPAS de información. Cada capa es una DIMENSIÓN con
// varias variantes; cada variante es una cajita ilustrada (foto de la lengua +
// nombre + qué sugiere). Es material PRÁCTICO: sirve para reconocer y observar,
// no para memorizar teoría.
//
// Se usa en dos páginas:
//   · MetodoTcmLengua      → muestra TODAS las dimensiones como cajitas (aprender a reconocer).
//   · MetodoTcmLenguaLeer  → el usuario elige la suya en las dimensiones `seleccionable`
//                            y recibe su lectura (se guarda en data.observarte).
//
// ✍️  EDITAR CONTENIDO: cambia nombre/lectura aquí. NO cambies las `key` (de
//     dimensión ni de opción) tras publicar: se guardan en metodo_tcm.data.observarte.
//
// 🖼️  ILUSTRACIONES: /public/recorrido/tcm/lengua/<src>.png (una por variante).
//     La página funciona aunque falten (marco vacío hasta que estén).
// ─────────────────────────────────────────────────────────────────────────

/** Clave estable de cada dimensión (capa de observación de la lengua). */
export type LenguaDim = "color" | "forma" | "movimiento" | "saburra" | "humedad" | "puntos";

export interface OpcionLengua {
  /** Clave estable (no cambiar tras publicar). */
  key: string;
  /** Nombre visible de la variante ("Pálida", "Con marcas de dientes"…). */
  nombre: string;
  /** Ilustración de esta lengua (/public/recorrido/tcm/lengua/…). */
  src: string;
  /** Qué sugiere en Medicina China (lectura práctica). */
  lectura: string;
  /** true en la variante sana / de referencia de la dimensión. */
  equilibrio?: boolean;
}

export interface DimensionLengua {
  dim: LenguaDim;
  titulo: string;         // "El color del cuerpo"
  subtitulo: string;      // qué refleja esa capa (una línea)
  /** Si true, aparece como selector en la herramienta "Lee tu lengua". */
  seleccionable?: boolean;
  opciones: OpcionLengua[];
}

const IMG = (n: string) => `/recorrido/tcm/lengua/${n}.png`;

export const LENGUA_DIMENSIONES: DimensionLengua[] = [
  // ── COLOR DEL CUERPO ──────────────────────────────────────────────────────
  {
    dim: "color",
    titulo: "El color del cuerpo",
    subtitulo: "Es lo más importante. Refleja la Sangre, el equilibrio Yin–Yang y los patrones de Calor y Frío.",
    seleccionable: true,
    opciones: [
      { key: "normal", nombre: "Rosada", src: IMG("color-normal"), equilibrio: true,
        lectura: "Un rojo pálido uniforme (rosado): es el color fisiológico. La Sangre nutre bien y el Yin y el Yang están equilibrados." },
      { key: "palida", nombre: "Pálida", src: IMG("color-palida"),
        lectura: "Deficiencia de Sangre (no llega suficiente para nutrirla) o de Yang (no hay calor para impulsarla). Si además está muy húmeda, apunta a deficiencia de Yang del Riñón." },
      { key: "roja", nombre: "Roja", src: IMG("color-roja"),
        lectura: "Calor. Si conserva saburra, es Calor Pleno (por exceso); si no tiene saburra, es Calor por Vacío, originado por una deficiencia de Yin." },
      { key: "roja-oscura", nombre: "Rojo oscuro", src: IMG("color-rojo-oscuro"),
        lectura: "Un Calor más intenso: exceso importante de Calor, o un Calor por deficiencia de Yin ya muy avanzado. El Fuego es un grado de Calor más seco e intenso." },
      { key: "purpura", nombre: "Púrpura", src: IMG("color-purpura"),
        lectura: "Estasis de Sangre: la circulación está bloqueada. Suele ser un proceso crónico. El tono puede ser muy sutil; cuanto más intenso, mayor el estancamiento." },
      { key: "azul-purpura", nombre: "Azul-púrpura", src: IMG("color-azul-purpura"),
        lectura: "Estancamiento producido por Frío: la Sangre y el Qi se ralentizan por falta de calor." },
    ],
  },

  // ── FORMA ─────────────────────────────────────────────────────────────────
  {
    dim: "forma",
    titulo: "La forma",
    subtitulo: "Habla de Plenitud (Lleno) o Deficiencia (Vacío). Su significado depende siempre del color.",
    seleccionable: true,
    opciones: [
      { key: "normal", nombre: "Proporcionada", src: IMG("forma-normal"), equilibrio: true,
        lectura: "Ni fina ni hinchada, sin grietas ni marcas: buena sustancia y Qi que circula bien." },
      { key: "fina", nombre: "Fina", src: IMG("forma-fina"),
        lectura: "Falta de sustancia: deficiencia de Sangre (si es pálida) o de Yin (si está pelada). Cuanto más fina, mayor la gravedad." },
      { key: "hinchada", nombre: "Hinchada", src: IMG("forma-hinchada"),
        lectura: "Acumulación de Humedad o Flema. Aunque su origen pueda ser una deficiencia de Qi del Bazo, la hinchazón es un patrón de exceso." },
      { key: "marcas", nombre: "Con marcas de dientes", src: IMG("forma-marcas"),
        lectura: "Deficiencia de Qi del Bazo. Suele acompañarse de lengua pálida y saburra blanca y fina." },
      { key: "agrietada", nombre: "Agrietada", src: IMG("forma-agrietada"),
        lectura: "En general, deficiencia de Yin. La localización orienta: una grieta central hacia la punta se asocia al Corazón (predisposición al estrés); las grietas laterales, a los Pulmones." },
    ],
  },

  // ── MOVIMIENTO ──────────────────────────────────────────────────────────────
  {
    dim: "movimiento",
    titulo: "El movimiento",
    subtitulo: "Cómo se mueve la lengua al sacarla. Orienta hacia deficiencias o hacia Viento Interno.",
    opciones: [
      { key: "normal", nombre: "Estable", src: IMG("mov-normal"), equilibrio: true,
        lectura: "La lengua sale firme y centrada, sin temblor ni desviación." },
      { key: "temblorosa", nombre: "Temblorosa", src: IMG("mov-temblorosa"),
        lectura: "Temblor rápido y de poca amplitud: deficiencia de Bazo y, en personas mayores, posible Viento Interno." },
      { key: "desviada", nombre: "Desviada", src: IMG("mov-desviada"),
        lectura: "Se desvía de la línea media: siempre indica Viento Interno. Frecuente tras un ictus; en persona sana, señal de alerta que merece valoración." },
      { key: "rigida", nombre: "Rígida", src: IMG("mov-rigida"),
        lectura: "Difícil de mover: se asocia a Viento Interno; puede verse en el ictus u otras alteraciones neurológicas importantes." },
    ],
  },

  // ── SABURRA (la capa lingual) ───────────────────────────────────────────────
  {
    dim: "saburra",
    titulo: "La saburra",
    subtitulo: "La capa que recubre la lengua. Refleja el Qi del Estómago y la presencia de factores patógenos.",
    seleccionable: true,
    opciones: [
      { key: "normal", nombre: "Blanca y fina", src: IMG("saburra-normal"), equilibrio: true,
        lectura: "Fina, blanca, con raíz y dejando ver el cuerpo por debajo: lo normal. El Qi del Estómago es fuerte." },
      { key: "blanca-gruesa", nombre: "Blanca y gruesa", src: IMG("saburra-blanca-gruesa"),
        lectura: "Presencia de Frío (o un proceso externo). El grosor indica que hay un factor patógeno acumulado." },
      { key: "amarilla", nombre: "Amarilla", src: IMG("saburra-amarilla"),
        lectura: "Calor. Si es gruesa y seca, Calor por exceso; si es fina o casi no hay, Calor por deficiencia de Yin." },
      { key: "grasosa", nombre: "Grasosa o pegajosa", src: IMG("saburra-grasosa"),
        lectura: "Humedad o Flema. Si además es viscosa o resbaladiza, apunta a Humedad-Calor." },
      { key: "seca", nombre: "Seca", src: IMG("saburra-seca"),
        lectura: "Calor que ha dañado los Fluidos Corporales, o un estado importante de sequedad." },
      { key: "gris-negra", nombre: "Gris o negra", src: IMG("saburra-gris-negra"),
        lectura: "Un patrón profundo o severo. Seca, se asocia a Calor extremo; húmeda o pegajosa, a Frío interno." },
      { key: "pelada", nombre: "Pelada o ausente", src: IMG("saburra-pelada"),
        lectura: "La lengua sin saburra (o la que ha perdido su raíz) indica deficiencia de Qi y/o Yin del Estómago." },
    ],
  },

  // ── HUMEDAD ─────────────────────────────────────────────────────────────────
  {
    dim: "humedad",
    titulo: "La humedad",
    subtitulo: "Refleja los Fluidos Corporales y el equilibrio Yin–Yang. Lo sano es una humedad ligera y uniforme.",
    seleccionable: true,
    opciones: [
      { key: "normal", nombre: "Húmeda ligera", src: IMG("humedad-normal"), equilibrio: true,
        lectura: "Humedad ligera y uniforme, ni seca ni mojada: los Fluidos Corporales son suficientes y están bien distribuidos." },
      { key: "seca", nombre: "Seca", src: IMG("humedad-seca"),
        lectura: "Calor o deficiencia de Yin: los Fluidos han disminuido y no mantienen la humedad normal." },
      { key: "muy-humeda", nombre: "Muy húmeda", src: IMG("humedad-muy-humeda"),
        lectura: "Frío o deficiencia de Yang: el organismo no transforma ni moviliza bien los líquidos y se acumulan." },
      { key: "lacada", nombre: "Brillante o «lacada»", src: IMG("humedad-lacada"),
        lectura: "Lisa y brillante como barnizada: colapso de Yin, un agotamiento profundo de los fluidos. Signo de gran importancia." },
    ],
  },

  // ── PUNTOS Y VENAS ──────────────────────────────────────────────────────────
  {
    dim: "puntos",
    titulo: "Puntos y venas",
    subtitulo: "Detalles finos: papilas alteradas en la superficie y las venas de debajo de la lengua.",
    opciones: [
      { key: "normal", nombre: "Sin puntos ni venas marcadas", src: IMG("puntos-normal"), equilibrio: true,
        lectura: "Superficie uniforme y venas sublinguales apenas visibles, ni dilatadas ni oscuras: lo normal." },
      { key: "puntos-rojos", nombre: "Puntos rojos", src: IMG("puntos-rojos"),
        lectura: "Papilas enrojecidas que sobresalen: siempre indican Calor. Su localización señala el órgano (p. ej., en el área del pecho, Calor tóxico en el Pulmón o la mama)." },
      { key: "vesiculas", nombre: "Vesículas blancas", src: IMG("puntos-vesiculas"),
        lectura: "Papilas que sobresalen con color blanco: suelen indicar Humedad." },
      { key: "venas", nombre: "Venas sublinguales púrpuras", src: IMG("puntos-venas"),
        lectura: "Bajo la lengua, venas oscuras o dilatadas: estasis de Sangre en fase temprana. Puede aparecer antes de que el resto de la lengua se vuelva púrpura." },
    ],
  },
];

// ── Mapa de las zonas de la lengua (dónde aparece el cambio importa) ─────────
export interface ZonaLengua { key: string; zona: string; organos: string; }
export const LENGUA_ZONAS: ZonaLengua[] = [
  { key: "punta", zona: "La punta", organos: "Corazón y Pulmón" },
  { key: "centro", zona: "El centro", organos: "Bazo y Estómago" },
  { key: "lados", zona: "Los laterales", organos: "Hígado y Vesícula Biliar" },
  { key: "raiz", zona: "La raíz (parte posterior)", organos: "Riñón, Vejiga e Intestinos" },
  { key: "pecho", zona: "El área del pecho (entre punta y centro)", organos: "Pulmón, Corazón y mama (en mujeres)" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
/** Dimensiones que el usuario elige en la herramienta "Lee tu lengua". */
export const DIMENSIONES_SELECCIONABLES = LENGUA_DIMENSIONES.filter((d) => d.seleccionable);

/** Clave con la que se guarda cada dimensión en data.observarte. */
export const lenguaObsKey = (dim: LenguaDim): string => `lengua-${dim}`;

/** Opción elegida por el usuario en una dimensión (o null si no ha elegido). */
export function opcionElegida(
  dim: LenguaDim,
  observarte: Partial<Record<string, string>> | undefined,
): OpcionLengua | null {
  const key = observarte?.[lenguaObsKey(dim)];
  if (!key) return null;
  const d = LENGUA_DIMENSIONES.find((x) => x.dim === dim);
  return d?.opciones.find((o) => o.key === key) ?? null;
}

/** ¿Ha elegido el usuario todas las dimensiones seleccionables de su lengua? */
export function lenguaCompleta(
  observarte: Partial<Record<string, string>> | undefined,
): boolean {
  return DIMENSIONES_SELECCIONABLES.every((d) => !!observarte?.[lenguaObsKey(d.dim)]);
}
