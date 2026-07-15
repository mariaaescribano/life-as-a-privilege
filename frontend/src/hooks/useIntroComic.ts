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
  // Respaldo local POR USUARIO: si el backend aún no persiste el flag (tabla del
  // recorrido sin crear, o GET que devuelve null al no existir la fila), este
  // flag garantiza que la intro NO se repita tras pulsar «Leído». Va por usuario
  // (no por dispositivo) para poder honrarlo también cuando el backend responde,
  // sin que se filtre entre cuentas distintas en el mismo navegador.
  const localKey = (userId: string) => `intro_visto_${endpointBase}_${userId}`;
  const vistoLocal = (userId: string) => {
    try { return !!localStorage.getItem(localKey(userId)); } catch { return false; }
  };

  const checkAndOpen = useCallback(async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    try {
      const res = await axios.get(`${API_URL}/${endpointBase}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // La BD manda, pero el flag local (por usuario) actúa de respaldo: si el
      // backend aún no persiste `intro_visto` (tabla sin crear → GET devuelve
      // null), no reabrimos el cómic si este usuario ya pulsó «Leído» aquí.
      if (!res.data?.intro_visto && !vistoLocal(userId)) setOpen(true);
    } catch {
      // Backend no disponible (p.ej. tabla aún no creada): usamos el flag local
      // como respaldo para que salga la 1ª vez y no se repita tras «Leído».
      if (!vistoLocal(userId)) setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpointBase]);

  const openNow = useCallback(() => setOpen(true), []);

  const finish = useCallback(async () => {
    setOpen(false);
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    // Marca local por usuario ANTES del PATCH: aunque el guardado en BD falle
    // (tabla sin crear), la intro ya no reaparecerá para este usuario aquí.
    if (userId) {
      try { localStorage.setItem(localKey(userId), "1"); } catch { /* sin almacenamiento */ }
    }
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
