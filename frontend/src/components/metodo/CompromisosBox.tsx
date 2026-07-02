import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Heart } from "lucide-react";
import axios from "axios";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
} from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";

/* ──────────────────────────────────────────────────────────────────────────
 * CompromisosBox — box INLINE con los compromisos que el usuario escribió en la
 * última página de Psicología (las «verdades más sanas» de cada relación, la
 * respuesta a «¿Qué verdad más sana quieres practicar?»). Se trae a «Tu día»
 * de Ayurveda para que no los olvide mientras diseña su día.
 * Si el usuario no tiene compromisos escritos, no renderiza nada.
 * ────────────────────────────────────────────────────────────────────────── */

const TINTA = neuropsicologiaTxt; // marrón tinta de psicología
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

interface Compromiso {
  titulo: string;
  patron: string;
}

export function CompromisosBox() {
  const [compromisos, setCompromisos] = useState<Compromiso[]>([]);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    let cancel = false;
    (async () => {
      try {
        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = psi.data?.data || {};
        const rel = Array.isArray(d.constelaciones) ? d.constelaciones : [];
        const lista: Compromiso[] = rel
          .map((c: any) => ({
            titulo: (c?.titulo || "").trim() || "Relación sin título",
            patron: (c?.verdadSana || "").trim(),
          }))
          .filter((x: Compromiso) => x.patron.length > 0);
        if (!cancel) setCompromisos(lista);
      } catch {
        // silencioso: si no hay datos, simplemente no mostramos el box
      }
    })();
    return () => { cancel = true; };
  }, []);

  if (compromisos.length === 0) return null;

  return (
    <Box
      position="relative"
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={`0 0 16px rgba(255,255,255,0.14), 0 0 34px ${neuropsicologiaBg}55, 0 0 20px ${TINTA}1a`}
      fontFamily="'EB Garamond', serif"
    >
      <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }}>
        <Flex direction="column" align="center" gap={2} mb={5}>
          <Heart size={26} color={TINTA} fill={TINTA} />
          <Text
            color={TINTA}
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="700"
            textAlign="center"
            lineHeight="1.25"
            style={{ textShadow: INK_SHADOW }}
          >
            No olvides tus compromisos contigo mismo
          </Text>
        </Flex>

        <Box h="1px" mb={5} bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

        <Flex direction="column" gap={{ base: 3, md: 3.5 }}>
          {compromisos.map((x, i) => (
            <Box
              key={i}
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              bg="rgba(255,251,243,0.72)"
              border={`1px solid ${TINTA}33`}
              pl={{ base: 5, md: 6 }}
              pr={{ base: 4, md: 5 }}
              py={{ base: 3.5, md: 4 }}
            >
              <Box position="absolute" left="0" top="0" bottom="0" w="4px" bg={TINTA} />
              <Text
                color={TINTA}
                fontSize="2xs"
                fontWeight="700"
                letterSpacing="0.16em"
                textTransform="uppercase"
                opacity={0.7}
                mb={1}
              >
                {x.titulo}
              </Text>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="600" fontStyle="italic" lineHeight="1.5">
                «{x.patron}»
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

export default CompromisosBox;
