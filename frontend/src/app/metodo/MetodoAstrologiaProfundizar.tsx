import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { Glifo } from "../../components/metodo/Glifo";
import { cuerpoByKey, soloClavesPlaneta, type CuerpoKey } from "../../components/metodo/astrologiaData";
import { getTextoSigno, getTextoCasa } from "../../components/metodo/astrologiaTextos";
import { useOverridesRemotos } from "../../data/astrologiaOverridesRemotos";
import { SPACE_IMG } from "../../components/metodo/SpaceBg";
import { useImagesReady } from "../../hooks/useImagesReady";
import { BotonCompania } from "../../components/global/BotonCompania";
import { API_URL, astrologiaBg, astrologiaNom, astrologiaTxt } from "../../GlobalVariables";
import { useT } from "../../i18n";

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

// Renderiza un texto con markdown ligero: **texto** se convierte en negrita
// con el color del planeta. Conserva los saltos de línea originales (gracias
// al whiteSpace: "pre-wrap" del Text contenedor).
function renderConNegritas(texto: string, color: string): React.ReactNode {
  const partes = texto.split(/(\*\*[^*]+\*\*)/g);
  return partes.map((parte, i) => {
    if (parte.startsWith("**") && parte.endsWith("**")) {
      return (
        <span
          key={i}
          style={{
            fontWeight: 700,
            color,
            textShadow: `0 0 8px ${color}55`,
          }}
        >
          {parte.slice(2, -2)}
        </span>
      );
    }
    return <React.Fragment key={i}>{parte}</React.Fragment>;
  });
}

export default function MetodoAstrologiaProfundizar() {
  const t = useT();
  const navigate = useNavigate();
  const { planetaKey, campo } = useParams<{ planetaKey: string; campo: "signo" | "casa" }>();
  const cuerpo = cuerpoByKey(planetaKey || "");

  // Guardamos la promesa del PATCH para esperarla al volver a planetas
  const profundizadoPromise = useRef<Promise<void> | null>(null);
  const [loading, setLoading] = useState(true);
  const [valor, setValor] = useState<{ signo?: string; casa?: number }>({});
  // Los textos editados desde /admin viven en la BD: al llegar, esto provoca el
  // re-render para que getTextoSigno/getTextoCasa devuelvan ya la versión nueva.
  const overridesListos = useOverridesRemotos();
  const fotosListas = useImagesReady([SPACE_IMG]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!cuerpo) { navigate("/metodo/astrologia/planetas", { replace: true }); return; }

    // Carga el estado actual y, si hace falta, marca este apartado como profundizado.
    profundizadoPromise.current = (async () => {
      try {
        const res = await axios.get(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Solo claves de planeta (no arrastrar el progreso de lectura del JSONB).
        const data = soloClavesPlaneta(res.data?.data) as Record<string, any>;
        const existente = data[cuerpo.key] || {};
        setValor({ signo: existente.signo, casa: existente.casa });

        const flag = campo === "signo" ? "profundizadoSigno" : "profundizadoCasa";
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
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const volverAPlanetas = async () => {
    // Espera a que el PATCH de profundizado termine antes de navegar,
    // para que la página de planetas vea el flag al recargar datos.
    if (profundizadoPromise.current) {
      try { await profundizadoPromise.current; } catch { /* ignore */ }
    }
    navigate("/metodo/astrologia/planetas");
  };

  if (loading || !fotosListas || !overridesListos) {
    return <RecorridoLoading />;
  }
  if (!cuerpo) return null;

  const esSigno = campo === "signo";
  const titulo = esSigno
    ? `Astrología: ${cuerpo.label}`
    : `Astrología: ${cuerpo.label} Casa`;

  // Recupera el texto guardado para el signo/casa elegido por el usuario
  const textoMostrado = esSigno
    ? (valor.signo ? getTextoSigno(cuerpo.key, valor.signo) : null)
    : (valor.casa != null ? getTextoCasa(cuerpo.key, valor.casa) : null);

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
            prev={{ label: "← Volver a planetas", onClick: () => { void volverAPlanetas(); } }}
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
              {textoMostrado ? (
                <Text
                  color={`${cuerpo.color}e6`}
                  fontSize={{ base: "lg", md: "xl" }}
                  lineHeight="1.9"
                  letterSpacing="0.015em"
                  textAlign="left"
                  style={{
                    whiteSpace: "pre-wrap",
                    textShadow: `0 0 8px ${cuerpo.color}77, 0 0 20px ${cuerpo.color}44`,
                  }}
                >
                  {renderConNegritas(textoMostrado, cuerpo.color)}
                </Text>
              ) : (
                <Text
                  color={`${cuerpo.color}aa`}
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.8"
                  letterSpacing="0.015em"
                  fontStyle="italic"
                  textAlign="center"
                >
                  {t("metodo.astro.profundizarSinTexto")}
                </Text>
              )}
            </Box>
          </Box>

        </Flex>
      </Flex>

      <BotonCompania color={astrologiaTxt} bgColor={astrologiaBg} disciplinaNom={astrologiaNom} precio={20} llamadaTitulo="Reserva tu llamada de astrología" />
      <SiteFooter />
    </Box>
  );
}

// Re-export para que TS no marque CuerpoKey como muerto si se requiere en el futuro
export type { CuerpoKey };
