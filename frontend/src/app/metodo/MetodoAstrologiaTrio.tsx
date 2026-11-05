import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg, SPACE_IMG } from "../../components/metodo/SpaceBg";
import { TrioCard } from "../../components/metodo/TrioCard";
import { glowHeader } from "../../components/metodo/FotoBox";
import { SaberMasModal } from "../../components/metodo/Planetas";
import { ZODIAC_SIGNS, cuerpoByKey, soloClavesPlaneta, type CuerpoKey } from "../../components/metodo/astrologiaData";
import type { CartaNatal } from "../../components/metodo/CartaAstral3D/types";
import { useImagesReady } from "../../hooks/useImagesReady";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { esMariaMirando } from "../../api/persona";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, astrologiaBg, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";
import { useT } from "../../i18n";

// Orden visual: Luna (izq) · Sol (centro) · Ascendente (dcha). En móvil se apila.
const TRIO: CuerpoKey[] = ["luna", "sol", "ascendente"];

interface TrioValor { signo?: string; casa?: number; profundizadoSigno?: boolean; profundizadoCasa?: boolean }
type TrioData = Partial<Record<CuerpoKey, TrioValor>>;

/**
 * Paso 4 del recorrido de Astrología: Ascendente, Sol y Luna. Lo que la mayoría de
 * la gente conoce de la astrología. Se leen los tres (cada tarjeta abre su lectura)
 * antes de pasar a los Arquetipos. Es el mismo trío que antes vivía debajo del
 * formulario de datos, en su propia página.
 */
