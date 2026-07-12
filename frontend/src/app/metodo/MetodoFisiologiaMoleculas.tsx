import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon,
} from "../../GlobalVariables";

const MBox = motion(Box);

// Halo oscuro para leer el texto claro sobre el fondo morado de Fisiología.
const INK = `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc, 0 2px 16px ${fisiologiaBg}88`;

// Colores heredados de la página de Átomos (misma estética dibujada).
const C_PROTON = "#e08a8a";
const C_ELECTRON = "#8ab6e6";

const esferaProton = `radial-gradient(circle at 34% 30%, #ffffff 0%, ${C_PROTON} 34%, ${C_PROTON}dd 62%, ${C_PROTON}77 100%)`;
const esferaElectron = `radial-gradient(circle at 34% 30%, #ffffff 0%, ${C_ELECTRON} 34%, ${C_ELECTRON}dd 62%, ${C_ELECTRON}77 100%)`;

const shimmer = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
`;
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
const spinRev = keyframes`
  from { transform: rotate(360deg); }
  to   { transform: rotate(0deg); }
`;

// ─────────────────────────────────────────────────────────────────────────
// Un átomo de Hidrógeno dibujado: núcleo (1 protón) + 1 electrón en órbita.
// `electronVisible` permite ocultar el electrón propio cuando se comparte en
// el enlace (fase molécula).
// ─────────────────────────────────────────────────────────────────────────
function AtomoH({
  size, electronVisible = true, girando = false, sentido = 1,
}: {
  size: any;
  electronVisible?: boolean;
  girando?: boolean;
  sentido?: 1 | -1;
}) {
  return (
    <Box position="relative" w={size} h={size} borderRadius="full"
         display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
      {/* órbita */}
      <Box position="absolute" inset="0" borderRadius="full"
           border={`1.5px ${girando ? "solid" : "dashed"} ${C_ELECTRON}66`} pointerEvents="none" />
      {/* electrón propio */}
      {electronVisible && (
        <Box position="absolute" inset="0"
             sx={girando ? { animation: `${sentido === 1 ? spin : spinRev} 6s linear infinite` } : undefined}
             pointerEvents="none">
          <Box position="absolute" left="0%" top="50%" transform="translate(-50%,-50%)"
               w={{ base: "18px", md: "22px" }} h={{ base: "18px", md: "22px" }} borderRadius="full"
               sx={{ background: esferaElectron, boxShadow: `0 0 10px ${C_ELECTRON}aa, 0 0 22px ${C_ELECTRON}55` }} />
        </Box>
      )}
      {/* núcleo (1 protón) */}
      <Box position="relative" w="46%" h="46%" borderRadius="full"
           display="flex" alignItems="center" justifyContent="center"
           sx={{ background: "radial-gradient(circle at 42% 34%, #2a2440 0%, #171226 46%, #05040a 100%)",
                 boxShadow: `inset 0 0 22px rgba(0,0,0,0.92), 0 0 16px ${fisiologiaTxt}22` }}>
        <Box w="62%" h="62%" borderRadius="full" display="flex" alignItems="center" justifyContent="center"
             sx={{ background: esferaProton, boxShadow: `0 0 10px ${C_PROTON}aa, 0 0 22px ${C_PROTON}55` }}>
          <Text color="rgba(0,0,0,0.5)" fontWeight="900" lineHeight="1"
                fontSize={{ base: "xs", md: "sm" }} style={{ userSelect: "none" }}>+</Text>
        </Box>
      </Box>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaMoleculas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [unido, setUnido] = useState(false);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();

  const dataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        // ¿Modo test de pagos? Nos deja entrar aunque la columna fisiologia_suscrito
        // aún no exista en la BD (ALTER TABLE pendiente) — como en el resto de páginas.
        let testEnabled = false;
        try {
          const t = await axios.get(`${API_URL}/payment/test/enabled`);
          testEnabled = !!t.data?.enabled;
        } catch { /* sin modo test */ }

        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/metodo/fisiologia"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          dataRef.current = r.data?.data ?? {};
          if (dataRef.current?.moleculas_hecho) setUnido(true);
        } catch { /* sin fila todavía */ }
      } catch {
        navigate("/metodo/fisiologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const guardarHecho = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    try {
      await axios.patch(
        `${API_URL}/metodo-fisiologia/${userId}`,
        { data: { ...dataRef.current, moleculas_hecho: true } },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dataRef.current = { ...dataRef.current, moleculas_hecho: true };
    } catch { /* se reintenta la próxima vez */ }
  };

  const juntar = () => {
    setUnido(true);
    void guardarHecho();
  };

  const reiniciar = () => setUnido(false);

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Moléculas"
            pageLabel="4/"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Átomos", onClick: () => navigate("/metodo/fisiologia/atomos") }}
            extra={celulasBtn}
          />

          {/* Frase explicativa bajo el header */}
          <MBox initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} textAlign="center">
            <Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight="600"
                  maxW="560px" lineHeight="1.7" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Los átomos se combinan entre ellos y así forman moléculas.
            </Text>
          </MBox>

          {/* ── BOX RECTANGULAR ── */}
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
               boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}>
            <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />

            <Box position="relative" zIndex={1} px={{ base: 5, md: 10 }} py={{ base: 8, md: 10 }} minH={{ md: "380px" }}>
              <Flex direction="column" align="center" gap={{ base: 7, md: 8 }}>

                {/* ─── Escenario: dos átomos que se juntan ─── */}
                <Box position="relative" w="100%" h={{ base: "230px", md: "260px" }}
                     display="flex" alignItems="center" justifyContent="center">

                  {/* halo cuando ya es molécula */}
                  <AnimatePresence>
                    {unido && (
                      <MBox key="halo" position="absolute"
                            w={{ base: "300px", md: "360px" }} h={{ base: "170px", md: "200px" }}
                            borderRadius="full" pointerEvents="none"
                            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            sx={{ animation: `${shimmer} 3.6s ease-in-out infinite`,
                                  boxShadow: `0 0 50px ${C_ELECTRON}44, 0 0 90px ${C_PROTON}33` }} />
                    )}
                  </AnimatePresence>

                  {/* nube de electrones compartida (el enlace) */}
                  <AnimatePresence>
                    {unido && (
                      <MBox key="nube" position="absolute"
                            w={{ base: "168px", md: "208px" }} h={{ base: "96px", md: "116px" }}
                            borderRadius="full" pointerEvents="none"
                            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            transition={{ delay: 0.35, type: "spring", stiffness: 220, damping: 22 }}
                            border={`1.5px solid ${C_ELECTRON}55`}
                            sx={{ background: `radial-gradient(ellipse at center, ${C_ELECTRON}22 0%, transparent 70%)` }} />
                    )}
                  </AnimatePresence>

                  {/* Átomo izquierdo */}
                  <MBox position="absolute"
                        animate={{ x: unido ? (typeof window !== "undefined" && window.innerWidth < 768 ? -42 : -52) : (typeof window !== "undefined" && window.innerWidth < 768 ? -105 : -140) }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}>
                    <AtomoH size={{ base: "128px", md: "156px" }}
                            electronVisible={!unido} girando={unido} sentido={1} />
                  </MBox>

                  {/* Átomo derecho */}
                  <MBox position="absolute"
                        animate={{ x: unido ? (typeof window !== "undefined" && window.innerWidth < 768 ? 42 : 52) : (typeof window !== "undefined" && window.innerWidth < 768 ? 105 : 140) }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}>
                    <AtomoH size={{ base: "128px", md: "156px" }}
                            electronVisible={!unido} girando={unido} sentido={-1} />
                  </MBox>

                  {/* par de electrones COMPARTIDOS entre los dos núcleos (aparece al unirse) */}
                  <AnimatePresence>
                    {unido && (
                      <MBox key="compartidos" position="absolute" display="flex" gap={{ base: 2, md: 3 }}
                            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}>
                        {[0, 1].map((i) => (
                          <Box key={i} w={{ base: "16px", md: "20px" }} h={{ base: "16px", md: "20px" }}
                               borderRadius="full"
                               sx={{ background: esferaElectron, boxShadow: `0 0 12px ${C_ELECTRON}, 0 0 26px ${C_ELECTRON}88` }} />
                        ))}
                      </MBox>
                    )}
                  </AnimatePresence>

                  {/* etiqueta H + H / H₂ */}
                  <Box position="absolute" bottom={{ base: "-6px", md: "0" }} left="50%" transform="translateX(-50%)">
                    <Text color={fisiologiaTxt} fontWeight="700" letterSpacing="0.1em"
                          fontSize={{ base: "sm", md: "md" }} style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
                      {unido ? "H₂" : "H  +  H"}
                    </Text>
                  </Box>
                </Box>

                {/* ─── Acción / resultado ─── */}
                <AnimatePresence mode="wait">
                  {!unido ? (
                    <MBox key="accion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          textAlign="center">
                      <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mb={4}
                            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                        Tienes dos átomos de hidrógeno. Únelos para crear una molécula.
                      </Text>
                      <Box as="button" onClick={juntar}
                           px={9} py={3} borderRadius="full" bg={fisiologiaTxt} color={fisiologiaBg}
                           fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                           letterSpacing="0.04em" cursor="pointer" transition="all 0.2s"
                           boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33`}
                           _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88, 0 0 58px ${fisiologiaTxt}44` }}>
                        Juntar (crear enlace)
                      </Box>
                    </MBox>
                  ) : (
                    <MBox key="resultado" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          maxW="640px" textAlign="center">
                      <Text fontSize={{ base: "2xl", md: "3xl" }} mb={2}>🎉</Text>
                      <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                            lineHeight="1.25" mb={4} style={{ textShadow: INK }}>
                        ¡Has creado una molécula de hidrógeno (H₂)!
                      </Text>
                      <Box h="1px" w={{ base: "60%", md: "50%" }} mx="auto" mb={4}
                           bgGradient={`linear(to-r, transparent, ${fisiologiaTxt}88, transparent)`} />
                      <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" mb={3} style={{ textShadow: INK }}>
                        Los átomos se unen <b>compartiendo sus electrones</b>: esa unión es un <b>enlace</b>. Al
                        compartirlos, cada átomo se completa y el conjunto se vuelve estable.
                      </Text>
                      <Text color="white" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" fontWeight="600" style={{ textShadow: INK }}>
                        Encadenando átomos así se forma <b>todo</b>: el agua (H₂O), el aire que respiras, el azúcar
                        que te da energía… y cada molécula de tu cuerpo.
                      </Text>

                      <Flex gap={4} mt={6} wrap="wrap" justify="center">
                        <Box as="button" onClick={reiniciar}
                             px={6} py={2.5} borderRadius="full" bg="transparent"
                             color="rgba(255,255,255,0.85)" border="1px solid rgba(255,255,255,0.45)"
                             fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "sm", md: "md" }}
                             letterSpacing="0.04em" cursor="pointer" transition="all 0.2s"
                             _hover={{ borderColor: "white", color: "white" }}>
                          ↺ Separar de nuevo
                        </Box>
                        <Box as="button" onClick={() => navigate("/metodo/fisiologia")}
                             px={8} py={2.5} borderRadius="full" bg={fisiologiaTxt} color={fisiologiaBg}
                             fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                             letterSpacing="0.05em" cursor="pointer" transition="all 0.2s"
                             boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33`}
                             _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88, 0 0 58px ${fisiologiaTxt}44` }}>
                          Continuar el recorrido →
                        </Box>
                      </Flex>
                    </MBox>
                  )}
                </AnimatePresence>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Flex>

      {celulasModal}
      <SiteFooter />
    </Box>
  );
}
