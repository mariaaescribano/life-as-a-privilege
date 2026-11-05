import React from "react";
import { Box, Popover, PopoverContent, PopoverTrigger, Portal, SimpleGrid, Text, useDisclosure } from "@chakra-ui/react";
import { SpaceBg } from "./SpaceBg";

export interface OpcionDesplegable {
  valor: string;
  etiqueta: string;
}

/**
 * Un desplegable a la medida de la casa: en lugar de la lista fea del navegador, un panel de
 * cajitas con el cielo de estrellas de fondo. La elegida se ilumina (borde y halo del color de la
 * disciplina) y al pasar por encima se enciende un poco. Sale en un portal, así que no lo recorta
 * ninguna caja con `overflow: hidden`. Escape o pulsar fuera lo cierra.
 */
export function DesplegableEstrellas({
  valor, opciones, onChange, placeholder, color, ariaLabel, columnas = 3,
}: {
  valor: string;
  opciones: OpcionDesplegable[];
  onChange: (v: string) => void;
  placeholder?: string;
  /** Color del texto, bordes y halo (el <disc>Txt). */
  color: string;
  ariaLabel?: string;
  columnas?: number;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const elegida = opciones.find((o) => o.valor === valor);

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="bottom-start" isLazy gutter={8}>
      <PopoverTrigger>
        <Box
          as="button"
          type="button"
          aria-label={ariaLabel ?? placeholder}
          aria-haspopup="listbox"
          w="100%"
          h="40px"
          px={4}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
          bg="rgba(8,13,30,0.55)"
          border={`1px solid ${isOpen ? color : `${color}44`}`}
          boxShadow={isOpen ? `0 0 0 1px ${color}55, 0 0 14px ${color}33` : "none"}
          borderRadius="lg"
          color={elegida ? color : `${color}77`}
          fontFamily="'EB Garamond', serif"
          fontSize="md"
          textAlign="left"
          cursor="pointer"
          transition="all 0.18s ease"
          _hover={{ borderColor: `${color}88` }}
          _focusVisible={{ borderColor: color, boxShadow: `0 0 0 1px ${color}55, 0 0 14px ${color}33`, outline: "none" }}
        >
          <Text as="span" noOfLines={1}>{elegida?.etiqueta ?? placeholder}</Text>
          <Box as="svg" viewBox="0 0 24 24" w="16px" h="16px" flexShrink={0} fill="none" stroke="currentColor" strokeWidth="2"
               strokeLinecap="round" strokeLinejoin="round" transition="transform 0.2s ease" transform={isOpen ? "rotate(180deg)" : undefined}>
            <path d="M6 9l6 6 6-6" />
          </Box>
        </Box>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          w={{ base: "min(92vw, 360px)", md: "360px" }}
          bg="rgba(5,8,22,0.94)"
          border={`1px solid ${color}55`}
          borderRadius="2xl"
          boxShadow={`0 0 28px ${color}33, 0 0 64px ${color}1a`}
          p={3}
          _focusVisible={{ outline: "none" }}
          fontFamily="'EB Garamond', serif"
        >
          <SimpleGrid columns={columnas} spacing={2} role="listbox" aria-label={ariaLabel ?? placeholder}>
            {opciones.map((o) => {
              const activa = o.valor === valor;
              return (
                <Box
                  key={o.valor}
                  as="button"
                  type="button"
                  role="option"
                  aria-selected={activa}
                  onClick={() => { onChange(o.valor); onClose(); }}
                  position="relative"
                  overflow="hidden"
                  h="48px"
                  borderRadius="xl"
                  border={`1px solid ${activa ? color : `${color}33`}`}
                  boxShadow={activa ? `0 0 14px ${color}88, 0 0 30px ${color}44, inset 0 0 14px ${color}33` : "none"}
                  color={activa ? "white" : `${color}dd`}
                  fontWeight={activa ? 700 : 500}
                  fontSize="md"
                  cursor="pointer"
                  transition="all 0.18s ease"
                  _hover={{ borderColor: color, color: "white", boxShadow: `0 0 12px ${color}66`, transform: "translateY(-1px)" }}
                  _focusVisible={{ borderColor: "white", boxShadow: `0 0 0 2px ${color}88`, outline: "none" }}
                >
                  <SpaceBg quieto overlay={activa ? "rgba(8,13,30,0.05)" : "rgba(8,13,30,0.42)"} />
                  <Text as="span" position="relative" zIndex={1} noOfLines={1} px={2}>{o.etiqueta}</Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
