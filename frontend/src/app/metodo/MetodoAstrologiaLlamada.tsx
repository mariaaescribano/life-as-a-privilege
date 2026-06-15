import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { AgendarLlamada } from "../../components/global/AgendarLlamada";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { PagoPsicologiaModal } from "../../components/metodo/PagoPsicologiaModal";
import { API_URL, astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

/**
 * Última pantalla del Recorrido de Astrología: reservar una llamada (de pago,
 * pago simulado por ahora) con María. Estilo astrología (fondo estrellado +
 * texto con brillo). Usa el componente reutilizable AgendarLlamada.
 */
export default function MetodoAstrologiaLlamada() {
  const navigate = useNavigate();
  const [psicologiaSuscrito, setPsicologiaSuscrito] = useState(false);
  const [pagoPsicoOpen, setPagoPsicoOpen] = useState(false);
  const [pagoPsicoLoading, setPagoPsicoLoading] = useState(false);
  const [pagoPsicoError, setPagoPsicoError] = useState<string | null>(null);
  const [testPagos, setTestPagos] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const token = sessionStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setPsicologiaSuscrito(!!res.data?.psicologia_suscrito))
      .catch(() => {});
    axios
      .get(`${API_URL}/payment/test/enabled`)
      .then((res) => setTestPagos(!!res.data?.enabled))
      .catch(() => {});
  }, []);

  const testUnlockPsico = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    try {
      await axios.post(
        `${API_URL}/payment/test/unlock`,
        { scope: "psicologia" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate("/metodo/psicologia");
    } catch (err: any) {
      setPagoPsicoError(err?.response?.data?.message || "No se pudo activar el modo test.");
    }
  };

  const pagarPsicologia = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoPsicoLoading(true);
    setPagoPsicoError(null);
    try {
      const res = await axios.post(
        `${API_URL}/payment/psicologia/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data?.url) { window.location.href = res.data.url; return; }
      setPagoPsicoError("No se pudo obtener la URL de pago. Inténtalo de nuevo.");
      setPagoPsicoLoading(false);
    } catch (err: any) {
      const status = err?.response?.status;
      setPagoPsicoError(
        status === 403
          ? "Necesitas completar el pago de Astrología antes de adquirir Psicología."
          : err?.response?.data?.message || err?.message || "Error desconocido",
      );
      setPagoPsicoLoading(false);
    }
  };

  // El botón "Psicología →" del header se desbloquea al pagar Psicología.
  // Mientras no esté pagada, el clic abre el pago (en vez de quedar inerte).
  const onPsicologia = () => {
    if (psicologiaSuscrito) navigate("/metodo/psicologia");
    else { setPagoPsicoError(null); setPagoPsicoOpen(true); }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>
          <MetodoStepHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
            title="Llamada"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            space
            mb={0}
            prev={{ label: "← Aspectos", onClick: () => navigate("/metodo/astrologia/aspectos") }}
            next={{
              label: psicologiaSuscrito ? "Psicología →" : "Desbloquear Psicología 🔒",
              onClick: onPsicologia,
            }}
          />

          <AgendarLlamada
            color={astrologiaTxt}
            bgColor={astrologiaBg}
            disciplinaNom={astrologiaNom}
            precio={20}
            titulo="Reserva tu llamada de astrología"
          />

          {/* Nota debajo del box de la llamada, con fondo de astrología */}
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={`1px solid ${astrologiaTxt}44`}
            boxShadow={`0 0 18px rgba(255,255,255,0.1), 0 0 30px ${astrologiaTxt}1a`}
          >
            <DisciplinaBgLayer nom={astrologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }} textAlign="center">
              <Text
                color={`${astrologiaTxt}ee`}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.9"
                style={{ textShadow: `0 0 10px ${astrologiaTxt}44` }}
              >
                Da el paso de integrar tus arquetipos: agenda una llamada y no te quedes con dudas.
              </Text>
              <Text
                color={`${astrologiaTxt}bb`}
                fontSize={{ base: "xs", md: "sm" }}
                fontStyle="italic"
                mt={3}
                lineHeight="1.6"
                style={{ textShadow: `0 0 8px ${astrologiaTxt}33` }}
              >
                La llamada es opcional pero recomendada. Puedes avanzar a Psicología.
              </Text>
            </Box>
          </Box>
        </Flex>
      </Flex>

      <PagoPsicologiaModal
        isOpen={pagoPsicoOpen}
        onClose={() => { setPagoPsicoOpen(false); setPagoPsicoError(null); }}
        onPagar={pagarPsicologia}
        loading={pagoPsicoLoading}
        error={pagoPsicoError}
        onTest={testPagos ? testUnlockPsico : undefined}
      />

      <SiteFooter />
    </Box>
  );
}
