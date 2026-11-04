// El CAMINO de una disciplina (/camino/<slug>): todas sus páginas como cajitas
// unidas por flechas, para ver de un vistazo por dónde se va y qué queda. Es lo
// primero que ve la persona al pulsar una disciplina. Las páginas abiertas se
// pulsan; las que aún abre María salen con candado. María (panel de admin
// desbloqueado) entra a donde quiera.
import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { Reveal } from "../../components/global/Reveal";
import { focoBlanco } from "../../components/global/foco";
import { rutaHome } from "../../api/sesion";
import { esMariaMirando, personaActiva } from "../../api/persona";
import { claveDeSlug } from "../../data/camino";
import { disciplinaByKey } from "../../data/adminDisciplinas";
import CaminoDisciplina from "../../components/metodo/CaminoDisciplina";

export default function CaminoPagina() {
  const navigate = useNavigate();
  const { disciplina } = useParams();
  const clave = claveDeSlug(disciplina);
  const [cargando, setCargando] = useState(true);

  if (!clave) return <Navigate to={rutaHome()} replace />;
  const disc = disciplinaByKey(disciplina === "medicinachina" ? "tcm" : disciplina ?? "");

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {cargando && <LifeLoading variant="private" />}

      <Flex flex="1" direction="column" align="center" px={{ base: 4, md: 8 }} pt={{ base: 8, md: 12 }} pb={{ base: 10, md: 14 }}
            display={cargando ? "none" : "flex"}>
        <Reveal direction="down" distance={16}>
          <Text color="white" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.08em"
                textTransform="uppercase" lineHeight="1.15" textAlign="center"
                textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(180,255,245,0.3)"
                mb={{ base: 8, md: 12 }}>
            {disc?.nombre}
          </Text>
        </Reveal>

        {/* María, dentro de la cuenta de la persona, ve además los botones para abrirle pasos. */}
        <CaminoDisciplina clave={clave} userId={personaActiva()?.id} esAdmin={esMariaMirando()} onCargando={setCargando} />

        <Flex w="100%" maxW="980px" mt={{ base: 10, md: 14 }}>
          <Box
            as="button"
            type="button"
            onClick={() => navigate(rutaHome())}
            px={7}
            py="10px"
            borderRadius="full"
            border="1.5px solid rgba(255,255,255,0.75)"
            bg="rgba(255,255,255,0.14)"
            color="white"
            fontWeight="700"
            fontSize="md"
            cursor="pointer"
            boxShadow="0 0 22px rgba(255,255,255,0.3)"
            transition="all 0.2s"
            _hover={{ bg: "rgba(255,255,255,0.26)", transform: "translateY(-1px)" }}
            _focusVisible={focoBlanco}
          >
            Volver
          </Box>
        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
