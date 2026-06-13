import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { Markdown } from "../../components/global/Markdown";
import { CursoTest } from "../../components/aprendizaje/CursoTest";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { useCursosData } from "../../data/cursosApi";
import type { Submodulo } from "../../dtos/aprendizaje.type";

function safeDecode(s: string): string {
  try { return decodeURIComponent(s); } catch { return s; }
}

export default function TextLessonPage() {
  const { modalidadId: rawMod, cursoId, submoduloId } = useParams<{
    modalidadId: string; cursoId: string; submoduloId: string;
  }>();
  const modalidadId = rawMod ? safeDecode(rawMod) : "";
  const navigate = useNavigate();
  const { cursosData, loading } = useCursosData();

  React.useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [submoduloId]);

  const modalidad = modalidadId ? cursosData[modalidadId] : undefined;
  const curso = modalidad?.cursos.find((c) => c.id === cursoId);
  const lecciones: Submodulo[] = (curso?.modulos ?? []).flatMap((m) => m.submodules);
  const idx = lecciones.findIndex((s) => s.id === submoduloId);
  const leccion = idx >= 0 ? lecciones[idx] : null;
  const anterior = idx > 0 ? lecciones[idx - 1] : null;
  const siguiente = idx >= 0 && idx < lecciones.length - 1 ? lecciones[idx + 1] : null;

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SiteHeader variant="auto" /><SpinnerTurquesa /></Box>;
  }

  if (!modalidad || !curso || !leccion) {
    return (
      <Box minH="100vh" bg="#008080" display="flex" flexDirection="column" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="auto" />
        <Box flex="1" display="flex" alignItems="center" justifyContent="center">
          <Box color="white" fontSize="xl" fontStyle="italic">Lección no encontrada.</Box>
        </Box>
        <SiteFooter />
      </Box>
    );
  }

  const { bgColor, color, icon, nom: disciplinaNom } = modalidad;
  const hasBg = hasDisciplinaBg(disciplinaNom);
  const esVideo = leccion.tipo === "video" && !!leccion.video;
  const esTest = leccion.tipo === "test";

  const TEXT_GLOW = `0 1px 4px ${bgColor}, 0 0 10px ${bgColor}, 0 0 22px ${bgColor}, 0 0 40px ${color}33`;
  // Mismo glow que el header (MetodoStepHeader) para que haya coherencia.
  const HEADER_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${color}1a, 0 0 48px ${color}10`;

  const Arrow = ({ dir, target }: { dir: "prev" | "next"; target: Submodulo | null }) => (
    <Box
      as="button"
      disabled={!target}
      onClick={() => target && navigate(target.link)}
      w={{ base: "44px", md: "52px" }}
      h={{ base: "44px", md: "52px" }}
      borderRadius="full"
      border="2px solid rgba(255,255,255,0.6)"
      color="white"
      fontFamily="'EB Garamond', serif"
      fontSize={{ base: "xl", md: "2xl" }}
      fontWeight="700"
      bg="rgba(255,255,255,0.08)"
      cursor={target ? "pointer" : "not-allowed"}
      opacity={target ? 1 : 0.25}
      transition="all 0.2s"
      display="flex"
      alignItems="center"
      justifyContent="center"
      _hover={target ? { bg: "rgba(255,255,255,0.2)", borderColor: "white" } : {}}
    >
      {dir === "prev" ? "←" : "→"}
    </Box>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" position="relative" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1" position="relative" zIndex={1}>
        <Flex direction="column" alignItems="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 14 }} pb={{ base: 14, md: 20 }}>
          {/* Header de disciplina con el título del submódulo */}
          <MetodoStepHeader
            icon={icon}
            title={leccion.nom}
            bgColor={bgColor}
            color={color}
            nom={disciplinaNom}
            compact
            prev={{ label: "← Volver al curso", onClick: () => navigate(`/aprendizaje/modulosPage/${modalidadId}/${cursoId}`) }}
          />

          {/* Vídeo (16:9) o artículo de texto */}
          {esVideo ? (
            <Box
              maxW="900px"
              w="100%"
              sx={{ aspectRatio: "16 / 9" }}
              borderRadius="2xl"
              overflow="hidden"
              boxShadow={HEADER_GLOW}
              mt={{ base: 2, md: 4 }}
            >
              <iframe
                style={{ width: "100%", height: "100%" }}
                src={`https://www.youtube.com/embed/${leccion.video}`}
                title={leccion.nom}
                allowFullScreen
              />
            </Box>
          ) : esTest ? (
            <Box
              maxW="760px"
              w="100%"
              position="relative"
              overflow="hidden"
              borderRadius="2xl"
              bg={bgColor}
              boxShadow={HEADER_GLOW}
              mt={{ base: 2, md: 4 }}
            >
              <CursoTest ejercicios={leccion.ejercicios ?? []} color={color} disciplinaNom={disciplinaNom} bgColor={bgColor} />
            </Box>
          ) : (
            <Box
              maxW="760px"
              w="100%"
              position="relative"
              overflow="hidden"
              borderRadius="2xl"
              bg={bgColor}
              boxShadow={HEADER_GLOW}
              mt={{ base: 2, md: 4 }}
            >
              {hasBg && <DisciplinaBgLayer nom={disciplinaNom} borderRadius="2xl" />}
              <Box position="relative" zIndex={1} px={{ base: 6, md: 12 }} py={{ base: 8, md: 12 }} sx={{ textShadow: TEXT_GLOW }}>
                <Markdown text={leccion.contenido ?? leccion.letra ?? ""} color={color} />
              </Box>
            </Box>
          )}

          {/* Navegación anterior / siguiente */}
          <Flex gap={5} justify="center" mt={{ base: 8, md: 10 }}>
            <Arrow dir="prev" target={anterior} />
            <Arrow dir="next" target={siguiente} />
          </Flex>
        </Flex>
      </Box>

      <Box position="relative" zIndex={1}>
        <SiteFooter />
      </Box>
    </Box>
  );
}
