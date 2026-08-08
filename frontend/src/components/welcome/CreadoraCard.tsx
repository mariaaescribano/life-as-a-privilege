import React from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Reveal, RevealItem, RevealStagger } from "../global/Reveal";
import { useT } from "../../i18n";

/**
 * Tarjeta de la creadora — panel glass horizontal: texto a la izquierda
 * (nombre + bio + botón) y foto a la derecha. En móvil se apila (foto arriba,
 * texto debajo). El bloque de texto se centra verticalmente con la foto.
 *
 * El botón es configurable (etiqueta + destino) y se puede añadir un párrafo
 * extra opcional, para reutilizar la tarjeta en distintas páginas.
 */
type CreadoraCardProps = {
  /** Texto del botón. Por defecto, «Conocer a la creadora» en el idioma activo. */
  actionLabel?: string;
  /** Ruta a la que navega el botón. Por defecto "/quienSoy". */
  actionTo?: string;
  /** Párrafo adicional opcional debajo de la bio. */
  extraParagraph?: string;
  /** Sin los márgenes propios de la tarjeta. Para cuando va dentro de una
   *  página que ya pone los suyos (las presentaciones /d/:disciplina): si no,
   *  el hueco se suma dos veces y la tarjeta queda mucho más estrecha que las
   *  demás secciones. Welcome y ElMetodo NO lo pasan y siguen igual. */
  sinMargenes?: boolean;
  /**
   * Sobre qué fondo se pinta la tarjeta. "oscuro" (por defecto) = el turquesa de
   * toda la web: cristal blanco translúcido y letra blanca con glow. "claro" =
   * la landing de bienvenida (arena): panel blanco y letra tinta, sin glow.
   *
   * Hace falta porque sobre crema la versión oscura es literalmente invisible
   * (letra blanca sobre fondo claro). Todas las páginas que ya la usaban siguen
   * sin pasar nada y se ven exactamente igual que antes.
   */
  fondo?: "oscuro" | "claro";
};

