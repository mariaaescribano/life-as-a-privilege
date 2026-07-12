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

  const checkAndOpen = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    try {
      const res = await axios.get(`${API_URL}/${endpointBase}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.data?.intro_visto) setOpen(true);
    } catch {
      // Si la consulta falla, no forzamos la intro.
    }
  }, [endpointBase]);

  const openNow = useCallback(() => setOpen(true), []);

  const finish = useCallback(async () => {
    setOpen(false);
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
      // Si el guardado falla, la intro reaparecerá la próxima vez (aceptable).
    }
  }, [endpointBase]);

  const close = useCallback(() => setOpen(false), []);

  return { open, checkAndOpen, openNow, finish, close };
}
