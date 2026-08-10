import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg, SPACE_IMG } from "../../components/metodo/SpaceBg";
import { useImagesReady } from "../../hooks/useImagesReady";
import { Glifo, GlifoSigno } from "../../components/metodo/Glifo";
import { ComicAstrologiaModal, VINETAS_PLANETAS } from "../../components/metodo/ComicAstrologiaModal";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { SaberMasModal } from "../../components/metodo/Planetas";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { ZODIAC_SIGNS, cuerpoByKey, soloClavesPlaneta, type Cuerpo, type CuerpoKey } from "../../components/metodo/astrologiaData";
import { useNombresAstro } from "../../components/metodo/astrologiaNombres";
import { useT, TextoRico } from "../../i18n";
import type { CartaNatal } from "../../components/metodo/CartaAstral3D/types";
import { API_URL, astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

const EyeIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

const CheckIcon = ({ color }: { color: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="15px" h="15px" fill={color} flexShrink={0}>
    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
  </Box>
);

// Orden visual pedido: Luna (izq) · Sol (centro) · Ascendente (dcha).
// En móvil se apila y el Sol queda en medio igualmente.
const TRIO: CuerpoKey[] = ["luna", "sol", "ascendente"];

interface Valor { signo?: string; casa?: number; profundizadoSigno?: boolean; profundizadoCasa?: boolean }
type Data = Partial<Record<CuerpoKey, Valor>>;

export default function MetodoAstrologiaSolAscLuna() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Data>({});
  const [comicOpen, setComicOpen] = useState(false);
  // Cómic de los planetas: se intercala antes de pasar a «Arquetipos».
  const [comicPlanetasOpen, setComicPlanetasOpen] = useState(false);
  const [abierto, setAbierto] = useState<CuerpoKey | null>(null);
  const fotosListas = useImagesReady([SPACE_IMG]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const rowRes = await axios.get<{ solicitud_enviada_at?: string | null; link_carta?: string | null; data?: Data } | null>(
          `${API_URL}/metodo-astrologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } },
        );
        // Accesible en cuanto hay solicitud (la carta ya está calculada); no requiere el PDF.
        if (!rowRes.data?.solicitud_enviada_at) { navigate("/metodo/astrologia"); return; }
        // Solo claves de planeta (no arrastrar el progreso de lectura del JSONB).
        let d: Data = soloClavesPlaneta<Valor>(rowRes.data?.data);

        // La CARTA manda para signo y casa: si se corrige la fecha (o la hora, o
        // el lugar) la carta se recalcula, pero el `data` guardado conserva los
        // valores viejos, así que leyéndolo de ahí esta página seguiría
        // enseñando el signo anterior mientras el mapa ya enseña el nuevo. Del
        // `data` nos quedamos solo con lo leído (profundizadoSigno/Casa).
        const cartaRes = await axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const carta = cartaRes.data;
        if (carta && Array.isArray(carta.planetas)) {
          const next: Data = { ...d };
          for (const k of TRIO) {
            const p = carta.planetas.find((x) => x.planeta === k);
            if (!p) continue;
            next[k] = {
              ...next[k],
              signo: ZODIAC_SIGNS[p.signoIdx]?.name,
              // El ascendente es la cúspide de la casa 1: no lleva casa.
              ...(k !== "ascendente" ? { casa: p.casa } : {}),
            };
          }
          d = next;
        }
        setData(d);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Marca un cuerpo como leído (persistente, mismos flags que el resto del recorrido).
  const abrirLectura = (key: CuerpoKey) => {
    setAbierto(key);
    const cuerpo = cuerpoByKey(key);
    if (!cuerpo) return;
    const cur = data[key] ?? {};
    const yaLeido = cur.profundizadoSigno && (!cuerpo.conCasa || cur.profundizadoCasa);
    if (yaLeido) return;

    const next: Data = {
      ...data,
      [key]: {
        ...cur,
        profundizadoSigno: true,
        ...(cuerpo.conCasa && cur.casa != null ? { profundizadoCasa: true } : {}),
      },
    };
    setData(next);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token) {
      void axios.patch(`${API_URL}/metodo-astrologia/${userId}`, { data: next },
        { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    }
  };

  const esLeido = (key: CuerpoKey): boolean => {
    const cuerpo = cuerpoByKey(key);
    const v = data[key] ?? {};
    if (!cuerpo) return false;
    return !!v.profundizadoSigno && (!cuerpo.conCasa || !!v.profundizadoCasa);
  };

  if (loading || !fotosListas) {
    return <RecorridoLoading />;
  }

  const todosLeidos = TRIO.every(esLeido);
  const cuerpoAbierto = abierto ? cuerpoByKey(abierto) : null;
  const valorAbierto = abierto ? data[abierto] ?? {} : {};

  const headerNext = {
    label: todosLeidos ? `${t("metodo.astro.paso.arquetipos")} →` : t("metodo.astro.trioLeeLosTres"),
    // Antes de pasar a «Arquetipos» intercalamos el cómic de los planetas.
    onClick: () => setComicPlanetasOpen(true),
    disabled: !todosLeidos,
    disabledTooltip: t("metodo.astro.trioLeeLosTresTooltip"),
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={
                <>
                  <Box as="span" display={{ base: "none", md: "inline" }}>{t("metodo.astro.paso.loPrimero")}</Box>
                  <Box as="span" display={{ base: "inline", md: "none" }}>{t("metodo.astro.paso.loPrimeroCorto")}</Box>
                </>
              }
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 2, total: 9 }}
              mb={0}
              prev={{ label: `← ${t("metodo.introCorto")}`, onClick: () => navigate("/metodo/astrologia") }}
              extra={{ label: t("metodo.ilustraciones"), onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
              next={headerNext}
            />
          </Reveal>

          {/* El título ya dice que esta es la primera parte de la carta; esta
              frase pone nombre a las tres piezas, que es el vocabulario con el
              que se va a leer todo el resto del recorrido. Va FUERA de la caja,
              en blanco sobre el turquesa, entre el header y el box principal. */}
          <Reveal direction="up" distance={18} delay={0.08} duration={0.7} w="100%">
            <Text
              color="#ffffff"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.8"
              textAlign="center"
              maxW="620px"
              mx="auto"
              fontStyle="italic"
            >
              <TextoRico>{t("metodo.astro.trioIntro")}</TextoRico>
            </Text>
          </Reveal>

          <Reveal
            direction="up"
            distance={34}
            scaleFrom={0.97}
            delay={0.12}
            duration={0.75}
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${astrologiaTxt}1a, 0 0 48px ${astrologiaTxt}10`}
          >
            <SpaceBg overlay="rgba(8,13,30,0.62)" />

            <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 9, md: 12 }}>
              <RevealStagger
                display="flex"
                flexDirection={{ base: "column", md: "row" }}
                alignItems="center"
                mt="5px"
                justifyContent="center"
                gap={{ base: 7, md: 6 }}
                stagger={0.14}
                delayChildren={0.3}
                amount={0.2}
              >
                {TRIO.map((key) => {
                  const cuerpo = cuerpoByKey(key);
                  if (!cuerpo) return null;
                  const v = data[key] ?? {};
                  const esSol = key === "sol";
                  return (
                    <RevealItem
                      key={key}
                      direction="up"
                      distance={30}
                      scaleFrom={0.9}
                      duration={0.7}
                      w={{ base: "100%", md: "auto" }}
                      display="flex"
                      justifyContent="center"
                    >
                      <TrioCard
                        cuerpo={cuerpo}
                        signo={v.signo}
                        casa={cuerpo.conCasa ? v.casa : undefined}
                        destacado={esSol}
                        leido={esLeido(key)}
                        onLeer={() => abrirLectura(key)}
                      />
                    </RevealItem>
                  );
                })}
              </RevealStagger>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      <SaberMasModal
        isOpen={!!cuerpoAbierto}
        onClose={() => setAbierto(null)}
        cuerpo={cuerpoAbierto ?? null}
        signo={valorAbierto.signo}
        casa={cuerpoAbierto?.conCasa ? valorAbierto.casa : undefined}
      />

      <ComicAstrologiaModal isOpen={comicOpen} onClose={() => setComicOpen(false)} />

      {/* Cómic de los planetas: intercalado antes de «Arquetipos». */}
      <ComicPasoModal
        isOpen={comicPlanetasOpen}
        onClose={() => setComicPlanetasOpen(false)}
        onContinue={() => navigate("/metodo/astrologia/cartaAstral")}
        vinetas={VINETAS_PLANETAS}
        continueLabel={t("metodo.astro.paso.arquetipos")}
        themeColor={astrologiaTxt}
      />
      {/* El popup «¿Qué es esto?» (botón flotante, encima del de la llamada)
          explica esta página del recorrido. Su texto vive en el diccionario. */}
      <BotonCompania color={astrologiaTxt} bgColor={astrologiaBg} disciplinaNom={astrologiaNom} precio={20}
                     llamadaTitulo={t("metodo.astro.reservaLlamada")}
                     queEsEsto={{ parrafos: [t("metodo.astro.trioQueEs1"), t("metodo.astro.trioQueEs2")] }} />
      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}

