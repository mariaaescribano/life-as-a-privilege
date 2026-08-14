import React, { useEffect, useMemo, useState } from "react";
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
  ALIMENTOS_MACROS, RONDAS, TOPES,
  barajar, tinosDeRonda,
  type AlimentoMacros, type Tino,
} from "../../hardCoded/espacio/MacrosAlimentos";
import { useAlimentosMacros, useEtiquetasMacros } from "../../hardCoded/espacio/useMacrosJuego";

// ═════════════════════════════════════════════════════════════════════════
// «Cuenta lo que comes» · el paso que va DESPUÉS de «Diseña tu día».
//
// Un juego de estimación y NADA MÁS: sale un alimento con su ración normal y hay
// que adivinar cuántos gramos de proteína, hidratos y grasa lleva moviendo tres
// reguladores. Al comprobar, la barra de tu apuesta se compara con la real y cada
// macro dice si está clavado, cerca o lejos.
//
// Se valora por cercanía y no por exactitud (ver `tinoDe`): nadie sabe que un
// huevo tiene 6,3 g de proteína, y no es lo que se quiere enseñar. Lo que se
// entrena es el orden de magnitud —«un huevo son seis gramos, no veinte»—, que
// es lo que sirve para mirar un plato el resto de tu vida.
//
// SIN PUNTOS Y SIN LA CAJA DEL PORQUÉ. Antes cada ronda cerraba con una caja
// blanca explicando el dato («tanta grasa como un filete de cerdo…») y el juego
// llevaba puntos, racha y récord guardado. Las dos cosas fuera: la caja pedía
// revisar un texto por alimento, y los puntos convertían en examen lo que es un
// ojímetro. Del marcador queda solo la ronda en la que vas, y no se guarda nada.
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
  const tn = useEtiquetasMacros().tino(tino);
  const pct = (v: number) => `${Math.min((v / tope) * 100, 100)}%`;
  return (
    <Box w="100%">
      <Flex align="baseline" justify="space-between" mb={1}>
        <Text color={nutricionTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700}
              letterSpacing="0.06em" textTransform="uppercase">
          {label}
        </Text>
        <Text color={tn.color} fontSize={{ base: "xs", md: "sm" }} fontWeight={800}
              letterSpacing="0.08em" textTransform="uppercase">
          {tn.label}
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

  // La partida: diez alimentos barajados. `useMemo` con `partida` como semilla
  // para poder empezar otra sin recargar la página.
  const [partida, setPartida] = useState(0);
  const [indice, setIndice] = useState(0);
  const etiquetas = useEtiquetasMacros();
  // La baraja se hace SIEMPRE sobre el español: así cambiar de idioma a mitad
  // de partida no reparte otros diez alimentos. El texto se traduce al pintar.
  const alimentosMacros = useAlimentosMacros();
  const alimentos = useMemo(
    () => barajar(ALIMENTOS_MACROS).slice(0, RONDAS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [partida],
  );
  // El alimento de la ronda, ya con su nombre y su ración en el idioma activo.
  const sorteado: AlimentoMacros | undefined = alimentos[indice];
  const actual: AlimentoMacros | undefined = sorteado
    ? alimentosMacros.find((a) => a.key === sorteado.key) ?? sorteado
    : undefined;

  const [est, setEst] = useState<Record<MacroKey, number>>({ proteina: 5, hidratos: 20, grasa: 5 });
  const [comprobado, setComprobado] = useState(false);
  const [terminada, setTerminada] = useState(false);

  const tinos = useMemo(
    () => (actual ? tinosDeRonda(actual, est) : null),
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
        // Aquí se leía el récord guardado. Ya no hay récord: el juego no guarda
        // nada, así que tampoco hace falta pedir el `data` del recorrido.

        // Las fotos de los diez alimentos de esta partida, antes de empezar: que
        // no aparezca el hueco vacío justo cuando toca adivinar.
        await precargarImagenes(ALIMENTOS_MACROS.map((a) => encodeURI(a.foto)));
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  const comprobar = () => {
    if (!tinos || comprobado) return;
    setComprobado(true);
  };

  const siguiente = () => {
    if (indice + 1 >= alimentos.length) { setTerminada(true); return; }
    setIndice((i) => i + 1);
    setEst({ proteina: 5, hidratos: 20, grasa: 5 });
    setComprobado(false);
  };

  const otraPartida = () => {
    setPartida((p) => p + 1);
    setIndice(0);
    setEst({ proteina: 5, hidratos: 20, grasa: 5 });
    setComprobado(false);
    setTerminada(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <NutricionLoading />;

  const grupo = actual ? etiquetas.grupo(actual.grupo) : null;
  const CIERRE_PARTIDA = etiquetas.cierre;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title={t("metodo.nutri.paso.macros")}
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
                {t("metodo.nutri.macros.lema")}
              </Text>
              <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} textAlign="center"
                    lineHeight="1.8">
                {t("metodo.nutri.macros.intro")}
              </Text>
            </Flex>
          </Reveal>

          {/* ── Marcador: SOLO la ronda ──
              Aquí iban también Puntos, Racha y Tu récord. Fuera: el juego no
              puntúa, así que lo único que hay que saber es por dónde vas. */}
          <Reveal inView direction="up" distance={14} duration={0.55} amount={0.3} w="100%">
            <Flex align="center" justify="center" w="100%">
              <Marcador etiqueta={t("metodo.nutri.macros.ronda")} valor={terminada ? `${RONDAS}/${RONDAS}` : `${indice + 1}/${RONDAS}`} />
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

                    {/* Sin el emoji delante: encima ya está la foto del
                        alimento, así que el icono no añadía nada y le quitaba
                        seriedad al título. El campo `emoji` sigue en los datos
                        porque lo usan «Diseña tu día», «Tu plato» y la ficha de
                        alimento, donde sí hace de icono. */}
                    <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={800}
                          lineHeight="1.15" textAlign="center">
                      {actual.nombre}
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
                          {t("metodo.nutri.macros.cuantosGramos")}
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
                        <Boton onClick={comprobar}>{t("metodo.nutri.macros.comprobar")}</Boton>
                      </>
                    ) : (
                      <>
                        <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} fontWeight={700}>
                          {t("metodo.nutri.macros.tuApuesta")}
                        </Text>

                        {MACROS.map((m) => (
                          <Comparativa
                            key={m.key}
                            label={t(m.label)}
                            color={m.color}
                            estimado={est[m.key]}
                            real={actual[m.key]}
                            tino={tinos![m.key]}
                            tope={TOPES[m.key]}
                          />
                        ))}

                        {/* Aquí iba la caja blanca del porqué (`sorpresa`) con su
                            pie de ración, kcal y márgenes. Quitada: la página es
                            el juego y el dato ya se ve en las barras. */}

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
                {/* Sin puntuación, sin récord y sin racha: solo que se ha
                    terminado la vuelta y la invitación a otra. */}
                <Flex position="relative" zIndex={1} direction="column" align="center" gap={4}
                      px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }} textAlign="center">
                  <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "4xl" }} fontWeight={800} lineHeight="1.1">
                    {CIERRE_PARTIDA.titulo}
                  </Text>
                  <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" maxW="620px">
                    {CIERRE_PARTIDA.texto}
                  </Text>
                  <Box mt={2}>
                    <Boton onClick={otraPartida}>{t("metodo.nutri.macros.otraRonda")}</Boton>
                  </Box>
                </Flex>
              </Box>
            </Reveal>
          )}

          <BotonPaso label={t("metodo.nutri.paso.mitos")} nom={nutricionNom} color={nutricionTxt} bg={nutricionBg}
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
function Marcador({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <Flex direction="column" align="center" gap={0.5}>
      <Text color="rgba(255,255,255,0.8)" fontSize="2xs" fontWeight={700} letterSpacing="0.16em"
            textTransform="uppercase">
        {etiqueta}
      </Text>
      <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight={800} lineHeight="1">
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
