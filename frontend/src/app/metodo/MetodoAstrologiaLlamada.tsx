import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { AgendarLlamada } from "../../components/global/AgendarLlamada";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";
import { Reveal } from "../../components/global/Reveal";
import { astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";
import { useT } from "../../i18n";

/**
 * Penúltima pantalla del Recorrido de Astrología: reservar una llamada (de pago,
 * pago simulado por ahora) con María. Estilo astrología (fondo estrellado +
 * texto con brillo). Usa el componente reutilizable AgendarLlamada. El paso
 * siguiente son los Cursos de Astrología (MetodoAstrologiaCursos).
 */
export default function MetodoAstrologiaLlamada() {
  const t = useT();
  const navigate = useNavigate();
  const [comicOpen, setComicOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={t("metodo.astro.paso.llamada")}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 7, total: 8 }}
              mb={0}
              prev={{ label: `← ${t("metodo.astro.paso.pdf")}`, onClick: () => navigate("/metodo/astrologia/pdf") }}
              extra={{ label: t("metodo.ilustraciones"), onClick: () => setComicOpen(true)}}
              next={{ label: `${t("metodo.astro.paso.cursos")} →`, onClick: () => navigate("/metodo/astrologia/cursos") }}
            />
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%">
            {/* El lema, más fuerte y en blanco; debajo, el resto como siempre. */}
            <Text
              color="white"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              letterSpacing="0.04em"
              textAlign="center"
              lineHeight="1.3"
              mb={2}
            >
              {t("metodo.astro.llamadaLema")}
            </Text>
            <Text
              color={`${astrologiaTxt}ee`}
              fontSize={{ base: "md", md: "lg" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.8"
            >
              {t("metodo.astro.llamadaIntro")}
            </Text>
          </Reveal>

          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.24} duration={0.75} w="100%">
            <AgendarLlamada
              color={astrologiaTxt}
              bgColor={astrologiaBg}
              disciplinaNom={astrologiaNom}
              titulo={t("metodo.astro.reservaLlamada")}
            />
          </Reveal>
        </Flex>
      </Flex>

      <ComicAstrologiaModal isOpen={comicOpen} onClose={() => setComicOpen(false)} />

      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
