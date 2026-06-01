import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AprendizajeIcon, LibrosIcon } from "../../GlobalVariables";

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

type Cajita = {
  titulo: string;
  delay: number;
  link: string;
  renderIcon: () => React.ReactNode;
};

export default function MaterialesGratuitos() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const cardsReveal = useReveal(0.1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const cajitas: Cajita[] = [
    {
      titulo: "Los vídeos",
      delay: 0.3,
      link: "/aprendizaje/nuevosCursos",
      renderIcon: () => <AprendizajeIcon color="white" size="52px" shadow={false} />,
    },
    {
      titulo: "Disciplinas",
      delay: 0.15,
      link: "/aprendizaje/aprendizajeHome",
      renderIcon: () => (
        <Image
          src="/img/icono/life.png"
          alt=""
          h="54px"
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.7)) drop-shadow(0 0 18px rgba(255,255,255,0.35))" }}
        />
      ),
    },
    {
      titulo: "Libros",
      delay: 0.45,
      link: "/libros",
      renderIcon: () => <LibrosIcon color="white" size="52px" shadow={false} />,
    },
  ];

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "48px", md: "64px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.78)) drop-shadow(0 0 21px rgba(255,255,255,0.42)) drop-shadow(0 0 42px rgba(180,255,245,0.32))" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-12deg)"}
          transition="opacity 1s ease 0.1s, transform 1s ease 0.1s"
        />
      </Flex>

      {/* ── TÍTULO ── */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 6, md: 8 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 14px rgba(255,255,255,0.85), 0 0 30px rgba(255,255,255,0.55), 0 0 56px rgba(180,255,245,0.45)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          Materiales gratuitos
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "md", md: "xl" }}
          fontStyle="italic"
          fontWeight="400"
          letterSpacing="0.05em"
          lineHeight="1.5"
          textShadow="0 0 10px rgba(255,255,255,0.55), 0 0 21px rgba(255,255,255,0.3)"
          maxW={{ base: "100%", md: "580px" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(13px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          Información introductoria y complementaria
        </Text>
      </Flex>

      {/* ── 3 CAJITAS ── */}
      <Flex
        flex={1}
        justify="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 20, md: 24 }}
        pb={{ base: 24, md: 32 }}
      >
        <Grid
          ref={cardsReveal.ref}
          w="100%"
          maxW="880px"
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={{ base: 6, md: 6 }}
        >
          {cajitas.map((c) => (
            <Flex
              key={c.titulo}
              as="button"
              onClick={() => navigate(c.link)}
              direction="column"
              align="center"
              justify="center"
              gap={{ base: 4, md: 5 }}
              bg="rgba(255,255,255,0.08)"
              border="1px solid rgba(255,255,255,0.28)"
              borderRadius="2xl"
              px={{ base: 5, md: 6 }}
              py={{ base: 8, md: 11 }}
              minH={{ base: "180px", md: "224px" }}
              sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
              boxShadow="0 0 16px rgba(255,255,255,0.28), 0 0 40px rgba(255,255,255,0.14), 0 0 72px rgba(180,255,245,0.16), 0 5px 16px rgba(0,0,0,0.18)"
              cursor="pointer"
              opacity={cardsReveal.visible ? 1 : 0}
              transform={cardsReveal.visible ? "translateY(0) scale(1)" : "translateY(22px) scale(0.95)"}
              transition={`opacity 0.75s ease ${c.delay}s, transform 0.75s ease ${c.delay}s, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease`}
              _hover={{
                bg: "rgba(255,255,255,0.16)",
                borderColor: "rgba(255,255,255,0.9)",
                boxShadow: "0 0 24px rgba(255,255,255,0.5), 0 0 52px rgba(180,255,245,0.32), 0 0 88px rgba(255,255,255,0.18), 0 6px 19px rgba(0,0,0,0.22)",
              }}
            >
              {/* Icono superior */}
              <Box
                w={{ base: "74px", md: "86px" }}
                h={{ base: "74px", md: "86px" }}
                borderRadius="full"
                bg="rgba(255,255,255,0.08)"
                border="1px solid rgba(255,255,255,0.35)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 0 13px rgba(255,255,255,0.35), 0 0 29px rgba(255,255,255,0.18)"
              >
                {c.renderIcon()}
              </Box>

              {/* Línea decorativa */}
              <Box
                w="40px"
                h="1px"
                bg="rgba(255,255,255,0.5)"
                boxShadow="0 0 6px rgba(255,255,255,0.5)"
              />

              {/* Título */}
              <Text
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "xl" }}
                letterSpacing="0.16em"
                textTransform="uppercase"
                textAlign="center"
                lineHeight="1.2"
                textShadow="0 0 10px rgba(255,255,255,0.6), 0 0 22px rgba(255,255,255,0.35), 0 0 40px rgba(180,255,245,0.3)"
              >
                {c.titulo}
              </Text>
            </Flex>
          ))}
        </Grid>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
