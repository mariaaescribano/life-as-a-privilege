import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
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

// ⚠️ PENDIENTE: la imagen del ser humano del centro la pasará María (mañana).
const HUMANO_IMG = "/recorrido/fisiologia/humano.png";

// Ancho del box de sistema en la corona (ordenador).
const BOX_W = "142px";

// Un box de sistema (se usa igual en la corona de ordenador y en la lista móvil).
function SistemaBox({
  sistema,
  active,
  onClick,
  full = false,
}: {
  sistema: Sistema;
  active: boolean;
  onClick: () => void;
  /** true en móvil: ocupa todo el ancho y se apila. */
  full?: boolean;
}) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <Box
      as="button"
      onClick={onClick}
      position="relative"
      overflow="hidden"
      w={full ? "100%" : BOX_W}
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
      <Flex position="relative" zIndex={1} align="center" gap={3}
            direction={full ? "row" : "column"} textAlign={full ? "left" : "center"}
            px={full ? 4 : 3} py={full ? 3 : 3.5}>
        {/* Fotico del sistema (pendiente) → de momento inicial con color de acento */}
        <Flex flexShrink={0} align="center" justify="center"
              w={{ base: "42px", md: full ? "48px" : "46px" }}
              h={{ base: "42px", md: full ? "48px" : "46px" }}
              borderRadius="full" overflow="hidden"
              bg={`${sistema.color}33`} border={`1.5px solid ${sistema.color}`}
              boxShadow={`0 0 12px ${sistema.color}66`}>
          {!imgErr ? (
            <Image src={encodeURI(sistema.foto)} alt={sistema.label} w="100%" h="100%" objectFit="cover"
                   onError={() => setImgErr(true)} />
          ) : (
            <Text color={fisiologiaTxt} fontWeight="800" fontSize={{ base: "md", md: "lg" }}
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
              {sistema.label.charAt(0)}
            </Text>
          )}
        </Flex>
        <Text color={fisiologiaTxt} fontWeight="700" lineHeight="1.2"
              fontSize={{ base: "sm", md: full ? "md" : "xs" }} letterSpacing="0.02em"
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
  const [humanoErr, setHumanoErr] = useState(false);
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
            prev={{ label: "← Todas tus células", onClick: () => navigate("/metodo/fisiologia/todas-tus-celulas") }}
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

          {/* ── ORDENADOR: humano en el centro rodeado por los 12 sistemas ── */}
          <Reveal direction="up" distance={22} duration={0.65} w="100%">
            <Box display={{ base: "none", md: "block" }} position="relative" w="100%" maxW="860px" mx="auto">
              <Box position="relative" w="620px" h="620px" mx="auto">
                {/* Ser humano al centro */}
                <Flex position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)"
                      w="34%" h="72%" align="center" justify="center" zIndex={1}>
                  {!humanoErr ? (
                    <Image src={HUMANO_IMG} alt="Ser humano" w="100%" h="100%" objectFit="contain"
                           style={{ filter: `drop-shadow(0 0 22px ${fisiologiaTxt}55)` }}
                           onError={() => setHumanoErr(true)} />
                  ) : (
                    <Flex w="100%" h="100%" align="center" justify="center" direction="column" gap={2}
                          border={`1px dashed ${fisiologiaTxt}55`} borderRadius="2xl" textAlign="center" px={4}>
                      <Text color={`${fisiologiaTxt}cc`} fontSize="sm" fontStyle="italic">
                        Ser humano (próximamente)
                      </Text>
                    </Flex>
                  )}
                </Flex>

                {/* 12 sistemas repartidos en corona */}
                {SISTEMAS.map((s, i) => {
                  const ang = (i / SISTEMAS.length) * Math.PI * 2 - Math.PI / 2;
                  const x = 50 + Math.cos(ang) * 46;
                  const y = 50 + Math.sin(ang) * 46;
                  return (
                    <Box key={s.key} position="absolute" left={`${x}%`} top={`${y}%`}
                         transform="translate(-50%, -50%)" zIndex={2}>
                      <SistemaBox sistema={s} active={sistema?.key === s.key} onClick={() => setSistema(s)} />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Reveal>

          {/* ── MÓVIL: sin humano, los 12 sistemas en columna ── */}
          <Box display={{ base: "block", md: "none" }} w="100%">
            <Flex direction="column" gap={3} w="100%" maxW="440px" mx="auto">
              {SISTEMAS.map((s) => (
                <SistemaBox key={s.key} sistema={s} active={sistema?.key === s.key} full onClick={() => setSistema(s)} />
              ))}
            </Flex>
          </Box>
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
