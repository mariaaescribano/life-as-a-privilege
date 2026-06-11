import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { ContactModal } from "../../global/ContactModal";
import { SubscribeBox } from "../../global/SubscribeBox";
import { NutricionIcon, nutricionBg, nutricionNom, nutricionTxt } from "../../../GlobalVariables";

const BG  = nutricionBg;
const TXT = nutricionTxt;
const GLOW = "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)";
const BASE = "/img/nutri/curso1";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
type Valor = { label: string; valor: string };

type Alimento = {
  id: string;
  nom: string;
  emoji: string;
  imgPath: string;
  descripcion: string;
  valores: Valor[];
};

type GrupoInfo = {
  label: string;
  color: string;
  icon: React.FC;
};

type ModalData = {
  alimento: Alimento;
  grupo: GrupoInfo;
};

// ─────────────────────────────────────────
// GROUP ICONS (Google Material Icons SVGs)
// ─────────────────────────────────────────
const IconPreferable: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#2e7d32">
    <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
  </svg>
);

const IconNoBeneficioso: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#c62828">
    <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
  </svg>
);

const IconInsaturada: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#2e7d32">
    <path d="M440-80q-117 0-198.5-81.5T160-360q0-56 20.5-104.5t56.5-87.5l183-195 183 195q36 39 56.5 87.5T680-360q0 117-81.5 198.5T440-80Zm0-80q83 0 141.5-58.5T640-360q0-37-13.5-71T587-495L440-650 293-495q-33 33-46.5 67T233-360q0 83 58.5 141.5T440-160Zm0-160Z"/>
  </svg>
);

const IconSaturada: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#ef6c00">
    <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/>
  </svg>
);

const IconProteina: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#1565c0">
    <path d="M120-160v-80l80-80v-240l-80-80v-80h240v80l-80 80v100h320v-100l-80-80v-80h240v80l-80 80v240l80 80v80H680v-80l80-80v-60H360v60l80 80v80H120Z"/>
  </svg>
);

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────
const carbosPreferibles: Alimento[] = [
  {
    id: "carb-1", nom: "Verduras", emoji: "🥦", imgPath: `${BASE}/verduras.jpg`,
    descripcion: "Fuente de fibra, vitaminas y energía de calidad.",
    valores: [{ label: "Calorías", valor: "~25 kcal" }, { label: "Carbohidratos", valor: "~5 g" }, { label: "Fibra soluble", valor: "~0.5 g" }, { label: "Fibra insoluble", valor: "~1.5 g" }, { label: "Proteínas", valor: "~1.5 g" }, { label: "Grasas", valor: "~0.2 g" }],
  },
  {
    id: "carb-2", nom: "Frutas", emoji: "🍎", imgPath: `${BASE}/frutas.jpg`,
    descripcion: "Su fibra es perfecta para permitir que su fructosa sea incorporada en nosotros poco a poco.",
    valores: [{ label: "Calorías", valor: "~52 kcal" }, { label: "Carbohidratos", valor: "~14 g" }, { label: "Fibra soluble", valor: "~1 g" }, { label: "Fibra insoluble", valor: "~1 g" }, { label: "Proteínas", valor: "~0.5 g" }, { label: "Grasas", valor: "~0.2 g" }],
  },
  {
    id: "carb-3", nom: "Legumbres", emoji: "🫘", imgPath: `${BASE}/legumbres.jpg`,
    descripcion: "A pesar de su mala fama, son de las mejores fuentes de carbohidratos además de venir acompañada de fibra y proteína.",
    valores: [{ label: "Calorías", valor: "~130 kcal" }, { label: "Carbohidratos", valor: "~22 g" }, { label: "Fibra soluble", valor: "~3 g" }, { label: "Fibra insoluble", valor: "~5 g" }, { label: "Proteínas", valor: "~8 g" }, { label: "Grasas", valor: "~0.5 g" }],
  },
];

