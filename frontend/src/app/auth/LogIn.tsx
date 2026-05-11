// LogIn.tsx
import React, { useEffect, useState } from "react";
import { Box, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import { API_URL } from "../../GlobalVariables";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import axios from "axios";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import type { LoginUser } from "../../dtos/user.types";
import { gestionaError } from "../../GlobalHelper";
import SpinnerTurquesa from "../../components/global/Spinner";
import SiteFooter from "../../components/global/Footer";

export default function LogIn() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/home";

  const [name, setname] = useState<string>("");
  const [contra, setcontra] = useState<string>("");
  const [message, setmessage] = useState<SuccessErrorMessageDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

   const inicioSesion = async () =>
  {
    setLoading(true);
    try
    {
      let body: LoginUser = {
        name: name,
        password: contra
      };

      const response = await axios.post(
      `${API_URL}/user/logIn`,
      body,
      {
        headers: {
        'Content-Type': 'application/json',
        },
      }
      );

      if(response.data!= null)
      {
        sessionStorage.setItem("userId", response.data?.user.id)
        sessionStorage.setItem("name", response.data?.user.name)
        sessionStorage.setItem("token", response.data?.token)

        const res = await fetch(API_URL+`/upload/profile-pic/${response.data?.user.id}`);
        const data = await res.json();

        sessionStorage.setItem(
          "img",
          data.url && data.url !=""
            ? data.url
            : "/img/icono/noImg.png"
        );

        setmessage({
          soy : 1,
          title: "Bienvenido",
          description: "Lo estamos preparando para ti"
        })
      }
    }
    catch (err:any) {
      let error = gestionaError(err);
      setmessage(error)
    }
    finally {
      setLoading(false);
    }
  }

  const validarInicioSesion = () => {
    if (name === "" || contra === "") {
      setmessage({
        soy: 2,
        title: "Faltan datos",
        description: "Rellena todos los campos",
      });
    } else {
      inicioSesion();
    }
  };

  useEffect(() => {
    if (message?.soy === 1) {
      const timer = setTimeout(() => navigate(next, { replace: true }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      {loading && <SpinnerTurquesa />}

      {/* ── HEADER ── */}
      <SiteHeader variant="public" />

      {/* ── CARD LOGIN ── */}
      <Flex
        flex="1"
        align="flex-start"
        justify="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 7, md: 10 }}
        pb={{ base: 12, md: 16 }}
      >
        <VStack w={{ base: "100%", sm: "460px" }} spacing={4} align="stretch">

          {/* ── AVISO PARTICIPANTE ── */}
          <Box
            bg="rgba(255,255,255,0.12)"
            border="1px solid rgba(255,255,255,0.32)"
            sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            borderRadius="xl"
            px={{ base: 4, md: 5 }}
            py={5}
            textAlign="center"
          >
            <Text
              color="white"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.7"
              fontWeight="600"
              letterSpacing="0.015em"
            >
              Para entrar a los materiales y cursos grabados
              <br />
              tienes que ser participante del Método.
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
              Iniciar sesión
            </Text>

            <VStack spacing={4} align="stretch">

              {/* ── FORMULARIO ── */}
              <VStack spacing={5} align="stretch">
                  {/* Nombre / Email */}
                  <Box>
                    <Text
                      color="rgba(255,255,255,0.75)"
                      fontSize="xs"
                      letterSpacing="0.1em"
                      mb={2}
                      fontWeight="600"
                    >
                      NOMBRE O EMAIL
                    </Text>
                    <Input
                      value={name}
                      onChange={(e) => setname(e.target.value)}
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

                  {/* Contraseña */}
                  <Box>
                    <Text
                      color="rgba(255,255,255,0.75)"
                      fontSize="xs"
                      letterSpacing="0.1em"
                      mb={2}
                      fontWeight="600"
                    >
                      CONTRASEÑA
                    </Text>
                    <Input
                      type="password"
                      value={contra}
                      onChange={(e) => setcontra(e.target.value)}
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
                      onClick={() => setmessage(null)}
                    />
                  )}

                  <Box
                    as="button"
                    onClick={loading ? undefined : validarInicioSesion}
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
                    ENTRAR
                  </Box>
              </VStack>

              <Flex justify="center" pt={2}>
                <Text
                  as="button"
                  onClick={() => navigate(`/signIn${next !== "/home" ? `?next=${encodeURIComponent(next)}` : ""}`)}
                  color="rgba(255,255,255,0.75)"
                  fontSize="sm"
                  letterSpacing="0.04em"
                  bg="transparent"
                  cursor="pointer"
                  _hover={{ color: "white", textDecoration: "underline" }}
                >
                  ¿No tienes cuenta? Crear cuenta
                </Text>
              </Flex>

            </VStack>
          </Box>
        </VStack>
      </Flex>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </Box>
  );
}
