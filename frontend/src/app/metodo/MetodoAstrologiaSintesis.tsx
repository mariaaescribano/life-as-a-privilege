import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { TextoPorSecciones, construirSecciones } from "../../components/metodo/TextoPorSecciones";
import { Reveal } from "../../components/global/Reveal";
import { AstrologiaLoading } from "../../components/metodo/comicLoaders";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { esMariaMirando } from "../../api/persona";
import { API_URL, astrologiaBg, astrologiaTxt, AstrologiaIcon, FONDO_PAGINA_TURQUESA } from "../../GlobalVariables";
import { useT } from "../../i18n";

/**
 * Paso 11 del recorrido de Astrología: la Síntesis. Debajo del header, una frase
 * para la persona y, debajo, una caja con la foto de Astrología con lo que María
 * escribió en el editor de su carta (/admin/astrologia/:userId, «La Síntesis»).
 * Aquí no se escribe nada: sale sola. Sin texto escrito, la caja no sale.
 */
export default function MetodoAstrologiaSintesis() {
  const t = useT();
  const navigate = useNavigate();
  const { bloqueada, cargado } = useAstrologiaProgreso();
  const nombre = (() => {
    try { return (localStorage.getItem("name") ?? "").trim().split(/\s+/)[0] ?? ""; } catch { return ""; }
  })();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  // La Síntesis de su carta (escrita en el editor de la carta, guardada en `data.sintesis`).
  const [sintesis, setSintesis] = useState("");
  const [listo, setListo] = useState(false);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) { setListo(true); return; }
    let vivo = true;
    axios.get<{ data?: { sintesis?: string } } | null>(`${API_URL}/metodo-astrologia/${userId}`)
      .then((r) => { if (vivo) setSintesis(typeof r.data?.data?.sintesis === "string" ? r.data.data.sintesis.trim() : ""); })
      .catch(() => { /* sin datos, sin caja */ })
      .finally(() => { if (vivo) setListo(true); });
    return () => { vivo = false; };
  }, []);

  // Hasta tener su texto, solo el loader (nunca la página a medias con el pie a la vista).
  if (!listo) return <AstrologiaLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={{ base: 7, md: 9 }}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%">
            <MetodoStepHeader
              icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
              title={t("metodo.astro.paso.sintesis")}
              bgColor={`${astrologiaBg}dd`}
              color={astrologiaTxt}
              space
              step={{ current: 18, total: 19 }}
              mb={0}
              prev={{ label: `← ${t("metodo.astro.paso.pdf")}`, onClick: () => navigate("/metodo/astrologia/pdf") }}
              next={{
                label: `${t("metodo.astro.paso.cursos")} →`,
                onClick: () => navigate("/metodo/astrologia/cursos"),
                disabled: !esMariaMirando() && cargado && bloqueada(19),
              }}
            />
          </Reveal>

          {/* Fuera de las cajas: turquesa oscuro y sin sombra. */}
          <Reveal direction="up" distance={18} delay={0.15} duration={0.7} w="100%" maxW="680px">
            <Text color={FONDO_PAGINA_TURQUESA} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8" textAlign="center" fontStyle="italic">
              {t("metodo.astro.sintesis.intro", { nombre })}
            </Text>
          </Reveal>

          {/* Mismo texto y separadores que las Áreas: cada «---» es una línea con el icono de Astrología en medio. */}
          {sintesis && <TextoPorSecciones secciones={construirSecciones(sintesis)} retraso={0.25} />}
        </Flex>
      </Flex>

      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
