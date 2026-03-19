import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { ContactModal } from "../../components/global/ContactModal";
import {
  astrologiaBg, astrologiaDescrip, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, ayurvedaDescrip, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  tcmBg, tcmDescrip, TCMIcon, tcmNom, tcmTxt,
  nutricionBg, nutricionDescrip, NutricionIcon, nutricionNom, nutricionTxt,
  fitoterapiaBg, fitoterapiaDescrip, FitoterapiaIcon, fitoterapiaNom, fitoterapiaTxt,
  cabalaBg, cabalaDescrip, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, fisiologiaDescrip, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
} from "../../GlobalVariables";

type ModalidadData = {
  name: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
  desc: string;
};

const modalidades: ModalidadData[] = [
  {
    name: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
    desc: "Entenderemos los orígenes de tus frustraciones sin poner etiquetas al sufrimiento. Sin juicios, encontraremos los patrones que repites y para qué los mantienes.",
  },
  {
    name: astrologiaNom,
    bg: astrologiaBg,
    txt: astrologiaTxt,
    renderIcon: (size) => <AstrologiaIcon size={{ base: size, md: size }} />,
    desc: astrologiaDescrip,
  },
  {
    name: ayurvedaNom,
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    renderIcon: (size) => <AyurvedaIcon size={size} />,
    desc: ayurvedaDescrip,
  },
  {
    name: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
    desc: tcmDescrip,
  },
  {
    name: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    renderIcon: (size) => <NutricionIcon size={{ base: size, md: size }} />,
    desc: nutricionDescrip,
  },
  {
    name: fitoterapiaNom,
    bg: fitoterapiaBg,
    txt: fitoterapiaTxt,
    renderIcon: (size) => <FitoterapiaIcon size={{ base: size, md: size }} />,
    desc: fitoterapiaDescrip,
  },
  {
    name: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    renderIcon: (size) => <CabalaIcon size={{ base: size, md: size }} />,
    desc: cabalaDescrip,
  },
  {
    name: fisiologiaNom,
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    renderIcon: (size) => <FisiologiaIcon size={size} />,
    desc: fisiologiaDescrip,
  },
];

const useReveal = (threshold = 0.12) => {
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

type MetodoCardProps = {
  data: ModalidadData;
  delay: number;
  parentVisible: boolean;
  index: number;
};

function MetodoCard({ data, delay, parentVisible, index }: MetodoCardProps) {
  return (
    <Box
      position="relative"
      mt="46px"
      pt="54px"
      pb={8}
      px={{ base: 5, md: 7 }}
      bg={data.bg}
      borderRadius="2xl"
      boxShadow="0 8px 28px rgba(107,196,200,0.5), 0 2px 8px rgba(107,196,200,0.25)"
      opacity={parentVisible ? 1 : 0}
      transform={parentVisible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.95)"}
      transition={`opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`}
      cursor="default"
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {/* Icono flotante */}
      <Box
        position="absolute"
        top="-38px"
        left="50%"
        transform="translateX(-50%)"
        bg={data.bg}
        borderRadius="full"
        p="8px"
        border={`4px solid ${data.txt}`}
        boxShadow={`0 0 20px ${data.txt}bb, 0 2px 14px ${data.txt}77`}
        w="76px"
        h="76px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {data.renderIcon("44px")}
      </Box>

      {/* Número + título */}
      <Flex align="baseline" justify="center" gap={2} mb={3}>
        <Text
          color={data.txt}
          fontWeight="700"
          fontSize={{ base: "xl", md: "2xl" }}
          opacity={0.6}
          letterSpacing="0.04em"
          lineHeight="short"
        >
          {index}.
        </Text>
        <Text
          color={data.txt}
          fontWeight="700"
          fontSize={{ base: "xl", md: "2xl" }}
          letterSpacing="0.04em"
          lineHeight="short"
          filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.3))"
        >
          {data.name}
        </Text>
      </Flex>

      {/* Descripción */}
      <Text
        color={data.txt}
        opacity={0.85}
        fontSize={{ base: "md", md: "lg" }}
        lineHeight="1.85"
        letterSpacing="0.01em"
      >
        {data.desc}
      </Text>
    </Box>
  );
}

