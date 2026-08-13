import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { MarcaLeido } from "../../components/metodo/MarcaLeido";
import { useT, type ClaveTexto } from "../../i18n";
import { glowHeader } from "../../components/metodo/FotoBox";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useReservarAltura } from "../../hooks/useReservarAltura";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon, noSelectSx} from "../../GlobalVariables";

const MBox = motion(Box);

// Halo oscuro para leer el texto claro sobre el fondo morado de Fisiología.
const INK = `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc, 0 2px 16px ${fisiologiaBg}88`;

// ── Definición de las 4 macromoléculas ──────────────────────────────────────
type MacroId = "proteina" | "adn" | "lipido" | "carbohidrato";
type Forma = "cadena" | "helice" | "membrana";

// OJO: todo el texto va como CLAVE del diccionario, no como texto. Este array
// se calcula UNA vez al importar el fichero: con el texto ya traducido dentro,
// se quedaría congelado en el idioma de arranque.
interface MacroDef {
  id: MacroId;
  nombre: ClaveTexto;
  /** El nombre CON su artículo, para el botón «Ahora, el ADN →». Va como clave
   *  aparte porque aquí conviven «el ADN», «las Enzimas» y «los Lípidos», no hay
   *  regla que lo saque del nombre, y en inglés el artículo desaparece. */
  articulo: ClaveTexto;
  monomero: ClaveTexto;       // singular
  monomeroPl: ClaveTexto;     // plural
  glow: string;           // color de acento
  glyph: string;          // símbolo de la perla dibujada
  n: number;              // cuántos monómeros hay que arrastrar
  forma: Forma;
  desc: ClaveTexto;           // frase de la tarjeta
  resultado: ClaveTexto[];    // párrafos al formarla
  monomeroImg: string;    // /recorrido/fisiologia/pre/aminoacido.webp …
  resultadoImg: string;   // circular · se usa en el resultado (Fase B)
  cuadradoImg: string;    // cuadrada · se usa en el box de la rejilla
  /** Para macromoléculas cuyas piezas NO son todas iguales (p.ej. el fosfolípido:
   *  1 fosfato + 1 glicerol + 2 ácidos grasos). Si se define, la estación arrastra
   *  ESTAS piezas concretas (con su propia foto) en vez de `n` monómeros iguales. */
  componentes?: PiezaMacro[];
  /** Cadena de monómeros del MISMO tipo pero con foto distinta (p.ej. el ADN:
   *  4 nucleótidos A, T, C y G). Conserva la semántica de «encadenar» (no la de
   *  «formar un monómero» de `componentes`), pero cada pieza lleva su foto. */
  monomerosVariados?: PiezaMacro[];
}

/** Una pieza arrastrable (monómero o componente) con su foto propia.
 *  `label` es la CLAVE del diccionario, no el texto. */
interface PiezaMacro { label: ClaveTexto; img: string; glyph: string; }

const PRE = "/recorrido/fisiologia/pre";

/** Lista de piezas a arrastrar: los `componentes`, los `monomerosVariados`, o `n` copias del monómero. */
const piezasDe = (def: MacroDef): PiezaMacro[] =>
  def.componentes ?? def.monomerosVariados ??
  Array.from({ length: def.n }, () => ({ label: def.monomero, img: def.monomeroImg, glyph: def.glyph }));

