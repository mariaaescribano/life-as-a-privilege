import React, { useEffect, useState } from "react";
import { useT } from "../../i18n";
import { Box, Flex, Text, SimpleGrid, Image } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { ComicModal } from "./ComicModal";
import { AppleLoader } from "./AppleLoader";
import { MarcaLeido } from "./MarcaLeido";
import { NUTRICION_ILUSTRACIONES } from "./nutricionIlustraciones";
import type { IlustracionEntry } from "./ilustracionesGaleria";
import { useLeidos } from "../../hooks/useLeidos";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";
import { barraVisibleSx } from "../global/barraDeScroll";

// ─────────────────────────────────────────────────────────────────────────
// Galería de ILUSTRACIONES de Nutrición. Se abre desde la Biblioteca (popup del
// alimento → «Ilustraciones»). Muestra TODOS los cómics de la disciplina; la
// portada de cada tarjeta es la última viñeta del cómic. Al pulsar una tarjeta
// se abre el visor inmersivo (ComicModal) con el tema de Nutrición. El cómic
// que ya se ha leído se queda con su marquita (la común, MarcaLeido).
// ─────────────────────────────────────────────────────────────────────────

// Lista de ilustraciones leídas dentro de metodo_nutricion.data.
const CAMPO_LEIDAS = "ilustraciones_leidas";

