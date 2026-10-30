import React, { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
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
import { useT } from "../../i18n";

/**
 * /premium/registro — a donde vuelve Stripe tras pagar SIN cuenta (session_id en la URL).
 * Comprueba el pago; si es válido, ofrece crear la cuenta o entrar con la que ya tiene, y
 * en los dos casos la persona acaba en /premium/avisos con el pago para reclamarlo.
 */
const TINTA = "#004f4f";
const ORO = "#b08d3f";

const PremiumRegistro = () => {
  const t = useT();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") ?? "";
  const destino = `/premium/avisos?session_id=${encodeURIComponent(sessionId)}`;

  const [estado, setEstado] = useState<"verificando" | "ok" | "invalido">("verificando");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!sessionId) { setEstado("invalido"); return; }
    let hayCuenta = false;
    try { hayCuenta = !!localStorage.getItem("userId"); } catch { /* modo privado */ }
    // Con sesión iniciada no hay que crear nada: el pago se reclama directamente.
    if (hayCuenta) { navigate(destino, { replace: true }); return; }
    let vivo = true;
    axios.get(`${API_URL}/premium/verify`, { params: { session_id: sessionId } })
      .then((r) => { if (vivo) setEstado(r.data?.ok ? "ok" : "invalido"); })
      .catch(() => { if (vivo) setEstado("invalido"); });
    return () => { vivo = false; };
  }, [sessionId, destino, navigate]);

  if (estado === "verificando") {
    return (
      <Box position="fixed" inset={0} bg="#008080">
        <LifeLoading variant="private" />
      </Box>
    );
  }

  const boton = (texto: string, onClick: () => void, principal: boolean) => (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      px={{ base: 8, md: 12 }}
      py={{ base: "14px", md: "16px" }}
      borderRadius="full"
      bg={principal ? TINTA : "transparent"}
      border={`1.5px solid ${TINTA}`}
      color={principal ? "white" : TINTA}
      fontFamily="'EB Garamond', serif"
      fontWeight="700"
      fontSize={{ base: "md", md: "xl" }}
      letterSpacing="0.14em"
      textTransform="uppercase"
      boxShadow={`0 0 16px ${ORO}44, 0 0 36px ${ORO}22`}
      transition="background 0.25s ease"
      _hover={{ bg: principal ? "#006b6b" : `${TINTA}14` }}
      _focusVisible={focoBlanco}
    >
      {texto}
    </Box>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />
      <Box flex="1">
        <WelcomeCabecera
          activo={mounted}
          titulo={t(estado === "ok" ? "premium.registro.titulo" : "premium.registro.invalido")}
          subtitulo={estado === "ok" ? t("premium.registro.texto") : ""}
          mayusculas
        />
        {estado === "ok" && (
          <BandaMarmol mt={{ base: 2, md: 4 }}>
            {(visible) => (
              <Flex direction="column" align="center" gap={{ base: 5, md: 6 }} px={{ base: 5, md: 10 }}>
                <Reveal activo={visible} direction="up" distance={18} duration={0.8} delay={0.1}>
                  {boton(t("premium.registro.crear"), () => navigate(`/signIn?next=${encodeURIComponent(destino)}`), true)}
                </Reveal>
                <Reveal activo={visible} direction="up" distance={18} duration={0.8} delay={0.25}>
                  {boton(t("premium.registro.yaTengo"), () => navigate(`/logIn?modo=premium&next=${encodeURIComponent(destino)}`), false)}
                </Reveal>
              </Flex>
            )}
          </BandaMarmol>
        )}
        {estado === "invalido" && (
          <Flex justify="center" pt={{ base: 8, md: 12 }}>
            {boton(t("comun.volver"), () => navigate("/premium"), false)}
          </Flex>
        )}
        <Box h={{ base: "56px", md: "88px" }} />
      </Box>
      <SiteFooter />
    </Box>
  );
};

export default PremiumRegistro;
