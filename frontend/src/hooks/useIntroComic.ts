import { useCallback, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";

// Estado + persistencia del cómic de intro de una disciplina. `endpointBase` es
// la ruta del recorrido en el backend, p.ej. "metodo-tcm" / "metodo-ayurveda" /
// "metodo-astrologia" (todas exponen GET/PATCH con el flag `intro_visto`).
//
//   · checkAndOpen(): hace GET y abre la intro si aún no se ha visto. Úsalo
//                     cuando la página ya sabe que el usuario tiene acceso.
//   · openNow():      abre la intro directamente (si la página ya conoce el flag).
//   · finish():       marca intro_visto=true (PATCH) y cierra. No volverá a salir.
//   · close():        cierra sin marcar (podrá reaparecer al reentrar).
export function useIntroComic(endpointBase: string) {
  const [open, setOpen] = useState(false);
  // Respaldo local: si el backend aún no tiene la tabla del recorrido (ALTER/CREATE
  // pendiente), el GET/PATCH fallan. Con este flag por dispositivo garantizamos
  // que la intro SÍ aparezca la primera vez y NO se repita tras pulsar «Leído».
  const localKey = `intro_visto_${endpointBase}`;
  const vistoLocal = () => {
    try { return !!localStorage.getItem(localKey); } catch { return false; }
  };

  const checkAndOpen = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    try {
      const res = await axios.get(`${API_URL}/${endpointBase}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Abrimos si ni la BD ni el flag local la dan por vista (así, aunque el
      // PATCH no llegara a persistir, no reaparece una vez marcada localmente).
      if (!res.data?.intro_visto && !vistoLocal()) setOpen(true);
    } catch {
      // Backend no disponible (p.ej. tabla aún no creada): usamos el flag local.
      if (!vistoLocal()) setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpointBase]);

  const openNow = useCallback(() => setOpen(true), []);

  const finish = useCallback(async () => {
    setOpen(false);
    try { localStorage.setItem(localKey, "1"); } catch { /* sin almacenamiento */ }
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    try {
      await axios.patch(
        `${API_URL}/${endpointBase}/${userId}`,
        { intro_visto: true },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch {
      // Si el guardado falla, el flag local ya evita que reaparezca en este equipo.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpointBase]);

  const close = useCallback(() => setOpen(false), []);

  return { open, checkAndOpen, openNow, finish, close };
}
