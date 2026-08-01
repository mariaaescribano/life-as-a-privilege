// Botón «Índice» del recorrido de CÁBALA. Muestra TODAS las páginas del mapa,
// numeradas y pulsables, resaltando la actual. Las páginas que aún no están
// desbloqueadas (según el progreso del usuario) salen con un candado y no son
// pulsables. Se coloca encima de «Mis notas», igual que el resto de disciplinas.
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { flushSaves } from "../../utils/flushSaves";
import { IndiceRecorrido } from "./IndiceRecorrido";
import type { PasoRecorrido } from "./psicologiaRecorrido";
import { CABALA_SEFIROT } from "./cabalaSefirot";
import { CABALA_ILUSTRACIONES_KEYS } from "./cabalaIlustraciones";
import { CABALA_SENDEROS, senderoCompleto, senderosContenidoCompleto } from "./cabalaSenderos";
import { sefiraDimensionCompleta, sefirotContenidoCompleto } from "./cabalaDiagnostico";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt } from "../../GlobalVariables";

export function IndiceCabala() {
  // Progreso guardado (null = aún cargando: no bloqueamos nada para no parpadear).
  const [data, setData] = useState<any>(null);
  const [releyendo, setReleyendo] = useState(false);

  // Releer el progreso de BD. Antes de leer, esperamos a que terminen los
  // guardados en vuelo de la página actual (flushSaves): si no, el índice leería
  // el progreso de ANTES de la última respuesta y enseñaría un candado de más.
  const cargar = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { setData({}); return; }
    await flushSaves();
    try {
      const res = await axios.get(`${API_URL}/metodo-cabala/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setData(res.data?.data ?? {});
    } catch {
      // Si falla, nos quedamos con lo que ya teníamos (mejor que re-bloquearlo todo).
      setData((prev: any) => prev ?? {});
    }
  }, []);

  useEffect(() => { void cargar(); }, [cargar]);

  // Cada vez que se ABRE el índice, se vuelve a leer: así lo que la usuaria
  // acaba de responder en esta misma página ya cuenta para los desbloqueos.
  const alAbrir = useCallback(() => {
    setReleyendo(true);
    void cargar().finally(() => setReleyendo(false));
  }, [cargar]);

  const cargado = data !== null;
  const d = data ?? {};
  const asSet = (arr: any): Set<string> => new Set(Array.isArray(arr) ? arr.map((x: any) => String(x)) : []);
  const ilus = asSet(d.ilustracionesVistas);
  const senderoIlus = asSet(d.senderoIlustracionesVistas);
  const diagnosticoVisto = !!d.diagnosticoVisto;
  // Suelo del índice: una página por la que YA se ha pasado no se vuelve a
  // cerrar, aunque su contenido esté a medias. Poder releer lo que ya has
  // andado no es saltarse el recorrido.
  const sefirotVistas = asSet(d.sefirotVistas);

  // Desbloqueos secuenciales del recorrido:
  const arbolIlusAll = CABALA_ILUSTRACIONES_KEYS.every((k) => ilus.has(k)); // vistas todas las ilustraciones del Árbol
  const senderoIlusAll = CABALA_SENDEROS.every((s) => senderoIlus.has(String(s.num))); // vistas todas las ilustraciones de senderos

  // Contenido relleno (no basta con haber "visitado"): los diagnósticos solo se
  // abren cuando el usuario ha rellenado su contenido — las sefirot (test /
  // autoevaluación) y los 22 tests de senderos.
  const sefirotContenidoOk = sefirotContenidoCompleto(d.test, d.autoeval);
  const senderosContenidoOk = senderosContenidoCompleto(d.senderos);

  // Bloqueo SECUENCIAL de las sefirot: cada sefirá se abre cuando se han visto
  // las ilustraciones del Árbol Y todas las sefirot ANTERIORES están rellenas
  // (autoevaluación + escala de equilibrio). No se puede saltar de una a otra sin
  // haber completado la anterior (mismo criterio que el botón «siguiente»).
  const sefiraUnlockedAt = (i: number): boolean =>
    arbolIlusAll && CABALA_SEFIROT.slice(0, i).every((s) => sefiraDimensionCompleta(s.key, d));
  // Diagnóstico se abre tras rellenar el contenido de todas las sefirot; Los
  // Senderos, sólo tras haber pasado por el Diagnóstico. Así el índice avanza
  // paso a paso.
  const diagnosticoUnlocked = sefirotContenidoOk;
  // «Los Senderos» exige haber rellenado todas las sefirot Y haber pasado por el
  // Diagnóstico. El recorrido es un camino: no se salta un paso.
  const senderosUnlocked = diagnosticoUnlocked && diagnosticoVisto;
  // El recorrido sendero a sendero (los 22, uno a uno) también es secuencial: se
  // abre tras ver TODAS las ilustraciones de los senderos, y cada sendero exige
  // que los anteriores tengan su test completo. Su diagnóstico, sólo cuando se
  // han rellenado los 22 tests.
  const senderosData = (d.senderos ?? {}) as Record<string, number[]>;
  const senderoUnlockedAt = (i: number): boolean =>
    senderoIlusAll && CABALA_SENDEROS.slice(0, i).every((s) =>
      senderoCompleto(s, senderosData[String(s.num)] ?? (senderosData as any)[s.num]));
  const senderosDiagUnlocked = senderosContenidoOk;
  const finalUnlocked = sefirotContenidoOk && senderosContenidoOk;
  const diasUnlocked = finalUnlocked;

  // Bloqueado solo si ya cargó el progreso y la condición no se cumple.
  const lock = (cond: boolean) => (cargado ? !cond : false);

  const PASOS: { titulo: string; path: string; bloqueado: boolean }[] = [
    { titulo: "Cábala", path: "/metodo/cabala", bloqueado: false },
    { titulo: "El Árbol de la Vida", path: "/metodo/cabala/arbol", bloqueado: false },
    ...CABALA_SEFIROT.map((s, i) => ({
      titulo: s.titulo,
      path: `/metodo/cabala/sefira/${s.key}`,
      bloqueado: lock(sefiraUnlockedAt(i) || sefirotVistas.has(s.key)),
    })),
    { titulo: "Diagnóstico", path: "/metodo/cabala/diagnostico", bloqueado: lock(diagnosticoUnlocked || diagnosticoVisto) },
    { titulo: "Los Senderos", path: "/metodo/cabala/senderos", bloqueado: lock(senderosUnlocked) },
    // Los 22 senderos, uno a uno: forman parte de la misma cuenta del índice
    // (no reinician la numeración), justo detrás de «Los Senderos».
    ...CABALA_SENDEROS.map((s, i) => ({
      titulo: `${s.letra} (${s.hebreo})`,
      path: `/metodo/cabala/sendero/${s.num}`,
      bloqueado: lock(senderoUnlockedAt(i)),
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
      onOpen={alAbrir}
      cargando={!cargado || releyendo}
    />
  );
}
