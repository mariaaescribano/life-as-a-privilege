// ─────────────────────────────────────────────────────────────────────────
// EL MAPA DE LA FAMILIA · componente común a las dos páginas que lo usan:
//   · «Tu familia» (paso 6)  → compone la familia y elige personaje/animal.
//   · «Genograma»  (paso 7)  → el mismo mapa, con la ficha escrita de cada uno.
//
// Aquí vive TODO el dibujo del mapa (rejilla, tarjetas, conectores y los «+»
// para seguir colocando gente). Las páginas solo deciden qué pasa al tocar una
// tarjeta (su popup) y qué se guarda. Si cambias la geometría, cámbiala aquí:
// las dos páginas se ven igual por construcción.
//
// La usuaria ocupa SIEMPRE el centro (0,0) con su foto de perfil y la etiqueta
// «Tú»; el resto son PersonaGenograma con su posición relativa (fila, col).
// ─────────────────────────────────────────────────────────────────────────
import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { simboloSrc, useSimbolosFamilia } from "./familiaSimbolos";
import {
  ocupacionFamilia,
  personaEscritas,
  personaLabel,
  personaSimbolos,
  posKeyFamilia,
  type PersonaGenograma,
} from "./psicologiaRecorrido";
import { useGenograma, useGenogramaPreguntas } from "./psicologiaRecorrido.en";
import { glowPanel, azulBorde, scrollAcuarela } from "./psicologiaGlow";
import { neuropsicologiaBg, neuropsicologiaNom, neuropsicologiaTxt } from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt; // #5e2d10 — marrón tinta
const PAPEL = "#fbf4e8";          // crema claro
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

// Geometría de la rejilla. Los conectores se dibujan sobre estos huecos, así que
// los cuatro valores van siempre juntos.
const CELDA = { base: "88px", md: "112px" };
const HUECO_X = { base: 5, md: 7 };   // tokens de Chakra (1 = 4px) → 20 / 28 px
const HUECO_Y = { base: 8, md: 10 };  // → 32 / 40 px
const HUECO_X_PX = { base: 20, md: 28 };
const HUECO_Y_PX = { base: 32, md: 40 };

export type DirFamilia = "arriba" | "abajo" | "izq" | "der";

/** Icono «+» de los botones que rodean cada tarjeta. */
const MasIcon = ({ size = 13 }: { size?: number }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={`${size}px`} h={`${size}px`} fill="currentColor" flexShrink={0}>
    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
  </Box>
);

