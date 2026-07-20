import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { ElementoComicModal } from "../../components/metodo/ElementoComicModal";
import { DisciplinaBgLayer, disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { TcmLoader } from "../../components/metodo/comicLoaders";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, elementoDesbloqueado, elementoLeido, viajeCompleto,
  type DatosTcm, type Elemento,
} from "../../components/metodo/tcmRecorrido";
import { tieneContenido, COMIC_INTRO_ELEMENTOS, ICONO_ELEMENTO } from "../../components/metodo/tcmElementosContenido";

const TINTA = tcmTxt;
const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
// Mismo glow ligero que el header, para uniformar los boxes.
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// Entrada épica de la estrella: los 5 elementos «florecen» uno a uno desde su
// sitio, con un leve rebote (mismo espíritu que las 12 casas de Astrología).
const MotionG = motion.g as any;
const EASE_POP = [0.34, 1.56, 0.64, 1] as const;
const ESTRELLA_APPEAR_BASE = 0.45; // arranca tras asentarse el box
const ESTRELLA_APPEAR_STEP = 0.12; // separación entre un elemento y el siguiente

const CX = 160, CY = 170, R = 120, FOTO_R = 32;
function vertice(i: number, radio: number) {
  const ang = (-90 + i * 72) * (Math.PI / 180);
  return { x: CX + radio * Math.cos(ang), y: CY + radio * Math.sin(ang) };
}

