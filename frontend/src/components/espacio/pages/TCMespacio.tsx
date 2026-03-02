import React, { useEffect, useState } from "react";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../global/SiteHeader";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { API_URL, tcmBg, TCMIcon, tcmTxt } from "../../../GlobalVariables";
import {
  RECS_CONSTITUCIONES,
  RECS_ELEMENTOS,
  RECS_DESEQUILIBRIOS,
  type Recs,
} from "../data/tcmRecommendations";
import { getTheme, type ElementTheme } from "../data/tcmTheme";

type TcmData = {
  userId: string;
  constitucion: string | null;
  elemento: string | null;
  desequilibrio: string | null;
};

/* ─── Iconos de acceso ─────────────────────────────────────── */
const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const tests = [
  {
    id: 1,
    label: "Conoce tu constitución",
    link: "/tcm/test/1",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
        <path d="M343.5-743.5Q320-767 320-800t23.5-56.5Q367-880 400-880t56.5 23.5Q480-833 480-800t-23.5 56.5Q433-720 400-720t-56.5-23.5ZM731-269q29-29 29-71t-29-71q-29-29-71-29t-71 29q-29 29-29 71t29 71q29 29 71 29t71-29ZM864-80 756-188q-22 14-46 21t-50 7q-75 0-127.5-52.5T480-340q0-75 52.5-127.5T660-520q75 0 127.5 52.5T840-340q0 26-7 50t-21 46l108 108-56 56Zm-424 0v-121q15 24 35.5 44t44.5 36v41h-80Zm-160 0v-520q-61-5-121-14.5T40-640l20-80q84 23 168.5 31.5T400-680q87 0 171.5-8.5T740-720l20 80q-59 16-119 25.5T520-600v41q-54 35-87 92.5T400-340v10q0 5 1 10h-41v240h-80Z"/>
      </svg>
    ),
  },
  {
    id: 2,
    label: "Tu elemento predominante",
    link: "/tcm/test/2",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
        <path d="M480-480Zm0 360q-18 0-34.5-6.5T416-146L148-415q-35-35-51.5-80T80-589q0-103 67-177t167-74q48 0 90.5 19t75.5 53q32-34 74.5-53t90.5-19q100 0 167.5 74T880-590q0 49-17 94t-51 80L543-146q-13 13-29 19.5t-34 6.5Zm40-520q10 0 19 5t14 13l68 102h166q7-17 10.5-34.5T801-590q-2-69-46-118.5T645-758q-31 0-59.5 12T536-711l-27 29q-5 6-13 9.5t-16 3.5q-8 0-16-3.5t-14-9.5l-27-29q-21-23-49-36t-60-13q-66 0-110 50.5T160-590q0 18 3 35.5t10 34.5h187q10 0 19 5t14 13l35 52 54-162q4-12 14.5-20t23.5-8Zm12 130-54 162q-4 12-15 20t-24 8q-10 0-19-5t-14-13l-68-102H236l237 237q2 2 3.5 2.5t3.5.5q2 0 3.5-.5t3.5-2.5l236-237H600q-10 0-19-5t-15-13l-34-52Z"/>
      </svg>
    ),
  },
  {
    id: 3,
    label: "Tu desequilibrio actual",
    link: "/tcm/test/3",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
        <path d="M824-120 636-308q-41 32-90.5 50T440-240q-90 0-162.5-44T163-400h98q34 37 79.5 58.5T440-320q100 0 170-70t70-170q0-100-70-170t-170-70q-94 0-162.5 63.5T201-580h-80q8-127 99.5-213.5T440-880q134 0 227 93t93 227q0 56-18 105.5T692-364l188 188-56 56ZM397-400l-63-208-52 148H80v-60h160l66-190h60l61 204 43-134h60l60 120h30v60h-67l-47-94-50 154h-59Z"/>
      </svg>
    ),
  },
];