const MACROS: MacroDef[] = [
  {
    id: "proteina", nombre: "fisiologia.macro.proteina", articulo: "fisiologia.macro.proteina.articulo",
    monomero: "fisiologia.macro.proteina.monomero", monomeroPl: "fisiologia.macro.proteina.monomeroPl",
    glow: "#7fd6c2", glyph: "A", n: 4, forma: "cadena",
    desc: "fisiologia.macro.proteina.desc",
    resultado: ["fisiologia.macro.proteina.r1", "fisiologia.macro.proteina.r2"],
    monomeroImg: `${PRE}/aminoacido.webp`, resultadoImg: `${PRE}/circularenzima.webp`, cuadradoImg: `${PRE}/enzima.webp`,
  },
  {
    id: "adn", nombre: "fisiologia.macro.adn", articulo: "fisiologia.macro.adn.articulo",
    monomero: "fisiologia.macro.adn.monomero", monomeroPl: "fisiologia.macro.adn.monomeroPl",
    glow: "#9ab6f0", glyph: "N", n: 4, forma: "helice",
    desc: "fisiologia.macro.adn.desc",
    resultado: ["fisiologia.macro.adn.r1", "fisiologia.macro.adn.r2"],
    monomeroImg: `${PRE}/nucleotido.webp`, resultadoImg: `${PRE}/circularadn.webp`, cuadradoImg: `${PRE}/adn.webp`,
    monomerosVariados: [
      { label: "fisiologia.pieza.nucleotidoA", img: `${PRE}/nucleotidoa.webp`, glyph: "A" },
      { label: "fisiologia.pieza.nucleotidoT", img: `${PRE}/nucleotidot.webp`, glyph: "T" },
      { label: "fisiologia.pieza.nucleotidoC", img: `${PRE}/nucleotidoc.webp`, glyph: "C" },
      { label: "fisiologia.pieza.nucleotidoG", img: `${PRE}/nucleotidog.webp`, glyph: "G" },
    ],
  },
  {
    id: "lipido", nombre: "fisiologia.macro.lipido", articulo: "fisiologia.macro.lipido.articulo",
    monomero: "fisiologia.macro.lipido.monomero", monomeroPl: "fisiologia.macro.lipido.monomeroPl",
    glow: "#f2c86b", glyph: "L", n: 4, forma: "membrana",
    desc: "fisiologia.macro.lipido.desc",
    resultado: ["fisiologia.macro.lipido.r1", "fisiologia.macro.lipido.r2"],
    monomeroImg: `${PRE}/fosfolipido.webp`, resultadoImg: `${PRE}/circularfolipido.webp`, cuadradoImg: `${PRE}/fosfolipido.webp`,
    componentes: [
      { label: "fisiologia.pieza.fosfato", img: `${PRE}/fosfato.webp`, glyph: "P" },
      { label: "fisiologia.pieza.glicerol", img: `${PRE}/glicerol.webp`, glyph: "G" },
      { label: "fisiologia.pieza.grasaSaturada", img: `${PRE}/acidosgrasossaturados.webp`, glyph: "A" },
      { label: "fisiologia.pieza.grasaInsaturada", img: `${PRE}/acidosgrasosinsaturados.webp`, glyph: "A" },
    ],
  },
  {
    id: "carbohidrato", nombre: "fisiologia.macro.carbohidrato", articulo: "fisiologia.macro.carbohidrato.articulo",
    monomero: "fisiologia.macro.carbohidrato.monomero", monomeroPl: "fisiologia.macro.carbohidrato.monomeroPl",
    glow: "#e79ac0", glyph: "G", n: 4, forma: "cadena",
    desc: "fisiologia.macro.carbohidrato.desc",
    resultado: ["fisiologia.macro.carbohidrato.r1", "fisiologia.macro.carbohidrato.r2"],
    monomeroImg: `${PRE}/glucosa.webp`, resultadoImg: `${PRE}/circularcarbohidrato.webp`, cuadradoImg: `${PRE}/carbohidrato.webp`,
  },
];

