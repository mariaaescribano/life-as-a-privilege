import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { glowHeader } from "../../components/metodo/FotoBox";
import { Reveal, Float, Contador } from "../../components/global/Reveal";
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

// ── EJERCICIO deliberado. Preguntamos qué haces, cuánto y con qué intensidad.
// En vez de sumar solo las kcal "puras" del ejercicio (que para personas de poco
// peso se quedan muy cortas), lo usamos para SUBIR el factor de actividad —igual
// que los multiplicadores clásicos (sedentario 1.2 → muy activo ~1.9)—. `peso` es
// el peso relativo de cada intensidad al acumular la carga semanal.
const INTENSIDADES: { key: string; label: string; desc: string; peso: number }[] = [
  { key: "suave",    label: "Suave",    desc: "andar, yoga, estiramientos", peso: 0.6 },
  { key: "moderado", label: "Moderado", desc: "bici, pesas, nadar suave",   peso: 1 },
  { key: "intenso",  label: "Intenso",  desc: "correr, HIIT, deporte fuerte", peso: 1.5 },
];

// Minutos por sesión (opciones rápidas).
const MINUTOS_OPC = [20, 30, 45, 60, 90];

const OBJETIVOS: { key: Objetivo; label: string; ajuste: number }[] = [
  { key: "perder",   label: "Perder grasa", ajuste: -0.15 },
  { key: "mantener", label: "Mantener",     ajuste: 0 },
  { key: "ganar",    label: "Ganar músculo", ajuste: 0.10 },
];

