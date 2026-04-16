import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import {
  astrologiaBg, astrologiaDescrip, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, ayurvedaDescrip, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  culturaBg, culturaDescrip, CulturaIcon, culturaNom, culturaTxt,
  cabalaBg, cabalaDescrip, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, fisiologiaDescrip, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, neuropsicologiaDescrip, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, nutricionDescrip, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, tcmDescrip, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
  AprendizajeIcon,
  nutricionNomLink,
  ayurvedaNomLink,
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
    link: "/aprendizaje/cursosModalidad/" + fisiologiaNom,
    available: true
  },
  {
    name: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
    desc: neuropsicologiaDescrip,
    link: "/aprendizaje/cursosModalidad/" + neuropsicologiaNom,
    available:true
  },
  {
    name: astrologiaNom,
    bg: astrologiaBg,
    txt: astrologiaTxt,
    renderIcon: (size) => <AstrologiaIcon size={{ base: size, md: size }} />,
    desc: astrologiaDescrip,
    link: "/aprendizaje/cursosModalidad/" + astrologiaNom,
    available:true
  },
  {
    name: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
    desc: tcmDescrip,
    link: "/aprendizaje/cursosModalidad/" + tcmNomLink,
    available:true
  },
  {
    name: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    renderIcon: (size) => <NutricionIcon size={{ base: size, md: size }} />,
    desc: nutricionDescrip,
    link: "/aprendizaje/cursosModalidad/" + nutricionNomLink,
    available:true
  },
  {
    name: ayurvedaNom,
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    renderIcon: (size) => <AyurvedaIcon size={{ base: size, md: size }} />,
    desc: ayurvedaDescrip,
    link: "/aprendizaje/cursosModalidad/" + ayurvedaNomLink,
    available:true
  },
  {
    name: culturaNom,
    bg: culturaBg,
    txt: culturaTxt,
    renderIcon: (size) => <CulturaIcon size={{ base: size, md: size }} />,
    desc: culturaDescrip,
    link: "/aprendizaje/cursosModalidad/" + culturaNom,
    available:true
  },
  {
    name: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    renderIcon: (size) => <CabalaIcon size={{ base: size, md: size }} />,
    desc: cabalaDescrip,
    link: "/aprendizaje/cursosModalidad/" + cabalaNom,
    available:true
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
            <Image src="/img/icono/life.png" alt="Life as a Privilege" w="100%" objectFit="contain" />
          </Box>

          {/* Texto */}
          <Box flex="1" mt={{ base: "10px", md: "30px" }} textAlign={{ base: "center", md: "left" }}>
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
              Es una plataforma gratuita que integra psicología, conocimientos ancestrales y ciencia para ofrecer una visión holística del ser Humano y acompañar su proceso de autoconocimiento y transformación.
            </Text>
            <Box mt={{ base: "30px", md: "20px" }}  display="flex" justifyContent={{ base: "center", md: "flex-end" }}>
              <Flex
                as="button"
                onClick={() => navigate("/elMetodo")}
                align="center"
                gap={2}
                px={6}
                py="9px"
                borderRadius="full"
                border="1px solid rgba(255,255,255,0.38)"
                bg="rgba(255,255,255,0.09)"
                cursor="pointer"
                _hover={{ bg: "rgba(255,255,255,0.2)", borderColor: "rgba(255,255,255,0.7)" }}
                transition="all 0.22s ease"
              >
                <Image src="/img/icono/life.png" alt="" h="22px" objectFit="contain" />
                <Text
                  color="rgba(255,255,255,0.9)"
                  fontFamily="'EB Garamond', serif"
                  fontWeight="600"
                  fontSize="sm"
                  letterSpacing="0.16em"
                >
                  El Método →
                </Text>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Flex>

      {/* ── BOTÓN NUEVOS CURSOS ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 12 }}>
        <Flex
          as="button"
          onClick={() => navigate("/aprendizaje/nuevosCursos")}
          align="center"
          gap={3}
          px={{ base: 8, md: 12 }}
          py={{ base: "14px", md: "16px" }}
          borderRadius="full"
          border="1.5px solid rgba(255,255,255,0.55)"
          bg="rgba(255,255,255,0.10)"
          cursor="pointer"
          boxShadow="0 0 28px rgba(72,192,181,0.65), 0 0 70px rgba(72,192,181,0.28), 0 4px 18px rgba(0,0,0,0.2)"
          _hover={{
            bg: "rgba(255,255,255,0.20)",
            borderColor: "rgba(255,255,255,0.85)",
            boxShadow: "0 0 44px rgba(72,192,181,0.9), 0 0 90px rgba(72,192,181,0.45), 0 6px 26px rgba(0,0,0,0.25)",
            transform: "translateY(-2px)",
          }}
          transition="all 0.25s ease"
        >
          <Image src="/img/icono/life.png" alt="" h={{ base: "28px", md: "34px" }} objectFit="contain" />
          <Text
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "xl", md: "2xl" }}
            letterSpacing="0.12em"
            style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }}
          >
            Nuevos Cursos
          </Text>
        </Flex>
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
            w={{ base: "200px", md: "300px" }}
            h={{ base: "260px", md: "380px" }}
            borderRadius="xl"
            mt={{ base: "0px", md: "10px" }}
            overflow="hidden"
            boxShadow="0 20px 50px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)"
            alignSelf={{ base: "center", md: "flex-start" }}
          >
            <Image
              src="/img/me/me.jpg"
              alt="María Escribano"
              w="100%"
              h="100%"
              objectFit="cover"
              objectPosition="center top"
            />
          </Box>

          {/* Texto */}
          <Box flex="1" mt={{ base: "10px", md: "20px" }} textAlign={{ base: "center", md: "left" }} display="flex" flexDirection="column">
            <Text
              color="white"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="700"
              fontFamily="'EB Garamond', serif"
              letterSpacing="0.04em"
              lineHeight="1.2"
              textShadow="0 2px 10px rgba(0,60,50,0.5)"
              mb={{ base: 0, md: 3 }}
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
              <br />
                  Mi propósito es profundizar en la naturaleza humana, usando psicología, filosofía, ciencias biológicas y sabidurías ancestrales para ello.
              <br />
              <br />
              “La Vida como Privilegio” es una forma de mirar, una posibilidad de elegir cómo vivir. Esta plataforma te invita a redescubrir al ser Humano como el ser digno que es.</Text>
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
              transition={`opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s, box-shadow 0.22s ease`}
              _hover={{
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
                {d.name}
              </Text>
            </Box>
          ))}
        </Grid>
      </Box>


      {/* ── SUSCRIPCIÓN ── */}
      <Flex justify="center" px={{ base: 5, md: 10 }} pb={{ base: 8, md: 12 }}>
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
              letterSpacing="0.12em"
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

            {/* Botón APRENDER */}
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
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Welcome;
