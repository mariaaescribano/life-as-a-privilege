import React, { useEffect, useMemo, useState } from "react";
import { Box, Collapse, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { DISCIPLINAS_CURSO, type DisciplinaCurso } from "../../data/disciplinasCurso";
import {
  programasDe,
  tieneDiapositivas,
  tienePodcast,
  type Programa,
} from "../../hardCoded/programas/programas";
import { Reveal } from "../../components/global/Reveal";
import { useT } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";

/** Sombra para el texto que va sobre la foto de la disciplina. */
const SOMBRA = "0 2px 6px rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.35)";

/** La curva del sistema Reveal: sube y se posa, sin pasarse de largo. */
const CURVA = "cubic-bezier(0.22,1,0.36,1)";

/** Al abrir una disciplina, sus programas no aparecen de golpe: suben en
 *  cascada, uno detrás de otro. Es todo el espectáculo de esta página. */
const entraFila = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/** La flechita que gira al abrir. Una sola forma para los dos plegables. */
function Chevron({ abierto, color }: { abierto: boolean; color: string }) {
  return (
    <Box
      as="svg"
      viewBox="0 -960 960 960"
      width="22px"
      height="22px"
      fill={color}
      flexShrink={0}
      transform={abierto ? "rotate(180deg)" : "rotate(0deg)"}
      transition="transform 0.3s ease"
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.45))" }}
    >
      <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
    </Box>
  );
}

/** Botón de acción de un programa (ver las diapositivas / escuchar el podcast).
 *  Apagado mientras esa mitad no está publicada: se ve que existe, pero no
 *  promete algo que todavía no hay. */
function BotonPrograma({
  texto, icono, color, disponible, onClick,
}: {
  texto: string;
  icono: React.ReactNode;
  color: string;
  disponible: boolean;
  onClick: () => void;
}) {
  return (
    <Flex
      as="button"
      onClick={disponible ? onClick : undefined}
      align="center"
      gap={2}
      px={{ base: 4, md: 5 }}
      py="9px"
      borderRadius="full"
      border={`1px solid ${color}`}
      color={color}
      bg="rgba(0,0,0,0.22)"
      fontFamily="'EB Garamond', serif"
      fontWeight="600"
      fontSize="xs"
      letterSpacing="0.14em"
      textTransform="uppercase"
      whiteSpace="nowrap"
      opacity={disponible ? 1 : 0.4}
      cursor={disponible ? "pointer" : "not-allowed"}
      transition="all 0.25s ease"
      _hover={disponible ? { bg: "rgba(0,0,0,0.4)" } : {}}
    >
      {icono}
      {texto}
    </Flex>
  );
}

const IconoDiapositivas = (
  <Box as="svg" viewBox="0 -960 960 960" width="18px" height="18px" fill="currentColor" flexShrink={0}>
    <path d="M200-160q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h560q33 0 56.5 23.5T840-720v480q0 33-23.5 56.5T760-160H200Zm0-80h560v-480H200v480Z" />
    <path d="M280-360h400v-60H280v60Zm0-120h400v-60H280v60Zm0-120h240v-60H280v60Z" />
  </Box>
);

const IconoPodcast = (
  <Box as="svg" viewBox="0 -960 960 960" width="18px" height="18px" fill="currentColor" flexShrink={0}>
    <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm-40 280v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Z" />
  </Box>
);

