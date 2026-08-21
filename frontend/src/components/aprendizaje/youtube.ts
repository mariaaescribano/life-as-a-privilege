// ── YouTube: de un enlace pegado al ID del vídeo ────────────────────────────
// En el admin se pega el link tal cual sale de YouTube (Compartir, la barra del
// navegador, un Short, un directo…). Lo que se guarda en `curso.contenido` es
// ese texto sin tocar, y es aquí donde se saca el ID cada vez que hay que
// pintar el reproductor. Así siguen valiendo las lecciones antiguas, que
// guardaban solo el ID.

const ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Saca el ID de 11 caracteres de cualquier forma de enlace de YouTube
 * (o lo devuelve tal cual si ya era un ID). Si no reconoce nada, "".
 *
 *   https://www.youtube.com/watch?v=ID&t=90s
 *   https://youtu.be/ID?si=xxxx
 *   https://www.youtube.com/embed/ID   ·   /shorts/ID   ·   /live/ID   ·   /v/ID
 *   https://www.youtube.com/watch?app=desktop&v=ID
 *   ID
 */
export function youtubeId(entrada?: string | null): string {
  const bruto = (entrada ?? "").trim();
  if (!bruto) return "";
  if (ID.test(bruto)) return bruto;

  // Si pega el <iframe> entero, nos quedamos con el src.
  const iframe = bruto.match(/src\s*=\s*["']([^"']+)["']/i);
  const texto = iframe ? iframe[1] : bruto;

  try {
    const url = new URL(texto.startsWith("http") ? texto : `https://${texto}`);
    const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
    const esYt =
      host === "youtube.com" || host === "youtube-nocookie.com" || host === "youtu.be" ||
      host.endsWith(".youtube.com");
    if (!esYt) return "";

    // youtu.be/ID  →  el ID es el primer trozo de la ruta.
    const trozos = url.pathname.split("/").filter(Boolean);
    if (host === "youtu.be") return ID.test(trozos[0] ?? "") ? trozos[0] : "";

    // youtube.com/watch?v=ID
    const v = url.searchParams.get("v");
    if (v && ID.test(v)) return v;

    // youtube.com/embed|shorts|live|v/ID
    if (["embed", "shorts", "live", "v"].includes(trozos[0] ?? "")) {
      const cand = trozos[1] ?? "";
      if (ID.test(cand)) return cand;
    }
    return "";
  } catch {
    // No era una URL: último intento, buscar un ID suelto tras v=/be/ o similar.
    const m = texto.match(/(?:v=|\/(?:embed|shorts|live|v)\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : "";
  }
}

/** true si de ese texto sale un vídeo pintable. */
export function esVideoYoutube(entrada?: string | null): boolean {
  return youtubeId(entrada) !== "";
}

/** URL del reproductor embebido (dominio sin cookies, sin vídeos sugeridos de otros canales). */
export function youtubeEmbedUrl(entrada?: string | null, idioma = "es"): string {
  const id = youtubeId(entrada);
  if (!id) return "";
  const p = new URLSearchParams({
    rel: "0",              // al acabar, solo sugiere del mismo canal
    modestbranding: "1",
    playsinline: "1",
    hl: idioma,
    cc_lang_pref: idioma,
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${p.toString()}`;
}
