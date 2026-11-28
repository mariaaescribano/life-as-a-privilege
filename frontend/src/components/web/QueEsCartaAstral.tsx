import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { Reveal } from "../global/Reveal";
import CartaEjemplo from "./CartaEjemplo";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { FlechaBonita } from "../global/FlechaBonita";
import { focoBlanco } from "../global/foco";
import PalabrasVivas from "../global/PalabrasVivas";
import { VINETAS_CASAS, VINETAS_PLANETAS, VINETAS_SIGNOS } from "../metodo/ComicAstrologiaModal";
import { FONDO_PAGINA_BEIGE as BEIGE, FONDO_PAGINA_TURQUESA as T, astrologiaNom } from "../../GlobalVariables";
import { MandalaTinte } from "../global/MandalaTinte";
import { useT } from "../../i18n";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import FotoViva, { type FotoDesde } from "../global/FotoViva";

/**
 * «¿Qué es una carta astral?»: título, una frase de apertura y tres columnas en fila (Casas · Signos · Planetas),
 * cada una con su frase ENCIMA de un box. Dentro de cada box van pasando, solas, las fotos de ese tema (las de las
 * viñetas de Ilustraciones): cada box cambia a su aire (entre 2 y 3 segundos, con su propio reloj y siempre a una
 * foto al azar), nunca los tres a la vez. Letra en marrón chocolate, sobre el beige de la página (fuera de la banda de estrellas).
 */
const rnd = (min: number, max: number) => min + Math.random() * (max - min);

const unicas = (v: { src: string }[]) => Array.from(new Set(v.map((x) => x.src)));

/** Raya fina que se abre desde el centro hacia los lados al llegar a ella (se difumina en las puntas). */
function RayaCentro() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visto = useInView(ref, { once: true, amount: 1 });
  const on = reduce || visto;
  return (
    <Box ref={ref} w="100%" h="1px" pt={0}>
      <motion.div
        style={{ height: 1, width: "100%", transformOrigin: "center", background: `linear-gradient(to right, ${T}00, ${T}99 30%, ${T}99 70%, ${T}00)` }}
        initial={reduce ? false : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: on ? 1 : 0, opacity: on ? 1 : 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </Box>
  );
}

function CajaFotos({ fotos, activo, desde, delay }: { fotos: string[]; activo: boolean; desde: FotoDesde; delay: number }) {
  const [actual, setActual] = useState(() => Math.floor(Math.random() * fotos.length));
  const [previa, setPrevia] = useState<number | null>(null);
  const actualRef = useRef(actual);
  actualRef.current = actual;
  const cargadas = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!activo || fotos.length < 2) return;
    let vivo = true;
    let timer: number | undefined;

    // Elige la siguiente al azar (distinta de la que se ve) y la descarga ANTES de enseñarla.
    const siguiente = () => {
      let n = Math.floor(Math.random() * fotos.length);
      if (n === actualRef.current) n = (n + 1 + Math.floor(Math.random() * (fotos.length - 1))) % fotos.length;
      const src = fotos[n];
      const mostrar = () => {
        if (!vivo) return;
        setPrevia(actualRef.current);
        setActual(n);
        timer = window.setTimeout(siguiente, rnd(2000, 3000));
      };
      if (cargadas.current.has(src)) { mostrar(); return; }
      const img = new window.Image();
      img.onload = img.onerror = () => { cargadas.current.add(src); mostrar(); };
      img.src = src;
    };

    // Cada caja arranca con un retraso distinto, para que no se muevan a la vez.
    timer = window.setTimeout(siguiente, rnd(800, 2600));
    return () => { vivo = false; if (timer) window.clearTimeout(timer); };
  }, [activo, fotos]);

  return (
    // Cada caja se descorre desde un lado distinto y se inclina hacia el ratón.
    <FotoViva
      desde={desde}
      delay={delay}
      radio="16px"
      w="100%"
      border={`1.5px solid ${T}80`}
      sx={{ aspectRatio: "1 / 1" }}
    >
      {previa !== null && (
        <Image key={`p${previa}`} src={fotos[previa]} alt="" position="absolute" inset={0} w="100%" h="100%" objectFit="cover" />
      )}
      <Image
        key={`a${actual}`}
        src={fotos[actual]}
        alt=""
        position="absolute"
        inset={0}
        w="100%"
        h="100%"
        objectFit="cover"
        sx={{
          // La foto nueva se funde y, a la vez, se asienta con un zoom lento.
          "@keyframes cartaFundido": { from: { opacity: 0, transform: "scale(1.08)" }, to: { opacity: 1, transform: "scale(1)" } },
          animation: "cartaFundido 1.4s cubic-bezier(0.22,1,0.36,1) both",
          "@media (prefers-reduced-motion: reduce)": { animation: "none" },
        }}
      />
    </FotoViva>
  );
}

