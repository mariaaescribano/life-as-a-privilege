import React, { useEffect, useMemo, useState } from "react";
import { useT } from "../../i18n";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Flex } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { CulturaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { LineaTiempoCultura } from "../../components/metodo/LineaTiempoCultura";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { getHistoria } from "../../components/metodo/culturaHistorias";
import { Reveal } from "../../components/global/Reveal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, culturaBg, culturaNom, culturaTxt, CulturaIcon } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Página de UNA era de una Historia de Cultura (cualquiera; la clave de la
// Historia y de la era van en la ruta: /metodo/cultura/historia/:historiaKey/:eraKey).
// Muestra la mini línea del tiempo de la era (sus sub-hitos: solo título + foto,
// sin fecha). Al pulsar un sub-hito se abre su cómic (foto + texto a la derecha).
// ─────────────────────────────────────────────────────────────────────────

const CULTURA_IMG = "/img/fondos/cultura.webp";
// Nº de fotos de la «primera ronda» de sub-hitos que se precargan antes de
// mostrar la era (las de más allá se cargan al desplazarse con las flechas).
const PRIMERA_RONDA = 6;

export default function MetodoCulturaHistoriaEra() {
  const t = useT();
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

  // Eras vecinas: la Historia es una línea del tiempo, así que desde una era se
  // puede AVANZAR a la siguiente (y volver a la anterior) sin pasar por el
  // índice. Al terminar el cómic de la era también se salta a la siguiente.
  const { eraAnterior, eraSiguiente } = useMemo(() => {
    const eras = historia?.hitos ?? [];
    const i = eras.findIndex((h) => h.key === eraKey);
    return {
      eraAnterior: i > 0 ? eras[i - 1] : null,
      eraSiguiente: i >= 0 && i < eras.length - 1 ? eras[i + 1] : null,
    };
  }, [historia, eraKey]);

  const irAEra = (key: string) => {
    setActiveKey(null);
    navigate(`/metodo/cultura/historia/${historiaKey}/${key}`);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    // Al cambiar de era volvemos a esperar (loader + precarga de sus fotos): si
    // no, la nueva era se pintaría con los círculos aún sin imagen.
    setLoading(true);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    // Historia inexistente → al listado; era inexistente → a la Historia.
    if (!historia) { navigate("/metodo/cultura/historias", { replace: true }); return; }
    if (!era) { navigate(volverHistoria, { replace: true }); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        // Gate de pago: sin suscripción a Cultura, a la portada (con el popup de pago).
        if (!me.data?.cultura_suscrito) { navigate("/metodo/cultura", { replace: true }); return; }

        // No mostramos la era hasta que las fotos de la primera ronda de
        // sub-hitos estén cargadas (las de más allá se cargan con las flechas).
        await precargarImagenes(
          (era?.subhitos ?? []).slice(0, PRIMERA_RONDA).map((s) => (s.foto ? encodeURI(s.foto) : null)),
        );
      } catch {
        navigate("/metodo/cultura", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, historia, era, volverHistoria]);

  // Todas las viñetas de la era, en orden, concatenando los sub-hitos que ya
  // tienen cómic. Así, dentro del visor, la flecha pasa de un momento al
  // siguiente (y de una viñeta a la siguiente) sin cerrar y reabrir; recorre la
  // era entera de un tirón. Guardamos también el índice donde empieza cada
  // sub-hito para abrir directamente en el momento que se pulsa.
  const { todasVinetas, indicePorSubhito } = useMemo(() => {
    const conComic = (era?.subhitos ?? []).filter((s) => s.vinetas.length > 0);
    const vinetas = conComic.flatMap((s) => s.vinetas);
    const indice: Record<string, number> = {};
    let i = 0;
    conComic.forEach((s) => { indice[s.key] = i; i += s.vinetas.length; });
    return { todasVinetas: vinetas, indicePorSubhito: indice };
  }, [era]);

  const abierto = activeKey !== null;
  const indiceInicial = activeKey != null ? (indicePorSubhito[activeKey] ?? 0) : 0;

  if (loading || !era) {
    return <CulturaLoading />;
  }

  const hayHitos = era.subhitos.length > 0;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        {/* 1240 y no 1000: la banda de la línea del tiempo necesita aire para
            que quepan seis círculos decentes. El header no se entera — lleva su
            propio maxW="1000px" ahí abajo. */}
        <Flex direction="column" align="center" w="100%" maxW="1240px" gap={8}>

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
              prev={{ label: `← ${t("metodo.cultura.paso.historia")}`, onClick: () => navigate(volverHistoria) }}
              // Avanzar/retroceder entre eras sin volver al índice. En la última
              // era el botón se queda deshabilitado (con su explicación) para que
              // no baile la fila de botones de una era a otra.
              extra={eraAnterior
                ? { label: eraAnterior.titulo, arrow: "prev", onClick: () => irAEra(eraAnterior.key) }
                : { label: t("metodo.cultura.era.anterior"), arrow: "prev", onClick: () => {}, disabled: true,
                    disabledTooltip: t("metodo.cultura.era.esPrimera") }}
              next={eraSiguiente
                ? { label: eraSiguiente.titulo, arrow: "next", onClick: () => irAEra(eraSiguiente.key) }
                : { label: t("metodo.cultura.era.siguiente"), arrow: "next", onClick: () => {}, disabled: true,
                    disabledTooltip: t("metodo.cultura.era.esUltima") }}
            />
          </Reveal>

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

      {/* Cómic de la era: TODOS los momentos concatenados, abriendo en el que se
          pulsó. Así la flecha del visor pasa de una viñeta (momento) a la
          siguiente sin salir, recorriendo la era entera. */}
      <IntroComicModal
        isOpen={abierto}
        vinetas={todasVinetas}
        initialIndex={indiceInicial}
        onClose={() => setActiveKey(null)}
        // Al terminar la era (avanzar más allá de la última viñeta) se pasa
        // directamente a la era siguiente; si es la última, solo se cierra.
        onComplete={eraSiguiente ? () => irAEra(eraSiguiente.key) : undefined}
        // Botón siempre visible, junto a la X: saltar a la era siguiente sin
        // tener que leerse el resto del cómic.
        continueLabel={eraSiguiente ? eraSiguiente.titulo : undefined}
        onContinue={eraSiguiente ? () => irAEra(eraSiguiente.key) : undefined}
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
