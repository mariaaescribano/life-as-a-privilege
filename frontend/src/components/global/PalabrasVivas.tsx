import React from "react";
import { useVistoConEspera } from "../../hooks/useVistoConEspera";

/**
 * Párrafo que se REVELA palabra a palabra: cada palabra sube unos píxeles, se
 * enfoca y se enciende en su turno, de izquierda a derecha, y el conjunto se
 * lee como si alguien lo fuera escribiendo con luz.
 *
 *  · Arranca cuando el párrafo está metido en pantalla (margen -12%), sin espera
 *    de reloj: quien ya lo tiene delante lo ve al momento y quien tiene que
 *    bajar no se lo encuentra ya puesto.
 *  · El tiempo total se acota (≈1,3 s) aunque el párrafo sea largo: el hueco
 *    entre palabras se ajusta al nº de palabras, nunca hace esperar.
 *  · Es un <span>: se puede meter dentro de cualquier <Text>. El texto original
 *    queda accesible para lectores de pantalla y, con «reducir movimiento», se
 *    ve entero desde el principio.
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
  /** Desfase (s) entre líneas separadas por salto de línea (`
`): cada línea
   *  arranca su propia cascada en vez de esperar a que acabe la de arriba. */
  lineaPaso = 0.15,
}: {
  lineaPaso?: number;
  duracion?: number;
  texto: string;
  retraso?: number;
  total?: number;
}) {
  const visto = useVistoConEspera("0px 0px -12% 0px", 0);
  const partes = texto.split(/(\s+)/);
  const palabras = partes.filter((p) => p !== "" && !/^\s+$/.test(p)).length;
  // El paso se calcula con la línea MÁS LARGA (las líneas corren en paralelo).
  const lineas = texto.split("\n").map((l) => l.split(/\s+/).filter(Boolean).length);
  const masLarga = Math.max(1, ...lineas);
  void palabras;
  const paso = Math.min(0.045, total / masLarga);
  let linea = 0;
  let local = 0;
  return (
    <span ref={visto.ref} style={{ display: "inline" }}>
      <style>{`@media (prefers-reduced-motion: reduce){.pv-palabra{opacity:1!important;transform:none!important;filter:none!important;transition:none!important}}`}</style>
      <span aria-hidden>
        {partes.map((p, k) => {
          if (p === "" || /^\s+$/.test(p)) {
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
                // tarda ~1 s y se solapa con la siguiente: se lee como una
                // marea de luz, no como algo que hay que seguir deprisa.
                transform: visto.visible ? "translateY(0)" : "translateY(5px)",
                filter: visto.visible ? "blur(0)" : "blur(3px)",
                transition: `opacity ${duracion}s cubic-bezier(0.4,0,0.2,1) ${d}s, transform ${duracion + 0.2}s cubic-bezier(0.25,0.8,0.25,1) ${d}s, filter ${duracion}s cubic-bezier(0.4,0,0.2,1) ${d}s`,
              }}
            >
              {p}
            </span>
          );
        })}
      </span>
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{texto}</span>
    </span>
  );
}

export default PalabrasVivas;
