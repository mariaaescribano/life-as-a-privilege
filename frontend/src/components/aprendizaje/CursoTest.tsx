import React, { useMemo, useState } from "react";
import { Box, Flex, Text, Select } from "@chakra-ui/react";
import type { Ejercicio } from "../../dtos/aprendizaje.type";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../global/DisciplinaBgLayer";

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
 * relacionar). Feedback inmediato: al responder, la respuesta se colorea
 * (verde acierto / rojo fallo) y se resalta la correcta.
 *
 * Es UN solo box (el contenedor exterior) dividido en secciones por una línea
 * fina. La foto de la disciplina se pinta por sección (altura acotada → no se
 * deforma); se repite, pero las secciones van pegadas para que parezca un único
 * box continuo.
 */
export function CursoTest({
  ejercicios,
  color,
  disciplinaNom,
  bgColor,
}: {
  ejercicios: Ejercicio[];
  color: string;
  disciplinaNom: string;
  bgColor: string;
}) {
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
    return (
      <Box px={{ base: 5, md: 8 }} py={{ base: 6, md: 7 }}>
        <Text color={color} fontStyle="italic" opacity={0.85}>Este test todavía no tiene ejercicios.</Text>
      </Box>
    );
  }

  const hasBg = hasDisciplinaBg(disciplinaNom);
  // Sombra del texto con el color de fondo, para que se lea sobre la foto.
  const tsh = `0 1px 4px ${bgColor}, 0 0 10px ${bgColor}, 0 0 20px ${bgColor}`;
  // Fondo por defecto de cada opción: tinte del color de la disciplina (en vez
  // de blanco) para que el box destaque más sobre la foto de fondo.
  const OPT_BG = `${color}2b`;

  return (
    <Flex direction="column">
      {ejercicios.map((ej, i) => {
        const answered = answers[i] !== undefined;
        return (
          <React.Fragment key={i}>
            {/* Línea fina y discreta de división entre secciones */}
            {i > 0 && <Box h="1px" bg={`${color}33`} />}

            {/* Sección de la pregunta (a todo el ancho, con la foto de fondo).
                La foto va sin redondear; el box exterior (overflow hidden +
                borderRadius) redondea solo arriba de la primera y abajo de la última. */}
            <Box position="relative" overflow="hidden">
              {hasBg && <DisciplinaBgLayer nom={disciplinaNom} borderRadius={0} />}
              <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>
                <Text color={color} fontWeight="700" fontSize={{ base: "md", md: "lg" }} mb={3} lineHeight="1.4" style={{ textShadow: tsh }}>
                  {i + 1}. {ej.enunciado}
                </Text>

                {/* ── Opción múltiple ── */}
                {ej.tipo === "opcion" && (
                  <Flex direction="column" gap={2}>
                    {ej.opciones.map((op, oi) => {
                      const selected = answers[i] === oi;
                      const isCorrect = oi === ej.correcta;
                      let bd = `${color}66`, bgc = OPT_BG;
                      if (answered && isCorrect) { bd = VERDE; bgc = "rgba(63,191,111,0.28)"; }
                      else if (answered && selected) { bd = ROJO; bgc = "rgba(224,106,106,0.28)"; }
                      return (
                        <Box as="button" key={oi} type="button" textAlign="left"
                          onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                          cursor="pointer"
                          border={`1.5px solid ${bd}`} bg={bgc} color={color}
                          borderRadius="lg" px={4} py={2.5} transition="all 0.15s"
                          style={{ textShadow: tsh }}
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
                      let bd = `${color}66`, bgc = OPT_BG;
                      if (answered && isCorrect) { bd = VERDE; bgc = "rgba(63,191,111,0.28)"; }
                      else if (answered && selected) { bd = ROJO; bgc = "rgba(224,106,106,0.28)"; }
                      return (
                        <Box as="button" key={label} type="button" flex="1"
                          onClick={() => setAnswers((a) => ({ ...a, [i]: v }))}
                          cursor="pointer"
                          border={`1.5px solid ${bd}`} bg={bgc} color={color}
                          borderRadius="lg" px={4} py={2.5} fontWeight="600" textAlign="center"
                          transition="all 0.15s" style={{ textShadow: tsh }}
                          _hover={{ borderColor: color }}>
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
                          <Text flex="1" minW={0} color={color} fontSize={{ base: "sm", md: "md" }} style={{ textShadow: tsh }}>{p.izquierda}</Text>
                          <Box color={color} opacity={0.6}>→</Box>
                          <Select flex="1" value={sel} size="sm" borderRadius="lg"
                            bg={OPT_BG} color={color}
                            borderColor={ok ? VERDE : bad ? ROJO : `${color}66`}
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
            </Box>
          </React.Fragment>
        );
      })}
    </Flex>
  );
}

export default CursoTest;
