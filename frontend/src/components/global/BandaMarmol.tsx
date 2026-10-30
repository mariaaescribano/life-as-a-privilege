import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useCabeceraEscribiendo } from "./cabeceraEntrada";

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
 * · El contenido NO arranca cuando asoma la banda (que es alta y con 90 px de
 *   relleno): arranca cuando el propio contenido ha subido por encima del 80 % de
 *   la pantalla. Así la entrada se VE siempre mientras se baja, en vez de
 *   consumirse fuera de pantalla.
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
  // Hasta que la cabecera no ha escrito su titular, ni el mármol ni nada de la banda entra.
  const cabeceraEscribiendo = useCabeceraEscribiendo();

  useEffect(() => {
    if (!el) return;
    let asoma = false;
    let scroll = window.scrollY > 0;
    const evaluar = () => {
      if (asoma && scroll && !cabeceraEscribiendo) {
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
  }, [el, cabeceraEscribiendo]);

  // El contenido arranca cuando (1) el mármol está puesto y (2) el contenido mismo
  // ha entrado en pantalla (su borde superior por encima del 80 % de la altura).
  const [cuerpo, setCuerpo] = useState<HTMLDivElement | null>(null);
  const [entra, setEntra] = useState(false);
  const [marmolDesde, setMarmolDesde] = useState(0);
  useEffect(() => { if (marmol) setMarmolDesde(Date.now()); }, [marmol]);

  useEffect(() => {
    if (!cuerpo) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setEntra(true); obs.disconnect(); } },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );
    obs.observe(cuerpo);
    return () => obs.disconnect();
  }, [cuerpo]);

  useEffect(() => {
    if (!marmol || !entra) return;
    // Mínimo 450 ms desde que el mármol está puesto: el mármol sale primero.
    const id = setTimeout(() => setVisible(true), Math.max(0, 450 - (Date.now() - marmolDesde)));
    return () => clearTimeout(id);
  }, [marmol, entra, marmolDesde]);

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
      <Box ref={setCuerpo} position="relative" zIndex={1}>
        {children(visible)}
      </Box>
    </Box>
  );
};

export default BandaMarmol;
