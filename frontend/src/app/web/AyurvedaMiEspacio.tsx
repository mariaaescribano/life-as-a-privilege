import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyurvedaIcon, ayurvedaBg, ayurvedaTxt, API_URL } from "../../GlobalVariables";
import { generateAyurvedaPdf, type AyurvedaRespuesta } from "../../utils/generateAyurvedaPdf";

/* ──────────────────────────────────────────────
   COLORES
────────────────────────────────────────────── */
const PAGE_BG    = "#2d1030";
const CARD_BG    = ayurvedaBg;    // "#ecd5ed"
const ACCENT     = ayurvedaTxt;   // "#672d67"
const VATA_COLOR  = "#7c5cbf";
const PITTA_COLOR = "#c0522a";
const KAPHA_COLOR = "#3a8a5c";

/* ──────────────────────────────────────────────
   TIPOS
────────────────────────────────────────────── */
type Dosha = "vata" | "pitta" | "kapha";

type Pregunta = {
  texto: string;
  opciones: [string, string, string]; // [vata, pitta, kapha]
};

type BackendResultado = {
  dosha: string;
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
  fecha: string;
};

/* ──────────────────────────────────────────────
   PREGUNTAS
────────────────────────────────────────────── */
const PREGUNTAS: Pregunta[] = [
  {
    texto: "¿Cómo es tu complexión corporal?",
    opciones: ["Pequeña y delgada", "Mediana y proporcionada", "Grande y robusta"],
  },
  {
    texto: "¿Cómo andas de peso habitualmente?",
    opciones: [
      "Soy delgado/a o muy delgado/a",
      "Suelo estar en mi peso, aunque lo pierdo o gano con facilidad",
      "Me sobran algunos kilos y me cuesta perder peso",
    ],
  },
  {
    texto: "¿Dónde tiendes a acumular grasa?",
    opciones: [
      "No suelo acumularla",
      "Se distribuye por todo el cuerpo",
      "Se concentra en caderas y muslos",
    ],
  },
  {
    texto: "En comparación con personas de tu misma estatura...",
    opciones: [
      "Mis huesos son pequeños y finos",
      "Mis huesos tienen un tamaño promedio",
      "Mis huesos son más grandes de lo habitual",
    ],
  },
  {
    texto: "¿Cómo tienes los músculos?",
    opciones: [
      "Fibrosos pero poco desarrollados",
      "Bastante desarrollados y firmes",
      "Voluminosos pero algo fofos",
    ],
  },
  {
    texto: "Por lo general, tus venas son...",
    opciones: [
      "Muy prominentes y visibles",
      "Algunas visibles, otras no tanto",
      "Prácticamente invisibles",
    ],
  },
  {
    texto: "¿Cuánto te mueves a lo largo del día?",
    opciones: [
      "Vivo en movimiento constante, no paro",
      "Me muevo con moderación y hago ejercicio",
      "Soy bastante sedentario/a",
    ],
  },
  {
    texto: "¿Sudas con frecuencia?",
    opciones: [
      "Sudo muy poco o casi nada",
      "Sudo bastante y con un olor intenso",
      "Sudo de vez en cuando, con un olor suave",
    ],
  },
  {
    texto: "¿Qué tipo de clima prefieres?",
    opciones: [
      "El calor; el frío y la sequedad me molestan",
      "Los climas frescos o fríos",
      "Ninguno extremo; ni el frío ni la humedad me sientan bien",
    ],
  },
  {
    texto: "¿Cómo describirías tu piel?",
    opciones: [
      "Seca, fría, fina y a veces áspera",
      "Cálida, suave, ligeramente grasa y de tono rosado",
      "Fresca, tersa y bastante pálida",
    ],
  },
  {
    texto: "¿Cuál describe mejor tu cabello?",
    opciones: [
      "Seco, quebradizo, enredado y oscuro",
      "Liso, algo graso, claro y con tendencia a caer",
      "Grueso, semiondulado y con tendencia a la grasa",
    ],
  },
  {
    texto: "¿Cómo describirías la forma de tu cara?",
    opciones: [
      "Afilada y angulosa",
      "Proporcionada, con rasgos marcados",
      "Redondeada y algo carnosa",
    ],
  },
  {
    texto: "¿Cómo son tus ojos?",
    opciones: [
      "Pequeños, inquietos y algo hundidos",
      "Brillantes, vivaces y con tendencia a irritarse",
      "Grandes, tranquilos y afectuosos",
    ],
  },
  {
    texto: "¿Cómo son tus mejillas?",
    opciones: [
      "Algo hundidas o con arrugas tempranas",
      "Planas y tersas",
      "Redondeadas y carnosas",
    ],
  },
  {
    texto: "¿Cómo es tu nariz?",
    opciones: [
      "Irregular, curiosa o ligeramente torcida",
      "Recta, puntiaguda y a veces enrojecida",
      "Chata, redondeada y algo ancha",
    ],
  },
  {
    texto: "¿Cómo son tus labios?",
    opciones: [
      "Finos, secos y con tendencia a partirse",
      "De tamaño medio y color rojizo",
      "Carnosos, suaves y grasos",
    ],
  },
  {
    texto: "¿Cómo son tus dientes?",
    opciones: [
      "Pequeños, separados, con encías delicadas",
      "Medianos, amarillentos, con encías sensibles",
      "Grandes y blancos, con encías gruesas",
    ],
  },
  {
    texto: "¿Cómo describirías tu barbilla?",
    opciones: ["Angular y afilada", "Prominente y definida", "Redondeada y suave"],
  },
  {
    texto: "¿Cómo es tu cuello?",
    opciones: [
      "Largo y delgado",
      "Ni corto ni largo, proporcionado",
      "Grueso o con algún pliegue",
    ],
  },
  {
    texto: "¿Cómo describirías tu pecho?",
    opciones: [
      "Estrecho y algo hundido",
      "Normal y bien proporcionado",
      "Ancho y voluminoso",
    ],
  },
  {
    texto: "¿Cómo describirías tu abdomen?",
    opciones: [
      "Plano o ligeramente hundido",
      "Con algo de barriga",
      "Prominente o barrigón",
    ],
  },
  {
    texto: "¿Cómo es tu ombligo?",
    opciones: [
      "Pequeño e irregular",
      "Ovalado y poco profundo",
      "Redondo, estirado y muy profundo",
    ],
  },
  {
    texto: "¿Cómo son tus caderas?",
    opciones: [
      "Estrechas y estilizadas",
      "Proporcionadas, ni anchas ni estrechas",
      "Anchas y prominentes",
    ],
  },
  {
    texto: "¿Cómo tienes las uñas?",
    opciones: [
      "Secas, ásperas y quebradizas",
      "Flexibles, finas y rosadas",
      "Gruesas, lisas y resistentes",
    ],
  },
  {
    texto: "¿Con qué frecuencia sientes sed?",
    opciones: [
      "De manera variable, pocas veces",
      "Casi siempre tengo mucha sed",
      "Casi nunca, aunque procuro hidratarme",
    ],
  },
  {
    texto: "¿Cómo es tu apetito?",
    opciones: [
      "Irregular, a veces mucho y a veces muy poco",
      "Muy bueno, casi insaciable",
      "Moderado, aunque pico entre horas",
    ],
  },
  {
    texto: "¿Cómo calificarías tu deseo sexual?",
    opciones: [
      "Variable, puede ser mucho o prácticamente nada",
      "Constante e intenso, a veces excesivo",
      "Progresivo, necesito tiempo para despertar",
    ],
  },
  {
    texto: "¿A qué temperatura prefieres la comida?",
    opciones: ["Bien caliente", "Templada o fresca", "Me es indiferente"],
  },
  {
    texto: "¿Qué tal te funciona la digestión?",
    opciones: [
      "Irregular, con tendencia a los gases",
      "Generalmente bien, aunque con acidez ocasional",
      "Lenta y pesada",
    ],
  },
  {
    texto: "¿Cómo son tus deposiciones habitualmente?",
    opciones: [
      "Irregulares: a veces duras, a veces blandas, con tendencia al estreñimiento",
      "Sueltas o blandas con facilidad",
      "Voluminosas, ni muy secas ni líquidas",
    ],
  },
  {
    texto: "¿Qué te molesta más de los estímulos sensoriales?",
    opciones: [
      "El exceso de ruido",
      "El exceso de luz o el calor intenso",
      "Los malos olores",
    ],
  },
  {
    texto: "¿Cómo reaccionas ante los imprevistos?",
    opciones: [
      "Me entran dudas y a veces me quedo confuso/a",
      "Les hago frente directamente y tomo decisiones",
      "Prefiero esperar y ver cómo evoluciona la situación",
    ],
  },
  {
    texto: "¿Cómo te describirían las personas que te conocen bien?",
    opciones: [
      "Activo/a y entusiasta",
      "Independiente y apasionado/a",
      "Reflexivo/a y afectuoso/a",
    ],
  },
  {
    texto: "¿Qué valoras más de ti mismo/a?",
    opciones: [
      "Mi intuición y mi vitalidad",
      "Mi perspicacia y mi espíritu competitivo",
      "Mi resistencia y mi lealtad",
    ],
  },
  {
    texto: "En el terreno de las relaciones personales...",
    opciones: [
      "Me adapto fácilmente a todo tipo de personas",
      "Busco personas con mis mismos valores e intereses",
      "Tardo en abrirme, pero prefiero vínculos estables y duraderos",
    ],
  },
  {
    texto: "¿Eres de los que dan muchas vueltas a las cosas?",
    opciones: [
      "Mi mente no para, a veces me abruma",
      "Pienso principalmente en el trabajo y en mis objetivos",
      "Reflexiono con calma y sin prisa",
    ],
  },
  {
    texto: "¿Cómo te expresas al hablar?",
    opciones: [
      "Rápido y con tendencia a explayarme",
      "De forma concisa e ingeniosa",
      "Despacio, con calma y sin alterarme",
    ],
  },
  {
    texto: "¿Cuál de estas conductas reconoces más en ti?",
    opciones: [
      "Tiendo a ser nervioso/a y ansioso/a",
      "Me irrito con facilidad y me domina la ira",
      "Soy algo frío/a y me apego mucho a mis cosas",
    ],
  },
  {
    texto: "¿Qué palabra define mejor tu estado mental habitual?",
    opciones: ["Inquietud", "Determinación", "Calma"],
  },
  {
    texto: "¿Cuál de estas emociones negativas reconoces más en ti?",
    opciones: [
      "El miedo",
      "La rabia o el odio",
      "El apego y el deseo de acumular",
    ],
  },
  {
    texto: "¿Cómo sueles dormir?",
    opciones: [
      "Me despierto con frecuencia o tengo insomnio",
      "Duermo pocas horas pero de manera profunda",
      "Duermo mucho y profundamente; me encanta dormir",
    ],
  },
  {
    texto: "¿Qué tal es tu memoria?",
    opciones: [
      "Aprendo rápido pero olvido con facilidad",
      "Tengo una memoria bastante buena",
      "Tardo en aprender pero lo que aprendo se me graba",
    ],
  },
  {
    texto: "¿Cómo suelen ser tus sueños?",
    opciones: [
      "Fugaces, con frecuencia de miedo o de vértigo",
      "Intensos, a veces agresivos o violentos",
      "Tranquilos, a veces románticos o placenteros",
    ],
  },
  {
    texto: "¿Eres una persona de convicciones firmes?",
    opciones: [
      "En principio sí, aunque pueden cambiar",
      "Cuando creo en algo, lo defiendo hasta el final",
      "Mis convicciones son profundas y difíciles de mover",
    ],
  },
  {
    texto: "¿Qué rol desempeñas mejor en el trabajo?",
    opciones: [
      "Me destaco por la creatividad y las ideas nuevas",
      "Se me da bien liderar, ejecutar y tomar decisiones",
      "Soy bueno/a organizando, siendo constante y de confianza",
    ],
  },
  {
    texto: "¿Cómo te relacionas con el dinero?",
    opciones: [
      "Se me escapa; gasto en cualquier cosa sin pensarlo mucho",
      "Gasto lo necesario y valoro la calidad por encima del precio",
      "Prefiero ahorrar y planificar el futuro",
    ],
  },
  {
    texto: "¿Qué te interesa más en la vida?",
    opciones: [
      "Los viajes, lo espiritual y los temas esotéricos",
      "La política, el éxito y los artículos de calidad",
      "La buena comida, la naturaleza y la vida tranquila",
    ],
  },
];

