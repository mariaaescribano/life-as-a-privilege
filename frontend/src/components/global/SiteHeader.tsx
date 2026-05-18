import React from "react";
import { Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

type SiteHeaderProps = {
  /**
   * "public"  → logo a /, botones Inicio de sesión / Registrarse
   * "private" → logo a /home, iconos Mi Espacio / Aprendizajes / avatar
   * "auto"    → detecta sessionStorage: si hay userId → private, si no → public
   */
  variant: "public" | "private" | "auto";
  /**
   * Imagen de perfil del usuario. Úsalo cuando el componente padre gestione
   * el estado del avatar (p.ej. EspacioHome tras subir foto). Si no se pasa,
   * el componente lee sessionStorage.getItem("img") al montarse.
   */
  userImg?: string;
};

const SiteHeader = ({ variant }: SiteHeaderProps) => {
  const navigate = useNavigate();

  const hasSession = !!sessionStorage.getItem("userId");
  const isPrivate  = variant === "private" || (variant === "auto" && hasSession);
  const logoTarget = isPrivate ? "/home" : "/";

  return (
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
      {/* Logo */}
      <Flex
        direction="column"
        align="center"
        cursor="pointer"
        onClick={() => navigate(logoTarget)}
        _hover={{ opacity: 0.85 }}
        transition="opacity 0.2s"
        gap="2px"
      >
        <Image
          src="/img/icono/life.png"
          h={{ base: "56px", md: "70px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.78)) drop-shadow(0 0 20px rgba(255,255,255,0.38)) drop-shadow(0 0 42px rgba(180,255,245,0.28))" }}
        />
        <Text
          color="rgba(255,255,255,0.85)"
          fontFamily="'EB Garamond', serif"
          fontWeight="600"
          fontSize={{ base: "9px", md: "11px" }}
          letterSpacing="0.18em"
          textShadow="0 0 8px rgba(255,255,255,0.55), 0 0 16px rgba(255,255,255,0.3)"
          whiteSpace="nowrap"
        >
          LIFE AS A PRIVILEGE
        </Text>
      </Flex>

      {/* El recorrido (texto navegable) */}
      <Text
        as="button"
        onClick={() => navigate("/elMetodo")}
        color="white"
        fontFamily="'EB Garamond', serif"
        fontWeight="600"
        fontSize={{ base: "md", md: "xl" }}
        letterSpacing="0.16em"
        textTransform="uppercase"
        textShadow="0 0 10px rgba(255,255,255,0.55), 0 0 22px rgba(255,255,255,0.3)"
        cursor="pointer"
        bg="transparent"
        border="none"
        _hover={{ color: "white", textShadow: "0 0 14px rgba(255,255,255,0.8), 0 0 30px rgba(180,255,245,0.45)" }}
        transition="text-shadow 0.25s ease"
      >
        El recorrido
      </Text>
    </Flex>
  );
};

export default SiteHeader;
