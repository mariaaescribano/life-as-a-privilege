// ─────────────────────────────────────────────────────────────────────────
// «CREA TUS PROPIOS APUNTES» — la página, compartida por las ocho disciplinas.
//
// Cada disciplina aporta su LIBRO (utils/pdf/apuntes.ts: los capítulos y las
// portadas) y esta pantalla se encarga de lo demás: marcar lo que se lleva,
// elegir portada, verlo antes de bajarlo y descargarlo. Un solo sitio que
// arreglar cuando algo se vea torcido.
//
// Tres cosas pensadas a propósito:
//  · EL PESO SE VE ANTES. Junto a cada capítulo va su número de ilustraciones, y
//    abajo el total aproximado en MB. Nadie pulsa a ciegas para descubrir que se
//    ha bajado 40 MB al móvil.
//  · SE PUEDE VER ANTES DE BAJAR. El PDF se genera en el navegador, así que se
//    puede enseñar tal cual en un visor sin guardar nada.
//  · LO QUE MARCÓ SE RECUERDA. En este navegador (localStorage): la selección es
//    una preferencia de aquí y ahora, no un dato del recorrido.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { Reveal } from "../global/Reveal";
import {
  capitulosElegidos, fotosDeSeleccion, type ApuntesLibro,
} from "../../utils/pdf/apuntesTipos";
import { PESO_FOTO_KB } from "../../utils/pdf/fotos";

type Progreso = { fase: "fotos" | "papel"; hechas: number; total: number } | null;

const almacenKey = (libro: ApuntesLibro) => `apuntes:${libro.archivo}`;

