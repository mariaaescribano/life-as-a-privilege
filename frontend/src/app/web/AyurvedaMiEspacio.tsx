import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import SpinnerTurquesa from "../../components/global/Spinner";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyurvedaIcon, ayurvedaBg, ayurvedaTxt, API_URL, VataIcon, PittaIcon, KaphaIcon, vataColor, pittaColor, kaphaColor } from "../../GlobalVariables";
import { generateAyurvedaPdf, type AyurvedaRespuesta } from "../../utils/generateAyurvedaPdf";
import AyurvedaTestPage from "../../components/espacio/components/AyurvedaTestPage";

/* ──────────────────────────────────────────────
   COLORES
────────────────────────────────────────────── */
const CARD_BG    = ayurvedaBg;
const ACCENT     = ayurvedaTxt;
const VATA_COLOR  = vataColor;
const PITTA_COLOR = pittaColor;
const KAPHA_COLOR = kaphaColor;

/* ──────────────────────────────────────────────
   TIPOS
────────────────────────────────────────────── */
type Dosha = "vata" | "pitta" | "kapha";

type BackendResultado = {
  dosha: string;
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
  fecha: string;
};


/* ──────────────────────────────────────────────
   DESCRIPCIONES DE DOSHA
────────────────────────────────────────────── */
type DoshaInfo = {
  nombre: string;
  color: string;
  subtitulo: string;
  descripcion: string;
  icon: (size?: string) => React.ReactNode;
  consejos: { titulo: string; texto: string }[];
};

const DOSHA_INFO: Record<Dosha, DoshaInfo> = {
  vata: {
    nombre: "Vata",
    color: VATA_COLOR,
    subtitulo: "Aire y Éter · Movimiento y Creatividad",
    descripcion:
      "Vata es la energía del movimiento: ligera, rápida, creativa e intuitiva. Las personas con predominancia Vata son entusiastas, imaginativas y aprenden con rapidez, aunque también tienden a la dispersión, la ansiedad y la irregularidad en sus hábitos. Su mente viaja constantemente. Para equilibrarse, Vata necesita rutina, calor, descanso y alimentos nutritivos que anclen su energía.",
    icon: (size = "28px") => <VataIcon size={size} color={VATA_COLOR} />,
    consejos: [
      { titulo: "Alimentación", texto: "Prioriza alimentos calientes, oleosos y nutritivos. Sopas, guisos, ghee y especias cálidas como jengibre o canela son tus aliados. Evita los alimentos fríos, crudos o muy ligeros." },
      { titulo: "Rutina y descanso", texto: "Establece horarios fijos para comer, dormir y despertar. La regularidad calma tu naturaleza dispersa. Duerme al menos 7 horas y evita el exceso de estimulación nocturna." },
      { titulo: "Movimiento", texto: "Opta por ejercicios que te hagan enraizarte: yoga, entrenamiento de fuerza, artes marciales. Evita el ejercicio extenuante o irregular, que agota tu energía." },
      { titulo: "Mente y emociones", texto: "Practica la meditación y la respiración profunda para calmar el exceso mental." },
    ],
  },
  pitta: {
    nombre: "Pitta",
    color: PITTA_COLOR,
    subtitulo: "Fuego y Agua · Transformación y Determinación",
    descripcion:
      "Pitta es la energía de la transformación: intensa, decidida, apasionada y precisa. Las personas Pitta son líderes naturales con gran capacidad de ejecución, pero pueden caer en la irritabilidad, el perfeccionismo y el exceso de calor interno. Su mayor fortaleza es también su mayor reto: la intensidad. Para equilibrarse, Pitta necesita frescor, moderación, actividades que relajen la mente y un entorno sin demasiada competencia.",
    icon: (size = "28px") => <PittaIcon size={size} color={PITTA_COLOR} />,
    consejos: [
      { titulo: "Alimentación", texto: "Elige alimentos frescos y de sabor suave. Frutas dulces, verduras de hoja verde y refrescantes. Reduce el picante, el alcohol, los alimentos muy salados o ácidos." },
      { titulo: "Temperatura y entorno", texto: "Evita el calor excesivo: sol directo, saunas o ejercicio intenso a mediodía. Busca entornos frescos, naturales y tranquilos para recuperar el equilibrio." },
      { titulo: "Movimiento", texto: "El deporte moderado y no competitivo es ideal: natación, ciclismo suave, senderismo. Evita entrenar en exceso o convertir el ejercicio en una batalla contigo mismo." },
      { titulo: "Mente y emociones", texto: "Aprende a soltar el control y la perfección. La meditación compasiva, el contacto con la naturaleza y las actividades lúdicas sin objetivo te ayudan a enfriar el fuego interior." },
    ],
  },
  kapha: {
    nombre: "Kapha",
    color: KAPHA_COLOR,
    subtitulo: "Tierra y Agua · Estabilidad y Amor",
    descripcion:
      "Kapha es la energía de la estructura: estable, resistente, leal y profundamente afectuosa. Las personas Kapha son constantes, pacientes y tienen una memoria excelente. Su sombra es la tendencia al apego, la lentitud y la resistencia al cambio. Para equilibrarse, Kapha necesita movimiento, estimulación, nuevos retos y una dieta ligera que avive su fuego interno.",
    icon: (size = "28px") => <KaphaIcon size={size} color={KAPHA_COLOR} />,
    consejos: [
      { titulo: "Alimentación", texto: "Prioriza alimentos ligeros, poco calóricos y con especias estimulantes: jengibre, pimienta negra, cúrcuma, mostaza. Reduce los lácteos, los dulces, los fritos y los alimentos pesados o muy oleosos." },
      { titulo: "Movimiento", texto: "El movimiento vigoroso y constante es esencial para ti: correr, bailar, deportes de equipo. Muévete cada día aunque no tengas ganas — tu cuerpo lo necesita más que ningún otro dosha." },
      { titulo: "Estimulación mental", texto: "Busca nuevas experiencias, viajes, cursos o proyectos que saquen a Kapha de su zona de confort. El aburrimiento y la monotonía son tus mayores enemigos." },
      { titulo: "Mente y emociones", texto: "Trabaja el desapego gradual de objetos, hábitos y relaciones que ya no te nutren. La generosidad activa y el voluntariado canalizan muy bien tu energía amorosa y transformadora, pero no olvides de sostenerte a ti mismo primero." },
    ],
  },
};

