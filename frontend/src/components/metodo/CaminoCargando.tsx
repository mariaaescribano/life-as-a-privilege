import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import SiteHeader from "../global/SiteHeader";
import { loaderDisciplinaBlanco } from "./comicLoaders";
import { disciplinaByKey } from "../../data/adminDisciplinas";

/**
 * Pantalla de carga del CAMINO de una disciplina (/camino/<slug>): el header de la casa y, en el
 * centro, el loader de ESA disciplina en blanco sobre el turquesa. La usan los dos momentos de la
 * espera —la descarga de la página (Suspense en App.tsx) y la lectura del camino (CaminoPagina)—
 * para que sea UNA sola pantalla, sin saltar de un loader a otro.
 */
export function CaminoCargando({ txt }: { txt?: string }) {
  const { disciplina } = useParams();
  const color = txt ?? disciplinaByKey(disciplina === "medicinachina" ? "tcm" : disciplina ?? "")?.txt;
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" position="relative" align="center" justify="center" overflow="hidden">
        {loaderDisciplinaBlanco(color)}
      </Flex>
    </Box>
  );
}

export default CaminoCargando;
