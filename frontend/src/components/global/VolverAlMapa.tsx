import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useT } from "../../i18n";

// ─────────────────────────────────────────────────────────────────────────
// «← Volver al Mapa»: la miga de pan del recorrido.
//
// Los cursos (y el herbario, los alimentos…) se pueden abrir desde dos sitios:
// el Mapa (el recorrido, rutas /metodo/...) o la sección Materiales. Quien
// entra DESDE el Mapa se puede quedar leyendo un buen rato —una lección larga,
// varios módulos— y tiene que poder volver EXACTAMENTE al paso del que salió,
// sin tener que acordarse de por dónde iba ni empezar el recorrido de nuevo.
//
// Por eso la miga NO la pone cada botón que sale del Mapa (siempre se olvidaba
// alguno, y cada disciplina tiene los suyos): la guarda `MigaDelMapa`, que
// vive en App y apunta la última página /metodo/... pisada. Así vale para las
// ocho disciplinas y para cualquier puerta nueva que se abra mañana.
//
// Va en sessionStorage a propósito (la sesión sí vive en localStorage): esto
// es una miga de pan de ESTA visita. Guardada de forma permanente, aparecería
// un «Volver al Mapa» apuntando a una página de hace semanas.
// ─────────────────────────────────────────────────────────────────────────

const KEY = "mapaReturnUrl";

/** ¿Esta ruta es una página del Mapa (el recorrido de una disciplina)? */
export function esPaginaDelMapa(pathname: string): boolean {
  return pathname.toLowerCase().startsWith("/metodo/");
}

/** Apunta la página del Mapa en la que está el usuario. Se monta una sola vez
 *  (en App), así que ninguna disciplina puede olvidarse de dejar la miga. */
export function MigaDelMapa() {
  const location = useLocation();
  useEffect(() => {
    if (!esPaginaDelMapa(location.pathname)) return;
    try { sessionStorage.setItem(KEY, location.pathname + location.search); } catch { /* noop */ }
  }, [location.pathname, location.search]);
  return null;
}

/** Guarda la URL del Mapa de origen. Ya lo hace `MigaDelMapa` en cada página
 *  del recorrido; se conserva para los sitios que quieren dejarla en el mismo
 *  momento de saltar al curso (el modal de Cursos de Psicología, la tarjeta). */
export function recordarOrigenCurso(): void {
  try {
    if (esPaginaDelMapa(window.location.pathname)) {
      sessionStorage.setItem(KEY, window.location.pathname + window.location.search);
    }
  } catch { /* sessionStorage no disponible: sin botón */ }
}

/** La URL del Mapa de la que se salió, si en esta visita se estuvo dentro del
 *  recorrido. La usan el botón flotante y el botón del header, para que los
 *  dos devuelvan al MISMO sitio. */
export function origenCurso(): string | null {
  try { return sessionStorage.getItem(KEY); } catch { return null; }
}

/** Se gasta la miga de pan: ya se ha vuelto al Mapa. (Al pisar el recorrido,
 *  `MigaDelMapa` vuelve a ponerla al día ella sola.) */
export function olvidarOrigenCurso(): void {
  try { sessionStorage.removeItem(KEY); } catch { /* noop */ }
}

/**
 * El botón «← Volver al Mapa» listo para el header (MetodoStepHeader) de
 * cualquier página de Materiales.
 *
 * @param urlOverride destino explícito (el `?volver=` de la URL) que manda
 *        sobre la miga de pan. Si el destino no es del Mapa, el botón se
 *        llama solo «Volver».
 * @returns `boton` es `undefined` cuando no se viene del recorrido: entonces
 *          el header no pinta nada y la página se queda como estaba.
 */
export function useVolverAlMapa(urlOverride?: string | null) {
  const navigate = useNavigate();
  const t = useT();
  const url = urlOverride ?? origenCurso();

  const volver = () => {
    if (!url) return;
    olvidarOrigenCurso();
    navigate(url);
  };

  if (!url) return { url: null as string | null, volver, boton: undefined };

  return {
    url,
    volver,
    boton: {
      label: esPaginaDelMapa(url) ? t("comun.volverAlMapa") : t("comun.volver"),
      onClick: volver,
      arrow: "prev" as const,
      small: true,
    },
  };
}

/** Botón flotante abajo a la izquierda. Solo aparece si se viene del Mapa.
 *  @param url destino explícito; por defecto, la miga de pan. */
export function VolverAlMapa({ url: urlProp }: { url?: string | null } = {}) {
  const { url, volver, boton } = useVolverAlMapa(urlProp);
  if (!url || !boton) return null;

  return (
    <Box
      as="button"
      onClick={volver}
      position="fixed"
      left={{ base: 3, md: 5 }}
      bottom={{ base: 3, md: 5 }}
      zIndex={20}
      display="inline-flex"
      alignItems="center"
      gap={2}
      px={{ base: 4, md: 5 }}
      py={{ base: 2.5, md: 3 }}
      borderRadius="full"
      bg="rgba(0,0,0,0.72)"
      color="#ffffff"
      border="1px solid rgba(255,255,255,0.38)"
      fontFamily="'EB Garamond', serif"
      fontWeight={700}
      fontSize={{ base: "sm", md: "md" }}
      letterSpacing="0.04em"
      whiteSpace="nowrap"
      cursor="pointer"
      boxShadow="0 4px 18px rgba(0,0,0,0.45)"
      sx={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      transition="all 0.2s"
      _hover={{ bg: "rgba(0,0,0,0.85)", borderColor: "rgba(255,255,255,0.6)", transform: "translateY(-1px)" }}
    >
      ← {boton.label}
    </Box>
  );
}

export default VolverAlMapa;
