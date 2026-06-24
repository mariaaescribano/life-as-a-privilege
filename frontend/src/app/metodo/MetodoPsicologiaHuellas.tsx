import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyudaRecorrido } from "../../components/metodo/AyudaRecorrido";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import {
  experienciaById,
  aniosConRecuerdo,
  itemsDelAno,
  itemMarcado,
  anoNatural,
  type LineaDeVidaData,
} from "../../components/metodo/psicologiaRecorrido";
import { AZUL, glowPanel, glowHeader, azulBorde } from "../../components/metodo/psicologiaGlow";
import {
  API_URL,
  neuropsicologiaBg,
  neuropsicologiaNom,
  neuropsicologiaTxt,
  NeuropsicologiaIcon,
} from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const CREMA = "rgba(255,255,255,0.92)";    // texto sobre el fondo teal de la página
const INK_SHADOW = `0 1px 2px #fbf4e8, 0 0 6px #fbf4e8, 0 0 13px ${neuropsicologiaBg}`;

export default function MetodoPsicologiaHuellas() {
  const navigate = useNavigate();
  const { experienciaId } = useParams<{ experienciaId: string }>();
  const exp = experienciaById(experienciaId || "");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LineaDeVidaData>({});
  const [guardando, setGuardando] = useState(false);
  const [spread, setSpread] = useState(0); // par de páginas visible (2 años)
  const guardadoRef = useRef<LineaDeVidaData>({});

  const anioActual = new Date().getFullYear();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!exp) { navigate("/metodo/psicologia", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.psicologia_suscrito) { navigate("/metodo/psicologia", { replace: true }); return; }

        const psi = await axios.get(`${API_URL}/metodo-psicologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: LineaDeVidaData = psi.data?.data || {};
        setData(d);
        guardadoRef.current = JSON.parse(JSON.stringify(d));
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienciaId]);

  const persistir = async (next: LineaDeVidaData) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    setGuardando(true);
    try {
      await axios.patch(
        `${API_URL}/metodo-psicologia/${userId}`,
        { data: next },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      guardadoRef.current = JSON.parse(JSON.stringify(next));
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  // Marca/desmarca un ítem (por texto) como «dejó huella».
  const toggleItem = async (edadAno: number, texto: string) => {
    const anos = { ...(data.anos || {}) };
    const ano = { ...(anos[String(edadAno)] || {}) };
    const set = new Set(ano.huellas || []);
    if (set.has(texto)) set.delete(texto);
    else set.add(texto);
    ano.huellas = Array.from(set);
    anos[String(edadAno)] = ano;
    const next = { ...data, anos };
    setData(next);
    await persistir(next);
  };

  const edad = typeof data.edad === "number" ? data.edad : 0;
  const anios = useMemo(() => aniosConRecuerdo(data, edad), [data, edad]);
  const totalSpreads = Math.max(1, Math.ceil(anios.length / 2));
  const spreadActual = Math.min(spread, totalSpreads - 1);
  const izquierda = anios[spreadActual * 2];
  const derecha = anios[spreadActual * 2 + 1];

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }
  if (!exp) return null;

  // ── Render de una página (un año) del cuaderno ──
  // `scrollIzquierda`: pone la barra de scroll en el borde IZQUIERDO (página
  // izquierda del cuaderno), como en un libro abierto.
  const Pagina = ({ edadAno, scrollIzquierda }: { edadAno: number | undefined; scrollIzquierda?: boolean }) => {
    if (edadAno === undefined) {
      // Página en blanco (cuando el nº de años es impar).
      return <Box flex="1" display={{ base: "none", md: "block" }} />;
    }
    const items = itemsDelAno(data, edadAno, exp.preguntasPorAno);
    return (
      <Box
        flex="1"
        minW={0}
        position="relative"
        overflow="hidden"
        h={{ base: "60vh", md: "440px" }}
        bgColor={neuropsicologiaBg}
        bgImage="url('/img/fondos/psciologia.png')"
        bgSize="cover"
        bgPosition="center"
      >
        {/* Contenido con scroll interno SIEMPRE visible (móvil y ordenador),
            barra gruesa para que quede clarísimo que se puede desplazar. */}
        <Box
          position="relative"
          zIndex={1}
          h="100%"
          overflowY="scroll"
          overscrollBehavior="contain"
          sx={{
            direction: scrollIzquierda ? "rtl" : "ltr",
            scrollbarWidth: "auto",
            scrollbarColor: `${TINTA} ${neuropsicologiaBg}`,
            "&::-webkit-scrollbar": { width: "14px" },
            "&::-webkit-scrollbar-track": { background: `${TINTA}1f` },
            "&::-webkit-scrollbar-thumb": { background: TINTA, borderRadius: "10px", border: `3px solid ${neuropsicologiaBg}`, backgroundClip: "content-box" },
          }}
        >
         <Box sx={{ direction: "ltr" }}>
          {/* Cabecera del año — con su propia "foto" de psicología */}
          <Box position="relative" px={{ base: 6, md: 8 }} py={{ base: 6, md: 7 }}>
            <FotoFranja posicion="center top" />
            <Flex position="relative" zIndex={1} direction="column" align="center" textAlign="center" gap={3}>
              <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" letterSpacing="0.02em" lineHeight="1.1" style={{ textShadow: INK_SHADOW }}>
                Año {edadAno}{"  "}
                <Box as="span" fontWeight="500" opacity={0.6}>{anoNatural(edad, edadAno, anioActual)}</Box>
              </Text>
            </Flex>
          </Box>

          {/* Cada ítem es su propia franja con una "foto" nueva; entre franjas,
              una raya de separación bien visible. */}
          {items.length === 0 ? (
            <Box position="relative" px={{ base: 6, md: 8 }} py={8} borderTop={`2px solid ${TINTA}55`}>
              <FotoFranja posicion="center 40%" />
              <Text position="relative" zIndex={1} color={TINTA} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.8} textAlign="center" style={{ textShadow: INK_SHADOW }}>
                Sin recuerdos escritos este año.
              </Text>
            </Box>
          ) : (
            items.map((it, i) => {
              const marcado = itemMarcado(data, edadAno, it);
              return (
                <Box
                  key={`${i}-${it}`}
                  position="relative"
                  px={{ base: 6, md: 8 }}
                  py={{ base: 4, md: 5 }}
                  borderTop={`2px solid ${TINTA}55`}
                >
                  {/* "Foto" de esta franja (posición distinta por ítem) */}
                  <FotoFranja posicion={`center ${(i * 29) % 100}%`} />
                  <Flex position="relative" zIndex={1} align="flex-start" gap={3}>
                    {/* ◈ para marcar que dejó huella (color psicología) */}
                    <Box
                      as="button"
                      onClick={() => toggleItem(edadAno, it)}
                      flexShrink={0}
                      mt="2px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      lineHeight="1"
                      fontSize={{ base: "20px", md: "22px" }}
                      color={TINTA}
                      opacity={marcado ? 1 : 0.4}
                      cursor="pointer"
                      transition="all 0.2s ease"
                      style={{ textShadow: marcado ? `0 1px 2px #fbf4e8, 0 0 9px ${TINTA}99` : `0 1px 2px #fbf4e8` }}
                      _hover={{ opacity: 1, transform: "scale(1.18)" }}
                      title={marcado ? "Dejó huella (pulsa para quitar)" : "Marcar que dejó huella"}
                      aria-label="Marcar que dejó huella"
                    >
                      ◈
                    </Box>
                    <Text flex="1" color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" fontWeight={marcado ? "600" : "400"} style={{ textShadow: INK_SHADOW }}>
                      {it}
                    </Text>
                  </Flex>
                </Box>
              );
            })
          )}
          {/* Franja final vacía: respiración elegante, como un ítem más */}
          {items.length > 0 && (
            <Box position="relative" px={{ base: 6, md: 8 }} py={{ base: 7, md: 9 }} borderTop={`2px solid ${TINTA}55`}>
              <FotoFranja posicion="center 85%" />
            </Box>
          )}
         </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="900px" gap={{ base: 6, md: 8 }}>

          <MetodoStepHeader
            icon={<NeuropsicologiaIcon size={{ base: "38px", md: "52px" }} />}
            title="Huellas"
            pageLabel="4/10"
            bgColor={`${neuropsicologiaBg}f0`}
            color={neuropsicologiaTxt}
            nom={neuropsicologiaNom}
            mb={0}
            boxShadow={glowHeader}
            prev={{ label: "← Línea de Vida", onClick: () => navigate(`/metodo/psicologia/${exp.id}`) }}
            next={{ label: "Nudos →", onClick: () => navigate(`/metodo/psicologia/${exp.id}/nudos`) }}
          />

          <Flex direction="column" align="center" textAlign="center" gap={2} maxW="620px">
            <Text color={CREMA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.9} lineHeight="1.8">
              Recorre tu historia. Marca con ◈ los recuerdos que dejaron huella en ti.
            </Text>
          </Flex>

          {anios.length === 0 ? (
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" border={azulBorde} boxShadow={glowPanel}>
              <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
              <Box position="relative" zIndex={1} px={8} py={12}>
                <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.8} textAlign="center" style={{ textShadow: INK_SHADOW }}>
                  Todavía no has escrito recuerdos en tu línea de vida. Vuelve atrás y visita los años que quieras recordar.
                </Text>
              </Box>
            </Box>
          ) : (
            <>
              {/* Cuaderno: dos páginas unidas por la espiral (ordenador) */}
              <Flex
                w="100%"
                align="stretch"
                justify="center"
                direction={{ base: "column", md: "row" }}
                gap={0}
                borderRadius="2xl"
                overflow="hidden"
                border={azulBorde}
                boxShadow={glowPanel}
              >
                <Pagina edadAno={izquierda} scrollIzquierda />

                {/* Lomo del cuaderno con anillas: opaco (cubre del todo la unión,
                    no asoma el fondo), monta sobre ambas páginas. Vertical en
                    ordenador, horizontal en móvil (une abajo↔arriba). */}
                <Flex
                  position="relative"
                  direction={{ base: "row", md: "column" }}
                  justify={{ base: "center", md: "space-evenly" }}
                  align="center"
                  flexShrink={0}
                  alignSelf="stretch"
                  w={{ base: "100%", md: "42px" }}
                  h={{ base: "34px", md: "440px" }}
                  bg={TINTA}
                  boxShadow={`inset 0 0 18px rgba(0,0,0,0.4)`}
                  my={{ base: "-14px", md: 0 }}
                  mx={{ base: 0, md: "-12px" }}
                  gap={{ base: 4, md: 0 }}
                  py={{ base: 0, md: 4 }}
                  zIndex={3}
                  aria-hidden
                >
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Box
                      key={i}
                      w="14px"
                      h="14px"
                      borderRadius="full"
                      border={`2px solid rgba(255,251,243,0.55)`}
                      bg="rgba(255,251,243,0.9)"
                      boxShadow={`inset 0 1px 3px rgba(94,45,16,0.5)`}
                    />
                  ))}
                </Flex>

                <Pagina edadAno={derecha} />
              </Flex>

              {/* Botones para pasar de página */}
              <Flex align="center" justify="center" gap={6} mt={1}>
                <FlechaPagina dir="prev" disabled={spreadActual === 0} onClick={() => setSpread((s) => Math.max(0, s - 1))} />
                <Text color={CREMA} fontSize="sm" opacity={0.9} letterSpacing="0.06em" minW="60px" textAlign="center">
                  {spreadActual + 1} / {totalSpreads}
                </Text>
                <FlechaPagina dir="next" disabled={spreadActual >= totalSpreads - 1} onClick={() => setSpread((s) => Math.min(totalSpreads - 1, s + 1))} />
              </Flex>
            </>
          )}

          <Text color={CREMA} fontSize="xs" opacity={0.6} fontStyle="italic" minH="1.2em">
            {guardando ? "Guardando…" : "Tus huellas se guardan solas."}
          </Text>
        </Flex>
      </Flex>

      <AyudaRecorrido pagina="huellas" />

      <SiteFooter />
    </Box>
  );
}

