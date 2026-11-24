import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { EsperaAstro } from "../../components/metodo/EsperaAstro";
import { API_URL, FONDO_PAGINA_BEIGE, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { olvidarPersona } from "../../api/persona";
import { recordarSoloLectura } from "../../api/sesion";
import { useT } from "../../i18n";

/**
 * /acceso?token=… — entrar con el botón del correo «Tu carta ya está lista». La cuenta «solo carta» no tiene
 * contraseña: ese enlace es su llave. Se canjea en el backend (`/user/lectura/entrar`); si vale, se guarda la
 * sesión igual que en /logIn y se va directo a su camino de Astrología. Si no vale, se dice que me escriba (el correo ya lo avisa).
 */
export default function AccesoLectura() {
  const t = useT();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [fallo, setFallo] = useState(!token);
  // El servidor gratuito se duerme: la primera petición puede tardar hasta un minuto en que despierte. Mientras no responda
  // (sin respuesta o 502/503/504) se vuelve a intentar sola cada pocos segundos; un 4xx sí es «enlace no válido».
  const [lento, setLento] = useState(false);

  useEffect(() => {
    if (!token) return;
    let vivo = true;
    const inicio = Date.now();
    const LIMITE = 3 * 60 * 1000;
    (async () => {
      while (vivo) {
        try {
          const { data } = await axios.post(`${API_URL}/user/lectura/entrar`, { token }, { timeout: 90000 });
          if (!vivo) return;
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("name", data.user.name);
          localStorage.setItem("token", data.token);
          localStorage.setItem("img", "/img/icono/noImg.webp");
          olvidarPersona(); // una entrada nueva nunca mira a otra persona
          try { localStorage.removeItem("isAdmin"); } catch { /* modo privado */ } // si el navegador era de María, entra como la persona, no como admin
          recordarSoloLectura(true);
          // Directo a SU Astrología (nunca pasa por /home): todo el recorrido está abierto para empezar por donde quiera.
          navigate("/camino/astrologia", { replace: true });
          return;
        } catch (e) {
          if (!vivo) return;
          const status = axios.isAxiosError(e) ? e.response?.status : undefined;
          const despertando = status === undefined || status === 502 || status === 503 || status === 504;
          if (!despertando) { setFallo(true); return; }
          if (Date.now() - inicio > LIMITE) { setLento(true); setFallo(true); return; }
          await new Promise((r) => setTimeout(r, 4000));
        }
      }
    })();
    return () => { vivo = false; };
  }, [token, navigate]);

  if (!fallo) return <EsperaAstro mensaje={t("auth.acceso.espera")} />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={FONDO_PAGINA_BEIGE} fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />
      <Flex flex="1" align="center" justify="center" px={{ base: 5, md: 10 }} py={16}>
        <Text color={T} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7" textAlign="center" maxW="560px">
          {t(lento ? "auth.acceso.lento" : "auth.acceso.invalido")}
        </Text>
      </Flex>
      <SiteFooter />
    </Box>
  );
}
