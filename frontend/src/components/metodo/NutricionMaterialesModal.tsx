import React, { useEffect, useState } from "react";
import { Box, Flex, Text, SimpleGrid, Image, Portal } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { FotoBox, glowSuave } from "./FotoBox";
import { AppleLoader } from "./AppleLoader";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";
import {
  ALIMENTOS, molsDeAlimento, FUNCIONES, GRUPO_MOLECULA_LABEL, ORDEN_GRUPOS_MOLECULA,
  MACRO_COLOR, MACRO_LABEL, type Alimento, type Molecula,
} from "../../hardCoded/espacio/AlimentosNutricion";

// ─────────────────────────────────────────────────────────────────────────
// «Los materiales de los alimentos». Se abre desde la Biblioteca (popup del
// alimento → «Los materiales…»). Muestra TODOS los alimentos juntos (sin
// pestañas de grupo). Al pulsar uno, su detalle sale como un box tipo cómic
// pero SIN la foto a la izquierda (solo el contenido, a todo el ancho).
//
// NOTA: diseño en construcción — la usuaria lo irá corrigiendo.
// ─────────────────────────────────────────────────────────────────────────

// Píldora de la función de una molécula (constructora / combustible / …).
function FuncionPill({ funcion }: { funcion: Molecula["funcion"] }) {
  const f = FUNCIONES[funcion];
  return (
    <Flex align="center" flexShrink={0} px={2} py={0.5} borderRadius="full" bg={f.color}
          boxShadow={`0 1px 6px ${f.color}77`}>
      <Text color="white" fontWeight={700} fontSize="3xs" letterSpacing="0.04em"
            textTransform="uppercase" lineHeight="1" whiteSpace="nowrap">
        {f.label}
      </Text>
    </Flex>
  );
}

