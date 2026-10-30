import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useCabeceraEscribiendo } from "./cabeceraEntrada";

/**
 * Banda a todo el ancho con el mármol de María (`marmolfondo`) de fondo.
 *
 * · El mármol es una capa propia con los bordes de arriba y abajo desvanecidos
 *   (máscara de 70 px), para que la banda se funda con el turquesa de la página
 *   en vez de cortar en seco. El contenido queda fuera de esos 70 px.
 * · Es LO PRIMERO que sale tras la cabecera: el mármol aparece (fundido rápido) cuando la
 *   banda asoma Y la cabecera ha terminado su secuencia (mandala, titular, frase y la
 *   línea horizontal con el mandala pequeño). No hace falta hacer scroll: si la banda
 *   ya se ve, el mármol es el siguiente movimiento de la página. El contenido (los
 *   hijos reciben `visible`) arranca sus entradas un instante DESPUÉS, cuando el
 *   mármol ya está ahí.
 * · El contenido NO arranca cuando asoma la banda (que es alta y con 90 px de
 *   relleno): arranca cuando el propio contenido ha subido por encima del 80 % de
 *   la pantalla. Así la entrada se VE siempre mientras se baja, en vez de
 *   consumirse fuera de pantalla.
 * · En móvil el relleno es de 104/116 px: así el contenido queda fuera de los 70 px del fundido.
 * · Sobre el mármol la letra va en turquesa oscuro (#004f4f); ver DISENO.md.
 */
const BandaMarmol = ({
  children,
  pt = { base: "104px", md: "92px" },
  pb = { base: "116px", md: "96px" },
  mt,
  tapas = false,
}: {
  tapas?: boolean;
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
    const evaluar = () => {
      if (asoma && !cabeceraEscribiendo) {
        setMarmol(true);
        obs.disconnect();
      }
    };
    const obs = new IntersectionObserver(
      ([e]) => { asoma = e.isIntersecting; evaluar(); },
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
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
        // En móvil la banda es alta y estrecha: se usa un mármol SOLO CREMA (sin turquesa ni
        // vetas fuertes), así la letra cae siempre sobre lo claro, sea cual sea el alto de la
        // banda. El turquesa del principio y del final lo pone el fundido de la máscara.
        // Con `tapas` (bandas con letra suelta sobre el mármol, como los nombres del mandala): el
        // turquesa con oro va SOLO en dos tapas, arriba y abajo, que se funden hacia el crema; el
        // cuerpo es crema liso. La banda lleva más relleno para que el texto empiece bajo la tapa.
        bgImage={
          tapas
            ? {
                base: "url('/img/fondos/marmol-tapa-arriba.webp'), url('/img/fondos/marmol-tapa-abajo.webp'), url('/img/fondos/marmolfondo-crema.webp')",
                md: "url('/img/fondos/marmol-tapa-arriba.webp'), url('/img/fondos/marmol-tapa-abajo.webp'), url('/img/fondos/marmolfondo-crema-ancho.webp')",
              }
            : {
                base: "url('/img/fondos/marmolfondo-crema.webp')",
                md: "url('/img/fondos/marmolfondo.webp')",
              }
        }
        bgSize={tapas ? { base: "auto 340px, auto 340px, cover", md: "100% auto, 100% auto, cover" } : "cover"}
        bgPosition={tapas ? { base: "right top, right bottom, center", md: "top, bottom, center" } : "center"}
        bgRepeat="no-repeat"
        pointerEvents="none"
        opacity={marmol ? 1 : 0}
        transition="opacity 0.5s ease"
        sx={{
          // Móvil: fundido de 96 px (el contenido empieza a 104). Escritorio: 70 px.
          "--fundido": "96px",
          "@media (min-width: 48em)": { "--fundido": "70px" },
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 var(--fundido), #000 calc(100% - var(--fundido)), transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0, #000 var(--fundido), #000 calc(100% - var(--fundido)), transparent 100%)",
        }}
      />
      <Box ref={setCuerpo} position="relative" zIndex={1}>
        {children(visible)}
      </Box>
    </Box>
  );
};

export default BandaMarmol;
