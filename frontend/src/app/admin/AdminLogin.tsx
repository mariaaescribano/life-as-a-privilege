import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { API_URL } from "../../GlobalVariables";

// Pantalla de desbloqueo del panel de administración. Estar en ADMIN_EMAILS ya
// NO basta: además hay que introducir la contraseña de admin (ADMIN_PASSWORD en
// el backend). Al acertarla, el backend devuelve un token NUEVO con el permiso
// de admin activado, que reemplaza al de la sesión.
export default function AdminLogin() {
  const navigate = useNavigate();
  const [verificando, setVerificando] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const token = localStorage.getItem("token") ?? "";

  // Al entrar: si no está logueado → welcome; si el email NO es de admin → home;
  // si ya está desbloqueado → directo al panel.
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (me.data?.is_admin) { navigate("/admin"); return; }
        if (!me.data?.admin_email) { navigate("/home"); return; }
      } catch {
        navigate("/home");
        return;
      } finally {
        setVerificando(false);
      }
    })();
  }, [navigate, token]);

  const desbloquear = async () => {
    if (!password.trim() || enviando) return;
    setError("");
    setEnviando(true);
    try {
      const res = await axios.post(
        `${API_URL}/user/admin/verify`,
        { password: password.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data?.token) {
        // El nuevo token lleva el permiso de admin: reemplaza al de la sesión.
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("isAdmin", "1");
        navigate("/admin");
        return;
      }
      setError("No se pudo desbloquear. Inténtalo de nuevo.");
      setEnviando(false);
    } catch {
      setError("Contraseña de administración incorrecta.");
      setPassword("");
      setEnviando(false);
    }
  };

  if (verificando) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" align="center" justify="center" px={5} py={{ base: 12, md: 16 }}>
        <Flex
          direction="column"
          align="center"
          textAlign="center"
          w={{ base: "100%", sm: "440px" }}
          bg="rgba(255,255,255,0.06)"
          borderRadius="30px"
          border="1.5px solid rgba(255,255,255,0.35)"
          boxShadow="0 0 30px rgba(255,255,255,0.14), 0 24px 70px rgba(0,0,0,0.35)"
          sx={{ backdropFilter: "blur(10px)" }}
          px={{ base: 9, md: 12 }}
          py={{ base: 12, md: 14 }}
          gap={6}
        >
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            letterSpacing="0.06em"
            textTransform="uppercase"
            textShadow="0 0 16px rgba(255,255,255,0.5), 0 0 34px rgba(180,255,245,0.3)"
          >
            Acceso a administración
          </Text>

          <Box w="70%" h="1px" bgGradient="linear(to-r, transparent, rgba(255,255,255,0.6), transparent)" />

          <Text color="rgba(255,255,255,0.82)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" fontStyle="italic">
            Introduce la contraseña de administración para entrar al panel.
          </Text>

          <Box w="100%">
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") desbloquear(); }}
              placeholder="Contraseña de administración"
              autoComplete="off"
              autoFocus
              textAlign="center"
              color="white"
              bg="rgba(0,0,0,0.22)"
              border="1px solid rgba(255,255,255,0.32)"
              borderRadius="full"
              h="52px"
              fontSize="md"
              _placeholder={{ color: "rgba(255,255,255,0.55)" }}
              _hover={{ borderColor: "rgba(255,255,255,0.5)" }}
              _focus={{ borderColor: "white", boxShadow: "0 0 0 1px rgba(255,255,255,0.6)" }}
            />
          </Box>

          {error && (
            <Text color="#ffbdbd" fontSize="sm" fontStyle="italic" textShadow="0 0 8px rgba(255,140,140,0.4)">
              {error}
            </Text>
          )}

          <Flex gap={4} pt={2} w="100%" justify="center" wrap="wrap">
            <Box
              as="button"
              onClick={desbloquear}
              disabled={!password.trim() || enviando}
              px={9}
              py={3}
              borderRadius="full"
              border="1.5px solid rgba(255,255,255,0.75)"
              bg="rgba(255,255,255,0.18)"
              color="white"
              fontSize="md"
              fontWeight="700"
              letterSpacing="0.08em"
              textTransform="uppercase"
              cursor={!password.trim() || enviando ? "not-allowed" : "pointer"}
              opacity={!password.trim() || enviando ? 0.45 : 1}
              boxShadow="0 0 22px rgba(255,255,255,0.35)"
              transition="all 0.2s ease"
              _hover={!password.trim() || enviando ? undefined : { bg: "rgba(255,255,255,0.3)", transform: "translateY(-1px)" }}
            >
              {enviando ? "Verificando…" : "Entrar"}
            </Box>

            <Box
              as="button"
              onClick={() => navigate("/home")}
              px={7}
              py={3}
              borderRadius="full"
              bg="transparent"
              border="1px solid rgba(255,255,255,0.3)"
              color="rgba(255,255,255,0.8)"
              fontSize="md"
              fontWeight="600"
              letterSpacing="0.06em"
              cursor="pointer"
              transition="all 0.2s ease"
              _hover={{ color: "white", borderColor: "rgba(255,255,255,0.6)" }}
            >
              Volver
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
