import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { CursoCardDetalle } from "../../components/aprendizaje/CursoCardDetalle";
import { CursosGrid } from "../../components/aprendizaje/CursosGrid";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { PagoPsicologiaModal } from "../../components/metodo/PagoPsicologiaModal";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { useCursosData } from "../../data/cursosApi";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

const EyeIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

/**
 * Última pantalla del Recorrido de Astrología: los cursos de Astrología, para
 * que el usuario los tenga a mano y pueda profundizar. Va después de la pantalla
 * de la Llamada. Desde aquí se desbloquea/avanza a Psicología (misma lógica de
 * pago que antes estaba en la Llamada, que ahora es el paso previo).
 */
export default function MetodoAstrologiaCursos() {
  const navigate = useNavigate();
  const { cursosData, loading } = useCursosData();
  const [comicOpen, setComicOpen] = useState(false);
  const [psicologiaSuscrito, setPsicologiaSuscrito] = useState(false);
  const [pagoPsicoOpen, setPagoPsicoOpen] = useState(false);
  const [pagoPsicoLoading, setPagoPsicoLoading] = useState(false);
  const [pagoPsicoError, setPagoPsicoError] = useState<string | null>(null);
  const [testPagos, setTestPagos] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const token = sessionStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPsicologiaSuscrito(!!res.data?.psicologia_suscrito))
      .catch(() => {});
    axios
      .get(`${API_URL}/payment/test/enabled`)
      .then((res) => setTestPagos(!!res.data?.enabled))
      .catch(() => {});
  }, []);

  const testUnlockPsico = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    try {
      await axios.post(
        `${API_URL}/payment/test/unlock`,
        { scope: "psicologia" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate("/metodo/psicologia");
    } catch (err: any) {
      setPagoPsicoError(err?.response?.data?.message || "No se pudo activar el modo test.");
    }
  };

  const pagarPsicologia = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoPsicoLoading(true);
    setPagoPsicoError(null);
    try {
      const res = await axios.post(
        `${API_URL}/payment/psicologia/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data?.url) { window.location.href = res.data.url; return; }
      setPagoPsicoError("No se pudo obtener la URL de pago. Inténtalo de nuevo.");
      setPagoPsicoLoading(false);
    } catch (err: any) {
      const status = err?.response?.status;
      setPagoPsicoError(
        status === 403
          ? "Necesitas completar el pago de Astrología antes de adquirir Psicología."
          : err?.response?.data?.message || err?.message || "Error desconocido",
      );
      setPagoPsicoLoading(false);
    }
  };

  // El botón "Psicología →" del header se desbloquea al pagar Psicología.
  // Mientras no esté pagada, el clic abre el pago (en vez de quedar inerte).
  const onPsicologia = () => {
    if (psicologiaSuscrito) navigate("/metodo/psicologia");
    else { setPagoPsicoError(null); setPagoPsicoOpen(true); }
  };

  // Cursos de Astrología ordenados por fecha de publicación (recientes primero),
  // igual que en la página de Cursos de la disciplina.
  const cursos = [...(cursosData[astrologiaNom]?.cursos ?? [])].sort(
    (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );
  // No mostramos la página hasta que las portadas de los cursos estén
  // descargadas, para que las tarjetas no se rellenen de golpe después.
  const fotosListas = usePrecargarImagenes(cursos.map((c) => c.foto));

  // Mientras cargan los datos o las fotos: pantalla de carga completa (header +
  // fondo difuminado + spinner blanco), en vez de un spinner suelto que chocaba
  // con el header. La página no se muestra hasta estar todo listo.
  if (loading || !fotosListas) {
    return <RecorridoLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1280px" gap={6}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title="Cursos de Astrología"
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 8, total: 8 }}
              mb={0}
              prev={{ label: "← Llamada", onClick: () => navigate("/metodo/astrologia/llamada") }}
              extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
              next={{
                label: "Psicología →",
                onClick: onPsicologia,
                // Mismo estilo que el resto de botones del header (Astrología),
                // sin el color de la disciplina de destino.
                icon: psicologiaSuscrito ? undefined : (
                  <Box
                    as="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    w={{ base: "16px", md: "20px" }}
                    h={{ base: "16px", md: "20px" }}
                    fill={astrologiaTxt}
                    flexShrink={0}
                  >
                    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm296.5-143.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
                  </Box>
                ),
              }}
            />
          </Reveal>

          {/* Texto introductorio debajo del header */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%">
            <Text
              color={`${astrologiaTxt}ee`}
              fontSize={{ base: "md", md: "lg" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.8"
              style={{ textShadow: `0 0 10px ${astrologiaTxt}44` }}
            >
              Si quieres profundizar en la Astrología, estos cursos te acompañan paso a paso.
            </Text>
          </Reveal>

          {/* Grid de cursos de Astrología */}
          {cursos.length > 0 ? (
            cursos.length === 1 ? (
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
                    bgColor={astrologiaBg}
                    color={astrologiaTxt}
                    nom={astrologiaNom}
                  />
                </Box>
              </Flex>
            ) : (
              <CursosGrid
                items={cursos.map((curso) => ({
                  curso,
                  color: astrologiaTxt,
                  bgColor: astrologiaBg,
                  nom: astrologiaNom,
                }))}
              />
            )
          ) : (
            // Aún no hay cursos publicados: mensaje suave con el fondo de astrología.
            <Reveal
              direction="up"
              distance={34}
              scaleFrom={0.97}
              delay={0.22}
              duration={0.75}
              position="relative"
              w="100%"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${astrologiaTxt}1a, 0 0 48px ${astrologiaTxt}10`}
            >
              <DisciplinaBgLayer nom={astrologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }} textAlign="center">
                <Text
                  color={`${astrologiaTxt}cc`}
                  fontSize={{ base: "md", md: "lg" }}
                  fontStyle="italic"
                  lineHeight="1.8"
                  style={{ textShadow: `0 0 10px ${astrologiaTxt}44` }}
                >
                  Pronto encontrarás aquí los cursos de Astrología.
                </Text>
              </Box>
            </Reveal>
          )}
        </Flex>
      </Flex>

      <ComicAstrologiaModal isOpen={comicOpen} onClose={() => setComicOpen(false)} />

      <PagoPsicologiaModal
        isOpen={pagoPsicoOpen}
        onClose={() => { setPagoPsicoOpen(false); setPagoPsicoError(null); }}
        onPagar={pagarPsicologia}
        loading={pagoPsicoLoading}
        error={pagoPsicoError}
        onTest={testPagos ? testUnlockPsico : undefined}
      />

      <BotonCompania color={astrologiaTxt} bgColor={astrologiaBg} disciplinaNom={astrologiaNom} precio={20} llamadaTitulo="Reserva tu llamada de astrología" />
      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
