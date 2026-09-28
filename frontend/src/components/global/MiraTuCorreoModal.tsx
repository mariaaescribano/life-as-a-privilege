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
      {/* La caja va en el turquesa de la plataforma (#008080), como el popup de
          las condiciones y los modales del panel: nada de verdes propios. */}
      <Box
        role="dialog"
        aria-modal="true"
        bg="#008080"
        border="1px solid rgba(255,255,255,0.3)"
        borderRadius="3xl"
        boxShadow="0 0 42px rgba(255,255,255,0.1), 0 0 100px rgba(180,255,245,0.06), 0 22px 60px rgba(0,0,0,0.6)"
        p={{ base: 8, md: 11 }}
        maxW="460px"
        w="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
        textAlign="center"
        fontFamily="'EB Garamond', serif"
      >
        <Image
          src="/img/icono/life.webp"
          alt=""
          h={{ base: "44px", md: "52px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.55)) drop-shadow(0 0 22px rgba(255,255,255,0.28)) drop-shadow(0 0 44px rgba(180,255,245,0.2))" }}
        />

        <Text
          color="white"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="700"
          letterSpacing="0.06em"
          textShadow="0 0 14px rgba(255,255,255,0.5), 0 0 30px rgba(180,255,245,0.25)"
        >
          {t("auth.signin.miraCorreo")}
        </Text>

        {/* rayita fina de tinta bajo el título */}
        <Box
          w="72px"
          h="1px"
          bg="linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)"
        />

        <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">
          {t("auth.signin.miraCorreoTexto")}
        </Text>

        {/* El email, en su pastilla: es el dato que hay que retener. */}
        {email && (
          <Box
            px={5}
            py={2}
            borderRadius="full"
            bg="rgba(255,255,255,0.1)"
            border="1px solid rgba(255,255,255,0.35)"
            maxW="100%"
          >
            <Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight="700" wordBreak="break-all">
              {email}
            </Text>
          </Box>
        )}

        <Text color="rgba(255,255,255,0.7)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" fontStyle="italic">
          {t("auth.signin.miraCorreoSpam")}
        </Text>

        <Box
          as="button"
          onClick={onAceptar}
          mt={2}
          color="white"
          fontWeight="700"
          fontSize={{ base: "md", md: "lg" }}
          letterSpacing="0.12em"
          textTransform="uppercase"
          px={10}
          py={3}
          borderRadius="full"
          border="1.5px solid rgba(255,255,255,0.65)"
          bg="rgba(255,255,255,0.12)"
          cursor="pointer"
          boxShadow="0 0 16px rgba(255,255,255,0.2), 0 2px 12px rgba(0,0,0,0.25)"
          _hover={{ bg: "rgba(255,255,255,0.24)", borderColor: "white", boxShadow: "0 0 26px rgba(255,255,255,0.35)", transform: "translateY(-1px)" }}
          transition="all 0.22s ease"
        >
          {t("auth.signin.entendido")}
        </Box>
      </Box>
    </Box>
  );
}
