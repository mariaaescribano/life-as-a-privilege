import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Flex, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { TcmLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { PagoTcmModal } from "../../components/metodo/PagoTcmModal";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { VINETAS_ORIGEN as ORIGEN_TAOISMO, VINETAS_ELEMENTOS } from "../../components/metodo/TCMIlustracionesModal";
import { useIntroComic } from "../../hooks/useIntroComic";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import { irAPagoDisciplina } from "../../components/metodo/pagoDisciplinaLink";

// Tinta rojiza clara con halo oscuro (granate) para leer sobre el fondo de TCM.
const TINTA = tcmTxt;
const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc, 0 2px 16px ${tcmBg}88`;
// Mismo glow ligero que el header (MetodoStepHeader, rama con fondo de disciplina),
// para que todos los boxes queden uniformes.
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

export default function MetodoTcm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [avisoOpen, setAvisoOpen] = useState(false);
  // Cómic de los cinco elementos: se intercala antes de pasar a «Los 5 elementos».
  const [comicElementosOpen, setComicElementosOpen] = useState(false);
  // Al volver a Ayurveda, aterrizamos en su ÚLTIMA página (la de cursos del
  // dosha del usuario), no en el inicio. Se resuelve con el dosha guardado.
  const [volverAyurvedaUrl, setVolverAyurvedaUrl] = useState("/metodo/ayurveda");
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();
  const intro = useIntroComic("metodo-tcm"); // cómic del Origen (taoísmo), 1ª vez

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

        // Resolvemos la última página de Ayurveda a partir del dosha del usuario.
        try {
          const ay = await axios.get(`${API_URL}/ayurveda/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const d = String(ay.data?.dosha ?? "").toLowerCase();
          if (["vata", "pitta", "kapha"].includes(d)) {
            setVolverAyurvedaUrl(`/metodo/ayurveda/dosha/${d}/cursos`);
          }
        } catch { /* sin dosha: se queda el inicio de Ayurveda */ }

        // Prerrequisito: hay que haber pagado Ayurveda (3ª disciplina).
        if (!me.data?.ayurveda_suscrito) { navigate("/home"); return; }

        const tcmSuscrito = !!me.data?.tcm_suscrito;
        setSuscrito(tcmSuscrito);
        if (!tcmSuscrito) { setPagoOpen(true); return; }

        // Ya tiene acceso: si es la 1ª vez, muestra el cómic del Origen (taoísmo).
        void intro.checkAndOpen();
      } catch {
        navigate("/home");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const pagarTcm = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("tcm");
    if (errPago) {
      setPagoError(errPago);
      setPagoLoading(false);
    }
  };

  const comenzar = () => {
    if (!suscrito) { setPagoOpen(true); return; }
    // Antes de pasar a «Los 5 elementos» intercalamos el cómic de los elementos.
    setComicElementosOpen(true);
  };

  if (loading) {
    return <TcmLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Medicina China"
            pageLabel="1/7"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Ayurveda", onClick: () => navigate(volverAyurvedaUrl) }}
            extra={ilustracionesBtn}
            next={{ label: "Los 5 elementos →", onClick: comenzar }}
          />
          </Reveal>

          {/* ── Bienvenida contemplativa ── */}
          <Reveal direction="up" distance={28} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} pt={{ base: 6, md: 8 }} pb={{ base: 10, md: 14 }} textAlign="center">
              <Text
                color={tcmTxt}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.9"
                maxW="600px"
                mx="auto"
                mb={4}
              >
                La Medicina Tradicional China lleva miles de años observando la naturaleza y al ser humano.
                Según esta visión, la salud es el equilibrio dinámico entre tu cuerpo, tus emociones y el entorno que te forma.
              </Text>
              <Text
                color={tcmTxt}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.9"
                maxW="600px"
                mx="auto"
              >
                En este mapa descubrirás tu equilibrio actual entre los cinco elementos, aprenderás a
                reconocer tus desequilibrios y sabrás cómo cuidarte desde esta sabiduría milenaria.
              </Text>
            </Box>
          </Box>
          </Reveal>

          {/* ── Disparador del aviso ── */}
          <Reveal direction="up" distance={18} delay={0.24} duration={0.6} display="flex" justifyContent="center">
          <Box
            as="button"
            onClick={() => setAvisoOpen(true)}
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={6}
            py={2.5}
            borderRadius="full"
            bg="rgba(255,255,255,0.12)"
            color="rgba(255,255,255,0.92)"
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.04em"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: "rgba(255,255,255,0.16)", transform: "translateY(-1px)" }}
          >
            <Box as="span" fontSize="md">⚠</Box> Aviso importante
          </Box>
          </Reveal>
        </Flex>
      </Flex>

      {ilustracionesModal}

      {/* Intro (1ª vez): cómic del Origen según el taoísmo. */}
      <IntroComicModal
        isOpen={intro.open}
        vinetas={ORIGEN_TAOISMO}
        themeColor={tcmTxt}
        disciplinaBgImage="/img/fondos/tcm.webp"
        disciplinaBgColor={tcmBg}
        onFinish={intro.finish}
        onClose={intro.close}
        // Botón «Medicina China →» con la imagen de la disciplina + velo (como
        // «Saltar») y letra en tcmTxt. Se conserva también el «Saltar» a la
        // izquierda, en tcmTxt.
        continueLabel="Medicina China"
        onContinue={intro.close}
        continueConImagen
        mantenerSaltar
        saltarTextColor={tcmTxt}
      />

      {/* Cómic de los cinco elementos: intercalado antes de «Los 5 elementos». */}
      <ComicPasoModal
        isOpen={comicElementosOpen}
        onClose={() => setComicElementosOpen(false)}
        onContinue={() => navigate("/metodo/tcm/elementos")}
        vinetas={VINETAS_ELEMENTOS}
        continueLabel="Los 5 elementos"
        themeColor={tcmTxt}
        disciplinaBgImage="/img/fondos/tcm.webp"
        disciplinaBgColor={tcmBg}
      />

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />

      <PagoTcmModal
        isOpen={pagoOpen && !suscrito}
        onClose={() => setPagoOpen(false)}
        onPagar={pagarTcm}
        loading={pagoLoading}
        error={pagoError}
      />

      {/* ── Aviso importante ── */}
      <Modal isOpen={avisoOpen} onClose={() => setAvisoOpen(false)} isCentered scrollBehavior="inside" size={{ base: "sm", md: "lg" }}>
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(6px)" }} />
        <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} fontFamily="'EB Garamond', serif">
          <Box position="relative" borderRadius="2xl" overflow="hidden" boxShadow={`0 0 24px ${tcmTxt}40, 0 0 60px ${tcmTxt}26, 0 26px 70px rgba(40,4,4,0.6)`}>
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <ModalCloseButton color={TINTA} zIndex={3} />
            <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 8, md: 10 }}>
              <Flex direction="column" gap={4}>
                <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.04em"
                      textAlign="center" style={{ textShadow: INK_SHADOW }}>
                  Importante
                </Text>
                <Box h="1px" w="55%" maxW="220px" mx="auto" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.75"
                      style={{ textShadow: INK_SHADOW }}>
                  Este mapa tiene un fin educativo y de autoconocimiento.
                </Text>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                      style={{ textShadow: INK_SHADOW }}>
                  No constituye un diagnóstico clínico ni sustituye la valoración realizada por un profesional
                  cualificado en medicina tradicional china o en medicina convencional. Si atraviesas un problema
                  de salud, busca acompañamiento profesional.
                </Text>
              </Flex>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
}
