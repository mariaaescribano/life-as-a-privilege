import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal } from "../../components/global/Reveal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import {
  ALIMENTOS_DIA, GRUPOS_DIA, grupoDiaColor, grupoDiaFondo, alimentoDiaByKey, infoAlimento,
  REPARTO_COMIDAS, NUM_COMIDAS_OPCIONES, MACRO_COLOR, type GrupoDia,
} from "../../hardCoded/espacio/DiaSaludable";

// ═════════════════════════════════════════════════════════════════════════
// Actividad «Diseña tu día» (recorrido de Nutrición).
//   · Solo se desbloquea cuando la usuaria ya tiene su objetivo de calorías
//     (calculado y guardado en /metodo/nutricion/calorias).
//   · Popup: ¿cuántas comidas haces al día? (3/4/5). Repartimos las calorías del
//     día entre esas comidas de forma equilibrada (REPARTO_COMIDAS).
//   · Se arrastran alimentos desde la paleta a cada comida. Cada alimento entra
//     con una RACIÓN real: gramos + cómo medirla A OJO (un puño, la palma…).
//   · Se ve, en cada comida y en el día, cuánta energía llevas frente a tu meta.
// Objetivo: consciencia — aprender cuánto y cómo comer, no contar obsesivo.
// El drag usa pointer events (ratón y dedo por igual) + hit-test de las tarjetas.
// ═════════════════════════════════════════════════════════════════════════

interface PlacedFood {
  id: string;
  key: string;        // clave del alimento (ALIMENTOS_DIA)
  porciones: number;  // multiplicador de la ración (pasos de 0.5)
}
type Placed = Record<string, PlacedFood[]>; // por clave de comida

interface DragState { key: string; x: number; y: number; }

let ID_SEQ = 1;
const nid = () => `f${ID_SEQ++}`;

// kcal de una ración colocada.
const kcalDe = (f: PlacedFood): number => {
  const a = alimentoDiaByKey(f.key);
  if (!a) return 0;
  return (a.kcal100 * a.porcionG * f.porciones) / 100;
};
const gramosDe = (f: PlacedFood): number => {
  const a = alimentoDiaByKey(f.key);
  return a ? Math.round(a.porcionG * f.porciones) : 0;
};

// Foto redonda del alimento (o emoji si aún no hay foto).
function AlimentoFoto({ foodKey, size }: { foodKey: string; size: string | Record<string, string> }) {
  const info = infoAlimento(foodKey);
  return (
    <Box w={size} h={size} borderRadius="full" overflow="hidden" flexShrink={0}
         bg="rgba(255,255,255,0.1)" display="flex" alignItems="center" justifyContent="center"
         border="1px solid rgba(255,255,255,0.25)">
      {info?.foto
        ? <Box as="img" src={encodeURI(info.foto)} alt={info.nombre} w="100%" h="100%"
               style={{ objectFit: "cover" }} draggable={false} pointerEvents="none" />
        : <Box as="span" fontSize="lg" lineHeight="1" pointerEvents="none">{info?.emoji ?? "🍽️"}</Box>}
    </Box>
  );
}

// Barra fina de macros (carb/proteína/grasa) a partir de los alimentos de una comida.
function MacroBarra({ foods }: { foods: PlacedFood[] }) {
  const tot = useMemo(() => {
    const acc = { carbohidrato: 0, proteina: 0, grasa: 0 };
    foods.forEach((f) => {
      const info = infoAlimento(f.key);
      const kcal = kcalDe(f);
      if (!info || kcal <= 0) return;
      acc.carbohidrato += kcal * info.macros.carbohidrato / 100;
      acc.proteina += kcal * info.macros.proteina / 100;
      acc.grasa += kcal * info.macros.grasa / 100;
    });
    const s = acc.carbohidrato + acc.proteina + acc.grasa;
    return s > 0 ? { c: acc.carbohidrato / s, p: acc.proteina / s, g: acc.grasa / s } : null;
  }, [foods]);
  if (!tot) return null;
  return (
    <Flex h="6px" borderRadius="full" overflow="hidden" mt={2} bg="rgba(0,0,0,0.25)">
      <Box w={`${tot.c * 100}%`} bg={MACRO_COLOR.carbohidrato} />
      <Box w={`${tot.p * 100}%`} bg={MACRO_COLOR.proteina} />
      <Box w={`${tot.g * 100}%`} bg={MACRO_COLOR.grasa} />
    </Flex>
  );
}

