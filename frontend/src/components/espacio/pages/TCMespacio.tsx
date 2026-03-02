import React, { useEffect, useState } from "react";
import { Box, Collapse, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../global/SiteHeader";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { tcmBg, TCMIcon, tcmTxt } from "../../../GlobalVariables";

/* ══════════════════════════════════════════════
   DATOS DE TESTS
══════════════════════════════════════════════ */
const tests = [
  {
    id: 1,
    label: "Conoce tu constitución",
    link: "/tcm/test/1",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 -960 960 960" width="44px" fill={tcmTxt}>
        <path d="M343.5-743.5Q320-767 320-800t23.5-56.5Q367-880 400-880t56.5 23.5Q480-833 480-800t-23.5 56.5Q433-720 400-720t-56.5-23.5ZM731-269q29-29 29-71t-29-71q-29-29-71-29t-71 29q-29 29-29 71t29 71q29 29 71 29t71-29ZM864-80 756-188q-22 14-46 21t-50 7q-75 0-127.5-52.5T480-340q0-75 52.5-127.5T660-520q75 0 127.5 52.5T840-340q0 26-7 50t-21 46l108 108-56 56Zm-424 0v-121q15 24 35.5 44t44.5 36v41h-80Zm-160 0v-520q-61-5-121-14.5T40-640l20-80q84 23 168.5 31.5T400-680q87 0 171.5-8.5T740-720l20 80q-59 16-119 25.5T520-600v41q-54 35-87 92.5T400-340v10q0 5 1 10h-41v240h-80Z"/>
      </svg>
    ),
  },
  {
    id: 2,
    label: "Tu elemento predominante",
    link: "/tcm/test/2",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 -960 960 960" width="44px" fill={tcmTxt}>
        <path d="M480-480Zm0 360q-18 0-34.5-6.5T416-146L148-415q-35-35-51.5-80T80-589q0-103 67-177t167-74q48 0 90.5 19t75.5 53q32-34 74.5-53t90.5-19q100 0 167.5 74T880-590q0 49-17 94t-51 80L543-146q-13 13-29 19.5t-34 6.5Zm40-520q10 0 19 5t14 13l68 102h166q7-17 10.5-34.5T801-590q-2-69-46-118.5T645-758q-31 0-59.5 12T536-711l-27 29q-5 6-13 9.5t-16 3.5q-8 0-16-3.5t-14-9.5l-27-29q-21-23-49-36t-60-13q-66 0-110 50.5T160-590q0 18 3 35.5t10 34.5h187q10 0 19 5t14 13l35 52 54-162q4-12 14.5-20t23.5-8Zm12 130-54 162q-4 12-15 20t-24 8q-10 0-19-5t-14-13l-68-102H236l237 237q2 2 3.5 2.5t3.5.5q2 0 3.5-.5t3.5-2.5l236-237H600q-10 0-19-5t-15-13l-34-52Z"/>
      </svg>
    ),
  },
  {
    id: 3,
    label: "Tu desequilibrio actual",
    link: "/tcm/test/3",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="44px" viewBox="0 -960 960 960" width="44px" fill={tcmTxt}>
        <path d="M824-120 636-308q-41 32-90.5 50T440-240q-90 0-162.5-44T163-400h98q34 37 79.5 58.5T440-320q100 0 170-70t70-170q0-100-70-170t-170-70q-94 0-162.5 63.5T201-580h-80q8-127 99.5-213.5T440-880q134 0 227 93t93 227q0 56-18 105.5T692-364l188 188-56 56ZM397-400l-63-208-52 148H80v-60h160l66-190h60l61 204 43-134h60l60 120h30v60h-67l-47-94-50 154h-59Z"/>
      </svg>
    ),
  },
];

/* ══════════════════════════════════════════════
   SEPARADOR DECORATIVO ENTRE SECCIONES
══════════════════════════════════════════════ */
const SectionDivider = () => (
  <Flex align="center" gap={3} w="100%" maxW="900px" my={{ base: 10, md: 14 }}>
    <Box flex="1" h="1px" bg={`${tcmTxt}22`} borderRadius="full" />
    <Text color={`${tcmTxt}55`} fontSize="10px" letterSpacing="0.3em">✦</Text>
    <Box flex="1" h="1px" bg={`${tcmTxt}22`} borderRadius="full" />
  </Flex>
);

/* ══════════════════════════════════════════════
   COMPONENTE DE SECCIÓN: vídeo + descripción + transcript
══════════════════════════════════════════════ */
type VideoSectionProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  transcript?: string;
  video?: string;   // ID de YouTube — e.g. "dQw4w9WgXcQ"
};

