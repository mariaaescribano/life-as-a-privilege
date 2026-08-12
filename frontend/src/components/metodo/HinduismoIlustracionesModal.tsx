import React, { useEffect, useState } from "react";
import { useT, type ClaveTexto } from "../../i18n";
import { useComic } from "../../i18n/comics";
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
import { ayurvedaBg, ayurvedaTxt } from "../../GlobalVariables";
import { ComicViewer } from "./ComicViewer";
import type { Vineta } from "./ComicViewer";
import { AyurvedaLoader } from "./comicLoaders";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { barraVisibleSx } from "../global/barraDeScroll";

// ────────────────────────────────────────────────────────────────────────────
// CONTENIDO DE LOS 2 SUB-CÓMICS DE HINDUISMO
// (Pendiente de recibir fotos y textos definitivos. Cada capítulo arranca con
//  una viñeta placeholder para que el ComicViewer no rompa.)
// ────────────────────────────────────────────────────────────────────────────

// Se exporta para reutilizarlo como intro de Ayurveda (cómic del Origen con
// ilustraciones de hinduismo) sin duplicar el contenido.
export const VINETAS_ORIGEN: Vineta[] = [
  {
    src: "/viñetas/hinduismo/origen/origen1.webp",
    paragraphs: [
      "El Uno se manifiesta en dos principios fundamentales.",
      "Puruṣa, la energía masculina y la consciencia pura.",
      "Prakṛti, la energía femenina, la naturaleza primordial o energía creadora.",
    ],
  },
  {
    src: "/viñetas/hinduismo/origen/origen2.webp",
    paragraphs: [
      "Prakṛti está formada por tres cualidades o energías llamadas guṇas: ",
      "Sattva (armonía y claridad), Rajas (acción y movimiento) y Tamas (estabilidad e inercia).",
    ],
  },
  {
    src: "/viñetas/hinduismo/origen/origen3.webp",
    paragraphs: [
      "Cuando Puruṣa se encuentra con Prakṛti, comienza la manifestación del universo.",
      "La primera manifestación es Mahat o Buddhi, la inteligencia cósmica.",
      "De Mahat surge Ahaṃkāra, el ego. Gracias a él aparece la noción de «yo», permitiendo que la unidad se experimente y manifieste como múltiples seres y objetos.",
    ],
  },
  {
    src: "/viñetas/hinduismo/origen/origen4.webp",
    paragraphs: [
      "Desde Ahaṃkāra, cuando predomina Sattva, nacen Manas (la mente), los cinco sentidos de conocimiento y los cinco órganos de acción.",
    ],
  },
  {
    src: "/viñetas/hinduismo/origen/origen5.webp",
    paragraphs: [
      "Desde Ahaṃkāra, cuando predomina Tamas, surgen los cinco Tanmātras o cualidades sutiles: sonido, tacto, forma, sabor y olor.",
      "De ellos emergerán posteriormente los cinco grandes elementos.",
    ],
  },
  {
    src: "/viñetas/hinduismo/origen/origen6.webp",
    paragraphs: [
      "Los cinco grandes elementos son: Éter, Aire, Fuego, Agua y Tierra.",
      "Constituyen toda la materia del universo.",
    ],
  },
  {
    src: "/viñetas/hinduismo/origen/origen7.webp",
    paragraphs: [
      "Los cinco elementos se combinan para formar los tres doṣhas: Vāta, Pitta y Kapha.",
    ],
  },
  {
    src: "/viñetas/hinduismo/origen/origen8.webp",
    paragraphs: [
      "La interacción de los elementos y los doṣhas da lugar a la naturaleza y al ser humano, que refleja en sí mismo las mismas leyes y cualidades que gobiernan el universo.",
    ],
  },
  {
    src: "/viñetas/hinduismo/origen/origen9.webp",
    paragraphs: [
      "Por ello, el ser humano es considerado un microcosmos: un universo en miniatura que contiene los mismos principios presentes en el macrocosmos.",
      "Entendernos es entender el universo y entender el universo es entendernos a nosotros.",
    ],
  },
];

export const VINETAS_ELEMENTOS: Vineta[] = [
  {
    src: "/viñetas/hinduismo/elementos/elementosayurveda.webp",
    paragraphs: [
      "Según la Ayurveda, todo lo que existe en el universo está formado por Cinco Elementos.",
      "Y nosotros no somos la excepción.",
    ],
  },
  {
    src: "/viñetas/hinduismo/elementos/eter.webp",
    paragraphs: [
      "El Éter es el espacio.",
      "Es aquello que permite que todo lo demás exista y se exprese.",
    ],
  },
  {
    src: "/viñetas/hinduismo/elementos/aire.webp",
    paragraphs: [
      "El Aire es el movimiento.",
      "La respiración, los pensamientos y el cambio constante de la Vida.",
    ],
  },
  {
    src: "/viñetas/hinduismo/elementos/fuego.webp",
    paragraphs: [
      "El Fuego es la transformación.",
      "Convierte la materia en energía, las experiencias en aprendizaje y las ideas en acción.",
    ],
  },
  {
    src: "/viñetas/hinduismo/elementos/agua.webp",
    paragraphs: [
      "El Agua es la unión.",
      "La nutrición, la sensibilidad y la capacidad de adaptarnos sin perder nuestra esencia.",
    ],
  },
  {
    src: "/viñetas/hinduismo/elementos/tierra.webp",
    paragraphs: [
      "La Tierra es la estabilidad.",
      "Nos aporta estructura, fuerza y la capacidad de construir algo duradero.",
    ],
  },
];

