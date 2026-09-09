import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "../../i18n";

// `motion(Box)` casteado, como en el resto de la casa: Chakra tipa `transition`
// como cadena CSS y framer como objeto, y sin el casteo chocan.
const MotionBox = motion(Box) as any;
const MotionFlex = motion(Flex) as any;

export type ItemMenu = {
  /** Texto ya traducido (el que se pinta). */
  etiqueta: string;
  /** Qué hace al pulsarlo. El menú se cierra solo antes de llamarlo. */
  onSelect: () => void;
  /** Página en la que ya estás: se queda marcada y no se apaga. */
  activo?: boolean;
};

type Props = {
  abierto: boolean;
  onToggle: () => void;
  onClose: () => void;
  items: ItemMenu[];
};

/** Alto que ocupa la cabecera. El panel entra POR DEBAJO del header (que se
 *  queda encendido por encima del velo), así que su contenido arranca aquí.
 *  Generoso a propósito: cubre el header normal y el compacto sin medir nada. */
const HUECO_HEADER = { base: "92px", md: "148px" };

/**
 * Menú de hamburguesa del header — el trigger va a la derecha del todo y el
 * panel entra deslizándose desde ese mismo borde.
 *
 * Las tres rayas se convierten EN la X al abrir (no aparece otra aspa en otro
 * sitio): el header se levanta por encima del velo mientras el menú está
 * abierto, así que el botón sigue a la vista y cerrar es volver a pulsar donde
 * acabas de pulsar. Por eso el panel lleva `HUECO_HEADER` arriba: para que sus
 * enlaces no se metan debajo de la cabecera.
 */
