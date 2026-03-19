import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Collapse, Flex, Grid, Text } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { astrologiaBg, astrologiaTxt, AstrologiaIcon } from "../../../GlobalVariables";
import { modulosAstrologia } from "../../../hardCoded/aprendizajes/Astrologia/ModulosAstrologia";
import type { Submodulo } from "../../../dtos/aprendizaje.type";

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

type FieldKey = "ascendente" | "sol" | "luna";

/* ══════════════════════════════════════════════
   FONDO ESPACIAL
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
      style={{ background: "rgba(8,13,30,0.58)" }}
    />
  </Box>
);

/* ══════════════════════════════════════════════
   GLIFO ZODIACAL
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

/* ══════════════════════════════════════════════
   CONFIGURACIÓN DE COLUMNAS
══════════════════════════════════════════════ */
const COLUMNS: {
  key: FieldKey;
  label: string;
  icon: (size?: number) => React.ReactNode;
  moduleIndex: number;
  fieldLabel: string;
}[] = [
  {
    key: "ascendente",
    label: "El Ascendente",
    icon: (s = 28) => <AscendenteFieldIcon size={s} />,
    moduleIndex: 2,
    fieldLabel: "Ascendente",
  },
  {
    key: "sol",
    label: "El Sol",
    icon: (s = 28) => <SolFieldIcon size={s} />,
    moduleIndex: 3,
    fieldLabel: "Sol en",
  },
  {
    key: "luna",
    label: "La Luna",
    icon: (s = 28) => <LunaFieldIcon size={s} />,
    moduleIndex: 4,
    fieldLabel: "Luna en",
  },
];

