export const ZODIAC_SIGNS = [
  { name: "Aries",       symbol: "♈" },
  { name: "Tauro",       symbol: "♉" },
  { name: "Géminis",     symbol: "♊" },
  { name: "Cáncer",      symbol: "♋" },
  { name: "Leo",         symbol: "♌" },
  { name: "Virgo",       symbol: "♍" },
  { name: "Libra",       symbol: "♎" },
  { name: "Escorpio",    symbol: "♏" },
  { name: "Sagitario",   symbol: "♐" },
  { name: "Capricornio", symbol: "♑" },
  { name: "Acuario",     symbol: "♒" },
  { name: "Piscis",      symbol: "♓" },
];

export const CASAS = Array.from({ length: 12 }, (_, i) => i + 1);

export type CuerpoKey =
  | "ascendente"
  | "sol"        | "luna"      | "mercurio"  | "venus"   | "marte"
  | "jupiter"    | "saturno"   | "urano"     | "neptuno" | "pluton"
  | "quiron"     | "nodoNorte" | "nodoSur";

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
  { key: "nodoNorte",  label: "Nodo Norte", symbol: "☊", color: "#7BB8E0", conCasa: true  },
  { key: "nodoSur",    label: "Nodo Sur",   symbol: "☋", color: "#C8806A", conCasa: true  },
];

export const cuerpoByKey = (key: string): Cuerpo | undefined =>
  CUERPOS.find((c) => c.key === key);
