import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import { API_URL } from "../../GlobalVariables";
import { gestionaError } from "../../GlobalHelper";

export default function CheckoutMetodo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<SuccessErrorMessageDto | null>(null);
  const [pagado, setPagado] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      navigate("/signIn?next=/checkoutMetodo", { replace: true });
    }
  }, []);

  const simularPago = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        `${API_URL}/payment/simulate-method`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPagado(true);
      setMessage({
        soy: 1,
        title: "¡Pago realizado!",
        description: "Te hemos enviado un email de bienvenida.",
      });
    } catch (err: any) {
      setMessage(gestionaError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pagado) {
      const timer = setTimeout(() => navigate("/home", { replace: true }), 2800);
      return () => clearTimeout(timer);
    }
  }, [pagado]);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      {loading && <SpinnerTurquesa />}

      <SiteHeader variant="auto" />

      <Flex flex="1" align="flex-start" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <VStack w={{ base: "100%", md: "560px" }} spacing={6} align="stretch">

          {/* Cabecera */}
          <Flex direction="column" align="center" gap={3}>
            <Image src="/img/icono/life.png" h={{ base: "60px", md: "72px" }} objectFit="contain" />
            <Text
              color="white"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="700"
              letterSpacing="0.05em"
              textAlign="center"
              textShadow="0 2px 12px rgba(0,80,70,0.4)"
            >
              Tu acceso al Método
            </Text>
          </Flex>

          {/* Resumen del pedido */}
          <Box
            bg="rgba(255,255,255,0.14)"
            border="1px solid rgba(255,255,255,0.4)"
            sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
            borderRadius="2xl"
            boxShadow="0 8px 36px rgba(107,196,200,0.4)"
            px={{ base: 7, md: 10 }}
            py={{ base: 7, md: 9 }}
          >
            <Text color="rgba(255,255,255,0.65)" fontSize="sm" letterSpacing="0.18em" textTransform="uppercase" mb={3} textAlign="center">
              Resumen del pedido
            </Text>

            <Box h="1px" mb={5} mx="auto" w="60%" bgGradient="linear(to-r, transparent, rgba(255,255,255,0.45), transparent)" />

            <Flex justify="space-between" align="baseline" mb={2}>
              <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="600">
                Pack completo del Método
              </Text>
              <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700">
                70 €
              </Text>
            </Flex>

            <Text color="rgba(255,255,255,0.78)" fontSize="sm" lineHeight="1.7" mb={3}>
              Acceso a todos los cursos y materiales grabados durante 1 año desde la compra.
            </Text>

            <Box h="1px" my={5} bg="rgba(255,255,255,0.18)" />

            <Flex justify="space-between" align="baseline">
              <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "md", md: "lg" }} fontWeight="600" letterSpacing="0.04em">
                Total a pagar
              </Text>
              <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700">
                70 €
              </Text>
            </Flex>
          </Box>

          {/* Aviso simulacro */}
          {!pagado && (
            <Box
              bg="rgba(255,235,170,0.18)"
              border="1px solid rgba(255,235,170,0.4)"
              borderRadius="xl"
              px={5}
              py={4}
              textAlign="center"
            >
              <Text color="rgba(255,250,220,0.95)" fontSize="sm" lineHeight="1.6" letterSpacing="0.02em">
                Modo simulacro · este pago no carga ninguna tarjeta real.
              </Text>
            </Box>
          )}

          {message && (
            <SuccessErrorMessage
              soy={message.soy}
              title={message.title}
              description={message.description}
              onClick={() => setMessage(null)}
            />
          )}

          {/* Botón pagar */}
          {!pagado ? (
            <Box
              as="button"
              onClick={loading ? undefined : simularPago}
              w="100%"
              py={{ base: 4, md: 5 }}
              borderRadius="full"
              bg="white"
              color="#008080"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              letterSpacing="0.1em"
              cursor={loading ? "not-allowed" : "pointer"}
              opacity={loading ? 0.6 : 1}
              boxShadow="0 8px 28px rgba(255,255,255,0.25)"
              transition="all 0.25s ease"
              _hover={loading ? {} : {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 36px rgba(255,255,255,0.35)",
              }}
            >
              Pagar 70 € (simulado)
            </Box>
          ) : (
            <Flex direction="column" align="center" gap={3} py={4}>
              <Text fontSize="4xl" color="white">✓</Text>
              <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.04em" textAlign="center">
                Te llevamos a tu espacio...
              </Text>
            </Flex>
          )}

          {!pagado && (
            <Flex justify="center">
              <Text
                as="button"
                onClick={() => navigate("/elMetodo")}
                color="rgba(255,255,255,0.7)"
                fontSize="sm"
                letterSpacing="0.04em"
                bg="transparent"
                cursor="pointer"
                _hover={{ color: "white", textDecoration: "underline" }}
              >
                ← Volver
              </Text>
            </Flex>
          )}

        </VStack>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
