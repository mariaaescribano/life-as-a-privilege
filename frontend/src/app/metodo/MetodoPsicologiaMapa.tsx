// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · INTEGRACIÓN  (ruta interna /mapa)  ·  19/22
//
// Recupera TODAS las relaciones que el usuario compuso en la página «Relación»
// (data.constelaciones) y las presenta como tarjetas. Al tocar una, se abre un
// popup guiado tipo ritual —una pregunta por página, se avanza con flechas—
// para «enfrentarse» a esa relación e integrarla: reconocer qué protegía, qué
// cuesta, qué verdad más sana practicar y qué recordar. Una relación cada vez.
//
// Datos: lee/escribe data.constelaciones[·].{proteger, coste, verdadSana,
//        recordatorio}. Su resultado (verdadSana / coste) alimenta Compromiso.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { RelacionIcon } from "../../components/metodo/RelacionIcon";
import { arquetipoLabel } from "../../components/metodo/integracionSimbolos";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { EjemplosPulsables } from "../../components/metodo/EjemplosPulsables";
import { COMIC_COMPROMISO } from "../../components/metodo/comicCompromiso";
import { useComic } from "../../i18n/comics";
import { traducir, useIdioma, useT } from "../../i18n";
import {
  experienciaById,
  arquetipoKey,
  type LineaDeVidaData,
  type Constelacion,
} from "../../components/metodo/psicologiaRecorrido";
import { glowHeader, glowPanel, azulBorde } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt; // #5e2d10 — marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

