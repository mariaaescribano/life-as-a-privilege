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
  locked: boolean;
}

const NIVELES: Nivel[] = [
  { n: 1, titulo: "La materia", sub: "De qué estás hecho.", ruta: "/metodo/fisiologia/particulas", locked: false },
  { n: 2, titulo: "La vida", sub: "Cuando la materia se vuelve viva.", ruta: "/metodo/fisiologia/celula", locked: false },
  { n: 3, titulo: "El cuerpo", sub: "El milagro de ser un cuerpo.", ruta: "/metodo/fisiologia/sistemas", locked: false },
];

// SVG candado (mismo que usa la caja de disciplina bloqueada).
const Candado = ({ size }: { size: any }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill="#ffffff"
       style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

// ── Caja de un nivel (tarjeta VERTICAL, para ir las 3 en fila) ──────────────
function NivelBox({ nivel, onEnter }: { nivel: Nivel; onEnter: () => void }) {
  const locked = nivel.locked;
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
            h="100%" gap={{ base: 2.5, md: 3 }} px={{ base: 5, md: 6 }} py={{ base: 7, md: 9 }}>
        {/* Círculo con el número del nivel (candado encima si está bloqueado) */}
        <Box position="relative" flexShrink={0} w={{ base: "60px", md: "72px" }} h={{ base: "60px", md: "72px" }} mb={1}>
          <Box w="100%" h="100%" borderRadius="full"
               border={`2px solid ${locked ? `${fisiologiaTxt}88` : fisiologiaTxt}`}
               bg={`${fisiologiaBg}cc`} display="flex" alignItems="center" justifyContent="center">
            <Text color={fisiologiaTxt} fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" lineHeight="1"
                  style={{ textShadow: `0 1px 6px ${fisiologiaBg}` }}>
              {nivel.n}
            </Text>
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
          Nivel {nivel.n}
        </Text>
        <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight={700} lineHeight="1.2"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
          {nivel.titulo}
        </Text>
        <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" lineHeight="1.6"
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
        <Flex direction="column" align="center" w="100%" maxW="1040px" gap={7}>

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

          {/* Las 3 en fila (en móvil se apilan). Entran una tras otra de
              izquierda a derecha (direction="right" entra desde la izquierda),
              con retraso escalonado, para darle dinamismo. */}
          <Flex direction={{ base: "column", md: "row" }} align="stretch"
                justify="center" gap={{ base: 4, md: 5 }} w="100%">
            {NIVELES.map((nivel, i) => (
              <Reveal key={nivel.n} direction="right" distance={44} delay={0.15 * i} duration={0.6}
                      flex={{ md: 1 }} w="100%" maxW={{ base: "380px", md: "none" }}
                      mx={{ base: "auto", md: 0 }} display="flex">
                <NivelBox nivel={nivel} onEnter={() => nivel.ruta && navigate(nivel.ruta)} />
              </Reveal>
            ))}
          </Flex>
        </Flex>
      </Flex>

      {celulasModal}
      <SiteFooter />
    </Box>
  );
}