export const VINETAS_DOSHAS: Vineta[] = [
  {
    src: "/viñetas/hinduismo/doshas/doshasportada.webp",
    paragraphs: [
      "Según la Ayurveda, los Cinco Elementos se mezclan para formar los tres Doṣhas.",
      "En cada persona, un Doṣha predomina sobre los otros, esto influencia la constitución, la mentalidad y la salud.",
    ],
  },
  {
    src: "/viñetas/hinduismo/doshas/vatta.webp",
    paragraphs: [
      "Vata está formado por Aire y Éter.",
      "Es la energía del movimiento, la creatividad y el cambio.",
    ],
  },
  {
    src: "/viñetas/hinduismo/doshas/pitta.webp",
    paragraphs: [
      "Pitta está formado por Fuego y Agua.",
      "Es la energía de la transformación, la intensidad y la acción.",
    ],
  },
  {
    src: "/viñetas/hinduismo/doshas/kapha.webp",
    paragraphs: [
      "Kapha está formado por Agua y Tierra.",
      "Es la energía de la estabilidad, la nutrición y la constancia.",
    ],
  },
];

type Capitulo = "el_origen" | "los_elementos" | "los_doshas";

const VINETAS_BY_CAPITULO: Record<Capitulo, Vineta[]> = {
  el_origen: VINETAS_ORIGEN,
  los_elementos: VINETAS_ELEMENTOS,
  los_doshas: VINETAS_DOSHAS,
};

// El título va por CLAVE y no escrito: este array se calcula una vez al importar
// el módulo, así que un texto ya traducido se quedaría congelado en el idioma con
// el que arrancó la página. Se resuelve al pintar, con `t(opt.tituloKey)`.
const SELECTOR_OPTIONS: { key: Capitulo; tituloKey: ClaveTexto; cover?: string; coverPosition?: string }[] = [
  { key: "el_origen",     tituloKey: "metodo.ayurIlus.origen",    cover: "/viñetas/hinduismo/origen/portada.webp"              },
  { key: "los_elementos", tituloKey: "metodo.ayurIlus.elementos", cover: "/viñetas/hinduismo/elementos/elementosayurveda.webp" },
  { key: "los_doshas",    tituloKey: "metodo.ayurIlus.doshas",    cover: "/viñetas/hinduismo/doshas/doshasportada.webp"        },
];

/** Los tres capítulos, traducidos en `i18n/comics/comics.en.ts`. */
const CLAVE_COMIC: Record<Capitulo, string> = {
  el_origen: "hinduismo-origen",
  los_elementos: "hinduismo-elementos",
  los_doshas: "hinduismo-doshas",
};

// Portadas del selector (con la misma codificación que usa el <img>), para
// precargarlas y mostrar la animación de espera mientras descargan.
const PORTADAS = SELECTOR_OPTIONS.map((o) => (o.cover ? encodeURI(o.cover) : null));

interface HinduismoIlustracionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Opcional: se llama cuando el usuario completa un capítulo con la flecha final. */
  onComplete?: () => void;
}

