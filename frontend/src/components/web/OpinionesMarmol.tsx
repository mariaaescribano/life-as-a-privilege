import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import BandaMarmol from "../global/BandaMarmol";
import { Reveal } from "../global/Reveal";
import { API_URL } from "../../GlobalVariables";
import type { Opinion } from "../../dtos/opinion.type";
import { useT } from "../../i18n";

const TINTA = "#004f4f";
const ORO = "#b08d3f";

// Banda de mármol con las tres últimas experiencias de clientes, en una misma
// fila (en móvil, una debajo de otra). Sin opiniones publicadas no pinta nada.
export default function OpinionesMarmol() {
  const t = useT();
  const [opiniones, setOpiniones] = useState<Opinion[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/opinion`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Opinion[]) => setOpiniones(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setOpiniones([]));
  }, []);

  if (opiniones.length === 0) return null;

  return (
    <BandaMarmol>
      {(visible) => (
        <Box w="100%" maxW="1100px" mx="auto" px={{ base: 5, md: 10, lg: 16 }}>
          <Reveal activo={visible} direction="up" distance={20} duration={0.8}>
            <Text
              textAlign="center"
              color={TINTA}
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "3xl", md: "5xl" }}
              letterSpacing="0.06em"
              lineHeight="1.15"
              mb={{ base: 8, md: 12 }}
            >
              {t("opiniones.titulo")}
            </Text>
          </Reveal>
          <Flex direction={{ base: "column", md: "row" }} gap={{ base: 5, md: 8 }}>
            {opiniones.map((op, i) => (
              <Reveal
                key={op.id}
                activo={visible}
                direction="up"
                distance={40}
                scaleFrom={0.96}
                duration={1}
                delay={0.5 + i * 0.6}
                flex="1"
                display="flex"
              >
                <Flex
                  flex="1"
                  direction="column"
                  gap={4}
                  px={{ base: 6, md: 7 }}
                  py={{ base: 7, md: 8 }}
                  borderRadius="2xl"
                  bg="transparent"
                  border={`1.5px solid ${TINTA}55`}
                  boxShadow={`0 0 16px ${ORO}22, 0 0 36px ${ORO}12`}
                >
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.65" fontStyle="italic" flex="1">
                    {op.texto}
                  </Text>
                  <Box h="1px" w="64px" bgGradient={`linear(to-r, ${TINTA}cc, ${TINTA}00)`} />
                  <Text color={TINTA} fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.06em">
                    {op.nombre}
                  </Text>
                </Flex>
              </Reveal>
            ))}
          </Flex>
        </Box>
      )}
    </BandaMarmol>
  );
}
