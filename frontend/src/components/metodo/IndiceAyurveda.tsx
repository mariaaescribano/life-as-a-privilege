// Botón «Índice» del recorrido de AYURVEDA. Reutiliza IndiceRecorrido con el
// índice y los colores de ayurveda. Como cada dosha (vata/pitta/kapha) tiene su
// propio recorrido, lee el dosha de la URL y le pasa SU color como acento, para
// que los botones del índice se diferencien por dosha. Añádelo en cada página
// del recorrido de ayurveda (junto a BotonCompania).
//
// En las páginas ANTERIORES a entrar en un dosha (la portada, el test, el
// resultado y las tarjetas) la URL todavía no trae dosha: ahí usamos el dosha
// PRINCIPAL de su test, para que desde el principio pueda saltar a cualquier
// paso (p.ej. directo a Prāṇāyāma) sin recorrer todo el submapa. Si aún no ha
// hecho el test no hay recorrido que indexar, así que el botón no se pinta.
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IndiceRecorrido } from "./IndiceRecorrido";
import { AYURVEDA_INDICE, AYURVEDA_TOTAL, pasoAlcanzableAyurveda } from "./ayurvedaRecorrido";
import {
  API_URL,
  ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";

const DOSHA_COLOR: Record<string, string> = {
  vata: vataColor,
  pitta: pittaColor,
  kapha: kaphaColor,
};

const esDosha = (d: unknown): d is string =>
  typeof d === "string" && d in DOSHA_COLOR;

export function IndiceAyurveda() {
  const { dosha } = useParams<{ dosha: string }>();
  // Dosha principal del test, solo para las páginas donde la URL no trae dosha.
  const [principal, setPrincipal] = useState<string | null>(null);

  useEffect(() => {
    if (esDosha(dosha)) return; // la URL ya dice de qué dosha es este recorrido
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    let cancel = false;
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/ayurveda/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = res.data?.dosha;
        if (!cancel && esDosha(d)) setPrincipal(d);
      } catch {
        // Sin test todavía (o error): no hay recorrido que indexar.
      }
    })();
    return () => { cancel = true; };
  }, [dosha]);

  const doshaActivo = esDosha(dosha) ? dosha : principal;
  // Antes del test no hay submapa: sin dosha, el índice no llevaría a ningún
  // sitio (sus rutas necesitan el dosha), así que no se pinta el botón.
  if (!doshaActivo) return null;

  return (
    <IndiceRecorrido
      indice={AYURVEDA_INDICE}
      total={AYURVEDA_TOTAL}
      tinta={ayurvedaTxt}
      bg={ayurvedaBg}
      nom={ayurvedaNom}
      paramKey="dosha"
      // En las páginas previas al dosha la URL no trae `dosha`: IndiceRecorrido
      // cae aquí para construir las rutas del índice.
      defaultExpId={doshaActivo}
      acento={DOSHA_COLOR[doshaActivo]}
      progresoKey="ayurveda"
      alcanzableUrl={(userId) => `${API_URL}/metodo-ayurveda/${userId}`}
      alcanzableDe={(data, dosha) => pasoAlcanzableAyurveda(data, dosha)}
    />
  );
}
