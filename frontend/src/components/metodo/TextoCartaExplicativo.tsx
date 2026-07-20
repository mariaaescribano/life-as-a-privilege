import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import SpinnerTurquesa from "../global/Spinner";
import { comicLoaderPorColor } from "./comicLoaders";
import { astrologiaTxt } from "../../GlobalVariables";

/* ──────────────────────────────────────────────────────────────
   Viñetas del cómic "¿Qué es una carta astral?".
   Cambia `img` por las fotos que quieras y edita los textos.
   ────────────────────────────────────────────────────────────── */
const MAPA1 = "/viñetas/astrologia/astro/mapa1.png";
const MAPA2 = "/viñetas/astrologia/astro/mapa2.png";
const MAPA3 = "/viñetas/astrologia/astro/mapa3.png";
const MAPA4 = "/viñetas/astrologia/astro/mapa4.png";

const SPACE_IMG = "/img/astrologia/space.jpg";

/** Fotos del cómic de la carta, para poder precargarlas desde la página (que
 *  no aparezca la página hasta que la foto de la carta también esté lista). */
export const CARTA_MAPA_IMGS = [MAPA1, MAPA2, MAPA3, MAPA4];

const VINETAS: { img: string; texto: string }[] = [
  {
    img: MAPA1,
    texto: `Tu carta astral te muestra dónde se encuentran tus mayores capacidades, tus dones, tus dificultades y cuál es el propósito de tu Vida.

También revela tus heridas más profundas y dónde fueron creadas.`,
  },
  {
    img: MAPA1,
    texto: `Es importante recordar que nada de lo que aparece en tu carta es bueno o malo, ni hay nada que juzgar en ti o en ninguna otra persona.

Todo fue elegido por tu alma antes de nacer.

Por extensión, también fueron elegidas las experiencias, las heridas y las personas que te lo harían.`,
  },
  {
    img: MAPA2,
    texto: `En Astrología, las **Casas** muestran dónde ocurre, ocurrió o puede ocurrir una experiencia, y los **planetas** indican qué energía, función o aprendizaje está implicado.`,
  },
  {
    img: MAPA3,
    texto: `Los **Signos** revelan cómo se expresa esa energía y cuál es su cualidad.

Los **aspectos** muestran las relaciones entre las distintas energías de la carta: los impulsos, los bloqueos, los patrones repetitivos y los puntos donde conviene poner atención para desarrollar tu potencial y no perder de vista tus dones.`,
  },
  {
    img: MAPA4,
    texto: `La carta astral es tu “manual de instrucciones” para comprenderte mejor, reconocer tus dones, sanar tus heridas y recorrer tu camino con mayor consciencia.`,
  },
];

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 1; }
`;

/* Estrellas titilantes, idénticas a las del ComicViewer (Ilustraciones). */
const Stars = () => {
  const stars = [
    { top: "12%", left: "8%", size: 2, delay: "0s" },
    { top: "20%", left: "92%", size: 2, delay: "1.4s" },
    { top: "38%", left: "4%", size: 3, delay: "0.7s" },
    { top: "52%", left: "96%", size: 2, delay: "2.1s" },
    { top: "70%", left: "6%", size: 2, delay: "1.1s" },
    { top: "82%", left: "94%", size: 3, delay: "0.4s" },
    { top: "26%", left: "50%", size: 2, delay: "1.8s" },
    { top: "88%", left: "48%", size: 2, delay: "2.6s" },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <Box
          key={i}
          position="absolute"
          top={s.top}
          left={s.left}
          w={`${s.size}px`}
          h={`${s.size}px`}
          borderRadius="full"
          bg="white"
          animation={`${twinkle} 3.5s ease-in-out ${s.delay} infinite`}
          boxShadow="0 0 6px rgba(255,255,255,0.85), 0 0 14px rgba(180,255,245,0.55)"
          pointerEvents="none"
          zIndex={1}
        />
      ))}
    </>
  );
};

// Renderiza **negrita** con más brillo dentro del mismo color de acento.
function renderTexto(texto: string, color: string): React.ReactNode {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <Box as="span" key={i} fontWeight="700" style={{ textShadow: `0 0 12px ${color}cc, 0 0 28px ${color}77` }}>
        {p.slice(2, -2)}
      </Box>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    ),
  );
}

/** Botón circular de navegación (mismo estilo que las flechas del ComicViewer). */
const NavBtn = ({
  dir,
  color,
  onClick,
  disabled,
}: {
  dir: "izq" | "der";
  color: string;
  onClick: () => void;
  disabled: boolean;
}) => (
  <Box
    as="button"
    onClick={disabled ? undefined : onClick}
    aria-label={dir === "izq" ? "Anterior" : "Siguiente"}
    w={{ base: "44px", md: "52px" }}
    h={{ base: "44px", md: "52px" }}
    flexShrink={0}
    borderRadius="full"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bg="rgba(0,0,0,0.5)"
    border={`1px solid ${color}aa`}
    color={color}
    cursor={disabled ? "not-allowed" : "pointer"}
    opacity={disabled ? 0.3 : 1}
    boxShadow={disabled ? "none" : "0 2px 14px rgba(0,0,0,0.45)"}
    sx={{ backdropFilter: "blur(4px)" }}
    _hover={disabled ? {} : { bg: "rgba(0,0,0,0.72)", borderColor: color }}
    transition="all 0.18s"
  >
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      w={{ base: "22px", md: "26px" }}
      h={{ base: "22px", md: "26px" }}
      fill="#ffffff"
      style={{
        transform: dir === "der" ? "scaleX(-1)" : undefined,
        filter: `drop-shadow(0 0 6px ${color}) drop-shadow(0 1px 2px rgba(0,0,0,0.85))`,
      }}
    >
      <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
    </Box>
  </Box>
);

/** Cómic ilustrado de "¿Qué es una carta astral?" con EXACTAMENTE la misma caja
 *  que las Ilustraciones (ComicViewer): box con fondo espacial, líneas de luz,
 *  foto a la izquierda + texto grande a la derecha con altura máxima y SCROLL
 *  vertical interno. Lo único que se añade respecto a Ilustraciones es la barra
 *  de navegación INFERIOR (flechas + puntos) para pasar las fotos, ya que aquí
 *  no hay flechas fijas a los lados de la pantalla. Soporta swipe en móvil. */
export function TextoCartaExplicativo({ color = astrologiaTxt }: { color?: string }) {
  const [i, setI] = useState(0);
  const total = VINETAS.length;
  const v = VINETAS[i];
  const isFirst = i === 0;
  const isLast = i === total - 1;
  const textShadow = `0 0 4px ${color}aa, 0 0 9px ${color}66`;

  const textScrollRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});
  const [imgFailed, setImgFailed] = useState<Record<number, boolean>>({});
  // La foto de la viñeta manda: hasta que no ha cargado (o ha fallado) no se
  // pinta ni la imagen ni el texto — solo la animación de la disciplina.
  const imgReady = imgFailed[i] || imgLoaded[i];

  const goPrev = () => setI((n) => Math.max(0, n - 1));
  const goNext = () => setI((n) => Math.min(total - 1, n + 1));

  // Al cambiar de viñeta, el texto arranca siempre arriba (como el ComicViewer).
  useEffect(() => {
    if (textScrollRef.current) textScrollRef.current.scrollTop = 0;
  }, [i]);

  // Prefetch de la viñeta actual y sus vecinas: al avanzar, la foto ya está en
  // caché y no vuelve a salir la animación (salvo la primera, si aún descarga).
  useEffect(() => {
    const vecinas = [i, i + 1, i + 2, i - 1].filter((n) => n >= 0 && n < total);
    const imgs: HTMLImageElement[] = [];
    vecinas.forEach((n) => {
      const img = new window.Image();
      img.onload = () => setImgLoaded((s) => (s[n] ? s : { ...s, [n]: true }));
      img.onerror = () => setImgFailed((s) => (s[n] ? s : { ...s, [n]: true }));
      img.src = encodeURI(VINETAS[n].img);
      imgs.push(img);
    });
    return () => {
      imgs.forEach((img) => { img.onload = null; img.onerror = null; });
    };
  }, [i, total]);

  // Swipe horizontal (móvil): izquierda→siguiente, derecha→anterior.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) goPrev();
      else goNext();
    }
  };

  return (
    <Flex direction="column" align="center" gap={{ base: 6, md: 7 }} w="100%">
      {/* ── Caja idéntica a la de Ilustraciones (ComicViewer) ── */}
      <Box
        key={`box-${i}`}
        w="100%"
        maxW={{ base: "360px", md: "940px" }}
        h={{ base: "auto", md: "540px" }}
        maxH={{ base: "calc(100dvh - 96px)" }}
        display="flex"
        flexDirection="column"
        position="relative"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="none"
        animation={`${fadeIn} 0.55s ease both`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        sx={{ touchAction: "pan-y" }}
      >
        {/* Fondo de la caja (foto espacial + velo) */}
        <Box
          position="absolute"
          inset="0"
          pointerEvents="none"
          zIndex={0}
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)",
          }}
        >
          <Box
            as="img"
            src={SPACE_IMG}
            alt=""
            loading="eager"
            position="absolute"
            inset="0"
            w="100%"
            h="100%"
            style={{ objectFit: "cover", objectPosition: "center", opacity: 0.75 }}
          />
          <Box position="absolute" inset="0" bg="rgba(8,13,30,0.55)" />
        </Box>

        <Stars />

        {/* Línea de luz superior */}
        <Box
          position="absolute"
          top="-1px"
          left="15%"
          right="15%"
          h="1px"
          bgGradient={`linear(to-r, transparent, ${color}aa, transparent)`}
          zIndex={3}
        />

        {/* Área de contenido: foto (izq) + texto (der, con su propio scroll). */}
        <Flex
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
          // Móvil sin padding para que la foto sea hero (full-bleed) arriba; el
          // texto añade el suyo. Desktop, padding normal.
          px={{ base: 0, md: 10 }}
          py={{ base: 0, md: 10 }}
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: `${color}55`,
              borderRadius: "3px",
            },
          }}
        >
          {/* Mientras la foto no ha cargado: SOLO la animación de la disciplina
              (astrología). El <Image> oculto dispara onLoad/onError sin que se
              vea nada a medio pintar y sin pintar el texto todavía. */}
          {!imgReady && (
            <Flex
              flex="1"
              w="100%"
              minH={{ base: "42vh", md: "auto" }}
              align="center"
              justify="center"
            >
              {comicLoaderPorColor(color) ?? <SpinnerTurquesa fullScreen={false} color={color} />}
              <Image
                src={encodeURI(v.img)}
                alt=""
                position="absolute"
                w="1px"
                h="1px"
                opacity={0}
                pointerEvents="none"
                onLoad={() => setImgLoaded((s) => ({ ...s, [i]: true }))}
                onError={() => setImgFailed((s) => ({ ...s, [i]: true }))}
              />
            </Flex>
          )}

          {/* Foto (izquierda) — solo cuando la imagen ya está lista */}
          {imgReady && (
          <Box
            // Desktop: foto cuadrada MÁS GRANDE a la izquierda.
            // Móvil: hero image a todo el ancho que cubre la parte de arriba.
            w={{ base: "100%", md: "440px" }}
            maxW={{ base: "100%", md: "440px" }}
            h={{ base: "42vh", md: "auto" }}
            aspectRatio={{ base: "auto", md: 1 }}
            flexShrink={0}
            alignSelf={{ base: "stretch", md: "center" }}
            position="relative"
            filter={{
              base: "none",
              md: `drop-shadow(0 0 12px rgba(255,255,255,0.14)) drop-shadow(0 0 30px ${color}33)`,
            }}
          >
            {!imgFailed[i] ? (
              <Image
                src={encodeURI(v.img)}
                alt={`Viñeta ${i + 1}`}
                w="100%"
                h="100%"
                objectFit={{ base: "cover", md: "contain" }}
                borderRadius={{ base: 0, md: "lg" }}
              />
            ) : (
              <Flex
                w="100%"
                h="100%"
                align="center"
                justify="center"
                direction="column"
                gap={2}
                px={4}
                textAlign="center"
                bg="rgba(8,13,30,0.55)"
                border={`1px dashed ${color}44`}
                borderRadius="lg"
              >
                <Text fontSize="4xl">✨</Text>
                <Text color={`${color}cc`} fontSize="sm" fontStyle="italic">
                  Ilustración {i + 1} próximamente
                </Text>
              </Flex>
            )}
          </Box>
          )}

          {/* Texto (derecha) — grande, con su propio scroll vertical. Solo se
              pinta cuando la foto ya está cargada (o ha fallado). */}
          {imgReady && (
          <Box
            ref={textScrollRef}
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
            pt={{ base: 0, md: 6 }}
            pb={{ base: 9, md: 6 }}
            pl={{ base: 5, md: 0 }}
            pr={{ base: 5, md: 4 }}
            sx={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                background: `${color}55`,
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": { background: `${color}88` },
              scrollbarWidth: "thin",
              scrollbarColor: `${color}55 transparent`,
            }}
          >
            <Text
              color={color}
              fontSize={{ base: "2xl", md: "3xl" }}
              lineHeight="1.9"
              letterSpacing="0.02em"
              fontWeight="400"
              whiteSpace="pre-line"
              textAlign={{ base: "center", md: "left" }}
              style={{ textShadow }}
            >
              {renderTexto(v.texto, color)}
            </Text>
          </Box>
          )}
        </Flex>

        {/* Línea de luz inferior */}
        <Box
          position="absolute"
          bottom="-1px"
          left="15%"
          right="15%"
          h="1px"
          bgGradient={`linear(to-r, transparent, ${color}aa, transparent)`}
          zIndex={3}
        />
      </Box>

      {/* ── Barra inferior de navegación: flecha · puntos · (contador) · flecha ── */}
      <Flex align="center" justify="center" gap={{ base: 3, md: 4 }}>
        <NavBtn dir="izq" color={color} disabled={isFirst} onClick={goPrev} />

        <Flex align="center" justify="center" gap="6px">
          {VINETAS.map((_, n) => (
            <Box
              key={n}
              as="button"
              onClick={() => setI(n)}
              aria-label={`Viñeta ${n + 1}`}
              w={n === i ? "22px" : "9px"}
              h="9px"
              flexShrink={0}
              borderRadius="full"
              bg={n === i ? color : `${color}44`}
              transition="all 0.25s"
              style={n === i ? { boxShadow: `0 0 8px ${color}aa` } : undefined}
              cursor="pointer"
            />
          ))}
        </Flex>

        <Text
          display={{ base: "none", md: "block" }}
          color={`${color}cc`}
          fontSize="sm"
          fontStyle="italic"
          letterSpacing="0.14em"
          minW="48px"
          textAlign="center"
        >
          {i + 1} / {total}
        </Text>

        <NavBtn dir="der" color={color} disabled={isLast} onClick={goNext} />
      </Flex>
    </Flex>
  );
}
