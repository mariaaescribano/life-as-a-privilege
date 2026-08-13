import React, { useEffect, useState } from "react";
import { useT } from "../../i18n";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { CulturaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { FotoBox } from "../../components/metodo/FotoBox";
import { historiaVisual } from "../../components/metodo/culturaPortadas";
import { tituloHistoria } from "../../components/metodo/culturaHistorias";
import { Reveal } from "../../components/global/Reveal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, culturaBg, culturaNom, culturaTxt, CulturaIcon } from "../../GlobalVariables";

// Las 6 grandes Historias del recorrido de Cultura, en orden. La portada y el
// emoji de reserva de cada una salen de `culturaPortadas` (compartido con la
// presentación pública /d/cultura): las que aún no tienen portada muestran su
// emoji en el FotoBox. El título NO se escribe aquí: sale del diccionario
// (`tituloHistoria`), que es el mismo que lee la cabecera de cada Historia.
type Historia = { key: string; emoji: string; ruta: string; portada?: string };

const historia = (key: string): Historia => ({
  key,
  ruta: `/metodo/cultura/historia/${key}`,
  ...historiaVisual(key),
});

const HISTORIAS: Historia[] = [
  historia("universal"),
  historia("religiones"),
  historia("filosofia"),
  historia("ciencia"),
  historia("medicina"),
  historia("arte"),
];

export default function MetodoCulturaHistorias() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        // Gate de pago: sin suscripción a Cultura se vuelve a la portada (donde
        // vive el popup de pago). Blinda el acceso por URL directa.
        if (!me.data?.cultura_suscrito) { navigate("/metodo/cultura", { replace: true }); return; }

        // No mostramos la página hasta que las portadas visibles estén cargadas
        // (son solo 3 y se ven todas de golpe: no hay flechas aquí).
        await precargarImagenes(
          HISTORIAS.slice(0, 3).map((h) => (h.portada ? encodeURI(h.portada) : null)),
        );
      } catch {
        navigate("/metodo/cultura", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return <CulturaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1040px" gap={8}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CulturaIcon size={{ base: "40px", md: "56px" }} />}
              title={t("disciplina.cultura")}
              compact
              bgColor={`${culturaBg}dd`}
              color={culturaTxt}
              nom={culturaNom}
              mb={0}
              prev={{ label: `← ${t("metodo.cultura.paso.intro")}`, onClick: () => navigate("/metodo/cultura") }}
              // A la derecha, el taller de apuntes: de aquí se sale con lo
              // recorrido por escrito. Las Ilustraciones siguen en el header de
              // la portada de Cultura (/metodo/cultura), que es su sitio.
              next={{ label: t("metodo.cultura.paso.apuntes"), arrow: "next", onClick: () => navigate("/metodo/cultura/apuntes") }}
            />
          </Reveal>

          {/* ── Las 3 primeras Historias (las demás llegarán). Foto 1:1. ── */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 5, md: 7 }} w="100%">
            {HISTORIAS.slice(0, 3).map((h, i) => (
              <Reveal key={h.key} direction="up" distance={26} scaleFrom={0.97} delay={0.1 + i * 0.08} duration={0.7}>
                <Box h="100%">
                  <FotoBox
                    titulo={tituloHistoria(h.key).toUpperCase()}
                    emoji={h.emoji}
                    foto={h.portada}
                    nom={culturaNom}
                    tinta={culturaTxt}
                    bg={culturaBg}
                    aspect={1}
                    onClick={() => navigate(h.ruta)}
                  />
                </Box>
              </Reveal>
            ))}
          </SimpleGrid>
        </Flex>
      </Flex>

      <BotonCompania color={culturaTxt} bgColor={culturaBg} disciplinaNom={culturaNom} />

      <SiteFooter />
    </Box>
  );
}
