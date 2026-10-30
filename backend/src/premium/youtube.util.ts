const ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Saca el ID de 11 caracteres de cualquier enlace de YouTube (watch, youtu.be, shorts, embed,
 * live, con o sin parámetros, o el <iframe> entero) o lo devuelve tal cual si ya era un ID.
 * Si no es de YouTube, `null`. Es la misma lógica que `frontend/src/components/aprendizaje/youtube.ts`.
 */
export function youtubeId(entrada?: string | null): string | null {
  const bruto = (entrada ?? '').trim();
  if (!bruto) return null;
  if (ID.test(bruto)) return bruto;

  const iframe = bruto.match(/src\s*=\s*["']([^"']+)["']/i);
  const texto = iframe ? iframe[1] : bruto;
  try {
    const url = new URL(texto.startsWith('http') ? texto : `https://${texto}`);
    const host = url.hostname.replace(/^www\./, '').replace(/^m\./, '');
    const esYt =
      host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'youtu.be' || host.endsWith('.youtube.com');
    if (!esYt) return null;
    const trozos = url.pathname.split('/').filter(Boolean);
    if (host === 'youtu.be') return ID.test(trozos[0] ?? '') ? trozos[0] : null;
    const v = url.searchParams.get('v');
    if (v && ID.test(v)) return v;
    if (['embed', 'shorts', 'live', 'v'].includes(trozos[0] ?? '') && ID.test(trozos[1] ?? '')) return trozos[1];
    return null;
  } catch {
    return null;
  }
}
