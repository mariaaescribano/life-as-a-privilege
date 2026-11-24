import React, { useEffect, useMemo, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Reveal, Pop } from "../global/Reveal";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { Glifo } from "./Glifo";
import { IntroComicModal } from "./IntroComicModal";
import { VINETAS_CASAS, VINETAS_PLANETAS } from "./ComicAstrologiaModal";
import { AstrologiaLoader } from "./comicLoaders";
import type { Vineta } from "./ComicViewer";
import { rutaArea } from "./astrologiaAreas";
import { cartaDemo } from "./CartaAstral3D/demoChart";
import { CUERPOS, ZODIAC_SIGNS, type Cuerpo } from "./astrologiaData";
import { casasDelPlaneta } from "./astrologiaCasas";
import { useNombresAstro } from "./astrologiaNombres";
import type { CartaNatal } from "./CartaAstral3D/types";
import { API_URL, astrologiaNom, astrologiaTxt, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";

/**
 * EL CUERPO DE UNA ÁREA (la presentación nueva, probada en el Área I):
 *   0. Al entrar, se abre la ILUSTRACIÓN INMERSIVA de esa casa con su texto (el cómic de «Las Casas», una viñeta por
 *      casa: foto a la izquierda, texto a la derecha). Se cierra con la X, al terminar o con Escape.
 *   1. Debajo del header, UNA FILA de círculos: un planeta por círculo (los que tiene esa persona en esa casa).
 *   2. Abajo, a la manera del cómic: a la IZQUIERDA la casa (su ilustración) con sus planetas puestos encima;
 *      a la DERECHA el texto de María, grande y por PASOS (uno o dos párrafos cada vez, con puntos y flechas),
 *      para que no se haga largo ni haya que hacer scroll.
 * Los planetas salen de la carta natal de la persona (la misma de «Tu Carta Astral»).
 */

const MotionBox = motion(Box);

type Colocado = { cuerpo: Cuerpo; signo: string; grado: number };
type DeLaCasa = { planetas: Colocado[]; carta: CartaNatal | null };

/** Los símbolos de planeta/punto: un párrafo que EMPIEZA por uno es la definición de ese planeta. */
const GLIFOS: Record<string, string> = Object.fromEntries(CUERPOS.filter((c) => c.key !== "ascendente").map((c) => [c.symbol, c.color]));
const empiezaPorGlifo = (p: string) => !!GLIFOS[Array.from(p.trimStart())[0] ?? ""];

/** Aclara un color hacia el blanco (los colores oscuros de algunos planetas no se leen sobre el cielo). */
function aclarar(hex: string, k = 0.4): string {
  const n = parseInt(hex.slice(1), 16);
  const m = (v: number) => Math.round(v + (255 - v) * k);
  return `rgb(${m((n >> 16) & 255)}, ${m((n >> 8) & 255)}, ${m(n & 255)})`;
}

type Paso = { parrafos: string[]; nueva: boolean };

/**
 * El texto → pasos. Una línea «---» separa SECCIONES (el primer paso de cada sección nueva lleva una rayita arriba). Dentro
 * de una sección los párrafos se agrupan hasta ≈ `tope` caracteres, sin partir ninguno; y un párrafo que empieza por el
 * símbolo de un planeta (su definición) abre siempre un paso nuevo.
 */
function construirPasos(texto: string, tope = 420): Paso[] {
  const pasos: Paso[] = [];
  const secciones = texto.replace(/\r/g, "").split(/^[ \t]*-{3,}[ \t]*$/m).map((x) => x.trim()).filter(Boolean);
  secciones.forEach((sec, si) => {
    let actual: Paso = { parrafos: [], nueva: si > 0 };
    let largo = 0;
    for (const p of sec.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)) {
      if (actual.parrafos.length && (empiezaPorGlifo(p) || largo + p.length > tope)) {
        pasos.push(actual);
        actual = { parrafos: [], nueva: false };
        largo = 0;
      }
      actual.parrafos.push(p);
      largo += p.length;
    }
    if (actual.parrafos.length) pasos.push(actual);
  });
  return pasos;
}

