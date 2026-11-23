import React, { useEffect, useRef, useState } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";

/**
 * La caja de texto de arriba de cada página del camino de Astrología (las Áreas): borde turquesa oscuro,
 * letra turquesa oscuro y un alto máximo con SCROLL VERTICAL propio, para que el texto largo no alargue la
 * página. Mientras quede texto por bajar, las últimas líneas se desvanecen (la señal de «hay más» nunca se
 * pierde, tampoco en el móvil, donde la barra del navegador solo asoma al arrastrar) y la barra es fina y
 * turquesa oscuro. Al llegar al final el texto se ve nítido.
 */
export const CajaTextoScroll = ({
  children,
  maxH = { base: "320px", md: "380px" },
  ...rest
}: { children: React.ReactNode; maxH?: BoxProps["maxH"] } & Omit<BoxProps, "children">) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hayMas, setHayMas] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setHayMas(el.scrollHeight - el.clientHeight - el.scrollTop > 8);
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", medir); ro.disconnect(); };
  }, [children]);

  const mascara = "linear-gradient(to bottom, #000 calc(100% - 56px), transparent 100%)";
  return (
    <Box
      w="100%"
      border={`1.5px solid ${T}`}
      borderRadius="3xl"
      px={{ base: 5, md: 8 }}
      py={{ base: 5, md: 7 }}
      color={T}
      {...rest}
    >
      <Box
        ref={ref}
        maxH={maxH}
        overflowY="auto"
        pr={{ base: 3, md: 4 }}
        fontSize={{ base: "lg", md: "xl" }}
        lineHeight="1.8"
        sx={{
          scrollbarWidth: "thin",
          scrollbarColor: `${T} transparent`,
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: T, borderRadius: "999px" },
          ...(hayMas ? { WebkitMaskImage: mascara, maskImage: mascara } : {}),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default CajaTextoScroll;
