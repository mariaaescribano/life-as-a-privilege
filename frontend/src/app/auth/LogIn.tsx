// LogIn.tsx
import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Input, Text, VStack, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../GlobalVariables";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import axios from "axios";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import type { LoginUser } from "../../dtos/user.types";
import { gestionaError } from "../../GlobalHelper";

export default function LogIn() {
  const navigate = useNavigate();

  const [name, setname] = useState<string>("");
  const [contra, setcontra] = useState<string>("");
  const [message, setmessage] = useState<SuccessErrorMessageDto | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

   const inicioSesion = async () =>
  {
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
            : "/img/noImg.png"
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
      const timer = setTimeout(() => navigate("/home"), 3000);
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

      {/* ── CARD LOGIN ── */}
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
            Iniciar sesión
          </Text>

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

            <Text
              onClick={() => navigate("/signIn")}
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
              ¿No tienes cuenta? Regístrate
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
                onClick={validarInicioSesion}
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
                ENTRAR
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
