// ─────────────────────────────────────────────────────────────────────────
// La RUEDA de la carta natal dibujada en un canvas 2D, para la portada del PDF.
//
// Por qué no se reutiliza CartaAstral3D: eso es three.js (WebGL) y vive en otra
// página; sacarle una foto desde aquí no es fiable. Esto la vuelve a dibujar,
// pero usando las MISMAS piezas para que salga la misma carta:
//   · gradoAVisualRad  → el reparto de grados por casa (Placidus «igualado»)
//   · SIGNO_TRAZOS     → los signos dibujados a trazo (nada de caracteres ♈)
//   · COLOR_ASPECTO    → el color de cada tipo de aspecto
//
// Los planetas SÍ van con su símbolo (☉ ☽ ♀…): esos se ven bien y el canvas los
// rasteriza tal cual antes de entrar en el PDF.
// ─────────────────────────────────────────────────────────────────────────
import { CUERPOS } from "../astrologiaData";
import { SIGNO_TRAZOS, SIGNOS_ORDEN } from "../signosIconos";
import { COLOR_ASPECTO, gradoAVisualRad, type CartaNatal } from "../CartaAstral3D/types";

/** Fuentes con los símbolos de planetas (las mismas que usa el resto de la app). */
const FUENTE_SIMBOLOS =
  '"Segoe UI Symbol", "Noto Sans Symbols2", "Apple Symbols", "Segoe UI Historic", serif';
const FUENTE_SERIF = "'EB Garamond', Garamond, Georgia, serif";

/** Punto del canvas para un ángulo de carta (math angle) y un radio. */
const punto = (cx: number, cy: number, ang: number, r: number) => ({
  x: cx + Math.cos(ang) * r,
  y: cy - Math.sin(ang) * r,
});

/**
 * Separa los planetas que caen casi encima (conjunciones): si no, sus símbolos
 * se solapan y no se lee ninguno. Solo se mueve el SÍMBOLO — la marca del grado
 * exacto y las líneas de aspecto siguen en su ángulo real.
 */
function separar(angulos: { key: string; ang: number }[], minSep: number) {
  const orden = [...angulos].sort((a, b) => a.ang - b.ang);
  for (let vuelta = 0; vuelta < 4; vuelta++) {
    let movido = false;
    for (let i = 0; i < orden.length; i++) {
      const a = orden[i];
      const b = orden[(i + 1) % orden.length];
      let d = b.ang - a.ang;
      if (i === orden.length - 1) d += Math.PI * 2; // par que cierra el círculo
      if (d < minSep) {
        const empuje = (minSep - d) / 2;
        a.ang -= empuje;
        b.ang += empuje;
        movido = true;
      }
    }
    if (!movido) break;
  }
  return new Map(orden.map((o) => [o.key, o.ang]));
}

/**
 * Dibuja la carta completa centrada en el canvas, sobre lo que ya haya pintado
 * (la foto del cielo). `size` es el lado del cuadrado que ocupa la rueda.
 */
