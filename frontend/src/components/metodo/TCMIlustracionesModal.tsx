import React, { useEffect, useState } from "react";
import { useT } from "../../i18n";
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
// Los demás cómics de Medicina China viven cada uno en su paso del recorrido;
// aquí se reúnen TODOS para poder releerlos sin volver a la página.
import { VINETAS_ENFERMEDADES } from "./comicEnfermedades";
import { LEYES_TAO_VINETAS } from "./tcmTaoismoContenido";
import {
  BROCADOS_VINETAS, CINCO_ANIMALES_VINETAS, DAO_YIN_VINETAS, HISTORIA_QIGONG_VINETAS,
} from "./tcmQigongContenido";
import { COMIC_ELEMENTO, COMIC_INTRO_ELEMENTOS } from "./tcmElementosContenido";
import { FOTO_COCINA, cocinaDe } from "./tcmCocinaContenido";
import { ELEMENTOS, ORDEN_ELEMENTOS } from "./tcmRecorrido";

// ────────────────────────────────────────────────────────────────────────────
// CONTENIDO DE LOS CAPÍTULOS DE MEDICINA CHINA
// (Pendiente de recibir fotos y textos. Cada capítulo arranca con una viñeta
//  placeholder para que el ComicViewer no rompa.)
// ────────────────────────────────────────────────────────────────────────────

// Se exporta para reutilizarlo como intro de Medicina China (cómic del Origen
// según el taoísmo) sin duplicar el contenido.
export const VINETAS_ORIGEN: Vineta[] = [
  {
    src: "/viñetas/tcm/origen/origentcm1.webp",
    paragraphs: [
      "El Dao (Tao) es el principio supremo e indescriptible del que surge toda la realidad.",
      "Del Dao emana el Qi, la energía primordial que, en un primer momento, existe como un estado indiferenciado conocido como Hundun, el caos primordial donde aún no hay distinción individual.",
      "A medida que esta energía comienza a ordenarse, se manifiesta el Taiji (el Gran Último), del que nacen las dos fuerzas complementarias.",
    ],
  },
  {
    src: "/viñetas/tcm/origen/origentcm2.webp",
    paragraphs: [
      "El Yang es la energía masculina, el Qi del Cielo.",
      "El Yin es la energía femenina, el Qi de la Tierra.",
      "Ambos son interdependientes y son manifestaciones de lo mismo.",
      "De su interacción surgen los Cinco Elementos (Madera, Fuego, Tierra, Metal y Agua), cuyos ciclos de transformación dan origen a 'los diez mil seres', es decir, todo cuanto existe en el universo.",
    ],
  },
  {
    src: "/viñetas/tcm/origen/origentcm3.webp",
    paragraphs: [
      "Montañas, ríos, plantas y animales son manifestaciones del Qi en constante transformación.",
      "«El ser humano nace de la esencia del cielo y recibe su forma de la tierra.» — Guan Zi",
    ],
  },
  {
    src: "/viñetas/tcm/origen/origentcm4.webp",
    paragraphs: [
      "La esencia (Jing) es la manifestación individualizada de la energía primordial, del Qi.",
      "Es la porción del Dao, la esencia infinita, que se condensa para dar origen al cuerpo, sostener la Vida y expresar la singularidad de cada ser.",
    ],
  },
  {
    src: "/viñetas/tcm/origen/origentcm5.webp",
    paragraphs: [
      "Del Jing emerge el Shen, el espíritu que anima la conciencia, las emociones y el pensamiento.",
    ],
  },
  {
    src: "/viñetas/tcm/origen/origentcm6.webp",
    paragraphs: [
      "El taoísmo enseña que el sentido de la Vida es recordar que somos una manifestación del Dao.",
      "Al cultivar el Jing, equilibrar el Qi y aclarar el Shen, dejamos de luchar contra la corriente de la existencia y aprendemos a vivir con naturalidad, armonía y plenitud.",
    ],
  },
];

