import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { TcmLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { ElementoComicModal } from "../../components/metodo/ElementoComicModal";
import { Reveal } from "../../components/global/Reveal";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, CICLO_SHENG, CICLO_KE,
  diagnosticoElemento, elementoMasCargado, viajeCompleto,
  type DatosTcm, type Elemento, type EstadoDiagnostico, type VeredictoBalance,
} from "../../components/metodo/tcmRecorrido";
import { ICONO_ELEMENTO, FOTO_ELEMENTO } from "../../components/metodo/tcmElementosContenido";
import {
  EstrellaCiclo, RelacionModal,
  verticePentagono, segmentoPentagono, idxElemento,
  type Ciclo, type Relacion,
} from "../../components/metodo/tcmCiclosVisual";
import { TcmEstrellaDetalle } from "../../components/metodo/TcmEstrellaDetalle";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// Estado de balance (traído de la antigua «Tu equilibrio»): etiqueta y color.
const ESTADO_LABEL: Record<VeredictoBalance, string> = {
  equilibrio: "En equilibrio",
  exceso: "En exceso",
  deficiencia: "En deficiencia",
};
const ESTADO_COLOR: Record<VeredictoBalance, string> = {
  equilibrio: "#6f9463",
  exceso: "#d1495b",
  deficiencia: "#c8963e",
};

// El desequilibrio neto de un elemento raramente pasa del 50%, así que para lo
// VISUAL (grosor y halo de las flechas de la estrella) se estira esa mitad a
// todo el rango: 0 = equilibrio, 1 = 50% o más de desequilibrio. Los números que
// se leen —el % de cada barra— siguen siendo los de verdad, sin estirar.
const intensidad = (magnitud: number) => Math.min(1, magnitud / 0.5);

const R = 104, FOTO_R = 25; // mismos que la geometría compartida del pentágono

// ── Coreografía de la estrella-perfil (al asomar en pantalla) ────────────────
// 1) florecen los 5 elementos, 2) salen una a una las flechas de FUERA (Sheng,
// el perímetro), 3) luego las de DENTRO (Ke, las que cruzan la estrella).
const MotionG = motion.g as any;
const EASE_POP = [0.34, 1.56, 0.64, 1] as const;
const DP_ELEM_BASE = 0.12, DP_ELEM_STEP = 0.12, DP_ELEM_DUR = 0.5;
const DP_SHENG_BASE = 1.0, DP_KE_BASE = 2.0, DP_ARROW_STEP = 0.18, DP_ARROW_DUR = 0.45;

type EstadoElemento = EstadoDiagnostico | null;

