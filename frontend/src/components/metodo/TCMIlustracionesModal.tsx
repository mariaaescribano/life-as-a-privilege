import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { tcmBg, tcmTxt } from "../../GlobalVariables";
import { ComicViewer } from "./ComicViewer";
import type { Vineta } from "./ComicViewer";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { comicLoaderPorColor } from "./comicLoaders";
import SpinnerTurquesa from "../global/Spinner";

// ────────────────────────────────────────────────────────────────────────────
// CONTENIDO DE LOS CAPÍTULOS DE MEDICINA CHINA
// (Pendiente de recibir fotos y textos. Cada capítulo arranca con una viñeta
//  placeholder para que el ComicViewer no rompa.)
// ────────────────────────────────────────────────────────────────────────────

// Se exporta para reutilizarlo como intro de Medicina China (cómic del Origen
// según el taoísmo) sin duplicar el contenido.
export const VINETAS_ORIGEN: Vineta[] = [
  {
    src: "/viñetas/tcm/origen/origentcm1.png",
    paragraphs: [
      "El Dao (Tao) es el principio supremo e indescriptible del que surge toda la realidad.",
      "Del Dao emana el Qi, la energía primordial que, en un primer momento, existe como un estado indiferenciado conocido como Hundun, el caos primordial donde aún no hay distinción individual.",
      "A medida que esta energía comienza a ordenarse, se manifiesta el Taiji (el Gran Último), del que nacen las dos fuerzas complementarias.",
    ],
  },
  {
    src: "/viñetas/tcm/origen/origentcm2.png",
    paragraphs: [
      "El Yang es la energía masculina, el Qi del Cielo.",
      "El Yin es la energía femenina, el Qi de la Tierra.",
      "Ambos son interdependientes y son manifestaciones de lo mismo.",
      "De su interacción surgen los Cinco Elementos (Madera, Fuego, Tierra, Metal y Agua), cuyos ciclos de transformación dan origen a 'los diez mil seres', es decir, todo cuanto existe en el universo.",
    ],
  },
  {
    src: "/viñetas/tcm/origen/origentcm3.png",
    paragraphs: [
      "Montañas, ríos, plantas y animales son manifestaciones del Qi en constante transformación.",
      "«El ser humano nace de la esencia del cielo y recibe su forma de la tierra.» — Guan Zi",
    ],
  },
  {
    src: "/viñetas/tcm/origen/origentcm4.png",
    paragraphs: [
      "La esencia (Jing) es la manifestación individualizada de la energía primordial, del Qi.",
      "Es la porción del Dao, la esencia infinita, que se condensa para dar origen al cuerpo, sostener la Vida y expresar la singularidad de cada ser.",
    ],
  },
  {
    src: "/viñetas/tcm/origen/origentcm5.png",
    paragraphs: [
      "Del Jing emerge el Shen, el espíritu que anima la conciencia, las emociones y el pensamiento.",
    ],
  },
  {
    src: "/viñetas/tcm/origen/origentcm6.png",
    paragraphs: [
      "El taoísmo enseña que el sentido de la Vida es recordar que somos una manifestación del Dao.",
      "Al cultivar el Jing, equilibrar el Qi y aclarar el Shen, dejamos de luchar contra la corriente de la existencia y aprendemos a vivir con naturalidad, armonía y plenitud.",
    ],
  },
];

