import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ProductosBanner from "../../components/global/ProductosBanner";
import ReelsBanner from "../../components/global/ReelsBanner";
import SiteHeader from "../../components/global/SiteHeader";
import {
  astrologiaBg, astrologiaDescrip, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, ayurvedaDescrip, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  biologiaBg, biologiaDescrip, BiologiaIcon, biologiaNom, biologiaTxt,
  cabalaBg, cabalaDescrip, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, fisiologiaDescrip, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, neuropsicologiaDescrip, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, nutricionDescrip, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, tcmDescrip, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
} from "../../GlobalVariables";

type Discipline = {
  name: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
  desc: string;
  link: string;
  available:boolean;
};

const disciplines: Discipline[] = [
  {
    name: fisiologiaNom,
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    renderIcon: (size) => <FisiologiaIcon size={size} />,
    desc: fisiologiaDescrip,
    link: "/aprendizaje/modulosPage/" + fisiologiaNom,
    available: false
  },
  {
    name: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
    desc: neuropsicologiaDescrip,
    link: "/aprendizaje/modulosPage/" + neuropsicologiaNom,
    available:true
  },
  {
    name: astrologiaNom,
    bg: astrologiaBg,
    txt: astrologiaTxt,
    renderIcon: (size) => <AstrologiaIcon size={size} />,
    desc: astrologiaDescrip,
    link: "/aprendizaje/modulosPage/" + astrologiaNom,
    available:false
  },
  {
    name: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
    desc: tcmDescrip,
    link: "/aprendizaje/modulosPage/" + tcmNomLink,
    available:true
  },
  {
    name: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    renderIcon: (size) => <NutricionIcon size={size} />,
    desc: nutricionDescrip,
    link: "/aprendizaje/modulosPage/" + nutricionNom,
    available:false
  },
  {
    name: ayurvedaNom,
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    renderIcon: (size) => <AyurvedaIcon size={size} />,
    desc: ayurvedaDescrip,
    link: "/aprendizaje/modulosPage/" + ayurvedaNom,
    available:false
  },
  {
    name: biologiaNom,
    bg: biologiaBg,
    txt: biologiaTxt,
    renderIcon: (size) => <BiologiaIcon size={size} />,
    desc: biologiaDescrip,
    link: "/aprendizaje/modulosPage/" + biologiaNom,
    available:false
  },
  {
    name: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    renderIcon: (size) => <CabalaIcon size={size} />,
    desc: cabalaDescrip,
    link: "/aprendizaje/modulosPage/" + cabalaNom,
    available:false
  },
];

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

