import React, { useMemo } from "react";
import { IntroComicModal } from "./IntroComicModal";
import { ayurvedaBg, ayurvedaTxt } from "../../GlobalVariables";
import type { Chakra } from "../../hardCoded/metodo/chakras";

// ─────────────────────────────────────────────────────────────────────────
// ChakraComicModal — el cómic de UN chakra, a pantalla completa.
//
// No hay página por chakra: el texto de cada uno se lee AQUÍ, en cómic
// inmersivo, al pulsar su caja en el mapa. Al terminarlo, su caja se queda con
// la marquita de leído.
//
// Reutiliza el visor de siempre (IntroComicModal → ComicViewer) con el fondo de
// Hinduismo. Dos decisiones a propósito:
//
//   · La LETRA va en la tinta de Ayurveda, no en el color del chakra. El color
//     del chakra solo tiñe la luz que rodea a la ilustración (`luzFoto`): en
//     cuanto se usaba para el texto, la corona —que es luz pálida— dejaba de
//     leerse. Es la regla de la casa: <disc>Txt para la letra, el acento para
//     lo demás.
//   · Sin velo oscuro: la legibilidad la da el `textShadow` del color de fondo
//     de la disciplina. El «más oscurito» es solo de Medicina China.
//
// Las tres señas del chakra (dónde está, su elemento, su mantra) se inyectan
// como claves rápidas de la PRIMERA viñeta, así que el archivo de contenido no
// tiene que repetirlas dentro de las viñetas.
// ─────────────────────────────────────────────────────────────────────────

export function ChakraComicModal({
  chakra,
  onClose,
  onComplete,
}: {
  /** El chakra abierto, o null si no hay ninguno (el modal va cerrado). */
  chakra: Chakra | null;
  onClose: () => void;
  /** Se llama al TERMINAR el cómic (pasar de la última viñeta): el mapa lo usa
   *  para marcar el chakra como leído. */
  onComplete: (c: Chakra) => void;
}) {
  // Las claves solo en la primera viñeta: son la ficha del chakra, no de cada
  // viñeta. Si el contenido ya trae claves propias, se respetan.
  const vinetas = useMemo(() => {
    if (!chakra) return [];
    return chakra.vinetas.map((v, i) =>
      i === 0 && !v.claves?.length ? { ...v, claves: chakra.claves } : v,
    );
  }, [chakra]);

  if (!chakra) return null;

  return (
    <IntroComicModal
      // key con el chakra: al abrir otro, el visor se remonta desde su 1ª viñeta
      // (si no, se quedaría en la viñeta donde iba el anterior).
      key={chakra.key}
      isOpen
      vinetas={vinetas}
      onClose={onClose}
      onComplete={() => { onComplete(chakra); onClose(); }}
      themeColor={ayurvedaTxt}
      luzFoto={chakra.color}
      disciplinaBgImage="/img/fondos/hinduismo.webp"
      disciplinaBgColor={ayurvedaBg}
      textShadow={`0 0 6px ${ayurvedaBg}, 0 0 14px ${ayurvedaBg}, 0 0 26px ${ayurvedaBg}cc`}
    />
  );
}
