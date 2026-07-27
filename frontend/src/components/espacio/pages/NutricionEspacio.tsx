import React, { useEffect, useRef, useState } from "react";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { MetodoStepHeader } from "../../metodo/MetodoStepHeader";
import { NutricionIcon, CalculadoraIcon, nutricionBg, nutricionNom, nutricionTxt, API_URL } from "../../../GlobalVariables";
import { generateNutricionPdf } from "../../../utils/generateNutricionPdf";

const BG   = nutricionBg;
const TXT  = nutricionTxt;
const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";
const BASE = "/img/nutri/curso1";

// Fondo de la disciplina Nutrición para los boxes (mismo que el header).
const nutriBoxBg = {
  bgColor: nutricionBg,
  bgImage: "url('/img/fondos/nutri.webp')",
  bgSize: "cover",
  bgPosition: "center",
  bgRepeat: "no-repeat",
};

// ── Types ──────────────────────────────────────────────────────────────────
type Genero = "mujer" | "hombre";
type Actividad = { label: string; desc: string; factor: number };
type Resultado = {
  tdee: number;
  protKcal: number; protG: number;
  carbKcal: number; carbG: number;
  fatKcal: number;  fatG: number;
};
type Alimento = { id: string; nom: string; emoji: string; imgPath: string; descripcion: string; valores: { label: string; valor: string }[] };
type ModalData = { alimento: Alimento };

// ── Activity options ───────────────────────────────────────────────────────
const ACTIVIDADES: Actividad[] = [
  { label: "Sedentario",            desc: "Poco o sin ejercicio",   factor: 1.2   },
  { label: "Ligeramente activo",    desc: "1–3 días por semana",    factor: 1.375 },
  { label: "Moderadamente activo",  desc: "3–5 días por semana",    factor: 1.55  },
  { label: "Muy activo",            desc: "6–7 días por semana",    factor: 1.725 },
  { label: "Extremadamente activo", desc: "Trabajo físico intenso", factor: 1.9   },
];

// ── Mifflin-St Jeor ────────────────────────────────────────────────────────
function calcular(peso: number, altura: number, edad: number, genero: Genero, factor: number): Resultado {
  const bmr = genero === "hombre"
    ? 10 * peso + 6.25 * altura - 5 * edad + 5
    : 10 * peso + 6.25 * altura - 5 * edad - 161;
  const tdee = Math.round(bmr * factor);
  const protKcal = Math.round(tdee * 0.25);
  const carbKcal = Math.round(tdee * 0.45);
  const fatKcal  = Math.round(tdee * 0.30);
  return { tdee, protKcal, protG: Math.round(protKcal / 4), carbKcal, carbG: Math.round(carbKcal / 4), fatKcal, fatG: Math.round(fatKcal / 9) };
}

