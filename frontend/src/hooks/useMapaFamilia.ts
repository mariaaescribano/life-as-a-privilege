// ─────────────────────────────────────────────────────────────────────────
// useMapaFamilia · la lógica común de las dos páginas de la familia
// («Tu familia», paso 6, y «Genograma», paso 7): cargar el recorrido, la lista
// de personas, colocar a alguien nuevo, editarlo, quitarlo y guardar.
//
// Las dos páginas comparten la MISMA lista (data.genograma), así que la familia
// se compone una sola vez. El guardado es silencioso y con debounce, y siempre
// se puede forzar con `flushGuardado()` antes de navegar (si no, la página
// destino leería datos viejos).
// ─────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  nuevaPersonaId,
  personasGenograma,
  posicionLibreFamilia,
  type LineaDeVidaData,
  type PersonaGenograma,
} from "../components/metodo/psicologiaRecorrido";
import { API_URL } from "../GlobalVariables";

export type DirMapaFamilia = "arriba" | "abajo" | "izq" | "der";

export function useMapaFamilia(expId?: string) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [personas, setPersonas] = useState<PersonaGenograma[]>([]);
  const [miFoto, setMiFoto] = useState<string>("/img/icono/noImg.png");
  const dataRef = useRef<LineaDeVidaData>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<PersonaGenograma[] | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }
        // Su foto de perfil es el centro del mapa. Si aún no ha subido ninguna,
        // se queda el icono neutro (el mapa funciona igual).
        const foto = me.data?.img || localStorage.getItem("img");
        if (foto) setMiFoto(foto);

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: LineaDeVidaData = psi.data?.data || {};
        dataRef.current = d;
        setPersonas(personasGenograma(d));
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expId]);

  const persistir = async (next: PersonaGenograma[]) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    try {
      const nuevo = { ...dataRef.current, genograma: next };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data: nuevo },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = nuevo;
    } catch {
      // silencioso
    }
  };

  const commit = (next: PersonaGenograma[]) => {
    setPersonas(next);
    pendiente.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (pendiente.current) { void persistir(pendiente.current); pendiente.current = null; }
    }, 900);
  };

  const flushGuardado = () => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    if (pendiente.current) { void persistir(pendiente.current); pendiente.current = null; }
  };

  // Flush al desmontar (salir de la página sin pulsar nada).
  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (pendiente.current) void persistir(pendiente.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Coloca a alguien nuevo junto a la casilla (fila, col) y devuelve su id
   *  para que la página abra su popup al momento. */
  const añadir = (desdeFila: number, desdeCol: number, dir: DirMapaFamilia): string => {
    const pos = posicionLibreFamilia(personas, desdeFila, desdeCol, dir);
    const persona: PersonaGenograma = {
      id: nuevaPersonaId(),
      nombre: "",
      parentesco: "",
      fila: pos.fila,
      col: pos.col,
      simbolos: [],
      notas: {},
    };
    commit([...personas, persona]);
    return persona.id;
  };

  const actualizar = (id: string, campos: Partial<PersonaGenograma>) =>
    commit(personas.map((p) => (p.id === id ? { ...p, ...campos } : p)));

  const actualizarNota = (id: string, key: string, valor: string) =>
    commit(personas.map((p) => (p.id === id ? { ...p, notas: { ...(p.notas || {}), [key]: valor } } : p)));

  /** Quitar a alguien del mapa se guarda al instante (no es un cambio de texto
   *  que convenga agrupar: es una acción). */
  const eliminar = (id: string) => {
    const next = personas.filter((p) => p.id !== id);
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    pendiente.current = null;
    setPersonas(next);
    void persistir(next);
  };

  return { loading, personas, miFoto, añadir, actualizar, actualizarNota, eliminar, flushGuardado };
}
