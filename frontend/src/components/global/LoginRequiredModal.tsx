import React from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={1100}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(0,0,0,0.65)"
      sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={onClose}
      px={{ base: 5, md: 10 }}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        bg="rgba(0,90,80,0.92)"
        border="1px solid rgba(255,255,255,0.3)"
        sx={{ backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)" }}
        borderRadius="3xl"
        boxShadow="0 28px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1)"
        p={{ base: 10, md: 14 }}
        maxW="420px"
        w="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={6}
        textAlign="center"
        position="relative"
      >
        {/* Cerrar */}
        <Box
          as="button"
          position="absolute"
          top="14px"
          right="14px"
          w="32px"
          h="32px"
          borderRadius="full"
          bg="rgba(255,255,255,0.1)"
          border="none"
          cursor="pointer"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontSize="18px"
          fontWeight="bold"
          _hover={{ bg: "rgba(255,255,255,0.22)" }}
          transition="background 0.18s"
          onClick={onClose}
        >
          ✕
        </Box>

        <Image
          src="/img/icono/life.png"
          alt="Life as a Privilege"
          w="110px"
          objectFit="contain"
          filter="drop-shadow(0 4px 12px rgba(255, 255, 255, 0.35))"
        />

        <Text
          color="white"
          fontSize={{ base: "lg", md: "xl" }}
          fontFamily="'EB Garamond', serif"
          lineHeight="1.75"
          letterSpacing="0.02em"
          textShadow="0 1px 6px rgba(255, 255, 255, 0.3)"
        >
          Crea una cuenta o inicia sesión
        </Text>

        <Box
          as="button"
          onClick={() => navigate("/logIn")}
          color="white"
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "lg", md: "xl" }}
          letterSpacing="0.12em"
          px={10}
          py={3}
          borderRadius="full"
          border="2px solid rgba(255,255,255,0.65)"
          bg="rgba(255,255,255,0.14)"
          cursor="pointer"
          boxShadow="0 0 28px rgba(107,196,200,0.5), 0 2px 12px rgba(0,0,0,0.25)"
          _hover={{ bg: "rgba(255,255,255,0.26)", borderColor: "white", boxShadow: "0 0 40px rgba(107,196,200,0.8)" }}
          transition="all 0.22s ease"
        >
          Iniciar sesión →
        </Box>
      </Box>
    </Box>
  );
}
