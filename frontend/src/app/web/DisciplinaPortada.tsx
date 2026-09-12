import React, { useEffect } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { Reveal } from "../../components/global/Reveal";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { presentacionPorKey, type PresentacionDisciplina } from "../../data/presentacionDisciplinas";
import { AprendizajeIcon } from "../../GlobalVariables";
import { useIdioma, useT } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";

// ─────────────────────────────────────────────────────────────────────────────
// /disciplina/:disciplina — PORTADA COMÚN de una disciplina.
//
// Es el sitio al que se llega al pulsar una disciplina en la portada (tarjeta o
// «Explorar disciplina →»). La página es la MISMA para las ocho: el nombre de
// la disciplina de titular y tres puertas en fila —Ilustraciones · Cursos ·
// El Recorrido—, cada una con el color y el fondo de su disciplina.
//
// Lo único que cambia entre una y otra sale de `presentacionDisciplinas.ts`
// (colores, icono, frase y a dónde van sus cursos): aquí no hay nada escrito
// disciplina a disciplina.
// ─────────────────────────────────────────────────────────────────────────────

type Puerta = {
  clave: string;
  titulo: string;
  /** Segunda línea pequeña bajo el título (El Recorrido lleva «El pack»). */
  pie?: string;
  link: string;
  delay: number;
  renderIcon: (color: string) => React.ReactNode;
};

/** Icono de ILUSTRACIONES: el marco de foto (el mismo de /materiales). */
const IconoIlustraciones = (color: string) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="52px" height="52px" fill={color}>
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
  </Box>
);

/** Icono de EL RECORRIDO: el camino con sus paradas. */
const IconoRecorrido = (color: string) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="52px" height="52px" fill={color}>
    <path d="M280-600q-33 0-56.5-23.5T200-680q0-33 23.5-56.5T280-760q33 0 56.5 23.5T360-680q0 33-23.5 56.5T280-600Zm400 400q-33 0-56.5-23.5T600-280q0-33 23.5-56.5T680-360q33 0 56.5 23.5T760-280q0 33-23.5 56.5T680-200Zm0 80q66 0 113-47t47-113q0-66-47-113t-113-47H440q-33 0-56.5-23.5T360-520q0-33 23.5-56.5T440-600h60q0-25 5-45t15-35H440q-66 0-113 47t-47 113q0 66 47 113t113 47h240q33 0 56.5 23.5T760-280q0 33-23.5 56.5T680-200h-60q0 25-5 45t-15 35h80ZM280-440q-66 0-113-47T120-600q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Z" />
  </Box>
);

