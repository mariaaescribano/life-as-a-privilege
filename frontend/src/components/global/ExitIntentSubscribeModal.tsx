import React, { useEffect, useState } from "react";
import {
  Box, Flex, Text, Input,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { API_URL, FONDO_PAGINA_BEIGE, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { MandalaTinte } from "./MandalaTinte";
import { useT } from "../../i18n";
import { EnlaceBaja } from "./EnlaceBaja";

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
  const t = useT();
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

  const COLOR = T;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay bg={`${T}73`} />
      <ModalContent
        bg={FONDO_PAGINA_BEIGE}
        border={`1.5px solid ${T}`}
        borderRadius="2xl"
        boxShadow="none"
        mx={{ base: 4, md: 0 }}
        fontFamily="'EB Garamond', serif"
      >
        <ModalCloseButton color={T} top={4} right={4} />
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
                {t("suscribir.ok")}
              </Text>
              <Text
                color={`${T}cc`}
                fontSize={{ base: "md", md: "lg" }}
                fontStyle="italic"
              >
                {t("suscribir.gracias")}
              </Text>
              <Box
                as="button"
                mt={3}
                onClick={() => setIsOpen(false)}
                px={7} py={2.5}
                borderRadius="full"
                border={`1.5px solid ${T}`}
                bg="transparent"
                color={COLOR}
                fontFamily="'EB Garamond', serif"
                fontSize="md"
                fontWeight="600"
                letterSpacing="0.06em"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ bg: `${T}14` }}
              >
                {t("comun.cerrar")}
              </Box>
            </Flex>
          ) : (
            <Flex direction="column" align="center" gap={4}>
              <Box mb={1}><MandalaTinte h={{ base: "52px", md: "64px" }} /></Box>
              <Text
                color={COLOR}
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                letterSpacing="0.06em"
                lineHeight="1.2"
              >
                {t("salida.titulo")}
              </Text>
              <Text
                color={`${T}c7`}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.6"
                maxW="380px"
              >
                {t("salida.texto")}
              </Text>

              <Input
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "invalid") setStatus("idle"); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={t("suscribir.placeholder")}
                type="email"
                w="100%"
                maxW="320px"
                bg="#ffffffb3"
                border={status === "invalid" ? "1px solid #b3261e" : `1px solid ${T}55`}
                borderRadius="full"
                color={COLOR}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "md", md: "lg" }}
                px={5}
                py={3}
                textAlign="center"
                _placeholder={{ color: `${T}8c` }}
                _focus={{ borderColor: status === "invalid" ? "#b3261e" : T, boxShadow: "none" }}
              />
              {status === "invalid" && (
                <Text color="#b3261e" fontSize="sm">
                  {t("suscribir.invalido")}
                </Text>
              )}

              <Box
                as="button"
                onClick={handleSubmit}
                px={{ base: 8, md: 10 }}
                py="12px"
                borderRadius="full"
                bg={T}
                border={`1.5px solid ${T}`}
                color={FONDO_PAGINA_BEIGE}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="700"
                letterSpacing="0.08em"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ opacity: 0.92 }}
              >
                {t("suscribir.boton")}
              </Box>

              <Box
                as="button"
                onClick={handleClose}
                mt={1}
                px={3} py={1}
                bg="transparent"
                border="none"
                color={`${T}99`}
                fontFamily="'EB Garamond', serif"
                fontSize="sm"
                cursor="pointer"
                _hover={{ color: T }}
              >
                {t("salida.noGracias")}
              </Box>

              <EnlaceBaja mt={0} color={`${T}99`} colorHover={T} />
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
