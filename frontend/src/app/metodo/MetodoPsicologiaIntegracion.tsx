// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · RELACIÓN (construir)  ·  17/29
//
// Funciona como «Heridas»: dos columnas de fuentes (tus heridas y tus
// arquetipos) y, debajo, el box «Tu relación en curso». La persona toca (o
// arrastra) piezas para reunirlas y, al pulsar «He terminado esta relación»,
// le pone nombre (y, si quiere, la frase que ella ve) en un popup. Al guardar,
// la relación aparece —bajo un separador de mandala— como un box CUADRADO de
// su propio color, en la misma rejilla que verá en «Tus relaciones».
//
// Persistencia: data.constelaciones = Constelacion[].
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea, Input } from "@chakra-ui/react";
import axios from "axios";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { AutoguardadoIndicador, type EstadoGuardado } from "../../components/global/AutoguardadoIndicador";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { Glifo } from "../../components/metodo/Glifo";
import { RelacionIcon } from "../../components/metodo/RelacionIcon";
import { HeridaIcon } from "../../components/metodo/HeridaIcon";
import { SaberMasModal } from "../../components/metodo/Planetas/SaberMasModal";
import { ArquetiposBloqueados } from "../../components/metodo/ArquetiposBloqueados";
import { CUERPOS, cuerpoByKey, type Cuerpo } from "../../components/metodo/astrologiaData";
import { type CartaData } from "../../components/metodo/Planetas/useCartaPlanetas";
import { MandalaDivider } from "../../components/metodo/HeridaGrid";
import { RelacionGrid, colorRelacionIdx } from "../../components/metodo/RelacionGrid";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import {
  experienciaById,
  arquetipoKey,
  type LineaDeVidaData,
  type Constelacion,
  type ArquetipoRef,
  type RelacionHuellaNudo,
} from "../../components/metodo/psicologiaRecorrido";
import { arquetipoLabel } from "../../components/metodo/integracionSimbolos";
import { AZUL, glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import {
  API_URL,
  AstrologiaIcon,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";
import { traducir, useT } from "../../i18n";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
// Foto de arquetipos (fondo de la columna, su cabecera y cada tarjeta). La página
// no se muestra hasta que esta imagen esté cargada, para que no aparezca a medias.
const ARQUETIPOS_IMG = "/img/astrologia/space.webp";
// Altura máxima común de las dos columnas; el resto se ve con scroll interno.
// Alto de las columnas: fijo SOLO cuando van lado a lado (lg). Apiladas
// (móvil/tablet) crecen hacia abajo con su contenido, sin scroll interno.
const COL_H = { base: "auto", lg: "600px" } as const;
const SCROLL_SX = {
  scrollbarWidth: "thin" as const,
  scrollbarColor: `${TINTA}66 transparent`,
  "&::-webkit-scrollbar": { width: "7px" },
  "&::-webkit-scrollbar-thumb": { background: `${TINTA}66`, borderRadius: "8px" },
};

interface ArqPlaneta {
  cuerpoKey: string;
  symbol: string;
  color: string;
  signo: string | null;
  casa: number | null;
}
interface ArqItem extends ArquetipoRef { symbol: string }

type Arrastre =
  | { tipo: "nudo"; nudo: string }
  | { tipo: "arquetipo"; arq: ArqItem }
  | null;

const nuevoId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `c-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

// Etiqueta visible de una herida (reutilizamos el campo `nudos` de la
// constelación para guardar estas etiquetas, que es lo que el usuario relaciona).
const heridaLabel = (h: RelacionHuellaNudo): string =>
  (h.titulo || "").trim() || traducir("metodo.psico.heridaSinTitulo");

function facetasDe(p: ArqPlaneta): ArqItem[] {
  const out: ArqItem[] = [];
  if (p.signo) out.push({ cuerpoKey: p.cuerpoKey, faceta: "signo", signo: p.signo, casa: null, symbol: p.symbol });
  if (p.casa != null) out.push({ cuerpoKey: p.cuerpoKey, faceta: "casa", signo: null, casa: p.casa, symbol: p.symbol });
  return out;
}

const EyeIcon = ({ color }: { color: string }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="13px" h="13px" fill={color}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

// Cabecera DENTRO del box, separada del contenido por una raya horizontal.
// `dark` para la columna con fondo de estrellas (texto claro).
function ColumnaHeaderBox({ icono, titulo, apoyo, dark }: { icono: React.ReactNode; titulo: string; apoyo?: string; dark?: boolean }) {
  const tinta = dark ? PAPEL : TINTA;
  const shadow = dark ? `0 1px 6px rgba(0,0,0,0.5)` : `0 1px 2px ${PAPEL}`;
  return (
    <Box flexShrink={0} position="relative" overflow="hidden" borderBottom={`1px solid ${tinta}55`}>
      {/* Imagen propia de la cabecera (independiente del cuerpo → menos distorsión) */}
      {dark ? (
        <Box position="absolute" inset="0" zIndex={0} bgImage="url('/img/astrologia/space.webp')"
             bgSize="cover" bgPosition="center" />
      ) : (
        <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="0" />
      )}
      <Box position="relative" zIndex={1} px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={3}>
        <Flex direction="column" align="center" gap={1} textAlign="center">
          <Flex align="center" gap={2.5}>
            <Box flexShrink={0} display="flex" alignItems="center" justifyContent="center"
                 style={{ filter: `drop-shadow(${shadow})` }}>{icono}</Box>
            <Text color={tinta} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.03em"
                  style={{ textShadow: shadow }}>{titulo}</Text>
          </Flex>
          {apoyo && (
            <Text color={tinta} fontSize="xs" fontStyle="italic" opacity={0.85} maxW="300px"
                  style={{ textShadow: shadow }}>{apoyo}</Text>
          )}
        </Flex>
      </Box>
    </Box>
  );
}

export default function MetodoPsicologiaIntegracion() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  // Hasta que la foto de arquetipos no esté cargada, no se muestra la página.
  const [fotoLista, setFotoLista] = useState(false);
  const [estadoGuardado, setEstadoGuardado] = useState<EstadoGuardado>("idle");
  const [heridas, setHeridas] = useState<RelacionHuellaNudo[]>([]);
  const [arquetipos, setArquetipos] = useState<ArqPlaneta[]>([]);
  // ¿Ha pasado ya por Astrología? De eso depende que esta página se abra.
  const [astroHecha, setAstroHecha] = useState(false);

  // Relación en curso (selección) + relaciones guardadas.
  const [selHeridas, setSelHeridas] = useState<string[]>([]);
  const [selArqs, setSelArqs] = useState<ArquetipoRef[]>([]);
  const [relaciones, setRelaciones] = useState<Constelacion[]>([]);

  const [nombreOpen, setNombreOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [texto, setTexto] = useState("");

  const dataRef = useRef<LineaDeVidaData>({});
  const relacionesRef = useRef<HTMLDivElement>(null);

  const [saberMas, setSaberMas] = useState<{ cuerpo: Cuerpo; signo?: string; casa?: number; facet: "signo" | "casa" } | null>(null);
  const arrastreRef = useRef<Arrastre>(null);
  const [sobreMesa, setSobreMesa] = useState(false);
  const okTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const montado = useRef(true);
  useLockBodyScroll(nombreOpen);
  useEffect(() => () => {
    montado.current = false;
    if (okTimer.current) clearTimeout(okTimer.current);
  }, []);

  // Precarga de la foto de arquetipos. Si falla, no bloqueamos la página para
  // siempre: la damos por lista igualmente.
  useEffect(() => {
    const img = new Image();
    img.onload = () => { if (montado.current) setFotoLista(true); };
    img.onerror = () => { if (montado.current) setFotoLista(true); };
    img.src = ARQUETIPOS_IMG;
    if (img.complete) setFotoLista(true);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await getUserMe();
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }

        const [psiRes, astroRes] = await Promise.allSettled([
          axios.get(`${API_URL}/metodo-psicologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/metodo-astrologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (psiRes.status === "fulfilled") {
          const d: LineaDeVidaData = psiRes.value.data?.data || {};
          dataRef.current = d;
          setHeridas(Array.isArray(d.heridas) ? d.heridas : []);
          // Normalizamos cada constelación para que SIEMPRE tenga las formas que
          // el render da por hechas (nudos/arquetipos como array, textos como
          // string). Datos guardados con una forma antigua podían venir sin
          // `nudos`/`arquetipos` y hacían reventar el render (pantalla en blanco).
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
        }

        if (astroRes.status === "fulfilled") {
          // Esta página CRUZA dos disciplinas: sus nudos (psicología) con sus
          // arquetipos (astrología). Sin carta astral no hay media página, así
          // que se entra solo si ya pasó por Astrología — se da por hecha en
          // cuanto envió sus datos de nacimiento, que es cuando el servidor le
          // calcula la carta.
          setAstroHecha(!!astroRes.value.data?.solicitud_enviada_at);
          const carta: CartaData = astroRes.value.data?.data || {};
          const lista: ArqPlaneta[] = [];
          for (const c of CUERPOS) {
            const v = carta[c.key];
            if (!v) continue;
            const signo = v.signo || null;
            const casa = c.conCasa && v.casa != null ? v.casa : null;
            if (signo || casa != null) lista.push({ cuerpoKey: c.key, symbol: c.symbol, color: c.color, signo, casa });
          }
          setArquetipos(lista);
          if (lista.length > 0) setAstroHecha(true);
        }
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (next: Constelacion[]): Promise<boolean> => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return false;
    if (montado.current) setEstadoGuardado("guardando");
    try {
      const data = { ...dataRef.current, constelaciones: next };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = data;
      if (montado.current) {
        setEstadoGuardado("ok");
        if (okTimer.current) clearTimeout(okTimer.current);
        okTimer.current = setTimeout(() => { if (montado.current) setEstadoGuardado("idle"); }, 2200);
      }
      return true;
    } catch {
      if (montado.current) setEstadoGuardado("idle");
      return false;
    }
  };

  // ── La relación en curso: tocar (o arrastrar) piezas la reúne ──
  const toggleHerida = (label: string) =>
    setSelHeridas((sel) => (sel.includes(label) ? sel.filter((x) => x !== label) : [...sel, label]));
  const addHerida = (label: string) =>
    setSelHeridas((sel) => (sel.includes(label) ? sel : [...sel, label]));
  const toggleArq = (a: ArqItem) =>
    setSelArqs((sel) => (sel.some((x) => arquetipoKey(x) === arquetipoKey(a))
      ? sel.filter((x) => arquetipoKey(x) !== arquetipoKey(a))
      : [...sel, { cuerpoKey: a.cuerpoKey, faceta: a.faceta, signo: a.signo, casa: a.casa }]));
  const addArq = (a: ArqItem) =>
    setSelArqs((sel) => (sel.some((x) => arquetipoKey(x) === arquetipoKey(a))
      ? sel
      : [...sel, { cuerpoKey: a.cuerpoKey, faceta: a.faceta, signo: a.signo, casa: a.casa }]));

  const totalSel = selHeridas.length + selArqs.length;
  // Color de la relación en curso = el que le tocará al guardarla (siguiente índice).
  const colorEnCurso = colorRelacionIdx(relaciones.length);

  const guardarRelacion = async () => {
    if (totalSel === 0) return;
    const nueva: Constelacion = {
      id: nuevoId(),
      titulo: nombre.trim() || t("metodo.psico.relacionSinTitulo"),
      nudos: selHeridas,
      arquetipos: selArqs,
      texto: texto.trim(),
    };
    const next = [...relaciones, nueva];
    setRelaciones(next);
    setSelHeridas([]); setSelArqs([]);
    setNombre(""); setTexto(""); setNombreOpen(false);
    // La rejilla está abajo del todo: bajamos hasta ella para ver aparecer la
    // relación nueva (el Reveal entra al asomar en pantalla).
    setTimeout(() => { if (montado.current) relacionesRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, 500);
    await persistir(next);
  };

  const borrarRelacion = async (id: string) => {
    const next = relaciones.filter((c) => c.id !== id);
    setRelaciones(next);
    await persistir(next);
  };

  const abrirSaberMas = (a: ArqItem) => {
    const c = cuerpoByKey(a.cuerpoKey);
    if (!c) return;
    if (a.faceta === "signo") setSaberMas({ cuerpo: c, signo: a.signo || undefined, facet: "signo" });
    else setSaberMas({ cuerpo: c, casa: a.casa ?? undefined, facet: "casa" });
  };

  const soltarEnMesa = () => {
    const a = arrastreRef.current;
    arrastreRef.current = null;
    setSobreMesa(false);
    if (a?.tipo === "nudo") addHerida(a.nudo);
    else if (a?.tipo === "arquetipo") addArq(a.arq);
  };

  if (loading || !fotoLista) return <PsicologiaLoading />;
  if (!exp) return null;

  const irATusRelaciones = async () => { await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/relaciones-lista`); };
  const irANarra = async () => { await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/regulacion`); };

  const heridaEnCurso = (label: string) => selHeridas.includes(label);
  const arqEnCurso = (a: ArqItem) => selArqs.some((x) => arquetipoKey(x) === arquetipoKey(a));

  // Los chips de la selección, tanto en el box «en curso» como en el popup.
  const chipsSeleccion = (
    <Flex wrap="wrap" gap={2} justify="center">
      {selHeridas.map((label) => (
        <Chip key={`sh-${label}`} tint={colorEnCurso} icon={<HeridaIcon size={13} color={TINTA} />} label={label}
              onRemove={() => toggleHerida(label)} />
      ))}
      {selArqs.map((a) => (
        <Chip key={`sa-${arquetipoKey(a)}`} tint={colorEnCurso}
              icon={<Glifo symbol={cuerpoByKey(a.cuerpoKey)?.symbol || "✦"} color={TINTA} size={14} />}
              label={arquetipoLabel(a)}
              onRemove={() => setSelArqs((sel) => sel.filter((x) => arquetipoKey(x) !== arquetipoKey(a)))} />
      ))}
    </Flex>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 8, lg: 12 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
          <Flex direction="column" align="center" w="100%" maxW="1240px" gap={{ base: 8, md: 10 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title={t("metodo.psico.paso.relacion")}
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 17, total: 29 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: `← ${t("metodo.psico.narra")}`, onClick: irANarra }}
              next={{
                label: `${t("metodo.psico.tusRelaciones")} →`,
                onClick: irATusRelaciones,
                disabled: relaciones.length === 0,
                disabledTooltip: t("metodo.psico.faltaRelacion"),
              }}
            />
            </Reveal>

            {!astroHecha ? (
              /* ── Sin carta astral: la página entera va con candado ──
                 Aquí se reúnen sus nudos con sus arquetipos; sin la mitad
                 astrológica no hay ejercicio que hacer, así que en vez de abrir
                 media página se explica qué se hace y se le lleva a por su
                 carta. Al volver con ella, la página se abre sola. */
              <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
                <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                     minH={{ base: "380px", md: "440px" }} display="flex"
                     bgImage={`url('${ARQUETIPOS_IMG}')`} bgSize="cover" bgPosition="center"
                     border={azulBorde} boxShadow={glowPanel}>
                  {/* Velo: la foto sola no da contraste para la letra clara. */}
                  <Box position="absolute" inset={0} bg="rgba(8,13,30,0.3)" pointerEvents="none" />
                  <Box position="relative" zIndex={1} flex="1" px={{ base: 5, md: 8 }} py={{ base: 8, md: 10 }}>
                    <ArquetiposBloqueados
                      onIr={() => navigate("/metodo/astrologia")}
                      texto={[
                        t("metodo.psico.bloqRelacion1"),
                        t("metodo.psico.bloqRelacionPagina"),
                      ]}
                    />
                  </Box>
                </Box>
              </Reveal>
            ) : (
            <>
            {/* Intro: la idea de la proyección */}
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
            <IntroRecorrido>{t("metodo.psico.relacionIntro")}</IntroRecorrido>
            </Reveal>

            {/* ════════ DOS COLUMNAS DE FUENTES ════════
                 Cada columna con su propio <Reveal inView>: crecen con los datos
                 del usuario y envolver el conjunto caería en la trampa del `amount`. */}
            <Flex w="100%" direction={{ base: "column", lg: "row" }} gap={{ base: 8, lg: 6 }} align="stretch">

              {/* ── COLUMNA 1 · HERIDAS ── */}
              <Reveal inView once amount={0.2} direction="up" distance={30} scaleFrom={0.96} duration={0.6} flex="1" minW={0}>
              <Flex direction="column" flex="1" minW={0}>
                <Box position="relative" h={COL_H} borderRadius="2xl" overflow="hidden"
                     border={azulBorde} boxShadow={glowPanel}>
                  <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
                  <Flex position="relative" zIndex={1} direction="column" h="100%">
                    <ColumnaHeaderBox icono={<HeridaIcon size={22} color={TINTA} />} titulo={t("metodo.psico.paso.tusHeridas")} apoyo={t("metodo.psico.heridasApoyo")} />
                    <Box flex="1" minH={0} overflowY={{ base: "visible", lg: "auto" }} px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={{ base: 5, md: 6 }} sx={SCROLL_SX}>
                      {heridas.length === 0 ? (
                        <EstadoVacio texto={t("metodo.psico.sinHeridasAun")} accion={t("metodo.psico.irAHeridas")}
                                     onClick={() => navigate(`/metodo/psicologia/${exp.id}/huellas-nudos`)} />
                      ) : (
                        <Flex direction="column" gap={2.5}>
                          {heridas.map((h) => {
                            const label = heridaLabel(h);
                            return (
                              <HeridaRect key={h.id} texto={label} activo={heridaEnCurso(label)}
                                          onTap={() => toggleHerida(label)}
                                          onDragStart={() => { arrastreRef.current = { tipo: "nudo", nudo: label }; }}
                                          onDragEnd={() => { arrastreRef.current = null; }} />
                            );
                          })}
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </Box>
              </Flex>
              </Reveal>

              {/* ── COLUMNA 2 · ARQUETIPOS ── */}
              <Reveal inView once amount={0.2} direction="up" distance={30} scaleFrom={0.96} duration={0.6} delay={0.07} flex="1" minW={0}>
              <Flex direction="column" flex="1" minW={0}>
                <Box position="relative" h={COL_H} borderRadius="2xl" overflow="hidden"
                     border={azulBorde} boxShadow={glowPanel}>
                  {/* Fondo: imagen de astrología a opacidad completa */}
                  <Box position="absolute" inset="0" zIndex={0} bgImage="url('/img/astrologia/space.webp')"
                       bgSize="cover" bgPosition="center" />
                  {/* pb permanente: siempre deja un respiro al fondo del scroll. */}
                  <Flex position="relative" zIndex={1} direction="column" h="100%" pb={{ base: 3, md: 4 }}>
                    <ColumnaHeaderBox dark icono={<AstrologiaIcon size={{ base: "24px", md: "24px" }} />} titulo={t("metodo.psico.tusArquetipos")}
                                      apoyo={arquetipos.length === 0
                                        ? t("metodo.psico.arquetiposSinCarta")
                                        : t("metodo.psico.arquetiposRelacionar")} />
                    <Box flex="1" minH={0} overflowY={{ base: "visible", lg: "auto" }} px={{ base: 4, md: 5 }} pt={{ base: 4, md: 5 }} pb={{ base: 5, md: 6 }}
                         sx={{ ...SCROLL_SX, scrollbarColor: `${PAPEL}55 transparent`,
                               "&::-webkit-scrollbar": { width: "7px" },
                               "&::-webkit-scrollbar-thumb": { background: `${PAPEL}55`, borderRadius: "8px" } }}>
                      {arquetipos.length === 0 ? (
                        // Sin carta astral la columna va BLOQUEADA: se explica qué
                        // se hace aquí y que para completarlo hace falta la carta.
                        <ArquetiposBloqueados
                          onIr={() => navigate("/metodo/astrologia")}
                          texto={[
                            t("metodo.psico.bloqRelacion1"),
                            t("metodo.psico.bloqRelacion2"),
                          ]}
                        />
                      ) : (
                        <Flex direction="column" gap={{ base: 4, md: 5 }}>
                          {arquetipos.map((p) => (
                            <Flex key={p.cuerpoKey} gap={{ base: 3, md: 3.5 }}>
                              {facetasDe(p).map((it) => (
                                <MiniCard key={arquetipoKey(it)} item={it} color={p.color} symbol={p.symbol}
                                          activo={arqEnCurso(it)} onTap={() => toggleArq(it)} onLeer={() => abrirSaberMas(it)}
                                          onDragStart={() => { arrastreRef.current = { tipo: "arquetipo", arq: it }; }}
                                          onDragEnd={() => { arrastreRef.current = null; }} />
                              ))}
                            </Flex>
                          ))}
                        </Flex>
                      )}
                    </Box>
                  </Flex>
                </Box>
              </Flex>
              </Reveal>
            </Flex>

            {/* ════════ RELACIÓN EN CURSO · box elegante (con el botón dentro) ════════
                 También es la «mesa» donde se puede soltar lo arrastrado. */}
            <Reveal inView once amount={0.2} direction="up" distance={34} scaleFrom={0.97} duration={0.75} w="100%" display="flex" justifyContent="center">
            <Box position="relative" w="100%" maxW="920px" borderRadius="2xl" overflow="hidden"
                 border={`1px solid ${sobreMesa ? AZUL : `${AZUL}44`}`}
                 boxShadow={sobreMesa ? `0 0 0 3px ${AZUL}, 0 0 34px ${AZUL}88, 0 0 70px ${AZUL}44` : glowPanel}
                 transition="box-shadow 0.18s, border-color 0.18s"
                 onDragOver={(e: React.DragEvent) => { e.preventDefault(); if (!sobreMesa) setSobreMesa(true); }}
                 onDragLeave={() => setSobreMesa(false)}
                 onDrop={soltarEnMesa}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Flex position="relative" zIndex={1} direction="column" align="center" gap={4}
                    px={{ base: 6, md: 9 }} py={{ base: 6, md: 8 }}>
                {/* Título del box */}
                <Flex align="center" gap={2.5}>
                  <RelacionIcon size={20} color={TINTA} opacity={0.9} />
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.03em"
                        style={{ textShadow: `0 1px 2px ${PAPEL}` }}>{t("metodo.psico.relacionEnCurso")}</Text>
                </Flex>
                <Box h="1px" w="60%" maxW="240px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

                {totalSel === 0 ? (
                  <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.85} textAlign="center"
                        style={{ textShadow: `0 1px 2px ${PAPEL}` }}>{t("metodo.psico.tocaParaReunirRelacion")}</Text>
                ) : chipsSeleccion}

                <Flex align="center" justify="center" gap={3} wrap="wrap">
                  <Box as="button" onClick={totalSel > 0 ? () => setNombreOpen(true) : undefined}
                       aria-disabled={totalSel === 0}
                       px={{ base: 6, md: 8 }} py={2.5} borderRadius="full"
                       bg={totalSel > 0 ? TINTA : `${TINTA}55`} border={`1.5px solid ${TINTA}`}
                       fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                       letterSpacing="0.04em" cursor={totalSel > 0 ? "pointer" : "not-allowed"} opacity={totalSel > 0 ? 1 : 0.7}
                       boxShadow={totalSel > 0 ? `0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a` : "none"} transition="all 0.18s"
                       _hover={totalSel > 0 ? { transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` } : {}}>
                    <Box as="span" color={neuropsicologiaBg} style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>{t("metodo.psico.heTerminadoRelacion")}</Box>
                  </Box>
                  <AutoguardadoIndicador estado={estadoGuardado} color={TINTA} />
                </Flex>
              </Flex>
            </Box>
            </Reveal>

            {/* ════════ SEPARADOR MANDALA + REJILLA DE RELACIONES ════════ */}
            {relaciones.length > 0 && (
              <Reveal inView once amount={0.2} direction="up" distance={34} scaleFrom={0.97} duration={0.75} w="100%">
              <>
                <MandalaDivider />
                <Flex ref={relacionesRef} direction="column" align="center" gap={4} w="100%" scrollMarginTop="90px">
                  <Text color={PAPEL} fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.04em"
                        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}>{t("metodo.psico.tusRelaciones")}</Text>
                  <RelacionGrid relaciones={relaciones} onBorrar={(id) => void borrarRelacion(id)} />
                </Flex>
              </>
              </Reveal>
            )}
            </>
            )}

          </Flex>
        </Flex>
      </Box>

      {/* ════════ POPUP · «Ponle nombre a tu relación» ════════ */}
      {nombreOpen && (
        <Box position="fixed" inset={0} zIndex={2400} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.82)"
             sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
             onClick={() => setNombreOpen(false)} fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="480px" my="auto"
               borderRadius="2xl" overflow="hidden" boxShadow={`0 30px 80px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 9 }} py={{ base: 9, md: 10 }} textAlign="center"
                 maxH={{ base: "calc(100vh - 64px)", md: "calc(100vh - 96px)" }} overflowY="auto">
              <Flex align="center" justify="center" gap={2.5} mb={4}>
                <RelacionIcon size={22} color={TINTA} opacity={0.9} />
                <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                      style={{ textShadow: `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}` }}>{t("metodo.psico.ponleNombreRelacion")}</Text>
              </Flex>

              {/* Raya horizontal de separación */}
              <Box h="1px" w="70%" maxW="240px" mx="auto" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

              {/* Lo que has seleccionado */}
              <Box my={6}>{chipsSeleccion}</Box>

              <Input
                autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && totalSel > 0) void guardarRelacion(); }}
                placeholder={t("metodo.psico.tituloRelacion")}
                bg="rgba(255,251,243,0.55)" border={`1px solid ${TINTA}44`} color={TINTA} borderRadius="xl"
                size="lg" textAlign="center" fontFamily="'EB Garamond', serif" fontSize={{ base: "lg", md: "xl" }}
                fontWeight="600" sx={{ caretColor: TINTA }}
                _placeholder={{ color: `${TINTA}66`, fontStyle: "italic", fontWeight: 400 }}
                _hover={{ borderColor: `${TINTA}66` }}
                _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.7)" }}
              />
              {/* La frase de la persona: su propia comprensión de la relación */}
              <Textarea value={texto} onChange={(e) => setTexto(e.target.value)}
                        placeholder={t("metodo.psico.queRelacion")}
                        mt={4} minH="88px" bg="rgba(255,251,243,0.55)" border={`1px solid ${TINTA}44`} color={TINTA}
                        borderRadius="xl" px={4} py={3} fontFamily="'EB Garamond', serif"
                        fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" sx={{ caretColor: TINTA }}
                        _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                        _hover={{ borderColor: `${TINTA}66` }}
                        _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.7)" }} />
              <Flex align="center" justify="center" gap={3} mt={8}>
                <Box as="button" onClick={() => setNombreOpen(false)} px={6} py={2.5} borderRadius="full"
                     bg="transparent" color={TINTA} border={`1.5px solid ${TINTA}66`} fontFamily="'EB Garamond', serif"
                     fontWeight="600" fontSize={{ base: "sm", md: "md" }} cursor="pointer" transition="all 0.18s"
                     _hover={{ bg: `${TINTA}14`, borderColor: TINTA }}>{t("metodo.psico.seguirEligiendo")}</Box>
                <Box as="button" onClick={() => void guardarRelacion()} px={8} py={2.5} borderRadius="full"
                     bg={TINTA} border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif" fontWeight="700"
                     fontSize={{ base: "sm", md: "md" }} letterSpacing="0.04em" cursor="pointer"
                     boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`} transition="all 0.18s"
                     _hover={{ transform: "translateY(-2px)", boxShadow: `0 4px 18px rgba(0,0,0,0.28), 0 0 22px ${TINTA}5a` }}>
                  <Box as="span" color={neuropsicologiaBg} style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>{t("metodo.psico.guardarRelacion")}</Box>
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>
      )}

      <SaberMasModal isOpen={!!saberMas} onClose={() => setSaberMas(null)}
                     cuerpo={saberMas?.cuerpo || null} signo={saberMas?.signo} casa={saberMas?.casa} facet={saberMas?.facet} />

      <AyudaRecorrido pagina="integracion" />

      <SiteFooter />
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Subcomponentes
// ─────────────────────────────────────────────────────────────────────────

function EstadoVacio({ texto, accion, onClick }: { texto: string; accion: string; onClick: () => void }) {
  return (
    <Flex direction="column" align="center" gap={3} px={4} py={8} w="100%">
      <Text color={PAPEL} fontStyle="italic" textAlign="center" opacity={0.92} fontSize="sm">{texto}</Text>
      <Box as="button" onClick={onClick} px={5} py={2} borderRadius="full" bg={PAPEL} color={TINTA}
           fontWeight="700" fontSize="sm" cursor="pointer">{accion}</Box>
    </Flex>
  );
}

// Herida: rectángulo sobrio, icono de herida a la izquierda. Tocar = seleccionar
// (se ilumina). Arrastrable.
function HeridaRect({ texto, activo, onTap, onDragStart, onDragEnd }: {
  texto: string; activo: boolean; onTap: () => void; onDragStart: () => void; onDragEnd: () => void;
}) {
  return (
    <Flex as="button" draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onTap}
          align="center" gap={3} px={4} py={3} borderRadius="lg" textAlign="left" w="100%"
          bg={TINTA} color={PAPEL}
          border={`1.5px solid ${activo ? PAPEL : `${PAPEL}33`}`}
          boxShadow={activo ? "0 8px 22px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4)" : "none"}
          cursor="pointer" transition="all 0.16s"
          _hover={{ boxShadow: activo ? "0 10px 26px rgba(0,0,0,0.55), 0 3px 10px rgba(0,0,0,0.45)" : "0 4px 14px rgba(0,0,0,0.3)" }}
          _active={{ cursor: "grabbing" }}>
      <HeridaIcon size={20} color={PAPEL} />
      <Text fontSize={{ base: "sm", md: "md" }} fontWeight="600" lineHeight="1.3">{texto}</Text>
      {activo && <Box as="span" color={PAPEL} fontWeight="700" flexShrink={0} ml="auto">✓</Box>}
    </Flex>
  );
}

// Tarjeta de UNA faceta del arquetipo (signo o casa). Fondo de estrellas, ojo propio
// (su propio popup), tocar = seleccionar (se ilumina en su color), arrastrable.
function MiniCard({ item, color, symbol, activo, onTap, onLeer, onDragStart, onDragEnd }: {
  item: ArqItem; color: string; symbol: string; activo: boolean;
  onTap: () => void; onLeer: () => void; onDragStart: () => void; onDragEnd: () => void;
}) {
  const t = useT();
  return (
    <Box position="relative" flex="1" minW={0} borderRadius="14px" overflow="hidden"
         border={`1.5px solid ${activo ? color : `${color}77`}`}
         boxShadow={activo
           ? `0 0 0 2px ${color}, 0 0 30px ${color}aa, 0 0 60px ${color}55, 0 10px 26px rgba(0,0,0,0.5)`
           : `0 0 18px ${color}55, 0 8px 22px rgba(0,0,0,0.45)`}
         transition="box-shadow 0.16s, border-color 0.16s">
      {/* Fondo: la misma imagen de astrología que la columna, a opacidad completa.
          Un velo muy suave mantiene legible la letra blanca sin tapar la imagen. */}
      <Box position="absolute" inset="0" zIndex={0} borderRadius="14px" overflow="hidden">
        <Box position="absolute" inset="0" bgImage="url('/img/astrologia/space.webp')" bgSize="cover" bgPosition="center" />
        <Box position="absolute" inset="0" bg="rgba(8,13,30,0.28)" />
      </Box>
      {/* Ojo: abre el popup de ESTA faceta */}
      <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onLeer(); }}
           position="absolute" top="6px" right="6px" zIndex={2} w="24px" h="24px" borderRadius="full"
           bg="rgba(0,0,0,0.5)" border={`1px solid ${color}66`} display="flex" alignItems="center" justifyContent="center"
           cursor="pointer" title={t("metodo.psico.leer")} _hover={{ bg: "rgba(0,0,0,0.78)", borderColor: color }}>
        <EyeIcon color={color} />
      </Box>

      <Flex as="button" draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onTap}
            position="relative" zIndex={1} direction="column" align="center" justify="center" gap={1.5}
            w="100%" px={2} py={4} minH={{ base: "108px", md: "118px" }}
            bg={activo ? `${color}26` : "transparent"} cursor="pointer"
            transition="background 0.16s" _hover={{ bg: activo ? `${color}33` : "rgba(255,255,255,0.06)" }}
            _active={{ cursor: "grabbing" }}>
        <Box sx={{ filter: `drop-shadow(0 0 9px ${color}cc)` }}>
          <Glifo symbol={symbol} color={color} size={34} />
        </Box>
        <Text color="#fff" fontWeight="700" fontSize={{ base: "xs", md: "sm" }} textAlign="center" lineHeight="1.2"
              style={{ textShadow: `0 0 10px ${color}aa` }}>
          {arquetipoLabel(item)}
        </Text>
      </Flex>
    </Box>
  );
}

function Chip({ icon, label, onRemove, tint }: {
  icon: React.ReactNode; label: string; onRemove: () => void; tint?: string;
}) {
  const t = useT();
  return (
    <Flex align="center" gap={1.5} pl={2.5} pr={1.5} py={1} borderRadius="full"
          bg={tint || `${TINTA}12`} color={TINTA} border={`1px solid ${TINTA}40`} boxShadow="none">
      {icon}
      <Text fontSize="xs" fontWeight="600" lineHeight="1.2">{label}</Text>
      <Box as="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onRemove(); }} w="18px" h="18px" borderRadius="full"
           bg={`${TINTA}1a`} display="flex" alignItems="center" justifyContent="center"
           fontSize="10px" cursor="pointer" flexShrink={0} _hover={{ opacity: 0.8 }} title={t("metodo.psico.quitar")}>✕</Box>
    </Flex>
  );
}
