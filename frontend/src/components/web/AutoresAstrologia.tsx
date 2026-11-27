import React, { useState } from "react";
import { Box, Flex, Grid, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { Flecha } from "./LineaTiempoAstrologia";
import TextoRico from "../global/TextoRico";
import { MandalaTinte } from "../global/MandalaTinte";
import { type AutorAstrologia } from "../../data/autoresAstrologia";
import TituloSeccion from "../global/TituloSeccion";
import { FONDO_PAGINA_BEIGE as BEIGE } from "../../GlobalVariables";
import { useIdioma, useT, type ClaveTexto } from "../../i18n";

/**
 * Autores de la historia de la Astrología, sobre el cielo estrellado: de DOS en DOS y en zigzag (el primero con la
 * foto a la izquierda y el texto a la derecha; el segundo, al revés). Cada texto va en un box transparente con su
 * scroll vertical a la vista, como la línea del tiempo. Datos en `data/autoresAstrologia.ts`.
 * Sin autores todavía, enseña cuatro de EJEMPLO («TEMPORAL») para poder ver el diseño.
 */
const EJEMPLO: AutorAstrologia[] = [1, 2].map((n) => ({
  nombre: `Autor ${n}`,
  fechas: { es: "", en: "" },
  foto: "",
  texto: {
    es: `TEMPORAL · Aquí irá la historia de este autor.\n\nUn segundo párrafo, para ver cómo se reparte el texto junto a la foto y cómo se comporta el scroll cuando es largo.\n\nUn tercero, con **negrita** y *cursiva*.`,
    en: `TEMPORARY · This author's story will go here.\n\nA second paragraph, to see how the text sits next to the photo and how the scroll behaves when it is long.\n\nA third one, with **bold** and *italic*.`,
  },
}));

function Ficha({ autor, fotoALaIzquierda, compacta = false }: { autor: AutorAstrologia; fotoALaIzquierda: boolean; compacta?: boolean }) {
  const { idioma } = useIdioma();
  // Si la foto aún no está subida (404), se enseña el mandala en su lugar, nunca una imagen rota.
  const [fotoRota, setFotoRota] = useState(false);
  const nombre = idioma === "en" ? (autor.nombreEn ?? autor.nombre) : autor.nombre;
  const fechas = idioma === "en" ? autor.fechas.en : autor.fechas.es;
  const parrafos = (idioma === "en" ? autor.texto.en : autor.texto.es).split(/\n\s*\n/);

  const foto = (
    <Box position="relative" w="100%" maxW={compacta ? "136px" : "180px"} mx="auto">
      <Box position="absolute" inset="-6px" borderRadius="20px" border={`1px solid ${BEIGE}55`} pointerEvents="none" />
      <Box borderRadius="15px" overflow="hidden" border={`1.5px solid ${BEIGE}`} sx={{ aspectRatio: "4 / 5" }} bg={`${BEIGE}14`}>
        {autor.foto && !fotoRota ? (
          <Image src={autor.foto} alt={nombre} w="100%" h="100%" objectFit="cover" display="block" loading="lazy" onError={() => setFotoRota(true)} />
        ) : (
          <Flex w="100%" h="100%" align="center" justify="center" opacity={0.55}>
            <MandalaTinte h="40px" color={BEIGE} />
          </Flex>
        )}
      </Box>
    </Box>
  );

  const titulo = (
    <Text fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.04em" lineHeight="1.25">
      {nombre}
      {fechas && (
        <Text as="span" fontWeight="400" fontSize={{ base: "sm", md: "md" }} opacity={0.8} display={compacta ? "block" : "inline"}>
          {compacta ? fechas : ` · ${fechas}`}
        </Text>
      )}
    </Text>
  );

  const caja = (
      <Box
        flex="1"
        minH={0}
        maxH={compacta ? "280px" : undefined}
        overflowY="scroll"
        overscrollBehavior="contain"
        border={`1.5px solid ${BEIGE}80`}
        borderRadius="2xl"
        bg="transparent"
        px={{ base: 4, md: 5 }}
        py={{ base: 3, md: 4 }}
        tabIndex={0}
        sx={{
          scrollbarWidth: "thin",
          scrollbarColor: `${BEIGE}b3 ${BEIGE}26`,
          "&::-webkit-scrollbar": { width: "9px" },
          "&::-webkit-scrollbar-track": { background: `${BEIGE}26`, borderRadius: "8px", margin: "12px 0" },
          "&::-webkit-scrollbar-thumb": { background: `${BEIGE}b3`, borderRadius: "8px" },
        }}
      >
        {parrafos.map((p, i) => (
          <Text key={i} fontSize={{ base: "sm", md: "md" }} lineHeight="1.6" mt={i === 0 ? 0 : 2}>
            <TextoRico texto={p} />
          </Text>
        ))}
      </Box>
  );

  const texto = (
    <Flex direction="column" gap={3} minW={0} h={{ base: "auto", md: "100%" }}>
      {titulo}
      {caja}
    </Flex>
  );

  // Móvil: foto pequeña a la izquierda con el nombre y las fechas al lado, y el texto debajo (nada de columnas largas).
  if (compacta) {
    return (
      <Flex direction="column" gap={4}>
        <Flex align="center" gap={5}>
          <Box flexShrink={0} w="136px">{foto}</Box>
          <Box minW={0}>{titulo}</Box>
        </Flex>
        <Flex direction="column" minW={0}>{caja}</Flex>
      </Flex>
    );
  }

  return (
    <>
      <Grid
        templateColumns={{ base: "1fr", md: fotoALaIzquierda ? "minmax(0, 0.55fr) minmax(0, 1.45fr)" : "minmax(0, 1.45fr) minmax(0, 0.55fr)" }}
        gap={{ base: 4, md: 6 }}
        alignItems="stretch"
      >
        {/* En móvil, siempre la foto arriba; en escritorio, a un lado u otro. */}
        <Box order={{ base: 0, md: fotoALaIzquierda ? 0 : 1 }}>{foto}</Box>
        <Box order={{ base: 1, md: fotoALaIzquierda ? 1 : 0 }} minH={{ md: "210px" }}>{texto}</Box>
      </Grid>
    </>
  );
}

export default function AutoresAstrologia({ lista, titulo }: { lista: AutorAstrologia[]; titulo: ClaveTexto }) {
  const t = useT();
  const autores = lista.length > 0 ? lista : EJEMPLO;
  // De dos en dos: cada pareja es una «pantalla»; las flechas de los lados pasan de una a otra.
  // En móvil, de UNO en uno (una pareja apilada se hacía enorme); en escritorio, de dos en dos.
  const movil = useBreakpointValue({ base: true, md: false }) ?? false;
  const parejas: AutorAstrologia[][] = [];
  for (let i = 0; i < autores.length; i += movil ? 1 : 2) parejas.push(autores.slice(i, i + (movil ? 1 : 2)));
  const [nSel, setN] = useState(0);
  const n = Math.min(nSel, parejas.length - 1);
  const pareja = parejas[n];
  const anterior = () => setN((v) => Math.max(0, v - 1));
  const siguiente = () => setN((v) => Math.min(parejas.length - 1, v + 1));

  return (
    <Flex direction="column" w="100%" maxW="920px" mx="auto" gap={{ base: 8, md: 10 }} color={BEIGE}>
      <TituloSeccion color={BEIGE}>{t(titulo)}</TituloSeccion>
    <Flex w="100%" align="center" gap={{ base: 2, md: 6 }} color={BEIGE} fontFamily="'EB Garamond', serif">
      <Box display={{ base: "none", md: "block" }}>
        <Flecha dir="prev" onClick={anterior} desactivada={n === 0} label="‹" />
      </Box>

      <Flex direction="column" flex="1" minW={0} gap={{ base: 5, md: 6 }}>
        <Flex
          key={n}
          direction="column"
          gap={{ base: 8, md: 8 }}
          sx={{
            "@keyframes autoresEntra": { from: { opacity: 0, transform: "translateY(14px)" }, to: { opacity: 1, transform: "none" } },
            animation: "autoresEntra 0.55s cubic-bezier(0.22,1,0.36,1) both",
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        >
          {pareja.map((a, k) => (
            <Ficha key={a.nombre} autor={a} fotoALaIzquierda={k === 0} compacta={movil} />
          ))}
        </Flex>

        {/* Móvil: las flechas debajo, con el contador en medio; en escritorio, a los lados. */}
        <Flex align="center" justify="center" gap={5}>
          <Box display={{ base: "block", md: "none" }}>
            <Flecha dir="prev" onClick={anterior} desactivada={n === 0} label="‹" />
          </Box>
          <Text fontSize={{ base: "sm", md: "md" }} letterSpacing="0.2em" opacity={0.8}>
            {n + 1} / {parejas.length}
          </Text>
          <Box display={{ base: "block", md: "none" }}>
            <Flecha dir="next" onClick={siguiente} desactivada={n === parejas.length - 1} label="›" />
          </Box>
        </Flex>
      </Flex>

      <Box display={{ base: "none", md: "block" }}>
        <Flecha dir="next" onClick={siguiente} desactivada={n === parejas.length - 1} label="›" />
      </Box>
    </Flex>
    </Flex>
  );
}
