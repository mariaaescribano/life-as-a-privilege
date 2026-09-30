import React from "react";
import { useVistoConEspera } from "../../hooks/useVistoConEspera";

/**
 * Párrafo que se REVELA palabra a palabra: cada palabra sube unos píxeles, se
 * enfoca y se enciende en su turno, de izquierda a derecha, y el conjunto se
 * lee como una marea de luz, no como algo que hay que seguir deprisa.
 *
 *  · Arranca cuando el párrafo está metido en pantalla (margen -12%), sin espera
 *    de reloj: quien ya lo tiene delante lo ve al momento y quien tiene que
 *    bajar no se lo encuentra ya puesto.
 *  · El tiempo total se acota (≈1 s) aunque el párrafo sea largo: el hueco
 *    entre palabras se ajusta al nº de palabras, nunca hace esperar.
 *  · Es un <span>: se puede meter dentro de cualquier <Text>. El texto original
 *    queda accesible para lectores de pantalla y, con «reducir movimiento», se
 *    ve entero desde el principio.
 *  · Entiende **negritas** (las de los textos de Astrología): esas palabras
 *    salen en negrita y, si se pasa `colorNegrita`, con ese color.
 *  · Con saltos de línea (`\n`), cada línea arranca su propia cascada.
 *  · Red de seguridad de 15 s (la trae el hook): el texto nunca se pierde.
 */
export function PalabrasVivas({
  texto,
  /** Segundos extra antes de la primera palabra. */
  retraso = 0,
  /** Tope de duración de la cascada (s). */
  total = 1.1,
  /** Duración de la entrada de cada palabra (s). */
  duracion = 1,
  /** Desfase (s) entre líneas separadas por salto de línea: cada línea
   *  arranca su propia cascada en vez de esperar a que acabe la de arriba. */
  lineaPaso = 0.15,
  /** Color de las palabras en **negrita** (por defecto, el del texto). */
  colorNegrita,
  /** Sombra de las palabras en **negrita**. */
  sombraNegrita,
  cursivas = false,
}: {
  texto: string;
  retraso?: number;
  total?: number;
  duracion?: number;
  lineaPaso?: number;
  colorNegrita?: string;
  sombraNegrita?: string;
  /** Entiende también *cursivas* (un solo asterisco), como los textos de Ayurveda. */
  cursivas?: boolean;
}) {
  const visto = useVistoConEspera("0px 0px -12% 0px", 0);

  // Trozos de texto (palabras y espacios) marcados como negrita/cursiva o no.
  const trozos: { p: string; negrita: boolean; cursiva: boolean }[] = [];
  const corte = cursivas ? /(\*\*[^*]+\*\*|\*[^*]+\*)/g : /(\*\*[^*]+\*\*)/g;
  for (const seg of texto.split(corte)) {
    if (seg === "") continue;
    const negrita = seg.startsWith("**") && seg.endsWith("**") && seg.length > 4;
    const cursiva = cursivas && !negrita && seg.startsWith("*") && seg.endsWith("*") && seg.length > 2;
    const limpio = negrita ? seg.slice(2, -2) : cursiva ? seg.slice(1, -1) : seg;
    for (const p of limpio.split(/(\s+)/)) if (p !== "") trozos.push({ p, negrita, cursiva });
  }
  const textoLimpio = cursivas ? texto.replace(/\*/g, "") : texto.replace(/\*\*/g, "");

  // El paso se calcula con la línea MÁS LARGA (las líneas corren en paralelo).
  const lineas = textoLimpio.split("\n").map((l) => l.split(/\s+/).filter(Boolean).length);
  const paso = Math.min(0.045, total / Math.max(1, ...lineas));
  let linea = 0;
  let local = 0;

  return (
    <span ref={visto.ref} style={{ display: "inline" }}>
      <style>{`@media (prefers-reduced-motion: reduce){.pv-palabra{opacity:1!important;transform:none!important;filter:none!important;transition:none!important}}`}</style>
      <span aria-hidden>
        {trozos.map(({ p, negrita, cursiva }, k) => {
          if (/^\s+$/.test(p)) {
            const saltos = p.split("\n").length - 1;
            if (saltos) { linea += saltos; local = 0; }
            return p;
          }
          const i = local++;
          const d = retraso + linea * lineaPaso + i * paso;
          return (
            <span
              key={k}
              className="pv-palabra"
              style={{
                display: "inline-block",
                opacity: visto.visible ? 1 : 0,
                // Calma: la palabra casi no se mueve (5 px) y se desvela desde una
                // bruma suave, con una curva sin golpe de entrada. Cada palabra
                // tarda ~1 s y se solapa con la siguiente.
                transform: visto.visible ? "translateY(0)" : "translateY(5px)",
                filter: visto.visible ? "blur(0)" : "blur(3px)",
                transition: `opacity ${duracion}s cubic-bezier(0.4,0,0.2,1) ${d}s, transform ${duracion + 0.2}s cubic-bezier(0.25,0.8,0.25,1) ${d}s, filter ${duracion}s cubic-bezier(0.4,0,0.2,1) ${d}s`,
                ...(cursiva ? { fontStyle: "italic" } : {}),
                ...(negrita ? { fontWeight: 700, ...(colorNegrita ? { color: colorNegrita } : {}), ...(sombraNegrita ? { textShadow: sombraNegrita } : {}) } : {}),
              }}
            >
              {p}
            </span>
          );
        })}
      </span>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{textoLimpio}</span>
    </span>
  );
}

export default PalabrasVivas;
