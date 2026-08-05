import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text, useBreakpointValue, type BoxProps } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { ContactModal } from "../../components/global/ContactModal";
import { BookCallModal } from "../../components/global/BookCallModal";
import { recorridoContenido, nombreEnMapa, type ContenidoSeccion } from "../../data/recorridoContenido";
import { DisciplinaBgLayer, hasDisciplinaBg, disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { DisciplinaFicha } from "../../components/metodo/DisciplinaFicha";
import { ComicPorQueExiste } from "../../components/metodo/ComicPorQueExiste";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useEnPantalla } from "../../hooks/useEnPantalla";
import { LifeLoading } from "../../components/global/LifeLoading";
import { BloqueDiferido } from "../../components/global/BloqueDiferido";
import { Breathe, Float, Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
// Para reactivar el mandala en el futuro: añade `MandalaRecorrido` (default) al import.
import { RecorridoMandalaVideo } from "../../components/global/MandalaRecorrido";
import ExperienciasReales from "../../components/welcome/ExperienciasReales";
import CreadoraCard from "../../components/welcome/CreadoraCard";
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
// Descomentar junto con el párrafo de PRECIO (más abajo, ahora comentado):
// sin él, estos tres no se usan y noUnusedLocals rompe la compilación.
// import {
//   NUM_DISCIPLINAS, PRECIO_DISCIPLINA, PRECIO_MAPA_COMPLETO,
// } from "../../components/metodo/pagoDisciplinaLink";

type ModalidadData = {
  name: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
  tagline: string;
  desc: string;
  modalDesc: string;
  contenido: ContenidoSeccion[];
};

const modalidades: ModalidadData[] = [
  {
    name: astrologiaNom,
    bg: astrologiaBg,
    txt: astrologiaTxt,
    renderIcon: (size) => <AstrologiaIcon size={{ base: size, md: size }} />,
    tagline: "Los patrones que te forman.",
    ...recorridoContenido.astrologia,
  },
  {
    name: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
    tagline: "Cómo funciona tu mente.",
    ...recorridoContenido.psicologia,
  },
  {
    name: ayurvedaNom,
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    renderIcon: (size) => <AyurvedaIcon size={{ base: size, md: size }} />,
    tagline: "Tu constitución única.",
    ...recorridoContenido.ayurveda,
  },
  {
    name: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
    tagline: "El origen de tus desequilibrios.",
    ...recorridoContenido.tcm,
  },
  {
    name: fisiologiaNom,
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    renderIcon: (size) => <FisiologiaIcon size={size} />,
    tagline: "Eres un cuerpo.",
    ...recorridoContenido.fisiologia,
  },
  {
    name: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    renderIcon: (size) => <NutricionIcon size={{ base: size, md: size }} />,
    tagline: "Cómo te reconstruyes.",
    ...recorridoContenido.nutricion,
  },
  {
    name: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    renderIcon: (size) => <CabalaIcon size={{ base: size, md: size }} />,
    tagline: "La arquitectura del alma.",
    ...recorridoContenido.cabala,
  },
  {
    name: culturaNom,
    bg: culturaBg,
    txt: culturaTxt,
    renderIcon: (size) => <CulturaIcon size={{ base: size, md: size }} />,
    tagline: "Las historias de la humanidad.",
    ...recorridoContenido.cultura,
  },
];

// Todas las fotos que deben estar cargadas antes de revelar la página (el logo
// + los fondos propios de cada disciplina). Mientras, se ve <LifeLoading/>.
const METODO_IMGS: string[] = [
  "/img/icono/life.png",
  ...(modalidades.map((m) => disciplinaBgImg(m.name)).filter(Boolean) as string[]),
];

// ── Sombras de texto del recorrido ──
// La mayoría de disciplinas usan una "luz" suave basada en su color (natural).
// Algunas concretas piden una sombra oscura para que el texto contraste mejor.
// Viven en components/global/disciplinaSombras.ts porque las páginas de
// presentación (/d/:disciplina) pintan las mismas cajas y deben leerse igual.

// Las sombras del NOMBRE, la frase y las cajas de la ficha se calculan dentro de
// DisciplinaFicha (mismo criterio: natural / negra en Fisiología-Cábala-Cultura /
// granate en Medicina China).

// ── QUÉ OBTIENES ─────────────────────────────────────────────────────────────
// Lo que se lleva quien accede a El Mapa. Va en DOS columnas a propósito: son
// siete líneas y en una sola columna el box se hacía una lista larguísima que
// obligaba a bajar; en dos entra de un vistazo y queda horizontal, del ancho del
// resto de la página. En móvil se apila a una columna, que dos no caben.
const QUE_OBTIENES: string[] = [
  "Una lectura personalizada de tu carta astral, realizada por mí.",
  "Un recorrido guiado, con un orden coherente y concreto.",
  "Materiales de lectura, ilustraciones y explicaciones paso a paso.",
  "Ejercicios prácticos para integrar lo aprendido en tu día a día.",
  "Acceso durante 1 año. Los PDF serán tuyos para siempre.",
  "Compra por disciplina. Avanza a tu ritmo, sin suscripciones ni compromisos.",
  "Posibilidad de llamadas para resolver dudas o profundizar en tu proceso.",
  "Acceso a todos los cursos e ilustraciones."
];

function QueObtienesBox() {
  return (
    <Reveal inView direction="up" distance={26} scaleFrom={0.98} duration={0.8} w="100%">
      <Flex
        direction="column"
        w="100%"
        px={{ base: 6, md: 12 }}
        py={{ base: 7, md: 10 }}
        borderRadius="2xl"
        border="1px solid rgba(255,255,255,0.28)"
        bg="rgba(255,255,255,0.07)"
        sx={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        boxShadow="0 4px 20px rgba(0,0,0,0.14), 0 0 24px rgba(180,255,245,0.10)"
        gap={{ base: 5, md: 7 }}
      >
        <Flex direction="column" align="center" gap={{ base: 3, md: 4 }}>
          <Text
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "xl", md: "3xl" }}
            letterSpacing="0.03em"
            lineHeight="1.25"
            textAlign="center"
            textShadow="0 0 12px rgba(255,255,255,0.4), 0 0 26px rgba(180,255,245,0.18)"
          >
            ¿Qué obtienes al acceder a El Mapa?
          </Text>
          {/* Rayita corta bajo el título: cierra la cabecera del box sin meter
              otra línea a todo el ancho, que competiría con el borde. */}
          <Box w={{ base: "70px", md: "90px" }} h="1px" bg="rgba(255,255,255,0.35)" />
        </Flex>

        <RevealStagger
          inView
          stagger={0.07}
          delayChildren={0.1}
          display="grid"
          gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={{ base: 3.5, md: "18px 44px" }}
        >
          {QUE_OBTIENES.map((linea) => (
            <RevealItem key={linea} direction="up" distance={14}>
              <Flex align="flex-start" gap={3}>
                <Text
                  color="white"
                  fontWeight="700"
                  fontSize={{ base: "sm", md: "md" }}
                  lineHeight="1.7"
                  flexShrink={0}
                  textShadow="0 0 10px rgba(255,255,255,0.45)"
                >
                  ✓
                </Text>
                <Text
                  color="rgba(255,255,255,0.92)"
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "sm", md: "md" }}
                  lineHeight="1.7"
                  letterSpacing="0.01em"
                  textShadow="0 0 10px rgba(255,255,255,0.2)"
                >
                  {linea}
                </Text>
              </Flex>
            </RevealItem>
          ))}
        </RevealStagger>
      </Flex>
    </Reveal>
  );
}

