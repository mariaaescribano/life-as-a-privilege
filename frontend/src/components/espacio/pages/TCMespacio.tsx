import React, { useEffect, useState } from "react";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import SpinnerTurquesa from "../../global/Spinner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../../global/SiteHeader";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { API_URL, tcmBg, TCMIcon, tcmTxt } from "../../../GlobalVariables";
import { ContactModal } from "../../global/ContactModal";
import {
  RECS_CONSTITUCIONES,
  RECS_ELEMENTOS,
  RECS_DESEQUILIBRIOS,
  type Recs,
} from "../data/tcmRecommendations";
import { getTheme } from "../data/tcmTheme";
import SiteFooter from "../../global/Footer";
import { generateTcmPdf, type TcmRespuesta } from "../../../utils/generateTcmPdf";

/* ══════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════ */
interface TcmData {
  constitucion: string | null;
  elemento: string | null;
  desequilibrio: string | null;
}

/* ══════════════════════════════════════════════
   DESCRIPCIONES POR RESULTADO
══════════════════════════════════════════════ */
const DESC_CONSTITUCION: Record<string, string> = {
  "Equilibrado":
    "Tu cuerpo está en armonía. Mantén tus hábitos de Viday sigue escuchando tu cuerpo con regularidad.",
  "Deficiencia de Qi":
    "El Qi (energía vital) está disminuido. Descansa más, come caliente y nutritivo, y evita el sobreesfuerzo físico y mental.",
  "Deficiencia de Yang":
    "El Yang está débil. Abrígate, prioriza alimentos calientes, y evita crudos, frío y humedad.",
  "Deficiencia de Yin":
    "El Yin (tu hidratación y nutrición) está disminuido o no es adecuada. Ten descansos de calida y reduce el estrés.",
  "Flema-Humedad":
    "Hay exceso de Humedad interna. Evita lácteos y azúcares refinados, muévete a diario y come ligero y caliente.",
  "Calor-Humedad":
    "Hay Calor y Humedad acumulados. Evita frituras, alcohol y picantes; come fresco, ligero y reduce el estrés.",
  "Estancamiento de Qi":
    "El Qi está bloqueado. Muévete con regularidad, expresa tus emociones, practica respiración consciente y evita el sedentarismo.",
};

const DESC_ELEMENTO: Record<string, string> = {
  "Madera":
    "Tu terreno constitucional es el Movimiento Madera. Tu naturaleza tiende al impulso, la dirección y la iniciativa. El Hígado rige tu capacidad de planificar y avanzar. Cuida el exceso de tensión y frustración como señales de desequilibrio.",
  "Fuego":
    "Tu terreno constitucional es el Movimiento Fuego. Tu naturaleza es expresiva, relacional y cálida. El Corazón rige tu vitalidad emocional y la conexión. Cuida la intensidad afectiva y la sobre-estimulación como señales de desequilibrio.",
  "Tierra":
    "Tu terreno constitucional es el Movimiento Tierra. Tu naturaleza tiende al sostén, la estabilidad y el cuidado. El Bazo rige tu capacidad nutritiva y de contención. Cuida la rumiación y el agotamiento por cuidar a otros como señales de desequilibrio.",
  "Metal":
    "Tu terreno constitucional es el Movimiento Metal. Tu naturaleza es introspectiva, precisa y ética. El Pulmón rige tu sentido del orden y los límites. Cuida la rigidez y la dificultad para soltar como señales de desequilibrio.",
  "Agua":
    "Tu terreno constitucional es el Movimiento Agua. Tu naturaleza es profunda, intuitiva y reservada. El Riñón rige tu voluntad y la energía vital de base. Cuida el agotamiento y el miedo como señales de desequilibrio.",
};

