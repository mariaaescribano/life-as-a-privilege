import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyurvedaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { AyurvedaPanel as Panel } from "../../components/metodo/AyurvedaPanel";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceAyurveda } from "../../components/metodo/IndiceAyurveda";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import {
  API_URL,
  ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  VataIcon, PittaIcon, KaphaIcon,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";
import type { DoshaKey } from "../../hardCoded/metodo/doshaIntro";
import {
  PRANAYAMA_HERO, PRANAYAMA_ESENCIAL, PRANAYAMA_PRACTICA,
  PRANAYAMA_REFLEXION, PRANAYAMA_CIERRE,
  type FasePranayama,
} from "../../hardCoded/metodo/pranayama";

const DOSHAS: DoshaKey[] = ["vata", "pitta", "kapha"];

const TINTA = ayurvedaTxt;
const PAPEL = "#fbf4e8";
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${ayurvedaBg}`;

const DOSHA_META: Record<DoshaKey, { label: string; color: string; Icon: any }> = {
  vata:  { label: "Vata",  color: vataColor,  Icon: VataIcon },
  pitta: { label: "Pitta", color: pittaColor, Icon: PittaIcon },
  kapha: { label: "Kapha", color: kaphaColor, Icon: KaphaIcon },
};

function parseRich(s: string): React.ReactNode[] {
  const parts = s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <Box as="span" key={i} fontWeight="700">{p.slice(2, -2)}</Box>;
    if (p.startsWith("*") && p.endsWith("*")) return <Box as="span" key={i} fontStyle="italic">{p.slice(1, -1)}</Box>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

function Separador() {
  return (
    <Flex align="center" justify="center" gap={3} w="100%" my={1}>
      <Box h="1px" flex="1" maxW="160px" bgGradient={`linear(to-r, transparent, ${ayurvedaTxt}66)`} />
      <Box w="7px" h="7px" bg={`${ayurvedaTxt}99`} transform="rotate(45deg)" flexShrink={0} />
      <Box h="1px" flex="1" maxW="160px" bgGradient={`linear(to-l, transparent, ${ayurvedaTxt}66)`} />
    </Flex>
  );
}

function SeccionTitulo({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <Box mb={4}>
      <Flex align="center" gap={3} mb={2.5}>
        <Box w="9px" h="9px" bg={color} transform="rotate(45deg)" flexShrink={0} boxShadow={`0 0 10px ${color}88`} />
        <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" style={{ textShadow: INK_SHADOW }}>
          {children}
        </Text>
      </Flex>
      <Box h="1px" w="100%" bgGradient={`linear(to-r, ${ayurvedaTxt}aa, ${ayurvedaTxt}33, transparent)`} />
    </Box>
  );
}

function ListItem({ texto, color }: { texto: string; color: string }) {
  return (
    <Flex align="flex-start" gap={3}>
      <Box flexShrink={0} mt="9px" w="7px" h="7px" borderRadius="full" bg={color} />
      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">{parseRich(texto)}</Text>
    </Flex>
  );
}

/** Ilustración de sección. Si no hay ruta, no ocupa sitio. */
function Foto({ src, alt, color }: { src?: string; alt: string; color: string }) {
  if (!src) return null;
  return (
    <Box mt={5} borderRadius="xl" overflow="hidden" border={`1px solid ${color}44`} boxShadow={`0 0 18px ${color}22`}>
      <Box as="img" src={src} alt={alt} w="100%" display="block" loading="lazy" />
    </Box>
  );
}

function RadioRow({ label, checked, onSelect, color }: { label: string; checked: boolean; onSelect: () => void; color: string }) {
  return (
    <Flex
      as="button"
      onClick={onSelect}
      align="center"
      gap={3}
      w="100%"
      textAlign="left"
      px={{ base: 4, md: 5 }}
      py={{ base: 3, md: 3.5 }}
      borderRadius="xl"
      bg={checked ? `${color}24` : "rgba(255,251,243,0.4)"}
      border={`1.5px solid ${checked ? color : `${TINTA}2a`}`}
      cursor="pointer"
      transition="all 0.16s"
      sx={{ backdropFilter: "blur(4px)" }}
      _hover={{ bg: checked ? `${color}30` : "rgba(255,251,243,0.6)", borderColor: `${color}99` }}
    >
      <Box
        w="22px" h="22px" flexShrink={0} borderRadius="full"
        border={`2px solid ${checked ? color : `${TINTA}66`}`}
        display="flex" alignItems="center" justifyContent="center" transition="all 0.16s"
      >
        {checked && <Box w="11px" h="11px" borderRadius="full" bg={color} />}
      </Box>
      <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.5">{label}</Text>
    </Flex>
  );
}

// ── El guía de respiración ───────────────────────────────────────────────
// El círculo crece al inhalar, se queda quieto en la retención y se encoge
// al exhalar, durando exactamente lo que dura cada fase. La retención hereda
// el tamaño de la fase anterior (si no, el círculo daría un salto).

const ESCALA_LLENO = 1;
const ESCALA_VACIO = 0.52;
const ESCALA_REPOSO = 0.72;

function escalaDeFase(fases: FasePranayama[], i: number): number {
  const f = fases[i];
  if (!f) return ESCALA_REPOSO;
  switch (f.tipo) {
    case "inhala": return ESCALA_LLENO;
    case "exhala": return ESCALA_VACIO;
    case "descanso": return ESCALA_REPOSO;
    case "rapida": return ESCALA_REPOSO;
    // La retención mantiene el tamaño al que llegó la fase anterior.
    case "reten": return i === 0 ? ESCALA_LLENO : escalaDeFase(fases, i - 1);
  }
}

interface GuiaProps {
  fases: FasePranayama[];
  ciclos: number;
  color: string;
  /** Se llama la primera vez que se completa la práctica entera. */
  onCompletar: () => void;
  completado: boolean;
}

function GuiaRespiracion({ fases, ciclos, color, onCompletar, completado }: GuiaProps) {
  const [activo, setActivo] = useState(false);
  // Único estado que avanza: los segundos que llevas. La fase, el ciclo y la
  // cuenta atrás se DERIVAN de él, así el reloj no puede desincronizarse.
  const [transcurrido, setTranscurrido] = useState(0);

  const escalas = useMemo(() => fases.map((_, i) => escalaDeFase(fases, i)), [fases]);
  const segundosCiclo = useMemo(() => fases.reduce((a, f) => a + f.segundos, 0), [fases]);
  const segundosTotal = segundosCiclo * ciclos;

  const { fase, restante, ciclo } = useMemo(() => {
    const enCiclo = segundosCiclo > 0 ? transcurrido % segundosCiclo : 0;
    let acumulado = 0;
    for (let i = 0; i < fases.length; i++) {
      if (enCiclo < acumulado + fases[i].segundos) {
        return {
          fase: i,
          restante: acumulado + fases[i].segundos - enCiclo,
          ciclo: Math.min(ciclos, Math.floor(transcurrido / segundosCiclo) + 1),
        };
      }
      acumulado += fases[i].segundos;
    }
    return { fase: 0, restante: fases[0]?.segundos ?? 0, ciclo: 1 };
  }, [transcurrido, fases, segundosCiclo, ciclos]);

  const actual = fases[fase];

  const parar = () => {
    setActivo(false);
    setTranscurrido(0);
  };

  useEffect(() => {
    if (!activo) return;
    const id = window.setInterval(() => setTranscurrido((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [activo]);

  // Fin de la práctica: se para sola y avisa una única vez.
  useEffect(() => {
    if (!activo || segundosTotal <= 0 || transcurrido < segundosTotal) return;
    setActivo(false);
    setTranscurrido(0);
    onCompletar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo, transcurrido, segundosTotal]);

  const escala = activo ? escalas[fase] : ESCALA_REPOSO;
  const esRapida = activo && actual?.tipo === "rapida";
  const minutos = Math.max(1, Math.round(segundosTotal / 60));

  return (
    <Flex direction="column" align="center" gap={6} w="100%">
      <Box
        position="relative"
        w={{ base: "220px", md: "280px" }}
        h={{ base: "220px", md: "280px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          "@keyframes fuelle": {
            "0%, 100%": { transform: "scale(0.62)" },
            "50%":      { transform: "scale(0.86)" },
          },
        }}
      >
        {/* Anillo guía, quieto: da la referencia del tamaño «lleno». */}
        <Box
          position="absolute"
          inset="0"
          borderRadius="full"
          border={`1.5px dashed ${color}55`}
        />
        {/* El círculo que respira contigo. */}
        <Box
          position="absolute"
          inset="0"
          borderRadius="full"
          bg={`${color}33`}
          border={`2px solid ${color}`}
          boxShadow={`0 0 30px ${color}55, inset 0 0 40px ${color}22`}
          style={{
            transform: `scale(${escala})`,
            transition: esRapida ? "none" : `transform ${actual?.segundos ?? 1}s linear`,
            animation: esRapida ? "fuelle 1s ease-in-out infinite" : undefined,
          }}
        />
        <Flex direction="column" align="center" gap={1} position="relative" zIndex={1} px={4} textAlign="center">
          {activo ? (
            <>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight="700" lineHeight="1.3">
                {actual?.texto}
              </Text>
              <Text color={color} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" lineHeight="1">
                {restante}
              </Text>
              <Text color={`${TINTA}aa`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic">
                Ciclo {ciclo} de {ciclos}
              </Text>
            </>
          ) : (
            <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.5">
              {completado ? "Cuando quieras, otra vez" : `${ciclos} ciclos · unos ${minutos} min`}
            </Text>
          )}
        </Flex>
      </Box>

      <Flex gap={3} wrap="wrap" justify="center">
        <Box
          as="button"
          onClick={() => (activo ? parar() : setActivo(true))}
          minW="170px" px={9} py={3} borderRadius="full"
          bg={activo ? "rgba(255,251,243,0.6)" : color}
          color={activo ? color : "#fff"}
          border={activo ? `1.5px solid ${color}88` : "none"}
          fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em"
          cursor="pointer"
          boxShadow={activo ? "none" : `0 0 18px ${color}55`}
          transition="all 0.2s"
          style={{ textShadow: activo ? undefined : "0 1px 2px rgba(0,0,0,0.3)" }}
          _hover={{ transform: "translateY(-2px)" }}
        >
          {activo ? "Parar" : completado ? "Repetir" : "Empezar"}
        </Box>
      </Flex>

      {completado && !activo && (
        <Text color={color} fontSize={{ base: "md", md: "lg" }} fontWeight="700" style={{ textShadow: INK_SHADOW }}>
          Practicado ✓
        </Text>
      )}
    </Flex>
  );
}

export default function MetodoAyurvedaDoshaPranayama() {
  const navigate = useNavigate();
  const { dosha } = useParams<{ dosha: string }>();
  const doshaKey = (["vata", "pitta", "kapha"].includes(dosha || "") ? dosha : null) as DoshaKey | null;

  const [loading, setLoading] = useState(true);
  const [reflexion, setReflexion] = useState("");
  const [compromiso, setCompromiso] = useState("");
  const [practicado, setPracticado] = useState(false);
  // Prāṇāyāma ya no es parte del submapa de un doṣha: las TRES prácticas están
  // en esta misma página y se eligen con las pestañas. Se empieza por la del
  // doṣha con el que se ha entrado, pero se puede probar cualquiera.
  const [practicaSel, setPracticaSel] = useState<DoshaKey>(doshaKey ?? "vata");
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const dataRef = useRef<Record<string, any>>({});
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!doshaKey) { navigate("/metodo/ayurveda/tarjetas", { replace: true }); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }

        const r = await axios.get(`${API_URL}/metodo-ayurveda/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: Record<string, any> = r.data?.data || {};
        dataRef.current = d;
        const slice = d?.doshaPranayama?.[doshaKey] || {};
        const prevRef = typeof slice.reflexion === "string" ? slice.reflexion : "";
        const prevCom = typeof slice.compromiso === "string" ? slice.compromiso : "";
        setReflexion(prevRef);
        setCompromiso(prevCom);
        setPracticado(slice.practicado === true);
        setGuardado(prevRef.trim().length > 0 || prevCom.length > 0);
      } catch {
        // silencioso
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doshaKey]);

  // Si se cambia de doṣha sin salir de la página (p.ej. desde el Índice), la
  // pestaña abierta pasa a ser la del nuevo: la página no se desmonta sola.
  useEffect(() => { if (doshaKey) setPracticaSel(doshaKey); }, [doshaKey]);

  const persist = async (refl: string, comp: string, prac: boolean) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token || !doshaKey) return;
    setGuardando(true);
    try {
      const next = {
        ...dataRef.current,
        doshaPranayama: {
          ...(dataRef.current.doshaPranayama || {}),
          [doshaKey]: {
            ...(dataRef.current.doshaPranayama?.[doshaKey] || {}),
            reflexion: refl,
            compromiso: comp,
            practicado: prac,
          },
        },
      };
      await axios.patch(`${API_URL}/metodo-ayurveda/${userId}`, { data: next }, { headers: { Authorization: `Bearer ${token}` } });
      dataRef.current = next;
    } catch {
      // silencioso
    } finally {
      setGuardando(false);
    }
  };

  const guardarReflexion = async () => {
    await persist(reflexion, compromiso, practicado);
    setGuardado(reflexion.trim().length > 0 || compromiso.trim().length > 0);
  };

  // Al terminar la práctica se guarda sola: es un dato que no queremos que se
  // pierda porque la usuaria no llegue a pulsar «Guardar».
  const marcarPracticado = () => {
    if (practicado) return;
    setPracticado(true);
    void persist(reflexion, compromiso, true);
  };

  const irCursos = () => navigate(`/metodo/ayurveda/dosha/${doshaKey}/cursos`);

  if (loading || !doshaKey) {
    return <AyurvedaLoading />;
  }

  const meta = DOSHA_META[doshaKey];
  const Icon = meta.Icon;
  // La práctica que se está mirando (pestañas), que no tiene por qué ser la del
  // doṣha de la URL: su color manda en el box de la práctica y en el guía.
  const metaSel = DOSHA_META[practicaSel];
  const practica = PRANAYAMA_PRACTICA[practicaSel];

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 14, md: 20 }}>
        <Flex direction="column" align="center" w="100%" maxW="820px" gap={{ base: 6, md: 7 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<Icon size={{ base: "40px", md: "56px" }} color={meta.color} />}
            title="Prāṇāyāma"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: "← Doṣhas", onClick: () => { void persist(reflexion, compromiso, practicado); navigate("/metodo/ayurveda/tarjetas"); } }}
            extra={ilustracionesBtn}
            next={{ label: "Cursos →", onClick: () => { void persist(reflexion, compromiso, practicado); irCursos(); } }}
          />
          </Reveal>

          {/* HERO */}
          <Reveal direction="up" distance={26} scaleFrom={0.98} delay={0.12} duration={0.7} w="100%">
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={4}>
              <Text color={TINTA} fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" lineHeight="1.15" letterSpacing="0.02em" style={{ textShadow: INK_SHADOW }}>
                {PRANAYAMA_HERO.titulo}
              </Text>
              <Text color={meta.color} fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" fontWeight="700" style={{ textShadow: INK_SHADOW }}>
                {PRANAYAMA_HERO.subtitulo}
              </Text>
              <Separador />
              <Flex direction="column" gap={3.5} maxW="640px">
                {PRANAYAMA_HERO.parrafos.map((p, i) => (
                  <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85">{parseRich(p)}</Text>
                ))}
              </Flex>
              <Foto src={PRANAYAMA_HERO.foto} alt="Prāṇāyāma" color={meta.color} />
            </Flex>
          </Panel>
          </Reveal>

          {/* Lo esencial antes de practicar: cuatro líneas, no cinco secciones. */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <SeccionTitulo color={meta.color}>{PRANAYAMA_ESENCIAL.titulo}</SeccionTitulo>
            <RevealStagger inView display="flex" flexDirection="column" gap={2.5} stagger={0.07} delayChildren={0.05} amount={0.1}>
              {PRANAYAMA_ESENCIAL.items.map((it, i) => (
                <RevealItem key={i} direction="up" distance={14} duration={0.45} w="100%"><ListItem texto={it} color={meta.color} /></RevealItem>
              ))}
            </RevealStagger>
            <Box
              mt={5} px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}
              borderRadius="xl" bg="rgba(255,251,243,0.4)"
              borderLeft={`3px solid ${meta.color}`}
              sx={{ backdropFilter: "blur(4px)" }}
            >
              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
                {PRANAYAMA_ESENCIAL.aviso}
              </Text>
            </Box>
            <Foto src={PRANAYAMA_ESENCIAL.foto} alt={PRANAYAMA_ESENCIAL.titulo} color={meta.color} />
          </Panel>
          </Reveal>

          {/* Las TRES prácticas, en la misma página: pestañas arriba y debajo la
              elegida con su guía de respiración. Se entra por la del doṣha de la
              URL, pero cualquiera puede probar las otras dos. */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={metaSel.color}>
            <SeccionTitulo color={metaSel.color}>Las tres prácticas</SeccionTitulo>

            <Flex gap={{ base: 2, md: 3 }} mb={6} direction={{ base: "column", sm: "row" }}>
              {DOSHAS.map((d) => {
                const m = DOSHA_META[d];
                const DIcon = m.Icon;
                const activa = d === practicaSel;
                return (
                  <Flex
                    key={d}
                    as="button"
                    onClick={() => setPracticaSel(d)}
                    flex="1"
                    align="center"
                    justify="center"
                    gap={2}
                    px={{ base: 3, md: 4 }}
                    py={{ base: 2.5, md: 3 }}
                    borderRadius="xl"
                    bg={activa ? `${m.color}26` : "rgba(255,251,243,0.4)"}
                    border={`1.5px solid ${activa ? m.color : `${TINTA}2a`}`}
                    boxShadow={activa ? `0 0 16px ${m.color}55` : "none"}
                    cursor="pointer"
                    transition="all 0.16s"
                    sx={{ backdropFilter: "blur(4px)" }}
                    _hover={{ bg: activa ? `${m.color}30` : "rgba(255,251,243,0.6)", borderColor: `${m.color}99` }}
                  >
                    <DIcon size="22px" color={m.color} />
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontWeight={activa ? "700" : "500"} lineHeight="1.2">
                      {m.label}
                    </Text>
                  </Flex>
                );
              })}
            </Flex>

            <Flex direction="column" align="center" textAlign="center" gap={1} mb={4}>
              <Text color={TINTA} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" style={{ textShadow: INK_SHADOW }}>
                {practica.nombre}
              </Text>
              <Text color={`${TINTA}bb`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
                {practica.traduccion}
              </Text>
            </Flex>
            <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" mb={5}>
              {parseRich(practica.porQue)}
            </Text>

            <RevealStagger key={practicaSel} inView display="flex" flexDirection="column" gap={3} stagger={0.07} delayChildren={0.05} amount={0.1}>
              {practica.pasos.map((paso, i) => (
                <RevealItem key={i} direction="up" distance={14} duration={0.45} w="100%">
                  <Flex align="flex-start" gap={3.5}>
                    <Flex
                      flexShrink={0} w="28px" h="28px" borderRadius="full" mt="2px"
                      bg={`${metaSel.color}26`} border={`1.5px solid ${metaSel.color}88`}
                      align="center" justify="center"
                    >
                      <Text color={metaSel.color} fontSize="sm" fontWeight="700">{i + 1}</Text>
                    </Flex>
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">{parseRich(paso)}</Text>
                  </Flex>
                </RevealItem>
              ))}
            </RevealStagger>

            <Box
              mt={6} px={{ base: 4, md: 5 }} py={{ base: 3.5, md: 4 }}
              borderRadius="xl" bg="rgba(255,251,243,0.4)"
              borderLeft={`3px solid ${metaSel.color}`}
              sx={{ backdropFilter: "blur(4px)" }}
            >
              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
                <Box as="span" fontWeight="700">Cuidado: </Box>{practica.precaucion}
              </Text>
            </Box>
            <Foto src={practica.foto} alt={practica.nombre} color={metaSel.color} />

            {/* El guía de la práctica elegida, en el mismo box: al cambiar de
                pestaña se remonta (key) para que no siga contando la anterior. */}
            <Box mt={8}>
              <Text color={`${TINTA}cc`} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" mb={6} textAlign="center">
                Sigue el círculo: crece cuando entra el aire y se encoge cuando sale.
                Si te agobia, para. <Box as="span" fontStyle="italic">Parar también es practicar.</Box>
              </Text>
              <GuiaRespiracion
                key={practicaSel}
                fases={practica.fases}
                ciclos={practica.ciclos}
                color={metaSel.color}
                completado={practicado}
                onCompletar={marcarPracticado}
              />
            </Box>
          </Panel>
          </Reveal>

          {/* Reflexión + compromiso (SE GUARDAN) */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <SeccionTitulo color={meta.color}>{PRANAYAMA_REFLEXION.titulo}</SeccionTitulo>
            <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={4}>{PRANAYAMA_REFLEXION.pregunta}</Text>
            <Textarea
              value={reflexion}
              onChange={(e) => { setReflexion(e.target.value); setGuardado(false); }}
              placeholder="Escríbelo aquí…"
              w="100%"
              minH={{ base: "110px", md: "140px" }}
              bg="rgba(255,251,243,0.45)"
              border={`1px solid ${meta.color}55`}
              color={TINTA}
              borderRadius="xl"
              px={{ base: 5, md: 6 }}
              py={{ base: 4, md: 5 }}
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "lg", md: "xl" }}
              lineHeight="1.8"
              sx={{ caretColor: TINTA }}
              _placeholder={{ color: `${TINTA}66`, fontStyle: "italic" }}
              _hover={{ borderColor: `${meta.color}88` }}
              _focus={{ borderColor: meta.color, boxShadow: `0 0 0 1px ${meta.color}44`, bg: "rgba(255,251,243,0.6)" }}
            />

            <Box mt={7}>
              <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={1.5} style={{ textShadow: INK_SHADOW }}>
                {PRANAYAMA_REFLEXION.compromisoTitulo}
              </Text>
              <Text color={`${TINTA}aa`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mb={4}>
                {PRANAYAMA_REFLEXION.compromisoIntro}
              </Text>
              <RevealStagger inView display="flex" flexDirection="column" gap={3} stagger={0.07} delayChildren={0.05} amount={0.1}>
                {PRANAYAMA_REFLEXION.compromisos.map((op) => (
                  <RevealItem key={op} direction="up" distance={14} duration={0.45} w="100%">
                    <RadioRow
                      label={op}
                      color={meta.color}
                      checked={compromiso === op}
                      onSelect={() => { setCompromiso((prev) => (prev === op ? "" : op)); setGuardado(false); }}
                    />
                  </RevealItem>
                ))}
              </RevealStagger>
            </Box>

            <Text color={`${TINTA}aa`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mt={4}>{PRANAYAMA_REFLEXION.nota}</Text>

            <Flex justify="flex-end" mt={6}>
              <Box
                as="button"
                onClick={guardando ? undefined : guardarReflexion}
                minW="180px" px={9} py={3} borderRadius="full"
                bg={meta.color} color="#fff"
                fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.05em"
                cursor={guardando ? "wait" : "pointer"}
                boxShadow={`0 0 18px ${meta.color}55`} transition="all 0.2s"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                _hover={guardando ? {} : { transform: "translateY(-2px)", boxShadow: `0 0 28px ${meta.color}88` }}
              >
                {guardando ? "Guardando…" : guardado ? "Guardado ✓" : "Guardar"}
              </Box>
            </Flex>
          </Panel>
          </Reveal>

          {/* Cierre + Cursos */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          <Panel color={meta.color}>
            <Flex direction="column" align="center" textAlign="center" gap={5}>
              {PRANAYAMA_CIERRE.map((p, i) => (
                <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">{parseRich(p)}</Text>
              ))}
              <Box
                as="button"
                onClick={() => { void persist(reflexion, compromiso, practicado); irCursos(); }}
                mt={1}
                px={{ base: 10, md: 14 }} py={{ base: 3, md: 3.5 }} borderRadius="full"
                bg={meta.color} color="#fff"
                fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.06em"
                cursor="pointer"
                boxShadow={`0 0 26px ${meta.color}88`} transition="all 0.2s"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                _hover={{ transform: "translateY(-2px)", boxShadow: `0 0 34px ${meta.color}aa` }}
              >
                Cursos →
              </Box>
            </Flex>
          </Panel>
          </Reveal>
        </Flex>
      </Flex>

      {ilustracionesModal}
      <IndiceAyurveda />
      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />
      <SiteFooter />
    </Box>
  );
}
