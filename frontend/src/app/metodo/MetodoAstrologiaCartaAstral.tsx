import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg, SPACE_IMG } from "../../components/metodo/SpaceBg";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import type { Vineta } from "../../components/metodo/ComicViewer";
import { AstrologiaLoader } from "../../components/metodo/comicLoaders";
import { glowHeader } from "../../components/metodo/FotoBox";
import { Glifo, GlifoSigno } from "../../components/metodo/Glifo";
import { MarcaLeido } from "../../components/metodo/MarcaLeido";
import { focoBlanco } from "../../components/global/foco";
import { useNombresAstro } from "../../components/metodo/astrologiaNombres";
import { useCartaPlanetas, valorOf } from "../../components/metodo/Planetas";
import { CUERPOS, ZODIAC_SIGNS, type Cuerpo, type CuerpoKey } from "../../components/metodo/astrologiaData";
import { casasDelPlaneta } from "../../components/metodo/astrologiaCasas";
import type { CartaNatal } from "../../components/metodo/CartaAstral3D/types";
import { fetchAstroTexto } from "../../data/astrologiaTextosApi";
import { useImagesReady } from "../../hooks/useImagesReady";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { esMariaMirando } from "../../api/persona";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";
import { useT } from "../../i18n";

/** Qué es una caja: el planeta en su signo, o en una de sus casas. */
type Faceta = { tipo: "signo"; signo: string } | { tipo: "casa"; casa: number };

interface PlanetaConCajas {
  cuerpo: Cuerpo;
  signo: string;
  /** Una casa casi siempre; dos cuando el planeta está sobre la cúspide (ver astrologiaCasas.ts). */
  casas: number[];
}

/** Texto de un arquetipo → párrafos para el visor: primero las frases del resumen, luego el cuerpo. */
function aParrafos(texto: string): { parrafos: string[]; destacadas: number } {
  const m = texto.match(/^[ \t]*---[ \t]*$/m);
  const resumen = m && m.index != null ? texto.slice(0, m.index).trim() : "";
  const cuerpo = m && m.index != null ? texto.slice(m.index + m[0].length).trim() : texto;
  const lineas = resumen ? resumen.split(/\n+/).map((l) => l.trim()).filter(Boolean) : [];
  const parrafos = cuerpo.split(/\n\s*\n+/g).map((p) => p.trim()).filter(Boolean);
  return { parrafos: [...lineas, ...parrafos], destacadas: lineas.length };
}

