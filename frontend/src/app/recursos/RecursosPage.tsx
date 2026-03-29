import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fitoterapiaNom,
  tcmNomLink,
  cabalaNom,
  nutricionNomLink,
  astrologiaNom,
  ayurvedaNomLink,
} from "../../GlobalVariables";
import TCMrecursos from "../../components/recursos/tcm/TCMrecursos";
import FitoterapiaRecursos from "../../components/recursos/fitoterapia/FitoterapiaRecursos";
import CabalaRecursos from "../../components/recursos/cabala/CabalaRecursos";
import NutricionRecursos from "../../components/recursos/nutricion/NutricionRecursos";
import AstrologiaRecursos from "../../components/recursos/astrologia/AstrologiaRecursos";
import CartaAstralRecursos from "../../components/recursos/astrologia/CartaAstralRecursos";
import AyurvedaRecursos from "../../components/recursos/ayurveda/AyurvedaRecursos";

export default function RecursosPage() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const [PageComponent, setPageComponent] = useState<React.ComponentType | null>(null);

  const getModuloDatos = (): React.ComponentType | null => {
    switch (moduloId) {
      case tcmNomLink:
        return TCMrecursos;
      case fitoterapiaNom:
        return FitoterapiaRecursos;
      case cabalaNom:
        return CabalaRecursos;
      case nutricionNomLink:
        return NutricionRecursos;
      case astrologiaNom:
        return AstrologiaRecursos;
      case "CartaAstral":
        return CartaAstralRecursos;
      case ayurvedaNomLink:
        return AyurvedaRecursos;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (moduloId) {
      setPageComponent(() => getModuloDatos());
    }
  }, [moduloId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <>
        {PageComponent && <PageComponent />}
    </> 
  );
}