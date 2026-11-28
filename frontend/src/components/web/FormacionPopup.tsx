import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Portal, Text } from "@chakra-ui/react";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { sombraTexto } from "../global/disciplinaSombras";
import { glowHeader } from "../metodo/FotoBox";
import { imagenDiploma, type FormacionItem } from "../../data/formacionAsesoria";

// Cada fila entra con un pequeño retraso (sube y se aclara).
const entra = (delay: number) => ({
  "@keyframes formSube": { from: { opacity: 0, transform: "translateY(18px)" }, to: { opacity: 1, transform: "none" } },
  animation: `formSube 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
  "@media (prefers-reduced-motion: reduce)": { animation: "none" },
});

/**
 * Popup «Mi formación»: con el fondo de la disciplina (la foto de siempre) y la letra de su color. Cada título
 * lleva a su lado la foto de su diploma (el de verdad), con su entidad y, si el diploma las trae, sus horas;
 * una raya horizontal entre cada fila. Al pulsar un diploma se ve en grande. La X, arriba a la derecha.
 */
export function FormacionPopup({ abierto, titulo, items, nom, bg, txt, onCerrar }: {
  abierto: boolean;
  titulo: string;
  items: FormacionItem[];
  /** La disciplina: su fondo, su color de caja y el color de su letra. */
  nom: string;
  bg: string;
  txt: string;
  onCerrar: () => void;
}) {
  const [ampliado, setAmpliado] = useState<FormacionItem | null>(null);
  useLockBodyScroll(abierto);

  useEffect(() => { if (!abierto) setAmpliado(null); }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (ampliado) setAmpliado(null); else onCerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, ampliado, onCerrar]);

  if (!abierto) return null;
  const sombra = sombraTexto(nom, bg);

  return (
    <Portal>
      <Flex
        position="fixed"
        inset={0}
        zIndex={2000}
        align="center"
        justify="center"
        px={{ base: 3, md: 6 }}
        py={{ base: 4, md: 8 }}
        bg="rgba(59,36,24,0.6)"
        onClick={onCerrar}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        fontFamily="'EB Garamond', serif"
      >
        <Box
          position="relative"
          w="100%"
          maxW="960px"
          maxH="100%"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          borderRadius="2xl"
          border={`1.5px solid ${txt}`}
          boxShadow={glowHeader(txt)}
          color={txt}
          onClick={(e) => e.stopPropagation()}
        >
          {/* El fondo de la disciplina: quieto mientras se desliza la lista */}
          <DisciplinaBgLayer nom={nom} borderRadius="2xl" />

          <Box
            as="button"
            type="button"
            onClick={onCerrar}
            aria-label="✕"
            autoFocus
            position="absolute"
            zIndex={2}
            textShadow="none"
            top={{ base: 3, md: 4 }}
            right={{ base: 3, md: 4 }}
            w="42px"
            h="42px"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color={txt}
            border={`1.5px solid ${txt}`}
            bg="transparent"
            transition="background 0.2s"
            _hover={{ bg: `${txt}22` }}
            _focusVisible={{ outline: `2px solid ${txt}`, outlineOffset: "2px" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </Box>

          <Box
            position="relative"
            zIndex={1}
            flex="1"
            minH={0}
            overflowY="auto"
            overscrollBehavior="contain"
            sx={{
              scrollbarWidth: "thin",
              scrollbarColor: `${txt}99 transparent`,
              "&::-webkit-scrollbar": { width: "8px" },
              "&::-webkit-scrollbar-thumb": { background: `${txt}99`, borderRadius: "8px" },
            }}
            px={{ base: 5, md: 10 }} pt={{ base: 14, md: 12 }} pb={{ base: 6, md: 10 }} textShadow={sombra}>

            <Text fontWeight="700" fontSize={{ base: "2xl", md: "4xl" }} letterSpacing="0.03em" lineHeight="1.2" pr={12} sx={entra(0.05)}>
              {titulo}
            </Text>
            <Box h="1px" w="100%" bg={`${txt}88`} mt={{ base: 4, md: 5 }} sx={entra(0.15)} />

            <Box as="ul" listStyleType="none" m={0} p={0}>
              {items.map((it, i) => {
                const src = imagenDiploma(it.img);
                return (
                  <Flex
                    as="li"
                    key={it.titulo}
                    direction={{ base: "column", md: "row" }}
                    align={{ base: "stretch", md: "center" }}
                    gap={{ base: 4, md: 8 }}
                    py={{ base: 5, md: 7 }}
                    borderBottom={i < items.length - 1 ? `1px solid ${txt}55` : undefined}
                    sx={entra(0.25 + Math.min(i, 5) * 0.1)}
                  >
                    {src && (
                      <Box
                        as="button"
                        type="button"
                        onClick={() => setAmpliado(it)}
                        title={it.titulo}
                        aria-label={it.titulo}
                        flexShrink={0}
                        w={{ base: "100%", md: "300px" }}
                        borderRadius="md"
                        overflow="hidden"
                        border={`1.5px solid ${txt}`}
                        boxShadow={glowHeader(txt)}
                        cursor="zoom-in"
                        transition="transform 0.35s cubic-bezier(0.22,1,0.36,1)"
                        _hover={{ transform: "translateY(-3px) scale(1.02)" }}
                        _focusVisible={{ outline: `2px solid ${txt}`, outlineOffset: "3px" }}
                      >
                        <Image src={src} alt={it.titulo} w="100%" display="block" loading="lazy" />
                      </Box>
                    )}
                    <Box minW={0} flex="1">
                      <Text fontWeight="700" fontSize={{ base: "xl", md: "2xl" }} lineHeight="1.25">{it.titulo}</Text>
                      {it.entidad && (
                        <Text fontSize={{ base: "md", md: "lg" }} fontStyle="italic" mt={1}>{it.entidad}</Text>
                      )}
                      {it.horas != null && (
                        <Text fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.04em" mt={3}>{it.horas} horas</Text>
                      )}
                    </Box>
                  </Flex>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* El diploma en grande */}
        {ampliado && (
          <Flex
            position="fixed"
            inset={0}
            zIndex={2100}
            align="center"
            justify="center"
            p={{ base: 3, md: 8 }}
            bg="rgba(59,36,24,0.85)"
            cursor="zoom-out"
            onClick={(e) => { e.stopPropagation(); setAmpliado(null); }}
          >
            <Image
              src={imagenDiploma(ampliado.img)}
              alt={ampliado.titulo}
              maxW="100%"
              maxH="100%"
              objectFit="contain"
              borderRadius="md"
              boxShadow={glowHeader(txt)}
              sx={{
                "@keyframes diplomaCrece": { from: { opacity: 0, transform: "scale(0.96)" }, to: { opacity: 1, transform: "none" } },
                animation: "diplomaCrece 0.35s cubic-bezier(0.22,1,0.36,1) both",
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
              }}
            />
          </Flex>
        )}
      </Flex>
    </Portal>
  );
}

export default FormacionPopup;
