// ─────────────────────────────────────────────────────────────────────────
// ADMIN · Editor de INTERPRETACIONES de la carta (arquetipos del RECORRIDO).
//
// Edita el texto de cada arquetipo (cuerpo × signo y cuerpo × casa) que muestra
// el popup «Saber más» de la página "Arquetipos" del recorrido. NO tiene nada que
// ver con los arquetipos de los cursos (LetraArquetipos.ts).
//
// Persistencia: HARDCODEADA en el proyecto (astrologiaTextos.overrides.ts), sin
// base de datos. Es una herramienta de autoría LOCAL: al guardar, el back
// reescribe ese archivo en la copia de trabajo; luego se hace commit + deploy.
// ─────────────────────────────────────────────────────────────────────────
import React, { useMemo, useRef, useState } from "react";
import { Box, Flex, Text, Textarea, useToast } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { useAdminGuard } from "./useAdminGuard";
import { SpaceBg } from "../../components/metodo/SpaceBg";
import { Glifo } from "../../components/metodo/Glifo";
import { CUERPOS, ZODIAC_SIGNS, type Cuerpo, type CuerpoKey } from "../../components/metodo/astrologiaData";
import { getTextoSignoOriginal, getTextoCasaOriginal } from "../../components/metodo/astrologiaTextos";
import {
  cargarOverrides,
  guardarOverrides,
  type ArquetiposOverrides,
  type FacetaAstro,
} from "../../data/astrologiaTextosApi";

const CASAS = Array.from({ length: 12 }, (_, i) => String(i + 1));

/** Clon profundo simple (los valores son strings). */
const clonar = (o: ArquetiposOverrides): ArquetiposOverrides => ({
  signo: JSON.parse(JSON.stringify(o.signo ?? {})),
  casa: JSON.parse(JSON.stringify(o.casa ?? {})),
});

/** Cuenta cuántas celdas tienen override (texto propio). */
const contarOverrides = (o: ArquetiposOverrides): number => {
  let n = 0;
  for (const faceta of ["signo", "casa"] as const)
    for (const celdas of Object.values(o[faceta] ?? {})) n += Object.keys(celdas).length;
  return n;
};

