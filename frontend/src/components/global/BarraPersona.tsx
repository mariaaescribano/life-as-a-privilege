// ─────────────────────────────────────────────────────────────────────────────
// BarraPersona — la marca de «estás en el camino de esta persona».
//
// Hay dos caminos (el de María y el de la persona) que llegan al mismo sitio, cada
// uno con sus posibilidades. Cuando María abre el de una persona desde Asesorías
// (el mandala de la lista) sigue siendo María, con su sesión: no se hace pasar por
// nadie ni comparte su cuenta. Ve lo que solo ve ella (abrir pasos, escribir
// notas) y lo que escriba en las páginas se guarda en el recorrido de la persona
// (ver api/persona.ts); esta barra deja siempre a la vista de quién es el camino.
//
// Sale SOLO en el navegador de María. La persona no ve nada de esto.
//
// Va abajo a la DERECHA porque abajo a la izquierda viven «Índice» y «Mis notas».
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { salirDeLaPersona, personaActiva } from "../../api/persona";
import { focoBlanco } from "./foco";

const HALO = "0 0 22px rgba(255,255,255,0.32), 0 0 50px rgba(180,255,245,0.14)";

export default function BarraPersona() {
  // Se lee una sola vez: la sesión no cambia de dueña sin recargar la página.
  const [quien] = useState(() => personaActiva());
  const [encogida, setEncogida] = useState(false);

  if (!quien) return null;

  // Encogida: queda solo el mandala, para que no estorbe al mirar una página.
  if (encogida) {
    return (
      <Flex
        as="button"
        type="button"
        onClick={() => setEncogida(false)}
        title={`Camino de ${quien.name}`}
        aria-label={`Camino de ${quien.name}`}
        position="fixed"
        bottom={{ base: "18px", md: "26px" }}
        right={{ base: "16px", md: "26px" }}
        zIndex={1500}
        align="center"
        justify="center"
        w={{ base: "46px", md: "52px" }}
        h={{ base: "46px", md: "52px" }}
        borderRadius="full"
        bg="rgba(0,79,79,0.94)"
        border="1.5px solid rgba(255,255,255,0.8)"
        cursor="pointer"
        boxShadow={HALO}
        transition="all 0.2s"
        _hover={{ bg: "rgba(0,100,100,0.97)", transform: "translateY(-1px)" }}
        _focusVisible={focoBlanco}
      >
        <Image src="/img/icono/life.webp" alt="" w="26px" h="26px" objectFit="contain" />
      </Flex>
    );
  }

  return (
    <Flex
      position="fixed"
      bottom={{ base: "18px", md: "26px" }}
      right={{ base: "16px", md: "26px" }}
      zIndex={1500}
      maxW={{ base: "calc(100vw - 32px)", md: "440px" }}
      align="center"
      gap={{ base: 2.5, md: 3 }}
      pl={{ base: 3, md: 4 }}
      pr={{ base: 2, md: 3 }}
      py={{ base: "9px", md: "11px" }}
      borderRadius="full"
      bg="rgba(0,79,79,0.94)"
      border="1.5px solid rgba(255,255,255,0.8)"
      fontFamily="'EB Garamond', serif"
      boxShadow={HALO}
    >
      {/* la cara de la persona, para no confundirse de espacio */}
      <Box
        w={{ base: "30px", md: "34px" }}
        h={{ base: "30px", md: "34px" }}
        borderRadius="full"
        overflow="hidden"
        flexShrink={0}
        border="1px solid rgba(255,255,255,0.7)"
      >
        <Image src={quien.img || "/img/icono/noImg.webp"} w="100%" h="100%" objectFit="cover" alt="" />
      </Box>

      <Box minW={0}>
        <Text color="rgba(255,255,255,0.8)" fontSize={{ base: "xs", md: "sm" }} lineHeight="1.25" noOfLines={1}>
          Camino de
        </Text>
        <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight="700" lineHeight="1.25" noOfLines={1}>
          {quien.name}
        </Text>
      </Box>

      <Flex gap={1.5} flexShrink={0} ml={1}>
        <Box
          as="button"
          type="button"
          onClick={() => salirDeLaPersona()}
          px={{ base: 3, md: 4 }}
          py={{ base: "5px", md: "6px" }}
          borderRadius="full"
          bg="white"
          border="1px solid white"
          color="#008080"
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="700"
          whiteSpace="nowrap"
          cursor="pointer"
          transition="all 0.18s"
          _hover={{ bg: "#e8fffc", transform: "translateY(-1px)" }}
          _focusVisible={focoBlanco}
        >
          Volver a Asesorías
        </Box>
        <Box
          as="button"
          type="button"
          onClick={() => setEncogida(true)}
          title="Esconder la barra"
          aria-label="Esconder la barra"
          w={{ base: "26px", md: "30px" }}
          h={{ base: "26px", md: "30px" }}
          borderRadius="full"
          border="1px solid rgba(255,255,255,0.5)"
          color="rgba(255,255,255,0.9)"
          fontSize={{ base: "sm", md: "md" }}
          lineHeight="1"
          cursor="pointer"
          transition="all 0.18s"
          _hover={{ borderColor: "white", color: "white" }}
          _focusVisible={focoBlanco}
        >
          –
        </Box>
      </Flex>
    </Flex>
  );
}