const Welcome = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Discipline | null>(null);
  const bienvenidaReveal = useReveal();
  const presentacionReveal = useReveal();
  const disciplinasReveal = useReveal(0.05);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      {/* ── HEADER ── */}
      <SiteHeader variant="public" />

      {/* ── CARD BIENVENIDA ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 14 }}>
        <Box
          ref={bienvenidaReveal.ref}
          w={{ base: "100%", md: "80%" }}
          bg="rgba(255,255,255,0.22)"
          border="1px solid rgba(255,255,255,0.45)"
          sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
          borderRadius="2xl"
          boxShadow="0 8px 36px rgba(107,196,200,0.45)"
          px={{ base: 8, md: 14 }}
          py={{ base: 8, md: 10 }}
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          gap={{ base: 6, md: 10 }}
          opacity={bienvenidaReveal.visible ? 1 : 0}
          transform={bienvenidaReveal.visible ? "none" : "translateX(-50px)"}
          transition="opacity 0.7s ease, transform 0.7s ease"
        >
          {/* Logo */}
          <Box flexShrink={0} w={{ base: "140px", md: "170px" }} alignSelf="center">
            <Image src="/img/life.png" alt="Life as a Privilege" w="100%" objectFit="contain" />
          </Box>

          {/* Texto */}
          <Box flex="1" textAlign={{ base: "center", md: "left" }}>
            <Text
              color="white"
              fontSize={{ base: "3xl", md: "4xl", lg: "4xl" }}
              fontWeight="700"
              letterSpacing="0.05em"
              lineHeight="1.2"
              textShadow="0 2px 10px rgba(0,100,90,0.35)"
              mb={3}
            >
              LIFE AS A PRIVILEGE
            </Text>
            <Text
              color="rgba(255,255,255,0.85)"
              fontSize={{ base: "md", md: "2xl" }}
              lineHeight="1.9"
              letterSpacing="0.02em"
              textShadow="0 1px 5px rgba(0,100,90,0.25)"
            >
              Es una plataforma gratuita que integra conocimientos ancestrales para crear una visión holística del ser humano.
            </Text>
          </Box>
        </Box>
      </Flex>

      {/* ── CARD PRESENTACIÓN ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 12, md: 16 }}>
        <Box
          ref={presentacionReveal.ref}
          w={{ base: "100%", md: "80%" }}
          bg="rgba(255,255,255,0.22)"
          border="1px solid rgba(255,255,255,0.45)"
          sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
          borderRadius="2xl"
          boxShadow="0 8px 36px rgba(107,196,200,0.45)"
          px={{ base: 8, md: 14 }}
          py={{ base: 8, md: 10 }}
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "center", md: "stretch" }}
          gap={{ base: 6, md: 10 }}
          opacity={presentacionReveal.visible ? 1 : 0}
          transform={presentacionReveal.visible ? "none" : "translateX(50px)"}
          transition="opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s"
        >
          {/* Foto */}
          <Box
            flexShrink={0}
            w={{ base: "200px", md: "260px" }}
            h={{ base: "260px", md: "320px" }}
            borderRadius="xl"
            overflow="hidden"
            boxShadow="0 20px 50px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)"
            alignSelf={{ base: "center", md: "flex-start" }}
          >
            <Image
              src="/img/me.jpg"
              alt="María Escribano"
              w="100%"
              h="100%"
              objectFit="cover"
              objectPosition="center top"
            />
          </Box>

          {/* Texto */}
          <Box flex="1" textAlign={{ base: "center", md: "left" }} display="flex" flexDirection="column">
            <Text
              color="white"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="700"
              fontFamily="'EB Garamond', serif"
              letterSpacing="0.04em"
              lineHeight="1.2"
              textShadow="0 2px 10px rgba(0,60,50,0.5)"
              mb={3}
            >
              María Escribano
            </Text>
            <Text
              color="rgba(255,255,255,0.88)"
              fontSize={{ base: "md", md: "xl" }}
              fontFamily="'EB Garamond', serif"
              lineHeight="1.9"
              letterSpacing="0.02em"
              textShadow="0 1px 5px rgba(0,60,50,0.3)"
            >

              
              Mi propósito es descubrir la verdad profunda del ser humano más allá de religiones, tradiciones y culturas, basándome en que todas son fragmentos de una verdad mayor.
            </Text>
            <Flex justify={{ base: "center", md: "flex-end" }} mt="auto" pt={6}>
              <Box
                as="button"
                onClick={() => navigate("/quienSoy")}
                color="white"
                fontWeight="600"
                fontSize="sm"
                letterSpacing="0.06em"
                px={6}
                py="10px"
                borderRadius="full"
                border="1.5px solid rgba(255,255,255,0.6)"
                bg="rgba(255,255,255,0.12)"
                cursor="pointer"
                _hover={{ bg: "rgba(255,255,255,0.25)", borderColor: "white" }}
                transition="all 0.2s"
              >
                Conoce más →
              </Box>
            </Flex>
          </Box>
        </Box>
      </Flex>

      {/* ── BANNERS PRODUCTOS & REELS ── */}
      <Flex
        justify="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 12, md: 16 }}
      >
        <Flex
          w={{ base: "100%", md: "80%" }}
          gap={{ base: 5, md: 7 }}
          direction={{ base: "column", md: "row" }}
        >
          <ProductosBanner maxW="unset" w="100%" compact />
          <ReelsBanner    maxW="unset" w="100%" compact />
        </Flex>
      </Flex>

      {/* ── CARDS DE DISCIPLINAS ── */}
      <Box
        ref={disciplinasReveal.ref}
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 16, md: 24 }}
        pb={{ base: 10, md: 14 }}
      >
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={{ base: 10, md: 12 }}
        >
          {disciplines.map((d, i) => (
            <Box
              key={i}
              position="relative"
              mt="42px"
              pt="46px"
              pb={{ base: 5, md: 7 }}
              px={{ base: 3, md: 5 }}
              bg={d.bg}
              borderRadius="2xl"
              boxShadow="0 8px 28px rgba(107,196,200,0.55), 0 2px 8px rgba(107,196,200,0.3)"
              cursor="pointer"
              onClick={() => setSelected(d)}
              opacity={disciplinasReveal.visible ? 1 : 0}
              transform={disciplinasReveal.visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.93)"}
              transition={`opacity 0.5s ease ${i * 0.09}s, transform 0.5s ease ${i * 0.09}s, box-shadow 0.22s ease`}
              _hover={{
                transform: "translateY(-5px)",
                boxShadow: "0 18px 45px rgba(107,196,200,0.75), 0 4px 14px rgba(107,196,200,0.45)",
              }}
              textAlign="center"
            >
              {/* Icono que sobresale por arriba */}
              <Box
                position="absolute"
                top="-36px"
                left="50%"
                transform="translateX(-50%)"
                bg={d.bg}
                borderRadius="full"
                p="8px"
                border={"3px solid "+ d.txt}
                boxShadow="0 4px 16px rgba(107,196,200,0.6)"
                w="72px"
                h="72px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {d.renderIcon("42px")}
              </Box>

              <Text
                color={d.txt}
                filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.4))"
                fontWeight="700"
                fontSize={{ base: "xl", md: "2xl" }}
                letterSpacing="0.03em"
                lineHeight="short"
              >
                {d.name}
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>


      {/* ── BOTÓN ENTRAR ── */}
      <Flex justify="center" py={{ base: 12, md: 16 }}>
        <Box
          as="button"
          onClick={() => navigate("/logIn")}
          color="white"
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "xl", md: "2xl" }}
          letterSpacing="0.2em"
          px={{ base: 14, md: 20 }}
          py={{ base: 4, md: 5 }}
          borderRadius="full"
          border="2px solid rgba(255,255,255,0.7)"
          bg="rgba(255,255,255,0.12)"
          cursor="pointer"
          textShadow="0 2px 8px rgba(0,0,0,0.2)"
          boxShadow="0 8px 32px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)"
          _hover={{
            bg: "rgba(255,255,255,0.25)",
            borderColor: "white",
            boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
            transform: "translateY(-2px)",
          }}
          transition="all 0.25s ease"
        >
          ENTRAR
        </Box>
      </Flex>

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        background="#008080"
        borderTop="1px solid rgba(255,255,255,0.15)"
        px={{ base: 6, md: 16 }}
        pt={{ base: 10, md: 12 }}
        pb={{ base: 8, md: 10 }}
      >
        <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>

      {/* ── MODAL ── */}
      {selected && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="1000"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0,0,0,0.5)"
          sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          onClick={() => setSelected(null)}
        >
          <Box
            bg={selected.bg}
            borderRadius="3xl"
            pt={14}
            pb={10}
            px={{ base: 8, md: 14 }}
            maxW="480px"
            w="90%"
            position="relative"
            boxShadow="0 28px 80px rgba(0,0,0,0.4)"
            textAlign="center"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <Box
              as="button"
              position="absolute"
              top="14px"
              right="14px"
              w="32px"
              h="32px"
              borderRadius="full"
              bg="rgba(0,0,0,0.08)"
              border="none"
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={selected.txt}
              fontSize="18px"
              fontWeight="bold"
              _hover={{ bg: "rgba(0,0,0,0.18)" }}
              transition="background 0.18s"
              onClick={() => setSelected(null)}
            >
              ✕
            </Box>

            {/* Icono grande */}
            <Flex justify="center" mb={6}>
              <Box
                bg={selected.bg}
                borderRadius="full"
                p="12px"
                border={`5px solid ${selected.txt}`}
                boxShadow="0 4px 24px rgba(0,0,0,0.15)"
                w="96px"
                h="96px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {selected.renderIcon("52px")}
              </Box>
            </Flex>

            <Text
              color={selected.txt}
              fontWeight="800"
              fontSize={{ base: "3xl", md: "4xl" }}
              mb={4}
              letterSpacing="0.02em"
            >
              {selected.name}
            </Text>

            <Text
              color={selected.txt}
              fontSize={{ base: "xl", md: "2xl" }}
              lineHeight="tall"
              opacity={0.9}
              mb={7}
            >
              {selected.desc}
            </Text>

            <Flex justify="center" direction="column" align="center" gap={2}>
              <Box
                as="button"
                onClick={() => selected.available ? navigate(selected.link) : undefined}
                color={selected.txt}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "lg", md: "xl" }}
                letterSpacing="0.12em"
                px={10}
                py={3}
                borderRadius="full"
                border={`2px solid ${selected.txt}`}
                bg={selected.available  ? `${selected.txt}18` : `${selected.txt}0a`}
                cursor={selected.available ? "pointer" : "not-allowed"}
                opacity={selected.available ? 1 : 0.45}
                _hover={selected.available ? { bg: `${selected.txt}33`, transform: "translateY(-2px)" } : {}}
                transition="all 0.2s ease"
              >
                APRENDER
              </Box>
              {selected.available == false && (
                <Text
                  color={selected.txt}
                  fontSize="xs"
                  letterSpacing="0.1em"
                  opacity={0.6}
                  fontStyle="italic"
                >
                  Próximamente
                </Text>
              )}
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Welcome;
