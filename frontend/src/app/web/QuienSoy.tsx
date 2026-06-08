import {
  Box, Flex, Image, SimpleGrid, Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";

const heartbeat = keyframes`
  0%   { transform: scale(1); }
  14%  { transform: scale(1.28); }
  28%  { transform: scale(1); }
  42%  { transform: scale(1.18); }
  60%  { transform: scale(1); }
  100% { transform: scale(1); }
`;

const useReveal = (threshold = 0.15) => {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [el, threshold]);
  return { ref: setEl, visible };
};

const DONATION_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";

type Certificado = { img: string };

const certificados: Certificado[] = [
  { img: "/certificados/0.png" },
  { img: "/certificados/1.png" }, { img: "/certificados/2.png" }, { img: "/certificados/3.png" },
  { img: "/certificados/4.png" }, { img: "/certificados/5.png" }, { img: "/certificados/6.png" },
  { img: "/certificados/7.png" }, { img: "/certificados/8.png" }, { img: "/certificados/9.png" },
  { img: "/certificados/10.png" }, { img: "/certificados/11.png" }, { img: "/certificados/12.png" },
  { img: "/certificados/13.png" }, { img: "/certificados/14.png" }, { img: "/certificados/15.png" },
  { img: "/certificados/16.png" },
  { img: "/certificados/17.png" },
  { img: "/certificados/18.png" },
  { img: "/certificados/19.png" },
  { img: "/certificados/20.png" },
  { img: "/certificados/21.png" },
  { img: "/certificados/22.png" },
  { img: "/certificados/23.png" },
  { img: "/certificados/24.png" },
  { img: "/certificados/25.png" },
  { img: "/certificados/26.png" },
];

