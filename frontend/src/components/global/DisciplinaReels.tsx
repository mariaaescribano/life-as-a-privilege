import React, { useEffect, useState } from "react";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "./DisciplinaBgLayer";
import { getReelsDisciplina, type ReelVideo } from "../../hardCoded/reels";

/* ════════════════════════════════════════════════════════════════
   DISCIPLINA REELS
   3/4 reels (vídeos verticales) por disciplina. Cada vídeo va en su
   PROPIA tarjeta-box, con la foto de la disciplina como fondo.
   Tarjeta: portada vertical 9:16 → título → "Ver vídeo →".
   Al pulsar, abre un reproductor modal con el reel reproduciéndose.
═══════════════════════════════════════════════════════════════════ */

/* ─── Iconos ─── */
const PlayIcon = ({ size = "26px", color = "white" }: { size?: string; color?: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" w={size} h={size}>
    <polygon points="7,4 21,12 7,20" fill={color} />
  </Box>
);

const ArrowIcon = ({ color = "currentColor" }: { color?: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="14px" h="14px" fill={color}>
    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
  </Box>
);

/** Extrae el ID de YouTube de una URL embed (…/embed/VIDEO_ID). */
function youtubeId(embedUrl: string): string | null {
  return embedUrl.match(/\/embed\/([^?&/]+)/)?.[1] ?? null;
}

/* ─── Portada del reel (imagen propia → miniatura de YouTube → placeholder) ─── */
function ReelPortada({ reel, color }: { reel: ReelVideo; color: string }) {
  const [imgErr, setImgErr] = useState(false);
  const ytId = youtubeId(reel.embedUrl);
  // Si no hay portada propia, usamos la miniatura del vídeo (16:9 recortada a 9:16).
  const cover = reel.portada || (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : "");
  const showImg = cover && !imgErr;

  return (
    <Box position="relative" w="100%" h="100%">
      {showImg ? (
        <Image
          src={reel.portada ? encodeURI(reel.portada) : cover}
          alt={reel.titulo}
          w="100%"
          h="100%"
          objectFit="cover"
          onError={() => setImgErr(true)}
        />
      ) : (
        <Flex
          w="100%"
          h="100%"
          align="center"
          justify="center"
          bg={`linear-gradient(160deg, ${color}44 0%, rgba(0,0,0,0.55) 100%)`}
        >
          <Text fontSize="11px" color="rgba(255,255,255,0.75)" letterSpacing="0.14em" fontStyle="italic">
            Próximamente
          </Text>
        </Flex>
      )}

      {/* Velo inferior */}
      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 45%)"
        pointerEvents="none"
      />
    </Box>
  );
}

/* ─── Tarjeta de un reel: box con la foto de la disciplina de fondo ─── */
function ReelCard({
  reel,
  nom,
  color,
  onOpen,
}: {
  reel: ReelVideo;
  nom: string;
  color: string;
  onOpen: () => void;
}) {
  return (
    <Box
      as="button"
      onClick={onOpen}
      role="group"
      textAlign="left"
      position="relative"
      overflow="hidden"
      borderRadius="2xl"
      border={`1px solid ${color}33`}
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      boxShadow={`0 4px 18px rgba(0,0,0,0.22), 0 0 16px ${color}26`}
      transition="all 0.22s ease"
      h="100%"
      _hover={{
        transform: "translateY(-4px)",
        borderColor: `${color}88`,
        boxShadow: `0 12px 32px rgba(0,0,0,0.3), 0 0 26px ${color}55`,
      }}
      _active={{ transform: "translateY(-1px)" }}
    >
      {/* Fondo: foto de la disciplina */}
      <DisciplinaBgLayer nom={nom} borderRadius="2xl" />

      <Flex direction="column" position="relative" zIndex={1} p={{ base: 3, md: 4 }} gap={3} h="100%">
        {/* Portada vertical 3:4 (encaja la imagen de portada sin recortarla) */}
        <Box
          position="relative"
          w="100%"
          sx={{ aspectRatio: "3 / 4" }}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="0 6px 20px rgba(0,0,0,0.35)"
          flexShrink={0}
        >
          <ReelPortada reel={reel} color={color} />
        </Box>

        {/* Título — altura fija de 2 líneas para que todas las tarjetas midan igual */}
        <Text
          color={color}
          fontWeight="700"
          fontSize={{ base: "sm", md: "md" }}
          textAlign="center"
          lineHeight="1.3"
          letterSpacing="0.02em"
          noOfLines={2}
          minH="2.6em"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.65), 0 0 10px rgba(0,0,0,0.45)" }}
        >
          {reel.titulo}
        </Text>

        {/* Ver vídeo → */}
        <Flex
          align="center"
          justify="center"
          gap={1.5}
          mt="auto"
          pt={1}
          color={color}
          fontSize={{ base: "xs", md: "sm" }}
          fontStyle="italic"
          letterSpacing="0.06em"
          transition="gap 0.22s ease"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
          _groupHover={{ gap: 2.5 }}
        >
          <Text as="span">Ver vídeo</Text>
          <ArrowIcon />
        </Flex>
      </Flex>
    </Box>
  );
}

