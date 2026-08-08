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
  COCINA_NOTA, FOTO_COCINA, cocinaDe, type Coccion,
} from "../../components/metodo/tcmCocinaContenido";

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// Toda la página vive dentro del mismo ancho que el header del recorrido
// (MetodoStepHeader va a 850px): ningún box se sale de esa columna.
const ANCHO = "850px";

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
  const cocina = cocinaDe(elActivo);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW={ANCHO} gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Tu cocina diaria"
            pageLabel="8/10"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            maxW={ANCHO}
            mb={0}
            prev={{ label: "← Taoísmo", onClick: () => navigate("/metodo/tcm/taoismo") }}
            extra={ilustracionesBtn}
            next={{ label: "Qigong →", onClick: () => navigate("/metodo/tcm/qigong") }}
          />
          </Reveal>

          {/* Texto bajo el header · sin sombra (va sobre el turquesa limpio) */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                textAlign="center" maxW="700px">
            En Medicina China la cocina es la primera farmacia. Aquí no hay recetas cerradas:
            hay ingredientes que aportar cada día y formas de cocinar que cambian lo que un
            mismo alimento hace en ti. Elige tu elemento y empieza por un solo gesto.
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

          {/* ── LO QUE APORTAR CADA DÍA ── */}
          <Seccion>Cada día</Seccion>
          <Reveal key={`dia-${elActivo}`} inView direction="up" distance={22} scaleFrom={0.99} duration={0.66}
                  amount={0.12} w="100%">
            <Panel>
              <Flex direction="column" gap={3}>
                {cocina.cadaDia.map((g, i) => (
                  <Flex key={i} gap={3} align="flex-start">
                    <Flex flexShrink={0} align="center" justify="center" w="22px" h="22px" borderRadius="full"
                          mt="3px" bg={`${E.color}33`} border={`1px solid ${E.color}`}>
                      <Text color="white" fontSize="2xs" fontWeight={800} lineHeight="1">{i + 1}</Text>
                    </Flex>
                    <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.75"
                          style={{ textShadow: INK_SHADOW }}>{g}</Text>
                  </Flex>
                ))}
              </Flex>
            </Panel>
          </Reveal>

          {/* ── LOS INGREDIENTES, POR FAMILIAS ── */}
          <Seccion>Ingredientes que aportar</Seccion>
          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
               gap={{ base: 5, md: 6 }} w="100%">
            {cocina.grupos.map((g) => (
              // `key` con el elemento: al cambiar de elemento las tarjetas se
              // remontan y vuelven a entrar en escena en vez de cambiar de texto.
              <Reveal key={`${elActivo}-${g.key}`} inView direction="up" distance={24} scaleFrom={0.98}
                      duration={0.68} amount={0.12} w="100%" h="100%">
                <Panel h="100%">
                  <Rotulo color={E.color}>{g.titulo}</Rotulo>
                  <Flex direction="column" gap={3}>
                    {g.alimentos.map((a, i) => (
                      <Flex key={i} gap={2.5} align="flex-start" minW={0}>
                        <Box flexShrink={0} mt={{ base: "9px", md: "10px" }} w="5px" h="5px" borderRadius="full"
                             bg={E.color} boxShadow={`0 0 6px ${E.color}`} />
                        <Box minW={0}>
                          <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight={700} lineHeight="1.5"
                                style={{ textShadow: INK_SHADOW }}>{a.nombre}</Text>
                          <Text color="rgba(255,255,255,0.86)" fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                                lineHeight="1.65" style={{ textShadow: INK_SHADOW }}>{a.aporta}</Text>
                        </Box>
                      </Flex>
                    ))}
                  </Flex>
                </Panel>
              </Reveal>
            ))}
          </Box>

          {/* ── FORMAS DE COCINAR ──
              Una sola columna: las ilustraciones son CUADRADAS y van al lado del
              texto (como los boxes de cómic), así que cada tarjeta necesita el
              ancho entero. */}
          <Seccion>Formas de cocinar</Seccion>
          <Box display="grid" gridTemplateColumns="1fr" gap={{ base: 5, md: 6 }} w="100%">
            {cocina.cocciones.map((c, i) => (
              <Reveal key={`${elActivo}-${c.key}`} inView direction="up" distance={24} scaleFrom={0.98}
                      duration={0.68} amount={0.12} w="100%" h="100%">
                <CoccionCard coccion={c} elemento={elActivo} numero={i + 1} color={E.color} />
              </Reveal>
            ))}
          </Box>

          {/* ── LO QUE CONVIENE BAJAR + UN DÍA CUALQUIERA ── */}
          <Seccion>Baja un poco</Seccion>
          <Reveal key={`baja-${elActivo}`} inView direction="up" distance={20} duration={0.64} amount={0.15} w="100%">
            <Panel>
              <Flex gap={2.5} wrap="wrap">
                {cocina.baja.map((b, i) => (
                  <Etiqueta key={i} color={E.color}>{b}</Etiqueta>
                ))}
              </Flex>
            </Panel>
          </Reveal>

          <Seccion>Así queda un día</Seccion>
          <Reveal key={`jornada-${elActivo}`} inView direction="up" distance={20} duration={0.64} amount={0.12} w="100%">
            <Panel>
              <Flex direction="column" gap={4}>
                {cocina.dia.map((m, i) => (
                  <Flex key={i} direction={{ base: "column", sm: "row" }} gap={{ base: 1, sm: 4 }} align="flex-start">
                    <Text flexShrink={0} w={{ base: "auto", sm: "130px" }} color={E.color}
                          fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.08em"
                          textTransform="uppercase" mt={{ base: 0, sm: "3px" }}
                          style={{ textShadow: `0 0 10px ${E.color}55, ${INK_SHADOW}` }}>
                      {m.momento}
                    </Text>
                    <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                          minW={0} style={{ textShadow: INK_SHADOW }}>
                      {m.texto}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Panel>
          </Reveal>

          {/* ── NOTA FINAL ── */}
          <Reveal inView direction="up" distance={14} duration={0.6} amount={0.4} display="flex" justifyContent="center">
          <Text color="rgba(255,255,255,0.7)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="680px"
                lineHeight="1.7">
            {COCINA_NOTA} Todo esto tiene un fin educativo y de autocuidado: no sustituye la
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

// ── Tarjeta de una forma de cocinar ──────────────────────────────────────────
// Las ilustraciones son CUADRADAS (1:1), así que van enteras a la izquierda y el
// texto a la derecha —la estructura de los boxes con ilustración del recorrido—.
// En móvil la ilustración pasa arriba, cuadrada y a todo el ancho. Si todavía no
// existe el archivo, la tarjeta se queda solo con el texto, sin hueco.
function CoccionCard({ coccion, elemento, numero, color }: {
  coccion: Coccion; elemento: Elemento; numero: number; color: string;
}) {
  const [sinFoto, setSinFoto] = useState(false);

  return (
    <Box position="relative" w="100%" h="100%" borderRadius="2xl" overflow="hidden"
         boxShadow={`${CAJA_GLOW}, 0 0 30px ${color}33`} display="flex" flexDirection="column">
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />

      <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }} align="stretch" h="100%">
        {!sinFoto && (
          <Box position="relative" flexShrink={0} overflow="hidden" bg={`${tcmBg}88`}
               w={{ base: "100%", md: "300px" }}
               sx={{ aspectRatio: "1" }}
               alignSelf={{ base: "auto", md: "flex-start" }}
               m={{ base: 0, md: 5 }}
               borderRadius={{ base: 0, md: "xl" }}>
            <Image src={encodeURI(FOTO_COCINA(elemento, numero - 1))} alt={coccion.nombre}
                   w="100%" h="100%" objectFit="cover" onError={() => setSinFoto(true)} />
          </Box>
        )}

        <Box flex="1" minW={0} px={{ base: 6, md: 7 }} py={{ base: 5, md: 6 }}>
          <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight={800} lineHeight="1.2"
                style={{ textShadow: `0 1px 8px rgba(0,0,0,0.8), 0 0 18px ${color}55` }}>
            {coccion.nombre}
          </Text>
          <Box h="1px" w="100%" my={{ base: 3.5, md: 4 }}
               bgGradient="linear(to-r, transparent, #ffffff, transparent)" />
          <Rotulo color={color}>Cómo</Rotulo>
          <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                style={{ textShadow: INK_SHADOW }}>{coccion.como}</Text>
          <Rotulo color={color} mt={5}>Por qué</Rotulo>
          <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>{coccion.porque}</Text>
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

// ── Rótulo de apartado dentro de una caja ────────────────────────────────────
function Rotulo({ children, color, mt }: { children: React.ReactNode; color: string; mt?: any }) {
  return (
    <Text color={color} fontSize="xs" fontWeight={700} letterSpacing="0.1em" textTransform="uppercase"
          mt={mt} mb={2.5} style={{ textShadow: `0 0 10px ${color}55, ${INK_SHADOW}` }}>
      {children}
    </Text>
  );
}

// ── Etiqueta pequeña ─────────────────────────────────────────────────────────
function Etiqueta({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <Box px={3} py={1.5} borderRadius="full" bg={`${color}2e`} border={`1px solid ${color}aa`}>
      <Text color="white" fontSize={{ base: "2xs", md: "xs" }} fontWeight={700} letterSpacing="0.04em">
        {children}
      </Text>
    </Box>
  );
}

// ── Box común (mismo que el resto del recorrido) ─────────────────────────────
function Panel({ children, h }: { children: React.ReactNode; h?: any }) {
  return (
    <Box position="relative" w="100%" h={h} borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 8 }} py={{ base: 6, md: 7 }}>
        {children}
      </Box>
    </Box>
  );
}
