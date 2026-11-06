import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { LifeLoading } from "../../components/global/LifeLoading";
import { focoBlanco } from "../../components/global/foco";
import { API_URL } from "../../GlobalVariables";
import { adminHeaders, useAdminGuard } from "./useAdminGuard";

// «Resumen de sesión»: el correo que María escribe tras (o durante) una sesión y manda al email de la
// cuenta de la persona. Se abre en OTRA pestaña desde el recorrido, para ir preparándolo sin cerrar la
// página en la que está con la persona. No se guarda nada en la web: queda en el correo. El borrador
// solo se recuerda en este navegador (por si se cierra la pestaña a media sesión).
//
// La vista previa es el HTML exacto que construye el servidor: lo que se ve es lo que llega.

interface Fondo { clave: string; nombre: string; foto: string | null; velo: string; txt: string }
interface Borrador { asunto: string; titulo: string; texto: string; fondo: string; colorTitulo: string; colorTexto: string }

const TQ = "#004f4f";
const ORO = "#b08d3f";
const MARMOL = "url('/img/fondos/marmolfondo.webp')";
const VACIO: Borrador = { asunto: "", titulo: "", texto: "", fondo: "marmol", colorTitulo: TQ, colorTexto: TQ };

const claveBorrador = (userId: string) => `correoSesion:${userId}`;

