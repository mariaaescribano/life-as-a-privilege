import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import CreadoraCard from "../../components/welcome/CreadoraCard";
import WelcomeHero from "../../components/welcome/WelcomeHero";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import WelcomeCuatro from "../../components/welcome/WelcomeCuatro";
import BandaMarmol from "../../components/global/BandaMarmol";
import WelcomePilares from "../../components/welcome/WelcomePilares";
import SeparadorFlor from "../../components/welcome/SeparadorFlor";
import WelcomeDisciplinas from "../../components/welcome/WelcomeDisciplinas";
import BotonContactame from "../../components/global/BotonContactame";
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
import { disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { precargarImagenes, usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
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

const Welcome = () => {
  const navigate = useNavigate();
  const t = useT();
  const [showEspacioModal, setShowEspacioModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const imagenesListas = usePrecargarImagenes(WELCOME_IMGS);
  const [tiempoMin, setTiempoMin] = useState(false);
  // Tipografías listas: sin esto el titular y el subtítulo se pintan con la
  // fuente de respaldo (más ancha) y, al llegar la EB Garamond, encogen de golpe.
  const [fuentesListas, setFuentesListas] = useState(false);
  // La página no se revela hasta que las fotos estén cargadas Y haya pasado un
  // tiempo mínimo (para que se vea la animación de carga aunque las fotos vengan
  // de caché). Mientras, se muestra <LifeLoading/>.
  const listo = imagenesListas && tiempoMin && fuentesListas;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setTiempoMin(true), 550);
    // Red de seguridad: si las fuentes no llegan en 2,5 s se sigue igualmente.
    const tope = setTimeout(() => setFuentesListas(true), 2500);
    const fuentes = (document as any).fonts;
    if (fuentes?.load) {
      Promise.all([
        fuentes.load('400 1em "EB Garamond"'),
        fuentes.load('italic 400 1em "EB Garamond"'),
        fuentes.load('700 1em "EB Garamond"'),
        fuentes.ready,
      ]).catch(() => {}).then(() => setFuentesListas(true));
    } else {
      setFuentesListas(true);
    }
    return () => { clearTimeout(t); clearTimeout(tope); };
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
      {/* ── LO PRIMERO: mandala + titular + frase (la cabecera de El Mapa) ── */}
      <WelcomeCabecera activo={mounted} />

      {/* ── CABECERA: frase + nombre/email a la izquierda, foto a la derecha ── */}
      {/* Segundo apartado: «Descubre nuevas perspectivas de ti…» sobre el mármol,
          en banda a todo el ancho. */}
      {/* El mármol (BandaMarmol) no asoma hasta que el usuario baja, y su contenido
          tampoco: entra en cuanto el bloque asoma. */}
      <BandaMarmol mt={{ base: 2, md: 4 }}>
        {(visible) => (
          // Sin `iconos`: la fila de los ocho círculos ya no se pinta aquí.
          <WelcomeHero activo={visible} marmol compacto />
        )}
      </BandaMarmol>

      {/* ── SEPARACIÓN con el mandala en medio, bajo «Descubre nuevas perspectivas…» ── */}
      <SeparadorFlor />

      {/* ── TERCER APARTADO: cuatro cajas en la misma línea (Cuerpo, Mente, Tradición, Cultura) ── */}
      <WelcomeCuatro />

      {/* ── SEPARACIÓN CON LA FLOR ── */}
      <SeparadorFlor />

      {/* ── SEGUNDA SECCIÓN: tres ideas en tres cajas + tu foto ── */}
      <BandaMarmol>{(visible) => <WelcomePilares activo={visible} />}</BandaMarmol>

      {/* ── SEPARACIÓN CON LA FLOR (mismo aire arriba que abajo) ── */}
      <SeparadorFlor />

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

      {/* ── LAS OCHO DISCIPLINAS: líneas con el icono delante, 4 + 4 ── */}
      <WelcomeDisciplinas disciplinas={disciplines} />

      {/* ── SEPARACIÓN CON EL MANDALA ── */}
      <SeparadorFlor />

      {/* ── MARÍA, sobre el mármol: caja transparente y letra turquesa oscuro ── */}
      <BandaMarmol>{(visible) => <CreadoraCard fondo="marmol" activo={visible} />}</BandaMarmol>

      {/* ── SEPARADOR DE ZONAS ── */}
      {/* <Flex justify="center" pt={{ base: 12, md: 16 }}>
        <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.18)" />
      </Flex> */}

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

      {/* ── BOTÓN FLOTANTE «CONTÁCTAME» ── (fuera del contenedor con zoom) */}
      <BotonContactame />

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
            bg="#008080"
            border="1px solid rgba(255,255,255,0.3)"
            borderRadius="3xl"
            boxShadow="0 0 42px rgba(255,255,255,0.07), 0 22px 60px rgba(0,0,0,0.6)"
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
              alt="María Escribano"
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
              boxShadow="0 0 28px rgba(107,196,200,0.35), 0 2px 12px rgba(0,0,0,0.25)"
              _hover={{ bg: "rgba(255,255,255,0.26)", borderColor: "white", boxShadow: "0 0 40px rgba(107,196,200,0.56)" }}
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
