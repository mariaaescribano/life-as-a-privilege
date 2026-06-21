import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import {
  experienciaById,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import { AZUL, glowPanel, glowHeader, glowBtn, glowBtnHover, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const INK_SHADOW = `0 1px 2px #fbf4e8, 0 0 6px #fbf4e8, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaProblema() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [problema, setProblema] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [guardadoOk, setGuardadoOk] = useState(false);
  const dataRef = useRef<LineaDeVidaData>({});
  const guardadoRef = useRef<string>("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: LineaDeVidaData = psi.data?.data || {};
        dataRef.current = d;
        const txt = typeof d["problema-actual"] === "string" ? (d["problema-actual"] as string) : "";
        setProblema(txt);
        guardadoRef.current = txt;
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const guardarSiCambio = async () => {
    if (problema === guardadoRef.current) return;
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    setGuardando(true);
    try {
      const next = { ...dataRef.current, "problema-actual": problema };
      await axios.patch(
        `${API_URL}/metodo-psicologia/${userId}`,
        { data: next },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dataRef.current = next;
      guardadoRef.current = problema;
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  // Guardado manual (botón): conserva el problema sin salir de la página.
  const guardar = async () => {
    await guardarSiCambio();
    setGuardadoOk(true);
  };

  const irALineaDeVida = async () => {
    await guardarSiCambio();
    navigate(`/metodo/psicologia/${exp!.id}`);
  };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }
  if (!exp) return null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 7, md: 9 }}>

          <MetodoStepHeader
            icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
            title="Problemas"
            pageLabel="2/9"
            bgColor={`${neuropsicologiaBg}f0`}
            color={neuropsicologiaTxt}
            nom={neuropsicologiaNom}
            mb={0}
            boxShadow={glowHeader}
            prev={{ label: "← Vuelve", onClick: () => { void guardarSiCambio(); navigate("/metodo/psicologia"); } }}
            next={{ label: "Línea de Vida →", onClick: irALineaDeVida }}
          />

          {/* Problema dentro de un box con fondo de psicología */}
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={azulBorde}
            boxShadow={glowPanel}
          >
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Flex
              position="relative"
              zIndex={1}
              direction="column"
              align="center"
              textAlign="center"
              px={{ base: 7, md: 12 }}
              py={{ base: 9, md: 12 }}
              gap={{ base: 6, md: 7 }}
            >
              <Text color={TINTA} fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" lineHeight="1.3" maxW="620px" style={{ textShadow: INK_SHADOW }}>
                {exp.problemaInicial.pregunta}
              </Text>
              {exp.problemaInicial.apoyo && (
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.85} maxW="520px" style={{ textShadow: INK_SHADOW }}>
                  {exp.problemaInicial.apoyo}
                </Text>
              )}
              <Textarea
                value={problema}
                onChange={(e) => { setProblema(e.target.value); setGuardadoOk(false); }}
                placeholder={exp.problemaInicial.placeholder || "Escribe aquí…"}
                w="100%"
                maxW="640px"
                minH={{ base: "200px", md: "260px" }}
                bg="rgba(255,251,243,0.38)"
                border={`1px solid ${TINTA}3a`}
                color={TINTA}
                borderRadius="xl"
                px={{ base: 5, md: 7 }}
                py={{ base: 4, md: 5 }}
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "lg", md: "xl" }}
                lineHeight="1.9"
                sx={{ caretColor: TINTA }}
                _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                _hover={{ borderColor: `${TINTA}55` }}
                _focus={{ borderColor: `${TINTA}88`, boxShadow: `0 0 0 1px ${TINTA}33`, bg: "rgba(255,251,243,0.52)" }}
              />

              {/* Guardado manual (no se guarda al escribir) */}
              <Box
                as="button"
                onClick={guardando ? undefined : guardar}
                position="relative"
                overflow="hidden"
                minW="160px"
                px={9}
                py={3}
                borderRadius="full"
                border={`1.5px solid ${AZUL}`}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "md", md: "lg" }}
                letterSpacing="0.05em"
                whiteSpace="nowrap"
                textAlign="center"
                cursor={guardando ? "wait" : "pointer"}
                boxShadow={glowBtn}
                transition="transform 0.2s, box-shadow 0.2s"
                _hover={guardando ? {} : { transform: "translateY(-2px)", boxShadow: glowBtnHover }}
              >
                <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="full" />
                <Box as="span" position="relative" zIndex={1} color={TINTA}
                     style={{ textShadow: `0 1px 2px #fbf4e8, 0 0 8px #fbf4e8` }}>
                  {guardando ? "Guardando…" : guardadoOk ? "Guardado ✓" : "Guardar"}
                </Box>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Flex>

      <AyudaRecorrido pagina="problema" />

      <SiteFooter />
    </Box>
  );
}
