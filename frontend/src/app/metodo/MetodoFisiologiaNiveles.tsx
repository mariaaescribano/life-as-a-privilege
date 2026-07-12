import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { Reveal } from "../../components/global/Reveal";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon,
} from "../../GlobalVariables";

// ── Niveles del recorrido de Fisiología ──────────────────────────────────
// «Bajar a lo más pequeño y volver a subir, nivel a nivel». No son disciplinas:
// son bloques dentro de Fisiología. Solo el Nivel 1 (La materia) está abierto;
// los otros dos se irán construyendo y desbloqueando.
interface Nivel {
  n: number;
  titulo: string;
  sub: string;
  ruta?: string;
  /** Flag de metodo_fisiologia.data que debe estar en true para desbloquear
   *  este nivel. Ausente = siempre abierto (Nivel 1). El Nivel 2 se abre al
   *  terminar el Nivel 1 (estructuras_hecho); el Nivel 3 al terminar el 2
   *  (organos_hecho). */
  requiere?: string;
  /** Antetítulo (por defecto «Nivel {n}»). P.ej. la práctica usa «Práctica». */
  eyebrow?: string;
  /** Si es "gota", la tarjeta muestra el icono de análisis en vez del número. */
  iconKind?: "gota";
}

const NIVELES: Nivel[] = [
  { n: 1, titulo: "MATERIA", sub: "De qué estás hecho.", ruta: "/metodo/fisiologia/particulas" },
  { n: 2, titulo: "VIDA", sub: "Cuando la materia se vuelve viva.", ruta: "/metodo/fisiologia/celula", requiere: "estructuras_hecho" },
  { n: 3, titulo: "SISTEMAS", sub: "El milagro de ser un cuerpo.", ruta: "/metodo/fisiologia/sistemas", requiere: "organos_hecho" },
  // 4ª tarjeta · práctica (no es un nivel del ascenso): va DESPUÉS de Sistemas.
  { n: 4, titulo: "TU ANALÍTICA", sub: "Aprende a leer tu análisis de sangre.", ruta: "/metodo/fisiologia/analitica", eyebrow: "Práctica", iconKind: "gota" },
];

