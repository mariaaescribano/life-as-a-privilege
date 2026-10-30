import React from "react";
import { Box } from "@chakra-ui/react";
import { MetodoStepHeader } from "../metodo/MetodoStepHeader";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import type { PresentacionDisciplina } from "../../data/presentacionDisciplinas";

/**
 * El header de una disciplina para las páginas públicas desde las que se ve esa
 * disciplina (su portada, sus ilustraciones…): el MISMO rectángulo de los recorridos
 * (MetodoStepHeader) —la foto de la disciplina de fondo, su icono sin círculo a la
 * izquierda del título— pero SIN botones ni nada debajo. Así, con varias pestañas
 * abiertas, siempre se ve de qué disciplina es la página en la que se está.
 */
export default function DisciplinaHeader({ d }: { d: PresentacionDisciplina }) {
  const nombreDe = useNombreDisciplina();
  return (
    <Box w="100%" px={{ base: 5, md: 10, lg: 16 }} display="flex" justifyContent="center">
      <MetodoStepHeader
        icon={<d.Icon size={{ base: "40px", md: "50px" }} />}
        title={nombreDe(d.nom)}
        bgColor={d.bg}
        color={d.txt}
        nom={d.nom}
        maxW="980px"
        mb={0}
        dense
      />
    </Box>
  );
}
