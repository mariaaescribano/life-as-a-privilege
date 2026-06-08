import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

/* ──────────────────────────────────────────────────────────────
   Viñetas del cómic "¿Qué es una carta astral?".
   Cambia `img` por las fotos que quieras y edita los textos.
   ────────────────────────────────────────────────────────────── */
const MAPA = "/viñetas/astrologia/astro/mapa.png";
const ASPECTOS = "/viñetas/astrologia/astro/aspectos.png";
const FINAL = "/viñetas/astrologia/astro/viñeta13.png";

const VINETAS: { img: string; texto: string }[] = [
  {
    img: MAPA,
    texto: "Tu carta astral te muestra dónde se encuentran tus mayores capacidades, tus dones, tus dificultades y cuál es el propósito de tu experiencia en esta vida. También revela tus heridas más profundas y dónde fueron creadas.",
  },
  {
    img: MAPA,
    texto: "Es importante recordar que nada de lo que aparece en tu carta es bueno o malo, ni hay nada que juzgar en ti o en ninguna otra persona. Todo fue elegido por tu alma antes de nacer. Por extensión, también fueron elegidas las experiencias, las heridas y las personas que te lo harían.",
  },
  {
    img: ASPECTOS,
    texto: "En astrología, las **casas** muestran dónde ocurre, ocurrió o puede ocurrir una experiencia, y los **planetas** indican qué energía, función o aprendizaje está implicado.",
  },
  {
    img: ASPECTOS,
    texto: "Los **signos** revelan cómo se expresa esa energía y cuál es su cualidad. Los **aspectos** muestran las relaciones entre las distintas energías de la carta: los impulsos, los bloqueos, los patrones repetitivos y los puntos donde conviene poner atención para desarrollar tu potencial y no perder de vista tus dones.",
  },
  {
    img: FINAL,
    texto: "La carta astral es tu mapa para comprenderte mejor, reconocer tus talentos, sanar tus heridas y recorrer tu camino con mayor consciencia.",
  },
];

// Renderiza **negrita** en el color de acento.
function renderTexto(texto: string, color: string): React.ReactNode {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <Box as="span" key={i} fontWeight="700" color={color} style={{ textShadow: `0 0 10px ${color}88` }}>
        {p.slice(2, -2)}
      </Box>
    ) : (
      <React.Fragment key={i}>{p}</React.Fragment>
    ),
  );
}

const Flecha = ({ dir, color, onClick, disabled }: { dir: "izq" | "der"; color: string; onClick: () => void; disabled: boolean }) => (
  <Box as="button" onClick={disabled ? undefined : onClick} aria-label={dir === "izq" ? "Anterior" : "Siguiente"}
       w="36px" h="36px" borderRadius="full" display="flex" alignItems="center" justifyContent="center"
       border={`1px solid ${color}55`} bg="rgba(255,255,255,0.04)" color={color}
       cursor={disabled ? "not-allowed" : "pointer"} opacity={disabled ? 0.3 : 1}
       _hover={disabled ? {} : { bg: "rgba(255,255,255,0.12)", borderColor: color }} transition="all 0.18s">
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="18px" h="18px" fill="currentColor"
         style={{ transform: dir === "der" ? "scaleX(-1)" : undefined }}>
      <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
    </Box>
  </Box>
);

/** Carrusel ilustrado de "¿Qué es una carta astral?": foto izq + texto dcha + navegación. */
export function TextoCartaExplicativo({ color }: { color: string }) {
  const [i, setI] = useState(0);
  const total = VINETAS.length;
  const v = VINETAS[i];
  const glow = `0 1px 3px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.45), 0 0 24px ${color}55`;

  return (
    <Flex direction="column" gap={6} w="100%">
      {/* foto protagonista (centrada) + texto en columna estrecha/vertical */}
      <Flex direction={{ base: "column", md: "row" }} align="center" justify="center" gap={{ base: 5, md: 8 }} minH={{ md: "360px" }}>
        <Image
          src={v.img}
          alt=""
          flexShrink={0}
          w={{ base: "100%", md: "380px" }}
          maxW={{ base: "340px", md: "380px" }}
          borderRadius="xl"
          border={`1px solid ${color}33`}
          style={{ boxShadow: `0 0 18px ${color}22, 0 6px 22px rgba(0,0,0,0.35)` }}
        />
        <Flex align="center" w={{ base: "100%", md: "260px" }} flexShrink={0} minH={{ md: "320px" }}>
          <Text color="#ffffff" fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" whiteSpace="pre-line" style={{ textShadow: glow }}>
            {renderTexto(v.texto, color)}
          </Text>
        </Flex>
      </Flex>

      {/* navegación: flecha · puntos · flecha */}
      <Flex align="center" justify="center" gap={4}>
        <Flecha dir="izq" color={color} disabled={i === 0} onClick={() => setI((n) => Math.max(0, n - 1))} />
        <Flex align="center" gap={2}>
          {VINETAS.map((_, n) => (
            <Box key={n} as="button" onClick={() => setI(n)} aria-label={`Viñeta ${n + 1}`}
                 w={n === i ? "22px" : "9px"} h="9px" borderRadius="full"
                 bg={n === i ? color : `${color}44`} transition="all 0.25s"
                 style={n === i ? { boxShadow: `0 0 8px ${color}aa` } : undefined} cursor="pointer" />
          ))}
        </Flex>
        <Flecha dir="der" color={color} disabled={i === total - 1} onClick={() => setI((n) => Math.min(total - 1, n + 1))} />
      </Flex>
    </Flex>
  );
}
