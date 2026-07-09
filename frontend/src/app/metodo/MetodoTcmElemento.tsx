import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text, SimpleGrid, Image } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, puntuarTest, elementoDesbloqueado,
  testInicialCompleto, type DatosTcm, type Elemento,
} from "../../components/metodo/tcmRecorrido";
import { CONTENIDO_ELEMENTOS, IMAGEN_ELEMENTO, tieneContenido } from "../../components/metodo/tcmElementosContenido";

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const TXT_SHADOW = "0 1px 4px rgba(58,10,10,0.75)";
// Mismo glow ligero que el header, para uniformar los boxes.
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

const esElemento = (v: string | undefined): v is Elemento =>
  !!v && (ORDEN_ELEMENTOS as string[]).includes(v);

const Parrafos = ({ textos }: { textos: string[] }) => (
  <Flex direction="column" gap={3.5}>
    {textos.map((t, i) => (
      <Text key={i} color="rgba(255,255,255,0.94)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.9"
            style={{ textShadow: TXT_SHADOW }}>
        {t}
      </Text>
    ))}
  </Flex>
);

export default function MetodoTcmElemento() {
  const navigate = useNavigate();
  const { elemento } = useParams<{ elemento: string }>();
  const el = esElemento(elemento) ? elemento : null;

  const [loading, setLoading] = useState(true);
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const dataRef = useRef<DatosTcm>({});
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!el || !tieneContenido(el)) { navigate("/metodo/tcm/elementos"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
        const d: DatosTcm = res.data?.data ?? {};
        if (!testInicialCompleto(d)) { navigate("/metodo/tcm/equilibrio"); return; }
        if (!elementoDesbloqueado(d, el)) { navigate("/metodo/tcm/elementos"); return; }
        dataRef.current = d;
        setRespuestas(d.elementos?.[el]?.miniTest?.respuestas ?? {});
      } catch {
        navigate("/metodo/tcm/elementos");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, el]);

  const c = el ? CONTENIDO_ELEMENTOS[el] : null;
  const meta = el ? ELEMENTOS[el] : null;
  const acento = meta?.color ?? tcmTxt;
  const miniTest = meta?.miniTest ?? [];
  const testCompleto = miniTest.every((p) => !!respuestas[p.key]);

  // ── Los "momentos": una idea por pantalla ──────────────────────────────
  const momentos = useMemo(() => {
    if (!c) return [] as { titulo: string; nodo: React.ReactNode }[];
    return [
      { titulo: "El elemento", nodo: <Parrafos textos={c.intro} /> },
      {
        titulo: "Qué rige",
        nodo: (
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacingX={6} spacingY={3}>
            {c.rige.map((r) => (
              <Box key={r.clave}>
                <Text color={acento} fontWeight={700} fontSize={{ base: "sm", md: "md" }} letterSpacing="0.02em">
                  {r.clave}
                </Text>
                <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6"
                      style={{ textShadow: TXT_SHADOW }}>
                  {r.valor}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        ),
      },
      {
        titulo: "Funciones",
        nodo: (
          <Flex direction="column" gap={5}>
            {c.funciones.map((f, i) => (
              <Box key={i}>
                <Text color="white" fontWeight={700} fontSize={{ base: "md", md: "lg" }} mb={1}
                      style={{ textShadow: TXT_SHADOW }}>
                  {i + 1}. {f.titulo}
                </Text>
                <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.85"
                      style={{ textShadow: TXT_SHADOW }}>
                  {f.texto}
                </Text>
              </Box>
            ))}
          </Flex>
        ),
      },
      { titulo: "En equilibrio", nodo: <Parrafos textos={c.equilibrio} /> },
      { titulo: "En exceso", nodo: <Parrafos textos={c.exceso} /> },
      {
        titulo: "En deficiencia",
        nodo: (
          <Flex direction="column" gap={5}>
            <Parrafos textos={c.deficiencia} />
            {c.cierre && (
              <Text color="rgba(255,255,255,0.85)" fontStyle="italic" fontSize={{ base: "md", md: "lg" }}
                    lineHeight="1.85" style={{ textShadow: TXT_SHADOW }}>
                {c.cierre}
              </Text>
            )}
          </Flex>
        ),
      },
      { titulo: "Señales de desequilibrio", nodo: <Parrafos textos={c.desequilibrio} /> },
      { titulo: "Cómo cuidarlo", nodo: <Parrafos textos={c.equilibrar} /> },
      {
        titulo: "Guía práctica",
        nodo: (
          <Flex direction="column" gap={5}>
            <GuiaLista titulo="Nutrición" items={c.guia.nutricion} acento={acento} />
            {c.guia.evitar && <GuiaLista titulo="Evita" items={c.guia.evitar} acento={acento} />}
            <GuiaLista titulo="Estilo de vida" items={c.guia.estiloDeVida} acento={acento} />
            <GuiaLista titulo="Ejercicio" items={c.guia.ejercicio} acento={acento} />
            <GuiaLista titulo="Terapia" items={c.guia.terapia} acento={acento} />
            <Box>
              <Text color={acento} fontWeight={700} mb={1}>Mejor momento para descansar</Text>
              <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                    style={{ textShadow: TXT_SHADOW }}>{c.guia.descanso}</Text>
            </Box>
            <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontStyle="italic" fontWeight={700}
                  textAlign="center" mt={1} style={{ textShadow: `0 0 12px ${acento}66, ${INK_SHADOW}` }}>
              «{c.guia.afirmacion}»
            </Text>
          </Flex>
        ),
      },
      {
        titulo: "¿Cómo está este elemento en ti?",
        nodo: (
          <Flex direction="column" gap={6}>
            {miniTest.map((p, i) => (
              <Box key={p.key}>
                <Text color="white" fontWeight={700} fontSize={{ base: "md", md: "lg" }} mb={3}
                      style={{ textShadow: TXT_SHADOW }}>
                  {i + 1}. {p.pregunta}
                </Text>
                <Flex direction="column" gap={2.5}>
                  {p.opciones.map((op) => {
                    const sel = respuestas[p.key] === op.key;
                    return (
                      <Box key={op.key} as="button"
                           onClick={() => setRespuestas((prev) => ({ ...prev, [p.key]: op.key }))}
                           textAlign="left" px={{ base: 4, md: 5 }} py={{ base: 2.5, md: 3 }} borderRadius="xl"
                           bg={sel ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.07)"}
                           color="white" fontFamily="'EB Garamond', serif" fontSize={{ base: "sm", md: "md" }}
                           lineHeight="1.6" cursor="pointer" transition="all 0.15s"
                           boxShadow={sel ? `0 0 16px ${acento}66` : "none"}
                           _hover={{ bg: "rgba(255,255,255,0.16)" }}
                           style={{ textShadow: "0 1px 4px rgba(58,10,10,0.9)" }}>
                        {op.texto}
                      </Box>
                    );
                  })}
                </Flex>
              </Box>
            ))}
          </Flex>
        ),
      },
    ];
  }, [c, acento, miniTest, respuestas]);

  const total = momentos.length;
  const esUltimo = paso === total - 1;

  // Cada cambio de momento, subimos arriba del bloque para que la lectura empiece limpia.
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [paso]);

  const retroceder = () => {
    if (paso === 0) { navigate("/metodo/tcm/elementos"); return; }
    setPaso((p) => Math.max(0, p - 1));
  };

  const avanzar = async () => {
    if (!esUltimo) { setPaso((p) => Math.min(total - 1, p + 1)); return; }
    // Último momento (mini-test): guardar, marcar leído y volver a la estrella.
    if (!testCompleto || !el) return;
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    const next: DatosTcm = {
      ...dataRef.current,
      elementos: {
        ...dataRef.current.elementos,
        [el]: { leido: true, miniTest: { respuestas, puntos: puntuarTest(miniTest, respuestas) } },
      },
    };
    try {
      await axios.patch(`${API_URL}/metodo-tcm/${userId}`, { data: next },
        { headers: { Authorization: `Bearer ${token}` } });
    } catch { /* seguimos igualmente al hub */ }
    navigate("/metodo/tcm/elementos");
  };

  if (loading || !el || !c) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const avanzarBloqueado = esUltimo && !testCompleto;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="760px" gap={6}>

          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title={`${c.nombre} ${c.hanzi}`}
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← La estrella", onClick: () => navigate("/metodo/tcm/elementos") }}
            extra={ilustracionesBtn}
          />

          {/* Puntos de progreso */}
          <Flex align="center" gap={2} wrap="wrap" justify="center">
            {momentos.map((_, i) => (
              <Box key={i} onClick={() => setPaso(i)} cursor="pointer"
                   w={i === paso ? "26px" : "8px"} h="8px" borderRadius="full"
                   bg={i === paso ? acento : i < paso ? `${acento}99` : "rgba(255,255,255,0.25)"}
                   transition="all 0.3s" />
            ))}
          </Flex>

          {/* La pantalla del momento actual (con transición al cambiar) */}
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}
               sx={{ "@keyframes momentoIn": { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <Box key={paso} position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 8, md: 10 }}
                 minH={{ base: "auto", md: "380px" }}
                 style={{ animation: "momentoIn 0.4s cubic-bezier(0.22,1,0.36,1)" }}>
              {/* Ordenador: imagen a la izquierda, texto a la derecha. Móvil: imagen arriba, texto abajo. */}
              <Flex direction={{ base: "column", md: "row" }} gap={{ base: 5, md: 8 }} align="flex-start">
                <Box w={{ base: "100%", md: "300px" }} flexShrink={0} alignSelf={{ base: "center", md: "flex-start" }}>
                  <Image src={encodeURI(IMAGEN_ELEMENTO[el])} alt={c.nombre}
                         w="100%" maxH={{ base: "220px", md: "340px" }} objectFit="contain"
                         borderRadius="xl" display="block" mx="auto"
                         style={{ filter: `drop-shadow(0 0 16px ${acento}55)` }} />
                </Box>
                <Box flex="1" minW={0} w="100%">
                  <Text color={acento} fontSize={{ base: "sm", md: "md" }} fontWeight={700} letterSpacing="0.12em"
                        textTransform="uppercase" mb={3} style={{ textShadow: INK_SHADOW }}>
                    {momentos[paso].titulo}
                  </Text>
                  <Box h="1px" w="100%" mb={6} bg={`${acento}88`} />
                  {momentos[paso].nodo}
                </Box>
              </Flex>
            </Box>
          </Box>

          {/* Navegación atrás / seguir */}
          <Flex w="100%" justify="space-between" align="center" gap={4}>
            <NavBtn label={paso === 0 ? "‹ La estrella" : "‹ Atrás"} onClick={retroceder} />
            <Text color="rgba(255,255,255,0.5)" fontSize="sm" fontStyle="italic">
              {paso + 1} / {total}
            </Text>
            <NavBtn
              label={esUltimo ? "He leído ✓" : "Seguir ›"}
              onClick={avanzar}
              primary
              disabled={avanzarBloqueado}
              tooltip={avanzarBloqueado ? "Responde el mini-test para terminar" : undefined}
            />
          </Flex>
        </Flex>
      </Flex>

      {ilustracionesModal}

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

function NavBtn({ label, onClick, primary, disabled, tooltip }: {
  label: string; onClick: () => void; primary?: boolean; disabled?: boolean; tooltip?: string;
}) {
  return (
    <Box as="button" onClick={disabled ? undefined : onClick} title={tooltip}
         position="relative" overflow="hidden"
         px={{ base: 6, md: 9 }} py={3} borderRadius="full"
         bgImage="url('/img/fondos/tcm.png')" bgSize="cover" bgPosition="center"
         color={disabled ? `${tcmTxt}88` : tcmTxt}
         fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }} fontWeight="700"
         letterSpacing="0.05em" cursor={disabled ? "not-allowed" : "pointer"} transition="all 0.2s"
         opacity={disabled ? 0.55 : 1}
         boxShadow={primary && !disabled
           ? `0 0 18px ${tcmTxt}55, 0 4px 16px rgba(0,0,0,0.32)`
           : "0 4px 14px rgba(0,0,0,0.28)"}
         style={{ textShadow: `0 1px 4px rgba(58,10,10,0.95), 0 0 8px rgba(58,10,10,0.85)` }}
         _hover={disabled ? {} : { transform: "translateY(-2px)", boxShadow: `0 0 24px ${tcmTxt}66, 0 6px 22px rgba(0,0,0,0.36)` }}
         _active={disabled ? {} : { transform: "scale(0.97)" }}>
      {label}
    </Box>
  );
}

function GuiaLista({ titulo, items, acento }: { titulo: string; items: string[]; acento: string }) {
  return (
    <Box>
      <Text color={acento} fontWeight={700} mb={1.5}>{titulo}</Text>
      <Flex direction="column" gap={1.5}>
        {items.map((it, i) => (
          <Text key={i} color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6"
                style={{ textShadow: TXT_SHADOW }}>· {it}</Text>
        ))}
      </Flex>
    </Box>
  );
}
