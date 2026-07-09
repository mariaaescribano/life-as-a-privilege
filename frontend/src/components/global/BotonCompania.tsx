import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "./DisciplinaBgLayer";
import { AgendarLlamada } from "./AgendarLlamada";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

/* ──────────────────────────────────────────────────────────────────────────
 * BotonCompania — botón flotante REUTILIZABLE (abajo a la derecha, siempre
 * visible) para cualquier recorrido/disciplina.
 *
 * Flujo:  «¿Quieres compañía?»  → popup invitación
 *         → «Agenda tu llamada» → AgendarLlamada (día · hora · datos · pago)
 *         → el pago (simulado) confirma la reserva y le llega el email a María.
 *
 * Se tematiza por props (color/bgColor/disciplinaNom), así que se adapta a la
 * disciplina en la que esté el usuario. Es la versión genérica del flujo
 * «¿Necesitas ayuda?» que ya existía en el recorrido de Psicología.
 * ────────────────────────────────────────────────────────────────────────── */

interface BotonCompaniaProps {
  /** Color de acento/texto (color de la disciplina). */
  color: string;
  /** Color de fondo de la disciplina (para el velo/brillo sobre la imagen). */
  bgColor: string;
  /** Nombre de la disciplina, para pintar su fondo (DisciplinaBgLayer). */
  disciplinaNom: string;
  /** Precio en € de la llamada. Por defecto 20. */
  precio?: number;
  /** Texto del botón flotante. Por defecto «¿Quieres compañía?». */
  etiqueta?: string;
  /** Título del popup de invitación. */
  titulo?: string;
  /** Texto de invitación. */
  texto?: string;
  /** Título del box AgendarLlamada. */
  llamadaTitulo?: string;
  /** Subtítulo del box AgendarLlamada. */
  llamadaSubtitulo?: string;
}

export function BotonCompania({
  color,
  bgColor,
  disciplinaNom,
  precio = 20,
  etiqueta = "¿Quieres compañía?",
  titulo = "¿Prefieres hacerlo acompañado?",
  texto = "Puedes recorrer este tramo conmigo. Agenda una llamada, no hace falta hacerlo todo de forma individual.",
  llamadaTitulo = "Reserva tu llamada",
  llamadaSubtitulo,
}: BotonCompaniaProps) {
  const [preguntaOpen, setPreguntaOpen] = useState(false); // popup invitación
  const [companiaOpen, setCompaniaOpen] = useState(false);  // calendario de reserva

  const hasBg = hasDisciplinaBg(disciplinaNom);
  const tsh = `0 0 10px ${bgColor}, 0 0 22px ${bgColor}`;

  useLockBodyScroll(preguntaOpen || companiaOpen);

  return (
    <>
      {/* Botón flotante fijo abajo a la derecha */}
      <Box
        as="button"
        onClick={() => setPreguntaOpen(true)}
        position="fixed"
        bottom={{ base: 4, md: 6 }}
        right={{ base: 4, md: 6 }}
        zIndex={20}
        overflow="hidden"
        px={{ base: 4, md: 5 }}
        py={2}
        borderRadius="full"
        border={`1.5px solid ${color}`}
        fontFamily="'EB Garamond', serif"
        fontWeight="700"
        fontSize={{ base: "xs", md: "sm" }}
        letterSpacing="0.03em"
        cursor="pointer"
        whiteSpace="nowrap"
        boxShadow={`0 4px 18px ${bgColor}55, 0 0 14px ${color}22`}
        transition="all 0.18s"
        _hover={{ transform: "translateY(-2px)" }}
      >
        {hasBg ? (
          <DisciplinaBgLayer nom={disciplinaNom} borderRadius="full" />
        ) : (
          <Box position="absolute" inset={0} bg={bgColor} borderRadius="full" />
        )}
        <Box as="span" position="relative" zIndex={1} color={color} style={{ textShadow: tsh }}>
          {etiqueta}
        </Box>
      </Box>

      {/* Popup de invitación → «Agenda tu llamada» */}
      {preguntaOpen && (
        <Box
          position="fixed"
          inset={0}
          zIndex={2300}
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={{ base: 4, md: 10 }}
          py={{ base: 6, md: 10 }}
          bg="rgba(0,0,0,0.6)"
          sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          onClick={() => setPreguntaOpen(false)}
          fontFamily="'EB Garamond', serif"
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            position="relative"
            w="100%"
            maxW="460px"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow={`0 30px 80px rgba(0,0,0,0.55), 0 0 22px rgba(255,255,255,0.12), 0 0 50px rgba(255,255,255,0.06), 0 0 30px ${color}1a`}
          >
            {hasBg && <DisciplinaBgLayer nom={disciplinaNom} borderRadius="2xl" />}
            <Box
              position="relative"
              zIndex={1}
              bg={hasBg ? undefined : bgColor}
              px={{ base: 9, md: 14 }}
              py={{ base: 12, md: 16 }}
              textAlign="center"
            >
              <Box
                as="button"
                onClick={() => setPreguntaOpen(false)}
                position="absolute"
                top={3}
                right={3}
                w="34px"
                h="34px"
                borderRadius="full"
                border={`1px solid ${color}55`}
                bg="rgba(0,0,0,0.15)"
                color={color}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="md"
                cursor="pointer"
                _hover={{ borderColor: color, bg: `${color}22` }}
              >
                ✕
              </Box>
              <Text
                color={color}
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                lineHeight="1.4"
                mb={5}
                style={{ textShadow: tsh }}
              >
                {titulo}
              </Text>
              <Text
                color={`${color}dd`}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.8"
                mb={7}
                style={{ textShadow: tsh }}
              >
                {texto}
              </Text>
              <Box
                as="button"
                onClick={() => {
                  setPreguntaOpen(false);
                  setCompaniaOpen(true);
                }}
                px={9}
                py={3}
                borderRadius="full"
                bg={color}
                color={bgColor}
                border={`1px solid ${color}`}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "lg" }}
                letterSpacing="0.06em"
                cursor="pointer"
                boxShadow={`0 6px 20px ${color}44`}
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 10px 28px ${color}55` }}
              >
                Agenda tu llamada →
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Popup con el calendario de reserva (AgendarLlamada) */}
      {companiaOpen && (
        <Box
          position="fixed"
          inset={0}
          zIndex={2300}
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          px={{ base: 3, md: 10 }}
          py={{ base: 5, md: 10 }}
          bg="rgba(0,0,0,0.62)"
          sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={() => setCompaniaOpen(false)}
          fontFamily="'EB Garamond', serif"
          overflowY="auto"
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            position="relative"
            w="100%"
            maxW="640px"
            my="auto"
          >
            <Box
              as="button"
              onClick={() => setCompaniaOpen(false)}
              position="absolute"
              top={3}
              right={3}
              zIndex={2}
              w="36px"
              h="36px"
              borderRadius="full"
              bg="rgba(0,0,0,0.35)"
              border={`1px solid ${color}55`}
              color={color}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="lg"
              cursor="pointer"
              _hover={{ bg: `${color}22`, borderColor: color }}
            >
              ✕
            </Box>
            <AgendarLlamada
              color={color}
              bgColor={bgColor}
              disciplinaNom={disciplinaNom}
              precio={precio}
              titulo={llamadaTitulo}
              subtitulo={llamadaSubtitulo}
            />
          </Box>
        </Box>
      )}
    </>
  );
}

export default BotonCompania;
