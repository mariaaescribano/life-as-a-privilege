import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Download } from "lucide-react";
import axios from "axios";
import { generateRecorridoPdf } from "../../utils/generateRecorridoPdf";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyurvedaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { AyurvedaPanel as Panel } from "../../components/metodo/AyurvedaPanel";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceAyurveda } from "../../components/metodo/IndiceAyurveda";
import { Reveal } from "../../components/global/Reveal";
import {
  API_URL,
  ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  VataIcon, PittaIcon, KaphaIcon,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";
import { DOSHA_INTRO, type DoshaKey } from "../../hardCoded/metodo/doshaIntro";
import { DOSHA_DESCUBRE } from "../../hardCoded/metodo/doshaDescubre";
import { DOSHA_CUERPO } from "../../hardCoded/metodo/doshaCuerpo";
import { DOSHA_DESEQUILIBRIO } from "../../hardCoded/metodo/doshaDesequilibrio";
import { DOSHA_CUIDARTE } from "../../hardCoded/metodo/doshaCuidarte";

const TINTA = ayurvedaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${ayurvedaBg}`;

const DOSHA_META: Record<DoshaKey, { label: string; color: string; Icon: any }> = {
  vata:  { label: "Vata",  color: vataColor,  Icon: VataIcon },
  pitta: { label: "Pitta", color: pittaColor, Icon: PittaIcon },
  kapha: { label: "Kapha", color: kaphaColor, Icon: KaphaIcon },
};

function Separador() {
  return (
    <Flex align="center" justify="center" gap={3} w="100%" my={1}>
      <Box h="1px" flex="1" maxW="160px" bgGradient={`linear(to-r, transparent, ${ayurvedaTxt}66)`} />
      <Box w="7px" h="7px" bg={`${ayurvedaTxt}99`} transform="rotate(45deg)" flexShrink={0} />
      <Box h="1px" flex="1" maxW="160px" bgGradient={`linear(to-l, transparent, ${ayurvedaTxt}66)`} />
    </Flex>
  );
}

// El panel común (ahora animado y «vivo») vive en components/metodo/AyurvedaPanel.tsx
// y se importa arriba como `Panel`.

export default function MetodoAyurvedaDoshaRecorrido() {
  const navigate = useNavigate();
  const { dosha } = useParams<{ dosha: string }>();
  const doshaKey = (["vata", "pitta", "kapha"].includes(dosha || "") ? dosha : null) as DoshaKey | null;

  const [loading, setLoading] = useState(true);
  const dataRef = useRef<Record<string, any>>({});
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!doshaKey) { navigate("/metodo/ayurveda/tarjetas", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }
        const r = await axios.get(`${API_URL}/metodo-ayurveda/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        dataRef.current = r.data?.data || {};
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doshaKey]);

  if (loading || !doshaKey) {
    return <AyurvedaLoading />;
  }

  const meta = DOSHA_META[doshaKey];
  const Icon = meta.Icon;
  const d = dataRef.current;

  // Reúne las respuestas que el usuario fue dejando a lo largo del recorrido.
  const entradas: { pregunta: string; respuesta: string }[] = [
    { pregunta: DOSHA_INTRO[doshaKey]?.preguntaFinal.pregunta || "", respuesta: d?.doshaIntro?.[doshaKey]?.cambio || "" },
    { pregunta: DOSHA_DESCUBRE[doshaKey]?.reflexion.pregunta || "", respuesta: d?.doshaDescubre?.[doshaKey]?.reflexion || "" },
    { pregunta: DOSHA_CUERPO[doshaKey]?.reflexion.pregunta || "", respuesta: d?.doshaCuerpo?.[doshaKey]?.reflexion || "" },
    { pregunta: DOSHA_DESEQUILIBRIO[doshaKey]?.reflexion.pregunta || "", respuesta: d?.doshaDesequilibrio?.[doshaKey]?.reflexion || "" },
    { pregunta: DOSHA_CUIDARTE[doshaKey]?.reflexion.pregunta || "", respuesta: d?.doshaCuidarte?.[doshaKey]?.reflexion || "" },
  ].filter((e) => typeof e.respuesta === "string" && e.respuesta.trim().length > 0);

  const compromiso: string = d?.doshaCuidarte?.[doshaKey]?.compromiso || "";

  // Día ideal que el usuario construyó en «Crea tu día».
  const diaBloquesRaw: any[] = Array.isArray(d?.doshaDia?.[doshaKey]?.bloques) ? d.doshaDia[doshaKey].bloques : [];
  const diaBloques = [...diaBloquesRaw]
    .filter((b) => (b?.actividad && b.actividad.trim()) || (Array.isArray(b?.alimentos) && b.alimentos.length > 0) || b?.hora)
    .sort((a, b) => (a.hora || "99").localeCompare(b.hora || "99"));

  // Día ideal normalizado para el PDF (garantiza que `alimentos` es un array).
  const diaBloquesPdf = diaBloques.map((b) => ({
    hora: b?.hora || "",
    actividad: b?.actividad || "",
    comida: !!b?.comida,
    alimentos: Array.isArray(b?.alimentos) ? b.alimentos : [],
  }));

  // La página es SOLO la despedida del submapa del dosha: un box con la descarga.
  // Las respuestas del recorrido, el compromiso de la semana y el día ideal ya no
  // se pintan aquí en boxes sueltos (quedaba una página larguísima); se siguen
  // recogiendo porque van DENTRO del PDF del mapa.
  const descargarRecorrido = () => {
    const des = DOSHA_DESEQUILIBRIO[doshaKey];
    void generateRecorridoPdf(doshaKey, meta.label, {
      entradas,
      compromiso,
      diaBloques: diaBloquesPdf,
      desequilibra: { titulo: des?.aumenta.titulo || "", items: des?.aumenta.opciones || [] },
      senales: { titulo: des?.senales.titulo || "", items: des?.senales.items || [] },
      equilibra: { titulo: des?.equilibrio.titulo || "", items: des?.equilibrio.items || [] },
    });
  };

  // Fin del submapa del dosha: se vuelve a las tarjetas de los tres Doṣhas, que
  // son el hub desde el que se entra a cada uno (y desde el que se sigue a
  // Prāṇāyāma). Prāṇāyāma y Cursos ya NO cuelgan de este recorrido.
  const irDoshas = () => navigate("/metodo/ayurveda/tarjetas");

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 6, md: 7 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<Icon size={{ base: "40px", md: "56px" }} color={meta.color} />}
            title="Tu mapa"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: "← Tu día", onClick: () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/dia`) }}
            extra={ilustracionesBtn}
            next={{ label: "Doṣhas →", onClick: irDoshas }}
          />
          </Reveal>

          {/* ── HERO (primer box: entra al montar, siempre visible) ── */}
          <Reveal direction="up" distance={26} scaleFrom={0.98} delay={0.12} duration={0.7} w="100%">
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={4}>
              <Text color={TINTA} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" lineHeight="1.15" letterSpacing="0.02em" style={{ textShadow: INK_SHADOW }}>
                Este ha sido tu mapa
              </Text>
              <Separador />
              <Text color={`${TINTA}d0`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" maxW="600px">
                A lo largo del camino te has ido escuchando. Estas son las palabras que te dejaste a ti mismo.
              </Text>
              <Flex
                as="button" onClick={descargarRecorrido} mt={2}
                align="center" gap={2.5}
                px={{ base: 8, md: 11 }} py={{ base: 3, md: 3.5 }} borderRadius="full"
                bg={meta.color} color="#fff"
                fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em"
                cursor="pointer" boxShadow={`0 0 22px ${meta.color}77`} transition="all 0.2s"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 32px ${meta.color}aa` }}
              >
                <Download size={18} /> Descargar mi mapa
              </Flex>
              <Text color={`${TINTA}aa`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic">
                Incluye tus respuestas, tu día ideal y, de regalo, qué equilibra y desequilibra tu {meta.label}.
              </Text>
            </Flex>
          </Panel>
          </Reveal>

        </Flex>
      </Flex>

      {ilustracionesModal}
      <IndiceAyurveda />
      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />
      <SiteFooter />
    </Box>
  );
}
