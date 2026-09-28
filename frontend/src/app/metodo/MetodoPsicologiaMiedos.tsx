// ─────────────────────────────────────────────────────────────────────────
// PÁGINA · MIEDOS (nombrarlos)  ·  20/27
//
// Entre «Dones» y «Enfrenta tus miedos». La persona escribe sus miedos más
// profundos, uno a uno. Los dos boxes son la MISMA pieza que «Nudos»
// (BoxesNombrar): cambia el texto y de dónde salen los datos.
// En la página siguiente los enfrentará respondiendo a unas preguntas.
//
// Datos: data.miedos = MiedoItem[]  (cada uno con id, texto y respuestas).
// ─────────────────────────────────────────────────────────────────────────
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
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { COMIC_MIEDO } from "../../components/metodo/comicMiedo";
import { BoxesNombrar } from "../../components/metodo/BoxesNombrar";
import { useComic } from "../../i18n/comics";
import { useT } from "../../i18n";
import {
  experienciaById,
  type LineaDeVidaData,
  type MiedoItem,
} from "../../components/metodo/psicologiaRecorrido";
import { useMiedos } from "../../components/metodo/psicologiaRecorrido.en";
import { glowHeader } from "../../components/metodo/psicologiaGlow";
import { flushSaves } from "../../utils/flushSaves";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

const nuevoId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `m-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

export default function MetodoPsicologiaMiedos() {
  const t = useT();
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");
  const miedosTxt = useMiedos();

  const [loading, setLoading] = useState(true);
  const [miedos, setMiedos] = useState<MiedoItem[]>([]);
  const [guardando, setGuardando] = useState(false);
  // Cómic «El miedo», intercalado antes de pasar a Atrévete.
  const [comicOpen, setComicOpen] = useState(false);
  // Las viñetas en el idioma activo (el español manda: fotos y orden salen de él).
  const comicVinetas = useComic("psicologia-miedo", COMIC_MIEDO);
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
        setMiedos(Array.isArray(d.miedos) ? d.miedos : []);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (nuevos: MiedoItem[]) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    setGuardando(true);
    try {
      const next = { ...dataRef.current, miedos: nuevos };
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

  const añadirMiedo = (texto: string) => {
    const v = texto.trim();
    if (!v) return;
    if (miedos.some((m) => m.texto.toLowerCase() === v.toLowerCase())) return;
    const next = [...miedos, { id: nuevoId(), texto: v }];
    setMiedos(next);
    void persistir(next);
  };

  const quitarMiedo = (id: string) => {
    const next = miedos.filter((m) => m.id !== id);
    setMiedos(next);
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
              title={t("metodo.psico.paso.miedos")}
              bgColor={`${neuropsicologiaBg}f0`}
              color={neuropsicologiaTxt}
              nom={neuropsicologiaNom}
              step={{ current: 22, total: 29 }}
              mb={0}
              boxShadow={glowHeader}
              prev={{ label: `← ${t("metodo.psico.tusDones")}`, onClick: () => navigate(`/metodo/psicologia/${exp.id}/dones-lista`) }}
              next={{
                label: `${t("metodo.psico.paso.atrevete")} →`,
                onClick: async () => { await flushSaves(); setComicOpen(true); },
                // Hasta que no haya al menos un miedo (escrito o elegido), la
                // siguiente página queda bloqueada. Si los borra todos, se vuelve
                // a bloquear (miedos.length se recalcula).
                disabled: miedos.length === 0,
                disabledTooltip: t("metodo.psico.faltaMiedo"),
              }}
            />
            </Reveal>

            {/* Los dos boxes gemelos (pieza común con Nudos): a la izquierda se
                escribe o se elige, y el miedo aparece al momento en la lista de
                la derecha, uno debajo de otro en su orden. */}
            <BoxesNombrar
              pregunta={miedosTxt.pregunta}
              apoyo={miedosTxt.apoyo}
              placeholder={t("metodo.psico.escribeMiedo")}
              ejemplos={miedosTxt.ejemplos}
              tituloLista="Mis Miedos"
              items={miedos.map((m) => ({ id: m.id, texto: m.texto }))}
              vacioTexto={t("metodo.psico.aquiMiedos")}
              seGuardanTexto={t("metodo.psico.miedosSeGuardan")}
              guardando={guardando}
              onAñadir={añadirMiedo}
              onQuitar={quitarMiedo}
            />
          </Flex>
        </Flex>
      </Box>

      <AyudaRecorrido pagina="miedos" />

      {/* Cómic «El miedo» — se muestra entre Miedos y Atrévete: ya ha escrito de
          qué tiene miedo, y aquí se le da la vuelta (detrás de cada miedo hay
          algo que le importa), que es el giro que la página siguiente le pide.
          Al terminarlo (o pulsar «Continuar →») avanza a /miedos-preguntas. */}
      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={async () => { await flushSaves(); navigate(`/metodo/psicologia/${exp.id}/miedos-preguntas`); }}
        vinetas={comicVinetas}
        continueLabel={t("comun.continuar")}
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
