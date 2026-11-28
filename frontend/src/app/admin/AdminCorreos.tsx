import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import FlorTitulo from "../../components/global/FlorTitulo";
import { LifeLoading } from "../../components/global/LifeLoading";
import { API_URL } from "../../GlobalVariables";
import { adminHeaders, useAdminGuard } from "./useAdminGuard";
import {
  MARMOL, TQ, SelectorDisciplina, caja, campo, etiqueta, leerBorradorInforme, pildora,
} from "./informesComun";

// «Correos»: los correos que María manda a quien quiera (uno o varios), con el aspecto de la casa. Se
// escribe el mensaje, se eligen el fondo y las fotos, y se pueden adjuntar PDF: los que suba y, si quiere,
// el informe que tenga en /admin/informes. Los emojis se escriben o se pegan desde fuera, aquí no hay
// ningún selector.
//
// No se guarda nada en el servidor: ni destinatarios ni adjuntos; queda en el correo (copia oculta a
// NOTIFY_EMAIL). El borrador del texto se recuerda en este navegador (localStorage).

type Estado = { tipo: "ok" | "error"; texto: string } | null;
interface Borrador {
  disciplina: string;
  correos: string;
  asunto: string;
  mensaje: string;
  /** El fondo del correo: la foto de la disciplina o el mármol de la casa. */
  fondoCorreo: "disciplina" | "marmol";
  /** Si se adjunta también el informe que hay en /admin/informes. */
  conInforme: boolean;
}

const CLAVE = "correos:borrador:v1";
const VACIO: Borrador = { disciplina: "psicologia", correos: "", asunto: "", mensaje: "", fondoCorreo: "disciplina", conInforme: false };

/** Las fotos del correo: se reducen aquí antes de subirlas (el correo pesa poco y se quitan los datos de la cámara). */
const MAX_FOTOS = 6;
const LADO_FOTO = 1400;
const MAX_ADJUNTOS = 5;
interface FotoCorreo { id: string; nombre: string; blob: Blob; url: string }
interface AdjuntoPdf { id: string; nombre: string; archivo: File }

const reducirFoto = (archivo: File): Promise<Blob | null> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      const e = Math.min(1, LADO_FOTO / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * e);
      c.height = Math.round(img.naturalHeight * e);
      const ctx = c.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); resolve(null); return; }
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob((b) => resolve(b), "image/jpeg", 0.86);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });

