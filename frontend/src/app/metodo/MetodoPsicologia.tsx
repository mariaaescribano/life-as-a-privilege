import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Flex, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { PagoPsicologiaModal } from "../../components/metodo/PagoPsicologiaModal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { INTRO_PSICOLOGIA } from "../../components/metodo/comicPsicologiaIntro";
import { useIntroComic } from "../../hooks/useIntroComic";
import { EXPERIENCIAS } from "../../components/metodo/psicologiaRecorrido";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import { Reveal } from "../../components/global/Reveal";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";
import { irAPagoDisciplina } from "../../components/metodo/pagoDisciplinaLink";

// Tinta cálida con halo claro (crema + color de la disciplina) para que se lea
// bien sobre el fondo de acuarela.
const TINTA = neuropsicologiaTxt;
const INK_SHADOW = `0 1px 2px #fbf4e8, 0 0 6px #fbf4e8, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologia() {
  const navigate = useNavigate();
  const experiencia = EXPERIENCIAS[0];
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [avisoOpen, setAvisoOpen] = useState(false);
  const intro = useIntroComic("metodo-psicologia"); // cómic de intro, 1ª vez

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
        const psicoSuscrito = !!me.data?.psicologia_suscrito;
        setSuscrito(psicoSuscrito);
        if (!psicoSuscrito) { setPagoOpen(true); return; }

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

  const pagarPsicologia = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("psicologia");
    if (errPago) {
      setPagoError(errPago);
      setPagoLoading(false);
    }
  };

  // Continuar a la página de Problema.
  const irAProblema = () => {
    if (!suscrito) { setPagoOpen(true); return; }
    navigate(`/metodo/psicologia/${experiencia.id}/problema`);
  };

  if (loading) {
    return <PsicologiaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "40px", md: "56px" }} />}
              title="Vuelve a ti"
              pageLabel="1/22"
              bgColor={`${neuropsicologiaBg}dd`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: "← Volver a Astrología", onClick: () => navigate("/metodo/astrologia/cursos") }}
              next={{
                label: "Problema →",
                onClick: irAProblema,
              }}
            />
          </Reveal>

          {/* ── Intro contemplativa (misma fuerza que el header: sin velo) ── */}
          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={azulBorde}
            boxShadow={glowPanel}
          >
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} pt={{ base: 6, md: 8 }} pb={{ base: 10, md: 14 }} textAlign="center">
              <Text
                color={TINTA}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.8"
                maxW="560px"
                mx="auto"
                style={{ textShadow: INK_SHADOW }}
              >
                Nuestra historia marca nuestra Vida, todo lo que no hemos gestionado o que hemos callado sigue pulsando y guiando nuestro pensamiento. En este mapa te conocerás en profundidad y verás con claridad dónde estás, por qué y para qué. El propósito es volver a unir tus fragmentaciones.
              </Text>

              {/* ── Recomendación: no hacerlo en solitario ── */}
              <Box mt={{ base: 7, md: 9 }} mx="auto" maxW="560px">
                <Box h="1px" w="55%" maxW="220px" mx="auto" mb={{ base: 6, md: 7 }} bgGradient={`linear(to-r, transparent, ${TINTA}55, transparent)`} />
                <Text
                  color={TINTA}
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="700"
                  letterSpacing="0.04em"
                  lineHeight="1.6"
                  mb={3}
                  style={{ textShadow: INK_SHADOW }}
                >
                  Se recomienda no hacer este mapa de manera individual.
                </Text>
                <Text
                  color={TINTA}
                  fontSize={{ base: "sm", md: "md" }}
                  lineHeight="1.8"
                  style={{ textShadow: INK_SHADOW }}
                >
                  Aunque si llevas años en terapia y trabajando en ti, es posible. Sea como sea, siempre tendrás el botón abajo a la derecha por si necesitas mi ayuda.
                </Text>
              </Box>
            </Box>
          </Box>
          </Reveal>

          {/* ── Disparador del aviso: abre el popup en mitad de la página ── */}
          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.22} duration={0.75} w="100%" display="flex" justifyContent="center">
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
            <Box as="span" fontSize="md">⚠</Box> Aviso importante
          </Box>
          </Reveal>
        </Flex>
      </Flex>

      {/* Intro (1ª vez): cómic de psicología (nuestra historia / apego). */}
      <IntroComicModal
        isOpen={intro.open}
        vinetas={INTRO_PSICOLOGIA}
        themeColor={neuropsicologiaTxt}
        disciplinaBgImage="/img/fondos/psciologia.webp"
        disciplinaBgColor={neuropsicologiaBg}
        textShadow={`0 1px 2px #fbf4e8, 0 0 6px #fbf4e8, 0 0 13px ${neuropsicologiaBg}`}
        onFinish={intro.finish}
        onClose={intro.close}
        continueLabel="Psicología"
        onContinue={intro.close}
      />

      <AyudaRecorrido pagina="inicio" />

      <SiteFooter />

      <PagoPsicologiaModal
        isOpen={pagoOpen && !suscrito}
        onClose={() => setPagoOpen(false)}
        onPagar={pagarPsicologia}
        loading={pagoLoading}
        error={pagoError}
      />

      {/* ── Aviso importante (popup centrado, estilo acuarela) ── */}
      <Modal isOpen={avisoOpen} onClose={() => setAvisoOpen(false)} isCentered scrollBehavior="inside" size={{ base: "sm", md: "lg" }}>
        <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(6px)" }} />
        <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} fontFamily="'EB Garamond', serif">
          <Box position="relative" borderRadius="2xl" overflow="hidden" boxShadow={`0 26px 70px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <ModalCloseButton color={TINTA} zIndex={3} />
            <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 8, md: 10 }}>
              <Flex direction="column" gap={4}>
                <Flex align="center" justify="center" gap={2.5}>
                  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="28px" h="28px" fill={TINTA} flexShrink={0}
                       style={{ filter: "drop-shadow(0 1px 2px #fbf4e8) drop-shadow(0 0 6px #fbf4e8)" }}>
                    <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
                  </Box>
                  <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.04em"
                        style={{ textShadow: INK_SHADOW }}>
                    Importante
                  </Text>
                </Flex>
                <Box h="1px" w="55%" maxW="220px" mx="auto" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.75"
                      style={{ textShadow: INK_SHADOW }}>
                  Este mapa no sustituye una terapia psicológica ni una evaluación profesional.
                </Text>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                      style={{ textShadow: INK_SHADOW }}>
                  Su propósito es ayudarte a ordenar tu historia, comprender mejor tus patrones y construir una narrativa más consciente sobre tu Vida.
                </Text>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" opacity={0.92}
                      style={{ textShadow: INK_SHADOW }}>
                  Si estás atravesando un momento de sufrimiento importante o necesitas apoyo especializado, te recomiendo buscar ayuda profesional.
                </Text>
              </Flex>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
}
