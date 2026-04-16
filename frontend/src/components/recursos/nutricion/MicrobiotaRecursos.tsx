import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { IntestinoIcon, NutricionIcon, nutricionBg, nutricionNom, nutricionTxt } from "../../../GlobalVariables";
import {
  MicrobiotaIconMicro,
  MicrobiotaIconMujer,
} from "../../../hardCoded/aprendizajes/Nutricion/MicrobiotaIcons";
import { BrainIcon } from "lucide-react";

const BG   = nutricionBg;
const TXT  = nutricionTxt;
const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";
const BASE = "/aprendizaje/videoLessonPage/nutricion";

// ═══════════════════════════════════════════════════
// DATOS EDITABLES — CAPAS DEL INTESTINO
// Para editar el contenido de cada capa busca este array.
// ═══════════════════════════════════════════════════
export const capasIntestinoData = [
  {
    label:       "Capa 1",
    titulo:      "Capa 1: Mucosa",
    color:       "#48C0B5",
    glow:        "rgba(72,192,181,0.45)",
    foto:        "/img/nutri/microbiotaRecursos/capa1.webp",
    descripciones: [
      "Es la primera barrera en contacto con los alimentos y la microbiota intestinal.",
      "Está formada por una capa de moco que protege el epitelio y sirve de hábitat para muchas bacterias beneficiosas.",
      "Una dieta baja en fibra puede hacer que algunas bacterias degraden este moco, debilitando la barrera intestinal.",
      "Ciertas bacterias beneficiosas ayudan a mantener y regenerar esta capa.",
    ],
  },
  {
    label:       "Capa 2",
    titulo:      "Capa 2: Epitelio intestinal",
    color:       "#C06B9B",
    glow:        "rgba(192,107,155,0.45)",
    foto:        "/img/nutri/microbiotaRecursos/capa2.webp",
    descripciones: [
      "Formada por células epiteliales unidas por uniones estrechas (tight junctions) que regulan el paso selectivo de sustancias.",
      "Actúa como una barrera física que permite el paso de nutrientes y bloquea microorganismos y toxinas.",
      "Cuando estas uniones se alteran, puede aumentar la permeabilidad intestinal.",
      "Incluye células especializadas que producen moco y participan en la defensa del intestino.",
    ],
  },
  {
    label:       "Capa 3",
    titulo:      "Capa 3: Sistema inmunitario",
    color:       "#7B6EC8",
    glow:        "rgba(123,110,200,0.45)",
    foto:        "/img/nutri/microbiotaRecursos/capa3.webp",
    descripciones: [
      "Compuesta por células del sistema inmunitario que protegen frente a patógenos.",
      "Forma parte del tejido linfoide asociado al intestino (GALT).",
      "Las células inmunitarias se comunican mediante citoquinas, que regulan la inflamación.",
      "Un desequilibrio en esta respuesta puede favorecer la inflamación y afectar la integridad de la barrera intestinal.",
    ],
  },
];

// ─────────────────────────────────────────
// CARD WRAPPER
// ─────────────────────────────────────────
function Card({
  children,
  title,
  titleIcon,
}: {
  children: React.ReactNode;
  title?: string;
  titleIcon?: React.ReactNode;
}) {
  return (
    <Box
      bg={BG}
      borderRadius="2xl"
      boxShadow={GLOW}
      p={{ base: 5, md: 8 }}
      w="100%"
      maxW="850px"
      mb={{ base: 8, md: 10 }}
    >
      {title && (
        <Flex align="center" gap={3} mb={5}>
          {titleIcon && (
            <Box flexShrink={0} display="flex" alignItems="center">
              {titleIcon}
            </Box>
          )}
          <Text
            color={TXT}
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="700"
            letterSpacing="0.03em"
          >
            {title}
          </Text>
        </Flex>
      )}
      {children}
    </Box>
  );
}

// ─────────────────────────────────────────
// VIDEO BUTTON
// ─────────────────────────────────────────
function VerVideoBtn({ route }: { route: string }) {
  const navigate = useNavigate();
  return (
    <Flex justify="flex-end" mt={5}>
      <Flex
        as="button"
        align="center"
        gap={1}
        onClick={() => navigate(route)}
        color={TXT}
        fontFamily="'EB Garamond', serif"
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="600"
        textDecoration="underline"
        textUnderlineOffset="3px"
        _hover={{ opacity: 0.7 }}
        transition="opacity 0.2s"
        bg="transparent"
        border="none"
        cursor="pointer"
      >
        Ver vídeo →
      </Flex>
    </Flex>
  );
}

