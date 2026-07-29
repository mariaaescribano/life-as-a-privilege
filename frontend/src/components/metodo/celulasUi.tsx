import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { disciplinaBgImg } from "../global/DisciplinaBgLayer";
import { FotoBox, glowHeader } from "./FotoBox";
import { fisiologiaTxt, fisiologiaBg, fisiologiaNom } from "../../GlobalVariables";
import type { Celula } from "../../hardCoded/espacio/CelulasCuerpoData";

const TXT = fisiologiaTxt;
const BG = fisiologiaBg;
const FISIO_IMG = disciplinaBgImg(fisiologiaNom) ?? "/img/fondos/fisio.webp";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─────────────────────────────────────────
   TARJETA DE CÉLULA
   Fondo = foto de Fisiología. Dentro: foto de la célula, una rallita
   elegante, el nombre y "Leer más →" abajo a la derecha.
───────────────────────────────────────── */
export function CelulaCard({ celula, onClick, visto = false }: { celula: Celula; onClick: () => void; visto?: boolean }) {
  return (
    <FotoBox
      titulo={celula.nombre}
      foto={celula.foto}
      nom={fisiologiaNom}
      tinta={TXT}
      bg={BG}
      // Fondo del área de la foto en oscuro (el Bg de Fisiología) en vez del
      // tinte claro por defecto: así la tarjeta no tiene ese "color claro".
      colorTint={BG}
      // El mismo halo que la cabecera de la página: así la tarjeta de célula,
      // los paneles y el header llevan exactamente el mismo brillo.
      glow={glowHeader(TXT)}
      visto={visto}
      onClick={onClick}
    />
  );
}

