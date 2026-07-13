import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { ElementoComicModal } from "../../components/metodo/ElementoComicModal";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, CICLO_SHENG, CICLO_KE,
  elementoPredominante, balanceElemento, conteoBalance, viajeCompleto,
  type DatosTcm, type Elemento, type Balance,
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

const R = 104, FOTO_R = 25; // mismos que la geometría compartida del pentágono

// ── Coreografía de la estrella-perfil (al asomar en pantalla) ────────────────
// 1) florecen los 5 elementos, 2) salen una a una las flechas de FUERA (Sheng,
// el perímetro), 3) luego las de DENTRO (Ke, las que cruzan la estrella).
const MotionG = motion.g as any;
const EASE_POP = [0.34, 1.56, 0.64, 1] as const;
const DP_ELEM_BASE = 0.12, DP_ELEM_STEP = 0.12, DP_ELEM_DUR = 0.5;
const DP_SHENG_BASE = 1.0, DP_KE_BASE = 2.0, DP_ARROW_STEP = 0.18, DP_ARROW_DUR = 0.45;

type EstadoElemento = { balance: Balance | null; nivel: number | null };

export default function MetodoTcmDiagnostico() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatosTcm>({});
  const [comicEl, setComicEl] = useState<Elemento | null>(null);
  const [sel, setSel] = useState<Relacion | null>(null);
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

  const predominante = useMemo(() => elementoPredominante(data), [data]);

  // Estado (equilibrio/exceso/deficiencia) y nivel de desequilibrio (0–1) de cada elemento.
  const estados = useMemo(() => {
    const out: Partial<Record<Elemento, EstadoElemento>> = {};
    for (const el of ORDEN_ELEMENTOS) {
      const r = data.elementos?.[el]?.miniTest?.respuestas;
      const c = conteoBalance(el, r);
      out[el] = {
        balance: balanceElemento(el, r),
        nivel: c.total === 0 ? null : (c.exceso + c.deficiencia) / c.total,
      };
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
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
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
            pageLabel="5/8"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Los ciclos", onClick: () => navigate("/metodo/tcm/ciclos") }}
            extra={ilustracionesBtn}
            next={{ label: "Tu lengua →", onClick: () => navigate("/metodo/tcm/lengua") }}
          />
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                textAlign="center" maxW="660px" style={{ textShadow: INK_SHADOW }}>
            Esto es lo que está ocurriendo hoy dentro de ti. En los Cinco Elementos, cuerpo, mente y emociones forman un mismo sistema. Cuando uno cambia, todos pueden cambiar.
          </Text>
          </Reveal>

          {/* ── BOX 1 · Estrella-perfil (lo que ocurre en ti ahora mismo) ── */}
          <Reveal direction="up" distance={28} scaleFrom={0.98} delay={0.2} duration={0.7} w="100%">
          <Panel titulo="" color={tcmTxt}>
            <EstrellaPerfil estados={estados} onElemento={(el) => setComicEl(el)} />
            <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center"
                  mt={2} lineHeight="1.6">
              Los elementos iluminados son los que más necesitan de tu atención.
            </Text>
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
            Repasa cada relación con calma. Todas te interesan, pues todas forman parte de ti. Toca cualquier flecha para leer.
            hace un elemento a otro, órgano a órgano.
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
    const b = estados[el]?.balance;
    return b === "exceso" || b === "deficiencia";
  };

  // Una arista de un ciclo (origen → destino), con su punta de flecha. Brota de
  // su elemento de origen (escala desde `inicio`) con el retraso `delay`.
  const Arista = ({ ciclo, origen, delay }: { ciclo: Ciclo; origen: Elemento; delay: number }) => {
    const destino = ciclo === "sheng" ? CICLO_SHENG[origen] : CICLO_KE[origen];
    const { inicio, fin, ux, uy } = segmentoPentagono(idxElemento(origen), idxElemento(destino));
    const activa = afecta(origen);
    const nivel = estados[origen]?.nivel ?? 0;
    // Cada flecha lleva el color de su elemento de origen. El ciclo se distingue
    // por el trazo: Sheng (generador) continuo, Ke (control) entrecortado.
    const color = ELEMENTOS[origen].color;
    const glowColor = color;
    // TODAS las flechas se ven con claridad; las de un elemento en desequilibrio
    // se iluminan un poco más (más gruesas, opacas y con halo, según el nivel).
    const ancho = activa ? 2.5 + nivel * 2.5 : 2;
    const opacidad = activa ? 1 : 0.6;
    const halo = activa ? `drop-shadow(0 0 ${4 + nivel * 7}px ${glowColor})` : "none";
    // Punta de flecha: triángulo limpio. La línea termina en la BASE del
    // triángulo (no en la punta) para que la flecha se lea nítida.
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
  };

  return (
    <Flex ref={ref} justify="center" py={{ base: 2, md: 3 }}>
      <Box as="svg" viewBox="0 0 300 320" w="100%" maxW={{ base: "360px", md: "500px" }} h="auto" overflow="visible">
        {/* Aristas: primero las de FUERA (Sheng, perímetro) una a una, luego las
            de DENTRO (Ke, las que cruzan la estrella), tras florecer los iconos. */}
        {ORDEN_ELEMENTOS.map((el, i) => (
          <Arista key={`sheng-${el}`} ciclo="sheng" origen={el} delay={DP_SHENG_BASE + i * DP_ARROW_STEP} />
        ))}
        {ORDEN_ELEMENTOS.map((el, i) => (
          <Arista key={`ke-${el}`} ciclo="ke" origen={el} delay={DP_KE_BASE + i * DP_ARROW_STEP} />
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
          const nivel = estados[el]?.nivel ?? 0;
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
              <text x={label.x} y={label.y} fill="white" fontSize={13} fontWeight={deseq ? 800 : 600}
                    textAnchor="middle" dominantBaseline="middle"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.95)" }}>
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
