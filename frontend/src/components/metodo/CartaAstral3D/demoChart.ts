import type { CartaNatal } from "./types";

export const cartaDemo: CartaNatal = {
  ascendente: 315,
  cusps: [315, 345, 15, 45, 75, 105, 135, 165, 195, 225, 255, 285],
  planetas: [
    { planeta: "sol",        grado: 38,  signoIdx: 1,  casa: 5  },
    { planeta: "luna",       grado: 282, signoIdx: 9,  casa: 10 },
    { planeta: "mercurio",   grado: 30,  signoIdx: 1,  casa: 4  },
    { planeta: "venus",      grado: 45,  signoIdx: 1,  casa: 5  },
    { planeta: "marte",      grado: 222, signoIdx: 7,  casa: 9  },
    { planeta: "jupiter",    grado: 165, signoIdx: 5,  casa: 7  },
    { planeta: "saturno",    grado: 228, signoIdx: 7,  casa: 9  },
    { planeta: "urano",      grado: 274, signoIdx: 9,  casa: 11 },
    { planeta: "neptuno",    grado: 308, signoIdx: 10, casa: 12 },
    { planeta: "pluton",     grado: 268, signoIdx: 8,  casa: 11 },
    { planeta: "quiron",     grado: 348, signoIdx: 11, casa: 1  },
    { planeta: "nodoNorte",  grado: 158, signoIdx: 5,  casa: 7  },
    { planeta: "nodoSur",    grado: 338, signoIdx: 11, casa: 1  },
  ],
  aspectos: [
    { a: "sol",      b: "luna",    tipo: "trigono"    },
    { a: "sol",      b: "marte",   tipo: "oposicion"  },
    { a: "sol",      b: "saturno", tipo: "oposicion"  },
    { a: "luna",     b: "venus",   tipo: "trigono"    },
    { a: "venus",    b: "jupiter", tipo: "trigono"    },
    { a: "marte",    b: "saturno", tipo: "conjuncion" },
    { a: "jupiter",  b: "neptuno", tipo: "cuadratura" },
    { a: "mercurio", b: "pluton",  tipo: "trigono"    },
    { a: "saturno",  b: "neptuno", tipo: "cuadratura" },
    { a: "urano",    b: "pluton",  tipo: "conjuncion" },
    { a: "luna",     b: "marte",   tipo: "cuadratura" },
  ],
};
