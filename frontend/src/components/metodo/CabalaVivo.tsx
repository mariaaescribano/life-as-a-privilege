import React from "react";
import { PalabrasVivas } from "../global/PalabrasVivas";
import { LetrasVivas } from "../global/LetrasVivas";

// Texto de lectura de Cábala con la misma vida que el del cómic: las palabras
// se desvelan una a una (PalabrasVivas) y los títulos de caja letra a letra
// (LetrasVivas), cuando el bloque entra en pantalla. Vale igual en móvil y en
// ordenador: el disparo es por visibilidad, no por reloj.
//
// Si lo que llega no es un texto plano (JSX con negritas, enlaces…) se deja tal
// cual: trocearlo rompería su marcado.

/** Cuerpo de lectura: cascada de palabras acotada (≈0,9 s) sea cual sea el largo. */
export function Vivo({
  children,
  retraso = 0,
  total = 0.9,
}: {
  children: React.ReactNode;
  retraso?: number;
  total?: number;
}) {
  if (typeof children !== "string") return <>{children}</>;
  return <PalabrasVivas texto={children} retraso={retraso} total={total} duracion={1} />;
}

/** Título de caja: las letras suben y se encienden una tras otra, sin ola posterior. */
export function TituloVivo({ children }: { children: React.ReactNode }) {
  if (typeof children !== "string") return <>{children}</>;
  return <LetrasVivas texto={children} entrada onda={false} pasoEntrada={0.018} />;
}
