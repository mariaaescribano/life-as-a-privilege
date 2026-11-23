import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";
import { API_URL } from "../GlobalVariables";
import { LifeLoading } from "../components/global/LifeLoading";

/**
 * La puerta de /antigua/*. Todo lo de dentro exige sesión Y que el servidor diga que el email está en ANTIGUA_EMAILS
 * (`antigua_email` en /user/me): no se decide en el navegador. Solo /logIn queda abierto (no hay registro).
 * Quien llega sin permiso sale a la web de siempre; su sesión (que es la misma de la web real) no se toca.
 */
export default function GuardiaAntigua({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const abierta = pathname === "/logIn";
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [estado, setEstado] = useState<"mirando" | "si" | "no">("mirando");

  useEffect(() => {
    if (abierta || !token) return;
    let vivo = true;
    axios
      .get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (vivo) setEstado(r.data?.antigua_email === true ? "si" : "no"); })
      .catch(() => { if (vivo) setEstado("no"); });
    return () => { vivo = false; };
  }, [abierta, token]);

  if (abierta) return <>{children}</>;
  if (!token) return <Navigate to="/logIn" replace />;
  if (estado === "mirando") return <LifeLoading />;
  if (estado === "no") {
    window.location.replace("/");
    return null;
  }
  return <>{children}</>;
}
