import React, { useState, useEffect } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MetodoStepHeader } from "../../metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../global/DisciplinaBgLayer";
import { HinduismoIlustracionesModal } from "../../metodo/HinduismoIlustracionesModal";
import { Reveal, RevealStagger, RevealItem } from "../../global/Reveal";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import {
  API_URL,
  AyurvedaIcon, ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  VataIcon, PittaIcon, KaphaIcon,
  vataColor, pittaColor, kaphaColor,
} from "../../../GlobalVariables";
import { preguntasAyurveda } from "../../../hardCoded/espacio/PreguntasAyurveda";
import { usePreguntasAyurveda } from "../../../hardCoded/espacio/usePreguntasAyurveda";
import { generateAyurvedaPdf } from "../../../utils/generateAyurvedaPdf";
import { useDoshaConsejos } from "../../../hardCoded/espacio/useDoshaConsejos";
import { generateDoshaConsejosPdf } from "../../../utils/generateDoshaConsejosPdf";
import { useT } from "../../../i18n";

type Dosha = "vata" | "pitta" | "kapha";
const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";

const DOSHA_CONFIG: Record<Dosha, { label: string; color: string; icon: React.ReactNode }> = {
  vata:  { label: "Vata",  color: vataColor,  icon: <VataIcon  size="22px" color={vataColor}  /> },
  pitta: { label: "Pitta", color: pittaColor, icon: <PittaIcon size="22px" color={pittaColor} /> },
  kapha: { label: "Kapha", color: kaphaColor, icon: <KaphaIcon size="22px" color={kaphaColor} /> },
};

const DOSHAS: Dosha[] = ["vata", "pitta", "kapha"];

type GuestResult = { dosha: Dosha; scores: Record<Dosha, number> };

