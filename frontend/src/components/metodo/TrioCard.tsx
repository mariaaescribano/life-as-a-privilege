import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ZODIAC_SIGNS, type Cuerpo } from "./astrologiaData";
import { useNombresAstro } from "./astrologiaNombres";
import { Glifo, GlifoSigno } from "./Glifo";
import { Float } from "../global/Reveal";
import { useT } from "../../i18n";
void React;

const CheckIcon = ({ color }: { color: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="15px" h="15px" fill={color} flexShrink={0}>
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </Box>
);

/* ── Tarjeta de un cuerpo del trío (portada de /solascendenteluna, ya fusionada aquí) ── */
export function TrioCard({
  cuerpo,
  signo,
  casa,
  destacado,
  leido,
  onLeer,
}: {
  cuerpo: Cuerpo;
  signo?: string;
  casa?: number;
  destacado?: boolean;
  leido: boolean;
  onLeer: () => void;
}) {
  const t = useT();
  const n = useNombresAstro();
  const c = cuerpo.color;
  const signoData = signo ? ZODIAC_SIGNS.find((s) => s.name === signo) : null;
  return (
    <Flex
      direction="column"
      align="center"
      gap={3}
      w={{ base: "100%", md: destacado ? "230px" : "200px" }}
      maxW={{ base: "280px", md: "none" }}
      transform={{ md: destacado ? "translateY(-14px)" : "none" }}
      px={5}
      py={{ base: 6, md: 7 }}
      borderRadius="2xl"
      bg="rgba(8,13,30,0.45)"
      border={`1px solid ${c}${destacado ? "66" : "33"}`}
      boxShadow={destacado ? `0 0 26px ${c}44, 0 0 60px ${c}22` : `0 0 16px ${c}22`}
      position="relative"
    >
      {/* Halo que respira alrededor de la tarjeta (capa aparte: no pisa el
          hover ni el transform de la tarjeta). */}
      <Box aria-hidden position="absolute" inset="-1px" borderRadius="2xl" pointerEvents="none"
           boxShadow={`0 0 30px 4px ${c}`}
           sx={{
             opacity: 0.08,
             [`@keyframes trioHalo${destacado ? "D" : "N"}`]: { "0%, 100%": { opacity: 0.06 }, "50%": { opacity: destacado ? 0.42 : 0.3 } },
             animation: `trioHalo${destacado ? "D" : "N"} ${destacado ? 4.4 : 5.4}s ease-in-out ${destacado ? 0.8 : 1.6}s infinite`,
             "@media (prefers-reduced-motion: reduce)": { animation: "none" },
           }} />
      {/* icono: flota con fase propia */}
      <Float amplitude={destacado ? 5 : 4} duration={destacado ? 5.2 : 6} delay={destacado ? 0 : 1.1}>
        <Box style={{ filter: `drop-shadow(0 0 6px ${c}55)` }}>
          <Glifo symbol={cuerpo.symbol} color={c} size={destacado ? 64 : 52} />
        </Box>
      </Float>
      <Text color={c} fontSize={{ base: "lg", md: destacado ? "2xl" : "xl" }} fontWeight="700" letterSpacing="0.04em"
            style={{ textShadow: `0 0 12px ${c}66` }}>
        {n.cuerpo(cuerpo.key)}
      </Text>

      {/* signo · casa */}
      <Flex align="center" gap={2} minH="28px">
        {signoData ? (
          <>
            <GlifoSigno nombre={signoData.name} color={c} size={24} />
            <Text color={`${c}dd`} fontSize={{ base: "sm", md: "md" }}>
              {n.signo(signoData.name)}{casa != null ? ` · ${n.casa(casa)}` : ""}
            </Text>
          </>
        ) : (
          <Text color={`${c}99`} fontSize="sm" fontStyle="italic">—</Text>
        )}
      </Flex>

      {/* botón leer: si aún no se ha leído, un anillo late invitando a pulsarlo */}
      <Box position="relative" mt={1} display="inline-flex">
      {!leido && (
        <Box aria-hidden position="absolute" inset="0" borderRadius="full" pointerEvents="none"
             border={`1.5px solid ${c}`}
             sx={{
               "@keyframes leerOnda": { "0%": { transform: "scale(1)", opacity: 0.55 }, "70%, 100%": { transform: "scale(1.35, 1.7)", opacity: 0 } },
               animation: "leerOnda 3s ease-out 1.5s infinite",
               "@media (prefers-reduced-motion: reduce)": { animation: "none" },
             }} />
      )}
      <Box
        as="button"
        onClick={onLeer}
        px={6}
        py={2}
        borderRadius="full"
        bg={leido ? `${c}22` : c}
        color={leido ? c : "#0a0a1a"}
        border={`1px solid ${c}88`}
        fontFamily="'EB Garamond', serif"
        fontSize={{ base: "sm", md: "md" }}
        fontWeight="700"
        letterSpacing="0.06em"
        cursor="pointer"
        transition="all 0.18s"
        display="inline-flex"
        alignItems="center"
        gap={1.5}
        whiteSpace="nowrap"
        _hover={{ boxShadow: `0 0 18px ${c}88`, transform: "translateY(-1px)" }}
      >
        {leido ? <><CheckIcon color={c} /> {t("metodo.astro.releer")}</> : t("metodo.astro.leer")}
      </Box>
      </Box>
    </Flex>
  );
}
