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

const OpinionesSection: React.FC = () => {
  const navigate = useNavigate();
  const reveal = useReveal(0.1);

  return (
    <Box
      ref={reveal.ref}
      px={{ base: 5, md: 10, lg: 16 }}
      pt={{ base: 24, md: 32 }}
      pb={{ base: 14, md: 20 }}
    >
      <Flex direction="column" align="center" w="100%">
        {/* ── CTA principal → El Recorrido (botón grande con mandala + flecha
              + líneas, versión destacada). ── */}
        <Flex
          justify="center"
          align="center"
          gap={{ base: 4, md: 7 }}
          opacity={reveal.visible ? 1 : 0}
          transform={reveal.visible ? "translateY(0)" : "translateY(18px)"}
          transition="opacity 0.7s ease, transform 0.7s ease"
        >
          <Box
            h="1px"
            w={{ base: "24px", md: "110px" }}
            bg="linear-gradient(to right, transparent, rgba(255,255,255,0.7))"
            boxShadow="0 0 8px rgba(255,255,255,0.5)"
          />
          <Flex
            as="button"
            onClick={() => navigate("/elMetodo")}
            align="center"
            justify="center"
            gap={{ base: 3, md: 5 }}
            px={{ base: 9, md: 24 }}
            py={{ base: "18px", md: "28px" }}
            flexShrink={0}
            borderRadius="full"
            border="1.5px solid rgba(255,255,255,0.65)"
            bg="rgba(255,255,255,0.11)"
            cursor="pointer"
            boxShadow="0 0 28px rgba(255,255,255,0.48), 0 0 62px rgba(255,255,255,0.26), 0 0 112px rgba(180,255,245,0.28), 0 6px 22px rgba(0,0,0,0.22)"
            _hover={{
              bg: "rgba(255,255,255,0.22)",
              borderColor: "white",
              boxShadow: "0 0 40px rgba(255,255,255,0.66), 0 0 84px rgba(180,255,245,0.5), 0 8px 26px rgba(0,0,0,0.26)",
              transform: "translateY(-2px)",
            }}
            transition="all 0.25s ease"
          >
            <Image
              src="/img/icono/life.png"
              alt=""
              h={{ base: "42px", md: "60px" }}
              objectFit="contain"
              flexShrink={0}
              style={{ filter: "drop-shadow(0 0 11px rgba(255,255,255,0.6)) drop-shadow(0 0 26px rgba(255,255,255,0.32))" }}
            />
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "xl", md: "4xl" }}
              letterSpacing={{ base: "0.14em", md: "0.2em" }}
              textTransform="uppercase"
              textShadow="0 0 16px rgba(255,255,255,0.56), 0 0 34px rgba(255,255,255,0.32), 0 0 66px rgba(180,255,245,0.24)"
              whiteSpace="nowrap"
            >
              El Recorrido
            </Text>
            <Box
              as="span"
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "xl", md: "4xl" }}
              style={{ textShadow: "0 0 16px rgba(255,255,255,0.56), 0 0 34px rgba(255,255,255,0.32)" }}
            >
              →
            </Box>
          </Flex>
          <Box
            h="1px"
            w={{ base: "24px", md: "110px" }}
            bg="linear-gradient(to left, transparent, rgba(255,255,255,0.7))"
            boxShadow="0 0 8px rgba(255,255,255,0.5)"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default OpinionesSection;
