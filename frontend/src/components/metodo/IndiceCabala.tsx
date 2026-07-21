// Botón «Índice» del recorrido de CÁBALA. Muestra TODAS las páginas del mapa,
// numeradas y pulsables, resaltando la actual. Las páginas que aún no están
// desbloqueadas (según el progreso del usuario) salen con un candado y no son
// pulsables. Se coloca encima de «Mis notas», igual que el resto de disciplinas.
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IndiceRecorrido } from "./IndiceRecorrido";
import type { PasoRecorrido } from "./psicologiaRecorrido";
import { CABALA_SEFIROT } from "./cabalaSefirot";
import { CABALA_ILUSTRACIONES_KEYS } from "./cabalaIlustraciones";
import { CABALA_SENDEROS } from "./cabalaSenderos";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt } from "../../GlobalVariables";

export function IndiceCabala() {
  // Progreso guardado (null = aún cargando: no bloqueamos nada para no parpadear).
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { setData({}); return; }
    axios.get(`${API_URL}/metodo-cabala/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setData(res.data?.data ?? {}))
      .catch(() => setData({}));
  }, []);

  const cargado = data !== null;
  const d = data ?? {};
  const asSet = (arr: any): Set<string> => new Set(Array.isArray(arr) ? arr.map((x: any) => String(x)) : []);
  const ilus = asSet(d.ilustracionesVistas);
  const vistas = asSet(d.sefirotVistas);
  const senderoIlus = asSet(d.senderoIlustracionesVistas);
  const diagnosticoVisto = !!d.diagnosticoVisto;

  // Desbloqueos secuenciales del recorrido:
  const arbolIlusAll = CABALA_ILUSTRACIONES_KEYS.every((k) => ilus.has(k)); // vistas todas las ilustraciones del Árbol
  const sefirotVistasAll = CABALA_SEFIROT.every((s) => vistas.has(s.key));   // recorridas todas las sefirot
  const senderoIlusAll = CABALA_SENDEROS.every((s) => senderoIlus.has(String(s.num))); // vistas todas las ilustraciones de senderos

  const sefirotUnlocked = arbolIlusAll;
  // Diagnóstico se abre tras recorrer todas las sefirot; Los Senderos, sólo tras
  // haber pasado por el Diagnóstico. Así el índice avanza paso a paso.
  const diagnosticoUnlocked = sefirotVistasAll;
  const senderosUnlocked = diagnosticoUnlocked && diagnosticoVisto;
  // El recorrido sendero a sendero (los 22, uno a uno) y su diagnóstico se abren
  // cuando el usuario ha descubierto TODAS las ilustraciones de los senderos.
  const senderosRecorridoUnlocked = senderoIlusAll;
  const senderosDiagUnlocked = senderoIlusAll;
  const finalUnlocked = sefirotVistasAll && senderoIlusAll;
  const diasUnlocked = finalUnlocked;

  // Bloqueado solo si ya cargó el progreso y la condición no se cumple.
  const lock = (cond: boolean) => (cargado ? !cond : false);

  const PASOS: { titulo: string; path: string; bloqueado: boolean }[] = [
    { titulo: "Cábala", path: "/metodo/cabala", bloqueado: false },
    { titulo: "El Árbol de la Vida", path: "/metodo/cabala/arbol", bloqueado: false },
    ...CABALA_SEFIROT.map((s) => ({
      titulo: s.titulo,
      path: `/metodo/cabala/sefira/${s.key}`,
      bloqueado: lock(sefirotUnlocked),
    })),
    { titulo: "Diagnóstico", path: "/metodo/cabala/diagnostico", bloqueado: lock(diagnosticoUnlocked) },
    { titulo: "Los Senderos", path: "/metodo/cabala/senderos", bloqueado: lock(senderosUnlocked) },
    // Los 22 senderos, uno a uno: forman parte de la misma cuenta del índice
    // (no reinician la numeración), justo detrás de «Los Senderos».
    ...CABALA_SENDEROS.map((s) => ({
      titulo: `${s.letra} (${s.hebreo})`,
      path: `/metodo/cabala/sendero/${s.num}`,
      bloqueado: lock(senderosRecorridoUnlocked),
    })),
    { titulo: "Diagnóstico de senderos", path: "/metodo/cabala/senderos/diagnostico", bloqueado: lock(senderosDiagUnlocked) },
    { titulo: "Diagnóstico final", path: "/metodo/cabala/final", bloqueado: lock(finalUnlocked) },
    { titulo: "Trabajo de 10 días", path: "/metodo/cabala/dias", bloqueado: lock(diasUnlocked) },
  ];

  const indice: PasoRecorrido[] = PASOS.map((p, i) => ({
    n: i + 1,
    titulo: p.titulo,
    ruta: () => p.path,
    bloqueado: p.bloqueado,
  }));

  return (
    <IndiceRecorrido
      indice={indice}
      total={indice.length}
      tinta={cabalaTxt}
      bg={cabalaBg}
      nom={cabalaNom}
      luz={false}
    />
  );
}
