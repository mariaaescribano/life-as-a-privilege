import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { astrologiaTxt } from "../../GlobalVariables";
import { ComicViewer } from "./ComicViewer";
import type { Vineta } from "./ComicViewer";

const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
`;

// ────────────────────────────────────────────────────────────────────────────
// DATOS DE LOS 3 SUB-CÓMICS — solo cambian las viñetas (foto + texto).
// El frontend del cómic es el mismo (ComicViewer) que usa el del inicio.
// ────────────────────────────────────────────────────────────────────────────

export const VINETAS_PLANETAS: Vineta[] = [
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
      "Nuestra más sensible vulnerabilidad, nuestra seguridad, nuestro punto de inicio y donde descansamos.",
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
      "Dónde buscamos la fusión con Dios, cómo engañamos a otros y a nosotros. Puede no importarnos la realidad racional.",
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
      "Quirón es la herida más profunda del alma; la herida de la separación.",
      "Se abre antes de los 3 años. No se cura del todo. Se aprende a vivir y a aceptar el dolor, y al hacerlo, nos da nuestro mayor don.",
    ],
  },
  {
    src: "/viñetas/astrologia/planetas/lilith.png",
    paragraphs: [
      "Lilith es nuestro deseo más profundo, el que juzgamos inconfesable — porque nos enseñaron que no teníamos derecho a él.",
      "Tememos que se sepa, no lograrlo, o lograrlo y perderlo.",
      "Hay que aceptar nuestro deseo: cuanto más lo neguemos, más crecerá la frustración; reconocerlo aunque no lleguemos a cumplirlo, nos acerca a nuestra esencia.",
    ],
  },
];

export const VINETAS_SIGNOS: Vineta[] = [
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
      "Necesita sentir para saber quién es. Necesita pertenecer.",
      "Su identidad viene de sus raíces. Hace familia a aquellos que ama.",
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
      "Es el crítico y juzgador más duro consigo mismo y con los demás.",
      "Debe poner sus dones al servicio de algo mayor.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/libra.png",
    paragraphs: [
      "La diplomacia. Necesita al otro para descubrirse a sí mismo.",
      "Quiere encajar y ser aceptado en la sociedad. Indeciso. Quiere que otros decidan por él.",
      "No le gustan las peleas. Recopila datos de todos para evitar desencuentros.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/escorpio.png",
    paragraphs: [
      "Intensidad, profundidad, transformación. Todo o nada.",
      "Paseos por los infiernos para descubrirse a sí mismo y a su sombra.",
      "Desea fundirse con el otro. La separación después de la fusión le duele mucho, pero debe de aprender a que sin uno no existe el otro.",
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
      "Por dentro es frágil. No lo va a contar ni quiere que se note. Solo descansa cuando todo lo que supuestamente era su obligación está cumplido.",
    ],
  },
  {
    src: "/viñetas/astrologia/signos/acuario.png",
    paragraphs: [
      "Ama a la humanidad, odia a los humanos.",
      "Desea pertenecer, pero no quiere perder su individualidad. Original. Innovador.",
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

export const VINETAS_CASAS: Vineta[] = [
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
      "Nuestra valía y la valía que aportamos al mundo. Habla de la relación con los recursos y el dinero.",
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
      "La Casa de los amantes sin compromiso, de las ideas sin garantía. Los hijos y las creaciones.",
      "Revela la intensidad con la que necesitamos sentirnos únicos.",
      "El Signo en el que está es la energía con la que se disfraza el ego.",
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
      "En baja frecuencia: necesidad de pertenencia.",
      "En alta: consciencia de la red que nos une a todos."
    ],
  },
  {
    src: "/viñetas/astrologia/casas/casa12.png",
    paragraphs: [
      "Lo trascendental.",
      "El inconsciente colectivo y lo no digerido por nuestros ancestros. Heridas que se heredan hasta que se sanan.",
      "Aquí el ego teme su disolución, porque es la vuelta al origen, al Uno y al todo.",
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
        boxShadow: "0 4px 18px rgba(0,0,0,0.35)",
        _hover: {
          transform: "translateY(-4px)",
          borderColor: astrologiaTxt,
          boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
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
          color={astrologiaTxt}
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

  // Reinicia al selector cada vez que se abre el modal.
  useEffect(() => {
    if (isOpen) setSeccion(null);
  }, [isOpen]);

  const elegirSeccion = (s: Seccion) => setSeccion(s);
  const volverAlSelector = () => setSeccion(null);

  const handleComplete = () => {
    if (onComplete) onComplete();
    // Al terminar el cómic (tick final) volvemos al selector para que el
    // usuario pueda enlazar con otro sub-cómic sin reabrir el modal.
    volverAlSelector();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      isCentered
      // - Vista cómic: "outside" → la página entera del modal scrollea usando
      //   la scrollbar del navegador (lo que pidió la usuaria).
      // - Vista selector: "inside" → mantiene el layout original con su
      //   propio scroll interno.
      scrollBehavior={seccion ? "outside" : "inside"}
    >
      <ModalOverlay bg="rgba(0,0,0,0.95)" sx={{ backdropFilter: "blur(24px)" }} />
      <ModalContent
        bg="transparent"
        border="none"
        borderRadius="0"
        boxShadow="none"
        m={0}
        fontFamily="'EB Garamond', serif"
        minH="100vh"
      >
        {/* ── VISTA SELECTOR ── */}
        {!seccion && (
          <>
            {/* X cerrar — solo en el selector. En la vista cómic la pinta ComicViewer. */}
            <Box
              as="button"
              aria-label="Cerrar"
              onClick={onClose}
              position="fixed"
              top={{ base: 3, md: 5 }}
              right={{ base: 3, md: 5 }}
              zIndex={10}
              p={2}
              borderRadius="md"
              color={astrologiaTxt}
              _hover={{ bg: `${astrologiaTxt}22` }}
            >
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill={astrologiaTxt}>
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </Box>
            </Box>

            {/* Fondo espacial del selector */}
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

            <ModalBody
              position="relative"
              zIndex={2}
              w="100%"
              px={{ base: 5, md: 10 }}
              pt={{ base: 16, md: 14 }}
              pb={{ base: 10, md: 14 }}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent={{ base: "flex-start", md: "center" }}
              minH={{ base: "auto", md: "100vh" }}
              overflowY="auto"
              overflowX="hidden"
              sx={{
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
                mt={{ base: 8, md: 4 }}
                mb={{ base: 10, md: 8 }}
              >
                <Flex direction="column" align="center" gap={2}>
                  <Text
                    color={astrologiaTxt}
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
          </>
        )}

        {/* ── VISTA CÓMIC ── usa el mismo ComicViewer que el cómic del Inicio. */}
        {seccion && (
          <ComicViewer
            key={seccion}
            vinetas={VINETAS_BY_SECCION[seccion]}
            textShadow={`0 0 4px ${astrologiaTxt}aa, 0 0 9px ${astrologiaTxt}66`}
            onClose={onClose}
            onComplete={handleComplete}
            onBack={volverAlSelector}
          />
        )}
      </ModalContent>
    </Modal>
  );
}