const CreadoraCard: React.FC<CreadoraCardProps> = ({
  actionLabel,
  actionTo = "/quienSoy",
  extraParagraph,
  sinMargenes = false,
  fondo = "oscuro",
}) => {
  const navigate = useNavigate();
  const t = useT();
  // El valor por defecto no puede ir en la firma: depende del idioma activo.
  const etiquetaAccion = actionLabel ?? t("creadora.accion");

  // Los dos juegos de color de la tarjeta. Todo lo que cambia entre fondo
  // oscuro y claro vive aquí, para que el markup de abajo sea uno solo.
  const claro = fondo === "claro";
  const c = claro
    ? {
        panelBg: "#FFFFFF8C",
        panelBorde: "#2A262218",
        panelSombra: "0 14px 40px #2A26221F",
        titulo: "#2A2622",
        tituloGlow: "none",
        texto: "#4A4238",
        textoGlow: "none",
        lineaBase: "linear(to-r, transparent, #2A262266, transparent)",
        lineaMd: "linear(to-r, #2A262266, transparent)",
        btnTexto: "#4A4238",
        btnBorde: "#2A262240",
        btnBg: "#FFFFFF73",
        btnSombra: "0 2px 10px #2A26221A",
        btnHoverBg: "#FFFFFFD9",
        btnHoverBorde: "#2A262273",
        btnHoverTexto: "#2A2622",
        btnHoverSombra: "0 4px 16px #2A26222B",
        fotoSombra: "0 18px 45px #2A262229, 0 4px 14px #2A262217",
      }
    : {
        panelBg: "rgba(255,255,255,0.05)",
        panelBorde: "rgba(255,255,255,0.14)",
        panelSombra: "none",
        titulo: "white",
        tituloGlow: "0 0 13px rgba(255,255,255,0.49), 0 0 27px rgba(255,255,255,0.26), 0 0 54px rgba(180,255,245,0.22)",
        texto: "rgba(255,255,255,0.92)",
        textoGlow: "0 0 10px rgba(255,255,255,0.28), 0 0 22px rgba(255,255,255,0.14)",
        lineaBase: "linear(to-r, transparent, rgba(255,255,255,0.6), transparent)",
        lineaMd: "linear(to-r, rgba(255,255,255,0.6), transparent)",
        btnTexto: "rgba(255,255,255,0.85)",
        btnBorde: "rgba(255,255,255,0.35)",
        btnBg: "rgba(255,255,255,0.05)",
        btnSombra: "0 0 12px rgba(255,255,255,0.2), 0 0 24px rgba(180,255,245,0.16), 0 2px 10px rgba(0,0,0,0.16)",
        btnHoverBg: "rgba(255,255,255,0.12)",
        btnHoverBorde: "rgba(255,255,255,0.6)",
        btnHoverTexto: "white",
        btnHoverSombra: "0 0 16px rgba(255,255,255,0.3), 0 0 32px rgba(180,255,245,0.26), 0 2px 12px rgba(0,0,0,0.18)",
        fotoSombra: "0 18px 45px rgba(0,0,0,0.35), 0 0 27px rgba(255,255,255,0.25), 0 0 54px rgba(180,255,245,0.2)",
      };

  return (
    <Box
      w="100%"
      px={sinMargenes ? 0 : { base: 5, md: 10, lg: 16 }}
      pt={sinMargenes ? 0 : { base: 10, md: 14 }}
    >
      {/* El panel entra al asomar: sube, crece un poco y sus dos mitades llegan
          en cascada (texto desde la izquierda, foto desde la derecha).
          `amount={0.02}`: arranca en cuanto asoma el BORDE de la caja. Es
          importante en un panel tan alto — con el umbral por defecto (20% de la
          caja visible) la animación empezaba cuando ya llevabas medio panel en
          pantalla, así que primero veías un hueco vacío y luego la caja
          apareciendo de golpe. Tampoco lleva `blur`: sobre un panel de cristal
          tan grande, el salto de desenfoque a nítido se percibe como un fogonazo.
          Duración generosa (1s) para que se vea llegar, no aparecer. */}
      <Reveal
        inView
        amount={0.02}
        direction="up"
        distance={26}
        scaleFrom={0.98}
        duration={1}
        w="100%"
        maxW={{ base: "900px", lg: "1180px" }}
        mx="auto"
      >
      <RevealStagger
        inView
        amount={0.02}
        stagger={0.22}
        delayChildren={0.18}
        display="flex"
        flexDirection={{ base: "column-reverse", md: "row" }}
        alignItems="center"
        justifyContent="center"
        gap={{ base: 7, md: 14, lg: 20 }}
        w="100%"
        p={{ base: 7, md: 12, lg: 16 }}
        borderRadius="3xl"
        bg={c.panelBg}
        border={`1px solid ${c.panelBorde}`}
        boxShadow={c.panelSombra}
        sx={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      >
        {/* ── Texto (izquierda) ── */}
        <RevealItem
          direction="right"
          distance={26}
          flex="1"
          display="flex"
          flexDirection="column"
          alignItems={{ base: "center", md: "flex-start" }}
          textAlign={{ base: "center", md: "left" }}
          gap={{ base: 4, md: 5, lg: 6 }}
        >
          <Text
            color={c.titulo}
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight="700"
            letterSpacing="0.04em"
            lineHeight="1.15"
            textShadow={c.tituloGlow}
          >
            María Escribano
          </Text>

          {/* Línea acento */}
          <Box
            h="2px"
            w={{ base: "70px", md: "90px", lg: "120px" }}
            bgGradient={{ base: c.lineaBase, md: c.lineaMd }}
            borderRadius="full"
          />

          <Text
            color={c.texto}
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "sm", md: "lg", lg: "xl" }}
            lineHeight="1.85"
            letterSpacing="0.02em"
            textShadow={c.textoGlow}
          >
            {t("creadora.bio")}
          </Text>

          {extraParagraph && (
            <Text
              color={c.texto}
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "sm", md: "lg" }}
              lineHeight="1.85"
              letterSpacing="0.02em"
              textShadow={c.textoGlow}
            >
              {extraParagraph}
            </Text>
          )}

          {/* Botón configurable */}
          <Flex
            as="button"
            onClick={() => navigate(actionTo)}
            align="center"
            gap={2}
            mt={{ base: 1, md: 2 }}
            color={c.btnTexto}
            fontFamily="'EB Garamond', serif"
            fontWeight="500"
            fontSize={{ base: "xs", md: "sm", lg: "md" }}
            letterSpacing={{ base: "0.08em", md: "0.14em" }}
            textTransform="uppercase"
            whiteSpace="nowrap"
            px={{ base: 5, md: 6, lg: 8 }}
            py={{ base: "8px", md: "10px", lg: "13px" }}
            borderRadius="full"
            border={`1px solid ${c.btnBorde}`}
            bg={c.btnBg}
            cursor="pointer"
            boxShadow={c.btnSombra}
            _hover={{
              bg: c.btnHoverBg,
              borderColor: c.btnHoverBorde,
              color: c.btnHoverTexto,
              boxShadow: c.btnHoverSombra,
            }}
            transition="all 0.25s ease"
          >
            {etiquetaAccion}
            <Box as="span" fontSize={{ base: "sm", md: "md", lg: "lg" }}>→</Box>
          </Flex>
        </RevealItem>

        {/* ── Foto (derecha) — recortada apaisada (más ancha que alta) ── */}
        <RevealItem
          direction="left"
          distance={26}
          scaleFrom={0.94}
          flexShrink={0}
          w={{ base: "240px", md: "340px", lg: "430px" }}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow={c.fotoSombra}
          sx={{ aspectRatio: "4 / 3" }}
        >
          <Image
            src="/img/me/me.png"
            alt="María Escribano"
            w="100%"
            h="100%"
            objectFit="cover"
            objectPosition="center top"
            display="block"
          />
        </RevealItem>
      </RevealStagger>
      </Reveal>
    </Box>
  );
};

export default CreadoraCard;
