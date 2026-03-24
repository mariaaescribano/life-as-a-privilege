import React from "react";
import { useParams } from "react-router-dom";
import { astrologiaNom, ayurvedaNomLink, cabalaNom, fitoterapiaNom, fisiologiaNom, neuropsicologiaNom, nutricionNomLink, tcmNomLink } from "../../../GlobalVariables";
import NeurosicologiaEspacio from "../../../components/espacio/pages/NeurosicologiaEspacio";
import TCMespacio from "../../../components/espacio/pages/TCMespacio";
import FitoterapiaEspacio from "../../../components/espacio/pages/FitoterapiaEspacio";
import AstrologiaEspacio from "../../../components/espacio/pages/AstrologiaEspacio";
import CabalaEspacio from "../../../components/espacio/pages/CabalaEspacio";
import NutricionEspacio from "../../../components/espacio/pages/NutricionEspacio";
import AyurvedaMiEspacio from "../../web/AyurvedaMiEspacio";
import FisiologiaEspacio from "../../../components/espacio/pages/FisiologiaEspacio";


export default function ThemePreguntas() {
  const { themeId } = useParams<{ themeId: string }>();

  if (themeId === neuropsicologiaNom) return <NeurosicologiaEspacio />;
  if (themeId === tcmNomLink)         return <TCMespacio />;
  if (themeId === fitoterapiaNom)     return <FitoterapiaEspacio />;
  if (themeId === astrologiaNom)      return <AstrologiaEspacio />;
  if (themeId === cabalaNom)          return <CabalaEspacio />;
  if (themeId === nutricionNomLink)   return <NutricionEspacio />;
  if (themeId === ayurvedaNomLink)    return <AyurvedaMiEspacio />;
  if (themeId === fisiologiaNom)      return <FisiologiaEspacio />;

  return null;
}
