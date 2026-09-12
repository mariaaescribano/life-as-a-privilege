import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";

// ─────────────────────────────────────────────────────────────────────────
// BOTÓN DE FIN DE PÁGINA · el mismo en todo el recorrido
//
// En las páginas largas, cuando terminas de leer, el header (con sus botones
// «← anterior» y «siguiente →») se ha quedado a diez pantallas de distancia.
// Este botón repite ahí abajo el paso que toca, con el MISMO texto que el botón
// del header.
//
// Reglas de la casa:
//  · Fondo = la imagen de la disciplina (DisciplinaBgLayer), letra y borde con
//    su color de tinta. Igual en todas: solo cambia la disciplina.
//  · Si LLEVA ADELANTE (`next`), va abajo a la DERECHA con la flecha →.
//    Si es VOLVER (`prev` o `up`), va abajo a la IZQUIERDA con su flecha.
//  · NO es flotante: va como último hijo de la columna de contenido. Las dos
//    esquinas inferiores fijas ya están ocupadas —«Agenda una llamada» a la
//    derecha y «Índice / Mis notas» a la izquierda—, y un botón fijo más se
//    montaría encima.
// ─────────────────────────────────────────────────────────────────────────

/** Flechas (Material Symbols). El chevron es el mismo del header. */
const PATH_CHEVRON = "M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z";
const PATH_ARRIBA = "M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z";

export function BotonPaso({ label, onClick, nom, color, bg, direction = "next", disabled, title }: {
  /** El mismo texto que el botón del header, SIN la flecha (la dibuja él). */
  label: string;
  onClick: () => void;
  /** Nombre interno de la disciplina (`tcmNom`, `fisiologiaNom`…). */
  nom: string;
  /** Color de tinta de la disciplina (letra, borde y glow). */
  color: string;
  /** Color de fondo de la disciplina (solo para la sombra del texto). */
  bg: string;
  /** «next» lleva adelante (derecha); «prev» y «up» son volver (izquierda). */
  direction?: "next" | "prev" | "up";
  /** Apagado: el paso siguiente aún no está desbloqueado (no se puede pulsar). */
  disabled?: boolean;
  /** Por qué está apagado (sale al pasar por encima). */
  title?: string;
}) {
  const esVolver = direction !== "next";
  // OJO con el relleno: iba en `currentColor`, y como el <svg> es HERMANO del
  // <Text> (no hijo), no heredaba la tinta de la disciplina sino el color por
  // defecto del <button> — negro. Sobre los fondos oscuros la flecha
  // desaparecía. Va con el color explícito y con el mismo halo que la letra.
  const flecha = (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
         w={{ base: "16px", md: "18px" }} h={{ base: "16px", md: "18px" }}
         fill={color} flexShrink={0}
         style={{
           transform: direction === "prev" ? "scaleX(-1)" : undefined,
           filter: `drop-shadow(0 1px 4px ${bg}) drop-shadow(0 0 6px ${bg})`,
         }}>
      <path d={direction === "up" ? PATH_ARRIBA : PATH_CHEVRON} />
    </Box>
  );

  return (
    <Box
      as="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={disabled ? title : undefined}
      opacity={disabled ? 0.42 : 1}
      alignSelf={esVolver ? "flex-start" : "flex-end"}
      mt={{ base: 2, md: 3 }}
      position="relative"
      overflow="hidden"
      borderRadius="full"
      border={`1.5px solid ${color}aa`}
      bg={hasDisciplinaBg(nom) ? "transparent" : bg}
      boxShadow={`0 0 10px rgba(255,255,255,0.16), 0 0 22px ${color}44, inset 0 0 12px ${color}22`}
      cursor={disabled ? "not-allowed" : "pointer"}
      transition="transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease"
      _hover={disabled ? undefined : {
        borderColor: color,
        transform: "translateY(-2px)",
        boxShadow: `0 0 14px rgba(255,255,255,0.35), 0 0 34px ${color}55`,
      }}
      _active={disabled ? undefined : { transform: "scale(0.97)" }}
      sx={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent", userSelect: "none" }}
    >
      {hasDisciplinaBg(nom) && <DisciplinaBgLayer nom={nom} borderRadius="full" />}

      <Flex position="relative" zIndex={1} align="center" gap={{ base: 2, md: 2.5 }}
            px={{ base: 5, md: 7 }} py={{ base: 2, md: 2.5 }}>
        {esVolver && flecha}
        <Text color={color} fontFamily="'EB Garamond', serif" fontStyle="italic"
              fontSize={{ base: "sm", md: "md" }} letterSpacing="0.05em" whiteSpace="nowrap"
              style={{ textShadow: `0 1px 4px ${bg}, 0 2px 10px ${bg}, 0 0 6px ${bg}` }}>
          {label}
        </Text>
        {!esVolver && flecha}
      </Flex>
    </Box>
  );
}
