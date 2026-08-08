import React from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../i18n";

// ─────────────────────────────────────────────────────────────────────────
// Botón flotante «← Volver al Mapa».
//
// Los cursos se pueden abrir desde dos sitios: el Mapa (el recorrido, rutas
// /metodo/...) o la sección Aprendizaje. Cuando se entra a un curso DESDE el
// Mapa, guardamos en sessionStorage la URL del Mapa de origen; así, por mucho
// que el usuario navegue o lea dentro del curso, siempre puede volver justo a
// donde lo dejó. El botón solo aparece si ese origen está guardado.
//
// Va en sessionStorage a propósito (la sesión sí vive en localStorage): esto
// es una miga de pan de ESTA visita. Guardada de forma permanente, aparecería
// un «Volver al Mapa» apuntando a una página de hace semanas.
// ─────────────────────────────────────────────────────────────────────────

const KEY = "mapaReturnUrl";

/** Guarda la URL del Mapa de origen (solo si venimos de una ruta /metodo/...). */
export function recordarOrigenCurso(): void {
  try {
    const loc = window.location.pathname + window.location.search;
    if (window.location.pathname.startsWith("/metodo/")) {
      sessionStorage.setItem(KEY, loc);
    } else {
      // Se abrió desde Aprendizaje (u otro sitio): sin botón «Volver al Mapa».
      sessionStorage.removeItem(KEY);
    }
  } catch { /* sessionStorage no disponible: sin botón */ }
}

export function VolverAlMapa() {
  const navigate = useNavigate();
  const t = useT();
  let url: string | null = null;
  try { url = sessionStorage.getItem(KEY); } catch { url = null; }
  if (!url) return null;

  const volver = () => {
    try { sessionStorage.removeItem(KEY); } catch { /* noop */ }
    navigate(url!);
  };

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
      ← {t("comun.volverAlMapa")}
    </Box>
  );
}

export default VolverAlMapa;
