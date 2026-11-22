import React, { useEffect, useState } from "react";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { Reveal } from "../../components/global/Reveal";
import { focoBlanco } from "../../components/global/foco";
import { LifeLoader } from "../../components/metodo/comicLoaders";
import { API_URL, FONDO_PAGINA_BEIGE as BEIGE, FONDO_PAGINA_TURQUESA as T } from "../../GlobalVariables";
import { useT, type ClaveTexto } from "../../i18n";

/**
 * /astrologia/pedir — pedir la carta de la lectura (Astrología → Adquirir), con los datos de nacimiento
 * OBLIGATORIOS, el aviso sobre la hora (y el enlace al certificado de nacimiento) y el pago en Stripe.
 *
 * Con `?session_id=` es la vuelta del pago: confirma el pedido y dice que el registro está confirmado.
 * La persona NO tiene acceso a su cuenta: cuando María termina la carta, desde /admin/lecturas se lo manda.
 */
const CERTIFICADO_URL = "https://sede.mjusticia.gob.es/tramites/certificado-nacimiento";

const SERVICIOS: Record<string, { titulo: ClaveTexto; precio: ClaveTexto }> = {
  pdf_parcial: { titulo: "astro.serv.1.titulo", precio: "astro.serv.1.precio" },
  pdf_completo: { titulo: "astro.serv.2.titulo", precio: "astro.serv.2.precio" },
  plataforma: { titulo: "astro.serv.3.titulo", precio: "astro.serv.3.precio" },
};

const campo = {
  w: "100%",
  bg: "#ffffffb3",
  border: `1px solid ${T}55`,
  borderRadius: "full",
  color: T,
  fontFamily: "'EB Garamond', serif",
  fontSize: { base: "md", md: "lg" },
  px: 5,
  py: 3,
  h: "auto",
  _placeholder: { color: `${T}8c` },
  _hover: { borderColor: `${T}aa` },
  _focus: { borderColor: T, boxShadow: "none" },
} as const;

const Etiqueta = ({ children }: { children: React.ReactNode }) => (
  <Text color={T} fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.06em" mb={1} ml={2}>
    {children}
  </Text>
);

