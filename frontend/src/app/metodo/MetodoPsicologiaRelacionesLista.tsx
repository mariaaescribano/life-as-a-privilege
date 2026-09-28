// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · TUS RELACIONES (listado)  ·  18/29
//
// El reverso de «Relación»: aquí la persona ve, reunidas, todas las relaciones
// que ha guardado, en la misma rejilla de boxes cuadrados (cada una de su
// color). El tono es de reconocimiento, no de análisis.
//
// Persistencia: data.constelaciones = Constelacion[].
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { RelacionIcon } from "../../components/metodo/RelacionIcon";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { RelacionGrid } from "../../components/metodo/RelacionGrid";
import { useT } from "../../i18n";
import {
  experienciaById,
  type LineaDeVidaData,
  type Constelacion,
} from "../../components/metodo/psicologiaRecorrido";
import { useRelacionesLista } from "../../components/metodo/psicologiaRecorrido.en";
import { glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";

export default function MetodoPsicologiaRelacionesLista() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");
  const relacionesLista = useRelacionesLista();

  const [loading, setLoading] = useState(true);
  const [relaciones, setRelaciones] = useState<Constelacion[]>([]);
  const dataRef = useRef<LineaDeVidaData>({});

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

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: LineaDeVidaData = psi.data?.data || {};
        dataRef.current = d;
        // Blindaje de las formas antiguas (arrays y strings), como en Relación.
        setRelaciones(Array.isArray(d.constelaciones)
          ? d.constelaciones.map((c) => ({
              ...c,
              titulo: c.titulo ?? "",
              texto: c.texto ?? "",
              nudos: Array.isArray(c.nudos) ? c.nudos : [],
              arquetipos: Array.isArray(c.arquetipos) ? c.arquetipos : [],
            }))
          : []);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const borrarRelacion = async (id: string) => {
    const next = relaciones.filter((c) => c.id !== id);
    setRelaciones(next);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    try {
      const data = { ...dataRef.current, constelaciones: next };
      await axios.patch(`${API_URL}/metodo-psicologia/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = data;
    } catch {
      // silencioso
    }
  };

  if (loading) return <PsicologiaLoading />;
  if (!exp) return null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={{ base: 7, md: 9 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
            title={t("metodo.psico.tusRelaciones")}
            bgColor={`${neuropsicologiaBg}f0`}
            color={neuropsicologiaTxt}
            nom={neuropsicologiaNom}
            step={{ current: 18, total: 29 }}
            mb={0}
            boxShadow={glowHeader}
            prev={{ label: `← ${t("metodo.psico.paso.relacion")}`, onClick: async () => { await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/integracion`); } }}
            next={{ label: `${t("metodo.psico.paso.recuerdate")} →`, onClick: async () => { await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/dones`); } }}
          />
          </Reveal>

          {/* Frase de reconocimiento sobre el turquesa */}
          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%" display="flex" justifyContent="center">
          <IntroRecorrido>{relacionesLista.frase}</IntroRecorrido>
          </Reveal>

          {relaciones.length === 0 ? (
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.22} duration={0.75} w="100%" display="flex" justifyContent="center">
            <Box position="relative" w="100%" maxW="560px" borderRadius="2xl" overflow="hidden" border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Flex position="relative" zIndex={1} direction="column" align="center" gap={4} px={6} py={{ base: 12, md: 16 }} textAlign="center">
                <RelacionIcon size={30} color={TINTA} opacity={0.45} />
                <Text color={TINTA} fontStyle="italic" opacity={0.85} fontSize={{ base: "md", md: "lg" }}
                      style={{ textShadow: `0 1px 2px ${PAPEL}` }}>{t("metodo.psico.sinRelacionesLista")}</Text>
                <Box as="button" onClick={() => navigate(`/metodo/psicologia/${exp.id}/integracion`)}
                     px={6} py={2.5} borderRadius="full" bg={TINTA} fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                     letterSpacing="0.04em" cursor="pointer" boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`}
                     _hover={{ transform: "translateY(-2px)" }} transition="all 0.18s">
                  <Box as="span" color={neuropsicologiaBg} style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>{t("metodo.psico.crearMisRelaciones")}</Box>
                </Box>
              </Flex>
            </Box>
            </Reveal>
          ) : (
            <RelacionGrid relaciones={relaciones} onBorrar={(id) => void borrarRelacion(id)} />
          )}
        </Flex>
      </Flex>

      <AyudaRecorrido pagina="integracion" />

      <SiteFooter />
    </Box>
  );
}