// ─────────────────────────────────────────
// CARD 1 — PROBIÓTICOS Y PREBIÓTICOS
// ─────────────────────────────────────────
function CardProbioticos() {
  return (
    <Card>
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={{ base: 5, md: 6 }}
      >
        {/* Probiótico */}
        <Flex direction="column" align="center" gap={3}>
          <Flex align="center" gap={2}>
            <MicrobiotaIconMicro />
            <Text color={TXT} fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} fontFamily="'EB Garamond', serif">
              Probiótico
            </Text>
          </Flex>
          <Box
            borderRadius="xl"
            overflow="hidden"
            w="100%"
            aspectRatio="4/3"
            bg={BG}
            border={`2px solid ${TXT}33`}
          >
            <Image
              src="/img/nutri/microbiotaRecursos/probiotico.jpg"
              alt="Probiótico"
              w="100%"
              h="100%"
              objectFit="cover"
              fallback={
                <Flex w="100%" h="100%" align="center" justify="center" minH="160px">
                  <Text color={TXT} opacity={0.5} fontSize="sm">Foto probiótico</Text>
                </Flex>
              }
            />
          </Box>
        </Flex>

        {/* Prebiótico */}
        <Flex direction="column" align="center" gap={3}>
          <Text color={TXT} fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} fontFamily="'EB Garamond', serif">
            Prebiótico
          </Text>
          <Box
            borderRadius="xl"
            overflow="hidden"
            w="100%"
            aspectRatio="4/3"
            bg={BG}
            border={`2px solid ${TXT}33`}
          >
            <Image
              src="/img/nutri/microbiotaRecursos/prebiotico.jpeg"
              alt="Prebiótico"
              w="100%"
              h="100%"
              objectFit="cover"
              fallback={
                <Flex w="100%" h="100%" align="center" justify="center" minH="160px">
                  <Text color={TXT} opacity={0.5} fontSize="sm">Foto prebiótico</Text>
                </Flex>
              }
            />
          </Box>
        </Flex>
      </Grid>
      <VerVideoBtn route={`${BASE}/mic-2`} />
    </Card>
  );
}

// ─────────────────────────────────────────
// CARD 2 — QUÉ COMER
// ─────────────────────────────────────────
const comerFotos = [
  { src: "/img/nutri/microbiotaRecursos/chukrut.jpg",  label: "Chukrut" },
  { src: "/img/nutri/microbiotaRecursos/kefir.webp",   label: "Kéfir" },
  { src: "/img/nutri/microbiotaRecursos/kimchi.jpg",   label: "Kimchi" },
  { src: "/img/nutri/microbiotaRecursos/miso.webp",    label: "Miso" },
  { src: "/img/nutri/microbiotaRecursos/verduras.jpg", label: "Verduras" },
  { src: "/img/nutri/microbiotaRecursos/yogur.jpg",    label: "Yogur" },
];

function FotoCirculo({ src, label }: { src: string; label: string }) {
  return (
    <Flex direction="column" align="center" gap={2}>
      <Box
        borderRadius="full"
        overflow="hidden"
        w={{ base: "80px", md: "110px" }}
        h={{ base: "80px", md: "110px" }}
        bg={BG}
        border={`3px solid ${TXT}44`}
        boxShadow={`0 2px 10px ${TXT}33`}
        flexShrink={0}
      >
        <Image
          src={src}
          alt={label}
          w="100%"
          h="100%"
          objectFit="cover"
          fallback={
            <Flex w="100%" h="100%" align="center" justify="center">
              <Text color={TXT} opacity={0.45} fontSize="xs" textAlign="center" px={1}>
                {label}
              </Text>
            </Flex>
          }
        />
      </Box>
      <Text
        color={TXT}
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="600"
        textAlign="center"
      >
        {label}
      </Text>
    </Flex>
  );
}

function CardQueComer() {
  const navigate = useNavigate();
  return (
    <Card title="Qué comer para balancear la microbiota" titleIcon={<NutricionIcon />}>
      <Grid templateColumns="repeat(3, 1fr)" gap={{ base: 4, md: 6 }} justifyItems="center">
        {comerFotos.map((f) => (
          <FotoCirculo key={f.src} src={f.src} label={f.label} />
        ))}
      </Grid>
      <Flex justify="flex-end" mt={5}>
        <Flex
          as="button"
          align="center"
          gap={1}
          onClick={() => navigate(`${BASE}/mic-4`)}
          color={TXT}
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="600"
          textDecoration="underline"
          textUnderlineOffset="3px"
          _hover={{ opacity: 0.7 }}
          transition="opacity 0.2s"
          bg="transparent"
          border="none"
          cursor="pointer"
        >
          Ver vídeo →
        </Flex>
      </Flex>
    </Card>
  );
}

