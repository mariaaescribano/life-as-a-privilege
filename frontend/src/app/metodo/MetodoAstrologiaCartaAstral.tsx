import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg, SPACE_IMG } from "../../components/metodo/SpaceBg";
import { useImagesReady } from "../../hooks/useImagesReady";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";
import { CartaAstral3D } from "../../components/metodo/CartaAstral3D/CartaAstral3D";
import { EditarCuerpoModal } from "../../components/metodo/CartaAstral3D/EditarCuerpoModal";
import type { CartaNatal } from "../../components/metodo/CartaAstral3D/types";
import {
  SaberMasModal,
  useCartaPlanetas,
  valorOf,
  esCuerpoCompleto,
} from "../../components/metodo/Planetas";
import { cuerpoByKey, CUERPOS, type CuerpoKey } from "../../components/metodo/astrologiaData";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

const EyeIcon = () => (
  <Box
    as="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    w="16px"
    h="16px"
    fill="currentColor"
    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}
  >
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

// Contenido del popup «¿Qué es esto?» (botón flotante, encima del de la
// llamada): explica esta página del recorrido. Edítalo libremente.
const QUE_ES_ESTO = {
  parrafos: [
    "Ya sabes qué Planetas viven en tu carta. Aquí los recorres uno a uno, profundizando en lo que cada uno significa en ti.",
    "Léelos sin prisa: mientras tú avanzas, yo estoy acabando de escribir tu carta.",
  ],
};

