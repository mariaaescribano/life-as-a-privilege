import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { PagoNutricionModal } from "../../components/metodo/PagoNutricionModal";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { ComicCaloriasModal } from "../../components/metodo/ComicCaloriasModal";
import { NUTRICION_INTRO } from "../../components/metodo/comicNutricionIntro";
import { useIntroComic } from "../../hooks/useIntroComic";
import { BotonCompania } from "../../components/global/BotonCompania";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import {
  API_URL,
  nutricionBg,
  nutricionNom,
  nutricionTxt,
  NutricionIcon,
} from "../../GlobalVariables";

// La imagen de fondo (nutri.png) es clara y se muestra tal cual (sin velo), así
// que el texto va en verde oscuro (nutricionTxt) con un halo claro que lo
// despega de las zonas de la foto con más detalle.
const TXT_HALO = `0 1px 2px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.75), 0 0 22px rgba(228,248,225,0.6)`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,222,170,0.14), 0 0 20px ${nutricionTxt}1a`;

export default function MetodoNutricion() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [testPagos, setTestPagos] = useState(false);
  const [caloriasOpen, setCaloriasOpen] = useState(false); // cómic de transición a nutrientes
  const intro = useIntroComic("metodo-nutricion"); // cómic de intro, 1ª vez

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        let testEnabled = false;
        try {
          const t = await axios.get(`${API_URL}/payment/test/enabled`);
          testEnabled = !!t.data?.enabled;
        } catch { /* sin modo test */ }
        setTestPagos(testEnabled);

        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Prerrequisito: hay que haber pagado Fisiología (5ª disciplina). En modo
        // test dejamos ver el pago igualmente (el fake-pay desbloquea la cadena).
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/home"); return; }

        const nutriSuscrito = !!me.data?.nutricion_suscrito;
        setSuscrito(nutriSuscrito);
        if (!nutriSuscrito) { setPagoOpen(true); return; }

        // Ya tiene acceso: si es la 1ª vez, muestra el cómic de intro.
        void intro.checkAndOpen();
      } catch {
        navigate("/home");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const pagarNutricion = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    try {
      const res = await axios.post(
        `${API_URL}/payment/nutricion/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data?.url) { window.location.href = res.data.url; return; }
      setPagoError("No se pudo obtener la URL de pago. Inténtalo de nuevo.");
      setPagoLoading(false);
    } catch (err: any) {
      const status = err?.response?.status;
      setPagoError(
        status === 403
          ? "Necesitas completar el pago de Fisiología antes de adquirir la Nutrición."
          : err?.response?.data?.message || err?.message || "Error desconocido",
      );
      setPagoLoading(false);
    }
  };

  const testUnlock = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    try {
      await axios.post(
        `${API_URL}/payment/test/unlock`,
        { scope: "nutricion" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuscrito(true);
      setPagoOpen(false);
      void intro.checkAndOpen();
    } catch (err: any) {
      setPagoError(err?.response?.data?.message || "No se pudo activar el modo test.");
    }
  };

  const comenzar = () => {
    if (!suscrito && !testPagos) { setPagoOpen(true); return; }
    setCaloriasOpen(true); // cómic de transición «Las calorías no existen»
  };
  const caloriasContinuar = () => { setCaloriasOpen(false); navigate("/metodo/nutricion/nutrientes"); };

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
            icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
            title="Nutrición"
            compact
            bgColor={`${nutricionBg}dd`}
            color={nutricionTxt}
            nom={nutricionNom}
            mb={0}
            prev={{ label: "← Fisiología", onClick: () => navigate("/metodo/fisiologia/cursos") }}
            extra={{ label: "Biblioteca", onClick: () => navigate("/metodo/nutricion/alimentos") }}
            next={{ label: "Comenzar →", onClick: comenzar }}
          />
          </Reveal>

          {/* ── Bienvenida contemplativa ── */}
          <Reveal direction="up" distance={28} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
              {/* La foto de la disciplina se ve tal cual, sin velo oscuro: nutri.png
                  es clara y el texto va en nutricionTxt (verde oscuro). */}
              <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} pt={{ base: 8, md: 10 }} pb={{ base: 10, md: 14 }} textAlign="center">
                {[
                  "En esta disciplina explorarás cómo eres lo que comes; para ser exactos, eres lo que absorbes. Descubrirás cómo las moléculas que componen tus alimentos están al servicio de tu reconstrucción o de tu destrucción.",
                ].map((parrafo, i) => (
                  <Text
                    key={`a-${i}`}
                    color={nutricionTxt}
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="600"
                    lineHeight="1.95"
                    maxW="600px"
                    mx="auto"
                    style={{ textShadow: TXT_HALO }}
                  >
                    {parrafo}
                  </Text>
                ))}

                {/* Separador horizontal elegante: línea que se desvanece en los
                    extremos con un pequeño rombo central. */}
                <Flex align="center" justify="center" gap={3} my={{ base: 6, md: 8 }} maxW="600px" mx="auto">
                  <Box
                    flex="1"
                    h="1px"
                    bgGradient={`linear(to-r, ${nutricionTxt}00, ${nutricionTxt}66)`}
                  />
                  <Box
                    w="7px"
                    h="7px"
                    transform="rotate(45deg)"
                    bg={nutricionTxt}
                    opacity={0.7}
                    flexShrink={0}
                  />
                  <Box
                    flex="1"
                    h="1px"
                    bgGradient={`linear(to-r, ${nutricionTxt}66, ${nutricionTxt}00)`}
                  />
                </Flex>

                {[
                  "Aquí no hay juicios: ningún alimento es, por sí mismo, bueno o malo, pero sus moléculas sí pueden ser dañinas o beneficiosas. Comprenderás cómo las moléculas de tu comida se transforman, literalmente, en ti.",
                ].map((parrafo, i) => (
                  <Text
                    key={`b-${i}`}
                    color={nutricionTxt}
                    fontSize={{ base: "md", md: "lg" }}
                    fontWeight="600"
                    lineHeight="1.95"
                    maxW="600px"
                    mx="auto"
                    style={{ textShadow: TXT_HALO }}
                  >
                    {parrafo}
                  </Text>
                ))}
              </Box>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      {/* Intro (1ª vez): cómic de bienvenida de Nutrición. */}
      <IntroComicModal
        isOpen={intro.open}
        vinetas={NUTRICION_INTRO}
        themeColor={nutricionBg}
        textColor={nutricionTxt}
        disciplinaBgImage="/img/fondos/nutri.png"
        disciplinaBgColor={nutricionBg}
        textShadow="none"
        onFinish={intro.finish}
        onClose={intro.close}
      />

      {/* Transición a Los nutrientes: cómic «Las calorías no existen». */}
      <ComicCaloriasModal
        isOpen={caloriasOpen}
        onContinue={caloriasContinuar}
        onClose={() => setCaloriasOpen(false)}
      />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />

      <SiteFooter />

      <PagoNutricionModal
        isOpen={pagoOpen && !suscrito}
        onClose={() => setPagoOpen(false)}
        onPagar={pagarNutricion}
        loading={pagoLoading}
        error={pagoError}
        onTest={testPagos ? testUnlock : undefined}
      />
    </Box>
  );
}
