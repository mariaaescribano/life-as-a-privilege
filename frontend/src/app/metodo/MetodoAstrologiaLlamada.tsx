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

/**
 * Penúltima pantalla del Recorrido de Astrología: reservar una llamada (de pago,
 * pago simulado por ahora) con María. Estilo astrología (fondo estrellado +
 * texto con brillo). Usa el componente reutilizable AgendarLlamada. El paso
 * siguiente son los Cursos de Astrología (MetodoAstrologiaCursos).
 */
export default function MetodoAstrologiaLlamada() {
  const navigate = useNavigate();
  const [comicOpen, setComicOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title="Llamada"
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 8, total: 9 }}
              mb={0}
              prev={{ label: "← Tu carta en PDF", onClick: () => navigate("/metodo/astrologia/pdf") }}
              extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true)}}
              next={{ label: "Cursos →", onClick: () => navigate("/metodo/astrologia/cursos") }}
            />
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%">
            <Text
              color={`${astrologiaTxt}ee`}
              fontSize={{ base: "md", md: "lg" }}
              fontStyle="italic"
              textAlign="center"
              lineHeight="1.8"
            >
              Integra tus arquetipos: agenda una llamada y no te quedes con dudas.
            </Text>
          </Reveal>

          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.24} duration={0.75} w="100%">
            <AgendarLlamada
              color={astrologiaTxt}
              bgColor={astrologiaBg}
              disciplinaNom={astrologiaNom}
              precio={20}
              titulo="Reserva tu llamada de astrología"
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