/** Peso aproximado del PDF: las fotos mandan; el texto y el papel son fijos. */
const pesoAproximado = (nFotos: number) => {
  const kb = 380 + nFotos * PESO_FOTO_KB;
  return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(1)} MB`;
};

export function CreaTusApuntes({
  libro,
  nom,
  txt,
  bg,
  nombre,
  glow,
}: {
  libro: ApuntesLibro;
  /** `nom` de la disciplina, para el fondo de las cajas. */
  nom: string;
  /** Tinta de la disciplina (<disc>Txt): solo la letra DENTRO de las cajas. */
  txt: string;
  bg: string;
  /** Nombre de la persona, para la portada del PDF. */
  nombre?: string;
  /** Sombra/halo de las cajas de esta disciplina. */
  glow?: string;
}) {
  const disponibles = useMemo(() => libro.capitulos.filter((c) => !c.bloqueado), [libro]);

  const [seleccion, setSeleccion] = useState<string[]>(() =>
    disponibles.filter((c) => c.pordefecto).map((c) => c.key),
  );
  const [portada, setPortada] = useState<string>(libro.portadas[0]?.key ?? "");
  const [conFotos, setConFotos] = useState(true);
  const [progreso, setProgreso] = useState<Progreso>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // El generador tarda segundos: si la persona se va de la página a media
  // descarga, hay que parar en la foto siguiente en vez de seguir trabajando.
  const vivo = useRef(true);

  useEffect(() => {
    vivo.current = true;
    return () => { vivo.current = false; };
  }, []);

  // Lo que marcó la última vez, si sigue existiendo y disponible.
  useEffect(() => {
    try {
      const crudo = localStorage.getItem(almacenKey(libro));
      if (!crudo) return;
      const guardado = JSON.parse(crudo) as { seleccion?: unknown; portada?: unknown; conFotos?: unknown };
      if (Array.isArray(guardado.seleccion)) {
        const validas = guardado.seleccion.filter(
          (k): k is string => typeof k === "string" && disponibles.some((c) => c.key === k),
        );
        if (validas.length) setSeleccion(validas);
      }
      if (typeof guardado.portada === "string" && libro.portadas.some((p) => p.key === guardado.portada)) {
        setPortada(guardado.portada);
      }
      if (typeof guardado.conFotos === "boolean") setConFotos(guardado.conFotos);
    } catch { /* si el guardado está corrupto, se empieza de cero */ }
  }, [libro, disponibles]);

  useEffect(() => {
    try {
      localStorage.setItem(almacenKey(libro), JSON.stringify({ seleccion, portada, conFotos }));
    } catch { /* modo privado: no se recuerda y no pasa nada */ }
  }, [libro, seleccion, portada, conFotos]);

  // El blob del visor hay que soltarlo a mano o se queda en memoria.
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const elegidos = capitulosElegidos(libro, seleccion);
  const nFotos = conFotos ? fotosDeSeleccion(libro, seleccion).length : 0;
  const nada = elegidos.length === 0;
  const trabajando = progreso !== null;

  const alternar = (key: string) =>
    setSeleccion((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));
  const todos = () => setSeleccion(disponibles.map((c) => c.key));
  const ninguno = () => setSeleccion([]);

  async function montar(): Promise<{ blob: Blob; nombre: string } | null> {
    setError(null);
    setProgreso({ fase: "fotos", hechas: 0, total: nFotos });
    try {
      // El taller (jsPDF + la Garamond embebida) son unos 700 KB: se piden AQUÍ,
      // al pulsar, no al entrar en la página.
      const { generarApuntes } = await import("../../utils/pdf/apuntes");
      const hecho = await generarApuntes(libro, {
        seleccion,
        portada,
        nombre,
        conFotos,
        seguir: () => vivo.current,
        onProgress: (fase, hechas, total) => {
          if (vivo.current) setProgreso({ fase, hechas, total });
        },
      });
      return hecho;
    } catch {
      setError("No hemos podido montar el PDF. Vuelve a intentarlo; si sigue fallando, prueba sin ilustraciones.");
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
    // Un margen antes de soltarlo: si se revoca al instante, algún navegador se
    // queda sin el archivo a medio guardar.
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
      <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 6, md: 7 }}>
        {children}
      </Box>
    </Box>
  );

  const Rotulo = ({ children }: { children: React.ReactNode }) => (
    <Text color={txt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.1em"
          textTransform="uppercase" mb={3}>
      {children}
    </Text>
  );

  return (
    <Flex direction="column" w="100%" gap={7}>

      {/* ── LA PORTADA ─────────────────────────────────────────────────── */}
      <Reveal inView direction="up" distance={20} duration={0.6} amount={0.2} w="100%">
      <Caja>
        <Rotulo>La portada</Rotulo>
        <Box h="1px" w="100%" mb={5} bg={`${txt}66`} />
        <Flex gap={{ base: 3, md: 4 }} wrap="wrap">
          {libro.portadas.map((p) => {
            const elegida = p.key === portada;
            return (
              <Box
                key={p.key}
                as="button"
                onClick={() => setPortada(p.key)}
                w={{ base: "88px", md: "110px" }}
                borderRadius="lg"
                overflow="hidden"
                border={`2px solid ${elegida ? txt : `${txt}44`}`}
                opacity={elegida ? 1 : 0.72}
                transition="all 0.2s"
                _hover={{ opacity: 1, transform: "translateY(-2px)" }}
              >
                <Image src={encodeURI(p.src)} alt={p.label} w="100%" h={{ base: "88px", md: "110px" }}
                       objectFit="cover" loading="lazy" />
                <Text color={txt} fontSize="2xs" textAlign="center" py={1.5} noOfLines={1}>
                  {p.label}
                </Text>
              </Box>
            );
          })}
        </Flex>
      </Caja>
      </Reveal>

      {/* ── QUÉ TE LLEVAS ──────────────────────────────────────────────── */}
      <Reveal inView direction="up" distance={22} delay={0.08} duration={0.65} amount={0.15} w="100%">
      <Caja>
        <Flex align="center" justify="space-between" gap={3} wrap="wrap" mb={3}>
          <Text color={txt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.1em"
                textTransform="uppercase">
            Qué te llevas
          </Text>
          <Flex gap={2}>
            {[{ t: "Todo", f: todos }, { t: "Nada", f: ninguno }].map(({ t, f }) => (
              <Box key={t} as="button" onClick={f} px={3} py={1} borderRadius="full"
                   border={`1px solid ${txt}66`} color={txt} fontSize="xs" letterSpacing="0.08em"
                   _hover={{ borderColor: txt }}>
                {t}
              </Box>
            ))}
          </Flex>
        </Flex>
        <Box h="1px" w="100%" mb={4} bg={`${txt}66`} />

        <Flex direction="column" gap={2.5}>
          {libro.capitulos.map((c) => {
            const marcado = seleccion.includes(c.key);
            const bloqueado = !!c.bloqueado;
            return (
              <Flex
                key={c.key}
                as={bloqueado ? "div" : "button"}
                onClick={bloqueado ? undefined : () => alternar(c.key)}
                align="flex-start"
                gap={3.5}
                textAlign="left"
                px={{ base: 3.5, md: 4 }}
                py={3}
                borderRadius="xl"
                border={`1px solid ${marcado && !bloqueado ? txt : `${txt}33`}`}
                bg={marcado && !bloqueado ? `${txt}14` : "transparent"}
                opacity={bloqueado ? 0.55 : 1}
                cursor={bloqueado ? "default" : "pointer"}
                transition="all 0.18s"
                _hover={bloqueado ? undefined : { borderColor: txt, bg: `${txt}1f` }}
              >
                {/* La casilla: cuadrado con el tick de la disciplina (o candado). */}
                <Flex flexShrink={0} w="22px" h="22px" mt={0.5} borderRadius="md" align="center" justify="center"
                      border={`1.5px solid ${txt}${bloqueado ? "55" : "cc"}`}
                      bg={marcado && !bloqueado ? txt : "transparent"}>
                  {bloqueado ? (
                    <Box as="svg" viewBox="0 -960 960 960" w="13px" h="13px" fill={txt}>
                      <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
                    </Box>
                  ) : marcado ? (
                    <Box as="svg" viewBox="0 -960 960 960" w="15px" h="15px" fill={bg}>
                      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                    </Box>
                  ) : null}
                </Flex>

                <Box flex="1" minW={0}>
                  <Text color={txt} fontSize={{ base: "md", md: "lg" }} fontWeight={700} lineHeight="1.25">
                    {c.titulo}
                  </Text>
                  <Text color={txt} fontSize={{ base: "sm", md: "md" }} opacity={0.85} lineHeight="1.5" mt={0.5}>
                    {c.bloqueado ?? c.resumen}
                  </Text>
                </Box>

                {c.fotos.length > 0 && !bloqueado && (
                  <Text flexShrink={0} color={txt} fontSize="2xs" opacity={0.7} letterSpacing="0.06em"
                        textTransform="uppercase" mt={1.5}>
                    {c.fotos.length} {c.fotos.length === 1 ? "foto" : "fotos"}
                  </Text>
                )}
              </Flex>
            );
          })}
        </Flex>
      </Caja>
      </Reveal>

      {/* ── CÓMO LO QUIERES + DESCARGA ─────────────────────────────────── */}
      <Reveal inView direction="up" distance={22} delay={0.14} duration={0.65} amount={0.15} w="100%">
      <Caja>
        <Rotulo>Cómo lo quieres</Rotulo>
        <Box h="1px" w="100%" mb={5} bg={`${txt}66`} />

        <Flex gap={2.5} wrap="wrap" mb={5}>
          {[
            { v: true, t: "Con ilustraciones", d: "como se ve en la web" },
            { v: false, t: "Solo texto", d: "ligero para el móvil" },
          ].map((op) => (
            <Flex
              key={String(op.v)}
              as="button"
              onClick={() => setConFotos(op.v)}
              direction="column"
              align="flex-start"
              px={4}
              py={2.5}
              borderRadius="xl"
              border={`1px solid ${conFotos === op.v ? txt : `${txt}33`}`}
              bg={conFotos === op.v ? `${txt}14` : "transparent"}
              transition="all 0.18s"
              _hover={{ borderColor: txt }}
            >
              <Text color={txt} fontSize={{ base: "sm", md: "md" }} fontWeight={700}>{op.t}</Text>
              <Text color={txt} fontSize="xs" opacity={0.8}>{op.d}</Text>
            </Flex>
          ))}
        </Flex>

        <Text color={txt} fontSize={{ base: "sm", md: "md" }} opacity={0.9} mb={5}>
          {nada
            ? "No has marcado nada todavía: elige arriba lo que quieres llevarte."
            : `${elegidos.length} ${elegidos.length === 1 ? "capítulo" : "capítulos"}` +
              (nFotos ? ` · ${nFotos} ilustraciones` : " · sin ilustraciones") +
              ` · unos ${pesoAproximado(nFotos)}`}
        </Text>

        {/* Mientras trabaja: qué está haciendo y por dónde va. */}
        {trabajando && (
          <Box mb={5}>
            <Text color={txt} fontSize="sm" mb={2}>
              {progreso!.fase === "fotos"
                ? `Preparando las ilustraciones… ${progreso!.hechas}/${progreso!.total}`
                : `Componiendo el cuaderno… ${progreso!.hechas}/${progreso!.total}`}
            </Text>
            <Box w="100%" h="4px" borderRadius="full" bg={`${txt}26`} overflow="hidden">
              <Box
                h="100%"
                bg={txt}
                transition="width 0.25s ease"
                w={`${progreso!.total ? Math.round((progreso!.hechas / progreso!.total) * 100) : 5}%`}
              />
            </Box>
          </Box>
        )}

        {error && (
          <Text color={txt} fontSize="sm" fontStyle="italic" mb={4}>{error}</Text>
        )}

        <Flex gap={3} wrap="wrap">
          <Box
            as="button"
            onClick={descargar}
            disabled={nada || trabajando}
            px={7}
            py={3}
            borderRadius="xl"
            bg={txt}
            color={bg}
            fontWeight={700}
            fontSize={{ base: "md", md: "lg" }}
            letterSpacing="0.04em"
            opacity={nada || trabajando ? 0.5 : 1}
            cursor={nada || trabajando ? "default" : "pointer"}
            transition="all 0.2s"
            _hover={nada || trabajando ? undefined : { transform: "translateY(-2px)" }}
          >
            Descargar mis apuntes
          </Box>
          <Box
            as="button"
            onClick={previsualizar}
            disabled={nada || trabajando}
            px={6}
            py={3}
            borderRadius="xl"
            border={`1.5px solid ${txt}`}
            color={txt}
            fontWeight={700}
            fontSize={{ base: "md", md: "lg" }}
            opacity={nada || trabajando ? 0.5 : 1}
            cursor={nada || trabajando ? "default" : "pointer"}
            transition="all 0.2s"
            _hover={nada || trabajando ? undefined : { bg: `${txt}1f` }}
          >
            Verlo antes
          </Box>
        </Flex>
      </Caja>
      </Reveal>

      {/* ── EL VISOR ───────────────────────────────────────────────────── */}
      {previewUrl && (
        <Box position="fixed" inset={0} zIndex={2000} bg={`${bg}f2`} display="flex" flexDirection="column">
          <Flex align="center" justify="space-between" px={{ base: 4, md: 6 }} py={3} gap={3}>
            <Text color={txt} fontSize={{ base: "sm", md: "md" }} fontWeight={700} letterSpacing="0.08em"
                  textTransform="uppercase" noOfLines={1}>
              {libro.titulo}
            </Text>
            <Box as="button" onClick={() => { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }}
                 px={4} py={2} borderRadius="lg" border={`1px solid ${txt}88`} color={txt} fontSize="sm"
                 _hover={{ bg: `${txt}1f` }}>
              Cerrar
            </Box>
          </Flex>
          {/* El visor de PDF del propio navegador: ni librerías ni descargas. */}
          <Box as="iframe" src={previewUrl} title={libro.titulo} flex="1" w="100%" border="none" />
        </Box>
      )}
    </Flex>
  );
}