export default function AdminCorreos() {
  const { verificando } = useAdminGuard();

  const [b, setB] = useState<Borrador>(() => {
    try {
      const g = JSON.parse(localStorage.getItem(CLAVE) ?? "null");
      if (g && typeof g === "object") return { ...VACIO, ...g };
    } catch { /* borrador corrupto: se empieza de cero */ }
    return VACIO;
  });
  const [estado, setEstado] = useState<Estado>(null);
  const [enviando, setEnviando] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const [fotos, setFotos] = useState<FotoCorreo[]>([]);
  const entradaFotos = useRef<HTMLInputElement>(null);
  const [adjuntos, setAdjuntos] = useState<AdjuntoPdf[]>([]);
  const entradaPdf = useRef<HTMLInputElement>(null);

  // El informe de /admin/informes, por si se quiere adjuntar (se lee al abrir la página).
  const [informe] = useState(leerBorradorInforme);
  const hayInforme = !!informe.cuerpo.trim() || !!informe.titulo.trim();

  useEffect(() => {
    try { localStorage.setItem(CLAVE, JSON.stringify(b)); } catch { /* modo privado */ }
  }, [b]);

  const cambiar = (parcial: Partial<Borrador>) => { setB((x) => ({ ...x, ...parcial })); setConfirmar(false); setEstado(null); };

  const añadirPdf = (lista: FileList | null) => {
    if (!lista) return;
    const buenos = Array.from(lista).filter((f) => f.type === "application/pdf" || /\.pdf$/i.test(f.name));
    const nuevos = buenos
      .slice(0, Math.max(0, MAX_ADJUNTOS - adjuntos.length))
      .map((f) => ({ id: Math.random().toString(36).slice(2, 9), nombre: f.name, archivo: f }));
    if (nuevos.length) setAdjuntos((x) => [...x, ...nuevos]);
    setConfirmar(false);
    setEstado(
      buenos.length < lista.length || buenos.length > nuevos.length
        ? { tipo: "error", texto: `Solo archivos PDF, y hasta ${MAX_ADJUNTOS}.` }
        : null,
    );
    if (entradaPdf.current) entradaPdf.current.value = "";
  };
  const quitarPdf = (id: string) => { setAdjuntos((x) => x.filter((a) => a.id !== id)); setConfirmar(false); };

  const añadirFotos = async (lista: FileList | null) => {
    if (!lista) return;
    const nuevas: FotoCorreo[] = [];
    let fallo = false;
    for (const f of Array.from(lista)) {
      if (fotos.length + nuevas.length >= MAX_FOTOS) { fallo = true; break; }
      const blob = await reducirFoto(f);
      if (!blob) { fallo = true; continue; }
      nuevas.push({ id: Math.random().toString(36).slice(2, 9), nombre: f.name, blob, url: URL.createObjectURL(blob) });
    }
    if (nuevas.length) setFotos((x) => [...x, ...nuevas]);
    setConfirmar(false);
    setEstado(fallo ? { tipo: "error", texto: `Máximo ${MAX_FOTOS} fotos, y tienen que ser imágenes (JPG, PNG o WebP).` } : null);
    if (entradaFotos.current) entradaFotos.current.value = "";
  };
  const quitarFoto = (id: string) => {
    setFotos((x) => { x.filter((f) => f.id === id).forEach((f) => URL.revokeObjectURL(f.url)); return x.filter((f) => f.id !== id); });
    setConfirmar(false);
  };

  const enviar = async (prueba: boolean) => {
    if (enviando) return;
    setEnviando(true);
    setEstado(null);
    try {
      const fd = new FormData();
      if (b.conInforme && hayInforme) {
        const { generarInforme } = await import("../../utils/generateInformePdf");
        const { blob, nombre } = await generarInforme({
          disciplina: informe.disciplina, titulo: informe.titulo, para: informe.para, cuerpo: informe.cuerpo,
        });
        fd.append("pdf", blob, nombre);
      } else {
        fd.append("sinInforme", "1");
      }
      adjuntos.forEach((a) => fd.append("adjuntos", a.archivo, a.nombre));
      fd.append("fondo", b.fondoCorreo);
      fd.append("para", b.correos);
      fd.append("asunto", b.asunto);
      fd.append("mensaje", b.mensaje);
      fd.append("disciplina", b.disciplina);
      fotos.forEach((f, i) => fd.append("fotos", f.blob, `foto-${i + 1}.jpg`));
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

  const llevaInforme = b.conInforme && hayInforme;
  // Sin el informe adjunto, el correo necesita algo: un mensaje, fotos o algún PDF.
  const hayContenido = llevaInforme || !!b.mensaje.trim() || fotos.length > 0 || adjuntos.length > 0;
  const puedePrueba = hayContenido && !!b.asunto.trim() && !enviando;
  const puedeEnviar = puedePrueba && !!b.correos.trim();

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" justify="center" px={{ base: 4, md: 8 }} pt={{ base: 8, md: 10 }} pb={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="720px">
          <FlorTitulo mandala pt={{ base: 0, md: 0 }} />
          <Text color="#3B2418" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.08em" textTransform="uppercase"
                lineHeight="1.15" textAlign="center" mt={{ base: 4, md: 5 }} mb={{ base: 6, md: 8 }}>
            Correos
          </Text>

          <Box p={{ base: 5, md: 7 }} bgColor="#efe5cf" bgImage={MARMOL} bgSize="cover" bgPosition="center" {...caja}>
            <Flex direction="column" gap={5}>
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
                {etiqueta("Fondo del correo")}
                <Flex gap={2} wrap="wrap">
                  {([["disciplina", "Foto de la disciplina"], ["marmol", "Beige"]] as const).map(([v, nombre]) => {
                    const sel = b.fondoCorreo === v;
                    return (
                      <Box key={v} as="button" type="button" onClick={() => cambiar({ fondoCorreo: v })} aria-pressed={sel}
                           px={4} py={1.5} borderRadius="full" fontSize="sm" fontWeight={700} color={TQ}
                           bg={sel ? "#ffffffb3" : "#ffffff4d"}
                           border={`2px solid ${sel ? TQ : `${TQ}44`}`} _hover={{ bg: "#ffffff99" }} _focusVisible={{ outline: "2px solid #3B2418cc", outlineOffset: "2px" }}>
                        {nombre}
                      </Box>
                    );
                  })}
                </Flex>
                <Text color={`${TQ}aa`} fontSize="xs" fontStyle="italic" mt={1.5}>
                  {b.fondoCorreo === "marmol"
                    ? "Hoja beige con la letra en turquesa oscuro."
                    : "La foto vertical de la disciplina elegida, con toda la letra de su color."}
                </Text>
              </Box>
              {b.fondoCorreo === "disciplina" && (
                <Box>
                  {etiqueta("Disciplina")}
                  <SelectorDisciplina valor={b.disciplina} onCambia={(clave) => cambiar({ disciplina: clave })} />
                </Box>
              )}
              <Box>
                {etiqueta("Mensaje")}
                <Textarea {...campo} value={b.mensaje} onChange={(e) => cambiar({ mensaje: e.target.value })}
                          minH="200px" fontSize="lg" lineHeight="1.7" resize="vertical" />
                <Text color={`${TQ}aa`} fontSize="xs" fontStyle="italic" mt={1.5}>
                  **negrita**, *cursiva* y --- para una raya. Una línea en blanco separa párrafos.
                </Text>
              </Box>
              <Box>
                {etiqueta(`Fotos (hasta ${MAX_FOTOS}, opcional)`)}
                <Flex gap={3} wrap="wrap" align="center">
                  {fotos.map((f) => (
                    <Box key={f.id} position="relative" w="84px" h="84px" borderRadius="lg" overflow="hidden" border={`1px solid ${TQ}55`}>
                      <Box as="img" src={f.url} alt="" w="100%" h="100%" objectFit="cover" />
                      <Box as="button" type="button" onClick={() => quitarFoto(f.id)} aria-label="Quitar foto"
                           position="absolute" top="3px" right="3px" w="22px" h="22px" borderRadius="full"
                           bg="#ffffffe6" color={TQ} fontSize="xs" fontWeight={700} lineHeight="1"
                           _focusVisible={{ outline: "2px solid #3B2418cc", outlineOffset: "2px" }}>
                        ✕
                      </Box>
                    </Box>
                  ))}
                  {fotos.length < MAX_FOTOS && (
                    <Box as="button" type="button" onClick={() => entradaFotos.current?.click()}
                         w="84px" h="84px" borderRadius="lg" border={`1.5px dashed ${TQ}88`} color={TQ} fontSize="2xl"
                         display="flex" alignItems="center" justifyContent="center" aria-label="Añadir fotos"
                         _hover={{ bg: `${TQ}14` }} _focusVisible={{ outline: "2px solid #3B2418cc", outlineOffset: "2px" }}>
                      +
                    </Box>
                  )}
                  <input ref={entradaFotos} type="file" accept="image/*" multiple hidden
                         onChange={(e) => añadirFotos(e.target.files)} />
                </Flex>
              </Box>
              <Box>
                {etiqueta(`Archivos PDF (hasta ${MAX_ADJUNTOS}, opcional)`)}
                <Flex direction="column" gap={2} align="flex-start">
                  <Box as="label" display="flex" alignItems="center" gap={2} cursor={hayInforme ? "pointer" : "not-allowed"}
                       color={TQ} fontSize="sm" fontWeight={700} opacity={hayInforme ? 1 : 0.55}>
                    <input type="checkbox" checked={b.conInforme && hayInforme} disabled={!hayInforme}
                           onChange={(e) => cambiar({ conInforme: e.target.checked })} />
                    {hayInforme
                      ? `Adjuntar el informe de Informes${informe.titulo.trim() ? `: ${informe.titulo.trim()}` : ""}`
                      : "Adjuntar el informe de Informes (todavía no hay ninguno escrito)"}
                  </Box>
                  {adjuntos.map((a) => (
                    <Flex key={a.id} align="center" gap={2} color={TQ} fontSize="sm" maxW="100%">
                      <Text noOfLines={1} wordBreak="break-all">{a.nombre}</Text>
                      <Box as="button" type="button" onClick={() => quitarPdf(a.id)} aria-label={`Quitar ${a.nombre}`}
                           w="22px" h="22px" borderRadius="full" border={`1px solid ${TQ}66`} fontSize="xs" fontWeight={700} flexShrink={0}
                           _focusVisible={{ outline: "2px solid #3B2418cc", outlineOffset: "2px" }}>
                        ✕
                      </Box>
                    </Flex>
                  ))}
                  {adjuntos.length < MAX_ADJUNTOS && (
                    <Box as="button" type="button" onClick={() => entradaPdf.current?.click()}
                         px={4} py={1.5} borderRadius="full" border={`1.5px dashed ${TQ}88`} color={TQ} fontSize="sm" fontWeight={700}
                         _hover={{ bg: `${TQ}14` }} _focusVisible={{ outline: "2px solid #3B2418cc", outlineOffset: "2px" }}>
                      + Adjuntar PDF
                    </Box>
                  )}
                  <input ref={entradaPdf} type="file" accept="application/pdf,.pdf" multiple hidden
                         onChange={(e) => añadirPdf(e.target.files)} />
                </Flex>
              </Box>
              <Text color={`${TQ}aa`} fontSize="xs" fontStyle="italic" mt={-2}>
                Cada persona recibe su propio correo (no ven a las demás), y a ti te llega una copia oculta.
              </Text>
            </Flex>
          </Box>

          {estado && (
            <Text color={estado.tipo === "error" ? "#b3261e" : "#3B2418"} fontSize="md" fontStyle="italic" textAlign="center" mt={4}>
              {estado.texto}
            </Text>
          )}

          <Flex gap={3} wrap="wrap" justify="center" mt={5}>
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
      <SiteFooter />
    </Box>
  );
}