function Portada({ d }: { d: PresentacionDisciplina }) {
  const navigate = useNavigate();
  const t = useT();
  const { segunIdioma } = useIdioma();
  const nombreDe = useNombreDisciplina();
  const conFondo = hasDisciplinaBg(d.nom);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Izquierda · centro · derecha (en móvil se apilan en el mismo orden).
  const puertas: Puerta[] = [
    {
      clave: "ilustraciones",
      titulo: t("portada.ilustraciones"),
      link: `/ilustraciones/${d.key}`,
      delay: 0.05,
      renderIcon: IconoIlustraciones,
    },
    {
      clave: "cursos",
      titulo: t("portada.cursos"),
      link: `/aprendizaje/cursos/${d.cursosLink}`,
      delay: 0.15,
      renderIcon: (color) => <AprendizajeIcon color={color} size="52px" shadow={false} />,
    },
    {
      clave: "recorrido",
      titulo: t("portada.recorrido"),
      pie: t("portada.recorridoPack"),
      link: `/d/${d.key}`,
      delay: 0.25,
      renderIcon: IconoRecorrido,
    },
  ];

  return (
    // minH + columna + contenido flex=1: el footer se queda abajo aunque la
    // página sea corta (tres cajas y poco más).
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {/* ── CABECERA: icono + nombre de la disciplina + su frase ── */}
      <Flex direction="column" align="center" textAlign="center" px={{ base: 5, md: 10 }} pt={{ base: 10, md: 14 }} gap={{ base: 4, md: 5 }}>
        <Reveal direction="down" distance={18} delay={0.05}>
          <Box
            w={{ base: "92px", md: "112px" }}
            h={{ base: "92px", md: "112px" }}
            borderRadius="full"
            bg={conFondo ? "transparent" : d.bg}
            border={`3px solid ${d.txt}`}
            boxShadow={`0 0 20px ${d.txt}bb, 0 2px 14px ${d.txt}77`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            overflow="hidden"
          >
            {conFondo && <DisciplinaBgLayer nom={d.nom} borderRadius="full" />}
            <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
              <d.Icon size={{ base: "50px", md: "58px" }} />
            </Box>
          </Box>
        </Reveal>

        {/* El nombre va en blanco y sin sombra: fuera de las cajas, sobre el
            turquesa, el color de la disciplina no se lee. */}
        <Reveal delay={0.15}>
          <Text
            color="white"
            fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
            fontWeight="700"
            letterSpacing="0.1em"
            lineHeight="1.1"
            textTransform="uppercase"
          >
            {nombreDe(d.nom)}
          </Text>
        </Reveal>

        <Reveal delay={0.25}>
          <Text
            color="rgba(255,255,255,0.88)"
            fontSize={{ base: "md", md: "xl" }}
            fontStyle="italic"
            letterSpacing="0.04em"
            lineHeight="1.6"
            maxW={{ base: "100%", md: "640px" }}
          >
            {segunIdioma(d.gancho)}
          </Text>
        </Reveal>
      </Flex>

      {/* ── LAS TRES PUERTAS ── */}
      <Flex flex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 12, md: 16 }} pb={{ base: 20, md: 28 }}>
        <Grid
          w="100%"
          maxW="960px"
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={{ base: 6, md: 7 }}
        >
          {puertas.map((p) => (
            <Reveal key={p.clave} delay={p.delay} scaleFrom={0.96} h="100%">
              <Flex
                as="button"
                onClick={() => navigate(p.link)}
                role="group"
                w="100%"
                h="100%"
                direction="column"
                align="center"
                justify="center"
                gap={{ base: 4, md: 5 }}
                position="relative"
                overflow="hidden"
                bg={conFondo ? "transparent" : d.bg}
                border={`1.5px solid ${d.txt}66`}
                borderRadius="2xl"
                px={{ base: 5, md: 6 }}
                py={{ base: 8, md: 11 }}
                minH={{ base: "190px", md: "240px" }}
                // Halo del color de la disciplina (nada de blanco: sobre el
                // turquesa un halo claro parece una caja despintada).
                boxShadow={`0 0 0 1px ${d.txt}44, 0 0 34px ${d.txt}55, 0 10px 32px rgba(0,0,0,0.26)`}
                cursor="pointer"
                transition="transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease"
                _hover={{
                  transform: "translateY(-6px)",
                  borderColor: d.txt,
                  boxShadow: `0 0 0 1px ${d.txt}88, 0 0 48px ${d.txt}88, 0 16px 40px rgba(0,0,0,0.32)`,
                }}
              >
                {conFondo && <DisciplinaBgLayer nom={d.nom} borderRadius="2xl" />}

                {/* Icono */}
                <Box
                  position="relative"
                  zIndex={1}
                  w={{ base: "76px", md: "88px" }}
                  h={{ base: "76px", md: "88px" }}
                  borderRadius="full"
                  border={`1px solid ${d.txt}66`}
                  bg={`${d.txt}14`}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="transform 0.28s ease"
                  _groupHover={{ transform: "scale(1.05)" }}
                >
                  {p.renderIcon(d.txt)}
                </Box>

                {/* Rayita fina */}
                <Box position="relative" zIndex={1} w="40px" h="1px" bg={`${d.txt}88`} />

                {/* Título */}
                <Flex position="relative" zIndex={1} direction="column" align="center" gap={1}>
                  <Text
                    color={d.txt}
                    fontWeight="700"
                    fontSize={{ base: "lg", md: "xl" }}
                    letterSpacing="0.16em"
                    textTransform="uppercase"
                    textAlign="center"
                    lineHeight="1.2"
                    textShadow={conFondo ? `0 1px 3px ${d.bg}, 0 0 14px ${d.bg}dd` : "1px 1px 3px rgba(0,0,0,0.45)"}
                  >
                    {p.titulo}
                  </Text>
                  {p.pie && (
                    <Text
                      color={d.txt}
                      opacity={0.82}
                      fontStyle="italic"
                      fontSize={{ base: "sm", md: "md" }}
                      letterSpacing="0.04em"
                      textShadow={conFondo ? `0 1px 3px ${d.bg}, 0 0 12px ${d.bg}dd` : "1px 1px 3px rgba(0,0,0,0.45)"}
                    >
                      {p.pie}
                    </Text>
                  )}
                </Flex>
              </Flex>
            </Reveal>
          ))}
        </Grid>
      </Flex>

      <SiteFooter />
    </Box>
  );
}

export default function DisciplinaPortada() {
  const { disciplina } = useParams<{ disciplina: string }>();
  const navigate = useNavigate();
  const d = presentacionPorKey(disciplina);

  // Slug desconocido: al Mapa, que es donde están las ocho (mismo criterio que
  // /d/:disciplina, para no dejar un 404 seco).
  useEffect(() => {
    if (!d) navigate("/elMetodo", { replace: true });
  }, [d, navigate]);
  if (!d) return null;

  // key: al saltar de una disciplina a otra se remonta y las entradas vuelven
  // a dispararse, en vez de encontrarlas ya colocadas.
  return <Portada key={d.key} d={d} />;
}
