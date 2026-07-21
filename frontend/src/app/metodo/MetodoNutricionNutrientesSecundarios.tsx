import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { FotoBox } from "../../components/metodo/FotoBox";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal } from "../../components/global/Reveal";
import { ComicMicrobiotaModal } from "../../components/metodo/ComicMicrobiotaModal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon,
} from "../../GlobalVariables";
import {
  NUTRIENTES_PRINCIPALES, NUTRIENTES_SECUNDARIOS, type Nutriente,
} from "../../hardCoded/espacio/NutrientesNutricion";

// Tarjeta de un grupo de nutrientes. Mismo aspecto que las de Fisiología ·
// Profundiza (fondo de la disciplina difuminado + imagen dentro + título), pero
// con el fondo de Nutrición. Al ver el grupo (abrir su modal), aparece un tick
// verde de la gama de Nutrición arriba a la derecha.
function NutrienteBox({ n, visto, onClick, delay }: { n: Nutriente; visto: boolean; onClick: () => void; delay: number }) {
  return (
    <Reveal direction="up" distance={20} delay={delay} duration={0.55} w="100%" display="flex">
      <FotoBox
        titulo={n.label}
        foto={n.img}
        nom={nutricionNom}
        tinta={nutricionTxt}
        bg={nutricionBg}
        visto={visto}
        colorTint={`${n.color}22`}
        onClick={onClick}
      />
    </Reveal>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionNutrientesSecundarios() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [explorados, setExplorados] = useState<string[]>([]);
  const [microOpen, setMicroOpen] = useState(false); // cómic de transición a la microbiota
  const dataRef = useRef<Record<string, any>>({});

  // Segunda página del recorrido de nutrientes: los secundarios (colesterol,
  // etanol, agua, fitoquímicos). Solo se puede entrar cuando se han REVISADO
  // todos los principales (si no, se redirige a «Los nutrientes»).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try { const t = await axios.get(`${API_URL}/payment/test/enabled`); testEnabled = !!t.data?.enabled; } catch { /* */ }
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito && !testEnabled) { navigate("/metodo/nutricion"); return; }
        let revisados: string[] = [];
        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const guardados = dataRef.current?.nutrientes_explorados;
          if (Array.isArray(guardados)) revisados = guardados;
        } catch { /* sin fila todavía → nada revisado */ }
        // Bloqueo secuencial: no se accede a Secundarios hasta revisar TODOS los
        // principales (evita saltar por URL directa o por el índice).
        if (!NUTRIENTES_PRINCIPALES.every((x) => revisados.includes(x.key))) {
          navigate("/metodo/nutricion/nutrientes", { replace: true });
          return;
        }
        setExplorados(revisados);

        // No mostramos la página hasta que TODAS las portadas de los grupos
        // estén descargadas, para que ninguna aparezca de golpe.
        await precargarImagenes(NUTRIENTES_SECUNDARIOS.map((x) => x.img));
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // El nutriente se marca como REVISADO en su página de detalle (al ver sus
  // subtipos), no aquí. Al volver, la rejilla se remonta y lee lo revisado.
  const abrir = (n: Nutriente) => {
    navigate(`/metodo/nutricion/nutrientes/${n.key}`);
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  const exploradosSet = new Set(explorados);
  // No se puede avanzar a la Microbiota hasta haber abierto TODOS los nutrientes
  // secundarios de esta página.
  const todosSecVistos = NUTRIENTES_SECUNDARIOS.every((n) => exploradosSet.has(n.key));

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
            title="Nutrientes secundarios"
            compact
            maxW="1000px"
            bgColor={`${nutricionBg}dd`}
            color={nutricionTxt}
            nom={nutricionNom}
            mb={0}
            prev={{ label: "← Los nutrientes", onClick: () => navigate("/metodo/nutricion/nutrientes") }}
            extra={{ label: "Biblioteca", onClick: () => navigate("/metodo/nutricion/alimentos") }}
            next={{ label: "Microbiota →", onClick: () => setMicroOpen(true),
                    disabled: !todosSecVistos,
                    disabledTooltip: "Descubre todos los nutrientes secundarios primero" }}
          />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Toca cada grupo para descubrir sus tipos, qué hacen dentro de ti y dónde encontrarlo.
            </Text>
          </Reveal>

          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
            {NUTRIENTES_SECUNDARIOS.map((n, i) => (
              <NutrienteBox key={n.key} n={n} visto={exploradosSet.has(n.key)}
                            delay={0.05 * i} onClick={() => abrir(n)} />
            ))}
          </SimpleGrid>
        </Flex>
      </Flex>

      {/* Transición a la Microbiota: cómic «La microbiota». */}
      <ComicMicrobiotaModal
        isOpen={microOpen}
        onContinue={() => { setMicroOpen(false); navigate("/metodo/nutricion/microbiota"); }}
        onClose={() => setMicroOpen(false)}
      />

      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
