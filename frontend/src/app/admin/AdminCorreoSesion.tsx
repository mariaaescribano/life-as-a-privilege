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
// página en la que está con la persona.
//
// El correo es el mármol de la casa de base: arriba el título (siempre turquesa oscuro) y debajo los
// bloques que haga falta, cada uno de SU disciplina (su foto y su color de letra). No se guarda nada
// en la web: queda en el correo. El borrador solo se recuerda en este navegador.
//
// La vista previa es el HTML exacto que construye el servidor: lo que se ve es lo que llega.

interface Disciplina { clave: string; nombre: string; foto: string; velo: string; txt: string }
interface Bloque { id: string; disciplina: string; texto: string }
interface Borrador { asunto: string; titulo: string; bloques: Bloque[] }

const TQ = "#004f4f";
const ORO = "#b08d3f";
const MARMOL = "url('/img/fondos/marmolfondo.webp')";

const nuevoId = () => Math.random().toString(36).slice(2, 9);
const bloqueVacio = (disciplina = "metodo"): Bloque => ({ id: nuevoId(), disciplina, texto: "" });
const VACIO: Borrador = { asunto: "", titulo: "", bloques: [bloqueVacio()] };

const claveBorrador = (userId: string) => `correoSesion:v2:${userId}`;

export default function AdminCorreoSesion() {
  const { verificando } = useAdminGuard();
  const { userId = "" } = useParams();

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [dest, setDest] = useState<{ nombre: string; email: string } | null>(null);
  const [b, setB] = useState<Borrador>(() => {
    try {
      const crudo = localStorage.getItem(claveBorrador(userId));
      const g = crudo ? JSON.parse(crudo) : null;
      if (g && Array.isArray(g.bloques) && g.bloques.length) return { ...VACIO, ...g };
    } catch { /* borrador corrupto: se empieza de cero */ }
    return VACIO;
  });
  const [html, setHtml] = useState("");
  const [estado, setEstado] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  useEffect(() => {
    if (verificando) return;
    axios.get(`${API_URL}/correo-sesion/opciones`, { headers: adminHeaders() })
      .then((r) => setDisciplinas(r.data?.disciplinas ?? []))
      .catch(() => { /* sin opciones no se puede elegir, pero se puede escribir */ });
    axios.get(`${API_URL}/correo-sesion/${encodeURIComponent(userId)}/destinatario`, { headers: adminHeaders() })
      .then((r) => setDest(r.data?.success ? { nombre: r.data.nombre, email: r.data.email } : null))
      .catch(() => setDest(null));
  }, [verificando, userId]);

  useEffect(() => {
    try { localStorage.setItem(claveBorrador(userId), JSON.stringify(b)); } catch { /* modo privado */ }
  }, [b, userId]);

  // La vista previa, con una pequeña espera mientras se escribe.
  const peticion = useRef(0);
  useEffect(() => {
    if (verificando) return;
    const n = ++peticion.current;
    const id = window.setTimeout(() => {
      axios.post(`${API_URL}/correo-sesion/vista`, { titulo: b.titulo, bloques: b.bloques }, { headers: adminHeaders() })
        .then((r) => { if (n === peticion.current) setHtml(r.data?.html ?? ""); })
        .catch(() => { /* se queda con la anterior */ });
    }, 350);
    return () => window.clearTimeout(id);
  }, [b.titulo, b.bloques, verificando]);

  const cambiar = (parcial: Partial<Borrador>) => { setB((x) => ({ ...x, ...parcial })); setConfirmar(false); setEstado(null); };
  const cambiarBloque = (id: string, parcial: Partial<Bloque>) =>
    cambiar({ bloques: b.bloques.map((x) => (x.id === id ? { ...x, ...parcial } : x)) });
  const quitarBloque = (id: string) => {
    const resto = b.bloques.filter((x) => x.id !== id);
    cambiar({ bloques: resto.length ? resto : [bloqueVacio()] });
  };
  const moverBloque = (id: string, d: -1 | 1) => {
    const i = b.bloques.findIndex((x) => x.id === id);
    const j = i + d;
    if (i < 0 || j < 0 || j >= b.bloques.length) return;
    const copia = [...b.bloques];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    cambiar({ bloques: copia });
  };
  const añadirBloque = () => cambiar({ bloques: [...b.bloques, bloqueVacio(b.bloques[b.bloques.length - 1]?.disciplina)] });

  const enviar = async (prueba: boolean) => {
    if (enviando) return;
    setEnviando(true);
    setEstado(null);
    try {
      const { data } = await axios.post(
        `${API_URL}/correo-sesion/${encodeURIComponent(userId)}/enviar`,
        { asunto: b.asunto, titulo: b.titulo, bloques: b.bloques, prueba },
        { headers: adminHeaders() },
      );
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

  const hayTexto = !!b.titulo.trim() || b.bloques.some((x) => x.texto.trim());
  const puede = !!b.asunto.trim() && hayTexto && !enviando;

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
  const botonMini = (texto: string, onClick: () => void, off = false, label?: string) => (
    <Box as="button" type="button" onClick={onClick} disabled={off} aria-label={label ?? texto}
         w="30px" h="30px" borderRadius="full" display="flex" alignItems="center" justifyContent="center"
         color={TQ} fontSize="sm" border={`1px solid ${TQ}55`} opacity={off ? 0.35 : 1}
         cursor={off ? "default" : "pointer"} _hover={off ? undefined : { bg: `${TQ}14` }} _focusVisible={focoBlanco}>
      {texto}
    </Box>
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
                  {etiqueta("Primera línea")}
                  <Input {...campo} value={b.titulo} onChange={(e) => cambiar({ titulo: e.target.value })} fontSize="lg" fontWeight={700} />
                </Box>

                {b.bloques.map((bl, i) => {
                  const d = disciplinas.find((x) => x.clave === bl.disciplina);
                  return (
                    <Box key={bl.id} borderRadius="xl" p={4} border={`1px solid ${d ? d.velo : `${TQ}44`}`}
                         bg="rgba(255,255,255,0.35)" boxShadow={d ? `0 0 12px ${d.velo}55` : "none"}>
                      <Flex justify="space-between" align="center" gap={3} mb={3} wrap="wrap">
                        <Text color={TQ} fontSize="xs" fontWeight={700} letterSpacing="0.1em" textTransform="uppercase">
                          Bloque {i + 1}
                        </Text>
                        <Flex gap={1.5}>
                          {botonMini("↑", () => moverBloque(bl.id, -1), i === 0, "Subir bloque")}
                          {botonMini("↓", () => moverBloque(bl.id, 1), i === b.bloques.length - 1, "Bajar bloque")}
                          {botonMini("✕", () => quitarBloque(bl.id), false, "Quitar bloque")}
                        </Flex>
                      </Flex>

                      <Flex gap={2} wrap="wrap" mb={3}>
                        <Box as="button" type="button" onClick={() => cambiarBloque(bl.id, { disciplina: "" })} aria-pressed={bl.disciplina === ""}
                             px={3} py={1} borderRadius="full" fontSize="xs" fontWeight={700} color={TQ}
                             border={`2px solid ${bl.disciplina === "" ? TQ : `${TQ}44`}`} bg="rgba(255,255,255,0.5)"
                             _focusVisible={focoBlanco}>
                          Sin fondo
                        </Box>
                        {disciplinas.map((x) => {
                          const sel = bl.disciplina === x.clave;
                          return (
                            <Box key={x.clave} as="button" type="button" onClick={() => cambiarBloque(bl.id, { disciplina: x.clave })} aria-pressed={sel}
                                 px={3} py={1} borderRadius="full" fontSize="xs" fontWeight={700} color={x.txt}
                                 bg={x.velo} bgImage={`url('${x.foto}')`} bgSize="cover" bgPosition="center"
                                 border={`2px solid ${sel ? TQ : "transparent"}`} boxShadow={sel ? `0 0 10px ${ORO}88` : "none"}
                                 opacity={sel ? 1 : 0.85} _hover={{ opacity: 1 }} _focusVisible={focoBlanco}>
                              {x.nombre}
                            </Box>
                          );
                        })}
                      </Flex>

                      <Textarea {...campo} value={bl.texto} onChange={(e) => cambiarBloque(bl.id, { texto: e.target.value })}
                                minH="170px" fontSize="lg" lineHeight="1.7" resize="vertical" />
                    </Box>
                  );
                })}

                <Box as="button" type="button" onClick={añadirBloque} alignSelf="flex-start"
                     px={5} py={2} borderRadius="full" border={`1.5px solid ${TQ}`} color={TQ} fontWeight={700} fontSize="md"
                     _hover={{ bg: `${TQ}14` }} _focusVisible={focoBlanco}>
                  + Añadir bloque
                </Box>
                <Text color={`${TQ}aa`} fontSize="xs" fontStyle="italic" mt={-2}>
                  **negrita** · *cursiva* · una línea en blanco separa párrafos · --- entre dos párrafos pone una raya
                </Text>
              </Flex>
            </Box>

            {/* ── La vista previa y el envío ── */}
            <Box flex="1" minW={0} w="100%" position={{ lg: "sticky" }} top={{ lg: "16px" }}>
              <Box borderRadius="2xl" overflow="hidden" bg="#e9ecec" border="1px solid rgba(255,255,255,0.65)"
                   boxShadow="0 0 30px rgba(255,255,255,0.28), 0 0 70px rgba(180,255,245,0.14)">
                <Box as="iframe" title="Vista previa del correo" w="100%" h={{ base: "560px", lg: "700px" }} border="none" bg="#e9ecec"
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
