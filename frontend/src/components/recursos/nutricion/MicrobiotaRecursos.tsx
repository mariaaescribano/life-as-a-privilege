import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { NutricionIcon, nutricionBg, nutricionNom, nutricionTxt } from "../../../GlobalVariables";
import {
  MicrobiotaIconMicro,
  MicrobiotaIconEje,
  MicrobiotaIconMujer,
} from "../../../hardCoded/aprendizajes/Nutricion/MicrobiotaIcons";

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
    foto:        "/img/nutri/microbiota/capa1.png",
    descripciones: [
      "Descripción 1 de la capa mucosa — rellena este texto.",
      "Descripción 2 de la capa mucosa — rellena este texto.",
      "Descripción 3 de la capa mucosa — rellena este texto.",
    ],
  },
  {
    label:       "Capa 2",
    titulo:      "Capa 2: Submucosa",
    color:       "#C06B9B",
    glow:        "rgba(192,107,155,0.45)",
    foto:        "/img/nutri/microbiota/capa2.png",
    descripciones: [
      "Descripción 1 de la submucosa — rellena este texto.",
      "Descripción 2 de la submucosa — rellena este texto.",
      "Descripción 3 de la submucosa — rellena este texto.",
    ],
  },
  {
    label:       "Capa 3",
    titulo:      "Capa 3: Muscular",
    color:       "#7B6EC8",
    glow:        "rgba(123,110,200,0.45)",
    foto:        "/img/nutri/microbiota/capa3.png",
    descripciones: [
      "Descripción 1 de la capa muscular — rellena este texto.",
      "Descripción 2 de la capa muscular — rellena este texto.",
      "Descripción 3 de la capa muscular — rellena este texto.",
    ],
  },
];

// ═══════════════════════════════════════════════════
// DATOS EDITABLES — QUÉ COMER
// ═══════════════════════════════════════════════════
const queComerTexto  = "Aquí irá el texto que me pasarás sobre qué comer para balancear la microbiota.";
const queComerFoto   = "/img/nutri/microbiota/quecomer-texto.png";

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
      bg="white"
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
      <Box
        as="button"
        onClick={() => navigate(route)}
        bg={TXT}
        color="white"
        px={6}
        py={3}
        borderRadius="full"
        fontWeight="600"
        fontSize={{ base: "sm", md: "md" }}
        boxShadow={`0 2px 12px ${TXT}55`}
        _hover={{ opacity: 0.85, transform: "translateY(-1px)" }}
        transition="all 0.2s"
      >
        Ver video
      </Box>
    </Flex>
  );
}

// ─────────────────────────────────────────
// CARD 1 — PROBIÓTICOS Y PREBIÓTICOS
// ─────────────────────────────────────────
function CardProbioticos() {
  return (
    <Card
      title="Probióticos y Prebióticos"
      titleIcon={<MicrobiotaIconMicro />}
    >
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr" }}
        gap={{ base: 5, md: 6 }}
      >
        {/* Probiótico */}
        <Flex direction="column" align="center" gap={3}>
          <Text color={TXT} fontWeight="600" fontSize={{ base: "md", md: "lg" }}>
            Probiótico
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
              src="/img/nutri/microbiota/probiotico.png"
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
          <Text color={TXT} fontWeight="600" fontSize={{ base: "md", md: "lg" }}>
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
              src="/img/nutri/microbiota/prebiotico.png"
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
  { src: "/img/nutri/microbiota/comer1.png", label: "Alimento 1" },
  { src: "/img/nutri/microbiota/comer2.png", label: "Alimento 2" },
  { src: "/img/nutri/microbiota/comer3.png", label: "Alimento 3" },
  { src: "/img/nutri/microbiota/comer4.png", label: "Alimento 4" },
  { src: "/img/nutri/microbiota/comer5.png", label: "Alimento 5" },
  { src: "/img/nutri/microbiota/comer6.png", label: "Alimento 6" },
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
    </Flex>
  );
}

