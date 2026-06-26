import React, { useMemo, useRef, useState } from "react";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ModuloContenido } from "../../dtos/aprendizaje.type";

/* ─────────────────────────────────────────────────────────────────────────
 *  Buscador de curso (estilo "Ctrl+F" pero sobre TODAS las lecciones).
 *  Busca la frase en el contenido (Markdown) y en los títulos de cada
 *  lección del curso, muestra los resultados con un fragmento, y al pulsar
 *  lleva a esa lección añadiendo ?buscar=<frase>, de modo que TextLessonPage
 *  baja al párrafo y lo resalta.
 * ───────────────────────────────────────────────────────────────────────── */

// Quita acentos y pasa a minúsculas, conservando un mapa de índices al
// string original (para poder recortar el fragmento sin desalinear por los
// acentos, que al normalizar pueden cambiar de longitud).
const COMBINING = new RegExp("[\\u0300-\\u036f]", "g");

function fold(s: string): { folded: string; map: number[] } {
  let folded = "";
  const map: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const dec = s[i].normalize("NFD").replace(COMBINING, "").toLowerCase();
    for (let k = 0; k < dec.length; k++) {
      folded += dec[k];
      map.push(i);
    }
  }
  return { folded, map };
}

// Limpia los signos de Markdown de un fragmento para mostrarlo legible.
function limpiarMd(s: string): string {
  return s
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface Resultado {
  moduloTitle: string;
  leccionNom: string;
  link: string;
  antes: string;
  match: string;
  despues: string;
}

export function CursoBuscador(props: {
  modulos: ModuloContenido[];
  color: string;
  bgColor: string;
}) {
  const { modulos, color, bgColor } = props;
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [abierto, setAbierto] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const resultados: Resultado[] = useMemo(() => {
    const query = q.trim();
    if (query.length < 3) return [];
    const foldedQ = fold(query).folded;
    const out: Resultado[] = [];

    for (const mod of modulos) {
      for (const lec of mod.submodules) {
        const texto = lec.contenido ?? lec.letra ?? "";
        // Buscamos en el contenido; si no, en el nombre de la lección.
        const objetivo = texto || lec.nom;
        const { folded, map } = fold(objetivo);
        const idx = folded.indexOf(foldedQ);
        if (idx === -1) {
          // También damos por válido un acierto solo en el título.
          if (fold(lec.nom).folded.includes(foldedQ) && texto) {
            out.push({ moduloTitle: mod.title, leccionNom: lec.nom, link: lec.link, antes: "", match: lec.nom, despues: "" });
          }
          continue;
        }
        const start = map[idx];
        const end = map[idx + foldedQ.length - 1] + 1;
        const antes = limpiarMd(objetivo.slice(Math.max(0, start - 60), start));
        const match = objetivo.slice(start, end);
        const despues = limpiarMd(objetivo.slice(end, end + 90));
        out.push({ moduloTitle: mod.title, leccionNom: lec.nom, link: lec.link, antes, match, despues });
        if (out.length >= 30) return out;
      }
    }
    return out;
  }, [q, modulos]);

  const irA = (link: string) => {
    setAbierto(false);
    navigate(`${link}?buscar=${encodeURIComponent(q.trim())}`);
  };

  const glow = `0 0 16px rgba(255,255,255,0.14), 0 0 30px ${color}33`;

  return (
    <Box ref={boxRef} position="relative" w="100%" maxW="640px" mx="auto" mb={{ base: 6, md: 8 }} zIndex={5}
         onBlur={(e) => { if (!boxRef.current?.contains(e.relatedTarget as Node)) setAbierto(false); }}>
      <Flex
        align="center"
        gap={2}
        bg={bgColor}
        borderRadius="full"
        px={5}
        py={1}
        boxShadow={glow}
        border="1px solid rgba(255,255,255,0.22)"
      >
        <Box as={Search} w="18px" h="18px" color={color} flexShrink={0} opacity={0.85} />
        <Input
          value={q}
          onChange={(e) => { setQ(e.target.value); setAbierto(true); }}
          onFocus={() => setAbierto(true)}
          placeholder="Buscar una frase en el curso…"
          variant="unstyled"
          color={color}
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "md", md: "lg" }}
          py={2}
          _placeholder={{ color: color, opacity: 0.55 }}
        />
        {q && (
          <Box as="button" onClick={() => { setQ(""); setAbierto(false); }} flexShrink={0} aria-label="Limpiar">
            <Box as={X} w="18px" h="18px" color={color} opacity={0.8} _hover={{ opacity: 1 }} />
          </Box>
        )}
      </Flex>

      {abierto && q.trim().length >= 3 && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          left={0}
          right={0}
          bg={bgColor}
          borderRadius="2xl"
          border="1px solid rgba(255,255,255,0.22)"
          boxShadow={`0 10px 40px rgba(0,0,0,0.4), ${glow}`}
          maxH="420px"
          overflowY="auto"
          zIndex={10}
        >
          {resultados.length === 0 ? (
            <Text color={color} opacity={0.7} fontStyle="italic" px={5} py={4} fontFamily="'EB Garamond', serif">
              Sin resultados para «{q.trim()}».
            </Text>
          ) : (
            resultados.map((r, i) => (
              <Box
                key={i}
                as="button"
                onClick={() => irA(r.link)}
                display="block"
                textAlign="left"
                w="100%"
                px={5}
                py={3}
                borderTop={i === 0 ? undefined : "1px solid rgba(255,255,255,0.1)"}
                color={color}
                fontFamily="'EB Garamond', serif"
                transition="background 0.15s"
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
              >
                <Text fontSize="xs" opacity={0.65} mb={0.5}>
                  {r.moduloTitle} · <Box as="span" fontWeight="700">{r.leccionNom}</Box>
                </Text>
                <Text fontSize="sm" lineHeight="1.5" noOfLines={2}>
                  {r.antes && <Box as="span" opacity={0.7}>…{r.antes} </Box>}
                  <Box as="span" fontWeight="700" bg="rgba(255,245,150,0.35)" px="2px" borderRadius="2px">{r.match}</Box>
                  {r.despues && <Box as="span" opacity={0.7}> {r.despues}…</Box>}
                </Text>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );
}

export default CursoBuscador;