// SVG candado (mismo que usa la caja de disciplina bloqueada).
const Candado = ({ size }: { size: any }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill="#ffffff"
       style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

// SVG gota (análisis de sangre) para la tarjeta de práctica.
const Gota = ({ size }: { size: any }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill={fisiologiaTxt}
       style={{ filter: `drop-shadow(0 1px 3px ${fisiologiaBg})` }}>
    <path d="M480-80q-133 0-226.5-92.5T160-396q0-97 76.5-210T480-880q167 161 243.5 274T800-396q0 131-93.5 223.5T480-80Z" />
  </Box>
);

// ── Caja de un nivel (tarjeta VERTICAL, para ir las 3 en fila) ──────────────
function NivelBox({ nivel, locked, onEnter }: { nivel: Nivel; locked: boolean; onEnter: () => void }) {
  return (
    <Box
      as={locked ? "div" : "button"}
      onClick={locked ? undefined : onEnter}
      position="relative"
      w="100%"
      h="100%"
      borderRadius="2xl"
      overflow="hidden"
      cursor={locked ? "default" : "pointer"}
      aria-disabled={locked}
      border={`1px solid ${locked ? `${fisiologiaTxt}33` : `${fisiologiaTxt}77`}`}
      opacity={locked ? 0.72 : 1}
      boxShadow={locked
        ? `inset 0 0 24px rgba(0,0,0,0.35)`
        : `0 0 16px ${fisiologiaTxt}26, 0 0 40px ${fisiologiaTxt}16, inset 0 0 24px rgba(0,0,0,0.25)`}
      transition="all 0.25s ease"
      _hover={locked ? undefined : {
        transform: "translateY(-6px)",
        borderColor: fisiologiaTxt,
        boxShadow: `0 0 26px ${fisiologiaTxt}88, 0 0 64px ${fisiologiaTxt}44, inset 0 0 24px rgba(0,0,0,0.2)`,
      }}
      _active={locked ? undefined : { transform: "translateY(-2px)" }}
    >
      {/* Mismo fondo de Fisiología en las 3 (unidad). Los bloqueados con velo
          oscuro extra para que se lean "apagados". */}
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl"
                         overlay={locked ? "rgba(0,0,0,0.6)" : `${fisiologiaBg}66`} />

      <Flex position="relative" zIndex={1} direction="column" align="center" textAlign="center"
            h="100%" gap={{ base: 2, md: 2.5 }} px={{ base: 5, md: 4 }} py={{ base: 6, md: 7 }}>
        {/* Círculo con el número del nivel (o icono de práctica; candado si bloqueado) */}
        <Box position="relative" flexShrink={0} w={{ base: "54px", md: "62px" }} h={{ base: "54px", md: "62px" }} mb={1}>
          <Box w="100%" h="100%" borderRadius="full"
               border={`2px solid ${locked ? `${fisiologiaTxt}88` : fisiologiaTxt}`}
               bg={`${fisiologiaBg}cc`} display="flex" alignItems="center" justifyContent="center">
            {nivel.iconKind === "gota" ? (
              <Gota size={{ base: "26px", md: "30px" }} />
            ) : (
              <Text color={fisiologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1"
                    style={{ textShadow: `0 1px 6px ${fisiologiaBg}` }}>
                {nivel.n}
              </Text>
            )}
          </Box>
          {locked && (
            <Box position="absolute" inset={0} borderRadius="full" bg="rgba(0,0,0,0.55)"
                 display="flex" alignItems="center" justifyContent="center" sx={{ backdropFilter: "blur(2px)" }}>
              <Candado size={{ base: "26px", md: "30px" }} />
            </Box>
          )}
        </Box>

        <Text color={fisiologiaTxt} fontSize="2xs" fontWeight={700} letterSpacing="0.16em" textTransform="uppercase"
              style={{ textShadow: `0 1px 3px ${fisiologiaBg}f0` }}>
          {nivel.eyebrow ?? `Nivel ${nivel.n}`}
        </Text>
        <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight={700} lineHeight="1.2"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
          {nivel.titulo}
        </Text>
        <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" lineHeight="1.55"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
          {locked ? "Próximamente" : nivel.sub}
        </Text>

        {/* Empuja la pista de acción al fondo para que las 3 tarjetas cuadren */}
        <Box flex="1" minH={{ base: 2, md: 3 }} />

        {locked ? (
          <Text color={`${fisiologiaTxt}99`} fontSize="2xs" fontWeight={700} letterSpacing="0.12em"
                 textTransform="uppercase">
            Bloqueado
          </Text>
        ) : (
          <Flex align="center" gap={1.5} color={fisiologiaTxt}>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight={700} letterSpacing="0.04em"
                  style={{ textShadow: `0 1px 4px ${fisiologiaBg}` }}>
              Entrar
            </Text>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                 w="18px" h="18px" fill="currentColor"
                 style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </Box>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaNiveles() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Flags de progreso (metodo_fisiologia.data) que desbloquean cada nivel.
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try {
          const t = await axios.get(`${API_URL}/payment/test/enabled`);
          testEnabled = !!t.data?.enabled;
        } catch { /* sin modo test */ }

        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/metodo/fisiologia"); return; }

        // Progreso guardado: sirve para desbloquear los niveles 2 y 3.
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFlags(r.data?.data ?? {});
        } catch { /* sin fila todavía → todo bloqueado salvo Nivel 1 */ }
      } catch {
        navigate("/metodo/fisiologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1200px" gap={7}>

          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Niveles"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Introducción", onClick: () => navigate("/metodo/fisiologia") }}
            extra={celulasBtn}
          />

          <Reveal direction="up" distance={18} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Subes nivel a nivel, de lo más pequeño hasta el milagro entero que eres.
            </Text>
          </Reveal>

          {/* Las 4 tarjetas en fila (en móvil se apilan). Entran de izquierda a
              derecha con retraso escalonado. La 4ª (TU ANALÍTICA) va tras Sistemas. */}
          <Flex direction={{ base: "column", md: "row" }} align="stretch"
                justify="center" gap={{ base: 4, md: 4 }} w="100%">
            {NIVELES.map((nivel, i) => {
              const locked = nivel.requiere ? !flags[nivel.requiere] : false;
              return (
                <Reveal key={nivel.n} direction="right" distance={44} delay={0.15 * i} duration={0.6}
                        flex={{ md: 1 }} w="100%" maxW={{ base: "380px", md: "none" }}
                        mx={{ base: "auto", md: 0 }} display="flex">
                  <NivelBox nivel={nivel} locked={locked}
                            onEnter={() => { if (!locked && nivel.ruta) navigate(nivel.ruta); }} />
                </Reveal>
              );
            })}
          </Flex>

          {/* ── 4ª caja · práctica (no es un nivel del ascenso): leer tu propia
              analítica. Abierta siempre. ── */}
          <Reveal direction="up" distance={22} delay={0.5} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Box as="button" onClick={() => navigate("/metodo/fisiologia/analitica")}
                 position="relative" w="100%" maxW="760px" borderRadius="2xl" overflow="hidden"
                 cursor="pointer" textAlign="left"
                 border={`1px solid ${fisiologiaTxt}77`}
                 boxShadow={`0 0 16px ${fisiologiaTxt}26, 0 0 40px ${fisiologiaTxt}16, inset 0 0 24px rgba(0,0,0,0.25)`}
                 transition="all 0.25s ease"
                 _hover={{ transform: "translateY(-4px)", borderColor: fisiologiaTxt,
                           boxShadow: `0 0 26px ${fisiologiaTxt}88, 0 0 64px ${fisiologiaTxt}44, inset 0 0 24px rgba(0,0,0,0.2)` }}
                 _active={{ transform: "translateY(-1px)" }}>
              <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" overlay={`${fisiologiaBg}66`} />
              <Flex position="relative" zIndex={1} align="center" gap={{ base: 4, md: 5 }}
                    px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }}>
                {/* Icono: gota (análisis de sangre) */}
                <Box flexShrink={0} w={{ base: "56px", md: "64px" }} h={{ base: "56px", md: "64px" }}
                     borderRadius="full" border={`2px solid ${fisiologiaTxt}`} bg={`${fisiologiaBg}cc`}
                     display="flex" alignItems="center" justifyContent="center">
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                       w={{ base: "28px", md: "32px" }} h={{ base: "28px", md: "32px" }} fill={fisiologiaTxt}
                       style={{ filter: `drop-shadow(0 1px 3px ${fisiologiaBg})` }}>
                    <path d="M480-80q-133 0-226.5-92.5T160-396q0-97 76.5-210T480-880q167 161 243.5 274T800-396q0 131-93.5 223.5T480-80Z" />
                  </Box>
                </Box>

                <Box flex="1" minW={0}>
                  <Text color={fisiologiaTxt} fontSize="2xs" fontWeight={700} letterSpacing="0.16em" textTransform="uppercase"
                        style={{ textShadow: `0 1px 3px ${fisiologiaBg}f0` }}>
                    Práctica
                  </Text>
                  <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight={700} lineHeight="1.2"
                        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
                    TU ANALÍTICA
                  </Text>
                  <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={0.5}
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
                    Aprende a leer tu análisis de sangre.
                  </Text>
                </Box>

                <Flex flexShrink={0} align="center" gap={1.5} color={fisiologiaTxt}>
                  <Text display={{ base: "none", sm: "block" }} fontSize={{ base: "sm", md: "md" }} fontWeight={700}
                        letterSpacing="0.04em" style={{ textShadow: `0 1px 4px ${fisiologiaBg}` }}>
                    Entrar
                  </Text>
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                       w="18px" h="18px" fill="currentColor" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      {celulasModal}
      <SiteFooter />
    </Box>
  );
}
