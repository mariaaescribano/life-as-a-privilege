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
import { glowHeader } from "../../components/metodo/FotoBox";
import { Glifo, GlifoSigno } from "../../components/metodo/Glifo";
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

const CheckIcon = ({ color }: { color: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="15px" h="15px" fill={color} flexShrink={0}>
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </Box>
);

/** Texto de un arquetipo → párrafos para el visor: primero las frases del resumen, luego el cuerpo. */
function aParrafos(texto: string): string[] {
  const m = texto.match(/^[ \t]*---[ \t]*$/m);
  const resumen = m && m.index != null ? texto.slice(0, m.index).trim() : "";
  const cuerpo = m && m.index != null ? texto.slice(m.index + m[0].length).trim() : texto;
  const lineas = resumen ? resumen.split(/\n+/).map((l) => l.trim()).filter(Boolean) : [];
  const parrafos = cuerpo.split(/\n\s*\n+/g).map((p) => p.trim()).filter(Boolean);
  return [...lineas, ...parrafos];
}

export default function MetodoAstrologiaCartaAstral() {
  const t = useT();
  const n = useNombresAstro();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [carta, setCarta] = useState<CartaNatal | null>(null);
  const { carta: cartaPlanetas, actualizar, todoCompletado } = useCartaPlanetas();
  const fotosListas = useImagesReady([SPACE_IMG]);
  const { bloqueada, cargado } = useAstrologiaProgreso();

  // El visor: las cajas del planeta pulsado, ya en la que se ha pulsado.
  const [visor, setVisor] = useState<{ vinetas: Vineta[]; inicial: number; color: string } | null>(null);
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
        if (!estadoRes.data?.solicitud_enviada_at) { navigate("/metodo/astrologia"); return; }

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
      return {
        src: foto,
        titulo,
        paragraphs: textos[i] ? aParrafos(textos[i]!) : [t("metodo.astro.textoNoDisponible", { arquetipo: titulo })],
      };
    });
    const inicial = f.tipo === "signo" ? 0 : 1 + indiceCasa;
    setVisor({ vinetas, inicial, color: p.cuerpo.color });
    // Lo abierto cuenta como leído.
    if (f.tipo === "signo") actualizar(k, "profundizadoSigno", true);
    else actualizar(k, indiceCasa === 0 ? "profundizadoCasa" : "profundizadoCasa2", true);
    setAbriendo(false);
  };

  if (loading || !fotosListas) return <RecorridoLoading />;

  const maria = esMariaMirando();
  const faltaLeer = !maria && !todoCompletado;
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
                disabledTooltip: faltaLeer ? t("metodo.astro.leeTodosLosPlanetas") : undefined,
              }}
            />
          </Reveal>

          {/* Un bloque estrellado por planeta: su nombre y, debajo, sus cajas (una por
              signo, una por casa, y una más si está sobre la cúspide de dos casas). */}
          {planetas.map((p, i) => (
            <Reveal key={p.cuerpo.key} inView amount={0.15} direction="up" distance={30} scaleFrom={0.96}
                    delay={(i % 2) * 0.08} duration={0.7} w="100%"
                    position="relative" borderRadius="2xl" overflow="hidden" boxShadow={glowHeader(astrologiaTxt)}>
              <SpaceBg overlay="rgba(8,13,30,0.3)" />
              <Flex position="relative" zIndex={1} direction="column" align="center" gap={{ base: 4, md: 5 }}
                    px={{ base: 4, md: 8 }} py={{ base: 6, md: 8 }}>
                <Flex align="center" gap={3}>
                  <Glifo symbol={p.cuerpo.symbol} color={p.cuerpo.color} size={34} />
                  <Text color={p.cuerpo.color} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.1em"
                        textTransform="uppercase" style={{ textShadow: `0 0 12px ${p.cuerpo.color}66` }}>
                    {n.cuerpo(p.cuerpo.key)}
                  </Text>
                </Flex>

                <Flex direction={{ base: "column", md: "row" }} wrap="wrap" justify="center" gap={{ base: 3, md: 4 }} w="100%">
                  <CajaArquetipo
                    color={p.cuerpo.color}
                    titulo={n.enSigno(p.cuerpo.key, p.signo)}
                    icono={<GlifoSigno nombre={p.signo} color={p.cuerpo.color} size={30} />}
                    leida={leidaCaja(p.cuerpo.key, { tipo: "signo", signo: p.signo })}
                    onClick={() => void abrir(p, { tipo: "signo", signo: p.signo })}
                  />
                  {p.casas.map((c, ci) => (
                    <CajaArquetipo
                      key={c}
                      color={p.cuerpo.color}
                      titulo={n.enCasa(p.cuerpo.key, c)}
                      icono={<Text color={p.cuerpo.color} fontSize="2xl" fontWeight="700" lineHeight="1">{c}</Text>}
                      leida={leidaCaja(p.cuerpo.key, { tipo: "casa", casa: c }, ci)}
                      onClick={() => void abrir(p, { tipo: "casa", casa: c }, ci)}
                    />
                  ))}
                </Flex>
              </Flex>
            </Reveal>
          ))}
        </Flex>
      </Flex>

      {/* El visor del cómic: a la izquierda el planeta, a la derecha el texto. */}
      <IntroComicModal
        isOpen={!!visor}
        vinetas={visor?.vinetas ?? []}
        initialIndex={visor?.inicial ?? 0}
        themeColor={visor?.color}
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

/** Una caja: el planeta en su signo, o en su casa. Se pulsa para leerla. */
function CajaArquetipo({ color, titulo, icono, leida, onClick }: {
  color: string; titulo: string; icono: React.ReactNode; leida: boolean; onClick: () => void;
}) {
  const t = useT();
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      role="group"
      position="relative"
      flex={{ base: "none", md: "1 1 0" }}
      minW={{ md: "220px" }}
      maxW={{ md: "320px" }}
      w={{ base: "100%", md: "auto" }}
      display="flex"
      alignItems="center"
      gap={3}
      px={5}
      py={4}
      borderRadius="xl"
      bg="rgba(8,13,30,0.5)"
      border={`1px solid ${color}${leida ? "99" : "55"}`}
      boxShadow={leida ? `0 0 22px ${color}44` : `0 0 14px ${color}22`}
      textAlign="left"
      cursor="pointer"
      transition="transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s ease, border-color 0.2s ease"
      _hover={{ transform: "translateY(-3px)", boxShadow: `0 0 28px ${color}66`, borderColor: color }}
      _active={{ transform: "translateY(-1px) scale(0.99)" }}
      _focusVisible={{ outline: `2px solid ${color}`, outlineOffset: "3px" }}
    >
      <Flex flexShrink={0} w="44px" h="44px" align="center" justify="center" borderRadius="full"
            bg={`${color}1a`} border={`1px solid ${color}55`}
            transition="transform 0.3s ease" _groupHover={{ transform: "scale(1.1)" }}>
        {icono}
      </Flex>
      <Text flex="1" minW={0} color={color} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.25"
            letterSpacing="0.02em" style={{ textShadow: `0 0 10px ${color}44` }}>
        {titulo}
      </Text>
      {leida && (
        <Flex flexShrink={0} align="center" gap={1} color={color} fontSize="xs" aria-label={t("metodo.astro.releer")}>
          <CheckIcon color={color} />
        </Flex>
      )}
    </Box>
  );
}
