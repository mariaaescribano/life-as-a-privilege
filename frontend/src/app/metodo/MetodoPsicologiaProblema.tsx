import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { BotonGuardar } from "../../components/global/BotonGuardar";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import {
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import { useExperiencia } from "../../components/metodo/psicologiaRecorrido.en";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";
import { useT } from "../../i18n";

const TINTA = neuropsicologiaTxt;
const INK_SHADOW = `0 1px 2px #fbf4e8, 0 0 6px #fbf4e8, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaProblema() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  // La experiencia en el idioma activo: de ella salen el enunciado y el
  // placeholder de esta página.
  const exp = useExperiencia(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [problema, setProblema] = useState("");
  const [, setGuardando] = useState(false);
  const dataRef = useRef<LineaDeVidaData>({});
  const guardadoRef = useRef<string>("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await getUserMe();
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

  const guardarSiCambio = async (): Promise<boolean> => {
    if (problema === guardadoRef.current) return true; // nada que guardar → ya está guardado
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return false;
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
      return true;
    } catch {
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const irAAce = async () => {
    if (problema.trim().length === 0) return; // no se avanza a ACE sin escribir nada
    await guardarSiCambio();
    await flushSaves();
    navigate(`/metodo/psicologia/${exp!.id}/ace`);
  };

  if (loading) {
    return <PsicologiaLoading />;
  }
  if (!exp) return null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 7, md: 9 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title={t("metodo.psico.paso.problemas")}
              step={{ current: 2, total: 29 }}
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: `← ${t("metodo.psico.paso.vuelveATi")}`, onClick: async () => { await guardarSiCambio(); await flushSaves(); navigate("/metodo/psicologia"); } }}
              next={{
                label: `${t("metodo.psico.paso.ace")} →`,
                onClick: irAAce,
                // No se puede avanzar a ACE sin haber escrito algo en el box.
                disabled: problema.trim().length === 0,
                disabledTooltip: t("metodo.psico.faltaProblema"),
              }}
            />
          </Reveal>

          {/* Problema dentro de un box con fondo de psicología */}
          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={azulBorde}
            boxShadow={glowPanel}
          >
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            {/* Dentro del box, cada pieza entra en cascada (pregunta → apoyo →
                hueco de escribir → guardar): la página se coloca, no aparece. */}
            <RevealStagger
              stagger={0.14}
              delayChildren={0.35}
              position="relative"
              zIndex={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
              px={{ base: 7, md: 12 }}
              py={{ base: 9, md: 12 }}
              gap={{ base: 6, md: 7 }}
            >
              <RevealItem direction="up" distance={18}>
              <Text color={TINTA} fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" lineHeight="1.3" maxW="620px" style={{ textShadow: INK_SHADOW }}>
                {exp.problemaInicial.pregunta}
              </Text>
              </RevealItem>
              {exp.problemaInicial.apoyo && (
                <RevealItem direction="up" distance={18}>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.85} maxW="520px" style={{ textShadow: INK_SHADOW }}>
                  {exp.problemaInicial.apoyo}
                </Text>
                </RevealItem>
              )}
              <RevealItem direction="up" distance={22} scaleFrom={0.985} w="100%" display="flex" justifyContent="center">
              <Textarea
                value={problema}
                onChange={(e) => setProblema(e.target.value)}
                placeholder={exp.problemaInicial.placeholder || t("metodo.psico.escribeAqui")}
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
                _focus={{ borderColor: TINTA, boxShadow: `0 0 0 1px ${TINTA}66`, bg: "rgba(255,251,243,0.52)" }}
              />
              </RevealItem>

              {/* Guardado manual (no se guarda al escribir) */}
              <RevealItem direction="up" distance={16}>
              <BotonGuardar onSave={guardarSiCambio} bg={TINTA} fg={neuropsicologiaBg} />
              </RevealItem>
            </RevealStagger>
          </Box>
          </Reveal>
        </Flex>
      </Flex>

      <AyudaRecorrido pagina="problema" />

      <SiteFooter />
    </Box>
  );
}