/* ─── Separador decorativo ─────────────────────────────────── */
const Divider = ({ color = "rgba(218,113,113,0.45)", opacity = 1 }: { color?: string; opacity?: number }) => (
  <Flex justify="center" gap={1} style={{ opacity }}>
    <Box w="16px" h="1px" borderRadius="full" bg={color} opacity={0.5} />
    <Box w="32px" h="1px" borderRadius="full" bg={color} />
    <Box w="16px" h="1px" borderRadius="full" bg={color} opacity={0.5} />
  </Flex>
);

/* ─── Columna de recomendaciones ───────────────────────────── */
const RecsColumn = ({
  titulo,
  items,
  accent,
}: {
  titulo: string;
  items: string[];
  accent: string;
}) => (
  <Box
    bg="rgba(0,0,0,0.22)"
    border={`1px solid ${accent}22`}
    borderRadius="xl"
    px={5}
    py={6}
  >
    <Flex direction="column" align="center" gap={2} mb={5}>
      <Text color={`${accent}88`} fontSize="10px">✦</Text>
      <Text
        color={accent}
        fontSize={{ base: "xs", md: "sm" }}
        letterSpacing="0.25em"
        textTransform="uppercase"
        fontWeight="600"
        textAlign="center"
      >
        {titulo}
      </Text>
      <Box w="28px" h="1px" bg={`${accent}40`} borderRadius="full" />
    </Flex>

    <Flex direction="column" gap={3.5}>
      {items.map((item, i) => {
        const [nombre, ...resto] = item.split(" · ");
        return (
          <Box key={i}>
            <Text
              color="rgba(255,255,255,0.92)"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="500"
              lineHeight="1.35"
            >
              {nombre}
            </Text>
            {resto.length > 0 && (
              <Text
                color="rgba(255,255,255,0.44)"
                fontSize={{ base: "xs", md: "sm" }}
                fontStyle="italic"
                lineHeight="1.5"
                mt={0.5}
              >
                {resto.join(" · ")}
              </Text>
            )}
          </Box>
        );
      })}
    </Flex>
  </Box>
);

/* ─── Sección Nutrición (franja inferior) ──────────────────── */
const NutricionSection = ({
  items,
  accent,
  bg,
}: {
  items: string[];
  accent: string;
  bg: string;
}) => (
  <Box
    mt={5}
    borderTop={`1px solid ${accent}25`}
    pt={5}
  >
    {/* Título */}
    <Flex align="center" gap={3} mb={4}>
      <Box flex="1" h="1px" bg={`${accent}20`} borderRadius="full" />
      <Flex align="center" gap={2}>
        <Text color={`${accent}88`} fontSize="10px">✦</Text>
        <Text
          color={accent}
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="0.28em"
          textTransform="uppercase"
          fontWeight="600"
        >
          Nutrición
        </Text>
        <Text color={`${accent}88`} fontSize="10px">✦</Text>
      </Flex>
      <Box flex="1" h="1px" bg={`${accent}20`} borderRadius="full" />
    </Flex>

    {/* Grid 2 columnas */}
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }}>
      {items.map((item, i) => {
        const [nombre, ...resto] = item.split(" · ");
        return (
          <Box
            key={i}
            bg={`${bg}55`}
            border={`1px solid ${accent}18`}
            borderRadius="lg"
            px={4}
            py={3}
          >
            <Text
              color="rgba(255,255,255,0.90)"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="500"
              lineHeight="1.35"
            >
              {nombre}
            </Text>
            {resto.length > 0 && (
              <Text
                color="rgba(255,255,255,0.44)"
                fontSize={{ base: "xs", md: "sm" }}
                fontStyle="italic"
                lineHeight="1.5"
                mt={0.5}
              >
                {resto.join(" · ")}
              </Text>
            )}
          </Box>
        );
      })}
    </SimpleGrid>
  </Box>
);

