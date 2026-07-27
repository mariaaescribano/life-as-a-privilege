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
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useReservarAltura } from "../../hooks/useReservarAltura";
import { ComicCelulaModal } from "../../components/metodo/ComicCelulaModal";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon, noSelectSx} from "../../GlobalVariables";

const MBox = motion(Box);
const INK = `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc, 0 2px 16px ${fisiologiaBg}88`;
const PRE = "/recorrido/fisiologia/pre";

// ── Estilo de cada macromolécula usada como "ladrillo" (colores heredados) ──
type Macro = "proteina" | "adn" | "lipido";
const MACRO: Record<Macro, { color: string; glyph: string; img: string }> = {
  proteina: { color: "#7fd6c2", glyph: "P", img: `${PRE}/proteina.png` },
  adn:      { color: "#9ab6f0", glyph: "N", img: `${PRE}/adn.webp` },
  lipido:   { color: "#f2c86b", glyph: "L", img: `${PRE}/fosfolipido.webp` },
};

// ── Estructuras celulares ────────────────────────────────────────────────────
type EstId = "nucleo" | "membrana" | "mitocondria" | "ribosoma";
type Forma = "helice" | "membrana" | "cluster";

interface Ingrediente { macro: Macro; n: number; label: string;
  /** Foto propia de este ingrediente (si no, se usa la genérica del macro). */
  img?: string;
}
interface EstDef {
  id: EstId;
  nombre: string;
  glow: string;          // acento de la estructura
  forma: Forma;
  desc: string;          // frase de la tarjeta
  ingredientes: Ingrediente[];
  resultado: string[];
  resultadoImg: string;   // circular · se usa en el resultado (Fase B)
  cuadradoImg: string;    // cuadrada · se usa en el box de la rejilla
}

