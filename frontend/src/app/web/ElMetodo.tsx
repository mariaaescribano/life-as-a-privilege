import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { ContactModal } from "../../components/global/ContactModal";
import { WaitlistModal } from "../../components/global/WaitlistModal";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
} from "../../GlobalVariables";

type ContenidoSeccion = {
  titulo: string;
  items: string[];
};

type ModalidadData = {
  name: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
  desc: string;
  modalDesc: string;
  contenido: ContenidoSeccion[];
};

// const modalidades: ModalidadData[] = [
//   {
//     name: astrologiaNom,
//     bg: astrologiaBg,
//     txt: astrologiaTxt,
//     renderIcon: (size) => <AstrologiaIcon size={{ base: size, md: size }} />,
//     desc: "Descubre los arquetipos que guían tu forma de vivir.",
//     modalDesc: "A través de tu carta natal, exploraremos los arquetipos que operan en cada área de tu vida y cómo te influyen.",
//     sessions: [
//       "1. Veremos el Ascendente, el Sol y la Luna de tu carta astral.",
//       "2. Se hará una lectura de las primeras seis casas de la carta astral.",
//       "3. Se hará una lectura de las últimas seis casas de la carta astral.",
//       "4. Se leerán los planetas y su simbología.",
//     ],
//   },
//   {
//     name: neuropsicologiaNom,
//     bg: neuropsicologiaBg,
//     txt: neuropsicologiaTxt,
//     renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
//     desc: "Identifica los patrones que te mantienen atrapado.",
//     modalDesc: "Usando tu carta natal como mapa, exploraremos tu forma única de pensar y sentir, y los mecanismos de adaptación que desarrollaste para sobrevivir. No somos diagnósticos: somos personas que para sobrevivir tuvieron que hacer una adaptación psicológica que ya no sirve.",
//     sessions: [
//       "1. La sesión girará entorno a que la persona pueda compartir -hasta dónde se sienta cómodo- la relación entre los arquetipos de su carta astral y su trayectoria en la Vida.",
//       "2. Primera sesión centrada en la línea de Vida y búsqueda de reconocimiento de patrones.",
//       "3. Segunda sesión centrada en la línea de Vida y búsqueda de reconocimiento de patrones.",
//     ],
//   },
//   {
//     name: ayurvedaNom,
//     bg: ayurvedaBg,
//     txt: ayurvedaTxt,
//     renderIcon: (size) => <AyurvedaIcon size={{ base: size, md: size }}/>,
//     desc: "Conoce tu naturaleza única a través de la medicina india más antigua.",
//     modalDesc: "Junto a la psicoterapia, el Ayurveda nos dará herramientas profundas para entender tu naturaleza única y qué hábitos te equilibran o te desequilibran.",
//     sessions: [
//       "1. En la sesión la persona descubrirá su dosha y haremos una breve explicación de la naturaleza de ese dosha.",
//       "2. Teniendo en cuenta el dosha de la persona y su vida diaria, veremos cómo encontrar el equilibrio a través de pequeños pero importantes cambios.",
//       "3. Nos enfocaremos en recetas únicas, especias, gestión emocional y actividades para ese dosha.",
//     ],
//   },
//   {
//     name: tcmNom,
//     bg: tcmBg,
//     txt: tcmTxt,
//     renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
//     desc: "Comprende tus desequilibrios a través de la medicina tradicional china.",
//     modalDesc: "Usando la medicina tradicional china, encontraremos qué desequilibrios presentas en este momento de tu vida y los abordaremos con remedios naturales adaptados a ti.",
//     sessions: [
//       "1. Se hará un diagnóstico de la lengua en profundidad y se encontrarán los desequilibrios de la persona.",
//       "2. Se explicará -las veces que la persona necesite- qué ha pasado para que se den esos desequilibrios segun la teoría de los cinco elementos de la medicina china.",
//       "3. Se dará remedios naturales concretos para que la persona pueda volver a equilibrarse y prevenir la enfermedad.",
//     ],
//   },
//   {
//     name: fisiologiaNom,
//     bg: fisiologiaBg,
//     txt: fisiologiaTxt,
//     renderIcon: (size) => <FisiologiaIcon size={size} />,
//     desc: "Reconcíliate con tu cuerpo entendiéndolo en profundidad.",
//     modalDesc: "Con tu constitución y tus desequilibrios ya identificados, es momento de entender cómo funciona tu cuerpo. Nos centraremos en los órganos y sistemas que más te afectan, con explicaciones claras, repitiéndolo las veces que lo necesites para entenderlo.",
//     sessions: [
//       "1. Se explicará -la profundidad dependerá de lo que la persona desee- el funcionamiento de los órganos afectados por ese desequilibrio.",
//       "2. Se descubrirá cómo los hábitos de la persona pueden transformar su estado actual."
//     ],
//   },
//   {
//     name: nutricionNom,
//     bg: nutricionBg,
//     txt: nutricionTxt,
//     renderIcon: (size) => <NutricionIcon size={{ base: size, md: size }} />,
//     desc: "«Que tu alimento sea tu medicina y tu medicina tu alimento» — Hipócrates.",
//     modalDesc: "Como ya entendemos en profundidad tus desequilibrios, es hora de ver cómo podemos equilibrarnos a través de nuestros hábitos diarios. Esta modalidad no solo abarca la microbiología de la nutrición y su interacción con nuestras células, sino que también hablaremos de los alimentos según la medicina china y la ayurveda.",
//     sessions: [
//       "1. Teniendo en cuenta los desequilibrios, la rutina y el dosha (la constitución), se desarrollará una dieta específica para la condición",
//       "2. Se verá cómo puede introducir esa dieta en su vida diaria sin que le cueste esfuerzo o mucho dinero.",
//       "3. Si la persona lo desea, se podrá hacer una sesión para entender los alimentos según la medicina china o la ayúrveda."
//     ],
//   },
//   {
//     name: fitoterapiaNom,
//     bg: fitoterapiaBg,
//     txt: fitoterapiaTxt,
//     renderIcon: (size) => <FitoterapiaIcon size={{ base: size, md: size }} />,
//     desc: "Lo que necesitas para sanar, ya existe en la naturaleza.",
//     modalDesc: "Exploraremos juntos qué plantas, especias e infusiones ayudan exactamente a tu desequilibrio actual y cómo incorporarlas de forma fácil en tu día a día.",
//     sessions: [
//       "1. Se descubrirá el poder de las plantas y especias. Se verá cómo introducirlas en la vida cotidiana",
//       "2. Se descubrirá las infusiones, los tés y el café; las propiedades, los efectos en nuestro cuerpo y cómo y cuándo introducirlo."
//     ],
//   },
//   {
//     name: cabalaNom,
//     bg: cabalaBg,
//     txt: cabalaTxt,
//     renderIcon: (size) => <CabalaIcon size={{ base: size, md: size }} />,
//     desc: "El camino de vuelta a ti mismo, a través del Árbol de la Vida.",
//     modalDesc: "En esta última etapa, llegamos con un largo camino de autoconocimiento recorrido juntos. Usando el Árbol de la Vida y sus caminos, encontraremos cómo equilibrarnos desde adentro, convirtiéndonos en nuestra propia base segura y recordando que somos dignos de amor.",
//     sessions: [
//       "1. Se explicará el Árbol de la Vida y cómo la persona puede sacarle provecho en sus circunstancias concretas.",
//       "2. Se hará un plan, diseñado por la persona pero con ayuda, de cómo quiere encontrar el equilibrio ahora que ya tiene todas estas herramientas."
//     ],
//   },
// ];