// Corazón — se usa en el popup de felicitación.
const Corazon = ({ size = 22, color = TINTA }: { size?: number; color?: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={`${size}px`} h={`${size}px`} fill={color} flexShrink={0}>
    <path d="M480-120 424-171q-101-91-167-157T152-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T884-447.5Q843-395 777-329T536-171l-56 51Z" />
  </Box>
);

// Los cuatro bloques del ejercicio de integración (se conservan tal cual: su
// resultado alimenta la página de Compromiso). La `key` es el campo de la
// constelación donde se guarda la respuesta.
const BLOQUES: {
  key: "proteger" | "coste" | "verdadSana" | "recordatorio";
  pregunta: string;
  apoyo: string;
  /** Ejemplos pulsables. OJO: el popup tiene alto fijo y solo se pintan los
   *  `topeEjemplos` PRIMEROS (los que caben bajo el recuadro), así que el orden
   *  importa: delante los más útiles. */
  ejemplos: string[];
  topeEjemplos?: number;
  placeholder: string;
}[] = [
  {
    key: "proteger",
    pregunta: "¿Qué intentaba proteger este patrón?",
    apoyo: "Reconoce la intención positiva que había detrás del mecanismo.",
    ejemplos: [
      "Evitar el rechazo", "Protegerme del abandono", "Evitar el conflicto", "Sentirme suficiente",
      "Evitar críticas", "No decepcionar a nadie", "Sentirme seguro/a", "Sentir que tengo el control",
      "Evitar el dolor", "Ser aceptado/a", "No mostrarme vulnerable", "Mantener la paz",
      "Que no me hicieran daño", "Sentirme querido/a", "Evitar la humillación", "No volver a sufrir lo mismo",
    ],
    topeEjemplos: 4,
    placeholder: "Lo que en el fondo intentaba cuidar de mí…",
  },
  {
    key: "coste",
    pregunta: "¿Qué coste tiene mantener este patrón?",
    apoyo: "Toma conciencia de las consecuencias que tiene hoy en tu Vida.",
    ejemplos: [
      "Ansiedad", "Agotamiento", "Soledad", "Reprimir lo que siento",
      "Relaciones superficiales", "Falta de autenticidad", "Miedo constante", "Perder oportunidades",
      "No disfrutar el presente", "Tensión física", "Insatisfacción", "Alejar a quien quiero",
      "Vivir siempre en guardia", "Perderme a mí mismo/a",
    ],
    topeEjemplos: 4,
    placeholder: "Lo que me cuesta seguir sosteniéndolo…",
  },
  {
    key: "verdadSana",
    pregunta: "¿Qué verdad más sana quieres practicar?",
    apoyo: "El núcleo: transforma la narrativa antigua en una nueva.",
    ejemplos: [
      "«No soy suficiente» → «Soy suficiente tal como soy»",
      "«Necesito agradar para ser querido» → «Puedo ser querido siendo yo mismo»",
      "«Si pongo límites me abandonarán» → «Poner límites me acerca a quien me respeta»",
      "«Mi valor depende de hacerlo perfecto» → «Mi valor no depende de hacerlo perfecto»",
      "«Tengo que poder con todo sola» → «Pedir ayuda también es de valientes»",
      "«Equivocarme me hace menos» → «Equivocarme es parte de aprender»",
      "«Debo controlarlo todo» → «Puedo confiar y soltar»",
    ],
    // Frases largas: solo dos caben en el hueco sin que el popup crezca.
    topeEjemplos: 2,
    placeholder: "La nueva verdad que quiero empezar a creer…",
  },
  {
    key: "recordatorio",
    pregunta: "¿Qué te gustaría recordar cuando vuelvas a caer en este patrón?",
    apoyo: "Una frase breve de apoyo personal.",
    ejemplos: [
      "Soy suficiente", "Puedo pedir ayuda", "Está bien decir que no", "Mis emociones son válidas",
      "Está bien equivocarme", "Mi voz también importa", "Puedo poner límites con amor",
      "No tengo que poder con todo", "Merezco descansar",
      "No necesito agradar a todos", "Puedo confiar en mí", "Me trato con amabilidad",
    ],
    topeEjemplos: 4,
    placeholder: "Una frase que quiero recordar…",
  },
];

// Los mismos cuatro bloques EN INGLÉS. Aquí va solo el texto: la `key`, el
// orden y el `topeEjemplos` los sigue poniendo BLOQUES, que es donde vive la
// estructura (si se duplicara, un tope cambiado en un idioma y no en el otro
// haría que el popup creciera solo en uno). Va en este fichero, al lado del
// español, porque los ejemplos son listas y no caben en el diccionario de
// textos, que solo guarda cadenas.
const BLOQUES_EN: Record<(typeof BLOQUES)[number]["key"], {
  pregunta: string; apoyo: string; ejemplos: string[]; placeholder: string;
}> = {
  proteger: {
    pregunta: "What was this pattern trying to protect?",
    apoyo: "Recognize the positive intention behind the mechanism.",
    ejemplos: [
      "Avoiding rejection", "Protecting myself from abandonment", "Avoiding conflict", "Feeling like enough",
      "Avoiding criticism", "Not letting anyone down", "Feeling safe", "Feeling like I'm in control",
      "Avoiding pain", "Being accepted", "Not showing myself vulnerable", "Keeping the peace",
      "Not being hurt", "Feeling loved", "Avoiding humiliation", "Never going through that again",
    ],
    placeholder: "What it was really trying to take care of in me…",
  },
  coste: {
    pregunta: "What does keeping this pattern cost you?",
    apoyo: "Take in the consequences it has in your Life today.",
    ejemplos: [
      "Anxiety", "Exhaustion", "Loneliness", "Holding back what I feel",
      "Surface-level relationships", "Not being myself", "Constant fear", "Missing out on chances",
      "Not enjoying the present", "Tension in my body", "Dissatisfaction", "Pushing away the people I love",
      "Always living on guard", "Losing myself",
    ],
    placeholder: "What it costs me to keep holding it up…",
  },
  verdadSana: {
    pregunta: "What healthier truth do you want to practice?",
    apoyo: "The heart of it: turn the old story into a new one.",
    ejemplos: [
      "“I'm not enough” → “I am enough exactly as I am”",
      "“I need to please to be loved” → “I can be loved being myself”",
      "“If I set limits they'll leave me” → “Setting limits brings me closer to whoever respects me”",
      "“My worth depends on doing it perfectly” → “My worth doesn't depend on doing it perfectly”",
      "“I have to handle everything on my own” → “Asking for help is brave too”",
      "“Getting it wrong makes me less” → “Getting it wrong is part of learning”",
      "“I have to control everything” → “I can trust and let go”",
    ],
    placeholder: "The new truth I want to start believing…",
  },
  recordatorio: {
    pregunta: "What would you like to remember when you fall back into this pattern?",
    apoyo: "A short line of support, just for you.",
    ejemplos: [
      "I am enough", "I can ask for help", "It's okay to say no", "My emotions are valid",
      "It's okay to get it wrong", "My voice matters too", "I can set limits with love",
      "I don't have to handle everything", "I deserve to rest",
      "I don't need everyone to like me", "I can trust myself", "I treat myself kindly",
    ],
    placeholder: "A line I want to remember…",
  },
};

/** Los cuatro bloques, con el texto en el idioma activo. */
const useBloques = (): typeof BLOQUES => {
  const { idioma } = useIdioma();
  return idioma === "en" ? BLOQUES.map((b) => ({ ...b, ...BLOQUES_EN[b.key] })) : BLOQUES;
};

const relTitulo = (c: Constelacion): string =>
  (c.titulo || "").trim() || traducir("metodo.psico.relacionSinTitulo");
const relRespondidas = (c: Constelacion): number =>
  BLOQUES.filter((b) => ((c[b.key] as string) || "").trim().length > 0).length;

export default function MetodoPsicologiaMapa() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [relaciones, setRelaciones] = useState<Constelacion[]>([]);
  const [abiertoId, setAbiertoId] = useState<string | null>(null);
  const [felicitarOpen, setFelicitarOpen] = useState(false);
  // Cómic «Cómo te construiste»: se intercala tras la felicitación, antes de
  // entrar a Compromiso. Se puede saltar.
  const [comicOpen, setComicOpen] = useState(false);
  // Las viñetas en el idioma activo (el español manda: fotos y orden salen de él).
  const comicVinetas = useComic("psicologia-compromiso", COMIC_COMPROMISO);
  const dataRef = useRef<LineaDeVidaData>({});

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<Constelacion[] | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: LineaDeVidaData = psi.data?.data || {};
        dataRef.current = d;
        // Blindamos cada constelación con las formas que el render da por hechas
        // (nudos/arquetipos array, textos string): datos antiguos sin esos campos
        // reventaban el render (pantalla en blanco).
        const rels = Array.isArray(d.constelaciones)
          ? d.constelaciones.map((c) => ({
              ...c,
              titulo: c.titulo ?? "",
              texto: c.texto ?? "",
              nudos: Array.isArray(c.nudos) ? c.nudos : [],
              arquetipos: Array.isArray(c.arquetipos) ? c.arquetipos : [],
            }))
          : [];
        setRelaciones(rels);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  // Guardado SILENCIOSO: persistimos en segundo plano sin mostrar ningún
  // indicador («Guardando…» todo el rato resultaba agobiante). Los datos se
  // guardan igual; el usuario solo lo percibe al pulsar «Hecho» (que cierra el
  // popup y fuerza el guardado con flushGuardado).
  const persistir = async (next: Constelacion[]): Promise<boolean> => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return false;
    try {
      const nuevo = { ...dataRef.current, constelaciones: next };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data: nuevo },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = nuevo;
      return true;
    } catch {
      return false;
    }
  };

  // Guarda en estado y agenda persistencia (debounce) para no llamar en cada tecla.
  const commit = (next: Constelacion[]) => {
    setRelaciones(next);
    pendiente.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (pendiente.current) { void persistir(pendiente.current); pendiente.current = null; }
    }, 900);
  };

  // Fuerza el guardado pendiente de inmediato (al cerrar el popup / «Hecho»).
  const flushGuardado = () => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    if (pendiente.current) { void persistir(pendiente.current); pendiente.current = null; }
  };

  // Flush al desmontar.
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (pendiente.current) void persistir(pendiente.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateCampo = (id: string, campo: keyof Constelacion, valor: string) =>
    commit(relaciones.map((c) => (c.id === id ? { ...c, [campo]: valor } : c)));

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  // Antes de navegar: fuerza el guardado pendiente y espera al flush, para que
  // la página destino no lea datos viejos.
  const ir = async (ruta: string) => { flushGuardado(); await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/${ruta}`); };
  const total = BLOQUES.length;
  const abierta = relaciones.find((c) => c.id === abiertoId) || null;
  // No se puede avanzar a Compromiso hasta haber rellenado al menos una
  // relación (al menos una de sus preguntas respondida).
  const algunoRelleno = relaciones.some((c) => relRespondidas(c) > 0);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="760px" gap={{ base: 7, md: 9 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
                title={t("metodo.psico.paso.integracion")}
                bgColor={`${neuropsicologiaBg}f0`}
                color={neuropsicologiaTxt}
                nom={neuropsicologiaNom}
                step={{ current: 21, total: 26 }}
                mb={0}
                boxShadow={glowHeader}
                prev={{ label: `← ${t("metodo.psico.paso.atrevete")}`, onClick: () => ir("miedos-preguntas") }}
                next={{
                  label: `${t("metodo.psico.paso.compromiso")} →`,
                  onClick: () => setFelicitarOpen(true),
                  disabled: !algunoRelleno,
                  disabledTooltip: t("metodo.psico.faltaMapa"),
                }}
              />
            </Reveal>

            {/* Frase bajo el header */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
              <IntroRecorrido>{t("metodo.psico.integracionIntro")}</IntroRecorrido>
            </Reveal>

            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.22} duration={0.75} w="100%">
            {relaciones.length === 0 ? (
              // Estado vacío: aún no ha compuesto ninguna relación.
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" border={azulBorde} boxShadow={glowPanel}>
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Flex position="relative" zIndex={1} direction="column" align="center" gap={4}
                      px={{ base: 7, md: 11 }} py={{ base: 12, md: 16 }} textAlign="center">
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.sinRelaciones")}</Text>
                  <Box as="button" onClick={() => ir("integracion")} px={6} py={2.5} borderRadius="full" bg={TINTA} color={PAPEL}
                       fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                       boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                       _hover={{ transform: "translateY(-2px)" }}>{t("metodo.psico.irARelacion")}</Box>
                </Flex>
              </Box>
            ) : (
              <>
                {/* Tarjetas de relación · aparecen de una en una. Al tocar, se abre el popup guiado. */}
                <RevealStagger display="flex" flexDirection="column" w="100%" gap={{ base: 3.5, md: 4 }} stagger={0.1} delayChildren={0.1}>
                  {relaciones.map((c) => {
                    const hechas = relRespondidas(c);
                    const completo = hechas >= total;
                    return (
                      <RevealItem key={c.id} direction="up" distance={26} scaleFrom={0.97} duration={0.5} w="100%">
                      <Box as="button" onClick={() => setAbiertoId(c.id)}
                           position="relative" w="100%" borderRadius="2xl" overflow="hidden" textAlign="left"
                           bgColor={neuropsicologiaBg} border={azulBorde} boxShadow={glowPanel}
                           cursor="pointer" transition="transform 0.16s, filter 0.16s"
                           _hover={{ transform: "translateY(-2px)", filter: "brightness(1.04)" }}>
                        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                        <Flex position="relative" zIndex={1} direction="column" gap={2.5}
                              px={{ base: 5, md: 7 }} py={{ base: 4, md: 5 }}>
                          <Flex align="center" gap={3}>
                            <Box flexShrink={0} display="flex" alignItems="center"
                                 style={{ filter: `drop-shadow(0 1px 2px ${PAPEL})` }}>
                              <RelacionIcon size={22} color={TINTA} opacity={0.9} />
                            </Box>
                            <Text flex="1" minW={0} color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700"
                                  lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                              {relTitulo(c)}
                            </Text>
                            <Flex align="center" gap={2} flexShrink={0}>
                              <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} fontWeight="700"
                                    opacity={completo ? 1 : 0.65} style={{ textShadow: INK_SHADOW }}>
                                {completo ? "✓" : `${hechas}/${total}`}
                              </Text>
                              <Box color={TINTA} opacity={0.8} transform="translateY(1px)">
                                <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="22px" h="22px" fill="currentColor">
                                  <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                                </Box>
                              </Box>
                            </Flex>
                          </Flex>
                          {(c.nudos.length > 0 || c.arquetipos.length > 0) && (
                            <Flex wrap="wrap" gap={1.5}>
                              {c.nudos.map((n) => <MiniChip key={`n-${n}`} label={n} />)}
                              {c.arquetipos.map((a) => <MiniChip key={`a-${arquetipoKey(a)}`} label={arquetipoLabel(a)} />)}
                            </Flex>
                          )}
                        </Flex>
                      </Box>
                      </RevealItem>
                    );
                  })}
                </RevealStagger>
              </>
            )}
            </Reveal>

          </Flex>
        </Flex>
      </Box>

      {/* ── POPUP GUIADO (integración de la relación · alimenta Compromiso) ── */}
      {abierta && (
        <PopupIntegracion
          key={abierta.id}
          c={abierta}
          onUpdate={(campo, v) => updateCampo(abierta.id, campo, v)}
          onClose={() => { flushGuardado(); setAbiertoId(null); }}
        />
      )}

      {/* ── POPUP DE FELICITACIÓN (al pulsar «Compromiso →») ── */}
      {felicitarOpen && (
        <PopupFelicitacion
          onClose={() => setFelicitarOpen(false)}
          onContinuar={() => { setFelicitarOpen(false); setComicOpen(true); }}
        />
      )}

      {/* ── Cómic «Cómo te construiste» — tras la felicitación, antes de
          Compromiso. Se puede saltar (Saltar →). ── */}
      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={() => ir("compromiso")}
        vinetas={comicVinetas}
        continueLabel={t("comun.continuar")}
        botonNitido
        themeColor={neuropsicologiaTxt}
        disciplinaBgImage="/img/fondos/psciologia.webp"
        disciplinaBgColor={neuropsicologiaBg}
        textShadow={INK_SHADOW}
      />

      <AyudaRecorrido pagina="mapa" />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Popup de felicitación: se abre al pulsar «Compromiso →». Reconoce el logro
// de haber recorrido todo el camino antes de dar el último paso.
// ─────────────────────────────────────────────────────────────────────────
function PopupFelicitacion({ onClose, onContinuar }: { onClose: () => void; onContinuar: () => void }) {
  const t = useT();
  useLockBodyScroll(true);
  return (
    <Box position="fixed" inset={0} zIndex={2100} display="flex" alignItems="center" justifyContent="center"
         px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.78)"
         sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
         onClick={onClose} fontFamily="'EB Garamond', serif">
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="460px"
           borderRadius="2xl" overflow="hidden" boxShadow={`0 0 44px ${TINTA}55, 0 30px 80px rgba(0,0,0,0.55)`}>
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
        <Box position="relative" zIndex={1} px={{ base: 8, md: 12 }} py={{ base: 11, md: 14 }} textAlign="center">
          <Box as="button" onClick={onClose} position="absolute" top={3} right={3}
               w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
               color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
               _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>✕</Box>

          <Flex align="center" justify="center" gap={{ base: 2.5, md: 3 }} mb={3}>
            <Corazon size={30} color={TINTA} />
            <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.3"
                  style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.enhorabuenaLlegar")}</Text>
          </Flex>
          <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" lineHeight="1.7" mb={8}
                style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.eresValiente")}</Text>

          <Box as="button" onClick={onContinuar} position="relative" overflow="hidden"
               px={9} py={3} borderRadius="full" bg={TINTA} color={PAPEL} border={`1px solid ${TINTA}`}
               fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em"
               cursor="pointer" boxShadow={`0 6px 20px rgba(94,45,16,0.32)`} transition="all 0.2s"
               _hover={{ transform: "translateY(-2px)", boxShadow: `0 10px 28px rgba(94,45,16,0.42)` }}>{t("metodo.psico.continuar")}</Box>
        </Box>
      </Box>
    </Box>
  );
}

// Chip pequeño (piezas de la relación: nudos/heridas + arquetipos).
function MiniChip({ label }: { label: string }) {
  return (
    <Box px={2.5} py={1} borderRadius="full" bg={`${TINTA}12`} border={`1px solid ${TINTA}33`}>
      <Text color={TINTA} fontSize="xs" fontWeight="600" lineHeight="1.2">{label}</Text>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Popup guiado por relación: una pregunta por página, se avanza con flechas.
// «Enfrentarse» a la relación e integrarla. Su resultado (verdadSana / coste)
// es lo que lee la página de Compromiso.
// ─────────────────────────────────────────────────────────────────────────
function PopupIntegracion({ c, onUpdate, onClose }: {
  c: Constelacion;
  onUpdate: (campo: keyof Constelacion, valor: string) => void;
  onClose: () => void;
}) {
  const t = useT();
  const bloques = useBloques();
  const total = bloques.length;
  const [paso, setPaso] = useState(0);
  const esPrimero = paso === 0;
  const esUltimo = paso === total - 1;

  useLockBodyScroll(true);

  const cuerpoRef = useRef<HTMLDivElement | null>(null);
  const actualRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    // Al cambiar de pregunta, subimos la vista arriba del todo (se ve desde la
    // pregunta, no desde el recuadro) y damos el foco SIN volver a bajar la
    // vista al textarea (preventScroll).
    cuerpoRef.current?.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => actualRef.current?.focus({ preventScroll: true }), 220);
    return () => clearTimeout(t);
  }, [paso]);

  const anterior = () => setPaso((i) => Math.max(0, i - 1));
  const siguiente = () => { if (esUltimo) onClose(); else setPaso((i) => Math.min(total - 1, i + 1)); };

  const b = bloques[paso];
  const respuesta = (c[b.key] as string) || "";

  // Pulsar un ejemplo lo AÑADE al texto (nunca borra lo ya escrito). Si ya hay
  // contenido, lo añade en una línea nueva; si no, lo escribe directamente.
  const añadirEjemplo = (ej: string) => {
    const prev = respuesta;
    const next = prev.trim() ? `${prev.replace(/\s+$/, "")}\n${ej}` : ej;
    onUpdate(b.key, next);
    setTimeout(() => actualRef.current?.focus(), 0);
  };

  return (
    <Box position="fixed" inset={0} zIndex={2000} display="flex" alignItems="center" justifyContent="center"
         px={{ base: 3, md: 10 }} py={{ base: 4, md: 10 }} bg="rgba(0,0,0,0.82)"
         sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
         onClick={onClose} fontFamily="'EB Garamond', serif">
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()}
           position="relative" w="100%" maxW={{ base: "440px", md: "500px" }}
           // MISMA medida que el popup de «Enfréntate»: alto FIJO, no cambia con
           // la pregunta (el cuerpo hace scroll interno si hiciera falta).
           h={{ base: "calc(100vh - 48px)", md: "600px" }}
           maxH={{ base: "calc(100vh - 48px)", md: "calc(100vh - 120px)" }}
           borderRadius="2xl" overflow="hidden" display="flex" flexDirection="column"
           boxShadow={`0 0 40px ${TINTA}66, 0 24px 70px rgba(0,0,0,0.5)`}>
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />

        {/* Cerrar */}
        <Box as="button" onClick={onClose} position="absolute" top={3} right={3} zIndex={3}
             w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
             color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
             _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>
          ✕
        </Box>

        {/* Cabecera: la relación, separada por una raya sólida a lo ancho */}
        <Box position="relative" zIndex={1} flexShrink={0} borderBottom={`1px solid ${TINTA}55`}
             px={{ base: 6, md: 9 }} pt={{ base: 6, md: 7 }} pb={{ base: 3.5, md: 4 }}>
          <Flex direction="column" align="center" textAlign="center" gap={0.5}>
            <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.22em" textTransform="uppercase"
                  opacity={0.6} style={{ textShadow: INK_SHADOW }}>{t("metodo.psico.tuRelacion")}</Text>
            <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.25"
                  style={{ textShadow: INK_SHADOW }}>
              {relTitulo(c)}
            </Text>
          </Flex>
        </Box>

        {/* Cuerpo scrollable: una pregunta por página */}
        <Box ref={cuerpoRef} position="relative" zIndex={1} flex="1" overflowY="auto" overscrollBehavior="contain"
             px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}
             sx={{ scrollbarWidth: "thin", "&::-webkit-scrollbar": { width: "8px" },
                   "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "8px" } }}>
          <Box>
            {/* La pregunta */}
            <Box>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.35"
                    style={{ textShadow: INK_SHADOW }}>
                {b.pregunta}
              </Text>
              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} opacity={0.82} mt={1} lineHeight="1.55"
                    style={{ textShadow: INK_SHADOW }}>
                {b.apoyo}
              </Text>
            </Box>

            {/* La respuesta */}
            <Textarea
              ref={actualRef}
              value={respuesta}
              onChange={(e) => onUpdate(b.key, e.target.value)}
              placeholder={b.placeholder}
              mt={4}
              minH={{ base: "120px", md: "150px" }}
              bg="rgba(255,251,243,0.78)" border={`1px solid ${TINTA}3a`} color={TINTA}
              borderRadius="lg" px={4} py={3} fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
              sx={{ caretColor: TINTA, scrollbarWidth: "thin", scrollbarColor: `${TINTA}99 transparent`,
                    "&::-webkit-scrollbar": { width: "8px" },
                    "&::-webkit-scrollbar-thumb": { background: `${TINTA}99`, borderRadius: "8px" } }}
              _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
              _hover={{ borderColor: `${TINTA}55` }}
              _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.92)" }}
            />

            {/* Ejemplos: van DEBAJO del recuadro, en el hueco que sobra, igual que
                en «Enfréntate». El popup no crece: por eso solo se pintan los que
                caben (`tope` por bloque, ver BLOQUES). */}
            <EjemplosPulsables
              ejemplos={b.ejemplos}
              respuesta={respuesta}
              onElegir={añadirEjemplo}
              tope={b.topeEjemplos ?? 4}
            />
          </Box>
        </Box>

        {/* Footer: navegación abajo del todo + autoguardado */}
        <Box position="relative" zIndex={1} flexShrink={0} borderTop={`1px solid ${TINTA}44`}
             px={{ base: 6, md: 9 }} pt={{ base: 3.5, md: 4 }} pb={{ base: 3.5, md: 4 }}>
          <Flex justify="space-between" align="center" gap={3}>
            <Box as="button" onClick={anterior} disabled={esPrimero}
                 px={{ base: 4, md: 5 }} py={2} borderRadius="full" bg="transparent"
                 border={`1.5px solid ${TINTA}${esPrimero ? "22" : "88"}`}
                 color={esPrimero ? `${TINTA}44` : TINTA}
                 fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                 cursor={esPrimero ? "not-allowed" : "pointer"} transition="all 0.18s"
                 _hover={esPrimero ? {} : { bg: `${TINTA}14` }}>{t("metodo.psico.anterior")}</Box>

            <Flex align="center" gap={2.5} flexShrink={0}>
              <Text color={TINTA} fontSize="xs" fontWeight="600" opacity={0.6}>{paso + 1} / {total}</Text>
            </Flex>

            <Box as="button" onClick={siguiente}
                 px={{ base: 5, md: 6 }} py={2} borderRadius="full" bg={TINTA} color={PAPEL}
                 fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                 letterSpacing="0.04em" cursor="pointer"
                 boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                 _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
              {esUltimo ? t("metodo.psico.hecho") : t("metodo.psico.siguiente")}
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