/* ─────────────────────────────────────────
   FICHA FISIOLOGÍA — MODAL ÚNICO Y REUTILIZABLE
   Este es EL único box de lectura de Fisiología. Lo usan la ficha de célula,
   los consejos de los órganos, los sistemas del cuerpo y las fichas de
   Profundiza. Es EXACTAMENTE la misma caja que el visor de «Ilustraciones»
   (ComicViewer): fondo a pantalla completa con la foto de Fisiología muy
   difuminada + velo, y una caja con foto a la izquierda, rallita vertical y
   título + texto a la derecha, con líneas de luz arriba/abajo, flechas
   circulares flotantes y contador. El título va en lavanda (un poco más
   oscurito que el blanco del cómic). No dupliques este layout: pásale
   foto/título/párrafos y (opcional) flechas + acento.
───────────────────────────────────────── */
export function FichaFisioModal({
  foto,
  alt = "",
  titulo,
  claves,
  parrafos,
  onClose,
  onPrev,
  onNext,
  contador = null,
  fotoFallback,
  accent = TXT,
  bgImage = FISIO_IMG,
  bgColor = BG,
  txtColor = TXT,
}: {
  /** Ruta de la imagen cuadrada de la izquierda. */
  foto: string;
  /** Texto alternativo de la imagen. */
  alt?: string;
  /** Título (nombre de la célula, titular del consejo, nombre del sistema…). */
  titulo: React.ReactNode;
  /** Las 3 (o pocas) cosas clave, en cajas blancas bajo el título. Opcional. */
  claves?: string[];
  /** Uno o varios párrafos; se maquetan con el mismo estilo y separación. */
  parrafos: React.ReactNode[];
  onClose: () => void;
  /** Si se pasan onPrev + onNext, aparecen las flechas y funciona el teclado. */
  onPrev?: () => void;
  onNext?: () => void;
  /** Contador discreto abajo (p. ej. "3 / 8"). Opcional. */
  contador?: string | null;
  /** Qué mostrar si la foto falla (por defecto, nada). */
  fotoFallback?: React.ReactNode;
  /** Color de acento (glows, líneas, flechas, título). Por defecto el de Fisiología. */
  accent?: string;
  /** Foto de fondo de la disciplina (pantalla completa + fondo del box). Por
   *  defecto la de Fisiología; Nutrición pasa la suya (nutri.png). */
  bgImage?: string;
  /** Color base de la disciplina (velo del fondo + glow del box). Por defecto Fisiología. */
  bgColor?: string;
  /** Color del texto de los párrafos. Por defecto el de Fisiología. */
  txtColor?: string;
}) {
  const [imgErr, setImgErr] = useState(false);
  const puedeNavegar = !!onPrev && !!onNext;
  // Contenedores con scroll (móvil: el Flex; escritorio: el Box del texto).
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Al cambiar de ficha (con las flechas) el modal NO se desmonta, así que
  // reiniciamos el estado de error de imagen manualmente y, además, subimos el
  // scroll arriba del todo para que cada célula se vea desde el principio (el
  // título), no a media lectura de la anterior.
  useEffect(() => {
    setImgErr(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
    if (textRef.current) textRef.current.scrollTop = 0;
  }, [foto, titulo]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev?.();
      else if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onPrev, onNext]);

  const scrollbarSx = {
    "&::-webkit-scrollbar": { width: "6px" },
    "&::-webkit-scrollbar-track": { background: "transparent" },
    "&::-webkit-scrollbar-thumb": { background: `${accent}55`, borderRadius: "3px" },
    "&::-webkit-scrollbar-thumb:hover": { background: `${accent}88` },
    scrollbarWidth: "thin" as const,
    scrollbarColor: `${accent}55 transparent`,
  };

  const flechaSx = {
    position: "fixed" as const,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    variant: "ghost" as const,
    borderRadius: "full",
    w: { base: "40px", md: "60px" },
    h: { base: "40px", md: "60px" },
    minW: { base: "40px", md: "60px" },
    bg: "rgba(0,0,0,0.5)",
    border: `1px solid ${accent}aa`,
    boxShadow: "0 2px 14px rgba(0,0,0,0.45)",
    sx: { backdropFilter: "blur(4px)" },
    _hover: { bg: "rgba(0,0,0,0.72)", borderColor: accent },
    _focus: { boxShadow: "0 2px 14px rgba(0,0,0,0.45)" },
    _focusVisible: { boxShadow: "0 2px 14px rgba(0,0,0,0.45)" },
  };

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={1100}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 20 }}
      py={{ base: 12, md: 14 }}
      onClick={onClose}
    >
      {/* Fondo a pantalla completa: foto de Fisiología muy difuminada + velo,
          igual que el visor de Ilustraciones. */}
      <Box
        position="fixed"
        top="-40px"
        left="-40px"
        right="-40px"
        bottom="-40px"
        pointerEvents="none"
        zIndex={0}
        overflow="hidden"
        bg={bgColor}
      >
        <Box
          as="img"
          src={bgImage}
          alt=""
          loading="eager"
          position="absolute"
          top="-28px"
          left="-28px"
          right="-28px"
          bottom="-28px"
          w="calc(100% + 56px)"
          h="calc(100% + 56px)"
          style={{ objectFit: "cover", objectPosition: "center", filter: "blur(20px)" }}
        />
        <Box position="absolute" inset="0" bg="rgba(0,0,0,0.45)" />
      </Box>

      {/* X cerrar — chip oscuro para que resalte sobre cualquier fondo */}
      <IconButton
        aria-label="Cerrar"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        position="fixed"
        top={{ base: 3, md: 5 }}
        right={{ base: 3, md: 5 }}
        zIndex={10}
        variant="ghost"
        borderRadius="full"
        w={{ base: "42px", md: "48px" }}
        h={{ base: "42px", md: "48px" }}
        minW={{ base: "42px", md: "48px" }}
        bg="rgba(0,0,0,0.5)"
        border={`1px solid ${accent}aa`}
        boxShadow="0 2px 12px rgba(0,0,0,0.45)"
        sx={{ backdropFilter: "blur(4px)" }}
        _hover={{ bg: "rgba(0,0,0,0.7)", borderColor: accent }}
        _focus={{ boxShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
        _focusVisible={{ boxShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
        icon={
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="26px" h="26px" fill="#ffffff"
            style={{ filter: `drop-shadow(0 0 5px ${accent}) drop-shadow(0 1px 2px rgba(0,0,0,0.8))` }}>
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </Box>
        }
      />

      {/* Flechas para pasar de una ficha a otra (por encima del box) */}
      {puedeNavegar && (
        <>
          <IconButton
            aria-label="Anterior"
            onClick={(e) => { e.stopPropagation(); onPrev!(); }}
            left={{ base: 1, md: 6 }}
            {...flechaSx}
            icon={
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "24px", md: "32px" }} h={{ base: "24px", md: "32px" }} fill="#ffffff"
                style={{ filter: `drop-shadow(0 0 6px ${accent}) drop-shadow(0 1px 2px rgba(0,0,0,0.85))` }}>
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
              </Box>
            }
          />
          <IconButton
            aria-label="Siguiente"
            onClick={(e) => { e.stopPropagation(); onNext!(); }}
            right={{ base: 1, md: 6 }}
            {...flechaSx}
            icon={
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "24px", md: "32px" }} h={{ base: "24px", md: "32px" }} fill="#ffffff"
                style={{ filter: `drop-shadow(0 0 6px ${accent}) drop-shadow(0 1px 2px rgba(0,0,0,0.85))` }}>
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
              </Box>
            }
          />
        </>
      )}

      {/* Caja única: foto + texto sobre la foto de la disciplina, con líneas de
          luz arriba/abajo. El scroll ocurre DENTRO de la caja. */}
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        w="100%"
        maxW={{ base: "360px", md: "900px" }}
        h={{ base: "auto", md: "500px" }}
        maxH={{ base: "calc(100dvh - 96px)", md: "500px" }}
        display="flex"
        flexDirection="column"
        position="relative"
        borderRadius="xl"
        overflow="hidden"
        animation={`${fadeIn} 0.5s ease both`}
        boxShadow={`0 0 22px ${bgColor}88, 0 0 50px ${bgColor}55, 0 0 18px ${accent}44, 0 0 40px ${accent}22, inset 0 0 20px rgba(0,0,0,0.35)`}
      >
        {/* Fondo de la caja (foto de disciplina + velo) */}
        <Box
          position="absolute"
          inset="0"
          pointerEvents="none"
          zIndex={0}
          style={{ background: "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)" }}
        >
          <Box
            as="img"
            src={bgImage}
            alt=""
            loading="eager"
            position="absolute"
            inset="0"
            w="100%"
            h="100%"
            style={{ objectFit: "cover", objectPosition: "center", filter: "saturate(1.05)" }}
          />
          <Box position="absolute" inset="0" bg={`${bgColor}66`} />
        </Box>

        {/* Línea de luz superior */}
        <Box position="absolute" top="-1px" left="15%" right="15%" h="1px" zIndex={3}
             bgGradient={`linear(to-r, transparent, ${accent}aa, transparent)`} />

        {/* Área de contenido: foto (izq) + texto (der), como en Ilustraciones. */}
        <Flex
          ref={contentRef}
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "stretch" }}
          justify="center"
          gap={{ base: 5, md: 10 }}
          position="relative"
          zIndex={2}
          flex="1"
          minH={0}
          overflowY={{ base: "auto", md: "hidden" }}
          overflowX="hidden"
          px={{ base: 5, md: 10 }}
          py={{ base: 9, md: 10 }}
          sx={scrollbarSx}
        >
          {/* Foto */}
          <Box
            w={{ base: "90%", md: "380px" }}
            maxW={{ base: "300px", md: "380px" }}
            aspectRatio={1}
            flexShrink={0}
            alignSelf="center"
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            bg={`${accent}12`}
            sx={{ filter: `drop-shadow(0 0 12px rgba(255,255,255,0.14)) drop-shadow(0 0 30px ${accent}33)` }}
          >
            {!imgErr && foto ? (
              <Image src={encodeURI(foto)} alt={alt} w="100%" h="100%" objectFit="cover" onError={() => setImgErr(true)} />
            ) : (
              <Flex w="100%" h="100%" align="center" justify="center" textAlign="center" px={3}>
                {fotoFallback}
              </Flex>
            )}
          </Box>

          {/* Texto: título (lavanda, un poco más oscurito que el blanco) + línea + párrafos */}
          <Box
            ref={textRef}
            flex="1"
            minW={0}
            w={{ base: "100%", md: "auto" }}
            alignSelf={{ base: "auto", md: "stretch" }}
            maxH={{ base: "none", md: "100%" }}
            overflowY={{ base: "visible", md: "auto" }}
            overflowX="hidden"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            pt={{ base: 0, md: 1 }}
            pb={{ base: 0, md: 6 }}
            pr={{ base: 0, md: 4 }}
            sx={scrollbarSx}
          >
            <Text
              color={accent}
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight={700}
              fontFamily="'EB Garamond', serif"
              letterSpacing="0.02em"
              lineHeight="1.2"
              mb={{ base: 4, md: 5 }}
              textAlign={{ base: "center", md: "left" }}
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
            >
              {titulo}
            </Text>

            {/* Las 3 claves: cajas blancas apiladas con un punto de acento.
                Lo primero que se ve, para aprender la célula en 3-5 segundos. */}
            {claves && claves.length > 0 && (
              <Flex direction="column" gap={{ base: 2, md: 2.5 }} mb={{ base: 5, md: 6 }} w="100%">
                {claves.map((c, i) => (
                  <Flex
                    key={i}
                    align="center"
                    gap={3}
                    bg="rgba(255,255,255,0.96)"
                    borderRadius="lg"
                    px={{ base: 3.5, md: 4 }}
                    py={{ base: 2, md: 2.5 }}
                    boxShadow="0 2px 10px rgba(0,0,0,0.28)"
                  >
                    <Box flexShrink={0} w="8px" h="8px" borderRadius="full" bg={accent}
                         boxShadow={`0 0 8px ${accent}`} />
                    <Text color={bgColor} fontWeight={700} fontSize={{ base: "sm", md: "md" }}
                          lineHeight="1.3" letterSpacing="0.01em" fontFamily="'EB Garamond', serif"
                          textAlign="left">
                      {c}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            )}

            <Flex direction="column" gap={{ base: 5, md: 6 }}>
              {parrafos.map((p, i) => (
                <Text
                  key={i}
                  color={txtColor}
                  fontSize={{ base: "2xl", md: "3xl" }}
                  lineHeight="1.9"
                  letterSpacing="0.02em"
                  fontWeight="400"
                  fontFamily="'EB Garamond', serif"
                  textAlign={{ base: "center", md: "left" }}
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}
                >
                  {p}
                </Text>
              ))}
            </Flex>
          </Box>
        </Flex>

        {/* Línea de luz inferior */}
        <Box position="absolute" bottom="-1px" left="15%" right="15%" h="1px" zIndex={3}
             bgGradient={`linear(to-r, transparent, ${accent}aa, transparent)`} />

        {/* Contador discreto (abajo a la derecha) */}
        {contador && (
          <Text
            position="absolute"
            bottom={{ base: 2, md: 3 }}
            right={{ base: 3, md: 4 }}
            zIndex={3}
            color={`${accent}99`}
            fontSize={{ base: "xs", md: "sm" }}
            fontStyle="italic"
            letterSpacing="0.18em"
            pointerEvents="none"
            style={{ textShadow: "0 0 10px rgba(255,255,255,0.4)" }}
          >
            {contador}
          </Text>
        )}
      </Box>
    </Box>
  );
}