// ── Separador de mandala ────────────────────────────────────────────────────
// Las tres cesuras de la página (antes de «Así es El Mapa», antes de la creadora
// y después de ella) eran el MISMO bloque copiado tres veces, y la tercera ni se
// animaba. Ahora es un solo componente: el conjunto se abre desde el centro al
// asomar y el mandala del medio flota despacio, para que la pausa entre
// secciones también respire.
function SeparadorMandala({ mt, mb }: { mt?: BoxProps["mt"]; mb?: BoxProps["mb"] }) {
  return (
    <Reveal inView direction="none" scaleFrom={0.86} duration={0.9} mt={mt} mb={mb}>
      <Flex align="center" justify="center" gap={{ base: 4, md: 6 }}>
        <Box
          h="1px"
          w={{ base: "60px", md: "150px" }}
          bg="linear-gradient(to right, transparent, rgba(255,255,255,0.55))"
        />
        <Float amplitude={4} duration={6.5}>
          <Image
            src="/img/icono/life.png"
            alt=""
            h={{ base: "26px", md: "34px" }}
            objectFit="contain"
            flexShrink={0}
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.45)) drop-shadow(0 0 18px rgba(255,255,255,0.22))" }}
          />
        </Float>
        <Box
          h="1px"
          w={{ base: "60px", md: "150px" }}
          bg="linear-gradient(to left, transparent, rgba(255,255,255,0.55))"
        />
      </Flex>
    </Reveal>
  );
}

// ── Separador de línea ──────────────────────────────────────────────────────
// Cesura simple: una línea horizontal que se enciende de los extremos al centro
// al asomar. La usa el corte entre el cómic del origen y «Así es El Mapa por
// dentro»: ahí el mandala quedaba a un palmo del mandala del propio mapa (y del
// de la cabecera), y eran demasiados mandalas seguidos.
function SeparadorLinea({ mt, mb }: { mt?: BoxProps["mt"]; mb?: BoxProps["mb"] }) {
  return (
    <Reveal inView direction="none" scaleFrom={0.6} duration={0.9} mt={mt} mb={mb} w="100%">
      <Flex justify="center">
        <Box
          w="100%"
          maxW={{ base: "260px", md: "560px" }}
          h="1px"
          bg="linear-gradient(to right, transparent, rgba(255,255,255,0.6), transparent)"
          boxShadow="0 0 8px rgba(255,255,255,0.28)"
        />
      </Flex>
    </Reveal>
  );
}

type MetodoCardProps = {
  data: ModalidadData;
  /** Retraso de entrada, en segundos. Lo marca la COLUMNA, no el índice global. */
  delay: number;
  index: number;
  onClick: () => void;
};

