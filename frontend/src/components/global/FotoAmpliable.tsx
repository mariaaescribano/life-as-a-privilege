// ─────────────────────────────────────────────────────────────────────────
// FOTO AMPLIABLE · pulsar una imagen para verla grande
//
// Hay fotos que dentro de su caja se quedan pequeñas para lo que cuentan —el
// mapa de la lengua, con sus zonas rotuladas, es el caso claro—. Este
// componente las hace pulsables: al hacer clic se abren a pantalla completa
// sobre un fondo oscuro, y se cierran con la X, con Escape o pulsando fuera.
//
//   <FotoAmpliable src={MAPA_LENGUA} alt="Mapa de la lengua" acento={tcmTxt} />
//
// Se apoya en el Modal de Chakra, que ya trae el cierre con Escape, el foco
// atrapado y el bloqueo del scroll de detrás. La lupa de la esquina es la
// pista de que se puede pulsar: sin ella nadie lo descubre.
// ─────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { Box, Flex, Modal, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";

/** Lupa con un «+»: se puede ampliar. */
function IconoLupa({ size, color }: { size: string; color: string }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={size} h={size} fill={color}>
      <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Zm-40-60v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
    </Box>
  );
}

/** X de cerrar. */
function IconoCerrar({ size, color }: { size: string; color: string }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={size} h={size} fill={color}>
      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
    </Box>
  );
}

export interface FotoAmpliableProps {
  src: string;
  alt: string;
  /** Color de la disciplina, para la lupa y el borde de la foto ampliada. */
  acento?: string;
  /** Pie que se lee bajo la foto ya ampliada. Por defecto, el `alt`. */
  pie?: string;
  /** Texto del aviso de la esquina. Se puede quitar dejándolo en "". */
  etiqueta?: string;
}

export function FotoAmpliable({ src, alt, acento = "#ffffff", pie, etiqueta = "Ampliar" }: FotoAmpliableProps) {
  const [abierta, setAbierta] = useState(false);
  const url = encodeURI(src);
  const leyenda = pie ?? alt;

  return (
    <>
      {/* La foto, pulsable. Ocupa todo el hueco que le dé su caja. */}
      <Box as="button" type="button" onClick={() => setAbierta(true)}
           aria-label={`Ampliar la imagen: ${alt}`} title="Pulsa para verla más grande"
           position="relative" display="block" w="100%" cursor="zoom-in"
           sx={{ "& img": { transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)" } }}
           _hover={{ "& img": { transform: "scale(1.04)" }, "& .lupa-foto": { opacity: 1 } }}>
        <img src={url} alt={alt} style={{ width: "100%", height: "auto", display: "block" }} />

        {/* Lupa: la pista de que se puede pulsar. Siempre visible (atenuada),
            porque en móvil no hay hover que la despierte. */}
        {etiqueta !== "" && (
          <Flex className="lupa-foto" position="absolute" bottom="8px" right="8px" align="center" gap={1.5}
                px={2.5} py={1.5} borderRadius="full" bg="rgba(0,0,0,0.62)"
                border={`1px solid ${acento}88`} opacity={0.85} pointerEvents="none"
                sx={{ backdropFilter: "blur(4px)", transition: "opacity 0.25s ease" }}>
            <IconoLupa size="14px" color={acento} />
            <Text color="white" fontSize="2xs" fontWeight={700} letterSpacing="0.06em" lineHeight="1">
              {etiqueta}
            </Text>
          </Flex>
        )}
      </Box>

      {/* La foto a pantalla completa. */}
      <Modal isOpen={abierta} onClose={() => setAbierta(false)} size="full" isCentered>
        <ModalOverlay bg="rgba(0,0,0,0.92)" sx={{ backdropFilter: "blur(14px)" }} />
        <ModalContent bg="transparent" boxShadow="none" border="none" borderRadius={0} m={0}
                      fontFamily="'EB Garamond', serif">
          {/* Pulsar fuera de la foto también cierra. */}
          <Flex position="absolute" inset={0} align="center" justify="center" direction="column"
                gap={4} px={{ base: 3, md: 8 }} py={{ base: 14, md: 12 }}
                onClick={() => setAbierta(false)} cursor="zoom-out">
            <Box maxW="100%" maxH="100%" borderRadius="lg" overflow="hidden"
                 border={`1px solid ${acento}66`} boxShadow={`0 0 40px ${acento}33, 0 20px 60px rgba(0,0,0,0.6)`}
                 // El clic sobre la propia foto NO cierra: así se puede mirar
                 // con calma sin miedo a tocarla.
                 onClick={(e) => e.stopPropagation()} cursor="default">
              <img src={url} alt={alt}
                   style={{ display: "block", maxWidth: "100%", maxHeight: "78vh", width: "auto", height: "auto" }} />
            </Box>
            {leyenda && (
              <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                    textAlign="center" maxW="640px">
                {leyenda}
              </Text>
            )}
          </Flex>

          <Box as="button" type="button" aria-label="Cerrar" onClick={() => setAbierta(false)}
               position="fixed" top={{ base: 3, md: 5 }} right={{ base: 3, md: 5 }} zIndex={10}
               p={2} borderRadius="md" _hover={{ bg: "rgba(255,255,255,0.14)" }}>
            <IconoCerrar size="26px" color={acento} />
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
}
