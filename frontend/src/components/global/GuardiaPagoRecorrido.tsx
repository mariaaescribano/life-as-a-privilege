// GuardiaPagoRecorrido.tsx — nadie entra en una disciplina sin haberla pagado.
//
// El pago tiene que salir en /home, ANTES de meterse, nunca dentro de la
// disciplina. En /home los círculos ya lo hacen así, pero a una disciplina se
// llega también por otros caminos: la portada «El Recorrido», las
// presentaciones /d/, el botón «Continuar», el header, una URL pegada… Este
// guardia vigila TODAS las rutas /metodo/<disciplina>/… en un solo sitio: si
// esa disciplina no está pagada, devuelve a /home?entrar=<scope>, y Home abre
// ahí su box de pago.
//
// Mientras comprueba, tapa la página con la pantalla de carga de la casa: así
// no llega a verse la disciplina (ni su propio pago) antes de volver a /home.
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { API_URL } from "../../GlobalVariables";
import { LifeLoading } from "./LifeLoading";

/** Prefijo de ruta → scope de la disciplina (el de `<scope>_suscrito`). */
const SCOPE_POR_RUTA: [string, string][] = [
  ["/metodo/astrologia", "metodo"],
  ["/metodo/psicologia", "psicologia"],
  ["/metodo/ayurveda", "ayurveda"],
  ["/metodo/tcm", "tcm"],
  ["/metodo/fisiologia", "fisiologia"],
  ["/metodo/nutricion", "nutricion"],
  ["/metodo/cabala", "cabala"],
  ["/metodo/cultura", "cultura"],
];

function scopeDeRuta(pathname: string): string | null {
  const p = pathname.toLowerCase();
  const hit = SCOPE_POR_RUTA.find(([pre]) => p === pre || p.startsWith(`${pre}/`));
  return hit ? hit[1] : null;
}

// Lo que ya se sabe PAGADO en esta visita (y de qué cuenta). Solo se guarda el
// «sí»: un «no» se vuelve a preguntar siempre, porque puede que acabe de pagar.
let pagadas: { uid: string | null; scopes: Set<string> } = { uid: null, scopes: new Set() };

export function GuardiaPagoRecorrido() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const scope = scopeDeRuta(pathname);
  const [comprobando, setComprobando] = useState(false);

  useEffect(() => {
    if (!scope) { setComprobando(false); return; }
    let uid: string | null = null;
    try { uid = localStorage.getItem("userId"); } catch { /* modo privado */ }
    // Sin sesión: de eso ya se encargan las propias páginas (→ /welcome).
    if (!uid) { setComprobando(false); return; }
    if (pagadas.uid !== uid) pagadas = { uid, scopes: new Set() };
    if (pagadas.scopes.has(scope)) { setComprobando(false); return; }

    let vivo = true;
    setComprobando(true);
    axios
      .get(`${API_URL}/user/me`)
      .then(({ data }) => {
        for (const [k, v] of Object.entries(data ?? {})) {
          if (k.endsWith("_suscrito") && v === true) pagadas.scopes.add(k.slice(0, -"_suscrito".length));
        }
        if (!vivo) return;
        if (pagadas.scopes.has(scope)) setComprobando(false);
        else navigate(`/home?entrar=${scope}`, { replace: true });
      })
      // Sin red o servidor caído: no se bloquea. Las páginas siguen teniendo
      // su propia comprobación detrás.
      .catch(() => { if (vivo) setComprobando(false); });
    return () => { vivo = false; };
  }, [scope, navigate]);

  if (!comprobando) return null;
  return (
    <Box position="fixed" inset={0} zIndex={2000}>
      <LifeLoading variant="private" />
    </Box>
  );
}
