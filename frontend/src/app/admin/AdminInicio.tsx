import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { Reveal } from "../../components/global/Reveal";
import { useT } from "../../i18n";
import { MandalaTurquesa } from "./PildorasAdmin";
import { useAdminGuard } from "./useAdminGuard";

// Inicio del panel: una tarjeta por cada sitio del menú de la derecha, para ir
// directo desde aquí. Si se añade una entrada al menú de admin (SiteHeader), va
// también en esta lista.
const SITIOS = [
  { clave: "header.asesorias",    ruta: "/admin/asesorias" },
  { clave: "header.cursos",       ruta: "/admin/cursos" },
  { clave: "header.arquetipos",   ruta: "/admin/astrologia-textos" },
  { clave: "header.lecturas",     ruta: "/admin/lecturas" },
  { clave: "header.suscriptores", ruta: "/admin/suscriptores" },
  // { clave: "header.premium",      ruta: "/admin/premium" }, // Premium (admin) aparcado
  { clave: "header.informes",     ruta: "/admin/informes" },
  { clave: "header.correos",      ruta: "/admin/correos" },
] as const;


export default function AdminInicio() {
  const navigate = useNavigate();
  const t = useT();
  const { verificando } = useAdminGuard();

  if (verificando) {
    return <LifeLoading variant="private" />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" direction="column" align="center" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 10, md: 16 }}>
        <Reveal direction="down" distance={18}>
          <Box w={{ base: "56px", md: "78px" }}>
            <MandalaTurquesa tam="100%" />
          </Box>
        </Reveal>

        <Grid
          w="100%"
          maxW="980px"
          mt={{ base: 8, md: 12 }}
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={{ base: 4, md: 6 }}
        >
          {SITIOS.map((s, i) => (
            <Reveal key={s.ruta} direction="up" distance={24} delay={0.25 + i * 0.08} display="flex">
              <Flex
                as="button"
                type="button"
                onClick={() => navigate(s.ruta)}
                flex="1"
                direction="column"
                align="center"
                justify="center"
                gap={4}
                minH={{ base: "120px", md: "160px" }}
                px={6}
                py={{ base: 6, md: 8 }}
                borderRadius="28px"
                // El mármol de María, con la letra en turquesa oscuro.
                bgColor="#efe5cf"
                bgImage="none /* MÁRMOL QUITADO 2026-11-27: antes url('/img/fondos/marmol-bandas.webp') */"
                bgSize="cover"
                bgPosition="center"
                border="1.5px solid #3B2418"
                boxShadow="0 0 18px #b08d3f44, 0 0 40px #b08d3f22"
                cursor="pointer"
                transition="transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
                _hover={{ transform: "translateY(-4px)", boxShadow: "0 0 26px #b08d3f66, 0 0 56px #b08d3f33" }}
                _focusVisible={{ outline: "2px solid #3B2418cc", outlineOffset: "2px" }}
                role="group"
              >
                <Text
                  color="#3B2418"
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="700"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  lineHeight="1.2"
                  textAlign="center"
                >
                  {t(s.clave)}
                </Text>
                <Box
                  h="1px"
                  w="36px"
                  bg="#3B2418"
                  transition="width 0.35s ease"
                  _groupHover={{ w: "72px" }}
                />
              </Flex>
            </Reveal>
          ))}
          {/* DIARIO: una tarjeta más, igual que las demás (sin frase debajo). */}
          <Reveal direction="up" distance={24} delay={0.25 + SITIOS.length * 0.08} display="flex">
            <Flex
              as="button"
              type="button"
              onClick={() => navigate("/admin/mi-diario")}
              flex="1"
              direction="column"
              align="center"
              justify="center"
              gap={4}
              minH={{ base: "120px", md: "160px" }}
              px={6}
              py={{ base: 6, md: 8 }}
              borderRadius="28px"
              bgColor="#efe5cf"
              bgImage="none /* MÁRMOL QUITADO 2026-11-27: antes url('/img/fondos/marmol-bandas.webp') */"
              bgSize="cover"
              bgPosition="center"
              border="1.5px solid #3B2418"
              boxShadow="0 0 18px #b08d3f44, 0 0 40px #b08d3f22"
              cursor="pointer"
              transition="transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
              _hover={{ transform: "translateY(-4px)", boxShadow: "0 0 26px #b08d3f66, 0 0 56px #b08d3f33" }}
              _focusVisible={{ outline: "2px solid #3B2418cc", outlineOffset: "2px" }}
              role="group"
            >
              <Text color="#3B2418" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" lineHeight="1.2" textAlign="center">
                Diario
              </Text>
              <Box h="1px" w="36px" bg="#3B2418" transition="width 0.35s ease" _groupHover={{ w: "72px" }} />
            </Flex>
          </Reveal>
        </Grid>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
