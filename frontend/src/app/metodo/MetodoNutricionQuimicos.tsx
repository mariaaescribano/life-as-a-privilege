import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../i18n";
import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { SendaNutrientes } from "../../components/metodo/SendaNutrientes";
import { Reveal } from "../../components/global/Reveal";
import { ComicMicrobiotaModal } from "../../components/metodo/ComicMicrobiotaModal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon,
} from "../../GlobalVariables";
import {
  NUTRIENTES_MICRO, type Nutriente,
} from "../../hardCoded/espacio/NutrientesNutricion";
import { useNutrientesQuimicos } from "../../hardCoded/espacio/useNutrientes";

// ═════════════════════════════════════════════════════════════════════════
// Página 3 de los nutrientes · QUÍMICOS: lo que no se come como alimento sino
// que se toma como sustancia (edulcorantes y drogas). Antes vivían al final de
// los micronutrientes; se sacaron a su propia página (2026-09-29). El reparto
// entre las tres páginas se decide en NutrientesNutricion.ts
// (MACRO_KEYS / MICRO_KEYS / QUIMICOS_KEYS).
export default function MetodoNutricionQuimicos() {
  // Los grupos de esta página en el idioma activo (el orden y las fotos, del
  // español). Los micro solo se usan para el candado de entrada.
  const QUIMICOS = useNutrientesQuimicos();
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [explorados, setExplorados] = useState<string[]>([]);
  const [microbiotaOpen, setMicrobiotaOpen] = useState(false); // cómic de transición a la microbiota
  const dataRef = useRef<Record<string, any>>({});

  // Solo se puede entrar cuando se han REVISADO todos los micronutrientes (si
  // no, se redirige a «Micronutrientes»).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await getUserMe();
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }
        let revisados: string[] = [];
        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const guardados = dataRef.current?.nutrientes_explorados;
          if (Array.isArray(guardados)) revisados = guardados;
        } catch { /* sin fila todavía → nada revisado */ }
        // Bloqueo secuencial: no se accede a los químicos hasta revisar TODOS
        // los micro (evita saltar por URL directa o por el índice).
        if (!NUTRIENTES_MICRO.every((x) => revisados.includes(x.key))) {
          navigate("/metodo/nutricion/micronutrientes", { replace: true });
          return;
        }
        setExplorados(revisados);

        // No mostramos la página hasta que TODAS las portadas de los grupos
        // estén descargadas, para que ninguna aparezca de golpe.
        await precargarImagenes(QUIMICOS.map((x) => x.img));
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  // El grupo se marca como REVISADO en su página de detalle (al ver sus
  // subtipos), no aquí. Al volver, la rejilla se remonta y lee lo revisado.
  const abrir = (n: Nutriente) => {
    navigate(`/metodo/nutricion/nutrientes/${n.key}`);
  };

  if (loading) return <NutricionLoading />;

  const exploradosSet = new Set(explorados);
  // No se puede avanzar a la Microbiota hasta haber abierto TODOS los
  // químicos de esta página.
  const todosQuimicosVistos = QUIMICOS.every((n) => exploradosSet.has(n.key));

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
            title={t("metodo.nutri.paso.quimicos")}
            compact
            maxW="1000px"
            bgColor={`${nutricionBg}dd`}
            color={nutricionTxt}
            nom={nutricionNom}
            mb={0}
            prev={{ label: `← ${t("metodo.nutri.paso.microCorto")}`, onClick: () => navigate("/metodo/nutricion/micronutrientes") }}
            extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
            next={{ label: `${t("metodo.nutri.paso.microbiota")} →`, onClick: () => setMicrobiotaOpen(true),
                    disabled: !todosQuimicosVistos,
                    disabledTooltip: t("metodo.nutri.quimicosBloqueo") }}
          />
          </Reveal>

          <SendaNutrientes pasos={QUIMICOS} hechos={exploradosSet} onAbrir={abrir} />
        </Flex>
      </Flex>

      {/* Transición a la Microbiota: cómic «La microbiota» (vivía en la página
          de micronutrientes; se mudó aquí al nacer esta, que es la última de
          los nutrientes). */}
      <ComicMicrobiotaModal
        isOpen={microbiotaOpen}
        onContinue={() => { setMicrobiotaOpen(false); navigate("/metodo/nutricion/microbiota"); }}
        onClose={() => setMicrobiotaOpen(false)}
      />

      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
