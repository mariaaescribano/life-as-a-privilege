// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · TUS HERIDAS (listado)  ·  10/16
//
// El reverso de la página anterior: aquí la persona ve, reunidas, todas las
// heridas que ha guardado, en la misma rejilla de boxes cuadrados (cada una de
// su color). El tono es de reconocimiento, no de análisis.
//
// Persistencia: data.heridas = RelacionHuellaNudo[].
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { IntroRecorrido } from "../../components/metodo/IntroRecorrido";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { HeridaIcon } from "../../components/metodo/HeridaIcon";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { HeridaGrid } from "../../components/metodo/HeridaGrid";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { COMIC_NARRAR } from "../../components/metodo/comicNarrar";
import {
  experienciaById,
  HERIDAS_LISTA,
  type LineaDeVidaData,
  type RelacionHuellaNudo,
} from "../../components/metodo/psicologiaRecorrido";
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
// Halo claro para que la tinta oscura se lea sobre la acuarela de psicología.
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaHeridasLista() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [heridas, setHeridas] = useState<RelacionHuellaNudo[]>([]);
  // Cómic «Narrar», intercalado antes de pasar a contar lo vivido.
  const [comicOpen, setComicOpen] = useState(false);
  const dataRef = useRef<LineaDeVidaData>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: LineaDeVidaData = psi.data?.data || {};
        dataRef.current = d;
        setHeridas(Array.isArray(d.heridas) ? d.heridas.map((h) => ({ ...h, titulo: h.titulo ?? "" })) : []);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const borrarHerida = async (id: string) => {
    const next = heridas.filter((h) => h.id !== id);
    setHeridas(next);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    try {
      const data = { ...dataRef.current, heridas: next };
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
            title="Tus heridas"
            bgColor={`${neuropsicologiaBg}f0`}
            color={neuropsicologiaTxt}
            nom={neuropsicologiaNom}
            step={{ current: 12, total: 23 }}
            mb={0}
            boxShadow={glowHeader}
            prev={{ label: "← Heridas", onClick: async () => { await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/huellas-nudos`); } }}
            next={{ label: "Narra →", onClick: async () => { await flushSaves(); setComicOpen(true); } }}
          />
          </Reveal>

          {/* Frase de reconocimiento sobre el turquesa */}
          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%" display="flex" justifyContent="center">
          <IntroRecorrido>{HERIDAS_LISTA.frase}</IntroRecorrido>
          </Reveal>

          {heridas.length === 0 ? (
            <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.22} duration={0.75} w="100%" display="flex" justifyContent="center">
            <Box position="relative" w="100%" maxW="560px" borderRadius="2xl" overflow="hidden" border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Flex position="relative" zIndex={1} direction="column" align="center" gap={4} px={6} py={{ base: 12, md: 16 }} textAlign="center">
                <HeridaIcon size={30} color={TINTA} opacity={0.45} />
                <Text color={TINTA} fontStyle="italic" opacity={0.85} fontSize={{ base: "md", md: "lg" }}
                      style={{ textShadow: `0 1px 2px ${PAPEL}` }}>
                  Todavía no has guardado ninguna herida.
                </Text>
                <Box as="button" onClick={() => navigate(`/metodo/psicologia/${exp.id}/huellas-nudos`)}
                     px={6} py={2.5} borderRadius="full" bg={TINTA} fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                     letterSpacing="0.04em" cursor="pointer" boxShadow={`0 2px 14px rgba(0,0,0,0.22), 0 0 16px ${TINTA}3a`}
                     _hover={{ transform: "translateY(-2px)" }} transition="all 0.18s">
                  <Box as="span" color={neuropsicologiaBg} style={{ textShadow: `0 1px 2px rgba(0,0,0,0.3)` }}>← Crear mis heridas</Box>
                </Box>
              </Flex>
            </Box>
            </Reveal>
          ) : (
            <HeridaGrid heridas={heridas} onBorrar={(id) => void borrarHerida(id)} />
          )}
        </Flex>
      </Flex>

      <AyudaRecorrido pagina="heridas" />

      {/* Cómic «Narrar» — se muestra entre Tus heridas y Narra: ya tiene sus
          heridas con nombre, y aquí se explica por qué contarlas cambia algo
          aunque no cambie los hechos. Al terminarlo (o pulsar «Continuar →»)
          avanza a /regulacion. */}
      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={async () => { await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/regulacion`); }}
        vinetas={COMIC_NARRAR}
        continueLabel="Continuar"
        botonNitido
        themeColor={neuropsicologiaTxt}
        disciplinaBgImage="/img/fondos/psciologia.webp"
        disciplinaBgColor={neuropsicologiaBg}
        textShadow={INK_SHADOW}
      />

      <SiteFooter />
    </Box>
  );
}