function IlustracionCard({ entry, leida, onOpen }: {
  entry: IlustracionEntry; leida: boolean; onOpen: () => void;
}) {
  const t = useT();
  const [coverErr, setCoverErr] = useState(false);
  return (
    <Box as="button" onClick={onOpen} position="relative" w="100%" h="100%" display="flex"
         flexDirection="column" borderRadius="2xl" overflow="hidden" cursor="pointer"
         fontFamily="'EB Garamond', serif" border={`1px solid ${nutricionTxt}33`}
         boxShadow={`0 4px 18px rgba(0,0,0,0.22), 0 0 16px ${nutricionTxt}22`}
         transition="all 0.22s ease"
         _hover={{ transform: "translateY(-4px)", borderColor: `${nutricionTxt}88`,
                   boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 26px ${nutricionTxt}55` }}
         _active={{ transform: "translateY(-1px)" }}>
      {/* Marca de «ya leído» (la misma que en las tarjetas del recorrido) */}
      {leida && <MarcaLeido tinta={nutricionTxt} bg={nutricionBg} />}

      {/* Portada (última viñeta) */}
      <Box position="relative" w="100%" aspectRatio={1} flexShrink={0} overflow="hidden" bg={`${nutricionTxt}12`}>
        {!coverErr && entry.cover ? (
          <Image src={encodeURI(entry.cover)} alt={entry.titulo} w="100%" h="100%" objectFit="cover"
                 loading="lazy" onError={() => setCoverErr(true)} />
        ) : (
          <Flex position="absolute" inset="0" align="center" justify="center" color={`${nutricionTxt}66`}>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="46px" h="46px" fill="currentColor">
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
            </Box>
          </Flex>
        )}
      </Box>

      {/* Pie: título + «Ver →» */}
      <Flex direction="column" align="center" justify="center" flex="1" gap={1.5}
            px={3} py={{ base: 3.5, md: 4 }} position="relative">
        <DisciplinaBgLayer nom={nutricionNom} borderRadius="0" overlay={`${nutricionBg}cc`} />
        <Text position="relative" zIndex={1} color={nutricionTxt} fontSize={{ base: "sm", md: "md" }}
              fontWeight={700} letterSpacing="0.03em" textAlign="center" lineHeight="1.2">
          {entry.titulo}
        </Text>
        <Flex position="relative" zIndex={1} align="center" gap={1} color={nutricionTxt}
              fontSize="2xs" letterSpacing="0.16em" textTransform="uppercase">
          <Text as="span">{t("metodo.ver")}</Text>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="12px" h="12px" fill="currentColor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

export function NutricionIlustracionesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useT();
  const [abierta, setAbierta] = useState<IlustracionEntry | null>(null);
  const { leido, marcarLeido } = useLeidos("metodo-nutricion");
  // Si el cómic ya venía leído, el visor lo dice arriba («✓ Leída»). Se mira
  // ANTES de marcarlo, que si no lo diría siempre.
  const [abiertaLeida, setAbiertaLeida] = useState(false);

  // Abrir un cómic = leerlo: se queda con su marquita.
  const abrir = (e: IlustracionEntry) => {
    setAbiertaLeida(leido(CAMPO_LEIDAS, e.id));
    setAbierta(e);
    marcarLeido(CAMPO_LEIDAS, e.id);
  };

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && !abierta) onClose(); };
    window.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
  }, [isOpen, onClose, abierta]);

  if (!isOpen) return null;

  return (
    <>
      {/* `scroll` + barra clásica: en el móvil también se ve que las tarjetas
          siguen por debajo (ver barraDeScroll.ts). */}
      <Box position="fixed" inset={0} zIndex={1300} overflowY="scroll" fontFamily="'EB Garamond', serif"
           sx={barraVisibleSx(nutricionTxt)}>
        {/* Fondo de la disciplina — en su propia capa FIJA para que cubra SIEMPRE
            el viewport. Si fuera hijo absoluto del contenedor scrolleable, solo
            mediría el alto del viewport y, al hacer scroll, se vería la página de
            detrás (el bug del footer turquesa asomando bajo las tarjetas). */}
        <Box position="fixed" inset={0} zIndex={0} pointerEvents="none">
          <DisciplinaBgLayer nom={nutricionNom} borderRadius="0" overlay={`${nutricionBg}e6`} />
        </Box>

        <Box position="relative" zIndex={1} minH="100%" px={{ base: 4, md: 10, lg: 16 }} py={{ base: 8, md: 12 }}>
          {/* Cerrar */}
          <Box as="button" onClick={onClose} position="fixed" top={{ base: 3, md: 5 }} right={{ base: 3, md: 5 }}
               zIndex={2} w="42px" h="42px" borderRadius="full" display="flex" alignItems="center"
               justifyContent="center" bg={`${nutricionTxt}18`} border={`1px solid ${nutricionTxt}44`}
               color={nutricionTxt} cursor="pointer" sx={{ backdropFilter: "blur(4px)" }}
               transition="all 0.18s" _hover={{ bg: `${nutricionTxt}2e` }}>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </Box>
          </Box>

          <Flex direction="column" align="center" w="100%" maxW="1100px" mx="auto" gap={{ base: 6, md: 8 }}>
            <Flex direction="column" align="center" gap={2} textAlign="center">
              <Text color={nutricionTxt} fontSize={{ base: "3xl", md: "5xl" }} fontWeight={800}
                    letterSpacing="0.08em" textTransform="uppercase" lineHeight="1.1">
                {t("metodo.ilustraciones")}
              </Text>
              <Text color={`${nutricionTxt}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" maxW="560px">
                {t("metodo.nutriIlustraciones")}
              </Text>
            </Flex>

            <SimpleGrid columns={{ base: 2, sm: 3, lg: 4 }} spacing={{ base: 4, md: 6 }} w="100%">
              {NUTRICION_ILUSTRACIONES.map((e) => (
                <IlustracionCard key={e.id} entry={e} leida={leido(CAMPO_LEIDAS, e.id)}
                                 onOpen={() => abrir(e)} />
              ))}
            </SimpleGrid>
          </Flex>
        </Box>
      </Box>

      {/* Visor inmersivo del cómic seleccionado */}
      <ComicModal
        isOpen={!!abierta}
        onClose={() => setAbierta(null)}
        vinetas={abierta?.vinetas ?? []}
        themeColor={abierta?.themeColor}
        disciplinaBgImage={abierta?.disciplinaBgImage}
        disciplinaBgColor={abierta?.disciplinaBgColor}
        textShadow={abierta?.textShadow}
        textColor={abierta?.textColor}
        cerrarColor={nutricionTxt}
        loader={<AppleLoader color={nutricionTxt} label={null} />}
        leida={abiertaLeida}
      />
    </>
  );
}
