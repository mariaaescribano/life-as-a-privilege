// ─────────────────────────────────────────────────────────────────────────────
// BarraSuplantacion — el recordatorio de «estás dentro de la cuenta de…».
//
// Sale SOLO en el navegador de la admin que ha entrado como otra persona desde
// /admin/usuarios (ver api/suplantar.ts). La persona suplantada no ve nada de
// esto: en su pantalla no cambia absolutamente nada.
//
// Por qué se ve aunque sea discreto: mientras está puesta, todo lo que se
// escriba (un test, una nota, un paso marcado como leído) se guarda en el
// recorrido de esa persona, no en el de la admin. Sin el aviso es cuestión de
// tiempo escribir en la cuenta de otra creyendo estar en la propia.
//
// Va abajo a la DERECHA porque abajo a la izquierda vive el botón de «Mis
// notas» (MiniDiario).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { salirDeLaSuplantacion, suplantacionActiva } from "../../api/suplantar";

export default function BarraSuplantacion() {
  // Se lee una sola vez: la sesión no cambia de dueña sin recargar la página.
  const [quien] = useState(() => suplantacionActiva());
  const [encogida, setEncogida] = useState(false);

  if (!quien) return null;

  // Encogida: queda solo el ojo, para que no estorbe al mirar una página.
  if (encogida) {
    return (
      <Flex
        as="button"
        onClick={() => setEncogida(false)}
        title={`Estás en la cuenta de ${quien.name}`}
        position="fixed"
        bottom={{ base: "18px", md: "26px" }}
        right={{ base: "16px", md: "26px" }}
        zIndex={1500}
        align="center"
        justify="center"
        w={{ base: "44px", md: "50px" }}
        h={{ base: "44px", md: "50px" }}
        borderRadius="full"
        bg="rgba(0,60,60,0.92)"
        border="1.5px solid #f0c674"
        cursor="pointer"
        style={{ boxShadow: "0 0 14px rgba(240,198,116,0.45)" }}
        _hover={{ bg: "rgba(0,80,80,0.95)" }}
      >
        <Text fontSize="lg" lineHeight="1">👁</Text>
      </Flex>
    );
  }

  return (
    <Flex
      position="fixed"
      bottom={{ base: "18px", md: "26px" }}
      right={{ base: "16px", md: "26px" }}
      zIndex={1500}
      maxW={{ base: "calc(100vw - 32px)", md: "420px" }}
      align="center"
      gap={{ base: 2.5, md: 3 }}
      pl={{ base: 3, md: 4 }}
      pr={{ base: 2, md: 3 }}
      py={{ base: "9px", md: "11px" }}
      borderRadius="full"
      bg="rgba(0,60,60,0.94)"
      border="1.5px solid #f0c674"
      fontFamily="'EB Garamond', serif"
      style={{ boxShadow: "0 0 16px rgba(240,198,116,0.4), 0 8px 24px rgba(0,0,0,0.35)" }}
    >
      {/* la cara de quien estoy mirando, para no confundirse de cuenta */}
      <Box
        w={{ base: "30px", md: "34px" }}
        h={{ base: "30px", md: "34px" }}
        borderRadius="full"
        overflow="hidden"
        flexShrink={0}
        border="1px solid rgba(240,198,116,0.7)"
      >
        <Image src={quien.img || "/img/icono/noImg.webp"} w="100%" h="100%" objectFit="cover" alt="" />
      </Box>

      <Box minW={0}>
        <Text color="#f0c674" fontSize={{ base: "xs", md: "sm" }} lineHeight="1.25" noOfLines={1}>
          Estás en la cuenta de
        </Text>
        <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight="700" lineHeight="1.25" noOfLines={1}>
          {quien.name}
        </Text>
      </Box>

      <Flex gap={1.5} flexShrink={0} ml={1}>
        <Box
          as="button"
          onClick={() => salirDeLaSuplantacion()}
          px={{ base: 3, md: 4 }}
          py={{ base: "5px", md: "6px" }}
          borderRadius="full"
          bg="rgba(240,198,116,0.18)"
          border="1px solid rgba(240,198,116,0.75)"
          color="#f0c674"
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="700"
          whiteSpace="nowrap"
          cursor="pointer"
          transition="all 0.18s"
          _hover={{ bg: "rgba(240,198,116,0.32)", color: "white" }}
        >
          Salir
        </Box>
        <Box
          as="button"
          onClick={() => setEncogida(true)}
          title="Esconder el aviso"
          w={{ base: "26px", md: "30px" }}
          h={{ base: "26px", md: "30px" }}
          borderRadius="full"
          border="1px solid rgba(240,198,116,0.45)"
          color="rgba(240,198,116,0.85)"
          fontSize={{ base: "sm", md: "md" }}
          lineHeight="1"
          cursor="pointer"
          transition="all 0.18s"
          _hover={{ borderColor: "#f0c674", color: "white" }}
        >
          –
        </Box>
      </Flex>
    </Flex>
  );
}
