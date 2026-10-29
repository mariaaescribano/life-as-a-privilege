import {
  Box, Flex, Image, Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import FlorTitulo from "../../components/global/FlorTitulo";
import Certificaciones from "../../components/web/Certificaciones";
import { GlifoSigno } from "../../components/metodo/Glifo";
import { focoBlanco } from "../../components/global/foco";
import { useT } from "../../i18n";

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

// Halo de caja (receta de DISENO.md §5.2): sin sombra oscura ni filo.
const CAJA_GLOW =
  "0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09)";

const DONATION_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";


const QuienSoy = () => {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  const presentacionReveal = useReveal(0.12);
  const donacionReveal = useReveal(0.15);
  const testimonioReveal = useReveal(0.2);
  const certifTitleReveal = useReveal(0.2);
  const cierreReveal = useReveal(0.2);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);


  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

      {/* ── HEADER ── */}
      <SiteHeader variant="auto" />

      <Box flex="1">
      {/* ── FLOR DE LA VIDA sobre el título ── */}
      <FlorTitulo activo={mounted} />



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
        {/* Nombre — título de la página (estilo coherente con "Materiales") */}
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          fontFamily="'EB Garamond', serif"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          // Todos los títulos de página van al 70% del glow original
          // (0.6/0.39/0.32): con luz, pero sin deslumbrar.
          textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.39), 0 0 56px rgba(180,255,245,0.32)"
          opacity={presentacionReveal.visible ? 1 : 0}
          transform={presentacionReveal.visible ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.85s ease 0.1s, transform 0.85s ease 0.1s"
        >
          María Escribano
        </Text>

        {/* Foto */}
        <Box
          maxW={{ base: "260px", md: "340px" }}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="0 20px 50px rgba(0,0,0,0.35), 0 0 30px rgba(255,255,255,0.28), 0 0 60px rgba(180,255,245,0.22)"
          opacity={presentacionReveal.visible ? 1 : 0}
          transform={presentacionReveal.visible ? "scale(1)" : "scale(0.85)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          <Image
            src="/img/me/me.webp"
            alt="María Escribano"
            w="100%"
            h="auto"
            display="block"
          />
        </Box>

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
          {t("creadora.bio")}
          <Box as="span" display="block" mt={{ base: 3, md: 4 }}>{t("creadora.bio2")}</Box>
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
          {t("quienSoy.mision")}
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
            {t("contacto.titulo")}
          </Flex>
          <Box
            h="1px"
            w={{ base: "24px", md: "44px" }}
            bg="linear-gradient(to left, transparent, rgba(255,255,255,0.6))"
            boxShadow="0 0 6px rgba(255,255,255,0.4)"
          />
        </Flex>
      </Flex>


      {/* ── SEPARADOR (línea centrada en el hueco) ── */}
      <Flex ref={certifTitleReveal.ref} justify="center" py={{ base: 8, md: 10 }}>
        <Box
          w="100%"
          maxW="500px"
          h="1px"
          bg="rgba(255,255,255,0.15)"
          opacity={certifTitleReveal.visible ? 1 : 0}
          transform={certifTitleReveal.visible ? "scaleX(1)" : "scaleX(0.2)"}
          transition="opacity 0.8s ease, transform 0.8s ease"
        />
      </Flex>

      {/* ── DIPLOMAS ── */}
      <Certificaciones />

      {/* ── SEPARACIÓN antes de «Apoya este proyecto» (mismo aire arriba que abajo) ── */}
      <Flex justify="center" px={{ base: 5, md: 10 }} py={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.22)" />
      </Flex>

      {/* ── DONACIÓN + TESTIMONIO ──
          Dos cajas en la misma fila (en móvil, una bajo la otra), del mismo
          alto. Sin sombra ni filo: se definen por el halo, como el resto de
          cajas de la casa. */}
      <Flex
        direction={{ base: "column", md: "row" }}
        align="stretch"
        justify="center"
        gap={{ base: 6, md: 8 }}
        maxW="1100px"
        w="100%"
        mx="auto"
        px={{ base: 5, md: 10, lg: 16 }}
      >
        {/* ── DONACIÓN ── */}
        <Flex
          ref={donacionReveal.ref}
          flex="1"
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          gap={{ base: 5, md: 6 }}
          px={{ base: 6, md: 8 }}
          py={{ base: 9, md: 12 }}
          borderRadius="3xl"
          bg="rgba(255,255,255,0.05)"
          boxShadow={CAJA_GLOW}
        >
          <Box
            w={{ base: "62px", md: "72px" }}
            h={{ base: "62px", md: "72px" }}
            borderRadius="full"
            bg="rgba(255,255,255,0.10)"
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
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            textShadow="0 0 14px rgba(255,255,255,0.49), 0 0 30px rgba(255,255,255,0.26)"
            opacity={donacionReveal.visible ? 1 : 0}
            transform={donacionReveal.visible ? "translateY(0)" : "translateY(20px)"}
            transition="opacity 0.75s ease 0.25s, transform 0.75s ease 0.25s"
          >
            {t("quienSoy.apoya")}
          </Text>

          <Box
            as="a"
            href={DONATION_LINK}
            target="_blank"
            rel="noopener noreferrer"
            display="inline-flex"
            alignItems="center"
            gap={3}
            px={{ base: 8, md: 9 }}
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
            boxShadow="0 0 16px rgba(255,255,255,0.34), 0 0 36px rgba(255,255,255,0.16)"
            textShadow="0 0 10px rgba(255,255,255,0.45), 0 0 22px rgba(255,255,255,0.22)"
            _hover={{
              bg: "rgba(255,255,255,0.2)",
              borderColor: "white",
              boxShadow: "0 0 26px rgba(255,255,255,0.55), 0 0 54px rgba(180,255,245,0.35)",
              transform: "translateY(-1px)",
            }}
            _focusVisible={focoBlanco}
            opacity={donacionReveal.visible ? 1 : 0}
            transform={donacionReveal.visible ? "translateY(0)" : "translateY(20px)"}
            transition="opacity 0.75s ease 0.5s, transform 0.75s ease 0.5s, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
          >
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" h="18px" w="18px" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
            </Box>
            {t("quienSoy.donar")}
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
            {t("quienSoy.pagoSeguro")}
          </Text>
        </Flex>

        {/* ── TESTIMONIO ── */}
        <Flex
          ref={testimonioReveal.ref}
          flex="1"
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          gap={{ base: 5, md: 6 }}
          px={{ base: 6, md: 8 }}
          py={{ base: 9, md: 12 }}
          borderRadius="3xl"
          bg="rgba(255,255,255,0.05)"
          boxShadow={CAJA_GLOW}
        >
          <Text
            color="white"
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            fontSize={{ base: "lg", md: "xl" }}
            lineHeight="1.6"
            letterSpacing="0.02em"
            textShadow="0 0 14px rgba(255,255,255,0.41), 0 0 30px rgba(255,255,255,0.21), 0 0 60px rgba(180,255,245,0.26)"
            opacity={testimonioReveal.visible ? 1 : 0}
            transform={testimonioReveal.visible ? "translateY(0)" : "translateY(20px)"}
            transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
          >
            {t("quienSoy.testimonio")}
          </Text>

          <Flex
            direction="column"
            align="center"
            gap={1}
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
              {t("quienSoy.testimonioCargo")}
            </Text>
          </Flex>

          <Flex
            as="a"
            href="https://www.linkedin.com/in/mar%C3%ADa-escribano-arce-b58a56385/details/recommendations/"
            target="_blank"
            rel="noopener noreferrer"
            align="center"
            gap={2}
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
            _focusVisible={focoBlanco}
          >
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" w="14px" h="14px" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </Box>
            {t("quienSoy.linkedin")}
          </Flex>
        </Flex>
      </Flex>

      {/* ── SEPARADOR ── */}
      <Flex justify="center" mb="10px" pt={{ base: 16, md: 20 }}>
        {/* <Box w="100%" maxW="500px" h="1px" bg="rgba(255,255,255,0.15)" />
       */}
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
          {/* El glifo acompaña a la frase, así que va a la altura de la letra:
              el tamaño se fija desde aquí (el `size` del componente se queda
              corto) para que crezca con el breakpoint igual que el texto. */}
          <Box
            as="span"
            display="inline-flex"
            alignItems="center"
            verticalAlign="-6px"
            mr={{ base: 2.5, md: 3 }}
            sx={{
              "& svg": {
                width: { base: "34px", md: "50px" },
                height: { base: "34px", md: "50px" },
              },
            }}
          >
            <GlifoSigno nombre="Géminis" color="currentColor" size={22} glow={false} />
          </Box>
          {t("quienSoy.cierre")}
        </Text>
      </Flex>
      </Box>


      {/* ── FOOTER ── */}
      <SiteFooter />
    </Box>
  );
};

export default QuienSoy;
