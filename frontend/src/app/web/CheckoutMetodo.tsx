import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import SuccessErrorMessage from "../../components/global/SuccessErrorMessage";
import type { SuccessErrorMessageDto } from "../../components/global/SuccessErrorMessage";
import { API_URL } from "../../GlobalVariables";
import { gestionaError } from "../../GlobalHelper";

const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

export default function CheckoutMetodo() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagado, setPagado] = useState(false);
  const [message, setMessage] = useState<SuccessErrorMessageDto | null>(null);
  const resumenReveal = useReveal(0.15);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      navigate("/signIn?next=/checkoutMetodo", { replace: true });
      return;
    }
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
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
        description: "Tu acceso a la primera disciplina ya está activo.",
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

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "60px", md: "80px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 11px rgba(255,255,255,0.78)) drop-shadow(0 0 26px rgba(255,255,255,0.42)) drop-shadow(0 0 52px rgba(180,255,245,0.32))" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-12deg)"}
          transition="opacity 1s ease 0.1s, transform 1s ease 0.1s"
        />
      </Flex>

      {/* ── TÍTULO ── */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 8, md: 10 }}
        gap={{ base: 8, md: 12 }}
      >
        <Text
          color="white"
          fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 18px rgba(255,255,255,0.85), 0 0 38px rgba(255,255,255,0.55), 0 0 70px rgba(180,255,245,0.45)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          Empezar el Recorrido
        </Text>
        <Box
          w="100%"
          maxW="500px"
          h="1px"
          bg="rgba(255,255,255,0.15)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "scaleX(1)" : "scaleX(0.2)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        />
      </Flex>

      {/* ── RESUMEN ── */}
      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} pt={{ base: 14, md: 18 }} pb={{ base: 24, md: 32 }}>
        <Flex
          ref={resumenReveal.ref}
          direction="column"
          align="center"
          w={{ base: "100%", sm: "520px" }}
          gap={{ base: 8, md: 10 }}
          opacity={resumenReveal.visible ? 1 : 0}
          transform={resumenReveal.visible ? "translateY(0)" : "translateY(28px)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >

          {/* Etiqueta */}
          <Text
            color="rgba(255,255,255,0.75)"
            fontSize={{ base: "xs", md: "sm" }}
            letterSpacing="0.22em"
            textTransform="uppercase"
            fontWeight="600"
            textShadow="0 0 8px rgba(255,255,255,0.35)"
          >
            Primera disciplina
          </Text>

          {/* Nombre disciplina */}
          <Text
            color="white"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            textAlign="center"
            textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.3)"
          >
            Astrología
          </Text>

          {/* Línea decorativa */}
          <Box
            w={{ base: "80px", md: "120px" }}
            h="1px"
            bg="linear-gradient(to right, transparent, rgba(255,255,255,0.7), transparent)"
            boxShadow="0 0 8px rgba(255,255,255,0.5)"
          />

          {/* Precio */}
          {!pagado && (
            <Flex direction="column" align="center" gap={2}>
              <Text
                color="white"
                fontSize={{ base: "6xl", md: "7xl" }}
                fontWeight="700"
                lineHeight="1"
                textShadow="0 0 20px rgba(255,255,255,0.75), 0 0 42px rgba(255,255,255,0.4), 0 0 80px rgba(180,255,245,0.35)"
              >
                20 €
              </Text>
              <Text
                color="rgba(255,255,255,0.7)"
                fontSize={{ base: "sm", md: "md" }}
                fontStyle="italic"
                letterSpacing="0.04em"
                textAlign="center"
                maxW="380px"
                lineHeight="1.6"
                textShadow="0 0 6px rgba(255,255,255,0.25)"
              >
                cuando termines, podrás abonar la siguiente disciplina
              </Text>
            </Flex>
          )}

          {/* Aviso simulacro */}
          {!pagado && (
            <Text
              color="rgba(255,235,170,0.9)"
              fontSize="sm"
              letterSpacing="0.06em"
              fontStyle="italic"
              textAlign="center"
              textShadow="0 0 8px rgba(255,235,170,0.35)"
              maxW="380px"
              lineHeight="1.6"
            >
              Modo simulacro · este pago no carga ninguna tarjeta real.
            </Text>
          )}

          {message && (
            <SuccessErrorMessage
              soy={message.soy}
              title={message.title}
              description={message.description}
              onClick={() => setMessage(null)}
            />
          )}

          {/* Botón pagar o confirmación */}
          {!pagado ? (
            <Flex
              as="button"
              onClick={loading ? undefined : simularPago}
              align="center"
              justify="center"
              gap={{ base: 4, md: 5 }}
              px={{ base: 12, md: 16 }}
              py={{ base: "16px", md: "20px" }}
              borderRadius="full"
              border="1.5px solid rgba(255,255,255,0.65)"
              bg="rgba(255,255,255,0.10)"
              cursor={loading ? "not-allowed" : "pointer"}
              opacity={loading ? 0.6 : 1}
              boxShadow="0 0 22px rgba(255,255,255,0.4), 0 0 50px rgba(255,255,255,0.22), 0 0 90px rgba(180,255,245,0.25), 0 6px 20px rgba(0,0,0,0.2)"
              _hover={loading ? {} : {
                bg: "rgba(255,255,255,0.2)",
                borderColor: "white",
                boxShadow: "0 0 34px rgba(255,255,255,0.6), 0 0 70px rgba(180,255,245,0.45), 0 8px 24px rgba(0,0,0,0.25)",
                transform: "translateY(-2px)",
              }}
              transition="all 0.25s ease"
              mt={2}
              minW={{ base: "280px", md: "360px" }}
            >
              <Image
                src="/img/icono/life.png"
                alt=""
                h={{ base: "30px", md: "38px" }}
                objectFit="contain"
                flexShrink={0}
                style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.75)) drop-shadow(0 0 24px rgba(255,255,255,0.4))" }}
              />
              <Text
                color="white"
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "lg", md: "2xl" }}
                letterSpacing="0.2em"
                textTransform="uppercase"
                textShadow="0 0 14px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(180,255,245,0.3)"
              >
                Pagar 20 €
              </Text>
            </Flex>
          ) : (
            <Flex direction="column" align="center" gap={4} py={4}>
              <Text
                fontSize="6xl"
                color="white"
                lineHeight="1"
                sx={{
                  filter: "drop-shadow(0 0 14px rgba(255,255,255,0.7)) drop-shadow(0 0 32px rgba(180,255,245,0.4))",
                }}
              >
                ✓
              </Text>
              <Text
                color="white"
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                letterSpacing="0.04em"
                textAlign="center"
                textShadow="0 0 12px rgba(255,255,255,0.6), 0 0 28px rgba(255,255,255,0.3)"
              >
                Te llevamos a tu espacio…
              </Text>
            </Flex>
          )}

          {/* Aviso seguro */}
          {!pagado && (
            <Text
              color="rgba(255,255,255,0.55)"
              fontSize="xs"
              letterSpacing="0.06em"
              fontStyle="italic"
              textAlign="center"
              textShadow="0 0 6px rgba(255,255,255,0.25)"
            >
              Pago seguro a través de Stripe
            </Text>
          )}

        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
