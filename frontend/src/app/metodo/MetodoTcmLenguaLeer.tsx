import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useInView, useReducedMotion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { ELEMENTOS, type DatosTcm } from "../../components/metodo/tcmRecorrido";
import {
  DIMENSIONES_SELECCIONABLES, lenguaObsKey, opcionElegida, lenguaCompleta, patronesPredominantes,
  type OpcionLengua, type LenguaDim,
} from "../../components/metodo/tcmLenguaContenido";

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

export default function MetodoTcmLenguaLeer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatosTcm>({});
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        setData(res.data?.data ?? {});
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Autoguardado: al elegir una variante, se guarda al instante en data.observarte.
  const elegir = async (dim: LenguaDim, opKey: string) => {
    const next: DatosTcm = {
      ...data,
      observarte: { ...data.observarte, [lenguaObsKey(dim)]: opKey },
    };
    setData(next);
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (userId && token) {
      try {
        await axios.patch(`${API_URL}/metodo-tcm/${userId}`, { data: next },
          { headers: { Authorization: `Bearer ${token}` } });
      } catch { /* el estado local ya refleja el cambio */ }
    }
  };

  // No mostramos la herramienta hasta que las fotos de lengua estén descargadas.
  const fotosListas = usePrecargarImagenes(
    DIMENSIONES_SELECCIONABLES.flatMap((d) => d.opciones.map((o) => encodeURI(o.src))),
  );

  if (loading || !fotosListas) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="960px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Lee tu lengua"
            pageLabel="6/7"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← El curso", onClick: () => navigate("/metodo/tcm/lengua") }}
            extra={ilustracionesBtn}
            next={{ label: "Cursos →", onClick: () => navigate("/metodo/tcm/cursos") }}
          />
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                textAlign="center" maxW="680px">
            Ahora que sabes leer una lengua, mira la tuya. Colócate frente a un espejo con buena luz
            natural, por la mañana y antes de comer o beber, y saca la lengua sin forzar.
          </Text>
          </Reveal>

          {/* ── HERRAMIENTA · lee tu propia lengua ──
              Un solo box, pero cada apartado repite la imagen de fondo TCM (a su
              propia altura, para que no se deforme al ser el box tan grande) y va
              separado por líneas horizontales. */}
          <Reveal direction="up" distance={28} scaleFrom={0.98} delay={0.2} duration={0.72} w="100%">
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
               boxShadow={CAJA_GLOW} bg="rgba(0,0,0,0.28)">
            {/* Cabecera: título + intro */}
            <Banda>
              <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontWeight={700} letterSpacing="0.1em"
                    textTransform="uppercase" mb={3} style={{ textShadow: INK_SHADOW }}>
                Lee tu propia lengua
              </Text>
              <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                    lineHeight="1.7" maxW="640px" style={{ textShadow: INK_SHADOW }}>
                Elige lo que más se parezca a la tuya en cada apartado. No hay respuestas correctas.
              </Text>
            </Banda>
            <Separador />

            {DIMENSIONES_SELECCIONABLES.map((d, i) => {
              const elegida = opcionElegida(d.dim, data.observarte);
              const last = i === DIMENSIONES_SELECCIONABLES.length - 1;
              return (
                <React.Fragment key={d.dim}>
                  <Banda>
                    <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontWeight={700}
                          letterSpacing="0.08em" textTransform="uppercase" mb={3}
                          style={{ textShadow: INK_SHADOW }}>
                      {d.titulo}
                    </Text>
                    <SelectoresLengua
                      opciones={d.opciones}
                      elegidaKey={elegida?.key}
                      onElegir={(k) => elegir(d.dim, k)}
                    />
                  </Banda>
                  {/* Sin separador tras el último apartado (no hace falta). */}
                  {!last && <Separador />}
                </React.Fragment>
              );
            })}
          </Box>
          </Reveal>

          {/* ── LECTURA · «Tu lengua hoy» (separador con mandala + apartados) ── */}
          {lenguaCompleta(data.observarte) && <LecturaLengua observarte={data.observarte} />}

          <Reveal inView direction="up" distance={14} duration={0.6} amount={0.5} display="flex" justifyContent="center">
          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="640px"
                lineHeight="1.6">
            La lectura de la lengua es una herramienta de autoconocimiento con fines educativos. No constituye
            un diagnóstico clínico ni sustituye la valoración de un profesional cualificado.
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