export const VINETAS_ELEMENTOS: Vineta[] = [
  {
    src: "/viñetas/tcm/elementos/5tcm.png",
    paragraphs: [
      "Los Cinco Elementos son las cinco fuerzas sobre las que se construye la naturaleza y, por extensión, el ser humano.",
      "Nuestros órganos, emociones y procesos vitales siguen los movimientos de estos cinco elementos.",
    ],
  },
  {
    src: "/viñetas/tcm/elementos/tierratcm.png",
    paragraphs: [
      "La Tierra es el suelo sobre el que todo se construye.",
      "Representa nuestra capacidad para nutrirnos y transformarnos, tanto a nivel físico como emocional",
      "Cuando la Tierra está fuerte, somos capaces de aprovechar aquello que recibimos de la Vida y convertirlo en raíces, aprendizaje y nutrición.",
    ],
  },
  {
    src: "/viñetas/tcm/elementos/metaltcm.png",
    paragraphs: [
      "Del proceso de transformación de la Tierra surge el Metal.",
      "Representa la claridad, el orden y la capacidad de discernir el dolor que es nuestro y el que no.",
      "Nos ayuda a aceptar quiénes somos y a soltar aquello que ya ha cumplido su función para dejar espacio a lo nuevo.",
    ],
  },
  {
    src: "/viñetas/tcm/elementos/aguatcm.png",
    paragraphs: [
      "Cuando aprendemos a soltar, aparece el Agua. Es la profundidad, la introspección y la conexión con nuestros recursos internos.",
      "Nos invita a mirar hacia dentro, encontrar paz y desarrollar la confianza necesaria para fluir con los cambios de la Vida.",
    ],
  },
  {
    src: "/viñetas/tcm/elementos/madera.png",
    paragraphs: [
      "La Madera representa el crecimiento, la expansión y la capacidad de avanzar. Es la fuerza que transforma nuestro potencial en acción.",
      "Cuando está equilibrada nos ayuda a construir, crear y desarrollar aquello que hemos sembrado. Cuando se bloquea, pueden aparecer la frustración, la rigidez o el enfado.",
    ],
  },
  {
    src: "/viñetas/tcm/elementos/fuegotcm.png",
    paragraphs: [
      "El Fuego es la expresión de la Vida en movimiento. Representa la alegría, la vitalidad, la pasión y la capacidad de conectar con los demás.",
      "Nos aporta entusiasmo, inspiración y el impulso necesario para compartir aquello que hemos creado.",
    ],
  },
  {
    src: "/viñetas/tcm/elementos/tcmpersona.png",
    paragraphs: [
      "Según la Medicina Tradicional China, la salud surge cuando estos cinco movimientos se encuentran en equilibrio, permitiendo que la energía fluya de forma armoniosa a través de nuestro cuerpo, nuestras emociones y nuestra forma de vivir.",
    ],
  },
];

export const VINETAS_YIN_YANG: Vineta[] = [
  {
    src: "/viñetas/tcm/yinyang/yinyang.png",
    paragraphs: [
      "Yin y Yang son dos aspectos opuestos y complementarios de una misma realidad.",
      "Yang representa la actividad, la luz y el movimiento.",
      "Yin representa el reposo, la oscuridad y la materia.",
    ],
  },
  {
    src: "/viñetas/tcm/yinyang/yinyang2.png",
    paragraphs: [
      "Nada es completamente Yin ni completamente Yang. Cada uno contiene la semilla del otro.",
      "El Yang transforma la materia en energía. El Yin transforma la energía en materia.",
      "La salud y la Vida dependen del equilibrio dinámico entre Yin y Yang.",
    ],
  },
];

export const VINETAS_ALMA: Vineta[] = [
  {
    src: "/viñetas/tcm/alma/alma1.png",
    paragraphs: [
      "Para la Medicina Tradicional China, el ser humano es una unidad. Cuerpo, Qi y espíritu forman un todo inseparable.",
      "El cuerpo (Xing) es la forma. El Qi es la energía vital. El Shen es el principio que da Vida, conciencia y presencia.",
    ],
  },
  {
    src: "/viñetas/tcm/alma/alma2.png",
    paragraphs: [
      "Shen (corazón)",
      "Es la conciencia, la claridad mental y la capacidad de relacionarnos con el mundo.",
    ],
  },
  {
    src: "/viñetas/tcm/alma/alma3.png",
    paragraphs: [
      "Hun (hígado)",
      "Es el alma etérea.",
      "Inspira los sueños, la creatividad, la imaginación y la capacidad de proyectarnos hacia el futuro.",
    ],
  },
  {
    src: "/viñetas/tcm/alma/alma4.png",
    paragraphs: [
      "Po (pulmones)",
      "Es el alma corpórea.",
      "Gobierna los instintos, las sensaciones físicas y la respuesta inmediata a la Vida.",
    ],
  },
  {
    src: "/viñetas/tcm/alma/alma5.png",
    paragraphs: [
      "Yi (bazo)",
      "Es la intención.",
      "Permite pensar, aprender, recordar y concentrarse.",
    ],
  },
  {
    src: "/viñetas/tcm/alma/alma6.png",
    paragraphs: [
      "Zhi (riñones)",
      "Es la voluntad.",
      "Da perseverancia, determinación y la fuerza para seguir adelante.",
    ],
  },
  {
    src: "/viñetas/tcm/alma/alma7.png",
    paragraphs: [
      "Cada aspecto del espíritu reside en un órgano.",
      "Cuando los órganos están en equilibrio, también lo está la mente.",
      "La salud no es solo la ausencia de enfermedad. Es la armonía entre cuerpo, energía y espíritu.",
    ],
  },
];

