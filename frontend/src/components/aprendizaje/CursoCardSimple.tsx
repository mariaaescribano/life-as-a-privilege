import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import type { Curso } from "../../hardCoded/cursos";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { sombraTexto } from "../global/disciplinaSombras";
import { FlechaBonita } from "../global/FlechaBonita";
import { recordarOrigenCurso } from "../global/VolverAlMapa";
import { glowSuave, glowSuaveHover } from "../metodo/FotoBox";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";

/**
 * Tarjeta de curso, lo más simple posible: de fondo, la foto de SU disciplina; encima, en una fila,
 * el icono de la disciplina · el nombre del curso · una flecha. Sin foto de curso, sin número, sin precio.
 * La tarjeta entera es el botón: al pasar el ratón la foto hace zoom, el halo crece y la flecha avanza.
 * Sin velo oscuro: la legibilidad la da `sombraTexto` de la disciplina.
 */
export function CursoCardSimple({ curso, color, bgColor, nom }: { curso: Curso; color: string; bgColor: string; nom: string }) {
  const abrir = () => {
    if (curso.precio === null) {
      // Si se entra desde el Mapa, se recuerda el origen para el botón «Volver al Mapa».
      recordarOrigenCurso();
      window.open(curso.cursoLink, "_blank");
    } else window.open(STRIPE_PAYMENT_LINK, "_blank");
  };
  const sombra = sombraTexto(nom, bgColor);

  return (
    <Box
      as="button"
      type="button"
      role="group"
      onClick={abrir}
      aria-label={curso.titulo}
      position="relative"
      overflow="hidden"
      display="block"
      w="100%"
      textAlign="left"
      borderRadius="2xl"
      bg={bgColor}
      cursor="pointer"
      boxShadow={glowSuave(color)}
      transition="box-shadow 0.45s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)"
      _hover={{ boxShadow: glowSuaveHover(color), transform: "translateY(-4px)" }}
      _focusVisible={{ outline: `2px solid ${color}`, outlineOffset: "3px" }}
    >
      {/* Foto de la disciplina, con el zoom lento al pasar el ratón. */}
      <Box position="absolute" inset={0} transition="transform 1s cubic-bezier(0.22,1,0.36,1)" _groupHover={{ transform: "scale(1.06)" }}>
        <DisciplinaBgLayer nom={nom} borderRadius="2xl" />
      </Box>

      <Flex position="relative" zIndex={1} align="center" gap={{ base: 3, md: 4 }} px={{ base: 5, md: 6 }} py={{ base: 6, md: 7 }} minH={{ base: "96px", md: "112px" }}>
        {/* Icono de la disciplina */}
        <Box
          flexShrink={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          w={{ base: "38px", md: "46px" }}
          sx={{ "& svg, & img": { width: "100%", height: "auto", maxHeight: "100%" } }}
          style={{ filter: `drop-shadow(0 0 6px ${bgColor})` }}
        >
          {curso.icon}
        </Box>

        <Text
          flex="1"
          minW={0}
          color={color}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "lg", md: "xl" }}
          lineHeight="1.25"
          letterSpacing="0.02em"
          noOfLines={2}
          title={curso.titulo}
          style={{ textShadow: sombra }}
        >
          {curso.titulo}
        </Text>

        <Box
          color={color}
          flexShrink={0}
          display="flex"
          alignItems="center"
          transition="transform 0.45s cubic-bezier(0.22,1,0.36,1)"
          _groupHover={{ transform: "translateX(6px)" }}
          style={{ filter: `drop-shadow(0 0 6px ${bgColor})` }}
        >
          <FlechaBonita size={{ base: "26px", md: "32px" }} />
        </Box>
      </Flex>
    </Box>
  );
}

export default CursoCardSimple;
