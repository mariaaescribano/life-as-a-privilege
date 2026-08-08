import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useReducedMotion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { FotoBox } from "../../components/metodo/FotoBox";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { BotonCompania } from "../../components/global/BotonCompania";
import { ParteCerebroModal } from "../../components/metodo/ParteCerebroModal";
import { Reveal } from "../../components/global/Reveal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useT } from "../../i18n";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx } from "../../GlobalVariables";
import { useCerebroFisiologia } from "../../hardCoded/espacio/useCerebroFisiologia";
import { PARTES_CEREBRO, type ParteCerebro } from "../../hardCoded/espacio/CerebroFisiologia";

// Clave en metodo_fisiologia.data donde guardamos las partes ya leídas.
const PARTES_VISTAS_KEY = "cerebro_partes_vistas";

export default function MetodoFisiologiaCerebro() {
  const navigate = useNavigate();
  const t = useT();
  const { grupos, partes, frase } = useCerebroFisiologia();
  const [loading, setLoading] = useState(true);
  const [parte, setParte] = useState<ParteCerebro | null>(null);
  // La parte abierta ya estaba leída ANTES de abrirla (aviso en el popup).
  const [parteYaVista, setParteYaVista] = useState(false);
  const [vistas, setVistas] = useState<Set<string>>(new Set());
  const dataRef = useRef<Record<string, any>>({});
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  // Las tarjetas entran una a una en cuanto la página está lista. (No usamos
  // useInView porque la rejilla solo se monta tras el loading y el observer se
  // engancharía antes de que exista → no se vería nada.)
  const reduce = useReducedMotion();
  const [gridEnter, setGridEnter] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }

        // Cargamos las partes ya leídas para retomar el camino (checks).
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const guardadas: string[] = dataRef.current?.[PARTES_VISTAS_KEY] ?? [];
          if (Array.isArray(guardadas) && guardadas.length) setVistas(new Set(guardadas));
        } catch { /* sin fila todavía */ }

        // No mostramos la página hasta que TODAS las fotos estén descargadas,
        // para que la rejilla no se rellene a trozos después.
        await precargarImagenes(PARTES_CEREBRO.map((p) => encodeURI(p.foto)));
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // Abre la ficha de una parte y la marca como leída (se guarda en BD). Se usa
  // tanto al pulsar la tarjeta como al navegar con las flechas dentro del modal.
  const verParte = (p: ParteCerebro) => {
    // Antes de marcarla: si ya venía leída, el popup lo dice arriba.
    setParteYaVista(vistas.has(p.key));
    setParte(p);
    if (vistas.has(p.key)) return;
    const next = new Set(vistas);
    next.add(p.key);
    setVistas(next);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const data = { ...dataRef.current, [PARTES_VISTAS_KEY]: Array.from(next) };
    dataRef.current = data;
    axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => { /* se reintenta la próxima vez */ });
  };

  useEffect(() => {
    if (loading) return;
    if (reduce) { setGridEnter(true); return; }
    const id = requestAnimationFrame(() => setGridEnter(true));
    return () => cancelAnimationFrame(id);
  }, [loading, reduce]);

  if (loading) return <FisiologiaLoading />;

  const completo = vistas.size >= PARTES_CEREBRO.length;
  // Contador global de la animación de entrada: sigue corriendo de un grupo al
  // siguiente, para que la cascada no se reinicie en cada zona.
  let orden = -1;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
              title={t("fisiologia.cerebro.titulo")}
              pageLabel="4/5"
              compact
              bgColor={`${fisiologiaBg}dd`}
              color={fisiologiaTxt}
              nom={fisiologiaNom}
              mb={0}
              prev={{ label: `← ${t("fisiologia.sistemas.titulo")}`, onClick: () => navigate("/metodo/fisiologia/sistemas") }}
              extra={celulasBtn}
              next={{ label: `${t("fisiologia.organismo.titulo")} →`, onClick: () => navigate("/metodo/fisiologia/organismo"),
                      disabled: !completo,
                      disabledTooltip: t("fisiologia.cerebro.faltanPartes") }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px">
              {t("fisiologia.cerebro.entradilla")}
            </Text>
          </Reveal>

          {/* ── Las partes, agrupadas por zona: de fuera hacia dentro. Cada zona
              lleva su título y una línea que la sitúa, y luego su rejilla. ── */}
          {grupos.map((g, gi) => (
            <Flex key={g.zona} direction="column" w="100%" gap={{ base: 3, md: 4 }} mt={gi > 0 ? { base: 4, md: 6 } : 0}>
              <Reveal direction="up" distance={14} duration={0.55} w="100%">
                <Flex direction="column" align="center" gap={1.5} w="100%">
                  <Flex align="center" gap={{ base: 3, md: 4 }} w="100%">
                    <Box flex="1" h="1px" bg={`${fisiologiaTxt}44`} />
                    <Text color={fisiologiaTxt} fontWeight="700" fontSize={{ base: "md", md: "xl" }}
                          letterSpacing="0.14em" textTransform="uppercase" whiteSpace="nowrap"
                          style={{ textShadow: `0 0 12px ${fisiologiaTxt}66, 0 0 28px ${fisiologiaTxt}33` }}>
                      {g.titulo}
                    </Text>
                    <Box flex="1" h="1px" bg={`${fisiologiaTxt}44`} />
                  </Flex>
                  <Text color="rgba(255,255,255,0.82)" fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                        textAlign="center" lineHeight="1.7" maxW="560px">
                    {g.entradilla}
                  </Text>
                </Flex>
              </Reveal>

              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
                {g.partes.map((p) => {
                  orden += 1;
                  return (
                    <Box key={p.key}
                         opacity={gridEnter ? 1 : 0}
                         transform={gridEnter ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)"}
                         transition="opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)"
                         sx={{ transitionDelay: `${orden * 0.05}s` }}>
                      <FotoBox
                        titulo={p.label}
                        foto={p.foto}
                        nom={fisiologiaNom}
                        tinta={fisiologiaTxt}
                        bg={fisiologiaBg}
                        visto={vistas.has(p.key)}
                        colorTint={`${p.color}22`}
                        onClick={() => verParte(p)}
                      />
                    </Box>
                  );
                })}
              </SimpleGrid>
            </Flex>
          ))}

          {/* Frase de cierre: solo cuando ya se han leído todas las partes. */}
          {completo && (
            <Reveal direction="up" distance={16} duration={0.7} w="100%" display="flex" justifyContent="center">
              <Text color="white" fontSize={{ base: "md", md: "xl" }} fontStyle="italic" textAlign="center"
                    lineHeight="1.9" maxW="620px" mt={{ base: 4, md: 6 }}
                    style={{ textShadow: "0 0 14px rgba(255,255,255,0.35), 0 0 30px rgba(180,255,245,0.2)" }}>
                {frase}
              </Text>
            </Reveal>
          )}
        </Flex>
      </Flex>

      {/* Ficha inmersiva de la parte: imagen + claves + explicación, con flechas
          para recorrer todas las partes seguidas sin cerrar. */}
      <ParteCerebroModal parte={parte} partes={partes} leida={parteYaVista}
                         onSelect={verParte} onClose={() => setParte(null)} />

      {celulasModal}
      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
