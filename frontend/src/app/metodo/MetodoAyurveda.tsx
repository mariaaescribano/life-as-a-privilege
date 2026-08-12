import React, { useEffect, useState } from "react";
import { useT } from "../../i18n";
import { useNavigate } from "react-router-dom";
import {
  Box, Flex, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyurvedaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { Reveal } from "../../components/global/Reveal";
import { PagoAyurvedaModal } from "../../components/metodo/PagoAyurvedaModal";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { VINETAS_ORIGEN as ORIGEN_HINDUISMO } from "../../components/metodo/HinduismoIlustracionesModal";
import { useComic } from "../../i18n/comics";
import { useIntroComic } from "../../hooks/useIntroComic";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceAyurveda } from "../../components/metodo/IndiceAyurveda";
import {
  API_URL,
  ayurvedaBg,
  ayurvedaNom,
  ayurvedaTxt,
  AyurvedaIcon,
} from "../../GlobalVariables";
import { irAPagoDisciplina } from "../../components/metodo/pagoDisciplinaLink";

// Tinta cálida con halo crema para que se lea sobre el fondo de acuarela de
// Hinduismo (mismo lenguaje visual que el recorrido de Psicología).
const TINTA = ayurvedaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${ayurvedaBg}`;
const glowPanel = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${ayurvedaTxt}1a, 0 0 48px ${ayurvedaTxt}10`;

export default function MetodoAyurveda() {
  const t = useT();
  // El cómic del Origen (con las ilustraciones de Hinduismo) en el idioma activo.
  const origenVinetas = useComic("hinduismo-origen", ORIGEN_HINDUISMO);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [avisoOpen, setAvisoOpen] = useState(false);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();
  const intro = useIntroComic("metodo-ayurveda"); // cómic del Origen (hinduismo), 1ª vez

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Sin prerrequisitos: el orden del Mapa es el ACONSEJADO, no obligatorio.
        // Se puede entrar aquí sin haber hecho las anteriores; lo único que hace
        // falta es tener esta disciplina desbloqueada (si no, sale su pago).
        const ayurSuscrito = !!me.data?.ayurveda_suscrito;
        setSuscrito(ayurSuscrito);
        if (!ayurSuscrito) { setPagoOpen(true); return; }

        // Ya tiene acceso: si es la 1ª vez, muestra el cómic del Origen (hinduismo).
        void intro.checkAndOpen();
      } catch {
        navigate("/home");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const pagarAyurveda = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("ayurveda");
    if (errPago) {
      setPagoError(errPago);
      setPagoLoading(false);
    }
  };

  if (loading) {
    return <AyurvedaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<AyurvedaIcon size={{ base: "40px", md: "56px" }} />}
            title={t("metodo.gate.ayurveda.titulo")}
            pageLabel="1/4"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: "← Psicología", onClick: () => navigate("/metodo/psicologia/linea-de-Vida/cursos") }}
            extra={ilustracionesBtn}
            next={{
              label: "Test →",
              onClick: () => navigate("/metodo/ayurveda/test"),
            }}
          />
          </Reveal>

          {/* ── Intro contemplativa ── */}
          <Reveal direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow={glowPanel}
          >
            <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} pt={{ base: 6, md: 8 }} pb={{ base: 10, md: 14 }} textAlign="center">
              <Text
                color={TINTA}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.85"
                opacity={1}
                maxW="600px"
                mx="auto"
              >
                {t("metodo.gate.ayurveda.intro1")}
              </Text>
              <Text
                color={TINTA}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.85"
                opacity={1}
                maxW="600px"
                mx="auto"
                mt={{ base: 4, md: 5 }}
              >
                {t("metodo.gate.ayurveda.intro2")}
              </Text>
            </Box>
          </Box>
          </Reveal>

          {/* ── Disparador del aviso ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%" display="flex" justifyContent="center">
          <Box
            as="button"
            onClick={() => setAvisoOpen(true)}
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={6}
            py={2.5}
            borderRadius="full"
            bg="rgba(255,255,255,0.08)"
            border="1px solid rgba(255,255,255,0.4)"
            color="rgba(255,255,255,0.92)"
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.04em"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: "rgba(255,255,255,0.16)", transform: "translateY(-1px)" }}
          >
            <Box as="span" fontSize="md">⚠</Box> {t("metodo.gate.avisoImportante")}
          </Box>
          </Reveal>
        </Flex>
      </Flex>

      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />
      <IndiceAyurveda />

      <SiteFooter />

      <PagoAyurvedaModal
        isOpen={pagoOpen && !suscrito}
        onClose={() => { setPagoOpen(false); navigate("/home"); }}
        onPagar={pagarAyurveda}
        loading={pagoLoading}
        error={pagoError}
      />

      {ilustracionesModal}

      {/* Intro (1ª vez): cómic del Origen con ilustraciones de hinduismo. */}
      <IntroComicModal
        isOpen={intro.open}
        vinetas={origenVinetas}
        themeColor={ayurvedaTxt}
        disciplinaBgImage="/img/fondos/hinduismo.webp"
        disciplinaBgColor={ayurvedaBg}
        textShadow={`0 0 6px ${ayurvedaBg}, 0 0 14px ${ayurvedaBg}, 0 0 26px ${ayurvedaBg}cc`}
        onFinish={intro.finish}
        onClose={intro.close}
        // Botón «Ayurveda →» a la izquierda de la X: entra a la portada (cerrar el
        // cómic la revela). Fondo con la imagen de la disciplina + velo y letra en
        // ayurvedaTxt. Sin «Saltar» (el botón de continuar ya cumple esa función).
        continueLabel={t("disciplina.ayurveda")}
        onContinue={intro.close}
        continueConImagen
      />

      {/* ── Aviso importante (popup centrado, estilo acuarela) ── */}
      <Modal isOpen={avisoOpen} onClose={() => setAvisoOpen(false)} isCentered scrollBehavior="inside" size={{ base: "sm", md: "lg" }}>
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(6px)" }} />
        <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} fontFamily="'EB Garamond', serif">
          <Box position="relative" borderRadius="2xl" overflow="hidden" boxShadow={`0 26px 70px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" />
            <ModalCloseButton color={TINTA} zIndex={3} />
            <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 8, md: 10 }}>
              <Flex direction="column" gap={4}>
                <Flex align="center" justify="center" gap={2.5}>
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="28px" h="28px" fill={TINTA} flexShrink={0}
                       style={{ filter: `drop-shadow(0 1px 2px ${PAPEL}) drop-shadow(0 0 6px ${PAPEL})` }}>
                    <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
                  </Box>
                  <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.04em"
                        style={{ textShadow: INK_SHADOW }}>
                    {t("metodo.gate.importante")}
                  </Text>
                </Flex>
                <Box h="1px" w="55%" maxW="220px" mx="auto" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.75"
                      style={{ textShadow: INK_SHADOW }}>
                  {t("metodo.gate.ayurveda.aviso1")}
                </Text>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                      style={{ textShadow: INK_SHADOW }}>
                  {t("metodo.gate.ayurveda.aviso2")}
                </Text>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                      style={{ textShadow: INK_SHADOW }}>
                  {t("metodo.gate.ayurveda.aviso3")}
                </Text>
              </Flex>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
}
