import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import FlorTitulo from "../../components/global/FlorTitulo";
import { LifeLoading } from "../../components/global/LifeLoading";
import { focoBlanco } from "../../components/global/foco";
import {
  API_URL,
  astrologiaBg, astrologiaTxt,
  neuropsicologiaBg, neuropsicologiaTxt,
  ayurvedaBg, ayurvedaTxt,
  tcmBg, tcmTxt,
  fisiologiaBg, fisiologiaTxt,
  nutricionBg, nutricionTxt,
  cabalaBg, cabalaTxt,
  culturaBg, culturaTxt,
} from "../../GlobalVariables";
import { adminHeaders, useAdminGuard } from "./useAdminGuard";

// «Informes»: los documentos que María escribe para mandar a sus clientes. Se elige la disciplina (cambia
// la foto de fondo, el papel, los colores y el icono de la cabecera), se escribe el texto y se ve el PDF
// tal cual saldrá. Se puede descargar o mandar por correo a quien ella diga (uno o varios).
//
// El PDF se compone AQUÍ, en el navegador (utils/generateInformePdf.ts, el mismo taller que las ocho
// disciplinas) y solo viaja al servidor para salir por correo; el servidor no lo guarda. El borrador se
// recuerda en este navegador (localStorage), nada más.

type Estado = { tipo: "ok" | "error"; texto: string } | null;
interface Borrador {
  disciplina: string;
  titulo: string;
  para: string;
  cuerpo: string;
  correos: string;
  asunto: string;
  mensaje: string;
}

// Los botones llevan los colores de su disciplina (Bg de fondo, Txt de letra), como en el resto de la casa.
const DISCIPLINAS = [
  { clave: "astrologia", nombre: "Astrología", bg: astrologiaBg, txt: astrologiaTxt },
  { clave: "psicologia", nombre: "Psicología", bg: neuropsicologiaBg, txt: neuropsicologiaTxt },
  { clave: "ayurveda", nombre: "Ayurveda", bg: ayurvedaBg, txt: ayurvedaTxt },
  { clave: "tcm", nombre: "Medicina China", bg: tcmBg, txt: tcmTxt },
  { clave: "fisiologia", nombre: "Fisiología", bg: fisiologiaBg, txt: fisiologiaTxt },
  { clave: "nutricion", nombre: "Nutrición", bg: nutricionBg, txt: nutricionTxt },
  { clave: "cabala", nombre: "Cábala", bg: cabalaBg, txt: cabalaTxt },
  { clave: "cultura", nombre: "Cultura", bg: culturaBg, txt: culturaTxt },
] as const;

const TQ = "#004f4f";
const MARMOL = "url('/img/fondos/marmolfondo.webp')";
const CLAVE = "informes:borrador:v1";
const VACIO: Borrador = { disciplina: "psicologia", titulo: "", para: "", cuerpo: "", correos: "", asunto: "", mensaje: "" };

