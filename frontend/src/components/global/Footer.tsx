import { Box, Flex, Text } from "@chakra-ui/react";
import { INSTAGRAM_URL } from "../../GlobalVariables";
import React from "react";
import { useNavigate } from "react-router-dom";

import { GlifoSigno } from "../metodo/Glifo";
import { useT } from "../../i18n";
import { focoBlanco } from "./foco";

// Los enlaces del pie son <button>/<a> de verdad (antes los tres primeros eran
// divs con onClick y el tabulador no podía llegar a ellos), y todos encienden
// el foco de teclado de la casa.
const focoEnlace = { color: "white", ...focoBlanco } as const;

const DONATION_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";

const SiteFooter = () => {
  const navigate = useNavigate();
  const t = useT();
  return (
    <Box
      as="footer"
      borderTop="1px solid rgba(255,255,255,0.15)"
      px={{ base: 6, md: 16 }}
      py={{ base: 8, md: 10 }}
    >
      <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.05em" textAlign="center">
        {t("footer.derechos")}
      </Text>
      <Flex justify="center" gap={6} mt={3} flexWrap="wrap" alignItems="center">
        <Flex align="center" gap={6} flexWrap="wrap" justify="center">
        <Flex
          as="button"
          type="button"
          align="center"
          gap="6px"
          bg="transparent"
          border="none"
          p={0}
          borderRadius="md"
          color="rgba(255,255,255,0.65)"
          fontSize="sm"
          letterSpacing="0.05em"
          cursor="pointer"
          _hover={{ color: "white" }}
          _focusVisible={focoEnlace}
          transition="color 0.2s"
          onClick={() => navigate("/quienSoy")}
        >
          {/* Géminis DIBUJADO (el carácter ♊ salía como emoji morado). */}
          <GlifoSigno nombre="Géminis" color="white" size={16} glow={false} />
          {t("footer.quienSoy")}
        </Flex>
        <Box
          as="a"
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          display="inline-flex"
          alignItems="center"
          gap="6px"
          color="rgba(255,255,255,0.65)"
          fontSize="sm"
          letterSpacing="0.05em"
          cursor="pointer"
          textDecoration="none"
          borderRadius="md"
          transition="color 0.2s"
          _hover={{ color: "white" }}
          _focusVisible={focoEnlace}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="15px" width="15px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
          Instagram
        </Box>
        <Box
          as="a"
          href={DONATION_LINK}
          target="_blank"
          rel="noopener noreferrer"
          display="inline-flex"
          alignItems="center"
          gap="6px"
          px={4}
          py="5px"
          borderRadius="full"
          border="1px solid rgba(255,255,255,0.35)"
          color="rgba(255,255,255,0.80)"
          fontSize="sm"
          letterSpacing="0.05em"
          fontFamily="'EB Garamond', serif"
          cursor="pointer"
          textDecoration="none"
          transition="all 0.2s"
          _hover={{ bg: "rgba(255,255,255,0.10)", color: "white", borderColor: "rgba(255,255,255,0.6)" }}
          _focusVisible={{ bg: "rgba(255,255,255,0.10)", borderColor: "rgba(255,255,255,0.6)", ...focoEnlace }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
          </svg>
          {t("footer.donar")}
        </Box>
        </Flex>
      </Flex>

      {/* ── Enlaces legales ── */}
      <Flex justify="center" gap={{ base: 3, md: 5 }} mt={5} flexWrap="wrap" alignItems="center">
        {[
          { texto: t("footer.avisoLegal"), ruta: "/aviso-legal" },
          { texto: t("footer.privacidad"), ruta: "/privacidad" },
          { texto: t("footer.cookies"), ruta: "/cookies" },
          { texto: t("footer.terminos"), ruta: "/terminos" },
        ].map((l) => (
          <Text
            key={l.ruta}
            as="button"
            onClick={() => navigate(l.ruta)}
            color="rgba(255,255,255,0.45)"
            fontSize="xs"
            letterSpacing="0.06em"
            bg="transparent"
            cursor="pointer"
            textDecoration="none"
            borderRadius="sm"
            transition="color 0.2s"
            _hover={{ color: "rgba(255,255,255,0.85)" }}
            _focusVisible={{ color: "rgba(255,255,255,0.85)", ...focoBlanco }}
          >
            {l.texto}
          </Text>
        ))}
      </Flex>

    </Box>
  );
};

export default SiteFooter;
