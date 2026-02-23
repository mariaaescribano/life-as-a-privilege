import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  biologiaBg, BiologiaIcon, biologiaNom, biologiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
  EspacioPersonalIcon, AprendizajeIcon,
} from "../../GlobalVariables";
import type { SessionStorageUser } from "../../dtos/user.types";
import SpinnerTurquesa from "../../components/global/Spinner";
import PhotoMandala from "../../components/home/PhotoMandala";

type Discipline = {
  name: string;
  bg: string;
  txt: string;
  description: string;
  renderIcon: (size: string) => React.ReactNode;
  linkEspacio: string;
  linkAprendizaje: string;
};

const disciplines: Discipline[] = [
  {
    name: fisiologiaNom, bg: fisiologiaBg, txt: fisiologiaTxt,
    description: "Comprende los procesos biológicos que rigen tu cuerpo y aprende a escuchar sus señales para vivir en equilibrio con tu naturaleza.",
    renderIcon: (s) => <FisiologiaIcon size={s} />,
    linkEspacio: "/espacio/questions/" + fisiologiaNom,
    linkAprendizaje: "/aprendizaje/modulosPage/" + fisiologiaNom,
  },
  {
    name: neuropsicologiaNom, bg: neuropsicologiaBg, txt: neuropsicologiaTxt,
    description: "Entiende lo que te condicionó desde antes de tu nacimiento. Integra desde el Amor, la racionalidad y el perdón todas las partes de ti para coger las riendas de tu Vida.",
    renderIcon: (s) => <NeuropsicologiaIcon size={{ base: s, md: s }} />,
    linkEspacio: "/espacio/questions/" + neuropsicologiaNom,
    linkAprendizaje: "/aprendizaje/modulosPage/" + neuropsicologiaNom,
  },
  {
    name: astrologiaNom, bg: astrologiaBg, txt: astrologiaTxt,
    description: "Descubre el mapa cósmico de tu alma y cómo los ciclos planetarios influyen en tus patrones de vida, tus relaciones y tu propósito.",
    renderIcon: (s) => <AstrologiaIcon size={s} />,
    linkEspacio: "/espacio/questions/" + astrologiaNom,
    linkAprendizaje: "/aprendizaje/modulosPage/" + astrologiaNom,
  },
  {
    name: tcmNom, bg: tcmBg, txt: tcmTxt,
    description: "Equilibra el flujo de energía vital Qi y descubre cómo los principios milenarios de la Medicina Tradicional China pueden restaurar tu armonía interior.",
    renderIcon: (s) => <TCMIcon size={s} />,
    linkEspacio: "/espacio/questions/" + tcmNom,
    linkAprendizaje: "/aprendizaje/modulosPage/" + tcmNom,
  },
  {
    name: nutricionNom, bg: nutricionBg, txt: nutricionTxt,
    description: "Aprende a alimentarte de forma consciente, comprendiendo cómo cada elección nutricional impacta tu energía, tus emociones y tu bienestar.",
    renderIcon: (s) => <NutricionIcon size={s} />,
    linkEspacio: "/espacio/questions/" + nutricionNom,
    linkAprendizaje: "/aprendizaje/modulosPage/" + nutricionNom,
  },
  {
    name: ayurvedaNom, bg: ayurvedaBg, txt: ayurvedaTxt,
    description: "Conoce tu constitución única según la medicina ancestral india y transforma tu vida con hábitos y rutinas adaptadas a tu naturaleza.",
    renderIcon: (s) => <AyurvedaIcon size={s} />,
    linkEspacio: "/espacio/questions/" + ayurvedaNom,
    linkAprendizaje: "/aprendizaje/modulosPage/" + ayurvedaNom,
  },
  {
    name: biologiaNom, bg: biologiaBg, txt: biologiaTxt,
    description: "Descubre el poder curativo de las plantas y aprende a utilizar la sabiduría de la naturaleza para tu salud y equilibrio.",
    renderIcon: (s) => <BiologiaIcon size={s} />,
    linkEspacio: "/espacio/questions/" + biologiaNom,
    linkAprendizaje: "/aprendizaje/modulosPage/" + biologiaNom,
  },
  {
    name: cabalaNom, bg: cabalaBg, txt: cabalaTxt,
    description: "Explora la tradición mística judía para comprender la estructura del alma y desvelar tu camino único de evolución espiritual.",
    renderIcon: (s) => <CabalaIcon size={s} />,
    linkEspacio: "/espacio/questions/" + cabalaNom,
    linkAprendizaje: "/aprendizaje/modulosPage/" + cabalaNom,
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

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


  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      {/* ── HEADER ── */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={{ base: 5, md: 12 }}
        py={{ base: 3, md: 4 }}
        bg="#008080"
        position="sticky"
        top="0"
        zIndex="100"
        borderBottom="1px solid rgba(255,255,255,0.12)"
      >
        <Image
          src="/img/life.png"
          h={{ base: "56px", md: "70px" }}
          objectFit="contain"
          cursor="pointer"
          onClick={() => navigate("/")}
          _hover={{ opacity: 0.85 }}
          transition="opacity 0.2s"
        />

        {user && (
          <Flex align="center" gap={{ base: 4, md: 6 }}>
            <Flex
              align="center" gap={2} cursor="pointer"
              onClick={() => navigate("/espacio/espacioHome")}
              color="rgba(255,255,255,0.85)" _hover={{ color: "white" }} transition="color 0.2s"
            >
              <EspacioPersonalIcon color="currentColor" size={{ base: "22px", md: "24px" } as any} />
              <Text display={{ base: "none", md: "block" }} fontSize={{ base: "sm", md: "md" }} fontWeight="500" letterSpacing="0.04em" textShadow="0 1px 4px rgba(0,80,70,0.5)">
                Mi Espacio
              </Text>
            </Flex>

            <Flex
              align="center" gap={2} cursor="pointer"
              onClick={() => navigate("/aprendizaje/aprendizajeHome")}
              color="rgba(255,255,255,0.85)" _hover={{ color: "white" }} transition="color 0.2s"
            >
              <AprendizajeIcon color="currentColor" size={{ base: "22px", md: "24px" } as any} />
              <Text display={{ base: "none", md: "block" }} fontSize={{ base: "sm", md: "md" }} fontWeight="500" letterSpacing="0.04em" textShadow="0 1px 4px rgba(0,80,70,0.5)">
                Aprendizajes
              </Text>
            </Flex>

            <Box
              w={{ base: "36px", md: "42px" }} h={{ base: "36px", md: "42px" }}
              borderRadius="full" overflow="hidden"
              border="2px solid rgba(255,255,255,0.55)" flexShrink={0}
              cursor="pointer" onClick={() => navigate("/espacio/espacioHome")}
              _hover={{ border: "2px solid white" }} transition="border 0.2s"
            >
              <Image src={user.img} w="100%" h="100%" objectFit="cover" />
            </Box>
          </Flex>
        )}
      </Flex>

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
                  backgroundImage="url('/img/flor.png')"
                  backgroundSize="contain" backgroundPosition="center"
                  backgroundRepeat="no-repeat" opacity={0.13}
                  zIndex={0} pointerEvents="none"
                />
                <VStack spacing={5} zIndex={1} position="relative" align="center">
                  <Text
                    color="white" fontWeight="700"
                    fontSize={{ base: "4xl", md: "4xl", lg: "5xl" }}
                    textAlign="center" letterSpacing="0.06em" lineHeight="1.2"
                    textShadow="0 2px 10px rgba(0,100,90,0.4)"
                  >
                    Bienvenida, {user.name}
                  </Text>
                  <Text
                    color="rgba(255,255,255,0.88)"
                    fontSize={{ base: "lg", md: "lg", lg: "xl" }}
                    textAlign="center" lineHeight="1.9" letterSpacing="0.02em"
                    textShadow="0 1px 5px rgba(0,100,90,0.25)"
                  >
                    Este es tu espacio para aprender e integrar distintas modalidades en las que serás capaz de identificar tus bloqueos y tus trampas.
                  </Text>
                  <Text
                    color="rgba(255,255,255,0.88)"
                    fontSize={{ base: "lg", md: "lg", lg: "xl" }}
                    textAlign="center" lineHeight="1.9" letterSpacing="0.02em"
                    textShadow="0 1px 5px rgba(0,100,90,0.25)"
                  >
                    Recuerda tratarte con paciencia y con Amor, este camino no es fácil pero merece la pena.
                  </Text>
                </VStack>
              </Box>

              {/* CARD 2: PHOTO MANDALA */}
              <Box
                ref={mandalaReveal.ref}
                flex="1"
                {...glassCard}
                px={{ base: 6, md: 6 }}
                py={{ base: 8, md: 10 }}
                display="flex" flexDirection="column" alignItems="center" gap={4}
                opacity={mandalaReveal.visible ? 1 : 0}
                transform={mandalaReveal.visible ? "none" : "translateY(28px)"}
                transition="opacity 0.75s ease 0.12s, transform 0.75s ease 0.12s"
              >
                <Flex align="center" gap={3}>
                  <EspacioPersonalIcon color="rgba(255,255,255,0.9)" size="32px" />
                  <Text
                    color="white" fontSize={{ base: "2xl", md: "3xl", lg: "3xl" }}
                    fontWeight="700" letterSpacing="0.05em"
                    textShadow="0 2px 10px rgba(0,100,90,0.4)" textAlign="center"
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
              <Text
                color="white"
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="700"
                letterSpacing="0.06em"
                textShadow="0 2px 10px rgba(0,100,90,0.4)"
                textAlign="center"
                mb={{ base: 10, md: 14 }}
              >
                Aprendizajes
              </Text>

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
                      mt="34px"
                      pt="38px"
                      pb={{ base: 5, md: 7 }}
                      px={{ base: 3, md: 5 }}
                      bg={d.bg}
                      borderRadius="2xl"
                      boxShadow={isSelected
                        ? "0 0 0 3px white, 0 8px 32px rgba(255,255,255,0.35), 0 0 40px rgba(107,196,200,0.7)"
                        : "0 8px 28px rgba(107,196,200,0.55), 0 2px 8px rgba(107,196,200,0.3)"}
                      cursor="pointer"
                      onClick={() => setSelectedDisc(d)}
                      opacity={disciplinasReveal.visible ? 1 : 0}
                      transform={disciplinasReveal.visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.93)"}
                      transition={`opacity 0.5s ease ${i * 0.09}s, transform 0.5s ease ${i * 0.09}s, box-shadow 0.25s ease`}
                      _hover={{
                        transform: "translateY(-5px)",
                        boxShadow: "0 18px 45px rgba(107,196,200,0.75), 0 4px 14px rgba(107,196,200,0.45)",
                      }}
                      textAlign="center"
                    >
                      {/* Icono sobresaliente — bg con color contraste */}
                      <Box
                        position="absolute"
                        top="-28px" left="50%"
                        transform="translateX(-50%)"
                        bg={d.bg}
                        borderRadius="full"
                        p="10px"
                        border={"3px solid "+ d.txt}
                        boxShadow="0 4px 16px rgba(107,196,200,0.6)"
                        w="56px" h="56px"
                        display="flex" alignItems="center" justifyContent="center"
                      >
                        {d.renderIcon("28px")}
                      </Box>

                      <Text
                        color={d.txt}
                        filter="drop-shadow(2px 2px 2px rgba(0,0,0,0.4))"
                        fontWeight="700"
                        fontSize={{ base: "2xl", md: "2xl", lg: "3xl" }}
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
              boxShadow={`0 4px 24px rgba(0,0,0,0.25), 0 0 32px ${selectedDisc.txt}55`}
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
            <Flex gap={{ base: 4, md: 6 }} justify="center" wrap="wrap" mt={2}>
              <Flex
                align="center" gap={3} cursor="pointer"
                onClick={() => navigate(selectedDisc.linkEspacio)}
                bg={selectedDisc.txt + "18"}
                border={`1px solid ${selectedDisc.txt}66`}
                borderRadius="full"
                px={{ base: 5, md: 7 }} py={3}
                _hover={{ bg: selectedDisc.txt + "33", border: `1px solid ${selectedDisc.txt}` }}
                transition="all 0.2s"
              >
                <EspacioPersonalIcon color={selectedDisc.txt} size="24px" />
                <Text color={selectedDisc.txt} fontWeight="600" fontSize={{ base: "lg", md: "xl" }}>
                  Mi Espacio
                </Text>
              </Flex>
               <Flex
                align="center" gap={3} cursor="pointer"
                onClick={() => navigate(selectedDisc.linkAprendizaje)}
                bg={selectedDisc.txt + "18"}
                border={`1px solid ${selectedDisc.txt}66`}
                borderRadius="full"
                px={{ base: 5, md: 7 }} py={3}
                _hover={{ bg: selectedDisc.txt + "33", border: `1px solid ${selectedDisc.txt}` }}
                transition="all 0.2s"
              >
                <AprendizajeIcon color={selectedDisc.txt} size="24px" />
                <Text color={selectedDisc.txt} fontWeight="600" fontSize={{ base: "lg", md: "xl" }}>
                  Aprendizaje
                </Text>
              </Flex>
            </Flex>
          </Box>
        </Box>
      )}

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.15)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>
    </Box>
  );
};

export default Home;
