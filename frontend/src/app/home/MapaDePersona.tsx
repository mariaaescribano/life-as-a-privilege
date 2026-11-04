// ─────────────────────────────────────────────────────────────────────────────
// EL MAPA DE ESTA PERSONA · solo María, en el /home del camino de esa persona.
//
// Aquí se ve y se decide TODO lo del mapa de una persona: qué disciplinas tiene
// abiertas y hasta qué paso llega en cada una. La persona no ve nada de esto; solo
// ve lo que María abre. Lo propio de cada disciplina (escribir la carta astral, por
// ejemplo) se sigue haciendo dentro de ella.
//
//   · Abrir / cerrar la disciplina → POST /user/admin/acceso
//   · Subir / bajar los pasos      → POST /recorrido-progreso/admin/:userId/:disciplina
//     (usePasoMax con `userId`). Es el mismo techo en las OCHO disciplinas.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import { API_URL } from "../../GlobalVariables";
import { focoBlanco } from "../../components/global/foco";
import { usePasoMax } from "../../hooks/usePasoMax";
import { DISCIPLINAS_CAMINO, type CaminoKey } from "../../data/camino";
import { CARA, Barra } from "./CaminoUsuario";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { Reveal } from "../../components/global/Reveal";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";
import { astrologiaIndice } from "../../components/metodo/astrologiaRecorrido";
import { psicologiaIndice } from "../../components/metodo/psicologiaRecorrido";
import { fisiologiaNiveles } from "../../components/metodo/fisiologiaRecorrido";
import { nutricionIndice } from "../../components/metodo/nutricionRecorrido";
import { tcmIndice } from "../../components/metodo/tcmRecorrido";
import { ayurvedaDoshaIndice } from "../../components/metodo/ayurvedaRecorrido";
import { CABALA_TOTAL } from "../../components/metodo/useCabalaIndice";
import { HISTORIAS_CULTURA } from "../../components/metodo/culturaHistorias";

/** Cuántos pasos tiene el techo de cada disciplina (en ayurveda, el submapa del doṣha). */
const totalDe = (k: CaminoKey): number => {
  switch (k) {
    case "metodo": return astrologiaIndice().length;
    case "psicologia": return psicologiaIndice().length;
    case "fisiologia": return fisiologiaNiveles().reduce((a, g) => a + g.pasos.length, 0);
    case "nutricion": return nutricionIndice().length;
    case "tcm": return tcmIndice().length;
    case "ayurveda": return ayurvedaDoshaIndice().length;
    case "cabala": return CABALA_TOTAL;
    case "cultura": return Object.keys(HISTORIAS_CULTURA).length;
  }
};

/** Botón de píldora con los colores de SU disciplina (letra Txt, marco Txt, halo). */
const Pildora = ({ children, onClick, desactivado, titulo, ancho, cara }: {
  children: React.ReactNode; onClick?: () => void; desactivado?: boolean; titulo?: string; ancho?: string;
  cara: (typeof CARA)[CaminoKey];
}) => (
  <Box
    as="button"
    type="button"
    onClick={desactivado ? undefined : onClick}
    disabled={desactivado}
    title={titulo}
    aria-label={titulo}
    minW={ancho ?? "32px"}
    h="32px"
    px={ancho ? 4 : 0}
    borderRadius="full"
    border={`1.5px solid ${cara.txt}`}
    bg={`${cara.bg}d9`}
    color={cara.txt}
    fontWeight="700"
    fontSize="md"
    lineHeight="1"
    whiteSpace="nowrap"
    textShadow={cara.clara ? "none" : sombraTexto(cara.nom, cara.bg)}
    boxShadow={`0 0 12px ${cara.txt}33`}
    cursor={desactivado ? "not-allowed" : "pointer"}
    opacity={desactivado ? 0.45 : 1}
    transition="all 0.2s"
    _hover={desactivado ? undefined : { boxShadow: `0 0 18px ${cara.txt}66`, transform: "translateY(-1px)" }}
    _focusVisible={focoBlanco}
  >
    {children}
  </Box>
);

