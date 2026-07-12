import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { CelulaCard, CelulaModal } from "../../components/metodo/celulasUi";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon } from "../../GlobalVariables";
import { celulas as CELULAS, type Celula } from "../../hardCoded/espacio/CelulasCuerpoData";

const INK = `0 1px 3px ${fisiologiaBg}f5, 0 0 8px ${fisiologiaBg}cc, 0 2px 16px ${fisiologiaBg}88`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(200,181,209,0.12), 0 0 20px ${fisiologiaTxt}1a, 0 0 48px ${fisiologiaTxt}10`;

// ⚠️ PENDIENTE: la imagen de la silueta con los órganos la pasará María. Cuando
// la tenga, cambia esta ruta y AJUSTA las coordenadas (top/left en %) de cada
// órgano para que cada punto caiga sobre su órgano en la ilustración.
const SILUETA_IMG = "/recorrido/fisiologia/silueta.png";

// Ancho de la silueta. Fijo: en móvil NO se hace más pequeña que en ordenador.
const SILUETA_W = "300px";

// Helper para coger células por id de la lista plana de Fisiología.
const pick = (...ids: string[]): Celula[] =>
  ids.map((id) => CELULAS.find((c) => c.id === id)).filter(Boolean) as Celula[];

// Clave en metodo_fisiologia.data donde guardamos las células ya descubiertas.
const VISTAS_KEY = "celulas_vistas";

interface Organo {
  key: string;
  label: string;
  /** Foto del órgano que aparece en el panel de la derecha al pulsarlo.
   *  ⚠️ PENDIENTE: María pasará todas las fotos de los órganos. */
  foto: string;
  /** Posición del punto pulsable sobre la silueta, en % (0-100). A afinar con
   *  la imagen definitiva. */
  hotspot: { top: number; left: number };
  /** Células de este órgano. */
  celulas: Celula[];
}

// Posiciones PROVISIONALES (se ajustarán sobre la imagen real). Las fotos de
// los órganos están en /recorrido/fisiologia/organos/{key}.png.
const ORGANOS: Organo[] = [
  { key: "cerebro",   label: "Cerebro",   foto: "/recorrido/fisiologia/organos/cerebro.png",   hotspot: { top: 9,  left: 50 }, celulas: pick("neuronas", "astrocitos", "microglia", "oligodendrocitos", "ependimarias") },
  { key: "pulmones",  label: "Pulmones",  foto: "/recorrido/fisiologia/organos/pulmones.png",  hotspot: { top: 33, left: 40 }, celulas: pick("neumocitos-1", "neumocitos-2", "macrofagos-alveolares") },
  { key: "corazon",   label: "Corazón",   foto: "/recorrido/fisiologia/organos/corazon.png",   hotspot: { top: 35, left: 55 }, celulas: pick("cardiomiocitos") },
  { key: "higado",    label: "Hígado",    foto: "/recorrido/fisiologia/organos/higado.png",    hotspot: { top: 45, left: 43 }, celulas: pick("hepatocitos", "kupffer", "estrelladas") },
  { key: "pancreas",  label: "Páncreas",  foto: "/recorrido/fisiologia/organos/pancreas.png",  hotspot: { top: 47, left: 57 }, celulas: pick("celulas-beta", "celulas-alfa", "celulas-delta", "celulas-acinares", "celulas-ductales", "celulas-pp") },
  { key: "rinones",   label: "Riñones",   foto: "/recorrido/fisiologia/organos/rinones.png",   hotspot: { top: 52, left: 50 }, celulas: pick("podocitos", "celulas-tubulares") },
  { key: "intestino", label: "Intestino", foto: "/recorrido/fisiologia/organos/intestino.png", hotspot: { top: 62, left: 50 }, celulas: pick("enterocitos", "caliciformes", "paneth", "enteroendocrinas") },
  { key: "piel",      label: "Piel",      foto: "/recorrido/fisiologia/organos/piel.png",      hotspot: { top: 24, left: 22 }, celulas: pick("queratinocitos", "melanocitos", "langerhans") },
];

const pulse = keyframes`
  0%   { transform: translate(-50%, -50%) scale(1);   box-shadow: 0 0 0 0 rgba(255,255,255,0.55); }
  70%  { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 0 12px rgba(255,255,255,0); }
  100% { transform: translate(-50%, -50%) scale(1);   box-shadow: 0 0 0 0 rgba(255,255,255,0); }