export default function AdminAstrologiaTextos() {
  const { verificando } = useAdminGuard();
  const toast = useToast();

  // Overrides en memoria + snapshot de lo guardado (para saber si hay cambios).
  const [overrides, setOverrides] = useState<ArquetiposOverrides>(() => cargarOverrides());
  const guardadoRef = useRef<string>(JSON.stringify(cargarOverrides()));
  const [guardando, setGuardando] = useState(false);

  // Selección: cuerpo + faceta + celda abierta.
  const [cuerpoKey, setCuerpoKey] = useState<CuerpoKey>("sol");
  const [faceta, setFaceta] = useState<FacetaAstro>("signo");
  const [celda, setCelda] = useState<string | null>(null); // signo name o nº de casa (string)
  const [draft, setDraft] = useState("");

  const cuerpo = useMemo<Cuerpo>(() => CUERPOS.find((c) => c.key === cuerpoKey) ?? CUERPOS[0], [cuerpoKey]);
  const color = cuerpo.color;
  const valores = faceta === "signo" ? ZODIAC_SIGNS.map((s) => s.name) : CASAS;

  // ── Helpers de texto ─────────────────────────────────────────────────────
  const original = (f: FacetaAstro, ck: string, v: string): string | null =>
    f === "signo" ? getTextoSignoOriginal(ck, v) : getTextoCasaOriginal(ck, Number(v));

  const override = (f: FacetaAstro, ck: string, v: string): string | undefined =>
    overrides[f]?.[ck]?.[v];

  const efectivo = (f: FacetaAstro, ck: string, v: string): string => {
    const ov = override(f, ck, v);
    if (typeof ov === "string" && ov.trim() !== "") return ov;
    return original(f, ck, v) ?? "";
  };

  const tieneOverride = (f: FacetaAstro, ck: string, v: string): boolean => {
    const ov = override(f, ck, v);
    return typeof ov === "string" && ov.trim() !== "";
  };

  const estaEscrito = (f: FacetaAstro, ck: string, v: string): boolean =>
    efectivo(f, ck, v).trim() !== "";

  /** Signos escritos de un cuerpo (para el progreso del chip). */
  const progresoSigno = (ck: string): number =>
    ZODIAC_SIGNS.reduce((n, s) => n + (estaEscrito("signo", ck, s.name) ? 1 : 0), 0);

  // ── Edición ────────────────────────────────────────────────────────────────
  const abrirCelda = (v: string) => {
    setCelda(v);
    setDraft(efectivo(faceta, cuerpoKey, v));
  };

  /** Aplica el texto a memoria: si iguala al original o está vacío, quita el override. */
  const aplicar = (texto: string) => {
    setDraft(texto);
    if (celda == null) return;
    const orig = original(faceta, cuerpoKey, celda) ?? "";
    setOverrides((prev) => {
      const next = clonar(prev);
      const rama = next[faceta];
      const quitar = texto.trim() === "" || texto === orig;
      if (quitar) {
        if (rama[cuerpoKey]) {
          delete rama[cuerpoKey][celda];
          if (Object.keys(rama[cuerpoKey]).length === 0) delete rama[cuerpoKey];
        }
      } else {
        (rama[cuerpoKey] ??= {})[celda] = texto;
      }
      return next;
    });
  };

  const restaurarOriginal = () => {
    if (celda == null) return;
    const orig = original(faceta, cuerpoKey, celda) ?? "";
    setDraft(orig);
    setOverrides((prev) => {
      const next = clonar(prev);
      const rama = next[faceta];
      if (rama[cuerpoKey]) {
        delete rama[cuerpoKey][celda];
        if (Object.keys(rama[cuerpoKey]).length === 0) delete rama[cuerpoKey];
      }
      return next;
    });
  };

  const seleccionarCuerpo = (ck: CuerpoKey) => {
    setCuerpoKey(ck);
    setCelda(null);
    const c = CUERPOS.find((x) => x.key === ck);
    if (faceta === "casa" && c && !c.conCasa) setFaceta("signo");
  };

  const cambiarFaceta = (f: FacetaAstro) => {
    setFaceta(f);
    setCelda(null);
  };

  const onGuardar = async () => {
    setGuardando(true);
    try {
      const res = await guardarOverrides(overrides);
      if (res.success) {
        guardadoRef.current = JSON.stringify(overrides);
        toast({ title: "Guardado en el proyecto", status: "success", duration: 1800, isClosable: true });
      } else {
        toast({
          title: "No se pudo guardar",
          description: res.error,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      }
    } finally {
      setGuardando(false);
    }
  };

  if (verificando) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const totalPersonalizadas = contarOverrides(overrides);
  const hayCambios = JSON.stringify(overrides) !== guardadoRef.current;
  const escritas = valores.filter((v) => estaEscrito(faceta, cuerpoKey, v)).length;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10 }} py={{ base: 8, md: 12 }}>
        <Flex direction="column" w="100%" maxW="960px" gap={6}>

          {/* ── Cabecera ── */}
          <Flex align="flex-start" justify="space-between" gap={4} wrap="wrap">
            <Box>
              <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700"
                    style={{ textShadow: "0 0 14px rgba(255,255,255,0.4)" }}>
                Interpretaciones de la carta
              </Text>
              <Text color="rgba(255,255,255,0.75)" fontSize="sm">
                Arquetipos del mapa · {totalPersonalizadas} celda{totalPersonalizadas === 1 ? "" : "s"} personalizada{totalPersonalizadas === 1 ? "" : "s"}
              </Text>
            </Box>
            <Box as="button" onClick={guardando || !hayCambios ? undefined : onGuardar}
                 px={7} py={2.5} borderRadius="full"
                 bg={hayCambios ? "white" : "rgba(255,255,255,0.12)"}
                 color={hayCambios ? "#008080" : "rgba(255,255,255,0.6)"}
                 fontWeight="700" fontSize="sm" letterSpacing="0.03em"
                 border="1.5px solid rgba(255,255,255,0.5)"
                 cursor={guardando ? "wait" : hayCambios ? "pointer" : "default"}
                 opacity={guardando ? 0.6 : 1}
                 boxShadow={hayCambios ? "0 4px 20px rgba(255,255,255,0.25)" : "none"}
                 transition="all 0.2s"
                 _hover={guardando || !hayCambios ? {} : { transform: "translateY(-2px)" }}>
              {guardando ? "Guardando…" : hayCambios ? "Guardar cambios" : "Sin cambios"}
            </Box>
          </Flex>

          {/* ── Selector de cuerpo (chips con glifo) ── */}
          <Flex gap={2.5} wrap="wrap">
            {CUERPOS.map((c) => {
              const activo = c.key === cuerpoKey;
              const prog = progresoSigno(c.key);
              return (
                <Flex key={c.key} as="button" onClick={() => seleccionarCuerpo(c.key)}
                      align="center" gap={2} px={3} py={2} borderRadius="xl"
                      bg={activo ? `${c.color}22` : "rgba(255,255,255,0.05)"}
                      border={`1.5px solid ${activo ? c.color : "rgba(255,255,255,0.15)"}`}
                      cursor="pointer" transition="all 0.18s"
                      boxShadow={activo ? `0 0 16px ${c.color}55` : "none"}
                      _hover={{ borderColor: `${c.color}aa`, bg: `${c.color}18` }}>
                  <Glifo symbol={c.symbol} color={c.color} size={20} />
                  <Text color={activo ? c.color : "rgba(255,255,255,0.85)"} fontSize="sm" fontWeight={activo ? "700" : "500"}>
                    {c.label}
                  </Text>
                  <Text color={`${c.color}cc`} fontSize="xs" fontWeight="700">{prog}/12</Text>
                </Flex>
              );
            })}
          </Flex>

          {/* ── Caja estrellada con la rejilla + editor ── */}
          <Box position="relative" borderRadius="2xl" overflow="hidden"
               border={`1px solid ${color}44`}
               boxShadow={`0 0 22px ${color}1a, 0 0 60px rgba(0,0,0,0.3)`}>
            <SpaceBg overlay="rgba(8,13,30,0.72)" />

            <Flex position="relative" zIndex={1} direction="column" gap={5} p={{ base: 4, md: 7 }}>

              {/* Título del cuerpo + pestañas faceta */}
              <Flex align="center" justify="space-between" gap={3} wrap="wrap">
                <Flex align="center" gap={3}>
                  <Glifo symbol={cuerpo.symbol} color={color} size={34} />
                  <Text color={color} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                        style={{ textShadow: `0 0 12px ${color}77` }}>
                    {cuerpo.label}
                  </Text>
                </Flex>
                <Flex gap={2}>
                  {(["signo", "casa"] as const).map((f) => {
                    const habil = f === "signo" || cuerpo.conCasa;
                    const activo = faceta === f;
                    if (!habil) return null;
                    return (
                      <Box key={f} as="button" onClick={() => cambiarFaceta(f)}
                           px={4} py={1.5} borderRadius="full"
                           bg={activo ? `${color}26` : "rgba(255,255,255,0.06)"}
                           border={`1.5px solid ${activo ? color : "rgba(255,255,255,0.2)"}`}
                           color={activo ? color : "rgba(255,255,255,0.8)"} fontSize="sm"
                           fontWeight={activo ? "700" : "500"} cursor="pointer" transition="all 0.15s"
                           _hover={{ borderColor: `${color}aa` }}>
                        {f === "signo" ? "Signos" : "Casas"}
                      </Box>
                    );
                  })}
                </Flex>
              </Flex>

              <Text color="rgba(255,255,255,0.6)" fontSize="xs" mt={-2}>
                {escritas}/{valores.length} {faceta === "signo" ? "signos" : "casas"} con texto · haz clic en una celda para editarla
              </Text>

              {/* Rejilla de celdas */}
              <Flex gap={2.5} wrap="wrap">
                {valores.map((v) => {
                  const escrito = estaEscrito(faceta, cuerpoKey, v);
                  const editado = tieneOverride(faceta, cuerpoKey, v);
                  const abierta = celda === v;
                  const signoData = faceta === "signo" ? ZODIAC_SIGNS.find((s) => s.name === v) : null;
                  return (
                    <Flex key={v} as="button" onClick={() => abrirCelda(v)}
                          align="center" gap={2} px={3} py={2} borderRadius="lg"
                          minW={faceta === "signo" ? "140px" : "84px"}
                          bg={abierta ? `${color}2e` : "rgba(255,255,255,0.05)"}
                          border={`1.5px solid ${abierta ? color : editado ? `${color}88` : "rgba(255,255,255,0.15)"}`}
                          cursor="pointer" transition="all 0.15s"
                          _hover={{ borderColor: `${color}aa`, bg: `${color}1c` }}>
                      {signoData && <Glifo symbol={signoData.symbol} color={color} size={16} />}
                      <Text color="white" fontSize="sm" fontWeight="500" flex="1" textAlign="left" noOfLines={1}>
                        {faceta === "casa" ? `Casa ${v}` : v}
                      </Text>
                      <Text fontSize="xs" color={escrito ? color : "rgba(255,255,255,0.35)"}
                            title={editado ? "editado" : escrito ? "con texto" : "vacío"}>
                        {editado ? "✎" : escrito ? "●" : "○"}
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>

              {/* Editor de la celda seleccionada */}
              {celda != null && (
                <Box borderRadius="xl" bg="rgba(0,0,0,0.28)" border={`1px solid ${color}44`} p={{ base: 4, md: 5 }}>
                  <Flex align="center" justify="space-between" mb={3} gap={3} wrap="wrap">
                    <Text color={color} fontSize={{ base: "md", md: "lg" }} fontWeight="700">
                      {cuerpo.label} · {faceta === "casa" ? `Casa ${celda}` : celda}
                    </Text>
                    <Flex align="center" gap={3}>
                      <Text color={tieneOverride(faceta, cuerpoKey, celda) ? color : "rgba(255,255,255,0.5)"}
                            fontSize="xs" fontStyle="italic">
                        {tieneOverride(faceta, cuerpoKey, celda) ? "✎ texto personalizado" : "texto original"}
                      </Text>
                      {tieneOverride(faceta, cuerpoKey, celda) && (
                        <Box as="button" onClick={restaurarOriginal}
                             px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="600"
                             bg="rgba(255,255,255,0.08)" border="1px solid rgba(255,255,255,0.3)"
                             color="rgba(255,255,255,0.85)" cursor="pointer"
                             _hover={{ bg: "rgba(255,255,255,0.16)" }}>
                          Restaurar original
                        </Box>
                      )}
                    </Flex>
                  </Flex>
                  <Textarea
                    value={draft}
                    onChange={(e) => aplicar(e.target.value)}
                    placeholder="Escribe la interpretación…"
                    minH="320px"
                    bg="rgba(0,0,0,0.35)" color="white" border={`1px solid ${color}44`}
                    borderRadius="lg" fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
                    sx={{ caretColor: color }}
                    _placeholder={{ color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}
                    _focus={{ borderColor: color, boxShadow: `0 0 0 1px ${color}66` }}
                  />
                  <Text color="rgba(255,255,255,0.55)" fontSize="xs" fontStyle="italic" mt={2}>
                    Usa **negritas** con dobles asteriscos y deja una línea en blanco entre párrafos. Los cambios se aplican al momento; pulsa «Guardar cambios» arriba para escribirlos en el proyecto.
                  </Text>
                </Box>
              )}

            </Flex>
          </Box>

        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
