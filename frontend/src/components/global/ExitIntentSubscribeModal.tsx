import React, { useEffect, useState } from "react";
import {
  Box, Flex, Text, Input, Image,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../../GlobalVariables";

const SHOWN_KEY = "exitIntentShownAt";
const DISMISSED_KEY = "exitIntentDismissed";
const ARM_DELAY_MS = 3000;
const MOBILE_FALLBACK_MS = 35000;
const ENGAGEMENT_SCROLL_RATIO = 0.35;
const FAST_UP_SCROLL_PX = 220;
const FAST_UP_SCROLL_MS = 350;
const NEAR_TOP_PX = 80;

// El popup de suscripción es SOLO para visitantes NO registrados y NUNCA debe
// salir dentro del mapa/recorrido (rutas /metodo/...). Este guard se comprueba
// tanto al montar como en el momento de disparar (el usuario puede haberse
// registrado o navegado al recorrido después de armar los listeners).
function bloqueado(): boolean {
  if (typeof window === "undefined") return true;
  if (localStorage.getItem("userId")) return true; // usuario registrado
  if (window.location.pathname.startsWith("/metodo")) return true; // dentro del mapa/recorrido
  return false;
}

function shouldSkip(): boolean {
  if (typeof window === "undefined") return true;
  if (localStorage.getItem(DISMISSED_KEY)) return true;
  // «Ya se ha enseñado» es POR VISITA, a propósito: en localStorage no volvería
  // a salir nunca a quien vuelva otro día sin haberlo cerrado.
  if (sessionStorage.getItem(SHOWN_KEY)) return true;
  if (bloqueado()) return true;
  return false;
}

export function ExitIntentSubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "invalid">("idle");

  useEffect(() => {
    if (shouldSkip()) return;

    const isTouch = window.matchMedia?.("(pointer: coarse)").matches ?? false;

    let armed = false;
    let triggered = false;
    const armTimer = window.setTimeout(() => { armed = true; }, ARM_DELAY_MS);

    const trigger = () => {
      if (triggered) return;
      // Revalida en el instante de disparar: si el usuario se registró o entró
      // al mapa/recorrido tras armar los listeners, no se muestra.
      if (bloqueado()) return;
      triggered = true;
      sessionStorage.setItem(SHOWN_KEY, String(Date.now()));
      setIsOpen(true);
      cleanup();
    };

    // Desktop: cursor leaves through the top of the viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (!armed) return;
      if (e.clientY > 0) return;
      trigger();
    };

    // Mobile: engagement + fast upward scroll OR back-to-top OR time fallback
    let engaged = false;
    let lastY = window.scrollY;
    let lastT = Date.now();
    let mobileFallbackTimer: number | null = null;

    const armMobileFallback = () => {
      if (mobileFallbackTimer != null) return;
      mobileFallbackTimer = window.setTimeout(() => {
        if (armed && engaged) trigger();
      }, MOBILE_FALLBACK_MS);
    };

    const handleScroll = () => {
      if (!armed) return;
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? y / docHeight : 0;

      if (!engaged && (ratio >= ENGAGEMENT_SCROLL_RATIO || y >= 700)) {
        engaged = true;
        armMobileFallback();
      }

      if (engaged) {
        const now = Date.now();
        const dy = lastY - y; // positive => scrolling up
        const dt = now - lastT;
        if (dy >= FAST_UP_SCROLL_PX && dt <= FAST_UP_SCROLL_MS) {
          trigger();
          return;
        }
        if (y <= NEAR_TOP_PX && lastY > NEAR_TOP_PX + 40) {
          trigger();
          return;
        }
      }

      lastY = y;
      lastT = Date.now();
    };

    const cleanup = () => {
      window.clearTimeout(armTimer);
      if (mobileFallbackTimer != null) window.clearTimeout(mobileFallbackTimer);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };

    if (isTouch) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    } else {
      document.addEventListener("mouseleave", handleMouseLeave);
      // Also enable scroll trigger on desktop as a backup (e.g., touchpad-only users)
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return cleanup;
  }, []);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = () => {
    if (!email || !isValidEmail(email)) {
      setStatus("invalid");
      return;
    }
    axios.post(`${API_URL}/subscribe`, { email }).catch(() => {});
    localStorage.setItem(DISMISSED_KEY, "subscribed");
    setStatus("ok");
    setEmail("");
  };

  const handleClose = () => {
    localStorage.setItem(DISMISSED_KEY, "closed");
    setIsOpen(false);
  };

  const COLOR = "white";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.65)" sx={{ backdropFilter: "blur(6px)" }} />
      <ModalContent
        bg="rgba(0, 128, 128, 0.92)"
        border="1px solid rgba(255,255,255,0.35)"
        borderRadius="2xl"
        boxShadow="0 16px 60px rgba(0,0,0,0.5), 0 0 50px rgba(107,196,200,0.35)"
        mx={{ base: 4, md: 0 }}
        fontFamily="'EB Garamond', serif"
        sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      >
        <ModalCloseButton color="rgba(255,255,255,0.85)" top={4} right={4} />
        <ModalBody px={{ base: 6, md: 8 }} py={{ base: 8, md: 10 }} textAlign="center">
          {status === "ok" ? (
            <Flex direction="column" align="center" gap={3} py={2}>
              <Text fontSize="4xl" lineHeight="1" color={COLOR}>✓</Text>
              <Text
                color={COLOR}
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                letterSpacing="0.05em"
              >
                Registrado correctamente
              </Text>
              <Text
                color="rgba(255,255,255,0.75)"
                fontSize={{ base: "md", md: "lg" }}
                fontStyle="italic"
              >
                Gracias por querer aprender
              </Text>
              <Box
                as="button"
                mt={3}
                onClick={() => setIsOpen(false)}
                px={7} py={2.5}
                borderRadius="full"
                border="1.5px solid rgba(255,255,255,0.55)"
                bg="transparent"
                color={COLOR}
                fontFamily="'EB Garamond', serif"
                fontSize="md"
                fontWeight="600"
                letterSpacing="0.06em"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: "rgba(255,255,255,0.18)" }}
              >
                Cerrar
              </Box>
            </Flex>
          ) : (
            <Flex direction="column" align="center" gap={4}>
              <Image
                src="/img/icono/life.png"
                h={{ base: "52px", md: "64px" }}
                objectFit="contain"
                opacity={0.9}
                mb={1}
              />
              <Text
                color={COLOR}
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                letterSpacing="0.06em"
                textShadow="0 2px 10px rgba(0,0,0,0.3)"
                lineHeight="1.2"
              >
                Antes de irte...
              </Text>
              <Text
                color="rgba(255,255,255,0.78)"
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.6"
                maxW="380px"
              >
                Suscríbete y recibe un email cuando haya contenido nuevo.
              </Text>

              <Input
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "invalid") setStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Tu email"
                type="email"
                w="100%"
                maxW="320px"
                bg="rgba(255,255,255,0.1)"
                border={status === "invalid" ? "1px solid rgba(255,130,130,0.7)" : "1px solid rgba(255,255,255,0.3)"}
                borderRadius="full"
                color={COLOR}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "md", md: "lg" }}
                px={5}
                py={3}
                textAlign="center"
                _placeholder={{ color: "rgba(255,255,255,0.45)" }}
                _focus={{ borderColor: status === "invalid" ? "rgba(255,130,130,0.9)" : "rgba(255,255,255,0.6)", boxShadow: "none" }}
              />
              {status === "invalid" && (
                <Text color="rgba(255,170,170,0.95)" fontSize="sm">
                  Introduce un email válido
                </Text>
              )}

              <Box
                as="button"
                onClick={handleSubmit}
                px={{ base: 8, md: 10 }}
                py="12px"
                borderRadius="full"
                bg="rgba(255,255,255,0.14)"
                border="1.5px solid rgba(255,255,255,0.55)"
                color={COLOR}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="700"
                letterSpacing="0.08em"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: "rgba(255,255,255,0.22)" }}
              >
                Suscribirme
              </Box>

              <Box
                as="button"
                onClick={handleClose}
                mt={1}
                px={3} py={1}
                bg="transparent"
                border="none"
                color="rgba(255,255,255,0.55)"
                fontFamily="'EB Garamond', serif"
                fontSize="sm"
                cursor="pointer"
                _hover={{ color: "rgba(255,255,255,0.85)" }}
              >
                No, gracias
              </Box>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
