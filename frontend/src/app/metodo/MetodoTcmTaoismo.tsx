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
import { DisciplinaBgLayer, disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { Reveal } from "../../components/global/Reveal";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { QigongComicModal } from "../../components/metodo/QigongComicModal";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  FOTO_LEY, LEYES_TAO, LEYES_TAO_VINETAS, TAOISMO_CIERRE, type LeyTao,
} from "../../components/metodo/tcmTaoismoContenido";

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

export default function MetodoTcmTaoismo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();
  // La ley que se está leyendo en el visor (índice dentro de LEYES_TAO).
  const [leyAbierta, setLeyAbierta] = useState<number | null>(null);

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

  // Igual que en el resto del recorrido de TCM: el loader NO se va hasta tener
  // descargadas la acuarela del fondo y las diez ilustraciones de las leyes.
  // Sacar los boxes y que las fotos entren después, una a una, quedaba fatal.
  const imagenesListas = usePrecargarImagenes([
    disciplinaBgImg(tcmNom),
    ...LEYES_TAO.map((ley) => FOTO_LEY(ley.key)),
  ]);

  if (loading || !imagenesListas) {
    return <TcmLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        {/* 850px = el ancho del MetodoStepHeader: ninguna caja de la página se
            sale de la cabecera. */}
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Taoísmo"
            pageLabel="7/10"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Lee tu lengua", onClick: () => navigate("/metodo/tcm/lengua/leer") }}
            extra={ilustracionesBtn}
            next={{ label: "Tu cocina →", onClick: () => navigate("/metodo/tcm/recetas") }}
          />
          </Reveal>

          {/* Cita de apertura (sin sombra: va sobre el turquesa limpio) */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Flex direction="column" align="center" gap={2} maxW="680px">
            <Text color="white" fontStyle="italic" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8"
                  textAlign="center">
              «El Tao que puede ser nombrado no es el Tao eterno.»
            </Text>
            <Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight={600} letterSpacing="0.06em"
                  textAlign="center" opacity={0.85}>
              — Lao-Tse
            </Text>
          </Flex>
          </Reveal>

          {/* ── LAS LEYES · DE DOS EN DOS ──
              Cada box: la ilustración de la ley arriba, y debajo, en una sola
              línea, el carácter chino, el nombre y el botón «Ver» a la derecha
              del todo. Las dos columnas juntas ocupan exactamente el ancho del
              header (los 850px del contenedor).

              La explicación entera (la esencia, el párrafo y cómo se traduce en
              el cuerpo) se lee en el visor: LEYES_TAO_VINETAS lleva LAS DIEZ,
              así que se abre por la que se pulse pero desde dentro se pasa a
              cualquier otra con las flechas — abrir por una no encierra a nadie
              en una sola página. */}
          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
               gap={{ base: 3.5, md: 4 }} w="100%" alignItems="stretch">
            {LEYES_TAO.map((ley, i) => (
              <Reveal key={ley.key} inView direction="up" distance={20} scaleFrom={0.99} duration={0.6}
                      amount={0.3} w="100%" h="100%" display="flex">
                <LeyBox ley={ley} numero={i + 1} onVer={() => setLeyAbierta(i)} />
              </Reveal>
            ))}
          </Box>

          {/* ── CIERRE ── */}
          <Reveal inView direction="up" distance={24} scaleFrom={0.98} duration={0.7} amount={0.2} w="100%">
          <Panel titulo="Y entonces, ¿qué es curarse?">
            <Text color={tcmTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9"
                  style={{ textShadow: INK_SHADOW }}>
              {TAOISMO_CIERRE.texto}
            </Text>
            <Box h="1px" w="100%" my={{ base: 5, md: 6 }} bgGradient={`linear(to-r, transparent, ${tcmTxt}, transparent)`} />
            <Text color={tcmTxt} fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                  textAlign="center" style={{ textShadow: INK_SHADOW }}>
              {TAOISMO_CIERRE.cita}
            </Text>
            <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontWeight={600} letterSpacing="0.06em"
                  textAlign="center" mt={2} opacity={0.85} style={{ textShadow: INK_SHADOW }}>
              {TAOISMO_CIERRE.autor}
            </Text>
          </Panel>
          </Reveal>

          {/* El paso siguiente, abajo a la derecha: el header ya se ha quedado
              muy arriba después de las diez leyes. Mismo texto que su botón. */}
          <BotonPaso label="Tu cocina" nom={tcmNom} color={tcmTxt} bg={tcmBg}
                     onClick={() => navigate("/metodo/tcm/recetas")} />
        </Flex>
      </Flex>

      {ilustracionesModal}

      {/* La ley que se haya pulsado: ilustración a la izquierda y explicación al
          lado. Abre por esa y deja pasar a las demás con las flechas. */}
      <QigongComicModal
        isOpen={leyAbierta !== null}
        vinetas={LEYES_TAO_VINETAS}
        initialIndex={leyAbierta ?? 0}
        onClose={() => setLeyAbierta(null)}
      />

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

// ── Box de una ley · la ilustración, y debajo carácter + nombre ──────────────
// Van de dos en dos (grid de 2 columnas), así que cada box es estrecho y la
// foto manda:
//
//   ┌──────────────────────┐
//   │      ilustración     │   ← a sangre arriba (la foto de ESA ley)
//   ├──────────────────────┤   ← línea separadora
//   │ 道  1 · TAO          │   ← una sola línea: carácter y nombre
//   │     El camino        │
//   └──────────────────────┘
//
// SIN botón «Ver»: el box entero ya es el botón, así que el rótulo solo
// repetía. Lo que invita a pulsar es el zoom lento de la foto al pasar el
// puntero por encima. Es la regla de todas las tarjetas con foto de la casa.
//
// La foto es cuadrada; aquí se recorta a una banda 4:3 (cover) para que diez
// boxes no conviertan la página en un scroll infinito. Entera se ve en el visor.
function LeyBox({ ley, numero, onVer }: { ley: LeyTao; numero: number; onVer: () => void }) {
  return (
    <Box as="button" onClick={onVer} w="100%" h="100%" display="flex" flexDirection="column" textAlign="left"
         position="relative" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}
         cursor="pointer" transition="transform 0.18s ease, box-shadow 0.18s ease"
         _hover={{ transform: "translateY(-2px)", boxShadow: `${CAJA_GLOW}, 0 0 30px ${tcmTxt}44` }}
         sx={{ WebkitTapHighlightColor: "transparent" }} role="group">
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />

      {/* La ilustración de la ley, a sangre. Si el archivo aún no existe, el
          hueco se queda con el fondo de la disciplina y el box no se rompe. */}
      <Box position="relative" zIndex={1} w="100%" overflow="hidden" sx={{ aspectRatio: "4 / 3" }}>
        <Image
          src={FOTO_LEY(ley.key)}
          alt=""
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="center"
          // `eager`: la página ya no se pinta hasta tenerlas todas en caché
          // (usePrecargarImagenes), así que diferirlas solo las haría aparecer
          // tarde al bajar.
          loading="eager"
          transition="transform 0.55s cubic-bezier(0.22,1,0.36,1)"
          _groupHover={{ transform: "scale(1.07)" }}
        />
      </Box>

      <Box position="relative" zIndex={1} h="1px" w="100%" bg={`${tcmTxt}66`} />

      {/* El pie, en una línea: el carácter y el nombre.
          `flex=1` para que, si en una fila un nombre ocupa dos líneas y el otro
          una, los dos boxes queden igual de altos. */}
      <Flex position="relative" zIndex={1} flex="1" align="center" gap={{ base: 3, md: 3.5 }}
            px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}>
        <Text flexShrink={0} color={tcmTxt} fontSize={{ base: "3xl", md: "4xl" }} lineHeight="1"
              fontWeight={700} textAlign="center"
              style={{ textShadow: `${INK_SHADOW}, 0 0 20px ${tcmTxt}44` }}>
          {ley.hanzi}
        </Text>

        <Box flex="1" minW={0}>
          <Text color={tcmTxt} fontSize="xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase"
                opacity={0.75} style={{ textShadow: INK_SHADOW }}>
            {numero} · {ley.pinyin}
          </Text>
          <Text color={tcmTxt} fontSize={{ base: "md", md: "lg" }} fontWeight={800} lineHeight="1.25" mt={0.5}
                style={{ textShadow: INK_SHADOW }}>
            {ley.nombre}
          </Text>
        </Box>

      </Flex>
    </Box>
  );
}

// ── Box común de la página (misma caja que el resto del recorrido de TCM) ────
function Panel({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
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
