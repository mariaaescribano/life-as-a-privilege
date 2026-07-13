import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { SistemaModal } from "../../components/metodo/SistemaModal";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon } from "../../GlobalVariables";
import { SISTEMAS, type Sistema } from "../../hardCoded/espacio/SistemasFisiologia";

// Tarjeta de un sistema: imagen arriba + nombre. Se colocan en rejilla de 3.
function SistemaBox({
  sistema,
  active,
  onClick,
}: {
  sistema: Sistema;
  active: boolean;
  onClick: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <Box
      as="button"
      onClick={onClick}
      position="relative"
      overflow="hidden"
      w="100%"
      h="100%"
      borderRadius="xl"
      border={`1px solid ${active ? fisiologiaTxt : `${fisiologiaTxt}44`}`}
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      transition="all 0.2s ease"
      boxShadow={active
        ? `0 6px 24px rgba(0,0,0,0.3), 0 0 24px ${sistema.color}, 0 0 14px ${fisiologiaTxt}66`
        : `0 4px 16px rgba(0,0,0,0.22), 0 0 14px ${fisiologiaTxt}1f`}
      _hover={{ transform: "translateY(-3px)", borderColor: `${fisiologiaTxt}aa`,
                boxShadow: `0 10px 28px rgba(0,0,0,0.32), 0 0 22px ${sistema.color}` }}
      _active={{ transform: "translateY(-1px)" }}
    >
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="xl" />
      <Flex position="relative" zIndex={1} direction="column" align="center" gap={3}
            p={{ base: 4, md: 5 }} h="100%">
        {/* Imagen del sistema (pendiente) → de momento inicial con color de acento */}
        <Box w="100%" aspectRatio={{ base: 1.4, md: 1.5 }} borderRadius="lg" overflow="hidden"
             bg={`${sistema.color}22`} border={`1px solid ${sistema.color}66`}
             boxShadow={`0 0 12px ${sistema.color}44`}
             display="flex" alignItems="center" justifyContent="center">
          {!imgErr ? (
            <Image src={encodeURI(sistema.foto)} alt={sistema.label} w="100%" h="100%" objectFit="cover"
                   onError={() => setImgErr(true)} />
          ) : (
            <Text color={fisiologiaTxt} fontWeight="800" fontSize={{ base: "3xl", md: "4xl" }}
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
              {sistema.label.charAt(0)}
            </Text>
          )}
        </Box>
        <Text color={fisiologiaTxt} fontWeight="700" lineHeight="1.2" textAlign="center"
              fontSize={{ base: "md", md: "lg" }} letterSpacing="0.02em"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.65)" }}>
          {sistema.label}
        </Text>
      </Flex>
    </Box>
  );
}

export default function MetodoFisiologiaSistemas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sistema, setSistema] = useState<Sistema | null>(null);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try { const t = await axios.get(`${API_URL}/payment/test/enabled`); testEnabled = !!t.data?.enabled; } catch { /* */ }
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/metodo/fisiologia"); return; }
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={7}>

          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Sistemas"
            pageLabel="1/2"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Las células de tus órganos", onClick: () => navigate("/metodo/fisiologia/todas-tus-celulas") }}
            extra={celulasBtn}
            next={{ label: "El cuerpo →", onClick: () => navigate("/metodo/fisiologia/organismo") }}
          />

          <Reveal direction="up" distance={18} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Varios órganos que colaboran forman un sistema. Pulsa cada sistema para conocerlo
              y registrar cómo lo sientes.
            </Text>
          </Reveal>

          {/* ── Rejilla de sistemas: 3 por fila (2 en móvil) ── */}
          <Reveal direction="up" distance={22} duration={0.65} w="100%">
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
              {SISTEMAS.map((s) => (
                <SistemaBox key={s.key} sistema={s} active={sistema?.key === s.key} onClick={() => setSistema(s)} />
              ))}
            </SimpleGrid>
          </Reveal>
        </Flex>
      </Flex>

      {/* Modal del sistema: su cómic + el test de autorregistro (contenido pendiente) */}
      <SistemaModal sistema={sistema} onClose={() => setSistema(null)} />

      {celulasModal}
      <IndiceFisiologia />
      <SiteFooter />
    </Box>
  );
}
