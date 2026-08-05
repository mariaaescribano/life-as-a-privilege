import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

// Item genérico de la línea de tiempo. Sirve tanto para las ERAS (con época)
// como para los SUB-HITOS de una era (solo título, sin fecha). Por eso `anio`
// es opcional: si no viene, no se pinta la línea de la fecha.
export interface TimelineHito {
  key: string;
  titulo: string;
  anio?: string;
  foto?: string;
}

// ─────────────────────────────────────────────────────────────────────────
// Línea de tiempo de Cultura. Dos presentaciones según el dispositivo:
//
//   · ESCRITORIO: fila horizontal de círculos con su línea. Se muestran como
//     máximo 6 a la vez (si hay menos, esos); con las FLECHAS (debajo de la
//     línea, centradas) se pasa a los 6 siguientes/anteriores. Sin scroll.
//
//   · MÓVIL: lista VERTICAL (círculo a la izquierda + título a la derecha). Se
//     cargan de 6 en 6 según se hace scroll hacia abajo (scroll infinito), así
//     las fotos nuevas se piden solo cuando hacen falta.
// ─────────────────────────────────────────────────────────────────────────

const POR_PAGINA = 6;

// Círculo con la foto del hito (o un marcador si aún no hay foto). Es solo la
// parte visual: el click lo gestiona quien lo envuelve (para no anidar botones).
function CirculoVisual({
  hito,
  tinta,
  bg,
  size,
  iconSize,
  lazy = false,
}: {
  hito: TimelineHito;
  tinta: string;
  bg: string;
  size: Record<string, string> | string;
  iconSize: Record<string, string> | string;
  lazy?: boolean;
}) {
  const [imgErr, setImgErr] = useState(false);
  const hayFoto = !!hito.foto && !imgErr;
  return (
    <Box
      position="relative"
      zIndex={1}
      flexShrink={0}
      w={size}
      // El alto sale del ancho (`aspect-ratio`) y no de un `h` fijo: así el
      // círculo puede ser fluido (`100%` del hueco) sin dejar de ser redondo.
      sx={{ aspectRatio: "1 / 1" }}
      borderRadius="full"
      overflow="hidden"
      bg={bg}
      // Filo fino del acento de Cultura: recorta la foto contra el turquesa sin
      // convertirse en un marco. Discreto a propósito — 1,5px al 40 %.
      border={`1.5px solid ${tinta}66`}
      boxShadow={`0 0 18px ${tinta}55, 0 0 40px ${tinta}22`}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {hayFoto ? (
        <Image src={encodeURI(hito.foto!)} alt={hito.titulo} w="100%" h="100%" objectFit="cover"
               loading={lazy ? "lazy" : undefined} onError={() => setImgErr(true)} />
      ) : (
        // Marcador mientras no hay foto: un corazón suave con el acento.
        <Box
          as="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          w={iconSize}
          h={iconSize}
          fill={`${tinta}aa`}
          style={{ filter: `drop-shadow(0 0 8px ${tinta}66)` }}
        >
          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
        </Box>
      )}
    </Box>
  );
}

// Etiqueta (título + año) de un círculo en la vista de ESCRITORIO: va fuera del
// círculo, alternando arriba/abajo de la línea para que respire.
function Etiqueta({ hito, tinta, arriba }: { hito: TimelineHito; tinta: string; arriba: boolean }) {
  return (
    <Box
      position="absolute"
      left="50%"
      transform="translateX(-50%)"
      w={{ md: "140px", lg: "150px" }}
      textAlign="center"
      pointerEvents="none"
      {...(arriba ? { bottom: "calc(100% + 16px)" } : { top: "calc(100% + 16px)" })}
    >
      <Text
        color={tinta}
        fontSize={{ md: "sm", lg: "md" }}
        fontWeight="700"
        lineHeight="1.25"
        letterSpacing="0.02em"
        style={{ textShadow: `0 1px 3px #0c3c3cf5, 0 0 10px ${tinta}55` }}
      >
        {hito.titulo}
      </Text>
      {hito.anio && (
        <Text
          color={`${tinta}bb`}
          fontSize={{ md: "xs", lg: "sm" }}
          fontStyle="italic"
          letterSpacing="0.04em"
          mt={0.5}
          style={{ textShadow: `0 1px 3px #0c3c3cf5` }}
        >
          {hito.anio}
        </Text>
      )}
    </Box>
  );
}

