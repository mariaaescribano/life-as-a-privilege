import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { ApuntesAstrologia } from "../../components/metodo/ApuntesAstrologia";
import { glowHeader } from "../../components/metodo/FotoBox";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { esMariaMirando } from "../../api/persona";
import { Reveal } from "../../components/global/Reveal";
import { astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";
import { useIdioma, useT } from "../../i18n";

/**
 * Paso 10 del recorrido de Astrología: «Crea tus apuntes personales». Va justo
 * después de descargar la carta en PDF. La persona marca los signos, casas,
 * planetas y aspectos que quiere y se los lleva en un PDF hecho para leer o
 * imprimir. La pantalla es el taller compartido de las ocho disciplinas
 * (`ApuntesAstrologia`): dos cajas plegables, la teoría y la carta de la persona.
 */
export default function MetodoAstrologiaApuntes() {
  const t = useT();
  useIdioma();
  const navigate = useNavigate();
  const { bloqueada, cargado } = useAstrologiaProgreso();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={t("metodo.astro.paso.apuntes")}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              compact
              step={{ current: 10, total: 12 }}
              mb={0}
              prev={{ label: `← ${t("metodo.astro.paso.pdf")}`, onClick: () => navigate("/metodo/astrologia/pdf") }}
              next={{
                label: `${t("metodo.astro.paso.sintesis")} →`,
                onClick: () => navigate("/metodo/astrologia/sintesis"),
                disabled: !esMariaMirando() && cargado && bloqueada(11),
              }}
            />
          </Reveal>

          <ApuntesAstrologia
            nom={astrologiaNom}
            txt={astrologiaTxt}
            bg={astrologiaBg}
            glow={glowHeader(astrologiaTxt)}
          />
        </Flex>
      </Flex>

      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
