import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { FotoBox } from "../../components/metodo/FotoBox";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { seccionesAstro, type SeccionAstro } from "../../components/metodo/astrologiaIntroData";
import { Reveal } from "../../components/global/Reveal";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { esMariaMirando } from "../../api/persona";
import { astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";
import { useIdioma, useT } from "../../i18n";
import type { ClaveTexto } from "../../i18n";

// Tres tarjetas por fila en escritorio (los signos y las casas, doce: cuatro filas
// de tres); en móvil, una debajo de otra. Flex con `wrap` y no una rejilla, para
// que una última fila corta (los planetas son catorce) quede CENTRADA.
const HUECO = 24;
const ANCHO_TARJETA = { base: "100%", md: `calc((100% - ${HUECO * 2}px) / 3)` };

/**
 * Paso 3 del recorrido de Astrología: la Introducción que lo explica todo. Una
 * frase arriba y debajo cuatro secciones —Signos, Casas, Planetas, Aspectos— de
 * tarjetas: foto, nombre y una frase breve. Pulsar una abre su cómic justo en esa
 * tarjeta, para quien quiera profundizar. Las frases salen de los propios cómics.
 */
export default function MetodoAstrologiaExplicacion() {
  const t = useT();
  useIdioma();
  const navigate = useNavigate();
  const secciones = useMemo(() => seccionesAstro(), []);
  const [abierto, setAbierto] = useState<{ sec: SeccionAstro; i: number } | null>(null);
  const { bloqueada, cargado } = useAstrologiaProgreso();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  // «Siguiente» cerrado hasta que María abra el paso 4 (ella entra siempre).
  const siguienteCerrado = !esMariaMirando() && cargado && bloqueada(4);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="1020px" gap={{ base: 8, md: 12 }}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%" maxW="850px">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={t("metodo.astro.paso.explicacion")}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 3, total: 12 }}
              mb={0}
              prev={{ label: `← ${t("metodo.astro.paso.historia")}`, onClick: () => navigate("/metodo/astrologia/historia") }}
              next={{
                label: `${t("metodo.astro.paso.trio")} →`,
                onClick: () => navigate("/metodo/astrologia/trio"),
                disabled: siguienteCerrado,
              }}
            />
          </Reveal>

          {/* Fuera de las cajas: blanco y sin sombra. */}
          <Reveal direction="up" distance={18} delay={0.15} duration={0.7} w="100%" maxW="680px">
            <Text color="white" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8" textAlign="center" fontStyle="italic">
              {t("metodo.astro.explica.intro")}
            </Text>
          </Reveal>

          {secciones.map((sec) => (
            <Flex key={sec.clave} direction="column" align="center" w="100%" gap={{ base: 6, md: 8 }}>
              <Reveal inView direction="up" distance={14} w="100%">
                <Flex align="center" gap={4} w="100%">
                  <Box flex="1" h="1px" bg="rgba(255,255,255,0.4)" />
                  <Text color="white" fontSize={{ base: "lg", md: "2xl" }} fontWeight="700" letterSpacing="0.16em"
                        textTransform="uppercase" textAlign="center">
                    {t(`metodo.astro.explica.${sec.clave}` as ClaveTexto)}
                  </Text>
                  <Box flex="1" h="1px" bg="rgba(255,255,255,0.4)" />
                </Flex>
              </Reveal>

              <Flex wrap="wrap" justify="center" gap={`${HUECO}px`} w="100%">
                {sec.tarjetas.map((c, i) => (
                  <Reveal key={c.clave} inView amount={0.15} direction="up" distance={26} scaleFrom={0.95}
                          delay={(i % 3) * 0.08} duration={0.6} w={ANCHO_TARJETA} flexShrink={0}>
                    <Box h="100%">
                      <FotoBox
                        titulo={String(c.titulo).toLocaleUpperCase()}
                        descripcion={c.frase}
                        foto={c.foto}
                        nom={astrologiaNom}
                        tinta={astrologiaTxt}
                        bg={astrologiaBg}
                        aspect={1}
                        onClick={() => setAbierto({ sec, i })}
                        vivo
                      />
                    </Box>
                  </Reveal>
                ))}
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Pulsar una tarjeta abre el cómic de su sección, ya en esa tarjeta. */}
      <IntroComicModal
        isOpen={!!abierto}
        vinetas={abierto?.sec.vinetas ?? []}
        initialIndex={abierto?.i ?? 0}
        onClose={() => setAbierto(null)}
        onComplete={() => setAbierto(null)}
      />

      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
