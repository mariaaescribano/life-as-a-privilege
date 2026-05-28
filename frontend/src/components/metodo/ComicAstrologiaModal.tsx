import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { astrologiaTxt } from "../../GlobalVariables";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 1; }
`;

const blink = keyframes`
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const TYPE_SPEED_MS = 24;
const PARAGRAPH_PAUSE_MS = 420;

interface Vineta {
  src: string;
  paragraphs: string[];
}

// ────────────────────────────────────────────────────────────────────────────
// CONTENIDO DE LOS 3 SUB-CÓMICS
// ────────────────────────────────────────────────────────────────────────────

const VINETAS_PLANETAS: Vineta[] = [
  {
    src: "/viñetas/astrologia/planetas/sol.png",
    paragraphs: [
      "El Sol es la energía que nuestra alma necesita manifestar en su más alta frecuencia.",
      "No es lo que somos, es a lo que llegamos cuando nos hemos realizado.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/luna.png",
    paragraphs: [
      "La Luna fue lo que nos cobijó los primeros años de Vida.",
      "Nuestro más sensible vulnerabilidad, nuestra seguridad, nuestro punto de inicio y donde descansamos.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/mercurio.png",
    paragraphs: [
      "Mercurio es nuestro tipo de mentalidad.",
      "Dónde tenemos curiosidad, dónde permanecemos abiertos al cambio y preparados para descubrir cosas nuevas.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/venus.png",
    paragraphs: [
      "Venus es la energía que nos abre el corazón.",
      "Cómo disfrutamos de la Vida, dónde y cómo deseamos ser amados.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/marte.png",
    paragraphs: [
      "Marte es la energía que canaliza el deseo hacia la acción.",
      "Cómo y por qué entramos en acción, nuestra ambición y agresividad.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/jupiter.png",
    paragraphs: [
      "Júpiter es la expansión, la abundancia, las bendiciones que recibimos, los estudios y la alta consciencia.",
      "Nuestro estilo de crecimiento, nuestro deseo de trascender los límites y dónde buscamos el sentido de nuestra Vida.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/saturno.png",
    paragraphs: [
      "Saturno es la estructura y el autosostenimiento. Nos obliga a hacernos cargo de nosotros.",
      "Su crecimiento nos hace sentir inseguros, inadecuados y pequeños, pero si le integramos nos convertiremos en Maestros de esa energía.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/urano.png",
    paragraphs: [
      "Urano es la creación sin límites, la originalidad y lo impredecible.",
      "Dónde queremos más sin valorar lo que ya hay, el futurismo, lo inesperado y la libertad.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/neptuno.png",
    paragraphs: [
      "Neptuno es la confusión, el anhelo del Amor real y lo intangible.",
      "Dónde buscamos la fusión con Dios, cómo engañamos a otros y a nosotros. Puede no importarnos la realidad.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/pluton.png",
    paragraphs: [
      "Plutón es la bomba nuclear que nos destruye cíclicamente.",
      "No le vemos venir. Es nuestro miedo más profundo. Es la destrucción total que nos invita a una dolorosa pero necesaria transformación.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/nodoSur.png",
    paragraphs: [
      "El Nodo Sur es lo que debemos dejar atrás en nuestra Vida porque ya no tiene más para nosotros.",
      "Es lo que nos resulta fácil y cómodo, dónde queremos permanecer por miedo a lo desconocido y a la incomodidad.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/nodoNorte.png",
    paragraphs: [
      "El Nodo Norte es lo que debemos integrar para convertirnos en quién hemos nacido para ser.",
      "Nos resulta incómodo porque es lo contrario a lo que estamos acostumbrados.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/quiron.png",
    paragraphs: [
      "Quirón es la herida más profunda del alma.",
      "Se abre antes de los 3 años. No se cura del todo. Se aprende a vivir con él, y al hacerlo, nos da nuestro mayor don.",
    ],
  },
];

const VINETAS_SIGNOS: Vineta[] = [
  {
    src: "/viñetas/astrologia/signos/aries.png",
    paragraphs: [
      "Acaba de nacer. No conoce las reglas.",
      "Actúa sin ser consciente de que sus actos tienen consecuencias. Cuando rompe la barrera, pierde interés en lo que hay detrás y busca la siguiente.",
      "Necesita novedad constante, por eso le cuesta acabar lo que empieza. Prefiere pelear antes que aceptar su derrota.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/tauro.png",
    paragraphs: [
      "Materializa la energía. Conectado con la naturaleza.",
      "Vive en los sentidos. Disfruta despacio y trabaja constante. Termina lo que empieza.",
      "Necesita anclarse en algo sólido y estable. Confunde seguridad con apego a patrones tóxicos.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/geminis.png",
    paragraphs: [
      "La inteligencia en alta frecuencia. El ruido si no se pone consciencia.",
      "Le cuesta el mundo emocional, por eso se queda en lo mental. Piensa antes de sentir.",
      "No tolera el aburrimiento ni lo ya sabido. Cambia constantemente porque desea novedad.",
      "Debe aprender a profundizar y a bajar a su corazón.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/cancer.png",
    paragraphs: [
      "Necesita sentir para saber quién es.",
      "Necesita pertenecer. Su identidad viene de dónde viene. Hace familia a aquellos que ama.",
      "Es vulnerable por dentro. Por eso construye un escudo por fuera. Le cuesta soltar el pasado, incluso cuando duele.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/leo.png",
    paragraphs: [
      "Brillante, carismático, encantador. Atrae atención y además la necesita.",
      "Busca la validación de otros, pero debe aprender a validarse a sí mismo.",
      "Domina de forma natural. Puede cazar para demostrar su supremacía. Le calma más el halago que la razón.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/virgo.png",
    paragraphs: [
      "Analiza, ordena, cuida, sirve.",
      "Vive sin querer ver su propio caos. Somatiza lo que niega.",
      "Es el crítico y juzgador más duro consigo mismo y con los demás. Debe poner sus dones al servicio de algo mayor.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/libra.png",
    paragraphs: [
      "La diplomacia. Necesita al otro para descubrirse a sí mismo.",
      "Quiere encajar y ser aceptado en la sociedad. Indeciso. Quiere que otros decidan por él.",
      "No le gustan las peleas. Recopila datos de todos para evitar enfados.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/escorpio.png",
    paragraphs: [
      "Intensidad, profundidad, transformación. Todo o nada.",
      "Paseos por los infiernos para descubrir su sombra.",
      "Desea fundirse con el otro. La separación después de la fusión es lo que más le duele.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/sagitario.png",
    paragraphs: [
      "El filósofo. Busca el sentido de la Vida. Encuentra el para qué de sus experiencias.",
      "Nómada por naturaleza. La libertad no se negocia.",
      "El maestro. El que va más allá.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/capricornio.png",
    paragraphs: [
      "La responsabilidad. Desea que lo que construye repercuta positivamente en las siguientes generaciones.",
      "Espera. Renuncia. Aguanta. Pone el deber antes que el deseo. Planificador meticuloso.",
      "Por dentro es frágil. No lo va a contar ni quiere que se note. Solo descansa cuando todo lo demás está hecho.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/acuario.png",
    paragraphs: [
      "Ama a la humanidad, odia a los humanos.",
      "Desea pertenecer. No quiere perder su individualidad. Original. Innovador.",
      "Analiza a todos antes de fiarse. No le gustan los vínculos ni compromisos emocionales.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/piscis.png",
    paragraphs: [
      "Debe diferenciar si lo que siente es suyo o si lo ha absorbido sin querer.",
      "Carga la basura psíquica de otros, debe aprender a liberarse. Ese dolor no es suyo.",
      "Necesita periodos de soledad. Sensible, dulce. Su gran corazón es rosa.",
    ],
  },
];

const VINETAS_CASAS: Vineta[] = [
  {
    src: "/viñetas/astrologia/casas/casa1.png",
    paragraphs: [
      "El instante del nacimiento.",
      "La forma en que nos perciben y nos percibimos. No es lo que somos. Es la herramienta con la que avanzamos hacia el Sol natal.",
      "También la energía de los inicios.",
    ],
  },
  {
    src: "/viñetas/astrologia/casas/casa2.png",
    paragraphs: [
      "El contacto con el mundo tangible.",
      "Nuestra valía y la que aportamos. Habla de la relación con los recursos y el dinero.",
      "Revela las capacidades que queremos desarrollar en esta Vida y que nos darán seguridad.",
    ],
  },
  {
    src: "/viñetas/astrologia/casas/casa3.png",
    paragraphs: [
      "La comunicación. El pensamiento estructurado.",
      "Cómo creamos nuestra realidad con palabras. Habla de los hermanos y los vecinos.",
      "Revela cómo fueron la infancia y los años de escuela.",
    ],
  },
  {
    src: "/viñetas/astrologia/casas/casa4.png",
    paragraphs: [
      "La familia de origen y sus raíces.",
      "El niño interior que sigue viviendo dentro. La seguridad interna. Cómo damos sentido a lo que nos pasa.",
      "También el hogar que construimos de adultos. Cómo nos nutrimos.",
    ],
  },
  {
    src: "/viñetas/astrologia/casas/casa5.png",
    paragraphs: [
      "El niño que fuimos. El romance, la creatividad, el placer.",
      "La casa de los amantes sin compromiso, de las ideas sin garantía. Los hijos y las creaciones.",
      "Revela la intensidad con la que necesitamos sentirnos únicos. El signo en el que está es la energía con la que se disfraza el ego.",
    ],
  },
  {
    src: "/viñetas/astrologia/casas/casa6.png",
    paragraphs: [
      "Qué hacemos a diario con nuestra energía y nuestro tiempo.",
      "Rutina, cuidado propio y de otros. Necesidad de orden y limpieza.",
      "Debes encontrar tu orden interno y aplicarlo, si no, somatizas.",
    ],
  },
  {
    src: "/viñetas/astrologia/casas/casa7.png",
    paragraphs: [
      "La pareja. Las relaciones de igualdad. Los socios.",
      "Muestra cómo vives estas relaciones, qué personas atraes y te atraen.",
      "Lo que proyectamos en el otro es nuestro. El otro como espejo.",
    ],
  },
  {
    src: "/viñetas/astrologia/casas/casa8.png",
    paragraphs: [
      "El territorio de la sombra.",
      "Lo que tiene poder sobre nosotros sin que lo sepamos. Muerte, intensidad, destrucción, transformación, dolor.",
      "La fusión con el otro a través del sexo. La muerte del ego.",
    ],
  },
  {
    src: "/viñetas/astrologia/casas/casa9.png",
    paragraphs: [
      "La búsqueda de sentido.",
      "La Vida como algo que vale la pena entender. Filosofías, misticismos, universidades, culturas.",
      "Los viajes largos que cambian la forma de ver el mundo.",
    ],
  },
  {
    src: "/viñetas/astrologia/casas/casa10.png",
    paragraphs: [
      "La vocación, la profesión, el estatus, el perfil público.",
      "La relación con la autoridad.",
      "La necesidad de dejar algo que trascienda la propia Vida.",
    ],
  },
  {
    src: "/viñetas/astrologia/casas/casa11.png",
    paragraphs: [
      "Los amigos, los grupos, las asociaciones.",
      "Los anhelos del alma. Salir de la individualidad y conectar con algo mayor.",
      "En baja frecuencia: necesidad de pertenencia. En alta: consciencia de la red que nos une a todos.",
    ],
  },
  {
    src: "/viñetas/astrologia/casas/casa12.png",
    paragraphs: [
      "Lo trascendental.",
      "El inconsciente colectivo y lo no digerido por nuestros ancestros. Heridas que se heredan hasta que se sanan.",
      "Aquí el ego teme su disolución, porque es la vuelta al origen.",
    ],
  },
];

type Seccion = "signos" | "casas" | "planetas";

const VINETAS_BY_SECCION: Record<Seccion, Vineta[]> = {
  signos: VINETAS_SIGNOS,
  casas: VINETAS_CASAS,
  planetas: VINETAS_PLANETAS,
};

interface SelectorOption {
  seccion: Seccion;
  title: string;
  cover: string;
  /** Fallback de glifos si la imagen de portada no carga. */
  glyphs: string[];
}

const SELECTOR_OPTIONS: SelectorOption[] = [
  {
    seccion: "signos",
    title: "Los Signos",
    cover: "/viñetas/astrologia/portadasignos.png",
    glyphs: ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"],
  },
  {
    seccion: "casas",
    title: "Las Casas",
    cover: "/viñetas/astrologia/portadacasas.png",
    glyphs: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"],
  },
  {
    seccion: "planetas",
    title: "Los Planetas",
    cover: "/viñetas/astrologia/portadaplanetas.png",
    glyphs: ["☉", "☽", "☿", "♀", "♂", "♃", "♄", "♅", "♆", "♇", "⚷"],
  },
];

// ────────────────────────────────────────────────────────────────────────────

const Stars = () => {
  const stars = [
    { top: "12%", left: "8%",  size: 2, delay: "0s" },
    { top: "20%", left: "92%", size: 2, delay: "1.4s" },
    { top: "38%", left: "4%",  size: 3, delay: "0.7s" },
    { top: "52%", left: "96%", size: 2, delay: "2.1s" },
    { top: "70%", left: "6%",  size: 2, delay: "1.1s" },
    { top: "82%", left: "94%", size: 3, delay: "0.4s" },
    { top: "26%", left: "50%", size: 2, delay: "1.8s" },
    { top: "88%", left: "48%", size: 2, delay: "2.6s" },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <Box
          key={i}
          position="absolute"
          top={s.top}
          left={s.left}
          w={`${s.size}px`}
          h={`${s.size}px`}
          borderRadius="full"
          bg="white"
          animation={`${twinkle} 3.5s ease-in-out ${s.delay} infinite`}
          boxShadow="0 0 6px rgba(255,255,255,0.85), 0 0 14px rgba(180,255,245,0.55)"
          pointerEvents="none"
          zIndex={1}
        />
      ))}
    </>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Tarjeta del selector — foto arriba, título debajo, look invitador a pinchar.
// ────────────────────────────────────────────────────────────────────────────

interface SelectorCardProps {
  option: SelectorOption;
  onClick: () => void;
  delay?: string;
}

function SelectorCard({ option, onClick, delay = "0s" }: SelectorCardProps) {
  const [coverFailed, setCoverFailed] = useState(false);
  return (
    <Box
      as="button"
      onClick={onClick}
      position="relative"
      flex="1"
      w="100%"
      // En móvil cada card queda más estrecho (≈300px) para que foto cuadrada
      // + título quepan juntos en el viewport sin partirse en dos pantallazos.
      // En desktop recuperamos los anchos generosos para que se vean amplios.
      minW={{ base: "auto", sm: "280px", md: "300px" }}
      maxW={{ base: "300px", md: "360px" }}
      borderRadius="2xl"
      overflow="hidden"
      border={`1px solid ${astrologiaTxt}55`}
      bg="rgba(8,13,30,0.55)"
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      animation={`${fadeInScale} 0.55s ease ${delay} both`}
      sx={{
        backdropFilter: "blur(8px)",
        transition: "all 0.25s ease",
        boxShadow: `0 0 18px ${astrologiaTxt}33, 0 0 42px ${astrologiaTxt}1f, inset 0 0 24px rgba(255,255,255,0.04)`,
        _hover: {
          transform: "translateY(-4px)",
          borderColor: astrologiaTxt,
          boxShadow: `0 0 28px ${astrologiaTxt}99, 0 0 70px ${astrologiaTxt}55, inset 0 0 24px rgba(255,255,255,0.08)`,
        },
        _active: { transform: "translateY(-1px)" },
      }}
    >
      {/* Portada del cómic — imagen subida en /viñetas/astrologia/. Si falla, fallback al mosaico. */}
      <Box
        position="relative"
        w="100%"
        aspectRatio={1}
        overflow="hidden"
        borderBottom={`1px solid ${astrologiaTxt}44`}
        bg="rgba(8,13,30,0.6)"
      >
        {!coverFailed ? (
          <Box
            as="img"
            src={encodeURI(option.cover)}
            alt={option.title}
            loading="eager"
            position="absolute"
            inset="0"
            w="100%"
            h="100%"
            style={{ objectFit: "cover", objectPosition: "center" }}
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <>
            <Box
              as="img"
              src="/img/astrologia/space.jpg"
              alt=""
              loading="eager"
              position="absolute"
              inset="0"
              w="100%"
              h="100%"
              style={{ objectFit: "cover", objectPosition: "center", opacity: 0.55 }}
            />
            <Box
              position="absolute"
              inset="0"
              style={{
                background: `radial-gradient(ellipse at center, transparent 0%, rgba(8,13,30,0.7) 75%, rgba(8,13,30,0.95) 100%)`,
              }}
            />
            <Flex position="absolute" inset="0" align="center" justify="center" p={{ base: 4, md: 5 }}>
              <Flex wrap="wrap" justify="center" align="center" gap={{ base: 2, md: 2.5 }} maxW="200px">
                {option.glyphs.map((g, i) => (
                  <Box
                    key={i}
                    color={astrologiaTxt}
                    fontFamily="'Times New Roman', Georgia, serif"
                    fontSize={{ base: "lg", md: "xl" }}
                    lineHeight="1"
                    opacity={0.85}
                    style={{ textShadow: `0 0 8px ${astrologiaTxt}99, 0 0 18px ${astrologiaTxt}55` }}
                  >
                    {g}
                  </Box>
                ))}
              </Flex>
            </Flex>
          </>
        )}
      </Box>

      {/* Box inferior: título + flecha "pinchar" */}
      <Flex
        direction="column"
        align="center"
        gap={1}
        position="relative"
        py={{ base: 4, md: 5 }}
        px={3}
      >
        <Text
          color="white"
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="700"
          letterSpacing="0.18em"
          textTransform="uppercase"
          textAlign="center"
          lineHeight="1.1"
          style={{
            textShadow: `0 0 12px ${astrologiaTxt}cc, 0 0 28px ${astrologiaTxt}77`,
          }}
        >
          {option.title}
        </Text>
        <Flex
          align="center"
          gap={1.5}
          mt={2}
          color={astrologiaTxt}
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="0.18em"
          textTransform="uppercase"
          style={{ textShadow: `0 0 10px ${astrologiaTxt}aa` }}
        >
          <Text as="span">Leer</Text>
          <Box
            as="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            w="14px"
            h="14px"
            fill="currentColor"
          >
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

// ────────────────────────────────────────────────────────────────────────────

interface ComicAstrologiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Se llama solo cuando el usuario completa el cómic con la flecha final (no al cerrar con X). */
  onComplete?: () => void;
}

export function ComicAstrologiaModal({ isOpen, onClose, onComplete }: ComicAstrologiaModalProps) {
  const [seccion, setSeccion] = useState<Seccion | null>(null);
  const [index, setIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState<Record<number, boolean>>({});
  const contentRef = useRef<HTMLDivElement>(null);
  // Posición inicial del dedo para detectar swipe horizontal (deslizar viñeta).
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const vinetas = seccion ? VINETAS_BY_SECCION[seccion] : [];
  const total = vinetas.length;
  const current = vinetas[index];
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Reinicia al selector cada vez que se abre el modal.
  useEffect(() => {
    if (isOpen) {
      setSeccion(null);
      setIndex(0);
      setImgFailed({});
    }
  }, [isOpen]);

  // Al cambiar de viñeta, scroll al inicio.
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [index, seccion]);

  const handleComplete = () => {
    if (onComplete) onComplete();
    // Al terminar el cómic (pulsar el tick / flecha derecha en la última viñeta)
    // volvemos al menú de ilustraciones en vez de cerrar el modal: el usuario
    // puede así pasar a otro sub-cómic sin tener que reabrir el modal.
    volverAlSelector();
  };

  const elegirSeccion = (s: Seccion) => {
    setSeccion(s);
    setIndex(0);
    setImgFailed({});
  };

  const volverAlSelector = () => {
    setSeccion(null);
    setIndex(0);
  };

  // ── Teclado (solo dentro de un cómic, no en el selector) ──
  useEffect(() => {
    if (!isOpen || !seccion) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setIndex((i) => {
          if (i >= total - 1) {
            handleComplete();
            return i;
          }
          return i + 1;
        });
      } else if (e.key === "ArrowLeft") {
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Escape") {
        volverAlSelector();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, seccion, total]);

  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setIndex((i) => Math.min(i + 1, total - 1));

  // ── Swipe táctil para pasar viñeta con el dedo ──
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    // Solo cuenta como swipe si el movimiento es claramente horizontal y suficiente.
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) {
        // Deslizar a la derecha → viñeta anterior.
        goPrev();
      } else {
        // Deslizar a la izquierda → siguiente (o completa si es la última).
        if (isLast) handleComplete();
        else goNext();
      }
    }
  };

  // ── Typewriter — en móvil se muestra el texto entero al instante ──
  // (el efecto máquina de escribir va lento y frustra la lectura en móvil).
  const isMobile = useBreakpointValue({ base: true, md: false });
  const totalChars = current ? current.paragraphs.reduce((acc, p) => acc + p.length, 0) : 0;
  const [typed, setTyped] = useState(0);
  const [lastKey, setLastKey] = useState(`${seccion}-${index}`);

  const currentKey = `${seccion}-${index}`;
  if (lastKey !== currentKey) {
    setLastKey(currentKey);
    setTyped(isMobile ? totalChars : 0);
  }

  useEffect(() => {
    if (!current) return;
    if (isMobile) {
      // En móvil, salto el typewriter: aparece el texto completo de golpe.
      if (typed < totalChars) setTyped(totalChars);
      return;
    }
    if (typed >= totalChars) return;
    let acc = 0;
    let atBoundary = false;
    for (let i = 0; i < current.paragraphs.length - 1; i++) {
      acc += current.paragraphs[i].length;
      if (typed === acc) { atBoundary = true; break; }
    }
    const delay = atBoundary ? PARAGRAPH_PAUSE_MS : TYPE_SPEED_MS;
    const t = setTimeout(() => setTyped((n) => n + 1), delay);
    return () => clearTimeout(t);
  }, [typed, totalChars, current, isMobile]);

  const skipTyping = () => setTyped(totalChars);

  const glowText = `0 0 14px rgba(255,255,255,0.55), 0 0 30px rgba(255,255,255,0.28), 0 0 60px ${astrologiaTxt}55`;
  const glowTextSoft = `0 0 10px rgba(255,255,255,0.4), 0 0 22px rgba(255,255,255,0.2)`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      isCentered
      // Solo el selector de ilustraciones usa scrollBehavior="inside"
      // (su layout original). En la vista cómic usamos el patrón de
      // ComicUniversoModal (overflow:hidden en ModalContent) para que el
      // scroll del ModalBody se active correctamente.
      scrollBehavior={seccion ? undefined : "inside"}
    >
      <ModalOverlay bg="rgba(0,0,0,0.95)" sx={{ backdropFilter: "blur(24px)" }} />
      <ModalContent
        bg="transparent"
        border="none"
        borderRadius="0"
        boxShadow="none"
        m={0}
        fontFamily="'EB Garamond', serif"
        // overflow:hidden SOLO en la vista cómic: encaja el ModalContent a
        // 100vh para que el overflowY:auto del ModalBody active el scroll.
        // En el selector lo dejamos sin clip (como estaba originalmente)
        // para que las cards en móvil hagan scroll de forma natural.
        overflow={seccion ? "hidden" : undefined}
        minH="100vh"
      >
        {/* Fondo espacial */}
        <Box
          position="fixed"
          inset="0"
          pointerEvents="none"
          zIndex={0}
          bg="#050505"
          overflow="hidden"
          sx={{ backdropFilter: "blur(20px)" }}
        >
          <Box
            as="img"
            src="/img/astrologia/space.jpg"
            alt=""
            loading="eager"
            position="absolute"
            inset="0"
            w="100%"
            h="100%"
            style={{ objectFit: "cover", objectPosition: "center", opacity: 0.6 }}
          />
          <Box position="absolute" inset="0" bg="rgba(0,0,0,0.65)" />
        </Box>

        {/* X cerrar — siempre visible */}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: 3, md: 5 }}
          zIndex={10}
          variant="ghost"
          color={astrologiaTxt}
          _hover={{ bg: `${astrologiaTxt}22` }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill={astrologiaTxt}>
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </Box>
          }
        />

        {/* Botón "Volver al menú" — solo visible dentro de un cómic */}
        {seccion && (
          <IconButton
            aria-label="Volver al menú"
            onClick={volverAlSelector}
            position="fixed"
            top={{ base: 3, md: 5 }}
            left={{ base: 3, md: 5 }}
            zIndex={10}
            variant="ghost"
            color={astrologiaTxt}
            _hover={{ bg: `${astrologiaTxt}22` }}
            icon={
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill={astrologiaTxt}>
                <path d="M480-160 160-480l320-320 56 57-223 223h487v80H313l224 224-57 56Z" />
              </Box>
            }
          />
        )}

        {/* ── VISTA SELECTOR ── */}
        {!seccion && (
          <ModalBody
            position="relative"
            zIndex={2}
            w="100%"
            // Padding superior generoso para dejar hueco al botón X y al título.
            // Padding inferior + lateral para que en móvil la última card respire.
            px={{ base: 5, md: 10 }}
            pt={{ base: 16, md: 14 }}
            pb={{ base: 10, md: 14 }}
            // Sin minH ni alineación vertical centrada: en móvil la columna de 3
            // tarjetas supera 100vh y el centrado provocaba que se cortaran los
            // bordes sin poder hacer scroll.
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent={{ base: "flex-start", md: "center" }}
            minH={{ base: "auto", md: "100vh" }}
            overflowY="auto"
            overflowX="hidden"
            sx={{
              // Permite scroll suave con momentum en iOS.
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Flex
              direction="column"
              align="center"
              gap={{ base: 8, md: 10 }}
              w="100%"
              maxW="1280px"
              mx="auto"
              // Aire entre la cruz (cerrar) y el título.
              mt={{ base: 8, md: 4 }}
              // Aire después del bloque de tarjetas antes del borde del modal.
              mb={{ base: 10, md: 8 }}
            >
              <Flex direction="column" align="center" gap={2}>
                <Text
                  color="white"
                  fontSize={{ base: "2xl", md: "4xl" }}
                  fontWeight="700"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  textAlign="center"
                  lineHeight="1.1"
                  style={{
                    textShadow: `0 0 14px ${astrologiaTxt}cc, 0 0 32px ${astrologiaTxt}77, 0 0 70px ${astrologiaTxt}44`,
                  }}
                >
                  Ilustraciones de Astrología
                </Text>
                <Text
                  color={`${astrologiaTxt}cc`}
                  fontSize={{ base: "sm", md: "md" }}
                  fontStyle="italic"
                  letterSpacing="0.08em"
                  textAlign="center"
                  maxW="520px"
                >
                  Elige un capítulo para empezar a leer.
                </Text>
              </Flex>

              <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: 5, md: 6 }}
                w="100%"
                justify="center"
                // En móvil cards centrados horizontalmente (más estrechos que el
                // ancho del modal); en desktop stretch para que tengan misma altura.
                align={{ base: "center", md: "stretch" }}
                wrap="wrap"
              >
                {SELECTOR_OPTIONS.map((opt, i) => (
                  <SelectorCard
                    key={opt.seccion}
                    option={opt}
                    onClick={() => elegirSeccion(opt.seccion)}
                    delay={`${i * 0.08}s`}
                  />
                ))}
              </Flex>
            </Flex>
          </ModalBody>
        )}

        {/* ── VISTA CÓMIC ── */}
        {seccion && current && (
          <>
            <IconButton
              aria-label="Anterior"
              onClick={goPrev}
              isDisabled={isFirst}
              position="fixed"
              left={{ base: 1, md: 6 }}
              top="50%"
              transform="translateY(-50%)"
              zIndex={10}
              variant="ghost"
              color={astrologiaTxt}
              opacity={isFirst ? 0.25 : 1}
              // En móvil: sin círculo (bg/border/shadow), icono más pequeño,
              // simplemente flotando sobre la imagen.
              bg={{ base: "transparent", md: `${astrologiaTxt}10` }}
              border={{ base: "none", md: `1px solid ${astrologiaTxt}33` }}
              borderRadius="full"
              w={{ base: "32px", md: "60px" }}
              h={{ base: "32px", md: "60px" }}
              minW={{ base: "32px", md: "60px" }}
              boxShadow={isFirst
                ? "none"
                : { base: "none", md: `0 0 14px ${astrologiaTxt}44, 0 0 32px ${astrologiaTxt}22` }}
              _hover={isFirst ? {} : {
                bg: `${astrologiaTxt}22`,
                borderColor: `${astrologiaTxt}88`,
                boxShadow: `0 0 22px ${astrologiaTxt}66, 0 0 50px ${astrologiaTxt}33`,
              }}
              icon={
                <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "22px", md: "30px" }} h={{ base: "22px", md: "30px" }} fill={astrologiaTxt}
                  style={{ filter: isFirst ? "none" : `drop-shadow(0 0 6px ${astrologiaTxt}cc) drop-shadow(0 0 14px ${astrologiaTxt}77)` }}>
                  <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
                </Box>
              }
            />

            <IconButton
              aria-label={isLast ? "Continuar a la carta 3D" : "Siguiente"}
              onClick={isLast ? handleComplete : goNext}
              position="fixed"
              right={{ base: 1, md: 6 }}
              top="50%"
              transform="translateY(-50%)"
              zIndex={10}
              variant="ghost"
              color={astrologiaTxt}
              bg={{ base: "transparent", md: `${astrologiaTxt}10` }}
              border={{ base: "none", md: `1px solid ${astrologiaTxt}33` }}
              borderRadius="full"
              w={{ base: "32px", md: "60px" }}
              h={{ base: "32px", md: "60px" }}
              minW={{ base: "32px", md: "60px" }}
              boxShadow={{ base: "none", md: `0 0 14px ${astrologiaTxt}44, 0 0 32px ${astrologiaTxt}22` }}
              _hover={{
                bg: `${astrologiaTxt}22`,
                borderColor: `${astrologiaTxt}88`,
                boxShadow: `0 0 22px ${astrologiaTxt}66, 0 0 50px ${astrologiaTxt}33`,
              }}
              icon={
                isLast ? (
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "22px", md: "30px" }} h={{ base: "22px", md: "30px" }} fill={astrologiaTxt}
                    style={{ filter: `drop-shadow(0 0 6px ${astrologiaTxt}cc) drop-shadow(0 0 14px ${astrologiaTxt}77)` }}>
                    <path d="M382-200 154-428l57-57 171 171 367-367 57 57-424 424Z" />
                  </Box>
                ) : (
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "22px", md: "30px" }} h={{ base: "22px", md: "30px" }} fill={astrologiaTxt}
                    style={{ filter: `drop-shadow(0 0 6px ${astrologiaTxt}cc) drop-shadow(0 0 14px ${astrologiaTxt}77)` }}>
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                  </Box>
                )
              }
            />

            <ModalBody
              ref={contentRef}
              position="relative"
              zIndex={2}
              // En móvil padding mínimo a los lados (las flechas son pequeñas y
              // flotantes sin círculo, así que no necesitan margen reservado).
              // En desktop conservamos el padding generoso original.
              px={{ base: 4, md: 24 }}
              // pt extra para que el contenido no choque con la X de cerrar
              // (top: 3/5). pb generoso para respirar al final del scroll.
              pt={{ base: 16, md: 20 }}
              pb={{ base: 14, md: 18 }}
              overflowY="auto"
              minH="100vh"
              display="flex"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              sx={{
                // safe center: centra verticalmente cuando el contenido cabe,
                // pero al desbordar alinea arriba para no recortar el inicio
                // y permite hacer scroll a todo el contenido.
                alignItems: "safe center",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { display: "none" },
                touchAction: "pan-y",
              }}
            >
              <Flex direction="column" align="center" justify="center" gap={{ base: 5, md: 8 }} maxW="680px" mx="auto" w="100%">
                <Box
                  key={`img-${seccion}-${index}`}
                  // Móvil: imagen al 100% del body (mismo ancho que el box de texto).
                  // Desktop: como antes, más estrecha y centrada para no dominar.
                  w={{ base: "100%", sm: "75%", md: "60%" }}
                  maxW={{ base: "100%", md: "440px" }}
                  aspectRatio={1}
                  animation={`${fadeIn} 0.5s ease both`}
                  position="relative"
                  sx={{
                    filter: `
                      drop-shadow(0 0 30px rgba(255,255,255,0.35))
                      drop-shadow(0 0 60px rgba(180,210,255,0.28))
                      drop-shadow(0 0 110px ${astrologiaTxt}55)
                    `,
                  }}
                >
                  {!imgFailed[index] ? (
                    <Image
                      src={encodeURI(current.src)}
                      alt={`Viñeta ${index + 1}`}
                      w="100%"
                      h="100%"
                      objectFit="contain"
                      onError={() => setImgFailed((s) => ({ ...s, [index]: true }))}
                    />
                  ) : (
                    <Flex
                      w="100%"
                      h="100%"
                      align="center"
                      justify="center"
                      direction="column"
                      gap={2}
                      px={4}
                      textAlign="center"
                      bg="rgba(8,13,30,0.55)"
                      border={`1px dashed ${astrologiaTxt}44`}
                      borderRadius="2xl"
                    >
                      <Text fontSize="4xl">✨</Text>
                      <Text color={`${astrologiaTxt}cc`} fontSize="sm" fontStyle="italic">
                        Viñeta {index + 1} próximamente
                      </Text>
                    </Flex>
                  )}
                </Box>

                <Box
                  key={`txt-${seccion}-${index}`}
                  w="100%"
                  position="relative"
                  borderRadius="xl"
                  overflow="hidden"
                  border={`1px solid ${astrologiaTxt}44`}
                  px={{ base: 5, md: 8 }}
                  pt={{ base: 5, md: 7 }}
                  pb={{ base: 8, md: 9 }}
                  animation={`${fadeIn} 0.55s ease 0.08s both`}
                  boxShadow={`0 0 18px ${astrologiaTxt}22, 0 0 40px ${astrologiaTxt}14, inset 0 0 20px rgba(0,0,0,0.35)`}
                >
                  <Box
                    position="absolute"
                    inset="0"
                    pointerEvents="none"
                    zIndex={0}
                    style={{
                      background:
                        "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)",
                    }}
                  >
                    <Box
                      as="img"
                      src="/img/astrologia/space.jpg"
                      alt=""
                      loading="eager"
                      position="absolute"
                      inset="0"
                      w="100%"
                      h="100%"
                      style={{ objectFit: "cover", objectPosition: "center", opacity: 0.75 }}
                    />
                    <Box position="absolute" inset="0" bg="rgba(8,13,30,0.55)" />
                  </Box>

                  <Stars />

                  <Box
                    position="absolute"
                    top="-1px"
                    left="15%"
                    right="15%"
                    h="1px"
                    bgGradient={`linear(to-r, transparent, ${astrologiaTxt}aa, transparent)`}
                    zIndex={2}
                  />

                  <Flex
                    direction="column"
                    gap={4}
                    position="relative"
                    zIndex={2}
                    onClick={skipTyping}
                    cursor={typed < totalChars ? "pointer" : "default"}
                  >
                    {current.paragraphs.map((p, i) => {
                      let consumed = 0;
                      for (let j = 0; j < i; j++) consumed += current.paragraphs[j].length;
                      const remaining = Math.max(0, typed - consumed);
                      if (remaining === 0) return null;
                      const shown = p.slice(0, remaining);
                      const isCurrent = remaining < p.length;
                      return (
                        <Text
                          key={i}
                          color={i === 0 ? astrologiaTxt : `${astrologiaTxt}dd`}
                          fontSize={{ base: "md", md: "lg" }}
                          lineHeight="1.85"
                          letterSpacing="0.02em"
                          textAlign="center"
                          fontWeight={i === 0 ? "600" : "400"}
                          fontStyle={i === 0 ? "italic" : "normal"}
                          style={{ textShadow: i === 0 ? glowText : glowTextSoft }}
                        >
                          {shown}
                          {isCurrent && (
                            <Box
                              as="span"
                              display="inline-block"
                              ml="3px"
                              w="2px"
                              h="1em"
                              verticalAlign="text-bottom"
                              bg={astrologiaTxt}
                              animation={`${blink} 0.9s steps(1) infinite`}
                              sx={{ boxShadow: `0 0 8px ${astrologiaTxt}` }}
                            />
                          )}
                        </Text>
                      );
                    })}
                  </Flex>

                  <Box
                    position="absolute"
                    bottom="-1px"
                    left="15%"
                    right="15%"
                    h="1px"
                    bgGradient={`linear(to-r, transparent, ${astrologiaTxt}aa, transparent)`}
                    zIndex={2}
                  />

                  <Text
                    position="absolute"
                    bottom={{ base: 2, md: 3 }}
                    right={{ base: 3, md: 4 }}
                    color={`${astrologiaTxt}99`}
                    fontSize={{ base: "xs", md: "sm" }}
                    fontStyle="italic"
                    letterSpacing="0.18em"
                    style={{ textShadow: glowTextSoft }}
                    zIndex={2}
                  >
                    {index + 1} / {total}
                  </Text>
                </Box>
              </Flex>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
