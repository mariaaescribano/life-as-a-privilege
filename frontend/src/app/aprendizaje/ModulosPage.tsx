import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { ModuloAcordeon } from "../../components/aprendizaje/ModuloAcordeon";
import { VolverAlMapa } from "../../components/global/VolverAlMapa";
import { useCursosData } from "../../data/cursosApi";

export default function ModulosPage() {
  const { modalidadId, cursoId } = useParams<{ modalidadId: string; cursoId: string }>();
  const { cursosData, loading } = useCursosData();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Ruta de origen: solo presente si se llegó desde el recorrido (modal Cursos).
  const volver = searchParams.get("volver");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  const modalidad = modalidadId ? cursosData[modalidadId] : undefined;
  const curso = modalidad?.cursos.find((c) => c.id === cursoId);

  if (loading) {
    return <LifeLoading variant="auto" />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />
      <VolverAlMapa />

      <Box flex="1">
        {modalidad && curso ? (
          <Flex
            direction="column"
            alignItems="center"
            px={{ base: 5, md: 10, lg: 16 }}
            pt={{ base: 10, md: 14 }}
            pb={{ base: 14, md: 20 }}
          >
            <MetodoStepHeader
              icon={modalidad.icon}
              title={curso.titulo}
              bgColor={modalidad.bgColor}
              color={modalidad.color}
              nom={modalidad.nom}
              hideCursos
              // Botón de vuelta, discreto (small). Si se llegó desde El Recorrido
              // se respeta ese destino; en cualquier otro caso vuelve a los cursos
              // de la propia disciplina (misma clave que la ruta /cursos/:slug).
              prev={
                volver
                  ? { label: "← Volver a El Mapa", onClick: () => navigate(volver), small: true }
                  : { label: `← Cursos de ${modalidad.nom}`, onClick: () => navigate(`/aprendizaje/cursos/${modalidadId}`), small: true }
              }
            />

            <Box
              w="100%"
              maxW="850px"
              sx={{
                "@keyframes moduloSlideIn": {
                  from: { opacity: 0, transform: "translateX(-28px)" },
                  to:   { opacity: 1, transform: "translateX(0)"     },
                },
              }}
            >

              {(curso.modulos ?? []).map((mod, i) => (
                <Box
                  key={i}
                  style={{
                    opacity: 0,
                    animation: `moduloSlideIn 0.48s cubic-bezier(0.22,1,0.36,1) ${i * 0.09}s forwards`,
                  }}
                >
                  <ModuloAcordeon
                    title={mod.title}
                    bgColor={modalidad.bgColor}
                    color={modalidad.color}
                    submodules={mod.submodules}
                    icon={mod.icon}
                    disciplina={modalidad.nom}
                  />
                </Box>
              ))}

              {(!curso.modulos || curso.modulos.length === 0) && (
                <Text color="rgba(255,255,255,0.75)" fontStyle="italic" textAlign="center" mt={6}>
                  Este curso aún no tiene contenido.
                </Text>
              )}
            </Box>
          </Flex>
        ) : (
          <Box flex="1" display="flex" alignItems="center" justifyContent="center" py={20}>
            <Text color="white" fontSize="xl" fontStyle="italic">Curso no encontrado.</Text>
          </Box>
        )}
      </Box>

      <SiteFooter />
    </Box>
  );
}
