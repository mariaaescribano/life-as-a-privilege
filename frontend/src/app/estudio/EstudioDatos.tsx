import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Input, Select, Text } from "@chakra-ui/react";
import { EstudioLayout } from "../../components/estudio/EstudioLayout";
import { SpaceBg, SPACE_IMG } from "../../components/metodo/SpaceBg";
import { Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { useImagesReady } from "../../hooks/useImagesReady";
import { LifeLoading } from "../../components/global/LifeLoading";
import { AstrologiaIcon, astrologiaTxt } from "../../GlobalVariables";
import {
  getEstudioId,
  getParticipante,
  guardarParticipante,
  mensajeError,
} from "../../data/estudioApi";

/** Sede del Ministerio de Justicia: certificado (literal) de nacimiento. */
const CERTIFICADO_URL = "https://sede.mjusticia.gob.es/tramites/certificado-nacimiento";

const MESES = [
  { num: "01", nombre: "Enero" },    { num: "02", nombre: "Febrero" },
  { num: "03", nombre: "Marzo" },    { num: "04", nombre: "Abril" },
  { num: "05", nombre: "Mayo" },     { num: "06", nombre: "Junio" },
  { num: "07", nombre: "Julio" },    { num: "08", nombre: "Agosto" },
  { num: "09", nombre: "Septiembre" },{ num: "10", nombre: "Octubre" },
  { num: "11", nombre: "Noviembre" },{ num: "12", nombre: "Diciembre" },
];

/* Estilo común de todos los campos: caja oscura sobre el cielo.
   En ordenador los campos crecen (size lg + letra más grande): hay sitio de
   sobra y así no se leen como un formulario de móvil estirado. */
const campoSx = {
  bg: "rgba(8,13,30,0.55)",
  border: `1px solid ${astrologiaTxt}44`,
  color: astrologiaTxt,
  borderRadius: "lg",
  size: { base: "md", lg: "lg" },
  fontSize: { base: "md", lg: "xl" },
  fontFamily: "'EB Garamond', serif",
  _placeholder: { color: `${astrologiaTxt}55` },
  _hover: { borderColor: `${astrologiaTxt}88` },
  _focus: {
    borderColor: astrologiaTxt,
    boxShadow: `0 0 0 1px ${astrologiaTxt}55, 0 0 14px ${astrologiaTxt}33`,
    bg: "rgba(8,13,30,0.7)",
  },
};

const Etiqueta = ({ children }: { children: React.ReactNode }) => (
  <Text color={`${astrologiaTxt}aa`} fontSize={{ base: "xs", lg: "sm" }} letterSpacing="0.14em"
        mb={{ base: 1.5, lg: 2 }} fontWeight="600" textTransform="uppercase">
    {children}
  </Text>
);

const Campo = ({
  label, value, onChange, placeholder, type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <Box flex="1">
    <Etiqueta>{label}</Etiqueta>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      {...campoSx}
    />
  </Box>
);

/** ¿El país escrito es España? (con y sin tilde, con mayúsculas o sin ellas) */
const esEspana = (pais: string) =>
  /^\s*espa(ñ|n)a\s*$/i.test(pais) || /^\s*spain\s*$/i.test(pais);

export default function EstudioDatos() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");
  const [hora, setHora] = useState("");
  const [pais, setPais] = useState("");
  const [region, setRegion] = useState("");
  const [lugar, setLugar] = useState("");

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fotosListas = useImagesReady([SPACE_IMG]);

  // Si ya participó (o se dejó los datos a medias), se le devuelve TODO escrito:
  // que no tenga que volver a teclear lo que ya dio.
  useEffect(() => {
    const id = getEstudioId();
    if (!id) { setCargando(false); return; }
    (async () => {
      try {
        const p = await getParticipante(id);
        setEmail(p.email ?? "");
        const [a, m, d] = (p.datos?.fecha_nacimiento ?? "").split("-");
        if (d) setDia(String(parseInt(d, 10)));
        if (m) setMes(m);
        if (a) setAnio(a);
        if (p.datos?.hora_nacimiento) setHora(p.datos.hora_nacimiento);
        if (p.datos?.pais) setPais(p.datos.pais);
        if (p.datos?.region) setRegion(p.datos.region);
        if (p.datos?.lugar) setLugar(p.datos.lugar);
      } catch {
        // Id viejo o borrado: se empieza de cero, sin molestar.
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const camposCompletos =
    emailValido && !!dia && !!mes && !!anio && !!hora && !!pais.trim() && !!lugar.trim();

  const continuar = async () => {
    if (!emailValido) {
      setError("Necesito un email válido para poder guardar tus respuestas.");
      return;
    }
    if (!camposCompletos) {
      setError("Faltan datos: sin la fecha, la hora y el lugar no se puede calcular tu carta.");
      return;
    }
    setError(null);
    setEnviando(true);
    try {
      const fecha = `${anio.padStart(4, "0")}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
      await guardarParticipante({
        email: email.trim().toLowerCase(),
        fecha_nacimiento: fecha,
        hora_nacimiento: hora.slice(0, 5),
        pais: pais.trim(),
        region: region.trim(),
        lugar: lugar.trim(),
        userId: localStorage.getItem("userId"),
      });
      navigate("/estudio/preguntas");
    } catch (err) {
      setError(mensajeError(err, "No se han podido guardar tus datos. Inténtalo de nuevo."));
    } finally {
      setEnviando(false);
    }
  };

  if (cargando || !fotosListas) return <LifeLoading />;

  return (
    <EstudioLayout>
      <Flex direction="column" align="center" w="100%" maxW={{ base: "760px", lg: "1000px" }}
            gap={{ base: 6, md: 8, lg: 10 }}>
        {/* ── Cabecera ── */}
        <Reveal direction="down" distance={16} duration={0.7}>
          <Flex direction="column" align="center" gap={{ base: 3, lg: 4 }} textAlign="center">
            <AstrologiaIcon size={{ base: "38px", md: "48px", lg: "64px" }} />
            <Text color="white" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} fontWeight="700"
                  letterSpacing="0.06em" textTransform="uppercase" lineHeight="1.15"
                  textShadow="0 0 14px rgba(255,255,255,0.55), 0 0 32px rgba(180,255,245,0.3)">
              Tus datos de nacimiento
            </Text>
            <Text color="rgba(255,255,255,0.82)" fontSize={{ base: "md", md: "lg", lg: "xl" }}
                  maxW={{ base: "600px", lg: "760px" }} lineHeight="1.75">
              Con ellos se calcula tu carta natal. Sin carta no hay estudio: es la que dice en qué
              signo tienes cada planeta, y eso es justo lo que se está midiendo.
            </Text>
          </Flex>
        </Reveal>

        {/* ── AVISO DE LA HORA ──
            Va ANTES del formulario y a propósito: la hora es el dato que más se
            falsea («creo que fue por la mañana») y el que decide el Ascendente y
            todas las casas. Con la hora mal, la mitad del estudio no vale. */}
        <Reveal direction="up" distance={18} duration={0.7} delay={0.1} w="100%">
          <Box
            position="relative"
            overflow="hidden"
            w="100%"
            borderRadius="2xl"
            border="1px solid rgba(255,220,120,0.55)"
            boxShadow="0 0 20px rgba(255,220,120,0.22), 0 0 46px rgba(255,220,120,0.1)"
          >
            <SpaceBg overlay="rgba(8,13,30,0.72)" />
            <Box position="relative" zIndex={1} px={{ base: 5, md: 8, lg: 12 }} py={{ base: 6, md: 7, lg: 10 }}>
              <Text color="#ffe08a" fontSize={{ base: "md", md: "lg", lg: "2xl" }} fontWeight="700"
                    letterSpacing="0.16em" textTransform="uppercase" mb={{ base: 3, lg: 4 }}
                    style={{ textShadow: "0 0 12px rgba(255,224,138,0.5)" }}>
                ¡Importante! La hora exacta
              </Text>
              <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md", lg: "lg" }} lineHeight="1.8">
                La hora de nacimiento es el dato más delicado de toda la carta. De ella dependen tu
                Ascendente y las doce casas: <b>media hora de diferencia puede cambiarte el Ascendente
                entero</b>. Si la pones «más o menos», la lectura no será correcta y tus respuestas
                sumarán al grupo equivocado.
              </Text>
              <Box h="1px" my={{ base: 4, lg: 6 }} bgGradient="linear(to-r, transparent, rgba(255,224,138,0.5), transparent)" />
              <Text color="#ffe08a" fontSize={{ base: "sm", md: "md", lg: "lg" }} fontWeight="700" lineHeight="1.8">
                Si naciste en España: ¡PIDE TU CERTIFICADO!
              </Text>
              <Text color="rgba(255,255,255,0.88)" fontSize={{ base: "sm", md: "md", lg: "lg" }} lineHeight="1.8" mt={2}>
                Pide el <b>certificado literal de nacimiento</b> en el Registro Civil (se solicita
                gratis y en línea) y mira la hora que figura ahí. No la de memoria, ni la que
                recuerda la familia: la del certificado. Sin esa hora, la lectura no será correcta.
              </Text>
              <Flex mt={{ base: 4, lg: 6 }}>
                <Box
                  as="a"
                  href={CERTIFICADO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  display="inline-flex"
                  alignItems="center"
                  gap={2}
                  px={{ base: 5, md: 6, lg: 8 }}
                  py={{ base: 2.5, md: 3, lg: 4 }}
                  borderRadius="full"
                  bg="rgba(255,224,138,0.14)"
                  border="1px solid rgba(255,224,138,0.75)"
                  color="#ffe08a"
                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                  fontWeight="700"
                  letterSpacing="0.06em"
                  transition="all 0.22s"
                  _hover={{ bg: "rgba(255,224,138,0.24)", boxShadow: "0 0 22px rgba(255,224,138,0.45)" }}
                >
                  Pedir mi certificado de nacimiento
                  <Box as="span" display="inline-flex" alignItems="center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7" />
                      <path d="M8 7h9v9" />
                    </svg>
                  </Box>
                </Box>
              </Flex>
              <Text color="rgba(255,255,255,0.6)" fontSize={{ base: "xs", lg: "sm" }} mt={2} fontStyle="italic">
                Sede electrónica del Ministerio de Justicia · se abre en otra pestaña
              </Text>
            </Box>
          </Box>
        </Reveal>

        {/* ── Formulario ── */}
        <Reveal direction="up" distance={18} duration={0.75} delay={0.2}
                position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 20px ${astrologiaTxt}1a`}>
          <SpaceBg overlay="rgba(8,13,30,0.68)" />

          <Box position="relative" zIndex={1} px={{ base: 6, md: 10, lg: 14 }} py={{ base: 8, md: 10, lg: 14 }}>
            <RevealStagger display="flex" flexDirection="column" gap={{ base: 5, lg: 7 }}
                           stagger={0.08} delayChildren={0.35}>
              {/* Email — sin él no se puede continuar: es lo que identifica la
                  muestra y lo que evita contar dos veces a la misma persona. Eso
                  no se le cuenta aquí: el botón de continuar ya no deja pasar y,
                  si lo intenta, el aviso de abajo se lo dice. */}
              <RevealItem>
                <Etiqueta>Tu email</Etiqueta>
                <Input
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tunombre@correo.com"
                  {...campoSx}
                />
              </RevealItem>

              <RevealItem>
                <Box h="1px" my={1} bgGradient={`linear(to-r, transparent, ${astrologiaTxt}55, transparent)`} />
              </RevealItem>

              <RevealItem>
                <Etiqueta>Fecha de nacimiento</Etiqueta>
                <Flex gap={{ base: 3, lg: 4 }}>
                  <Box flex="1">
                    <Input type="number" inputMode="numeric" min={1} max={31} value={dia}
                           onChange={(e) => setDia(e.target.value)} placeholder="Día" {...campoSx} />
                  </Box>
                  <Box flex="1.6">
                    <Select value={mes} onChange={(e) => setMes(e.target.value)} placeholder="Mes"
                            {...campoSx}
                            sx={{ "> option": { background: "#0c1230", color: astrologiaTxt } }}>
                      {MESES.map((m) => (
                        <option key={m.num} value={m.num}>{m.nombre}</option>
                      ))}
                    </Select>
                  </Box>
                  <Box flex="1">
                    <Input type="number" inputMode="numeric" min={1900} max={2100} value={anio}
                           onChange={(e) => setAnio(e.target.value)} placeholder="Año" {...campoSx} />
                  </Box>
                </Flex>
              </RevealItem>

              <RevealItem>
                <Etiqueta>Hora de nacimiento · la del certificado</Etiqueta>
                <Input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  {...campoSx}
                  sx={{ "::-webkit-calendar-picker-indicator": { filter: "invert(0.9)" } }}
                />
                <Text color="#ffe08a" fontSize={{ base: "xs", lg: "sm" }} mt={2} fontStyle="italic" lineHeight="1.6">
                  Hora local del lugar donde naciste, tal cual figura en el registro. El cambio de
                  horario de ese año ya se tiene en cuenta al calcular la carta.
                </Text>
              </RevealItem>

              <RevealItem>
                <Campo label="País" value={pais} onChange={setPais} placeholder="Ej: España" />
                {esEspana(pais) && (
                  <Text color="#ffe08a" fontSize={{ base: "sm", lg: "md" }} mt={2} lineHeight="1.7" fontWeight="600">
                    ¡Importante! Pide tu certificado literal de nacimiento y comprueba ahí la hora
                    antes de seguir:{" "}
                    <Box as="a" href={CERTIFICADO_URL} target="_blank" rel="noopener noreferrer"
                         textDecoration="underline" _hover={{ color: "white" }}>
                      sede.mjusticia.gob.es
                    </Box>
                  </Text>
                )}
              </RevealItem>

              <RevealItem display="flex" flexDirection={{ base: "column", md: "row" }} gap={{ base: 4, lg: 5 }}>
                <Campo label="Lugar (ciudad)" value={lugar} onChange={setLugar} placeholder="Ej: Madrid" />
                <Campo label="Región / provincia" value={region} onChange={setRegion} placeholder="Ej: Comunidad de Madrid" />
              </RevealItem>

              {error && (
                <Text color="#ffb8b8" fontSize={{ base: "sm", lg: "md" }} textAlign="center" fontStyle="italic">{error}</Text>
              )}

              <RevealItem display="flex" justifyContent="flex-end" mt={3}>
                <Box
                  as="button"
                  onClick={() => { if (!enviando) void continuar(); }}
                  px={{ base: 8, md: 10, lg: 14 }}
                  py={{ base: 3, md: 3.5, lg: 4 }}
                  borderRadius="full"
                  bg={camposCompletos ? `${astrologiaTxt}1f` : "transparent"}
                  color={camposCompletos ? astrologiaTxt : `${astrologiaTxt}66`}
                  border={`1px solid ${camposCompletos ? astrologiaTxt : `${astrologiaTxt}44`}`}
                  fontFamily="'EB Garamond', serif"
                  fontSize={{ base: "md", md: "lg", lg: "xl" }}
                  fontWeight="700"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                  cursor={enviando ? "wait" : "pointer"}
                  opacity={enviando ? 0.6 : 1}
                  transition="all 0.22s"
                  _hover={camposCompletos && !enviando
                    ? { bg: `${astrologiaTxt}33`, boxShadow: `0 0 18px ${astrologiaTxt}44` }
                    : {}}
                >
                  {enviando ? "Calculando tu carta…" : "Continuar →"}
                </Box>
              </RevealItem>

              {/* Se recogen datos personales (email y nacimiento): hay que decir
                  para qué y enlazar la política de privacidad en el mismo punto
                  donde se piden. Discreto, pero tiene que estar. */}
              <RevealItem>
                <Text color={`${astrologiaTxt}88`} fontSize={{ base: "xs", lg: "sm" }} textAlign="center" lineHeight="1.6">
                  Tus datos se usan solo para calcular tu carta y agrupar tus respuestas. Los
                  resultados se publican siempre en conjunto, nunca con tu nombre ni tu email.{" "}
                  <Box as="a" href="/privacidad" target="_blank" rel="noopener noreferrer"
                       textDecoration="underline" _hover={{ color: astrologiaTxt }}>
                    Política de privacidad
                  </Box>
                </Text>
              </RevealItem>
            </RevealStagger>
          </Box>
        </Reveal>

        <Reveal direction="up" distance={12} duration={0.6} delay={0.35}>
          <Box as="button" onClick={() => navigate("/estudio")}
               color="rgba(255,255,255,0.7)" fontSize={{ base: "sm", lg: "md" }} bg="transparent" border="none"
               cursor="pointer" _hover={{ color: "white" }}>
            ← Volver a la portada del estudio
          </Box>
        </Reveal>
      </Flex>
    </EstudioLayout>
  );
}