// ── Food data ──────────────────────────────────────────────────────────────
const proteinasAlimentos: Alimento[] = [
  { id: "p1", nom: "Huevo",     emoji: "🥚", imgPath: BASE+"/huevo.jpg",      descripcion: "Una de las proteínas más completas y biodisponibles que existen. Contiene todos los aminoácidos esenciales en proporciones casi perfectas.",    valores: [{ label: "Calorías", valor: "~155 kcal" }, { label: "Proteínas", valor: "~13 g" }, { label: "G. insaturadas", valor: "~6 g" }, { label: "G. saturadas", valor: "~3 g" }, { label: "Carbohidratos", valor: "~1 g" }, { label: "Fibra", valor: "~0 g" }] },
  { id: "p2", nom: "Legumbres",  emoji: "🫘", imgPath: BASE+"/legumbres.jpg",  descripcion: "Fuente excelente de proteína vegetal combinada con fibra y carbohidratos complejos. Lentejas, garbanzos y alubias son básicos de una dieta equilibrada.", valores: [{ label: "Calorías", valor: "~130 kcal" }, { label: "Proteínas", valor: "~9 g" }, { label: "G. insaturadas", valor: "~0.3 g" }, { label: "G. saturadas", valor: "~0.1 g" }, { label: "Carbohidratos", valor: "~22 g" }, { label: "Fibra", valor: "~8 g" }] },
  { id: "p3", nom: "Pescado",   emoji: "🐟", imgPath: BASE+"/pescado.jpg",    descripcion: "Proteína de alta calidad combinada con omega-3, que reduce la inflamación y protege el sistema cardiovascular.",                               valores: [{ label: "Calorías", valor: "~130 kcal" }, { label: "Proteínas", valor: "~22 g" }, { label: "G. insaturadas", valor: "~3 g" }, { label: "G. saturadas", valor: "~1 g" }, { label: "Carbohidratos", valor: "~0 g" }, { label: "Fibra", valor: "~0 g" }] },
  { id: "p4", nom: "Tofu",      emoji: "🧱", imgPath: BASE+"/tofu.jpg",       descripcion: "Proteína vegetal completa derivada de la soja. Versátil y suave, es una excelente alternativa a la proteína animal.",                           valores: [{ label: "Calorías", valor: "~76 kcal" }, { label: "Proteínas", valor: "~8 g" }, { label: "G. insaturadas", valor: "~3 g" }, { label: "G. saturadas", valor: "~0.5 g" }, { label: "Carbohidratos", valor: "~2 g" }, { label: "Fibra soluble", valor: "~0.1 g" }] },
  { id: "p5", nom: "Soja",      emoji: "🫘", imgPath: BASE+"/soja.jpg",       descripcion: "Una de las pocas proteínas vegetales completas. Rica en todos los aminoácidos esenciales, además de fibra y grasas saludables.",                  valores: [{ label: "Calorías", valor: "~446 kcal" }, { label: "Proteínas", valor: "~36 g" }, { label: "G. insaturadas", valor: "~15 g" }, { label: "G. saturadas", valor: "~3 g" }, { label: "Carbohidratos", valor: "~30 g" }, { label: "Fibra soluble", valor: "~3 g" }] },
  { id: "p6", nom: "Guisantes", emoji: "🫛", imgPath: BASE+"/guisantes.webp", descripcion: "Proteína vegetal acompañada de fibra, lo que ralentiza su absorción y ayuda a mantener la saciedad por más tiempo.",                           valores: [{ label: "Calorías", valor: "~81 kcal" }, { label: "Proteínas", valor: "~5 g" }, { label: "G. insaturadas", valor: "~0.2 g" }, { label: "G. saturadas", valor: "~0.1 g" }, { label: "Carbohidratos", valor: "~14 g" }, { label: "Fibra soluble", valor: "~2 g" }] },
];

const carbosAlimentos: Alimento[] = [
  { id: "c1", nom: "Verduras",  emoji: "🥦", imgPath: BASE+"/verduras.jpg",  descripcion: "Fuente de fibra, vitaminas y energía de calidad.",                                                                                                  valores: [{ label: "Calorías", valor: "~25 kcal" }, { label: "Carbohidratos", valor: "~5 g" }, { label: "Fibra soluble", valor: "~0.5 g" }, { label: "Fibra insoluble", valor: "~1.5 g" }, { label: "Proteínas", valor: "~1.5 g" }, { label: "Grasas", valor: "~0.2 g" }] },
  { id: "c2", nom: "Frutas",    emoji: "🍎", imgPath: BASE+"/frutas.jpg",    descripcion: "Su fibra es perfecta para permitir que su fructosa sea incorporada en nosotros poco a poco.",                                                      valores: [{ label: "Calorías", valor: "~52 kcal" }, { label: "Carbohidratos", valor: "~14 g" }, { label: "Fibra soluble", valor: "~1 g" }, { label: "Fibra insoluble", valor: "~1 g" }, { label: "Proteínas", valor: "~0.5 g" }, { label: "Grasas", valor: "~0.2 g" }] },
  { id: "c3", nom: "Legumbres", emoji: "🫘", imgPath: BASE+"/legumbres.jpg", descripcion: "A pesar de su mala fama, son de las mejores fuentes de carbohidratos además de venir acompañada de fibra y proteína.",                          valores: [{ label: "Calorías", valor: "~130 kcal" }, { label: "Carbohidratos", valor: "~22 g" }, { label: "Fibra soluble", valor: "~3 g" }, { label: "Fibra insoluble", valor: "~5 g" }, { label: "Proteínas", valor: "~8 g" }, { label: "Grasas", valor: "~0.5 g" }] },
];

