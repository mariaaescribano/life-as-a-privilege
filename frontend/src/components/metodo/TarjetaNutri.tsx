import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";

// Tarjeta al estilo de las de Fisiología · «Todas tus células» (CelulaCard):
// fondo de la disciplina, foto 1:1, rayita, título y «Leer más →». Con el fondo
// de Nutrición. Al pincharla se abre su ficha tipo cómic (NutrienteFichaModal).
export function TarjetaNutri({ titulo, foto, onClick }: { titulo: string; foto?: string; onClick?: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <Box
      as="button"
      onClick={onClick}
      textAlign="left"
      position="relative"
      overflow="hidden"
      w="100%"
      h="100%"
      borderRadius="2xl"
      border={`1px solid ${nutricionTxt}33`}
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      boxShadow={`0 4px 18px rgba(0,0,0,0.22), 0 0 16px ${nutricionTxt}26`}
      transition="all 0.22s ease"
      _hover={{ transform: "translateY(-4px)", borderColor: `${nutricionTxt}88`,
                boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 26px ${nutricionTxt}55` }}
      _active={{ transform: "translateY(-1px)" }}
    >
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" />

      <Flex direction="column" position="relative" zIndex={1} p={{ base: 4, md: 5 }} gap={3} h="100%">
        {/* Foto 1:1 */}
        <Box borderRadius="lg" overflow="hidden" w="100%" aspectRatio={1} bg={`${nutricionTxt}14`}
             boxShadow="0 4px 16px rgba(0,0,0,0.28)" flexShrink={0}
             display="flex" alignItems="center" justifyContent="center">
          {foto && !imgErr ? (
            <Image src={encodeURI(foto)} alt={titulo} w="100%" h="100%" objectFit="cover"
                   onError={() => setImgErr(true)} />
          ) : (
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                 w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }} fill={`${nutricionTxt}55`}>
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
            </Box>
          )}
        </Box>

        {/* Rayita separadora */}
        <Box alignSelf="center" w="54px" h="1px" borderRadius="full"
             bgGradient={`linear(to-r, transparent, ${nutricionTxt}, transparent)`} my={1} />

        {/* Título */}
        <Text color={nutricionTxt} fontWeight="700" fontSize={{ base: "lg", md: "xl" }} textAlign="center"
              lineHeight="1.25" letterSpacing="0.02em" style={{ textShadow: `0 1px 4px ${nutricionBg}` }}>
          {titulo}
        </Text>

        {/* Leer más → */}
        <Flex align="center" justify="flex-end" gap={1.5} mt="auto" pt={2} color={nutricionTxt}>
          <Text as="span" fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" letterSpacing="0.08em">
            Leer más
          </Text>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="14px" h="14px" fill="currentColor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
