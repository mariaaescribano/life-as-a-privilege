import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT, type ClaveTexto } from "../../i18n";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { glowHeader } from "../../components/metodo/FotoBox";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import {
  ALIMENTOS_MACROS, GRUPOS_MACRO, RONDAS, TOPES, TINO, MACROS_CAMPO,
  barajar, puntuarRonda, veredicto, margen,
  type AlimentoMacros, type MacrosJuegoData, type Tino,
} from "../../hardCoded/espacio/MacrosAlimentos";

// ═════════════════════════════════════════════════════════════════════════
// «Cuenta lo que comes» · el paso que va DESPUÉS de «Diseña tu día».
//
// Un juego de estimación: sale un alimento con su ración normal y hay que
// adivinar cuántos gramos de proteína, hidratos y grasa lleva moviendo tres
// reguladores. Al comprobar, la barra de tu apuesta se compara con la real y se
// revela el POR QUÉ del dato, que es lo que de verdad se queda.
//
// Se puntúa por cercanía y no por exactitud (ver `tinoDe`): nadie sabe que un
// huevo tiene 6,3 g de proteína, y no es lo que se quiere enseñar. Lo que se
// entrena es el orden de magnitud —«un huevo son seis gramos, no veinte»—, que
// es lo que sirve para mirar un plato el resto de tu vida.
//
// Diez rondas por partida, y solo se guarda el récord: es un juego para volver,
// no un examen que aprobar.
// ═════════════════════════════════════════════════════════════════════════

// `label` es la CLAVE i18n (constante de módulo: aquí no hay `t`).
// Los tres macros del juego. El tipo va declarado APARTE y no derivado del
// array: el array lo necesita en su propia anotación, y derivarlo sería
// circular.
type MacroKey = "proteina" | "hidratos" | "grasa";

const MACROS: { key: MacroKey; label: ClaveTexto; color: string }[] = [
  { key: "proteina", label: "metodo.nutri.macro.proteina", color: "#b1584f" },
  { key: "hidratos", label: "metodo.nutri.macro.hidratos", color: "#c99a4e" },
  { key: "grasa",    label: "metodo.nutri.macro.grasa",    color: "#7d9a3c" },
];

const aparecer = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const latido = keyframes`
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.14); }
`;

/** Un gramo se escribe sin decimales salvo cuando el dato es menor que 10. */
const g = (n: number) => (n < 10 && n % 1 !== 0 ? n.toFixed(1).replace(".", ",") : String(Math.round(n)));

