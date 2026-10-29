import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

/**
 * Banda a todo el ancho con el mármol de María (`marmolfondo`) de fondo.
 *
 * · El mármol es una capa propia con los bordes de arriba y abajo desvanecidos
 *   (máscara de 70 px), para que la banda se funda con el turquesa de la página
 *   en vez de cortar en seco. El contenido queda fuera de esos 70 px.
 * · NO asoma hasta que el usuario baja, y cuando baja es LO PRIMERO que sale: el
 *   mármol aparece (fundido rápido) en cuanto la banda asoma Y el usuario ha
 *   hecho scroll. NUNCA sale al cargar la página, aunque la banda ya asome por
 *   abajo de la primera pantalla: sin scroll no hay mármol. El contenido (los hijos reciben `visible`) arranca sus
 *   entradas un instante DESPUÉS, cuando el mármol ya está ahí.
 * · Sobre el mármol la letra va en turquesa oscuro (#004f4f); ver DISENO.md.
 */
const BandaMarmol = ({
  children,
  pt = { base: "64px", md: "92px" },
  pb = { base: "80px", md: "96px" },
  mt,
}: {
  children: (visible: boolean) => React.ReactNode;
  pt?: { base: string; md: string };
  pb?: { base: string; md: string };
  mt?: { base: number; md: number };
}) => {
  const [marmol, setMarmol] = useState(false);
  const [visible, setVisible] = useState(false);
  const [el, setEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!el) return;
    let asoma = false;
    let scroll = window.scrollY > 0;
    const evaluar = () => {
      if (asoma && scroll) {
        setMarmol(true);
        obs.disconnect();
        window.removeEventListener("scroll", alScroll);
      }
    };
    const alScroll = () => { scroll = true; evaluar(); };
    const obs = new IntersectionObserver(
      ([e]) => { asoma = e.isIntersecting; evaluar(); },
      { threshold: 0 },
    );
    obs.observe(el);
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => { obs.disconnect(); window.removeEventListener("scroll", alScroll); };
  }, [el]);

  // El contenido espera a que el mármol esté puesto.
  useEffect(() => {
    if (!marmol) return;
    const id = setTimeout(() => setVisible(true), 450);
    return () => clearTimeout(id);
  }, [marmol]);

  return (
    <Box ref={setEl} position="relative" mt={mt} pt={pt} pb={pb}>
      <Box
        position="absolute"
        inset={0}
        bgImage="url('/img/fondos/marmolfondo.webp')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        pointerEvents="none"
        opacity={marmol ? 1 : 0}
        transition="opacity 0.5s ease"
        sx={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 70px, #000 calc(100% - 70px), transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0, #000 70px, #000 calc(100% - 70px), transparent 100%)",
        }}
      />
      <Box position="relative" zIndex={1}>
        {children(visible)}
      </Box>
    </Box>
  );
};

export default BandaMarmol;
