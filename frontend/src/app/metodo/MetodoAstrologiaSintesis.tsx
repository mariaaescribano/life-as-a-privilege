import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { CajaDeMaria } from "../../components/metodo/CajaDeMaria";
import { Reveal } from "../../components/global/Reveal";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { esMariaMirando } from "../../api/persona";
import { astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";
import { useT } from "../../i18n";

/** La clave de la nota de esta página: una ruta que no existe (no choca con la pestaña lateral). */
const CLAVE_CAJA = "/metodo/astrologia/sintesis/caja";

/**
 * Paso 11 del recorrido de Astrología: la Síntesis. Debajo del header, una frase
 * para la persona y, debajo, una caja con la foto de Astrología donde escribe
 * María (desde su camino) lo que no debe olvidar de su carta. La persona solo ve
 * lo que María publica.
 */
export default function MetodoAstrologiaSintesis() {
  const t = useT();
  const navigate = useNavigate();
  const { bloqueada, cargado } = useAstrologiaProgreso();
  const nombre = (() => {
    try { return (localStorage.getItem("name") ?? "").trim().split(/\s+/)[0] ?? ""; } catch { return ""; }
  })();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={{ base: 7, md: 9 }}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={t("metodo.astro.paso.sintesis")}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 11, total: 12 }}
              mb={0}
              prev={{ label: `← ${t("metodo.astro.paso.apuntes")}`, onClick: () => navigate("/metodo/astrologia/apuntes") }}
              next={{
                label: `${t("metodo.astro.paso.cursos")} →`,
                onClick: () => navigate("/metodo/astrologia/cursos"),
                disabled: !esMariaMirando() && cargado && bloqueada(12),
              }}
            />
          </Reveal>

          {/* Fuera de las cajas: blanco y sin sombra. */}
          <Reveal direction="up" distance={18} delay={0.15} duration={0.7} w="100%" maxW="680px">
            <Text color="white" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8" textAlign="center" fontStyle="italic">
              {t("metodo.astro.sintesis.intro", { nombre })}
            </Text>
          </Reveal>

          <CajaDeMaria clave={CLAVE_CAJA} nom={astrologiaNom} tinta={astrologiaTxt} />
        </Flex>
      </Flex>

      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
