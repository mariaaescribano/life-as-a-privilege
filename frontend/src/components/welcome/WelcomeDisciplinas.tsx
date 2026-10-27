import React from "react";
import { Box, Flex, Grid, Text, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useT, type ClaveTexto } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { Reveal, Breathe } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";

/**
 * Las ocho disciplinas de la portada, en LÍNEAS: cada una es una franja
 * horizontal con su icono delante a la izquierda, su nombre y su frase. Cuatro
 * en una columna y cuatro en la otra; en móvil, las ocho una debajo de otra.
 *
 * Cada línea lleva el fondo y los colores de su disciplina y se define por el
 * halo (luz, no sombra). Dinamismo:
 *  · entran al bajar, una a una; las de la columna izquierda llegan desde la
 *    izquierda y las de la derecha desde la derecha (en móvil, desde abajo);
 *  · el icono respira muy despacio, cada uno con su fase;
 *  · al pasar por encima la línea sube, el icono crece y la flecha avanza.
 */
export type DisciplinaFila = {
  /** Nombre INTERNO (GlobalVariables): da el fondo, no se traduce. */
  name: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
  /** Su portada común: /disciplina/<slug>. */
  link: string;
  lemaKey?: ClaveTexto;
};

const Fila = ({
  d,
  i,
  columna,
  movil,
}: {
  d: DisciplinaFila;
  i: number;
  columna: 0 | 1;
  movil: boolean;
}) => {
  const navigate = useNavigate();
  const t = useT();
  const nombreDe = useNombreDisciplina();
  const conFondo = hasDisciplinaBg(d.name);

  return (
    <Reveal
      inView
      amount={0.3}
      // Izquierda: viene desde la izquierda («right»); derecha: desde la derecha
      // («left»). En móvil todas suben.
      direction={movil ? "up" : columna === 0 ? "right" : "left"}
      distance={movil ? 26 : 36}
      scaleFrom={0.97}
      duration={0.85}
      delay={movil ? 0.05 : i * 0.12 + columna * 0.06}
      w="100%"
    >
      <Flex
        as="button"
        type="button"
        onClick={() => navigate(d.link)}
        role="group"
        w="100%"
        align="center"
        gap={{ base: 4, md: 5 }}
        position="relative"
        overflow="hidden"
        textAlign="left"
        px={{ base: 4, md: 5 }}
        py={{ base: 3.5, md: 4 }}
        minH={{ base: "92px", md: "104px" }}
        borderRadius="2xl"
        bg={conFondo ? "transparent" : d.bg}
        // Solo halo del color de la disciplina: sin sombra negra ni filo.
        boxShadow={`0 0 18px ${d.txt}28, 0 0 40px ${d.txt}12`}
        cursor="pointer"
        transition="transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: `0 0 24px ${d.txt}40, 0 0 52px ${d.txt}1c`,
        }}
        _active={{ transform: "translateY(-1px)" }}
        _focusVisible={focoBlanco}
      >
        {conFondo && <DisciplinaBgLayer nom={d.name} borderRadius="2xl" />}

        {/* Icono delante, a la izquierda; respira despacio */}
        <Breathe scale={0.04} duration={5.5 + (i % 3) * 0.7} delay={1 + i * 0.35}>
          <Box
            position="relative"
            zIndex={1}
            flexShrink={0}
            w={{ base: "62px", md: "70px" }}
            h={{ base: "62px", md: "70px" }}
            borderRadius="full"
            border={`3px solid ${d.txt}`}
            bg={conFondo ? "transparent" : d.bg}
            boxShadow={`0 0 12px ${d.txt}70, 0 0 26px ${d.txt}38`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            transition="transform 0.3s ease, box-shadow 0.3s ease"
            _groupHover={{ transform: "scale(1.07)", boxShadow: `0 0 18px ${d.txt}99, 0 0 36px ${d.txt}50` }}
          >
            {conFondo && <DisciplinaBgLayer nom={d.name} borderRadius="full" />}
            <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
              {d.renderIcon("40px")}
            </Box>
          </Box>
        </Breathe>

        {/* Nombre + frase */}
        <Flex position="relative" zIndex={1} direction="column" gap={0.5} flex="1" minW={0}>
          <Text
            color={d.txt}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "xl", md: "2xl" }}
            letterSpacing="0.04em"
            lineHeight="1.15"
            textShadow={conFondo ? `0 1px 3px ${d.bg}, 0 0 14px ${d.bg}dd` : "1px 1px 3px rgba(0,0,0,0.45)"}
          >
            {nombreDe(d.name)}
          </Text>
          {d.lemaKey && (
            <Text
              color={d.txt}
              opacity={0.95}
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "sm", md: "md" }}
              lineHeight="1.4"
              letterSpacing="0.01em"
              textShadow={conFondo ? `0 1px 3px ${d.bg}, 0 0 12px ${d.bg}dd` : "1px 1px 3px rgba(0,0,0,0.45)"}
            >
              {t(d.lemaKey)}
            </Text>
          )}
        </Flex>

        {/* Flecha: avanza al pasar por encima */}
        <Box
          position="relative"
          zIndex={1}
          flexShrink={0}
          color={d.txt}
          fontSize={{ base: "xl", md: "2xl" }}
          opacity={0.8}
          transition="transform 0.3s ease, opacity 0.3s ease"
          _groupHover={{ transform: "translateX(5px)", opacity: 1 }}
          aria-hidden="true"
        >
          →
        </Box>
      </Flex>
    </Reveal>
  );
};

const WelcomeDisciplinas = ({ disciplinas }: { disciplinas: DisciplinaFila[] }) => {
  const movil = useBreakpointValue({ base: true, md: false }) ?? true;
  const mitad = Math.ceil(disciplinas.length / 2);
  const columnas = [disciplinas.slice(0, mitad), disciplinas.slice(mitad)];

  return (
    <Box w="100%" maxW="1180px" mx="auto" px={{ base: 5, md: 10, lg: 16 }}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 4, md: 6 }} alignItems="start">
        {columnas.map((col, c) => (
          <Flex key={c} direction="column" gap={{ base: 4, md: 5 }}>
            {col.map((d, i) => (
              <Fila key={d.name} d={d} i={i} columna={c as 0 | 1} movil={movil} />
            ))}
          </Flex>
        ))}
      </Grid>
    </Box>
  );
};

export default WelcomeDisciplinas;
