// Fechas del panel de administración: SIEMPRE día/mes/año (04/11/2026), sea cual
// sea el idioma del navegador. Los <input type="date"> las enseñan según el
// navegador (en uno en inglés, mes/día), así que donde se TECLEA una fecha se usa
// un campo de texto y estas dos funciones la pasan de ida y vuelta a 'YYYY-MM-DD'.

const dos = (n: number) => String(n).padStart(2, "0");

/** 'YYYY-MM-DD' (o una marca de tiempo ISO) → '04/11/2026'. null si no hay fecha válida. */
export function fechaDMA(valor?: string | null): string | null {
  if (!valor) return null;
  // Una fecha sin hora se lee tal cual: pasarla por Date la movería un día según la zona.
  const suelta = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
  if (suelta) return `${suelta[3]}/${suelta[2]}/${suelta[1]}`;
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return null;
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Lo que se va tecleando → '04/11/2026' con las barras puestas solas (solo dígitos, máx. 8). */
export function mascaraDMA(texto: string): string {
  const d = texto.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** '04/11/2026' → '2026-11-04'. null si no es una fecha real. */
export function dmaAIso(texto: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto.trim());
  if (!m) return null;
  const [d, mes, a] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const f = new Date(Date.UTC(a, mes - 1, d));
  if (f.getUTCFullYear() !== a || f.getUTCMonth() !== mes - 1 || f.getUTCDate() !== d) return null;
  return `${a}-${dos(mes)}-${dos(d)}`;
}
