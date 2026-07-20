import React, { useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

/* ──────────────────────────────────────────────────────────────
   Viñetas del cómic "¿Qué es una carta astral?".
   Cambia `img` por las fotos que quieras y edita los textos.
   ────────────────────────────────────────────────────────────── */
const MAPA1 = "/viñetas/astrologia/astro/mapa1.png";
const MAPA2 = "/viñetas/astrologia/astro/mapa2.png";
const MAPA3 = "/viñetas/astrologia/astro/mapa3.png";
const MAPA4 = "/viñetas/astrologia/astro/mapa4.png";

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

/** Carrusel ilustrado de "¿Qué es una carta astral?" con el MISMO formato que las
 *  Ilustraciones: foto a la izquierda + texto grande a la derecha, y navegación en
 *  una barra inferior (flechas + puntos) con soporte de swipe en móvil. */
export function TextoCartaExplicativo({ color }: { color: string }) {
  const [i, setI] = useState(0);
  const total = VINETAS.length;
  const v = VINETAS[i];
  const isFirst = i === 0;
  const isLast = i === total - 1;
  const glow = `0 1px 4px rgba(0,0,0,0.6), 0 0 12px rgba(255,255,255,0.35), 0 0 26px ${color}55`;

  const goPrev = () => setI((n) => Math.max(0, n - 1));
  const goNext = () => setI((n) => Math.min(total - 1, n + 1));

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
    <Flex direction="column" gap={{ base: 6, md: 7 }} w="100%">
      {/* Contenido: foto izquierda (en marco cuadrado) + texto grande derecha.
          En móvil se apila (foto arriba, texto debajo). Swipe para navegar. */}
      <Flex
        key={i}
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="center"
        gap={{ base: 5, md: 10 }}
        minH={{ md: "360px" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        sx={{ touchAction: "pan-y" }}
      >
        {/* Foto (izquierda) — marco cuadrado con glow, como en las Ilustraciones */}
        <Box
          w={{ base: "90%", md: "380px" }}
          maxW={{ base: "320px", md: "380px" }}
          aspectRatio={1}
          flexShrink={0}
          alignSelf="center"
          position="relative"
          sx={{
            filter: `
              drop-shadow(0 0 12px rgba(255,255,255,0.14))
              drop-shadow(0 0 30px ${color}33)
            `,
          }}
        >
          <Image
            src={v.img}
            alt=""
            w="100%"
            h="100%"
            objectFit="cover"
            borderRadius="lg"
            border={`1px solid ${color}33`}
          />
        </Box>

        {/* Texto (derecha) — grande, como las viñetas del cómic */}
        <Box flex="1" minW={0} w={{ base: "100%", md: "auto" }}>
          <Text
            color={color}
            fontSize={{ base: "xl", md: "2xl" }}
            lineHeight="1.9"
            letterSpacing="0.02em"
            fontWeight="400"
            whiteSpace="pre-line"
            textAlign={{ base: "center", md: "left" }}
            style={{ textShadow: glow }}
          >
            {renderTexto(v.texto, color)}
          </Text>
        </Box>
      </Flex>

      {/* Barra inferior: flecha · puntos · flecha (con contador en escritorio) */}
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
