import React from "react";
import { Box } from "@chakra-ui/react";
import { SpaceBg } from "../metodo/SpaceBg";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
void React;

interface Props {
  onClose: () => void;
  /** Color del planeta (o el de astrología). Tiñe el borde, el glow y la X. */
  color: string;
  /** Velo sobre el cielo del fondo. */
  overlay?: string;
  children: React.ReactNode;
}

/** Lado máximo del popup. Es el MISMO a lo ancho y a lo alto: cuando el
 *  contenido llena la caja, el popup sale cuadrado en cualquier pantalla. */
const LADO = "560px";

/**
 * Caja común de TODOS los popups de /estudio (arquetipo, preguntas, lectura):
 * cielo de fondo, borde y glow del color del planeta, y la X arriba a la derecha.
 *
 * La forma es lo importante: la altura la manda el CONTENIDO (no hay `h` fija).
 * Si el texto es corto, la caja se encoge y queda un popup pequeño y centrado;
 * si es largo, crece. Antes se estiraba a toda la altura de la pantalla (móvil)
 * o a 560px fijos (escritorio) y el texto se quedaba flotando en el centro con
 * medio popup vacío.
 *
 * Hasta dónde crece, según pantalla:
 *   · Escritorio/tablet: hasta el lado del cuadrado (560×560) y luego scroll.
 *   · Móvil: hasta donde dé la pantalla, para que el contenido se vea ENTERO
 *     sin scroll siempre que quepa (aquí manda leerlo de una, no el cuadrado).
 *
 * OJO: esto es SOLO de /estudio. Ningún popup de fuera usa esta caja, así que
 * nada de lo de aquí (ni el tamaño, ni el bloqueo del fondo) afecta al resto de
 * la web.
 *
 * Los hijos maquetan así: cabecera y pie con `flexShrink={0}`, y el cuerpo con
 * `flex="1"`, `minH={0}` y `overflowY="auto"` (el que hace el scroll).
 */
export function EstudioPopup({ onClose, color, overlay = "rgba(8,13,30,0.75)", children }: Props) {
  // Con el popup abierto, la página de detrás se queda quieta: ni rueda del
  // ratón, ni arrastre con el dedo, ni salto al desaparecer la barra de scroll.
  // El componente solo se monta cuando el popup está abierto, así que al
  // cerrarlo (desmontar) el fondo vuelve a moverse solo.
  // `fijarFondo`: el fondo se queda CLAVADO (position: fixed) mientras el popup
  // está abierto, así que ni el scroll de dentro del popup al llegar al final,
  // ni iOS (que se salta el overflow del body), pueden moverlo.
  useLockBodyScroll(true, { fijarFondo: true });

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={500}
      display="flex"
      alignItems="center"
      justifyContent="center"
      // En móvil, aire mínimo alrededor: cada píxel que no se gasta en margen es
      // alto que gana el popup para que quepa el contenido sin scroll.
      px={{ base: 3, md: 10 }}
      py={{ base: 3, md: 10 }}
      bg="rgba(0,0,0,0.82)"
      // `touchAction: none` en el velo: arrastrar con el dedo FUERA del popup no
      // mueve nada (en móvil el `overflow: hidden` del body no siempre basta).
      sx={{
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        touchAction: "none",
        overscrollBehavior: "none",
      }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="100%"
        maxW={LADO}
        // MÓVIL: la caja crece lo que haga falta (hasta lo que dé la pantalla)
        // para que el contenido se vea ENTERO sin scroll; como la altura la manda
        // el contenido, si es corto la caja se queda pequeña igualmente. Nada de
        // cuadrado forzado aquí: el cuadrado dejaría fuera medio texto.
        // ESCRITORIO/TABLET: cuadrado, tope del lado.
        maxH={{
          base: "calc(100dvh - 24px)",
          md: `min(calc(100vh - 80px), ${LADO})`,
        }}
        borderRadius="2xl"
        overflow="hidden"
        border={`1px solid ${color}66`}
        boxShadow={`0 0 32px ${color}55, 0 0 80px ${color}28, 0 12px 60px rgba(0,0,0,0.6)`}
        fontFamily="'EB Garamond', serif"
        display="flex"
        flexDirection="column"
        // Dentro del popup SÍ se scrollea (pan-y), pero al llegar al final el
        // scroll no se «contagia» a la página de detrás. El `& *` es lo que de
        // verdad lo corta: `overscroll-behavior` lo tiene que llevar el elemento
        // QUE SCROLLEA (el cuerpo del popup), no solo la caja de fuera.
        sx={{
          touchAction: "pan-y",
          overscrollBehavior: "contain",
          "& *": { overscrollBehavior: "contain" },
        }}
      >
        <SpaceBg overlay={overlay} />

        {/* X cerrar */}
        <Box
          position="absolute" top={3} right={3} zIndex={3}
          as="button" onClick={onClose}
          w="36px" h="36px" borderRadius="full"
          display="flex" alignItems="center" justifyContent="center"
          bg="rgba(0,0,0,0.6)" border={`1px solid ${color}66`} color={color}
          cursor="pointer" transition="all 0.15s" boxShadow={`0 0 14px ${color}44`}
          _hover={{ bg: "rgba(0,0,0,0.85)", borderColor: color, boxShadow: `0 0 22px ${color}88` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </Box>

        {children}
      </Box>
    </Box>
  );
}
