import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import {
  alimentoByKey, molsDeAlimento, FUNCIONES, GRUPO_MOLECULA_LABEL, ORDEN_GRUPOS_MOLECULA,
  MACRO_COLOR, MACRO_LABEL, type Alimento, type Molecula,
} from "../../hardCoded/espacio/AlimentosNutricion";

// Caja base con el fondo de Nutrición + velo claro (mismo tratamiento que el
// resto de la disciplina). El contenido va sobre zIndex 1.
function SeccionBox({ children, ...rest }: React.ComponentProps<typeof Box>) {
  return (
    <Box position="relative" overflow="hidden" w="100%" borderRadius="2xl"
         boxShadow="0 6px 24px rgba(0,0,0,0.22), 0 0 16px rgba(255,255,255,0.1)" {...rest}>
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}66`} />
      <Box position="relative" zIndex={1}>{children}</Box>
    </Box>
  );
}

// Botón «← Volver» a la biblioteca.
function VolverNutri({ onClick }: { onClick: () => void }) {
  return (
    <Box as="button" onClick={onClick} alignSelf="flex-start"
         display="inline-flex" alignItems="center" gap={2}
         px={{ base: 4, md: 5 }} py={{ base: 2, md: 2.5 }} borderRadius="full"
         bg={`${nutricionBg}e6`} border={`1px solid ${nutricionTxt}55`} color={nutricionTxt}
         fontFamily="'EB Garamond', serif" fontWeight="600" fontSize={{ base: "sm", md: "md" }}
         letterSpacing="0.03em" cursor="pointer" boxShadow="0 2px 12px rgba(0,0,0,0.2)"
         transition="all 0.18s" _hover={{ bg: nutricionBg, transform: "translateY(-1px)" }}>
      <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
           w={{ base: "16px", md: "18px" }} h={{ base: "16px", md: "18px" }} fill="currentColor" flexShrink={0}>
        <path d="M480-160 160-480l320-320 56 57-223 223h487v80H313l224 224-57 56Z" />
      </Box>
      Biblioteca
    </Box>
  );
}

// Etiqueta (píldora) de la función de una molécula, con su color.
function FuncionPill({ funcion, size = "sm" }: { funcion: Molecula["funcion"]; size?: "sm" | "xs" }) {
  const f = FUNCIONES[funcion];
  return (
    <Flex align="center" gap={1.5} flexShrink={0} px={size === "sm" ? 2.5 : 2} py={size === "sm" ? 1 : 0.5}
          borderRadius="full" bg={f.color}
          boxShadow={`0 1px 6px ${f.color}77`}>
      <Text color="white" fontWeight={700} fontSize={size === "sm" ? "2xs" : "3xs"}
            letterSpacing="0.04em" textTransform="uppercase" lineHeight="1" whiteSpace="nowrap">
        {f.label}
      </Text>
    </Flex>
  );
}

// Barra apilada de macros: «de qué está hecho».
function BarraMacros({ macros }: { macros: Alimento["macros"] }) {
  const total = Math.max(1, macros.carbohidrato + macros.proteina + macros.grasa);
  const segs = (["carbohidrato", "proteina", "grasa"] as const)
    .map((k) => ({ k, pct: Math.round((macros[k] / total) * 100) }))
    .filter((s) => s.pct > 0);
  return (
    <Flex direction="column" gap={2.5} w="100%">
      <Flex w="100%" h={{ base: "16px", md: "18px" }} borderRadius="full" overflow="hidden"
            boxShadow={`inset 0 0 0 1px ${nutricionTxt}22`}>
        {segs.map((s) => (
          <Box key={s.k} w={`${s.pct}%`} h="100%" bg={MACRO_COLOR[s.k]} transition="width 0.4s ease" />
        ))}
      </Flex>
      <Flex wrap="wrap" gap={{ base: 3, md: 4 }} justify="center">
        {segs.map((s) => (
          <Flex key={s.k} align="center" gap={1.5}>
            <Box w="10px" h="10px" borderRadius="full" bg={MACRO_COLOR[s.k]} />
            <Text color={nutricionTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={600}>
              {MACRO_LABEL[s.k]} · {s.pct}%
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

// Tarjeta de una molécula: nombre + píldora de función. Al tocarla, abre su ficha.
function MoleculaCard({ m, onClick }: { m: Molecula; onClick: () => void }) {
  return (
    <Box as="button" onClick={onClick} textAlign="left" w="100%" borderRadius="xl"
         bg={`${nutricionBg}e6`}
         px={{ base: 3.5, md: 4 }} py={{ base: 3, md: 3.5 }}
         boxShadow="0 2px 10px rgba(0,0,0,0.14)" cursor="pointer" transition="all 0.18s"
         _hover={{ transform: "translateY(-2px)", boxShadow: "0 6px 18px rgba(0,0,0,0.2)" }}>
      <Flex align="center" justify="space-between" gap={3}>
        <Text color={nutricionTxt} fontWeight={700} fontSize={{ base: "sm", md: "md" }} lineHeight="1.2">
          {m.nombre}
        </Text>
        <FuncionPill funcion={m.funcion} size="xs" />
      </Flex>
    </Box>
  );
}

// Modal ligero (tema claro de Nutrición) con la explicación de una molécula.
function MoleculaModal({ m, onClose }: { m: Molecula | null; onClose: () => void }) {
  useEffect(() => {
    if (!m) return;
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", h); };
  }, [m, onClose]);

  if (!m) return null;
  return (
    <Box position="fixed" inset={0} zIndex={1200} display="flex" alignItems="center" justifyContent="center"
         px={{ base: 5, md: 8 }} onClick={onClose} bg="rgba(20,30,18,0.55)" sx={{ backdropFilter: "blur(4px)" }}>
      <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="440px"
           borderRadius="2xl" overflow="hidden" border={`1px solid ${nutricionTxt}33`}
           boxShadow="0 20px 60px rgba(0,0,0,0.45)">
        <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay={`${nutricionBg}dd`} />
        <Flex position="relative" zIndex={1} direction="column" gap={3} px={{ base: 6, md: 7 }} py={{ base: 6, md: 7 }}>
          <Text color={`${nutricionTxt}99`} fontSize="2xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase">
            {GRUPO_MOLECULA_LABEL[m.grupo]}
          </Text>
          <Flex align="center" gap={3} wrap="wrap">
            <Text color={nutricionTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight={800} lineHeight="1.15">
              {m.nombre}
            </Text>
            <FuncionPill funcion={m.funcion} />
          </Flex>
          <Box h="2px" w="56px" bgGradient={`linear(to-r, ${FUNCIONES[m.funcion].color}, transparent)`} />
          <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" fontWeight={500}>
            {m.queHace}
          </Text>
          <Box as="button" onClick={onClose} alignSelf="flex-end" mt={1}
               px={5} py={2} borderRadius="full" bg={nutricionTxt} color={nutricionBg}
               fontFamily="'EB Garamond', serif" fontWeight={700} fontSize={{ base: "sm", md: "md" }}
               cursor="pointer" transition="all 0.18s" _hover={{ transform: "translateY(-1px)" }}>
            Entendido
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionAlimento() {
  const navigate = useNavigate();
  const { key } = useParams<{ key: string }>();
  const [loading, setLoading] = useState(true);
  const [abierta, setAbierta] = useState<Molecula | null>(null);

  const a = alimentoByKey(key || "");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    if (!a) { navigate("/metodo/nutricion/alimentos", { replace: true }); return; }
    (async () => {
      try {
        let testEnabled = false;
        try { const t = await axios.get(`${API_URL}/payment/test/enabled`); testEnabled = !!t.data?.enabled; } catch { /* */ }
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito && !testEnabled) { navigate("/metodo/nutricion"); return; }
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, key]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  if (!a) return null;

  // Moléculas del alimento, agrupadas por tipo y en el orden establecido.
  const mols = molsDeAlimento(a).map((x) => x.m);
  const gruposConMols = ORDEN_GRUPOS_MOLECULA
    .map((g) => ({ grupo: g, items: mols.filter((m) => m.grupo === g) }))
    .filter((s) => s.items.length > 0);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title={a.nombre}
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
            />
          </Reveal>

          <Reveal direction="up" distance={12} delay={0.08} duration={0.5} w="100%" display="flex">
            <VolverNutri onClick={() => navigate("/metodo/nutricion/alimentos")} />
          </Reveal>

          {/* Cabecera del alimento: emoji + nombre + resumen + barra de macros */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.6} w="100%">
            <SeccionBox>
              <Flex direction={{ base: "column", md: "row" }} align="center" gap={{ base: 5, md: 8 }} p={{ base: 5, md: 8 }}>
                <Flex w={{ base: "120px", md: "180px" }} flexShrink={0} aspectRatio={1} borderRadius="2xl"
                      align="center" justify="center" bg={`${nutricionTxt}12`} boxShadow="0 4px 18px rgba(0,0,0,0.2)"
                      fontSize={{ base: "68px", md: "104px" }} lineHeight="1">
                  <span role="img" aria-label={a.nombre}>{a.emoji ?? a.nombre.charAt(0)}</span>
                </Flex>
                <Flex direction="column" gap={3.5} flex="1" w="100%" textAlign={{ base: "center", md: "left" }}
                      align={{ base: "center", md: "stretch" }}>
                  <Text color={nutricionTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={800} lineHeight="1.1">
                    {a.nombre}
                  </Text>
                  <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" fontWeight={600} lineHeight="1.6">
                    {a.resumen}
                  </Text>
                  <Text color={`${nutricionTxt}aa`} fontSize="2xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase" mt={1}>
                    De qué está hecho
                  </Text>
                  <BarraMacros macros={a.macros} />
                </Flex>
              </Flex>
            </SeccionBox>
          </Reveal>

          {/* Moléculas que lo componen, por grupos */}
          <Reveal direction="up" distance={18} delay={0.18} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Toca cada molécula para ver qué hace dentro de ti.
            </Text>
          </Reveal>

          {gruposConMols.map((s, gi) => (
            <Reveal key={s.grupo} direction="up" distance={16} delay={0.06 * gi} duration={0.55} w="100%">
              <SeccionBox>
                <Box px={{ base: 5, md: 7 }} py={{ base: 5, md: 6 }}>
                  <Text color={nutricionTxt} fontSize={{ base: "md", md: "lg" }} fontWeight={800} mb={3.5}
                        letterSpacing="0.01em">
                    {GRUPO_MOLECULA_LABEL[s.grupo]}
                  </Text>
                  <Flex direction="column" gap={{ base: 2.5, md: 3 }}>
                    {s.items.map((m) => (
                      <MoleculaCard key={m.key} m={m} onClick={() => setAbierta(m)} />
                    ))}
                  </Flex>
                </Box>
              </SeccionBox>
            </Reveal>
          ))}

        </Flex>
      </Flex>

      <MoleculaModal m={abierta} onClose={() => setAbierta(null)} />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
