import React from "react";
import { Box, Flex, Text, Input, Textarea, Select } from "@chakra-ui/react";
import type { Ejercicio } from "../../dtos/aprendizaje.type";

const field = {
  bg: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.25)",
  _placeholder: { color: "rgba(255,255,255,0.45)" },
} as const;

const miniBtn = {
  fontFamily: "'EB Garamond', serif", fontWeight: 700, letterSpacing: "0.04em",
  borderRadius: "full", cursor: "pointer", transition: "all 0.2s",
} as const;

/** Crea un ejercicio por defecto del tipo pedido, conservando el enunciado. */
function nuevoEjercicio(tipo: Ejercicio["tipo"], enunciado = ""): Ejercicio {
  if (tipo === "verdadero") return { tipo, enunciado, correcta: true };
  if (tipo === "relacionar") return { tipo, enunciado, pares: [{ izquierda: "", derecha: "" }] };
  return { tipo: "opcion", enunciado, opciones: ["", ""], correcta: 0 };
}

/** Editor de los ejercicios de una lección de tipo 'test' (para AdminCursoEditor). */
export function CursoTestEditor({
  ejercicios,
  onChange,
}: {
  ejercicios: Ejercicio[];
  onChange: (e: Ejercicio[]) => void;
}) {
  const list = ejercicios ?? [];
  const upd = (i: number, ej: Ejercicio) => onChange(list.map((e, j) => (j === i ? ej : e)));
  const add = () => onChange([...list, nuevoEjercicio("opcion")]);
  const del = (i: number) => onChange(list.filter((_, j) => j !== i));

  return (
    <Box>
      <Text fontSize="xs" mb={2} opacity={0.7}>Ejercicios del test</Text>

      <Flex direction="column" gap={4}>
        {list.map((ej, i) => (
          <Box key={i} bg="rgba(0,0,0,0.18)" border="1px solid rgba(255,255,255,0.14)" borderRadius="lg" p={4}>
            <Flex gap={3} align="center" mb={3} flexWrap="wrap">
              <Text fontSize="sm" fontWeight="700">#{i + 1}</Text>
              <Select value={ej.tipo} w="180px" size="sm" {...field} sx={{ option: { color: "black" } }}
                onChange={(e) => upd(i, nuevoEjercicio(e.target.value as Ejercicio["tipo"], ej.enunciado))}>
                <option value="opcion">Opción múltiple</option>
                <option value="verdadero">Verdadero / Falso</option>
                <option value="relacionar">Relacionar</option>
              </Select>
              <Box as="button" type="button" onClick={() => del(i)} {...miniBtn} px={3} py="5px" fontSize="xs" ml="auto"
                border="1px solid rgba(255,255,255,0.3)" _hover={{ borderColor: "#ff8a8a", color: "#ff8a8a" }}>
                ✕
              </Box>
            </Flex>

            <Textarea value={ej.enunciado} rows={2} mb={3} placeholder="Enunciado de la pregunta" {...field}
              onChange={(e) => upd(i, { ...ej, enunciado: e.target.value })} />

            {/* ── Opción múltiple ── */}
            {ej.tipo === "opcion" && (
              <Box>
                <Text fontSize="xs" opacity={0.7} mb={2}>Opciones (marca el círculo de la correcta)</Text>
                <Flex direction="column" gap={2}>
                  {ej.opciones.map((op, oi) => (
                    <Flex key={oi} gap={2} align="center">
                      <Box as="button" type="button" title="Marcar como correcta"
                        onClick={() => upd(i, { ...ej, correcta: oi })}
                        w="20px" h="20px" borderRadius="full" flexShrink={0} cursor="pointer"
                        border={`2px solid ${ej.correcta === oi ? "#3fbf6f" : "rgba(255,255,255,0.4)"}`}
                        bg={ej.correcta === oi ? "#3fbf6f" : "transparent"} />
                      <Input value={op} size="sm" {...field} placeholder={`Opción ${oi + 1}`}
                        onChange={(e) => upd(i, { ...ej, opciones: ej.opciones.map((o, k) => (k === oi ? e.target.value : o)) })} />
                      <Box as="button" type="button" flexShrink={0}
                        onClick={() => {
                          const opciones = ej.opciones.filter((_, k) => k !== oi);
                          const correcta = ej.correcta >= opciones.length ? Math.max(0, opciones.length - 1) : ej.correcta;
                          upd(i, { ...ej, opciones, correcta });
                        }}
                        {...miniBtn} px={2} py="3px" fontSize="xs" border="1px solid rgba(255,255,255,0.25)"
                        _hover={{ borderColor: "#ff8a8a", color: "#ff8a8a" }}>✕</Box>
                    </Flex>
                  ))}
                </Flex>
                <Box as="button" type="button" onClick={() => upd(i, { ...ej, opciones: [...ej.opciones, ""] })}
                  {...miniBtn} mt={2} px={3} py="5px" fontSize="xs" border="1px dashed rgba(255,255,255,0.4)"
                  _hover={{ bg: "rgba(255,255,255,0.08)" }}>+ Opción</Box>
              </Box>
            )}

            {/* ── Verdadero / Falso ── */}
            {ej.tipo === "verdadero" && (
              <Flex align="center" gap={3}>
                <Text fontSize="sm" opacity={0.8}>Respuesta correcta:</Text>
                <Select value={ej.correcta ? "true" : "false"} w="140px" size="sm" {...field} sx={{ option: { color: "black" } }}
                  onChange={(e) => upd(i, { ...ej, correcta: e.target.value === "true" })}>
                  <option value="true">Verdadero</option>
                  <option value="false">Falso</option>
                </Select>
              </Flex>
            )}

            {/* ── Relacionar ── */}
            {ej.tipo === "relacionar" && (
              <Box>
                <Text fontSize="xs" opacity={0.7} mb={2}>Parejas (izquierda ↔ derecha). El orden de la derecha se baraja al usuario.</Text>
                <Flex direction="column" gap={2}>
                  {ej.pares.map((p, pi) => (
                    <Flex key={pi} gap={2} align="center">
                      <Input value={p.izquierda} size="sm" {...field} placeholder="Izquierda"
                        onChange={(e) => upd(i, { ...ej, pares: ej.pares.map((x, k) => (k === pi ? { ...x, izquierda: e.target.value } : x)) })} />
                      <Box opacity={0.6} flexShrink={0}>↔</Box>
                      <Input value={p.derecha} size="sm" {...field} placeholder="Derecha"
                        onChange={(e) => upd(i, { ...ej, pares: ej.pares.map((x, k) => (k === pi ? { ...x, derecha: e.target.value } : x)) })} />
                      <Box as="button" type="button" flexShrink={0}
                        onClick={() => upd(i, { ...ej, pares: ej.pares.filter((_, k) => k !== pi) })}
                        {...miniBtn} px={2} py="3px" fontSize="xs" border="1px solid rgba(255,255,255,0.25)"
                        _hover={{ borderColor: "#ff8a8a", color: "#ff8a8a" }}>✕</Box>
                    </Flex>
                  ))}
                </Flex>
                <Box as="button" type="button" onClick={() => upd(i, { ...ej, pares: [...ej.pares, { izquierda: "", derecha: "" }] })}
                  {...miniBtn} mt={2} px={3} py="5px" fontSize="xs" border="1px dashed rgba(255,255,255,0.4)"
                  _hover={{ bg: "rgba(255,255,255,0.08)" }}>+ Pareja</Box>
              </Box>
            )}
          </Box>
        ))}
      </Flex>

      {list.length === 0 && (
        <Text opacity={0.6} fontStyle="italic" fontSize="sm" mt={1} mb={1}>Sin ejercicios todavía.</Text>
      )}

      <Box as="button" type="button" onClick={add}
        {...miniBtn} mt={3} px={4} py="7px" fontSize="sm" border="1px dashed rgba(255,255,255,0.4)"
        _hover={{ bg: "rgba(255,255,255,0.08)" }}>+ Ejercicio</Box>
    </Box>
  );
}

export default CursoTestEditor;
