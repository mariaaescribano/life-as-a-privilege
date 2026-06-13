import React, { useMemo, useState } from "react";
import { Box, Flex, Text, Select } from "@chakra-ui/react";
import type { Ejercicio } from "../../dtos/aprendizaje.type";

const VERDE = "#3fbf6f";
const ROJO = "#e06a6a";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Render interactivo de un test de curso (opción múltiple, verdadero/falso y
 * relacionar). Feedback inmediato: en cuanto el usuario responde, su respuesta
 * se colorea (verde acierto / rojo fallo) y se resalta la correcta. Sin botones:
 * se puede cambiar la respuesta libremente.
 */
export function CursoTest({ ejercicios, color }: { ejercicios: Ejercicio[]; color: string }) {
  const [answers, setAnswers] = useState<Record<number, any>>({});

  // Opciones de la derecha barajadas por cada ejercicio "relacionar".
  const derechas = useMemo(() => {
    const m: Record<number, string[]> = {};
    ejercicios.forEach((ej, i) => {
      if (ej.tipo === "relacionar") m[i] = shuffle(ej.pares.map((p) => p.derecha));
    });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ejercicios]);

  if (!ejercicios || ejercicios.length === 0) {
    return <Text color={color} fontStyle="italic" opacity={0.85}>Este test todavía no tiene ejercicios.</Text>;
  }

  return (
    <Flex direction="column" gap={{ base: 5, md: 6 }}>
      {ejercicios.map((ej, i) => {
        const answered = answers[i] !== undefined;
        return (
          <Box key={i}>
            <Text color={color} fontWeight="700" fontSize={{ base: "md", md: "lg" }} mb={3} lineHeight="1.4">
              {i + 1}. {ej.enunciado}
            </Text>

            {/* ── Opción múltiple ── */}
            {ej.tipo === "opcion" && (
              <Flex direction="column" gap={2}>
                {ej.opciones.map((op, oi) => {
                  const selected = answers[i] === oi;
                  const isCorrect = oi === ej.correcta;
                  let bd = `${color}44`, bgc = "rgba(255,255,255,0.05)";
                  if (answered && isCorrect) { bd = VERDE; bgc = "rgba(63,191,111,0.18)"; }
                  else if (answered && selected) { bd = ROJO; bgc = "rgba(224,106,106,0.18)"; }
                  return (
                    <Box as="button" key={oi} type="button" textAlign="left"
                      onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                      cursor="pointer"
                      border={`1.5px solid ${bd}`} bg={bgc} color={color}
                      borderRadius="lg" px={4} py={2.5} transition="all 0.15s"
                      _hover={{ borderColor: color }}>
                      {op}
                    </Box>
                  );
                })}
              </Flex>
            )}

            {/* ── Verdadero / Falso ── */}
            {ej.tipo === "verdadero" && (
              <Flex gap={3}>
                {[{ v: true, label: "Verdadero" }, { v: false, label: "Falso" }].map(({ v, label }) => {
                  const selected = answers[i] === v;
                  const isCorrect = ej.correcta === v;
                  let bd = `${color}44`, bgc = "rgba(255,255,255,0.05)";
                  if (answered && isCorrect) { bd = VERDE; bgc = "rgba(63,191,111,0.18)"; }
                  else if (answered && selected) { bd = ROJO; bgc = "rgba(224,106,106,0.18)"; }
                  return (
                    <Box as="button" key={label} type="button" flex="1"
                      onClick={() => setAnswers((a) => ({ ...a, [i]: v }))}
                      cursor="pointer"
                      border={`1.5px solid ${bd}`} bg={bgc} color={color}
                      borderRadius="lg" px={4} py={2.5} fontWeight="600" textAlign="center"
                      transition="all 0.15s" _hover={{ borderColor: color }}>
                      {label}
                    </Box>
                  );
                })}
              </Flex>
            )}

            {/* ── Relacionar ── */}
            {ej.tipo === "relacionar" && (
              <Flex direction="column" gap={2.5}>
                {ej.pares.map((p, li) => {
                  const sel = (answers[i] ?? {})[li] ?? "";
                  const done = sel !== "";
                  const ok = done && sel === p.derecha;
                  const bad = done && sel !== p.derecha;
                  return (
                    <Flex key={li} gap={3} align="center">
                      <Text flex="1" minW={0} color={color} fontSize={{ base: "sm", md: "md" }}>{p.izquierda}</Text>
                      <Box color={color} opacity={0.6}>→</Box>
                      <Select flex="1" value={sel} size="sm" borderRadius="lg"
                        bg="rgba(255,255,255,0.1)" color={color}
                        borderColor={ok ? VERDE : bad ? ROJO : `${color}55`}
                        onChange={(e) => setAnswers((a) => ({ ...a, [i]: { ...(a[i] ?? {}), [li]: e.target.value } }))}
                        sx={{ option: { color: "black" } }}>
                        <option value="" disabled>Elige…</option>
                        {(derechas[i] ?? []).map((d, di) => <option key={di} value={d}>{d}</option>)}
                      </Select>
                      {done && <Text color={ok ? VERDE : ROJO} fontWeight="700" w="16px" textAlign="center">{ok ? "✓" : "✗"}</Text>}
                    </Flex>
                  );
                })}
              </Flex>
            )}
          </Box>
        );
      })}
    </Flex>
  );
}

export default CursoTest;
