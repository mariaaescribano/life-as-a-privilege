import React, { useEffect, useMemo, useRef, useState } from "react";
import { useT } from "../../i18n";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { COMIC_POR_QUE_EXISTE } from "./comicElMapa";
import { useComicElMapa } from "./comicElMapa.en";
import { MapaSeArma } from "./MapaSeArma";

// ─────────────────────────────────────────────────────────────────────────
// Bloque «¿Por qué existe Life as a Privilege?» de /elMetodo — DOS BOXES:
//
//   IZQUIERDA · el cómic. Título del cómic arriba, la acuarela cuadrada a todo
//     el ancho del box (entera, sin recortes y SIN velos encima: son acuarelas
//     claras y un velo se come justo lo que hay que ver) y debajo el texto de la
//     viñeta con las flechas y los puntitos.
//
//   DERECHA · el mapa que se arma (MapaSeArma). Empieza vacío; cada viñeta de
//     disciplina coloca su círculo en su sitio del anillo y en la viñeta de
//     cierre los ocho se unen. Se lee la historia y, al lado, se ve nacer el
//     producto: eso es lo que esta página tiene que contar.
//
// El estado vive AQUÍ (es el único sitio que sabe por qué viñeta va la lectura):
//   · `maxVisto` — la viñeta más lejana a la que se ha llegado. Lo colocado se
//     calcula de ahí, así que nunca se «descoloca» al volver atrás y, si se
//     salta con los puntitos, se coloca todo lo que quedaba por el camino.
//
// El guion (y qué disciplina coloca cada viñeta) está en comicElMapa.ts.
// ─────────────────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Respiración del hueco (viñetas sin acuarela todavía): el mandala late muy
// despacio, para que el hueco parezca una pausa y no un error.
const respirar = keyframes`
  0%, 100% { opacity: 0.20; transform: scale(1); }
  50%      { opacity: 0.34; transform: scale(1.05); }
`;

const total = COMIC_POR_QUE_EXISTE.length;
const indiceCierre = COMIC_POR_QUE_EXISTE.findIndex((v) => v.cierre);

// Flecha (‹ / ›) del mismo estilo blanco-luz que el resto de la página pública.
function FlechaComic({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const t = useT();
  return (
    <IconButton
      aria-label={t(dir === "prev" ? "elMetodo.comic.anterior" : "elMetodo.comic.siguiente")}
      onClick={disabled ? undefined : onClick}
      isDisabled={disabled}
      variant="ghost"
      borderRadius="full"
      w="38px"
      h="38px"
      minW="38px"
      bg="rgba(255,255,255,0.08)"
      border="1px solid rgba(255,255,255,0.5)"
      opacity={disabled ? 0.28 : 1}
      cursor={disabled ? "default" : "pointer"}
      boxShadow={disabled ? "none" : "0 0 14px rgba(255,255,255,0.24)"}
      _hover={disabled ? {} : {
        bg: "rgba(255,255,255,0.2)",
        borderColor: "white",
        boxShadow: "0 0 22px rgba(255,255,255,0.45), 0 0 44px rgba(180,255,245,0.26)",
      }}
      _focus={{ boxShadow: "none" }}
      _focusVisible={{ boxShadow: "0 0 0 2px rgba(255,255,255,0.6)" }}
      transition="all 0.25s ease"
      icon={
        <Box
          as="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          w="22px"
          h="22px"
          fill="#ffffff"
          style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 2px rgba(0,0,0,0.35))" }}
        >
          {dir === "prev" ? (
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          ) : (
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          )}
        </Box>
      }
    />
  );
}

