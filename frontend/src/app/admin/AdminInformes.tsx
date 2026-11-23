import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import FlorTitulo from "../../components/global/FlorTitulo";
import { LifeLoading } from "../../components/global/LifeLoading";
import { useAdminGuard } from "./useAdminGuard";
import {
  CLAVE_INFORME, MARMOL, TQ, SelectorDisciplina, caja, campo, etiqueta, leerBorradorInforme, pildora,
  type BorradorInforme,
} from "./informesComun";

// «Informes»: los documentos que María escribe para sus clientes. Se elige la disciplina (cambia la foto
// de fondo, el papel, los colores y el icono de la cabecera), se escribe el texto y se ve el PDF tal cual
// saldrá. Aquí solo se CREA y se descarga; mandarlo por correo se hace en /admin/correos.
//
// El PDF se compone AQUÍ, en el navegador (utils/generateInformePdf.ts, el mismo taller que las ocho
// disciplinas). El borrador se recuerda en este navegador (localStorage), nada más; /admin/correos lo
// lee desde ahí para poder adjuntarlo.

type Estado = { tipo: "ok" | "error"; texto: string } | null;

export default function AdminInformes() {
  const { verificando } = useAdminGuard();

  const [b, setB] = useState<BorradorInforme>(leerBorradorInforme);
  const [url, setUrl] = useState<string | null>(null);
  const [componiendo, setComponiendo] = useState(false);
  const [estado, setEstado] = useState<Estado>(null);

  useEffect(() => {
    try { localStorage.setItem(CLAVE_INFORME, JSON.stringify(b)); } catch { /* modo privado */ }
  }, [b]);

  const cambiar = (parcial: Partial<BorradorInforme>) => { setB((x) => ({ ...x, ...parcial })); setEstado(null); };

  // Compone el PDF (el módulo pesado se carga al hacer falta). Devuelve el blob y su nombre.
  const componer = async () => {
    const { generarInforme } = await import("../../utils/generateInformePdf");
    return await generarInforme({ disciplina: b.disciplina, titulo: b.titulo, para: b.para, cuerpo: b.cuerpo });
  };

  // La vista previa, con una pequeña espera mientras se escribe.
  const turno = useRef(0);
  const urlActual = useRef<string | null>(null);
  useEffect(() => {
    if (verificando) return;
    const n = ++turno.current;
    setComponiendo(true);
    const id = window.setTimeout(async () => {
      try {
        const { blob } = await componer();
        if (n !== turno.current) return;
        const nueva = URL.createObjectURL(blob);
        if (urlActual.current) URL.revokeObjectURL(urlActual.current);
        urlActual.current = nueva;
        setUrl(nueva);
      } catch {
        if (n === turno.current) setEstado({ tipo: "error", texto: "No se pudo componer el PDF." });
      } finally {
        if (n === turno.current) setComponiendo(false);
      }
    }, 700);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b.disciplina, b.titulo, b.para, b.cuerpo, verificando]);

  useEffect(() => () => { if (urlActual.current) URL.revokeObjectURL(urlActual.current); }, []);

  const descargar = async () => {
    setEstado(null);
    try {
      const { blob, nombre } = await componer();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = nombre;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch {
      setEstado({ tipo: "error", texto: "No se pudo descargar el PDF." });
    }
  };

  if (verificando) return <LifeLoading variant="private" />;

  const hayTexto = !!b.cuerpo.trim() || !!b.titulo.trim();

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" justify="center" px={{ base: 4, md: 8 }} pt={{ base: 8, md: 10 }} pb={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="1180px">
          {/* El mandala de la casa encima del título, como en /opiniones. */}
          <FlorTitulo mandala pt={{ base: 0, md: 0 }} />
          <Text color="#005F5F" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.08em" textTransform="uppercase"
                lineHeight="1.15" textAlign="center" mt={{ base: 4, md: 5 }} mb={{ base: 6, md: 8 }}>
            Informes
          </Text>

          <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 6, lg: 8 }} align="flex-start">
            {/* ── El editor ── */}
            <Box flex="1" minW={0} w="100%" p={{ base: 5, md: 7 }}
                 bgColor="#efe5cf" bgImage={MARMOL} bgSize="cover" bgPosition="center" {...caja}>
              <Flex direction="column" gap={5}>
                <Box>
                  {etiqueta("Disciplina")}
                  <SelectorDisciplina valor={b.disciplina} onCambia={(clave) => cambiar({ disciplina: clave })} />
                </Box>
                <Box>
                  {etiqueta("Título del informe")}
                  <Input {...campo} value={b.titulo} onChange={(e) => cambiar({ titulo: e.target.value })} fontSize="lg" fontWeight={700} />
                </Box>
                <Box>
                  {etiqueta("Para (nombre, opcional)")}
                  <Input {...campo} value={b.para} onChange={(e) => cambiar({ para: e.target.value })} />
                </Box>
                <Box>
                  {etiqueta("Texto")}
                  <Textarea {...campo} value={b.cuerpo} onChange={(e) => cambiar({ cuerpo: e.target.value })}
                            minH="340px" fontSize="lg" lineHeight="1.7" resize="vertical" />
                  <Text color={`${TQ}aa`} fontSize="xs" fontStyle="italic" mt={2}>
                    Una línea en blanco separa párrafos · «# Título» sección · «## Título» antetítulo · «- » lista · «---» raya · «&gt; frase» cierre
                  </Text>
                </Box>
              </Flex>
            </Box>

            {/* ── La vista previa ── */}
            <Box flex="1" minW={0} w="100%" position={{ lg: "sticky" }} top={{ lg: "16px" }}>
              <Box overflow="hidden" bg="#e9ecec" {...caja}>
                {url ? (
                  <Box as="iframe" title="Vista previa del PDF" src={`${url}#toolbar=0&navpanes=0`} w="100%"
                       h={{ base: "560px", lg: "720px" }} border="none" bg="#e9ecec" />
                ) : (
                  <Flex h={{ base: "320px", lg: "720px" }} align="center" justify="center">
                    <Text color={TQ} fontStyle="italic">Componiendo el PDF…</Text>
                  </Flex>
                )}
              </Box>
              <Flex justify="space-between" align="center" mt={2} px={1} gap={3} wrap="wrap">
                <Text color="#005F5F" fontSize="sm" fontStyle="italic">{componiendo ? "Actualizando…" : "Así saldrá el PDF."}</Text>
                {url && (
                  <Text as="a" href={url} target="_blank" rel="noreferrer" color="#005F5F" fontSize="sm" textDecoration="underline"
                        _focusVisible={{ outline: "2px solid #004f4fcc", outlineOffset: "2px" }}>
                    Abrir en otra pestaña
                  </Text>
                )}
              </Flex>

              {estado && (
                <Text color={estado.tipo === "error" ? "#b3261e" : "#005F5F"} fontSize="md" fontStyle="italic" textAlign="center" mt={4}>
                  {estado.texto}
                </Text>
              )}

              <Flex gap={3} wrap="wrap" justify="center" mt={5}>
                {pildora("Descargar PDF", descargar, hayTexto, true)}
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <SiteFooter />
    </Box>
  );
}