const grasasAlimentos: Alimento[] = [
  { id: "g1", nom: "Aguacate",        emoji: "🥑", imgPath: BASE+"/aguacate.jpg",    descripcion: "Rico en ácido oleico, el mismo del aceite de oliva. Nutre la membrana celular y tiene un efecto antiinflamatorio natural.",                valores: [{ label: "Calorías", valor: "~160 kcal" }, { label: "G. insaturadas", valor: "~13 g" }, { label: "G. saturadas", valor: "~2 g" }, { label: "Proteínas", valor: "~2 g" }, { label: "Fibra soluble", valor: "~2 g" }, { label: "Fibra insoluble", valor: "~5 g" }] },
  { id: "g2", nom: "Aceite de oliva", emoji: "🫙", imgPath: BASE+"/aceite.webp",     descripcion: "Su alto contenido en ácido oleico protege las células y reduce la inflamación crónica. Uno de los pilares de la alimentación saludable.",  valores: [{ label: "Calorías", valor: "~884 kcal" }, { label: "G. insaturadas", valor: "~84 g" }, { label: "G. saturadas", valor: "~14 g" }, { label: "Proteínas", valor: "~0 g" }, { label: "Carbohidratos", valor: "~0 g" }, { label: "Fibra", valor: "~0 g" }] },
  { id: "g3", nom: "Frutos secos",    emoji: "🥜", imgPath: BASE+"/frutossecos.jpg", descripcion: "Concentran grasas insaturadas, proteína y fibra en pequeñas dosis. Un snack que nutre de verdad.",                                        valores: [{ label: "Calorías", valor: "~607 kcal" }, { label: "G. insaturadas", valor: "~44 g" }, { label: "G. saturadas", valor: "~7 g" }, { label: "Proteínas", valor: "~14 g" }, { label: "Carbohidratos", valor: "~21 g" }, { label: "Fibra soluble", valor: "~2 g" }] },
];

// ── AlimentoCirculo ────────────────────────────────────────────────────────
function AlimentoCirculo({ alimento, onClick }: { alimento: Alimento; onClick: (d: ModalData) => void }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <Flex direction="column" align="center" gap={2} cursor="pointer" role="button"
      onClick={() => onClick({ alimento })}
      _hover={{ transform: "translateY(-4px)" }} transition="transform 0.2s"
    >
      <Box w={{ base: "68px", md: "80px" }} h={{ base: "68px", md: "80px" }} borderRadius="full" overflow="hidden"
        border={`2px solid ${TXT}33`} boxShadow={`0 4px 14px ${TXT}22`} bg={TXT + "0d"}
        display="flex" alignItems="center" justifyContent="center" flexShrink={0}
        _hover={{ border: `2px solid ${TXT}88` }} transition="all 0.2s"
      >
        {imgFailed
          ? <Text fontSize="2xl" lineHeight="1">{alimento.emoji}</Text>
          : <Box as="img" src={alimento.imgPath} alt={alimento.nom} w="100%" h="100%" objectFit="cover" onError={() => setImgFailed(true)} />
        }
      </Box>
      <Text color={TXT} fontSize={{ base: "xs", md: "sm" }} fontFamily="'EB Garamond', serif" textAlign="center" fontWeight="600" maxW="80px" lineHeight="1.2">
        {alimento.nom}
      </Text>
    </Flex>
  );
}

