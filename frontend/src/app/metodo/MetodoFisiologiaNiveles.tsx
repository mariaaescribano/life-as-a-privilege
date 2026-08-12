import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { MarcaLeido } from "../../components/metodo/MarcaLeido";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { MEDITACION_CEREBRO } from "../../components/metodo/comicMeditacion";
import { useComic } from "../../i18n/comics";
import { useT } from "../../i18n";
import { Reveal } from "../../components/global/Reveal";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon, noSelectSx} from "../../GlobalVariables";

// ── Niveles del recorrido de Fisiología ──────────────────────────────────
// «Bajar a lo más pequeño y volver a subir, nivel a nivel». No son disciplinas:
// son bloques dentro de Fisiología. Solo el Nivel 1 (La materia) está abierto;
// los otros dos se irán construyendo y desbloqueando.
interface Nivel {
  n: number;
  titulo: string;
  sub: string;
  ruta?: string;
  /** Flag(es) de metodo_fisiologia.data que deben estar en true para desbloquear
   *  este nivel. Ausente = siempre abierto (Nivel 1). El Nivel 2 se abre al
   *  terminar el Nivel 1 (estructuras_hecho). PROFUNDIZA se abre al superar los
   *  dos primeros niveles (estructuras_hecho + organismo_hecho). Si es array,
   *  se exigen todos. */
  requiere?: string | string[];
  /** Flag que marca este nivel como SUPERADO (se muestra un tick arriba-derecha).
   *  Nivel 1 acaba en estructuras; Nivel 2 (VIDA) acaba en organismo. */
  superado?: string;
  /** Antetítulo (por defecto «Nivel {n}»). P.ej. la práctica usa «Práctica». */
  eyebrow?: string;
  /** Icono del círculo en vez del número: "avanzado" (PROFUNDIZA). */
  iconKind?: "avanzado";
}

const NIVELES: Nivel[] = [
  { n: 1, titulo: "MATERIA", sub: "De qué estás hecho.", ruta: "/metodo/fisiologia/particulas", superado: "estructuras_hecho" },
  // VIDA absorbe Sistemas: célula → todas-tus-células → sistemas → organismo.
  { n: 2, titulo: "VIDA", sub: "El milagro de ser un cuerpo.", ruta: "/metodo/fisiologia/celula", requiere: "estructuras_hecho", superado: "organismo_hecho" },
  // 3ª tarjeta · contenido avanzado: bloqueado hasta superar los dos primeros niveles.
  { n: 3, titulo: "PROFUNDIZA", sub: "Para los que quieren toda la verdad.", ruta: "/metodo/fisiologia/profundiza", requiere: ["estructuras_hecho", "organismo_hecho"], eyebrow: "Avanzado", iconKind: "avanzado" },
];

