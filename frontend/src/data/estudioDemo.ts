/* ─────────────────────────────────────────────────────────────────────────────
 *  VISTA DE EJEMPLO de los resultados del estudio.
 *
 *  Sirve para ver cómo queda la pantalla de estadísticas sin haber respondido
 *  nada y sin que la base de datos tenga muestra todavía. Se entra a mano:
 *
 *      /estudio/resultados?demo
 *
 *  Nadie llega ahí por accidente, y la pantalla se marca como ejemplo para que
 *  no se confunda con datos reales. Cuando el estudio tenga muestra de verdad,
 *  este fichero se puede borrar entero (y su `if` en EstudioResultados).
 *
 *  Los textos de las preguntas son los REALES: se sacan del cuestionario. Lo
 *  único inventado son los porcentajes, y se generan de forma determinista a
 *  partir del id de cada pregunta —no al azar— para que la pantalla se vea
 *  siempre igual y se pueda comparar un cambio de diseño con el anterior.
 * ───────────────────────────────────────────────────────────────────────────── */

import { CUERPOS, type CuerpoKey } from "../components/metodo/astrologiaData";
import { preguntasDe } from "./estudioPreguntas";
import type { EstadisticasEstudio, ItemEstadistica } from "./estudioApi";

/** Una carta de ejemplo, con sus dos ejes. */
const SIGNOS: Record<string, string> = {
  ascendente: "Virgo",
  sol: "Leo",
  luna: "Escorpio",
  mercurio: "Cáncer",
  venus: "Virgo",
  marte: "Géminis",
  jupiter: "Sagitario",
  saturno: "Capricornio",
  urano: "Acuario",
  neptuno: "Capricornio",
  pluton: "Escorpio",
  quiron: "Leo",
  lilith: "Aries",
  nodoNorte: "Tauro",
  nodoSur: "Escorpio",
};

const CASAS: Record<string, number> = {
  sol: 5, luna: 8, mercurio: 4, venus: 6, marte: 3,
  jupiter: 9, saturno: 10, urano: 11, neptuno: 10, pluton: 8,
  quiron: 5, lilith: 1, nodoNorte: 2, nodoSur: 8,
};

/** Número estable entre 0 y 1 a partir de un texto (mismo id → mismo número). */
function semilla(texto: string): number {
  let h = 0;
  for (let i = 0; i < texto.length; i++) h = (h * 31 + texto.charCodeAt(i)) % 100000;
  return h / 100000;
}

export function estadisticasDeEjemplo(): EstadisticasEstudio {
  const items: ItemEstadistica[] = [];

  for (const c of CUERPOS) {
    const signo = SIGNOS[c.key];
    const casa = CASAS[c.key];

    const deSigno = preguntasDe(c.key as CuerpoKey, "signo", signo)
      .map((p) => ({ p, eje: "signo" as const, posicion: String(signo) }));
    const vistos = new Set(deSigno.map((x) => x.p.texto));
    const deCasa = preguntasDe(c.key as CuerpoKey, "casa", casa)
      .filter((p) => !vistos.has(p.texto))
      .map((p) => ({ p, eje: "casa" as const, posicion: String(casa) }));

    for (const { p, eje, posicion } of [...deSigno, ...deCasa]) {
      const s = semilla(p.id);
      // Muestras de entre 6 y 40 personas, y porcentajes con algo de relieve:
      // ni todo al 50% (aburrido) ni todo al 95% (increíble).
      const total = 6 + Math.floor(s * 34);
      const porcentaje = 25 + Math.floor(semilla(p.id + "%") * 65);
      const si = Math.round((total * porcentaje) / 100);
      items.push({
        planeta: c.key,
        eje,
        posicion,
        preguntaId: p.id,
        // Su respuesta acompaña a la mayoría en dos de cada tres preguntas.
        respuesta: semilla(p.id + "yo") < (porcentaje >= 50 ? 0.72 : 0.34),
        total,
        si,
        porcentajeSi: total > 0 ? Math.round((si / total) * 100) : 0,
      });
    }
  }

  return {
    participante: {
      id: "ejemplo",
      email: "ejemplo@correo.com",
      signos: SIGNOS,
      casas: CASAS,
      respuestas: items.map((i) => ({
        planeta: i.planeta,
        eje: i.eje,
        posicion: i.posicion,
        preguntaId: i.preguntaId,
        respuesta: i.respuesta,
      })),
      datos: {
        fecha_nacimiento: "1994-08-12",
        hora_nacimiento: "04:35",
        pais: "España",
        region: "Comunidad de Madrid",
        lugar: "Madrid",
      },
    },
    items,
    participantesTotales: 214,
  };
}
