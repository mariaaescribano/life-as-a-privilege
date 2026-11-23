import React, { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { CajaTextoScroll } from "../../components/metodo/CajaTextoScroll";
import { AREAS_TEXTO, AREAS_TOTAL, rutaArea } from "../../components/metodo/astrologiaAreas";
import { Reveal } from "../../components/global/Reveal";
import { astrologiaBg, astrologiaTxt, AstrologiaIcon, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { useIdioma } from "../../i18n";

/**
 * Una ÁREA del camino de Astrología (ÁREA 1 … ÁREA 12, una por casa). De arriba abajo: la cabecera de la
 * disciplina, la barra de progreso (n de 12), una raya y la caja de texto con scroll vertical.
 * Progreso y rayas, SIEMPRE en turquesa oscuro. El texto de cada área se escribe en `astrologiaAreas.ts`.
 */
export default function MetodoAstrologiaArea() {
  const { t, segunIdioma } = useIdioma();
  const navigate = useNavigate();
  const { n: nParam } = useParams<{ n: string }>();
  const n = Number(nParam);
  const valida = Number.isInteger(n) && n >= 1 && n <= AREAS_TOTAL;

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [n]);
  if (!valida) return <Navigate to={rutaArea(1)} replace />;

  const texto = AREAS_TEXTO[n] ? segunIdioma({ es: AREAS_TEXTO[n].es, en: AREAS_TEXTO[n].en }) : "";
  const pct = Math.round((n / AREAS_TOTAL) * 100);
  const titulo = t("metodo.astro.area.titulo", { n: String(n) });

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 20, md: 28 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={{ base: 6, md: 8 }}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={titulo}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              mb={0}
              prev={n > 1 ? { label: `← ${t("metodo.astro.area.titulo", { n: String(n - 1) })}`, onClick: () => navigate(rutaArea(n - 1)) } : undefined}
              next={n < AREAS_TOTAL ? { label: `${t("metodo.astro.area.titulo", { n: String(n + 1) })} →`, onClick: () => navigate(rutaArea(n + 1)) } : undefined}
            />
          </Reveal>

          {/* La barra de progreso: turquesa oscuro, sin brillo. */}
          <Reveal direction="up" distance={12} duration={0.6} delay={0.2} w="100%" display="flex" justifyContent="center">
            <Flex align="center" gap={4} w={{ base: "86%", md: "460px" }} maxW="100%">
              <Box
                role="progressbar" aria-label={titulo} aria-valuemin={0} aria-valuemax={AREAS_TOTAL} aria-valuenow={n}
                flex="1" h="8px" borderRadius="full" bg={`${T}33`} overflow="hidden"
              >
                <Box h="100%" w={`${pct}%`} borderRadius="full" bg={T} transition="width 0.9s cubic-bezier(0.22,1,0.36,1)" />
              </Box>
              <Text color={T} fontSize={{ base: "md", md: "lg" }} fontWeight="700" minW="3.4em" textAlign="right" lineHeight="1"
                    sx={{ fontVariantNumeric: "tabular-nums" }}>
                {n}/{AREAS_TOTAL}
              </Text>
            </Flex>
          </Reveal>

          {/* La raya: turquesa oscuro. */}
          <Box w="100%" h="1px" bgGradient={`linear(to-r, ${T}00, ${T}99, ${T}00)`} />

          {/* La caja de texto inicial, con scroll vertical. */}
          <Reveal direction="up" distance={18} duration={0.8} delay={0.35} w="100%">
            <CajaTextoScroll>
              {texto.trim()
                ? texto.split(/\n\s*\n/).map((p, i) => <Text key={i} mb={i < texto.split(/\n\s*\n/).length - 1 ? 4 : 0}>{p}</Text>)
                : <Text fontStyle="italic" opacity={0.75}>{t("metodo.astro.area.pendiente")}</Text>}
            </CajaTextoScroll>
          </Reveal>
        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