/* ─── Card activa con tema de elemento ─────────────────────── */
const ActiveCard = ({
  etiqueta,
  nombre,
  recs,
  theme,
}: {
  etiqueta: string;
  nombre: string;
  recs: Recs;
  theme: ElementTheme;
}) => {
  const { accent, bg } = theme;
  return (
    <Box
      w="100%"
      bg={tcmBg}
      borderLeft={`4px solid ${accent}99`}
      border={`1px solid ${accent}30`}
      borderRadius="2xl"
      px={{ base: 6, md: 10 }}
      py={{ base: 7, md: 9 }}
      boxShadow={`0 6px 36px rgba(0,0,0,0.26), 0 0 32px ${accent}18`}
      position="relative"
      overflow="hidden"
    >
      {/* Glow de fondo sutil */}
      <Box
        position="absolute"
        top="-60px"
        right="-60px"
        w="200px"
        h="200px"
        borderRadius="full"
        bg={accent}
        opacity={0.03}
        filter="blur(40px)"
        pointerEvents="none"
      />

      {/* Header */}
      <Flex direction="column" mb={{ base: 6, md: 7 }}>
        <Flex align="center" gap={3} mb={3}>
          {/* Icono del elemento */}
          <Box
            w="36px"
            h="36px"
            borderRadius="full"
            bg={bg}
            border={`1.5px solid ${accent}55`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={accent}
            flexShrink={0}
            boxShadow={`0 0 12px ${accent}28`}
          >
            {theme.icon}
          </Box>

          <Flex align="baseline" gap={2} flexWrap="wrap">
            <Text
              color={`${accent}cc`}
              fontSize={{ base: "xs", md: "sm" }}
              letterSpacing="0.22em"
              textTransform="uppercase"
              lineHeight="1"
            >
              {etiqueta}:
            </Text>
            <Text
              color={tcmTxt}
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="400"
              letterSpacing="0.06em"
              fontStyle="italic"
              lineHeight="1"
            >
              {nombre}
            </Text>
          </Flex>
        </Flex>
        <Divider color={accent} />
      </Flex>

      {/* 3 columnas */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 5 }}>
        <RecsColumn titulo="Infusiones" items={recs.infusiones} accent={accent} />
        <RecsColumn titulo="Hierbas" items={recs.hierbas} accent={accent} />
        <RecsColumn titulo="Estilo de Vida" items={recs.estiloDeVida} accent={accent} />
      </SimpleGrid>

      {/* Sección Nutrición */}
      <NutricionSection items={recs.nutricion} accent={accent} bg={bg} />
    </Box>
  );
};

