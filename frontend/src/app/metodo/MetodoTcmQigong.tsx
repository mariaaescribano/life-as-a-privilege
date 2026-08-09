import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { TcmLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import { ELEMENTOS } from "../../components/metodo/tcmRecorrido";
import { QigongComicModal } from "../../components/metodo/QigongComicModal";
import {
  BROCADOS, CINCO_ANIMALES, DAO_YIN, DAO_YIN_VINETAS, FOTO_POSTURA,
  HISTORIA_QIGONG, HISTORIA_QIGONG_VINETAS,
  QIGONG_INTRO, QIGONG_NOTA, QIGONG_QUE_ES, TRES_REGULACIONES, type Postura,
} from "../../components/metodo/tcmQigongContenido";

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// 850px = el ancho del MetodoStepHeader: ninguna caja se sale de la cabecera.
const ANCHO = "850px";

export default function MetodoTcmQigong() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();
  // Los dos cómics de la página. La historia se abre por el hito pulsado (de ahí
  // el índice); el Dao Yin siempre por el principio.
  const [hitoAbierto, setHitoAbierto] = useState<number | null>(null);
  const [daoYinAbierto, setDaoYinAbierto] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return <TcmLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW={ANCHO} gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Qigong"
            pageLabel="9/10"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            maxW={ANCHO}
            mb={0}
            prev={{ label: "← Tu cocina", onClick: () => navigate("/metodo/tcm/recetas") }}
            extra={ilustracionesBtn}
            next={{ label: "Cursos →", onClick: () => navigate("/metodo/tcm/cursos") }}
          />
          </Reveal>

          {/* Intro bajo el header · sin sombra (va sobre el turquesa limpio) */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Flex direction="column" gap={3} maxW="700px">
            {QIGONG_INTRO.map((p, i) => (
              <Text key={i} color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                    textAlign="center">
                {p}
              </Text>
            ))}
          </Flex>
          </Reveal>

          {/* ── QUÉ ES ── */}
          <Reveal direction="up" distance={26} scaleFrom={0.98} delay={0.2} duration={0.7} w="100%">
          <Panel titulo="La cuarta rama de esta medicina">
            <Flex direction="column" gap={4}>
              {QIGONG_QUE_ES.map((p, i) => (
                <Text key={i} color={tcmTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9"
                      style={{ textShadow: INK_SHADOW }}>
                  {p}
                </Text>
              ))}
            </Flex>
          </Panel>
          </Reveal>

          {/* ── LAS TRES REGULACIONES ── */}
          <Seccion>Las tres regulaciones</Seccion>
          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(3, minmax(0, 1fr))" }}
               gap={{ base: 4, md: 5 }} w="100%">
            {TRES_REGULACIONES.map((r) => (
              <Reveal key={r.key} inView direction="up" distance={22} scaleFrom={0.98} duration={0.65}
                      amount={0.15} w="100%" h="100%">
                <Panel h="100%">
                  <Text color={tcmTxt} fontSize={{ base: "3xl", md: "4xl" }} lineHeight="1" fontWeight={700}
                        style={{ textShadow: INK_SHADOW }}>
                    {r.hanzi}
                  </Text>
                  <Text color={tcmTxt} fontSize="xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase"
                        opacity={0.75} mt={2} style={{ textShadow: INK_SHADOW }}>
                    {r.pinyin}
                  </Text>
                  <Text color={tcmTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight={800} lineHeight="1.25" mt={1}
                        style={{ textShadow: INK_SHADOW }}>
                    {r.titulo}
                  </Text>
                  <Box h="1px" w="100%" my={3} bg={`${tcmTxt}66`} />
                  <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.75"
                        style={{ textShadow: INK_SHADOW }}>
                    {r.texto}
                  </Text>
                </Panel>
              </Reveal>
            ))}
          </Box>

          {/* ── DE DÓNDE VIENE · solo la línea del tiempo; el texto, en el cómic ── */}
          <Seccion>De dónde viene</Seccion>
          <Reveal inView direction="up" distance={14} duration={0.6} amount={0.4} display="flex" justifyContent="center">
          <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} textAlign="center"
                maxW="640px" mt={-2}>
            Veintitrés siglos en nueve hitos. Pincha cualquiera y se abre por ahí.
          </Text>
          </Reveal>
          <Reveal inView direction="up" distance={24} scaleFrom={0.99} duration={0.7} amount={0.1} w="100%">
          <Panel>
            <Flex direction="column">
              {HISTORIA_QIGONG.map((h, i) => (
                <Flex key={h.key} as="button" onClick={() => setHitoAbierto(i)} textAlign="left"
                      w="100%" align="stretch" gap={{ base: 3, md: 5 }} py={{ base: 2.5, md: 3 }}
                      borderRadius="lg" transition="background 0.18s, transform 0.18s"
                      _hover={{ bg: `${tcmTxt}14`, transform: "translateX(3px)" }}
                      sx={{ WebkitTapHighlightColor: "transparent" }}>
                  <Text flexShrink={0} w={{ base: "72px", md: "110px" }} color={tcmTxt} alignSelf="center"
                        fontSize={{ base: "2xs", md: "sm" }} fontWeight={700} letterSpacing="0.08em"
                        textTransform="uppercase" opacity={0.85} style={{ textShadow: INK_SHADOW }}>
                    {h.fecha}
                  </Text>

                  {/* El raíl de la línea del tiempo: hilo continuo y un punto por hito. */}
                  <Flex direction="column" align="center" flexShrink={0} w="12px" alignSelf="stretch">
                    <Box flex="1" w="1px" bg={i === 0 ? "transparent" : `${tcmTxt}55`} />
                    <Box w="9px" h="9px" borderRadius="full" bg={tcmTxt} boxShadow={`0 0 10px ${tcmTxt}`} />
                    <Box flex="1" w="1px"
                         bg={i === HISTORIA_QIGONG.length - 1 ? "transparent" : `${tcmTxt}55`} />
                  </Flex>

                  <Text flex="1" minW={0} alignSelf="center" color={tcmTxt}
                        fontSize={{ base: "md", md: "lg" }} fontWeight={800} lineHeight="1.3"
                        style={{ textShadow: INK_SHADOW }}>
                    {h.titulo}
                  </Text>
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" alignSelf="center"
                       w="16px" h="16px" flexShrink={0} fill={tcmTxt} opacity={0.7}>
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Panel>
          </Reveal>

          {/* ── DAO YIN · el nombre y una línea; lo demás, en su cómic ── */}
          <Seccion>Dao Yin</Seccion>
          <Reveal inView direction="up" distance={24} scaleFrom={0.99} duration={0.7} amount={0.12} w="100%">
          <Panel>
            <Flex as="button" onClick={() => setDaoYinAbierto(true)} w="100%" textAlign="left"
                  direction={{ base: "column", sm: "row" }} align="center" gap={{ base: 4, md: 7 }}
                  sx={{ WebkitTapHighlightColor: "transparent" }} role="group">
              <Flex direction="column" align="center" flexShrink={0}>
                <Text color={tcmTxt} fontSize={{ base: "5xl", md: "6xl" }} lineHeight="1" fontWeight={700}
                      style={{ textShadow: INK_SHADOW }}>
                  {DAO_YIN.hanzi}
                </Text>
                <Text color={tcmTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.14em"
                      textTransform="uppercase" opacity={0.75} mt={2} style={{ textShadow: INK_SHADOW }}>
                  {DAO_YIN.pinyin}
                </Text>
              </Flex>

              <Box minW={0} flex="1">
                <Text color={tcmTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                      textAlign={{ base: "center", sm: "left" }} style={{ textShadow: INK_SHADOW }}>
                  {DAO_YIN.resumen}
                </Text>
                <Flex align="center" gap={2} mt={4} justify={{ base: "center", sm: "flex-start" }}
                      color={tcmTxt} transition="gap 0.18s" _groupHover={{ gap: 3 }}>
                  <Text fontSize={{ base: "sm", md: "md" }} fontWeight={700} letterSpacing="0.12em"
                        textTransform="uppercase" style={{ textShadow: INK_SHADOW }}>
                    Leer
                  </Text>
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px"
                       fill="currentColor">
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Panel>
          </Reveal>

          {/* ── LAS OCHO POSTURAS ── */}
          <Seccion>Los Ocho Brocados</Seccion>
          <Reveal inView direction="up" distance={14} duration={0.6} amount={0.4} display="flex" justifyContent="center">
          <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
                textAlign="center" maxW="700px" mt={-2}>
            Piezas de seda bordada: cortas, valiosas y que se pasan de mano en mano desde hace
            ochocientos años. Se hacen en orden, seguidas, en unos diez minutos.
          </Text>
          </Reveal>

          <Box display="grid" gridTemplateColumns="1fr" gap={{ base: 5, md: 6 }} w="100%">
            {BROCADOS.map((p, i) => (
              <Reveal key={p.key} inView direction="up" distance={26} scaleFrom={0.98} duration={0.7}
                      amount={0.12} w="100%" h="100%">
                <PosturaCard postura={p} numero={i + 1} />
              </Reveal>
            ))}
          </Box>

          {/* ── LOS CINCO ANIMALES ── */}
          <Seccion>Los cinco animales</Seccion>
          <Reveal inView direction="up" distance={24} scaleFrom={0.99} duration={0.7} amount={0.12} w="100%">
          <Panel>
            <Text color={tcmTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" mb={5}
                  style={{ textShadow: INK_SHADOW }}>
              La otra gran serie, la de Hua Tuo (五禽戲): un animal por elemento. Mira cuál te
              salió más cargado en tu mapa y empieza por su animal.
            </Text>
            <Flex direction="column" gap={4}>
              {CINCO_ANIMALES.map((a) => {
                const E = ELEMENTOS[a.elemento];
                return (
                  <Flex key={a.key} gap={{ base: 3, md: 4 }} align="flex-start" pt={4}
                        borderTop={`1px solid ${tcmTxt}33`}>
                    <Flex flexShrink={0} align="center" justify="center" w={{ base: "44px", md: "52px" }}
                          h={{ base: "44px", md: "52px" }} borderRadius="full" bg={`${E.color}33`}
                          border={`1.5px solid ${E.color}`} boxShadow={`0 0 14px ${E.color}66`}>
                      <Text color="white" fontSize={{ base: "xl", md: "2xl" }} lineHeight="1" fontWeight={700}
                            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>
                        {a.hanzi}
                      </Text>
                    </Flex>
                    <Box minW={0}>
                      <Flex align="baseline" gap={2.5} wrap="wrap">
                        <Text color={tcmTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight={800} lineHeight="1.2"
                              style={{ textShadow: INK_SHADOW }}>
                          {a.animal}
                        </Text>
                        <Text color={E.color} fontSize={{ base: "xs", md: "sm" }} fontWeight={700}
                              letterSpacing="0.08em" textTransform="uppercase"
                              style={{ textShadow: `0 1px 6px rgba(0,0,0,0.9)` }}>
                          {E.nombre} · {a.organo}
                        </Text>
                      </Flex>
                      <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.75" mt={1.5}
                            style={{ textShadow: INK_SHADOW }}>
                        {a.texto}
                      </Text>
                    </Box>
                  </Flex>
                );
              })}
            </Flex>
          </Panel>
          </Reveal>

          {/* ── NOTA FINAL ── */}
          <Reveal inView direction="up" distance={14} duration={0.6} amount={0.4} display="flex" justifyContent="center">
          <Text color="rgba(255,255,255,0.7)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="680px"
                lineHeight="1.7">
            {QIGONG_NOTA}
          </Text>
          </Reveal>
        </Flex>
      </Flex>

      {ilustracionesModal}

      {/* Cómic de la línea del tiempo: abre por el hito que se haya pulsado. */}
      <QigongComicModal
        isOpen={hitoAbierto !== null}
        vinetas={HISTORIA_QIGONG_VINETAS}
        initialIndex={hitoAbierto ?? 0}
        onClose={() => setHitoAbierto(null)}
      />

      {/* Cómic del Dao Yin y el rostro femenino del Dao. */}
      <QigongComicModal
        isOpen={daoYinAbierto}
        vinetas={DAO_YIN_VINETAS}
        onClose={() => setDaoYinAbierto(false)}
      />

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

// ── Tarjeta de una postura ───────────────────────────────────────────────────
// Misma estructura que las leyes del taoísmo: foto CUADRADA a la izquierda y
// texto a la derecha (en móvil la foto arriba). Mientras no haya foto, el hueco
// enseña el carácter chino: la tarjeta se sostiene igual, sin huecos ni fotos
// rotas.
function PosturaCard({ postura, numero }: { postura: Postura; numero: number }) {
  const [sinFoto, setSinFoto] = useState(false);
  const E = ELEMENTOS[postura.elemento];

  return (
    <Box position="relative" w="100%" h="100%" borderRadius="2xl" overflow="hidden"
         boxShadow={`${CAJA_GLOW}, 0 0 30px ${E.color}33`} display="flex" flexDirection="column">
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />

      <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }} align="stretch" h="100%">
        {/* Ilustración cuadrada · LIMPIA: sin velo, sin número y sin verso
            encima. Mientras no exista la foto, el hueco no se pinta: el verso
            chino se lee igual en la columna de texto. */}
        {!sinFoto && (
          <Box position="relative" flexShrink={0} overflow="hidden" bg={`${tcmBg}88`}
               w={{ base: "100%", md: "300px" }}
               sx={{ aspectRatio: "1" }}
               alignSelf={{ base: "auto", md: "flex-start" }}
               m={{ base: 0, md: 5 }}
               borderRadius={{ base: 0, md: "xl" }}>
            <Image src={encodeURI(FOTO_POSTURA(postura.key))} alt={postura.nombre} w="100%" h="100%"
                   objectFit="cover" onError={() => setSinFoto(true)} />
          </Box>
        )}

        {/* Texto */}
        <Box flex="1" minW={0} px={{ base: 6, md: 7 }} py={{ base: 5, md: 6 }}>
          {/* El verso chino, a la izquierda y sobre el nombre */}
          <Text color={tcmTxt} fontSize={{ base: "2xl", md: "3xl" }} lineHeight="1.25" fontWeight={700}
                style={{ textShadow: INK_SHADOW }}>
            {postura.hanzi}
          </Text>
          <Text color={tcmTxt} fontSize="xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase"
                opacity={0.75} mt={2} style={{ textShadow: INK_SHADOW }}>
            {numero} · {postura.pinyin}
          </Text>
          <Text color={tcmTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight={800} lineHeight="1.2" mt={0.5}
                style={{ textShadow: INK_SHADOW }}>
            {postura.nombre}
          </Text>

          {/* Órgano y elemento */}
          <Flex gap={2} wrap="wrap" mt={3}>
            <Box px={3} py={1} borderRadius="full" bg={`${E.color}2e`} border={`1px solid ${E.color}aa`}>
              <Text color="white" fontSize={{ base: "2xs", md: "xs" }} fontWeight={700} letterSpacing="0.04em"
                    style={{ textShadow: "0 1px 5px rgba(0,0,0,0.8)" }}>
                {postura.organo}
              </Text>
            </Box>
            <Box px={3} py={1} borderRadius="full" bg={`${E.color}2e`} border={`1px solid ${E.color}aa`}>
              <Text color="white" fontSize={{ base: "2xs", md: "xs" }} fontWeight={700} letterSpacing="0.04em"
                    style={{ textShadow: "0 1px 5px rgba(0,0,0,0.8)" }}>
                {E.nombre}
              </Text>
            </Box>
          </Flex>

          <Text color={tcmTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" fontWeight={600}
                lineHeight="1.6" mt={3.5} style={{ textShadow: INK_SHADOW }}>
            {postura.para}
          </Text>

          {/* Cómo se hace */}
          <Flex direction="column" gap={2.5} mt={4}>
            {postura.pasos.map((p, i) => (
              <Flex key={i} gap={3} align="flex-start">
                <Flex flexShrink={0} align="center" justify="center" w="22px" h="22px" borderRadius="full"
                      mt="2px" bg={`${E.color}33`} border={`1px solid ${E.color}`}>
                  <Text color="white" fontSize="2xs" fontWeight={800} lineHeight="1">{i + 1}</Text>
                </Flex>
                <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                      style={{ textShadow: INK_SHADOW }}>{p}</Text>
              </Flex>
            ))}
          </Flex>

          {/* Repeticiones + la clave de la postura */}
          <Flex gap={2.5} align="flex-start" mt={4} pt={4} borderTop={`1px solid ${tcmTxt}33`}>
            <Box flexShrink={0} mt={{ base: "9px", md: "10px" }} w="5px" h="5px" borderRadius="full"
                 bg={E.color} boxShadow={`0 0 6px ${E.color}`} />
            <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" opacity={0.92}
                  style={{ textShadow: INK_SHADOW }}>
              <Text as="span" fontWeight={800}>{postura.repeticiones}. </Text>
              {postura.clave}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

// ── Título de sección · va FUERA de las cajas: blanco y sin sombra ───────────
function Seccion({ children }: { children: React.ReactNode }) {
  return (
    <Reveal inView direction="up" distance={12} duration={0.55} amount={0.5} display="flex" justifyContent="center">
      <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight={700} letterSpacing="0.04em"
            textAlign="center">
        {children}
      </Text>
    </Reveal>
  );
}

// ── Box común de la página (misma caja que el resto del recorrido de TCM) ────
function Panel({ titulo, children, h }: { titulo?: string; children: React.ReactNode; h?: any }) {
  return (
    <Box position="relative" w="100%" h={h} borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }}>
        {titulo && (
          <>
            <Text color={tcmTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.1em"
                  textTransform="uppercase" mb={3} style={{ textShadow: INK_SHADOW }}>
              {titulo}
            </Text>
            <Box h="1px" w="100%" mb={4} bg={`${tcmTxt}88`} />
          </>
        )}
        {children}
      </Box>
    </Box>
  );
}
