import { Box } from "@chakra-ui/react";
import { ModuloAcordeon } from "../../components/aprendizaje/ModuloAcordeon";
import React, { useEffect, useState } from "react";
import { Header } from "../../components/global/Header";
import Footer from "../../components/global/Footer";
import Title from "../../components/global/Title";
import { useParams } from "react-router-dom";
import type { Modulo } from "../../dtos/aprendizaje.type";
import { astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt, ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt, biologiaBg, BiologiaIcon, biologiaNom, biologiaTxt, cabalaBg, CabalaIcon, cabalaNom, cabalaTxt, fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt, neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt, nutricionBg, NutricionIcon, nutricionNom, nutricionTxt, tcmBg, TCMIcon, tcmNom, tcmTxt } from "../../GlobalVariables";
import { modulosNeuroPsicologia } from "../../hardCoded/aprendizajes/ModulosNeuroPsicologia";

export default function ModulesPage() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const [moduloDatos, setmoduloDatos] = useState<Modulo | null>(null);

  const getModuloDatos = (): Modulo => {
    switch (moduloId) {
      case "fisiologia":
        return {
          nom: fisiologiaNom,
          bgColor: fisiologiaBg,
          color: fisiologiaTxt,
          icon: <FisiologiaIcon/>,
          modulos: modulosNeuroPsicologia
        };
      case neuropsicologiaNom:
        return {
          nom: neuropsicologiaNom,
          bgColor: neuropsicologiaBg,
          color: neuropsicologiaTxt,
          icon: <NeuropsicologiaIcon size={{base:"60px", md:"60px"}} />,
          modulos: modulosNeuroPsicologia
        };
      case "astrologia":
        return {
          nom: astrologiaNom,
          bgColor: astrologiaBg,
          color: astrologiaTxt,
          icon: <AstrologiaIcon/>,
          
        };
      case "tcm":
        return {
          nom: tcmNom,
          bgColor: tcmBg,
          color: tcmTxt,
          icon: <TCMIcon/>,
        };
      case "nutricion":
        return {
          nom: nutricionNom,
          bgColor: nutricionBg,
          color: nutricionTxt,
          icon: <NutricionIcon/>,
        };
      case "ayurveda":
        return {
          nom: ayurvedaNom,
          bgColor: ayurvedaBg,
          color: ayurvedaTxt,
          icon: <AyurvedaIcon/>,
        };
      case "biologia":
        return {
          nom: biologiaNom,
          bgColor: biologiaBg,
          color: biologiaTxt,
          icon: <BiologiaIcon/>,
        };
      case "cabala":
        return {
          nom: cabalaNom,
          bgColor: cabalaBg,
          color: cabalaTxt,
          icon: <CabalaIcon/>,
        };
      default:
        //navigate("/logIn"); // si no coincide ningún módulo
        return {
          nom: "",
          bgColor: "",
          color: "",
          icon: null,
        };
    }
  };

  useEffect(() => {
    if(moduloId)
    {
      let obj: Modulo = getModuloDatos();
      setmoduloDatos(obj);
    }
  }, [moduloId]); 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
    >
      <Header dondeEstoy="aprendizaje" />
        <Box flex="1">
          {moduloDatos != null && moduloDatos.modulos &&
          <>
            <Title icon={moduloDatos.icon} title={moduloDatos.nom} color={moduloDatos.color}/>

            <Box p={8}>
              {moduloDatos.modulos.map((mod, i) => (
                <ModuloAcordeon key={i} title={mod.title}
                bgColor={moduloDatos.bgColor} color={moduloDatos.color}
                submodules={mod.submodules} icon={mod.icon} />
              ))}
            </Box>
          </>}
        </Box>
      <Footer />    
    </Box>
  );
}
