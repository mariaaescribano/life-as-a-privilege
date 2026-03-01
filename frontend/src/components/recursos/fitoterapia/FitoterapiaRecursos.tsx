import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import { fitoterapiaBg, fitoterapiaTxt } from "../../../GlobalVariables";

/* Color de acento en cards (sobre fondo teal oscuro) */
const CARD_COLOR  = fitoterapiaTxt;  // #d5ffd5 — verde menta claro
/* Color de acento en modal (sobre fondo pergamino claro) */
const MODAL_COLOR = fitoterapiaBg;   // #0e590d — verde botánico oscuro

/* ═══════════════════════════════════════════
   TIPOS
═══════════════════════════════════════════ */
type Planta = {
  id: number;
  nombre: string;
  nombreCientifico: string;
  color: string;
  foto: string;
  fotos?: string[];
  uso: string;
  propiedades: string[];
  beneficios: string[];
  formaDeUso: string;
  datosCuriosos?: string[];
  precauciones?: string[];
};

/* ═══════════════════════════════════════════
   DATOS
═══════════════════════════════════════════ */
const plantas: Planta[] = [
  {
    id: 1,
    nombre: "Manzanilla",
    nombreCientifico: "Matricaria chamomilla",
    color: "#c8a83a",
    foto: "/img/plantas/manzanilla.jpg",
    fotos: ["/img/plantas/manzanilla.jpg", "/img/plantas/manzanilla-2.jpg"],
    uso: "Planta de uso interno y externo, indicada especialmente para calmar el sistema digestivo, reducir la ansiedad leve y tratar irritaciones cutáneas. Es una de las plantas más estudiadas y seguras para todas las edades.",
    propiedades: [
      "Apigenina — flavonoide con acción ansiolítica y antiinflamatoria potente",
      "Bisabolol — aceite esencial con propiedades calmantes y cicatrizantes",
      "Camazuleno — antiinflamatorio generado durante la destilación al vapor",
      "Mucílagos — efecto suavizante sobre mucosas digestivas y respiratorias",
      "Ácidos fenólicos — antioxidantes naturales",
    ],
    beneficios: [
      "Calma el sistema nervioso y reduce la ansiedad leve",
      "Alivia cólicos, gases y espasmos digestivos",
      "Antiinflamatoria en pieles sensibles e irritadas",
      "Facilita el sueño cuando se toma en infusión antes de dormir",
      "Cicatrizante y antiséptica en uso tópico",
    ],
    formaDeUso:
      "Infusión: 1–2 cucharaditas de flores secas en 250 ml de agua caliente, reposar 10 min. 2–3 tazas al día. Uso externo: compresas con infusión concentrada o aceite esencial diluido al 2–3 % en aceite portador.",
    datosCuriosos: [
      "Es la hierba medicinal más consumida en forma de infusión en el mundo mediterráneo, por encima del té verde",
      "El camazuleno azulado del aceite esencial no existe en la planta fresca: se forma únicamente durante la destilación al vapor",
      "Los antiguos egipcios la consagraban al dios Ra y la utilizaban en rituales de embalsamamiento por sus propiedades conservantes",
    ],
  },
  {
    id: 2,
    nombre: "Lavanda",
    nombreCientifico: "Lavandula angustifolia",
    color: "#9b8ec4",
    foto: "/img/plantas/lavanda.jpg",
    uso: "Planta aromática con profunda acción sobre el sistema nervioso. Especialmente útil para el estrés, la ansiedad, el insomnio y los dolores musculares de origen tensional.",
    propiedades: [
      "Linalool — principal componente sedante y ansiolítico demostrado",
      "Acetato de linalilo — potencia el efecto calmante del linalool",
      "Flavonoides — acción antioxidante y antiinflamatoria",
      "Cumarinas — contribuyen a la relajación muscular",
    ],
    beneficios: [
      "Reduce el estrés y la ansiedad con eficacia demostrada",
      "Mejora la calidad y profundidad del sueño",
      "Alivia cefaleas tensionales aplicada en sien y nuca",
      "Cicatrizante y antiséptica en quemaduras leves",
      "Repelente natural de insectos",
    ],
    formaDeUso:
      "Aromaterapia: 3–5 gotas en difusor. Uso tópico: aceite esencial diluido al 2 % en aceite portador. Infusión: 1 cucharadita de flores secas en 200 ml, 2 tazas al día.",
    datosCuriosos: [
      "Su nombre proviene del latín 'lavare' (lavar): los romanos la añadían a sus baños públicos para perfumar el agua",
      "Una sola planta de lavanda puede producir más de 1.000 flores y vivir hasta 30 años",
      "Las campos de lavanda de la Provenza francesa se visitan como destino turístico: atraen millones de visitantes cada verano",
    ],
  },
  {
    id: 3,
    nombre: "Jengibre",
    nombreCientifico: "Zingiber officinale",
    color: "#c4793a",
    foto: "/img/plantas/jengibre.jpg",
    uso: "Raíz con extraordinarias propiedades antiinflamatorias, digestivas y circulatorias. Eficaz para náuseas de cualquier origen, digestiones pesadas y procesos inflamatorios crónicos.",
    propiedades: [
      "Gingeroles — potentes antiinflamatorios y antioxidantes presentes en la raíz fresca",
      "Shogaoles — forma más potente de los gingeroles, en la raíz seca",
      "Zingerone — acción analgésica y antinauseosa",
      "Aceites esenciales — propiedades antibacterianas y antimicóticas",
      "Paradoles — efecto termogénico y antiinflamatorio",
    ],
    beneficios: [
      "Alivia náuseas de cualquier origen: embarazo, mareo, quimioterapia",
      "Mejora la digestión y reduce flatulencias",
      "Potente antiinflamatorio en dolores articulares y musculares",
      "Estimula la circulación y calienta el organismo desde dentro",
      "Refuerza el sistema inmune en procesos gripales e infecciosos",
    ],
    formaDeUso:
      "Infusión: 1–2 cm de raíz fresca rallada en 250 ml de agua caliente, reposar 15 min, añadir limón y miel. Uso culinario: platos, batidos, zumos. Precaución en embarazo: dosis moderada.",
    datosCuriosos: [
      "Es una de las especias más antiguas del mundo: se comercializaba en China y la India hace más de 5.000 años",
      "En el siglo XVI, su precio en Europa llegaba a equivaler al de una oveja entera por cada libra de jengibre seco",
      "El jengibre no tiene semillas: se reproduce exclusivamente por división del rizoma, su raíz subterránea",
    ],
  },
  {
    id: 4,
    nombre: "Valeriana",
    nombreCientifico: "Valeriana officinalis",
    color: "#8eadcc",
    foto: "/img/plantas/valeriana.jpg",
    uso: "Raíz con acción sedante y ansiolítica reconocida científicamente. Indicada para el insomnio de conciliación, el nerviosismo y la tensión muscular sin generar dependencia.",
    propiedades: [
      "Ácido valérico — efecto sedante sobre el sistema nervioso central",
      "Valepotriaatos — compuestos con marcada acción ansiolítica",
      "GABA — precursor del principal neurotransmisor inhibidor cerebral",
      "Flavonoides (linarina, hesperidina) — complementan el efecto sedante",
      "Isovaleriato de bornilo — activo relajante muscular",
    ],
    beneficios: [
      "Reduce el tiempo en conciliar el sueño sin generar dependencia",
      "Alivia la ansiedad y el nerviosismo diurno",
      "Relaja la musculatura en contracturas y tensión crónica",
      "No produce somnolencia diurna a dosis normales",
      "Útil en síndrome premenstrual con componente nervioso",
    ],
    formaDeUso:
      "Infusión: 1 cucharadita de raíz seca en 250 ml, tomar 30 min antes de dormir. Extracto o cápsulas: según indicación del fabricante. No combinar con alcohol ni benzodiacepinas.",
    datosCuriosos: [
      "Su nombre proviene del latín 'valere', que significa 'estar fuerte y bien': refleja su uso histórico como tónico general",
      "Durante la Segunda Guerra Mundial se usó masivamente en Europa para tratar el nerviosismo y el insomnio provocados por los bombardeos",
      "A los gatos les atrae tanto como la hierba gatera: el ácido isovalérico activa sus receptores de feromonas y los vuelve eufóricos",
    ],
  },
  {
    id: 5,
    nombre: "Equinácea",
    nombreCientifico: "Echinacea purpurea",
    color: "#c48ea0",
    foto: "/img/plantas/equinacea.jpg",
    uso: "Planta inmunoestimulante por excelencia. Usada principalmente en la prevención y tratamiento de infecciones respiratorias agudas por su capacidad de activar el sistema inmune innato.",
    propiedades: [
      "Alquilamidas — activan directamente los receptores CB2 del sistema inmune",
      "Polisacáridos — estimulan la actividad de macrófagos y fagocitos",
      "Ácido chicórico — antiviral y antioxidante de gran potencia",
      "Equinacósido — glucósido cafeoilo con propiedades inmunoestimulantes",
      "Flavonoides — refuerzan el efecto antioxidante global",
    ],
    beneficios: [
      "Reduce la duración y gravedad de resfriados y gripes",
      "Estimula la producción de células NK (asesinas naturales)",
      "Propiedades antivirales y antibacterianas comprobadas",
      "Acorta la recuperación en infecciones de vías respiratorias altas",
      "Uso externo: acelera la cicatrización de heridas y úlceras",
    ],
    formaDeUso:
      "Máximo 3–4 semanas seguidas, luego descanso de 2 semanas. Tintura: 30 gotas, 3 veces al día. Infusión: 1 cucharadita de planta seca, 3 veces/día. Contraindicada en enfermedades autoinmunes.",
    datosCuriosos: [
      "Los nativos americanos, especialmente los lakota y las tribus de las Grandes Llanuras, la usaban como planta medicinal principal hace más de 400 años antes de que llegara a Europa",
      "Es la planta medicinal más vendida en Estados Unidos y Alemania desde hace décadas",
      "Fue prácticamente abandonada a mediados del siglo XX con la llegada de los antibióticos, y redescubierta por la fitoterapia moderna en los años 80",
    ],
  },
  {
    id: 6,
    nombre: "Romero",
    nombreCientifico: "Rosmarinus officinalis",
    color: "#5a9e6e",
    foto: "/img/plantas/romero.jpg",
    uso: "Planta aromática de múltiples usos terapéuticos: circulación cerebral, memoria, digestión, dolor muscular y cuidado del cabello. Una de las plantas más versátiles de la fitoterapia mediterránea.",
    propiedades: [
      "Ácido rosmarínico — potente antioxidante y antiinflamatorio",
      "Carnosol y ácido carnósico — neuroprotectores con efecto anticancerígeno estudiado",
      "Cineol (eucaliptol) — expectorante, antimicrobiano y estimulante cognitivo",
      "Alcanfor — estimulante circulatorio y analgésico local",
      "Flavonoides (luteolina, apigenina) — potentes antioxidantes",
    ],
    beneficios: [
      "Estimula la circulación cerebral: mejora concentración y memoria",
      "Digestivo: estimula la secreción biliar y reduce gases",
      "Analgésico muscular y articular en uso externo",
      "Estimula el crecimiento del cabello y mejora la caspa",
      "Conservante natural de alimentos por su actividad antioxidante",
    ],
    formaDeUso:
      "Infusión: 1 rama fresca o 1 cucharadita seca en 200 ml. 2 tazas al día (evitar por la noche, es estimulante). Aceite esencial: masajes en sien, nuca o cuero cabelludo diluido al 2–3 % en aceite portador.",
    datosCuriosos: [
      "En la antigua Grecia, los estudiantes se ponían coronas de romero en la cabeza para mejorar la memoria durante los exámenes",
      "Un estudio de 2016 demostró que el simple aroma del aceite esencial de romero mejora el rendimiento de la memoria a corto plazo en un 15 %",
      "Es uno de los conservantes naturales más potentes conocidos: la industria alimentaria lo usa bajo el código E392 para preservar alimentos",
    ],
  },
  {
    id: 7,
    nombre: "Diente de León",
    nombreCientifico: "Taraxacum officinale",
    color: "#c8a020",
    foto: "/img/plantas/diente-de-leon.jpg",
    uso: "El diente de león ha sido valorado desde la antigüedad. Dioscórides y Avicena lo comparaban con la endivia y la achicoria por su capacidad de limpiar el organismo. Es un gran aliado para la digestión cuando hay problemas hepáticos o biliares, ayuda a depurar la sangre y la piel, y puede usarse externamente en oleato para estimular la circulación linfática.",
    propiedades: [
      "Hojas — vitaminas B2, C y A, calcio, potasio, hierro, fósforo, magnesio, selenio, manganeso, ácido fólico, Omega 3, taninos, flavonoides y sales potásicas",
      "Raíz — potasio y principios amargos; tostada se usa como sustituto del café sin cafeína",
      "Flores — sabor agridulce, aptas para ensaladas y preparaciones culinarias",
      "Inulina — fibra prebiótica que favorece el equilibrio de la microbiota intestinal",
    ],
    beneficios: [
      "Colerético: estimula la producción de bilis en el hígado",
      "Colagogo: facilita la expulsión de la bilis hacia el intestino",
      "Eupéptico: favorece la digestión y el apetito",
      "Ligeramente laxante en uso regular",
      "Depurativo de sangre y piel (especialmente útil en psoriasis y dermatitis)",
      "Apoyo linfático en uso externo: aplicar oleato en senos, axilas y zonas con ganglios",
    ],
    formaDeUso:
      "Hojas y flores frescas en ensaladas. Raíz tostada como sustituto del café. Infusión: 1–2 cucharaditas de planta seca en 250 ml, 2–3 tazas al día. Oleato para masaje linfático combinando con aceite de violeta.",
    datosCuriosos: [
      "Su nombre en francés, 'dent-de-lion' (diente de león), hace referencia a la forma dentada característica de sus hojas",
      "Contiene más vitamina A por peso que la zanahoria, lo que lo convierte en uno de los vegetales silvestres más nutritivos",
      "Las abejas dependen de él como fuente de néctar a principios de primavera, antes de que florezcan otras plantas: es vital para su supervivencia tras el invierno",
      "Sus flores solo se abren durante el día y se cierran con la noche o con la lluvia, como si tuvieran un reloj interno",
    ],
    precauciones: [
      "Evitar si no se tiene vesícula biliar (colecistectomía)",
      "Puede causar molestias en personas con hiperacidez gástrica",
      "Se recomienda combinar con plantas ricas en mucílagos (malva, malvavisco) para suavizar su efecto",
    ],
  },
];