export default function AdminInformes() {
  const { verificando } = useAdminGuard();

  const [b, setB] = useState<Borrador>(() => {
    try {
      const g = JSON.parse(localStorage.getItem(CLAVE) ?? "null");
      if (g && typeof g === "object") return { ...VACIO, ...g };
    } catch { /* borrador corrupto: se empieza de cero */ }
    return VACIO;
  });
  const [url, setUrl] = useState<string | null>(null);
  const [componiendo, setComponiendo] = useState(false);
  const [estado, setEstado] = useState<Estado>(null);
  const [enviando, setEnviando] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(CLAVE, JSON.stringify(b)); } catch { /* modo privado */ }
  }, [b]);

  const cambiar = (parcial: Partial<Borrador>) => { setB((x) => ({ ...x, ...parcial })); setConfirmar(false); setEstado(null); };

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

  const enviar = async (prueba: boolean) => {
    if (enviando) return;
    setEnviando(true);
    setEstado(null);
    try {
      const { blob, nombre } = await componer();
      const fd = new FormData();
      fd.append("pdf", blob, nombre);
      fd.append("para", b.correos);
      fd.append("asunto", b.asunto);
      fd.append("mensaje", b.mensaje);
      fd.append("disciplina", b.disciplina);
      if (prueba) fd.append("prueba", "1");
      const { data } = await axios.post(`${API_URL}/informes/enviar`, fd, { headers: adminHeaders() });
      if (data?.success) {
        const a = (data.resultados ?? []).filter((r: { ok: boolean }) => r.ok).map((r: { a: string }) => r.a).join(", ");
        setEstado({ tipo: "ok", texto: `${prueba ? "Prueba enviada a" : "Enviado a"} ${a}.${data.aviso ? ` ${data.aviso}` : ""}` });
        setConfirmar(false);
      } else {
        setEstado({ tipo: "error", texto: data?.error ?? "No se pudo enviar." });
      }
    } catch {
      setEstado({ tipo: "error", texto: "No se pudo enviar. Inténtalo de nuevo." });
    } finally {
      setEnviando(false);
    }
  };

  if (verificando) return <LifeLoading variant="private" />;

  const hayTexto = !!b.cuerpo.trim() || !!b.titulo.trim();
  const puedePrueba = hayTexto && !!b.asunto.trim() && !enviando;
  const puedeEnviar = puedePrueba && !!b.correos.trim();

  const etiqueta = (t: string) => (
    <Text color={TQ} fontSize="xs" fontWeight={700} letterSpacing="0.1em" textTransform="uppercase" mb={1.5}>{t}</Text>
  );
  const campo = {
    variant: "unstyled" as const,
    px: 3, py: 2,
    color: TQ,
    bg: "rgba(255,255,255,0.45)",
    border: `1px solid ${TQ}44`,
    borderRadius: "lg",
    fontFamily: "'EB Garamond', serif",
    _placeholder: { color: `${TQ}88`, fontStyle: "italic" },
    _focus: { borderColor: TQ },
  };
  const caja = {
    borderRadius: "2xl",
    border: "1px solid rgba(255,255,255,0.65)",
    boxShadow: "0 0 30px rgba(255,255,255,0.28), 0 0 70px rgba(180,255,245,0.14)",
  };
  const pildora = (texto: string, onClick: () => void, activo: boolean, relleno = false) => (
    <Box as="button" type="button" onClick={onClick} disabled={!activo}
         px={{ base: 6, md: 8 }} py={2.5} borderRadius="full"
         bg={relleno ? "white" : "transparent"} color={relleno ? "#008080" : "white"}
         border={relleno ? "none" : "1.5px solid rgba(255,255,255,0.8)"}
         fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.04em"
         opacity={activo ? 1 : 0.5} cursor={activo ? "pointer" : "not-allowed"} transition="all 0.2s"
         _hover={activo ? (relleno ? { transform: "translateY(-2px)" } : { bg: "rgba(255,255,255,0.14)" }) : undefined}
         _focusVisible={focoBlanco}>
      {texto}
    </Box>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" justify="center" px={{ base: 4, md: 8 }} pt={{ base: 8, md: 10 }} pb={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="1180px">
          {/* El mandala de la casa encima del título, como en /opiniones. */}
          <FlorTitulo mandala pt={{ base: 0, md: 0 }} />
          <Text color="white" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.08em" textTransform="uppercase"
                lineHeight="1.15" textAlign="center" mt={{ base: 4, md: 5 }}>
            Informes
          </Text>
          <Text color="white" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center" mt={2} mb={{ base: 6, md: 8 }}>
            Escribe el documento, elige la disciplina y mándalo por correo.
          </Text>

          <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 6, lg: 8 }} align="flex-start">
            {/* ── El editor ── */}
            <Box flex="1" minW={0} w="100%" p={{ base: 5, md: 7 }}
                 bgColor="#efe5cf" bgImage={MARMOL} bgSize="cover" bgPosition="center" {...caja}>
              <Flex direction="column" gap={5}>
                <Box>
                  {etiqueta("Disciplina")}
                  <Flex gap={2} wrap="wrap">
                    {DISCIPLINAS.map((d) => {
                      const sel = b.disciplina === d.clave;
                      return (
                        <Box key={d.clave} as="button" type="button" onClick={() => cambiar({ disciplina: d.clave })} aria-pressed={sel}
                             px={3.5} py={1.5} borderRadius="full" fontSize="sm" fontWeight={700} bg={d.bg} color={d.txt}
                             border={`2px solid ${sel ? TQ : "transparent"}`}
                             boxShadow={sel ? `0 0 12px ${d.txt}99` : "none"}
                             opacity={sel ? 1 : 0.8} _hover={{ opacity: 1 }} _focusVisible={focoBlanco}>
                          {d.nombre}
                        </Box>
                      );
                    })}
                  </Flex>
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

            {/* ── La vista previa y el envío ── */}
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
                <Text color="white" fontSize="sm" fontStyle="italic">{componiendo ? "Actualizando…" : "Así saldrá el PDF."}</Text>
                {url && (
                  <Text as="a" href={url} target="_blank" rel="noreferrer" color="white" fontSize="sm" textDecoration="underline"
                        _focusVisible={focoBlanco}>
                    Abrir en otra pestaña
                  </Text>
                )}
              </Flex>

              <Box mt={5} p={{ base: 5, md: 6 }} bgColor="#efe5cf" bgImage={MARMOL} bgSize="cover" bgPosition="center" {...caja}>
                <Flex direction="column" gap={4}>
                  <Box>
                    {etiqueta("Enviar a (uno o varios correos)")}
                    <Textarea {...campo} value={b.correos} onChange={(e) => cambiar({ correos: e.target.value })}
                              minH="64px" resize="vertical" placeholder="ana@correo.com, luis@correo.com" />
                  </Box>
                  <Box>
                    {etiqueta("Asunto")}
                    <Input {...campo} value={b.asunto} onChange={(e) => cambiar({ asunto: e.target.value })} />
                  </Box>
                  <Box>
                    {etiqueta("Mensaje del correo (opcional)")}
                    <Textarea {...campo} value={b.mensaje} onChange={(e) => cambiar({ mensaje: e.target.value })}
                              minH="90px" resize="vertical" />
                  </Box>
                  <Text color={`${TQ}aa`} fontSize="xs" fontStyle="italic" mt={-2}>
                    Cada persona recibe su propio correo, con la foto y los colores de la disciplina elegida y el PDF adjunto (no ven a las demás), y a ti te llega una copia oculta.
                  </Text>
                </Flex>
              </Box>

              {estado && (
                <Text color="white" fontSize="md" fontStyle="italic" textAlign="center" mt={4}
                      textShadow={estado.tipo === "error" ? "0 0 8px rgba(255,120,120,0.8)" : "none"}>
                  {estado.texto}
                </Text>
              )}

              <Flex gap={3} wrap="wrap" justify="center" mt={5}>
                {pildora("Descargar PDF", descargar, hayTexto)}
                {pildora("Enviarme prueba", () => enviar(true), puedePrueba)}
                {pildora(
                  enviando ? "Enviando…" : confirmar ? "Confirmar envío" : "Enviar",
                  () => (confirmar ? enviar(false) : setConfirmar(true)),
                  puedeEnviar,
                  true,
                )}
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <SiteFooter />
    </Box>
  );
}
