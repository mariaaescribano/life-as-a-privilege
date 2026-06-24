import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { AgendarLlamada } from "../../components/global/AgendarLlamada";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";
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
          <MetodoStepHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
            title="Llamada"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            space
            step={{ current: 7, total: 8 }}
            mb={0}
            prev={{ label: "← Aspectos", onClick: () => navigate("/metodo/astrologia/aspectos") }}
            extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
            next={{ label: "Cursos →", onClick: () => navigate("/metodo/astrologia/cursos") }}
          />

          <AgendarLlamada
            color={astrologiaTxt}
            bgColor={astrologiaBg}
            disciplinaNom={astrologiaNom}
            precio={20}
            titulo="Reserva tu llamada de astrología"
          />

          {/* Nota debajo del box de la llamada, con fondo de astrología */}
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow={`0 0 18px rgba(255,255,255,0.1), 0 0 30px ${astrologiaTxt}1a`}
          >
            <DisciplinaBgLayer nom={astrologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }} textAlign="center">
              <Text
                color={`${astrologiaTxt}ee`}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.9"
                style={{ textShadow: `0 0 10px ${astrologiaTxt}44` }}
              >
                Da el paso para integrar tus arquetipos: agenda una llamada y no te quedes con dudas.
              </Text>
              <Text
                color={`${astrologiaTxt}bb`}
                fontSize={{ base: "xs", md: "sm" }}
                fontStyle="italic"
                mt={3}
                lineHeight="1.6"
                style={{ textShadow: `0 0 8px ${astrologiaTxt}33` }}
              >
                La llamada es opcional pero recomendada. Puedes avanzar a los cursos.
              </Text>
            </Box>
          </Box>
        </Flex>
      </Flex>

      <ComicAstrologiaModal isOpen={comicOpen} onClose={() => setComicOpen(false)} />

      <SiteFooter />
    </Box>
  );
}