export default function AdminCorreoSesion() {
  const { verificando } = useAdminGuard();
  const { userId = "" } = useParams();

  const [fondos, setFondos] = useState<Fondo[]>([]);
  const [colores, setColores] = useState<string[]>([]);
  const [dest, setDest] = useState<{ nombre: string; email: string } | null>(null);
  const [b, setB] = useState<Borrador>(() => {
    try {
      const crudo = localStorage.getItem(claveBorrador(userId));
      return crudo ? { ...VACIO, ...JSON.parse(crudo) } : VACIO;
    } catch { return VACIO; }
  });
  const [html, setHtml] = useState("");
  const [estado, setEstado] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  // Las opciones y a quién le llegaría.
  useEffect(() => {
    if (verificando) return;
    axios.get(`${API_URL}/correo-sesion/opciones`, { headers: adminHeaders() })
      .then((r) => { setFondos(r.data?.fondos ?? []); setColores(r.data?.colores ?? []); })
      .catch(() => { /* sin opciones no se puede elegir, pero se puede escribir */ });
    axios.get(`${API_URL}/correo-sesion/${encodeURIComponent(userId)}/destinatario`, { headers: adminHeaders() })
      .then((r) => setDest(r.data?.success ? { nombre: r.data.nombre, email: r.data.email } : null))
      .catch(() => setDest(null));
  }, [verificando, userId]);

  // El borrador se recuerda en este navegador.
  useEffect(() => {
    try { localStorage.setItem(claveBorrador(userId), JSON.stringify(b)); } catch { /* modo privado */ }
  }, [b, userId]);

  // La vista previa, con una pequeña espera mientras se escribe.
  const peticion = useRef(0);
  useEffect(() => {
    if (verificando) return;
    const n = ++peticion.current;
    const id = window.setTimeout(() => {
      axios.post(`${API_URL}/correo-sesion/vista`, b, { headers: adminHeaders() })
        .then((r) => { if (n === peticion.current) setHtml(r.data?.html ?? ""); })
        .catch(() => { /* se queda con la anterior */ });
    }, 350);
    return () => window.clearTimeout(id);
  }, [b.titulo, b.texto, b.fondo, b.colorTitulo, b.colorTexto, verificando]); // eslint-disable-line react-hooks/exhaustive-deps

  const cambiar = (parcial: Partial<Borrador>) => { setB((x) => ({ ...x, ...parcial })); setConfirmar(false); setEstado(null); };
  const elegirFondo = (f: Fondo) => cambiar({ fondo: f.clave, colorTitulo: f.txt, colorTexto: f.txt });

  const enviar = async (prueba: boolean) => {
    if (enviando) return;
    setEnviando(true);
    setEstado(null);
    try {
      const { data } = await axios.post(`${API_URL}/correo-sesion/${encodeURIComponent(userId)}/enviar`, { ...b, prueba }, { headers: adminHeaders() });
      if (data?.success) {
        setEstado({ tipo: "ok", texto: prueba ? `Prueba enviada a ${data.a}.` : `Enviado a ${data.a}.` });
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

  const puede = !!b.asunto.trim() && (!!b.titulo.trim() || !!b.texto.trim()) && !enviando;

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
  const fila = (valor: string, onElegir: (c: string) => void, nombre: string) => (
    <Flex gap={2} wrap="wrap" role="group" aria-label={nombre}>
      {colores.map((c) => (
        <Box key={c} as="button" type="button" onClick={() => onElegir(c)} aria-label={c} aria-pressed={valor === c}
             w="30px" h="30px" borderRadius="full" bg={c}
             border={`2px solid ${valor === c ? TQ : `${TQ}44`}`}
             boxShadow={valor === c ? `0 0 10px ${ORO}88` : "none"}
             _focusVisible={focoBlanco} />
      ))}
    </Flex>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />
      <Flex flex="1" justify="center" px={{ base: 4, md: 8 }} pt={{ base: 8, md: 10 }} pb={{ base: 10, md: 14 }}>
        <Box w="100%" maxW="1180px">
          <Text color="white" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="700" letterSpacing="0.08em" textTransform="uppercase"
                lineHeight="1.15" textAlign="center" textShadow="0 0 14px rgba(255,255,255,0.6), 0 0 30px rgba(180,255,245,0.3)">
            Resumen de sesión
          </Text>
          <Text color="white" fontSize={{ base: "md", md: "lg" }} textAlign="center" mt={2} mb={{ base: 6, md: 8 }}>
            {dest ? `Para ${dest.nombre} · ${dest.email}` : "Cargando destinatario…"}
          </Text>

          <Flex direction={{ base: "column", lg: "row" }} gap={{ base: 6, lg: 8 }} align="flex-start">
            {/* ── El editor ── */}
            <Box flex="1" minW={0} w="100%" borderRadius="2xl" p={{ base: 5, md: 7 }}
                 bgColor="#efe5cf" bgImage={MARMOL} bgSize="cover" bgPosition="center"
                 border="1px solid rgba(255,255,255,0.65)" boxShadow="0 0 30px rgba(255,255,255,0.28), 0 0 70px rgba(180,255,245,0.14)">
              <Flex direction="column" gap={5}>
                <Box>
                  {etiqueta("Asunto")}
                  <Input {...campo} value={b.asunto} onChange={(e) => cambiar({ asunto: e.target.value })} placeholder="Lo que se lee en la bandeja de entrada" />
                </Box>
                <Box>
                  {etiqueta("Título")}
                  <Input {...campo} value={b.titulo} onChange={(e) => cambiar({ titulo: e.target.value })} fontSize="lg" />
                </Box>
                <Box>
                  {etiqueta("Texto")}
                  <Textarea {...campo} value={b.texto} onChange={(e) => cambiar({ texto: e.target.value })}
                            minH="260px" fontSize="lg" lineHeight="1.7" resize="vertical" />
                  <Text color={`${TQ}aa`} fontSize="xs" fontStyle="italic" mt={1.5}>
                    **negrita** · *cursiva* · una línea en blanco separa párrafos · --- entre dos párrafos pone una raya
                  </Text>
                </Box>

                <Box>
                  {etiqueta("Fondo")}
                  <Flex gap={2.5} wrap="wrap">
                    {fondos.map((f) => {
                      const sel = b.fondo === f.clave;
                      return (
                        <Box key={f.clave} as="button" type="button" onClick={() => elegirFondo(f)} aria-pressed={sel}
                             w={{ base: "72px", md: "84px" }} borderRadius="lg" overflow="hidden"
                             border={`2px solid ${sel ? TQ : `${TQ}44`}`} opacity={sel ? 1 : 0.8}
                             boxShadow={sel ? `0 0 10px ${ORO}88` : "none"} transition="all 0.2s"
                             _hover={{ opacity: 1 }} _focusVisible={focoBlanco}>
                          <Box h="48px" bg={f.velo} bgImage={f.foto ? `url('${f.foto}')` : undefined} bgSize="cover" bgPosition="center" />
                          <Text color={TQ} fontSize="2xs" textAlign="center" py={1} noOfLines={1} bg="rgba(255,255,255,0.6)">{f.nombre}</Text>
                        </Box>
                      );
                    })}
                  </Flex>
                </Box>

                <Flex gap={6} wrap="wrap">
                  <Box>
                    {etiqueta("Color del título")}
                    {fila(b.colorTitulo, (c) => cambiar({ colorTitulo: c }), "Color del título")}
                  </Box>
                  <Box>
                    {etiqueta("Color del texto")}
                    {fila(b.colorTexto, (c) => cambiar({ colorTexto: c }), "Color del texto")}
                  </Box>
                </Flex>
              </Flex>
            </Box>

            {/* ── La vista previa y el envío ── */}
            <Box flex="1" minW={0} w="100%" position={{ lg: "sticky" }} top={{ lg: "16px" }}>
              <Box borderRadius="2xl" overflow="hidden" bg="#e9ecec" border="1px solid rgba(255,255,255,0.65)"
                   boxShadow="0 0 30px rgba(255,255,255,0.28), 0 0 70px rgba(180,255,245,0.14)">
                <Box as="iframe" title="Vista previa del correo" w="100%" h={{ base: "520px", lg: "640px" }} border="none" bg="#e9ecec"
                     srcDoc={`<!doctype html><html><body style="margin:0;padding:18px;background:#e9ecec;">${html}</body></html>`} />
              </Box>

              {estado && (
                <Text color="white" fontSize="md" fontStyle="italic" textAlign="center" mt={4}
                      textShadow={estado.tipo === "error" ? "0 0 8px rgba(255,120,120,0.8)" : "none"}>
                  {estado.texto}
                </Text>
              )}

              <Flex gap={3} wrap="wrap" justify="center" mt={5}>
                <Box as="button" type="button" onClick={() => enviar(true)} disabled={!puede}
                     px={7} py={2.5} borderRadius="full" border="1.5px solid rgba(255,255,255,0.8)" color="white"
                     fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.04em"
                     opacity={puede ? 1 : 0.5} cursor={puede ? "pointer" : "not-allowed"} transition="all 0.2s"
                     _hover={puede ? { bg: "rgba(255,255,255,0.14)" } : undefined} _focusVisible={focoBlanco}>
                  Enviarme prueba
                </Box>
                <Box as="button" type="button" onClick={() => (confirmar ? enviar(false) : setConfirmar(true))} disabled={!puede || !dest?.email}
                     px={8} py={2.5} borderRadius="full" bg="white" color="#008080"
                     fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.04em"
                     boxShadow="0 4px 24px rgba(255,255,255,0.28)"
                     opacity={puede && dest?.email ? 1 : 0.5} cursor={puede && dest?.email ? "pointer" : "not-allowed"} transition="all 0.2s"
                     _hover={puede ? { transform: "translateY(-2px)" } : undefined} _focusVisible={focoBlanco}>
                  {enviando ? "Enviando…" : confirmar ? `Confirmar: enviar a ${dest?.nombre || "la persona"}` : "Enviar"}
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <SiteFooter />
    </Box>
  );
}
