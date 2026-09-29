import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { RecorridoLoading } from "../../components/metodo/RecorridoLoading";
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
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import {
  astrologiaBg,
  astrologiaNom,
  astrologiaTxt,
  AstrologiaIcon,
} from "../../GlobalVariables";
import { useT } from "../../i18n";

export default function MetodoAstrologiaPlanetas() {
  const t = useT();
  const navigate = useNavigate();
  const { carta, loading, saving, actualizar, todoCompletado } = useCartaPlanetas();
  const [picker, setPicker] = useState<PickerState | null>(null);
  const [comicOpen, setComicOpen] = useState(false);

  if (loading) {
    return <RecorridoLoading />;
  }

  const sigIdx = siguienteCuerpoIndex(carta);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      {/* ── CABECERA ── */}
      <Flex justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }}>
        <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
        <MetodoStepHeader
          icon={<AstrologiaIcon size={{ base: "28px", md: "38px" }} />}
          title={t("disciplina.astrologia")}
          bgColor={`${astrologiaBg}dd`}
          color={astrologiaTxt}
          space
          mb={0}
          prev={{ label: `← ${t("metodo.astro.paso.arquetipos")}`, onClick: () => navigate("/metodo/astrologia/cartaAstral") }}
          extra={{ label: t("metodo.ilustraciones"), onClick: () => setComicOpen(true)}}
          next={{
            label: todoCompletado ? "Psicología →" : "Completa primero la carta",
            onClick: () => navigate("/metodo/psicologia"),
            disabled: true, // Psicología bloqueada por ahora
            disabledTooltip: "Psicología estará disponible próximamente",
          }}
        />
        </Reveal>
      </Flex>

      {/* ── GRID DE PLANETAS ── */}
      <Box flex="1" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={{ base: 5, md: 6 }}
        >
          {CUERPOS.map((c, index) => {
            const valor = valorOf(carta, c.key);
            const esActual = sigIdx !== -1 && index === sigIdx;
            return (
              // Un Reveal inView POR tarjeta (nunca la rejilla entera: trampa
              // del `amount`); cascada corta por fila de la rejilla.
              <Reveal
                key={c.key}
                inView
                once
                amount={0.2}
                direction="up"
                distance={30}
                scaleFrom={0.97}
                duration={0.7}
                delay={Math.min((index % 3) * 0.07, 0.35)}
                w="100%"
                display="grid"
              >
                <PlanetaBox
                  cuerpo={c}
                  valor={valor}
                  destacado={esActual}
                  onAbrirPicker={(campo) => setPicker({ key: c.key, campo })}
                  onProfundizarSigno={() => navigate(`/metodo/astrologia/${c.key}/signo`)}
                  onProfundizarCasa={() => navigate(`/metodo/astrologia/${c.key}/casa`)}
                />
              </Reveal>
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

      <BotonCompania color={astrologiaTxt} bgColor={astrologiaBg} disciplinaNom={astrologiaNom} llamadaTitulo={t("metodo.astro.reservaLlamada")} />
      <SiteFooter />
    </Box>
  );
}