const carbosNoBenef: Alimento[] = [
  {
    id: "carb-4", nom: "Bollos", emoji: "🥐", imgPath: `${BASE}/bollos.jpg`,
    descripcion: "Su buen sabor es sinónimo de que al cuerpo le cuesta poco digerirlo, por lo tanto se incorpora muy rápido, sobrecargando a nuestros órganos.",
    valores: [{ label: "Calorías", valor: "~390 kcal" }, { label: "Carbohidratos", valor: "~53 g" }, { label: "Fibra soluble", valor: "~0.2 g" }, { label: "Fibra insoluble", valor: "~0.8 g" }, { label: "G. insaturadas", valor: "~7 g" }, { label: "G. saturadas", valor: "~10 g" }],
  },
  {
    id: "carb-5", nom: "Azúcar", emoji: "🍬", imgPath: `${BASE}/azucar.jpg`,
    descripcion: "Glucosa pura sin ningún nutriente que la acompañe. Se absorbe de forma inmediata, disparando los niveles en sangre y obligando al cuerpo a almacenar el exceso como grasa.",
    valores: [{ label: "Calorías", valor: "~387 kcal" }, { label: "Carbohidratos", valor: "~100 g" }, { label: "Fibra soluble", valor: "~0 g" }, { label: "Fibra insoluble", valor: "~0 g" }, { label: "Proteínas", valor: "~0 g" }, { label: "Grasas", valor: "~0 g" }],
  },
  {
    id: "carb-6", nom: "Pan blanco", emoji: "🍞", imgPath: `${BASE}/panblanco.jpg`,
    descripcion: "Al haber perdido la fibra del cereal original, se comporta casi como el azúcar: su glucosa se incorpora muy rápido, sin apenas resistencia.",
    valores: [{ label: "Calorías", valor: "~265 kcal" }, { label: "Carbohidratos", valor: "~51 g" }, { label: "Fibra soluble", valor: "~0.4 g" }, { label: "Fibra insoluble", valor: "~1.6 g" }, { label: "Proteínas", valor: "~9 g" }, { label: "Grasas", valor: "~2 g" }],
  },
];