const DESC_DESEQUILIBRIO: Record<string, string> = {
  "Madera":
    "El patrón predominante es la desarmonía de Madera. El Qi de Hígado se encuentra estancado o ascendente. Prioriza movimiento físico, expresión emocional y técnicas de gestión del estrés. Evita exceso de trabajo sin descanso y alimentos muy grasos o picantes.",
  "Fuego":
    "El patrón predominante es la desarmonía de Fuego. El Shen (mente-espíritu) muestra signos de agitación o calor. Prioriza la calidad del descanso nocturno, la meditación y alimentos refrescantes. Evita el exceso de estimulación y las emociones intensas sin espacio de integración.",
  "Tierra":
    "El patrón predominante es la desarmonía de Tierra. El Qi de Bazo está debilitado con tendencia a la humedad interna. Prioriza comidas calientes y regulares, masticación pausada y reducción de la rumiación mental. Evita crudos, lácteos en exceso y el comer deprisa o con ansiedad.",
  "Metal":
    "El patrón predominante es la desarmonía de Metal. El Qi de Pulmón muestra signos de debilidad o bloqueo emocional. Prioriza la respiración consciente, la expresión de la tristeza y el contacto con la naturaleza. Evita el exceso de introspección sin acción y los entornos cerrados y secos.",
  "Agua":
    "El patrón predominante es la desarmonía de Agua. El Jing o el Qi de Riñón muestran signos de agotamiento. Prioriza el descanso profundo, los alimentos tonificantes y la reducción del estrés crónico. Evita el exceso de actividad nocturna y el frío directo en zona lumbar.",
};

/* ══════════════════════════════════════════════
   VIDEOS POR RESULTADO
══════════════════════════════════════════════ */
const VIDEOS_CONSTITUCION: Record<string, string | undefined> = {};

const VIDEOS_ELEMENTO: Record<string, string | undefined> = {
  "Madera": "1gMBVFKMAXY",
  "Fuego":  "oqmoovl3Yio",
  "Tierra": "tXqEjnQPgwc",
  "Metal":  "BzgxPMYOqrA",
  "Agua":   "o2ot4bFWMoQ",
};

const VIDEOS_DESEQUILIBRIO: Record<string, string | undefined> = {};


/* ══════════════════════════════════════════════
   ICONOS DE CATEGORÍA
══════════════════════════════════════════════ */
const TeaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440q33 0 56.5 23.5T720-760v80h40q33 0 56.5 23.5T840-600v200q0 33-23.5 56.5T760-320h-40v120q0 33-23.5 56.5T640-120H200Zm0-80h440v-560H200v560Zm520-160h40v-200h-40v200ZM360-400q-50 0-85-35t-35-85v-120h240v120q0 50-35 85t-85 35Zm-60-160v80q0 25 17.5 42.5T360-420q25 0 42.5-17.5T420-480v-80H300Zm60 80Z"/>
  </svg>
);

const HerbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
    <path d="M440-120v-319q-64 0-123-24.5T213-533q-45-45-69-104t-24-123v-80h80q63 0 122 24.5T426-746q31 31 51.5 68t31.5 79q5-7 11-13.5t13-13.5q45-45 104-69.5T760-720h80v80q0 64-24.5 123T746-413q-45 45-103.5 69T520-320v200h-80Zm0-400q0-48-18.5-91.5T369-689q-34-34-77.5-52.5T200-760q0 48 18 92t52 78q34 34 78 52t92 18Zm80 120q48 0 91.5-18t77.5-52q34-34 52.5-78t18.5-92q-48 0-92 18.5T590-569q-34 34-52 77.5T520-400Z"/>
  </svg>
);

const LifestyleIconSm = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
    <path d="M480-80q-73-9-145-39.5T206.5-207Q150-264 115-351T80-560v-40h40q51 0 105 13t101 39q12-86 54.5-176.5T480-880q57 65 99.5 155.5T634-548q47-26 101-39t105-13h40v40q0 122-35 209t-91.5 144q-56.5 57-128 87.5T480-80Zm-2-82q-11-166-98.5-251T162-518q11 171 101.5 255T478-162Zm2-254q15-22 36.5-45.5T558-502q-2-57-22.5-119T480-742q-35 59-55.5 121T402-502q20 17 42 40.5t36 45.5Zm78 236q37-12 77-35t74.5-62.5q34.5-39.5 59-98.5T798-518q-94 14-165 62.5T524-332q12 32 20.5 70t13.5 82Z"/>
  </svg>
);

