import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { MarcaLeido } from "./MarcaLeido";
import { glowHeader } from "./FotoBox";
import { ayurvedaBg, ayurvedaNom, ayurvedaTxt } from "../../GlobalVariables";
import { chakraFoto, type Chakra } from "../../hardCoded/metodo/chakras";

// ─────────────────────────────────────────────────────────────────────────
// ChakraBox — la caja de UN chakra en el mapa de los chakras.
//
// NO es el FotoBox por defecto: aquí la foto NO va a sangre. Es una foto
// PEQUEÑA, centrada arriba dentro de un círculo con el color del chakra, y
// debajo su nombre. Así se lee la fila de siete como una constelación de
// símbolos y no como un mosaico de fotos.
//
//   ┌──────────────────┐
//   │       ( ◯ )      │  ← foto pequeña centrada (contain, nunca recortada)
//   │    Mūlādhāra     │  ← nombre en sánscrito
//   │   Chakra raíz    │  ← su nombre de siempre
//   └──────────────────┘
//
// Fondo: el de Hinduismo (DisciplinaBgLayer), como el resto del recorrido.
// Tinta: ayurvedaTxt. El color del chakra SOLO tiñe el halo, el anillo de la
// foto y la línea: la letra va siempre en la tinta de la disciplina.
// ─────────────────────────────────────────────────────────────────────────

export function ChakraBox({
  chakra,
  leido = false,
  onClick,
  /** La caja ancha de la corona (arriba del todo): foto y letra un poco mayores. */
  ancho = false,
}: {
  chakra: Chakra;
  leido?: boolean;
  onClick: () => void;
  ancho?: boolean;
}) {
  const [imgErr, setImgErr] = useState(false);
  const foto = chakraFoto(chakra.key);
  const hayFoto = !imgErr;
  const c = chakra.color;

  return (
    <Box
      as="button"
      onClick={onClick}
      role="group"
      position="relative"
      overflow="hidden"
      w="100%"
      h="100%"
      borderRadius="2xl"
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      boxShadow={`${glowHeader(ayurvedaTxt)}, 0 0 22px ${c}22`}
      transition="transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: `${glowHeader(ayurvedaTxt)}, 0 0 34px ${c}55`,
      }}
      _active={{ transform: "translateY(-1px) scale(0.985)" }}
      sx={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
    >
      <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}26`} />

      {leido && <MarcaLeido tinta={ayurvedaTxt} bg={ayurvedaBg} />}

      <Flex
        position="relative"
        zIndex={1}
        direction="column"
        align="center"
        justify="center"
        textAlign="center"
        gap={{ base: 2, md: 2.5 }}
        px={{ base: 3, md: 5 }}
        py={{ base: 4, md: ancho ? 6 : 5 }}
        h="100%"
      >
        {/* El mandala, pequeño y centrado. Ya viene recortado en círculo sobre
            transparente y con su propio borde de acuarela, así que va SIN
            anillo ni relleno de color: cualquiera de los dos le pintaba un filo
            duro justo encima del suyo. Solo un halo por detrás, del color del
            chakra, que es lo que lo asienta sobre el fondo de la caja. */}
        <Flex
          align="center"
          justify="center"
          flexShrink={0}
          w={ancho ? { base: "84px", md: "112px" } : { base: "68px", md: "90px" }}
          h={ancho ? { base: "84px", md: "112px" } : { base: "68px", md: "90px" }}
          borderRadius="full"
          bg={hayFoto ? "transparent" : `${c}18`}
          border={hayFoto ? "none" : `1.5px solid ${c}66`}
          boxShadow={`0 0 18px ${c}3a`}
          transition="transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease"
          _groupHover={{ transform: "scale(1.07)", boxShadow: `0 0 30px ${c}66` }}
        >
          {hayFoto ? (
            <Image
              src={encodeURI(foto)}
              alt={chakra.nombre}
              w="100%"
              h="100%"
              objectFit="contain"
              onError={() => setImgErr(true)}
            />
          ) : (
            // Sin foto todavía: su número, que es lo que de verdad lo ordena.
            <Text color={c} fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" lineHeight="1">
              {chakra.n}
            </Text>
          )}
        </Flex>

        <Box>
          <Text
            color={ayurvedaTxt}
            fontSize={ancho ? { base: "lg", md: "2xl" } : { base: "md", md: "xl" }}
            fontWeight="700"
            lineHeight="1.2"
            letterSpacing="0.02em"
            style={{ textShadow: `0 1px 4px ${ayurvedaBg}, 0 0 10px ${ayurvedaBg}` }}
            transition="transform 0.3s cubic-bezier(0.22,1,0.36,1)"
            _groupHover={{ transform: "translateY(-1px)" }}
          >
            {chakra.nombre}
          </Text>
          <Text
            color={`${ayurvedaTxt}bb`}
            fontSize={{ base: "xs", md: "sm" }}
            fontStyle="italic"
            lineHeight="1.35"
            mt="2px"
            style={{ textShadow: `0 1px 4px ${ayurvedaBg}` }}
          >
            {chakra.castellano}
          </Text>
        </Box>

        {/* Rayita del color del chakra: lo único que lo distingue de un vistazo. */}
        <Box h="2px" w={{ base: "34px", md: "46px" }} borderRadius="full" bg={c}
             boxShadow={`0 0 8px ${c}`} transition="width 0.3s ease"
             _groupHover={{ w: { base: "48px", md: "66px" } }} />
      </Flex>
    </Box>
  );
}
