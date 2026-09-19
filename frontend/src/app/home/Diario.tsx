// ─────────────────────────────────────────────────────────────────────────────
// EL DIARIO DE TUS SESIONES (/diario) — lo que la persona lee.
//
// Un hilo vertical de entradas, de la más reciente a la más antigua. Cada una
// lleva el color y la foto de su disciplina (o va neutra si la sesión no fue de
// ninguna), y el «por qué» en su propio bloque destacado: es lo que da sentido
// a lo demás y no puede quedar diluido dentro del texto.
//
// Es una PÁGINA y no un popup a propósito: el diario crece, y dentro de un año
// leer treinta entradas en una caja con scroll sería incómodo. Aquí se puede
// enlazar, volver y leer con calma.
//
// Al abrirla se marcan todas como leídas, que es lo que apaga la marca de
// «nuevo» de la tarjeta del Home.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { DisciplinaBgLayer, hasDisciplinaBg } from "../../components/global/DisciplinaBgLayer";
import { listarMias, marcarLeidas, type EntradaDiario } from "../../api/diario";
import { caraDeEntrada, fechaLarga } from "./diarioCara";
import { olvidarCacheDiario } from "./DiarioUsuario";
import { useT, useIdioma } from "../../i18n";
import { useNombreDisciplina } from "../../i18n/nombreDisciplina";

export default function Diario() {
  const t = useT();
  const { idioma } = useIdioma();
  const navigate = useNavigate();
  const nombreDisciplina = useNombreDisciplina();

  const [entradas, setEntradas] = useState<EntradaDiario[] | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    let cancel = false;
    (async () => {
      const lista = await listarMias();
      if (cancel) return;
      setEntradas(lista);
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

  if (entradas === null) return <LifeLoading variant="private" />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10 }} py={{ base: 8, md: 12 }}>
        <Box w="100%" maxW="760px">
          {/* ── TÍTULO ── */}
          <Flex direction="column" align="center" textAlign="center" gap={3} mb={{ base: 8, md: 12 }}>
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
            /* ── EL HILO ──
               La línea vertical que une las entradas para que se lea como un
               diario y no como una lista suelta. Solo desde `md`: en móvil la
               caja ocupa todo el ancho y el hilo no cabe al lado. */
            <Box position="relative">
              {entradas.length > 1 && (
                <Box
                  display={{ base: "none", md: "block" }}
                  position="absolute"
                  left="7px"
                  top="12px"
                  bottom="12px"
                  w="2px"
                  bg="rgba(255,255,255,0.2)"
                  borderRadius="full"
                />
              )}

              <Flex direction="column" gap={{ base: 6, md: 8 }}>
                {entradas.map((e) => (
                  <EntradaDelDiario
                    key={e.id}
                    entrada={e}
                    locale={locale}
                    etiquetaSin={t("diario.sinDisciplina")}
                    tituloPorque={t("diario.porque")}
                    nombreDisciplina={nombreDisciplina}
                  />
                ))}
              </Flex>
            </Box>
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

/** Una entrada: bolita del hilo + caja con el color de su disciplina. */
function EntradaDelDiario({
  entrada,
  locale,
  etiquetaSin,
  tituloPorque,
  nombreDisciplina,
}: {
  entrada: EntradaDiario;
  locale: string;
  etiquetaSin: string;
  tituloPorque: string;
  nombreDisciplina: (nom: string, corto?: boolean) => string;
}) {
  const cara = caraDeEntrada(entrada.disciplina);
  const conFoto = cara.nom ? hasDisciplinaBg(cara.nom) : false;
  const etiqueta = cara.nom ? nombreDisciplina(cara.nom) : etiquetaSin;
  const Icon = cara.Icon;

  return (
    <Flex align="flex-start" gap={{ base: 0, md: 5 }}>
      {/* la bolita del hilo — solo en escritorio, como el hilo */}
      <Flex
        display={{ base: "none", md: "flex" }}
        flexShrink={0}
        mt="18px"
        w="16px"
        h="16px"
        borderRadius="full"
        bg={cara.bg}
        border={`2px solid ${cara.txt}`}
        style={{ boxShadow: `0 0 10px ${cara.txt}88` }}
      />

      <Box
        flex="1"
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
          {/* ── Cabecera: disciplina · fecha ── */}
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
            <Text
              color={`${cara.txt}cc`}
              fontSize="xs"
              flexShrink={0}
              style={{ textShadow: `0 1px 4px ${cara.bg}` }}
            >
              {fechaLarga(entrada.fecha, locale)}
            </Text>
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
          <Text
            color={cara.txt}
            fontSize={{ base: "md", md: "lg" }}
            lineHeight="1.85"
            mt={entrada.titulo ? 3 : 4}
            whiteSpace="pre-wrap"
            style={{ textShadow: `0 1px 5px ${cara.bg}, 0 0 14px ${cara.bg}` }}
          >
            {entrada.contenido}
          </Text>

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
              <Text
                color={cara.txt}
                fontSize={{ base: "sm", md: "md" }}
                fontStyle="italic"
                lineHeight="1.8"
                whiteSpace="pre-wrap"
                style={{ textShadow: `0 1px 5px ${cara.bg}, 0 0 14px ${cara.bg}` }}
              >
                {entrada.porque}
              </Text>
            </Box>
          )}
        </Box>
      </Box>
    </Flex>
  );
}