export default function MetodoTcmDiagnostico() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatosTcm>({});
  const [comicEl, setComicEl] = useState<Elemento | null>(null);
  const [sel, setSel] = useState<Relacion | null>(null);
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
        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: DatosTcm = res.data?.data ?? {};
        if (!viajeCompleto(d)) { navigate("/metodo/tcm/elementos"); return; }
        setData(d);
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const predominante = useMemo(() => elementoMasCargado(data), [data]);

  // Diagnóstico honesto por elemento: veredicto por umbrales (no por mayoría) +
  // magnitud (cuánto) y dirección (exceso/deficiencia). null = sin respuestas.
  const estados = useMemo(() => {
    const out: Partial<Record<Elemento, EstadoElemento>> = {};
    for (const el of ORDEN_ELEMENTOS) {
      out[el] = diagnosticoElemento(el, data.elementos?.[el]?.miniTest?.respuestas);
    }
    return out;
  }, [data]);

  const abrirRelacion = (ciclo: Ciclo, origen: Elemento) => {
    const destino = ciclo === "sheng" ? CICLO_SHENG[origen] : CICLO_KE[origen];
    setSel({ ciclo, origen, destino });
  };

  // No quitamos el spinner hasta que los iconos/fotos de los elementos estén
  // descargados, para que las estrellas no aparezcan con los círculos vacíos.
  const iconosListos = usePrecargarImagenes([
    ...ORDEN_ELEMENTOS.map((el) => ICONO_ELEMENTO[el]),
    ...ORDEN_ELEMENTOS.map((el) => FOTO_ELEMENTO[el]),
  ]);

  if (loading || !iconosListos) {
    return <TcmLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1080px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Diagnóstico final"
            pageLabel="4/11"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Los ciclos", onClick: () => navigate("/metodo/tcm/ciclos") }}
            extra={ilustracionesBtn}
            next={{ label: "La lengua →", onClick: () => navigate("/metodo/tcm/lengua") }}
          />
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Flex direction="column" align="center" gap={2} maxW="660px">
            <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                  textAlign="center">
              «Antes de sanar a alguien, pregúntale si está dispuesto a renunciar a las cosas que lo enferman.»
            </Text>
            <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontWeight={600} letterSpacing="0.06em"
                  textAlign="center">
              — Hipócrates
            </Text>
          </Flex>
          </Reveal>

          {/* ── BOX 1 · Estrella-perfil (lo que ocurre en ti ahora mismo) ──
              Box contenido (no a todo el ancho de la página): la estrella se lee
              mejor recogida que estirada de lado a lado. */}
          <Reveal direction="up" distance={28} scaleFrom={0.98} delay={0.2} duration={0.7} w="100%" maxW="560px">
          <Panel titulo="" color={tcmTxt}>
            <EstrellaPerfil estados={estados} onElemento={(el) => setComicEl(el)} />
            <Text color="rgba(255,255,255,0.6)" fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" textAlign="center"
                  mt={1} lineHeight="1.6">
              Los elementos iluminados son los que más necesitan de tu atención.
            </Text>
          </Panel>
          </Reveal>

          {/* ── BOX MÉTRICAS · columnas por estado (traído de «Tu equilibrio») ──
              Va justo debajo de la estrella grande. Barra vacía = en equilibrio;
              cuanta más altura, más desequilibrio. */}
          <Reveal inView direction="up" distance={26} scaleFrom={0.98} duration={0.7} amount={0.15} w="100%">
          <Panel titulo="" color={tcmTxt}>
            <MetricasBalance estados={estados} />
          </Panel>
          </Reveal>

          {/* ── BOX 2 · La estrella de los cinco elementos + tu mensaje (de Equilibrio) ── */}
          <Reveal inView direction="up" distance={26} scaleFrom={0.98} duration={0.7} amount={0.15} w="100%">
            <TcmEstrellaDetalle estados={estados} predominante={predominante} />
          </Reveal>

          {/* ── BOX 3 y 4 · Relación a relación (popup por cada una) ── */}
          <Reveal inView direction="up" distance={16} duration={0.6} amount={0.4} display="flex" justifyContent="center">
          <Text color="white" fontStyle="italic" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                textAlign="center" maxW="660px" mt={1} style={{ textShadow: INK_SHADOW }}>
            Repasa cada relación con calma. Todas te interesan, pues todas forman parte de ti.
          </Text>
          </Reveal>
          <Flex direction={{ base: "column", md: "row" }} gap={5} w="100%" align="stretch">
            <Reveal inView direction="right" distance={28} scaleFrom={0.97} duration={0.72} amount={0.15} w="100%" display="flex">
            <EstrellaCiclo
              titulo="Ciclo generador"
              pinyin="Sheng"
              hanzi="生"
              subtitulo=""
              ciclo="sheng"
              onEdge={abrirRelacion}
            />
            </Reveal>
            <Reveal inView direction="left" distance={28} scaleFrom={0.97} duration={0.72} amount={0.15} w="100%" display="flex">
            <EstrellaCiclo
              titulo="Ciclo de control"
              pinyin="Ke"
              hanzi="克"
              subtitulo=""
              ciclo="ke"
              onEdge={abrirRelacion}
            />
            </Reveal>
          </Flex>

          <Reveal inView direction="up" distance={14} duration={0.6} amount={0.5} display="flex" justifyContent="center">
          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="660px"
                lineHeight="1.6">
            Esta valoración tiene un fin educativo y de autoconocimiento. No constituye un
            diagnóstico clínico ni sustituye la valoración de un profesional cualificado.
          </Text>
          </Reveal>

          {/* El paso siguiente, abajo a la derecha: mismo texto que el botón
              del header, que aquí se ha quedado muy arriba. */}
          <BotonPaso label="La lengua" nom={tcmNom} color={tcmTxt} bg={tcmBg}
                     onClick={() => navigate("/metodo/tcm/lengua")} />
        </Flex>
      </Flex>

      {ilustracionesModal}

      {/* Cómic del elemento (al pinchar en la estrella-perfil) */}
      <ElementoComicModal
        elemento={comicEl}
        data={data}
        onChangeData={setData}
        onClose={() => setComicEl(null)}
      />

      {/* Popup de la relación (reutiliza el ComicViewer inmersivo) */}
      <RelacionModal rel={sel} onClose={() => setSel(null)} />

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

// ── Estrella-perfil ──────────────────────────────────────────────────────────
// TODAS las flechas de los dos ciclos se dibujan siempre (Sheng continua dorada,
// Ke entrecortada marrón). Solo se ILUMINAN las que hoy afectan al usuario (las
// que salen de un elemento en desequilibrio); el resto quedan tenues pero
// visibles. Los elementos en desequilibrio brillan más, con aro blanco.
// Una arista de un ciclo (origen → destino), con su punta de flecha. Es un
// componente de MÓDULO (no anidado) y memoizado: así NO se vuelve a montar en
// cada render de la estrella (hover, abrir un cómic…) y su animación de entrada
// ocurre UNA SOLA VEZ, quedándose fija después.
const AristaPerfil = React.memo(function AristaPerfil({ ciclo, origen, delay, estados, enter, reduce }: {
  ciclo: Ciclo; origen: Elemento; delay: number;
  estados: Partial<Record<Elemento, EstadoElemento>>; enter: boolean; reduce: boolean | null;
}) {
  const destino = ciclo === "sheng" ? CICLO_SHENG[origen] : CICLO_KE[origen];
  const { inicio, fin, ux, uy } = segmentoPentagono(idxElemento(origen), idxElemento(destino));
  const st = estados[origen];
  const activa = !!st && st.veredicto !== "equilibrio";
  const nivel = intensidad(st?.magnitud ?? 0);
  // Cada flecha lleva el color de su elemento de origen. El ciclo se distingue
  // por el trazo: Sheng (generador) continuo, Ke (control) entrecortado.
  const color = ELEMENTOS[origen].color;
  const glowColor = color;
  const ancho = activa ? 2.5 + nivel * 2.5 : 2;
  const opacidad = activa ? 1 : 0.6;
  const halo = activa ? `drop-shadow(0 0 ${4 + nivel * 7}px ${glowColor})` : "none";
  const ah = activa ? 16 : 13;          // largo del triángulo
  const aw = activa ? 10 : 8;           // media anchura de la base
  const bc = { x: fin.x - ux * ah, y: fin.y - uy * ah };
  const px = -uy, py = ux;
  const p2 = { x: bc.x + px * aw, y: bc.y + py * aw };
  const p3 = { x: bc.x - px * aw, y: bc.y - py * aw };
  return (
    <MotionG
      initial={reduce ? false : { opacity: 0, scale: 0.5 }}
      animate={reduce ? {} : (enter ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 })}
      transition={{ delay, duration: DP_ARROW_DUR, ease: EASE_POP }}
      style={{ transformBox: "view-box", transformOrigin: `${inicio.x}px ${inicio.y}px` }}>
      <line x1={inicio.x} y1={inicio.y} x2={bc.x} y2={bc.y}
            stroke={color} strokeWidth={ancho} strokeLinecap="butt"
            strokeDasharray={ciclo === "ke" ? "5 6" : undefined}
            opacity={opacidad} style={{ filter: halo, transition: "all 0.25s ease" }} />
      <polygon points={`${fin.x},${fin.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
               fill={color} opacity={opacidad} style={{ filter: halo }} />
    </MotionG>
  );
});

function EstrellaPerfil({ estados, onElemento }: {
  estados: Partial<Record<Elemento, EstadoElemento>>;
  onElemento: (el: Elemento) => void;
}) {
  const [hover, setHover] = useState<Elemento | null>(null);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const enter = reduce || inView;

  const afecta = (el: Elemento) => {
    const st = estados[el];
    return !!st && st.veredicto !== "equilibrio";
  };

  return (
    <Flex ref={ref} justify="center" py={{ base: 1, md: 1.5 }}>
      {/* La estrella ocupa TODO el ancho del box (sin `maxW`, que la dejaba a
          360 px dentro de una caja de 560 y con un marco de aire alrededor).
          El viewBox se recorta a 275 de alto: los 320 de antes eran, de la
          etiqueta de abajo para abajo, espacio vacío. */}
      <Box as="svg" viewBox="0 0 300 275" w="100%" h="auto" overflow="visible">
        {/* Aristas: primero las de FUERA (Sheng, perímetro) una a una, luego las
            de DENTRO (Ke, las que cruzan la estrella), tras florecer los iconos. */}
        {ORDEN_ELEMENTOS.map((el, i) => (
          <AristaPerfil key={`sheng-${el}`} ciclo="sheng" origen={el} delay={DP_SHENG_BASE + i * DP_ARROW_STEP}
                        estados={estados} enter={enter} reduce={reduce} />
        ))}
        {ORDEN_ELEMENTOS.map((el, i) => (
          <AristaPerfil key={`ke-${el}`} ciclo="ke" origen={el} delay={DP_KE_BASE + i * DP_ARROW_STEP}
                        estados={estados} enter={enter} reduce={reduce} />
        ))}

        <defs>
          {ORDEN_ELEMENTOS.map((el, i) => {
            const v = verticePentagono(i, R);
            return (
              <clipPath id={`perfil-clip-${el}`} key={el}>
                <circle cx={v.x} cy={v.y} r={FOTO_R} />
              </clipPath>
            );
          })}
        </defs>
        {ORDEN_ELEMENTOS.map((el, i) => {
          const v = verticePentagono(i, R);
          const label = verticePentagono(i, R + 30);
          const E = ELEMENTOS[el];
          const deseq = afecta(el);
          const nivel = intensidad(estados[el]?.magnitud ?? 0);
          const hov = hover === el;
          // Aro SIEMPRE blanco; brilla más cuanto mayor es el desequilibrio.
          const glow = deseq ? 7 + nivel * 20 : 3;
          return (
            <MotionG key={el}
               initial={reduce ? false : { opacity: 0, scale: 0.3 }}
               animate={reduce ? {} : (enter ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 })}
               transition={{ delay: DP_ELEM_BASE + i * DP_ELEM_STEP, duration: DP_ELEM_DUR, ease: EASE_POP }}
               style={{ cursor: "pointer", transformBox: "view-box", transformOrigin: `${v.x}px ${v.y}px` }}
               onClick={() => onElemento(el)}
               onMouseEnter={() => setHover(el)} onMouseLeave={() => setHover(null)}>
              <circle cx={v.x} cy={v.y} r={FOTO_R + 2} fill={tcmBg} opacity={0.55} />
              <image href={ICONO_ELEMENTO[el]} x={v.x - FOTO_R} y={v.y - FOTO_R}
                     width={FOTO_R * 2} height={FOTO_R * 2}
                     clipPath={`url(#perfil-clip-${el})`} preserveAspectRatio="xMidYMid slice"
                     opacity={deseq ? 1 : 0.5} />
              {/* Velo tenue si está en equilibrio (menos protagonismo) */}
              {!deseq && <circle cx={v.x} cy={v.y} r={FOTO_R} fill={tcmBg} opacity={0.3} />}
              <circle cx={v.x} cy={v.y} r={FOTO_R} fill="none" stroke="white"
                      strokeWidth={deseq ? 3 : 1.5} opacity={deseq ? 1 : 0.55}
                      style={{ filter: `drop-shadow(0 0 ${hov ? glow + 6 : glow}px rgba(255,255,255,0.95))`, transition: "all 0.25s ease" }} />
              {/* El nombre lleva el halo de SU elemento: sobre el rojo oscuro
                  del box, el blanco a secas se apagaba. El negro se queda
                  debajo para que siga habiendo contraste. */}
              <text x={label.x} y={label.y} fill="white" fontSize={13} fontWeight={deseq ? 800 : 600}
                    textAnchor="middle" dominantBaseline="middle"
                    style={{ textShadow: `0 0 ${deseq ? 10 : 7}px ${E.color}, 0 0 ${deseq ? 20 : 13}px ${E.color}aa, 0 1px 4px rgba(0,0,0,0.95)` }}>
                {E.nombre}
              </text>
            </MotionG>
          );
        })}
      </Box>
    </Flex>
  );
}