export function HinduismoIlustracionesModal({
  isOpen,
  onClose,
  onComplete,
}: HinduismoIlustracionesModalProps) {
  const t = useT();
  const [capitulo, setCapitulo] = useState<Capitulo | null>(null);
  // Espera de las portadas del selector: hasta que TODAS estén descargadas se
  // muestra la animación de Ayurveda (el loto) en vez de la rejilla.
  const portadasListas = usePrecargarImagenes(PORTADAS);

  // Al abrir el modal, siempre volvemos al selector de capítulos.
  useEffect(() => {
    if (isOpen) setCapitulo(null);
  }, [isOpen]);

  const volverAlSelector = () => setCapitulo(null);
  const elegirCapitulo = (key: Capitulo) => setCapitulo(key);

  // Las viñetas del capítulo abierto, en el idioma activo. El hook se llama
  // siempre (con clave vacía mientras no hay capítulo elegido, que devuelve el
  // español tal cual): así no queda una llamada condicional.
  const vinetas = useComic(
    capitulo ? CLAVE_COMIC[capitulo] : "",
    capitulo ? VINETAS_BY_CAPITULO[capitulo] : [],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior={capitulo ? "outside" : "inside"}>
      <ModalOverlay bg="rgba(0,0,0,0.85)" sx={{ backdropFilter: "blur(20px)" }} />
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
        {/* Fondo: foto de Hinduismo blureada, presente, ocupando todo el
            espacio sin hacer zoom obvio. El inset negativo discreto compensa
            los bordes blandos del blur sin agrandar visiblemente la imagen. */}
        <Box
          position="fixed"
          inset="0"
          pointerEvents="none"
          zIndex={0}
          bg={ayurvedaBg}
          overflow="hidden"
        >
          <Box
            as="img"
            src="/img/fondos/hinduismo.webp"
            alt=""
            loading="eager"
            position="absolute"
            top="-14px"
            left="-14px"
            right="-14px"
            bottom="-14px"
            w="calc(100% + 28px)"
            h="calc(100% + 28px)"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          <Box position="absolute" inset="0" bg={`${ayurvedaBg}55`} />
        </Box>

        {/* X cerrar — siempre visible */}
        <IconButton
          aria-label={t("comun.cerrar")}
          onClick={onClose}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: 3, md: 5 }}
          zIndex={10}
          variant="ghost"
          color={ayurvedaTxt}
          _hover={{ bg: `${ayurvedaTxt}22` }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill={ayurvedaTxt}>
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
            // `scroll` + barra clásica: en el móvil también se ve que la lista
            // de capítulos sigue por debajo (ver barraDeScroll.ts).
            overflowY="scroll"
            overflowX="hidden"
            sx={barraVisibleSx(ayurvedaTxt)}
          >
            {!portadasListas ? (
              // Mientras cargan las portadas: animación de Ayurveda centrada.
              <Flex flex="1" w="100%" minH={{ base: "60vh", md: "80vh" }} align="center" justify="center">
                <AyurvedaLoader color={ayurvedaTxt} />
              </Flex>
            ) : (
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
                  color={ayurvedaTxt}
                  fontSize={{ base: "2xl", md: "4xl" }}
                  fontWeight="700"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  textAlign="center"
                  lineHeight="1.1"
                >
                  {t("metodo.ilustracionesDe", { disciplina: t("disciplina.hinduismo") })}
                </Text>
                <Text
                  color={`${ayurvedaTxt}cc`}
                  fontSize={{ base: "sm", md: "md" }}
                  fontStyle="italic"
                  letterSpacing="0.08em"
                  textAlign="center"
                  maxW="520px"
                >
                  {t("metodo.ilustracionesElige")}
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
                    flex="1"
                    w="100%"
                    minW={{ base: "auto", sm: "280px", md: "300px" }}
                    maxW={{ base: "300px", md: "360px" }}
                    borderRadius="2xl"
                    overflow="hidden"
                    border={`1px solid ${ayurvedaTxt}55`}
                    bg="rgba(255,255,255,0.08)"
                    cursor="pointer"
                    fontFamily="'EB Garamond', serif"
                    sx={{
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      transition: "all 0.25s ease",
                      boxShadow: `0 0 18px ${ayurvedaTxt}33, 0 0 42px ${ayurvedaTxt}1f, inset 0 0 24px rgba(255,255,255,0.04)`,
                      _hover: {
                        transform: "translateY(-4px)",
                        borderColor: ayurvedaTxt,
                        boxShadow: `0 0 28px ${ayurvedaTxt}99, 0 0 70px ${ayurvedaTxt}55, inset 0 0 24px rgba(255,255,255,0.08)`,
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
                        borderBottom={`1px solid ${ayurvedaTxt}44`}
                        bg="rgba(0,0,0,0.25)"
                      >
                        <Box
                          as="img"
                          src={encodeURI(opt.cover)}
                          alt={t(opt.tituloKey)}
                          loading="eager"
                          position="absolute"
                          inset="0"
                          w="100%"
                          h="100%"
                          style={{ objectFit: "cover", objectPosition: opt.coverPosition ?? "center" }}
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
                        color={ayurvedaTxt}
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight="700"
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        textAlign="center"
                        lineHeight="1.1"
                      >
                        {t(opt.tituloKey)}
                      </Text>
                      <Flex
                        align="center"
                        gap={1.5}
                        mt={2}
                        color={ayurvedaTxt}
                        fontSize={{ base: "xs", md: "sm" }}
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        style={{ textShadow: `0 0 10px ${ayurvedaTxt}aa` }}
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
              </Flex>
            </Flex>
            )}
          </ModalBody>
        )}

        {/* ── VISTA CÓMIC ── va viñeta a viñeta (el ComicViewer muestra el loto
            por cada foto mientras carga y precarga la siguiente por detrás). */}
        {capitulo && (
          <ComicViewer
            key={capitulo}
            vinetas={vinetas}
            themeColor={ayurvedaTxt}
            disciplinaBgImage="/img/fondos/hinduismo.webp"
            disciplinaBgColor={ayurvedaBg}
            textShadow={`0 0 6px ${ayurvedaBg}, 0 0 14px ${ayurvedaBg}, 0 0 26px ${ayurvedaBg}cc`}
            onClose={onClose}
            onBack={volverAlSelector}
            sinSaltar
            onComplete={() => {
              if (onComplete) onComplete();
              volverAlSelector();
            }}
          />
        )}
      </ModalContent>
    </Modal>
  );
}
