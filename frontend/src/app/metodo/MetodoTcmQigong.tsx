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
  BROCADOS, BROCADOS_VINETAS, DAO_YIN, DAO_YIN_VINETAS,
  FOTO_POSTURA, QIGONG_INTRO, QIGONG_NOTA, type Postura,
} from "../../components/metodo/tcmQigongContenido";

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// 850px = el ancho del MetodoStepHeader: ninguna caja se sale de la cabecera.
const ANCHO = "850px";

export default function MetodoTcmQigong() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();
  // Cómics que se abren DESDE la página: el Dao Yin y la postura que se pulse.
  // Los dos intercalados (la historia del Qigong y los cinco animales) se ven
  // seguidos al ENTRAR, entre Tu cocina y Qigong; ya no hay ninguno al salir
  // hacia Cursos.
  const [daoYinAbierto, setDaoYinAbierto] = useState(false);
  const [brocadoAbierto, setBrocadoAbierto] = useState<number | null>(null);

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

          {/* Fuera de aquí: «La cuarta rama de esta medicina», «Las tres
              regulaciones» y «De dónde viene» (con su línea del tiempo). La
              historia ya no se lee en esta página: su cómic se ve ENTERO al
              venir de «Tu cocina», intercalado en el paso (ver MetodoTcmRecetas).
              El contenido sigue en tcmQigongContenido.ts por si vuelve. */}

          {/* ── DAO YIN · una franja, no una caja ──
              Antes era un box alto con el 導引 gigante, el pinyin, una raya y la
              frase debajo: ocupaba media pantalla para decir una línea. Ahora es
              un rectángulo estirado —el ancho del header, sin pasarse— con todo
              en la MISMA línea: el chino, «Dao Yin», un filete vertical y la
              frase. En móvil se apila, que ahí una sola línea no cabe. */}
          <Reveal inView direction="up" distance={20} scaleFrom={0.995} duration={0.7} amount={0.12} w="100%">
          <Box as="button" onClick={() => setDaoYinAbierto(true)} w="100%" display="block"
               position="relative" borderRadius="xl" overflow="hidden"
               border={`1.5px solid ${tcmTxt}66`} boxShadow={CAJA_GLOW}
               cursor="pointer" transition="transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease"
               _hover={{ transform: "translateY(-3px)", borderColor: tcmTxt,
                         boxShadow: `${CAJA_GLOW}, 0 0 34px ${tcmTxt}44` }}
               sx={{ WebkitTapHighlightColor: "transparent" }} role="group">
            <DisciplinaBgLayer nom={tcmNom} borderRadius="xl" />
            <Flex position="relative" zIndex={1} align="center" justify="center"
                  direction={{ base: "column", md: "row" }}
                  gap={{ base: 2, md: 5 }} textAlign={{ base: "center", md: "left" }}
                  px={{ base: 5, md: 8 }} py={{ base: 5, md: 4 }}>
              <Text color={tcmTxt} fontSize={{ base: "3xl", md: "4xl" }} lineHeight="1" fontWeight={700}
                    letterSpacing="0.08em" flexShrink={0}
                    style={{ textShadow: `${INK_SHADOW}, 0 0 22px ${tcmTxt}55` }}>
                {DAO_YIN.hanzi}
              </Text>
              <Text color={tcmTxt} fontSize="xs" fontWeight={700} letterSpacing="0.3em" flexShrink={0}
                    textTransform="uppercase" opacity={0.8} style={{ textShadow: INK_SHADOW }}>
                Dao Yin
              </Text>
              {/* El filete vertical solo en ordenador: en móvil separa el apilado
                  el propio `gap`. */}
              <Box display={{ base: "none", md: "block" }} flexShrink={0} w="1px" h="26px"
                   bgGradient={`linear(to-b, transparent, ${tcmTxt}88, transparent)`} />
              <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" lineHeight="1.5"
                    style={{ textShadow: INK_SHADOW }}>
                La integración en el ser humano de la energía femenina del Dao (Dios)
              </Text>
            </Flex>
          </Box>
          </Reveal>

          {/* ── LAS POSTURAS · la foto y su nombre corto ──
              Tres por fila en ordenador y una en móvil. La explicación entera
              (para qué es, los pasos y la clave) se lee en el visor, con la
              ilustración al lado: BROCADOS_VINETAS abre por la que se pulse y
              desde dentro se pasa de una a otra con las flechas. */}
          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(3, minmax(0, 1fr))" }}
               gap={{ base: 4, md: 5 }} w="100%">
            {BROCADOS.map((p, i) => (
              <Reveal key={p.key} inView direction="up" distance={26} scaleFrom={0.98} duration={0.7}
                      amount={0.12} w="100%" h="100%">
                <BrocadoBox postura={p} onVer={() => setBrocadoAbierto(i)} />
              </Reveal>
            ))}
          </Box>

          {/* Los cinco animales ya no se leen aquí: son el segundo cómic del
              paso Tu cocina → Qigong, justo detrás de la historia del Qigong
              (CINCO_ANIMALES_VINETAS, en MetodoTcmRecetas). */}

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

      {/* Cómic del Dao Yin y el rostro femenino del Dao. */}
      <QigongComicModal
        isOpen={daoYinAbierto}
        vinetas={DAO_YIN_VINETAS}
        onClose={() => setDaoYinAbierto(false)}
      />

      {/* La postura que se haya pulsado: foto a la izquierda y explicación al
          lado. Abre por esa y deja pasar a las demás con las flechas. */}
      <QigongComicModal
        isOpen={brocadoAbierto !== null}
        vinetas={BROCADOS_VINETAS}
        initialIndex={brocadoAbierto ?? 0}
        onClose={() => setBrocadoAbierto(null)}
      />

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

