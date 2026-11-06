// ─────────────────────────────────────────────────────────────────────────
// «CREA TUS APUNTES» · ASTROLOGÍA — la pantalla.
//
// Dos cajas grandes, CERRADAS al entrar: TEORÍA DE ASTROLOGÍA y TU CARTA ASTRAL. Al abrir una salen
// sus grupos (Signos, Casas, Planetas, Aspectos), también plegados; y dentro de cada grupo, cada cosa
// que se puede llevar. Se marca un grupo entero (la casilla del grupo) o cosa por cosa. Todo es
// plegable. Abajo, «Cómo lo quieres» y la descarga: un PDF con el cielo de fondo y solo lo marcado.
//
// El generador (jsPDF + Garamond, ~700 KB) se pide al pulsar, no al entrar.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { Reveal, Pop } from "../global/Reveal";
import { focoBlanco } from "../global/foco";
import { API_URL } from "../../GlobalVariables";
import { PESO_FOTO_KB } from "../../utils/pdf/fotos";
import { itemsDe, type GrupoApunte, type SeccionApunte } from "../../utils/pdf/apuntesAstroTipos";
import { seccionTeoria, seccionCarta, type DatosCartaApuntes } from "./apuntes/astrologiaApuntesData";
import { useNombresAstro } from "./astrologiaNombres";
import type { CartaNatal } from "./CartaAstral3D/types";
import { useT } from "../../i18n";

type Progreso = { fase: "fotos" | "papel"; hechas: number; total: number } | null;
const ALMACEN = "apuntes:astrologia-v2";