export default function MetodoAstrologiaTrio() {
  const t = useT();
  const navigate = useNavigate();
  const esMovil = useBreakpointValue({ base: true, md: false }) ?? true;
  const [loading, setLoading] = useState(true);
  const [trio, setTrio] = useState<TrioData>({});
  const [abierto, setAbierto] = useState<CuerpoKey | null>(null);
  const fotosListas = useImagesReady([SPACE_IMG]);
  const { bloqueada, cargado } = useAstrologiaProgreso();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    let cancel = false;
    (async () => {
      try {
        const [estadoRes, cartaRes] = await Promise.all([
          axios.get<{ solicitud_enviada_at?: string | null; data?: TrioData | null } | null>(`${API_URL}/metodo-astrologia/${userId}`),
          axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`),
        ]);
        // Sin sus datos de nacimiento no hay carta: se vuelve al formulario.
        if (!estadoRes.data?.solicitud_enviada_at) { navigate("/metodo/astrologia/introduccion", { replace: true }); return; }
        // La CARTA manda para signo y casa; del `data` guardado solo se conserva lo leído.
        let d: TrioData = soloClavesPlaneta<TrioValor>(estadoRes.data?.data ?? undefined);
        const carta = cartaRes.data;
        if (carta && Array.isArray(carta.planetas)) {
          for (const k of TRIO) {
            const p = carta.planetas.find((x) => x.planeta === k);
            if (!p) continue;
            d = { ...d, [k]: { ...d[k], signo: ZODIAC_SIGNS[p.signoIdx]?.name, ...(k !== "ascendente" ? { casa: p.casa } : {}) } };
          }
        }
        if (!cancel) setTrio(d);
      } catch {
        if (!cancel) navigate("/metodo/astrologia/introduccion", { replace: true });
        return;
      }
      if (!cancel) setLoading(false);
    })();
    return () => { cancel = true; };
  }, [navigate]);

  // Marca un cuerpo como leído (persistente, mismos flags que el resto del recorrido).
  const abrirLectura = (key: CuerpoKey) => {
    setAbierto(key);
    const cuerpo = cuerpoByKey(key);
    if (!cuerpo) return;
    const cur = trio[key] ?? {};
    if (cur.profundizadoSigno && (!cuerpo.conCasa || cur.profundizadoCasa)) return;
    const next: TrioData = {
      ...trio,
      [key]: {
        ...cur,
        profundizadoSigno: true,
        ...(cuerpo.conCasa && cur.casa != null ? { profundizadoCasa: true } : {}),
      },
    };
    setTrio(next);
    const userId = localStorage.getItem("userId");
    if (userId) void axios.patch(`${API_URL}/metodo-astrologia/${userId}`, { data: next }).catch(() => {});
  };

  const esLeido = (key: CuerpoKey): boolean => {
    const cuerpo = cuerpoByKey(key);
    const v = trio[key] ?? {};
    if (!cuerpo) return false;
    return !!v.profundizadoSigno && (!cuerpo.conCasa || !!v.profundizadoCasa);
  };

  if (loading || !fotosListas) return <RecorridoLoading />;

  const maria = esMariaMirando();
  const todosLeidos = TRIO.every(esLeido);
  const cuerpoAbierto = abierto ? cuerpoByKey(abierto) : null;
  const valorAbierto = abierto ? trio[abierto] ?? {} : {};
  // «Siguiente»: hay que leer los tres, y que María haya abierto el paso 5 (ella entra siempre).
  const faltaLeer = !todosLeidos && !maria;
  const cerradoPorMaria = !maria && cargado && bloqueada(5);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={{ base: 7, md: 9 }}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={t("metodo.astro.paso.trio")}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 4, total: 12 }}
              mb={0}
              prev={{ label: `← ${t("metodo.astro.paso.explicacion")}`, onClick: () => navigate("/metodo/astrologia/explicacion") }}
              next={{
                label: `${t("metodo.astro.paso.puntosClave")} →`,
                onClick: () => navigate("/metodo/astrologia/lectura"),
                disabled: faltaLeer || cerradoPorMaria,
                disabledTooltip: faltaLeer ? t("metodo.astro.trioLeeLosTresTooltip") : undefined,
              }}
            />
          </Reveal>

          {/* Fuera de las cajas: blanco y sin sombra. */}
          <Reveal direction="up" distance={18} delay={0.15} duration={0.7} w="100%" maxW="660px">
            <Text color="white" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8" textAlign="center">
              {t("metodo.astro.trio.intro")}
            </Text>
          </Reveal>

          <Reveal
            inView
            once
            amount={0.2}
            direction="up"
            distance={34}
            scaleFrom={0.97}
            delay={0.2}
            duration={0.75}
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow={glowHeader(astrologiaTxt)}
          >
            <SpaceBg overlay="rgba(8,13,30,0.28)" />
            <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 9, md: 12 }}>
              <Flex direction={{ base: "column", md: "row" }} alignItems="center" mt="5px" justifyContent="center" gap={{ base: 7, md: 6 }}>
                {TRIO.map((key, i) => {
                  const cuerpo = cuerpoByKey(key);
                  if (!cuerpo) return null;
                  const v = trio[key] ?? {};
                  return (
                    // Una detrás de otra, con calma; en móvil cada una entra al asomar por scroll.
                    <Reveal key={key} inView once amount={0.3} direction="up" distance={46} scaleFrom={0.88} blur duration={0.9}
                            delay={esMovil ? 0 : 0.3 + i * 0.32} w={{ base: "100%", md: "auto" }} display="flex" justifyContent="center">
                      <TrioCard
                        cuerpo={cuerpo}
                        signo={v.signo}
                        casa={cuerpo.conCasa ? v.casa : undefined}
                        destacado={key === "sol"}
                        leido={esLeido(key)}
                        onLeer={() => abrirLectura(key)}
                      />
                    </Reveal>
                  );
                })}
              </Flex>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      {/* Ficha de lectura de un cuerpo del trío (Sol, Luna o Ascendente). */}
      <SaberMasModal
        isOpen={!!cuerpoAbierto}
        onClose={() => setAbierto(null)}
        cuerpo={cuerpoAbierto ?? null}
        signo={valorAbierto.signo}
        casa={cuerpoAbierto?.conCasa ? valorAbierto.casa : undefined}
      />

      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