/* ═══════════════════════════════════════════
   SVG — DECORACIÓN BOTÁNICA PARA EL MODAL
═══════════════════════════════════════════ */
const BotanicalCorner = ({ flip = false }: { flip?: boolean }) => (
  <Box
    position="absolute"
    top={flip ? "auto" : 0}
    bottom={flip ? 0 : "auto"}
    left={flip ? "auto" : 0}
    right={flip ? 0 : "auto"}
    transform={flip ? "rotate(180deg)" : "none"}
    opacity={0.17}
    pointerEvents="none"
    zIndex={0}
  >
    <svg width="170" height="170" viewBox="0 0 170 170" fill="none">
      {/* Tallo principal curvo */}
      <path
        d="M 10 160 C 22 124 55 88 90 58 C 118 34 142 18 162 8"
        stroke="#1e4a18" strokeWidth="2.2" strokeLinecap="round"
      />
      {/* Hoja 1 — baja */}
      <path d="M 30 136 C 10 122 8 102 22 92 C 40 104 44 124 30 136 Z" fill="#1e4a18"/>
      <path d="M 30 136 C 24 116 18 98 22 92" stroke="#1e4a18" strokeWidth="0.9" fill="none"/>
      {/* Hoja 2 — media baja */}
      <path d="M 58 108 C 72 92 74 72 60 62 C 44 72 42 92 58 108 Z" fill="#1e4a18"/>
      <path d="M 58 108 C 56 90 54 74 60 62" stroke="#1e4a18" strokeWidth="0.9" fill="none"/>
      {/* Hoja 3 — media */}
      <path d="M 88 78 C 72 64 70 46 84 38 C 102 48 104 66 88 78 Z" fill="#1e4a18"/>
      <path d="M 88 78 C 82 62 80 48 84 38" stroke="#1e4a18" strokeWidth="0.9" fill="none"/>
      {/* Hoja 4 — alta */}
      <path d="M 118 50 C 130 36 134 18 120 10 C 104 18 100 36 118 50 Z" fill="#1e4a18"/>
      <path d="M 118 50 C 116 34 114 20 120 10" stroke="#1e4a18" strokeWidth="0.9" fill="none"/>
      {/* Bayas en la base */}
      <circle cx="10" cy="158" r="5.5" fill="#1e4a18"/>
      <circle cx="5"  cy="148" r="4"   fill="#1e4a18"/>
      <circle cx="18" cy="149" r="4"   fill="#1e4a18"/>
      <circle cx="6"  cy="138" r="2.5" fill="#1e4a18" opacity="0.7"/>
      {/* Brotes en la punta */}
      <circle cx="162" cy="9"  r="4"   fill="#1e4a18"/>
      <circle cx="158" cy="4"  r="2.8" fill="#1e4a18" opacity="0.8"/>
      <circle cx="167" cy="5"  r="2.5" fill="#1e4a18" opacity="0.7"/>
    </svg>
  </Box>
);

