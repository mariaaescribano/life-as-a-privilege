import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { fisiologiaNom } from "../../GlobalVariables";
import { glowHeader } from "./FotoBox";
import { fisiologiaTxt } from "../../GlobalVariables";

// Caja de Fisiología: su foto de fondo, sin filo y con el halo del header
// (ver DISENO.md §5). Es la caja de todo el camino «Tu cuerpo».
export function CajaFisio({
  children,
  radio = "2xl",
  glow,
  ...rest
}: { children?: React.ReactNode; radio?: string; glow?: string } & BoxProps) {
  return (
    <Box
      position="relative"
      w="100%"
      borderRadius={radio}
      overflow="hidden"
      boxShadow={glow ?? glowHeader(fisiologiaTxt)}
      {...rest}
    >
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius={radio} />
      <Box position="relative" zIndex={1} h="100%">
        {children}
      </Box>
    </Box>
  );
}
