import React, { useEffect } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { VideoYoutube } from "../../components/aprendizaje/VideoYoutube";
import { disciplinaCursoBySlug } from "../../data/disciplinasCurso";
import { programaPorSlug, tieneDiapositivas } from "../../hardCoded/programas/programas";
import { BotonBarra } from "../../components/programas/BotonBarra";
import { useT } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";

/**
 * EL PODCAST DE UN PROGRAMA (/programas/:slug/podcast).
 *
 * La otra mitad del programa: aquí solo se escucha. El vídeo de YouTube a lo
 * ancho, con la barra de velocidad de los cursos, y la puerta de vuelta a las
 * diapositivas por si se quiere seguir mirando mientras suena.
 */
export default function ProgramaPodcastPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const t = useT();
  const nombreDisciplina = useNombreDisciplina();
  const programa = programaPorSlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!programa) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="auto" />
        <Flex flex={1} direction="column" align="center" justify="center" gap={6} px={5}>
          <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" textAlign="center">
            {t("programas.noExiste")}
          </Text>
          <BotonBarra texto={t("programas.volver")} icono="«" onClick={() => navigate("/programas")} />
        </Flex>
        <SiteFooter />
      </Box>
    );
  }

  const disciplina = disciplinaCursoBySlug(programa.disciplina);
  const bg = disciplina?.bg ?? "#0d4f4f";
  const color = disciplina?.color ?? "#ffffff";

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex={1} px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 14 }} pb={{ base: 16, md: 24 }}>
        <Box maxW="980px" mx="auto">
          {/* ── DE QUÉ PROGRAMA ESTAMOS HABLANDO ── */}
          <Flex direction="column" align="center" textAlign="center" gap={2} mb={{ base: 8, md: 10 }}>
            {disciplina && (
              <Flex align="center" gap={2}>
                <disciplina.Icon size="26px" />
                <Text color="white" fontSize="sm" fontWeight="600" letterSpacing="0.18em" textTransform="uppercase">
                  {nombreDisciplina(disciplina.nom)}
                </Text>
              </Flex>
            )}
            <Text color="rgba(255,255,255,0.85)" fontSize="xs" letterSpacing="0.22em" textTransform="uppercase">
              {t("programas.numero", { n: programa.numero })}
            </Text>
            <Text color="white" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" lineHeight="1.15">
              {programa.titulo}
            </Text>
          </Flex>

          {/* ── EL PODCAST ── */}
          {programa.podcast ? (
            <VideoYoutube
              video={programa.podcast}
              titulo={programa.titulo}
              color={color}
              bgColor={bg}
              nom={disciplina?.nom}
              descripcion={programa.descripcion}
            />
          ) : (
            <Box
              bg={bg}
              borderRadius="2xl"
              border="1px solid rgba(255,255,255,0.28)"
              px={{ base: 5, md: 8 }}
              py={{ base: 10, md: 14 }}
            >
              <Text color={color} fontStyle="italic" textAlign="center">
                {t("programas.sinPodcast")}
              </Text>
            </Box>
          )}

          {/* ── LAS DOS PUERTAS DE VUELTA ── */}
          <Flex mt={{ base: 10, md: 14 }} gap={3} align="center" justify="space-between" flexWrap="wrap">
            <BotonBarra texto={t("programas.volver")} icono="«" onClick={() => navigate("/programas")} />
            {tieneDiapositivas(programa) && (
              <BotonBarra
                texto={t("programas.verDiapositivas")}
                icono="→"
                alineado="right"
                onClick={() => navigate(`/programas/${programa.slug}`)}
              />
            )}
          </Flex>
        </Box>
      </Box>

      <SiteFooter />
    </Box>
  );
}
