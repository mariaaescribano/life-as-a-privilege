import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AprendizajeIcon, LibrosIcon } from "../../GlobalVariables";

const VideosIcon = ({ size = "28px", color = "currentColor" }: { size?: string; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={color} style={{
    filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
  }}>
    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z"/>
  </svg>
);

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
        src="/img/icono/life.png"
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
          {/* <Flex
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
              style={{
                filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
              }}
            >
              Mi Espacio
            </Text>
          </Flex> */}

          <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/videos")}
            color="rgba(255,255,255,0.85)"
            _hover={{ color: "white" }}
            transition="color 0.2s"
          >
            <VideosIcon color="currentColor" size="28px" />
            <Text
              display={{ base: "none", md: "block" }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="500"
              letterSpacing="0.04em"
              style={{
                filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
              }}
            >
              Vídeos
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
              style={{
                filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
              }}
            >
              Cursos
            </Text>
          </Flex>

          <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/libros")}
            color="rgba(255,255,255,0.85)"
            _hover={{ color: "white" }}
            transition="color 0.2s"
          >
            <LibrosIcon color="currentColor" size={{ base: "28px", md: "32px" } as any} />
            <Text
              display={{ base: "none", md: "block" }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="500"
              letterSpacing="0.04em"
              style={{
                filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
              }}
            >
              Libros
            </Text>
          </Flex>

          {/* <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/productos")}
            color="rgba(255,255,255,0.85)"
            _hover={{ color: "white" }}
            transition="color 0.2s"
          >
            <ProductosNaturalesIcon size="28px" color="currentColor" />
            <Text
              display={{ base: "none", md: "block" }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="500"
              letterSpacing="0.04em"
              textShadow="0 1px 4px rgba(0,80,70,0.5)"
            >
              Productos
            </Text>
          </Flex>

          <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/reels")}
            color="rgba(255,255,255,0.85)"
            _hover={{ color: "white" }}
            transition="color 0.2s"
          >
            <ReelsIcon size="28px" color="currentColor" />
            <Text
              display={{ base: "none", md: "block" }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="500"
              letterSpacing="0.04em"
              textShadow="0 1px 4px rgba(0,80,70,0.5)"
            >
              Reels
            </Text>
          </Flex> */}

          {avatarSrc && (
            <Box
              w={{ base: "36px", md: "42px" }}
              h={{ base: "36px", md: "42px" }}
              borderRadius="full"
              overflow="hidden"
              border="2px solid rgba(255,255,255,0.55)"
              flexShrink={0}
              cursor="pointer"
              onClick={() => navigate("/user/account")}
              _hover={{ border: "2px solid white" }}
              transition="border 0.2s"
            >
              <Image src={avatarSrc} w="100%" h="100%" objectFit="cover" />
            </Box>
          )}
        </Flex>
      ) : (
        /* ── Navegación pública ── */
        // <Flex align="center" gap={{ base: 3, md: 6 }}>
        //   <Flex
        //     align="center" gap={2} cursor="pointer"
        //     onClick={() => navigate("/productos")}
        //     color="rgba(255,255,255,0.85)"
        //     _hover={{ color: "white" }}
        //     transition="color 0.2s"
        //   >
        //     <ProductosNaturalesIcon size="28px" color="currentColor" />
        //     <Text
        //       display={{ base: "none", md: "block" }}
        //       fontSize={{ base: "md", md: "lg" }}
        //       fontWeight="500"
        //       letterSpacing="0.04em"
        //       textShadow="0 1px 4px rgba(0,80,70,0.5)"
        //     >
        //       Productos
        //     </Text>
        //   </Flex>

        //   <Flex
        //     align="center" gap={2} cursor="pointer"
        //     onClick={() => navigate("/reels")}
        //     color="rgba(255,255,255,0.85)"
        //     _hover={{ color: "white" }}
        //     transition="color 0.2s"
        //   >
        //     <ReelsIcon size="28px" color="currentColor" />
        //     <Text
        //       display={{ base: "none", md: "block" }}
        //       fontSize={{ base: "md", md: "lg" }}
        //       fontWeight="500"
        //       letterSpacing="0.04em"
        //       textShadow="0 1px 4px rgba(0,80,70,0.5)"
        //     >
        //       Reels
        //     </Text>
        //   </Flex>

        // <Flex align="center" gap={{ base: 3, md: 6 }}>
        //   <Flex
        //     align="center" gap={2} cursor="pointer"
        //     onClick={() => navigate("/logIn")}
        //     color="rgba(255,255,255,0.85)"
        //     _hover={{ color: "white" }}
        //     transition="color 0.2s"
        //   >
        //     <LoginIcon size="28px" color="currentColor" />
        //     <Text
        //       display={{ base: "none", md: "block" }}
        //       fontSize={{ base: "md", md: "lg" }}
        //       fontWeight="500"
        //       letterSpacing="0.04em"
        //       textShadow="0 1px 4px rgba(0,80,70,0.5)"
        //       style={{
        //           filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
        //         }}
        //     >
        //       Inicio de sesión
        //     </Text>
        //   </Flex>

        //   <Box
        //     as="button"
        //     onClick={() => navigate("/signIn")}
        //     color="white"
        //     fontWeight="600"
        //     fontSize={{ base: "md", md: "lg" }}
        //     letterSpacing="0.04em"
        //     px={{ base: 4, md: 6 }}
        //     py={{ base: "8px", md: "10px" }}
        //     borderRadius="full"
        //     border="1.5px solid rgba(255,255,255,0.6)"
        //     bg="rgba(255,255,255,0.12)"
        //     cursor="pointer"
        //     _hover={{ bg: "rgba(255,255,255,0.25)", borderColor: "white" }}
        //     transition="all 0.2s"
        //     style={{
        //           filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
        //         }}
        //   >
        //     Registrarse
        //   </Box>
        // </Flex>
        <Flex align="center" gap={{ base: 4, md: 6 }}>
          <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/videos")}
            color="rgba(255,255,255,0.85)"
            _hover={{ color: "white" }}
            transition="color 0.2s"
          >
            <VideosIcon color="currentColor" size="28px" />
            <Text
              display={{ base: "none", md: "block" }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="500"
              letterSpacing="0.04em"
              style={{
                filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
              }}
            >
              Vídeos
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
              style={{
                filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
              }}
            >
              Cursos
            </Text>
          </Flex>

          <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/libros")}
            color="rgba(255,255,255,0.85)"
            _hover={{ color: "white" }}
            transition="color 0.2s"
          >
            <LibrosIcon color="currentColor" size={{ base: "28px", md: "32px" } as any} />
            <Text
              display={{ base: "none", md: "block" }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="500"
              letterSpacing="0.04em"
              style={{
                filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
              }}
            >
              Libros
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default SiteHeader;
