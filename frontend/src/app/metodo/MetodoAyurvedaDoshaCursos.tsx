import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyurvedaLoading, AyurvedaLoader } from "../../components/metodo/comicLoaders";
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
  API_URL, ayurvedaBg, ayurvedaNom, ayurvedaNomLink, ayurvedaTxt, AyurvedaIcon,
} from "../../GlobalVariables";
import { useT } from "../../i18n";
import type { DoshaKey } from "../../hardCoded/metodo/doshaIntro";
import { irAPagoDisciplina } from "../../components/metodo/pagoDisciplinaLink";

// Candado blanco con brillo (mismo que Nutrición/Fisiología Cursos).
const Candado = ({ size }: { size: any }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill={ayurvedaTxt}
       style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

export default function MetodoAyurvedaDoshaCursos() {
  const t = useT();
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!doshaKey) { navigate("/metodo/ayurveda/tarjetas", { replace: true }); return; }
    axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.data?.ayurveda_suscrito) navigate("/metodo/ayurveda");
        setTcmSuscrito(!!res.data?.tcm_suscrito);
      })
      .catch(() => {});
  }, [navigate, doshaKey]);

  // El botón "Med. China" se desbloquea al pagar la 4ª disciplina. Mientras no
  // esté pagada, el clic abre el pago (en vez de navegar directamente).
  const onMedChina = () => {
    if (tcmSuscrito) navigate("/metodo/tcm");
    else { setPagoTcmError(null); setPagoTcmOpen(true); }
  };

  const pagarTcm = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoTcmLoading(true);
    setPagoTcmError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("tcm");
    if (errPago) {
      setPagoTcmError(errPago);
      setPagoTcmLoading(false);
    }
  };

  const cursos = [...(cursosData[ayurvedaNomLink]?.cursos ?? [])].sort(
    (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );
  // No mostramos las tarjetas hasta que las portadas estén descargadas.
  const fotosListas = usePrecargarImagenes(cursos.map((c) => c.foto));

  if (!doshaKey) {
    return <AyurvedaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {/* Sin `maxW` en la columna y con el mismo `px` que /aprendizaje/cursos/:modalidad:
          así la cuadrícula (CursosGrid, la misma en las dos páginas) dispone del
          mismo ancho y las tarjetas salen del mismo tamaño. Con el tope de 1280px
          que había aquí, en pantallas anchas los cursos del recorrido se veían
          bastante más pequeños que los de su página principal. El header no se
          desmadra: MetodoStepHeader lleva su propio maxW de 850px. */}
      <Flex flex="1" justify="center" px={{ base: 5, md: 8, lg: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" gap={6}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<AyurvedaIcon size={{ base: "40px", md: "52px" }} />}
            title={t("metodo.ayur.paso.cursos")}
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: `← ${t("metodo.ayur.paso.chakras")}`, onClick: () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/chakras`) }}
            extra={ilustracionesBtn}
            next={tcmSuscrito
              ? { label: "Med. China →", onClick: onMedChina }
              : { label: "Med. China →", icon: <Candado size="15px" />, onClick: onMedChina }}
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
          >{t("metodo.cursosIntro", { disciplina: t("disciplina.ayurveda") })}</Text>
          </Reveal>

          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          {loading || !fotosListas ? (
            <Flex direction="column" align="center" justify="center" gap={4} w="100%" minH={{ base: "260px", md: "340px" }}>
              <AyurvedaLoader color="#ffffff" />
            </Flex>
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
              // El aviso de «todavía no hay cursos» sí lleva tope: ahora que la
              // columna no lo tiene, sin esto se estiraría de lado a lado.
              maxW="850px"
              mx="auto"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${ayurvedaTxt}1a, 0 0 48px ${ayurvedaTxt}10`}
            >
              <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}22`} />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }} textAlign="center">
                <Text color={`${ayurvedaTxt}cc`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.8">{t("metodo.cursosPronto", { disciplina: t("disciplina.ayurveda") })}</Text>
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
      />

      <IndiceAyurveda />
      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />
      <SiteFooter />
    </Box>
  );
}
