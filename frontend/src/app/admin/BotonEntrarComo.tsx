// ─────────────────────────────────────────────────────────────────────────────
// «Entrar como» — el botón que abre la web dentro de la cuenta de otra persona.
//
// Vive en un componente propio porque lo usan dos pantallas (/admin/usuarios y
// /admin/accesos) y lo que hace no es un `navigate`: cambia la sesión entera del
// navegador (api/suplantar.ts) y recarga en /home, que es donde empieza el mapa.
//
// Desde dentro se ve y se escribe igual que ella. Para volver, la barra de abajo
// a la derecha (BarraSuplantacion).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { entrarComo } from "../../api/suplantar";

interface Props {
  usuario: { id: string; name?: string | null };
  /** `pastilla` para las listas apretadas; `boton` para las fichas abiertas. */
  variante?: "pastilla" | "boton";
}

export default function BotonEntrarComo({ usuario, variante = "pastilla" }: Props) {
  const [entrando, setEntrando] = useState(false);
  const [error, setError] = useState(false);

  const pulsar = async (e: React.MouseEvent) => {
    // Estos botones viven DENTRO de filas que también son botones (abren la
    // ficha): sin esto, entrar como alguien abriría además su ficha debajo.
    e.stopPropagation();
    if (entrando) return;
    setEntrando(true);
    setError(false);
    try {
      await entrarComo(usuario.id);
      // Recarga entera a propósito: así no queda en memoria ni un dato de la
      // sesión anterior. `assign` y no `navigate` por lo mismo.
      window.location.assign("/home");
    } catch {
      setError(true);
      setEntrando(false);
    }
  };

  const grande = variante === "boton";

  return (
    <Box
      as="button"
      onClick={pulsar}
      title={`Ver la web como ${usuario.name || "esta persona"}`}
      px={grande ? 5 : 3}
      py={grande ? 2 : "3px"}
      borderRadius="full"
      whiteSpace="nowrap"
      bg={error ? "rgba(255,190,190,0.16)" : "rgba(240,198,116,0.14)"}
      border={`1.5px solid ${error ? "rgba(255,190,190,0.7)" : "rgba(240,198,116,0.7)"}`}
      color={error ? "rgba(255,205,205,0.95)" : "#f0c674"}
      fontWeight={grande ? "700" : "600"}
      fontSize={grande ? "sm" : "xs"}
      cursor={entrando ? "wait" : "pointer"}
      opacity={entrando ? 0.6 : 1}
      transition="all 0.18s"
      _hover={{ bg: entrando ? undefined : "rgba(240,198,116,0.28)", borderColor: "#f0c674" }}
    >
      {error ? "No se pudo entrar" : entrando ? "Entrando…" : "Entrar como"}
    </Box>
  );
}