export function ComicPorQueExiste() {
  const t = useT();
  // El guion en el idioma activo. Solo cambia la PROSA: las fotos, el orden y
  // la disciplina que coloca cada viñeta salen del español (COMIC_POR_QUE_EXISTE),
  // y por eso lo estructural de aquí abajo sigue leyéndose de él.
  const vinetas = useComicElMapa();
  const [index, setIndex] = useState(0);
  // Viñeta más lejana alcanzada: de aquí sale lo que está colocado en el mapa.
  const [maxVisto, setMaxVisto] = useState(0);
  const [cargadas, setCargadas] = useState<Record<number, boolean>>({});
  const [falladas, setFalladas] = useState<Record<number, boolean>>({});
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const vineta = vinetas[index];
  const esPrimera = index === 0;
  const esUltima = index === total - 1;
  // Número del rótulo = el PASO DEL MAPA, no la posición en el cómic: «El
  // comienzo» es el 0 (todavía no has empezado) y las ocho disciplinas van 1-8,
  // que es justo su índice porque el guion está en el orden del recorrido. Las
  // dos viñetas de cierre (el descubrimiento y Life as a Privilege) no son pasos
  // del recorrido, así que van sin número: numerarlas como 9 y 10 haría pensar
  // que el Mapa tiene diez disciplinas.
  const numerada = index === 0 || !!vineta.disciplina;
  // La ilustración de esta viñeta o no existe todavía (sin `src`) o falló.
  const sinFoto = !vineta.src || falladas[index];
  const fotoLista = !!vineta.src && cargadas[index];

  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setIndex((i) => Math.min(i + 1, total - 1));

  useEffect(() => { setMaxVisto((m) => Math.max(m, index)); }, [index]);

  // Lo colocado en el mapa: las disciplinas de todas las viñetas leídas hasta la
  // más lejana. Nunca se quita nada (volver atrás no desarma el mapa).
  const colocadas = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i <= maxVisto; i++) {
      const d = COMIC_POR_QUE_EXISTE[i]?.disciplina;
      if (d && !out.includes(d)) out.push(d);
    }
    return out;
  }, [maxVisto]);

  const completo = indiceCierre >= 0 && maxVisto >= indiceCierre;
  // Pieza que se nombra bajo el mapa: la de esta viñeta si coloca una, y si no,
  // la última que se colocó.
  const ultima = vineta.disciplina ?? colocadas[colocadas.length - 1];

  // Precarga de las vecinas: al pasar de viñeta la foto ya está en caché y entra
  // sin parpadeo (mismo criterio que ComicViewer).
  useEffect(() => {
    const vecinas = [index, index + 1, index + 2, index - 1].filter(
      (i) => i >= 0 && i < total,
    );
    const imgs: HTMLImageElement[] = [];
    vecinas.forEach((i) => {
      const src = COMIC_POR_QUE_EXISTE[i]?.src;
      if (!src) return;
      const img = new window.Image();
      img.onload = () => setCargadas((s) => (s[i] ? s : { ...s, [i]: true }));
      img.onerror = () => setFalladas((s) => (s[i] ? s : { ...s, [i]: true }));
      img.src = encodeURI(src);
      imgs.push(img);
    });
    return () => { imgs.forEach((img) => { img.onload = null; img.onerror = null; }); };
  }, [index]);

  // Swipe horizontal en móvil (el vertical sigue haciendo scroll de la página).
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
    <Flex
      direction={{ base: "column", md: "row" }}
      align={{ base: "center", md: "stretch" }}
      justify="center"
      gap={{ base: 10, md: 6, lg: 8 }}
      w="100%"
    >
      {/* ══ IZQUIERDA · EL CÓMIC ══ */}
      <Flex
        direction="column"
        // Contenido: el box es CUADRADO por la acuarela, así que su ancho es
        // también su alto. Con topes cortos (380/400) el bloque entero —cómic +
        // mapa— cabe de una vez en la pantalla de un portátil, que con 500 se
        // salía por abajo.
        w={{ base: "100%", md: "400px" }}
        maxW={{ base: "360px", md: "400px" }}
        flexShrink={0}
        borderRadius="2xl"
        overflow="hidden"
        border="1px solid rgba(255,255,255,0.28)"
        bg="rgba(255,255,255,0.07)"
        sx={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        boxShadow="0 4px 20px rgba(0,0,0,0.14), 0 0 24px rgba(180,255,245,0.10)"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Título del cómic. Va DENTRO del box y solo aquí: es el título de la
            historia, no de la sección, y en la página no se repite. Sin rayita
            debajo (los boxes con ilustración van sin ella). */}
        <Text
          color="white"
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "md", md: "lg" }}
          letterSpacing="0.02em"
          lineHeight="1.3"
          textAlign="center"
          px={{ base: 4, md: 5 }}
          py={{ base: 3, md: 4 }}
          flexShrink={0}
          textShadow="0 0 12px rgba(255,255,255,0.4), 0 0 26px rgba(180,255,245,0.18)"
        >
          {t("metodo.porQueExiste")}
        </Text>

        {/* ── LA ACUARELA (con el texto incrustado abajo) ──
            Cuadrada y a todo el ancho del box, de filo a filo. La ilustración es
            1:1, así que `cover` la enseña entera sin recortar nada. */}
        <Box position="relative" w="100%" aspectRatio={1} flexShrink={0} overflow="hidden">
          {!sinFoto && (
            <Image
              key={vineta.src}
              src={encodeURI(vineta.src!)}
              alt={vineta.titulo}
              position="absolute"
              inset="0"
              w="100%"
              h="100%"
              objectFit="cover"
              opacity={fotoLista ? 1 : 0}
              transition="opacity 0.5s ease"
              onLoad={() => setCargadas((s) => ({ ...s, [index]: true }))}
              onError={() => setFalladas((s) => ({ ...s, [index]: true }))}
            />
          )}

          {/* Hueco: mientras la acuarela descarga y en las viñetas que aún no la
              tienen. Sin avisos de «próximamente» (esto es una página de venta):
              solo el mandala latiendo despacio. */}
          {(sinFoto || !fotoLista) && (
            <Flex
              position="absolute"
              inset="0"
              align="center"
              justify="center"
              bgGradient="linear(to-b, #ffffff10, #ffffff04)"
              pointerEvents="none"
            >
              <Image
                src="/img/icono/life.png"
                alt=""
                w="38%"
                objectFit="contain"
                animation={`${respirar} 5s ease-in-out infinite`}
                style={{ filter: "drop-shadow(0 0 16px rgba(255,255,255,0.45))" }}
              />
            </Flex>
          )}

          {/* Velo del pie de la acuarela: sin él, el texto blanco se pierde en
              las zonas claras (son acuarelas muy luminosas). Va corto —el 52%
              de abajo— y con la parte alta casi transparente, para comerse lo
              menos posible del dibujo. Hex-alpha y no rgba(): en `bgGradient`
              las comas del rgba() rompen el degradado. */}
          <Box
            position="absolute"
            left={0}
            right={0}
            bottom={0}
            h="52%"
            pointerEvents="none"
            bgGradient="linear(to-t, #000000d6, #0000009e 42%, #00000047 74%, #00000000)"
          />

          {/* Texto de la viñeta, incrustado sobre la acuarela. Si alguna trajera
              más frases de las que caben, hace scroll en su franja en vez de
              subir y comerse la ilustración entera. */}
          <Flex
            key={index}
            position="absolute"
            left={0}
            right={0}
            bottom={0}
            direction="column"
            gap={{ base: 1.5, md: 2 }}
            px={{ base: 4, md: 5 }}
            pt={3}
            pb={{ base: 4, md: 5 }}
            maxH="70%"
            overflowY="auto"
            animation={`${fadeUp} 0.5s ease both`}
            sx={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.5) transparent",
              "&::-webkit-scrollbar": { width: "5px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.45)", borderRadius: "3px" },
            }}
          >
            <Text
              color="rgba(255,255,255,0.92)"
              fontSize="2xs"
              fontWeight="700"
              letterSpacing="0.18em"
              textTransform="uppercase"
              textShadow="0 1px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.7)"
            >
              {numerada ? `${index} · ${vineta.titulo}` : vineta.titulo}
            </Text>

            {vineta.lineas.map((linea) => (
              <Text
                key={linea}
                color="white"
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.55"
                letterSpacing="0.01em"
                // Sombra OSCURA (no el glow blanco del resto de la página): aquí
                // el texto va sobre la acuarela, y un halo blanco sobre zonas
                // claras lo dejaría ilegible.
                textShadow="0 1px 4px rgba(0,0,0,0.95), 0 2px 12px rgba(0,0,0,0.8), 0 0 18px rgba(0,0,0,0.6)"
              >
                {linea}
              </Text>
            ))}
          </Flex>
        </Box>

        {/* ── NAVEGACIÓN ──
            Debajo de la acuarela, en su propia franja: los puntitos y las
            flechas sobre el dibujo se perdían y encima tapaban más viñeta. */}
        <Flex
          direction="column"
          flex="1"
          justify="center"
          px={{ base: 4, md: 5 }}
          py={3}
        >
          <Flex align="center" justify="space-between" gap={3}>
            <FlechaComic dir="prev" onClick={goPrev} disabled={esPrimera} />

            <Flex align="center" gap="6px" flexWrap="wrap" justify="center">
              {vinetas.map((v, i) => (
                <Box
                  key={v.titulo}
                  as="button"
                  aria-label={t("elMetodo.comic.irA", { titulo: v.titulo })}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => setIndex(i)}
                  w={i === index ? "9px" : "6px"}
                  h={i === index ? "9px" : "6px"}
                  borderRadius="full"
                  bg={i === index ? "white" : "rgba(255,255,255,0.35)"}
                  boxShadow={i === index
                    ? "0 0 10px rgba(255,255,255,0.8), 0 0 22px rgba(180,255,245,0.5)"
                    : "none"}
                  cursor="pointer"
                  transition="all 0.25s ease"
                  _hover={{ bg: "white", boxShadow: "0 0 10px rgba(255,255,255,0.7)" }}
                  flexShrink={0}
                />
              ))}
            </Flex>

            <FlechaComic dir="next" onClick={goNext} disabled={esUltima} />
          </Flex>
        </Flex>
      </Flex>

      {/* ══ DERECHA · EL MAPA QUE SE ARMA ══
          Ancho PROPIO, no `flex=1`: con flex se quedaba con todo el sobrante del
          contenedor (1200 px) y, al centrar el anillo dentro de esa columna
          enorme, quedaba un hueco muerto entre los dos boxes. Ahora los dos
          miden lo que miden y la fila entera va centrada. */}
      <Flex
        w={{ base: "100%", md: "420px" }}
        maxW={{ base: "360px", md: "420px" }}
        flexShrink={0}
        align="center"
        justify="center"
      >
        <MapaSeArma colocadas={colocadas} completo={completo} ultima={ultima} />
      </Flex>
    </Flex>
  );
}

export default ComicPorQueExiste;