export default function AyurvedaTestPage({
  onComplete,
  isGuest = false,
  prevTo = "/aprendizaje/cursos/ayurveda",
  prevLabel,
  pageLabel,
  headerNext,
}: {
  onComplete?: () => Promise<void>;
  isGuest?: boolean;
  /** Destino del botón "← Volver". Por defecto, la página del curso de Ayurveda.
   *  En el recorrido del Método se pasa "/metodo/ayurveda" para no salir del flujo. */
  prevTo?: string;
  /** Etiqueta del botón "atrás" (en el recorrido se usa la palabra clave de la página). */
  prevLabel?: string;
  /** Número de paso dentro de El Recorrido (p.ej. "2/—"). Solo se muestra en el
   *  flujo del recorrido; en uso suelto (curso/espacio) se deja sin número. */
  pageLabel?: string;
  /** Botón "siguiente" del header (recorrido). Si se pasa, "Ilustraciones" se
   *  mueve al centro (extra) y este botón ocupa la derecha. */
  headerNext?: { label: string; onClick: () => void; disabled?: boolean; disabledTooltip?: string; icon?: React.ReactNode };
}) {
  const t = useT();
  // Las preguntas y los consejos que se PINTAN. Lo que se guarda en la base de
  // datos y lo que sale en el PDF sigue saliendo de `preguntasAyurveda`, en
  // español, para que el histórico no quede a medias en dos idiomas.
  const preguntas = usePreguntasAyurveda();
  const doshaConsejos = useDoshaConsejos();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<(Dosha | null)[]>(preguntasAyurveda.map(() => null));
  const [saving, setSaving] = useState(false);
  const [guestResult, setGuestResult] = useState<GuestResult | null>(null);
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const answered = answers.filter((a) => a !== null).length;

  // Al mostrar el resultado, sube la ventana arriba para ver el primer texto.
  useEffect(() => {
    if (guestResult) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [guestResult]);

  const handleSave = async () => {
    if (!allAnswered || saving) return;
    setSaving(true);

    const scores = { vata: 0, pitta: 0, kapha: 0 };
    answers.forEach((a) => { if (a) scores[a]++; });
    const dosha = (Object.keys(scores) as Dosha[]).reduce((a, b) => scores[a] >= scores[b] ? a : b);

    if (isGuest) {
      setGuestResult({ dosha, scores });
      setSaving(false);
      return;
    }

    const respuestas = preguntasAyurveda.map((p, i) => ({
      preguntaIdx: i,
      pregunta: p.pregunta,
      doshaElegida: answers[i] as Dosha,
    }));

    const userId = localStorage.getItem("userId");
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
      await onComplete?.();
    } finally {
      setSaving(false);
    }
  };

  if (guestResult) {
    const total = preguntasAyurveda.length;
    const cfg = DOSHA_CONFIG[guestResult.dosha];
    return (
      <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="auto" />
        <Box flex="1">
          <Flex
            direction="column"
            alignItems="center"
            gap={{ base: 4, md: 5 }}
            px={{ base: 5, md: 10, lg: 16 }}
            pt={{ base: 10, md: 14 }}
            pb={{ base: 14, md: 20 }}
          >
            <MetodoStepHeader
              icon={<AyurvedaIcon size={{ base: "40px", md: "56px" }} />}
              title={t("espacio.test.doshas")}
              pageLabel={pageLabel}
              bgColor={`${ayurvedaBg}dd`}
              color={ayurvedaTxt}
              nom={ayurvedaNom}
              mb={{ base: 0, md: 0 }}
              prev={{ label: prevLabel ?? `← ${t("comun.volver")}`, onClick: () => navigate(prevTo) }}
              extra={headerNext ? { label: t("metodo.ilustraciones"), onClick: () => setIlustracionesOpen(true)} : undefined}
              next={headerNext ?? { label: t("metodo.ilustraciones"), onClick: () => setIlustracionesOpen(true)}}
            />

            {/* Resultado principal */}
            <Box
              position="relative"
              overflow="hidden"
              w="100%" maxW="850px"
              borderRadius="2xl"
              boxShadow={GLOW}
              textAlign="center"
            >
              <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}22`} />
              <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>
                <Text color={ayurvedaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.15em" textTransform="uppercase" mb={4}>
                  {t("espacio.test.doshaPrincipal")}
                </Text>
                <Flex align="center" justify="center" gap={3} mb={5}>
                  <Box>{DOSHA_CONFIG[guestResult.dosha].icon && React.cloneElement(DOSHA_CONFIG[guestResult.dosha].icon as React.ReactElement<any>, { size: "38px" })}</Box>
                  <Text color={cfg.color} fontSize={{ base: "4xl", md: "5xl" }} fontWeight="700" letterSpacing="0.1em" fontStyle="italic">
                    {cfg.label}
                  </Text>
                </Flex>

                {/* Barras de puntuación */}
                {DOSHAS.map((d) => {
                  const pct = Math.round((guestResult.scores[d] / total) * 100);
                  const dc = DOSHA_CONFIG[d];
                  return (
                    <Box key={d} mb={3} textAlign="left">
                      <Flex justify="space-between" mb={1}>
                        <Text color={dc.color} fontWeight="600" fontSize="md">{dc.label}</Text>
                        <Text color={dc.color} fontWeight="600" fontSize="md">{guestResult.scores[d]} / {total}</Text>
                      </Flex>
                      <Box bg={`${dc.color}22`} borderRadius="full" h="8px" overflow="hidden">
                        <Box bg={dc.color} h="100%" borderRadius="full" w={`${pct}%`} transition="width 0.6s ease" />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Botones */}
            <Flex gap={4} flexWrap="wrap" justify="center" mt={2}>
              <Box
                as="button"
                onClick={() => {
                  const respuestas = answers.map((dosha, idx) => ({
                    pregunta_idx: idx,
                    pregunta: preguntasAyurveda[idx].pregunta,
                    dosha_elegida: dosha!,
                  }));
                  generateAyurvedaPdf(respuestas, guestResult.dosha, guestResult.scores);
                }}
                position="relative"
                overflow="hidden"
                px={{ base: 8, md: 12 }}
                py={{ base: 3, md: 4 }}
                borderRadius="full"
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                letterSpacing="0.08em"
                bg="transparent"
                color={ayurvedaTxt}
                border={`1.5px solid ${ayurvedaTxt}60`}
                cursor="pointer"
                transition="all 0.22s"
                boxShadow={GLOW}
                _hover={{ opacity: 0.88, transform: "translateY(-2px)", borderColor: ayurvedaTxt }}
              >
                <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="full" overlay={`${ayurvedaBg}22`} />
                <Box as="span" position="relative" zIndex={1}>{t("espacio.dosha.descargarPdf")}</Box>
              </Box>
              <Box
                as="button"
                onClick={() => { setGuestResult(null); setAnswers(preguntasAyurveda.map(() => null)); }}
                px={{ base: 8, md: 12 }}
                py={{ base: 3, md: 4 }}
                borderRadius="full"
                fontFamily="'EB Garamond', serif"
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="700"
                letterSpacing="0.08em"
                border={`2px solid ${ayurvedaTxt}55`}
                bg="transparent"
                color={ayurvedaTxt}
                cursor="pointer"
                transition="all 0.22s"
                _hover={{ opacity: 0.88, transform: "translateY(-2px)", borderColor: ayurvedaTxt }}
              >
                {t("espacio.test.recalcular")}
              </Box>
            </Flex>

            {/* Consejos personalizados */}
            {(() => {
              const recs = doshaConsejos[guestResult.dosha];
              if (!recs) return null;
              const categories = [
                { key: "alimentacion" as const, label: t("espacio.cons.alimentacion") },
                { key: "hierbas" as const, label: t("espacio.cons.hierbas") },
                { key: "estiloDeVida" as const, label: t("espacio.cons.estiloDeVida") },
                { key: "evitar" as const, label: t("espacio.cons.evitar") },
              ];
              return (
                <Box w="100%" maxW="850px" mt={4}>
                  <Box
                    position="relative"
                    overflow="hidden"
                    borderRadius="2xl"
                    mb={4}
                    boxShadow={GLOW}
                  >
                    <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}22`} />
                    <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 5, md: 6 }}>
                      <Text
                        color={ayurvedaTxt}
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="700"
                        letterSpacing="0.08em"
                        textAlign="center"
                        fontFamily="'EB Garamond', serif"
                      >
                        {t("espacio.test.consejos")}
                      </Text>
                    </Box>
                  </Box>

                  {/* Descripción */}
                  <Box
                    position="relative"
                    overflow="hidden"
                    borderRadius="2xl"
                    mb={4}
                    boxShadow={GLOW}
                  >
                    <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}22`} />
                    <Box position="relative" zIndex={1} px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }}>
                      <Text
                        color={`${ayurvedaTxt}cc`}
                        fontSize={{ base: "md", md: "lg" }}
                        fontFamily="'EB Garamond', serif"
                        lineHeight="1.8"
                        fontStyle="italic"
                        textAlign="center"
                      >
                        {recs.descripcion}
                      </Text>
                    </Box>
                  </Box>

                  <Flex direction="column" gap={4}>
                    {categories.map(({ key, label }) => {
                      const items = recs[key];
                      if (!items || items.length === 0) return null;
                      return (
                        <Box
                          key={key}
                          position="relative"
                          overflow="hidden"
                          borderRadius="2xl"
                          boxShadow={GLOW}
                        >
                          <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}22`} />
                          <Box position="relative" zIndex={1} px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }}>
                            <Text
                              color={ayurvedaTxt}
                              fontSize={{ base: "xl", md: "2xl" }}
                              fontWeight="700"
                              fontFamily="'EB Garamond', serif"
                              letterSpacing="0.06em"
                              mb={4}
                            >
                              {label}
                            </Text>
                            <Flex direction="column" gap={2}>
                              {items.map((item, j) => (
                                <Flex key={j} align="flex-start" gap={2.5}>
                                  <Text color={`${ayurvedaTxt}66`} fontSize="md" mt="2px" flexShrink={0}>·</Text>
                                  <Text
                                    color={`${ayurvedaTxt}cc`}
                                    fontSize={{ base: "md", md: "lg" }}
                                    fontFamily="'EB Garamond', serif"
                                    lineHeight="1.7"
                                  >
                                    {item}
                                  </Text>
                                </Flex>
                              ))}
                            </Flex>
                          </Box>
                        </Box>
                      );
                    })}
                  </Flex>

                  {/* Descargar consejos */}
                  <Flex justify="center" mt={6}>
                    <Box
                      as="button"
                      position="relative"
                      overflow="hidden"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      gap={2}
                      onClick={() => generateDoshaConsejosPdf(guestResult.dosha, recs)}
                      px={{ base: 8, md: 10 }}
                      py={{ base: 3, md: 4 }}
                      borderRadius="full"
                      fontFamily="'EB Garamond', serif"
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="700"
                      letterSpacing="0.08em"
                      border={`2px solid ${ayurvedaTxt}`}
                      bg="transparent"
                      color={ayurvedaTxt}
                      cursor="pointer"
                      transition="all 0.22s"
                      boxShadow={GLOW}
                    >
                      <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="full" overlay={`${ayurvedaBg}22`} />
                      <Box as="span" position="relative" zIndex={1} display="flex" alignItems="center" gap={2}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor" style={{ flexShrink: 0 }}>
                          <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/>
                        </svg>
                        {t("espacio.test.descargarConsejos")}
                      </Box>
                    </Box>
                  </Flex>
                </Box>
              );
            })()}
          </Flex>
        </Box>
        <HinduismoIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />
        <SiteFooter />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          gap={{ base: 4, md: 5 }}
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <MetodoStepHeader
            icon={<AyurvedaIcon size={{ base: "40px", md: "56px" }} />}
            title={t("espacio.test.doshas")}
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={{ base: 0, md: 0 }}
            prev={{ label: prevLabel ?? `← ${t("comun.volver")}`, onClick: () => navigate(prevTo) }}
            next={{ label: t("metodo.ilustraciones"), onClick: () => setIlustracionesOpen(true)}}
          />

          {/* Instrucciones */}
          <Box
            position="relative"
            overflow="hidden"
            w="100%" maxW="850px"
            mt="20px"
            borderRadius="2xl"
            boxShadow={GLOW}
          >
            <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}22`} />
            <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 5, md: 7 }}>
              <Text color={ayurvedaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.15em" textTransform="uppercase" mb={3}>
                {t("espacio.test.descubreDosha")}
              </Text>
              <Text color={ayurvedaTxt} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.9">
                {t("espacio.test.eligeOpcion")}
              </Text>
            </Box>
          </Box>

          {/* Preguntas · cada box va apareciendo al bajar (los visibles ya salen al cargar) */}
          {preguntas.map((p, qi) => (
            <Reveal key={qi} inView direction="up" distance={26} duration={0.5} amount={0.15} w="100%" maxW="850px">
            <Box
              position="relative"
              overflow="hidden"
              w="100%" maxW="850px"
              borderRadius="2xl"
              boxShadow={GLOW}
            >
              <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}22`} />
              <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 5, md: 7 }}>
                {/* Cascada interna: primero la pregunta, luego las 3 opciones de
                    una en una (más dinámico y profesional). Arranca al asomar el
                    box en pantalla. */}
                <RevealStagger inView stagger={0.09} delayChildren={0.05} amount={0.15}>
                  <RevealItem distance={16} duration={0.5}>
                    <Text color={ayurvedaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="600" lineHeight="1.7" mb={4}>
                      {qi + 1}. {p.pregunta}
                    </Text>
                  </RevealItem>

                  <Flex direction="column" gap={3}>
                    {DOSHAS.map((dosha) => {
                      const cfg = DOSHA_CONFIG[dosha];
                      const selected = answers[qi] === dosha;
                      return (
                        <RevealItem key={dosha} distance={16} duration={0.5} w="100%">
                        <Box
                          as="button"
                          w="100%"
                          onClick={() => setAnswers((prev) => { const next = [...prev]; next[qi] = dosha; return next; })}
                          display="flex"
                          alignItems="center"
                          gap={3}
                          px={{ base: 4, md: 5 }}
                          py={{ base: 3, md: 4 }}
                          borderRadius="xl"
                          border={selected ? `2px solid ${cfg.color}` : "1px solid rgba(255,255,255,0.18)"}
                          bg={selected ? `${cfg.color}33` : "rgba(255,255,255,0.10)"}
                          cursor="pointer"
                          transition="all 0.18s"
                          textAlign="left"
                          boxShadow={selected ? `0 0 12px ${cfg.color}55` : "none"}
                          sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
                          _hover={{ bg: selected ? `${cfg.color}44` : "rgba(255,255,255,0.18)", borderColor: `${cfg.color}88` }}
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
                        </RevealItem>
                      );
                    })}
                  </Flex>
                </RevealStagger>
              </Box>
            </Box>
            </Reveal>
          ))}

          {/* Botón enviar */}
          <Box w="100%" maxW="850px" textAlign="center" mt={4}>
            {!allAnswered && (
              <Text color="rgba(255,255,255,0.4)" fontSize="md" letterSpacing="0.06em" fontStyle="italic" mb={4}>
                {t("espacio.ayur.responde", { hechas: answered, total: preguntas.length })}
              </Text>
            )}
            <Box
              as="button"
              onClick={handleSave}
              position="relative"
              overflow="hidden"
              px={{ base: 10, md: 14 }}
              py={{ base: 4, md: 5 }}
              borderRadius="full"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              letterSpacing="0.1em"
              fontStyle="italic"
              border={`2px solid ${allAnswered ? ayurvedaTxt : `${ayurvedaTxt}33`}`}
              bg={allAnswered ? "transparent" : "rgba(255,255,255,0.05)"}
              color={allAnswered ? ayurvedaTxt : `${ayurvedaTxt}44`}
              cursor={allAnswered ? "pointer" : "not-allowed"}
              transition="all 0.28s"
              boxShadow={allAnswered ? GLOW : "none"}
              _hover={{}}
            >
              {allAnswered && <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="full" overlay={`${ayurvedaBg}22`} />}
              <Flex as="span" align="center" justify="center" gap={3} position="relative" zIndex={1}>
                <AyurvedaIcon size={{ base: "22px", md: "26px" }} />
                {saving ? "Guardando..." : "Descubrir mi Doṣha →"}
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Box>

      <HinduismoIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />
      <SiteFooter />
    </Box>
  );
}
