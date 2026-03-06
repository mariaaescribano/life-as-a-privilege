import React, { useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { AprendizajeIcon, EspacioPersonalIcon } from "../../GlobalVariables";

const ProductosNaturalesIcon = ({ size = "28px", color = "currentColor" }: { size?: string; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={color}>
    <path d="M480-200q0-100-70-170t-170-70q0 100 70 170t170 70Zm44-220q18-18 18-44v-6q8 6 16.5 9t19.5 3q26 0 44-18t18-44q0-20-9.5-35T604-576q17-6 26.5-21t9.5-35q0-26-18-44t-44-18q-11 0-19.5 3t-16.5 9v-6q0-26-18-44t-44-18q-26 0-44 18t-18 44v6q-8-6-16.5-9t-19.5-3q-26 0-44 18t-18 44q0 20 9.5 35t26.5 21q-17 6-26.5 21t-9.5 35q0 26 18 44t44 18q11 0 19.5-3t16.5-9v6q0 26 18 44t44 18q26 0 44-18Zm-88-111.5Q418-549 418-576q0-26 18-44t44-18q26 0 44 18t18 44q0 27-18 44.5T480-514q-26 0-44-17.5ZM480-200q100 0 170-70t70-170q-100 0-170 70t-70 170ZM160-80q-33 0-56.5-23.5T80-160v-640q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v640q0 33-23.5 56.5T800-80H160Zm0-80h640v-640H160v640Zm0 0v-640 640Z"/>
  </svg>
);

const ReelsIcon = ({ size = "28px", color = "currentColor" }: { size?: string; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={color}>
    <path d="m380-300 280-180-280-180v360ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/>
  </svg>
);

const LoginIcon = ({ size = "28px", color = "currentColor" }: { size?: string; color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 -960 960 960" width={size} fill={color}>
    <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z"/>
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
              style={{
                filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
              }}
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
              style={{
                filter: "drop-shadow(4px 4px 6px rgba(0,0,0,0.5))"
              }}
            >
              Aprendizajes
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
        
        <Flex align="center" gap={{ base: 3, md: 6 }}>
          <Flex
            align="center" gap={2} cursor="pointer"
            onClick={() => navigate("/logIn")}
            color="rgba(255,255,255,0.85)"
            _hover={{ color: "white" }}
            transition="color 0.2s"
          >
            <LoginIcon size="28px" color="currentColor" />
            <Text
              display={{ base: "none", md: "block" }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="500"
              letterSpacing="0.04em"
              textShadow="0 1px 4px rgba(0,80,70,0.5)"
            >
              Inicio de sesión
            </Text>
          </Flex>

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
