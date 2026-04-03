import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { NutricionIcon, nutricionBg, nutricionNom, nutricionTxt } from "../../../GlobalVariables";

const BG = nutricionBg;
const TXT = nutricionTxt;
const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";
const BASE = "/aprendizaje/videoLessonPage/nutricion";

// ─────────────────────────────────────────
// CARD WRAPPER
// ─────────────────────────────────────────
function Card({ children, title }: { children: React.ReactNode; title?: string }) {
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
        <Text
          color={TXT}
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="700"
          mb={5}
          letterSpacing="0.03em"
        >
          {title}
        </Text>
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
    <Card title="Probióticos y Prebióticos">
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
    </Card>
  );
}

// ─────────────────────────────────────────
// CARD 3 — EL INTESTINO
// ─────────────────────────────────────────
const capaColores = [
  { label: "Capa 1", bg: "#48C0B5", glow: "rgba(72,192,181,0.45)", route: `${BASE}/mic-5` },
  { label: "Capa 2", bg: "#C06B9B", glow: "rgba(192,107,155,0.45)", route: `${BASE}/mic-5` },
  { label: "Capa 3", bg: "#7B6EC8", glow: "rgba(123,110,200,0.45)", route: `${BASE}/mic-5` },
];

function CardIntestino() {
  const navigate = useNavigate();
  return (
    <Card>
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
          {capaColores.map((capa) => (
            <Box
              key={capa.label}
              as="button"
              onClick={() => navigate(capa.route)}
              bg={capa.bg}
              color="white"
              px={6}
              py={4}
              borderRadius="2xl"
              fontWeight="700"
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.08em"
              boxShadow={`0 4px 18px ${capa.glow}, 0 1px 4px rgba(0,0,0,0.15)`}
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
    <Card title="Eje intestino-cerebro">
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
    <Card title="Estroboloma">
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
                  w="26px"
                  h="26px"
                  minW="26px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="sm"
                  fontWeight="700"
                  mt="1px"
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
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box minH="100vh" bg="#080808">
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
