import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { CabalaIcon, cabalaBg, cabalaNom, cabalaTxt } from "../../../GlobalVariables";
import { ContactModal } from "../../global/ContactModal";
import { SubscribeBox } from "../../global/SubscribeBox";
import { modulosCabala } from "../../../hardCoded/aprendizajes/Cabala/ModulosCabala";
import type { Submodulo } from "../../../dtos/aprendizaje.type";
import ArbolDeLaVida, { type Sefira, type SefiraKey } from "../../global/ArbolDeLaVida";

const BG   = cabalaBg;
const GOLD = cabalaTxt;

/* ─── Aplanar todos los submódulos para lookup por id ─── */
const allSubs = modulosCabala.flatMap(m => m.submodules);
const getSub  = (id: string): Submodulo => allSubs.find(s => s.id === id)!;

/* ─── Mapeo SefiraKey → subId de modulosCabala ─── */
const sefiraToSubId: Record<SefiraKey, string> = {
  kether:   "cabala4",
  chokmah:  "cabala5",
  binah:    "cabala5",
  chesed:   "cabala6",
  geburah:  "cabala7",
  tipharet: "cabala8",
  netzach:  "cabala9",
  hod:      "cabala9",
  yesod:    "cabala10",
  malkuth:  "cabala11",
};

/* ════════════════════════════════════════════
   MODAL
════════════════════════════════════════════ */
function CabalaModal({
  sub,
  name,
  onClose,
}: {
  sub: Submodulo;
  name: string;
  onClose: () => void;
}) {
  const [letraOpen, setLetraOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", h);
    };
  }, [onClose]);

  const parrafos = sub.letra ? sub.letra.split(/\n\n+/) : [];

  return (
    <Box
      position="fixed" inset={0} zIndex={1100}
      bg="rgba(0,0,0,0.80)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex" alignItems="center" justifyContent="center"
      px={4} py={6}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w="95vw" maxW="700px" maxH="90vh" overflowY="auto"
        borderRadius="24px"
        bg={BG}
        border={`1px solid ${GOLD}44`}
        boxShadow={`0 32px 80px rgba(0,0,0,0.75), 0 0 80px ${GOLD}14`}
        sx={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: GOLD + "55", borderRadius: "999px" },
        }}
      >
        {/* Cerrar */}
        <Box
          as="button"
          position="absolute" top="14px" right="14px"
          w="34px" h="34px" borderRadius="full"
          bg={GOLD + "20"} border={`1px solid ${GOLD}44`}
          display="flex" alignItems="center" justifyContent="center"
          color={GOLD} fontSize="15px" fontWeight="700"
          cursor="pointer" zIndex={10}
          _hover={{ bg: GOLD + "35" }}
          onClick={onClose}
        >
          ✕
        </Box>

        <Box px={{ base: 6, md: 10 }} pt={10} pb={10}>

          {/* Nombre sephirot */}
          <Text
            color={GOLD}
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="700"
            fontFamily="'EB Garamond', serif"
            mb={1}
          >
            {name}
          </Text>
          <Text
            color={GOLD + "88"}
            fontSize={{ base: "sm", md: "md" }}
            fontFamily="'EB Garamond', serif"
            mb={7}
          >
            {sub.nom}
          </Text>

          {/* Descripción */}
          <Box
            w="100%"
            bg={BG}
            border={`1px solid ${GOLD}44`}
            borderRadius="2xl"
            px={{ base: 5, md: 8 }}
            py={{ base: 4, md: 6 }}
            mb={7}
            boxShadow={`0 4px 24px ${GOLD}30, 0 1px 6px rgba(0,0,0,0.10)`}
            transition="box-shadow 0.2s"
          >
            <Text
              color={GOLD}
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.9"
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
              letterSpacing="0.02em"
            >
              {sub.descripcion}
            </Text>
          </Box>

          {/* Transcripción plegable */}
          {parrafos.length > 0 && (
            <Box>
              <Flex
                as="button"
                w="100%"
                align="center"
                justify="space-between"
                px={4} py={3}
                bg={GOLD + "10"}
                border={`1px solid ${GOLD}33`}
                borderRadius={letraOpen ? "xl xl 0 0" : "xl"}
                cursor="pointer"
                onClick={() => setLetraOpen(!letraOpen)}
                transition="border-radius 0.2s"
              >
                <Text
                  color={GOLD}
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="600"
                  fontFamily="'EB Garamond', serif"
                  letterSpacing="0.04em"
                >
                  Transcripción
                </Text>
                <Text
                  color={GOLD}
                  fontSize="xl"
                  transition="transform 0.25s"
                  transform={letraOpen ? "rotate(180deg)" : "rotate(0deg)"}
                >
                  ▾
                </Text>
              </Flex>

              <Collapse in={letraOpen} animateOpacity>
                <Box
                  px={4} py={5}
                  bg={GOLD + "08"}
                  border={`1px solid ${GOLD}33`}
                  borderTop="none"
                  borderRadius="0 0 xl xl"
                >
                  <Flex direction="column" gap={4}>
                    {parrafos.map((p, i) => (
                      <Text
                        key={i}
                        color={GOLD + "cc"}
                        fontSize={{ base: "sm", md: "md" }}
                        lineHeight="1.9"
                        fontFamily="'EB Garamond', serif"
                      >
                        {p}
                      </Text>
                    ))}
                  </Flex>
                </Box>
              </Collapse>
            </Box>
          )}

        </Box>
      </Box>
    </Box>
  );
}

/* ════════════════════════════════════════════
   PÁGINA PRINCIPAL
════════════════════════════════════════════ */
export default function CabalaRecursos() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<{ sub: Submodulo; name: string } | null>(null);
  const [saberMasOpen, setSaberMasOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleSefiraClick = (sefira: Sefira) => {
    const subId = sefiraToSubId[sefira.key];
    setSelected({ sub: getSub(subId), name: sefira.hebrewName });
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
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
            icon={<CabalaIcon size={{ base: "40px", md: "50px" }} />}
            title="Los fundamentos"
            subtitle={cabalaNom}
            bgColor={cabalaBg}
            color={cabalaTxt}
            onIconClick={() => navigate("/aprendizaje/modulosPage/Cábala/cabala-curso-1")}
          />

          {/* ── Árbol de la Vida ── */}
          <Box
            w="100%" maxW="900px"
            bg={BG}
            borderRadius="28px"
            border={`1px solid ${GOLD}33`}
            boxShadow={"0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
            p={{ base: 4, md: 6 }}
          >
            <ArbolDeLaVida
              onSefiraClick={handleSefiraClick}
              suppressInternalModal
              maxWidth="520px"
            />
          </Box>

          <SubscribeBox />
        </Flex>
      </Box>

      <SiteFooter />

      <ContactModal
        isOpen={saberMasOpen}
        onClose={() => setSaberMasOpen(false)}
        title="¿Quieres saber más?"
        icon={<CabalaIcon size={{ base: "24px", md: "24px" }} />}
        subtitle="Déjame tus datos y cuéntame en qué puedo ayudarte."
        bgColor={cabalaBg}
        color={cabalaTxt}
        emailSubject={`Quiero saber más — ${cabalaNom}`}
        showDescription
      />

      {selected && (
        <CabalaModal
          sub={selected.sub}
          name={selected.name}
          onClose={() => setSelected(null)}
        />
      )}
    </Box>
  );
}