/* ──────────────────────────────────────────────
   PANEL DE RESULTADO GUARDADO
────────────────────────────────────────────── */
function ResultadoPanel({
  resultado,
  onDelete,
  onDownloadPdf,
  loadingDelete,
}: {
  resultado: BackendResultado;
  onDelete: () => void;
  onDownloadPdf: () => void;
  loadingDelete: boolean;
}) {
  const winner = resultado.dosha.toLowerCase() as Dosha;
  const info   = DOSHA_INFO[winner] ?? DOSHA_INFO.vata;
  const total  = resultado.vata_score + resultado.pitta_score + resultado.kapha_score;
  const scores: Record<Dosha, number> = {
    vata:  resultado.vata_score,
    pitta: resultado.pitta_score,
    kapha: resultado.kapha_score,
  };

  return (
    <Flex
      direction="column"
      alignItems="center"
      gap={5}
      px={{ base: 4, md: 10, lg: 16 }}
      pt={{ base: 10, md: 14 }}
      pb={{ base: 14, md: 20 }}
    >
      {/* Cabecera */}
      <Box
        w="100%"
        maxW="700px"
        bg={CARD_BG}
        borderRadius="2xl"
        px={{ base: 6, md: 10 }}
        py={{ base: 5, md: 7 }}
        boxShadow={`0 8px 36px ${ACCENT}55`}
      >
        <Flex align="center" justify="center" gap={4}>
          <Box
            borderRadius="full"
            w={{ base: "52px", md: "64px" }}
            h={{ base: "52px", md: "64px" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            border={`3px solid ${ACCENT}`}
            boxShadow={`0 0 20px ${ACCENT}88`}
          >
            <AyurvedaIcon size={{ base: "28px", md: "36px" }} />
          </Box>
          <Text color={ACCENT} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700">
            Tu Dosha
          </Text>
        </Flex>
      </Box>

      {/* Resultado principal */}
      <Box
        w="100%"
        maxW="700px"
        bg={CARD_BG}
        borderRadius="2xl"
        px={{ base: 6, md: 10 }}
        py={{ base: 7, md: 9 }}
        boxShadow={`0 8px 36px ${info.color}55, 0 0 22px ${info.color}33`}
        border={`1.5px solid ${info.color}55`}
        textAlign="center"
      >
        <Flex justify="center" mb={4}>
          <Box
            borderRadius="full"
            w={{ base: "64px", md: "76px" }}
            h={{ base: "64px", md: "76px" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={info.color + "18"}
            border={`2px solid ${info.color}`}
            boxShadow={`0 0 24px ${info.color}88, 0 0 8px ${info.color}55`}
          >
            {info.icon("32px")}
          </Box>
        </Flex>
        <Text color={info.color} fontSize={{ base: "4xl", md: "5xl" }} fontWeight="700" letterSpacing="0.06em">
          {info.nombre}
        </Text>
        <Text color={info.color} fontSize={{ base: "sm", md: "md" }} opacity={0.75} mb={5}>
          {info.subtitulo}
        </Text>
        <Text color={info.color} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" textAlign="left">
          {info.descripcion}
        </Text>
      </Box>

      {/* Consejos */}
      <Box
        w="100%"
        maxW="700px"
        bg={CARD_BG}
        borderRadius="2xl"
        px={{ base: 5, md: 8 }}
        py={{ base: 6, md: 8 }}
        boxShadow={`0 4px 20px ${info.color}33, 0 0 16px ${info.color}22`}
        border={`1px solid ${info.color}33`}
      >
        <Flex align="center" justify="center" gap={3} mb={5}>
          <Box flexShrink={0}>{info.icon("24px")}</Box>
          <Text color={info.color} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.06em">
            Consejos para tu Prakriti ~ Constitución
          </Text>
        </Flex>
        <Flex direction="column" gap={4}>
          {info.consejos.map((c, i) => (
            <Box key={i} p={{ base: 4, md: 5 }} borderRadius="xl" bg={info.color + "0e"} border={`1px solid ${info.color}30`} borderLeft={`3px solid ${info.color}`}>
              <Text color={info.color} fontSize={{ base: "md", md: "lg" }} fontWeight="700" mb={1}>{c.titulo}</Text>
              <Text color={info.color} fontSize={{ base: "sm", md: "md" }} lineHeight="1.85">{c.texto}</Text>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Barras */}
      <Box
        w="100%"
        maxW="700px"
        bg={CARD_BG}
        borderRadius="2xl"
        px={{ base: 5, md: 8 }}
        py={{ base: 5, md: 7 }}
        boxShadow={`0 4px 20px ${ACCENT}33`}
      >
        <Flex align="center" justify="center" gap={3} mb={5}>
          <Box flexShrink={0}>{info.icon("24px")}</Box>
          <Text color={ACCENT} fontSize={{ base: "lg", md: "xl" }} fontWeight="600">
            Distribución de tu Prakriti ~ Constitución
          </Text>
        </Flex>
        <Flex direction="column" gap={4}>
          {(["vata", "pitta", "kapha"] as Dosha[]).map((dosha) => {
            const isWinner = dosha === winner;
            const pct = total > 0 ? Math.round((scores[dosha] / total) * 100) : 0;
            const color = DOSHA_INFO[dosha].color;
            return (
              <Box key={dosha}>
                <Flex justify="space-between" mb={1.5}>
                  <Flex align="center" gap={2}>
                    <Text
                      color={isWinner ? color : ACCENT + "99"}
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight={isWinner ? "700" : "400"}
                    >
                      {DOSHA_INFO[dosha].nombre}
                    </Text>
                    {isWinner && (
                      <Box bg={color + "22"} border={`1px solid ${color}55`} borderRadius="full" px={2} py={0.5}>
                        <Text color={color} fontSize="10px" fontWeight="700" letterSpacing="0.14em" textTransform="uppercase">
                          Predominante
                        </Text>
                      </Box>
                    )}
                  </Flex>
                  <Text color={isWinner ? color : ACCENT + "88"} fontSize={{ base: "md", md: "lg" }} fontWeight="700">
                    {scores[dosha]}
                    <Text as="span" fontSize="sm" fontWeight="400" opacity={0.5}> / {total}</Text>
                  </Text>
                </Flex>
                <Box w="100%" h="7px" borderRadius="full" bg={ACCENT + "18"}>
                  <Box
                    h="100%"
                    borderRadius="full"
                    bg={isWinner ? color : color + "55"}
                    boxShadow={isWinner ? `0 0 8px ${color}66` : "none"}
                    w={`${pct}%`}
                    transition="width 1s ease"
                  />
                </Box>
              </Box>
            );
          })}
        </Flex>
      </Box>

      {/* Botones */}
      <Flex gap={4} flexWrap="wrap" justify="center" w="100%" maxW="700px">
        <Box
          as="button"
          onClick={onDownloadPdf}
          px={7}
          py={3}
          borderRadius="full"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="600"
          letterSpacing="0.06em"
          border={`2px solid ${ACCENT}`}
          bg={CARD_BG}
          color={ACCENT}
          cursor="pointer"
          transition="all 0.22s"
          boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
          _hover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.22), 0 0 30px rgba(107,196,200,1)", transform: "translateY(-1px)" }}
        >
          Descargar PDF
        </Box>
        <Box
          as="button"
          onClick={loadingDelete ? undefined : onDelete}
          px={7}
          py={3}
          borderRadius="full"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="600"
          letterSpacing="0.06em"
          border="2px solid rgba(200,80,80,0.7)"
          bg={CARD_BG}
          color="rgba(180,50,50,0.9)"
          cursor={loadingDelete ? "not-allowed" : "pointer"}
          opacity={loadingDelete ? 0.6 : 1}
          transition="all 0.22s"
          boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
          _hover={{ boxShadow: "0 0 18px rgba(200,80,80,0.35)", transform: "translateY(-1px)" }}
        >
          {loadingDelete ? "Borrando..." : "Borrar y repetir el test"}
        </Box>
      </Flex>
    </Flex>
  );
}

/* ──────────────────────────────────────────────
   COMPONENTE PRINCIPAL
────────────────────────────────────────────── */
export default function AyurvedaMiEspacio() {
  const userId = sessionStorage.getItem("userId");

  const [loadingInit, setLoadingInit]         = useState(true);
  const [savedResult, setSavedResult]         = useState<BackendResultado | null>(null);
  const [savedRespuestas, setSavedRespuestas] = useState<AyurvedaRespuesta[]>([]);
  const [loadingDelete, setLoadingDelete]     = useState(false);

  /* ── Cargar resultado al montar ── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (!userId) { setLoadingInit(false); return; }

    axios.get(`${API_URL}/ayurveda/${userId}`)
      .then(async (res) => {
        if (res.data) {
          setSavedResult(res.data);
          const respRes = await axios.get(`${API_URL}/ayurveda/respuestas/${userId}`);
          setSavedRespuestas(respRes.data ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingInit(false));
  }, []);

  /* ── Borrar resultado ── */
  const handleDelete = async () => {
    if (!userId) return;
    setLoadingDelete(true);
    try {
      await axios.delete(`${API_URL}/ayurveda/${userId}`);
      setSavedResult(null);
      setSavedRespuestas([]);
    } catch (e) {
      console.error("Error borrando resultado ayurveda:", e);
    } finally {
      setLoadingDelete(false);
    }
  };

  /* ── PDF ── */
  const handleDownloadPdf = () => {
    if (!savedResult) return;
    generateAyurvedaPdf(savedRespuestas, savedResult.dosha, {
      vata:  savedResult.vata_score,
      pitta: savedResult.pitta_score,
      kapha: savedResult.kapha_score,
    });
  };

  /* ──────────────────────────────────────────────
     RENDER
  ────────────────────────────────────────────── */
  if (loadingInit) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="private" />
        <Flex flex="1" justify="center" align="center" minH="60vh">
          <SpinnerTurquesa fullScreen={false} />
        </Flex>
        <SiteFooter />
      </Box>
    );
  }

  if (!savedResult) {
    return <AyurvedaTestPage onComplete={async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return;
      const res = await axios.get(`${API_URL}/ayurveda/${userId}`);
      if (res.data) {
        setSavedResult(res.data);
        const respRes = await axios.get(`${API_URL}/ayurveda/respuestas/${userId}`);
        setSavedRespuestas(respRes.data ?? []);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }} />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Box flex="1">
        <ResultadoPanel
          resultado={savedResult}
          onDelete={handleDelete}
          onDownloadPdf={handleDownloadPdf}
          loadingDelete={loadingDelete}
        />
      </Box>
      <SiteFooter />
    </Box>
  );
}