const MenuHamburguesa = ({ abierto, onToggle, onClose, items }: Props) => {
  const t = useT();

  // Escape cierra, y con el menú abierto la página de detrás no hace scroll
  // (si no, el dedo arrastra el fondo y el panel se queda flotando sobre una
  // página que se ha movido sola).
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previo;
    };
  }, [abierto, onClose]);

  // Las tres rayas. La de en medio se desvanece; las otras dos se juntan en el
  // centro y giran: es el mismo trazo, no un icono que se cambia por otro.
  const raya = {
    h: "1.4px",
    w: "26px",
    borderRadius: "full",
    bg: "white",
    boxShadow: "0 0 8px rgba(255,255,255,0.6), 0 0 18px rgba(180,255,245,0.35)",
  } as const;

  return (
    <>
      {/* ── Botón (siempre en el header, a la derecha del todo) ── */}
      <Flex
        as="button"
        type="button"
        onClick={onToggle}
        aria-label={abierto ? t("header.cerrarMenu") : t("header.menu")}
        aria-expanded={abierto}
        aria-haspopup="true"
        direction="column"
        align="center"
        justify="center"
        gap="6px"
        w={{ base: "42px", md: "48px" }}
        h={{ base: "42px", md: "48px" }}
        flexShrink={0}
        borderRadius="full"
        // El aro solo se insinúa: en reposo es transparente y aparece al pasar
        // por encima, para que el botón sea tres rayas de luz y no un botón más.
        border="1px solid transparent"
        bg="transparent"
        cursor="pointer"
        _hover={{
          borderColor: "rgba(255,255,255,0.38)",
          bg: "rgba(255,255,255,0.08)",
          boxShadow: "0 0 16px rgba(255,255,255,0.28), 0 0 34px rgba(180,255,245,0.22)",
        }}
        transition="border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease"
        sx={{ WebkitTapHighlightColor: "transparent" }}
      >
        <MotionBox
          {...raya}
          animate={abierto ? { rotate: 45, y: 7.4 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        />
        <MotionBox
          {...raya}
          animate={abierto ? { opacity: 0, scaleX: 0.3 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.26, ease: "easeInOut" }}
        />
        <MotionBox
          {...raya}
          animate={abierto ? { rotate: -45, y: -7.4 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        />
      </Flex>

      {/* ── Velo + panel (fuera del header, colgando del body) ──
          En un portal porque el header es `sticky` y crea su propio contexto de
          apilado: un panel pintado dentro de él nunca podría cubrir la página. */}
      {createPortal(
        <AnimatePresence>
          {abierto && (
            <>
              {/* Velo: oscurece y desenfoca la página, no el header. */}
              <MotionBox
                position="fixed"
                inset={0}
                zIndex={300}
                bg="rgba(0,0,0,0.42)"
                sx={{ backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)" }}
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />

              {/* Panel */}
              <MotionFlex
                role="dialog"
                aria-modal="true"
                aria-label={t("header.menu")}
                position="fixed"
                top={0}
                right={0}
                zIndex={320}
                direction="column"
                // 420 y no 380 en escritorio: es lo que hace falta para que
                // «ESTUDIO ASTROLÓGICO» quepa en una línea con su rayita.
                w={{ base: "min(86vw, 340px)", md: "420px" }}
                // `100dvh` y no `100vh`: en el móvil la barra del navegador se
                // esconde al hacer scroll y con `vh` el panel quedaba cortado.
                h="100dvh"
                pt={HUECO_HEADER}
                pb={{ base: 8, md: 10 }}
                // Turquesa de la casa, apenas oscurecido hacia abajo para que el
                // panel se despegue de la página sin cambiar de color.
                bgGradient="linear(to-b, #008080, #00696b)"
                borderLeft="1px solid rgba(255,255,255,0.18)"
                boxShadow="-26px 0 60px rgba(0,0,0,0.38), 0 0 46px rgba(180,255,245,0.12)"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Filo de luz pegado al borde izquierdo: el mismo brillo que
                    lleva todo en esta web, aquí como línea. */}
                <Box
                  position="absolute"
                  left={0}
                  top={0}
                  bottom={0}
                  w="1px"
                  // Hex con alfa y NO `rgba()`: las comas de `rgba()` parten el
                  // gradiente de Chakra y la línea no se pinta.
                  bgGradient="linear(to-b, transparent, #b4fff58c, transparent)"
                  pointerEvents="none"
                />

                <Flex direction="column" px={{ base: 7, md: 9 }} overflowY="auto">
                  {items.map((item, i) => (
                    <MotionFlex
                      key={item.etiqueta}
                      as="button"
                      type="button"
                      onClick={() => { onClose(); item.onSelect(); }}
                      align="center"
                      gap={3}
                      w="100%"
                      py={{ base: 4, md: "18px" }}
                      bg="transparent"
                      border="none"
                      borderBottom="1px solid rgba(255,255,255,0.12)"
                      cursor="pointer"
                      textAlign="left"
                      // Entran en cascada, de arriba abajo, detrás del panel.
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.18 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      sx={{
                        WebkitTapHighlightColor: "transparent",
                        // La rayita de la izquierda crece al pasar por encima:
                        // es la marca de «estás señalando esto».
                        "&:hover .marca": { transform: "scaleX(1)", opacity: 1 },
                        "&:hover .texto": { opacity: 1, transform: "translateX(2px)" },
                      }}
                    >
                      {/* La rayita ocupa SIEMPRE sus 26px y crece con
                          `scaleX`, no con `width`. Antes crecía de 0 a 26px al
                          pasar por encima y esos 26px se los quitaba a la
                          etiqueta: «ESTUDIO ASTROLÓGICO» se partía en dos
                          líneas solo mientras tenías el ratón encima. Una
                          transformación no ocupa sitio, así que la fila mide lo
                          mismo con ratón y sin él. Se ve exactamente igual. */}
                      <Box
                        className="marca"
                        h="1px"
                        w="26px"
                        transform={item.activo ? "scaleX(1)" : "scaleX(0)"}
                        transformOrigin="left center"
                        opacity={item.activo ? 1 : 0}
                        bg="white"
                        flexShrink={0}
                        boxShadow="0 0 8px rgba(255,255,255,0.7)"
                        transition="transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease"
                      />
                      <Text
                        className="texto"
                        color="white"
                        fontFamily="'EB Garamond', serif"
                        fontWeight="600"
                        fontSize={{ base: "md", md: "lg" }}
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        // En escritorio, SIEMPRE una línea: la etiqueta más
                        // larga («ESTUDIO ASTROLÓGICO») cabe de sobra en el
                        // panel de 420px. En móvil se deja saltar de línea: ahí
                        // el panel es estrecho y es mejor dos líneas que
                        // desbordar por el lado.
                        whiteSpace={{ base: "normal", md: "nowrap" }}
                        opacity={item.activo ? 1 : 0.82}
                        textShadow="0 0 10px rgba(255,255,255,0.45), 0 0 24px rgba(255,255,255,0.22)"
                        transition="opacity 0.3s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)"
                      >
                        {item.etiqueta}
                      </Text>
                    </MotionFlex>
                  ))}
                </Flex>

                {/* Pie del panel: el mandala, muy tenue. Cierra la columna sin
                    añadir nada que se pueda pulsar. */}
                <MotionBox
                  mt="auto"
                  pt={8}
                  display="flex"
                  justifyContent="center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.22 }}
                  transition={{ duration: 0.9, delay: 0.35 }}
                >
                  <Box
                    as="img"
                    src="/img/icono/life.png"
                    alt=""
                    w="64px"
                    h="64px"
                    objectFit="contain"
                    sx={{ filter: "drop-shadow(0 0 14px rgba(255,255,255,0.6))" }}
                  />
                </MotionBox>
              </MotionFlex>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
};

export default MenuHamburguesa;