/* ──────────────────────────────────────────────
   DESCRIPCIONES DE DOSHA
────────────────────────────────────────────── */
const DOSHA_INFO: Record<Dosha, { nombre: string; color: string; subtitulo: string; descripcion: string }> = {
  vata: {
    nombre: "Vata",
    color: VATA_COLOR,
    subtitulo: "Aire y Éter · Movimiento y Creatividad",
    descripcion:
      "Vata es la energía del movimiento: ligera, rápida, creativa e intuitiva. Las personas con predominancia Vata son entusiastas, imaginativas y aprenden con rapidez, aunque también tienden a la dispersión, la ansiedad y la irregularidad en sus hábitos. Su mente viaja constantemente. Para equilibrarse, Vata necesita rutina, calor, descanso y alimentos nutritivos que anclen su energía.",
  },
  pitta: {
    nombre: "Pitta",
    color: PITTA_COLOR,
    subtitulo: "Fuego y Agua · Transformación y Determinación",
    descripcion:
      "Pitta es la energía de la transformación: intensa, decidida, apasionada y precisa. Las personas Pitta son líderes naturales con gran capacidad de ejecución, pero pueden caer en la irritabilidad, el perfeccionismo y el exceso de calor interno. Su mayor fortaleza es también su mayor reto: la intensidad. Para equilibrarse, Pitta necesita frescor, moderación, actividades que relajen la mente y un entorno sin demasiada competencia.",
  },
  kapha: {
    nombre: "Kapha",
    color: KAPHA_COLOR,
    subtitulo: "Tierra y Agua · Estabilidad y Amor",
    descripcion:
      "Kapha es la energía de la estructura: estable, resistente, leal y profundamente afectuosa. Las personas Kapha son constantes, pacientes y tienen una memoria excelente. Su sombra es la tendencia al apego, la lentitud y la resistencia al cambio. Para equilibrarse, Kapha necesita movimiento, estimulación, nuevos retos y una dieta ligera que avive su fuego interno.",
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
        py={{ base: 6, md: 8 }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={3}
        boxShadow={`0 8px 36px ${ACCENT}55`}
      >
        <Box
          borderRadius="full"
          w={{ base: "64px", md: "80px" }}
          h={{ base: "64px", md: "80px" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          border={`3px solid ${ACCENT}`}
          boxShadow={`0 0 20px ${ACCENT}88`}
        >
          <AyurvedaIcon size={{ base: "36px", md: "46px" }} />
        </Box>
        <Text color={ACCENT} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center">
          Tu Dosha
        </Text>
        <Text color={ACCENT} fontSize="sm" opacity={0.65} textAlign="center">
          Test realizado el {resultado.fecha}
        </Text>
      </Box>

      {/* Resultado principal */}
      <Box
        w="100%"
        maxW="700px"
        bg={CARD_BG}
        borderRadius="2xl"
        px={{ base: 6, md: 10 }}
        py={{ base: 7, md: 9 }}
        boxShadow={`0 8px 36px ${info.color}44`}
        border={`1.5px solid ${info.color}55`}
        textAlign="center"
      >
        <Text color={info.color} fontSize={{ base: "4xl", md: "5xl" }} fontWeight="700" letterSpacing="0.06em">
          {info.nombre}
        </Text>
        <Text color={info.color} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.75} mb={5}>
          {info.subtitulo}
        </Text>
        <Text color={ACCENT} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" textAlign="left">
          {info.descripcion}
        </Text>
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
        <Text color={ACCENT} fontSize={{ base: "lg", md: "xl" }} fontWeight="600" mb={5} textAlign="center">
          Distribución de tu Prakriti
        </Text>
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
          border={`1.5px solid ${ACCENT}55`}
          bg="transparent"
          color={ACCENT}
          cursor="pointer"
          transition="all 0.22s"
          _hover={{ borderColor: ACCENT, boxShadow: `0 0 14px ${ACCENT}33` }}
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
          border="1.5px solid rgba(200,80,80,0.45)"
          bg="transparent"
          color="rgba(200,80,80,0.8)"
          cursor={loadingDelete ? "not-allowed" : "pointer"}
          opacity={loadingDelete ? 0.6 : 1}
          transition="all 0.22s"
          _hover={{ borderColor: "rgba(200,80,80,0.8)", boxShadow: "0 0 14px rgba(200,80,80,0.2)" }}
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

  const [answers, setAnswers]         = useState<(Dosha | null)[]>(Array(PREGUNTAS.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving]           = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (idx: number, dosha: Dosha) => {
    setAnswers((prev) => { const next = [...prev]; next[idx] = dosha; return next; });
  };

  const totalAnswered = answers.filter((a) => a !== null).length;
  const allAnswered   = totalAnswered === PREGUNTAS.length;

  const counts: Record<Dosha, number> = { vata: 0, pitta: 0, kapha: 0 };
  answers.forEach((a) => { if (a) counts[a]++; });
  const maxCount = Math.max(counts.vata, counts.pitta, counts.kapha);
  const winner: Dosha | null = maxCount === 0
    ? null
    : (["vata", "pitta", "kapha"] as Dosha[]).find((d) => counts[d] === maxCount) ?? null;

  /* ── Guardar y mostrar resultados ── */
  const handleShowResults = async () => {
    if (!winner) return;
    setShowResults(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);

    if (!userId) return;
    setSaving(true);
    try {
      const respuestas = PREGUNTAS.map((p, idx) => ({
        preguntaIdx: idx,
        pregunta: p.texto,
        doshaElegida: answers[idx] ?? "vata",
      }));
      await axios.post(`${API_URL}/ayurveda/resultado`, {
        userId,
        dosha: winner,
        vataScore: counts.vata,
        pittaScore: counts.pitta,
        kaphaScore: counts.kapha,
        respuestas,
      });
      const res = await axios.get(`${API_URL}/ayurveda/${userId}`);
      setSavedResult(res.data);
      const respRes = await axios.get(`${API_URL}/ayurveda/respuestas/${userId}`);
      setSavedRespuestas(respRes.data ?? []);
    } catch (e) {
      console.error("Error guardando resultado ayurveda:", e);
    } finally {
      setSaving(false);
    }
  };

  /* ── Borrar resultado ── */
  const handleDelete = async () => {
    if (!userId) return;
    setLoadingDelete(true);
    try {
      await axios.delete(`${API_URL}/ayurveda/${userId}`);
      setSavedResult(null);
      setSavedRespuestas([]);
      setAnswers(Array(PREGUNTAS.length).fill(null));
      setShowResults(false);
    } catch (e) {
      console.error("Error borrando resultado ayurveda:", e);
    } finally {
      setLoadingDelete(false);
    }
  };

  /* ── PDF ── */
  const handleDownloadPdf = () => {
    const result = savedResult ?? (winner ? {
      dosha: winner,
      vata_score: counts.vata,
      pitta_score: counts.pitta,
      kapha_score: counts.kapha,
      fecha: new Date().toISOString().split("T")[0],
    } : null);
    if (!result) return;

    const respuestasPdf: AyurvedaRespuesta[] = savedRespuestas.length > 0
      ? savedRespuestas
      : PREGUNTAS.map((p, idx) => ({
          pregunta_idx: idx,
          pregunta: p.texto,
          dosha_elegida: (answers[idx] ?? "vata") as "vata" | "pitta" | "kapha",
        }));

    generateAyurvedaPdf(respuestasPdf, result.dosha, {
      vata:  result.vata_score,
      pitta: result.pitta_score,
      kapha: result.kapha_score,
    });
  };

  const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";

  /* ──────────────────────────────────────────────
     RENDER
  ────────────────────────────────────────────── */
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="public" />

      <Box flex="1">
        {loadingInit ? (
          <Flex justify="center" align="center" minH="60vh">
            <Text color={ACCENT} fontSize="xl" letterSpacing="0.06em" opacity={0.7}>Cargando...</Text>
          </Flex>

        ) : savedResult ? (
          <ResultadoPanel
            resultado={savedResult}
            onDelete={handleDelete}
            onDownloadPdf={handleDownloadPdf}
            loadingDelete={loadingDelete}
          />

        ) : (
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
              maxW="820px"
              bg={CARD_BG}
              borderRadius="2xl"
              boxShadow={GLOW}
              px={{ base: 6, md: 10 }}
              py={{ base: 7, md: 9 }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={4}
            >
              <Box
                borderRadius="full"
                w={{ base: "72px", md: "88px" }}
                h={{ base: "72px", md: "88px" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border={`3px solid ${ACCENT}`}
                boxShadow={`0 0 20px ${ACCENT}88`}
              >
                <AyurvedaIcon size={{ base: "40px", md: "52px" }} />
              </Box>
              <Text color={ACCENT} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.08em" textAlign="center">
                Descubre tu Dosha
              </Text>
              <Text color={ACCENT} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" textAlign="center" opacity={0.8}>
                En Ayurveda, cada persona tiene una constitución única llamada <em>Prakriti</em>.
                Responde con sinceridad según cómo eres en general, no según cómo te gustaría ser.
                Al final descubrirás cuál de los tres doshas —{" "}
                <strong>Vata</strong>, <strong>Pitta</strong> o <strong>Kapha</strong> — predomina en tu naturaleza.
              </Text>
            </Box>

            {/* Preguntas */}
            {PREGUNTAS.map((pregunta, idx) => {
              const DOSHAS: Dosha[] = ["vata", "pitta", "kapha"];
              const COLORS = { vata: VATA_COLOR, pitta: PITTA_COLOR, kapha: KAPHA_COLOR };
              return (
                <Box
                  key={idx}
                  w="100%"
                  maxW="820px"
                  bg={CARD_BG}
                  borderRadius="2xl"
                  px={{ base: 5, md: 8 }}
                  py={{ base: 5, md: 7 }}
                  boxShadow={GLOW}
                  border={`1px solid ${answers[idx] ? COLORS[answers[idx]!] + "55" : ACCENT + "22"}`}
                  transition="box-shadow 0.3s, border-color 0.3s"
                >
                  <Text color={ACCENT} fontSize={{ base: "lg", md: "xl" }} fontWeight="600" lineHeight="1.7" mb={4}>
                    <Box as="span" opacity={0.5} mr={2}>{idx + 1}.</Box>
                    {pregunta.texto}
                  </Text>
                  <Flex direction="column" gap={2}>
                    {pregunta.opciones.map((opcion, oi) => {
                      const dosha = DOSHAS[oi];
                      const selected = answers[idx] === dosha;
                      const color = COLORS[dosha];
                      return (
                        <Box
                          key={oi}
                          as="button"
                          onClick={() => handleSelect(idx, dosha)}
                          w="100%"
                          textAlign="left"
                          px={{ base: 4, md: 5 }}
                          py={{ base: 3, md: 3.5 }}
                          borderRadius="xl"
                          border={`1.5px solid ${selected ? color : ACCENT + "30"}`}
                          bg={selected ? color + "18" : "rgba(255,255,255,0.35)"}
                          color={selected ? color : ACCENT}
                          fontFamily="'EB Garamond', serif"
                          fontSize={{ base: "md", md: "lg" }}
                          fontWeight={selected ? "600" : "400"}
                          cursor="pointer"
                          transition="all 0.18s"
                          boxShadow={selected ? `0 0 12px ${color}33` : "none"}
                          _hover={{ borderColor: color, bg: color + "12", color: color }}
                          display="flex"
                          alignItems="center"
                          gap={3}
                        >
                          <Box
                            flexShrink={0}
                            w="18px"
                            h="18px"
                            borderRadius="full"
                            border={`2px solid ${selected ? color : ACCENT + "50"}`}
                            bg={selected ? color : "transparent"}
                            transition="all 0.18s"
                          />
                          {opcion}
                        </Box>
                      );
                    })}
                  </Flex>
                </Box>
              );
            })}

            {/* Botón ver resultados */}
            <Box w="100%" maxW="820px" textAlign="center" mt={4}>
              {!allAnswered && (
                <Text color={`${ACCENT}88`} fontSize="md" fontStyle="italic" mb={4}>
                  Responde todas las preguntas para ver tu dosha ({totalAnswered} / {PREGUNTAS.length})
                </Text>
              )}
              <Box
                as="button"
                onClick={allAnswered && !saving ? handleShowResults : undefined}
                px={{ base: 10, md: 14 }}
                py={{ base: 4, md: 5 }}
                borderRadius="full"
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                letterSpacing="0.1em"
                fontStyle="italic"
                border={`2px solid ${allAnswered ? ACCENT : ACCENT + "30"}`}
                bg={allAnswered ? ACCENT : "transparent"}
                color={allAnswered ? CARD_BG : ACCENT + "50"}
                cursor={allAnswered && !saving ? "pointer" : "not-allowed"}
                transition="all 0.28s"
                boxShadow={allAnswered ? `0 0 40px ${ACCENT}66, 0 4px 24px rgba(0,0,0,0.3)` : "none"}
                _hover={allAnswered ? {
                  bg: CARD_BG,
                  color: ACCENT,
                  borderColor: CARD_BG,
                  transform: "translateY(-2px) scale(1.02)",
                } : {}}
              >
                {saving ? "Guardando..." : "Descubrir mi dosha"}
              </Box>
            </Box>

            {/* Resultados inline */}
            {showResults && winner && (
              <Box ref={resultsRef} w="100%" maxW="820px" mt={8}>
                {/* Barras */}
                <Box bg={CARD_BG} borderRadius="2xl" px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }} mb={5} boxShadow={`0 8px 36px ${ACCENT}44`}>
                  <Text color={ACCENT} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" mb={7} textAlign="center">
                    Tus resultados
                  </Text>
                  <Flex direction="column" gap={5}>
                    {(["vata", "pitta", "kapha"] as Dosha[]).map((dosha) => {
                      const info = DOSHA_INFO[dosha];
                      const isWinner = dosha === winner;
                      const pct = Math.round((counts[dosha] / PREGUNTAS.length) * 100);
                      return (
                        <Box key={dosha}>
                          <Flex align="center" justify="space-between" mb={2}>
                            <Flex align="center" gap={3} flexWrap="wrap">
                              <Text color={isWinner ? info.color : ACCENT + "99"} fontSize={{ base: "xl", md: "2xl" }} fontWeight={isWinner ? "700" : "400"}>
                                {info.nombre}
                              </Text>
                              {isWinner && (
                                <Box bg={info.color + "22"} border={`1px solid ${info.color}55`} borderRadius="full" px={3} py={0.5}>
                                  <Text color={info.color} fontSize="xs" fontWeight="700" letterSpacing="0.16em" textTransform="uppercase">
                                    Tu dosha predominante
                                  </Text>
                                </Box>
                              )}
                            </Flex>
                            <Text color={isWinner ? info.color : ACCENT + "88"} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" flexShrink={0}>
                              {counts[dosha]}
                              <Text as="span" fontSize="md" fontWeight="400" opacity={0.5}> / {PREGUNTAS.length}</Text>
                            </Text>
                          </Flex>
                          <Box w="100%" h="6px" borderRadius="full" bg={ACCENT + "18"}>
                            <Box h="100%" borderRadius="full" bg={isWinner ? info.color : info.color + "55"} boxShadow={isWinner ? `0 0 8px ${info.color}66` : "none"} w={`${pct}%`} transition="width 1s ease" />
                          </Box>
                        </Box>
                      );
                    })}
                  </Flex>
                </Box>

                {/* Descripción */}
                <Box bg={CARD_BG} borderRadius="2xl" px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }} mb={5} boxShadow={`0 8px 36px ${DOSHA_INFO[winner].color}44`} border={`1.5px solid ${DOSHA_INFO[winner].color}55`}>
                  <Text color={DOSHA_INFO[winner].color} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" textAlign="center" mb={1}>
                    {DOSHA_INFO[winner].nombre}
                  </Text>
                  <Text color={DOSHA_INFO[winner].color} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center" mb={6} opacity={0.75}>
                    {DOSHA_INFO[winner].subtitulo}
                  </Text>
                  <Text color={ACCENT} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" textAlign="center">
                    {DOSHA_INFO[winner].descripcion}
                  </Text>
                </Box>

                {/* Botón PDF */}
                <Flex justify="center">
                  <Box
                    as="button"
                    onClick={handleDownloadPdf}
                    px={8}
                    py={3}
                    borderRadius="full"
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="600"
                    letterSpacing="0.08em"
                    border={`1.5px solid ${ACCENT}55`}
                    bg="transparent"
                    color={ACCENT}
                    cursor="pointer"
                    transition="all 0.22s"
                    _hover={{ borderColor: ACCENT, boxShadow: `0 0 16px ${ACCENT}33` }}
                  >
                    Descargar mis respuestas en PDF
                  </Box>
                </Flex>
              </Box>
            )}
          </Flex>
        )}
      </Box>

      <SiteFooter />
    </Box>
  );
}
