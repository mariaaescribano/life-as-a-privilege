import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import SiteHeader from "../../global/SiteHeader";

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.2); }
  to   { opacity: 1; transform: scale(1); }
`;
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { AstrologiaLoader } from "../../metodo/comicLoaders";
import {
  API_URL,
  astrologiaBg,
  astrologiaTxt,
  AstrologiaIcon,
} from "../../../GlobalVariables";
import axios from "axios";
import { modulosAstrologia } from "../../../hardCoded/aprendizajes/Astrologia/ModulosAstrologia";
import SiteFooter from "../../global/Footer";
import { GlifoSigno } from "../../metodo/Glifo";
import { FUENTE_GLIFOS } from "../../metodo/glifosAstro";
import { FloatingActionButton } from "../../aprendizaje/FloatingActionButton";

/* ══════════════════════════════════════════════
   SIGNOS DEL ZODIACO
══════════════════════════════════════════════ */
const ZODIAC_SIGNS = [
  { name: "Aries",       symbol: "\u2648" },
  { name: "Tauro",       symbol: "\u2649" },
  { name: "Géminis",     symbol: "\u264A" },
  { name: "Cáncer",      symbol: "\u264B" },
  { name: "Leo",         symbol: "\u264C" },
  { name: "Virgo",       symbol: "\u264D" },
  { name: "Libra",       symbol: "\u264E" },
  { name: "Escorpio",    symbol: "\u264F" },
  { name: "Sagitario",   symbol: "\u2650" },
  { name: "Capricornio", symbol: "\u2651" },
  { name: "Acuario",     symbol: "\u2652" },
  { name: "Piscis",      symbol: "\u2653" },
];

type SignField = "sol" | "luna" | "ascendente";
interface AstrologiaData { sol: string | null; luna: string | null; ascendente: string | null; }

/* ══════════════════════════════════════════════
   PLANETAS DE LA CARTA NATAL
══════════════════════════════════════════════ */
type PlanetKey = "sol" | "luna" | "ascendente" | "mercurio" | "venus" | "marte" | "jupiter" | "saturno" | "urano" | "neptuno" | "pluton";

interface Planet {
  key: PlanetKey;
  label: string;
  symbol: string;
  img: string | null;       // null = usa símbolo
  color: string;            // glow y acento
  interactive: boolean;
}

const PLANETS: Planet[] = [
  { key: "sol",        label: "Sol",        symbol: "\u2609", img: null,                         color: "#FFD97D", interactive: true  },
  { key: "luna",       label: "Luna",       symbol: "\u263D", img: null,                         color: "#C8C8E8", interactive: true  },
  { key: "mercurio",   label: "Mercurio",   symbol: "\u263F", img: null,                         color: "#A8B8C8", interactive: false },
  { key: "venus",      label: "Venus",      symbol: "\u2640", img: null,                         color: "#FFB8D0", interactive: false },
  { key: "marte",      label: "Marte",      symbol: "\u2642", img: null,                         color: "#FF7055", interactive: false },
  { key: "jupiter",    label: "Júpiter",    symbol: "\u2643", img: null,                         color: "#FFBA60", interactive: false },
  { key: "saturno",    label: "Saturno",    symbol: "\u2644", img: null,                         color: "#E0CC80", interactive: false },
  { key: "urano",      label: "Urano",      symbol: "\u2645", img: null,                         color: "#80EFD8", interactive: false },
  { key: "neptuno",    label: "Neptuno",    symbol: "\u2646", img: null,                         color: "#6090FF", interactive: false },
  { key: "pluton",     label: "Plutón",     symbol: "\u2647", img: null,                         color: "#B080E0", interactive: false },
  { key: "ascendente", label: "Ascendente", symbol: "\u2191", img: null,                         color: astrologiaTxt, interactive: true  },
];

/* ══════════════════════════════════════════════
   FONDO ESPACIAL (foto real + overlay)
══════════════════════════════════════════════ */
const SpaceBg = () => (
  <Box position="absolute" inset="0" pointerEvents="none" overflow="hidden" borderRadius="inherit">
    <Box
      as="img"
      src="/img/astrologia/space.jpg"
      alt=""
      position="absolute" inset="0"
      w="100%" h="100%"
      style={{ objectFit: "cover", objectPosition: "center" }}
    />
    <Box
      position="absolute" inset="0"
      style={{ background: "rgba(8,13,30,0.55)" }}
    />
  </Box>
);

/* ══════════════════════════════════════════════
   GLIFO ZODIACAL — svg text (sin emoji)
══════════════════════════════════════════════ */
/* ══════════════════════════════════════════════
   SÍMBOLO DE PLANETA — en círculo
══════════════════════════════════════════════ */
const PlanetGlyph = ({ symbol, size = 32, color }: { symbol: string; size?: number; color: string }) => (
  <svg viewBox="0 0 36 36" width={size} height={size} style={{ flexShrink: 0, filter: `drop-shadow(0 0 6px ${color}99)` }}>
    <text x="18" y="27" textAnchor="middle" fontSize="26"
      fontFamily={FUENTE_GLIFOS}
      fill={color}>
      {symbol}{"\uFE0E"}
    </text>
  </svg>
);

/* ══════════════════════════════════════════════
   DESCRIPCIONES POR CAMPO Y SIGNO
══════════════════════════════════════════════ */
const SIGN_INFO: Record<SignField, Record<string, string>> = {
  sol: {
    Aries:       "Tu identidad es impulsiva, pionera y directa. Tu esencia busca la acción, el inicio y la conquista. Aprendes siendo el primero, lanzándote sin miedo.",
    Tauro:       "Tu identidad es arraigada, sensorial y persistente. Tu esencia busca la seguridad, la belleza y la constancia. Aprendes a través de la materia y los sentidos.",
    Géminis:     "Tu identidad es curiosa, versátil y comunicativa. Tu esencia busca el conocimiento, la conexión y el intercambio. Aprendes en el movimiento mental constante.",
    Cáncer:      "Tu identidad es protectora, intuitiva y emocional. Tu esencia busca el hogar, el cuidado y la pertenencia. Aprendes a través del mundo emocional.",
    Leo:         "Tu identidad es creativa, expresiva y magnética. Tu esencia busca el reconocimiento, la alegría y el brillo propio. Aprendes dando desde el corazón.",
    Virgo:       "Tu identidad es analítica, servicial y perfeccionista. Tu esencia busca el orden, la utilidad y la mejora continua. Aprendes a través del detalle y el servicio.",
    Libra:       "Tu identidad es armoniosa, diplomática y relacional. Tu esencia busca el equilibrio, la justicia y la belleza compartida. Aprendes en el vínculo.",
    Escorpio:    "Tu identidad es intensa, transformadora y profunda. Tu esencia busca la verdad, el poder y la regeneración. Aprendes a través de la muerte y el renacimiento.",
    Sagitario:   "Tu identidad es expansiva, filosófica y libre. Tu esencia busca el sentido, la aventura y la sabiduría. Aprendes explorando horizontes y significados.",
    Capricornio: "Tu identidad es disciplinada, ambiciosa y responsable. Tu esencia busca el logro, la estructura y el legado. Aprendes a través del esfuerzo sostenido.",
    Acuario:     "Tu identidad es original, humanitaria e independiente. Tu esencia busca la libertad, la innovación y la colectividad. Aprendes rompiendo moldes establecidos.",
    Piscis:      "Tu identidad es sensible, compasiva y espiritual. Tu esencia busca la disolución, la fusión y la trascendencia. Aprendes a través de la rendición y la fe.",
  },
  luna: {
    Aries:       "Tus emociones son rápidas, ardientes e inmediatas. Necesitas acción para procesar lo que sientes. La ira es tu señal de alarma emocional más honesta.",
    Tauro:       "Tus emociones son estables, sensuales y lentas. Necesitas seguridad material y física para sentirte bien. La resistencia al cambio es tu modo de protegerte.",
    Géminis:     "Tus emociones se procesan a través de la mente y la palabra. Necesitas hablar, entender y conectar para sentirte en equilibrio emocional.",
    Cáncer:      "Tus emociones son profundas, nutritivas y cambiantes. Necesitas sentirte en casa para abrirte. El cuidado del hogar y la familia te ancla emocionalmente.",
    Leo:         "Tus emociones necesitan ser expresadas y reconocidas. La calidez, el juego y la apreciación genuina son tu principal alimento emocional.",
    Virgo:       "Tus emociones se manifiestan como preocupación y análisis. Necesitas sentirte útil y con el entorno ordenado para estar en paz internamente.",
    Libra:       "Tus emociones buscan la armonía y el equilibrio. El conflicto te desestabiliza profundamente. Las relaciones pacíficas son tu base emocional.",
    Escorpio:    "Tus emociones son intensas, ocultas y transformadoras. Necesitas profundidad y autenticidad total para confiar y abrirte emocionalmente.",
    Sagitario:   "Tus emociones buscan la expansión y la libertad. Necesitas espacio, aventura y significado para no sentirte atrapado o vacío emocionalmente.",
    Capricornio: "Tus emociones son contenidas y se expresan con dificultad. Necesitas estructura y logros visibles para sentirte emocionalmente seguro.",
    Acuario:     "Tus emociones son mentales, distantes y colectivas. Necesitas entender lo que sientes antes de vivirlo. La independencia es tu base emocional.",
    Piscis:      "Tus emociones son difusas, compasivas y absorbentes. Necesitas soledad, creatividad y espiritualidad para no perderte en el mundo emocional de los otros.",
  },
  ascendente: {
    Aries:       "Te muestras al mundo como alguien directo, enérgico y decidido. Tu primera impresión es de fuerza y dinamismo. Tiendes a lanzarte antes de pensar.",
    Tauro:       "Te muestras al mundo como alguien tranquilo, confiable y sensual. Tu presencia transmite calma y solidez. Cambias lentamente pero con firmeza inquebrantable.",
    Géminis:     "Te muestras al mundo como alguien curioso, ágil y comunicativo. Tu presencia es ligera y versátil. Conectas fácilmente con cualquier tipo de persona.",
    Cáncer:      "Te muestras al mundo como alguien cálido, protector e intuitivo. Tu presencia nutre. Tardas en abrirte pero cuando lo haces, cuidas con gran profundidad.",
    Leo:         "Te muestras al mundo como alguien carismático, generoso y seguro. Tu presencia ilumina. Buscas dejar huella y ser reconocido por tu singularidad.",
    Virgo:       "Te muestras al mundo como alguien cuidadoso, servicial y analítico. Tu presencia es discreta y eficiente. Observas todo antes de actuar.",
    Libra:       "Te muestras al mundo como alguien encantador, diplomático y estético. Tu presencia es amable y equilibrada. Buscas la armonía en cada interacción.",
    Escorpio:    "Te muestras al mundo como alguien magnético, reservado e intenso. Tu presencia es penetrante. La gente siente que hay mucho más detrás de tu mirada.",
    Sagitario:   "Te muestras al mundo como alguien optimista, expansivo y honesto. Tu presencia es jovial y libre. Generas entusiasmo genuino allí donde apareces.",
    Capricornio: "Te muestras al mundo como alguien serio, responsable y ambicioso. Tu presencia transmite madurez. Ganas respeto y autoridad con el paso del tiempo.",
    Acuario:     "Te muestras al mundo como alguien original, independiente y visionario. Tu presencia es inusual. Rompes esquemas sin apenas darte cuenta.",
    Piscis:      "Te muestras al mundo como alguien sensible, empático y etéreo. Tu presencia es suave y envolvente. Absorbes el ambiente de cada lugar que habitas.",
  },
};

/* ══════════════════════════════════════════════
   ICONOS DE CAMPO (Sol / Luna / Ascendente)
══════════════════════════════════════════════ */
const SolFieldIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="currentColor">
    <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"/>
  </svg>
);

const LunaFieldIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="currentColor">
    <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/>
  </svg>
);

const AscendenteFieldIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill="currentColor">
    <path d="M440-80v-647L244-331l-56-57 292-292 292 292-56 57-196-196v647h-80Z"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
  </svg>
);

// Sin `img`: apuntaba a fotos que no existen y además nunca se leía — lo que se
// pinta es el `icon`.
const FIELD_META: Record<SignField, { label: string; icon: (size?: number) => React.ReactNode }> = {
  sol:        { label: "Sol",        icon: (s) => <SolFieldIcon size={s} /> },
  luna:       { label: "Luna",       icon: (s) => <LunaFieldIcon size={s} /> },
  ascendente: { label: "Ascendente", icon: (s) => <AscendenteFieldIcon size={s} /> },
};

/* ══════════════════════════════════════════════
   MODAL — TEASER (planetas no interactivos)
══════════════════════════════════════════════ */
const PlanetTeaserModal = ({
  planet,
  onClose,
}: {
  planet: Planet;
  onClose: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
  <Box
    position="fixed" inset="0" zIndex={1000}
    display="flex" alignItems="center" justifyContent="center"
    px={4}
    onClick={onClose}
  >
    <Box position="absolute" inset="0" bg="rgba(0,0,0,0.82)" />

    <Box
      position="relative"
      filter={`drop-shadow(0 0 12px ${planet.color}88) drop-shadow(0 0 32px ${planet.color}33)`}
      borderRadius="2xl"
      overflow="hidden"
      w="100%" maxW="480px"
      display="flex" flexDirection="column"
      boxShadow={`0 16px 64px rgba(0,0,0,0.85), 0 0 80px ${planet.color}18`}
      onClick={(e) => e.stopPropagation()}
    >
      <SpaceBg />

      {/* Botón X */}
      <Box position="absolute" top={3} right={3} zIndex={2}>
        <Box
          as="button"
          onClick={onClose}
          w="30px" h="30px" borderRadius="full"
          display="flex" alignItems="center" justifyContent="center"
          bg="rgba(0,0,0,0.5)"
          border={`1px solid ${astrologiaTxt}33`}
          color={`${astrologiaTxt}77`}
          cursor="pointer"
          transition="all 0.15s"
          _hover={{ color: astrologiaTxt, borderColor: `${astrologiaTxt}66`, bg: "rgba(0,0,0,0.7)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
          </svg>
        </Box>
      </Box>

      {/* Contenido */}
      <Box position="relative" zIndex={1} px={8} py={10} display="flex" flexDirection="column" alignItems="center" gap={6}>

        {/* Símbolo del planeta */}
        <Box
          w="72px" h="72px" borderRadius="full"
          bg={`${astrologiaBg}cc`}
          border={`1.5px solid ${planet.color}55`}
          boxShadow={`0 0 28px ${planet.color}44, 0 0 56px ${planet.color}18, inset 0 0 16px ${planet.color}0a`}
          display="flex" alignItems="center" justifyContent="center"
        >
          <PlanetGlyph symbol={planet.symbol} size={38} color={planet.color} />
        </Box>

        {/* Nombre del planeta */}
        <Text
          color={planet.color}
          fontSize="lg"
          fontFamily="'EB Garamond', serif"
          letterSpacing="0.18em"
          textTransform="uppercase"
          filter={`drop-shadow(0 0 8px ${planet.color}88)`}
          mt={-3}
        >
          {planet.label}
        </Text>

        {/* Línea decorativa */}
        <Box w="60px" h="1px" bg={`${astrologiaTxt}33`} borderRadius="full" />

        {/* Preguntas */}
        <Flex direction="column" gap={4} align="center" textAlign="center">
          <Text
            color={`${astrologiaTxt}ee`}
            fontSize={{ base: "xl", md: "2xl" }}
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            lineHeight="1.65"
            letterSpacing="0.02em"
          >
            ¿Quieres saber qué arquetipos te forman?
          </Text>
          <Text
            color={`${astrologiaTxt}cc`}
            fontSize={{ base: "lg", md: "xl" }}
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            lineHeight="1.65"
            letterSpacing="0.02em"
          >
            ¿Quieres una lectura profesional de tu Carta Astral?
          </Text>
        </Flex>

        {/* Línea decorativa */}
        <Box w="60px" h="1px" bg={`${astrologiaTxt}33`} borderRadius="full" />

        {/* Botón Contactar */}
        <Box
          as={Link}
          to="/contacto"
          px={8} py={3}
          borderRadius="full"
          border={`1.5px solid ${astrologiaTxt}66`}
          bg="rgba(0,0,0,0.25)"
          color={astrologiaTxt}
          fontSize="md"
          fontFamily="'EB Garamond', serif"
          letterSpacing="0.14em"
          textTransform="uppercase"
          cursor="pointer"
          transition="all 0.22s ease"
          textDecoration="none"
          display="inline-block"
          boxShadow={`0 0 20px ${astrologiaTxt}22`}
          _hover={{
            bg: `${astrologiaTxt}18`,
            border: `1.5px solid ${astrologiaTxt}cc`,
            boxShadow: `0 0 28px ${astrologiaTxt}55, 0 0 56px ${astrologiaTxt}22`,
            transform: "scale(1.04)",
          }}
        >
          Contactar
        </Box>
      </Box>
    </Box>
  </Box>
  );
};

/* ══════════════════════════════════════════════
   MODAL — SELECTOR / INFORMACIÓN (Sol · Luna · Asc)
══════════════════════════════════════════════ */
const ZodiacModal = ({
  field, currentSign, onClose, onSelect, onClear, saving,
}: {
  field: SignField;
  currentSign: string | null;
  onClose: () => void;
  onSelect: (sign: string) => void;
  onClear: () => void;
  saving?: boolean;
}) => {
  const meta = FIELD_META[field];
  const showInfo = !!currentSign;
  const [letraOpen, setLetraOpen] = useState(false);
  const signData = currentSign ? ZODIAC_SIGNS.find((s) => s.name === currentSign) : null;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  const info = currentSign ? SIGN_INFO[field][currentSign] : null;
  const signIndex = currentSign ? ZODIAC_SIGNS.findIndex((s) => s.name === currentSign) : -1;
  const submoduleData = signIndex >= 0
    ? field === "ascendente" ? modulosAstrologia[2]?.submodules[signIndex]
    : field === "sol"        ? modulosAstrologia[3]?.submodules[signIndex]
    : field === "luna"       ? modulosAstrologia[4]?.submodules[signIndex]
    : null
    : null;

  return (
    <Box
      position="fixed" inset="0" zIndex={1000}
      display="flex" alignItems="center" justifyContent="center"
      px={4}
      onClick={onClose}
    >
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.78)" />

      <Box
        position="relative"
        filter={`drop-shadow(0 0 10px ${astrologiaTxt}cc) drop-shadow(0 0 20px ${astrologiaTxt}77)`}
        borderRadius="2xl"
        style={{ overflow: "clip" }}
        w="100%" maxW="660px"
        maxH="92vh"
        display="flex" flexDirection="column"
        boxShadow={`0 12px 60px rgba(0,0,0,0.8), 0 0 60px ${astrologiaTxt}18`}
        onClick={(e) => e.stopPropagation()}
      >
        <SpaceBg />

        <Box position="absolute" top={3} right={3} zIndex={2}>
          <Box
            as="button"
            onClick={onClose}
            w="30px" h="30px" borderRadius="full"
            display="flex" alignItems="center" justifyContent="center"
            bg="rgba(0,0,0,0.5)"
            border={`1px solid ${astrologiaTxt}33`}
            color={`${astrologiaTxt}88`}
            cursor="pointer"
            transition="all 0.15s"
            _hover={{ color: astrologiaTxt, borderColor: `${astrologiaTxt}77`, bg: "rgba(0,0,0,0.7)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </Box>
        </Box>

        {/* ── Spinner overlay al guardar ── */}
        {saving && (
          <Box
            position="absolute" inset="0" zIndex={10}
            borderRadius="2xl"
            bg="rgba(0,0,0,0.45)"
            display="flex" alignItems="center" justifyContent="center"
          >
            <AstrologiaLoader color="#ffffff" size="58px" />
          </Box>
        )}

        <Box position="relative" zIndex={1} px={6} py={7} display="flex" flexDirection="column" gap={4} overflowY="auto" flex="1">

          {showInfo && signData && info ? (
            <>
              <Box
                bg={astrologiaBg}
                border={`1.5px solid ${astrologiaTxt}33`}
                borderRadius="xl"
                px={6} py={5}
                boxShadow={`0 0 28px ${astrologiaTxt}22, inset 0 0 20px rgba(0,0,0,0.3)`}
              >
                <Flex align="center" justify="center" gap={3} flexWrap="wrap">
                  <Box
                    color={astrologiaTxt}
                    filter={`drop-shadow(0 0 10px ${astrologiaTxt}cc) drop-shadow(0 0 20px ${astrologiaTxt}77)`}
                  >
                    {meta.icon(34)}
                  </Box>
                  <Text
                    color={astrologiaTxt}
                    fontSize="2xl" fontWeight="700"
                    fontFamily="'EB Garamond', serif" letterSpacing="0.07em"
                    style={{ textShadow: `0 0 10px ${astrologiaTxt}bb, 0 0 20px ${astrologiaTxt}66` }}
                  >
                    {field === "ascendente" ? meta.label : `${meta.label} en`}
                  </Text>
                  <Box
                    color={astrologiaTxt}
                    filter={`drop-shadow(0 0 12px ${astrologiaTxt}cc) drop-shadow(0 0 24px ${astrologiaTxt}66)`}
                  >
                    <GlifoSigno nombre={signData.name} color={astrologiaTxt} size={34} />
                  </Box>
                  <Text
                    color={astrologiaTxt}
                    fontSize="2xl" fontWeight="700"
                    fontFamily="'EB Garamond', serif" letterSpacing="0.07em"
                    style={{ textShadow: `0 0 10px ${astrologiaTxt}bb, 0 0 20px ${astrologiaTxt}66` }}
                  >
                    {currentSign}
                  </Text>
                </Flex>
              </Box>

              {submoduleData && (
                <Box
                  bg={astrologiaBg}
                  border={`1px solid ${astrologiaTxt}22`}
                  borderRadius="xl"
                  px={5} py={3}
                  boxShadow={`0 0 16px ${astrologiaTxt}10, inset 0 0 12px rgba(0,0,0,0.25)`}
                >
                  <Text
                    color={`${astrologiaTxt}cc`}
                    fontSize={{ base: "lg", md: "xl" }}
                    fontFamily="'EB Garamond', serif"
                    fontStyle="italic"
                    lineHeight="1.8" letterSpacing="0.02em"
                    textAlign="center"
                  >
                    {submoduleData.descripcion}
                  </Text>
                </Box>
              )}

              {submoduleData?.letra && (
                <Box>
                  <Flex
                    as="button"
                    w="100%"
                    align="center"
                    justify="space-between"
                    px={5} py={3}
                    bg={astrologiaBg}
                    border={`1px solid ${astrologiaTxt}22`}
                    borderRadius={letraOpen ? "xl xl 0 0" : "xl"}
                    cursor="pointer"
                    onClick={() => setLetraOpen(!letraOpen)}
                    transition="border-radius 0.2s"
                  >
                    <Text
                      color={astrologiaTxt}
                      fontSize="md" fontWeight="600"
                      fontFamily="'EB Garamond', serif" letterSpacing="0.04em"
                    >
                      Transcripción
                    </Text>
                    <Text
                      color={astrologiaTxt} fontSize="xl"
                      transition="transform 0.25s"
                      transform={letraOpen ? "rotate(180deg)" : "rotate(0deg)"}
                    >
                      ▾
                    </Text>
                  </Flex>
                  <Collapse in={letraOpen} animateOpacity>
                    <Box
                      px={5} py={4}
                      bg={astrologiaBg}
                      border={`1px solid ${astrologiaTxt}22`}
                      borderTop="none"
                      borderRadius="0 0 xl xl"
                    >
                      <Text
                        color={`${astrologiaTxt}cc`}
                        fontSize={{ base: "md", md: "lg" }}
                        fontFamily="'EB Garamond', serif"
                        lineHeight="2" letterSpacing="0.02em"
                        whiteSpace="pre-wrap"
                      >
                        {submoduleData.letra}
                      </Text>
                    </Box>
                  </Collapse>
                </Box>
              )}

              <Box display="flex" justifyContent="flex-end">
                <Box
                  as="button"
                  onClick={onClear}
                  color={`${astrologiaTxt}44`}
                  cursor="pointer"
                  transition="all 0.18s"
                  _hover={{ color: "#ff6b6b", filter: "drop-shadow(0 0 6px #ff6b6b88)" }}
                >
                  <TrashIcon />
                </Box>
              </Box>
            </>
          ) : (
            <Box
              bg={astrologiaBg}
              border={`1px solid ${astrologiaTxt}22`}
              borderRadius="xl"
              overflow="hidden"
              boxShadow={`0 0 20px ${astrologiaTxt}14, inset 0 0 16px rgba(0,0,0,0.3)`}
            >
              <Flex align="center" gap={2.5} px={6} pt={5} pb={4} borderBottom={`1px solid ${astrologiaTxt}18`}>
                <Box color={astrologiaTxt} filter={`drop-shadow(0 0 6px ${astrologiaTxt}88)`}>
                  {meta.icon(24)}
                </Box>
                <Text color={astrologiaTxt} fontSize="lg" fontWeight="700"
                  fontFamily="'EB Garamond', serif" letterSpacing="0.05em">
                  Tu {meta.label}
                </Text>
              </Flex>
              <Box maxH="56vh" overflowY="auto" px={3} py={2}>
                {ZODIAC_SIGNS.map((sign) => (
                  <Flex
                    key={sign.name}
                    as="button"
                    align="center" gap={3}
                    w="100%" px={3} py={2.5}
                    borderRadius="lg" cursor="pointer"
                    transition="all 0.14s"
                    _hover={{ bg: `${astrologiaTxt}12` }}
                    onClick={() => onSelect(sign.name)}
                  >
                    <Box
                      w="34px" h="34px" borderRadius="full"
                      bg={`${astrologiaTxt}0e`} border={`1px solid ${astrologiaTxt}28`}
                      display="flex" alignItems="center" justifyContent="center"
                      color={astrologiaTxt} flexShrink={0}
                    >
                      <GlifoSigno nombre={sign.name} color={astrologiaTxt} size={18} />
                    </Box>
                    <Text color={astrologiaTxt} fontSize="lg"
                      fontFamily="'EB Garamond', serif" letterSpacing="0.04em">
                      {sign.name}
                    </Text>
                  </Flex>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════
   CÍRCULO DE PLANETA
══════════════════════════════════════════════ */
const PlanetCircle = ({
  planet,
  sign: _sign,
  onClick,
  size,
}: {
  planet: Planet;
  sign?: string | null;
  onClick: () => void;
  size: number;
}) => {
  const [imgError, setImgError] = useState(false);
  const innerSize = Math.round(size * 0.65);

  return (
    <Flex direction="column" align="center" gap={1.5} style={{ width: size + 24 }}>
      <Box
        as="button" onClick={onClick}
        w={`${size}px`} h={`${size}px`}
        borderRadius="full"
        bg={`${astrologiaBg}dd`}
        border={`1.5px solid ${planet.color}74`}
        boxShadow={`0 0 28px ${planet.color}66, 0 0 56px ${planet.color}28, inset 0 0 16px ${planet.color}14`}
        display="flex" flexDirection="column" alignItems="center" justifyContent="center"
        cursor="pointer" transition="all 0.26s ease" overflow="hidden"
        _hover={{
          border: `1.5px solid ${planet.color}99`,
          transform: "scale(1.08)",
        }}
      >
        {planet.img && !imgError ? (
          <Box
            as="img"
            src={planet.img}
            alt={planet.label}
            onError={() => setImgError(true)}
            style={{
              width: innerSize, height: innerSize,
              objectFit: "contain", opacity: 0.92,
              filter: `drop-shadow(0 0 8px ${planet.color}77)`,
              transition: "all 0.26s ease",
            }}
          />
        ) : (
          <PlanetGlyph symbol={planet.symbol} size={Math.round(size * 0.5)} color={planet.color} />
        )}
      </Box>

      {/* Nombre del planeta */}
      <Text
        color={`${astrologiaTxt}cc`}
        fontSize="xs"
        fontFamily="'EB Garamond', serif"
        letterSpacing="0.08em"
        textTransform="uppercase"
        lineHeight="1"
        userSelect="none"
        textAlign="center"
        noOfLines={1}
      >
        {planet.label}
      </Text>

    </Flex>
  );
};

/* ══════════════════════════════════════════════
   CÍRCULO DE PERFIL
══════════════════════════════════════════════ */
const ProfileCircle = ({ imgUrl, size }: { imgUrl: string; size: number }) => (
  <Box
    w={`${size}px`} h={`${size}px`}
    borderRadius="full" overflow="hidden"
    border={`2.5px solid ${astrologiaTxt}55`}
    boxShadow={`0 0 24px ${astrologiaTxt}44, 0 0 48px ${astrologiaTxt}18`}
    flexShrink={0}
  >
    <Box as="img" src={imgUrl} alt="Perfil" w="100%" h="100%" style={{ objectFit: "cover" }} />
  </Box>
);

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════ */
export default function AstrologiaEspacio() {
  const [data, setData]               = useState<AstrologiaData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [openModal, setOpenModal]     = useState<SignField | null>(null);
  const [teaserPlanet, setTeaserPlanet] = useState<Planet | null>(null);
  const [saving, setSaving]           = useState(false);
  const [imgUrl, setImgUrl]           = useState("/img/icono/noImg.png");
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperWidth, setWrapperWidth] = useState(0);

  /* ── Geometría (círculo completo, 11 planetas) ── */
  const N       = PLANETS.length;   // 11
  const PSIZE   = 100;              // diámetro de cada círculo planeta (px)
  const CENTER  = 168;              // diámetro foto perfil (px)
  const R       = 290;              // radio de la órbita (px) — espacioso en desktop, escala en móvil
  const PAD     = 28;               // margen exterior
  const LABEL_H = 44;              // espacio etiqueta debajo de cada círculo

  const containerSide = Math.round(2 * (R + PSIZE / 2 + PAD));   // ancho = alto del cuadrado base
  const cx = containerSide / 2;
  const cy = containerSide / 2;
  const containerH = containerSide + LABEL_H + PAD;

  const getPlanetPos = (i: number) => {
    const angle = (2 * Math.PI / N) * i - Math.PI / 2; // empieza arriba, sentido horario
    return {
      x: Math.round(cx + R * Math.cos(angle) - PSIZE / 2),
      y: Math.round(cy + R * Math.sin(angle) - PSIZE / 2),
    };
  };

  const chartScale    = wrapperWidth > 0 ? Math.min(1, wrapperWidth / containerSide) : 1;
  const chartOffsetX  = Math.max(0, (wrapperWidth - containerSide * chartScale) / 2);

  const userId = localStorage.getItem("userId") ?? "";

  const fetchData = () => {
    if (!userId) { setLoading(false); return; }
    axios
      .get(`${API_URL}/astrologia/${userId}`)
      .then((r) => setData(r.data ?? { sol: null, luna: null, ascendente: null }))
      .catch(() => setData({ sol: null, luna: null, ascendente: null }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const img = localStorage.getItem("img");
    if (img) setImgUrl(img);
    fetchData();
  }, []);

  useEffect(() => {
    const el = chartWrapperRef.current;
    if (!el) return;
    const update = () => setWrapperWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading]);

  const handlePlanetClick = (planet: Planet) => {
    if (planet.interactive) {
      setOpenModal(planet.key as SignField);
    } else {
      setTeaserPlanet(planet);
    }
  };

  const handleSelect = async (sign: string) => {
    if (!openModal || !userId || saving) return;
    const field = openModal;
    setSaving(true);
    try {
      await axios.post(`${API_URL}/astrologia/${field}`, { userId, [field]: sign });
      setData((prev) => ({ ...(prev ?? { sol: null, luna: null, ascendente: null }), [field]: sign }));
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const handleClear = async () => {
    if (!openModal || !userId || saving) return;
    const field = openModal;
    setOpenModal(null);
    setSaving(true);
    try {
      await axios.post(`${API_URL}/astrologia/clear`, { userId, field });
      setData((prev) => ({ ...(prev ?? { sol: null, luna: null, ascendente: null }), [field]: null }));
    } catch { /* silent */ }
    finally { setSaving(false); }
  };

  const getSign = (key: PlanetKey): string | null => {
    if (key === "sol")        return data?.sol        ?? null;
    if (key === "luna")       return data?.luna       ?? null;
    if (key === "ascendente") return data?.ascendente ?? null;
    return null;
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column" alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Astrología"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            maxW="900px"
          />

          {loading && <AstrologiaLoader color="#ffffff" />}

          {!loading && (
            <Box
              w="100%" maxW="900px"
              position="relative" overflow="hidden"
              border={`1.5px solid ${astrologiaTxt}28`}
              borderRadius="3xl"
              px={{ base: 4, md: 8 }}
              pt={{ base: 8, md: 10 }}
              pb={{ base: 6, md: 8 }}
              boxShadow={`0 4px 24px rgba(0,0,0,0.5), 0 0 48px ${astrologiaTxt}14`}
            >
              <SpaceBg />

              <Box position="relative" zIndex={1}>
                {/* Título */}
                <Flex justify="center" align="center" gap={2.5} mb={{ base: 6, md: 8 }}>
                  <Box flex="1" h="1px" bg={`${astrologiaTxt}1a`} borderRadius="full" />
                  <Text
                    color={astrologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                    fontFamily="'EB Garamond', serif" letterSpacing="0.08em"
                    filter={`drop-shadow(0 0 8px ${astrologiaTxt}55)`}
                  >
                    Tu Carta Natal
                  </Text>
                  <Box flex="1" h="1px" bg={`${astrologiaTxt}1a`} borderRadius="full" />
                </Flex>

                {/* Chart responsivo */}
                <Box
                  ref={chartWrapperRef}
                  w="100%"
                  mb={3}
                  style={{ height: containerH * chartScale, overflow: "hidden" }}
                >
                  <Box
                    position="relative"
                    style={{
                      width: containerSide,
                      height: containerH,
                      transform: `translateX(${chartOffsetX}px) scale(${chartScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    {/* SVG: órbita circular y líneas radiales */}
                    <svg
                      style={{ position: "absolute", top: 0, left: 0, overflow: "visible", pointerEvents: "none" }}
                      width={containerSide} height={containerH}
                    >
                      {/* Círculo de órbita */}
                      <circle
                        cx={cx} cy={cy} r={R}
                        fill="none"
                        stroke={`${astrologiaTxt}14`}
                        strokeWidth="1"
                        strokeDasharray="4 8"
                      />
                      {/* Líneas radiales hacia el centro */}
                      {PLANETS.map((p, i) => {
                        const pos = getPlanetPos(i);
                        return (
                          <line
                            key={p.key}
                            x1={pos.x + PSIZE / 2} y1={pos.y + PSIZE / 2}
                            x2={cx} y2={cy}
                            stroke={`${p.color}18`}
                            strokeWidth="1"
                            strokeDasharray="3 7"
                          />
                        );
                      })}
                    </svg>

                    {/* Círculos de planeta — aparecen uno a uno en sentido horario */}
                    {PLANETS.map((planet, i) => {
                      const pos = getPlanetPos(i);
                      return (
                        <Box
                          key={planet.key}
                          position="absolute"
                          style={{ left: pos.x - 12, top: pos.y }}
                          animation={`${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.15}s both`}
                        >
                          <PlanetCircle
                            planet={planet}
                            sign={getSign(planet.key)}
                            onClick={() => handlePlanetClick(planet)}
                            size={PSIZE}
                          />
                        </Box>
                      );
                    })}

                    {/* Foto de perfil en el centro */}
                    <Box
                      position="absolute"
                      style={{ left: cx - CENTER / 2, top: cy - CENTER / 2 }}
                    >
                      <ProfileCircle imgUrl={imgUrl} size={CENTER} />
                    </Box>
                  </Box>
                </Box>

                {/* Leyenda: toca Sol, Luna o Ascendente */}
                {/* <Text
                  textAlign="center"
                  color={`${astrologiaTxt}55`}
                  fontSize="xs"
                  fontFamily="'EB Garamond', serif"
                  letterSpacing="0.06em"
                  fontStyle="italic"
                  mt={2}
                >
                  Toca el Sol, la Luna o el Ascendente para personalizar tu carta
                </Text> */}
              </Box>
            </Box>
          )}
        </Flex>
      </Box>

     <SiteFooter />

      {/* Modal interactivo (Sol · Luna · Ascendente) */}
      {openModal && (
        <ZodiacModal
          field={openModal}
          currentSign={getSign(openModal)}
          onClose={() => setOpenModal(null)}
          onSelect={handleSelect}
          onClear={handleClear}
          saving={saving}
        />
      )}

      {/* Modal teaser (resto de planetas) */}
      {teaserPlanet && (
        <PlanetTeaserModal
          planet={teaserPlanet}
          onClose={() => setTeaserPlanet(null)}
        />
      )}

      <FloatingActionButton
        config={{ label: "Servicios Astrológicos", action: "astrologia-services" }}
        color={astrologiaTxt}
        bgColor={astrologiaBg}
        icon={<AstrologiaIcon size="22px" />}
      />
    </Box>
  );
}
