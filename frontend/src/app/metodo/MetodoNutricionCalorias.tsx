import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";

// ═════════════════════════════════════════════════════════════════════════
// Apartado «Tus calorías y macros» del recorrido de Nutrición. Va DESPUÉS del
// plato de Harvard: cada persona calcula su propia medición (calorías diarias y
// reparto de macronutrientes) a partir de sexo, edad, peso, altura, actividad y
// objetivo. Cálculo 100% en cliente (Mifflin-St Jeor + factor de actividad).
// Es orientativo/educativo; no sustituye a un profesional.
// ═════════════════════════════════════════════════════════════════════════

type Sexo = "mujer" | "hombre";
type Objetivo = "perder" | "mantener" | "ganar";

// ── Actividad de BASE (lo que gastas viviendo tu día, SIN contar el ejercicio).
// Factor que multiplica al metabolismo basal (NEAT: moverte, trabajar, tareas).
const BASES: { key: string; label: string; desc: string; factor: number }[] = [
  { key: "sentado", label: "Sobre todo sentada/o", desc: "oficina, estudio, conduzco", factor: 1.2 },
  { key: "de-pie",  label: "De pie o andando",     desc: "tienda, aula, recados",       factor: 1.35 },
  { key: "fisico",  label: "Trabajo físico",       desc: "obra, campo, cuidados, reparto", factor: 1.5 },
];

// ── EJERCICIO deliberado. En vez de un único factor, preguntamos qué haces, cuánto
// y con qué intensidad, y estimamos las kcal reales que quema a la semana.
// Regla METs: kcal ≈ MET × peso(kg) × horas. (1 MET·h·kg ≈ 1 kcal.)
const INTENSIDADES: { key: string; label: string; desc: string; met: number }[] = [
  { key: "suave",    label: "Suave",    desc: "andar, yoga, estiramientos", met: 3.5 },
  { key: "moderado", label: "Moderado", desc: "bici, pesas, nadar suave",   met: 6 },
  { key: "intenso",  label: "Intenso",  desc: "correr, HIIT, deporte fuerte", met: 9 },
];

// Minutos por sesión (opciones rápidas).
const MINUTOS_OPC = [20, 30, 45, 60, 90];

const OBJETIVOS: { key: Objetivo; label: string; ajuste: number }[] = [
  { key: "perder",   label: "Perder grasa", ajuste: -0.15 },
  { key: "mantener", label: "Mantener",     ajuste: 0 },
  { key: "ganar",    label: "Ganar músculo", ajuste: 0.10 },
];

// ── Botón de un grupo tipo «segmentado» (sexo / actividad / objetivo) ──
function Opcion({ activo, label, onClick }: { activo: boolean; label: React.ReactNode; onClick: () => void }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      px={{ base: 3, md: 4 }}
      py={2}
      borderRadius="full"
      fontSize={{ base: "sm", md: "md" }}
      fontWeight={600}
      whiteSpace="nowrap"
      color={activo ? nutricionBg : "white"}
      bg={activo ? nutricionTxt : "rgba(255,255,255,0.06)"}
      border={`1px solid ${activo ? nutricionTxt : `${nutricionTxt}44`}`}
      cursor="pointer"
      transition="all 0.18s ease"
      _hover={activo ? undefined : { bg: "rgba(255,255,255,0.14)", borderColor: `${nutricionTxt}aa` }}
      style={{ textShadow: activo ? "none" : "0 1px 4px rgba(0,0,0,0.5)" }}
    >
      {label}
    </Box>
  );
}

