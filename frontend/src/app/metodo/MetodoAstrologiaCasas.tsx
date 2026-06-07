import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { SpaceBg } from "../../components/metodo/SpaceBg";
import { Glifo } from "../../components/metodo/Glifo";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";
import type { CartaNatal } from "../../components/metodo/CartaAstral3D/types";
import { infoCasa, NUMEROS_ROMANOS } from "../../components/metodo/casasAspectos";
import { API_URL, astrologiaBg, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

const EyeIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor"
       style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);

// Renderiza **negritas** en color del acento (mismo patrón que Profundizar).
function renderConNegritas(texto: string, color: string): React.ReactNode {
  return texto.split(/(\*\*[^*]+\*\*)/g).map((parte, i) =>
    parte.startsWith("**") && parte.endsWith("**") ? (
      <span key={i} style={{ fontWeight: 700, color, textShadow: `0 0 8px ${color}55` }}>
        {parte.slice(2, -2)}
      </span>
    ) : (
      <React.Fragment key={i}>{parte}</React.Fragment>
    ),
  );
}

/* ── Geometría de la rueda ── */
const VB = 320;                 // viewBox cuadrado
const CX = VB / 2;
const CY = VB / 2;
const R_OUT = 150;              // radio exterior
const R_LABEL = 122;            // radio de los números

// Punto sobre el círculo medido en grados horarios desde las 12 (sentido horario).
function pt(angDeg: number, r: number) {
  const a = (angDeg * Math.PI) / 180;
  return { x: CX + r * Math.sin(a), y: CY - r * Math.cos(a) };
}

// Path del sector i (0..11): ocupa [i*30, i*30+30) grados horarios desde arriba.
function sectorPath(i: number): string {
  const a0 = i * 30;
  const a1 = a0 + 30;
  const p0 = pt(a0, R_OUT);
  const p1 = pt(a1, R_OUT);
  return `M ${CX} ${CY} L ${p0.x} ${p0.y} A ${R_OUT} ${R_OUT} 0 0 1 ${p1.x} ${p1.y} Z`;
}

const norm360 = (d: number) => ((d % 360) + 360) % 360;
// Ángulo de rotación que lleva el centro de la casa i (1..12) arriba del todo.
const rotParaCasa = (casaNum: number) => norm360(-((casaNum - 1) * 30 + 15));

interface Row {
  link_carta?: string | null;
  casas_texto?: Record<string, string> | null;
}

