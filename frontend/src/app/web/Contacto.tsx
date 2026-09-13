/**
 * CONTACTAR (/contacto).
 *
 * Las cinco puertas: la llamada, escribirme, WhatsApp, Instagram y la
 * comunidad. El formulario tiene su propia pagina (/contacto/escribir), a la
 * que lleva la tarjeta de escribirme.
 *
 * Entre el subtitulo y las puertas va el retrato: aqui es donde alguien decide
 * si escribe a una desconocida, y es la unica foto de la pagina a proposito.
 */
import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import ViasDeContacto from "../../components/contacto/ViasDeContacto";
import { Reveal } from "../../components/global/Reveal";
import { useT } from "../../i18n";

const Contacto = () => {
  const t = useT();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      {/* MANDALA SEPARADOR */}
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

      {/* TITULO */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 8, md: 10 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color="white"
          fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 18px rgba(255,255,255,0.64), 0 0 38px rgba(255,255,255,0.41), 0 0 70px rgba(180,255,245,0.34)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(24px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          {t("contacto.titulo")}
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.7"
          letterSpacing="0.03em"
          maxW={{ base: "100%", md: "560px" }}
          textShadow="0 0 10px rgba(255,255,255,0.34), 0 0 22px rgba(255,255,255,0.17)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(16px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          {t("contacto.subtitulo")}
        </Text>
      </Flex>

      {/* LA CARA ──
          Una sola foto, y aquí: esta es la página en la que alguien decide si
          le escribe a una desconocida o no, y saber con quién va a hablar quita
          más reparo que cualquier frase. UNA, no una por tarjeta: los iconos
          son lo que hace las seis puertas legibles de un vistazo, y seis
          retratos las convertirían en un álbum.
          Anillo fino y sombra baja, sin halo blanco: sobre el turquesa un halo
          claro se lee como una caja detrás de la foto. */}
      <Flex justify="center" pt={{ base: 8, md: 10 }}>
        <Reveal inView amount={0.02} direction="up" distance={20} scaleFrom={0.94} duration={0.7}>
          <Image
            src="/img/me/me.png"
            alt=""
            w={{ base: "104px", md: "132px" }}
            h={{ base: "104px", md: "132px" }}
            borderRadius="full"
            objectFit="cover"
            border="1px solid rgba(255,255,255,0.5)"
            boxShadow="0 8px 26px rgba(0,0,0,0.28)"
          />
        </Reveal>
      </Flex>

      {/* LAS VIAS: llamada, escribirme, WhatsApp, Instagram y la comunidad */}
      <Box flex="1" pb={{ base: 20, md: 28 }}>
        <ViasDeContacto onEscribir={() => navigate("/contacto/escribir")} />
      </Box>

      <SiteFooter />
    </Box>
  );
};

export default Contacto;