// ── Box de una postura · la foto y su nombre ─────────────────────────────────
// La explicación entera se lee en el visor (BROCADOS_VINETAS), no aquí: la
// rejilla es para elegir con los ojos, no para leer.
//
// Sin número y sin botón «Ver»: el número no decía nada (el orden ya se ve en la
// fila) y el botón repetía lo que la tarjeta entera ya hace. Lo que invita a
// pulsar es la foto, que hace un zoom lento al pasar el puntero por encima.
// Debajo, el nombre CORTO en una sola línea, para que las tarjetas de una fila
// midan todas lo mismo.
//
// Mientras no exista la ilustración, el hueco enseña el verso chino en grande:
// la rejilla no se descuadra y no se ve ninguna foto rota.
function BrocadoBox({ postura, onVer }: { postura: Postura; onVer: () => void }) {
  const [sinFoto, setSinFoto] = useState(false);
  const E = ELEMENTOS[postura.elemento];

  return (
    <Box as="button" onClick={onVer} w="100%" h="100%" display="flex" flexDirection="column"
         textAlign="left" position="relative" borderRadius="2xl" overflow="hidden"
         boxShadow={`${CAJA_GLOW}, 0 0 30px ${E.color}33`}
         cursor="pointer" transition="transform 0.2s ease, box-shadow 0.2s ease"
         _hover={{ transform: "translateY(-3px)", boxShadow: `${CAJA_GLOW}, 0 0 40px ${E.color}66` }}
         sx={{ WebkitTapHighlightColor: "transparent" }} role="group">
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />

      {/* La ilustración, cuadrada y a todo el ancho del box. El zoom al pasar
          por encima es lo que hace de «Ver». */}
      <Box position="relative" zIndex={1} w="100%" overflow="hidden" bg={`${tcmBg}88`}
           sx={{ aspectRatio: "1" }}>
        {!sinFoto ? (
          <Image src={encodeURI(FOTO_POSTURA(postura.key))} alt={postura.nombre} w="100%" h="100%"
                 objectFit="cover" onError={() => setSinFoto(true)}
                 transition="transform 0.55s cubic-bezier(0.22,1,0.36,1)"
                 _groupHover={{ transform: "scale(1.07)" }} />
        ) : (
          <Flex w="100%" h="100%" align="center" justify="center" px={4} textAlign="center">
            <Text color={tcmTxt} fontSize={{ base: "3xl", md: "2xl" }} lineHeight="1.3" fontWeight={700}
                  opacity={0.85} style={{ textShadow: INK_SHADOW }}>
              {postura.hanzi}
            </Text>
          </Flex>
        )}
      </Box>

      {/* Pie: el nombre corto, una sola línea. */}
      <Flex position="relative" zIndex={1} flex="1" align="center"
            px={{ base: 5, md: 4 }} py={{ base: 3.5, md: 3 }}>
        <Text color={tcmTxt} fontSize={{ base: "md", md: "sm" }} fontWeight={800} lineHeight="1.3"
              noOfLines={1} style={{ textShadow: INK_SHADOW }}>
          {postura.corto}
        </Text>
      </Flex>
    </Box>
  );
}