// ── AlimentoModal ──────────────────────────────────────────────────────────
function AlimentoModal({ data, onClose }: { data: ModalData; onClose: () => void }) {
  const { alimento } = data;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
  }, [onClose]);
  return (
    <Box position="fixed" inset={0} zIndex={1100} bg="rgba(0,0,0,0.75)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex" alignItems="center" justifyContent="center" px={4} py={6} onClick={onClose}
    >
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative"
        w="95vw" maxW="480px" maxH="90vh" overflowY="auto" borderRadius="24px" bg={BG}
        border={`1px solid ${TXT}33`} boxShadow={`0 32px 80px rgba(0,0,0,0.5)`}
        sx={{ "&::-webkit-scrollbar": { width: "4px" }, "&::-webkit-scrollbar-thumb": { background: TXT + "44", borderRadius: "999px" } }}
      >
        <Box as="button" position="absolute" top="14px" right="14px" w="34px" h="34px" borderRadius="full"
          bg={TXT + "15"} border={`1px solid ${TXT}33`} display="flex" alignItems="center" justifyContent="center"
          color={TXT} fontSize="15px" fontWeight="700" cursor="pointer" _hover={{ bg: TXT + "28" }} onClick={onClose}
        >✕</Box>
        <Box px={{ base: 6, md: 8 }} pt={8} pb={7}>
          <Flex align="center" gap={4} mb={5}>
            <Box w="72px" h="72px" borderRadius="xl" overflow="hidden" flexShrink={0} border={`2px solid ${TXT}33`}>
              <Box as="img" src={alimento.imgPath} alt={alimento.nom} w="100%" h="100%" objectFit="cover" />
            </Box>
            <Text color={TXT} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" fontFamily="'EB Garamond', serif" lineHeight="1.2">
              {alimento.nom}
            </Text>
          </Flex>
          <Box bg={TXT + "0c"} borderLeft={`3px solid ${TXT}55`} borderRadius="0 xl xl 0" px={{ base: 4, md: 5 }} py={4} mb={5}>
            <Text color={TXT} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" fontFamily="'EB Garamond', serif" fontStyle="italic">
              {alimento.descripcion}
            </Text>
          </Box>
          <Box h="1px" bg={TXT + "22"} mb={4} />
          <Text color={TXT} fontSize="sm" fontFamily="'EB Garamond', serif" fontWeight="600" letterSpacing="0.05em" mb={3}>
            Valores nutricionales (por 100 g)
          </Text>
          <Flex flexWrap="wrap" gap={2}>
            {alimento.valores.map((v) => (
              <Box key={v.label} flex="1" minW="90px" bg={TXT + "0a"} border={`1px solid ${TXT}1a`} borderRadius="xl" px={3} py={2}>
                <Text color={TXT + "77"} fontSize="11px" fontFamily="'EB Garamond', serif" mb={0.5}>{v.label}</Text>
                <Text color={TXT} fontSize="md" fontWeight="700" fontFamily="'EB Garamond', serif">{v.valor}</Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

// ── NumInput ───────────────────────────────────────────────────────────────
function NumInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <Box flex={1} minW="80px">
      <Text color={TXT + "88"} fontSize="xs" fontFamily="'EB Garamond', serif" fontWeight="600" mb={1} letterSpacing="0.06em" textTransform="uppercase">
        {label}
      </Text>
      <Box as="input" type="number" value={value} placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        min={0} w="100%" px={3} py={2} bg={TXT + "0a"} border={`1.5px solid ${TXT}33`}
        borderRadius="xl" color={TXT} fontFamily="'EB Garamond', serif" fontSize="lg" fontWeight="600" outline="none"
        sx={{ "&:focus": { border: `1.5px solid ${TXT}88`, background: TXT + "14" }, "&::placeholder": { color: TXT + "44" }, "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": { WebkitAppearance: "none" }, MozAppearance: "textfield" }}
      />
    </Box>
  );
}

// ── MacroCard ──────────────────────────────────────────────────────────────
function MacroCard({ label, grams, kcal, alimentos, onSelect }: {
  label: string; grams: number; kcal: number;
  alimentos: Alimento[]; onSelect: (d: ModalData) => void;
}) {
  return (
    <Box {...nutriBoxBg} borderRadius="2xl" border={`1px solid ${TXT}22`} boxShadow={GLOW}
      px={{ base: 5, md: 8 }} py={{ base: 5, md: 7 }} w="100%" maxW="780px"
    >
      {/* Header */}
      <Flex justify="space-between" align="center" mb={5}>
        <Text color={TXT} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" fontFamily="'EB Garamond', serif" lineHeight="1.1">
          {label}
        </Text>
        <Flex gap={2} align="baseline">
          <Text color={TXT} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" fontFamily="'EB Garamond', serif" lineHeight="1">
            {grams} g
          </Text>
          <Text color={TXT + "66"} fontSize={{ base: "md", md: "lg" }} fontFamily="'EB Garamond', serif">
            {kcal} kcal
          </Text>
        </Flex>
      </Flex>

      {/* Divider */}
      <Box h="1px" bg={TXT + "18"} mb={5} />

      {/* Food circles */}
      <Text color={TXT + "77"} fontSize="xs" fontFamily="'EB Garamond', serif" fontWeight="600" letterSpacing="0.08em" textTransform="uppercase" mb={4}>
        Fuentes recomendadas
      </Text>
      <Box
        display={{ base: "grid", md: "flex" }}
        gridTemplateColumns={{ base: "repeat(3, 1fr)", md: undefined }}
        justifyContent={{ md: "center" }}
        justifyItems={{ base: "center", md: undefined }}
        gap={{ base: 3, md: 5 }}
      >
        {alimentos.map(a => <AlimentoCirculo key={a.id} alimento={a} onClick={onSelect} />)}
      </Box>
    </Box>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function NutricionEspacio({ isGuest = false }: { isGuest?: boolean }) {
  const navigate = useNavigate();
  const [peso,     setPeso]    = useState("");
  const [altura,   setAltura]  = useState("");
  const [edad,     setEdad]    = useState("");
  const [genero,   setGenero]  = useState<Genero>("mujer");
  const [actIdx,   setActIdx]  = useState<number | null>(null);
  const [result,   setResult]  = useState<Resultado | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [error,    setError]   = useState("");
  const [selected, setSelected] = useState<ModalData | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (!userId) return;
    axios.get(`${API_URL}/nutricion/${userId}`).then(res => {
      const d = res.data;
      if (!d) return;
      if (d.peso)   setPeso(String(d.peso));
      if (d.altura) setAltura(String(d.altura));
      if (d.edad)   setEdad(String(d.edad));
      if (d.genero) setGenero(d.genero);
      if (d.actividad_idx != null) setActIdx(d.actividad_idx);
      if (d.tdee) {
        setResult({
          tdee:     d.tdee,
          protG:    d.prot_g, protKcal: Math.round(d.prot_g * 4),
          carbG:    d.carb_g, carbKcal: Math.round(d.carb_g * 4),
          fatG:     d.fat_g,  fatKcal:  Math.round(d.fat_g  * 9),
        });
        setShowForm(false);
      }
    }).catch(() => {});
  }, []);

  const handleCalcular = () => {
    const p = parseFloat(peso); const h = parseFloat(altura); const e = parseFloat(edad);
    if (!p || !h || !e || actIdx === null) { setError("Por favor completa todos los campos."); return; }
    if (p < 20 || p > 300)  { setError("Introduce un peso válido (20–300 kg)."); return; }
    if (h < 100 || h > 250) { setError("Introduce una altura válida (100–250 cm)."); return; }
    if (e < 10 || e > 120)  { setError("Introduce una edad válida (10–120 años)."); return; }
    setError("");
    const r = calcular(p, h, e, genero, ACTIVIDADES[actIdx].factor);
    setResult(r);
    setShowForm(false);
    if (userId) {
      axios.post(`${API_URL}/nutricion`, {
        userId, peso: p, altura: h, edad: e, genero, actividadIdx: actIdx,
        tdee: r.tdee, protG: r.protG, carbG: r.carbG, fatG: r.fatG,
      }).catch(() => {});
    }
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 80);
  };

  const handleRecalcular = () => {
    setResult(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (userId) {
      axios.delete(`${API_URL}/nutricion/${userId}`).catch(() => {});
    }
  };

  const canCalc = peso && altura && edad && actIdx !== null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />
      <Box flex="1">
        <Flex direction="column" alignItems="center" gap={{ base: 6, md: 8 }}
          px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 14 }} pb={{ base: 14, md: 20 }}
        >
          <MetodoStepHeader
            icon={isGuest
              ? <CalculadoraIcon />
              : <NutricionIcon size={{ base: "35px", md: "45px" }} />
            }
            title={isGuest ? "Calcular necesidades" : nutricionNom}
            bgColor={BG} color={TXT} mb={{ base: 0, md: 0 }}
            nom={nutricionNom}
            prev={{ label: "← Volver", onClick: () => navigate("/aprendizaje/cursos/nutricion") }}
          />

          {/* ── Accesos rápidos favoritos ── */}
          {userId && (
            <Flex gap={4} w="100%" maxW="780px" justify="center">
              <Box
                as="button"
                flex="1"
                {...nutriBoxBg}
                border={`1px solid ${TXT}33`}
                borderRadius="2xl"
                boxShadow={GLOW}
                py={{ base: 4, md: 5 }}
                px={4}
                cursor="pointer"
                transition="all 0.22s"
                _hover={{ transform: "translateY(-3px)", boxShadow: "0 8px 28px rgba(0,0,0,0.28), 0 0 32px rgba(107,196,200,1)" }}
                onClick={() => navigate("/aprendizaje/herbario/favoritos")}
              >
                <Text color={TXT} fontSize={{ base: "md", md: "lg" }} fontWeight="700"
                  fontFamily="'EB Garamond', serif" letterSpacing="0.03em"
                >
                  🌿 Mis plantas
                </Text>
              </Box>
              <Box
                as="button"
                flex="1"
                {...nutriBoxBg}
                border={`1px solid ${TXT}33`}
                borderRadius="2xl"
                boxShadow={GLOW}
                py={{ base: 4, md: 5 }}
                px={4}
                cursor="pointer"
                transition="all 0.22s"
                _hover={{ transform: "translateY(-3px)", boxShadow: "0 8px 28px rgba(0,0,0,0.28), 0 0 32px rgba(107,196,200,1)" }}
                onClick={() => navigate("/aprendizaje/alimentos/favoritos")}
              >
                <Text color={TXT} fontSize={{ base: "md", md: "lg" }} fontWeight="700"
                  fontFamily="'EB Garamond', serif" letterSpacing="0.03em"
                >
                  🍎 Mis alimentos
                </Text>
              </Box>
            </Flex>
          )}

          {/* ── Form ── */}
          {showForm && (
            <Box {...nutriBoxBg} mt="10px" borderRadius="2xl" boxShadow={GLOW} border={`1px solid ${TXT}22`}
              px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }} w="100%" maxW="780px"
            >
              <Text color={TXT} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" fontFamily="'EB Garamond', serif" mb={1}>
                Calcula tus necesidades
              </Text>
              <Text color={TXT + "88"} fontSize={{ base: "sm", md: "md" }} fontFamily="'EB Garamond', serif" mb={7} fontStyle="italic">
                Estimación de calorías diarias y distribución de macronutrientes.
              </Text>

              <Flex gap={4} mb={6} flexWrap={{ base: "wrap", md: "nowrap" }}>
                <NumInput label="Peso (kg)"   value={peso}   onChange={setPeso}   placeholder="70" />
                <NumInput label="Altura (cm)" value={altura} onChange={setAltura} placeholder="165" />
                <NumInput label="Edad (años)" value={edad}   onChange={setEdad}   placeholder="30" />
              </Flex>

              <Box mb={6}>
                <Text color={TXT + "88"} fontSize="xs" fontFamily="'EB Garamond', serif" fontWeight="600" mb={2} letterSpacing="0.06em" textTransform="uppercase">Género</Text>
                <Flex gap={3}>
                  {(["mujer", "hombre"] as Genero[]).map(g => (
                    <Box key={g} as="button" onClick={() => setGenero(g)} flex={1} py={2} borderRadius="xl"
                      border={`1.5px solid ${genero === g ? TXT + "99" : TXT + "28"}`}
                      bg={genero === g ? TXT + "18" : "transparent"} color={TXT}
                      fontFamily="'EB Garamond', serif" fontSize="md" fontWeight={genero === g ? "700" : "400"}
                      cursor="pointer" transition="all 0.18s" _hover={{ bg: TXT + "10" }} textTransform="capitalize"
                    >{g === "mujer" ? "Mujer" : "Hombre"}</Box>
                  ))}
                </Flex>
              </Box>

              <Box mb={7}>
                <Text color={TXT + "88"} fontSize="xs" fontFamily="'EB Garamond', serif" fontWeight="600" mb={2} letterSpacing="0.06em" textTransform="uppercase">Nivel de actividad</Text>
                <Flex direction="column" gap={2}>
                  {ACTIVIDADES.map((act, i) => (
                    <Box key={i} as="button" onClick={() => setActIdx(i)}
                      display="flex" alignItems="center" justifyContent="space-between"
                      px={4} py={3} borderRadius="xl"
                      border={`1.5px solid ${actIdx === i ? TXT + "99" : TXT + "22"}`}
                      bg={actIdx === i ? TXT + "14" : TXT + "04"} cursor="pointer"
                      transition="all 0.18s" _hover={{ bg: TXT + "0e" }} textAlign="left"
                    >
                      <Box>
                        <Text color={TXT} fontFamily="'EB Garamond', serif" fontSize="md" fontWeight={actIdx === i ? "700" : "500"} lineHeight="1.2">{act.label}</Text>
                        <Text color={TXT + "66"} fontFamily="'EB Garamond', serif" fontSize="sm">{act.desc}</Text>
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

              {error && <Text color="#c62828" fontSize="sm" fontFamily="'EB Garamond', serif" mb={4} fontStyle="italic">{error}</Text>}

              <Box as="button" onClick={handleCalcular} w="100%" py={3} borderRadius="xl"
                bg={canCalc ? TXT : TXT + "44"} color={canCalc ? BG : BG + "99"}
                fontFamily="'EB Garamond', serif" fontSize="lg" fontWeight="700" letterSpacing="0.06em"
                cursor={canCalc ? "pointer" : "not-allowed"} transition="all 0.2s"
                _hover={canCalc ? { opacity: 0.88 } : {}} boxShadow={canCalc ? `0 4px 16px ${TXT}44` : "none"}
              >Calcular</Box>
            </Box>
          )}

          {/* ── Results ── */}
          {result && !showForm && (
            <Box ref={resultRef as React.RefObject<HTMLDivElement>} w="100%" maxW="780px"
              display="flex" flexDirection="column" alignItems="center" gap={{ base: 5, md: 6 }}
            >
              {/* TDEE */}
              <Box {...nutriBoxBg} borderRadius="2xl" boxShadow={GLOW} border={`1px solid ${TXT}22`}
                px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }} w="100%" textAlign="center"
              >
                <Text color={TXT + "77"} fontSize="sm" fontFamily="'EB Garamond', serif" fontWeight="600" letterSpacing="0.08em" textTransform="uppercase" mb={1}>
                  Calorías diarias estimadas
                </Text>
                <Text color={TXT} fontSize={{ base: "5xl", md: "6xl" }} fontWeight="700" fontFamily="'EB Garamond', serif" lineHeight="1" mb={1}>
                  {result.tdee.toLocaleString()}
                </Text>
                <Text color={TXT + "66"} fontSize="lg" fontFamily="'EB Garamond', serif">kcal / día</Text>
              </Box>

              {/* Macros */}
              <MacroCard label="Proteínas"     grams={result.protG} kcal={result.protKcal} alimentos={proteinasAlimentos} onSelect={setSelected} />
              <MacroCard label="Carbohidratos" grams={result.carbG} kcal={result.carbKcal} alimentos={carbosAlimentos}    onSelect={setSelected} />
              <MacroCard label="Grasas"        grams={result.fatG}  kcal={result.fatKcal}  alimentos={grasasAlimentos}     onSelect={setSelected} />

              {/* Disclaimer + botones */}
              <Box w="100%" px={2} display="flex" flexDirection="column" alignItems="center" gap={3}>
                <Text color="rgba(255,255,255,0.5)" fontSize="xs" fontFamily="'EB Garamond', serif" textAlign="center" fontStyle="italic">
                  Esta estimación es orientativa. Las necesidades reales varían según la composición corporal y el metabolismo individual.
                </Text>
                <Flex gap={3} flexWrap="wrap" justify="center">
                  {result && (
                    <Box as="button" onClick={() => generateNutricionPdf(result, {
                        peso, altura, edad, genero,
                        actividad: actIdx !== null ? ACTIVIDADES[actIdx].label : "",
                      })}
                      px={6} py={2} borderRadius="full" bg={TXT}
                      color={BG} fontFamily="'EB Garamond', serif" fontSize="sm" fontWeight="700" cursor="pointer"
                      _hover={{ opacity: 0.88 }} transition="all 0.18s"
                      boxShadow={`0 3px 12px ${TXT}44`}
                      display="flex" alignItems="center" gap={2}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                        <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                      </svg>
                      Descargar PDF
                    </Box>
                  )}
                  <Box as="button" onClick={handleRecalcular}
                    px={6} py={2} borderRadius="full" border={`1px solid ${TXT}44`} bg={TXT + "0a"}
                    color={TXT} fontFamily="'EB Garamond', serif" fontSize="sm" fontWeight="600" cursor="pointer"
                    _hover={{ bg: TXT + "18" }} transition="all 0.18s"
                  >Recalcular</Box>
                </Flex>
              </Box>
            </Box>
          )}

          {/* INFORMACIÓN IMPORTANTE */}
          <Box w="100%" maxW="780px">
            <Flex
              as="button"
              w="100%"
              align="center"
              justify="center"
              gap={3}
              px={{ base: 5, md: 6 }}
              py={{ base: 4, md: 5 }}
              {...nutriBoxBg}
              border={`1px solid ${TXT}33`}
              borderRadius={infoOpen ? "2xl 2xl 0 0" : "2xl"}
              boxShadow={GLOW}
              cursor="pointer"
              onClick={() => setInfoOpen((o) => !o)}
              transition="border-radius 0.2s"
            >
              <Box color={`${TXT}88`} flexShrink={0}>
                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                  <path d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                </svg>
              </Box>
              <Text color={`${TXT}99`} fontSize="md" fontFamily="'EB Garamond', serif"
                fontWeight="700" letterSpacing="0.1em" textTransform="uppercase"
              >
                Información importante
              </Text>
              <Text color={TXT} fontSize="sm" transition="transform 0.22s"
                transform={infoOpen ? "rotate(180deg)" : "rotate(0deg)"}
              >
                ▾
              </Text>
            </Flex>
            <Collapse in={infoOpen} animateOpacity>
              <Box
                px={{ base: 6, md: 10 }} py={{ base: 5, md: 7 }}
                {...nutriBoxBg} border={`1px solid ${TXT}33`} borderTop="none"
                borderRadius="0 0 2xl 2xl" boxShadow={GLOW}
              >
                <Text color={TXT + "cc"} fontSize={{ base: "md", md: "lg" }} fontFamily="'EB Garamond', serif"
                  lineHeight="1.8" fontStyle="italic"
                >
                  Esto es solo una orientación para conocerse mejor, si deseas una dieta personalizada, contacta con un nutricionista.
                  Si deseas entender más tu cuerpo y profundizar en el efecto de los alimentos en el cuerpo humano, contáctame.
                  <br /><br />
                  Gracias por querer cuidarte con coherencia.
                </Text>
              </Box>
            </Collapse>
          </Box>

        </Flex>
      </Box>

      <SiteFooter />
      {selected && <AlimentoModal data={selected} onClose={() => setSelected(null)} />}
    </Box>
  );
}
