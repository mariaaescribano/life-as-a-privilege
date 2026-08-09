// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · SÍNTESIS  (paso 22/23 · le siguen los Cursos para profundizar)
//
// El cierre de todo el camino: aquí la persona ve TODO lo que ha recorrido, de
// principio a fin y en solo lectura — su problema, lo que cargó (ACE), sus
// huellas, sus nudos, lo que le faltó, sus heridas, cómo se relaciona, sus
// miedos, sus dones, su compromiso y la carta que se escribió a su yo del
// futuro. No se edita nada: es el espejo completo del recorrido, para leerlo
// entero de una sola vez. Reúne, en el mismo orden, lo que también arma el PDF.
//
// El salto a Ayurveda (con su pago) ya no vive aquí: se ha movido al paso 23,
// «Cursos para profundizar», que es ahora el final del recorrido.
//
// Datos: solo LEE `metodo_psicologia.data` (no escribe nada).
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { TextoLetraALetra } from "../../components/global/TextoLetraALetra";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceRecorrido } from "../../components/metodo/IndiceRecorrido";
import { generatePsicologiaPdf } from "../../utils/generatePsicologiaPdf";
import { generateLineaDeVidaPdf } from "../../utils/generateLineaDeVidaPdf";
import { arquetipoLabel } from "../../components/metodo/integracionSimbolos";
import {
  experienciaById,
  necesidadesNoCubiertas,
  aceScore,
  aceBanda,
  aceCompleto,
  MIEDOS_PREGUNTAS,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt; // marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const ORO = "#c79a3c";            // dorado (los dones)
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

// Las 4 preguntas de integración por relación (las mismas que en /mapa). Se
// vuelcan aquí en Síntesis con lo que el usuario escribió.
const INTEGRACION_PREGUNTAS: { key: "proteger" | "coste" | "verdadSana" | "recordatorio"; label: string }[] = [
  { key: "proteger", label: "Qué intentaba proteger" },
  { key: "coste", label: "Qué me cuesta mantenerlo" },
  { key: "verdadSana", label: "La verdad más sana que quiero practicar" },
  { key: "recordatorio", label: "Lo que quiero recordar" },
];

/** Todas las huellas marcadas a lo largo de la línea de Vida (sin duplicar). */
function todasLasHuellas(d: LineaDeVidaData): string[] {
  const set = new Set<string>();
  for (const ano of Object.values(d.anos || {})) {
    // Blindaje: `huellas` heredado podría no ser array (string suelto) → un
    // for..of iteraría sus caracteres. Solo iteramos si es array de verdad.
    const huellas = Array.isArray(ano?.huellas) ? ano!.huellas : [];
    for (const t of huellas) {
      const s = (typeof t === "string" ? t : "").trim();
      if (s) set.add(s);
    }
  }
  return Array.from(set);
}

export default function MetodoPsicologiaSintesis() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LineaDeVidaData>({});
  const [descargando, setDescargando] = useState(false);
  const [descargandoLinea, setDescargandoLinea] = useState(false);
  // «Volver arriba»: aparece al bajar un poco; sube hasta la cabecera.
  const [mostrarArriba, setMostrarArriba] = useState(false);

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
        setData(psi.data?.data || {});
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  // Muestra el botón «Volver arriba» solo cuando se ha bajado un poco.
  useEffect(() => {
    const onScroll = () => setMostrarArriba(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const volverArriba = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const descargarPdf = async () => {
    setDescargando(true);
    try {
      await generatePsicologiaPdf(data);
    } catch {
      // silencioso
    } finally {
      setDescargando(false);
    }
  };

  const descargarLineaPdf = async () => {
    setDescargandoLinea(true);
    try {
      await generateLineaDeVidaPdf(data);
    } catch {
      // silencioso
    } finally {
      setDescargandoLinea(false);
    }
  };

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  // ── Recogida de TODO lo escrito (mismo orden y criterios que el PDF) ──
  const problemas = (typeof data["problema-actual"] === "string" ? (data["problema-actual"] as string) : "")
    .split(/\n+/).map((s) => s.trim()).filter(Boolean);

  const aceListo = aceCompleto(data);
  const score = aceListo ? aceScore(data) : 0;
  const banda = aceListo ? aceBanda(score) : null;

  // Blindaje: cualquier sección heredada podría no ser array (`X || []` no
  // protege contra un string/objeto truthy → `.map`/`.filter` reventaría el
  // render y, sin ErrorBoundary, dejaría pantalla en blanco). Guardamos con
  // Array.isArray conservando el tipo original de cada colección.
  const txt = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

  const huellas = todasLasHuellas(data);
  const nudos = (Array.isArray(data.nudos) ? data.nudos : []).map((n) => txt(n)).filter(Boolean);
  const necesidades = necesidadesNoCubiertas(data);

  const heridas = (Array.isArray(data.heridas) ? data.heridas : [])
    .filter((h) => txt(h.titulo) || txt(h.texto));

  const relaciones = (Array.isArray(data.constelaciones) ? data.constelaciones : []).filter(
    (c) => txt(c.titulo) || txt(c.texto) ||
      INTEGRACION_PREGUNTAS.some((p) => txt(c[p.key])),
  );

  const miedos = (Array.isArray(data.miedos) ? data.miedos : []).filter((m) => txt(m.texto));
  // Dones: acepta tanto la forma nueva (objetos {texto}) como la antigua
  // (string[]), para que no desaparezcan del entregable con datos heredados.
  const dones = (Array.isArray(data.dones?.lista) ? data.dones!.lista! : [])
    .map((x) => (typeof x === "string" ? txt(x) : txt((x as { texto?: unknown })?.texto)))
    .filter(Boolean);

  const comp = data.compromiso || {};
  const hayCompromiso = (comp.necesitaste || "").trim() || (comp.dartelo || "").trim();

  const b = data.brujula || {};
  const brujulaMensaje = (b.mensaje || "").trim();
  const brujulaPreg: [string, string][] = [
    ["¿Qué herida se ha activado?", (b.herida || "").trim()],
    ["¿Qué necesidad hay debajo?", (b.necesidad || "").trim()],
    ["¿Qué miedo está hablando?", (b.miedo || "").trim()],
    ["¿Qué don puedes utilizar ahora?", (b.don || "").trim()],
  ].filter(([, v]) => v) as [string, string][];
  const hayBrujula = !!brujulaMensaje || brujulaPreg.length > 0;

  const nada =
    problemas.length === 0 && !aceListo && huellas.length === 0 && nudos.length === 0 &&
    necesidades.length === 0 && heridas.length === 0 && relaciones.length === 0 &&
    miedos.length === 0 && dones.length === 0 && !hayCompromiso && !hayBrujula;

  // ── Los bloques del recorrido, EN ORDEN. Cada uno se pinta como una sección
  //    numerada y se conectan con flechas verticales, para que se lean como el
  //    camino que la persona ha ido recorriendo. ──
  const bloques: { titulo: string; node: React.ReactNode }[] = [];

  if (problemas.length > 0) bloques.push({
    titulo: "De dónde vengo",
    node: (
      <Cascada gap={{ base: 3, md: 3.5 }}>
        {problemas.map((p, i) => <Item key={i}><Cita texto={p} /></Item>)}
      </Cascada>
    ),
  });

  if (aceListo && banda) bloques.push({
    titulo: "Lo que cargué",
    node: (
      <RevealStagger inView once amount={0.18} stagger={0.22} delayChildren={0.1}
        display="flex" flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "center", md: "flex-start" }} gap={{ base: 4, md: 6 }}>
        <Item flexShrink={0} scaleFrom={0.85} duration={0.8}>
          <Flex direction="column" align="center" justify="center"
                w={{ base: "88px", md: "100px" }} h={{ base: "88px", md: "100px" }} borderRadius="full"
                bg="rgba(255,251,243,0.72)" border={`2px solid ${TINTA}`}
                boxShadow={`0 4px 16px rgba(94,45,16,0.18)`}>
            <Text color={TINTA} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" lineHeight="1">{score}</Text>
            <Text color={`${TINTA}aa`} fontSize="xs" fontWeight="600" letterSpacing="0.08em">DE 10</Text>
          </Flex>
        </Item>
        <Item flex="1" textAlign={{ base: "center", md: "left" }}>
          <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2} style={{ textShadow: INK_SHADOW }}>
            {banda.titulo}
          </Text>
          <Text color={`${TINTA}dd`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
            {banda.texto}
          </Text>
        </Item>
      </RevealStagger>
    ),
  });

  if (huellas.length > 0) bloques.push({ titulo: "Lo que dejó huella", node: <Puntos items={huellas} /> });
  if (nudos.length > 0) bloques.push({ titulo: "Los nudos", node: <Puntos items={nudos} /> });
  if (necesidades.length > 0) bloques.push({ titulo: "Lo que me faltó", node: <Chips items={necesidades} /> });

  if (heridas.length > 0) bloques.push({
    titulo: "Mis heridas",
    node: (
      <Cascada gap={{ base: 3.5, md: 4 }}>
        {heridas.map((h) => (
          <Item key={h.id}>
            <Cita
              titulo={(h.titulo || "").trim() || "Herida"}
              texto={(h.texto || "").trim()}
              piezas={[...(h.huellas || []), ...(h.nudos || []), ...(h.necesidades || [])].filter(Boolean)}
              piezasLabel="Se formó de"
            />
          </Item>
        ))}
      </Cascada>
    ),
  });

  if (relaciones.length > 0) bloques.push({
    titulo: "Cómo me relaciono",
    node: (
      <Cascada gap={{ base: 3.5, md: 4 }}>
        {relaciones.map((c) => (
          <Item key={c.id}>
            <Cita
              titulo={(c.titulo || "").trim() || "Relación"}
              texto={(c.texto || "").trim()}
              piezas={[...(c.nudos || []), ...(c.arquetipos || []).map((a) => arquetipoLabel(a))].filter(Boolean)}
              piezasLabel="Piezas que uniste"
              preguntas={INTEGRACION_PREGUNTAS
                .map((p) => ({ pregunta: p.label, resp: ((c[p.key] as string) || "").trim() }))
                .filter((x) => x.resp)}
            />
          </Item>
        ))}
      </Cascada>
    ),
  });

  if (miedos.length > 0) bloques.push({
    titulo: "Mis miedos",
    node: (
      <Cascada gap={{ base: 3.5, md: 4 }}>
        {miedos.map((m) => (
          <Item key={m.id}>
            <MiedoCard
              texto={(m.texto || "").trim()}
              respuestas={MIEDOS_PREGUNTAS
                .map((p) => ({ pregunta: p.pregunta, resp: (m.respuestas?.[p.key] || "").trim() }))
                .filter((x) => x.resp)}
            />
          </Item>
        ))}
      </Cascada>
    ),
  });

  if (dones.length > 0) bloques.push({
    titulo: "Mis dones",
    node: (
      <Cascada wrap gap={2.5}>
        {dones.map((x, i) => (
          <Item key={i} distance={14} scaleFrom={0.9} duration={0.6}>
            <Flex align="center" gap={2} px={{ base: 4, md: 5 }} py={2} borderRadius="full"
                  bg={`${ORO}1f`} border={`1px solid ${ORO}88`} boxShadow={`0 2px 8px ${ORO}22`}>
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" w="14px" h="14px" flexShrink={0}>
                <polygon points="12,2 14.9,8.6 22,9.3 16.5,14.1 18.3,21 12,17.3 5.7,21 7.5,14.1 2,9.3 9.1,8.6" fill={ORO} />
              </Box>
              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontWeight="600" lineHeight="1.2">{x}</Text>
            </Flex>
          </Item>
        ))}
      </Cascada>
    ),
  });

  if (hayBrujula) bloques.push({
    titulo: "Mi carta",
    node: (
      <Box>
        <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.7} mb={3} style={{ textShadow: INK_SHADOW }}>
          Para cuando vuelva a sentirme bloqueado:
        </Text>
        {brujulaMensaje ? (
          <Cita texto={brujulaMensaje} />
        ) : (
          <Cascada gap={{ base: 3.5, md: 4 }}>
            {brujulaPreg.map(([q, v], i) => <Item key={i}><PreguntaRespuesta pregunta={q} respuesta={v} /></Item>)}
          </Cascada>
        )}
      </Box>
    ),
  });

  if (hayCompromiso) bloques.push({
    titulo: "Mi compromiso conmigo mismo",
    node: (
      <Cascada gap={{ base: 3.5, md: 4 }}>
        {(comp.necesitaste || "").trim() && (
          <Item><PreguntaRespuesta pregunta="¿Qué necesitaste que nadie pudo darte?" respuesta={(comp.necesitaste as string).trim()} /></Item>
        )}
        {(comp.dartelo || "").trim() && (
          <Item><PreguntaRespuesta pregunta="¿Cómo puedes empezar a dártelo hoy?" respuesta={(comp.dartelo as string).trim()} /></Item>
        )}
      </Cascada>
    ),
  });

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 6, md: 8 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
              <MetodoStepHeader
                icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
                title="Síntesis"
                bgColor={`${neuropsicologiaBg}f0`}
                color={neuropsicologiaTxt}
                nom={neuropsicologiaNom}
                maxW="100%"
                step={{ current: 22, total: 23 }}
                mb={0}
                boxShadow={glowHeader}
                prev={{ label: "← Carta", onClick: () => navigate(`/metodo/psicologia/${exp.id}/brujula`) }}
                next={{ label: "Cursos →", onClick: () => navigate(`/metodo/psicologia/${exp.id}/cursos`) }}
              />
            </Reveal>

            {/* Intro */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
              <IntroRecorrido>
                Aquí está todo tu mapa, de principio a fin. Desde el problema con el que
                llegaste hasta la carta que te escribiste. Léelo entero: esto eres tú.
              </IntroRecorrido>
            </Reveal>

            {nada ? (
              <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.22} duration={0.75} w="100%">
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                   border={azulBorde} boxShadow={glowPanel} bgColor={neuropsicologiaBg}>
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                <Box position="relative" zIndex={1} px={{ base: 7, md: 11 }} py={{ base: 12, md: 16 }} textAlign="center">
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
                    Aún no hay nada que sintetizar. A medida que recorras el camino, aquí aparecerá todo lo que escribas.
                  </Text>
                </Box>
              </Box>
              </Reveal>
            ) : (
              <Flex direction="column" align="center" w="100%">
                {/* El recorrido completo: cada etapa entra al ir bajando, como un
                    camino que se va revelando ante ti (scroll reveal escalonado). */}
                {bloques.map((b, i) => (
                  <React.Fragment key={b.titulo}>
                    <Reveal inView once amount={0.25} direction="up" distance={54} scaleFrom={0.9} blur duration={0.85} w="100%">
                      <Seccion numero={i + 1} titulo={b.titulo}>{b.node}</Seccion>
                    </Reveal>
                    {i < bloques.length - 1 && (
                      <Reveal inView once amount={0.8} direction="none" scaleFrom={0.2} duration={0.45}>
                        <FlechaConector />
                      </Reveal>
                    )}
                  </React.Fragment>
                ))}

                {/* ── Descargas en PDF · dos cuadernos, mismo envase ──
                    Arriba el mapa entero (el recorrido completo) y debajo la
                    línea de Vida año a año, que es el documento más largo y no
                    cabía dentro del otro. */}
                <CajaDescarga
                  titulo="Llévate todo tu mapa"
                  texto="Descárgalo en un cuaderno en PDF, cuidado y bonito, para releerlo siempre que lo necesites."
                  boton="Descargar mi mapa"
                  descargando={descargando}
                  onClick={descargarPdf}
                  mt={{ base: 9, md: 12 }}
                />

                <CajaDescarga
                  titulo="Llévate tu línea de Vida"
                  texto="Descárgalo en un cuaderno en PDF, cuidado y bonito, para releerlo siempre que lo necesites."
                  boton="Descargar mi línea de Vida"
                  descargando={descargandoLinea}
                  onClick={descargarLineaPdf}
                  mt={{ base: 5, md: 7 }}
                />
              </Flex>
            )}

          </Flex>
        </Flex>
      </Box>

      <BotonCompania color={neuropsicologiaTxt} bgColor={neuropsicologiaBg} disciplinaNom={neuropsicologiaNom} precio={20} llamadaTitulo="Reserva tu llamada de psicología" />

      {/* «Volver arriba» · discreto, abajo a la derecha (sobre «¿Quieres compañía?»).
          Sube hasta la cabecera para que el usuario pueda seguir el recorrido. */}
      {mostrarArriba && (
        <Box as="button" onClick={volverArriba} aria-label="Volver arriba" title="Volver arriba"
             position="fixed" right={{ base: 4, md: 6 }} bottom={{ base: "66px", md: "84px" }} zIndex={20}
             w={{ base: "42px", md: "46px" }} h={{ base: "42px", md: "46px" }} borderRadius="full"
             display="flex" alignItems="center" justifyContent="center"
             bg="rgba(251,244,232,0.82)" color={TINTA} border={`1.5px solid ${TINTA}55`}
             boxShadow={`0 4px 16px rgba(0,0,0,0.22), 0 0 12px ${neuropsicologiaBg}55`}
             sx={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }} transition="all 0.18s"
             _hover={{ transform: "translateY(-2px)", borderColor: TINTA, bg: "rgba(251,244,232,0.96)" }}>
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
               w={{ base: "21px", md: "23px" }} h={{ base: "21px", md: "23px" }} fill="currentColor">
            <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
          </Box>
        </Box>
      )}

      <IndiceRecorrido progresoKey="psicologia" />
      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Piezas de presentación (solo lectura). Cada sección es un panel de acuarela