// ─────────────────────────────────────────
// MODAL DE CAPA
// ─────────────────────────────────────────
function CapaModal({ capa, onClose }: { capa: typeof capasIntestinoData[0]; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <Box
      position="fixed" inset={0} zIndex={1000}
      bg="rgba(5,40,10,0.55)"
      sx={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      display="flex" alignItems="center" justifyContent="center"
      px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        w={{ base: "95%", md: "580px" }}
        maxH={{ base: "88vh", md: "88vh" }}
        overflowY="auto"
        borderRadius="24px"
        bg="white"
        boxShadow="0 32px 80px rgba(0,0,0,0.4)"
        sx={{
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-track": { bg: "transparent" },
          "&::-webkit-scrollbar-thumb": { bg: capa.color + "77", borderRadius: "full" },
        }}
      >
        {/* Header coloreado */}
        <Box bg={capa.color} borderTopRadius="24px" px={{ base: 6, md: 8 }} py={6} position="relative">
          <Box
            as="button" position="absolute" top="14px" right="14px"
            w="32px" h="32px" borderRadius="full"
            bg="rgba(255,255,255,0.22)" border="1px solid rgba(255,255,255,0.4)"
            display="flex" alignItems="center" justifyContent="center"
            color="white" fontSize="15px" fontWeight="700"
            cursor="pointer" onClick={onClose}
            _hover={{ bg: "rgba(255,255,255,0.35)" }}
          >
            ✕
          </Box>
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            fontFamily="'EB Garamond', serif"
            letterSpacing="0.03em"
          >
            {capa.titulo}
          </Text>
        </Box>

        <Box px={{ base: 6, md: 8 }} py={7}>
          {/* Box único: puntos + foto, sin fondo verde */}
          <Box
            borderRadius="2xl"
            border={`1.5px solid ${capa.color}33`}
            boxShadow={`0 4px 20px ${capa.color}18`}
            overflow="hidden"
          >
            {/* Descripciones */}
            <Flex direction="column" gap={0}>
              {capa.descripciones.map((desc, i) => (
                <Box
                  key={i}
                  px={5}
                  py={4}
                  borderTop={i === 0 ? `1px solid ${capa.color}22` : `1px solid ${capa.color}18`}
                >
                  <Text color={TXT} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
                    {desc}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────
// CARD 3 — EL INTESTINO
// ─────────────────────────────────────────
function CardIntestino() {
  const [capaSeleccionada, setCapaSeleccionada] = useState(capasIntestinoData[1]);
  const [capaAbierta, setCapaAbierta] = useState<typeof capasIntestinoData[0] | null>(null);

  return (
    <>
      <Card title="El intestino y sus capas" titleIcon={<IntestinoIcon/>}>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 6, md: 8 }}
          align={{ base: "center", md: "stretch" }}
        >
          {/* Foto intestino */}
          <Box
            overflow="hidden"
            flexShrink={0}
            w={{ base: "100%", md: "75%" }}
          >
            <Image
              src="/img/nutri/microbiotaRecursos/intest.jpg"
              alt="El intestino"
              w="100%"
              display="block"
            />
          </Box>

          {/* Botones derecha */}
          <Flex direction="column" justify="center" gap={4} flex={1} w={{ base: "100%", md: "auto" }}>
            {capasIntestinoData.map((capa) => (
              <Box
                key={capa.label}
                as="button"
                onClick={() => { setCapaSeleccionada(capa); setCapaAbierta(capa); }}
                bg={capa.color}
                color="white"
                px={6}
                py={4}
                borderRadius="2xl"
                fontWeight="700"
                fontSize={{ base: "md", md: "lg" }}
                letterSpacing="0.08em"
                boxShadow={`0 4px 18px ${capa.glow}`}
                opacity={capaSeleccionada.label === capa.label ? 1 : 0.7}
                transform={capaSeleccionada.label === capa.label ? "scale(1.03)" : "scale(1)"}
                _hover={{ opacity: 0.88, transform: "translateY(-2px) scale(1.03)" }}
                transition="all 0.2s"
                textAlign="center"
              >
                {capa.label}
              </Box>
            ))}
          </Flex>
        </Flex>
        <VerVideoBtn route={`${BASE}/mic-5`} />
      </Card>

      {capaAbierta && (
        <CapaModal capa={capaAbierta} onClose={() => setCapaAbierta(null)} />
      )}
    </>
  );
}

// ─────────────────────────────────────────
// CARD 4 — EJE INTESTINO-CEREBRO
// ─────────────────────────────────────────
const ejeFotos = [
  { src: "/img/nutri/microbiotaRecursos/vagusnerve1.webp", label: "Nervio vago 1" },
  { src: "/img/nutri/microbiotaRecursos/vagusnerve2.webp", label: "Nervio vago 2" },
  { src: "/img/nutri/microbiotaRecursos/vagusnerve3.jpg",  label: "Nervio vago 3" },
];

function CardEjeIntestinoCerebro() {
  const navigate = useNavigate();
  return (
    <Card
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 6, md: 0 }}
        align="flex-start"
      >
        {/* Primera foto */}
        <Flex direction="column" gap={3} flexShrink={0} w={{ base: "100%", md: "calc(50% - 25px)" }}>
          <Flex align="center" gap={2}>
            <BrainIcon />
            <Text color={TXT} fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} fontFamily="'EB Garamond', serif">
              Eje Intestino-Cerebro
            </Text>
          </Flex>
          <Box
            borderRadius="xl"
            overflow="hidden"
            w="100%"
            aspectRatio="3/4"
            bg={BG}
          >
            <Image
              src={ejeFotos[0].src}
              alt={ejeFotos[0].label}
              w="100%"
              h="100%"
              objectFit="cover"
              fallback={
                <Flex w="100%" h="100%" align="center" justify="center" minH="160px">
                  <Text color={TXT} opacity={0.5} fontSize="sm">{ejeFotos[0].label}</Text>
                </Flex>
              }
            />
          </Box>
          <Flex
            as="button"
            align="center"
            gap={1}
            onClick={() => navigate(`${BASE}/mic-7`)}
            color={TXT}
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="600"
            textDecoration="underline"
            textUnderlineOffset="3px"
            _hover={{ opacity: 0.7 }}
            transition="opacity 0.2s"
            bg="transparent"
            border="none"
            cursor="pointer"
          >
            ← Ver vídeo 
          </Flex>
        </Flex>

        {/* Raya vertical */}
        <Box
          display={{ base: "none", md: "flex" }}
          w="1px"
          bg={`${TXT}33`}
          mx={6}
          flexShrink={0}
          alignSelf="stretch"
        />
        <Box display={{ base: "block", md: "none" }} h="1px" bg={`${TXT}33`} />

        {/* Estroboloma */}
        <Flex direction="column" align="flex-start" gap={3} w={{ base: "100%", md: "calc(50% - 25px)" }} flexShrink={0}>
          <Flex align="center" gap={2}>
            <MicrobiotaIconMujer />
            <Text color={TXT} fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} fontFamily="'EB Garamond', serif">
              Estroboloma
            </Text>
          </Flex>
          <Box
            borderRadius="xl"
            overflow="hidden"
            w="100%"
            aspectRatio="3/4"
            bg={BG}
          >
            <Image
              src="/img/nutri/microbiotaRecursos/estrobolome.png"
              alt="Estroboloma"
              w="100%"
              h="100%"
              objectFit="cover"
              fallback={
                <Flex w="100%" h="100%" align="center" justify="center" minH="200px">
                  <Text color={TXT} opacity={0.5} fontSize="sm">Foto estroboloma</Text>
                </Flex>
              }
            />
          </Box>
          <Flex
            as="button"
            align="center"
            justify="flex-end"
            gap={1}
            onClick={() => navigate(`${BASE}/mic-6`)}
            color={TXT}
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="600"
            textDecoration="underline"
            textUnderlineOffset="3px"
            _hover={{ opacity: 0.7 }}
            transition="opacity 0.2s"
            bg="transparent"
            border="none"
            cursor="pointer"
            w="100%"
          >
            Ver vídeo →
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}


// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export default function MicrobiotaRecursos() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box minH="100vh" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant={"auto"} />
       <Flex
          direction="column"
          alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
        <DisciplineHeader
          icon={<NutricionIcon size={{ base: "28px", md: "34px" }} />}
          title="La Microbiota"
          bgColor={BG}
          color={TXT}
          compact
          onIconClick={() => navigate("/aprendizaje/modulosPage/nutricion/nut-curso-2")}
        />

        <CardProbioticos />
        <CardQueComer />
        <CardIntestino />
        <CardEjeIntestinoCerebro />

        {/* Botón Seguir aprendiendo */}
        <Flex justify="center" mt={{ base: 6, md: 8 }}>
          <Flex
            as="button"
            align="center"
            gap={3}
            px={{ base: 8, md: 12 }}
            py={{ base: 3, md: 4 }}
            borderRadius="full"
            border="2px solid rgba(255,255,255,0.7)"
            bg={BG}
            cursor="pointer"
            color={TXT}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "lg", md: "xl" }}
            letterSpacing="0.12em"
            textShadow="0 2px 8px rgba(0,0,0,0.2)"
            boxShadow={GLOW}
            onClick={() => navigate("/aprendizaje/modulosPage/nutricion/nut-curso-2")}
            _hover={{
              borderColor: "white",
            }}
            transition="all 0.25s ease"
          >
            <Box flexShrink={0}>
              <NutricionIcon size={{ base: "24px", md: "28px" }} />
            </Box>
            Seguir aprendiendo
          </Flex>
        </Flex>
      </Flex>
      <SiteFooter />
    </Box>
  );
}