export const VINETAS_ELEMENTOS: Vineta[] = [
  {
    src: "/viñetas/tcm/elementos/5tcm.webp",
    paragraphs: [
      "Los Cinco Elementos son las cinco fuerzas sobre las que se construye la naturaleza y, por extensión, el ser humano.",
      "Nuestros órganos, emociones y procesos vitales siguen los movimientos de estos cinco elementos.",
    ],
  },
  {
    src: "/viñetas/tcm/elementos/tierratcm.webp",
    paragraphs: [
      "La Tierra es el suelo sobre el que todo se construye.",
      "Representa nuestra capacidad para nutrirnos y transformarnos, tanto a nivel físico como emocional",
      "Cuando la Tierra está fuerte, somos capaces de aprovechar aquello que recibimos de la Vida y convertirlo en raíces, aprendizaje y nutrición.",
    ],
  },
  {
    src: "/viñetas/tcm/elementos/metaltcm.webp",
    paragraphs: [
      "Del proceso de transformación de la Tierra surge el Metal.",
      "Representa la claridad, el orden y la capacidad de discernir el dolor que es nuestro y el que no.",
      "Nos ayuda a aceptar quiénes somos y a soltar aquello que ya ha cumplido su función para dejar espacio a lo nuevo.",
    ],
  },
  {
    src: "/viñetas/tcm/elementos/aguatcm.webp",
    paragraphs: [
      "Cuando aprendemos a soltar, aparece el Agua. Es la profundidad, la introspección y la conexión con nuestros recursos internos.",
      "Nos invita a mirar hacia dentro, encontrar paz y desarrollar la confianza necesaria para fluir con los cambios de la Vida.",
    ],
  },
  {
    src: "/viñetas/tcm/elementos/madera.webp",
    paragraphs: [
      "La Madera representa el crecimiento, la expansión y la capacidad de avanzar. Es la fuerza que transforma nuestro potencial en acción.",
      "Cuando está equilibrada nos ayuda a construir, crear y desarrollar aquello que hemos sembrado. Cuando se bloquea, pueden aparecer la frustración, la rigidez o el enfado.",
    ],
  },
  {
    src: "/viñetas/tcm/elementos/fuegotcm.webp",
    paragraphs: [
      "El Fuego es la expresión de la Vida en movimiento.",
      "Representa la alegría, la vitalidad, la pasión y la capacidad de conectar con los demás.",
      "Nos aporta entusiasmo, inspiración y el impulso necesario para compartir aquello que hemos creado.",
    ],
  },
  {
    src: "/viñetas/tcm/elementos/tcmpersona.webp",
    paragraphs: [
      "Según la Medicina Tradicional China, la salud surge cuando estos cinco movimientos se encuentran en equilibrio, permitiendo que la energía fluya de forma armoniosa a través de nuestro cuerpo, nuestras emociones y nuestra forma de vivir.",
    ],
  },
];

export const VINETAS_YIN_YANG: Vineta[] = [
  {
    src: "/viñetas/tcm/yinyang/yinyang.webp",
    paragraphs: [
      "Yin y Yang son dos aspectos opuestos y complementarios de una misma realidad.",
      "Yang representa la actividad, la luz y el movimiento.",
      "Yin representa el reposo, la oscuridad y la materia.",
    ],
  },
  {
    src: "/viñetas/tcm/yinyang/yinyang2.webp",
    paragraphs: [
      "Nada es completamente Yin ni completamente Yang. Cada uno contiene la semilla del otro.",
      "El Yang transforma la materia en energía. El Yin transforma la energía en materia.",
      "La salud y la Vida dependen del equilibrio dinámico entre Yin y Yang.",
    ],
  },
];

