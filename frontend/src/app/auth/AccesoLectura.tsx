import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { API_URL, FONDO_PAGINA_BEIGE, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { olvidarPersona } from "../../api/persona";
import { useT } from "../../i18n";

/**
 * /acceso?token=… — entrar con el botón del correo «Tu carta ya está lista». La cuenta «solo carta» no tiene
 * contraseña: ese enlace es su llave. Se canjea en el backend (`/user/lectura/entrar`); si vale, se guarda la
 * sesión igual que en /logIn y se va al Home. Si no vale, se dice que me escriba (el correo ya lo avisa).
 */
export default function AccesoLectura() {
  const t = useT();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [fallo, setFallo] = useState(!token);

  useEffect(() => {
    if (!token) return;
    let vivo = true;
    (async () => {
      try {
        const { data } = await axios.post(`${API_URL}/user/lectura/entrar`, { token });
        if (!vivo) return;
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("token", data.token);
        localStorage.setItem("img", "/img/icono/noImg.webp");
        olvidarPersona(); // una entrada nueva nunca mira a otra persona
        navigate("/home", { replace: true });
      } catch {
        if (vivo) setFallo(true);
      }
    })();
    return () => { vivo = false; };
  }, [token, navigate]);

  if (!fallo) return <LifeLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={FONDO_PAGINA_BEIGE} fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />
      <Flex flex="1" align="center" justify="center" px={{ base: 5, md: 10 }} py={16}>
        <Text color={T} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7" textAlign="center" maxW="560px">
          {t("auth.acceso.invalido")}
        </Text>
      </Flex>
      <SiteFooter />
    </Box>
  );
}
