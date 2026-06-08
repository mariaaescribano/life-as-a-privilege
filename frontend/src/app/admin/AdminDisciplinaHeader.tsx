import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import type { AdminDisciplina } from "../../data/adminDisciplinas";

/** Header con la imagen/fondo de la disciplina (icono + nombre), para el panel admin. */
export function AdminDisciplinaHeader({ disc, subtitle }: { disc: AdminDisciplina; subtitle?: string }) {
  const Icon = disc.Icon;
  return (
    <Box
      position="relative"
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      mb={6}
      border={`1px solid ${disc.txt}44`}
      boxShadow={`0 0 22px rgba(255,255,255,0.18), 0 0 40px ${disc.txt}33, 0 6px 24px rgba(0,0,0,0.3)`}
    >
      {hasDisciplinaBg(disc.nombre) && (
        <DisciplinaBgLayer nom={disc.nombre} borderRadius="2xl" overlay="rgba(8,13,30,0.5)" />
      )}
      <Flex position="relative" zIndex={1} align="center" gap={4} px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>
        <Box flexShrink={0} display="flex" alignItems="center" justifyContent="center"
             style={{ filter: `drop-shadow(0 0 8px ${disc.txt}88)` }}>
          <Icon size={{ base: "40px", md: "50px" }} />
        </Box>
        <Box minW={0}>
          <Text color="#ffffff" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em"
                textTransform="capitalize" noOfLines={1}
                style={{ textShadow: `0 2px 10px rgba(0,0,0,0.75), 0 0 18px ${disc.txt}88` }}>
            {disc.nombre}
          </Text>
          {subtitle && (
            <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }} noOfLines={1}
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
              {subtitle}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
