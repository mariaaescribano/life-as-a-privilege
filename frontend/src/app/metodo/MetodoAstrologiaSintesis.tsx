import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { IndiceAstrologia } from "../../components/metodo/IndiceAstrologia";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { TextoMarcado } from "../../components/global/TextoMarcado";
import { glowHeader } from "../../components/metodo/FotoBox";
import { Reveal } from "../../components/global/Reveal";
import { useAstrologiaProgreso } from "../../hooks/useAstrologiaProgreso";
import { esMariaMirando } from "../../api/persona";
import { API_URL, astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";
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
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    let vivo = true;
    axios.get<{ data?: { sintesis?: string } } | null>(`${API_URL}/metodo-astrologia/${userId}`)
      .then((r) => { if (vivo) setSintesis(typeof r.data?.data?.sintesis === "string" ? r.data.data.sintesis.trim() : ""); })
      .catch(() => { /* sin datos, sin caja */ });
    return () => { vivo = false; };
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
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
              step={{ current: 11, total: 12 }}
              mb={0}
              prev={{ label: `← ${t("metodo.astro.paso.apuntes")}`, onClick: () => navigate("/metodo/astrologia/apuntes") }}
              next={{
                label: `${t("metodo.astro.paso.cursos")} →`,
                onClick: () => navigate("/metodo/astrologia/cursos"),
                disabled: !esMariaMirando() && cargado && bloqueada(12),
              }}
            />
          </Reveal>

          {/* Fuera de las cajas: blanco y sin sombra. */}
          <Reveal direction="up" distance={18} delay={0.15} duration={0.7} w="100%" maxW="680px">
            <Text color="white" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8" textAlign="center" fontStyle="italic">
              {t("metodo.astro.sintesis.intro", { nombre })}
            </Text>
          </Reveal>

          {sintesis && (
            <Reveal direction="up" distance={24} delay={0.25} duration={0.8} w="100%">
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={glowHeader(astrologiaTxt)}>
                <DisciplinaBgLayer nom={astrologiaNom} borderRadius="2xl" />
                <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 7, md: 9 }}>
                  <TextoMarcado
                    texto={sintesis}
                    colorRaya={`${astrologiaTxt}66`}
                    color={astrologiaTxt}
                    fontSize={{ base: "lg", md: "xl" }}
                    lineHeight="1.85"
                  />
                </Box>
              </Box>
            </Reveal>
          )}
        </Flex>
      </Flex>

      <IndiceAstrologia />
      <SiteFooter />
    </Box>
  );
}