export function dibujarRuedaCarta(
  ctx: CanvasRenderingContext2D,
  carta: CartaNatal,
  cx: number,
  cy: number,
  size: number,
) {
  const cusps = carta.cusps ?? [];
  if (cusps.length < 12) return;

  const R = size / 2;
  const rZodiacoExt = R;
  const rZodiacoInt = R * 0.855;
  const rCasasInt = R * 0.70;
  const rPlanetas = R * 0.60;
  const rMarcaFuera = rCasasInt;
  const rMarcaDentro = R * 0.665;
  const rAspectos = R * 0.505;

  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // ── Disco central: oscurece la foto para que se lean los aspectos ──
  const velo = ctx.createRadialGradient(cx, cy, 0, cx, cy, rCasasInt);
  velo.addColorStop(0, "rgba(4,7,20,0.86)");
  velo.addColorStop(0.75, "rgba(4,7,20,0.78)");
  velo.addColorStop(1, "rgba(4,7,20,0.55)");
  ctx.fillStyle = velo;
  ctx.beginPath();
  ctx.arc(cx, cy, rCasasInt, 0, Math.PI * 2);
  ctx.fill();

  // Anillo del zodíaco, un poco velado también (los signos van encima).
  ctx.fillStyle = "rgba(6,10,26,0.45)";
  ctx.beginPath();
  ctx.arc(cx, cy, rZodiacoExt, 0, Math.PI * 2);
  ctx.arc(cx, cy, rCasasInt, 0, Math.PI * 2, true);
  ctx.fill();

  // ── Círculos ──
  const circulo = (r: number, color: string, ancho: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = ancho;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  };
  circulo(rZodiacoExt, "rgba(255,255,255,0.62)", size * 0.0022);
  circulo(rZodiacoInt, "rgba(255,255,255,0.42)", size * 0.0014);
  circulo(rCasasInt, "rgba(255,255,255,0.5)", size * 0.0018);
  circulo(rAspectos, "rgba(255,255,255,0.16)", size * 0.001);

  // ── Divisiones de signo + su glifo dibujado ──
  const inicioSigno: number[] = [];
  for (let i = 0; i < 12; i++) inicioSigno.push(gradoAVisualRad(i * 30, cusps));

  for (let i = 0; i < 12; i++) {
    const a = inicioSigno[i];
    const p1 = punto(cx, cy, a, rZodiacoInt);
    const p2 = punto(cx, cy, a, rZodiacoExt);
    ctx.strokeStyle = "rgba(255,255,255,0.34)";
    ctx.lineWidth = size * 0.0012;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  const ladoGlifo = size * 0.042;
  for (let i = 0; i < 12; i++) {
    const a1 = inicioSigno[i];
    let a2 = inicioSigno[(i + 1) % 12];
    if (a2 <= a1) a2 += Math.PI * 2;
    const medio = (a1 + a2) / 2;
    const r = (rZodiacoInt + rZodiacoExt) / 2;
    const p = punto(cx, cy, medio, r);

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(-medio + Math.PI / 2); // tangente al anillo, como en la carta 3D
    const escala = ladoGlifo / 24;
    ctx.scale(escala, escala);
    ctx.lineWidth = (size * 0.0026) / escala;
    ctx.strokeStyle = "rgba(255,255,255,0.92)";
    ctx.translate(-12, -12);
    for (const d of SIGNO_TRAZOS[SIGNOS_ORDEN[i]] ?? []) ctx.stroke(new Path2D(d));
    ctx.restore();
  }

  // ── Casas: las cúspides caen en π + h·π/6 por construcción ──
  for (let h = 0; h < 12; h++) {
    const a = Math.PI + h * (Math.PI / 6);
    const angular = h === 0 || h === 3 || h === 6 || h === 9; // AC, IC, DC, MC
    const p1 = punto(cx, cy, a, angular ? 0 : rCasasInt);
    const p2 = punto(cx, cy, a, rCasasInt + (rZodiacoInt - rCasasInt));
    ctx.strokeStyle = angular ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)";
    ctx.lineWidth = angular ? size * 0.0016 : size * 0.001;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  ctx.font = `500 ${Math.round(size * 0.026)}px ${FUENTE_SERIF}`;
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let h = 0; h < 12; h++) {
    const a = Math.PI + (h + 0.5) * (Math.PI / 6);
    const p = punto(cx, cy, a, (rCasasInt + rZodiacoInt) / 2);
    ctx.fillText(String(h + 1), p.x, p.y);
  }

  // ── Ángulos reales de cada planeta presente ──
  const presentes = CUERPOS.map((c) => {
    const pos = carta.planetas?.find((p) => p.planeta === c.key);
    return pos ? { cuerpo: c, grado: pos.grado } : null;
  }).filter((x): x is { cuerpo: (typeof CUERPOS)[number]; grado: number } => x !== null);

  const angReal = new Map(presentes.map((p) => [p.cuerpo.key, gradoAVisualRad(p.grado, cusps)]));

  // ── Líneas de aspecto (en el ángulo REAL, no en el separado) ──
  for (const asp of carta.aspectos ?? []) {
    const a1 = angReal.get(asp.a);
    const a2 = angReal.get(asp.b);
    if (a1 == null || a2 == null) continue;
    const p1 = punto(cx, cy, a1, rAspectos);
    const p2 = punto(cx, cy, a2, rAspectos);
    ctx.strokeStyle = COLOR_ASPECTO[asp.tipo] ?? "rgba(255,255,255,0.5)";
    ctx.globalAlpha = 0.72;
    ctx.lineWidth = size * 0.0016;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // ── Planetas: marca en su grado exacto + símbolo separado si se amontonan ──
  const angSimbolo = separar(
    presentes.map((p) => ({ key: p.cuerpo.key, ang: angReal.get(p.cuerpo.key)! })),
    (size * 0.052) / rPlanetas, // separación mínima en radianes al radio del símbolo
  );

  ctx.font = `${Math.round(size * 0.044)}px ${FUENTE_SIMBOLOS}`;
  for (const { cuerpo } of presentes) {
    const real = angReal.get(cuerpo.key)!;
    const suave = angSimbolo.get(cuerpo.key) ?? real;

    // Marca del grado exacto, pegada al aro de las casas.
    const m1 = punto(cx, cy, real, rMarcaFuera);
    const m2 = punto(cx, cy, real, rMarcaDentro);
    ctx.strokeStyle = cuerpo.color;
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = size * 0.0018;
    ctx.beginPath();
    ctx.moveTo(m1.x, m1.y);
    ctx.lineTo(m2.x, m2.y);
    ctx.stroke();

    // Guía finita hasta el símbolo cuando se ha tenido que desplazar.
    const p = punto(cx, cy, suave, rPlanetas);
    if (Math.abs(suave - real) > 0.012) {
      const g1 = punto(cx, cy, real, rMarcaDentro);
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = size * 0.0009;
      ctx.beginPath();
      ctx.moveTo(g1.x, g1.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = cuerpo.color;
    ctx.shadowColor = cuerpo.color;
    ctx.shadowBlur = size * 0.012;
    ctx.fillText(cuerpo.symbol, p.x, p.y);
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}
