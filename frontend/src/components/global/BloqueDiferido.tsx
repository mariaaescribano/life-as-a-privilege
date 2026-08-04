import React, { useEffect, useState } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

// ─────────────────────────────────────────────────────────────────────────────
// Bloque de montaje DIFERIDO.
//
// No es una animación: retrasa el MONTAJE de lo que envuelve hasta que está a
// punto de asomar en pantalla.
//
// Hace falta para todo lo que anima AL MONTARSE (framer `animate`, keyframes
// CSS, un canvas que arranca su coreografía…) y vive por debajo del pliegue: esa
// entrada ocurre fuera de pantalla y, cuando el usuario baja hasta ella, se la
// encuentra ya colocada y quieta. Envolver en <Reveal> NO lo arregla: Reveal
// anima su envoltorio, pero el hijo se monta igual.
//
// `minH` reserva el hueco para que la página no dé un salto al montarlo.
//
// Lo usan el mandala-vídeo de /elMetodo (sus círculos animan al montar) y la
// presentación de Astrología (la carta 3D dibuja sus planetas al montar).
// ─────────────────────────────────────────────────────────────────────────────

export function BloqueDiferido({
  children,
  minH,
}: {
  children: React.ReactNode;
  minH?: BoxProps["minH"];
}) {
  const [cerca, setCerca] = useState(false);
  const [node, setNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!node || cerca) return;
    const obs = new IntersectionObserver(
      ([entrada]) => { if (entrada.isIntersecting) { setCerca(true); obs.disconnect(); } },
      // Justo antes de entrar (80px), no mucho antes. El montaje dispara la
      // entrada, así que si se monta demasiado pronto la cascada arranca fuera
      // de pantalla y te pierdes el principio. 80px basta para que el salto de
      // maquetación no se vea y la animación se vea entera.
      { rootMargin: "80px 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [node, cerca]);

  return (
    <Box ref={setNode} minH={cerca ? undefined : minH}>
      {cerca ? children : null}
    </Box>
  );
}

export default BloqueDiferido;