export default function MetodoAstrologiaCartaAstral() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [carta, setCarta] = useState<CartaNatal | null>(null);
  const [hayPdf, setHayPdf] = useState(false); // María ya leyó la carta (subió el PDF)
  const [editOpen, setEditOpen] = useState(false);
  const [comicOpen, setComicOpen] = useState(false);

  // Estado de selección de signo/casa por planeta (compartido con /planetas)
  const { carta: cartaPlanetas, actualizar, todoCompletado } = useCartaPlanetas();

  // Saber más
  const [saberMasKey, setSaberMasKey] = useState<CuerpoKey | null>(null);
  const fotosListas = useImagesReady([SPACE_IMG]);

  // Al abrir el modal "Saber más" de un cuerpo, lo marcamos como leído (profundizado)
  const abrirSaberMas = (k: CuerpoKey) => {
    setSaberMasKey(k);
    const cuerpo = cuerpoByKey(k);
    if (!cuerpo) return;
    const v = valorOf(cartaPlanetas, k);
    if (v.signo && !v.profundizadoSigno) actualizar(k, "profundizadoSigno", true);
    if (cuerpo.conCasa && v.casa != null && !v.profundizadoCasa) actualizar(k, "profundizadoCasa", true);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      navigate("/welcome");
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });

    (async () => {
      try {
        const estadoRes = await axios.get<{ solicitud_enviada_at?: string | null; link_carta?: string | null; retos?: { id: string }[] } | null>(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Accesible en cuanto hay solicitud; los retos (o el PDF) desbloquean el "siguiente".
        if (!estadoRes.data?.solicitud_enviada_at) {
          navigate("/metodo/astrologia");
          return;
        }
        const tieneRetos = Array.isArray(estadoRes.data?.retos) && estadoRes.data!.retos!.length > 0;
        setHayPdf(!!estadoRes.data?.link_carta || tieneRetos);

        const res = await axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let cartaCargada = res.data;

        // Cuando cambia el algoritmo (entrada nueva de Quirón, calibración de M0,
        // fix de cusps, etc.) bump esta clave: cualquier carta guardada antes
        // disparará un recálculo automático una sola vez por usuario.
        const CARTA_CALC_VERSION = "v3-chiron-m0-28";
        const versionKey = `cartaCalcVersion:${userId}`;
        const tieneQuiron = !!cartaCargada?.planetas?.some((p) => p.planeta === "quiron");
        const needsRefresh =
          !!cartaCargada &&
          (!tieneQuiron || localStorage.getItem(versionKey) !== CARTA_CALC_VERSION);

        if (needsRefresh) {
          try {
            const rec = await axios.post<{ success: boolean; carta?: CartaNatal }>(
              `${API_URL}/metodo-astrologia/carta-natal/${userId}/recalcular`,
              {},
              { headers: { Authorization: `Bearer ${token}` } },
            );
            if (rec.data?.success && rec.data.carta) {
              cartaCargada = rec.data.carta;
              localStorage.setItem(versionKey, CARTA_CALC_VERSION);
            }
          } catch {
            // Si falla el recálculo seguimos con la carta antigua.
          }
        }

        setCarta(cartaCargada ?? null);
      } catch {
        setCarta(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const completados = useMemo(() => {
    const out: Partial<Record<CuerpoKey, boolean>> = {};
    for (const c of CUERPOS) {
      out[c.key] = esCuerpoCompleto(c, valorOf(cartaPlanetas, c.key));
    }
    return out;
  }, [cartaPlanetas]);

  const cuerpoSaberMas = saberMasKey ? cuerpoByKey(saberMasKey) : null;

  if (loading || !fotosListas) {
    return <RecorridoLoading />;
  }

  const headerNext = {
    label: "Puntos clave →",
    onClick: () => navigate("/metodo/astrologia/lectura"),
    disabled: !todoCompletado || !hayPdf,
    disabledTooltip: !hayPdf
      ? "Estoy leyendo tu carta. Cuando esté lista se te hará saber a través de un email y podrás acceder a tu lectura especializada."
      : "Lee todos los planetas antes de continuar",
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="private" />

      <Flex
        flex="1"
        justify="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 8, md: 12 }}
        pb={{ base: 12, md: 16 }}
      >
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={{ base: 6, md: 8 }}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title="Arquetipos"
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 3, total: 8 }}
              mb={0}
              prev={{ label: "← Lo primero", onClick: () => navigate("/metodo/astrologia/solascendenteluna") }}
              extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
              next={headerNext}
            />
          </Reveal>

          {/* ── Box estrellado contenedor de la carta ──
              Entrada SOLO de opacidad (sin translate ni scale): el <Canvas> de
              react-three-fiber mide su contenedor con getBoundingClientRect UNA
              vez al montar, así que si lo hiciera durante un transform (scale/
              translate) capturaría una caja escalada/desplazada y la rueda se
              vería mal colocada durante todo el "dinamismo" hasta un resize.
              Un fundido puro deja la caja quieta y la rueda siempre bien. */}
          <Reveal
            direction="none"
            delay={0.12}
            duration={0.8}
            position="relative"
            w="100%"
            // Caja más ancha SOLO para dar más padding alrededor de la rueda: la
            // rueda está topada en maxW 680, así que el ancho de más queda como
            // margen interior; el círculo NO cambia de tamaño. maxW ESTÁTICO: la
            // entrada es solo opacidad, así el <Canvas> mide bien su caja al montar.
            maxW="820px"
            mx="auto"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${astrologiaTxt}1a, 0 0 48px ${astrologiaTxt}10`}
          >
            <SpaceBg overlay="rgba(8,13,30,0.65)" />

            <Flex
              position="relative"
              zIndex={1}
              direction="column"
              align="center"
              gap={{ base: 5, md: 6 }}
              px={{ base: 5, md: 12 }}
              py={{ base: 10, md: 14 }}
            >
              <CartaAstral3D
                color={astrologiaTxt}
                {...(carta ? { carta } : {})}
                onSaberMas={abrirSaberMas}
                completados={completados}
              />

            </Flex>
          </Reveal>
        </Flex>
      </Flex>

      <SaberMasModal
        isOpen={!!cuerpoSaberMas}
        onClose={() => setSaberMasKey(null)}
        cuerpo={cuerpoSaberMas ?? null}
        signo={cuerpoSaberMas ? valorOf(cartaPlanetas, cuerpoSaberMas.key).signo : undefined}
        casa={cuerpoSaberMas ? valorOf(cartaPlanetas, cuerpoSaberMas.key).casa : undefined}
      />

      <EditarCuerpoModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={(nueva) => setCarta(nueva)}
        color={astrologiaTxt}
      />

      <ComicAstrologiaModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
      />

      <BotonCompania color={astrologiaTxt} bgColor={astrologiaBg} disciplinaNom={astrologiaNom} precio={20}
                     llamadaTitulo="Reserva tu llamada de astrología" queEsEsto={QUE_ES_ESTO} />
      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
