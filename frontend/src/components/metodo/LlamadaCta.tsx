import React, { useEffect } from "react";
import { Box, Flex, Text, type FlexProps } from "@chakra-ui/react";
import { useT } from "../../i18n";
import { whatsappUrl } from "../../GlobalVariables";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { Reveal } from "../global/Reveal";

/* ─────────────────────────────────────────────────────────────────────────────
 *  LA LLAMADA: botón flotante + popup
 *
 *  El objetivo de /elMetodo no es solo que la gente lea: es que HABLE conmigo.
 *  Por eso la llamada gratuita deja de estar escondida a media página y pasa a
 *  tener dos sitios propios:
 *
 *   · Un botón flotante abajo a la derecha que acompaña siempre (también en
 *     móvil, donde SUSTITUYE a la vieja barra fija de «Empezar / desde 30 €»:
 *     el contacto vale más que el precio).
 *   · Un popup que se abre solo a los 5 segundos de entrar —una vez por
 *     sesión— y, a partir de ahí, cada vez que se pulsa el botón.
 * ───────────────────────────────────────────────────────────────────────────── */

/** El mármol con el mandala grabado: fondo del popup. */
const FONDO = "/img/fondos/llamada.webp";
/** El azul del mandala de la ilustración: la letra dentro de la tarjeta. */
const TINTA = "#16305e";
/** El dorado de las vetas: los filos. */
const ORO = "#b08d3f";
/** El MISMO oro, bajado de tono para que se lea sobre el crema del mármol.
 *  El de los filos vale para una línea de 1 px, no para una palabra. */
const ORO_LETRA = "#8a6b2a";
/** El crema del mármol. */
const CREMA = "#f2e9d9";

/* ─── La tarjeta, proporcional ────────────────────────────────────────────────
 *
 *  Todo el popup se mide a partir de UN número: `--pw`, el ancho de la tarjeta.
 *  Los tamaños de letra, los márgenes y el hueco de arriba salen de él con
 *  `calc()`, así que la tarjeta es la misma composición en un móvil de 360 px
 *  que en un portátil: no se estira solo el fondo dejando la letra pequeña.
 *
 *  El hueco de arriba (`ALTO_MANDALA`) es el detalle que importa. El mandala
 *  viene DENTRO de la foto, y con `background-size: cover` su posición depende
 *  del ANCHO de la tarjeta, no de su alto (la foto es 2:3, así que se escala
 *  por el ancho). Por eso el `padding-top` va en función de `--pw` y no en
 *  porcentaje del alto: si fuera del alto, al cambiar la altura de la ventana
 *  el título se subiría encima del mandala.
 * ─────────────────────────────────────────────────────────────────────────── */

/** Ancho de la tarjeta. El `58dvh` es lo que la mantiene dentro de la ventana. */
const ANCHO = "min(92vw, 58dvh, 420px)";
/** Sitio para el mandala de la foto + aire. El 0,40 no es a ojo: midiendo los
 *  píxeles azules de la ilustración, el mandala ocupa del 0,136 al 0,301 del
 *  ancho, así que el título entra con un respiro de casi un 10% por debajo. */
const ALTO_MANDALA = "calc(var(--pw) * 0.40)";
/** Alto MÍNIMO. La tarjeta crece si el texto necesita más (móviles estrechos). */
const ALTO_MINIMO = "calc(var(--pw) * 1.28)";

/** Un tamaño proporcional al ancho de la tarjeta. */
const prop = (factor: number) => `calc(var(--pw) * ${factor})`;

/** Auricular (trazo, estilo feather). Se usa en el botón y en el popup. */
function IconoLlamada({
  size = "16px",
  color = "currentColor",
}: {
  size?: string | Record<string, string>;
  color?: string;
}) {
  return (
    <Box
      as="svg"
      viewBox="0 0 24 24"
      w={size}
      h={size}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      flexShrink={0}
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Box>
  );
}

/** El glifo de WhatsApp. Este va MACIZO y no de línea como el del teléfono: es
 *  una marca que se reconoce por su silueta, y dibujada a trazo se convierte en
 *  un bocadillo cualquiera. Va en `currentColor`, así que hereda el color del
 *  botón (y su cambio al pasar por encima) en vez de meter el verde de WhatsApp
 *  en una tarjeta de mármol, azul y oro. */
