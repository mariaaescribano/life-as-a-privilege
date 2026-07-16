import React, { useEffect, useState } from "react";
import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";
import {
  ALIMENTOS, MOLECULAS, FUNCIONES, GRUPO_MOLECULA_LABEL, ORDEN_GRUPOS_MOLECULA,
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

// Tarjeta de molécula que despliega su explicación al pulsarla (acordeón).
function MoleculaFila({ m }: { m: Molecula }) {
  const [abierta, setAbierta] = useState(false);
  return (
    <Box as="button" onClick={() => setAbierta((v) => !v)} textAlign="left" w="100%" borderRadius="xl"
         bg={`${nutricionBg}e6`} border={`1px solid ${nutricionTxt}22`}
         px={{ base: 3.5, md: 4 }} py={{ base: 3, md: 3.5 }}
         boxShadow="0 2px 10px rgba(0,0,0,0.12)" cursor="pointer" transition="all 0.18s"
         _hover={{ borderColor: `${nutricionTxt}55` }}>
      <Flex align="center" justify="space-between" gap={3}>
        <Text color={nutricionTxt} fontWeight={700} fontSize={{ base: "sm", md: "md" }} lineHeight="1.2">
          {m.nombre}
        </Text>
        <FuncionPill funcion={m.funcion} />
      </Flex>
      {abierta && (
        <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" fontWeight={500} mt={2.5}>
          {m.queHace}
        </Text>
      )}
    </Box>
  );
}

// Detalle de UN alimento en formato «box de cómic sin foto a la izquierda».
function AlimentoDetalle({ a, onVolver }: { a: Alimento; onVolver: () => void }) {
  const mols = a.moleculas.map((k) => MOLECULAS[k]).filter(Boolean) as Molecula[];
  const grupos = ORDEN_GRUPOS_MOLECULA
    .map((g) => ({ grupo: g, items: mols.filter((m) => m.grupo === g) }))
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
           boxShadow={`0 8px 30px rgba(0,0,0,0.3), 0 0 18px ${nutricionTxt}22`}>
        <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}66`} />

        {/* Líneas de luz superior/inferior (guiño al box de cómic) */}
        <Box position="absolute" top="-1px" left="15%" right="15%" h="1px" zIndex={2}
             bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />
        <Box position="absolute" bottom="-1px" left="15%" right="15%" h="1px" zIndex={2}
             bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />

        <Flex position="relative" zIndex={1} direction="column" gap={4} px={{ base: 6, md: 9 }} py={{ base: 7, md: 9 }}>
          <Flex align="center" gap={4} wrap="wrap">
            <Box fontSize={{ base: "44px", md: "56px" }} lineHeight="1">
              <span role="img" aria-label={a.nombre}>{a.emoji ?? a.nombre.charAt(0)}</span>
            </Box>
            <Flex direction="column" gap={1}>
              <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={800} lineHeight="1.1">
                {a.nombre}
              </Text>
              <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" fontWeight={600}>
                {a.resumen}
              </Text>
            </Flex>
          </Flex>

          <Box>
            <Text color={`${nutricionTxt}aa`} fontSize="2xs" fontWeight={700} letterSpacing="0.14em"
                  textTransform="uppercase" mb={2.5}>
              De qué está hecho
            </Text>
            <BarraMacros macros={a.macros} />
          </Box>

          <Box h="1px" bgGradient={`linear(to-r, transparent, ${nutricionTxt}44, transparent)`} my={1} />

          <Text color={`${nutricionTxt}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center">
            Toca cada molécula para ver qué hace dentro de ti.
          </Text>

          {grupos.map((s) => (
            <Box key={s.grupo}>
              <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} fontWeight={800} mb={2.5}>
                {GRUPO_MOLECULA_LABEL[s.grupo]}
              </Text>
              <Flex direction="column" gap={{ base: 2.5, md: 3 }}>
                {s.items.map((m) => <MoleculaFila key={m.key} m={m} />)}
              </Flex>
            </Box>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}

// Tarjeta de un alimento en la rejilla de «todos juntos».
function AlimentoBox({ a, onClick }: { a: Alimento; onClick: () => void }) {
  return (
    <Box as="button" onClick={onClick} position="relative" overflow="hidden" w="100%" h="100%"
         borderRadius="2xl" cursor="pointer" fontFamily="'EB Garamond', serif" transition="all 0.2s ease"
         boxShadow="0 4px 16px rgba(0,0,0,0.22), 0 0 14px rgba(255,255,255,0.12)"
         _hover={{ transform: "translateY(-4px)", boxShadow: "0 10px 30px rgba(0,0,0,0.32), 0 0 22px rgba(255,255,255,0.35)" }}
         _active={{ transform: "translateY(-1px)" }}>
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}55`} />
      <Flex position="relative" zIndex={1} direction="column" align="center" gap={{ base: 2, md: 2.5 }}
            p={{ base: 4, md: 5 }} h="100%">
        <Flex w="100%" aspectRatio={1} borderRadius="xl" overflow="hidden" flexShrink={0}
              bg={`${nutricionTxt}12`} align="center" justify="center"
              fontSize={{ base: "44px", md: "56px" }} lineHeight="1">
          <span role="img" aria-label={a.nombre}>{a.emoji ?? a.nombre.charAt(0)}</span>
        </Flex>
        <Text color={nutricionTxt} fontWeight={700} lineHeight="1.2" textAlign="center"
              fontSize={{ base: "sm", md: "md" }} letterSpacing="0.02em">
          {a.nombre}
        </Text>
      </Flex>
    </Box>
  );
}

export function NutricionMaterialesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [sel, setSel] = useState<Alimento | null>(null);

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
    <Box position="fixed" inset={0} zIndex={1300} overflowY="auto" fontFamily="'EB Garamond', serif">
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
  );
}
