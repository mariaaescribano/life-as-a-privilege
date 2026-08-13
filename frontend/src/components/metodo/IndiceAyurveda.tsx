// Botón «Índice» del recorrido de AYURVEDA. Reutiliza IndiceRecorrido, pero con
// DOS SECCIONES, porque el recorrido tiene dos niveles:
//
//   · «El mapa de Ayurveda» — neutral. Ayurveda, Test, Resultado, Doṣhas,
//     Prāṇāyāma y Cursos: las páginas que no son de ningún doṣha en concreto.
//     Siempre abiertas.
//   · «Tu doṣha» — el submapa (Naturaleza → Tu mapa). Solo tiene sentido dentro
//     de un doṣha, así que FUERA de uno se enseña entero con candado y una nota
//     que dice por dónde entrar. Dentro, funciona como siempre: bloqueo
//     secuencial, acento del color del doṣha y el paso actual resaltado.
//
// Prāṇāyāma y Cursos siguen viviendo en una ruta con doṣha (herencia de cuando
// eran parte del submapa), así que necesitan uno para construir el enlace: se
// usa el de la URL y, si no lo hay, el doṣha principal del test. Sin test
// todavía, esos dos van con candado y el resto del mapa sigue funcionando.
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IndiceRecorrido, type SeccionIndice } from "./IndiceRecorrido";
import {
  ayurvedaMapa,
  ayurvedaDoshaIndice,
  AYURVEDA_DOSHA_TOTAL,
  pasoAlcanzableAyurveda,
} from "./ayurvedaRecorrido";
import {
  API_URL,
  ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";
import { useT } from "../../i18n";

const DOSHA_COLOR: Record<string, string> = {
  vata: vataColor,
  pitta: pittaColor,
  kapha: kaphaColor,
};

const DOSHA_LABEL: Record<string, string> = {
  vata: "Vata",
  pitta: "Pitta",
  kapha: "Kapha",
};

const esDosha = (d: unknown): d is string =>
  typeof d === "string" && d in DOSHA_COLOR;

export function IndiceAyurveda() {
  const t = useT();
  const { dosha } = useParams<{ dosha: string }>();
  const doshaUrl = esDosha(dosha) ? dosha : null;
  // Doṣha principal del test. Solo para poder enlazar Prāṇāyāma y Cursos desde
  // las páginas donde la URL no trae doṣha.
  const [principal, setPrincipal] = useState<string | null>(null);

  useEffect(() => {
    if (doshaUrl) return; // la URL ya dice de qué doṣha es este recorrido
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
        // Sin test todavía (o error): Prāṇāyāma y Cursos quedan con candado.
      }
    })();
    return () => { cancel = true; };
  }, [doshaUrl]);

  // Para las rutas del mapa que aún necesitan doṣha.
  const doshaEnlace = doshaUrl ?? principal;

  // Nivel 1 · el mapa. Prāṇāyāma (5) y Cursos (6) solo se pueden enlazar si hay
  // un doṣha del que colgarlos.
  const mapa: SeccionIndice = {
    titulo: t("metodo.ayur.elMapa"),
    pasos: ayurvedaMapa().map((p) =>
      p.n >= 5 && !doshaEnlace ? { ...p, bloqueado: true } : p,
    ),
    expId: doshaEnlace ?? "",
    libre: true,
  };

  // Nivel 2 · el submapa del doṣha. Sin doṣha en la URL, entero bloqueado.
  const submapa: SeccionIndice = {
    titulo: doshaUrl
      ? t("metodo.ayur.tuDosha", { dosha: DOSHA_LABEL[doshaUrl] })
      : t("metodo.ayur.recorridoDosha"),
    pasos: ayurvedaDoshaIndice(),
    expId: doshaUrl ?? "",
    habilitada: !!doshaUrl,
    nota: t("metodo.ayur.notaSubmapa"),
  };

  return (
    <IndiceRecorrido
      secciones={[mapa, submapa]}
      total={AYURVEDA_DOSHA_TOTAL}
      tinta={ayurvedaTxt}
      bg={ayurvedaBg}
      nom={ayurvedaNom}
      paramKey="dosha"
      // Fuera de un doṣha no hay submapa que resaltar; el `defaultExpId` solo
      // evita que las rutas se construyan con el valor por defecto de psicología.
      defaultExpId={doshaEnlace ?? ""}
      acento={doshaUrl ? DOSHA_COLOR[doshaUrl] : ayurvedaTxt}
      progresoKey="ayurveda"
      alcanzableUrl={(userId) => `${API_URL}/metodo-ayurveda/${userId}`}
      alcanzableDe={(data, d) => pasoAlcanzableAyurveda(data, d)}
    />
  );
}
