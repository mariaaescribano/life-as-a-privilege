import React, { useEffect } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

/* ═══════════════════════════════════════════
   TIPO EXPORTADO
═══════════════════════════════════════════ */
export type ArrowRelation = {
  fromName: string;
  fromChinese: string;
  toName: string;
  toChinese: string;
  color1: string;      // iconColor del elemento origen
  color2: string;      // iconColor del elemento destino
  cycleLabel: string;  // e.g., "Ciclo Generador · 相生"
  verb: string;        // e.g., "engendra" / "controla"
  description: string;
};

/* ═══════════════════════════════════════════
   MODAL
   bg = blanco con degradado sutil de los 2 colores
   texto = negro (legible)
═══════════════════════════════════════════ */
const TCMArrowModal = ({
  relation,
  onClose,
}: {
  relation: ArrowRelation;
  onClose: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <Box
      position="fixed" inset={0} zIndex={1200}
      bg="rgba(0,0,0,0.68)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      py={6}
      onClick={onClose}
    >
      {/* Panel — blanco base + degradado de los 2 colores */}
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="95vw"
        maxW="680px"
        maxH="90vh"
        overflowY="auto"
        borderRadius="24px"
        bg="white"
        sx={{
          backgroundImage: `linear-gradient(135deg, ${relation.color1}48 0%, ${relation.color2}48 100%)`,
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: `linear-gradient(${relation.color1}, ${relation.color2})`,
            borderRadius: "999px",
          },
        }}
        boxShadow="0 32px 80px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.18)"
      >
        {/* Botón cerrar */}
        <Box
          as="button"
          position="absolute" top="13px" right="13px"
          w="34px" h="34px" borderRadius="full"
          bg="rgba(0,0,0,0.08)"
          border="1px solid rgba(0,0,0,0.14)"
          display="flex" alignItems="center" justifyContent="center"
          color="rgba(0,0,0,0.52)"
          fontSize="15px" fontWeight="700"
          cursor="pointer"
          _hover={{ bg: "rgba(0,0,0,0.14)" }}
          onClick={onClose}
        >
          ✕
        </Box>

        <Box px={{ base: 6, md: 10 }} pt={10} pb={10}>

          {/* ── Etiqueta de ciclo ── */}
          <Text
            color="rgba(0,0,0,0.42)"
            fontSize="xs"
            letterSpacing="0.22em"
            textTransform="uppercase"
            fontFamily="'EB Garamond', serif"
            textAlign="center"
            mb={5}
          >
            {relation.cycleLabel}
          </Text>

          {/* ── Relación: Origen → Destino ── */}
          <Flex align="center" justify="center" gap={{ base: 3, md: 5 }} mb={3}>
            {/* Elemento origen */}
            <Box textAlign="right" flex="1">
              <Text
                color={relation.color1}
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                fontFamily="'EB Garamond', serif"
                lineHeight="1.1"
              >
                {relation.fromName}
              </Text>
              <Text
                color={relation.color1 + "bb"}
                fontSize="sm"
                fontStyle="italic"
                letterSpacing="0.04em"
              >
                {relation.fromChinese}
              </Text>
            </Box>

            {/* Flecha central */}
            <Flex direction="column" align="center" flexShrink={0} gap={0.5}>
              <Box
                w={{ base: "36px", md: "46px" }}
                h="2px"
                sx={{
                  backgroundImage: `linear-gradient(90deg, ${relation.color1}, ${relation.color2})`,
                }}
                borderRadius="full"
              />
              <Text
                fontSize={{ base: "20px", md: "26px" }}
                lineHeight="1"
                sx={{
                  background: `linear-gradient(90deg, ${relation.color1}, ${relation.color2})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                →
              </Text>
              <Text
                color="rgba(0,0,0,0.45)"
                fontSize="xs"
                fontStyle="italic"
                fontFamily="'EB Garamond', serif"
                letterSpacing="0.06em"
              >
                {relation.verb}
              </Text>
            </Flex>

            {/* Elemento destino */}
            <Box textAlign="left" flex="1">
              <Text
                color={relation.color2}
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                fontFamily="'EB Garamond', serif"
                lineHeight="1.1"
              >
                {relation.toName}
              </Text>
              <Text
                color={relation.color2 + "bb"}
                fontSize="sm"
                fontStyle="italic"
                letterSpacing="0.04em"
              >
                {relation.toChinese}
              </Text>
            </Box>
          </Flex>

          {/* Línea decorativa degradada */}
          <Flex justify="center" mb={6}>
            <Box
              w="120px" h="1.5px" borderRadius="full"
              sx={{
                backgroundImage: `linear-gradient(90deg, ${relation.color1}60, ${relation.color2}60)`,
              }}
            />
          </Flex>

          {/* ── Descripción ── */}
          <Text
            color="rgba(10,5,5,0.80)"
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="1.90"
            fontFamily="'EB Garamond', serif"
          >
            {relation.description}
          </Text>

        </Box>
      </Box>
    </Box>
  );
};

export default TCMArrowModal;
