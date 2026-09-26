import React, { useEffect } from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import { useT } from "../../i18n";

/**
 * Popup que sale al crear la cuenta: la cuenta no se puede usar hasta pulsar el
 * enlace del correo de bienvenida, así que aquí se le dice a dónde lo hemos
 * mandado. No se cierra pulsando fuera a propósito: es el único aviso de que
 * tiene que ir al correo, y un toque sin querer lo perdería.
 */
export function MiraTuCorreoModal({
  isOpen,
  email,
  onAceptar,
}: {
  isOpen: boolean;
  email: string;
  onAceptar: () => void;
}) {
  const t = useT();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

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
      px={{ base: 5, md: 10 }}
    >
      <Box
        role="dialog"
        aria-modal="true"
        bg="rgba(0,90,80,0.92)"
        border="1px solid rgba(255,255,255,0.3)"
        sx={{ backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)" }}
        borderRadius="3xl"
        boxShadow="0 28px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.1)"
        p={{ base: 8, md: 12 }}
        maxW="460px"
        w="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={5}
        textAlign="center"
        fontFamily="'EB Garamond', serif"
      >
        <Image
          src="/img/icono/life.webp"
          alt=""
          w="90px"
          objectFit="contain"
          filter="drop-shadow(0 4px 12px rgba(255, 255, 255, 0.35))"
        />

        <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.06em">
          {t("auth.signin.miraCorreo")}
        </Text>

        <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">
          {t("auth.signin.miraCorreoTexto")}
        </Text>

        {email && (
          <Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight="700" wordBreak="break-all">
            {email}
          </Text>
        )}

        <Text color="rgba(255,255,255,0.8)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
          {t("auth.signin.miraCorreoSpam")}
        </Text>

        <Box
          as="button"
          onClick={onAceptar}
          mt={2}
          color="white"
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
          {t("auth.signin.entendido")}
        </Box>
      </Box>
    </Box>
  );
}
