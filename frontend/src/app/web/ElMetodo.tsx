import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { ContactModal } from "../../components/global/ContactModal";
import { BookCallModal } from "../../components/global/BookCallModal";
import { WaitlistModal } from "../../components/global/WaitlistModal";
import { recorridoContenido, type ContenidoSeccion } from "../../data/recorridoContenido";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import MandalaRecorrido from "../../components/global/MandalaRecorrido";
import {
  BookOpen,
  Users,
  MessageCircle,
} from "lucide-react";
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

// ── "Qué recibirás" — valor del recorrido ──
type Beneficio = {
  icon: React.ComponentType<{ size?: number | string; strokeWidth?: number }>;
  title: string;
  text: string;
};

const beneficios: Beneficio[] = [
  {
    icon: Users,
    title: "Comunidad",
    text: "Comparte dudas, descubrimientos y experiencias con otras personas del recorrido.",
  },
  {
    icon: BookOpen,
    title: "Material complementario",
    text: "Libros, PDFs, investigaciones y recursos para profundizar más allá de las clases.",
  },
  {
    icon: MessageCircle,
    title: "Sesiones individuales",
    text: "Posibilidad de reservar consultas privadas para profundizar en tu caso concreto.",
  },
];

// ── Sombras de texto del recorrido ──
// La mayoría de disciplinas usan una "luz" suave basada en su color (natural).
// Algunas concretas piden una sombra oscura para que el texto contraste mejor.
const SHADOW_BLACK = "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.75), 0 0 5px rgba(0,0,0,0.7), 0 0 18px rgba(255,255,255,0.19)";
const SHADOW_GRANATE = "0 1px 4px rgba(56,8,8,0.95), 0 2px 12px rgba(56,8,8,0.82), 0 0 5px rgba(56,8,8,0.78), 0 0 18px rgba(255,255,255,0.17)";

const naturalBoxShadow = (bg: string) =>
  `0 1px 3px ${bg}f5, 0 0 6px ${bg}cc, 0 2px 14px ${bg}88, 0 0 10px rgba(255,255,255,0.45), 0 0 22px rgba(255,255,255,0.22)`;

const esOscuraNegra = (name: string) =>
  name === fisiologiaNom || name === cabalaNom || name === culturaNom;

// Sombra para los textos DENTRO de las cajas (ítems y aviso).
const boxTextShadow = (card: ModalidadData) => {
  if (card.name === tcmNom) return SHADOW_GRANATE;
  if (esOscuraNegra(card.name)) return SHADOW_BLACK;
  return naturalBoxShadow(card.bg);
};

// Igual, pero para el título de cada sección (en el original, las disciplinas
// sin fondo propio no llevaban sombra).
const boxTitleShadow = (card: ModalidadData) => {
  if (card.name === tcmNom) return SHADOW_GRANATE;
  if (esOscuraNegra(card.name)) return SHADOW_BLACK;
  return hasDisciplinaBg(card.name) ? naturalBoxShadow(card.bg) : undefined;
};

// Cabecera del modal: nombre de la disciplina y frase introductoria. Solo
// Cábala y Cultura llevan sombra oscura aquí.
const headerNameShadow = (card: ModalidadData) =>
  card.name === tcmNom
    ? SHADOW_GRANATE
    : esOscuraNegra(card.name)
    ? SHADOW_BLACK
    : `0 1px 3px ${card.bg}f5, 0 0 8px ${card.bg}cc, 0 2px 16px ${card.bg}88, 0 0 16px rgba(255,255,255,0.41), 0 0 36px rgba(255,255,255,0.22)`;

