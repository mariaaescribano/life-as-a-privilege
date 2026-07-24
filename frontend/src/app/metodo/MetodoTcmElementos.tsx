import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { ElementoComicModal } from "../../components/metodo/ElementoComicModal";
import { IntroComicModal } from "../../components/metodo/IntroComicModal";
import { useIntroComic } from "../../hooks/useIntroComic";
import { DisciplinaBgLayer, disciplinaBgImg } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { TcmLoader } from "../../components/metodo/comicLoaders";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, elementoDesbloqueado, elementoLeido, elementosTestsCompletos,
  type DatosTcm, type Elemento,
} from "../../components/metodo/tcmRecorrido";
import { tieneContenido, COMIC_INTRO_ELEMENTOS, ICONO_ELEMENTO } from "../../components/metodo/tcmElementosContenido";

// Mismo glow ligero que el header, para uniformar los boxes.
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// Viñetas del cómic de intro (Módulo 1) en el formato del ComicViewer: cada
// viñeta lleva su foto y un único párrafo de texto.
const INTRO_VINETAS = COMIC_INTRO_ELEMENTOS.map((v) => ({
  src: v.src,
  paragraphs: Array.isArray(v.texto) ? v.texto : [v.texto],
}));
// Sombra oscura y nítida (sin halo blanco) para la letra blanca del cómic:
// máximo contraste sobre la pintura. La misma que usa el cómic de cada elemento.
const INTRO_TEXT_SHADOW = "0 2px 5px rgba(0,0,0,1), 0 0 3px rgba(0,0,0,0.98), 0 6px 20px rgba(0,0,0,0.85)";

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
  const reduce = useReducedMotion();
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();
  // Cómic de intro (Módulo 1): se abre al entrar, a pantalla completa, con el
  // mismo ComicViewer que los cómics de astrología y de cada elemento.
  const intro = useIntroComic("metodo-tcm-elementos");

  // No pintamos la página hasta que las fotos de fondo (el fondo de TCM, los
  // iconos de los elementos y las viñetas de la intro) estén completamente
  // cargadas: mientras tanto, solo el loader. Así aparece todo a la vez.
  const fondosListos = usePrecargarImagenes([
    disciplinaBgImg(tcmNom),
    ...ORDEN_ELEMENTOS.map((el) => ICONO_ELEMENTO[el]),
    ...COMIC_INTRO_ELEMENTOS.map((v) => v.src),
  ]);

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
        // Abrimos el cómic de intro (Módulo 1) al entrar, una vez confirmado el
        // acceso. Es saltable con la X / el tick.
        intro.openNow();
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
      {/* La página NO se monta hasta que el usuario termina el cómic de los
          elementos (el de intro). Mientras el cómic está abierto solo se ve él,
          a pantalla completa, sobre el fondo turquesa; al cerrarlo (X o tick) se
          revela la página con sus animaciones (estrella, boxes) frescas. */}
      {!intro.open && (
      <>
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
              disabled: !elementosTestsCompletos(data),
              disabledTooltip: "Rellena los tests de los cinco elementos para continuar",
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
      </>
      )}

      {/* Cómic de intro (Módulo 1) · a pantalla completa, con el mismo ComicViewer
          que astrología y que el cómic de cada elemento. Se abre al entrar y es
          lo ÚNICO visible hasta que se termina; al cerrarlo (X o tick) se revela
          la página. Sigue siendo saltable con la X / el tick. */}
      <IntroComicModal
        isOpen={intro.open}
        onClose={intro.finish}
        vinetas={INTRO_VINETAS}
        themeColor={tcmTxt}
        textColor={tcmTxt}
        textShadow={INTRO_TEXT_SHADOW}
        disciplinaBgImage={disciplinaBgImg(tcmNom)}
        disciplinaBgColor={tcmBg}
        loader={<TcmLoader color="#ffffff" />}
        esperarFondo
      />
    </Box>
  );
}
