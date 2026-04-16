import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "../../GlobalVariables";

export function SubscribeBox() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "invalid">("idle");

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = () => {
    if (!email || !isValidEmail(email)) {
      setStatus("invalid");
      return;
    }
    axios.post(`${API_URL}/subscribe`, { email }).catch(() => {});
    setStatus("ok");
    setEmail("");
  };

  // Reset to idle after 3 seconds of success
  useEffect(() => {
    if (status !== "ok") return;
    const t = setTimeout(() => setStatus("idle"), 3000);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <Flex direction="column" align="center" w="100%" maxW="900px" mt={10} gap={{ base: 8, md: 10 }}>
      <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.15)" />

      <Box
        w="100%"
        maxW="560px"
        bg="rgba(255,255,255,0.07)"
        border="1.5px solid rgba(255,255,255,0.18)"
        borderRadius="3xl"
        px={{ base: 7, md: 10 }}
        py={{ base: 8, md: 10 }}
        sx={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
        textAlign="center"
      >
        <Image
          src="/img/icono/life.png"
          h={{ base: "48px", md: "60px" }}
          objectFit="contain"
          mx="auto"
          mb={4}
          opacity={0.85}
        />
        <Text
          color="white"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="700"
          fontFamily="'EB Garamond', serif"
          letterSpacing="0.08em"
          mb={2}
          textShadow="0 2px 8px rgba(0,0,0,0.3)"
        >
          ¡No te pierdas ningún curso!
        </Text>
        <Text
          color="rgba(255,255,255,0.65)"
          fontSize={{ base: "md", md: "lg" }}
          fontFamily="'EB Garamond', serif"
          mb={6}
          lineHeight="1.6"
        >
          Suscríbete y recibe un email cuando haya uno nuevo
        </Text>

        {status === "ok" ? (
          <Flex direction="column" align="center" gap={2} py={2}>
            <Text fontSize="3xl" lineHeight="1">✓</Text>
            <Text
              color="white"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="600"
              fontFamily="'EB Garamond', serif"
            >
              Registrado correctamente
            </Text>
            <Text
              color="rgba(255,255,255,0.7)"
              fontSize={{ base: "md", md: "lg" }}
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
            >
              Gracias por querer aprender
            </Text>
          </Flex>
        ) : (
          <Flex direction="column" align="center" gap={4}>
            <Input
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === "invalid") setStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Tu email"
              type="email"
              w="100%"
              maxW="320px"
              bg="rgba(255,255,255,0.08)"
              border={status === "invalid" ? "1px solid rgba(255,130,130,0.6)" : "1px solid rgba(255,255,255,0.25)"}
              borderRadius="full"
              color="white"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }}
              px={5}
              py={3}
              textAlign="center"
              _placeholder={{ color: "rgba(255,255,255,0.4)" }}
              _focus={{ borderColor: status === "invalid" ? "rgba(255,130,130,0.8)" : "rgba(255,255,255,0.5)", boxShadow: "none" }}
            />
            {status === "invalid" && (
              <Text color="rgba(255,150,150,0.9)" fontSize="sm" fontFamily="'EB Garamond', serif">
                Introduce un email válido
              </Text>
            )}
            <Box
              as="button"
              onClick={handleSubmit}
              px={{ base: 8, md: 10 }}
              py="12px"
              borderRadius="full"
              bg="rgba(255,255,255,0.12)"
              border="1.5px solid rgba(255,255,255,0.5)"
              color="white"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="700"
              letterSpacing="0.08em"
              cursor="pointer"
              transition="all 0.2s"
              whiteSpace="nowrap"
            >
              Suscribirme
            </Box>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