// Suelo de seguridad: no recomendamos por debajo de un mínimo saludable (comer
// muy por debajo pasa factura). Evita sugerir cifras peligrosamente bajas.
const SUELO_KCAL: Record<Sexo, number> = { mujer: 1500, hombre: 1800 };

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
      color={activo ? nutricionBg : nutricionTxt}
      bg={activo ? nutricionTxt : `${nutricionTxt}0f`}
      border={`1px solid ${activo ? nutricionTxt : `${nutricionTxt}44`}`}
      cursor="pointer"
      transition="all 0.18s ease"
      _hover={activo ? undefined : { bg: `${nutricionTxt}1f`, borderColor: `${nutricionTxt}88` }}
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
      <Text color={nutricionTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={600} letterSpacing="0.04em">
        {label}
      </Text>
      <Flex align="center" gap={2}>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          inputMode="numeric"
          placeholder="—"
          maxW="110px"
          bg="#ffffffcc"
          border={`1px solid ${nutricionTxt}33`}
          color={nutricionTxt}
          fontWeight={600}
          _hover={{ borderColor: `${nutricionTxt}66` }}
          _focusVisible={{ borderColor: nutricionTxt, boxShadow: `0 0 0 1px ${nutricionTxt}` }}
          _placeholder={{ color: `${nutricionTxt}55` }}
        />
        <Text color={`${nutricionTxt}aa`} fontSize={{ base: "sm", md: "md" }}>{sufijo}</Text>
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
         color={disabled ? `${nutricionTxt}33` : nutricionTxt}
         bg={`${nutricionTxt}0f`} border={`1px solid ${nutricionTxt}${disabled ? "22" : "55"}`}
         cursor={disabled ? "not-allowed" : "pointer"} transition="all 0.15s ease"
         _hover={disabled ? undefined : { bg: `${nutricionTxt}1f`, borderColor: nutricionTxt }}
         sx={{ touchAction: "manipulation", userSelect: "none", WebkitTapHighlightColor: "transparent" }}>
      {txt}
    </Box>
  );
  return (
    <Flex direction="column" gap={1.5}>
      <Text color={nutricionTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={600} letterSpacing="0.04em">
        {label}
      </Text>
      <Flex align="center" gap={2.5}>
        {btn("−", -1, value <= min)}
        <Text color={nutricionTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight={700} minW="70px" textAlign="center">
          {value} <Text as="span" fontSize="sm" fontWeight={500} color={`${nutricionTxt}aa`}>{sufijo}</Text>
        </Text>
        {btn("+", +1, value >= max)}
      </Flex>
    </Flex>
  );
}

// ── Marco de sección con el fondo acuarela de Nutrición (diseño nutri) ──
function SeccionBox({ children, ...rest }: React.ComponentProps<typeof Box>) {
  return (
    <Box position="relative" overflow="hidden" w="100%" borderRadius="2xl"
         boxShadow={glowHeader(nutricionTxt)} {...rest}>
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}4d`} />
      <Box position="relative" zIndex={1}>{children}</Box>
    </Box>
  );
}

// ── Tarjeta de resultado de un macro ──
function MacroBox({ nombre, gramos, kcal, color }: { nombre: string; gramos: number; kcal: number; color: string }) {
  return (
    <Box borderRadius="xl" px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }} textAlign="center"
         bg="#ffffff66" border={`1px solid ${color}66`}
         boxShadow={`0 0 14px ${color}1e, inset 0 1px 0 rgba(255,255,255,0.5)`}
         transition="transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease"
         _hover={{ transform: "translateY(-3px)",
                   boxShadow: `0 0 22px ${color}38, inset 0 1px 0 rgba(255,255,255,0.6)` }}>
      <Text color={color} fontSize="2xs" fontWeight={700} letterSpacing="0.16em" textTransform="uppercase">
        {nombre}
      </Text>
      {/* Los gramos CUENTAN hasta su valor, y vuelven a contar cada vez que se
          toca un control del formulario: el resultado se ve reaccionar. */}
      <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} lineHeight="1.1" mt={1}>
        <Contador valor={gramos} duracion={0.9} /> g
      </Text>
      <Text color={`${nutricionTxt}99`} fontSize={{ base: "xs", md: "sm" }} mt={1}>
        <Contador valor={kcal} duracion={0.9} /> kcal
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
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }
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

  // Cálculo (Mifflin-St Jeor → metabolismo basal; × factor de actividad que
  // combina el día a día con el ejercicio → gasto total; × ajuste del objetivo
  // → calorías recomendadas, con un suelo saludable). Macros: proteína 1.8 g/kg,
  // grasa 25 %, resto hidratos.
  const resultado = useMemo(() => {
    const e = Number(edad), p = Number(peso), a = Number(altura);
    if (!e || !p || !a || e < 10 || e > 100 || p < 25 || p > 300 || a < 100 || a > 250) return null;

    const bmr = 10 * p + 6.25 * a - 5 * e + (sexo === "hombre" ? 5 : -161);

    // Factor de actividad = base (NEAT) + incremento por ejercicio. El ejercicio
    // se acumula como «sesiones equivalentes» (días × duración/45min × intensidad)
    // y sube el factor con tope, para acercarse a los multiplicadores clásicos.
    const factorBase = BASES.find((x) => x.key === base)?.factor ?? 1.2;
    const pesoInt = INTENSIDADES.find((x) => x.key === ejIntensidad)?.peso ?? 1;
    const carga = ejDias * (ejMinutos / 45) * pesoInt;
    const ejIncremento = Math.min(0.6, 0.09 * carga);
    const factorTotal = factorBase + ejIncremento;
    const tdee = bmr * factorTotal;
    const ejKcalDia = Math.round(bmr * ejIncremento); // aporte del ejercicio/día

    const ajuste = OBJETIVOS.find((x) => x.key === objetivo)?.ajuste ?? 0;
    let kcal = Math.round((tdee * (1 + ajuste)) / 10) * 10;

    // Suelo de seguridad.
    const suelo = SUELO_KCAL[sexo];
    const bajoSuelo = kcal < suelo;
    if (bajoSuelo) kcal = suelo;

    const protG = Math.round(1.8 * p);
    const protKcal = protG * 4;
    const fatKcal = Math.round(kcal * 0.25);
    const fatG = Math.round(fatKcal / 9);
    const carbKcal = Math.max(0, kcal - protKcal - fatKcal);
    const carbG = Math.round(carbKcal / 4);

    return {
      bmr: Math.round(bmr), tdee: Math.round(tdee), kcal,
      ejKcalDia, bajoSuelo, suelo,
      prot: { g: protG, kcal: protKcal },
      fat: { g: fatG, kcal: fatKcal },
      carb: { g: carbG, kcal: carbKcal },
    };
  }, [sexo, edad, peso, altura, base, ejIntensidad, ejDias, ejMinutos, objetivo]);

  // Construye el blob a guardar con las calorías calculadas (null si no hay
  // resultado válido). Reutilizado por el guardado con debounce y por el flush
  // inmediato al pasar a «Diseña tu día».
  const construirDatosCalorias = () => {
    if (!resultado) return null;
    return {
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
  };

  // Guarda YA las calorías (sin esperar al debounce). Se usa antes de navegar a
  // «Diseña tu día» para que esa página encuentre `calorias.hecho` en el servidor
  // y no rebote/quede bloqueada por la carrera del debounce.
  const guardarCaloriasAhora = async () => {
    const data = construirDatosCalorias();
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!data || !userId || !token) return;
    dataRef.current = data;
    try {
      await axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
    } catch { /* si falla, «Diseña tu día» mostrará el candado */ }
  };

  // Guarda el resultado (y las entradas, para prerrellenar y para desbloquear
  // «Diseña tu día»). Se dispara cuando hay un resultado válido.
  useEffect(() => {
    if (!resultado) return;
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const t = setTimeout(() => {
      const data = construirDatosCalorias();
      if (!data) return;
      dataRef.current = data;
      axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } }).catch(() => { /* reintenta al próximo cambio */ });
    }, 700); // debounce: no guardar en cada tecla
    return () => clearTimeout(t);
  }, [resultado, sexo, edad, peso, altura, base, ejIntensidad, ejDias, ejMinutos, objetivo]);

  if (loading) return <NutricionLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<Float amplitude={5} duration={5}><NutricionIcon size={{ base: "40px", md: "56px" }} /></Float>}
              title="Tus calorías y macros"
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: "← Tu plato", onClick: () => navigate("/metodo/nutricion/plato") }}
              extra={{ label: "Biblioteca", onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{
                label: "Test →",
                disabled: !resultado,
                disabledTooltip: "Calcula tus calorías para continuar",
                onClick: async () => {
                  if (!resultado) return;
                  await guardarCaloriasAhora(); // flush antes de navegar (evita el candado por debounce)
                  navigate("/metodo/nutricion/prediabetes");
                },
              }}
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
          <Reveal inView direction="up" distance={20} delay={0.14} duration={0.6} w="100%">
            <SeccionBox>
              <Box px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>

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
                    <Text color={nutricionTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={600} letterSpacing="0.04em">
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
                  <Text color={`${nutricionTxt}88`} fontSize="2xs" fontStyle="italic" mb={4}>
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
            </SeccionBox>
          </Reveal>

          {/* ── RESULTADO ── */}
          {resultado && (
            <Reveal inView direction="up" distance={20} delay={0.05} duration={0.6} w="100%">
              <SeccionBox>
                <Box px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>

                  <Text color={`${nutricionTxt}cc`} fontSize={{ base: "sm", md: "md" }} textAlign="center">
                    Tu objetivo diario aproximado
                  </Text>
                  <Text color={nutricionTxt} fontSize={{ base: "4xl", md: "5xl" }} fontWeight={700} textAlign="center" lineHeight="1.1">
                    <Contador valor={resultado.kcal} duracion={1.2} />{" "}
                    <Text as="span" fontSize={{ base: "xl", md: "2xl" }} fontWeight={600}>kcal</Text>
                  </Text>
                  <Text color={`${nutricionTxt}99`} fontSize="xs" textAlign="center" mt={1}>
                    Metabolismo basal ≈ {resultado.bmr} kcal · gasto total ≈ {resultado.tdee} kcal
                    {resultado.ejKcalDia > 0 && <> · ejercicio ≈ +{resultado.ejKcalDia} kcal/día</>}
                  </Text>
                  {resultado.bajoSuelo && (
                    <Text color={`${nutricionTxt}aa`} fontSize="2xs" textAlign="center" mt={1} fontStyle="italic">
                      Ajustado al mínimo saludable ({resultado.suelo} kcal): comer por debajo no es recomendable.
                    </Text>
                  )}
                  <Text color={nutricionTxt} fontSize="sm" textAlign="center" mt={4} fontStyle="italic">
                    Guardado. Ya puedes seguir con el resto del recorrido.
                  </Text>

                  <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={{ base: 3, md: 5 }} mt={5}>
                    <MacroBox nombre="Proteínas" gramos={resultado.prot.g} kcal={resultado.prot.kcal} color="#d75f5a" />
                    <MacroBox nombre="Hidratos" gramos={resultado.carb.g} kcal={resultado.carb.kcal} color="#e0a92e" />
                    <MacroBox nombre="Grasas" gramos={resultado.fat.g} kcal={resultado.fat.kcal} color="#e58a3c" />
                  </SimpleGrid>
                </Box>
              </SeccionBox>
            </Reveal>
          )}

          {/* Nota educativa. */}
          <Reveal inView direction="up" distance={14} delay={0.05} duration={0.6} w="100%" display="flex" justifyContent="center">
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
