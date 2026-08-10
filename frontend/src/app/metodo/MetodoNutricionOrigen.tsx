import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "../../i18n";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { AppleLoader } from "../../components/metodo/AppleLoader";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal, RevealStagger, RevealItem, Float } from "../../components/global/Reveal";
import { TarjetaNutri } from "../../components/metodo/TarjetaNutri";
import { glowSuave } from "../../components/metodo/FotoBox";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { ComicModal } from "../../components/metodo/ComicModal";
import { useLeidos } from "../../hooks/useLeidos";
import {
  API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon,
} from "../../GlobalVariables";
import { ORIGEN_NUTRIENTES, ORIGEN_LEIDOS_KEY } from "../../components/metodo/comicsOrigenNutrientes";

// ═════════════════════════════════════════════════════════════════════════
// «¿De dónde vienen los nutrientes?» — último paso del recorrido de Nutrición
// (va entre «Preguntas y mitos» y los cursos). Todo el recorrido cuenta lo que
// le pasa a la comida DENTRO de ti; aquí se cuenta el viaje de ANTES: cinco
// lecturas de zoom creciente (los ciclos del planeta → el suelo y la raíz → la
// planta → la hoja → el fruto y sus colores) y una sexta para la otra rama, la
// de los alimentos que antes pasaron por un animal.
//
// Cada tarjeta abre su cómic en el visor común (ComicModal) y se queda con su
// marquita de leída (useLeidos → metodo_nutricion.data.origen_leidos).
// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionOrigen() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [abierta, setAbierta] = useState<number | null>(null);
  const { leido, marcarLeido } = useLeidos("metodo-nutricion");
  // Si el cómic ya venía leído, el visor lo dice arriba («✓ Leída»). Se mira
  // ANTES de marcarlo, que si no saldría siempre.
  const [abiertaLeida, setAbiertaLeida] = useState(false);

  // Abrir una lectura = leerla: se queda con su marquita.
  const abrir = (i: number) => {
    const l = ORIGEN_NUTRIENTES[i];
    setAbiertaLeida(leido(ORIGEN_LEIDOS_KEY, l.key));
    setAbierta(i);
    marcarLeido(ORIGEN_LEIDOS_KEY, l.key);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <NutricionLoading />;

  const lectura = abierta !== null ? ORIGEN_NUTRIENTES[abierta] : null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<Float amplitude={5} duration={5}><NutricionIcon size={{ base: "40px", md: "56px" }} /></Float>}
              title="¿De dónde vienen los nutrientes?"
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: `← ${t("metodo.nutri.paso.mitos")}`, onClick: () => navigate("/metodo/nutricion/mitos") }}
              extra={{ label: t("metodo.nutri.paso.biblioteca"), onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: `${t("metodo.nutri.paso.cursos")} →`, onClick: () => navigate("/metodo/nutricion/cursos") }}
            />
          </Reveal>

          {/* Texto bajo el header: SIN textShadow (va sobre el turquesa limpio). */}
          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="680px">
              Ya sabes qué hace tu cuerpo con la comida. Pero ¿quieres entender de dónde sale? Ningún ser vivo
              fabrica un átomo: todos los que hoy son tú venían de una roca, del aire y del agua, y alguien los
              tuvo que recoger por ti. Estas seis lecturas cuentan ese viaje, desde el planeta entero hasta el
              color de una fresa.
            </Text>
          </Reveal>

          <RevealStagger inView stagger={0.07} amount={0.1} w="100%"
                         display="grid" gap={{ base: 4, md: 6 }}
                         gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}>
            {ORIGEN_NUTRIENTES.map((l, i) => (
              <RevealItem key={l.key} direction="up" distance={22} scaleFrom={0.96} duration={0.55}
                          w="100%" display="flex">
                <TarjetaNutri
                  numero={i + 1}
                  foto={l.cover}
                  emoji={l.emoji}
                  visto={leido(ORIGEN_LEIDOS_KEY, l.key)}
                  onClick={() => abrir(i)}
                  titulo={
                    <Flex direction="column" gap={1}>
                      <Text as="span" fontWeight={700} fontSize={{ base: "sm", md: "md" }} lineHeight="1.25">
                        {l.titulo}
                      </Text>
                      <Text as="span" fontWeight={400} fontStyle="italic" fontSize={{ base: "xs", md: "sm" }}
                            lineHeight="1.4" opacity={0.85}>
                        {l.resumen}
                      </Text>
                    </Flex>
                  }
                />
              </RevealItem>
            ))}
          </RevealStagger>

          {/* Cierre del paso: el viaje entero en una línea. Caja con el fondo de
              la disciplina y el glow del acento (nunca sombra oscura ni halo
              claro), y desde aquí se sigue a los cursos. */}
          <Reveal inView direction="up" distance={18} delay={0.1} duration={0.6} w="100%"
                  display="flex" justifyContent="center">
            <Flex direction="column" align="center" gap={3} w="100%" maxW="680px" textAlign="center"
                  position="relative" borderRadius="2xl" overflow="hidden"
                  boxShadow={glowSuave(nutricionTxt)} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}>
              <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}cc`} />
              <Text position="relative" zIndex={1} color={nutricionTxt} fontWeight={700}
                    fontSize={{ base: "lg", md: "xl" }} lineHeight="1.3">
                Y así llega hasta ti
              </Text>
              <Text position="relative" zIndex={1} color={nutricionTxt} fontSize={{ base: "sm", md: "md" }}
                    fontStyle="italic" lineHeight="1.8" opacity={0.9}>
                Una roca, el agua del suelo, un hongo, una raíz, dos tuberías, una hoja que atrapa la luz, una
                flor que se convierte en fruto… y a veces un animal que lo llevó puesto antes que tú. Todo lo que
                hoy eres estuvo dando vueltas por ahí, y volverá a hacerlo. Nada se inventa de cero: se presta.
              </Text>
            </Flex>
          </Reveal>

        </Flex>
      </Flex>

      {/* Visor del cómic elegido, con el tema de Nutrición (acento claro + letra
          oscura, sin sombra) y su manzana como animación de espera. */}
      <ComicModal
        isOpen={!!lectura}
        onClose={() => setAbierta(null)}
        vinetas={lectura?.vinetas ?? []}
        themeColor={nutricionBg}
        textColor={nutricionTxt}
        textShadow="none"
        disciplinaBgImage="/img/fondos/nutri.webp"
        disciplinaBgColor={nutricionBg}
        cerrarColor={nutricionTxt}
        loader={<AppleLoader color={nutricionTxt} label={null} />}
        leida={abiertaLeida}
      />

      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
