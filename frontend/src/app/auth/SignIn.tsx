// SignIn.tsx
import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Input, Text, VStack, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../GlobalVariables";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import axios from "axios";
import { gestionaError } from "../../GlobalHelper";
import type { CreateUser } from "../../dtos/user.types";

export default function SignIn() {
  const navigate = useNavigate();

  const [name, setname] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [contra, setcontra] = useState<string>("");
  const [contraRepite, setcontraRepite] = useState<string>("");
  const [message, setmessage] = useState<SuccessErrorMessageDto | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const registroFinal = async () => {
    try {
      const body: CreateUser = { name, email, password: contra };

      const response = await axios.post(`${API_URL}/user/signIn`, body, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data != null) {
        sessionStorage.setItem("userId", response.data?.user.id);
        sessionStorage.setItem("name", response.data?.user.name);
        sessionStorage.setItem("token", response.data?.token);
        sessionStorage.setItem(
          "img",
          response.data?.user.img && response.data.user.img !== ""
            ? response.data.user.img
            : "/img/noImg.png"
        );

        setmessage({
          soy: 1,
          title: "Bienvenida",
          description: "Lo estamos preparando para ti",
        });
      }
    } catch (err: any) {
      setmessage(gestionaError(err));
    }
  };

  const registro = () => {
    if (name === "" || contra === "" || contraRepite === "" || email === "") {
      setmessage({
        soy: 2,
        title: "Faltan datos",
        description: "Rellena todos los campos",
      });
    } else if (contra !== contraRepite) {
      setmessage({
        soy: 2,
        title: "Error",
        description: "Las contraseñas no son iguales",
      });
    } else if (!email.includes("@")) {
      setmessage({
        soy: 2,
        title: "Error",
        description: "El email no es correcto",
      });
    } else {
      registroFinal();
    }
  };

  useEffect(() => {
    if (message?.soy === 1) {
      const timer = setTimeout(() => navigate("/home"), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const inputStyle = {
    bg: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.32)",
    color: "white",
    borderRadius: "xl",
    size: "lg" as const,
    _placeholder: { color: "rgba(255,255,255,0.35)" },
    _hover: { border: "1px solid rgba(255,255,255,0.6)" },
    _focus: {
      border: "1px solid rgba(255,255,255,0.85)",
      boxShadow: "0 0 0 1px rgba(255,255,255,0.25)",
      bg: "rgba(255,255,255,0.13)",
      outline: "none",
    },
  };

  const labelStyle = {
    color: "rgba(255,255,255,0.75)",
    fontSize: "xs",
    letterSpacing: "0.1em",
    mb: 2,
    fontWeight: "600",
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      {/* ── HEADER ── */}
       <Flex
                    as="header"
                    align="center"
                    justify="space-between"
                    px={{ base: 5, md: 12 }}
                    py={{ base: 3, md: 4 }}
                    bg="#008080"
                    position="sticky"
                    top="0"
                    zIndex="100"
                    borderBottom="1px solid rgba(255,255,255,0.12)"
                  >
                    <Image
                      src="/img/life.png"
                      h={{ base: "56px", md: "70px" }}
                      objectFit="contain"
                      cursor="pointer"
                      onClick={() => navigate("/")}
                      _hover={{ opacity: 0.85 }}
                      transition="opacity 0.2s"
                    />
            
                    <Flex align="center" gap={{ base: 3, md: 6 }}>
                      <Link
                        onClick={() => navigate("/logIn")}
                        color="white"
                        fontWeight="600"
                        fontSize={{ base: "md", md: "lg" }}
                        letterSpacing="0.03em"
                        textShadow="0 1px 4px rgba(0,80,70,0.5)"
                        _hover={{ color: "white", textDecoration: "none" }}
                        transition="color 0.2s"
                      >
                        Inicio de sesión
                      </Link>
            
                      <Box
                        as="button"
                        onClick={() => navigate("/signIn")}
                        color="white"
                        fontWeight="600"
                        fontSize={{ base: "md", md: "lg" }}
                        letterSpacing="0.04em"
                        px={{ base: 4, md: 6 }}
                        py={{ base: "8px", md: "10px" }}
                        borderRadius="full"
                        border="1.5px solid rgba(255,255,255,0.6)"
                        bg="rgba(255,255,255,0.12)"
                        cursor="pointer"
                        _hover={{ bg: "rgba(255,255,255,0.25)", borderColor: "white" }}
                        transition="all 0.2s"
                      >
                        Registrarse
                      </Box>
                    </Flex>
                  </Flex>

      {/* ── CARD REGISTRO ── */}
      <Flex
        flex="1"
        align="center"
        justify="center"
        px={{ base: 5, md: 10 }}
        py={{ base: 12, md: 16 }}
      >
        <Box
          w={{ base: "100%", sm: "460px" }}
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

          <VStack spacing={5} align="stretch">
            {/* Nombre */}
            <Box>
              <Text {...labelStyle}>NOMBRE</Text>
              <Input
                autoFocus
                value={name}
                onChange={(e) => setname(e.target.value)}
                {...inputStyle}
              />
            </Box>

            {/* Email */}
            <Box>
              <Text {...labelStyle}>EMAIL</Text>
              <Input
                value={email}
                onChange={(e) => setemail(e.target.value)}
                {...inputStyle}
              />
            </Box>

            {/* Contraseña */}
            <Box>
              <Text {...labelStyle}>CONTRASEÑA</Text>
              <Input
                type="password"
                value={contra}
                onChange={(e) => setcontra(e.target.value)}
                {...inputStyle}
              />
            </Box>

            {/* Repite contraseña */}
            <Box>
              <Text {...labelStyle}>REPITE LA CONTRASEÑA</Text>
              <Input
                type="password"
                value={contraRepite}
                onChange={(e) => setcontraRepite(e.target.value)}
                {...inputStyle}
              />
            </Box>

            <Text
              onClick={() => navigate("/logIn")}
              textAlign="center"
              color="rgba(255,255,255,0.6)"
              fontWeight="500"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.02em"
              cursor="pointer"
              _hover={{ color: "white" }}
              transition="color 0.2s"
              mt={1}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Text>

            {message && (
              <SuccessErrorMessage
                soy={message.soy}
                title={message.title}
                description={message.description}
                onClick={() => setmessage(null)}
              />
            )}

            <Flex justify="center" mt={2}>
              <Box
                as="button"
                onClick={registro}
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
                cursor="pointer"
                textShadow="0 1px 6px rgba(0,0,0,0.2)"
                boxShadow="0 4px 20px rgba(0,0,0,0.15)"
                _hover={{
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
            </Flex>
          </VStack>
        </Box>
      </Flex>

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.15)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text
          color="rgba(255,255,255,0.5)"
          fontSize="xs"
          letterSpacing="0.05em"
          textAlign="center"
        >
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>
    </Box>
  );
}
