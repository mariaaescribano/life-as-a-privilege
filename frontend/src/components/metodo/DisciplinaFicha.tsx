import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { SHADOW_BLACK, SHADOW_GRANATE, esOscuraNegra, naturalBoxShadow } from "../global/disciplinaSombras";
import { Breathe, Reveal, RevealItem, RevealStagger } from "../global/Reveal";
import { nombreEnMapa, type ContenidoSeccion } from "../../data/recorridoContenido";
import { tcmNom } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────────
// FICHA DE LA DISCIPLINA — icono + nombre + frase, «QUÉ INCLUYE» y las cajas de
// contenido.
//
// Es lo que en /elMetodo se abre como POPUP al pulsar una disciplina, y lo mismo
// que en la presentación de la disciplina (/d/:disciplina) va desplegado en la
// página, sin popup. Un solo componente para las dos: si se retoca la ficha,
// cambia en los dos sitios.
// ─────────────────────────────────────────────────────────────────────────────

export interface DisciplinaFichaProps {
  nom: string;
  bg: string;
  txt: string;
  /** Frase introductoria en cursiva, debajo del nombre. */
  desc: string;
  /** Las cajas de «Qué incluye». */
  contenido: ContenidoSeccion[];
  renderIcon: (size: string) => React.ReactNode;
  /** Retraso base de la cascada de entrada (en el popup entra tras la ficha). */
  delayBase?: number;
  /** Sin el icono grande ni el nombre de la disciplina: la ficha empieza por la
   *  frase. Lo usa /d/:disciplina, donde el nombre ya está en el header de la
   *  página y repetirlo sobra. En el popup de /elMetodo sí hacen falta. */
  sinCabecera?: boolean;
  /** SOLO las cajas de contenido: sin cabecera, sin frase y sin el rótulo «Qué
   *  incluye». Para cuando la ficha va en una columna que debe casar de altura
   *  con lo que tiene al lado (/d/astrologia, junto a la carta de muestra). */
  soloContenido?: boolean;
}

// ── Sombras de esta ficha ───────────────────────────────────────────────────
// Las tres variantes del recorrido (natural / negra / granate) viven en
// global/disciplinaSombras; aquí solo se elige cuál toca según la disciplina.
const sombraNombre = (nom: string, bg: string) =>
  nom === tcmNom
    ? SHADOW_GRANATE
    : esOscuraNegra(nom)
    ? SHADOW_BLACK
    : `0 1px 3px ${bg}f5, 0 0 8px ${bg}cc, 0 2px 16px ${bg}88, 0 0 16px rgba(255,255,255,0.41), 0 0 36px rgba(255,255,255,0.22)`;

const sombraFrase = (nom: string, bg: string) =>
  nom === tcmNom
    ? SHADOW_GRANATE
    : esOscuraNegra(nom)
    ? SHADOW_BLACK
    : `0 1px 3px ${bg}f5, 0 0 8px ${bg}cc, 0 2px 16px ${bg}88, 0 0 12px rgba(255,255,255,0.38), 0 0 26px rgba(255,255,255,0.19)`;

const sombraCaja = (nom: string, bg: string) =>
  nom === tcmNom ? SHADOW_GRANATE : esOscuraNegra(nom) ? SHADOW_BLACK : naturalBoxShadow(bg);

const sombraTituloCaja = (nom: string, bg: string) =>
  nom === tcmNom
    ? SHADOW_GRANATE
    : esOscuraNegra(nom)
    ? SHADOW_BLACK
    : hasDisciplinaBg(nom)
    ? naturalBoxShadow(bg)
    : undefined;

