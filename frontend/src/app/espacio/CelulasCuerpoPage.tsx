import React, { useEffect, useState } from "react";
import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { CelulaCard, CelulaModal } from "../../components/metodo/celulasUi";
import { CelulasOrganosIcon, fisiologiaBg, fisiologiaNom, fisiologiaTxt } from "../../GlobalVariables";
import { celulas as CELULAS, type Celula } from "../../hardCoded/espacio/CelulasCuerpoData";
import { useT } from "../../i18n";

const BG = fisiologiaBg;
const TXT = fisiologiaTxt;

/* ─────────────────────────────────────────
   PÁGINA — "Tus células"
───────────────────────────────────────── */
export default function CelulasCuerpoPage() {
  const navigate = useNavigate();
  const t = useT();
  const [selected, setSelected] = useState<Celula | null>(null);

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
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
          gap={{ base: 6, md: 8 }}
        >
          <MetodoStepHeader
            icon={<CelulasOrganosIcon size={{ base: "40px", md: "56px" }} />}
            title={t("espacio.tusCelulas")}
            bgColor={`${BG}dd`}
            color={TXT}
            nom={fisiologiaNom}
            mb={{ base: 2, md: 4 }}
            prev={{ label: `← ${t("comun.volver")}`, onClick: () => navigate("/aprendizaje/cursos/" + fisiologiaNom) }}
          />

          {/* Rejilla plana: 4 en ordenador, 1 en móvil */}
          <SimpleGrid
            w="100%"
            maxW="1200px"
            columns={{ base: 1, sm: 2, md: 4 }}
            spacing={{ base: 5, md: 6 }}
          >
            {CELULAS.map((celula) => (
              <CelulaCard
                key={celula.id}
                celula={celula}
                onClick={() => setSelected(celula)}
              />
            ))}
          </SimpleGrid>
        </Flex>
      </Box>

      <SiteFooter />

      {selected && (
        <CelulaModal
          celula={selected}
          celulas={CELULAS}
          onSelect={setSelected}
          onClose={() => setSelected(null)}
        />
      )}
    </Box>
  );
}
