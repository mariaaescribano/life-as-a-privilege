import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { FichaExploraModal } from "../../components/metodo/FichaExploraModal";
import { MarcaLeido } from "../../components/metodo/MarcaLeido";
import { ComicTemaModal } from "../../components/metodo/ComicTemaModal";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx} from "../../GlobalVariables";
import { PROFUNDIZA_LEIDAS_KEY, PROFUNDIZA_COMICS_KEY, type Ficha, type TemaProfundiza } from "../../hardCoded/espacio/ProfundizaFisiologia";
import { useTemaProfundiza } from "../../hardCoded/espacio/useTemaProfundiza";

// Tarjeta de una ficha (neurotransmisor, hormona…): imagen + nombre. Rejilla de 3.
// Todos los temas usan la MISMA iluminación (la de Neurotransmisores/Hormonas):
// borde + glow del color propio de la ficha en TODO el box, no solo en la imagen.
function FichaBox({ ficha, temaColor, active, leido = false, onClick }: {
  ficha: Ficha; temaColor: string; active: boolean; leido?: boolean; onClick: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);
  const accent = ficha.color || temaColor;
  return (
    <Box
      as="button"
      onClick={onClick}
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      w="100%"
      h="100%"
      borderRadius="2xl"
      border={`1px solid ${active ? accent : `${accent}66`}`}
      cursor="pointer"
      fontFamily="'EB Garamond', serif"
      transition="all 0.2s ease"
      boxShadow={active
        ? `0 6px 24px rgba(0,0,0,0.3), 0 0 26px ${accent}, 0 0 14px ${accent}88`
        : `0 4px 16px rgba(0,0,0,0.22), 0 0 16px ${accent}55`}
      _hover={{ transform: "translateY(-4px)", borderColor: accent,
                boxShadow: `0 10px 30px rgba(0,0,0,0.32), 0 0 24px ${accent}` }}
      _active={{ transform: "translateY(-1px)" }}
    >
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />

      {/* Marca de "ficha ya leída" — la común (MarcaLeido), igual que en las
          rejillas de FotoBox: círculo del Bg con el tick en la letra. */}
      {leido && <MarcaLeido tinta={fisiologiaTxt} bg={fisiologiaBg} />}

      {/* Foto a sangre en la parte de arriba (como en Sistemas). */}
      <Box position="relative" zIndex={1} w="100%" aspectRatio={1} overflow="hidden" flexShrink={0}
           bg={`${accent}22`}>
        {ficha.foto && !imgErr && (
          <Image src={encodeURI(ficha.foto)} alt={ficha.nombre} w="100%" h="100%" objectFit="cover"
                 onError={() => setImgErr(true)} />
        )}
      </Box>

      {/* Línea separadora a todo el ancho. */}
      <Box position="relative" zIndex={1} h="1px" bg={`${accent}55`} flexShrink={0} />

      {/* Pie: antetítulo + nombre. */}
      <Flex position="relative" zIndex={1} direction="column" justify="center" flex="1" gap={1}
            px={{ base: 3.5, md: 4 }} py={{ base: 3, md: 3.5 }}>
        {ficha.eyebrow && (
          <Text color={accent} fontSize="3xs" fontWeight={700} letterSpacing="0.12em" textTransform="uppercase"
                textAlign="center" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>
            {ficha.eyebrow}
          </Text>
        )}
        <Text color={fisiologiaTxt} fontWeight="700" lineHeight="1.2" textAlign="center"
              fontSize={{ base: "md", md: "lg" }} letterSpacing="0.02em"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.65)" }}>
          {ficha.nombre}
        </Text>
      </Flex>
    </Box>
  );
}

