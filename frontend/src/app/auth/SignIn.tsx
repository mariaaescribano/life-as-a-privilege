// SignIn.tsx
import React, { useEffect, useState } from "react";
import { Box, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import { API_URL } from "../../GlobalVariables";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import axios from "axios";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import type { CreateUser } from "../../dtos/user.types";
import { gestionaError } from "../../GlobalHelper";
import SpinnerTurquesa from "../../components/global/Spinner";
import SiteFooter from "../../components/global/Footer";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

export default function SignIn() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/home";

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contra, setContra] = useState<string>("");
  const [message, setMessage] = useState<SuccessErrorMessageDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const registrar = async () => {
    setLoading(true);
    try {
      const body: CreateUser = { name, email, password: contra };

      const response = await axios.post(`${API_URL}/user/signIn`, body, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data != null) {
        sessionStorage.setItem("userId", response.data.user.id);
        sessionStorage.setItem("name", response.data.user.name);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("img", "/img/icono/noImg.png");

        setMessage({
          soy: 1,
          title: "¡Cuenta creada!",
          description: "Continuamos en un instante...",
        });
      }
    } catch (err: any) {
      setMessage(gestionaError(err));
    } finally {
      setLoading(false);
    }
  };

  const validarRegistro = () => {
    if (name === "" || email === "" || contra === "") {
      setMessage({
        soy: 2,
        title: "Faltan datos",
        description: "Rellena todos los campos",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMessage({
        soy: 2,
        title: "Email no válido",
        description: "Introduce un email correcto",
      });
      return;
    }
    if (contra.length < 4) {
      setMessage({
        soy: 2,
        title: "Contraseña muy corta",
        description: "Usa al menos 4 caracteres",
      });
      return;
    }
    registrar();
  };

  useEffect(() => {
    if (message?.soy === 1) {
      const timer = setTimeout(() => navigate(next, { replace: true }), 1800);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const continuarConGoogle = () => {
    sessionStorage.setItem("postAuthNext", next);
    window.location.href = `${API_URL}/auth/google`;
  };

  const authButtonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    w: "100%",
    py: "13px",
    px: 6,
    borderRadius: "full",
    border: "1.5px solid rgba(255,255,255,0.4)",
    bg: "rgba(255,255,255,0.08)",
    color: "white",
    fontFamily: "'EB Garamond', serif",
    fontWeight: "600",
    fontSize: { base: "lg", md: "xl" } as any,
    letterSpacing: "0.06em",
    cursor: "pointer",
    _hover: { bg: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.7)" },
    transition: "all 0.25s ease",
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      {loading && <SpinnerTurquesa />}

      <SiteHeader variant="public" />

      <Flex flex="1" align="flex-start" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 7, md: 10 }} pb={{ base: 12, md: 16 }}>
        <VStack w={{ base: "100%", sm: "460px" }} spacing={4} align="stretch">
          <Box
            bg="rgba(255,255,255,0.12)"
            border="1px solid rgba(255,255,255,0.32)"
            sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            borderRadius="xl"
            px={{ base: 4, md: 5 }}
            py={5}
            textAlign="center"
          >
            <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" fontWeight="600" letterSpacing="0.015em">
              Crea tu cuenta para empezar
              <br />
              tu camino con el Método.
            </Text>
          </Box>

          <Box
            w="100%"
            bg="rgba(255,255,255,0.14)"
            border="1px solid rgba(255,255,255,0.38)"
            sx={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
            borderRadius="2xl"
            boxShadow="0 8px 40px rgba(107,196,200,0.45)"
            px={{ base: 8, md: 12 }}
            py={{ base: 10, md: 12 }}
          >
            <Text
              color="white"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="700"
              letterSpacing="0.05em"
              lineHeight="1.2"
              textShadow="0 2px 10px rgba(0,100,90,0.4)"
              mb={8}
              textAlign="center"
            >
              Crear cuenta
            </Text>

            <VStack spacing={4} align="stretch">
              <Box as="button" onClick={continuarConGoogle} {...authButtonStyle}>
                <GoogleIcon />
                Continuar con Google
              </Box>

              <Box
                as="button"
                onClick={() => setShowForm(!showForm)}
                {...authButtonStyle}
                border="1.5px solid rgba(255,255,255,0.25)"
                bg={showForm ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)"}
              >
                <EmailIcon />
                Continuar con email
              </Box>

              {showForm && (
                <VStack spacing={5} align="stretch" pt={2}>
                  <Flex align="center" gap={3}>
                    <Box flex="1" h="1px" bg="rgba(255,255,255,0.18)" />
                    <Text color="rgba(255,255,255,0.4)" fontSize="xs" letterSpacing="0.1em">
                      CON EMAIL Y CONTRASEÑA
                    </Text>
                    <Box flex="1" h="1px" bg="rgba(255,255,255,0.18)" />
                  </Flex>

                  <Box>
                    <Text color="rgba(255,255,255,0.75)" fontSize="xs" letterSpacing="0.1em" mb={2} fontWeight="600">
                      NOMBRE
                    </Text>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      bg="rgba(255,255,255,0.08)"
                      border="1px solid rgba(255,255,255,0.32)"
                      color="white"
                      borderRadius="xl"
                      size="lg"
                      _placeholder={{ color: "rgba(255,255,255,0.35)" }}
                      _hover={{ border: "1px solid rgba(255,255,255,0.6)" }}
                      _focus={{
                        border: "1px solid rgba(255,255,255,0.85)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.25)",
                        bg: "rgba(255,255,255,0.13)",
                        outline: "none",
                      }}
                    />
                  </Box>

                  <Box>
                    <Text color="rgba(255,255,255,0.75)" fontSize="xs" letterSpacing="0.1em" mb={2} fontWeight="600">
                      EMAIL
                    </Text>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      bg="rgba(255,255,255,0.08)"
                      border="1px solid rgba(255,255,255,0.32)"
                      color="white"
                      borderRadius="xl"
                      size="lg"
                      _placeholder={{ color: "rgba(255,255,255,0.35)" }}
                      _hover={{ border: "1px solid rgba(255,255,255,0.6)" }}
                      _focus={{
                        border: "1px solid rgba(255,255,255,0.85)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.25)",
                        bg: "rgba(255,255,255,0.13)",
                        outline: "none",
                      }}
                    />
                  </Box>

                  <Box>
                    <Text color="rgba(255,255,255,0.75)" fontSize="xs" letterSpacing="0.1em" mb={2} fontWeight="600">
                      CONTRASEÑA
                    </Text>
                    <Input
                      type="password"
                      value={contra}
                      onChange={(e) => setContra(e.target.value)}
                      bg="rgba(255,255,255,0.08)"
                      border="1px solid rgba(255,255,255,0.32)"
                      color="white"
                      borderRadius="xl"
                      size="lg"
                      _placeholder={{ color: "rgba(255,255,255,0.35)" }}
                      _hover={{ border: "1px solid rgba(255,255,255,0.6)" }}
                      _focus={{
                        border: "1px solid rgba(255,255,255,0.85)",
                        boxShadow: "0 0 0 1px rgba(255,255,255,0.25)",
                        bg: "rgba(255,255,255,0.13)",
                        outline: "none",
                      }}
                    />
                  </Box>

                  {message && (
                    <SuccessErrorMessage
                      soy={message.soy}
                      title={message.title}
                      description={message.description}
                      onClick={() => setMessage(null)}
                    />
                  )}

                  <Box
                    as="button"
                    onClick={loading ? undefined : validarRegistro}
                    color="white"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "lg", md: "xl" }}
                    letterSpacing="0.18em"
                    px={12}
                    py="12px"
                    borderRadius="full"
                    border="1.5px solid rgba(255,255,255,0.6)"
                    bg="rgba(255,255,255,0.12)"
                    cursor={loading ? "not-allowed" : "pointer"}
                    opacity={loading ? 0.55 : 1}
                    textShadow="0 1px 6px rgba(0,0,0,0.2)"
                    boxShadow="0 4px 20px rgba(0,0,0,0.15)"
                    _hover={loading ? {} : {
                      bg: "rgba(255,255,255,0.25)",
                      borderColor: "white",
                      boxShadow: "0 8px 28px rgba(0,0,0,0.22)",
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.25s ease"
                    w="100%"
                  >
                    REGISTRARME
                  </Box>
                </VStack>
              )}

              {!showForm && message && (
                <SuccessErrorMessage
                  soy={message.soy}
                  title={message.title}
                  description={message.description}
                  onClick={() => setMessage(null)}
                />
              )}

              <Flex justify="center" pt={2}>
                <Text
                  as="button"
                  onClick={() => navigate(`/logIn${next !== "/home" ? `?next=${encodeURIComponent(next)}` : ""}`)}
                  color="rgba(255,255,255,0.75)"
                  fontSize="sm"
                  letterSpacing="0.04em"
                  bg="transparent"
                  cursor="pointer"
                  _hover={{ color: "white", textDecoration: "underline" }}
                >
                  ¿Ya tienes cuenta? Iniciar sesión
                </Text>
              </Flex>
            </VStack>
          </Box>
        </VStack>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
