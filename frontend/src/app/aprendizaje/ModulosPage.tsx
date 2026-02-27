import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import { DisciplineHeader } from "../../components/global/DisciplineHeader";
import { ModuloAcordeon } from "../../components/aprendizaje/ModuloAcordeon";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Modulo } from "../../dtos/aprendizaje.type";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  biologiaBg, BiologiaIcon, biologiaNom, biologiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
} from "../../GlobalVariables";
import { modulosNeuroPsicologia } from "../../hardCoded/aprendizajes/ModulosNeuroPsicologia";

export default function ModulesPage() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const [moduloDatos, setmoduloDatos] = useState<Modulo | null>(null);

  const getModuloDatos = (): Modulo => {
    switch (moduloId) {
      case "fisiologia":
        return { nom: fisiologiaNom, bgColor: fisiologiaBg, color: fisiologiaTxt, icon: <FisiologiaIcon />, modulos: modulosNeuroPsicologia };
      case neuropsicologiaNom:
        return { nom: neuropsicologiaNom, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "60px", md: "60px" }} />, modulos: modulosNeuroPsicologia };
      case "astrologia":
        return { nom: astrologiaNom, bgColor: astrologiaBg, color: astrologiaTxt, icon: <AstrologiaIcon /> };
      case "tcm":
        return { nom: tcmNom, bgColor: tcmBg, color: tcmTxt, icon: <TCMIcon /> };
      case "nutricion":
        return { nom: nutricionNom, bgColor: nutricionBg, color: nutricionTxt, icon: <NutricionIcon /> };
      case "ayurveda":
        return { nom: ayurvedaNom, bgColor: ayurvedaBg, color: ayurvedaTxt, icon: <AyurvedaIcon /> };
      case "biologia":
        return { nom: biologiaNom, bgColor: biologiaBg, color: biologiaTxt, icon: <BiologiaIcon /> };
      case "cabala":
        return { nom: cabalaNom, bgColor: cabalaBg, color: cabalaTxt, icon: <CabalaIcon /> };
      default:
        return { nom: "", bgColor: "", color: "", icon: null };
    }
  };

  useEffect(() => {
    if (moduloId) {
      setmoduloDatos(getModuloDatos());
    }
  }, [moduloId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

      {/* ── HEADER ── */}
      <SiteHeader variant="auto" />

      {/* ── MAIN ── */}
      <Box flex="1">
        {moduloDatos != null && moduloDatos.modulos && (
          <Flex
            direction="column"
            alignItems="center"
            px={{ base: 5, md: 10, lg: 16 }}
            pt={{ base: 10, md: 14 }}
            pb={{ base: 14, md: 20 }}
          >
            <DisciplineHeader
              icon={moduloDatos.icon}
              title={moduloDatos.nom}
              bgColor={moduloDatos.bgColor}
              color={moduloDatos.color}
            />

            {/* Módulos directos — sin card contenedor */}
            <Box w="100%" maxW="850px">
              {moduloDatos.modulos.map((mod, i) => (
                <ModuloAcordeon
                  key={i}
                  title={mod.title}
                  bgColor={moduloDatos.bgColor}
                  color={moduloDatos.color}
                  submodules={mod.submodules}
                  icon={mod.icon}
                />
              ))}
            </Box>
          </Flex>
        )}
      </Box>

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.15)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>
    </Box>
  );
}
