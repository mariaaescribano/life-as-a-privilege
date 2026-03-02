import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
export type TCMElementField = { label: string; value: string };

export type TCMElementData = {
  id: number;
  name: string;
  chinese: string;
  bgColor: string;       // fondo oscuro del modal
  iconColor: string;     // color más claro para los boxes y borde
  leftPct: string;
  topPct: string;
  icon: React.ReactNode;
  description: string;
  fields: TCMElementField[];  // dinámico: tantos como se pasen
  video?: string;        // ID de YouTube — e.g. "dQw4w9WgXcQ"
};

/* ═══════════════════════════════════════════
   ITEM ACORDEÓN (se abre hacia abajo)
═══════════════════════════════════════════ */
const AccordionItem = ({
  label,
  value,
  bgColor,
  iconColor,
  isOpen,
  onToggle,
}: {
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <Box borderRadius="xl" overflow="hidden">
    {/* Cabecera — siempre visible */}
    <Flex
      bg={iconColor}
      px={4}
      py={2.5}
      cursor="pointer"
      align="center"
      justify="space-between"
      onClick={onToggle}
      userSelect="none"
      borderRadius={isOpen ? "xl xl 0 0" : "xl"}
      sx={{ transition: "border-radius 0.22s" }}
    >
      <Text
        color={bgColor}
        fontFamily="'EB Garamond', serif"
        fontWeight="700"
        fontSize={{ base: "xs", md: "sm" }}
        letterSpacing="0.14em"
        textTransform="uppercase"
      >
        {label}
      </Text>
      <Text
        color={bgColor}
        fontSize="9px"
        sx={{
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.25s ease",
        }}
      >
        ▼
      </Text>
    </Flex>

    {/* Contenido — se despliega */}
    <Box
      maxH={isOpen ? "280px" : "0"}
      overflow="hidden"
      sx={{ transition: "max-height 0.32s ease" }}
    >
      <Box
        bg={iconColor + "d0"}
        px={4}
        py={3}
        borderTop={`1px solid ${bgColor}30`}
      >
        <Text
          color={bgColor}
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "sm", md: "md" }}
          lineHeight="1.55"
          fontWeight="500"
        >
          {value}
        </Text>
      </Box>
    </Box>
  </Box>
);

/* ═══════════════════════════════════════════
   MODAL PRINCIPAL
   bg = bgColor oscuro del elemento
   boxes = iconColor (más claro)
   texto = bgColor (oscuro, legible sobre claro)
═══════════════════════════════════════════ */
const TCMElementModal = ({
  element,
  onClose,
}: {
  element: TCMElementData;
  onClose: () => void;
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i));

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
      position="fixed" inset={0} zIndex={1100}
      bg="rgba(0,0,0,0.70)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      py={6}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="95vw"
        maxW="720px"
        maxH="90vh"
        overflowY="auto"
        borderRadius="24px"
        bg={element.iconColor}
        borderTop={`3px solid ${element.bgColor}`}
        boxShadow={`0 32px 80px rgba(0,0,0,0.70), 0 0 60px ${element.iconColor}55, 0 0 120px ${element.iconColor}20`}
        sx={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: element.bgColor + "55",
            borderRadius: "999px",
          },
        }}
      >
        {/* ── Botón cerrar ── */}
        <Box
          as="button"
          position="absolute" top="13px" right="13px"
          w="34px" h="34px" borderRadius="full"
          bg="rgba(0,0,0,0.10)"
          border="1px solid rgba(0,0,0,0.20)"
          display="flex" alignItems="center" justifyContent="center"
          color="rgba(0,0,0,0.65)"
          fontSize="15px" fontWeight="700"
          cursor="pointer" zIndex={10}
          _hover={{ bg: "rgba(0,0,0,0.20)" }}
          onClick={onClose}
        >
          ✕
        </Box>

        <Box px={{ base: 6, md: 10 }} pt={10} pb={10}>

          {/* ── Icono + Nombre ── */}
          <Flex align="center" gap={4} mb={6}>
            <Box
              w={{ base: "54px", md: "62px" }}
              h={{ base: "54px", md: "62px" }}
              borderRadius="full"
              bg={element.bgColor}
              border={`2px solid ${element.iconColor}90`}
              boxShadow={`0 4px 20px rgba(0,0,0,0.45), 0 0 18px ${element.iconColor}99, 0 0 38px ${element.iconColor}40`}
              display="flex" alignItems="center" justifyContent="center"
              flexShrink={0}
              color={element.iconColor}
            >
              {element.icon}
            </Box>
            <Box>
              <Text
                color={element.bgColor + "aa"}
                fontSize="xs"
                letterSpacing="0.2em"
                textTransform="uppercase"
                fontFamily="'EB Garamond', serif"
                mb={0.5}
              >
                Elemento · TCM
              </Text>
              <Text
                color={element.bgColor}
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                fontFamily="'EB Garamond', serif"
                lineHeight="1.1"
              >
                {element.name}
              </Text>
              <Text
                color={element.bgColor + "cc"}
                fontSize={{ base: "lg", md: "xl" }}
                fontStyle="italic"
                letterSpacing="0.08em"
              >
                {element.chinese}
              </Text>
            </Box>
          </Flex>

          {/* ── Vídeo ── */}
          {element.video && (
            <Box
              w="100%"
              aspectRatio={16 / 9}
              borderRadius="xl"
              overflow="hidden"
              boxShadow={`0 8px 28px rgba(0,0,0,0.45), 0 0 18px ${element.bgColor}55`}
              mb={6}
              bg={element.bgColor + "55"}
            >
              <iframe
                style={{ width: "100%", height: "100%", border: "none" }}
                src={`https://www.youtube.com/embed/${element.video}`}
                title={`${element.name} · Medicina Tradicional China`}
                allowFullScreen
              />
            </Box>
          )}

          {/* ── Descripción ── */}
          <Box
            bg={element.bgColor + "18"}
            borderLeft={`3px solid ${element.bgColor}55`}
            borderRadius="0 xl xl 0"
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 5 }}
            mb={6}
          >
            <Text
              color={element.bgColor}
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.92"
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
            >
              {element.description}
            </Text>
          </Box>

          {/* ── Campos acordeón (dinámicos) ── */}
          <Flex direction="column" gap={2}>
            {element.fields.map((field, i) => (
              <AccordionItem
                key={i}
                label={field.label}
                value={field.value}
                bgColor={element.iconColor}
                iconColor={element.bgColor}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </Flex>

        </Box>
      </Box>
    </Box>
  );
};

export default TCMElementModal;