/* ─── Card bloqueada ───────────────────────────────────────── */
const LockedCard = ({
  etiqueta,
  testLabel,
  testLink,
  navigate,
}: {
  etiqueta: string;
  testLabel: string;
  testLink: string;
  navigate: (path: string) => void;
}) => (
  <Box
    w="100%"
    bg={tcmBg}
    border="1px dashed rgba(218,113,113,0.2)"
    borderRadius="2xl"
    px={{ base: 6, md: 10 }}
    py={{ base: 7, md: 9 }}
    opacity={0.62}
    position="relative"
    overflow="hidden"
  >
    <Box position="absolute" top={4} right={5} color="rgba(218,113,113,0.35)">
      <LockIcon />
    </Box>

    <Flex direction="column" mb={{ base: 5, md: 6 }}>
      <Text
        color="rgba(218,113,113,0.45)"
        fontSize={{ base: "xs", md: "sm" }}
        letterSpacing="0.22em"
        textTransform="uppercase"
        mb={3}
      >
        {etiqueta}
      </Text>
      <Divider opacity={0.4} />
    </Flex>

    <Flex direction="column" align="center" gap={4} py={3}>
      <Text
        color="rgba(255,255,255,0.32)"
        fontSize={{ base: "md", md: "lg" }}
        fontStyle="italic"
        textAlign="center"
        letterSpacing="0.03em"
      >
        Completa el test para desbloquear tus recomendaciones personalizadas
      </Text>
      <Box
        as="button"
        onClick={() => navigate(testLink)}
        px={7}
        py={3}
        borderRadius="full"
        fontFamily="'EB Garamond', serif"
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="600"
        letterSpacing="0.08em"
        border="1.5px solid rgba(218,113,113,0.38)"
        bg="rgba(107,4,4,0.3)"
        color="rgba(255,255,255,0.72)"
        cursor="pointer"
        transition="all 0.22s"
        pointerEvents="auto"
        opacity={1}
        _hover={{
          bg: "rgba(107,4,4,0.6)",
          borderColor: tcmTxt,
          boxShadow: "0 0 20px rgba(218,113,113,0.22)",
        }}
      >
        {testLabel}
      </Box>
    </Flex>

    {/* Placeholder columnas */}
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 5 }} mt={5}>
      {["Infusiones", "Hierbas", "Estilo de Vida"].map((col) => (
        <Box
          key={col}
          bg="rgba(0,0,0,0.12)"
          border="1px solid rgba(218,113,113,0.07)"
          borderRadius="xl"
          px={5}
          py={6}
        >
          <Flex direction="column" align="center" gap={2} mb={5}>
            <Text color="rgba(218,113,113,0.25)" fontSize="10px">✦</Text>
            <Text
              color="rgba(218,113,113,0.35)"
              fontSize={{ base: "xs", md: "sm" }}
              letterSpacing="0.25em"
              textTransform="uppercase"
              fontWeight="600"
            >
              {col}
            </Text>
            <Box w="28px" h="1px" bg="rgba(218,113,113,0.1)" borderRadius="full" />
          </Flex>
          <Flex direction="column" gap={3} px={1}>
            {[100, 72, 88, 60].map((w, i) => (
              <Box key={i} h="1px" bg="rgba(218,113,113,0.1)" borderRadius="full" w={`${w}%`} />
            ))}
          </Flex>
        </Box>
      ))}
    </SimpleGrid>

    {/* Placeholder nutrición */}
    <Box mt={5} borderTop="1px solid rgba(218,113,113,0.1)" pt={5}>
      <Flex align="center" gap={3} mb={4}>
        <Box flex="1" h="1px" bg="rgba(218,113,113,0.08)" borderRadius="full" />
        <Text color="rgba(218,113,113,0.3)" fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.28em" textTransform="uppercase" fontWeight="600">
          Nutrición
        </Text>
        <Box flex="1" h="1px" bg="rgba(218,113,113,0.08)" borderRadius="full" />
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
        {[88, 72, 95, 65].map((w, i) => (
          <Box key={i} bg="rgba(0,0,0,0.1)" border="1px solid rgba(218,113,113,0.06)" borderRadius="lg" px={4} py={3}>
            <Box h="1px" bg="rgba(218,113,113,0.1)" borderRadius="full" w={`${w}%`} mb={2} />
            <Box h="1px" bg="rgba(218,113,113,0.07)" borderRadius="full" w="55%" />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  </Box>
);

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════ */
export default function TCMespacio() {
  const navigate = useNavigate();
  const [tcmData, setTcmData] = useState<TcmData | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;
    axios
      .get(`${API_URL}/tcm/${userId}`)
      .then((res) => { if (res.data) setTcmData(res.data); })
      .catch(() => {});
  }, []);

  const constitucionRecs = tcmData?.constitucion
    ? RECS_CONSTITUCIONES[tcmData.constitucion] ?? null
    : null;
  const elementoRecs = tcmData?.elemento
    ? RECS_ELEMENTOS[tcmData.elemento] ?? null
    : null;
  const desequilibrioRecs = tcmData?.desequilibrio
    ? RECS_DESEQUILIBRIOS[tcmData.desequilibrio] ?? null
    : null;

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<TCMIcon size={{ base: "40px", md: "60px" }} />}
            title="Medicina China"
            bgColor={tcmBg}
            color={tcmTxt}
            maxW="700px"
          />

          {/* ══ TESTS ══ */}
          <Box
            w="100%"
            maxW="900px"
            bg={tcmBg}
            border="1px solid rgba(218,113,113,0.22)"
            borderRadius="3xl"
            px={{ base: 6, md: 10 }}
            pt={{ base: 8, md: 10 }}
            pb={{ base: 8, md: 10 }}
            mb={{ base: 10, md: 14 }}
            boxShadow="0 6px 48px rgba(0,0,0,0.22), 0 0 60px rgba(107,4,4,0.18)"
          >
            <Text
              color={tcmTxt}
              fontSize={{ base: "3xl", md: "4xl" }}
              lineHeight="1"
              textAlign="center"
              mb={{ base: 8, md: 10 }}
              fontWeight="700"
              letterSpacing="0.05em"
              filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
            >
              Tests para el Autoconocimiento
            </Text>

            <SimpleGrid w="100%" columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 5 }}>
              {tests.map((t) => (
                <Flex
                  key={t.id}
                  align="center"
                  justify="center"
                  gap={3}
                  bg={tcmBg}
                  border="1px solid rgba(218,113,113,0.35)"
                  borderRadius="2xl"
                  px={{ base: 6, md: 5 }}
                  py={10}
                  cursor="pointer"
                  boxShadow="0 4px 24px rgba(0,0,0,0.25), 0 0 18px rgba(107,4,4,0.38)"
                  transition="all 0.22s ease"
                  _hover={{
                    bg: "rgba(107,4,4,0.68)",
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 36px rgba(0,0,0,0.32), 0 0 30px rgba(107,4,4,0.55)",
                  }}
                  onClick={() => navigate(t.link)}
                >
                  <Box flexShrink={0}>{t.icon}</Box>
                  <Text
                    color={tcmTxt}
                    fontSize={{ base: "lg", md: "md", lg: "lg" }}
                    fontWeight="500"
                    letterSpacing="0.06em"
                    textAlign="left"
                    lineHeight="1.4"
                  >
                    {t.label}
                  </Text>
                </Flex>
              ))}
            </SimpleGrid>
          </Box>

          {/* ══ SECCIONES PERSONALIZADAS ══ */}
          <Flex direction="column" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>

            {/* Constitución */}
            {constitucionRecs ? (
              <ActiveCard
                etiqueta="Constitución"
                nombre={tcmData!.constitucion!}
                recs={constitucionRecs}
                theme={getTheme(tcmData!.constitucion!)}
              />
            ) : (
              <LockedCard
                etiqueta="Constitución"
                testLabel="Conoce tu constitución"
                testLink="/tcm/test/1"
                navigate={navigate}
              />
            )}

            {/* Elemento */}
            {elementoRecs ? (
              <ActiveCard
                etiqueta="Elemento"
                nombre={tcmData!.elemento!}
                recs={elementoRecs}
                theme={getTheme(tcmData!.elemento!)}
              />
            ) : (
              <LockedCard
                etiqueta="Elemento"
                testLabel="Tu elemento predominante"
                testLink="/tcm/test/2"
                navigate={navigate}
              />
            )}

            {/* Desequilibrio */}
            {desequilibrioRecs ? (
              <ActiveCard
                etiqueta="Desequilibrio Actual"
                nombre={tcmData!.desequilibrio!}
                recs={desequilibrioRecs}
                theme={getTheme(tcmData!.desequilibrio!)}
              />
            ) : (
              <LockedCard
                etiqueta="Desequilibrio Actual"
                testLabel="Tu desequilibrio actual"
                testLink="/tcm/test/3"
                navigate={navigate}
              />
            )}

          </Flex>
        </Flex>
      </Box>

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.1)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text
          color="rgba(255,255,255,0.38)"
          fontSize="xs"
          letterSpacing="0.05em"
          textAlign="center"
        >
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>
    </Box>
  );
}
