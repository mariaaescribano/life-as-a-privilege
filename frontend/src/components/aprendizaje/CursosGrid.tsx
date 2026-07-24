import React, { useEffect, useRef, useState } from "react";
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

// Reveal por scroll: cada tarjeta se enciende al entrar en el viewport, así los
// cursos van apareciendo de uno en uno según el usuario baja (en vez de animar
// todos de golpe al montar). rootMargin negativo abajo → aparece un pelín antes
// de estar del todo dentro.
const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

function CursoRevealCell({ it, i }: { it: CursoGridItem; i: number }) {
  const { ref, visible } = useReveal();
  return (
    <Box
      ref={ref}
      h="100%"
      opacity={visible ? 1 : 0}
      transform={visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)"}
      transition={`opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${(i % 3) * 0.1}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${(i % 3) * 0.1}s`}
    >
      <CursoCardDetalle curso={it.curso} bgColor={it.bgColor} color={it.color} nom={it.nom} />
    </Box>
  );
}

export function CursosGrid({ items }: { items: CursoGridItem[] }) {
  return (
    <SimpleGrid
      w="100%"
      columns={{ base: 1, md: 2, lg: 3 }}
      spacing={{ base: 4, md: 4 }}
      alignItems="start"
    >
      {items.map((it, i) => (
        <CursoRevealCell key={`${it.nom}-${it.curso.id}`} it={it} i={i} />
      ))}
    </SimpleGrid>
  );
}

export default CursosGrid;
