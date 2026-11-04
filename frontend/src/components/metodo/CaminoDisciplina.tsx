// ─────────────────────────────────────────────────────────────────────────────
// EL CAMINO de una disciplina: saca los pasos de su recorrido (los mismos que el
// botón «Índice»), les pone el candado que les toca y se los da a CaminoVista.
//
// Los candados salen de lo mismo que el Índice: en TODAS las disciplinas, el techo
// `pasoMax` que abre María (usePasoMax). En ayurveda solo vale para el submapa de
// su doṣha; el mapa común se abre por su propia regla.
//
// `userId` es de quién es el camino: sin él, la persona con la sesión abierta;
// con él, esa persona vista por María desde el panel (y entonces `admin` activa
// los controles para abrir pasos).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useIdioma, useT } from "../../i18n";
import { API_URL } from "../../GlobalVariables";
import { disciplinaByKey } from "../../data/adminDisciplinas";
import type { CaminoKey } from "../../data/camino";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { usePasoMax } from "../../hooks/usePasoMax";
import { flushSaves } from "../../utils/flushSaves";
import { CaminoVista, type ControlAdmin, type PasoCamino, type SeccionCamino } from "./CaminoVista";
import type { PasoRecorrido } from "./psicologiaRecorrido";
import { psicologiaIndice } from "./psicologiaRecorrido";
import { astrologiaIndice } from "./astrologiaRecorrido";
import { fisiologiaNiveles } from "./fisiologiaRecorrido";
import { nutricionIndice } from "./nutricionRecorrido";
import { tcmIndice } from "./tcmRecorrido";
import { ayurvedaMapa, ayurvedaDoshaIndice } from "./ayurvedaRecorrido";
import { useCabalaIndice } from "./useCabalaIndice";
import { HISTORIAS_CULTURA, tituloHistoria } from "./culturaHistorias";

/** Clave del camino (la de `<key>_suscrito`) → clave del panel de admin. */
const ADMIN_KEY: Record<CaminoKey, string> = {
  metodo: "astrologia", psicologia: "psicologia", fisiologia: "fisiologia", nutricion: "nutricion",
  ayurveda: "ayurveda", tcm: "tcm", cabala: "cabala", cultura: "cultura",
};

interface Props {
  clave: CaminoKey;
  /** De quién es el camino (solo cuando María lo mira desde el panel). */
  userId?: string;
  /** María: entra a donde quiera y, si el camino lo admite, abre pasos. */
  esAdmin?: boolean;
  /** Se avisa a la página de si aún se está leyendo el progreso. */
  onCargando?: (cargando: boolean) => void;
}

const aPasos = (lista: PasoRecorrido[], expId: string, cerrado: (p: PasoRecorrido) => boolean): PasoCamino[] =>
  lista.map((p) => ({ n: p.n, titulo: p.titulo, ruta: p.ruta(expId), bloqueado: cerrado(p) }));

interface DatosCamino {
  secciones: SeccionCamino[];
  cargando: boolean;
  /** Solo cuando María mira a una persona y el camino se abre con `pasoMax`. */
  control?: ControlAdmin;
}

/** Psicología, fisiología, nutrición y medicina china: todo va por el techo `pasoMax`. */
function usePorPasoMax(disciplina: string, userId: string | undefined, tramos: { titulo?: string; pasos: PasoRecorrido[] }[], expId = ""): DatosCamino {
  const { pasoMax, cargado, fijar } = usePasoMax(disciplina, userId);
  const total = tramos.reduce((a, t) => a + t.pasos.length, 0);
  return {
    secciones: tramos.map((t) => ({ titulo: t.titulo, pasos: aPasos(t.pasos, expId, (p) => p.n > pasoMax) })),
    cargando: !cargado,
    control: fijar ? { pasoMax, total, fijar, aplicaA: () => true } : undefined,
  };
}

/** Las Historias de Cultura como pasos (1…6, en su orden). */
const pasosCultura = (): PasoRecorrido[] =>
  Object.keys(HISTORIAS_CULTURA).map((k, i) => ({
    n: i + 1,
    titulo: tituloHistoria(k),
    ruta: () => `/metodo/cultura/historia/${k}`,
  } as PasoRecorrido));

