import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";

// ─────────────────────────────────────────────────────────────────────────
// UI de SOLO LECTURA para el panel admin: el administrador solo lee lo que el
// propio usuario ha escrito en su recorrido (psicología, ayurveda…). Nada es
// editable.
//
// Estética (a petición): la FOTO de la disciplina se ve bien en el fondo de
// TODAS las tarjetas. Para que el texto sea legible sobre la acuarela, cada
// respuesta se apoya en un pequeño panel de "papel" translúcido y los títulos
// llevan un halo claro (glow). Los separadores repiten la foto en una franja
// horizontal, sin deformarla.
// ─────────────────────────────────────────────────────────────────────────

// Halo claro para que la tinta (texto oscuro) resalte sobre la foto.
const GLOW = "0 1px 2px #fbf4e8, 0 0 7px #fbf4e8, 0 0 12px #fbf4e8";
// Panel de papel translúcido donde se asienta el texto largo.
const PAPEL = "rgba(255,251,243,0.74)";

/** Tarjeta de sección con la FOTO de la disciplina de fondo (bien visible). */
export function LecturaCard({
  nom,
  txt,
  overlay,
  titulo,
  meta,
  accent,
  children,
}: {
  nom: string;
  txt: string;
  /** Velo TENUE sobre la foto (solo para unificar; la foto debe verse). */
  overlay: string;
  titulo?: string;
  meta?: string;
  /** Color de acento del borde/título (por defecto el color del texto). */
  accent?: string;
  children: React.ReactNode;
}) {
  const ac = accent ?? txt;
  return (
    <Box
      position="relative"
      borderRadius="xl"
      border={`1px solid ${ac}55`}
      mb={5}
      overflow="hidden"
      boxShadow="0 4px 18px rgba(0,0,0,0.14)"
    >
      {hasDisciplinaBg(nom) && <DisciplinaBgLayer nom={nom} borderRadius="xl" overlay={overlay} />}
      <Box position="relative" zIndex={1} p={{ base: 5, md: 6 }}>
        {titulo && (
          <Flex align="baseline" gap={2.5} mb={4} wrap="wrap" borderBottom={`1px solid ${ac}55`} pb={2.5}>
            <Text color={ac} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.02em"
                  style={{ textShadow: GLOW }}>
              {titulo}
            </Text>
            {meta && (
              <Text color={txt} fontSize="sm" fontStyle="italic" style={{ textShadow: GLOW }}>
                {meta}
              </Text>
            )}
          </Flex>
        )}
        {children}
      </Box>
    </Box>
  );
}

/** Pregunta (opcional) + respuesta de texto libre del usuario, sobre papel. */
export function QA({
  txt,
  pregunta,
  respuesta,
  vacio = "Sin respuesta.",
}: {
  txt: string;
  pregunta?: string;
  respuesta?: string | null;
  vacio?: string;
}) {
  const val = (respuesta ?? "").trim();
  return (
    <Box mb={4} _last={{ mb: 0 }}>
      {pregunta && (
        <Text color={txt} fontWeight="600" fontSize={{ base: "sm", md: "md" }} mb={1.5} style={{ textShadow: GLOW }}>
          {pregunta}
        </Text>
      )}
      {val ? (
        <Box bg={PAPEL} borderRadius="lg" px={{ base: 3.5, md: 4 }} py={{ base: 2.5, md: 3 }}>
          <Text color={txt} fontSize={{ base: "md", md: "lg" }} whiteSpace="pre-wrap" lineHeight="1.7">
            {val}
          </Text>
        </Box>
      ) : (
        <Text color={txt} opacity={0.55} fontStyle="italic" fontSize="sm" style={{ textShadow: GLOW }}>
          {vacio}
        </Text>
      )}
    </Box>
  );
}

/** Lista de ítems seleccionados por el usuario, como chips de papel. */
export function Chips({ txt, items, accent }: { txt: string; items: string[]; accent?: string }) {
  const ac = accent ?? txt;
  if (!items?.length) return null;
  return (
    <Flex wrap="wrap" gap={2}>
      {items.map((it, i) => (
        <Text
          key={`${it}-${i}`}
          color={txt}
          fontSize="sm"
          px={3}
          py={1}
          borderRadius="full"
          border={`1px solid ${ac}66`}
          bg={PAPEL}
        >
          {it}
        </Text>
      ))}
    </Flex>
  );
}

/** Subtítulo pequeño dentro de una tarjeta (etiqueta de un bloque). */
export function SubTitulo({ txt, children }: { txt: string; children: React.ReactNode }) {
  return (
    <Text color={txt} fontWeight="700" fontSize="sm" letterSpacing="0.04em" textTransform="uppercase" mb={2}
          style={{ textShadow: GLOW }}>
      {children}
    </Text>
  );
}

/** Separador horizontal que REPITE la foto de la disciplina sin deformarla
 *  (la escala a la altura de la franja y la repite en horizontal). */
export function LineaImagen({ img, txt }: { img?: string; txt: string }) {
  if (!img) {
    return <Box h="2px" my={5} bg={`${txt}55`} borderRadius="full" />;
  }
  return (
    <Box
      my={5}
      h={{ base: "30px", md: "38px" }}
      borderRadius="full"
      overflow="hidden"
      border={`1px solid ${txt}44`}
      boxShadow="0 2px 8px rgba(0,0,0,0.12)"
      bgImage={`url('${img}')`}
      bgRepeat="repeat-x"
      bgSize="auto 100%"
      bgPosition="left center"
    />
  );
}

/** Estado vacío elegante cuando el usuario aún no ha escrito nada. */
export function LecturaVacio({ txt, children }: { txt: string; children: React.ReactNode }) {
  return (
    <Box
      borderRadius="xl"
      border={`1px dashed ${txt}55`}
      bg={`${txt}0a`}
      p={{ base: 6, md: 8 }}
      textAlign="center"
    >
      <Text color={txt} fontStyle="italic" fontSize={{ base: "md", md: "lg" }}>
        {children}
      </Text>
    </Box>
  );
}
