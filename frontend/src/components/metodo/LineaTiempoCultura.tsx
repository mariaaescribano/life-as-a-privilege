import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import type { HitoHistoria } from "./culturaHistoriaUniversal";

// ─────────────────────────────────────────────────────────────────────────
// Línea de tiempo de Cultura: una línea horizontal con círculos (foto de cada
// hito). El título + año de cada hito se alternan arriba/abajo de la línea para
// que respire. Al pulsar un círculo se llama a onSelect(key) (abre su cómic).
//
// En pantallas estrechas la línea hace scroll horizontal (mantiene la metáfora
// de línea de tiempo). Reutilizable por todas las Historias de Cultura.
// ─────────────────────────────────────────────────────────────────────────

function CirculoFoto({
  hito,
  tinta,
  bg,
  onClick,
}: {
  hito: HitoHistoria;
  tinta: string;
  bg: string;
  onClick: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  const hayFoto = !!hito.foto && !imgErr;
  return (
    <Box
      as="button"
      onClick={onClick}
      position="relative"
      zIndex={1}
      flexShrink={0}
      w={{ base: "86px", md: "116px" }}
      h={{ base: "86px", md: "116px" }}
      borderRadius="full"
      overflow="hidden"
      cursor="pointer"
      bg={bg}
      border={`2px solid ${tinta}aa`}
      boxShadow={`0 0 0 6px ${bg}, 0 0 18px ${tinta}55, 0 0 40px ${tinta}22`}
      transition="all 0.22s ease"
      _hover={{ transform: "scale(1.06)", borderColor: tinta, boxShadow: `0 0 0 6px ${bg}, 0 0 26px ${tinta}99, 0 0 60px ${tinta}44` }}
      _active={{ transform: "scale(1.02)" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {hayFoto ? (
        <Image src={encodeURI(hito.foto!)} alt={hito.titulo} w="100%" h="100%" objectFit="cover"
               onError={() => setImgErr(true)} />
      ) : (
        // Marcador mientras no hay foto: un destello suave con la inicial del año.
        <Box
          as="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          w={{ base: "30px", md: "40px" }}
          h={{ base: "30px", md: "40px" }}
          fill={`${tinta}aa`}
          style={{ filter: `drop-shadow(0 0 8px ${tinta}66)` }}
        >
          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
        </Box>
      )}
    </Box>
  );
}

function Etiqueta({ hito, tinta, arriba }: { hito: HitoHistoria; tinta: string; arriba: boolean }) {
  return (
    <Box
      position="absolute"
      left="50%"
      transform="translateX(-50%)"
      w={{ base: "120px", md: "150px" }}
      textAlign="center"
      pointerEvents="none"
      {...(arriba
        ? { bottom: "calc(100% + 16px)" }
        : { top: "calc(100% + 16px)" })}
    >
      <Text
        color={tinta}
        fontSize={{ base: "sm", md: "md" }}
        fontWeight="700"
        lineHeight="1.25"
        letterSpacing="0.02em"
        style={{ textShadow: `0 1px 3px #0c3c3cf5, 0 0 10px ${tinta}55` }}
      >
        {hito.titulo}
      </Text>
      <Text
        color={`${tinta}bb`}
        fontSize={{ base: "xs", md: "sm" }}
        fontStyle="italic"
        letterSpacing="0.04em"
        mt={0.5}
        style={{ textShadow: `0 1px 3px #0c3c3cf5` }}
      >
        {hito.anio}
      </Text>
    </Box>
  );
}

export function LineaTiempoCultura({
  hitos,
  tinta,
  bg,
  onSelect,
}: {
  hitos: HitoHistoria[];
  tinta: string;
  bg: string;
  onSelect: (key: string) => void;
}) {
  return (
    <Box
      w="100%"
      overflowX="auto"
      overflowY="hidden"
      // Espacio arriba/abajo para las etiquetas (que van fuera del círculo).
      py={{ base: "92px", md: "104px" }}
      sx={{
        // Scrollbar discreta.
        "::-webkit-scrollbar": { height: "6px" },
        "::-webkit-scrollbar-thumb": { background: `${tinta}44`, borderRadius: "3px" },
      }}
    >
      <Flex
        position="relative"
        align="center"
        justify={{ base: "flex-start", md: "center" }}
        gap={{ base: 8, md: 14 }}
        w="max-content"
        minW="100%"
        px={{ base: 6, md: 4 }}
        mx="auto"
      >
        {/* Línea horizontal que une los círculos (detrás de ellos). */}
        <Box
          position="absolute"
          top="50%"
          left={{ base: 6, md: 10 }}
          right={{ base: 6, md: 10 }}
          h="2px"
          transform="translateY(-50%)"
          zIndex={0}
          style={{ background: `linear-gradient(90deg, transparent, ${tinta}88 12%, ${tinta}88 88%, transparent)` }}
        />

        {hitos.map((hito, i) => (
          <Box key={hito.key} position="relative" flexShrink={0} display="flex" alignItems="center" justifyContent="center">
            <Etiqueta hito={hito} tinta={tinta} arriba={i % 2 === 0} />
            <CirculoFoto hito={hito} tinta={tinta} bg={bg} onClick={() => onSelect(hito.key)} />
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
