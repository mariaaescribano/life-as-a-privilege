import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";

// ─────────────────────────────────────────────────────────────────────────
// UI de SOLO LECTURA para el panel admin: el administrador solo lee lo que el
// propio usuario ha escrito en su recorrido (psicología, ayurveda…). Nada es
// editable. Cada tarjeta lleva de fondo la imagen de la disciplina (velo claro
// para legibilidad) y el texto en el color propio de la disciplina, para dar
// coherencia y elegancia a todas las páginas de lectura.
// ─────────────────────────────────────────────────────────────────────────

/** Tarjeta de sección con la imagen de la disciplina de fondo (atenuada). */
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
  /** Velo claro sobre la imagen para que el texto oscuro sea legible. */
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
      border={`1px solid ${ac}44`}
      mb={5}
      overflow="hidden"
      boxShadow="0 4px 18px rgba(0,0,0,0.10)"
    >
      {hasDisciplinaBg(nom) && <DisciplinaBgLayer nom={nom} borderRadius="xl" overlay={overlay} />}
      <Box position="relative" zIndex={1} p={{ base: 5, md: 6 }}>
        {titulo && (
          <Flex align="baseline" gap={2.5} mb={4} wrap="wrap" borderBottom={`1px solid ${ac}33`} pb={2.5}>
            <Text color={ac} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.02em">
              {titulo}
            </Text>
            {meta && (
              <Text color={txt} fontSize="sm" fontStyle="italic" opacity={0.65}>
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

/** Pregunta (opcional) + respuesta de texto libre del usuario. */
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
        <Text color={txt} fontWeight="600" fontSize={{ base: "sm", md: "md" }} mb={1.5} opacity={0.85}>
          {pregunta}
        </Text>
      )}
      {val ? (
        <Text color={txt} fontSize={{ base: "md", md: "lg" }} whiteSpace="pre-wrap" lineHeight="1.7">
          {val}
        </Text>
      ) : (
        <Text color={txt} opacity={0.4} fontStyle="italic" fontSize="sm">
          {vacio}
        </Text>
      )}
    </Box>
  );
}

/** Lista de ítems seleccionados por el usuario, como chips. */
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
          border={`1px solid ${ac}55`}
          bg={`${ac}12`}
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
    <Text color={txt} fontWeight="700" fontSize="sm" letterSpacing="0.04em" textTransform="uppercase" mb={2} opacity={0.7}>
      {children}
    </Text>
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