const pulse = keyframes`
  0%, 100% { transform: scale(1);    opacity: 0.5; }
  50%      { transform: scale(1.05); opacity: 0.85; }
`;
const shimmer = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 1; }
`;

const perla = (c: string): string =>
  `radial-gradient(circle at 34% 30%, #ffffff 0%, ${c} 36%, ${c}dd 64%, ${c}77 100%)`;

// ── Perla de una pieza (imagen con reserva a esfera dibujada) ───────────────
function Perla({ pieza, glow, size }: { pieza: PiezaMacro; glow: string; size: any }) {
  const t = useT();
  return (
    <Box w={size} h={size} borderRadius="full" overflow="hidden" pointerEvents="none"
         sx={{ boxShadow: `0 0 12px ${glow}aa, 0 0 24px ${glow}55` }}>
      <Image src={pieza.img} alt={t(pieza.label)} w="100%" h="100%" objectFit="cover" draggable={false}
             fallbackStrategy="onError"
             fallback={
               <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" sx={{ background: perla(glow) }}>
                 <Text color="rgba(0,0,0,0.55)" fontWeight="900" lineHeight="1"
                       fontSize={{ base: "sm", md: "md" }} style={{ userSelect: "none" }}>{pieza.glyph}</Text>
               </Box>
             } />
    </Box>
  );
}

// ── Ficha arrastrable (una pieza) ────────────────────────────────────────────
function MonomeroFicha({ pieza, glow, mostrarLabel, onSoltar, enterDelay = 0, colocada = false }: {
  pieza: PiezaMacro; glow: string; mostrarLabel?: boolean; onSoltar: (rect: DOMRect) => void; enterDelay?: number; colocada?: boolean;
}) {
  const t = useT();
  const [arrastrando, setArrastrando] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Hueco invisible: mantiene el sitio de la pieza ya colocada (las hermanas no se mueven).
  if (colocada) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" gap={1} flexShrink={0} visibility="hidden" aria-hidden>
        <Perla pieza={pieza} glow={glow} size={{ base: "80px", md: "100px" }} />
        {mostrarLabel && (
          <Text color={fisiologiaTxt} fontSize={{ base: "2xs", md: "xs" }} fontWeight="700"
                letterSpacing="0.05em" textTransform="uppercase">{t(pieza.label)}</Text>
        )}
      </Box>
    );
  }
  return (
    <MBox
      ref={ref}
      drag
      dragSnapToOrigin
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => setArrastrando(true)}
      onDragEnd={() => { setArrastrando(false); if (ref.current) onSoltar(ref.current.getBoundingClientRect()); }}
      whileDrag={{ scale: 1.18, zIndex: 60 }}
      whileHover={{ scale: 1.08, y: -2 }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{ type: "spring", stiffness: 320, damping: 26, delay: enterDelay }}
      cursor="grab"
      flexShrink={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={1}
      style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
      sx={{ filter: arrastrando ? `drop-shadow(0 0 16px ${glow}) drop-shadow(0 10px 22px rgba(0,0,0,0.5))` : "none" }}
    >
      <Perla pieza={pieza} glow={glow} size={{ base: "80px", md: "100px" }} />
      {mostrarLabel && (
        <Text color={fisiologiaTxt} fontSize={{ base: "2xs", md: "xs" }} fontWeight="700"
              letterSpacing="0.05em" textTransform="uppercase" pointerEvents="none"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
          {t(pieza.label)}
        </Text>
      )}
    </MBox>
  );
}

// ── Posición (en %) de cada monómero dentro de la bandeja, según la forma ────
// Se dejan márgenes (lateral y vertical) para que cada pieza —con su radio— quede
// SIEMPRE dentro de la parte oscura de la bandeja, sin tocar los bordes ni recortarse.
function posEnBandeja(forma: Forma, i: number, n: number): { x: number; y: number } {
  const mx = 16;                                       // margen lateral (%)
  const x = mx + ((i + 0.5) / n) * (100 - 2 * mx);
  if (forma === "helice") return { x, y: i % 2 === 0 ? 36 : 64 };      // zig-zag (hélice)
  if (forma === "membrana") return { x, y: i % 2 === 0 ? 36 : 64 };    // dos capas
  return { x, y: 50 + (i % 2 === 0 ? -6 : 6) };                        // cadena suave
}

