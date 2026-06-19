import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Portal, Text } from "@chakra-ui/react";
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
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
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
  retos?: { id: string }[];
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
        // Acceso consistente con "Puntos clave": basta con que la carta esté
        // procesada (hay PDF O hay retos). Antes exigía SOLO el PDF, así que un
        // usuario con retos pero sin PDF subido rebotaba al inicio al entrar.
        const lista = Array.isArray(rowRes.data?.retos) ? rowRes.data!.retos! : [];
        if (!rowRes.data?.link_carta && lista.length === 0) { navigate("/metodo/astrologia"); return; }
        setCasasTexto((rowRes.data?.casas_texto ?? {}) as Record<string, string>);

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

  const headerNext = {
    label:"Aspectos →",
    onClick: () => navigate("/metodo/astrologia/aspectos"),
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={6}>
          <MetodoStepHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "52px" }} />}
            title="Casas"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            space
            step={{ current: 5, total: 8 }}
            mb={0}
            prev={{ label: "← Puntos clave", onClick: () => navigate("/metodo/astrologia/lectura") }}
            extra={{ label: "Ilustraciones", onClick: () => setComicOpen(true), icon: <EyeIcon /> }}
            next={headerNext}
          />

          <Box
            position="relative"
            w="100%"
            borderRadius="2xl"
            overflow="hidden"
            border={`1px solid ${astrologiaTxt}44`}
            boxShadow={`0 0 22px rgba(255,255,255,0.15), 0 0 50px rgba(255,255,255,0.08), 0 0 30px ${astrologiaTxt}1a`}
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
                minH={{ lg: "253px" }}
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
                      <text x={CX} y={CY + 12} textAnchor="middle" fontSize={34} fill={info.regente?.color ?? astrologiaTxt}
                            fontFamily="'Times New Roman', Georgia, 'DejaVu Serif', serif"
                            style={{ filter: `drop-shadow(0 0 8px ${(info.regente?.color ?? astrologiaTxt)}aa)` }}>
                        {info.signo.symbol}{"︎"}
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
  const [open, setOpen] = useState(false);

  // Bloquea el scroll del fondo mientras el popup está abierto (solo scrollea la tarjeta).
  useLockBodyScroll(open);

  const Cabecera = (
    <Flex align="center" gap={3} mb={4} wrap="nowrap">
      {/* Izquierda: Casa N · signo (se encoge/truncar si hace falta) */}
      <Flex align="center" gap={3} flex="1" minW={0}>
        <Text color={astrologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.04em"
              whiteSpace="nowrap" flexShrink={0} style={{ textShadow: `0 0 12px ${astrologiaTxt}66` }}>
          Casa {NUMEROS_ROMANOS[sel - 1]}
        </Text>
        {info && (
          <>
            <Box w="1px" h="22px" bg={`${astrologiaTxt}33`} flexShrink={0} />
            <Flex align="center" gap={1.5} minW={0}>
              <Box flexShrink={0}><Glifo symbol={info.signo.symbol} color={astrologiaTxt} size={22} /></Box>
              <Text color={`${astrologiaTxt}dd`} fontSize={{ base: "md", md: "lg" }} noOfLines={1}>{info.signo.name}</Text>
            </Flex>
          </>
        )}
      </Flex>

      {/* Derecha: REGENTE siempre a la derecha y en una línea */}
      {info?.regente && (
        <Flex align="center" gap={2} flexShrink={0}>
          <Text color={`${info.regente.color}cc`} fontSize="2xs" letterSpacing="0.18em" fontWeight="700" textTransform="uppercase"
                whiteSpace="nowrap" style={{ textShadow: `0 0 8px ${info.regente.color}66` }}>
            <Box as="span" display={{ base: "inline", lg: "none" }}>Regente</Box>
            <Box as="span" display={{ base: "none", lg: "inline" }}>Reg.</Box>
          </Text>
          <Flex align="center" justify="center" w="44px" h="44px" borderRadius="full" flexShrink={0}
                bg={`${info.regente.color}1f`} border={`1px solid ${info.regente.color}44`}
                style={{ boxShadow: `0 0 16px ${info.regente.color}55, inset 0 0 12px ${info.regente.color}2a` }}>
            <Glifo symbol={info.regente.symbol} color={info.regente.color} size={32} />
          </Flex>
        </Flex>
      )}
    </Flex>
  );

  return (
    <>
      <Box
        w="100%"
        minH={{ lg: "253px" }}
        display="flex"
        flexDirection="column"
        borderRadius="xl"
        border={`1px solid ${astrologiaTxt}33`}
        bg="rgba(8,13,30,0.45)"
        px={{ base: 5, md: 7 }}
        py={{ base: 6, md: 7 }}
        boxShadow={`0 0 18px ${astrologiaTxt}22`}
      >
        {Cabecera}
        <Box h="1px" mb={4} bgGradient={`linear(to-r, transparent, ${astrologiaTxt}44, transparent)`} />

        {/* texto recortado con … — máximo 2 líneas en cualquier tamaño.
            El line-clamp (noOfLines) controla la altura y dibuja la elipsis; no
            usamos overflow:hidden con altura fija porque recortaría la línea de
            los puntos antes de que el clamp los pinte. */}
        <Box flex={{ lg: "1" }} minH={{ base: "calc(1em * 1.85 * 2)", lg: 0 }}>
          {textoSel ? (
            <Text
              color={`${astrologiaTxt}e6`}
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.85"
              letterSpacing="0.015em"
              noOfLines={2}
              style={{ textShadow: `0 0 8px ${astrologiaTxt}44` }}
            >
              {renderConNegritas(textoSel, astrologiaTxt)}
            </Text>
          ) : (
            <Text color={`${astrologiaTxt}aa`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" fontStyle="italic"
                  noOfLines={2}>
              María aún no ha escrito la lectura de esta casa. Estará disponible pronto.
            </Text>
          )}
        </Box>

        {/* botón Leer — abajo a la derecha, abre el texto completo */}
        {textoSel && (
          <Flex justify="flex-end" mt={3}>
            <Box as="button" onClick={() => setOpen(true)}
                 px={6} py={2} borderRadius="full" bg={astrologiaTxt} color="#0a0a1a"
                 border={`1px solid ${astrologiaTxt}88`} fontFamily="'EB Garamond', serif" fontWeight="700"
                 fontSize="sm" letterSpacing="0.06em" cursor="pointer" boxShadow={`0 0 14px ${astrologiaTxt}66`}
                 _hover={{ boxShadow: `0 0 22px ${astrologiaTxt}99`, transform: "translateY(-1px)" }} transition="all 0.18s">
              Leer
            </Box>
          </Flex>
        )}
      </Box>

      {/* modal con el texto completo — en Portal para escapar del stacking
          context (zIndex 1) del contenedor y quedar por encima del header */}
      {open && (
        <Portal>
        <Box position="fixed" inset={0} zIndex={2000} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(0,0,0,0.72)"
             sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
             onClick={() => setOpen(false)} fontFamily="'EB Garamond', serif">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="620px"
               maxH={{ base: "calc(100vh - 48px)", md: "calc(100vh - 80px)" }} borderRadius="2xl" overflow="hidden"
               border={`1px solid ${astrologiaTxt}66`}
               boxShadow={`0 0 32px ${astrologiaTxt}55, 0 0 80px ${astrologiaTxt}28, 0 12px 60px rgba(0,0,0,0.6)`}
               display="flex" flexDirection="column">
            <SpaceBg overlay="rgba(8,13,30,0.78)" />
            <Box as="button" onClick={() => setOpen(false)} position="absolute" top={3} right={3} zIndex={3}
                 w="36px" h="36px" borderRadius="full" display="flex" alignItems="center" justifyContent="center"
                 bg="rgba(0,0,0,0.6)" border={`1px solid ${astrologiaTxt}66`} color={astrologiaTxt} cursor="pointer"
                 _hover={{ bg: "rgba(0,0,0,0.85)", borderColor: astrologiaTxt }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14" fill="currentColor">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </Box>
            <Box position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 8, md: 9 }} overflowY="auto"
                 overscrollBehavior="contain"
                 sx={{ "&::-webkit-scrollbar": { width: "8px" }, "&::-webkit-scrollbar-thumb": { background: `${astrologiaTxt}55`, borderRadius: "8px" } }}>
              {Cabecera}
              <Box h="1px" mb={4} bgGradient={`linear(to-r, transparent, ${astrologiaTxt}44, transparent)`} />
              <Text color={`${astrologiaTxt}e6`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" letterSpacing="0.015em"
                    style={{ whiteSpace: "pre-wrap", textShadow: `0 0 8px ${astrologiaTxt}44` }}>
                {renderConNegritas(textoSel, astrologiaTxt)}
              </Text>
            </Box>
          </Box>
        </Box>
        </Portal>
      )}
    </>
  );
}
