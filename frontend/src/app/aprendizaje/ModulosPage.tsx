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
  FitoterapiaIcon,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaNomLink, culturaTxt,
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
    const normalizedId = modalidadId.startsWith(neuropsicologiaNom) ? neuropsicologiaNom : modalidadId;
    const modalidad = cursosData[normalizedId];
    if (!modalidad) return "";
    return modalidad.cursos.find((c) => c.id === cursoId)?.titulo ?? "";
  };

  const getModulosParaCurso = (): ModuloContenido[] => {
    if (modalidadId && cursoId) {
      const normalizedId = modalidadId.startsWith(neuropsicologiaNom) ? neuropsicologiaNom : modalidadId;
      const curso = cursosData[normalizedId]?.cursos.find(c => c.id === cursoId);
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
        return { nom: titulo || fisiologiaNom, disciplina: fisiologiaNom, nomModalidad: nomMod, bgColor: fisiologiaBg, color: fisiologiaTxt, icon: <FisiologiaIcon size={{ base: "40px", md: "50px" }} />, modulos};
      case neuropsicologiaNom:
        return { nom: titulo || neuropsicologiaNom, disciplina: neuropsicologiaNom, nomModalidad: nomMod, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />, modulos };
      case neuropsicologiaNom + "cursoEsq":
        return { nom: titulo || neuropsicologiaNom, disciplina: neuropsicologiaNom, nomModalidad: nomMod, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />, modulos };
      case neuropsicologiaNom + "cursoAnx":
        return { nom: titulo || neuropsicologiaNom, disciplina: neuropsicologiaNom, nomModalidad: nomMod, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />, modulos };
      case neuropsicologiaNom + "cursoDep":
        return { nom: titulo || neuropsicologiaNom, disciplina: neuropsicologiaNom, nomModalidad: nomMod, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "40px", md: "50px" }} />, modulos };
      case astrologiaNom:
        return { nom: titulo || astrologiaNom, disciplina: astrologiaNom, nomModalidad: nomMod, bgColor: astrologiaBg, color: astrologiaTxt, icon: <AstrologiaIcon size={{ base: "40px", md: "50px" }}/>, modulos };
      case tcmNomLink:
        return { nom: titulo || tcmNom, disciplina: tcmNom, nomModalidad: nomMod, bgColor: tcmBg, color: tcmTxt, icon: <TCMIcon  size={{ base: "40px", md: "50px" }} />, modulos };
      case nutricionNomLink:
        return {
          nom: titulo || nutricionNom, disciplina: nutricionNom, nomModalidad: nomMod, bgColor: nutricionBg, color: nutricionTxt, modulos,
          icon: cursoId === "fito-curso-1"
            ? <FitoterapiaIcon size={{ base: "40px", md: "50px" }} color={nutricionTxt} />
            : <NutricionIcon size={{ base: "40px", md: "50px" }} />,
        };
      case ayurvedaNomLink:
        return { nom: titulo || ayurvedaNom, disciplina: ayurvedaNom, nomModalidad: nomMod, bgColor: ayurvedaBg, color: ayurvedaTxt, icon: <AyurvedaIcon size={{ base: "40px", md: "50px" }} />, modulos};
      case cabalaNom:
        return { nom: titulo || cabalaNom, disciplina: cabalaNom, nomModalidad: nomMod, bgColor: cabalaBg, color: cabalaTxt, icon: <CabalaIcon size={{ base: "40px", md: "50px" }} />, modulos };
      case culturaNomLink:
        return { nom: titulo || culturaNom, disciplina: culturaNom, nomModalidad: nomMod, bgColor: culturaBg, color: culturaTxt, icon: <CulturaIcon size={{ base: "40px", md: "50px" }} />, modulos };
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
              subtitle={moduloDatos.disciplina !== moduloDatos.nom ? moduloDatos.disciplina : undefined}
              bgColor={moduloDatos.bgColor}
              color={moduloDatos.color}
              onIconClick={() => navigate(`/aprendizaje/cursos/${moduloDatos.nomModalidad}`)}
            />

            {/* Módulos directos — sin card contenedor */}
            <Box
              w="100%"
              maxW="850px"
              sx={{
                "@keyframes moduloSlideIn": {
                  from: { opacity: 0, transform: "translateX(-28px)" },
                  to:   { opacity: 1, transform: "translateX(0)"     },
                },
              }}
            >
              {moduloDatos.modulos.map((mod, i) => (
                <Box
                  key={i}
                  style={{
                    opacity: 0,
                    animation: `moduloSlideIn 0.48s cubic-bezier(0.22,1,0.36,1) ${i * 0.09}s forwards`,
                  }}
                >
                  <ModuloAcordeon
                    title={mod.title}
                    bgColor={moduloDatos.bgColor}
                    color={moduloDatos.color}
                    submodules={mod.submodules}
                    icon={mod.icon}
                  />
                </Box>
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
            config={{ ...fb, action: fb.action === "astrologia-services" ? "astrologia-services" : "modal" }}
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
