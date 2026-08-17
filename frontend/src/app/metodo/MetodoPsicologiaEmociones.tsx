// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · LA RUEDA DE LAS EMOCIONES  ·  25/26
//
// «Vuelve aquí para poner palabras a tus emociones.»
//
// Esta página NO GUARDA NADA: es la herramienta de consulta del recorrido. Se
// entra, se toca cualquier palabra de la rueda y se abre un popup con esa
// emoción y las TRES características que la definen — para no tener que andar
// buscando qué significa cada palabra.
//
// El contenido vive en `hardCoded/metodo/ruedaEmociones.ts` y el dibujo lo hace
// `components/metodo/RuedaEmocionesSvg.tsx` (los sectores se calculan solos a
// partir de los datos).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Flex, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useT } from "../../i18n";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { RuedaEmocionesSvg } from "../../components/metodo/RuedaEmocionesSvg";
import { experienciaById } from "../../components/metodo/psicologiaRecorrido";
import { EMOCIONES_TOTAL, type EmocionElegida } from "../../hardCoded/metodo/ruedaEmociones";
import { glowHeader, glowPanel, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt; // marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaEmociones() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  // La emoción abierta en el popup (no se guarda: se lee y se cierra).
  const [abierta, setAbierta] = useState<EmocionElegida | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  const irASintesis = () => navigate(`/metodo/psicologia/${exp.id}/sintesis`);
  const irACursos = () => navigate(`/metodo/psicologia/${exp.id}/cursos`);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 7, md: 9 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
            title={t("metodo.psico.paso.emociones")}
            bgColor={`${neuropsicologiaBg}f0`}
            color={neuropsicologiaTxt}
            nom={neuropsicologiaNom}
            step={{ current: 25, total: 26 }}
            mb={0}
            boxShadow={glowHeader}
            prev={{ label: `← ${t("metodo.psico.paso.sintesis")}`, onClick: irASintesis }}
            next={{ label: `${t("metodo.psico.paso.cursosCorto")} →`, onClick: irACursos }}
          />
          </Reveal>

          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
          <IntroRecorrido>{t("metodo.psico.emocionesIntro")}</IntroRecorrido>
          </Reveal>

          {/* ── «Las emociones son mensajeras» · lo primero que se lee ── */}
          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.18} duration={0.75} w="100%">
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
               bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Flex position="relative" zIndex={1} direction="column" align="center" textAlign="center"
                  gap={{ base: 3, md: 3.5 }} px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }}>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.25"
                    style={{ textShadow: INK_SHADOW }}>
                {t("metodo.psico.ruedaMensajeras")}
              </Text>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" maxW="620px" opacity={0.94}
                    style={{ textShadow: INK_SHADOW }}>
                {t("metodo.psico.ruedaMensajerasTexto")}
              </Text>
            </Flex>
          </Box>
          </Reveal>

          {/* ── La rueda ── */}
          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.3} duration={0.8} w="100%">
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
               bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 3, md: 8 }} py={{ base: 6, md: 8 }}>
              <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.04em"
                    textAlign="center" style={{ textShadow: INK_SHADOW }}>
                {t("metodo.psico.ruedaTitulo")}
              </Text>
              <Box mt={{ base: 3, md: 3.5 }} h="1px" w="100%" bg={`${TINTA}44`} />

              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} textAlign="center" opacity={0.9}
                    mt={{ base: 4, md: 5 }} style={{ textShadow: INK_SHADOW }}>
                {t("metodo.psico.ruedaToca")}
              </Text>

              {/* En móvil la rueda no cabe legible: se queda a su tamaño y se
                  desliza en horizontal dentro de su propia caja (la barra va al
                  borde y con el carril transparente, como en todo el recorrido). */}
              <Box mt={{ base: 4, md: 5 }} overflowX={{ base: "auto", md: "visible" }}
                   sx={{ scrollbarWidth: "thin", scrollbarColor: `${TINTA}99 transparent`,
                         "&::-webkit-scrollbar": { height: "8px" },
                         "&::-webkit-scrollbar-track": { background: "transparent" },
                         "&::-webkit-scrollbar-thumb": { background: `${TINTA}99`, borderRadius: "8px" } }}>
                <Box w={{ base: "680px", md: "100%" }} maxW={{ md: "760px" }} mx="auto" pb={{ base: 2, md: 0 }}>
                  <RuedaEmocionesSvg onSelect={setAbierta} tinta={TINTA} papel={PAPEL} />
                </Box>
              </Box>

              <Text color={TINTA} fontSize="xs" textAlign="center" opacity={0.7} mt={{ base: 3, md: 4 }}
                    display={{ base: "block", md: "none" }}>
                {t("metodo.psico.ruedaDesliza")}
              </Text>

              <Text color={TINTA} fontSize="xs" textAlign="center" opacity={0.65} mt={{ base: 3, md: 5 }}>
                {EMOCIONES_TOTAL} {t("metodo.psico.ruedaPalabras")}
              </Text>
            </Box>
          </Box>
          </Reveal>

          {/* Botón de fin de página (adelante, abajo a la derecha) */}
          <BotonPaso label={t("metodo.psico.paso.cursosCorto")} onClick={irACursos}
                     nom={neuropsicologiaNom} color={TINTA} bg={neuropsicologiaBg} />
        </Flex>
      </Flex>

      {/* ── Popup: la emoción y las tres cosas que la definen ── */}
      <Modal isOpen={!!abierta} onClose={() => setAbierta(null)} isCentered scrollBehavior="inside" size={{ base: "sm", md: "lg" }}>
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(6px)" }} />
        <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} fontFamily="'EB Garamond', serif">
          <Box position="relative" borderRadius="2xl" overflow="hidden" boxShadow={`0 26px 70px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <ModalCloseButton color={TINTA} zIndex={3} />
            <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
              {abierta && (
                <Flex direction="column" align="center" textAlign="center" gap={4}>
                  {/* De dónde viene: «emoción básica» o el camino desde el centro. */}
                  <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.22em"
                        textTransform="uppercase" opacity={0.65}>
                    {abierta.nivel === 1
                      ? t("metodo.psico.emocionBasica")
                      : abierta.camino.slice(0, -1).join(" · ")}
                  </Text>

                  <Flex align="center" gap={3}>
                    {/* El color de su familia, para reconocerla en la rueda. */}
                    <Box w="14px" h="14px" borderRadius="full" flexShrink={0}
                         bg={abierta.nivel === 1 ? abierta.basica.color
                             : abierta.nivel === 2 ? abierta.basica.colorMedio : abierta.basica.colorClaro}
                         border={`1.5px solid ${TINTA}88`} />
                    <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.2"
                          style={{ textShadow: INK_SHADOW }}>
                      {abierta.emocion.nombre}
                    </Text>
                  </Flex>

                  <Box h="1px" w="55%" maxW="240px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" fontStyle="italic"
                        style={{ textShadow: INK_SHADOW }}>
                    {t("metodo.psico.seDefinePor")}
                  </Text>

                  <Box borderRadius="xl" bg="rgba(255,251,243,0.66)" border={`1px solid ${TINTA}33`}
                       px={{ base: 5, md: 6 }} py={{ base: 4, md: 5 }} w="100%" textAlign="left"
                       sx={{ backdropFilter: "blur(4px)" }}>
                    <Flex direction="column" gap={3}>
                      {abierta.emocion.define.map((linea, i) => (
                        <Flex key={i} align="flex-start" gap={3}>
                          {/* Marca sobria: una rayita de tinta, sin adornos. */}
                          <Box flexShrink={0} mt="11px" w="14px" h="1.5px" borderRadius="full" bg={`${TINTA}88`} />
                          <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">{linea}</Text>
                        </Flex>
                      ))}
                    </Flex>
                  </Box>

                  <Box as="button" onClick={() => setAbierta(null)} mt={1} px={8} py={2.5} borderRadius="full"
                       bg={TINTA} color={PAPEL} fontFamily="'EB Garamond', serif" fontWeight="700"
                       fontSize={{ base: "sm", md: "md" }} letterSpacing="0.05em" cursor="pointer"
                       boxShadow={`0 6px 20px rgba(94,45,16,0.32)`} transition="all 0.2s"
                       _hover={{ transform: "translateY(-2px)", boxShadow: `0 10px 28px rgba(94,45,16,0.42)` }}>
                    {t("metodo.psico.ruedaCerrar")}
                  </Box>
                </Flex>
              )}
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>

      <AyudaRecorrido pagina="emociones" />

      <SiteFooter />
    </Box>
  );
}
