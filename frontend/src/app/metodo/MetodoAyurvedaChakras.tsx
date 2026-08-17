import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyurvedaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { ChakraBox } from "../../components/metodo/ChakraBox";
import { ChakraComicModal } from "../../components/metodo/ChakraComicModal";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceAyurveda } from "../../components/metodo/IndiceAyurveda";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { COMIC_CHAKRAS } from "../../components/metodo/comicChakras";
import { glowHeader } from "../../components/metodo/FotoBox";
import { useComic } from "../../i18n/comics";
import { useT } from "../../i18n";
import {
  API_URL,
  AyurvedaIcon, ayurvedaBg, ayurvedaNom, ayurvedaTxt,
} from "../../GlobalVariables";
import {
  doshaDeUrl, leerChakrasLeidos, marcarChakraLeido,
} from "../../hardCoded/metodo/chakrasProgreso";
import { chakraFoto, CHAKRAS_PERSONA, type Chakra } from "../../hardCoded/metodo/chakras";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useChakras } from "../../hardCoded/metodo/useDoshaContenido";

// ─────────────────────────────────────────────────────────────────────────
// EL MAPA DE LOS CHAKRAS · penúltima parada del recorrido de Ayurveda, justo
// antes de los Cursos.
//
// La persona a la izquierda con sus siete puntos, y a la derecha las siete
// cajas colocadas como están en el cuerpo: la corona ARRIBA DEL TODO, ancha, y
// debajo tres filas de dos, bajando hasta la raíz. En móvil la persona se pone
// encima y las cajas debajo, con el mismo orden.
//
// Pulsar una caja NO navega: abre el cómic de ese chakra a pantalla completa
// (ChakraComicModal). Al terminarlo, la caja se queda con su marquita.
//
// No depende del doṣha (los chakras son los mismos para los tres): la ruta
// cuelga de `/dosha/:dosha/` solo para que el Índice pueda enlazarla, igual que
// Prāṇāyāma y Cursos.
// ─────────────────────────────────────────────────────────────────────────

