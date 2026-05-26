import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { astrologiaTxt } from "../../GlobalVariables";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 1; }
`;

const blink = keyframes`
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const TYPE_SPEED_MS = 24;
const PARAGRAPH_PAUSE_MS = 420;

interface Vineta {
  src: string;
  paragraphs: string[];
}

// TODO: sustituir las imágenes en /public/viñetas/astrologia/ y los textos por los definitivos
const VINETAS: Vineta[] = [
  {
    src: "/viñetas/astrologia/viñeta1.png",
    paragraphs: [
      "Texto provisional de la primera viñeta de astrología.",
      "Cámbialo cuando tengas el guion definitivo.",
    ],
  },
  {
    src: "/viñetas/astrologia/viñeta2.png",
    paragraphs: [
      "Texto provisional de la segunda viñeta.",
      "Aquí va el desarrollo del relato.",
    ],
  },
  {
    src: "/viñetas/astrologia/viñeta3.png",
    paragraphs: [
      "Texto provisional de la tercera viñeta.",
      "Añade tantos párrafos como quieras por viñeta.",
    ],
  },
  {
    src: "/viñetas/astrologia/viñeta4.png",
    paragraphs: [
      "Texto provisional de la cuarta viñeta.",
      "El cómic termina invitando a explorar la carta natal en 3D.",
    ],
  },
];

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

interface ComicAstrologiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Se llama solo cuando el usuario completa el cómic con la flecha final (no al cerrar con X). */
  onComplete?: () => void;
}