const headerDescShadow = (card: ModalidadData) =>
  card.name === tcmNom
    ? SHADOW_GRANATE
    : esOscuraNegra(card.name)
    ? SHADOW_BLACK
    : `0 1px 3px ${card.bg}f5, 0 0 8px ${card.bg}cc, 0 2px 16px ${card.bg}88, 0 0 12px rgba(255,255,255,0.38), 0 0 26px rgba(255,255,255,0.19)`;

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
  const hasBg = hasDisciplinaBg(data.name);
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? true;
  const displayName = data.name === "Medicina China" && isMobile ? "Med. China" : data.name;
  return (
    <Box
      role="group"
      position="relative"
      mt="42px"
      mb={{ base: 3, md: 5 }}
      pt="46px"
      pb={{ base: 5, md: 7 }}
      px={{ base: 3, md: 5 }}
      bg={hasBg ? "transparent" : data.bg}
      borderRadius="2xl"
      opacity={parentVisible ? 1 : 0}
      transform={parentVisible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.93)"}
      transition={`opacity 0.65s ease ${delay}s, transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease`}
      cursor="pointer"
      onClick={onClick}
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: `0 12px 32px rgba(0,0,0,0.28), 0 0 30px ${data.txt}55`,
        filter: "brightness(1.06)",
      }}
    >
      {/* Fondo propio de la disciplina — capa absoluta clipeada al borderRadius
          del card, para no recortar el icono que sobresale arriba (top:-36px). */}
      {hasBg && <DisciplinaBgLayer nom={data.name} borderRadius="2xl" />}

      {/* Icono flotante */}
      <Box
        position="absolute"
        top="-36px"
        left="50%"
        transform="translateX(-50%)"
        bg={hasBg ? "transparent" : data.bg}
        borderRadius="full"
        p="8px"
        border={`4px solid ${data.txt}`}
        boxShadow={`0 0 20px ${data.txt}bb, 0 2px 14px ${data.txt}77`}
        w="72px"
        h="72px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={2}
        overflow={hasBg ? "hidden" : undefined}
      >
        {hasBg && <DisciplinaBgLayer nom={data.name} borderRadius="full" />}
        <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
          {data.renderIcon("42px")}
        </Box>
      </Box>

      {/* Número + título */}
      <Flex mb="10px" align="baseline" justify="center" gap={2} position="relative" zIndex={1}>
        <Text
          color={data.txt}
          fontWeight="700"
          fontSize={{ base: "xl", md: "3xl", lg: "4xl" }}
          letterSpacing="0.03em"
          lineHeight="short"
          textShadow={hasBg
            ? `0 1px 3px ${data.bg}f5, 0 0 6px ${data.bg}cc, 0 2px 14px ${data.bg}88`
            : undefined}
        >
          {index}.
        </Text>
        <Text
          color={data.txt}
          fontWeight="700"
          fontSize={{ base: "xl", md: "3xl", lg: "4xl" }}
          letterSpacing="0.03em"
          lineHeight="short"
          textShadow={hasBg
            ? `0 1px 3px ${data.bg}f5, 0 0 6px ${data.bg}cc, 0 2px 14px ${data.bg}88`
            : undefined}
        >
          {displayName}
        </Text>
      </Flex>

      {/* Flecha dinámica — invita a abrir la disciplina. Va en posición
          absoluta dentro del espacio inferior que ya existe, así NO cambia
          la altura de la tarjeta. Rebota de forma continua (dinámica) y se
          enciende al pasar el ratón por la tarjeta. */}
      <Box
        position="absolute"
        bottom={{ base: "8px", md: "12px" }}
        right={{ base: "12px", md: "16px" }}
        zIndex={1}
        color={data.txt}
        fontSize={{ base: "lg", md: "2xl" }}
        lineHeight="1"
        opacity={0.55}
        pointerEvents="none"
        textShadow={hasBg
          ? `0 1px 3px ${data.bg}f5, 0 0 6px ${data.bg}cc, 0 2px 14px ${data.bg}88`
          : `0 0 10px ${data.txt}66`}
        transition="opacity 0.3s ease"
        _groupHover={{ opacity: 1 }}
        sx={{
          "@keyframes metodoArrowBounce": {
            "0%, 100%": { transform: "translateX(0)" },
            "50%": { transform: "translateX(5px)" },
          },
          animation: "metodoArrowBounce 1.8s ease-in-out infinite",
        }}
      >
        →
      </Box>
    </Box>
  );
}

