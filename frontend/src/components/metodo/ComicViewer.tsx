import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Image,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { astrologiaTxt } from "../../GlobalVariables";

// Frontend único del cómic: misma vista, misma maquetación, mismas animaciones.
// Lo que varía entre cómics son las viñetas (foto + texto) y las acciones
// (qué hace el botón de "volver" o el tick final).

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 1; }
`;

export interface Vineta {
  src: string;
  paragraphs: string[];
}

const Stars = () => {
  const stars = [
    { top: "12%", left: "8%",  size: 2, delay: "0s" },
    { top: "20%", left: "92%", size: 2, delay: "1.4s" },
    { top: "38%", left: "4%",  size: 3, delay: "0.7s" },
    { top: "52%", left: "96%", size: 2, delay: "2.1s" },
    { top: "70%", left: "6%",  size: 2, delay: "1.1s" },
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

interface ComicViewerProps {
  vinetas: Vineta[];
  onClose: () => void;
  /** Si se define, se llama al pulsar el tick de la última viñeta (en vez de cerrar). */
  onComplete?: () => void;
  /** Si se define, muestra el botón "volver" (top-left) — usado por Astrología para volver al selector. */
  onBack?: () => void;
  /** Color de acento. Por defecto el de astrología. */
  themeColor?: string;
  /** Foto de la modalidad. Si se pasa, sustituye al fondo de Astrología
   *  (estrellas) tanto en el fondo completo (muy blureado + pantalla negra)
   *  como en el box del texto (poco blureado, brillando con disciplinaBgColor).
   *  Útil para Ilustraciones de Hinduismo / Medicina China. */
  disciplinaBgImage?: string;
  /** Color hex del bg de la disciplina. Se usa para el glow del box de texto. */
  disciplinaBgColor?: string;
  /** Sombra del texto de las viñetas. Por defecto una sombra oscura (la usa
   *  TCM). Cada cómic puede pasar la suya (p.ej. Hinduismo/Astrología usan una
   *  sombra del color de su disciplina en vez de negra). */
  textShadow?: string;
}

const DEFAULT_TEXT_SHADOW =
  "0 1px 4px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.75), 0 0 5px rgba(0,0,0,0.7), 0 0 18px rgba(255,255,255,0.25)";

export function ComicViewer({
  vinetas,
  onClose,
  onComplete,
  onBack,
  themeColor = astrologiaTxt,
  disciplinaBgImage,
  disciplinaBgColor,
  textShadow = DEFAULT_TEXT_SHADOW,
}: ComicViewerProps) {
  const isDisciplinaMode = !!disciplinaBgImage;
  const [index, setIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState<Record<number, boolean>>({});
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const total = vinetas.length;
  const current = vinetas[index];
  const isFirst = index === 0;
  const isLast = index === total - 1;

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [index]);

  const handleComplete = () => {
    if (onComplete) onComplete();
    else onClose();
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setIndex((i) => {
          if (i >= total - 1) {
            handleComplete();
            return i;
          }
          return i + 1;
        });
      } else if (e.key === "ArrowLeft") {
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Escape" && onBack) {
        onBack();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, onBack]);

  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setIndex((i) => Math.min(i + 1, total - 1));

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
      else if (isLast) handleComplete();
      else goNext();
    }
  };

  // Todo el texto de la viñeta como un único bloque, sin saltos de línea.
  const fullText = current.paragraphs.join(" ");

  const glowTextSoft = `0 0 10px rgba(255,255,255,0.4), 0 0 22px rgba(255,255,255,0.2)`;

  return (
    <>
      {/* Fondo a pantalla completa. La foto cubre TODO el viewport sin dejar
          huecos en negro: position:fixed + inset:0 + objectFit:cover.
          - Astrología: foto espacial nítida.
          - Disciplina mode (Hinduismo / TCM Ilustraciones): foto de la
            modalidad con blur fuerte + pantalla negra translúcida para crear
            distinción con la foto nítida del box del texto. */}
      <Box
        position="fixed"
        inset="0"
        pointerEvents="none"
        zIndex={0}
        overflow="hidden"
        bg={isDisciplinaMode ? disciplinaBgColor : undefined}
      >
        <Box
          as="img"
          src={isDisciplinaMode ? disciplinaBgImage : "/img/astrologia/space.jpg"}
          alt=""
          loading="eager"
          position="absolute"
          top={isDisciplinaMode ? "-30px" : "0"}
          left={isDisciplinaMode ? "-30px" : "0"}
          right={isDisciplinaMode ? "-30px" : "0"}
          bottom={isDisciplinaMode ? "-30px" : "0"}
          w={isDisciplinaMode ? "calc(100% + 60px)" : "100%"}
          h={isDisciplinaMode ? "calc(100% + 60px)" : "100%"}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            filter: isDisciplinaMode ? "blur(20px)" : undefined,
          }}
        />
        <Box position="absolute" inset="0" bg={isDisciplinaMode ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.35)"} />
      </Box>

      {/* X cerrar */}
      <IconButton
        aria-label="Cerrar"
        onClick={onClose}
        position="fixed"
        top={{ base: 3, md: 5 }}
        right={{ base: 3, md: 5 }}
        zIndex={10}
        variant="ghost"
        color={themeColor}
        _hover={{ bg: `${themeColor}22` }}
        icon={
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill={themeColor}>
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </Box>
        }
      />

      {/* Botón "volver" (solo si onBack está definido) */}
      {onBack && (
        <IconButton
          aria-label="Volver al menú"
          onClick={onBack}
          position="fixed"
          top={{ base: 3, md: 5 }}
          left={{ base: 3, md: 5 }}
          zIndex={10}
          variant="ghost"
          color={themeColor}
          _hover={{ bg: `${themeColor}22` }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill={themeColor}>
              <path d="M480-160 160-480l320-320 56 57-223 223h487v80H313l224 224-57 56Z" />
            </Box>
          }
        />
      )}

      {/* Flecha izquierda */}
      <IconButton
        aria-label="Anterior"
        onClick={goPrev}
        isDisabled={isFirst}
        position="fixed"
        left={{ base: 1, md: 6 }}
        top="50%"
        transform="translateY(-50%)"
        zIndex={10}
        variant="ghost"
        color={themeColor}
        opacity={isFirst ? 0.25 : 1}
        bg={{ base: "transparent", md: `${themeColor}10` }}
        border={{ base: "none", md: `1px solid ${themeColor}33` }}
        borderRadius="full"
        w={{ base: "32px", md: "60px" }}
        h={{ base: "32px", md: "60px" }}
        minW={{ base: "32px", md: "60px" }}
        boxShadow={isFirst
          ? "none"
          : { base: "none", md: `0 0 14px ${themeColor}44, 0 0 32px ${themeColor}22` }}
        _hover={isFirst ? {} : {
          bg: `${themeColor}22`,
          borderColor: `${themeColor}88`,
          boxShadow: `0 0 22px ${themeColor}66, 0 0 50px ${themeColor}33`,
        }}
        icon={
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "22px", md: "30px" }} h={{ base: "22px", md: "30px" }} fill={themeColor}
            style={{ filter: isFirst ? "none" : `drop-shadow(0 0 6px ${themeColor}cc) drop-shadow(0 0 14px ${themeColor}77)` }}>
            <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
          </Box>
        }
      />

      {/* Flecha derecha (tick si es la última) */}
      <IconButton
        aria-label={isLast ? "Terminar" : "Siguiente"}
        onClick={isLast ? handleComplete : goNext}
        position="fixed"
        right={{ base: 1, md: 6 }}
        top="50%"
        transform="translateY(-50%)"
        zIndex={10}
        variant="ghost"
        color={themeColor}
        bg={{ base: "transparent", md: `${themeColor}10` }}
        border={{ base: "none", md: `1px solid ${themeColor}33` }}
        borderRadius="full"
        w={{ base: "32px", md: "60px" }}
        h={{ base: "32px", md: "60px" }}
        minW={{ base: "32px", md: "60px" }}
        boxShadow={{ base: "none", md: `0 0 14px ${themeColor}44, 0 0 32px ${themeColor}22` }}
        _hover={{
          bg: `${themeColor}22`,
          borderColor: `${themeColor}88`,
          boxShadow: `0 0 22px ${themeColor}66, 0 0 50px ${themeColor}33`,
        }}
        icon={
          isLast ? (
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "22px", md: "30px" }} h={{ base: "22px", md: "30px" }} fill={themeColor}
              style={{ filter: `drop-shadow(0 0 6px ${themeColor}cc) drop-shadow(0 0 14px ${themeColor}77)` }}>
              <path d="M382-200 154-428l57-57 171 171 367-367 57 57-424 424Z" />
            </Box>
          ) : (
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "22px", md: "30px" }} h={{ base: "22px", md: "30px" }} fill={themeColor}
              style={{ filter: `drop-shadow(0 0 6px ${themeColor}cc) drop-shadow(0 0 14px ${themeColor}77)` }}>
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </Box>
          )
        }
      />

      {/* Contenido scrollable — el scroll vertical ocurre DENTRO del popup
          (h fija a 100vh + overflowY:auto), nunca a nivel de página. El py
          asegura un mt/mb visible siempre (incluso al hacer scroll hasta el
          extremo) para que el contenido nunca se pegue a los bordes y dé
          sensación de "popup que se mueve" y no de pantalla rígida. */}
      {/* Contenedor del contenido: SIN altura fija ni scroll interno. El
          scroll lo gestiona el contenedor exterior del Modal (Chakra con
          scrollBehavior="outside") usando la scrollbar real del navegador.
          pt/pb generosos para que SIEMPRE haya un mt/mb visible por arriba
          y por abajo, también justo al abrir el popup. */}
      <ModalBody
        position="relative"
        zIndex={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        px={{ base: 4, md: 24 }}
        py={{ base: 12, md: 14 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        sx={{
          touchAction: "pan-y",
        }}
      >
        {/* Caja única: contiene foto + texto sobre el fondo de la disciplina.
            El scroll vertical ocurre DENTRO de la caja (el área de contenido),
            no a nivel de página. */}
        <Box
          key={`box-${index}`}
          w="100%"
          maxW={{ base: "360px", md: "900px" }}
          h={{ base: "auto", md: "500px" }}
          maxH={{ base: "calc(100dvh - 96px)" }}
          display="flex"
          flexDirection="column"
          position="relative"
          borderRadius="xl"
          overflow="hidden"
          border={`1px solid ${themeColor}44`}
          animation={`${fadeIn} 0.55s ease both`}
          boxShadow={
            isDisciplinaMode && disciplinaBgColor
              ? `0 0 22px ${disciplinaBgColor}88, 0 0 50px ${disciplinaBgColor}55, 0 0 18px ${themeColor}44, 0 0 40px ${themeColor}22, inset 0 0 20px rgba(0,0,0,0.35)`
              : `0 0 18px ${themeColor}22, 0 0 40px ${themeColor}14, inset 0 0 20px rgba(0,0,0,0.35)`
          }
        >
          {/* Fondo de la caja (foto de disciplina blureada + overlay) */}
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
              src={isDisciplinaMode ? disciplinaBgImage : "/img/astrologia/space.jpg"}
              alt=""
              loading="eager"
              position="absolute"
              inset="0"
              w="100%"
              h="100%"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                opacity: isDisciplinaMode ? 1 : 0.75,
                filter: isDisciplinaMode ? "saturate(1.05)" : undefined,
              }}
            />
            <Box
              position="absolute"
              inset="0"
              bg={isDisciplinaMode && disciplinaBgColor ? `${disciplinaBgColor}55` : "rgba(8,13,30,0.55)"}
            />
          </Box>

          {!isDisciplinaMode && <Stars />}

          {/* Línea de luz superior */}
          <Box
            position="absolute"
            top="-1px"
            left="15%"
            right="15%"
            h="1px"
            bgGradient={`linear(to-r, transparent, ${themeColor}aa, transparent)`}
            zIndex={3}
          />

          {/* Área de contenido scrollable: foto + texto.
              Escritorio: foto a la izquierda, texto a la derecha (fila).
              Móvil: foto arriba, texto abajo (columna) con una rayita corta
              y elegante entre medias. */}
          <Flex
            ref={contentRef}
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="center"
            gap={{ base: 5, md: 10 }}
            position="relative"
            zIndex={2}
            flex="1"
            minH={0}
            overflowY="auto"
            overflowX="hidden"
            px={{ base: 5, md: 10 }}
            py={{ base: 9, md: 10 }}
            sx={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                background: `${themeColor}55`,
                borderRadius: "3px",
              },
            }}
          >
            <Box
              w={{ base: "90%", md: "380px" }}
              maxW={{ base: "300px", md: "380px" }}
              aspectRatio={1}
              flexShrink={0}
              position="relative"
              sx={{
                filter: `
                  drop-shadow(0 0 24px rgba(255,255,255,0.3))
                  drop-shadow(0 0 50px rgba(180,210,255,0.24))
                  drop-shadow(0 0 90px ${themeColor}55)
                `,
              }}
            >
              {!imgFailed[index] ? (
                <Image
                  src={encodeURI(current.src)}
                  alt={`Viñeta ${index + 1}`}
                  w="100%"
                  h="100%"
                  objectFit="contain"
                  borderRadius="lg"
                  onError={() => setImgFailed((s) => ({ ...s, [index]: true }))}
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
                  border={`1px dashed ${themeColor}44`}
                  borderRadius="2xl"
                >
                  <Text fontSize="4xl">✨</Text>
                  <Text color={`${themeColor}cc`} fontSize="sm" fontStyle="italic">
                    Viñeta {index + 1} próximamente
                  </Text>
                </Flex>
              )}
            </Box>

            {/* Separador elegante: rayita horizontal y corta en móvil,
                vertical entre foto y texto en escritorio. */}
            <Box
              flexShrink={0}
              alignSelf="center"
              w={{ base: "52px", md: "1px" }}
              h={{ base: "1px", md: "150px" }}
              borderRadius="full"
              bgGradient={{
                base: `linear(to-r, transparent, ${themeColor}aa, transparent)`,
                md: `linear(to-b, transparent, ${themeColor}aa, transparent)`,
              }}
            />

            <Box flex="1" minW={0} w={{ base: "100%", md: "auto" }}>
              <Text
                color={themeColor}
                fontSize={{ base: "xl", md: "2xl" }}
                lineHeight="1.9"
                letterSpacing="0.02em"
                textAlign={{ base: "center", md: "left" }}
                fontWeight="400"
                style={{ textShadow }}
              >
                {fullText}
              </Text>
            </Box>
          </Flex>

          {/* Línea de luz inferior */}
          <Box
            position="absolute"
            bottom="-1px"
            left="15%"
            right="15%"
            h="1px"
            bgGradient={`linear(to-r, transparent, ${themeColor}aa, transparent)`}
            zIndex={3}
          />

          {/* Contador de página */}
          <Text
            position="absolute"
            bottom={{ base: 2, md: 3 }}
            right={{ base: 3, md: 4 }}
            color={`${themeColor}99`}
            fontSize={{ base: "xs", md: "sm" }}
            fontStyle="italic"
            letterSpacing="0.18em"
            style={{ textShadow: glowTextSoft }}
            zIndex={3}
          >
            {index + 1} / {total}
          </Text>
        </Box>
      </ModalBody>
    </>
  );
}
