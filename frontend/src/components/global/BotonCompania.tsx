import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "./DisciplinaBgLayer";
import { AgendarLlamada } from "./AgendarLlamada";
import { PRECIO_LLAMADA, type LlamadaTipo } from "./llamadaPrecios";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

/* ──────────────────────────────────────────────────────────────────────────
 * BotonCompania — botón flotante REUTILIZABLE (abajo a la derecha, siempre
 * visible) para cualquier recorrido/disciplina.
 *
 * Flujo:  «Agenda una llamada»  → popup invitación
 *         → «Agenda tu llamada» → AgendarLlamada (día · hora · datos · pago)
 *         → el pago (simulado) confirma la reserva y le llega el email a María.
 *
 * Se tematiza por props (color/bgColor/disciplinaNom), así que se adapta a la
 * disciplina en la que esté el usuario. Es la versión genérica del flujo
 * «¿Necesitas ayuda?» que ya existía en el recorrido de Psicología.
 * ────────────────────────────────────────────────────────────────────────── */

/** Icono de «añadir llamada» (teléfono + ✚). Va a la izquierda del texto en el
 *  botón flotante y a la izquierda del título del popup de invitación. Hereda el
 *  color del contenedor (currentColor), así que sirve para cualquier disciplina. */
export const LlamadaIcon = ({ size = "16px" }: { size?: any }) => (
  <Box
    as="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    w={size}
    h={size}
    fill="currentColor"
    flexShrink={0}
    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.35))" }}
  >
    <path d="M640-520v-120H520v-80h120v-120h80v120h120v80H720v120h-80Zm158 400q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" />
  </Box>
);

/** Icono de interrogación del botón «¿Qué es esto?». */
export const HelpIcon = ({ size = "16px" }: { size?: any }) => (
  <Box
    as="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    w={size}
    h={size}
    fill="currentColor"
    flexShrink={0}
    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.35))" }}
  >
    <path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-146h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-634l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-544q-44 39-54 59t-10 99Zm38 306q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
  </Box>
);

/** Explicación de la página («¿Qué es esto?»): el botón va SIEMPRE justo encima
 *  del de «Agenda una llamada», en la misma columna flotante. */
export interface QueEsEsto {
  /** Título del popup. Por defecto, «¿Qué es esto?». */
  titulo?: string;
  /** Párrafos de la explicación. */
  parrafos: string[];
}

/** Pastilla flotante de la esquina: fondo de la disciplina, borde y halo. La
 *  usan los dos botones de la columna («¿Qué es esto?» y la llamada) para que
 *  sean idénticos. */
const PillFlotante = ({
  onClick, icon, children, color, bgColor, disciplinaNom, hasBg, tsh,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  color: string;
  bgColor: string;
  disciplinaNom: string;
  hasBg: boolean;
  tsh: string;
}) => (
  <Box
    as="button"
    onClick={onClick}
    position="relative"
    overflow="hidden"
    px={{ base: 4, md: 5 }}
    py={2}
    borderRadius="full"
    // Trazo más fino y algo apagado en móvil (igual que «Índice» y «Mis
    // notas»): a ese tamaño los 2px llenos hacían un contorno duro.
    border={{ base: `1px solid ${color}80`, md: `2px solid ${color}` }}
    fontFamily="'EB Garamond', serif"
    fontWeight="700"
    fontSize={{ base: "xs", md: "sm" }}
    letterSpacing="0.03em"
    cursor="pointer"
    whiteSpace="nowrap"
    // Misma sombra y mismo hover que los botones flotantes de la esquina
    // opuesta («Índice» y «Mis notas»): sombra oscura de base para que el
    // botón despegue del fondo, más un halo del color de la disciplina que
    // se intensifica al pasar por encima.
    boxShadow={`0 4px 20px rgba(0,0,0,0.28), 0 0 18px ${bgColor}66`}
    transition="all 0.18s"
    _hover={{
      transform: "translateY(-2px)",
      boxShadow: `0 6px 28px rgba(0,0,0,0.35), 0 0 28px ${bgColor}aa`,
    }}
  >
    {hasBg ? (
      <DisciplinaBgLayer nom={disciplinaNom} borderRadius="full" />
    ) : (
      <Box position="absolute" inset={0} bg={bgColor} borderRadius="full" />
    )}
    <Box
      as="span"
      position="relative"
      zIndex={1}
      color={color}
      display="inline-flex"
      alignItems="center"
      gap={{ base: 1.5, md: 2 }}
      style={{ textShadow: tsh }}
    >
      {icon}
      {children}
    </Box>
  </Box>
);

interface BotonCompaniaProps {
  /** Color de acento/texto (color de la disciplina). */
  color: string;
  /** Color de fondo de la disciplina (para el velo/brillo sobre la imagen). */
  bgColor: string;
  /** Nombre de la disciplina, para pintar su fondo (DisciplinaBgLayer). */
  disciplinaNom: string;
  /** Tipo de llamada: decide el importe que cobra el backend. */
  tipo?: LlamadaTipo;
  /** Precio en € solo para MOSTRAR. Por defecto, el del tipo. */
  precio?: number;
  /** Texto del botón flotante. Por defecto «Agenda una llamada». */
  etiqueta?: string;
  /** Título del popup de invitación. */
  titulo?: string;
  /** Texto de invitación. */
  texto?: string;
  /** Título del box AgendarLlamada. */
  llamadaTitulo?: string;
  /** Subtítulo del box AgendarLlamada. */
  llamadaSubtitulo?: string;
  /** Explicación de la página: añade el botón «¿Qué es esto?» ENCIMA del de la
   *  llamada y su popup. Si no se pasa, no aparece el botón. */
  queEsEsto?: QueEsEsto;
}

