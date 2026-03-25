import { Box, Flex } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { DisciplineHeader } from "../../components/global/DisciplineHeader";
import { ModuloAcordeon } from "../../components/aprendizaje/ModuloAcordeon";
import { FloatingActionButton } from "../../components/aprendizaje/FloatingActionButton";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Modulo } from "../../dtos/aprendizaje.type";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaNomLink, ayurvedaTxt,
  fitoterapiaBg, FitoterapiaIcon, fitoterapiaNom, fitoterapiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionNomLink, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
} from "../../GlobalVariables";
import { cursosData } from "../../hardCoded/cursos";
import type { ModuloContenido } from "../../dtos/aprendizaje.type";

export default function ModulesPage() {
  const { modalidadId, cursoId } = useParams<{ modalidadId: string; cursoId: string }>();
  const [moduloDatos, setmoduloDatos] = useState<Modulo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const getCursoTitulo = (): string => {
    if (!modalidadId || !cursoId) return "";
    const modalidad = cursosData[modalidadId];
    if (!modalidad) return "";
    return modalidad.cursos.find((c) => c.id === cursoId)?.titulo ?? "";
  };

  const getModulosParaCurso = (): ModuloContenido[] => {
    if (modalidadId && cursoId) {
      const curso = cursosData[modalidadId]?.cursos.find(c => c.id === cursoId);
      if (curso?.modulos) return curso.modulos;
    }
    return [];
  };

  const getModuloDatos = (): Modulo => {
    const titulo = getCursoTitulo();
    const modulos = getModulosParaCurso();
    const nomMod = modalidadId ?? "";
    switch (modalidadId) {
      case fisiologiaNom:
        return { nom: titulo || fisiologiaNom, nomModalidad: nomMod, bgColor: fisiologiaBg, color: fisiologiaTxt, icon: <FisiologiaIcon size={{ base: "40px", md: "50px" }} />, modulos};
      case neuropsicologiaNom:
        return { nom: titulo || neuropsicologiaNom, nomModalidad: nomMod, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />, modulos };
      case astrologiaNom:
        return { nom: titulo || astrologiaNom, nomModalidad: nomMod, bgColor: astrologiaBg, color: astrologiaTxt, icon: <AstrologiaIcon size={{ base: "40px", md: "50px" }}/>, modulos };
      case tcmNomLink:
        return { nom: titulo || tcmNom, nomModalidad: nomMod, bgColor: tcmBg, color: tcmTxt, icon: <TCMIcon  size={{ base: "40px", md: "50px" }} />, modulos };
      case nutricionNomLink:
        return { nom: titulo || nutricionNom, nomModalidad: nomMod, bgColor: nutricionBg, color: nutricionTxt, icon: <NutricionIcon size={{ base: "40px", md: "50px" }} />, modulos };
      case ayurvedaNomLink:
        return { nom: titulo || ayurvedaNom, nomModalidad: nomMod, bgColor: ayurvedaBg, color: ayurvedaTxt, icon: <AyurvedaIcon size={{ base: "40px", md: "50px" }} />, modulos};
      case fitoterapiaNom:
        return { nom: titulo || fitoterapiaNom, nomModalidad: nomMod, bgColor: fitoterapiaBg, color: fitoterapiaTxt, icon: <FitoterapiaIcon size={{ base: "35px", md: "45px" }} />, modulos };
      case cabalaNom:
        return { nom: titulo || cabalaNom, nomModalidad: nomMod, bgColor: cabalaBg, color: cabalaTxt, icon: <CabalaIcon size={{ base: "40px", md: "50px" }} />, modulos };
      default:
        return { nom: "", nomModalidad: "", bgColor: "", color: "", icon: null };
    }
  };

  useEffect(() => {
    if (modalidadId) {
      setmoduloDatos(getModuloDatos());
    }
  }, [modalidadId, cursoId]);

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
              onIconClick={() => navigate(`/aprendizaje/cursosModalidad/${moduloDatos.nomModalidad}`)}
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
      <SiteFooter />

      {/* ── BOTÓN FLOTANTE ── */}
      {moduloDatos && (() => {
        const fb = moduloDatos.modulos?.find(m => m.floatingButton)?.floatingButton;
        return fb ? (
          <FloatingActionButton
            config={fb}
            color={moduloDatos.color}
            bgColor={moduloDatos.bgColor}
            icon={moduloDatos.icon}
            modalityName={moduloDatos.nom}
          />
        ) : null;
      })()}
    </Box>
  );
}
