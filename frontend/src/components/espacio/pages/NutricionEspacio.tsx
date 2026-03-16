import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { NutricionIcon, nutricionBg, nutricionNom, nutricionTxt } from "../../../GlobalVariables";

const BG   = nutricionBg;
const TXT  = nutricionTxt;
const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";

// ── Colors matching NutricionRecursos ──────────────────
const COLOR_CARBS = TXT;       // dark green
const COLOR_PROT  = "#1565c0"; // blue
const COLOR_FAT   = "#ef6c00"; // orange

// ── Icons (same SVGs as NutricionRecursos) ──────────────
const IconCarbs = ({ size = "34px" }: { size?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={COLOR_CARBS}>
    <path d="M301-120q-58 0-98.5-40.5T162-259q0-18 4-35t11-32l183-400q13-29 39.5-46.5T458-790h4q32 0 58.5 17.5T560-726l183 400q7 15 11 32t4 35q0 58-40.5 98.5T619-120H301Zm159-280q17 0 28.5-11.5T500-440q0-17-11.5-28.5T460-480q-17 0-28.5 11.5T420-440q0 17 11.5 28.5T460-400Zm-40-120h80v-160h-80v160Zm40 340q25 0 42.5-17.5T520-240q0-25-17.5-42.5T460-300q-25 0-42.5 17.5T400-240q0 25 17.5 42.5T460-180Zm-159-20h-20q-25 0-42.5-17.5T221-259q0-9 2-17t5-15l108-229h-96q-33 0-56.5-23.5T160-600q0-33 23.5-56.5T240-680h320q33 0 56.5 23.5T640-600q0 33-23.5 56.5T560-520h-96l108 229q3 7 5 15t2 17q0 25-17.5 42.5T539-199h-20l-59-121-59 121Z"/>
  </svg>
);

const IconProts = ({ size = "34px" }: { size?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={COLOR_PROT}>
    <path d="M120-160v-400l200-240h400l200 240v400H80Zm80-80h640v-280H160v280Zm320-350q25 0 42.5-17.5T540-650q0-25-17.5-42.5T480-710q-25 0-42.5 17.5T420-650q0 25 17.5 42.5T480-590ZM80-520h800l-170-200H250L80-520Zm400 0Z"/>
  </svg>
);

const IconFats = ({ size = "34px" }: { size?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={COLOR_FAT}>
    <path d="M440-80q-117 0-198.5-81.5T160-360q0-56 20.5-104.5t56.5-87.5l183-195 183 195q36 39 56.5 87.5T680-360q0 117-81.5 198.5T440-80Zm0-80q83 0 141.5-58.5T640-360q0-37-13.5-71T587-495L440-650 293-495q-33 33-46.5 67T233-360q0 83 58.5 141.5T440-160Zm0-160Z"/>
  </svg>
);

// ── Types ────────────────────────────────────────────────
type Genero = "mujer" | "hombre";

type Actividad = {
  label: string;
  desc: string;
  factor: number;
};

type Resultado = {
  tdee: number;
  protKcal: number; protG: number; protPct: number;
  carbKcal: number; carbG: number; carbPct: number;
  fatKcal: number;  fatG: number;  fatPct: number;
};

// ── Activity options ────────────────────────────────────
const ACTIVIDADES: Actividad[] = [
  { label: "Sedentario",            desc: "Poco o sin ejercicio",      factor: 1.2   },
  { label: "Ligeramente activo",    desc: "1–3 días por semana",       factor: 1.375 },
  { label: "Moderadamente activo",  desc: "3–5 días por semana",       factor: 1.55  },
  { label: "Muy activo",            desc: "6–7 días por semana",       factor: 1.725 },
  { label: "Extremadamente activo", desc: "Trabajo físico intenso",    factor: 1.9   },
];

// ── Mifflin-St Jeor + TDEE ──────────────────────────────
function calcular(peso: number, altura: number, edad: number, genero: Genero, factor: number): Resultado {
  const bmr = genero === "hombre"
    ? 10 * peso + 6.25 * altura - 5 * edad + 5
    : 10 * peso + 6.25 * altura - 5 * edad - 161;
  const tdee = Math.round(bmr * factor);

  const protPct = 25; const carbPct = 45; const fatPct = 30;
  const protKcal = Math.round(tdee * protPct / 100);
  const carbKcal = Math.round(tdee * carbPct / 100);
  const fatKcal  = Math.round(tdee * fatPct  / 100);

  return {
    tdee,
    protKcal, protG: Math.round(protKcal / 4), protPct,
    carbKcal, carbG: Math.round(carbKcal / 4), carbPct,
    fatKcal,  fatG:  Math.round(fatKcal  / 9), fatPct,
  };
}

// ── Circular ring SVG ────────────────────────────────────
function RingProgress({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color + "22"} strokeWidth={8} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
    </svg>
  );
}

// ── Styled number input ──────────────────────────────────
function NumInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <Box flex={1} minW="80px">
      <Text color={TXT + "88"} fontSize="xs" fontFamily="'EB Garamond', serif" fontWeight="600" mb={1} letterSpacing="0.06em" textTransform="uppercase">
        {label}
      </Text>
      <Box
        as="input"
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        min={0}
        w="100%"
        px={3} py={2}
        bg={TXT + "0a"}
        border={`1.5px solid ${TXT}33`}
        borderRadius="xl"
        color={TXT}
        fontFamily="'EB Garamond', serif"
        fontSize="lg"
        fontWeight="600"
        outline="none"
        sx={{
          "&:focus": { border: `1.5px solid ${TXT}88`, background: TXT + "14" },
          "&::placeholder": { color: TXT + "44" },
          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": { WebkitAppearance: "none" },
          MozAppearance: "textfield",
        }}
      />
    </Box>
  );
}