// numerado; dentro, el contenido se agrupa en tarjetas «crema» limpias. Las
// secciones se conectan con una flecha vertical que apunta a la siguiente.
// ─────────────────────────────────────────────────────────────────────────

// CTA de descarga: el envase dorado del final del recorrido. Se usa dos veces
// (el mapa entero y la línea de Vida), así que vive aquí una sola vez.
function CajaDescarga({ titulo, texto, boton, descargando, onClick, mt }: {
  titulo: string;
  texto: string;
  boton: string;
  descargando: boolean;
  onClick: () => void;
  mt?: any;
}) {
  const icono = (
    <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
  );
  return (
    <Reveal inView once amount={0.25} direction="up" distance={54} scaleFrom={0.9} blur duration={0.9} w="100%" mt={mt}>
      <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
           border={`1px solid ${ORO}66`}
           boxShadow={`0 0 0 1px ${ORO}22, 0 14px 46px rgba(94,45,16,0.28), 0 0 34px ${ORO}22`}
           bgColor={neuropsicologiaBg}>
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
        {/* Velo cálido para que resalte del resto de secciones */}
        <Box position="absolute" inset={0} zIndex={1}
             bgGradient={`linear(to-b, ${ORO}14, transparent 60%)`} pointerEvents="none" />
        <Flex position="relative" zIndex={2} direction="column" align="center" gap={{ base: 5, md: 6 }}
              px={{ base: 6, md: 12 }} py={{ base: 10, md: 14 }} textAlign="center">
          {/* Sello con icono de descarga */}
          <Flex align="center" justify="center" w={{ base: "60px", md: "72px" }} h={{ base: "60px", md: "72px" }}
                borderRadius="full" bg={TINTA} border={`2px solid ${ORO}`} flexShrink={0}
                boxShadow={`0 8px 24px rgba(94,45,16,0.4), 0 0 22px ${ORO}55`}>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                 w={{ base: "30px", md: "36px" }} h={{ base: "30px", md: "36px" }} fill={PAPEL}>
              {icono}
            </Box>
          </Flex>

          <Box>
            {/* Es el remate de todo el recorrido: se escribe algo más
                despacio que los títulos de sección. */}
            <TextoLetraALetra color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700"
                              lineHeight="1.2" style={{ textShadow: INK_SHADOW }}
                              delay={0.35} porLetra={0.045} amount={0.5}>
              {titulo}
            </TextoLetraALetra>
            <Text color={`${TINTA}dd`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.6"
                  mt={2} maxW="520px" mx="auto" style={{ textShadow: INK_SHADOW }}>
              {texto}
            </Text>
          </Box>

          <Box as="button" onClick={descargando ? undefined : onClick} position="relative"
               display="inline-flex" alignItems="center" justifyContent="center" gap={3}
               px={{ base: 8, md: 12 }} py={{ base: 3.5, md: 4 }} borderRadius="full"
               bg={TINTA} color={PAPEL} border={`1px solid ${ORO}aa`}
               fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.03em"
               cursor={descargando ? "wait" : "pointer"} opacity={descargando ? 0.8 : 1}
               boxShadow={`0 10px 30px rgba(94,45,16,0.4), 0 0 26px ${ORO}44`} transition="all 0.2s"
               _hover={descargando ? {} : { transform: "translateY(-3px)", boxShadow: `0 16px 40px rgba(94,45,16,0.5), 0 0 34px ${ORO}66` }}>
            {!descargando && (
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                   w={{ base: "22px", md: "24px" }} h={{ base: "22px", md: "24px" }} fill={PAPEL} flexShrink={0}>
                {icono}
              </Box>
            )}
            {descargando ? "Preparando tu PDF…" : boton}
          </Box>
        </Flex>
      </Box>
    </Reveal>
  );
}

const CARD_BG = "rgba(255,251,243,0.72)";
const CARD_BORDER = `1px solid ${TINTA}22`;
const CARD_SHADOW = "0 2px 10px rgba(94,45,16,0.08)";

// Cascada: contenedor que revela a sus hijos UNO A UNO al entrar en pantalla.
// Cada hijo va envuelto en <Item>. `wrap` para layouts de píldoras (chips/dones).
function Cascada({ children, gap, wrap = false }: { children: React.ReactNode; gap?: any; wrap?: boolean }) {
  return (
    <RevealStagger
      inView once amount={0.18} stagger={0.18} delayChildren={0.1}
      display="flex"
      flexDirection={wrap ? "row" : "column"}
      flexWrap={wrap ? "wrap" : "nowrap"}
      gap={gap}
    >
      {children}
    </RevealStagger>
  );
}

// Un elemento de la cascada (sube + leve zoom al aparecer).
function Item({ children, ...rest }: { children: React.ReactNode; [k: string]: any }) {
  return (
    <RevealItem direction="up" distance={18} scaleFrom={0.96} duration={0.75} {...rest}>
      {children}
    </RevealItem>
  );
}

// Una sección: panel de acuarela con nº de paso + título y una fina separación.
function Seccion({ numero, titulo, children }: { numero: number; titulo: string; children: React.ReactNode }) {
  return (
    <Box position="relative" w="100%" maxW="100%" borderRadius="2xl" overflow="hidden"
         border={azulBorde} boxShadow={glowPanel} bgColor={neuropsicologiaBg}>
      <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
        <Flex align="center" gap={{ base: 3, md: 3.5 }}>
          <Flex flexShrink={0} align="center" justify="center"
                w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }}
                borderRadius="full" bg={TINTA} color={PAPEL} border={`1.5px solid ${PAPEL}bb`}
                fontWeight="700" fontSize={{ base: "md", md: "lg" }}
                boxShadow={`0 3px 12px ${TINTA}66`}>
            {numero}
          </Flex>
          {/* El título se escribe letra a letra al asomar la sección: entra un
              poco después que el panel (0,3 s) para que se lea como si el
              camino se fuera revelando a medida que bajas. */}
          <TextoLetraALetra
            color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.2"
            style={{ textShadow: INK_SHADOW }}
            delay={0.3} amount={0.6}
          >
            {titulo}
          </TextoLetraALetra>
        </Flex>
        <Box h="1px" w="100%" my={{ base: 4, md: 5 }} bg={`${TINTA}22`} />
        {children}
      </Box>
    </Box>
  );
}