/* ═══════════════════════════════════════════
   SVG — DIVIDER ENTRE SECCIONES
═══════════════════════════════════════════ */
const BotanicalDivider = ({ color }: { color: string }) => (
  <Flex align="center" gap={3} my={6}>
    <Box flex="1" h="1px" bg={color} opacity={0.2} />
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M10 1 C5 6 5 14 10 19 C15 14 15 6 10 1 Z"   fill={color} opacity="0.45"/>
      <path d="M1 10 C6 5 14 5 19 10 C14 15 6 15 1 10 Z"   fill={color} opacity="0.3"/>
    </svg>
    <Box flex="1" h="1px" bg={color} opacity={0.2} />
  </Flex>
);

/* ═══════════════════════════════════════════
   SVG — HOJA PLACEHOLDER
═══════════════════════════════════════════ */
const LeafPlaceholder = ({ color }: { color: string }) => (
  <Flex direction="column" align="center" gap={2} opacity={0.5}>
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path
        d="M22 4 C13 11 9 22 12 33 C19 36 31 30 36 20 C40 11 33 4 22 4 Z"
        fill={color}
      />
      <path
        d="M22 4 C22 18 20 28 12 33"
        stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"
      />
    </svg>
    <Text color={color} fontSize="xs" fontStyle="italic" textAlign="center">
      Foto próximamente
    </Text>
  </Flex>
);

