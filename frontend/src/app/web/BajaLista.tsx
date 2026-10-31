import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { Reveal } from "../../components/global/Reveal";
import { focoBlanco } from "../../components/global/foco";
import { API_URL } from "../../GlobalVariables";
import { useT } from "../../i18n";

/**
 * /baja — a donde llega quien pulsa «Darme de baja» en un correo (?email=…&t=<firma>) o
 * en el pie de la web. Con firma, da la baja al entrar; sin ella (o si falla), pide el correo.
 */
type Estado = "procesando" | "hecha" | "error" | "formulario";

const BajaLista = () => {
  const t = useT();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const emailUrl = (params.get("email") ?? "").trim();
  const firma = params.get("t") ?? "";

  const [estado, setEstado] = useState<Estado>(emailUrl && firma ? "procesando" : "formulario");
  const [email, setEmail] = useState(emailUrl);
  const [enviando, setEnviando] = useState(false);
  const hecho = useRef(false);

  const darDeBaja = async (correo: string, token: string) => {
    try {
      const r = await axios.post(`${API_URL}/subscribe/baja/confirmar`, { email: correo, t: token || undefined }, { timeout: 15000 });
      setEmail(correo);
      setEstado(r.data?.ok === true ? "hecha" : "error");
    } catch {
      setEstado("error");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    // Una sola vez (StrictMode monta dos veces en desarrollo).
    if (estado !== "procesando" || hecho.current) return;
    hecho.current = true;
    darDeBaja(emailUrl, firma);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enviar = async () => {
    if (enviando || !email.trim()) return;
    setEnviando(true);
    await darDeBaja(email.trim(), "");
    setEnviando(false);
  };

  const pildora = (texto: string, onClick: () => void, deshabilitado = false) => (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      disabled={deshabilitado}
      opacity={deshabilitado ? 0.6 : 1}
      px={8}
      py="12px"
      borderRadius="full"
      border="1.5px solid rgba(255,255,255,0.65)"
      bg="rgba(255,255,255,0.14)"
      color="white"
      fontFamily="'EB Garamond', serif"
      fontWeight="600"
      fontSize={{ base: "md", md: "lg" }}
      letterSpacing="0.06em"
      boxShadow="0 0 22px rgba(180,255,245,0.35)"
      cursor={deshabilitado ? "not-allowed" : "pointer"}
      transition="all 0.22s ease"
      _hover={deshabilitado ? {} : { bg: "rgba(255,255,255,0.26)", borderColor: "white" }}
      _focusVisible={focoBlanco}
    >
      {texto}
    </Box>
  );

  const titulo =
    estado === "hecha" ? t("baja.hechaTitulo") : estado === "error" ? t("baja.errorTitulo") : t("baja.titulo");

  const texto = (s: string) => (
    <Text color="white" fontFamily="'EB Garamond', serif" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.7">
      {s}
    </Text>
  );

  const formulario = (
    <Flex direction="column" align="center" gap={4} w="100%" maxW="420px">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") enviar(); }}
        placeholder="tu@correo.com"
        autoComplete="email"
        bg="rgba(255,255,255,0.08)"
        border="1px solid rgba(255,255,255,0.4)"
        color="white"
        borderRadius="full"
        textAlign="center"
        fontFamily="'EB Garamond', serif"
        _placeholder={{ color: "rgba(255,255,255,0.55)" }}
        _hover={{ borderColor: "rgba(255,255,255,0.7)" }}
        _focus={{ borderColor: "white", boxShadow: "none" }}
        _focusVisible={{ borderColor: "white", boxShadow: "none" }}
      />
      {pildora(t("baja.boton"), enviar, enviando)}
    </Flex>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />
      <Box flex="1" display="flex" justifyContent="center" px={{ base: 5, md: 10 }} py={{ base: 14, md: 24 }}>
        <Reveal activo direction="up" distance={20} duration={0.9} w="100%" maxW="560px">
          <Flex direction="column" align="center" textAlign="center" gap={{ base: 5, md: 6 }}>
            <Text color="white" fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="0.03em" lineHeight="1.2">
              {titulo}
            </Text>
            {estado === "procesando" && texto(t("baja.procesando"))}
            {estado === "hecha" && (
              <>
                {texto(t("baja.hechaTexto", { email }))}
                {texto(t("baja.hechaVolver"))}
              </>
            )}
            {estado === "formulario" && (
              <>
                {texto(t("baja.formulario"))}
                {formulario}
              </>
            )}
            {estado === "error" && (
              <>
                {texto(t("baja.errorTexto"))}
                {formulario}
              </>
            )}
            {estado !== "procesando" && pildora(t("baja.web"), () => navigate("/"))}
          </Flex>
        </Reveal>
      </Box>
      <SiteFooter />
    </Box>
  );
};

export default BajaLista;
