import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { glowSuave } from "../../components/metodo/FotoBox";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { Reveal, Float, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import { PLATO_MACROS, platoMacroByKey, type PlatoAlimento } from "../../hardCoded/espacio/PlatoHarvard";

// ═════════════════════════════════════════════════════════════════════════
// Actividad «Crea el plato de Harvard».
//   · Izquierda: el plato = círculo dividido en sectores (un macro por sector).
//     Al pulsar un sector se selecciona ese macro.
//   · Derecha: los alimentos del macro seleccionado, como círculos ARRASTRABLES.
//   · Se arrastran los alimentos sobre el plato; se quedan colocados. Un alimento
//     ya colocado se puede recolocar (arrastrándolo) o quitar (sacándolo fuera).
// El drag usa pointer events → funciona igual con ratón y con el dedo.
// ═════════════════════════════════════════════════════════════════════════

// Un alimento colocado en el plato (posición en % relativo al cuadro del plato).
interface AlimentoPuesto {
  id: string;
  foodKey: string;
  macroKey: string;
  xPct: number;
  yPct: number;
}

// Estado de arrastre en curso.
interface DragState {
  foodKey: string;
  macroKey: string;
  emoji: string;
  foto?: string;
  color: string;
  fromId?: string; // si se arrastra uno ya colocado (para recolocar/quitar)
  x: number;
  y: number;
}

const RADIO_ALIMENTO = 30; // diámetro visual base de los círculos de comida (px móvil)

// ── Geometría del plato (SVG 0..200) ──────────────────────────────────────
const VB = 200;
const CX = 100;
const CY = 100;
const R_PLATE = 97; // borde exterior del ala del plato (casi el borde del cuadro)
const R_RIM = 84;   // límite interior del ala = borde del hueco central
const R_FOOD = 82;  // radio de los sectores (el hueco donde va la comida)
const TOTAL_PROP = PLATO_MACROS.reduce((s, m) => s + m.proporcion, 0);

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

// Sectores del plato calculados a partir de las proporciones (empezando arriba).
const SECTORES = (() => {
  let acc = -90;
  return PLATO_MACROS.map((m) => {
    const sweep = (m.proporcion / TOTAL_PROP) * 360;
    const start = acc;
    const end = acc + sweep;
    const mid = acc + sweep / 2;
    acc = end;
    const p0 = polar(CX, CY, R_FOOD, start);
    const p1 = polar(CX, CY, R_FOOD, end);
    const largeArc = sweep > 180 ? 1 : 0;
    const d = `M ${CX} ${CY} L ${p0.x} ${p0.y} A ${R_FOOD} ${R_FOOD} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`;
    const label = polar(CX, CY, R_FOOD * 0.6, mid);
    const pct = Math.round((m.proporcion / TOTAL_PROP) * 100);
    return { macro: m, d, label, pct };
  });
})();

// Marco de sección con el fondo de Nutrición (nutri.png) + velo claro.
function SeccionBox({ children, ...rest }: React.ComponentProps<typeof Box>) {
  return (
    <Box position="relative" overflow="hidden" borderRadius="2xl"
         boxShadow={glowSuave(nutricionTxt)} {...rest}>
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}66`} />
      <Box position="relative" zIndex={1} h="100%">{children}</Box>
    </Box>
  );
}

// Contenido de un círculo de alimento: foto redonda si existe, si no el emoji.
// `big` agranda el emoji para los círculos grandes del panel/fantasma.
function AlimentoContenido({ food, big }: { food: Pick<PlatoAlimento, "emoji" | "foto" | "label">; big?: boolean }) {
  if (food.foto) {
    return <Box as="img" src={encodeURI(food.foto)} alt={food.label} w="100%" h="100%"
                borderRadius="full" style={{ objectFit: "cover" }} draggable={false} pointerEvents="none" />;
  }
  return (
    <Box as="span" fontSize={big ? { base: "2xl", md: "3xl" } : { base: "lg", md: "xl" }}
         lineHeight="1" userSelect="none" pointerEvents="none">
      {food.emoji}
    </Box>
  );
}

let ID_SEQ = 1;

export default function MetodoNutricionPlato() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [macroSel, setMacroSel] = useState<string>(PLATO_MACROS[0].key);
  const [puestos, setPuestos] = useState<AlimentoPuesto[]>([]);
  const [drag, setDrag] = useState<DragState | null>(null);

  const plateRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const dataRef = useRef<Record<string, any>>({});

  const macro = platoMacroByKey(macroSel)!;

  // ── Carga: sesión + suscripción + estado guardado del plato ──────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try { const t = await axios.get(`${API_URL}/payment/test/enabled`); testEnabled = !!t.data?.enabled; } catch { /* */ }
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito && !testEnabled) { navigate("/metodo/nutricion"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const guardados = dataRef.current?.plato_alimentos;
          if (Array.isArray(guardados)) {
            const validos = guardados.filter(
              (a: any) => a && typeof a.foodKey === "string" && typeof a.macroKey === "string"
            ).map((a: any) => ({
              id: String(a.id ?? `p${ID_SEQ++}`),
              foodKey: a.foodKey, macroKey: a.macroKey,
              xPct: Number(a.xPct) || 0.5, yPct: Number(a.yPct) || 0.5,
            }));
            setPuestos(validos);
          }
        } catch { /* sin fila todavía */ }

        // No quitamos el spinner hasta que TODAS las fotos de los alimentos estén
        // descargadas, para que el plato y el panel no se rellenen de golpe.
        await precargarImagenes(
          PLATO_MACROS.flatMap((m) => m.alimentos.map((a) => a.foto))
            .filter(Boolean)
            .map((f) => encodeURI(f as string)),
        );
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // Guarda el plato construido. `plato_hecho` = hay al menos un alimento de cada macro.
  const guardar = useCallback((nuevos: AlimentoPuesto[]) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const macrosConAlimento = new Set(nuevos.map((a) => a.macroKey));
    const data = {
      ...dataRef.current,
      plato_alimentos: nuevos,
      plato_hecho: PLATO_MACROS.every((m) => macrosConAlimento.has(m.key)),
    };
    dataRef.current = data;
    axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
      { headers: { Authorization: `Bearer ${token}` } }).catch(() => { /* reintenta al próximo toque */ });
  }, []);

  const actualizar = useCallback((updater: (prev: AlimentoPuesto[]) => AlimentoPuesto[]) => {
    setPuestos((prev) => {
      const next = updater(prev);
      guardar(next);
      return next;
    });
  }, [guardar]);

  const setDragBoth = (d: DragState | null) => { dragRef.current = d; setDrag(d); };

  // Inicia un arrastre (desde el panel o desde un alimento ya colocado).
  const startDrag = (
    e: React.PointerEvent,
    payload: { food: PlatoAlimento; macroKey: string; color: string; fromId?: string }
  ) => {
    e.preventDefault();
    setDragBoth({
      foodKey: payload.food.key, macroKey: payload.macroKey, emoji: payload.food.emoji,
      foto: payload.food.foto, color: payload.color, fromId: payload.fromId,
      x: e.clientX, y: e.clientY,
    });
  };

  // Suelta: si cae dentro del círculo del plato, coloca/recoloca; si cae fuera y
  // venía del plato, lo quita.
  const finalizarDrag = useCallback((e: PointerEvent) => {
    const d = dragRef.current;
    setDragBoth(null);
    if (!d || !plateRef.current) return;
    const rect = plateRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radio = rect.width / 2;
    const dentro = Math.hypot(e.clientX - cx, e.clientY - cy) <= radio * 0.98;

    if (dentro) {
      const xPct = (e.clientX - rect.left) / rect.width;
      const yPct = (e.clientY - rect.top) / rect.height;
      if (d.fromId) {
        actualizar((prev) => prev.map((a) => a.id === d.fromId ? { ...a, xPct, yPct } : a));
      } else {
        actualizar((prev) => [...prev, {
          id: `p${ID_SEQ++}`, foodKey: d.foodKey, macroKey: d.macroKey, xPct, yPct,
        }]);
      }
    } else if (d.fromId) {
      actualizar((prev) => prev.filter((a) => a.id !== d.fromId)); // sacado del plato → quitar
    }
  }, [actualizar]);

  // Listeners globales mientras hay un arrastre activo.
  const isDragging = drag !== null;
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => {
      if (dragRef.current) setDragBoth({ ...dragRef.current, x: e.clientX, y: e.clientY });
    };
    const onUp = (e: PointerEvent) => finalizarDrag(e);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [isDragging, finalizarDrag]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  const macrosConAlimento = new Set(puestos.map((a) => a.macroKey));
  const completo = PLATO_MACROS.every((m) => macrosConAlimento.has(m.key));
  const foodByKey = (macroKey: string, foodKey: string) =>
    platoMacroByKey(macroKey)?.alimentos.find((f) => f.key === foodKey);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif"
         sx={drag ? { userSelect: "none", touchAction: "none" } : undefined}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="Crea el plato de Harvard"
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: "← El hambre", onClick: () => navigate("/metodo/nutricion/hambre") }}
              extra={{ label: "Biblioteca", onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{
                label: "Tus calorías →",
                onClick: () => navigate("/metodo/nutricion/calorias"),
                disabled: !completo,
                disabledTooltip: "Crea tu plato (un alimento de cada grupo) para continuar",
              }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Pulsa cada parte del plato para ver sus alimentos y arrástralos encima. Construye un plato equilibrado
              con algo de cada grupo.
            </Text>
          </Reveal>

          <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

            {/* ── Plato (círculo con sectores) ── */}
            <SeccionBox flex={{ base: "none", md: "1" }} w="100%">
              <Flex direction="column" align="center" gap={4} p={{ base: 5, md: 7 }} h="100%">
                <Box ref={plateRef} position="relative" w="100%" maxW="380px" aspectRatio={1} mx="auto">
                  <Box as="svg" viewBox={`0 0 ${VB} ${VB}`} w="100%" h="100%"
                       style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.32))" }}>
                    <defs>
                      {/* Ala de porcelana con un ligero degradado radial para dar volumen. */}
                      <radialGradient id="platoRim" cx="50%" cy="40%" r="62%">
                        <stop offset="0%" stopColor="#fdfaf1" />
                        <stop offset="78%" stopColor="#f2ebd8" />
                        <stop offset="100%" stopColor="#e6dcc4" />
                      </radialGradient>
                      {/* Cúpula: brillo arriba-izq. y sombra abajo-der. sobre los sectores. */}
                      <radialGradient id="platoDome" cx="34%" cy="26%" r="80%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.30" />
                        <stop offset="46%" stopColor="#ffffff" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.14" />
                      </radialGradient>
                      {/* Reflejo especular de porcelana. */}
                      <radialGradient id="platoGloss" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Ala del plato (porcelana) */}
                    <circle cx={CX} cy={CY} r={R_PLATE} fill="url(#platoRim)" stroke="#ffffff" strokeWidth={1.5} />
                    <circle cx={CX} cy={CY} r={R_PLATE} fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth={1} />

                    {/* Sectores (el hueco central) */}
                    {SECTORES.map(({ macro: m, d }) => {
                      const activo = m.key === macroSel;
                      return (
                        <path key={m.key} d={d} fill={m.color} fillOpacity={activo ? 1 : 0.6}
                              stroke="#fffdf7" strokeWidth={activo ? 2.5 : 1.25} strokeLinejoin="round"
                              style={{ cursor: "pointer", transition: "fill-opacity 0.2s" }}
                              onClick={() => setMacroSel(m.key)} />
                      );
                    })}

                    {/* Cúpula (volumen 3D) sobre los sectores */}
                    <circle cx={CX} cy={CY} r={R_FOOD} fill="url(#platoDome)" pointerEvents="none" />

                    {/* Aro que separa el ala del hueco central */}
                    <circle cx={CX} cy={CY} r={R_RIM} fill="none" stroke="#fffdf7" strokeWidth={3} opacity={0.95} pointerEvents="none" />
                    <circle cx={CX} cy={CY} r={R_RIM} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={1} pointerEvents="none" />

                    {/* Etiquetas de cada sector (nombre + %), encima de la cúpula */}
                    {SECTORES.map(({ macro: m, label, pct }) => {
                      const activo = m.key === macroSel;
                      return (
                        <g key={`lbl-${m.key}`} pointerEvents="none">
                          <text x={label.x} y={label.y - 3} textAnchor="middle" dominantBaseline="middle"
                                fontSize={activo ? 9.5 : 8.5} fontWeight="800" fill="#fffdf7"
                                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55)" }}>
                            {m.labelCorto}
                          </text>
                          <text x={label.x} y={label.y + 7.5} textAnchor="middle" dominantBaseline="middle"
                                fontSize="6.5" fontWeight="700" fill="#fffdf7" fillOpacity={0.92}
                                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                            {pct}%
                          </text>
                        </g>
                      );
                    })}

                    {/* Reflejo especular arriba-izquierda del ala */}
                    <ellipse cx="72" cy="58" rx="30" ry="16" fill="url(#platoGloss)" pointerEvents="none"
                             transform="rotate(-20 72 58)" />
                  </Box>

                  {/* Alimentos colocados sobre el plato */}
                  {puestos.map((a) => {
                    const food = foodByKey(a.macroKey, a.foodKey);
                    const color = platoMacroByKey(a.macroKey)?.color ?? nutricionTxt;
                    if (!food) return null;
                    return (
                      <Flex key={a.id}
                            position="absolute" left={`${a.xPct * 100}%`} top={`${a.yPct * 100}%`}
                            align="center" justify="center"
                            w={{ base: `${RADIO_ALIMENTO}px`, md: `${RADIO_ALIMENTO + 8}px` }}
                            h={{ base: `${RADIO_ALIMENTO}px`, md: `${RADIO_ALIMENTO + 8}px` }}
                            borderRadius="full" bg="#fffdf7" overflow="hidden"
                            border={`2px solid ${color}`}
                            boxShadow={`0 3px 10px rgba(0,0,0,0.32), 0 0 0 3px ${color}33, inset 0 1px 3px rgba(255,255,255,0.6)`}
                            transform="translate(-50%, -50%)"
                            cursor="grab" zIndex={2}
                            sx={{ touchAction: "none" }}
                            onPointerDown={(e) => startDrag(e, {
                              food, macroKey: a.macroKey, color, fromId: a.id,
                            })}>
                        <AlimentoContenido food={food} />
                      </Flex>
                    );
                  })}
                </Box>

                {/* Progreso: un punto por macro, relleno cuando tiene algún alimento */}
                <Flex align="center" gap={2.5} wrap="wrap" justify="center">
                  {PLATO_MACROS.map((m) => {
                    const ok = macrosConAlimento.has(m.key);
                    return (
                      <Flex key={m.key} align="center" gap={1.5}>
                        <Box w="12px" h="12px" borderRadius="full"
                             bg={ok ? m.color : "transparent"}
                             border={`2px solid ${m.color}`} />
                        <Text color={nutricionTxt} fontSize="xs" fontWeight={ok ? "700" : "500"}>
                          {m.labelCorto}
                        </Text>
                      </Flex>
                    );
                  })}
                </Flex>

                {completo && (
                  <Float amplitude={4} duration={2.8}>
                    <Text color={nutricionTxt} fontWeight="800" fontSize={{ base: "md", md: "lg" }} textAlign="center">
                      ¡Plato equilibrado! 🎉 Tienes algo de cada grupo.
                    </Text>
                  </Float>
                )}

                {puestos.length > 0 && (
                  <Box as="button" onClick={() => actualizar(() => [])}
                       alignSelf="center" px={4} py={1.5} borderRadius="full"
                       bg={`${nutricionTxt}14`} border={`1px solid ${nutricionTxt}44`}
                       color={nutricionTxt} fontSize="sm" fontWeight="600" cursor="pointer"
                       _hover={{ bg: `${nutricionTxt}22` }}>
                    Vaciar plato
                  </Box>
                )}
              </Flex>
            </SeccionBox>

            {/* ── Panel de alimentos del macro seleccionado ── */}
            <SeccionBox flex={{ base: "none", md: "1" }} w="100%">
              <Flex direction="column" gap={4} p={{ base: 5, md: 7 }} h="100%">
                <Box>
                  <Flex align="center" gap={2.5} mb={1}>
                    <Box w="14px" h="14px" borderRadius="full" bg={macro.color} flexShrink={0} />
                    <Text color={nutricionTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="800">
                      {macro.label}
                    </Text>
                  </Flex>
                  <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
                    {macro.descripcion}
                  </Text>
                </Box>

                <Box h="1px" bgGradient={`linear(to-r, transparent, ${nutricionTxt}55, transparent)`} />

                <Text color={`${nutricionTxt}cc`} fontSize="xs" fontWeight="700" letterSpacing="0.08em"
                      textTransform="uppercase">
                  Arrastra estos alimentos al plato
                </Text>

                {/* Los alimentos del macro entran UNO A UNO (cascada). La `key`
                    con el macro reinicia la animación al cambiar de sector, así
                    cada grupo se va cargando pieza a pieza (da más emoción). */}
                <RevealStagger key={macroSel} stagger={0.09} delayChildren={0.05}
                               display="flex" flexWrap="wrap" gap={{ base: 4, md: 5 }} justifyContent="center">
                  {macro.alimentos.map((food) => (
                    <RevealItem key={food.key} direction="up" distance={14} scaleFrom={0.5} duration={0.5}
                                display="flex" flexDirection="column" alignItems="center" gap={1.5} w="72px">
                      <Flex align="center" justify="center" overflow="hidden"
                            w={{ base: "52px", md: "58px" }} h={{ base: "52px", md: "58px" }}
                            borderRadius="full" bg="#fffdf7"
                            border={`2px solid ${macro.color}`}
                            boxShadow={`0 3px 12px rgba(0,0,0,0.22), 0 0 0 4px ${macro.color}22, inset 0 1px 3px rgba(255,255,255,0.6)`}
                            cursor="grab" sx={{ touchAction: "none" }}
                            transition="transform 0.15s, box-shadow 0.15s"
                            _hover={{ transform: "translateY(-3px)",
                                      boxShadow: `0 6px 16px rgba(0,0,0,0.28), 0 0 0 5px ${macro.color}33, inset 0 1px 3px rgba(255,255,255,0.6)` }}
                            _active={{ transform: "translateY(-1px)" }}
                            onPointerDown={(e) => startDrag(e, { food, macroKey: macro.key, color: macro.color })}>
                        <AlimentoContenido food={food} big />
                      </Flex>
                      <Text color={nutricionTxt} fontSize="xs" fontWeight="600" textAlign="center" lineHeight="1.2">
                        {food.label}
                      </Text>
                    </RevealItem>
                  ))}
                </RevealStagger>
              </Flex>
            </SeccionBox>
          </Flex>
        </Flex>
      </Flex>

      {/* Fantasma que sigue al puntero mientras se arrastra. */}
      {drag && (
        <Flex position="fixed" left={`${drag.x}px`} top={`${drag.y}px`} zIndex={3000}
              align="center" justify="center" overflow="hidden"
              w={{ base: "56px", md: "62px" }} h={{ base: "56px", md: "62px" }}
              borderRadius="full" bg="#fffdf7" border={`2px solid ${drag.color}`}
              boxShadow={`0 10px 24px rgba(0,0,0,0.42), 0 0 0 4px ${drag.color}44, inset 0 1px 3px rgba(255,255,255,0.6)`}
              transform="translate(-50%, -50%) scale(1.08)" pointerEvents="none"
              sx={{ opacity: 0.97 }}>
          <AlimentoContenido food={{ emoji: drag.emoji, foto: drag.foto, label: "" }} big />
        </Flex>
      )}

      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