const modalidades: ModalidadData[] = [
  {
    name: astrologiaNom,
    bg: astrologiaBg,
    txt: astrologiaTxt,
    renderIcon: (size) => <AstrologiaIcon size={{ base: size, md: size }} />,
    desc: "Descubre los arquetipos que guían tu forma de vivir. Descubre tu esencia, tus dones y los procesos que vienes a transitar.",
    modalDesc:
      "A través de tu carta natal, exploraremos los arquetipos que se expresan en cada área de tu vida y cómo influyen en tu manera de vivir.",
    contenido: [
      {
        titulo: "Lectura de carta",
        items: [
          "Lectura completa de tu carta astral, entregada en PDF para que puedas volver a ella siempre que la necesites.",
        ],
      },
      {
        titulo: "Materiales",
        items: [
          "Material para profundizar en cada arquetipo y comprender su simbología.",
        ],
      },
      {
        titulo: "Preguntas guiadas",
        items: [
          "Preguntas para integrar los arquetipos en alta frecuencia y aplicarlos a tu vida diaria.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: [
          "1 o 2 sesiones individuales conmigo para resolver dudas y acompañar tu proceso de comprensión.",
        ],
      },
    ],
  },
  {
    name: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
    desc: "Identifica los patrones que hoy limitan tu forma de vivir. La psicología te ofrece herramientas para entender qué historias internas sostienen tus bloqueos.",
    modalDesc:
      "Usando tu carta natal como mapa, exploraremos tu forma única de pensar, sentir y vincularte, así como los mecanismos de adaptación que desarrollaste para sobrevivir. Muchas veces, aquello que hoy nos limita fue en otro momento una forma de protegernos.",
    contenido: [
      {
        titulo: "Mapa de vida",
        items: ["Material disponible para elaborar tu propio mapa de vida."],
      },
      {
        titulo: "Cronología de vida",
        items: [
          "Exploramos juntos tu historia personal para reconocer los patrones que la atraviesan.",
        ],
      },
      {
        titulo: "Sesiones de integración",
        items: [
          "2 o 3 sesiones para integrar lo que revela tu carta astral con lo que has vivido, con el propósito de elevarlo a alta frecuencia.",
        ],
      },
      {
        titulo: "Psicoterapia breve",
        items: [
          "16 a 20 sesiones basadas en la técnica de Psicoterapia breve, realizadas 2 o 3 veces por semana para que la terapia sea realmente sanadora.",
        ],
      },
    ],
  },
  {
    name: ayurvedaNom,
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    renderIcon: (size) => <AyurvedaIcon size={{ base: size, md: size }} />,
    desc: "Entiende al ser humano desde el hinduismo y conoce tu naturaleza única a través del sistema de medicina tradicional más antiguo de la India, la Ayurveda.",
    modalDesc:
      "Junto a la psicoterapia, el Ayurveda nos ofrecerá herramientas profundas para comprender tu naturaleza única y reconocer qué hábitos te equilibran o te desequilibran.",
    contenido: [
      {
        titulo: "Cursos grabados",
        items: [
          "Curso grabado para comprender los chakras.",
          "Curso grabado sobre el cuerpo humano según el Ayurveda.",
          "Curso grabado sobre los doshas en profundidad: psicología, constitución y nutrición.",
          "Curso grabado sobre los secretos de la nutrición ayurvédica.",
        ],
      },
      {
        titulo: "Materiales",
        items: [
          "Material de apoyo que acompaña a cada curso para asentar lo aprendido.",
        ],
      },
      {
        titulo: "Test del dosha",
        items: [
          "Test para descubrir tu dosha y comprender tu naturaleza única.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: ["1 o 2 sesiones individuales para resolver cualquier duda."],
      },
    ],
  },
  {
    name: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
    desc: "Comprende tus desequilibrios a través de la medicina tradicional china.",
    modalDesc:
      "A través de la medicina tradicional china y su teoría de los Cinco Elementos, identificaremos los desequilibrios que atraviesas en este momento y los abordaremos con herramientas naturales adaptadas a ti.",
    contenido: [
      {
        titulo: "Cursos grabados",
        items: [
          "Curso grabado sobre los cinco elementos y el cuerpo humano, en profundidad.",
          "Curso grabado sobre los equilibrios y desequilibrios según la medicina tradicional china.",
          "Curso grabado sobre la nutrición desde la perspectiva de la TCM.",
        ],
      },
      {
        titulo: "Test diagnóstico",
        items: [
          "Test para conocerte mejor e identificar los desequilibrios presentes.",
        ],
      },
      {
        titulo: "Fitoterapia",
        items: [
          "Remedios naturales adaptados a ti (en ningún caso medicamentos, sino fitoterapia según la TCM).",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: ["1 o 2 sesiones individuales para resolver cualquier duda."],
      },
    ],
  },
  {
    name: fisiologiaNom,
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    renderIcon: (size) => <FisiologiaIcon size={size} />,
    desc: "Reconcíliate con tu cuerpo entendiéndolo en profundidad.",
    modalDesc:
      "Con tu constitución y tus desequilibrios ya identificados, es momento de comprender cómo funciona tu cuerpo. Nos centraremos en los órganos y sistemas más implicados, con explicaciones claras y tantas veces como necesites para integrarlo de verdad.",
    contenido: [
      {
        titulo: "Curso grabado",
        items: ["Curso grabado sobre el funcionamiento del cuerpo humano."],
      },
      {
        titulo: "Desequilibrios frecuentes",
        items: [
          "Estudio de los desequilibrios más comunes (hígado graso, diabetes, síndrome premenstrual...) para comprenderlos y conocer sus orígenes.",
        ],
      },
      {
        titulo: "Materiales de apoyo",
        items: [
          "Esquemas y fichas para asentar lo aprendido sobre tu cuerpo y sus equilibrios.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: ["1 o 2 sesiones individuales para resolver cualquier duda."],
      },
    ],
  },
  {
    name: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    renderIcon: (size) => <NutricionIcon size={{ base: size, md: size }} />,
    desc: "Aprende a equilibrarte a través de una nutrición adaptada a tu cuerpo.",
    modalDesc:
      "Ahora que comprendemos en profundidad tus desequilibrios, es momento de trabajar sobre tus hábitos diarios. Esta modalidad integra la base fisiológica de la nutrición y su impacto celular, junto con la visión de los alimentos desde la medicina tradicional china y el Ayurveda.",
    contenido: [
      {
        titulo: "Microbiota",
        items: ["Curso en profundidad sobre la microbiota."],
      },
      {
        titulo: "Macronutrientes",
        items: [
          "Curso sobre los carbohidratos, las proteínas y las grasas, y su papel en tu cuerpo.",
        ],
      },
      {
        titulo: "Aplicación a tu vida",
        items: [
          "Guía práctica para incorporar lo aprendido a tu día a día sin esfuerzo ni gran gasto económico.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: ["1 o 2 sesiones individuales para resolver cualquier duda."],
      },
    ],
  },
  {
    name: culturaNom,
    bg: culturaBg,
    txt: culturaTxt,
    renderIcon: (size) => <CulturaIcon size={{ base: size, md: size }} />,
    desc: "Profundiza en las grandes filosofías y aprende de ellas para crear la tuya propia.",
    modalDesc:
      "Profundiza en las grandes filosofías, podemos centrarnos en la que prefieras, pero el objetivo es encontrar inspiración para crear tu propia filosofía que te acompañe día a día.",
    contenido: [
      {
        titulo: "Curso de filosofía",
        items: [
          "Curso sobre mi propia filosofía, pensado para inspirarte a construir la tuya.",
        ],
      },
      {
        titulo: "Lecturas recomendadas",
        items: [
          "Autores y obras que han marcado mi camino y pueden nutrir el tuyo.",
        ],
      },
      {
        titulo: "Preguntas para reflexionar",
        items: [
          "Material guiado para iniciar la reflexión sobre tu propia filosofía de vida.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: ["1 o 2 sesiones individuales para resolver cualquier duda."],
      },
    ],
  },
  {
    name: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    renderIcon: (size) => <CabalaIcon size={{ base: size, md: size }} />,
    desc: "El camino de vuelta a ti, a través del Árbol de la Vida.",
    modalDesc:
      "En esta última etapa llegamos después de un largo camino de autoconocimiento recorrido juntos. Usando el Árbol de la Vida y sus caminos, encontraremos nuevas formas de equilibrarte desde dentro, convirtiéndote en tu propia base segura y recordando que eres digno de Amor.",
    contenido: [
      {
        titulo: "Curso de filosofía",
        items: ["Curso grabado sobre la filosofía de la Cábala."],
      },
      {
        titulo: "Las Sefirot",
        items: ["Las Sefirot como herramientas prácticas para la vida."],
      },
      {
        titulo: "Árbol de la Vida",
        items: [
          "El Árbol de la Vida como mapa para encontrar tu propio equilibrio interior.",
        ],
      },
      {
        titulo: "Sesiones individuales",
        items: ["1 o 2 sesiones individuales para resolver cualquier duda."],
      },
    ],
  },
];

// Iconos por categoría (línea/SVG, mismo color que la disciplina)
const SectionIcon = ({ titulo, color }: { titulo: string; color: string }) => {
  const t = titulo.toLowerCase();
  let path: React.ReactNode;
  if (t.includes("curso")) {
    // Play en rectángulo
    path = (
      <>
        <polygon points="10 8 16 12 10 16 10 8" />
        <rect x="3" y="5" width="18" height="14" rx="2" />
      </>
    );
  } else if (
    t.includes("material") ||
    t.includes("lectura") ||
    t.includes("mapa")
  ) {
    // Documento
    path = (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </>
    );
  } else if (t.includes("test")) {
    // Checklist / cuadrado con check
    path = (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="m9 12 2 2 4-4" />
      </>
    );
  } else if (t.includes("psicoterap")) {
    // Corazón
    path = (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    );
  } else if (t.includes("integraci")) {
    // Cadena / enlace
    path = (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>
    );
  } else if (
    t.includes("herramienta") ||
    t.includes("sefirot") ||
    t.includes("árbol") ||
    t.includes("arbol")
  ) {
    // Árbol estilizado
    path = (
      <>
        <path d="M12 2L8 7h8z" />
        <path d="M12 7L6 13h12z" />
        <path d="M12 13l-7 7h14z" />
        <line x1="12" y1="20" x2="12" y2="22" />
      </>
    );
  } else if (t.includes("cronolog") || t.includes("historia")) {
    // Reloj / línea de tiempo
    path = (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    );
  } else if (t.includes("fitoterap")) {
    // Hoja
    path = (
      <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6" />
      </>
    );
  } else if (
    t.includes("microbio") ||
    t.includes("macronutri") ||
    t.includes("nutrici") ||
    t.includes("alimenta") ||
    t.includes("desequilibri") ||
    t.includes("aplicaci")
  ) {
    // Manzana / círculo con tallo
    path = (
      <>
        <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" />
        <path d="M12 8c-2-2.03-2-3.97 0-6" />
      </>
    );
  } else if (t.includes("pregunta") || t.includes("reflexion")) {
    // Interrogación
    path = (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    );
  } else {
    // sesiones / por defecto: calendario
    path = (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );
};

const useReveal = (threshold = 0.12) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

type MetodoCardProps = {
  data: ModalidadData;
  delay: number;
  parentVisible: boolean;
  index: number;
  onClick: () => void;
};

function MetodoCard({ data, delay, parentVisible, index, onClick }: MetodoCardProps) {
  return (
    <Box
      position="relative"
      mt="46px"
      pt="54px"
      pb={8}
      px={{ base: 5, md: 7 }}
      bg={data.bg}
      borderRadius="2xl"
      boxShadow="0 8px 28px rgba(107,196,200,0.5), 0 2px 8px rgba(107,196,200,0.25)"
      opacity={parentVisible ? 1 : 0}
      transform={parentVisible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.95)"}
      transition={`opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s, box-shadow 0.2s ease`}
      cursor="pointer"
      onClick={onClick}
      _hover={{ boxShadow: `0 12px 40px ${data.txt}55, 0 4px 16px ${data.txt}33` }}
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {/* Icono flotante */}
      <Box
        position="absolute"
        top="-38px"
        left="50%"
        transform="translateX(-50%)"
        bg={data.bg}
        borderRadius="full"
        p="8px"
        border={`4px solid ${data.txt}`}
        boxShadow={`0 0 20px ${data.txt}bb, 0 2px 14px ${data.txt}77`}
        w="76px"
        h="76px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {data.renderIcon("44px")}
      </Box>

      {/* Número + título */}
      <Flex align="baseline" justify="center" gap={2} mb={3}>
        <Text
          color={data.txt}
          fontWeight="700"
          fontSize={{ base: "xl", md: "2xl" }}
          opacity={0.6}
          letterSpacing="0.04em"
          lineHeight="short"
        >
          {index}.
        </Text>
        <Text
          color={data.txt}
          fontWeight="700"
          fontSize={{ base: "xl", md: "2xl" }}
          letterSpacing="0.04em"
          lineHeight="short"
          filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.3))"
        >
          {data.name}
        </Text>
      </Flex>

      {/* Descripción */}
      <Text
        color={data.txt}
        opacity={0.85}
        fontSize={{ base: "md", md: "lg" }}
        lineHeight="1.85"
        letterSpacing="0.01em"
      >
        {data.desc}
      </Text>
    </Box>
  );
}

export default function ElMetodo() {
  const navigate = useNavigate();
  const headerReveal = useReveal(0.05);
  const cardsReveal = useReveal(0.04);
  const pricingReveal = useReveal(0.1);
  const [modalOpen, setModalOpen] = useState(false);
  const [dudasOpen, setDudasOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ModalidadData | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedCard]);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      {/* ── CABECERA ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 14 }}>
        <Box
          ref={headerReveal.ref}
          w={{ base: "100%", md: "80%" }}
          bg="rgba(255,255,255,0.22)"
          border="1px solid rgba(255,255,255,0.45)"
          sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
          borderRadius="2xl"
          boxShadow="0 8px 36px rgba(107,196,200,0.45)"
          px={{ base: 8, md: 14 }}
          py={{ base: 8, md: 10 }}
          display="flex"
          mt="10px"
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          gap={{ base: 6, md: 10 }}
          opacity={headerReveal.visible ? 1 : 0}
          transform={headerReveal.visible ? "none" : "translateY(-30px)"}
          transition="opacity 0.75s ease, transform 0.75s ease"
        >
          {/* Icono life.png a la izquierda */}
          <Box flexShrink={0} w={{ base: "110px", md: "140px" }} alignSelf="center">
            <Image
              src="/img/icono/life.png"
              alt="Life as a Privilege"
              w="100%"
              objectFit="contain"
              filter="drop-shadow(0 4px 14px rgba(255,255,255,0.3))"
            />
          </Box>

          {/* Título */}
          <Box flex="1" textAlign={{ base: "center", md: "left" }}>
           <Text
            color="white"
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight="700"
            letterSpacing="0.06em"
            lineHeight="1.15"
            textShadow="0 2px 14px rgba(0,80,70,0.4)"
          >
            EL MÉTODO DE<br />
            <Box as="span" fontStyle="italic" display="block" mt={2}>
              LIFE AS A PRIVILEGE
            </Box>
          </Text>
            <Text
              color="rgba(255,255,255,0.8)"
              fontSize={{ base: "md", md: "xl" }}
              lineHeight="1.85"
              letterSpacing="0.015em"
              mt={4}
              textShadow="0 1px 6px rgba(0,60,50,0.3)"
            >
              Terapia holística orientada a guiar a la persona, desde la dignidad y el respeto propio, a través de las disciplinas siguientes para un camino completo de autoconocimiento y regeneración...
            </Text>
          </Box>
        </Box>
      </Flex>

      {/* ── CARDS DE MODALIDADES ── */}
      <Box
        ref={cardsReveal.ref}
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 18, md: 24 }}
        pb={{ base: 6, md: 10 }}
      >
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
          gap={{ base: 12, md: 14 }}
        >
          {modalidades.map((m, i) => (
            <MetodoCard
              key={m.name}
              data={m}
              delay={i * 0.1}
              parentVisible={cardsReveal.visible}
              index={i + 1}
              onClick={() => setSelectedCard(m)}
            />
          ))}
        </Grid>
      </Box>

      {/* ── CARD DE INFORMACIÓN Y PRECIO ── */}
      <Flex
        justify="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 14, md: 18 }}
        pb={{ base: 16, md: 20 }}
      >
        <Box
          ref={pricingReveal.ref}
          w={{ base: "100%", md: "80%" }}
          bg="rgba(255,255,255,0.18)"
          border="1px solid rgba(255,255,255,0.4)"
          sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
          borderRadius="2xl"
          boxShadow="0 12px 50px rgba(107,196,200,0.4), 0 4px 20px rgba(107,196,200,0.2)"
          px={{ base: 8, md: 14 }}
          py={{ base: 10, md: 12 }}
          opacity={pricingReveal.visible ? 1 : 0}
          transform={pricingReveal.visible ? "none" : "translateY(28px)"}
          transition="opacity 0.75s ease, transform 0.75s ease"
          cursor="default"
        >
          {/* Encabezado */}
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            textAlign="center"
            mb={6}
            textShadow="0 2px 10px rgba(0,60,50,0.4)"
          >
            ¿Cómo funciona?
          </Text>

          {/* Separador */}
          <Box
            h="1px"
            mx="auto"
            w={{ base: "60%", md: "40%" }}
            mb={8}
            bgGradient="linear(to-r, transparent, rgba(255,255,255,0.45), transparent)"
          />

          {/* Info sesiones */}
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 6, md: 10 }}
            justify="center"
            align={{ base: "center", md: "flex-start" }}
            mb={8}
          >
            <Box textAlign="center" flex="1">
              <Text color="rgba(255,255,255,0.6)" fontSize="sm" letterSpacing="0.15em" textTransform="uppercase" mb={1}>
                Pack completo
              </Text>
              <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700">
                70 €
              </Text>
              <Text color="rgba(255,255,255,0.75)" fontSize="sm" mt={1} lineHeight="1.5">
                acceso a todos los cursos y materiales grabados
              </Text>
              <Text color="rgba(255,255,255,0.55)" fontSize="xs" mt={1} fontStyle="italic">
                disponible durante 1 año desde la compra
              </Text>
            </Box>
            <Box
              display={{ base: "none", md: "block" }}
              w="1px"
              bg="rgba(255,255,255,0.25)"
              alignSelf="stretch"
            />
            <Box textAlign="center" flex="1">
              <Text color="rgba(255,255,255,0.6)" fontSize="sm" letterSpacing="0.15em" textTransform="uppercase" mb={1}>
                Consultas individuales
              </Text>
              <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700">
                10 € <Box as="span" fontSize={{ base: "lg", md: "xl" }} fontWeight="500" opacity={0.8}>/ sesión</Box>
              </Text>
              <Text color="rgba(255,255,255,0.75)" fontSize="sm" mt={1} lineHeight="1.5">
                1 hora de duración, se pagan aparte del pack
              </Text>
            </Box>
          </Flex>

          {/* Texto acompañamiento */}
          {/* <Text
            color="rgba(255,255,255,0.88)"
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="1.9"
            letterSpacing="0.015em"
            textAlign="center"
            mb={6}
          >
            Este método incluye <strong>seguimiento personalizado</strong> y acompañamiento cercano durante todo el proceso. El número de sesiones no está predefinido: cada camino es único y se respeta su propio ritmo.
          </Text> */}

          {/* <Text
            color="rgba(255,255,255,0.88)"
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="1.9"
            letterSpacing="0.015em"
            textAlign="center"
            mb={6}
          >
            Aunque mi experiencia es corta, <strong>tengo plena confianza en mi capacidad para acompañarte</strong>. Gracias por tu confianza y por tu tiempo.
          </Text> */}

          {/* Comunidad / Telegram */}
          <Box
            bg="rgba(255,255,255,0.12)"
            border="1px solid rgba(255,255,255,0.25)"
            borderRadius="xl"
            px={{ base: 6, md: 10 }}
            py={6}
            mb={6}
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            alignItems="center"
            gap={{ base: 4, md: 6 }}
          >
            <Box
              flexShrink={0}
              w={{ base: "56px", md: "64px" }}
              h={{ base: "56px", md: "64px" }}
              borderRadius="full"
              bg="rgba(255,255,255,0.18)"
              border="1px solid rgba(255,255,255,0.35)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={2}
            >
              <Image
                src="/img/icono/life.png"
                alt="Life as a Privilege"
                w="100%"
                h="100%"
                objectFit="contain"
                filter="drop-shadow(0 2px 6px rgba(255,255,255,0.3))"
              />
            </Box>
            <Box flex="1" textAlign={{ base: "center", md: "left" }}>
              <Text
                color="white"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                letterSpacing="0.04em"
                mb={2}
              >
                Comunidad y acompañamiento diario
              </Text>
              <Text
                color="rgba(255,255,255,0.85)"
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.85"
                letterSpacing="0.015em"
              >
                Al unirte tendrás acceso a un <strong>grupo privado de Telegram</strong> donde podrás conversar con otras personas que están transitando este mismo camino, y recibirás <strong>un vídeo mío cada día</strong> para acompañarte en el proceso.
              </Text>
            </Box>
          </Box>

          {/* Mensaje sobre el precio */}
          <Box
            bg="rgba(255,255,255,0.12)"
            border="1px solid rgba(255,255,255,0.25)"
            borderRadius="xl"
            px={{ base: 6, md: 10 }}
            py={6}
          >
            <Text
              color="white"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.9"
              letterSpacing="0.015em"
              textAlign="center"
              fontStyle="italic"
            >
              El precio es <strong>económico</strong> porque creo que el camino de la consciencia no tiene que ser un lujo para unos pocos, sino un <strong>derecho del pueblo</strong>. Quiero que cualquier persona interesada pueda acceder, independientemente de su situación económica.
            </Text>
          </Box>

          {/* ── Botón Quién soy ── */}
          <Flex justify={{ base: "center", md: "flex-end" }} mt={6}>
            <Box
              as="button"
              onClick={() => navigate("/quienSoy")}
              display="flex"
              alignItems="center"
              gap={2}
              color="rgba(255,255,255,0.62)"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }}
              fontStyle="italic"
              letterSpacing="0.04em"
              cursor="pointer"
              bg="transparent"
              sx={{
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.25)",
                paddingBottom: "2px",
                transition: "all 0.22s ease",
                "&:hover": {
                  color: "white",
                  borderBottomColor: "rgba(255,255,255,0.7)",
                },
              }}
            >
              Conocer a la creadora
              <Box as="span" fontSize="sm" opacity={0.8}>→</Box>
            </Box>
          </Flex>

        </Box>
      </Flex>

      {/* ── BOTONES QUIERO APUNTARME / TENGO DUDAS ── */}
      <Flex
        justify="center"
        pb={{ base: 16, md: 20 }}
        gap={{ base: 4, md: 6 }}
        direction={{ base: "column", md: "row" }}
        align="center"
      >
        <Box
          as="button"
          onClick={() => setModalOpen(true)}
          px={{ base: 10, md: 14 }}
          py={{ base: 4, md: 5 }}
          borderRadius="full"
          bg="transparent"
          border="2px solid rgba(255,255,255,0.65)"
          color="white"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="600"
          letterSpacing="0.12em"
          fontStyle="italic"
          boxShadow="0 4px 24px rgba(107,196,200,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
          sx={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          transition="all 0.3s ease"
          _hover={{
            bg: "rgba(255,255,255,0.12)",
            borderColor: "white",
            boxShadow: "0 8px 36px rgba(107,196,200,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
            transform: "translateY(-2px)",
          }}
          _active={{ transform: "translateY(0)", bg: "rgba(255,255,255,0.18)" }}
          cursor="pointer"
        >
          <Flex as="span" align="center" gap={3}>
            <Image src="/img/icono/life.png" h={{ base: "22px", md: "26px" }} objectFit="contain" />
            Quiero apuntarme
          </Flex>
        </Box>

        <Box
          as="button"
          onClick={() => setDudasOpen(true)}
          px={{ base: 10, md: 14 }}
          py={{ base: 4, md: 5 }}
          borderRadius="full"
          bg="transparent"
          border="2px solid rgba(255,255,255,0.65)"
          color="white"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="600"
          letterSpacing="0.12em"
          fontStyle="italic"
          boxShadow="0 4px 24px rgba(107,196,200,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
          sx={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          transition="all 0.3s ease"
          _hover={{
            bg: "rgba(255,255,255,0.12)",
            borderColor: "white",
            boxShadow: "0 8px 36px rgba(107,196,200,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
            transform: "translateY(-2px)",
          }}
          _active={{ transform: "translateY(0)", bg: "rgba(255,255,255,0.18)" }}
          cursor="pointer"
        >
          <Flex as="span" align="center" gap={3}>
            <Box
              as="svg"
              viewBox="0 0 24 24"
              w={{ base: "22px", md: "26px" }}
              h={{ base: "22px", md: "26px" }}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </Box>
            Tengo dudas
          </Flex>
        </Box>
      </Flex>

      {/* ── MODAL MODALIDAD ── */}
      {selectedCard && (
        <Box
          position="fixed"
          inset={0}
          zIndex={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0,0,0,0.6)"
          sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          onClick={() => setSelectedCard(null)}
          px={{ base: 5, md: 10 }}
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            bg={selectedCard.bg + "f0"}
            border={`1.5px solid ${selectedCard.txt}66`}
            sx={{ backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)" }}
            borderRadius="3xl"
            boxShadow={`0 12px 60px rgba(0,0,0,0.55), 0 0 0 1px ${selectedCard.txt}33, 0 0 80px ${selectedCard.txt}22`}
            p={{ base: 7, md: 14 }}
            maxW={{ base: "100%", md: "880px" }}
            w="100%"
            maxH={{ base: "92vh", md: "92vh" }}
            overflowY="auto"
            display="flex"
            flexDirection="column"
            gap={{ base: 6, md: 8 }}
            position="relative"
          >
            {/* X */}
            <Box
              position="absolute"
              top={5}
              right={5}
              as="button"
              onClick={() => setSelectedCard(null)}
              color={selectedCard.txt}
              fontSize="lg"
              cursor="pointer"
              bg={selectedCard.txt + "22"}
              borderRadius="full"
              w="40px"
              h="40px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{ bg: selectedCard.txt + "44" }}
              transition="background 0.2s"
              zIndex={2}
            >
              ✕
            </Box>

            {/* HERO ── icono + título + descripción ── */}
            <Flex direction="column" align="center" gap={{ base: 4, md: 6 }} pt={{ base: 2, md: 4 }}>
              {/* Halo decorativo + icono */}
              <Box position="relative" display="flex" alignItems="center" justifyContent="center">
                <Box
                  position="absolute"
                  w={{ base: "160px", md: "200px" }}
                  h={{ base: "160px", md: "200px" }}
                  borderRadius="full"
                  bg={`radial-gradient(circle, ${selectedCard.txt}33 0%, ${selectedCard.txt}00 70%)`}
                />
                <Box
                  bg={selectedCard.bg}
                  borderRadius="full"
                  w={{ base: "108px", md: "128px" }}
                  h={{ base: "108px", md: "128px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border={`3px solid ${selectedCard.txt}`}
                  boxShadow={`0 0 28px ${selectedCard.txt}cc, 0 4px 20px ${selectedCard.txt}77`}
                  position="relative"
                >
                  {selectedCard.renderIcon("64px")}
                </Box>
              </Box>

              {/* Tagline pequeño */}
              <Text
                color={selectedCard.txt}
                opacity={0.55}
                fontSize="xs"
                letterSpacing="0.32em"
                textTransform="uppercase"
                fontWeight="600"
              >
                — Disciplina del Método —
              </Text>

              {/* Nombre — gigante */}
              <Text
                color={selectedCard.txt}
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="700"
                letterSpacing="0.05em"
                textAlign="center"
                lineHeight="1.1"
                filter={`drop-shadow(0 2px 14px ${selectedCard.txt}55)`}
              >
                {selectedCard.name}
              </Text>

              {/* Línea decorativa */}
              <Box
                w="80px"
                h="2px"
                bgGradient={`linear(to-r, transparent, ${selectedCard.txt}, transparent)`}
                opacity={0.7}
              />

              {/* Descripción */}
              <Text
                color={selectedCard.txt}
                fontSize={{ base: "md", md: "xl" }}
                textAlign="center"
                lineHeight="1.95"
                letterSpacing="0.015em"
                opacity={0.85}
                maxW="640px"
              >
                {selectedCard.modalDesc}
              </Text>
            </Flex>

            {/* Separador antes del contenido */}
            <Flex align="center" gap={4} mt={{ base: 2, md: 4 }}>
              <Box flex="1" h="1px" bgGradient={`linear(to-r, transparent, ${selectedCard.txt}55)`} />
              <Text
                color={selectedCard.txt}
                opacity={0.7}
                fontSize="xs"
                letterSpacing="0.32em"
                textTransform="uppercase"
                fontWeight="600"
              >
                Qué incluye
              </Text>
              <Box flex="1" h="1px" bgGradient={`linear(to-l, transparent, ${selectedCard.txt}55)`} />
            </Flex>

            {/* SECCIONES DE CONTENIDO ── cada apartado en su propio box ── */}
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
              }}
              gap={{ base: 4, md: 5 }}
            >
              {selectedCard.contenido.map((seccion, i) => (
                <Box
                  key={i}
                  bg={selectedCard.txt + "12"}
                  border={`1px solid ${selectedCard.txt}40`}
                  borderRadius="xl"
                  p={{ base: 5, md: 5 }}
                  position="relative"
                >
                  {/* Cabecera de sección */}
                  <Flex align="center" gap={3} mb={3}>
                    <Box
                      w="40px"
                      h="40px"
                      borderRadius="lg"
                      bg={selectedCard.txt + "22"}
                      border={`1px solid ${selectedCard.txt}44`}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <SectionIcon titulo={seccion.titulo} color={selectedCard.txt} />
                    </Box>
                    <Text
                      color={selectedCard.txt}
                      fontSize={{ base: "lg", md: "lg" }}
                      fontWeight="700"
                      letterSpacing="0.03em"
                    >
                      {seccion.titulo}
                    </Text>
                  </Flex>

                  {/* Items */}
                  <Flex direction="column" gap={2.5}>
                    {seccion.items.map((item, j) => (
                      <Text
                        key={j}
                        color={selectedCard.txt}
                        opacity={0.88}
                        fontSize={{ base: "sm", md: "md" }}
                        lineHeight="1.75"
                        letterSpacing="0.01em"
                      >
                        {item}
                      </Text>
                    ))}
                  </Flex>
                </Box>
              ))}
            </Grid>
          </Box>
        </Box>
      )}

      <WaitlistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      <ContactModal
        isOpen={dudasOpen}
        onClose={() => setDudasOpen(false)}
        title="Tengo dudas"
        bgColor="#008080"
        color="#ffffff"
        emailSubject="Consulta — Life as a Privilege"
        showCheckboxes={false}
        showDescription={true}
        textareaPlaceholder="Escribe aquí tu consulta..."
      />

      <SiteFooter />
    </Box>
  );
}