/* ── Tarjeta de un cuerpo del trío ── */
function TrioCard({
  cuerpo,
  signo,
  casa,
  destacado,
  leido,
  onLeer,
}: {
  cuerpo: Cuerpo;
  signo?: string;
  casa?: number;
  destacado?: boolean;
  leido: boolean;
  onLeer: () => void;
}) {
  const t = useT();
  const n = useNombresAstro();
  const c = cuerpo.color;
  const signoData = signo ? ZODIAC_SIGNS.find((s) => s.name === signo) : null;
  return (
    <Flex
      direction="column"
      align="center"
      gap={3}
      w={{ base: "100%", md: destacado ? "230px" : "200px" }}
      maxW={{ base: "280px", md: "none" }}
      transform={{ md: destacado ? "translateY(-14px)" : "none" }}
      px={5}
      py={{ base: 6, md: 7 }}
      borderRadius="2xl"
      bg="rgba(8,13,30,0.45)"
      border={`1px solid ${c}${destacado ? "66" : "33"}`}
      boxShadow={destacado ? `0 0 26px ${c}44, 0 0 60px ${c}22` : `0 0 16px ${c}22`}
    >
      {/* icono */}
      <Box style={{ filter: `drop-shadow(0 0 6px ${c}55)` }}>
        <Glifo symbol={cuerpo.symbol} color={c} size={destacado ? 64 : 52} />
      </Box>
      <Text color={c} fontSize={{ base: "lg", md: destacado ? "2xl" : "xl" }} fontWeight="700" letterSpacing="0.04em"
            style={{ textShadow: `0 0 12px ${c}66` }}>
        {n.cuerpo(cuerpo.key)}
      </Text>

      {/* signo · casa */}
      <Flex align="center" gap={2} minH="28px">
        {signoData ? (
          <>
            <GlifoSigno nombre={signoData.name} color={c} size={24} />
            <Text color={`${c}dd`} fontSize={{ base: "sm", md: "md" }}>
              {n.signo(signoData.name)}{casa != null ? ` · ${n.casa(casa)}` : ""}
            </Text>
          </>
        ) : (
          <Text color={`${c}99`} fontSize="sm" fontStyle="italic">—</Text>
        )}
      </Flex>

      {/* botón leer */}
      <Box
        as="button"
        onClick={onLeer}
        mt={1}
        px={6}
        py={2}
        borderRadius="full"
        bg={leido ? `${c}22` : c}
        color={leido ? c : "#0a0a1a"}
        border={`1px solid ${c}88`}
        fontFamily="'EB Garamond', serif"
        fontSize={{ base: "sm", md: "md" }}
        fontWeight="700"
        letterSpacing="0.06em"
        cursor="pointer"
        transition="all 0.18s"
        display="inline-flex"
        alignItems="center"
        gap={1.5}
        whiteSpace="nowrap"
        _hover={{ boxShadow: `0 0 18px ${c}88`, transform: "translateY(-1px)" }}
      >
        {leido ? <><CheckIcon color={c} /> {t("metodo.astro.releer")}</> : t("metodo.astro.leer")}
      </Box>
    </Flex>
  );
}
