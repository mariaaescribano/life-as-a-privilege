import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { CursoCardDetalle } from "../../components/aprendizaje/CursoCardDetalle";
import { CursosGrid } from "../../components/aprendizaje/CursosGrid";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceAyurveda } from "../../components/metodo/IndiceAyurveda";
import { PagoTcmModal } from "../../components/metodo/PagoTcmModal";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { Reveal } from "../../components/global/Reveal";
import { useCursosData } from "../../data/cursosApi";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL, ayurvedaBg, ayurvedaNom, ayurvedaNomLink, ayurvedaTxt, AyurvedaIcon, CandadoIcon,
} from "../../GlobalVariables";
import type { DoshaKey } from "../../hardCoded/metodo/doshaIntro";

export default function MetodoAyurvedaDoshaCursos() {
  const navigate = useNavigate();
  const { dosha } = useParams<{ dosha: string }>();
  const doshaKey = (["vata", "pitta", "kapha"].includes(dosha || "") ? dosha : null) as DoshaKey | null;
  const { cursosData, loading } = useCursosData();
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();

  // Desbloqueo de la 4ª disciplina (Medicina China), mismo diseño que
  // Astrología→Psicología: botón con candado que abre el pago. El backend de
  // pago de TCM (endpoint /payment/tcm, columna tcm_suscrito, scope 'tcm') aún
  // no existe; el flujo queda cableado para cuando se añada.
  const [tcmSuscrito, setTcmSuscrito] = useState(false);
  const [pagoTcmOpen, setPagoTcmOpen] = useState(false);
  const [pagoTcmLoading, setPagoTcmLoading] = useState(false);
  const [pagoTcmError, setPagoTcmError] = useState<string | null>(null);
  const [testPagos, setTestPagos] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!doshaKey) { navigate("/metodo/ayurveda/tarjetas", { replace: true }); return; }
    axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.data?.ayurveda_suscrito) navigate("/metodo/ayurveda");
        setTcmSuscrito(!!res.data?.tcm_suscrito);
      })
      .catch(() => {});
    axios.get(`${API_URL}/payment/test/enabled`)
      .then((res) => setTestPagos(!!res.data?.enabled))
      .catch(() => {});
  }, [navigate, doshaKey]);

  // El botón "Med. China" se desbloquea al pagar la 4ª disciplina. Mientras no
  // esté pagada, el clic abre el pago (en vez de navegar directamente).
  const onMedChina = () => {
    if (tcmSuscrito) navigate("/metodo/tcm");
    else { setPagoTcmError(null); setPagoTcmOpen(true); }
  };

  const pagarTcm = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoTcmLoading(true);
    setPagoTcmError(null);
    try {
      const res = await axios.post(
        `${API_URL}/payment/tcm/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data?.url) { window.location.href = res.data.url; return; }
      setPagoTcmError("No se pudo obtener la URL de pago. Inténtalo de nuevo.");
      setPagoTcmLoading(false);
    } catch (err: any) {
      const status = err?.response?.status;
      setPagoTcmError(
        status === 403
          ? "Necesitas completar el pago de Ayurveda antes de adquirir la Medicina China."
          : err?.response?.data?.message || err?.message || "Error desconocido",
      );
      setPagoTcmLoading(false);
    }
  };

  const testUnlockTcm = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    try {
      await axios.post(
        `${API_URL}/payment/test/unlock`,
        { scope: "tcm" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate("/metodo/tcm");
    } catch (err: any) {
      setPagoTcmError(err?.response?.data?.message || "No se pudo activar el modo test.");
    }
  };

  const cursos = [...(cursosData[ayurvedaNomLink]?.cursos ?? [])].sort(
    (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );
  // No mostramos las tarjetas hasta que las portadas estén descargadas.
  const fotosListas = usePrecargarImagenes(cursos.map((c) => c.foto));

  if (!doshaKey) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1280px" gap={6}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<AyurvedaIcon size={{ base: "40px", md: "52px" }} />}
            title="Cursos para profundizar"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: "← Tu Mapa", onClick: () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/recorrido`) }}
            extra={ilustracionesBtn}
            next={{ label: tcmSuscrito ? "Med. China →" : <>Med. China <CandadoIcon size="14px" /></>, onClick: onMedChina }}
          />
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%" display="flex" justifyContent="center">
          <Text
            color="rgba(255,255,255,0.88)"
            fontSize={{ base: "md", md: "lg" }}
            fontStyle="italic"
            textAlign="center"
            lineHeight="1.8"
            maxW="680px"
          >
            Si quieres profundizar en el Ayurveda, estos cursos te acompañan paso a paso.
          </Text>
          </Reveal>

          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          {loading || !fotosListas ? (
            <SpinnerTurquesa fullScreen={false} />
          ) : cursos.length > 0 ? (
            cursos.length === 1 ? (
              <Flex
                w="100%"
                justify="center"
                sx={{ "@keyframes cursoCardIn": { from: { opacity: 0, transform: "translateY(40px) scale(0.95)" }, to: { opacity: 1, transform: "translateY(0) scale(1)" } } }}
              >
                <Box w="100%" maxW="520px" style={{ opacity: 0, animation: "cursoCardIn 0.55s cubic-bezier(0.22,1,0.36,1) 0s forwards" }}>
                  <CursoCardDetalle curso={cursos[0]} bgColor={ayurvedaBg} color={ayurvedaTxt} nom={ayurvedaNom} />
                </Box>
              </Flex>
            ) : (
              <CursosGrid
                items={cursos.map((curso) => ({
                  curso,
                  color: ayurvedaTxt,
                  bgColor: ayurvedaBg,
                  nom: ayurvedaNom,
                }))}
              />
            )
          ) : (
            <Box
              position="relative"
              w="100%"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${ayurvedaTxt}1a, 0 0 48px ${ayurvedaTxt}10`}
            >
              <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}22`} />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }} textAlign="center">
                <Text color={`${ayurvedaTxt}cc`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.8">
                  Pronto encontrarás aquí los cursos de Ayurveda.
                </Text>
              </Box>
            </Box>
          )}
          </Reveal>
        </Flex>
      </Flex>

      {ilustracionesModal}

      <PagoTcmModal
        isOpen={pagoTcmOpen}
        onClose={() => { setPagoTcmOpen(false); setPagoTcmError(null); }}
        onPagar={pagarTcm}
        loading={pagoTcmLoading}
        error={pagoTcmError}
        onTest={testPagos ? testUnlockTcm : undefined}
      />

      <IndiceAyurveda />
      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />
      <SiteFooter />
    </Box>
  );
}
