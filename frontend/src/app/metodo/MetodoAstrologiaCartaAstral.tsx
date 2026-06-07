import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg } from "../../components/metodo/SpaceBg";
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
import { API_URL, astrologiaBg, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

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

export default function MetodoAstrologiaCartaAstral() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [carta, setCarta] = useState<CartaNatal | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [comicOpen, setComicOpen] = useState(false);

  // Estado de selección de signo/casa por planeta (compartido con /planetas)
  const { carta: cartaPlanetas, actualizar, todoCompletado } = useCartaPlanetas();

  // Saber más
  const [saberMasKey, setSaberMasKey] = useState<CuerpoKey | null>(null);

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
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      navigate("/welcome");
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });

    (async () => {
      try {
        const estadoRes = await axios.get<{ link_carta?: string | null } | null>(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!estadoRes.data?.link_carta) {
          navigate("/metodo/astrologia");
          return;
        }

        const res = await axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let cartaCargada = res.data;

        // Cuando cambia el algoritmo (entrada nueva de Quirón, calibración de M0,
        // fix de cusps, etc.) bump esta clave: cualquier carta guardada antes
        // disparará un recálculo automático una sola vez por usuario.
        const CARTA_CALC_VERSION = "v3-chiron-m0-28";
        const versionKey = `cartaCalcVersion:${userId}`;
        const tieneQuiron = !!cartaCargada?.planetas.some((p) => p.planeta === "quiron");
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

  if (loading) {
    return (
      <Box minH="100vh" bg="#008080">
        <SpinnerTurquesa />
      </Box>
    );
  }

  const headerNext = {
    label: "Mi carta (PDF) →",
    onClick: () => navigate("/metodo/astrologia/lectura"),
    disabled: !todoCompletado,
    disabledTooltip: "Lee todos los planetas antes de continuar",
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
          <MetodoStepHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Astrología"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            space
            mb={0}
            prev={{ label: "← Sol, Luna y Asc.", onClick: () => navigate("/metodo/astrologia/solascendenteluna") }}
            extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
            next={headerNext}
          />

          {/* ── Box estrellado contenedor de la carta ── */}
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={`1px solid ${astrologiaTxt}44`}
            boxShadow={`0 0 22px rgba(255,255,255,0.3), 0 0 50px rgba(255,255,255,0.15), 0 0 90px rgba(180,255,245,0.16), 0 0 30px ${astrologiaTxt}33, 0 0 80px ${astrologiaTxt}1f`}
          >
            <SpaceBg overlay="rgba(8,13,30,0.65)" />

            <Flex
              position="relative"
              zIndex={1}
              direction="column"
              align="center"
              gap={{ base: 5, md: 6 }}
              px={{ base: 4, md: 8 }}
              py={{ base: 8, md: 10 }}
            >
              <CartaAstral3D
                color={astrologiaTxt}
                {...(carta ? { carta } : {})}
                onSaberMas={abrirSaberMas}
                completados={completados}
              />

            </Flex>
          </Box>
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

      <SiteFooter />
    </Box>
  );
}
