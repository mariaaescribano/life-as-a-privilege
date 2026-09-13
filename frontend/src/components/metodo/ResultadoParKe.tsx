// ─────────────────────────────────────────────────────────────────────────
// TU PAR DE CONTROL · el resultado, dentro del Diagnóstico final (paso 5).
//
// El par y su sentido salen de los cuestionarios de los cinco elementos; el
// test de seis frases de Los ciclos solo dice si ese desajuste se VIVE como un
// vaivén. Por eso aquí hay tres finales posibles, y los tres son un resultado:
//
//   · confirmado   → el par tira, y además lo notas de un lado al otro.
//   · sin confirmar → los números ven la diferencia, pero tú no la vives como
//                     balanceo. Se dice tal cual, no se maquilla.
//   · sin par      → ninguna relación de control destaca sobre las otras.
//
// El mecanismo (乘 agresión / 侮 contradominación) es el del Su Wen 67; ver la
// cabecera de tcmCicloKe.ts.
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { ELEMENTOS, type DatosTcm } from "./tcmRecorrido";
import { resultadoPar } from "./tcmCicloKe";
import { ICONO_ELEMENTO } from "./tcmElementosContenido";

export function ResultadoParKe({ data, color }: { data: DatosTcm; color: string }) {
  const res = resultadoPar(data);

  if (!res) {
    return (
      <Bloque color={color}>
        <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" textAlign="center">
          Ninguna de las cinco relaciones de control destaca hoy sobre las otras: tus
          elementos se frenan entre sí de forma bastante pareja. No es poca cosa — es
          justo lo que el ciclo Ke busca.
        </Text>
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
      {/* Quién empuja y quién cede. */}
      <Flex align="center" justify="center" gap={{ base: 3, md: 5 }} flexWrap="wrap">
        <Cara el={empuja} color={color} pie="empuja" />
        <Text color={color} fontSize={{ base: "2xl", md: "4xl" }} lineHeight="1">→</Text>
        <Cara el={cede} color={color} pie="cede" />
      </Flex>

      <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center">
        {par.organos}
        {par.patron && ` · ${par.patron.hanzi} ${par.patron.pinyin}`}
      </Text>

      {/* El mecanismo, con su nombre clásico. */}
      <Text color={color} fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.16em" textTransform="uppercase"
            textAlign="center" fontWeight="700">
        {mecanismo.hanzi} {mecanismo.pinyin} · {mecanismo.nombre}
      </Text>

      <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" textAlign="center" maxW="620px" mx="auto">
        {mecanismo.frase}
      </Text>

      {/* Qué dijo el test de las seis frases. */}
      {res.confirmado ? (
        <Text color="white" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" textAlign="center" maxW="620px" mx="auto">
          Y tus respuestas lo confirman: lo vives como un vaivén de un lado al otro, no como
          un estado fijo. Ahí está el trabajo — no en elegir uno de los dos polos, sino en que
          dejen de turnarse.
        </Text>
      ) : (
        <Text color="rgba(255,255,255,0.82)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
              textAlign="center" maxW="620px" mx="auto" fontStyle="italic">
          Aunque tus respuestas dicen que NO lo vives como un vaivén entre los dos. La
          diferencia está en los números, pero no en cómo te sientes: puede ser un desajuste
          reciente, o de un solo lado. Merece la pena mirarlo, no darlo por hecho.
        </Text>
      )}

      {/* Lo somático: se LEE. No ha puntuado nada y no diagnostica nada. */}
      {par.somaticos.length > 0 && (
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
      )}
    </Bloque>
  );
}

// ── Piezas ────────────────────────────────────────────────────────────────
function Bloque({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <Flex direction="column" gap={4} w="100%" align="center">
      <Text color={color} fontSize={{ base: "lg", md: "xl" }} fontWeight="800" letterSpacing="0.16em"
            textTransform="uppercase" textAlign="center">
        Tu par de control
      </Text>
      {children}
    </Flex>
  );
}

function Cara({ el, color, pie }: { el: keyof typeof ICONO_ELEMENTO; color: string; pie: string }) {
  return (
    <Flex direction="column" align="center" gap={1.5}>
      <Box
        w={{ base: "62px", md: "80px" }}
        h={{ base: "62px", md: "80px" }}
        borderRadius="full"
        overflow="hidden"
        border={`1px solid ${color}aa`}
        backgroundImage={`url('${ICONO_ELEMENTO[el]}')`}
        backgroundSize="cover"
        backgroundPosition="center"
      />
      <Text color={color} fontSize={{ base: "sm", md: "md" }} fontWeight="700" letterSpacing="0.1em"
            textTransform="uppercase">
        {ELEMENTOS[el].nombre}
      </Text>
      <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic">{pie}</Text>
    </Flex>
  );
}
