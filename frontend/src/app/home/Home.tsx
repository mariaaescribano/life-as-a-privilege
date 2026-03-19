import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import { useNavigate } from "react-router-dom";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  fitoterapiaBg, FitoterapiaIcon, fitoterapiaNom, fitoterapiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
  EspacioPersonalIcon, AprendizajeIcon,
  fisiologiaDescrip,
  neuropsicologiaDescrip,
  astrologiaDescrip,
  tcmDescrip,
  nutricionDescrip,
  ayurvedaDescrip,
  fitoterapiaDescrip,
  cabalaDescrip,
  tcmNomLink,
} from "../../GlobalVariables";
import type { SessionStorageUser } from "../../dtos/user.types";
import SpinnerTurquesa from "../../components/global/Spinner";
import PhotoMandala from "../../components/home/PhotoMandala";
import SiteFooter from "../../components/global/Footer";

type Discipline = {
  name: string;
  bg: string;
  txt: string;
  description: string;
  renderIcon: (size: string) => React.ReactNode;
  linkEspacio: string;
  linkAprendizaje: string;
  available:boolean;
};

const disciplines: Discipline[] = [
  {
    name: fisiologiaNom, bg: fisiologiaBg, txt: fisiologiaTxt,
    description: fisiologiaDescrip,
    renderIcon: (s) => <FisiologiaIcon size={s} />,
    linkEspacio: "/espacio/questions/" + fisiologiaNom,
    linkAprendizaje: "/aprendizaje/cursosModalidad/" + fisiologiaNom,
    available:false
  },
  {
    name: neuropsicologiaNom, bg: neuropsicologiaBg, txt: neuropsicologiaTxt,
    description: neuropsicologiaDescrip,
    renderIcon: (s) => <NeuropsicologiaIcon size={{ base: s, md: s }} />,
    linkEspacio: "/espacio/questions/" + neuropsicologiaNom,
    linkAprendizaje: "/aprendizaje/cursosModalidad/" + neuropsicologiaNom,
    available:true
  },
  {
    name: astrologiaNom, bg: astrologiaBg, txt: astrologiaTxt,
    description: astrologiaDescrip,
    renderIcon: (s) => <AstrologiaIcon size={{ base: s, md: s }} />,
    linkEspacio: "/espacio/questions/" + astrologiaNom,
    linkAprendizaje: "/aprendizaje/cursosModalidad/" + astrologiaNom,
    available:true
  },
  {
    name: tcmNom, bg: tcmBg, txt: tcmTxt,
    description: tcmDescrip,
    renderIcon: (s) => <TCMIcon size={{ base: s, md: s }} />,
    linkEspacio: "/espacio/questions/" + tcmNomLink,
    linkAprendizaje: "/aprendizaje/cursosModalidad/" + tcmNomLink,
    available:true
  },
  {
    name: nutricionNom, bg: nutricionBg, txt: nutricionTxt,
    description: nutricionDescrip,
    renderIcon: (s) => <NutricionIcon size={{ base: s, md: s }} />,
    linkEspacio: "/espacio/questions/" + nutricionNom,
    linkAprendizaje: "/aprendizaje/cursosModalidad/" + nutricionNom,
    available:false
  },
  {
    name: ayurvedaNom, bg: ayurvedaBg, txt: ayurvedaTxt,
    description: ayurvedaDescrip,
    renderIcon: (s) => <AyurvedaIcon size={s} />,
    linkEspacio: "/espacio/questions/" + ayurvedaNom,
    linkAprendizaje: "/aprendizaje/cursosModalidad/" + ayurvedaNom,
    available:false
  },
  {
    name: fitoterapiaNom, bg: fitoterapiaBg, txt: fitoterapiaTxt,
    description: fitoterapiaDescrip,
    renderIcon: (s) => <FitoterapiaIcon size={{ base: s, md: s }} />,
    linkEspacio: "/espacio/questions/" + fitoterapiaNom,
    linkAprendizaje: "/aprendizaje/cursosModalidad/" + fitoterapiaNom,
    available:true
  },
  {
    name: cabalaNom, bg: cabalaBg, txt: cabalaTxt,
    description: cabalaDescrip,
    renderIcon: (s) => <CabalaIcon size={{ base: s, md: s }} />,
    linkEspacio: "/espacio/questions/" + cabalaNom,
    linkAprendizaje: "/aprendizaje/cursosModalidad/" + cabalaNom,
    available:true
  },
];

const useReveal = (threshold = 0.1) => {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);
  return { ref: setEl, visible };
};

