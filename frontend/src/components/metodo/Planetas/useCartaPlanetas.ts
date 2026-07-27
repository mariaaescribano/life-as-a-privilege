import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../GlobalVariables";
import { CUERPOS, soloClavesPlaneta, type Cuerpo, type CuerpoKey } from "../astrologiaData";

export interface Valor {
  signo?: string;
  casa?: number;
  profundizadoSigno?: boolean;
  profundizadoCasa?: boolean;
}

export type CartaData = Partial<Record<CuerpoKey, Valor>>;

export const valorOf = (carta: CartaData, key: CuerpoKey): Valor => carta[key] || {};

export function esCuerpoCompleto(c: Cuerpo, v: Valor): boolean {
  if (!v.signo) return false;
  if (!v.profundizadoSigno) return false;
  if (c.conCasa) {
    if (v.casa == null) return false;
    if (!v.profundizadoCasa) return false;
  }
  return true;
}

export function siguienteCuerpoIndex(carta: CartaData): number {
  for (let i = 0; i < CUERPOS.length; i++) {
    if (!esCuerpoCompleto(CUERPOS[i], valorOf(carta, CUERPOS[i].key))) return i;
  }
  return -1;
}

export function useCartaPlanetas() {
  const navigate = useNavigate();
  const [carta, setCarta] = useState<CartaData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingData = useRef<CartaData | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      navigate("/welcome");
      return;
    }

    (async () => {
      try {
        const res = await axios.get(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Accesible en cuanto hay solicitud enviada (la carta ya está calculada);
        // el PDF (link_carta) solo desbloquea el "siguiente", no el acceso.
        if (!res.data?.solicitud_enviada_at) {
          navigate("/metodo/astrologia", { replace: true });
          return;
        }
        // Cargamos SOLO las claves de planeta. El JSONB `data` también guarda
        // otras cosas (aspectos/casas leídos para el progreso); si las
        // arrastráramos, al reguardar podríamos pisar un valor más reciente.
        if (res.data?.data) setCarta(soloClavesPlaneta<Valor>(res.data.data));
      } catch {
        navigate("/metodo/astrologia", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const guardarEnBd = useCallback(async (data: CartaData) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    setSaving(true);
    try {
      await axios.patch(
        `${API_URL}/metodo-astrologia/${userId}`,
        { data },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch {
      // silencioso
    } finally {
      setSaving(false);
    }
  }, []);

  const actualizar = useCallback((key: CuerpoKey, campo: keyof Valor, valor: unknown) => {
    setCarta((prev) => {
      const next: CartaData = {
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          [campo]:
            campo === "casa"
              ? (valor ? Number(valor) : undefined)
              : campo === "signo"
              ? (valor || undefined)
              : !!valor,
        },
      };
      const entry = next[key];
      if (entry && !entry.signo && entry.casa == null && !entry.profundizadoSigno && !entry.profundizadoCasa) {
        delete next[key];
      }

      pendingData.current = next;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        if (pendingData.current) {
          void guardarEnBd(pendingData.current);
          pendingData.current = null;
        }
      }, 1500);

      return next;
    });
  }, [guardarEnBd]);

  // Flush pendiente al desmontar
  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (pendingData.current) {
        void guardarEnBd(pendingData.current);
        pendingData.current = null;
      }
    };
  }, [guardarEnBd]);

  const sigIdx = siguienteCuerpoIndex(carta);
  const todoCompletado = sigIdx === -1;

  return {
    carta,
    loading,
    saving,
    actualizar,
    siguienteCuerpoIndex: sigIdx,
    todoCompletado,
  };
}