const ESTRUCTURAS: EstDef[] = [
  {
    id: "nucleo", nombre: "Núcleo", glow: "#9ab6f0", forma: "cluster",
    desc: "Guarda y protege tu información genética.",
    ingredientes: [{ macro: "adn", n: 3, label: "ADN" }, { macro: "lipido", n: 2, label: "Barrera nuclear", img: `${PRE}/barreranuclear.webp` }],
    resultado: [
      "El ADN se enrolla sobre sí mismo y se compacta dentro de una envoltura de membrana: así nace el núcleo.",
      "Es la sala de control de la célula: ahí se guardan, letra a letra, las instrucciones para fabricar cada una de tus proteínas: es donde vive tu manual de la Vida.",
    ],
    resultadoImg: `${PRE}/nucleocircular.webp`, cuadradoImg: `${PRE}/nucleo.webp`,
  },
  {
    id: "membrana", nombre: "Membrana celular", glow: "#f2c86b", forma: "membrana",
    desc: "Envuelve la célula y decide qué entra y qué sale.",
    ingredientes: [{ macro: "lipido", n: 4, label: "lípido" }, { macro: "proteina", n: 2, label: "Receptores hormonales", img: `${PRE}/receptoresmembranacelular.webp` }],
    resultado: [
      "Los fosfolípidos se ordenan solos en una doble capa, y las proteínas se incrustan como puertas y sensores.",
      "Así nace la membrana: la frontera viva que separa el interior de la célula del mundo exterior y controla el paso.",
    ],
    resultadoImg: `${PRE}/circularmembrana.webp`, cuadradoImg: `${PRE}/membrana.webp`,
  },
  {
    id: "mitocondria", nombre: "Mitocondria", glow: "#e08a8a", forma: "cluster",
    desc: "La central de energía de la célula.",
    ingredientes: [{ macro: "lipido", n: 2, label: "Membrana mitocondrial", img: `${PRE}/membranamitocondria.webp` }, { macro: "proteina", n: 3, label: "Receptores", img: `${PRE}/receptoresmitocondria.webp` }],
    resultado: [
      "Con sus membranas plegadas y muchísimas proteínas y enzimas, la mitocondria transforma los nutrientes y el oxígeno en energía.",
      "Es la central eléctrica que fabrica el ATP, el combustible que mantiene en marcha cada proceso de tu cuerpo.",
    ],
    resultadoImg: `${PRE}/circularmitocondria.webp`, cuadradoImg: `${PRE}/mitocondria.webp`,
  },
  {
    id: "ribosoma", nombre: "Ribosoma", glow: "#7fd6c2", forma: "cluster",
    desc: "La fábrica de enzimas.",
    ingredientes: [{ macro: "proteina", n: 3, label: "Enzimas", img: `${PRE}/enzimasribosoma.webp` }, { macro: "adn", n: 1, label: "ARN", img: `${PRE}/ARN.webp` }],
    resultado: [
      "Hecho de proteínas y de ARN(r), el ribosoma lee las instrucciones ARN(m), que vienen del ADN.",
      "Con ellas ensambla aminoácidos uno tras otro y fabrica nuevas enzimas: convierte la información genética en materia viva.",
    ],
    resultadoImg: `${PRE}/circularribosoma.webp`, cuadradoImg: `${PRE}/ribosoma.webp`,
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

const perlaBg = (c: string): string =>
  `radial-gradient(circle at 34% 30%, #ffffff 0%, ${c} 36%, ${c}dd 64%, ${c}77 100%)`;

// Piezas planas a arrastrar en una estación.
interface Pieza { id: string; macro: Macro; label: string; img?: string; }
const piezasDe = (def: EstDef): Pieza[] =>
  def.ingredientes.flatMap((ing) =>
    Array.from({ length: ing.n }, (_, i) => ({ id: `${def.id}-${ing.macro}-${i}`, macro: ing.macro, label: ing.label, img: ing.img })));

// Posición (%) de la pieza i dentro de la bandeja, según la forma.
function posEnBandeja(forma: Forma, i: number, n: number): { x: number; y: number } {
  if (forma === "helice") return { x: ((i + 0.5) / n) * 100, y: i % 2 === 0 ? 34 : 66 };
  if (forma === "membrana") return { x: ((i + 0.5) / n) * 100, y: i % 2 === 0 ? 30 : 70 };
  // cluster: círculo apretado
  const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + Math.cos(ang) * 24, y: 50 + Math.sin(ang) * 26 };
}

// ── Perla del ladrillo (imagen con reserva a esfera dibujada) ───────────────
function Perla({ macro, size, img }: { macro: Macro; size: any; img?: string }) {
  const st = MACRO[macro];
  return (
    <Box w={size} h={size} borderRadius="full" overflow="hidden" pointerEvents="none"
         sx={{ boxShadow: `0 0 12px ${st.color}aa, 0 0 24px ${st.color}55` }}>
      <Image src={img ?? st.img} alt="" w="100%" h="100%" objectFit="cover" draggable={false}
             fallback={
               <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" sx={{ background: perlaBg(st.color) }}>
                 <Text color="rgba(0,0,0,0.55)" fontWeight="900" lineHeight="1"
                       fontSize={{ base: "sm", md: "md" }} style={{ userSelect: "none" }}>{st.glyph}</Text>
               </Box>
             } />
    </Box>
  );
}

// ── Ficha arrastrable ───────────────────────────────────────────────────────
function LadrilloFicha({ pieza, onSoltar }: { pieza: Pieza; onSoltar: (r: DOMRect) => void }) {
  const [arrastrando, setArrastrando] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const st = MACRO[pieza.macro];
  return (
    <MBox
      ref={ref}
      drag
      dragSnapToOrigin
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => setArrastrando(true)}
      onDragEnd={() => { setArrastrando(false); if (ref.current) onSoltar(ref.current.getBoundingClientRect()); }}
      whileDrag={{ scale: 1.16, zIndex: 60 }}
      whileHover={{ scale: 1.08, y: -2 }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.4 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      cursor="grab"
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={1}
      flexShrink={0}
      style={{ touchAction: "none", WebkitUserSelect: "none", userSelect: "none", WebkitTouchCallout: "none" }}
    >
      {/* El nombre de la pieza va DENTRO del círculo (sobre la imagen), con un
          velo oscuro abajo para que se lea sobre cualquier foto. */}
      <Box position="relative" borderRadius="full"
           sx={{ filter: arrastrando ? `drop-shadow(0 0 16px ${st.color}) drop-shadow(0 10px 22px rgba(0,0,0,0.5))` : "none" }}>
        <Perla macro={pieza.macro} img={pieza.img} size={{ base: "62px", md: "80px" }} />
        <Flex position="absolute" inset="0" align="flex-end" justify="center"
              borderRadius="full" overflow="hidden" pointerEvents="none">
          <Box w="100%" px="5px" pb={{ base: "5px", md: "7px" }} pt={{ base: "14px", md: "18px" }}
               sx={{ background: "linear-gradient(to top, rgba(4,2,10,0.85) 32%, rgba(4,2,10,0.35) 68%, transparent)" }}>
            <Text color={fisiologiaTxt} fontSize={{ base: "3xs", md: "2xs" }} fontWeight="700"
                  letterSpacing="0.02em" textTransform="uppercase" textAlign="center"
                  lineHeight="1.05" noOfLines={2}
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.95)" }}>
              {pieza.label}
            </Text>
          </Box>
        </Flex>
      </Box>
    </MBox>
  );
}

