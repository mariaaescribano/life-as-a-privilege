// ─────────────────────────────────────────────────────────────────────────
// Red de seguridad tipográfica.
//
// La EB Garamond que va embebida en los PDF es un SUBCONJUNTO de 236 glifos:
// Latin-1 completo más la puntuación tipográfica. No trae ni «ṣ» ni «ā» (la
// transliteración del sánscrito que usamos en Ayurveda), ni «→», ni «✓», ni
// hebreo, ni emoji. Cuando le llega un carácter que no tiene, jsPDF NO avisa:
// simplemente no pinta nada, y «Doṣha Vata» sale como «Doha Vata».
//
// Eso da igual en un rótulo nuestro —lo escribimos bien y ya— pero NO en el
// texto que escribe la persona: si alguien pega una flecha, un emoji o un
// nombre con una diacrítica rara, se le come el carácter en medio de su frase.
//
// Por eso el taller no confía en nadie: intercepta cada texto antes de
// imprimirlo y sustituye lo que la fuente no sabe dibujar por su equivalente
// más cercano (quitando la diacrítica, o cambiando el símbolo por palabras).
// Lo que no tenga equivalente, se cae: mejor una frase limpia que un hueco.
// ─────────────────────────────────────────────────────────────────────────

/** Lo que la fuente embebida sí sabe pintar. */
const SOPORTADO = /[\t\n\r -~ -ÿ–—‘’‚“”„†‡•…‰‹›€™]/;

/** Símbolos frecuentes sin glifo, con su equivalente escrito. */
const EQUIVALENCIAS: Record<string, string> = {
  "→": "->", "←": "<-", "↑": "^", "↓": "v", "↔": "<->",
  "⇒": "=>", "⟶": "->",
  "✓": "-", "✔": "-", "✗": "x", "✘": "x", "☑": "[x]", "☐": "[ ]",
  "★": "*", "☆": "*", "♥": "<3", "•": "•",
  "≈": "~", "≤": "<=", "≥": ">=", "≠": "!=", "−": "-",
  " ": " ", " ": " ", " ": " ", "​": "",
  "…": "…",
};

const cache = new Map<string, string>();

/** Repara un carácter suelto. Devuelve "" si no hay nada que pintar. */
function repara(c: string): string {
  if (SOPORTADO.test(c)) return c;
  const equivalente = EQUIVALENCIAS[c];
  if (equivalente !== undefined) return equivalente;
  // Diacríticas: «ṣ» → «s», «ā» → «a». Se descompone y se tira el acento.
  const base = c.normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (base && base !== c) {
    const reparada = Array.from(base).map(repara).join("");
    if (reparada) return reparada;
  }
  return "";
}

/**
 * Deja un texto en condiciones de imprimirse con la fuente embebida.
 * Es idempotente y cachea: se llama en cada `doc.text`, así que tiene que ser
 * barato.
 */
export function seguro(texto: string): string {
  if (!texto) return texto;
  // Camino rápido: la inmensa mayoría de las cadenas están limpias.
  let limpio = true;
  for (const c of texto) {
    if (!SOPORTADO.test(c)) { limpio = false; break; }
  }
  if (limpio) return texto;

  const guardado = cache.get(texto);
  if (guardado !== undefined) return guardado;
  const resultado = Array.from(texto).map(repara).join("");
  if (cache.size < 4000) cache.set(texto, resultado);
  return resultado;
}

/**
 * Envuelve `text` y `splitTextToSize` de un documento para que TODO lo que se
 * imprima pase por `seguro()`. Se llama una sola vez, al abrir el taller.
 */
export function blindarFuente(doc: any): void {
  if (doc.__blindado) return;
  doc.__blindado = true;

  const textoOriginal = doc.text.bind(doc);
  doc.text = (t: unknown, ...resto: unknown[]) =>
    textoOriginal(
      Array.isArray(t) ? t.map((x) => seguro(String(x))) : seguro(String(t ?? "")),
      ...resto,
    );

  // Se blinda también el medidor: si no, parte las líneas contando caracteres
  // que luego no se pintan y los renglones quedan cortos.
  const partirOriginal = doc.splitTextToSize.bind(doc);
  doc.splitTextToSize = (t: unknown, ...resto: unknown[]) =>
    partirOriginal(seguro(String(t ?? "")), ...resto);
}
