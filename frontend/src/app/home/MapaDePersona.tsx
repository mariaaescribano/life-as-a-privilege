// ─────────────────────────────────────────────────────────────────────────────
// EL MAPA DE ESTA PERSONA · solo María, en el /home del camino de esa persona.
//
// Un desplegable (empieza plegado, como «Tu camino») con las ocho disciplinas y,
// en cada una, UN botón: abrirla o cerrarla (POST /user/admin/acceso). Los pasos
// de cada disciplina NO se tocan aquí: se abren dentro de su camino
// (/camino/<slug>). La persona no ve nada de esto; solo ve lo que María abre.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import { API_URL } from "../../GlobalVariables";
import { focoBlanco } from "../../components/global/foco";
import { DISCIPLINAS_CAMINO, type CaminoKey } from "../../data/camino";
import { CARA } from "./CaminoUsuario";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { Reveal } from "../../components/global/Reveal";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";

// Si lo ha abierto, sigue abierto al volver a /home dentro de la misma sesión (en
// una visita nueva vuelve a empezar plegado). Mismo criterio que «Tu camino».
let desplegadoCache = false;

/** Botón de píldora con los colores de SU disciplina (letra Txt, marco Txt, halo). */
const Pildora = ({ children, onClick, desactivado, titulo, cara }: {
  children: React.ReactNode; onClick?: () => void; desactivado?: boolean; titulo?: string;
  cara: (typeof CARA)[CaminoKey];
}) => (
  <Box
    as="button"
    type="button"
    onClick={desactivado ? undefined : onClick}
    disabled={desactivado}
    title={titulo}
    aria-label={titulo}
    minW="82px"
    h="32px"
    px={4}
    borderRadius="full"
    border={`1.5px solid ${cara.txt}`}
    // Sin relleno: transparente, que se vea la foto de la disciplina a través.
    bg="transparent"
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
    _hover={desactivado ? undefined : { boxShadow: `0 0 18px ${cara.txt}66`, transform: "translateY(-1px)", bg: `${cara.txt}1a` }}
    _focusVisible={focoBlanco}
  >
    {children}
  </Box>
);

function Fila({ clave, abierta, ocupada, onAbrirCerrar }: {
  clave: CaminoKey; abierta: boolean; ocupada: boolean; onAbrirCerrar: () => void;
}) {
  const cara = CARA[clave];
  const nombreDisciplina = useNombreDisciplina();
  const Icon = cara.Icon;
  // Sobre acuarela clara (psicología, nutrición, ayurveda) la tinta se lee sola;
  // sobre las oscuras, la sombra de la casa.
  const sombra = cara.clara ? "none" : sombraTexto(cara.nom, cara.bg);

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
            {abierta ? "Abierta" : "Cerrada"}
          </Text>
        </Box>
        <Pildora
          cara={cara}
          desactivado={ocupada}
          onClick={onAbrirCerrar}
          titulo={abierta ? "Cerrar la disciplina" : "Abrir la disciplina"}
        >
          {abierta ? "Cerrar" : "Abrir"}
        </Pildora>
      </Flex>
    </Box>
  );
}

export default function MapaDePersona({ personaId, nombre, suscritas }: {
  personaId: string;
  nombre: string;
  suscritas: Partial<Record<CaminoKey, boolean | null>>;
}) {
  const [desplegado, setDesplegado] = useState(desplegadoCache);
  const [ocupada, setOcupada] = useState(false);
  const [error, setError] = useState(false);

  const alternar = () => setDesplegado((d) => { desplegadoCache = !d; return !d; });

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
    <Flex direction="column" w="100%" maxW="332px">
      {/* El botón que despliega: texto fuera de las cajas, blanco y sin sombra. */}
      <Reveal direction="right" distance={20}>
        <Flex
          as="button"
          type="button"
          onClick={alternar}
          aria-expanded={desplegado}
          align="center"
          justify="space-between"
          gap={3}
          w="100%"
          px={4}
          py={3}
          borderRadius="lg"
          bg="rgba(255,255,255,0.08)"
          border="1px solid rgba(255,255,255,0.22)"
          cursor="pointer"
          transition="background 0.2s ease, border-color 0.2s ease"
          _hover={{ bg: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.38)" }}
          _focusVisible={focoBlanco}
        >
          <Text color="white" fontSize="sm" fontWeight="700" letterSpacing="0.14em" textTransform="uppercase" textAlign="left" noOfLines={1}>
            Mapa de {nombre}
          </Text>
          {/* la punta de flecha: apunta abajo plegado, arriba desplegado */}
          <Box
            as="span"
            flexShrink={0}
            w="8px"
            h="8px"
            borderRight="2px solid rgba(255,255,255,0.8)"
            borderBottom="2px solid rgba(255,255,255,0.8)"
            transform={desplegado ? "rotate(-135deg) translate(-2px, -2px)" : "rotate(45deg)"}
            transition="transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)"
          />
        </Flex>
      </Reveal>

      {/* Las cajas aparecen al desplegar. El alto se anima con grid-template-rows
          (de 0fr a 1fr): dura lo mismo con ocho cajas y nunca corta el contenido. */}
      <Box
        display="grid"
        gridTemplateRows={desplegado ? "1fr" : "0fr"}
        transition="grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1)"
      >
        <Box overflow="hidden" minH="0">
          <Flex direction="column" gap={2.5} pt={desplegado ? 3 : 0} transition="padding-top 0.45s ease">
            {DISCIPLINAS_CAMINO.map((k, i) => (
              <Box
                key={k}
                // La cascada: al desplegar, cada caja entra después de la anterior.
                opacity={desplegado ? 1 : 0}
                transform={desplegado ? "translate(0, 0)" : "translate(-18px, -10px) scale(0.94)"}
                transition={`opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${desplegado ? 0.1 + i * 0.07 : 0}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${desplegado ? 0.1 + i * 0.07 : 0}s`}
                sx={{ "@media (prefers-reduced-motion: reduce)": { transition: "none !important" } }}
              >
                <Fila
                  clave={k}
                  abierta={suscritas[k] === true}
                  ocupada={ocupada}
                  onAbrirCerrar={() => void abrirCerrar(k, suscritas[k] === true)}
                />
              </Box>
            ))}
            {error && <Text color="#ffe7bd" fontSize="sm" fontStyle="italic">No se pudo guardar. Inténtalo de nuevo.</Text>}
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}
