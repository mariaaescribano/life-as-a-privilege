import React, { useEffect, useState } from "react";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import BandaMarmol from "../../components/global/BandaMarmol";
import { Reveal } from "../../components/global/Reveal";
import { LifeLoading } from "../../components/global/LifeLoading";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { focoBlanco } from "../../components/global/foco";
import { API_URL } from "../../GlobalVariables";
import { getUserMe, invalidarUserMe } from "../../api/userMe";
import { useT } from "../../i18n";

/**
 * /premium/avisos — con la cuenta ya creada (o ya existente):
 *   1. si viene `session_id`, reclama ese pago (le da el mes a la cuenta);
 *   2. si ya había elegido cómo recibir los avisos (p. ej. renovando), pasa de largo;
 *   3. si no, elige email, teléfono (WhatsApp) o las dos, y entra.
 */
const TINTA = "#004f4f";
const ORO = "#b08d3f";

const PremiumAvisos = () => {
  const t = useT();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [listo, setListo] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState(true);
  const [whatsapp, setWhatsapp] = useState(false);
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        if (sessionId) {
          await axios.post(`${API_URL}/premium/reclamar`, { session_id: sessionId });
          invalidarUserMe();
        }
        const { data } = await getUserMe({ fresca: true });
        if (!vivo) return;
        // Sin acceso (pago no válido o de otra cuenta): de vuelta a donde se paga.
        if (data?.premium_suscrito !== true) { navigate("/premium", { replace: true }); return; }
        // Ya eligió cómo recibir los avisos (renovación): directo dentro.
        if (data?.premium_avisos_elegidos === true) { navigate("/premium/espacio", { replace: true }); return; }
        setEmail(data?.premium_aviso_email !== false);
        setWhatsapp(data?.premium_aviso_whatsapp === true);
        if (typeof data?.telefono === "string") setTelefono(data.telefono);
        setListo(true);
      } catch {
        if (vivo) navigate("/premium", { replace: true });
      }
    })();
    return () => { vivo = false; };
  }, [sessionId, navigate]);

  const entrar = async () => {
    if (guardando) return;
    if (!email && !whatsapp) { setError(t("premium.avisos.elegirUna")); return; }
    setGuardando(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/premium/avisos`, { email, whatsapp, telefono: whatsapp ? telefono : undefined });
      invalidarUserMe();
      navigate("/premium/espacio", { replace: true });
    } catch (err: any) {
      // El servidor explica el motivo (p. ej. WhatsApp sin teléfono); si no, el genérico.
      const msg = err?.response?.data?.message;
      setError(typeof msg === "string" ? msg : t("premium.avisos.error"));
      setGuardando(false);
    }
  };

  if (!listo) {
    return (
      <Box position="fixed" inset={0} bg="#008080">
        <LifeLoading variant="private" />
      </Box>
    );
  }

  const opcion = (texto: string, activa: boolean, alternar: () => void) => (
    <Box
      as="button"
      type="button"
      role="checkbox"
      aria-checked={activa}
      onClick={alternar}
      display="flex"
      alignItems="center"
      gap={4}
      w="100%"
      px={{ base: 5, md: 6 }}
      py={{ base: 4, md: 5 }}
      textAlign="left"
      borderRadius="2xl"
      border={`1.5px solid ${activa ? TINTA : `${TINTA}66`}`}
      bg={activa ? `${TINTA}14` : "transparent"}
      boxShadow={`0 0 18px ${ORO}2a`}
      transition="background 0.25s ease, border-color 0.25s ease"
      _focusVisible={focoBlanco}
    >
      <Box
        flexShrink={0}
        w="26px"
        h="26px"
        borderRadius="full"
        border={`1.5px solid ${TINTA}`}
        bg={activa ? TINTA : "transparent"}
        color="white"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="md"
        lineHeight="1"
      >
        {activa ? "✓" : ""}
      </Box>
      <Text color={TINTA} fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.04em">
        {texto}
      </Text>
    </Box>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />
      <Box flex="1">
        <WelcomeCabecera activo={mounted} titulo={t("premium.avisos.titulo")} subtitulo={t("premium.avisos.texto")} mayusculas />
        <BandaMarmol mt={{ base: 2, md: 4 }}>
          {(visible) => (
            <Flex direction="column" align="stretch" gap={{ base: 4, md: 5 }} w="100%" maxW="520px" mx="auto" px={{ base: 5, md: 6 }}>
              <Reveal activo={visible} direction="up" distance={18} duration={0.8} delay={0.1}>
                {opcion(t("premium.avisos.email"), email, () => setEmail((v) => !v))}
              </Reveal>
              <Reveal activo={visible} direction="up" distance={18} duration={0.8} delay={0.25}>
                {opcion(t("premium.avisos.whatsapp"), whatsapp, () => setWhatsapp((v) => !v))}
              </Reveal>
              {whatsapp && (
                <Input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder={t("premium.avisos.telefono")}
                  h="56px"
                  borderRadius="2xl"
                  bg="transparent"
                  border={`1.5px solid ${TINTA}`}
                  color={TINTA}
                  fontFamily="'EB Garamond', serif"
                  fontSize="xl"
                  _placeholder={{ color: `${TINTA}99` }}
                  _focusVisible={{ outline: "2px solid white", boxShadow: "none", borderColor: TINTA }}
                />
              )}
              {error && (
                <Text color={TINTA} fontStyle="italic" textAlign="center" fontSize={{ base: "md", md: "lg" }}>
                  {error}
                </Text>
              )}
              <Flex justify="center" pt={2}>
                <Box
                  as="button"
                  type="button"
                  onClick={entrar}
                  disabled={guardando}
                  opacity={guardando ? 0.7 : 1}
                  px={{ base: 10, md: 14 }}
                  py={{ base: "14px", md: "16px" }}
                  borderRadius="full"
                  bg={TINTA}
                  border={`1.5px solid ${TINTA}`}
                  color="white"
                  fontWeight="700"
                  fontSize={{ base: "lg", md: "xl" }}
                  letterSpacing="0.16em"
                  textTransform="uppercase"
                  boxShadow={`0 0 16px ${ORO}44, 0 0 36px ${ORO}22`}
                  transition="background 0.25s ease"
                  _hover={{ bg: "#006b6b" }}
                  _focusVisible={focoBlanco}
                >
                  {t("premium.avisos.entrar")}
                </Box>
              </Flex>
            </Flex>
          )}
        </BandaMarmol>
        <Box h={{ base: "56px", md: "88px" }} />
      </Box>
      <SiteFooter />
    </Box>
  );
};

export default PremiumAvisos;
