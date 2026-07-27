import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../GlobalVariables";

/** Verifica sesión + permiso admin. Redirige si no procede. */
export function useAdminGuard() {
  const navigate = useNavigate();
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.is_admin) {
          // Estar desbloqueado exige la contraseña de admin. Si el email SÍ es de
          // admin pero aún no la ha introducido, lo mandamos a desbloquear; si no
          // es admin, fuera al home.
          sessionStorage.removeItem("isAdmin");
          navigate(me.data?.admin_email ? "/admin/login" : "/home");
          return;
        }
      } catch {
        navigate("/home");
        return;
      } finally {
        setVerificando(false);
      }
    })();
  }, [navigate]);

  return { verificando };
}

export const adminHeaders = () => ({
  Authorization: `Bearer ${sessionStorage.getItem("token") ?? ""}`,
});
