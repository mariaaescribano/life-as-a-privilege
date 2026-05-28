import React, { useEffect, useRef } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ZODIAC_SIGNS, type Cuerpo } from "../astrologiaData";
import { Glifo } from "../Glifo";
import { SpaceBg } from "../SpaceBg";
import { getTextoSigno, getTextoCasa } from "../astrologiaTextos";
void React;

interface SaberMasModalProps {
  isOpen: boolean;
  onClose: () => void;
  cuerpo: Cuerpo | null;
  signo?: string;
  casa?: number;
}

const ZodiacGlyph = ({ symbol, size = 28, color }: { symbol: string; size?: number; color: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill={color} style={{ flexShrink: 0, filter: `drop-shadow(0 0 8px ${color}99)` }}>
    <text x="12" y="19" textAnchor="middle" fontSize="19"
          fontFamily="'Times New Roman', Georgia, 'DejaVu Serif', serif">
      {symbol}{"︎"}
    </text>
  </svg>
);

/** Renderiza el contenido inline de un párrafo, aplicando **negritas** del color del cuerpo. */
function renderInline(texto: string, color: string): React.ReactNode {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g);
  return partes.map((parte, i) => {
    if (parte.startsWith("**") && parte.endsWith("**")) {
      return (
        <span
          key={i}
          style={{
            fontWeight: 700,
            color,
            textShadow: `0 0 8px ${color}55`,
          }}
        >
          {parte.slice(2, -2)}
        </span>
      );
    }
    return <React.Fragment key={i}>{parte}</React.Fragment>;
  });
}

/**
 * Renderiza un texto largo como bloque de párrafos. Cada línea en blanco
 * (\n\n) separa párrafos con un margen tight controlado, en vez del enorme
 * hueco que dejaba whiteSpace="pre-wrap" + lineHeight 1.8. Los \n simples
 * dentro de un párrafo se conservan como salto de línea.
 */
function renderTextoLargo(texto: string, color: string): React.ReactNode {
  const parrafos = texto.split(/\n\s*\n+/g).map((p) => p.trim()).filter(Boolean);
  return parrafos.map((parrafo, pi) => (
    <Text
      key={pi}
      color={`${color}ee`}
      fontSize={{ base: "sm", md: "md" }}
      lineHeight="1.55"
      whiteSpace="pre-wrap"
      textAlign="center"
      mt={pi === 0 ? 0 : { base: 2.5, md: 3 }}
      style={{ textShadow: `0 0 8px rgba(255,255,255,0.25)` }}
    >
      {renderInline(parrafo, color)}
    </Text>
  ));
}

