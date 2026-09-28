import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import { PsicologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { Reveal } from "../../components/global/Reveal";
import { NudoEspiralIcon } from "../../components/metodo/NudoEspiralIcon";
import { BoxesNombrar } from "../../components/metodo/BoxesNombrar";
import {
  experienciaById,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import { useNudos } from "../../components/metodo/psicologiaRecorrido.en";
import { glowHeader } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";
import { useT } from "../../i18n";

const TINTA = neuropsicologiaTxt;

export default function MetodoPsicologiaNudos() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");
  const nudosTxt = useNudos();

  const [loading, setLoading] = useState(true);
  const [nudos, setNudos] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
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

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: LineaDeVidaData = psi.data?.data || {};
        dataRef.current = d;
        setNudos(Array.isArray(d.nudos) ? d.nudos : []);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (nuevosNudos: string[]) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    setGuardando(true);
    try {
      const next = { ...dataRef.current, nudos: nuevosNudos };
      await axios.patch(
        `${API_URL}/metodo-psicologia/${userId}`,
        { data: next },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dataRef.current = next;
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  const añadirNudo = (texto: string) => {
    const v = texto.trim();
    if (!v) return;
    if (nudos.some((n) => n.toLowerCase() === v.toLowerCase())) return;
    const next = [...nudos, v];
    setNudos(next);
    void persistir(next);
  };

  const quitarNudo = (nudo: string) => {
    const next = nudos.filter((n) => n !== nudo);
    setNudos(next);
    void persistir(next);
  };

  if (loading) {
    return <PsicologiaLoading />;
  }
  if (!exp) return null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box position="relative" flex="1">
        <Flex position="relative" zIndex={1} justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
          <Flex direction="column" align="center" w="100%" maxW={{ base: "760px", lg: "1080px" }} gap={{ base: 7, md: 9 }}>

            <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
              title={t("metodo.psico.paso.nudos")}
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 12, total: 29 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: `← ${t("metodo.psico.paso.huellas")}`, onClick: () => navigate(`/metodo/psicologia/${exp.id}/huellas`) }}
              next={{
                label: `${t("metodo.psico.paso.necesidades")} →`,
                onClick: async () => { await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/necesidades`); },
                // Hasta que no haya al menos un nudo (elegido o escrito), la
                // siguiente página queda bloqueada. Si los borra todos, se vuelve
                // a bloquear (nudos.length se recalcula).
                disabled: nudos.length === 0,
                disabledTooltip: t("metodo.psico.faltaNudo"),
              }}
            />
            </Reveal>

            {/* Los dos boxes gemelos (pieza común con Miedos): a la izquierda se
                escribe o se elige, y el nudo aparece al momento en la lista de
                la derecha, uno debajo de otro en su orden. */}
            <BoxesNombrar
              iconoPregunta={<NudoEspiralIcon size={30} color={TINTA} strokeWidth={1.7} />}
              pregunta={nudosTxt.pregunta}
              placeholder={t("metodo.psico.escribeNudo")}
              ejemplos={nudosTxt.ejemplos}
              tituloLista="Mis Nudos"
              iconoLista={<NudoEspiralIcon size={28} color={TINTA} strokeWidth={1.8} />}
              iconoFila={<NudoEspiralIcon size={18} color={TINTA} strokeWidth={1.9} />}
              items={nudos.map((n) => ({ id: n, texto: n }))}
              vacioTexto={t("metodo.psico.aquiNudos")}
              seGuardanTexto={t("metodo.psico.nudosSeGuardan")}
              guardando={guardando}
              onAñadir={añadirNudo}
              onQuitar={quitarNudo}
            />
          </Flex>
        </Flex>
      </Box>

      <AyudaRecorrido pagina="nudos" />

      <SiteFooter />
    </Box>
  );
}
