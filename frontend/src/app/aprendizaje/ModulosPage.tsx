import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { ModuloAcordeon } from "../../components/aprendizaje/ModuloAcordeon";
import { VolverAlMapa, useVolverAlMapa } from "../../components/global/VolverAlMapa";
import { useCursosData } from "../../data/cursosApi";
import { useT } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";

export default function ModulosPage() {
  const { modalidadId, cursoId } = useParams<{ modalidadId: string; cursoId: string }>();
  const { cursosData, loading } = useCursosData();
  const t = useT();
  const nombreDisciplina = useNombreDisciplina();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // De dónde se vino. Dos maneras de llegar desde El Recorrido y las dos valen:
  //  · `?volver=` en la URL (el modal de Cursos de Psicología, la presentación),
  //  · la miga de pan del Mapa, que apunta sola el último paso del recorrido.
  // Sin ninguna de las dos se vino de Materiales, y ahí no hay Mapa al que
  // devolver: el botón no aparece.
  const { url: volver, boton: botonMapa } = useVolverAlMapa(searchParams.get("volver"));

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  const modalidad = modalidadId ? cursosData[modalidadId] : undefined;
  const curso = modalidad?.cursos.find((c) => c.id === cursoId);

  if (loading) {
    return <LifeLoading variant="auto" />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />
      <VolverAlMapa url={volver} />

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
              // Este header va GRANDE, como el del recorrido: es la portada del
              // curso y la página más importante de Materiales. El resto de la
              // sección (cursos, lección, herbario, alimentos) va en `dense`.
              // Dos vueltas, discretas (small) y con destinos distintos:
              //  · `prev` sube un escalón dentro de Materiales (los cursos de
              //    esta disciplina),
              //  · `extra` devuelve EXACTAMENTE al paso del Mapa del que se
              //    salió —lo mismo que el botón flotante— y solo sale si se
              //    venía de ahí. Va en medio a propósito: los botones laterales
              //    se quedan en flecha suelta en el móvil y «volver al Mapa» no
              //    se adivina por una flecha.
              prev={{
                label: `← ${t("aprendizaje.cursosDe", { disciplina: nombreDisciplina(modalidad.nom) })}`,
                onClick: () => navigate(`/aprendizaje/cursos/${modalidadId}`),
                small: true,
              }}
              extra={botonMapa}
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
                  {t("aprendizaje.sinContenido")}
                </Text>
              )}
            </Box>
          </Flex>
        ) : (
          <Box flex="1" display="flex" alignItems="center" justifyContent="center" py={20}>
            <Text color="white" fontSize="xl" fontStyle="italic">{t("aprendizaje.cursoNoEncontrado")}</Text>
          </Box>
        )}
      </Box>

      <SiteFooter />
    </Box>
  );
}