export default function ElMetodo() {
  const headerReveal = useReveal(0.05);
  const disciplinasTitleReveal = useReveal(0.15);
  const cardsReveal = useReveal(0.04);
  const recibirasTitleReveal = useReveal(0.2);
  const recibirasGridReveal = useReveal(0.05);
  const creadoraReveal = useReveal(0.12);
  const botonesReveal = useReveal(0.1);
  const [dudasOpen, setDudasOpen] = useState(false);
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ModalidadData | null>(null);
  const [mounted, setMounted] = useState(false);

  // El recorrido aún no está acabado: en vez de mandar al registro/flujo
  // incompleto, abrimos el modal de "lista de espera" y guardamos el email.
  const handleApuntarme = () => {
    setWaitlistOpen(true);
  };

  // Flujo original (cuando el recorrido esté disponible):
  // const handleApuntarme = () => {
  //   const userId = sessionStorage.getItem("userId");
  //   const token = sessionStorage.getItem("token");
  //   if (!userId || !token) {
  //     navigate("/signIn?next=/home");
  //     return;
  //   }
  //   navigate("/home");
  // };

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
          style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.59)) drop-shadow(0 0 23px rgba(255,255,255,0.32)) drop-shadow(0 0 47px rgba(180,255,245,0.24))" }}
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
          textShadow="0 0 16px rgba(255,255,255,0.64), 0 0 34px rgba(255,255,255,0.41), 0 0 63px rgba(180,255,245,0.34)"
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
          textShadow="0 0 9px rgba(255,255,255,0.41), 0 0 20px rgba(255,255,255,0.22)"
          opacity={headerReveal.visible ? 1 : 0}
          transform={headerReveal.visible ? "translateY(0)" : "translateY(14px)"}
          transition="opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s"
        >
          de Life as a Privilege
        </Text>
        <Text
          color="white"
          fontSize={{ base: "sm", md: "lg" }}
          fontWeight="700"
          fontStyle="italic"
          lineHeight="1.95"
          letterSpacing="0.015em"
          textShadow="0 0 11px rgba(255,255,255,0.38), 0 0 25px rgba(255,255,255,0.19)"
          maxW={{ base: "100%", md: "70%" }}
          mt={{ base: 2, md: 3 }}
          opacity={headerReveal.visible ? 1 : 0}
          transform={headerReveal.visible ? "translateY(0)" : "translateY(14px)"}
          transition="opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s"
        >
          Ocho disciplinas. Un orden. Un propósito: entenderte.
        </Text>

        <Text
          color="white"
          fontSize={{ base: "sm", md: "lg" }}
          lineHeight="1.95"
          letterSpacing="0.015em"
          textShadow="0 0 11px rgba(255,255,255,0.38), 0 0 25px rgba(255,255,255,0.19)"
          maxW={{ base: "100%", md: "70%" }}
          mt={{ base: 2, md: 3 }}
          opacity={headerReveal.visible ? 1 : 0}
          transform={headerReveal.visible ? "translateY(0)" : "translateY(14px)"}
          transition="opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s"
        >
          No son ocho cursos independientes. Es una única exploración de ti mismo desde ocho perspectivas diferentes pero complementarias. Cada disciplina aporta una pieza distinta hasta formar una comprensión más profunda y coherente de quién eres.
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
          color="rgba(255,255,255,0.9)"
          fontSize={{ base: "sm", md: "lg" }}
          fontStyle="italic"
          textAlign="center"
          letterSpacing="0.02em"
          lineHeight="1.6"
          maxW={{ base: "100%", md: "640px" }}
          textShadow="0 0 10px rgba(255,255,255,0.32), 0 0 22px rgba(255,255,255,0.16)"
          opacity={disciplinasTitleReveal.visible ? 1 : 0}
          transform={disciplinasTitleReveal.visible ? "translateY(0)" : "translateY(10px)"}
          transition="opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s"
        >
          Cada disciplina observa una parte distinta del ser humano. Haz clic para explorarlas.
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

      {/* ── QUÉ RECIBIRÁS ── */}
      <Box w="100%" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 4, md: 6 }}>
        <Box maxW="1200px" mx="auto">
          {/* Separador con mandala en medio y líneas degradadas a los lados */}
          <Flex
            ref={recibirasTitleReveal.ref}
            align="center"
            justify="center"
            gap={{ base: 4, md: 6 }}
            mb={{ base: 10, md: 14 }}
            opacity={recibirasTitleReveal.visible ? 1 : 0}
            transform={recibirasTitleReveal.visible ? "scaleX(1)" : "scaleX(0.85)"}
            transition="opacity 0.8s ease, transform 0.8s ease"
          >
            <Box
              h="1px"
              w={{ base: "60px", md: "150px" }}
              bg="linear-gradient(to right, transparent, rgba(255,255,255,0.55))"
            />
            <Image
              src="/img/icono/life.png"
              alt=""
              h={{ base: "26px", md: "34px" }}
              objectFit="contain"
              flexShrink={0}
              style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.45)) drop-shadow(0 0 18px rgba(255,255,255,0.22))" }}
            />
            <Box
              h="1px"
              w={{ base: "60px", md: "150px" }}
              bg="linear-gradient(to left, transparent, rgba(255,255,255,0.55))"
            />
          </Flex>

          {/* Título + subtítulo */}
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            gap={{ base: 4, md: 5 }}
          >
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "3xl", md: "5xl" }}
              letterSpacing="0.04em"
              lineHeight="1.2"
              textShadow="0 0 12px rgba(255,255,255,0.4), 0 0 26px rgba(180,255,245,0.18)"
              opacity={recibirasTitleReveal.visible ? 1 : 0}
              transform={recibirasTitleReveal.visible ? "translateY(0)" : "translateY(20px)"}
              transition="opacity 0.8s ease, transform 0.8s ease"
            >
              Así es El Recorrido por dentro
            </Text>
            <Text
              color="rgba(255,255,255,0.88)"
              fontFamily="'EB Garamond', serif"
              fontWeight="400"
              fontSize={{ base: "md", md: "xl" }}
              lineHeight="1.7"
              letterSpacing="0.02em"
              maxW={{ base: "100%", md: "640px" }}
              textShadow="0 0 8px rgba(255,255,255,0.22)"
              opacity={recibirasTitleReveal.visible ? 1 : 0}
              transform={recibirasTitleReveal.visible ? "translateY(0)" : "translateY(20px)"}
              transition="opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s"
            >
              Todo lo necesario para comprenderte desde cada disciplina. Haz click.
            </Text>
          </Flex>

          {/* Mandala interactivo */}
          <Box mt={{ base: 2, md: 4 }}>
            <MandalaRecorrido />
          </Box>

          {/* ── LA CREADORA ── */}
          {/* Separador con mandala en medio (mismo estilo y separación que el
              de "Así es El Recorrido por dentro", para mantener coherencia). */}
          <Flex
            align="center"
            justify="center"
            gap={{ base: 4, md: 6 }}
            mt={{ base: 10, md: 14 }}
            mb={{ base: 10, md: 14 }}
            opacity={creadoraReveal.visible ? 1 : 0}
            transform={creadoraReveal.visible ? "scaleX(1)" : "scaleX(0.85)"}
            transition="opacity 0.8s ease, transform 0.8s ease"
          >
            <Box
              h="1px"
              w={{ base: "60px", md: "150px" }}
              bg="linear-gradient(to right, transparent, rgba(255,255,255,0.55))"
            />
            <Image
              src="/img/icono/life.png"
              alt=""
              h={{ base: "26px", md: "34px" }}
              objectFit="contain"
              flexShrink={0}
              style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.45)) drop-shadow(0 0 18px rgba(255,255,255,0.22))" }}
            />
            <Box
              h="1px"
              w={{ base: "60px", md: "150px" }}
              bg="linear-gradient(to left, transparent, rgba(255,255,255,0.55))"
            />
          </Flex>

          <Flex
            ref={creadoraReveal.ref}
            direction="column"
            align="center"
            textAlign="center"
            gap={{ base: 5, md: 7 }}
          >
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "3xl", md: "5xl" }}
              letterSpacing="0.04em"
              lineHeight="1.2"
              textShadow="0 0 12px rgba(255,255,255,0.4), 0 0 26px rgba(180,255,245,0.18)"
              opacity={creadoraReveal.visible ? 1 : 0}
              transform={creadoraReveal.visible ? "translateY(0)" : "translateY(20px)"}
              transition="opacity 0.8s ease, transform 0.8s ease"
            >
              La creadora: María Escribano
            </Text>

            {/* Foto */}
            <Box
              maxW={{ base: "234px", md: "306px" }}
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="0 18px 45px rgba(0,0,0,0.35), 0 0 27px rgba(255,255,255,0.25), 0 0 54px rgba(180,255,245,0.2)"
              opacity={creadoraReveal.visible ? 1 : 0}
              transform={creadoraReveal.visible ? "scale(1)" : "scale(0.85)"}
              transition="opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s"
            >
              <Image
                src="/img/me/me.png"
                alt="María Escribano"
                w="100%"
                h="auto"
                display="block"
              />
            </Box>

            {/* Bio */}
            <Text
              color="rgba(255,255,255,0.92)"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "sm", md: "lg" }}
              lineHeight="1.9"
              letterSpacing="0.02em"
              textShadow="0 0 10px rgba(255,255,255,0.34), 0 0 22px rgba(255,255,255,0.17)"
              maxW={{ base: "100%", md: "70%" }}
              opacity={creadoraReveal.visible ? 1 : 0}
              transform={creadoraReveal.visible ? "translateY(0)" : "translateY(24px)"}
              transition="opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s"
            >
              Ingeniera informática, 22 años. No existía lo que he construido: un recorrido donde la psicología, la biología y los conocimientos tradicionales se combinan en vez de pelearse. Ahora son aliados.
            </Text>
          </Flex>

          {/* ── Separador con mandala en medio ── */}
          <Flex
            align="center"
            justify="center"
            gap={{ base: 4, md: 6 }}
            mt={{ base: 16, md: 24 }}
            mb={{ base: 10, md: 14 }}
          >
            <Box
              h="1px"
              w={{ base: "60px", md: "150px" }}
              bg="linear-gradient(to right, transparent, rgba(255,255,255,0.55))"
            />
            <Image
              src="/img/icono/life.png"
              alt=""
              h={{ base: "26px", md: "34px" }}
              objectFit="contain"
              flexShrink={0}
              style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.45)) drop-shadow(0 0 18px rgba(255,255,255,0.22))" }}
            />
            <Box
              h="1px"
              w={{ base: "60px", md: "150px" }}
              bg="linear-gradient(to left, transparent, rgba(255,255,255,0.55))"
            />
          </Flex>

          {/* Cuadrícula de cajas */}
          <Grid
            ref={recibirasGridReveal.ref}
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={{ base: 5, md: 7 }}
            mt={{ base: 4, md: 6 }}
          >
            {beneficios.map((b, i) => {
              const Icon = b.icon;
              return (
                <Flex
                  key={i}
                  direction="column"
                  align="flex-start"
                  gap={4}
                  p={{ base: 7, md: 9 }}
                  borderRadius="2xl"
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(255,255,255,0.14)"
                  sx={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
                  boxShadow="0 4px 18px rgba(0,0,0,0.12)"
                  opacity={recibirasGridReveal.visible ? 1 : 0}
                  transform={recibirasGridReveal.visible ? "translateY(0)" : "translateY(28px)"}
                  transition={`opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`}
                >
                  {/* Icono (izquierda) + título (derecha) */}
                  <Flex align="center" gap={4} w="100%">
                    <Flex
                      align="center"
                      justify="center"
                      w="56px"
                      h="56px"
                      borderRadius="full"
                      bg="rgba(255,255,255,0.08)"
                      border="1px solid rgba(255,255,255,0.22)"
                      color="white"
                      flexShrink={0}
                      sx={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.25))" }}
                    >
                      <Icon size={28} strokeWidth={1.6} />
                    </Flex>

                    <Text
                      color="white"
                      fontFamily="'EB Garamond', serif"
                      fontWeight="700"
                      fontSize={{ base: "xl", md: "2xl" }}
                      letterSpacing="0.02em"
                      lineHeight="1.3"
                      textShadow="0 0 8px rgba(255,255,255,0.22)"
                    >
                      {b.title}
                    </Text>
                  </Flex>

                  <Text
                    color="rgba(255,255,255,0.82)"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="400"
                    fontSize={{ base: "sm", md: "md" }}
                    lineHeight="1.75"
                    letterSpacing="0.01em"
                  >
                    {b.text}
                  </Text>
                </Flex>
              );
            })}
          </Grid>

          {/* Separador (mismo estilo que el de las disciplinas) */}
          {/* <Flex justify="center" mt={{ base: 16, md: 20 }}>
            <Box
              w="100%"
              maxW="500px"
              h="1px"
              bg="rgba(255,255,255,0.15)"
              opacity={recibirasAccesoReveal.visible ? 1 : 0}
              transform={recibirasAccesoReveal.visible ? "scaleX(1)" : "scaleX(0.2)"}
              transition="opacity 0.8s ease, transform 0.8s ease"
            />
          </Flex>

          {/* Bloque horizontal de acceso 
          <Flex
            ref={recibirasAccesoReveal.ref}
            direction="column"
            align="center"
            gap={{ base: 8, md: 10 }}
            mt={{ base: 16, md: 24 }}
            opacity={recibirasAccesoReveal.visible ? 1 : 0}
            transform={recibirasAccesoReveal.visible ? "translateY(0)" : "translateY(28px)"}
            transition="opacity 0.8s ease, transform 0.8s ease"
          >
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "2xl", md: "4xl" }}
              letterSpacing="0.03em"
              lineHeight="1.2"
              textAlign="center"
              textShadow="0 0 12px rgba(255,255,255,0.38), 0 0 26px rgba(180,255,245,0.16)"
            >
              Empieza cuando quieras
            </Text>

            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 5, md: 7 }}
              w="100%"
              maxW="820px"
              align="stretch"
            >
              {[
                {
                  nombre: "Disciplina individual",
                  precio: "20 €",
                  desc: "Acceso completo a una disciplina.",
                },
                {
                  nombre: "Sesión individual",
                  precio: "15 € / hora",
                  desc: "Acompañamiento opcional.",
                },
              ].map((col, i) => (
                <Flex
                  key={i}
                  flex={1}
                  direction="column"
                  align="center"
                  textAlign="center"
                  gap={3}
                  p={{ base: 8, md: 10 }}
                  borderRadius="2xl"
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(255,255,255,0.14)"
                  sx={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
                  boxShadow="0 4px 18px rgba(0,0,0,0.12)"
                  transition="box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease, transform 0.3s ease"
                  _hover={{
                    bg: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.3)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2), 0 0 22px rgba(180,255,245,0.16)",
                    transform: "translateY(-6px)",
                  }}
                >
                  <Text
                    color="rgba(255,255,255,0.9)"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="600"
                    fontSize={{ base: "lg", md: "xl" }}
                    letterSpacing="0.04em"
                    textShadow="0 0 8px rgba(255,255,255,0.2)"
                  >
                    {col.nombre}
                  </Text>
                  <Text
                    color="white"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "3xl", md: "4xl" }}
                    letterSpacing="0.02em"
                    lineHeight="1.1"
                    textShadow="0 0 14px rgba(255,255,255,0.4), 0 0 28px rgba(180,255,245,0.18)"
                  >
                    {col.precio}
                  </Text>
                  <Text
                    color="rgba(255,255,255,0.8)"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="400"
                    fontSize={{ base: "sm", md: "md" }}
                    lineHeight="1.7"
                  >
                    {col.desc}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex> */}
        </Box>
      </Box>

      {/* ── Conocer a la creadora ── */}
      {/* <Flex
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
          textShadow="0 0 8px rgba(255,255,255,0.38), 0 0 18px rgba(255,255,255,0.21)"
          _hover={{
            bg: "rgba(255,255,255,0.16)",
            borderColor: "rgba(255,255,255,0.85)",
            boxShadow: "0 0 20px rgba(255,255,255,0.45), 0 0 42px rgba(180,255,245,0.28), 0 4px 14px rgba(0,0,0,0.2)",
            transform: "translateY(-1px)",
          }}
          transition="all 0.25s ease"
        >
          Conocer a la creadora
          <Box as="span" fontSize={{ base: "sm", md: "md" }} style={{ textShadow: "0 0 8px rgba(255,255,255,0.45), 0 0 18px rgba(255,255,255,0.22)" }}>
            →
          </Box>
        </Flex>
        <Box
          h="1px"
          w={{ base: "24px", md: "44px" }}
          bg="linear-gradient(to left, transparent, rgba(255,255,255,0.6))"
          boxShadow="0 0 6px rgba(255,255,255,0.4)"
        />
      </Flex> */}

      {/* ── BOTÓN EMPEZAR + TENGO DUDAS ── */}
      <Flex
        ref={botonesReveal.ref}
        direction="column"
        align="center"
        pt={{ base: 24, md: 36 }}
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
          gap={{ base: 2, md: 6 }}
          px={{ base: 5, md: 24 }}
          py={{ base: "12px", md: "22px" }}
          minW={{ base: "auto", md: "520px" }}
          maxW={{ base: "92vw", md: "none" }}
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
            h={{ base: "24px", md: "44px" }}
            objectFit="contain"
            flexShrink={0}
            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.56)) drop-shadow(0 0 24px rgba(255,255,255,0.3))" }}
          />
          <Text
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "14px", md: "2xl" }}
            letterSpacing={{ base: "0.04em", md: "0.18em" }}
            textTransform="uppercase"
            textAlign="center"
            whiteSpace="nowrap"
            textShadow="0 0 14px rgba(255,255,255,0.52), 0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(180,255,245,0.22)"
          >
            Apúntate a la lista de espera
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
              style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.38))" }}
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
              textShadow="0 0 8px rgba(255,255,255,0.34), 0 0 18px rgba(255,255,255,0.17)"
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
              style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.38))" }}
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
              textShadow="0 0 8px rgba(255,255,255,0.34), 0 0 18px rgba(255,255,255,0.17)"
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
          bg="rgba(0,0,0,0.85)"
          sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          onClick={() => setSelectedCard(null)}
          px={{ base: 5, md: 10 }}
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            bg={hasDisciplinaBg(selectedCard.name) ? "transparent" : selectedCard.bg + "f0"}
            border={`1.5px solid ${selectedCard.txt}66`}
            sx={{ backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)" }}
            borderRadius="3xl"
            boxShadow={`0 0 0 1px ${selectedCard.txt}55, 0 0 45px ${selectedCard.txt}66, 0 0 90px ${selectedCard.txt}33, 0 22px 70px rgba(0,0,0,0.6)`}
            maxW={{ base: "100%", md: "700px" }}
            w="100%"
            maxH="92vh"
            position="relative"
            overflow="hidden"
          >
            {hasDisciplinaBg(selectedCard.name) && <DisciplinaBgLayer nom={selectedCard.name} borderRadius="3xl" blur />}
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

            {/* Contenido scrollable interno — el modal exterior se queda fijo
                (con bg + X). Aquí dentro se hace scroll si el contenido excede
                el alto del modal. Así nunca se corta contra el viewport. */}
            <Box
              p={{ base: 7, md: 14 }}
              display="flex"
              flexDirection="column"
              gap={{ base: 6, md: 8 }}
              position="relative"
              zIndex={1}
              maxH="92vh"
              overflowY="auto"
              sx={{
                scrollbarWidth: "thin",
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { background: `${selectedCard.txt}55`, borderRadius: "3px" },
              }}
            >

            {/* HERO ── icono + título + descripción ── */}
            <Flex direction="column" align="center" gap={{ base: 4, md: 6 }} pt={{ base: 2, md: 4 }} position="relative" zIndex={1}>
              <Box position="relative" display="flex" alignItems="center" justifyContent="center">
                <Box
                  position="absolute"
                  w={{ base: "160px", md: "200px" }}
                  h={{ base: "160px", md: "200px" }}
                  borderRadius="full"
                  bg={`radial-gradient(circle, ${selectedCard.txt}33 0%, ${selectedCard.txt}00 70%)`}
                />
                <Box
                  bg={hasDisciplinaBg(selectedCard.name) ? "transparent" : selectedCard.bg}
                  borderRadius="full"
                  w={{ base: "108px", md: "128px" }}
                  h={{ base: "108px", md: "128px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border={`3px solid ${selectedCard.txt}`}
                  boxShadow={`0 0 28px ${selectedCard.txt}cc, 0 4px 20px ${selectedCard.txt}77`}
                  position="relative"
                  overflow={hasDisciplinaBg(selectedCard.name) ? "hidden" : undefined}
                >
                  {hasDisciplinaBg(selectedCard.name) && <DisciplinaBgLayer nom={selectedCard.name} borderRadius="full" />}
                  <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
                    {selectedCard.renderIcon("64px")}
                  </Box>
                </Box>
              </Box>

              <Text
                color={selectedCard.txt}
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="700"
                letterSpacing="0.05em"
                textAlign="center"
                lineHeight="1.1"
                textShadow={headerNameShadow(selectedCard)}
                filter={hasDisciplinaBg(selectedCard.name) ? undefined : `drop-shadow(0 2px 14px ${selectedCard.txt}55)`}
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
                textShadow={headerDescShadow(selectedCard)}
              >
                {selectedCard.desc}
              </Text>
            </Flex>

            {/* Separador antes del contenido */}
            <Flex align="center" gap={4} mt={{ base: 2, md: 4 }} position="relative" zIndex={1}>
              <Box flex="1" h="1px" bgGradient={`linear(to-r, transparent, ${selectedCard.txt}55)`} />
              <Text
                color={selectedCard.txt}
                opacity={0.7}
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="0.32em"
                textTransform="uppercase"
                fontWeight="600"
                textShadow={naturalBoxShadow(selectedCard.bg)}
              >
                Qué incluye
              </Text>
              <Box flex="1" h="1px" bgGradient={`linear(to-l, transparent, ${selectedCard.txt}55)`} />
            </Flex>

            {/* SECCIONES DE CONTENIDO — cada una dentro de un panel translúcido
                claro, estilo cristal, para separarlas visualmente del fondo de
                la disciplina. Sin hover ni shadow fuerte para no parecer botón. */}
            <Flex direction="column" gap={{ base: 4, md: 5 }} position="relative" zIndex={1}>
              {selectedCard.contenido.map((seccion, i) => (
                <Flex
                  key={i}
                  direction="column"
                  px={{ base: 5, md: 7 }}
                  py={{ base: 5, md: 6 }}
                  gap={{ base: 3, md: 4 }}
                  cursor="default"
                  userSelect="text"
                  bg="rgba(255,255,255,0.08)"
                  border="1px solid rgba(255,255,255,0.14)"
                  borderRadius="xl"
                  sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
                >
                  {/* Título de sección */}
                  <Text
                    color={selectedCard.txt}
                    fontSize={{ base: "16px", md: "20px" }}
                    fontWeight="700"
                    letterSpacing="0.04em"
                    lineHeight="1.25"
                    textAlign="center"
                    textShadow={boxTitleShadow(selectedCard)}
                  >
                    {seccion.titulo}
                  </Text>

                  {/* Items */}
                  <Flex direction="column" gap={{ base: 2, md: 2.5 }} flex="1">
                    {seccion.items.map((item, j) => (
                      <Text
                        key={j}
                        color={selectedCard.txt}
                        opacity={1}
                        fontSize={{ base: "14px", md: "16px" }}
                        lineHeight={{ base: "1.6", md: "1.7" }}
                        letterSpacing="0.01em"
                        textAlign="center"
                        textShadow={boxTextShadow(selectedCard)}
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
                        opacity={0.95}
                        flexShrink={0}
                      >
                        <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
                      </Box>
                      <Text
                        color={selectedCard.txt}
                        fontSize={{ base: "xs", md: "sm" }}
                        letterSpacing="0.06em"
                        fontStyle="italic"
                        opacity={0.95}
                        lineHeight="1.3"
                        textShadow={boxTextShadow(selectedCard)}
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

      <WaitlistModal
        isOpen={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      <SiteFooter />
    </Box>
  );
}