`;

// Punto pulsable sobre un órgano.
function Hotspot({ organo, active, onClick }: { organo: Organo; active: boolean; onClick: () => void }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      position="absolute"
      top={`${organo.hotspot.top}%`}
      left={`${organo.hotspot.left}%`}
      transform="translate(-50%, -50%)"
      zIndex={2}
      display="flex"
      alignItems="center"
      gap={2}
      cursor="pointer"
      aria-label={`Ver células de ${organo.label}`}
      sx={{ "&:hover .organo-label": { opacity: 1, transform: "translateX(0)" } }}
    >
      {/* Punto latiendo */}
      <Box
        w={{ base: "16px", md: "18px" }}
        h={{ base: "16px", md: "18px" }}
        borderRadius="full"
        bg={active ? "white" : fisiologiaTxt}
        border={`2px solid ${active ? fisiologiaTxt : "white"}`}
        animation={active ? undefined : `${pulse} 2.4s ease-out infinite`}
        boxShadow={active ? `0 0 12px ${fisiologiaTxt}, 0 0 4px #fff` : undefined}
        flexShrink={0}
      />
      {/* Etiqueta del órgano */}
      <Box
        className="organo-label"
        px={2.5}
        py={1}
        borderRadius="full"
        bg={`${fisiologiaBg}e6`}
        border={`1px solid ${fisiologiaTxt}77`}
        opacity={{ base: 1, md: active ? 1 : 0 }}
        transform={{ base: "none", md: active ? "translateX(0)" : "translateX(-6px)" }}
        transition="all 0.2s ease"
        pointerEvents="none"
        whiteSpace="nowrap"
      >
        <Text color={fisiologiaTxt} fontSize={{ base: "2xs", md: "xs" }} fontWeight={700} letterSpacing="0.06em"
              style={{ textShadow: `0 1px 3px ${fisiologiaBg}` }}>
          {organo.label}
        </Text>
      </Box>
    </Box>
  );
}

// Universo de células alcanzables desde la silueta (para el contador de progreso).
const UNIVERSO = Array.from(new Set(ORGANOS.flatMap((o) => o.celulas.map((c) => c.id))));
const TOTAL_CELULAS = UNIVERSO.length;

