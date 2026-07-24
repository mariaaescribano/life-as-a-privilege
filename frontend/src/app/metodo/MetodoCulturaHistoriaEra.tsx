import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { LineaTiempoCultura } from "../../components/metodo/LineaTiempoCultura";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { getHistoria } from "../../components/metodo/culturaHistorias";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, culturaBg, culturaNom, culturaTxt, CulturaIcon } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Página de UNA era de una Historia de Cultura (cualquiera; la clave de la
// Historia y de la era van en la ruta: /metodo/cultura/historia/:historiaKey/:eraKey).
// Muestra la mini línea del tiempo de la era (sus sub-hitos: solo título + foto,
// sin fecha). Al pulsar un sub-hito se abre su cómic (foto + texto a la derecha).
// ─────────────────────────────────────────────────────────────────────────

const CULTURA_IMG = "/img/fondos/cultura.png";
const INK_SHADOW = `0 1px 3px ${culturaBg}f5, 0 0 8px ${culturaBg}cc, 0 2px 16px ${culturaBg}88`;

// Parte un texto en frases (salto de línea tras cada punto), re-uniendo los
// cortes falsos de abreviaturas de un carácter como «a. C.» / «d. C.».
function partirFrases(texto: string): string[] {
  return texto.split(/(?<=\.)\s+/).reduce<string[]>((acc, frag) => {
    const prev = acc[acc.length - 1];
    if (prev && /(^|\s)[A-Za-zÁÉÍÓÚÑ]\.$/.test(prev)) acc[acc.length - 1] = `${prev} ${frag}`;
    else acc.push(frag);
    return acc;
  }, []);
}

export default function MetodoCulturaHistoriaEra() {
  const navigate = useNavigate();
  const { historiaKey, eraKey } = useParams<{ historiaKey: string; eraKey: string }>();
  const [loading, setLoading] = useState(true);
  // Sub-hito abierto (su cómic). null = ninguno.
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const historia = useMemo(() => getHistoria(historiaKey), [historiaKey]);
  const era = useMemo(
    () => historia?.hitos.find((h) => h.key === eraKey) ?? null,
    [historia, eraKey],
  );
  const volverHistoria = `/metodo/cultura/historia/${historiaKey}`;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    // Historia inexistente → al listado; era inexistente → a la Historia.
    if (!historia) { navigate("/metodo/cultura/historias", { replace: true }); return; }
    if (!era) { navigate(volverHistoria, { replace: true }); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        // Gate de pago: sin suscripción a Cultura, a la portada (con el popup de pago).
        if (!me.data?.cultura_suscrito) { navigate("/metodo/cultura", { replace: true }); return; }
      } catch {
        navigate("/metodo/cultura", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, historia, era, volverHistoria]);

  const activo = useMemo(
    () => era?.subhitos.find((s) => s.key === activeKey) ?? null,
    [era, activeKey],
  );

  if (loading || !era) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const hayHitos = era.subhitos.length > 0;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={8}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CulturaIcon size={{ base: "40px", md: "56px" }} />}
              title={era.titulo}
              compact
              maxW="1000px"
              bgColor={`${culturaBg}dd`}
              color={culturaTxt}
              nom={culturaNom}
              mb={0}
              prev={{ label: "← La Historia", onClick: () => navigate(volverHistoria) }}
            />
          </Reveal>

          {/* Introducción de la etapa (si la tiene) o línea breve. */}
          {era.intro ? (
            <Reveal direction="up" distance={18} delay={0.1} duration={0.65} w="100%" display="flex" justifyContent="center">
              <Box maxW="760px" w="100%" borderRadius="2xl" px={{ base: 5, md: 8 }} py={{ base: 5, md: 7 }}
                   bg={`${culturaBg}66`} border={`1px solid ${culturaTxt}33`}
                   sx={{ backdropFilter: "blur(2px)" }}>
                <Flex direction="column" gap={{ base: 2.5, md: 3 }}>
                  {partirFrases(era.intro).map((frase, i) => (
                    <Text key={i} color={culturaTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                          fontStyle={i === 0 ? "italic" : "normal"} fontWeight={i === 0 ? 600 : 400}
                          style={{ textShadow: INK_SHADOW }}>
                      {frase}
                    </Text>
                  ))}
                </Flex>
              </Box>
            </Reveal>
          ) : (
            <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
              <Text color={culturaTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                    lineHeight="1.8" maxW="620px" opacity={0.92}>
                {hayHitos
                  ? "Recorre esta era y pulsa cada momento para descubrir su historia."
                  : "Muy pronto podrás recorrer los momentos de esta era."}
              </Text>
            </Reveal>
          )}

          {/* Etapa con intro pero aún sin momentos: aviso de «próximamente». */}
          {era.intro && !hayHitos && (
            <Reveal direction="up" distance={14} delay={0.2} duration={0.6} w="100%" display="flex" justifyContent="center">
              <Text color={`${culturaTxt}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center">
                Muy pronto podrás recorrer los momentos de esta era.
              </Text>
            </Reveal>
          )}

          {/* Mini línea de tiempo de la era (centrada). Los sub-hitos solo llevan
              título (sin fecha); su foto sigue en el círculo. */}
          {hayHitos && (
            <Reveal direction="up" distance={26} scaleFrom={0.98} delay={0.16} duration={0.75} w="100%"
                    display="flex" justifyContent="center" flex="1" alignItems="center">
              <LineaTiempoCultura
                hitos={era.subhitos}
                tinta={culturaTxt}
                bg={culturaBg}
                // Solo abrimos el cómic si el sub-hito tiene viñetas.
                onSelect={(key) => {
                  const sub = era.subhitos.find((s) => s.key === key);
                  if (sub && sub.vinetas.length > 0) setActiveKey(key);
                }}
              />
            </Reveal>
          )}
        </Flex>
      </Flex>

      {/* Cómic del sub-hito seleccionado (foto + texto), con el estilo de Cultura. */}
      <IntroComicModal
        isOpen={!!activo}
        vinetas={activo?.vinetas ?? []}
        onClose={() => setActiveKey(null)}
        themeColor={culturaTxt}
        textColor={culturaTxt}
        disciplinaBgImage={CULTURA_IMG}
        disciplinaBgColor={culturaBg}
        // Salto de línea después de cada punto (una frase por bloque).
        separarFrases
      />

      <BotonCompania color={culturaTxt} bgColor={culturaBg} disciplinaNom={culturaNom} />

      <SiteFooter />
    </Box>
  );
}
