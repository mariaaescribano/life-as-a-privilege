import React from "react";
import { Box, Heading, Text, Link, List, ListItem, Image } from "@chakra-ui/react";

/* ─────────────────────────────────────────────────────────────────────────
 *  Renderizador de Markdown ligero y sin dependencias.
 *  Soporta:  # ## ###  títulos · **negrita** · *cursiva* · `código`
 *            [texto](url) · ![alt](ruta) imágenes · listas (- / *)
 *            listas numeradas (1.) · > citas · ---  separador · párrafos.
 *  Pensado para las lecciones de texto de los cursos (estilo serif / teal).
 * ───────────────────────────────────────────────────────────────────────── */

type MarkdownProps = {
  text: string;
  /** Color principal del texto (suele ser el color de la disciplina). */
  color?: string;
  /** Sube el tamaño del texto: `true` un escalón, `"xl"` dos. El `"xl"` lo usa
   *  la página de lección, que va un 20% más grande que el resto (ahí el texto
   *  es lo único que hay en la página y se lee del tirón). */
  bigger?: boolean | "xl";
};

// ── Inline: **negrita** o __negrita__, *cursiva* o _cursiva_, `código`, [texto](url) ──
function parseInline(str: string, color: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Orden importa: los dobles (** / __) antes que los simples (* / _).
  const regex = /(\*\*([^*]+)\*\*)|(__([^_]+)__)|(\*([^*]+)\*)|(_([^_]+)_)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(str)) !== null) {
    if (m.index > last) nodes.push(str.slice(last, m.index));
    if (m[2] !== undefined || m[4] !== undefined) {
      nodes.push(<Box as="strong" key={key++} fontWeight="700">{m[2] ?? m[4]}</Box>);
    } else if (m[6] !== undefined || m[8] !== undefined) {
      nodes.push(<Box as="em" key={key++} fontStyle="italic">{m[6] ?? m[8]}</Box>);
    } else if (m[10] !== undefined) {
      nodes.push(
        <Box
          as="code"
          key={key++}
          fontFamily="monospace"
          fontSize="0.9em"
          bg="rgba(255,255,255,0.12)"
          px="5px"
          py="1px"
          borderRadius="4px"
        >
          {m[10]}
        </Box>,
      );
    } else if (m[12] !== undefined) {
      nodes.push(
        <Link key={key++} href={m[13]} isExternal textDecoration="underline" color={color} _hover={{ opacity: 0.8 }}>
          {m[12]}
        </Link>,
      );
    }
    last = regex.lastIndex;
  }
  if (last < str.length) nodes.push(str.slice(last));
  return nodes;
}

/**
 * Recoge los ítems consecutivos de una lista a partir de la línea `desde`.
 *
 * Lo importante: una línea en blanco entre dos ítems NO corta la lista. En
 * Markdown eso es una «lista suelta» (los ítems separados por un hueco), y
 * seguía siendo la misma lista. Antes el bucle paraba en el primer blanco, así
 * que cada ítem acababa en su propio <ol> y la numeración se reiniciaba: por eso
 * se veía «1. 1. 1. 1.» en vez de «1. 2. 3. 4.».
 */
function recogerItems(lines: string[], desde: number, marca: RegExp): { items: string[]; next: number } {
  const items: string[] = [];
  let i = desde;
  while (i < lines.length) {
    const t = lines[i].trim();
    if (marca.test(t)) {
      items.push(t.replace(marca, ""));
      i++;
      continue;
    }
    if (t === "") {
      // Nos saltamos los blancos solo si DESPUÉS sigue habiendo ítems; si no,
      // la lista ha terminado de verdad y el blanco separa del bloque siguiente.
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;
      if (j < lines.length && marca.test(lines[j].trim())) {
        i = j;
        continue;
      }
    }
    break;
  }
  return { items, next: i };
}

