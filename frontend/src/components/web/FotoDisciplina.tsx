import React, { useState } from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

/** La foto cuadrada que representa a la disciplina: /img/disciplinas/<key>.webp. Hasta que
 *  María pase las fotos, en su lugar sale el fondo de la disciplina con su icono. */
export default function FotoDisciplina({ d }: { d: PresentacionDisciplina }) {
  const [falta, setFalta] = useState(false);
  return (
    <Box
      position="relative"
      w="100%"
      overflow="hidden"
      borderRadius="2xl"
      bg={d.bg}
      // El mismo filo que las cajas de las puertas: 2 px del color de letra de la disciplina, suave.
      border={`2px solid ${d.txt}80`}
      sx={{ aspectRatio: "1 / 1" }}
    >
      {falta ? (
        <>
          <DisciplinaBgLayer nom={d.nom} borderRadius="2xl" />
          <Flex position="absolute" inset={0} zIndex={1} align="center" justify="center">
            <d.Icon size="96px" />
          </Flex>
        </>
      ) : (
        <Image
          src={`/img/disciplinas/${d.key}.webp`}
          alt=""
          w="100%"
          h="100%"
          objectFit="cover"
          display="block"
          onError={() => setFalta(true)}
        />
      )}
    </Box>
  );
}
