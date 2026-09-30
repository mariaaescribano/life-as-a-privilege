// ─────────────────────────────────────────────────────────────────────────────
// CÓMIC de una zona del cerebro (paso 7 de psicología).
//
// Al tocar una zona —en el dibujo o en su botón— su ficha se lee en el CÓMIC
// INMERSIVO de siempre (IntroComicModal → ComicViewer), como los chakras de
// Ayurveda: la foto de la zona con la luz de su color, el fondo de psicología
// y una viñeta por apartado (para qué sirve · qué le hizo · cómo se nota · lo
// que la cambia). Antes iba en una ficha aparte (FichaFisioModal) que no era
// el visor de la casa y en móvil quedaba mal.
//
// Al terminar el cómic de una zona se abre solo el de la SIGUIENTE (cómics
// encadenados); el de la última cierra. La X cierra en cualquier momento.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useMemo } from "react";
import { IntroComicModal } from "./IntroComicModal";
import type { Vineta } from "./ComicViewer";
import { neuropsicologiaBg, neuropsicologiaTxt } from "../../GlobalVariables";
import { ZONAS, zonaPorKey, type ZonaKey } from "./psicologiaCerebro";

const PAPEL = "#fbf4e8";
/** La misma sombra del resto de cómics de psicología: resplandor de papel, no
 *  mancha negra (el box de psicología es claro y la tinta oscura). */
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export function CerebroZonaModal({
  zonaKey,
  onZona,
  onClose,
}: {
  /** La zona abierta, o null si el popup está cerrado. */
  zonaKey: ZonaKey | null;
  /** Cambia la zona mostrada (lo usa el encadenado al terminar un cómic). */
  onZona: (key: ZonaKey) => void;
  onClose: () => void;
}) {
  const zona = zonaKey ? zonaPorKey(zonaKey) : null;

  // Una viñeta por apartado, todas con la foto de la zona. Sin antetítulo ni
  // título: como el resto de cómics de psicología, solo el texto.
  const vinetas = useMemo<Vineta[]>(() => {
    if (!zona) return [];
    return [
      { src: zona.foto, titulo: "", paragraphs: [zona.paraQueSirve] },
      { src: zona.foto, titulo: "", paragraphs: [zona.queLeHizo] },
      { src: zona.foto, titulo: "", paragraphs: zona.comoSeNota },
      { src: zona.foto, titulo: "", paragraphs: [zona.loQueLaCambia] },
    ];
  }, [zona]);

  if (!zona) return null;

  const idx = ZONAS.findIndex((z) => z.key === zona.key);
  const siguiente = ZONAS[idx + 1];

  return (
    <IntroComicModal
      // key con la zona: al pasar a la siguiente, el visor se remonta desde su
      // 1ª viñeta (si no, seguiría en la viñeta donde iba la anterior).
      key={zona.key}
      isOpen
      vinetas={vinetas}
      onClose={onClose}
      // Terminar una zona abre la siguiente; la última cierra.
      onComplete={() => (siguiente ? onZona(siguiente.key) : onClose())}
      themeColor={neuropsicologiaTxt}
      // El color de la zona solo tiñe la luz de la ilustración, nunca la letra
      // (la regla de la casa: la tinta de la disciplina para el texto).
      luzFoto={zona.color}
      disciplinaBgImage="/img/fondos/psciologia.webp"
      disciplinaBgColor={neuropsicologiaBg}
      textShadow={INK_SHADOW}
    />
  );
}

export default CerebroZonaModal;
