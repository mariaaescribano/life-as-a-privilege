import React from "react";
import { useParams } from "react-router-dom";
import { fitoterapiaNom, neuropsicologiaNom, tcmNomLink } from "../../../GlobalVariables";
import NeurosicologiaEspacio from "../../../components/espacio/pages/NeurosicologiaEspacio";
import TCMespacio from "../../../components/espacio/pages/TCMespacio";
import FitoterapiaEspacio from "../../../components/espacio/pages/FitoterapiaEspacio";


export default function ThemePreguntas() {
  const { themeId } = useParams<{ themeId: string }>();

  if (themeId === neuropsicologiaNom) return <NeurosicologiaEspacio />;
  if (themeId === tcmNomLink)         return <TCMespacio />;
  if (themeId === fitoterapiaNom)     return <FitoterapiaEspacio />;

  return null;
}
