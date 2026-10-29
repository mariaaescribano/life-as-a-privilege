import React from "react";
import { Box, Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { Reveal, Breathe } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import type { DisciplinaFila } from "./WelcomeDisciplinas";

/**
 * Las ocho disciplinas alrededor de un mandala: el loto de línea fina en el
 * centro y, en círculo, el medallón de cada disciplina (su foto, su color, su
 * halo). Es un apartado más para explicar las disciplinas de un vistazo; la
 * lista de debajo (WelcomeDisciplinas) las cuenta una a una.
 *
 * TODO se mide en porcentajes del cuadrado `stage`, así que es la misma
 * composición en móvil que en escritorio. En escritorio (lg) cada medallón lleva
 * al lado su nombre y su frase; en móvil no caben y van solo los medallones.
 * Texto fuera de cajas: blanco y sin sombra.
 *
 * Geometría (en unidades del cuadrado de 420): el aro del mandala mide 120 de
 * radio y los medallones están sobre una circunferencia de 190, justo donde pasa
 * el dibujo tenue del fondo.
 */
const RADIO_MEDALLON = 190 / 420; // distancia del centro, en fracción del cuadrado
const TAM_MEDALLON = 64 / 420;    // diámetro del medallón
const TAM_MANDALA = 400 / 420;    // ancho de la imagen (su aro queda en radio 120)

const HALO_MANDALA = "drop-shadow(0 0 8px rgba(255,255,255,0.28)) drop-shadow(0 0 22px rgba(180,255,245,0.14))";

const Medallon = ({ d, i, angulo, conTexto }: { d: DisciplinaFila; i: number; angulo: number; conTexto: boolean }) => {
  const navigate = useNavigate();
  const t = useT();
  const nombreDe = useNombreDisciplina();
  const conFondo = hasDisciplinaBg(d.name);
  const rad = (angulo * Math.PI) / 180;
  const cx = Math.cos(rad);
  const cy = Math.sin(rad);
  const x = 50 + RADIO_MEDALLON * 100 * cx;
  const y = 50 + RADIO_MEDALLON * 100 * cy;

  // Dónde cae el texto respecto al medallón: a la derecha, a la izquierda, o
  // encima/debajo para los dos de arriba y abajo del todo.
  const lado: "der" | "izq" | "arriba" | "abajo" =
    Math.abs(cx) < 0.3 ? (cy < 0 ? "arriba" : "abajo") : cx > 0 ? "der" : "izq";
  const posTexto =
    lado === "der" ? { left: "calc(100% + 16px)", top: "50%", transform: "translateY(-50%)", textAlign: "left" as const }
    : lado === "izq" ? { right: "calc(100% + 16px)", top: "50%", transform: "translateY(-50%)", textAlign: "right" as const }
    : lado === "arriba" ? { bottom: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", textAlign: "center" as const }
    : { top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", textAlign: "center" as const };

  return (
    <Box position="absolute" left={`${x}%`} top={`${y}%`} w={`${TAM_MEDALLON * 100}%`} sx={{ aspectRatio: "1 / 1", transform: "translate(-50%, -50%)" }}>
      <Reveal inView amount={0.3} direction="none" scaleFrom={0.6} duration={0.8} delay={0.15 + i * 0.1} w="100%" h="100%">
        <Box
          as="button"
          type="button"
          onClick={() => navigate(d.link)}
          aria-label={nombreDe(d.name)}
          role="group"
          position="relative"
          w="100%"
          h="100%"
          p={0}
          bg="transparent"
          border="none"
          cursor="pointer"
          _focusVisible={{ ...focoBlanco, borderRadius: "full" }}
        >
          <Breathe scale={0.04} duration={5.5 + (i % 3) * 0.7} delay={1 + i * 0.35}>
            <Box
              position="relative"
              w="100%"
              h="100%"
              borderRadius="full"
              border={`2.5px solid ${d.txt}`}
              bg={conFondo ? "transparent" : d.bg}
              boxShadow={`0 0 12px ${d.txt}70, 0 0 26px ${d.txt}38`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              transition="transform 0.3s ease, box-shadow 0.3s ease"
              _groupHover={{ transform: "scale(1.1)", boxShadow: `0 0 18px ${d.txt}99, 0 0 36px ${d.txt}50` }}
            >
              {conFondo && <DisciplinaBgLayer nom={d.name} borderRadius="full" />}
              <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
                {d.renderIcon(conTexto ? "38px" : "24px")}
              </Box>
            </Box>
          </Breathe>

          {conTexto && (
            <Box position="absolute" w="200px" pointerEvents="none" {...posTexto}>
              <Text color="white" fontFamily="'EB Garamond', serif" fontWeight="700" fontSize="xl" letterSpacing="0.03em" lineHeight="1.15">
                {nombreDe(d.name)}
              </Text>
              {d.lemaKey && (
                <Text color="white" opacity={0.85} fontFamily="'EB Garamond', serif" fontSize="md" lineHeight="1.35" mt={1}>
                  {t(d.lemaKey)}
                </Text>
              )}
            </Box>
          )}
        </Box>
      </Reveal>
    </Box>
  );
};

const WelcomeMandala = ({ disciplinas }: { disciplinas: DisciplinaFila[] }) => {
  const conTexto = useBreakpointValue({ base: false, lg: true }) ?? false;

  return (
    <Flex
      w="100%"
      justify="center"
      px={{ base: 5, md: 10 }}
      // En escritorio el texto de los medallones de arriba y abajo sobresale del
      // cuadrado: se les deja ese aire.
      py={{ base: 8, lg: "76px" }}
    >
      <Box position="relative" w={{ base: "min(100%, 360px)", lg: "420px" }} sx={{ aspectRatio: "1 / 1" }}>
        <Reveal inView amount={0.3} direction="none" scaleFrom={0.85} duration={1.1} w="100%" h="100%">
          <Box position="relative" w="100%" h="100%">
            <Image
              src="/img/icono/mandalaDisciplinas.svg"
              alt=""
              aria-hidden="true"
              position="absolute"
              top="50%"
              left="50%"
              w={`${TAM_MANDALA * 100}%`}
              maxW="none"
              style={{ filter: HALO_MANDALA }}
              sx={{
                transform: "translate(-50%, -50%)",
                "@keyframes mandalaGira": { to: { transform: "translate(-50%, -50%) rotate(360deg)" } },
                animation: "mandalaGira 240s linear infinite",
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              }}
            />
          </Box>
        </Reveal>
        {disciplinas.map((d, i) => (
          <Medallon key={d.name} d={d} i={i} angulo={-90 + (360 / disciplinas.length) * i} conTexto={conTexto} />
        ))}
      </Box>
    </Flex>
  );
};

export default WelcomeMandala;
