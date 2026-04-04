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
  video?: string;      // ID de YouTube — e.g. "dQw4w9WgXcQ"
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

          {/* ── Relación: Origen → Destino ── */}
          <Flex align="center" justify="center" mb="30px" gap={{ base: 3, md: 5 }}>
            {/* Elemento origen */}
            <Box textAlign="right" flex="1">
              <Text
                color={relation.color1}
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                fontFamily="'EB Garamond', serif"
                lineHeight="1.1"
                 style={{
                filter: "drop-shadow(4px 4px 6px rgba(61, 61, 61, 0.5))"
              }}
              >
                {relation.fromName + " "+ relation.fromChinese}
              </Text>
            </Box>

            {/* Flecha central */}
            <Flex direction="column" align="center" flexShrink={0}>
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
            </Flex>

            {/* Elemento destino */}
            <Box textAlign="left" flex="1">
              <Text
                color={relation.color2}
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                fontFamily="'EB Garamond', serif"
                lineHeight="1.1"
                 style={{
                filter: "drop-shadow(4px 4px 6px rgba(61, 61, 61, 0.5))"
              }}
              >
                 {relation.toName + " "+ relation.toChinese}
              </Text>
            </Box>
          </Flex>

          {/* ── Vídeo ── */}
          {relation.video && (
            <Box
              w="100%"
              aspectRatio={16 / 9}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="0 8px 28px rgba(0,0,0,0.30)"
              mb={6}
              bg="rgba(0,0,0,0.12)"
            >
              <iframe
                style={{ width: "100%", height: "100%", border: "none" }}
                src={`https://www.youtube.com/embed/${relation.video}`}
                title={`${relation.fromName} → ${relation.toName} · TCM`}
                allowFullScreen
              />
            </Box>
          )}

          {/* ── Descripción ── */}
          <Box
            bg="rgba(0,0,0,0.06)"
            border="1px solid rgba(0,0,0,0.10)"
            borderRadius="xl"
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 5 }}
            boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
          >
            <Text
              color="rgba(10,5,5,0.80)"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.90"
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
            >
              {relation.description}
            </Text>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default TCMArrowModal;
