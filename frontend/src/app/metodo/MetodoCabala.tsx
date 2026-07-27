import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { PagoCabalaModal } from "../../components/metodo/PagoCabalaModal";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { CabalaIlustracionesModal } from "../../components/metodo/CabalaIlustracionesModal";
import { CABALA_INTRO } from "../../components/metodo/comicCabalaIntro";
import { useIntroComic } from "../../hooks/useIntroComic";
import { IndiceCabala } from "../../components/metodo/IndiceCabala";
import { CABALA_TOTAL_PAGINAS } from "../../components/metodo/cabalaSefirot";
import { BotonCompania } from "../../components/global/BotonCompania";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";
import { irAPagoDisciplina } from "../../components/metodo/pagoDisciplinaLink";
import { CAJA_GLOW } from "../../components/metodo/cabalaGlow";

// Halo oscuro (marrón profundo) para leer el texto sobre el fondo de Cábala
// (nebulosa con destellos).
// Sombra OSCURA (casi negra), no del color del fondo: da contraste real al
// texto ámbar (cabalaTxt) sobre el fondo marrón, para que se lea bien.
const INK_SHADOW = "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.72), 0 0 22px rgba(0,0,0,0.5)";

// Ojo del botón "Ilustraciones" (se pinta a la izquierda del texto).
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="16" height="16" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))", flexShrink: 0 }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </svg>
);

export default function MetodoCabala() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false);
  const intro = useIntroComic("metodo-cabala"); // cómic del Origen, 1ª vez

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Prerrequisito: hay que haber pagado Nutrición (6ª disciplina).
        if (!me.data?.nutricion_suscrito) { navigate("/home"); return; }

        const cabalaSuscrito = !!me.data?.cabala_suscrito;
        setSuscrito(cabalaSuscrito);
        if (!cabalaSuscrito) { setPagoOpen(true); return; }

        // Ya tiene acceso: si es la 1ª vez, muestra el cómic del Origen.
        void intro.checkAndOpen();
      } catch {
        navigate("/home");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const pagarCabala = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("cabala");
    if (errPago) {
      setPagoError(errPago);
      setPagoLoading(false);
    }
  };

  const comenzar = () => {
    if (!suscrito) { setPagoOpen(true); return; }
    navigate("/metodo/cabala/arbol");
  };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
              title="Cábala"
              pageLabel={`1/${CABALA_TOTAL_PAGINAS}`}
              compact
              bgColor={`${cabalaBg}dd`}
              color={cabalaTxt}
              nom={cabalaNom}
              mb={0}
              prev={{ label: "← Nutrición", onClick: () => navigate("/metodo/nutricion/cursos") }}
              // Ilustraciones de Cábala: abre el popup con la galería (de momento,
              // estado vacío con las ilustraciones que llegarán).
              extra={{ label: "Ilustraciones", onClick: () => setIlustracionesOpen(true), icon: <EyeIcon /> }}
              next={{ label: "El Árbol de la Vida →", onClick: comenzar }}
            />
          </Reveal>

          {/* ── Bienvenida contemplativa ── */}
          <Reveal direction="up" distance={28} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
              <DisciplinaBgLayer nom={cabalaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} pt={{ base: 6, md: 8 }} pb={{ base: 10, md: 14 }} textAlign="center">
                <Text
                  color={cabalaTxt}
                  fontSize={{ base: "lg", md: "xl" }}
                  lineHeight="1.9"
                  opacity={0.92}
                  maxW="620px"
                  mx="auto"
                  mb={4}
                  style={{ textShadow: INK_SHADOW }}
                >
                  La Cábala es una de las tradiciones místicas más antiguas; es un mapa simbólico de cómo
                  la luz infinita desciende hasta la materia y de cómo el alma puede recorrer ese mismo
                  camino de vuelta a su origen.
                </Text>
                <Text
                  color={cabalaTxt}
                  fontSize={{ base: "lg", md: "xl" }}
                  lineHeight="1.9"
                  opacity={0.92}
                  maxW="620px"
                  mx="auto"
                  style={{ textShadow: INK_SHADOW }}
                >
                  Su corazón es el <Box as="span" fontStyle="italic" color={cabalaTxt}>Árbol de la Vida</Box>:
                  diez esferas —las sefirot— unidas por senderos que representan las fuerzas que nos
                  habitan. En este recorrido las iremos descubriendo una a una, para reconocerlas en ti
                  y que estén al servicio de tu crecimiento personal.
                </Text>
              </Box>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      {/* Intro (1ª vez): cómic del Origen de Cábala. */}
      <IntroComicModal
        isOpen={intro.open}
        vinetas={CABALA_INTRO}
        themeColor={cabalaTxt}
        textColor={cabalaTxt}
        disciplinaBgImage="/img/fondos/cabala.png"
        disciplinaBgColor={cabalaBg}
        continueLabel="Cábala"
        onContinue={intro.close}
        onFinish={intro.finish}
        onClose={intro.close}
      />

      <CabalaIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />

      <SiteFooter />

      <PagoCabalaModal
        isOpen={pagoOpen && !suscrito}
        onClose={() => setPagoOpen(false)}
        onPagar={pagarCabala}
        loading={pagoLoading}
        error={pagoError}
      />

      <IndiceCabala />
    </Box>
  );
}
