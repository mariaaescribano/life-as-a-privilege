import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text, Image, SimpleGrid } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { useNavigate } from "react-router-dom";
import { cursosData } from "../../hardCoded/cursos";
import type { Curso, ModalidadInfo } from "../../hardCoded/cursos";
import { TodosLosReels } from "../../components/global/DisciplinaReels";
import {
  neuropsicologiaNom,
  astrologiaNom,
  tcmNomLink,
  cabalaNom,
  nutricionNomLink,
  ayurvedaNomLink,
  fisiologiaNom,
  culturaNomLink,
} from "../../GlobalVariables";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";

const COURSE_ORDER: { modalidadKey: string; cursoId: string }[] = [
  { modalidadKey: fisiologiaNom,         cursoId: "fisio-curso-3"   }, // La fisiología del cáncer
  { modalidadKey: astrologiaNom,         cursoId: "astro-curso-2"   }, // Los Arquetipos
  { modalidadKey: ayurvedaNomLink,       cursoId: "ayu-curso-2"     }, // Los Chakras
  { modalidadKey: neuropsicologiaNom,    cursoId: "padresHeridos"   }, // Padres heridos, bebés heridos
  { modalidadKey: nutricionNomLink,      cursoId: "nut-curso-2"     }, // La Microbiota
  { modalidadKey: fisiologiaNom,         cursoId: "fisio-curso-4"   }, // La neurociencia de la meditación
  { modalidadKey: culturaNomLink,        cursoId: "cul-curso-2"     },
  { modalidadKey: neuropsicologiaNom,    cursoId: "depresion"       },
  { modalidadKey: neuropsicologiaNom,    cursoId: "esquizofrenia"   },
  { modalidadKey: nutricionNomLink,      cursoId: "nut-curso-1"     },
  { modalidadKey: cabalaNom,             cursoId: "cabala-curso-1"  },
  { modalidadKey: astrologiaNom,         cursoId: "astro-curso-0"   },
  { modalidadKey: astrologiaNom,         cursoId: "astro-curso-1"   },
  { modalidadKey: tcmNomLink,            cursoId: "tcm-curso-1"     },
  { modalidadKey: tcmNomLink,            cursoId: "tcm-curso-2"     },
  { modalidadKey: nutricionNomLink,      cursoId: "fito-curso-1"    },
  { modalidadKey: ayurvedaNomLink,       cursoId: "ayu-curso-1"     },
  { modalidadKey: fisiologiaNom,         cursoId: "fisio-curso-1"   },
];

export interface CourseEntry {
  curso: Curso;
  modalidad: ModalidadInfo;
}

function buildCourseList(): CourseEntry[] {
  return COURSE_ORDER.flatMap(({ modalidadKey, cursoId }) => {
    const modalidad = cursosData[modalidadKey];
    if (!modalidad) return [];
    const curso = modalidad.cursos.find((c) => c.id === cursoId);
    if (!curso) return [];
    return [{ curso, modalidad }];
  });
}

const useReveal = (threshold = 0.05) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

