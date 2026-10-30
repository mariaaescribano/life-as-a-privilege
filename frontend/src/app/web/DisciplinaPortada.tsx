import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { Reveal } from "../../components/global/Reveal";
import { focoBlanco } from "../../components/global/foco";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { presentacionPorKey, type PresentacionDisciplina } from "../../data/presentacionDisciplinas";
import { AprendizajeIcon } from "../../GlobalVariables";
import DisciplinaHeader from "../../components/web/DisciplinaHeader";
import { getUserMe } from "../../api/userMe";
import { useIdioma, useT } from "../../i18n";

// ─────────────────────────────────────────────────────────────────────────────
// /disciplina/:disciplina — PORTADA COMÚN de una disciplina.
//
// Es el sitio al que se llega al pulsar una disciplina (en la portada, tarjeta o
// «Explorar disciplina →», y en el Mapa). La página es la MISMA para las ocho: el
// nombre de la disciplina de titular y tres puertas en fila —Reels · El
// Recorrido · Teoría—, cada una con el color y el fondo de su disciplina.
//   · Reels: aún no existen; la puerta se ve apagada («Próximamente»).
//   · El Recorrido: el recorrido de siempre (/metodo/<disciplina>). Si no se ha
//     pagado, la guardia de pago lo devuelve al Mapa con su box de pago.
//   · Teoría: /disciplina/<slug>/teoria, la misma cabecera con dos puertas
//     —Ilustraciones y Cursos— y un botón para volver.
//
// SIN PAGAR (o sin sesión) la portada es la de siempre: Ilustraciones · Cursos ·
// El Recorrido («El pack», que lleva a la presentación /d/<disciplina>, donde se
// compra). Reels, El Recorrido de verdad y Teoría solo existen una vez pagada la
// disciplina.
//
// Lo único que cambia entre una y otra sale de `presentacionDisciplinas.ts`
// (colores, icono, frase y a dónde van sus cursos): aquí no hay nada escrito
// disciplina a disciplina, salvo la ruta de su recorrido (RECORRIDO_RUTA).
// ─────────────────────────────────────────────────────────────────────────────

type Puerta = {
  clave: string;
  titulo: string;
  /** Segunda línea pequeña bajo el título («Próximamente» en Reels). */
  pie?: string;
  link: string;
  /** Sin destino todavía: se ve, pero apagada y sin poder pulsarse (Reels). */
  apagada?: boolean;
  delay: number;
  renderIcon: (color: string) => React.ReactNode;
};

/** Icono de ILUSTRACIONES: el marco de foto (el mismo de /materiales). */
const IconoIlustraciones = (color: string) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="52px" height="52px" fill={color}>
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
  </Box>
);

/** Icono de REELS: la pantalla con el play. */
const IconoReels = (color: string) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="52px" height="52px" fill={color}>
    <path d="m380-300 280-180-280-180v360ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z" />
  </Box>
);

/** Icono de TEORÍA: el libro abierto. */
const IconoTeoria = (color: string) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="52px" height="52px" fill={color}>
    <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.500 11T100-198q-21 11-40.500-1T40-236v-488q0-11 5.500-21T62-760q46-24 96-36t102-12q58 0 113.500 15T480-760q51-30 106.500-45T700-820q52 0 102 12t96 36q11 5 16.500 15t5.500 21v488q0 23-19.500 35t-40.500 1q-37-20-77.500-31T700-240q-60 0-116 21t-104 59Zm0-80q42-26 87-40t93-14q36 0 70.500 7t69.500 20v-398q-33-14-68.500-21t-71.500-7q-48 0-93 14t-87 40v399Zm-40 0v-399q-42-26-87-40t-93-14q-36 0-71.500 7T120-682v398q35-13 69.500-20t70.500-7q48 0 93 14t87 40Z" />
  </Box>
);

/** A dónde lleva «El Recorrido» de cada disciplina: su recorrido de siempre. */
const RECORRIDO_RUTA: Record<string, string> = {
  astrologia: "/metodo/astrologia",
  psicologia: "/metodo/psicologia",
  ayurveda: "/metodo/ayurveda",
  medicinachina: "/metodo/tcm",
  fisiologia: "/metodo/fisiologia",
  nutricion: "/metodo/nutricion",
  cabala: "/metodo/cabala",
  cultura: "/metodo/cultura",
};

