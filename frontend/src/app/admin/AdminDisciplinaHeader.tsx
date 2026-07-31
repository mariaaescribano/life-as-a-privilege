import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { glowHeader } from "../../components/metodo/FotoBox";
import type { AdminDisciplina } from "../../data/adminDisciplinas";

/** Header con el icono + nombre de la disciplina para el panel admin.
 *
 *  Siempre lleva de fondo la IMAGEN de la disciplina (Astrología: el cielo
 *  estrellado) con un velo tenue de su propio color, igual que el resto de
 *  cajas del panel. El texto va en `disc.txt` con halo de `disc.bg` para que se
 *  siga leyendo sobre la foto.
 *
 *  Con `fotoTalCual` se quita ese velo y la foto se ve con su color real (lo
 *  usa el panel de Astrología). */
export function AdminDisciplinaHeader({
  disc,
  subtitle,
  fotoTalCual = false,
}: {
  disc: AdminDisciplina;
  subtitle?: string;
  fotoTalCual?: boolean;
}) {
  const Icon = disc.Icon;
  const conImagen = hasDisciplinaBg(disc.nombre);
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
      // Glow, nunca sombra negra: el MISMO halo que la cabecera del recorrido
      // (glowHeader), así el panel se ve de la misma familia que el recorrido.
      boxShadow={glowHeader(disc.txt)}
    >
      {conImagen && (
        <DisciplinaBgLayer nom={disc.nombre} borderRadius="2xl" overlay={`${disc.bg}59`} talCual={fotoTalCual} />
      )}
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
