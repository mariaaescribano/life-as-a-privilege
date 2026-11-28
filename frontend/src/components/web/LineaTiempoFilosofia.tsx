import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import { MandalaTinte } from "../global/MandalaTinte";
import { FILOSOFOS_LINEA, type Filosofo } from "../../data/filosofosLineaTiempo";
import { useIdioma, useT } from "../../i18n";

/**
 * Línea del tiempo de los grandes pensadores: una línea fina que cruza la página, y en cada punto un arco con la
 * foto arriba y el nombre (y los años) debajo. El último es «Tú · Hoy»: el arco vacío, para que la persona se vea
 * como la continuación de esa historia. En escritorio cabe entera; en móvil se desliza hacia los lados.
 * `color` = la tinta del texto y de los filos.
 */
const EASE = "cubic-bezier(0.22,1,0.36,1)";
const W_ARCO = { base: "92px", md: "104px" };
const H_ARCO = { base: "120px", md: "136px" };
const FORMA_ARCO = "16px";

const Arco = ({ f, color, nombre }: { f: Filosofo; color: string; nombre: string }) => {
  const [falla, setFalla] = useState(false);
  return (
    <Box position="relative" w={W_ARCO} h={H_ARCO} overflow="hidden" borderRadius={FORMA_ARCO} border={`1.5px solid ${color}`} bg={`${color}12`} role="group">
      {!falla ? (
        <Image
          src={f.foto}
          alt={nombre}
          w="100%"
          h="100%"
          objectFit="cover"
          loading="lazy"
          onError={() => setFalla(true)}
          transition={`transform 1.2s ${EASE}`}
          _groupHover={{ transform: "scale(1.08)" }}
        />
      ) : (
        <Flex w="100%" h="100%" align="center" justify="center">
          <MandalaTinte h="34px" color={color} style={{ opacity: 0.55 }} />
        </Flex>
      )}
    </Box>
  );
};

/** Un punto de la línea: el trozo de raya a cada lado y el punto en medio. */
const Punto = ({ color, primero, ultimo, retraso }: { color: string; primero: boolean; ultimo: boolean; retraso: number }) => (
  <Box position="relative" w="100%" h="14px" mt={4} mb={3}>
    {!primero && <Box position="absolute" left={0} top="50%" w="50%" h="1.5px" bg={`${color}99`} />}
    {!ultimo && <Box position="absolute" right={0} top="50%" w="50%" h="1.5px" bg={`${color}99`} />}
    <Box
      position="absolute"
      left="50%"
      top="50%"
      w="11px"
      h="11px"
      borderRadius="full"
      bg={color}
      sx={{
        transform: "translate(-50%, -50%)",
        "@keyframes puntoLinea": { from: { transform: "translate(-50%,-50%) scale(0)" }, to: { transform: "translate(-50%,-50%) scale(1)" } },
        animation: `puntoLinea 0.6s ${EASE} ${retraso}s both`,
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    />
  </Box>
);

const LineaTiempoFilosofia = ({ color }: { color: string }) => {
  const t = useT();
  const { idioma } = useIdioma();
  const n = FILOSOFOS_LINEA.length;

  return (
    <Box w="100%" fontFamily="'EB Garamond', serif" color={color}>
      <Box overflowX="auto" px={{ base: 5, md: 8 }} pb={3} sx={{ scrollSnapType: "x proximity", scrollbarWidth: "thin", scrollbarColor: `${color}66 transparent` }}>
        <Flex maxW="1280px" mx="auto" minW="max-content" w={{ md: "100%" }} justify="space-between">
          {FILOSOFOS_LINEA.map((f, i) => {
            const nombre = idioma === "en" ? (f.nombreEn ?? f.nombre) : f.nombre;
            return (
              <Reveal key={f.nombre} inView once amount={0.2} direction="up" distance={26} scaleFrom={0.96} blur duration={0.9} delay={i * 0.12} flex={{ md: 1 }}>
                <Flex direction="column" align="center" textAlign="center" w="100%" minW="128px" sx={{ scrollSnapAlign: "center" }}>
                  <Arco f={f} color={color} nombre={nombre} />
                  <Punto color={color} primero={i === 0} ultimo={false} retraso={0.3 + i * 0.12} />
                  <Text fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em" lineHeight="1.2">{nombre}</Text>
                  <Text fontSize="sm" fontStyle="italic" opacity={0.75} mt={1}>{f.anos[idioma === "en" ? "en" : "es"]}</Text>
                </Flex>
              </Reveal>
            );
          })}

          {/* La última: el arco en blanco, «Tú» y, debajo, «Hoy». */}
          <Reveal inView once amount={0.2} direction="up" distance={26} scaleFrom={0.96} blur duration={0.9} delay={n * 0.12} flex={{ md: 1 }}>
            <Flex direction="column" align="center" textAlign="center" w="100%" minW="128px" sx={{ scrollSnapAlign: "center" }}>
              <Box
                w={W_ARCO}
                h={H_ARCO}
                borderRadius={FORMA_ARCO}
                border={`1.5px dashed ${color}`}
                bg={`${color}08`}
                sx={{
                  "@keyframes tuRespira": { "0%,100%": { opacity: 0.75 }, "50%": { opacity: 1 } },
                  animation: "tuRespira 3.2s ease-in-out 1.5s infinite",
                  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                }}
              />
              <Punto color={color} primero={false} ultimo retraso={0.3 + n * 0.12} />
              <Text fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em" lineHeight="1.2">{t("filoLinea.tu")}</Text>
              <Text fontSize="sm" fontStyle="italic" opacity={0.75} mt={1}>{t("filoLinea.hoy")}</Text>
            </Flex>
          </Reveal>
        </Flex>
      </Box>
    </Box>
  );
};

export default LineaTiempoFilosofia;
