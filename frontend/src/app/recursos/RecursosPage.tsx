import { Box, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  tcmNomLink,
} from "../../GlobalVariables";
import TCMrecursos from "../../components/recursos/tcm/TCMrecursos";

export default function RecursosPage() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const [PageComponent, setPageComponent] = useState<React.ComponentType | null>(null);

  const getModuloDatos = (): React.ComponentType | null => {
    switch (moduloId) {
      case tcmNomLink:
        return TCMrecursos;
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