type Capitulo = "origen" | "yin_yang" | "los_elementos" | "alma_humana";

const VINETAS_BY_CAPITULO: Record<Capitulo, Vineta[]> = {
  origen:        VINETAS_ORIGEN,
  yin_yang:      VINETAS_YIN_YANG,
  los_elementos: VINETAS_ELEMENTOS,
  alma_humana:   VINETAS_ALMA,
};

const SELECTOR_OPTIONS: { key: Capitulo; title: string; cover?: string; coverPosition?: string; coverScale?: number }[] = [
  { key: "origen",        title: "El Origen", cover: "/viñetas/tcm/origen/origentcm3.png" },
  { key: "yin_yang",      title: "El Yin Yang", cover: "/viñetas/tcm/yinyang/yinyang.png" },
  // El pergamino de elementos trae un marco crema decorado alrededor; lo
  // ampliamos un poco para recortarlo y que llene la caja como las demás.
  { key: "los_elementos", title: "Los Cinco Elementos", cover: "/viñetas/tcm/elementos/portadaelementos.png", coverScale: 1.12 },
  { key: "alma_humana",   title: "El Alma Humana", cover: "/viñetas/tcm/alma/alma7.png" },
];

interface TCMIlustracionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function TCMIlustracionesModal({
  isOpen,
  onClose,
  onComplete,
}: TCMIlustracionesModalProps) {
  const [capitulo, setCapitulo] = useState<Capitulo | null>(null);

  useEffect(() => {
    if (isOpen) setCapitulo(null);
  }, [isOpen]);

  const volverAlSelector = () => setCapitulo(null);
  const elegirCapitulo = (key: Capitulo) => setCapitulo(key);

  const vinetas = capitulo ? VINETAS_BY_CAPITULO[capitulo] : [];

  // No mostramos nada hasta que la foto de fondo (tcm.png) y las portadas del
  // selector estén completamente cargadas: mientras tanto se ve solo el loader
  // de TCM, para que luego aparezca todo a la vez (fondo + tarjetas).
  const fondosListos = usePrecargarImagenes(
    isOpen ? ["/img/fondos/tcm.png", ...SELECTOR_OPTIONS.map((o) => o.cover)] : [],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior={capitulo ? "outside" : "inside"}>
      {/* La foto de fondo va en el OVERLAY (cubre el viewport SIEMPRE). Ponerla
          dentro del ModalContent fallaba: Chakra le aplica un `transform` de
          animación y un `position:fixed` dentro de un ancestro transformado deja
          de referirse al viewport → quedaban huecos. */}
      <ModalOverlay
        bg={tcmBg}
        sx={fondosListos ? {
          backgroundImage: `linear-gradient(${tcmBg}33, ${tcmBg}33), url('/img/fondos/tcm.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        } : undefined}
      />
      <ModalContent
        bg="transparent"
        border="none"
        borderRadius="0"
        boxShadow="none"
        m={0}
        fontFamily="'EB Garamond', serif"
        minH="100vh"
        position="relative"
      >
        {/* Mientras la foto de fondo y las portadas no están cargadas, no se
            muestra nada salvo el loader de TCM (aparece todo a la vez). */}
        {!fondosListos && (
          <Flex position="relative" zIndex={2} minH="100vh" align="center" justify="center">
            {comicLoaderPorColor(tcmTxt) ?? <SpinnerTurquesa fullScreen={false} color={tcmTxt} />}
          </Flex>
        )}

        {fondosListos && (<>

        {/* X cerrar */}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: 3, md: 5 }}
          zIndex={10}
          variant="ghost"
          color={tcmTxt}
          _hover={{ bg: `${tcmTxt}22` }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill={tcmTxt}>
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </Box>
          }
        />

        {/* ── VISTA SELECTOR ── */}
        {!capitulo && (
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
                  color={tcmTxt}
                  fontSize={{ base: "2xl", md: "4xl" }}
                  fontWeight="700"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  textAlign="center"
                  lineHeight="1.1"
                  style={{
                    textShadow: `0 0 14px ${tcmTxt}cc, 0 0 32px ${tcmTxt}77, 0 0 70px ${tcmTxt}44`,
                  }}
                >
                  Ilustraciones de Medicina China
                </Text>
                <Text
                  color={`${tcmTxt}cc`}
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
                {SELECTOR_OPTIONS.map((opt) => (
                  <Box
                    key={opt.key}
                    as="button"
                    onClick={() => elegirCapitulo(opt.key)}
                    position="relative"
                    display="flex"
                    flexDirection="column"
                    flex="1"
                    w="100%"
                    p={0}
                    minW={{ base: "auto", sm: "280px", md: "300px" }}
                    maxW={{ base: "300px", md: "360px" }}
                    borderRadius="2xl"
                    overflow="hidden"
                    border={`1px solid ${tcmTxt}55`}
                    bg="#3a0606"
                    cursor="pointer"
                    fontFamily="'EB Garamond', serif"
                    sx={{
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      transition: "all 0.25s ease",
                      boxShadow: `0 0 18px ${tcmTxt}33, 0 0 42px ${tcmTxt}1f, inset 0 0 24px rgba(255,255,255,0.04)`,
                      _hover: {
                        transform: "translateY(-4px)",
                        borderColor: tcmTxt,
                        boxShadow: `0 0 28px ${tcmTxt}99, 0 0 70px ${tcmTxt}55, inset 0 0 24px rgba(255,255,255,0.08)`,
                      },
                      _active: { transform: "translateY(-1px)" },
                    }}
                  >
                    {opt.cover && (
                      <Box
                        position="relative"
                        w="100%"
                        aspectRatio={1}
                        overflow="hidden"
                        borderBottom={`1px solid ${tcmTxt}44`}
                        bg="#3a0606"
                      >
                        <Box
                          as="img"
                          src={encodeURI(opt.cover)}
                          alt={opt.title}
                          loading="eager"
                          position="absolute"
                          inset="0"
                          w="100%"
                          h="100%"
                          style={{
                            objectFit: "cover",
                            objectPosition: opt.coverPosition ?? "center",
                            transform: opt.coverScale ? `scale(${opt.coverScale})` : undefined,
                          }}
                        />
                      </Box>
                    )}
                    <Flex
                      direction="column"
                      align="center"
                      gap={1}
                      py={opt.cover ? { base: 4, md: 5 } : { base: 10, md: 14 }}
                      px={3}
                    >
                      <Text
                        color={tcmTxt}
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight="700"
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        textAlign="center"
                        lineHeight="1.1"
                        style={{
                          textShadow: `0 0 12px ${tcmTxt}cc, 0 0 28px ${tcmTxt}77`,
                        }}
                      >
                        {opt.title}
                      </Text>
                      <Flex
                        align="center"
                        gap={1.5}
                        mt={2}
                        color={tcmTxt}
                        fontSize={{ base: "xs", md: "sm" }}
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        style={{ textShadow: `0 0 10px ${tcmTxt}aa` }}
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
                ))}
              </Flex>
            </Flex>
          </ModalBody>
        )}

        {/* ── VISTA CÓMIC ── */}
        {capitulo && (
          <ComicViewer
            key={capitulo}
            vinetas={vinetas}
            themeColor={tcmTxt}
            disciplinaBgImage="/img/fondos/tcm.png"
            disciplinaBgColor={tcmBg}
            onClose={onClose}
            onBack={volverAlSelector}
            onComplete={() => {
              if (onComplete) onComplete();
              volverAlSelector();
            }}
          />
        )}
        </>)}
      </ModalContent>
    </Modal>
  );
}
