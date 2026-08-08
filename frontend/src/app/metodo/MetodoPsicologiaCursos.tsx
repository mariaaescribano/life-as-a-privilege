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
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { PsicologiaLoading, PsicologiaLoader } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceRecorrido } from "../../components/metodo/IndiceRecorrido";
import { PagoAyurvedaModal } from "../../components/metodo/PagoAyurvedaModal";
import { CursoCardDetalle } from "../../components/aprendizaje/CursoCardDetalle";
import { CursosGrid } from "../../components/aprendizaje/CursosGrid";
import { useCursosData } from "../../data/cursosApi";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { experienciaById } from "../../components/metodo/psicologiaRecorrido";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
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

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        {/* Mismos márgenes que Materiales (CursosModalidad) y SIN maxW: la rejilla
            ocupa el ancho de la pantalla, con las tarjetas grandes, igual que en
            /aprendizaje/cursos/psicologia. */}
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 8, lg: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" gap={{ base: 6, md: 8 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
                title="Cursos para profundizar"
                bgColor={`${neuropsicologiaBg}f0`}
                color={neuropsicologiaTxt}
                nom={neuropsicologiaNom}
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

            {/* ── Cursos del catálogo ──
                Las tarjetas van SUELTAS sobre el turquesa, exactamente como en
                Materiales (CursosGrid → CursoCardDetalle): sin panel de acuarela
                alrededor, que metía las fotos dentro de una caja y las apagaba. */}
            {cursosLoading || !fotosListas ? (
              <Flex minH={{ base: "220px", md: "300px" }} w="100%" align="center" justify="center">
                <PsicologiaLoader />
              </Flex>
            ) : cursos.length === 1 ? (
              <Flex
                w="100%"
                justify="center"
                sx={{
                  "@keyframes cursoCardIn": {
                    from: { opacity: 0, transform: "translateY(40px) scale(0.95)" },
                    to:   { opacity: 1, transform: "translateY(0)    scale(1)"    },
                  },
                }}
              >
                <Box
                  w="100%"
                  maxW="520px"
                  style={{ opacity: 0, animation: "cursoCardIn 0.55s cubic-bezier(0.22,1,0.36,1) 0s forwards" }}
                >
                  <CursoCardDetalle
                    curso={cursos[0]}
                    bgColor={neuropsicologiaBg}
                    color={neuropsicologiaTxt}
                    nom={neuropsicologiaNom}
                  />
                </Box>
              </Flex>
            ) : cursos.length > 1 ? (
              <CursosGrid
                items={cursos.map((curso) => ({
                  curso,
                  color: neuropsicologiaTxt,
                  bgColor: neuropsicologiaBg,
                  nom: neuropsicologiaNom,
                }))}
              />
            ) : (
              <Reveal inView once amount={0.2} direction="up" distance={34} scaleFrom={0.97} duration={0.75}
                      position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                      border={azulBorde} boxShadow={glowPanel}>
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }} textAlign="center">
                  <Text color={`${TINTA}dd`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                        lineHeight="1.8" style={{ textShadow: INK_SHADOW }}>
                    Pronto encontrarás aquí los cursos de Psicología.
                  </Text>
                </Box>
              </Reveal>
            )}

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
