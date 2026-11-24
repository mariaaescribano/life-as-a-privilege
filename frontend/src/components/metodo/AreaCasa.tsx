import React, { useEffect, useMemo, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Reveal, Pop } from "../global/Reveal";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { Glifo } from "./Glifo";
import { TextoPorSecciones, construirSecciones } from "./TextoPorSecciones";
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

type Colocado = { cuerpo: Cuerpo; signo: string; grado: number };
type DeLaCasa = { planetas: Colocado[]; carta: CartaNatal | null };

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
  "---",
  "Cada «---» abre una caja nueva, con la foto de fondo puesta otra vez, y el texto se lee bajando por la página.",
].join("\n\n");

export function AreaCasa({ n, texto, pendiente, demo = false, medio, cargandoTexto = false, alCambiarComic }: {
  n: number; texto: string; pendiente: string; demo?: boolean;
  /** Avisa de si el cómic de entrada está abierto (la página no enseña su pie hasta que se cierra). */
  alCambiarComic?: (abierto: boolean) => void;
  /** Se está leyendo el texto de esta persona: no enseñar aún el aviso de «pendiente». */
  cargandoTexto?: boolean;
  /** Lo que va entre la fila de círculos y el texto (la barra de progreso y la raya, que pone la página). */
  medio?: React.ReactNode;
}) {
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
  useEffect(() => { alCambiarComic?.(comicAbierto); }, [comicAbierto]); // eslint-disable-line react-hooks/exhaustive-deps

  // 2 · el texto, en cajas seguidas (una por sección), leyéndolo bajando por la página.
  const contenido = texto.trim() || (demo ? DEMO_TEXTO : "");
  const secciones = useMemo(() => construirSecciones(contenido), [contenido]);
  const hay = secciones.length > 0;

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

      {/* Hasta que se cierra el cómic de entrada no se monta nada: así las entradas animadas se ven de verdad. */}
      {!comicAbierto && (<>
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
      </>)}

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

      {!comicAbierto && (<>
      {/* 2 · el texto: una caja por sección (las separa «---»), cada una con su foto de fondo, todo el ancho, sin scroll propio */}
      {hay ? (
        <TextoPorSecciones secciones={secciones} />
      ) : (
        <Reveal direction="up" distance={26} duration={0.8} delay={0.45} w="100%" display="flex">
          <Flex position="relative" direction="column" w="100%" borderRadius="2xl" overflow="hidden">
            <DisciplinaBgLayer nom={astrologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 5, md: 10 }} py={{ base: 6, md: 8 }}>
              <Text color={astrologiaTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.8}>{cargandoTexto ? "" : pendiente}</Text>
            </Box>
          </Flex>
        </Reveal>
      )}
      </>)}
    </>
  );
}