/* ═══════════════════════════════════════════
   SECCIÓN DEL MODAL (reutilizable)
═══════════════════════════════════════════ */
const SeccionModal = ({
  titulo,
  color,
  textMid,
  children,
}: {
  titulo: string;
  color: string;
  textMid: string;
  children: React.ReactNode;
}) => (
  <Box mb={2}>
    <Flex align="center" gap={2} mb={3}>
      <Box w="3px" h="20px" borderRadius="full" bg={color} opacity={0.7} />
      <Text
        color={textMid}
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="700"
        letterSpacing="0.12em"
        textTransform="uppercase"
        fontFamily="'EB Garamond', serif"
      >
        {titulo}
      </Text>
    </Flex>
    {children}
  </Box>
);

/* ═══════════════════════════════════════════
   GALERÍA DE FOTOS DENTRO DEL MODAL
═══════════════════════════════════════════ */
const FotoGaleria = ({ planta }: { planta: Planta }) => {
  const fotos = planta.fotos && planta.fotos.length > 0 ? planta.fotos : [planta.foto];
  const [active, setActive] = useState(0);
  const [errores, setErrores] = useState<boolean[]>(fotos.map(() => false));

  const markError = (i: number) =>
    setErrores((prev) => { const n = [...prev]; n[i] = true; return n; });

  return (
    <Box mb={7}>
      {/* Foto principal */}
      <Box
        w="100%"
        h={{ base: "210px", md: "270px" }}
        borderRadius="xl"
        overflow="hidden"
        bg={MODAL_COLOR + "18"}
        border={`1px solid ${MODAL_COLOR}44`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={fotos.length > 1 ? 3 : 0}
      >
        {!errores[active] ? (
          <Image
            src={fotos[active]}
            alt={planta.nombre}
            w="100%" h="100%"
            objectFit="cover"
            onError={() => markError(active)}
          />
        ) : (
          <LeafPlaceholder color={MODAL_COLOR} />
        )}
      </Box>

      {/* Miniaturas (solo si hay más de una foto) */}
      {fotos.length > 1 && (
        <Flex gap={2} flexWrap="wrap">
          {fotos.map((f, i) => (
            <Box
              key={i}
              w="58px" h="58px"
              borderRadius="lg"
              overflow="hidden"
              cursor="pointer"
              border={i === active
                ? `2.5px solid ${MODAL_COLOR}`
                : "2px solid rgba(0,0,0,0.08)"}
              opacity={i === active ? 1 : 0.55}
              transition="all 0.2s"
              onClick={() => setActive(i)}
              bg={MODAL_COLOR + "18"}
              display="flex" alignItems="center" justifyContent="center"
              flexShrink={0}
            >
              {!errores[i] ? (
                <Image src={f} alt="" w="100%" h="100%" objectFit="cover" onError={() => markError(i)} />
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 2 C7 5 5 11 7 16 C10 17 15 15 17 10 C19 6 16 2 11 2 Z" fill={MODAL_COLOR} opacity="0.5"/>
                </svg>
              )}
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
};

/* ═══════════════════════════════════════════
   MODAL — VENTANA DE DETALLE
═══════════════════════════════════════════ */
const PlantModal = ({
  planta,
  onClose,
}: {
  planta: Planta;
  onClose: () => void;
}) => {
  /* Bloquear scroll del body */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* Cerrar con Escape */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const textDark     = "#1a3320";
  const textMid      = "#3d6b40";
  const accentBg     = MODAL_COLOR + "16";
  const accentBorder = MODAL_COLOR + "50";

  return (
    /* Fondo oscuro con blur */
    <Box
      position="fixed" inset={0} zIndex={1000}
      bg="rgba(0,32,10,0.6)"
      sx={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      display="flex"
      alignItems={{ base: "flex-end", md: "center" }}
      justifyContent="center"
      px={{ base: 0, md: 6 }}
      py={{ base: 0, md: 6 }}
      onClick={onClose}
    >
      {/* Panel modal */}
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w={{ base: "100%", md: "640px" }}
        maxH={{ base: "92vh", md: "88vh" }}
        overflowY="auto"
        borderRadius={{ base: "24px 24px 0 0", md: "24px" }}
        /* Fondo pergamino cálido */
        bg="#f8f5ec"
        boxShadow="0 32px 80px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.2)"
        sx={{
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-track": { bg: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            bg: MODAL_COLOR + "55",
            borderRadius: "full",
          },
        }}
      >
        {/* ── Decoraciones botánicas en esquinas ── */}
        <BotanicalCorner />
        <BotanicalCorner flip />

        {/* ── Borde interior decorativo ── */}
        <Box
          position="absolute" inset="10px"
          borderRadius="16px"
          border="1px solid rgba(30,74,24,0.10)"
          pointerEvents="none"
          zIndex={1}
        />

        {/* ── Contenido (z>0 para ir sobre la decoración) ── */}
        <Box position="relative" zIndex={2} px={{ base: 6, md: 10 }} pt={10} pb={10}>

          {/* Botón cerrar */}
          <Box
            as="button"
            position="absolute"
            top="14px" right="14px"
            w="34px" h="34px"
            borderRadius="full"
            bg="rgba(30,74,24,0.08)"
            border="1px solid rgba(30,74,24,0.18)"
            display="flex" alignItems="center" justifyContent="center"
            color={textMid}
            fontSize="16px" fontWeight="700"
            cursor="pointer"
            transition="all 0.18s"
            _hover={{ bg: "rgba(30,74,24,0.18)" }}
            onClick={onClose}
          >
            ✕
          </Box>

          {/* ── NOMBRE ── */}
          <Box textAlign="center" mb={7}>
            <Text
              color={textDark}
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="700"
              fontFamily="'EB Garamond', serif"
              letterSpacing="0.03em"
              lineHeight="1.1"
            >
              {planta.nombre}
            </Text>
            <Text
              color={textMid}
              fontSize={{ base: "sm", md: "md" }}
              fontStyle="italic"
              letterSpacing="0.06em"
              mt={1}
              opacity={0.8}
            >
              {planta.nombreCientifico}
            </Text>
            {/* Línea decorativa */}
            <Flex justify="center" mt={3} gap={1}>
              <Box w="20px" h="2px" borderRadius="full" bg={MODAL_COLOR} opacity={0.35}/>
              <Box w="40px" h="2px" borderRadius="full" bg={MODAL_COLOR} opacity={0.65}/>
              <Box w="20px" h="2px" borderRadius="full" bg={MODAL_COLOR} opacity={0.35}/>
            </Flex>
          </Box>

          {/* ── FOTOS ── */}
          <FotoGaleria planta={planta} />

          {/* ── USO ── */}
          <SeccionModal titulo="Uso" color={MODAL_COLOR} textMid={textMid}>
            <Text
              color={textDark}
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.85"
              opacity={0.85}
            >
              {planta.uso}
            </Text>
          </SeccionModal>

          <BotanicalDivider color={MODAL_COLOR} />

          {/* ── PROPIEDADES ── */}
          <SeccionModal titulo="Propiedades · Lo que contiene" color={MODAL_COLOR} textMid={textMid}>
            <Flex direction="column" gap={2}>
              {planta.propiedades.map((p, i) => (
                <Flex key={i} gap={3} align="flex-start">
                  <Box
                    mt="9px" w="6px" h="6px" borderRadius="full"
                    bg={MODAL_COLOR} flexShrink={0} opacity={0.8}
                  />
                  <Text
                    color={textDark}
                    fontSize={{ base: "sm", md: "md" }}
                    lineHeight="1.8"
                    opacity={0.85}
                  >
                    {p}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </SeccionModal>

          <BotanicalDivider color={MODAL_COLOR} />

          {/* ── BENEFICIOS ── */}
          <SeccionModal titulo="Beneficios" color={MODAL_COLOR} textMid={textMid}>
            <Flex direction="column" gap={2}>
              {planta.beneficios.map((b, i) => (
                <Flex key={i} gap={3} align="flex-start">
                  <Box
                    mt="9px" w={0} h={0} flexShrink={0}
                    borderTop="5px solid transparent"
                    borderBottom="5px solid transparent"
                    borderLeft={`9px solid ${MODAL_COLOR}`}
                    opacity={0.65}
                  />
                  <Text
                    color={textDark}
                    fontSize={{ base: "sm", md: "md" }}
                    lineHeight="1.8"
                    opacity={0.85}
                  >
                    {b}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </SeccionModal>

          <BotanicalDivider color={MODAL_COLOR} />

          {/* ── FORMA DE USO ── */}
          <SeccionModal titulo="Forma de uso" color={MODAL_COLOR} textMid={textMid}>
            <Box
              bg={accentBg}
              border={`1px solid ${accentBorder}`}
              borderRadius="xl"
              px={5} py={4}
            >
              <Text
                color={textDark}
                fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.9"
                opacity={0.88}
              >
                {planta.formaDeUso}
              </Text>
            </Box>
          </SeccionModal>

          {/* ── DATOS CURIOSOS ── */}
          {planta.datosCuriosos && planta.datosCuriosos.length > 0 && (
            <>
              <BotanicalDivider color={MODAL_COLOR} />
              <SeccionModal titulo="Datos curiosos" color={MODAL_COLOR} textMid={textMid}>
                <Flex direction="column" gap={3}>
                  {planta.datosCuriosos.map((d, i) => (
                    <Flex key={i} gap={3} align="flex-start">
                      <Box
                        flexShrink={0} mt="3px"
                        w="22px" h="22px"
                        borderRadius="full"
                        bg={MODAL_COLOR + "20"}
                        border={`1px solid ${MODAL_COLOR}55`}
                        display="flex" alignItems="center" justifyContent="center"
                        fontSize="10px"
                      >
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                          <path d="M5 0 L6.18 3.82 L10 5 L6.18 6.18 L5 10 L3.82 6.18 L0 5 L3.82 3.82 Z"
                            fill={MODAL_COLOR} opacity="0.8"/>
                        </svg>
                      </Box>
                      <Text
                        color={textDark}
                        fontSize={{ base: "sm", md: "md" }}
                        lineHeight="1.8"
                        opacity={0.85}
                      >
                        {d}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </SeccionModal>
            </>
          )}

          {/* ── PRECAUCIONES ── */}
          {planta.precauciones && planta.precauciones.length > 0 && (
            <>
              <BotanicalDivider color="#b05a2a" />
              <SeccionModal titulo="Precauciones" color="#b05a2a" textMid="#8a3e18">
                <Box
                  bg="rgba(176,90,42,0.08)"
                  border="1px solid rgba(176,90,42,0.28)"
                  borderRadius="xl"
                  px={5} py={4}
                >
                  <Flex direction="column" gap={2}>
                    {planta.precauciones.map((p, i) => (
                      <Flex key={i} gap={3} align="flex-start">
                        <Text
                          flexShrink={0} mt="-1px"
                          fontSize="14px" color="#b05a2a" lineHeight="1.8"
                        >
                          ⚠
                        </Text>
                        <Text
                          color={textDark}
                          fontSize={{ base: "sm", md: "md" }}
                          lineHeight="1.8"
                          opacity={0.85}
                        >
                          {p}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
              </SeccionModal>
            </>
          )}

        </Box>
      </Box>
    </Box>
  );
};

/* ═══════════════════════════════════════════
   TARJETA DE PLANTA
═══════════════════════════════════════════ */
const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const PlantCard = ({
  planta,
  onOpen,
}: {
  planta: Planta;
  onOpen: () => void;
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Flex
      align="center"
      gap={{ base: 3, md: 4 }}
      bg="rgba(255,255,255,0.14)"
      border="1px solid rgba(255,255,255,0.30)"
      sx={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      borderRadius="2xl"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 4 }}
      boxShadow="0 4px 20px rgba(0,0,0,0.16)"
      cursor="pointer"
      onClick={onOpen}
      transition="all 0.22s ease"
      _hover={{
        bg: "rgba(255,255,255,0.21)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.26)",
        transform: "translateY(-2px)",
      }}
    >
      {/* Foto */}
      <Box
        w={{ base: "74px", md: "86px" }}
        h={{ base: "74px", md: "86px" }}
        borderRadius="xl"
        overflow="hidden"
        flexShrink={0}
        bg={CARD_COLOR + "28"}
        border={`2px solid ${CARD_COLOR}50`}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {!imgError ? (
          <Image
            src={planta.foto}
            alt={planta.nombre}
            w="100%" h="100%"
            objectFit="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M18 3 C11 9 8 18 10 27 C16 29 26 24 30 16 C33 9 27 3 18 3 Z"
              fill={CARD_COLOR} opacity="0.7"
            />
            <path
              d="M18 3 C18 15 16 23 10 27"
              stroke="white" strokeWidth="1.2" fill="none" opacity="0.5"
            />
          </svg>
        )}
      </Box>

      {/* Nombre */}
      <Box flex="1" minW={0}>
        <Text
          color="white"
          fontWeight="700"
          fontSize={{ base: "lg", md: "xl" }}
          letterSpacing="0.02em"
          lineHeight="1.2"
        >
          {planta.nombre}
        </Text>
        <Text
          color="rgba(255,255,255,0.48)"
          fontSize="xs"
          fontStyle="italic"
          letterSpacing="0.04em"
          mt="4px"
        >
          {planta.nombreCientifico}
        </Text>
      </Box>

      {/* Icono corazón (decorativo) */}
      <Box
        w={{ base: "42px", md: "46px" }}
        h={{ base: "42px", md: "46px" }}
        borderRadius="full"
        bg={CARD_COLOR + "20"}
        border={`1.5px solid ${CARD_COLOR}60`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={CARD_COLOR}
        flexShrink={0}
        transition="all 0.22s ease"
      >
        <HeartIcon />
      </Box>
    </Flex>
  );
};

/* ═══════════════════════════════════════════
   HOOK REVEAL (scroll animation)
═══════════════════════════════════════════ */
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

/* ═══════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════ */
const FitoterapiaRecursos = () => {
  const [selected, setSelected] = useState<Planta | null>(null);
  const titleReveal = useReveal();
  const gridReveal  = useReveal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box
      minH="100vh" display="flex" flexDirection="column"
      bg="#008080" fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      {/* ── TÍTULO ── */}
      <Box
        ref={titleReveal.ref}
        textAlign="center"
        pt={{ base: 10, md: 14 }}
        pb={{ base: 8, md: 10 }}
        px={{ base: 6, md: 10 }}
        opacity={titleReveal.visible ? 1 : 0}
        transform={titleReveal.visible ? "none" : "translateY(-18px)"}
        transition="opacity 0.75s ease, transform 0.75s ease"
      >
        <Text
          color="rgba(255,255,255,0.48)"
          fontSize="xs"
          letterSpacing="0.22em"
          textTransform="uppercase"
          mb={3}
        >
          Plantas Medicinales
        </Text>
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
          fontWeight="700"
          letterSpacing="0.04em"
          lineHeight="1.15"
          textShadow="0 2px 10px rgba(0,100,90,0.45)"
          mb={3}
        >
          Fitoterapia
        </Text>
        <Text
          color="rgba(255,255,255,0.52)"
          fontSize={{ base: "sm", md: "lg" }}
          letterSpacing="0.06em"
          fontStyle="italic"
          maxW="500px"
          mx="auto"
        >
          La sabiduría de las plantas al servicio de tu salud
        </Text>
      </Box>

      {/* ── GRID DE PLANTAS ── */}
      <Box
        ref={gridReveal.ref}
        flex="1"
        px={{ base: 5, md: 10, lg: 16 }}
        pb={{ base: 14, md: 20 }}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={{ base: 4, md: 5 }}
          maxW="920px"
          mx="auto"
        >
          {plantas.map((p, i) => (
            <Box
              key={p.id}
              opacity={gridReveal.visible ? 1 : 0}
              transform={gridReveal.visible ? "none" : "translateY(22px)"}
              transition={`opacity 0.55s ease ${i * 0.08}s, transform 0.55s ease ${i * 0.08}s`}
            >
              <PlantCard planta={p} onOpen={() => setSelected(p)} />
            </Box>
          ))}
        </Grid>
      </Box>

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.12)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text
          color="rgba(255,255,255,0.45)" fontSize="xs"
          letterSpacing="0.05em" textAlign="center"
        >
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>

      {/* ── MODAL ── */}
      {selected && (
        <PlantModal planta={selected} onClose={() => setSelected(null)} />
      )}
    </Box>
  );
};

export default FitoterapiaRecursos;