// Panel de la derecha: por defecto la intro; al pulsar un órgano, su foto +
// título + rejilla de células (que abren la ficha inmersiva al pulsarlas).
function PanelDerecha({
  organo,
  vistas,
  onCelula,
}: {
  organo: Organo | null;
  vistas: Set<string>;
  onCelula: (c: Celula) => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  useEffect(() => { setImgErr(false); }, [organo?.key]);

  if (!organo) {
    return (
      <Flex direction="column" justify="center" gap={4} h="100%"
            textAlign={{ base: "center", md: "left" }}>
        <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.25"
              style={{ textShadow: INK }}>
          Un mismo origen, mil formas
        </Text>
        <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9"
              style={{ textShadow: INK }}>
          Todas tus células nacen de una sola, pero se especializan según el órgano en el que viven:
          unas laten, otras piensan, otras filtran o protegen.
        </Text>
        <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.9"
              style={{ textShadow: INK }}>
          Pulsa un órgano de la silueta y asómate a las células que lo forman.
        </Text>
      </Flex>
    );
  }

  const vistasOrgano = organo.celulas.filter((c) => vistas.has(c.id)).length;
  const organoCompleto = organo.celulas.length > 0 && vistasOrgano === organo.celulas.length;

  return (
    <Flex direction="column" gap={{ base: 5, md: 6 }} w="100%">
      {/* Cabecera: foto del órgano + título */}
      <Flex align="center" gap={{ base: 4, md: 5 }}>
        <Box
          flexShrink={0}
          w={{ base: "78px", md: "96px" }}
          h={{ base: "78px", md: "96px" }}
          borderRadius="xl"
          overflow="hidden"
          bg={`${fisiologiaTxt}14`}
          boxShadow={`0 6px 22px rgba(0,0,0,0.28), 0 0 16px ${fisiologiaTxt}26`}
        >
          {!imgErr ? (
            <Image src={encodeURI(organo.foto)} alt={organo.label} w="100%" h="100%" objectFit="cover"
                   onError={() => setImgErr(true)} />
          ) : (
            <Flex w="100%" h="100%" align="center" justify="center" />
          )}
        </Box>
        <Flex direction="column" gap={1} minW={0}>
          <Text color={fisiologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700"
                letterSpacing="0.03em" lineHeight="1.15"
                style={{ textShadow: `0 0 14px ${fisiologiaBg}cc, 0 2px 6px rgba(0,0,0,0.55)` }}>
            {organo.label}
          </Text>
          {organo.celulas.length > 0 && (
            <Text color={`${fisiologiaTxt}cc`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              {organoCompleto
                ? "✓ Has descubierto todas sus células"
                : `${vistasOrgano} de ${organo.celulas.length} células descubiertas`}
            </Text>
          )}
        </Flex>
      </Flex>

      {/* Rallita separadora */}
      <Box w="100%" h="1px" borderRadius="full"
           bgGradient={`linear(to-r, transparent, ${fisiologiaTxt}, transparent)`} />

      {/* Rejilla de células — 3 por fila en ordenador */}
      {organo.celulas.length > 0 ? (
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 4, md: 5 }}>
          {organo.celulas.map((c) => (
            <CelulaCard key={c.id} celula={c} visto={vistas.has(c.id)} onClick={() => onCelula(c)} />
          ))}
        </SimpleGrid>
      ) : (
        <Text color={`${fisiologiaTxt}dd`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>
          Pronto podrás explorar las células de este órgano.
        </Text>
      )}
    </Flex>
  );
}

export default function MetodoFisiologiaTodasCelulas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [organo, setOrgano] = useState<Organo | null>(null);
  const [celula, setCelula] = useState<Celula | null>(null);
  const [vistas, setVistas] = useState<Set<string>>(new Set());
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  const dataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try {
          const t = await axios.get(`${API_URL}/payment/test/enabled`);
          testEnabled = !!t.data?.enabled;
        } catch { /* sin modo test */ }

        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/metodo/fisiologia"); return; }

        // Cargamos las células ya descubiertas para retomar el camino.
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          dataRef.current = r.data?.data ?? {};
          const guardadas: string[] = dataRef.current?.[VISTAS_KEY] ?? [];
          if (Array.isArray(guardadas) && guardadas.length) setVistas(new Set(guardadas));
        } catch { /* sin fila todavía */ }
      } catch {
        navigate("/metodo/fisiologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Abre la ficha de una célula y la marca como descubierta (se guarda en BD).
  const verCelula = (c: Celula) => {
    setCelula(c);
    if (vistas.has(c.id)) return;
    const next = new Set(vistas);
    next.add(c.id);
    setVistas(next);
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const data = { ...dataRef.current, [VISTAS_KEY]: Array.from(next) };
    dataRef.current = data;
    axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => { /* se reintenta la próxima vez */ });
  };

  const vistasTotal = UNIVERSO.filter((id) => vistas.has(id)).length;
  const pct = TOTAL_CELULAS ? Math.round((vistasTotal / TOTAL_CELULAS) * 100) : 0;

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={7}>

          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Todas tus células"
            pageLabel="2/2"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Célula", onClick: () => navigate("/metodo/fisiologia/celula") }}
            extra={celulasBtn}
            next={{ label: "Sistemas →", onClick: () => navigate("/metodo/fisiologia/sistemas") }}
          />

          <Reveal direction="up" distance={18} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Tu cuerpo entero está hecho de células. Pulsa en cada órgano para descubrir las suyas.
            </Text>
          </Reveal>

          {/* Barra de progreso: el usuario siente que va recorriendo un camino que se guarda */}
          <Reveal direction="up" distance={14} duration={0.55} w="100%" display="flex" justifyContent="center">
            <Flex direction="column" align="center" gap={2} w="100%" maxW="440px">
              <Flex align="center" justify="space-between" w="100%">
                <Text color={fisiologiaTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.06em"
                      style={{ textShadow: `0 1px 4px ${fisiologiaBg}` }}>
                  {vistasTotal === TOTAL_CELULAS && TOTAL_CELULAS > 0
                    ? "✓ Has recorrido todas tus células"
                    : `${vistasTotal} de ${TOTAL_CELULAS} células descubiertas`}
                </Text>
                <Text color={`${fisiologiaTxt}bb`} fontSize={{ base: "xs", md: "sm" }} fontWeight={700}>
                  {pct}%
                </Text>
              </Flex>
              <Box w="100%" h="7px" borderRadius="full" bg="rgba(255,255,255,0.18)" overflow="hidden">
                <Box h="100%" borderRadius="full" w={`${pct}%`} transition="width 0.5s ease"
                     bgGradient={`linear(to-r, ${fisiologiaTxt}, #ffffff)`}
                     boxShadow={`0 0 12px ${fisiologiaTxt}`} />
              </Box>
            </Flex>
          </Reveal>

          {/* ── Dos columnas: box de la silueta (abraza la foto) + panel dinámico ── */}
          <Reveal direction="up" distance={22} duration={0.65} w="100%">
            <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "stretch" }}
                  justify="center" gap={{ base: 8, md: 8 }} w="100%">

              {/* Box de la silueta: apenas más grande que la foto */}
              <Box position="relative" flexShrink={0} borderRadius="2xl" overflow="hidden"
                   boxShadow={CAJA_GLOW} p={{ base: 4, md: 5 }} alignSelf={{ base: "center", md: "flex-start" }}>
                <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                <Box position="relative" zIndex={1} w={SILUETA_W} maxW="100%">
                  <Box position="relative" w="100%" sx={{ aspectRatio: "1 / 2" }}>
                    <Image
                      src={SILUETA_IMG}
                      alt="Silueta humana con órganos"
                      w="100%" h="100%" objectFit="contain"
                      fallback={
                        <Flex w="100%" h="100%" align="center" justify="center" direction="column" gap={2}
                              border={`1px dashed ${fisiologiaTxt}55`} borderRadius="2xl" textAlign="center" px={4}>
                          <Text color={`${fisiologiaTxt}cc`} fontSize="sm" fontStyle="italic">
                            Silueta con los órganos (próximamente)
                          </Text>
                        </Flex>
                      }
                    />
                    {/* Puntos pulsables (posiciones provisionales) */}
                    {ORGANOS.map((o) => (
                      <Hotspot key={o.key} organo={o} active={organo?.key === o.key} onClick={() => setOrgano(o)} />
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Panel derecho: intro por defecto, o el órgano pulsado con sus células */}
              <Box position="relative" flex="1" minW={0} w="100%" borderRadius="2xl" overflow="hidden"
                   boxShadow={CAJA_GLOW}>
                <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                <Box position="relative" zIndex={1} px={{ base: 6, md: 8 }} py={{ base: 7, md: 9 }} h="100%">
                  <PanelDerecha organo={organo} vistas={vistas} onCelula={verCelula} />
                </Box>
              </Box>
            </Flex>
          </Reveal>
        </Flex>
      </Flex>

      {/* Ficha inmersiva de la célula pulsada (foto a la izquierda, texto a la derecha) */}
      {celula && (
        <CelulaModal
          celula={celula}
          celulas={organo?.celulas ?? CELULAS}
          onSelect={verCelula}
          onClose={() => setCelula(null)}
        />
      )}

      {celulasModal}
      <IndiceFisiologia />
      <SiteFooter />
    </Box>
  );
}
