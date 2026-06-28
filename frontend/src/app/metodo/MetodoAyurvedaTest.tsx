import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import SpinnerTurquesa from "../../components/global/Spinner";
import AyurvedaTestPage from "../../components/espacio/components/AyurvedaTestPage";
import { API_URL } from "../../GlobalVariables";

// 1ª etapa del recorrido de Ayurveda: el test de los doshas. Reutiliza el
// componente del test (que ya guarda el resultado en la tabla `ayurveda` vía
// POST /ayurveda/resultado) y, al terminar, lleva a la página de resultado.
export default function MetodoAyurvedaTest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Solo accesible si ya se pagó Ayurveda; si no, de vuelta a la entrada
        // (que abre el pago). El prerrequisito de Psicología ya lo cubre la entrada.
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }
      } catch {
        navigate("/metodo/ayurveda");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <AyurvedaTestPage
      prevTo="/metodo/ayurveda"
      pageLabel="2/—"
      onComplete={async () => { navigate("/metodo/ayurveda/resultado"); }}
    />
  );
}
