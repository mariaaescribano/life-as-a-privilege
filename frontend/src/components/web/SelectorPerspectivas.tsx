import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
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
    <Box w="100%" maxW="900px" mx="auto" px={{ base: 5, md: 10 }}>
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

      <Reveal inView amount={0.2} direction="up" distance={26} scaleFrom={0.97} duration={0.9} delay={0.2}>
        <Box position="relative" mt={{ base: 6, md: 8 }}>
          {/* El mandala de fondo: grande, centrado detrás de la foto y muy tenue. */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            w={{ base: "105%", md: "500px" }}
            maxW="none"
            aria-hidden="true"
            pointerEvents="none"
            opacity={0.14}
            sx={{
              transform: "translate(-50%, -50%)",
              aspectRatio: "1 / 1",
              backgroundImage: "url('/img/icono/life.webp')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              filter: "drop-shadow(0 0 14px rgba(255,255,255,0.4))",
            }}
          />

          <Box position="relative" w={{ base: "58%", md: "290px" }} maxW="290px" mx="auto">
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
          </Box>
        </Box>
      </Reveal>

      {/* El nombre de la disciplina elegida, en blanco, justo encima de los iconos. */}
      <Flex justify="center" align="center" mt={{ base: 5, md: 6 }} minH={{ base: "30px", md: "36px" }} aria-live="polite">
        <AnimatePresence mode="wait">
          <MotionBox
            key={d.key}
            initial={reducir ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducir ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <Text color="white" fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} letterSpacing="0.04em" textAlign="center">
              {nombreDe(d.nom)}
            </Text>
          </MotionBox>
        </AnimatePresence>
      </Flex>

      {/* Los ocho iconos, en una sola línea: se pulsan para cambiar la foto. Cada círculo lleva
          de fondo la foto de su disciplina. */}
      <Flex justify="center" flexWrap="nowrap" gap={{ base: "6px", md: 3 }} mt={{ base: 2, md: 3 }} role="tablist">
        {lista.map((p, i) => {
          const activo = i === actual;
          return (
            <Reveal key={p.key} inView amount={0.5} direction="up" distance={14} duration={0.6} delay={0.3 + i * 0.06}>
              <Box
                as="button"
                type="button"
                role="tab"
                aria-selected={activo}
                aria-label={nombreDe(p.nom)}
                title={nombreDe(p.nom)}
                onClick={() => setActual(i)}
                position="relative"
                overflow="hidden"
                w={{ base: "38px", md: "48px" }}
                h={{ base: "38px", md: "48px" }}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={p.bg}
                border={`2px solid ${p.txt}${activo ? "" : "66"}`}
                boxShadow={activo ? `0 0 14px ${p.txt}99, 0 0 28px ${p.txt}44` : "none"}
                opacity={activo ? 1 : 0.75}
                transform={activo ? "scale(1.1)" : "scale(1)"}
                transition="all 0.3s ease"
                _focusVisible={focoBlanco}
              >
                <DisciplinaBgLayer nom={p.nom} borderRadius="full" talCual />
                <Box position="relative" zIndex={1} display="flex">
                  <p.Icon size={{ base: "22px", md: "27px" }} />
                </Box>
              </Box>
            </Reveal>
          );
        })}
      </Flex>
    </Box>
  );
}