// Flecha vertical que conecta una sección con la siguiente (sobre el turquesa).
function FlechaConector() {
  return (
    <Flex direction="column" align="center" justify="center" aria-hidden py={{ base: 2, md: 2.5 }}>
      <Box w="2.5px" h={{ base: "24px", md: "32px" }} borderRadius="full"
           bgGradient={`linear(to-b, ${PAPEL}33, ${PAPEL}cc)`} />
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w={{ base: "26px", md: "30px" }} h={{ base: "26px", md: "30px" }} fill={PAPEL}
           style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))", marginTop: "-5px" }}>
        <path d="M480-360 280-560l56-56 144 144 144-144 56 56-200 200Z" />
      </Box>
    </Flex>
  );
}

// Flecha horizontal fina que conecta dos eslabones de la cadena de piezas.
function ChainArrow() {
  return (
    <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
         w="15px" h="15px" fill={`${TINTA}99`} flexShrink={0} aria-hidden
         style={{ filter: `drop-shadow(0 0 4px ${TINTA}44)` }}>
      <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
    </Box>
  );
}

// Tarjeta «cita»: título opcional + texto + piezas (chips) + remate opcional
// (p. ej. el compromiso de una relación). Se usa en problema, heridas,
// relaciones y el mensaje de la brújula.
function Cita({ titulo, texto, piezas, piezasLabel, remate, preguntas }: {
  titulo?: string;
  texto: string;
  piezas?: string[];
  piezasLabel?: string;
  remate?: { label: string; texto: string };
  preguntas?: { pregunta: string; resp: string }[];
}) {
  return (
    <Box bg={CARD_BG} borderRadius="xl" border={CARD_BORDER} borderLeft={`4px solid ${TINTA}`}
         px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }} boxShadow={CARD_SHADOW}>
      {titulo && (
        <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.3" mb={texto ? 1.5 : 0}>
          {titulo}
        </Text>
      )}
      {texto && (
        <Text color={`${TINTA}f2`} fontSize={{ base: "md", md: "lg" }} fontStyle={titulo ? "normal" : "italic"}
              lineHeight="1.7" whiteSpace="pre-wrap">
          {texto}
        </Text>
      )}
      {piezas && piezas.length > 0 && (
        <Box mt={3} pt={3} borderTop={`1px solid ${TINTA}1f`}>
          {piezasLabel && (
            <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.12em"
                  textTransform="uppercase" opacity={0.6} mb={1.5}>
              {piezasLabel}
            </Text>
          )}
          {/* Los eslabones se encadenan de izquierda a derecha, conectados por una
              flecha que aparece entre uno y otro: se lee como el «camino» que unió
              esas piezas. */}
          <RevealStagger inView once amount={0.3} stagger={0.13} delayChildren={0.05}
            display="flex" flexWrap="wrap" alignItems="center" gap={1.5}>
            {piezas.map((p, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <RevealItem direction="none" scaleFrom={0.3} duration={0.35} display="flex" alignItems="center">
                    <ChainArrow />
                  </RevealItem>
                )}
                <RevealItem direction="right" distance={16} scaleFrom={0.85} duration={0.5} display="flex">
                  <Box px={{ base: 2.5, md: 3 }} py={1} borderRadius="full"
                       bg="rgba(255,251,243,0.85)" border={`1px solid ${TINTA}30`}>
                    <Text color={TINTA} fontSize={{ base: "2xs", md: "xs" }} fontWeight="600" opacity={0.9} lineHeight="1.2">{p}</Text>
                  </Box>
                </RevealItem>
              </React.Fragment>
            ))}
          </RevealStagger>
        </Box>
      )}
      {remate && (
        <Box mt={3} pt={3} borderTop={`1px solid ${TINTA}1f`}>
          <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.12em"
                textTransform="uppercase" opacity={0.6} mb={1}>
            {remate.label}
          </Text>
          <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="600" fontStyle="italic" lineHeight="1.5">
            {remate.texto}
          </Text>
        </Box>
      )}
      {preguntas && preguntas.length > 0 && (
        <Flex direction="column" mt={3} pt={3} borderTop={`1px solid ${TINTA}1f`}>
          {preguntas.map((x, i) => (
            <Box key={i}
                 mt={i === 0 ? 0 : { base: 3, md: 3.5 }}
                 pt={i === 0 ? 0 : { base: 3, md: 3.5 }}
                 borderTop={i === 0 ? undefined : `1px solid ${TINTA}1f`}>
              <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.1em"
                    textTransform="uppercase" opacity={0.6} mb={1}>
                {x.pregunta}
              </Text>
              <Text color={`${TINTA}f2`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.65" whiteSpace="pre-wrap">
                {x.resp}
              </Text>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
}

// Lista de ítems como tarjetas crema con marcador (huellas, nudos). Cascada.
function Puntos({ items }: { items: string[] }) {
  return (
    <Cascada gap={{ base: 2, md: 2.5 }}>
      {items.map((it, i) => (
        <Item key={i}>
          <Flex align="flex-start" gap={3} bg={CARD_BG} borderRadius="lg" border={CARD_BORDER}
                px={{ base: 3.5, md: 4 }} py={{ base: 2.5, md: 3 }}>
            <Box flexShrink={0} w="7px" h="7px" borderRadius="full" bg={TINTA} mt={{ base: 2, md: 2.5 }}
                 boxShadow={`0 0 6px ${TINTA}55`} />
            <Text color={`${TINTA}f2`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.55">{it}</Text>
          </Flex>
        </Item>
      ))}
    </Cascada>
  );
}

// Chips en píldora (necesidades no cubiertas). Cascada en wrap.
function Chips({ items }: { items: string[] }) {
  return (
    <Cascada wrap gap={2.5}>
      {items.map((x, i) => (
        <Item key={i} distance={14} scaleFrom={0.9} duration={0.6}>
          <Box px={{ base: 3.5, md: 4 }} py={2} borderRadius="full"
               bg={CARD_BG} border={`1px solid ${TINTA}33`}>
            <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontWeight="600" lineHeight="1.2">{x}</Text>
          </Box>
        </Item>
      ))}
    </Cascada>
  );
}

// Tarjeta pregunta + respuesta (compromiso, brújula antigua).
function PreguntaRespuesta({ pregunta, respuesta }: { pregunta: string; respuesta: string }) {
  return (
    <Box bg={CARD_BG} borderRadius="xl" border={CARD_BORDER} px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}
         boxShadow={CARD_SHADOW}>
      <Text color={TINTA} fontSize={{ base: "2xs", md: "xs" }} fontWeight="700" letterSpacing="0.1em"
            textTransform="uppercase" opacity={0.65} mb={2}>
        {pregunta}
      </Text>
      <Text color={`${TINTA}f2`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7" whiteSpace="pre-wrap">
        {respuesta}
      </Text>
    </Box>
  );
}

// Tarjeta de un miedo: el miedo + sus respuestas al enfrentarlo (agrupadas).
function MiedoCard({ texto, respuestas }: { texto: string; respuestas: { pregunta: string; resp: string }[] }) {
  return (
    <Box bg={CARD_BG} borderRadius="xl" border={CARD_BORDER} borderLeft={`4px solid ${TINTA}`}
         px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }} boxShadow={CARD_SHADOW}>
      <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" lineHeight="1.3">
        {texto}
      </Text>
      {respuestas.length > 0 && (
        <Flex direction="column" mt={3.5} pt={3.5} borderTop={`1px solid ${TINTA}1f`}>
          {respuestas.map((x, i) => (
            <Box key={i}
                 mt={i === 0 ? 0 : { base: 3.5, md: 4 }}
                 pt={i === 0 ? 0 : { base: 3.5, md: 4 }}
                 borderTop={i === 0 ? undefined : `1px solid ${TINTA}1f`}>
              <Text color={TINTA} fontSize={{ base: "2xs", md: "xs" }} fontWeight="700" letterSpacing="0.08em"
                    textTransform="uppercase" opacity={0.6} mb={1}>
                {x.pregunta}
              </Text>
              <Text color={`${TINTA}f2`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.65" whiteSpace="pre-wrap">
                {x.resp}
              </Text>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
}