export default function MetodoFisiologiaTema() {
  const navigate = useNavigate();
  const { temaKey } = useParams<{ temaKey: string }>();
  const [loading, setLoading] = useState(true);
  const [ficha, setFicha] = useState<Ficha | null>(null);
  // La ficha abierta ya estaba leída ANTES de abrirla (aviso dentro del popup).
  const [fichaYaLeida, setFichaYaLeida] = useState(false);
  const [leidas, setLeidas] = useState<Set<string>>(new Set());
  const [comicAbierto, setComicAbierto] = useState(false);
  // El cómic «antes de empezar» de este tema ya se ha leído (marquita en el botón).
  const [comicLeido, setComicLeido] = useState(false);
  // Y si ya lo estaba ANTES de abrirlo, el visor lo dice arriba («✓ Leída»).
  const [comicYaLeido, setComicYaLeido] = useState(false);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  const dataRef = useRef<Record<string, any>>({});

  const tema: TemaProfundiza | undefined = useTemaProfundiza(temaKey || "");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!tema) { navigate("/metodo/fisiologia/profundiza", { replace: true }); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }

        // Cargamos las fichas ya leídas de este tema (para los checks).
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data ?? {};
          const mapa = dataRef.current?.[PROFUNDIZA_LEIDAS_KEY] ?? {};
          const arr: string[] = Array.isArray(mapa?.[temaKey || ""]) ? mapa[temaKey || ""] : [];
          if (arr.length) setLeidas(new Set(arr));
          const comics = dataRef.current?.[PROFUNDIZA_COMICS_KEY];
          if (Array.isArray(comics) && comics.includes(temaKey || "")) setComicLeido(true);
        } catch { /* sin fila todavía */ }

        // No mostramos la página hasta que TODAS las fotos de las fichas estén
        // descargadas: así la página y las fotos aparecen a la vez, nunca una
        // rejilla que se rellena de golpe. (onerror también cuenta, no se cuelga.)
        await precargarImagenes((tema?.fichas ?? []).map((f) => (f.foto ? encodeURI(f.foto) : null)));
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, temaKey]);

  if (loading) return <FisiologiaLoading />;
  if (!tema) return null;

  const tieneComic = (tema.comicIntro?.length ?? 0) > 0;
  const tieneFichas = tema.fichas.length > 0;
  // Ya se han leído TODAS las fichas: se descubre la frase de cierre del tema.
  const completo = tieneFichas && tema.fichas.every((f) => leidas.has(f.key));

  // Temas que se recorren por ZONAS (el cerebro: corteza → centro → base): las
  // fichas se reparten en bloques, cada uno con su título y su entradilla. Las
  // zonas sin fichas no se pintan. `desde` mantiene la cascada de entrada
  // corriendo de un bloque al siguiente, para que no se reinicie en cada zona.
  let desde = 0;
  const zonas = (tema.zonas ?? [])
    .map((z) => ({ ...z, fichas: tema.fichas.filter((f) => f.zona === z.zona) }))
    .filter((z) => z.fichas.length > 0)
    .map((z) => { const inicio = desde; desde += z.fichas.length; return { ...z, inicio }; });

  // Abre una ficha y la marca como leída (se guarda en BD). Se usa tanto al
  // pulsar la caja como al navegar con las flechas dentro del modal.
  const verFicha = (f: Ficha) => {
    // Antes de marcarla: si ya venía leída, la ficha lo dice arriba («✓ Leída»).
    setFichaYaLeida(leidas.has(f.key));
    setFicha(f);
    if (leidas.has(f.key)) return;
    const next = new Set(leidas);
    next.add(f.key);
    setLeidas(next);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const mapa = { ...(dataRef.current?.[PROFUNDIZA_LEIDAS_KEY] ?? {}) };
    mapa[tema.key] = Array.from(next);
    const data = { ...dataRef.current, [PROFUNDIZA_LEIDAS_KEY]: mapa };
    dataRef.current = data;
    axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => { /* se reintenta la próxima vez */ });
  };

  // Abre el cómic «antes de empezar» y lo deja marcado como leído (se guarda en
  // BD, igual que las fichas: al volver, el botón conserva su marquita).
  const abrirComic = () => {
    setComicYaLeido(comicLeido); // foto de antes: el aviso de dentro del cómic
    setComicAbierto(true);
    if (comicLeido) return;
    setComicLeido(true);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    const previos: string[] = Array.isArray(dataRef.current?.[PROFUNDIZA_COMICS_KEY])
      ? dataRef.current[PROFUNDIZA_COMICS_KEY] : [];
    const data = { ...dataRef.current, [PROFUNDIZA_COMICS_KEY]: [...previos, tema.key] };
    dataRef.current = data;
    axios.patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => { /* se reintenta la próxima vez */ });
  };

  // Una rejilla de fichas. `desdeI` es el número de fichas que van antes, para
  // que la cascada de entrada siga corriendo entre zonas en vez de reiniciarse.
  const rejilla = (fichas: Ficha[], desdeI = 0) => (
    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
      {fichas.map((f, i) => (
        <Reveal key={f.key} direction="up" distance={20} delay={0.05 * (desdeI + i)} duration={0.5} w="100%" display="flex">
          <FichaBox ficha={f} temaColor={tema.color} active={ficha?.key === f.key}
                    leido={leidas.has(f.key)} onClick={() => verFicha(f)} />
        </Reveal>
      ))}
    </SimpleGrid>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
              title={tema.label}
              compact
              bgColor={`${fisiologiaBg}dd`}
              color={fisiologiaTxt}
              nom={fisiologiaNom}
              mb={0}
              prev={{ label: "← Volver", onClick: () => navigate("/metodo/fisiologia/profundiza") }}
              extra={celulasBtn}
            />
          </Reveal>

          {tema.intro && (
            <Reveal direction="up" distance={18} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
              <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                    textAlign="center" lineHeight="1.8" maxW="660px">
                {tema.intro}
              </Text>
            </Reveal>
          )}

          {/* Botón «antes de empezar»: abre el cómic de síntesis. */}
          {tieneComic && (
            <Reveal direction="up" distance={16} delay={0.2} duration={0.55} display="flex" justifyContent="center">
              <Box
                as="button"
                onClick={abrirComic}
                display="inline-flex"
                alignItems="center"
                gap={2.5}
                px={{ base: 5, md: 7 }}
                py={{ base: 2.5, md: 3 }}
                borderRadius="full"
                bg={fisiologiaTxt}
                color={fisiologiaBg}
                border={`1px solid ${fisiologiaTxt}`}
                fontWeight="700"
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="0.03em"
                cursor="pointer"
                boxShadow={`0 0 18px ${fisiologiaTxt}66, 0 0 40px ${fisiologiaTxt}33, 0 2px 12px rgba(0,0,0,0.45)`}
                transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 28px ${fisiologiaTxt}88, 0 0 58px ${fisiologiaTxt}44` }}
              >
                <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                     w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill="currentColor">
                  <path d="M320-200v-560l440 280-440 280Z" />
                </Box>
                Antes de empezar: mira cómo se fabrican
                {/* Ya leído: la marquita común, aquí dentro del botón. */}
                {comicLeido && (
                  <MarcaLeido inline tinta={fisiologiaTxt} bg={fisiologiaBg}
                              size="22px" iconSize="13px" />
                )}
              </Box>
            </Reveal>
          )}

          {/* Rejilla de fichas, o mensaje de «en construcción». */}
          {tieneFichas ? (
            <>
              {tema.pista && (
                <Reveal direction="up" distance={12} delay={0.26} duration={0.5} display="flex" justifyContent="center">
                  <Text color={`${fisiologiaTxt}cc`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                        textAlign="center" style={{ textShadow: `0 1px 4px ${fisiologiaBg}` }}>
                    {tema.pista}
                  </Text>
                </Reveal>
              )}
              {zonas.length === 0 ? rejilla(tema.fichas) : zonas.map((z) => (
                <Flex key={z.zona} direction="column" w="100%" gap={{ base: 3, md: 4 }}
                      mt={z.inicio > 0 ? { base: 4, md: 6 } : 0}>
                  <Reveal direction="up" distance={14} duration={0.55} w="100%">
                    <Flex direction="column" align="center" gap={1.5} w="100%">
                      <Flex align="center" gap={{ base: 3, md: 4 }} w="100%">
                        <Box flex="1" h="1px" bg={`${fisiologiaTxt}44`} />
                        <Text color={fisiologiaTxt} fontWeight="700" fontSize={{ base: "md", md: "xl" }}
                              letterSpacing="0.14em" textTransform="uppercase" whiteSpace="nowrap"
                              style={{ textShadow: `0 0 12px ${fisiologiaTxt}66, 0 0 28px ${fisiologiaTxt}33` }}>
                          {z.titulo}
                        </Text>
                        <Box flex="1" h="1px" bg={`${fisiologiaTxt}44`} />
                      </Flex>
                      <Text color="rgba(255,255,255,0.82)" fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                            textAlign="center" lineHeight="1.7" maxW="560px">
                        {z.entradilla}
                      </Text>
                    </Flex>
                  </Reveal>
                  {rejilla(z.fichas, z.inicio)}
                </Flex>
              ))}

              {/* Frase de cierre: solo cuando ya se han leído todas las fichas. */}
              {tema.cierre && completo && (
                <Reveal direction="up" distance={16} duration={0.7} w="100%" display="flex" justifyContent="center">
                  <Text color="white" fontSize={{ base: "md", md: "xl" }} fontStyle="italic" textAlign="center"
                        lineHeight="1.9" maxW="620px" mt={{ base: 4, md: 6 }}
                        style={{ textShadow: "0 0 14px rgba(255,255,255,0.35), 0 0 30px rgba(180,255,245,0.2)" }}>
                    {tema.cierre}
                  </Text>
                </Reveal>
              )}
            </>
          ) : (
            <Reveal direction="up" distance={16} delay={0.2} duration={0.6} w="100%" display="flex" justifyContent="center">
              <Flex direction="column" align="center" gap={3} maxW="520px" textAlign="center"
                    position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                    border={`1px dashed ${fisiologiaTxt}44`} px={{ base: 6, md: 10 }} py={{ base: 10, md: 12 }}>
                <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" overlay={`${fisiologiaBg}88`} />
                <Text position="relative" zIndex={1} fontSize="4xl">🔬</Text>
                <Text position="relative" zIndex={1} color={fisiologiaTxt} fontWeight={700} fontSize={{ base: "lg", md: "xl" }}
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
                  Estamos construyendo este apartado
                </Text>
                <Text position="relative" zIndex={1} color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }}
                      fontStyle="italic" lineHeight="1.7" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  Muy pronto podrás explorarlo aquí. Sigue avanzando por el resto del recorrido.
                </Text>
              </Flex>
            </Reveal>
          )}

          <BotonPaso label="Volver" direction="prev"
                     nom={fisiologiaNom} color={fisiologiaTxt} bg={fisiologiaBg}
                     onClick={() => navigate("/metodo/fisiologia/profundiza")} />

        </Flex>
      </Flex>

      {/* Modal de la ficha (foto + explicación, con flechas). */}
      <FichaExploraModal ficha={ficha} fichas={tema.fichas} temaColor={tema.color}
                         leida={fichaYaLeida}
                         onSelect={verFicha} onClose={() => setFicha(null)} />

      {/* Cómic «antes de empezar». */}
      {tieneComic && (
        <ComicTemaModal isOpen={comicAbierto} vinetas={tema.comicIntro!} leida={comicYaLeido}
                        onClose={() => setComicAbierto(false)} />
      )}

      {celulasModal}
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
