// ─────────────────────────────────────────────────────────────────────────
// ADMIN · Editor de INTERPRETACIONES de la carta astral.
//
// Edita, en cualquier momento, el texto de cada arquetipo (cuerpo × signo y
// cuerpo × casa). Se guarda en la tabla `astrologia_textos` del back.
//
// Botón «Importar textos actuales»: siembra la tabla con lo que hay en el
// archivo estático (astrologiaTextos.ts). Se pulsa una vez tras crear la tabla.
// ─────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import { Box, Flex, Text, Textarea, Select, useToast } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { useAdminGuard } from "./useAdminGuard";
import { CUERPOS, ZODIAC_SIGNS } from "../../components/metodo/astrologiaData";
import {
  fetchTodosTextos,
  guardarTexto,
  importarTextosEstaticos,
  textoEstatico,
  type FacetaAstro,
} from "../../data/astrologiaTextosApi";

const clave = (c: string, f: string, v: string) => `${c}|${f}|${v}`;
const CASAS = Array.from({ length: 12 }, (_, i) => String(i + 1));

export default function AdminAstrologiaTextos() {
  const { verificando } = useAdminGuard();
  const toast = useToast();

  const [cargando, setCargando] = useState(true);
  const [guardados, setGuardados] = useState<Record<string, string>>({});
  const [cuerpoKey, setCuerpoKey] = useState<string>(CUERPOS[0]?.key ?? "sol");
  const [faceta, setFaceta] = useState<FacetaAstro>("signo");
  const [valor, setValor] = useState<string>(ZODIAC_SIGNS[0]?.name ?? "Aries");
  const [texto, setTexto] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [importando, setImportando] = useState(false);

  const cuerpo = useMemo(() => CUERPOS.find((c) => c.key === cuerpoKey) ?? CUERPOS[0], [cuerpoKey]);
  const valores = faceta === "signo" ? ZODIAC_SIGNS.map((s) => s.name) : CASAS;

  const cargarTodos = async () => {
    setCargando(true);
    try {
      const rows = await fetchTodosTextos();
      const map: Record<string, string> = {};
      rows.forEach((r) => { map[clave(r.cuerpo, r.faceta, String(r.valor))] = r.texto ?? ""; });
      setGuardados(map);
    } catch {
      // silencioso
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { if (!verificando) void cargarTodos(); }, [verificando]);

  // Si el cuerpo no tiene casa, forzamos faceta = signo.
  useEffect(() => {
    if (faceta === "casa" && cuerpo && !cuerpo.conCasa) setFaceta("signo");
  }, [cuerpo, faceta]);

  // Al cambiar de faceta, ajusta el valor al primero válido.
  useEffect(() => {
    setValor(faceta === "signo" ? (ZODIAC_SIGNS[0]?.name ?? "Aries") : "1");
  }, [faceta]);

  // Al cambiar la celda seleccionada, carga su texto (guardado o estático).
  useEffect(() => {
    if (!cuerpo) return;
    const guardado = guardados[clave(cuerpo.key, faceta, valor)];
    setTexto(guardado ?? textoEstatico(cuerpo.key, faceta, valor) ?? "");
  }, [cuerpo, faceta, valor, guardados]);

  const onGuardar = async () => {
    if (!cuerpo) return;
    setGuardando(true);
    try {
      const res = await guardarTexto({ cuerpo: cuerpo.key, faceta, valor, texto });
      if (res.success) {
        setGuardados((prev) => ({ ...prev, [clave(cuerpo.key, faceta, valor)]: texto }));
        toast({ title: "Guardado", status: "success", duration: 1600, isClosable: true });
      } else {
        toast({ title: "No se pudo guardar", status: "error", duration: 2500, isClosable: true });
      }
    } catch {
      toast({ title: "Error al guardar", status: "error", duration: 2500, isClosable: true });
    } finally {
      setGuardando(false);
    }
  };

  const onImportar = async () => {
    if (!window.confirm("Importar todos los textos del archivo a la base de datos. Sobrescribe lo que ya haya con el mismo nombre. ¿Continuar?")) return;
    setImportando(true);
    try {
      const res = await importarTextosEstaticos();
      await cargarTodos();
      toast({
        title: res.success ? `Importados ${res.count} textos` : "Importación fallida",
        status: res.success ? "success" : "error",
        duration: 3000, isClosable: true,
      });
    } catch {
      toast({ title: "Error al importar", status: "error", duration: 3000, isClosable: true });
    } finally {
      setImportando(false);
    }
  };

  if (verificando || cargando) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const totalGuardados = Object.keys(guardados).length;
  const estaGuardado = !!guardados[clave(cuerpoKey, faceta, valor)];

  const selectSx = {
    bg: "rgba(255,255,255,0.08)", color: "white", borderColor: "rgba(255,255,255,0.3)",
    _hover: { borderColor: "rgba(255,255,255,0.5)" },
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10 }} py={{ base: 8, md: 12 }}>
        <Flex direction="column" w="100%" maxW="900px" gap={6}>

          <Flex align="center" justify="space-between" gap={4} wrap="wrap">
            <Box>
              <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700">
                Interpretaciones de la carta
              </Text>
              <Text color="rgba(255,255,255,0.75)" fontSize="sm">
                {totalGuardados} textos guardados en la base de datos
              </Text>
            </Box>
            <Box as="button" onClick={importando ? undefined : onImportar}
                 px={5} py={2.5} borderRadius="full" bg="rgba(255,255,255,0.12)"
                 border="1.5px solid rgba(255,255,255,0.5)" color="white" fontWeight="700"
                 fontSize="sm" cursor={importando ? "wait" : "pointer"} opacity={importando ? 0.6 : 1}
                 _hover={importando ? {} : { bg: "rgba(255,255,255,0.2)" }}>
              {importando ? "Importando…" : "Importar textos actuales"}
            </Box>
          </Flex>

          {/* Selectores */}
          <Flex gap={3} wrap="wrap">
            <Box flex="1" minW="180px">
              <Text color="rgba(255,255,255,0.7)" fontSize="xs" mb={1} textTransform="uppercase" letterSpacing="0.1em">Cuerpo</Text>
              <Select value={cuerpoKey} onChange={(e) => setCuerpoKey(e.target.value)} sx={selectSx}>
                {CUERPOS.map((c) => (
                  <option key={c.key} value={c.key} style={{ color: "#111" }}>{c.label}</option>
                ))}
              </Select>
            </Box>
            <Box w="150px">
              <Text color="rgba(255,255,255,0.7)" fontSize="xs" mb={1} textTransform="uppercase" letterSpacing="0.1em">Faceta</Text>
              <Select value={faceta} onChange={(e) => setFaceta(e.target.value as FacetaAstro)} sx={selectSx}>
                <option value="signo" style={{ color: "#111" }}>Signo</option>
                {cuerpo?.conCasa && <option value="casa" style={{ color: "#111" }}>Casa</option>}
              </Select>
            </Box>
            <Box flex="1" minW="150px">
              <Text color="rgba(255,255,255,0.7)" fontSize="xs" mb={1} textTransform="uppercase" letterSpacing="0.1em">
                {faceta === "signo" ? "Signo" : "Casa"}
              </Text>
              <Select value={valor} onChange={(e) => setValor(e.target.value)} sx={selectSx}>
                {valores.map((v) => (
                  <option key={v} value={v} style={{ color: "#111" }}>{faceta === "casa" ? `Casa ${v}` : v}</option>
                ))}
              </Select>
            </Box>
          </Flex>

          {/* Editor de la celda */}
          <Box borderRadius="2xl" bg="rgba(255,255,255,0.06)" border="1px solid rgba(255,255,255,0.18)" p={{ base: 4, md: 6 }}>
            <Flex align="center" justify="space-between" mb={3} gap={3}>
              <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="700">
                {cuerpo?.label} · {faceta === "casa" ? `Casa ${valor}` : valor}
              </Text>
              <Text color={estaGuardado ? "#9fe6c0" : "rgba(255,255,255,0.5)"} fontSize="xs" fontStyle="italic">
                {estaGuardado ? "✓ en base de datos" : "aún no guardado (se muestra el texto actual)"}
              </Text>
            </Flex>
            <Textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe la interpretación…"
              minH="360px"
              bg="rgba(0,0,0,0.25)" color="white" border="1px solid rgba(255,255,255,0.2)"
              borderRadius="lg" fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
              sx={{ caretColor: "white" }}
              _placeholder={{ color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}
              _focus={{ borderColor: "rgba(255,255,255,0.6)", boxShadow: "0 0 0 1px rgba(255,255,255,0.3)" }}
            />
            <Flex justify="flex-end" mt={4}>
              <Box as="button" onClick={guardando ? undefined : onGuardar}
                   px={9} py={3} borderRadius="full" bg="white" color="#008080" fontWeight="700"
                   fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em"
                   cursor={guardando ? "wait" : "pointer"} opacity={guardando ? 0.7 : 1}
                   boxShadow="0 4px 20px rgba(255,255,255,0.25)"
                   _hover={guardando ? {} : { transform: "translateY(-2px)" }} transition="all 0.2s">
                {guardando ? "Guardando…" : "Guardar"}
              </Box>
            </Flex>
          </Box>

          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic">
            Usa **negritas** con dobles asteriscos y deja una línea en blanco entre párrafos, igual que en los textos actuales.
          </Text>

        </Flex>
      </Flex>

      <SiteFooter />
    </Box>
  );
}