/** Clave de la portada → scope de pago (el de `<scope>_suscrito` en /user/me). */
const SCOPE_PAGO: Record<string, string> = {
  astrologia: "metodo",
  psicologia: "psicologia",
  ayurveda: "ayurveda",
  medicinachina: "tcm",
  fisiologia: "fisiologia",
  nutricion: "nutricion",
  cabala: "cabala",
  cultura: "cultura",
};

/** ¿Tiene pagada esta disciplina? null = todavía comprobando. */
function usePagada(key: string): boolean | null {
  const [pagada, setPagada] = useState<boolean | null>(null);
  useEffect(() => {
    let vivo = true;
    let uid: string | null = null;
    try { uid = localStorage.getItem("userId"); } catch { /* modo privado */ }
    // Sin sesión: no hay nada pagado.
    if (!uid) { setPagada(false); return; }
    // Fresca: puede que acabe de pagar y la caché de 5 min diga que no.
    getUserMe({ fresca: true })
      .then(({ data }) => {
        if (vivo) setPagada(data?.[`${SCOPE_PAGO[key] ?? key}_suscrito`] === true);
      })
      // Sin red: se enseña la de siempre; el pago lo vigila el guardia aparte.
      .catch(() => { if (vivo) setPagada(false); });
    return () => { vivo = false; };
  }, [key]);
  return pagada;
}

