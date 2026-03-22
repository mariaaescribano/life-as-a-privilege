import React, { useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import {
  API_URL,
  AyurvedaIcon, ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  VataIcon, PittaIcon, KaphaIcon,
  vataColor, pittaColor, kaphaColor,
} from "../../../GlobalVariables";
import { preguntasAyurveda } from "../../../hardCoded/espacio/PreguntasAyurveda";

type Dosha = "vata" | "pitta" | "kapha";

const DOSHA_CONFIG: Record<Dosha, { label: string; color: string; icon: React.ReactNode }> = {
  vata:  { label: "Vata",  color: vataColor,  icon: <VataIcon  size="22px" color={vataColor}  /> },
  pitta: { label: "Pitta", color: pittaColor, icon: <PittaIcon size="22px" color={pittaColor} /> },
  kapha: { label: "Kapha", color: kaphaColor, icon: <KaphaIcon size="22px" color={kaphaColor} /> },
};

const DOSHAS: Dosha[] = ["vata", "pitta", "kapha"];

export default function AyurvedaTestPage({ onComplete }: { onComplete: () => Promise<void> }) {
  const [answers, setAnswers] = useState<(Dosha | null)[]>(preguntasAyurveda.map(() => null));
  const [saving, setSaving] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const answered = answers.filter((a) => a !== null).length;

  const handleSave = async () => {
    if (!allAnswered || saving) return;
    setSaving(true);

    const scores = { vata: 0, pitta: 0, kapha: 0 };
    answers.forEach((a) => { if (a) scores[a]++; });
    const dosha = (Object.keys(scores) as Dosha[]).reduce((a, b) => scores[a] >= scores[b] ? a : b);

    const respuestas = preguntasAyurveda.map((p, i) => ({
      preguntaIdx: i,
      pregunta: p.pregunta,
      doshaElegida: answers[i] as Dosha,
    }));

    const userId = sessionStorage.getItem("userId");
    if (userId) {
      try {
        await axios.post(`${API_URL}/ayurveda/resultado`, {
          userId,
          dosha,
          vataScore:  scores.vata,
          pittaScore: scores.pitta,
          kaphaScore: scores.kapha,
          respuestas,
        });
      } catch (e) {
        console.error("Error guardando resultado Ayurveda:", e);
      }
    }

    try {
      await onComplete();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          gap={{ base: 4, md: 5 }}
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<AyurvedaIcon size={{ base: "36px", md: "52px" }} />}
            title={ayurvedaNom}
            bgColor={ayurvedaBg}
            color={ayurvedaTxt}
            maxW="820px"
          />

          {/* Instrucciones */}
          <Box
            w="100%" maxW="820px"
            bg={ayurvedaBg}
            border={`1px solid ${ayurvedaTxt}33`}
            borderRadius="2xl"
            px={{ base: 5, md: 8 }}
            py={{ base: 5, md: 7 }}
            boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
          >
            <Text color={ayurvedaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.15em" textTransform="uppercase" mb={3}>
              Descubre tu Dosha
            </Text>
            <Text color={ayurvedaTxt} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.9">
              Para cada pregunta, elige la opción que mejor te describa. No hay respuestas correctas ni incorrectas: confía en tu primera impresión.
            </Text>
          </Box>

          {/* Preguntas */}
          {preguntasAyurveda.map((p, qi) => (
            <Box
              key={qi}
              w="100%" maxW="820px"
              bg={ayurvedaBg}
              border={`1px solid ${answers[qi] ? `${DOSHA_CONFIG[answers[qi]!].color}55` : `${ayurvedaTxt}22`}`}
              borderRadius="2xl"
              px={{ base: 5, md: 8 }}
              py={{ base: 5, md: 7 }}
              boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
              transition="border-color 0.3s"
            >
              <Text color={ayurvedaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="600" lineHeight="1.7" mb={4}>
                {qi + 1}. {p.pregunta}
              </Text>

              <Flex direction="column" gap={3}>
                {DOSHAS.map((dosha) => {
                  const cfg = DOSHA_CONFIG[dosha];
                  const selected = answers[qi] === dosha;
                  return (
                    <Box
                      key={dosha}
                      as="button"
                      onClick={() => setAnswers((prev) => { const next = [...prev]; next[qi] = dosha; return next; })}
                      display="flex"
                      alignItems="center"
                      gap={3}
                      px={{ base: 4, md: 5 }}
                      py={{ base: 3, md: 4 }}
                      borderRadius="xl"
                      border={selected ? `2px solid ${cfg.color}` : `1.5px solid ${ayurvedaTxt}22`}
                      bg={selected ? `${cfg.color}12` : "transparent"}
                      cursor="pointer"
                      transition="all 0.18s"
                      textAlign="left"
                      boxShadow={selected ? `0 0 12px ${cfg.color}33` : "none"}
                      _hover={{ bg: `${cfg.color}0d`, borderColor: `${cfg.color}77` }}
                    >
                      <Box flexShrink={0}>{cfg.icon}</Box>
                      <Text
                        color={selected ? cfg.color : ayurvedaTxt}
                        fontSize={{ base: "md", md: "lg" }}
                        fontWeight={selected ? "600" : "400"}
                        lineHeight="1.6"
                        transition="color 0.18s"
                      >
                        {p[dosha]}
                      </Text>
                    </Box>
                  );
                })}
              </Flex>
            </Box>
          ))}

          {/* Botón enviar */}
          <Box w="100%" maxW="820px" textAlign="center" mt={4}>
            {!allAnswered && (
              <Text color="rgba(255,255,255,0.4)" fontSize="md" letterSpacing="0.06em" fontStyle="italic" mb={4}>
                Responde todas las preguntas para ver tu dosha ({answered} / {preguntasAyurveda.length})
              </Text>
            )}
            <Box
              as="button"
              onClick={handleSave}
              px={{ base: 10, md: 14 }}
              py={{ base: 4, md: 5 }}
              borderRadius="full"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              letterSpacing="0.1em"
              fontStyle="italic"
              border={`2px solid ${allAnswered ? ayurvedaTxt : `${ayurvedaTxt}33`}`}
              bg={allAnswered ? ayurvedaBg : "rgba(255,255,255,0.05)"}
              color={allAnswered ? ayurvedaTxt : `${ayurvedaTxt}44`}
              cursor={allAnswered ? "pointer" : "not-allowed"}
              transition="all 0.28s"
              boxShadow={allAnswered ? `0 0 40px ${ayurvedaTxt}44, 0 4px 24px rgba(0,0,0,0.3)` : "none"}
              _hover={allAnswered ? { boxShadow: `0 0 60px ${ayurvedaTxt}77`, transform: "translateY(-2px)" } : {}}
            >
              {saving ? "Guardando..." : "Descubrir mi Dosha →"}
            </Box>
          </Box>
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