// ── Fila de tarjetas seleccionables (aparecen UNA A UNA al asomar en scroll) ──
function SelectoresLengua({ opciones, elegidaKey, onElegir }: {
  opciones: OpcionLengua[]; elegidaKey?: string; onElegir: (key: string) => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const enter = reduce || inView;
  return (
    <Flex ref={ref} wrap="wrap" gap={{ base: 2.5, md: 3.5 }}>
      {opciones.map((op, i) => (
        <SelectorCard
          key={op.key}
          opcion={op}
          index={i}
          enter={enter}
          seleccionada={elegidaKey === op.key}
          onClick={() => onElegir(op.key)}
        />
      ))}
    </Flex>
  );
}

// ── Tarjeta seleccionable (ilustración + nombre) ─────────────────────────────
function SelectorCard({ opcion, seleccionada, onClick, index, enter }: {
  opcion: OpcionLengua; seleccionada: boolean; onClick: () => void; index: number; enter: boolean;
}) {
  return (
    <Box as="button" onClick={onClick} textAlign="center"
         w={{ base: "calc(33.333% - 7px)", sm: "120px", md: "132px" }}
         borderRadius="xl" overflow="hidden" cursor="pointer"
         bg={seleccionada ? `${tcmTxt}26` : "rgba(0,0,0,0.28)"}
         border={`2px solid ${seleccionada ? tcmTxt : "rgba(255,255,255,0.18)"}`}
         boxShadow={seleccionada ? `0 0 18px ${tcmTxt}88` : "none"}
         opacity={enter ? 1 : 0}
         transform={enter ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)"}
         _hover={{ borderColor: seleccionada ? tcmTxt : `${tcmTxt}88`, bg: seleccionada ? `${tcmTxt}33` : "rgba(255,255,255,0.08)" }}
         sx={{ backdropFilter: "blur(6px)", transitionDelay: `${index * 0.05}s` }}
         transition="opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.15s, background 0.15s">
      <LenguaImg src={opcion.src} alt={opcion.nombre} />
      <Box px={2} py={2.5}>
        <Text color="white" fontSize={{ base: "2xs", md: "xs" }} fontWeight={seleccionada ? 700 : 600}
              lineHeight="1.35" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}>
          {opcion.nombre}
        </Text>
      </Box>
    </Box>
  );
}

// ── Imagen de lengua con marco cuadrado (funciona aunque falte el PNG) ───────
function LenguaImg({ src, alt }: { src: string; alt: string }) {
  return (
    <Box w="100%" sx={{ aspectRatio: "1 / 1" }} bg="rgba(255,255,255,0.04)"
         display="flex" alignItems="center" justifyContent="center">
      <img src={encodeURI(src)} alt={alt}
           style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Box>
  );
}

