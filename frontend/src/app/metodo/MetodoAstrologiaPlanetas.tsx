import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";
import {
  PlanetaBox,
  PlanetaPickerModal,
  useCartaPlanetas,
  valorOf,
  siguienteCuerpoIndex,
  type PickerState,
} from "../../components/metodo/Planetas";
import { CUERPOS } from "../../components/metodo/astrologiaData";
import {
  astrologiaBg,
  astrologiaTxt,
  AstrologiaIcon,
} from "../../GlobalVariables";

const EyeIcon = () => (
  <Box
    as="svg"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    w="16px"
    h="16px"
    fill="currentColor"
    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}
  >
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

export default function MetodoAstrologiaPlanetas() {
  const navigate = useNavigate();
  const { carta, loading, saving, actualizar, todoCompletado } = useCartaPlanetas();
  const [picker, setPicker] = useState<PickerState | null>(null);
  const [comicOpen, setComicOpen] = useState(false);

  if (loading) {
    return (
      <Box minH="100vh" bg="#008080">
        <SpinnerTurquesa />
      </Box>
    );
  }

  const sigIdx = siguienteCuerpoIndex(carta);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {/* ── CABECERA ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }}>
        <MetodoStepHeader
          icon={<AstrologiaIcon size={{ base: "28px", md: "38px" }} />}
          title="Astrología"
          bgColor={`${astrologiaBg}dd`}
          color={astrologiaTxt}
          space
          mb={0}
          prev={{ label: "← Arquetipos", onClick: () => navigate("/metodo/astrologia/cartaAstral") }}
          extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
          next={{
            label: todoCompletado ? "Continuar a Psicología →" : "Completa primero la carta",
            onClick: () => navigate("/metodo/psicologia"),
            disabled: !todoCompletado,
          }}
        />
      </Flex>

      {/* ── GRID DE PLANETAS ── */}
      <Box px={{ base: 5, md: 10, lg: 16 }} py={{ base: 8, md: 12 }}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={{ base: 5, md: 6 }}
        >
          {CUERPOS.map((c, index) => {
            const valor = valorOf(carta, c.key);
            const esActual = sigIdx !== -1 && index === sigIdx;
            return (
              <PlanetaBox
                key={c.key}
                cuerpo={c}
                valor={valor}
                destacado={esActual}
                onAbrirPicker={(campo) => setPicker({ key: c.key, campo })}
                onProfundizarSigno={() => navigate(`/metodo/astrologia/${c.key}/signo`)}
                onProfundizarCasa={() => navigate(`/metodo/astrologia/${c.key}/casa`)}
              />
            );
          })}
        </Grid>

        <Flex justify="center" mt={6}>
          <Text color="rgba(255,255,255,0.5)" fontSize="xs" letterSpacing="0.1em" fontStyle="italic">
            {saving ? "Guardando…" : "Tus cambios se guardan automáticamente."}
          </Text>
        </Flex>
      </Box>

      <PlanetaPickerModal
        picker={picker}
        carta={carta}
        onClose={() => setPicker(null)}
        onSelect={(campo, valor) => {
          if (!picker) return;
          actualizar(picker.key, campo, valor as string);
        }}
      />

      <ComicAstrologiaModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
      />

      <SiteFooter />
    </Box>
  );
}
