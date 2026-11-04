import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { CampoContrasena, focoAzul, inputAuthStyles } from "../../components/global/CampoContrasena";
import { API_URL } from "../../GlobalVariables";

// Entrada propia de administración (/admin/login), sin pasar por el login normal:
// usuario o email + contraseña de admin (ADMIN_PASSWORD en el backend). El
// backend comprueba que la cuenta esté en ADMIN_EMAILS y devuelve la sesión ya
// con el permiso de admin, así que se entra directo al panel.
export default function AdminLogin() {
  const navigate = useNavigate();
  const [verificando, setVerificando] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Si ya hay una sesión de admin desbloqueada, directo al panel.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setVerificando(false); return; }
    axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((me) => { if (me.data?.is_admin) navigate("/admin"); })
      .catch(() => {})
      .finally(() => setVerificando(false));
  }, [navigate]);

  const puede = !!name.trim() && !!password.trim() && !enviando;

  const desbloquear = async () => {
    if (!puede) return;
    setError("");
    setEnviando(true);
    try {
      const res = await axios.post(`${API_URL}/user/admin/entrar`, {
        name: name.trim(),
        password: password.trim(),
      });
      if (res.data?.token && res.data?.user?.id) {
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("name", res.data.user.name ?? "");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("isAdmin", "1");
        navigate("/admin");
        return;
      }
      setError("No se pudo entrar. Inténtalo de nuevo.");
    } catch {
      setError("Usuario o contraseña de administración incorrectos.");
      setPassword("");
    }
    setEnviando(false);
  };

  if (verificando) {
    return <LifeLoading variant="private" />;
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
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") desbloquear(); }}
              placeholder="Usuario o email"
              autoComplete="username"
              autoFocus
              {...inputAuthStyles}
            />
          </Box>

          <Box w="100%">
            <CampoContrasena
              label="CONTRASEÑA DE ADMINISTRACIÓN"
              value={password}
              onChange={(v) => { setPassword(v); setError(""); }}
              onEnter={desbloquear}
              autoComplete="current-password"
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
              disabled={!puede}
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
              cursor={!puede ? "not-allowed" : "pointer"}
              opacity={!puede ? 0.45 : 1}
              boxShadow="0 0 22px rgba(255,255,255,0.35)"
              transition="all 0.2s ease"
              _hover={!puede ? undefined : { bg: "rgba(255,255,255,0.3)", transform: "translateY(-1px)" }}
              _focusVisible={focoAzul}
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
              _focusVisible={focoAzul}
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
