import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, Image, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { ComicMicrobiotaModal } from "../../components/metodo/ComicMicrobiotaModal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon,
} from "../../GlobalVariables";
import {
  NUTRIENTES, NUTRIENTES_SECUNDARIOS, type Nutriente,
} from "../../hardCoded/espacio/NutrientesNutricion";

// Tarjeta de un grupo de nutrientes. Mismo aspecto que las de Fisiología ·
// Profundiza (fondo de la disciplina difuminado + imagen dentro + título), pero
// con el fondo de Nutrición. Al ver el grupo (abrir su modal), aparece un tick
// verde de la gama de Nutrición arriba a la derecha.
function NutrienteBox({ n, visto, onClick, delay }: { n: Nutriente; visto: boolean; onClick: () => void; delay: number }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <Reveal direction="up" distance={20} delay={delay} duration={0.55} w="100%" display="flex">
      <Box
        as="button"
        onClick={onClick}
        position="relative"
        overflow="hidden"
        w="100%"
        h="100%"
        borderRadius="2xl"
        cursor="pointer"
        fontFamily="'EB Garamond', serif"
        transition="all 0.2s ease"
        boxShadow="0 4px 16px rgba(0,0,0,0.22), 0 0 14px rgba(255,255,255,0.12)"
        _hover={{ transform: "translateY(-4px)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.32), 0 0 22px rgba(255,255,255,0.35)" }}
        _active={{ transform: "translateY(-1px)" }}
      >
        <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}55`} />

        {/* Tick de "grupo visto": verde de la gama de Nutrición (círculo nutricionTxt
            + check nutricionBg). Aparece al abrir el detalle del grupo. */}
        {visto && (
          <Flex position="absolute" top="9px" right="9px" zIndex={2} align="center" justify="center"
                w="24px" h="24px" borderRadius="full" bg={nutricionTxt}
                boxShadow={`0 0 10px ${nutricionTxt}, 0 1px 4px rgba(0,0,0,0.5)`}>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="14px" h="14px" fill={nutricionBg}>
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
            </Box>
          </Flex>
        )}

        <Flex position="relative" zIndex={1} direction="column" align="center" gap={{ base: 2.5, md: 3 }}
              p={{ base: 4, md: 5 }} h="100%">
          <Box w="100%" aspectRatio={1} borderRadius="xl" overflow="hidden" flexShrink={0}
               bg={`${n.color}22`}
               boxShadow="0 0 12px rgba(255,255,255,0.12)"
               display="flex" alignItems="center" justifyContent="center">
            {!imgErr ? (
              <Image src={encodeURI(n.img)} alt={n.label} w="100%" h="100%" objectFit="cover"
                     onError={() => setImgErr(true)} />
            ) : (
              <Text color={nutricionTxt} fontWeight="800" fontSize={{ base: "3xl", md: "4xl" }}
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                {n.label.charAt(0)}
              </Text>
            )}
          </Box>
          <Text color={nutricionTxt} fontWeight="700" lineHeight="1.2" textAlign="center"
                fontSize={{ base: "sm", md: "md" }} letterSpacing="0.02em">
            {n.label}
          </Text>
        </Flex>
      </Box>
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
  // etanol, agua, fitoquímicos). El flag «hecho» se calcula sobre el TOTAL de
  // ambas páginas, así que solo se marca completo cuando se han visto todos.
  const total = NUTRIENTES.length;

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
        try {
          const r = await axios.get(`${API_URL}/metodo-nutricion/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const guardados = dataRef.current?.nutrientes_explorados;
          if (Array.isArray(guardados)) setExplorados(guardados);
        } catch { /* sin fila todavía */ }

        // No mostramos la página hasta que TODAS las portadas de los grupos
        // estén descargadas, para que ninguna aparezca de golpe.
        await precargarImagenes(NUTRIENTES_SECUNDARIOS.map((x) => x.img));
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  const guardar = async (nuevos: string[]) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    const data = {
      ...dataRef.current,
      nutrientes_explorados: nuevos,
      nutrientes_hecho: nuevos.length >= total,
    };
    dataRef.current = data;
    try {
      await axios.patch(`${API_URL}/metodo-nutricion/${userId}`, { data },
        { headers: { Authorization: `Bearer ${token}` } });
    } catch { /* se reintenta al próximo toque */ }
  };

  // Al pinchar un grupo: persiste que se ha explorado y navega a su página.
  // NO actualizamos el estado visible aquí: el tick no debe aparecer mientras se
  // pulsa, sino solo cuando el usuario vuelve a la rejilla (que se remonta y
  // vuelve a leer del backend lo explorado).
  const abrir = (n: Nutriente) => {
    if (!explorados.includes(n.key)) {
      void guardar([...explorados, n.key]);
    }
    navigate(`/metodo/nutricion/nutrientes/${n.key}`);
  };

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  const exploradosSet = new Set(explorados);

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
            next={{ label: "Microbiota →", onClick: () => setMicroOpen(true) }}
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

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
