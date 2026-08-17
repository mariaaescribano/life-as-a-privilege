// ─────────────────────────────────────────────────────────────────────────
// LA RUEDA DE LAS EMOCIONES · el dibujo
//
// Un SVG generado a partir de `RUEDA_EMOCIONES`: nada está dibujado a mano, así
// que si añades o quitas una emoción en los datos, la rueda se recoloca sola.
//
//   · Los 6 sectores valen 60° cada uno (la básica va en el centro).
//   · Dentro de un sector, sus secundarias se reparten esos 60° a partes
//     iguales — por eso los trozos de Asco salen más anchos que los de Ira.
//   · El anillo exterior parte cada secundaria entre sus hijas.
//
// El texto de los dos anillos va RADIAL (de dentro hacia fuera, como en la
// rueda clásica) y se le da la vuelta en la mitad izquierda para que nunca se
// lea del revés. El de las básicas va horizontal, que es lo más legible.
//
// Todo el sector es pulsable (path + palabra): al pulsar, `onSelect` con la
// emoción, su nivel, su básica y el camino desde el centro.
// ─────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import {
  RUEDA_EMOCIONES,
  type EmocionBasica,
  type EmocionElegida,
  type EmocionRueda,
  type NivelEmocion,
} from "../../hardCoded/metodo/ruedaEmociones";

const CX = 500;
const CY = 500;
/** Radios de las tres coronas. */
const R_CENTRO = 170;
const R_MEDIO = 338;
const R_BORDE = 488;

const SECTOR = 360 / RUEDA_EMOCIONES.length; // 60°
/** La primera básica (Ira) queda centrada ARRIBA; Felicidad cae abajo. */
const INICIO = -SECTOR / 2;

/** Punto de la circunferencia: los grados se cuentan desde arriba, en el
 *  sentido de las agujas del reloj (0 = las doce). */
