import React, { useCallback, useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import OpinionesSection from "../../components/welcome/OpinionesSection";
import CreadoraCard from "../../components/welcome/CreadoraCard";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
  // AprendizajeIcon, // comentado: el botón APRENDER está desactivado para v1
} from "../../GlobalVariables";
import { useT, type ClaveTexto } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { DisciplinaBgLayer, hasDisciplinaBg, disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { precargarImagenes, usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useEnPantalla } from "../../hooks/useEnPantalla";
import { LifeLoading } from "../../components/global/LifeLoading";

type Discipline = {
  /** Nombre INTERNO (GlobalVariables): viaja en el `link`, no se traduce. */
  name: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
  /** Clave del texto del modal — se traduce al pintar, no aquí. */
  descKey: ClaveTexto;
  /** Su portada común: /disciplina/<slug> (Ilustraciones · Cursos · El Recorrido). */
  link: string;
  available:boolean;
  /** Clave del lema de la tarjeta. */
  lemaKey?: ClaveTexto;
};

// Orden del Método: Psicología → Fisiología → Nutrición → Cultura →
// TCM → Astrología → Cábala → Hinduismo
const disciplines: Discipline[] = [
  {
    name: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
    descKey: "welcome.desc.psicologia",
    link: "/disciplina/psicologia",
    available: true,
    lemaKey: "welcome.lema.psicologia",
  },
  {
    name: fisiologiaNom,
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    renderIcon: (size) => <FisiologiaIcon size={size} />,
    descKey: "welcome.desc.fisiologia",
    link: "/disciplina/fisiologia",
    available: true,
    lemaKey: "welcome.lema.fisiologia",
  },
  {
    name: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    renderIcon: (size) => <NutricionIcon size={{ base: size, md: size }} />,
    descKey: "welcome.desc.nutricion",
    link: "/disciplina/nutricion",
    available: true,
    lemaKey: "welcome.lema.nutricion",
  },
  {
    name: culturaNom,
    bg: culturaBg,
    txt: culturaTxt,
    renderIcon: (size) => <CulturaIcon size={{ base: size, md: size }} />,
    descKey: "welcome.desc.cultura",
    link: "/disciplina/cultura",
    available: true,
    lemaKey: "welcome.lema.cultura",
  },
  {
    name: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
    descKey: "welcome.desc.medicinaChina",
    link: "/disciplina/medicinachina",
    available: true,
    lemaKey: "welcome.lema.medicinaChina",
  },
  {
    name: astrologiaNom,
    bg: astrologiaBg,
    txt: astrologiaTxt,
    renderIcon: (size) => <AstrologiaIcon size={{ base: size, md: size }} />,
    descKey: "welcome.desc.astrologia",
    link: "/disciplina/astrologia",
    available: true,
    lemaKey: "welcome.lema.astrologia",
  },
  {
    name: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    renderIcon: (size) => <CabalaIcon size={{ base: size, md: size }} />,
    descKey: "welcome.desc.cabala",
    link: "/disciplina/cabala",
    available: true,
    lemaKey: "welcome.lema.cabala",
  },
  {
    name: ayurvedaNom,
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    renderIcon: (size) => <AyurvedaIcon size={{ base: size, md: size }} />,
    descKey: "welcome.desc.hinduismo",
    link: "/disciplina/ayurveda",
    available: true,
    lemaKey: "welcome.lema.hinduismo",
  },
];

// Lo que la portada espera ANTES de pintarse: el mandala y las acuarelas de la
// primera pantalla (las cuatro primeras tarjetas, que en móvil son dos filas de
// dos y en escritorio una fila de cuatro). Así lo primero que se ve entra
// completo, sin esperar a las ocho.
const DISCIPLINAS_PRIMERA_PANTALLA = 4;
const WELCOME_IMGS: string[] = [
  "/img/icono/life.webp",
  ...(disciplines
    .slice(0, DISCIPLINAS_PRIMERA_PANTALLA)
    .map((d) => disciplinaBgImg(d.name))
    .filter(Boolean) as string[]),
];

// Las acuarelas de la segunda fila. Se piden EN CUANTO la página ya se ve, no
// antes: media pantalla de scroll por delante da tiempo de sobra a que lleguen.
// Si alguien baja a toda prisa con mala cobertura y una tarjeta se adelanta a su
// foto, no queda un hueco blanco: DisciplinaBgLayer pinta debajo el color sólido
// de la disciplina y la acuarela entra encima.
const WELCOME_IMGS_DIFERIDAS: string[] = disciplines
  .slice(DISCIPLINAS_PRIMERA_PANTALLA)
  .map((d) => disciplinaBgImg(d.name))
  .filter(Boolean) as string[];

// callback ref: el observer se engancha en cuanto el nodo aparece en el DOM.
// (Importante porque la página se monta primero mostrando <LifeLoading/> y el
// contenido —con estos refs— aparece después; con un ref normal el efecto
// correría una vez con el ref vacío y nunca volvería a observar.)
const useReveal = (threshold = 0.15) => {
  const [visible, setVisible] = useState(false);
  const [node, setNode] = useState<HTMLElement | null>(null);
  const ref = useCallback((el: HTMLElement | null) => setNode(el), []);
  useEffect(() => {
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [node, threshold]);
  return { ref, visible };
};

// ── Tarjeta de disciplina ────────────────────────────────────────────────────
// Va en su propio componente para que CADA UNA tenga su propio observador: así
// una tarjeta no se coloca hasta que ella misma asoma en pantalla. Con un único
// observador para toda la cuadrícula, al llegar a la primera fila arrancaban las
// ocho, y la segunda (en móvil, las filas 2, 3 y 4) se colocaba fuera de vista.
//
// El retraso lo marca la COLUMNA, no el índice global: las de una misma fila
// entran de izquierda a derecha, y cada fila empieza su cuenta cuando aparece.
// Si usáramos el índice global, la última esperaría más de un segundo desde que
// ya se está viendo.
function TarjetaDisciplina({
  d,
  delay,
  isMobile,
  entraAlCargar = false,
  cargado = false,
  onSelect,
  onExplorar,
}: {
  d: Discipline;
  delay: number;
  isMobile: boolean;
  /** Tarjeta de la PRIMERA fila: entra al cargar la página, sin esperar a asomar
   *  en pantalla. Las de abajo sí esperan (ver `useEnPantalla`). */
  entraAlCargar?: boolean;
  /** Con `entraAlCargar`: el momento en que el padre dispara la entrada. */
  cargado?: boolean;
  onSelect: () => void;
  onExplorar: () => void;
}) {
  // Margen suave (-6% en vez del -25% por defecto): la fila de abajo entra en
  // cuanto asoma por el borde inferior, con un scroll corto. Con el -25% había
  // que bajar un cuarto de pantalla —unos 200px— antes de que se dignaran a
  // aparecer, y se sentía como que la página no reaccionaba.
  const enPantalla = useEnPantalla("0px 0px -6% 0px");
  // La primera fila queda justo en el pliegue: con el observador nunca llegaba a
  // «asomar» y el usuario se encontraba un hueco turquesa vacío donde deberían
  // estar las tarjetas. Esa fila entra con la página; las siguientes, al bajar.
  const visto = entraAlCargar ? cargado : enPantalla.visto;
  const hasBg = hasDisciplinaBg(d.name);
  const t = useT();
  const nombreDe = useNombreDisciplina();
  // El nombre va SIEMPRE en una línea: si salta a dos, esa tarjeta crece de alto
  // y rompe la fila. Se pide la versión corta en móvil y también cuando el
  // idioma alarga el nombre («Chinese Medicine» → «Chinese Med.»); en español
  // «Medicina China» cabe entera y se queda como está. Solo Medicina China tiene
  // versión corta: el resto devuelve su nombre largo tal cual.
  const nombreLargo = nombreDe(d.name);
  const displayName = isMobile || nombreLargo.length > 14 ? nombreDe(d.name, true) : nombreLargo;

  return (
    <Box
      role="group"
      mt={{ base: "30px", md: "42px" }}
      // Las tarjetas de una misma fila miden lo MISMO: la rejilla estira este
      // envoltorio hasta el alto de la fila (align-items: stretch) y la tarjeta
      // de dentro lo ocupa entero (`flex: 1`). Así, si un lema ocupa dos líneas
      // y el de al lado una, la corta crece hasta igualar a la larga en vez de
      // dejar un escalón entre las dos.
      display="flex"
      flexDirection="column"
      cursor="pointer"
      onClick={onSelect}
      // Dispara cuando ESTA tarjeta asoma en pantalla, no al cargar la página ni
      // cuando asoma la cuadrícula: así también se ve colocarse a las de las
      // filas de abajo, en vez de encontrarlas ya puestas al bajar.
      ref={enPantalla.ref}
      opacity={visto ? 1 : 0}
      transform={visto ? "translateY(0) scale(1)" : "translateY(32px) scale(0.94)"}
      filter={visto ? "blur(0px)" : "blur(6px)"}
      // Las ocho entran UNA DETRÁS DE OTRA, con 0.15s de hueco: se ve
      // la secuencia pero es ágil (antes 0.09s, que se solapaba tanto
      // que parecían entrar de golpe).
      // Sin giro y sin rebote: antes entraban con rotate(-4deg) y una
      // curva que se pasaba de largo, así que aterrizaban torcidas y se
      // enderezaban dando un tumbo. Ahora suben limpias y se enfocan,
      // con la curva del sistema Reveal. Mismos números que /elMetodo.
      transition={`opacity 0.4s ease ${delay}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}s, filter 0.4s ease ${delay}s`}
    >
      {/* Tarjeta visual — el hover (elevación/sombra) vive aquí, separado
          del reveal de entrada para que no se pisen los transforms. */}
      <Box
        position="relative"
        // `flex: 1` = ocupa todo el alto que le da la fila (ver arriba).
        flex="1"
        display="flex"
        flexDirection="column"
        pt={{ base: "36px", md: "46px" }}
        pb={{ base: 3.5, md: 7 }}
        px={{ base: 3, md: 5, lg: 6 }}
        bg={hasBg ? "transparent" : d.bg}
        borderRadius="2xl"
        textAlign="center"
        overflow={hasBg ? "visible" : undefined}
        boxShadow="0 4px 20px rgba(0,0,0,0.16)"
        transition="transform 0.28s ease, box-shadow 0.28s ease"
        _groupHover={{
          transform: "translateY(-6px)",
          boxShadow: "0 14px 38px rgba(0,0,0,0.26)",
        }}
      >
        {/* Fondo propio de la disciplina (estrellas o imagen) — en su
            propia capa con overflow:hidden, para que el icono que
            sobresale por arriba (top:-36px) no quede recortado. */}
        {hasBg && <DisciplinaBgLayer nom={d.name} borderRadius="2xl" />}
  
        {/* Icono que sobresale por arriba — único elemento con glow
            fuerte; en hover crece un 5% y aumenta su brillo. */}
        <Box
          position="absolute"
          top={{ base: "-27px", md: "-36px" }}
          left="50%"
          transform="translateX(-50%)"
          bg={hasBg ? "transparent" : d.bg}
          borderRadius="full"
          p={{ base: "6px", md: "8px" }}
          border={"4px solid "+ d.txt}
          boxShadow={`0 0 20px ${d.txt}bb, 0 2px 14px ${d.txt}77`}
          w={{ base: "56px", md: "72px" }}
          h={{ base: "56px", md: "72px" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={2}
          overflow={hasBg ? "hidden" : undefined}
          transition="transform 0.28s ease, box-shadow 0.28s ease"
          _groupHover={{
            transform: "translateX(-50%) scale(1.05)",
            boxShadow: `0 0 30px ${d.txt}dd, 0 2px 20px ${d.txt}aa`,
          }}
        >
          {hasBg && <DisciplinaBgLayer nom={d.name} borderRadius="full" />}
          <Box
            position="relative"
            zIndex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="filter 0.28s ease"
            _groupHover={{ filter: "brightness(1.12)" }}
          >
            {d.renderIcon(isMobile ? "32px" : "42px")}
          </Box>
        </Box>
  
        {/* Nombre — protagonista tras el icono. Sombra reforzada en
            el color de la disciplina para despegarlo del fondo. */}
        <Text
          position="relative"
          zIndex={1}
          color={d.txt}
          fontWeight="700"
          fontSize={{ base: "19px", md: "30px", lg: "38px" }}
          letterSpacing="0.04em"
          lineHeight="short"
          textShadow={hasBg
            ? `0 1px 3px ${d.bg}, 0 2px 8px ${d.bg}, 0 0 16px ${d.bg}dd, 0 2px 14px ${d.bg}aa`
            : "2px 2px 4px rgba(0,0,0,0.55)"}
        >
          {displayName}
        </Text>
  
        {/* Subtítulo — el verdadero protagonista: responde
            "¿qué voy a descubrir aquí?". minH fija para que la fila
            "Explorar disciplina" quede alineada en todas las tarjetas. */}
        {d.lemaKey && (
          <Text
            position="relative"
            zIndex={1}
            mt={{ base: 1.5, md: 3 }}
            minH="2em"
            color={d.txt}
            fontWeight="500"
            fontSize={{ base: "sm", md: "lg", lg: "xl" }}
            lineHeight="1.45"
            letterSpacing="0.01em"
            opacity={0.96}
            textShadow={hasBg
              ? `0 1px 3px ${d.bg}, 0 1px 6px ${d.bg}, 0 0 12px ${d.bg}dd`
              : "1px 1px 3px rgba(0,0,0,0.5)"}
          >
            {t(d.lemaKey)}
          </Text>
        )}
  
        {/* Indicador de interacción — invita a explorar; tenue en
            reposo, se enciende y la flecha avanza en hover. Enlaza
            directamente con la página de la disciplina (sin abrir el
            popup, de ahí el stopPropagation). */}
        <Flex
          position="relative"
          zIndex={1}
          align="center"
          justify="center"
          gap={1.5}
          // `auto`: la fila de «Explorar» se va SIEMPRE al fondo de la tarjeta,
          // así queda a la misma altura en las dos de la fila aunque una tenga
          // el lema más largo. El `pt` es el aire mínimo con el texto de arriba.
          mt="auto"
          pt={{ base: 2, md: 3 }}
          color={d.txt}
          fontSize={{ base: "10px", md: "xs", lg: "sm" }}
          fontWeight="600"
          letterSpacing={{ base: "0.08em", md: "0.14em" }}
          textTransform="uppercase"
          whiteSpace="nowrap"
          cursor="pointer"
          userSelect="none"
          opacity={0.75}
          transition="opacity 0.28s ease"
          _groupHover={{ opacity: 1 }}
          _hover={{ opacity: 1 }}
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onExplorar(); }}
        >
          <Box as="span">{t("welcome.explorar")}</Box>
          <Box
            as="span"
            transition="transform 0.28s ease"
            _groupHover={{ transform: "translateX(4px)" }}
          >
            →
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

const Welcome = () => {
  const navigate = useNavigate();
  const t = useT();
  const [showEspacioModal, setShowEspacioModal] = useState(false);
  const bienvenidaReveal = useReveal();
  const disciplinasTitleReveal = useReveal(0.2);
  // El botón «Descubre El Mapa», encima de la tarjeta de la creadora.
  const mapaReveal = useReveal(0.3);
  const [mounted, setMounted] = useState(false);
  const imagenesListas = usePrecargarImagenes(WELCOME_IMGS);
  const [tiempoMin, setTiempoMin] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? true;
  // Tarjetas por fila (2 en móvil, 4 en escritorio): define la cascada y cuáles
  // son «la primera fila», la que tiene que verse sin hacer scroll.
  const columnas = isMobile ? 2 : 4;
  // Filas que se ven sin hacer scroll (y que por tanto entran con la página):
  // en móvil dos —las cuatro primeras disciplinas—, en escritorio una de cuatro.
  const filasAlCargar = isMobile ? 2 : 1;
  // La página no se revela hasta que las fotos estén cargadas Y haya pasado un
  // tiempo mínimo (para que se vea la animación de carga aunque las fotos vengan
  // de caché). Mientras, se muestra <LifeLoading/>.
  const listo = imagenesListas && tiempoMin;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setTiempoMin(true), 550);
    return () => clearTimeout(t);
  }, []);

  // Cuando la página está lista, disparamos la entrada de la primera pantalla
  // (mandala + héroe + tarjetas). Doble requestAnimationFrame: el contenido se
  // pinta primero OCULTO y, al frame siguiente, cambia a visible → la transición
  // CSS se ejecuta siempre (si lo hiciéramos en el mismo frame, el navegador
  // pintaría ya el estado final y no se vería animación).
  useEffect(() => {
    if (!listo) return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setMounted(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [listo]);

  // Las acuarelas de la segunda fila, fuera del camino crítico: no retienen la
  // pantalla de carga, pero se piden enseguida para que estén en caché mucho
  // antes de que esas tarjetas asomen. Un respiro de 400 ms antes de pedirlas
  // para no competir con la entrada de la primera pantalla, que es lo que se
  // está mirando en ese momento.
  useEffect(() => {
    if (!listo) return;
    const id = setTimeout(() => { void precargarImagenes(WELCOME_IMGS_DIFERIDAS); }, 400);
    return () => clearTimeout(id);
  }, [listo]);

  // Mientras cargan las fotos: pantalla de carga con el mandala animado.
  if (!listo) return <LifeLoading variant="public" />;

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      {/* ── HEADER ── */}
      <SiteHeader variant="public" />

      <Box flex="1">
      {/* ── MANDALA (elemento central, encima del título) ── */}
      {/* Wrapper con flotación + latido perpetuos (vida continua); la imagen
          hace la entrada épica (surge girando desde muy pequeña y se enfoca). */}
      <Flex justify="center" pt={{ base: 4, md: 9 }}>
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
            h={{ base: "44px", md: "72px" }}
            objectFit="contain"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "scale(1) rotate(0deg)" : "scale(0.25) rotate(-45deg)",
              // glow (drop-shadow) siempre + blur solo durante la entrada.
              filter:
                "drop-shadow(0 0 10px rgba(255,255,255,0.59)) drop-shadow(0 0 24px rgba(255,255,255,0.32)) drop-shadow(0 0 47px rgba(180,255,245,0.24))" +
                (mounted ? "" : " blur(6px)"),
              transition: "opacity 1.1s ease, transform 1.3s cubic-bezier(0.22,1.5,0.36,1), filter 1s ease",
            }}
          />
        </Box>
      </Flex>

      {/* ── BIENVENIDA (título + subtítulo + frase) ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 3, md: 8 }} pb={{ base: 2, md: 6 }}>
        <Box
          ref={bienvenidaReveal.ref}
          w={{ base: "100%", md: "78%" }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          gap={{ base: 2, md: 4 }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0) scale(1)" : "translateY(30px) scale(0.94)"}
          filter={mounted ? "blur(0px)" : "blur(8px)"}
          transition="opacity 0.9s ease 0.15s, transform 1.1s cubic-bezier(0.22,1.35,0.36,1) 0.15s, filter 0.9s ease 0.15s"
        >
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "5xl", lg: "6xl" }}
            fontWeight="700"
            letterSpacing="0.1em"
            lineHeight="1.1"
            textShadow="0 0 14px rgba(255,255,255,0.64), 0 0 30px rgba(255,255,255,0.41), 0 0 56px rgba(180,255,245,0.34)"
          >
            {/* El nombre de la casa vive en `header.marca` (una sola clave para
                el rótulo del header y este titular): así no se cambia en un
                sitio y se olvida el otro. */}
            {t("header.marca")}
          </Text>

          {/* Subtítulo (estructura de Materiales) */}
          <Text
            color="rgba(255,255,255,0.88)"
            fontSize={{ base: "sm", md: "xl" }}
            fontStyle="italic"
            fontWeight="400"
            letterSpacing="0.05em"
            lineHeight="1.5"
            textShadow="0 0 10px rgba(255,255,255,0.41), 0 0 21px rgba(255,255,255,0.22)"
            fontFamily="'EB Garamond', serif"
            maxW={{ base: "100%", md: "640px" }}
          >
            {t("welcome.subtitulo")}
          </Text>
        </Box>
      </Flex>

      {/* ── BANNERS PRODUCTOS & REELS ── */}
      {/* <Flex
        justify="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 12, md: 16 }}
      >
        <Flex
          w={{ base: "100%", md: "80%" }}
          gap={{ base: 5, md: 7 }}
          direction={{ base: "column", md: "row" }}
        >
          <ProductosBanner maxW="unset" w="100%" compact />
          <ReelsBanner    maxW="unset" w="100%" compact />
        </Flex>
      </Flex> */}

      {/* ── TÍTULO DISCIPLINAS ── */}
      {/* El texto está comentado, así que este bloque no pinta nada: sin `pt`
          para que no deje 40px de hueco muerto empujando las tarjetas por
          debajo del pliegue. Si se vuelve a poner el título, devuélvele el
          padding. */}
      <Flex
        ref={disciplinasTitleReveal.ref}
        direction="column"
        align="center"
      >
        {/* <Text
          color="rgba(255,255,255,0.85)"
          fontFamily="'EB Garamond', serif"
          fontStyle="italic"
          fontWeight="400"
          fontSize={{ base: "md", md: "xl" }}
          letterSpacing="0.12em"
          textShadow="0 0 9px rgba(255,255,255,0.34), 0 0 20px rgba(255,255,255,0.17)"
          textAlign="center"
          px={{ base: 5, md: 10 }}
          opacity={disciplinasTitleReveal.visible ? 1 : 0}
          transform={disciplinasTitleReveal.visible ? "translateY(0)" : "translateY(18px)"}
          transition="opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s"
        >
          Las 8 disciplinas…
        </Text> */}
      </Flex>

      {/* ── CARDS DE DISCIPLINAS ── */}
      {/* `pt` corto a propósito: en móvil tienen que entrar LAS CUATRO PRIMERAS
          sin hacer scroll (dos filas de dos), si no parece que la web se acaba en
          Psicología y Fisiología. Ojo al subirlo: cada píxel de aquí —y del héroe
          de arriba— empuja la segunda fila por debajo del pliegue.
          (Las tarjetas ya traen su `mt` propio para el icono que sobresale.) */}
      <Box
        px={{ base: 5, md: 6, lg: 8 }}
        pt={{ base: 1, md: 4 }}
        pb={{ base: 9, md: 13 }}
      >
        {/* Hueco corto y padding lateral corto: las tarjetas mandan, así que se
            comen el aire y salen anchas (el texto de dentro sube de tamaño
            en consecuencia). */}
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={{ base: 2, md: 5 }}
        >
          {disciplines.map((d, i) => (
            <TarjetaDisciplina
              key={i}
              d={d}
              isMobile={isMobile}
              // La columna dentro de su fila: 2 columnas en móvil, 4 en escritorio.
              // En móvil la segunda fila también entra con la página, así que se
              // le suma un hueco para que vaya DETRÁS de la primera, no a la vez.
              delay={0.1 + (i % columnas) * 0.15 + (isMobile && i >= columnas ? 0.3 : 0)}
              // Lo que se ve sin hacer scroll entra con la página: la primera fila
              // en escritorio y las DOS primeras en móvil (las cuatro disciplinas).
              // De ahí hacia abajo, cada tarjeta entra al asomar.
              entraAlCargar={i < filasAlCargar * columnas}
              cargado={mounted}
              onSelect={() => navigate(d.link)}
              onExplorar={() => navigate(d.link)}
            />
          ))}
        </Grid>
      </Box>

      {/* ── BOTÓN «DESCUBRE EL MAPA» ──
          Aquí había el separador de la flor (dos rayitas finas con el mandala
          en medio). Se ha ido: el botón ocupa su sitio y hace su trabajo, que
          es cortar la página entre las disciplinas y la creadora. Y la flor no
          se pierde, se mete DENTRO del botón, que es lo que lo hace parecer el
          remate de la portada y no un botón cualquiera pegado al final.

          Va aquí y no en la cabecera: arriba todavía no sabe qué son las ocho
          disciplinas, y un botón al Mapa antes de verlas no dice nada. Después
          de las tarjetas sí: ya ha visto de qué va cada una y lo siguiente que
          se pregunta es cómo encajan, que es justo lo que cuenta /elMetodo.

          Entra al asomar (mapaReveal) y no con `mounted`: está muy por debajo
          del pliegue y con `mounted` la animación pasaría mientras se mira la
          cabecera, y al bajar te lo encontrarías ya puesto. */}
      <Flex justify="center" px={{ base: 5, md: 10 }} pt={{ base: 12, md: 16 }}>
        <Flex
          ref={mapaReveal.ref}
          as="button"
          onClick={() => navigate("/elMetodo")}
          align="center"
          justify="center"
          gap={{ base: 3, md: 5 }}
          px={{ base: 6, md: 14 }}
          py={{ base: "14px", md: "20px" }}
          // En móvil ocupa el ancho que le dejan los márgenes (nunca de filo a
          // filo); en escritorio manda el `minW`, para que no se quede canijo
          // al lado de la cuadrícula de tarjetas que tiene encima.
          w={{ base: "min(86vw, 400px)", md: "auto" }}
          minW={{ base: "auto", md: "460px" }}
          borderRadius="full"
          border="1.5px solid rgba(255,255,255,0.68)"
          bg="rgba(255,255,255,0.11)"
          cursor="pointer"
          boxShadow="0 0 24px rgba(255,255,255,0.38), 0 0 54px rgba(255,255,255,0.2), 0 0 92px rgba(180,255,245,0.24), 0 6px 20px rgba(0,0,0,0.18)"
          _hover={{
            bg: "rgba(255,255,255,0.2)",
            borderColor: "white",
            boxShadow: "0 0 34px rgba(255,255,255,0.6), 0 0 72px rgba(180,255,245,0.45), 0 8px 24px rgba(0,0,0,0.22)",
          }}
          opacity={mapaReveal.visible ? 1 : 0}
          sx={{
            // La respiración es la MISMA idea que el mandala de la cabecera,
            // pero muy corta (1,5%): un botón que se hincha se lee como un
            // anuncio. Solo arranca cuando la entrada ha terminado, para que no
            // pelee con ella, y se apaga si el sistema pide menos movimiento.
            "@keyframes mapaLatido": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.015)" },
            },
            transform: mapaReveal.visible ? "translateY(0)" : "translateY(22px)",
            animation: mapaReveal.visible ? "mapaLatido 5.5s ease-in-out 1s infinite" : undefined,
            transition:
              "opacity 0.9s ease, transform 0.9s cubic-bezier(0.22,1.2,0.36,1), background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          <Image
            src="/img/icono/life.webp"
            alt=""
            h={{ base: "28px", md: "38px" }}
            objectFit="contain"
            flexShrink={0}
            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.56)) drop-shadow(0 0 24px rgba(255,255,255,0.3))" }}
          />
          <Text
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "md", md: "2xl" }}
            letterSpacing={{ base: "0.08em", md: "0.16em" }}
            textTransform="uppercase"
            whiteSpace="nowrap"
            textShadow="0 0 14px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.28)"
          >
            {t("welcome.mapa.cta")}
          </Text>
        </Flex>
      </Flex>

      {/* ── PRESENTACIÓN (creadora) ── */}
      <CreadoraCard />

      {/* ── SEPARADOR DE ZONAS ── */}
      {/* <Flex justify="center" pt={{ base: 12, md: 16 }}>
        <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.18)" />
      </Flex> */}

      {/* ── OPINIONES ── */}
      <OpinionesSection />

      {/* ── SUSCRIPCIÓN (newsletter) — acción opcional y final: peso visual
            reducido para que no compita con el CTA "El Recorrido". ── */}
      <Flex
        justify="center"
        px={{ base: 5, md: 10 }}
        pb={{ base: 24, md: 32 }}
        opacity={0.82}
        transform={{ base: "none", md: "scale(0.94)" }}
        sx={{ transformOrigin: "top center" }}
      >
        <SubscribeBox />
      </Flex>
      </Box>

      {/* ── FOOTER ── */}
      <SiteFooter />

      {/* ── MODAL ESPACIO (login requerido) ── */}
      {showEspacioModal && (
        <Box
          position="fixed"
          inset={0}
          zIndex={1100}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0,0,0,0.65)"
          onClick={() => setShowEspacioModal(false)}
          px={{ base: 5, md: 10 }}
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            bg="rgba(0,90,80,0.92)"
            border="1px solid rgba(255,255,255,0.3)"
            sx={{ backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)" }}
            borderRadius="3xl"
            boxShadow="0 28px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1)"
            p={{ base: 10, md: 14 }}
            maxW="420px"
            w="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={6}
            textAlign="center"
            position="relative"
          >
            {/* Botón cerrar */}
            <Box
              as="button"
              position="absolute"
              top="14px"
              right="14px"
              w="32px"
              h="32px"
              borderRadius="full"
              bg="rgba(255,255,255,0.1)"
              border="none"
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontSize="18px"
              fontWeight="bold"
              _hover={{ bg: "rgba(255,255,255,0.22)" }}
              transition="background 0.18s"
              onClick={() => setShowEspacioModal(false)}
            >
              ✕
            </Box>

            {/* Logo */}
            <Image
              src="/img/icono/life.webp"
              alt="Life as a Privilege"
              w="110px"
              objectFit="contain"
              filter="drop-shadow(0 4px 12px rgba(255, 255, 255, 0.26))"
            />

            {/* Mensaje */}
            <Text
              color="white"
              fontSize={{ base: "lg", md: "xl" }}
              fontFamily="'EB Garamond', serif"
              lineHeight="1.75"
              letterSpacing="0.02em"
              textShadow="0 1px 6px rgba(255, 255, 255, 0.22)"
            >
              {t("welcome.modal.cuenta")}
              {/* <Box as="span" fontWeight="700">Espacio Personal de crecimiento</Box> */}
            </Text>

            {/* Botón login */}
            <Box
              as="button"
              onClick={() => navigate("/logIn")}
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "lg", md: "xl" }}
              letterSpacing="0.16em"
              textTransform="uppercase"
              px={10}
              py={3}
              borderRadius="full"
              border="2px solid rgba(255,255,255,0.65)"
              bg="rgba(255,255,255,0.14)"
              cursor="pointer"
              boxShadow="0 0 28px rgba(107,196,200,0.5), 0 2px 12px rgba(0,0,0,0.25)"
              _hover={{ bg: "rgba(255,255,255,0.26)", borderColor: "white", boxShadow: "0 0 40px rgba(107,196,200,0.8)" }}
              transition="all 0.22s ease"
            >
              {t("welcome.modal.iniciarSesion")}
            </Box>
          </Box>
        </Box>
      )}

    </Box>
  );
};

export default Welcome;
