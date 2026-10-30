import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
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
          fontSize={{ base: "2xl", md: "4xl" }}
          letterSpacing="0.03em"
          lineHeight="1.3"
          maxW="800px"
          mx="auto"
        >
          {t("asesoria.perspectivas")}
        </Text>
      </Reveal>

      <Reveal inView amount={0.2} direction="up" distance={26} scaleFrom={0.97} duration={0.9} delay={0.2}>
        <Box position="relative" mt={{ base: 8, md: 12 }}>
          {/* El mandala de fondo: grande, centrado detrás de la foto y muy tenue. */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            w={{ base: "130%", md: "700px" }}
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

          <Box position="relative" w={{ base: "78%", md: "420px" }} maxW="420px" mx="auto">
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

      {/* Los ocho iconos: se pulsan para cambiar la foto. */}
      <Flex justify="center" flexWrap="wrap" gap={{ base: 3, md: 4 }} mt={{ base: 8, md: 10 }} role="tablist">
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
                w={{ base: "52px", md: "62px" }}
                h={{ base: "52px", md: "62px" }}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={p.bg}
                border={`2px solid ${p.txt}${activo ? "" : "66"}`}
                boxShadow={activo ? `0 0 16px ${p.txt}99, 0 0 34px ${p.txt}44` : "none"}
                opacity={activo ? 1 : 0.75}
                transform={activo ? "scale(1.1)" : "scale(1)"}
                transition="all 0.3s ease"
                _focusVisible={focoBlanco}
              >
                <p.Icon size={{ base: "28px", md: "34px" }} />
              </Box>
            </Reveal>
          );
        })}
      </Flex>
    </Box>
  );
}
