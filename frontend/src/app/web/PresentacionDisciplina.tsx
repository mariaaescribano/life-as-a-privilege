import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PresentacionGenerica from "./PresentacionGenerica";
import PresentacionAstrologia from "./PresentacionAstrologia";
import PresentacionPsicologia from "./PresentacionPsicologia";
import PresentacionAyurveda from "./PresentacionAyurveda";
import PresentacionTcm from "./PresentacionTcm";
import PresentacionFisiologia from "./PresentacionFisiologia";
import PresentacionNutricion from "./PresentacionNutricion";
import PresentacionCabala from "./PresentacionCabala";
import PresentacionCultura from "./PresentacionCultura";
import { presentacionPorKey } from "../../data/presentacionDisciplinas";

// ─────────────────────────────────────────────────────────────────────────────
// /d/:disciplina — página PÚBLICA de presentación, destino del QR de un cartel.
//
// Este archivo solo REPARTE: resuelve el slug y decide qué montaje se pinta.
// Cada disciplina puede tener su propia página (con su propio orden de bloques);
// las que todavía no la tienen usan la genérica. Las piezas comunes a todas
// viven en components/metodo/presentacionUi.tsx.
// ─────────────────────────────────────────────────────────────────────────────

/** Montajes propios por disciplina. El resto → PresentacionGenerica. */
const PAGINA_PROPIA: Record<string, typeof PresentacionAstrologia | undefined> = {
  astrologia: PresentacionAstrologia,
  psicologia: PresentacionPsicologia,
  ayurveda: PresentacionAyurveda,
  medicinachina: PresentacionTcm,
  fisiologia: PresentacionFisiologia,
  nutricion: PresentacionNutricion,
  cabala: PresentacionCabala,
  cultura: PresentacionCultura,
};

export default function PresentacionDisciplina() {
  const { disciplina } = useParams<{ disciplina: string }>();
  const navigate = useNavigate();
  const d = presentacionPorKey(disciplina);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [disciplina]);

  // Slug desconocido (cartel mal impreso, enlace escrito a mano): en vez de un
  // 404 seco, al Mapa completo, que es donde están las ocho.
  useEffect(() => {
    if (!d) navigate("/elMetodo", { replace: true });
  }, [d, navigate]);
  if (!d) return null;

  const Propia = PAGINA_PROPIA[d.key];
  // key={d.key}: al pasar de una disciplina a otra se remonta la página, así las
  // animaciones de entrada vuelven a dispararse en lugar de quedarse colocadas.
  return Propia ? <Propia key={d.key} d={d} /> : <PresentacionGenerica key={d.key} d={d} />;
}
