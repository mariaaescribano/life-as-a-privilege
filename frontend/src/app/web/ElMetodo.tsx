import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { ContactModal } from "../../components/global/ContactModal";
import { BookCallModal } from "../../components/global/BookCallModal";
import { recorridoContenido, type ContenidoSeccion } from "../../data/recorridoContenido";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
} from "../../GlobalVariables";

type ModalidadData = {
  name: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
  desc: string;
  modalDesc: string;
  contenido: ContenidoSeccion[];
};

const modalidades: ModalidadData[] = [
  {
    name: astrologiaNom,
    bg: astrologiaBg,
    txt: astrologiaTxt,
    renderIcon: (size) => <AstrologiaIcon size={{ base: size, md: size }} />,
    ...recorridoContenido.astrologia,
  },
  {
    name: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
    ...recorridoContenido.psicologia,
  },
  {
    name: ayurvedaNom,
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    renderIcon: (size) => <AyurvedaIcon size={{ base: size, md: size }} />,
    ...recorridoContenido.ayurveda,
  },
  {
    name: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
    ...recorridoContenido.tcm,
  },
  {
    name: fisiologiaNom,
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    renderIcon: (size) => <FisiologiaIcon size={size} />,
    ...recorridoContenido.fisiologia,
  },
  {
    name: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    renderIcon: (size) => <NutricionIcon size={{ base: size, md: size }} />,
    ...recorridoContenido.nutricion,
  },
  {
    name: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    renderIcon: (size) => <CabalaIcon size={{ base: size, md: size }} />,
    ...recorridoContenido.cabala,
  },
  {
    name: culturaNom,
    bg: culturaBg,
    txt: culturaTxt,
    renderIcon: (size) => <CulturaIcon size={{ base: size, md: size }} />,
    ...recorridoContenido.cultura,
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
  onClick: () => void;
};

function MetodoCard({ data, delay, parentVisible, index, onClick }: MetodoCardProps) {
  return (
    <Box
      position="relative"
      mt="42px"
      pt="46px"
      pb={{ base: 5, md: 7 }}
      px={{ base: 3, md: 5 }}
      bg={data.bg}
      borderRadius="2xl"
      opacity={parentVisible ? 1 : 0}
      transform={parentVisible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.93)"}
      transition={`opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`}
      cursor="pointer"
      onClick={onClick}
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {/* Icono flotante */}
      <Box
        position="absolute"
        top="-36px"
        left="50%"
        transform="translateX(-50%)"
        bg={data.bg}
        borderRadius="full"
        p="8px"
        border={`4px solid ${data.txt}`}
        boxShadow={`0 0 20px ${data.txt}bb, 0 2px 14px ${data.txt}77`}
        w="72px"
        h="72px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {data.renderIcon("42px")}
      </Box>

      {/* Número + título */}
      <Flex align="baseline" justify="center" gap={2}>
        <Text
          color={data.txt}
          fontWeight="700"
          fontSize={{ base: "lg", md: "2xl", lg: "3xl" }}
          opacity={0.6}
          letterSpacing="0.03em"
          lineHeight="short"
        >
          {index}.
        </Text>
        <Text
          color={data.txt}
          fontWeight="700"
          fontSize={{ base: "lg", md: "2xl", lg: "3xl" }}
          letterSpacing="0.03em"
          lineHeight="short"
        >
          {data.name === "Medicina China" ? "Med. China" : data.name}
        </Text>
      </Flex>
    </Box>
  );
}

export default function ElMetodo() {
  const navigate = useNavigate();
  const headerReveal = useReveal(0.05);
  const disciplinasTitleReveal = useReveal(0.15);
  const cardsReveal = useReveal(0.04);
  const pricingReveal = useReveal(0.1);
  const comunidadReveal = useReveal(0.15);
  const botonesReveal = useReveal(0.1);
  const [dudasOpen, setDudasOpen] = useState(false);
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ModalidadData | null>(null);
  const [mounted, setMounted] = useState(false);

  const handleApuntarme = () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");

    if (!userId || !token) {
      navigate("/signIn?next=/home");
      return;
    }
    navigate("/home");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedCard]);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "63px", md: "86px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.78)) drop-shadow(0 0 23px rgba(255,255,255,0.42)) drop-shadow(0 0 47px rgba(180,255,245,0.32))" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-12deg)"}
          transition="opacity 1s ease 0.1s, transform 1s ease 0.1s"
        />
      </Flex>

      {/* ── CABECERA ── */}
      <Flex
        ref={headerReveal.ref}
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 7, md: 9 }}
        mb="10px"
        gap={{ base: 4, md: 5 }}
      >
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.08em"
          lineHeight="1.1"
          textShadow="0 0 16px rgba(255,255,255,0.85), 0 0 34px rgba(255,255,255,0.55), 0 0 63px rgba(180,255,245,0.45)"
          opacity={headerReveal.visible ? 1 : 0}
          transform={headerReveal.visible ? "translateY(0)" : "translateY(22px)"}
          transition="opacity 0.85s ease, transform 0.85s ease"
        >
          EL RECORRIDO
        </Text>
        <Text
          color="rgba(255,255,255,0.85)"
          fontSize={{ base: "xs", md: "sm" }}
          fontStyle="italic"
          fontWeight="400"
          letterSpacing="0.05em"
          textShadow="0 0 9px rgba(255,255,255,0.55), 0 0 20px rgba(255,255,255,0.3)"
          opacity={headerReveal.visible ? 1 : 0}
          transform={headerReveal.visible ? "translateY(0)" : "translateY(14px)"}
          transition="opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s"
        >
          de Life as a Privilege
        </Text>
        <Text
          color="white"
          fontSize={{ base: "sm", md: "lg" }}
          lineHeight="1.95"
          letterSpacing="0.015em"
          textShadow="0 0 11px rgba(255,255,255,0.5), 0 0 25px rgba(255,255,255,0.25)"
          maxW={{ base: "100%", md: "70%" }}
          mt={{ base: 2, md: 3 }}
          opacity={headerReveal.visible ? 1 : 0}
          transform={headerReveal.visible ? "translateY(0)" : "translateY(14px)"}
          transition="opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s"
        >
          Ocho disciplinas, un orden. De la autocompasión a la ciencia, con el amor propio como consecuencia.
        </Text>
      </Flex>

      {/* ── SEPARADOR + TÍTULO DISCIPLINAS ── */}
      <Flex
        ref={disciplinasTitleReveal.ref}
        direction="column"
        align="center"
        pt={{ base: 14, md: 21 }}
        gap={{ base: 6, md: 8 }}
      >
        <Box
          w="100%"
          maxW="500px"
          h="1px"
          bg="rgba(255,255,255,0.15)"
          opacity={disciplinasTitleReveal.visible ? 1 : 0}
          transform={disciplinasTitleReveal.visible ? "scaleX(1)" : "scaleX(0.2)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        />
        <Text
          color="rgba(255,255,255,0.85)"
          fontFamily="'EB Garamond', serif"
          fontStyle="italic"
          fontWeight="400"
          fontSize={{ base: "lg", md: "2xl" }}
          letterSpacing="0.12em"
          textShadow="0 0 10px rgba(255,255,255,0.45), 0 0 22px rgba(255,255,255,0.22)"
          textAlign="center"
          px={{ base: 5, md: 10 }}
          opacity={disciplinasTitleReveal.visible ? 1 : 0}
          transform={disciplinasTitleReveal.visible ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s"
        >
          Las 8 disciplinas en orden…
        </Text>
      </Flex>

      {/* ── CARDS DE MODALIDADES ── */}
      <Box
        ref={cardsReveal.ref}
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 12, md: 16 }}
        pb={{ base: 6, md: 10 }}
      >
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={{ base: 4, md: 18 }}
        >
          {modalidades.map((m, i) => (
            <MetodoCard
              key={m.name}
              data={m}
              delay={i * 0.1}
              parentVisible={cardsReveal.visible}
              index={i + 1}
              onClick={() => setSelectedCard(m)}
            />
          ))}
        </Grid>
      </Box>

      {/* ── SEPARADOR ANTES DE INFORMACIÓN ── */}
      <Flex mb="10px" justify="center" pt={{ base: 14, md: 21 }}>
        <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.15)" />
      </Flex>

      {/* ── INFORMACIÓN Y PRECIO (sin caja) ── */}
      <Flex
        ref={pricingReveal.ref}
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 14, md: 21 }}
        gap={{ base: 8, md: 10 }}
      >
        <Text
          color="white"
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="700"
          letterSpacing="0.06em"
          textShadow="0 0 14px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.4), 0 0 54px rgba(180,255,245,0.35)"
          opacity={pricingReveal.visible ? 1 : 0}
          transform={pricingReveal.visible ? "translateY(0)" : "translateY(22px)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >
          ¿Cómo funciona?
        </Text>

        {/* Info sesiones */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 10, md: 16 }}
          justify="center"
          align={{ base: "center", md: "flex-start" }}
          w="100%" mb={{ base: "5px", md: "10px" }}
          maxW="900px"
          opacity={pricingReveal.visible ? 1 : 0}
          transform={pricingReveal.visible ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s"
        >
          <Box textAlign="center" flex="1">
            <Text
              color="rgba(255,255,255,0.75)"
              fontSize="sm"
              letterSpacing="0.18em"
              textTransform="uppercase"
              mb={2}
              textShadow="0 0 8px rgba(255,255,255,0.4)"
            >
              Por disciplina
            </Text>
            <Text
              color="white"
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="700"
              textShadow="0 0 14px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.4)"
            >
              20 €
            </Text>
            <Text color="rgba(255,255,255,0.8)" fontSize={{ base: "md", md: "lg" }} mt={2} lineHeight="1.6" textShadow="0 0 8px rgba(255,255,255,0.3)">
              acceso a los cursos y materiales de esa disciplina
            </Text>
            <Text color="rgba(255,255,255,0.6)" fontSize="sm" mt={2} fontStyle="italic" lineHeight="1.55" maxW="320px" mx="auto">
              cada pago se realiza por separado: al terminar una disciplina, abonas la siguiente
            </Text>
          </Box>

          <Box
            display={{ base: "none", md: "block" }}
            w="1px"
            bg="rgba(255,255,255,0.25)"
            alignSelf="stretch"
            boxShadow="0 0 8px rgba(255,255,255,0.4)"
          />

          <Box textAlign="center" flex="1">
            <Text
              color="rgba(255,255,255,0.75)"
              fontSize="sm"
              letterSpacing="0.18em"
              textTransform="uppercase"
              mb={2}
              textShadow="0 0 8px rgba(255,255,255,0.4)"
            >
              Consultas individuales
            </Text>
            <Text
              color="white"
              fontSize={{ base: "4xl", md: "5xl" }}
              fontWeight="700"
              textShadow="0 0 14px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.4)"
            >
              15 € <Box as="span" fontSize={{ base: "xl", md: "2xl" }} fontWeight="500" opacity={0.85}>/ sesión</Box>
            </Text>
            <Text color="rgba(255,255,255,0.8)" fontSize={{ base: "md", md: "lg" }} mt={2} lineHeight="1.6" textShadow="0 0 8px rgba(255,255,255,0.3)">
              1 hora de duración, se pagan aparte
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* ── SEPARADOR ── */}
      <Flex mb={{ base: "0px", md: "10px" }} justify="center" pt={{ base: 14, md: 21 }}>
        <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.15)" />
      </Flex>

      {/* ── 3 CAJITAS (Comunidad / Acompañamiento / Precio) ── */}
      <Flex
        ref={comunidadReveal.ref}
        direction="column"
        align="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 14, md: 21 }}
        gap={{ base: 8, md: 10 }}
      >
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "50px", md: "64px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.7)) drop-shadow(0 0 22px rgba(255,255,255,0.35))" }}
          opacity={comunidadReveal.visible ? 1 : 0}
          transform={comunidadReveal.visible ? "scale(1)" : "scale(0.8)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        />

        <Grid
          w={{ base: "100%", md: "90%" }}
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={{ base: 6, md: 8 }}
        >
          {[
            {
              titulo: "Comunidad",
              valor: "Acceso a grupo de WhatsApp",
              delay: 0.2,
              icon: (
                <>
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </>
              ),
            },
            {
              titulo: "Acompañamiento",
              valor: "Vídeo diario de la creadora",
              delay: 0.4,
              icon: (
                <>
                  <polygon points="6 4 20 12 6 20 6 4" />
                </>
              ),
            },
            {
              titulo: "Precio económico",
              valor: "El conocimiento es un derecho",
              delay: 0.6,
              icon: (
                <>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </>
              ),
            },
          ].map((c) => (
            <Box
              key={c.titulo}
              bg="transparent"
              borderRadius="xl"
              px={{ base: 4, md: 4 }}
              py={{ base: 5, md: 6 }}
              textAlign="center"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={{ base: 2.5, md: 3 }}
              opacity={comunidadReveal.visible ? 1 : 0}
              transform={comunidadReveal.visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)"}
              transition={`opacity 0.7s ease ${c.delay}s, transform 0.7s ease ${c.delay}s`}
            >
              {/* Icono */}
              <Box
                w={{ base: "38px", md: "42px" }}
                h={{ base: "38px", md: "42px" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  as="svg"
                  viewBox="0 0 24 24"
                  w={{ base: "18px", md: "20px" }}
                  h={{ base: "18px", md: "20px" }}
                  fill="none"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))" }}
                >
                  {c.icon}
                </Box>
              </Box>

              {/* Título */}
              <Text
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="0.14em"
                textTransform="uppercase"
                textShadow="0 0 8px rgba(255,255,255,0.5), 0 0 18px rgba(255,255,255,0.25)"
              >
                {c.titulo}
              </Text>

              {/* Valor */}
              <Text
                color="rgba(255,255,255,0.85)"
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "xs", md: "sm" }}
                lineHeight="1.55"
                letterSpacing="0.01em"
              >
                {c.valor}
              </Text>
            </Box>
          ))}
        </Grid>
      </Flex>

      {/* ── Conocer a la creadora ── */}
      <Flex
        justify="center"
        align="center"
        gap={{ base: 2, md: 3 }}
        pt={{ base: 10, md: 12 }}
        pb={{ base: 4, md: 6 }}
        px={{ base: 5, md: 10, lg: 16 }}
      >
        <Box
          h="1px"
          w={{ base: "24px", md: "44px" }}
          bg="linear-gradient(to right, transparent, rgba(255,255,255,0.6))"
          boxShadow="0 0 6px rgba(255,255,255,0.4)"
        />
        <Flex
          as="button"
          onClick={() => navigate("/quienSoy")}
          align="center"
          gap={2}
          color="white"
          fontFamily="'EB Garamond', serif"
          fontWeight="600"
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="0.16em"
          textTransform="uppercase"
          px={{ base: 5, md: 7 }}
          py={{ base: "7px", md: "9px" }}
          borderRadius="full"
          border="1px solid rgba(255,255,255,0.5)"
          bg="rgba(255,255,255,0.06)"
          cursor="pointer"
          boxShadow="0 0 12px rgba(255,255,255,0.28), 0 0 26px rgba(255,255,255,0.14), 0 2px 10px rgba(0,0,0,0.15)"
          textShadow="0 0 8px rgba(255,255,255,0.5), 0 0 18px rgba(255,255,255,0.28)"
          _hover={{
            bg: "rgba(255,255,255,0.16)",
            borderColor: "rgba(255,255,255,0.85)",
            boxShadow: "0 0 20px rgba(255,255,255,0.45), 0 0 42px rgba(180,255,245,0.28), 0 4px 14px rgba(0,0,0,0.2)",
            transform: "translateY(-1px)",
          }}
          transition="all 0.25s ease"
        >
          Conocer a la creadora
          <Box as="span" fontSize={{ base: "sm", md: "md" }} style={{ textShadow: "0 0 8px rgba(255,255,255,0.6), 0 0 18px rgba(255,255,255,0.3)" }}>
            →
          </Box>
        </Flex>
        <Box
          h="1px"
          w={{ base: "24px", md: "44px" }}
          bg="linear-gradient(to left, transparent, rgba(255,255,255,0.6))"
          boxShadow="0 0 6px rgba(255,255,255,0.4)"
        />
      </Flex>

      {/* ── SEPARADOR ── */}
      <Flex justify="center" mb={{ base: "25px", md: "35px" }} pt={{ base: 14, md: 21 }}>
        <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.15)" />
      </Flex>

      {/* ── BOTÓN EMPEZAR + TENGO DUDAS ── */}
      <Flex
        ref={botonesReveal.ref}
        direction="column"
        align="center"
        pt={{ base: 14, md: 21 }}
        pb={{ base: 24, md: 32 }}
        gap={{ base: 12, md: 16 }}
        opacity={botonesReveal.visible ? 1 : 0}
        transform={botonesReveal.visible ? "translateY(0)" : "translateY(28px)"}
        transition="opacity 0.8s ease, transform 0.8s ease"
      >
        {/* EMPEZAR (botón grande con mandala) */}
        <Flex
          as="button"
          onClick={handleApuntarme}
          align="center"
          justify="center"
          gap={{ base: 3, md: 6 }}
          px={{ base: 8, md: 24 }}
          py={{ base: "18px", md: "22px" }}
          minW={{ base: "240px", md: "520px" }}
          flexShrink={0}
          borderRadius="full"
          border="1.5px solid rgba(255,255,255,0.65)"
          bg="rgba(255,255,255,0.10)"
          cursor="pointer"
          boxShadow="0 0 22px rgba(255,255,255,0.4), 0 0 50px rgba(255,255,255,0.22), 0 0 90px rgba(180,255,245,0.25), 0 6px 20px rgba(0,0,0,0.2)"
          _hover={{
            bg: "rgba(255,255,255,0.2)",
            borderColor: "white",
            boxShadow: "0 0 34px rgba(255,255,255,0.6), 0 0 70px rgba(180,255,245,0.45), 0 8px 24px rgba(0,0,0,0.25)",
          }}
          transition="background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
        >
          <Image
            src="/img/icono/life.png"
            alt=""
            h={{ base: "34px", md: "44px" }}
            objectFit="contain"
            flexShrink={0}
            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.75)) drop-shadow(0 0 24px rgba(255,255,255,0.4))" }}
          />
          <Text
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "lg", md: "3xl" }}
            letterSpacing={{ base: "0.14em", md: "0.22em" }}
            textTransform="uppercase"
            textShadow="0 0 14px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(180,255,245,0.3)"
            whiteSpace="nowrap"
          >
            Empezar
          </Text>
        </Flex>

        {/* Agendar llamada + Tengo dudas (botones secundarios) */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="center"
          gap={{ base: 4, md: 6 }}
        >
          {/* Agendar llamada gratuita */}
          <Flex
            as="button"
            onClick={() => setBookCallOpen(true)}
            align="center"
            justify="center"
            gap={2}
            px={{ base: 5, md: 7 }}
            py={{ base: "7px", md: "9px" }}
            borderRadius="full"
            border="1px solid rgba(255,255,255,0.5)"
            bg="rgba(255,255,255,0.06)"
            cursor="pointer"
            boxShadow="0 0 12px rgba(255,255,255,0.25), 0 0 26px rgba(255,255,255,0.12)"
            _hover={{
              bg: "rgba(255,255,255,0.16)",
              borderColor: "rgba(255,255,255,0.85)",
              boxShadow: "0 0 20px rgba(255,255,255,0.45), 0 0 42px rgba(180,255,245,0.25)",
            }}
            transition="all 0.25s ease"
          >
            <Box
              as="svg"
              viewBox="0 0 24 24"
              w={{ base: "14px", md: "16px" }}
              h={{ base: "14px", md: "16px" }}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              flexShrink={0}
              style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))" }}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </Box>
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="500"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.04em"
              fontStyle="italic"
              textShadow="0 0 8px rgba(255,255,255,0.45), 0 0 18px rgba(255,255,255,0.22)"
            >
              Agendar llamada gratuita (20 min)
            </Text>
          </Flex>

          {/* Tengo dudas (botón pequeño secundario) */}
          <Flex
            as="button"
            onClick={() => setDudasOpen(true)}
            align="center"
            justify="center"
            gap={2}
            px={{ base: 5, md: 7 }}
            py={{ base: "7px", md: "9px" }}
            borderRadius="full"
            border="1px solid rgba(255,255,255,0.5)"
            bg="rgba(255,255,255,0.06)"
            cursor="pointer"
            boxShadow="0 0 12px rgba(255,255,255,0.25), 0 0 26px rgba(255,255,255,0.12)"
            _hover={{
              bg: "rgba(255,255,255,0.16)",
              borderColor: "rgba(255,255,255,0.85)",
              boxShadow: "0 0 20px rgba(255,255,255,0.45), 0 0 42px rgba(180,255,245,0.25)",
            }}
            transition="all 0.25s ease"
          >
            <Box
              as="svg"
              viewBox="0 0 24 24"
              w={{ base: "14px", md: "16px" }}
              h={{ base: "14px", md: "16px" }}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              flexShrink={0}
              style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))" }}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </Box>
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="500"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.04em"
              fontStyle="italic"
              textShadow="0 0 8px rgba(255,255,255,0.45), 0 0 18px rgba(255,255,255,0.22)"
            >
              Tengo dudas
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* ── MODAL MODALIDAD ── */}
      {selectedCard && (
        <Box
          position="fixed"
          inset={0}
          zIndex={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0,0,0,0.6)"
          sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          onClick={() => setSelectedCard(null)}
          px={{ base: 5, md: 10 }}
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            bg={selectedCard.bg + "f0"}
            border={`1.5px solid ${selectedCard.txt}66`}
            sx={{ backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)" }}
            borderRadius="3xl"
            boxShadow={`0 12px 60px rgba(0,0,0,0.55), 0 0 0 1px ${selectedCard.txt}33, 0 0 80px ${selectedCard.txt}22`}
            p={{ base: 7, md: 14 }}
            maxW={{ base: "100%", md: "880px" }}
            w="100%"
            maxH={{ base: "92vh", md: "92vh" }}
            overflowY="auto"
            display="flex"
            flexDirection="column"
            gap={{ base: 6, md: 8 }}
            position="relative"
          >
            {/* X */}
            <Box
              position="absolute"
              top={5}
              right={5}
              as="button"
              onClick={() => setSelectedCard(null)}
              color={selectedCard.txt}
              fontSize="lg"
              cursor="pointer"
              bg={selectedCard.txt + "22"}
              borderRadius="full"
              w="40px"
              h="40px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{ bg: selectedCard.txt + "44" }}
              transition="background 0.2s"
              zIndex={2}
            >
              ✕
            </Box>

            {/* HERO ── icono + título + descripción ── */}
            <Flex direction="column" align="center" gap={{ base: 4, md: 6 }} pt={{ base: 2, md: 4 }}>
              <Box position="relative" display="flex" alignItems="center" justifyContent="center">
                <Box
                  position="absolute"
                  w={{ base: "160px", md: "200px" }}
                  h={{ base: "160px", md: "200px" }}
                  borderRadius="full"
                  bg={`radial-gradient(circle, ${selectedCard.txt}33 0%, ${selectedCard.txt}00 70%)`}
                />
                <Box
                  bg={selectedCard.bg}
                  borderRadius="full"
                  w={{ base: "108px", md: "128px" }}
                  h={{ base: "108px", md: "128px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border={`3px solid ${selectedCard.txt}`}
                  boxShadow={`0 0 28px ${selectedCard.txt}cc, 0 4px 20px ${selectedCard.txt}77`}
                  position="relative"
                >
                  {selectedCard.renderIcon("64px")}
                </Box>
              </Box>

              <Text
                color={selectedCard.txt}
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="700"
                letterSpacing="0.05em"
                textAlign="center"
                lineHeight="1.1"
                filter={`drop-shadow(0 2px 14px ${selectedCard.txt}55)`}
              >
                {selectedCard.name}
              </Text>

              <Box
                w="80px"
                h="2px"
                bgGradient={`linear(to-r, transparent, ${selectedCard.txt}, transparent)`}
                opacity={0.7}
              />

              <Text
                color={selectedCard.txt}
                fontSize={{ base: "lg", md: "2xl" }}
                fontStyle="italic"
                textAlign="center"
                lineHeight="1.7"
                letterSpacing="0.02em"
                opacity={0.95}
                maxW="640px"
              >
                {selectedCard.desc}
              </Text>
            </Flex>

            {/* Separador antes del contenido */}
            <Flex align="center" gap={4} mt={{ base: 2, md: 4 }}>
              <Box flex="1" h="1px" bgGradient={`linear(to-r, transparent, ${selectedCard.txt}55)`} />
              <Text
                color={selectedCard.txt}
                opacity={0.7}
                fontSize="xs"
                letterSpacing="0.32em"
                textTransform="uppercase"
                fontWeight="600"
              >
                Qué incluye
              </Text>
              <Box flex="1" h="1px" bgGradient={`linear(to-l, transparent, ${selectedCard.txt}55)`} />
            </Flex>

            {/* SECCIONES DE CONTENIDO — sin boxes, separadas por líneas horizontales */}
            <Flex direction="column">
              {selectedCard.contenido.map((seccion, i) => (
                <Flex
                  key={i}
                  direction="column"
                  py={{ base: 5, md: 6 }}
                  gap={{ base: 3, md: 4 }}
                  cursor="default"
                  userSelect="text"
                  borderTop={i === 0 ? "none" : `1px solid ${selectedCard.txt}33`}
                >
                  {/* Título de sección */}
                  <Text
                    color={selectedCard.txt}
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="700"
                    letterSpacing="0.04em"
                    lineHeight="1.25"
                    textAlign="center"
                  >
                    {seccion.titulo}
                  </Text>

                  {/* Items */}
                  <Flex direction="column" gap={{ base: 2, md: 2.5 }} flex="1">
                    {seccion.items.map((item, j) => (
                      <Text
                        key={j}
                        color={selectedCard.txt}
                        opacity={0.88}
                        fontSize={{ base: "sm", md: "md" }}
                        lineHeight={{ base: "1.6", md: "1.7" }}
                        letterSpacing="0.01em"
                        textAlign="center"
                      >
                        {item}
                      </Text>
                    ))}
                  </Flex>

                  {/* Aviso (p.ej. "Se cobra aparte") */}
                  {seccion.aviso && (
                    <Flex
                      align="center"
                      justify="center"
                      gap={{ base: 1.5, md: 2 }}
                      mt={1}
                    >
                      <Box
                        as="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        w={{ base: "12px", md: "14px" }}
                        h={{ base: "12px", md: "14px" }}
                        fill={selectedCard.txt}
                        opacity={0.85}
                        flexShrink={0}
                      >
                        <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
                      </Box>
                      <Text
                        color={selectedCard.txt}
                        fontSize={{ base: "2xs", md: "xs" }}
                        letterSpacing="0.06em"
                        fontStyle="italic"
                        opacity={0.85}
                        lineHeight="1.3"
                      >
                        {seccion.aviso}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              ))}
            </Flex>
          </Box>
        </Box>
      )}

      <ContactModal
        isOpen={dudasOpen}
        onClose={() => setDudasOpen(false)}
        title="Tengo dudas"
        bgColor="#008080"
        color="#ffffff"
        emailSubject="Consulta — Life as a Privilege"
        showCheckboxes={false}
        showDescription={true}
        textareaPlaceholder="Escribe aquí tu consulta..."
      />

      <BookCallModal
        isOpen={bookCallOpen}
        onClose={() => setBookCallOpen(false)}
      />

      <SiteFooter />
    </Box>
  );
}