export default function ElMetodo() {
  const headerReveal = useReveal(0.05);
  const cardsReveal = useReveal(0.04);
  const pricingReveal = useReveal(0.1);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="public" />

      {/* ── CABECERA ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 14 }}>
        <Box
          ref={headerReveal.ref}
          w={{ base: "100%", md: "80%" }}
          bg="rgba(255,255,255,0.22)"
          border="1px solid rgba(255,255,255,0.45)"
          sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
          borderRadius="2xl"
          boxShadow="0 8px 36px rgba(107,196,200,0.45)"
          px={{ base: 8, md: 14 }}
          py={{ base: 8, md: 10 }}
          display="flex"
          mt="10px"
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          gap={{ base: 6, md: 10 }}
          opacity={headerReveal.visible ? 1 : 0}
          transform={headerReveal.visible ? "none" : "translateY(-30px)"}
          transition="opacity 0.75s ease, transform 0.75s ease"
        >
          {/* Icono life.png a la izquierda */}
          <Box flexShrink={0} w={{ base: "110px", md: "140px" }} alignSelf="center">
            <Image
              src="/img/icono/life.png"
              alt="Life as a Privilege"
              w="100%"
              objectFit="contain"
              filter="drop-shadow(0 4px 14px rgba(255,255,255,0.3))"
            />
          </Box>

          {/* Título */}
          <Box flex="1" textAlign={{ base: "center", md: "left" }}>
           <Text
            color="white"
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight="700"
            letterSpacing="0.06em"
            lineHeight="1.15"
            textShadow="0 2px 14px rgba(0,80,70,0.4)"
          >
            EL MÉTODO DE<br />
            <Box as="span" fontStyle="italic" display="block" mt={2}>
              LIFE AS A PRIVILEGE
            </Box>
          </Text>
            <Text
              color="rgba(255,255,255,0.8)"
              fontSize={{ base: "md", md: "xl" }}
              lineHeight="1.85"
              letterSpacing="0.015em"
              mt={4}
              textShadow="0 1px 6px rgba(0,60,50,0.3)"
            >
              Una integración de sabidurías ancestrales y ciencias modernas para acompañar al ser Humano en su proceso de autoconocimiento, desde una visión holística y profunda.
            </Text>
          </Box>
        </Box>
      </Flex>

      {/* ── CARDS DE MODALIDADES ── */}
      <Box
        ref={cardsReveal.ref}
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 18, md: 24 }}
        pb={{ base: 6, md: 10 }}
      >
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
          gap={{ base: 12, md: 14 }}
        >
          {modalidades.map((m, i) => (
            <MetodoCard
              key={m.name}
              data={m}
              delay={i * 0.1}
              parentVisible={cardsReveal.visible}
              index={i}
            />
          ))}
        </Grid>
      </Box>

      {/* ── CARD DE INFORMACIÓN Y PRECIO ── */}
      <Flex
        justify="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 14, md: 18 }}
        pb={{ base: 16, md: 20 }}
      >
        <Box
          ref={pricingReveal.ref}
          w={{ base: "100%", md: "80%" }}
          bg="rgba(255,255,255,0.18)"
          border="1px solid rgba(255,255,255,0.4)"
          sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
          borderRadius="2xl"
          boxShadow="0 12px 50px rgba(107,196,200,0.4), 0 4px 20px rgba(107,196,200,0.2)"
          px={{ base: 8, md: 14 }}
          py={{ base: 10, md: 12 }}
          opacity={pricingReveal.visible ? 1 : 0}
          transform={pricingReveal.visible ? "none" : "translateY(28px)"}
          transition="opacity 0.75s ease, transform 0.75s ease"
          cursor="default"
        >
          {/* Encabezado */}
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            textAlign="center"
            mb={6}
            textShadow="0 2px 10px rgba(0,60,50,0.4)"
          >
            ¿Cómo funciona?
          </Text>

          {/* Info sesiones */}
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 6, md: 10 }}
            justify="center"
            align={{ base: "center", md: "flex-start" }}
            mb={8}
          >
            <Box textAlign="center" flex="1">
              <Text color="rgba(255,255,255,0.6)" fontSize="sm" letterSpacing="0.15em" textTransform="uppercase" mb={1}>
                Duración por sesión
              </Text>
              <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700">
                1 hora
              </Text>
            </Box>
            <Box
              display={{ base: "none", md: "block" }}
              w="1px"
              bg="rgba(255,255,255,0.25)"
              alignSelf="stretch"
            />
            <Box textAlign="center" flex="1">
              <Text color="rgba(255,255,255,0.6)" fontSize="sm" letterSpacing="0.15em" textTransform="uppercase" mb={1}>
                Precio por sesión
              </Text>
              <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700">
                10 €
              </Text>
            </Box>
            <Box
              display={{ base: "none", md: "block" }}
              w="1px"
              bg="rgba(255,255,255,0.25)"
              alignSelf="stretch"
            />
            <Box textAlign="center" flex="1">
              <Text color="rgba(255,255,255,0.6)" fontSize="sm" letterSpacing="0.15em" textTransform="uppercase" mb={1}>
                Nº de sesiones
              </Text>
              <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700">
                Variable
              </Text>
              <Text color="rgba(255,255,255,0.65)" fontSize="sm" mt={1}>
                depende de cada proceso
              </Text>
            </Box>
          </Flex>

          {/* Texto acompañamiento */}
          <Text
            color="rgba(255,255,255,0.88)"
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="1.9"
            letterSpacing="0.015em"
            textAlign="center"
            mb={6}
          >
            Este método incluye <strong>seguimiento personalizado</strong> y acompañamiento cercano durante todo el proceso. El número de sesiones no está predefinido: cada camino es único y se respeta su propio ritmo.
          </Text>

          {/* Mensaje sobre el precio */}
          <Box
            bg="rgba(255,255,255,0.12)"
            border="1px solid rgba(255,255,255,0.25)"
            borderRadius="xl"
            px={{ base: 6, md: 10 }}
            py={6}
          >
            <Text
              color="white"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.9"
              letterSpacing="0.015em"
              textAlign="center"
              fontStyle="italic"
            >
              El precio es <strong>económico</strong> porque creo que el camino de la consciencia no tiene que ser un lujo para unos pocos, sino un <strong>derecho del pueblo</strong>. Quiero que cualquier persona interesada pueda acceder, independientemente de su situación económica.
            </Text>
          </Box>
        </Box>
      </Flex>

      {/* ── BOTÓN ME INTERESA ── */}
      <Flex justify="center" pb={{ base: 16, md: 20 }}>
        <Box
          as="button"
          onClick={() => setModalOpen(true)}
          px={{ base: 10, md: 14 }}
          py={{ base: 4, md: 5 }}
          borderRadius="full"
          bg="transparent"
          border="2px solid rgba(255,255,255,0.65)"
          color="white"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="600"
          letterSpacing="0.12em"
          fontStyle="italic"
          boxShadow="0 4px 24px rgba(107,196,200,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
          sx={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          transition="all 0.3s ease"
          _hover={{
            bg: "rgba(255,255,255,0.12)",
            borderColor: "white",
            boxShadow: "0 8px 36px rgba(107,196,200,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
            transform: "translateY(-2px)",
          }}
          _active={{ transform: "translateY(0)", bg: "rgba(255,255,255,0.18)" }}
          cursor="pointer"
        >
          Me interesa
        </Box>
      </Flex>

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Me interesa"
        bgColor="#008080"
        color="#ffffff"
        emailSubject="Interés en El Método — Life as a Privilege"
        showCheckboxes={false}
        showDescription={false}
      />

      <SiteFooter />
    </Box>
  );
}
