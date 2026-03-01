import React from "react";
import { useParams } from "react-router-dom";
import { neuropsicologiaNom, tcmNomLink } from "../../../GlobalVariables";
import NeurosicologiaEspacio from "../../../components/espacio/pages/NeurosicologiaEspacio";
import TcmEspacio from "../../../components/espacio/pages/TCMespacio";

export default function ThemePreguntas() {
  const { themeId } = useParams<{ themeId: string }>();

  if (themeId === neuropsicologiaNom) return <NeurosicologiaEspacio />;
  if (themeId === tcmNomLink)         return <TcmEspacio />;

  return null;
}
