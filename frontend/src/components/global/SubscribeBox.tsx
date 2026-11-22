import React, { useEffect, useState } from "react";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import { API_URL, FONDO_PAGINA_BEIGE, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { MandalaTinte } from "./MandalaTinte";
import { useIdioma } from "../../i18n";
import { EnlaceBaja } from "./EnlaceBaja";
import { useVistoConEspera } from "../../hooks/useVistoConEspera";

export function SubscribeBox({ esperaInicial = 0 }: { esperaInicial?: number } = {}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "invalid" | "error">("idle");
  const reveal = useVistoConEspera("0px 0px -18% 0px", esperaInicial);
  const { t, idioma } = useIdioma();
  const [nombre, setNombre] = useState("");

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async () => {
    if (status === "loading") return;
    if (!email || !isValidEmail(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    try {
      await axios.post(`${API_URL}/subscribe`, { email: email.trim(), nombre: nombre.trim(), idioma });
      setStatus("ok");
      setEmail("");
      setNombre("");
    } catch (err) {
      setStatus("error");
    }
  };

  // Reset to idle after 3 seconds of success
  useEffect(() => {
    if (status !== "ok") return;
    const t = setTimeout(() => setStatus("idle"), 3000);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <Flex ref={reveal.ref} direction="column" align="center" w="100%" maxW="900px" mt={10} gap={{ base: 8, md: 10 }}>
      {/* Separador con mandala en medio y líneas degradadas a los lados */}
      {/* {!hideSeparator && (
        <Flex
          align="center"
          justify="center"
          gap={{ base: 4, md: 6 }}
          mb={{ base: 4, md: 6 }}
          opacity={reveal.visible ? 1 : 0}
          transform={reveal.visible ? "scaleX(1)" : "scaleX(0.85)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >
          <Box
            h="1px"
            w={{ base: "60px", md: "150px" }}
            bg="linear-gradient(to right, transparent, rgba(255,255,255,0.55))"
          />
          <Image
            src="/img/icono/life.webp"
            alt=""
            h={{ base: "26px", md: "34px" }}
            objectFit="contain"
            flexShrink={0}
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.32)) drop-shadow(0 0 18px rgba(255,255,255,0.15))" }}
          />
          <Box
            h="1px"
            w={{ base: "60px", md: "150px" }}
            bg="linear-gradient(to left, transparent, rgba(255,255,255,0.55))"
          />
        </Flex>
      )} */}

      <Box
        w="100%"
        maxW="560px"
        bg="transparent"
        border={`1.5px solid ${T}`}
        borderRadius="3xl"
        px={{ base: 7, md: 10 }}
        py={{ base: 8, md: 10 }}
        textAlign="center"
        opacity={reveal.visible ? 1 : 0}
        transform={reveal.visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)"}
        transition="opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s"
      >
        <Box mx="auto" mb={4}><MandalaTinte h={{ base: "48px", md: "60px" }} /></Box>
        <Text
          color={T}
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="700"
          fontFamily="'EB Garamond', serif"
          letterSpacing="0.08em"
          mb={2}
        >
          {t("suscribir.titulo")}
        </Text>
        <Text
          color={`${T}b3`}
          fontSize={{ base: "md", md: "lg" }}
          fontFamily="'EB Garamond', serif"
          mb={6}
          lineHeight="1.6"
        >
          {t("suscribir.texto")}
        </Text>

        {status === "ok" ? (
          <Flex direction="column" align="center" gap={2} py={2}>
            <Text fontSize="3xl" lineHeight="1">✓</Text>
            <Text
              color={T}
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="600"
              fontFamily="'EB Garamond', serif"
            >
              {t("suscribir.ok")}
            </Text>
            <Text
              color={`${T}cc`}
              fontSize={{ base: "md", md: "lg" }}
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
            >
              {t("suscribir.gracias")}
            </Text>
          </Flex>
        ) : (
          <Flex direction="column" align="center" gap={{ base: 8, md: 10 }}>
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={t("welcome.hero.nombre")}
              aria-label={t("welcome.hero.nombre")}
              autoComplete="name"
              maxLength={120}
              w="100%"
              maxW="320px"
              bg="#ffffffb3"
              border={`1px solid ${T}55`}
              borderRadius="full"
              color={T}
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }}
              px={5}
              py={3}
              textAlign="center"
              _placeholder={{ color: `${T}8c` }}
              _focus={{ borderColor: T, boxShadow: "none" }}
            />
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
              color={T}
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }}
              px={5}
              py={3}
              textAlign="center"
              _placeholder={{ color: `${T}8c` }}
              _focus={{ borderColor: status === "invalid" ? "#b3261e" : T, boxShadow: "none" }}
            />
            {status === "invalid" && (
              <Text color="#b3261e" fontSize="sm" fontFamily="'EB Garamond', serif">
                {t("suscribir.invalido")}
              </Text>
            )}
            {status === "error" && (
              <Text color="#b3261e" fontSize="sm" fontFamily="'EB Garamond', serif">
                {t("suscribir.error")}
              </Text>
            )}
            <Box
              as="button"
              onClick={handleSubmit}
              disabled={status === "loading"}
              px={{ base: 8, md: 10 }}
              py="12px"
              borderRadius="full"
              bg={T}
              border={`1.5px solid ${T}`}
              color={FONDO_PAGINA_BEIGE}
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="700"
              letterSpacing="0.16em"
              textTransform="uppercase"
              cursor={status === "loading" ? "not-allowed" : "pointer"}
              opacity={status === "loading" ? 0.6 : 1}
              _hover={status === "loading" ? {} : { opacity: 0.92, transform: "translateY(-2px)" }}
              transition="all 0.2s"
              whiteSpace="nowrap"
            >
              {status === "loading" ? t("comun.enviando") : t("suscribir.boton")}
            </Box>
          </Flex>
        )}

        {/* La salida de la lista, a la vista desde el momento de entrar. */}
        <EnlaceBaja mt={6} color={`${T}99`} colorHover={T} />
      </Box>
    </Flex>
  );
}
