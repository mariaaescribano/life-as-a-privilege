import React from "react";
import { Box, Flex } from "@chakra-ui/react";

/**
 * El botón «Leído» de cada ilustración o texto: discreto y elegante. Una raya horizontal fina que se
 * desvanece en los bordes, y debajo la palabra en versales espaciadas. Al pasar el ratón se ENCIENDE
 * (pasa de apagada a plena); al pulsar, sale el CHECK a su lado y queda marcada. Sin relleno ni halo.
 */
export const BotonLeido = ({
  hecho,
  onClick,
  color,
  children,
}: {
  hecho: boolean;
  onClick: () => void;
  /** El color de la letra y de la raya (el de lectura de la caja). */
  color: string;
  children: React.ReactNode;
}) => (
  <Flex direction="column" align="center" w="100%" mt={{ base: 4, md: 5 }}>
    <Box h="1px" w="55%" maxW="260px" bgGradient={`linear(to-r, ${color}00, ${color}99, ${color}00)`} />
    <Box
      as="button"
      type="button"
      onClick={hecho ? undefined : onClick}
      aria-pressed={hecho}
      disabled={hecho}
      mt={2}
      px={6}
      py="10px"
      display="inline-flex"
      alignItems="center"
      gap={2.5}
      bg="transparent"
      color={color}
      opacity={hecho ? 0.9 : 0.62}
      fontWeight="600"
      fontSize={{ base: "sm", md: "md" }}
      letterSpacing="0.3em"
      textTransform="uppercase"
      cursor={hecho ? "default" : "pointer"}
      transition="opacity 0.35s ease, letter-spacing 0.35s ease"
      _hover={hecho ? {} : { opacity: 1, letterSpacing: "0.34em" }}
      _focusVisible={{ opacity: 1, outline: `1px solid ${color}99`, outlineOffset: "4px" }}
    >
      {/* El check: aparece al pulsar, al lado de la palabra. */}
      <Box
        as="svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        w={hecho ? "16px" : "0px"}
        h="16px"
        fill="currentColor"
        flexShrink={0}
        aria-hidden
        opacity={hecho ? 1 : 0}
        transform={hecho ? "scale(1)" : "scale(0.4)"}
        transition="all 0.4s cubic-bezier(0.22, 1, 0.36, 1)"
      >
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
      </Box>
      {children}
    </Box>
  </Flex>
);

export default BotonLeido;
