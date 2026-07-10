import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Download } from "lucide-react";
import axios from "axios";
import { generateDiaPdf } from "../../utils/generateDiaPdf";
import { generateRecorridoPdf } from "../../utils/generateRecorridoPdf";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
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

  const descargarDia = () => { void generateDiaPdf(doshaKey, meta.label, diaBloquesPdf); };

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

  const irCursos = () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/cursos`);

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
            next={{ label: "Cursos →", onClick: irCursos }}
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

          {/* ── Tus respuestas ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          {entradas.length > 0 ? (
            <Flex direction="column" w="100%" gap={{ base: 5, md: 6 }}>
              {entradas.map((e, i) => (
                <Panel key={i} color={meta.color}>
                  <Text color={`${TINTA}aa`} fontSize={{ base: "sm", md: "md" }} fontWeight="700" letterSpacing="0.04em" mb={3}>
                    {e.pregunta}
                  </Text>
                  <Box h="1px" w="100%" mb={4} bgGradient={`linear(to-r, ${ayurvedaTxt}55, transparent)`} />
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
                Aún no has dejado respuestas en el mapa. Cuando vuelvas atrás y las escribas, aparecerán aquí.
              </Text>
            </Panel>
          )}
          </Reveal>

          {/* ── Tu compromiso ── */}
          {compromiso && (
            <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
            <Panel color={meta.color}>
              <Flex direction="column" align="center" textAlign="center" gap={3}>
                <Text color={`${TINTA}aa`} fontSize={{ base: "sm", md: "md" }} fontWeight="700" letterSpacing="0.16em" textTransform="uppercase">
                  Tu compromiso de esta semana
                </Text>
                <Separador />
                <Text color={meta.color} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1.3" style={{ textShadow: INK_SHADOW }}>
                  {compromiso}
                </Text>
              </Flex>
            </Panel>
            </Reveal>
          )}

          {/* ── Tu día ideal ── */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" textAlign="center" lineHeight="1.3" mb={2} style={{ textShadow: INK_SHADOW }}>
              Este es el día ideal que te has propuesto
            </Text>
            <Box h="1px" w="60%" mx="auto" mb={6} bgGradient={`linear(to-r, transparent, ${ayurvedaTxt}66, transparent)`} />
            {diaBloques.length > 0 ? (
              <>
                <Flex direction="column" gap={3.5}>
                  {diaBloques.map((b, i) => (
                    <Flex key={i} align="flex-start" gap={4}
                          borderRadius="xl"
                          bg="rgba(255,251,243,0.42)"
                          border={`1px solid ${b.comida ? meta.color + "55" : TINTA + "26"}`}
                          sx={{ backdropFilter: "blur(4px)" }}
                          px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}>
                      <Text color={meta.color} fontWeight="700" fontSize={{ base: "sm", md: "md" }} minW={{ base: "48px", md: "58px" }} flexShrink={0} mt="2px">
                        {b.hora || "—"}
                      </Text>
                      <Box>
                        <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight={b.comida ? "700" : "500"} lineHeight="1.5">
                          {b.actividad || (b.comida ? "Comida" : "Momento")}
                        </Text>
                        {b.comida && Array.isArray(b.alimentos) && b.alimentos.length > 0 && (
                          <Text color={`${TINTA}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" lineHeight="1.6" mt={0.5}>
                            {b.alimentos.join(" · ")}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  ))}
                </Flex>
                <Flex justify="center" mt={7}>
                  <Flex as="button" onClick={descargarDia} align="center" gap={2} px={5} py={2.5} borderRadius="full"
                        bg="rgba(255,251,243,0.6)" color={meta.color} border={`1.5px solid ${meta.color}88`}
                        fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                        cursor="pointer" transition="all 0.15s"
                        _hover={{ bg: `${meta.color}1a`, borderColor: meta.color, transform: "translateY(-1px)" }}>
                    <Download size={16} /> Descargar este día
                  </Flex>
                </Flex>
              </>
            ) : (
              <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center" lineHeight="1.8">
                Aún no has creado tu día ideal. Vuelve a «Crea tu día» para diseñarlo.
              </Text>
            )}
          </Panel>
          </Reveal>

          {/* ── Cierre · A por todas ── */}
          {/* <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={4}>
              <Text color={`${TINTA}d0`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.8" maxW="560px">
                Enhorabuena por llegar hasta aquí. 
              </Text>
              <Text color={meta.color} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" lineHeight="1.1" style={{ textShadow: INK_SHADOW }}>
                ¡A por todas!
              </Text>
              <Box
                as="button"
                onClick={irCursos}
                mt={2}
                px={{ base: 10, md: 14 }} py={{ base: 3, md: 3.5 }} borderRadius="full"
                bg={meta.color} color="#fff"
                fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.06em"
                cursor="pointer"
                boxShadow={`0 0 26px ${meta.color}88`} transition="all 0.2s"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 34px ${meta.color}aa` }}
              >
                Cursos →
              </Box>
            </Flex>
          </Panel> */}
        </Flex>
      </Flex>

      {ilustracionesModal}
      <IndiceAyurveda />
      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />
      <SiteFooter />
    </Box>
  );
}
