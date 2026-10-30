import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserMe } from "../api/userMe";

/**
 * Puerta del contenido premium: pregunta a /user/me SIN caché (puede que acabe de pagar) si el
 * acceso está vigente. Devuelve `true` cuando se puede pasar; si no, manda a /premium (que es
 * donde se paga) y devuelve `false`. Sin red o con el servidor caído tampoco se abre.
 */
export function usePremiumAcceso(): boolean {
  const navigate = useNavigate();
  const [pagado, setPagado] = useState(false);
  useEffect(() => {
    let vivo = true;
    getUserMe({ fresca: true })
      .then(({ data }) => {
        if (!vivo) return;
        if (data?.premium_suscrito === true) setPagado(true);
        else navigate("/premium", { replace: true });
      })
      .catch(() => { if (vivo) navigate("/premium", { replace: true }); });
    return () => { vivo = false; };
  }, [navigate]);
  return pagado;
}