function MetodoCard({ data, delay, index, onClick }: MetodoCardProps) {
  // Cada tarjeta con SU propio observador: no se coloca hasta que ella misma
  // asoma. Con un único observador para la cuadrícula, al llegar a la primera
  // fila arrancaban las ocho y la segunda (en móvil, las filas 2, 3 y 4) se
  // colocaba fuera de la vista.
  const enPantalla = useEnPantalla();
  const hasBg = hasDisciplinaBg(data.name);
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? true;
  // En El Mapa, "Hinduismo" se muestra como "Ayurveda" (nombreEnMapa). Medicina
  // China se abrevia en móvil por espacio.
  const displayName = data.name === "Medicina China" && isMobile ? "Med. China" : nombreEnMapa(data.name);
  // Entrada: la tarjeta sube a su sitio y se enfoca, y las de una misma fila lo
  // hacen UNA DETRÁS DE OTRA, de izquierda a derecha.
  //
  // NADA de giro ni de rebote. Antes entraba con rotate(-5deg) y una curva que
  // se pasaba de largo (el 1.5 de cubic-bezier(0.22,1.5,0.36,1)): la tarjeta
  // aterrizaba torcida y se enderezaba dando un tumbo, que es justo lo que
  // quedaba poco profesional. Ahora usa la curva del sistema Reveal —fuerte al
  // frenar, sin pasarse— y solo desplazamiento + escala + enfoque.
  //
  // La entrada va en el wrapper exterior y el hover en la tarjeta interior, para
  // que sus `transform` no se pisen.
  const entradaDelay = 0.1 + delay;
  return (
    <Box
      mt="42px"
      mb={{ base: 3, md: 5 }}
      ref={enPantalla.ref}
      opacity={enPantalla.visto ? 1 : 0}
      transform={enPantalla.visto ? "translateY(0) scale(1)" : "translateY(32px) scale(0.94)"}
      filter={enPantalla.visto ? "blur(0px)" : "blur(6px)"}
      transition={`opacity 0.4s ease ${entradaDelay}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${entradaDelay}s, filter 0.4s ease ${entradaDelay}s`}
      sx={{ willChange: "transform, opacity, filter" }}
    >
    <Box
      role="group"
      position="relative"
      pt="46px"
      pb={{ base: 5, md: 7 }}
      px={{ base: 3, md: 5 }}
      bg={hasBg ? "transparent" : data.bg}
      borderRadius="2xl"
      cursor="pointer"
      onClick={onClick}
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      transition="transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease"
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: `0 12px 32px rgba(0,0,0,0.28), 0 0 30px ${data.txt}55`,
        filter: "brightness(1.06)",
      }}
    >
      {/* Fondo propio de la disciplina — capa absoluta clipeada al borderRadius
          del card, para no recortar el icono que sobresale arriba (top:-36px). */}
      {hasBg && <DisciplinaBgLayer nom={data.name} borderRadius="2xl" />}

      {/* Icono flotante */}
      <Box
        position="absolute"
        top="-36px"
        left="50%"
        transform="translateX(-50%)"
        bg={hasBg ? "transparent" : data.bg}
        borderRadius="full"
        p="8px"
        border={`4px solid ${data.txt}`}
        boxShadow={`0 0 20px ${data.txt}bb, 0 2px 14px ${data.txt}77`}
        w="72px"
        h="72px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={2}
        overflow={hasBg ? "hidden" : undefined}
      >
        {hasBg && <DisciplinaBgLayer nom={data.name} borderRadius="full" />}
        <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
          {data.renderIcon("42px")}
        </Box>
      </Box>

      {/* Número + título */}
      <Flex mb="10px" align="baseline" justify="center" gap={2} position="relative" zIndex={1}>
        <Text
          color={data.txt}
          fontWeight="700"
          fontSize={{ base: "xl", md: "3xl", lg: "4xl" }}
          letterSpacing="0.03em"
          lineHeight="short"
          textShadow={hasBg
            ? `0 1px 3px ${data.bg}f5, 0 0 6px ${data.bg}cc, 0 2px 14px ${data.bg}88`
            : undefined}
        >
          {index}.
        </Text>
        <Text
          color={data.txt}
          fontWeight="700"
          fontSize={{ base: "xl", md: "3xl", lg: "4xl" }}
          letterSpacing="0.03em"
          lineHeight="short"
          textShadow={hasBg
            ? `0 1px 3px ${data.bg}f5, 0 0 6px ${data.bg}cc, 0 2px 14px ${data.bg}88`
            : undefined}
        >
          {displayName}
        </Text>
      </Flex>

      {/* Frase corta bajo el nombre (misma que las cajas de home) */}
      {data.tagline && (
        <Text
          position="relative"
          zIndex={1}
          mb={{ base: 2, md: 3 }}
          minH="2em"
          color={data.txt}
          fontWeight="500"
          fontSize={{ base: "sm", md: "lg" }}
          lineHeight="1.45"
          letterSpacing="0.01em"
          opacity={0.96}
          textShadow={hasBg
            ? `0 1px 3px ${data.bg}f5, 0 1px 6px ${data.bg}cc, 0 0 12px ${data.bg}dd`
            : undefined}
        >
          {data.tagline}
        </Text>
      )}

      {/* Flecha dinámica — invita a abrir la disciplina. Va en posición
          absoluta dentro del espacio inferior que ya existe, así NO cambia
          la altura de la tarjeta. Rebota de forma continua (dinámica) y se
          enciende al pasar el ratón por la tarjeta. */}
      <Box
        position="absolute"
        bottom={{ base: "8px", md: "12px" }}
        right={{ base: "12px", md: "16px" }}
        zIndex={1}
        color={data.txt}
        fontSize={{ base: "lg", md: "2xl" }}
        lineHeight="1"
        opacity={0.55}
        pointerEvents="none"
        textShadow={hasBg
          ? `0 1px 3px ${data.bg}f5, 0 0 6px ${data.bg}cc, 0 2px 14px ${data.bg}88`
          : `0 0 10px ${data.txt}66`}
        transition="opacity 0.3s ease"
        _groupHover={{ opacity: 1 }}
        sx={{
          "@keyframes metodoArrowBounce": {
            "0%, 100%": { transform: "translateX(0)" },
            "50%": { transform: "translateX(5px)" },
          },
          animation: "metodoArrowBounce 1.8s ease-in-out infinite",
        }}
      >
        →
      </Box>
    </Box>
    </Box>
  );
}

