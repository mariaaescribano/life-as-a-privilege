import React from "react";
import { Box, Text } from "@chakra-ui/react";
import {
  astrologiaBg, astrologiaTxt,
  neuropsicologiaBg, neuropsicologiaTxt,
  ayurvedaBg, ayurvedaTxt,
  tcmBg, tcmTxt,
  fisiologiaBg, fisiologiaTxt,
  nutricionBg, nutricionTxt,
  cabalaBg, cabalaTxt,
  culturaBg, culturaTxt,
} from "../../GlobalVariables";

// Lo que comparten /admin/informes (crear el PDF) y /admin/correos (mandarlo): las disciplinas, los
// colores de las cajas y los campos. El borrador del informe vive en localStorage y el de los correos
// en otra clave; la página de correos lee el del informe para poder adjuntarlo.

// Los botones llevan los colores de su disciplina (Bg de fondo, Txt de letra), como en el resto de la casa.
export const DISCIPLINAS = [
  { clave: "astrologia", nombre: "Astrología", bg: astrologiaBg, txt: astrologiaTxt },
  { clave: "psicologia", nombre: "Psicología", bg: neuropsicologiaBg, txt: neuropsicologiaTxt },
  { clave: "ayurveda", nombre: "Ayurveda", bg: ayurvedaBg, txt: ayurvedaTxt },
  { clave: "tcm", nombre: "Medicina China", bg: tcmBg, txt: tcmTxt },
  { clave: "fisiologia", nombre: "Fisiología", bg: fisiologiaBg, txt: fisiologiaTxt },
  { clave: "nutricion", nombre: "Nutrición", bg: nutricionBg, txt: nutricionTxt },
  { clave: "cabala", nombre: "Cábala", bg: cabalaBg, txt: cabalaTxt },
  { clave: "cultura", nombre: "Cultura", bg: culturaBg, txt: culturaTxt },
] as const;

export const TQ = "#004f4f";
export const MARMOL = "url('/img/fondos/marmol-bandas.webp')";

/** El borrador del informe (PDF). */
export interface BorradorInforme { disciplina: string; titulo: string; para: string; cuerpo: string }
export const CLAVE_INFORME = "informes:borrador:v1";
export const INFORME_VACIO: BorradorInforme = { disciplina: "psicologia", titulo: "", para: "", cuerpo: "" };

export const leerBorradorInforme = (): BorradorInforme => {
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE_INFORME) ?? "null");
    if (g && typeof g === "object") {
      return {
        disciplina: typeof g.disciplina === "string" ? g.disciplina : INFORME_VACIO.disciplina,
        titulo: typeof g.titulo === "string" ? g.titulo : "",
        para: typeof g.para === "string" ? g.para : "",
        cuerpo: typeof g.cuerpo === "string" ? g.cuerpo : "",
      };
    }
  } catch { /* borrador corrupto: se empieza de cero */ }
  return INFORME_VACIO;
};

export const etiqueta = (t: string) => (
  <Text color={TQ} fontSize="xs" fontWeight={700} letterSpacing="0.1em" textTransform="uppercase" mb={1.5}>{t}</Text>
);

export const campo = {
  variant: "unstyled" as const,
  px: 3, py: 2,
  color: TQ,
  bg: "#F7EBD9",
  border: `1.5px solid ${TQ}66`,
  borderRadius: "lg",
  fontFamily: "'EB Garamond', serif",
  _placeholder: { color: `${TQ}88`, fontStyle: "italic" },
  _focus: { borderColor: TQ },
};

export const caja = {
  borderRadius: "2xl",
  border: "1.5px solid #004f4f",
  boxShadow: "0 0 18px #b08d3f44, 0 0 40px #b08d3f22",
};

export const pildora = (texto: string, onClick: () => void, activo: boolean, relleno = false) => (
  <Box as="button" type="button" onClick={onClick} disabled={!activo}
       px={{ base: 6, md: 8 }} py={2.5} borderRadius="full"
       bg={relleno ? "#005F5F" : "transparent"} color={relleno ? "#F0DCC0" : "#005F5F"}
       border="1.5px solid #005F5F"
       fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.04em"
       opacity={activo ? 1 : 0.5} cursor={activo ? "pointer" : "not-allowed"} transition="all 0.2s"
       _hover={activo ? (relleno ? { transform: "translateY(-2px)" } : { bg: "#005F5F14" }) : undefined}
       _focusVisible={{ outline: "2px solid #005F5Fcc", outlineOffset: "2px" }}>
    {texto}
  </Box>
);

/** Los botones de elegir disciplina (con los colores de cada una). */
export const SelectorDisciplina = ({ valor, onCambia }: { valor: string; onCambia: (clave: string) => void }) => (
  <Box display="flex" gap={2} flexWrap="wrap">
    {DISCIPLINAS.map((d) => {
      const sel = valor === d.clave;
      return (
        <Box key={d.clave} as="button" type="button" onClick={() => onCambia(d.clave)} aria-pressed={sel}
             px={3.5} py={1.5} borderRadius="full" fontSize="sm" fontWeight={700} bg={d.bg} color={d.txt}
             border={`2px solid ${sel ? TQ : "transparent"}`}
             opacity={sel ? 1 : 0.8} _hover={{ opacity: 1 }} _focusVisible={{ outline: "2px solid #005F5Fcc", outlineOffset: "2px" }}>
          {d.nombre}
        </Box>
      );
    })}
  </Box>
);