function CardQueComer() {
  return (
    <Card title="Qué comer para balancear la microbiota">
      <Grid templateColumns="repeat(3, 1fr)" gap={{ base: 4, md: 6 }} justifyItems="center">
        {comerFotos.map((f) => (
          <FotoCirculo key={f.src} src={f.src} label={f.label} />
        ))}
      </Grid>

      {/* Sección texto + foto */}
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "flex-start", md: "center" }}
        gap={{ base: 4, md: 6 }}
        mt={8}
        pt={6}
        borderTop={`1px solid ${TXT}22`}
      >
        {/* Icono nutrición izquierda */}
        <Box flexShrink={0} display="flex" alignItems="flex-start" pt="2px">
          <NutricionIcon size={{ base: "30px", md: "36px" }} />
        </Box>

        {/* Texto */}
        <Text
          color={TXT}
          fontSize={{ base: "sm", md: "md" }}
          lineHeight="1.8"
          flex={1}
        >
          {queComerTexto}
        </Text>

        {/* Foto */}
        <Box
          flexShrink={0}
          w={{ base: "100%", md: "200px" }}
          borderRadius="xl"
          overflow="hidden"
          border={`2px solid ${TXT}33`}
          bg={BG}
        >
          <Image
            src={queComerFoto}
            alt="Qué comer"
            w="100%"
            h={{ base: "160px", md: "140px" }}
            objectFit="cover"
            fallback={
              <Flex w="100%" h={{ base: "160px", md: "140px" }} align="center" justify="center">
                <Text color={TXT} opacity={0.5} fontSize="xs">Foto</Text>
              </Flex>
            }
          />
        </Box>
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
          {/* Descripciones en boxes con shadow */}
          <Flex direction="column" gap={4} mb={7}>
            {capa.descripciones.map((desc, i) => (
              <Box
                key={i}
                bg={BG}
                borderRadius="xl"
                px={5}
                py={4}
                border={`1.5px solid ${capa.color}44`}
                boxShadow={`0 3px 12px ${capa.color}22`}
              >
                <Flex gap={3} align="flex-start">
                  <Box
                    bg={capa.color}
                    color="white"
                    borderRadius="full"
                    w="24px" h="24px" minW="24px"
                    display="flex" alignItems="center" justifyContent="center"
                    fontSize="xs" fontWeight="700" mt="1px"
                  >
                    {i + 1}
                  </Box>
                  <Text color={TXT} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
                    {desc}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Flex>

          {/* Foto */}
          <Box borderRadius="xl" overflow="hidden" border={`2px solid ${capa.color}44`} bg={BG}>
            <Image
              src={capa.foto}
              alt={capa.titulo}
              w="100%"
              h={{ base: "200px", md: "260px" }}
              objectFit="cover"
              fallback={
                <Flex w="100%" h={{ base: "200px", md: "260px" }} align="center" justify="center">
                  <Text color={TXT} opacity={0.5} fontSize="sm">{capa.titulo} — foto pendiente</Text>
                </Flex>
              }
            />
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
  const [capaAbierta, setCapaAbierta] = useState<typeof capasIntestinoData[0] | null>(null);

  return (
    <>
      <Card title="El intestino y sus capas">
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 6, md: 8 }}
          align={{ base: "center", md: "stretch" }}
        >
          {/* Foto izquierda */}
          <Box
            borderRadius="xl"
            overflow="hidden"
            flexShrink={0}
            w={{ base: "100%", md: "55%" }}
            aspectRatio="4/3"
            bg={BG}
            border={`2px solid ${TXT}33`}
          >
            <Image
              src="/img/nutri/microbiota/intestino.png"
              alt="El intestino"
              w="100%"
              h="100%"
              objectFit="cover"
              fallback={
                <Flex w="100%" h="100%" align="center" justify="center" minH="180px">
                  <Text color={TXT} opacity={0.5} fontSize="sm">Foto intestino</Text>
                </Flex>
              }
            />
          </Box>

          {/* Botones derecha */}
          <Flex direction="column" justify="center" gap={4} flex={1} w={{ base: "100%", md: "auto" }}>
            {capasIntestinoData.map((capa) => (
              <Box
                key={capa.label}
                as="button"
                onClick={() => setCapaAbierta(capa)}
                bg={capa.color}
                color="white"
                px={6}
                py={4}
                borderRadius="2xl"
                fontWeight="700"
                fontSize={{ base: "md", md: "lg" }}
                letterSpacing="0.08em"
                boxShadow={`0 4px 18px ${capa.glow}`}
                _hover={{ opacity: 0.88, transform: "translateY(-2px)" }}
                transition="all 0.2s"
                textAlign="center"
              >
                {capa.label}
              </Box>
            ))}
          </Flex>
        </Flex>
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
  { src: "/img/nutri/microbiota/eje1.png", label: "Foto 1" },
  { src: "/img/nutri/microbiota/eje2.png", label: "Foto 2" },
  { src: "/img/nutri/microbiota/eje3.png", label: "Foto 3" },
];

function CardEjeIntestinoCerebro() {
  return (
    <Card
      title="Eje intestino-cerebro"
      titleIcon={<MicrobiotaIconEje />}
    >
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={{ base: 5, md: 6 }}
      >
        {ejeFotos.map((f) => (
          <Box
            key={f.src}
            borderRadius="xl"
            overflow="hidden"
            aspectRatio="3/4"
            bg={BG}
            border={`2px solid ${TXT}33`}
          >
            <Image
              src={f.src}
              alt={f.label}
              w="100%"
              h="100%"
              objectFit="cover"
              fallback={
                <Flex w="100%" h="100%" align="center" justify="center" minH="160px">
                  <Text color={TXT} opacity={0.5} fontSize="sm">{f.label}</Text>
                </Flex>
              }
            />
          </Box>
        ))}
      </Grid>
    </Card>
  );
}

// ─────────────────────────────────────────
// CARD 5 — ESTROBOLOMA
// ─────────────────────────────────────────
const estrobolonaTextos = [
  "El hígado gestiona las hormonas y las envía al intestino.",
  "Si la microbiota está desequilibrada, los estrógenos serán reabsorbidos y pasarán a la circulación.",
  "Se pueden ocasionar problemas como endometriosis, miomas, cánceres y dolores menstruales.",
];

function CardEstroboloma() {
  return (
    <Card
      title="Estroboloma"
      titleIcon={<MicrobiotaIconMujer />}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 6, md: 8 }}
        align={{ base: "center", md: "stretch" }}
      >
        {/* Foto izquierda */}
        <Box
          borderRadius="xl"
          overflow="hidden"
          flexShrink={0}
          w={{ base: "100%", md: "42%" }}
          aspectRatio="3/4"
          bg={BG}
          border={`2px solid ${TXT}33`}
        >
          <Image
            src="/img/nutri/microbiota/estroboloma.png"
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

        {/* Text boxes derecha */}
        <Flex direction="column" justify="center" gap={4} flex={1}>
          {estrobolonaTextos.map((txt, i) => (
            <Box
              key={i}
              bg={BG}
              borderRadius="xl"
              px={5}
              py={4}
              border={`1.5px solid ${TXT}33`}
              boxShadow={`0 2px 8px ${TXT}1a`}
            >
              <Flex gap={3} align="flex-start">
                <Box
                  bg={TXT}
                  color="white"
                  borderRadius="full"
                  w="26px" h="26px" minW="26px"
                  display="flex" alignItems="center" justifyContent="center"
                  fontSize="sm" fontWeight="700" mt="1px"
                >
                  {i + 1}
                </Box>
                <Text color={TXT} fontSize={{ base: "sm", md: "md" }} lineHeight="1.5">
                  {txt}
                </Text>
              </Flex>
            </Box>
          ))}
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
      <SiteHeader />
      <Flex
        direction="column"
        align="center"
        px={{ base: 4, md: 8 }}
        pt={{ base: 6, md: 10 }}
        pb={{ base: 12, md: 16 }}
      >
        <DisciplineHeader
          icon={<NutricionIcon size={{ base: "36px", md: "44px" }} />}
          title="La Microbiota"
          subtitle={nutricionNom}
          bgColor={BG}
          color={TXT}
          mb={{ base: 8, md: 10 }}
          onIconClick={() => navigate("/aprendizaje/cursosModalidad/nutricion")}
        />

        <CardProbioticos />
        <CardQueComer />
        <CardIntestino />
        <CardEjeIntestinoCerebro />
        <CardEstroboloma />
      </Flex>
      <SiteFooter />
    </Box>
  );
}
