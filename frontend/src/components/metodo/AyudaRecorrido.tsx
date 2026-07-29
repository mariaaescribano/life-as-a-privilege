import React, { useState } from "react";
import {
  Box, Flex, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import { neuropsicologiaBg, neuropsicologiaNom, neuropsicologiaTxt } from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { AgendarLlamada } from "../global/AgendarLlamada";
import { CursoCardDetalle } from "../aprendizaje/CursoCardDetalle";
import { useCursosData } from "../../data/cursosApi";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { NUDOS, MIEDOS, NECESIDADES_INTRO, REGULACION } from "./psicologiaRecorrido";
import { IndiceRecorrido } from "./IndiceRecorrido";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
// Halo claro para que la tinta se lea sobre el fondo de acuarela (igual que en
// el resto del recorrido de psicología).
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

// Curso (de acceso libre) que se muestra en el popup «Orientación» de cada
// página del recorrido. Varía por página: añade aquí la pareja página → id de
// curso. Las páginas sin entrada no muestran curso (cae al texto de siempre).
// Los ids salen de la tabla `curso` (GET /cursos).
const ORIENTACION_CURSO: Partial<Record<string, string>> = {
  inicio: "cf53523f-9a27-4866-95e3-71e08cef4886",          // Psicología · «Los primeros vínculos»
  problema: "bf6d66b3-48e1-46f7-90c3-639c7f0f0bc4",        // Psicología · «El Trauma»
  "linea-de-Vida": "bf6d66b3-48e1-46f7-90c3-639c7f0f0bc4", // Psicología · «El Trauma»
  huellas: "bf6d66b3-48e1-46f7-90c3-639c7f0f0bc4",         // Psicología · «El Trauma»
  nudos: "cd03ced9-f239-4236-93d4-31eb2e995ef6",           // Psicología · «La Autoestima»
};

// Box de «Ejemplo» con fondo de psicología y una lista de ejemplos, por página.
// Las páginas con entrada aquí abren este box elegante en vez del popup de texto
// de siempre. Edita/añade ejemplos libremente.
// `variante`: "frases" → tarjetas de cita (frases largas); "chips" → etiquetas
// (ítems cortos, p. ej. los nudos); "herida" → ejemplo estructurado
// (Huella → Nudo → Herida). Por defecto "frases".
const EJEMPLOS_BOX: Partial<Record<string, {
  titulo: string;
  subtitulo?: string;
  variante?: "frases" | "chips" | "herida" | "relacion";
  ejemplos?: string[];
  triadas?: { huella: string; necesidad: string; nudo: string; herida: string }[];
  relaciones?: { herida: string; arquetipo: string; relacionTitulo: string; comprension?: string }[];
}>> = {
  problema: {
    titulo: "Ejemplos de problemas",
    ejemplos: [
      "Me cuesta poner límites y acabo agotada por complacer a los demás.",
      "Haga lo que haga, siento que nunca soy suficiente.",
      "Me cuesta confiar; siempre espero que tarde o temprano me fallen.",
      "Necesito tenerlo todo bajo control y vivo en tensión.",
      "Evito los conflictos y me callo lo que de verdad siento.",
      "Me cuesta estar sola y busco constantemente aprobación.",
      "Aplazo lo importante y luego me castigo por no avanzar.",
    ],
  },
  huellas: {
    titulo: "Ejemplos de huellas",
    variante: "chips",
    ejemplos: [
      "La muerte de mi abuela",
      "El día que aprobé el examen",
      "La mudanza a otra ciudad",
      "Mi primer desamor",
      "Cuando nació mi hermana",
      "El divorcio de mis padres",
      "Un verano en casa de mis abuelos",
      "El día que me sentí libre",
    ],
  },
  nudos: {
    titulo: "Ejemplos de nudos",
    ejemplos: NUDOS.ejemplos,
    variante: "chips",
  },
  miedos: {
    titulo: "Ejemplos de miedos",
    ejemplos: MIEDOS.ejemplos,
    variante: "chips",
  },
  dones: {
    titulo: "Ejemplos de dones",
    subtitulo: "(no para copiar: solo para que reconozcas los tuyos)",
    variante: "chips",
    ejemplos: [
      "Escuchar de verdad",
      "Calmar a los demás",
      "Ver soluciones donde otros ven muros",
      "Intuición",
      "Crear con las manos",
      "Poner orden en el caos",
      "Hacer reír",
      "Enseñar con paciencia",
      "Sostener a otros en lo difícil",
      "Imaginar y crear",
      "Liderar sin imponer",
      "Cuidar los detalles",
    ],
  },
  integracion: {
    titulo: "Ejemplo de relación",
    subtitulo: "(ejemplo sencillo orientativo)",
    variante: "relacion",
    relaciones: [
      {
        herida: "Reprimir mis emociones",
        arquetipo: "Saturno en Cáncer",
        relacionTitulo: "Represión emocional por ausencia de permiso en el pasado",
      },
    ],
  },
  heridas: {
    titulo: "Ejemplos de heridas",
    variante: "herida",
    triadas: [
      {
        huella: "Mis padres discutían mucho cuando era pequeño.",
        necesidad: "Seguridad emocional.",
        nudo: "Miedo al conflicto.",
        herida: "Aprendí que cuando alguien levanta la voz algo malo va a pasar; por eso evito discutir, aunque me calle lo que siento.",
      },
      {
        huella: "Mis padres criticaban mucho mis errores.",
        necesidad: "Validación emocional.",
        nudo: "Perfeccionismo.",
        herida: "Aprendí que equivocarme hacía que valiera menos.",
      },
    ],
  },
};

interface Seccion { titulo: string; cuerpo: string[] }
interface Ayuda { ejemplo: Seccion; ayuda: Seccion; orientacion: Seccion }

// ── Contenido por página del recorrido (editable) ──
export const AYUDA_RECORRIDO: Record<string, Ayuda> = {
  inicio: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "El Mapa te lleva de tu historia a tus patrones y a su raíz.",
        "Por ejemplo: recordarás un año de tu Vida, marcarás lo que dejó huella, nombrarás un nudo como «miedo al rechazo» y descubrirás de dónde nace.",
      ],
    },
    ayuda: {
      titulo: "¿Cómo funciona?",
      cuerpo: [
        "Avanza por las etapas en orden, sin prisa.",
        "Todo lo que escribes se guarda solo y es solo para ti.",
        "Puedes volver atrás cuando quieras.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No es un test ni hay respuestas correctas.",
        "La idea es que tú construyas tus propias conexiones.",
        "Si puedes, comparte el proceso con alguien de confianza.",
      ],
    },
  },
  problema: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Escribe con tus palabras lo que hoy te pesa.",
        "Por ejemplo: «Me cuesta poner límites y acabo agotada por complacer a los demás.»",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Escribe libremente, sin ordenar ni corregir.",
        "No tienes que encontrar la causa: solo describir lo que sientes hoy.",
        "Pulsa Guardar cuando quieras.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "Nombrar el problema ya es empezar a mirarlo.",
        "No busques la palabra perfecta; busca la honesta.",
      ],
    },
  },
  necesidades: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Cada celda es una necesidad de la infancia. Ábrela para ver la respuesta sana de un cuidador.",
        "Por ejemplo, en «Seguridad emocional» marcarías «Me faltó» si de niño te sentías solo ante el miedo o la tristeza.",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Pulsa el botón del centro de cada celda para abrirla.",
        "Lee la respuesta sana y marca cómo lo viviste tú: la recibí, a veces o me faltó.",
        "La celda cambia de color según lo que marques. Puedes cambiar tu respuesta cuando quieras.",
      ],
    },
    // «Orientación» en esta página abre el popup explicativo de cómo funciona
    // (antes era un botón «¿Cómo funciona?» propio de la página).
    orientacion: {
      titulo: NECESIDADES_INTRO.titulo,
      cuerpo: [
        NECESIDADES_INTRO.subtitulo,
        NECESIDADES_INTRO.texto,
      ],
    },
  },
  ace: {
    ejemplo: {
      titulo: "¿Qué es esto?",
      cuerpo: [
        "El test ACE mide las experiencias adversas que viviste en tu hogar antes de los 18 años: maltrato, abandono y disfunción familiar.",
        "Son 10 preguntas de sí o no. Cada «sí» suma un punto (de 0 a 10). No es una nota ni un juicio: solo pone nombre a lo que cargaste.",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Lee cada pregunta y responde Sí o No con honestidad. Puedes cambiar tu respuesta cuando quieras.",
        "Al responder las 10, aparecerá tu puntuación y su interpretación.",
        "Todo se guarda solo y es solo para ti.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "Una puntuación alta no es una condena: es un factor de riesgo, no un destino.",
        "Este test no es un diagnóstico. Si algo remueve demasiado, busca apoyo: pedir ayuda también es cuidarse.",
      ],
    },
  },
  "linea-de-Vida": {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Reconstruye tu Vida año a año, como las páginas de un libro.",
        "Por ejemplo, en «Año 8»: «Nos mudamos de ciudad. Me costó hacer amigos. Me sentía solo.»",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Toca un año para abrir su página y responder lo que recuerdes.",
        "Si no recuerdas nada de un año, márcalo como «sin recuerdos».",
        "Recorre toda tu Vida, desde que naciste hasta hoy.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No necesitas recordarlo todo ni en orden.",
        "Escribe lo que surja; un pequeño detalle puede abrir una puerta.",
      ],
    },
  },
  huellas: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Relee tu historia y marca con ◈ lo que dejó huella en ti.",
        "Por ejemplo, marcarías: «La muerte de mi abuela» o «El día que aprobé el examen».",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Pulsa ◈ junto a un recuerdo para marcarlo como huella.",
        "Vuelve a pulsarlo para quitarlo.",
        "Pasa las páginas para recorrer todos tus años.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "Una huella no es solo lo doloroso: también lo que te formó.",
        "Marca lo que aún resuena, aunque no sepas por qué.",
      ],
    },
  },
  nudos: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Un nudo es un patrón o conflicto que te acompaña hoy.",
        "Por ejemplo: «Miedo al rechazo», «Necesidad de control», «No sentirme suficiente».",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Escribe un nudo y pulsa Añadir.",
        "Puedes inspirarte en los ejemplos sugeridos.",
        "Quita con la ✕ los que no sientas tuyos.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No busques explicaciones perfectas.",
        "Observa simplemente lo que sientes presente en tu Vida ahora.",
      ],
    },
  },
  heridas: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Una herida une una experiencia con la necesidad que dejó sin cubrir y la creencia que nació de ahí.",
        "Huella: «Mis padres discutían mucho cuando era pequeño».",
        "Necesidad no cubierta: «Seguridad emocional».",
        "Nudo: «Miedo al conflicto».",
        "Y tú escribes: «Aprendí que cuando alguien levanta la voz algo malo va a pasar; por eso evito discutir, aunque me calle lo que siento.»",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Pulsa «+ Añadir herida» para crear una.",
        "Toca (o arrastra) las huellas y los nudos que sientas relacionados: se añaden a la herida activa y se iluminan con su color.",
        "Ponle un título y describe qué dejó en ti esa experiencia.",
      ],
    },
    // «Orientación» en esta página abre el popup de «cómo se hace» (antes era un
    // botón propio de la página, encima de las tres columnas).
    orientacion: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Toca las huellas, los nudos y las necesidades no cubiertas que sientas parte de una misma herida: se iluminan con su color.",
        "Cuando la tengas reunida, pulsa «He terminado esta herida».",
        "Ponle un nombre y pulsa «Guardar herida».",
        "La herida aparece abajo, en su propio color. Verás todas juntas en la página «Tus heridas».",
      ],
    },
  },
  integracion: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Relaciona un nudo con un arquetipo de tu carta astral.",
        "Por ejemplo: «Soledad» + «Saturno en Casa 1» → «Aprendí pronto a sostenerme sola.»",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Crea una relación con «+ Añadir relación».",
        "Toca (o arrastra) nudos y arquetipos para reunirlos; el ojo de cada carta abre su lectura.",
        "Ponle título y escribe lo que tú ves.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "La plataforma no interpreta por ti: la comprensión la escribes tú.",
        "Deja que los símbolos dialoguen; no busques respuestas rápidas.",
      ],
    },
  },
  // `mapa` es la clave interna de la página «Integración» (el ejercicio posterior
  // a Relación, donde transformas cada patrón en una narrativa más sana).
  mapa: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Toma una de tus relaciones y transfórmala en una verdad más sana.",
        "Por ejemplo, de «Mi valor depende de hacerlo perfecto» a «Mi valor no depende de hacerlo perfecto».",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Para cada relación responde las cuatro preguntas con calma.",
        "Reconoce qué protegía el patrón, qué te cuesta, qué quieres creer ahora y qué recordar.",
        "Todo se guarda solo; pulsa Guardar cuando quieras.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No se trata de seguir analizando el pasado, sino de empezar a escribir una historia nueva.",
        "Sé amable contigo: el patrón un día te protegió. Hoy puedes elegir otra verdad.",
      ],
    },
  },
  regulacion: {
    ejemplo: {
      titulo: "¿Qué es esto?",
      cuerpo: [
        "No es EMDR ni una terapia: es un espacio para descargar y calmar tu sistema nervioso.",
        "Mientras el audio pasa de un oído al otro, escribes lo que necesites soltar, sin ordenarlo.",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Ponte los auriculares y elige UNA sola cosa para trabajar hoy, no todo a la vez.",
        "Dale al play y escribe libremente lo que vaya surgiendo.",
        "Si en algún momento te supera, pulsa «Necesito parar»: el audio se detiene y te acompañamos a volver al presente.",
      ],
    },
    orientacion: {
      titulo: "Cuídate aquí",
      cuerpo: [
        "Ve despacio y a tu ritmo. Parar también es avanzar.",
        "Termina siempre con el cierre, para no levantarte en carne viva.",
        "Si esto remueve mucho, busca apoyo profesional o agenda una llamada de compañía.",
      ],
    },
  },
  dones: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Un don no es lo que aprendiste con esfuerzo, sino lo que se te da con naturalidad.",
        "Por ejemplo, a la pregunta «¿Qué te piden que ayudes a resolver?» quizá respondas: «Siempre me buscan para desahogarse; sé escuchar sin juzgar.»",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Responde las preguntas con calma; no hay respuestas correctas.",
        "Todo se guarda solo. Puedes dejarlo a medias y volver.",
        "Cuando termines, pasa al espejo: allí verás lo que has escrito y nombrarás tus dones.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No te frenes por pudor: aquí nadie más te lee.",
        "Si una pregunta te cuesta, piensa en lo que los demás agradecen de ti.",
      ],
    },
  },
  "dones-espejo": {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Leyendo tus respuestas, quizá reconozcas dones como: «Escucha», «Intuición», «Sostener a otros».",
        "Junto a ellos, los arquetipos de tu carta pueden confirmar lo que ya ves en ti.",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Relee tus respuestas y observa qué se repite.",
        "Escribe cada don que reconozcas y pulsa Añadir.",
        "Quita con la ✕ los que no sientas del todo tuyos.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "Reconocer es más fácil que inventar: nombra lo que ya está ahí.",
        "Un don también puede nacer de una herida. Lo que te rompió también te dio algo.",
      ],
    },
  },
  miedos: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Un miedo es algo que temes que ocurra y que condiciona cómo vives hoy.",
        "Por ejemplo: «A quedarme solo», «A no ser suficiente», «A que me abandonen».",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Escribe un miedo y pulsa Añadir.",
        "Puedes inspirarte en los ejemplos sugeridos.",
        "Quita con la ✕ los que no sientas tuyos. En la página siguiente los enfrentarás uno a uno.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No los suavices ni los justifiques: escríbelos tal y como aparecen.",
        "Nombrar un miedo ya le quita parte de su fuerza.",
      ],
    },
  },
  "miedos-preguntas": {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Toma un miedo y míralo de frente respondiendo a las preguntas.",
        "Por ejemplo, ante «Al fracaso»: qué es lo peor que pasaría, qué probabilidad real tiene, cómo lo afrontarías y qué le dirías a alguien que quieres.",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Cada miedo es un box con varias preguntas. Respóndelas con calma.",
        "No hay respuestas correctas: solo tu verdad.",
        "Todo se guarda solo; puedes dejarlo a medias y volver.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No se trata de vencer el miedo de golpe, sino de desarmarlo mirándolo con calma.",
        "Casi siempre, cuando lo miramos de frente, deja de ser tan grande como parecía.",
      ],
    },
  },
  compromiso: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Pon en palabras lo que te faltó y un gesto concreto para dártelo hoy.",
        "Por ejemplo: «Necesité que me dijeran que estaba bien equivocarme» → «Hoy, cuando falle, me hablaré con la misma suavidad con la que hablaría a un amigo.»",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Responde las dos preguntas con calma: qué necesitaste y cómo empezar a dártelo hoy.",
        "No busques grandes propósitos: un gesto pequeño y real vale más.",
        "Todo se guarda solo; pulsa Guardar cuando quieras.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "El compromiso no es contigo del pasado, sino contigo de hoy.",
        "Elige algo que puedas cumplir de verdad: cuidarte se entrena en lo pequeño.",
      ],
    },
  },
  brujula: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Escríbete una carta para tu yo del futuro, para cuando vuelvas a bloquearte.",
        "Por ejemplo: «Cuando sientas que no puedes, recuerda que ya cruzaste esto antes. Respira, pide ayuda y da un solo paso.»",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Escribe con tus palabras lo que te gustaría recordar en un momento difícil.",
        "Háblate con cariño, como le hablarías a alguien a quien quieres.",
        "Se guarda solo; podrás releerlo siempre que lo necesites.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No es para juzgarte: es para recordarte el camino que ya conoces.",
        "Escríbelo desde tu parte más serena, la que sabe que esto también pasará.",
      ],
    },
  },
  sintesis: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Cada fila reúne una cadena completa de tu historia.",
        "Por ejemplo: «No soy suficiente» → «Equivocarme me hacía valer menos» → «Ascendente Virgo» → «Perfeccionismo» → «Mi valor no depende de hacerlo perfecto» → Aprendizaje: «Autoaceptación».",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se lee?",
      cuerpo: [
        "Observa tu camino completo, sin prisa.",
        "Elige para cada relación el aprendizaje que quieres llevarte.",
        "Despídete escribiendo el capítulo que quieres empezar a vivir.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No hay más análisis ni más heridas: solo comprensión, integración y dirección.",
        "Esta página es para contemplar lo que ya eres capaz de ver.",
      ],
    },
  },
};

