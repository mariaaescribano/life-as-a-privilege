// Los pasos del recorrido de CÁBALA con su candado. Los abre María: el techo
// `pasoMax` de la persona (clave `cabala`), igual que en el resto de disciplinas;
// ya no se abren solos al rellenar el paso anterior. Lo usan el botón «Índice»
// (IndiceCabala) y el camino de la disciplina (CaminoDisciplina), para que los dos
// digan siempre lo mismo.
//
// Sin `userIdProp` es la persona con la sesión abierta; con él, María en el camino
// de esa persona (y entonces hay `fijar`).
import { useCallback, useState } from "react";
import type { PasoRecorrido } from "./psicologiaRecorrido";
import { CABALA_SEFIROT } from "./cabalaSefirot";
import { CABALA_SENDEROS } from "./cabalaSenderos";
import { usePasoMax } from "../../hooks/usePasoMax";
import { useT } from "../../i18n";

/** Pasos del recorrido: Cábala + Árbol + las sefirot + Diagnóstico + Los Senderos + los 22 senderos + su diagnóstico + Final. */
export const CABALA_TOTAL = 2 + CABALA_SEFIROT.length + 2 + CABALA_SENDEROS.length + 2;

/** `activo` false = no pide nada (quien lo llama sin necesitarlo, para respetar las reglas de los hooks). */
export function useCabalaIndice(userIdProp?: string | null, activo = true) {
  // Los títulos del índice salen del diccionario: `useT` deja el componente
  // suscrito al idioma, así que al pulsar EN se vuelven a construir. Los nombres
  // de las sefirot y las letras hebreas NO se traducen: son los mismos en los
  // dos idiomas y salen del contenido español.
  const t = useT();
  const { pasoMax, cargado, recargar, fijar } = usePasoMax(activo ? "cabala" : null, userIdProp);
  const [releyendo, setReleyendo] = useState(false);

  // Cada vez que se ABRE el índice se vuelve a leer: María puede haber movido el techo.
  const alAbrir = useCallback(() => {
    setReleyendo(true);
    void recargar().finally(() => setReleyendo(false));
  }, [recargar]);

  const PASOS: { titulo: string; path: string }[] = [
    { titulo: t("disciplina.cabala"), path: "/metodo/cabala" },
    { titulo: t("metodo.cabala.paso.arbol"), path: "/metodo/cabala/arbol" },
    ...CABALA_SEFIROT.map((s) => ({ titulo: s.titulo, path: `/metodo/cabala/sefira/${s.key}` })),
    { titulo: t("metodo.cabala.paso.diagnostico"), path: "/metodo/cabala/diagnostico" },
    { titulo: t("metodo.cabala.paso.senderos"), path: "/metodo/cabala/senderos" },
    // Los 22 senderos, uno a uno: forman parte de la misma cuenta del índice
    // (no reinician la numeración), justo detrás de «Los Senderos».
    ...CABALA_SENDEROS.map((s) => ({ titulo: `${s.letra} (${s.hebreo})`, path: `/metodo/cabala/sendero/${s.num}` })),
    { titulo: t("metodo.cabala.paso.senderosDiag"), path: "/metodo/cabala/senderos/diagnostico" },
    { titulo: t("metodo.cabala.paso.final"), path: "/metodo/cabala/final" },
    // APARCADO · «10 días con tus dimensiones»: fuera del recorrido.
  ];

  // Mientras no ha cargado el techo NO se bloquea nada, para no parpadear.
  const indice: PasoRecorrido[] = PASOS.map((p, i) => ({
    n: i + 1,
    titulo: p.titulo,
    ruta: () => p.path,
    bloqueado: cargado && i + 1 > pasoMax,
  }));

  return { indice, cargado, releyendo, alAbrir, pasoMax, fijar };
}
