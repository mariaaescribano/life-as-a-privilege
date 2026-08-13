// ─────────────────────────────────────────────────────────────────────────
// «TUS APUNTES» (Cultura) — /metodo/cultura/apuntes[/:historiaKey]
//
// Aquí se decide qué se lleva de Cultura y se descarga en un PDF hecho en su
// navegador. La pantalla del taller es la compartida por las ocho disciplinas
// (`CreaTusApuntes`); lo propio de Cultura es que va POR HISTORIA.
//
// Y va por Historia por una razón de tamaño: las seis juntan más de
// cuatrocientos momentos, así que un cuaderno único sería ilegible e imprimible
// por nadie. Por eso hay dos pantallas en el mismo componente:
//
//   · sin `historiaKey` → se elige de qué Historia son los apuntes.
//   · con `historiaKey` → el taller de esa Historia, con sus etapas como
//     capítulos marcables (ver components/metodo/apuntes/culturaApuntes.ts).
//
// Una clave que no existe (URL a mano, o una Historia aún sin publicar) no
// enseña un error: devuelve a la pantalla de elegir.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import { useT } from "../../i18n";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { CulturaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { FotoBox } from "../../components/metodo/FotoBox";
import { Reveal } from "../../components/global/Reveal";
import { CreaTusApuntes } from "../../components/metodo/CreaTusApuntes";
import {
  esHistoriaConApuntes, historiasParaElegir, libroApuntesCultura,
} from "../../components/metodo/apuntes/culturaApuntes";
import { tituloHistoria } from "../../components/metodo/culturaHistorias";
import { disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, culturaBg, culturaNom, culturaTxt, CulturaIcon } from "../../GlobalVariables";

// Mismo halo que el header de la página (regla de la casa: nada de sombras
// oscuras propias, el brillo de la disciplina y punto).
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${culturaTxt}1a, 0 0 48px ${culturaTxt}10`;

export default function MetodoCulturaApuntes() {
  const t = useT();
  const navigate = useNavigate();
  const { historiaKey } = useParams<{ historiaKey?: string }>();
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");

  const historias = useMemo(() => historiasParaElegir(), []);
  // Sin clave (o con una que no está publicada) se pinta la pantalla de elegir.
  const libro = useMemo(() => libroApuntesCultura(historiaKey), [historiaKey]);
  const eligiendo = !libro;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        // Gate de pago, igual que el resto del recorrido de Cultura: sin
        // suscripción se vuelve a la portada, donde vive el popup de pago.
        if (!me.data?.cultura_suscrito) { navigate("/metodo/cultura", { replace: true }); return; }
        // Su nombre va en la portada del PDF: estos apuntes son suyos.
        setNombre(String(me.data?.name ?? "").trim());
      } catch {
        navigate("/metodo/cultura", { replace: true });
        return;
      }
      setLoading(false);
    })();
  }, [navigate]);

  // Una clave escrita a mano que no corresponde a ninguna Historia publicada
  // devuelve a la pantalla de elegir, sin dejar la URL rota en la barra.
  useEffect(() => {
    if (historiaKey && !esHistoriaConApuntes(historiaKey)) {
      navigate("/metodo/cultura/apuntes", { replace: true });
    }
  }, [historiaKey, navigate]);

  // El loader se queda hasta tener el fondo y las miniaturas que se van a ver:
  // las portadas del taller, o las de las Historias si está eligiendo.
  const imagenesListas = usePrecargarImagenes([
    disciplinaBgImg(culturaNom),
    ...(libro
      ? libro.portadas.map((p) => p.src)
      : historias.map((h) => h.portada).filter((p): p is string => !!p)),
  ]);

  if (loading || !imagenesListas) {
    return <CulturaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW={eligiendo ? "1040px" : "850px"} gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CulturaIcon size={{ base: "40px", md: "56px" }} />}
              title={eligiendo ? t("metodo.cultura.paso.apuntes") : tituloHistoria(historiaKey)}
              compact
              bgColor={`${culturaBg}dd`}
              color={culturaTxt}
              nom={culturaNom}
              mb={0}
              prev={eligiendo
                ? { label: t("metodo.cultura.paso.historias"), arrow: "prev", onClick: () => navigate("/metodo/cultura/historias") }
                : { label: t("metodo.cultura.paso.apuntes"), arrow: "prev", onClick: () => navigate("/metodo/cultura/apuntes") }}
            />
          </Reveal>

          {eligiendo ? (
            <>
              {/* Sobre el turquesa: blanco y sin sombra (regla de la casa). */}
              <Reveal direction="up" distance={20} delay={0.1} duration={0.65} display="flex" justifyContent="center">
                <Flex direction="column" align="center" gap={2} maxW="680px">
                  <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" textAlign="center">
                    {t("metodo.cultura.apuntes.intro1")}
                  </Text>
                  <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.9}
                        textAlign="center">
                    {t("metodo.cultura.apuntes.intro2")}
                  </Text>
                </Flex>
              </Reveal>

              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 5, md: 7 }} w="100%">
                {historias.map((h, i) => (
                  <Reveal key={h.key} direction="up" distance={26} scaleFrom={0.97} delay={0.14 + i * 0.08} duration={0.7}>
                    <Box h="100%">
                      <FotoBox
                        titulo={tituloHistoria(h.key)}
                        emoji={h.emoji}
                        foto={h.portada}
                        nom={culturaNom}
                        tinta={culturaTxt}
                        bg={culturaBg}
                        aspect={1}
                        onClick={() => navigate(`/metodo/cultura/apuntes/${h.key}`)}
                      />
                      {/* Cuánto trae dentro, para decidir sin entrar. */}
                      <Text color="white" fontSize="sm" textAlign="center" mt={2.5} opacity={0.9}>
                        {t(h.etapas === 1 ? "metodo.cultura.apuntes.etapa" : "metodo.cultura.apuntes.etapas", { n: h.etapas })}
                        {" · "}
                        {t("metodo.cultura.apuntes.momentos", { n: h.momentos })}
                      </Text>
                    </Box>
                  </Reveal>
                ))}
              </SimpleGrid>
            </>
          ) : (
            <CreaTusApuntes
              libro={libro!}
              nom={culturaNom}
              txt={culturaTxt}
              bg={culturaBg}
              nombre={nombre}
              glow={CAJA_GLOW}
            />
          )}
        </Flex>
      </Flex>

      <BotonCompania color={culturaTxt} bgColor={culturaBg} disciplinaNom={culturaNom} />

      <SiteFooter />
    </Box>
  );
}
