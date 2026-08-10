import React, { useEffect, useState } from "react";
import { useT } from "../../i18n";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CIERRE_TABLA } from "./comicEstrellaAtomos";
import { fisiologiaBg, fisiologiaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// EL CIERRE del cómic «Cómo una estrella forma los átomos». Se abre al terminar
// la última viñeta (la estrella que colapsa y siembra el oro y el uranio).
//
// Es una pantalla de UNA sola cosa: la tabla periódica, tan grande como quepa,
// y encima la frase que le cambia el sentido a todo lo que se acaba de leer.
// Nada más —ni contador, ni flechas, ni scroll—: el silencio es parte del
// remate. Entra en tres tiempos (frase → tabla → botón) para que se lea antes
// de que aparezca la imagen.
// ─────────────────────────────────────────────────────────────────────────

const subir = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// La tabla no entra subiendo: se revela. Un punto de escala y el desenfoque
// yéndose, como si se enfocara.
const revelar = keyframes`
  from { opacity: 0; transform: scale(0.965); filter: blur(6px); }
  to   { opacity: 1; transform: scale(1);     filter: blur(0); }
`;

interface TablaPeriodicaFinalProps {
  /** La X: cierra el cómic entero y se queda donde estaba. */
  onClose: () => void;
  /** El botón de abajo: sigue el recorrido (a Moléculas). */
  onContinue: () => void;
}

export function TablaPeriodicaFinal({ onClose, onContinue }: TablaPeriodicaFinalProps) {
  const t = useT();
  // La imagen no se pinta hasta estar descargada: que aparezca a trozos
  // arruinaría el revelado.
  const [lista, setLista] = useState(false);
  useEffect(() => {
    const img = new window.Image();
    const listo = () => setLista(true);
    img.onload = listo;
    img.onerror = listo;
    img.src = encodeURI(CIERRE_TABLA.src);
    if (img.complete) listo();
  }, []);

  return (
    <>
      {/* Fondo: la acuarela de Fisiología muy desenfocada bajo una pantalla
          negra. La misma receta que el visor del cómic, para que el cierre no
          parezca de otra app. */}
      <Box position="fixed" inset="0" zIndex={0} overflow="hidden" bg={fisiologiaBg} pointerEvents="none">
        <Box
          as="img"
          src="/img/fondos/fisio.webp"
          alt=""
          loading="eager"
          position="absolute"
          top="-40px"
          left="-40px"
          w="calc(100% + 80px)"
          h="calc(100% + 80px)"
          style={{ objectFit: "cover", objectPosition: "center", filter: "blur(26px)" }}
        />
        <Box position="absolute" inset="0" bg="rgba(0,0,0,0.62)" />
      </Box>

      {/* X de cerrar, en el mismo sitio que la del visor. */}
      <IconButton
        aria-label={t("comun.cerrar")}
        onClick={onClose}
        position="fixed"
        top={{ base: 3, md: 5 }}
        right={{ base: 3, md: 5 }}
        zIndex={12}
        variant="ghost"
        borderRadius="full"
        w={{ base: "42px", md: "48px" }}
        h={{ base: "42px", md: "48px" }}
        minW={{ base: "42px", md: "48px" }}
        bg="rgba(0,0,0,0.5)"
        border={`1px solid ${fisiologiaTxt}aa`}
        boxShadow="0 2px 12px rgba(0,0,0,0.45)"
        sx={{ backdropFilter: "blur(4px)" }}
        _hover={{ bg: "rgba(0,0,0,0.7)", borderColor: fisiologiaTxt }}
        _focus={{ boxShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
        _focusVisible={{ boxShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
        icon={
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="26px" h="26px" fill="#ffffff"
               style={{ filter: `drop-shadow(0 0 5px ${fisiologiaTxt}) drop-shadow(0 1px 2px rgba(0,0,0,0.8))` }}>
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </Box>
        }
      />

      {/* La pantalla ocupa el viewport justo y no lo desborda: nada de barra de
          scroll en un cierre que cabe entero. */}
      <Flex
        position="relative"
        zIndex={2}
        direction="column"
        align="center"
        justify="center"
        gap={{ base: 6, md: 8 }}
        h="100dvh"
        px={{ base: 5, md: 12 }}
        py={{ base: 16, md: 14 }}
      >
        {/* La frase, primero y sola. */}
        <Text
          color={fisiologiaTxt}
          fontSize={{ base: "xl", md: "3xl" }}
          fontStyle="italic"
          lineHeight="1.6"
          textAlign="center"
          maxW="820px"
          animation={`${subir} 0.8s ease both`}
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.85), 0 0 26px rgba(0,0,0,0.6)" }}
        >
          {CIERRE_TABLA.frase}
        </Text>

        {/* La tabla, protagonista: se queda con TODO el hueco que dejan la frase
            y el botón (`flex 1`), y crece hasta donde su proporción se lo
            permita, con tope de 1100px de ancho (su resolución real es
            1000×667). El halo va en la propia imagen y no en una caja: así
            abraza la tabla exactamente, sin sobresalir por los lados cuando
            manda el alto, que es lo normal en pantallas apaisadas. */}
        <Flex flex="1 1 auto" minH={0} w="100%" maxW="1100px" align="center" justify="center">
          <Box
            as="img"
            src={encodeURI(CIERRE_TABLA.src)}
            alt="La tabla periódica de los elementos"
            maxW="100%"
            maxH="100%"
            borderRadius="xl"
            opacity={lista ? 1 : 0}
            animation={lista ? `${revelar} 1s cubic-bezier(0.22,1,0.36,1) 0.25s both` : undefined}
            boxShadow={`0 0 26px ${fisiologiaBg}99, 0 0 60px ${fisiologiaBg}66, 0 0 22px ${fisiologiaTxt}33, 0 24px 70px rgba(0,0,0,0.55)`}
            style={{ objectFit: "contain", display: "block" }}
          />
        </Flex>

        {/* El paso siguiente. Mismo botón que lleva el cómic arriba (imagen de
            la disciplina + velo + letra en su color), aquí en grande y centrado
            porque ya es LA acción de la pantalla. */}
        <Box
          as="button"
          onClick={onContinue}
          position="relative"
          display="inline-flex"
          alignItems="center"
          gap={2}
          overflow="hidden"
          h={{ base: "48px", md: "54px" }}
          px={{ base: 7, md: 9 }}
          borderRadius="full"
          bg="transparent"
          color={fisiologiaTxt}
          border={`2px solid ${fisiologiaTxt}`}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "sm", md: "md" }}
          letterSpacing="0.04em"
          whiteSpace="nowrap"
          cursor="pointer"
          flexShrink={0}
          boxShadow="0 2px 14px rgba(0,0,0,0.45)"
          animation={`${subir} 0.7s ease 0.9s both`}
          transition="transform 0.2s"
          _hover={{ transform: "translateY(-2px)" }}
        >
          <Box as="img" src="/img/fondos/fisio.webp" alt="" loading="eager" position="absolute" inset="0"
               w="100%" h="100%" style={{ objectFit: "cover", objectPosition: "center" }} pointerEvents="none" />
          <Box position="absolute" inset="0" bg={`${fisiologiaBg}b3`} />
          <Box as="span" position="relative" zIndex={1}>
            {t("metodo.irA", { destino: t("metodo.destino.moleculas") })}
          </Box>
          <Box as="svg" position="relative" zIndex={1} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
               w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill="currentColor" flexShrink={0}>
            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
          </Box>
        </Box>
      </Flex>
    </>
  );
}
