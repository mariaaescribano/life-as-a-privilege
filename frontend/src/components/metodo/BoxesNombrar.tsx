// ─────────────────────────────────────────────────────────────────────────
// Los DOS BOXES gemelos de «nombrar cosas» (Nudos y Miedos): a la izquierda la
// pregunta, la entrada y los ejemplos de inspiración (que entran de uno en
// uno, en cascada); a la derecha la lista de lo elegido, una fila debajo de
// otra en el orden en que se eligió, todas del mismo ancho. Los dos boxes
// miden EXACTAMENTE lo mismo (flex 1 y 1).
//
// Es UNA pieza para las dos páginas: cambia solo el texto, el icono y de dónde
// salen los datos. Si algún día se nombra una tercera cosa, se monta con esto.
// ─────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { Box, Flex, Input, SimpleGrid, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { Reveal } from "../global/Reveal";
import { AZUL, glowPanel, azulBorde } from "./psicologiaGlow";
import { neuropsicologiaBg, neuropsicologiaNom, neuropsicologiaTxt } from "../../GlobalVariables";
import { useT } from "../../i18n";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

// `motion(Box)` casteado, como en el resto de la casa (el `transition` de
// Chakra y el de framer chocan de tipos).
const MotionBox = motion(Box) as any;
const MotionFlex = motion(Flex) as any;

export interface BoxesNombrarProps {
  /** Icono junto a la pregunta (la espiral en Nudos). */
  iconoPregunta?: React.ReactNode;
  pregunta: string;
  /** Línea de apoyo bajo la pregunta (la usa Miedos). */
  apoyo?: string;
  /** Placeholder de la entrada («Escribe un nudo y pulsa Añadir…»). */
  placeholder: string;
  /** Ejemplos de inspiración (los elegidos dejan su hueco invisible). */
  ejemplos: string[];
  /** Título del box de la derecha («Mis Nudos»). */
  tituloLista: string;
  /** Icono del título de la lista y de cada fila (la espiral en Nudos). */
  iconoLista?: React.ReactNode;
  iconoFila?: React.ReactNode;
  /** Lo elegido, en su orden. */
  items: { id: string; texto: string }[];
  /** Texto del hueco vacío («Aquí aparecerán tus nudos…»). */
  vacioTexto: string;
  /** Texto de «se guardan solos» (con items) y estado de guardado. */
  seGuardanTexto: string;
  guardando: boolean;
  onAñadir: (texto: string) => void;
  onQuitar: (id: string) => void;
}

