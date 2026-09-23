import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../i18n";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
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
  NUTRIENTES_MACRO, type Nutriente,
} from "../../hardCoded/espacio/NutrientesNutricion";
import { useNutrientesMicro } from "../../hardCoded/espacio/useNutrientes";

// ═════════════════════════════════════════════════════════════════════════
// Página 2 de los nutrientes · MICRONUTRIENTES: lo que se come a pellizcos
// (vitaminas, minerales, fitoquímicos, edulcorantes, drogas). El reparto entre
// esta página y la de macronutrientes se decide en NutrientesNutricion.ts
// (MACRO_KEYS / MICRO_KEYS).
export default function MetodoNutricionMicronutrientes() {
  // Los grupos de esta página en el idioma activo (el orden y las fotos, del
  // español). Los macro solo se usan para el candado, así que se leen
  // directamente del fichero: de ellos no se pinta ni una palabra.
  const MICRO = useNutrientesMicro();
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [explorados, setExplorados] = useState<string[]>([]);
  const [microbiotaOpen, setMicrobiotaOpen] = useState(false); // cómic de transición a la microbiota
  const dataRef = useRef<Record<string, any>>({});

  // Solo se puede entrar cuando se han REVISADO todos los macronutrientes (si
  // no, se redirige a «Macronutrientes»).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }
        let revisados: string[] = [];
        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const guardados = dataRef.current?.nutrientes_explorados;
          if (Array.isArray(guardados)) revisados = guardados;
        } catch { /* sin fila todavía → nada revisado */ }
        // Bloqueo secuencial: no se accede a los micronutrientes hasta revisar
        // TODOS los macro (evita saltar por URL directa o por el índice).
        if (!NUTRIENTES_MACRO.every((x) => revisados.includes(x.key))) {
          navigate("/metodo/nutricion/macronutrientes", { replace: true });
          return;
        }
        setExplorados(revisados);

        // No mostramos la página hasta que TODAS las portadas de los grupos
        // estén descargadas, para que ninguna aparezca de golpe.
        await precargarImagenes(MICRO.map((x) => x.img));
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // El nutriente se marca como REVISADO en su página de detalle (al ver sus
  // subtipos), no aquí. Al volver, la rejilla se remonta y lee lo revisado.
  const abrir = (n: Nutriente) => {
    navigate(`/metodo/nutricion/nutrientes/${n.key}`);
  };

  if (loading) return <NutricionLoading />;

  const exploradosSet = new Set(explorados);
  // No se puede avanzar a la Microbiota hasta haber abierto TODOS los
  // micronutrientes de esta página.
  const todosMicroVistos = MICRO.every((n) => exploradosSet.has(n.key));

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
            title={t("metodo.nutri.paso.micro")}
            compact
            maxW="1000px"
            bgColor={`${nutricionBg}dd`}
            color={nutricionTxt}
            nom={nutricionNom}
            mb={0}
            prev={{ label: `← ${t("metodo.nutri.paso.macroCorto")}`, onClick: () => navigate("/metodo/nutricion/macronutrientes") }}
            extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
            next={{ label: `${t("metodo.nutri.paso.microbiota")} →`, onClick: () => setMicrobiotaOpen(true),
                    disabled: !todosMicroVistos,
                    disabledTooltip: t("metodo.nutri.microBloqueo") }}
          />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px">
              {t("metodo.nutri.microIntro")}
            </Text>
          </Reveal>

          <SendaNutrientes pasos={MICRO} hechos={exploradosSet} onAbrir={abrir} />
        </Flex>
      </Flex>

      {/* Transición a la Microbiota: cómic «La microbiota». */}
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