const glassCard = {
  bg: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.38)",
  sx: { backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" },
  borderRadius: "2xl",
  boxShadow: "0 8px 40px rgba(107,196,200,0.45)",
};

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SessionStorageUser | null>(null);
  const [selectedDisc, setSelectedDisc] = useState<Discipline | null>(null);

  const bienvenidaReveal = useReveal();
  const mandalaReveal = useReveal(0.05);
  const disciplinasReveal = useReveal(0.04);

  const iconSizeMiEspacio   = useBreakpointValue({ base: "34px", md: "52px" }) ?? "52px";
  const iconSizeAprendizaje = useBreakpointValue({ base: "30px", md: "42px" }) ?? "42px";
  const iconSizeCard        = useBreakpointValue({ base: "30px", md: "42px" }) ?? "42px";
  const cardIconBox         = useBreakpointValue({ base: "56px", md: "72px" }) ?? "72px";
  const cardIconTop         = useBreakpointValue({ base: "-28px", md: "-36px" }) ?? "-36px";

  useEffect(() => {
    if (user == null) {
      const userId = sessionStorage.getItem("userId");
      const img = sessionStorage.getItem("img");
      const name = sessionStorage.getItem("name");
      if (userId && img && name) {
        setUser({ userId, name, img });
      } else {
        navigate("/");
      }
    }
  }, [user]);


  // #region return

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      {/* ── HEADER ── */}
      <SiteHeader variant="private" userImg={user?.img} />

      {/* ── MAIN ── */}
      <Box flex="1">
        {user && (
          <Flex
            direction="column"
            gap={{ base: 14, md: 20 }}
            px={{ base: 5, md: 10, lg: 16 }}
            pt={{ base: 10, md: 14 }}
            pb={{ base: 14, md: 20 }}
          >

            {/* ── FILA: BIENVENIDA + MANDALA ── */}
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 14, md: 6 }}
              align="stretch"
            >
              {/* CARD 1: BIENVENIDA */}
              <Box
                ref={bienvenidaReveal.ref}
                flex="1"
                position="relative"
                overflow="hidden"
                {...glassCard}
                px={{ base: 8, md: 10 }}
                py={{ base: 12, md: 14 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                opacity={bienvenidaReveal.visible ? 1 : 0}
                transform={bienvenidaReveal.visible ? "none" : "translateY(28px)"}
                transition="opacity 0.75s ease, transform 0.75s ease"
              >
                <Box
                  position="absolute" top="50%" left="50%"
                  transform="translate(-50%, -50%)"
                  w="90%" h="90%"
                  backgroundImage="url('/img/extras/flor.png')"
                  backgroundSize="contain" backgroundPosition="center"
                  backgroundRepeat="no-repeat" opacity={0.13}
                  zIndex={0} pointerEvents="none"
                />
                <VStack spacing={5} zIndex={1} position="relative" w="80%" align="center">
                  <Text
                    color="white" fontWeight="700"
                    fontSize={{ base: "4xl", md: "4xl", lg: "5xl" }}
                    textAlign="center" letterSpacing="0.06em" lineHeight="1.2"
                    style={{
                      filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
                    }}
                  >
                    Bienvenid@, {user.name}
                  </Text>
                  <Text
                    color="rgba(255,255,255,0.88)"
                    mt="15px"
                    fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                    textAlign="center" lineHeight="1.9" letterSpacing="0.02em"
                    //textShadow="0 1px 5px rgba(0,100,90,0.25)"
                    style={{
                      filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
                    }}
                  >
                    Este es tu espacio para aprender e integrar distintas modalidades en las que serás capaz de identificar tus bloqueos y tus trampas.
                  </Text>
                  <Text
                    color="rgba(255,255,255,0.88)"
                    fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                    textAlign="center" lineHeight="1.9" letterSpacing="0.02em"
                    style={{
                      filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
                    }}
                  >
                    Recuerda tratarte con paciencia, con Amor y como el Ser digno que eres.
                  </Text>
                  <Flex
                    as="button"
                    onClick={() => navigate("/elMetodo")}
                    align="center"
                    gap={2}
                    mt={3}
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
                      El Método
                    </Text>
                  </Flex>
                </VStack>
              </Box>

              {/* CARD 2: PHOTO MANDALA */}
              <Box
                ref={mandalaReveal.ref}
                flex="1"
                position="relative"
                border="1px solid rgba(255,255,255,0.38)"
                borderRadius="2xl"
                boxShadow="0 8px 40px rgba(107,196,200,0.45)"
                px={{ base: 6, md: 6 }}
                py={{ base: 8, md: 10 }}
                display="flex" flexDirection="column" alignItems="center" gap={4}
                opacity={mandalaReveal.visible ? 1 : 0}
                transform={mandalaReveal.visible ? "none" : "translateY(28px)"}
                transition="opacity 0.75s ease 0.12s, transform 0.75s ease 0.12s"
                bg="rgba(255,255,255,0.14)"
                sx={{
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <Flex align="center" gap={3}>
                  <EspacioPersonalIcon color="rgba(255,255,255,0.9)" size={iconSizeMiEspacio} />
                  <Text
                    color="white" fontSize={{ base: "xl", md: "4xl", lg: "5xl" }}
                    fontWeight="700" letterSpacing="0.05em"
                    style={{
                      filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
                    }} textAlign="center"
                  >
                    Mi Espacio
                  </Text>
                </Flex>
                <PhotoMandala fotoCentro={user.img} />
              </Box>
            </Flex>

            {/* ── CARD 3: APRENDIZAJES ── */}
            <Box
              ref={disciplinasReveal.ref}
              w="100%"
              {...glassCard}
              px={{ base: 6, md: 12 }}
              py={{ base: 10, md: 14 }}
            >
              <Flex align="center" justify="center" gap={3} mb={{ base: 10, md: 14 }}>
                <AprendizajeIcon color="rgba(255,255,255,0.9)" size={iconSizeAprendizaje} />
                <Text
                  color="white"
                  fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
                  fontWeight="700"
                  letterSpacing="0.06em"
                  textShadow="0 2px 10px rgba(7, 19, 17, 0.4)" 
                  textAlign="center"
                >
                  Aprendizajes
                </Text>
              </Flex>

              <Grid
                templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
                gap={{ base: 10, md: 12 }}
              >
                {disciplines.map((d, i) => {
                  const isSelected = selectedDisc?.name === d.name;
                  return (
                    <Box
                      key={i}
                      position="relative"
                      mt={{ base: "34px", md: "42px" }}
                      pt={{ base: "38px", md: "46px" }}
                      pb={{ base: 5, md: 7 }}
                      px={{ base: 3, md: 5 }}
                      bg={d.bg}
                      border="1px solid rgba(255,255,255,0.38)"
                      sx={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
                      borderRadius="2xl"
                      boxShadow={isSelected
                        ? "0 0 0 3px white, 0 8px 32px rgba(255,255,255,0.35), 0 0 40px rgba(107,196,200,0.7)"
                        : "0 8px 28px rgba(107,196,200,0.55), 0 2px 8px rgba(107,196,200,0.3)"}
                      cursor="pointer"
                      onClick={() => setSelectedDisc(d)}
                      opacity={disciplinasReveal.visible ? 1 : 0}
                      transform={disciplinasReveal.visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.93)"}
                      transition={`opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s, box-shadow 0.25s ease`}
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "0 18px 45px rgba(107,196,200,0.75), 0 4px 14px rgba(107,196,200,0.45)",
                      }}
                      textAlign="center"
                    >
                      {/* Icono sobresaliente — bg con color contraste */}
                      <Box
                        position="absolute"
                        top={cardIconTop} left="50%"
                        transform="translateX(-50%)"
                        bg={d.bg}
                        borderRadius="full"
                        p={{ base: "6px", md: "8px" }}
                        border={"4px solid "+ d.txt}
                        boxShadow={`0 0 20px ${d.txt}bb, 0 2px 14px ${d.txt}77`}
                        w={cardIconBox} h={cardIconBox}
                        display="flex" alignItems="center" justifyContent="center"
                      >
                        {d.renderIcon(iconSizeCard)}
                      </Box>

                      <Text
                        color={d.txt}
                        textShadow="0 2px 8px rgba(0,0,0,0.5)"
                        fontWeight="700"
                        fontSize={{ base: "lg", md: "2xl", lg: "3xl" }}
                        letterSpacing="0.03em"
                        lineHeight="short"
                      >
                        {d.name}
                      </Text>
                    </Box>
                  );
                })}
              </Grid>

            </Box>

            {/* ── ENLACE EL MÉTODO ── */}
            <Flex justify="center" pt={2} pb={4}>
              <Box
                as="button"
                onClick={() => navigate("/elMetodo")}
                color="rgba(255,255,255,0.9)"
                fontFamily="'EB Garamond', serif"
                fontWeight="600"
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="0.15em"
                px={8}
                py="10px"
                borderRadius="full"
                border="1px solid rgba(255,255,255,0.4)"
                bg="rgba(255,255,255,0.08)"
                cursor="pointer"
                _hover={{ bg: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.7)" }}
                transition="all 0.22s ease"
              >
                EL MÉTODO →
              </Box>
            </Flex>

            {/* ── BANNERS PRODUCTOS & REELS ── */}
            {/* <Flex gap={{ base: 5, md: 7 }} direction={{ base: "column", md: "row" }}>
              <ProductosBanner maxW="unset" w="100%" compact />
              <ReelsBanner    maxW="unset" w="100%" compact />
            </Flex> */}

          </Flex>
        )}

        {!user && <SpinnerTurquesa />}
      </Box>

      {/* ── MODAL DISCIPLINA ── */}
      {selectedDisc && (
        <Box
          position="fixed"
          inset={0}
          zIndex={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0,0,0,0.6)"
          sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          onClick={() => setSelectedDisc(null)}
          px={{ base: 5, md: 10 }}
        >
          {/* Card */}
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            bg={selectedDisc.bg + "e8"}
            border={`1.5px solid ${selectedDisc.txt}55`}
            sx={{ backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)" }}
            borderRadius="2xl"
            boxShadow={`0 8px 48px rgba(0,0,0,0.45), 0 0 0 1px ${selectedDisc.txt}22`}
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
              onClick={() => setSelectedDisc(null)}
              color={selectedDisc.txt}
              fontSize="xl"
              cursor="pointer"
              bg={selectedDisc.txt + "22"}
              borderRadius="full"
              w="36px"
              h="36px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{ bg: selectedDisc.txt + "44" }}
              transition="background 0.2s"
            >
              ✕
            </Box>

            {/* Icono */}
            <Box
              bg={selectedDisc.bg}
              borderRadius="full"
              w={{ base: "88px", md: "108px" }}
              h={{ base: "88px", md: "108px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              border={`3px solid ${selectedDisc.txt}`}
              boxShadow={`0 0 20px ${selectedDisc.txt}bb, 0 2px 14px ${selectedDisc.txt}77`}
            >
              {selectedDisc.renderIcon("52px")}
            </Box>

            {/* Nombre */}
            <Text
              color={selectedDisc.txt}
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="700"
              letterSpacing="0.04em"
              textAlign="center"
            >
              {selectedDisc.name}
            </Text>

            {/* Descripción */}
            <Text
              color={selectedDisc.txt}
              fontSize={{ base: "lg", md: "xl" }}
              textAlign="center"
              lineHeight="1.9"
              letterSpacing="0.02em"
              opacity={0.82}
            >
              {selectedDisc.description}
            </Text>

            {/* Botones */}
            {(() => {
              const isAvailable = selectedDisc.available === true;
              return (
                <Flex direction="column" align="center" gap={3} mt={2}>
                  <Flex gap={{ base: 4, md: 6 }} justify="center" wrap="wrap">
                    <Flex
                      align="center" gap={3}
                      cursor={isAvailable ? "pointer" : "not-allowed"}
                      onClick={isAvailable ? () => navigate(selectedDisc.linkEspacio) : undefined}
                      bg={selectedDisc.txt + "18"}
                      border={`1px solid ${selectedDisc.txt}66`}
                      borderRadius="full"
                      px={{ base: 5, md: 7 }} py={3}
                      opacity={isAvailable ? 1 : 0.45}
                      boxShadow={isAvailable ? `0 0 20px ${selectedDisc.txt}bb, 0 2px 14px ${selectedDisc.txt}77` : "none"}
                      _hover={isAvailable ? { bg: selectedDisc.txt + "33", border: `1px solid ${selectedDisc.txt}`, boxShadow: `0 0 30px ${selectedDisc.txt}dd, 0 4px 18px ${selectedDisc.txt}99` } : {}}
                      transition="all 0.2s"
                    >
                      <EspacioPersonalIcon color={selectedDisc.txt} size="24px" shadow={false}/>
                      <Text color={selectedDisc.txt} fontWeight="600" fontSize={{ base: "lg", md: "xl" }}
                      //  style={{
                      //   filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
                      // }}
                      >
                        Mi Espacio
                      </Text>
                    </Flex>
                    <Flex
                      align="center" gap={3}
                      cursor={isAvailable ? "pointer" : "not-allowed"}
                      onClick={isAvailable ? () => navigate(selectedDisc.linkAprendizaje) : undefined}
                      bg={selectedDisc.txt + "18"}
                      border={`1px solid ${selectedDisc.txt}66`}
                      borderRadius="full"
                      px={{ base: 5, md: 7 }} py={3}
                      opacity={isAvailable ? 1 : 0.45}
                      boxShadow={isAvailable ? `0 0 20px ${selectedDisc.txt}bb, 0 2px 14px ${selectedDisc.txt}77` : "none"}
                      _hover={isAvailable ? { bg: selectedDisc.txt + "33", border: `1px solid ${selectedDisc.txt}`, boxShadow: `0 0 30px ${selectedDisc.txt}dd, 0 4px 18px ${selectedDisc.txt}99` } : {}}
                      transition="all 0.2s"
                    >
                      <AprendizajeIcon color={selectedDisc.txt} size="30px" shadow={false} />
                      <Text color={selectedDisc.txt} fontWeight="600" fontSize={{ base: "lg", md: "xl" }}
                      // style={{
                      //   filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
                      // }}
                      >
                        Aprendizaje
                      </Text>
                    </Flex>
                  </Flex>
                  {!isAvailable && (
                    <Text
                      color={selectedDisc.txt}
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

      {/* ── FOOTER ── */}
      <SiteFooter />
    </Box>
  );
};

export default Home;