// Flecha de paginación (chip circular con el acento). Van DEBAJO de la línea,
// centradas. Deshabilitada = no hay más por ese lado.
function FlechaNav({
  dir,
  tinta,
  bg,
  onClick,
  disabled,
}: {
  dir: "izq" | "der";
  tinta: string;
  bg: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Box
      as="button"
      aria-label={dir === "izq" ? "Anteriores" : "Siguientes"}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w={{ base: "44px", md: "48px" }}
      h={{ base: "44px", md: "48px" }}
      borderRadius="full"
      bg={bg}
      boxShadow={disabled ? "none" : `0 0 14px ${tinta}55, 0 2px 10px rgba(0,0,0,0.4)`}
      opacity={disabled ? 0.4 : 1}
      cursor={disabled ? "not-allowed" : "pointer"}
      transition="all 0.2s ease"
      _hover={disabled ? undefined : { transform: "scale(1.08)", boxShadow: `0 0 22px ${tinta}88, 0 2px 10px rgba(0,0,0,0.45)` }}
      _active={disabled ? undefined : { transform: "scale(1.02)" }}
    >
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w={{ base: "24px", md: "26px" }} h={{ base: "24px", md: "26px" }} fill={tinta}
           style={{ filter: disabled ? undefined : `drop-shadow(0 0 5px ${tinta}66)` }}>
        {dir === "izq"
          ? <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          : <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />}
      </Box>
    </Box>
  );
}