/* ══════════════════════════════════════════════
   MODAL DE RECURSOS
══════════════════════════════════════════════ */
const RecursosModal = ({
  submodule,
  onClose,
}: {
  submodule: Submodulo;
  onClose: () => void;
}) => {
  const [letraOpen, setLetraOpen] = useState(false);

  return (
    <Box
      position="fixed" inset="0" zIndex={1000}
      display="flex" alignItems="center" justifyContent="center"
      px={4}
      onClick={onClose}
    >
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.80)" />

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

        {/* Botón X */}
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

        <Box
          position="relative" zIndex={1}
          px={6} py={7}
          display="flex" flexDirection="column" gap={4}
          overflowY="auto" flex="1"
        >
          {/* Cabecera */}
          <Box
            bg={astrologiaBg}
            border={`1.5px solid ${astrologiaTxt}33`}
            borderRadius="xl"
            px={6} py={5}
            boxShadow={`0 0 28px ${astrologiaTxt}22, inset 0 0 20px rgba(0,0,0,0.3)`}
          >
            <Text
              color={astrologiaTxt}
              fontSize="2xl" fontWeight="700"
              fontFamily="'EB Garamond', serif" letterSpacing="0.07em"
              textAlign="center"
              style={{ textShadow: `0 0 10px ${astrologiaTxt}bb, 0 0 20px ${astrologiaTxt}66` }}
            >
              {submodule.nom}
            </Text>
          </Box>

          {/* Vídeo */}
          <Box
            borderRadius="xl"
            overflow="hidden"
            border={`1px solid ${astrologiaTxt}22`}
            style={{ aspectRatio: "16/9", flexShrink: 0 }}
            boxShadow={`0 4px 24px rgba(0,0,0,0.55), 0 0 24px ${astrologiaTxt}18`}
          >
            <iframe
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              src={`https://www.youtube.com/embed/${submodule.video}`}
              title={submodule.nom}
              allowFullScreen
            />
          </Box>

          {/* Descripción */}
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
              {submodule.descripcion}
            </Text>
          </Box>

          {/* Transcripción */}
          {submodule.letra && (
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
                    {submodule.letra}
                  </Text>
                </Box>
              </Collapse>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════ */
export default function AstrologiaRecursos() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<Submodulo | null>(null);

  // Módulo de Introducción (índice 1 en modulosAstrologia)
  const introSubmodules = modulosAstrologia[1].submodules;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 4, md: 8, lg: 14 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Astrología"
            subtitle="El Ascendente, el Sol y la Luna"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            maxW="1100px"
            onIconClick={() => navigate("/aprendizaje/modulosPage/Astrología/astro-curso-1")}
          />

          {/* Card grande con fondo espacial */}
          <Box
            w="100%" maxW="1100px"
            position="relative"
            overflow="hidden"
            border={`1.5px solid ${astrologiaTxt}28`}
            borderRadius="3xl"
            px={{ base: 4, md: 8 }}
            pt={{ base: 8, md: 10 }}
            pb={{ base: 8, md: 10 }}
            boxShadow={`0 4px 32px rgba(0,0,0,0.6), 0 0 60px ${astrologiaTxt}18`}
          >
            <SpaceBg />

            <Box position="relative" zIndex={1}>
              {/* Título */}
              <Flex justify="center" align="center" gap={3} mb={{ base: 8, md: 10 }}>
                <Box flex="1" h="1px" bg={`${astrologiaTxt}1a`} borderRadius="full" />
                <Text
                  color={astrologiaTxt}
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="700"
                  fontFamily="'EB Garamond', serif"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                  style={{
                    textShadow: `0 0 14px ${astrologiaTxt}cc, 0 0 28px ${astrologiaTxt}66, 0 0 48px ${astrologiaTxt}33`,
                  }}
                >
                  Recursos
                </Text>
                <Box flex="1" h="1px" bg={`${astrologiaTxt}1a`} borderRadius="full" />
              </Flex>

              {/* ── Sección Introducción ── */}
              <Box mb={{ base: 8, md: 10 }}>
                <Text
                  color={astrologiaTxt}
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="600"
                  fontFamily="'EB Garamond', serif"
                  letterSpacing="0.08em"
                  mb={4}
                  style={{ textShadow: `0 0 10px ${astrologiaTxt}99` }}
                >
                  Introducción
                </Text>
                <Flex direction="column" gap={2}>
                  {introSubmodules.map((sub) => (
                    <Flex
                      key={sub.id}
                      as="button"
                      align="center"
                      gap={3}
                      w="100%"
                      px={4} py={3}
                      borderRadius="xl"
                      border={`1px solid ${astrologiaTxt}22`}
                      bg={`${astrologiaBg}88`}
                      cursor="pointer"
                      transition="all 0.18s ease"
                      _hover={{
                        bg: `${astrologiaTxt}10`,
                        borderColor: `${astrologiaTxt}44`,
                        transform: "translateX(5px)",
                      }}
                      onClick={() => setModal(sub)}
                    >
                      <Box
                        w="34px" h="34px"
                        borderRadius="full"
                        bg={`${astrologiaTxt}0c`}
                        border={`1px solid ${astrologiaTxt}2a`}
                        display="flex" alignItems="center" justifyContent="center"
                        color={astrologiaTxt}
                        flexShrink={0}
                        boxShadow={`0 0 8px ${astrologiaTxt}18`}
                      >
                        <AstrologiaIcon size="18px" />
                      </Box>
                      <Text
                        color={`${astrologiaTxt}dd`}
                        fontSize={{ base: "lg", md: "xl" }}
                        fontFamily="'EB Garamond', serif"
                        letterSpacing="0.04em"
                      >
                        {sub.nom}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>

              {/* Separador */}
              <Box h="1px" bg={`${astrologiaTxt}1a`} borderRadius="full" mb={{ base: 8, md: 10 }} />

              {/* 3 columnas zodiacales */}
              <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
                gap={{ base: 6, md: 5, lg: 6 }}
              >
                {COLUMNS.map((col) => (
                  <Box
                    key={col.key}
                    position="relative"
                    overflow="hidden"
                    borderRadius="2xl"
                    border={`1px solid ${astrologiaTxt}28`}
                    bg={`${astrologiaBg}bb`}
                    boxShadow={`0 0 40px ${astrologiaTxt}10, inset 0 0 24px rgba(0,0,0,0.35)`}
                  >
                    {/* Cabecera de columna */}
                    <Flex
                      align="center"
                      justify="center"
                      gap={2.5}
                      px={4} py={5}
                      borderBottom={`1px solid ${astrologiaTxt}20`}
                      bg={`${astrologiaBg}66`}
                    >
                      <Box
                        color={astrologiaTxt}
                        filter={`drop-shadow(0 0 12px ${astrologiaTxt}dd) drop-shadow(0 0 24px ${astrologiaTxt}88)`}
                      >
                        {col.icon(30)}
                      </Box>
                      <Text
                        color={astrologiaTxt}
                        fontSize={{ base: "xl", md: "lg", lg: "xl" }}
                        fontWeight="700"
                        fontFamily="'EB Garamond', serif"
                        letterSpacing="0.08em"
                        style={{
                          textShadow: `0 0 12px ${astrologiaTxt}bb, 0 0 24px ${astrologiaTxt}66, 0 0 40px ${astrologiaTxt}33`,
                        }}
                      >
                        {col.label}
                      </Text>
                    </Flex>

                    {/* 12 signos zodiacales */}
                    <Box px={3} py={3} display="flex" flexDirection="column" gap={0.5}>
                      {ZODIAC_SIGNS.map((sign, idx) => (
                        <Flex
                          key={sign.name}
                          as="button"
                          align="center"
                          gap={3}
                          w="100%"
                          px={3} py={2.5}
                          borderRadius="lg"
                          cursor="pointer"
                          transition="all 0.18s ease"
                          _hover={{
                            bg: `${astrologiaTxt}10`,
                            transform: "translateX(5px)",
                            filter: `drop-shadow(0 0 6px ${astrologiaTxt}44)`,
                          }}
                          onClick={() => setModal(modulosAstrologia[col.moduleIndex].submodules[idx])}
                        >
                          <Box
                            w="34px" h="34px"
                            borderRadius="full"
                            bg={`${astrologiaTxt}0c`}
                            border={`1px solid ${astrologiaTxt}2a`}
                            display="flex" alignItems="center" justifyContent="center"
                            color={astrologiaTxt}
                            flexShrink={0}
                            transition="all 0.18s ease"
                            boxShadow={`0 0 8px ${astrologiaTxt}18`}
                            _groupHover={{ boxShadow: `0 0 14px ${astrologiaTxt}55` }}
                          >
                            <ZodiacGlyph symbol={sign.symbol} size={18} />
                          </Box>
                          <Text
                            color={`${astrologiaTxt}dd`}
                            fontSize={{ base: "lg", md: "md", lg: "lg" }}
                            fontFamily="'EB Garamond', serif"
                            letterSpacing="0.04em"
                          >
                            {sign.name}
                          </Text>
                        </Flex>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Grid>
            </Box>
          </Box>
        </Flex>
      </Box>

      <SiteFooter />

      {modal && (
        <RecursosModal
          submodule={modal}
          onClose={() => setModal(null)}
        />
      )}
    </Box>
  );
}
