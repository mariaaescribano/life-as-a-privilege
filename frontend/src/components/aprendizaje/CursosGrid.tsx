import React from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
import type { Curso } from "../../hardCoded/cursos";
import { CursoCardDetalle } from "./CursoCardDetalle";

/* ────────────────────────────────────────────────────────────────────────
 * CursosGrid — PLANTILLA ÚNICA de la cuadrícula de tarjetas de curso.
 * La usan tanto /aprendizaje/cursos/:modalidad (CursosModalidad) como
 * /aprendizaje/aprendizajeHome ("Todos los cursos"), para que los boxes tengan
 * EXACTAMENTE la misma estética, gap y tamaño en las dos páginas. Si hay que
 * tocar columnas/gap/animación, se cambia aquí y afecta a ambas por igual.
 * ──────────────────────────────────────────────────────────────────────── */
export interface CursoGridItem {
  curso: Curso;
  color: string;
  bgColor: string;
  nom: string;
}

export function CursosGrid({ items }: { items: CursoGridItem[] }) {
  return (
    <SimpleGrid
      w="100%"
      columns={{ base: 1, sm: 2, lg: 3 }}
      spacing={{ base: 4, md: 4 }}
      alignItems="start"
      sx={{
        "@keyframes cursoCardIn": {
          from: { opacity: 0, transform: "translateY(40px) scale(0.95)" },
          to: { opacity: 1, transform: "translateY(0)    scale(1)" },
        },
      }}
    >
      {items.map((it, i) => (
        <Box
          key={`${it.nom}-${it.curso.id}`}
          h="100%"
          style={{
            opacity: 0,
            animation: `cursoCardIn 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s forwards`,
          }}
        >
          <CursoCardDetalle curso={it.curso} bgColor={it.bgColor} color={it.color} nom={it.nom} />
        </Box>
      ))}
    </SimpleGrid>
  );
}

export default CursosGrid;
