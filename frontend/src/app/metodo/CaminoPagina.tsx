// El CAMINO de una disciplina (/camino/<slug>): todas sus páginas como cajitas
// unidas por flechas, para ver de un vistazo por dónde se va y qué queda. Es lo
// primero que ve la persona al pulsar una disciplina. Las páginas abiertas se
// pulsan; las que aún abre María salen con candado. María (panel de admin
// desbloqueado) entra a donde quiera.
//
// De arriba abajo: el header de la casa (icono + nombre con la foto de la
// disciplina), la barra de avance (el número CUENTA hasta su valor y la barra se
// llena con un brillo que la recorre) y el camino.
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { CaminoCargando } from "../../components/metodo/CaminoCargando";
import { Contador, Reveal } from "../../components/global/Reveal";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { rutaHome } from "../../api/sesion";
import { esMariaMirando, personaActiva } from "../../api/persona";
import { claveDeSlug, porcentajeCamino } from "../../data/camino";
import { disciplinaByKey } from "../../data/adminDisciplinas";
import { API_URL } from "../../GlobalVariables";
import CaminoDisciplina from "../../components/metodo/CaminoDisciplina";

/** La barra de avance: se llena con un muelle suave y un brillo la recorre sin parar. */
function BarraAvance({ pct, color }: { pct: number; color: string }) {
  const [ancho, setAncho] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAncho(Math.max(0, Math.min(100, pct))));
    return () => cancelAnimationFrame(id);
  }, [pct]);

  return (
    <Box
      w="100%"
      h="8px"
      borderRadius="full"
      bg="rgba(255,255,255,0.2)"
      overflow="hidden"
      position="relative"
    >
      <Box
        h="100%"
        w={`${ancho}%`}
        borderRadius="full"
        position="relative"
        overflow="hidden"
        bg={color}
        transition="width 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.5s"
        style={{ boxShadow: `0 0 14px ${color}aa, 0 0 30px ${color}55` }}
      >
        {/* el brillo que la recorre */}
        <Box
          position="absolute"
          top={0}
          bottom={0}
          w="45%"
          bgGradient="linear(to-r, transparent, rgba(255,255,255,0.75), transparent)"
          sx={{
            animation: "barraBrillo 2.8s ease-in-out 2.2s infinite",
            "@keyframes barraBrillo": {
              "0%": { transform: "translateX(-120%)" },
              "60%, 100%": { transform: "translateX(320%)" },
            },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />
      </Box>
    </Box>
  );
}

export default function CaminoPagina() {
  const { disciplina } = useParams();
  const clave = claveDeSlug(disciplina);
  const [cargando, setCargando] = useState(true);
  // Por dónde va la persona (el mismo progreso que mide «Tu camino» de /home).
  const [progreso, setProgreso] = useState<Record<string, number> | null>(null);
  useEffect(() => {
    let cancel = false;
    axios.get<Record<string, number>>(`${API_URL}/recorrido-progreso`)
      .then((r) => { if (!cancel) setProgreso(r.data ?? {}); })
      .catch(() => { if (!cancel) setProgreso({}); });
    return () => { cancel = true; };
  }, [disciplina]);

  if (!clave) return <Navigate to={rutaHome()} replace />;
  const disc = disciplinaByKey(disciplina === "medicinachina" ? "tcm" : disciplina ?? "");
  const pct = progreso ? porcentajeCamino(progreso, clave) : 0;
  // Hasta tener el camino Y el progreso no se pinta nada de la página: solo el header de la casa
  // y, en el centro, el loader de ESTA disciplina (nada de mandala genérico ni de cabecera que
  // entra por su cuenta).
  const listo = !cargando && progreso !== null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      {/* Mientras carga, la MISMA pantalla que la descarga de la página (header + loader). */}
      {!listo && <Box position="fixed" inset={0} zIndex={5}><CaminoCargando txt={disc?.txt} /></Box>}
      <SiteHeader variant="private" />

      <Flex flex="1" direction="column" align="center" px={{ base: 4, md: 8 }} pt={{ base: 8, md: 12 }} pb={{ base: 10, md: 14 }}
            display={listo ? "flex" : "none"}>
        {disc && listo && (
          <Reveal direction="down" distance={18} duration={0.7} w="100%" maxW="850px">
            <MetodoStepHeader
              icon={<disc.Icon size={{ base: "40px", md: "52px" }} />}
              title={disc.nombre}
              nom={disc.nombre}
              bgColor={`${disc.bg}dd`}
              color={disc.txt}
              mb={0}
            />
          </Reveal>
        )}

        {/* La barra de avance. Fuera de las cajas: blanco y sin sombra de texto. */}
        {listo && <Reveal direction="up" distance={14} delay={0.3} duration={0.7} w="100%" display="flex" justifyContent="center"
                mt={{ base: 7, md: 9 }} mb={{ base: 9, md: 12 }}>
          <Flex align="center" gap={4} w={{ base: "86%", md: "460px" }} maxW="100%">
            <Box flex="1" minW={0}><BarraAvance pct={pct} color="white" /></Box>
            <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" minW="64px" textAlign="right" lineHeight="1">
              <Contador valor={pct} sufijo="%" duracion={1.6} />
            </Text>
          </Flex>
        </Reveal>}

        {/* María, dentro del camino de la persona, ve además los botones para abrirle pasos. */}
        <CaminoDisciplina clave={clave} userId={personaActiva()?.id} esAdmin={esMariaMirando()} onCargando={setCargando} />
      </Flex>

      <SiteFooter />
    </Box>
  );
}