// ── Síntesis: reúne las elecciones del usuario en una lectura ────────────────
function LecturaLengua({ observarte }: { observarte: DatosTcm["observarte"] }) {
  const elegidas = DIMENSIONES_SELECCIONABLES.map((d) => ({
    dim: d, opcion: opcionElegida(d.dim, observarte),
  })).filter((x): x is { dim: typeof x.dim; opcion: OpcionLengua } => !!x.opcion);
  if (elegidas.length < DIMENSIONES_SELECCIONABLES.length) return null;

  const todasSanas = elegidas.every((x) => x.opcion.equilibrio);
  const resumen = elegidas.map((x) => x.opcion.nombre.toLowerCase()).join(" · ");
  const patrones = patronesPredominantes(observarte);
  const sano = todasSanas || patrones.length === 0;

  // Ya no es UN box: es un apartado. Un separador con mandala lo abre; luego la
  // cabecera «Tu lengua hoy» y, debajo, un box por cada desequilibrio.
  return (
    <>
      <MandalaSeparador />

      {/* Cabecera · «Tu lengua hoy» + resumen + intro */}
      <Reveal inView direction="up" distance={24} scaleFrom={0.98} duration={0.7} amount={0.2} w="100%">
        <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
             boxShadow={`${CAJA_GLOW}, 0 0 42px ${tcmTxt}44`}>
          <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
          <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
            <Text color={tcmTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.1em"
                  textTransform="uppercase" mb={3} style={{ textShadow: INK_SHADOW }}>
              Tu lengua hoy
            </Text>
            <Text color="white" fontSize={{ base: "lg", md: "2xl" }} fontWeight={700} lineHeight="1.4"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}>
              {resumen}
            </Text>
            {sano ? (
              <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.9" mt={5}
                    style={{ textShadow: INK_SHADOW }}>
                Tu lengua refleja un buen equilibrio: la Sangre nutre, el Qi circula y el Yin y el Yang se
                sostienen. Cuídalo con lo que ya sabes de tu recorrido y vuelve a observarte de vez en cuando:
                la lengua cambia contigo.
              </Text>
            ) : (
              <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                    lineHeight="1.7" mt={4} style={{ textShadow: INK_SHADOW }}>
                Esto es lo que tu lengua sugiere hoy y cómo puedes acompañar tu equilibrio. Cuantas más
                señales apuntan a un mismo patrón, más presente está.
              </Text>
            )}
          </Box>
        </Box>
      </Reveal>

      {/* Un box por desequilibrio, en rejilla de 2 columnas (menos extendidos) */}
      {!sano && (
      <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 5, md: 6 }} w="100%">
      {patrones.map(({ patron, info, veces }) => {
        const E = ELEMENTOS[info.elemento];
        return (
          <Reveal key={patron} inView direction="up" distance={26} scaleFrom={0.98} duration={0.7} amount={0.2} w="100%" h="100%">
            <Box position="relative" w="100%" h="100%" borderRadius="2xl" overflow="hidden"
                 boxShadow={`${CAJA_GLOW}, 0 0 34px ${E.color}44`}>
              <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 7 }} py={{ base: 6, md: 7 }}>
                {/* Cabecera del patrón · rediseñada: elemento arriba, título debajo */}
                <Flex align="center" justify="space-between" gap={2} wrap="wrap">
                  <Flex align="center" gap={2}>
                    <Box w="10px" h="10px" borderRadius="full" bg={E.color}
                         style={{ boxShadow: `0 0 8px ${E.color}` }} />
                    <Text color={E.color} fontSize="xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase"
                          style={{ textShadow: `0 0 10px ${E.color}66` }}>
                      {E.nombre}
                    </Text>
                  </Flex>
                  <Text color="rgba(255,255,255,0.5)" fontSize="2xs" fontStyle="italic" letterSpacing="0.04em">
                    {veces} {veces === 1 ? "señal" : "señales"}
                  </Text>
                </Flex>
                {/* Título del patrón · p.ej. «Calor» */}
                <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight={800} lineHeight="1.15" mt={2}
                      style={{ textShadow: `0 1px 8px rgba(0,0,0,0.8), 0 0 18px ${E.color}66` }}>
                  {info.nombre}
                </Text>

                {/* Separador horizontal blanco */}
                <Box h="1px" w="100%" my={{ base: 4, md: 5 }} bgGradient="linear(to-r, transparent, #ffffff, transparent)" />

                {/* Qué significa */}
                <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.85"
                      style={{ textShadow: INK_SHADOW }}>
                  {info.senal}
                </Text>

                {/* Cómo equilibrarlo — en el color del elemento (el de los puntos) */}
                <Text color={E.color} fontSize="xs" fontWeight={700} letterSpacing="0.1em" textTransform="uppercase"
                      mt={6} mb={2.5} style={{ textShadow: `0 0 10px ${E.color}55, ${INK_SHADOW}` }}>
                  Cómo equilibrarlo
                </Text>
                <Flex direction="column" gap={1.5}>
                  {info.comoEquilibrar.map((c, i) => (
                    <Flex key={i} gap={2.5} align="flex-start">
                      <Box flexShrink={0} mt={{ base: "9px", md: "10px" }} w="5px" h="5px"
                           borderRadius="full" bg={E.color} boxShadow={`0 0 6px ${E.color}`} />
                      <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                            style={{ textShadow: INK_SHADOW }}>{c}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            </Box>
          </Reveal>
        );
      })}
      </Box>
      )}

      {/* Nota final */}
      {!sano && (
        <Reveal inView direction="up" distance={14} duration={0.6} amount={0.4} display="flex" justifyContent="center">
          <Text color="rgba(255,255,255,0.7)" fontSize="xs" fontStyle="italic" lineHeight="1.6" textAlign="center"
                maxW="640px" style={{ textShadow: INK_SHADOW }}>
            Vuelve a mirar tu lengua dentro de unos días y compara: es tu forma de ver, poco a poco, cómo
            tus cuidados van reequilibrándote.
          </Text>
        </Reveal>
      )}
    </>
  );
}

// ── Banda de un apartado: repite la imagen de fondo TCM a su propia altura ────
function Banda({ children }: { children: React.ReactNode }) {
  return (
    <Box position="relative" overflow="hidden">
      <DisciplinaBgLayer nom={tcmNom} borderRadius={0} />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 8 }} py={{ base: 5, md: 6 }}>
        {children}
      </Box>
    </Box>
  );
}

// ── Separador horizontal BLANCO entre apartados (blanco completo, de lado a lado) ─
function Separador() {
  return <Box h="1px" w="100%" bg="#ffffff" />;
}

// ── Separador con el mandala en medio (entre el box de la herramienta y la
//    lectura «Tu lengua hoy»). Dos rayitas blancas y el mandala de LIFE al centro.
function MandalaSeparador() {
  return (
    <Reveal inView direction="none" scaleFrom={0.8} duration={0.8} amount={0.6} w="100%">
      <Flex align="center" justify="center" gap={{ base: 4, md: 6 }} w="100%" py={{ base: 1, md: 2 }}>
        <Box flex="1" h="1px" bgGradient="linear(to-r, transparent, rgba(255,255,255,0.9))" />
        <Image src="/img/icono/life.png" alt="" h={{ base: "42px", md: "56px" }} objectFit="contain" flexShrink={0}
               style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.55)) drop-shadow(0 0 24px rgba(180,255,245,0.28))" }} />
        <Box flex="1" h="1px" bgGradient="linear(to-l, transparent, rgba(255,255,255,0.9))" />
      </Flex>
    </Reveal>
  );
}