// ────────────────────────────────
// COURSE CARD
// ────────────────────────────────
export function CourseCard({ entry, discBg = false, onOpen }: { entry: CourseEntry; discBg?: boolean; onOpen?: () => void }) {
  const { curso, modalidad } = entry;
  const showDiscBg = discBg && hasDisciplinaBg(modalidad.nom);
  const navigate = useNavigate();
  const label =
    curso.precio === null
      ? "Gratis"
      : `${curso.precio.toFixed(2).replace(".", ",")} €`;

  const handleAcceder = () => {
    if (curso.precio === null) {
      navigate(curso.cursoLink);
    } else {
      window.open(STRIPE_PAYMENT_LINK, "_blank");
    }
  };

  return (
    <Flex
      position="relative"
      overflow="hidden"
      bg={modalidad.bgColor}
      borderRadius="2xl"
      border={discBg ? "none" : `1px solid ${modalidad.color}55`}
      boxShadow={discBg ? "none" : `0 0 22px rgba(255,255,255,0.32), 0 0 50px rgba(255,255,255,0.16), 0 0 90px rgba(180,255,245,0.18), 0 0 36px ${modalidad.color}66, 0 4px 22px rgba(0,0,0,0.22)`}
      direction="column"
      p={{ base: 7, md: 8 }}
      h="100%"
      cursor={onOpen ? "pointer" : undefined}
      onClick={onOpen}
    >
      {showDiscBg && <DisciplinaBgLayer nom={modalidad.nom} borderRadius="2xl" />}
      <Flex position="relative" zIndex={1} direction="column" gap={5} h="100%" flex="1">
      {/* Top: icon + título + modalidad */}
      <Flex align="center" gap={4}>
        <Box
          flexShrink={0}
          w={{ base: "60px", md: "68px" }}
          h={{ base: "60px", md: "68px" }}
          borderRadius="full"
          bg={`${modalidad.color}1c`}
          border={`1.5px solid ${modalidad.color}88`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow={discBg ? "none" : `0 0 12px rgba(255,255,255,0.35), 0 0 26px ${modalidad.color}55`}
        >
          {modalidad.icon}
        </Box>
        <Box flex={1}>
          <Text
            color={modalidad.color}
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="700"
            letterSpacing="0.04em"
            lineHeight="1.2"
            style={{ textShadow: `0 0 10px rgba(255,255,255,0.38), 0 0 22px ${modalidad.color}66` }}
          >
            {curso.titulo}
          </Text>
          <Text
            color={`${modalidad.color}cc`}
            fontSize="sm"
            fontWeight="500"
            letterSpacing="0.14em"
            opacity={0.85}
            textTransform="uppercase"
            mt="5px"
            style={{ textShadow: `0 0 8px ${modalidad.color}55` }}
          >
            {modalidad.nom}
          </Text>
        </Box>
      </Flex>

      {/* Foto */}
      <Box
        borderRadius="xl"
        overflow="hidden"
        w="100%"
        aspectRatio={16 / 9}
        boxShadow={discBg ? "none" : `0 8px 26px ${modalidad.color}55, 0 0 18px rgba(255,255,255,0.25)`}
        border={modalidad.nom === astrologiaNom ? `2px solid ${modalidad.color}` : "none"}
      >
        <Image
          src={curso.foto}
          alt={curso.titulo}
          w="100%"
          h="100%"
          display="block"
          objectFit="cover"
        />
      </Box>

      {/* Bottom: price + button */}
      <Flex align="center" justify="space-between" gap={3} mt="auto">
        <Text
          color={modalidad.color}
          fontSize={{ base: "2xl", md: "2xl" }}
          fontWeight="700"
          lineHeight="1"
          style={{ textShadow: `0 0 10px rgba(255,255,255,0.38), 0 0 22px ${modalidad.color}77` }}
        >
          {label}
        </Text>

        <Box
          as="button"
          onClick={(e: React.MouseEvent) => { if (onOpen) { e.stopPropagation(); onOpen(); } else { handleAcceder(); } }}
          color={modalidad.bgColor}
          bg={modalidad.color}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize="md"
          letterSpacing="0.14em"
          textTransform="uppercase"
          px={6}
          py="11px"
          borderRadius="full"
          cursor="pointer"
          flexShrink={0}
          _hover={{ boxShadow: `0 0 22px rgba(255,255,255,0.4), 0 6px 22px ${modalidad.color}88` }}
          transition="box-shadow 0.25s ease"
          boxShadow={`0 0 14px rgba(255,255,255,0.3), 0 4px 16px ${modalidad.color}55`}
        >
          Acceder →
        </Box>
      </Flex>
      </Flex>
    </Flex>
  );
}

// ────────────────────────────────
// PAGE
// ────────────────────────────────
export default function NuevosCursosPage() {
  const [mounted, setMounted] = useState(false);
  const cardsReveal = useReveal(0.04);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const courses = buildCourseList();

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      {/* ── MANDALA SEPARADOR ── */}
      <Flex justify="center" pt={{ base: 10, md: 14 }}>
        <Image
          src="/img/icono/life.png"
          alt=""
          h={{ base: "48px", md: "64px" }}
          objectFit="contain"
          style={{ filter: "drop-shadow(0 0 9px rgba(255,255,255,0.59)) drop-shadow(0 0 21px rgba(255,255,255,0.32)) drop-shadow(0 0 42px rgba(180,255,245,0.24))" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-12deg)"}
          transition="opacity 1s ease 0.1s, transform 1s ease 0.1s"
        />
      </Flex>

      {/* ── TÍTULO ── */}
      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px={{ base: 5, md: 10 }}
        pt={{ base: 6, md: 8 }}
        gap={{ base: 3, md: 4 }}
      >
        <Text
          color="white"
          fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
          fontWeight="700"
          letterSpacing="0.1em"
          lineHeight="1.1"
          textTransform="uppercase"
          textShadow="0 0 14px rgba(255,255,255,0.64), 0 0 30px rgba(255,255,255,0.41), 0 0 56px rgba(180,255,245,0.34)"
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(20px)"}
          transition="opacity 0.85s ease 0.25s, transform 0.85s ease 0.25s"
        >
          Todos los vídeos
        </Text>
        <Text
          color="rgba(255,255,255,0.88)"
          fontSize={{ base: "sm", md: "lg" }}
          fontStyle="italic"
          letterSpacing="0.05em"
          lineHeight="1.5"
          textShadow="0 0 8px rgba(255,255,255,0.38), 0 0 18px rgba(255,255,255,0.21)"
          maxW={{ base: "100%", md: "512px" }}
          opacity={mounted ? 1 : 0}
          transform={mounted ? "translateY(0)" : "translateY(13px)"}
          transition="opacity 0.85s ease 0.5s, transform 0.85s ease 0.5s"
        >
          Material introductorio y complementario de cada disciplina
        </Text>
      </Flex>

      <Flex
        flex={1}
        justify="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 20, md: 24 }}
        pb={{ base: 24, md: 32 }}
      >
        <Box ref={cardsReveal.ref} w="100%" maxW="1280px">
          {/* ── REELS (vídeos verticales de todas las disciplinas) ── */}
          <TodosLosReels />

          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 5, md: 5 }}
          >
            {courses.map((entry, i) => (
              <Box
                key={`${entry.modalidad.nom}-${entry.curso.id}`}
                h="100%"
                opacity={cardsReveal.visible ? 1 : 0}
                transform={cardsReveal.visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.95)"}
                transition={`opacity 0.6s ease ${(i % 6) * 0.08}s, transform 0.6s ease ${(i % 6) * 0.08}s`}
              >
                <CourseCard entry={entry} />
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