function Panel({ titulo, color, children }: {
  titulo: string; color: string; children: React.ReactNode;
}) {
  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 8 }} py={{ base: 5, md: 6 }}>
        {titulo && (
          <>
            <Text color={color} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.1em"
                  textTransform="uppercase" mb={3} style={{ textShadow: INK_SHADOW }}>
              {titulo}
            </Text>
            <Box h="1px" w="100%" mb={4} bg={`${color}88`} />
          </>
        )}
        {children}
      </Box>
    </Box>
  );
}

// ── Box de métricas · una barra por elemento, hacia UN solo lado ─────────────
// Cada elemento tiene su línea central (= equilibrio) y UNA barra: hacia ARRIBA
// si le sobra energía (rojo) o hacia ABAJO si le falta (ámbar), nunca las dos
// —un elemento no puede estar en exceso y en deficiencia a la vez—. Lo que mide
// es el balance NETO de sus respuestas (ver `diagnosticoElemento`), así que un
// elemento con señales de los dos tipos que se compensan se queda pegado a la
// línea: eso es, exactamente, estar en equilibrio.
function MetricasBalance({ estados }: { estados: Partial<Record<Elemento, EstadoElemento>> }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const enter = reduce || inView;
  return (
    <>
      <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
            textAlign="center" lineHeight="1.7" mb={5} style={{ textShadow: INK_SHADOW }}>
        Cada elemento tira hacia un lado: hacia arriba si le sobra energía, hacia abajo si le falta. Cuanto más cerca de la línea, más en equilibrio.
      </Text>

      {/* Leyenda de estados */}
      <Flex justify="center" gap={{ base: 3, md: 6 }} wrap="wrap" mb={5}>
        {(["equilibrio", "exceso", "deficiencia"] as VeredictoBalance[]).map((b) => (
          <Flex key={b} align="center" gap={2}>
            <Box w="12px" h="12px" borderRadius="sm" bg={ESTADO_COLOR[b]}
                 style={{ boxShadow: `0 0 8px ${ESTADO_COLOR[b]}` }} />
            <Text color="rgba(255,255,255,0.88)" fontSize={{ base: "2xs", md: "xs" }} fontWeight={600}>
              {ESTADO_LABEL[b]}
            </Text>
          </Flex>
        ))}
      </Flex>

      <Box ref={ref}>
        {/* Zona de barras divergentes */}
        <Box h={{ base: "200px", md: "260px" }}>
          <Flex h="100%" align="stretch" justify="space-between" gap={{ base: 2, md: 5 }} px={{ base: 1, md: 3 }}>
            {ORDEN_ELEMENTOS.map((el, i) => (
              <ColumnaBalance key={el} index={i} enter={enter} reduce={reduce}
                              estado={estados[el] ?? null} />
            ))}
          </Flex>
        </Box>

        {/* Elementos (icono + nombre + estado) */}
        <Flex justify="space-between" gap={{ base: 2, md: 5 }} px={{ base: 1, md: 3 }} mt={2.5}>
          {ORDEN_ELEMENTOS.map((el) => {
            const E = ELEMENTOS[el];
            const veredicto = estados[el]?.veredicto ?? null;
            return (
              <Flex key={el} flex="1" direction="column" align="center" gap={1} minW={0}>
                <Box w={{ base: "56px", md: "76px" }} h={{ base: "56px", md: "76px" }}
                     borderRadius="full" overflow="hidden" border={`2px solid ${E.color}`}
                     style={{ boxShadow: `0 0 8px ${E.color}88` }}>
                  <img src={ICONO_ELEMENTO[el]} alt={E.nombre}
                       style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
                {/* Sin sombra: el nombre iba con doble halo del color del
                    elemento y sobre la acuarela roja se leía emborronado. */}
                <Text color="white" fontSize={{ base: "2xs", md: "sm" }} fontWeight={700}
                      textAlign="center" noOfLines={1}>
                  {E.nombre}
                </Text>
                <Text color={veredicto ? ESTADO_COLOR[veredicto] : "rgba(255,255,255,0.45)"}
                      fontSize={{ base: "3xs", md: "2xs" }} fontWeight={700} textAlign="center"
                      fontStyle={veredicto ? "normal" : "italic"} noOfLines={1} lineHeight="1.2">
                  {veredicto ? ESTADO_LABEL[veredicto] : "sin datos"}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Box>
    </>
  );
}

// ── Columna de un elemento ───────────────────────────────────────────────────
// Estructura fija e idéntica en las 5 columnas (para que las líneas centrales
// queden alineadas): [% arriba] · [mitad superior] · [línea] · [mitad inferior]
// · [% abajo]. Solo UNA de las dos mitades tiene barra, la del lado hacia el que
// tira el elemento, y su altura es el desequilibrio NETO (sin estirar: un 20%
// neto ocupa un quinto de su mitad).
const EXC = ESTADO_COLOR.exceso;
const DEF = ESTADO_COLOR.deficiencia;
function ColumnaBalance({ estado, index, enter, reduce }: {
  estado: EstadoElemento; index: number; enter: boolean; reduce: boolean | null;
}) {
  // Hacia dónde y cuánto. `posicion` > 0 = le sobra; < 0 = le falta.
  const neto = estado?.posicion ?? 0;
  const pct = Math.round(Math.abs(neto) * 100);
  const arriba = neto > 0;

  // Al asomar, las barras crecen desde la línea central con retraso por índice.
  const [shown, setShown] = useState(!!reduce);
  useEffect(() => {
    if (!enter) return;
    if (reduce) { setShown(true); return; }
    setShown(false);
    const t = setTimeout(() => setShown(true), index * 150);
    return () => clearTimeout(t);
  }, [enter, reduce, index]);

  const barW = { base: "58%", md: "52%" } as const;
  const ease = "height 0.8s cubic-bezier(0.22,1,0.36,1)";

  return (
    <Flex flex="1" direction="column" align="center" h="100%" minW={0}>
      {/* % del exceso (solo si el elemento tira hacia arriba) */}
      <Box h="16px" display="flex" alignItems="flex-end" justifyContent="center">
        {pct > 0 && arriba && (
          <Text color={EXC} fontSize={{ base: "3xs", md: "2xs" }} fontWeight={800} lineHeight="1"
                opacity={shown ? 1 : 0} transition="opacity 0.4s ease"
                style={{ textShadow: `0 0 8px ${EXC}aa, 0 1px 2px rgba(0,0,0,0.6)` }}>
            {pct}%
          </Text>
        )}
      </Box>

      {/* Mitad superior · le sobra (crece hacia arriba, anclada a la línea) */}
      <Flex flex="1" w="100%" align="flex-end" justify="center">
        <Box w={barW} maxW="46px" h={shown && arriba ? `${pct}%` : "0%"}
             borderTopRadius="md" bgGradient={`linear(to-t, ${EXC}cc, ${EXC})`}
             style={{ boxShadow: arriba && pct > 0 ? `0 0 12px ${EXC}88, inset 0 1px 0 rgba(255,255,255,0.4)` : "none", transition: ease }} />
      </Flex>

      {/* Línea central = equilibrio */}
      <Box w="100%" h="2px" flexShrink={0} borderRadius="full" bg="rgba(255,255,255,0.45)"
           style={{ boxShadow: "0 0 6px rgba(255,255,255,0.35)" }} />

      {/* Mitad inferior · le falta (crece hacia abajo, anclada a la línea) */}
      <Flex flex="1" w="100%" align="flex-start" justify="center">
        <Box w={barW} maxW="46px" h={shown && !arriba ? `${pct}%` : "0%"}
             borderBottomRadius="md" bgGradient={`linear(to-b, ${DEF}cc, ${DEF})`}
             style={{ boxShadow: !arriba && pct > 0 ? `0 0 12px ${DEF}88, inset 0 -1px 0 rgba(255,255,255,0.4)` : "none", transition: ease }} />
      </Flex>

      {/* % de la deficiencia (solo si tira hacia abajo) */}
      <Box h="16px" display="flex" alignItems="flex-start" justifyContent="center">
        {pct > 0 && !arriba && (
          <Text color={DEF} fontSize={{ base: "3xs", md: "2xs" }} fontWeight={800} lineHeight="1"
                opacity={shown ? 1 : 0} transition="opacity 0.4s ease"
                style={{ textShadow: `0 0 8px ${DEF}aa, 0 1px 2px rgba(0,0,0,0.6)` }}>
            {pct}%
          </Text>
        )}
      </Box>
    </Flex>
  );
}