function usarDatos(clave: CaminoKey, userId: string | undefined): DatosCamino {
  // Los hooks de abajo se llaman SIEMPRE (reglas de React); cada uno solo hace
  // algo si la disciplina es la suya (el resto recibe `null` y no pide nada).
  const t = useT();
  useIdioma();
  const astro = useAstrologiaProgreso(userId, clave === "metodo");
  const cabala = useCabalaIndice(userId, clave === "cabala");

  const esPsico = clave === "psicologia";
  const esFisio = clave === "fisiologia";
  const esNutri = clave === "nutricion";
  const esTcm = clave === "tcm";
  const esAyur = clave === "ayurveda";
  const esCultura = clave === "cultura";

  const psico = usePorPasoMax(esPsico ? "psicologia" : "", userId, esPsico ? [{ pasos: psicologiaIndice() }] : [], "linea-de-Vida");
  const fisio = usePorPasoMax(esFisio ? "fisiologia" : "", userId, esFisio ? fisiologiaNiveles().map((g) => ({ titulo: g.label, pasos: g.pasos })) : []);
  const nutri = usePorPasoMax(esNutri ? "nutricion" : "", userId, esNutri ? [{ pasos: nutricionIndice() }] : []);
  const tcm = usePorPasoMax(esTcm ? "tcm" : "", userId, esTcm ? [{ pasos: tcmIndice() }] : []);

  const cultura = usePorPasoMax(esCultura ? "cultura" : "", userId, esCultura ? [{ pasos: pasosCultura() }] : []);

  // Ayurveda: el mapa común (sin techo) y el submapa de su doṣha (con techo).
  const [dosha, setDosha] = useState<string | null>(null);
  const [doshaListo, setDoshaListo] = useState(!esAyur);
  const ayurPaso = usePasoMax(esAyur ? "ayurveda" : "", userId);
  useEffect(() => {
    if (!esAyur) return;
    const id = userId ?? localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!id || !token) { setDoshaListo(true); return; }
    let cancel = false;
    axios.get(`${API_URL}/ayurveda/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { const d = r.data?.dosha; if (!cancel && typeof d === "string" && d) setDosha(d); })
      .catch(() => { /* sin test todavía */ })
      .finally(() => { if (!cancel) setDoshaListo(true); });
    return () => { cancel = true; };
  }, [esAyur, userId]);

  switch (clave) {
    case "metodo":
      return {
        secciones: [{ pasos: aPasos(astrologiaIndice(), "", (p) => astro.bloqueada(p.n)) }],
        cargando: !astro.cargado,
        control: astro.fijar
          ? { pasoMax: astro.pasoMax, total: astrologiaIndice().length, fijar: astro.fijar, aplicaA: () => true }
          : undefined,
      };
    case "psicologia": return psico;
    case "fisiologia": return fisio;
    case "nutricion": return nutri;
    case "tcm": return tcm;
    case "ayurveda": {
      const mapa = ayurvedaMapa();
      const submapa = ayurvedaDoshaIndice();
      const total = submapa.length;
      return {
        secciones: [
          {
            titulo: t("metodo.ayur.elMapa"),
            pasos: aPasos(mapa, dosha ?? "", (p) => (p.n >= 5 && !dosha) || (p.n >= 3 && !dosha && doshaListo)),
          },
          {
            titulo: dosha ? dosha.charAt(0).toUpperCase() + dosha.slice(1) : "Tu doṣha",
            pasos: aPasos(submapa, dosha ?? "", (p) => !dosha || p.n > ayurPaso.pasoMax),
          },
        ],
        cargando: !ayurPaso.cargado || !doshaListo,
        control: ayurPaso.fijar
          ? { pasoMax: ayurPaso.pasoMax, total, fijar: ayurPaso.fijar, aplicaA: (_n, seccion) => seccion === 1 }
          : undefined,
      };
    }
    case "cabala":
      return {
        secciones: [{ pasos: cabala.indice.map((p) => ({ n: p.n, titulo: p.titulo, ruta: p.ruta(""), bloqueado: !!p.bloqueado })) }],
        cargando: !cabala.cargado,
        control: cabala.fijar
          ? { pasoMax: cabala.pasoMax, total: cabala.indice.length, fijar: cabala.fijar, aplicaA: () => true }
          : undefined,
      };
    case "cultura": return cultura;
  }
}

export default function CaminoDisciplina({ clave, userId, esAdmin = false, onCargando }: Props) {
  const navigate = useNavigate();
  const datos = usarDatos(clave, userId);
  const disc = disciplinaByKey(ADMIN_KEY[clave]);

  useEffect(() => { onCargando?.(datos.cargando); }, [datos.cargando, onCargando]);

  if (!disc) return null;

  const admin: ControlAdmin | null = esAdmin && datos.control ? datos.control : null;

  return (
    <CaminoVista
      nom={disc.nombre}
      bg={disc.bg}
      txt={disc.txt}
      secciones={datos.secciones}
      entraAunCerrado={esAdmin}
      admin={admin}
      onIr={async (ruta) => {
        // Espera a que acabe cualquier guardado en vuelo antes de saltar de página.
        await flushSaves();
        navigate(ruta);
      }}
    />
  );
}
