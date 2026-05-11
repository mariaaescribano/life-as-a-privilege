import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { Glifo } from "../../components/metodo/Glifo";
import { cuerpoByKey, type CuerpoKey } from "../../components/metodo/astrologiaData";
import { API_URL } from "../../GlobalVariables";

/* Fondo espacial reutilizado */
const SpaceBg = ({ overlay = "rgba(8,13,30,0.65)" }: { overlay?: string }) => (
  <Box
    position="absolute"
    inset="0"
    pointerEvents="none"
    overflow="hidden"
    borderRadius="inherit"
    style={{
      background:
        "radial-gradient(ellipse at 30% 20%, #2a1b5c 0%, #14143a 45%, #050816 100%)",
    }}
  >
    <Box
      as="img"
      src="/img/astrologia/space.jpg"
      alt=""
      loading="eager"
      position="absolute"
      inset="0"
      w="100%"
      h="100%"
      style={{ objectFit: "cover", objectPosition: "center", opacity: 0.85 }}
    />
    <Box position="absolute" inset="0" style={{ background: overlay }} />
  </Box>
);

export default function MetodoAstrologiaProfundizar() {
  const navigate = useNavigate();
  const { planetaKey, campo } = useParams<{ planetaKey: string; campo: "signo" | "casa" }>();
  const cuerpo = cuerpoByKey(planetaKey || "");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!cuerpo) { navigate("/metodo/astrologia/planetas", { replace: true }); return; }

    // Marca este apartado como profundizado en BD
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data?.data || {};
        const existente = data[cuerpo.key] || {};
        const flag = campo === "signo" ? "profundizadoSigno" : "profundizadoCasa";
        // Solo escribir si aún no está marcado (evita PATCH innecesario)
        if (!existente[flag]) {
          const nextData = {
            ...data,
            [cuerpo.key]: { ...existente, [flag]: true },
          };
          await axios.patch(
            `${API_URL}/metodo-astrologia/${userId}`,
            { data: nextData },
            { headers: { Authorization: `Bearer ${token}` } },
          );
        }
      } catch {
        // Silencioso: si BD falla, el flag no se persiste pero la UI sigue
      }
    })();
  }, []);

  if (!cuerpo) return null;

  const esSigno = campo === "signo";
  const titulo = esSigno
    ? `Astrología: ${cuerpo.label}`
    : `Astrología: ${cuerpo.label} Casa`;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>

          {/* ── Header con icono del planeta ── */}
          <MetodoStepHeader
            icon={<Glifo symbol={cuerpo.symbol} color={cuerpo.color} size={42} />}
            title={titulo}
            bgColor={`${cuerpo.color}1f`}
            color={cuerpo.color}
            space
            mb={0}
            prev={{ label: "← Volver a planetas", onClick: () => navigate("/metodo/astrologia/planetas") }}
          />

          {/* ── Box con el texto profundo (fondo estrellado) ── */}
          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={`1px solid ${cuerpo.color}55`}
            boxShadow={`0 0 28px ${cuerpo.color}33, 0 0 72px ${cuerpo.color}1f`}
          >
            <SpaceBg overlay="rgba(8,13,30,0.7)" />

            <Box position="relative" zIndex={1} px={{ base: 7, md: 12 }} py={{ base: 9, md: 12 }}>
              {/* Aquí irá el texto que vas a pasar — placeholder por ahora */}
              <Text
                color={`${cuerpo.color}cc`}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="2"
                letterSpacing="0.015em"
                fontStyle="italic"
                textAlign="center"
              >
                [Pega aquí el texto de profundización para <strong>{titulo}</strong>.]
              </Text>
            </Box>
          </Box>

        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}

// Re-export para que TS no marque CuerpoKey como muerto si se requiere en el futuro
export type { CuerpoKey };