export default function ElMetodo() {
  const navigate = useNavigate();
  // Las entradas de esta página las hace el sistema Reveal (framer-motion), el
  // mismo del recorrido de astrología. Las ocho tarjetas son la excepción:
  // conservan su entrada en CSS y cada una se observa a sí misma (ver MetodoCard).
  // Aquí solo hace falta saber cuántas columnas hay, para el orden de la cascada.
  const esMovil = useBreakpointValue({ base: true, md: false }) ?? true;
  const [dudasOpen, setDudasOpen] = useState(false);
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ModalidadData | null>(null);
  const [mounted, setMounted] = useState(false);
  const imagenesListas = usePrecargarImagenes(METODO_IMGS);
  const [tiempoMin, setTiempoMin] = useState(false);
  // La página no se revela hasta que las fotos estén cargadas Y haya pasado un
  // tiempo mínimo (para que se vea la animación de carga aunque las fotos vengan
  // de caché). Mientras, se muestra <LifeLoading/>.
  const listo = imagenesListas && tiempoMin;

  // Botón principal "Acceder": si ya hay sesión, directo a /home; si no, al
  // registro, que al terminar devuelve a /home.
  const handleAcceder = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      navigate("/signIn?next=/home");
      return;
    }
    navigate("/home");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setTiempoMin(true), 550);
    return () => clearTimeout(t);
  }, []);

  // Cuando la página está lista, disparamos la entrada de la primera pantalla
  // (mandala + cabecera + tarjetas). Doble requestAnimationFrame: el contenido
  // se pinta primero OCULTO y, al frame siguiente, cambia a visible → la
  // transición CSS se ejecuta siempre (si lo hiciéramos en el mismo frame, el
  // navegador pintaría ya el estado final y no se vería animación).
  useEffect(() => {
    if (!listo) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setMounted(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [listo]);

  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedCard]);

  // Mientras cargan las fotos: pantalla de carga con el mandala animado.
  if (!listo) return <LifeLoading variant="auto" />;

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      <Box flex="1">
      {/* ── MANDALA SEPARADOR ── */}
      {/* Wrapper con flotación + latido perpetuos; la imagen hace la entrada
          épica (surge girando desde muy pequeña y se enfoca). */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Box
          sx={{
            "@keyframes mandalaFloat": {
              "0%, 100%": { transform: "translateY(0) scale(1)" },
              "50%": { transform: "translateY(-9px) scale(1.03)" },
            },
            animation: "mandalaFloat 5.5s ease-in-out infinite",
          }}
        >
          <Image
            src="/img/icono/life.png"
            alt=""
            h={{ base: "63px", md: "86px" }}
            objectFit="contain"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "scale(1) rotate(0deg)" : "scale(0.25) rotate(-45deg)",
              // glow (drop-shadow) siempre + blur solo durante la entrada.
              filter:
                "drop-shadow(0 0 10px rgba(255,255,255,0.59)) drop-shadow(0 0 23px rgba(255,255,255,0.32)) drop-shadow(0 0 47px rgba(180,255,245,0.24))" +
                (mounted ? "" : " blur(6px)"),
              transition: "opacity 1.1s ease, transform 1.3s cubic-bezier(0.22,1.5,0.36,1), filter 1s ease",
            }}
          />
        </Box>
      </Flex>

      {/* ── CABECERA ── */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 7, md: 9 }}
        mb="10px"
        gap={{ base: 4, md: 5 }}
      >
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.08em"
          lineHeight="1.1"
          textShadow="0 0 16px rgba(255,255,255,0.64), 0 0 34px rgba(255,255,255,0.41), 0 0 63px rgba(180,255,245,0.34)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(22px)"}
          transition="opacity 0.85s ease, transform 0.85s ease"
        >
          EL MAPA
        </Text>
        <Text
          color="rgba(255,255,255,0.85)"
          fontSize={{ base: "xs", md: "sm" }}
          fontStyle="italic"
          fontWeight="400"
          letterSpacing="0.05em"
          textShadow="0 0 9px rgba(255,255,255,0.41), 0 0 20px rgba(255,255,255,0.22)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(14px)"}
          transition="opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s"
        >
          de Life as a Privilege
        </Text>
      </Flex>

      {/* ── ¿POR QUÉ EXISTE LIFE AS A PRIVILEGE? ──
          Primero las frases que explican qué es El Mapa, centradas sobre el
          turquesa; DEBAJO, el cómic del origen a todo el ancho (panel
          rectangular: acuarela a la izquierda, texto a la derecha).
          Antes iban al lado del cómic, en dos columnas: el cómic quedaba
          reducido a un cuadradito del 46% y la historia —que es lo importante de
          este bloque— competía con el texto en vez de tener su sitio. */}
      <Box px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 16, md: 24 }}>
        <Flex
          maxW="1200px"
          mx="auto"
          direction="column"
          align="center"
          gap={{ base: 10, md: 14 }}
        >
          {/* Las dos frases que explican El Mapa, centradas encima del panel.
              El título «¿Por qué existe Life as a Privilege?» NO va aquí: es el
              título del cómic y vive dentro del propio panel.
              Con un ancho tope para que las líneas no se hagan larguísimas de
              lado a lado de la pantalla. */}
          <Flex
            direction="column"
            align="center"
            gap={{ base: 4, md: 5 }}
            maxW="900px"
            textAlign="center"
          >
            <Reveal inView direction="up" distance={16} duration={0.8} delay={0.1}>
              <Text
                color="white"
                fontSize={{ base: "md", md: "xl" }}
                fontWeight="700"
                fontStyle="italic"
                lineHeight="1.8"
                letterSpacing="0.015em"
                textShadow="0 0 11px rgba(255,255,255,0.38), 0 0 25px rgba(255,255,255,0.19)"
              >
                Ocho disciplinas. Un orden. Un propósito: entenderte.
              </Text>
            </Reveal>

            <Reveal inView direction="up" distance={16} duration={0.8} delay={0.22}>
              <Text
                color="white"
                fontSize={{ base: "sm", md: "lg" }}
                lineHeight="1.9"
                letterSpacing="0.015em"
                textShadow="0 0 11px rgba(255,255,255,0.38), 0 0 25px rgba(255,255,255,0.19)"
              >
                No son ocho cursos independientes. Es una exploración guiada de ti mismo a través de ocho perspectivas diferentes para encontrar la raíz de tus patrones y comprenderte.
              </Text>
            </Reveal>
          </Flex>

          {/* El cómic del origen, a todo el ancho del bloque. */}
          <Reveal inView direction="up" distance={26} scaleFrom={0.98} duration={0.8} w="100%">
            <ComicPorQueExiste />
          </Reveal>
        </Flex>
      </Box>

      {/* ── SEPARADOR + TÍTULO DEL MANDALA ──
          Las frases van con su bloque: este título encabeza el mandala de las
          ocho disciplinas (que es «El Mapa por dentro»), y la frase «Cada
          disciplina observa una parte distinta…» bajó con las fichas. */}
      <Flex
        direction="column"
        align="center"
        px={{ base: 5, md: 10, lg: 16 }}
        // Sin `pt` propio: el aire de arriba lo pone el `mt` del separador, que
        // es EL MISMO que su `mb`. Así la línea queda a la misma distancia del
        // cómic que del título, y para cambiar el hueco se toca un solo sitio
        // (si el aire viniera de dos paddings distintos, nunca cuadran).
      >
        {/* En px y no en tokens de Chakra: 17 no existe en la escala de
            espaciado, y un token que no existe NO cae en 68px sino en 17px
            (se cuela como valor crudo). Con px se ve lo que mide. */}
        <SeparadorLinea
          mt={{ base: "48px", md: "67px" }}
          mb={{ base: "48px", md: "67px" }}
        />

        <Text
          color="white"
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "3xl", md: "5xl" }}
          letterSpacing="0.04em"
          lineHeight="1.2"
          textAlign="center"
          textShadow="0 0 12px rgba(255,255,255,0.4), 0 0 26px rgba(180,255,245,0.18)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(14px)"}
          transition="opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s"
        >
          Así es El Mapa por dentro
        </Text>
      </Flex>
      

      {/* ── LAS 8 DISCIPLINAS (mandala + vídeo) ──
          Va lo primero tras la cabecera: a la izquierda el mandala interactivo
          con las ocho, a la derecha el box de la disciplina seleccionada con su
          vídeo y su precio. Es el resumen de qué se compra, así que se enseña
          antes que las fichas de detalle.
          Montaje diferido: los círculos del mandala hacen su «pop» justo cuando
          llegas a ellos, y no antes en una zona que no ves. */}
      <Box
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 12, md: 16 }}
        // Poco `pb`: el separador de abajo tiene que quedar cerca del box de la
        // disciplina, no a media pantalla. El aire entre los dos lo reparten este
        // `pb` y el `pt` del separador, y nada más.
        pb={{ base: 4, md: 6 }}
      >
        <Box maxW="1200px" mx="auto">
          <BloqueDiferido minH={{ base: "760px", md: "560px" }}>
            <Reveal direction="up" distance={26} scaleFrom={0.98} duration={0.8}>
              <RecorridoMandalaVideo />
            </Reveal>
          </BloqueDiferido>
        </Box>
      </Box>

      {/* ── QUÉ RECIBIRÁS ── */}
      {/* Sin `pt` propio: el hueco con el bloque de arriba lo pone el `pt` del
          separador, en un solo sitio, para poder ajustarlo sin sumar tres
          paddings distintos. */}
      <Box w="100%" px={{ base: 5, md: 10, lg: 16 }}>
        <Box maxW="1200px" mx="auto">
          {/* Separador de mandala + la frase que introduce las fichas de
              disciplina. Lleva el separador con el mandala en medio (no la línea
              fina): es el que marca los cortes de sección en esta página.
              La frase entra al asomar (inView) y no con `mounted`: este bloque
              está muy por debajo del pliegue y con `mounted` la animación pasaba
              mientras se miraba la cabecera. */}
          <Flex
            direction="column"
            align="center"
            pt={{ base: 6, md: 8 }}
            gap={{ base: 5, md: 7 }}
          >
            <SeparadorMandala />

            <Reveal inView direction="up" distance={12} duration={0.8} delay={0.15}>
              <Text
                color="rgba(255,255,255,0.9)"
                fontSize={{ base: "sm", md: "lg" }}
                fontStyle="italic"
                textAlign="center"
                letterSpacing="0.02em"
                lineHeight="1.6"
                maxW={{ base: "100%", md: "640px" }}
                textShadow="0 0 10px rgba(255,255,255,0.32), 0 0 22px rgba(255,255,255,0.16)"
              >
                Cada disciplina observa una parte distinta del ser humano.
              </Text>
            </Reveal>
          </Flex>

          {/* Mandala interactivo — resumen visual de la estructura del recorrido.
              Retirado de momento: los carruseles de abajo ya enseñan las capturas
              de cada disciplina sin necesidad de abrir el popup. Se deja comentado
              por si en el futuro se le quiere dar uso (p.ej. como cabecera-resumen).
          <Box mt={{ base: 2, md: 4 }}>
            <MandalaRecorrido />
          </Box>
          */}

        </Box>

        {/* ── LOS 8 BOXES DE DETALLE ──
            Las fichas de cada disciplina, que abren el modal con «Qué incluye».
            Van aquí abajo, tras el mandala: quien ya se ha hecho una idea con él
            baja a mirar el detalle.
            FUERA del contenedor de 1200px a propósito: estas tarjetas van a todo
            el ancho de la página (solo con el px del margen), que es el ancho que
            tenían antes de bajarlas aquí. Si se meten dentro, se estrechan.
            La cascada NO arranca al cargar la página: espera a que la cuadrícula
            asome (useEnPantalla). Antes iba con `mounted` y, como las tarjetas
            quedan por debajo del pliegue, entraban con la pantalla en la
            cabecera: al bajar te las encontrabas ya puestas y no veías la
            animación. */}
        <Box mt={{ base: 12, md: 20 }}>
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
            gap={{ base: 4, md: 18 }}
          >
            {modalidades.map((m, i) => (
              <MetodoCard
                key={m.name}
                data={m}
                // La columna dentro de su fila (2 columnas en móvil, 4 en
                // escritorio) con 0.15s de hueco: cada fila entra de izquierda a
                // derecha cuando le toca, sin arrastrar el retraso de las de arriba.
                delay={(i % (esMovil ? 2 : 4)) * 0.15}
                index={i + 1}
                onClick={() => setSelectedCard(m)}
              />
            ))}
          </Grid>
        </Box>

        <Box maxW="1200px" mx="auto">

          {/* ── QUÉ OBTIENES ──
              Cierra la parte comercial (las ocho fichas de arriba) justo antes de
              la tarjeta de María: primero qué te llevas, después quién te lo da. */}
          <Box mt={{ base: 12, md: 16 }}>
            <QueObtienesBox />
          </Box>

          {/* ── PRECIO ──
              El importe vive dentro del box de cada disciplina (abajo a la
              derecha, al lado del botón). Aquí solo queda la letra pequeña:
              cómo se paga y cuánto es el Mapa entero. Las cifras salen de
              pagoDisciplinaLink, el mismo sitio del que bebe el box de pago,
              así que web y cobro no pueden desincronizarse. */}
          {/* <Text
            ref={precioReveal.ref}
            mt={{ base: 6, md: 8 }}
            textAlign="center"
            color="rgba(255,255,255,0.82)"
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            fontSize={{ base: "sm", md: "md" }}
            lineHeight="1.75"
            textShadow="0 0 10px rgba(255,255,255,0.22)"
            opacity={precioReveal.visible ? 1 : 0}
            transform={precioReveal.visible ? "translateY(0)" : "translateY(18px)"}
            transition="opacity 0.8s ease, transform 0.8s ease"
          >
            No hay suscripción ni cuota mensual: pagas {PRECIO_DISCIPLINA} por
            disciplina cuando llegas a ella, en el orden del Mapa, y se queda
            tuya para siempre. Las {NUM_DISCIPLINAS} completas son{" "}
            {PRECIO_MAPA_COMPLETO}, repartidos a tu ritmo.
          </Text> */}

          {/* ── LA CREADORA ── */}
          {/* Separador con mandala en medio. La tarjeta de la creadora (debajo)
              aporta su propio pt (40px móvil / 56px escritorio); compensamos con
              mt igual y mb=0 para que el separador quede JUSTO en medio de los
              dos paneles visibles. */}
          <SeparadorMandala mt={{ base: 10, md: 14 }} mb={0} />

          {/* Tarjeta de la creadora (componente compartido con Welcome) */}
          <CreadoraCard />

          {/* ── Separador con mandala en medio ── */}
          {/* Aquí había un tercer separador de mandala. Fuera: era el tercero en
              muy poco recorrido y «Experiencias reales» ya entra con su propio
              título con icono, así que no hacía falta anunciarlo. El hueco que
              aportaba lo pone ahora el pt del bloque de testimonios. */}

          {/* ── EXPERIENCIAS REALES (testimonios) ── */}
          <Box pt={{ base: 20, md: 28 }}>
            <ExperienciasReales />
          </Box>

          {/* Separador (mismo estilo que el de las disciplinas) */}
          {/* <Flex justify="center" mt={{ base: 16, md: 20 }}>
            <Box
              w="100%"
              maxW="500px"
              h="1px"
              bg="rgba(255,255,255,0.15)"
              opacity={recibirasAccesoReveal.visible ? 1 : 0}
              transform={recibirasAccesoReveal.visible ? "scaleX(1)" : "scaleX(0.2)"}
              transition="opacity 0.8s ease, transform 0.8s ease"
            />
          </Flex>

          {/* Bloque horizontal de acceso 
          <Flex
            ref={recibirasAccesoReveal.ref}
            direction="column"
            align="center"
            gap={{ base: 8, md: 10 }}
            mt={{ base: 16, md: 24 }}
            opacity={recibirasAccesoReveal.visible ? 1 : 0}
            transform={recibirasAccesoReveal.visible ? "translateY(0)" : "translateY(28px)"}
            transition="opacity 0.8s ease, transform 0.8s ease"
          >
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "2xl", md: "4xl" }}
              letterSpacing="0.03em"
              lineHeight="1.2"
              textAlign="center"
              textShadow="0 0 12px rgba(255,255,255,0.38), 0 0 26px rgba(180,255,245,0.16)"
            >
              Empieza cuando quieras
            </Text>

            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 5, md: 7 }}
              w="100%"
              maxW="820px"
              align="stretch"
            >
              {[
                {
                  nombre: "Disciplina individual",
                  precio: "30 €",
                  desc: "Acceso completo a una disciplina.",
                },
                {
                  nombre: "Sesión individual",
                  precio: "20 € / hora",
                  desc: "Acompañamiento opcional.",
                },
              ].map((col, i) => (
                <Flex
                  key={i}
                  flex={1}
                  direction="column"
                  align="center"
                  textAlign="center"
                  gap={3}
                  p={{ base: 8, md: 10 }}
                  borderRadius="2xl"
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(255,255,255,0.14)"
                  sx={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
                  boxShadow="0 4px 18px rgba(0,0,0,0.12)"
                  transition="box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease, transform 0.3s ease"
                  _hover={{
                    bg: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.3)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2), 0 0 22px rgba(180,255,245,0.16)",
                    transform: "translateY(-6px)",
                  }}
                >
                  <Text
                    color="rgba(255,255,255,0.9)"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="600"
                    fontSize={{ base: "lg", md: "xl" }}
                    letterSpacing="0.04em"
                    textShadow="0 0 8px rgba(255,255,255,0.2)"
                  >
                    {col.nombre}
                  </Text>
                  <Text
                    color="white"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "3xl", md: "4xl" }}
                    letterSpacing="0.02em"
                    lineHeight="1.1"
                    textShadow="0 0 14px rgba(255,255,255,0.4), 0 0 28px rgba(180,255,245,0.18)"
                  >
                    {col.precio}
                  </Text>
                  <Text
                    color="rgba(255,255,255,0.8)"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="400"
                    fontSize={{ base: "sm", md: "md" }}
                    lineHeight="1.7"
                  >
                    {col.desc}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Flex> */}
        </Box>
      </Box>

      {/* ── Conocer a la creadora ── */}
      {/* <Flex
        justify="center"
        align="center"
        gap={{ base: 2, md: 3 }}
        pt={{ base: 10, md: 12 }}
        pb={{ base: 4, md: 6 }}
        px={{ base: 5, md: 10, lg: 16 }}
      >
        <Box
          h="1px"
          w={{ base: "24px", md: "44px" }}
          bg="linear-gradient(to right, transparent, rgba(255,255,255,0.6))"
          boxShadow="0 0 6px rgba(255,255,255,0.4)"
        />
        <Flex
          as="button"
          onClick={() => navigate("/quienSoy")}
          align="center"
          gap={2}
          color="white"
          fontFamily="'EB Garamond', serif"
          fontWeight="600"
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="0.16em"
          textTransform="uppercase"
          px={{ base: 5, md: 7 }}
          py={{ base: "7px", md: "9px" }}
          borderRadius="full"
          border="1px solid rgba(255,255,255,0.5)"
          bg="rgba(255,255,255,0.06)"
          cursor="pointer"
          boxShadow="0 0 12px rgba(255,255,255,0.28), 0 0 26px rgba(255,255,255,0.14), 0 2px 10px rgba(0,0,0,0.15)"
          textShadow="0 0 8px rgba(255,255,255,0.38), 0 0 18px rgba(255,255,255,0.21)"
          _hover={{
            bg: "rgba(255,255,255,0.16)",
            borderColor: "rgba(255,255,255,0.85)",
            boxShadow: "0 0 20px rgba(255,255,255,0.45), 0 0 42px rgba(180,255,245,0.28), 0 4px 14px rgba(0,0,0,0.2)",
            transform: "translateY(-1px)",
          }}
          transition="all 0.25s ease"
        >
          Conocer a la creadora
          <Box as="span" fontSize={{ base: "sm", md: "md" }} style={{ textShadow: "0 0 8px rgba(255,255,255,0.45), 0 0 18px rgba(255,255,255,0.22)" }}>
            →
          </Box>
        </Flex>
        <Box
          h="1px"
          w={{ base: "24px", md: "44px" }}
          bg="linear-gradient(to left, transparent, rgba(255,255,255,0.6))"
          boxShadow="0 0 6px rgba(255,255,255,0.4)"
        />
      </Flex> */}

      {/* ── BOTÓN EMPEZAR + TENGO DUDAS ── */}
      <Flex
        direction="column"
        align="center"
        pt={{ base: 16, md: 24 }}
        pb={{ base: 24, md: 32 }}
        gap={{ base: 12, md: 16 }}
      >
        {/* ACCEDER (botón grande con mandala).
            Única llamada a la acción de la página: lleva al registro (o directo
            a /home si ya hay sesión). Respira en bucle para que el ojo vuelva. */}
        <Reveal inView direction="up" distance={24} duration={0.7} display="flex" justifyContent="center">
        <Breathe scale={0.014} duration={5.5} display="flex" justifyContent="center">
        <Flex
          as="button"
          onClick={handleAcceder}
          align="center"
          justify="center"
          gap={{ base: 3, md: 6 }}
          px={{ base: 5, md: 24 }}
          py={{ base: "16px", md: "22px" }}
          // En móvil manda ESTE botón: ocupa el ancho que le dejan los márgenes
          // (nunca de filo a filo) y los secundarios de abajo van más estrechos,
          // así la jerarquía se ve de un vistazo sin leer nada.
          w={{ base: "min(88vw, 420px)", md: "auto" }}
          minW={{ base: "auto", md: "520px" }}
          flexShrink={0}
          borderRadius="full"
          border="1.5px solid rgba(255,255,255,0.65)"
          bg="rgba(255,255,255,0.10)"
          cursor="pointer"
          boxShadow="0 0 22px rgba(255,255,255,0.4), 0 0 50px rgba(255,255,255,0.22), 0 0 90px rgba(180,255,245,0.25), 0 6px 20px rgba(0,0,0,0.2)"
          _hover={{
            bg: "rgba(255,255,255,0.2)",
            borderColor: "white",
            boxShadow: "0 0 34px rgba(255,255,255,0.6), 0 0 70px rgba(180,255,245,0.45), 0 8px 24px rgba(0,0,0,0.25)",
          }}
          transition="background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
        >
          <Image
            src="/img/icono/life.png"
            alt=""
            h={{ base: "30px", md: "44px" }}
            objectFit="contain"
            flexShrink={0}
            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.56)) drop-shadow(0 0 24px rgba(255,255,255,0.3))" }}
          />
          <Text
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "17px", md: "2xl" }}
            letterSpacing={{ base: "0.04em", md: "0.18em" }}
            textTransform="uppercase"
            textAlign="center"
            whiteSpace="nowrap"
            textShadow="0 0 14px rgba(255,255,255,0.52), 0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(180,255,245,0.22)"
          >
            Acceder a El Mapa
          </Text>
        </Flex>
        </Breathe>
        </Reveal>

        {/* Agendar llamada + Tengo dudas (botones secundarios).
            Cierran la cascada: entran los últimos, después del botón grande. */}
        <Reveal inView direction="up" distance={20} delay={0.3} duration={0.65} display="flex" justifyContent="center">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="center"
          gap={{ base: 4, md: 6 }}
        >
          {/* Agendar llamada gratuita */}
          <Flex
            as="button"
            onClick={() => setBookCallOpen(true)}
            align="center"
            justify="center"
            gap={2}
            px={{ base: 4, md: 7 }}
            py={{ base: "7px", md: "9px" }}
            // Más estrecho que el de ACCEDER, a propósito (ver arriba).
            w={{ base: "min(76vw, 330px)", md: "auto" }}
            borderRadius="full"
            border="1px solid rgba(255,255,255,0.5)"
            bg="rgba(255,255,255,0.06)"
            cursor="pointer"
            boxShadow="0 0 12px rgba(255,255,255,0.25), 0 0 26px rgba(255,255,255,0.12)"
            _hover={{
              bg: "rgba(255,255,255,0.16)",
              borderColor: "rgba(255,255,255,0.85)",
              boxShadow: "0 0 20px rgba(255,255,255,0.45), 0 0 42px rgba(180,255,245,0.25)",
            }}
            transition="all 0.25s ease"
          >
            <Box
              as="svg"
              viewBox="0 0 24 24"
              w={{ base: "14px", md: "16px" }}
              h={{ base: "14px", md: "16px" }}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              flexShrink={0}
              style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.38))" }}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </Box>
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="500"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.04em"
              fontStyle="italic"
              textShadow="0 0 8px rgba(255,255,255,0.34), 0 0 18px rgba(255,255,255,0.17)"
            >
              Agendar llamada gratuita (20 min)
            </Text>
          </Flex>

          {/* Tengo dudas (botón pequeño secundario) */}
          <Flex
            as="button"
            onClick={() => setDudasOpen(true)}
            align="center"
            justify="center"
            gap={2}
            px={{ base: 4, md: 7 }}
            py={{ base: "7px", md: "9px" }}
            // El más pequeño de los tres: es la última salida, no el camino.
            w={{ base: "min(58vw, 260px)", md: "auto" }}
            borderRadius="full"
            border="1px solid rgba(255,255,255,0.5)"
            bg="rgba(255,255,255,0.06)"
            cursor="pointer"
            boxShadow="0 0 12px rgba(255,255,255,0.25), 0 0 26px rgba(255,255,255,0.12)"
            _hover={{
              bg: "rgba(255,255,255,0.16)",
              borderColor: "rgba(255,255,255,0.85)",
              boxShadow: "0 0 20px rgba(255,255,255,0.45), 0 0 42px rgba(180,255,245,0.25)",
            }}
            transition="all 0.25s ease"
          >
            <Box
              as="svg"
              viewBox="0 0 24 24"
              w={{ base: "14px", md: "16px" }}
              h={{ base: "14px", md: "16px" }}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              flexShrink={0}
              style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.38))" }}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </Box>
            <Text
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="500"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.04em"
              fontStyle="italic"
              textShadow="0 0 8px rgba(255,255,255,0.34), 0 0 18px rgba(255,255,255,0.17)"
            >
              Tengo dudas
            </Text>
          </Flex>
        </Flex>
        </Reveal>
      </Flex>
      </Box>

      {/* ── MODAL MODALIDAD ── */}
      {selectedCard && (
        <Box
          position="fixed"
          inset={0}
          zIndex={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0,0,0,0.85)"
          sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          onClick={() => setSelectedCard(null)}
          px={{ base: 5, md: 10 }}
        >
          {/* La ficha ya no aparece de golpe: sube un poco, se enfoca y crece
              desde el 96%. La entrada va en este envoltorio y no en la caja, para
              que su `transform` no pise al del contenido de dentro. */}
          <Reveal
            direction="up"
            distance={22}
            scaleFrom={0.96}
            blur
            duration={0.5}
            maxW={{ base: "100%", md: "700px" }}
            w="100%"
          >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            bg={hasDisciplinaBg(selectedCard.name) ? "transparent" : selectedCard.bg + "f0"}
            border={`1.5px solid ${selectedCard.txt}66`}
            sx={{ backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)" }}
            borderRadius="3xl"
            boxShadow={`0 0 0 1px ${selectedCard.txt}55, 0 0 45px ${selectedCard.txt}66, 0 0 90px ${selectedCard.txt}33, 0 22px 70px rgba(0,0,0,0.6)`}
            w="100%"
            h={{ base: "85dvh", md: "82vh" }}
            position="relative"
            overflow="hidden"
          >
            {/* Fondo de la disciplina NÍTIDO (sin blur): la imagen tal cual. El
                único desenfoque es el de los boxes de dentro ("Qué incluye"). */}
            {hasDisciplinaBg(selectedCard.name) && <DisciplinaBgLayer nom={selectedCard.name} borderRadius="3xl" />}
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

            {/* Contenido scrollable interno — el modal exterior se queda fijo
                (con bg + X). Aquí dentro se hace scroll si el contenido excede
                el alto del modal. Así nunca se corta contra el viewport. */}
            <Box
              p={{ base: 7, md: 14 }}
              display="flex"
              flexDirection="column"
              gap={{ base: 6, md: 8 }}
              position="relative"
              zIndex={1}
              h="100%"
              overflowY="auto"
              sx={{
                scrollbarWidth: "thin",
                scrollbarColor: `${selectedCard.txt}55 transparent`,
                "&::-webkit-scrollbar": { width: "6px", background: "transparent" },
                "&::-webkit-scrollbar-track": { background: "transparent" },
                "&::-webkit-scrollbar-thumb": { background: `${selectedCard.txt}55`, borderRadius: "3px" },
              }}
            >

            {/* La ficha (icono + nombre + frase, «Qué incluye» y sus cajas) vive
                en components/metodo/DisciplinaFicha.tsx: es la MISMA que se
                despliega en la presentacion publica de la disciplina
                (/d/:disciplina), donde no hay popup. */}
            <DisciplinaFicha
              nom={selectedCard.name}
              bg={selectedCard.bg}
              txt={selectedCard.txt}
              desc={selectedCard.desc}
              contenido={selectedCard.contenido}
              renderIcon={selectedCard.renderIcon}
            />
            </Box>
          </Box>
          </Reveal>
        </Box>
      )}

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

      <BookCallModal
        isOpen={bookCallOpen}
        onClose={() => setBookCallOpen(false)}
      />

      <SiteFooter />
    </Box>
  );
}