const VideoSection = ({ icon, title, subtitle, description, transcript, video }: VideoSectionProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Flex direction="column" alignItems="center" w="100%" maxW="900px" gap={{ base: 4, md: 5 }}>

      {/* ── Encabezado de sección ── */}
      <Flex
        w="100%"
        align="center"
        gap={4}
        px={{ base: 2, md: 4 }}
      >
        <Box
          w={{ base: "46px", md: "54px" }}
          h={{ base: "46px", md: "54px" }}
          borderRadius="full"
          bg={tcmBg}
          border={`2px solid ${tcmTxt}55`}
          boxShadow={`0 0 18px ${tcmTxt}33`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          {icon}
        </Box>

        <Box>
          <Text
            color={`${tcmTxt}77`}
            fontSize="xs"
            letterSpacing="0.22em"
            textTransform="uppercase"
            fontFamily="'EB Garamond', serif"
            lineHeight="1"
            mb={0.5}
          >
            {subtitle}
          </Text>
          <Text
            color={tcmTxt}
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            fontFamily="'EB Garamond', serif"
            lineHeight="1.1"
            letterSpacing="0.04em"
          >
            {title}
          </Text>
        </Box>
      </Flex>

      {/* ── Vídeo ── */}
      <Box
        w="100%"
        aspectRatio={16 / 9}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 8px 40px rgba(0,0,0,0.45), 0 0 30px rgba(218,113,113,0.25)"
        bg="rgba(0,0,0,0.45)"
      >
        {/* TODO: sustituir src por la URL del vídeo cuando esté lista */}
        <iframe
          style={{ width: "100%", height: "100%", border: "none" }}
          src={video ? `https://www.youtube.com/embed/${video}` : ""}
          title={title}
          allowFullScreen
        />
      </Box>

      {/* ── Descripción ── */}
      <Box
        w="100%"
        bg={tcmBg + "99"}
        border={`1px solid ${tcmTxt}44`}
        borderRadius="2xl"
        px={{ base: 7, md: 12 }}
        py={{ base: 6, md: 7 }}
        sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <Flex justify="center" gap={2} mb={4}>
          <Box w="16px" h="1px" borderRadius="full" bg={`${tcmTxt}55`} />
          <Box w="32px" h="1px" borderRadius="full" bg={`${tcmTxt}99`} />
          <Box w="16px" h="1px" borderRadius="full" bg={`${tcmTxt}55`} />
        </Flex>

        <Text
          fontSize={{ base: "lg", md: "xl" }}
          color={tcmTxt}
          lineHeight="1.95"
          fontStyle="italic"
          letterSpacing="0.025em"
          textAlign="center"
        >
          {description}
        </Text>

        <Flex justify="center" gap={2} mt={4}>
          <Box w="16px" h="1px" borderRadius="full" bg={`${tcmTxt}55`} />
          <Box w="32px" h="1px" borderRadius="full" bg={`${tcmTxt}99`} />
          <Box w="16px" h="1px" borderRadius="full" bg={`${tcmTxt}55`} />
        </Flex>
      </Box>

      {/* ── Transcripción plegable ── */}
      <Box w="100%">
        <Flex
          as="button"
          w="100%"
          align="center"
          justify="space-between"
          px={{ base: 6, md: 10 }}
          py={{ base: 3, md: 4 }}
          bg={tcmBg + "99"}
          border={`1px solid ${tcmTxt}44`}
          borderRadius={open ? "2xl 2xl 0 0" : "2xl"}
          cursor="pointer"
          onClick={() => setOpen(!open)}
          sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          transition="border-radius 0.2s"
        >
          <Text color={tcmTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="600" letterSpacing="0.04em">
            Transcripción
          </Text>
          <Text
            color={tcmTxt}
            fontSize="xl"
            transition="transform 0.25s"
            transform={open ? "rotate(180deg)" : "rotate(0deg)"}
          >
            ▾
          </Text>
        </Flex>

        <Collapse in={open} animateOpacity>
          <Box
            px={{ base: 6, md: 10 }}
            py={{ base: 5, md: 7 }}
            bg={tcmBg + "66"}
            border={`1px solid ${tcmTxt}33`}
            borderTop="none"
            borderRadius="0 0 2xl 2xl"
            sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          >
            {transcript ? (
              <Text
                color={tcmTxt}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="2"
                letterSpacing="0.02em"
                whiteSpace="pre-wrap"
              >
                {transcript}
              </Text>
            ) : (
              <Text
                color={`${tcmTxt}66`}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="2"
                fontStyle="italic"
                textAlign="center"
              >
                La transcripción estará disponible próximamente.
              </Text>
            )}
          </Box>
        </Collapse>
      </Box>

    </Flex>
  );
};

/* ══════════════════════════════════════════════
   ICONOS PEQUEÑOS PARA CABECERAS DE SECCIÓN
══════════════════════════════════════════════ */
const IconConstitucion = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill={tcmTxt}>
    <path d="M343.5-743.5Q320-767 320-800t23.5-56.5Q367-880 400-880t56.5 23.5Q480-833 480-800t-23.5 56.5Q433-720 400-720t-56.5-23.5ZM731-269q29-29 29-71t-29-71q-29-29-71-29t-71 29q-29 29-29 71t29 71q29 29 71 29t71-29ZM864-80 756-188q-22 14-46 21t-50 7q-75 0-127.5-52.5T480-340q0-75 52.5-127.5T660-520q75 0 127.5 52.5T840-340q0 26-7 50t-21 46l108 108-56 56Zm-424 0v-121q15 24 35.5 44t44.5 36v41h-80Zm-160 0v-520q-61-5-121-14.5T40-640l20-80q84 23 168.5 31.5T400-680q87 0 171.5-8.5T740-720l20 80q-59 16-119 25.5T520-600v41q-54 35-87 92.5T400-340v10q0 5 1 10h-41v240h-80Z"/>
  </svg>
);

