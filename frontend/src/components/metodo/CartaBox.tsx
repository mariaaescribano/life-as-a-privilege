import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Mail, Heart } from "lucide-react";
import axios from "axios";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
} from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { Reveal } from "../global/Reveal";

/* ──────────────────────────────────────────────────────────────────────────
 * CartaBox — muestra, en SOLO LECTURA, la «Carta» que el usuario se escribió a
 * sí mismo al final del recorrido de Psicología (data.brujula.mensaje): un
 * mensaje libre a su yo del futuro para los momentos de bloqueo. Se trae a
 * «Tu día» de Ayurveda para que la relea antes de diseñar su día (sentido y
 * coherencia entre disciplinas). No es editable.
 * Si el usuario no tiene carta escrita, no renderiza nada.
 * ────────────────────────────────────────────────────────────────────────── */

const TINTA = neuropsicologiaTxt; // marrón tinta de psicología
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

interface CartaPreg { pregunta: string; respuesta: string }

export function CartaBox() {
  const [mensaje, setMensaje] = useState("");
  // Formato antiguo (recorridos guardados con las cuatro preguntas guía).
  const [preguntas, setPreguntas] = useState<CartaPreg[]>([]);

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
        const b = d.brujula && typeof d.brujula === "object" ? d.brujula : {};
        const msg = (b.mensaje || "").trim();
        const legacy: CartaPreg[] = (
          [
            ["¿Qué herida se ha activado?", b.herida],
            ["¿Qué necesidad hay debajo?", b.necesidad],
            ["¿Qué miedo está hablando?", b.miedo],
            ["¿Qué don puedes utilizar ahora?", b.don],
          ] as [string, unknown][]
        )
          .map(([pregunta, v]) => ({ pregunta, respuesta: (typeof v === "string" ? v : "").trim() }))
          .filter((x) => x.respuesta.length > 0);
        if (!cancel) { setMensaje(msg); setPreguntas(msg ? [] : legacy); }
      } catch {
        // silencioso: si no hay datos, simplemente no mostramos el box
      }
    })();
    return () => { cancel = true; };
  }, []);

  if (!mensaje && preguntas.length === 0) return null;

  return (
    <Reveal inView direction="up" distance={22} duration={0.6} amount={0.12} w="100%">
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
          {/* Corazón (color psicología) a la izquierda del sobre */}
          <Flex align="center" gap={2}>
            <Heart size={22} color={TINTA} fill={TINTA} />
            <Mail size={26} color={TINTA} />
          </Flex>
          <Text
            color={TINTA}
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="700"
            textAlign="center"
            lineHeight="1.25"
            style={{ textShadow: INK_SHADOW }}
          >
            Tu carta para ti
          </Text>
        </Flex>

        <Box h="1px" mb={5} bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

        <Box
          position="relative"
          borderRadius="xl"
          overflow="hidden"
          bg="rgba(255,251,243,0.82)"
          border={`1px solid ${TINTA}40`}
          px={{ base: 5, md: 7 }}
          py={{ base: 5, md: 6 }}
        >
          <Text color={`${TINTA}b0`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mb={3}>
            Para cuando vuelvas a sentirte bloqueado:
          </Text>
          {mensaje ? (
            <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.8" whiteSpace="pre-wrap">
              «{mensaje}»
            </Text>
          ) : (
            <Flex direction="column" gap={{ base: 4, md: 5 }}>
              {preguntas.map((p, i) => (
                <Box key={i}>
                  <Text color={`${TINTA}b0`} fontSize={{ base: "sm", md: "md" }} fontWeight="700" mb={1}>
                    {p.pregunta}
                  </Text>
                  <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.6">
                    «{p.respuesta}»
                  </Text>
                </Box>
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </Box>
    </Reveal>
  );
}

export default CartaBox;