export function GenogramaMapa({
  personas, miFoto, onAbrir, onAñadir, mostrarProgreso = false,
}: {
  personas: PersonaGenograma[];
  /** Foto de perfil de la usuaria (el centro del mapa). */
  miFoto: string;
  onAbrir: (p: PersonaGenograma) => void;
  onAñadir: (desdeFila: number, desdeCol: number, dir: DirFamilia) => void;
  /** Pinta el «3/9» de lo escrito en la ficha (solo lo usa el Genograma). */
  mostrarProgreso?: boolean;
}) {
  const ocupado = ocupacionFamilia(personas);

  const filas = [0, ...personas.map((p) => p.fila)];
  const cols = [0, ...personas.map((p) => p.col)];
  const minFila = Math.min(...filas);
  const maxFila = Math.max(...filas);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);
  const nCols = maxCol - minCol + 1;

  const celdas: { fila: number; col: number; quien: PersonaGenograma | "yo" }[] = [];
  for (let f = minFila; f <= maxFila; f++) {
    for (let c = minCol; c <= maxCol; c++) {
      const quien = ocupado.get(posKeyFamilia(f, c));
      if (quien) celdas.push({ fila: f, col: c, quien });
    }
  }

  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" border={azulBorde} boxShadow={glowPanel}>
      <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />

      {/* El mapa crece a lo ancho: se desplaza DENTRO de su caja, la página
          nunca hace scroll horizontal. */}
      <Box position="relative" zIndex={1} overflowX="auto" overflowY="hidden"
           px={{ base: 6, md: 12 }} py={{ base: 10, md: 14 }}
           sx={scrollAcuarela(TINTA)}>
        <Box display="grid" mx="auto" w="fit-content"
             gridTemplateColumns={{ base: `repeat(${nCols}, ${CELDA.base})`, md: `repeat(${nCols}, ${CELDA.md})` }}
             columnGap={HUECO_X} rowGap={HUECO_Y}>
          {celdas.map(({ fila, col, quien }) => (
            <Celda
              key={posKeyFamilia(fila, col)}
              gridColumn={col - minCol + 1}
              gridRow={fila - minFila + 1}
              quien={quien}
              miFoto={miFoto}
              mostrarProgreso={mostrarProgreso}
              // Conectores: solo si de verdad hay alguien encima o al lado, para
              // que el árbol se lea como un árbol.
              lineaArriba={ocupado.has(posKeyFamilia(fila - 1, col))}
              lineaIzquierda={ocupado.has(posKeyFamilia(fila, col - 1))}
              onAbrir={() => { if (quien !== "yo") onAbrir(quien); }}
              onAñadir={(dir) => onAñadir(fila, col, dir)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Una casilla: la propia usuaria («Tú») o un familiar, con sus cuatro «+»
// alrededor para seguir colocando gente desde ahí.
// ─────────────────────────────────────────────────────────────────────────
function Celda({
  gridColumn, gridRow, quien, miFoto, lineaArriba, lineaIzquierda, mostrarProgreso, onAbrir, onAñadir,
}: {
  gridColumn: number;
  gridRow: number;
  quien: PersonaGenograma | "yo";
  miFoto: string;
  lineaArriba: boolean;
  lineaIzquierda: boolean;
  mostrarProgreso: boolean;
  onAbrir: () => void;
  onAñadir: (dir: DirFamilia) => void;
}) {
  const genograma = useGenograma();
  const genogramaPreguntas = useGenogramaPreguntas();
  const esYo = quien === "yo";
  const p = esYo ? null : (quien as PersonaGenograma);
  const nombre = esYo ? genograma.yo : personaLabel(p!);
  const foto = esYo ? miFoto : p!.foto;
  const simbolos = p ? personaSimbolos(p) : [];
  const escritas = p ? personaEscritas(p) : 0;

  return (
    <Box position="relative" gridColumn={gridColumn} gridRow={gridRow}
         display="flex" flexDirection="column" alignItems="center">

      {/* Conectores (cruzan el hueco de la rejilla) */}
      {lineaArriba && (
        <Box position="absolute" left="50%" transform="translateX(-50%)" w="1.5px" bg={`${TINTA}80`}
             top={{ base: `-${HUECO_Y_PX.base}px`, md: `-${HUECO_Y_PX.md}px` }}
             h={{ base: `${HUECO_Y_PX.base}px`, md: `${HUECO_Y_PX.md}px` }} />
      )}
      {lineaIzquierda && (
        <Box position="absolute" top={{ base: "32px", md: "42px" }} h="1.5px" bg={`${TINTA}80`}
             left={{ base: `-${HUECO_X_PX.base}px`, md: `-${HUECO_X_PX.md}px` }}
             w={{ base: `${HUECO_X_PX.base}px`, md: `${HUECO_X_PX.md}px` }} />
      )}

      {/* Tarjeta */}
      <Box as={esYo ? "div" : "button"} onClick={esYo ? undefined : onAbrir}
           display="flex" flexDirection="column" alignItems="center" gap={1.5}
           cursor={esYo ? "default" : "pointer"} transition="transform 0.16s, filter 0.16s"
           _hover={esYo ? {} : { transform: "translateY(-2px)", filter: "brightness(1.05)" }}>
        <Box position="relative" w={{ base: "64px", md: "84px" }} h={{ base: "64px", md: "84px" }} flexShrink={0}>
          <Box w="100%" h="100%" borderRadius="full" overflow="hidden"
               border={esYo ? `2.5px solid ${TINTA}` : `1.5px solid ${TINTA}88`}
               bg="rgba(255,251,243,0.82)"
               boxShadow={esYo ? `0 0 0 4px ${TINTA}22, 0 4px 16px ${TINTA}44` : `0 3px 12px ${TINTA}33`}>
            {foto ? (
              <Image src={foto} alt={nombre} w="100%" h="100%" objectFit="cover" />
            ) : (
              <Flex w="100%" h="100%" align="center" justify="center">
                <Text color={`${TINTA}99`} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1">
                  {(nombre.trim()[0] || "?").toUpperCase()}
                </Text>
              </Flex>
            )}
          </Box>

          {/* Personaje/animal asociado (hasta dos): pegados a la foto, como si
              esa persona «fuera» también esa imagen. */}
          {simbolos.map((key, i) => (
            <Box key={key} position="absolute" bottom="-4px"
                 right={i === 0 ? "-6px" : undefined} left={i === 1 ? "-6px" : undefined}
                 w={{ base: "26px", md: "32px" }} h={{ base: "26px", md: "32px" }}
                 borderRadius="full" overflow="hidden" bg={PAPEL}
                 border={`1.5px solid ${TINTA}aa`} boxShadow={`0 2px 8px ${TINTA}55`}>
              <SimboloImg keyName={key} />
            </Box>
          ))}
        </Box>

        <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontWeight="700" lineHeight="1.2"
              textAlign="center" noOfLines={2} style={{ textShadow: INK_SHADOW }}>
          {nombre}
        </Text>
        {!esYo && (p!.parentesco || "").trim() !== "" && (
          <Text color={TINTA} fontSize="2xs" fontWeight="700" letterSpacing="0.12em" textTransform="uppercase"
                opacity={0.65} lineHeight="1.2" textAlign="center" noOfLines={1}
                style={{ textShadow: INK_SHADOW }}>
            {p!.parentesco}
          </Text>
        )}
        {!esYo && mostrarProgreso && escritas > 0 && (
          <Box px={2} py={0.5} borderRadius="full" bg={`${TINTA}18`} border={`1px solid ${TINTA}33`}>
            <Text color={TINTA} fontSize="2xs" fontWeight="700" lineHeight="1.2">
              {escritas === genogramaPreguntas.length ? "✓" : `${escritas}/${genogramaPreguntas.length}`}
            </Text>
          </Box>
        )}
      </Box>

      {/* Botones «+» — arriba, a los lados y abajo */}
      <BotonMas dir="arriba" onClick={() => onAñadir("arriba")} />
      <BotonMas dir="izq" onClick={() => onAñadir("izq")} />
      <BotonMas dir="der" onClick={() => onAñadir("der")} />
      <BotonMas dir="abajo" onClick={() => onAñadir("abajo")} />
    </Box>
  );
}

/** Miniatura de un personaje/animal. Si su foto aún no existe, se queda la
 *  inicial de su nombre en vez de un icono roto. */
export function SimboloImg({ keyName }: { keyName: string }) {
  const [falla, setFalla] = React.useState(false);
  const { nombre: simboloNombre } = useSimbolosFamilia();
  const nombre = simboloNombre(keyName);
  if (falla) {
    return (
      <Flex w="100%" h="100%" align="center" justify="center" bg="rgba(255,251,243,0.9)">
        <Text color={`${TINTA}aa`} fontSize="xs" fontWeight="700" lineHeight="1">
          {(nombre.trim()[0] || "?").toUpperCase()}
        </Text>
      </Flex>
    );
  }
  return (
    <Image src={simboloSrc(keyName)} alt={nombre} w="100%" h="100%" objectFit="cover"
           onError={() => setFalla(true)} />
  );
}

/** Botón «+» pegado a un borde de la tarjeta (añade a alguien en esa dirección). */
function BotonMas({ dir, onClick }: { dir: DirFamilia; onClick: () => void }) {
  const titulo =
    dir === "arriba" ? "Añadir arriba (padres, abuelos)"
    : dir === "abajo" ? "Añadir abajo (hijos)"
    : dir === "izq" ? "Añadir a la izquierda" : "Añadir a la derecha";

  // Posición según el borde. Los laterales se alinean con el centro de la foto.
  const pos =
    dir === "arriba" ? { top: "-11px", left: "50%", transform: "translateX(-50%)" }
    : dir === "abajo" ? { bottom: "-11px", left: "50%", transform: "translateX(-50%)" }
    : dir === "izq"
      ? { left: { base: "-2px", md: "0px" }, top: { base: "24px", md: "34px" } }
      : { right: { base: "-2px", md: "0px" }, top: { base: "24px", md: "34px" } };

  return (
    <Box as="button" onClick={onClick} title={titulo} aria-label={titulo}
         position="absolute" zIndex={2} {...pos}
         w={{ base: "20px", md: "22px" }} h={{ base: "20px", md: "22px" }} borderRadius="full"
         display="flex" alignItems="center" justifyContent="center"
         bg="rgba(255,251,243,0.9)" border={`1px solid ${TINTA}66`} color={TINTA}
         opacity={0.75} cursor="pointer" transition="all 0.15s"
         boxShadow={`0 1px 6px ${TINTA}33`}
         _hover={{ opacity: 1, bg: PAPEL, borderColor: TINTA,
                   transform: `${(pos as { transform?: string }).transform || ""} scale(1.14)` }}>
      <MasIcon />
    </Box>
  );
}
