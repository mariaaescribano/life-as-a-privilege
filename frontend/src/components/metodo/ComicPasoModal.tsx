import React from "react";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer, type Vineta } from "./ComicViewer";
import { astrologiaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Cómic de PASO (intercalado) del recorrido de una disciplina. Se muestra ANTES
// de avanzar al siguiente paso (astrología: signos → Sol/Luna/Asc, planetas →
// Arquetipos, casas → Casas; ayurveda: doshas → Energías…). Reutiliza el
// ComicViewer con el tema (color + fondo) de la disciplina.
//
//   · Botón del siguiente título (arriba, a la IZQUIERDA de la X, con la imagen
//     de la disciplina de fondo): salta al siguiente paso.
//   · onClose → la X / Escape. El padre cierra y se queda donde estaba.
// ─────────────────────────────────────────────────────────────────────────

// Flecha larga → (material «arrow_forward»), para el botón del siguiente título.
const FlechaDerecha = () => (
  <Box as="svg" position="relative" zIndex={1} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill="currentColor" flexShrink={0}>
    <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
  </Box>
);

interface ComicPasoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  /** Viñetas del cómic (VINETAS_SIGNOS / VINETAS_PLANETAS / VINETAS_DOSHAS…). */
  vinetas: Vineta[];
  /** Texto del botón de continuar (p.ej. "Arquetipos", "Energías"). Acepta JSX
   *  para poder abreviarlo en móvil con dos <span> y `display`. */
  continueLabel: React.ReactNode;
  /** Color de acento de la disciplina (flechas, líneas, botones). */
  themeColor?: string;
  /** Foto de fondo de la disciplina. Si se omite, el ComicViewer usa el fondo
   *  estrellado por defecto (astrología). También es la imagen que se usa de
   *  fondo del botón del siguiente título. */
  disciplinaBgImage?: string;
  /** Color hex del fondo de la disciplina (velo/glow del box y del botón). */
  disciplinaBgColor?: string;
  /** Sombra del texto de las viñetas. */
  textShadow?: string;
  /** Color del texto de las viñetas (título + párrafos). Por defecto el título
   *  es blanco; pásalo (p.ej. el color de la disciplina) para teñir también el
   *  título como el cuerpo. */
  textColor?: string;
  /** (En desuso) El botón del siguiente título ahora lleva SIEMPRE la imagen de
   *  la disciplina de fondo; estos props se ignoran. Se mantienen para no
   *  romper los llamadores que aún los pasan. */
  continueBtnBg?: string;
  continueBtnColor?: string;
  /** Si true, NO se pinta el botón «Saltar →» del siguiente título (arriba, a la
   *  izquierda de la X). El único modo de avanzar es recorrer el cómic hasta el
   *  tick final. Lo usa Astrología para que sus ilustraciones no se salten. */
  sinBotonSaltar?: boolean;
  /** Si true, el botón de avanzar lleva la imagen de la disciplina con EL MISMO
   *  tratamiento que el box del cómic: se ve (sin blur), pero rebajada con el
   *  velo suave del color de la disciplina (33%) y el mismo `saturate`, en vez
   *  del velo oscuro al 70% del modo normal. Así el botón y la caja son la
   *  misma pintura y no una mancha oscura arriba a la derecha. La legibilidad
   *  del texto se apoya en `textShadow`.
   *  Lo usan los cómics de Psicología para su botón «Continuar →». */
  botonNitido?: boolean;
}

export function ComicPasoModal({
  isOpen,
  onClose,
  onContinue,
  vinetas,
  continueLabel,
  themeColor = astrologiaTxt,
  disciplinaBgImage,
  disciplinaBgColor,
  textShadow,
  textColor,
  sinBotonSaltar,
  botonNitido,
}: ComicPasoModalProps) {
  // Imagen de la disciplina para el fondo del botón del siguiente título.
  // Astrología no pasa disciplinaBgImage → usa el fondo estrellado, igual que
  // hace el propio ComicViewer.
  const imgFondo = disciplinaBgImage ?? "/img/astrologia/space.jpg";
  // Velo sobre la imagen para que el texto del botón se lea bien. Con
  // `botonNitido` NO es un velo oscuro sino EL MISMO del box del cómic (el
  // color de la disciplina al 33%, ver ComicViewer): la foto se sigue viendo,
  // pero rebajada y del mismo tono que la caja, no un recorte a plena
  // intensidad que canta al lado de la pintura clara.
  const veloBtn = botonNitido
    ? (disciplinaBgColor ? `${disciplinaBgColor}55` : "rgba(0,0,0,0.2)")
    : (disciplinaBgColor ? `${disciplinaBgColor}b3` : "rgba(0,0,0,0.5)");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior="outside">
      <ModalOverlay bg="rgba(0,0,0,0.95)" sx={{ backdropFilter: "blur(24px)" }} />
      <ModalContent
        bg="transparent"
        border="none"
        borderRadius="0"
        boxShadow="none"
        m={0}
        fontFamily="'EB Garamond', serif"
        minH="100dvh"
      >
        {/* key={isOpen}: al reabrir, el ComicViewer se remonta desde la 1ª viñeta.
            sinSaltar: ocultamos el «Saltar» propio del ComicViewer; aquí abajo
            pintamos el nuestro («Saltar →», en el color de la disciplina). */}
        <ComicViewer
          key={String(isOpen)}
          vinetas={vinetas}
          onClose={onClose}
          onComplete={onContinue}
          themeColor={themeColor}
          disciplinaBgImage={disciplinaBgImage}
          disciplinaBgColor={disciplinaBgColor}
          textShadow={textShadow}
          textColor={textColor}
          sinSaltar
        />

        {/* Botón del siguiente título («Saltar →») — arriba, a la IZQUIERDA de la
            X, con la imagen de la disciplina de fondo (+ velo para leer el texto).
            Con `sinBotonSaltar` (Astrología) no se pinta: se recorre el cómic. */}
        {!sinBotonSaltar && (
        <Box
          as="button"
          onClick={onContinue}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: "74px", md: "90px" }}
          zIndex={11}
          overflow="hidden"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          h={{ base: "42px", md: "48px" }}
          px={{ base: 4, md: 6 }}
          borderRadius="full"
          border={`2px solid ${themeColor}`}
          color={themeColor}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="0.04em"
          whiteSpace="nowrap"
          cursor="pointer"
          boxShadow="0 2px 12px rgba(0,0,0,0.45)"
          sx={botonNitido ? undefined : { backdropFilter: "blur(4px)" }}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-1px)" }}
        >
          {/* Fondo: imagen de la disciplina. Con `botonNitido` va sin blur pero
              con el mismo `saturate` y el mismo velo suave que la caja del
              cómic; si no, velo oscuro para leer el texto. */}
          <Box as="img" src={imgFondo} alt="" loading="eager" position="absolute" inset="0"
               w="100%" h="100%"
               style={{
                 objectFit: "cover",
                 objectPosition: "center",
                 filter: botonNitido ? "saturate(1.05)" : undefined,
               }}
               pointerEvents="none" />
          <Box position="absolute" inset="0" bg={veloBtn} />
          <Box as="span" position="relative" zIndex={1} display="inline-flex" alignItems="center" gap={2}
               style={botonNitido ? { textShadow } : undefined}>
            {continueLabel}
            <FlechaDerecha />
          </Box>
        </Box>
        )}
      </ModalContent>
    </Modal>
  );
}