export default function QueEsCartaAstral({ activo }: { activo: boolean }) {
  const t = useT();
  const navigate = useNavigate();
  const columnas = useMemo(
    () => [
      { frase: "astroCarta.casa" as const, fotos: unicas(VINETAS_CASAS) },
      { frase: "astroCarta.signo" as const, fotos: unicas(VINETAS_SIGNOS) },
      { frase: "astroCarta.planeta" as const, fotos: unicas(VINETAS_PLANETAS) },
    ],
    [],
  );

  return (
    <Flex direction="column" align="center" w="100%" maxW="1180px" mx="auto" px={{ base: 6, md: 10 }} gap={{ base: 6, md: 8 }} color={T} fontFamily="'EB Garamond', serif" textAlign="center">

      {/* Izquierda: una carta de ejemplo (al azar y con movimiento) y su mensaje; derecha: el texto. En móvil, el texto va debajo de la carta. */}
      <Grid w="100%" templateColumns={{ base: "1fr", md: "minmax(0, 0.9fr) minmax(0, 1.1fr)" }} gap={{ base: 8, md: 14 }} alignItems="center" textAlign="left">
        <Reveal inView direction="right" distance={30} scaleFrom={0.95} duration={1} w="100%">
          <Flex direction="column" align="center" gap={{ base: 3, md: 5 }} maxW={{ base: "340px", md: "460px" }} mx="auto" w="100%">
            {/* Box con el cielo estrellado de Astrología (el mismo de la lectura): la carta, en beige, encima. */}
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" border={`1.5px solid ${T}80`} bg="#0b1026" p={{ base: 4, md: 6 }}>
              <DisciplinaBgLayer nom={astrologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1}>
                <CartaEjemplo />
              </Box>
            </Box>
            <Text fontStyle="italic" fontSize={{ base: "md", md: "lg" }} textAlign="center" opacity={0.9}>
              {t("astroCarta.ejemplo")}
            </Text>
          </Flex>
        </Reveal>

        <Flex direction="column" gap={{ base: 4, md: 5 }}>
          <Reveal inView direction="left" distance={22} duration={0.9} mb={{ base: 2, md: 3 }}>
            <Text fontWeight="700" fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} letterSpacing="0.05em" lineHeight="1.2" textTransform="uppercase">
              <PalabrasVivas texto={t("astroCarta.titulo")} total={0.8} />
            </Text>
          </Reveal>
          {/* Cada párrafo entra con su caja y, dentro, sus palabras se encienden de una en una. */}
          {(["astroCarta.t1", "astroCarta.t2", "astroCarta.t3"] as const).map((k, i) => (
            <Reveal key={k} inView direction="left" distance={26} duration={0.9} delay={0.15 + i * 0.15}>
              <Text fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7">
                <PalabrasVivas texto={t(k)} cursivas retraso={0.2 + i * 0.15} />
              </Text>
            </Reveal>
          ))}
        </Flex>
      </Grid>

      {/* Raya que nace en el centro y se extiende hacia los dos lados, antes de las tres columnas. */}
      <RayaCentro />

      <Grid w="100%" templateColumns={{ base: "1fr", md: "repeat(3, minmax(0, 1fr))" }} gap={{ base: 8, md: 8 }} pt={{ base: 2, md: 4 }}>
        {columnas.map((c, i) => (
          <Reveal key={c.frase} inView direction="up" distance={26} scaleFrom={0.97} duration={0.9} delay={i * 0.15}>
            <Flex direction="column" gap={{ base: 3, md: 5 }} align={{ base: "center", md: "stretch" }}>
              <Text fontSize={{ base: "lg", md: "xl" }} lineHeight="1.4">
                <PalabrasVivas texto={t(c.frase)} cursivas retraso={i * 0.15} />
              </Text>
              <Box w="100%" maxW={{ base: "280px", md: "none" }} transition="transform 0.4s cubic-bezier(0.22,1,0.36,1)" _hover={{ transform: "translateY(-4px)" }}>
                <CajaFotos fotos={c.fotos} activo={activo} desde={(["izq", "abajo", "der"] as const)[i]} delay={0.35 + i * 0.12} />
              </Box>
            </Flex>
          </Reveal>
        ))}
      </Grid>

      {/* Botón de cierre: píldora de borde fino beige que se enciende al pasar el ratón; la flecha avanza. */}
      <Reveal inView direction="up" distance={18} duration={0.9} delay={0.1}>
        <Box
          as="button"
          type="button"
          role="group"
          onClick={() => navigate("/astrologia/carta-gratis")}
          position="relative"
          overflow="hidden"
          display="inline-flex"
          mt={{ base: 6, md: 10 }}
          borderRadius="full"
          border={`1.5px solid ${BEIGE}`}
          bg="#0b1026"
          color={BEIGE}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          cursor="pointer"
          transition="transform 0.3s ease, border-color 0.3s ease"
          _hover={{ transform: "translateY(-3px) scale(1.015)" }}
          _active={{ transform: "scale(0.98)" }}
          _focusVisible={focoBlanco}
        >
          {/* Fondo: el cielo estrellado de Astrología, dentro de la píldora. */}
          <Box position="absolute" inset={0} borderRadius="full" overflow="hidden" pointerEvents="none">
            <DisciplinaBgLayer nom={astrologiaNom} borderRadius="full" />
          </Box>
          <Flex
            position="relative"
            zIndex={1}
            align="center"
            justify="center"
            gap={{ base: 3, md: 4 }}
            px={{ base: 6, md: 10 }}
            py={{ base: "14px", md: "18px" }}
            fontSize={{ base: "sm", md: "lg" }}
            letterSpacing={{ base: "0.1em", md: "0.16em" }}
            textTransform="uppercase"
            textAlign="center"
          >
            <MandalaTinte h={{ base: "24px", md: "32px" }} color={BEIGE} />
            {t("astroCarta.boton")}
            <Box display="flex" transition="transform 0.35s cubic-bezier(0.22,1,0.36,1)" _groupHover={{ transform: "translateX(5px)" }}>
              <FlechaBonita size={{ base: "22px", md: "28px" }} />
            </Box>
          </Flex>
        </Box>
      </Reveal>
    </Flex>
  );
}
