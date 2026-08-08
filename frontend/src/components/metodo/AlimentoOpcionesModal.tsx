import React, { useEffect, useState } from "react";
import { useT } from "../../i18n";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";
import type { Alimento } from "../../hardCoded/espacio/AlimentosNutricion";

// ─────────────────────────────────────────────────────────────────────────
// Popup que se abre al pulsar un alimento en la Biblioteca de Nutrición. En vez
// de navegar a otra página, ofrece dos caminos sobre el fondo de la disciplina:
//   · ILUSTRACIONES              → galería/portada de ilustraciones (pendiente).
//   · LOS MATERIALES DE LOS ALIMENTOS → desglose molecular (página de detalle).
// El fondo es el de Nutrición (nutri.png) con un velo claro.
// ─────────────────────────────────────────────────────────────────────────

// Portada del box de Ilustraciones (pendiente de subir). Si no existe, el box
// muestra un icono de galería como marcador.

// Una de las dos opciones del popup. `portada` opcional: si se pasa, se ve como
// fondo del box; si falla o no hay, se pinta `icono`. `proximamente` la deja
// desactivada con una etiqueta.
function OpcionBox({
  titulo, portada, icono, onClick, proximamente,
}: {
  titulo: string;
  portada?: string;
  icono: React.ReactNode;
  onClick?: () => void;
  proximamente?: boolean;
}) {
  const t = useT();
  const [imgErr, setImgErr] = useState(false);
  const hayPortada = !!portada && !imgErr;
  return (
    <Box
      as="button"
      onClick={proximamente ? undefined : onClick}
      position="relative"
      overflow="hidden"
      w="100%"
      borderRadius="2xl"
      cursor={proximamente ? "default" : "pointer"}
      textAlign="center"
      border={`1px solid ${nutricionTxt}33`}
      boxShadow={`0 6px 22px rgba(0,0,0,0.28), 0 0 16px ${nutricionTxt}22`}
      transition="all 0.2s ease"
      opacity={proximamente ? 0.85 : 1}
      _hover={proximamente ? {} : { transform: "translateY(-4px)",
              boxShadow: `0 12px 34px rgba(0,0,0,0.36), 0 0 26px ${nutricionTxt}44` }}
      _active={proximamente ? {} : { transform: "translateY(-1px)" }}
    >
      {/* Zona de portada / icono */}
      <Box position="relative" w="100%" aspectRatio={{ base: 16 / 10, md: 4 / 3 }} overflow="hidden"
           bg={`${nutricionTxt}14`}>
        {hayPortada ? (
          <Image src={encodeURI(portada!)} alt={titulo} w="100%" h="100%" objectFit="cover"
                 onError={() => setImgErr(true)} />
        ) : (
          <Flex w="100%" h="100%" align="center" justify="center" color={`${nutricionTxt}77`}>
            {icono}
          </Flex>
        )}
        {proximamente && (
          <Flex position="absolute" top={2.5} right={2.5} px={2.5} py={1} borderRadius="full"
                bg={`${nutricionTxt}e0`} align="center">
            <Text color={nutricionBg} fontSize="2xs" fontWeight={800} letterSpacing="0.08em"
                  textTransform="uppercase">
              {t("comun.proximamente")}
            </Text>
          </Flex>
        )}
      </Box>

      {/* Título */}
      <Flex direction="column" align="center" gap={1.5} px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
        <Text color={nutricionTxt} fontWeight={800} fontSize={{ base: "md", md: "lg" }} lineHeight="1.2"
              letterSpacing="0.06em" textTransform="uppercase">
          {titulo}
        </Text>
        {!proximamente && (
          <Flex align="center" gap={1} color={nutricionTxt}>
            <Text as="span" fontSize={{ base: "xs", md: "sm" }} fontStyle="italic">{t("metodo.ver")}</Text>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="14px" h="14px" fill="currentColor">
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </Box>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

export function AlimentoOpcionesModal({
  alimento,
  onClose,
  onMateriales,
  onIlustraciones,
}: {
  alimento: Alimento | null;
  onClose: () => void;
  onMateriales: () => void;
  /** Si no se pasa, el box de Ilustraciones aparece como «Próximamente». */
  onIlustraciones?: () => void;
}) {
  const t = useT();
  useEffect(() => {
    if (!alimento) return;
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
  }, [alimento, onClose]);

  if (!alimento) return null;

  return (
    <Box position="fixed" inset={0} zIndex={1200} display="flex" alignItems="center" justifyContent="center"
         px={{ base: 4, md: 8 }} py={{ base: 6, md: 8 }} onClick={onClose}
         bg="rgba(20,30,18,0.55)" sx={{ backdropFilter: "blur(4px)" }}>
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="720px"
           maxH="90vh" overflowY="auto" borderRadius="2xl" overflow="hidden"
           border={`1px solid ${nutricionTxt}33`} boxShadow="0 24px 70px rgba(0,0,0,0.5)">
        <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}d9`} />

        <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>
          {/* Botón cerrar */}
          <Box as="button" onClick={onClose} position="absolute" top={{ base: 3, md: 4 }} right={{ base: 3, md: 4 }}
               w="36px" h="36px" borderRadius="full" display="flex" alignItems="center" justifyContent="center"
               bg={`${nutricionTxt}18`} border={`1px solid ${nutricionTxt}44`} color={nutricionTxt}
               cursor="pointer" transition="all 0.18s" _hover={{ bg: `${nutricionTxt}2e` }}>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="20px" h="20px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </Box>
          </Box>

          {/* Cabecera: emoji + nombre del alimento */}
          <Flex direction="column" align="center" gap={2} mb={{ base: 5, md: 6 }}>
            <Box fontSize={{ base: "48px", md: "60px" }} lineHeight="1">
              <span role="img" aria-label={alimento.nombre}>{alimento.emoji ?? alimento.nombre.charAt(0)}</span>
            </Box>
            <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={800} lineHeight="1.1"
                  textAlign="center">
              {alimento.nombre}
            </Text>
            <Text color={`${nutricionTxt}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" maxW="440px" lineHeight="1.5">
              {alimento.resumen}
            </Text>
          </Flex>

          {/* Los dos caminos */}
          <Flex direction={{ base: "column", md: "row" }} gap={{ base: 4, md: 5 }} align="stretch">
            <OpcionBox
              titulo={t("metodo.ilustraciones")}
              proximamente={!onIlustraciones}
              onClick={onIlustraciones}
              icono={
                <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="56px" h="56px" fill="currentColor">
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                </Box>
              }
            />
            <OpcionBox
              titulo={t("metodo.alimentos.materiales")}
              onClick={onMateriales}
              icono={
                <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="56px" h="56px" fill="currentColor">
                  <path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z" />
                </Box>
              }
            />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
