import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { FotoBox } from "../../components/metodo/FotoBox";
import { CulturaIlustracionesModal } from "../../components/metodo/CulturaIlustracionesModal";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, culturaBg, culturaNom, culturaTxt, CulturaIcon } from "../../GlobalVariables";

// Ojo del botón "Ilustraciones" (se pinta a la izquierda del texto).
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="16" height="16" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))", flexShrink: 0 }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </svg>
);

// Las 6 grandes Historias del recorrido de Cultura, en orden. Las portadas viven
// en /recorrido/cultura/portadas/<archivo>.png (nombres propios, no coinciden con
// la key). Las que aún no tienen portada dejan `portada` sin poner y FotoBox
// muestra el emoji de reserva.
type Historia = { key: string; titulo: string; emoji: string; ruta: string; portada?: string };

const P = "/recorrido/cultura/portadas";
const HISTORIAS: Historia[] = [
  { key: "universal",  titulo: "HISTORIA UNIVERSAL",              emoji: "🌍", ruta: "/metodo/cultura/historia/universal",  portada: `${P}/historiauniversal.png` },
  { key: "religiones", titulo: "HISTORIA DE LAS RELIGIONES",      emoji: "🕊️", ruta: "/metodo/cultura/historia/religiones", portada: `${P}/historiareligion.png` },
  { key: "filosofia",  titulo: "HISTORIA DE LA FILOSOFÍA",        emoji: "🏛️", ruta: "/metodo/cultura/historia/filosofia",  portada: `${P}/historiafilosofia.png` },
  { key: "ciencia",    titulo: "HISTORIA DE LA CIENCIA",          emoji: "🔬", ruta: "/metodo/cultura/historia/ciencia" },
  { key: "medicina",   titulo: "HISTORIA DE LA MEDICINA",         emoji: "⚕️", ruta: "/metodo/cultura/historia/medicina" },
  { key: "arte",       titulo: "HISTORIA DEL ARTE Y LA LITERATURA", emoji: "🎭", ruta: "/metodo/cultura/historia/arte" },
];

export default function MetodoCulturaHistorias() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        // Gate de pago: sin suscripción a Cultura se vuelve a la portada (donde
        // vive el popup de pago). Blinda el acceso por URL directa.
        if (!me.data?.cultura_suscrito) { navigate("/metodo/cultura", { replace: true }); return; }
      } catch {
        navigate("/metodo/cultura", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={8}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CulturaIcon size={{ base: "40px", md: "56px" }} />}
              title="Cultura"
              pageLabel="2"
              compact
              bgColor={`${culturaBg}dd`}
              color={culturaTxt}
              nom={culturaNom}
              mb={0}
              prev={{ label: "← Introducción", onClick: () => navigate("/metodo/cultura") }}
              extra={{ label: "Ilustraciones", onClick: () => setIlustracionesOpen(true), icon: <EyeIcon /> }}
            />
          </Reveal>

          {/* ── Las 6 Historias (3 arriba, 3 abajo) ── */}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 5, md: 7 }} w="100%">
            {HISTORIAS.map((h, i) => (
              <Reveal key={h.key} direction="up" distance={26} scaleFrom={0.97} delay={0.1 + i * 0.08} duration={0.7}>
                <Box h="100%">
                  <FotoBox
                    titulo={h.titulo}
                    numero={i + 1}
                    emoji={h.emoji}
                    foto={h.portada}
                    nom={culturaNom}
                    tinta={culturaTxt}
                    bg={culturaBg}
                    aspect={1.5}
                    onClick={() => navigate(h.ruta)}
                  />
                </Box>
              </Reveal>
            ))}
          </SimpleGrid>
        </Flex>
      </Flex>

      <CulturaIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

      <BotonCompania color={culturaTxt} bgColor={culturaBg} disciplinaNom={culturaNom} />

      <SiteFooter />
    </Box>
  );
}
