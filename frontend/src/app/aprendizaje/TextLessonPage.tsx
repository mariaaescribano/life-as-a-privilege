import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import { VolverAlMapa } from "../../components/global/VolverAlMapa";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { Markdown } from "../../components/global/Markdown";
import { CursoTest } from "../../components/aprendizaje/CursoTest";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { useCursosData, useLeccionTraducida } from "../../data/cursosApi";
import { useT } from "../../i18n";
import type { Submodulo } from "../../dtos/aprendizaje.type";

function safeDecode(s: string): string {
  try { return decodeURIComponent(s); } catch { return s; }
}

// ── Escala de la página de lección ──────────────────────────────────────────
// Toda esta pantalla va un 20% más grande que el resto del recorrido: el header,
// el rectángulo del texto y la letra. Es una página para LEER (no hay nada más
// que el artículo), así que a tamaño normal se quedaba pequeña dentro de la
// pantalla. Los 850px de ancho de la casa pasan aquí a 1020.
const ANCHO = "1020px";

// Divide el contenido de la lección en secciones por las líneas separadoras
// (--- o ***), igual que las detecta el Markdown. Cada sección se pinta como
// su propio "rectángulo" con la imagen de la disciplina ajustada (cover), así
// el autor controla con --- dónde empieza cada imagen y nunca queda estirada.
function splitSecciones(text: string): string[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const secciones: string[] = [];
  let cur: string[] = [];
  for (const line of lines) {
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      secciones.push(cur.join("\n"));
      cur = [];
    } else {
      cur.push(line);
    }
  }
  secciones.push(cur.join("\n"));
  const limpias = secciones.map((s) => s.trim()).filter((s) => s.length > 0);
  // Si no hay separadores (o queda vacío), tratamos todo como una sola sección.
  return limpias.length > 0 ? limpias : [text];
}

export default function TextLessonPage() {
  const { modalidadId: rawMod, cursoId, submoduloId } = useParams<{
    modalidadId: string; cursoId: string; submoduloId: string;
  }>();
  const modalidadId = rawMod ? safeDecode(rawMod) : "";
  const navigate = useNavigate();
  const t = useT();
  const { cursosData, loading } = useCursosData();
  // Cuerpo de la lección en el idioma activo (null si es español o si esta
  // lección todavía no está traducida: entonces se lee la del API).
  const traducida = useLeccionTraducida(cursoId, submoduloId);

  React.useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [submoduloId]);

  const modalidad = modalidadId ? cursosData[modalidadId] : undefined;
  const curso = modalidad?.cursos.find((c) => c.id === cursoId);
  const lecciones: Submodulo[] = (curso?.modulos ?? []).flatMap((m) => m.submodules);
  const idx = lecciones.findIndex((s) => s.id === submoduloId);
  const leccion = idx >= 0 ? lecciones[idx] : null;
  const anterior = idx > 0 ? lecciones[idx - 1] : null;
  const siguiente = idx >= 0 && idx < lecciones.length - 1 ? lecciones[idx + 1] : null;

  if (loading) {
    return <LifeLoading variant="auto" />;
  }

  if (!modalidad || !curso || !leccion) {
    return (
      <Box minH="100vh" bg="#008080" display="flex" flexDirection="column" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="auto" />
        <Box flex="1" display="flex" alignItems="center" justifyContent="center">
          <Box color="white" fontSize="xl" fontStyle="italic">{t("aprendizaje.leccionNoEncontrada")}</Box>
        </Box>
        <SiteFooter />
      </Box>
    );
  }

  const { bgColor, color, icon, nom: disciplinaNom } = modalidad;
  const hasBg = hasDisciplinaBg(disciplinaNom);
  const esTest = leccion.tipo === "test";
  const cuerpo = traducida?.contenido ?? leccion.contenido ?? leccion.letra ?? "";
  const ejercicios = traducida?.ejercicios ?? leccion.ejercicios ?? [];

  // Misma sombra que la tarjeta de curso y el editor admin (coherencia del módulo de cursos).
  const TEXT_GLOW = `0 1px 4px ${bgColor}, 0 0 10px ${bgColor}, 0 0 22px ${bgColor}`;
  // Mismo glow que el header (MetodoStepHeader) para que haya coherencia.
  const HEADER_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${color}1a, 0 0 48px ${color}10`;

  const Arrow = ({ dir, target }: { dir: "prev" | "next"; target: Submodulo | null }) => (
    <Box
      as="button"
      disabled={!target}
      onClick={() => target && navigate(target.link)}
      w={{ base: "52px", md: "62px" }}
      h={{ base: "52px", md: "62px" }}
      borderRadius="full"
      border="2px solid rgba(255,255,255,0.6)"
      color="white"
      fontFamily="'EB Garamond', serif"
      fontSize={{ base: "2xl", md: "3xl" }}
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
      <VolverAlMapa />

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
            tallTitle
            fitTitle
            titleScale={1.2}
            maxW={ANCHO}
            hideCursos
            mb={{ base: 7, md: 8 }}
            prev={{
              label: "←",
              onClick: () => anterior && navigate(anterior.link),
              disabled: !anterior,
              disabledTooltip: t("leccion.esLaPrimera"),
            }}
            extra={{
              label: t("leccion.volverAlCurso"),
              onClick: () => navigate(`/aprendizaje/modulosPage/${modalidadId}/${cursoId}`),
              small: true,
            }}
            next={{
              label: "→",
              onClick: () => siguiente && navigate(siguiente.link),
              disabled: !siguiente,
              disabledTooltip: t("leccion.esLaUltima"),
            }}
          />

          {/* Test o artículo de texto. Las lecciones de tipo «vídeo» ya no
              tienen reproductor: caen aquí y se muestran como texto. */}
          {esTest ? (
            <Box
              maxW={ANCHO}
              w="100%"
              position="relative"
              overflow="hidden"
              borderRadius="2xl"
              bg={bgColor}
              boxShadow={HEADER_GLOW}
              mt={{ base: 2, md: 4 }}
            >
              <CursoTest ejercicios={ejercicios} color={color} disciplinaNom={disciplinaNom} bgColor={bgColor} />
            </Box>
          ) : (
            <Box
              maxW={ANCHO}
              w="100%"
              position="relative"
              overflow="hidden"
              borderRadius="2xl"
              bg={bgColor}
              boxShadow={HEADER_GLOW}
              mt={{ base: 2, md: 4 }}
            >
              {/* Cada sección separada por `---` es su propio rectángulo, con
                  una imagen de la disciplina ajustada a su tamaño. Las
                  secciones van pegadas y se separan con una línea fina (el
                  antiguo `---`). */}
              {splitSecciones(cuerpo).map((sec, si) => (
                <Box key={si} position="relative">
                  {si > 0 && <Box position="relative" zIndex={1} h="1px" bg={`${color}44`} />}
                  {hasBg && <DisciplinaBgLayer nom={disciplinaNom} borderRadius="0" />}
                  <Box position="relative" zIndex={1} px={{ base: 6, md: 0 }} py={{ base: 10, md: 14 }} sx={{ textShadow: TEXT_GLOW }}>
                    {/* Las líneas de texto ocupan ~82% del ancho de la tarjeta
                        (centradas) en escritorio; en móvil van a ancho completo. */}
                    <Box w="100%" maxW={{ base: "100%", md: "82%" }} mx="auto">
                      <Markdown text={sec} color={color} bigger="xl" />
                    </Box>
                  </Box>
                </Box>
              ))}
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