const IconElemento = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill={tcmTxt}>
    <path d="M480-480Zm0 360q-18 0-34.5-6.5T416-146L148-415q-35-35-51.5-80T80-589q0-103 67-177t167-74q48 0 90.5 19t75.5 53q32-34 74.5-53t90.5-19q100 0 167.5 74T880-590q0 49-17 94t-51 80L543-146q-13 13-29 19.5t-34 6.5Zm40-520q10 0 19 5t14 13l68 102h166q7-17 10.5-34.5T801-590q-2-69-46-118.5T645-758q-31 0-59.5 12T536-711l-27 29q-5 6-13 9.5t-16 3.5q-8 0-16-3.5t-14-9.5l-27-29q-21-23-49-36t-60-13q-66 0-110 50.5T160-590q0 18 3 35.5t10 34.5h187q10 0 19 5t14 13l35 52 54-162q4-12 14.5-20t23.5-8Zm12 130-54 162q-4 12-15 20t-24 8q-10 0-19-5t-14-13l-68-102H236l237 237q2 2 3.5 2.5t3.5.5q2 0 3.5-.5t3.5-2.5l236-237H600q-10 0-19-5t-15-13l-34-52Z"/>
  </svg>
);

const IconDesequilibrio = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill={tcmTxt}>
    <path d="M824-120 636-308q-41 32-90.5 50T440-240q-90 0-162.5-44T163-400h98q34 37 79.5 58.5T440-320q100 0 170-70t70-170q0-100-70-170t-170-70q-94 0-162.5 63.5T201-580h-80q8-127 99.5-213.5T440-880q134 0 227 93t93 227q0 56-18 105.5T692-364l188 188-56 56ZM397-400l-63-208-52 148H80v-60h160l66-190h60l61 204 43-134h60l60 120h30v60h-67l-47-94-50 154h-59Z"/>
  </svg>
);

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════ */
export default function TCMespacio() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<TCMIcon size={{ base: "40px", md: "60px" }} />}
            title="Medicina China"
            bgColor={tcmBg}
            color={tcmTxt}
            maxW="700px"
          />

          {/* ══ TESTS ══ */}
          <Box
            w="100%"
            maxW="900px"
            bg={tcmBg}
            border="1px solid rgba(218,113,113,0.22)"
            borderRadius="3xl"
            px={{ base: 6, md: 10 }}
            pt={{ base: 8, md: 10 }}
            pb={{ base: 8, md: 10 }}
            mb={{ base: 10, md: 14 }}
            boxShadow="0 6px 48px rgba(0,0,0,0.22), 0 0 60px rgba(107,4,4,0.18)"
          >
            <Flex justify="center" align="center" gap={3} mb={{ base: 8, md: 10 }}>
              <Box color={tcmTxt} filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))" flexShrink={0}>
                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill={tcmTxt}>
                  <path d="M440-120v-319q-64 0-123-24.5T213-533q-45-45-69-104t-24-123v-80h80q63 0 122 24.5T426-746q31 31 51.5 68t31.5 79q5-7 11-13.5t13-13.5q45-45 104-69.5T760-720h80v80q0 64-24.5 123T746-413q-45 45-103.5 69T520-320v200h-80Zm0-400q0-48-18.5-91.5T369-689q-34-34-77.5-52.5T200-760q0 48 18 92t52 78q34 34 78 52t92 18Zm80 120q48 0 91.5-18t77.5-52q34-34 52.5-78t18.5-92q-48 0-92 18.5T590-569q-34 34-52 77.5T520-400Z"/>
                </svg>
              </Box>
              <Text
                color={tcmTxt}
                fontSize={{ base: "3xl", md: "4xl" }}
                lineHeight="1"
                textAlign="center"
                fontWeight="700"
                letterSpacing="0.05em"
                filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
              >
                Tests para el Autoconocimiento
              </Text>
            </Flex>

            <SimpleGrid w="100%" columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 5 }}>
              {tests.map((t) => (
                <Flex
                  key={t.id}
                  align="center"
                  justify="center"
                  gap={3}
                  bg={tcmBg}
                  border="1px solid rgba(218,113,113,0.35)"
                  borderRadius="2xl"
                  px={{ base: 6, md: 5 }}
                  py={10}
                  cursor="pointer"
                  boxShadow="0 4px 24px rgba(0,0,0,0.25), 0 0 18px rgba(107,4,4,0.38)"
                  transition="all 0.22s ease"
                  _hover={{
                    bg: "rgba(107,4,4,0.68)",
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 36px rgba(0,0,0,0.32), 0 0 30px rgba(107,4,4,0.55)",
                  }}
                  onClick={() => navigate(t.link)}
                >
                  <Box flexShrink={0}>{t.icon}</Box>
                  <Text
                    color={tcmTxt}
                    fontSize={{ base: "lg", md: "md", lg: "lg" }}
                    fontWeight="500"
                    letterSpacing="0.06em"
                    textAlign="left"
                    lineHeight="1.4"
                  >
                    {t.label}
                  </Text>
                </Flex>
              ))}
            </SimpleGrid>
          </Box>

          {/* ══ SECCIÓN 1: CONSTITUCIÓN ══ */}
          <VideoSection
            icon={<IconConstitucion />}
            subtitle="Test 1"
            title="Tu Constitución"
            description="En la Medicina Tradicional China, la constitución es la naturaleza energética con la que nacemos. Determina nuestra fortaleza vital, nuestras tendencias de salud y la manera en que respondemos al entorno. Conocerla es el primer paso para vivir en armonía con uno mismo."
            video={undefined /* TODO: añadir ID de YouTube */}
            transcript={undefined /* TODO: añadir transcripción */}
          />

          <SectionDivider />

          {/* ══ SECCIÓN 2: ELEMENTO PREDOMINANTE ══ */}
          <VideoSection
            icon={<IconElemento />}
            subtitle="Test 2"
            title="Tu Elemento Predominante"
            description="Los cinco elementos —Madera, Fuego, Tierra, Metal y Agua— son las grandes fuerzas que estructuran toda la vida. Cada persona expresa uno de ellos con mayor intensidad, lo que moldea su carácter, sus emociones y su manera de enfermar. Identificar el tuyo ilumina el camino hacia el equilibrio."
            video={undefined /* TODO: añadir ID de YouTube */}
            transcript={undefined /* TODO: añadir transcripción */}
          />

          <SectionDivider />

          {/* ══ SECCIÓN 3: DESEQUILIBRIO ACTUAL ══ */}
          <VideoSection
            icon={<IconDesequilibrio />}
            subtitle="Test 3"
            title="Tu Desequilibrio Actual"
            description="El desequilibrio no es un fallo, sino una señal. En TCM, los síntomas físicos, emocionales y mentales son el lenguaje con el que el cuerpo pide atención. Este test te ayuda a detectar qué patrón de disarmonía está presente ahora mismo, para poder actuar con precisión y compasión."
            video={undefined /* TODO: añadir ID de YouTube */}
            transcript={undefined /* TODO: añadir transcripción */}
          />

        </Flex>
      </Box>

      {/* ── FOOTER ── */}
      <Box
        as="footer"
        borderTop="1px solid rgba(255,255,255,0.1)"
        px={{ base: 6, md: 16 }}
        py={{ base: 8, md: 10 }}
      >
        <Text
          color="rgba(255,255,255,0.38)"
          fontSize="xs"
          letterSpacing="0.05em"
          textAlign="center"
        >
          © 2026 Life as a Privilege · María Escribano · Todos los derechos reservados
        </Text>
      </Box>
    </Box>
  );
}
