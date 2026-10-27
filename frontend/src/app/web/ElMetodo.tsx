import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text, useBreakpointValue, type BoxProps } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { ContactModal } from "../../components/global/ContactModal";
import { BookCallModal } from "../../components/global/BookCallModal";
import { type DisciplinaClave } from "../../data/recorridoContenido";
import { useRecorridoContenido } from "../../data/useRecorridoContenido";
import { useT, type ClaveTexto } from "../../i18n";
import { DisciplinaBgLayer, hasDisciplinaBg, disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { DisciplinaFicha } from "../../components/metodo/DisciplinaFicha";
// Aparcado con su bloque, más abajo: import { ComicPorQueExiste } from "../../components/metodo/ComicPorQueExiste";
import { precargarImagenes, usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { LifeLoading } from "../../components/global/LifeLoading";
import { LetrasVivas } from "../../components/global/LetrasVivas";
import { BloqueDiferido } from "../../components/global/BloqueDiferido";
import { Breathe, Float, Reveal } from "../../components/global/Reveal";
// Para reactivar el mandala en el futuro: añade `MandalaRecorrido` (default) al import.
import { RecorridoMandalaVideo } from "../../components/global/MandalaRecorrido";
import ExperienciasReales from "../../components/welcome/ExperienciasReales";
import CreadoraCard from "../../components/welcome/CreadoraCard";
import BotonContactame from "../../components/global/BotonContactame";
import { TestDisciplinaModal } from "../../components/metodo/TestDisciplina";
import {
  FaqBloque,
  PorDondeEmpiezoBloque,
  PrecioBloque,
  PruebasBloque,
  ComoFuncionaBloque,
} from "../../components/metodo/elMetodoVenta";
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

/**
 * Cuánto se agranda TODA la página (1 = tamaño original).
 * Es el único sitio donde se toca: subirlo a 1.02 la deja un 2% más grande, y
 * las tarjetas de disciplina se quedan igual solas, porque su zoom se calcula
 * a partir de este.
 */
const ZOOM_PAGINA = 1.01;

/**
 * Parte VISUAL de cada disciplina: lo que no depende del idioma (colores, icono,
 * nombre interno) más las CLAVES de su texto.
 *
 * El texto no se guarda aquí a propósito: este array se calcula una sola vez al
 * importar el módulo, así que una cadena ya traducida se quedaría congelada en
 * el idioma con el que arrancó la página. El contenido se pide al pintar, con
 * `useRecorridoContenido()`, y el lema con `t(m.lemaKey)`.
 */
type ModalidadData = {
  clave: DisciplinaClave;
  name: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
  lemaKey: ClaveTexto;
};

const modalidades: ModalidadData[] = [
  {
    clave: "astrologia",
    name: astrologiaNom,
    bg: astrologiaBg,
    txt: astrologiaTxt,
    renderIcon: (size) => <AstrologiaIcon size={{ base: size, md: size }} />,
    lemaKey: "welcome.lema.astrologia",
  },
  {
    clave: "psicologia",
    name: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
    lemaKey: "welcome.lema.psicologia",
  },
  {
    clave: "fisiologia",
    name: fisiologiaNom,
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    renderIcon: (size) => <FisiologiaIcon size={size} />,
    lemaKey: "welcome.lema.fisiologia",
  },
  {
    clave: "nutricion",
    name: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    renderIcon: (size) => <NutricionIcon size={{ base: size, md: size }} />,
    lemaKey: "welcome.lema.nutricion",
  },
  {
    clave: "ayurveda",
    name: ayurvedaNom,
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    renderIcon: (size) => <AyurvedaIcon size={{ base: size, md: size }} />,
    lemaKey: "welcome.lema.hinduismo",
  },
  {
    clave: "tcm",
    name: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
    lemaKey: "welcome.lema.medicinaChina",
  },
  {
    clave: "cabala",
    name: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    renderIcon: (size) => <CabalaIcon size={{ base: size, md: size }} />,
    lemaKey: "welcome.lema.cabala",
  },
  {
    clave: "cultura",
    name: culturaNom,
    bg: culturaBg,
    txt: culturaTxt,
    renderIcon: (size) => <CulturaIcon size={{ base: size, md: size }} />,
    lemaKey: "welcome.lema.cultura",
  },
];

// Las fotos que deben estar cargadas antes de revelar la página: solo el logo de
// la cabecera, que es la única de la primera pantalla. Mientras, se ve
// <LifeLoading/>.
//
// Aquí estaban también los siete fondos de disciplina, y eran 542 kB de los
// 1,3 MB que había que esperar: con cobertura mala, 2-3 s de mandala girando por
// unas acuarelas que no se ven hasta 4.400 px más abajo. Ahora se piden aparte
// (METODO_IMGS_DIFERIDAS), sin bloquear la entrada.
const METODO_IMGS: string[] = ["/img/icono/life.webp"];

// Los fondos de las ocho tarjetas. Se piden EN CUANTO la página ya se ve, no
// antes: media página de scroll por delante da tiempo de sobra a que lleguen, y
// así las tarjetas siguen entrando con su acuarela puesta.
//
// Si alguien baja a toda prisa con mala cobertura y una tarjeta se adelanta a su
// foto, no queda un hueco blanco: DisciplinaBgLayer pinta debajo el color sólido
// de la disciplina (su `fallbackBg`) y la acuarela entra encima.
const METODO_IMGS_DIFERIDAS: string[] = modalidades
  .map((m) => disciplinaBgImg(m.name))
  .filter(Boolean) as string[];

// ── Sombras de texto del recorrido ──
// La mayoría de disciplinas usan una "luz" suave basada en su color (natural).
// Algunas concretas piden una sombra oscura para que el texto contraste mejor.
// Viven en components/global/disciplinaSombras.ts porque las páginas de
// presentación (/d/:disciplina) pintan las mismas cajas y deben leerse igual.

// Las sombras del NOMBRE, la frase y las cajas de la ficha se calculan dentro de
// DisciplinaFicha (mismo criterio: natural / negra en Fisiología-Cábala-Cultura /
// granate en Medicina China).

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
            src="/img/icono/life.webp"
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

export default function ElMetodo() {
  const navigate = useNavigate();
  const t = useT();
  // El contenido de las ocho disciplinas, ya en el idioma activo.
  const contenido = useRecorridoContenido();
  // Las entradas de esta página las hace el sistema Reveal (framer-motion), el
  // mismo del recorrido de astrología. Las ocho tarjetas son la excepción:
  // conservan su entrada en CSS y cada una se observa a sí misma (ver MetodoCard).
  // Aquí solo hace falta saber cuántas columnas hay, para el orden de la cascada.
  const esMovil = useBreakpointValue({ base: true, md: false }) ?? true;
  const [dudasOpen, setDudasOpen] = useState(false);
  const [bookCallOpen, setBookCallOpen] = useState(false);
  // El test de «encuentra tu disciplina»: lo abre el botón grande del hero. No
  // guarda nada en ningún sitio.
  const [testOpen, setTestOpen] = useState(false);
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

  // ── Los fondos de las tarjetas, en cuanto la página ya se ve ──
  // Fuera del camino crítico: no retienen la pantalla de carga, pero se piden
  // enseguida para que estén en caché mucho antes de que la primera tarjeta
  // asome (están media página más abajo). Un respiro antes de pedirlos para no
  // competir con la entrada de la primera pantalla, que es lo que se está
  // mirando en ese momento.
  useEffect(() => {
    if (!listo) return;
    const id = setTimeout(() => { void precargarImagenes(METODO_IMGS_DIFERIDAS); }, 400);
    return () => clearTimeout(id);
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
      // Hueco para que el botón flotante de la llamada no se coma la última
      // línea del footer. Es turquesa sobre turquesa, así que no se nota.
      pb={{ base: "84px", md: "56px" }}
    >
      <SiteHeader variant="auto" />

      {/* Toda la página, un 1% más grande. Se hace con `zoom` y no tocando
          cincuenta tamaños de letra: el zoom SÍ afecta al layout (a diferencia
          de transform: scale), así que los huecos, los anchos y los saltos de
          línea crecen igual y no se descuadra nada.
          Va aquí dentro y no en el <Box> de fuera para que el header y el
          footer —que son compartidos con el resto de la web— se queden como
          están. Las 8 tarjetas de disciplina llevan el zoom inverso (ver abajo)
          y por eso siguen midiendo lo mismo. */}
      <Box flex="1" sx={{ zoom: ZOOM_PAGINA }}>
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
            src="/img/icono/life.webp"
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

      {/* ══ 1. CABECERA ══
          Debajo de la flor, dos frases: la principal (metodología única de
          autoconocimiento multidimensional) y, más pequeña y en cursiva, la que
          la explica. Sustituye al titular «¿Qué te ha pasado?» con sus dos
          botones; los textos viejos siguen en el diccionario. */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 7, md: 9 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.03em"
          lineHeight="1.15"
          maxW="1000px"
          textShadow="0 0 12px rgba(255,255,255,0.26), 0 0 26px rgba(180,255,245,0.12)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(18px)"}
          transition="opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s"
        >
          <LetrasVivas texto={t("elMetodo.hero.principal")} entrada activo={mounted} onda={!esMovil} altura={0} repetir={false} />
        </Text>

        <Text
          color="rgba(255,255,255,0.9)"
          fontSize={{ base: "md", md: "xl" }}
          fontStyle="italic"
          letterSpacing="0.03em"
          lineHeight="1.6"
          maxW="720px"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(14px)"}
          transition="opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s"
        >
          {t("elMetodo.hero.secundaria")}
        </Text>
      </Flex>

      {/* ── SEPARADOR con el mandala (mismo aire arriba que abajo) ── */}
      <SeparadorMandala
        mt={{ base: "48px", md: "67px" }}
        mb={{ base: "48px", md: "67px" }}
      />

      {/* ── LAS 8 DISCIPLINAS (mandala + vídeo) ──
          Va lo primero tras la cabecera: a la izquierda el mandala interactivo
          con las ocho, a la derecha el box de la disciplina seleccionada con su
          vídeo y su precio. Es el resumen de qué se compra, así que se enseña
          antes que las fichas de detalle.
          Montaje diferido: los círculos del mandala hacen su «pop» justo cuando
          llegas a ellos, y no antes en una zona que no ves. */}
      <Box px={{ base: 5, md: 10, lg: 16 }}>
        <Box maxW="1200px" mx="auto">
          <BloqueDiferido minH={{ base: "760px", md: "560px" }}>
            <Reveal inView amount={0.06} direction="up" distance={26} scaleFrom={0.98} duration={0.8}>
              <RecorridoMandalaVideo />
            </Reveal>
          </BloqueDiferido>
        </Box>
      </Box>

      {/* ══ LA PRUEBA (los ocho vídeos) ══
          Pantallas REALES del recorrido, subidas aquí desde justo antes del
          precio. Va pegado al mandala a propósito: ahí acabas de ver CÓMO está
          ordenado el recorrido, y esto es lo que hay dentro de cada pieza. Toda
          la página promete; este bloque es el único que enseña.
          Y ANTES de Experiencias reales: primero se ve la cosa, y después lo que
          dicen de ella los que ya la han hecho. */}
      <Box px={{ base: 5, md: 10, lg: 16 }}>
        <Box maxW="1200px" mx="auto">
          {/* La cesura de en medio: la línea fina y no el separador con el
              mandala. Justo encima está el mandala de las ocho disciplinas, y
              el otro separador le habría puesto un segundo mandala a un palmo
              del primero.
              El `mt` es MAYOR que el `mb`, y no al revés como parecería: por
              abajo, entre la línea y el titular, están además el hueco propio
              del bloque de los vídeos y el aire del titular; y por arriba, el
              box del mandala termina bastante más abajo de lo que parece a la
              vista (la columna del mandala sigue más allá del canto de la
              tarjeta roja). Contando eso, la línea cae en el centro real del
              hueco. La suma de los dos márgenes se mantiene, así que el aire
              entre secciones es el mismo: solo se ha bajado la línea. */}
          <SeparadorMandala
          mt={{ base: "48px", md: "67px" }}
          mb={{ base: "48px", md: "67px" }}
          />
          <PruebasBloque />

          {/* La frase que cierra los vídeos: grande y tranquila. */}
          <Reveal inView amount={0.4} direction="up" distance={22} duration={0.9}>
            <Text
              mt={{ base: 10, md: 14 }}
              color="white"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="500"
              fontStyle="italic"
              letterSpacing="0.03em"
              lineHeight="1.4"
              textAlign="center"
              maxW="900px"
              mx="auto"
              textShadow="0 0 12px rgba(255,255,255,0.24), 0 0 26px rgba(180,255,245,0.1)"
            >
              {t("elMetodo.pruebas.interior")}
            </Text>
          </Reveal>
          <Reveal inView amount={0.5} direction="up" distance={16} duration={0.8} delay={0.15}>
            <Text
              mt={{ base: 4, md: 5 }}
              color="rgba(255,255,255,0.95)"
              fontSize={{ base: "lg", md: "2xl" }}
              fontWeight="600"
              letterSpacing="0.03em"
              lineHeight="1.4"
              textAlign="center"
              maxW="760px"
              mx="auto"
            >
              {t("elMetodo.pruebas.precio")}
            </Text>
          </Reveal>

          {/* LA CESURA DEL DINERO. De aquí para arriba la página explica y
              enseña; de aquí para abajo cobra. Ha subido con sus dos bloques:
              el precio va pegado a la prueba, que es cuando de verdad se está
              decidiendo, y no cinco pantallas más abajo.
              Mismo hueco arriba y abajo, para que caiga justo en el medio. */}
          <SeparadorMandala
          mt={{ base: "48px", md: "67px" }}
          mb={{ base: "48px", md: "67px" }}
          />

          {/* ── CÓMO FUNCIONA ──
              Qué pasa tras comprar: recorrerlo solo o con llamadas. Va antes
              de «Qué obtienes» y no más arriba: primero hay que haber visto
              qué es y qué hay dentro (mandala y vídeos) para que «cómo
              funciona» tenga a qué referirse. */}
          <Box>
            <ComoFuncionaBloque />
          </Box>


          {/* ══ EL PRECIO ══
              Un precio escondido no evita la objeción del dinero: la empeora,
              porque quien no lo encuentra se imagina la cifra más alta y se va
              sin preguntar.
              Lleva su propio botón al final (onAcceder): quien ve el precio y
              le cuadra tiene que poder entrar ahí mismo. */}
          <Box mt={{ base: 16, md: 24 }}>
            <PrecioBloque onAcceder={handleAcceder} onTest={() => setTestOpen(true)} />
          </Box>
        </Box>
      </Box>

      {/* ══ 6. TESTIMONIOS ══
          Estaban al final del todo, después de seis pantallas de scroll: quien
          dudaba se iba mucho antes de llegar a ellos. Aquí llegan justo cuando
          se acaba de ver qué es esto y antes de mirar los precios, que es donde
          hacen falta. Es EL MISMO componente (se pinta una vez, no dos): si no
          hay opiniones en la base de datos, no pinta nada. */}
      <Box px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 16, md: 24 }}>
        <Box maxW="1200px" mx="auto">
          {/* Aquí cambia QUIÉN habla: hasta arriba la página habla de sí misma,
              y a partir de esta línea hablan otros.
              El `mb` no es igual al `pt` de este bloque (16/24) sino 4/6 más:
              encima hay además el `pb` del box del mandala, y sin sumarlo la
              línea caía alta. Así queda centrada en el hueco de verdad. */}
          <SeparadorLinea mb={{ base: 20, md: 30 }} />
          <ExperienciasReales />
        </Box>
      </Box>

      {/* ── QUÉ RECIBIRÁS ── */}
      {/* Sin `pt` propio: el hueco con el bloque de arriba lo pone el `pt` del
          separador, en un solo sitio, para poder ajustarlo sin sumar tres
          paddings distintos. */}
      <Box w="100%" px={{ base: 5, md: 10, lg: 16 }}>
        {/* Aquí iban «Elige el orden que quieras. Yo te propongo este:» y las ocho
            fichas de disciplina con su número y su frase. Retirado. */}

        <Box maxW="1200px" mx="auto">

          {/* De este tramo se han ido tres cosas, todas hacia arriba: «LA
              PRUEBA» (los ocho vídeos de «El Mapa por dentro»), «QUÉ OBTIENES»
              y «EL PRECIO». Ahora los tres cuelgan del mandala, que es donde se
              decide: se ve cómo está ordenado el recorrido, se ve por dentro,
              y ahí mismo está lo que incluye y lo que cuesta, sin tener que
              bajar cinco pantallas a buscarlo.
              Aquí ya no hace falta cesura: la que abre «¿Por dónde empiezo?»
              está justo debajo y dos seguidas no separan nada.
              Aquí iba también una garantía de devolución de 14 días. Fuera: no
              se ofrece, y prometer una devolución que no existe es peor que no
              tener ninguna. */}

          {/* ══ 10. ¿POR DÓNDE EMPIEZO? ══
              Ocho puertas iguales paralizan. Tres caminos según lo que traiga
              cada uno, y ya no hay que elegir entre ocho. Y con el botón otra
              vez al final: es el segundo momento en el que se decide. */}
          {/* El hueco entre el botón de «Empezar por 30 €» y esta sección era de
              los más grandes de la página y no tenía nada en medio. Mismo aire
              arriba y abajo (16/24), así la línea cae justo en el centro. */}
          <SeparadorLinea mt={{ base: 16, md: 24 }} />

          <Box mt={{ base: 16, md: 24 }}>
            <PorDondeEmpiezoBloque onAcceder={handleAcceder} onTest={() => setTestOpen(true)} />
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
          {/* Aquí había un separador de mandala entre el botón de «empezar» y la
              tarjeta de la creadora. Fuera: el botón ya cierra la sección y la
              tarjeta abre la suya con su propio pt, así que la cesura solo
              estiraba la página. */}

          {/* Tarjeta de la creadora (componente compartido con Welcome) */}
          <CreadoraCard />

          {/* ── BOTÓN EMPEZAR + TENGO DUDAS ──
              Ya no cierra la página: va ANTES de las preguntas. Quien llega
              convencido pulsa aquí sin tener que atravesar ocho desplegables, y
              a quien le queda una duda le esperan justo debajo.
              Sin `pb`: el hueco con las preguntas lo pone el `pt` del bloque de
              abajo, en un solo sitio. */}
          <Flex
            direction="column"
            align="center"
            pt={{ base: 16, md: 24 }}
            gap={{ base: 12, md: 16 }}
          >
            {/* ACCEDER (botón grande con mandala) + la frase de «no te van a cobrar».
                Van juntos en su propia columna con un hueco corto: el `gap` grande
                del bloque es el que separa este grupo de los botones secundarios, y
                si la frase colgara suelta del bloque se iría a media pantalla del
                botón y ya no se leería como su letra pequeña. */}
            <Flex direction="column" align="center" gap={{ base: 3, md: 4 }}>
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
                src="/img/icono/life.webp"
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
                {t("elMetodo.acceder")}
              </Text>
            </Flex>
            </Breathe>
            </Reveal>

            {/* Letra pequeña que quita el miedo a pulsar: crear la cuenta no cobra
                nada. Blanca y sin sombra (está fuera de caja, sobre el turquesa) y
                en un cuerpo claramente menor que el botón, que no le robe el sitio. */}
            <Reveal inView direction="up" distance={14} delay={0.15} duration={0.6} display="flex" justifyContent="center">
              <Text
                color="white"
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "sm", md: "md" }}
                fontStyle="italic"
                letterSpacing="0.02em"
                textAlign="center"
                opacity={0.85}
                px={4}
              >
                {t("elMetodo.sinTarjeta")}
              </Text>
            </Reveal>
            </Flex>

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
                  {t("elMetodo.agendar")}
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
                  {t("elMetodo.dudas")}
                </Text>
              </Flex>
            </Flex>
            </Reveal>
          </Flex>

          {/* ══ 12. LAS PREGUNTAS ══
              Cierran la página, ya detrás del botón: son para quien NO ha
              pulsado, y aquí es donde se cae la última excusa. Debajo llevan su
              propio hueco (`pb`) para que la última pregunta no toque el footer.
              Los testimonios ya NO van aquí — subieron a su sitio, justo
              después del mandala (ver arriba). */}
          {/* Las preguntas son de otro registro: ya no convencen, resuelven. Y
              venían colgando del botón de ACCEDER solo con un hueco, sin nada
              que dijera «esto ya es otra cosa». Fina, para no rematar la página
              con un tercer mandala a un palmo del de la creadora. */}
          <SeparadorLinea mt={{ base: 20, md: 28 }} />

          <Box pt={{ base: 20, md: 28 }} pb={{ base: 24, md: 32 }}>
            <FaqBloque />
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
              {t("elMetodo.precio.cierre.titulo")}
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
                  nombre: t("elMetodo.precio.cierre1.nombre"),
                  precio: t("elMetodo.precio.cierre1.importe"),
                  desc: t("elMetodo.precio.cierre1.desc"),
                },
                {
                  nombre: t("elMetodo.precio.cierre2.nombre"),
                  precio: t("elMetodo.precio.cierre2.importe"),
                  desc: t("elMetodo.precio.cierre2.desc"),
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
              desc={contenido[selectedCard.clave].desc}
              contenido={contenido[selectedCard.clave].contenido}
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
        title={t("elMetodo.dudas")}
        bgColor="#008080"
        color="#ffffff"
        emailSubject={t("elMetodo.dudas.asunto")}
        showCheckboxes={false}
        showDescription={true}
        textareaPlaceholder={t("elMetodo.dudas.placeholder")}
      />

      <BookCallModal
        isOpen={bookCallOpen}
        onClose={() => setBookCallOpen(false)}
      />

      <SiteFooter />

      {/* ══ 13. BOTÓN FLOTANTE «CONTÁCTAME» ══
          El mismo de la portada (abajo a la derecha): al pulsarlo sale el popup
          de «Hablemos juntos». Ya no hay popup que salga solo ni los botones de
          Mensaje y del Test; el test se abre desde el botón grande del hero. */}
      <BotonContactame />
      <TestDisciplinaModal isOpen={testOpen} onClose={() => setTestOpen(false)} />
    </Box>
  );
}
