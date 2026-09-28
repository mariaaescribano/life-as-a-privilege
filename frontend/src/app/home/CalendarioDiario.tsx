// ─────────────────────────────────────────────────────────────────────────────
// CALENDARIO DEL DIARIO — el mes con los días que tienen notas marcados.
//
// Lo usan las dos caras del diario de sesiones: la página /diario (la persona)
// y el panel /admin/diario/:userId (la admin). Cada día con notas lleva un
// puntito por disciplina, con su color; tocar un día lo selecciona y la página
// enseña SOLO las notas de ese día (dos días distintos nunca a la vez).
//
// Semana de lunes a domingo y fechas SIEMPRE en local (nada de toISOString,
// que en España retrocede un día por UTC).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { caraDeEntrada } from "./diarioCara";

/** Lo mínimo que el calendario necesita saber de una entrada. */
export interface DiaConNota {
  fecha: string; // «2026-09-28» (con o sin hora detrás)
  disciplina: string | null;
}

interface Props {
  entradas: DiaConNota[];
  /** Día seleccionado («2026-09-28») o null. */
  seleccionada: string | null;
  onSeleccionar: (iso: string) => void;
  locale?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");
const isoDe = (a: number, m: number, d: number) => `${a}-${pad(m + 1)}-${pad(d)}`;

/** «2026-09» del día seleccionado, o del actual si no hay o no vale. */
const mesInicial = (seleccionada: string | null): { a: number; m: number } => {
  if (seleccionada) {
    const [a, m] = seleccionada.slice(0, 10).split("-").map(Number);
    if (a && m) return { a, m: m - 1 };
  }
  const hoy = new Date();
  return { a: hoy.getFullYear(), m: hoy.getMonth() };
};

export default function CalendarioDiario({ entradas, seleccionada, onSeleccionar, locale = "es-ES" }: Props) {
  const [{ a, m }, setMes] = useState(mesInicial(seleccionada));

  // Si la selección cambia desde fuera (el campo de fecha del formulario, la
  // carga inicial), el calendario se va al mes de ese día.
  useEffect(() => {
    if (!seleccionada) return;
    const [na, nm] = seleccionada.slice(0, 10).split("-").map(Number);
    if (na && nm) setMes((prev) => (prev.a === na && prev.m === nm - 1 ? prev : { a: na, m: nm - 1 }));
  }, [seleccionada]);

  // Día → disciplinas con nota ese día (sin repetir), para pintar los puntitos.
  const marcas = useMemo(() => {
    const porDia = new Map<string, Set<string | null>>();
    for (const e of entradas) {
      const dia = (e.fecha ?? "").slice(0, 10);
      if (!dia) continue;
      if (!porDia.has(dia)) porDia.set(dia, new Set());
      porDia.get(dia)!.add(e.disciplina ?? null);
    }
    return porDia;
  }, [entradas]);

  // Lunes primero: la inicial de cada día, sacada del propio locale.
  const iniciales = useMemo(() => {
    const base = new Date(2024, 0, 1); // un lunes
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d.toLocaleDateString(locale, { weekday: "narrow" });
    });
  }, [locale]);

  const titulo = new Date(a, m, 1).toLocaleDateString(locale, { month: "long", year: "numeric" });
  const huecos = (new Date(a, m, 1).getDay() + 6) % 7; // getDay(): 0 = domingo
  const dias = new Date(a, m + 1, 0).getDate();

  const hoyLocal = new Date();
  const hoyIso = isoDe(hoyLocal.getFullYear(), hoyLocal.getMonth(), hoyLocal.getDate());
  const selIso = seleccionada?.slice(0, 10) ?? null;

  const cambiarMes = (paso: number) => {
    const f = new Date(a, m + paso, 1);
    setMes({ a: f.getFullYear(), m: f.getMonth() });
  };

  return (
    <Box
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 5 }}
      borderRadius="2xl"
      bg="rgba(255,255,255,0.07)"
      border="1px solid rgba(255,255,255,0.25)"
    >
      {/* mes y flechas */}
      <Flex align="center" justify="space-between" mb={3}>
        <FlechaMes onClick={() => cambiarMes(-1)} etiqueta="Mes anterior">←</FlechaMes>
        <Text
          color="white"
          fontWeight="700"
          fontSize={{ base: "md", md: "lg" }}
          letterSpacing="0.06em"
          textTransform="capitalize"
        >
          {titulo}
        </Text>
        <FlechaMes onClick={() => cambiarMes(1)} etiqueta="Mes siguiente">→</FlechaMes>
      </Flex>

      {/* iniciales de los días */}
      <Grid templateColumns="repeat(7, 1fr)" mb={1}>
        {iniciales.map((ini, i) => (
          <Text
            key={i}
            textAlign="center"
            color="rgba(255,255,255,0.55)"
            fontSize="xs"
            fontWeight="600"
            textTransform="uppercase"
          >
            {ini}
          </Text>
        ))}
      </Grid>

      {/* los días */}
      <Grid templateColumns="repeat(7, 1fr)" rowGap="2px">
        {Array.from({ length: huecos }).map((_, i) => (
          <Box key={`h${i}`} />
        ))}
        {Array.from({ length: dias }, (_, i) => {
          const dia = i + 1;
          const iso = isoDe(a, m, dia);
          const disciplinas = marcas.get(iso);
          const esHoy = iso === hoyIso;
          const activo = iso === selIso;
          return (
            <Flex
              key={iso}
              as="button"
              onClick={() => onSeleccionar(iso)}
              direction="column"
              align="center"
              justify="center"
              gap="3px"
              h={{ base: "42px", md: "46px" }}
              borderRadius="lg"
              cursor="pointer"
              bg={activo ? "rgba(255,255,255,0.18)" : "transparent"}
              border={
                activo
                  ? "1.5px solid rgba(255,255,255,0.85)"
                  : esHoy
                    ? "1px solid rgba(255,255,255,0.4)"
                    : "1px solid transparent"
              }
              transition="all 0.15s"
              _hover={{ bg: activo ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.1)" }}
              title={disciplinas ? "Hay notas este día" : undefined}
            >
              <Text
                color={disciplinas ? "white" : "rgba(255,255,255,0.6)"}
                fontSize="sm"
                fontWeight={disciplinas ? "700" : "500"}
                lineHeight="1"
              >
                {dia}
              </Text>
              {/* un puntito por disciplina con nota ese día (hasta tres) */}
              {disciplinas && (
                <Flex gap="3px">
                  {Array.from(disciplinas)
                    .slice(0, 3)
                    .map((key, j) => {
                      const cara = caraDeEntrada(key);
                      return (
                        <Box
                          key={j}
                          w="6px"
                          h="6px"
                          borderRadius="full"
                          bg={cara.txt}
                          style={{ boxShadow: `0 0 5px ${cara.txt}` }}
                        />
                      );
                    })}
                </Flex>
              )}
            </Flex>
          );
        })}
      </Grid>
    </Box>
  );
}

const FlechaMes = ({
  onClick,
  etiqueta,
  children,
}: {
  onClick: () => void;
  etiqueta: string;
  children: React.ReactNode;
}) => (
  <Flex
    as="button"
    onClick={onClick}
    aria-label={etiqueta}
    title={etiqueta}
    align="center"
    justify="center"
    w="34px"
    h="34px"
    borderRadius="full"
    bg="rgba(255,255,255,0.08)"
    border="1px solid rgba(255,255,255,0.35)"
    color="white"
    fontSize="md"
    cursor="pointer"
    transition="all 0.18s"
    _hover={{ bg: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.7)" }}
  >
    {children}
  </Flex>
);
