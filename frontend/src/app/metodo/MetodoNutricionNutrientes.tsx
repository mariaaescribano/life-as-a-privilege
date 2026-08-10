import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../i18n";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { FotoBox } from "../../components/metodo/FotoBox";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal, RevealStagger, RevealItem, Float } from "../../components/global/Reveal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon,
} from "../../GlobalVariables";
import {
  NUTRIENTES_PRINCIPALES, type Nutriente,
} from "../../hardCoded/espacio/NutrientesNutricion";

// Tarjeta de un grupo de nutrientes. Mismo aspecto que las de Fisiología ·
// Profundiza (fondo de la disciplina difuminado + imagen dentro + título), pero
// con el fondo de Nutrición. Al ver el grupo (abrir su modal), aparece un tick
// verde de la gama de Nutrición arriba a la derecha.
function NutrienteBox({ n, visto, onClick }: { n: Nutriente; visto: boolean; onClick: () => void }) {
  return (
    // RevealItem (y no un Reveal con delay a mano): la cascada la marca el
    // RevealStagger de la rejilla, que arranca cuando la rejilla ASOMA en
    // pantalla. Con delays sueltos al montar, las filas de abajo terminaban su
    // animación antes de que nadie las viera.
    <RevealItem direction="up" distance={22} scaleFrom={0.96} duration={0.55} w="100%" display="flex">
      <FotoBox
        titulo={n.label}
        foto={n.img}
        nom={nutricionNom}
        tinta={nutricionTxt}
        bg={nutricionBg}
        visto={visto}
        colorTint={`${n.color}22`}
        onClick={onClick}
        vivo
        // Mismo glow que la cabecera (halo blanco + menta con el tinte de la disciplina).
        glow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${nutricionTxt}1a, 0 0 48px ${nutricionTxt}10`}
      />
    </RevealItem>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionNutrientes() {
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
        await precargarImagenes(NUTRIENTES_PRINCIPALES.map((x) => x.img));
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // El nutriente se marca como REVISADO en su página de detalle (cuando el
  // usuario ve sus subtipos), no aquí. Al volver, la rejilla se remonta y lee del
  // backend lo revisado → aparece el tick y se desbloquea «Secundarios».
  const abrir = (n: Nutriente) => {
    navigate(`/metodo/nutricion/nutrientes/${n.key}`);
  };

  if (loading) return <NutricionLoading />;

  const exploradosSet = new Set(explorados);
  // «Secundarios» se desbloquea solo cuando TODOS los nutrientes principales
  // tienen su tick (el usuario ha visto los subtipos de cada uno).
  const faltanPrincipales = !NUTRIENTES_PRINCIPALES.every((x) => exploradosSet.has(x.key));

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<Float amplitude={5} duration={5}><NutricionIcon size={{ base: "40px", md: "56px" }} /></Float>}
            title="Los nutrientes"
            compact
            maxW="1000px"
            bgColor={`${nutricionBg}dd`}
            color={nutricionTxt}
            nom={nutricionNom}
            mb={0}
            prev={{ label: `← ${t("metodo.nutri.paso.nutricion")}`, onClick: () => navigate("/metodo/nutricion") }}
            extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
            next={{
              label: `${t("metodo.nutri.paso.secundariosCorto")} →`,
              onClick: () => navigate("/metodo/nutricion/nutrientes-secundarios"),
              disabled: faltanPrincipales,
              disabledTooltip: "Revisa todos los nutrientes para desbloquear",
            }}
          />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px">
              Toca cada grupo para descubrir sus tipos, qué hacen dentro de ti y dónde encontrarlo.
            </Text>
          </Reveal>

          <RevealStagger inView stagger={0.07} amount={0.12} w="100%"
                         display="grid" gap={{ base: 4, md: 6 }}
                         gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}>
            {NUTRIENTES_PRINCIPALES.map((n) => (
              <NutrienteBox key={n.key} n={n} visto={exploradosSet.has(n.key)}
                            onClick={() => abrir(n)} />
            ))}
          </RevealStagger>
        </Flex>
      </Flex>

      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
