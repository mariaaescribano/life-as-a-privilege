import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const [sessionImg] = useState<string | null>(() => sessionStorage.getItem("img"));

  const hasSession = !!sessionStorage.getItem("userId");
  const isPrivate  = variant === "private" || (variant === "auto" && hasSession);
  // En el área privada (logueado: /home, /metodo, …) el header es ~10% más compacto.
  const compact = isPrivate;
  const isAdmin    = sessionStorage.getItem("isAdmin") === "1";
  // Para admins el "home" es el panel de administración.
  const homeTarget = isPrivate ? (isAdmin ? "/admin" : "/home") : "/";
  const logoTarget = homeTarget;
  const avatarSrc  = userImg ?? sessionImg ?? "/img/icono/noImg.png";

  const path = location.pathname.toLowerCase();
  const isRecorridoPage = path.startsWith("/elmetodo") || path.startsWith("/checkoutmetodo") || path.startsWith("/metodo/");
  const isMaterialesPage = path.startsWith("/materiales") || path.startsWith("/aprendizaje") || path.startsWith("/libros");
  // Navegación de administración (pestañas en el header).
  const isAdminPage = path.startsWith("/admin");
  const adminCursosActive = path.startsWith("/admin/cursos");

  const underlineStyles = {
    textDecoration: "underline",
    textDecorationColor: "rgba(255,255,255,0.55)",
    textUnderlineOffset: "6px",
    sx: { textDecorationThickness: "1.5px" },
  } as const;

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={{ base: 5, md: 12 }}
      pt={{ base: 2, md: compact ? 3 : 4 }}
      pb={{ base: compact ? "10px" : "13px", md: compact ? 3 : 4 }}
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
          h={{ base: compact ? "36px" : "40px", md: compact ? "63px" : "70px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.78)) drop-shadow(0 0 20px rgba(255,255,255,0.38)) drop-shadow(0 0 42px rgba(180,255,245,0.28))" }}
        />
        <Text
          color="rgba(255,255,255,0.85)"
          fontFamily="'EB Garamond', serif"
          fontWeight="600"
          fontSize={{ base: "7px", md: "11px" }}
          letterSpacing="0.18em"
          textShadow="0 0 8px rgba(255,255,255,0.55), 0 0 16px rgba(255,255,255,0.3)"
          whiteSpace="nowrap"
        >
          LIFE AS A PRIVILEGE
        </Text>
      </Flex>

      {/* Enlace derecha — avatar si está logueado (el logo ya lleva a home), El recorrido si público */}
      {isPrivate ? (
        <Flex align="center" gap={{ base: 4, md: 6 }}>
          {/* Pestañas de administración — a la izquierda del avatar */}
          {isAdminPage && (
            <>
              <Text
                as="button"
                onClick={() => navigate("/admin")}
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="600"
                fontSize={{ base: "2xs", md: "lg" }}
                letterSpacing={{ base: "0.08em", md: "0.14em" }}
                textTransform="uppercase"
                textShadow="0 0 10px rgba(255,255,255,0.55), 0 0 22px rgba(255,255,255,0.3)"
                cursor="pointer"
                bg="transparent"
                border="none"
                {...(isAdminPage && !adminCursosActive ? underlineStyles : {})}
                _hover={{ textShadow: "0 0 14px rgba(255,255,255,0.8), 0 0 30px rgba(180,255,245,0.45)" }}
                transition="text-shadow 0.25s ease"
              >
                El Mapa
              </Text>
              <Text
                as="button"
                onClick={() => navigate("/admin/cursos")}
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="600"
                fontSize={{ base: "2xs", md: "lg" }}
                letterSpacing={{ base: "0.08em", md: "0.14em" }}
                textTransform="uppercase"
                textShadow="0 0 10px rgba(255,255,255,0.55), 0 0 22px rgba(255,255,255,0.3)"
                cursor="pointer"
                bg="transparent"
                border="none"
                {...(adminCursosActive ? underlineStyles : {})}
                _hover={{ textShadow: "0 0 14px rgba(255,255,255,0.8), 0 0 30px rgba(180,255,245,0.45)" }}
                transition="text-shadow 0.25s ease"
              >
                Cursos
              </Text>
            </>
          )}
          {/* Acceso a Materiales sin salir de la sesión (navegación de cliente).
              Visible mientras el usuario recorre el Mapa; se oculta en admin. */}
          {!isAdminPage && (
            <Text
              as="button"
              onClick={() => navigate("/materiales")}
              color="white"
              fontFamily="'EB Garamond', serif"
              fontWeight="600"
              fontSize={{ base: "2xs", md: "lg" }}
              letterSpacing={{ base: "0.08em", md: "0.14em" }}
              textTransform="uppercase"
              textShadow="0 0 10px rgba(255,255,255,0.55), 0 0 22px rgba(255,255,255,0.3)"
              cursor="pointer"
              bg="transparent"
              border="none"
              whiteSpace="nowrap"
              {...(isMaterialesPage ? underlineStyles : {})}
              _hover={{
                color: "white",
                textShadow: "0 0 14px rgba(255,255,255,0.8), 0 0 30px rgba(180,255,245,0.45)",
                ...(isMaterialesPage ? { textDecorationColor: "white" } : {}),
              }}
              transition="text-shadow 0.25s ease, text-decoration-color 0.25s ease"
            >
              Materiales
            </Text>
          )}
          <Box
            as="button"
            onClick={() => navigate("/user/account")}
            w={{ base: "44px", md: "50px" }}
            h={{ base: "44px", md: "50px" }}
            borderRadius="full"
            overflow="hidden"
            border="2px solid rgba(255,255,255,0.7)"
            bg="rgba(255,255,255,0.08)"
            cursor="pointer"
            boxShadow="0 0 12px rgba(255,255,255,0.45), 0 0 28px rgba(255,255,255,0.22), 0 0 50px rgba(180,255,245,0.2)"
            transition="border-color 0.25s ease, box-shadow 0.25s ease"
            _hover={{
              borderColor: "white",
              boxShadow: "0 0 18px rgba(255,255,255,0.7), 0 0 42px rgba(180,255,245,0.4)",
            }}
            flexShrink={0}
            p={0}
          >
            <Image
              src={avatarSrc}
              alt="Mi cuenta"
              w="100%"
              h="100%"
              objectFit="cover"
            />
          </Box>
        </Flex>
      ) : (
        <Flex align="center" gap={{ base: 4, md: 7 }}>
          <Text
            as="button"
            onClick={() => navigate("/elMetodo")}
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize={{ base: "xs", md: "xl" }}
            letterSpacing={{ base: "0.1em", md: "0.16em" }}
            textTransform="uppercase"
            textShadow="0 0 10px rgba(255,255,255,0.55), 0 0 22px rgba(255,255,255,0.3)"
            cursor="pointer"
            bg="transparent"
            border="none"
            {...(isRecorridoPage ? underlineStyles : {})}
            _hover={{
              color: "white",
              textShadow: "0 0 14px rgba(255,255,255,0.8), 0 0 30px rgba(180,255,245,0.45)",
              ...(isRecorridoPage ? { textDecorationColor: "white" } : {}),
            }}
            transition="text-shadow 0.25s ease, text-decoration-color 0.25s ease"
          >
            El Mapa
          </Text>
          <Text
            as="button"
            onClick={() => navigate("/materiales")}
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize={{ base: "xs", md: "xl" }}
            letterSpacing={{ base: "0.1em", md: "0.16em" }}
            textTransform="uppercase"
            textShadow="0 0 10px rgba(255,255,255,0.55), 0 0 22px rgba(255,255,255,0.3)"
            cursor="pointer"
            bg="transparent"
            border="none"
            {...(isMaterialesPage ? underlineStyles : {})}
            _hover={{
              color: "white",
              textShadow: "0 0 14px rgba(255,255,255,0.8), 0 0 30px rgba(180,255,245,0.45)",
              ...(isMaterialesPage ? { textDecorationColor: "white" } : {}),
            }}
            transition="text-shadow 0.25s ease, text-decoration-color 0.25s ease"
          >
            Materiales
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default SiteHeader;
