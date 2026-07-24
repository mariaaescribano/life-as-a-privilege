// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · ¿Qué significa tu resultado ACE?  ·  4/16
//
// El resultado del test ACE, separado del test (página 3). Muestra la
// puntuación + su interpretación (banda), qué se sabe de estas experiencias
// (dosis-respuesta) y —con honestidad y esperanza— cómo pueden influir en la
// Vida actual. NO es un diagnóstico (ver ACE_ESPERANZA.caveat).
//
// Si el test no está completo, se vuelve a la página del test.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { COMIC_LINEA_TIEMPO } from "../../components/metodo/comicLineaTiempo";
import {
  experienciaById,
  ACE_ESPERANZA,
  aceScore,
  aceBanda,
  aceCompleto,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import { Reveal } from "../../components/global/Reveal";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaAceResultado() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  // Cómic «antesala de la Línea de Vida»: se intercala al ir a la timeline (desde
  // el header o el botón), antes de que cargue y de su popup de edad. Se salta.
  const [comicOpen, setComicOpen] = useState(false);
  const dataRef = useRef<LineaDeVidaData>({});
  const [data, setData] = useState<LineaDeVidaData>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: LineaDeVidaData = psi.data?.data || {};
        // Sin test completo no hay resultado que mostrar: volvemos al test.
        if (!aceCompleto(d)) { navigate(`/metodo/psicologia/${exp.id}/ace`, { replace: true }); return; }
        dataRef.current = d;
        setData(d);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }
  if (!exp) return null;

  const score = aceScore(data);
  const banda = aceBanda(score);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 7, md: 9 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title="Tu resultado"
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 4, total: 20 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← ACE", onClick: () => navigate(`/metodo/psicologia/${exp.id}/ace`) }}
              next={{ label: "Línea de Vida →", onClick: () => setComicOpen(true) }}
            />
          </Reveal>

          {/* Sobre el turquesa: el título de la página */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.7} w="100%" display="flex" justifyContent="center">
            <IntroRecorrido>¿Qué significa tu resultado ACE?</IntroRecorrido>
          </Reveal>

          <Flex direction="column" w="100%" gap={{ base: 5, md: 6 }}>

            {/* Puntuación + banda */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.22} duration={0.75} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Flex position="relative" zIndex={1} direction="column" align="center" textAlign="center"
                    gap={{ base: 4, md: 5 }} px={{ base: 6, md: 10 }} py={{ base: 9, md: 12 }}>
                <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.22em"
                      textTransform="uppercase" opacity={0.65} style={{ textShadow: INK_SHADOW }}>
                  Tu puntuación ACE
                </Text>

                {/* Círculo con la cifra — siempre en marrón oscuro (neutro) */}
                <Flex align="center" justify="center" w={{ base: "116px", md: "134px" }} h={{ base: "116px", md: "134px" }}
                      borderRadius="full" bg="rgba(255,251,243,0.72)" border={`3px solid ${TINTA}`}
                      boxShadow={`0 0 26px ${TINTA}55`} sx={{ backdropFilter: "blur(4px)" }}>
                  <Text color={TINTA} fontSize={{ base: "5xl", md: "6xl" }} fontWeight="700" lineHeight="1"
                        style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
                    {score}
                  </Text>
                  <Text color={`${TINTA}cc`} fontSize={{ base: "xl", md: "2xl" }} fontWeight="600"
                        alignSelf="flex-end" mb={{ base: 4, md: 5 }}>
                    /10
                  </Text>
                </Flex>

                <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.25"
                      style={{ textShadow: INK_SHADOW }}>
                  {banda.titulo}
                </Text>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                      maxW="560px" style={{ textShadow: INK_SHADOW }}>
                  {banda.texto}
                </Text>
              </Flex>
            </Box>
            </Reveal>

            {/* Consecuencias (dosis-respuesta) — una sola frase entre los boxes */}
            <Reveal direction="up" distance={20} delay={0.32} duration={0.7} w="100%">
            <Text color="white" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" fontWeight="600"
                  textAlign="center" lineHeight="1.7" maxW="560px" mx="auto">
              Cuantas más experiencias adversas, mayor es el riesgo de enfermedades y dificultades.
            </Text>
            </Reveal>

            {/* Esperanza / resiliencia */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.42} duration={0.75} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Flex position="relative" zIndex={1} direction="column" gap={{ base: 4, md: 5 }}
                    px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center"
                      lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                  {ACE_ESPERANZA.titulo}
                </Text>
                <Box h="1px" w="55%" maxW="240px" mx="auto"
                     bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                {ACE_ESPERANZA.texto.map((t, i) => (
                  <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                        style={{ textShadow: INK_SHADOW }}>
                    {t}
                  </Text>
                ))}

                {/* Seguir el recorrido */}
                <Flex justify="center" pt={2}>
                  <Box as="button" onClick={() => setComicOpen(true)}
                       position="relative" overflow="hidden" px={8} py={3} borderRadius="full"
                       bg={TINTA} border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif"
                       fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em" cursor="pointer"
                       boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.2s"
                       _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
                    <Box as="span" position="relative" zIndex={1} color={neuropsicologiaBg}
                         style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>
                      Continuar a Línea de Vida →
                    </Box>
                  </Box>
                </Flex>
              </Flex>
            </Box>
            </Reveal>
          </Flex>
        </Flex>
      </Flex>

      <AyudaRecorrido pagina="ace" />

      {/* Cómic antesala de la Línea de Vida — sale al pasar de botón, antes de
          cargar la timeline y su popup de edad. Se puede saltar (Saltar →). */}
      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={() => navigate(`/metodo/psicologia/${exp.id}`)}
        vinetas={COMIC_LINEA_TIEMPO}
        continueLabel="Continuar"
        botonNitido
        themeColor={neuropsicologiaTxt}
        disciplinaBgImage="/img/fondos/psciologia.png"
        disciplinaBgColor={neuropsicologiaBg}
        textShadow={`0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`}
      />

      <SiteFooter />
    </Box>
  );
}
