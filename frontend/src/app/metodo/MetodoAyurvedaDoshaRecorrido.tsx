import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
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

function Panel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <Box
      position="relative"
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${color}1a, 0 0 48px ${color}10`}
    >
      <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}26`} />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }}>
        {children}
      </Box>
    </Box>
  );
}

export default function MetodoAyurvedaDoshaRecorrido() {
  const navigate = useNavigate();
  const { dosha } = useParams<{ dosha: string }>();
  const doshaKey = (["vata", "pitta", "kapha"].includes(dosha || "") ? dosha : null) as DoshaKey | null;

  const [loading, setLoading] = useState(true);
  const dataRef = useRef<Record<string, any>>({});
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
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
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
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
  ].filter((e) => e.respuesta.trim().length > 0);

  const compromiso: string = d?.doshaCuidarte?.[doshaKey]?.compromiso || "";

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 6, md: 7 }}>

          <MetodoStepHeader
            icon={<Icon size={{ base: "40px", md: "56px" }} color={meta.color} />}
            title="Tu recorrido"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: "← Cursos", onClick: () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/cursos`) }}
            extra={ilustracionesBtn}
            next={{ label: "Inicio →", onClick: () => navigate("/home") }}
          />

          {/* ── HERO ── */}
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={4}>
              <Text color={TINTA} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" lineHeight="1.15" letterSpacing="0.02em" style={{ textShadow: INK_SHADOW }}>
                Este ha sido tu recorrido
              </Text>
              <Separador />
              <Text color={`${TINTA}d0`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" maxW="600px">
                A lo largo del camino te has ido escuchando. Estas son las palabras que te dejaste a ti mismo.
              </Text>
            </Flex>
          </Panel>

          {/* ── Tus respuestas ── */}
          {entradas.length > 0 ? (
            <Flex direction="column" w="100%" gap={{ base: 5, md: 6 }}>
              {entradas.map((e, i) => (
                <Panel key={i} color={meta.color}>
                  <Text color={`${TINTA}aa`} fontSize={{ base: "sm", md: "md" }} fontWeight="700" letterSpacing="0.04em" mb={3}>
                    {e.pregunta}
                  </Text>
                  <Flex align="stretch" gap={4}>
                    <Box flexShrink={0} w="4px" borderRadius="full" bg={meta.color} />
                    <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" lineHeight="1.8">
                      {e.respuesta}
                    </Text>
                  </Flex>
                </Panel>
              ))}
            </Flex>
          ) : (
            <Panel color={meta.color}>
              <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center" lineHeight="1.8">
                Aún no has dejado respuestas en el recorrido. Cuando vuelvas atrás y las escribas, aparecerán aquí.
              </Text>
            </Panel>
          )}

          {/* ── Tu compromiso ── */}
          {compromiso && (
            <Panel color={meta.color}>
              <Flex direction="column" align="center" textAlign="center" gap={3}>
                <Text color={`${TINTA}aa`} fontSize={{ base: "sm", md: "md" }} fontWeight="700" letterSpacing="0.16em" textTransform="uppercase">
                  Tu compromiso de esta semana
                </Text>
                <Text color={meta.color} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                  {compromiso}
                </Text>
              </Flex>
            </Panel>
          )}

          {/* ── Mensaje de cierre ── */}
          <Panel color={meta.color}>
            <Flex direction="column" gap={4}>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" lineHeight="1.4" style={{ textShadow: INK_SHADOW }}>
                Esto es lo que te has propuesto.
              </Text>
              <Separador />
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9">
                Gracias a la <Box as="span" fontWeight="700">Astrología</Box> ya sabes tus nudos y tus dones.
              </Text>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9">
                Gracias a la <Box as="span" fontWeight="700">Psicología</Box> sabes cómo enfrentarte a ellos.
              </Text>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9">
                Gracias a la <Box as="span" fontWeight="700">Ayurveda</Box> puedes empezar a encarnar tu verdad, dejar de hacerte daño y ser tu mejor versión.
              </Text>
            </Flex>
          </Panel>

          {/* ── Volver al inicio ── */}
          <Box
            as="button"
            onClick={() => navigate("/home")}
            mt={1}
            px={{ base: 10, md: 14 }} py={{ base: 3, md: 3.5 }} borderRadius="full"
            bg={meta.color} color="#fff"
            fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.06em"
            cursor="pointer"
            boxShadow={`0 0 26px ${meta.color}88`} transition="all 0.2s"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
            _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 34px ${meta.color}aa` }}
          >
            Volver al inicio
          </Box>
        </Flex>
      </Flex>

      {ilustracionesModal}
      <SiteFooter />
    </Box>
  );
}