const proteinasAlimentos: Alimento[] = [
  {
    id: "prot-1", nom: "Tofu", emoji: "🧱", imgPath: `${BASE}/tofu.jpg`,
    descripcion: "Proteína vegetal completa derivada de la soja. Versátil y suave, es una excelente alternativa a la proteína animal.",
    valores: [{ label: "Calorías", valor: "~76 kcal" }, { label: "Proteínas", valor: "~8 g" }, { label: "G. insaturadas", valor: "~3 g" }, { label: "G. saturadas", valor: "~0.5 g" }, { label: "Carbohidratos", valor: "~2 g" }, { label: "Fibra soluble", valor: "~0.1 g" }],
  },
  {
    id: "prot-2", nom: "Soja", emoji: "🫘", imgPath: `${BASE}/soja.jpg`,
    descripcion: "Una de las pocas proteínas vegetales completas. Rica en todos los aminoácidos esenciales, además de fibra y grasas saludables.",
    valores: [{ label: "Calorías", valor: "~446 kcal" }, { label: "Proteínas", valor: "~36 g" }, { label: "G. insaturadas", valor: "~15 g" }, { label: "G. saturadas", valor: "~3 g" }, { label: "Carbohidratos", valor: "~30 g" }, { label: "Fibra soluble", valor: "~3 g" }],
  },
  {
    id: "prot-3", nom: "Huevo", emoji: "🥚", imgPath: `${BASE}/huevo.jpg`,
    descripcion: "Una de las proteínas más completas y biodisponibles que existen. Contiene todos los aminoácidos esenciales en proporciones casi perfectas.",
    valores: [{ label: "Calorías", valor: "~155 kcal" }, { label: "Proteínas", valor: "~13 g" }, { label: "G. insaturadas", valor: "~6 g" }, { label: "G. saturadas", valor: "~3 g" }, { label: "Carbohidratos", valor: "~1 g" }, { label: "Fibra", valor: "~0 g" }],
  },
  {
    id: "prot-4", nom: "Legumbres", emoji: "🫘", imgPath: `${BASE}/legumbres.jpg`,
    descripcion: "Proteína vegetal completa acompañada de fibra, hierro y carbohidratos de absorción lenta. Pilares de la alimentación sostenible y la salud intestinal.",
    valores: [{ label: "Calorías", valor: "~116 kcal" }, { label: "Proteínas", valor: "~9 g" }, { label: "G. insaturadas", valor: "~0.3 g" }, { label: "G. saturadas", valor: "~0.1 g" }, { label: "Carbohidratos", valor: "~20 g" }, { label: "Fibra soluble", valor: "~7 g" }],
  },
  {
    id: "prot-5", nom: "Pescado", emoji: "🐟", imgPath: `${BASE}/pescado.jpg`,
    descripcion: "Proteína de alta calidad combinada con omega-3, que reduce la inflamación y protege el sistema cardiovascular.",
    valores: [{ label: "Calorías", valor: "~130 kcal" }, { label: "Proteínas", valor: "~22 g" }, { label: "G. insaturadas", valor: "~3 g" }, { label: "G. saturadas", valor: "~1 g" }, { label: "Carbohidratos", valor: "~0 g" }, { label: "Fibra", valor: "~0 g" }],
  },
  {
    id: "prot-6", nom: "Guisantes", emoji: "🫛", imgPath: `${BASE}/guisantes.webp`,
    descripcion: "Proteína vegetal acompañada de fibra, lo que ralentiza su absorción y ayuda a mantener la saciedad por más tiempo.",
    valores: [{ label: "Calorías", valor: "~81 kcal" }, { label: "Proteínas", valor: "~5 g" }, { label: "G. insaturadas", valor: "~0.2 g" }, { label: "G. saturadas", valor: "~0.1 g" }, { label: "Carbohidratos", valor: "~14 g" }, { label: "Fibra soluble", valor: "~2 g" }],
  },
];

const grasasInsaturadas: Alimento[] = [
  {
    id: "grasa-1", nom: "Aguacate", emoji: "🥑", imgPath: `${BASE}/aguacate.jpg`,
    descripcion: "Rico en ácido oleico, el mismo del aceite de oliva. Nutre la membrana celular y tiene un efecto antiinflamatorio natural.",
    valores: [{ label: "Calorías", valor: "~160 kcal" }, { label: "G. insaturadas", valor: "~13 g" }, { label: "G. saturadas", valor: "~2 g" }, { label: "Proteínas", valor: "~2 g" }, { label: "Fibra soluble", valor: "~2 g" }, { label: "Fibra insoluble", valor: "~5 g" }],
  },
  {
    id: "grasa-2", nom: "Aceite de oliva", emoji: "🫙", imgPath: `${BASE}/aceite.webp`,
    descripcion: "Su alto contenido en ácido oleico protege las células y reduce la inflamación crónica. Uno de los pilares de la alimentación saludable.",
    valores: [{ label: "Calorías", valor: "~884 kcal" }, { label: "G. insaturadas", valor: "~84 g" }, { label: "G. saturadas", valor: "~14 g" }, { label: "Proteínas", valor: "~0 g" }, { label: "Carbohidratos", valor: "~0 g" }, { label: "Fibra", valor: "~0 g" }],
  },
  {
    id: "grasa-3", nom: "Frutos secos", emoji: "🥜", imgPath: `${BASE}/frutossecos.jpg`,
    descripcion: "Concentran grasas insaturadas, proteína y fibra en pequeñas dosis. Un snack que nutre de verdad.",
    valores: [{ label: "Calorías", valor: "~607 kcal" }, { label: "G. insaturadas", valor: "~44 g" }, { label: "G. saturadas", valor: "~7 g" }, { label: "Proteínas", valor: "~14 g" }, { label: "Carbohidratos", valor: "~21 g" }, { label: "Fibra soluble", valor: "~2 g" }],
  },
];