// ── Vista ESCRITORIO: 6 círculos por página + flechas de paginación abajo ─────
function TimelineDesktop({
  hitos,
  tinta,
  bg,
  onSelect,
}: {
  hitos: TimelineHito[];
  tinta: string;
  bg: string;
  onSelect: (key: string) => void;
}) {
  const [pagina, setPagina] = useState(0);
  const totalPaginas = Math.max(1, Math.ceil(hitos.length / POR_PAGINA));
  const paginaSeg = Math.min(pagina, totalPaginas - 1);
  const visibles = hitos.slice(paginaSeg * POR_PAGINA, paginaSeg * POR_PAGINA + POR_PAGINA);

  // TOPE del círculo, no su tamaño: los seis se reparten el ancho de la fila y
  // solo llegan hasta aquí. Antes eran medidas FIJAS y no encogían, así que en
  // cuanto la ventana no daba de sí (a 992px faltaban 100px, a 1280 faltaban
  // 36) la fila se salía y el primer círculo aparecía cortado. Ahora el tope
  // sube —son más grandes donde hay sitio— y donde no lo hay, se ajustan solos.
  const size = { base: "110px", md: "110px", lg: "154px", xl: "166px" };
  const iconSize = { base: "39px", md: "39px", lg: "52px", xl: "56px" };

  return (
    <Flex direction="column" align="center" w="100%" gap={{ base: 6, md: 7 }}>
      {/* Fila de círculos con su línea. py deja hueco para las etiquetas. */}
      <Box w="100%" position="relative" py={{ md: "96px", lg: "104px" }}>
        {/* Hueco y márgenes justos: cada píxel que se quita aquí se lo lleva el
            diámetro de los círculos, que es lo que se quiere ver. */}
        <Flex position="relative" align="center" justify="center"
              gap={{ base: 4, md: 4, lg: 4, xl: 5 }} px={{ base: 4, md: 4, lg: 2, xl: 4 }}>
          {/* Línea horizontal que une los círculos (solo si hay más de uno). */}
          {visibles.length > 1 && (
            <Box
              position="absolute"
              top="50%"
              left={{ base: 6, md: 10 }}
              right={{ base: 6, md: 10 }}
              h="2px"
              transform="translateY(-50%)"
              zIndex={0}
              style={{ background: `linear-gradient(90deg, transparent, ${tinta}88 12%, ${tinta}88 88%, transparent)` }}
            />
          )}

          {visibles.map((hito, i) => (
            <Box
              as="button"
              key={hito.key}
              onClick={() => onSelect(hito.key)}
              position="relative"
              // Reparto a partes iguales del ancho de la fila, con `size` de
              // tope. `minW={0}` es imprescindible: sin él, el mínimo
              // automático de flex impediría encoger y volveríamos al recorte.
              flex="1 1 0"
              minW={0}
              maxW={size}
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              transition="transform 0.22s ease"
              _hover={{ transform: "scale(1.06)" }}
              _active={{ transform: "scale(1.02)" }}
            >
              <Etiqueta hito={hito} tinta={tinta} arriba={i % 2 === 0} />
              {/* `100%`: el círculo llena el hueco que le ha tocado al botón,
                  que es quien lleva el tope. */}
              <CirculoVisual hito={hito} tinta={tinta} bg={bg} size="100%" iconSize={iconSize} />
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Flechas de paginación, centradas debajo de la línea. */}
      {totalPaginas > 1 && (
        <Flex align="center" justify="center" gap={{ base: 5, md: 6 }}>
          <FlechaNav dir="izq" tinta={tinta} bg={bg} disabled={paginaSeg === 0}
                     onClick={() => setPagina((p) => Math.max(0, p - 1))} />
          <FlechaNav dir="der" tinta={tinta} bg={bg} disabled={paginaSeg >= totalPaginas - 1}
                     onClick={() => setPagina((p) => Math.min(totalPaginas - 1, p + 1))} />
        </Flex>
      )}
    </Flex>
  );
}

// ── Vista MÓVIL: lista vertical (círculo izq + título der) con scroll infinito ─
function TimelineMovil({
  hitos,
  tinta,
  bg,
  onSelect,
}: {
  hitos: TimelineHito[];
  tinta: string;
  bg: string;
  onSelect: (key: string) => void;
}) {
  // Empezamos mostrando la primera «ronda»; al llegar al final (sentinela) se
  // añaden otros tantos, y así sus fotos se cargan solo al ir bajando.
  const [visibles, setVisibles] = useState(Math.min(POR_PAGINA, hitos.length));
  const sentinelaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibles >= hitos.length) return;
    const el = sentinelaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibles((c) => Math.min(c + POR_PAGINA, hitos.length));
        }
      },
      { rootMargin: "240px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visibles, hitos.length]);

  return (
    <Flex direction="column" w="100%" maxW="520px" mx="auto" gap={3}>
      {hitos.slice(0, visibles).map((hito) => (
        <Flex
          as="button"
          key={hito.key}
          onClick={() => onSelect(hito.key)}
          align="center"
          gap={4}
          w="100%"
          textAlign="left"
          borderRadius="2xl"
          p={2.5}
          transition="all 0.2s ease"
          _hover={{ bg: `${tinta}12` }}
          _active={{ transform: "scale(0.99)" }}
        >
          <CirculoVisual hito={hito} tinta={tinta} bg={bg}
                         size={{ base: "137px" }} iconSize={{ base: "48px" }} lazy />
          <Box flex="1" minW={0}>
            <Text color={tinta} fontSize="md" fontWeight="700" lineHeight="1.3"
                  letterSpacing="0.02em" style={{ textShadow: `0 1px 3px #0c3c3cf5, 0 0 10px ${tinta}55` }}>
              {hito.titulo}
            </Text>
            {hito.anio && (
              <Text color={`${tinta}bb`} fontSize="sm" fontStyle="italic" mt={0.5}
                    style={{ textShadow: `0 1px 3px #0c3c3cf5` }}>
                {hito.anio}
              </Text>
            )}
          </Box>
        </Flex>
      ))}

      {/* Sentinela: al entrar en pantalla, carga la siguiente tanda. */}
      {visibles < hitos.length && <Box ref={sentinelaRef} h="1px" w="100%" />}
    </Flex>
  );
}

// ¿Estamos en móvil? (< md = 48em de Chakra). Vía matchMedia para no renderizar
// las dos vistas a la vez (evita que se pidan fotos de la vista oculta).
function useEsMovil(): boolean | null {
  const [esMovil, setEsMovil] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 47.99em)");
    const on = () => setEsMovil(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return esMovil;
}

export function LineaTiempoCultura({
  hitos,
  tinta,
  bg,
  onSelect,
}: {
  hitos: TimelineHito[];
  tinta: string;
  bg: string;
  onSelect: (key: string) => void;
}) {
  const esMovil = useEsMovil();
  // Mientras no sabemos el tamaño (primer frame), reservamos algo de alto para
  // que no dé un salto al aparecer la vista correcta.
  if (esMovil === null) return <Box w="100%" minH="200px" />;
  return esMovil
    ? <TimelineMovil hitos={hitos} tinta={tinta} bg={bg} onSelect={onSelect} />
    : <TimelineDesktop hitos={hitos} tinta={tinta} bg={bg} onSelect={onSelect} />;
}
