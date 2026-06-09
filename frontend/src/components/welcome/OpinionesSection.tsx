import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../GlobalVariables";
import type { Opinion } from "../../dtos/opinion.type";

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

// Aparición suave al cambiar de testimonio (sin glow nuevo, solo fade + leve subida).
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Flecha de navegación — mismo lenguaje translúcido que el resto de la web.
const ArrowButton: React.FC<{ dir: "left" | "right"; onClick: () => void }> = ({ dir, onClick }) => (
  <Box
    as="button"
    aria-label={dir === "left" ? "Anterior" : "Siguiente"}
    onClick={onClick}
    flexShrink={0}
    w={{ base: "38px", md: "46px" }}
    h={{ base: "38px", md: "46px" }}
    borderRadius="full"
    display="flex"
    alignItems="center"
    justifyContent="center"
    color="white"
    border="1px solid rgba(255,255,255,0.4)"
    bg="rgba(255,255,255,0.08)"
    cursor="pointer"
    boxShadow="0 0 10px rgba(255,255,255,0.12)"
    _hover={{ bg: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.7)" }}
    transition="all 0.2s ease"
  >
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" w="18px" h="18px" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </Box>
  </Box>
);

const OpinionesSection: React.FC = () => {
  const navigate = useNavigate();
  const reveal = useReveal(0.1);
  const [opiniones, setOpiniones] = useState<Opinion[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/opinion`)
      .then(r => r.ok ? r.json() : [])
      .then((data: Opinion[]) => setOpiniones(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => setOpiniones([]))
      .finally(() => setLoaded(true));
  }, []);

  if (loaded && opiniones.length === 0) return null;

  const total = opiniones.length;
  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);
  const current = opiniones[index];

  return (
    <Box
      ref={reveal.ref}
      px={{ base: 5, md: 10, lg: 16 }}
      pt={{ base: 12, md: 16 }}
      pb={{ base: 14, md: 20 }}
    >
      <Flex direction="column" align="center" w="100%">
        {/* ── Título ── */}
        <Flex
          align="center"
          justify="center"
          gap={3}
          mb={{ base: 8, md: 10 }}
          opacity={reveal.visible ? 1 : 0}
          transform={reveal.visible ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.7s ease, transform 0.7s ease"
        >
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "28px", md: "36px" }} h={{ base: "28px", md: "36px" }} fill="white" flexShrink={0} style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.55)) drop-shadow(0 0 18px rgba(255,255,255,0.3))" }}>
            <path d="M240-400h122l200-200q9-9 13.5-20.5T580-643q0-11-5-21.5T562-684l-36-38q-9-9-20-13.5t-23-4.5q-11 0-22.5 4.5T440-722L240-522v122Zm280-243-37-37 37 37ZM300-460v-38l101-101 20 18 18 20-101 101h-38Zm121-121 18 20-38-38 20 18Zm26 181h273v-80H527l-80 80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/>
          </Box>
          <Text
            color="white"
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="700"
            letterSpacing="0.04em"
            textShadow="0 0 12px rgba(255,255,255,0.55), 0 0 28px rgba(255,255,255,0.3), 0 0 50px rgba(180,255,245,0.25)"
            fontFamily="'EB Garamond', serif"
          >
            Opiniones
          </Text>
        </Flex>

        {/* ── Carrusel: una opinión cada vez, flechas a los lados ── */}
        {current && (
          <Flex
            align="center"
            justify="center"
            gap={{ base: 2, md: 5 }}
            w="100%"
            maxW="820px"
            opacity={reveal.visible ? 1 : 0}
            transform={reveal.visible ? "translateY(0)" : "translateY(28px)"}
            transition="opacity 0.6s ease, transform 0.6s ease"
          >
            {total > 1 && <ArrowButton dir="left" onClick={() => go(-1)} />}

            <Box
              flex="1"
              maxW="600px"
              bg="rgba(255,255,255,0.18)"
              border="1px solid rgba(255,255,255,0.4)"
              sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
              borderRadius="2xl"
              boxShadow="0 0 10px rgba(255,255,255,0.08), 0 6px 24px rgba(107,196,200,0.4)"
              px={{ base: 6, md: 10 }}
              py={{ base: 8, md: 10 }}
              minH={{ base: "220px", md: "240px" }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              {/* key={index} fuerza el re-montaje → reproduce el fade al navegar */}
              <Flex key={index} direction="column" gap={4} animation={`${fadeIn} 0.45s ease`}>
                <Text
                  color="rgba(255,255,255,0.95)"
                  fontSize={{ base: "lg", md: "xl" }}
                  lineHeight="1.75"
                  fontFamily="'EB Garamond', serif"
                  textAlign="center"
                >
                  “{current.texto}”
                </Text>
                <Text
                  color="white"
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="700"
                  letterSpacing="0.04em"
                  textAlign="center"
                  fontFamily="'EB Garamond', serif"
                  textShadow="0 1px 5px rgba(0,60,50,0.3)"
                >
                  — {current.nombre}
                </Text>
              </Flex>
            </Box>

            {total > 1 && <ArrowButton dir="right" onClick={() => go(1)} />}
          </Flex>
        )}

        {/* ── Indicadores (dots) ── */}
        {total > 1 && (
          <Flex gap={2} mt={{ base: 5, md: 6 }} justify="center" align="center">
            {opiniones.map((_, i) => (
              <Box
                key={i}
                as="button"
                aria-label={`Opinión ${i + 1}`}
                onClick={() => setIndex(i)}
                w={i === index ? "22px" : "8px"}
                h="8px"
                borderRadius="full"
                bg={i === index ? "white" : "rgba(255,255,255,0.3)"}
                cursor="pointer"
                transition="all 0.25s ease"
                _hover={{ bg: i === index ? "white" : "rgba(255,255,255,0.55)" }}
              />
            ))}
          </Flex>
        )}

        {/* ── Frase de conversión ── */}
        <Text
          mt={{ base: 10, md: 14 }}
          mb={{ base: 8, md: 10 }}
          color="white"
          textAlign="center"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "lg", md: "2xl" }}
          fontStyle="italic"
          letterSpacing="0.02em"
          lineHeight="1.6"
          maxW="640px"
          textShadow="0 0 10px rgba(255,255,255,0.3)"
          opacity={reveal.visible ? 1 : 0}
          transform={reveal.visible ? "translateY(0)" : "translateY(18px)"}
          transition="opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s"
        >
          Si ellos encontraron respuestas aquí, tú también puedes.
        </Text>

        {/* ── CTA principal → El Recorrido (botón con mandala + flecha + líneas,
              versión reducida del de la home) ── */}
        <Flex
          justify="center"
          align="center"
          gap={{ base: 3, md: 4 }}
          mt={{ base: 3, md: 4 }}
        >
          <Box
            h="1px"
            w={{ base: "18px", md: "70px" }}
            bg="linear-gradient(to right, transparent, rgba(255,255,255,0.7))"
            boxShadow="0 0 8px rgba(255,255,255,0.5)"
          />
          <Flex
            as="button"
            onClick={() => navigate("/elMetodo")}
            align="center"
            justify="center"
            gap={{ base: 2, md: 4 }}
            px={{ base: 5, md: 12 }}
            py={{ base: "14px", md: "18px" }}
            flexShrink={0}
            borderRadius="full"
            border="1px solid rgba(255,255,255,0.55)"
            bg="rgba(255,255,255,0.08)"
            cursor="pointer"
            boxShadow="0 0 16px rgba(255,255,255,0.35), 0 0 36px rgba(255,255,255,0.18), 0 4px 14px rgba(0,0,0,0.18)"
            _hover={{
              bg: "rgba(255,255,255,0.18)",
              borderColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 26px rgba(255,255,255,0.55), 0 0 54px rgba(180,255,245,0.35), 0 6px 18px rgba(0,0,0,0.22)",
              transform: "translateY(-1px)",
            }}
            transition="all 0.25s ease"
          >
            <Image
              src="/img/icono/life.png"
              alt=""
              h={{ base: "30px", md: "38px" }}
              objectFit="contain"
              flexShrink={0}
              style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.52)) drop-shadow(0 0 20px rgba(255,255,255,0.26))" }}
            />
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "sm", md: "2xl" }}
              letterSpacing={{ base: "0.14em", md: "0.18em" }}
              textTransform="uppercase"
              textShadow="0 0 10px rgba(255,255,255,0.45), 0 0 22px rgba(255,255,255,0.26)"
              whiteSpace="nowrap"
            >
              El Recorrido
            </Text>
            <Box
              as="span"
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "sm", md: "2xl" }}
              style={{ textShadow: "0 0 10px rgba(255,255,255,0.52), 0 0 22px rgba(255,255,255,0.3)" }}
            >
              →
            </Box>
          </Flex>
          <Box
            h="1px"
            w={{ base: "18px", md: "70px" }}
            bg="linear-gradient(to left, transparent, rgba(255,255,255,0.7))"
            boxShadow="0 0 8px rgba(255,255,255,0.5)"
          />
        </Flex>

        {/* ── Enlace secundario → página completa de Opiniones ── */}
        <Box
          as="button"
          onClick={() => navigate("/opiniones")}
          mt={{ base: 4, md: 5 }}
          color="rgba(255,255,255,0.6)"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "sm", md: "md" }}
          letterSpacing="0.04em"
          cursor="pointer"
          bg="transparent"
          border="none"
          textDecoration="underline"
          sx={{ textUnderlineOffset: "3px" }}
          transition="color 0.2s ease"
          _hover={{ color: "white" }}
        >
          Ver más experiencias →
        </Box>
      </Flex>
    </Box>
  );
};

export default OpinionesSection;