const grasasSaturadas: Alimento[] = [
  {
    id: "grasa-4", nom: "Queso", emoji: "🧀", imgPath: `${BASE}/queso.jpg`,
    descripcion: "Rico en proteína y calcio, pero su grasa saturada en exceso puede dificultar la flexibilidad de las membranas celulares. Con moderación.",
    valores: [{ label: "Calorías", valor: "~360 kcal" }, { label: "G. insaturadas", valor: "~8 g" }, { label: "G. saturadas", valor: "~20 g" }, { label: "Proteínas", valor: "~22 g" }, { label: "Carbohidratos", valor: "~2 g" }, { label: "Fibra", valor: "~0 g" }],
  },
  {
    id: "grasa-5", nom: "Carne", emoji: "🥩", imgPath: `${BASE}/carne.jpg`,
    descripcion: "Buena fuente de proteína y hierro, pero su grasa saturada en exceso puede comprometer la salud cardiovascular.",
    valores: [{ label: "Calorías", valor: "~250 kcal" }, { label: "G. insaturadas", valor: "~7 g" }, { label: "G. saturadas", valor: "~10 g" }, { label: "Proteínas", valor: "~26 g" }, { label: "Carbohidratos", valor: "~0 g" }, { label: "Fibra", valor: "~0 g" }],
  },
  {
    id: "grasa-6", nom: "Bollería", emoji: "🧁", imgPath: `${BASE}/bolleria.jpg`,
    descripcion: "Combina carbohidratos de absorción rápida con grasas trans o saturadas. Una combinación que deteriora las células a largo plazo.",
    valores: [{ label: "Calorías", valor: "~450 kcal" }, { label: "G. insaturadas", valor: "~8 g" }, { label: "G. saturadas", valor: "~12 g" }, { label: "Proteínas", valor: "~6 g" }, { label: "Fibra soluble", valor: "~0.3 g" }, { label: "Fibra insoluble", valor: "~0.7 g" }],
  },
];

// ─────────────────────────────────────────
// FOOD CIRCLE
// ─────────────────────────────────────────
function AlimentoCirculo({ alimento, grupo, onClick }: { alimento: Alimento; grupo: GrupoInfo; onClick: (d: ModalData) => void }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Flex
      direction="column"
      align="center"
      gap={2}
      cursor="pointer"
      role="button"
      onClick={() => onClick({ alimento, grupo })}
      _hover={{ transform: "translateY(-4px)" }}
      transition="transform 0.2s"
    >
      <Box
        w={{ base: "72px", md: "88px" }}
        h={{ base: "72px", md: "88px" }}
        borderRadius="full"
        overflow="hidden"
        border={`3px solid ${TXT}33`}
        boxShadow={`0 4px 14px ${TXT}22`}
        bg={TXT + "0d"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        _hover={{ border: `3px solid ${TXT}88`, boxShadow: `0 6px 20px ${TXT}44` }}
        transition="all 0.2s"
      >
        {imgFailed ? (
          <Text fontSize={{ base: "2xl", md: "3xl" }} lineHeight="1">{alimento.emoji}</Text>
        ) : (
          <Box
            as="img"
            src={alimento.imgPath}
            alt={alimento.nom}
            w="100%" h="100%"
            objectFit="cover"
            onError={() => setImgFailed(true)}
          />
        )}
      </Box>
      <Text
        color={TXT}
        fontSize={{ base: "xs", md: "sm" }}
        fontFamily="'EB Garamond', serif"
        textAlign="center"
        fontWeight="600"
        maxW="90px"
        lineHeight="1.2"
      >
        {alimento.nom}
      </Text>
    </Flex>
  );
}