export function Markdown({ text, color = "white", bigger = false }: MarkdownProps) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  // Tamaño del cuerpo de texto (párrafos, listas, citas): normal, un escalón
  // (`bigger`) o dos (`bigger="xl"`, la página de lección).
  const xl = bigger === "xl";
  const bodySize = xl
    ? { base: "xl", md: "2xl" }
    : bigger
    ? { base: "lg", md: "xl" }
    : { base: "md", md: "lg" };

  const headingProps = {
    color,
    fontFamily: "'EB Garamond', serif",
    fontWeight: "700",
    lineHeight: "1.3",
    letterSpacing: "0.02em",
  } as const;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Línea vacía → separador
    if (trimmed === "") { i++; continue; }

    // Separador horizontal
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      blocks.push(<Box key={key++} h="1px" my={{ base: 6, md: 8 }} bg={`${color}44`} />);
      i++;
      continue;
    }

    // Imagen en su propia línea: ![alt](/ruta-en-public.jpg)
    // El archivo vive en el proyecto (frontend/public/…); aquí solo va la ruta.
    const img = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(trimmed);
    if (img) {
      blocks.push(
        <Box key={key++} my={{ base: 5, md: 7 }} display="flex" justifyContent="center">
          <Image
            src={img[2]}
            alt={img[1]}
            maxW="100%"
            borderRadius="lg"
            display="block"
            sx={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.4))" }}
          />
        </Box>,
      );
      i++;
      continue;
    }

    // Títulos
    const h = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (h) {
      const level = h[1].length;
      // Los títulos suben con el cuerpo, para que la jerarquía no se aplaste.
      const size = xl
        ? (level === 1 ? { base: "3xl", md: "4xl" } : level === 2 ? { base: "2xl", md: "3xl" } : { base: "xl", md: "2xl" })
        : (level === 1 ? { base: "2xl", md: "3xl" } : level === 2 ? { base: "xl", md: "2xl" } : { base: "lg", md: "xl" });
      blocks.push(
        <Heading key={key++} as={`h${level}` as "h1"} fontSize={size} mt={{ base: 6, md: 8 }} mb={{ base: 2, md: 3 }} {...headingProps}>
          {parseInline(h[2], color)}
        </Heading>,
      );
      i++;
      continue;
    }

    // Cita
    if (/^>\s?/.test(trimmed)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <Box key={key++} borderLeft={`3px solid ${color}88`} pl={{ base: 4, md: 5 }} py={1} my={{ base: 4, md: 5 }}>
          <Text color={color} fontSize={bodySize} fontStyle="italic" lineHeight="1.9" opacity={0.9}>
            {parseInline(quote.join(" "), color)}
          </Text>
        </Box>,
      );
      continue;
    }

    // Lista numerada
    if (/^\d+\.\s+/.test(trimmed)) {
      const { items, next } = recogerItems(lines, i, /^\d+\.\s+/);
      i = next;
      blocks.push(
        <List key={key++} as="ol" styleType="decimal" pl={{ base: 6, md: 7 }} my={{ base: 3, md: 4 }} spacing={2}>
          {items.map((it, j) => (
            <ListItem key={j} color={color} fontSize={bodySize} lineHeight="1.8">
              {parseInline(it, color)}
            </ListItem>
          ))}
        </List>,
      );
      continue;
    }

    // Lista con viñetas
    if (/^[-*]\s+/.test(trimmed)) {
      const { items, next } = recogerItems(lines, i, /^[-*]\s+/);
      i = next;
      blocks.push(
        <List key={key++} styleType="disc" pl={{ base: 6, md: 7 }} my={{ base: 3, md: 4 }} spacing={2}>
          {items.map((it, j) => (
            <ListItem key={j} color={color} fontSize={bodySize} lineHeight="1.8">
              {parseInline(it, color)}
            </ListItem>
          ))}
        </List>,
      );
      continue;
    }

    // Párrafo (líneas consecutivas no especiales)
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,3})\s+/.test(lines[i].trim()) &&
      !/^>\s?/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^(-{3,}|\*{3,})$/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push(
      <Text key={key++} color={color} fontSize={bodySize} lineHeight="1.9" letterSpacing="0.01em" mb={{ base: 4, md: 5 }}>
        {parseInline(para.join(" "), color)}
      </Text>,
    );
  }

  return <Box>{blocks}</Box>;
}

export default Markdown;
