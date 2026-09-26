// PuertaConsentimientoSalud.tsx — pide el consentimiento de salud a quien entra
// al recorrido con alguna disciplina abierta y todavía no lo ha dado.
//
// Quién llega aquí sin haberlo dado: las cuentas de acceso libre (regaladas
// desde /admin/accesos o ACCESO_LIBRE_EMAILS, que nunca pasan por el pago) y las
// que compraron antes de que el consentimiento se guardara. A los demás ya se lo
// apuntó la casilla del pago y esto no les sale nunca.
//
// Solo se monta en /metodo/* (ver PrivateRoute en App.tsx). Sin disciplinas
// abiertas no pregunta nada: en ese caso la casilla la verá al pagar.
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../GlobalVariables";
import { useT } from "../../i18n";
import { Casilla } from "../metodo/PagoDisciplinaModal";
import { darConsentimientoSalud, tieneConsentimientoSalud } from "../../api/consentimientoSalud";
import { suplantacionActiva } from "../../api/suplantar";

const BG = "#004a4a";
const TXT = "#ffffff";

export function PuertaConsentimientoSalud() {
  const t = useT();
  const navigate = useNavigate();
  const [pedir, setPedir] = useState(false);
  const [marcada, setMarcada] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Desde «entrar como» no se pregunta: el consentimiento solo puede darlo la
    // propia persona (el servidor también lo rechaza).
    if (suplantacionActiva()) return;
    let vivo = true;
    (async () => {
      const ya = await tieneConsentimientoSalud();
      // `null` = no se ha podido saber: mejor no bloquear a nadie por un fallo de red.
      if (ya !== false || !vivo) return;
      try {
        const { data } = await axios.get(`${API_URL}/user/me`);
        const abierta = Object.entries(data ?? {}).some(
          ([k, v]) => k.endsWith("_suscrito") && v === true,
        );
        if (vivo && abierta) setPedir(true);
      } catch {
        /* sin datos de la cuenta, no se bloquea */
      }
    })();
    return () => { vivo = false; };
  }, []);

  const aceptar = async () => {
    if (!marcada || guardando) return;
    setGuardando(true);
    setError(false);
    const ok = await darConsentimientoSalud();
    setGuardando(false);
    if (ok) setPedir(false);
    else setError(true);
  };

  return (
    <Modal
      isOpen={pedir}
      onClose={() => { /* no se cierra sin decidir */ }}
      isCentered
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="lg"
    >
      <ModalOverlay bg="rgba(0,0,0,0.55)" />
      <ModalContent
        bg={BG}
        color={TXT}
        mx={4}
        borderRadius="2xl"
        fontFamily="'EB Garamond', serif"
        boxShadow="0 0 40px rgba(0,128,128,0.55)"
      >
        <ModalBody px={{ base: 6, md: 8 }} py={{ base: 6, md: 8 }}>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" mb={3} textAlign="center">
            {t("consentimiento.titulo")}
          </Text>
          <Text fontSize="md" lineHeight="1.7" mb={5} color="rgba(255,255,255,0.88)">
            {t("consentimiento.texto")}
          </Text>

          <Casilla
            marcada={marcada}
            onToggle={() => setMarcada((v) => !v)}
            bg={BG}
            txt={TXT}
            nota={t("consentimiento.nota")}
          >
            {t("consentimiento.casilla")}
          </Casilla>

          {error && (
            <Text color="#ffb4b4" fontSize="sm" mt={3} textAlign="center">
              {t("consentimiento.error")}
            </Text>
          )}

          <Flex justify="center" gap={3} mt={6} wrap="wrap">
            <Box
              as="button"
              onClick={aceptar}
              px={8}
              py={3}
              borderRadius="full"
              bg={TXT}
              color={BG}
              fontWeight="700"
              letterSpacing="0.06em"
              cursor={marcada && !guardando ? "pointer" : "not-allowed"}
              opacity={marcada && !guardando ? 1 : 0.5}
              transition="all 0.2s"
            >
              {guardando ? t("comun.enviando") : t("consentimiento.boton")}
            </Box>
            <Box
              as="button"
              onClick={() => navigate("/home")}
              px={8}
              py={3}
              borderRadius="full"
              border="1px solid rgba(255,255,255,0.45)"
              color={TXT}
              letterSpacing="0.06em"
              cursor="pointer"
            >
              {t("consentimiento.volver")}
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PuertaConsentimientoSalud;
