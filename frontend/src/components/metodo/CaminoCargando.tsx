import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import SiteHeader from "../global/SiteHeader";
import { loaderPorClave } from "./comicLoaders";
import { FONDO_PAGINA_TURQUESA } from "../../GlobalVariables";

/**
 * Pantalla de carga del CAMINO de una disciplina (/camino/<slug>): el header de la casa y, en el
 * centro, el loader de ESA disciplina en blanco sobre el turquesa. La usan los dos momentos de la
 * espera —la descarga de la página (Suspense en App.tsx) y la lectura del camino (CaminoPagina)—
 * para que sea UNA sola pantalla, sin saltar de un loader a otro.
 */
/** `txt` ya no se usa (el color de letra es el mismo en varias disciplinas): el loader sale de la clave de la ruta. */
export function CaminoCargando(_: { txt?: string }) {
  const { disciplina } = useParams();
  const key = disciplina === "medicinachina" ? "tcm" : disciplina ?? "";
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" position="relative" align="center" justify="center" overflow="hidden">
        {loaderPorClave(key, FONDO_PAGINA_TURQUESA)}
      </Flex>
    </Box>
  );
}

export default CaminoCargando;