const pesoAproximado = (nFotos: number) => {
  const kb = 380 + nFotos * PESO_FOTO_KB;
  return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(1)} MB`;
};

/** Casilla de tres estados: todo / parte / nada. */
function Casilla({ estado, txt, bg }: { estado: "todo" | "parte" | "nada"; txt: string; bg: string }) {
  return (
    <Flex flexShrink={0} w="22px" h="22px" borderRadius="md" align="center" justify="center"
          border={`1.5px solid ${txt}cc`} bg={estado === "nada" ? "transparent" : txt}>
      {estado === "todo" && (
        <Box as="svg" viewBox="0 -960 960 960" w="15px" h="15px" fill={bg}>
          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
        </Box>
      )}
      {estado === "parte" && <Box w="10px" h="2px" borderRadius="full" bg={bg} />}
    </Flex>
  );
}

function Chevron({ abierto, txt }: { abierto: boolean; txt: string }) {
  return (
    <Box as="svg" viewBox="0 -960 960 960" w="22px" h="22px" fill={txt} flexShrink={0}
         transition="transform 0.3s ease" transform={abierto ? "rotate(180deg)" : "none"}>
      <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
    </Box>
  );
}

export function ApuntesAstrologia({
  nom, txt, bg, glow,
}: {
  nom: string;
  txt: string;
  bg: string;
  glow?: string;
}) {
  const t = useT();
  const n = useNombresAstro();
  const [datos, setDatos] = useState<DatosCartaApuntes | null>(null);

  // Su carta y los textos que ya ha leído.
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const h = { headers: { Authorization: `Bearer ${token}` } };
    (async () => {
      try {
        const [fila, carta] = await Promise.all([
          axios.get<{ aspectos_texto?: Record<string, string> | null; casas_texto?: Record<string, string> | null } | null>(
            `${API_URL}/metodo-astrologia/${userId}`, h),
          axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`, h),
        ]);
        if (!carta.data) return;
        setDatos({
          carta: carta.data,
          casasTexto: (fila.data?.casas_texto ?? {}) as Record<string, string>,
          aspectosTexto: (fila.data?.aspectos_texto ?? {}) as Record<string, string>,
        });
      } catch { /* sin carta, solo se ofrece la teoría */ }
    })();
  }, []);

  const secciones: SeccionApunte[] = useMemo(() => {
    const out = [seccionTeoria(t("metodo.apuntes.astro.teoria"))];
    if (datos) {
      const c = seccionCarta(t("metodo.apuntes.astro.carta"), datos, n);
      if (c.grupos.length) out.push(c);
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datos, t]);

  const todos = useMemo(() => itemsDe(secciones), [secciones]);
  const clavesValidas = useMemo(() => new Set(todos.map((x) => x.item.key)), [todos]);

  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [conFotos, setConFotos] = useState(true);
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({});
  const [progreso, setProgreso] = useState<Progreso>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const vivo = useRef(true);

  useEffect(() => {
    vivo.current = true;
    return () => { vivo.current = false; };
  }, []);

  // Lo que marcó la última vez (en este navegador).
  const recuperado = useRef(false);
  useEffect(() => {
    if (recuperado.current) return;
    try {
      const crudo = localStorage.getItem(ALMACEN);
      if (crudo) {
        const g = JSON.parse(crudo) as { seleccion?: unknown; conFotos?: unknown };
        if (Array.isArray(g.seleccion)) setSeleccion(g.seleccion.filter((k): k is string => typeof k === "string"));
        if (typeof g.conFotos === "boolean") setConFotos(g.conFotos);
      }
    } catch { /* guardado corrupto: se empieza de cero */ }
    recuperado.current = true;
  }, []);
  useEffect(() => {
    if (!recuperado.current) return;
    try { localStorage.setItem(ALMACEN, JSON.stringify({ seleccion, conFotos })); } catch { /* modo privado */ }
  }, [seleccion, conFotos]);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  // Solo cuentan las marcas que existen ahora mismo (la carta puede no haber llegado aún).
  const marcadas = useMemo(() => seleccion.filter((k) => clavesValidas.has(k)), [seleccion, clavesValidas]);
  const nFotos = conFotos
    ? new Set(todos.filter((x) => marcadas.includes(x.item.key) && x.item.foto).map((x) => x.item.foto)).size
    : 0;
  const nada = marcadas.length === 0;
  const trabajando = progreso !== null;

  const alternarItem = (key: string) =>
    setSeleccion((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));
  const estadoGrupo = (g: GrupoApunte): "todo" | "parte" | "nada" => {
    const dentro = g.items.filter((i) => marcadas.includes(i.key)).length;
    return dentro === 0 ? "nada" : dentro === g.items.length ? "todo" : "parte";
  };
  const alternarGrupo = (g: GrupoApunte) => {
    const claves = g.items.map((i) => i.key);
    setSeleccion((s) => (estadoGrupo(g) === "todo" ? s.filter((k) => !claves.includes(k)) : Array.from(new Set([...s, ...claves]))));
  };
  const alternarAbierto = (k: string) => setAbiertos((a) => ({ ...a, [k]: !a[k] }));

  async function montar(): Promise<{ blob: Blob; nombre: string } | null> {
    setError(null);
    setProgreso({ fase: "fotos", hechas: 0, total: nFotos });
    try {
      const { generarApuntesAstro } = await import("../../utils/pdf/apuntesAstro");
      return await generarApuntesAstro(secciones, {
        seleccion: marcadas,
        conFotos,
        seguir: () => vivo.current,
        onProgress: (fase, hechas, total) => { if (vivo.current) setProgreso({ fase, hechas, total }); },
      });
    } catch {
      setError(t("metodo.apuntes.error"));
      return null;
    } finally {
      if (vivo.current) setProgreso(null);
    }
  }

  const descargar = async () => {
    const hecho = await montar();
    if (!hecho) return;
    const url = URL.createObjectURL(hecho.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = hecho.nombre;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };
  const previsualizar = async () => {
    const hecho = await montar();
    if (!hecho) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(hecho.blob));
  };

  const Caja = ({ children }: { children: React.ReactNode }) => (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={glow}>
      <DisciplinaBgLayer nom={nom} borderRadius="2xl" />
      <Box position="relative" zIndex={1}>{children}</Box>
    </Box>
  );

  return (
    <Flex direction="column" w="100%" gap={6}>

      {/* ── LAS DOS CAJAS GRANDES ─────────────────────────────────────── */}
      {secciones.map((s, si) => {
        const abierta = !!abiertos[s.key];
        const dentro = s.grupos.flatMap((g) => g.items).filter((i) => marcadas.includes(i.key)).length;
        return (
          <Reveal key={s.key} inView direction="up" distance={20} delay={si * 0.08} duration={0.6} amount={0.15} w="100%">
            <Caja>
              <Flex as="button" type="button" w="100%" align="center" justify="space-between" gap={4}
                    px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }} textAlign="left"
                    onClick={() => alternarAbierto(s.key)} aria-expanded={abierta} _focusVisible={focoBlanco}>
                <Text color={txt} fontSize={{ base: "lg", md: "2xl" }} fontWeight={700} letterSpacing="0.1em" textTransform="uppercase">
                  {s.titulo}
                </Text>
                <Flex align="center" gap={3} flexShrink={0}>
                  {dentro > 0 && (
                    <Text color={txt} fontSize="xs" fontWeight={700} letterSpacing="0.06em" px={2.5} py={0.5}
                          borderRadius="full" border={`1px solid ${txt}88`}>
                      {dentro}
                    </Text>
                  )}
                  <Chevron abierto={abierta} txt={txt} />
                </Flex>
              </Flex>

              <Collapse in={abierta} animateOpacity unmountOnExit>
                <Box px={{ base: 4, md: 8 }} pb={{ base: 5, md: 7 }}>
                  <Box h="1px" w="100%" mb={4} bg={`${txt}55`} />
                  <Flex direction="column" gap={3}>
                    {s.grupos.map((g) => {
                      const gAbierto = !!abiertos[g.key];
                      const est = estadoGrupo(g);
                      const marc = g.items.filter((i) => marcadas.includes(i.key)).length;
                      return (
                        <Box key={g.key} borderRadius="xl" border={`1px solid ${est === "nada" ? `${txt}44` : txt}`}
                             bg={est === "nada" ? "transparent" : `${txt}0d`} transition="all 0.2s">
                          <Flex align="center" gap={3.5} px={{ base: 3.5, md: 4 }} py={3}>
                            <Box as="button" type="button" onClick={() => alternarGrupo(g)} flexShrink={0}
                                 aria-label={g.titulo} aria-pressed={est === "todo"} _focusVisible={focoBlanco} borderRadius="md">
                              <Casilla estado={est} txt={txt} bg={bg} />
                            </Box>
                            <Flex as="button" type="button" flex="1" minW={0} align="center" justify="space-between" gap={3}
                                  textAlign="left" onClick={() => alternarAbierto(g.key)} aria-expanded={gAbierto}
                                  _focusVisible={focoBlanco} borderRadius="md">
                              <Text color={txt} fontSize={{ base: "md", md: "lg" }} fontWeight={700} letterSpacing="0.08em"
                                    textTransform="uppercase" noOfLines={1}>
                                {g.titulo}
                              </Text>
                              <Flex align="center" gap={3} flexShrink={0}>
                                <Text color={txt} fontSize="xs" opacity={0.75} letterSpacing="0.06em">{marc}/{g.items.length}</Text>
                                <Chevron abierto={gAbierto} txt={txt} />
                              </Flex>
                            </Flex>
                          </Flex>

                          <Collapse in={gAbierto} animateOpacity unmountOnExit>
                            <Flex direction="column" gap={2} px={{ base: 3, md: 4 }} pb={3.5}>
                              <Box h="1px" w="100%" mb={1} bg={`${txt}33`} />
                              {g.items.map((it) => {
                                const m = marcadas.includes(it.key);
                                return (
                                  <Flex key={it.key} as="button" type="button" w="100%" align="flex-start" gap={3.5}
                                        textAlign="left" px={3} py={2.5} borderRadius="lg"
                                        border={`1px solid ${m ? txt : `${txt}2e`}`} bg={m ? `${txt}14` : "transparent"}
                                        transition="all 0.18s" _hover={{ borderColor: txt, bg: `${txt}1a` }}
                                        onClick={() => alternarItem(it.key)} aria-pressed={m} _focusVisible={focoBlanco}>
                                    <Box mt={0.5}><Casilla estado={m ? "todo" : "nada"} txt={txt} bg={bg} /></Box>
                                    <Box flex="1" minW={0}>
                                      <Text color={txt} fontSize={{ base: "md", md: "lg" }} fontWeight={700} lineHeight="1.25">
                                        {it.titulo}
                                      </Text>
                                      {it.resumen && (
                                        <Text color={txt} fontSize={{ base: "sm", md: "md" }} opacity={0.82} lineHeight="1.45" mt={0.5}
                                              noOfLines={2}>
                                          {it.resumen}
                                        </Text>
                                      )}
                                    </Box>
                                  </Flex>
                                );
                              })}
                            </Flex>
                          </Collapse>
                        </Box>
                      );
                    })}
                  </Flex>
                </Box>
              </Collapse>
            </Caja>
          </Reveal>
        );
      })}

      {/* ── CÓMO LO QUIERES + DESCARGA ─────────────────────────────────── */}
      <Reveal inView direction="up" distance={22} delay={0.1} duration={0.65} amount={0.15} w="100%">
        <Caja>
          <Box px={{ base: 5, md: 8 }} py={{ base: 6, md: 7 }}>
            <Text color={txt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.1em" textTransform="uppercase" mb={3}>
              {t("metodo.apuntes.comoLoQuieres")}
            </Text>
            <Box h="1px" w="100%" mb={5} bg={`${txt}66`} />

            <Flex gap={2.5} wrap="wrap" mb={5}>
              {[
                { v: true, t: t("metodo.apuntes.conFotos"), d: t("metodo.apuntes.conFotosPie") },
                { v: false, t: t("metodo.apuntes.soloTexto"), d: t("metodo.apuntes.soloTextoPie") },
              ].map((op) => (
                <Flex key={String(op.v)} as="button" type="button" onClick={() => setConFotos(op.v)} direction="column" align="flex-start"
                      px={4} py={2.5} borderRadius="xl" border={`1px solid ${conFotos === op.v ? txt : `${txt}33`}`}
                      bg={conFotos === op.v ? `${txt}14` : "transparent"} transition="all 0.18s" _hover={{ borderColor: txt }}
                      _focusVisible={focoBlanco}>
                  <Text color={txt} fontSize={{ base: "sm", md: "md" }} fontWeight={700}>{op.t}</Text>
                  <Text color={txt} fontSize="xs" opacity={0.8}>{op.d}</Text>
                </Flex>
              ))}
            </Flex>

            <Text color={txt} fontSize={{ base: "sm", md: "md" }} opacity={0.9} mb={5}>
              {nada
                ? t("metodo.apuntes.sinMarcar")
                : `${marcadas.length} ${t(marcadas.length === 1 ? "metodo.apuntes.capitulo" : "metodo.apuntes.capitulos")}` +
                  ` · ${nFotos ? t("metodo.apuntes.nIlustraciones", { n: nFotos }) : t("metodo.apuntes.sinIlustraciones")}` +
                  ` · ${t("metodo.apuntes.unos", { peso: pesoAproximado(nFotos) })}`}
            </Text>

            {trabajando && (
              <Box mb={5}>
                <Text color={txt} fontSize="sm" mb={2}>
                  {t(progreso!.fase === "fotos" ? "metodo.apuntes.preparandoFotos" : "metodo.apuntes.componiendo",
                     { hechas: progreso!.hechas, total: progreso!.total })}
                </Text>
                <Box w="100%" h="4px" borderRadius="full" bg={`${txt}26`} overflow="hidden">
                  <Box h="100%" bg={txt} transition="width 0.25s ease"
                       w={`${progreso!.total ? Math.round((progreso!.hechas / progreso!.total) * 100) : 5}%`} />
                </Box>
              </Box>
            )}

            {error && <Text color={txt} fontSize="sm" fontStyle="italic" mb={4}>{error}</Text>}

            <Flex gap={3} wrap="wrap">
              <Pop levanta={nada || trabajando ? 0 : 3} hunde={nada || trabajando ? 1 : 0.96}>
                <Box as="button" type="button" onClick={descargar} disabled={nada || trabajando} px={7} py={3} borderRadius="xl"
                     bg={txt} color={bg} fontWeight={700} fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em"
                     opacity={nada || trabajando ? 0.5 : 1} cursor={nada || trabajando ? "default" : "pointer"}
                     transition="all 0.2s" _hover={nada || trabajando ? undefined : { transform: "translateY(-2px)" }}
                     _focusVisible={focoBlanco}>
                  {t("metodo.apuntes.descargar")}
                </Box>
              </Pop>
              <Pop levanta={nada || trabajando ? 0 : 3} hunde={nada || trabajando ? 1 : 0.96}>
                <Box as="button" type="button" onClick={previsualizar} disabled={nada || trabajando} px={6} py={3} borderRadius="xl"
                     border={`1.5px solid ${txt}`} color={txt} fontWeight={700} fontSize={{ base: "md", md: "lg" }}
                     opacity={nada || trabajando ? 0.5 : 1} cursor={nada || trabajando ? "default" : "pointer"}
                     transition="all 0.2s" _hover={nada || trabajando ? undefined : { bg: `${txt}1f` }} _focusVisible={focoBlanco}>
                  {t("metodo.apuntes.verlo")}
                </Box>
              </Pop>
            </Flex>
          </Box>
        </Caja>
      </Reveal>

      {/* ── EL VISOR ───────────────────────────────────────────────────── */}
      {previewUrl && (
        <Box position="fixed" inset={0} zIndex={2000} bg={`${bg}f2`} display="flex" flexDirection="column">
          <Flex align="center" justify="space-between" px={{ base: 4, md: 6 }} py={3} gap={3}>
            <Text color={txt} fontSize={{ base: "sm", md: "md" }} fontWeight={700} letterSpacing="0.08em" textTransform="uppercase" noOfLines={1}>
              {t("metodo.astro.paso.apuntes")}
            </Text>
            <Box as="button" type="button" onClick={() => { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }}
                 px={4} py={2} borderRadius="lg" border={`1px solid ${txt}88`} color={txt} fontSize="sm"
                 _hover={{ bg: `${txt}1f` }} _focusVisible={focoBlanco}>
              {t("metodo.apuntes.cerrar")}
            </Box>
          </Flex>
          <Box as="iframe" src={previewUrl} title="PDF" flex="1" w="100%" border="none" />
        </Box>
      )}
    </Flex>
  );
}