/** Una fila de programa: el título, y al desplegar sus dos botones. */
function FilaPrograma({
  programa, color, sobreFoto, turno, entrando, onVer, onEscuchar,
}: {
  programa: Programa;
  color: string;
  sobreFoto: boolean;
  /** Su puesto en la cascada: marca el retraso con el que sube. */
  turno: number;
  /** true mientras la disciplina está abierta: con esto arranca la cascada
   *  (y al cerrar se quita, para que vuelva a lanzarse la próxima vez). */
  entrando: boolean;
  onVer: () => void;
  onEscuchar: () => void;
}) {
  const t = useT();
  const [abierto, setAbierto] = useState(false);
  const sombra = sobreFoto ? SOMBRA : "none";

  return (
    // La rayita que separa un programa del siguiente va en el color de la
    // disciplina a media tinta (hex-alpha: en bgGradient las comas de rgba()
    // rompen, y aquí mantenemos la misma forma de escribirlo).
    <Box
      borderTop={`1px solid ${color}55`}
      animation={entrando ? `${entraFila} 0.5s ${CURVA} ${0.08 + turno * 0.07}s both` : undefined}
    >
      <Flex
        as="button"
        onClick={() => setAbierto((v) => !v)}
        w="100%"
        align="center"
        gap={{ base: 3, md: 4 }}
        textAlign="left"
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 4 }}
        cursor="pointer"
        transition="background 0.2s ease"
        _hover={{ bg: "rgba(0,0,0,0.18)" }}
      >
        <Text
          color={color}
          fontSize="sm"
          fontWeight="700"
          minW="26px"
          textShadow={sombra}
          opacity={0.9}
        >
          {programa.numero}
        </Text>
        <Text
          flex={1}
          color={color}
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.35"
          textShadow={sombra}
        >
          {programa.titulo}
        </Text>
        <Chevron abierto={abierto} color={color} />
      </Flex>

      <Collapse in={abierto} animateOpacity>
        <Box px={{ base: 4, md: 6 }} pb={{ base: 5, md: 6 }} pl={{ base: 4, md: "62px" }}>
          {programa.descripcion && (
            <Text color={color} fontSize="sm" lineHeight="1.6" mb={4} opacity={0.9} textShadow={sombra}>
              {programa.descripcion}
            </Text>
          )}
          <Flex gap={3} flexWrap="wrap">
            <BotonPrograma
              texto={t("programas.verDiapositivas")}
              icono={IconoDiapositivas}
              color={color}
              disponible={tieneDiapositivas(programa)}
              onClick={onVer}
            />
            <BotonPrograma
              texto={t("programas.escucharPodcast")}
              icono={IconoPodcast}
              color={color}
              disponible={tienePodcast(programa)}
              onClick={onEscuchar}
            />
          </Flex>
          {!tieneDiapositivas(programa) && !tienePodcast(programa) && (
            <Text color={color} fontSize="xs" fontStyle="italic" mt={3} opacity={0.75} textShadow={sombra}>
              {t("programas.enPreparacion")}
            </Text>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

/** Una disciplina: la caja con su fondo, plegable, y dentro sus programas. */
function BloqueDisciplina({
  disciplina, lista,
}: {
  disciplina: DisciplinaCurso;
  lista: Programa[];
}) {
  const t = useT();
  const navigate = useNavigate();
  const nombreDisciplina = useNombreDisciplina();
  // Todas nacen plegadas: la página se lee de un vistazo y quien quiera entra.
  const [abierto, setAbierto] = useState(false);
  const sobreFoto = hasDisciplinaBg(disciplina.nom);
  const color = disciplina.color;

  return (
    // Al abrirse, la caja se enciende un punto: el halo crece y sube algo más
    // de la página. Es el premio a haberla pulsado.
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="2xl"
      bg={disciplina.bg}
      border="1px solid rgba(255,255,255,0.28)"
      boxShadow={
        abierto
          ? "0 0 26px rgba(255,255,255,0.34), 0 0 66px rgba(180,255,245,0.22), 0 12px 30px rgba(0,0,0,0.26)"
          : "0 0 16px rgba(255,255,255,0.22), 0 0 44px rgba(180,255,245,0.14), 0 5px 16px rgba(0,0,0,0.18)"
      }
      transform={abierto ? "translateY(-3px)" : "translateY(0)"}
      transition={`box-shadow 0.5s ${CURVA}, transform 0.5s ${CURVA}`}
    >
      <DisciplinaBgLayer nom={disciplina.nom} borderRadius="2xl" />

      {/* Todo el contenido va POR ENCIMA de la capa de fondo. */}
      <Flex position="relative" zIndex={1} direction="column">
        <Flex
          as="button"
          onClick={() => setAbierto((v) => !v)}
          w="100%"
          flexShrink={0}
          align="center"
          gap={{ base: 3, md: 4 }}
          textAlign="left"
          px={{ base: 4, md: 6 }}
          py={{ base: 5, md: 6 }}
          cursor="pointer"
          transition="background 0.2s ease"
          _hover={{ bg: "rgba(0,0,0,0.15)" }}
        >
          <Box flexShrink={0} style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.5))" }}>
            <disciplina.Icon size={{ base: "30px", md: "36px" }} />
          </Box>
          <Text
            flex={1}
            color={color}
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            fontWeight="700"
            letterSpacing={{ base: "0.14em", md: "0.1em", lg: "0.14em" }}
            textTransform="uppercase"
            textShadow={sobreFoto ? SOMBRA : "none"}
          >
            {nombreDisciplina(disciplina.nom)}
          </Text>
          <Text
            color={color}
            fontSize="sm"
            whiteSpace="nowrap"
            opacity={0.85}
            textShadow={sobreFoto ? SOMBRA : "none"}
            display={{ base: "none", lg: "block" }}
          >
            {lista.length === 1 ? t("programas.cuentaUno") : t("programas.cuenta", { n: lista.length })}
          </Text>
          <Chevron abierto={abierto} color={color} />
        </Flex>

        {/* EL DESPLEGABLE.
            Cada disciplina se abre a SU altura, la que pidan sus programas: se
            probó darles a todas la misma (un hueco fijo con scroll dentro) y
            quedaba peor —la lista corta dejaba aire y la larga se leía por una
            rendija—. Así que la persiana sube hasta donde llegue la lista, que
            es lo que hace `Collapse`. */}
        <Collapse in={abierto} animateOpacity>
          <Box pb={2}>
            {lista.map((p, i) => (
              <FilaPrograma
                key={p.slug}
                programa={p}
                color={color}
                sobreFoto={sobreFoto}
                turno={i}
                entrando={abierto}
                onVer={() => navigate(`/programas/${p.slug}`)}
                onEscuchar={() => navigate(`/programas/${p.slug}/podcast`)}
              />
            ))}
          </Box>
        </Collapse>
      </Flex>
    </Box>
  );
}