function punto(r: number, grados: number): [number, number] {
  const a = ((grados - 90) * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

/** Trozo de corona circular (o cuña, si empieza en el centro). */
function trozo(r0: number, r1: number, a0: number, a1: number): string {
  const [x0, y0] = punto(r1, a0);
  const [x1, y1] = punto(r1, a1);
  const grande = a1 - a0 > 180 ? 1 : 0;
  if (r0 <= 0) {
    return `M ${CX} ${CY} L ${x0} ${y0} A ${r1} ${r1} 0 ${grande} 1 ${x1} ${y1} Z`;
  }
  const [x2, y2] = punto(r0, a1);
  const [x3, y3] = punto(r0, a0);
  return [
    `M ${x0} ${y0}`,
    `A ${r1} ${r1} 0 ${grande} 1 ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${r0} ${r0} 0 ${grande} 0 ${x3} ${y3}`,
    "Z",
  ].join(" ");
}

/** Tamaño de letra que hace caber la palabra en el hueco que tiene (las hay de
 *  catorce letras, «INSIGNIFICANTE», y el anillo no da para todas por igual). */
function fontQueCabe(texto: string, hueco: number, base: number): number {
  const ancho = texto.length * base * 0.58;
  return ancho <= hueco ? base : Math.max(9, (hueco / ancho) * base);
}

/** Un trozo de la rueda ya resuelto: su forma, su color y su palabra. */
interface Pieza {
  id: string;
  d: string;
  color: string;
  /** Ángulo medio del trozo (para colocar la palabra). */
  medio: number;
  elegida: EmocionElegida;
  nivel: NivelEmocion;
}

export function RuedaEmocionesSvg({
  onSelect,
  tinta,
  papel,
}: {
  onSelect: (e: EmocionElegida) => void;
  /** Color de las líneas y de las letras (la tinta de psicología). */
  tinta: string;
  /** Color del halo de las letras, para que se lean sobre el pastel. */
  papel: string;
}) {
  const [encima, setEncima] = useState<string | null>(null);

  // ── Se resuelven las tres coronas de una pasada ──
  const piezas: Pieza[] = [];
  RUEDA_EMOCIONES.forEach((basica: EmocionBasica, i) => {
    const a0 = INICIO + i * SECTOR;
    const a1 = a0 + SECTOR;

    piezas.push({
      id: basica.key,
      d: trozo(0, R_CENTRO, a0, a1),
      color: basica.color,
      medio: (a0 + a1) / 2,
      nivel: 1,
      elegida: { emocion: basica, nivel: 1, basica, camino: [basica.nombre] },
    });

    const hijas = basica.hijas;
    const paso = SECTOR / Math.max(hijas.length, 1);
    hijas.forEach((hija: EmocionRueda, j) => {
      const b0 = a0 + j * paso;
      const b1 = b0 + paso;
      piezas.push({
        id: `${basica.key}-${hija.key}`,
        d: trozo(R_CENTRO, R_MEDIO, b0, b1),
        color: basica.colorMedio,
        medio: (b0 + b1) / 2,
        nivel: 2,
        elegida: {
          emocion: hija,
          nivel: 2,
          basica,
          camino: [basica.nombre, hija.nombre],
        },
      });

      const nietas = hija.hijas ?? [];
      const paso2 = paso / Math.max(nietas.length, 1);
      nietas.forEach((nieta: EmocionRueda, k) => {
        const c0 = b0 + k * paso2;
        const c1 = c0 + paso2;
        piezas.push({
          id: `${basica.key}-${hija.key}-${nieta.key}`,
          d: trozo(R_MEDIO, R_BORDE, c0, c1),
          color: basica.colorClaro,
          medio: (c0 + c1) / 2,
          nivel: 3,
          elegida: {
            emocion: nieta,
            nivel: 3,
            basica,
            camino: [basica.nombre, hija.nombre, nieta.nombre],
          },
        });
      });
    });
  });

  const HALO = `0 0 3px ${papel}`;

  return (
      <svg viewBox="0 0 1000 1000" width="100%" height="auto" role="group"
           aria-label="Rueda de las emociones" style={{ display: "block", overflow: "visible" }}>
        {piezas.map((p) => {
          const activo = encima === p.id;
          const nombre = p.elegida.emocion.nombre.toUpperCase();

          // Dónde y cómo va la palabra: horizontal en el centro, radial en los
          // dos anillos (y del revés en la mitad izquierda, para poder leerla).
          const radial = p.nivel > 1;
          const rTexto = p.nivel === 1 ? 112 : p.nivel === 2 ? (R_CENTRO + R_MEDIO) / 2 : (R_MEDIO + R_BORDE) / 2;
          const hueco = p.nivel === 1 ? 132 : p.nivel === 2 ? R_MEDIO - R_CENTRO - 26 : R_BORDE - R_MEDIO - 24;
          const font = fontQueCabe(nombre, hueco, p.nivel === 1 ? 21 : p.nivel === 2 ? 17.5 : 15.5);
          const vuelta = radial && p.medio > 180 && p.medio < 360;
          const [tx, ty] = punto(rTexto, p.medio);

          return (
            <g key={p.id}
               onClick={() => onSelect(p.elegida)}
               onMouseEnter={() => setEncima(p.id)}
               onMouseLeave={() => setEncima((k) => (k === p.id ? null : k))}
               style={{ cursor: "pointer" }}
               role="button"
               tabIndex={0}
               aria-label={p.elegida.emocion.nombre}
               onKeyDown={(e: React.KeyboardEvent) => {
                 if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(p.elegida); }
               }}>
              <path
                d={p.d}
                fill={p.color}
                stroke={tinta}
                strokeWidth={p.nivel === 1 ? 2.6 : 2}
                style={{
                  transition: "filter 0.18s ease, opacity 0.18s ease",
                  filter: activo ? "brightness(1.09)" : undefined,
                }}
              />
              {/* La palabra no intercepta el ratón: manda el sector de debajo. */}
              {radial ? (
                <text
                  transform={`translate(${CX},${CY}) rotate(${vuelta ? p.medio + 90 : p.medio - 90})`}
                  x={vuelta ? -rTexto : rTexto}
                  y={0}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={tinta}
                  fontSize={font}
                  fontWeight={activo ? 700 : 600}
                  letterSpacing="0.4"
                  pointerEvents="none"
                  style={{ fontFamily: "'EB Garamond', serif", textShadow: HALO }}
                >
                  {nombre}
                </text>
              ) : (
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={tinta}
                  fontSize={font}
                  fontWeight={700}
                  letterSpacing="1.2"
                  pointerEvents="none"
                  style={{ fontFamily: "'EB Garamond', serif", textShadow: HALO }}
                >
                  {nombre}
                </text>
              )}
            </g>
          );
        })}
      </svg>
  );
}