/* ─────────────────────────────────────────
   MODAL DE CÉLULA — usa la ficha común.
───────────────────────────────────────── */
export function CelulaModal({
  celula,
  onClose,
  celulas,
  onSelect,
}: {
  celula: Celula;
  onClose: () => void;
  /** Lista completa de células para poder navegar con flechas. */
  celulas?: Celula[];
  /** Cambia la célula mostrada (lo usan las flechas). */
  onSelect?: (c: Celula) => void;
}) {
  const puedeNavegar = !!celulas && celulas.length > 1 && !!onSelect;
  const idx = celulas ? celulas.findIndex((c) => c.id === celula.id) : -1;
  const salta = (d: number) => {
    if (!puedeNavegar || idx < 0) return;
    onSelect!(celulas![(idx + d + celulas!.length) % celulas!.length]);
  };

  return (
    <FichaFisioModal
      foto={celula.foto}
      alt={celula.nombre}
      titulo={celula.nombre}
      claves={celula.claves}
      parrafos={[celula.descripcion, celula.cuidados].filter(Boolean)}
      onClose={onClose}
      onPrev={puedeNavegar ? () => salta(-1) : undefined}
      onNext={puedeNavegar ? () => salta(1) : undefined}
    />
  );
}

/* ─────────────────────────────────────────
   CONSEJO — un titular (frase) que abre la ficha común.
───────────────────────────────────────── */
export interface Consejo {
  /** Frase titular que se ve en el box y arriba del modal. */
  titular: string;
  /** Texto largo que aparece a la derecha de la foto dentro del modal. */
  texto: React.ReactNode;
  /** Las 3 ideas clave de la curiosidad (resumen del texto). Se muestran en
   *  cajas blancas bajo el titular, para captarla en 3-5 s. */
  claves?: string[];
}