export function BotonCompania({
  color,
  bgColor,
  disciplinaNom,
  tipo = "estandar",
  precio = PRECIO_LLAMADA[tipo],
  etiqueta = "Agenda una llamada",
  titulo = "Agenda una llamada",
  texto = "Puedes recorrer este tramo conmigo. Agenda una llamada, no hace falta hacerlo todo de forma individual.",
  llamadaTitulo = "Reserva tu llamada",
  llamadaSubtitulo,
  queEsEsto,
}: BotonCompaniaProps) {
  const [preguntaOpen, setPreguntaOpen] = useState(false); // popup invitación
  const [companiaOpen, setCompaniaOpen] = useState(false);  // calendario de reserva
  const [queEsOpen, setQueEsOpen] = useState(false);        // popup «¿Qué es esto?»

  const hasBg = hasDisciplinaBg(disciplinaNom);
  const tsh = `0 0 10px ${bgColor}, 0 0 22px ${bgColor}`;
  // El título del popup de explicación es también la etiqueta de su botón.
  const queEsTitulo = queEsEsto?.titulo ?? "¿Qué es esto?";

  useLockBodyScroll(preguntaOpen || companiaOpen || queEsOpen);

  // Al volver del pago de Stripe (o de cancelarlo), abrimos el popup de reserva
  // para que AgendarLlamada monte y confirme el pago (verify) / muestre el aviso.
  // Sin esto, al reservar desde este botón flotante el popup estaría cerrado y la
  // reserva no llegaría a confirmarse tras el pago.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("llamada_pagada") || params.get("llamada_cancelada")) {
      setCompaniaOpen(true);
    }
  }, []);

  return (
    <>
      {/* Columna flotante fija abajo a la derecha. El orden NUNCA cambia:
          «¿Qué es esto?» (si la página trae explicación) arriba y «Agenda una
          llamada» debajo. */}
      <Flex
        position="fixed"
        bottom={{ base: 4, md: 6 }}
        right={{ base: 4, md: 6 }}
        zIndex={20}
        direction="column"
        align="flex-end"
        gap={2}
      >
        {queEsEsto && (
          <PillFlotante
            onClick={() => setQueEsOpen(true)}
            icon={<HelpIcon size={{ base: "14px", md: "16px" }} />}
            color={color} bgColor={bgColor} disciplinaNom={disciplinaNom} hasBg={hasBg} tsh={tsh}
          >
            {queEsTitulo}
          </PillFlotante>
        )}
        <PillFlotante
          onClick={() => setPreguntaOpen(true)}
          icon={<LlamadaIcon size={{ base: "14px", md: "16px" }} />}
          color={color} bgColor={bgColor} disciplinaNom={disciplinaNom} hasBg={hasBg} tsh={tsh}
        >
          {etiqueta}
        </PillFlotante>
      </Flex>

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
              {/* Título con el icono de llamada a su izquierda (mismo icono que
                  el botón flotante, así el popup se reconoce al abrirlo). */}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={{ base: 2.5, md: 3 }}
                color={color}
                mb={5}
                style={{ textShadow: tsh }}
              >
                <LlamadaIcon size={{ base: "22px", md: "26px" }} />
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="700"
                  lineHeight="1.4"
                >
                  {titulo}
                </Text>
              </Box>
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

      {/* Popup «¿Qué es esto?» → explicación de la página. Misma caja que la
          invitación de la llamada (fondo de la disciplina), con scroll interno
          por si la explicación es larga. */}
      {queEsOpen && queEsEsto && (
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
          onClick={() => setQueEsOpen(false)}
          fontFamily="'EB Garamond', serif"
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            position="relative"
            w="100%"
            maxW="560px"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow={`0 30px 80px rgba(0,0,0,0.55), 0 0 22px rgba(255,255,255,0.12), 0 0 50px rgba(255,255,255,0.06), 0 0 30px ${color}1a`}
          >
            {hasBg && <DisciplinaBgLayer nom={disciplinaNom} borderRadius="2xl" />}
            <Box
              position="relative"
              zIndex={1}
              bg={hasBg ? undefined : bgColor}
              px={{ base: 7, md: 12 }}
              py={{ base: 10, md: 12 }}
              maxH={{ base: "calc(100dvh - 48px)", md: "calc(100vh - 80px)" }}
              overflowY="auto"
              sx={{
                "&::-webkit-scrollbar": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { background: `${color}55`, borderRadius: "9999px" },
              }}
            >
              <Box
                as="button"
                onClick={() => setQueEsOpen(false)}
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

              {/* Título con el icono de interrogación a su izquierda */}
              <Flex align="center" justify="center" gap={{ base: 2.5, md: 3 }} color={color} pr={6}
                    style={{ textShadow: tsh }}>
                <HelpIcon size={{ base: "22px", md: "26px" }} />
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.4" textAlign="center">
                  {queEsTitulo}
                </Text>
              </Flex>

              <Box h="1px" w="55%" maxW="240px" mx="auto" my={5}
                   bgGradient={`linear(to-r, transparent, ${color}66, transparent)`} />

              <Flex direction="column" gap={4}>
                {queEsEsto.parrafos.map((p, i) => (
                  <Text key={i} color={`${color}ee`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                        style={{ textShadow: tsh }}>
                    {p}
                  </Text>
                ))}
              </Flex>

              <Flex justify="flex-end" mt={7}>
                <Box
                  as="button"
                  onClick={() => setQueEsOpen(false)}
                  px={8}
                  py={2.5}
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
                  Entendido
                </Box>
              </Flex>
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
              tipo={tipo}
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