export default function MetodoAyurvedaChakras() {
  const t = useT();
  const navigate = useNavigate();
  const { dosha } = useParams<{ dosha: string }>();
  const doshaKey = doshaDeUrl(dosha);
  const { lista: CHAKRAS_LISTA, intro } = useChakras();

  const [loading, setLoading] = useState(true);
  const [leidos, setLeidos] = useState<Set<string>>(new Set());
  const [abierto, setAbierto] = useState<Chakra | null>(null);
  // El cómic de entrada sale al entrar, ANTES del mapa. No persiste: se cierra
  // con la X o con «Los chakras →» y volverá a salir la próxima vez.
  const [comicOpen, setComicOpen] = useState(true);
  const comicVinetas = useComic("ayurveda-chakras", COMIC_CHAKRAS);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();
  // El blob entero del recorrido: el backend lo REEMPLAZA al guardar, así que
  // nunca se escribe sin tener lo que ya había.
  const dataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }

        const r = await axios.get(`${API_URL}/metodo-ayurveda/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        dataRef.current = r.data?.data || {};
        // Blindado al leer: si lo guardado viene con otra forma (o no viene),
        // la pantalla no puede reventar por las marquitas.
        setLeidos(new Set(leerChakrasLeidos(dataRef.current)));

        // El mapa no se enseña hasta que estén los siete mandalas y la
        // persona: si no, las cajas van apareciendo a trozos.
        await precargarImagenes([
          CHAKRAS_PERSONA,
          ...CHAKRAS_LISTA.map((c) => chakraFoto(c.key)),
        ].map(encodeURI));
      } catch {
        // silencioso: sin fila todavía, o sin red. El mapa se ve igual.
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Cómic terminado: su caja se queda marcada y se guarda (idempotente). */
  const marcarLeido = (c: Chakra) => {
    if (leidos.has(c.key)) return;
    setLeidos((prev) => new Set(prev).add(c.key));

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const next = marcarChakraLeido(dataRef.current, c.key);
    dataRef.current = next;
    axios.patch(`${API_URL}/metodo-ayurveda/${userId}`, { data: next },
                { headers: { Authorization: `Bearer ${token}` } })
      .catch(() => { /* se reintenta la próxima vez que se lea uno */ });
  };

  const irCursos = () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/cursos`);

  if (loading) return <AyurvedaLoading />;

  // La corona va sola arriba; los otros seis, en tres filas de dos.
  const [corona, ...resto] = CHAKRAS_LISTA;
  const todosLeidos = leidos.size >= CHAKRAS_LISTA.length;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="1150px" gap={{ base: 6, md: 8 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<AyurvedaIcon size={{ base: "40px", md: "56px" }} />}
              title={t("metodo.ayur.paso.chakras")}
              bgColor={`${ayurvedaBg}dd`}
              color={ayurvedaTxt}
              nom={ayurvedaNom}
              mb={0}
              prev={{ label: `← ${t("metodo.ayur.paso.pranayama")}`, onClick: () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/pranayama`) }}
              extra={ilustracionesBtn}
              next={{ label: `${t("metodo.nutri.paso.cursos")} →`, onClick: irCursos }}
            />
          </Reveal>

          {/* Fuera de las cajas: blanco y sin sombra. */}
          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.85"
                  textAlign="center" maxW="760px">
              {intro}
            </Text>
          </Reveal>

          <Reveal direction="up" distance={14} delay={0.16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center">
              {todosLeidos ? t("metodo.ayur.chakras.todos") : t("metodo.ayur.chakras.pulsa")}
            </Text>
          </Reveal>

          {/* ── EL MAPA: la persona y sus siete puntos ────────────────────── */}
          <Flex w="100%" direction={{ base: "column", lg: "row" }} align="stretch"
                gap={{ base: 5, md: 6 }}>

            {/* La persona. En una caja con el fondo de Hinduismo: la
                ilustración viene con fondo claro y sobre el turquesa pelado
                cantaría (la regla de la casa: las fotos, dentro de cajas). */}
            <Reveal direction="left" distance={24} duration={0.7} delay={0.2}
                    flex={{ base: "0 0 auto", lg: "0 0 34%" }} display="flex">
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                   boxShadow={glowHeader(ayurvedaTxt)}>
                <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}26`} />
                <Flex position="relative" zIndex={1} direction="column" align="center" justify="center"
                      h="100%" px={{ base: 4, md: 5 }} py={{ base: 5, md: 7 }} gap={3}>
                  <Image
                    src={encodeURI(CHAKRAS_PERSONA)}
                    alt={t("metodo.ayur.paso.chakras")}
                    maxH={{ base: "300px", md: "380px", lg: "560px" }}
                    w="auto" maxW="100%" objectFit="contain"
                  />
                  <Text color={`${ayurvedaTxt}cc`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                        textAlign="center" lineHeight="1.5"
                        style={{ textShadow: `0 1px 4px ${ayurvedaBg}` }}>
                    {t("metodo.ayur.chakras.pie")}
                  </Text>
                </Flex>
              </Box>
            </Reveal>

            {/* Las siete cajas: la corona arriba del todo, y debajo tres filas
                de dos, bajando por el cuerpo hasta la raíz. */}
            <Flex flex="1" direction="column" gap={{ base: 4, md: 5 }}>
              <Reveal direction="up" distance={20} duration={0.6} delay={0.26} w="100%">
                <ChakraBox chakra={corona} ancho leido={leidos.has(corona.key)}
                           onClick={() => setAbierto(corona)} />
              </Reveal>

              <SimpleGrid columns={2} spacing={{ base: 4, md: 5 }} w="100%" flex="1">
                {resto.map((ch, i) => (
                  <Reveal key={ch.key} direction="up" distance={20} duration={0.6}
                          delay={0.32 + i * 0.07} w="100%" display="flex">
                    <ChakraBox chakra={ch} leido={leidos.has(ch.key)}
                               onClick={() => setAbierto(ch)} />
                  </Reveal>
                ))}
              </SimpleGrid>
            </Flex>
          </Flex>

          <BotonPaso label={t("metodo.nutri.paso.cursos")} onClick={irCursos}
                     nom={ayurvedaNom} color={ayurvedaTxt} bg={ayurvedaBg} direction="next" />
        </Flex>
      </Flex>

      {/* El cómic del chakra que se ha pulsado. */}
      <ChakraComicModal chakra={abierto} onClose={() => setAbierto(null)} onComplete={marcarLeido} />

      {/* El cómic de entrada: qué son los chakras, antes de ver el mapa. */}
      <IntroComicModal
        isOpen={comicOpen}
        vinetas={comicVinetas}
        onClose={() => setComicOpen(false)}
        continueLabel={t("metodo.ayur.paso.chakras")}
        onContinue={() => setComicOpen(false)}
        themeColor={ayurvedaTxt}
        disciplinaBgImage="/img/fondos/hinduismo.webp"
        disciplinaBgColor={ayurvedaBg}
        textShadow={`0 0 6px ${ayurvedaBg}, 0 0 14px ${ayurvedaBg}, 0 0 26px ${ayurvedaBg}cc`}
      />

      {ilustracionesModal}
      <IndiceAyurveda />
      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />
      <SiteFooter />
    </Box>
  );
}