export default function MetodoNutricionDia() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [kcalObjetivo, setKcalObjetivo] = useState<number | null>(null);
  const [numComidas, setNumComidas] = useState<number | null>(null);
  const [placed, setPlaced] = useState<Placed>({});
  const [grupoSel, setGrupoSel] = useState<GrupoDia>(GRUPOS_DIA[0].key);
  const [modalOpen, setModalOpen] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [overMeal, setOverMeal] = useState<string | null>(null);

  const dataRef = useRef<Record<string, any>>({});
  const mealRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dragKeyRef = useRef<string | null>(null);

  // ── Carga: sesión + suscripción + objetivo de calorías + día guardado ──────
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
          const cal = dataRef.current?.calorias;
          if (cal?.hecho && typeof cal.kcal === "number") setKcalObjetivo(cal.kcal);
          const dia = dataRef.current?.dia;
          if (dia && typeof dia === "object") {
            const n = Number(dia.numComidas);
            if (REPARTO_COMIDAS[n]) {
              setNumComidas(n);
              const src = dia.comidas ?? {};
              const next: Placed = {};
              REPARTO_COMIDAS[n].forEach((c) => {
                const arr = Array.isArray(src[c.key]) ? src[c.key] : [];
                next[c.key] = arr
                  .filter((f: any) => f && alimentoDiaByKey(f.key))
                  .map((f: any) => ({ id: nid(), key: f.key, porciones: Number(f.porciones) > 0 ? Number(f.porciones) : 1 }));
              });
              setPlaced(next);
            }
          }
        } catch { /* sin fila todavía */ }
        // Precargamos fotos de alimentos + fondos de cada grupo para que ni la
        // paleta ni el fondo temático se rellenen de golpe.
        await precargarImagenes([
          ...ALIMENTOS_DIA.map((a) => infoAlimento(a.key)?.foto).filter(Boolean).map((f) => encodeURI(f as string)),
          ...GRUPOS_DIA.map((g) => encodeURI(grupoDiaFondo(g.key))),
        ]);
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // Abre el popup de nº de comidas si aún no se ha elegido (y hay objetivo).
  useEffect(() => {
    if (!loading && kcalObjetivo && numComidas == null) setModalOpen(true);
  }, [loading, kcalObjetivo, numComidas]);

  const comidasDef = numComidas ? REPARTO_COMIDAS[numComidas] : [];

  // ── Guardado (debounce) ────────────────────────────────────────────────────
  const guardar = useCallback((placedArg: Placed, numArg: number | null) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token || !numArg) return;
    const comidas: Record<string, { key: string; porciones: number }[]> = {};
    Object.entries(placedArg).forEach(([k, arr]) => {
      comidas[k] = arr.map((f) => ({ key: f.key, porciones: f.porciones }));
    });
    const data = { ...dataRef.current, dia: { numComidas: numArg, comidas } };
    dataRef.current = data;
    axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
      { headers: { Authorization: `Bearer ${token}` } }).catch(() => { /* reintenta al próximo cambio */ });
  }, []);

  const setPlacedYGuardar = useCallback((updater: (prev: Placed) => Placed) => {
    setPlaced((prev) => {
      const next = updater(prev);
      guardar(next, numComidas);
      return next;
    });
  }, [guardar, numComidas]);

  // Elige (o cambia) el nº de comidas: conserva lo que encaje en las comidas nuevas.
  const elegirComidas = useCallback((n: number) => {
    setNumComidas(n);
    setPlaced((prev) => {
      const next: Placed = {};
      REPARTO_COMIDAS[n].forEach((c) => { next[c.key] = prev[c.key] ?? []; });
      guardar(next, n);
      return next;
    });
    setModalOpen(false);
  }, [guardar]);

  // ── Añadir / ajustar / quitar alimentos ────────────────────────────────────
  const addFood = useCallback((mealKey: string, foodKey: string) => {
    setPlacedYGuardar((prev) => {
      const arr = prev[mealKey] ?? [];
      const existente = arr.find((f) => f.key === foodKey);
      const nuevo = existente
        ? arr.map((f) => f.id === existente.id ? { ...f, porciones: f.porciones + 1 } : f)
        : [...arr, { id: nid(), key: foodKey, porciones: 1 }];
      return { ...prev, [mealKey]: nuevo };
    });
  }, [setPlacedYGuardar]);

  const cambiaPorciones = useCallback((mealKey: string, id: string, delta: number) => {
    setPlacedYGuardar((prev) => {
      const arr = (prev[mealKey] ?? []).map((f) =>
        f.id === id ? { ...f, porciones: Math.round((f.porciones + delta) * 2) / 2 } : f,
      ).filter((f) => f.porciones > 0);
      return { ...prev, [mealKey]: arr };
    });
  }, [setPlacedYGuardar]);

  const quitar = useCallback((mealKey: string, id: string) => {
    setPlacedYGuardar((prev) => ({ ...prev, [mealKey]: (prev[mealKey] ?? []).filter((f) => f.id !== id) }));
  }, [setPlacedYGuardar]);

  // ── Drag (pointer events + hit-test de las tarjetas de comida) ──────────────
  const mealBajoPuntero = (x: number, y: number): string | null => {
    for (const c of comidasDef) {
      const el = mealRefs.current[c.key];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return c.key;
    }
    return null;
  };

  const onFoodPointerDown = (foodKey: string) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragKeyRef.current = foodKey;
    setDrag({ key: foodKey, x: e.clientX, y: e.clientY });
  };
  const onFoodPointerMove = (e: React.PointerEvent) => {
    if (!dragKeyRef.current) return;
    setDrag({ key: dragKeyRef.current, x: e.clientX, y: e.clientY });
    setOverMeal(mealBajoPuntero(e.clientX, e.clientY));
  };
  const onFoodPointerUp = (e: React.PointerEvent) => {
    const foodKey = dragKeyRef.current;
    dragKeyRef.current = null;
    setDrag(null);
    setOverMeal(null);
    if (!foodKey) return;
    const meal = mealBajoPuntero(e.clientX, e.clientY);
    if (meal) addFood(meal, foodKey);
  };

  // ── Totales ────────────────────────────────────────────────────────────────
  const totalDia = useMemo(
    () => Object.values(placed).flat().reduce((s, f) => s + kcalDe(f), 0),
    [placed],
  );
  const kcalComida = (mealKey: string) => (placed[mealKey] ?? []).reduce((s, f) => s + kcalDe(f), 0);
  const targetComida = (pct: number) => Math.round((kcalObjetivo ?? 0) * pct / 100);

  const alimentosGrupo = ALIMENTOS_DIA.filter((a) => a.grupo === grupoSel);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  const bloqueada = !kcalObjetivo;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif"
         sx={{ touchAction: drag ? "none" : undefined }}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="Diseña tu día"
              compact
              maxW="1100px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: "← Tus calorías", onClick: () => navigate("/metodo/nutricion/calorias") }}
              extra={{ label: "Biblioteca", onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: "Preguntas y mitos →", onClick: () => navigate("/metodo/nutricion/mitos") }}
            />
          </Reveal>

          {/* ── BLOQUEADA: aún no tiene sus calorías ── */}
          {bloqueada ? (
            <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
              <Box w="100%" maxW="620px" borderRadius="2xl" px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}
                   textAlign="center" bg={`${nutricionBg}66`} border={`1px solid ${nutricionTxt}55`}
                   style={{ boxShadow: `inset 0 0 26px rgba(0,0,0,0.2), 0 0 18px ${nutricionTxt}18` }}>
                <Text fontSize={{ base: "3xl", md: "4xl" }} mb={2}>🔒</Text>
                <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight={700}
                      style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
                  Primero, tus calorías
                </Text>
                <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" mt={3} mb={6}>
                  Para diseñar tu día necesitamos saber cuánta energía necesitas. Calcula tu objetivo
                  y vuelve: repartiremos esas calorías entre tus comidas.
                </Text>
                <Box as="button" onClick={() => navigate("/metodo/nutricion/calorias")}
                     px={7} py={3} borderRadius="full" fontWeight={700} fontStyle="italic"
                     color={nutricionBg} bg={nutricionTxt} cursor="pointer"
                     transition="all 0.15s ease" _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 20px ${nutricionTxt}88` }}>
                  Calcular mis calorías →
                </Box>
              </Box>
            </Reveal>
          ) : (
            <>
              {/* Intro + resumen del objetivo */}
              <Reveal direction="up" distance={18} delay={0.08} duration={0.6} w="100%" display="flex" justifyContent="center">
                <Flex direction="column" align="center" gap={2} maxW="720px">
                  <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                        textAlign="center" lineHeight="1.8" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
                    Aprender a comer no es contar: es saber <b>cuánto</b> y <b>cómo</b>. Reparte tus{" "}
                    <Text as="span" color={nutricionTxt} fontWeight={700}>{kcalObjetivo} kcal</Text>{" "}
                    del día entre tus comidas y arrastra alimentos a cada una. Fíjate en la ración y en cómo medirla a ojo.
                  </Text>
                  <Flex gap={3} wrap="wrap" justify="center" mt={1}>
                    <Box as="button" onClick={() => setModalOpen(true)}
                         px={4} py={2} borderRadius="full" fontSize="sm" fontWeight={600}
                         color="white" bg="rgba(255,255,255,0.08)" border={`1px solid ${nutricionTxt}66`}
                         cursor="pointer" _hover={{ bg: "rgba(255,255,255,0.16)" }}>
                      Cambiar nº de comidas ({numComidas})
                    </Box>
                  </Flex>
                </Flex>
              </Reveal>

              {/* ── COMIDAS (zonas de drop) ── */}
              <Reveal direction="up" distance={20} delay={0.12} duration={0.6} w="100%">
                <SimpleGrid columns={{ base: 1, md: numComidas && numComidas >= 4 ? 3 : Math.min(3, numComidas ?? 3) }}
                            spacing={{ base: 4, md: 5 }} w="100%">
                  {comidasDef.map((c) => {
                    const foods = placed[c.key] ?? [];
                    const kcal = Math.round(kcalComida(c.key));
                    const meta = targetComida(c.pct);
                    const ratio = meta > 0 ? kcal / meta : 0;
                    const estado = ratio < 0.85 ? nutricionTxt : ratio <= 1.1 ? "#7ac77a" : "#e0a03c";
                    const activo = overMeal === c.key;
                    return (
                      <Box key={c.key} ref={(el) => { mealRefs.current[c.key] = el; }}
                           borderRadius="2xl" px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}
                           bg={`${nutricionBg}${activo ? "88" : "55"}`}
                           border={`2px solid ${activo ? nutricionTxt : `${nutricionTxt}44`}`}
                           transition="all 0.15s ease"
                           style={{ boxShadow: activo ? `0 0 22px ${nutricionTxt}66` : `inset 0 0 20px rgba(0,0,0,0.18)` }}>
                        <Flex justify="space-between" align="baseline">
                          <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight={700}
                                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>{c.label}</Text>
                          <Text color={`${nutricionTxt}cc`} fontSize="xs" fontWeight={600}>{c.pct}%</Text>
                        </Flex>
                        <Flex align="baseline" gap={1.5} mt={0.5}>
                          <Text color={estado} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} lineHeight="1.1"
                                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>{kcal}</Text>
                          <Text color="rgba(255,255,255,0.65)" fontSize="sm">/ {meta} kcal</Text>
                        </Flex>
                        {/* barra de progreso hacia la meta */}
                        <Box h="6px" borderRadius="full" bg="rgba(0,0,0,0.28)" overflow="hidden" mt={2}>
                          <Box h="100%" bg={estado} transition="width 0.25s ease"
                               w={`${Math.min(100, ratio * 100)}%`} />
                        </Box>
                        <MacroBarra foods={foods} />

                        {/* alimentos de la comida */}
                        <Flex direction="column" gap={2} mt={4} minH="60px">
                          {foods.length === 0 && (
                            <Text color="rgba(255,255,255,0.45)" fontSize="sm" fontStyle="italic" textAlign="center" py={4}>
                              Arrastra alimentos aquí
                            </Text>
                          )}
                          {foods.map((f) => {
                            const a = alimentoDiaByKey(f.key)!;
                            const info = infoAlimento(f.key);
                            return (
                              <Flex key={f.id} align="center" gap={2.5} borderRadius="lg" p={2}
                                    bg="rgba(255,255,255,0.06)" border="1px solid rgba(255,255,255,0.1)">
                                <AlimentoFoto foodKey={f.key} size={{ base: "34px", md: "38px" }} />
                                <Box flex="1" minW={0}>
                                  <Text color="white" fontSize="sm" fontWeight={600} noOfLines={1}>
                                    {info?.nombre ?? f.key}
                                    {f.porciones !== 1 && <Text as="span" color={nutricionTxt}> ×{f.porciones}</Text>}
                                  </Text>
                                  <Text color="rgba(255,255,255,0.6)" fontSize="2xs" noOfLines={1}>
                                    {gramosDe(f)} g · {a.aOjo}
                                  </Text>
                                </Box>
                                <Text color="rgba(255,255,255,0.85)" fontSize="xs" fontWeight={600} whiteSpace="nowrap">
                                  {Math.round(kcalDe(f))} kcal
                                </Text>
                                <Flex align="center" gap={0.5}>
                                  <MiniBtn onClick={() => cambiaPorciones(c.key, f.id, -0.5)}>−</MiniBtn>
                                  <MiniBtn onClick={() => cambiaPorciones(c.key, f.id, +0.5)}>+</MiniBtn>
                                  <MiniBtn onClick={() => quitar(c.key, f.id)} danger>×</MiniBtn>
                                </Flex>
                              </Flex>
                            );
                          })}
                        </Flex>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </Reveal>

              {/* ── TOTAL DEL DÍA ── */}
              <Reveal direction="up" distance={16} delay={0.05} duration={0.6} w="100%" display="flex" justifyContent="center">
                <Flex w="100%" maxW="720px" justify="center" align="baseline" gap={2.5} wrap="wrap"
                      borderRadius="xl" px={5} py={4} bg={`${nutricionBg}66`} border={`1px solid ${nutricionTxt}55`}>
                  <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }}>Tu día suma</Text>
                  <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} lineHeight="1"
                        style={{ textShadow: `0 0 18px ${nutricionTxt}55` }}>{Math.round(totalDia)}</Text>
                  <Text color="rgba(255,255,255,0.7)" fontSize={{ base: "sm", md: "md" }}>de {kcalObjetivo} kcal</Text>
                  <Text color={nutricionTxt} fontSize="sm" fontStyle="italic">
                    ({totalDia > kcalObjetivo ? "+" : ""}{Math.round(totalDia - kcalObjetivo)})
                  </Text>
                </Flex>
              </Reveal>

              {/* ── PALETA DE ALIMENTOS (arrastrables) ── */}
              <Reveal direction="up" distance={20} delay={0.05} duration={0.6} w="100%">
                <Box position="relative" overflow="hidden" w="100%" borderRadius="2xl"
                     border={`1px solid ${nutricionTxt}44`}
                     style={{ boxShadow: `inset 0 0 26px rgba(0,0,0,0.2)` }}>
                  {/* Fondo temático según el grupo elegido (platoverduras, platofruta…) */}
                  <Box position="absolute" inset={0} backgroundImage={`url("${encodeURI(grupoDiaFondo(grupoSel))}")`}
                       backgroundSize="cover" backgroundPosition="center" transition="background-image 0.3s ease" />
                  <Box position="absolute" inset={0} bg={`${nutricionBg}cc`} />
                  <Box position="relative" zIndex={1} px={{ base: 4, md: 6 }} py={{ base: 5, md: 6 }}>
                  <Text color={nutricionTxt} fontSize="xs" fontWeight={700} letterSpacing="0.14em"
                        textTransform="uppercase" mb={3}
                        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
                    Elige buenos alimentos · arrástralos a cada comida
                  </Text>
                  {/* tabs de grupos */}
                  <Flex gap={2} wrap="wrap" mb={4}>
                    {GRUPOS_DIA.map((g) => {
                      const on = grupoSel === g.key;
                      return (
                        <Box key={g.key} as="button" onClick={() => setGrupoSel(g.key)}
                             px={3.5} py={1.5} borderRadius="full" fontSize="sm" fontWeight={600} whiteSpace="nowrap"
                             color={on ? nutricionBg : "white"} bg={on ? g.color : "rgba(255,255,255,0.06)"}
                             border={`1px solid ${on ? g.color : `${g.color}66`}`} cursor="pointer"
                             transition="all 0.15s ease" _hover={on ? undefined : { bg: "rgba(255,255,255,0.14)" }}
                             style={{ textShadow: on ? "none" : "0 1px 4px rgba(0,0,0,0.5)" }}>
                          {g.label}
                        </Box>
                      );
                    })}
                  </Flex>
                  {/* alimentos del grupo */}
                  <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={{ base: 3, md: 4 }}>
                    {alimentosGrupo.map((a) => {
                      const info = infoAlimento(a.key);
                      const arrastrando = drag?.key === a.key;
                      return (
                        <Flex key={a.key} direction="column" align="center" gap={1} borderRadius="xl" p={2.5}
                              bg="rgba(255,255,255,0.05)" border={`1px solid ${grupoDiaColor(a.grupo)}44`}
                              opacity={arrastrando ? 0.4 : 1} cursor="grab"
                              onPointerDown={onFoodPointerDown(a.key)}
                              onPointerMove={onFoodPointerMove}
                              onPointerUp={onFoodPointerUp}
                              sx={{ touchAction: "none", userSelect: "none", WebkitTapHighlightColor: "transparent" }}
                              _hover={{ borderColor: grupoDiaColor(a.grupo), bg: "rgba(255,255,255,0.1)" }}
                              transition="border-color 0.15s ease, background 0.15s ease">
                          <AlimentoFoto foodKey={a.key} size={{ base: "48px", md: "56px" }} />
                          <Text color="white" fontSize="sm" fontWeight={600} textAlign="center" noOfLines={1}>
                            {info?.nombre ?? a.key}
                          </Text>
                          <Text color="rgba(255,255,255,0.6)" fontSize="2xs" textAlign="center" lineHeight="1.25" noOfLines={2}>
                            {a.porcionG} g · {a.aOjo}
                          </Text>
                          <Text color={grupoDiaColor(a.grupo)} fontSize="2xs" fontWeight={700}>
                            {Math.round(a.kcal100 * a.porcionG / 100)} kcal
                          </Text>
                        </Flex>
                      );
                    })}
                  </SimpleGrid>
                  </Box>
                </Box>
              </Reveal>

              {/* Nota educativa: medir a ojo */}
              <Reveal direction="up" distance={14} delay={0.05} duration={0.6} w="100%" display="flex" justifyContent="center">
                <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="700px" lineHeight="1.7">
                  Tu mano es tu báscula: un puño ≈ una ración de fruta o cereal cocido · la palma ≈ tu proteína ·
                  el pulgar ≈ una cucharada de grasa · dos manos ahuecadas ≈ tus verduras. Aprende a mirar el plato,
                  no la báscula. Esto es orientativo y educativo; no sustituye a un profesional.
                </Text>
              </Reveal>
            </>
          )}
        </Flex>
      </Flex>

      {/* Ghost que sigue al dedo/ratón mientras arrastras */}
      {drag && (
        <Box position="fixed" left={`${drag.x}px`} top={`${drag.y}px`} zIndex={4000} pointerEvents="none"
             transform="translate(-50%, -50%) scale(1.1)"
             style={{ filter: `drop-shadow(0 6px 14px rgba(0,0,0,0.5))` }}>
          <AlimentoFoto foodKey={drag.key} size={{ base: "56px", md: "64px" }} />
        </Box>
      )}

      {/* ── POPUP: ¿cuántas comidas haces al día? ── */}
      {modalOpen && kcalObjetivo && (
        <Flex position="fixed" inset={0} zIndex={5000} align="center" justify="center" px={4}
              bg="rgba(0,0,0,0.6)" onClick={() => numComidas != null && setModalOpen(false)}>
          <Box onClick={(e) => e.stopPropagation()} w="100%" maxW="560px" borderRadius="2xl"
               px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }} bg="#0a5c5c"
               border={`1px solid ${nutricionTxt}66`} style={{ boxShadow: `0 0 40px ${nutricionTxt}44` }}>
            <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight={700} textAlign="center"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
              ¿Cuántas comidas haces al día?
            </Text>
            <Text color="rgba(255,255,255,0.75)" fontSize="sm" textAlign="center" mt={2} mb={5} lineHeight="1.6">
              Repartiremos tus {kcalObjetivo} kcal entre esas comidas de forma equilibrada. Puedes cambiarlo cuando quieras.
            </Text>
            <Flex direction="column" gap={3}>
              {NUM_COMIDAS_OPCIONES.map((n) => {
                const on = numComidas === n;
                return (
                  <Box key={n} as="button" onClick={() => elegirComidas(n)}
                       textAlign="left" borderRadius="xl" px={4} py={3.5}
                       bg={on ? `${nutricionTxt}` : "rgba(255,255,255,0.06)"}
                       border={`1px solid ${on ? nutricionTxt : `${nutricionTxt}55`}`}
                       cursor="pointer" transition="all 0.15s ease"
                       _hover={on ? undefined : { bg: "rgba(255,255,255,0.14)", borderColor: nutricionTxt }}>
                    <Text color={on ? nutricionBg : "white"} fontSize="md" fontWeight={700}>
                      {n} comidas
                    </Text>
                    <Flex gap={2} wrap="wrap" mt={1.5}>
                      {REPARTO_COMIDAS[n].map((c) => (
                        <Text key={c.key} fontSize="2xs" fontWeight={600}
                              color={on ? nutricionBg : "rgba(255,255,255,0.7)"}>
                          {c.label} {Math.round(kcalObjetivo * c.pct / 100)} kcal
                        </Text>
                      ))}
                    </Flex>
                  </Box>
                );
              })}
            </Flex>
          </Box>
        </Flex>
      )}

      <IndiceNutricion />
      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}

// Botón minúsculo redondo (± y quitar) en cada alimento de la comida.
function MiniBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <Box as="button" onClick={onClick} w="24px" h="24px" borderRadius="full" flexShrink={0}
         display="flex" alignItems="center" justifyContent="center" fontSize="md" fontWeight={700} lineHeight="1"
         color={danger ? "#f0a0a0" : "white"} bg="rgba(255,255,255,0.1)"
         border={`1px solid ${danger ? "#f0a0a055" : "rgba(255,255,255,0.25)"}`}
         cursor="pointer" transition="all 0.12s ease"
         _hover={{ bg: danger ? "#f0a0a033" : "rgba(255,255,255,0.22)" }}
         sx={{ touchAction: "manipulation", userSelect: "none", WebkitTapHighlightColor: "transparent" }}>
      {children}
    </Box>
  );
}
