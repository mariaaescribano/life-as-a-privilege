// ─────────────────────────────────────────────────────────────────────────────
// EL DIARIO DE TUS SESIONES (/diario) — lo que la persona lee.
//
// Gira alrededor del CALENDARIO, igual que el panel de la admin: los días con
// notas llevan un puntito con el color de su disciplina y tocar un día enseña
// SOLO sus notas — dos días distintos nunca se ven a la vez. Se abre por el
// último día con notas.
//
// Cada nota lleva el color y la foto de su disciplina (o va neutra si la sesión
// no fue de ninguna), el contenido con el mini-formato del diario (**negrita**,
// *cursiva*, --- rayita) y el «por qué» en su propio bloque destacado.
//
// Al abrirla se marcan todas como leídas, que es lo que apaga la marca de
// «nuevo» de la tarjeta del Home.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { TextoMarcado } from "../../components/global/TextoMarcado";
import { listarMias, marcarLeidas, type EntradaDiario } from "../../api/diario";
import { caraDeEntrada, fechaLarga } from "./diarioCara";
import CalendarioDiario from "./CalendarioDiario";
import { olvidarCacheDiario } from "./PinesDiario";
import { useT, useIdioma } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";

export default function Diario() {
  const t = useT();
  const { idioma } = useIdioma();
  const navigate = useNavigate();
  const nombreDisciplina = useNombreDisciplina();

  const [entradas, setEntradas] = useState<EntradaDiario[] | null>(null);
  /** El día que se está leyendo («2026-09-28»), o null hasta cargar. */
  const [dia, setDia] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    let cancel = false;
    (async () => {
      const lista = await listarMias();
      if (cancel) return;
      setEntradas(lista);
      // Se abre por el último día que tenga notas.
      const ultimo = lista
        .map((e) => e.fecha?.slice(0, 10))
        .filter(Boolean)
        .sort()
        .pop();
      if (ultimo) setDia(ultimo);
      // Ya las ha visto: se apaga la marca del Home. Se hace DESPUÉS de pintar,
      // para que las que llegaban sin leer se vean marcadas esta vez.
      if (lista.some((e) => !e.leida_at)) {
        await marcarLeidas();
        olvidarCacheDiario();
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const locale = idioma === "en" ? "en-GB" : "es-ES";

  /** Las notas del día elegido, de la primera a la última escrita. */
  const delDia = useMemo(
    () =>
      (entradas ?? [])
        .filter((e) => e.fecha?.slice(0, 10) === dia)
        .sort((a, b) => (a.created_at ?? "").localeCompare(b.created_at ?? "")),
    [entradas, dia],
  );

  if (entradas === null) return <LifeLoading variant="private" />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="760px">
          {/* ── TÍTULO ── */}
          <Flex direction="column" align="center" textAlign="center" gap={3} mb={{ base: 8, md: 10 }}>
            <Text
              color="white"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontWeight="700"
              letterSpacing="0.08em"
              textTransform="uppercase"
              lineHeight="1.15"
              textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(180,255,245,0.3)"
            >
              {t("diario.pagina.titulo")}
            </Text>
            <Text
              color="rgba(255,255,255,0.75)"
              fontSize={{ base: "sm", md: "md" }}
              fontStyle="italic"
              maxW="520px"
              lineHeight="1.7"
            >
              {t("diario.pagina.subtitulo")}
            </Text>
          </Flex>

          {entradas.length === 0 ? (
            <Text color="rgba(255,255,255,0.6)" fontStyle="italic" textAlign="center" py={10}>
              {t("diario.pagina.vacio")}
            </Text>
          ) : (
            <>
              {/* ── EL CALENDARIO ── los días con notas llevan puntitos con el
                  color de su disciplina; se toca un día y se leen las suyas. */}
              <Box mb={3}>
                <CalendarioDiario
                  entradas={entradas}
                  seleccionada={dia}
                  onSeleccionar={setDia}
                  locale={locale}
                />
              </Box>
              <Text color="rgba(255,255,255,0.55)" fontSize="xs" fontStyle="italic" textAlign="center" mb={{ base: 6, md: 8 }}>
                {t("diario.pagina.leyenda")}
              </Text>

              {/* ── LAS NOTAS DEL DÍA ── */}
              {dia && (
                <Flex align="center" gap={3} mb={5}>
                  <Box flex="1" h="1px" bg="rgba(255,255,255,0.25)" />
                  <Text
                    color="white"
                    fontWeight="700"
                    fontSize={{ base: "md", md: "lg" }}
                    letterSpacing="0.04em"
                    whiteSpace="nowrap"
                  >
                    {fechaLarga(dia, locale)}
                  </Text>
                  <Box flex="1" h="1px" bg="rgba(255,255,255,0.25)" />
                </Flex>
              )}

              {delDia.length === 0 ? (
                <Text color="rgba(255,255,255,0.6)" fontStyle="italic" textAlign="center" py={6}>
                  {t("diario.pagina.diaVacio")}
                </Text>
              ) : (
                <Flex direction="column" gap={{ base: 6, md: 8 }}>
                  {delDia.map((e) => (
                    <EntradaDelDiario
                      key={e.id}
                      entrada={e}
                      etiquetaSin={t("diario.sinDisciplina")}
                      tituloPorque={t("diario.porque")}
                      nombreDisciplina={nombreDisciplina}
                    />
                  ))}
                </Flex>
              )}
            </>
          )}

          {/* ── VOLVER ── */}
          <Flex justify="center" mt={{ base: 10, md: 14 }}>
            <Box
              as="button"
              onClick={() => navigate("/home")}
              px={7}
              py={3}
              borderRadius="full"
              bg="rgba(255,255,255,0.1)"
              border="1.5px solid rgba(255,255,255,0.45)"
              color="white"
              fontWeight="700"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.06em"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ bg: "rgba(255,255,255,0.18)", transform: "translateY(-2px)" }}
            >
              ← {t("diario.pagina.volver")}
            </Box>
          </Flex>
        </Box>
      </Flex>

      <SiteFooter />
    </Box>
  );
}

/** Una nota: caja con el color y la foto de su disciplina. */
function EntradaDelDiario({
  entrada,
  etiquetaSin,
  tituloPorque,
  nombreDisciplina,
}: {
  entrada: EntradaDiario;
  etiquetaSin: string;
  tituloPorque: string;
  nombreDisciplina: (nom: string, corto?: boolean) => string;
}) {
  const cara = caraDeEntrada(entrada.disciplina);
  const conFoto = cara.nom ? hasDisciplinaBg(cara.nom) : false;
  const etiqueta = cara.nom ? nombreDisciplina(cara.nom) : etiquetaSin;
  const Icon = cara.Icon;

  return (
    <Box
      minW={0}
      position="relative"
      overflow="hidden"
      borderRadius="2xl"
      px={{ base: 5, md: 7 }}
      py={{ base: 5, md: 6 }}
      bg={cara.bg}
      border={`1px solid ${cara.txt}55`}
      transition="border-color 0.2s"
      _hover={{ borderColor: `${cara.txt}aa` }}
    >
      {/* La foto de la disciplina de fondo, con su velo — la misma capa que
          usan las cajas del panel. Las entradas sin disciplina van lisas. */}
      {conFoto && <DisciplinaBgLayer nom={cara.nom} borderRadius="2xl" overlay={`${cara.bg}8c`} />}

      <Box position="relative" zIndex={1}>
        {/* ── Cabecera: la disciplina ── */}
        <Flex align="center" gap={2.5} flexWrap="wrap">
          {Icon && (
            <Flex
              align="center"
              justify="center"
              flexShrink={0}
              w="26px"
              h="26px"
              borderRadius="full"
              bg={cara.bg}
              border={`1.5px solid ${cara.txt}`}
            >
              <Box display="flex" style={{ filter: `drop-shadow(0 0 4px ${cara.bg})` }}>
                <Icon size={{ base: "15px", md: "15px" }} />
              </Box>
            </Flex>
          )}
          <Text
            color={cara.txt}
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.14em"
            textTransform="uppercase"
            style={{ textShadow: `0 1px 4px ${cara.bg}, 0 0 12px ${cara.bg}` }}
          >
            {etiqueta}
          </Text>
          <Box flex="1" h="1px" bg={`${cara.txt}44`} minW="10px" />
        </Flex>

        {/* ── Título ── */}
        {entrada.titulo && (
          <Text
            color={cara.txt}
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="700"
            lineHeight="1.25"
            mt={3}
            style={{ textShadow: `0 1px 5px ${cara.bg}, 0 0 16px ${cara.bg}` }}
          >
            {entrada.titulo}
          </Text>
        )}

        {/* ── Lo que se trabajó ── */}
        <Box mt={entrada.titulo ? 3 : 4}>
          <TextoMarcado
            texto={entrada.contenido}
            colorRaya={cara.txt}
            color={cara.txt}
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="1.85"
            style={{ textShadow: `0 1px 5px ${cara.bg}, 0 0 14px ${cara.bg}` }}
          />
        </Box>

        {/* ── El porqué ── */}
        {entrada.porque && (
          <Box
            mt={5}
            px={{ base: 4, md: 5 }}
            py={{ base: 4, md: 4 }}
            borderRadius="xl"
            bg={`${cara.bg}d9`}
            borderLeft={`3px solid ${cara.txt}`}
          >
            <Text
              color={cara.txt}
              fontSize="xs"
              fontWeight="700"
              letterSpacing="0.14em"
              textTransform="uppercase"
              mb={2}
              style={{ textShadow: `0 1px 4px ${cara.bg}` }}
            >
              {tituloPorque}
            </Text>
            <TextoMarcado
              texto={entrada.porque}
              colorRaya={cara.txt}
              color={cara.txt}
              fontSize={{ base: "sm", md: "md" }}
              fontStyle="italic"
              lineHeight="1.8"
              style={{ textShadow: `0 1px 5px ${cara.bg}, 0 0 14px ${cara.bg}` }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