// ── Caja rectangular con el fondo/brillo de Fisiología (reutilizable) ────────
function PanelBox({ children, minH, px, py, ...rest }: any) {
  return (
    <Box position="relative" borderRadius="2xl" overflow="hidden"
         boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 40px rgba(200,181,209,0.12), 0 0 22px ${fisiologiaTxt}1a`}
         {...rest}>
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} h="100%"
           px={px ?? { base: 5, md: 9 }} py={py ?? { base: 7, md: 9 }} minH={minH}>
        {children}
      </Box>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// Estación de una macromolécula (se remonta al cambiar de estación).
// ═════════════════════════════════════════════════════════════════════════
function Estacion({
  def, yaFormada, onFormar, onVolver, onSiguiente, labelSiguiente,
}: {
  def: MacroDef;
  yaFormada: boolean;
  onFormar: () => void;
  onVolver: () => void;
  /** Avanza a la siguiente macromolécula sin formar; en la última vuelve al menú. */
  onSiguiente: () => void;
  /** Texto del botón de avance: dice a DÓNDE lleva («Ahora, el ADN →»). Lo
   *  calcula el padre, que es quien sabe cuáles quedan sin formar. */
  labelSiguiente: string;
}) {
  const t = useT();
  // Piezas a arrastrar (monómeros iguales o componentes distintos) y estado.
  const piezas = piezasDe(def);
  const total = piezas.length;
  const heterogenea = !!def.componentes;          // «forma un monómero» (fosfolípido)
  const variada = !!def.monomerosVariados;         // cadena de monómeros distintos (ADN)
  const conLabel = heterogenea || variada;         // muestra la etiqueta de cada pieza
  const [puestas, setPuestas] = useState<number[]>([]); // índices de piezas ya colocadas, en orden
  const [completo, setCompleto] = useState(yaFormada);
  const bandejaRef = useRef<HTMLDivElement>(null);
  // Reserva la altura del box de piezas para que no encoja al arrastrarlas fuera.
  const { ref: piezasRef, minH: piezasMinH } = useReservarAltura();

  // Rehacer el ensamblaje de esta macromolécula (vuelve a la Fase A).
  const reiniciar = () => { setPuestas([]); setCompleto(false); };

  const soltar = (pi: number, rect: DOMRect) => {
    const el = bandejaRef.current;
    if (!el) return;
    const c = el.getBoundingClientRect();
    const m = rect.width / 2;
    const px = rect.left + rect.width / 2;
    const py = rect.top + rect.height / 2;
    const dentro = px >= c.left - m && px <= c.right + m && py >= c.top - m && py <= c.bottom + m;
    if (!dentro) return;
    setPuestas((prev) => {
      if (prev.includes(pi)) return prev;
      const next = [...prev, pi];
      if (next.length >= total) {
        setTimeout(() => { setCompleto(true); onFormar(); }, 500);
      }
      return next;
    });
  };

  // Índices de las piezas que aún quedan por arrastrar.
  const pendientes = piezas.map((_, i) => i).filter((i) => !puestas.includes(i));

  return (
    <MBox key={def.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} w="100%">
      {/* Volver */}
      <Flex mb={4}>
        {/* Volver: en vez del velo blanco translúcido de antes, lleva el fondo
            propio de Fisiología (DisciplinaBgLayer), como el header. */}
        <Box as="button" onClick={onVolver}
             position="relative" overflow="hidden"
             display="inline-flex" alignItems="center" gap={2} px={4} py={1.5} borderRadius="full"
             color={fisiologiaTxt}
             fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "sm", md: "md" }} cursor="pointer"
             // El MISMO halo que la cabecera (glowHeader): el botón lleva su
             // mismo fondo, así que tenía que llevar también su misma sombra.
             boxShadow={glowHeader(fisiologiaTxt)}
             transition="all 0.2s"
             sx={{ "&:hover .volver-velo": { opacity: 0 } }}>
          <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="full" overlay={`${fisiologiaBg}bb`} />
          {/* Velo extra que se desvanece al pasar por encima: así el botón
              "responde" sin cambiar el fondo. */}
          <Box className="volver-velo" position="absolute" inset={0} borderRadius="full"
               bg="rgba(0,0,0,0.18)" opacity={1} transition="opacity 0.2s" pointerEvents="none" />
          <Box position="relative" zIndex={1} style={{ textShadow: INK }}>
            {`← ${t("fisiologia.macro.volver")}`}
          </Box>
        </Box>
      </Flex>

      <AnimatePresence mode="wait">
        {!completo ? (
          // ── FASE A · encadenar (dos boxes: bandeja | piezas) ──
          <MBox key="a" w="100%" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Texto FUERA de las cajas: va en blanco, no en el color de la
                disciplina, para que se lea sobre el turquesa de la página. */}
            <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" textAlign="center"
                  style={{ textShadow: INK }}>{t(def.nombre)}</Text>
            <Text color="white" fontSize={{ base: "xs", md: "sm" }} fontWeight="700" letterSpacing="0.18em"
                  textTransform="uppercase" textAlign="center" mt={2} opacity={0.75}
                  style={{ textShadow: INK }}>
              {t("fisiologia.macro.explicacion")}
            </Text>
            <Text color="white" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                  textAlign="center" mt={1} mb={5} style={{ textShadow: INK }}>
              {heterogenea
                ? t("fisiologia.macro.instruccionPiezas", { total, monomero: t(def.monomero) })
                : t("fisiologia.macro.instruccionCadena", { total, monomeros: t(def.monomeroPl) })}
            </Text>

            <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

              {/* ── Box izquierda · bandeja de ensamblaje (aquí se llevan las piezas) · entra primero ── */}
              <Reveal direction="up" distance={22} duration={0.5} delay={0}
                      flex={{ base: "1 1 auto", md: "0 0 46%" }} display="flex">
                <PanelBox w="100%" minH={{ base: "200px", md: "300px" }}>
                  <Flex h="100%" align="center" justify="center">
                    <Box ref={bandejaRef} position="relative" w="100%" h={{ base: "150px", md: "190px" }}
                         borderRadius="2xl" overflow="hidden"
                         sx={{ background: "radial-gradient(ellipse at 50% 40%, #241d3c 0%, #150f26 55%, #060410 100%)",
                               boxShadow: `inset 0 0 40px rgba(0,0,0,0.85), 0 0 20px ${def.glow}22` }}>
                      <Box position="absolute" inset="8px" borderRadius="xl" pointerEvents="none"
                           border={`1.5px dashed ${def.glow}55`} animation={`${pulse} 3.4s ease-in-out infinite`} />
                      {/* piezas ya colocadas (en el orden en que se soltaron) */}
                      {puestas.map((pi, order) => {
                        const p = posEnBandeja(def.forma, order, total);
                        return (
                          <MBox key={pi} position="absolute" left={`${p.x}%`} top={`${p.y}%`} transform="translate(-50%,-50%)"
                                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 340, damping: 20 }}>
                            <Perla pieza={piezas[pi]} glow={def.glow} size={{ base: "34px", md: "42px" }} />
                          </MBox>
                        );
                      })}
                      {puestas.length === 0 && (
                        <Flex position="absolute" inset="0" align="center" justify="center" pointerEvents="none">
                          <Text color={`${def.glow}cc`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>{t("fisiologia.macro.bandeja")}</Text>
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </PanelBox>
              </Reveal>

              {/* ── Box derecha · piezas a arrastrar (2 por fila) · entra después ── */}
              {/* overflow:visible para que la ficha no se recorte al arrastrarla al otro box. */}
              <Reveal direction="up" distance={22} duration={0.5} delay={0.18} flex="1" display="flex">
                <PanelBox w="100%" overflow="visible" minH={{ base: "auto", md: "300px" }}>
                  <Flex direction="column" align="center" justify="center" gap={5} h="100%">
                    <Box ref={piezasRef} display="grid" gridTemplateColumns="repeat(2, auto)"
                         justifyContent="center" justifyItems="center" alignContent="center"
                         columnGap={{ base: 4, md: 6 }} rowGap={{ base: 4, md: 5 }}
                         minH={piezasMinH ? `${piezasMinH}px` : "60px"}>
                      <AnimatePresence>
                        {piezas.map((pz, pi) => (
                          <MonomeroFicha key={pi} pieza={pz} glow={def.glow} mostrarLabel={conLabel}
                                         onSoltar={(rect) => soltar(pi, rect)} enterDelay={0.45 + pi * 0.1}
                                         colocada={puestas.includes(pi)} />
                        ))}
                      </AnimatePresence>
                    </Box>
                    {pendientes.length === 0 && (
                      <Text color={`${def.glow}bb`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic">{t("fisiologia.macro.plegandose")}</Text>
                    )}

                    {/* progreso */}
                    <Flex justify="center" gap={2}>
                      {Array.from({ length: total }).map((_, i) => (
                        <Box key={i} w="9px" h="9px" borderRadius="full"
                             bg={i < puestas.length ? def.glow : "rgba(255,255,255,0.22)"}
                             boxShadow={i < puestas.length ? `0 0 10px ${def.glow}` : "none"} transition="all 0.3s" />
                      ))}
                    </Flex>
                  </Flex>
                </PanelBox>
              </Reveal>
            </Flex>
          </MBox>
        ) : (
          // ── FASE B · resultado (2 cajas: foto | texto) ──
          <MBox key="b" w="100%" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: "easeOut" }}>
            <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

              {/* Caja 1 · imagen de la macromolécula */}
              <PanelBox flexShrink={0} w={{ base: "100%", md: "auto" }}>
                <Flex h="100%" justify="center" align="center">
                  <Flex flexShrink={0} justify="center" align="center" position="relative"
                        w={{ base: "220px", md: "280px" }} h={{ base: "220px", md: "280px" }}>
                    <Box position="absolute" inset="-4%" borderRadius="full" pointerEvents="none"
                         animation={`${shimmer} 3.6s ease-in-out infinite`}
                         sx={{ boxShadow: `0 0 46px ${def.glow}55, 0 0 88px ${def.glow}33` }} />
                    <Image src={def.resultadoImg} alt={t(def.nombre)} w="100%" h="100%" objectFit="contain"
                           fallbackStrategy="onError"
                           style={{ filter: `drop-shadow(0 0 16px ${def.glow}55)` }}
                           fallback={<MacroDibujada def={def} />} />
                  </Flex>
                </Flex>
              </PanelBox>

              {/* Caja 2 · texto */}
              <PanelBox flex="1">
                <Flex direction="column" gap={3.5} h="100%" justify="center" textAlign={{ base: "center", md: "left" }}>
                  <Text color={fisiologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.25"
                        style={{ textShadow: INK }}>{t("fisiologia.macro.hecho", { macro: t(def.nombre).toLowerCase(), Macro: t(def.nombre) })}</Text>
                  <Box h="1px" w={{ base: "60%", md: "70%" }} mx={{ base: "auto", md: 0 }}
                       bgGradient={`linear(to-r, ${def.glow}aa, transparent)`} />
                  {def.resultado.map((clave) => (
                    <Text key={clave} color={fisiologiaTxt} fontSize={{ base: "lg", md: "xl" }}
                          lineHeight="1.9" style={{ textShadow: INK }}>{t(clave)}</Text>
                  ))}

                  {/* «Siguiente →» va DENTRO de la caja del texto, al final y a la
                      derecha. La caja crece un poco de alto para acogerlo, que es
                      lo pedido. Lleva a la próxima macromolécula sin formar (y en
                      la última, de vuelta al menú de las 4). */}
                  <Box as="button" onClick={onSiguiente}
                       alignSelf={{ base: "center", md: "flex-end" }} mt={2}
                       display="inline-flex" alignItems="center" gap={2} px={7} py={2} borderRadius="full"
                       bg={fisiologiaTxt} color={fisiologiaBg}
                       fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                       letterSpacing="0.04em" cursor="pointer" transition="all 0.2s" whiteSpace="nowrap"
                       boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33`}
                       _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88` }}>
                    {labelSiguiente}
                  </Box>
                </Flex>
              </PanelBox>
            </Flex>

            {/* «Volver a hacer» se queda FUERA de la caja, debajo y a la derecha:
                es la acción secundaria y así no compite con «Siguiente». */}
            <Flex justify="flex-end" align="center" w="100%" mt={{ base: 5, md: 6 }}>
              <Box as="button" onClick={reiniciar}
                   display="inline-flex" alignItems="center" gap={2} px={5} py={2} borderRadius="full"
                   bg="rgba(255,255,255,0.08)" color={fisiologiaTxt} border="1px solid rgba(255,255,255,0.28)"
                   fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "sm", md: "md" }}
                   letterSpacing="0.03em" cursor="pointer" transition="all 0.2s"
                   _hover={{ bg: "rgba(255,255,255,0.16)", color: "white", borderColor: `${fisiologiaTxt}aa` }}>
                {t("metodo.volverAHacer")}
              </Box>
            </Flex>
          </MBox>
        )}
      </AnimatePresence>
    </MBox>
  );
}

// ── Reserva dibujada de la macromolécula formada (mientras no haya PNG) ──────
function MacroDibujada({ def }: { def: MacroDef }) {
  const beads = Array.from({ length: def.n });
  return (
    <Box position="relative" w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
      <Box position="relative" w="86%" h="60%">
        {beads.map((_, i) => {
          const p = posEnBandeja(def.forma, i, def.n);
          return (
            <Box key={i} position="absolute" left={`${p.x}%`} top={`${p.y}%`} transform="translate(-50%,-50%)"
                 w={{ base: "30px", md: "38px" }} h={{ base: "30px", md: "38px" }} borderRadius="full"
                 sx={{ background: perla(def.glow), boxShadow: `0 0 10px ${def.glow}aa` }} />
          );
        })}
      </Box>
    </Box>
  );
}

// ── Box rectangular de una macromolécula ────────────────────────────────────
// Foto a la izquierda: se ve si ya está formada; si no, un «?». El resto (nombre,
// descripción, acción) siempre visible. Al formarla aparece la foto + un tick y
// el borde se ilumina → sensación de recorrido.
function MacroCard({ m, hecha, onClick }: { m: MacroDef; hecha: boolean; onClick: () => void }) {
  const t = useT();
  return (
    <MBox whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 24 }} w="100%">
      <Box
        as="button"
        onClick={onClick}
        w="100%"
        textAlign="left"
        position="relative"
        borderRadius="2xl"
        overflow="hidden"
        cursor="pointer"
        border={`1px solid ${hecha ? m.glow : "rgba(255,255,255,0.16)"}`}
        boxShadow={hecha
          ? `0 0 20px ${m.glow}44, 0 4px 18px rgba(0,0,0,0.22), inset 0 0 24px ${m.glow}12`
          : "0 4px 18px rgba(0,0,0,0.22)"}
        transition="all 0.25s ease"
        _hover={{ borderColor: m.glow, boxShadow: `0 0 24px ${m.glow}55, 0 8px 26px rgba(0,0,0,0.3)` }}
        _active={{ transform: "translateY(-1px)" }}
      >
        <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />

        <Flex position="relative" zIndex={1} align="center" gap={{ base: 5, md: 8 }} p={{ base: 5, md: 7 }}>
          {/* Foto (o «?» si aún no está hecha) */}
          <Box
            flexShrink={0}
            w={{ base: "91px", md: "130px" }}
            h={{ base: "101px", md: "144px" }}
            borderRadius="xl"
            overflow="hidden"
            position="relative"
            bg="rgba(10,7,20,0.5)"
            border={`1px solid ${hecha ? `${m.glow}77` : "rgba(255,255,255,0.14)"}`}
            boxShadow={hecha ? `0 0 16px ${m.glow}55, inset 0 0 18px ${m.glow}14` : "none"}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {hecha ? (
              <Image src={m.cuadradoImg} alt={t(m.nombre)} w="100%" h="100%" objectFit="cover"
                     fallbackStrategy="onError"
                     fallback={<MacroDibujada def={m} />} />
            ) : (
              <Text color={fisiologiaTxt} fontSize={{ base: "4xl", md: "5xl" }} fontWeight="800"
                    style={{ textShadow: INK }}>?</Text>
            )}
          </Box>

          {/* Texto */}
          <Box flex="1" minW={0}>
            <Flex align="center" gap={2.5}>
              <Text color={fisiologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700"
                    style={{ textShadow: INK }}>{t(m.nombre)}</Text>
              {/* Marca común del recorrido (MarcaLeido), con el color de la
                  macromolécula: misma forma que el resto de marcas. */}
              {hecha && <MarcaLeido inline tinta={m.glow} bg={fisiologiaBg} title={t("fisiologia.macro.formada")} />}
            </Flex>
            <Text color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" mt={1.5}
                  style={{ textShadow: INK }}>{t(m.desc)}</Text>
            <Text color={hecha ? m.glow : `${fisiologiaTxt}cc`} fontSize={{ base: "xs", md: "sm" }} fontWeight="700"
                  letterSpacing="0.05em" textTransform="uppercase" mt={2.5}>
              {hecha
                ? t("fisiologia.macro.verDeNuevo")
                : t("fisiologia.macro.construir", { n: m.n, monomeros: t(m.monomeroPl) })}
            </Text>
          </Box>
        </Flex>
      </Box>
    </MBox>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaMacromoleculas() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formadas, setFormadas] = useState<MacroId[]>([]);
  const [activa, setActiva] = useState<MacroId | null>(null);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  const dataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }
        let yaFormadas: MacroId[] = [];
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const guardadas = dataRef.current?.macromoleculas_hechas;
          if (Array.isArray(guardadas)) {
            yaFormadas = guardadas.filter((x: any): x is MacroId => MACROS.some((m) => m.id === x));
            setFormadas(yaFormadas);
          }
        } catch { /* sin fila todavía */ }
        // No mostramos la página hasta que TODAS las fotos del juego estén
        // descargadas (perlas de monómero, resultado circular y cuadrada de la
        // rejilla), para que al ir de box en box formando no aparezca ninguna
        // foto de golpe. El «?» de las no formadas depende de `hecha`, no de la
        // carga, así que se sigue mostrando igual.
        await precargarImagenes(
          MACROS.flatMap((m) => [
            m.monomeroImg, m.resultadoImg, m.cuadradoImg,
            ...(m.componentes?.map((c) => c.img) ?? []),
            ...(m.monomerosVariados?.map((c) => c.img) ?? []),
          ]),
        );
      } catch {
        navigate("/metodo/fisiologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const guardar = async (nuevas: MacroId[]) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const data = {
      ...dataRef.current,
      macromoleculas_hechas: nuevas,
      macromoleculas_hecho: nuevas.length === MACROS.length,
    };
    dataRef.current = data;
    try {
      await axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
    } catch { /* se reintenta la próxima vez */ }
  };

  const formar = (id: MacroId) => {
    setFormadas((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      void guardar(next);
      return next;
    });
  };

  // «Siguiente →» desde el resultado: salta a la primera macromolécula que aún
  // no esté formada; si están las 4, vuelve al menú de las 4 cajas. Como no hay
  // orden fijo, «la última» es simplemente la que completa el conjunto.
  // La que toca: la primera sin formar, descartando la que se está viendo (la
  // que se acaba de formar puede no estar aún en `formadas`, porque el guardado
  // va por detrás). Si no queda ninguna, se vuelve al menú de las 4.
  const proxima = MACROS.find((m) => !formadas.includes(m.id) && m.id !== activa) ?? null;

  // El destino y el rótulo salen del MISMO valor a propósito: así el botón no
  // puede decir una cosa y llevar a otra. El rótulo nombra a dónde va («Ahora,
  // el ADN →»), igual que en /metodo/fisiologia/atomos y /moleculas.
  const irSiguiente = () => setActiva(proxima ? proxima.id : null);
  const labelSiguiente = proxima
    ? t("fisiologia.macro.ahora", { macro: t(proxima.articulo) })
    : `${t("fisiologia.macro.volver")} →`;

  if (loading) {
    return <FisiologiaLoading />;
  }

  const defActiva = MACROS.find((m) => m.id === activa) || null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1160px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title={t("fisiologia.macromoleculas.titulo")}
            pageLabel="4/5"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: `← ${t("fisiologia.moleculas.titulo")}`, onClick: () => navigate("/metodo/fisiologia/moleculas") }}
            extra={celulasBtn}
            next={{ label: `${t("fisiologia.estructuras.corto")} →`, onClick: () => navigate("/metodo/fisiologia/estructuras"), disabled: formadas.length < MACROS.length, disabledTooltip: t("fisiologia.macro.bloqueo") }}
          />
          </Reveal>

          {!activa && (
            <MBox initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} textAlign="center">
              <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="400" fontStyle="italic" mt={1}
                    letterSpacing="0.02em" maxW="640px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                {t("fisiologia.macro.intro")}
              </Text>
            </MBox>
          )}

          {defActiva ? (
            /* ── Estación (cada fase trae sus propias cajas) · se mantiene a 850
                 para no descuadrar el juego de arrastrar ── */
            <Box w="100%" maxW="850px">
              <Estacion
                key={defActiva.id}
                def={defActiva}
                yaFormada={formadas.includes(defActiva.id)}
                onFormar={() => formar(defActiva.id)}
                onVolver={() => setActiva(null)}
                onSiguiente={irSiguiente}
                labelSiguiente={labelSiguiente}
              />
            </Box>
          ) : (
            /* ── 4 boxes en rejilla 2×2 · entran uno detrás de otro. maxW mayor
                 que el header a propósito: las tarjetas se ven más grandes ── */
            <RevealStagger stagger={0.12} delayChildren={0.1}
                           display="flex" flexWrap="wrap" justifyContent="center" w="100%" maxW="1044px" gap={{ base: 4, md: 5 }}>
              {MACROS.map((m) => (
                <RevealItem key={m.id} direction="up" distance={24} scaleFrom={0.97}
                            flex={{ base: "1 1 100%", md: "0 1 calc(50% - 10px)" }} minW={0} display="flex">
                  <MacroCard m={m} hecha={formadas.includes(m.id)} onClick={() => setActiva(m.id)} />
                </RevealItem>
              ))}
            </RevealStagger>
          )}
        </Flex>
      </Flex>

      {celulasModal}
      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