// "Foto" de acuarela para una franja (cabecera o ítem). Cada franja muestra
// una zona distinta de la imagen → sensación de una foto nueva entre rayas.
const FotoFranja = ({ posicion }: { posicion: string }) => (
  <Box
    position="absolute"
    inset="0"
    pointerEvents="none"
    bgColor={neuropsicologiaBg}
    bgImage="url('/img/fondos/psciologia.png')"
    bgSize="cover"
    style={{ backgroundPosition: posicion }}
  />
);

const FlechaPagina = ({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) => (
  <Box
    as="button"
    onClick={disabled ? undefined : onClick}
    w="46px"
    h="46px"
    borderRadius="full"
    bg={`${neuropsicologiaBg}f0`}
    border={`1px solid ${TINTA}${disabled ? "22" : "66"}`}
    color={`${TINTA}${disabled ? "55" : "ff"}`}
    display="flex"
    alignItems="center"
    justifyContent="center"
    fontSize="xl"
    cursor={disabled ? "not-allowed" : "pointer"}
    opacity={disabled ? 0.5 : 1}
    transition="all 0.2s ease"
    _hover={disabled ? {} : { transform: "translateY(-2px)", boxShadow: `0 0 14px ${AZUL}66, 0 0 30px ${AZUL}33` }}
  >
    {dir === "prev" ? "←" : "→"}
  </Box>
);