/** **negrita** y *cursiva* dentro de un párrafo. */
function conMarcas(texto: string): React.ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean).map((t, i) =>
    t.startsWith("**") ? <strong key={i}>{t.slice(2, -2)}</strong>
      : t.startsWith("*") ? <em key={i}>{t.slice(1, -1)}</em>
      : <React.Fragment key={i}>{t}</React.Fragment>);
}

/** Un párrafo del texto. Si es la definición de un planeta, va en cursiva, con su símbolo (en su color) delante. */
function Parrafo({ texto, ultimo }: { texto: string; ultimo: boolean }) {
  const letras = Array.from(texto.trimStart());
  const simbolo = letras[0];
  if (GLIFOS[simbolo]) {
    const resto = letras.slice(1).join("").trimStart();
    return (
      <Flex gap={4} align="flex-start" mb={ultimo ? 0 : 6} fontStyle="italic" opacity={0.92}>
        <Box flexShrink={0} mt="0.3em" display="flex"><Glifo symbol={simbolo} color={aclarar(GLIFOS[simbolo])} size={34} /></Box>
        <Text>{conMarcas(resto)}</Text>
      </Flex>
    );
  }
  return <Text mb={ultimo ? 0 : 6}>{conMarcas(texto)}</Text>;
}

/** La casa `n` de esta persona: su carta (para dibujar la casa) y los planetas que hay en ella (los que están sobre una cúspide cuentan en las dos). */
function useLaCasa(n: number, demo: boolean): DeLaCasa {
  const [cartaReal, setCartaReal] = useState<CartaNatal | null>(null);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    let vivo = true;
    axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`)
      .then((r) => { if (vivo) setCartaReal(r.data ?? null); })
      .catch(() => { /* sin carta, sin dibujo */ });
    return () => { vivo = false; };
  }, []);
  return useMemo<DeLaCasa>(() => {
    const valida = !!cartaReal && Array.isArray(cartaReal.cusps) && cartaReal.cusps.length >= 12;
    const carta = valida ? cartaReal : demo ? cartaDemo : null;
    if (!carta) return { planetas: [], carta: null };
    const planetas: Colocado[] = [];
    for (const c of CUERPOS) {
      const p = carta.planetas.find((x) => x.planeta === c.key);
      if (!p) continue;
      if (!casasDelPlaneta(p, carta.cusps).includes(n)) continue;
      planetas.push({ cuerpo: c, signo: ZODIAC_SIGNS[p.signoIdx]?.name ?? "", grado: p.grado });
    }
    return { planetas, carta };
  }, [cartaReal, n, demo]);
}
const DEMO_TEXTO = [
  "Texto de ejemplo, solo para ver el diseño. Aquí irá lo que tú escribas para esta área.",
  "Cada paso enseña uno o dos párrafos, grandes, en una caja a todo el ancho.",
  "Con los puntos y las flechas de abajo (o las flechas del teclado) se pasa de uno a otro, sin scroll y sin que la página se alargue.",
  "El último paso se queda quieto; para seguir, el botón de arriba te lleva al área siguiente.",
].join("\n\n");

export function AreaCasa({ n, texto, pendiente, demo = false, medio, cargandoTexto = false }: {
  n: number; texto: string; pendiente: string; demo?: boolean;
  /** Se está leyendo el texto de esta persona: no enseñar aún el aviso de «pendiente». */
  cargandoTexto?: boolean;
  /** Lo que va entre la fila de círculos y el texto (la barra de progreso y la raya, que pone la página). */
  medio?: React.ReactNode;
}) {
  const reducir = useReducedMotion();
  const navigate = useNavigate();
  const nombres = useNombresAstro();
  const { planetas } = useLaCasa(n, demo);

  // El visor inmersivo de UN planeta, que se abre al pulsar su círculo: la explicación del planeta EN SÍ (la del cómic de
  // los planetas), no la de la casa donde lo tiene esta persona. Solo la X: sin flechas.
  const [visor, setVisor] = useState<{ vinetas: Vineta[]; color: string } | null>(null);
  const abrirPlaneta = (c: Cuerpo) => {
    const v = VINETAS_PLANETAS.find((x) => x.src.endsWith(`/${c.key}.webp`));
    if (!v) return;
    setVisor({ color: c.color, vinetas: [{ ...v, titulo: nombres.cuerpo(c.key), colorTitulo: c.color }] });
  };

  // 0 · la ilustración inmersiva de la casa: sale cada vez que se entra en el área.
  const [comicAbierto, setComicAbierto] = useState(true);
  useEffect(() => { setComicAbierto(true); }, [n]);

  // 2 · el texto, por pasos.
  const contenido = texto.trim() || (demo ? DEMO_TEXTO : "");
  const pasos = useMemo(() => construirPasos(contenido), [contenido]);
  const [i, setI] = useState(0);
  useEffect(() => { setI(0); }, [n, contenido]);
  const hay = pasos.length > 0;
  const ir = (d: number) => setI((x) => Math.min(Math.max(x + d, 0), Math.max(pasos.length - 1, 0)));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") ir(1);
      else if (e.key === "ArrowLeft") ir(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <>
      {/* 0 · la ilustración inmersiva de la casa, con su texto */}
      <IntroComicModal
        isOpen={comicAbierto}
        vinetas={VINETAS_CASAS[n - 1] ? [VINETAS_CASAS[n - 1]] : []}
        themeColor={astrologiaTxt}
        loader={<AstrologiaLoader color={astrologiaTxt} />}
        // Sin X: solo flechas. La de la izquierda vuelve a la página anterior (el área anterior, o Tu Carta Astral);
        // la de la derecha sigue a lo que viene: el resto de esta área.
        soloFlechas
        alAnterior={() => navigate(n > 1 ? rutaArea(n - 1) : "/metodo/astrologia/introduccion")}
        onClose={() => setComicAbierto(false)}
        onComplete={() => setComicAbierto(false)}
      />

      {/* 1 · justo debajo del header: la fila de círculos, un planeta por círculo. Al pulsar uno, su ilustración inmersiva. */}
      {planetas.length > 0 && (
        <Flex w="100%" justify="center" align="flex-start" gap={{ base: 4, md: 7 }} wrap="wrap">
          {planetas.map(({ cuerpo }, k) => (
            <Reveal key={cuerpo.key} direction="up" distance={14} duration={0.6} delay={0.25 + k * 0.1}>
              <Pop levanta={4}>
                <Box
                  as="button" type="button" onClick={() => abrirPlaneta(cuerpo)}
                  aria-label={nombres.cuerpo(cuerpo.key)}
                  display="flex" flexDirection="column" alignItems="center" gap={2} cursor="pointer"
                  _focusVisible={{ outline: `2px solid ${T}`, outlineOffset: "4px", borderRadius: "full" }}
                >
                  <Flex
                    position="relative" overflow="hidden" align="center" justify="center"
                    w={{ base: "64px", md: "84px" }} h={{ base: "64px", md: "84px" }} borderRadius="full"
                  >
                    <DisciplinaBgLayer nom={astrologiaNom} borderRadius="full" />
                    <Box position="relative" zIndex={1} display="flex"><Glifo symbol={cuerpo.symbol} color={cuerpo.color} size={44} /></Box>
                  </Flex>
                  <Text color={T} fontSize={{ base: "sm", md: "md" }} fontWeight="600" letterSpacing="0.06em">{nombres.cuerpo(cuerpo.key)}</Text>
                </Box>
              </Pop>
            </Reveal>
          ))}
        </Flex>
      )}

      {medio}

      {/* El visor inmersivo del planeta: solo la X (sin flechas). */}
      <IntroComicModal
        isOpen={!!visor}
        vinetas={visor?.vinetas ?? []}
        themeColor={visor?.color ?? astrologiaTxt}
        textColor={visor?.color}
        loader={<AstrologiaLoader color={visor?.color ?? astrologiaTxt} />}
        sinFlechas
        onClose={() => setVisor(null)}
        onComplete={() => setVisor(null)}
      />

      {/* 2 · el texto, grande y por pasos (sin scroll): ocupa todo el ancho */}
      <Reveal direction="up" distance={26} duration={0.8} delay={0.45} w="100%" display="flex">
        <Flex position="relative" direction="column" w="100%" borderRadius="2xl" overflow="hidden">
          <DisciplinaBgLayer nom={astrologiaNom} borderRadius="2xl" />
          <Flex position="relative" zIndex={1} direction="column" flex="1" px={{ base: 6, md: 12 }} py={{ base: 7, md: 10 }} gap={6}>
            {/* El hueco del texto tiene SIEMPRE el mismo alto: pasar de un paso a otro no mueve la página. */}
            <Flex flex="1" align="center" minH={{ base: "280px", md: "300px" }}>
              {hay ? (
                <AnimatePresence mode="wait" initial={false}>
                  <MotionBox
                    key={i}
                    initial={reducir ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducir ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    color={astrologiaTxt} fontSize={{ base: "xl", md: "3xl" }} lineHeight="1.62" letterSpacing="0.005em" w="100%"
                  >
                    {pasos[i].nueva && <Box w="56px" h="1px" bg={astrologiaTxt} opacity={0.55} mb={7} />}
                    {pasos[i].parrafos.map((p, k, arr) => (
                      <Parrafo key={k} texto={p} ultimo={k === arr.length - 1} />
                    ))}
                  </MotionBox>
                </AnimatePresence>
              ) : (
                <Text color={astrologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontStyle="italic" opacity={0.8}>{cargandoTexto ? "" : pendiente}</Text>
              )}
            </Flex>

            {pasos.length > 1 && (
              <Flex align="center" justify="space-between" gap={3}>
                <Flechita dir="prev" off={i === 0} onClick={() => ir(-1)} />
                {pasos.length > 8 ? (
                  // Con muchos pasos los puntos no caben: una cifra y una línea fina que se llena.
                  <Flex direction="column" align="center" gap={2} aria-hidden>
                    <Text color={astrologiaTxt} fontSize="md" letterSpacing="0.12em" opacity={0.85} sx={{ fontVariantNumeric: "tabular-nums" }}>{i + 1} / {pasos.length}</Text>
                    <Box w="120px" h="2px" borderRadius="full" bg={`${astrologiaTxt}33`} overflow="hidden">
                      <Box h="100%" w={`${((i + 1) / pasos.length) * 100}%`} bg={astrologiaTxt} transition="width 0.4s cubic-bezier(0.22,1,0.36,1)" />
                    </Box>
                  </Flex>
                ) : (
                  <Flex gap={2} align="center" aria-hidden>
                    {pasos.map((_, k) => (
                      <Box key={k} w={k === i ? "22px" : "8px"} h="8px" borderRadius="full" bg={astrologiaTxt} opacity={k === i ? 1 : 0.35}
                           transition="all 0.35s cubic-bezier(0.22,1,0.36,1)" />
                    ))}
                  </Flex>
                )}
                <Flechita dir="next" off={i === pasos.length - 1} onClick={() => ir(1)} />
              </Flex>
            )}
          </Flex>
        </Flex>
      </Reveal>
    </>
  );
}

function Flechita({ dir, off, onClick }: { dir: "prev" | "next"; off: boolean; onClick: () => void }) {
  return (
    <Box
      as="button" type="button" onClick={onClick} disabled={off}
      aria-label={dir === "prev" ? "←" : "→"}
      w="44px" h="44px" borderRadius="full" display="flex" alignItems="center" justifyContent="center"
      color={astrologiaTxt} border={`1.5px solid ${astrologiaTxt}`} bg="transparent"
      opacity={off ? 0.3 : 1} cursor={off ? "default" : "pointer"} transition="opacity 0.25s ease, transform 0.25s ease"
      _hover={off ? undefined : { transform: dir === "prev" ? "translateX(-2px)" : "translateX(2px)" }}
      _focusVisible={{ outline: `2px solid ${astrologiaTxt}`, outlineOffset: "2px" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 -960 960 960" width="22" fill="currentColor">
        <path d={dir === "prev" ? "M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" : "M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"} />
      </svg>
    </Box>
  );
}