export function SaberMasModal({ isOpen, onClose, cuerpo, signo, casa }: SaberMasModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Al abrir / cambiar de cuerpo, vuelve al inicio del contenido.
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isOpen, cuerpo?.key]);

  // Bloquea el scroll del body mientras el modal esté abierto: el usuario solo
  // puede hacer scroll dentro del popup, la página de detrás se queda quieta.
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    // Compensa el ancho del scrollbar para evitar el "salto" lateral del layout.
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen || !cuerpo) return null;

  const color = cuerpo.color;
  const signoData = signo ? ZODIAC_SIGNS.find((s) => s.name === signo) : null;
  const textoSigno = signo ? getTextoSigno(cuerpo.key, signo) : null;
  const textoCasa = casa != null ? getTextoCasa(cuerpo.key, casa) : null;

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={500}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 10 }}
      py={{ base: 6, md: 10 }}
      bg="rgba(0,0,0,0.72)"
      sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="100%"
        maxW="640px"
        maxH={{ base: "calc(100vh - 48px)", md: "calc(100vh - 80px)" }}
        borderRadius="2xl"
        overflow="hidden"
        border={`1px solid ${color}66`}
        boxShadow={`0 0 32px ${color}55, 0 0 80px ${color}28, 0 12px 60px rgba(0,0,0,0.6)`}
        fontFamily="'EB Garamond', serif"
        display="flex"
        flexDirection="column"
      >
        <SpaceBg overlay="rgba(8,13,30,0.72)" />

        {/* X cerrar */}
        <Box
          position="absolute"
          top={3}
          right={3}
          zIndex={3}
          as="button"
          onClick={onClose}
          w="36px"
          h="36px"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0,0,0,0.6)"
          border={`1px solid ${color}66`}
          color={color}
          cursor="pointer"
          transition="all 0.15s"
          boxShadow={`0 0 14px ${color}44`}
          _hover={{ bg: "rgba(0,0,0,0.85)", borderColor: color, boxShadow: `0 0 22px ${color}88` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        </Box>

        <Box
          ref={scrollRef}
          position="relative"
          zIndex={1}
          px={{ base: 6, md: 10 }}
          py={{ base: 8, md: 10 }}
          flex="1 1 auto"
          overflowY="auto"
          sx={{
            scrollbarWidth: "thin",
            scrollbarColor: `${color}55 transparent`,
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: `${color}55`,
              borderRadius: "8px",
            },
            "&::-webkit-scrollbar-thumb:hover": { background: `${color}99` },
          }}
        >

          {/* ── Bloque SIGNO ── */}
          {signoData ? (
            <Flex direction="column" gap={4}>
              <Flex align="center" justify="center" gap={3} flexWrap="wrap">
                <Glifo symbol={cuerpo.symbol} color={color} size={36} />
                <Text
                  color={color}
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="700"
                  letterSpacing="0.04em"
                  style={{ textShadow: `0 0 12px rgba(255,255,255,0.5), 0 0 26px ${color}88` }}
                >
                  {cuerpo.label} en
                </Text>
                <ZodiacGlyph symbol={signoData.symbol} color={color} size={28} />
                <Text
                  color={color}
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="700"
                  letterSpacing="0.04em"
                  style={{ textShadow: `0 0 12px rgba(255,255,255,0.5), 0 0 26px ${color}88` }}
                >
                  {signoData.name}
                </Text>
              </Flex>

              {textoSigno ? (
                <Box>{renderTextoLargo(textoSigno, color)}</Box>
              ) : (
                <Text color={`${color}99`} fontSize="sm" fontStyle="italic" textAlign="center">
                  Texto de {cuerpo.label} en {signoData.name} aún no disponible.
                </Text>
              )}
            </Flex>
          ) : (
            <Flex align="center" justify="center" gap={3}>
              <Glifo symbol={cuerpo.symbol} color={color} size={36} />
              <Text
                color={`${color}aa`}
                fontSize={{ base: "lg", md: "xl" }}
                fontStyle="italic"
              >
                {cuerpo.label} — signo aún no elegido
              </Text>
            </Flex>
          )}

          {/* ── Separador ── */}
          {cuerpo.conCasa && (
            <Box
              my={{ base: 6, md: 8 }}
              h="1px"
              w="80%"
              mx="auto"
              bgGradient={`linear(to-r, transparent, ${color}88, transparent)`}
              boxShadow={`0 0 8px ${color}55`}
            />
          )}

          {/* ── Bloque CASA ── */}
          {cuerpo.conCasa && (
            casa != null ? (
              <Flex direction="column" gap={4}>
                <Flex align="center" justify="center" gap={3} flexWrap="wrap">
                  <Glifo symbol={cuerpo.symbol} color={color} size={36} />
                  <Text
                    color={color}
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="700"
                    letterSpacing="0.04em"
                    style={{ textShadow: `0 0 12px rgba(255,255,255,0.5), 0 0 26px ${color}88` }}
                  >
                    {cuerpo.label} en casa {casa}
                  </Text>
                </Flex>

                {textoCasa ? (
                  <Box>{renderTextoLargo(textoCasa, color)}</Box>
                ) : (
                  <Text color={`${color}99`} fontSize="sm" fontStyle="italic" textAlign="center">
                    Texto de {cuerpo.label} en casa {casa} aún no disponible.
                  </Text>
                )}
              </Flex>
            ) : (
              <Flex align="center" justify="center" gap={3}>
                <Glifo symbol={cuerpo.symbol} color={color} size={36} />
                <Text
                  color={`${color}aa`}
                  fontSize={{ base: "lg", md: "xl" }}
                  fontStyle="italic"
                >
                  {cuerpo.label} — casa aún no elegida
                </Text>
              </Flex>
            )
          )}

        </Box>
      </Box>
    </Box>
  );
}
