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

const EyeIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

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
              extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
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
              style={{ textShadow: `0 0 10px ${astrologiaTxt}44` }}
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