// ── Campo numérico con etiqueta (edad / peso / altura) ──
function CampoNum({ label, sufijo, value, onChange }: {
  label: string; sufijo: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <Flex direction="column" gap={1.5}>
      <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "xs", md: "sm" }} fontWeight={600}
            letterSpacing="0.04em" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
        {label}
      </Text>
      <Flex align="center" gap={2}>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          inputMode="numeric"
          placeholder="—"
          maxW="110px"
          bg="rgba(255,255,255,0.08)"
          border={`1px solid ${nutricionTxt}44`}
          color="white"
          _hover={{ borderColor: `${nutricionTxt}88` }}
          _focusVisible={{ borderColor: nutricionTxt, boxShadow: `0 0 0 1px ${nutricionTxt}` }}
          _placeholder={{ color: "rgba(255,255,255,0.4)" }}
        />
        <Text color="rgba(255,255,255,0.7)" fontSize={{ base: "sm", md: "md" }}>{sufijo}</Text>
      </Flex>
    </Flex>
  );
}

// ── Contador +/- (p.ej. días de ejercicio a la semana) ──
function Stepper({ label, value, min, max, sufijo, onChange }: {
  label: string; value: number; min: number; max: number; sufijo: string; onChange: (v: number) => void;
}) {
  const btn = (txt: string, delta: number, disabled: boolean) => (
    <Box as="button" onClick={() => !disabled && onChange(Math.min(max, Math.max(min, value + delta)))}
         w="34px" h="34px" borderRadius="full" flexShrink={0}
         display="flex" alignItems="center" justifyContent="center"
         fontSize="lg" fontWeight={700} lineHeight="1"
         color={disabled ? `${nutricionTxt}44` : "white"}
         bg="rgba(255,255,255,0.08)" border={`1px solid ${nutricionTxt}${disabled ? "22" : "66"}`}
         cursor={disabled ? "not-allowed" : "pointer"} transition="all 0.15s ease"
         _hover={disabled ? undefined : { bg: "rgba(255,255,255,0.16)", borderColor: nutricionTxt }}
         sx={{ touchAction: "manipulation", userSelect: "none", WebkitTapHighlightColor: "transparent" }}>
      {txt}
    </Box>
  );
  return (
    <Flex direction="column" gap={1.5}>
      <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "xs", md: "sm" }} fontWeight={600}
            letterSpacing="0.04em" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
        {label}
      </Text>
      <Flex align="center" gap={2.5}>
        {btn("−", -1, value <= min)}
        <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight={700} minW="70px" textAlign="center"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
          {value} <Text as="span" fontSize="sm" fontWeight={500} color="rgba(255,255,255,0.7)">{sufijo}</Text>
        </Text>
        {btn("+", +1, value >= max)}
      </Flex>
    </Flex>
  );
}

// ── Tarjeta de resultado de un macro ──
function MacroBox({ nombre, gramos, kcal, color }: { nombre: string; gramos: number; kcal: number; color: string }) {
  return (
    <Box borderRadius="xl" px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }} textAlign="center"
         bg={`${nutricionBg}55`} border={`1px solid ${color}66`}
         style={{ boxShadow: `inset 0 0 20px rgba(0,0,0,0.18), 0 0 14px ${color}22` }}>
      <Text color={color} fontSize="2xs" fontWeight={700} letterSpacing="0.16em" textTransform="uppercase">
        {nombre}
      </Text>
      <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} lineHeight="1.1" mt={1}
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
        {gramos} g
      </Text>
      <Text color="rgba(255,255,255,0.7)" fontSize={{ base: "xs", md: "sm" }} mt={1}>
        {kcal} kcal
      </Text>
    </Box>
  );
}