export default function PedirLectura() {
  const t = useT();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const servicio = params.get("servicio") ?? "";
  const info = SERVICIOS[servicio];

  const [mounted, setMounted] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [lugar, setLugar] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Vuelta del pago: "cargando" | "ok" | "error"
  const [pago, setPago] = useState<"cargando" | "ok" | "error">("cargando");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    let vivo = true;
    axios
      .get(`${API_URL}/payment/lectura/verify`, { params: { session_id: sessionId } })
      .then((r) => { if (vivo) setPago(r.data?.ok ? "ok" : "error"); })
      .catch(() => { if (vivo) setPago("error"); });
    return () => { vivo = false; };
  }, [sessionId]);

  const enviar = async () => {
    if (enviando || !info) return;
    setError(null);
    if (![nombre, email, fecha, hora, lugar].every((v) => v.trim())) { setError(t("lectura.error.datos")); return; }
    if (!acepta) { setError(t("lectura.error.aviso")); return; }
    setEnviando(true);
    try {
      const r = await axios.post(`${API_URL}/payment/lectura/checkout`, {
        servicio, nombre: nombre.trim(), email: email.trim(), fecha, hora, lugar: lugar.trim(), acepta,
      });
      if (r.data?.url) { window.location.href = r.data.url; return; }
      setError(t("lectura.error.generico"));
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      setError(status === 400 ? t("lectura.error.datos") : t("lectura.error.generico"));
    }
    setEnviando(false);
  };

  const cabecera = (titulo: string, subtitulo?: string) => (
    <WelcomeCabecera activo={mounted} titulo={titulo} subtitulo={subtitulo} sinFrase={!subtitulo} mayusculas sinSeparador />
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={BEIGE} fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />
      <Box flex="1" pb={{ base: 16, md: 24 }}>
        {/* ── VUELTA DEL PAGO ── */}
        {sessionId ? (
          <>
            {cabecera(pago === "ok" ? t("lectura.confirmado") : t("lectura.titulo"))}
            <Flex justify="center" px={6} pt={{ base: 10, md: 14 }} textAlign="center">
              {pago === "cargando" ? (
                <Flex direction="column" align="center" gap={4}>
                  <LifeLoader />
                  <Text color={T} fontSize={{ base: "md", md: "lg" }}>{t("lectura.confirmando")}</Text>
                </Flex>
              ) : (
                <Text color={T} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.75" maxW="560px">
                  {pago === "ok" ? t("lectura.confirmadoTexto") : t("lectura.confirmadoError")}
                </Text>
              )}
            </Flex>
          </>
        ) : !info ? (
          // Sin servicio válido en la dirección: no hay nada que pedir.
          cabecera(t("lectura.titulo"))
        ) : (
          <>
            {cabecera(t("lectura.titulo"), `${t(info.titulo)} · ${t(info.precio)}`)}

            <Flex direction="column" gap={{ base: 5, md: 6 }} maxW="560px" mx="auto" px={{ base: 5, md: 0 }} pt={{ base: 10, md: 14 }}>
              <Reveal activo={mounted} direction="up" distance={20} duration={0.9} delay={0.2}>
                <Flex direction="column" gap={4}>
                  <Text color={T} fontStyle="italic" textAlign="center" fontSize={{ base: "md", md: "lg" }}>
                    {t("lectura.todoObligatorio")}
                  </Text>
                  <Box><Etiqueta>{t("lectura.nombre")}</Etiqueta><Input {...campo} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" maxLength={120} /></Box>
                  <Box><Etiqueta>{t("lectura.email")}</Etiqueta><Input {...campo} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></Box>
                  <Flex gap={4} direction={{ base: "column", md: "row" }}>
                    <Box flex="1"><Etiqueta>{t("lectura.fecha")}</Etiqueta><Input {...campo} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} max={new Date().toISOString().slice(0, 10)} /></Box>
                    <Box flex="1"><Etiqueta>{t("lectura.hora")}</Etiqueta><Input {...campo} type="time" value={hora} onChange={(e) => setHora(e.target.value)} /></Box>
                  </Flex>
                  <Box><Etiqueta>{t("lectura.lugar")}</Etiqueta><Input {...campo} value={lugar} onChange={(e) => setLugar(e.target.value)} maxLength={160} /></Box>
                </Flex>
              </Reveal>

              {/* El aviso sobre la hora, el certificado y la responsabilidad */}
              <Reveal activo={mounted} direction="up" distance={20} duration={0.9} delay={0.35}>
                <Box border={`1.5px solid ${T}55`} borderRadius="2xl" px={{ base: 5, md: 7 }} py={{ base: 6, md: 7 }} color={T}>
                  <Text fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">{t("lectura.horaAviso")}</Text>
                  <Box h="1px" my={4} bg={`${T}40`} />
                  <Text fontWeight="700" fontSize={{ base: "md", md: "lg" }}>{t("lectura.certificadoTitulo")}</Text>
                  <Text fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" mt={2}>{t("lectura.certificadoTexto")}</Text>
                  <Box
                    as="a"
                    href={CERTIFICADO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    display="inline-block"
                    mt={4}
                    px={6}
                    py="10px"
                    borderRadius="full"
                    border={`1.5px solid ${T}`}
                    color={T}
                    fontWeight="700"
                    fontSize={{ base: "sm", md: "md" }}
                    letterSpacing="0.06em"
                    textDecoration="none"
                    transition="background 0.25s ease"
                    _hover={{ bg: `${T}14`, textDecoration: "none" }}
                    _focusVisible={focoBlanco}
                  >
                    {t("lectura.certificadoBoton")}
                  </Box>
                  <Box h="1px" my={4} bg={`${T}40`} />
                  <Text fontSize={{ base: "md", md: "lg" }} lineHeight="1.7" fontStyle="italic">{t("lectura.responsabilidad")}</Text>
                  <Flex as="label" align="center" gap={3} mt={4} cursor="pointer" fontWeight="600">
                    <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} style={{ width: 18, height: 18, accentColor: T }} />
                    <Text as="span" fontSize={{ base: "md", md: "lg" }}>{t("lectura.acepto")}</Text>
                  </Flex>
                </Box>
              </Reveal>

              {params.get("cancelado") && (
                <Text color={T} fontStyle="italic" textAlign="center">{t("lectura.cancelado")}</Text>
              )}
              {error && <Text color="#b3261e" textAlign="center" fontWeight="600">{error}</Text>}

              <Flex justify="center">
                <Box
                  as="button"
                  type="button"
                  onClick={enviar}
                  disabled={enviando}
                  px={{ base: 9, md: 12 }}
                  py="14px"
                  borderRadius="full"
                  bg={T}
                  color={BEIGE}
                  fontWeight="700"
                  fontSize={{ base: "md", md: "lg" }}
                  letterSpacing="0.14em"
                  textTransform="uppercase"
                  cursor={enviando ? "not-allowed" : "pointer"}
                  opacity={enviando ? 0.6 : 1}
                  transition="transform 0.25s ease, opacity 0.25s ease"
                  _hover={enviando ? {} : { transform: "translateY(-2px)", opacity: 0.92 }}
                  _focusVisible={focoBlanco}
                >
                  {enviando ? t("lectura.enviando") : t("lectura.pagar")}
                </Box>
              </Flex>
            </Flex>
          </>
        )}
      </Box>
      <SiteFooter />
    </Box>
  );
}
