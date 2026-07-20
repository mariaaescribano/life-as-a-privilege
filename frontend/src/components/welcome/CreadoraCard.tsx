import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

/**
 * Tarjeta de la creadora — panel glass horizontal: texto a la izquierda
 * (nombre + bio + botón) y foto a la derecha. En móvil se apila (foto arriba,
 * texto debajo). El bloque de texto se centra verticalmente con la foto.
 *
 * El botón es configurable (etiqueta + destino) y se puede añadir un párrafo
 * extra opcional, para reutilizar la tarjeta en distintas páginas.
 */
type CreadoraCardProps = {
  /** Texto del botón. Por defecto "Conocer a la creadora". */
  actionLabel?: string;
  /** Ruta a la que navega el botón. Por defecto "/quienSoy". */
  actionTo?: string;
  /** Párrafo adicional opcional debajo de la bio. */
  extraParagraph?: string;
};

const CreadoraCard: React.FC<CreadoraCardProps> = ({
  actionLabel = "Conocer a la creadora",
  actionTo = "/quienSoy",
  extraParagraph,
}) => {
  const navigate = useNavigate();
  const reveal = useReveal(0.12);

  return (
    <Box px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 14 }}>
      <Flex
        ref={reveal.ref}
        direction={{ base: "column-reverse", md: "row" }}
        align="center"
        justify="center"
        gap={{ base: 7, md: 14, lg: 20 }}
        w="100%"
        maxW={{ base: "900px", lg: "1180px" }}
        mx="auto"
        p={{ base: 7, md: 12, lg: 16 }}
        borderRadius="3xl"
        bg="rgba(255,255,255,0.05)"
        border="1px solid rgba(255,255,255,0.14)"
        sx={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        opacity={reveal.visible ? 1 : 0}
        transform={reveal.visible ? "translateY(0)" : "translateY(28px)"}
        transition="opacity 0.8s ease, transform 0.8s ease"
      >
        {/* ── Texto (izquierda) ── */}
        <Flex
          flex="1"
          direction="column"
          align={{ base: "center", md: "flex-start" }}
          textAlign={{ base: "center", md: "left" }}
          gap={{ base: 4, md: 5, lg: 6 }}
        >
          <Text
            color="white"
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight="700"
            letterSpacing="0.04em"
            lineHeight="1.15"
            textShadow="0 0 13px rgba(255,255,255,0.49), 0 0 27px rgba(255,255,255,0.26), 0 0 54px rgba(180,255,245,0.22)"
          >
            María Escribano
          </Text>

          {/* Línea acento */}
          <Box
            h="2px"
            w={{ base: "70px", md: "90px", lg: "120px" }}
            bgGradient={{
              base: "linear(to-r, transparent, rgba(255,255,255,0.6), transparent)",
              md: "linear(to-r, rgba(255,255,255,0.6), transparent)",
            }}
            borderRadius="full"
          />

          <Text
            color="rgba(255,255,255,0.92)"
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "sm", md: "lg", lg: "xl" }}
            lineHeight="1.85"
            letterSpacing="0.02em"
            textShadow="0 0 10px rgba(255,255,255,0.28), 0 0 22px rgba(255,255,255,0.14)"
          >
            Ingeniera informática. No existía lo que he construido: un mapa donde la psicología, la biología y los conocimientos tradicionales se combinan en vez de pelearse. Ahora son aliados al servicio de tu crecimiento.
          </Text>

          {extraParagraph && (
            <Text
              color="rgba(255,255,255,0.92)"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "sm", md: "lg" }}
              lineHeight="1.85"
              letterSpacing="0.02em"
              textShadow="0 0 10px rgba(255,255,255,0.28), 0 0 22px rgba(255,255,255,0.14)"
            >
              {extraParagraph}
            </Text>
          )}

          {/* Botón configurable */}
          <Flex
            as="button"
            onClick={() => navigate(actionTo)}
            align="center"
            gap={2}
            mt={{ base: 1, md: 2 }}
            color="rgba(255,255,255,0.85)"
            fontFamily="'EB Garamond', serif"
            fontWeight="500"
            fontSize={{ base: "xs", md: "sm", lg: "md" }}
            letterSpacing={{ base: "0.08em", md: "0.14em" }}
            textTransform="uppercase"
            whiteSpace="nowrap"
            px={{ base: 5, md: 6, lg: 8 }}
            py={{ base: "8px", md: "10px", lg: "13px" }}
            borderRadius="full"
            border="1px solid rgba(255,255,255,0.35)"
            bg="rgba(255,255,255,0.05)"
            cursor="pointer"
            boxShadow="0 0 12px rgba(255,255,255,0.2), 0 0 24px rgba(180,255,245,0.16), 0 2px 10px rgba(0,0,0,0.16)"
            _hover={{
              bg: "rgba(255,255,255,0.12)",
              borderColor: "rgba(255,255,255,0.6)",
              color: "white",
              boxShadow: "0 0 16px rgba(255,255,255,0.3), 0 0 32px rgba(180,255,245,0.26), 0 2px 12px rgba(0,0,0,0.18)",
            }}
            transition="all 0.25s ease"
          >
            {actionLabel}
            <Box as="span" fontSize={{ base: "sm", md: "md", lg: "lg" }}>→</Box>
          </Flex>
        </Flex>

        {/* ── Foto (derecha) — recortada apaisada (más ancha que alta) ── */}
        <Box
          flexShrink={0}
          w={{ base: "240px", md: "340px", lg: "430px" }}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="0 18px 45px rgba(0,0,0,0.35), 0 0 27px rgba(255,255,255,0.25), 0 0 54px rgba(180,255,245,0.2)"
          sx={{ aspectRatio: "4 / 3" }}
        >
          <Image
            src="/img/me/me.png"
            alt="María Escribano"
            w="100%"
            h="100%"
            objectFit="cover"
            objectPosition="center top"
            display="block"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default CreadoraCard;
