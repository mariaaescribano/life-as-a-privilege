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
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import { ComicMicrobiotaModal } from "../../components/metodo/ComicMicrobiotaModal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon,
} from "../../GlobalVariables";
import {
  NUTRIENTES_PRINCIPALES, type Nutriente,
} from "../../hardCoded/espacio/NutrientesNutricion";
import { useNutrientesSecundarios } from "../../hardCoded/espacio/useNutrientes";

// Tarjeta de un grupo de nutrientes. Mismo aspecto que las de Fisiología ·
// Profundiza (fondo de la disciplina difuminado + imagen dentro + título), pero
// con el fondo de Nutrición. Al ver el grupo (abrir su modal), aparece un tick
// verde de la gama de Nutrición arriba a la derecha.
function NutrienteBox({ n, visto, onClick }: { n: Nutriente; visto: boolean; onClick: () => void }) {
  return (
    // La cascada la marca el RevealStagger de la rejilla, que arranca cuando la
    // rejilla ASOMA en pantalla (ver MetodoNutricionNutrientes).
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
      />
    </RevealItem>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionNutrientesSecundarios() {
  // Los seis grupos secundarios en el idioma activo (el orden y las fotos, del
  // español). Los principales solo se usan para el candado, así que se leen
  // directamente del fichero: de ellos no se pinta ni una palabra.
  const NUTRIENTES_SECUNDARIOS = useNutrientesSecundarios();
  const t = useT();
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

  if (loading) return <NutricionLoading />;

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
            title={t("metodo.nutri.paso.secundarios")}
            compact
            maxW="1000px"
            bgColor={`${nutricionBg}dd`}
            color={nutricionTxt}
            nom={nutricionNom}
            mb={0}
            prev={{ label: `← ${t("metodo.nutri.paso.nutrientes")}`, onClick: () => navigate("/metodo/nutricion/nutrientes") }}
            extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
            next={{ label: `${t("metodo.nutri.paso.microbiota")} →`, onClick: () => setMicroOpen(true),
                    disabled: !todosSecVistos,
                    disabledTooltip: "Descubre todos los nutrientes secundarios primero" }}
          />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px">
              {t("metodo.nutri.tocaGrupo")}
            </Text>
          </Reveal>

          <RevealStagger inView stagger={0.07} amount={0.12} w="100%"
                         display="grid" gap={{ base: 4, md: 6 }}
                         gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}>
            {NUTRIENTES_SECUNDARIOS.map((n) => (
              <NutrienteBox key={n.key} n={n} visto={exploradosSet.has(n.key)}
                            onClick={() => abrir(n)} />
            ))}
          </RevealStagger>
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
