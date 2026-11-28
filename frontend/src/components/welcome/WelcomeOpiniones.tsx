import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import { API_URL, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import type { Opinion } from "../../dtos/opinion.type";
import { useT } from "../../i18n";
import { focoBlanco } from "../global/foco";
import BandaFoto from "../global/BandaFoto";
import { LifeLoader } from "../metodo/comicLoaders";

/**
 * Las experiencias de las personas (TODAS las opiniones publicadas), debajo de las cuatro fotos de la portada.
 * Van en una fila que se desliza hacia los lados (con el dedo en móvil, con las flechas en escritorio), cada
 * opinión en una tarjeta (en escritorio caben tres a la vez) de borde turquesa oscuro y sin fondo; las tarjetas se frenan alineadas al borde.
 * Sin opiniones publicadas no se pinta nada.
 */
const Flecha = ({ dir, onClick, label }: { dir: "izq" | "dcha"; onClick: () => void; label: string }) => (
  <Box
    as="button"
    type="button"
    onClick={onClick}
    aria-label={label}
    display={{ base: "none", md: "flex" }}
    alignItems="center"
    justifyContent="center"
    w="42px"
    h="42px"
    flexShrink={0}
    borderRadius="full"
    border={`1.5px solid ${T}`}
    bg="transparent"
    cursor="pointer"
    transition="background 0.25s ease"
    _hover={{ bg: `${T}14` }}
    _focusVisible={focoBlanco}
  >
    <Box as="svg" viewBox="0 0 24 24" w="18px" h="18px" fill="none" stroke={T} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "izq" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </Box>
  </Box>
);

const WelcomeOpiniones = () => {
  const t = useT();
  const [opiniones, setOpiniones] = useState<Opinion[]>([]);
  const [cargando, setCargando] = useState(true);
  const pista = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/opinion`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Opinion[]) => setOpiniones(Array.isArray(data) ? data : []))
      .catch(() => setOpiniones([]))
      .finally(() => setCargando(false));
  }, []);

  // Mientras llegan: la flor pequeña y debajo una frase en cursiva.
  if (cargando) {
    return (
      <Flex direction="column" align="center" gap={3} py={{ base: 10, md: 14 }}>
        <LifeLoader size="44px" />
        <Text color={T} fontFamily="'EB Garamond', serif" fontStyle="italic" fontSize={{ base: "md", md: "lg" }}>
          {t("opiniones.cargando")}
        </Text>
      </Flex>
    );
  }

  if (opiniones.length === 0) return null;

  const mover = (sentido: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    el.scrollBy({ left: sentido * Math.max(280, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <Box w="100%">
      {/* Tercer apartado: con la foto de mármol de fondo. */}
      <BandaFoto>
      <Flex direction="column" align="center" maxW="1180px" mx="auto" px={{ base: 5, md: 10, lg: 16 }} gap={{ base: 6, md: 8 }}>
        <Reveal inView direction="up" distance={20} blur duration={1}>
          <Text color={T} fontFamily="'EB Garamond', serif" fontWeight="700" textAlign="center" fontSize={{ base: "md", md: "lg", lg: "xl" }} letterSpacing="0.04em">
            {t("opiniones.titulo")}
          </Text>
        </Reveal>

        <Reveal inView direction="up" distance={30} scaleFrom={0.97} duration={1.1} delay={0.15} w="100%">
          <Flex align="center" gap={{ base: 0, md: 4 }} w="100%">
            <Flecha dir="izq" onClick={() => mover(-1)} label="‹" />
            <Flex
              ref={pista}
              flex="1"
              minW={0}
              gap={{ base: 4, md: 5 }}
              align="stretch"
              overflowX="auto"
              sx={{
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                WebkitOverflowScrolling: "touch",
              }}
              pb={1}
            >
              {opiniones.map((op) => (
                <Flex
                  key={op.id}
                  direction="column"
                  gap={4}
                  flex="0 0 auto"
                  w={{ base: "82%", sm: "340px", md: "calc((100% - 40px) / 3)" }}
                  px={{ base: 6, md: 7 }}
                  py={{ base: 7, md: 8 }}
                  borderRadius="2xl"
                  bg="transparent"
                  border={`1.5px solid ${T}55`}
                  sx={{ scrollSnapAlign: "start" }}
                >
                  <Text color={T} fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }} lineHeight="1.65" fontStyle="italic" flex="1">
                    {op.texto}
                  </Text>
                  <Box h="1px" w="64px" bgGradient={`linear(to-r, ${T}cc, ${T}00)`} />
                  <Text color={T} fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.06em">
                    {op.nombre}
                  </Text>
                </Flex>
              ))}
            </Flex>
            <Flecha dir="dcha" onClick={() => mover(1)} label="›" />
          </Flex>
        </Reveal>
      </Flex>
      </BandaFoto>
      <Box h={{ base: 8, md: 12 }} />
    </Box>
  );
};

export default WelcomeOpiniones;
