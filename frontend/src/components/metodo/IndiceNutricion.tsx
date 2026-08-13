// Botón «Índice» del recorrido de NUTRICIÓN. Muestra TODAS las páginas del
// recorrido, numeradas y pulsables, resaltando la actual. Se coloca encima de
// «Mis notas», igual que el índice del resto de disciplinas.
//
// Además refleja los BLOQUEOS naturales del recorrido: un paso sale con candado
// (y no es pulsable) hasta que se cumple su condición de progreso, leída del
// backend (metodo_nutricion.data):
//   · Nutrientes secundarios → hasta revisar todos los principales.
//   · Tus calorías y macros   → hasta crear el plato de Harvard.
//   · ¿Cómo va tu azúcar?     → hasta tener el cálculo de calorías (de ahí saca
//                               edad, peso y altura, para no volver a pedirlos).
//   · Diseña tu día           → hasta tener el cálculo de calorías.
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useT, type ClaveTexto } from "../../i18n";
import { IndiceRecorrido } from "./IndiceRecorrido";
import type { PasoRecorrido } from "./psicologiaRecorrido";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt } from "../../GlobalVariables";
import { NUTRIENTES_PRINCIPALES } from "../../hardCoded/espacio/NutrientesNutricion";

// Todas las páginas del recorrido de Nutrición, en orden. El nombre de cada
// paso NO se escribe aquí: se cita por su clave, la misma que usan los botones
// «← anterior / siguiente →» de cada página. Así el Índice y los botones nunca
// pueden decir cosas distintas.
const PASOS: { clave: ClaveTexto; path: string }[] = [
  { clave: "metodo.nutri.paso.nutricion",          path: "/metodo/nutricion" },
  { clave: "metodo.nutri.paso.nutrientes",         path: "/metodo/nutricion/nutrientes" },
  { clave: "metodo.nutri.paso.secundarios",        path: "/metodo/nutricion/nutrientes-secundarios" },
  { clave: "metodo.nutri.paso.microbiotaTitulo",   path: "/metodo/nutricion/microbiota" },
  { clave: "metodo.nutri.paso.hambre",             path: "/metodo/nutricion/hambre" },
  { clave: "metodo.nutri.paso.plato",              path: "/metodo/nutricion/plato" },
  { clave: "metodo.nutri.paso.caloriasTitulo",     path: "/metodo/nutricion/calorias" },
  { clave: "metodo.nutri.paso.prediabetes",        path: "/metodo/nutricion/prediabetes" },
  { clave: "metodo.nutri.paso.dia",                path: "/metodo/nutricion/dia" },
  { clave: "metodo.nutri.paso.macros",             path: "/metodo/nutricion/macros" },
  { clave: "metodo.nutri.paso.mitos",              path: "/metodo/nutricion/mitos" },
  { clave: "metodo.nutri.paso.origen",             path: "/metodo/nutricion/origen" },
  { clave: "metodo.nutri.paso.cursosProfundizar",  path: "/metodo/nutricion/cursos" },
];

export function IndiceNutricion() {
  const t = useT();
  // Empezamos pesimistas (todo lo condicionado, bloqueado) hasta leer el
  // progreso: así no se puede saltar por el índice en el instante de carga.
  const [flags, setFlags] = useState({ principales: false, plato: false, calorias: false });
  // true cuando ya se ha leído el progreso: hasta entonces el Índice muestra la
  // animación de espera de Nutrición en vez de la lista con los candados sin calcular.
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { setCargado(true); return; }
    let cancelado = false;
    (async () => {
      try {
        const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = r.data?.data ?? {};
        const explorados: string[] = Array.isArray(data.nutrientes_explorados) ? data.nutrientes_explorados : [];
        if (cancelado) return;
        setFlags({
          principales: NUTRIENTES_PRINCIPALES.every((x) => explorados.includes(x.key)),
          plato: !!data.plato_hecho,
          calorias: !!data.calorias?.hecho,
        });
      } catch { /* sin datos aún → lo condicionado queda bloqueado */ }
      finally { if (!cancelado) setCargado(true); }
    })();
    return () => { cancelado = true; };
  }, []);

  // Condición de bloqueo por ruta (las páginas no listadas van siempre abiertas).
  const bloqueoPorPath: Record<string, boolean> = {
    "/metodo/nutricion/nutrientes-secundarios": !flags.principales,
    "/metodo/nutricion/calorias": !flags.plato,
    // El test de azúcar necesita edad/peso/altura, que salen de las calorías.
    "/metodo/nutricion/prediabetes": !flags.calorias,
    "/metodo/nutricion/dia": !flags.calorias,
  };

  const indice: PasoRecorrido[] = PASOS.map((p, i) => ({
    n: i + 1,
    titulo: t(p.clave),
    ruta: () => p.path,
    bloqueado: bloqueoPorPath[p.path] ?? false,
  }));

  return (
    <IndiceRecorrido
      indice={indice}
      total={indice.length}
      tinta={nutricionTxt}
      bg={nutricionBg}
      nom={nutricionNom}
      luz={false}
      cargando={!cargado}
    />
  );
}