// ── Reserva dibujada de la estructura formada ───────────────────────────────
function EstDibujada({ def }: { def: EstDef }) {
  const piezas = piezasDe(def);
  return (
    <Box position="relative" w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
      <Box position="relative" w="82%" h={def.forma === "cluster" ? "82%" : "58%"}>
        {piezas.map((p, i) => {
          const pos = posEnBandeja(def.forma, i, piezas.length);
          return (
            <Box key={i} position="absolute" left={`${pos.x}%`} top={`${pos.y}%`} transform="translate(-50%,-50%)"
                 w={{ base: "30px", md: "38px" }} h={{ base: "30px", md: "38px" }} borderRadius="full"
                 sx={{ background: perlaBg(MACRO[p.macro].color), boxShadow: `0 0 10px ${MACRO[p.macro].color}aa` }} />
          );
        })}
      </Box>
    </Box>
  );
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
// Estación de una estructura celular
// ═════════════════════════════════════════════════════════════════════════
function Estacion({ def, yaFormada, onFormar, onVolver, onSiguiente }: {
  def: EstDef; yaFormada: boolean; onFormar: () => void; onVolver: () => void;
  /** Avanza a la siguiente estructura sin construir; en la última vuelve al menú. */
  onSiguiente: () => void;
}) {
  const [pendientes, setPendientes] = useState<Pieza[]>(() => piezasDe(def));
  const [puestas, setPuestas] = useState<Pieza[]>(() => (yaFormada ? piezasDe(def) : []));
  const [completo, setCompleto] = useState(yaFormada);
  const bandejaRef = useRef<HTMLDivElement>(null);
  const totalN = piezasDe(def).length;
  // Reserva la altura de la zona de piezas para que no encoja al arrastrarlas fuera.
  const { ref: piezasRef, minH: piezasMinH } = useReservarAltura();

  // Rehacer el ensamblaje de esta estructura (vuelve a la Fase A).
  const reiniciar = () => { setPendientes(piezasDe(def)); setPuestas([]); setCompleto(false); };

  const soltar = (pieza: Pieza, rect: DOMRect) => {
    const el = bandejaRef.current;
    if (!el) return;
    const c = el.getBoundingClientRect();
    const m = rect.width / 2;
    const px = rect.left + rect.width / 2, py = rect.top + rect.height / 2;
    const dentro = px >= c.left - m && px <= c.right + m && py >= c.top - m && py <= c.bottom + m;
    if (!dentro) return;
    setPendientes((prev) => prev.filter((p) => p.id !== pieza.id));
    setPuestas((prev) => {
      const next = [...prev, pieza];
      if (next.length >= totalN) setTimeout(() => { setCompleto(true); onFormar(); }, 500);
      return next;
    });
  };

  return (
    <MBox key={def.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} w="100%">
      <Flex mb={4}>
        <Box as="button" onClick={onVolver}
             display="inline-flex" alignItems="center" gap={2} px={4} py={1.5} borderRadius="full"
             bg="rgba(255,255,255,0.1)" color={fisiologiaTxt}
             fontFamily="'EB Garamond', serif" fontWeight="600" fontSize="sm" cursor="pointer"
             transition="all 0.2s" _hover={{ bg: "rgba(255,255,255,0.18)" }}>
          ← Las 4 estructuras
        </Box>
      </Flex>

      <AnimatePresence mode="wait">
        {!completo ? (
          <MBox key="a" w="100%" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Título y frase FUERA del box, arriba (no dentro del panel) */}
            <Text color={fisiologiaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" textAlign="center" style={{ textShadow: INK }}>
              {def.nombre}
            </Text>
            <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" mt={1} mb={5} style={{ textShadow: INK }}>
              Arrastra las macromoléculas a la zona para ensamblarla.
            </Text>

            <PanelBox minH={{ md: "360px" }}>
            {/* Bandeja */}
            <Box ref={bandejaRef} position="relative" w="100%" h={{ base: "150px", md: "170px" }}
                 borderRadius="2xl" overflow="hidden" mb={6}
                 sx={{ background: "radial-gradient(ellipse at 50% 40%, #241d3c 0%, #150f26 55%, #060410 100%)",
                       boxShadow: `inset 0 0 40px rgba(0,0,0,0.85), 0 0 20px ${def.glow}22` }}>
              <Box position="absolute" inset="8px" borderRadius="xl" pointerEvents="none"
                   border={`1.5px dashed ${def.glow}55`} animation={`${pulse} 3.4s ease-in-out infinite`} />
              {puestas.map((p, i) => {
                const pos = posEnBandeja(def.forma, i, totalN);
                return (
                  <MBox key={p.id} position="absolute" left={`${pos.x}%`} top={`${pos.y}%`} transform="translate(-50%,-50%)"
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 340, damping: 20 }}>
                    <Perla macro={p.macro} img={p.img} size={{ base: "34px", md: "42px" }} />
                  </MBox>
                );
              })}
              {puestas.length === 0 && (
                <Flex position="absolute" inset="0" align="center" justify="center" pointerEvents="none">
                  <Text color={`${def.glow}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.85)" }}>zona de ensamblaje</Text>
                </Flex>
              )}
            </Box>

            {/* Piezas a arrastrar */}
            <Flex ref={piezasRef} wrap="wrap" justify="center" align="center" alignContent="center"
                  gap={{ base: 3, md: 4 }} minH={piezasMinH ? `${piezasMinH}px` : "70px"}>
              <AnimatePresence>
                {pendientes.map((p) => (
                  <LadrilloFicha key={p.id} pieza={p} onSoltar={(r) => soltar(p, r)} />
                ))}
              </AnimatePresence>
              {pendientes.length === 0 && (
                <Text color={`${def.glow}bb`} fontSize="md" fontStyle="italic">…organizándose…</Text>
              )}
            </Flex>

            <Flex justify="center" gap={2} mt={5}>
              {Array.from({ length: totalN }).map((_, i) => (
                <Box key={i} w="9px" h="9px" borderRadius="full"
                     bg={i < puestas.length ? def.glow : "rgba(255,255,255,0.22)"}
                     boxShadow={i < puestas.length ? `0 0 10px ${def.glow}` : "none"} transition="all 0.3s" />
              ))}
            </Flex>
            </PanelBox>
          </MBox>
        ) : (
          // ── FASE B · resultado (2 cajas: foto | texto) ──
          <MBox key="b" w="100%" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: "easeOut" }}>
            <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

              {/* Caja 1 · imagen de la estructura */}
              <PanelBox flexShrink={0} w={{ base: "100%", md: "auto" }}>
                <Flex h="100%" justify="center" align="center">
                  <Flex flexShrink={0} justify="center" align="center" position="relative"
                        w={{ base: "220px", md: "280px" }} h={{ base: "220px", md: "280px" }}>
                    <Box position="absolute" inset="-4%" borderRadius="full" pointerEvents="none"
                         animation={`${shimmer} 3.6s ease-in-out infinite`}
                         sx={{ boxShadow: `0 0 46px ${def.glow}55, 0 0 88px ${def.glow}33` }} />
                    <Image src={def.resultadoImg} alt={def.nombre} w="100%" h="100%" objectFit="contain"
                           style={{ filter: `drop-shadow(0 0 16px ${def.glow}55)` }}
                           fallback={<EstDibujada def={def} />} />
                  </Flex>
                </Flex>
              </PanelBox>

              {/* Caja 2 · texto */}
              <PanelBox flex="1">
                <Flex direction="column" gap={3.5} h="100%" justify="center" textAlign={{ base: "center", md: "left" }}>
                  <Text color={fisiologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.25" style={{ textShadow: INK }}>
                    ¡Has construido {def.id === "nucleo" ? "el núcleo" : def.id === "membrana" ? "la membrana celular" : def.id === "mitocondria" ? "la mitocondria" : "el ribosoma"}!
                  </Text>
                  <Box h="1px" w={{ base: "60%", md: "70%" }} mx={{ base: "auto", md: 0 }}
                       bgGradient={`linear(to-r, ${def.glow}aa, transparent)`} />
                  {def.resultado.map((p, i) => (
                    <Text key={i} color={fisiologiaTxt} fontSize={{ base: "md", md: "lg" }}
                          lineHeight="1.9" style={{ textShadow: INK }}>{p}</Text>
                  ))}
                </Flex>
              </PanelBox>
            </Flex>

            {/* Acciones — fuera del box, abajo a la derecha del todo.
                «Siguiente →» lleva a la próxima estructura sin construir (y en la
                última, de vuelta al menú de las 4), sin tener que volver a mano. */}
            <Flex justify="flex-end" align="center" gap={3} w="100%" mt={{ base: 5, md: 6 }} wrap="wrap">
              <Box as="button" onClick={reiniciar}
                   display="inline-flex" alignItems="center" gap={2} px={5} py={2} borderRadius="full"
                   bg="rgba(255,255,255,0.08)" color={fisiologiaTxt} border="1px solid rgba(255,255,255,0.28)"
                   fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "xs", md: "sm" }}
                   letterSpacing="0.03em" cursor="pointer" transition="all 0.2s"
                   _hover={{ bg: "rgba(255,255,255,0.16)", color: "white", borderColor: `${fisiologiaTxt}aa` }}>
                ↺ Volver a hacer
              </Box>
              <Box as="button" onClick={onSiguiente}
                   display="inline-flex" alignItems="center" gap={2} px={7} py={2} borderRadius="full"
                   bg={fisiologiaTxt} color={fisiologiaBg}
                   fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                   letterSpacing="0.04em" cursor="pointer" transition="all 0.2s"
                   boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33`}
                   _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88` }}>
                Siguiente →
              </Box>
            </Flex>
          </MBox>
        )}
      </AnimatePresence>
    </MBox>
  );
}

// ── Box rectangular de una estructura ───────────────────────────────────────
// Foto a la izquierda: se ve si ya está construida; si no, un «?». El resto
// (nombre, descripción, acción) siempre visible. Al construirla aparece la foto
// + un tick y el borde se ilumina → sensación de recorrido.
function EstCard({ e, hecha, onClick }: { e: EstDef; hecha: boolean; onClick: () => void }) {
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
        border={`1px solid ${hecha ? e.glow : "rgba(255,255,255,0.16)"}`}
        boxShadow={hecha
          ? `0 0 20px ${e.glow}44, 0 4px 18px rgba(0,0,0,0.22), inset 0 0 24px ${e.glow}12`
          : "0 4px 18px rgba(0,0,0,0.22)"}
        transition="all 0.25s ease"
        _hover={{ borderColor: e.glow, boxShadow: `0 0 24px ${e.glow}55, 0 8px 26px rgba(0,0,0,0.3)` }}
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
            border={`1px solid ${hecha ? `${e.glow}77` : "rgba(255,255,255,0.14)"}`}
            boxShadow={hecha ? `0 0 16px ${e.glow}55, inset 0 0 18px ${e.glow}14` : "none"}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {hecha ? (
              <Image src={e.cuadradoImg} alt={e.nombre} w="100%" h="100%" objectFit="cover"
                     fallback={<EstDibujada def={e} />} />
            ) : (
              <Text color={fisiologiaTxt} fontSize={{ base: "4xl", md: "5xl" }} fontWeight="800"
                    style={{ textShadow: INK }}>?</Text>
            )}
          </Box>

          {/* Texto */}
          <Box flex="1" minW={0}>
            <Flex align="center" gap={2.5}>
              <Text color={fisiologiaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700"
                    style={{ textShadow: INK }}>{e.nombre}</Text>
              {hecha && (
                <Flex as="span" align="center" justify="center" flexShrink={0}
                      w={{ base: "22px", md: "24px" }} h={{ base: "22px", md: "24px" }} borderRadius="full"
                      bg={e.glow} color={fisiologiaBg} fontSize={{ base: "xs", md: "sm" }} fontWeight="900"
                      boxShadow={`0 0 10px ${e.glow}aa`}>✓</Flex>
              )}
            </Flex>
            <Text color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" mt={1}
                  style={{ textShadow: INK }}>{e.desc}</Text>
            <Text color={hecha ? e.glow : `${fisiologiaTxt}cc`} fontSize="xs" fontWeight="700"
                  letterSpacing="0.05em" textTransform="uppercase" mt={2.5}>
              {hecha ? "Construida · ver de nuevo" : "Construir"}
            </Text>
          </Box>
        </Flex>
      </Box>
    </MBox>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaEstructuras() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formadas, setFormadas] = useState<EstId[]>([]);
  const [activa, setActiva] = useState<EstId | null>(null);
  const [comicOpen, setComicOpen] = useState(false);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  const dataRef = useRef<Record<string, any>>({});

  // Al terminar las 4 estructuras se pasa por un cómic-puente y de ahí, a
  // «Crea la célula» (sin volver a la página de Niveles).
  const irSiguiente = () => setComicOpen(true);
  const comicContinuar = () => { setComicOpen(false); navigate("/metodo/fisiologia/celula"); };
  const comicCerrar = () => setComicOpen(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const g = dataRef.current?.estructuras_hechas;
          if (Array.isArray(g)) setFormadas(g.filter((x: any): x is EstId => ESTRUCTURAS.some((e) => e.id === x)));
        } catch { /* sin fila todavía */ }

        // No mostramos la página hasta que TODAS las fotos estén descargadas
        // (ladrillos + resultado circular + cuadrada de la rejilla), para que
        // ninguna aparezca de golpe cuando el resto ya está en pantalla.
        await precargarImagenes([
          ...Object.values(MACRO).map((m) => m.img),
          ...ESTRUCTURAS.flatMap((e) => [e.resultadoImg, e.cuadradoImg]),
          ...ESTRUCTURAS.flatMap((e) => e.ingredientes.map((ing) => ing.img)),
        ]);
      } catch {
        navigate("/metodo/fisiologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const guardar = async (nuevas: EstId[]) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const data = { ...dataRef.current, estructuras_hechas: nuevas, estructuras_hecho: nuevas.length === ESTRUCTURAS.length };
    dataRef.current = data;
    try {
      await axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, { headers: { Authorization: `Bearer ${token}` } });
    } catch { /* se reintenta la próxima vez */ }
  };

  const formar = (id: EstId) => {
    setFormadas((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      void guardar(next);
      return next;
    });
  };

  // «Siguiente →» desde el resultado: salta a la primera estructura que aún no
  // esté construida; si están las 4, vuelve al menú de las 4 cajas. Como no hay
  // orden fijo, «la última» es simplemente la que completa el conjunto.
  const irSiguienteEstacion = () => {
    const siguiente = ESTRUCTURAS.find((e) => !formadas.includes(e.id));
    setActiva(siguiente ? siguiente.id : null);
  };

  if (loading) {
    return <FisiologiaLoading />;
  }

  const defActiva = ESTRUCTURAS.find((e) => e.id === activa) || null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1160px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Estructuras celulares"
            pageLabel="5/5"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Macromoléculas", onClick: () => navigate("/metodo/fisiologia/macromoleculas") }}
            extra={celulasBtn}
            next={{ label: "Crea la célula →", onClick: irSiguiente, disabled: formadas.length < ESTRUCTURAS.length, disabledTooltip: "Primero construye las cuatro estructuras" }}
          />
          </Reveal>

          {!activa && (
            <MBox initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} textAlign="center">
              <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={1}
                    maxW="640px">
                Proteínas, ADN y lípidos se ensamblan para formar las partes de la célula. Construye las cuatro.
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
                onSiguiente={irSiguienteEstacion}
              />
            </Box>
          ) : (
            /* ── 4 boxes en rejilla 2×2 · entran uno detrás de otro. maxW mayor
                 que el header a propósito: las tarjetas se ven más grandes ── */
            <RevealStagger stagger={0.12} delayChildren={0.1}
                           display="flex" flexWrap="wrap" justifyContent="center" w="100%" maxW="1044px" gap={{ base: 4, md: 5 }}>
              {ESTRUCTURAS.map((e) => (
                <RevealItem key={e.id} direction="up" distance={24} scaleFrom={0.97}
                            flex={{ base: "1 1 100%", md: "0 1 calc(50% - 10px)" }} minW={0} display="flex">
                  <EstCard e={e} hecha={formadas.includes(e.id)} onClick={() => setActiva(e.id)} />
                </RevealItem>
              ))}
            </RevealStagger>
          )}
        </Flex>
      </Flex>

      {celulasModal}
      <ComicCelulaModal isOpen={comicOpen} onContinue={comicContinuar} onClose={comicCerrar} />
      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
