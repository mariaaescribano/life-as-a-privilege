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
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon,
} from "../../GlobalVariables";
import {
  type Nutriente,
} from "../../hardCoded/espacio/NutrientesNutricion";
import { useNutrientesMacro } from "../../hardCoded/espacio/useNutrientes";

// ═════════════════════════════════════════════════════════════════════════
// Página 1 de los nutrientes · MACRONUTRIENTES: lo que se come a cucharadas
// (carbohidratos, fibra, grasas, colesterol, proteínas, agua, etanol). El
// reparto entre esta página y la de micronutrientes se decide en
// NutrientesNutricion.ts (MACRO_KEYS / MICRO_KEYS).
export default function MetodoNutricionMacronutrientes() {
  // Los grupos de esta página en el idioma activo (el orden y las fotos, del español).
  const MACRO = useNutrientesMacro();
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [explorados, setExplorados] = useState<string[]>([]);
  const dataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const guardados = dataRef.current?.nutrientes_explorados;
          if (Array.isArray(guardados)) setExplorados(guardados);
        } catch { /* sin fila todavía */ }

        // No mostramos la página hasta que TODAS las portadas de los grupos
        // estén descargadas, para que ninguna aparezca de golpe.
        await precargarImagenes(MACRO.map((x) => x.img));
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // El nutriente se marca como REVISADO en su página de detalle (cuando el
  // usuario ve sus subtipos), no aquí. Al volver, la rejilla se remonta y lee del
  // backend lo revisado → aparece el tick y se desbloquean los micronutrientes.
  const abrir = (n: Nutriente) => {
    navigate(`/metodo/nutricion/nutrientes/${n.key}`);
  };

  if (loading) return <NutricionLoading />;

  const exploradosSet = new Set(explorados);
  // Los micronutrientes se desbloquean solo cuando TODOS los macro tienen su
  // tick (el usuario ha visto los subtipos de cada uno).
  const faltanMacro = !MACRO.every((x) => exploradosSet.has(x.key));

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
            title={t("metodo.nutri.paso.macro")}
            compact
            maxW="1000px"
            bgColor={`${nutricionBg}dd`}
            color={nutricionTxt}
            nom={nutricionNom}
            mb={0}
            prev={{ label: `← ${t("metodo.nutri.paso.nutricion")}`, onClick: () => navigate("/metodo/nutricion") }}
            extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
            next={{
              label: `${t("metodo.nutri.paso.microCorto")} →`,
              onClick: () => navigate("/metodo/nutricion/micronutrientes"),
              disabled: faltanMacro,
              disabledTooltip: t("metodo.nutri.macroBloqueo"),
            }}
          />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px">
              {t("metodo.nutri.macroIntro")}
            </Text>
          </Reveal>

          <SendaNutrientes pasos={MACRO} hechos={exploradosSet} onAbrir={abrir} />
        </Flex>
      </Flex>

      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