/* ─────────────────────────────────────────
   MODAL DE CONSEJO — usa la ficha común (mismo estilo que la célula).
───────────────────────────────────────── */
export function ConsejoModal({
  consejo,
  foto,
  label,
  onClose,
  consejos,
  onSelect,
}: {
  consejo: Consejo;
  /** Foto del órgano (la misma que aparece arriba en el panel). */
  foto: string;
  label: string;
  onClose: () => void;
  /** Lista completa de curiosidades del órgano, para navegar con flechas. */
  consejos?: Consejo[];
  /** Cambia la curiosidad mostrada (lo usan las flechas). */
  onSelect?: (c: Consejo) => void;
}) {
  const puedeNavegar = !!consejos && consejos.length > 1 && !!onSelect;
  const total = consejos?.length ?? 0;
  const idx = consejos ? consejos.findIndex((c) => c.titular === consejo.titular) : -1;
  const salta = (d: number) => {
    if (!puedeNavegar || idx < 0) return;
    onSelect!(consejos![(idx + d + total) % total]);
  };

  return (
    <FichaFisioModal
      foto={foto}
      alt={label}
      titulo={consejo.titular}
      claves={consejo.claves}
      parrafos={[consejo.texto]}
      onClose={onClose}
      onPrev={puedeNavegar ? () => salta(-1) : undefined}
      onNext={puedeNavegar ? () => salta(1) : undefined}
      contador={puedeNavegar ? `${idx + 1} / ${total}` : null}
      fotoFallback={
        <Text color={`${TXT}aa`} fontSize="xs" fontStyle="italic">Foto de {label} (próximamente)</Text>
      }
    />
  );
}