/**
 * PROGRAMAS (/programas).
 *
 * El índice entero: una caja plegable por disciplina —con su propio fondo— y
 * dentro cada programa, también plegable, con sus dos puertas: las
 * diapositivas (el visor) y el podcast (el vídeo de YouTube).
 */
export default function ProgramasPage() {
  const t = useT();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  // Solo las disciplinas que tienen programas, en el orden de siempre.
  const bloques = useMemo(
    () =>
      DISCIPLINAS_CURSO
        .map((d) => ({ disciplina: d, lista: programasDe(d.slug) }))
        .filter((b) => b.lista.length > 0),
    []
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.webp"
          alt=""
          h={{ base: "48px", md: "64px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.59)) drop-shadow(0 0 21px rgba(255,255,255,0.32)) drop-shadow(0 0 42px rgba(180,255,245,0.24))" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-12deg)"}
          transition="opacity 1s ease 0.1s, transform 1s ease 0.1s"
        />
      </Flex>

      {/* ── TÍTULO ── */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 6, md: 8 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 14px rgba(255,255,255,0.64), 0 0 30px rgba(255,255,255,0.41), 0 0 56px rgba(180,255,245,0.34)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          {t("header.programas")}
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "md", md: "xl" }}
          fontStyle="italic"
          letterSpacing="0.05em"
          lineHeight="1.5"
          maxW={{ base: "100%", md: "580px" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(13px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          {t("programas.subtitulo")}
        </Text>
      </Flex>

      {/* ── LAS DISCIPLINAS, PLEGABLES ── */}
      <Box flex={1} px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 12, md: 16 }} pb={{ base: 20, md: 28 }}>
        <Box maxW="1100px" mx="auto">
          {bloques.length === 0 ? (
            <Text color="white" textAlign="center" fontSize={{ base: "md", md: "lg" }} fontStyle="italic">
              {t("programas.vacio")}
            </Text>
          ) : (
            // Dos por fila a partir de tablet (las ocho disciplinas en cuatro
            // filas). En una sola columna cada caja plegada era una raya
            // sueltísima y la página quedaba desparramada. En móvil, una.
            //
            // `alignItems="start"`: la rejilla estiraría las dos cajas de una
            // fila a la misma altura, y al abrir una la cerrada de al lado
            // crecería con ella dejando un hueco vacío. Cada una manda sobre su
            // propio alto.
            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              spacing={{ base: 5, md: 6 }}
              alignItems="start"
            >
              {bloques.map(({ disciplina, lista }, i) => (
                // Cada caja se observa a sí misma (`inView`) y entra al asomar,
                // no al cargar: si no, las de más abajo se animarían en off.
                // `amount={0.02}` porque son cajas altas: basta con que asome el
                // borde. Sin `blur` por lo mismo (el salto a nítido se ve como
                // un fogonazo en un panel grande). El retraso lo marca la
                // COLUMNA (`i % 2`), no el índice: así en cada fila entra
                // primero la izquierda y detrás la derecha, y ninguna caja de
                // abajo espera segundos desde que ya se está viendo.
                <Reveal
                  key={disciplina.slug}
                  inView
                  amount={0.02}
                  direction="up"
                  distance={30}
                  scaleFrom={0.97}
                  duration={0.6}
                  delay={(i % 2) * 0.15}
                  alignSelf="start"
                >
                  <BloqueDisciplina disciplina={disciplina} lista={lista} />
                </Reveal>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Box>

      <SiteFooter />
    </Box>
  );
}
