import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import SpinnerTurquesa from "../../global/Spinner";
import {
  API_URL,
  astrologiaBg,
  astrologiaTxt,
  AstrologiaIcon,
} from "../../../GlobalVariables";
import axios from "axios";
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
    {/* Overlay oscuro para legibilidad */}
    <Box
      position="absolute" inset="0"
      style={{ background: "rgba(8,13,30,0.55)" }}
    />
  </Box>
);

/* ══════════════════════════════════════════════
   GLIFO ZODIACAL — svg text (sin emoji)
══════════════════════════════════════════════ */
const ZodiacGlyph = ({ symbol, size = 22 }: { symbol: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={{ flexShrink: 0 }}>
    <text x="12" y="19" textAnchor="middle" fontSize="19"
      fontFamily="'Times New Roman', Georgia, 'DejaVu Serif', serif">
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
   ICONOS DE CAMPO
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

const FIELD_META: Record<SignField, { label: string; img: string; icon: (size?: number) => React.ReactNode }> = {
  sol:        { label: "Sol",        img: "/img/astrologia/sun.png",  icon: (s) => <SolFieldIcon size={s} /> },
  luna:       { label: "Luna",       img: "/img/astrologia/moon.png", icon: (s) => <LunaFieldIcon size={s} /> },
  ascendente: { label: "Ascendente", img: "/img/astrologia/path.png", icon: (s) => <AscendenteFieldIcon size={s} /> },
};

/* ══════════════════════════════════════════════
   MODAL (selector o información)
══════════════════════════════════════════════ */
const ZodiacModal = ({
  field, currentSign, onClose, onSelect, onClear,
}: {
  field: SignField;
  currentSign: string | null;
  onClose: () => void;
  onSelect: (sign: string) => void;
  onClear: () => void;
}) => {
  const meta = FIELD_META[field];
  const [mode, setMode] = useState<"info" | "select">(currentSign ? "info" : "select");
  const signData = currentSign ? ZODIAC_SIGNS.find((s) => s.name === currentSign) : null;
  const info = currentSign ? SIGN_INFO[field][currentSign] : null;

  return (
    <Box
      position="fixed" inset="0" zIndex={1000}
      display="flex" alignItems="center" justifyContent="center"
      px={4} 
      onClick={onClose}
    >
      {/* Backdrop oscuro */}
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.78)" />

      {/* Contenedor del modal — fondo space */}
      <Box
        position="relative"
        borderRadius="2xl"
        overflow="hidden"
        w="100%" maxW="580px"
        boxShadow={`0 12px 60px rgba(0,0,0,0.8), 0 0 60px ${astrologiaTxt}18`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fondo espacial del modal */}
        <SpaceBg />

        {/* Botón X — arriba a la derecha */}
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

        {/* Contenido relativo al fondo */}
        <Box position="relative" zIndex={1} px={6} py={7} display="flex" flexDirection="column" gap={4}>

          {mode === "info" && signData && info ? (
            <>
              {/* Tarjeta 1 — encabezado brillante */}
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
                    filter={`drop-shadow(0 0 10px ${astrologiaTxt}bb)`}
                  >
                    {meta.label} en
                  </Text>
                  <Box
                    color={astrologiaTxt}
                    filter={`drop-shadow(0 0 12px ${astrologiaTxt}cc) drop-shadow(0 0 24px ${astrologiaTxt}66)`}
                  >
                    <ZodiacGlyph symbol={signData.symbol} size={34} />
                  </Box>
                  <Text
                    color={astrologiaTxt}
                    fontSize="2xl" fontWeight="700"
                    fontFamily="'EB Garamond', serif" letterSpacing="0.07em"
                    filter={`drop-shadow(0 0 10px ${astrologiaTxt}bb)`}
                  >
                    {currentSign}
                  </Text>
                </Flex>
              </Box>

              {/* Tarjeta 2 — descripción + papelera */}
              <Box
                bg={astrologiaBg}
                border={`1px solid ${astrologiaTxt}22`}
                borderRadius="xl"
                px={6} py={5}
                position="relative"
                boxShadow={`0 0 20px ${astrologiaTxt}14, inset 0 0 16px rgba(0,0,0,0.3)`}
              >
                <Text
                  color={`${astrologiaTxt}cc`}
                  fontSize="lg"
                  fontFamily="'EB Garamond', serif"
                  lineHeight="1.9" letterSpacing="0.02em"
                  pr={8} pb={7}
                >
                  {info}
                </Text>
                {/* Papelera — abajo a la derecha */}
                <Box
                  as="button"
                  onClick={onClear}
                  position="absolute" bottom={3} right={3}
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
            /* ── Vista selector ── */
            <Box
              bg={astrologiaBg}
              border={`1px solid ${astrologiaTxt}22`}
              borderRadius="xl"
              overflow="hidden"
              boxShadow={`0 0 20px ${astrologiaTxt}14, inset 0 0 16px rgba(0,0,0,0.3)`}
            >
              {/* Header selector */}
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
                      <ZodiacGlyph symbol={sign.symbol} size={18} />
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
   CÍRCULO ZODIACAL
══════════════════════════════════════════════ */
const ZodiacCircle = ({
  field, sign, onClick, size,
}: {
  field: SignField; sign: string | null; onClick: () => void; size: number;
}) => {
  const meta = FIELD_META[field];
  const signData = sign ? ZODIAC_SIGNS.find((s) => s.name === sign) : null;

  return (
    <Flex direction="column" align="center" gap={2} style={{ width: size }}>
      <Box
        as="button" onClick={onClick}
        w={`${size}px`} h={`${size}px`}
        borderRadius="full"
        bg={`${astrologiaBg}ee`}
        border={`2px solid ${astrologiaTxt}44`}
        boxShadow={`0 0 20px ${astrologiaTxt}33, 0 0 40px ${astrologiaTxt}18, inset 0 0 14px ${astrologiaTxt}0a`}
        display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={1.5}
        cursor="pointer" transition="all 0.24s ease" overflow="hidden"
        _hover={{
          border: `2px solid ${astrologiaTxt}88`,
          boxShadow: `0 0 32px ${astrologiaTxt}66, 0 0 64px ${astrologiaTxt}28, inset 0 0 18px ${astrologiaTxt}18`,
          transform: "scale(1.06)",
        }}
      >
        <Box
          as="img" src={meta.img} alt={meta.label}
          style={{
            width: "76px", height: "76px",
            objectFit: "contain", opacity: 0.9, transition: "all 0.24s ease",
            filter: `drop-shadow(0 0 10px ${astrologiaTxt}77)`,
          }}
        />
      </Box>

      {/* Debajo del círculo: signo elegido (icono + nombre) o vacío */}
      {signData ? (
        <Flex align="center" gap={1.5} justify="center">
          <Box color={astrologiaTxt} filter={`drop-shadow(0 0 4px ${astrologiaTxt}99)`} lineHeight={1}>
            <ZodiacGlyph symbol={signData.symbol} size={14} />
          </Box>
          <Text
            color={astrologiaTxt} fontSize="xs"
            fontFamily="'EB Garamond', serif" letterSpacing="0.06em"
            lineHeight="1" userSelect="none"
          >
            {signData.name}
          </Text>
        </Flex>
      ) : (
        <Box h="16px" />
      )}
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
  const [data, setData]           = useState<AstrologiaData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [openModal, setOpenModal] = useState<SignField | null>(null);
  const [saving, setSaving]       = useState(false);
  const [imgUrl, setImgUrl]       = useState("/img/noImg.png");

  const userId = sessionStorage.getItem("userId") ?? "";

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
    const img = sessionStorage.getItem("img");
    if (img) setImgUrl(img);
    fetchData();
  }, []);

  const handleSelect = async (sign: string) => {
    if (!openModal || !userId || saving) return;
    const field = openModal;
    setOpenModal(null);
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

  /* ── Geometría ─────────────────────────────────────────
     Sol → arriba (90°) · Luna → izquierda (150°) · Asc → derecha (30°)
  ─────────────────────────────────────────────────────── */
  const CIRCLE = 120;
  const CENTER = 134;
  const R      = 200;
  const cx     = 248;
  const cy     = 305;
  const rad    = (deg: number) => (deg * Math.PI) / 180;

  const pos = {
    sol:        { x: cx + R * Math.cos(rad(90))  - CIRCLE / 2, y: cy - R * Math.sin(rad(90))  - CIRCLE / 2 },
    luna:       { x: cx + R * Math.cos(rad(150)) - CIRCLE / 2, y: cy - R * Math.sin(rad(150)) - CIRCLE / 2 },
    ascendente: { x: cx + R * Math.cos(rad(30))  - CIRCLE / 2, y: cy - R * Math.sin(rad(30))  - CIRCLE / 2 },
    center:     { x: cx - CENTER / 2,                           y: cy - CENTER / 2 },
  };

  const containerW = Math.round(cx + R * Math.cos(rad(30)) + CIRCLE / 2 + 14);
  const containerH = Math.round(cy + CENTER / 2 + 62);

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

          {loading && <SpinnerTurquesa />}

          {!loading && (
            /* Card principal con fondo espacial */
            <Box
              w="100%" maxW="900px"
              position="relative" overflow="hidden"
              border={`1.5px solid ${astrologiaTxt}28`}
              borderRadius="3xl"
              px={{ base: 6, md: 10 }}
              pt={{ base: 8, md: 10 }}
              pb={{ base: 10, md: 12 }}
              boxShadow={`0 4px 24px rgba(0,0,0,0.5), 0 0 48px ${astrologiaTxt}14`}
            >
              {/* Fondo espacial de la card */}
              <SpaceBg />

              {/* Contenido relativo */}
              <Box position="relative" zIndex={1}>
                <Flex justify="center" align="center" gap={2.5} mb={{ base: 8, md: 10 }}>
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

                {/* ── Media luna ── */}
                <Flex justify="center" mb={3} overflowX="auto">
                  <Box
                    position="relative"
                    style={{ width: containerW, height: containerH, minWidth: containerW }}
                    flexShrink={0}
                  >
                    <svg
                      style={{ position: "absolute", top: 0, left: 0, overflow: "visible", pointerEvents: "none" }}
                      width={containerW} height={containerH}
                    >
                      <path
                        d={`M ${pos.luna.x + CIRCLE / 2} ${pos.luna.y + CIRCLE / 2}
                            A ${R} ${R} 0 0 1 ${pos.ascendente.x + CIRCLE / 2} ${pos.ascendente.y + CIRCLE / 2}`}
                        fill="none" stroke={`${astrologiaTxt}22`} strokeWidth="1.5" strokeDasharray="5 8"
                      />
                      {(["sol", "luna", "ascendente"] as const).map((k) => (
                        <line
                          key={k}
                          x1={pos[k].x + CIRCLE / 2} y1={pos[k].y + CIRCLE / 2}
                          x2={cx} y2={cy}
                          stroke={`${astrologiaTxt}16`} strokeWidth="1" strokeDasharray="3 6"
                        />
                      ))}
                    </svg>

                    <Box position="absolute" style={{ left: pos.sol.x, top: pos.sol.y }}>
                      <ZodiacCircle field="sol" sign={data?.sol ?? null} onClick={() => setOpenModal("sol")} size={CIRCLE} />
                    </Box>
                    <Box position="absolute" style={{ left: pos.luna.x, top: pos.luna.y }}>
                      <ZodiacCircle field="luna" sign={data?.luna ?? null} onClick={() => setOpenModal("luna")} size={CIRCLE} />
                    </Box>
                    <Box position="absolute" style={{ left: pos.ascendente.x, top: pos.ascendente.y }}>
                      <ZodiacCircle field="ascendente" sign={data?.ascendente ?? null} onClick={() => setOpenModal("ascendente")} size={CIRCLE} />
                    </Box>
                    <Box position="absolute" style={{ left: pos.center.x, top: pos.center.y }}>
                      <ProfileCircle imgUrl={imgUrl} size={CENTER} />
                    </Box>
                  </Box>
                </Flex>

                <Flex justify="center" mt={1}>
                  <Text
                    color={`${astrologiaTxt}38`} fontSize="sm"
                    fontFamily="'EB Garamond', serif" letterSpacing="0.03em"
                    textAlign="center" fontStyle="italic"
                  >
                    Pulsa en cada círculo para elegir tu signo
                  </Text>
                </Flex>
              </Box>
            </Box>
          )}
        </Flex>
      </Box>

      <Box as="footer" borderTop={`1px solid ${astrologiaTxt}14`} px={{ base: 6, md: 16 }} py={{ base: 8, md: 10 }}>
        <Text color={`${astrologiaTxt}2a`} fontSize="xs" letterSpacing="0.05em" textAlign="center">
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
        <Text
          as="a"
          href="/contacto"
          color="rgba(255,255,255,0.4)"
          fontSize="xs"
          letterSpacing="0.05em"
          display="block"
          textAlign="center"
          mt={1}
          textDecoration="underline"
          cursor="pointer"
        >
          Contactar
        </Text>
      </Box>

      {openModal && (
        <ZodiacModal
          field={openModal}
          currentSign={
            openModal === "sol"  ? (data?.sol        ?? null) :
            openModal === "luna" ? (data?.luna       ?? null) :
                                    (data?.ascendente ?? null)
          }
          onClose={() => setOpenModal(null)}
          onSelect={handleSelect}
          onClear={handleClear}
        />
      )}
    </Box>
  );
}
