// ─────────────────────────────────────────────────────────────────────────
// «Cuidar tu doṣha» — el vademécum personal que sale del test.
//
// Los consejos vienen escritos como «Nombre · explicación», así que el PDF los
// compone como un DICCIONARIO (nombre en negrita, explicación en redonda,
// sangría francesa y filete entre entradas) en vez de como una lista de la
// compra. Cada bloque abre con su antetítulo en versalitas y su intención en
// una línea, para que se pueda leer suelto meses después.
//
// La acuarela de la portada es la del doṣha concreto (vata/pitta/kapha), no la
// genérica: el documento se siente hecho para esa persona.
// ─────────────────────────────────────────────────────────────────────────
import { Taller } from "./pdf/atelier";
import { TEMA_AYURVEDA, COLOR_DOSHA, type Tema } from "./pdf/temas";
import type { DoshaRecs } from "../hardCoded/espacio/DoshaConsejos";

const ETIQUETA: Record<string, string> = { vata: "Vata", pitta: "Pitta", kapha: "Kapha" };
const ELEMENTOS: Record<string, string> = {
  vata: "aire y éter",
  pitta: "fuego y agua",
  kapha: "tierra y agua",
};
/** Cada doṣha tiene su acuarela propia en la web; el PDF la hereda. */
const ACUARELA: Record<string, string> = {
  vata: "/img/fondos/vata.webp",
  pitta: "/img/fondos/pitta.webp",
  kapha: "/img/fondos/kapha.webp",
};

const BLOQUES: { key: keyof DoshaRecs; titulo: string; intencion: string }[] = [
  {
    key: "alimentacion",
    titulo: "En la mesa",
    intencion: "Lo que enciende tu digestión y lo que te asienta, comida a comida.",
  },
  {
    key: "hierbas",
    titulo: "Plantas aliadas",
    intencion: "Las que la tradición asocia a tu constitución. Ninguna sustituye a un tratamiento.",
  },
  {
    key: "estiloDeVida",
    titulo: "En el día a día",
    intencion: "Los hábitos que sostienen tu equilibrio cuando la vida aprieta.",
  },
  {
    key: "evitar",
    titulo: "Lo que te desequilibra",
    intencion: "No es una lista de prohibiciones: es saber qué te está pasando factura.",
  },
];

export async function generateDoshaConsejosPdf(dosha: string, recs: DoshaRecs): Promise<void> {
  const clave = (dosha || "").toLowerCase();
  const etiqueta = ETIQUETA[clave] ?? (dosha.charAt(0).toUpperCase() + dosha.slice(1));
  const color = COLOR_DOSHA[clave] ?? TEMA_AYURVEDA.acento;

  // El tema de Ayurveda, teñido con el color del doṣha: mismo taller, otra voz.
  const tema: Tema = {
    ...TEMA_AYURVEDA,
    acento: color,
    acentoSuave: [
      Math.round(color[0] + (255 - color[0]) * 0.46),
      Math.round(color[1] + (255 - color[1]) * 0.46),
      Math.round(color[2] + (255 - color[2]) * 0.46),
    ],
    acuarela: ACUARELA[clave] ?? TEMA_AYURVEDA.acuarela,
  };

  const taller = await Taller.abrir(tema, { titulo: `Cuidar tu ${etiqueta}` });

  /* ── PORTADA ── */
  taller.portada({
    titulo: "Cuidar tu doṣha",
    subtitulo: `Ayurveda · ${etiqueta}`,
    nombre: etiqueta,
    pieLamina: ELEMENTOS[clave] ? `${ELEMENTOS[clave]}` : undefined,
    cierre: "Tu vademécum",
  });

  /* ── QUIÉN ES TU DOṢHA ── */
  taller.nuevaPagina();
  taller.capitulo(`Tu ${etiqueta}`);
  taller.parrafo(recs.descripcion, { capitular: true, tam: 11.5 });
  taller.espacio(3);
  taller.parrafo(
    "Lo que sigue no son reglas. Es un repertorio: coge dos o tres cosas, sostenlas unas semanas " +
      "y observa. El Ayurveda se mide en temporadas, no en días.",
    { cursiva: true, color: tema.apagado, tam: 10.5 },
  );

  /* ── LOS CUATRO BLOQUES ── */
  for (const bloque of BLOQUES) {
    const items = recs[bloque.key];
    if (!Array.isArray(items) || items.length === 0) continue;
    taller.capitulo(bloque.titulo, bloque.intencion);
    taller.glosario(items);
  }

  /* ── CIERRE ── */
  taller.cierre(
    "«Lo semejante aumenta lo semejante; lo opuesto equilibra.» " +
      "Toda la medicina ayurvédica cabe en esa frase: si algo te sobra, no le eches más.",
  );

  taller.guardar(`cuidar-mi-dosha-${clave || "ayurveda"}.pdf`);
}
