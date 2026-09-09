// ═════════════════════════════════════════════════════════════════════════
// PÁGINA · «¿Cómo va tu azúcar?» — test de riesgo de prediabetes (FINDRISC).
//
// Va DESPUÉS de «Tus calorías y macros» y ANTES de «Diseña tu día»: ahí es donde
// ya están la edad, el peso y la altura, así que el test se rellena casi solo y
// su resultado llega justo antes de que la persona diseñe cómo va a comer.
//
// NO bloquea «Diseña tu día». Un test de salud se ofrece, no se impone.
//
// ⚠️ Sobre el tono, ver la cabecera de hardCoded/espacio/PrediabetesNutricion.ts.
//    En resumen: el IMC puntúa por dentro y NO se muestra nunca (ni número ni
//    etiqueta), los datos corporales vienen ya rellenos de «Tus calorías», y el
//    resultado separa lo que no se elige de lo que está en tu mano.
//
// Datos: metodo_nutricion.data.prediabetes (ver `PrediabetesData`).
// ═════════════════════════════════════════════════════════════════════════
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useT } from "../../i18n";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { glowHeader } from "../../components/metodo/FotoBox";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import {
  PREDIABETES_PREGUNTAS,
  prediabetesRespondidas,
  prediabetesCompleto,
  type PrediabetesData,
  type Sexo,
} from "../../hardCoded/espacio/PrediabetesNutricion";
import {
  usePreguntasPrediabetes,
  useSenalesAlerta,
  useTextosPrediabetes,
  useResultadoPrediabetes,
  useBandaPrediabetes,
} from "../../hardCoded/espacio/usePrediabetes";