function Fila({ clave, personaId, abierta, ocupada, onAbrirCerrar }: {
  clave: CaminoKey; personaId: string; abierta: boolean; ocupada: boolean; onAbrirCerrar: () => void;
}) {
  const cara = CARA[clave];
  const nombreDisciplina = useNombreDisciplina();
  const total = totalDe(clave);
  const { pasoMax, cargado, fijar } = usePasoMax(clave, personaId);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(false);
  const Icon = cara.Icon;
  // Sobre acuarela clara (psicología, nutrición, ayurveda) la tinta se lee sola;
  // sobre las oscuras, la sombra de la casa.
  const sombra = cara.clara ? "none" : sombraTexto(cara.nom, cara.bg);
  const abiertos = Math.min(pasoMax, total);

  const mover = async (nuevo: number) => {
    if (!fijar || guardando || nuevo < 1 || nuevo > total) return;
    setGuardando(true);
    setError(false);
    try { await fijar(nuevo); } catch { setError(true); }
    setGuardando(false);
  };

  return (
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="lg"
      // La foto de la disciplina hace de fondo; debajo, su color sólido (lo que se
      // ve mientras llega la acuarela, y en Astrología, que es cielo estrellado).
      bg={cara.bg}
      border={`2px solid ${cara.txt}`}
      boxShadow={`0 0 14px ${cara.txt}2e`}
      p={3.5}
      // Cerrada: se ve que está apagada, sin velo oscuro (solo menos opacidad).
      opacity={abierta ? 1 : 0.7}
      transition="opacity 0.25s ease, box-shadow 0.25s ease"
      _hover={{ boxShadow: `0 0 22px ${cara.txt}59`, opacity: 1 }}
    >
      {hasDisciplinaBg(cara.nom) && (
        <DisciplinaBgLayer nom={cara.nom} borderRadius="lg" overlay={cara.clara ? "rgba(0,0,0,0)" : "rgba(8,13,30,0.22)"} />
      )}

      <Flex position="relative" zIndex={1} align="center" gap={3}>
        <Box flexShrink={0} display="flex" alignItems="center" justifyContent="center"><Icon size={{ base: "32px", md: "32px" }} /></Box>
        <Box flex="1" minW={0}>
          <Text color={cara.txt} fontSize="md" fontWeight="700" noOfLines={1} textShadow={sombra}>
            {nombreDisciplina(cara.nom, true)}
          </Text>
          <Text color={cara.txt} opacity={0.88} fontSize="xs" noOfLines={1} textShadow={sombra}>
            {!abierta ? "Cerrada" : cargado ? `Pasos abiertos: ${abiertos} de ${total}` : "…"}
          </Text>
        </Box>
        <Pildora
          cara={cara}
          ancho="82px"
          desactivado={ocupada}
          onClick={onAbrirCerrar}
          titulo={abierta ? "Cerrar la disciplina" : "Abrir la disciplina"}
        >
          {abierta ? "Cerrar" : "Abrir"}
        </Pildora>
      </Flex>

      {abierta && (
        <Flex position="relative" zIndex={1} align="center" gap={3} mt={3}>
          <Box flex="1" minW={0}>
            <Barra pct={cargado ? (abiertos / total) * 100 : 0} color={cara.txt}
                   pista={cara.clara ? `${cara.txt}2b` : "rgba(255,255,255,0.24)"} />
          </Box>
          <Flex gap={2} flexShrink={0}>
            <Pildora cara={cara} desactivado={!cargado || guardando || pasoMax <= 1} onClick={() => void mover(pasoMax - 1)} titulo="Cerrar el último paso abierto">−</Pildora>
            <Pildora cara={cara} desactivado={!cargado || guardando || pasoMax >= total} onClick={() => void mover(pasoMax + 1)} titulo="Abrir el siguiente paso">+</Pildora>
          </Flex>
        </Flex>
      )}
      {error && (
        <Text position="relative" zIndex={1} color={cara.txt} fontSize="xs" fontStyle="italic" mt={1.5} textShadow={sombra}>
          No se pudo guardar. Inténtalo de nuevo.
        </Text>
      )}
    </Box>
  );
}

export default function MapaDePersona({ personaId, nombre, suscritas }: {
  personaId: string;
  nombre: string;
  suscritas: Partial<Record<CaminoKey, boolean | null>>;
}) {
  const [ocupada, setOcupada] = useState(false);
  const [error, setError] = useState(false);

  const abrirCerrar = async (clave: CaminoKey, abierta: boolean) => {
    if (ocupada) return;
    setOcupada(true);
    setError(false);
    try {
      await axios.post(`${API_URL}/user/admin/acceso`, { userId: personaId, disciplina: clave, abierta: !abierta });
      // Recarga entera: /home guarda las disciplinas abiertas en una caché de módulo.
      window.location.reload();
    } catch {
      setError(true);
      setOcupada(false);
    }
  };

  return (
    <Flex direction="column" gap={3} w="100%" maxW="332px">
      {/* Texto fuera de las cajas: blanco y sin sombra */}
      <Reveal direction="right" distance={20}>
        <Text color="white" fontWeight="700" fontSize="sm" letterSpacing="0.14em" textTransform="uppercase">
          Mapa de {nombre}
        </Text>
      </Reveal>
      {DISCIPLINAS_CAMINO.map((k, i) => (
        <Reveal key={k} inView amount={0.15} direction="right" distance={24} delay={0.1 + i * 0.07}>
          <Fila
            clave={k}
            personaId={personaId}
            abierta={suscritas[k] === true}
            ocupada={ocupada}
            onAbrirCerrar={() => void abrirCerrar(k, suscritas[k] === true)}
          />
        </Reveal>
      ))}
      {error && <Text color="#ffe7bd" fontSize="sm" fontStyle="italic">No se pudo guardar. Inténtalo de nuevo.</Text>}
    </Flex>
  );
}
