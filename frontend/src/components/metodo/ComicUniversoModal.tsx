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

interface Vineta {
  src: string;
  paragraphs: string[];
}

const VINETAS: Vineta[] = [
  {
    src: "/viñetas/viñeta1.png",
    paragraphs: [
      "Al principio existía lo infinito.",
      "Luz y sombra, lo femenino y lo masculino, todo unido en fusión. Todos eran Uno, Uno eran todos.",
    ],
  },
  {
    src: "/viñetas/viñeta2.png",
    paragraphs: [
      "Un día, lo infinito quiso saber qué se siente al recibir amor.",
      "Para poder sentirlo, tuvo que hacerse dos. La Cábala lo llama Tzimtzum: la primera contracción, el momento en que lo ilimitado se puso un límite.",
    ],
  },
  {
    src: "/viñetas/viñeta3.png",
    paragraphs: [
      "Así nacieron la vasija que sostiene y la luz que se entrega.",
      "Yang, Or: el portador y dador de luz. Yin, Kli: la energía que recibe, contiene y transforma para crear.",
    ],
  },
  {
    src: "/viñetas/viñeta4.png",
    paragraphs: [
      "Pero lo infinito quería más. Quería experimentarse desde todos los puntos de vista que fuese capaz de imaginar.",
      "Y dentro de ese límite que se había puesto, empezó a presionar hacia fuera.",
    ],
  },
  {
    src: "/viñetas/viñeta5.png",
    paragraphs: [
      "Estalló. La primera expansión.",
      "La ciencia la llama Big Bang y la fecha hace 13.800 millones de años.",
    ],
  },
  {
    src: "/viñetas/viñeta6.png",
    paragraphs: [
      "En los primeros minutos, esa energía se hizo materia.",
      "Miles de millones de partículas distintas. Había un plan. Había un propósito. No había prisa.",
    ],
  },
  {
    src: "/viñetas/viñeta7.png",
    paragraphs: [
      "La materia se buscó a sí misma. Se agrupó en estrellas.",
      "Dentro de ellas, por gravedad, nacieron los elementos pesados: el carbono, el oxígeno, el hierro. Todo lo que hoy existe.",
    ],
  },
  {
    src: "/viñetas/viñeta8.png",
    paragraphs: [
      "Las estrellas murieron y con su polvo nacieron los planetas, la naturaleza y nosotros.",
      "El hierro de tu sangre estuvo dentro de una estrella. Esto no es metáfora.",
    ],
  },
  {
    src: "/viñetas/viñeta9.png",
    paragraphs: [
      "Parte de ese polvo se reunió en planetas. Uno quedó a la distancia justa.",
      "El ayurveda lo había nombrado antes que la geología: cinco elementos —tierra, agua, fuego, aire, éter— combinándose para sostener Vida.",
    ],
  },
  {
    src: "/viñetas/viñeta10.png",
    paragraphs: [
      "Y la materia, en algún momento, empezó a copiarse, duplicarse y expandirse.",
      "Eso somos: un préstamo de polvo de estrellas. Una inversión del Universo. Cada célula que permite que te llames «yo» lleva 13.800 millones de años de historia dentro.",
    ],
  },
  {
    src: "/viñetas/viñeta11.png",
    paragraphs: [
      "Todo lo que ves es una manifestación distinta de Dios. Tú eres parte de lo divino, pero se te ha olvidado.",
      "La Cábala lo llama el exilio de la chispa: la luz que olvidó de dónde venía.",
    ],
  },
  {
    src: "/viñetas/viñeta12.png",
    paragraphs: [
      "No estás aquí por casualidad ni por castigo. No has sido abandonado ni expulsado.",
      "Estás aquí para recordar que eres y estás formado por Amor. Para recordarlo, atravesarás cosas difíciles. Forma parte del camino. Tiene su para qué. No es maldad ni castigo.",
    ],
  },
  {
    src: "/viñetas/viñeta13.png",
    paragraphs: [
      "En el instante exacto en que naciste, el cielo tenía una configuración que no se repetirá.",
      "Esa es tu carta natal. Te dice cómo está dispuesto tu mapa y tu camino para volver a casa.",
    ],
  },
  {
    src: "/viñetas/viñeta14.png",
    paragraphs: [
      "Este recorrido te acompañará a través de las ocho disciplinas que te ayudarán a entenderte y dar sentido a tu dolor.",
      "Obtendrás herramientas que te ayudarán en tu camino, el cual tienes que caminar con tu valentía y fortaleza. Nadie hará por ti lo que tú puedes hacer por ti.",
    ],
  },
];

/* Estrellitas decorativas — pensadas para vivir dentro del box de texto */
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

interface ComicUniversoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComicUniversoModal({ isOpen, onClose }: ComicUniversoModalProps) {
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, total - 1));
      else if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, total]);

  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const goNext = () => setIndex((i) => Math.min(i + 1, total - 1));

  const glowText = `0 0 14px rgba(255,255,255,0.55), 0 0 30px rgba(255,255,255,0.28), 0 0 60px ${astrologiaTxt}55`;
  const glowTextSoft = `0 0 10px rgba(255,255,255,0.4), 0 0 22px rgba(255,255,255,0.2)`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
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
        {/* ── Fondo negro a pantalla completa ── */}
        <Box
          position="fixed"
          inset="0"
          pointerEvents="none"
          zIndex={0}
          bg="#050505"
          sx={{ backdropFilter: "blur(20px)" }}
        />

        {/* Cerrar */}
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

        {/* ── Flecha izquierda (fija en el borde) ── */}
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

        {/* ── Flecha derecha (fija en el borde) ── */}
        <IconButton
          aria-label={isLast ? "Cerrar" : "Siguiente"}
          onClick={isLast ? onClose : goNext}
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

        {/* ── Contenido scrollable ── */}
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
        >
          <Flex direction="column" align="center" justify="center" gap={{ base: 5, md: 8 }} maxW="680px" mx="auto" w="100%">
            {/* Imagen — suelta, con halo de luz alrededor */}
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

            {/* Caja mágica con el texto */}
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
              {/* Fondo estrellado de Astrología, dentro del box */}
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

              {/* Estrellitas animadas encima */}
              <Stars />

              {/* línea decorativa superior */}
              <Box
                position="absolute"
                top="-1px"
                left="15%"
                right="15%"
                h="1px"
                bgGradient={`linear(to-r, transparent, ${astrologiaTxt}aa, transparent)`}
                zIndex={2}
              />

              <Flex direction="column" gap={4} position="relative" zIndex={2}>
                {current.paragraphs.map((p, i) => (
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
                    {p}
                  </Text>
                ))}
              </Flex>

              {/* línea decorativa inferior */}
              <Box
                position="absolute"
                bottom="-1px"
                left="15%"
                right="15%"
                h="1px"
                bgGradient={`linear(to-r, transparent, ${astrologiaTxt}aa, transparent)`}
                zIndex={2}
              />

              {/* Contador 1/14 en esquina inferior derecha */}
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
