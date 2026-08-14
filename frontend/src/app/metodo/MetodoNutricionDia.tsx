import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextoRico, useT } from "../../i18n";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal } from "../../components/global/Reveal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { glowHeader } from "../../components/metodo/FotoBox";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import {
  grupoDiaColor, grupoDiaFondo, NUM_COMIDAS_OPCIONES, MACRO_COLOR, type GrupoDia,
} from "../../hardCoded/espacio/DiaSaludable";
import {
  useAlimentosDia, useAlimentoDiaByKey, useGruposDia, useRepartoComidas,
} from "../../hardCoded/espacio/useDiaSaludable";
import { type AlimentoMolecula } from "../../hardCoded/espacio/AlimentosNutricion";
import { useMoleculas, useEtiquetasAlimentos, useAlimentos } from "../../hardCoded/espacio/useAlimentos";

// ═════════════════════════════════════════════════════════════════════════
// Actividad «Diseña tu día» (recorrido de Nutrición). Dos columnas:
//   · Izquierda: tus comidas (zonas de drop) con scroll propio.
//   · Derecha (más grande): elegir alimentos, 2 por fila, con scroll propio.
// Al inicio de cada grupo hay una tarjeta «Crea tu alimento» (las veces que
// quiera). Cada alimento tiene un botón de ojo que abre su ficha (ración, kcal,
// macros y de qué está hecho). Se arrastran alimentos a cada comida.
// El drag usa pointer events (ratón y dedo por igual) + hit-test de las tarjetas.
// ═════════════════════════════════════════════════════════════════════════

interface PlacedFood {
  id: string;
  key: string;        // clave del alimento (ALIMENTOS_DIA o custom-*)
  porciones: number;  // multiplicador de la ración (pasos de 0.5)
}
type Placed = Record<string, PlacedFood[]>; // por clave de comida

// Alimento que crea la propia usuaria. Se guarda junto al día.
interface CustomFoodDia {
  key: string;        // "custom-<n>"
  grupo: GrupoDia;
  nombre: string;
  kcalRacion: number; // kcal de UNA ración
  porcionG: number;
  aOjo: string;
  macros: { carbohidrato: number; proteina: number; grasa: number };
}

// Forma unificada de un alimento (de la biblioteca o creado por la usuaria).
interface FoodInfo {
  key: string;
  nombre: string;
  emoji?: string;
  foto?: string;
  grupo: GrupoDia;
  kcalRacion: number;
  porcionG: number;
  aOjo: string;
  macros: { carbohidrato: number; proteina: number; grasa: number };
  moleculas?: (string | AlimentoMolecula)[];
  descripcion?: string;
  custom?: boolean;
}

interface DragState { key: string; x: number; y: number; }

let ID_SEQ = 1;
const nid = () => `f${ID_SEQ++}`;
let CUSTOM_SEQ = 1;