export function DisciplinaFicha({
  nom,
  bg,
  txt,
  desc,
  contenido,
  renderIcon,
  delayBase = 0,
  sinCabecera = false,
  soloContenido = false,
}: DisciplinaFichaProps) {
  const hasBg = hasDisciplinaBg(nom);
  // `soloContenido` implica también quitar la cabecera.
  const ocultaCabecera = sinCabecera || soloContenido;

  return (
    <>
      {!soloContenido && (
      <>
      {/* HERO ── icono + título + descripción ──
          Entra en cascada (icono → nombre → línea → frase) con un retraso
          sobre la propia ficha, para que se lea como una sola secuencia. */}
      <RevealStagger
        stagger={0.14}
        delayChildren={delayBase + 0.22}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={{ base: 4, md: 6 }}
        pt={{ base: 2, md: 4 }}
        position="relative"
        zIndex={1}
      >
        {!ocultaCabecera && (
        <RevealItem direction="up" distance={16} scaleFrom={0.9} display="flex" justifyContent="center">
          {/* El icono late despacio mientras la ficha está a la vista. */}
          <Breathe scale={0.02} duration={5}>
            <Box position="relative" display="flex" alignItems="center" justifyContent="center">
              <Box
                position="absolute"
                w={{ base: "160px", md: "200px" }}
                h={{ base: "160px", md: "200px" }}
                borderRadius="full"
                bg={`radial-gradient(circle, ${txt}33 0%, ${txt}00 70%)`}
              />
              <Box
                bg={hasBg ? "transparent" : bg}
                borderRadius="full"
                w={{ base: "108px", md: "128px" }}
                h={{ base: "108px", md: "128px" }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                border={`3px solid ${txt}`}
                boxShadow={`0 0 28px ${txt}cc, 0 4px 20px ${txt}77`}
                position="relative"
                overflow={hasBg ? "hidden" : undefined}
              >
                {hasBg && <DisciplinaBgLayer nom={nom} borderRadius="full" />}
                <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
                  {renderIcon("64px")}
                </Box>
              </Box>
            </Box>
          </Breathe>
        </RevealItem>
        )}

        {!ocultaCabecera && (
        <RevealItem direction="up" distance={14}>
          <Text
            color={txt}
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            textAlign="center"
            lineHeight="1.1"
            textShadow={sombraNombre(nom, bg)}
            filter={hasBg ? undefined : `drop-shadow(0 2px 14px ${txt}55)`}
          >
            {nombreEnMapa(nom)}
          </Text>
        </RevealItem>
        )}

        <RevealItem direction="none" scaleFrom={0.3}>
          <Box w="80px" h="2px" bgGradient={`linear(to-r, transparent, ${txt}, transparent)`} opacity={0.7} />
        </RevealItem>

        <RevealItem direction="up" distance={14}>
          <Text
            color={txt}
            fontSize={{ base: "lg", md: "2xl" }}
            fontStyle="italic"
            textAlign="center"
            lineHeight="1.7"
            letterSpacing="0.02em"
            opacity={0.95}
            maxW="640px"
            textShadow={sombraFrase(nom, bg)}
          >
            {desc}
          </Text>
        </RevealItem>
      </RevealStagger>

      {/* Separador antes del contenido */}
      <Reveal
        direction="none"
        scaleFrom={0.9}
        delay={delayBase + 0.5}
        duration={0.7}
        position="relative"
        zIndex={1}
      >
        <Flex align="center" gap={4} mt={{ base: 2, md: 4 }}>
          <Box flex="1" h="1px" bgGradient={`linear(to-r, transparent, ${txt}55)`} />
          <Text
            color={txt}
            opacity={0.7}
            fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.32em"
            textTransform="uppercase"
            fontWeight="600"
            textShadow={naturalBoxShadow(bg)}
          >
            Qué incluye
          </Text>
          <Box flex="1" h="1px" bgGradient={`linear(to-l, transparent, ${txt}55)`} />
        </Flex>
      </Reveal>
      </>
      )}

      {/* SECCIONES DE CONTENIDO — cada una dentro de un panel translúcido
          claro, estilo cristal, para separarlas visualmente del fondo de
          la disciplina. Sin hover ni shadow fuerte para no parecer botón.
          Entran en cascada, uno detrás de otro, después del hero. */}
      <RevealStagger
        stagger={0.18}
        delayChildren={delayBase + 0.6}
        display="flex"
        flexDirection="column"
        gap={{ base: 4, md: 5 }}
        position="relative"
        zIndex={1}
      >
        {contenido.map((seccion, i) => (
          <RevealItem
            key={i}
            direction="up"
            distance={18}
            scaleFrom={0.98}
            display="flex"
            flexDirection="column"
            px={{ base: 5, md: 7 }}
            py={{ base: 5, md: 6 }}
            gap={{ base: 3, md: 4 }}
            cursor="default"
            userSelect="text"
            bg="rgba(255,255,255,0.08)"
            border="1px solid rgba(255,255,255,0.14)"
            borderRadius="xl"
            sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          >
            {/* Título de sección */}
            <Text
              color={txt}
              fontSize={{ base: "16px", md: "20px" }}
              fontWeight="700"
              letterSpacing="0.04em"
              lineHeight="1.25"
              textAlign="center"
              textShadow={sombraTituloCaja(nom, bg)}
            >
              {seccion.titulo}
            </Text>

            {/* Items */}
            <Flex direction="column" gap={{ base: 2, md: 2.5 }} flex="1">
              {seccion.items.map((item, j) => (
                <Text
                  key={j}
                  color={txt}
                  opacity={1}
                  fontSize={{ base: "14px", md: "16px" }}
                  lineHeight={{ base: "1.6", md: "1.7" }}
                  letterSpacing="0.01em"
                  textAlign="center"
                  textShadow={sombraCaja(nom, bg)}
                >
                  {item}
                </Text>
              ))}
            </Flex>

            {/* Aviso (p.ej. "Se cobra aparte") */}
            {seccion.aviso && (
              <Flex align="center" justify="center" gap={{ base: 1.5, md: 2 }} mt={1}>
                <Box
                  as="svg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  w={{ base: "12px", md: "14px" }}
                  h={{ base: "12px", md: "14px" }}
                  fill={txt}
                  opacity={0.95}
                  flexShrink={0}
                >
                  <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
                </Box>
                <Text
                  color={txt}
                  fontSize={{ base: "xs", md: "sm" }}
                  letterSpacing="0.06em"
                  fontStyle="italic"
                  opacity={0.95}
                  lineHeight="1.3"
                  textShadow={sombraCaja(nom, bg)}
                >
                  {seccion.aviso}
                </Text>
              </Flex>
            )}
          </RevealItem>
        ))}
      </RevealStagger>
    </>
  );
}

/** La ficha dentro de su caja con el fondo de la disciplina, para usarla suelta
 *  en una página (no como popup). En /elMetodo la caja la pone el propio modal. */
export function DisciplinaFichaBox({
  radio = "3xl",
  alto = false,
  ...props
}: DisciplinaFichaProps & {
  radio?: string;
  /** Ocupa todo el alto de su hueco: para casar con la columna de al lado. */
  alto?: boolean;
}) {
  const { nom, bg, txt } = props;
  const hasBg = hasDisciplinaBg(nom);
  return (
    <Box
      position="relative"
      w="100%"
      h={alto ? "100%" : undefined}
      borderRadius={radio}
      overflow="hidden"
      bg={hasBg ? "transparent" : bg + "f0"}
      border={`1.5px solid ${txt}66`}
      boxShadow={`0 0 0 1px ${txt}55, 0 0 45px ${txt}66, 0 0 90px ${txt}33`}
    >
      {hasBg && <DisciplinaBgLayer nom={nom} borderRadius={radio} />}
      <Flex
        direction="column"
        gap={{ base: 6, md: 8 }}
        justify={alto ? "center" : undefined}
        h={alto ? "100%" : undefined}
        position="relative"
        zIndex={1}
        px={{ base: 7, md: 12 }}
        py={{ base: 8, md: 12 }}
      >
        <DisciplinaFicha {...props} />
      </Flex>
    </Box>
  );
}
