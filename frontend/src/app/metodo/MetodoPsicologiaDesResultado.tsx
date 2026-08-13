// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · ¿Qué significa tu desconexión?  ·  6/25
//
// El resultado del DES-II, separado del test (paso 5) y detrás del cómic «La
// desconexión». Muestra:
//   · la puntuación (media de las 28, de 0 a 100) + su banda interpretativa;
//   · las TRES caras de la desconexión, porque una misma cifra no significa lo
//     mismo según de dónde venga (irse con la mente es lo más inofensivo);
//   · el cierre: desconectarse fue lo que la salvó, y la vuelta es por el cuerpo;
//   · y, si la puntuación es alta, la invitación a no recorrer esto sola.
//
// NO es un diagnóstico. Si el test no está completo, se vuelve al test.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { AgendarLlamada } from "../../components/global/AgendarLlamada";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { COMIC_LINEA_TIEMPO } from "../../components/metodo/comicLineaTiempo";
import { useComic } from "../../i18n/comics";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useT } from "../../i18n";
import {
  experienciaById,
  desScore,
  desCompleto,
  desAlto,
  desResultado,
  DES_UMBRAL_ALTO,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import { guardarDesResultado } from "../../data/psicologiaDesApi";
import {
  useDesBanda,
  useDesEsperanza,
  useDesSubescalas,
} from "../../components/metodo/psicologiaRecorrido.en";
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

export default function MetodoPsicologiaDesResultado() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  // Cómic «antesala de la Línea de Vida»: se intercala al ir a la timeline (desde
  // el header o el botón), antes de que cargue y de su popup de edad. Se salta.
  const [comicOpen, setComicOpen] = useState(false);
  // Reserva de llamada (la ofrece la banda alta).
  const [llamadaOpen, setLlamadaOpen] = useState(false);
  useLockBodyScroll(llamadaOpen);
  // Las viñetas en el idioma activo (el español manda: fotos y orden salen de él).
  const comicVinetas = useComic("psicologia-linea-tiempo", COMIC_LINEA_TIEMPO);
  const dataRef = useRef<LineaDeVidaData>({});
  const [data, setData] = useState<LineaDeVidaData>({});
  // La puntuación, su banda y las tres caras, arriba del todo: los hooks no
  // pueden ir después del `return` del loading.
  const score = desScore(data);
  const banda = useDesBanda(score);
  const subescalas = useDesSubescalas(data);
  const desEsperanza = useDesEsperanza();
  const alto = desAlto(data);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
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
        if (!desCompleto(d)) { navigate(`/metodo/psicologia/${exp.id}/des`, { replace: true }); return; }
        dataRef.current = d;
        setData(d);

        // El resultado se manda a su tabla al responder (ver MetodoPsicologiaDes).
        // Aquí se REPARA: si el guardado de entonces falló, o el test se terminó
        // antes de que la tabla existiera, se escribe ahora. El upsert es
        // idempotente y el backend conserva la fecha si sale lo mismo, así que
        // volver a esta página no falsea el registro.
        const resultado = desResultado(d);
        if (resultado) void guardarDesResultado(resultado);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  if (loading) {
    return <PsicologiaLoading />;
  }
  if (!exp) return null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 7, md: 9 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title={t("metodo.psico.paso.desResultado")}
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 6, total: 25 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: `← ${t("metodo.psico.paso.des")}`, onClick: () => navigate(`/metodo/psicologia/${exp.id}/des`) }}
              next={{ label: `${t("metodo.psico.lineaDeVida")} →`, onClick: () => setComicOpen(true) }}
            />
          </Reveal>

          {/* Sobre el turquesa: el título de la página */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.7} w="100%" display="flex" justifyContent="center">
            <IntroRecorrido>{t("metodo.psico.queSignificaDes")}</IntroRecorrido>
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
                  {t("metodo.psico.tuPuntuacionDes")}
                </Text>

                {/* Círculo con la cifra — siempre en marrón oscuro (neutro) */}
                <Flex align="center" justify="center" w={{ base: "116px", md: "134px" }} h={{ base: "116px", md: "134px" }}
                      borderRadius="full" bg="rgba(255,251,243,0.72)" border={`3px solid ${TINTA}`}
                      boxShadow={`0 0 26px ${TINTA}55`} sx={{ backdropFilter: "blur(4px)" }}>
                  <Text color={TINTA} fontSize={{ base: "5xl", md: "6xl" }} fontWeight="700" lineHeight="1"
                        style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
                    {score}
                  </Text>
                </Flex>

                <Text color={TINTA} fontSize="xs" fontStyle="italic" opacity={0.75}
                      style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.desMedia")}</Text>

                {/* Banda: su etiqueta como pastilla del color de la banda */}
                <Flex align="center" gap={2.5} px={4} py={1.5} borderRadius="full"
                      bg="rgba(255,251,243,0.62)" border={`1.5px solid ${banda.color}`}>
                  <Box w="9px" h="9px" borderRadius="full" bg={banda.color} flexShrink={0} />
                  <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontWeight="700" letterSpacing="0.06em">
                    {banda.etiqueta}
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

            {/* Recordatorio honesto, entre los boxes */}
            <Reveal direction="up" distance={20} delay={0.3} duration={0.7} w="100%">
            <Text color="white" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" fontWeight="600"
                  textAlign="center" lineHeight="1.7" maxW="560px" mx="auto">
              {t("metodo.psico.desSinEtiqueta")}
            </Text>
            </Reveal>

            {/* Las tres caras de la desconexión */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.36} duration={0.75} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Flex position="relative" zIndex={1} direction="column" gap={{ base: 5, md: 6 }}
                    px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                <Box>
                  <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center"
                        lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                    {t("metodo.psico.desTresCaras")}
                  </Text>
                  <Box mt={{ base: 3, md: 3.5 }} h="1px" w="55%" maxW="240px" mx="auto"
                       bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                </Box>

                <Flex direction="column" gap={{ base: 5, md: 6 }}>
                  {subescalas.map(({ sub, score: s }) => (
                    <Box key={sub.key}>
                      <Flex align="baseline" justify="space-between" gap={3} mb={2}>
                        <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700"
                              style={{ textShadow: INK_SHADOW }}>
                          {sub.titulo}
                        </Text>
                        <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" whiteSpace="nowrap"
                              style={{ textShadow: INK_SHADOW }}>
                          {s}
                        </Text>
                      </Flex>

                      {/* Barra: el carril lleva marcado el umbral de 30 */}
                      <Box position="relative" h="10px" borderRadius="full"
                           bg="rgba(255,251,243,0.55)" border={`1px solid ${TINTA}33`} overflow="hidden">
                        <Box position="absolute" inset={0} h="100%" borderRadius="full"
                             w={`${s}%`} bg={sub.color} transition="width 0.5s ease" />
                        <Box position="absolute" top={0} bottom={0} left={`${DES_UMBRAL_ALTO}%`}
                             w="1.5px" bg={`${TINTA}77`} />
                      </Box>

                      <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.65" opacity={0.88}
                            mt={2} style={{ textShadow: INK_SHADOW }}>
                        {sub.descripcion}
                      </Text>
                    </Box>
                  ))}
                </Flex>

                <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" lineHeight="1.7"
                      opacity={0.85} style={{ textShadow: INK_SHADOW }}>
                  {t("metodo.psico.desTresCarasPie")}
                </Text>
              </Flex>
            </Box>
            </Reveal>

            {/* Si la desconexión es alta: no recorrer esto sola */}
            {alto && (
              <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.42} duration={0.75} w="100%">
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                   border={azulBorde} boxShadow={glowPanel}>
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Flex position="relative" zIndex={1} direction="column" align="center" textAlign="center"
                      gap={{ base: 4, md: 5 }} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                  <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.4"
                        maxW="520px" style={{ textShadow: INK_SHADOW }}>
                    {t("metodo.psico.desNoSola")}
                  </Text>
                  <Box as="button" onClick={() => setLlamadaOpen(true)}
                       px={8} py={3} borderRadius="full" bg="rgba(255,251,243,0.6)" color={TINTA}
                       border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif" fontWeight="700"
                       fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em" cursor="pointer"
                       transition="all 0.2s"
                       _hover={{ bg: "rgba(255,251,243,0.85)", transform: "translateY(-2px)" }}>
                    {t("metodo.psico.pedirLlamada")}
                  </Box>
                </Flex>
              </Box>
              </Reveal>
            )}

            {/* Cierre: irse fue lo que te salvó */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.48} duration={0.75} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Flex position="relative" zIndex={1} direction="column" gap={{ base: 4, md: 5 }}
                    px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
                <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center"
                      lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                  {desEsperanza.titulo}
                </Text>
                <Box h="1px" w="55%" maxW="240px" mx="auto"
                     bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                {desEsperanza.texto.map((p, i) => (
                  <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                        style={{ textShadow: INK_SHADOW }}>
                    {p}
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
                         style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>{t("metodo.psico.continuarLinea")}</Box>
                  </Box>
                </Flex>
              </Flex>
            </Box>
            </Reveal>
          </Flex>
        </Flex>
      </Flex>

      <AyudaRecorrido pagina="des" />

      {/* ── Reserva de llamada (banda alta: no recorrer esto sola) ── */}
      {llamadaOpen && (
        <Box
          position="fixed" inset={0} zIndex={2300}
          display="flex" alignItems="flex-start" justifyContent="center"
          px={{ base: 3, md: 10 }} py={{ base: 5, md: 10 }}
          bg="rgba(0,0,0,0.82)"
          sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={() => setLlamadaOpen(false)}
          fontFamily="'EB Garamond', serif" overflowY="auto"
        >
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="640px" my="auto">
            <Box as="button" onClick={() => setLlamadaOpen(false)} position="absolute" top={3} right={3} zIndex={2}
                 w="36px" h="36px" borderRadius="full"
                 bg="rgba(255,251,243,0.85)" border={`1px solid ${TINTA}44`} color={TINTA}
                 display="flex" alignItems="center" justifyContent="center" fontSize="lg" cursor="pointer"
                 _hover={{ bg: "#fff" }}>✕</Box>
            <AgendarLlamada
              color={neuropsicologiaTxt}
              bgColor={neuropsicologiaBg}
              disciplinaNom={neuropsicologiaNom}
              tipo="compania"
              titulo={t("metodo.ayuda.prefieresCompania")}
              subtitulo={t("metodo.psico.recorreLinea")}
            />
          </Box>
        </Box>
      )}

      {/* Cómic antesala de la Línea de Vida — sale al pasar de botón, antes de
          cargar la timeline y su popup de edad. Se puede saltar (Saltar →). */}
      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={() => navigate(`/metodo/psicologia/${exp.id}`)}
        vinetas={comicVinetas}
        continueLabel={t("comun.continuar")}
        botonNitido
        themeColor={neuropsicologiaTxt}
        disciplinaBgImage="/img/fondos/psciologia.webp"
        disciplinaBgColor={neuropsicologiaBg}
        textShadow={`0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`}
      />

      <SiteFooter />
    </Box>
  );
}
