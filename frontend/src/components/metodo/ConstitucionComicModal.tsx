import React from "react";
import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import { ComicViewer, type Vineta } from "./ComicViewer";
import { TcmLoader } from "./comicLoaders";
import { ELEMENTOS, type Elemento } from "./tcmRecorrido";
import {
  CONSTITUCIONES, FOTO_CONSTITUCION, FOTO_CONSTITUCION_RESERVA, FOTO_CONSTITUCION_COMIC,
} from "./tcmConstitucion";
import { useNombresElementos } from "./tcmElementosEn";
import { useT } from "../../i18n";

// ─────────────────────────────────────────────────────────────────────────
// El cómic de una constitución: al pulsar «Saber más» en una de las cinco
// tarjetas se abre este visor inmersivo (el MISMO ComicViewer de los
// elementos) y cuenta la constitución punto por punto, una viñeta por punto:
//
//   1 · Quién es        (arquetipo + lema + el retrato del tipo)
//   2 · Lo que le atrae
//   3 · Lo que le incomoda
//   4 · Sus nudos
//   5 · Por dónde avisa su cuerpo
//   6 · En su luz / en su sombra
//
// Cada viñeta tiene su ilustración propia (FOTO_CONSTITUCION_COMIC); mientras
// no exista, cae en la pintura del elemento (srcFallback), así que las fotos
// se pueden ir subiendo una a una sin que nada se vea roto.
// ─────────────────────────────────────────────────────────────────────────

const INTRO_TEXT_SHADOW =
  "0 2px 5px rgba(0,0,0,1), 0 0 3px rgba(0,0,0,0.98), 0 6px 20px rgba(0,0,0,0.85)";

export function ConstitucionComicModal({
  elemento,
  onClose,
}: {
  elemento: Elemento | null;
  onClose: () => void;
}) {
  const t = useT();
  const nombres = useNombresElementos();

  return (
    <Modal isOpen={!!elemento} onClose={onClose} size="full" scrollBehavior="outside" motionPreset="none">
      <ModalOverlay bg="rgba(0,0,0,0.85)" sx={{ backdropFilter: "blur(20px)" }} />
      <ModalContent bg="transparent" border="none" borderRadius="0" boxShadow="none" m={0} minH="100dvh" position="relative" sx={{ transform: "none !important" }}>
        {elemento && (() => {
          const c = CONSTITUCIONES[elemento];
          const fotos = FOTO_CONSTITUCION_COMIC[elemento];
          const reserva = FOTO_CONSTITUCION_RESERVA[elemento];
          const vinetas: Vineta[] = [
            {
              src: FOTO_CONSTITUCION[elemento],
              srcFallback: reserva,
              eyebrow: nombres[elemento],
              titulo: c.arquetipo,
              paragraphs: [c.lema, ...c.texto],
            },
            {
              src: fotos.atrae,
              srcFallback: reserva,
              eyebrow: c.arquetipo,
              titulo: t("metodo.tcm.constitucion.leAtrae"),
              paragraphs: [c.afinidades.join(" · ") + "."],
            },
            {
              src: fotos.incomoda,
              srcFallback: reserva,
              eyebrow: c.arquetipo,
              titulo: t("metodo.tcm.constitucion.leIncomoda"),
              paragraphs: [c.aversiones.join(" · ") + "."],
            },
            {
              src: fotos.nudos,
              srcFallback: reserva,
              eyebrow: c.arquetipo,
              titulo: t("metodo.tcm.constitucion.nudos"),
              paragraphs: [
                t("metodo.tcm.constitucion.nudosPie"),
                ...c.nudos.map((n) => `${n.quiere}, ${n.pero}`),
              ],
            },
            {
              src: fotos.cuerpo,
              srcFallback: reserva,
              eyebrow: c.arquetipo,
              titulo: t("metodo.tcm.constitucion.cuerpo"),
              paragraphs: c.cuerpo,
            },
            {
              src: fotos.luz,
              srcFallback: reserva,
              eyebrow: c.arquetipo,
              titulo: `${t("metodo.tcm.constitucion.enSuLuz")} · ${t("metodo.tcm.constitucion.enSuSombra")}`,
              paragraphs: [
                `${t("metodo.tcm.constitucion.enSuLuz")}: ${c.luz}`,
                `${t("metodo.tcm.constitucion.enSuSombra")}: ${c.sombra}`,
              ],
            },
          ];
          return (
            <ComicViewer
              key={elemento}
              vinetas={vinetas}
              themeColor={ELEMENTOS[elemento].color}
              textColor="#ffffff"
              textShadow={INTRO_TEXT_SHADOW}
              disciplinaBgImage={FOTO_CONSTITUCION_RESERVA[elemento]}
              disciplinaBgColor={ELEMENTOS[elemento].color}
              loader={<TcmLoader color="#ffffff" />}
              scrollbarColor="#ffffff"
              esperarFondo
              veloOscuro={0.4}
              separarFrases
              onClose={onClose}
              onComplete={onClose}
            />
          );
        })()}
      </ModalContent>
    </Modal>
  );
}
