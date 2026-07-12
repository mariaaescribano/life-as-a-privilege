import React, { useEffect, useState } from "react";
import { Box, Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { fisiologiaTxt, fisiologiaNom } from "../../GlobalVariables";
import type { Celula } from "../../hardCoded/espacio/CelulasCuerpoData";

const TXT = fisiologiaTxt;

/* ─────────────────────────────────────────
   TARJETA DE CÉLULA
   Fondo = foto de Fisiología. Dentro: foto de la célula, una rallita
   elegante, el nombre y "Leer más →" abajo a la derecha.
───────────────────────────────────────── */
export function CelulaCard({ celula, onClick }: { celula: Celula; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <Box
      as="button"
      onClick={onClick}
      textAlign="left"
      position="relative"
      overflow="hidden"
      borderRadius="2xl"
      border={`1px solid ${TXT}33`}
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      boxShadow={`0 4px 18px rgba(0,0,0,0.22), 0 0 16px ${TXT}26`}
      transition="all 0.22s ease"
      _hover={{
        transform: "translateY(-4px)",
        borderColor: `${TXT}88`,
        boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 26px ${TXT}55`,
      }}
      _active={{ transform: "translateY(-1px)" }}
    >
      {/* Fondo: misma imagen que el header de Fisiología (sin velo) */}
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />

      <Flex direction="column" position="relative" zIndex={1} p={{ base: 4, md: 5 }} gap={3} h="100%">
        {/* Foto de la célula — cuadrada 1:1 (como es la foto real) */}
        <Box
          borderRadius="lg"
          overflow="hidden"
          w="100%"
          aspectRatio={1}
          bg={`${TXT}14`}
          boxShadow="0 4px 16px rgba(0,0,0,0.28)"
          flexShrink={0}
        >
          {!imgErr ? (
            <Image
              src={encodeURI(celula.foto)}
              alt={celula.nombre}
              w="100%"
              h="100%"
              objectFit="cover"
              onError={() => setImgErr(true)}
            />
          ) : (
            <Flex w="100%" h="100%" align="center" justify="center">
              <Text fontSize="34px" opacity={0.35}>🔬</Text>
            </Flex>
          )}
        </Box>

        {/* Rallita separadora elegante */}
        <Box
          alignSelf="center"
          w="54px"
          h="1px"
          borderRadius="full"
          bgGradient={`linear(to-r, transparent, ${TXT}, transparent)`}
          my={1}
        />

        {/* Nombre */}
        <Text
          color={TXT}
          fontWeight="700"
          fontSize={{ base: "lg", md: "xl" }}
          textAlign="center"
          lineHeight="1.25"
          letterSpacing="0.02em"
          style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6), 0 0 10px rgba(0,0,0,0.4)" }}
        >
          {celula.nombre}
        </Text>

        {/* Leer más → */}
        <Flex align="center" justify="flex-end" gap={1.5} mt="auto" pt={2} color={TXT}>
          <Text
            as="span"
            fontSize={{ base: "xs", md: "sm" }}
            fontStyle="italic"
            letterSpacing="0.08em"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
          >
            Leer más
          </Text>
          <Box
            as="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            w="14px"
            h="14px"
            fill="currentColor"
          >
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

/* ─────────────────────────────────────────
   MODAL DE CÉLULA — nombre + foto + descripción
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
  const [imgErr, setImgErr] = useState(false);

  // Navegación cíclica entre células (tras la última vuelve a la primera).
  const puedeNavegar = !!celulas && celulas.length > 1 && !!onSelect;
  const idx = celulas ? celulas.findIndex((c) => c.id === celula.id) : -1;
  const irAnterior = () => {
    if (!puedeNavegar || idx < 0) return;
    onSelect!(celulas![(idx - 1 + celulas!.length) % celulas!.length]);
  };
  const irSiguiente = () => {
    if (!puedeNavegar || idx < 0) return;
    onSelect!(celulas![(idx + 1) % celulas!.length]);
  };

  // Al cambiar de célula (con las flechas) el modal NO se desmonta, así que
  // reiniciamos el estado de error de imagen manualmente.
  useEffect(() => { setImgErr(false); }, [celula.id]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") irAnterior();
      else if (e.key === "ArrowRight") irSiguiente();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, puedeNavegar, idx]);

  const scrollbarSx = {
    "&::-webkit-scrollbar": { width: "5px" },
    "&::-webkit-scrollbar-track": { bg: "transparent" },
    "&::-webkit-scrollbar-thumb": { bg: TXT + "55", borderRadius: "full" },
  };

  const Foto = ({ w }: { w: string }) => (
    <Box
      flexShrink={0}
      w={w}
      aspectRatio={1}
      alignSelf="center"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="0 8px 32px rgba(0,0,0,0.3)"
      bg={TXT + "12"}
    >
      {!imgErr ? (
        <Image src={encodeURI(celula.foto)} alt={celula.nombre} w="100%" h="100%" objectFit="cover" onError={() => setImgErr(true)} />
      ) : (
        <Flex w="100%" h="100%" align="center" justify="center">
          <Text fontSize="48px" opacity={0.3}>🔬</Text>
        </Flex>
      )}
    </Box>
  );

  // Cuerpo de la ficha: solo los textos (sin etiquetas), con un salto de línea
  // entre la descripción y los cuidados.
  const Cuerpo = () => (
    <>
      <Text
        color={TXT}
        fontSize={{ base: "md", md: "lg" }}
        lineHeight="1.8"
        letterSpacing="0.02em"
        fontFamily="'EB Garamond', serif"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
      >
        {celula.descripcion}
      </Text>
      {celula.cuidados && (
        <Text
          color={TXT}
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.8"
          letterSpacing="0.02em"
          fontFamily="'EB Garamond', serif"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
        >
          {celula.cuidados}
        </Text>
      )}
    </>
  );

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={1100}
      bg="rgba(0,40,20,0.62)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        overflow="hidden"
        w={{ base: "95%", md: "920px" }}
        h={{ base: "auto", md: "380px" }}
        borderRadius="24px"
        border={`1px solid ${TXT}33`}
        boxShadow={`0 32px 80px rgba(0,0,0,0.5), 0 0 26px ${TXT}33`}
      >
        {/* Fondo: foto de Fisiología (velo oscuro suave, sin morado tan fuerte) */}
        <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="24px" overlay="rgba(20,12,30,0.4)" />

        {/* Botón cerrar */}
        <Box
          as="button"
          position="absolute"
          top="14px"
          right="14px"
          w="34px"
          h="34px"
          borderRadius="full"
          bg={TXT + "18"}
          border={`1px solid ${TXT}33`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={TXT}
          fontSize="16px"
          fontWeight="700"
          cursor="pointer"
          transition="all 0.18s"
          _hover={{ bg: TXT + "33" }}
          onClick={onClose}
          zIndex={2}
        >
          ✕
        </Box>

        {/* ── MÓVIL: título centrado → rallita → foto → textos. La caja crece
              según el texto (con tope de viewport y scroll si hace falta). ── */}
        <Flex
          display={{ base: "flex", md: "none" }}
          position="relative"
          zIndex={1}
          direction="column"
          align="center"
          p={5}
          pt={12}
          gap={3}
          maxH="calc(100dvh - 40px)"
          overflowY="auto"
          sx={scrollbarSx}
        >
          <Text
            color={TXT}
            fontSize="2xl"
            fontWeight="700"
            fontFamily="'EB Garamond', serif"
            letterSpacing="0.03em"
            lineHeight="1.2"
            textAlign="center"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            {celula.nombre}
          </Text>

          {/* Mini rallita horizontal debajo del título */}
          <Box
            w="54px"
            h="1px"
            borderRadius="full"
            bgGradient={`linear(to-r, transparent, ${TXT}, transparent)`}
            my={1}
          />

          <Foto w="100%" />

          <Flex direction="column" gap={4} w="100%" mt={2}>
            <Cuerpo />
          </Flex>
        </Flex>

        {/* ── ORDENADOR: foto fija a la izquierda, texto con scroll a la derecha ── */}
        <Flex
          display={{ base: "none", md: "flex" }}
          position="relative"
          zIndex={1}
          h="100%"
          direction="row"
          p={7}
        >
          <Foto w="300px" />

          {/* Rallita vertical entre foto y texto */}
          <Box
            flexShrink={0}
            alignSelf="center"
            w="1px"
            h="76%"
            borderRadius="full"
            bgGradient={`linear(to-b, transparent, ${TXT}, transparent)`}
            mx={6}
          />

          <Flex direction="column" flex="1" minW={0} minH={0}>
            <Text
              color={TXT}
              fontSize="3xl"
              fontWeight="700"
              fontFamily="'EB Garamond', serif"
              letterSpacing="0.03em"
              lineHeight="1.2"
              flexShrink={0}
              mb={4}
              pr="40px"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
            >
              {celula.nombre}
            </Text>

            {/* Solo el texto hace scroll (la foto no se mueve) */}
            <Flex direction="column" gap={4} flex="1" minH={0} overflowY="auto" pr={2} sx={scrollbarSx}>
              <Cuerpo />
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Flechas para pasar de una célula a otra (por encima del box) */}
      {puedeNavegar && (
        <>
          <IconButton
            aria-label="Célula anterior"
            onClick={(e) => { e.stopPropagation(); irAnterior(); }}
            position="fixed"
            left={{ base: 1, md: 5 }}
            top="50%"
            transform="translateY(-50%)"
            zIndex={3}
            variant="ghost"
            borderRadius="full"
            w={{ base: "40px", md: "52px" }}
            h={{ base: "40px", md: "52px" }}
            minW={{ base: "40px", md: "52px" }}
            bg="rgba(0,0,0,0.45)"
            border={`1px solid ${TXT}aa`}
            sx={{ backdropFilter: "blur(4px)" }}
            _hover={{ bg: "rgba(0,0,0,0.65)", borderColor: TXT }}
            _focus={{ boxShadow: "none" }}
            _focusVisible={{ boxShadow: "none" }}
            icon={
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "22px", md: "28px" }} h={{ base: "22px", md: "28px" }} fill="#ffffff"
                style={{ filter: `drop-shadow(0 0 5px ${TXT}) drop-shadow(0 1px 2px rgba(0,0,0,0.85))` }}>
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
              </Box>
            }
          />
          <IconButton
            aria-label="Célula siguiente"
            onClick={(e) => { e.stopPropagation(); irSiguiente(); }}
            position="fixed"
            right={{ base: 1, md: 5 }}
            top="50%"
            transform="translateY(-50%)"
            zIndex={3}
            variant="ghost"
            borderRadius="full"
            w={{ base: "40px", md: "52px" }}
            h={{ base: "40px", md: "52px" }}
            minW={{ base: "40px", md: "52px" }}
            bg="rgba(0,0,0,0.45)"
            border={`1px solid ${TXT}aa`}
            sx={{ backdropFilter: "blur(4px)" }}
            _hover={{ bg: "rgba(0,0,0,0.65)", borderColor: TXT }}
            _focus={{ boxShadow: "none" }}
            _focusVisible={{ boxShadow: "none" }}
            icon={
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "22px", md: "28px" }} h={{ base: "22px", md: "28px" }} fill="#ffffff"
                style={{ filter: `drop-shadow(0 0 5px ${TXT}) drop-shadow(0 1px 2px rgba(0,0,0,0.85))` }}>
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
              </Box>
            }
          />
        </>
      )}
    </Box>
  );
}
