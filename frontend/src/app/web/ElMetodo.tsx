import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { ContactModal } from "../../components/global/ContactModal";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaTxt,
  tcmBg, TCMIcon, tcmNom, tcmTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionTxt,
  fitoterapiaBg, FitoterapiaIcon, fitoterapiaNom, fitoterapiaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
} from "../../GlobalVariables";

type ModalidadData = {
  name: string;
  bg: string;
  txt: string;
  renderIcon: (size: string) => React.ReactNode;
  desc: string;
  modalDesc: string;
};

const modalidades: ModalidadData[] = [
  {
    name: astrologiaNom,
    bg: astrologiaBg,
    txt: astrologiaTxt,
    renderIcon: (size) => <AstrologiaIcon size={{ base: size, md: size }} />,
    desc: "Descubre los arquetipos que guían tu forma de vivir.",
    modalDesc: "A través de tu carta natal, exploraremos los arquetipos que operan en cada área de tu vida y cómo te influyen.",
  },
  {
    name: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
    desc: "Identifica los patrones que te mantienen atrapado.",
    modalDesc: "Usando tu carta natal como mapa, exploraremos tu forma única de pensar y sentir, y los mecanismos de adaptación que desarrollaste para sobrevivir. No somos diagnósticos: somos personas que para sobrevivir tuvieron que hacer una adaptación psicológica que ya no sirve.",
  },
  {
    name: ayurvedaNom,
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    renderIcon: (size) => <AyurvedaIcon size={{ base: size, md: size }}/>,
    desc: "Conoce tu naturaleza única a través de la medicina india más antigua.",
    modalDesc: "Junto a la psicoterapia, el Ayurveda nos dará herramientas profundas para entender tu naturaleza única y qué hábitos te equilibran o te desequilibran.",
  },
  {
    name: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
    desc: "Comprende tus desequilibrios a través de la medicina tradicional china.",
    modalDesc: "Usando la medicina tradicional china, encontraremos qué desequilibrios presentas en este momento de tu vida y los abordaremos con remedios naturales adaptados a ti.",
  },
  {
    name: fisiologiaNom,
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    renderIcon: (size) => <FisiologiaIcon size={size} />,
    desc: "Reconcíliate con tu cuerpo entendiéndolo en profundidad.",
    modalDesc: "Con tu constitución y tus desequilibrios ya identificados, es momento de entender cómo funciona tu cuerpo. Nos centraremos en los órganos y sistemas que más te afectan, con explicaciones claras, repitiéndolo las veces que lo necesites para entenderlo.",
  },
  {
    name: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    renderIcon: (size) => <NutricionIcon size={{ base: size, md: size }} />,
    desc: "«Que tu alimento sea tu medicina y tu medicina tu alimento» — Hipócrates.",
    modalDesc: "Como ya entendemos en profundidad tus desequilibrios, es hora de ver cómo podemos equilibrarnos a través de nuestros hábitos diarios. Esta modalidad no solo abarca la microbiología de la nutrición y su interacción con nuestras células, sino que también hablaremos de los alimentos según la medicina china y la ayurveda.",
  },
  {
    name: fitoterapiaNom,
    bg: fitoterapiaBg,
    txt: fitoterapiaTxt,
    renderIcon: (size) => <FitoterapiaIcon size={{ base: size, md: size }} />,
    desc: "Lo que necesitas para sanar, ya existe en la naturaleza.",
    modalDesc: "Exploraremos juntos qué plantas, especias e infusiones ayudan exactamente a tu desequilibrio actual y cómo incorporarlas de forma fácil en tu día a día.",
  },
  {
    name: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    renderIcon: (size) => <CabalaIcon size={{ base: size, md: size }} />,
    desc: "El camino de vuelta a ti mismo, a través del Árbol de la Vida.",
    modalDesc: "En esta última etapa, llegamos con un largo camino de autoconocimiento recorrido juntos. Usando el Árbol de la Vida y sus caminos, encontraremos cómo equilibrarnos desde adentro, convirtiéndonos en nuestra propia base segura y recordando que somos dignos de amor.",
  },
];