export default function MetodoNutricionCalorias() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Entradas del cálculo.
  const [sexo, setSexo] = useState<Sexo>("mujer");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");   // kg
  const [altura, setAltura] = useState(""); // cm
  const [base, setBase] = useState(BASES[0].key);         // actividad diaria (NEAT)
  const [ejIntensidad, setEjIntensidad] = useState(INTENSIDADES[1].key);
  const [ejDias, setEjDias] = useState(0);                // días de ejercicio/semana
  const [ejMinutos, setEjMinutos] = useState(45);         // minutos por sesión
  const [objetivo, setObjetivo] = useState<Objetivo>("mantener");

  const dataRef = useRef<Record<string, any>>({});

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
        // Prerrellena con lo que la usuaria ya calculó otra vez (no repetir).
        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const g = dataRef.current?.calorias?.entrada;
          if (g && typeof g === "object") {
            if (g.sexo === "mujer" || g.sexo === "hombre") setSexo(g.sexo);
            if (g.edad) setEdad(String(g.edad));
            if (g.peso) setPeso(String(g.peso));
            if (g.altura) setAltura(String(g.altura));
            if (BASES.some((b) => b.key === g.base)) setBase(g.base);
            if (INTENSIDADES.some((i) => i.key === g.ejIntensidad)) setEjIntensidad(g.ejIntensidad);
            if (typeof g.ejDias === "number") setEjDias(Math.min(7, Math.max(0, g.ejDias)));
            if (typeof g.ejMinutos === "number") setEjMinutos(g.ejMinutos);
            if (["perder", "mantener", "ganar"].includes(g.objetivo)) setObjetivo(g.objetivo);
          }
        } catch { /* sin fila todavía */ }
        // Bloqueo: no se puede calcular las calorías hasta haber creado el plato.
        if (!dataRef.current?.plato_hecho) { navigate("/metodo/nutricion/plato", { replace: true }); return; }
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // Cálculo (Mifflin-St Jeor → metabolismo basal; × actividad de base → NEAT;
  // + kcal del ejercicio estimadas por METs → gasto total; × ajuste del objetivo
  // → calorías recomendadas). Macros: proteína 1.8 g/kg, grasa 25 %, resto hidratos.
  const resultado = useMemo(() => {
    const e = Number(edad), p = Number(peso), a = Number(altura);
    if (!e || !p || !a || e < 10 || e > 100 || p < 25 || p > 300 || a < 100 || a > 250) return null;

    const bmr = 10 * p + 6.25 * a - 5 * e + (sexo === "hombre" ? 5 : -161);
    const factorBase = BASES.find((x) => x.key === base)?.factor ?? 1.2;
    const met = INTENSIDADES.find((x) => x.key === ejIntensidad)?.met ?? 6;
    // kcal del ejercicio a la semana ≈ MET × peso × horas totales; luego media/día.
    const ejKcalSemana = met * p * (ejDias * ejMinutos / 60);
    const ejKcalDia = ejKcalSemana / 7;
    const tdee = bmr * factorBase + ejKcalDia;
    const ajuste = OBJETIVOS.find((x) => x.key === objetivo)?.ajuste ?? 0;
    const kcal = Math.round((tdee * (1 + ajuste)) / 10) * 10;

    const protG = Math.round(1.8 * p);
    const protKcal = protG * 4;
    const fatKcal = Math.round(kcal * 0.25);
    const fatG = Math.round(fatKcal / 9);
    const carbKcal = Math.max(0, kcal - protKcal - fatKcal);
    const carbG = Math.round(carbKcal / 4);

    return {
      bmr: Math.round(bmr), tdee: Math.round(tdee), kcal,
      ejKcalDia: Math.round(ejKcalDia),
      prot: { g: protG, kcal: protKcal },
      fat: { g: fatG, kcal: fatKcal },
      carb: { g: carbG, kcal: carbKcal },
    };
  }, [sexo, edad, peso, altura, base, ejIntensidad, ejDias, ejMinutos, objetivo]);

  // Guarda el resultado (y las entradas, para prerrellenar y para desbloquear
  // «Diseña tu día»). Se dispara cuando hay un resultado válido.
  useEffect(() => {
    if (!resultado) return;
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const t = setTimeout(() => {
      const data = {
        ...dataRef.current,
        calorias: {
          hecho: true,
          kcal: resultado.kcal,
          macros: {
            prot: resultado.prot.g, carb: resultado.carb.g, fat: resultado.fat.g,
          },
          entrada: {
            sexo, edad: Number(edad), peso: Number(peso), altura: Number(altura),
            base, ejIntensidad, ejDias, ejMinutos, objetivo,
          },
        },
      };
      dataRef.current = data;
      axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } }).catch(() => { /* reintenta al próximo cambio */ });
    }, 700); // debounce: no guardar en cada tecla
    return () => clearTimeout(t);
  }, [resultado, sexo, edad, peso, altura, base, ejIntensidad, ejDias, ejMinutos, objetivo]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="Tus calorías y macros"
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: "← Tu plato", onClick: () => navigate("/metodo/nutricion/plato") }}
              extra={{ label: "Biblioteca", onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: "Diseña tu día →", onClick: () => navigate("/metodo/nutricion/dia") }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px">
              Cada cuerpo necesita una cantidad distinta de energía. Calcula tu propia medición: tus calorías
              diarias y cómo repartir los macronutrientes según tu objetivo.
            </Text>
          </Reveal>

          {/* ── FORMULARIO ── */}
          <Reveal direction="up" distance={20} delay={0.14} duration={0.6} w="100%">
            <Box w="100%" borderRadius="2xl" px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}
                 bg={`${nutricionBg}55`} border={`1px solid ${nutricionTxt}44`}
                 style={{ boxShadow: `inset 0 0 26px rgba(0,0,0,0.2), 0 0 18px ${nutricionTxt}16` }}>

              {/* Sexo */}
              <Text color={nutricionTxt} fontSize="xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase" mb={2}>
                Sexo
              </Text>
              <Flex gap={3} mb={5} wrap="wrap">
                <Opcion activo={sexo === "mujer"} label="Mujer" onClick={() => setSexo("mujer")} />
                <Opcion activo={sexo === "hombre"} label="Hombre" onClick={() => setSexo("hombre")} />
              </Flex>

              {/* Edad / peso / altura */}
              <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={{ base: 4, md: 5 }} mb={5}>
                <CampoNum label="Edad" sufijo="años" value={edad} onChange={setEdad} />
                <CampoNum label="Peso" sufijo="kg" value={peso} onChange={setPeso} />
                <CampoNum label="Altura" sufijo="cm" value={altura} onChange={setAltura} />
              </SimpleGrid>

              {/* Actividad de base (día a día, sin ejercicio) */}
              <Text color={nutricionTxt} fontSize="xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase" mb={2}>
                Tu día a día
              </Text>
              <Flex gap={2.5} mb={5} wrap="wrap">
                {BASES.map((b) => (
                  <Opcion key={b.key} activo={base === b.key}
                          label={<Flex direction="column" align="center" lineHeight="1.15">
                                   <Text as="span">{b.label}</Text>
                                   <Text as="span" fontSize="2xs" fontWeight={500} opacity={0.75}>{b.desc}</Text>
                                 </Flex>}
                          onClick={() => setBase(b.key)} />
                ))}
              </Flex>

              {/* Ejercicio (más específico → mejor estimación) */}
              <Text color={nutricionTxt} fontSize="xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase" mb={2}>
                Ejercicio
              </Text>
              <Flex gap={2.5} mb={4} wrap="wrap">
                {INTENSIDADES.map((i) => (
                  <Opcion key={i.key} activo={ejIntensidad === i.key}
                          label={<Flex direction="column" align="center" lineHeight="1.15">
                                   <Text as="span">{i.label}</Text>
                                   <Text as="span" fontSize="2xs" fontWeight={500} opacity={0.75}>{i.desc}</Text>
                                 </Flex>}
                          onClick={() => setEjIntensidad(i.key)} />
                ))}
              </Flex>
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 4, md: 6 }} mb={2}>
                <Stepper label="Días por semana" value={ejDias} min={0} max={7} sufijo="días/sem" onChange={setEjDias} />
                <Flex direction="column" gap={1.5}>
                  <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "xs", md: "sm" }} fontWeight={600}
                        letterSpacing="0.04em" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                    Minutos por sesión
                  </Text>
                  <Flex gap={2} wrap="wrap" opacity={ejDias === 0 ? 0.4 : 1} pointerEvents={ejDias === 0 ? "none" : "auto"}>
                    {MINUTOS_OPC.map((m) => (
                      <Opcion key={m} activo={ejMinutos === m} label={`${m}′`} onClick={() => setEjMinutos(m)} />
                    ))}
                  </Flex>
                </Flex>
              </SimpleGrid>
              {ejDias === 0 && (
                <Text color="rgba(255,255,255,0.5)" fontSize="2xs" fontStyle="italic" mb={4}>
                  Pon al menos 1 día para contar el ejercicio.
                </Text>
              )}
              <Box h={ejDias === 0 ? 1 : 5} />

              {/* Objetivo */}
              <Text color={nutricionTxt} fontSize="xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase" mb={2}>
                Objetivo
              </Text>
              <Flex gap={2.5} wrap="wrap">
                {OBJETIVOS.map((o) => (
                  <Opcion key={o.key} activo={objetivo === o.key} label={o.label} onClick={() => setObjetivo(o.key)} />
                ))}
              </Flex>
            </Box>
          </Reveal>

          {/* ── RESULTADO ── */}
          {resultado && (
            <Reveal direction="up" distance={20} delay={0.05} duration={0.6} w="100%">
              <Box w="100%" borderRadius="2xl" px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}
                   bg={`${nutricionBg}66`} border={`1px solid ${nutricionTxt}77`}
                   style={{ boxShadow: `0 0 20px ${nutricionTxt}22, inset 0 0 26px rgba(0,0,0,0.18)` }}>

                <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }} textAlign="center"
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
                  Tu objetivo diario aproximado
                </Text>
                <Text color="white" fontSize={{ base: "4xl", md: "5xl" }} fontWeight={700} textAlign="center" lineHeight="1.1"
                      style={{ textShadow: `0 1px 10px rgba(0,0,0,0.5), 0 0 22px ${nutricionTxt}55` }}>
                  {resultado.kcal} <Text as="span" fontSize={{ base: "xl", md: "2xl" }} fontWeight={600}>kcal</Text>
                </Text>
                <Text color="rgba(255,255,255,0.6)" fontSize="xs" textAlign="center" mt={1}>
                  Metabolismo basal ≈ {resultado.bmr} kcal · gasto total ≈ {resultado.tdee} kcal
                  {resultado.ejKcalDia > 0 && <> · ejercicio ≈ +{resultado.ejKcalDia} kcal/día</>}
                </Text>
                <Text color={nutricionTxt} fontSize="sm" textAlign="center" mt={4} fontStyle="italic"
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
                  Guardado. Ya puedes «Diseñar tu día» con estas calorías.
                </Text>

                <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={{ base: 3, md: 5 }} mt={5}>
                  <MacroBox nombre="Proteínas" gramos={resultado.prot.g} kcal={resultado.prot.kcal} color="#d75f5a" />
                  <MacroBox nombre="Hidratos" gramos={resultado.carb.g} kcal={resultado.carb.kcal} color="#e0a92e" />
                  <MacroBox nombre="Grasas" gramos={resultado.fat.g} kcal={resultado.fat.kcal} color="#e58a3c" />
                </SimpleGrid>
              </Box>
            </Reveal>
          )}

          {/* Nota educativa. */}
          <Reveal direction="up" distance={14} delay={0.05} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="660px" lineHeight="1.6">
              Este cálculo es orientativo y con fin educativo. Es una estimación estadística: tus necesidades reales
              pueden variar. No sustituye la valoración de un profesional de la nutrición.
            </Text>
          </Reveal>

        </Flex>
      </Flex>

      <IndiceNutricion />
      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
