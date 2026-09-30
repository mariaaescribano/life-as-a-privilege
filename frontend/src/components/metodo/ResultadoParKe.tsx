// ─────────────────────────────────────────────────────────────────────────
// TU PAR DE CONTROL · el resultado, dentro del Diagnóstico final (paso 5).
//
// El par y su sentido salen SOLO de los cuestionarios de los cinco elementos
// (`parCandidato`). El test de seis frases de Los ciclos, que decía si el
// desajuste se vivía como un vaivén, se quitó de la página (aparcado en
// TestParKe.tsx), así que aquí ya no hay «confirmado / sin confirmar»:
//
//   · con par  → quién empuja, quién cede y su mecanismo.
//   · sin par  → ninguna relación de control destaca sobre las otras.
//
// El mecanismo (乘 agresión / 侮 contradominación) es el del Su Wen 67; ver la
// cabecera de tcmCicloKe.ts.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ELEMENTOS, type DatosTcm } from "./tcmRecorrido";
import { resultadoPar } from "./tcmCicloKe";
import { ICONO_ELEMENTO } from "./tcmElementosContenido";
import { RevealStagger, RevealItem, Breathe } from "../global/Reveal";

export function ResultadoParKe({ data, color }: { data: DatosTcm; color: string }) {
  const res = resultadoPar(data);

  if (!res) {
    return (
      <Bloque color={color}>
        <RevealItem direction="up" distance={16}>
        <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" textAlign="center">
          Ninguna de las cinco relaciones de control destaca hoy sobre las otras: tus
          elementos se frenan entre sí de forma bastante pareja. No es poca cosa — es
          justo lo que el ciclo Ke busca.
        </Text>
        </RevealItem>
      </Bloque>
    );
  }

  const { par, sentido } = res.candidato;
  // En 乘 (agresión) empuja el que controla; en 侮 (contradominación) se revuelve
  // el controlado, así que la flecha se lee al revés.
  const empuja = sentido === "cheng" ? par.origen : par.destino;
  const cede = sentido === "cheng" ? par.destino : par.origen;
  const mecanismo = sentido === "cheng"
    ? { hanzi: "相乘", pinyin: "xiāng chéng", nombre: "agresión", frase: par.cheng }
    : { hanzi: "相侮", pinyin: "xiāng wǔ", nombre: "contradominación", frase: par.wu };

  return (
    <Bloque color={color}>
      {/* Quién empuja y quién cede: la flecha late (empuja) y cada cara respira
          a su ritmo. */}
      <RevealItem direction="up" distance={18} scaleFrom={0.96}>
      <Flex align="center" justify="center" gap={{ base: 3, md: 5 }} flexWrap="wrap">
        <Cara el={empuja} color={color} pie="empuja" fase={0} />
        <Breathe scale={0.16} duration={1.8}>
          <Text color={color} fontSize={{ base: "2xl", md: "4xl" }} lineHeight="1">→</Text>
        </Breathe>
        <Cara el={cede} color={color} pie="cede" fase={0.9} />
      </Flex>
      </RevealItem>

      <RevealItem direction="up" distance={14}>
      <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center">
        {par.organos}
        {par.patron && ` · ${par.patron.hanzi} ${par.patron.pinyin}`}
      </Text>
      </RevealItem>

      {/* El mecanismo, con su nombre clásico. */}
      <RevealItem direction="up" distance={14}>
      <Text color={color} fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.16em" textTransform="uppercase"
            textAlign="center" fontWeight="700">
        {mecanismo.hanzi} {mecanismo.pinyin} · {mecanismo.nombre}
      </Text>
      </RevealItem>

      <RevealItem direction="up" distance={14}>
      <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" textAlign="center" maxW="620px" mx="auto">
        {mecanismo.frase}
      </Text>
      </RevealItem>

      {/* Lo somático: se LEE. No ha puntuado nada y no diagnostica nada. */}
      {par.somaticos.length > 0 && (
        <RevealItem direction="up" distance={14} w="100%">
        <Box w="100%" maxW="620px" mx="auto">
          <Text color={color} fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.14em"
                textTransform="uppercase" fontWeight="700" mb={2} textAlign="center">
            Lo que suele acompañar
          </Text>
          <Flex direction="column" gap={1}>
            {par.somaticos.map((s) => (
              <Text key={s} color="rgba(255,255,255,0.8)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
                — {s}
              </Text>
            ))}
          </Flex>
          <Text color="rgba(255,255,255,0.55)" fontSize="xs" fontStyle="italic" mt={3} lineHeight="1.6"
                textAlign="center">
            Esta lista no se ha puntuado ni decide nada: está aquí para que la reconozcas, no
            para diagnosticarte. Si algo de esto te pasa y te preocupa, eso lo mira quien pueda
            explorarte.
          </Text>
        </Box>
        </RevealItem>
      )}
    </Bloque>
  );
}

// ── Piezas ────────────────────────────────────────────────────────────────
function Bloque({ children, color }: { children: React.ReactNode; color: string }) {
  // Cascada al asomar en pantalla (el box va bajo el pliegue). Contenedor corto,
  // así que el disparo por `inView` es seguro.
  return (
    <RevealStagger inView amount={0.15} stagger={0.13} delayChildren={0.1}
                   display="flex" flexDirection="column" gap={4} w="100%" alignItems="center">
      <RevealItem direction="up" distance={12}>
      <Text color={color} fontSize={{ base: "lg", md: "xl" }} fontWeight="800" letterSpacing="0.16em"
            textTransform="uppercase" textAlign="center">
        Tu par de control
      </Text>
      </RevealItem>
      {children}
    </RevealStagger>
  );
}

function Cara({ el, color, pie, fase = 0 }: { el: keyof typeof ICONO_ELEMENTO; color: string; pie: string; fase?: number }) {
  return (
    <Flex direction="column" align="center" gap={1.5}>
      {/* El icono respira, cada cara a su ritmo (`fase`), con el halo de su elemento. */}
      <Breathe scale={0.05} duration={3.4} delay={fase}>
      <Box
        w={{ base: "62px", md: "80px" }}
        h={{ base: "62px", md: "80px" }}
        borderRadius="full"
        overflow="hidden"
        border={`1px solid ${color}aa`}
        boxShadow={`0 0 16px ${ELEMENTOS[el].color}66`}
        backgroundImage={`url('${ICONO_ELEMENTO[el]}')`}
        backgroundSize="cover"
        backgroundPosition="center"
      />
      </Breathe>
      <Text color={color} fontSize={{ base: "sm", md: "md" }} fontWeight="700" letterSpacing="0.1em"
            textTransform="uppercase">
        {ELEMENTOS[el].nombre}
      </Text>
      <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic">{pie}</Text>
    </Flex>
  );
}