export default function MetodoAstrologiaCartaAstral() {
  const t = useT();
  const n = useNombresAstro();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [carta, setCarta] = useState<CartaNatal | null>(null);
  const { carta: cartaPlanetas, loading: cargandoProgreso, actualizar } = useCartaPlanetas();
  const fotosListas = useImagesReady([SPACE_IMG]);
  const { bloqueada, cargado } = useAstrologiaProgreso();

  // El visor: las cajas del planeta pulsado, ya en la que se ha pulsado.
  const [visor, setVisor] = useState<{ vinetas: Vineta[]; inicial: number; color: string; planeta: PlanetaConCajas } | null>(null);
  const [abriendo, setAbriendo] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    window.scrollTo({ top: 0, behavior: "auto" });

    (async () => {
      try {
        // Las dos peticiones A LA VEZ: son independientes.
        const [estadoRes, res] = await Promise.all([
          axios.get<{ solicitud_enviada_at?: string | null; link_carta?: string | null; retos?: { id: string }[] } | null>(`${API_URL}/metodo-astrologia/${userId}`),
          axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`),
        ]);
        // Sin sus datos no hay carta: se vuelve a «Tu Carta Astral» a darlos. María, mirando, no se
        // echa: entra siempre (los datos pueden estar puestos desde el panel, sin solicitud enviada).
        if (!estadoRes.data?.solicitud_enviada_at && !esMariaMirando()) { navigate("/metodo/astrologia/introduccion"); return; }

        let cartaCargada = res.data;

        // Cuando cambia el algoritmo (entrada nueva de Quirón, calibración de M0,
        // fix de cusps, etc.) bump esta clave: cualquier carta guardada antes
        // disparará un recálculo automático una sola vez por usuario.
        const CARTA_CALC_VERSION = "v3-chiron-m0-28";
        const versionKey = `cartaCalcVersion:${userId}`;
        const tieneQuiron = !!cartaCargada?.planetas?.some((p) => p.planeta === "quiron");
        const needsRefresh = !!cartaCargada && (!tieneQuiron || localStorage.getItem(versionKey) !== CARTA_CALC_VERSION);
        if (needsRefresh) {
          try {
            const rec = await axios.post<{ success: boolean; carta?: CartaNatal }>(
              `${API_URL}/metodo-astrologia/carta-natal/${userId}/recalcular`, {},
            );
            if (rec.data?.success && rec.data.carta) {
              cartaCargada = rec.data.carta;
              localStorage.setItem(versionKey, CARTA_CALC_VERSION);
            }
          } catch { /* si falla el recálculo seguimos con la carta antigua */ }
        }
        setCarta(cartaCargada ?? null);
      } catch {
        setCarta(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Cada planeta con su signo y su(s) casa(s), TAL COMO LOS DICE LA CARTA. El
  // ascendente no entra: va en el paso anterior, con el Sol y la Luna.
  const planetas: PlanetaConCajas[] = useMemo(() => {
    if (!carta) return [];
    const out: PlanetaConCajas[] = [];
    for (const c of CUERPOS) {
      if (c.key === "ascendente") continue;
      const p = carta.planetas.find((x) => x.planeta === c.key);
      const signo = p ? ZODIAC_SIGNS[p.signoIdx]?.name : undefined;
      if (!p || !signo) continue;
      out.push({ cuerpo: c, signo, casas: casasDelPlaneta(p, carta.cusps) });
    }
    return out;
  }, [carta]);

  // El signo y la casa de la carta se anotan en el progreso (si faltan o han
  // cambiado): sin ellos, «leído» no cuenta. Una sola vez por planeta y valor.
  const sincronizado = useRef<Set<string>>(new Set());
  useEffect(() => {
    for (const p of planetas) {
      const v = valorOf(cartaPlanetas, p.cuerpo.key);
      const marca = `${p.cuerpo.key}|${p.signo}|${p.casas[0]}`;
      if (sincronizado.current.has(marca)) continue;
      sincronizado.current.add(marca);
      if (v.signo !== p.signo) actualizar(p.cuerpo.key, "signo", p.signo);
      if (v.casa !== p.casas[0]) actualizar(p.cuerpo.key, "casa", p.casas[0]);
    }
  }, [planetas, cartaPlanetas, actualizar]);

  const leidaCaja = (key: CuerpoKey, f: Faceta, indiceCasa = 0): boolean => {
    const v = valorOf(cartaPlanetas, key);
    if (f.tipo === "signo") return !!v.profundizadoSigno;
    return indiceCasa === 0 ? !!v.profundizadoCasa : !!v.profundizadoCasa2;
  };

  // El planeta que se está viendo (índice en `planetas`). Arranca en el primero SIN leer, para que
  // quien vuelve siga justo donde lo dejó.
  const [sel, setSel] = useState(0);
  const arranque = useRef(false);
  const planetaLeido = (pl: PlanetaConCajas): boolean =>
    leidaCaja(pl.cuerpo.key, { tipo: "signo", signo: pl.signo }) &&
    pl.casas.every((c, ci) => leidaCaja(pl.cuerpo.key, { tipo: "casa", casa: c }, ci));
  useEffect(() => {
    if (arranque.current || planetas.length === 0 || cargandoProgreso) return;
    arranque.current = true;
    const primero = planetas.findIndex((pl) => !planetaLeido(pl));
    setSel(primero >= 0 ? primero : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planetas, cargandoProgreso]);

  // Abre el visor en la caja pulsada. Las cajas del mismo planeta van seguidas en
  // el visor, así que se puede pasar del signo a la casa sin cerrar.
  const abrir = async (p: PlanetaConCajas, f: Faceta, indiceCasa = 0) => {
    if (abriendo) return;
    setAbriendo(true);
    const k = p.cuerpo.key;
    const facetas: Faceta[] = [{ tipo: "signo", signo: p.signo }, ...p.casas.map((c) => ({ tipo: "casa", casa: c }) as Faceta)];
    const textos = await Promise.all(facetas.map((fa) =>
      fa.tipo === "signo" ? fetchAstroTexto(k, "signo", fa.signo) : fetchAstroTexto(k, "casa", String(fa.casa))));
    const foto = `/viñetas/astrologia/planetas/${k}.webp`;
    const vinetas: Vineta[] = facetas.map((fa, i) => {
      const titulo = fa.tipo === "signo" ? n.enSigno(k, fa.signo) : n.enCasa(k, fa.casa);
      const partes = textos[i] ? aParrafos(textos[i]!) : null;
      return {
        src: foto,
        titulo,
        paragraphs: partes ? partes.parrafos : [t("metodo.astro.textoNoDisponible", { arquetipo: titulo })],
        // Primero el título, luego las frases destacadas, luego el texto.
        destacadas: partes?.destacadas ?? 0,
      };
    });
    const inicial = f.tipo === "signo" ? 0 : 1 + indiceCasa;
    setVisor({ vinetas, inicial, color: p.cuerpo.color, planeta: p });
    // Abrirlo ya NO lo marca como leído: se marca al pulsar «Leído», abajo del todo de la última viñeta
    // (así hay que llegar al final y no se adivina qué ha leído).
    setAbriendo(false);
  };

  // «Leído»: marca como leído TODO lo de ese planeta (el signo y cada casa) y cierra el visor.
  const marcarPlanetaLeido = () => {
    if (!visor) return;
    const p = visor.planeta;
    actualizar(p.cuerpo.key, "profundizadoSigno", true);
    p.casas.forEach((_, ci) => actualizar(p.cuerpo.key, ci === 0 ? "profundizadoCasa" : "profundizadoCasa2", true));
    setVisor(null);
  };

  if (loading || !fotosListas) return <RecorridoLoading />;

  const maria = esMariaMirando();
  // «Casas» se abre cuando TODAS las cajas de TODOS sus planetas están leídas (el signo y cada casa, también la
  // segunda cuando el planeta está sobre una cúspide). Antes se miraba solo el signo y la primera casa.
  const todoLeido = planetas.length > 0 && planetas.every(planetaLeido);
  const faltaLeer = !maria && !todoLeido;
  const cerradoPorMaria = !maria && cargado && bloqueada(7);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={{ base: 6, md: 8 }}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={t("metodo.astro.paso.arquetipos")}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 6, total: 12 }}
              mb={0}
              prev={{ label: `← ${t("metodo.astro.paso.puntosClave")}`, onClick: () => navigate("/metodo/astrologia/lectura") }}
              next={{
                label: `${t("metodo.astro.paso.casas")} →`,
                onClick: () => navigate("/metodo/astrologia/casas"),
                disabled: faltaLeer || cerradoPorMaria,
                disabledTooltip: faltaLeer ? t("metodo.astro.leeTodosArquetipos") : undefined,
              }}
            />
          </Reveal>

          {/* Los planetas en pequeño, bajo el header: cada uno en su círculo y de su color. Se ENCIENDEN
              al leerlos (y los que faltan siguen apagados): el avance se ve de un vistazo. */}
          {planetas.length > 0 && (
            <Flex wrap="wrap" justify="center" gap={{ base: 2, md: 2.5 }} w="100%" role="list">
              {planetas.map((pl, i) => {
                const leido = planetaLeido(pl);
                const activo = i === sel;
                const c = pl.cuerpo.color;
                return (
                  <Box
                    key={`${pl.cuerpo.key}-${leido ? "on" : "off"}`}
                    as="button"
                    type="button"
                    role="listitem"
                    onClick={() => setSel(i)}
                    aria-label={n.cuerpo(pl.cuerpo.key)}
                    title={n.cuerpo(pl.cuerpo.key)}
                    aria-current={activo}
                    w={{ base: "38px", md: "46px" }}
                    h={{ base: "38px", md: "46px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    bg="rgba(8,13,30,0.72)"
                    border={`1.5px solid ${activo ? "white" : leido ? c : `${c}55`}`}
                    opacity={leido || activo ? 1 : 0.42}
                    style={{ filter: leido || activo ? "none" : "grayscale(0.7)" }}
                    boxShadow={glowHeader(astrologiaTxt)}
                    transition="opacity 0.5s ease, filter 0.5s ease, box-shadow 0.5s ease, border-color 0.3s ease, transform 0.25s ease"
                    _hover={{ transform: "translateY(-2px)" }}
                    _focusVisible={focoBlanco}
                    sx={leido ? {
                      animation: `chipEnciende 0.7s cubic-bezier(0.22,1,0.36,1) ${Math.min(i * 0.05, 0.6)}s both`,
                      "@keyframes chipEnciende": {
                        "0%": { transform: "scale(0.8)", opacity: 0.4 },
                        "55%": { transform: "scale(1.28)", opacity: 1 },
                        "100%": { transform: "scale(1)", opacity: 1 },
                      },
                      "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                    } : undefined}
                  >
                    <Glifo symbol={pl.cuerpo.symbol} color={c} size={26} />
                  </Box>
                );
              })}
            </Flex>
          )}

          {/* EL VISOR: la carta a la izquierda (con el planeta que se está viendo ENGRANDECIDO) y, a la
              derecha, las cajas de ese planeta y debajo los dos botones. Todo con el cielo de Astrología.
              La columna reserva SIEMPRE el hueco de tres cajas: al pasar de un planeta con dos cajas a
              otro con tres, nada se mueve. */}
          {planetas.length > 0 && carta && (() => {
            const pl = planetas[Math.min(sel, planetas.length - 1)];
            const c = pl.cuerpo.color;
            const hay = (d: -1 | 1) => sel + d >= 0 && sel + d < planetas.length;
            const ir = (d: -1 | 1) => { if (hay(d)) setSel(sel + d); };
            const glowCaja = glowHeader(astrologiaTxt);
            return (
              <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "minmax(0, 1.1fr) minmax(0, 1fr)" }} gap={{ base: 4, md: 6 }}
                   alignItems="stretch" w="100%" maxW={{ md: "960px" }}>
                {/* IZQUIERDA: la foto del planeta que se está viendo (la misma de sus cómics) */}
                <Reveal direction="none" duration={0.9} position="relative" borderRadius="2xl" overflow="hidden" boxShadow={glowCaja}
                        minH={{ base: "300px", md: "100%" }}>
                  <Box key={pl.cuerpo.key} as="img" src={`/viñetas/astrologia/planetas/${pl.cuerpo.key}.webp`} alt={n.cuerpo(pl.cuerpo.key)}
                       position="absolute" inset={0} w="100%" h="100%" objectFit="cover"
                       sx={{
                         animation: "fotoPlaneta 0.6s ease both",
                         "@keyframes fotoPlaneta": { from: { opacity: 0 }, to: { opacity: 1 } },
                         "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                       }} />
                </Reveal>

                {/* DERECHA: las cajas y los botones, centrados frente a la foto */}
                <Flex key={pl.cuerpo.key} direction="column" justify="center" gap={3} w="100%"
                      sx={{
                        animation: "cambioPlaneta 0.5s cubic-bezier(0.22,1,0.36,1) both",
                        "@keyframes cambioPlaneta": { from: { opacity: 0, transform: "translateX(16px)" }, to: { opacity: 1, transform: "none" } },
                        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                      }}>
                  {/* Tres huecos fijos: las cajas que haya, y el resto vacío (mismo alto siempre). */}
                  {[0, 1, 2].map((slot) => {
                    if (slot === 0) {
                      return (
                        <CajaArquetipo
                          key="signo"
                          color={c}
                          titulo={n.enSigno(pl.cuerpo.key, pl.signo)}
                          glow={glowCaja} planeta={pl.cuerpo}
                          signo={{ nombre: n.signo(pl.signo), key: pl.signo }}
                          leida={leidaCaja(pl.cuerpo.key, { tipo: "signo", signo: pl.signo })}
                          onClick={() => void abrir(pl, { tipo: "signo", signo: pl.signo })}
                        />
                      );
                    }
                    const ci = slot - 1;
                    const cs = pl.casas[ci];
                    if (cs == null) return <Box key={`vacio-${slot}`} h={{ base: "0", md: ALTO_CAJA }} display={{ base: "none", md: "block" }} aria-hidden />;
                    return (
                      <CajaArquetipo
                        key={cs}
                        color={c}
                        titulo={n.enCasa(pl.cuerpo.key, cs)}
                        glow={glowCaja} planeta={pl.cuerpo}
                        leida={leidaCaja(pl.cuerpo.key, { tipo: "casa", casa: cs }, ci)}
                        onClick={() => void abrir(pl, { tipo: "casa", casa: cs }, ci)}
                      />
                    );
                  })}

                  {/* Los dos botones: el planeta anterior y el siguiente, con su símbolo. */}
                  <Flex gap={3} mt={1} flexShrink={0}>
                    <BotonPlaneta glow={glowCaja} dir="prev" color={c} off={!hay(-1)} onClick={() => ir(-1)}
                                  nombre={hay(-1) ? n.cuerpo(planetas[sel - 1].cuerpo.key) : ""}
                                  vecino={hay(-1) ? planetas[sel - 1].cuerpo : undefined} />
                    <BotonPlaneta glow={glowCaja} dir="next" color={c} off={!hay(1)} onClick={() => ir(1)}
                                  nombre={hay(1) ? n.cuerpo(planetas[sel + 1].cuerpo.key) : ""}
                                  vecino={hay(1) ? planetas[sel + 1].cuerpo : undefined} />
                  </Flex>
                </Flex>
              </Box>
            );
          })()}
        </Flex>
      </Flex>

      {/* El visor del cómic: a la izquierda el planeta, a la derecha el texto. */}
      <IntroComicModal
        isOpen={!!visor}
        vinetas={visor?.vinetas ?? []}
        initialIndex={visor?.inicial ?? 0}
        themeColor={visor?.color}
        // Título y texto del mismo color (el del planeta); mientras carga cada ilustración, el loader de Astrología.
        textColor={visor?.color}
        loader={<AstrologiaLoader color={visor?.color ?? astrologiaTxt} />}
        // «Leído», abajo del todo de la ÚLTIMA viñeta del planeta: marca y cierra.
        pageExtra={(_, { isLast }) => isLast ? (
          <Flex justify="center">
            <Box as="button" type="button" onClick={marcarPlanetaLeido} px={9} py="10px" borderRadius="full"
                 bg={visor?.color ?? astrologiaTxt} color="#0a1024" fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                 letterSpacing="0.04em" cursor="pointer" boxShadow={`0 0 20px ${visor?.color ?? astrologiaTxt}55`}
                 transition="transform 0.2s ease" _hover={{ transform: "translateY(-2px)" }} _focusVisible={focoBlanco}>
              {t("metodo.astro.leidoBoton")}
            </Box>
          </Flex>
        ) : null}
        onClose={() => setVisor(null)}
        onComplete={() => setVisor(null)}
      />

      <BotonCompania color={astrologiaTxt} bgColor={astrologiaBg} disciplinaNom={astrologiaNom}
                     llamadaTitulo={t("metodo.astro.reservaLlamada")}
                     queEsEsto={{ parrafos: [t("metodo.astro.arquetiposQueEs1"), t("metodo.astro.arquetiposQueEs2")] }} />
      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}

/** Alto de cada caja de la columna (siempre el mismo, haya dos o tres). */
const ALTO_CAJA = "88px";

/** Una caja: el planeta en su signo, o en su casa. Lleva el cielo de Astrología de fondo, el borde y el
 *  halo del color del planeta, y su tick arriba a la derecha si ya está leída. Se pulsa para leerla. */
function CajaArquetipo({ color, titulo, glow, planeta, signo, leida, onClick }: {
  color: string; titulo: string; glow: string; planeta: Cuerpo; signo?: { nombre: string; key: string }; leida: boolean; onClick: () => void;
}) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      position="relative"
      overflow="hidden"
      h={{ base: "76px", md: ALTO_CAJA }}
      flexShrink={0}
      w="100%"
      display="flex"
      alignItems="center"
      gap={4}
      px={{ base: 4, md: 5 }}
      borderRadius="2xl"
      border={`1px solid ${color}55`}
      boxShadow={glow}
      textAlign="left"
      cursor="pointer"
      transition="transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, border-color 0.2s ease"
      _hover={{ transform: "translateY(-2px)", borderColor: color }}
      _active={{ transform: "translateY(-1px) scale(0.99)" }}
      _focusVisible={focoBlanco}
    >
      <SpaceBg quieto overlay="rgba(8,13,30,0.42)" />
      <Flex position="relative" zIndex={1} flex="1" minW={0} align="center" gap={2} pr={leida ? 6 : 0}
            color={color} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.2" letterSpacing="0.03em"
            style={{ textShadow: `0 0 12px ${color}55, 0 1px 3px rgba(0,0,0,0.6)` }}>
        <Glifo symbol={planeta.symbol} color={color} size={24} />
        {signo ? (
          <Text as="span" noOfLines={2}>
            {titulo.slice(0, titulo.length - signo.nombre.length)}
            <Box as="span" display="inline-flex" verticalAlign="middle" mr={1.5}><GlifoSigno nombre={signo.key} color={color} size={22} /></Box>
            {signo.nombre}
          </Text>
        ) : (
          <Text as="span" noOfLines={2}>{titulo}</Text>
        )}
      </Flex>
      {leida && (
        <Box position="absolute" zIndex={2} top="8px" right="8px">
          <MarcaLeido tinta={color} bg="#0a1024" inline size="22px" iconSize="13px" />
        </Box>
      )}
    </Box>
  );
}

/** Botón de planeta anterior / siguiente: el cielo de fondo, el símbolo del planeta y su nombre. */
function BotonPlaneta({ dir, color, nombre, vecino, off, onClick, glow }: {
  glow: string; dir: "prev" | "next"; color: string; nombre: string; vecino?: Cuerpo; off: boolean; onClick: () => void;
}) {
  return (
    <Box
      as="button"
      type="button"
      onClick={off ? undefined : onClick}
      disabled={off}
      position="relative"
      overflow="hidden"
      flex="1"
      minW={0}
      display="flex"
      alignItems="center"
      justifyContent={dir === "prev" ? "flex-start" : "flex-end"}
      gap={2}
      px={4}
      py="11px"
      borderRadius="full"
      border={`1.5px solid ${off ? `${color}22` : `${color}55`}`}
      color={off ? `${vecino?.color ?? color}44` : vecino?.color ?? color}
      fontWeight="700"
      fontSize={{ base: "sm", md: "md" }}
      letterSpacing="0.03em"
      cursor={off ? "not-allowed" : "pointer"}
      opacity={off ? 0.55 : 1}
      boxShadow={off ? "none" : glow}
      transition="transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease"
      _hover={off ? undefined : { transform: "translateY(-1px)", borderColor: color }}
      _focusVisible={focoBlanco}
    >
      <SpaceBg quieto overlay="rgba(8,13,30,0.5)" />
      <Flex position="relative" zIndex={1} align="center" gap={2} minW={0}>
        {dir === "prev" && <Text as="span" aria-hidden>←</Text>}
        {vecino && <Glifo symbol={vecino.symbol} color={vecino.color} size={22} />}
        <Text as="span" noOfLines={1}>{nombre}</Text>
        {dir === "next" && <Text as="span" aria-hidden>→</Text>}
      </Flex>
    </Box>
  );
}
