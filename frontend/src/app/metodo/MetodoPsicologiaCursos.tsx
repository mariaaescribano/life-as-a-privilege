// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · CURSOS PARA PROFUNDIZAR  (paso 23/23 · cierra psicología)
//
// Va DESPUÉS de la Síntesis: cuando la persona ya ha recorrido su mapa entero
// y se ha descargado su cuaderno, aquí encuentra por dónde seguir si quiere ir
// más hondo. Y es el paso que enlaza con Ayurveda (con el pago si aún no está
// desbloqueado), por ser ahora el verdadero final del recorrido.
//
// Los cursos NO se escriben aquí: salen del catálogo (tabla `curso`) por
// `useCursosData`, igual que en el resto de disciplinas. Añadir un curso de
// psicología = añadirlo al catálogo, no tocar este archivo.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { PsicologiaLoading, PsicologiaLoader } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { TextoLetraALetra } from "../../components/global/TextoLetraALetra";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceRecorrido } from "../../components/metodo/IndiceRecorrido";
import { PagoAyurvedaModal } from "../../components/metodo/PagoAyurvedaModal";
import {
  CursoCard, STRIPE_PAYMENT_LINK_CURSOS_PSICOLOGIA,
} from "../../components/metodo/CursosPsicologiaModal";
import { recordarOrigenCurso } from "../../components/global/VolverAlMapa";
import { useCursosData } from "../../data/cursosApi";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { experienciaById } from "../../components/metodo/psicologiaRecorrido";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import type { Curso } from "../../hardCoded/cursos";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";
import { irAPagoDisciplina } from "../../components/metodo/pagoDisciplinaLink";

const TINTA = neuropsicologiaTxt;  // marrón tinta
const PAPEL = "#fbf4e8";           // crema claro
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaCursos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [ayurvedaSuscrito, setAyurvedaSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const { cursosData, loading: cursosLoading } = useCursosData();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }
        setAyurvedaSuscrito(!!me.data?.ayurveda_suscrito);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  // Enlace con Ayurveda: abre el pago si aún no está desbloqueado.
  const onAyurveda = () => {
    if (ayurvedaSuscrito) navigate("/metodo/ayurveda");
    else { setPagoError(null); setPagoOpen(true); }
  };

  const pagarAyurveda = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    const errPago = irAPagoDisciplina("ayurveda");
    if (errPago) {
      setPagoError(errPago);
      setPagoLoading(false);
    }
  };

  const cursos = [...(cursosData[neuropsicologiaNom]?.cursos ?? [])].sort(
    (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );

  // No enseñamos la rejilla hasta que las portadas estén descargadas: si no, las
  // tarjetas aparecen a medio pintar.
  const fotosListas = usePrecargarImagenes(cursos.map((c) => c.foto).filter(Boolean) as string[]);

  // Los cursos gratuitos se abren dentro de la web (y se recuerda de dónde
  // venimos, para el botón «Volver a El Recorrido»); los de pago van a Stripe.
  const acceder = (curso: Curso) => {
    if (curso.precio === null) {
      recordarOrigenCurso();
      navigate(`${curso.cursoLink}?volver=${encodeURIComponent(location.pathname)}`);
    } else {
      window.open(STRIPE_PAYMENT_LINK_CURSOS_PSICOLOGIA, "_blank");
    }
  };

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="1080px" gap={{ base: 6, md: 8 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
                title="Cursos para profundizar"
                bgColor={`${neuropsicologiaBg}f0`}
                color={neuropsicologiaTxt}
                nom={neuropsicologiaNom}
                maxW="100%"
                step={{ current: 23, total: 23 }}
                mb={0}
                boxShadow={glowHeader}
                prev={{ label: "← Síntesis", onClick: () => navigate(`/metodo/psicologia/${exp.id}/sintesis`) }}
                next={{ label: "Ayurveda →", onClick: onAyurveda }}
              />
            </Reveal>

            {/* Intro */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
              <IntroRecorrido>
                Ya has recorrido tu mapa entero. Si quieres seguir tirando del hilo, estos
                cursos te llevan más adentro de lo que aquí solo hemos podido asomar.
              </IntroRecorrido>
            </Reveal>

            {/* ── Panel con los cursos del catálogo ── */}
            <Reveal inView once amount={0.2} direction="up" distance={44} scaleFrom={0.94} blur duration={0.85} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                 border={azulBorde} boxShadow={glowPanel} bgColor={neuropsicologiaBg}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>

                <Flex direction="column" align="center" gap={2} mb={{ base: 6, md: 8 }} textAlign="center">
                  <TextoLetraALetra color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                                    lineHeight="1.2" style={{ textShadow: INK_SHADOW }}
                                    delay={0.3} amount={0.6}>
                    Por dónde seguir
                  </TextoLetraALetra>
                  <Text color={`${TINTA}dd`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                        lineHeight="1.6" maxW="560px" style={{ textShadow: INK_SHADOW }}>
                    Cada uno se puede hacer por su cuenta, en el orden que quieras y a tu ritmo.
                  </Text>
                </Flex>

                {cursosLoading || !fotosListas ? (
                  <Flex minH={{ base: "220px", md: "300px" }} w="100%" align="center" justify="center">
                    <PsicologiaLoader />
                  </Flex>
                ) : cursos.length > 0 ? (
                  <SimpleGrid w="100%" columns={{ base: 1, md: 2 }} spacing={{ base: 5, md: 7 }} alignItems="start">
                    {cursos.map((curso, i) => (
                      <CursoCard key={curso.id} curso={curso} onAcceder={() => acceder(curso)} delay={`${i * 0.07}s`} />
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text color={`${TINTA}dd`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                        textAlign="center" lineHeight="1.8" style={{ textShadow: INK_SHADOW }}>
                    Pronto encontrarás aquí los cursos de Psicología.
                  </Text>
                )}
              </Box>
            </Box>
            </Reveal>

          </Flex>
        </Flex>
      </Box>

      <PagoAyurvedaModal
        isOpen={pagoOpen}
        onClose={() => { setPagoOpen(false); setPagoError(null); }}
        onPagar={pagarAyurveda}
        loading={pagoLoading}
        error={pagoError}
      />

      <BotonCompania color={neuropsicologiaTxt} bgColor={neuropsicologiaBg} disciplinaNom={neuropsicologiaNom} precio={20} llamadaTitulo="Reserva tu llamada de psicología" />

      <IndiceRecorrido progresoKey="psicologia" />
      <SiteFooter />
    </Box>
  );
}