// ─────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────
function AlimentoModal({ data, onClose }: { data: ModalData; onClose: () => void }) {
  const { alimento } = data;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <Box
      position="fixed" inset={0} zIndex={1100}
      bg="rgba(0,0,0,0.75)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex" alignItems="center" justifyContent="center"
      px={4} py={6}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="95vw" maxW="540px" maxH="90vh" overflowY="auto"
        borderRadius="24px"
        bg={BG}
        border={`1px solid ${TXT}33`}
        boxShadow={`0 32px 80px rgba(0,0,0,0.5), 0 0 60px ${TXT}10`}
        sx={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: TXT + "44", borderRadius: "999px" },
        }}
      >
        {/* Close button */}
        <Box
          as="button"
          position="absolute" top="14px" right="14px"
          w="34px" h="34px" borderRadius="full"
          bg={TXT + "15"} border={`1px solid ${TXT}33`}
          display="flex" alignItems="center" justifyContent="center"
          color={TXT} fontSize="15px" fontWeight="700"
          cursor="pointer" zIndex={10}
          _hover={{ bg: TXT + "28" }}
          onClick={onClose}
        >
          ✕
        </Box>

        <Box px={{ base: 6, md: 9 }} pt={9} pb={8}>
          {/* Photo + Title */}
          <Flex align="center" gap={4} mb={6}>
            <Box
              w={{ base: "72px", md: "84px" }}
              h={{ base: "72px", md: "84px" }}
              borderRadius="xl"
              overflow="hidden"
              flexShrink={0}
              border={`2px solid ${TXT}33`}
              boxShadow={`0 4px 14px ${TXT}22`}
            >
              <Box as="img" src={alimento.imgPath} alt={alimento.nom} w="100%" h="100%" objectFit="cover" />
            </Box>
            <Text
              color={TXT}
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="700"
              fontFamily="'EB Garamond', serif"
              lineHeight="1.2"
            >
              {alimento.nom}
            </Text>
          </Flex>

          {/* Description */}
          <Box
            bg={TXT + "0c"}
            borderLeft={`3px solid ${TXT}55`}
            borderRadius="0 xl xl 0"
            px={{ base: 4, md: 5 }} py={4}
            mb={6}
          >
            <Text
              color={TXT}
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.8"
              fontFamily="'EB Garamond', serif"
            >
              {alimento.descripcion}
            </Text>
          </Box>

          {/* Subtle divider */}
          <Box h="1px" bg={TXT + "22"} mb={5} />

          {/* Nutritional values */}
          <Text
            color={TXT}
            fontSize={{ base: "sm", md: "md" }}
            fontFamily="'EB Garamond', serif"
            fontWeight="600"
            letterSpacing="0.05em"
            mb={3}
          >
            Valores nutricionales (por 100 g)
          </Text>
          <Flex flexWrap="wrap" gap={2}>
            {alimento.valores.map((v) => (
              <Box
                key={v.label}
                flex="1"
                minW="90px"
                bg={TXT + "0a"}
                border={`1px solid ${TXT}1a`}
                borderRadius="xl"
                px={3} py={2}
              >
                <Text color={TXT + "77"} fontSize="11px" fontFamily="'EB Garamond', serif" mb={0.5}>
                  {v.label}
                </Text>
                <Text color={TXT} fontSize={{ base: "sm", md: "md" }} fontWeight="700" fontFamily="'EB Garamond', serif">
                  {v.valor}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────
// CARD HEADER
// ─────────────────────────────────────────
function CardHeader({ title }: { title: string }) {
  return (
    <Box mt={3} mb={6}>
      <Flex align="center" justify="center" mb={3}>
        <Text
          textAlign="center"
          color={TXT}
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="700"
          fontFamily="'EB Garamond', serif"
          letterSpacing="0.04em"
        >
          {title}
        </Text>
      </Flex>
      <Box
        h="1px"
        bg={`linear-gradient(to right, transparent, ${TXT}55 25%, ${TXT}55 75%, transparent)`}
        mb={3}
      />
      <Text
        color={TXT + "66"}
        fontSize="xs"
        textAlign="center"
        fontFamily="'EB Garamond', serif"
        fontStyle="italic"
        letterSpacing="0.05em"
      >
        Pulsa sobre cada alimento para ver más
      </Text>
    </Box>
  );
}

// ─────────────────────────────────────────
// VERTICAL DIVIDER
// ─────────────────────────────────────────
function VerticalDivider() {
  return (
    <Box
      display={{ base: "none", md: "block" }}
      w="1px"
      alignSelf="stretch"
      bg={`linear-gradient(to bottom, transparent, ${TXT}44 20%, ${TXT}44 80%, transparent)`}
      flexShrink={0}
      mx={2}
    />
  );
}

function HorizontalDivider() {
  return (
    <Box
      display={{ base: "block", md: "none" }}
      h="1px"
      w="100%"
      bg={`linear-gradient(to right, transparent, ${TXT}44 20%, ${TXT}44 80%, transparent)`}
      my={4}
      flexShrink={0}
    />
  );
}

// ─────────────────────────────────────────
// GRUPO LABEL
// ─────────────────────────────────────────
function GrupoLabel({ label, color, Icon }: { label: string; color: string; Icon: React.FC }) {
  return (
    <Flex align="center" justify="center" gap={1.5} mb={4}>
      <Icon />
      <Text
        color={color}
        fontSize={{ base: "xs", md: "sm" }}
        fontFamily="'EB Garamond', serif"
        fontWeight="700"
        letterSpacing="0.08em"
        textTransform="uppercase"
      >
        {label}
      </Text>
    </Flex>
  );
}

// ─────────────────────────────────────────
// CARBOHIDRATOS CARD
// ─────────────────────────────────────────
function CarbohidratosCard({ onSelect }: { onSelect: (d: ModalData) => void }) {
  const navigate = useNavigate();
  const grupoPreferibles: GrupoInfo = { label: "Preferibles", color: "#2e7d32", icon: IconPreferable };
  const grupoNoBenef: GrupoInfo     = { label: "No beneficiosos", color: "#c62828", icon: IconNoBeneficioso };

  return (
    <Box
      bg={BG} borderRadius="2xl"
      border={`1px solid ${TXT}22`}
      boxShadow={GLOW} mt="10px"
      p={{ base: 5, md: 7 }}
      w="100%" maxW="850px"
    >
      <CardHeader title="Carbohidratos" />

      <Flex direction={{ base: "column", md: "row" }} gap={{ base: 0, md: 4 }}>
        {/* Preferibles */}
        <Box flex={1}>
          <GrupoLabel label="Preferibles" color="#2e7d32" Icon={IconPreferable} />
          <Flex justify="center" gap={{ base: 3, md: 5 }} flexWrap="nowrap">
            {carbosPreferibles.map(a => (
              <AlimentoCirculo key={a.id} alimento={a} grupo={grupoPreferibles} onClick={onSelect} />
            ))}
          </Flex>
        </Box>

        <VerticalDivider />
        <HorizontalDivider />

        {/* No beneficiosos */}
        <Box flex={1}>
          <GrupoLabel label="No beneficiosos" color="#c62828" Icon={IconNoBeneficioso} />
          <Flex justify="center" gap={{ base: 3, md: 5 }} flexWrap="nowrap">
            {carbosNoBenef.map(a => (
              <AlimentoCirculo key={a.id} alimento={a} grupo={grupoNoBenef} onClick={onSelect} />
            ))}
          </Flex>
        </Box>
      </Flex>

      <Flex justify="flex-end" mt={5}>
        <Flex
          as="button"
          align="center"
          gap={1}
          onClick={() => navigate("/aprendizaje/videoLessonPage/nutricion/nut-m2")}
          color={TXT}
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="600"
          textDecoration="underline"
          textUnderlineOffset="3px"
          _hover={{ opacity: 0.7 }}
          transition="opacity 0.2s"
          bg="transparent"
          border="none"
          cursor="pointer"
        >
          Ver vídeo →
        </Flex>
      </Flex>
    </Box>
  );
}

// ─────────────────────────────────────────
// PROTEÍNAS CARD
// ─────────────────────────────────────────
function ProteinasCard({ onSelect }: { onSelect: (d: ModalData) => void }) {
  const navigate = useNavigate();
  const grupo: GrupoInfo = { label: "Alimentos de proteínas completas", color: "#1565c0", icon: IconProteina };

  return (
    <Box
      bg={BG} borderRadius="2xl"
      border={`1px solid ${TXT}22`}
      boxShadow={GLOW}
      p={{ base: 5, md: 7 }}
      w="100%" maxW="850px"
    >
      <CardHeader title="Proteínas" />

      {/* 2 rows of 3 */}
      <Flex direction="column" align="center" gap={4}>
        <Flex justify="center" gap={{ base: 3, md: 6 }} flexWrap="nowrap">
          {proteinasAlimentos.slice(0, 3).map(a => (
            <AlimentoCirculo key={a.id} alimento={a} grupo={grupo} onClick={onSelect} />
          ))}
        </Flex>
        <Flex justify="center" gap={{ base: 3, md: 6 }} flexWrap="nowrap">
          {proteinasAlimentos.slice(3, 6).map(a => (
            <AlimentoCirculo key={a.id} alimento={a} grupo={grupo} onClick={onSelect} />
          ))}
        </Flex>
      </Flex>

      <Flex justify="flex-end" mt={5}>
        <Flex
          as="button"
          align="center"
          gap={1}
          onClick={() => navigate("/aprendizaje/videoLessonPage/nutricion/nut-m1")}
          color={TXT}
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="600"
          textDecoration="underline"
          textUnderlineOffset="3px"
          _hover={{ opacity: 0.7 }}
          transition="opacity 0.2s"
          bg="transparent"
          border="none"
          cursor="pointer"
        >
          Ver vídeo →
        </Flex>
      </Flex>
    </Box>
  );
}

// ─────────────────────────────────────────
// GRASAS CARD
// ─────────────────────────────────────────
function GrasasCard({ onSelect }: { onSelect: (d: ModalData) => void }) {
  const navigate = useNavigate();
  const grupoInsaturadas: GrupoInfo = { label: "Insaturadas", color: "#2e7d32", icon: IconInsaturada };
  const grupoSaturadas: GrupoInfo   = { label: "Saturadas",   color: "#ef6c00", icon: IconSaturada };

  return (
    <Box
      bg={BG} borderRadius="2xl"
      border={`1px solid ${TXT}22`}
      boxShadow={GLOW}
      p={{ base: 5, md: 7 }}
      w="100%" maxW="850px"
    >
      <CardHeader title="Grasas" />

      <Flex direction={{ base: "column", md: "row" }} gap={{ base: 0, md: 4 }}>
        {/* Insaturadas — Preferibles */}
        <Box flex={1}>
          <GrupoLabel label="Preferibles" color="#2e7d32" Icon={IconPreferable} />
          <Flex justify="center" gap={{ base: 3, md: 5 }} flexWrap="nowrap">
            {grasasInsaturadas.map(a => (
              <AlimentoCirculo key={a.id} alimento={a} grupo={grupoInsaturadas} onClick={onSelect} />
            ))}
          </Flex>
        </Box>

        <VerticalDivider />
        <HorizontalDivider />

        {/* Saturadas — No beneficiosos */}
        <Box flex={1}>
          <GrupoLabel label="No beneficiosos" color="#c62828" Icon={IconNoBeneficioso} />
          <Flex justify="center" gap={{ base: 3, md: 5 }} flexWrap="nowrap">
            {grasasSaturadas.map(a => (
              <AlimentoCirculo key={a.id} alimento={a} grupo={grupoSaturadas} onClick={onSelect} />
            ))}
          </Flex>
        </Box>
      </Flex>

      <Flex justify="flex-end" mt={5}>
        <Flex
          as="button"
          align="center"
          gap={1}
          onClick={() => navigate("/aprendizaje/videoLessonPage/nutricion/nut-m3")}
          color={TXT}
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="600"
          textDecoration="underline"
          textUnderlineOffset="3px"
          _hover={{ opacity: 0.7 }}
          transition="opacity 0.2s"
          bg="transparent"
          border="none"
          cursor="pointer"
        >
          Ver vídeo →
        </Flex>
      </Flex>
    </Box>
  );
}

// ─────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────
export default function NutricionRecursos() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<ModalData | null>(null);
  const [saberMasOpen, setSaberMasOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          gap={{ base: 6, md: 8 }}
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<NutricionIcon size={{ base: "40px", md: "50px" }} />}
            title="Las bases de la nutrición"
            subtitle={nutricionNom}
            bgColor={BG}
            color={TXT} mb={{ base: 0, md: 0 }}
            onIconClick={() => navigate("/aprendizaje/cursos/nutricion")}
          />

          <CarbohidratosCard onSelect={setSelected} />
          <ProteinasCard     onSelect={setSelected} />
          <GrasasCard        onSelect={setSelected} />

          {/* AVISO LEGAL */}
          <Box w="100%" maxW="680px" mb="50px" mx="auto" mt={2}>
            <Flex
              as="button"
              w="100%"
              align="center"
              justify="center"
              gap={3}
              px={{ base: 5, md: 6 }}
              py={3}
              bg={`${BG}55`}
              border={`1px solid ${TXT}22`}
              borderRadius={disclaimerOpen ? "xl xl 0 0" : "xl"}
              cursor="pointer"
              onClick={() => setDisclaimerOpen((o) => !o)}
              transition="border-radius 0.2s"
              sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
            >
              <Flex align="center" gap={2.5}>
                <Box color={`${TXT}88`} flexShrink={0}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                    <path d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                  </svg>
                </Box>
                <Text
                  color={`${TXT}99`}
                  fontSize="md"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                  fontFamily="'EB Garamond', serif"
                >
                  Información importante
                </Text>
              </Flex>
              <Text
                color={`${TXT}66`}
                fontSize="sm"
                transition="transform 0.22s"
                transform={disclaimerOpen ? "rotate(180deg)" : "rotate(0deg)"}
              >
                ▾
              </Text>
            </Flex>
            <Collapse in={disclaimerOpen} animateOpacity>
              <Box
                px={{ base: 5, md: 6 }}
                py={4}
                bg={`${BG}33`}
                border={`1px solid ${TXT}22`}
                borderTop="none"
                borderRadius="0 0 xl xl"
                sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
              >
                <Text
                  color={`${TXT}cc`}
                  fontSize={{ base: "sm", md: "md" }}
                  lineHeight="1.85"
                  letterSpacing="0.02em"
                  fontFamily="'EB Garamond', serif"
                  fontStyle="italic"
                >
                  Esta información es una guía general basada en principios nutricionales reconocidos, pero cada persona es única. En caso de embarazo, lactancia, enfermedad o cualquier patología, consulta siempre con tu médico o nutricionista. Gracias por cuidarte con consciencia.
                </Text>
              </Box>
            </Collapse>
          </Box>

          <SubscribeBox />
        </Flex>
      </Box>

      <SiteFooter />

      <ContactModal
        isOpen={saberMasOpen}
        onClose={() => setSaberMasOpen(false)}
        title="¿Quieres saber más?"
        icon={<NutricionIcon size={{ base: "24px", md: "24px" }} />}
        subtitle="Déjame tus datos y cuéntame en qué puedo ayudarte."
        bgColor={nutricionBg}
        color={nutricionTxt}
        emailSubject={`Quiero saber más — ${nutricionNom}`}
        showDescription
      />

      {selected && (
        <AlimentoModal data={selected} onClose={() => setSelected(null)} />
      )}
    </Box>
  );
}