export function BoxesNombrar({
  iconoPregunta,
  pregunta,
  apoyo,
  placeholder,
  ejemplos,
  tituloLista,
  iconoLista,
  iconoFila,
  items,
  vacioTexto,
  seGuardanTexto,
  guardando,
  onAñadir,
  onQuitar,
}: BoxesNombrarProps) {
  const t = useT();
  const [entrada, setEntrada] = useState("");

  const añadir = (texto: string) => {
    if (!texto.trim()) return;
    onAñadir(texto);
    setEntrada("");
  };

  const ejemplosDisponibles = ejemplos.filter(
    (e) => !items.some((it) => it.texto.toLowerCase() === e.toLowerCase()),
  );

  return (
    <Flex w="100%" direction={{ base: "column", lg: "row" }} align="stretch"
          gap={{ base: 7, md: 9, lg: 6 }}>

      {/* Box principal: pregunta + entrada + ejemplos. Mismo ancho EXACTO que
          el de la lista (flex 1 y 1): dos columnas gemelas. */}
      <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75}
              w="100%" flex={{ lg: "1" }} minW={0} display="flex">
      <Box
        position="relative"
        w="100%"
        h="100%"
        display="flex"
        flexDirection="column"
        borderRadius="2xl"
        overflow="hidden"
        border={azulBorde}
        boxShadow={glowPanel}
      >
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
        <Flex position="relative" zIndex={1} flex="1" direction="column" align="center"
              gap={{ base: 6, md: 7 }} px={{ base: 6, md: 8 }} py={{ base: 8, md: 10 }}>

          {/* Pregunta principal */}
          <Flex direction="column" align="center" textAlign="center" gap={3} maxW="620px">
            <Flex align="center" justify="center" gap={3}>
              {iconoPregunta}
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                {pregunta}
              </Text>
            </Flex>
            {apoyo && (
              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" opacity={0.9} style={{ textShadow: INK_SHADOW }}>
                {apoyo}
              </Text>
            )}
          </Flex>

          {/* Entrada para añadir */}
          <Flex w="100%" maxW="560px" gap={3} direction={{ base: "column", sm: "row" }}>
            <Input
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") añadir(entrada); }}
              placeholder={placeholder}
              flex="1"
              bg="rgba(255,251,243,0.72)"
              border={`1px solid ${TINTA}33`}
              color={TINTA}
              borderRadius="xl"
              size="lg"
              // Móvil: la entrada va MÁS GRANDE (más alta y con la letra de
              // lectura), que es donde se escribe y donde tiene que apetecer
              // escribir. De `sm` en adelante, el alto normal del size lg.
              h={{ base: "58px", sm: "3rem" }}
              fontFamily="'EB Garamond', serif"
              fontSize="lg"
              sx={{ caretColor: TINTA }}
              _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
              _hover={{ borderColor: `${TINTA}55` }}
              _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.85)" }}
            />
            <Box
              as="button"
              onClick={() => añadir(entrada)}
              position="relative"
              overflow="hidden"
              px={8}
              borderRadius="xl"
              bg={TINTA}
              border={`1.5px solid ${TINTA}`}
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.04em"
              cursor="pointer"
              py={{ base: 3, sm: 0 }}
              boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`}
              transition="all 0.2s"
              _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}
            >
              <Box as="span" position="relative" zIndex={1} color={neuropsicologiaBg}
                   style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>{t("metodo.psico.anadirCorto")}</Box>
            </Box>
          </Flex>

          {/* Ejemplos sugeridos (opcionales). En ESCRITORIO, para que el box no
              dé un salto al elegir uno, el elegido no se quita de la rejilla:
              se vuelve invisible y deja su hueco (el alto lo fija la lista
              completa). En MÓVIL es al revés, a propósito: el elegido SÍ
              desaparece y el box de ejemplos se hace más pequeño — apilado en
              una columna, los huecos invisibles alargaban la página sin
              enseñar nada. */}
          <>
            {/* Separador horizontal completo (ancho del box) */}
            <Box w="100%" h="1px" bgGradient={`linear(to-r, transparent, ${TINTA}55, transparent)`} />
            <Flex direction="column" align="center" gap={3} w="100%" maxW="620px" pt={{ base: 1, md: 2 }}>
              <Text color={TINTA} fontSize="xs" letterSpacing="0.14em" textTransform="uppercase" opacity={0.6} fontWeight="600">{t("metodo.psico.siTeSirven")}</Text>
              <Box w="100%" position="relative">
                {/* Rejilla de opciones IGUALES (mismo ancho todas), que entran
                    de una en una, en cascada. */}
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2.5} py={1}>
                  {ejemplos.map((e, i) => {
                    const usado = !ejemplosDisponibles.includes(e);
                    return (
                      <MotionBox
                        key={e}
                        as="button"
                        onClick={() => añadir(e)}
                        aria-hidden={usado || undefined}
                        tabIndex={usado ? -1 : undefined}
                        visibility={usado ? "hidden" : "visible"}
                        display={usado ? { base: "none", lg: "inline-block" } : undefined}
                        pointerEvents={usado ? "none" : undefined}
                        w="100%"
                        px={4}
                        py={2}
                        borderRadius="full"
                        bg="rgba(255,251,243,0.35)"
                        color={TINTA}
                        border={`1px dashed ${TINTA}55`}
                        fontFamily="'EB Garamond', serif"
                        fontSize={{ base: "sm", md: "md" }}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        cursor="pointer"
                        sx={{ transition: "background 0.18s ease, border-color 0.18s ease" }}
                        _hover={{ bg: "rgba(255,251,243,0.6)", borderColor: TINTA }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.09, duration: 0.4, ease: "easeOut" }}
                      >
                        + {e}
                      </MotionBox>
                    );
                  })}
                </SimpleGrid>

                {/* Cuando ya no queda ninguno, en escritorio el aviso va ENCIMA
                    de los huecos (posición absoluta): si ocupara sitio, el box
                    cambiaría de alto justo al final. En móvil los huecos ya no
                    existen (la rejilla se vació), así que el aviso ocupa su
                    sitio normal. */}
                {ejemplosDisponibles.length === 0 && (
                  <Flex position={{ base: "static", lg: "absolute" }} inset={0} py={{ base: 3, lg: 0 }}
                        align="center" justify="center" pointerEvents="none">
                    <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.6} textAlign="center">{t("metodo.psico.todosLosEjemplos")}</Text>
                  </Flex>
                )}
              </Box>
            </Flex>
          </>

        </Flex>
      </Box>
      </Reveal>

      {/* Box de la lista: la selección final, en orden. Apilado (móvil) queda
          bajo el pliegue: entra al llegar con el scroll. */}
      <Reveal inView once amount={0.15} direction="up" distance={34} scaleFrom={0.97} delay={0.1} duration={0.75}
              w="100%" flex={{ lg: "1" }} minW={0} display="flex">
      <Box
        position="relative"
        w="100%"
        h="100%"
        display="flex"
        flexDirection="column"
        borderRadius="2xl"
        overflow="hidden"
        border={azulBorde}
        boxShadow={glowPanel}
      >
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
        <Flex position="relative" zIndex={1} flex="1" direction="column" align="center"
              gap={{ base: 4, md: 5 }} px={{ base: 6, md: 8 }} py={{ base: 7, md: 9 }}>
          <Flex align="center" justify="center" gap={2.5}>
            {iconoLista}
            <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.04em" style={{ textShadow: INK_SHADOW }}>
              {tituloLista}
              {items.length > 0 && (
                <Box as="span" ml={2} fontSize={{ base: "sm", md: "md" }} fontWeight="600" opacity={0.7}>({items.length})</Box>
              )}
            </Text>
          </Flex>
          <Box h="1px" w="70%" maxW="340px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

          {/* Zona de la lista. En MÓVIL (apilados) crece EN VERTICAL cuan larga
              sea la lista: nada de altura fija con scroll interno, que escondía
              lo elegido. En dos columnas (lg) se estira hasta igualar al box de
              la izquierda y ahí sí scrollea por dentro si hace falta. */}
          <Box
            w="100%"
            maxW="620px"
            flex={{ lg: "1" }}
            h="auto"
            minH={{ base: "140px", lg: "200px" }}
            overflowY="auto"
            overflowX="hidden"
            sx={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": { background: `${TINTA}44`, borderRadius: "9999px" },
              scrollbarWidth: "thin",
              scrollbarColor: `${TINTA}44 transparent`,
            }}
          >
            {items.length > 0 ? (
              // Uno DEBAJO de otro, en el orden en que se eligieron, y todos
              // con el mismo ancho: una lista, no una nube.
              <Flex direction="column" align="stretch" gap={2.5} py={1} w="100%" maxW="460px" mx="auto">
                <AnimatePresence initial={false}>
                  {items.map((it) => (
                    <MotionFlex
                      key={it.id}
                      layout
                      align="center"
                      gap={2.5}
                      pl={4}
                      pr={2}
                      py={2}
                      w="100%"
                      borderRadius="full"
                      bg="rgba(255,251,243,0.6)"
                      border={`1px solid ${TINTA}66`}
                      boxShadow={`0 0 10px ${AZUL}26`}
                      initial={{ opacity: 0, x: -18, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 16, scale: 0.97 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      {iconoFila}
                      <Text flex="1" minW={0} color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.3"
                            noOfLines={1} style={{ textShadow: INK_SHADOW }}>
                        {it.texto}
                      </Text>
                      <Box
                        as="button"
                        onClick={() => onQuitar(it.id)}
                        w="22px"
                        h="22px"
                        borderRadius="full"
                        bg="rgba(94,45,16,0.1)"
                        color={TINTA}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xs"
                        cursor="pointer"
                        flexShrink={0}
                        transition="all 0.18s"
                        _hover={{ bg: "rgba(94,45,16,0.22)" }}
                        title={t("metodo.psico.quitar")}
                      >
                        ✕
                      </Box>
                    </MotionFlex>
                  ))}
                </AnimatePresence>
              </Flex>
            ) : (
              // `minH` en móvil: el contenedor va con alto auto, así que sin él
              // el texto del hueco vacío quedaría pegado al separador.
              <Flex h="100%" minH={{ base: "140px", lg: "0" }} align="center" justify="center">
                <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.7} textAlign="center" style={{ textShadow: INK_SHADOW }}>{vacioTexto}</Text>
              </Flex>
            )}
          </Box>

          <Text color={TINTA} fontSize="xs" opacity={0.55} fontStyle="italic" minH="1.2em">
            {guardando ? t("comun.guardando") : items.length > 0 ? seGuardanTexto : ""}
          </Text>
        </Flex>
      </Box>
      </Reveal>
    </Flex>
  );
}
