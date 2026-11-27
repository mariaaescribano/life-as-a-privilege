import React, { useEffect, useState } from "react";
import { Box, Flex, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import TrasCabecera from "../../components/global/TrasCabecera";
import SiteFooter from "../../components/global/Footer";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { Reveal } from "../../components/global/Reveal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { focoBlanco } from "../../components/global/foco";
import { API_URL, FONDO_PAGINA_BEIGE as BEIGE, astrologiaNom } from "../../GlobalVariables";
import { useT } from "../../i18n";
import { mascaraDMA, dmaAIso } from "../../utils/fechas";

/**
 * /astrologia/carta-gratis — pedir la carta astral gratis (el botón de la página de Astrología). Un box con el cielo
 * estrellado de Astrología donde se rellenan nombre, email, fecha y hora de nacimiento y país, región y ciudad; el aviso
 * de que la hora es importante, el broma de la madre y, solo si naciste en España, el enlace al certificado de
 * nacimiento. Al enviar, el servidor manda a María (NOTIFY_EMAIL) un correo con todos los datos (POST /carta-gratis).
 */
const CERTIFICADO_URL = "https://sede.mjusticia.gob.es/tramites/certificado-nacimiento";

const campo = {
  w: "100%",
  bg: "rgba(240,220,192,0.10)",
  border: `1.5px solid ${BEIGE}80`,
  borderRadius: "full",
  color: BEIGE,
  fontFamily: "'EB Garamond', serif",
  fontSize: { base: "md", md: "lg" },
  px: 5,
  py: 3,
  h: "auto",
  _placeholder: { color: `${BEIGE}8c` },
  _hover: { borderColor: `${BEIGE}cc` },
  _focus: { borderColor: BEIGE, bg: "rgba(240,220,192,0.16)", boxShadow: "none", outline: "none" },
  // El selector de hora del navegador en claro, para que no salga negro sobre el cielo oscuro.
  sx: { colorScheme: "dark" },
} as const;

const Etiqueta = ({ children }: { children: React.ReactNode }) => (
  <Text fontWeight="700" fontSize={{ base: "sm", md: "md" }} letterSpacing="0.06em" mb={1} ml={2}>
    {children}
  </Text>
);

const esEspana = (pais: string) => /^\s*(espa(ñ|n)a|spain|españa)\s*$/i.test(pais.trim());

export default function CartaGratis() {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [pais, setPais] = useState("");
  const [region, setRegion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [consiente, setConsiente] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  const enviar = async () => {
    if (enviando) return;
    setError(null);
    const fechaIso = dmaAIso(fecha);
    if (![nombre, email, fecha, hora, pais, region, ciudad].every((v) => v.trim()) || !fechaIso) { setError(t("lectura.error.datos")); return; }
    if (!consiente) { setError(t("lectura.error.consentimiento")); return; }
    setEnviando(true);
    try {
      await axios.post(`${API_URL}/carta-gratis`, {
        nombre: nombre.trim(), email: email.trim(), fecha: fechaIso, hora,
        pais: pais.trim(), region: region.trim(), ciudad: ciudad.trim(), consentimiento: consiente,
      });
      setEnviado(true);
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      setError(status === 400 ? t("lectura.error.datos") : t("cartaGratis.error"));
    }
    setEnviando(false);
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#F0DCC0" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />
      <Box flex="1" pb={{ base: 16, md: 24 }}>
        <WelcomeCabecera
          activo={mounted}
          titulo={enviado ? t("cartaGratis.enviado") : t("cartaGratis.titulo")}
          subtitulo={enviado ? undefined : t("cartaGratis.subtitulo")}
          sinFrase={enviado}
          mayusculas
          sinSeparador
        />

        <TrasCabecera>
          <Flex direction="column" maxW="720px" mx="auto" px={{ base: 5, md: 0 }} pt={{ base: 8, md: 12 }}>
            <Reveal activo={mounted} direction="up" distance={24} scaleFrom={0.98} duration={1} delay={0.2}>
              {/* El box elegante, con el cielo estrellado de Astrología de fondo y la letra en beige. */}
              <Box position="relative" overflow="hidden" borderRadius="3xl" border={`1.5px solid ${BEIGE}80`} bg="#0b1026" color={BEIGE}>
                <DisciplinaBgLayer nom={astrologiaNom} borderRadius="3xl" />
                <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 7, md: 10 }}>
                  {enviado ? (
                    <Text textAlign="center" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.75" py={{ base: 6, md: 10 }}>
                      {t("cartaGratis.enviadoTexto")}
                    </Text>
                  ) : (
                    <Flex direction="column" gap={{ base: 4, md: 5 }}>
                      <Flex gap={{ base: 4, md: 5 }} direction={{ base: "column", md: "row" }}>
                        <Box flex="1"><Etiqueta>{t("lectura.nombre")}</Etiqueta><Input {...campo} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" maxLength={120} /></Box>
                        <Box flex="1"><Etiqueta>{t("lectura.email")}</Etiqueta><Input {...campo} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></Box>
                      </Flex>
                      <Flex gap={{ base: 4, md: 5 }} direction={{ base: "column", md: "row" }}>
                        <Box flex="1"><Etiqueta>{t("lectura.fecha")}</Etiqueta><Input {...campo} inputMode="numeric" placeholder="dd/mm/aaaa" maxLength={10} autoComplete="bday" value={fecha} onChange={(e) => setFecha(mascaraDMA(e.target.value))} /></Box>
                        <Box flex="1"><Etiqueta>{t("lectura.hora")}</Etiqueta><Input {...campo} type="time" value={hora} onChange={(e) => setHora(e.target.value)} /></Box>
                      </Flex>
                      <Flex gap={{ base: 4, md: 4 }} direction={{ base: "column", md: "row" }}>
                        <Box flex="1"><Etiqueta>{t("lectura.pais")}</Etiqueta><Input {...campo} value={pais} onChange={(e) => setPais(e.target.value)} autoComplete="country-name" maxLength={60} /></Box>
                        <Box flex="1"><Etiqueta>{t("lectura.region")}</Etiqueta><Input {...campo} value={region} onChange={(e) => setRegion(e.target.value)} autoComplete="address-level1" maxLength={60} /></Box>
                        <Box flex="1"><Etiqueta>{t("lectura.ciudad")}</Etiqueta><Input {...campo} value={ciudad} onChange={(e) => setCiudad(e.target.value)} autoComplete="address-level2" maxLength={60} /></Box>
                      </Flex>

                      {/* La hora es lo importante; la broma de la madre; y, si naciste en España, el certificado. */}
                      <Box borderTop={`1px solid ${BEIGE}55`} pt={{ base: 4, md: 5 }}>
                        <Text fontSize={{ base: "md", md: "lg" }} lineHeight="1.7">{t("lectura.horaAviso")}</Text>
                        <Text fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" fontStyle="italic" mt={3} opacity={0.9}>{t("cartaGratis.chiste")}</Text>
                        {esEspana(pais) && (
                          <Box mt={5}>
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
                              border={`1.5px solid ${BEIGE}`}
                              color={BEIGE}
                              fontWeight="700"
                              fontSize={{ base: "sm", md: "md" }}
                              letterSpacing="0.06em"
                              textDecoration="none"
                              transition="background 0.25s ease"
                              _hover={{ bg: `${BEIGE}1f`, textDecoration: "none" }}
                              _focusVisible={focoBlanco}
                            >
                              {t("lectura.certificadoBoton")}
                            </Box>
                          </Box>
                        )}
                      </Box>

                      <Flex as="label" align="flex-start" gap={3} cursor="pointer" fontWeight="600">
                        <input type="checkbox" checked={consiente} onChange={(e) => setConsiente(e.target.checked)} style={{ width: 18, height: 18, marginTop: 4, accentColor: BEIGE, flexShrink: 0 }} />
                        <Text as="span" fontSize={{ base: "sm", md: "md" }} lineHeight="1.55">{t("lectura.consentimiento")}</Text>
                      </Flex>

                      {error && <Text color="#ffb4a8" textAlign="center" fontWeight="600">{error}</Text>}

                      <Flex justify="center" pt={2}>
                        <Box
                          as="button"
                          type="button"
                          onClick={enviar}
                          disabled={enviando}
                          px={{ base: 10, md: 14 }}
                          py="14px"
                          borderRadius="full"
                          border={`1.5px solid ${BEIGE}`}
                          bg={BEIGE}
                          color="#0b1026"
                          fontWeight="700"
                          fontSize={{ base: "md", md: "lg" }}
                          letterSpacing="0.16em"
                          textTransform="uppercase"
                          cursor={enviando ? "not-allowed" : "pointer"}
                          opacity={enviando ? 0.6 : 1}
                          transition="transform 0.25s ease, opacity 0.25s ease"
                          _hover={enviando ? {} : { transform: "translateY(-2px)", opacity: 0.92 }}
                          _focusVisible={focoBlanco}
                        >
                          {enviando ? t("lectura.enviando") : t("cartaGratis.enviar")}
                        </Box>
                      </Flex>
                    </Flex>
                  )}
                </Box>
              </Box>
            </Reveal>
          </Flex>
        </TrasCabecera>
      </Box>
      <TrasCabecera><SiteFooter /></TrasCabecera>
    </Box>
  );
}
