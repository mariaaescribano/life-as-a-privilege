import React from "react";
import { Box, Heading, Text, Link, List, ListItem } from "@chakra-ui/react";

/* ─────────────────────────────────────────────────────────────────────────
 *  Renderizador de Markdown ligero y sin dependencias.
 *  Soporta:  # ## ###  títulos · **negrita** · *cursiva* · `código`
 *            [texto](url) · listas (- / *) · listas numeradas (1.)
 *            > citas · ---  separador · párrafos.
 *  Pensado para las lecciones de texto de los cursos (estilo serif / teal).
 * ───────────────────────────────────────────────────────────────────────── */

type MarkdownProps = {
  text: string;
  /** Color principal del texto (suele ser el color de la disciplina). */
  color?: string;
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

export function Markdown({ text, color = "white" }: MarkdownProps) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

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

    // Títulos
    const h = /^(#{1,3})\s+(.*)$/.exec(trimmed);
    if (h) {
      const level = h[1].length;
      const size = level === 1 ? { base: "2xl", md: "3xl" } : level === 2 ? { base: "xl", md: "2xl" } : { base: "lg", md: "xl" };
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
          <Text color={color} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.9" opacity={0.9}>
            {parseInline(quote.join(" "), color)}
          </Text>
        </Box>,
      );
      continue;
    }

    // Lista numerada
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <List key={key++} as="ol" styleType="decimal" pl={{ base: 6, md: 7 }} my={{ base: 3, md: 4 }} spacing={2}>
          {items.map((it, j) => (
            <ListItem key={j} color={color} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8">
              {parseInline(it, color)}
            </ListItem>
          ))}
        </List>,
      );
      continue;
    }

    // Lista con viñetas
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <List key={key++} styleType="disc" pl={{ base: 6, md: 7 }} my={{ base: 3, md: 4 }} spacing={2}>
          {items.map((it, j) => (
            <ListItem key={j} color={color} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8">
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
      <Text key={key++} color={color} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" letterSpacing="0.01em" mb={{ base: 4, md: 5 }}>
        {parseInline(para.join(" "), color)}
      </Text>,
    );
  }

  return <Box>{blocks}</Box>;
}

export default Markdown;