export const VINETAS_ALMA: Vineta[] = [
  {
    src: "/viñetas/tcm/alma/alma1.webp",
    paragraphs: [
      "Para la Medicina Tradicional China, el ser humano es una unidad. Cuerpo, Qi y espíritu forman un todo inseparable.",
      "El cuerpo (Xing) es la forma. El Qi es la energía vital. El Shen es el principio que da Vida, conciencia y presencia.",
    ],
  },
  {
    src: "/viñetas/tcm/alma/alma2.webp",
    paragraphs: [
      "Shen (corazón)",
      "Es la conciencia, la claridad mental y la capacidad de relacionarnos con el mundo.",
    ],
  },
  {
    src: "/viñetas/tcm/alma/alma3.webp",
    paragraphs: [
      "Hun (hígado)",
      "Es el alma etérea.",
      "Inspira los sueños, la creatividad, la imaginación y la capacidad de proyectarnos hacia el futuro.",
    ],
  },
  {
    src: "/viñetas/tcm/alma/alma4.webp",
    paragraphs: [
      "Po (pulmones)",
      "Es el alma corpórea.",
      "Gobierna los instintos, las sensaciones físicas y la respuesta inmediata a la Vida.",
    ],
  },
  {
    src: "/viñetas/tcm/alma/alma5.webp",
    paragraphs: [
      "Yi (bazo)",
      "Es la intención.",
      "Permite pensar, aprender, recordar y concentrarse.",
    ],
  },
  {
    src: "/viñetas/tcm/alma/alma6.webp",
    paragraphs: [
      "Zhi (riñones)",
      "Es la voluntad.",
      "Da perseverancia, determinación y la fuerza para seguir adelante.",
    ],
  },
  {
    src: "/viñetas/tcm/alma/alma7.webp",
    paragraphs: [
      "Cada aspecto del espíritu reside en un órgano.",
      "Cuando los órganos están en equilibrio, también lo está la mente.",
      "La salud no es solo la ausencia de enfermedad. Es la armonía entre cuerpo, energía y espíritu.",
    ],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// LOS CAPÍTULOS DEL SELECTOR
//
// Aquí están TODOS los cómics de Medicina China, no solo los cuatro de teoría:
// los cinco elementos uno a uno, las enfermedades, las leyes del Tao, la
// historia del Qigong, el Dao Yin, los Brocados, los Cinco Animales y las
// formas de cocinar. Cada uno se lee además en su paso del recorrido; esto es
// el sitio donde releerlos todos juntos.
//
// ⚠️  SOLO DENTRO DEL MAPA. La galería pública (/ilustraciones) NO sale de aquí:
// tiene su propia lista en `ilustracionesGaleria.ts`, donde de Medicina China
// solo están los cuatro de teoría (Origen, Yin Yang, Cinco Elementos y Alma
// Humana). Añadir un capítulo aquí NO lo publica fuera; para eso habría que
// añadirlo a mano allí, y no es lo que queremos.
// ────────────────────────────────────────────────────────────────────────────

/** Las viñetas del cómic de un elemento, sin sus pasos de mini-test: aquí se
 *  lee, no se responde (el test vive en su página, donde puntúa el perfil). */
const vinetasDeElemento = (el: (typeof ORDEN_ELEMENTOS)[number]): Vineta[] =>
  COMIC_ELEMENTO[el]
    .filter((p) => p.tipo === "vineta")
    .map((p) => ({ src: p.src, paragraphs: "paragraphs" in p ? p.paragraphs : [] }));

/** La intro de los Cinco Elementos (Wu Xing) tiene su propio formato (`texto`
 *  suelto o lista); se normaliza a viñetas del visor. */
const VINETAS_WU_XING: Vineta[] = COMIC_INTRO_ELEMENTOS.map((v) => ({
  src: v.src,
  paragraphs: Array.isArray(v.texto) ? v.texto : [v.texto],
}));

/** Las formas de cocinar de los cinco elementos, seguidas: el antetítulo dice
 *  de qué elemento es cada una (igual que en la página de Tu cocina). */
const VINETAS_COCINA: Vineta[] = ORDEN_ELEMENTOS.flatMap((el) =>
  cocinaDe(el).cocciones.map((c, i) => ({
    src: FOTO_COCINA(el, i),
    eyebrow: ELEMENTOS[el].nombre,
    titulo: c.nombre,
    paragraphs: [c.como, c.porque],
  })),
);

interface CapituloOpcion {
  key: string;
  title: string;
  vinetas: Vineta[];
  cover?: string;
  coverPosition?: string;
  coverScale?: number;
}

const CAPITULOS: CapituloOpcion[] = [
  // ── La teoría (los cuatro de siempre) ──
  { key: "origen", title: "El Origen", vinetas: VINETAS_ORIGEN,
    cover: "/viñetas/tcm/origen/origentcm3.webp" },
  { key: "yin_yang", title: "El Yin Yang", vinetas: VINETAS_YIN_YANG,
    cover: "/viñetas/tcm/yinyang/yinyang.webp" },
  // El pergamino de elementos trae un marco crema decorado alrededor; lo
  // ampliamos un poco para recortarlo y que llene la caja como las demás.
  { key: "los_elementos", title: "Los Cinco Elementos", vinetas: VINETAS_ELEMENTOS,
    cover: "/viñetas/tcm/elementos/portadaelementos.webp", coverScale: 1.12 },
  { key: "alma_humana", title: "El Alma Humana", vinetas: VINETAS_ALMA,
    cover: "/viñetas/tcm/alma/alma7.webp" },

  // ── Los elementos, uno a uno (los cómics de la estrella) ──
  { key: "wu_xing", title: "El Wu Xing", vinetas: VINETAS_WU_XING,
    cover: "/recorrido/tcm/elementos/elementos1.webp" },
  { key: "madera", title: "La Madera", vinetas: vinetasDeElemento("madera"),
    cover: "/recorrido/tcm/madera/madera1.webp" },
  { key: "fuego", title: "El Fuego", vinetas: vinetasDeElemento("fuego"),
    cover: "/recorrido/tcm/fuego/fuego1.webp" },
  { key: "tierra", title: "La Tierra", vinetas: vinetasDeElemento("tierra"),
    cover: "/recorrido/tcm/tierra/tierra1.webp" },
  { key: "metal", title: "El Metal", vinetas: vinetasDeElemento("metal"),
    cover: "/recorrido/tcm/metal/metal1.webp" },
  { key: "agua", title: "El Agua", vinetas: vinetasDeElemento("agua"),
    cover: "/recorrido/tcm/agua/agua1.webp" },

  // ── Lo que se rompe y lo que se hace ──
  { key: "enfermedades", title: "Las Enfermedades", vinetas: VINETAS_ENFERMEDADES,
    cover: "/viñetas/tcm/enfermedades/enfermedades1.webp" },
  { key: "leyes_tao", title: "Las Leyes del Tao", vinetas: LEYES_TAO_VINETAS,
    cover: "/recorrido/tcm/taoismo/tao.webp" },
  { key: "cocina", title: "Formas de Cocinar", vinetas: VINETAS_COCINA,
    cover: "/recorrido/tcm/cocina/madera1.webp" },

  // ── El Qigong ──
  { key: "qigong_historia", title: "La Historia del Qigong", vinetas: HISTORIA_QIGONG_VINETAS,
    cover: "/recorrido/tcm/qigong/historia/mawangdui.webp" },
  { key: "dao_yin", title: "El Dao Yin", vinetas: DAO_YIN_VINETAS,
    cover: "/recorrido/tcm/qigong/daoyin/nombre.webp" },
  { key: "brocados", title: "Los Brocados", vinetas: BROCADOS_VINETAS,
    cover: "/recorrido/tcm/qigong/brocado-1-sostener-cielo.webp" },
  { key: "animales", title: "Los Cinco Animales", vinetas: CINCO_ANIMALES_VINETAS,
    cover: "/recorrido/tcm/cincoanimales/tigre.webp" },
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
  const t = useT();
  const [capitulo, setCapitulo] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setCapitulo(null);
  }, [isOpen]);

  const volverAlSelector = () => setCapitulo(null);
  const elegirCapitulo = (key: string) => setCapitulo(key);

  const vinetas = CAPITULOS.find((c) => c.key === capitulo)?.vinetas ?? [];

  // No mostramos nada hasta que la foto de fondo (tcm.png) y las portadas del
  // selector estén completamente cargadas: mientras tanto se ve solo el loader
  // de TCM, para que luego aparezca todo a la vez (fondo + tarjetas).
  const fondosListos = usePrecargarImagenes(
    isOpen ? ["/img/fondos/tcm.webp", ...CAPITULOS.map((o) => o.cover)] : [],
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
          backgroundImage: `linear-gradient(${tcmBg}33, ${tcmBg}33), url('/img/fondos/tcm.webp')`,
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
        minH="100dvh"
        position="relative"
      >
        {/* Mientras la foto de fondo y las portadas no están cargadas, no se
            muestra nada salvo el loader de TCM (aparece todo a la vez). */}
        {!fondosListos && (
          <Flex position="relative" zIndex={2} minH="100dvh" align="center" justify="center">
            {comicLoaderPorColor(tcmTxt)}
          </Flex>
        )}

        {fondosListos && (<>

        {/* X cerrar */}
        <IconButton
          aria-label={t("comun.cerrar")}
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
            // Empieza arriba SIEMPRE: son diecisiete capítulos, no caben en una
            // pantalla, y centrar contenido más alto que su caja con scroll deja
            // las primeras filas cortadas y fuera de alcance.
            justifyContent="flex-start"
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
                  {t("metodo.ilustracionesDe", { disciplina: t("disciplina.medicinaChina") })}
                </Text>
                <Text
                  color={`${tcmTxt}cc`}
                  fontSize={{ base: "sm", md: "md" }}
                  fontStyle="italic"
                  letterSpacing="0.08em"
                  textAlign="center"
                  maxW="520px"
                >
                  {t("metodo.ilustracionesElige")}
                </Text>
              </Flex>

              {/* Rejilla (no una fila que envuelve): con diecisiete capítulos, el
                  `wrap` dejaba filas de anchos distintos porque las tarjetas se
                  estiraban con `flex=1`. Con `auto-fill` todas miden igual y el
                  número de columnas lo pone el ancho de la pantalla. */}
              <Box
                display="grid"
                gridTemplateColumns={{
                  base: "repeat(auto-fill, minmax(150px, 1fr))",
                  md: "repeat(auto-fill, minmax(240px, 1fr))",
                }}
                gap={{ base: 4, md: 6 }}
                w="100%"
                alignItems="stretch"
                justifyItems="stretch"
              >
                {CAPITULOS.map((opt) => (
                  <Box
                    key={opt.key}
                    as="button"
                    onClick={() => elegirCapitulo(opt.key)}
                    position="relative"
                    display="flex"
                    flexDirection="column"
                    w="100%"
                    h="100%"
                    p={0}
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
                    {/* `flex=1` + `justify=center`: las tarjetas de la rejilla son
                        igual de altas, así que el pie ocupa el resto y el «Leer»
                        queda a la misma altura aunque un título ocupe dos líneas. */}
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      flex="1"
                      gap={1}
                      py={opt.cover ? { base: 3.5, md: 5 } : { base: 10, md: 14 }}
                      px={3}
                    >
                      <Text
                        color={tcmTxt}
                        fontSize={{ base: "md", md: "xl" }}
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
                        <Text as="span">{t("metodo.leer")}</Text>
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
              </Box>
            </Flex>
          </ModalBody>
        )}

        {/* ── VISTA CÓMIC ── va viñeta a viñeta (el ComicViewer muestra el
            yin-yang por cada foto mientras carga y precarga la siguiente). */}
        {capitulo && (
          <ComicViewer
            key={capitulo}
            vinetas={vinetas}
            themeColor={tcmTxt}
            // Toda la letra del visor en la tinta de la disciplina: sin esto el
            // ComicViewer pinta el antetítulo y el título en BLANCO (solo el
            // cuerpo hereda `themeColor`) y las viñetas salían a dos colores.
            textColor={tcmTxt}
            disciplinaBgImage="/img/fondos/tcm.webp"
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