function Portada({ d, modo = "portada" }: { d: PresentacionDisciplina; modo?: "portada" | "teoria" }) {
  const navigate = useNavigate();
  const t = useT();
  const { segunIdioma } = useIdioma();
  const conFondo = hasDisciplinaBg(d.nom);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Izquierda · centro · derecha (en móvil se apilan en el mismo orden).
  const puertasPortada: Puerta[] = [
    {
      clave: "reels",
      titulo: t("portada.reels"),
      pie: t("comun.proximamente"),
      link: "",
      apagada: true,
      delay: 0.05,
      renderIcon: IconoReels,
    },
    {
      clave: "recorrido",
      titulo: t("portada.recorrido"),
      link: RECORRIDO_RUTA[d.key] ?? `/d/${d.key}`,
      delay: 0.15,
      // El Recorrido lleva el icono de SU disciplina (ya viene pintado con su
      // color), en vez de un icono genérico de camino.
      renderIcon: () => <d.Icon size="52px" />,
    },
    {
      clave: "teoria",
      titulo: t("portada.teoria"),
      link: `/disciplina/${d.key}/teoria`,
      delay: 0.25,
      renderIcon: IconoTeoria,
    },
  ];
  // Dentro de Teoría: lo que ya existía, las ilustraciones y los cursos.
  const puertasTeoria: Puerta[] = [
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
  ];
  // La de siempre, para quien no ha pagado: Ilustraciones · Cursos · El Recorrido.
  const puertasSinPagar: Puerta[] = [
    { ...puertasTeoria[0], delay: 0.05 },
    { ...puertasTeoria[1], delay: 0.15 },
    {
      clave: "recorrido",
      titulo: t("portada.recorrido"),
      pie: t("portada.recorridoPack"),
      link: `/d/${d.key}`,
      delay: 0.25,
      renderIcon: () => <d.Icon size="52px" />,
    },
  ];
  const pagada = usePagada(d.key);
  // La Teoría solo se ve pagada: si alguien llega por la URL sin pagar, vuelve a la portada.
  useEffect(() => {
    if (modo === "teoria" && pagada === false) navigate(`/disciplina/${d.key}`, { replace: true });
  }, [modo, pagada, d.key, navigate]);
  const puertas = pagada === false ? puertasSinPagar : modo === "teoria" ? puertasTeoria : puertasPortada;

  return (
    // minH + columna + contenido flex=1: el footer se queda abajo aunque la
    // página sea corta (tres cajas y poco más).
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {/* ── CABECERA: el header de la disciplina (foto de fondo, icono a la izquierda del nombre) + su frase ── */}
      <Flex direction="column" align="center" textAlign="center" pt={{ base: 10, md: 14 }} gap={{ base: 5, md: 6 }}>
        <Reveal direction="down" distance={18} delay={0.05} w="100%">
          <DisciplinaHeader d={d} />
        </Reveal>

        <Reveal delay={0.25}>
          <Text
            color="rgba(255,255,255,0.88)"
            fontSize={{ base: "md", md: "xl" }}
            fontStyle="italic"
            letterSpacing="0.04em"
            lineHeight="1.6"
            maxW={{ base: "100%", md: "640px" }}
            px={{ base: 5, md: 10 }}
          >
            {segunIdioma(d.gancho)}
          </Text>
        </Reveal>
      </Flex>

      {/* ── LAS PUERTAS ── */}
      <Flex flex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 12, md: 16 }} pb={{ base: 20, md: 28 }}>
        <Grid
          w="100%"
          maxW={modo === "teoria" && pagada ? "640px" : "960px"}
          templateColumns={{ base: "1fr", md: `repeat(${puertas.length}, 1fr)` }}
          gap={{ base: 6, md: 7 }}
        >
          {pagada !== null && puertas.map((p) => (
            <Reveal key={p.clave} delay={p.delay} scaleFrom={0.96} h="100%">
              <Flex
                // Cada puerta se abre en una PESTAÑA NUEVA (la disciplina se queda donde está
                // y la persona no se pierde). La apagada (Reels) no lleva enlace.
                {...(p.apagada ? {} : { as: "a" as const, href: p.link, target: "_blank", rel: "noopener noreferrer" })}
                textDecoration="none"
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
                borderRadius="2xl"
                px={{ base: 5, md: 6 }}
                py={{ base: 8, md: 11 }}
                minH={{ base: "190px", md: "240px" }}
                // Solo halo (luz, no sombra): ni filo ni sombra negra. Del color
                // de la disciplina; sobre el turquesa un halo blanco parece una
                // caja despintada.
                boxShadow={`0 0 34px ${d.txt}55, 0 0 70px ${d.txt}22`}
                cursor={p.apagada ? "default" : "pointer"}
                opacity={p.apagada ? 0.6 : 1}
                transition="transform 0.28s ease, box-shadow 0.28s ease"
                _hover={
                  p.apagada
                    ? {}
                    : { transform: "translateY(-6px)", boxShadow: `0 0 48px ${d.txt}88, 0 0 90px ${d.txt}33`, textDecoration: "none" }
                }
                _focusVisible={focoBlanco}
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
                  _groupHover={p.apagada ? {} : { transform: "scale(1.05)" }}
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

      {/* Dentro de Teoría: volver a la portada (abajo a la izquierda, fuera de las cajas). */}
      {modo === "teoria" && pagada && (
        <Flex px={{ base: 5, md: 10, lg: 16 }} pb={{ base: 10, md: 14 }} justify="flex-start">
          <BotonPaso
            direction="prev"
            label={t("comun.volver")}
            onClick={() => navigate(`/disciplina/${d.key}`)}
            nom={d.nom}
            color="white"
            bg={d.bg}
          />
        </Flex>
      )}

      <SiteFooter />
    </Box>
  );
}

export default function DisciplinaPortada({ modo = "portada" }: { modo?: "portada" | "teoria" }) {
  const { disciplina } = useParams<{ disciplina: string }>();
  const navigate = useNavigate();
  const d = presentacionPorKey(disciplina);

  // Slug desconocido: al Mapa, que es donde están las ocho (mismo criterio que
  // /d/:disciplina, para no dejar un 404 seco).
  useEffect(() => {
    if (!d) navigate("/elMetodo", { replace: true });
  }, [d, navigate]);
  if (!d) return null;

  // key: al saltar de una disciplina a otra (o de la portada a su Teoría) se
  // remonta y las entradas vuelven a dispararse, en vez de encontrarlas ya
  // colocadas.
  return <Portada key={`${d.key}-${modo}`} d={d} modo={modo} />;
}
