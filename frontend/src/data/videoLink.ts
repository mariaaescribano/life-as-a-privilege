// ── El enlace de un vídeo de la sección «Vídeos» ─────────────────────────────
//
// En /admin/videos se pega el enlace TAL CUAL sale de compartir, venga de donde
// venga: YouTube, TikTok o Instagram. Lo que se guarda en `video.url` es ese
// texto sin tocar; aquí se reconoce de quién es y se saca la dirección del
// reproductor para poder verlo DENTRO de la web (nunca mandamos a nadie fuera).
//
// Ojo con los enlaces cortos de TikTok (vm.tiktok.com/… , tiktok.com/t/…): son
// una redirección y el número del vídeo no está dentro, así que no se pueden
// incrustar. El admin avisa y basta con pegar el enlace largo (el de la barra
// del navegador, con /video/<número>).

export type ProveedorVideo = "youtube" | "tiktok" | "instagram" | "";

const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const TT_ID = /^\d{6,}$/;

/** El texto pegado, convertido en URL. "" si no había nada aprovechable. */
function comoUrl(entrada?: string | null): URL | null {
  const bruto = (entrada ?? "").trim();
  if (!bruto) return null;
  // Si pega el <iframe> o el <blockquote> entero, nos quedamos con el enlace.
  const src = bruto.match(/(?:src|cite)\s*=\s*["']([^"']+)["']/i);
  const texto = (src ? src[1] : bruto).trim();
  try {
    return new URL(texto.startsWith("http") ? texto : `https://${texto}`);
  } catch {
    return null;
  }
}

const host = (u: URL) => u.hostname.replace(/^www\./, "").replace(/^m\./, "");
const trozos = (u: URL) => u.pathname.split("/").filter(Boolean);

/** De quién es el enlace. "" si no lo reconocemos. */
export function proveedorVideo(url?: string | null): ProveedorVideo {
  const u = comoUrl(url);
  if (!u) return YT_ID.test((url ?? "").trim()) ? "youtube" : "";
  const h = host(u);
  if (h === "youtube.com" || h === "youtu.be" || h === "youtube-nocookie.com" || h.endsWith(".youtube.com")) return "youtube";
  if (h === "tiktok.com" || h.endsWith(".tiktok.com")) return "tiktok";
  if (h === "instagram.com" || h.endsWith(".instagram.com") || h === "instagr.am") return "instagram";
  return "";
}

/** Cómo se llama, para escribirlo en el admin. */
export function nombreProveedor(p: ProveedorVideo): string {
  return p === "youtube" ? "YouTube" : p === "tiktok" ? "TikTok" : p === "instagram" ? "Instagram" : "";
}

// ── YouTube ────────────────────────────────────────────────────────────────
/** El ID de 11 caracteres de un short/vídeo de YouTube (o "" si no sale). */
export function youtubeVideoId(url?: string | null): string {
  const bruto = (url ?? "").trim();
  if (YT_ID.test(bruto)) return bruto;
  const u = comoUrl(bruto);
  if (!u || proveedorVideo(bruto) !== "youtube") return "";
  const t = trozos(u);
  if (host(u) === "youtu.be") return YT_ID.test(t[0] ?? "") ? t[0] : "";
  const v = u.searchParams.get("v");
  if (v && YT_ID.test(v)) return v;
  if (["shorts", "embed", "live", "v"].includes(t[0] ?? "") && YT_ID.test(t[1] ?? "")) return t[1];
  return "";
}

// ── TikTok ─────────────────────────────────────────────────────────────────
/** El número del vídeo de TikTok. "" con los enlaces cortos (vm.tiktok.com). */
export function tiktokVideoId(url?: string | null): string {
  const u = comoUrl(url);
  if (!u || proveedorVideo(url) !== "tiktok") return "";
  const t = trozos(u);
  // /@usuaria/video/<id> · /video/<id> · /embed/v2/<id> · /player/v1/<id>
  const i = t.findIndex((x) => x === "video" || x === "embed" || x === "v1" || x === "v2" || x === "photo");
  const cand = i >= 0 ? t[i + 1] : "";
  if (TT_ID.test(cand ?? "")) return cand;
  const suelto = t.find((x) => TT_ID.test(x));
  return suelto ?? "";
}

// ── Instagram ──────────────────────────────────────────────────────────────
/** El código del reel/publicación, y de qué tipo es (reel o p). */
export function instagramCodigo(url?: string | null): { tipo: "reel" | "p" | "tv"; codigo: string } | null {
  const u = comoUrl(url);
  if (!u || proveedorVideo(url) !== "instagram") return null;
  const t = trozos(u);
  // /reel/<código>/ · /reels/<código>/ · /p/<código>/ · /tv/<código>/
  // y también /<usuaria>/reel/<código>/
  const i = t.findIndex((x) => ["reel", "reels", "p", "tv"].includes(x));
  if (i < 0) return null;
  const codigo = t[i + 1] ?? "";
  if (!/^[A-Za-z0-9_-]{5,}$/.test(codigo)) return null;
  const bruto = t[i];
  const tipo = bruto === "p" ? "p" : bruto === "tv" ? "tv" : "reel";
  return { tipo, codigo };
}

/**
 * La dirección del reproductor incrustado. "" si del enlace no sale un vídeo
 * pintable (entonces la página ofrece abrirlo en su red, y ya está).
 */
export function videoEmbedUrl(url?: string | null): string {
  switch (proveedorVideo(url)) {
    case "youtube": {
      const id = youtubeVideoId(url);
      return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1` : "";
    }
    case "tiktok": {
      const id = tiktokVideoId(url);
      // El reproductor oficial de TikTok. Sin la música ni la descripción
      // encima del vídeo: aquí el título ya lo pone la tarjeta.
      return id
        ? `https://www.tiktok.com/player/v1/${id}?autoplay=1&music_info=0&description=0&rel=0&native_context_menu=0`
        : "";
    }
    case "instagram": {
      const r = instagramCodigo(url);
      // El mismo `/embed` que usa el botón «Insertar» de Instagram. No admite
      // autoplay: se ve el fotograma y se pulsa para reproducir.
      return r ? `https://www.instagram.com/${r.tipo}/${r.codigo}/embed/` : "";
    }
    default:
      return "";
  }
}

/** Miniatura que da la propia red, cuando la da (solo YouTube). Si no, "". */
export function portadaDelProveedor(url?: string | null): string {
  const id = youtubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}
