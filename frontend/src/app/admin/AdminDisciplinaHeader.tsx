import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import type { AdminDisciplina } from "../../data/adminDisciplinas";

/** Header con el icono + nombre de la disciplina para el panel admin.
 *  Fondo = color SÓLIDO de la disciplina, a plena intensidad: sin imagen y sin
 *  velo de opacidad, de modo que el color se vea puro. Texto y borde en el
 *  color propio de la disciplina (disc.txt). */
export function AdminDisciplinaHeader({ disc, subtitle }: { disc: AdminDisciplina; subtitle?: string }) {
  const Icon = disc.Icon;
  return (
    <Box
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      mb={6}
      bg={disc.bg}
      border={`1.5px solid ${disc.txt}`}
      boxShadow={`0 6px 24px rgba(0,0,0,0.22), 0 0 16px ${disc.txt}22`}
    >
      <Flex align="center" gap={4} px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>
        <Box flexShrink={0} display="flex" alignItems="center" justifyContent="center"
             style={{ filter: `drop-shadow(0 0 4px ${disc.txt}44)` }}>
          <Icon size={{ base: "40px", md: "50px" }} />
        </Box>
        <Box minW={0}>
          <Text color={disc.txt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em"
                textTransform="capitalize" noOfLines={1}>
            {disc.nombre}
          </Text>
          {subtitle && (
            <Text color={disc.txt} fontSize={{ base: "sm", md: "md" }} noOfLines={1} mt={0.5}>
              {subtitle}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
