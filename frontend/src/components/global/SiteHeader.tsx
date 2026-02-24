import React, { useState } from "react";
import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AprendizajeIcon, EspacioPersonalIcon } from "../../GlobalVariables";

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

const SiteHeader = ({ variant, userImg }: SiteHeaderProps) => {
  const navigate = useNavigate();

  // Leemos sessionStorage una vez al montar, como fallback del avatar
  const [sessionImg] = useState<string | null>(() => sessionStorage.getItem("img"));

  const hasSession = !!sessionStorage.getItem("userId");
  const isPrivate  = variant === "private" || (variant === "auto" && hasSession);
  const logoTarget = isPrivate ? "/home" : "/";
  const avatarSrc  = userImg ?? sessionImg;

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
      <Image
        src="/img/life.png"
        h={{ base: "56px", md: "70px" }}
        objectFit="contain"
        cursor="pointer"
        onClick={() => navigate(logoTarget)}
        _hover={{ opacity: 0.85 }}
        transition="opacity 0.2s"
      />

      {isPrivate ? (
        /* ── Navegación privada ── */
        <Flex align="center" gap={{ base: 4, md: 6 }}>
          <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/espacio/espacioHome")}
            color="rgba(255,255,255,0.85)"
            _hover={{ color: "white" }}
            transition="color 0.2s"
          >
            <EspacioPersonalIcon color="currentColor" size={{ base: "28px", md: "32px" } as any} />
            <Text
              display={{ base: "none", md: "block" }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="500"
              letterSpacing="0.04em"
              textShadow="0 1px 4px rgba(0,80,70,0.5)"
            >
              Mi Espacio
            </Text>
          </Flex>

          <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/aprendizaje/aprendizajeHome")}
            color="rgba(255,255,255,0.85)"
            _hover={{ color: "white" }}
            transition="color 0.2s"
          >
            <AprendizajeIcon color="currentColor" size={{ base: "28px", md: "32px" } as any} />
            <Text
              display={{ base: "none", md: "block" }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="500"
              letterSpacing="0.04em"
              textShadow="0 1px 4px rgba(0,80,70,0.5)"
            >
              Aprendizajes
            </Text>
          </Flex>

          {avatarSrc && (
            <Box
              w={{ base: "36px", md: "42px" }}
              h={{ base: "36px", md: "42px" }}
              borderRadius="full"
              overflow="hidden"
              border="2px solid rgba(255,255,255,0.55)"
              flexShrink={0}
              cursor="pointer"
              onClick={() => navigate("/espacio/espacioHome")}
              _hover={{ border: "2px solid white" }}
              transition="border 0.2s"
            >
              <Image src={avatarSrc} w="100%" h="100%" objectFit="cover" />
            </Box>
          )}
        </Flex>
      ) : (
        /* ── Navegación pública ── */
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
      )}
    </Flex>
  );
};

export default SiteHeader;
