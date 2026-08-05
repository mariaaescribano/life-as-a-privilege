import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { CabalaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { CursoCardDetalle } from "../../components/aprendizaje/CursoCardDetalle";
import { CursosGrid } from "../../components/aprendizaje/CursosGrid";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { CabalaIlustracionesModal } from "../../components/metodo/CabalaIlustracionesModal";
import { IndiceCabala } from "../../components/metodo/IndiceCabala";
import { Reveal } from "../../components/global/Reveal";
import { useCursosData } from "../../data/cursosApi";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL,
  cabalaBg,
  cabalaNom,
  cabalaTxt,
  CabalaIcon,
  noSelectSx,
} from "../../GlobalVariables";
import { CAJA_GLOW } from "../../components/metodo/cabalaGlow";

// ── Cursos para profundizar (Cábala) ────────────────────────────────────────
// Página-hub que va DESPUÉS de «10 días con tus dimensiones» (última página del
// recorrido). Los cursos NO se escriben aquí: salen del catálogo real
// (`useCursosData` → tabla `curso`, modalidad «Cábala»), igual que en la página
// de cursos de Astrología. Así lo que se publique desde el admin aparece solo.
// Su «siguiente» arranca la 8ª disciplina: Cultura (aún bloqueada → candado).

// Ojo del botón "Ilustraciones" (se pinta a la izquierda del texto).
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="16" height="16" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))", flexShrink: 0 }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </svg>
);

// SVG candado (mismo que usa la caja de disciplina bloqueada).
const Candado = ({ size }: { size: any }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill={cabalaTxt}
       style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoCabalaCursos() {
  const navigate = useNavigate();
  const [accesoOk, setAccesoOk] = useState(false);
  // ¿Tiene ya Cultura? De eso depende que el botón de «siguiente» lleve candado
  // o no: el candado solo se pinta cuando está bloqueada de verdad. Mismo
  // patrón que Fisiología→Nutrición y Ayurveda→Med. China.
  const [culturaSuscrito, setCulturaSuscrito] = useState(false);
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false);
  const { cursosData, loading } = useCursosData();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.cabala_suscrito) { navigate("/metodo/cabala"); return; }
        setCulturaSuscrito(!!me.data?.cultura_suscrito);
        setAccesoOk(true);
      } catch {
        navigate("/metodo/cabala");
      }
    })();
  }, [navigate]);

  // Cursos de Cábala del catálogo, en orden de publicación (los primeros,
  // primero). Aquí NO se ordena por «más reciente» como en /aprendizaje: esta
  // página acompaña «paso a paso», y los cursos se publicaron en ese mismo
  // orden (Introducción → El Árbol de la Vida → El Mal en la Cábala).
  const cursos = [...(cursosData[cabalaNom]?.cursos ?? [])].sort(
    (a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""),
  );
  // No se enseña la página hasta tener descargadas las portadas, para que las
  // tarjetas no se rellenen de golpe después.
  const fotosListas = usePrecargarImagenes(cursos.map((c) => c.foto));

  if (!accesoOk || loading || !fotosListas) {
    return <CabalaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1280px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
              title="Cursos de Cábala"
              compact
              bgColor={`${cabalaBg}dd`}
              color={cabalaTxt}
              nom={cabalaNom}
              mb={0}
              prev={{ label: "← 10 días", onClick: () => navigate("/metodo/cabala/dias") }}
              // "Ilustraciones" nunca falta en los headers de Cábala. En móvil se
              // queda solo el ojo, para que los botones sigan en una fila.
              extra={{
                label: <Box as="span" display={{ base: "none", md: "inline" }}>Ilustraciones</Box>,
                onClick: () => setIlustracionesOpen(true),
                icon: <EyeIcon />,
              }}
              // El candado SOLO si Cultura está bloqueada. Estaba fijo, así que
              // salía también a quien ya la tenía comprada.
              next={culturaSuscrito
                ? { label: "Cultura →", onClick: () => navigate("/metodo/cultura") }
                : { label: "Cultura", icon: <Candado size="15px" />, arrow: "next", onClick: () => navigate("/metodo/cultura") }}
            />
          </Reveal>

          {/* Texto introductorio bajo el header */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%" display="flex" justifyContent="center">
            {/* Sin sombra: el texto de debajo del header va sobre el turquesa limpio. */}
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "lg", md: "xl" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="680px">
              Si quieres profundizar en la Cábala, estos cursos te acompañan paso a paso.
            </Text>
          </Reveal>

          {cursos.length > 0 ? (
            cursos.length === 1 ? (
              <Flex w="100%" justify="center">
                <Box w="100%" maxW="520px">
                  <CursoCardDetalle curso={cursos[0]} bgColor={cabalaBg} color={cabalaTxt} nom={cabalaNom} />
                </Box>
              </Flex>
            ) : (
              <CursosGrid
                items={cursos.map((curso) => ({
                  curso,
                  color: cabalaTxt,
                  bgColor: cabalaBg,
                  nom: cabalaNom,
                }))}
              />
            )
          ) : (
            /* ── Aún no hay cursos publicados: estado vacío elegante ── */
            <Reveal direction="up" distance={16} delay={0.2} duration={0.6} w="100%" display="flex" justifyContent="center">
              <Flex direction="column" align="center" gap={3} maxW="560px" textAlign="center"
                    position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                    boxShadow={CAJA_GLOW} px={{ base: 6, md: 10 }} py={{ base: 12, md: 14 }}>
                <DisciplinaBgLayer nom={cabalaNom} borderRadius="2xl" overlay="rgba(0,0,0,0.5)" />
                <Text position="relative" zIndex={1} color="white" fontWeight={700} fontSize={{ base: "lg", md: "xl" }}
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
                  Estoy preparando los cursos
                </Text>
                <Text position="relative" zIndex={1} color="rgba(255,255,255,0.85)" fontSize={{ base: "md", md: "lg" }}
                      fontStyle="italic" lineHeight="1.7" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  Pronto podrás profundizar aquí con cursos avanzados de Cábala. Mientras tanto, continúa el
                  Mapa con la siguiente disciplina.
                </Text>
              </Flex>
            </Reveal>
          )}

        </Flex>
      </Flex>

      <CabalaIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

      <IndiceCabala />
      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />
      <SiteFooter />
    </Box>
  );
}
