import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader, glowHeaderDisciplina } from "../../components/metodo/MetodoStepHeader";
import { CursoCardDetalle } from "../../components/aprendizaje/CursoCardDetalle";
import { CursosGrid } from "../../components/aprendizaje/CursosGrid";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { useCursosData } from "../../data/cursosApi";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon, FONDO_PAGINA_TURQUESA } from "../../GlobalVariables";
import { useT } from "../../i18n";

// Contenido del popup «¿Qué es esto?» (botón flotante, encima del de la
// llamada): explica esta página del recorrido. Edítalo libremente.
const QUE_ES_ESTO = {
  parrafos: [
    "Hasta ahora solo has aprendido tu carta, pero la Astrología tiene mucho más que ofrecer.",
    "¿Quieres profundizar en todos los arquetipos? No dudes en leer un rato :)",
  ],
};

// POR AHORA los cursos de esta página no llevan su portada: llevan la foto de SU planeta (la misma de las ilustraciones),
// y los cursos que no son de un planeta no salen (están comentados en esta lista). Clave = título del curso, sin acentos.
const FOTO_PLANETA_DE_CURSO: Record<string, string> = {
  "sol": "sol",
  "la luna": "luna",
  "mercurio": "mercurio",
  "venus": "venus",
  "marte": "marte",
  "jupiter": "jupiter",
  "saturno": "saturno",
  "urano": "urano",
  "neptuno": "neptuno",
  "pluton": "pluton",
  "quiron": "quiron",
  "lilith": "lilith",
  "los nodos": "nodoNorte",
  // Sin planeta, no salen por ahora:
  // "los signos y las casas"
  // "los ascendentes"
};
const sinAcentos = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();

/**
 * Última pantalla del Recorrido de Astrología: los cursos de Astrología, para
 * que el usuario los tenga a mano y pueda profundizar. Va después de la pantalla
 * de la Llamada. Desde aquí se desbloquea/avanza a Psicología (misma lógica de
 * pago que antes estaba en la Llamada, que ahora es el paso previo).
 */
export default function MetodoAstrologiaCursos() {
  const t = useT();
  const navigate = useNavigate();
  const { cursosData, loading } = useCursosData();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Cursos de Astrología ordenados por fecha de publicación (recientes primero),
  // igual que en la página de Cursos de la disciplina.
  const cursos = [...(cursosData[astrologiaNom]?.cursos ?? [])]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    // Solo los de un planeta, y con la foto de ese planeta en vez de su portada.
    .filter((c) => !!FOTO_PLANETA_DE_CURSO[sinAcentos(c.titulo ?? "")])
    .map((c) => ({ ...c, foto: `/viñetas/astrologia/planetas/${FOTO_PLANETA_DE_CURSO[sinAcentos(c.titulo ?? "")]}.webp` }));
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
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {/* Mismos márgenes y ANCHO SIN TOPE que /aprendizaje/cursos/:disciplina
          (CursosModalidad): allí la cuadrícula ocupa todo el ancho disponible, así
          que las tarjetas salen grandes. Con un maxW aquí salían más pequeñas. */}
      <Flex flex="1" justify="center" px={{ base: 5, md: 8, lg: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" gap={6}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={t("metodo.cursosDe", { disciplina: t("disciplina.astrologia") })}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 19, total: 19 }}
              mb={0}
              prev={{ label: `← ${t("metodo.astro.paso.sintesis")}`, onClick: () => navigate("/metodo/astrologia/sintesis") }}
            />
          </Reveal>

          {/* Texto introductorio debajo del header (al ancho del header, no del
              grid, para que no se estire de lado a lado en pantallas anchas). */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%" maxW="850px">
            <Text
              color={FONDO_PAGINA_TURQUESA}
              fontSize={{ base: "lg", md: "xl" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.8"
            >
              {t("metodo.cursosIntro", { disciplina: t("disciplina.astrologia") })}
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
                  // Las fotos de los planetas son cuadradas: se ven enteras, sin recortar arriba y abajo.
                  proporcionFoto: "1 / 1",
                  sinAccesoLibre: true,
                }))}
                columnas={{ base: 2, md: 3, lg: 4 }}
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
              maxW="850px"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow={glowHeaderDisciplina(astrologiaTxt)}
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
                  {t("metodo.cursosPronto", { disciplina: t("disciplina.astrologia") })}
                </Text>
              </Box>
            </Reveal>
          )}
        </Flex>
      </Flex>


      <BotonCompania color={astrologiaTxt} bgColor={astrologiaBg} disciplinaNom={astrologiaNom}
                     llamadaTitulo={t("metodo.astro.reservaLlamada")} queEsEsto={QUE_ES_ESTO} />
      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
