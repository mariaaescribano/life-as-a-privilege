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
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, elementoMasCargado, type DatosTcm, type Elemento,
} from "../../components/metodo/tcmRecorrido";
import { ICONO_ELEMENTO, FOTO_ELEMENTO } from "../../components/metodo/tcmElementosContenido";
import {
  COCINA_ELEMENTO, FOTO_RECETA, RECETAS_NOTA, recetasDe, type Receta,
} from "../../components/metodo/tcmRecetasContenido";

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

export default function MetodoTcmRecetas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Se abre por el elemento que hoy más te pide atención; luego el usuario elige.
  const [elActivo, setElActivo] = useState<Elemento>("madera");
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
        // El recorrido guarda un blob único; si aún no hay datos, se abre en Madera.
        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: DatosTcm = res.data?.data ?? {};
        setElActivo(elementoMasCargado(d));
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Igual que en el resto del recorrido: no quitamos el loader hasta tener los
  // iconos y los fondos de los elementos descargados.
  const imagenesListas = usePrecargarImagenes([
    ...ORDEN_ELEMENTOS.map((el) => ICONO_ELEMENTO[el]),
    ...ORDEN_ELEMENTOS.map((el) => FOTO_ELEMENTO[el]),
  ]);

  if (loading || !imagenesListas) {
    return <TcmLoading />;
  }

  const E = ELEMENTOS[elActivo];
  const cocina = COCINA_ELEMENTO[elActivo];
  const recetas = recetasDe(elActivo);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1080px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Recetas tradicionales"
            pageLabel="8/9"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Taoísmo", onClick: () => navigate("/metodo/tcm/taoismo") }}
            extra={ilustracionesBtn}
            next={{ label: "Cursos →", onClick: () => navigate("/metodo/tcm/cursos") }}
          />
          </Reveal>

          {/* Texto bajo el header · sin sombra (va sobre el turquesa limpio) */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                textAlign="center" maxW="700px">
            En Medicina China la cocina es la primera farmacia. Cada elemento tiene su sabor, su
            temperatura y sus platos: elige el tuyo y empieza por una sola receta.
          </Text>
          </Reveal>

          {/* ── SELECTOR · los cinco elementos ── */}
          <Reveal direction="up" distance={22} delay={0.2} duration={0.68} w="100%">
          <Flex justify="center" wrap="wrap" gap={{ base: 3, md: 6 }} w="100%">
            {ORDEN_ELEMENTOS.map((el) => (
              <BotonElemento key={el} elemento={el} activo={el === elActivo} onClick={() => setElActivo(el)} />
            ))}
          </Flex>
          </Reveal>

          {/* ── CABECERA DEL ELEMENTO · foto de fondo + cómo se cocina ── */}
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
               border={`1px solid ${E.color}66`}
               boxShadow={`${CAJA_GLOW}, 0 0 48px ${E.color}55, inset 0 0 70px ${E.color}22`}>
            <Box key={`bg-${elActivo}`} position="absolute" inset={0}
                 bgImage={`url('${encodeURI(FOTO_ELEMENTO[elActivo])}')`} bgSize="cover" bgPosition="center"
                 sx={{ "@keyframes bgIn": { from: { opacity: 0 }, to: { opacity: 1 } } }}
                 style={{ animation: "bgIn 0.5s ease" }} />
            <Box position="absolute" inset={0} bgGradient="linear(to-r, rgba(0,0,0,0.78), rgba(0,0,0,0.35))" />

            <Box key={elActivo} position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }}
                 sx={{ "@keyframes elemIn": { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}
                 style={{ animation: "elemIn 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
              <Flex align="center" justify="space-between" gap={3} wrap="wrap" mb={3}>
                <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} lineHeight="1.15"
                      style={{ textShadow: "0 2px 10px rgba(0,0,0,0.9)" }}>
                  La cocina de la <Text as="span" color={E.color}>{E.nombre}</Text>
                </Text>
                <Box px={3} py={1} borderRadius="full" bg={`${E.color}44`} border={`1px solid ${E.color}`}
                     sx={{ backdropFilter: "blur(4px)" }}>
                  <Text color="white" fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.04em">
                    Sabor {cocina.sabor.toLowerCase()}
                  </Text>
                </Box>
              </Flex>
              <Box h="1px" w="100%" mb={4} bgGradient={`linear(to-r, ${E.color}, ${E.color}22, transparent)`} />
              <Text color="rgba(255,255,255,0.96)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.85"
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                {cocina.principio}
              </Text>
              <Text color="rgba(255,255,255,0.72)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={3}
                    style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
                Órganos: {E.organos} · Estación: {E.estacion.toLowerCase()}
              </Text>
            </Box>
          </Box>

          {/* ── LAS RECETAS DEL ELEMENTO ── */}
          <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 5, md: 6 }} w="100%">
            {recetas.map((r) => (
              // `key` con el elemento: al cambiar de elemento las tarjetas se
              // remontan y vuelven a entrar en escena en vez de cambiar de texto.
              <Reveal key={`${elActivo}-${r.key}`} inView direction="up" distance={24} scaleFrom={0.98}
                      duration={0.68} amount={0.12} w="100%" h="100%">
                <RecetaCard receta={r} color={E.color} />
              </Reveal>
            ))}
          </Box>

          {recetas.length === 0 && (
            <Panel>
              <Text color={`${tcmTxt}cc`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                    lineHeight="1.8">
                Pronto encontrarás aquí las recetas de este elemento.
              </Text>
            </Panel>
          )}

          {/* ── NOTA FINAL ── */}
          <Reveal inView direction="up" distance={14} duration={0.6} amount={0.4} display="flex" justifyContent="center">
          <Text color="rgba(255,255,255,0.7)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="680px"
                lineHeight="1.7">
            {RECETAS_NOTA} Estas recetas tienen un fin educativo y de autocuidado: no sustituyen la
            valoración de un profesional cualificado ni un tratamiento médico.
          </Text>
          </Reveal>
        </Flex>
      </Flex>

      {ilustracionesModal}

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

// ── Botón de un elemento en el selector (icono + nombre) ─────────────────────
function BotonElemento({ elemento, activo, onClick }: {
  elemento: Elemento; activo: boolean; onClick: () => void;
}) {
  const E = ELEMENTOS[elemento];
  return (
    <Flex as="button" onClick={onClick} direction="column" align="center" gap={1.5} cursor="pointer"
          transition="transform 0.2s ease" _hover={{ transform: "translateY(-3px)" }}>
      <Box w={{ base: "58px", md: "76px" }} h={{ base: "58px", md: "76px" }} borderRadius="full"
           overflow="hidden" border={`${activo ? 3 : 2}px solid ${activo ? "#ffffff" : `${E.color}aa`}`}
           opacity={activo ? 1 : 0.62}
           style={{
             boxShadow: activo ? `0 0 20px ${E.color}, 0 0 34px ${E.color}66` : `0 0 8px ${E.color}66`,
             transition: "all 0.25s ease",
           }}>
        <img src={ICONO_ELEMENTO[elemento]} alt={E.nombre}
             style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Box>
      <Text color="white" fontSize={{ base: "xs", md: "sm" }} fontWeight={activo ? 800 : 600}
            opacity={activo ? 1 : 0.75} style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
        {E.nombre}
      </Text>
    </Flex>
  );
}

// ── Tarjeta de una receta ────────────────────────────────────────────────────
// Si la receta tiene su foto en /recorrido/tcm/recetas/<key>.png, se pinta como
// banda superior; si aún no existe, la tarjeta va directa al texto (sin hueco).
function RecetaCard({ receta, color }: { receta: Receta; color: string }) {
  const [sinFoto, setSinFoto] = useState(false);

  return (
    <Box position="relative" w="100%" h="100%" borderRadius="2xl" overflow="hidden"
         boxShadow={`${CAJA_GLOW}, 0 0 34px ${color}44`}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />

      {!sinFoto && (
        <Box position="relative" zIndex={1} w="100%" overflow="hidden" sx={{ aspectRatio: "16 / 9" }}>
          <Image src={encodeURI(FOTO_RECETA(receta.key))} alt={receta.nombre}
                 w="100%" h="100%" objectFit="cover" onError={() => setSinFoto(true)} />
          {/* Velo inferior: el título de debajo arranca sobre el degradado y la
              foto no corta en seco. */}
          <Box position="absolute" inset={0} pointerEvents="none"
               bgGradient={`linear(to-t, ${tcmBg}f0, transparent 45%)`} />
        </Box>
      )}

      <Box position="relative" zIndex={1} px={{ base: 6, md: 8 }} py={{ base: 6, md: 7 }}>

        {/* Título + nombre chino */}
        <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight={800} lineHeight="1.2"
              style={{ textShadow: `0 1px 8px rgba(0,0,0,0.8), 0 0 18px ${color}55` }}>
          {receta.nombre}
          {receta.hanzi && (
            <Text as="span" color={color} fontWeight={700} ml={2}>{receta.hanzi}</Text>
          )}
        </Text>

        {/* Para qué sirve */}
        <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
              lineHeight="1.7" mt={2} style={{ textShadow: INK_SHADOW }}>
          {receta.para}
        </Text>

        {/* Etiquetas: tiempo y naturaleza */}
        <Flex gap={2} wrap="wrap" mt={3.5}>
          <Etiqueta color={color}>{receta.tiempo}</Etiqueta>
          <Etiqueta color={color}>{receta.naturaleza}</Etiqueta>
        </Flex>

        <Box h="1px" w="100%" my={{ base: 4, md: 5 }} bgGradient="linear(to-r, transparent, #ffffff, transparent)" />

        {/* Ingredientes */}
        <Rotulo color={color}>Ingredientes</Rotulo>
        <Flex direction="column" gap={1.5}>
          {receta.ingredientes.map((ing, i) => (
            <Flex key={i} gap={2.5} align="flex-start">
              <Box flexShrink={0} mt={{ base: "9px", md: "10px" }} w="5px" h="5px" borderRadius="full"
                   bg={color} boxShadow={`0 0 6px ${color}`} />
              <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                    style={{ textShadow: INK_SHADOW }}>{ing}</Text>
            </Flex>
          ))}
        </Flex>

        {/* Preparación */}
        <Rotulo color={color} mt={6}>Preparación</Rotulo>
        <Flex direction="column" gap={2.5}>
          {receta.pasos.map((p, i) => (
            <Flex key={i} gap={3} align="flex-start">
              <Flex flexShrink={0} align="center" justify="center" w="22px" h="22px" borderRadius="full"
                    mt="2px" bg={`${color}33`} border={`1px solid ${color}`}>
                <Text color="white" fontSize="2xs" fontWeight={800} lineHeight="1">{i + 1}</Text>
              </Flex>
              <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                    style={{ textShadow: INK_SHADOW }}>{p}</Text>
            </Flex>
          ))}
        </Flex>

        {/* Cuándo tomarla */}
        <Rotulo color={color} mt={6}>Cuándo</Rotulo>
        <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
              style={{ textShadow: INK_SHADOW }}>
          {receta.cuando}
        </Text>

        {/* Nota (opcional) */}
        {receta.nota && (
          <Box mt={5} px={4} py={3} borderRadius="lg" bg="rgba(0,0,0,0.3)" borderLeft={`3px solid ${color}`}>
            <Text color="rgba(255,255,255,0.88)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
              {receta.nota}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── Rótulo de apartado dentro de una receta ──────────────────────────────────
function Rotulo({ children, color, mt }: { children: React.ReactNode; color: string; mt?: any }) {
  return (
    <Text color={color} fontSize="xs" fontWeight={700} letterSpacing="0.1em" textTransform="uppercase"
          mt={mt} mb={2.5} style={{ textShadow: `0 0 10px ${color}55, ${INK_SHADOW}` }}>
      {children}
    </Text>
  );
}

// ── Etiqueta pequeña (tiempo, naturaleza) ────────────────────────────────────
function Etiqueta({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <Box px={3} py={1} borderRadius="full" bg={`${color}2e`} border={`1px solid ${color}aa`}>
      <Text color="white" fontSize={{ base: "2xs", md: "xs" }} fontWeight={700} letterSpacing="0.04em">
        {children}
      </Text>
    </Box>
  );
}

// ── Box común (mismo que el resto del recorrido) ─────────────────────────────
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
        {children}
      </Box>
    </Box>
  );
}