function BotonAyuda({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <Box as="button" onClick={onClick}
         position="relative" overflow="hidden"
         px={{ base: 4, md: 5 }} py={2} borderRadius="full"
         border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif" fontWeight="700"
         fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.03em" cursor="pointer" whiteSpace="nowrap"
         transition="all 0.18s"
         _hover={{ transform: "translateY(-2px)" }}>
      {/* Fondo: imagen de la disciplina (psicología) recortada al pill */}
      <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="full" />
      <Box as="span" position="relative" zIndex={1} color={TINTA}
           style={{ textShadow: `0 1px 2px ${PAPEL}, 0 0 8px ${PAPEL}` }}>
        {children}
      </Box>
    </Box>
  );
}

/** Grupo fijo de botones de ayuda (abajo a la derecha) + sus popups, común a
 *  todo el recorrido de psicología. `pagina` elige el contenido.
 *
 *  La página `inicio` es especial: solo muestra «¿Necesitas ayuda?» (que abre la
 *  reserva de llamada para hacer el recorrido acompañado) y «Orientación» (que
 *  abre un popup con un curso de acceso libre). El resto de páginas mantiene los
 *  3 botones informativos de siempre. */
export function AyudaRecorrido({ pagina, ocultarCompania }: { pagina: keyof typeof AYUDA_RECORRIDO; ocultarCompania?: boolean }) {
  const [abierto, setAbierto] = useState<keyof Ayuda | null>(null);
  // Popups especiales de la página inicio.
  const [acompPreguntaOpen, setAcompPreguntaOpen] = useState(false); // paso previo "¿Necesitas ayuda?"
  const [companiaOpen, setCompaniaOpen] = useState(false);           // calendario de reserva
  const [cursoOpen, setCursoOpen] = useState(false);
  const [ejemplosOpen, setEjemplosOpen] = useState(false);           // box de ejemplos (págs. con EJEMPLOS_BOX)
  const [preparacionOpen, setPreparacionOpen] = useState(false);     // box «Antes de empezar» (pág. regulación)

  const contenido = AYUDA_RECORRIDO[pagina];
  const esInicio = pagina === "inicio";

  // Curso de acceso libre de esta página (si lo hay).
  const { cursosData } = useCursosData();
  const cursoId = ORIENTACION_CURSO[pagina as string];
  const curso = cursoId
    ? Object.values(cursosData).flatMap((m) => m.cursos).find((c) => c.id === cursoId)
    : undefined;

  // Box de ejemplos de esta página (si lo hay).
  const ejemplosBox = EJEMPLOS_BOX[pagina as string];

  // Bloquea el scroll del fondo mientras cualquier popup esté abierto.
  useLockBodyScroll(!!abierto || acompPreguntaOpen || companiaOpen || cursoOpen || ejemplosOpen || preparacionOpen);

  if (!contenido) return null;
  const sec = abierto ? contenido[abierto] : null;

  return (
    <>
      {/* Índice del recorrido (botón flotante abajo a la izquierda). Con bloqueo
          secuencial persistido en BD: bloquea los pasos posteriores al máximo
          desbloqueado y los va abriendo al llegar al siguiente. */}
      <IndiceRecorrido progresoKey="psicologia" />

      <Flex position="fixed" bottom={{ base: 4, md: 6 }} right={{ base: 4, md: 6 }} zIndex={20}
            direction="column" align="flex-end" gap={2}>
        {esInicio ? (
          <>
            <BotonAyuda onClick={() => setAcompPreguntaOpen(true)}>Agenda una llamada</BotonAyuda>
            <BotonAyuda onClick={() => setCursoOpen(true)}>Orientación</BotonAyuda>
          </>
        ) : (
          <>
            <BotonAyuda onClick={() => (ejemplosBox ? setEjemplosOpen(true) : setAbierto("ejemplo"))}>Ejemplo</BotonAyuda>
            {!ocultarCompania && (
              <BotonAyuda onClick={() => setAcompPreguntaOpen(true)}>Agenda una llamada</BotonAyuda>
            )}
            <BotonAyuda onClick={() => {
              if (pagina === "regulacion") setPreparacionOpen(true);   // «Antes de empezar»
              else if (curso) setCursoOpen(true);
              else setAbierto("orientacion");
            }}>Orientación</BotonAyuda>
          </>
        )}
      </Flex>

      {/* Popup informativo (páginas no-inicio) — estilo acuarela de psicología */}
      <Modal isOpen={!!sec} onClose={() => setAbierto(null)} isCentered scrollBehavior="inside" size={{ base: "sm", md: "md" }}>
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(5px)" }} />
        <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} fontFamily="'EB Garamond', serif">
          <Box position="relative" borderRadius="2xl" overflow="hidden" boxShadow={`0 26px 70px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <ModalCloseButton color={TINTA} zIndex={3} />
            <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 7, md: 9 }}>
              {sec && (
                <Flex direction="column" gap={4}>
                  <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center"
                        style={{ textShadow: INK_SHADOW }}>
                    {sec.titulo}
                  </Text>
                  <Box h="1px" w="55%" maxW="220px" mx="auto" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                  <Flex direction="column" gap={3}>
                    {sec.cuerpo.map((p, i) => (
                      <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
                            fontStyle={abierto === "ejemplo" && i >= 1 ? "italic" : "normal"}
                            style={{ textShadow: INK_SHADOW }}>
                        {p}
                      </Text>
                    ))}
                  </Flex>
                </Flex>
              )}
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>

      {/* Popup previo «¿Necesitas ayuda?» → invita a hacerlo acompañado */}
      {acompPreguntaOpen && (
        <Box position="fixed" inset={0} zIndex={2300} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.82)"
             sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
             onClick={() => setAcompPreguntaOpen(false)} fontFamily="'EB Garamond', serif">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="460px"
               borderRadius="2xl" overflow="hidden" boxShadow={`0 30px 80px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 9, md: 14 }} py={{ base: 12, md: 16 }} textAlign="center">
              <Box as="button" onClick={() => setAcompPreguntaOpen(false)} position="absolute" top={3} right={3}
                   w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
                   color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
                   _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>✕</Box>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.4" mb={5} style={{ textShadow: INK_SHADOW }}>
                Agenda una llamada
              </Text>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} opacity={0.85} lineHeight="1.8" mb={7}>
                Puedes recorrer este tramo conmigo. Agenda una llamada, no hace falta hacerlo todo de forma individual.
              </Text>
              <Box as="button" onClick={() => { setAcompPreguntaOpen(false); setCompaniaOpen(true); }}
                   px={9} py={3} borderRadius="full" bg={TINTA} color={PAPEL} border={`1px solid ${TINTA}`}
                   fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.06em"
                   cursor="pointer" boxShadow={`0 6px 20px rgba(94,45,16,0.32)`} transition="all 0.2s"
                   _hover={{ transform: "translateY(-2px)", boxShadow: `0 10px 28px rgba(94,45,16,0.42)` }}>
                Agenda tu llamada →
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Popup «¿Necesitas ayuda?» → recorrido acompañado (reserva de llamada) */}
      {companiaOpen && (
        <Box position="fixed" inset={0} zIndex={2300} display="flex" alignItems="flex-start" justifyContent="center"
             px={{ base: 3, md: 10 }} py={{ base: 5, md: 10 }} bg="rgba(0,0,0,0.82)"
             sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
             onClick={() => setCompaniaOpen(false)} fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="640px" my="auto">
            <Box as="button" onClick={() => setCompaniaOpen(false)} position="absolute" top={3} right={3} zIndex={2}
                 w="36px" h="36px" borderRadius="full"
                 bg="rgba(255,251,243,0.85)" border={`1px solid ${TINTA}44`} color={TINTA}
                 display="flex" alignItems="center" justifyContent="center" fontSize="lg" cursor="pointer"
                 _hover={{ bg: "#fff" }}>✕</Box>
            <AgendarLlamada
              color={neuropsicologiaTxt}
              bgColor={neuropsicologiaBg}
              disciplinaNom={neuropsicologiaNom}
              tipo="compania"
              titulo="¿Prefieres compañía?"
              subtitulo="Recorre el camino conmigo. Agenda una llamada · horario peninsular España"
            />
          </Box>
        </Box>
      )}

      {/* Popup «Ejemplo» → box elegante con varios ejemplos (págs. con EJEMPLOS_BOX) */}
      {ejemplosOpen && ejemplosBox && (
        <Box position="fixed" inset={0} zIndex={2300} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.82)"
             sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
             onClick={() => setEjemplosOpen(false)} fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="520px" my="auto"
               borderRadius="2xl" overflow="hidden" boxShadow={`0 30px 80px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 9, md: 12 }}
                 maxH={{ base: "calc(100vh - 64px)", md: "calc(100vh - 96px)" }} overflowY="auto"
                 sx={{ "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "9999px" } }}>
              <Box as="button" onClick={() => setEjemplosOpen(false)} position="absolute" top={3} right={3} zIndex={2}
                   w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
                   color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
                   _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>✕</Box>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" lineHeight="1.3"
                    pr={6} style={{ textShadow: INK_SHADOW }}>
                {ejemplosBox.titulo}
              </Text>
              {ejemplosBox.subtitulo && (
                <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" textAlign="center"
                      opacity={0.7} mt={1.5}>
                  {ejemplosBox.subtitulo}
                </Text>
              )}
              <Box h="1px" w="55%" maxW="220px" mx="auto" my={5} bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
              {ejemplosBox.variante === "herida" ? (
                <Flex direction="column" gap={4}>
                  {(ejemplosBox.triadas ?? []).map((t, i) => (
                    <Box key={i} px={{ base: 4, md: 5 }} py={{ base: 4, md: 4 }} borderRadius="xl"
                         bg="rgba(255,251,243,0.72)" border={`1px solid ${TINTA}33`}
                         sx={{ backdropFilter: "blur(4px)" }}>
                      <Flex direction="column" gap={2.5}>
                        {([["Huella", t.huella], ["Necesidad no cubierta", t.necesidad], ["Nudo", t.nudo], ["Herida", t.herida]] as const).map(([label, texto]) => (
                          <Box key={label}>
                            <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.18em" textTransform="uppercase"
                                  opacity={0.7} mb={0.5} style={{ textShadow: INK_SHADOW }}>
                              {label}
                            </Text>
                            <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.6">
                              «{texto}»
                            </Text>
                          </Box>
                        ))}
                      </Flex>
                    </Box>
                  ))}
                </Flex>
              ) : ejemplosBox.variante === "relacion" ? (
                <Flex direction="column" gap={6}>
                  {(ejemplosBox.relaciones ?? []).map((r, i) => (
                    <Flex key={i} direction="column" gap={3}>
                      <Box>
                        <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.18em" textTransform="uppercase"
                              opacity={0.7} mb={0.5} style={{ textShadow: INK_SHADOW }}>Herida</Text>
                        <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.6"
                              style={{ textShadow: INK_SHADOW }}>
                          «{r.herida}»
                        </Text>
                      </Box>
                      <Box>
                        <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.18em" textTransform="uppercase"
                              opacity={0.7} mb={0.5} style={{ textShadow: INK_SHADOW }}>Arquetipo</Text>
                        <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
                          {r.arquetipo}
                        </Text>
                      </Box>
                      <Box>
                        <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.18em" textTransform="uppercase"
                              opacity={0.7} mb={0.5} style={{ textShadow: INK_SHADOW }}>Relación</Text>
                        <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.4"
                              style={{ textShadow: INK_SHADOW }}>
                          {r.relacionTitulo}
                        </Text>
                        {r.comprension && (
                          <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" mt={0.5} opacity={0.92}
                                style={{ textShadow: INK_SHADOW }}>
                            {r.comprension}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  ))}
                </Flex>
              ) : ejemplosBox.variante === "chips" ? (
                <Flex wrap="wrap" gap={2.5} justify="center">
                  {(ejemplosBox.ejemplos ?? []).map((ej, i) => (
                    <Box key={i} px={{ base: 3.5, md: 4 }} py={2} borderRadius="full"
                         bg="rgba(255,251,243,0.72)" border={`1px solid ${TINTA}33`}
                         sx={{ backdropFilter: "blur(4px)" }}>
                      <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.3" whiteSpace="nowrap">
                        {ej}
                      </Text>
                    </Box>
                  ))}
                </Flex>
              ) : (
                <Flex direction="column" gap={3}>
                  {(ejemplosBox.ejemplos ?? []).map((ej, i) => (
                    <Box key={i} px={{ base: 4, md: 5 }} py={3} borderRadius="xl"
                         bg="rgba(255,251,243,0.72)" border={`1px solid ${TINTA}33`}
                         sx={{ backdropFilter: "blur(4px)" }}>
                      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7">
                        «{ej}»
                      </Text>
                    </Box>
                  ))}
                </Flex>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Popup «Orientación» → curso de acceso libre */}
      {cursoOpen && (
        <Box position="fixed" inset={0} zIndex={2300} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.82)"
             sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
             onClick={() => setCursoOpen(false)} fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="460px" my="auto">
            <Flex align="center" justify="space-between" gap={3} mb={4}>
              <Text color={PAPEL} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.03em"
                    style={{ textShadow: `0 1px 3px rgba(0,0,0,0.5), 0 0 16px rgba(255,251,243,0.35)` }}>
                Orientación de acceso libre
              </Text>
              <Box as="button" onClick={() => setCursoOpen(false)}
                   w="36px" h="36px" borderRadius="full" flexShrink={0}
                   bg="rgba(255,251,243,0.85)" border={`1px solid ${TINTA}44`} color={TINTA}
                   display="flex" alignItems="center" justifyContent="center" fontSize="lg" cursor="pointer"
                   _hover={{ bg: "#fff" }}>✕</Box>
            </Flex>
            {curso ? (
              // Envoltura con overflow:hidden → recorta los brillos blancos/turquesa
              // propios de la tarjeta (pensados para la página teal) que sobre el
              // fondo oscuro del popup dejaban marcas raras. Sombra limpia propia.
              <Box borderRadius="2xl" overflow="hidden" boxShadow="0 24px 60px rgba(0,0,0,0.5)">
                <CursoCardDetalle curso={curso} color={neuropsicologiaTxt} bgColor={neuropsicologiaBg} nom={neuropsicologiaNom} />
              </Box>
            ) : (
              <Text color={PAPEL} fontStyle="italic" opacity={0.85}>
                El curso estará disponible pronto.
              </Text>
            )}
          </Box>
        </Box>
      )}

      {/* Popup «Orientación» de Regulación → «Antes de empezar» (pasos numerados)
          + el cuidado («Cuídate aquí»). Antes era un box fijo en la página. */}
      {preparacionOpen && (
        <Box position="fixed" inset={0} zIndex={2300} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.82)"
             sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
             onClick={() => setPreparacionOpen(false)} fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="520px" my="auto"
               borderRadius="2xl" overflow="hidden" boxShadow={`0 30px 80px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 9, md: 12 }}
                 maxH={{ base: "calc(100vh - 64px)", md: "calc(100vh - 96px)" }} overflowY="auto"
                 sx={{ "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "9999px" } }}>
              <Box as="button" onClick={() => setPreparacionOpen(false)} position="absolute" top={3} right={3} zIndex={2}
                   w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
                   color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
                   _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>✕</Box>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" lineHeight="1.3"
                    pr={6} style={{ textShadow: INK_SHADOW }}>
                {REGULACION.preparacion.titulo}
              </Text>
              <Box h="1px" w="55%" maxW="220px" mx="auto" my={5} bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
              <Flex direction="column" gap={{ base: 3, md: 3.5 }}>
                {REGULACION.preparacion.pasos.map((p, i) => (
                  <Flex key={i} align="flex-start" gap={3}>
                    <Box flexShrink={0} w="26px" h="26px" borderRadius="full" bg={TINTA} color={PAPEL}
                         display="flex" alignItems="center" justifyContent="center" fontSize="sm" fontWeight="700" mt="2px"
                         style={{ boxShadow: `0 1px 6px ${neuropsicologiaBg}` }}>
                      {i + 1}
                    </Box>
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" style={{ textShadow: INK_SHADOW }}>
                      {p}
                    </Text>
                  </Flex>
                ))}
              </Flex>

              {/* Cuidado (antes «Cuídate aquí», popup propio de Orientación) */}
              {contenido.orientacion && (
                <>
                  <Box h="1px" w="55%" maxW="220px" mx="auto" my={6} bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                  <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" textAlign="center"
                        style={{ textShadow: INK_SHADOW }}>
                    {contenido.orientacion.titulo}
                  </Text>
                  <Flex direction="column" gap={3} mt={4}>
                    {contenido.orientacion.cuerpo.map((p, i) => (
                      <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
                            style={{ textShadow: INK_SHADOW }}>
                        {p}
                      </Text>
                    ))}
                  </Flex>
                </>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
