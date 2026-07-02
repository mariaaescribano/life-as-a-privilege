import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box, Flex, Text, Input, Wrap, WrapItem,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import { Check, Plus, X, Pencil, Clock, Download, Eye } from "lucide-react";
import axios from "axios";
import { generateDiaPdf } from "../../utils/generateDiaPdf";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { CompromisosBox } from "../../components/metodo/CompromisosBox";
import {
  API_URL,
  ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  VataIcon, PittaIcon, KaphaIcon,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";
import { DOSHA_CUIDARTE } from "../../hardCoded/metodo/doshaCuidarte";
import type { DoshaKey } from "../../hardCoded/metodo/doshaIntro";

const TINTA = ayurvedaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${ayurvedaBg}`;

const DOSHA_META: Record<DoshaKey, { label: string; color: string; Icon: any }> = {
  vata:  { label: "Vata",  color: vataColor,  Icon: VataIcon },
  pitta: { label: "Pitta", color: pittaColor, Icon: PittaIcon },
  kapha: { label: "Kapha", color: kaphaColor, Icon: KaphaIcon },
};

const limpia = (s: string) => s.replace(/\.\s*$/, "");

// Día de ejemplo (solo inspiración; el usuario escribe el suyo).
const DIA_EJEMPLO: { hora: string; actividad: string; comida?: boolean }[] = [
  { hora: "6:00", actividad: "Lavarse los dientes y meditar" },
  { hora: "8:00", actividad: "Entreno" },
  { hora: "9:00", actividad: "Trabajo" },
  { hora: "13:00", actividad: "Pausa para comer", comida: true },
  { hora: "18:00", actividad: "Salir del trabajo" },
  { hora: "21:00", actividad: "Cena ligera", comida: true },
  { hora: "22:30", actividad: "Desconectar y preparar el descanso" },
];

interface Bloque { id: number; hora: string; actividad: string; comida: boolean; alimentos: string[] }
interface Draft { hora: string; actividad: string; comida: boolean; alimentos: string[] }

function Separador() {
  return (
    <Flex align="center" justify="center" gap={3} w="100%" my={1}>
      <Box h="1px" flex="1" maxW="160px" bgGradient={`linear(to-r, transparent, ${ayurvedaTxt}66)`} />
      <Box w="7px" h="7px" bg={`${ayurvedaTxt}99`} transform="rotate(45deg)" flexShrink={0} />
      <Box h="1px" flex="1" maxW="160px" bgGradient={`linear(to-l, transparent, ${ayurvedaTxt}66)`} />
    </Flex>
  );
}

function Panel({ children, color, tile }: { children: React.ReactNode; color: string; tile?: boolean }) {
  return (
    <Box
      position="relative"
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${color}1a, 0 0 48px ${color}10`}
    >
      {tile ? (
        // Fondo en bandas: la acuarela se repite a lo ancho (100%) y se apila
        // verticalmente a su proporción natural, sin estirarse ni distorsionarse.
        <Box
          position="absolute" inset="0" zIndex={0} pointerEvents="none"
          borderRadius="2xl" overflow="hidden"
          bgColor={ayurvedaBg}
          bgImage="url('/img/fondos/hinduismo.png')"
          bgSize="100% auto"
          bgRepeat="repeat-y"
          bgPosition="top center"
        >
          <Box position="absolute" inset="0" bg={`${ayurvedaBg}26`} />
        </Box>
      ) : (
        <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}26`} />
      )}
      <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 7, md: 9 }}>
        {children}
      </Box>
    </Box>
  );
}

function Chip({ label, checked, onToggle, color }: { label: string; checked: boolean; onToggle: () => void; color: string }) {
  return (
    <Flex
      as="button" onClick={onToggle} align="center" gap={1.5} px={3} py={1.5} borderRadius="full"
      bg={checked ? color : "rgba(255,251,243,0.6)"}
      border={`1.5px solid ${checked ? color : `${TINTA}33`}`}
      cursor="pointer" transition="all 0.15s" sx={{ backdropFilter: "blur(4px)" }}
      _hover={{ borderColor: color, transform: "translateY(-1px)" }}
    >
      {checked && <Check size={12} color="#fff" strokeWidth={3} />}
      <Text color={checked ? "#fff" : TINTA} fontSize={{ base: "xs", md: "sm" }} lineHeight="1.2"
            style={checked ? { textShadow: "0 1px 2px rgba(0,0,0,0.3)" } : undefined}>
        {label}
      </Text>
    </Flex>
  );
}

export default function MetodoAyurvedaDoshaDia() {
  const navigate = useNavigate();
  const { dosha } = useParams<{ dosha: string }>();
  const doshaKey = (["vata", "pitta", "kapha"].includes(dosha || "") ? dosha : null) as DoshaKey | null;

  const [loading, setLoading] = useState(true);
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  // Popup de añadir/editar momento.
  const [modalOpen, setModalOpen] = useState(false);
  const [ejemploOpen, setEjemploOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>({ hora: "", actividad: "", comida: false, alimentos: [] });
  const dataRef = useRef<Record<string, any>>({});
  const idRef = useRef(0);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!doshaKey) { navigate("/metodo/ayurveda/tarjetas", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }

        const r = await axios.get(`${API_URL}/metodo-ayurveda/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: Record<string, any> = r.data?.data || {};
        dataRef.current = d;
        const guardadas = d?.doshaDia?.[doshaKey]?.bloques;
        if (Array.isArray(guardadas) && guardadas.length > 0) {
          setBloques(guardadas);
          idRef.current = Math.max(...guardadas.map((b: Bloque) => b.id ?? 0)) + 1;
          setGuardado(true);
        }
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doshaKey]);

  const abrirAnadir = () => { setEditId(null); setDraft({ hora: "", actividad: "", comida: false, alimentos: [] }); setModalOpen(true); };
  const abrirEditar = (b: Bloque) => { setEditId(b.id); setDraft({ hora: b.hora, actividad: b.actividad, comida: b.comida, alimentos: [...b.alimentos] }); setModalOpen(true); };
  const cerrarModal = () => setModalOpen(false);

  const toggleDraftFood = (food: string) =>
    setDraft((d) => ({ ...d, alimentos: d.alimentos.includes(food) ? d.alimentos.filter((x) => x !== food) : [...d.alimentos, food] }));

  const guardarMomento = () => {
    if (!draft.hora && !draft.actividad.trim() && draft.alimentos.length === 0) { cerrarModal(); return; }
    setGuardado(false);
    if (editId != null) {
      setBloques((prev) => prev.map((b) => (b.id === editId ? { ...b, ...draft } : b)));
    } else {
      setBloques((prev) => [...prev, { id: idRef.current++, ...draft }]);
    }
    cerrarModal();
  };

  const removeBloque = (id: number) => { setGuardado(false); setBloques((prev) => prev.filter((b) => b.id !== id)); };

  const guardar = async () => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token || !doshaKey) return;
    setGuardando(true);
    try {
      const next = { ...dataRef.current, doshaDia: { ...(dataRef.current.doshaDia || {}), [doshaKey]: { bloques } } };
      await axios.patch(`${API_URL}/metodo-ayurveda/${userId}`, { data: next }, { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = next;
      setGuardado(true);
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  const irRecorrido = () => { if (guardado) navigate(`/metodo/ayurveda/dosha/${doshaKey}/recorrido`); };

  if (loading || !doshaKey) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const meta = DOSHA_META[doshaKey];
  const Icon = meta.Icon;
  const c = DOSHA_CUIDARTE[doshaKey];
  const pool = (c?.equilibran?.opciones ?? c?.alimentosBuenos.items ?? []).map(limpia);
  const recomendaciones = c?.rutina ?? [];

  const ordenados = [...bloques].sort((a, b) => (a.hora || "99").localeCompare(b.hora || "99"));

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 6, md: 7 }}>

          <MetodoStepHeader
            icon={<Icon size={{ base: "40px", md: "56px" }} color={meta.color} />}
            title={<>Dosha: <Box as="span" color={meta.color}>{meta.label}</Box></>}
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            step={{ current: 7, total: 7 }}
            mb={0}
            prev={{ label: "← Estilo de vida", onClick: () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/estilo`) }}
            extra={ilustracionesBtn}
            next={{ label: "Tu Recorrido →", onClick: irRecorrido, disabled: !guardado, disabledTooltip: "Guarda tu día para continuar." }}
          />

          {/* HERO */}
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={4}>
              <Text color={TINTA} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" lineHeight="1.15" letterSpacing="0.02em" style={{ textShadow: INK_SHADOW }}>
                Crea tu día equilibrado
              </Text>
              <Separador />
              <Text color={`${TINTA}d0`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" maxW="600px">
                Diseña tu propio día, a tu manera. Añade los momentos que quieras —cuándo te levantas, cuándo respiras, tus comidas, tu descanso— con la hora que mejor encaje en tu vida. Cada momento te llega con recomendaciones para tu dosha, pero el día lo escribes tú.
              </Text>
            </Flex>
          </Panel>

          {/* Recordatorio de los compromisos escritos en Psicología */}
          <CompromisosBox />

          {/* TU DÍA (lista editable) */}
          <Panel color={meta.color} tile>
            <Flex align="center" justify="space-between" gap={3} mb={1} wrap="wrap">
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" style={{ textShadow: INK_SHADOW }}>
                Tu día
              </Text>
              <Flex gap={2} align="center">
                {ordenados.length > 0 && (
                  <Flex as="button" onClick={() => { void generateDiaPdf(doshaKey, meta.label, ordenados); }} align="center" gap={2} px={4} py={2} borderRadius="full"
                        bg="rgba(255,251,243,0.6)" color={meta.color} border={`1.5px solid ${meta.color}88`}
                        fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                        cursor="pointer" transition="all 0.15s"
                        _hover={{ bg: `${meta.color}1a`, borderColor: meta.color, transform: "translateY(-1px)" }}>
                    <Download size={16} /> PDF
                  </Flex>
                )}
                <Flex as="button" onClick={() => setEjemploOpen(true)} align="center" gap={2} px={4} py={2} borderRadius="full"
                      bg="rgba(255,251,243,0.6)" color={meta.color} border={`1.5px solid ${meta.color}88`}
                      fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                      cursor="pointer" transition="all 0.15s"
                      _hover={{ bg: `${meta.color}1a`, borderColor: meta.color, transform: "translateY(-1px)" }}>
                  <Eye size={16} /> Ver ejemplo
                </Flex>
                <Flex as="button" onClick={abrirAnadir} align="center" gap={2} px={4} py={2} borderRadius="full"
                      bg={meta.color} color="#fff" fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                      cursor="pointer" boxShadow={`0 0 14px ${meta.color}66`} transition="all 0.15s"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                      _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 22px ${meta.color}99` }}>
                  <Plus size={16} /> Añadir momento
                </Flex>
              </Flex>
            </Flex>
            <Box h="1px" w="100%" bgGradient={`linear(to-r, ${ayurvedaTxt}aa, ${ayurvedaTxt}33, transparent)`} mb={5} />

            {ordenados.length === 0 ? (
              <Flex direction="column" align="center" textAlign="center" gap={4} py={{ base: 4, md: 6 }}>
                <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.8" maxW="460px">
                  Tu día está en blanco. Pulsa «Añadir momento» y empieza a construir la rutina que de verdad encaja contigo.
                </Text>
                <Flex as="button" onClick={() => setEjemploOpen(true)} align="center" gap={2} px={5} py={2.5} borderRadius="full"
                      bg="rgba(255,251,243,0.6)" color={meta.color} border={`1.5px solid ${meta.color}88`}
                      fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                      cursor="pointer" transition="all 0.15s"
                      _hover={{ bg: `${meta.color}1a`, borderColor: meta.color, transform: "translateY(-1px)" }}>
                  <Eye size={16} /> Ver un día de ejemplo
                </Flex>
              </Flex>
            ) : (
              <Flex direction="column" gap={3.5}>
                {ordenados.map((b) => (
                  <Flex key={b.id} align="flex-start" gap={{ base: 3, md: 4 }} px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}
                        borderRadius="xl" bg="rgba(255,251,243,0.42)" border={`1px solid ${b.comida ? meta.color + "55" : TINTA + "26"}`}
                        sx={{ backdropFilter: "blur(4px)" }}>
                    <Flex align="center" gap={1.5} flexShrink={0} minW={{ base: "58px", md: "68px" }} mt="2px">
                      <Clock size={14} color={meta.color} />
                      <Text color={meta.color} fontWeight="700" fontSize={{ base: "sm", md: "md" }}>{b.hora || "—"}</Text>
                    </Flex>
                    <Box flex="1" minW={0}>
                      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight={b.comida ? "700" : "500"} lineHeight="1.5">
                        {b.actividad || (b.comida ? "Comida" : "Momento")}
                      </Text>
                      {b.comida && b.alimentos.length > 0 && (
                        <Text color={`${TINTA}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" lineHeight="1.6" mt={0.5}>
                          {b.alimentos.join(" · ")}
                        </Text>
                      )}
                    </Box>
                    <Flex gap={1.5} flexShrink={0}>
                      <Box as="button" onClick={() => abrirEditar(b)} w="30px" h="30px" borderRadius="full"
                           display="flex" alignItems="center" justifyContent="center" color={meta.color}
                           border={`1px solid ${meta.color}44`} bg="rgba(255,255,255,0.4)" transition="all 0.15s"
                           _hover={{ bg: `${meta.color}1a`, borderColor: meta.color }} aria-label="Editar">
                        <Pencil size={14} />
                      </Box>
                      <Box as="button" onClick={() => removeBloque(b.id)} w="30px" h="30px" borderRadius="full"
                           display="flex" alignItems="center" justifyContent="center" color={`${TINTA}99`}
                           border={`1px solid ${TINTA}26`} bg="rgba(255,255,255,0.4)" transition="all 0.15s"
                           _hover={{ color: "#c0392b", borderColor: "#c0392b66" }} aria-label="Quitar">
                        <X size={15} />
                      </Box>
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            )}
          </Panel>

          {/* Guardar */}
          <Flex w="100%" justify="flex-end">
            <Box
              as="button" onClick={guardando ? undefined : guardar}
              minW="180px" px={9} py={3} borderRadius="full" bg={meta.color} color="#fff"
              fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em"
              cursor={guardando ? "wait" : "pointer"} boxShadow={`0 0 18px ${meta.color}55`} transition="all 0.2s"
              style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
              _hover={guardando ? {} : { transform: "translateY(-2px)", boxShadow: `0 0 28px ${meta.color}88` }}
            >
              {guardando ? "Guardando…" : guardado ? "Guardado ✓" : "Guardar mi día"}
            </Box>
          </Flex>

          {/* Continuar → Tu Recorrido */}
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={4}>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7">
                Tu día no tiene que ser perfecto. Basta con que, poco a poco, se parezca un poco más a lo que tu cuerpo necesita.
              </Text>
              <Box
                as="button" onClick={irRecorrido} mt={1}
                px={{ base: 10, md: 14 }} py={{ base: 3, md: 3.5 }} borderRadius="full"
                bg={guardado ? meta.color : `${meta.color}55`} color="#fff"
                fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.06em"
                cursor={guardado ? "pointer" : "not-allowed"} opacity={guardado ? 1 : 0.55}
                boxShadow={guardado ? `0 0 26px ${meta.color}88` : "none"} transition="all 0.2s"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                display="inline-flex" alignItems="center" gap={2.5}
                _hover={guardado ? { transform: "translateY(-2px)", boxShadow: `0 0 34px ${meta.color}aa` } : {}}
              >
                Tu Recorrido →
              </Box>
              {!guardado && (
                <Text color={`${TINTA}aa`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
                  Guarda tu día para continuar.
                </Text>
              )}
            </Flex>
          </Panel>
        </Flex>
      </Flex>

      {/* ── POPUP · Añadir/editar momento ── */}
      <Modal isOpen={modalOpen} onClose={cerrarModal} isCentered scrollBehavior="inside" size={{ base: "sm", md: "lg" }}>
        <ModalOverlay bg="rgba(40,20,8,0.62)" sx={{ backdropFilter: "blur(6px)" }} />
        <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} my={{ base: 8, md: 12 }} fontFamily="'EB Garamond', serif">
          <Box position="relative" borderRadius="2xl" overflow="hidden" boxShadow={`0 26px 70px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}1f`} />
            <ModalCloseButton color={TINTA} zIndex={3} />
            <ModalBody
              position="relative" zIndex={1}
              px={{ base: 6, md: 9 }} pt={{ base: 8, md: 9 }} pb={{ base: 12, md: 14 }}
              maxH={{ base: "78vh", md: "76vh" }}
              overflowY="auto"
              sx={{
                "&::-webkit-scrollbar": { width: "7px" },
                "&::-webkit-scrollbar-thumb": { background: `${ayurvedaTxt}55`, borderRadius: "9999px" },
              }}
            >
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" mb={5} style={{ textShadow: INK_SHADOW }}>
                {editId != null ? "Editar momento" : "Añadir un momento a tu día"}
              </Text>

              {/* Hora + actividad */}
              <Flex gap={3} mb={5} align="center" wrap="wrap">
                <Input
                  type="time" value={draft.hora} onChange={(e) => setDraft((d) => ({ ...d, hora: e.target.value }))}
                  w="120px" flexShrink={0} size="md" bg="rgba(255,255,255,0.65)" border={`1px solid ${TINTA}33`}
                  color={TINTA} borderRadius="lg" fontFamily="'EB Garamond', serif"
                  _focus={{ borderColor: meta.color, boxShadow: `0 0 0 1px ${meta.color}55` }}
                />
                <Input
                  value={draft.actividad} onChange={(e) => setDraft((d) => ({ ...d, actividad: e.target.value }))}
                  placeholder="¿Qué harás en este momento?" flex="1" minW="180px" size="md"
                  bg="rgba(255,255,255,0.65)" border={`1px solid ${TINTA}33`} color={TINTA} borderRadius="lg"
                  fontFamily="'EB Garamond', serif" _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
                  _focus={{ borderColor: meta.color, boxShadow: `0 0 0 1px ${meta.color}55` }}
                />
              </Flex>

              {/* ¿Es una comida? */}
              <Flex align="center" gap={3} mb={draft.comida ? 4 : 5}>
                <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} fontWeight="600">¿Es una comida?</Text>
                <Flex as="button" onClick={() => setDraft((d) => ({ ...d, comida: !d.comida }))}
                      align="center" gap={1.5} px={3} py={1} borderRadius="full"
                      bg={draft.comida ? meta.color : "rgba(255,251,243,0.6)"} border={`1.5px solid ${draft.comida ? meta.color : TINTA + "33"}`}
                      color={draft.comida ? "#fff" : TINTA} fontWeight="700" fontSize="sm" cursor="pointer" transition="all 0.15s"
                      style={draft.comida ? { textShadow: "0 1px 2px rgba(0,0,0,0.3)" } : undefined}>
                  {draft.comida && <Check size={12} strokeWidth={3} />} {draft.comida ? "Sí" : "No"}
                </Flex>
              </Flex>

              {/* Alimentos (si es comida) */}
              {draft.comida && (
                <Box mb={5}>
                  <Text color={`${TINTA}aa`} fontSize={{ base: "xs", md: "sm" }} fontWeight="700" letterSpacing="0.06em" textTransform="uppercase" mb={2.5}>
                    Alimentos que te equilibran
                  </Text>
                  <Wrap spacing={2}>
                    {pool.map((food) => (
                      <WrapItem key={food}>
                        <Chip label={food} color={meta.color} checked={draft.alimentos.includes(food)} onToggle={() => toggleDraftFood(food)} />
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              )}

              {/* Recomendaciones según dosha */}
              {recomendaciones.length > 0 && (
                <Box>
                  <Box h="1px" w="100%" bgGradient={`linear(to-r, ${ayurvedaTxt}66, transparent)`} mb={3} />
                  <Text color={`${TINTA}aa`} fontSize={{ base: "xs", md: "sm" }} fontWeight="700" letterSpacing="0.06em" textTransform="uppercase" mb={1}>
                    Recomendaciones para {meta.label}
                  </Text>
                  <Text color={`${TINTA}aa`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" mb={3}>
                    Pulsa una para usarla como punto de partida. Puedes cambiarla a tu gusto.
                  </Text>
                  <Wrap spacing={2}>
                    {recomendaciones.map((r, i) => (
                      <WrapItem key={i}>
                        <Flex as="button"
                              onClick={() => setDraft((d) => ({ ...d, actividad: `${r.momento}: ${r.actividad}`, comida: !!r.comida, alimentos: r.comida ? d.alimentos : [] }))}
                              align="flex-start" gap={1.5} px={3} py={1.5} borderRadius="xl" maxW="100%"
                              bg="rgba(255,251,243,0.6)" border={`1px solid ${meta.color}55`} cursor="pointer" transition="all 0.15s" textAlign="left"
                              _hover={{ bg: `${meta.color}1a`, borderColor: meta.color, transform: "translateY(-1px)" }}>
                          <Text color={TINTA} fontSize={{ base: "xs", md: "sm" }} lineHeight="1.35">
                            <Box as="span" fontWeight="700">{r.momento}:</Box> {r.actividad}
                          </Text>
                        </Flex>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              )}

              {/* Separador: marca el fin de las recomendaciones */}
              <Box h="1px" w="100%" mt={7} mb={5} bgGradient={`linear(to-r, transparent, ${ayurvedaTxt}55, transparent)`} />

              {/* Acciones */}
              <Flex justify="flex-end" gap={3}>
                <Box as="button" onClick={cerrarModal} px={6} py={2.5} borderRadius="full"
                     bg="transparent" border={`1.5px solid ${TINTA}55`} color={TINTA}
                     fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "sm", md: "md" }}
                     cursor="pointer" transition="all 0.15s" _hover={{ borderColor: TINTA, bg: "rgba(255,251,243,0.4)" }}>
                  Cancelar
                </Box>
                <Box as="button" onClick={guardarMomento} px={8} py={2.5} borderRadius="full"
                     bg={meta.color} color="#fff" fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "sm", md: "md" }}
                     letterSpacing="0.04em" cursor="pointer" boxShadow={`0 0 16px ${meta.color}66`} transition="all 0.15s"
                     style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                     _hover={{ transform: "translateY(-1px)", boxShadow: `0 0 24px ${meta.color}99` }}>
                  {editId != null ? "Guardar cambios" : "Añadir a mi día"}
                </Box>
              </Flex>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>

      {/* Popup: día de ejemplo (inspiración) */}
      <Modal isOpen={ejemploOpen} onClose={() => setEjemploOpen(false)} size="lg" isCentered scrollBehavior="inside">
        <ModalOverlay bg="rgba(0,0,0,0.72)" sx={{ backdropFilter: "blur(8px)" }} />
        <ModalContent
          bg={`${ayurvedaBg}f2`}
          border={`1px solid ${TINTA}33`}
          borderRadius="2xl"
          boxShadow="0 16px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.12)"
          mx={{ base: 4, md: 0 }}
          fontFamily="'EB Garamond', serif"
          overflow="hidden"
        >
          <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" />
          <ModalCloseButton color={TINTA} zIndex={2} />
          <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 8, md: 9 }}>
            <Flex direction="column" gap={5}>
              <Flex direction="column" align="center" gap={1.5}>
                <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" textAlign="center" style={{ textShadow: INK_SHADOW }}>
                  Un día de ejemplo
                </Text>
                <Text color={`${TINTA}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center">
                  Solo para inspirarte. Tu día lo escribes tú, a tu manera.
                </Text>
              </Flex>

              <Box h="1px" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />

              <Flex direction="column" gap={3}>
                {DIA_EJEMPLO.map((b, i) => (
                  <Flex key={i} align="center" gap={{ base: 3, md: 4 }} px={{ base: 4, md: 5 }} py={{ base: 3, md: 3.5 }}
                        borderRadius="xl" bg="rgba(255,251,243,0.5)" border={`1px solid ${b.comida ? meta.color + "55" : TINTA + "26"}`}>
                    <Flex align="center" gap={1.5} flexShrink={0} minW={{ base: "58px", md: "68px" }}>
                      <Clock size={14} color={meta.color} />
                      <Text color={meta.color} fontWeight="700" fontSize={{ base: "sm", md: "md" }}>{b.hora}</Text>
                    </Flex>
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight={b.comida ? "700" : "500"} lineHeight="1.5">
                      {b.actividad}
                    </Text>
                  </Flex>
                ))}
              </Flex>

              <Flex justify="center" mt={1}>
                <Box
                  as="button" onClick={() => setEjemploOpen(false)}
                  px={9} py={2.5} borderRadius="full" bg={meta.color} color="#fff"
                  fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.06em"
                  cursor="pointer" boxShadow={`0 4px 20px ${meta.color}55`} style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                  transition="all 0.2s" _hover={{ transform: "translateY(-2px)", boxShadow: `0 8px 28px ${meta.color}88` }}
                >
                  Crear el mío
                </Box>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      {ilustracionesModal}
      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />
      <SiteFooter />
    </Box>
  );
}
