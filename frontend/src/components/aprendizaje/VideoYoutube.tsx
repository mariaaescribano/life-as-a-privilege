import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";
import { useIdioma, useT } from "../../i18n";
import { youtubeEmbedUrl, youtubeId } from "./youtube";

// Velocidades de la barra (las mismas de siempre).
const VELOCIDADES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const CLAVE = "videoSpeed";

// El player contesta desde uno de estos dos dominios, según el que lleve el
// src. Cualquier otro origen se ignora.
const ORIGENES = ["https://www.youtube-nocookie.com", "https://www.youtube.com"];

function velocidadGuardada(): number {
  const v = parseFloat(sessionStorage.getItem(CLAVE) ?? "1");
  return VELOCIDADES.includes(v) ? v : 1;
}

/**
 * Reproductor de YouTube de una lección de vídeo (el podcast del curso).
 *
 * Recibe lo que se pegó en el admin — un enlace o un ID — y se encarga de todo:
 * saca el ID, mantiene el 16:9 en cualquier pantalla y pone debajo la barra de
 * velocidad (0,5× a 2×). Los colores son los de la disciplina, como el resto de
 * las cajas del curso.
 */
export function VideoYoutube(props: {
  video?: string | null;
  titulo?: string;
  color: string;
  bgColor: string;
  /** Nombre de la disciplina: si tiene imagen de fondo propia, las cajas de
   *  aquí (la barra de velocidad) la llevan, como el resto del curso. */
  nom?: string;
  /** Texto opcional bajo el vídeo (de qué va el podcast). */
  descripcion?: string;
}) {
  const { video, titulo, color, bgColor, nom, descripcion } = props;
  const hasBg = !!nom && hasDisciplinaBg(nom);
  const { idioma } = useIdioma();
  const t = useT();
  const id = youtubeId(video);
  // enablejsapi: sin esto el iframe no acepta órdenes (y no habría velocidad).
  const src = id
    ? `${youtubeEmbedUrl(video, idioma)}&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
    : "";

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [velocidad, setVelocidad] = useState(velocidadGuardada);
  // La velocidad viva en un ref: el listener de mensajes se monta una vez y
  // necesita leer siempre la última sin volver a suscribirse.
  const velocidadRef = useRef(velocidad);
  velocidadRef.current = velocidad;

  const ordenar = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*",
    );
  }, []);

  // El player avisa cuando está listo y cada vez que arranca: ahí se le vuelve
  // a poner la velocidad elegida (YouTube la reinicia a 1× en cada carga).
  useEffect(() => {
    if (!id) return;
    const alOir = (e: MessageEvent) => {
      if (!ORIGENES.includes(e.origin)) return;
      try {
        const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (d?.event === "onReady" || (d?.event === "onStateChange" && d?.info === 1)) {
          ordenar("setPlaybackRate", [velocidadRef.current]);
        }
      } catch {
        // mensajes del player que no vienen en JSON: nada que hacer
      }
    };
    window.addEventListener("message", alOir);
    return () => window.removeEventListener("message", alOir);
  }, [id, ordenar]);

  const cambiarVelocidad = (v: number) => {
    setVelocidad(v);
    sessionStorage.setItem(CLAVE, String(v));
    ordenar("setPlaybackRate", [v]);
  };

  const GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${color}1a, 0 0 48px ${color}10`;
  const TEXT_GLOW = `0 1px 4px ${bgColor}, 0 0 10px ${bgColor}, 0 0 22px ${bgColor}`;

  if (!id) {
    return (
      <Box w="100%" position="relative" overflow="hidden" bg={hasBg ? "transparent" : bgColor}
           borderRadius="2xl" boxShadow={GLOW} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
        {hasBg && <DisciplinaBgLayer nom={nom!} borderRadius="2xl" />}
        <Text position="relative" zIndex={1} color={color} fontStyle="italic" textAlign="center" sx={{ textShadow: TEXT_GLOW }}>
          {t("leccion.videoNoDisponible")}
        </Text>
      </Box>
    );
  }

  return (
    <Box w="100%">
      {/* Marco del vídeo: 16:9 exacto, negro por detrás (así ni se ve el hueco
          mientras carga ni desentona si el vídeo trae bandas). */}
      <Box
        w="100%"
        position="relative"
        overflow="hidden"
        borderRadius="2xl"
        bg="#000"
        boxShadow={GLOW}
        border={`1px solid ${color}33`}
        sx={{ aspectRatio: "16 / 9" }}
      >
        <iframe
          key={id}
          ref={iframeRef}
          src={src}
          title={titulo || "YouTube"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          // Con esto el iframe empieza a mandar eventos (onReady, onStateChange).
          onLoad={() => iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening" }), "*")}
        />
      </Box>

      {/* ── Barra de velocidad ── la imagen de fondo de la disciplina (como
          cualquier caja del curso) y la letra en su color. */}
      <Box
        mt={{ base: 4, md: 5 }}
        mx="auto"
        w="fit-content"
        maxW="100%"
        position="relative"
        overflow="hidden"
        bg={hasBg ? "transparent" : bgColor}
        border={`1px solid ${color}55`}
        borderRadius="full"
        boxShadow={GLOW}
        px={{ base: 2.5, md: 3.5 }}
        py={{ base: "5px", md: "6px" }}
      >
        {hasBg && <DisciplinaBgLayer nom={nom!} borderRadius="full" />}
        <Flex
          position="relative"
          zIndex={1}
          justify="center"
          align="center"
          flexWrap="wrap"
          gap={{ base: 1, md: 1.5 }}
        >
        <Text
          color={color}
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="0.06em"
          ml={1}
          mr={{ base: 1, md: 2 }}
          sx={{ textShadow: TEXT_GLOW }}
        >
          {t("leccion.velocidad")}
        </Text>
        {VELOCIDADES.map((v) => {
          const activa = v === velocidad;
          return (
            <Box
              key={v}
              as="button"
              onClick={() => cambiarVelocidad(v)}
              px={{ base: "9px", md: "11px" }}
              py="4px"
              borderRadius="full"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight={activa ? 700 : 500}
              letterSpacing="0.04em"
              color={color}
              bg={activa ? `${color}38` : "transparent"}
              border={`1.5px solid ${activa ? color : "transparent"}`}
              cursor="pointer"
              transition="all 0.18s ease"
              sx={{ textShadow: TEXT_GLOW }}
              _hover={activa ? {} : { bg: `${color}1a` }}
              aria-label={`${v}x`}
            >
              {`${String(v).replace(".", ",")}×`}
            </Box>
          );
        })}
        </Flex>
      </Box>

      {/* Debajo, si se ha escrito: de qué va el episodio */}
      {descripcion && (
        <Text mt={{ base: 4, md: 5 }} color="white" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.6">
          {descripcion}
        </Text>
      )}
    </Box>
  );
}
