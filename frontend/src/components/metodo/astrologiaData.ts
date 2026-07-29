// Los signos NO llevan símbolo: sus caracteres (♈♉♊…) tienen versión emoji y
// los sistemas los pintaban morados. Cada signo se dibuja como icono, por su
// nombre → components/metodo/signosIconos.ts (<GlifoSigno nombre="…" />).
export const ZODIAC_SIGNS = [
  { name: "Aries" },
  { name: "Tauro" },
  { name: "Géminis" },
  { name: "Cáncer" },
  { name: "Leo" },
  { name: "Virgo" },
  { name: "Libra" },
  { name: "Escorpio" },
  { name: "Sagitario" },
  { name: "Capricornio" },
  { name: "Acuario" },
  { name: "Piscis" },
];

export const CASAS = Array.from({ length: 12 }, (_, i) => i + 1);

export type CuerpoKey =
  | "ascendente"
  | "sol"        | "luna"      | "mercurio"  | "venus"   | "marte"
  | "jupiter"    | "saturno"   | "urano"     | "neptuno" | "pluton"
  | "quiron"     | "lilith"    | "nodoNorte" | "nodoSur";

export interface Cuerpo {
  key: CuerpoKey;
  label: string;
  symbol: string;
  color: string;
  conCasa: boolean;
}

export const CUERPOS: Cuerpo[] = [
  { key: "ascendente", label: "Ascendente", symbol: "↑", color: "#feffe4", conCasa: false },
  { key: "sol",        label: "Sol",        symbol: "☉", color: "#FFD97D", conCasa: true  },
  { key: "luna",       label: "Luna",       symbol: "☽", color: "#C8C8E8", conCasa: true  },
  { key: "mercurio",   label: "Mercurio",   symbol: "☿", color: "#A8B8C8", conCasa: true  },
  { key: "venus",      label: "Venus",      symbol: "♀", color: "#FFB8D0", conCasa: true  },
  { key: "marte",      label: "Marte",      symbol: "♂", color: "#FF7055", conCasa: true  },
  { key: "jupiter",    label: "Júpiter",    symbol: "♃", color: "#FFBA60", conCasa: true  },
  { key: "saturno",    label: "Saturno",    symbol: "♄", color: "#E0CC80", conCasa: true  },
  { key: "urano",      label: "Urano",      symbol: "♅", color: "#80EFD8", conCasa: true  },
  { key: "neptuno",    label: "Neptuno",    symbol: "♆", color: "#6090FF", conCasa: true  },
  { key: "pluton",     label: "Plutón",     symbol: "♇", color: "#B080E0", conCasa: true  },
  { key: "quiron",     label: "Quirón",     symbol: "⚷", color: "#A8324A", conCasa: true  },
  { key: "lilith",     label: "Lilith",     symbol: "⚸", color: "#8A5FA8", conCasa: true  },
  { key: "nodoNorte",  label: "Nodo Norte", symbol: "☊", color: "#7BB8E0", conCasa: true  },
  { key: "nodoSur",    label: "Nodo Sur",   symbol: "☋", color: "#C8806A", conCasa: true  },
];

export const cuerpoByKey = (key: string): Cuerpo | undefined =>
  CUERPOS.find((c) => c.key === key);

/* El JSONB `metodo_astrologia.data` mezcla varias cosas: los planetas elegidos
 * por el usuario (una entrada por CuerpoKey) y el progreso de lectura
 * (aspectosLeidos / casasLeidos). Las páginas del selector de planetas cargan
 * ese `data` y lo reguardan con spread; para que NO arrastren ni pisen las
 * claves de progreso, filtramos a solo las claves de planeta al cargar. */
export function soloClavesPlaneta<V = unknown>(
  data: Record<string, unknown> | null | undefined,
): Partial<Record<CuerpoKey, V>> {
  const out: Partial<Record<CuerpoKey, V>> = {};
  if (!data) return out;
  for (const c of CUERPOS) {
    if (data[c.key]) out[c.key] = data[c.key] as V;
  }
  return out;
}
