import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { sombraTexto } from "../global/disciplinaSombras";
import FotoDisciplina from "./FotoDisciplina";
import { presentacionPorKey, type PresentacionDisciplina } from "../../data/presentacionDisciplinas";
import { useT } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";

/**
 * «Cada disciplina es una nueva perspectiva…» (Asesorías 1:1, justo encima del formulario).
 *
 * La frase arriba; en el centro la foto de la disciplina elegida, sobre un mandala grande y
 * tenue de fondo; y debajo los ocho iconos, que se pulsan para cambiar la foto. El orden es el
 * del mandala de Asesorías. Las fotos son /img/disciplinas/<key>.webp (ver FotoDisciplina).
 */
const ORDEN = ["astrologia", "psicologia", "fisiologia", "nutricion", "ayurveda", "medicinachina", "cultura", "cabala"];

const MotionBox = motion(Box);

export default function SelectorPerspectivas() {
  const t = useT();
  const nombreDe = useNombreDisciplina();
  const reducir = useReducedMotion();
  const lista = ORDEN.map((k) => presentacionPorKey(k)).filter((d): d is PresentacionDisciplina => !!d);
  const [actual, setActual] = useState(0);
  const d = lista[actual];
  if (!d) return null;

  return (
    <Box w="100%" maxW="1000px" mx="auto" px={{ base: 5, md: 10 }}>
      <Reveal inView amount={0.5} direction="up" distance={20} duration={0.9}>
        <Text
          textAlign="center"
          color="white"
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "xl", md: "3xl" }}
          letterSpacing="0.03em"
          lineHeight="1.3"
          maxW="700px"
          mx="auto"
        >
          {t("asesoria.perspectivas")}
        </Text>
      </Reveal>

      {/* Escritorio: la foto a la izquierda y las ocho disciplinas de dos en dos a la derecha, con
          el mismo alto que la foto. Móvil: foto, nombre y una fila con los ocho iconos. */}
      <Flex direction={{ base: "column", md: "row" }} align="stretch" justify="center" gap={{ base: 0, md: 8 }} mt={{ base: 6, md: 10 }}>
        <Reveal inView amount={0.2} direction="up" distance={26} scaleFrom={0.97} duration={0.9} delay={0.2} w={{ base: "58%", md: "340px" }} maxW="340px" mx={{ base: "auto", md: 0 }} flexShrink={0}>
          <AnimatePresence mode="wait">
            <MotionBox
              key={d.key}
              initial={reducir ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducir ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <FotoDisciplina d={d} />
            </MotionBox>
          </AnimatePresence>
        </Reveal>

        {/* El nombre de la elegida, en blanco, encima de los iconos (solo móvil: en escritorio
            cada disciplina lleva su nombre). */}
        <Flex display={{ base: "flex", md: "none" }} justify="center" align="center" mt={5} minH="30px" aria-live="polite">
          <AnimatePresence mode="wait">
            <MotionBox
              key={d.key}
              initial={reducir ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducir ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Text color="white" fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="xl" letterSpacing="0.04em" textAlign="center">
                {nombreDe(d.nom)}
              </Text>
            </MotionBox>
          </AnimatePresence>
        </Flex>

        {/* Las ocho: se pulsan para cambiar la foto. Cada círculo lleva de fondo la foto de su
            disciplina. */}
        <Box
          role="tablist"
          mt={{ base: 7, md: 0 }}
          flex={{ md: 1 }}
          minW={0}
          display="grid"
          // Móvil: cuatro y cuatro. Escritorio: de dos en dos, con el alto de la foto.
          gridTemplateColumns={{ base: "repeat(4, 56px)", md: "repeat(2, minmax(0, 1fr))" }}
          gridTemplateRows={{ base: "none", md: "repeat(4, minmax(0, 1fr))" }}
          justifyContent="center"
          justifyItems={{ base: "center", md: "stretch" }}
          gap={{ base: "18px 22px", md: 4 }}
        >
          {lista.map((p, i) => {
            const activo = i === actual;
            return (
              <Reveal key={p.key} inView amount={0.3} direction="up" distance={14} duration={0.6} delay={0.3 + i * 0.06} h={{ md: "100%" }}>
                <Box
                  as="button"
                  type="button"
                  role="tab"
                  aria-selected={activo}
                  aria-label={nombreDe(p.nom)}
                  title={nombreDe(p.nom)}
                  onClick={() => setActual(i)}
                  display="flex"
                  alignItems="center"
                  gap={3}
                  w={{ md: "100%" }}
                  h={{ md: "100%" }}
                  px={{ md: 4 }}
                  borderRadius={{ base: "full", md: "2xl" }}
                  border={{ base: "none", md: `1.5px solid ${p.txt}${activo ? "" : "55"}` }}
                  position="relative"
                  overflow={{ base: "visible", md: "hidden" }}
                  bg="transparent"
                  boxShadow={{ base: "none", md: activo ? `0 0 16px ${p.txt}55` : "none" }}
                  textAlign="left"
                  transition="all 0.3s ease"
                  _focusVisible={focoBlanco}
                >
                  {/* Escritorio: la foto de la disciplina es el fondo de todo el botón. */}
                  <Box display={{ base: "none", md: "contents" }}>
                    <DisciplinaBgLayer nom={p.nom} borderRadius="2xl" />
                  </Box>
                  {/* Móvil: círculo con la foto. Escritorio: sin círculo, solo el icono. */}
                  <Box
                    position="relative"
                    overflow={{ base: "hidden", md: "visible" }}
                    flexShrink={0}
                    zIndex={1}
                    w={{ base: "56px", md: "auto" }}
                    h={{ base: "56px", md: "auto" }}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={{ base: p.bg, md: "transparent" }}
                    border={{ base: `2px solid ${p.txt}${activo ? "" : "66"}`, md: "none" }}
                    boxShadow={{ base: activo ? `0 0 14px ${p.txt}99, 0 0 28px ${p.txt}44` : "none", md: "none" }}
                    opacity={{ base: activo ? 1 : 0.75, md: 1 }}
                    transform={{ base: activo ? "scale(1.1)" : "scale(1)", md: "none" }}
                    transition="all 0.3s ease"
                  >
                    <Box display={{ base: "contents", md: "none" }}>
                      <DisciplinaBgLayer nom={p.nom} borderRadius="full" talCual />
                    </Box>
                    <Box position="relative" zIndex={1} display="flex">
                      <p.Icon size={{ base: "32px", md: "27px" }} />
                    </Box>
                  </Box>
                  <Text
                    display={{ base: "none", md: "block" }}
                    position="relative"
                    zIndex={1}
                    color={p.txt}
                    textShadow={sombraTexto(p.nom, p.bg)}
                    fontFamily="'EB Garamond', serif"
                    fontWeight={activo ? "700" : "600"}
                    fontSize="lg"
                    letterSpacing="0.03em"
                    lineHeight="1.2"
                  >
                    {nombreDe(p.nom)}
                  </Text>
                </Box>
              </Reveal>
            );
          })}
        </Box>
      </Flex>
    </Box>
  );
}
