import React, { useEffect, useState } from "react";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";
import type { NutrienteTarjeta } from "../../hardCoded/espacio/NutrientesNutricion";

// ─────────────────────────────────────────────────────────────────────────
// Ficha tipo cómic de una tarjeta de nutriente (Glucosa, Fructosa…). Mismo
// patrón que la ficha de Fisiología (pinchas una tarjeta y se abre): foto a la
// izquierda, título + texto a la derecha, navegable con flechas/teclado. Pero
// con la estética CLARA de Nutrición (fondo nutri.png, texto verde oscuro).
// ─────────────────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

function FotoPlaceholder() {
  return (
    <Flex position="absolute" inset={0} align="center" justify="center" direction="column" gap={2}
          bg={`${nutricionTxt}10`}>
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w={{ base: "40px", md: "48px" }} h={{ base: "40px", md: "48px" }} fill={`${nutricionTxt}66`}>
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
      </Box>
      <Text color={`${nutricionTxt}88`} fontSize="2xs" fontWeight="700" letterSpacing="0.14em"
            textTransform="uppercase">
        Próximamente
      </Text>
    </Flex>
  );
}

export function NutrienteFichaModal({
  tarjetas,
  index,
  onClose,
  onSelect,
}: {
  tarjetas: NutrienteTarjeta[];
  index: number;
  onClose: () => void;
  onSelect: (i: number) => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  const total = tarjetas.length;
  const t = tarjetas[index];
  const puedeNavegar = total > 1;
  const salta = (d: number) => onSelect((index + d + total) % total);

  useEffect(() => { setImgErr(false); }, [index]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") salta(-1);
      else if (e.key === "ArrowRight") salta(1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  const flechaSx = {
    position: "fixed" as const,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    variant: "ghost" as const,
    borderRadius: "full",
    w: { base: "40px", md: "60px" },
    h: { base: "40px", md: "60px" },
    minW: { base: "40px", md: "60px" },
    bg: `${nutricionBg}e6`,
    border: `1px solid ${nutricionTxt}66`,
    boxShadow: "0 2px 14px rgba(0,0,0,0.35)",
    sx: { backdropFilter: "blur(4px)" },
    _hover: { bg: nutricionBg, borderColor: nutricionTxt },
    _focus: { boxShadow: "0 2px 14px rgba(0,0,0,0.35)" },
    _focusVisible: { boxShadow: "0 2px 14px rgba(0,0,0,0.35)" },
  };

  const chevron = (dir: "prev" | "next") => (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
         w={{ base: "24px", md: "32px" }} h={{ base: "24px", md: "32px" }} fill={nutricionTxt}
         transform={dir === "prev" ? undefined : "scaleX(-1)"}>
      <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
    </Box>
  );

  return (
    <Box position="fixed" inset={0} zIndex={1100} display="flex" alignItems="center" justifyContent="center"
         px={{ base: 4, md: 20 }} py={{ base: 12, md: 14 }} onClick={onClose}>
      {/* Backdrop oscuro difuminado para enfocar la ficha clara. */}
      <Box position="fixed" inset={0} pointerEvents="none" zIndex={0}
           bg="rgba(0,0,0,0.7)" sx={{ backdropFilter: "blur(10px)" }} />

      {/* X cerrar */}
      <IconButton aria-label="Cerrar" onClick={(e) => { e.stopPropagation(); onClose(); }}
        position="fixed" top={{ base: 3, md: 5 }} right={{ base: 3, md: 5 }} zIndex={10} variant="ghost"
        borderRadius="full" w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }}
        minW={{ base: "42px", md: "48px" }} bg={`${nutricionBg}e6`} border={`1px solid ${nutricionTxt}66`}
        boxShadow="0 2px 12px rgba(0,0,0,0.35)" sx={{ backdropFilter: "blur(4px)" }}
        _hover={{ bg: nutricionBg, borderColor: nutricionTxt }}
        icon={
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill={nutricionTxt}>
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </Box>
        } />

      {/* Flechas */}
      {puedeNavegar && (
        <>
          <IconButton aria-label="Anterior" onClick={(e) => { e.stopPropagation(); salta(-1); }}
            left={{ base: 1, md: 6 }} {...flechaSx} icon={chevron("prev")} />
          <IconButton aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); salta(1); }}
            right={{ base: 1, md: 6 }} {...flechaSx} icon={chevron("next")} />
        </>
      )}

      {/* Caja: foto (izq) + título/texto (der) sobre el fondo de Nutrición. */}
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} w="100%"
           maxW={{ base: "360px", md: "900px" }} h={{ base: "auto", md: "500px" }}
           maxH={{ base: "calc(100dvh - 96px)", md: "500px" }} display="flex" flexDirection="column"
           position="relative" borderRadius="xl" overflow="hidden" animation={`${fadeIn} 0.5s ease both`}
           border={`1px solid ${nutricionTxt}2e`}
           boxShadow={`0 0 30px rgba(0,0,0,0.5), 0 0 18px ${nutricionTxt}22`}>
        <DisciplinaBgLayer nom={nutricionNom} borderRadius="xl" overlay={`${nutricionBg}dd`} />

        {/* Línea de luz superior */}
        <Box position="absolute" top="-1px" left="15%" right="15%" h="1px" zIndex={3}
             bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />

        <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "stretch" }}
              justify="center" gap={{ base: 5, md: 10 }} position="relative" zIndex={2} flex="1" minH={0}
              overflowY={{ base: "auto", md: "hidden" }} overflowX="hidden"
              px={{ base: 5, md: 10 }} py={{ base: 9, md: 10 }}>

          {/* Foto 1:1 */}
          <Box w={{ base: "80%", md: "340px" }} maxW={{ base: "260px", md: "340px" }} aspectRatio={1}
               flexShrink={0} alignSelf="center" position="relative" borderRadius="lg" overflow="hidden"
               bg={`${nutricionTxt}10`}
               sx={{ filter: `drop-shadow(0 0 12px rgba(255,255,255,0.2)) drop-shadow(0 0 30px ${nutricionTxt}22)` }}>
            {!imgErr && t.foto ? (
              <Box as="img" src={encodeURI(t.foto)} alt={t.titulo} w="100%" h="100%"
                   style={{ objectFit: "cover" }} onError={() => setImgErr(true)} />
            ) : (
              <FotoPlaceholder />
            )}
          </Box>

          {/* Separador */}
          <Box flexShrink={0} alignSelf="center" w={{ base: "52px", md: "1px" }} h={{ base: "1px", md: "150px" }}
               borderRadius="full"
               bgGradient={{
                 base: `linear(to-r, transparent, ${nutricionTxt}aa, transparent)`,
                 md: `linear(to-b, transparent, ${nutricionTxt}aa, transparent)`,
               }} />

          {/* Título + texto */}
          <Box flex="1" minW={0} w={{ base: "100%", md: "auto" }} alignSelf={{ base: "auto", md: "stretch" }}
               maxH={{ base: "none", md: "100%" }} overflowY={{ base: "visible", md: "auto" }} overflowX="hidden"
               display="flex" flexDirection="column" pt={{ base: 0, md: 1 }} pb={{ base: 0, md: 6 }} pr={{ base: 0, md: 4 }}
               sx={{
                 "&::-webkit-scrollbar": { width: "6px" },
                 "&::-webkit-scrollbar-thumb": { background: `${nutricionTxt}44`, borderRadius: "3px" },
               }}>
            <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700}
                  fontFamily="'EB Garamond', serif" letterSpacing="0.02em" lineHeight="1.2"
                  mb={{ base: 4, md: 5 }} textAlign={{ base: "center", md: "left" }}>
              {t.titulo}
            </Text>
            <Flex direction="column" gap={4}>
              {t.parrafos.map((p, i) => (
                <Text key={i} color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85"
                      letterSpacing="0.02em" fontFamily="'EB Garamond', serif" textAlign={{ base: "center", md: "left" }}>
                  {p}
                </Text>
              ))}
            </Flex>
          </Box>
        </Flex>

        {/* Línea de luz inferior */}
        <Box position="absolute" bottom="-1px" left="15%" right="15%" h="1px" zIndex={3}
             bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />

        {/* Contador */}
        {puedeNavegar && (
          <Text position="absolute" bottom={{ base: 2, md: 3 }} right={{ base: 3, md: 4 }} zIndex={3}
                color={`${nutricionTxt}99`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                letterSpacing="0.18em" pointerEvents="none">
            {index + 1} / {total}
          </Text>
        )}
      </Box>
    </Box>
  );
}
