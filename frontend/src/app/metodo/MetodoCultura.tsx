import React, { useEffect, useState } from "react";
import { useT } from "../../i18n";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { CulturaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { CulturaIlustracionesModal } from "../../components/metodo/CulturaIlustracionesModal";
import { PagoCulturaModal } from "../../components/metodo/PagoCulturaModal";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, culturaBg, culturaNom, culturaTxt, CulturaIcon } from "../../GlobalVariables";
import { irAPagoDisciplina } from "../../components/metodo/pagoDisciplinaLink";

// Halo oscuro (verde profundo) para que el texto se lea sobre el fondo de Cultura.
const INK_SHADOW = `0 1px 3px ${culturaBg}f5, 0 0 8px ${culturaBg}cc, 0 2px 16px ${culturaBg}88`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.14), 0 0 34px rgba(255,255,255,0.07), 0 0 20px ${culturaTxt}22, 0 0 48px ${culturaTxt}14`;

export default function MetodoCultura() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suscrito, setSuscrito] = useState(false);
  const [pagoOpen, setPagoOpen] = useState(false);
  const [pagoLoading, setPagoLoading] = useState(false);
  const [pagoError, setPagoError] = useState<string | null>(null);
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sin prerrequisitos: el orden del Mapa es el ACONSEJADO, no obligatorio.
        // Se puede entrar aquí sin haber hecho las anteriores; lo único que hace
        // falta es tener esta disciplina desbloqueada (si no, sale su pago).
        const culturaSuscrito = !!me.data?.cultura_suscrito;
        setSuscrito(culturaSuscrito);
        if (!culturaSuscrito) { setPagoOpen(true); return; }
      } catch {
        navigate("/home");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const pagarCultura = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/welcome"); return; }
    setPagoLoading(true);
    setPagoError(null);
    // Todas las disciplinas se cobran por separado, pero comparten el mismo
    // Payment Link: el scope y el userId viajan en el client_reference_id
    // para que, al volver a /home, el verify sepa qué desbloquear.
    const errPago = irAPagoDisciplina("cultura");
    if (errPago) {
      setPagoError(errPago);
      setPagoLoading(false);
    }
  };

  if (loading) {
    return <CulturaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CulturaIcon size={{ base: "40px", md: "56px" }} />}
              title="Cultura"
              bgColor={`${culturaBg}dd`}
              color={culturaTxt}
              nom={culturaNom}
              mb={0}
              prev={{ label: "← Cábala", onClick: () => navigate("/metodo/cabala/cursos") }}
              extra={{ label: "Ilustraciones", onClick: () => setIlustracionesOpen(true)}}
              next={{ label: "Las Historias →", onClick: () => {
                if (!suscrito) { setPagoError(null); setPagoOpen(true); return; }
                navigate("/metodo/cultura/historias");
              } }}
            />
          </Reveal>

          {/* ── Introducción ── */}
          <Reveal direction="up" distance={28} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
              <DisciplinaBgLayer nom={culturaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} pt={{ base: 6, md: 8 }} pb={{ base: 10, md: 14 }} textAlign="center">
                <Text
                  color={culturaTxt}
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.9"
                  opacity={0.92}
                  maxW="620px"
                  mx="auto"
                  mb={4}
                  style={{ textShadow: INK_SHADOW }}
                >
                  {t("metodo.gate.cultura.ultimoPaso")}{" "}
                  <Box as="span" fontStyle="italic" color={culturaTxt}>{t("metodo.gate.cultura.elMapa")}</Box>
                  {t("metodo.gate.cultura.intro1")}
                </Text>
                <Text
                  color={culturaTxt}
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.9"
                  opacity={0.92}
                  maxW="620px"
                  mx="auto"
                  fontStyle="italic"
                  style={{ textShadow: INK_SHADOW }}
                >
                  {t("metodo.gate.cultura.intro2")}
                </Text>
              </Box>
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      <CulturaIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

      <BotonCompania color={culturaTxt} bgColor={culturaBg} disciplinaNom={culturaNom} />

      <SiteFooter />

      <PagoCulturaModal
        isOpen={pagoOpen && !suscrito}
        onClose={() => { setPagoOpen(false); navigate("/home"); }}
        onPagar={pagarCultura}
        loading={pagoLoading}
        error={pagoError}
      />
    </Box>
  );
}