// ── Macro result card ────────────────────────────────────
function MacroCard({ icon, label, color, kcal, grams, pct }: {
  icon: React.ReactNode; label: string; color: string;
  kcal: number; grams: number; pct: number;
}) {
  return (
    <Box
      flex={1} minW="120px"
      bg={BG} borderRadius="2xl"
      border={`1.5px solid ${color}33`}
      boxShadow={`0 4px 18px ${color}18`}
      px={{ base: 4, md: 5 }} py={5}
      display="flex" flexDirection="column" alignItems="center" gap={3}
    >
      {/* Ring with icon inside */}
      <Box position="relative" w="80px" h="80px" display="flex" alignItems="center" justifyContent="center">
        <Box position="absolute" top={0} left={0}>
          <RingProgress pct={pct} color={color} size={80} />
        </Box>
        {icon}
      </Box>

      {/* Percentage badge */}
      <Box bg={color + "18"} border={`1px solid ${color}44`} borderRadius="full" px={3} py={0.5}>
        <Text color={color} fontSize="sm" fontWeight="700" fontFamily="'EB Garamond', serif">
          {pct}%
        </Text>
      </Box>

      {/* Label */}
      <Text color={TXT} fontSize={{ base: "md", md: "lg" }} fontWeight="700" fontFamily="'EB Garamond', serif" textAlign="center">
        {label}
      </Text>

      {/* Values */}
      <Flex direction="column" align="center" gap={0.5}>
        <Text color={color} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" fontFamily="'EB Garamond', serif" lineHeight="1">
          {grams} g
        </Text>
        <Text color={TXT + "66"} fontSize="sm" fontFamily="'EB Garamond', serif">
          {kcal} kcal
        </Text>
      </Flex>
    </Box>
  );
}