export function ComicAstrologiaModal({ isOpen, onClose, onComplete }: ComicAstrologiaModalProps) {
  const [index, setIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState<Record<number, boolean>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  const total = VINETAS.length;
  const current = VINETAS[index];
  const isFirst = index === 0;
  const isLast = index === total - 1;

  useEffect(() => {
    if (isOpen) setIndex(0);
  }, [isOpen]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [index]);

  const handleComplete = () => {
    if (onComplete) onComplete();
    else onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setIndex((i) => {
          if (i >= total - 1) {
            handleComplete();
            return i;
          }
          return i + 1;
        });
      } else if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, total]);

  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setIndex((i) => Math.min(i + 1, total - 1));

  // ── Typewriter ──
  const totalChars = current.paragraphs.reduce((acc, p) => acc + p.length, 0);
  const [typed, setTyped] = useState(0);
  const [lastIndex, setLastIndex] = useState(index);

  if (lastIndex !== index) {
    setLastIndex(index);
    setTyped(0);
  }

  useEffect(() => {
    if (typed >= totalChars) return;
    let acc = 0;
    let atBoundary = false;
    for (let i = 0; i < current.paragraphs.length - 1; i++) {
      acc += current.paragraphs[i].length;
      if (typed === acc) { atBoundary = true; break; }
    }
    const delay = atBoundary ? PARAGRAPH_PAUSE_MS : TYPE_SPEED_MS;
    const t = setTimeout(() => setTyped((n) => n + 1), delay);
    return () => clearTimeout(t);
  }, [typed, totalChars, current]);

  const skipTyping = () => setTyped(totalChars);

  const glowText = `0 0 14px rgba(255,255,255,0.55), 0 0 30px rgba(255,255,255,0.28), 0 0 60px ${astrologiaTxt}55`;
  const glowTextSoft = `0 0 10px rgba(255,255,255,0.4), 0 0 22px rgba(255,255,255,0.2)`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior="inside">
      <ModalOverlay bg="rgba(0,0,0,0.95)" sx={{ backdropFilter: "blur(24px)" }} />
      <ModalContent
        bg="transparent"
        border="none"
        borderRadius="0"
        boxShadow="none"
        m={0}
        fontFamily="'EB Garamond', serif"
        overflow="hidden"
        minH="100vh"
      >
        <Box
          position="fixed"
          inset="0"
          pointerEvents="none"
          zIndex={0}
          bg="#050505"
          overflow="hidden"
          sx={{ backdropFilter: "blur(20px)" }}
        >
          <Box
            as="img"
            src="/img/astrologia/space.jpg"
            alt=""
            loading="eager"
            position="absolute"
            inset="0"
            w="100%"
            h="100%"
            style={{ objectFit: "cover", objectPosition: "center", opacity: 0.6 }}
          />
          <Box position="absolute" inset="0" bg="rgba(0,0,0,0.65)" />
        </Box>

        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: 3, md: 5 }}
          zIndex={10}
          variant="ghost"
          color={astrologiaTxt}
          _hover={{ bg: `${astrologiaTxt}22` }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill={astrologiaTxt}>
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </Box>
          }
        />

        <IconButton
          aria-label="Anterior"
          onClick={goPrev}
          isDisabled={isFirst}
          position="fixed"
          left={{ base: 2, md: 6 }}
          top="50%"
          transform="translateY(-50%)"
          zIndex={10}
          variant="ghost"
          color={astrologiaTxt}
          opacity={isFirst ? 0.25 : 1}
          bg={`${astrologiaTxt}10`}
          border={`1px solid ${astrologiaTxt}33`}
          borderRadius="full"
          w={{ base: "44px", md: "60px" }}
          h={{ base: "44px", md: "60px" }}
          boxShadow={isFirst ? "none" : `0 0 14px ${astrologiaTxt}44, 0 0 32px ${astrologiaTxt}22`}
          _hover={isFirst ? {} : {
            bg: `${astrologiaTxt}22`,
            borderColor: `${astrologiaTxt}88`,
            boxShadow: `0 0 22px ${astrologiaTxt}66, 0 0 50px ${astrologiaTxt}33`,
          }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "24px", md: "30px" }} h={{ base: "24px", md: "30px" }} fill={astrologiaTxt}
              style={{ filter: isFirst ? "none" : `drop-shadow(0 0 6px ${astrologiaTxt}88)` }}>
              <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </Box>
          }
        />

        <IconButton
          aria-label={isLast ? "Continuar a la carta 3D" : "Siguiente"}
          onClick={isLast ? handleComplete : goNext}
          position="fixed"
          right={{ base: 2, md: 6 }}
          top="50%"
          transform="translateY(-50%)"
          zIndex={10}
          variant="ghost"
          color={astrologiaTxt}
          bg={`${astrologiaTxt}10`}
          border={`1px solid ${astrologiaTxt}33`}
          borderRadius="full"
          w={{ base: "44px", md: "60px" }}
          h={{ base: "44px", md: "60px" }}
          boxShadow={`0 0 14px ${astrologiaTxt}44, 0 0 32px ${astrologiaTxt}22`}
          _hover={{
            bg: `${astrologiaTxt}22`,
            borderColor: `${astrologiaTxt}88`,
            boxShadow: `0 0 22px ${astrologiaTxt}66, 0 0 50px ${astrologiaTxt}33`,
          }}
          icon={
            isLast ? (
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "24px", md: "30px" }} h={{ base: "24px", md: "30px" }} fill={astrologiaTxt}
                style={{ filter: `drop-shadow(0 0 6px ${astrologiaTxt}88)` }}>
                <path d="M382-200 154-428l57-57 171 171 367-367 57 57-424 424Z" />
              </Box>
            ) : (
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "24px", md: "30px" }} h={{ base: "24px", md: "30px" }} fill={astrologiaTxt}
                style={{ filter: `drop-shadow(0 0 6px ${astrologiaTxt}88)` }}>
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
              </Box>
            )
          }
        />

        <ModalBody
          ref={contentRef}
          position="relative"
          zIndex={2}
          px={{ base: 14, md: 24 }}
          py={{ base: 6, md: 12 }}
          overflowY="auto"
          minH="100vh"
          display="flex"
          alignItems="center"
          sx={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <Flex direction="column" align="center" justify="center" gap={{ base: 5, md: 8 }} maxW="680px" mx="auto" w="100%">
            <Box
              key={`img-${index}`}
              w={{ base: "85%", sm: "70%", md: "60%" }}
              maxW="440px"
              aspectRatio={1}
              animation={`${fadeIn} 0.5s ease both`}
              position="relative"
              sx={{
                filter: `
                  drop-shadow(0 0 30px rgba(255,255,255,0.35))
                  drop-shadow(0 0 60px rgba(180,210,255,0.28))
                  drop-shadow(0 0 110px ${astrologiaTxt}55)
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
                  border={`1px dashed ${astrologiaTxt}44`}
                  borderRadius="2xl"
                >
                  <Text fontSize="4xl">✨</Text>
                  <Text color={`${astrologiaTxt}cc`} fontSize="sm" fontStyle="italic">
                    Viñeta {index + 1} próximamente
                  </Text>
                </Flex>
              )}
            </Box>

            <Box
              key={`txt-${index}`}
              w="100%"
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              border={`1px solid ${astrologiaTxt}44`}
              px={{ base: 5, md: 8 }}
              pt={{ base: 5, md: 7 }}
              pb={{ base: 8, md: 9 }}
              animation={`${fadeIn} 0.55s ease 0.08s both`}
              boxShadow={`0 0 18px ${astrologiaTxt}22, 0 0 40px ${astrologiaTxt}14, inset 0 0 20px rgba(0,0,0,0.35)`}
            >
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
                  src="/img/astrologia/space.jpg"
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

              <Box
                position="absolute"
                top="-1px"
                left="15%"
                right="15%"
                h="1px"
                bgGradient={`linear(to-r, transparent, ${astrologiaTxt}aa, transparent)`}
                zIndex={2}
              />

              <Flex
                direction="column"
                gap={4}
                position="relative"
                zIndex={2}
                onClick={skipTyping}
                cursor={typed < totalChars ? "pointer" : "default"}
              >
                {current.paragraphs.map((p, i) => {
                  let consumed = 0;
                  for (let j = 0; j < i; j++) consumed += current.paragraphs[j].length;
                  const remaining = Math.max(0, typed - consumed);
                  if (remaining === 0) return null;
                  const shown = p.slice(0, remaining);
                  const isCurrent = remaining < p.length;
                  return (
                    <Text
                      key={i}
                      color={i === 0 ? astrologiaTxt : `${astrologiaTxt}dd`}
                      fontSize={{ base: "md", md: "lg" }}
                      lineHeight="1.85"
                      letterSpacing="0.02em"
                      textAlign="center"
                      fontWeight={i === 0 ? "600" : "400"}
                      fontStyle={i === 0 ? "normal" : "italic"}
                      style={{ textShadow: i === 0 ? glowText : glowTextSoft }}
                    >
                      {shown}
                      {isCurrent && (
                        <Box
                          as="span"
                          display="inline-block"
                          ml="3px"
                          w="2px"
                          h="1em"
                          verticalAlign="text-bottom"
                          bg={astrologiaTxt}
                          animation={`${blink} 0.9s steps(1) infinite`}
                          sx={{ boxShadow: `0 0 8px ${astrologiaTxt}` }}
                        />
                      )}
                    </Text>
                  );
                })}
              </Flex>

              <Box
                position="absolute"
                bottom="-1px"
                left="15%"
                right="15%"
                h="1px"
                bgGradient={`linear(to-r, transparent, ${astrologiaTxt}aa, transparent)`}
                zIndex={2}
              />

              <Text
                position="absolute"
                bottom={{ base: 2, md: 3 }}
                right={{ base: 3, md: 4 }}
                color={`${astrologiaTxt}99`}
                fontSize={{ base: "xs", md: "sm" }}
                fontStyle="italic"
                letterSpacing="0.18em"
                style={{ textShadow: glowTextSoft }}
                zIndex={2}
              >
                {index + 1} / {total}
              </Text>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