const NutriIconCustom = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
    <path d="M480-28 346-160H160v-186L28-480l132-134v-186h186l134-132 134 132h186v186l132 134-132 134v186H614L480-28Zm0-112 80-80v-148q-26-15-43-50.5T500-500q0-58 26-99t64-41q37 0 63.5 41t26.5 99q0 47-17 82.5T620-368v128h100v-140l100-100-100-100v-140H580L480-820 380-720H240v140L140-480l100 100v140h100v-160q-26-6-43-27.5T280-477v-163h40v151h30v-151h40v151h30v-151h40v163q0 28-17 49.5T400-400v180l80 80Zm0-340Z"/>
  </svg>
);


/* ══════════════════════════════════════════════
   CAJA DE CATEGORÍA DE RECOMENDACIONES
══════════════════════════════════════════════ */
const RecBox = ({
  title,
  icon,
  items,
  accentColor,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  accentColor?: string;
}) => {
  const c = accentColor ?? tcmTxt;
  return (
    <Box
      bg={`${tcmBg}cc`}
      border={`1px solid ${c}33`}
      borderRadius="2xl"
      p={{ base: 5, md: 6 }}
      sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      <Flex align="center" gap={2.5} mb={4}>
        <Box
          w="32px"
          h="32px"
          borderRadius="full"
          bg={`${c}22`}
          border={`1px solid ${c}66`}
          boxShadow={`0 0 10px ${c}55, 0 0 4px ${c}33`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          color={c}
        >
          {icon}
        </Box>
        <Text
          color={c}
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="700"
          letterSpacing="0.07em"
          fontFamily="'EB Garamond', serif"
        >
          {title}
        </Text>
      </Flex>
      <Flex direction="column" gap={2.5}>
        {items.map((item, i) => (
          <Flex key={i} gap={2.5} align="flex-start">
            <Box
              w="5px"
              h="5px"
              borderRadius="full"
              bg={`${c}66`}
              mt="15px"
              flexShrink={0}
            />
            <Text
              color={`${c}cc`}
              fontSize={{ base: "lg", md: "xl" }}
              lineHeight="1.75"
              letterSpacing="0.015em"
            >
              {item}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};

/* ══════════════════════════════════════════════
   TARJETA DE ESTADO DE TEST (simplificada)
══════════════════════════════════════════════ */
const TestStatusCard = ({
  label,
  link,
  result,
  icon,
  navigate,
}: {
  label: string;
  link: string;
  result: string | null;
  icon: React.ReactNode;
  navigate: (path: string) => void;
}) => {
  const done = !!result;
  return (
    <Box
      as="button"
      onClick={() => navigate(link)}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={3}
      bg={done ? `${tcmBg}ee` : `${tcmBg}55`}
      border={`1px solid ${done ? tcmTxt + "55" : tcmTxt + "1a"}`}
      borderRadius="2xl"
      px={{ base: 4, md: 5 }}
      py={{ base: 6, md: 7 }}
      cursor="pointer"
      borderColor={`${tcmTxt}44`}
      transition="all 0.22s ease"
      boxShadow={`0 4px 20px rgba(0,0,0,0.3), 0 0 18px ${tcmTxt}52`}
      _hover={{
        borderColor: `${tcmTxt}84`,
      }}
      w="100%"
      textAlign="center"
    >
      {/* Icono iluminado */}
      <Box
        w={{ base: "54px", md: "60px" }}
        h={{ base: "54px", md: "60px" }}
        borderRadius="full"
        bg={tcmBg}
        border={`1px solid ${done ? tcmTxt + "55" : tcmTxt + "1a"}`}
        boxShadow="none"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {icon}
      </Box>

      {/* Título */}
      <Text
        color={done ? tcmTxt : `${tcmTxt}66`}
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="600"
        fontFamily="'EB Garamond', serif"
        letterSpacing="0.03em"
        lineHeight="1.3"
      >
        {label}
      </Text>
    </Box>
  );
};

/* ══════════════════════════════════════════════
   SECCIÓN DE RESULTADO
══════════════════════════════════════════════ */
type ResultSectionProps = {
  testNum: number;
  testLabel: string;
  testLink: string;
  headerIcon: React.ReactNode;
  result: string | null;
  recs: Record<string, Recs>;
  descriptions: Record<string, string>;
  videos: Record<string, string | undefined>;
  navigate: (path: string) => void;
  useElementColor?: boolean;
  onSaberMas: () => void;
  onDownloadPdf?: () => void;
};

const ResultSection = ({
  testNum,
  testLabel,
  testLink,
  headerIcon,
  result,
  recs,
  descriptions,
  videos,
  navigate,
  useElementColor,
  onSaberMas,
  onDownloadPdf,
}: ResultSectionProps) => {
  const locked = !result;
  const rec = result ? recs[result] : null;
  const video = result ? videos[result] : undefined;
  const description = result ? descriptions[result] : undefined;
  const elTheme = result && useElementColor ? getTheme(result) : null;

  return (
    <Box
      w="100%"
      maxW="900px"
      bg={tcmBg}
      border={`1px solid ${locked ? tcmTxt + "1a" : tcmTxt + "33"}`}
      borderRadius="3xl"
      px={{ base: 6, md: 10 }}
      pt={{ base: 8, md: 10 }}
      pb={{ base: 8, md: 10 }}
      boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
      // boxShadow={
      //   locked
      //     ? "0 4px 24px rgba(0,0,0,0.2)"
      //     : `0 6px 40px rgba(0,0,0,0.3), 0 0 40px ${tcmTxt}15`
      // }
    >
      {/* ── Encabezado ── */}
      <Flex w="100%" align={{ base: "flex-start", md: "center" }} justify={{ base: "flex-start", md: "space-between" }} gap={4} mb={{ base: 6, md: 8 }} flexDirection={{ base: "column", md: "row" }}>
        <Flex align="center" gap={4}>
          <Box
            w={{ base: "46px", md: "54px" }}
            h={{ base: "46px", md: "54px" }}
            borderRadius="full"
            bg={`${tcmBg}dd`}
            border={`2px solid ${locked ? tcmTxt + "22" : tcmTxt + "66"}`}
            boxShadow={locked ? "none" : `0 0 22px ${tcmTxt}66, 0 0 8px ${tcmTxt}44`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            {headerIcon}
          </Box>
          <Text
            color={locked ? `${tcmTxt}44` : tcmTxt}
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            fontFamily="'EB Garamond', serif"
            lineHeight="1.1"
            letterSpacing="0.04em"
          >
            {testNum}. {testLabel}
          </Text>
        </Flex>
        {result && (
          <Box
            bg={elTheme ? `${elTheme.accent}18` : `${tcmTxt}15`}
            border={`1.5px solid ${elTheme ? elTheme.accent + "88" : tcmTxt + "77"}`}
            borderRadius="full"
            px={{ base: 4, md: 5 }}
            py={{ base: 1, md: 1.5 }}
            alignSelf={{ base: "center", md: "auto" }}
            boxShadow={`0 0 20px ${elTheme ? elTheme.accent + "55" : tcmTxt + "55"}, 0 0 8px ${elTheme ? elTheme.accent + "33" : tcmTxt + "33"}`}
          >
            <Flex align="center" gap={2}>
              {elTheme?.icon && (
                <Box
                  w="22px"
                  h="22px"
                  color={elTheme.accent}
                  flexShrink={0}
                  filter={`drop-shadow(0 0 4px ${elTheme.accent}88)`}
                >
                  {elTheme.icon}
                </Box>
              )}
              <Text
                color={elTheme ? elTheme.accent : tcmTxt}
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                letterSpacing="0.06em"
                fontFamily="'EB Garamond', serif"
                filter={`drop-shadow(0 0 6px ${elTheme ? elTheme.accent + "88" : tcmTxt + "88"})`}
              >
                {result}
              </Text>
            </Flex>
          </Box>
        )}
      </Flex>

      {/* ── BLOQUEADO ── */}
      {locked ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap={5}
          w="100%"
          bg={`${tcmBg}44`}
          border={`1px dashed ${tcmTxt}22`}
          borderRadius="2xl"
          py={{ base: 12, md: 16 }}
          px={{ base: 6, md: 12 }}
        >
          <Box color={`${tcmTxt}33`}>
            <svg xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 -960 960 960" width="44px" fill={`${tcmTxt}44`}>
              <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
            </svg>
          </Box>
          <Text
            color={`${tcmTxt}44`}
            fontSize={{ base: "lg", md: "xl" }}
            fontStyle="italic"
            fontFamily="'EB Garamond', serif"
            letterSpacing="0.03em"
            textAlign="center"
          >
            Completa el test para desbloquear tu resultado personalizado
          </Text>
          <Box
            as="button"
            onClick={() => navigate(testLink)}
            px={8}
            py={3}
            borderRadius="full"
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="600"
            letterSpacing="0.08em"
            border={`1.5px solid ${tcmTxt}74`}
            boxShadow={`0 0 24px ${tcmTxt}77, 0 0 8px ${tcmTxt}55`}
            bg={`${tcmBg}99`}
            color={`${tcmTxt}99`}
            cursor="pointer"
            transition="all 0.22s"
            _hover={{
              bg: `rgba(107,4,4,0.65)`,
              borderColor: tcmTxt,
              color: tcmTxt,
            }}
          >
            Hacer test de {testLabel}
          </Box>
        </Flex>
      ) : (
        /* ── DESBLOQUEADO ── */
        <Flex direction="column" gap={4}>

          {/* Vídeo (solo si existe) */}
          {video && (
            <Box
              w="100%"
              aspectRatio={16 / 9}
              borderRadius="2xl"
              overflow="hidden"
              boxShadow={`0 8px 40px rgba(0,0,0,0.5), 0 0 48px ${tcmTxt}77, 0 0 14px ${tcmTxt}55`}
              bg="rgba(0,0,0,0.45)"
              border={`2px solid ${tcmTxt}bb`}
            >
              <iframe
                style={{ width: "100%", height: "100%", border: "none" }}
                src={`https://www.youtube.com/embed/${video}`}
                title={testLabel}
                allowFullScreen
              />
            </Box>
          )}

          {/* Descripción */}
          {description && (() => {
            const c = elTheme ? elTheme.accent : tcmTxt;
            return (
              <Box
                w="100%"
                bg={`${tcmBg}66`}
                border={`1px solid ${c}28`}
                borderRadius="2xl"
                px={{ base: 6, md: 10 }}
                py={{ base: 5, md: 7 }}
                sx={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
              >
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  color={`${c}bb`}
                  lineHeight="1.9"
                  fontStyle="italic"
                  letterSpacing="0.02em"
                  textAlign="center"
                  fontFamily="'EB Garamond', serif"
                >
                  {description}
                </Text>
              </Box>
            );
          })()}


          {/* Recomendaciones */}
          {rec && (() => {
            const c = elTheme ? elTheme.accent : tcmTxt;
            return (
              <Box w="100%">
                <Flex align="center" gap={3} mb={4}>
                  <Box flex="1" h="1px" bg={`${c}22`} borderRadius="full" />
                  <Text
                    color={`${c}66`}
                    fontSize="xs"
                    letterSpacing="0.25em"
                    textTransform="uppercase"
                    fontFamily="'EB Garamond', serif"
                  >
                    Recomendaciones
                  </Text>
                  <Box flex="1" h="1px" bg={`${c}22`} borderRadius="full" />
                </Flex>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <RecBox title="Infusiones y Tés" icon={<TeaIcon />} items={rec.infusiones} accentColor={c} />
                  <RecBox title="Hierbas Medicinales" icon={<HerbIcon />} items={rec.hierbas} accentColor={c} />
                  <RecBox title="Estilo de Vida" icon={<LifestyleIconSm />} items={rec.estiloDeVida} accentColor={c} />
                  <RecBox title="Nutrición" icon={<NutriIconCustom />} items={rec.nutricion} accentColor={c} />
                </SimpleGrid>
              </Box>
            );
          })()}

          {/* Botones rehacer + quiero saber más */}
          <Flex justify="center" direction="column" align="center" gap={4} mt={4} wrap="wrap">
            <Box
              as="button"
              onClick={onSaberMas}
              px={{ base: 7, md: 10 }}
              py={{ base: 3, md: 4 }}
              borderRadius="full"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="700"
              letterSpacing="0.1em"
              fontStyle="italic"
              border={`2px solid ${tcmTxt}`}
              bg={tcmTxt}
              color={tcmBg}
              cursor="pointer"
              transition="all 0.25s"
              boxShadow={`0 0 28px ${tcmTxt}55, 0 4px 16px rgba(0,0,0,0.25)`}
              _hover={{
                bg: "white",
                borderColor: "white",
                color: tcmBg,
                boxShadow: `0 0 44px ${tcmTxt}88, 0 6px 24px rgba(0,0,0,0.3)`,
                transform: "translateY(-2px)",
              }}
              _active={{ transform: "translateY(0)" }}
            >
              Quiero saber más
            </Box>
            {onDownloadPdf && (
              <Box
                as="button"
                onClick={onDownloadPdf}
                px={7}
                py={2.5}
                borderRadius="full"
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="600"
                letterSpacing="0.08em"
                border="1.5px solid rgba(218,113,113,0.6)"
                bg="transparent"
                color="#da7171"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  boxShadow: "0 0 16px rgba(218,113,113,0.35)",
                  borderColor: "#da7171",
                }}
              >
                Descargar PDF
              </Box>
            )}
            <Box
              as="button"
              onClick={() => navigate(testLink)}
              px={7}
              py={2.5}
              borderRadius="full"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="600"
              letterSpacing="0.08em"
              border={`1px solid ${tcmTxt}33`}
              bg="transparent"
              color={`${tcmTxt}77`}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                bg: `${tcmTxt}18`,
                borderColor: `${tcmTxt}66`,
                color: tcmTxt,
              }}
            >
              Rehacer test
            </Box>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

/* ══════════════════════════════════════════════
   ICONOS PARA CABECERAS DE SECCIÓN
══════════════════════════════════════════════ */
const IconConstitucion = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill={tcmTxt}>
    <path d="M343.5-743.5Q320-767 320-800t23.5-56.5Q367-880 400-880t56.5 23.5Q480-833 480-800t-23.5 56.5Q433-720 400-720t-56.5-23.5ZM731-269q29-29 29-71t-29-71q-29-29-71-29t-71 29q-29 29-29 71t29 71q29 29 71 29t71-29ZM864-80 756-188q-22 14-46 21t-50 7q-75 0-127.5-52.5T480-340q0-75 52.5-127.5T660-520q75 0 127.5 52.5T840-340q0 26-7 50t-21 46l108 108-56 56Zm-424 0v-121q15 24 35.5 44t44.5 36v41h-80Zm-160 0v-520q-61-5-121-14.5T40-640l20-80q84 23 168.5 31.5T400-680q87 0 171.5-8.5T740-720l20 80q-59 16-119 25.5T520-600v41q-54 35-87 92.5T400-340v10q0 5 1 10h-41v240h-80Z"/>
  </svg>
);

const IconElemento = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill={tcmTxt}>
    <path d="M480-480Zm0 360q-18 0-34.5-6.5T416-146L148-415q-35-35-51.5-80T80-589q0-103 67-177t167-74q48 0 90.5 19t75.5 53q32-34 74.5-53t90.5-19q100 0 167.5 74T880-590q0 49-17 94t-51 80L543-146q-13 13-29 19.5t-34 6.5Zm40-520q10 0 19 5t14 13l68 102h166q7-17 10.5-34.5T801-590q-2-69-46-118.5T645-758q-31 0-59.5 12T536-711l-27 29q-5 6-13 9.5t-16 3.5q-8 0-16-3.5t-14-9.5l-27-29q-21-23-49-36t-60-13q-66 0-110 50.5T160-590q0 18 3 35.5t10 34.5h187q10 0 19 5t14 13l35 52 54-162q4-12 14.5-20t23.5-8Zm12 130-54 162q-4 12-15 20t-24 8q-10 0-19-5t-14-13l-68-102H236l237 237q2 2 3.5 2.5t3.5.5q2 0 3.5-.5t3.5-2.5l236-237H600q-10 0-19-5t-15-13l-34-52Z"/>
  </svg>
);

const IconDesequilibrio = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill={tcmTxt}>
    <path d="M824-120 636-308q-41 32-90.5 50T440-240q-90 0-162.5-44T163-400h98q34 37 79.5 58.5T440-320q100 0 170-70t70-170q0-100-70-170t-170-70q-94 0-162.5 63.5T201-580h-80q8-127 99.5-213.5T440-880q134 0 227 93t93 227q0 56-18 105.5T692-364l188 188-56 56ZM397-400l-63-208-52 148H80v-60h160l66-190h60l61 204 43-134h60l60 120h30v60h-67l-47-94-50 154h-59Z"/>
  </svg>
);

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════ */
export default function TCMespacio() {
  const navigate = useNavigate();
  const [tcmData, setTcmData] = useState<TcmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [diagModalOpen, setDiagModalOpen] = useState(false);
  const [saberMasOpen, setSaberMasOpen] = useState(false);

  const fetchData = () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setLoading(false);
      return;
    }
    axios
      .get(`${API_URL}/tcm/${userId}`)
      .then((r) => setTcmData(r.data))
      .catch(() => setTcmData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    fetchData();

    const onFocus = () => fetchData();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const constitucion = tcmData?.constitucion ?? null;
  const elemento = tcmData?.elemento ?? null;
  const desequilibrio = tcmData?.desequilibrio ?? null;

  const handleDownloadPdf = async (testNum: number, resultado: string | null) => {
    const userId = sessionStorage.getItem("userId");
    if (!userId || !resultado) return;
    try {
      const { data } = await axios.get<TcmRespuesta[]>(
        `${API_URL}/tcm/respuestas/${userId}/${testNum}`
      );
      generateTcmPdf(testNum, data, resultado);
    } catch (e) {
      console.error("Error al descargar respuestas PDF:", e);
    }
  };

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
          gap="20px"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<TCMIcon size={{ base: "40px", md: "60px" }} />}
            title="Medicina China"
            bgColor={tcmBg}
            color={tcmTxt}
            maxW="900px"
            mb={{ base: 0, md: 0 }}
          />

          {/* ══ SPINNER DE CARGA ══ */}
          {loading && <SpinnerTurquesa />}
          {!loading && (
            <>
              {/* ══ TARJETAS DE ESTADO DE TESTS ══ */}
              <Box
                w="100%"
                maxW="900px"
                mt="20px"
                boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
                bg={tcmBg}
                border={`1.5px solid ${tcmTxt}55`}
                borderRadius="3xl"
                px={{ base: 6, md: 10 }}
                pt={{ base: 8, md: 10 }}
                pb={{ base: 8, md: 10 }}
              >
                <Flex justify="center" align="center" gap={3} mb={{ base: 8, md: 10 }}>
                  <Box
                    color={tcmTxt}
                    filter={`drop-shadow(0 0 8px ${tcmTxt}88)`}
                    flexShrink={0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill={tcmTxt}>
                      <path d="M440-120v-319q-64 0-123-24.5T213-533q-45-45-69-104t-24-123v-80h80q63 0 122 24.5T426-746q31 31 51.5 68t31.5 79q5-7 11-13.5t13-13.5q45-45 104-69.5T760-720h80v80q0 64-24.5 123T746-413q-45 45-103.5 69T520-320v200h-80Zm0-400q0-48-18.5-91.5T369-689q-34-34-77.5-52.5T200-760q0 48 18 92t52 78q34 34 78 52t92 18Zm80 120q48 0 91.5-18t77.5-52q34-34 52.5-78t18.5-92q-48 0-92 18.5T590-569q-34 34-52 77.5T520-400Z"/>
                    </svg>
                  </Box>
                  <Text
                    color={tcmTxt}
                    fontSize={{ base: "2xl", md: "3xl" }}
                    lineHeight="1"
                    textAlign="center"
                    fontWeight="700"
                    letterSpacing="0.05em"
                    filter={`drop-shadow(0 0 6px ${tcmTxt}66)`}
                    fontFamily="'EB Garamond', serif"
                  >
                    Tests para el Autoconocimiento
                  </Text>
                </Flex>

                <SimpleGrid w="100%" columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 5 }}>
                  <TestStatusCard
                    label="Conoce tu constitución"
                    link="/tcm/test/1"
                    result={constitucion}
                    icon={<IconConstitucion />}
                    navigate={navigate}
                  />
                  <TestStatusCard
                    label="Tu elemento predominante"
                    link="/tcm/test/2"
                    result={elemento}
                    icon={<IconElemento />}
                    navigate={navigate}
                  />
                  <TestStatusCard
                    label="Tu desequilibrio actual"
                    link="/tcm/test/3"
                    result={desequilibrio}
                    icon={<IconDesequilibrio />}
                    navigate={navigate}
                  />
                </SimpleGrid>
              </Box>

              {/* ══ SECCIÓN 1: CONSTITUCIÓN ══ */}
              <ResultSection
                testNum={1}
                testLabel="Tu Constitución"
                testLink="/tcm/test/1"
                headerIcon={<IconConstitucion />}
                result={constitucion}
                recs={RECS_CONSTITUCIONES}
                descriptions={DESC_CONSTITUCION}
                videos={VIDEOS_CONSTITUCION}
                navigate={navigate}
                onSaberMas={() => setSaberMasOpen(true)}
                onDownloadPdf={constitucion ? () => handleDownloadPdf(1, constitucion) : undefined}
              />

              {/* ══ SECCIÓN 2: ELEMENTO ══ */}
              <ResultSection
                testNum={2}
                testLabel="Tu Elemento Predominante"
                testLink="/tcm/test/2"
                headerIcon={<IconElemento />}
                result={elemento}
                recs={RECS_ELEMENTOS}
                descriptions={DESC_ELEMENTO}
                videos={VIDEOS_ELEMENTO}
                navigate={navigate}
                useElementColor
                onSaberMas={() => setSaberMasOpen(true)}
                onDownloadPdf={elemento ? () => handleDownloadPdf(2, elemento) : undefined}
              />

              {/* ══ SECCIÓN 3: DESEQUILIBRIO ══ */}
              <ResultSection
                testNum={3}
                testLabel="Tu Desequilibrio Actual"
                testLink="/tcm/test/3"
                headerIcon={<IconDesequilibrio />}
                result={desequilibrio}
                recs={RECS_DESEQUILIBRIOS}
                descriptions={DESC_DESEQUILIBRIO}
                videos={VIDEOS_DESEQUILIBRIO}
                navigate={navigate}
                useElementColor
                onSaberMas={() => setSaberMasOpen(true)}
                onDownloadPdf={desequilibrio ? () => handleDownloadPdf(3, desequilibrio) : undefined}
              />
            </>
          )}
        </Flex>
      </Box>

      {/* ── FOOTER ── */}
      <SiteFooter />

      <ContactModal
        isOpen={saberMasOpen}
        onClose={() => setSaberMasOpen(false)}
        title="Evaluación personalizada"
        icon={<TCMIcon size="24px" />}
        bgColor={tcmBg}
        color={tcmTxt}
        emailSubject="Solicitud de autoevaluación personalizada — TCM"
        showDescription={true}
        showCheckboxes={false}
        emailOrPhone={true}
        textareaPlaceholder="¿Te gustaría contarme algo por adelantado?"
      />

      <ContactModal
        isOpen={diagModalOpen}
        onClose={() => setDiagModalOpen(false)}
        title="Diagnóstico completo"
        subtitle="Déjame tus datos y me pondré en contacto contigo para ofrecerte un diagnóstico personalizado de Medicina China."
        bgColor={tcmBg}
        color={tcmTxt}
        emailSubject="Solicitud de diagnóstico completo TCM"
        showDescription={false}
      />
    </Box>
  );
}