// Barra apilada de macros («de qué está hecho»).
function BarraMacros({ macros }: { macros: Alimento["macros"] }) {
  const total = Math.max(1, macros.carbohidrato + macros.proteina + macros.grasa);
  const segs = (["carbohidrato", "proteina", "grasa"] as const)
    .map((k) => ({ k, pct: Math.round((macros[k] / total) * 100) }))
    .filter((s) => s.pct > 0);
  return (
    <Flex direction="column" gap={2.5} w="100%">
      <Flex w="100%" h={{ base: "16px", md: "18px" }} borderRadius="full" overflow="hidden"
            boxShadow={`inset 0 0 0 1px ${nutricionTxt}22`}>
        {segs.map((s) => (
          <Box key={s.k} w={`${s.pct}%`} h="100%" bg={MACRO_COLOR[s.k]} transition="width 0.4s ease" />
        ))}
      </Flex>
      <Flex wrap="wrap" gap={{ base: 3, md: 4 }} justify="center">
        {segs.map((s) => (
          <Flex key={s.k} align="center" gap={1.5}>
            <Box w="10px" h="10px" borderRadius="full" bg={MACRO_COLOR[s.k]} />
            <Text color={nutricionTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={600}>
              {MACRO_LABEL[s.k]} · {s.pct}%
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

// Badge del porcentaje (aprox.) de una molécula dentro del alimento.
function PctBadge({ pct }: { pct: number }) {
  return (
    <Flex align="center" flexShrink={0} px={2} py={0.5} borderRadius="full"
          bg={nutricionTxt} boxShadow={`0 1px 6px ${nutricionTxt}55`}>
      <Text color={nutricionBg} fontWeight={800} fontSize="2xs" lineHeight="1" whiteSpace="nowrap">
        {pct}%
      </Text>
    </Flex>
  );
}

// Ficha de una molécula dentro del alimento: foto + nombre + %/función + qué hace.
function MoleculaCard({ m, pct }: { m: Molecula; pct?: number }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <Flex w="100%" gap={{ base: 3, md: 4 }} align="flex-start" borderRadius="xl"
          bg={`${nutricionBg}e6`} border={`1px solid ${nutricionTxt}22`}
          p={{ base: 3, md: 3.5 }} boxShadow={glowSuave(nutricionTxt)}>
      {/* Foto de la molécula (o icono de marcador si aún no hay imagen) */}
      <Flex flexShrink={0} w={{ base: "58px", md: "68px" }} h={{ base: "58px", md: "68px" }}
            borderRadius="lg" overflow="hidden" bg={`${nutricionTxt}12`}
            border={`1px solid ${nutricionTxt}22`} align="center" justify="center">
        {m.foto && !imgErr ? (
          <Image src={encodeURI(m.foto)} alt={m.nombre} w="100%" h="100%" objectFit="cover"
                 loading="lazy" onError={() => setImgErr(true)} />
        ) : (
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="26px" h="26px" fill={`${nutricionTxt}66`}>
            <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
          </Box>
        )}
      </Flex>

      {/* Nombre + % + función + qué hace */}
      <Flex direction="column" gap={1.5} flex="1" minW={0}>
        <Flex align="center" gap={2} wrap="wrap">
          <Text color={nutricionTxt} fontWeight={800} fontSize={{ base: "sm", md: "md" }} lineHeight="1.2">
            {m.nombre}
          </Text>
          {pct != null && <PctBadge pct={pct} />}
          <FuncionPill funcion={m.funcion} />
        </Flex>
        <Text color={nutricionTxt} fontSize={{ base: "xs", md: "sm" }} lineHeight="1.55" fontWeight={500}>
          {m.queHace}
        </Text>
      </Flex>
    </Flex>
  );
}

// Detalle de UN alimento: foto + nombre + descripción + macros + fichas de sus
// moléculas (foto, %, función y qué hace).
function AlimentoDetalle({ a, onVolver }: { a: Alimento; onVolver: () => void }) {
  const mols = molsDeAlimento(a);
  const grupos = ORDEN_GRUPOS_MOLECULA
    .map((g) => ({ grupo: g, items: mols.filter((x) => x.m.grupo === g) }))
    .filter((s) => s.items.length > 0);

  return (
    <Flex direction="column" gap={5} w="100%" maxW="760px" mx="auto">
      <Box as="button" onClick={onVolver} alignSelf="flex-start" display="inline-flex" alignItems="center"
           gap={2} px={{ base: 4, md: 5 }} py={{ base: 2, md: 2.5 }} borderRadius="full"
           bg={`${nutricionBg}e6`} border={`1px solid ${nutricionTxt}55`} color={nutricionTxt}
           fontWeight={600} fontSize={{ base: "sm", md: "md" }} cursor="pointer"
           transition="all 0.18s" _hover={{ bg: nutricionBg, transform: "translateY(-1px)" }}>
        <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor">
          <path d="M480-160 160-480l320-320 56 57-223 223h487v80H313l224 224-57 56Z" />
        </Box>
        Todos los alimentos
      </Box>

      {/* Box tipo cómic SIN foto a la izquierda: solo el contenido, a todo el ancho. */}
      <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
           border={`1px solid ${nutricionTxt}2e`}
           boxShadow={glowSuave(nutricionTxt)}>
        <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}66`} />

        {/* Líneas de luz superior/inferior (guiño al box de cómic) */}
        <Box position="absolute" top="-1px" left="15%" right="15%" h="1px" zIndex={2}
             bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />
        <Box position="absolute" bottom="-1px" left="15%" right="15%" h="1px" zIndex={2}
             bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />

        <Flex position="relative" zIndex={1} direction="column" gap={4} px={{ base: 6, md: 9 }} py={{ base: 7, md: 9 }}>
          <Flex align="center" gap={4} wrap="wrap">
            {a.foto ? (
              <Box w={{ base: "64px", md: "80px" }} h={{ base: "64px", md: "80px" }} borderRadius="full"
                   overflow="hidden" flexShrink={0} border={`2px solid ${nutricionTxt}55`}
                   boxShadow={`0 4px 14px rgba(0,0,0,0.25)`}>
                <Image src={encodeURI(a.foto)} alt={a.nombre} w="100%" h="100%" objectFit="cover" />
              </Box>
            ) : (
              <Box fontSize={{ base: "44px", md: "56px" }} lineHeight="1">
                <span role="img" aria-label={a.nombre}>{a.emoji ?? a.nombre.charAt(0)}</span>
              </Box>
            )}
            <Flex direction="column" gap={1}>
              <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={800} lineHeight="1.1">
                {a.nombre}
              </Text>
              <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" fontWeight={600}>
                {a.resumen}
              </Text>
            </Flex>
          </Flex>

          {/* Descripción del alimento (algo más larga que el resumen). */}
          {(a.descripcion || a.resumen) && (
            <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">
              {a.descripcion ?? a.resumen}
            </Text>
          )}

          <Box>
            <Text color={`${nutricionTxt}aa`} fontSize="2xs" fontWeight={700} letterSpacing="0.14em"
                  textTransform="uppercase" mb={2.5}>
              De qué está hecho
            </Text>
            <BarraMacros macros={a.macros} />
          </Box>

          <Box h="1px" bgGradient={`linear(to-r, transparent, ${nutricionTxt}44, transparent)`} my={1} />

          <Text color={`${nutricionTxt}aa`} fontSize="2xs" fontWeight={700} letterSpacing="0.14em"
                textTransform="uppercase">
            Las moléculas que lo forman
          </Text>

          {grupos.map((s) => (
            <Box key={s.grupo}>
              <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} fontWeight={800} mb={2.5}>
                {GRUPO_MOLECULA_LABEL[s.grupo]}
              </Text>
              <Flex direction="column" gap={{ base: 2.5, md: 3 }}>
                {s.items.map(({ m, pct }) => <MoleculaCard key={m.key} m={m} pct={pct} />)}
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}

// Tarjeta de un alimento en la rejilla de «todos juntos». Box por defecto
// (FotoBox): su foto (de la Biblioteca) o el emoji de reserva, y el nombre abajo.
function AlimentoBox({ a, onClick }: { a: Alimento; onClick: () => void }) {
  return (
    <FotoBox
      titulo={a.nombre}
      foto={a.foto}
      nom={nutricionNom}
      tinta={nutricionTxt}
      bg={nutricionBg}
      emoji={a.emoji}
      onClick={onClick}
    />
  );
}

export function NutricionMaterialesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [sel, setSel] = useState<Alimento | null>(null);

  // No mostramos la rejilla hasta que TODAS las fotos de los alimentos estén
  // cargadas; mientras tanto, la manzanita de Nutrición (AppleLoader). Así la
  // cuadrícula aparece completa y no se va rellenando de fotos a trompicones.
  const fotosListas = usePrecargarImagenes(isOpen ? ALIMENTOS.map((a) => a.foto) : []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (sel) setSel(null); else onClose();
    };
    window.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
  }, [isOpen, onClose, sel]);

  // Al cerrar del todo, resetea el alimento seleccionado.
  useEffect(() => { if (!isOpen) setSel(null); }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Portal>
      {/* Portal a <body>: así el popup escapa de cualquier contexto de apilado y
          cubre SIEMPRE toda la pantalla (por encima del header sticky). */}
      <Box position="fixed" inset={0} w="100vw" h="100dvh" zIndex={2000} overflowY="auto"
           bg={nutricionBg} fontFamily="'EB Garamond', serif">
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="0" overlay={`${nutricionBg}e6`} />

      <Box position="relative" zIndex={1} minH="100%" px={{ base: 4, md: 10, lg: 16 }} py={{ base: 8, md: 12 }}>
        {/* Cerrar */}
        <Box as="button" onClick={onClose} position="fixed" top={{ base: 3, md: 5 }} right={{ base: 3, md: 5 }}
             zIndex={2} w="42px" h="42px" borderRadius="full" display="flex" alignItems="center"
             justifyContent="center" bg={`${nutricionTxt}18`} border={`1px solid ${nutricionTxt}44`}
             color={nutricionTxt} cursor="pointer" sx={{ backdropFilter: "blur(4px)" }}
             transition="all 0.18s" _hover={{ bg: `${nutricionTxt}2e` }}>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill="currentColor">
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </Box>
        </Box>

        {sel ? (
          <AlimentoDetalle a={sel} onVolver={() => setSel(null)} />
        ) : !fotosListas ? (
          // Página aún cargando las fotos de los alimentos: solo la manzanita.
          <Flex minH="70vh" align="center" justify="center" w="100%">
            <AppleLoader />
          </Flex>
        ) : (
          <Flex direction="column" align="center" w="100%" maxW="1100px" mx="auto" gap={{ base: 6, md: 8 }}>
            <Flex direction="column" align="center" gap={2} textAlign="center">
              <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "4xl" }} fontWeight={800}
                    letterSpacing="0.04em" lineHeight="1.1">
                Los materiales de los alimentos
              </Text>
              <Text color={`${nutricionTxt}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" maxW="560px">
                Elige un alimento y descubre de qué moléculas está hecho.
              </Text>
            </Flex>

            <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={{ base: 4, md: 5 }} w="100%">
              {ALIMENTOS.map((a) => (
                <AlimentoBox key={a.key} a={a} onClick={() => { setSel(a); window.scrollTo({ top: 0 }); }} />
              ))}
            </SimpleGrid>
          </Flex>
        )}
      </Box>
      </Box>
    </Portal>
  );
}