// ── Regulador de un macro ────────────────────────────────────────────────────
// `input type=range` nativo, estilizado: se arrastra con el dedo igual de bien
// que con el ratón y no hay que reinventar el gesto.
function Regulador({
  label, color, valor, tope, onChange, bloqueado,
}: {
  label: string; color: string; valor: number; tope: number;
  onChange: (v: number) => void; bloqueado: boolean;
}) {
  return (
    <Box w="100%">
      <Flex align="baseline" justify="space-between" mb={1.5}>
        <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} fontWeight={700} letterSpacing="0.06em"
              textTransform="uppercase">
          {label}
        </Text>
        <Text color={nutricionTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight={800} lineHeight="1">
          {valor} <Box as="span" fontSize={{ base: "sm", md: "md" }} fontWeight={600} opacity={0.7}>g</Box>
        </Text>
      </Flex>
      <Box
        as="input"
        type="range"
        min={0}
        max={tope}
        step={1}
        value={valor}
        disabled={bloqueado}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
        w="100%"
        h="34px"
        cursor={bloqueado ? "default" : "pointer"}
        opacity={bloqueado ? 0.55 : 1}
        sx={{
          WebkitAppearance: "none",
          appearance: "none",
          background: "transparent",
          "&::-webkit-slider-runnable-track": {
            height: "8px",
            borderRadius: "999px",
            background: `linear-gradient(to right, ${color} ${(valor / tope) * 100}%, ${nutricionBg}55 ${(valor / tope) * 100}%)`,
          },
          "&::-webkit-slider-thumb": {
            WebkitAppearance: "none",
            width: "26px",
            height: "26px",
            marginTop: "-9px",
            borderRadius: "999px",
            background: "#ffffff",
            border: `3px solid ${color}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.28)",
          },
          "&::-moz-range-track": {
            height: "8px",
            borderRadius: "999px",
            background: `${nutricionBg}55`,
          },
          "&::-moz-range-progress": { height: "8px", borderRadius: "999px", background: color },
          "&::-moz-range-thumb": {
            width: "20px", height: "20px", borderRadius: "999px",
            background: "#ffffff", border: `3px solid ${color}`,
          },
        }}
      />
    </Box>
  );
}

// ── Comparativa tras comprobar: tu apuesta contra el dato real ───────────────
function Comparativa({
  label, color, estimado, real, tino, tope,
}: {
  label: string; color: string; estimado: number; real: number; tino: Tino; tope: number;
}) {
  const pct = (v: number) => `${Math.min((v / tope) * 100, 100)}%`;
  return (
    <Box w="100%">
      <Flex align="baseline" justify="space-between" mb={1}>
        <Text color={nutricionTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700}
              letterSpacing="0.06em" textTransform="uppercase">
          {label}
        </Text>
        <Text color={TINO[tino].color} fontSize={{ base: "xs", md: "sm" }} fontWeight={800}
              letterSpacing="0.08em" textTransform="uppercase">
          {TINO[tino].label}
        </Text>
      </Flex>

      {/* Tu apuesta, en hueco */}
      <Box position="relative" h="10px" w="100%" borderRadius="999px" bg={`${nutricionBg}44`} mb={1}>
        <Box position="absolute" left={0} top={0} bottom={0} w={pct(estimado)} borderRadius="999px"
             border={`2px solid ${color}`} bg="transparent" />
      </Box>
      {/* El dato real, macizo */}
      <Box position="relative" h="10px" w="100%" borderRadius="999px" bg={`${nutricionBg}44`}>
        <Box position="absolute" left={0} top={0} bottom={0} w={pct(real)} borderRadius="999px" bg={color}
             transition="width 0.7s cubic-bezier(0.22,1,0.36,1)" />
      </Box>

      <Flex justify="space-between" mt={1}>
        <Text color={nutricionTxt} fontSize="xs" opacity={0.75}>tú: {g(estimado)} g</Text>
        <Text color={nutricionTxt} fontSize="xs" fontWeight={700}>real: {g(real)} g</Text>
      </Flex>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionMacros() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dataRef = useRef<Record<string, any>>({});

  // La partida: diez alimentos barajados. `useMemo` con `partida` como semilla
  // para poder empezar otra sin recargar la página.
  const [partida, setPartida] = useState(0);
  const ronda = useRef(0);
  const [indice, setIndice] = useState(0);
  const alimentos = useMemo(
    () => barajar(ALIMENTOS_MACROS).slice(0, RONDAS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [partida],
  );
  const actual: AlimentoMacros | undefined = alimentos[indice];

  const [est, setEst] = useState<Record<MacroKey, number>>({ proteina: 5, hidratos: 20, grasa: 5 });
  const [comprobado, setComprobado] = useState(false);
  const [puntos, setPuntos] = useState(0);
  const [racha, setRacha] = useState(0);
  const [mejorRacha, setMejorRacha] = useState(0);
  const [terminada, setTerminada] = useState(false);
  const [record, setRecord] = useState(0);
  const [nuevoRecord, setNuevoRecord] = useState(false);

  const resultado = useMemo(
    () => (actual ? puntuarRonda(actual, est) : null),
    [actual, est],
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const guardado: MacrosJuegoData = dataRef.current?.[MACROS_CAMPO] ?? {};
          if (typeof guardado.mejor === "number") setRecord(guardado.mejor);
        } catch { /* sin fila todavía: se crea al guardar */ }

        // Las fotos de los diez alimentos de esta partida, antes de empezar: que
        // no aparezca el hueco vacío justo cuando toca adivinar.
        await precargarImagenes(ALIMENTOS_MACROS.map((a) => encodeURI(a.foto)));
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  /** Guarda el récord (un solo PATCH, con el blob entero como manda la casa). */
  const guardarRecord = (total: number) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const previo: MacrosJuegoData = dataRef.current?.[MACROS_CAMPO] ?? {};
    const data = {
      ...dataRef.current,
      [MACROS_CAMPO]: {
        mejor: Math.max(previo.mejor ?? 0, total),
        partidas: (previo.partidas ?? 0) + 1,
      } satisfies MacrosJuegoData,
    };
    dataRef.current = data;
    void axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
      { headers: { Authorization: `Bearer ${token}` } })
      .catch(() => { /* se reintenta la próxima partida */ });
  };

  const comprobar = () => {
    if (!resultado || comprobado) return;
    setComprobado(true);
    setPuntos((p) => p + resultado.puntos);
    // La racha premia rondas buenas (200 de 300), no la perfección.
    setRacha((r) => {
      const siguiente = resultado.puntos >= 200 ? r + 1 : 0;
      setMejorRacha((m) => Math.max(m, siguiente));
      return siguiente;
    });
  };

  const siguiente = () => {
    const total = puntos;
    if (indice + 1 >= alimentos.length) {
      setTerminada(true);
      if (total > record) { setNuevoRecord(true); setRecord(total); }
      guardarRecord(total);
      return;
    }
    ronda.current += 1;
    setIndice((i) => i + 1);
    setEst({ proteina: 5, hidratos: 20, grasa: 5 });
    setComprobado(false);
  };

  const otraPartida = () => {
    setPartida((p) => p + 1);
    setIndice(0);
    setEst({ proteina: 5, hidratos: 20, grasa: 5 });
    setComprobado(false);
    setPuntos(0);
    setRacha(0);
    setMejorRacha(0);
    setTerminada(false);
    setNuevoRecord(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <NutricionLoading />;

  const grupo = actual ? GRUPOS_MACRO[actual.grupo] : null;
  const fin = veredicto(puntos);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="Cuenta lo que comes"
              compact
              maxW="900px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: `← ${t("metodo.nutri.paso.dia")}`, onClick: () => navigate("/metodo/nutricion/dia") }}
              extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: `${t("metodo.nutri.paso.mitos")} →`, onClick: () => navigate("/metodo/nutricion/mitos") }}
            />
          </Reveal>

          {/* El lema de la página */}
          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Flex direction="column" align="center" gap={2} maxW="720px">
              <Text color="white" fontSize={{ base: "xl", md: "3xl" }} fontWeight={600} fontStyle="italic"
                    textAlign="center" lineHeight="1.5">
                Aprende lo que de verdad te ayudará a ser mejor humano…
              </Text>
              <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} textAlign="center"
                    lineHeight="1.8">
                Nadie te enseñó a mirar un plato y saber lo que lleva. Se aprende como se aprende a calcular
                distancias: fallando y volviendo a mirar. No hace falta acertar el gramo exacto —basta con no
                equivocarte de tamaño—.
              </Text>
            </Flex>
          </Reveal>

          {/* ── Marcador ── */}
          <Reveal inView direction="up" distance={14} duration={0.55} amount={0.3} w="100%">
            <Flex align="center" justify="center" gap={{ base: 4, md: 8 }} wrap="wrap" w="100%">
              <Marcador etiqueta="Ronda" valor={terminada ? `${RONDAS}/${RONDAS}` : `${indice + 1}/${RONDAS}`} />
              <Marcador etiqueta="Puntos" valor={String(puntos)} />
              <Marcador etiqueta="Racha" valor={String(racha)} destacado={racha >= 2} />
              {record > 0 && <Marcador etiqueta="Tu récord" valor={String(record)} />}
            </Flex>
          </Reveal>

          {/* ── El juego ── */}
          {!terminada && actual && (
            <Reveal inView direction="up" distance={22} scaleFrom={0.98} duration={0.65} amount={0.15} w="100%">
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={glowHeader(nutricionTxt)}>
                <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}55`} />

                <Box position="absolute" top="-1px" left="15%" right="15%" h="1px" zIndex={2}
                     bgGradient={`linear(to-r, transparent, ${nutricionTxt}aa, transparent)`} />

                <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }}
                      gap={{ base: 6, md: 9 }} px={{ base: 5, md: 9 }} py={{ base: 6, md: 9 }}
                      align={{ base: "stretch", md: "flex-start" }}>

                  {/* El alimento */}
                  <Flex direction="column" align="center" flexShrink={0} w={{ base: "100%", md: "300px" }} gap={3}>
                    <Box key={actual.key} w="100%" maxW="300px" aspectRatio={1} position="relative"
                         animation={`${aparecer} 0.5s ease both`}
                         filter={`drop-shadow(0 0 12px rgba(255,255,255,0.16)) drop-shadow(0 0 32px ${nutricionTxt}33)`}>
                      <Image src={encodeURI(actual.foto)} alt={actual.nombre} w="100%" h="100%"
                             objectFit="cover" borderRadius="xl" />
                    </Box>

                    {grupo && (
                      <Flex align="center" gap={2} px={3} py={1} borderRadius="full" bg={`${grupo.color}22`}
                            border={`1px solid ${grupo.color}88`}>
                        <Box w="7px" h="7px" borderRadius="full" bg={grupo.color} />
                        <Text color={nutricionTxt} fontSize="2xs" fontWeight={700} letterSpacing="0.12em"
                              textTransform="uppercase">
                          {grupo.label}
                        </Text>
                      </Flex>
                    )}

                    <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={800}
                          lineHeight="1.15" textAlign="center">
                      {actual.emoji} {actual.nombre}
                    </Text>
                    <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                          textAlign="center" opacity={0.85}>
                      {actual.racion}
                    </Text>
                  </Flex>

                  {/* Los reguladores / la comparativa */}
                  <Flex direction="column" flex="1" minW={0} gap={{ base: 5, md: 6 }}>
                    {!comprobado ? (
                      <>
                        <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} fontWeight={700}>
                          ¿Cuántos gramos crees que lleva esta ración?
                        </Text>
                        {MACROS.map((m) => (
                          <Regulador
                            key={m.key}
                            label={t(m.label)}
                            color={m.color}
                            valor={est[m.key]}
                            tope={TOPES[m.key]}
                            bloqueado={false}
                            onChange={(v) => setEst((s) => ({ ...s, [m.key]: v }))}
                          />
                        ))}
                        <Boton onClick={comprobar}>Comprobar</Boton>
                      </>
                    ) : (
                      <>
                        <Flex align="baseline" justify="space-between" gap={3} wrap="wrap">
                          <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} fontWeight={700}>
                            Tu apuesta (hueco) y el dato real (macizo)
                          </Text>
                          <Text color={nutricionTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight={800}>
                            +{resultado?.puntos ?? 0}
                          </Text>
                        </Flex>

                        {MACROS.map((m) => (
                          <Comparativa
                            key={m.key}
                            label={t(m.label)}
                            color={m.color}
                            estimado={est[m.key]}
                            real={actual[m.key]}
                            tino={resultado!.tinos[m.key]}
                            tope={TOPES[m.key]}
                          />
                        ))}

                        {/* El porqué: lo que de verdad se lleva de la ronda */}
                        <Box borderRadius="xl" bg="rgba(255,255,255,0.9)" px={{ base: 4, md: 5 }}
                             py={{ base: 3.5, md: 4 }} animation={`${aparecer} 0.5s ease 0.15s both`}>
                          <Text color="#1a1a1a" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
                            {actual.sorpresa}
                          </Text>
                          <Text color="#1a1a1a" fontSize="xs" mt={2.5} opacity={0.7} fontStyle="italic">
                            {actual.racion} · {actual.kcal} kcal · margen aceptado: ±{g(margen(actual.proteina))} g
                            en proteína, ±{g(margen(actual.hidratos))} en hidratos, ±{g(margen(actual.grasa))} en grasa
                          </Text>
                        </Box>

                        <Boton onClick={siguiente}>
                          {indice + 1 >= alimentos.length ? "Ver el resultado" : "Siguiente alimento →"}
                        </Boton>
                      </>
                    )}
                  </Flex>
                </Flex>
              </Box>
            </Reveal>
          )}

          {/* ── Final de partida ── */}
          {terminada && (
            <Reveal direction="up" distance={22} scaleFrom={0.98} duration={0.7} w="100%">
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                   boxShadow={`${glowHeader(nutricionTxt)}, 0 0 40px ${nutricionTxt}33`}>
                <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}55`} />
                <Flex position="relative" zIndex={1} direction="column" align="center" gap={4}
                      px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }} textAlign="center">
                  {nuevoRecord && (
                    <Text color={nutricionTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={800}
                          letterSpacing="0.18em" textTransform="uppercase"
                          animation={`${latido} 1.6s ease-in-out infinite`}>
                      ★ Nuevo récord
                    </Text>
                  )}
                  <Text color={nutricionTxt} fontSize={{ base: "3xl", md: "5xl" }} fontWeight={800} lineHeight="1">
                    {puntos}
                    <Box as="span" fontSize={{ base: "md", md: "xl" }} fontWeight={600} opacity={0.7}>
                      {" "}/ {RONDAS * 300}
                    </Box>
                  </Text>
                  <Text color={nutricionTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight={700}>
                    {fin.titulo}
                  </Text>
                  <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" maxW="620px">
                    {fin.texto}
                  </Text>
                  {mejorRacha >= 2 && (
                    <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.85}>
                      Tu mejor racha: {mejorRacha} alimentos seguidos.
                    </Text>
                  )}
                  <Box mt={2}>
                    <Boton onClick={otraPartida}>Otra ronda de diez</Boton>
                  </Box>
                </Flex>
              </Box>
            </Reveal>
          )}

          <BotonPaso label="Preguntas y mitos" nom={nutricionNom} color={nutricionTxt} bg={nutricionBg}
                     onClick={() => navigate("/metodo/nutricion/mitos")} />
        </Flex>
      </Flex>

      <IndiceNutricion />
      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}

// ── Piezas pequeñas ─────────────────────────────────────────────────────────
function Marcador({ etiqueta, valor, destacado }: { etiqueta: string; valor: string; destacado?: boolean }) {
  return (
    <Flex direction="column" align="center" gap={0.5}>
      <Text color="rgba(255,255,255,0.8)" fontSize="2xs" fontWeight={700} letterSpacing="0.16em"
            textTransform="uppercase">
        {etiqueta}
      </Text>
      <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight={800} lineHeight="1"
            animation={destacado ? `${latido} 1.4s ease-in-out infinite` : undefined}>
        {valor}
      </Text>
    </Flex>
  );
}

function Boton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <Box as="button" onClick={onClick} alignSelf={{ base: "stretch", md: "flex-start" }}
         position="relative" overflow="hidden" display="inline-flex" alignItems="center" justifyContent="center"
         px={{ base: 7, md: 9 }} py={3} borderRadius="full"
         border={`2px solid ${nutricionTxt}`} bg={`${nutricionBg}d9`} color={nutricionTxt}
         fontFamily="'EB Garamond', serif" fontWeight={800} fontSize={{ base: "md", md: "lg" }}
         letterSpacing="0.04em" cursor="pointer" transition="transform 0.18s ease, background 0.18s ease"
         _hover={{ transform: "translateY(-2px)", bg: nutricionBg }}
         sx={{ WebkitTapHighlightColor: "transparent" }}>
      {children}
    </Box>
  );
}
