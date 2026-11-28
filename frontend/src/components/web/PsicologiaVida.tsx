import React, { useRef, useState } from "react";
import { Box, Flex, Image, type BoxProps } from "@chakra-ui/react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import FotoViva from "../global/FotoViva";
import { FlechaBonita } from "../global/FlechaBonita";
import { MandalaTinte } from "../global/MandalaTinte";
import { focoBlanco } from "../global/foco";

// `motion(Box)`: mismo apaño de tipos que en Reveal.tsx.
const MotionBox = motion(Box) as any;
const EASE = [0.22, 1, 0.36, 1] as const;

const MASCARA = "linear-gradient(to bottom, transparent 0, #000 55px, #000 calc(100% - 55px), transparent 100%)";

/**
 * Banda con el fondo de la disciplina y PARALAJE: la foto es algo más alta que la banda y se desliza despacio en
 * sentido contrario al scroll, así el fondo tiene profundidad al bajar. Difuminada arriba y abajo (55 px). Detrás del
 * contenido, un MANDALA enorme y casi transparente que gira muy despacio (`mandala`: de qué lado asoma).
 */
export function BandaParalaje({ nom, visible, color, mandala, children, ...rest }: {
  nom: string;
  visible: boolean;
  color: string;
  mandala?: "izq" | "der";
  children: React.ReactNode;
} & BoxProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <Box ref={ref} position="relative" {...rest}>
      <Box
        position="absolute"
        inset={0}
        overflow="hidden"
        pointerEvents="none"
        opacity={visible ? 1 : 0}
        transition="opacity 0.5s ease"
        sx={{ WebkitMaskImage: MASCARA, maskImage: MASCARA }}
      >
        <MotionBox position="absolute" top="-8%" bottom="-8%" left={0} right={0} style={reduce ? undefined : { y }}>
          <DisciplinaBgLayer nom={nom} borderRadius="0" />
        </MotionBox>
        {mandala && (
          <Box
            position="absolute"
            top="50%"
            {...(mandala === "izq" ? { left: { base: "-40%", md: "-14%" } } : { right: { base: "-40%", md: "-14%" } })}
            w={{ base: "420px", md: "620px" }}
            opacity={0.11}
            sx={{
              "@keyframes mandalaGira": { from: { transform: "translateY(-50%) rotate(0deg)" }, to: { transform: "translateY(-50%) rotate(360deg)" } },
              animation: "mandalaGira 140s linear infinite",
              "@media (prefers-reduced-motion: reduce)": { animation: "none", transform: "translateY(-50%)" },
            }}
          >
            <MandalaTinte h="auto" color={color} style={{ width: "100%" }} />
          </Box>
        )}
      </Box>
      {children}
    </Box>
  );
}

/**
 * Separador: una raya fina a cada lado que nace del centro y se extiende hacia fuera, con el mandala pequeño en
 * medio que se enciende y gira una vuelta al llegar.
 */
export function RayaMandala({ color }: { color: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 0.8 });
  const on = reduce || visto;
  const raya = (lado: "izq" | "der") => (
    <MotionBox
      flex="1"
      maxW="320px"
      h="1px"
      bg={`linear-gradient(to ${lado === "izq" ? "left" : "right"}, ${color}00, ${color}99)`}
      style={{ transformOrigin: lado === "izq" ? "right center" : "left center" }}
      initial={reduce ? false : { scaleX: 0 }}
      animate={{ scaleX: on ? 1 : 0 }}
      transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
    />
  );
  return (
    <Flex ref={ref} align="center" justify="center" gap={{ base: 4, md: 6 }} w="100%" maxW="1180px" mx="auto" px={{ base: 6, md: 10, lg: 16 }}>
      {raya("izq")}
      <MotionBox
        initial={reduce ? false : { opacity: 0, scale: 0.4, rotate: -120 }}
        animate={on ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.4, rotate: -120 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <MandalaTinte h={{ base: "26px", md: "32px" }} color={color} />
      </MotionBox>
      {raya("der")}
    </Flex>
  );
}