export default function MetodoTcmElementos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatosTcm>({});
  const [comicEl, setComicEl] = useState<Elemento | null>(null);
  const [introIdx, setIntroIdx] = useState(0);
  const [vinOk, setVinOk] = useState(false); // foto de la viñeta actual ya cargada
  const reduce = useReducedMotion();
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  // No pintamos la página hasta que las fotos de fondo (el fondo de TCM, los
  // iconos de los elementos y las viñetas de la intro) estén completamente
  // cargadas: mientras tanto, solo el loader. Así aparece todo a la vez.
  const fondosListos = usePrecargarImagenes([
    disciplinaBgImg(tcmNom),
    ...ORDEN_ELEMENTOS.map((el) => ICONO_ELEMENTO[el]),
    ...COMIC_INTRO_ELEMENTOS.map((v) => v.src),
  ]);

  // Al cambiar de viñeta, ocultamos la nueva foto hasta que cargue (spinner).
  useEffect(() => { setVinOk(false); }, [introIdx]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: DatosTcm = res.data?.data ?? {};
        setData(d);
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const estados = useMemo(() => ORDEN_ELEMENTOS.map((el) => ({
    el,
    desbloqueado: elementoDesbloqueado(data, el),
    leido: elementoLeido(data, el),
    disponible: tieneContenido(el),
  })), [data]);

  // Pinchar un elemento abre su cómic (no navega a otra página). El autoguardado,
  // los tests y el "marcar como leído" los gestiona ElementoComicModal.
  const abrir = (el: Elemento, desbloqueado: boolean, disponible: boolean) => {
    if (!desbloqueado || !disponible) return;
    setComicEl(el);
  };

  if (loading || !fondosListos) {
    return (
      <Box minH="100vh" bg="#008080" display="flex" alignItems="center" justifyContent="center">
        <TcmLoader color="#ffffff" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Los Cinco Elementos"
            pageLabel="2/7"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Medicina China", onClick: () => navigate("/metodo/tcm") }}
            extra={ilustracionesBtn}
            next={{
              label: "Los ciclos →",
              onClick: () => navigate("/metodo/tcm/ciclos"),
              disabled: !viajeCompleto(data),
              disabledTooltip: "Recorre los cinco elementos para continuar",
            }}
          />
          </Reveal>

          {/* La estrella interactiva */}
          <Reveal direction="up" distance={34} scaleFrom={0.97} delay={0.12} duration={0.75} w="100%">
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <Flex position="relative" zIndex={1} justify="center" px={{ base: 4, md: 6 }} py={{ base: 7, md: 9 }}>
              <Box as="svg" viewBox="0 0 320 312" w={{ base: "300px", md: "380px" }} h="auto" overflow="visible">
                <defs>
                  {ORDEN_ELEMENTOS.map((el, i) => {
                    const v = vertice(i, R);
                    return (
                      <clipPath id={`hub-clip-${el}`} key={el}>
                        <circle cx={v.x} cy={v.y} r={FOTO_R} />
                      </clipPath>
                    );
                  })}
                </defs>
                {/* pentágono de referencia */}
                <polygon
                  points={ORDEN_ELEMENTOS.map((_, i) => { const v = vertice(i, R); return `${v.x},${v.y}`; }).join(" ")}
                  fill="none" stroke={`${tcmTxt}33`} strokeWidth={1}
                />
                {estados.map(({ el, desbloqueado, leido, disponible }, i) => {
                  const v = vertice(i, R);
                  const label = vertice(i, R + 46);
                  const activo = desbloqueado && disponible;
                  const color = ELEMENTOS[el].color;
                  return (
                    <MotionG key={el} style={{ cursor: activo ? "pointer" : "not-allowed",
                               transformBox: "view-box", transformOrigin: `${v.x}px ${v.y}px` }}
                       initial={reduce ? false : { opacity: 0, scale: 0.3 }}
                       animate={reduce ? {} : { opacity: 1, scale: 1 }}
                       transition={{ delay: ESTRELLA_APPEAR_BASE + i * ESTRELLA_APPEAR_STEP, duration: 0.6, ease: EASE_POP }}
                       onClick={() => abrir(el, desbloqueado, disponible)}>
                      {/* base + icono del elemento */}
                      <circle cx={v.x} cy={v.y} r={FOTO_R + 2} fill={tcmBg} opacity={0.55} />
                      <image href={ICONO_ELEMENTO[el]} x={v.x - FOTO_R} y={v.y - FOTO_R}
                             width={FOTO_R * 2} height={FOTO_R * 2}
                             clipPath={`url(#hub-clip-${el})`} preserveAspectRatio="xMidYMid slice"
                             opacity={activo ? 1 : 0.35} />
                      {/* velo si está bloqueado */}
                      {!activo && <circle cx={v.x} cy={v.y} r={FOTO_R} fill={tcmBg} opacity={0.45} />}
                      {/* aro */}
                      <circle cx={v.x} cy={v.y} r={FOTO_R} fill="none"
                              stroke={leido ? "white" : activo ? color : `${tcmTxt}55`}
                              strokeWidth={leido ? 3 : 2}
                              style={activo ? { filter: `drop-shadow(0 0 5px ${color})` } : undefined} />
                      {/* candado si bloqueado (icono blanco, no emoji) */}
                      {!activo && (
                        <path fill="white"
                              transform={`translate(${v.x} ${v.y}) scale(0.021) translate(-480 500)`}
                              d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
                      )}
                      {/* insignia ✓ si leído */}
                      {leido && (
                        <>
                          <circle cx={v.x + FOTO_R * 0.72} cy={v.y - FOTO_R * 0.72} r={9} fill="white" />
                          <text x={v.x + FOTO_R * 0.72} y={v.y - FOTO_R * 0.72} fill={color} fontSize={12}
                                fontWeight={700} textAnchor="middle" dominantBaseline="central">✓</text>
                        </>
                      )}
                      <text x={label.x} y={label.y} fill="white" fontSize={14} fontWeight={700}
                            textAnchor="middle" dominantBaseline="middle"
                            style={{ textShadow: "0 1px 4px rgba(58,10,10,0.95)" }}>
                        {ELEMENTOS[el].nombre}
                      </text>
                    </MotionG>
                  );
                })}
              </Box>
            </Flex>
          </Box>
          </Reveal>

          <Reveal direction="up" distance={14} delay={0.2} duration={0.6} display="flex" justifyContent="center">
          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="560px" lineHeight="1.8">
            Los elementos se abren en orden (Madera → Fuego → Tierra → Metal → Agua). Al leer cada uno, se marca con ✓.
          </Text>
          </Reveal>

          {/* Intro (Módulo 1) · cómic de 4 viñetas: foto a la izquierda, texto
              a la derecha, navegable con flechas. Mismo estilo que las
              Ilustraciones pero inline (sin popup y sobre el fondo actual). */}
          {(() => {
            const total = COMIC_INTRO_ELEMENTOS.length;
            const vin = COMIC_INTRO_ELEMENTOS[introIdx];
            const isFirst = introIdx === 0;
            const isLast = introIdx === total - 1;
            return (
              <Reveal inView direction="up" distance={26} scaleFrom={0.98} duration={0.7} amount={0.15} w="100%">
              <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
                <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />

                {/* Línea de luz superior */}
                <Box position="absolute" top="-1px" left="15%" right="15%" h="1px" zIndex={2}
                     bgGradient={`linear(to-r, transparent, ${tcmTxt}aa, transparent)`} />

                <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }}
                      align="center" justify="center" gap={{ base: 5, md: 10 }}
                      px={{ base: 6, md: 12 }} py={{ base: 7, md: 9 }}>

                  {/* Foto (viñeta) */}
                  <Box key={`foto-${introIdx}`} w={{ base: "80%", md: "300px" }} maxW={{ base: "260px", md: "300px" }}
                       aspectRatio={1} flexShrink={0} position="relative"
                       sx={{ filter: `drop-shadow(0 0 20px rgba(255,255,255,0.25)) drop-shadow(0 0 60px ${tcmTxt}44)` }}>
                    <Box as="img" src={encodeURI(vin.src)} alt={`Los Cinco Elementos (${introIdx + 1}/${total})`}
                         w="100%" h="100%" borderRadius="lg"
                         onLoad={() => setVinOk(true)}
                         style={{ objectFit: "contain", opacity: vinOk ? 1 : 0, transition: "opacity 0.5s ease" }} />
                    {!vinOk && (
                      <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center">
                        <SpinnerTurquesa fullScreen={false} color={tcmTxt} />
                      </Box>
                    )}
                  </Box>

                  {/* Separador elegante: rayita horizontal en móvil, vertical en escritorio */}
                  <Box flexShrink={0} alignSelf="center" borderRadius="full"
                       w={{ base: "52px", md: "1px" }} h={{ base: "1px", md: "150px" }}
                       bgGradient={{
                         base: `linear(to-r, transparent, ${tcmTxt}aa, transparent)`,
                         md: `linear(to-b, transparent, ${tcmTxt}aa, transparent)`,
                       }} />

                  {/* Texto — misma tipografía que el cómic de Astrología
                      (ComicViewer): grande, ligero, con aire entre líneas. */}
                  <Flex direction="column" gap={3} flex="1" minW={0} w={{ base: "100%", md: "auto" }}>
                    <Text key={`txt-${introIdx}`} color={TINTA} fontSize={{ base: "lg", md: "xl" }} lineHeight="2.15"
                          letterSpacing="0.03em" fontWeight="400" textAlign={{ base: "center", md: "left" }}
                          style={{ textShadow: INK_SHADOW }}>
                      {vin.texto}
                    </Text>
                  </Flex>
                </Flex>

                {/* Controles de navegación — flechas redondas con glow, como
                    las del ComicViewer de Astrología. */}
                <Flex position="relative" zIndex={1} align="center" justify="center" gap={6}
                      pb={{ base: 5, md: 6 }} mt={{ base: -1, md: -2 }}>
                  <IconButton aria-label="Anterior" onClick={() => setIntroIdx((i) => Math.max(i - 1, 0))}
                    isDisabled={isFirst} variant="ghost" color={tcmTxt} opacity={isFirst ? 0.25 : 1}
                    borderRadius="full" w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }}
                    minW={{ base: "42px", md: "48px" }}
                    bg={`${tcmTxt}10`} border={`1px solid ${tcmTxt}33`}
                    boxShadow={isFirst ? "none" : `0 0 14px ${tcmTxt}44, 0 0 32px ${tcmTxt}22`}
                    _hover={isFirst ? {} : { bg: `${tcmTxt}22`, borderColor: `${tcmTxt}88`, boxShadow: `0 0 22px ${tcmTxt}66, 0 0 50px ${tcmTxt}33` }}
                    icon={
                      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="26px" h="26px" fill={tcmTxt}
                        style={{ filter: isFirst ? "none" : `drop-shadow(0 0 6px ${tcmTxt}cc) drop-shadow(0 0 14px ${tcmTxt}77)` }}>
                        <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
                      </Box>
                    } />
                  {/* Puntitos de paso — el activo se alarga en píldora, como el
                      carrusel del inicio; clicables para saltar de viñeta. */}
                  <Flex align="center" justify="center" gap={2}>
                    {COMIC_INTRO_ELEMENTOS.map((_, i) => {
                      const activo = i === introIdx;
                      return (
                        <Box
                          key={i}
                          as="button"
                          aria-label={`Viñeta ${i + 1}`}
                          onClick={() => setIntroIdx(i)}
                          w={activo ? "22px" : "8px"}
                          h="8px"
                          borderRadius="full"
                          bg={activo ? tcmTxt : `${tcmTxt}44`}
                          cursor="pointer"
                          transition="all 0.25s ease"
                          boxShadow={activo ? `0 0 8px ${tcmTxt}aa, 0 0 16px ${tcmTxt}66` : "none"}
                          _hover={{ bg: activo ? tcmTxt : `${tcmTxt}88` }}
                        />
                      );
                    })}
                  </Flex>
                  <IconButton aria-label="Siguiente" onClick={() => setIntroIdx((i) => Math.min(i + 1, total - 1))}
                    isDisabled={isLast} variant="ghost" color={tcmTxt} opacity={isLast ? 0.25 : 1}
                    borderRadius="full" w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }}
                    minW={{ base: "42px", md: "48px" }}
                    bg={`${tcmTxt}10`} border={`1px solid ${tcmTxt}33`}
                    boxShadow={isLast ? "none" : `0 0 14px ${tcmTxt}44, 0 0 32px ${tcmTxt}22`}
                    _hover={isLast ? {} : { bg: `${tcmTxt}22`, borderColor: `${tcmTxt}88`, boxShadow: `0 0 22px ${tcmTxt}66, 0 0 50px ${tcmTxt}33` }}
                    icon={
                      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="26px" h="26px" fill={tcmTxt}
                        style={{ filter: isLast ? "none" : `drop-shadow(0 0 6px ${tcmTxt}cc) drop-shadow(0 0 14px ${tcmTxt}77)` }}>
                        <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                      </Box>
                    } />
                </Flex>

                {/* Línea de luz inferior */}
                <Box position="absolute" bottom="-1px" left="15%" right="15%" h="1px" zIndex={2}
                     bgGradient={`linear(to-r, transparent, ${tcmTxt}aa, transparent)`} />
              </Box>
              </Reveal>
            );
          })()}
        </Flex>
      </Flex>

      {ilustracionesModal}

      {/* Cómic del elemento: fondo y box con la foto del elemento; cerrable en cualquier momento. */}
      <ElementoComicModal
        elemento={comicEl}
        data={data}
        onChangeData={setData}
        onClose={() => setComicEl(null)}
      />

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}
