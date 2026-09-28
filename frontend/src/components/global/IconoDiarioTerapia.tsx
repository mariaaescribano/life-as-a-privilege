import React from "react";
import { Box } from "@chakra-ui/react";

/** Icono del DIARIO DE TERAPIA (marcapáginas con corazón). Es el distintivo de
 *  ese diario en toda la casa: el pin del /home y el botón «Diario de terapias»
 *  del panel de admin. No confundir con el libro abierto de «Mis notas». */
export function IconoDiarioTerapia({ fill = "#FFFFFF", size = "24px" }: { fill?: string; size?: string }) {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={size} h={size} fill={fill} flexShrink={0}>
      <path d="M480-388q51-47 82.5-77.5T611-518q17-22 23-38.5t6-35.5q0-36-26-62t-62-26q-21 0-40.5 8.5T480-648q-12-15-31-23.5t-41-8.5q-36 0-62 26t-26 62q0 19 5.5 35t22.5 38q17 22 48 52.5t84 78.5ZM200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
    </Box>
  );
}