const useReveal = (threshold = 0.12) => {
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

type MetodoCardProps = {
  data: ModalidadData;
  delay: number;
  parentVisible: boolean;
  index: number;
  onClick: () => void;
};

function MetodoCard({ data, delay, parentVisible, index, onClick }: MetodoCardProps) {
  return (
    <Box
      position="relative"
      mt="46px"
      pt="54px"
      pb={8}
      px={{ base: 5, md: 7 }}
      bg={data.bg}
      borderRadius="2xl"
      boxShadow="0 8px 28px rgba(107,196,200,0.5), 0 2px 8px rgba(107,196,200,0.25)"
      opacity={parentVisible ? 1 : 0}
      transform={parentVisible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.95)"}
      transition={`opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s, box-shadow 0.2s ease`}
      cursor="pointer"
      onClick={onClick}
      _hover={{ boxShadow: `0 12px 40px ${data.txt}55, 0 4px 16px ${data.txt}33` }}
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {/* Icono flotante */}
      <Box
        position="absolute"
        top="-38px"
        left="50%"
        transform="translateX(-50%)"
        bg={data.bg}
        borderRadius="full"
        p="8px"
        border={`4px solid ${data.txt}`}
        boxShadow={`0 0 20px ${data.txt}bb, 0 2px 14px ${data.txt}77`}
        w="76px"
        h="76px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {data.renderIcon("44px")}
      </Box>

      {/* Número + título */}
      <Flex align="baseline" justify="center" gap={2} mb={3}>
        <Text
          color={data.txt}
          fontWeight="700"
          fontSize={{ base: "xl", md: "2xl" }}
          opacity={0.6}
          letterSpacing="0.04em"
          lineHeight="short"
        >
          {index}.
        </Text>
        <Text
          color={data.txt}
          fontWeight="700"
          fontSize={{ base: "xl", md: "2xl" }}
          letterSpacing="0.04em"
          lineHeight="short"
          filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.3))"
        >
          {data.name}
        </Text>
      </Flex>

      {/* Descripción */}
      <Text
        color={data.txt}
        opacity={0.85}
        fontSize={{ base: "md", md: "lg" }}
        lineHeight="1.85"
        letterSpacing="0.01em"
      >
        {data.desc}
      </Text>
    </Box>
  );
}

