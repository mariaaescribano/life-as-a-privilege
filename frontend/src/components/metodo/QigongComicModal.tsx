import React from "react";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer, type Vineta } from "./ComicViewer";
import { TcmLoader } from "./comicLoaders";
import { disciplinaBgImg } from "../global/DisciplinaBgLayer";
import { tcmBg, tcmNom, tcmTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Los cómics de la página de Qigong: «De dónde viene» (la línea del tiempo) y
// «Dao Yin». Mismo visor que el resto del recorrido (ComicViewer) con la ropa
// de Medicina China: letra blanca, animación del yin-yang y fondo de la
// disciplina.
//
// La página se queda con lo justo —la línea del tiempo y el nombre en chino— y
// el texto largo se lee aquí, una viñeta cada vez.
// ─────────────────────────────────────────────────────────────────────────

const TCM_IMG = disciplinaBgImg(tcmNom) ?? "/img/fondos/tcm.webp";

export function QigongComicModal({
  isOpen,
  vinetas,
  initialIndex = 0,
  onClose,
}: {
  isOpen: boolean;
  vinetas: Vineta[];
  /** Viñeta por la que abrir (el hito que se ha pulsado en la línea del tiempo). */
  initialIndex?: number;
  onClose: () => void;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="outside" motionPreset="none">
      <ModalOverlay bg={tcmBg} sx={{ backdropFilter: "blur(20px)" }} />
      <ModalContent
        bg="transparent"
        border="none"
        borderRadius="0"
        boxShadow="none"
        m={0}
        minH="100dvh"
        position="relative"
        fontFamily="'EB Garamond', serif"
        sx={{ transform: "none !important" }}
      >
        {isOpen && vinetas.length > 0 && (
          <ComicViewer
            vinetas={vinetas}
            initialIndex={initialIndex}
            themeColor={tcmTxt}
            textColor={tcmTxt}
            disciplinaBgImage={TCM_IMG}
            disciplinaBgColor={tcmBg}
            // Animación de espera y barra de scroll en blanco, como la letra.
            loader={<TcmLoader color="#ffffff" />}
            scrollbarColor="#ffffff"
            // Mismo caso que el cómic de los elementos: letra blanca sobre la
            // tinta china, que es clarísima. El velo la apaga lo justo.
            //
            // OJO: este «más oscurito» es EXCLUSIVO de dos visores —este y
            // ElementoComicModal (los elementos)—. No se lleva a ningún otro
            // cómic de la casa: fuera de las tintas chinas rompe la coherencia
            // de color de la disciplina. Si hace falta legibilidad en otro
            // sitio, se resuelve con `textShadow`, no oscureciendo la foto.
            veloOscuro={0.4}
            onClose={onClose}
            onComplete={onClose}
          />
        )}
      </ModalContent>
    </Modal>
  );
}

/**
 * El mismo visor, con el nombre por el que se lee en las páginas nuevas.
 *
 * Nació en la página de Qigong (de ahí el nombre del archivo), pero lo usan ya
 * el Taoísmo y la cocina diaria: es EL cómic de Medicina China, no el de Qigong.
 * Se exporta con este alias para no renombrar el archivo (y sus imports) y para
 * que en el código nuevo se llame por lo que es.
 */
export const TcmComicModal = QigongComicModal;

export default QigongComicModal;
