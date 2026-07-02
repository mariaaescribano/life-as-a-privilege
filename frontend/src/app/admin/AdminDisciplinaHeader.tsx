import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import type { AdminDisciplina } from "../../data/adminDisciplinas";

/** Header con el icono + nombre de la disciplina para el panel admin.
 *
 *  - `imagen` (por defecto false): variante SÓLIDA de color de la disciplina,
 *    a plena intensidad, sin imagen ni velo — se usa en la lista de usuarios
 *    (/admin/:disciplina).
 *  - `imagen` = true: muestra la IMAGEN de la disciplina de fondo (con un velo
 *    tenue del color propio) — se usa al ver los datos de un usuario. */
export function AdminDisciplinaHeader({
  disc,
  subtitle,
  imagen = false,
}: {
  disc: AdminDisciplina;
  subtitle?: string;
  imagen?: boolean;
}) {
  const Icon = disc.Icon;
  const conImagen = imagen && hasDisciplinaBg(disc.nombre);
  const glow = `0 1px 3px ${disc.bg}, 0 0 12px ${disc.bg}`;

  return (
    <Box
      position="relative"
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      mb={6}
      bg={disc.bg}
      border={`1.5px solid ${disc.txt}`}
      boxShadow={`0 6px 24px rgba(0,0,0,0.22), 0 0 16px ${disc.txt}22`}
    >
      {conImagen && <DisciplinaBgLayer nom={disc.nombre} borderRadius="2xl" overlay={`${disc.bg}59`} />}
      <Flex position="relative" zIndex={1} align="center" gap={4} px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>
        <Box flexShrink={0} display="flex" alignItems="center" justifyContent="center"
             style={{ filter: `drop-shadow(0 0 5px ${disc.txt}66)` }}>
          <Icon size={{ base: "40px", md: "50px" }} />
        </Box>
        <Box minW={0}>
          <Text color={disc.txt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.04em"
                textTransform="capitalize" noOfLines={1}
                style={conImagen ? { textShadow: glow } : undefined}>
            {disc.nombre}
          </Text>
          {subtitle && (
            <Text color={disc.txt} fontSize={{ base: "sm", md: "md" }} noOfLines={1} mt={0.5}
                  style={conImagen ? { textShadow: glow } : undefined}>
              {subtitle}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
