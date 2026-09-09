import React from "react";
import { Box } from "@chakra-ui/react";
import { useT } from "../../i18n";
void React;

// ─────────────────────────────────────────────────────────────────────────
// BotonAviso — EL botón «⚠ Aviso importante» del recorrido.
//
// Es lo primero que sale en la primera página de las disciplinas que tienen
// algo que advertir antes de empezar (Psicología, Ayurveda, Medicina China,
// Nutrición): abre el popup con el aviso. La misma frase, el mismo sitio y —
// ahora sí— el mismo aspecto en las cuatro.
//
// Estaba escrito a mano en las cuatro páginas y las cuatro copias se habían ido
// separando: una había perdido el filo, otra iba en negrita y con el fondo más
// claro. Da igual lo pequeña que sea la diferencia: este botón dice «lee esto
// antes de empezar», y si en cada disciplina se ve distinto parece cuatro cosas
// distintas en vez de la misma advertencia.
//
// Deliberadamente DISCRETO: filo fino y fondo casi transparente sobre el
// turquesa. Advierte, no asusta ni compite con el botón de empezar. Va en
// blanco porque siempre se pinta sobre el fondo de la página, nunca dentro de
// una caja de disciplina (ver la regla del texto fuera de las cajas).
//
// La animación de entrada NO va aquí: cada página lo suelta en un momento
// distinto de su cascada, así que el <Reveal> se queda fuera, envolviéndolo.
// ─────────────────────────────────────────────────────────────────────────
export function BotonAviso({ onClick }: { onClick: () => void }) {
  const t = useT();

  return (
    <Box
      as="button"
      onClick={onClick}
      display="inline-flex"
      alignItems="center"
      gap={2}
      px={6}
      py={2.5}
      borderRadius="full"
      bg="rgba(255,255,255,0.08)"
      border="1px solid rgba(255,255,255,0.4)"
      color="rgba(255,255,255,0.92)"
      fontFamily="'EB Garamond', serif"
      fontWeight="600"
      fontSize={{ base: "sm", md: "md" }}
      letterSpacing="0.04em"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ bg: "rgba(255,255,255,0.16)", transform: "translateY(-1px)" }}
    >
      <Box as="span" fontSize="md">⚠</Box> {t("metodo.gate.avisoImportante")}
    </Box>
  );
}