const scrollSx = {
  "&::-webkit-scrollbar": { width: "7px" },
  "&::-webkit-scrollbar-thumb": { background: `${nutricionTxt}44`, borderRadius: "4px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  scrollbarWidth: "thin" as const,
  scrollbarColor: `${nutricionTxt}44 transparent`,
};

// Foto redonda del alimento (o emoji si aún no hay foto / es creado).
function AlimentoFoto({ info, size }: { info?: Pick<FoodInfo, "foto" | "emoji" | "nombre">; size: string | Record<string, string> }) {
  return (
    <Box w={size} h={size} borderRadius="full" overflow="hidden" flexShrink={0}
         bg={`${nutricionTxt}12`} display="flex" alignItems="center" justifyContent="center"
         border={`1px solid ${nutricionTxt}22`}>
      {info?.foto
        ? <Box as="img" src={encodeURI(info.foto)} alt={info.nombre} w="100%" h="100%"
               style={{ objectFit: "cover" }} draggable={false} pointerEvents="none" />
        : <Box as="span" fontSize="xl" lineHeight="1" pointerEvents="none">{info?.emoji ?? "🍽️"}</Box>}
    </Box>
  );
}

// Barra fina de macros a partir de un reparto ya calculado.
function MacroBarra({ seg }: { seg: { c: number; p: number; g: number } | null }) {
  if (!seg) return null;
  return (
    <Flex h="6px" borderRadius="full" overflow="hidden" mt={2} bg={`${nutricionTxt}22`}>
      <Box w={`${seg.c * 100}%`} bg={MACRO_COLOR.carbohidrato} />
      <Box w={`${seg.p * 100}%`} bg={MACRO_COLOR.proteina} />
      <Box w={`${seg.g * 100}%`} bg={MACRO_COLOR.grasa} />
    </Flex>
  );
}

export default function MetodoNutricionDia() {
  const t = useT();
  const navigate = useNavigate();
  // Todo el texto, en el idioma activo; las `key`, las kcal, los gramos y el
  // reparto de porcentajes siguen saliendo del español (es lo que se guarda).
  const moleculas = useMoleculas();
  const et = useEtiquetasAlimentos();
  const ALIMENTOS_DIA = useAlimentosDia();
  const GRUPOS_DIA = useGruposDia();
  const REPARTO_COMIDAS = useRepartoComidas();
  const alimentoDiaByKey = useAlimentoDiaByKey();
  const alimentos = useAlimentos();
  // Foto/nombre/macros salen de la biblioteca molecular (fuente única).
  const infoAlimento = useCallback((k: string) => alimentos.find((a) => a.key === k), [alimentos]);
  const [loading, setLoading] = useState(true);
  const [kcalObjetivo, setKcalObjetivo] = useState<number | null>(null);
  const [numComidas, setNumComidas] = useState<number | null>(null);
  const [placed, setPlaced] = useState<Placed>({});
  const [customFoods, setCustomFoods] = useState<CustomFoodDia[]>([]);
  const [grupoSel, setGrupoSel] = useState<GrupoDia>(GRUPOS_DIA[0].key);
  const [modalOpen, setModalOpen] = useState(false);
  const [crearOpen, setCrearOpen] = useState(false);
  const [infoKey, setInfoKey] = useState<string | null>(null); // ficha (ojo)
  const [drag, setDrag] = useState<DragState | null>(null);
  const [overMeal, setOverMeal] = useState<string | null>(null);

  // Formulario «crea tu alimento».
  const [fNombre, setFNombre] = useState("");
  const [fKcal, setFKcal] = useState("");
  const [fGramos, setFGramos] = useState("");
  const [fAOjo, setFAOjo] = useState("");
  const [fCarb, setFCarb] = useState("");
  const [fProt, setFProt] = useState("");
  const [fGrasa, setFGrasa] = useState("");

  const dataRef = useRef<Record<string, any>>({});
  const mealRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dragKeyRef = useRef<string | null>(null);
  const placedRef = useRef<Placed>({});
  const customRef = useRef<CustomFoodDia[]>([]);

  // ── Carga: sesión + suscripción + objetivo de calorías + día guardado ──────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const cal = dataRef.current?.calorias;
          if (cal?.hecho && typeof cal.kcal === "number") setKcalObjetivo(cal.kcal);
          const dia = dataRef.current?.dia;
          if (dia && typeof dia === "object") {
            // Alimentos creados por la usuaria.
            if (Array.isArray(dia.customFoods)) {
              const cf: CustomFoodDia[] = dia.customFoods
                .filter((c: any) => c && typeof c.key === "string" && typeof c.nombre === "string")
                .map((c: any) => ({
                  key: c.key, grupo: GRUPOS_DIA.some((g) => g.key === c.grupo) ? c.grupo : "capricho",
                  nombre: String(c.nombre), kcalRacion: Number(c.kcalRacion) || 0,
                  porcionG: Number(c.porcionG) > 0 ? Number(c.porcionG) : 100,
                  aOjo: typeof c.aOjo === "string" ? c.aOjo : t("metodo.dia.aTuMedida"),
                  macros: {
                    carbohidrato: Number(c.macros?.carbohidrato) || 0,
                    proteina: Number(c.macros?.proteina) || 0,
                    grasa: Number(c.macros?.grasa) || 0,
                  },
                }));
              cf.forEach((c) => { const n = Number(c.key.replace("custom-", "")); if (n >= CUSTOM_SEQ) CUSTOM_SEQ = n + 1; });
              setCustomFoods(cf); customRef.current = cf;
            }
            const n = Number(dia.numComidas);
            if (REPARTO_COMIDAS[n]) {
              setNumComidas(n);
              const src = dia.comidas ?? {};
              const next: Placed = {};
              REPARTO_COMIDAS[n].forEach((c) => {
                const arr = Array.isArray(src[c.key]) ? src[c.key] : [];
                next[c.key] = arr
                  .filter((f: any) => f && typeof f.key === "string")
                  .map((f: any) => ({ id: nid(), key: f.key, porciones: Number(f.porciones) > 0 ? Number(f.porciones) : 1 }));
              });
              setPlaced(next); placedRef.current = next;
            }
          }
        } catch { /* sin fila todavía */ }
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

  // ── Resolver: alimento (biblioteca o creado) → forma unificada ──────────────
  const resolveFood = useCallback((key: string): FoodInfo | undefined => {
    const cf = customFoods.find((c) => c.key === key);
    if (cf) return {
      key, nombre: cf.nombre, emoji: "🍽️", grupo: cf.grupo, kcalRacion: cf.kcalRacion,
      porcionG: cf.porcionG, aOjo: cf.aOjo, macros: cf.macros, custom: true,
    };
    const ad = alimentoDiaByKey(key);
    const info = infoAlimento(key);
    if (!ad || !info) return undefined;
    return {
      key, nombre: info.nombre, emoji: info.emoji, foto: info.foto, grupo: ad.grupo,
      kcalRacion: (ad.kcal100 * ad.porcionG) / 100, porcionG: ad.porcionG, aOjo: ad.aOjo,
      macros: info.macros, moleculas: info.moleculas, descripcion: info.descripcion ?? info.resumen,
    };
  }, [customFoods, alimentoDiaByKey, infoAlimento]);

  const kcalDe = useCallback((f: PlacedFood) => {
    const r = resolveFood(f.key); return r ? r.kcalRacion * f.porciones : 0;
  }, [resolveFood]);
  const gramosDe = useCallback((f: PlacedFood) => {
    const r = resolveFood(f.key); return r ? Math.round(r.porcionG * f.porciones) : 0;
  }, [resolveFood]);
  const macrosComida = useCallback((foods: PlacedFood[]) => {
    const acc = { carbohidrato: 0, proteina: 0, grasa: 0 };
    foods.forEach((f) => {
      const r = resolveFood(f.key); const kcal = kcalDe(f);
      if (!r || kcal <= 0) return;
      acc.carbohidrato += kcal * r.macros.carbohidrato / 100;
      acc.proteina += kcal * r.macros.proteina / 100;
      acc.grasa += kcal * r.macros.grasa / 100;
    });
    const s = acc.carbohidrato + acc.proteina + acc.grasa;
    return s > 0 ? { c: acc.carbohidrato / s, p: acc.proteina / s, g: acc.grasa / s } : null;
  }, [resolveFood, kcalDe]);

  // ── Guardado (día + comidas + alimentos creados) ────────────────────────────
  const guardar = useCallback((placedArg: Placed, numArg: number | null) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token || !numArg) return;
    const comidas: Record<string, { key: string; porciones: number }[]> = {};
    Object.entries(placedArg).forEach(([k, arr]) => {
      comidas[k] = arr.map((f) => ({ key: f.key, porciones: f.porciones }));
    });
    const data = { ...dataRef.current, dia: { numComidas: numArg, comidas, customFoods: customRef.current } };
    dataRef.current = data;
    axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
      { headers: { Authorization: `Bearer ${token}` } }).catch(() => { /* reintenta al próximo cambio */ });
  }, []);

  const setPlacedYGuardar = useCallback((updater: (prev: Placed) => Placed) => {
    setPlaced((prev) => {
      const next = updater(prev);
      placedRef.current = next;
      guardar(next, numComidas);
      return next;
    });
  }, [guardar, numComidas]);

  const elegirComidas = useCallback((n: number) => {
    setNumComidas(n);
    setPlaced((prev) => {
      const next: Placed = {};
      REPARTO_COMIDAS[n].forEach((c) => { next[c.key] = prev[c.key] ?? []; });
      placedRef.current = next;
      guardar(next, n);
      return next;
    });
    setModalOpen(false);
  }, [guardar]);

  // ── Crear alimento ──────────────────────────────────────────────────────────
  const abrirCrear = useCallback(() => {
    setFNombre(""); setFKcal(""); setFGramos(""); setFAOjo(""); setFCarb(""); setFProt(""); setFGrasa("");
    setCrearOpen(true);
  }, []);
  const crearAlimento = useCallback(() => {
    const kcal = Number(fKcal);
    if (!fNombre.trim() || !kcal || kcal <= 0) return;
    // Reparto de macros: si no se rellena nada, queda vacío (sin barra).
    const c = Number(fCarb) || 0, p = Number(fProt) || 0, g = Number(fGrasa) || 0;
    const suma = c + p + g;
    const macros = suma > 0
      ? { carbohidrato: Math.round(c / suma * 100), proteina: Math.round(p / suma * 100), grasa: Math.round(g / suma * 100) }
      : { carbohidrato: 0, proteina: 0, grasa: 0 };
    const cf: CustomFoodDia = {
      key: `custom-${CUSTOM_SEQ++}`, grupo: grupoSel, nombre: fNombre.trim(),
      kcalRacion: Math.round(kcal), porcionG: Number(fGramos) > 0 ? Number(fGramos) : 100,
      aOjo: fAOjo.trim() || "a tu medida", macros,
    };
    setCustomFoods((prev) => { const next = [...prev, cf]; customRef.current = next; return next; });
    guardar(placedRef.current, numComidas);
    setCrearOpen(false);
  }, [fNombre, fKcal, fGramos, fAOjo, fCarb, fProt, fGrasa, grupoSel, guardar, numComidas]);

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
    [placed, kcalDe],
  );
  const kcalComida = (mealKey: string) => (placed[mealKey] ?? []).reduce((s, f) => s + kcalDe(f), 0);
  const targetComida = (pct: number) => Math.round((kcalObjetivo ?? 0) * pct / 100);

  const alimentosGrupo = ALIMENTOS_DIA.filter((a) => a.grupo === grupoSel);
  const customGrupo = customFoods.filter((c) => c.grupo === grupoSel);
  const grupoColor = grupoDiaColor(grupoSel);

  if (loading) return <NutricionLoading />;

  const bloqueada = !kcalObjetivo;
  const infoFood = infoKey ? resolveFood(infoKey) : undefined;

  // Tarjeta de un alimento en la paleta (arrastrable + ojo de ficha).
  const ChooserCard = (info: FoodInfo) => {
    const arrastrando = drag?.key === info.key;
    return (
      <Flex key={info.key} direction="column" align="center" gap={1.5} borderRadius="xl" p={3} position="relative"
            bg="#ffffffab" border={`1px solid ${grupoColor}55`}
            opacity={arrastrando ? 0.4 : 1} cursor="grab"
            onPointerDown={onFoodPointerDown(info.key)}
            onPointerMove={onFoodPointerMove}
            onPointerUp={onFoodPointerUp}
            sx={{ touchAction: "none", userSelect: "none", WebkitTapHighlightColor: "transparent" }}
            _hover={{ borderColor: grupoColor, bg: "#ffffffcc", transform: "translateY(-2px)" }}
            transition="all 0.15s ease">
        {/* Ojo → ficha del alimento */}
        <Box as="button" position="absolute" top="6px" right="6px" zIndex={2}
             onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
             onClick={(e: React.MouseEvent) => { e.stopPropagation(); setInfoKey(info.key); }}
             w="26px" h="26px" borderRadius="full" display="flex" alignItems="center" justifyContent="center"
             bg="#ffffffcc" border={`1px solid ${nutricionTxt}33`} color={nutricionTxt} cursor="pointer"
             _hover={{ bg: "#ffffff", borderColor: nutricionTxt }} title={t("metodo.dia.verFicha")}>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor">
            <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
          </Box>
        </Box>
        <AlimentoFoto info={info} size={{ base: "56px", md: "68px" }} />
        <Text color={nutricionTxt} fontSize="sm" fontWeight={700} textAlign="center" noOfLines={1}>
          {info.nombre}{info.custom && " ✎"}
        </Text>
        <Text color={`${nutricionTxt}99`} fontSize="2xs" textAlign="center" lineHeight="1.25" noOfLines={2}>
          {info.porcionG} g · {info.aOjo}
        </Text>
        <Text color={grupoColor} fontSize="2xs" fontWeight={700}>
          {Math.round(info.kcalRacion)} kcal
        </Text>
      </Flex>
    );
  };

  return (
    <Box minH="100vh" position="relative" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif"
         sx={{ touchAction: drag ? "none" : undefined }}>
      <SiteHeader variant="private" />

      <Flex flex="1" position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1200px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title={t("metodo.nutri.paso.dia")}
              // Header NORMAL, como el resto de Nutrición: sin `dense`/`compact`
              // (que lo dejaban bajito y con el título pequeño) y con el ancho
              // por defecto (850px), no estirado a los 1200 del contenido.
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: `← ${t("metodo.nutri.paso.azucar")}`, onClick: () => navigate("/metodo/nutricion/prediabetes") }}
              extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: `${t("metodo.nutri.paso.macros")} →`, onClick: () => navigate("/metodo/nutricion/macros") }}
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
                  {t("metodo.dia.primeroCalorias")}
                </Text>
                <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" mt={3} mb={6}>
                  {t("metodo.dia.primeroCaloriasTexto")}
                </Text>
                <Box as="button" onClick={() => navigate("/metodo/nutricion/calorias")}
                     px={7} py={3} borderRadius="full" fontWeight={700} fontStyle="italic"
                     color={nutricionBg} bg={nutricionTxt} cursor="pointer"
                     transition="all 0.15s ease" _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 20px ${nutricionTxt}88` }}>
                  {t("metodo.dia.calcular")}
                </Box>
              </Box>
            </Reveal>
          ) : (
            <>
              {/* Intro compacta */}
              <Reveal inView direction="up" distance={18} delay={0.08} duration={0.6} w="100%" display="flex" justifyContent="center">
                <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "lg", md: "2xl" }} fontStyle="italic"
                      textAlign="center" lineHeight="1.7" maxW="820px">
                  <TextoRico>{t("metodo.dia.repartePre")}</TextoRico>{" "}
                  <Text as="span" color={nutricionTxt} fontWeight={700}>{kcalObjetivo} kcal</Text>{" "}
                  {t("metodo.dia.repartePost")}
                </Text>
              </Reveal>

              {/* ── DOS COLUMNAS ── */}
              <Reveal inView direction="up" distance={20} delay={0.12} duration={0.6} w="100%">
                <Flex direction={{ base: "column", md: "row" }} align="stretch" gap={{ base: 5, md: 6 }} w="100%">

                  {/* ── IZQUIERDA · tus comidas (scroll propio) ── */}
                  <Box flex={{ md: "1" }} minW={0} position="relative" overflow="hidden" borderRadius="2xl"
                       border={`1px solid ${nutricionTxt}33`} style={{ boxShadow: `0 0 16px ${nutricionTxt}16` }}>
                    {/* Acuarela de Nutrición de fondo (claramente visible, velo suave) */}
                    <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}4d`} />
                    <Flex direction="column" gap={3} position="relative" zIndex={1} p={{ base: 3, md: 3.5 }}>
                    {/* Total del día + cambiar nº de comidas */}
                    <Flex justify="space-between" align="center" gap={3} wrap="wrap"
                          borderRadius="xl" px={4} py={3} bg="#ffffff40" border="1px solid #ffffff8c"
                          sx={{ backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}>
                      <Flex align="baseline" gap={2} wrap="wrap">
                        <Text color={`${nutricionTxt}cc`} fontSize="sm">{t("metodo.dia.tuDiaSuma")}</Text>
                        <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} lineHeight="1">
                          {Math.round(totalDia)}
                        </Text>
                        <Text color={`${nutricionTxt}aa`} fontSize="sm">de {kcalObjetivo} kcal</Text>
                        <Text color={nutricionTxt} fontSize="xs" fontStyle="italic">
                          ({totalDia > kcalObjetivo ? "+" : ""}{Math.round(totalDia - kcalObjetivo)})
                        </Text>
                      </Flex>
                      <Box as="button" onClick={() => setModalOpen(true)}
                           px={3.5} py={1.5} borderRadius="full" fontSize="xs" fontWeight={600}
                           color={nutricionTxt} bg={`${nutricionTxt}12`} border={`1px solid ${nutricionTxt}55`}
                           cursor="pointer" whiteSpace="nowrap" _hover={{ bg: `${nutricionTxt}22` }}>
                        Comidas: {numComidas} ⚙
                      </Box>
                    </Flex>

                    {/* Lista de comidas con scroll */}
                    <Flex direction="column" gap={4} overflowY={{ base: "visible", md: "auto" }}
                          maxH={{ base: "none", md: "62vh" }} pr={{ md: 1.5 }} sx={scrollSx}>
                      {comidasDef.map((c) => {
                        const foods = placed[c.key] ?? [];
                        const kcal = Math.round(kcalComida(c.key));
                        const meta = targetComida(c.pct);
                        const ratio = meta > 0 ? kcal / meta : 0;
                        const estado = ratio < 0.85 ? `${nutricionTxt}` : ratio <= 1.1 ? "#4f9a52" : "#c98a2e";
                        const activo = overMeal === c.key;
                        return (
                          <Box key={c.key} ref={(el) => { mealRefs.current[c.key] = el; }}
                               borderRadius="2xl" px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}
                               bg={activo ? "#ffffffa6" : "#ffffff3d"}
                               border={`2px solid ${activo ? nutricionTxt : "#ffffff8c"}`}
                               transition="all 0.15s ease"
                               sx={{ backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
                               style={{ boxShadow: activo ? `0 0 22px ${nutricionTxt}55` : `0 2px 12px ${nutricionTxt}0f` }}>
                            <Flex justify="space-between" align="baseline">
                              <Text color={nutricionTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight={700}>{c.label}</Text>
                              <Text color={`${nutricionTxt}aa`} fontSize="xs" fontWeight={600}>{c.pct}%</Text>
                            </Flex>
                            <Flex align="baseline" gap={1.5} mt={0.5}>
                              <Text color={estado} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} lineHeight="1.1">{kcal}</Text>
                              <Text color={`${nutricionTxt}99`} fontSize="sm">/ {meta} kcal</Text>
                            </Flex>
                            <Box h="6px" borderRadius="full" bg={`${nutricionTxt}1a`} overflow="hidden" mt={2}>
                              <Box h="100%" bg={estado} transition="width 0.25s ease" w={`${Math.min(100, ratio * 100)}%`} />
                            </Box>
                            <MacroBarra seg={macrosComida(foods)} />

                            <Flex direction="column" gap={2} mt={4} minH="52px">
                              {foods.length === 0 && (
                                <Text color={`${nutricionTxt}77`} fontSize="sm" fontStyle="italic" textAlign="center" py={3}>
                                  {t("metodo.dia.arrastraAqui")}
                                </Text>
                              )}
                              {foods.map((f) => {
                                const r = resolveFood(f.key);
                                if (!r) return null;
                                // Cada alimento colocado luce SU grupo: la foto del plato
                                // (platoproteina, platoverduras, platocarbs…) muy velada de
                                // fondo + un tinte de su color y una pestaña lateral. Así se
                                // reconoce de un vistazo de qué grupo es lo que has puesto.
                                const fColor = grupoDiaColor(r.grupo);
                                return (
                                  <Flex key={f.id} align="center" gap={2.5} borderRadius="lg" p={2}
                                        position="relative" overflow="hidden"
                                        bg="#ffffff59" border={`1px solid ${fColor}66`}>
                                    <Box position="absolute" inset={0} opacity={0.35}
                                         backgroundImage={`url("${encodeURI(grupoDiaFondo(r.grupo))}")`}
                                         backgroundSize="cover" backgroundPosition="center" />
                                    <Box position="absolute" inset={0} bg={`${fColor}1f`} />
                                    <Box position="absolute" left={0} top={0} bottom={0} w="4px" bg={fColor} />
                                    <Box position="relative" zIndex={1} pl={1.5} display="flex" alignItems="center" flexShrink={0}>
                                      <AlimentoFoto info={r} size={{ base: "34px", md: "38px" }} />
                                    </Box>
                                    <Box flex="1" minW={0} position="relative" zIndex={1}>
                                      <Text color={nutricionTxt} fontSize="sm" fontWeight={600} noOfLines={1}>
                                        {r.nombre}
                                        {f.porciones !== 1 && <Text as="span" color={`${nutricionTxt}aa`}> ×{f.porciones}</Text>}
                                      </Text>
                                      <Text color={`${nutricionTxt}99`} fontSize="2xs" noOfLines={1}>
                                        {gramosDe(f)} g · {r.aOjo}
                                      </Text>
                                    </Box>
                                    <Text color={`${nutricionTxt}cc`} fontSize="xs" fontWeight={600} whiteSpace="nowrap"
                                          position="relative" zIndex={1}>
                                      {Math.round(kcalDe(f))} kcal
                                    </Text>
                                    <Flex align="center" gap={0.5} position="relative" zIndex={1}>
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
                    </Flex>
                    </Flex>
                  </Box>

                  {/* ── DERECHA · elegir alimento (más grande, scroll propio, 2 por fila) ── */}
                  <Flex direction="column" flex={{ md: "1.25" }} minW={0} position="relative" overflow="hidden"
                        borderRadius="2xl" border={`1px solid ${nutricionTxt}33`}
                        style={{ boxShadow: `0 0 16px ${nutricionTxt}16` }}>
                    {/* Fondo temático según el grupo elegido */}
                    <Box position="absolute" inset={0} backgroundImage={`url("${encodeURI(grupoDiaFondo(grupoSel))}")`}
                         backgroundSize="cover" backgroundPosition="center" transition="background-image 0.3s ease" />
                    {/* Velo suave: la foto del grupo se ve de verdad, no tapada. */}
                    <Box position="absolute" inset={0} bg={`${nutricionBg}82`} />

                    <Box position="relative" zIndex={1} px={{ base: 4, md: 5 }} pt={{ base: 5, md: 6 }} pb={2}>
                      <Text color={nutricionTxt} fontSize="xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase" mb={3}
                            textShadow="0 1px 2px #ffffffcc, 0 0 10px #ffffffaa">
                        {t("metodo.dia.eligeArrastra")}
                      </Text>
                      <Flex gap={2} wrap="wrap">
                        {GRUPOS_DIA.map((g) => {
                          const on = grupoSel === g.key;
                          return (
                            <Box key={g.key} as="button" onClick={() => setGrupoSel(g.key)}
                                 px={3.5} py={1.5} borderRadius="full" fontSize="sm" fontWeight={600} whiteSpace="nowrap"
                                 color={on ? nutricionBg : nutricionTxt} bg={on ? g.color : "#ffffff9e"}
                                 border={`1px solid ${on ? g.color : "#ffffffcc"}`} cursor="pointer"
                                 transition="all 0.15s ease" _hover={on ? undefined : { bg: "#ffffffd9" }}>
                              {g.label}
                            </Box>
                          );
                        })}
                      </Flex>
                    </Box>

                    {/* Rejilla de alimentos (2 por fila) con scroll propio */}
                    <Box position="relative" zIndex={1} overflowY={{ base: "visible", md: "auto" }}
                         maxH={{ base: "none", md: "56vh" }} px={{ base: 4, md: 5 }} pb={{ base: 5, md: 6 }} pt={2} sx={scrollSx}>
                      <SimpleGrid columns={2} spacing={{ base: 3, md: 4 }}>
                        {/* Crear tu propio alimento (siempre el primero del grupo) */}
                        <Flex direction="column" align="center" justify="center" gap={2} borderRadius="xl" p={3}
                              minH="150px" bg="#ffffffcc" border={`2px dashed ${grupoColor}`} cursor="pointer"
                              onClick={abrirCrear} transition="all 0.15s ease"
                              _hover={{ bg: "#ffffff", transform: "translateY(-2px)" }}>
                          <Flex w={{ base: "48px", md: "56px" }} h={{ base: "48px", md: "56px" }} borderRadius="full"
                                align="center" justify="center" bg={`${grupoColor}22`} color={grupoColor}
                                fontSize="3xl" fontWeight={700} lineHeight="1">+</Flex>
                          <Text color={nutricionTxt} fontSize="sm" fontWeight={700} textAlign="center" lineHeight="1.2">
                            {t("metodo.dia.creaAlimento")}
                          </Text>
                          <Text color={`${nutricionTxt}99`} fontSize="2xs" textAlign="center">
                            {t("metodo.dia.elTuyo")}
                          </Text>
                        </Flex>

                        {/* Alimentos creados por la usuaria (de este grupo) */}
                        {customGrupo.map((c) => { const r = resolveFood(c.key); return r ? ChooserCard(r) : null; })}

                        {/* Alimentos de la biblioteca */}
                        {alimentosGrupo.map((a) => { const r = resolveFood(a.key); return r ? ChooserCard(r) : null; })}
                      </SimpleGrid>
                    </Box>
                  </Flex>
                </Flex>
              </Reveal>

              {/* Nota educativa */}
              <Reveal inView direction="up" distance={14} delay={0.05} duration={0.6} w="100%" display="flex" justifyContent="center">
                <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="760px" lineHeight="1.7">
                  {t("metodo.dia.manoBascula")}
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
          <AlimentoFoto info={resolveFood(drag.key)} size={{ base: "56px", md: "64px" }} />
        </Box>
      )}

      {/* ── POPUP: ficha del alimento (ojo) ── */}
      {infoFood && (
        <Flex position="fixed" inset={0} zIndex={5000} align="center" justify="center" px={4}
              bg="rgba(0,0,0,0.55)" onClick={() => setInfoKey(null)}>
          <Box onClick={(e) => e.stopPropagation()} position="relative" w="100%" maxW="480px" borderRadius="2xl" overflow="hidden"
               bg={nutricionBg} border={`1px solid ${nutricionTxt}44`} style={{ boxShadow: glowHeader(nutricionTxt) }}>
            {/* Acuarela de Nutrición de fondo, con velo claro para leer el texto oscuro */}
            <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" />
            <Box px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }} position="relative" zIndex={1}>
              <Flex justify="flex-end">
                <Box as="button" onClick={() => setInfoKey(null)} w="30px" h="30px" borderRadius="full"
                     display="flex" alignItems="center" justifyContent="center" fontSize="lg" lineHeight="1"
                     color={nutricionTxt} bg={`${nutricionTxt}12`} _hover={{ bg: `${nutricionTxt}22` }} cursor="pointer">×</Box>
              </Flex>
              <Flex align="center" gap={4} mt={-1}>
                <AlimentoFoto info={infoFood} size={{ base: "62px", md: "72px" }} />
                <Box minW={0}>
                  <Text color={nutricionTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight={700} lineHeight="1.15">
                    {infoFood.nombre}
                  </Text>
                  <Text color={`${nutricionTxt}aa`} fontSize="sm">
                    {infoFood.porcionG} g · {Math.round(infoFood.kcalRacion)} kcal {t("metodo.dia.porRacion")}
                  </Text>
                </Box>
              </Flex>

              <Text color={nutricionTxt} fontSize="sm" mt={4} lineHeight="1.6">
                <b>{t("metodo.dia.aOjo")}</b> {infoFood.aOjo}.
              </Text>
              {infoFood.descripcion && (
                <Text color={`${nutricionTxt}cc`} fontSize="sm" mt={2} lineHeight="1.7" fontStyle="italic">
                  {infoFood.descripcion}
                </Text>
              )}

              {/* Macros */}
              {(infoFood.macros.carbohidrato + infoFood.macros.proteina + infoFood.macros.grasa) > 0 && (
                <Box mt={4}>
                  <Text color={nutricionTxt} fontSize="xs" fontWeight={700} letterSpacing="0.1em" textTransform="uppercase" mb={2}>
                    {t("metodo.alimentos.deQueEstaHecho")}
                  </Text>
                  <Flex h="10px" borderRadius="full" overflow="hidden" bg={`${nutricionTxt}1a`}>
                    <Box w={`${infoFood.macros.carbohidrato}%`} bg={MACRO_COLOR.carbohidrato} />
                    <Box w={`${infoFood.macros.proteina}%`} bg={MACRO_COLOR.proteina} />
                    <Box w={`${infoFood.macros.grasa}%`} bg={MACRO_COLOR.grasa} />
                  </Flex>
                  <Flex gap={4} mt={2} wrap="wrap">
                    {(["carbohidrato", "proteina", "grasa"] as const).map((m) => (
                      <Flex key={m} align="center" gap={1.5}>
                        <Box w="10px" h="10px" borderRadius="full" bg={MACRO_COLOR[m]} />
                        <Text color={`${nutricionTxt}cc`} fontSize="2xs" fontWeight={600}>
                          {et.macro(m)} {infoFood.macros[m]}%
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
              )}

              {/* Moléculas (composición) — solo alimentos de la biblioteca */}
              {infoFood.moleculas && infoFood.moleculas.length > 0 && (
                <Box mt={4}>
                  <Text color={nutricionTxt} fontSize="xs" fontWeight={700} letterSpacing="0.1em" textTransform="uppercase" mb={2}>
                    {t("metodo.dia.susMoleculas")}
                  </Text>
                  <Flex gap={1.5} wrap="wrap">
                    {infoFood.moleculas.map((m) => {
                      const key = typeof m === "string" ? m : m.key;
                      const pct = typeof m === "string" ? undefined : m.pct;
                      const nombre = moleculas[key]?.nombre ?? key;
                      return (
                        <Box key={key} px={2.5} py={1} borderRadius="full" bg={`${nutricionTxt}12`}
                             border={`1px solid ${nutricionTxt}22`}>
                          <Text color={nutricionTxt} fontSize="2xs" fontWeight={600}>
                            {nombre}{pct != null && ` ${pct}%`}
                          </Text>
                        </Box>
                      );
                    })}
                  </Flex>
                </Box>
              )}

              {infoFood.custom && (
                <Text color={`${nutricionTxt}99`} fontSize="2xs" fontStyle="italic" mt={4}>
                  {t("metodo.dia.loHasCreado")}
                </Text>
              )}
            </Box>
          </Box>
        </Flex>
      )}

      {/* ── POPUP: crear tu alimento ── */}
      {crearOpen && (
        <Flex position="fixed" inset={0} zIndex={5200} align="center" justify="center" px={4}
              bg="rgba(0,0,0,0.55)" onClick={() => setCrearOpen(false)}>
          <Box onClick={(e) => e.stopPropagation()} w="100%" maxW="480px" borderRadius="2xl"
               px={{ base: 5, md: 7 }} py={{ base: 6, md: 7 }} bg={nutricionBg}
               border={`1px solid ${nutricionTxt}44`} style={{ boxShadow: glowHeader(nutricionTxt) }}>
            <Text color={nutricionTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight={700} textAlign="center">{t("metodo.nutri.crearAlimento")}</Text>
            <Text color={`${nutricionTxt}aa`} fontSize="sm" textAlign="center" mt={1} mb={5}>
              {t("metodo.dia.seAnadiraAlGrupo", { grupo: GRUPOS_DIA.find((g) => g.key === grupoSel)?.label ?? "" })}
            </Text>

            <Flex direction="column" gap={3.5}>
              <CampoCrear label={t("metodo.dia.nombre")} value={fNombre} onChange={setFNombre} placeholder={t("metodo.dia.nombreEj")} />
              <SimpleGrid columns={2} spacing={3}>
                <CampoCrear label={t("metodo.dia.kcalRacion")} value={fKcal} onChange={setFKcal} numeric placeholder={t("metodo.dia.kcalEj")} />
                <CampoCrear label={t("metodo.dia.racionG")} value={fGramos} onChange={setFGramos} numeric placeholder="100" />
              </SimpleGrid>
              <CampoCrear label={t("metodo.dia.medirAOjo")} value={fAOjo} onChange={setFAOjo} placeholder={t("metodo.dia.medirEj")} />
              <Box>
                <Text color={nutricionTxt} fontSize="xs" fontWeight={700} letterSpacing="0.08em" textTransform="uppercase" mb={1.5}>
                  {t("metodo.dia.deQueEs")}
                </Text>
                <SimpleGrid columns={3} spacing={3}>
                  <CampoCrear label={t("metodo.dia.carb")} value={fCarb} onChange={setFCarb} numeric placeholder="0" />
                  <CampoCrear label={t("metodo.dia.proteina")} value={fProt} onChange={setFProt} numeric placeholder="0" />
                  <CampoCrear label={t("metodo.dia.grasa")} value={fGrasa} onChange={setFGrasa} numeric placeholder="0" />
                </SimpleGrid>
              </Box>
            </Flex>

            <Flex gap={3} mt={6} justify="flex-end">
              <Box as="button" onClick={() => setCrearOpen(false)} px={5} py={2.5} borderRadius="full"
                   fontSize="sm" fontWeight={600} color={nutricionTxt} bg={`${nutricionTxt}12`}
                   border={`1px solid ${nutricionTxt}33`} cursor="pointer" _hover={{ bg: `${nutricionTxt}22` }}>
                {t("comun.cancelar")}
              </Box>
              <Box as="button" onClick={crearAlimento}
                   px={6} py={2.5} borderRadius="full" fontSize="sm" fontWeight={700}
                   color={nutricionBg} bg={nutricionTxt} cursor={fNombre.trim() && Number(fKcal) > 0 ? "pointer" : "not-allowed"}
                   opacity={fNombre.trim() && Number(fKcal) > 0 ? 1 : 0.5}
                   _hover={fNombre.trim() && Number(fKcal) > 0 ? { transform: "translateY(-1px)" } : undefined}>
                {t("metodo.dia.crearAlimento")}
              </Box>
            </Flex>
          </Box>
        </Flex>
      )}

      {/* ── POPUP: ¿cuántas comidas haces al día? ── */}
      {modalOpen && kcalObjetivo && (
        <Flex position="fixed" inset={0} zIndex={5000} align="center" justify="center" px={4}
              bg="rgba(0,0,0,0.6)" onClick={() => numComidas != null && setModalOpen(false)}>
          <Box onClick={(e) => e.stopPropagation()} position="relative" overflow="hidden" w="100%" maxW="560px" borderRadius="2xl"
               bg={nutricionBg}
               border={`1px solid ${nutricionTxt}44`} style={{ boxShadow: glowHeader(nutricionTxt) }}>
            {/* Acuarela de Nutrición de fondo, con velo claro para leer el texto oscuro */}
            <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>
            <Text color={nutricionTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight={700} textAlign="center">
              {t("metodo.dia.cuantasComidas")}
            </Text>
            <Text color={`${nutricionTxt}aa`} fontSize="sm" textAlign="center" mt={2} mb={5} lineHeight="1.6">
              Repartiremos tus {kcalObjetivo} kcal entre esas comidas de forma equilibrada. Puedes cambiarlo cuando quieras.
            </Text>
            <Flex direction="column" gap={3}>
              {NUM_COMIDAS_OPCIONES.map((n) => {
                const on = numComidas === n;
                return (
                  <Box key={n} as="button" onClick={() => elegirComidas(n)}
                       textAlign="left" borderRadius="xl" px={4} py={3.5}
                       bg={on ? nutricionTxt : `${nutricionTxt}0f`}
                       border={`1px solid ${on ? nutricionTxt : `${nutricionTxt}44`}`}
                       cursor="pointer" transition="all 0.15s ease"
                       _hover={on ? undefined : { bg: `${nutricionTxt}1f`, borderColor: nutricionTxt }}>
                    <Text color={on ? nutricionBg : nutricionTxt} fontSize="md" fontWeight={700}>
                      {n} comidas
                    </Text>
                    <Flex gap={2} wrap="wrap" mt={1.5}>
                      {REPARTO_COMIDAS[n].map((c) => (
                        <Text key={c.key} fontSize="2xs" fontWeight={600}
                              color={on ? nutricionBg : `${nutricionTxt}aa`}>
                          {c.label} {Math.round(kcalObjetivo * c.pct / 100)} kcal
                        </Text>
                      ))}
                    </Flex>
                  </Box>
                );
              })}
            </Flex>
            </Box>
          </Box>
        </Flex>
      )}

      <IndiceNutricion />
      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <Box position="relative" zIndex={1}>
        <SiteFooter />
      </Box>
    </Box>
  );
}

// Campo del formulario «crea tu alimento».
function CampoCrear({ label, value, onChange, numeric, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; numeric?: boolean; placeholder?: string;
}) {
  return (
    <Flex direction="column" gap={1}>
      <Text color={`${nutricionTxt}cc`} fontSize="xs" fontWeight={600}>{label}</Text>
      <Input
        value={value}
        onChange={(e) => onChange(numeric ? e.target.value.replace(/[^\d]/g, "") : e.target.value)}
        inputMode={numeric ? "numeric" : undefined}
        placeholder={placeholder}
        bg="#ffffffcc" border={`1px solid ${nutricionTxt}33`} color={nutricionTxt} fontWeight={600}
        _hover={{ borderColor: `${nutricionTxt}66` }}
        _focusVisible={{ borderColor: nutricionTxt, boxShadow: `0 0 0 1px ${nutricionTxt}` }}
        _placeholder={{ color: `${nutricionTxt}55` }}
      />
    </Flex>
  );
}

// Botón minúsculo redondo (± y quitar) en cada alimento de la comida.
function MiniBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <Box as="button" onClick={onClick} w="24px" h="24px" borderRadius="full" flexShrink={0}
         display="flex" alignItems="center" justifyContent="center" fontSize="md" fontWeight={700} lineHeight="1"
         color={danger ? "#c0554f" : nutricionTxt} bg="#ffffffb8"
         border={`1px solid ${danger ? "#c0554f55" : `${nutricionTxt}33`}`}
         cursor="pointer" transition="all 0.12s ease"
         _hover={{ bg: danger ? "#c0554f22" : "#ffffff" }}
         sx={{ touchAction: "manipulation", userSelect: "none", WebkitTapHighlightColor: "transparent" }}>
      {children}
    </Box>
  );
}
