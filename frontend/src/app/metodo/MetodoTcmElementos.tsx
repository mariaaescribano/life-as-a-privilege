import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { ComicViewer } from "../../components/metodo/ComicViewer";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, elementoDesbloqueado, elementoLeido,
  testInicialCompleto, viajeCompleto, type DatosTcm, type Elemento,
} from "../../components/metodo/tcmRecorrido";
import { tieneContenido, INTRO_CINCO_ELEMENTOS, FOTO_ELEMENTO, COMIC_ELEMENTO } from "../../components/metodo/tcmElementosContenido";

const TINTA = tcmTxt;
const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
// Mismo glow ligero que el header, para uniformar los boxes.
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

const CX = 160, CY = 170, R = 120, FOTO_R = 24;
function vertice(i: number, radio: number) {
  const ang = (-90 + i * 72) * (Math.PI / 180);
  return { x: CX + radio * Math.cos(ang), y: CY + radio * Math.sin(ang) };
}

export default function MetodoTcmElementos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatosTcm>({});
  const [comicEl, setComicEl] = useState<Elemento | null>(null);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

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
        if (!testInicialCompleto(d)) { navigate("/metodo/tcm/equilibrio"); return; }
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

  // Pinchar un elemento abre su cómic (no navega a otra página).
  const abrir = (el: Elemento, desbloqueado: boolean, disponible: boolean) => {
    if (!desbloqueado || !disponible) return;
    setComicEl(el);
  };

  // Al terminar el cómic, marcamos el elemento como leído (✓ + desbloquea el siguiente).
  const marcarLeido = async (el: Elemento) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    const next: DatosTcm = {
      ...data,
      elementos: { ...data.elementos, [el]: { ...data.elementos?.[el], leido: true } },
    };
    setData(next);
    if (userId && token) {
      try {
        await axios.patch(`${API_URL}/metodo-tcm/${userId}`, { data: next },
          { headers: { Authorization: `Bearer ${token}` } });
      } catch { /* el estado local ya refleja el ✓ */ }
    }
  };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Los Cinco Elementos"
            pageLabel="4/14"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Mapa", onClick: () => navigate("/metodo/tcm/mapa") }}
            extra={ilustracionesBtn}
            next={{
              label: "Tu perfil →",
              onClick: () => {},
              disabled: !viajeCompleto(data),
              disabledTooltip: "Recorre los cinco elementos para ver tu perfil completo",
            }}
          />

          {/* Intro (Módulo 1) */}
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 7, md: 10 }} py={{ base: 6, md: 8 }} textAlign="center">
              <Flex direction="column" gap={3} maxW="640px" mx="auto">
                {INTRO_CINCO_ELEMENTOS.map((t, i) => (
                  <Text key={i} color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" opacity={0.92}
                        style={{ textShadow: INK_SHADOW }}>
                    {t}
                  </Text>
                ))}
              </Flex>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" mt={5}
                    letterSpacing="0.04em" style={{ textShadow: INK_SHADOW }}>
                Pulsa sobre cada elemento para descubrir qué representa.
              </Text>
            </Box>
          </Box>

          {/* La estrella interactiva */}
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <Flex position="relative" zIndex={1} justify="center" py={{ base: 3, md: 4 }}>
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
                    <g key={el} style={{ cursor: activo ? "pointer" : "not-allowed" }}
                       onClick={() => abrir(el, desbloqueado, disponible)}>
                      {/* base + foto del elemento */}
                      <circle cx={v.x} cy={v.y} r={FOTO_R + 2} fill={tcmBg} opacity={0.55} />
                      <image href={FOTO_ELEMENTO[el]} x={v.x - FOTO_R} y={v.y - FOTO_R}
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
                      {/* candado si bloqueado */}
                      {!activo && (
                        <text x={v.x} y={v.y} fill="white" fontSize={16}
                              textAnchor="middle" dominantBaseline="central">🔒</text>
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
                    </g>
                  );
                })}
              </Box>
            </Flex>
          </Box>

          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="560px" lineHeight="1.6">
            Los elementos se abren en orden (Madera → Fuego → Tierra → Metal → Agua). Al leer cada uno, se marca con ✓.
          </Text>
        </Flex>
      </Flex>

      {ilustracionesModal}

      {/* Cómic del elemento: fondo y box con la foto del elemento; cerrable en cualquier momento. */}
      <Modal isOpen={!!comicEl} onClose={() => setComicEl(null)} size="full" scrollBehavior="outside">
        <ModalOverlay bg="rgba(0,0,0,0.85)" sx={{ backdropFilter: "blur(20px)" }} />
        <ModalContent bg="transparent" border="none" borderRadius="0" boxShadow="none" m={0} minH="100vh" position="relative">
          {comicEl && (
            <ComicViewer
              key={comicEl}
              vinetas={COMIC_ELEMENTO[comicEl]}
              themeColor={ELEMENTOS[comicEl].color}
              textColor="#ffffff"
              disciplinaBgImage={FOTO_ELEMENTO[comicEl]}
              disciplinaBgColor={ELEMENTOS[comicEl].color}
              onClose={() => setComicEl(null)}
              onComplete={() => { const el = comicEl; setComicEl(null); if (el) void marcarLeido(el); }}
            />
          )}
        </ModalContent>
      </Modal>

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}