const QuienSoy = () => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const presentacionReveal = useReveal(0.12);
  const donacionReveal = useReveal(0.15);
  const testimonioReveal = useReveal(0.2);
  const certifTitleReveal = useReveal(0.2);
  const certifReveal = useReveal(0.05);
  const cierreReveal = useReveal(0.2);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const closeLightbox = () => setLightboxIdx(null);
  const prevCert = () => setLightboxIdx(i => i !== null ? (i - 1 + certificados.length) % certificados.length : null);
  const nextCert = () => setLightboxIdx(i => i !== null ? (i + 1) % certificados.length : null);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

      {/* ── HEADER ── */}
      <SiteHeader variant="auto" />

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "60px", md: "80px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 11px rgba(255,255,255,0.59)) drop-shadow(0 0 26px rgba(255,255,255,0.32)) drop-shadow(0 0 52px rgba(180,255,245,0.24))" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-12deg)"}
          transition="opacity 1s ease 0.1s, transform 1s ease 0.1s"
        />
      </Flex>



      {/* ── PRESENTACIÓN ── */}
      <Flex
        ref={presentacionReveal.ref}
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 14, md: 18 }}
        gap={{ base: 6, md: 7 }}
      >
        {/* Foto */}
        <Box
          maxW={{ base: "260px", md: "340px" }}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="0 20px 50px rgba(0,0,0,0.35), 0 0 30px rgba(255,255,255,0.28), 0 0 60px rgba(180,255,245,0.22)"
          opacity={presentacionReveal.visible ? 1 : 0}
          transform={presentacionReveal.visible ? "scale(1)" : "scale(0.85)"}
          transition="opacity 0.85s ease, transform 0.85s ease"
        >
          <Image
            src="/img/me/me.png"
            alt="María Escribano"
            w="100%"
            h="auto"
            display="block"
          />
        </Box>

        {/* Nombre */}
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="700"
          fontFamily="'EB Garamond', serif"
          letterSpacing="0.04em"
          lineHeight="1.2"
          textShadow="0 0 14px rgba(255,255,255,0.49), 0 0 30px rgba(255,255,255,0.26), 0 0 60px rgba(180,255,245,0.22)"
          opacity={presentacionReveal.visible ? 1 : 0}
          transform={presentacionReveal.visible ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s"
        >
          María Escribano
        </Text>

        {/* Bio */}
        <Text
          color="rgba(255,255,255,0.92)"
          fontSize={{ base: "md", md: "xl" }}
          fontFamily="'EB Garamond', serif"
          lineHeight="1.95"
          letterSpacing="0.015em"
          textShadow="0 0 10px rgba(255,255,255,0.34), 0 0 22px rgba(255,255,255,0.17)"
          maxW={{ base: "100%", md: "70%" }}
          opacity={presentacionReveal.visible ? 1 : 0}
          transform={presentacionReveal.visible ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.75s ease 0.5s, transform 0.75s ease 0.5s"
        >
          Ingeniera informática, 22 años. No existía lo que he construido: un recorrido donde la psicología, la biología y los conocimientos tradicionales se combinan en vez de pelearse. Ahora son aliados.
        </Text>
        
        <Text
          color="rgba(255,255,255,0.92)"
          fontSize={{ base: "md", md: "xl" }}
          fontFamily="'EB Garamond', serif"
          lineHeight="1.95"
          letterSpacing="0.015em"
          textShadow="0 0 10px rgba(255,255,255,0.34), 0 0 22px rgba(255,255,255,0.17)"
          maxW={{ base: "100%", md: "70%" }}
          opacity={presentacionReveal.visible ? 1 : 0}
          transform={presentacionReveal.visible ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.75s ease 0.5s, transform 0.75s ease 0.5s"
        >
          Mi propósito es profundizar en la naturaleza humana, usando psicología, filosofía, ciencias biológicas y conocimientos tradicionales para ello.
        </Text>

     
        {/* Botón Contactar */}
        <Flex
          align="center"
          gap={{ base: 2, md: 3 }}
          opacity={presentacionReveal.visible ? 1 : 0}
          transform={presentacionReveal.visible ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.75s ease 0.75s, transform 0.75s ease 0.75s"
          mt={2}
        >
          <Box
            h="1px"
            w={{ base: "24px", md: "44px" }}
            bg="linear-gradient(to right, transparent, rgba(255,255,255,0.6))"
            boxShadow="0 0 6px rgba(255,255,255,0.4)"
          />
          <Flex
            as={Link}
            to="/contacto"
            align="center"
            gap={2}
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.18em"
            textTransform="uppercase"
            px={{ base: 6, md: 8 }}
            py={{ base: "9px", md: "11px" }}
            borderRadius="full"
            border="1px solid rgba(255,255,255,0.55)"
            bg="rgba(255,255,255,0.08)"
            cursor="pointer"
            boxShadow="0 0 14px rgba(255,255,255,0.3), 0 0 32px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.15)"
            textShadow="0 0 10px rgba(255,255,255,0.41), 0 0 22px rgba(255,255,255,0.22)"
            _hover={{
              bg: "rgba(255,255,255,0.18)",
              borderColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 0 24px rgba(255,255,255,0.5), 0 0 48px rgba(180,255,245,0.3), 0 6px 16px rgba(0,0,0,0.2)",
              transform: "translateY(-1px)",
            }}
            transition="all 0.25s ease"
            textDecoration="none"
          >
            Contactar
          </Flex>
          <Box
            h="1px"
            w={{ base: "24px", md: "44px" }}
            bg="linear-gradient(to left, transparent, rgba(255,255,255,0.6))"
            boxShadow="0 0 6px rgba(255,255,255,0.4)"
          />
        </Flex>
      </Flex>

      {/* ── SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 16, md: 20 }}>
        <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.15)" />
      </Flex>

      {/* ── DONACIÓN ── */}
      <Flex
        ref={donacionReveal.ref}
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 16, md: 20 }}
        gap={{ base: 5, md: 6 }}
      >
        {/* Icono corazón */}
        <Box
          w={{ base: "62px", md: "72px" }}
          h={{ base: "62px", md: "72px" }}
          borderRadius="full"
          bg="rgba(255,255,255,0.10)"
          border="1px solid rgba(255,255,255,0.4)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 0 18px rgba(255,255,255,0.4), 0 0 38px rgba(255,255,255,0.2), 0 0 60px rgba(180,255,245,0.2)"
          sx={{ animation: `${heartbeat} 1.6s ease-in-out infinite` }}
          opacity={donacionReveal.visible ? 1 : 0}
          transform={donacionReveal.visible ? "scale(1)" : "scale(0.8)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        >
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" h={{ base: "30px", md: "36px" }} w={{ base: "30px", md: "36px" }} viewBox="0 -960 960 960" fill="rgba(255,255,255,0.95)" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.49))" }}>
            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
          </Box>
        </Box>

        <Text
          color="white"
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="700"
          letterSpacing="0.05em"
          textShadow="0 0 14px rgba(255,255,255,0.49), 0 0 30px rgba(255,255,255,0.26)"
          opacity={donacionReveal.visible ? 1 : 0}
          transform={donacionReveal.visible ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.75s ease 0.25s, transform 0.75s ease 0.25s"
        >
          Apoya este proyecto
        </Text>

        <Box
          as="a"
          href={DONATION_LINK}
          target="_blank"
          rel="noopener noreferrer"
          display="inline-flex"
          alignItems="center"
          gap={3}
          px={{ base: 8, md: 10 }}
          py={{ base: "12px", md: "14px" }}
          borderRadius="full"
          border="1.5px solid rgba(255,255,255,0.6)"
          color="white"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="700"
          bg="rgba(255,255,255,0.08)"
          letterSpacing="0.18em"
          textTransform="uppercase"
          cursor="pointer"
          textDecoration="none"
          boxShadow="0 0 16px rgba(255,255,255,0.34), 0 0 36px rgba(255,255,255,0.16), 0 4px 14px rgba(0,0,0,0.18)"
          textShadow="0 0 10px rgba(255,255,255,0.45), 0 0 22px rgba(255,255,255,0.22)"
          _hover={{
            bg: "rgba(255,255,255,0.2)",
            borderColor: "white",
            boxShadow: "0 0 26px rgba(255,255,255,0.55), 0 0 54px rgba(180,255,245,0.35), 0 6px 18px rgba(0,0,0,0.22)",
            transform: "translateY(-1px)",
          }}
          opacity={donacionReveal.visible ? 1 : 0}
          transform={donacionReveal.visible ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.75s ease 0.5s, transform 0.75s ease 0.5s, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
        >
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" h="18px" w="18px" viewBox="0 -960 960 960" fill="currentColor">
            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
          </Box>
          Hacer una donación
        </Box>

        <Text
          color="rgba(255,255,255,0.55)"
          fontSize="xs"
          letterSpacing="0.06em"
          fontStyle="italic"
          textShadow="0 0 6px rgba(255,255,255,0.19)"
          opacity={donacionReveal.visible ? 1 : 0}
          transform={donacionReveal.visible ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.75s ease 0.7s, transform 0.75s ease 0.7s"
        >
          Pago seguro a través de Stripe · Cualquier importe es bienvenido
        </Text>
      </Flex>

      {/* ── TESTIMONIO ── */}
      <Flex
        ref={testimonioReveal.ref}
        direction="column"
        align="center"
        pt={{ base: 16, md: 20 }}
        gap={{ base: 5, md: 6 }}
        px={{ base: 5, md: 10, lg: 16 }}
      >
        <Box
          w="100%"
          maxW="500px"
          h="1px"
          bg="rgba(255,255,255,0.15)"
          opacity={testimonioReveal.visible ? 1 : 0}
          transform={testimonioReveal.visible ? "scaleX(1)" : "scaleX(0.2)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        />

        <Box
          as="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          w={{ base: "32px", md: "40px" }}
          h={{ base: "32px", md: "40px" }}
          fill="rgba(255,255,255,0.85)"
          style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.41)) drop-shadow(0 0 18px rgba(180,255,245,0.22))" }}
          opacity={testimonioReveal.visible ? 1 : 0}
          transform={testimonioReveal.visible ? "translateY(0)" : "translateY(10px)"}
          transition="opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s"
        >
          <path d="M580-360q42 0 71-29t29-71v-200H520v200h80q0 17-11.5 28.5T560-420h-20v60h40Zm-240 0q42 0 71-29t29-71v-200H280v200h80q0 17-11.5 28.5T320-420h-20v60h40ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Z" />
        </Box>

        <Text
          color="white"
          fontFamily="'EB Garamond', serif"
          fontStyle="italic"
          fontSize={{ base: "lg", md: "2xl" }}
          lineHeight="1.6"
          letterSpacing="0.02em"
          textAlign="center"
          maxW="700px"
          textShadow="0 0 14px rgba(255,255,255,0.41), 0 0 30px rgba(255,255,255,0.21), 0 0 60px rgba(180,255,245,0.26)"
          opacity={testimonioReveal.visible ? 1 : 0}
          transform={testimonioReveal.visible ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          Brillante, colaboradora, productiva y ética. No podría recomendarla lo suficiente.
        </Text>

        <Flex
          direction="column"
          align="center"
          gap={1}
          mt={2}
          opacity={testimonioReveal.visible ? 1 : 0}
          transform={testimonioReveal.visible ? "translateY(0)" : "translateY(14px)"}
          transition="opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s"
        >
          <Text
            color="white"
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            fontSize={{ base: "md", md: "lg" }}
            letterSpacing="0.1em"
            textTransform="uppercase"
            textShadow="0 0 10px rgba(255,255,255,0.38), 0 0 22px rgba(255,255,255,0.19)"
          >
            Drea Burbank
          </Text>
          <Text
            color="rgba(255,255,255,0.7)"
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            fontSize={{ base: "xs", md: "sm" }}
            letterSpacing="0.04em"
            textShadow="0 0 6px rgba(255,255,255,0.19)"
          >
            CEO de Savimbo
          </Text>
        </Flex>

        <Flex
          as="a"
          href="https://www.linkedin.com/in/mar%C3%ADa-escribano-arce-b58a56385/details/recommendations/"
          target="_blank"
          rel="noopener noreferrer"
          align="center"
          gap={2}
          mt={3}
          px={4}
          py={2}
          borderRadius="full"
          border="1px solid rgba(255,255,255,0.35)"
          bg="rgba(255,255,255,0.04)"
          color="rgba(255,255,255,0.85)"
          fontFamily="'EB Garamond', serif"
          fontStyle="italic"
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="0.05em"
          textDecoration="none"
          opacity={testimonioReveal.visible ? 1 : 0}
          transform={testimonioReveal.visible ? "translateY(0)" : "translateY(14px)"}
          transition="opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease"
          textShadow="0 0 6px rgba(255,255,255,0.19)"
          _hover={{
            bg: "rgba(255,255,255,0.12)",
            borderColor: "rgba(255,255,255,0.7)",
            color: "white",
            boxShadow: "0 0 14px rgba(255,255,255,0.35), 0 0 28px rgba(180,255,245,0.22)",
          }}
        >
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" w="14px" h="14px" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </Box>
          Ver carta completa en LinkedIn
        </Flex>
      </Flex>

      {/* ── SEPARADOR + TÍTULO CERTIFICADOS ── */}
      <Flex
        ref={certifTitleReveal.ref}
        direction="column"
        align="center"
        pt={{ base: 16, md: 20 }}
        gap={{ base: 7, md: 10 }}
      >
        <Box
          w="100%"
          maxW="500px"
          h="1px"
          bg="rgba(255,255,255,0.15)"
          opacity={certifTitleReveal.visible ? 1 : 0}
          transform={certifTitleReveal.visible ? "scaleX(1)" : "scaleX(0.2)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        />
        <Flex
          align="center"
          gap={3}
          opacity={certifTitleReveal.visible ? 1 : 0}
          transform={certifTitleReveal.visible ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s"
        >
          <Box
            as="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            w={{ base: "30px", md: "36px" }}
            h={{ base: "30px", md: "36px" }}
            fill="rgba(255,255,255,0.9)"
            style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.41)) drop-shadow(0 0 18px rgba(255,255,255,0.22))" }}
          >
            <path d="M395-475q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35ZM240-40v-309q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v309l-240-80-240 80Zm410-350q70-70 70-170t-70-170q-70-70-170-70t-170 70q-70 70-70 170t70 170q70 70 170 70t170-70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z"/>
          </Box>
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="700"
            letterSpacing="0.06em"
            textShadow="0 0 14px rgba(255,255,255,0.45), 0 0 30px rgba(255,255,255,0.22)"
          >
            Mis Certificados
          </Text>
        </Flex>
      </Flex>

      {/* ── GRID DE CERTIFICADOS ── */}
      <Box
        ref={certifReveal.ref}
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 10, md: 12 }}
        pb={{ base: 4, md: 6 }}
      >
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 4, md: 6 }} maxW="1100px" mx="auto">
          {certificados.map((cert, i) => (
            <Box
              key={i}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="0 0 14px rgba(255,255,255,0.22), 0 0 32px rgba(255,255,255,0.12), 0 4px 18px rgba(0,0,0,0.22)"
              transition={`all 0.25s, opacity 0.5s ease ${(i % 8) * 0.05}s, transform 0.5s ease ${(i % 8) * 0.05}s`}
              _hover={{ transform: "translateY(-4px)", boxShadow: "0 0 22px rgba(255,255,255,0.4), 0 0 50px rgba(180,255,245,0.25), 0 8px 26px rgba(0,0,0,0.28)" }}
              cursor="pointer"
              onClick={() => setLightboxIdx(i)}
              opacity={certifReveal.visible ? 1 : 0}
              transform={certifReveal.visible ? "translateY(0)" : "translateY(20px)"}
            >
              <Image
                src={cert.img}
                alt={`Certificado ${i + 1}`}
                w="100%"
                h={{ base: "130px", md: "170px" }}
                objectFit="cover"
              />
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* ── SEPARADOR ── */}
      <Flex justify="center" mb="10px" pt={{ base: 16, md: 20 }}>
        <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.15)" />
      </Flex>

      {/* ── CIERRE ── */}
      <Flex
        ref={cierreReveal.ref}
        justify="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 18, md: 22 }}
        pb={{ base: 16, md: 20 }}
      >
        <Text
          color="white"
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="600"
          letterSpacing="0.08em"
          fontStyle="italic"
          textAlign="center"
          textShadow="0 0 14px rgba(255,255,255,0.45), 0 0 30px rgba(255,255,255,0.22), 0 0 60px rgba(180,255,245,0.19)"
          opacity={cierreReveal.visible ? 1 : 0}
          transform={cierreReveal.visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)"}
          transition="opacity 0.9s ease, transform 0.9s ease"
        >
          ♊︎ Esto es solo el principio…
        </Text>
      </Flex>

      {/* ── LIGHTBOX ── */}
      {lightboxIdx !== null && (
        <Box
          position="fixed"
          inset={0}
          zIndex={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0, 0, 0, 0.41)"
          sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={closeLightbox}
        >
          {/* X */}
          <Box
            position="absolute"
            top={4}
            right={5}
            as="button"
            onClick={closeLightbox}
            color="white"
            fontSize="2xl"
            fontWeight="300"
            cursor="pointer"
            bg="rgba(0,0,0,0.45)"
            borderRadius="full"
            w="44px"
            h="44px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "rgba(255,255,255,0.2)" }}
            transition="background 0.2s"
            zIndex={201}
          >
            ✕
          </Box>

          {/* Prev */}
          <Box
            position="absolute"
            left={4}
            as="button"
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); prevCert(); }}
            color="white"
            fontSize="4xl"
            cursor="pointer"
            bg="rgba(0,0,0,0.45)"
            borderRadius="full"
            w="52px"
            h="52px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "rgba(255,255,255,0.2)" }}
            transition="background 0.2s"
            zIndex={201}
          >
            ‹
          </Box>

          {/* Image */}
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            maxW={{ base: "90vw", md: "70vw" }}
            maxH="85vh"
          >
            <Image
              src={certificados[lightboxIdx].img}
              alt={`Certificado ${lightboxIdx + 1}`}
              maxW="100%"
              maxH="85vh"
              objectFit="contain"
              borderRadius="xl"
              boxShadow="0 20px 60px rgba(0,0,0,0.6)"
            />
          </Box>

          {/* Next */}
          <Box
            position="absolute"
            right={4}
            as="button"
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); nextCert(); }}
            color="white"
            fontSize="4xl"
            cursor="pointer"
            bg="rgba(0,0,0,0.45)"
            borderRadius="full"
            w="52px"
            h="52px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "rgba(255,255,255,0.2)" }}
            transition="background 0.2s"
            zIndex={201}
          >
            ›
          </Box>
        </Box>
      )}

      {/* ── FOOTER ── */}
      <SiteFooter />
    </Box>
  );
};

export default QuienSoy;