/**
 * Foto de la portada: se descorre al entrar, luego FLOTA despacio (sube y baja unos píxeles) y lleva por fuera un
 * segundo filo que se dibuja con retraso. Si el fichero aún no existe, no se pinta (el texto ocupa el ancho).
 */
export function FotoPsico({ src, desde, listo = true, color, delay = 0, respira = false }: { src: string; desde: "izq" | "der"; listo?: boolean; color: string; delay?: number; /** La imagen se acerca y se aleja muy despacio. */ respira?: boolean }) {
  const reduce = useReducedMotion();
  const [rota, setRota] = useState(false);
  if (rota) return null;
  return (
    <MotionBox
      w={{ base: "260px", md: "340px", lg: "400px" }}
      flexShrink={0}
      animate={reduce ? undefined : { y: [0, -9, 0] }}
      transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
    >
      <Box position="relative">
        <MotionBox
          position="absolute"
          inset="-9px"
          borderRadius="30px"
          border={`1px solid ${color}66`}
          pointerEvents="none"
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={listo ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
          transition={{ duration: 1.1, delay: delay + 0.9, ease: EASE }}
        />
        <FotoViva desde={desde} listo={listo} delay={delay} radio="22px" border={`1.5px solid ${color}`} sx={{ aspectRatio: "4 / 5" }}>
          <Image src={src} alt="" w="100%" h="100%" objectFit="cover" display="block" onError={() => setRota(true)} sx={respira ? { "@keyframes fotoRespira": { from: { transform: "scale(1)" }, to: { transform: "scale(1.07)" } }, animation: "fotoRespira 16s ease-in-out infinite alternate", "@media (prefers-reduced-motion: reduce)": { animation: "none" } } : undefined} />
        </FotoViva>
      </Box>
    </MotionBox>
  );
}

/**
 * El botón de reservar, alargado y transparente: un brillo fino lo cruza de vez en cuando, la flecha se adelanta al
 * pasar el puntero y el botón se eleva.
 */
export function BotonReserva({ onClick, color, children, ancho = "100%" }: { onClick: () => void; color: string; children: React.ReactNode; ancho?: string }) {
  return (
    <Flex
      as="button"
      type="button"
      role="group"
      onClick={onClick}
      position="relative"
      overflow="hidden"
      align="center"
      justify="center"
      gap={{ base: 3, md: 5 }}
      w={ancho}
      px={{ base: 8, md: 10 }}
      py={{ base: "14px", md: "16px" }}
      borderRadius="full"
      bg="transparent"
      color={color}
      border={`1.5px solid ${color}`}
      fontFamily="'EB Garamond', serif"
      fontWeight="700"
      fontSize={{ base: "md", md: "lg" }}
      letterSpacing="0.16em"
      textTransform="uppercase"
      textAlign="center"
      lineHeight="1.3"
      cursor="pointer"
      transition="transform 0.3s cubic-bezier(0.22,1,0.36,1), background 0.3s ease"
      _hover={{ transform: "translateY(-3px)", bg: `${color}14` }}
      _active={{ transform: "translateY(0) scale(0.99)" }}
      _focusVisible={focoBlanco}
    >
      {/* El brillo: una franja de luz que cruza el botón cada pocos segundos. */}
      <Box
        position="absolute"
        top={0}
        bottom={0}
        w="30%"
        pointerEvents="none"
        bg={`linear-gradient(105deg, transparent, ${color}33, transparent)`}
        sx={{
          "@keyframes botonBrillo": { "0%": { left: "-40%" }, "35%, 100%": { left: "130%" } },
          animation: "botonBrillo 5.5s ease-in-out 1.5s infinite",
          "@media (prefers-reduced-motion: reduce)": { animation: "none", display: "none" },
        }}
      />
      <Box position="relative">{children}</Box>
      <Box position="relative" display="flex" transition="transform 0.35s cubic-bezier(0.22,1,0.36,1)" _groupHover={{ transform: "translateX(6px)" }}>
        <FlechaBonita size="30px" grosor={2} />
      </Box>
    </Flex>
  );
}