export function IconoWhatsapp({
  size = "16px",
  color = "currentColor",
}: {
  size?: string | Record<string, string>;
  color?: string;
}) {
  return (
    <Box
      as="svg"
      viewBox="0 0 24 24"
      w={size}
      h={size}
      fill={color}
      stroke="none"
      flexShrink={0}
      aria-hidden="true"
    >
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.79.97-.97 1.17-.18.2-.35.22-.65.07-.3-.15-1.13-.42-2.15-1.33-.8-.71-1.33-1.59-1.48-1.89-.15-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.07 4.37 2.98 1.17 2.98.78 3.52.73.54-.05 1.75-.71 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.19-.57-.34z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.91 6.45 17.5 2 12.04 2zm0 18.15h-.01c-1.48 0-2.94-.4-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23z" />
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
 *  1. BOTÓN FLOTANTE
 * ════════════════════════════════════════════════════════════════════════════ */

/**
 * Píldora fija abajo a la derecha, en TODAS las pantallas: CLARA —el crema del
 * mármol— con la letra en el azul del mandala. Es la misma pareja de colores
 * que la tarjeta del popup, así que se reconocen entre sí sin necesidad de
 * ningún filo dorado: sobre el turquesa y los fondos oscuros de la página, lo
 * que hace destacar al botón es ser lo único claro, no ir perfilado.
 *
 * El fondo es color PLANO y no una foto, a propósito. Con el mármol dentro, la
 * palabra caía sobre el beige y no se leía; y como es un elemento fijo que sale
 * en cuanto carga la página, la foto se veía entrar tarde. Un color no tiene
 * ninguno de los dos problemas. Late muy despacio para que el ojo lo encuentre
 * sin molestar al leer.
 *
 * Se monta FUERA del <Box> que lleva el `zoom` de la página: un `position:
 * fixed` dentro de un elemento con zoom se ancla a él y no a la ventana.
 */
/** El estilo de las píldoras flotantes.
 *
 *  Las dos son la MISMA pastilla —crema, letra azul, el mismo latido y el mismo
 *  hover— y solo cambian el icono, el rótulo y lo que hacen al pulsarlas. Está
 *  en una constante a propósito: si el estilo estuviera escrito dos veces,
 *  tocar una y olvidarse de la otra las dejaría desparejadas, y aquí lo que se
 *  quiere es justo lo contrario.
 *
 *  El latido lo llevan las dos, así que van acompasadas: arrancan al cargar la
 *  página y tienen la misma duración, así que laten a la vez y se leen como un
 *  solo elemento de dos partes en vez de como dos cosas parpadeando cada una a
 *  su ritmo. */
const PILDORA_FLOTANTE: FlexProps = {
  align: "center",
  justify: "center",
  gap: { base: "9px", md: "11px" },
  px: { base: "18px", md: "22px" },
  py: { base: "12px", md: "14px" },
  borderRadius: "full",
  overflow: "hidden",
  bg: CREMA,
  border: `1px solid ${TINTA}1f`,
  color: TINTA,
  cursor: "pointer",
  sx: {
    "@keyframes llamadaLatido": {
      "0%, 100%": { boxShadow: "0 8px 24px rgba(0,0,0,0.3), 0 0 0 0 rgba(255,255,255,0)" },
      "50%": { boxShadow: "0 8px 24px rgba(0,0,0,0.3), 0 0 0 9px rgba(255,255,255,0.14)" },
    },
    animation: "llamadaLatido 3.4s ease-in-out infinite",
  },
  _hover: { bg: "#fbf6ec", transform: "translateY(-2px) scale(1.03)", borderColor: `${TINTA}33` },
  _active: { transform: "translateY(0) scale(1)" },
  transition: "background 0.22s ease, transform 0.22s ease, border-color 0.22s ease",
};

/** El rótulo de una píldora: la misma tipografía en las dos. */
const LETRA_PILDORA = {
  fontFamily: "'EB Garamond', serif",
  fontWeight: "600",
  fontSize: { base: "17px", md: "19px" },
  letterSpacing: "0.03em",
  whiteSpace: "nowrap",
} as const;

export function BotonLlamadaFlotante({ onClick }: { onClick: () => void }) {
  const t = useT();

  return (
    /* Los dos botones van en UNA columna fija, no como dos `position: fixed`
       con sus propias distancias al borde: apilados en un flex, el de arriba
       se coloca solo y sigue cuadrando si alguno cambia de alto o de texto.
       Con dos posiciones sueltas habría que ir ajustando a mano el hueco. */
    <Flex
      direction="column"
      align="flex-end"
      gap={{ base: "10px", md: "12px" }}
      position="fixed"
      right={{ base: "14px", md: "26px" }}
      bottom={{ base: "calc(14px + env(safe-area-inset-bottom))", md: "26px" }}
      zIndex={150}
    >
      {/* ── MENSAJE (WhatsApp) ──────────────────────────────────────────────
          Encima del de la llamada y con EXACTAMENTE su misma pastilla: mismo
          crema, misma letra azul, mismo latido y mismo hover. Lo único distinto
          es el icono, el rótulo y lo que hace: en vez de abrir el popup, abre
          el chat de WhatsApp en otra pestaña con el mensaje ya escrito. Por eso
          es un enlace (`as="a"`) y no un botón. */}
      <Flex
        {...PILDORA_FLOTANTE}
        as="a"
        href={whatsappUrl(t("elMetodo.llamada.whatsappTexto"))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("elMetodo.llamada.whatsapp")}
        textDecoration="none"
      >
        <Box as="span" display="flex">
          <IconoWhatsapp size={{ base: "17px", md: "19px" }} color={TINTA} />
        </Box>
        <Text {...LETRA_PILDORA}>
          {t("elMetodo.llamada.botonMensaje")}
        </Text>
      </Flex>

      {/* ── LLAMADA ─────────────────────────────────────────────────────────
          La misma pastilla, y al pulsarla abre el popup de la llamada. */}
      <Flex
        {...PILDORA_FLOTANTE}
        as="button"
        onClick={onClick}
        aria-label={t("elMetodo.llamada.boton")}
      >
        <Box as="span" display="flex">
          <IconoLlamada size={{ base: "17px", md: "19px" }} color={TINTA} />
        </Box>
        <Text {...LETRA_PILDORA}>
          {t("elMetodo.llamada.boton")}
        </Text>
      </Flex>
    </Flex>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
 *  2. POPUP
 * ════════════════════════════════════════════════════════════════════════════ */

interface PopupLlamadaProps {
  isOpen: boolean;
  onClose: () => void;
  /** Abre el calendario de reserva: el MISMO BookCallModal del botón de la página. */
  onAgendar: () => void;
}

export function PopupLlamada({ isOpen, onClose, onAgendar }: PopupLlamadaProps) {
  const t = useT();

  // La tarjeta NO se pinta hasta que el mármol esté cargado: si no, se abre un
  // recuadro vacío con el filo dorado y la foto entra después de golpe, que es
  // justo lo que se ve feo. El hook arranca al montar el componente (no al
  // abrirlo), así que para cuando el popup salta —a los 5 s de entrar— la foto
  // lleva rato lista y no se espera nada. Nunca se queda colgado: si la imagen
  // falla, cuenta igual como cargada y la tarjeta sale con su color de fondo.
  const fondoListo = usePrecargarImagenes([FONDO]);
  const abierto = isOpen && fondoListo;

  // El fondo se ve (velo negro translúcido) pero NO se mueve: `fijarFondo`
  // clava el body, que es lo único que aguanta también en iOS.
  useLockBodyScroll(abierto, { fijarFondo: true });

  // Escape cierra.
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, onClose]);

  if (!abierto) return null;

  return (
    <Flex
      position="fixed"
      inset={0}
      zIndex={2000}
      align="center"
      justify="center"
      px={4}
      py={5}
      // Negro de verdad, pero translúcido: la página sigue viéndose detrás.
      bg="rgba(0,0,0,0.72)"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <Reveal
        direction="up"
        distance={20}
        scaleFrom={0.94}
        duration={0.55}
        display="flex"
        justifyContent="center"
      >
        <Box
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          position="relative"
          display="flex"
          flexDirection="column"
          sx={{ "--pw": ANCHO }}
          w="var(--pw)"
          minH={ALTO_MINIMO}
          maxH="88dvh"
          borderRadius="22px"
          overflow="hidden"
          border={`1px solid ${ORO}99`}
          boxShadow={`0 0 0 1px ${ORO}33, 0 26px 80px rgba(0,0,0,0.62)`}
          backgroundImage={`url(${FONDO})`}
          backgroundSize="cover"
          backgroundPosition="center top"
          backgroundRepeat="no-repeat"
        >
          {/* X */}
          <Flex
            as="button"
            onClick={onClose}
            aria-label={t("elMetodo.llamada.cerrar")}
            position="absolute"
            top="12px"
            right="12px"
            zIndex={2}
            w="32px"
            h="32px"
            align="center"
            justify="center"
            borderRadius="full"
            bg="rgba(255,255,255,0.5)"
            border={`1px solid ${TINTA}2b`}
            color={TINTA}
            fontSize="sm"
            cursor="pointer"
            _hover={{ bg: "rgba(255,255,255,0.85)" }}
            transition="background 0.2s ease"
          >
            ✕
          </Flex>

          {/* El texto arranca por debajo del mandala que ya trae la foto. */}
          <Flex
            flex="1"
            direction="column"
            align="center"
            textAlign="center"
            px={prop(0.1)}
            pt={ALTO_MANDALA}
            pb={prop(0.072)}
            overflowY="auto"
            sx={{
              scrollbarWidth: "thin",
              scrollbarColor: `${TINTA}44 transparent`,
              "&::-webkit-scrollbar": { width: "5px", background: "transparent" },
              "&::-webkit-scrollbar-thumb": { background: `${TINTA}44`, borderRadius: "3px" },
            }}
          >
            {/* El título, en dos líneas: la frase en azul y, debajo, el «sin
                coste» en cursiva dorada. Separarlas es lo que deja respirar al
                titular —cabe en una sola línea, sin partirse— y convierte la
                condición en un remate, que es lo que es. */}
            <Text
              fontFamily="'EB Garamond', serif"
              fontSize={prop(0.075)}
              fontWeight="600"
              lineHeight="1.18"
              letterSpacing="0.005em"
              color={TINTA}
            >
              {t("elMetodo.llamada.titulo")}
            </Text>

            <Text
              fontFamily="'EB Garamond', serif"
              fontSize={prop(0.055)}
              fontStyle="italic"
              lineHeight="1.2"
              letterSpacing="0.06em"
              color={ORO_LETRA}
              mt={prop(0.014)}
            >
              {t("elMetodo.llamada.tituloSufijo")}
            </Text>

            {/* Rayita fina de tinta: separa sin adornar. */}
            <Box w={prop(0.14)} h="1px" bg={`${ORO}cc`} my={prop(0.045)} flexShrink={0} />

            <Text
              fontFamily="'EB Garamond', serif"
              fontSize={prop(0.048)}
              lineHeight="1.5"
              color={`${TINTA}dd`}
            >
              {t("elMetodo.llamada.texto")}
            </Text>

            <Text
              fontFamily="'EB Garamond', serif"
              fontSize={prop(0.05)}
              fontWeight="700"
              lineHeight="1.35"
              color={TINTA}
              mt={prop(0.038)}
            >
              {t("elMetodo.llamada.remate")}
            </Text>

            {/* Empuja el botón al fondo de la tarjeta. */}
            <Box flex="1" minH={prop(0.06)} />

            {/* ── ESCRIBE POR WHATSAPP ──────────────────────────────────
                Va ENCIMA de agendar y con SU MISMO botón fantasma: sin relleno,
                solo el filo y la letra en el azul del título, y al pasar por
                encima se rellena de azul con la letra en crema. Estuvo macizo
                para marcar jerarquía, pero un rectángulo azul sólido sobre el
                mármol pesaba demasiado y se comía la tarjeta: aquí el fondo es
                una ilustración, no un color liso, y tapársela es perderla. */}
            <Flex
              as="a"
              href={whatsappUrl(t("elMetodo.llamada.whatsappTexto"))}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              align="center"
              justify="center"
              gap="9px"
              w="100%"
              maxW={prop(0.78)}
              py={prop(0.036)}
              borderRadius="full"
              bg="transparent"
              border={`1.5px solid ${TINTA}`}
              color={TINTA}
              cursor="pointer"
              textDecoration="none"
              _hover={{
                bg: TINTA,
                color: CREMA,
                borderColor: TINTA,
                transform: "translateY(-2px)",
                boxShadow: "0 10px 24px rgba(22,48,94,0.3)",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease"
              flexShrink={0}
              mb={prop(0.028)}
            >
              <IconoWhatsapp size={prop(0.05)} />
              <Text
                fontFamily="'EB Garamond', serif"
                fontWeight="600"
                fontSize={prop(0.045)}
                letterSpacing="0.04em"
                whiteSpace="nowrap"
              >
                {t("elMetodo.llamada.whatsapp")}
              </Text>
            </Flex>

            <Flex
              as="button"
              onClick={() => {
                onClose();
                onAgendar();
              }}
              align="center"
              justify="center"
              gap="9px"
              w="100%"
              maxW={prop(0.78)}
              py={prop(0.036)}
              borderRadius="full"
              // Botón FANTASMA: sin relleno, solo el filo y la letra en el
              // MISMO azul del título. Sobre el mármol pesa mucho menos que un
              // botón macizo y deja ver la piedra; y al ir del color de la
              // letra, la tarjeta entera habla en un solo tono. Al pasar por
              // encima se rellena de azul y la letra pasa a crema.
              bg="transparent"
              border={`1.5px solid ${TINTA}`}
              color={TINTA}
              cursor="pointer"
              _hover={{
                bg: TINTA,
                color: CREMA,
                borderColor: TINTA,
                transform: "translateY(-2px)",
                boxShadow: "0 10px 24px rgba(22,48,94,0.3)",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease"
              flexShrink={0}
            >
              <IconoLlamada size={prop(0.045)} />
              <Text
                fontFamily="'EB Garamond', serif"
                fontWeight="600"
                fontSize={prop(0.045)}
                letterSpacing="0.04em"
                whiteSpace="nowrap"
              >
                {t("elMetodo.llamada.cta")}
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Reveal>
    </Flex>
  );
}
