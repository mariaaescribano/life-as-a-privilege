import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { ThemeCard } from "../../components/aprendizaje/ThemeCard";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaNomLink, ayurvedaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
  nutricionNomLink,
} from "../../GlobalVariables";

const useReveal = (threshold = 0.05) => {
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

export const AprendizajeHome = () => {
  const [mounted, setMounted] = useState(false);
  const cardsReveal = useReveal(0.04);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Orden del Método: Astrología → Psicología → Hinduismo → TCM →
  // Fisiología → Nutrición → Cábala → Cultura
  const items = [
    { title: astrologiaNom,       bgColor: astrologiaBg,      color: astrologiaTxt,      icon: <AstrologiaIcon size={{ base: "40px", md: "48px" }} />,     link: "/aprendizaje/cursosModalidad/" + astrologiaNom,    cursor: "pointer" },
    { title: neuropsicologiaNom,  bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "40px", md: "48px" }} />, link: "/aprendizaje/cursosModalidad/" + neuropsicologiaNom, cursor: "pointer"},
    { title: ayurvedaNom,         bgColor: ayurvedaBg,        color: ayurvedaTxt,        icon: <AyurvedaIcon size={{ base: "40px", md: "48px" }}  />,      link: "/aprendizaje/cursosModalidad/" + ayurvedaNomLink,  cursor: "pointer" },
    { title: tcmNom,              bgColor: tcmBg,             color: tcmTxt,             icon: <TCMIcon size={{ base: "40px", md: "48px" }} />,            link: "/aprendizaje/cursosModalidad/" + tcmNomLink, cursor: "pointer" },
    { title: fisiologiaNom,       bgColor: fisiologiaBg,      color: fisiologiaTxt,      icon: <FisiologiaIcon size={{ base: "40px", md: "48px" }}/>,     link:  "/aprendizaje/cursosModalidad/" + fisiologiaNom,  cursor: "pointer" },
    { title: nutricionNom,        bgColor: nutricionBg,       color: nutricionTxt,       icon: <NutricionIcon size={{ base: "40px", md: "48px" }}  />,   link: "/aprendizaje/cursosModalidad/" + nutricionNomLink, cursor: "pointer" },
    { title: cabalaNom,           bgColor: cabalaBg,          color: cabalaTxt,          icon: <CabalaIcon size={{ base: "40px", md: "48px" }} />,         link: "/aprendizaje/cursosModalidad/" + cabalaNom,      cursor: "pointer"  },
    { title: culturaNom,           bgColor: culturaBg,         color: culturaTxt,      icon: <CulturaIcon size={{ base: "40px", md: "48px" }} />,       link: "/aprendizaje/cursosModalidad/" + culturaNom,      cursor: "pointer" },
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
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.59)) drop-shadow(0 0 21px rgba(255,255,255,0.32)) drop-shadow(0 0 42px rgba(180,255,245,0.24))" }}
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
          textShadow="0 0 14px rgba(255,255,255,0.64), 0 0 30px rgba(255,255,255,0.41), 0 0 56px rgba(180,255,245,0.34)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          Disciplinas
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "sm", md: "lg" }}
          fontStyle="italic"
          letterSpacing="0.05em"
          lineHeight="1.5"
          textShadow="0 0 8px rgba(255,255,255,0.38), 0 0 18px rgba(255,255,255,0.21)"
          maxW={{ base: "100%", md: "512px" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(13px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          Ocho puntos de vista. Un ser humano.
        </Text>
      </Flex>

      {/* ── GRID DE DISCIPLINAS ── */}
      <Flex
        flex={1}
        justify="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 20, md: 24 }}
        pb={{ base: 24, md: 32 }}
      >
        <Box ref={cardsReveal.ref} w="100%" maxW="960px">
          <SimpleGrid
            columns={{ base: 2, md: 4 }}
            spacing={{ base: 5, md: 6 }}
          >
            {items.map((item, i) => (
              <Box
                key={i}
                opacity={cardsReveal.visible ? 1 : 0}
                transform={cardsReveal.visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.95)"}
                transition={`opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`}
              >
                <ThemeCard
                  title={item.title}
                  bgColor={item.bgColor}
                  color={item.color}
                  icon={item.icon}
                  link={item.link}
                  cursor={item.cursor}
                />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
};
