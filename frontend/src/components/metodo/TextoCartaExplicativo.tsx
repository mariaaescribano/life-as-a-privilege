import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { comicLoaderPorColor } from "./comicLoaders";
import { StarsLayer } from "../global/StarsLayer";
import { glowHeader } from "./FotoBox";
import { astrologiaTxt } from "../../GlobalVariables";

/* ──────────────────────────────────────────────────────────────
   Viñetas del cómic "¿Qué es una carta astral?".
   Cambia `img` por las fotos que quieras y edita los textos.
   ────────────────────────────────────────────────────────────── */
const MAPA1 = "/viñetas/astrologia/astro/mapa1.webp";
const MAPA2 = "/viñetas/astrologia/astro/mapa2.webp";
const MAPA3 = "/viñetas/astrologia/astro/mapa3.webp";
const MAPA4 = "/viñetas/astrologia/astro/mapa4.webp";

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
    texto: `En Astrología, las **Casas** muestran dónde ocurre, ocurrió o puede ocurrir una experiencia.
    
    Los **Planetas** indican qué energía, función o aprendizaje está implicado.`,
  },
  {
    img: MAPA3,
    texto: `Los **Signos** revelan cómo se expresa esa energía y cuál es su cualidad.

    Los **Aspectos** muestran las relaciones entre las distintas energías de la carta: los impulsos, los bloqueos, los patrones repetitivos y los puntos donde conviene poner atención para desarrollar tu potencial y no perder de vista tus dones.`,
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

// Renderiza **negrita** (sin brillo: solo peso de fuente).
function renderTexto(texto: string): React.ReactNode {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <Box as="span" key={i} fontWeight="700">
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
    w={{ base: "48px", md: "57px" }}
    h={{ base: "48px", md: "57px" }}
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
    // Mismo halo que el header y que la caja: nada de sombra negra plana.
    boxShadow={disabled ? "none" : glowHeader(color)}
    sx={{ backdropFilter: "blur(4px)" }}
    _hover={disabled ? {} : { bg: "rgba(0,0,0,0.72)", borderColor: color }}
    transition="all 0.18s"
  >
    <Box
      as="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      w={{ base: "24px", md: "29px" }}
      h={{ base: "24px", md: "29px" }}
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
    <Flex direction="row" align="center" justify="center" gap={{ base: 2, md: 4 }} w="100%">
      {/* Flecha anterior — FUERA de la caja, a su izquierda. */}
      <NavBtn dir="izq" color={color} disabled={isFirst} onClick={goPrev} />

      {/* ── Caja (misma estética que Ilustraciones), ahora más pequeña ── */}
      <Box
        key={`box-${i}`}
        flex="1"
        minW={0}
        w="100%"
        // En móvil ocupa el hueco entre las dos flechas. En escritorio, un 10%
        // más grande que la caja original (860×380) para que no se quede corta.
        maxW={{ base: "100%", md: "946px" }}
        h={{ base: "auto", md: "418px" }}
        maxH={{ base: "calc(100dvh - 96px)" }}
        display="flex"
        flexDirection="column"
        position="relative"
        borderRadius="xl"
        overflow="hidden"
        // EXACTAMENTE el glow del header (glowHeader): todos los boxes de la
        // página tienen que brillar igual.
        boxShadow={glowHeader(color)}
        animation={`${fadeIn} 0.55s ease both`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        sx={{ touchAction: "pan-y" }}
      >
        {/* Fondo de la caja: EL MISMO que el header y el resto de cajas de
            Astrología (StarsLayer: cielo al 85% + velo azul oscuro). Aquí iba la
            foto tal cual, a opacidad plena y sin velo, y la caja salía cargadísima
            de estrellas —la nebulosa competía con la ilustración de la carta y
            con la letra— mientras el header, justo encima, se veía tranquilo. */}
        <StarsLayer borderRadius="xl" />

        {/* Línea de luz superior */}
        <Box
          position="absolute"
          top="-1px"
          left="15%"
          right="15%"
          h="1px"
          bgGradient={`linear(to-r, transparent, ${color}55, transparent)`}
          zIndex={3}
        />

        {/* Área de contenido: foto (izq) + texto (der, con su propio scroll). */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "stretch" }}
          justify="center"
          gap={{ base: 5, md: 6, lg: 10 }}
          position="relative"
          zIndex={2}
          flex="1"
          minH={0}
          overflowY={{ base: "auto", md: "hidden" }}
          overflowX="hidden"
          // Móvil sin padding para que la foto sea hero (full-bleed) arriba; el
          // texto añade el suyo. Desktop: padding a la izquierda, pero NINGUNO a
          // la derecha — así la columna de texto llega hasta la pared de la caja
          // y su barra de scroll queda pegada al borde, sin flotar sobre el texto.
          pl={{ base: 0, md: 6, lg: 10 }}
          pr={0}
          py={{ base: 0, md: 7, lg: 10 }}
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
              {comicLoaderPorColor(color)}
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
            // Desktop: foto cuadrada MÁS GRANDE a la izquierda (290px + 10%).
            // Móvil: hero image a todo el ancho que cubre la parte de arriba.
            // Entre 768px y 992px la caja no da para 319px de foto + texto
            // grande: la columna de texto se quedaba en ~290px y el párrafo se
            // partía en líneas de 3 palabras que ya no cabían en los 418px de
            // alto. La foto grande sólo a partir de `lg`.
            w={{ base: "100%", md: "236px", lg: "319px" }}
            maxW={{ base: "100%", md: "236px", lg: "319px" }}
            // La carta es una rueda: la foto va SIEMPRE cuadrada (también en
            // móvil, donde antes era un hero de 42vh y salía rectangular).
            h="auto"
            aspectRatio={1}
            flexShrink={0}
            alignSelf={{ base: "stretch", md: "center" }}
            position="relative"
            // La ilustración trae aire de sobra dentro del propio archivo, así
            // que la acercamos con un zoom (abajo) y recortamos aquí lo que se
            // sale: el marco queda lleno y la rueda se ve grande.
            overflow="hidden"
            borderRadius={{ base: 0, md: "lg" }}
            // Brillo alrededor de la carta SOLO en escritorio, donde la foto va
            // al lado del texto y tiene aire por los cuatro costados para que el
            // halo se vea. En móvil es un hero a todo el ancho: el resplandor se
            // recortaría contra los bordes de la caja y se vería como una mancha.
            filter={{
              base: "none",
              md: `drop-shadow(0 0 10px rgba(255,255,255,0.22)) drop-shadow(0 0 26px ${color}4c) drop-shadow(0 0 54px ${color}26)`,
            }}
          >
            {!imgFailed[i] ? (
              <Image
                src={encodeURI(v.img)}
                alt={`Viñeta ${i + 1}`}
                w="100%"
                h="100%"
                objectFit="cover"
                borderRadius={{ base: 0, md: "lg" }}
                // Zoom del 18%: la rueda de la carta llena el marco en vez de
                // quedarse pequeña con el margen que trae la propia ilustración.
                // Lo que sobra lo recorta el `overflow: hidden` del contenedor.
                sx={{ transform: { base: "scale(1.06)", md: "scale(1.18)" } }}
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
                {/* Sin emoji: si no hay ilustración, solo el aviso en texto. */}
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
            // pl > 0 SIEMPRE: si el texto arranca pegado al borde, su glow
            // (textShadow) se recorta en seco contra el overflowX:hidden y deja
            // una raya vertical de luz cortada a la izquierda. El padding le da
            // aire para que el halo respire sin cortarse.
            pl={{ base: 5, md: 4 }}
            // En desktop este box llega hasta la pared derecha de la caja, así
            // que la barra de scroll se dibuja pegada al borde; el padding es el
            // aire entre el TEXTO y la barra (nunca se solapan).
            pr={{ base: 5, md: 8 }}
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
              // Un punto menos que el ComicViewer de Ilustraciones: aquí la caja
              // va incrustada en la página (380px de alto), no a pantalla
              // completa, así que a 3xl las viñetas largas obligaban a hacer
              // demasiado scroll dentro del box.
              // 10% más grande que el original (xl / 2xl → 1.375rem / 1.65rem).
              // En `md` (768–992px) el texto vive en una columna estrecha: a
              // 1.65rem salían líneas de 3 palabras y el párrafo se cortaba.
              fontSize={{ base: "1.375rem", md: "1.25rem", lg: "1.65rem" }}
              lineHeight={{ base: "1.8", md: "1.65", lg: "1.8" }}
              letterSpacing="0.02em"
              fontWeight="400"
              whiteSpace="pre-line"
              textAlign={{ base: "center", md: "left" }}
            >
              {renderTexto(v.texto)}
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
          bgGradient={`linear(to-r, transparent, ${color}55, transparent)`}
          zIndex={3}
        />

      </Box>

      {/* Flecha siguiente — FUERA de la caja, a su derecha. */}
      <NavBtn dir="der" color={color} disabled={isLast} onClick={goNext} />
    </Flex>
  );
}