export default function MetodoAstrologiaCasas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [carta, setCarta] = useState<CartaNatal | null>(null);
  const [casasTexto, setCasasTexto] = useState<Record<string, string>>({});
  const [comicOpen, setComicOpen] = useState(false);

  const [rot, setRot] = useState(rotParaCasa(1));
  const [sel, setSel] = useState<number>(1); // casa seleccionada 1..12
  const dragRef = useRef<{ startAng: number; startRot: number; moved: boolean } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const rowRes = await axios.get<Row | null>(`${API_URL}/metodo-astrologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!rowRes.data?.link_carta) { navigate("/metodo/astrologia"); return; }
        setCasasTexto((rowRes.data.casas_texto ?? {}) as Record<string, string>);

        const cartaRes = await axios.get<CartaNatal | null>(`${API_URL}/metodo-astrologia/carta-natal/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCarta(cartaRes.data ?? null);
      } catch {
        setCarta(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const seleccionarCasa = (casaNum: number) => {
    setSel(casaNum);
    setRot(rotParaCasa(casaNum));
  };

  /* ── Arrastre para girar la rueda ── */
  const angDesdeEvento = (e: React.PointerEvent): number => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // grados horarios desde las 12
    return norm360((Math.atan2(e.clientX - cx, -(e.clientY - cy)) * 180) / Math.PI);
  };
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { startAng: angDesdeEvento(e), startRot: rot, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const delta = angDesdeEvento(e) - dragRef.current.startAng;
    if (Math.abs(delta) > 2) dragRef.current.moved = true;
    setRot(dragRef.current.startRot + delta);
  };
  const onPointerUp = () => {
    if (!dragRef.current) return;
    // snap: casa cuyo centro queda más arriba
    const i = ((Math.round((-rot - 15) / 30) % 12) + 12) % 12;
    seleccionarCasa(i + 1);
    dragRef.current = null;
  };

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const cusps = carta?.cusps ?? [];
  const info = cusps.length ? infoCasa(cusps, sel) : null;
  const textoSel = (casasTexto[String(sel)] ?? "").trim();

  const todasEscritas =
    NUMEROS_ROMANOS.length > 0 &&
    Array.from({ length: 12 }, (_, i) => i + 1).every(
      (n) => (casasTexto[String(n)] ?? "").trim().length > 0,
    );

  const headerNext = {
    label: todasEscritas ? "Aspectos →" : "Lectura de casas en proceso…",
    onClick: () => navigate("/metodo/astrologia/aspectos"),
    disabled: !todasEscritas,
    disabledTooltip: "María está escribiendo la lectura de tus casas",
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>
          <MetodoStepHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Astrología · Tus Casas"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            space
            mb={0}
            prev={{ label: "← Mi carta (PDF)", onClick: () => navigate("/metodo/astrologia/lectura") }}
            extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
            next={headerNext}
          />

          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={`1px solid ${astrologiaTxt}44`}
            boxShadow={`0 0 22px rgba(255,255,255,0.3), 0 0 50px rgba(255,255,255,0.15), 0 0 30px ${astrologiaTxt}33`}
          >
            <SpaceBg overlay="rgba(8,13,30,0.6)" />

            <Flex
              position="relative"
              zIndex={1}
              direction={{ base: "column", lg: "row" }}
              align="center"
              gap={{ base: 6, lg: 10 }}
              px={{ base: 5, md: 8 }}
              py={{ base: 7, md: 9 }}
            >
              {/* ── BOX de la casa seleccionada (arriba en móvil, dcha en desktop) ── */}
              <Flex
                order={{ base: 0, lg: 1 }}
                flex="1"
                w="100%"
                direction="column"
                justify="center"
                minH={{ lg: "320px" }}
              >
                <CasaBox info={info} textoSel={textoSel} sel={sel} />
              </Flex>

              {/* ── RUEDA giratoria ── */}
              <Flex order={{ base: 1, lg: 0 }} flex="1" justify="center" align="center" w="100%">
                <Box w="100%" maxW="340px">
                  <Box
                    as="svg"
                    ref={svgRef as any}
                    viewBox={`0 0 ${VB} ${VB}`}
                    width="100%"
                    style={{ touchAction: "none", cursor: "grab", userSelect: "none" }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                  >
                    {/* aro exterior con glow */}
                    <circle cx={CX} cy={CY} r={R_OUT} fill="none" stroke={`${astrologiaTxt}55`} strokeWidth={1.5}
                            style={{ filter: `drop-shadow(0 0 6px ${astrologiaTxt}66)` }} />
                    <circle cx={CX} cy={CY} r={R_OUT * 0.62} fill="none" stroke={`${astrologiaTxt}22`} strokeWidth={1} />

                    {/* grupo rotatorio */}
                    <g transform={`rotate(${rot} ${CX} ${CY})`} style={{ transition: dragRef.current ? "none" : "transform 0.55s cubic-bezier(.22,.68,.36,1)" }}>
                      {Array.from({ length: 12 }, (_, i) => {
                        const casaNum = i + 1;
                        const activa = casaNum === sel;
                        const escrita = (casasTexto[String(casaNum)] ?? "").trim().length > 0;
                        const lp = pt(i * 30 + 15, R_LABEL);
                        return (
                          <g key={i}>
                            <path
                              d={sectorPath(i)}
                              fill={activa ? `${astrologiaTxt}33` : `${astrologiaTxt}0a`}
                              stroke={`${astrologiaTxt}33`}
                              strokeWidth={1}
                              style={{ cursor: "pointer", transition: "fill 0.3s" }}
                              onClick={() => { if (!dragRef.current?.moved) seleccionarCasa(casaNum); }}
                            />
                            {/* número (se mantiene en pie con rotación inversa) */}
                            <g transform={`rotate(${-rot} ${lp.x} ${lp.y})`}
                               style={{ transition: dragRef.current ? "none" : "transform 0.55s cubic-bezier(.22,.68,.36,1)", pointerEvents: "none" }}>
                              <text
                                x={lp.x}
                                y={lp.y + 5}
                                textAnchor="middle"
                                fontSize={activa ? 18 : 14}
                                fontFamily="'EB Garamond', serif"
                                fill={activa ? astrologiaTxt : `${astrologiaTxt}99`}
                                fontWeight={activa ? 700 : 400}
                                style={{ filter: activa ? `drop-shadow(0 0 6px ${astrologiaTxt}aa)` : "none" }}
                              >
                                {NUMEROS_ROMANOS[i]}
                              </text>
                              {escrita && (
                                <circle cx={lp.x} cy={lp.y - 16} r={1.8} fill={astrologiaTxt}
                                        style={{ filter: `drop-shadow(0 0 3px ${astrologiaTxt})` }} />
                              )}
                            </g>
                          </g>
                        );
                      })}
                    </g>

                    {/* marcador superior (12 en punto) */}
                    <polygon points={`${CX - 8},${CY - R_OUT - 6} ${CX + 8},${CY - R_OUT - 6} ${CX},${CY - R_OUT + 8}`}
                             fill={astrologiaTxt} style={{ filter: `drop-shadow(0 0 5px ${astrologiaTxt})` }} />
                    {/* glifo central del signo de la casa activa */}
                    {info && (
                      <text x={CX} y={CY + 11} textAnchor="middle" fontSize={30} fill={info.regente?.color ?? astrologiaTxt}
                            fontFamily="'Times New Roman', serif"
                            style={{ filter: `drop-shadow(0 0 8px ${(info.regente?.color ?? astrologiaTxt)}aa)` }}>
                        {info.signo.symbol}
                      </text>
                    )}
                  </Box>
                  <Text color={`${astrologiaTxt}99`} fontSize="xs" textAlign="center" mt={2} fontStyle="italic" letterSpacing="0.04em">
                    Gira la rueda o toca una casa
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Flex>

      <ComicAstrologiaModal isOpen={comicOpen} onClose={() => setComicOpen(false)} />
      <SiteFooter />
    </Box>
  );
}

/* ── Box lateral con la info + texto de la casa ── */
function CasaBox({
  info,
  textoSel,
  sel,
}: {
  info: ReturnType<typeof infoCasa>;
  textoSel: string;
  sel: number;
}) {
  return (
    <Box
      w="100%"
      borderRadius="xl"
      border={`1px solid ${astrologiaTxt}33`}
      bg="rgba(8,13,30,0.45)"
      px={{ base: 5, md: 7 }}
      py={{ base: 6, md: 7 }}
      boxShadow={`0 0 18px ${astrologiaTxt}22`}
    >
      {/* cabecera horizontal: Casa N · signo · REGENTE [glifo grande iluminado] */}
      <Flex align="center" gap={3} mb={4} wrap="wrap">
        <Text color={astrologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.04em"
              style={{ textShadow: `0 0 12px ${astrologiaTxt}66` }}>
          Casa {NUMEROS_ROMANOS[sel - 1]}
        </Text>
        {info && (
          <>
            <Box w="1px" h="22px" bg={`${astrologiaTxt}33`} />
            <Flex align="center" gap={1.5}>
              <Glifo symbol={info.signo.symbol} color={astrologiaTxt} size={22} />
              <Text color={`${astrologiaTxt}dd`} fontSize={{ base: "md", md: "lg" }}>{info.signo.name}</Text>
            </Flex>
            {info.regente && (
              <Flex align="center" gap={2} ml={1}>
                <Text color={`${info.regente.color}cc`} fontSize="2xs" letterSpacing="0.18em" fontWeight="700" textTransform="uppercase"
                      style={{ textShadow: `0 0 8px ${info.regente.color}66` }}>
                  Regente
                </Text>
                <Flex align="center" justify="center" w="44px" h="44px" borderRadius="full"
                      bg={`${info.regente.color}1f`} border={`1px solid ${info.regente.color}44`}
                      style={{ boxShadow: `0 0 16px ${info.regente.color}55, inset 0 0 12px ${info.regente.color}2a` }}>
                  <Glifo symbol={info.regente.symbol} color={info.regente.color} size={32} />
                </Flex>
              </Flex>
            )}
          </>
        )}
      </Flex>

      <Box h="1px" mb={4} bgGradient={`linear(to-r, transparent, ${astrologiaTxt}44, transparent)`} />

      {/* texto escrito a mano */}
      {textoSel ? (
        <Text
          color={`${astrologiaTxt}e6`}
          fontSize={{ base: "md", md: "lg" }}
          lineHeight="1.85"
          letterSpacing="0.015em"
          style={{ whiteSpace: "pre-wrap", textShadow: `0 0 8px ${astrologiaTxt}44` }}
        >
          {renderConNegritas(textoSel, astrologiaTxt)}
        </Text>
      ) : (
        <Text color={`${astrologiaTxt}aa`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" fontStyle="italic">
          María aún no ha escrito la lectura de esta casa. Estará disponible pronto.
        </Text>
      )}
    </Box>
  );
}