export default function ElMetodo() {
  const headerReveal = useReveal(0.05);
  const cardsReveal = useReveal(0.04);
  const pricingReveal = useReveal(0.1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ModalidadData | null>(null);

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
      <SiteHeader variant="public" />

      {/* ── CABECERA ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 10, md: 14 }}>
        <Box
          ref={headerReveal.ref}
          w={{ base: "100%", md: "80%" }}
          bg="rgba(255,255,255,0.22)"
          border="1px solid rgba(255,255,255,0.45)"
          sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
          borderRadius="2xl"
          boxShadow="0 8px 36px rgba(107,196,200,0.45)"
          px={{ base: 8, md: 14 }}
          py={{ base: 8, md: 10 }}
          display="flex"
          mt="10px"
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          gap={{ base: 6, md: 10 }}
          opacity={headerReveal.visible ? 1 : 0}
          transform={headerReveal.visible ? "none" : "translateY(-30px)"}
          transition="opacity 0.75s ease, transform 0.75s ease"
        >
          {/* Icono life.png a la izquierda */}
          <Box flexShrink={0} w={{ base: "110px", md: "140px" }} alignSelf="center">
            <Image
              src="/img/icono/life.png"
              alt="Life as a Privilege"
              w="100%"
              objectFit="contain"
              filter="drop-shadow(0 4px 14px rgba(255,255,255,0.3))"
            />
          </Box>

          {/* Título */}
          <Box flex="1" textAlign={{ base: "center", md: "left" }}>
           <Text
            color="white"
            fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
            fontWeight="700"
            letterSpacing="0.06em"
            lineHeight="1.15"
            textShadow="0 2px 14px rgba(0,80,70,0.4)"
          >
            EL MÉTODO DE<br />
            <Box as="span" fontStyle="italic" display="block" mt={2}>
              LIFE AS A PRIVILEGE
            </Box>
          </Text>
            <Text
              color="rgba(255,255,255,0.8)"
              fontSize={{ base: "md", md: "xl" }}
              lineHeight="1.85"
              letterSpacing="0.015em"
              mt={4}
              textShadow="0 1px 6px rgba(0,60,50,0.3)"
            >
              Una integración de sabidurías ancestrales y ciencias modernas para acompañar al ser Humano en su proceso de autoconocimiento, desde una visión holística y profunda.
            </Text>
          </Box>
        </Box>
      </Flex>

      {/* ── CARDS DE MODALIDADES ── */}
      <Box
        ref={cardsReveal.ref}
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 18, md: 24 }}
        pb={{ base: 6, md: 10 }}
      >
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
          gap={{ base: 12, md: 14 }}
        >
          {modalidades.map((m, i) => (
            <MetodoCard
              key={m.name}
              data={m}
              delay={i * 0.1}
              parentVisible={cardsReveal.visible}
              index={i + 1}
              onClick={() => setSelectedCard(m)}
            />
          ))}
        </Grid>
      </Box>

      {/* ── CARD DE INFORMACIÓN Y PRECIO ── */}
      <Flex
        justify="center"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 14, md: 18 }}
        pb={{ base: 16, md: 20 }}
      >
        <Box
          ref={pricingReveal.ref}
          w={{ base: "100%", md: "80%" }}
          bg="rgba(255,255,255,0.18)"
          border="1px solid rgba(255,255,255,0.4)"
          sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
          borderRadius="2xl"
          boxShadow="0 12px 50px rgba(107,196,200,0.4), 0 4px 20px rgba(107,196,200,0.2)"
          px={{ base: 8, md: 14 }}
          py={{ base: 10, md: 12 }}
          opacity={pricingReveal.visible ? 1 : 0}
          transform={pricingReveal.visible ? "none" : "translateY(28px)"}
          transition="opacity 0.75s ease, transform 0.75s ease"
          cursor="default"
        >
          {/* Encabezado */}
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            textAlign="center"
            mb={6}
            textShadow="0 2px 10px rgba(0,60,50,0.4)"
          >
            ¿Cómo funciona?
          </Text>

          {/* Info sesiones */}
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 6, md: 10 }}
            justify="center"
            align={{ base: "center", md: "flex-start" }}
            mb={8}
          >
            <Box textAlign="center" flex="1">
              <Text color="rgba(255,255,255,0.6)" fontSize="sm" letterSpacing="0.15em" textTransform="uppercase" mb={1}>
                Duración por sesión
              </Text>
              <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700">
                1 hora
              </Text>
            </Box>
            <Box
              display={{ base: "none", md: "block" }}
              w="1px"
              bg="rgba(255,255,255,0.25)"
              alignSelf="stretch"
            />
            <Box textAlign="center" flex="1">
              <Text color="rgba(255,255,255,0.6)" fontSize="sm" letterSpacing="0.15em" textTransform="uppercase" mb={1}>
                Precio por sesión
              </Text>
              <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700">
                10 €
              </Text>
            </Box>
            <Box
              display={{ base: "none", md: "block" }}
              w="1px"
              bg="rgba(255,255,255,0.25)"
              alignSelf="stretch"
            />
            <Box textAlign="center" flex="1">
              <Text color="rgba(255,255,255,0.6)" fontSize="sm" letterSpacing="0.15em" textTransform="uppercase" mb={1}>
                Nº de sesiones
              </Text>
              <Text color="white" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700">
                Variable
              </Text>
              <Text color="rgba(255,255,255,0.65)" fontSize="sm" mt={1}>
                depende de cada proceso
              </Text>
            </Box>
          </Flex>

          {/* Texto acompañamiento */}
          <Text
            color="rgba(255,255,255,0.88)"
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="1.9"
            letterSpacing="0.015em"
            textAlign="center"
            mb={6}
          >
            Este método incluye <strong>seguimiento personalizado</strong> y acompañamiento cercano durante todo el proceso. El número de sesiones no está predefinido: cada camino es único y se respeta su propio ritmo.
          </Text>

          {/* Mensaje sobre el precio */}
          <Box
            bg="rgba(255,255,255,0.12)"
            border="1px solid rgba(255,255,255,0.25)"
            borderRadius="xl"
            px={{ base: 6, md: 10 }}
            py={6}
          >
            <Text
              color="white"
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.9"
              letterSpacing="0.015em"
              textAlign="center"
              fontStyle="italic"
            >
              El precio es <strong>económico</strong> porque creo que el camino de la consciencia no tiene que ser un lujo para unos pocos, sino un <strong>derecho del pueblo</strong>. Quiero que cualquier persona interesada pueda acceder, independientemente de su situación económica.
            </Text>
          </Box>
        </Box>
      </Flex>

      {/* ── BOTÓN ME INTERESA ── */}
      <Flex justify="center" pb={{ base: 16, md: 20 }}>
        <Box
          as="button"
          onClick={() => setModalOpen(true)}
          px={{ base: 10, md: 14 }}
          py={{ base: 4, md: 5 }}
          borderRadius="full"
          bg="transparent"
          border="2px solid rgba(255,255,255,0.65)"
          color="white"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="600"
          letterSpacing="0.12em"
          fontStyle="italic"
          boxShadow="0 4px 24px rgba(107,196,200,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
          sx={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
          transition="all 0.3s ease"
          _hover={{
            bg: "rgba(255,255,255,0.12)",
            borderColor: "white",
            boxShadow: "0 8px 36px rgba(107,196,200,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
            transform: "translateY(-2px)",
          }}
          _active={{ transform: "translateY(0)", bg: "rgba(255,255,255,0.18)" }}
          cursor="pointer"
        >
          Me interesa
        </Box>
      </Flex>

      {/* ── MODAL MODALIDAD ── */}
      {selectedCard && (
        <Box
          position="fixed"
          inset={0}
          zIndex={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(0,0,0,0.6)"
          sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
          onClick={() => setSelectedCard(null)}
          px={{ base: 5, md: 10 }}
        >
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            bg={selectedCard.bg + "e8"}
            border={`1.5px solid ${selectedCard.txt}55`}
            sx={{ backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)" }}
            borderRadius="2xl"
            boxShadow={`0 8px 48px rgba(0,0,0,0.45), 0 0 0 1px ${selectedCard.txt}22`}
            p={{ base: 8, md: 12 }}
            maxW="560px"
            w="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={6}
            position="relative"
          >
            {/* X */}
            <Box
              position="absolute"
              top={4}
              right={5}
              as="button"
              onClick={() => setSelectedCard(null)}
              color={selectedCard.txt}
              fontSize="xl"
              cursor="pointer"
              bg={selectedCard.txt + "22"}
              borderRadius="full"
              w="36px"
              h="36px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{ bg: selectedCard.txt + "44" }}
              transition="background 0.2s"
            >
              ✕
            </Box>

            {/* Icono */}
            <Box
              bg={selectedCard.bg}
              borderRadius="full"
              w={{ base: "88px", md: "108px" }}
              h={{ base: "88px", md: "108px" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              border={`3px solid ${selectedCard.txt}`}
              boxShadow={`0 0 20px ${selectedCard.txt}bb, 0 2px 14px ${selectedCard.txt}77`}
            >
              {selectedCard.renderIcon("52px")}
            </Box>

            {/* Nombre */}
            <Text
              color={selectedCard.txt}
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="700"
              letterSpacing="0.04em"
              textAlign="center"
            >
              {selectedCard.name}
            </Text>

            {/* Descripción */}
            <Text
              color={selectedCard.txt}
              fontSize={{ base: "lg", md: "xl" }}
              textAlign="center"
              lineHeight="1.9"
              letterSpacing="0.02em"
              opacity={0.82}
            >
              {selectedCard.modalDesc}
            </Text>
          </Box>
        </Box>
      )}

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Me interesa"
        bgColor="#008080"
        color="#ffffff"
        emailSubject="Interés en El Método — Life as a Privilege"
        showCheckboxes={false}
        showDescription={false}
      />

      <SiteFooter />
    </Box>
  );
}
