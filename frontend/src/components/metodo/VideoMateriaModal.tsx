import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import { fisiologiaBg, fisiologiaTxt } from "../../GlobalVariables";
import { BotonCerrarDisciplina } from "./BotonCerrarDisciplina";
import { glowHeader } from "./FotoBox";
import { youtubeId } from "../aprendizaje/youtube";
import { useIdioma } from "../../i18n";
import { videoMateria, type VideoMateriaKey } from "../../hardCoded/espacio/VideosMateria";

// ─────────────────────────────────────────────────────────────────────────
// VideoMateriaModal · el reel de María que abre un paso de «La materia».
//
// Popup inmersivo a pantalla completa, como el ComicViewer: de fondo la foto de
// Fisiología a resolución completa (sin blur ni velo) sobre su color, y en medio
// el reel de YouTube, VERTICAL (9:16), con el halo de la casa. Cierra la X de la
// casa (o Escape o un clic fuera del reel).
//
// Si el vídeo aún no tiene enlace (VideosMateria.ts) NO se pinta nada.
//
// «Ya visto» se recuerda en este navegador (localStorage), no en la BD: cada
// página del recorrido reescribe el blob `data` entero y un flag guardado desde
// aquí se lo pisaría.
// ─────────────────────────────────────────────────────────────────────────
const FONDO = "/img/fondos/fisio.webp";
const claveVisto = (clave: string) =>
  `fisio-video-${localStorage.getItem("userId") ?? "anon"}-${clave}`;

/** ¿Este vídeo ya se vio (en este navegador)? `clave` = la del vídeo. */
export function videoYaVisto(clave: string): boolean {
  try { return localStorage.getItem(claveVisto(clave)) === "1"; } catch { return false; }
}
export function marcarVideoVisto(clave: string) {
  try { localStorage.setItem(claveVisto(clave), "1"); } catch { /* sin almacenamiento: volverá a salir */ }
}

/** El popup en sí, para cualquier reel de YouTube (`url` = enlace o ID).
 *  `onEnded` avisa cuando el vídeo llega al final. */
export function ReelInmersivo({ url, onClose, onEnded }: { url: string; onClose: () => void; onEnded?: () => void }) {
  const { idioma } = useIdioma();
  const id = youtubeId(url);
  const iframe = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // El player avisa por mensajes: estado 0 = terminado.
  useEffect(() => {
    if (!onEnded) return;
    const alOir = (e: MessageEvent) => {
      if (e.source !== iframe.current?.contentWindow) return;
      try {
        const d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (d?.event === "onStateChange" && d?.info === 0) onEnded();
      } catch { /* mensajes que no son JSON */ }
    };
    window.addEventListener("message", alOir);
    return () => window.removeEventListener("message", alOir);
  }, [onEnded]);

  if (!id) return null;
  const params = new URLSearchParams({
    autoplay: "1", rel: "0", modestbranding: "1", playsinline: "1", hl: idioma, cc_lang_pref: idioma,
    enablejsapi: "1", origin: window.location.origin,
  });

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={300}
      bg={fisiologiaBg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontFamily="'EB Garamond', serif"
      px={4}
      onClick={onClose}
    >
      <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none">
        <Box as="img" src={FONDO} alt="" loading="eager" position="absolute" inset={0} w="100%" h="100%"
             style={{ objectFit: "cover", objectPosition: "center" }} />
      </Box>

      <BotonCerrarDisciplina onClose={(e) => { e.stopPropagation(); onClose(); }} bg={fisiologiaBg} txt={fisiologiaTxt} zIndex={2} />

      <Box
        position="relative"
        zIndex={1}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        borderRadius="2xl"
        overflow="hidden"
        bg="#000"
        boxShadow={glowHeader(fisiologiaTxt)}
        h="min(86dvh, 780px)"
        maxW="92vw"
        sx={{ aspectRatio: "9 / 16" }}
      >
        <iframe
          ref={iframe}
          src={`https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`}
          title="YouTube"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => iframe.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening" }), "*")}
        />
      </Box>
    </Box>
  );
}

export function VideoMateriaModal({ videoKey, onClose }: { videoKey: VideoMateriaKey; onClose: () => void }) {
  return <ReelInmersivo url={videoMateria(videoKey).url} onClose={onClose} />;
}

/** Enchufe para una página del recorrido: `const video = useVideoMateria("atomo")`
 *  y `{video}` al final del render. Sale solo la primera vez y solo si ya hay
 *  enlace; al cerrarlo (X, Escape, clic fuera) se da por visto. */
export function useVideoMateria(videoKey: VideoMateriaKey): React.ReactNode {
  const hayVideo = youtubeId(videoMateria(videoKey).url) !== "";
  const [abierto, setAbierto] = useState(() => hayVideo && !videoYaVisto(videoKey));
  const cerrar = useCallback(() => { marcarVideoVisto(videoKey); setAbierto(false); }, [videoKey]);
  return abierto ? <VideoMateriaModal videoKey={videoKey} onClose={cerrar} /> : null;
}
