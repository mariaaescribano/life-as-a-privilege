import React, { useEffect, useRef, useState } from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
import type { Curso } from "../../hardCoded/cursos";
import { CursoCardSimple } from "./CursoCardSimple";

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
  /** Proporción de la foto de cada tarjeta (por defecto 16 / 9). */
  proporcionFoto?: string;
  /** No escribir «Acceso Libre» en la tarjeta (cuando todos los cursos lo son). */
  sinAccesoLibre?: boolean;
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
    // Red de seguridad: si el observador no dispara, se coloca solo a los 15 s
    // (que nunca se pierda un bloque).
    const rescate = setTimeout(() => setVisible(true), 15000);
    return () => { obs.disconnect(); clearTimeout(rescate); };
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
      filter={visible ? "none" : "blur(6px)"}
      transition={`opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${(i % 3) * 0.12}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${(i % 3) * 0.12}s, filter 0.7s cubic-bezier(0.22,1,0.36,1) ${(i % 3) * 0.12}s`}
    >
      {/* Fondo de la disciplina; icono, nombre y flecha. */}
      <CursoCardSimple curso={it.curso} color={it.color} bgColor={it.bgColor} nom={it.nom} />
    </Box>
  );
}

export function CursosGrid({ items, columnas = { base: 1, md: 2, lg: 3 } }: { items: CursoGridItem[]; columnas?: { base: number; md: number; lg: number } }) {
  return (
    <SimpleGrid
      w="100%"
      columns={columnas}
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
