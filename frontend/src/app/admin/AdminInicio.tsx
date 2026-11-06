import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { Reveal } from "../../components/global/Reveal";
import { focoBlanco } from "../../components/global/foco";
import { useT } from "../../i18n";
import { useAdminGuard } from "./useAdminGuard";
import { useUltimaEntradaDiario } from "../../components/global/DiarioMaria";

// Inicio del panel: una tarjeta por cada sitio del menú de la derecha, para ir
// directo desde aquí. Si se añade una entrada al menú de admin (SiteHeader), va
// también en esta lista.
const SITIOS = [
  { clave: "header.asesorias",    ruta: "/admin/asesorias" },
  { clave: "header.cursos",       ruta: "/admin/cursos" },
  { clave: "header.arquetipos",   ruta: "/admin/astrologia-textos" },
  { clave: "header.suscriptores", ruta: "/admin/suscriptores" },
  { clave: "header.premium",      ruta: "/admin/premium" },
] as const;


export default function AdminInicio() {
  const navigate = useNavigate();
  const t = useT();
  const { verificando } = useAdminGuard();
  // Lo último que María apuntó de sí misma: se asoma en la tarjeta DIARIO.
  const ultimaDiario = useUltimaEntradaDiario();

  if (verificando) {
    return <LifeLoading variant="private" />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" direction="column" align="center" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 10, md: 16 }}>
        <Reveal direction="down" distance={18}>
          <Image
            src="/img/icono/life.webp"
            alt=""
            h={{ base: "56px", md: "78px" }}
            objectFit="contain"
            style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.59)) drop-shadow(0 0 21px rgba(255,255,255,0.32)) drop-shadow(0 0 42px rgba(180,255,245,0.24))" }}
          />
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
                bgImage="url('/img/fondos/marmolfondo-crema.webp')"
                bgSize="cover"
                bgPosition="center"
                border="1px solid rgba(255,255,255,0.65)"
                boxShadow="0 0 30px rgba(255,255,255,0.28), 0 0 70px rgba(180,255,245,0.14)"
                cursor="pointer"
                transition="transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
                _hover={{ transform: "translateY(-4px)", borderColor: "white", boxShadow: "0 0 38px rgba(255,255,255,0.45), 0 0 84px rgba(180,255,245,0.24)" }}
                _focusVisible={focoBlanco}
                role="group"
              >
                <Text
                  color="#004f4f"
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
                  bg="#004f4f"
                  transition="width 0.35s ease"
                  _groupHover={{ w: "72px" }}
                />
              </Flex>
            </Reveal>
          ))}
          {/* DIARIO: una tarjeta más, con lo último que María apunta de sí misma (solo ella lo ve). */}
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
              bgImage="url('/img/fondos/marmolfondo-crema.webp')"
              bgSize="cover"
              bgPosition="center"
              border="1px solid rgba(255,255,255,0.65)"
              boxShadow="0 0 30px rgba(255,255,255,0.28), 0 0 70px rgba(180,255,245,0.14)"
              cursor="pointer"
              transition="transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
              _hover={{ transform: "translateY(-4px)", borderColor: "white", boxShadow: "0 0 38px rgba(255,255,255,0.45), 0 0 84px rgba(180,255,245,0.24)" }}
              _focusVisible={focoBlanco}
              role="group"
            >
              <Text color="#004f4f" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" lineHeight="1.2" textAlign="center">
                Diario
              </Text>
              <Box h="1px" w="36px" bg="#004f4f" transition="width 0.35s ease" _groupHover={{ w: "72px" }} />
              {ultimaDiario && (
                <Text color="#004f4fcc" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center" noOfLines={2} maxW="100%">
                  {ultimaDiario}
                </Text>
              )}
            </Flex>
          </Reveal>
        </Grid>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
