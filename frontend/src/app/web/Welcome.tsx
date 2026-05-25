import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import OpinionesSection from "../../components/welcome/OpinionesSection";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
  // AprendizajeIcon, // comentado: el botón APRENDER está desactivado para v1
  nutricionNomLink,
  ayurvedaNomLink,
} from "../../GlobalVariables";
import { welcomeDisciplinas } from "../../data/welcomeDisciplinas";

type Discipline = {
  name: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
  desc: string;
  link: string;
  available:boolean;
};

// Orden del Método: Astrología → Psicología → Hinduismo → TCM →
// Fisiología → Nutrición → Cultura → Cábala
const disciplines: Discipline[] = [
  {
    name: astrologiaNom,
    bg: astrologiaBg,
    txt: astrologiaTxt,
    renderIcon: (size) => <AstrologiaIcon size={{ base: size, md: size }} />,
    desc: welcomeDisciplinas.astrologia.desc,
    link: "/aprendizaje/cursosModalidad/" + astrologiaNom,
    available: true,
  },
  {
    name: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
    desc: welcomeDisciplinas.psicologia.desc,
    link: "/aprendizaje/cursosModalidad/" + neuropsicologiaNom,
    available: true,
  },
  {
    name: ayurvedaNom,
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    renderIcon: (size) => <AyurvedaIcon size={{ base: size, md: size }} />,
    desc: welcomeDisciplinas.ayurveda.desc,
    link: "/aprendizaje/cursosModalidad/" + ayurvedaNomLink,
    available: true,
  },
  {
    name: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
    desc: welcomeDisciplinas.tcm.desc,
    link: "/aprendizaje/cursosModalidad/" + tcmNomLink,
    available: true,
  },
  {
    name: fisiologiaNom,
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    renderIcon: (size) => <FisiologiaIcon size={size} />,
    desc: welcomeDisciplinas.fisiologia.desc,
    link: "/aprendizaje/cursosModalidad/" + fisiologiaNom,
    available: true,
  },
  {
    name: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    renderIcon: (size) => <NutricionIcon size={{ base: size, md: size }} />,
    desc: welcomeDisciplinas.nutricion.desc,
    link: "/aprendizaje/cursosModalidad/" + nutricionNomLink,
    available: true,
  },
  {
    name: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    renderIcon: (size) => <CabalaIcon size={{ base: size, md: size }} />,
    desc: welcomeDisciplinas.cabala.desc,
    link: "/aprendizaje/cursosModalidad/" + cabalaNom,
    available: true,
  },
  {
    name: culturaNom,
    bg: culturaBg,
    txt: culturaTxt,
    renderIcon: (size) => <CulturaIcon size={{ base: size, md: size }} />,
    desc: welcomeDisciplinas.cultura.desc,
    link: "/aprendizaje/cursosModalidad/" + culturaNom,
    available: true,
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
  const [showEspacioModal, setShowEspacioModal] = useState(false);
  const bienvenidaReveal = useReveal();
  const videoReveal = useReveal();
  const presentacionReveal = useReveal();
  const disciplinasTitleReveal = useReveal(0.2);
  const disciplinasReveal = useReveal(0.05);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
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

      {/* ── FRASE ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 14 }}>
        <Text
          color="white"
          textAlign="center"
          fontSize={{ base: "md", md: "xl", lg: "2xl" }}
          fontWeight="400"
          letterSpacing="0.06em"
          lineHeight="1.4"
          textShadow="0 0 13px rgba(255,255,255,0.7), 0 0 27px rgba(255,255,255,0.4), 0 0 54px rgba(180,255,245,0.35)"
          fontFamily="'EB Garamond', serif"
          maxW={{ base: "100%", md: "78%" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(18px)"}
          transition="opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s"
        >
          Un recorrido para entenderte: tus patrones, tu historia y tus células.
        </Text>
      </Flex>

      {/* ── LOGO SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 7, md: 9 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "54px", md: "72px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.78)) drop-shadow(0 0 24px rgba(255,255,255,0.42)) drop-shadow(0 0 47px rgba(180,255,245,0.32))" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-12deg)"}
          transition="opacity 1s ease 0.45s, transform 1s ease 0.45s"
        />
      </Flex>

      {/* ── BIENVENIDA ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 5, md: 7 }}>
        <Box
          ref={bienvenidaReveal.ref}
          w={{ base: "100%", md: "78%" }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          opacity={bienvenidaReveal.visible ? 1 : 0}
          transform={bienvenidaReveal.visible ? "none" : "translateX(-50px)"}
          transition="opacity 0.7s ease, transform 0.7s ease"
        >
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight="700"
            letterSpacing="0.06em"
            lineHeight="1.2"
            textShadow="0 0 16px rgba(255,255,255,0.85), 0 0 34px rgba(255,255,255,0.55), 0 0 63px rgba(180,255,245,0.45)"
            mb={1}
          >
            LIFE AS A PRIVILEGE
          </Text>
          <Text
            color="rgba(255,255,255,0.85)"
            fontSize={{ base: "xs", md: "sm" }}
            fontStyle="italic"
            fontWeight="400"
            letterSpacing="0.05em"
            fontFamily="'EB Garamond', serif"
            textShadow="0 0 9px rgba(255,255,255,0.7), 0 0 20px rgba(255,255,255,0.4)"
            mb={5}
          >
            La Vida como Privilegio
          </Text>
          <Text
            color="white"
            fontSize={{ base: "sm", md: "xl" }}
            lineHeight="1.9"
            letterSpacing="0.02em"
            textShadow="0 0 11px rgba(255,255,255,0.6), 0 0 25px rgba(255,255,255,0.3)"
            maxW={{ base: "100%", md: "88%" }}
          >
            Ciencia y conocimiento tradicional en un recorrido con principio y final.
          </Text>
        </Box>
      </Flex>

      {/* ── BOTÓN EL RECORRIDO ── */}
      <Flex
        ref={videoReveal.ref}
        justify="center"
        align="center"
        gap={{ base: 3, md: 4 }}
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 10, md: 12 }}
        opacity={videoReveal.visible ? 1 : 0}
        transform={videoReveal.visible ? "none" : "translateY(40px)"}
        transition="opacity 0.7s ease, transform 0.7s ease"
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
            style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.7)) drop-shadow(0 0 20px rgba(255,255,255,0.35))" }}
          />
          <Text
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "sm", md: "2xl" }}
            letterSpacing={{ base: "0.14em", md: "0.18em" }}
            textTransform="uppercase"
            textShadow="0 0 10px rgba(255,255,255,0.6), 0 0 22px rgba(255,255,255,0.35)"
            whiteSpace="nowrap"
          >
            El recorrido
          </Text>
          <Box
            as="span"
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "sm", md: "2xl" }}
            style={{ textShadow: "0 0 10px rgba(255,255,255,0.7), 0 0 22px rgba(255,255,255,0.4)" }}
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

      {/* ── PRESENTACIÓN ── */}
      <Flex
        ref={presentacionReveal.ref}
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 16, md: 20 }}
        gap={{ base: 5, md: 7 }}
      >
        {/* Foto */}
        <Box
          maxW={{ base: "234px", md: "306px" }}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="0 18px 45px rgba(0,0,0,0.35), 0 0 27px rgba(255,255,255,0.25), 0 0 54px rgba(180,255,245,0.2)"
          opacity={presentacionReveal.visible ? 1 : 0}
          transform={presentacionReveal.visible ? "scale(1)" : "scale(0.85)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >
          <Image
            src="/img/me/me.png"
            alt="María Escribano"
            w="100%"
            h="auto"
            display="block"
          />
        </Box>

        {/* Nombre */}
        <Text
          color="white"
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          fontWeight="700"
          fontFamily="'EB Garamond', serif"
          letterSpacing="0.04em"
          lineHeight="1.2"
          textShadow="0 0 13px rgba(255,255,255,0.65), 0 0 27px rgba(255,255,255,0.35), 0 0 54px rgba(180,255,245,0.3)"
          opacity={presentacionReveal.visible ? 1 : 0}
          transform={presentacionReveal.visible ? "translateY(0)" : "translateY(22px)"}
          transition="opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s"
        >
          María Escribano
        </Text>

        {/* Descripción */}
        <Text
          color="rgba(255,255,255,0.92)"
          fontSize={{ base: "sm", md: "lg" }}
          fontFamily="'EB Garamond', serif"
          lineHeight="1.9"
          letterSpacing="0.02em"
          textShadow="0 0 10px rgba(255,255,255,0.45), 0 0 22px rgba(255,255,255,0.22)"
          maxW={{ base: "100%", md: "70%" }}
          opacity={presentacionReveal.visible ? 1 : 0}
          transform={presentacionReveal.visible ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s"
        >
          Ingeniera informática, 21 años. No existía lo que he construido: un recorrido donde la psicología, la biología y los conocimientos ancestrales se combinan en vez de pelearse. Ahora son aliados.
        </Text>

        {/* Botón Conoce más */}
        <Flex
          align="center"
          gap={3}
          opacity={presentacionReveal.visible ? 1 : 0}
          transform={presentacionReveal.visible ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.7s ease 0.75s, transform 0.7s ease 0.75s"
          mt={2}
        >
          <Box
            h="1px"
            w={{ base: "16px", md: "56px" }}
            bg="linear-gradient(to right, transparent, rgba(255,255,255,0.7))"
            boxShadow="0 0 8px rgba(255,255,255,0.5)"
          />
          <Flex
            as="button"
            onClick={() => navigate("/quienSoy")}
            align="center"
            gap={2}
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize={{ base: "xs", md: "md" }}
            letterSpacing={{ base: "0.08em", md: "0.18em" }}
            textTransform="uppercase"
            whiteSpace="nowrap"
            px={{ base: 4, md: 9 }}
            py={{ base: "10px", md: "12px" }}
            flexShrink={0}
            borderRadius="full"
            border="1px solid rgba(255,255,255,0.55)"
            bg="rgba(255,255,255,0.08)"
            cursor="pointer"
            boxShadow="0 0 16px rgba(255,255,255,0.35), 0 0 36px rgba(255,255,255,0.18), 0 4px 14px rgba(0,0,0,0.18)"
            textShadow="0 0 10px rgba(255,255,255,0.6), 0 0 22px rgba(255,255,255,0.35)"
            _hover={{
              bg: "rgba(255,255,255,0.18)",
              borderColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 26px rgba(255,255,255,0.55), 0 0 54px rgba(180,255,245,0.35), 0 6px 18px rgba(0,0,0,0.22)",
              transform: "translateY(-1px)",
            }}
            transition="all 0.25s ease"
          >
            Conocer a la creadora
            <Box as="span" fontSize={{ base: "md", md: "lg" }} style={{ textShadow: "0 0 10px rgba(255,255,255,0.7), 0 0 22px rgba(255,255,255,0.4)" }}>
              →
            </Box>
          </Flex>
          <Box
            h="1px"
            w={{ base: "16px", md: "56px" }}
            bg="linear-gradient(to left, transparent, rgba(255,255,255,0.7))"
            boxShadow="0 0 8px rgba(255,255,255,0.5)"
          />
        </Flex>
      </Flex>

      {/* ── BANNERS PRODUCTOS & REELS ── */}
      {/* <Flex
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
      </Flex> */}

      {/* ── TÍTULO DISCIPLINAS ── */}
      <Flex
        ref={disciplinasTitleReveal.ref}
        direction="column"
        align="center"
        pt={{ base: 16, md: 20 }}
      >
        <Text
          color="rgba(255,255,255,0.85)"
          fontFamily="'EB Garamond', serif"
          fontStyle="italic"
          fontWeight="400"
          fontSize={{ base: "md", md: "xl" }}
          letterSpacing="0.12em"
          textShadow="0 0 9px rgba(255,255,255,0.45), 0 0 20px rgba(255,255,255,0.22)"
          textAlign="center"
          px={{ base: 5, md: 10 }}
          opacity={disciplinasTitleReveal.visible ? 1 : 0}
          transform={disciplinasTitleReveal.visible ? "translateY(0)" : "translateY(18px)"}
          transition="opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s"
        >
          Las 8 disciplinas…
        </Text>
      </Flex>

      {/* ── CARDS DE DISCIPLINAS ── */}
      <Box
        ref={disciplinasReveal.ref}
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 7, md: 11 }}
        pb={{ base: 9, md: 13 }}
      >
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={{ base: 4, md: 18 }}
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
              cursor="pointer"
              onClick={() => setSelected(d)}
              opacity={disciplinasReveal.visible ? 1 : 0}
              transform={disciplinasReveal.visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.93)"}
              transition={`opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`}
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
                border={"4px solid "+ d.txt}
                boxShadow={`0 0 20px ${d.txt}bb, 0 2px 14px ${d.txt}77`}
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
                fontSize={{ base: "lg", md: "2xl", lg: "3xl" }}
                letterSpacing="0.03em"
                lineHeight="short"
              >
                {d.name === "Medicina China" ? "Med. China" : d.name}
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>


      {/* ── SEPARADOR DE ZONAS ── */}
      <Flex justify="center" pt={{ base: 12, md: 16 }}>
        <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.18)" />
      </Flex>

      {/* ── OPINIONES ── */}
      <OpinionesSection />

      {/* ── SUSCRIPCIÓN ── */}
      <Flex justify="center" px={{ base: 5, md: 10 }} pb={{ base: 24, md: 32 }}>
        <SubscribeBox />
      </Flex>

      {/* ── FOOTER ── */}
      <SiteFooter />

      {/* ── MODAL ESPACIO (login requerido) ── */}
      {showEspacioModal && (
        <Box
          position="fixed"
          inset={0}
          zIndex={1100}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0,0,0,0.65)"
          sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          onClick={() => setShowEspacioModal(false)}
          px={{ base: 5, md: 10 }}
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            bg="rgba(0,90,80,0.92)"
            border="1px solid rgba(255,255,255,0.3)"
            sx={{ backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)" }}
            borderRadius="3xl"
            boxShadow="0 28px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1)"
            p={{ base: 10, md: 14 }}
            maxW="420px"
            w="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={6}
            textAlign="center"
            position="relative"
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
              bg="rgba(255,255,255,0.1)"
              border="none"
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontSize="18px"
              fontWeight="bold"
              _hover={{ bg: "rgba(255,255,255,0.22)" }}
              transition="background 0.18s"
              onClick={() => setShowEspacioModal(false)}
            >
              ✕
            </Box>

            {/* Logo */}
            <Image
              src="/img/icono/life.png"
              alt="Life as a Privilege"
              w="110px"
              objectFit="contain"
              filter="drop-shadow(0 4px 12px rgba(255, 255, 255, 0.35))"
            />

            {/* Mensaje */}
            <Text
              color="white"
              fontSize={{ base: "lg", md: "xl" }}
              fontFamily="'EB Garamond', serif"
              lineHeight="1.75"
              letterSpacing="0.02em"
              textShadow="0 1px 6px rgba(255, 255, 255, 0.3)"
            >
              Crea una cuenta o inicia sesión
              {/* <Box as="span" fontWeight="700">Espacio Personal de crecimiento</Box> */}
            </Text>

            {/* Botón login */}
            <Box
              as="button"
              onClick={() => navigate("/logIn")}
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "lg", md: "xl" }}
              letterSpacing="0.16em"
              textTransform="uppercase"
              px={10}
              py={3}
              borderRadius="full"
              border="2px solid rgba(255,255,255,0.65)"
              bg="rgba(255,255,255,0.14)"
              cursor="pointer"
              boxShadow="0 0 28px rgba(107,196,200,0.5), 0 2px 12px rgba(0,0,0,0.25)"
              _hover={{ bg: "rgba(255,255,255,0.26)", borderColor: "white", boxShadow: "0 0 40px rgba(107,196,200,0.8)" }}
              transition="all 0.22s ease"
            >
              Iniciar sesión →
            </Box>
          </Box>
        </Box>
      )}

      {/* ── MODAL ── */}
      {selected && (
        <Box
          position="fixed"
          inset={0}
          zIndex={1000}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0,0,0,0.6)"
          sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          onClick={() => setSelected(null)}
          px={{ base: 5, md: 10 }}
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            bg={selected.bg + "e8"}
            border={`1.5px solid ${selected.txt}55`}
            sx={{ backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)" }}
            borderRadius="2xl"
            boxShadow={`0 8px 48px rgba(0,0,0,0.45), 0 0 0 1px ${selected.txt}22`}
            p={{ base: 8, md: 12 }}
            maxW="560px"
            w="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={6}
            position="relative"
          >
            {/* X */}
            <Box
              position="absolute"
              top={4}
              right={5}
              as="button"
              onClick={() => setSelected(null)}
              color={selected.txt}
              fontSize="xl"
              cursor="pointer"
              bg={selected.txt + "22"}
              borderRadius="full"
              w="36px"
              h="36px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{ bg: selected.txt + "44" }}
              transition="background 0.2s"
            >
              ✕
            </Box>

            {/* Icono */}
            <Box
              bg={selected.bg}
              borderRadius="full"
              w={{ base: "88px", md: "108px" }}
              h={{ base: "88px", md: "108px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              border={`3px solid ${selected.txt}`}
              boxShadow={`0 0 20px ${selected.txt}bb, 0 2px 14px ${selected.txt}77`}
            >
              {selected.renderIcon("52px")}
            </Box>

            {/* Nombre */}
            <Text
              color={selected.txt}
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="700"
              letterSpacing="0.04em"
              textAlign="center"
            >
              {selected.name}
            </Text>

            {/* Descripción */}
            <Text
              color={selected.txt}
              fontSize={{ base: "lg", md: "xl" }}
              textAlign="center"
              lineHeight="1.9"
              letterSpacing="0.02em"
              opacity={0.82}
            >
              {selected.desc}
            </Text>

            {/* Botón APRENDER — desactivado temporalmente para v1, mostramos solo "Próximamente"
            {(() => {
              const isAvailable = selected.available === true;
              return (
                <Flex direction="column" align="center" gap={3} mt={2}>
                  <Flex
                    align="center" gap={3}
                    cursor={isAvailable ? "pointer" : "not-allowed"}
                    onClick={isAvailable ? () => navigate(selected.link) : undefined}
                    bg={selected.txt + "18"}
                    border={`1px solid ${selected.txt}66`}
                    borderRadius="full"
                    px={{ base: 10, md: 14 }} py={3}
                    opacity={isAvailable ? 1 : 0.45}
                    boxShadow={isAvailable ? `0 0 10px ${selected.txt}55, 0 2px 8px ${selected.txt}33` : "none"}
                    _hover={isAvailable ? { bg: selected.txt + "33", border: `1px solid ${selected.txt}`, boxShadow: `0 0 18px ${selected.txt}88, 0 4px 12px ${selected.txt}55` } : {}}
                    transition="all 0.2s"
                  >
                    <AprendizajeIcon color={selected.txt} size="30px" shadow={false} />
                    <Text color={selected.txt} fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} letterSpacing="0.1em">
                      APRENDER
                    </Text>
                  </Flex>
                  {!isAvailable && (
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
              );
            })()}
            */}
            {/* <Text
              color={selected.txt}
              fontSize="sm"
              letterSpacing="0.14em"
              opacity={0.7}
              fontStyle="italic"
              mt={2}
              textTransform="uppercase"
            >
              Próximamente
            </Text> */}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Welcome;