// ── Marco de sección con el fondo acuarela de Nutrición (igual que Calorías) ──
function SeccionBox({ children, ...rest }: React.ComponentProps<typeof Box>) {
  return (
    <Box position="relative" overflow="hidden" w="100%" borderRadius="2xl"
         boxShadow={glowHeader(nutricionTxt)} {...rest}>
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}4d`} />
      <Box position="relative" zIndex={1}>{children}</Box>
    </Box>
  );
}

// ── Botón de opción (mismo lenguaje visual que el resto de Nutrición) ──
function Opcion({ activo, label, onClick, ...rest }: {
  activo: boolean; label: React.ReactNode; onClick: () => void;
} & Omit<React.ComponentProps<typeof Box>, "onClick" | "label">) {
  return (
    <Box
      as="button"
      onClick={onClick}
      px={{ base: 3.5, md: 4 }}
      py={2}
      borderRadius="full"
      fontSize={{ base: "sm", md: "md" }}
      fontWeight={600}
      textAlign="center"
      color={activo ? nutricionBg : nutricionTxt}
      bg={activo ? nutricionTxt : "#ffffff88"}
      border={`1px solid ${activo ? nutricionTxt : `${nutricionTxt}44`}`}
      cursor="pointer"
      transition="all 0.18s ease"
      _hover={activo ? undefined : { bg: `${nutricionTxt}1f`, borderColor: `${nutricionTxt}88` }}
      {...rest}
    >
      {label}{activo ? " ✓" : ""}
    </Box>
  );
}

// ── Campo numérico con sufijo ──
function CampoNum({ label, sufijo, value, onChange, maxW = "110px" }: {
  label: string; sufijo: string; value: string; onChange: (v: string) => void; maxW?: string;
}) {
  return (
    <Flex direction="column" gap={1.5}>
      <Text color={nutricionTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={600} letterSpacing="0.04em">
        {label}
      </Text>
      <Flex align="center" gap={2}>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
          inputMode="numeric"
          placeholder="—"
          maxW={maxW}
          bg="#ffffffcc"
          border={`1px solid ${nutricionTxt}33`}
          color={nutricionTxt}
          fontWeight={600}
          _hover={{ borderColor: `${nutricionTxt}66` }}
          _focusVisible={{ borderColor: nutricionTxt, boxShadow: `0 0 0 1px ${nutricionTxt}` }}
          _placeholder={{ color: `${nutricionTxt}55` }}
        />
        <Text color={`${nutricionTxt}aa`} fontSize={{ base: "sm", md: "md" }}>{sufijo}</Text>
      </Flex>
    </Flex>
  );
}

// ── Rótulo de sección ──
const Rotulo = ({ children }: { children: React.ReactNode }) => (
  <Text color={nutricionTxt} fontSize="xs" fontWeight={700} letterSpacing="0.14em"
        textTransform="uppercase" mb={2}>
    {children}
  </Text>
);

export default function MetodoNutricionPrediabetes() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [comoMedirse, setComoMedirse] = useState(false);
  const [editarDatos, setEditarDatos] = useState(false);

  // Datos corporales (se traen de «Tus calorías»; editables aquí sin tocarlas).
  const [sexo, setSexo] = useState<Sexo>("mujer");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  // Cintura.
  const [cintura, setCintura] = useState("");
  const [sinCintura, setSinCintura] = useState(false);
  // Respuestas de las 5 preguntas.
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});

  const dataRef = useRef<Record<string, any>>({});
  const resultadoRef = useRef<HTMLDivElement | null>(null);
  const yaCompleto = useRef(false);

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
        } catch { /* sin fila todavía */ }

        // El test necesita edad, peso y altura: sin las calorías hechas no hay
        // de dónde sacarlas, así que se vuelve a esa página.
        if (!dataRef.current?.calorias?.hecho) {
          navigate("/metodo/nutricion/calorias", { replace: true });
          return;
        }

        // Prerrellenado: primero lo que ya guardó en el test, y si no, lo que
        // dio en «Tus calorías». Nadie vuelve a escribir su peso.
        const guardado: PrediabetesData = dataRef.current?.prediabetes ?? {};
        const cal = dataRef.current?.calorias?.entrada ?? {};
        const b = guardado.base ?? {};
        const s = b.sexo ?? cal.sexo;
        setSexo(s === "hombre" ? "hombre" : "mujer");
        setEdad(String(b.edad ?? cal.edad ?? ""));
        setPeso(String(b.peso ?? cal.peso ?? ""));
        setAltura(String(b.altura ?? cal.altura ?? ""));
        if (guardado.cintura) setCintura(String(guardado.cintura));
        setSinCintura(!!guardado.sinCintura);
        if (guardado.respuestas && typeof guardado.respuestas === "object") {
          setRespuestas({ ...guardado.respuestas });
          yaCompleto.current = prediabetesCompleto(guardado);
        }
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // Estado del test tal y como está ahora en pantalla.
  const estado: PrediabetesData = useMemo(() => ({
    cintura: sinCintura ? undefined : (Number(cintura) || undefined),
    sinCintura,
    respuestas,
    base: { sexo, edad: Number(edad) || undefined, peso: Number(peso) || undefined, altura: Number(altura) || undefined },
  }), [sexo, edad, peso, altura, cintura, sinCintura, respuestas]);

  const resultado = useResultadoPrediabetes(estado);
  // La banda se resuelve ARRIBA: es un hook y no puede ir tras el `return` de
  // carga. Sin resultado todavía no se pinta (`banda` queda a null más abajo).
  const bandaDeLaPuntuacion = useBandaPrediabetes(resultado?.puntos ?? 0);
  // Todo el texto de la página, en el idioma activo.
  const preguntas = usePreguntasPrediabetes();
  const senales = useSenalesAlerta();
  const textos = useTextosPrediabetes();
  const respondidas = prediabetesRespondidas(estado);
  const total = PREDIABETES_PREGUNTAS.length;
  // La cintura cuenta como paso hecho cuando se mide o se declina medirse.
  const cinturaLista = sinCintura || Number(cintura) > 0;
  const completo = prediabetesCompleto(estado) && cinturaLista;

  // Guardado con debounce (mismo patrón que «Tus calorías»).
  useEffect(() => {
    if (loading) return;
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const t = setTimeout(() => {
      const prediabetes: PrediabetesData = {
        ...estado,
        hecho: completo,
        puntos: resultado?.puntos,
      };
      const data = { ...dataRef.current, prediabetes };
      dataRef.current = data;
      setGuardando(true);
      axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } })
        .catch(() => { /* reintenta al próximo cambio */ })
        .finally(() => setGuardando(false));
    }, 700);
    return () => clearTimeout(t);
  }, [estado, completo, resultado, loading]);

  // Al completarlo por primera vez, llevamos la vista al resultado.
  useEffect(() => {
    if (completo && !yaCompleto.current) {
      yaCompleto.current = true;
      setTimeout(() => resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 240);
    }
  }, [completo]);

  const responder = (key: string, value: string) =>
    setRespuestas((prev) => ({ ...prev, [key]: value }));

  if (loading) return <NutricionLoading />;

  const banda = resultado ? bandaDeLaPuntuacion : null;
  const { intro: PREDIABETES_INTRO, senales: SENALES_INTRO, cintura: CINTURA_AYUDA,
          esperanza: PREDIABETES_ESPERANZA } = textos;
  // Separamos lo que no se elige de lo que sí está en tu mano: es la diferencia
  // entre informar y culpabilizar.
  const heredados = resultado?.desglose.filter((d) => !d.modificable && d.puntos > 0) ?? [];
  const enTuMano = resultado?.desglose.filter((d) => d.modificable && d.puntos > 0) ?? [];

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title={PREDIABETES_INTRO.titulo}
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: `← ${t("metodo.nutri.paso.calorias")}`, onClick: () => navigate("/metodo/nutricion/calorias") }}
              extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: `${t("metodo.nutri.paso.dia")} →`, onClick: () => navigate("/metodo/nutricion/dia") }}
            />
          </Reveal>

          {/* ── Sobre el turquesa: la frase + progreso ──
              El «¿Qué es esto?» ya no va aquí: es la pastilla flotante de la
              esquina, encima de «Agenda una llamada» (ver BotonCompania al final
              de la página), igual que en todo el recorrido de astrología. Aquí
              partía en dos el camino de la vista —frase, botón, progreso— y lo
              que tiene que llevar la vista es el progreso. */}
          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Flex direction="column" align="center" gap={4} w="100%" maxW="640px">
              <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                    textAlign="center" lineHeight="1.8">
                {PREDIABETES_INTRO.subtitulo}
              </Text>

              <Flex align="center" gap={3} w="100%" maxW="380px">
                <Box flex="1" h="7px" borderRadius="full" bg="rgba(255,255,255,0.22)" overflow="hidden">
                  <Box h="100%" borderRadius="full"
                       w={`${((respondidas + (cinturaLista ? 1 : 0)) / (total + 1)) * 100}%`}
                       bg={nutricionTxt} boxShadow={`0 0 10px ${nutricionTxt}cc`} transition="width 0.4s ease" />
                </Box>
                <Text color={nutricionTxt} fontSize="sm" fontWeight={700} whiteSpace="nowrap"
                      style={{ textShadow: "0 0 10px rgba(255,255,255,0.55), 0 1px 2px rgba(255,255,255,0.7)" }}>
                  {respondidas + (cinturaLista ? 1 : 0)}/{total + 1}
                </Text>
              </Flex>
            </Flex>
          </Reveal>

          {/* ── TUS DATOS · vienen de «Tus calorías», no hay que reescribirlos ── */}
          <Reveal inView direction="up" distance={20} delay={0.14} duration={0.6} w="100%">
            <SeccionBox>
              <Box px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>
                <Rotulo>{t("metodo.nutri.tusDatos")}</Rotulo>
                {!editarDatos ? (
                  <Flex align="center" justify="space-between" gap={4} wrap="wrap">
                    <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
                      {t("metodo.nutri.usamosTusCalorias")}{" "}
                      <Text as="span" fontWeight={700}>
                        {edad || "—"} {t("metodo.nutri.anos")} · {altura || "—"} cm · {peso || "—"} kg ·{" "}
                        {sexo === "hombre" ? t("metodo.nutri.hombre") : t("metodo.nutri.mujer")}
                      </Text>
                    </Text>
                    <Box as="button" onClick={() => setEditarDatos(true)}
                         px={4} py={1.5} borderRadius="full" flexShrink={0} cursor="pointer"
                         color={nutricionTxt} bg={`${nutricionTxt}14`} border={`1px solid ${nutricionTxt}44`}
                         fontSize="sm" fontWeight={600} _hover={{ bg: `${nutricionTxt}2a` }}>
                      {t("metodo.astro.cambiar")}
                    </Box>
                  </Flex>
                ) : (
                  <>
                    <Flex gap={3} mb={4} wrap="wrap">
                      <Opcion activo={sexo === "mujer"} label={t("metodo.nutri.mujer")} onClick={() => setSexo("mujer")} />
                      <Opcion activo={sexo === "hombre"} label={t("metodo.nutri.hombre")} onClick={() => setSexo("hombre")} />
                    </Flex>
                    <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={{ base: 4, md: 5 }}>
                      <CampoNum label={t("metodo.nutri.edad")} sufijo={t("metodo.nutri.anos")} value={edad} onChange={setEdad} />
                      <CampoNum label={t("metodo.nutri.altura")} sufijo="cm" value={altura} onChange={setAltura} />
                      <CampoNum label={t("metodo.nutri.peso")} sufijo="kg" value={peso} onChange={setPeso} />
                    </SimpleGrid>
                    <Text color={`${nutricionTxt}99`} fontSize="2xs" fontStyle="italic" mt={3}>
                      {t("metodo.nutri.corregirNoCambia")}
                    </Text>
                  </>
                )}
              </Box>
            </SeccionBox>
          </Reveal>

          {/* ── CINTURA ── */}
          <Reveal inView direction="up" distance={20} delay={0.05} duration={0.6} w="100%">
            <SeccionBox>
              <Box px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>
                <Rotulo>{t("metodo.nutri.tuCintura")}</Rotulo>
                <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.8" mb={4}>
                  {CINTURA_AYUDA.porQue}
                </Text>

                <Flex gap={{ base: 4, md: 8 }} wrap="wrap" align="flex-end">
                  <Box opacity={sinCintura ? 0.4 : 1} pointerEvents={sinCintura ? "none" : "auto"}>
                    <CampoNum label={t("metodo.nutri.perimetro")} sufijo="cm" value={cintura} onChange={setCintura} />
                  </Box>
                  <Flex gap={2.5} wrap="wrap" pb={1}>
                    <Opcion activo={comoMedirse} label={t("metodo.nutri.comoMedirme")} onClick={() => setComoMedirse((v) => !v)} />
                    <Opcion activo={sinCintura} label={t("metodo.nutri.noPuedoMedirme")}
                            onClick={() => { setSinCintura((v) => !v); if (!sinCintura) setCintura(""); }} />
                  </Flex>
                </Flex>

                {comoMedirse && (
                  <Box mt={4} px={4} py={3.5} borderRadius="xl" bg="#ffffff66" border={`1px solid ${nutricionTxt}33`}>
                    <Text color={nutricionTxt} fontSize="xs" fontWeight={700} letterSpacing="0.1em"
                          textTransform="uppercase" mb={2}>
                      {CINTURA_AYUDA.titulo}
                    </Text>
                    <Flex direction="column" gap={1.5}>
                      {CINTURA_AYUDA.pasos.map((p, i) => (
                        <Text key={i} color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
                          {i + 1}. {p}
                        </Text>
                      ))}
                    </Flex>
                  </Box>
                )}

                {sinCintura && (
                  <Text color={`${nutricionTxt}aa`} fontSize="xs" fontStyle="italic" mt={3} lineHeight="1.6">
                    {t("metodo.nutri.sinCintura")}
                  </Text>
                )}
              </Box>
            </SeccionBox>
          </Reveal>

          {/* ── LAS PREGUNTAS ── */}
          <RevealStagger inView stagger={0.1} delayChildren={0.05} amount={0.15}
                         display="flex" flexDirection="column" w="100%" gap={{ base: 3.5, md: 4 }}>
            {preguntas.map((p) => (
              <RevealItem key={p.key} w="100%">
                <SeccionBox>
                  <Flex direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "center" }}
                        gap={{ base: 4, md: 6 }} px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>
                    <Box flex="1" minW={0}>
                      <Text color={`${nutricionTxt}99`} fontSize="2xs" fontWeight={700} letterSpacing="0.14em"
                            textTransform="uppercase" mb={1}>
                        {p.categoria}
                      </Text>
                      <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} fontWeight={600} lineHeight="1.5">
                        {p.pregunta}
                      </Text>
                      {p.apoyo && (
                        <Text color={`${nutricionTxt}bb`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                              mt={1.5} lineHeight="1.6">
                          {p.apoyo}
                        </Text>
                      )}
                    </Box>
                    <Flex gap={2.5} flexShrink={0} wrap="wrap"
                          justify={{ base: "flex-start", md: "flex-end" }}
                          maxW={{ base: "100%", md: "300px" }}>
                      {p.opciones.map((o) => (
                        <Opcion key={o.value} activo={respuestas[p.key] === o.value} label={o.label}
                                onClick={() => responder(p.key, o.value)} />
                      ))}
                    </Flex>
                  </Flex>
                </SeccionBox>
              </RevealItem>
            ))}
          </RevealStagger>

          {guardando && (
            <Text color="rgba(255,255,255,0.7)" fontSize="xs" fontStyle="italic">{t("comun.guardando")}</Text>
          )}

          {/* ── RESULTADO ── */}
          {completo && resultado && banda && (
            <Reveal inView direction="up" distance={22} delay={0.05} duration={0.65} w="100%">
              <Box ref={resultadoRef} w="100%" scrollMarginTop={{ base: 4, md: 6 }}>
                <SeccionBox>
                  <Box px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>

                    {/* Puntuación + banda */}
                    <Flex direction="column" align="center" textAlign="center" gap={1}>
                      <Text color={`${nutricionTxt}cc`} fontSize={{ base: "sm", md: "md" }}>
                        {t("metodo.nutri.tuPuntuacion")}
                      </Text>
                      <Text color={banda.color} fontSize={{ base: "5xl", md: "6xl" }} fontWeight={700} lineHeight="1.05">
                        {resultado.puntos}
                        <Text as="span" color={`${nutricionTxt}88`} fontSize={{ base: "xl", md: "2xl" }} fontWeight={600}>
                          {" "}/ 26
                        </Text>
                      </Text>
                      <Box mt={2} px={5} py={1.5} borderRadius="full"
                           bg={`${banda.color}1f`} border={`1.5px solid ${banda.color}`}>
                        <Text color={banda.color} fontSize={{ base: "md", md: "lg" }} fontWeight={700}>
                          {banda.titulo}
                        </Text>
                      </Box>
                      <Text color={`${nutricionTxt}aa`} fontSize={{ base: "xs", md: "sm" }} mt={2.5} maxW="520px" lineHeight="1.6">
                        {banda.riesgo}
                      </Text>
                    </Flex>

                    <Box h="1px" bg={`${nutricionTxt}22`} my={{ base: 5, md: 6 }} />

                    <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.85">
                      {banda.texto}
                    </Text>

                    {/* Siguiente paso */}
                    <Box mt={4} px={4} py={3.5} borderRadius="xl"
                         bg={`${banda.color}14`} border={`1px solid ${banda.color}66`}>
                      <Text color={nutricionTxt} fontSize="2xs" fontWeight={700} letterSpacing="0.14em"
                            textTransform="uppercase" mb={1.5}>
                        {t("metodo.nutri.queHariaYo")}
                      </Text>
                      <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.75">
                        {banda.paso}
                      </Text>
                    </Box>

                    {resultado.sinCintura && (
                      <Text color={`${nutricionTxt}99`} fontSize="xs" fontStyle="italic" mt={3} lineHeight="1.6">
                        {t("metodo.nutri.recuerdaSinCintura")}
                      </Text>
                    )}

                    {/* ── De dónde sale · lo que no se elige ── */}
                    {heredados.length > 0 && (
                      <>
                        <Box h="1px" bg={`${nutricionTxt}22`} my={{ base: 5, md: 6 }} />
                        <Rotulo>{t("metodo.nutri.loQueNoElegiste")}</Rotulo>
                        <Flex gap={2} wrap="wrap" mb={2}>
                          {heredados.map((d) => (
                            <Flex key={d.etiqueta} align="center" gap={2} px={3.5} py={1.5} borderRadius="full"
                                  bg="#ffffff66" border={`1px solid ${nutricionTxt}33`}>
                              <Text color={nutricionTxt} fontSize="sm" fontWeight={600}>{d.etiqueta}</Text>
                              <Text color={`${nutricionTxt}88`} fontSize="sm" fontWeight={700}>+{d.puntos}</Text>
                            </Flex>
                          ))}
                        </Flex>
                        <Text color={`${nutricionTxt}aa`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" lineHeight="1.7">
                          {t("metodo.nutri.loQueNoElegisteTexto")}
                        </Text>
                      </>
                    )}

                    {/* ── Lo que está en tu mano ── */}
                    <Box h="1px" bg={`${nutricionTxt}22`} my={{ base: 5, md: 6 }} />
                    <Rotulo>{t("metodo.nutri.enTuMano")}</Rotulo>
                    {enTuMano.length === 0 ? (
                      <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.8">
                        {t("metodo.nutri.enTuManoNada")}
                      </Text>
                    ) : (
                      <Flex direction="column" gap={3}>
                        {enTuMano.map((d) => (
                          <Box key={d.etiqueta} px={4} py={3.5} borderRadius="xl"
                               bg="#ffffff66" border={`1px solid ${nutricionTxt}33`}>
                            <Flex align="center" gap={2} mb={1}>
                              <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} fontWeight={700}>
                                {d.etiqueta}
                              </Text>
                              <Text color={`${nutricionTxt}88`} fontSize="sm" fontWeight={700}>+{d.puntos}</Text>
                            </Flex>
                            {d.consejo && (
                              <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.75" opacity={0.9}>
                                {d.consejo}
                              </Text>
                            )}
                          </Box>
                        ))}
                      </Flex>
                    )}
                  </Box>
                </SeccionBox>
              </Box>
            </Reveal>
          )}

          {/* ── SEÑALES DE ALERTA · siempre visibles, con test o sin él ── */}
          <Reveal inView direction="up" distance={20} delay={0.05} duration={0.6} w="100%">
            <SeccionBox>
              <Box px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>
                <Text color={nutricionTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight={700} lineHeight="1.25" mb={3}>
                  {SENALES_INTRO.titulo}
                </Text>

                {/* El aviso que da sentido a todo lo demás: esto no se nota. */}
                <Box px={4} py={3.5} borderRadius="xl" mb={4}
                     bg={`${nutricionTxt}12`} border={`1px solid ${nutricionTxt}44`}>
                  <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.8" fontWeight={600}>
                    {SENALES_INTRO.aviso}
                  </Text>
                </Box>

                <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.85" mb={5}>
                  {SENALES_INTRO.texto}
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }}>
                  {senales.map((s) => (
                    <Box key={s.key} px={4} py={3.5} borderRadius="xl"
                         bg="#ffffff66" border={`1px solid ${nutricionTxt}33`}>
                      <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} fontWeight={700} lineHeight="1.4" mb={1}>
                        {s.titulo}
                      </Text>
                      <Text color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" opacity={0.88}>
                        {s.texto}
                      </Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </SeccionBox>
          </Reveal>

          {/* ── ESPERANZA · el cierre imprescindible ── */}
          <Reveal inView direction="up" distance={20} delay={0.05} duration={0.6} w="100%">
            <SeccionBox>
              <Box px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>
                <Text color={nutricionTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight={700} lineHeight="1.25" mb={3}>
                  {PREDIABETES_ESPERANZA.titulo}
                </Text>
                <Flex direction="column" gap={3}>
                  {PREDIABETES_ESPERANZA.texto.map((p, i) => (
                    <Text key={i} color={nutricionTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.85">
                      {p}
                    </Text>
                  ))}
                </Flex>
              </Box>
            </SeccionBox>
          </Reveal>

          {/* Aviso honesto. */}
          <Reveal inView direction="up" distance={14} delay={0.05} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center"
                  maxW="660px" lineHeight="1.6">
              {PREDIABETES_ESPERANZA.aviso}
            </Text>
          </Reveal>

        </Flex>
      </Flex>

      <IndiceNutricion />
      {/* El «¿Qué es esto?» de esta página: la pastilla flotante encima de la de
          la llamada, con el mismo texto que antes abría el botón de arriba. El
          popup lo pinta BotonCompania sobre el fondo de Nutrición (la acuarela
          de `nutri.webp`), que es el que llevan todos los popups de la
          disciplina. */}
      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom}
                     queEsEsto={{ titulo: t("metodo.nutri.prediabetes"), parrafos: PREDIABETES_INTRO.que }} />
      <SiteFooter />
    </Box>
  );
}