// SVG candado (mismo que usa la caja de disciplina bloqueada).
const Candado = ({ size }: { size: any }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill={fisiologiaTxt}
       style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

// SVG «profundizar» (matraz/experimento) para la tarjeta avanzada.
const Profundiza = ({ size }: { size: any }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill={fisiologiaTxt}
       style={{ filter: `drop-shadow(0 1px 3px ${fisiologiaBg})` }}>
    <path d="M200-120v-80h200v-80q-83 0-141.5-58.5T200-480q0-61 33.5-111t90.5-73q8-34 35.5-55t62.5-21l-22-62 38-14-14-36 76-28 12 38 38-14 110 300-38 14 14 38-76 28-12-38-38 14-24-66q-15 14-34.5 21t-39.5 5q-22-2-41-13.5T338-582q-27 16-42.5 43T280-480q0 50 35 85t85 35h320v80H520v80h240v80H200Zm346-458 36-14-68-188-38 14 70 188Zm-97.5-33.5Q460-623 460-640t-11.5-28.5Q437-680 420-680t-28.5 11.5Q380-657 380-640t11.5 28.5Q403-600 420-600t28.5-11.5ZM546-578Zm-126-62Zm0 0Z" />
  </Box>
);

// Tick de «nivel superado» (esquina superior derecha de la tarjeta). Es la
// marquita común del recorrido (MarcaLeido), la misma que en las tarjetas.
const TickSuperado = () => (
  <MarcaLeido tinta={fisiologiaTxt} bg={fisiologiaBg} title="Superado" />
);

// ── Caja de un nivel (tarjeta VERTICAL, para ir las 3 en fila) ──────────────
function NivelBox({ nivel, locked, done, onEnter }: { nivel: Nivel; locked: boolean; done: boolean; onEnter: () => void }) {
  return (
    <Box
      as={locked ? "div" : "button"}
      onClick={locked ? undefined : onEnter}
      position="relative"
      w="100%"
      h="100%"
      borderRadius="2xl"
      overflow="hidden"
      cursor={locked ? "default" : "pointer"}
      aria-disabled={locked}
      border={`1px solid ${locked ? `${fisiologiaTxt}33` : `${fisiologiaTxt}77`}`}
      opacity={locked ? 0.72 : 1}
      boxShadow={locked
        ? `inset 0 0 24px rgba(0,0,0,0.35)`
        : `0 0 16px ${fisiologiaTxt}26, 0 0 40px ${fisiologiaTxt}16, inset 0 0 24px rgba(0,0,0,0.25)`}
      transition="all 0.25s ease"
      _hover={locked ? undefined : {
        transform: "translateY(-6px)",
        borderColor: fisiologiaTxt,
        boxShadow: `0 0 26px ${fisiologiaTxt}88, 0 0 64px ${fisiologiaTxt}44, inset 0 0 24px rgba(0,0,0,0.2)`,
      }}
      _active={locked ? undefined : { transform: "translateY(-2px)" }}
    >
      {/* Mismo fondo de Fisiología en las 3 (unidad). Los bloqueados con velo
          oscuro extra para que se lean "apagados". */}
      <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl"
                         overlay={locked ? "rgba(0,0,0,0.6)" : `${fisiologiaBg}66`} />

      {/* Tick de nivel superado (arriba a la derecha) */}
      {done && <TickSuperado />}

      <Flex position="relative" zIndex={1} direction="column" align="center" textAlign="center"
            h="100%" gap={{ base: 2, md: 2.5 }} px={{ base: 5, md: 4 }} py={{ base: 6, md: 7 }}>
        {/* Círculo con el número del nivel (o su icono; candado si bloqueado) */}
        <Box position="relative" flexShrink={0} w={{ base: "54px", md: "62px" }} h={{ base: "54px", md: "62px" }} mb={1}>
          <Box w="100%" h="100%" borderRadius="full"
               border={`2px solid ${locked ? `${fisiologiaTxt}88` : fisiologiaTxt}`}
               bg={`${fisiologiaBg}cc`} display="flex" alignItems="center" justifyContent="center">
            {nivel.iconKind === "avanzado" ? (
              <Profundiza size={{ base: "28px", md: "32px" }} />
            ) : (
              <Text color={fisiologiaTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" lineHeight="1"
                    style={{ textShadow: `0 1px 6px ${fisiologiaBg}` }}>
                {nivel.n}
              </Text>
            )}
          </Box>
          {locked && (
            <Box position="absolute" inset={0} borderRadius="full" bg="rgba(0,0,0,0.55)"
                 display="flex" alignItems="center" justifyContent="center" sx={{ backdropFilter: "blur(2px)" }}>
              <Candado size={{ base: "26px", md: "30px" }} />
            </Box>
          )}
        </Box>

        <Text color={fisiologiaTxt} fontSize="2xs" fontWeight={700} letterSpacing="0.16em" textTransform="uppercase"
              style={{ textShadow: `0 1px 3px ${fisiologiaBg}f0` }}>
          {nivel.eyebrow ?? `Nivel ${nivel.n}`}
        </Text>
        <Text color={fisiologiaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight={700} lineHeight="1.2"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
          {nivel.titulo}
        </Text>
        <Text color={fisiologiaTxt} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" lineHeight="1.55"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
          {locked ? "Próximamente" : nivel.sub}
        </Text>

        {/* Empuja la pista de acción al fondo para que las 3 tarjetas cuadren */}
        <Box flex="1" minH={{ base: 2, md: 3 }} />

        {locked ? (
          <Text color={`${fisiologiaTxt}99`} fontSize="2xs" fontWeight={700} letterSpacing="0.12em"
                 textTransform="uppercase">
            Bloqueado
          </Text>
        ) : (
          <Flex align="center" gap={1.5} color={fisiologiaTxt}>
            <Text fontSize={{ base: "sm", md: "md" }} fontWeight={700} letterSpacing="0.04em"
                  style={{ textShadow: `0 1px 4px ${fisiologiaBg}` }}>
              Entrar
            </Text>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                 w="18px" h="18px" fill="currentColor"
                 style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </Box>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaNiveles() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // Flags de progreso (metodo_fisiologia.data) que desbloquean cada nivel.
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  // Cómic «La meditación y el cerebro»: se intercala al pulsar «La sonrisa
  // interior →», antes de entrar en la práctica.
  const [comicOpen, setComicOpen] = useState(false);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  // Las viñetas del cómic de la meditación, en el idioma activo.
  const meditacionVinetas = useComic("fisiologia-meditacion", MEDITACION_CEREBRO);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }

        // Progreso guardado: sirve para desbloquear los niveles 2 y 3.
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFlags(r.data?.data ?? {});
        } catch { /* sin fila todavía → todo bloqueado salvo Nivel 1 */ }
      } catch {
        navigate("/metodo/fisiologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return <FisiologiaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1200px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Niveles"
            compact
            bgColor={`${fisiologiaBg}dd`}
            color={fisiologiaTxt}
            nom={fisiologiaNom}
            mb={0}
            prev={{ label: "← Introducción", onClick: () => navigate("/metodo/fisiologia") }}
            extra={celulasBtn}
            next={{ label: "La sonrisa interior →", onClick: () => setComicOpen(true) }}
          />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px">
              Descubre poco a poco, de las partículas que te forman hasta el ecosistema complejo y mágico que eres.
            </Text>
          </Reveal>

          {/* Las 3 tarjetas en fila (en móvil se apilan). Entran de izquierda a
              derecha con retraso escalonado. No se salen del ancho del header:
              mismo maxW que MetodoStepHeader (850px). */}
          <Flex direction={{ base: "column", md: "row" }} align="stretch"
                justify="center" gap={{ base: 4, md: 4 }} w="100%" maxW="850px">
            {NIVELES.map((nivel, i) => {
              const reqs = nivel.requiere
                ? (Array.isArray(nivel.requiere) ? nivel.requiere : [nivel.requiere])
                : [];
              const locked = reqs.some((f) => !flags[f]);
              const done = !!nivel.superado && !!flags[nivel.superado];
              return (
                <Reveal key={nivel.n} direction="right" distance={44} delay={0.15 * i} duration={0.6}
                        flex={{ md: 1 }} w="100%" maxW={{ base: "380px", md: "none" }}
                        mx={{ base: "auto", md: 0 }} display="flex">
                  <NivelBox nivel={nivel} locked={locked} done={done}
                            onEnter={() => { if (!locked && nivel.ruta) navigate(nivel.ruta); }} />
                </Reveal>
              );
            })}
          </Flex>

        </Flex>
      </Flex>

      {celulasModal}

      {/* Cómic de paso: «La meditación y el cerebro». Al terminarlo (o pulsar
          «Saltar →») entra en la práctica de La sonrisa interior. */}
      <ComicPasoModal
        isOpen={comicOpen}
        onClose={() => setComicOpen(false)}
        onContinue={() => navigate("/metodo/fisiologia/sonrisa")}
        vinetas={meditacionVinetas}
        continueLabel={
          <>
            <Box as="span" display={{ base: "none", md: "inline" }}>{t("fisiologia.sonrisa.titulo")}</Box>
            <Box as="span" display={{ base: "inline", md: "none" }}>{t("fisiologia.sonrisa.corto")}</Box>
          </>
        }
        themeColor={fisiologiaTxt}
        textColor={fisiologiaTxt}
        disciplinaBgImage="/img/fondos/fisio.webp"
        disciplinaBgColor={fisiologiaBg}
      />

      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