/* ─── Reproductor modal (reel vertical 9:16) ─── */
function ReelModal({
  reel,
  color,
  onClose,
}: {
  reel: ReelVideo;
  color: string;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={1300}
      bg="rgba(0,0,0,0.78)"
      sx={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 8 }}
      onClick={onClose}
      fontFamily="'EB Garamond', serif"
    >
      {/* Botón cerrar */}
      <Box
        as="button"
        position="absolute"
        top={{ base: 4, md: 6 }}
        right={{ base: 4, md: 6 }}
        w="40px"
        h="40px"
        borderRadius="full"
        bg="rgba(255,255,255,0.12)"
        border="1px solid rgba(255,255,255,0.35)"
        color="white"
        fontSize="18px"
        fontWeight="700"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        transition="all 0.18s"
        _hover={{ bg: "rgba(255,255,255,0.24)" }}
        onClick={onClose}
        zIndex={2}
      >
        ✕
      </Box>

      <Flex
        direction="column"
        align="center"
        gap={5}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Contenedor 9:16 — escala con la altura de pantalla */}
        <Box
          h={{ base: "76vh", md: "82vh" }}
          maxH="800px"
          maxW="92vw"
          sx={{ aspectRatio: "9 / 16" }}
          borderRadius="2xl"
          overflow="hidden"
          border={`1px solid ${color}55`}
          boxShadow={`0 24px 70px rgba(0,0,0,0.55), 0 0 30px ${color}44`}
          bg="rgba(0,0,0,0.6)"
          position="relative"
        >
          {reel.embedUrl ? (
            <iframe
              src={reel.embedUrl + (reel.embedUrl.includes("?") ? "&" : "?") + "autoplay=1&rel=0"}
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={reel.titulo}
            />
          ) : (
            <Flex
              w="100%"
              h="100%"
              direction="column"
              align="center"
              justify="center"
              gap={4}
              px={6}
              textAlign="center"
              bg={`linear-gradient(160deg, ${color}30 0%, rgba(0,0,0,0.85) 100%)`}
            >
              <Flex
                w="72px"
                h="72px"
                borderRadius="full"
                align="center"
                justify="center"
                border={`1.5px solid ${color}88`}
                boxShadow={`0 0 28px ${color}44`}
              >
                <Box ml="3px">
                  <PlayIcon size="28px" />
                </Box>
              </Flex>
              <Text color="rgba(255,255,255,0.85)" fontSize="md" fontWeight="700">
                {reel.titulo}
              </Text>
              <Text color="rgba(255,255,255,0.5)" fontSize="xs" fontStyle="italic" letterSpacing="0.12em">
                Próximamente
              </Text>
            </Flex>
          )}
        </Box>

        {/* Título debajo */}
        <Text
          color="white"
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="700"
          textAlign="center"
          letterSpacing="0.03em"
          maxW="340px"
          lineHeight="1.3"
        >
          {reel.titulo}
        </Text>
      </Flex>
    </Box>
  );
}

/* ════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL — rejilla de reels (cada uno en su tarjeta)
═══════════════════════════════════════════════════════════════════ */
export function DisciplinaReels({
  moduloId,
  nom,
  color,
}: {
  moduloId?: string | null;
  /** Nombre canónico de la disciplina (para la foto de fondo). */
  nom: string;
  color: string;
}) {
  const reels = getReelsDisciplina(moduloId);
  const [openReel, setOpenReel] = useState<ReelVideo | null>(null);

  if (reels.length === 0) return null;

  return (
    <Box w="100%" maxW="1280px" mb={{ base: 8, md: 10 }} fontFamily="'EB Garamond', serif">
      {/* Tarjetas individuales — todas del mismo tamaño. 4 por fila (ordenador), 2 (móvil) */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 6 }}>
        {reels.slice(0, 4).map((reel) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            nom={nom}
            color={color}
            onOpen={() => setOpenReel(reel)}
          />
        ))}
      </SimpleGrid>

      {openReel && (
        <ReelModal reel={openReel} color={color} onClose={() => setOpenReel(null)} />
      )}
    </Box>
  );
}

export default DisciplinaReels;