// ── Main component ────────────────────────────────────────
export default function NutricionEspacio() {
  const LS_KEY = "nutricion_calc";

  const [peso,    setPeso]    = useState("");
  const [altura,  setAltura]  = useState("");
  const [edad,    setEdad]    = useState("");
  const [genero,  setGenero]  = useState<Genero>("mujer");
  const [actIdx,  setActIdx]  = useState<number | null>(null);
  const [result,  setResult]  = useState<Resultado | null>(null);
  const [error,   setError]   = useState("");

  const resultRef = useRef<HTMLDivElement>(null);

  // Load from localStorage
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d.peso)   setPeso(d.peso);
        if (d.altura) setAltura(d.altura);
        if (d.edad)   setEdad(d.edad);
        if (d.genero) setGenero(d.genero);
        if (d.actIdx != null) setActIdx(d.actIdx);
        if (d.result) setResult(d.result);
      }
    } catch { /* ignore */ }
  }, []);

  const handleCalcular = () => {
    const p = parseFloat(peso);
    const h = parseFloat(altura);
    const e = parseFloat(edad);
    if (!p || !h || !e || actIdx === null) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (p < 20 || p > 300) { setError("Introduce un peso válido (20–300 kg)."); return; }
    if (h < 100 || h > 250) { setError("Introduce una altura válida (100–250 cm)."); return; }
    if (e < 10 || e > 120)  { setError("Introduce una edad válida (10–120 años)."); return; }
    setError("");
    const r = calcular(p, h, e, genero, ACTIVIDADES[actIdx].factor);
    setResult(r);
    localStorage.setItem(LS_KEY, JSON.stringify({ peso, altura, edad, genero, actIdx, result: r }));
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };

  const canCalc = peso && altura && edad && actIdx !== null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          gap={{ base: 6, md: 8 }}
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<NutricionIcon size={{ base: "40px", md: "50px" }} />}
            title={nutricionNom}
            bgColor={BG}
            color={TXT}
          />

          {/* ── Form card ── */}
          <Box
            bg={BG} borderRadius="2xl" boxShadow={GLOW}
            border={`1px solid ${TXT}22`}
            px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}
            w="100%" maxW="780px"
          >
            <Text color={TXT} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" fontFamily="'EB Garamond', serif" mb={1}>
              Calcula tus necesidades
            </Text>
            <Text color={TXT + "88"} fontSize={{ base: "sm", md: "md" }} fontFamily="'EB Garamond', serif" mb={7} fontStyle="italic">
              Estimación de calorías diarias y distribución de macronutrientes.
            </Text>

            {/* Row 1: Peso / Altura / Edad */}
            <Flex gap={4} mb={6} flexWrap={{ base: "wrap", md: "nowrap" }}>
              <NumInput label="Peso (kg)"   value={peso}   onChange={setPeso}   placeholder="70" />
              <NumInput label="Altura (cm)" value={altura} onChange={setAltura} placeholder="165" />
              <NumInput label="Edad (años)" value={edad}   onChange={setEdad}   placeholder="30" />
            </Flex>

            {/* Row 2: Género */}
            <Box mb={6}>
              <Text color={TXT + "88"} fontSize="xs" fontFamily="'EB Garamond', serif" fontWeight="600" mb={2} letterSpacing="0.06em" textTransform="uppercase">
                Género
              </Text>
              <Flex gap={3}>
                {(["mujer", "hombre"] as Genero[]).map(g => (
                  <Box
                    key={g}
                    as="button"
                    onClick={() => setGenero(g)}
                    flex={1}
                    py={2} borderRadius="xl"
                    border={`1.5px solid ${genero === g ? TXT + "99" : TXT + "28"}`}
                    bg={genero === g ? TXT + "18" : "transparent"}
                    color={TXT}
                    fontFamily="'EB Garamond', serif"
                    fontSize="md"
                    fontWeight={genero === g ? "700" : "400"}
                    cursor="pointer"
                    transition="all 0.18s"
                    _hover={{ bg: TXT + "10", border: `1.5px solid ${TXT}55` }}
                    textTransform="capitalize"
                  >
                    {g === "mujer" ? "Mujer" : "Hombre"}
                  </Box>
                ))}
              </Flex>
            </Box>

            {/* Row 3: Actividad */}
            <Box mb={7}>
              <Text color={TXT + "88"} fontSize="xs" fontFamily="'EB Garamond', serif" fontWeight="600" mb={2} letterSpacing="0.06em" textTransform="uppercase">
                Nivel de actividad
              </Text>
              <Flex direction="column" gap={2}>
                {ACTIVIDADES.map((act, i) => (
                  <Box
                    key={i}
                    as="button"
                    onClick={() => setActIdx(i)}
                    display="flex" alignItems="center" justifyContent="space-between"
                    px={4} py={3} borderRadius="xl"
                    border={`1.5px solid ${actIdx === i ? TXT + "99" : TXT + "22"}`}
                    bg={actIdx === i ? TXT + "14" : TXT + "04"}
                    cursor="pointer"
                    transition="all 0.18s"
                    _hover={{ bg: TXT + "0e", border: `1.5px solid ${TXT}55` }}
                    textAlign="left"
                  >
                    <Box>
                      <Text color={TXT} fontFamily="'EB Garamond', serif" fontSize="md" fontWeight={actIdx === i ? "700" : "500"} lineHeight="1.2">
                        {act.label}
                      </Text>
                      <Text color={TXT + "66"} fontFamily="'EB Garamond', serif" fontSize="sm">
                        {act.desc}
                      </Text>
                    </Box>
                    {actIdx === i && (
                      <Box w="20px" h="20px" borderRadius="full" bg={TXT + "22"} border={`2px solid ${TXT}88`}
                        display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                        <Box w="8px" h="8px" borderRadius="full" bg={TXT} />
                      </Box>
                    )}
                  </Box>
                ))}
              </Flex>
            </Box>

            {/* Error */}
            {error && (
              <Text color="#c62828" fontSize="sm" fontFamily="'EB Garamond', serif" mb={4} fontStyle="italic">
                {error}
              </Text>
            )}

            {/* Button */}
            <Box
              as="button"
              onClick={handleCalcular}
              w="100%" py={3}
              borderRadius="xl"
              bg={canCalc ? TXT : TXT + "44"}
              color={canCalc ? BG : BG + "99"}
              fontFamily="'EB Garamond', serif"
              fontSize="lg"
              fontWeight="700"
              letterSpacing="0.06em"
              cursor={canCalc ? "pointer" : "not-allowed"}
              transition="all 0.2s"
              _hover={canCalc ? { opacity: 0.88 } : {}}
              boxShadow={canCalc ? `0 4px 16px ${TXT}44` : "none"}
            >
              Calcular
            </Box>
          </Box>

          {/* ── Results ── */}
          {result && (
            <Box ref={resultRef as React.RefObject<HTMLDivElement>} w="100%" maxW="780px">
              {/* TDEE */}
              <Box
                bg={BG} borderRadius="2xl" boxShadow={GLOW}
                border={`1px solid ${TXT}22`}
                px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }}
                mb={4} textAlign="center"
              >
                <Text color={TXT + "77"} fontSize="sm" fontFamily="'EB Garamond', serif" fontWeight="600" letterSpacing="0.08em" textTransform="uppercase" mb={1}>
                  Calorías diarias estimadas
                </Text>
                <Text
                  color={TXT}
                  fontSize={{ base: "5xl", md: "6xl" }}
                  fontWeight="700"
                  fontFamily="'EB Garamond', serif"
                  lineHeight="1"
                  mb={1}
                >
                  {result.tdee.toLocaleString()}
                </Text>
                <Text color={TXT + "66"} fontSize="lg" fontFamily="'EB Garamond', serif">
                  kcal / día
                </Text>
                <Box h="1px" bg={TXT + "18"} my={4} />
                <Text color={TXT + "77"} fontSize="sm" fontFamily="'EB Garamond', serif" fontStyle="italic">
                  Basado en la fórmula Mifflin-St Jeor · Distribución: 25% proteínas · 45% carbohidratos · 30% grasas
                </Text>
              </Box>

              {/* Macro cards */}
              <Flex gap={{ base: 3, md: 5 }} flexWrap={{ base: "wrap", md: "nowrap" }}>
                <MacroCard
                  icon={<IconProts />} label="Proteínas"
                  color={COLOR_PROT}
                  kcal={result.protKcal} grams={result.protG} pct={result.protPct}
                />
                <MacroCard
                  icon={<IconCarbs />} label="Carbohidratos"
                  color={COLOR_CARBS}
                  kcal={result.carbKcal} grams={result.carbG} pct={result.carbPct}
                />
                <MacroCard
                  icon={<IconFats />} label="Grasas"
                  color={COLOR_FAT}
                  kcal={result.fatKcal} grams={result.fatG} pct={result.fatPct}
                />
              </Flex>

              {/* Disclaimer */}
              <Box mt={4} px={2}>
                <Text color="rgba(255,255,255,0.55)" fontSize="xs" fontFamily="'EB Garamond', serif" textAlign="center" fontStyle="italic">
                  Esta estimación es orientativa. Las necesidades reales varían según la composición corporal, el metabolismo individual y otros factores de salud.
                </Text>
              </Box>
            </Box>
          )}

        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
